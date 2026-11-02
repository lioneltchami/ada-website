-- Local proposal only. Do not apply until the outbox release is reviewed.
-- Adds durable, leased delivery jobs and reservation of follow-up digest rows.

create table public.donation_email_outbox (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations(id) on delete restrict,
  kind text not null check (kind in ('donor_receipt', 'staff_follow_up', 'follow_up_digest')),
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 256),
  email_payload jsonb not null,
  payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'needs_review')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  available_at timestamptz not null default now(),
  first_attempt_at timestamptz,
  last_attempt_at timestamptz,
  lease_token uuid,
  lease_expires_at timestamptz,
  provider_message_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (kind = 'follow_up_digest' and donation_id is null)
    or (kind <> 'follow_up_digest' and donation_id is not null)
  ),
  check (
    (status = 'processing' and lease_token is not null and lease_expires_at is not null)
    or (status <> 'processing' and lease_token is null and lease_expires_at is null)
  ),
  check ((status = 'sent') = (sent_at is not null))
);

create table public.donation_email_outbox_donations (
  outbox_id uuid not null references public.donation_email_outbox(id) on delete restrict,
  donation_id uuid not null references public.donations(id) on delete restrict,
  primary key (outbox_id, donation_id)
);

alter table public.donations
  add column follow_up_reminder_outbox_id uuid
  references public.donation_email_outbox(id) on delete restrict;

create index donation_email_outbox_pending_idx
  on public.donation_email_outbox (available_at, created_at)
  where status = 'pending';
create index donation_email_outbox_expired_lease_idx
  on public.donation_email_outbox (lease_expires_at)
  where status = 'processing';
create index donation_email_outbox_donation_idx
  on public.donation_email_outbox_donations (donation_id);

alter table public.donation_email_outbox enable row level security;
alter table public.donation_email_outbox_donations enable row level security;
revoke all privileges on table public.donation_email_outbox from public, anon, authenticated;
revoke all privileges on table public.donation_email_outbox_donations from public, anon, authenticated;
grant select, insert, update, delete on table public.donation_email_outbox to service_role;
grant select, insert, update, delete on table public.donation_email_outbox_donations to service_role;

