# ADR: Supabase UUID identity in a private Academy TEST schema

Status: implementation candidate; independent migration review required before
hosted application. Founder approved use of a private TEST schema in the existing
MAIM Ecosystem project on 26 October 2026. No production cutover is approved.

## Decision

Use Supabase Auth's verified `auth.users.id` UUID as the only Academy identity.
Do not create Better Auth user/session tables, cast text identities, or merge
accounts by matching email. Historical draft SQL remains reference-only.

New application tables live in `academy_test`, not `public`, `maim` or `maim_ops`.
Three NOLOGIN roles separate member requests, authentication/session handling,
and Stripe worker writes. Provider-owned login credentials are provisioned
separately and never embedded in the migration. No browser receives database or
service-role credentials. No Data API exposure or global Auth changes are made.

The private preview accepts only two owner-authorized adult QA emails and UUIDs.
Operator-reviewed UUIDs are registered explicitly in the TEST schema; no customer
lookup/backfill by email is performed. Supabase verifies passwordless sign-in;
the server exchanges PKCE and issues a short-lived opaque HttpOnly app session.
Only hashes are stored. Each member transaction sets a local UUID claim, enforced
again by RLS. Authentication and payment worker connections have separate grants.

## Preconditions and boundaries

- Schema/role migration independently reviewed before application.
- Use the existing project only with this private schema and TEST roles; existing
  customer records, MAIM tables and global Auth settings remain unchanged.
- Compatible existing Supabase preview callback configuration and sender behavior
  must be verified. If absent, stop; do not change global Auth configuration.
- Only already provisioned authorized QA identities may sign in; no automatic
  signup. Missing identities require a separately reviewed account-owner action.
- Restricted DB login provisioning, TEST Stripe/sender credentials and exact
  legal approval remain prerequisites; do not substitute shared admin credentials.
- Public pages/assets/reservation bridge, offer $249/cap20 and November 11/18
  decisions are preserved. Backend test reservation consent is a separate ledger,
  not a paid order, marketing enrollment or Airtable follow-up queue entry.

## Rollback

Disable the branch's member/email/payment/booking switches and withdraw Preview.
Revoke the three dedicated login memberships after draining connections. Revoke
TEST sessions. Retain payment/consent evidence. Do not drop shared schemas or
auth.users, delete by email, or modify MAIM tables. Only drop `academy_test` and
its dedicated roles after an explicit reviewed export/cleanup decision.

## Founder infrastructure reconciliation — 26 October 2026

Major confirms one shared MAIM Ecosystem project for Academy, Ten Pillars and
MAIM applications. Do not create additional Supabase projects or a paid branch.
The former Vercel marketplace attachment was removed, per direct founder report;
explicit application configuration must be inspected rather than assuming any
credentials are injected. Major-AI-OS is canonical source/operational authority;
Academy implementation remains MAIMACADEMY for this scoped work. Future reviewed
consolidation into Major-AI-OS and alignment of Major AI Mindset are intended,
not authorization to copy, merge or clone repositories now.
