# Private pilot database verification — 20 October 2026

## Implemented
Pinned development-only @electric-sql/pglite 0.5.10 and added tests/database/schema.test.mjs to npm test. The tests execute the actual draft application SQL in embedded PostgreSQL, including the PL/pgSQL credit trigger and GiST exclusion constraint. No hosted database is changed.

Verified: active journey credit creation and 90-day duration; payment-key replay does not duplicate grants or credits; held/vault grants issue no advisory credit; vault expiry, day bounds and user foreign keys; review evidence; appointment duration, overlaps and adjacency; each booking uniqueness constraint independently; transaction rollback.

## Limits
The user table is a minimal fixture, not the generated Better Auth schema. Tests do not prove real email authentication, API user isolation, webhook fulfillment, pg connection-pool behavior, multi-connection races, hosted permissions, backup or recovery. They do not validate cohort-capacity enforcement. These remain pending in PILOT-ACCEPTANCE-2026-10-20.md.

## Historical connected-service preflight (superseded below)
Vercel hamal-agi / maimacademy: no environment variables configured.
Supabase lists one generically named inactive project, MajorDream444's Project. Its ownership purpose is unverified; it was not resumed, modified or selected for Academy data. No dedicated Academy database was discovered. Do not reuse another ecosystem/client database based on account membership alone.

## Next operator task
Use the owner-selected MAIM Ecosystem project njpdlomvyalxrkluaige with an isolated Academy schema and restricted runtime role; reconcile existing Supabase identity and entitlement ownership before applying any draft SQL. See CANONICAL-DATABASE.md. Keep credentials in preview-only Vercel configuration. Use ENVIRONMENT.md for required variable names. Generate the pinned Better Auth schema, review application SQL and hosted permissions, then run the real two-user/session and booking-race checks before enabling the pilot. Do not put secrets into Git, a PR or chat.

Local verification: npm run check passed (9 pages, HTML validation, 26 tests including the parent database test and 7 subtests). The modified per-constraint booking checks were also rerun. Sales remain disabled. The owner approved the US$249 one-time founding price; approval does not activate checkout. See FOUNDING-OFFER.md and LIVE-CATALOG-RECEIPT-2026-10-20.md.

Reference: https://pglite.dev/docs/api
