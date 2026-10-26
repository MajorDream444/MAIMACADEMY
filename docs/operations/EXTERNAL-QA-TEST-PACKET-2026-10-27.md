> 27 October reconciliation: this broader/historical packet is **not** the
> BPT-save/reservation-provenance run. Use the narrowed packet in Major-AI-OS
> `docs/qa/MAIM_FUNNEL_TEST_PACKET_2026-10-27.md` and its immutable code pins.
> No external run is approved. Simulation is not human-inbox receipt.
> Academy sign-in/concurrency/Stripe/refund/revocation remain a separate run.
>
> PR #28 is merged as `d7f6a0f496097d936fdd0294e78116079c47283c`.
> Its former candidate references are retained below as historical test
> receipts, not as permission or a current acceptance pin. PR #29 is the only
> current Academy follow-up. The PR #29 body must name its exact 40-character
> head after this packet commit. External QA remains blocked unless Vercel has
> a READY, access-protected Preview whose Git metadata matches that exact head.

# Academy external QA test packet — approval required

Status: **prepared, not executed**. Local tests passing is not permission to run
this packet. External QA requires Major's separate GO after the exact immutable
PR head, protected Preview and restricted credentials are reviewed.

**Git pin:** the single immutable acceptance SHA is recorded in the redacted PR
#29 body under `Acceptance candidate` after this packet is committed. Before any
run, compare that 40-character value with `git rev-parse HEAD`; they must match.
Any later head change invalidates approval and requires a new local test result,
packet review and pin. A branch name or Preview URL alone is not a pin. Git
commits cannot contain their own hash, so the PR receipt is the external pin for
the packet committed inside that exact SHA.

**Deployment pin:** there is currently no acceptance deployment for the exact
PR #29 head. Vercel directly reports protected Preview deployment
`dpl_GzagiUJ3Wm7mJkFxqgno92nEFw85` at
`https://maimacademy-q0mgfh1zw-hamal-agi.vercel.app`, but its Git metadata is
the earlier parent `2e5b778799694a3f7aa6526604254d0e72041223`. An unauthenticated
GET redirects to Vercel SSO, confirming access protection but not code parity.
It must not be used for acceptance of a later PR #29 head. A separately
authorized deployment of the exact candidate is required before any external
QA; recording this blocker does not authorize that deployment.

## Read-only deployed-gate snapshot

Observed 27 October 2026 without form submission, authentication, session
creation or provider writes:

- the public reservation page and form are exposed and explicitly say the
  reservation is free, does not guarantee a paid place, and that payment may
  open no earlier than 11 November after release approval;
- the public checkout descriptor returns `available: false`; the checkout API
  rejects GET, while auth/session, member and receipt APIs fail closed as
  unavailable;
- the sign-in page is public but labels member sign-in as planned and not yet
  operational; the member-room shell is public while its content starts hidden
  and the member API is unavailable;
- the cohort start is 18 November, the price is US$249 paid once and the public
  capacity claim is 20 spots; replay access is described only as planned after
  recording and review.

This is an exposure/configuration snapshot, not provider acceptance, successful
sign-in, reservation persistence, payment readiness, private-content delivery,
customer readiness or hosted end-to-end evidence. The public reservation form
is the only intentionally actionable public capture surface observed; it was
not submitted during this review.

## Origins and separation

| Surface | Origin contract | Allowed use |
|---|---|---|
| Local | `http://127.0.0.1:4173` from `npm run dev` | Static/local checks only; API responses remain stubs and are not acceptance evidence. |
| Academy Preview | Exact HTTPS origin supplied privately through `ACADEMY_ORIGIN`; `VERCEL_ENV` must be Preview | The separately approved Academy acceptance run only. |
| Production | No origin is permitted by the runtime guard | No Academy acceptance action, credential, payment, message or data write. |
| BPT | Separate application, credentials, tables, segments, offer and acceptance evidence | Explicitly out of scope; never combine with this Academy run. |

The Academy run covers sign-in, paid-seat concurrency rules, two Stripe TEST
Checkout Sessions, signed expiry/refund/revocation and one transactional receipt.
It does not exercise BPT assessment, Blueprint checkout, BPT contacts, BPT
follow-up, production reservations or marketing sends.

## Resource mapping — names only

No value belongs in Git, chat or the evidence packet.

