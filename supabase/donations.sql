create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  stripe_payment_intent_id text unique,
  stripe_invoice_id text unique,
  stripe_subscription_id text,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  frequency text not null check (frequency in ('one-time', 'monthly')),
  donor_email text not null,
  donor_name text not null,
  is_anonymous boolean not null default false,
  project_slug text not null default 'general',
  paid_at timestamptz not null,
  receipt_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donations_donor_email_paid_at_idx
  on public.donations (lower(donor_email), paid_at desc);

alter table public.donations enable row level security;

drop policy if exists "donors can read their own donations" on public.donations;

create policy "donors can read their own donations"
  on public.donations
  for select
  using (lower(donor_email) = lower((auth.jwt() ->> 'email')));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists donations_touch_updated_at on public.donations;

create trigger donations_touch_updated_at
  before update on public.donations
  for each row
  execute function public.touch_updated_at();
