# Founding member foundation — review record

Status: code foundation and visible design preview; NOT an enabled paid learning service.
Branch: work/founding-member-access-2026-10-19. Stacked on journey funnel PR #4 at 2409997a02982820244e5a8d473b36e36306d616. Main/Codex/funnel branches preserved.

## Decisions and boundaries

Reuse Vercel hosting and MAIM design. Keep the existing Major-AI-OS blueprint payment product and its Airtable/Resend workflows unchanged. The Academy has no deployed learner auth or private database to reuse. This branch proposes Better Auth 1.7.11 with a private PostgreSQL database; no provider account, database, schema, secret, email flow or additional spend was provisioned. New dependency versions are pinned. Auth/session handling uses the library, not custom signed cookies. Sign-in delivery adapter uses Resend only after explicit feature enablement and an email allowlist. No messages were sent during development.

Routes:
- /member-preview: public, clearly labeled design walkthrough using only the already public Day 1 sample. Native reflection disclosure, empty portfolio and proposed vault terms. No simulated live account or saved progress.
- /sign-in: sign-in interface; disabled API returns 503 until configured. Pilot emails must be allowlisted. No passwords collected.
- /member-room: public shell only; private data and lessons come from authenticated /api/member, never static bundles.
- /api/academy-auth/*: Better Auth adapter with hashed, five-minute magic links and database-backed rate limits.
- /api/member: verified session, server-derived user ID, journey access check, published lesson fetch, private progress save and export. JSON/plain-text lesson rendering prevents HTML injection. Export remains available to a signed-in user even without an active grant.
- /api/academy-checkout: TEST ONLY, one-time Checkout Session, server-selected price, verified account, matching approved amount and terms version. No browser-provided SKU/amount/identity accepted. Price remains unset.
- /api/academy-webhook: raw-body signature verification, paid test event validation, transaction and payment-scoped advisory lock, unique processed-event IDs and unique source-payment grants. Refunds/disputes place payment holds even if received before fulfillment; a later paid event cannot silently reactivate them. Partial refunds conservatively hold access pending manual review; policy needs owner review. Live events/keys not supported by this build.

Journey grants do not expire routinely and cover the journey's evolving lesson versions. Vault grants require a finite expiry; the policy checks expiry on each access decision. Calendar-month date helper clamps month ends. Selling/issuing vault passes and private vault content delivery are not implemented yet.

## Required integration work before pilot

1. Choose an isolated development Postgres database, private runtime role and HTTPS origin; configure preview-only secrets without pasting them in chat.
2. Generate/apply Better Auth schema with a version-matched CLI after inspecting its help. Include database rate-limit storage. Review/apply docs/member-access/schema.sql separately; it is a draft, not an applied migration.
3. Run real DB/session integration tests: magic link expiry/single-use, verified identity, sign-out, restart persistence, two-user read/write/export separation, transactional webhook concurrency/retry/out-of-order refund, DB outage/recovery, delete/export and retention behavior. None is claimed passed from unit tests.
4. Add rights-cleared, complete reviewed lessons to private DB. Current published-draft JSON in Git history is not protected paid content. No private lesson imported.
5. Confirm offer amount, access/refund/support terms, pilot consent/age scope and private payment sandbox; configure test price/webhook endpoint and approved email test recipients. Run test purchase/refund/dispute and real delivery checks.
6. Member account deletion UI, retention automation, link recovery tests, abuse controls and private artifact upload are still OPEN. This branch stores short reflections/progress, not uploaded portfolio files.
7. Live commerce requires a separately reviewed release. Do not flip live flags: this implementation deliberately supports test keys only.

## Security / operational notes

All member/auth/payment responses are private no-store and vary by Cookie. Secrets/database connection remain server-only. CSRF origin enforced on member writes/checkout; Better Auth handles auth origin/cookies. Private DB tables have no public role grants; all application queries are parameterized and scope by verified user ID. This is a private SQL connection, not a Supabase Data API integration. No service-role key in clients. Default member feature flag is off, so new APIs return 503 without opening connections.

CSP script-src and connect-src change from none to self to allow one same-origin external member client; no inline/eval/third-party scripts. Existing public routes receive no scripts. Existing /api/checkout static unavailable response is retained. New test endpoint is /api/academy-checkout.

## Verification

npm run check: build, HTML validation, build-script syntax and 13 Node tests PASS. npm audit: zero reported vulnerabilities. Tests cover user/resource separation, held/revoked/future/exact expiry, month-end terms, mismatched/unpaid/live purchases, caller-supplied owner rejection, bounded reflections, configuration-off API responses and static data leakage. These are NOT actual database, Stripe account or email delivery tests. Browser/preview receipt is in the PR.

## Rollback

Withdraw this stacked PR and keep the reviewed funnel commit. No production site, DNS, source authority, provider config or actual learner data needs restoration. Before a later enabled release, take a private DB backup and document forward/revert migration behavior.

## References checked

- https://better-auth.com/docs/plugins/magic-link
- https://better-auth.com/docs/concepts/database
- Installed better-auth/node exports inspected for toNodeHandler/fromNodeHeaders.
- https://docs.stripe.com/checkout/fulfillment.md?payment-ui=stripe-hosted
- Existing Major-AI-OS apps/maim-site/lib/commerce.ts and api/stripe-webhook.ts reviewed read-only; not repurposed to sell a different offer.