| Resource | Configuration names | Exact boundary |
|---|---|---|
| Restricted PostgreSQL roles | `ACADEMY_DATABASE_URL`, `ACADEMY_AUTH_DATABASE_URL`, `ACADEMY_WORKER_DATABASE_URL`, `ACADEMY_DATABASE_SCHEMA`, `ACADEMY_IDENTITY_MODEL` | Three different Preview-only credentials; private Academy TEST schema; no admin/service role or BPT database credential. |
| Auth and aliases | `ACADEMY_SUPABASE_URL`, `ACADEMY_SUPABASE_PUBLISHABLE_KEY`, `ACADEMY_AUTH_SECRET`, `ACADEMY_PILOT_EMAILS`, `ENABLE_ACADEMY_MEMBERS`, `ENABLE_ACADEMY_AUTH_EMAIL` | Existing privately approved QA-A/QA-B only; no address printed and no user auto-creation. |
| Reservation consent | `ACADEMY_RESERVATION_NOTICE_VERSION` | Exact approved notice; missing/false consent or mismatched version is rejected. |
| Stripe TEST | `ENABLE_ACADEMY_TEST_CHECKOUT`, `ACADEMY_OFFER_APPROVED`, `ACADEMY_STRIPE_KEY`, `ACADEMY_STRIPE_WEBHOOK_SECRET`, `ACADEMY_JOURNEY_PRICE_ID`, `ACADEMY_PRICE_CENTS`, `ACADEMY_TERMS_URL`, `ACADEMY_AGREEMENT_VERSION` | Academy TEST objects only; no live key, Payment Link, Blueprint price or production endpoint. |
| Transactional receipt | `ENABLE_ACADEMY_RECEIPT_EMAIL`, `ACADEMY_RESEND_KEY`, `ACADEMY_EMAIL_FROM`, `ACADEMY_SUPPORT_EMAIL` | One allowlisted QA-A receipt maximum; no campaign/segment send. |
| Public Resend segments | `RESEND_SEGMENT_ID`, `RESEND_COHORT_SEGMENT_ID` | Not read or changed by this protected Academy run. |
| Airtable tables | `AIRTABLE_CONTACTS_TABLE_ID`, `AIRTABLE_FOLLOWUP_TABLE_ID`, `AIRTABLE_ORDERS_TABLE_ID`, `AIRTABLE_BASE_ID`, `AIRTABLE_PAT` | No Airtable call. Follow-up Queue is not Contacts; no Academy reservation/order projection. |

No disposable external table or segment is created. Disposable records exist
only inside the already-isolated Academy TEST schema and are identified by the
private run ID recorded before execution.

## Fixed test scope

| Field | Exact test value / boundary |
|---|---|
| Environment | Protected Vercel Preview for the exact candidate commit, connected only to the existing private `academy_test` schema in MAIM Ecosystem. Never Production. |
| Identities | `QA-A` and `QA-B`: the two existing adult-owned addresses already authorized privately. Their exact emails and Supabase Auth UUIDs stay in provider settings, not Git/chat. No newly invented customer identity. |
| Transaction mode | Stripe TEST only, restricted Academy key, Academy-specific webhook and the configured one-time USD 249.00 Academy TEST price. Never a live Payment Link. |
| Checkout Session limit | Exactly **two** Stripe TEST Checkout Sessions: `SESSION-PAID` for QA-A and `SESSION-EXPIRES` for QA-B. No third Session is permitted. |
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
4. QA-A creates `SESSION-PAID`; QA-B creates `SESSION-EXPIRES`. Repeating either
   application request must recover the same seat/Session through the stored
   payload and idempotency key. Exactly two `academy_seats` rows are permitted in
   the protected Preview database.
5. Exactly five unique Stripe TEST webhook events: completed `SESSION-PAID`,
   partial refund of its PaymentIntent, full refund of the same PaymentIntent,
   a new late-completion event for `SESSION-PAID`, and expiration of
   `SESSION-EXPIRES`. Send the original completed event once more with the same
   event ID to prove deduplication; that replay must not create a sixth event row.
   Do not use a dispute event in this run.
6. One Academy receipt outbox row and at most one provider-accepted TEST receipt
   to QA-A. A timeout/uncertain result must not be blindly resent.

## Step limits, consent and suppression

