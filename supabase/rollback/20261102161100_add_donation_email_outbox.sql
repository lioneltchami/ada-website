-- Destructive rollback for the local proposal only; never run blindly in prod.
-- This drops delivery history and pending/review jobs. After any real email has
-- been sent, retaining the outbox is preferable to deleting audit evidence.

drop function if exists public.fail_donation_email_outbox(uuid, uuid, text, boolean);
drop function if exists public.complete_donation_email_outbox(uuid, uuid, text);
drop function if exists public.claim_donation_email_outbox(integer, uuid[]);
drop function if exists public.enqueue_follow_up_digest(uuid[], jsonb, text, timestamptz);
drop function if exists public.persist_donation_email_outbox(jsonb, jsonb, text, jsonb, text);

alter table public.donations
  drop column if exists follow_up_reminder_outbox_id;

drop table if exists public.donation_email_outbox_donations;
drop table if exists public.donation_email_outbox;
