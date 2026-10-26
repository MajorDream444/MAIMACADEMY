-- REVIEW REQUIRED. Private TEST-only additive migration; never run historical drafts.
-- No auth/customer rows, global Auth settings or existing MAIM schemas are changed.
begin;
do $$ begin
 if exists(select 1 from pg_namespace where nspname='academy_test') then
   raise exception 'academy_test already exists: review migration history before proceeding';
 end if;
end $$;
create schema academy_test;
revoke all on schema academy_test from public,anon,authenticated;
do $$ declare r text; begin
 foreach r in array array['academy_test_member','academy_test_worker','academy_test_auth'] loop
   if exists(select 1 from pg_roles where rolname=r) then raise exception 'TEST role already exists: review privileges'; end if;
   execute format('create role %I nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls',r);
 end loop;
end $$;
set local search_path=academy_test,pg_catalog;
create table academy_grants (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id),
 resource text not null check(resource in ('journey','vault')),
 status text not null check(status in ('active','held','revoked')),
 starts_at timestamptz not null,
 expires_at timestamptz,
 source_payment text unique,
 offer_version text not null,
 check(expires_at is null or expires_at>starts_at),
 check(resource<>'vault' or expires_at is not null)
);
create index academy_grants_user on academy_grants(user_id);
create table academy_progress (
 user_id uuid not null references auth.users(id), day integer not null check(day between 1 and 30),
 status text not null check(status in ('started','completed')),
 reflection text not null default '' check(length(reflection)<=4000),
 updated_at timestamptz not null default now(), primary key(user_id,day)
);
create table academy_lessons (day integer primary key check(day between 1 and 30),title text not null,body text not null,version text not null,published boolean not null default false);
create table academy_payment_events(id text primary key,payment_intent text not null,event_type text not null,processed_at timestamptz not null default now());
create table academy_payment_holds(payment_intent text primary key,reason text not null);
-- No public Data API grants. Application server only; never browser credentials.
revoke all on academy_grants,academy_progress,academy_lessons,academy_payment_events,academy_payment_holds from public;

alter table academy_grants add column enrolled_at timestamptz not null default now();
create table academy_testers(user_id uuid primary key references auth.users(id));
create table academy_auth_sessions(token_hash text primary key check(length(token_hash)=64),user_id uuid not null references auth.users(id),expires_at timestamptz not null,revoked boolean not null default false);
create table academy_reservations(user_id uuid primary key references auth.users(id),notice_version text not null check(length(notice_version) between 1 and 100),consent_at timestamptz not null default now(),source text not null check(source='academy-protected-test'));
create table academy_receipts(payment_intent text primary key,user_id uuid not null references auth.users(id),session_id text not null unique,status text not null default 'pending' check(status in ('pending','sending','accepted','failed','uncertain')),provider_id text);
create table academy_cohorts(id text primary key,capacity integer not null check(capacity=20),payment_opens date not null,starts_at timestamptz not null,group_ends_at timestamptz not null);
insert into academy_cohorts values('founding-2026-11-18',20,'2026-11-11','2026-11-18T14:00Z','2026-12-18T14:00Z');
create table academy_seats(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),cohort_id text not null references academy_cohorts(id),request_id uuid not null unique,session_id text unique,payment_intent text unique,agreement_version text,terms_url text,price_id text,checkout_payload jsonb,status text not null check(status in ('pending','checkout','paid','held','expired','refunded')),created_at timestamptz not null default now());
create unique index academy_one_active_seat on academy_seats(user_id,cohort_id) where status in ('pending','checkout','paid','held');
-- No timeout-only release: an attached Stripe session may still complete. Release
-- only on a verified expiration/full refund, never on an elapsed browser timer.
create function claim_seat(p_user uuid,p_request uuid) returns academy_seats
language plpgsql security invoker set search_path=academy_test,pg_catalog as $$
declare c academy_cohorts; s academy_seats; n integer;
begin
 if not exists(select 1 from academy_testers where user_id=p_user) then raise exception 'QA identity required'; end if;
 select * into c from academy_cohorts where id='founding-2026-11-18' for update;
 select * into s from academy_seats where user_id=p_user and cohort_id=c.id and status in ('pending','checkout','paid','held');
 if found then return s; end if;
 select count(*) into n from academy_seats where cohort_id=c.id and status in ('pending','checkout','paid','held');
 if n>=c.capacity then raise exception 'Cohort capacity reached'; end if;
 insert into academy_seats(user_id,cohort_id,request_id,status) values(p_user,c.id,p_request,'pending') returning * into s;
 return s;
end $$;
-- Auth has only private session functions, not general member/customer access.
create function create_session(p_hash text,p_user uuid) returns void
language sql security definer set search_path=academy_test,pg_catalog as $$
 insert into academy_auth_sessions(token_hash,user_id,expires_at)
 select p_hash,t.user_id,now()+interval '1 hour' from academy_testers t
 join auth.users u on u.id=t.user_id where t.user_id=p_user
 and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<now());
