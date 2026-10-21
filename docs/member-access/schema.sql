-- Reviewable application schema, NOT applied. Run Better Auth's pinned CLI
-- migration against an isolated development DB first for user/session/account,
-- verification and database-backed rateLimit tables. App DB role is private.
create table academy_grants (
 id bigint generated always as identity primary key,
 user_id text not null references "user"(id),
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
 user_id text not null references "user"(id), day integer not null check(day between 1 and 30),
 status text not null check(status in ('started','completed')),
 reflection text not null default '' check(length(reflection)<=4000),
 updated_at timestamptz not null default now(), primary key(user_id,day)
);
create table academy_lessons (day integer primary key check(day between 1 and 30),title text not null,body text not null,version text not null,published boolean not null default false);
create table academy_payment_events(id text primary key,payment_intent text not null,event_type text not null,processed_at timestamptz not null default now());
create table academy_payment_holds(payment_intent text primary key,reason text not null);
-- No public Data API grants. Application server only; never browser credentials.
revoke all on academy_grants,academy_progress,academy_lessons,academy_payment_events,academy_payment_holds from public;
