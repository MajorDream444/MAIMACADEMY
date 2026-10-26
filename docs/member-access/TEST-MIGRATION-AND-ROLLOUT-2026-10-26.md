# Academy UUID TEST migration and rollout

26 October 2026. Implementation baseline Academy main `9534e9c`; authority
Major-AI-OS main `00713ff`. Read merged Academy PRs #20/#21/#22/#23. Founder
explicitly approved a private TEST schema within shared MAIM Ecosystem after
migration review. A development-branch attempt was rejected by Supabase because
branching requires Pro; no upgrade, branch charge or new project was created.

## Applied scope and review

Independent read-only review initially found a missing cohort locking privilege
and unstable Stripe idempotency payload. Both were corrected. Follow-up review
returned PASS for additive TEST schema application only; not for credentials,
email/payment activation or production. Originating-grant booking validity and
terminal full-refund classification were also corrected.

Applied provider migration: **20261026024608 / academy_uuid_preview**. The file
was initially generated with the pinned Supabase CLI and then renamed to match
the provider-assigned applied version so a future CLI push cannot reapply it.
Do not edit this applied migration; corrections require a successor migration.

- Private `academy_test`: 15 tables, all RLS enabled.
- Three logical roles: `academy_test_member`, `academy_test_auth`,
  `academy_test_worker`; all NOLOGIN/NOSUPERUSER/NOBYPASSRLS.
- No schema USAGE for `anon` or `authenticated`; no Data API exposure requested.
- Separate role grants for member-owned progress, auth-only session functions,
  and payment-worker state. Narrow booking function checks transaction UUID,
  owned active grant/credit/reviewed brief, 48-hour preparation and slot limits.
- Existing `maim`, `maim_ops`, Auth/customer rows and global Auth settings unchanged.
  Only the published cohort constants were seeded into the private TEST schema.
- Fresh provider catalog checks confirmed tables/RLS/roles/schema denial and
  migration history; post-migration security advisor returned no Academy notice.
  This is not proof that new login credentials or auth/payment journeys work.

The schema uses verified Supabase `auth.users.id` UUIDs. It does not apply the
historical Better Auth text-ID drafts or link/merge customer identities by email.
Only explicit, reviewed QA UUID registrations belong in `academy_testers`.

## Exact owner/provider steps still required

1. Provision three **separate, TLS-verified** application login credentials with
   only the matching TEST role membership. No superuser, BYPASSRLS, admin key,
   cross-role membership or MAIM/customer table grants. Runtime checks refuse
   elevated/mixed roles. Store connection strings directly in the branch-scoped
   Vercel secret variables below, never chat/Git. The NOLOGIN roles are installed;
   credential provisioning was deliberately not performed via logged SQL.
2. Privately verify whether the two authorized adult accounts already exist as
   email-confirmed Supabase Auth UUIDs. Register only those reviewed UUIDs in the
   TEST allowlist table. No automatic signup, user backfill, grant by email,
   permanent paid enrollment or customer modification is performed by this PR.
3. Verify existing Auth configuration already permits the exact Preview PKCE
   callback `/api/academy-auth/callback`, and that its current sender can deliver
   to the two QA addresses. Do not modify shared/global Auth settings. If it does
   not support this callback/sender, return for a separately reviewed solution.
4. The strong branch auth secret, existing modern publishable Auth key and exact
   verified branch origin are now configured securely. Enable member/email
   switches only for the controlled QA window after those checks.
5. Separately approve exact Academy purchase terms/privacy version and test
   consent notice; configure a restricted TEST key, the $249 TEST price and an
   Academy-specific signed webhook. Include completed, async-success, expired,
   charge-refunded and dispute-created events; do not reuse Blueprint secrets.
6. Verify the MAIM-domain sender/reply mailbox, private meeting/replay resources,
   actual lessons and coaching availability. No invitations or production
   payments may open on successful local checks alone.

## Safe rollout order and acceptance evidence

1. Sign in with each QA identity: PKCE correlation, one-time/expired/forged code
   rejection, opaque Secure/HttpOnly cookie, session revocation on sign-out.
2. Write A progress, read/export as B, forge A's UUID as B: denied by API and DB
   RLS; restart/pooled connection retains correct identity, never another user.
3. Explicit reservation consent: own UUID, notice version, server timestamp;
   retries do not create paid seats or enroll marketing. Existing public reserve
   and main-site Resend bridge remain unchanged.
4. Confirm real auth email delivery/inbox. Mock transport tests are not delivery.
5. Claim through application checkout, verify the fixed $249 USD amount and
   immutable terms metadata. Capacity shares one locked 20-seat cohort row;
   retries reuse stored payload and Stripe idempotency key. Never free an attached
   Session on a browser timer; only verified expiry or full refund releases it.
6. Signed paid webhook creates one grant/receipt job. Replay creates none twice;
   partial refund/dispute holds access; full refund revokes and cannot be undone
   by late completion. Exercise failures, event order and real concurrency hosted.
7. TEST receipt sending has its own off switch and QA-email/hash check. Durable
   accepted IDs prevent resending; uncertain/sending state requires operator
   reconciliation rather than another blind send. Provider acceptance != inbox.
8. Check private lessons, fixed Nov18 cohort calendar and private booking with
   48h brief/7-day refund/90-day session boundaries. Calendar API currently returns
   approved dates only; real meeting links/notifications/replay access are not
   configured or claimed. Rescheduling/courtesy/provider-extension lifecycle and
   human-reviewed complete lesson assets remain launch blockers.

## Rollback and cleanup

Disable all six branch switches; withdraw Preview and revoke only dedicated TEST
login memberships after draining pools. Revoke TEST app sessions; retain consent
and financial/recovery evidence. Never delete by email or drop shared Auth/MAIM
schemas. A reviewed application revert restores prior unavailable APIs. A schema
rollback is an explicit export/revoke/drop decision, not an automatic destructive
script. Do not remove audit history or reuse TEST roles for production.