| Step | Maximum new external/runtime effects | Required negative/suppression case |
|---|---|---|
| Sign-in QA-A then QA-B | Two Auth emails, two app sessions | Non-allowlisted alias, forged/replayed/expired callback and wrong origin create no session. Stop before email if sender/callback is not already compatible. |
| Consent | Two consent rows total | `consent` missing/false and wrong notice version return rejection; retry creates no duplicate and no seat. |
| Checkout | Two TEST Sessions total, one per alias; one PaymentIntent total | Wrong price/product, live mode, missing consent, wrong origin and third Session request stop/reject. Same-alias retry reuses its seat/session. |
| Capacity | Zero shared capacity fixtures | The 20/21 proof runs in-memory only. Never create 19 shared Auth users/testers/seats. |
| Webhook recovery | Five unique event rows plus one identical replay | Invalid signature/live event rejected; duplicate event creates no new grant, credit, receipt or event row. |
| Receipt | One provider request/message to QA-A; zero to QA-B | Non-allowlisted recipient, email-hash mismatch, disabled switch, accepted state and uncertain state suppress sending/re-sending. |
| Public reservation/segments | Zero contacts, memberships, emails or segment mutations | Do not call the public subscribe flow or import Follow-up Queue/Contacts. Paid/refunded/ineligible suppression remains campaign QA, not this run. |

Resend provider acceptance means only that Resend returned an accepted message
identifier. Actual delivery requires a separate timestamped observation in the
privately approved adult QA-A inbox. A Resend test address, simulated transport,
mock response or provider acceptance must never be reported as inbox delivery.

## Expected results

- QA-A and QA-B sign in independently; forged, expired and replayed callbacks
  fail. Sign-out revokes the app session.
- Cross-user progress, exports, lessons, briefs and bookings are denied by API
  and database RLS, including after pooled-connection reuse/restart.
- Interest-list consent is idempotent and consumes zero of the 20 paid places.
- Retrying QA-A or QA-B returns the same seat and provider idempotency result.
- Exact US$249 TEST payment creates one paid seat, one grant, one service credit
  and one receipt job. Event replay creates no duplicate.
- Signed expiration releases its temporary checkout place. Partial refund or
  dispute holds access and keeps the place; full refund revokes access/releases
  it; a late paid event cannot restore the refunded grant.
- Provider acceptance and QA-A inbox receipt are recorded separately. Neither is
  described as a campaign, production delivery or general launch readiness.

## Deterministic 21st-capacity procedure

The 20/21 boundary runs **locally only** against the embedded PostgreSQL fixture;
it creates no Stripe Session, Auth user, provider record or email. Do not seed 19
fake identities into shared Supabase merely to imitate concurrency.

1. From the pinned commit, run
   `node --test tests/database/uuid-preview.test.mjs` in the isolated checkout.
2. The fixture creates 21 synthetic UUID identities and 21 consent reservations;
   assert seat count remains zero. These are in-memory `.invalid` fixtures only.
3. Claim seats for fixtures 1–20 through `claim_seat`; assert 20 active claims.
4. Call `claim_seat` for fixture 21 and require the exact database capacity
   exception. Assert no seat row was inserted for fixture 21.
5. Attach the synthetic Session ID to one claimed fixture and apply one signed-
   event-shaped expiration fixture. Assert that seat becomes `expired`.
6. Retry fixture 21; require one new `pending` seat and exactly 20 active-counting
   states. The test transaction/database is discarded when the process exits.

This is deterministic local proof of the atomic database rule. Hosted/provider
concurrency across 20 distinct approved identities remains pending and is not
smuggled into this two-recipient external QA window.

## Final expected protected-Preview records

Counts below are scoped to this QA run after all five unique provider events and
before cleanup. Pre-existing rows are inventoried separately and never counted
or changed.

| Store | Expected run-owned result |
|---|---|
| `academy_testers` | Two reviewed mappings: QA-A and QA-B; zero capacity-fixture identities |
| `academy_auth_sessions` | Two run-created app-session rows, both revoked by sign-out |
| `academy_reservations` | Two rows, one per QA alias; consent retry creates no duplicate |
| `academy_progress` | One QA-A synthetic progress row |
| `academy_lessons` | One rights-cleared synthetic published lesson row |
| `academy_briefs` / slots / bookings | One QA-A brief, one synthetic slot and one booking |
| `academy_seats` | Two rows: QA-A `refunded`, QA-B `expired` |
| `academy_payment_events` | Five rows; identical completed-event replay adds zero |
| `academy_payment_holds` | One QA-A row ending as `full_refund` |
| `academy_grants` | One QA-A journey grant ending `revoked` |
| `academy_session_credits` | One QA-A credit ending `revoked` |
| `academy_receipts` | One QA-A outbox row ending `accepted`; zero QA-B rows |
| Stripe TEST | Two Checkout Sessions, one PaymentIntent, five unique events |
| Resend TEST | One accepted receipt message to private alias QA-A; zero messages to QA-B |
| Airtable | Zero calls, reads or writes |