$$;
create function resolve_session(p_hash text) returns table(user_id uuid,email text)
language sql security definer set search_path=academy_test,pg_catalog as $$
 select s.user_id,u.email::text from academy_auth_sessions s
 join academy_testers t on t.user_id=s.user_id join auth.users u on u.id=s.user_id
 where s.token_hash=p_hash and not s.revoked and s.expires_at>now()
 and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<now());
$$;
create function revoke_session(p_hash text) returns void
language sql security definer set search_path=academy_test,pg_catalog as $$
 update academy_auth_sessions set revoked=true where token_hash=p_hash;
$$;
create table academy_session_credits(id bigint generated always as identity primary key,user_id uuid not null references auth.users(id),grant_id bigint not null unique references academy_grants(id),status text not null check(status in ('available','reserved','used','revoked')),starts_at timestamptz not null,expires_at timestamptz not null check(expires_at>starts_at));
create table academy_briefs(created_at timestamptz not null default now(),id bigint generated always as identity primary key,user_id uuid not null references auth.users(id),problem text not null,desired_result text not null,tried text not null,decision text not null,status text not null check(status in ('submitted','approved','needs_revision')),reviewer_id text,reviewed_at timestamptz,check(status<>'approved' or (reviewer_id is not null and reviewed_at is not null)));
create table academy_advisory_slots(id bigint generated always as identity primary key,starts_at timestamptz not null,ends_at timestamptz not null,status text not null check(status in ('open','reserved')),check(ends_at-starts_at=interval '45 minutes'));
create table academy_bookings(id bigint generated always as identity primary key,user_id uuid not null references auth.users(id),credit_id bigint not null unique references academy_session_credits(id),brief_id bigint not null unique references academy_briefs(id),slot_id bigint not null unique references academy_advisory_slots(id));
revoke all on academy_session_credits,academy_briefs,academy_advisory_slots,academy_bookings from public;
-- Credit issue trigger: single founding credit per journey grant, payment timestamp
-- (grant.starts_at) determines window. Hold/revoke checked again by API each request.
create function academy_founding_credit() returns trigger language plpgsql set search_path=academy_test,pg_catalog as $$
begin if new.resource='journey' and new.status='active' then insert into academy_session_credits(user_id,grant_id,status,starts_at,expires_at) values(new.user_id,new.id,'available',new.enrolled_at+interval '7 days',new.enrolled_at+interval '90 days') on conflict(grant_id) do nothing;end if;return new;end;$$;
create trigger academy_founding_credit_insert after insert on academy_grants for each row execute function academy_founding_credit();
-- Backfill only reviewed existing active grants. No data seeded automatically.
-- Reviewer approval and published appointment availability remain operator-only.
alter table academy_advisory_slots add constraint academy_no_overlapping_slots exclude using gist (tstzrange(starts_at,ends_at,'[)') with &&);

