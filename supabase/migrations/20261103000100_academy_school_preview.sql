-- PROPOSAL: review and apply only to academy_test after live drift/role inventory.
-- No hosted application, memberships, grants, teaching content or customer rows seeded.
begin;
set local search_path=academy_test,pg_catalog;
create table school_memberships (
 cohort_id text not null references academy_cohorts(id), user_id uuid not null references auth.users(id),
 role text not null check(role in ('learner','facilitator')), active boolean not null default false,
 work_expires_at timestamptz not null, primary key(cohort_id,user_id)
);
create function school_access(c text, facilitator_only boolean default false) returns boolean
language sql stable security definer set search_path=academy_test,pg_catalog as $$
 select exists(select 1 from school_memberships m where m.cohort_id=c and m.user_id=auth.uid() and m.active and m.work_expires_at>now()
 and (not facilitator_only or m.role='facilitator') and (m.role='facilitator' or exists(select 1 from academy_grants g where g.user_id=m.user_id and g.resource='journey' and g.status='active' and g.starts_at<=now() and (g.expires_at is null or g.expires_at>now()))))
$$;
create table school_lessons (
 id text primary key, cohort_id text not null references academy_cohorts(id), title text not null,
 body text not null, version text not null, status text not null check(status in ('draft','reviewed','published')),
 source_ref text not null, reviewed_by uuid references auth.users(id), reviewed_at timestamptz,
 check(status='draft' or (reviewed_by is not null and reviewed_at is not null))
);
create table school_submissions (
 id uuid primary key default gen_random_uuid(), cohort_id text not null references academy_cohorts(id), user_id uuid not null references auth.users(id),
 milestone text not null check(milestone in ('audit','design','prototype','test','ship','measure')),
 body text not null check(length(body) between 10 and 4000), version integer not null default 1,
 state text not null check(state in ('draft','submitted','peer_feedback','facilitator_review','changes_requested','accepted')),
 shared boolean not null default false, updated_at timestamptz not null default now(), unique(cohort_id,user_id,milestone)
);
create table school_reviews (
 id uuid primary key default gen_random_uuid(), submission_id uuid not null references school_submissions(id),
 version integer not null, reviewer_id uuid not null references auth.users(id),
 kind text not null check(kind in ('peer','changes_requested','accepted')), body text not null check(length(body) between 10 and 2000),
 created_at timestamptz not null default now()
);
create table school_history (
 id bigint generated always as identity primary key, submission_id uuid not null references school_submissions(id),
 actor_id uuid not null references auth.users(id), event text not null, version integer not null,
 snapshot jsonb not null, created_at timestamptz not null default now()
);
create table school_posts (
 id uuid primary key default gen_random_uuid(), cohort_id text not null references academy_cohorts(id), user_id uuid not null references auth.users(id),
 channel text not null check(channel in ('introductions','questions','resources','wins','showcases')),
 parent_id uuid references school_posts(id), body text not null check(length(body) between 5 and 2000),
 hidden boolean not null default false, created_at timestamptz not null default now()
);
create table school_reports (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references school_posts(id),
 reporter_id uuid not null references auth.users(id), reason text not null check(length(reason) between 5 and 1000),
 resolved_by uuid references auth.users(id), resolved_at timestamptz, unique(post_id,reporter_id)
);
-- All mutations use narrow functions: no learner can self-accept, change ownership,
-- impersonate a reviewer, rewrite history or provision membership.
create function school_save(c text, m text, content text, share boolean, submit boolean, expected integer) returns uuid
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare s school_submissions; result uuid; next_version integer;
begin
 if not school_access(c) or school_access(c,true) then raise exception 'Learner access required'; end if;
 -- Membership row lock serializes first save, edits and review against revocation.
 perform 1 from school_memberships where cohort_id=c and user_id=auth.uid() for update;
 select * into s from school_submissions where cohort_id=c and user_id=auth.uid() and milestone=m for update;
 if coalesce(s.version,0)<>expected then raise exception 'Version conflict'; end if;
 if s.state in ('accepted','submitted','peer_feedback','facilitator_review') then raise exception 'Review in progress or accepted'; end if;
 next_version:=coalesce(s.version,0)+1;
 insert into school_submissions(cohort_id,user_id,milestone,body,shared,state,version) values(c,auth.uid(),m,content,share,case when submit then 'submitted' else 'draft' end,next_version)
 on conflict(cohort_id,user_id,milestone) do update set body=excluded.body,shared=excluded.shared,state=excluded.state,version=excluded.version,updated_at=now() returning id into result;
 insert into school_history(submission_id,actor_id,event,version,snapshot) values(result,auth.uid(),case when submit then 'submitted' else 'draft_saved' end,next_version,jsonb_build_object('body',content,'shared',share));
 return result;