## Evidence packet

Record privately: immutable Git SHA/PR, Preview URL/deployment ID, schema/migration
versions, redacted QA UUID suffixes, HTTP results, seat counts by state, Stripe
TEST Session/PaymentIntent/Event IDs, receipt provider ID and QA-A inbox timestamp.
Never include cookies, connection strings, API keys, full emails or message body
containing personal data in Git.

Also record, without values: the configuration names reviewed, confirmation that
the three database URLs are distinct/restricted, all Academy feature switches
were Preview-scoped, production switches/configuration were unchanged, public
segment and Airtable call counts were zero, and the BPT run count was zero.

## Stop conditions

Stop immediately, disable the relevant Academy switch and preserve evidence if:

- `HEAD` differs from the PR body's immutable acceptance SHA;
- origin is not the exact `ACADEMY_ORIGIN` or `VERCEL_ENV` is not Preview;
- any database login is elevated, shared across roles, or reaches outside the
  private Academy TEST schema;
- either alias is absent from the private allowlist, a third recipient/Session is
  requested, or a real address would appear in Git/log output;
- price is not the configured one-time USD 249.00 Academy TEST price, a live
  Stripe object/key appears, or terms/notice versions differ;
- callback/sender compatibility would require changing shared Auth/global email
  configuration;
- capacity claim 21 succeeds before a verified release, idempotent retry creates
  a new seat/Session, or any state count differs from this packet;
- signature verification, replay protection, RLS isolation, refund revocation or
  receipt suppression fails;
- Airtable, public Resend segments, BPT resources or Production show any write;
- Resend acceptance lacks a provider ID, or actual inbox delivery cannot be
  distinguished from acceptance/simulation.

## Cleanup and rollback

1. Disable all Academy Preview switches first; stop new sign-in, checkout,
   advisory and receipt actions.
2. Confirm the two Sessions are terminal: QA-A fully refunded and QA-B expired.
   Do not create a replacement Session during cleanup.
3. Revoke exactly two run-created app sessions. Remove zero Auth users. Remove
   QA-A/QA-B from `academy_testers` only if this run added those mappings and the
   owner approves; otherwise leave the pre-existing reviewed mappings untouched.
4. Delete exactly one synthetic progress row, one synthetic lesson, one brief,
   one booking and one slot, in dependency-safe order, using the recorded private
   run/fixture IDs. Confirm each ID was created by this run before deletion.
   Do not delete by email.
5. Retain exactly two consent rows, two terminal seat rows, five payment-event
   rows, one full-refund hold, one revoked grant/credit and one accepted receipt
   row as audit/recovery evidence. Provider TEST objects and the single receipt
   message are retained under provider retention policy.
6. Expected removable capacity-fixture count in shared Preview: **zero**. The 21st
   test is in-memory and disappears with its local process.
7. Never touch existing customers, truncate shared tables, drop the schema or
   reset Auth. Withdraw the Preview candidate or revert the application commit if needed.
   Schema/data destruction requires a separate reviewed approval.

External QA remains blocked until the restricted database logins, exact private
QA-A/QA-B mappings, Auth callback/sender compatibility, Academy terms/notice,
Stripe TEST configuration, protected content and monitored sender are confirmed.

## Local suite receipts and count reconciliation

Run from the immutable candidate checkout:

- Full gate: `npm run check`
- Focused packet/capacity gate:
  `node --test tests/database/uuid-preview.test.mjs tests/site.test.mjs`
- Whitespace gate: `git diff --check origin/main...HEAD`

The reported totals are not competing claims. At commit `33f1f6b`, the full
suite had 49 tests. Commit `01ced0f` added one packet-contract regression, making
the full suite 50. “Focused 20/20” is the subset from the database-capacity and
site/packet files only at `01ced0f`; those same 20 tests are included inside the
50-test full run. Documentation tightening after that commit adds assertions to
the existing packet test rather than another test case, so the expected totals
remain focused 20 and full 50.
