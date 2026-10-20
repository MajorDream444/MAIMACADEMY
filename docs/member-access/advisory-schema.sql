-- Draft extension only. NOT applied. Private application DB; no public API grants.
create table academy_session_credits(id bigint generated always as identity primary key,user_id text not null references "user"(id),grant_id bigint not null unique references academy_grants(id),status text not null check(status in ('available','reserved','used','revoked')),starts_at timestamptz not null,expires_at timestamptz not null check(expires_at>starts_at));
create table academy_briefs(id bigint generated always as identity primary key,user_id text not null references "user"(id),problem text not null,desired_result text not null,tried text not null,decision text not null,status text not null check(status in ('submitted','approved','needs_revision')),reviewer_id text,reviewed_at timestamptz,check(status<>'approved' or (reviewer_id is not null and reviewed_at is not null)));
create table academy_advisory_slots(id bigint generated always as identity primary key,starts_at timestamptz not null,ends_at timestamptz not null,status text not null check(status in ('open','reserved')),check(ends_at-starts_at=interval '45 minutes'));
create table academy_bookings(id bigint generated always as identity primary key,user_id text not null references "user"(id),credit_id bigint not null unique references academy_session_credits(id),brief_id bigint not null unique references academy_briefs(id),slot_id bigint not null unique references academy_advisory_slots(id));
revoke all on academy_session_credits,academy_briefs,academy_advisory_slots,academy_bookings from public;
-- Credit issue trigger: single founding credit per journey grant, payment timestamp
-- (grant.starts_at) determines window. Hold/revoke checked again by API each request.
create function academy_founding_credit() returns trigger language plpgsql as $$
begin if new.resource='journey' and new.status='active' then insert into academy_session_credits(user_id,grant_id,status,starts_at,expires_at) values(new.user_id,new.id,'available',new.starts_at,new.starts_at+interval '90 days') on conflict(grant_id) do nothing;end if;return new;end;$$;
create trigger academy_founding_credit_insert after insert on academy_grants for each row execute function academy_founding_credit();
-- Backfill only reviewed existing active grants. No data seeded automatically.
-- Reviewer approval and published appointment availability remain operator-only.
alter table academy_advisory_slots add constraint academy_no_overlapping_slots exclude using gist (tstzrange(starts_at,ends_at,'[)') with &&);