end $$;
create function school_review(sid uuid, expected integer, decision text, feedback text) returns void
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare s school_submissions;
begin
 select * into s from school_submissions where id=sid for update;
 if s.id is null or not school_access(s.cohort_id) or s.user_id=auth.uid() then raise exception 'Review denied'; end if;
 if s.version<>expected then raise exception 'Version conflict'; end if;
 if decision='peer' then
   if school_access(s.cohort_id,true) or not s.shared or s.state not in ('submitted','peer_feedback') then raise exception 'Peer sharing required'; end if;
   insert into school_reviews(submission_id,version,reviewer_id,kind,body) values(sid,s.version,auth.uid(),decision,feedback);
   update school_submissions set state='peer_feedback',updated_at=now() where id=sid;
 elsif decision in ('accepted','changes_requested') then
   if not school_access(s.cohort_id,true) or s.state not in ('peer_feedback','facilitator_review') then raise exception 'Facilitator review required'; end if;
   if not exists(select 1 from school_reviews where submission_id=sid and version=s.version and kind='peer') then raise exception 'Peer review first'; end if;
   insert into school_reviews(submission_id,version,reviewer_id,kind,body) values(sid,s.version,auth.uid(),decision,feedback);
   update school_submissions set state=decision,updated_at=now() where id=sid;
 else raise exception 'Invalid decision'; end if;
 insert into school_history(submission_id,actor_id,event,version,snapshot) values(sid,auth.uid(),decision,s.version,jsonb_build_object('feedback',feedback));
end $$;
create function school_request_review(sid uuid, expected integer) returns void
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare s school_submissions;
begin
 select * into s from school_submissions where id=sid for update;
 if s.user_id is distinct from auth.uid() or not school_access(s.cohort_id) or s.state<>'peer_feedback' or s.version<>expected then raise exception 'Review request denied'; end if;
 update school_submissions set state='facilitator_review',updated_at=now() where id=sid;
 insert into school_history(submission_id,actor_id,event,version,snapshot) values(sid,auth.uid(),'facilitator_review',s.version,'{}');
end $$;
create function school_post(c text, channel_name text, content text, parent uuid default null) returns uuid
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare result uuid;
begin
 if not school_access(c) then raise exception 'Cohort access required'; end if;
 if parent is not null and not exists(select 1 from school_posts where id=parent and cohort_id=c and channel=channel_name and not hidden and parent_id is null) then raise exception 'Invalid thread'; end if;
 insert into school_posts(cohort_id,user_id,channel,body,parent_id) values(c,auth.uid(),channel_name,content,parent) returning id into result;return result;
end $$;
create function school_report(pid uuid, note text) returns void
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
begin
 if not exists(select 1 from school_posts where id=pid and not hidden and school_access(cohort_id)) then raise exception 'Post unavailable'; end if;
 insert into school_reports(post_id,reporter_id,reason) values(pid,auth.uid(),note) on conflict(post_id,reporter_id) do nothing;
end $$;
create function school_hide(pid uuid) returns void
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
begin
 if not exists(select 1 from school_posts where id=pid and school_access(cohort_id,true)) then raise exception 'Facilitator access required'; end if;
 update school_posts set hidden=true where id=pid or parent_id=pid;
 update school_reports set resolved_by=auth.uid(),resolved_at=now() where post_id=pid;