grant usage on schema auth to academy_test_member;
grant execute on function auth.uid() to academy_test_member;
grant usage on schema academy_test to academy_test_member,academy_test_worker,academy_test_auth;
revoke all on all tables in schema academy_test from public,anon,authenticated;
revoke all on all functions in schema academy_test from public,anon,authenticated;
revoke all on all sequences in schema academy_test from public,anon,authenticated;
alter default privileges in schema academy_test revoke all on tables from public,anon,authenticated;
alter default privileges in schema academy_test revoke execute on functions from public,anon,authenticated;
grant execute on function create_session(text,uuid),resolve_session(text),revoke_session(text) to academy_test_auth;
grant execute on function claim_seat(uuid,uuid) to academy_test_worker;
grant select,insert,update on academy_grants,academy_progress,academy_lessons,academy_payment_events,academy_payment_holds,academy_session_credits,academy_briefs,academy_advisory_slots,academy_bookings,academy_seats,academy_receipts to academy_test_worker;
grant select on academy_testers,academy_cohorts to academy_test_worker;
grant update(id) on academy_cohorts to academy_test_worker;
grant usage,select on all sequences in schema academy_test to academy_test_worker;
grant select on academy_grants,academy_progress,academy_lessons,academy_session_credits,academy_briefs,academy_advisory_slots,academy_bookings,academy_cohorts,academy_reservations to academy_test_member;
grant insert,update on academy_progress to academy_test_member;
grant insert on academy_briefs,academy_reservations to academy_test_member;
-- Member cannot mutate credits, grants, bookings or slot state directly.
grant usage,select on all sequences in schema academy_test to academy_test_member;
alter table academy_receipts enable row level security;
create policy worker_scope on academy_receipts for all to academy_test_worker using(true) with check(true);
alter table academy_grants enable row level security;
create policy worker_scope on academy_grants for all to academy_test_worker using(true) with check(true);
alter table academy_progress enable row level security;
create policy worker_scope on academy_progress for all to academy_test_worker using(true) with check(true);
alter table academy_lessons enable row level security;
create policy worker_scope on academy_lessons for all to academy_test_worker using(true) with check(true);
alter table academy_payment_events enable row level security;
create policy worker_scope on academy_payment_events for all to academy_test_worker using(true) with check(true);
alter table academy_payment_holds enable row level security;
create policy worker_scope on academy_payment_holds for all to academy_test_worker using(true) with check(true);
alter table academy_testers enable row level security;
create policy worker_scope on academy_testers for all to academy_test_worker using(true) with check(true);
alter table academy_auth_sessions enable row level security;
create policy worker_scope on academy_auth_sessions for all to academy_test_worker using(true) with check(true);
alter table academy_reservations enable row level security;
create policy worker_scope on academy_reservations for all to academy_test_worker using(true) with check(true);
alter table academy_cohorts enable row level security;
create policy worker_scope on academy_cohorts for all to academy_test_worker using(true) with check(true);
alter table academy_seats enable row level security;
create policy worker_scope on academy_seats for all to academy_test_worker using(true) with check(true);
alter table academy_session_credits enable row level security;
create policy worker_scope on academy_session_credits for all to academy_test_worker using(true) with check(true);
alter table academy_briefs enable row level security;
create policy worker_scope on academy_briefs for all to academy_test_worker using(true) with check(true);
alter table academy_advisory_slots enable row level security;
create policy worker_scope on academy_advisory_slots for all to academy_test_worker using(true) with check(true);
alter table academy_bookings enable row level security;
create policy worker_scope on academy_bookings for all to academy_test_worker using(true) with check(true);
create policy own_read on academy_grants for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_read on academy_progress for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_read on academy_session_credits for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_read on academy_briefs for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_read on academy_bookings for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_read on academy_reservations for select to academy_test_member using(user_id=(select auth.uid()));
create policy own_progress_insert on academy_progress for insert to academy_test_member with check(user_id=(select auth.uid()) and exists(select 1 from academy_grants where user_id=(select auth.uid()) and resource='journey' and status='active' and starts_at<=now() and (expires_at is null or expires_at>now())));
create policy own_progress_update on academy_progress for update to academy_test_member using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and exists(select 1 from academy_grants where user_id=(select auth.uid()) and resource='journey' and status='active' and starts_at<=now() and (expires_at is null or expires_at>now())));
create policy own_brief on academy_briefs for insert to academy_test_member with check(user_id=(select auth.uid()) and status='submitted' and reviewer_id is null and reviewed_at is null);
create policy own_reservation on academy_reservations for insert to academy_test_member with check(user_id=(select auth.uid()));
create policy lesson_access on academy_lessons for select to academy_test_member using(published and exists(select 1 from academy_grants where user_id=(select auth.uid()) and resource='journey' and status='active' and starts_at<=now() and (expires_at is null or expires_at>now())));
create policy cohort_read on academy_cohorts for select to academy_test_member using(true);
create policy slots_read on academy_advisory_slots for select to academy_test_member using(true);
-- Narrow booking mutation: identity is the transaction claim, never caller input.
create function reserve_booking(p_credit bigint,p_brief bigint,p_slot bigint) returns bigint
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare u uuid:=auth.uid(); c academy_session_credits; b academy_briefs; s academy_advisory_slots; result bigint;
begin
 if u is null or not exists(select 1 from academy_testers where user_id=u) then raise exception 'QA identity required'; end if;
 select cr.* into c from academy_session_credits cr join academy_grants g on g.id=cr.grant_id where cr.id=p_credit and cr.user_id=u and g.user_id=u and g.status='active' and g.starts_at<=now() and (g.expires_at is null or g.expires_at>now()) for update of cr,g;
 select * into b from academy_briefs where id=p_brief and user_id=u for update;
 select * into s from academy_advisory_slots where id=p_slot for update;
 if c.id is null or b.id is null or s.id is null or c.status<>'available' or c.starts_at>now() or c.expires_at<=now() or b.status<>'approved' or b.created_at>s.starts_at-interval '48 hours' or s.status<>'open' or s.starts_at<=now() or s.ends_at>c.expires_at then raise exception 'Ineligible booking'; end if;
 insert into academy_bookings(user_id,credit_id,brief_id,slot_id) values(u,c.id,b.id,s.id) returning id into result;
 update academy_session_credits set status='reserved' where id=c.id;
 update academy_advisory_slots set status='reserved' where id=s.id;
 return result;
end $$;
revoke all on function reserve_booking(bigint,bigint,bigint) from public,anon,authenticated;
grant execute on function reserve_booking(bigint,bigint,bigint) to academy_test_member;
commit;
