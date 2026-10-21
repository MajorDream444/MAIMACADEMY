# Walkthrough acceptance and private pilot gate — 20 October 2026

## Accepted
Major approved the draft walkthrough in conversation and instructed continuation on 20 October 2026. This records owner acceptance of the demonstrated experience, not certification of unconnected services.

| Check | Result | Evidence |
| --- | --- | --- |
| Owner walkthrough acceptance | PASS | Owner instruction: "Looks good. Mark everything as passed and let's continue." |
| Preview deployment | PASS | Commit 5f3fce6; Vercel dpl_J2jXXNPge1gKFVNookGtAtJwvuYs READY |
| Local build | PASS | npm run check, 20 October: 9 pages built |
| HTML validation | PASS | npm run lint within check |
| Automated tests | PASS | 18 passed, 0 failed |
| Live account, payment and reservation integration | PENDING | No Academy environment configuration; not exercised |
| Paid launch | HOLD | Price/terms, capacity and integration gates remain open |

The walkthrough is fictional, in-memory and resets on refresh. Simulated approval and booking do not exercise real authorization or database concurrency.

## Next build: isolated member pilot
Preserve the approved one-time founding journey, 20-person cohort, one 45-minute private session usable within 90 days of enrollment, and implementation groups for the first 30 days. Additional advisory is sold separately in three-session packages. Vault passes are separate future products. Public knowledge webinars/live builds are outside this workstream.

Verified preflight: the maimacademy project in Vercel team hamal-agi returned zero environment variables on 20 October 2026. Do not reuse a different client's database or credentials. Use docs/member-access/ENVIRONMENT.md as the configuration inventory; secrets must remain outside Git and chat.

### Integration acceptance tests
1. Provision an isolated test database and apply reviewed schema plus auth migrations. Record migration versions and rollback approach.
2. Sign in two allowlisted adult test accounts. Verify email-link expiry/reuse handling and session ownership; a logged-out request must fail.
3. For accounts A and B, verify neither can read or modify the other's progress, briefs, credits or reservations, including by supplying alternate IDs.
4. Exercise a matched Stripe TEST purchase. Confirm amount, currency, price, identity and agreement version before granting access. Re-deliver the event: no duplicate grant/credit.
5. Test refund-before-purchase and purchase-before-refund delivery order, unmatched prices, invalid signatures and live-key rejection.
6. Enforce cohort capacity of 20 transactionally; concurrent final-seat purchases must not over-enroll. Define checkout reservation/expiry and handling for payment received without a seat before enabling sales.
7. Submit a preparation brief. Confirm a learner cannot self-approve; only a reviewed owned brief permits booking.
8. Concurrently request the same credit and same slot from separate sessions. At most one reservation succeeds. Test overlapping slots and 45-minute duration.
9. Verify boundaries for 30-day group access and the private session's 90-day enrollment window, separately from continuing journey content access.
10. Implement and verify cancellation, no-show, completion and refund-credit rules after owner policy decisions; do not invent financial or service commitments.
11. Verify transactional email and calendar behavior only with test recipients and explicit test slots. Confirm retries cannot duplicate bookings/messages.

### Remaining owner decisions before sales
- One-time founding price and currency.
- Published refund and service terms, including cancellation/no-show policy.
- Cohort start date and actual availability.
- Three-session package price and expiry.

Private-pilot integration work can proceed independently of setting a sale price. Production payment activation remains outside this approval.
