# Academy founding-cohort capacity contract — 27 October 2026

Authority: founder decisions preserve **20 paid founding places**, US$249 once,
payment invitations no earlier than 11 November after readiness approval, and
the 18 November cohort start. This record clarifies what the existing atomic
database rule means; it does not activate checkout.

## What counts toward 20

| State | Counts? | Reason |
|---|---:|---|
| Public interest-list reservation | No | It records interest/consent only and does not guarantee a paid place. |
| Protected Academy reservation consent | No | `academy_reservations` is a consent ledger, not a seat ledger. |
| `pending` application checkout claim | Yes, temporarily | Prevents two people being offered the final place while checkout is being created. |
| `checkout` Stripe TEST Session | Yes, temporarily | The place remains protected until a signed provider event verifies expiration. |
| `paid` enrolment | Yes | This is an active paid founding place. |
| `held` payment/access state | Yes | A dispute or partial refund does not silently resell the same place while ownership is unresolved. |
| Signed checkout expiration | No | Verified provider expiration changes the seat to `expired`. |
| Full refund | No | The terminal refund changes the seat to `refunded` and revokes access. |

`academy_test.claim_seat` locks the single cohort row, reuses the same person's
existing active claim, counts `pending`, `checkout`, `paid` and `held`, and
rejects claim 21 before inserting it. Public reservations never call this
function. Payment/refund/expiration processing takes the same cohort lock, so
seat admission and release share one serialization boundary.

An attached checkout Session is never released by a browser timer. A `pending`
claim with an ambiguous provider timeout is deliberately retained for retry with
the same stored payload and idempotency key; operator reconciliation is required
before any manual release. This avoids converting an uncertain provider result
into an oversell.

Local PostgreSQL coverage now verifies that 21 interest reservations create no
seats, claims 1–20 succeed, claim 21 fails, a signed expiration releases exactly
one place, and the next claimant can take that place. Hosted concurrent-provider
behavior remains external QA, not a local acceptance claim.