end $$;
create function school_set_sharing(sid uuid, sharing boolean) returns void
language plpgsql security definer set search_path=academy_test,pg_catalog as $$
declare s school_submissions;
begin
 select * into s from school_submissions where id=sid for update;
 if s.user_id is distinct from auth.uid() or not school_access(s.cohort_id) or sharing is null then raise exception 'Ownership required'; end if;
 if s.shared=sharing then return; end if;
 update school_submissions set shared=sharing,updated_at=now() where id=sid;
 insert into school_history(submission_id,actor_id,event,version,snapshot) values(sid,auth.uid(),case when sharing then 'peer_sharing_enabled' else 'peer_sharing_revoked' end,s.version,jsonb_build_object('shared',sharing));
end $$;
create function school_unshare(sid uuid) returns void
language sql security definer set search_path=academy_test,pg_catalog as $$
 select school_set_sharing(sid,false)
$$;
-- Self export remains available after work access expires; no other identity input.
create function school_export() returns jsonb
language sql stable security definer set search_path=academy_test,pg_catalog as $$
 select jsonb_build_object('format','maim-academy-work-record','schema_version',1,'exported_at',now(),'credential_issued',false,'submissions',coalesce((select jsonb_agg(to_jsonb(s)) from school_submissions s where s.user_id=auth.uid()),'[]'::jsonb),'reviews',coalesce((select jsonb_agg(to_jsonb(r)) from school_reviews r join school_submissions s on s.id=r.submission_id where s.user_id=auth.uid()),'[]'::jsonb),'history',coalesce((select jsonb_agg(to_jsonb(h)) from school_history h join school_submissions s on s.id=h.submission_id where s.user_id=auth.uid()),'[]'::jsonb),'posts',coalesce((select jsonb_agg(to_jsonb(p)) from school_posts p where p.user_id=auth.uid()),'[]'::jsonb))
$$;
revoke all on school_memberships,school_lessons,school_submissions,school_reviews,school_history,school_posts,school_reports from public,anon,authenticated,academy_test_auth,academy_test_member,academy_test_worker;
grant select on school_memberships,school_lessons,school_submissions,school_reviews,school_history,school_posts,school_reports to academy_test_member;
grant select,insert,update on school_memberships,school_lessons to academy_test_worker;
-- Revoke PUBLIC EXECUTE on every new definer function, including helper.
revoke all on function school_access(text,boolean),school_save(text,text,text,boolean,boolean,integer),school_review(uuid,integer,text,text),school_request_review(uuid,integer),school_post(text,text,text,uuid),school_report(uuid,text),school_hide(uuid),school_unshare(uuid),school_set_sharing(uuid,boolean),school_export() from public,anon,authenticated,academy_test_auth,academy_test_worker;
grant execute on function school_access(text,boolean),school_save(text,text,text,boolean,boolean,integer),school_review(uuid,integer,text,text),school_request_review(uuid,integer),school_post(text,text,text,uuid),school_report(uuid,text),school_hide(uuid),school_unshare(uuid),school_set_sharing(uuid,boolean),school_export() to academy_test_member;
alter table school_memberships enable row level security;
alter table school_lessons enable row level security;
alter table school_submissions enable row level security;
alter table school_reviews enable row level security;
alter table school_history enable row level security;
alter table school_posts enable row level security;
alter table school_reports enable row level security;
create policy own_membership on school_memberships for select to academy_test_member using(user_id=auth.uid() or school_access(cohort_id,true));
create policy published_lesson on school_lessons for select to academy_test_member using(school_access(cohort_id) and (status='published' or school_access(cohort_id,true)));
create policy scoped_submission on school_submissions for select to academy_test_member using(school_access(cohort_id) and (user_id=auth.uid() or school_access(cohort_id,true) or (shared and state<>'draft')));
create policy scoped_review on school_reviews for select to academy_test_member using(exists(select 1 from school_submissions s where s.id=submission_id));
create policy private_history on school_history for select to academy_test_member using(exists(select 1 from school_submissions s where s.id=submission_id and (s.user_id=auth.uid() or school_access(s.cohort_id,true))));
create policy cohort_posts on school_posts for select to academy_test_member using(school_access(cohort_id) and (not hidden or school_access(cohort_id,true)));
create policy report_queue on school_reports for select to academy_test_member using(exists(select 1 from school_posts p where p.id=post_id and school_access(p.cohort_id,true)));
create policy operator_membership on school_memberships for all to academy_test_worker using(true) with check(true);
create policy operator_lessons on school_lessons for all to academy_test_worker using(true) with check(true);
commit;
