# Academy external QA test packet — approval required

Status: **prepared, not executed**. Local tests passing is not permission to run
this packet. External QA requires Major's separate GO after the exact immutable
PR head, protected Preview and restricted credentials are reviewed.

## Fixed test scope

| Field | Exact test value / boundary |
|---|---|
| Environment | Protected Vercel Preview for the exact candidate commit, connected only to the existing private `academy_test` schema in MAIM Ecosystem. Never Production. |
| Identities | `QA-A` and `QA-B`: the two existing adult-owned addresses already authorized privately. Their exact emails and Supabase Auth UUIDs stay in provider settings, not Git/chat. No newly invented customer identity. |
| Transaction mode | Stripe TEST only, restricted Academy key, Academy-specific webhook, fixed `price_qa` equivalent of USD 249.00. Never a live Payment Link. |
| Email recipient | Only `QA-A`, whose address must exactly match the private `ACADEMY_PILOT_EMAILS` entry and checkout customer email. One transactional TEST receipt maximum. No campaign or invitation. |
| Airtable | No calls and no records. `tbl1pPhCa6bx3ST3E` is **MAIM Follow-up Queue**, not Contacts, and is outside Academy QA. |

## Records and provider events allowed

1. Two reviewed `academy_testers` rows for QA-A/QA-B and short-lived Auth/app
   sessions for each.
2. One versioned `academy_reservations` consent row per identity; retries must
   remain one row and must not create a seat.
3. QA-A: one progress row, one reviewed synthetic preparation brief, one
   synthetic appointment slot/booking, and only rights-cleared synthetic lesson
   content. QA-B is used to prove isolation and must not read QA-A data.
4. Twenty synthetic TEST seat claims total for the concurrency boundary. Only
   QA-A may proceed to one Stripe TEST Checkout Session/payment; the remaining
   claims use dedicated non-customer QA UUID fixtures and create no email.
5. Stripe TEST events: one completed Session, exact replay of that event, one
   partial-refund or dispute hold, one full refund, one late completion replay,
   and one separate expired Session. Preserve provider event IDs as evidence.
6. One Academy receipt outbox row and at most one provider-accepted TEST receipt
   to QA-A. A timeout/uncertain result must not be blindly resent.

## Expected results

- QA-A and QA-B sign in independently; forged, expired and replayed callbacks
  fail. Sign-out revokes the app session.
- Cross-user progress, exports, lessons, briefs and bookings are denied by API
  and database RLS, including after pooled-connection reuse/restart.
- Interest-list consent is idempotent and consumes zero of the 20 paid places.
- Checkout claims 1–20 serialize; claim 21 returns unavailable/HTTP 409. Retry by
  the same user returns the same seat and provider idempotency result.
- Exact US$249 TEST payment creates one paid seat, one grant, one service credit
  and one receipt job. Event replay creates no duplicate.
- Signed expiration releases its temporary checkout place. Partial refund or
  dispute holds access and keeps the place; full refund revokes access/releases
  it; a late paid event cannot restore the refunded grant.
- Provider acceptance and QA-A inbox receipt are recorded separately. Neither is
  described as a campaign, production delivery or general launch readiness.

## Evidence packet

Record privately: immutable Git SHA/PR, Preview URL/deployment ID, schema/migration
versions, redacted QA UUID suffixes, HTTP results, seat counts by state, Stripe
TEST Session/PaymentIntent/Event IDs, receipt provider ID and QA-A inbox timestamp.
Never include cookies, connection strings, API keys, full emails or message body
containing personal data in Git.

## Cleanup and rollback

1. Disable all Academy Preview switches first; stop new sign-in, checkout,
   advisory and receipt actions.
2. Revoke QA app sessions and remove only the dedicated QA role memberships or
   `academy_testers` rows created/approved for this run after evidence review.
3. Expire or refund TEST Sessions through Stripe TEST controls; retain financial
   event, consent, refund and uncertain-delivery evidence.
4. Remove only synthetic lesson/progress/brief/slot/booking fixtures by recorded
   run IDs after owner review. Never delete by email, touch existing customers,
   truncate shared tables, drop the schema or reset Auth.
5. Withdraw the Preview candidate or revert the application commit if needed.
   Schema/data destruction requires a separate reviewed approval.

External QA remains blocked until the restricted database logins, exact private
QA-A/QA-B mappings, Auth callback/sender compatibility, Academy terms/notice,
Stripe TEST configuration, protected content and monitored sender are confirmed.