create or replace function public.persist_donation_email_outbox(
  p_donation jsonb,
  p_receipt_payload jsonb,
  p_receipt_sha256 text,
  p_staff_payload jsonb,
  p_staff_sha256 text
)
returns table (donation_id uuid, receipt_outbox_id uuid, staff_outbox_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_donation_id uuid;
  v_receipt_sent_at timestamptz;
  v_staff_sent_at timestamptz;
  v_receipt_id uuid;
  v_staff_id uuid;
  v_saved_sha256 text;
  v_invoice_id text := nullif(p_donation ->> 'stripe_invoice_id', '');
  v_payment_intent_id text := nullif(p_donation ->> 'stripe_payment_intent_id', '');
begin
  if v_invoice_id is not null then
    insert into public.donations (
      stripe_payment_intent_id, stripe_invoice_id, stripe_subscription_id,
      amount_cents, currency, frequency, locale, donor_email, donor_name,
      is_anonymous, project_slug, paid_at, receipt_id, thank_you_sent_at,
      staff_follow_up_sent_at, follow_up_due_at, follow_up_reminder_sent_at,
      follow_up_status
    )
    select d.stripe_payment_intent_id, d.stripe_invoice_id, d.stripe_subscription_id,
      d.amount_cents, d.currency, d.frequency, d.locale, d.donor_email, d.donor_name,
      d.is_anonymous, d.project_slug, d.paid_at, d.receipt_id, d.thank_you_sent_at,
      d.staff_follow_up_sent_at, d.follow_up_due_at, d.follow_up_reminder_sent_at,
      d.follow_up_status
    from jsonb_populate_record(null::public.donations, p_donation) as d
    on conflict (stripe_invoice_id) do update set
      stripe_payment_intent_id = excluded.stripe_payment_intent_id,
      stripe_subscription_id = excluded.stripe_subscription_id,
      amount_cents = excluded.amount_cents,
      currency = excluded.currency,
      frequency = excluded.frequency,
      locale = excluded.locale,
      donor_email = excluded.donor_email,
      donor_name = excluded.donor_name,
      is_anonymous = excluded.is_anonymous,
      project_slug = excluded.project_slug,
      paid_at = excluded.paid_at,
      receipt_id = coalesce(public.donations.receipt_id, excluded.receipt_id),
      thank_you_sent_at = coalesce(public.donations.thank_you_sent_at, excluded.thank_you_sent_at),
      staff_follow_up_sent_at = coalesce(public.donations.staff_follow_up_sent_at, excluded.staff_follow_up_sent_at),
      follow_up_due_at = coalesce(public.donations.follow_up_due_at, excluded.follow_up_due_at),
      follow_up_reminder_sent_at = coalesce(public.donations.follow_up_reminder_sent_at, excluded.follow_up_reminder_sent_at),
      follow_up_status = coalesce(public.donations.follow_up_status, excluded.follow_up_status)
    returning id, thank_you_sent_at, staff_follow_up_sent_at
      into v_donation_id, v_receipt_sent_at, v_staff_sent_at;
  elsif v_payment_intent_id is not null then
    insert into public.donations (
      stripe_payment_intent_id, stripe_invoice_id, stripe_subscription_id,
      amount_cents, currency, frequency, locale, donor_email, donor_name,
      is_anonymous, project_slug, paid_at, receipt_id, thank_you_sent_at,
      staff_follow_up_sent_at, follow_up_due_at, follow_up_reminder_sent_at,
      follow_up_status
    )
    select d.stripe_payment_intent_id, d.stripe_invoice_id, d.stripe_subscription_id,
      d.amount_cents, d.currency, d.frequency, d.locale, d.donor_email, d.donor_name,
      d.is_anonymous, d.project_slug, d.paid_at, d.receipt_id, d.thank_you_sent_at,
      d.staff_follow_up_sent_at, d.follow_up_due_at, d.follow_up_reminder_sent_at,
      d.follow_up_status
    from jsonb_populate_record(null::public.donations, p_donation) as d
    on conflict (stripe_payment_intent_id) do update set
      stripe_invoice_id = excluded.stripe_invoice_id,
      stripe_subscription_id = excluded.stripe_subscription_id,
      amount_cents = excluded.amount_cents,
      currency = excluded.currency,
      frequency = excluded.frequency,
      locale = excluded.locale,
      donor_email = excluded.donor_email,
      donor_name = excluded.donor_name,
      is_anonymous = excluded.is_anonymous,
      project_slug = excluded.project_slug,
      paid_at = excluded.paid_at,
      receipt_id = coalesce(public.donations.receipt_id, excluded.receipt_id),
      thank_you_sent_at = coalesce(public.donations.thank_you_sent_at, excluded.thank_you_sent_at),
      staff_follow_up_sent_at = coalesce(public.donations.staff_follow_up_sent_at, excluded.staff_follow_up_sent_at),
      follow_up_due_at = coalesce(public.donations.follow_up_due_at, excluded.follow_up_due_at),
      follow_up_reminder_sent_at = coalesce(public.donations.follow_up_reminder_sent_at, excluded.follow_up_reminder_sent_at),
      follow_up_status = coalesce(public.donations.follow_up_status, excluded.follow_up_status)
    returning id, thank_you_sent_at, staff_follow_up_sent_at
      into v_donation_id, v_receipt_sent_at, v_staff_sent_at;
  else
    raise exception 'Donation requires a Stripe invoice or payment-intent reference';
  end if;

  if v_receipt_sent_at is null or not exists (
    select 1 from public.donation_email_outbox q
     where q.idempotency_key = 'ada:v1:donation:' || v_donation_id::text || ':receipt'
  ) then
    insert into public.donation_email_outbox
      (donation_id, kind, idempotency_key, email_payload, payload_sha256, status, last_error)
    values (
      v_donation_id, 'donor_receipt',
      'ada:v1:donation:' || v_donation_id::text || ':receipt',
      case when v_receipt_sent_at is null then p_receipt_payload else '{}'::jsonb end,
      p_receipt_sha256,
      case when v_receipt_sent_at is null then 'pending' else 'needs_review' end,
      case when v_receipt_sent_at is null then null
        else 'Legacy receipt marker is ambiguous; confirm delivery before retrying' end
    ) on conflict (idempotency_key) do nothing
    returning id into v_receipt_id;
  end if;
  if v_receipt_id is null then
    select id, payload_sha256 into v_receipt_id, v_saved_sha256
      from public.donation_email_outbox
     where idempotency_key = 'ada:v1:donation:' || v_donation_id::text || ':receipt';
    if v_saved_sha256 <> p_receipt_sha256 then
      update public.donation_email_outbox
         set status = case when status = 'sent' then status else 'needs_review' end,
             lease_token = case when status = 'sent' then lease_token else null end,
             lease_expires_at = case when status = 'sent' then lease_expires_at else null end,
             email_payload = '{}'::jsonb,
             last_error = case when status = 'sent'
               then 'Receipt payload changed under an existing idempotency key after send'
               else 'Receipt payload changed under an existing idempotency key' end,
             updated_at = now()
       where id = v_receipt_id;
    end if;
  end if;
  if v_receipt_id is not null then
    insert into public.donation_email_outbox_donations (outbox_id, donation_id)
      values (v_receipt_id, v_donation_id) on conflict do nothing;
  end if;

  if v_staff_sent_at is null or not exists (
    select 1 from public.donation_email_outbox q
     where q.idempotency_key = 'ada:v1:donation:' || v_donation_id::text || ':staff-follow-up'
  ) then
    insert into public.donation_email_outbox
      (donation_id, kind, idempotency_key, email_payload, payload_sha256, status, last_error)
    values (
      v_donation_id, 'staff_follow_up',
      'ada:v1:donation:' || v_donation_id::text || ':staff-follow-up',
      case when v_staff_sent_at is null then p_staff_payload else '{}'::jsonb end,
      p_staff_sha256,
      case when v_staff_sent_at is null then 'pending' else 'needs_review' end,
      case when v_staff_sent_at is null then null
        else 'Legacy staff notification marker is ambiguous; confirm delivery before retrying' end
    ) on conflict (idempotency_key) do nothing
    returning id into v_staff_id;
  end if;
  if v_staff_id is null then
    select id, payload_sha256 into v_staff_id, v_saved_sha256
      from public.donation_email_outbox
     where idempotency_key = 'ada:v1:donation:' || v_donation_id::text || ':staff-follow-up';
    if v_saved_sha256 <> p_staff_sha256 then
      update public.donation_email_outbox
         set status = case when status = 'sent' then status else 'needs_review' end,
             lease_token = case when status = 'sent' then lease_token else null end,
             lease_expires_at = case when status = 'sent' then lease_expires_at else null end,
             email_payload = '{}'::jsonb,
             last_error = case when status = 'sent'
               then 'Staff payload changed under an existing idempotency key after send'
               else 'Staff notification payload changed under an existing idempotency key' end,
             updated_at = now()
       where id = v_staff_id;
    end if;
  end if;
  if v_staff_id is not null then
    insert into public.donation_email_outbox_donations (outbox_id, donation_id)
      values (v_staff_id, v_donation_id) on conflict do nothing;
  end if;

  return query select v_donation_id, v_receipt_id, v_staff_id;
end;
$$;

create or replace function public.enqueue_follow_up_digest(
  p_donation_ids uuid[],
  p_email_payload jsonb,
  p_payload_sha256 text,
  p_now timestamptz default now()
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_sorted_ids uuid[];
  v_key text;
  v_outbox_id uuid;
  v_saved_sha256 text;
  v_locked_count integer;
  v_requested_count integer;
begin
  select array_agg(distinct x order by x) into v_sorted_ids
    from unnest(p_donation_ids) x;
  v_requested_count := coalesce(cardinality(v_sorted_ids), 0);
  if v_requested_count = 0 then return null; end if;

  v_key := 'ada:v1:follow-up-digest:'
    || to_char(date_trunc('week', p_now), 'IYYY-IW') || ':'
    || md5(array_to_string(v_sorted_ids, ','));
  select id into v_outbox_id from public.donation_email_outbox where idempotency_key = v_key;

  perform d.id
    from public.donations d
   where d.id = any(v_sorted_ids)
     and d.follow_up_status = 'pending_30_day_update'
     and d.follow_up_due_at <= p_now
     and (d.follow_up_reminder_sent_at is null
       or d.follow_up_reminder_sent_at < p_now - interval '7 days')
     and (d.follow_up_reminder_outbox_id is null
       or d.follow_up_reminder_outbox_id = v_outbox_id)
   order by d.id
   for update skip locked;

  get diagnostics v_locked_count = row_count;
  if v_locked_count <> v_requested_count then return null; end if;

  if v_outbox_id is null then
    insert into public.donation_email_outbox
      (kind, idempotency_key, email_payload, payload_sha256)
    values ('follow_up_digest', v_key, p_email_payload, p_payload_sha256)
    on conflict (idempotency_key) do nothing
    returning id into v_outbox_id;
    if v_outbox_id is null then
      select id into v_outbox_id from public.donation_email_outbox where idempotency_key = v_key;
    end if;
  end if;

  select payload_sha256 into v_saved_sha256
    from public.donation_email_outbox where id = v_outbox_id;
  if v_saved_sha256 <> p_payload_sha256 then
    update public.donation_email_outbox
       set status = case when status = 'sent' then status else 'needs_review' end,
           lease_token = case when status = 'sent' then lease_token else null end,
           lease_expires_at = case when status = 'sent' then lease_expires_at else null end,
           email_payload = '{}'::jsonb,
           last_error = case when status = 'sent'
             then 'Digest payload changed under an existing idempotency key after send'
             else 'Digest payload changed under an existing idempotency key' end,
           updated_at = now()
     where id = v_outbox_id;
  end if;

  insert into public.donation_email_outbox_donations (outbox_id, donation_id)
    select v_outbox_id, unnest(v_sorted_ids)
    on conflict do nothing;

  update public.donations d
     set follow_up_reminder_outbox_id = v_outbox_id
   where d.id = any(v_sorted_ids)
     and (d.follow_up_reminder_outbox_id is null
       or d.follow_up_reminder_outbox_id = v_outbox_id);

  return v_outbox_id;
end;
$$;

create or replace function public.claim_donation_email_outbox(
  p_limit integer default 20,
  p_only_ids uuid[] default null
)
returns setof public.donation_email_outbox
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.donation_email_outbox
     set status = 'needs_review', lease_token = null, lease_expires_at = null,
         last_error = coalesce(last_error, 'Automatic retry safety window expired')
   where status in ('pending', 'processing')
     and (attempt_count >= 6
       or (first_attempt_at is not null and first_attempt_at <= now() - interval '23 hours'))
     and (status = 'pending' or lease_expires_at <= now());

  return query
  with candidates as (
    select q.id
      from public.donation_email_outbox q
     where ((q.status = 'pending' and q.available_at <= now())
         or (q.status = 'processing' and q.lease_expires_at <= now()))
       and (p_only_ids is null or q.id = any(p_only_ids))
       and q.attempt_count < 6
       and (q.first_attempt_at is null or q.first_attempt_at > now() - interval '23 hours')
     order by q.available_at, q.created_at
     for update skip locked
     limit least(greatest(coalesce(p_limit, 20), 1), 100)
  ), claimed as (
    update public.donation_email_outbox q
       set status = 'processing',
           attempt_count = q.attempt_count + 1,
           first_attempt_at = coalesce(q.first_attempt_at, now()),
           last_attempt_at = now(),
           lease_token = gen_random_uuid(),
           lease_expires_at = now() + interval '2 minutes',
           updated_at = now()
      from candidates c
     where q.id = c.id
    returning q.*
  )
  select * from claimed;
end;
$$;

create or replace function public.complete_donation_email_outbox(
  p_outbox_id uuid,
  p_lease_token uuid,
  p_provider_message_id text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_kind text;
  v_donation_id uuid;
  v_link_count integer;
  v_updated_count integer;
begin
  update public.donation_email_outbox
     set status = 'sent', sent_at = now(), provider_message_id = p_provider_message_id,
         email_payload = '{}'::jsonb, lease_token = null, lease_expires_at = null,
         last_error = null, updated_at = now()
   where id = p_outbox_id and status = 'processing' and lease_token = p_lease_token
   returning kind, donation_id into v_kind, v_donation_id;
  if not found then return false; end if;

  if v_kind = 'donor_receipt' and v_donation_id is not null then
    update public.donations set thank_you_sent_at = coalesce(thank_you_sent_at, now())
     where id = v_donation_id;
  elsif v_kind = 'staff_follow_up' and v_donation_id is not null then
    update public.donations set staff_follow_up_sent_at = coalesce(staff_follow_up_sent_at, now())
     where id = v_donation_id;
  elsif v_kind = 'follow_up_digest' then
    select count(*) into v_link_count
      from public.donation_email_outbox_donations where outbox_id = p_outbox_id;
    if v_link_count = 0 then
      raise exception 'Digest outbox row has no linked donations';
    end if;
    update public.donations d
       set follow_up_reminder_sent_at = now(), follow_up_reminder_outbox_id = null
      from public.donation_email_outbox_donations l
     where l.outbox_id = p_outbox_id and d.id = l.donation_id
       and d.follow_up_reminder_outbox_id = p_outbox_id;
    get diagnostics v_updated_count = row_count;
    if v_updated_count <> v_link_count then
      raise exception 'Digest completion reservation mismatch';
    end if;
  end if;
  return true;
end;
$$;

create or replace function public.fail_donation_email_outbox(
  p_outbox_id uuid,
  p_lease_token uuid,
  p_error text,
  p_needs_review boolean default false
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_attempt integer;
  v_first_attempt timestamptz;
  v_status text;
  v_delay interval;
begin
  select attempt_count, first_attempt_at into v_attempt, v_first_attempt
    from public.donation_email_outbox
   where id = p_outbox_id and status = 'processing' and lease_token = p_lease_token
   for update;
  if not found then return 'stale_lease'; end if;

  if p_needs_review or v_attempt >= 6 or v_first_attempt <= now() - interval '23 hours' then
    v_status := 'needs_review';
  else
    v_status := 'pending';
  end if;
  v_delay := case v_attempt
    when 1 then interval '1 minute'
    when 2 then interval '5 minutes'
    when 3 then interval '15 minutes'
    when 4 then interval '1 hour'
    when 5 then interval '3 hours'
    else interval '6 hours'
  end;

  update public.donation_email_outbox
     set status = v_status,
         available_at = case when v_status = 'pending' then now() + v_delay else available_at end,
         email_payload = case when v_status = 'needs_review' then '{}'::jsonb else email_payload end,
         lease_token = null,
         lease_expires_at = null,
         last_error = left(coalesce(p_error, 'Unknown email delivery failure'), 2000),
         updated_at = now()
   where id = p_outbox_id;
  return v_status;
end;
$$;

revoke all on function public.persist_donation_email_outbox(jsonb, jsonb, text, jsonb, text) from public, anon, authenticated;
revoke all on function public.enqueue_follow_up_digest(uuid[], jsonb, text, timestamptz) from public, anon, authenticated;
revoke all on function public.claim_donation_email_outbox(integer, uuid[]) from public, anon, authenticated;
revoke all on function public.complete_donation_email_outbox(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.fail_donation_email_outbox(uuid, uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.persist_donation_email_outbox(jsonb, jsonb, text, jsonb, text) to service_role;
grant execute on function public.enqueue_follow_up_digest(uuid[], jsonb, text, timestamptz) to service_role;
grant execute on function public.claim_donation_email_outbox(integer, uuid[]) to service_role;
grant execute on function public.complete_donation_email_outbox(uuid, uuid, text) to service_role;
grant execute on function public.fail_donation_email_outbox(uuid, uuid, text, boolean) to service_role;
