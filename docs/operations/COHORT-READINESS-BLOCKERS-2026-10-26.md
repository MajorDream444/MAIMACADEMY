# MAIM Academy cohort readiness — 26 October 2026

Status: **HOLD for payment activation and member launch.** This is a bounded
source/provider reconciliation, not hosted acceptance. Major-AI-OS remains the
website and release authority. MAIM Academy owns the cohort experience. Pillar
Scroll and the Ten Pillars collection remain separate products/workstreams.

## Actionable blocker table

| Priority | Blocker | Direct evidence | Owner | Smallest reversible next step | Acceptance check |
|---|---|---|---|---|---|
| P0 | Member runtime is not operational | PR #24 is merged, but its protected member and checkout endpoints have no completed hosted sign-in, purchase, email, booking, signed-event or refund journey | Codex + Major | Provision only the three restricted TEST database connections and approved QA identities; keep all release switches off | Two authorized adults complete isolated A/B sign-in and access checks with no cross-user access; exact commit and protected preview recorded |
| P0 | Academy checkout/capacity is not release-ready | Merged code atomically protects one 20-place pool; local tests cover seat 21 and verified expiry, but no real Stripe TEST Session/concurrent hosted run exists | Codex + Major | Execute the separately approved external QA packet in restricted TEST only | One idempotent TEST purchase grants one entitlement; replay does not duplicate; seat 21 is rejected; signed expiry/full refund releases one place. No live charge |
| P0 | Any active Academy payment link would bypass the approval gate | Repository evidence records the Academy founding live price as archived and says no new live payment link was created, but current Stripe link state was not re-read in this pass | Major / commerce owner | Read-only Stripe inventory immediately before release review; do not create, activate or distribute a link | Evidence shows no active Academy link before approval. Any active link keeps release on HOLD until intentionally disabled by an authorized owner |
| P0 | Reservation persistence is only partially evidenced | Public `/reserve` routes to the main-site subscribe endpoint. Read-only OPTIONS returns the Academy origin and live route checks return 200, but no synthetic or real reservation was submitted in this pass; Airtable projection remains absent | Codex + provider owner | Use only the two approved QA accounts in the protected test lane after owner review | Provider receipt proves exactly one cohort-list membership and consent record; retry is idempotent; a guide-only response never claims reservation |
| P1 | Payment-invitation and confirmation copy previously implied certainty | Public source said payment links would arrive/go out on 11 November even though the date is subject to readiness approval | Public site owner | Merge this copy-only fix after review | Built pages preserve 11 November as the earliest gated invitation date, 18 November start, US$249 once and 20-seat cap; no unconditional delivery claim |
| P1 | Replay/member delivery is not configured end to end | PR #24 states private meeting/replay delivery is not configured; local walkthroughs and mocks are not hosted delivery evidence | Delivery owner + Codex | Configure protected delivery only after member runtime approval; retain the 48-hour target as a target | Authorized QA user can access a rights-cleared private replay and loses access correctly on hold/refund; evidence is redacted |
| P1 | Reservation and cohort navigation need hosted regression evidence after the next release | Current read-only checks: Academy `/` and `/reserve` return 200; main-site `/academy` and `/reserve` redirect to their Academy destinations; Academy-origin subscribe preflight returns 204 | Public site owner | Deploy an approved immutable preview, then rerun the existing real-browser QA | 390px and desktop: no overflow, menu works, CTA reaches `/reserve`, form outcome is truthful, console/network/CSP clean, exact SHA recorded |
| P2 | Later three session dates still need host confirmation | Founder fixed the 18 November start; 25 November, 2 December and 9 December are derived continuation targets | Major | Confirm or revise the three continuation dates before calendar invitations/onboarding | One signed-off schedule is reflected in data, ICS, public copy and unsent onboarding drafts |
| P2 | Rights-cleared curriculum and service capacity remain incomplete | Founding-offer authority lists complete lessons, appointment availability, support terms and rights review as pre-sale gates | Major + curriculum/delivery owners | Inventory the exact launch lessons and 20-member support capacity without publishing them | Rights/source status, owner, delivery location and capacity evidence are complete for every promised item |

## Reconciled public-route evidence

- Source base: `main` at `9534e9cf638cc1c446d9cd6a1e15029ad78b6881`.
- Open dependency: draft PR #24, member backend stabilization. This change does
  not copy or replace that work.
- Read-only live checks on 26 October 2026: Academy `/` and `/reserve` returned
  HTTP 200. Main-site `/academy` and `/reserve` each redirected once to the
  corresponding Academy route and returned HTTP 200.
- Academy-origin preflight to the main-site subscribe endpoint returned HTTP
  204 with `Access-Control-Allow-Origin: https://academy.majoraimindset.com`.
- `npm run check` passes the static build, HTML validation and all local tests.
  The optional `scripts/qa-ux.mjs` browser rerun is blocked in this clean
  checkout because Playwright is not a declared/installed dependency. No new
  framework was installed; the 25 October browser evidence remains historical.
- No form was submitted, no subscriber/customer record was read or changed,
  and no hosted reservation success is claimed.

## Fixed in this branch

- Payment invitations are described as no earlier than 11 November and always
  conditional on release approval.
- The reservation page says an interest-list record is not a guaranteed paid
  place and that the form charges nothing.
- Replay publication is a target, not a completed delivery claim.
- Member sign-in is explicitly described as planned and not operational.
- Regression tests prevent unconditional payment-link/replay claims while
  pinning the approved price, cap, dates and reservation route.

## Release boundary and rollback

Do not activate Stripe, send invitations, publish private lessons, enroll
customers, change production data or merge automatically. If this copy is not
approved, revert only this focused commit; no schema, provider configuration,
subscriber history or artifacts are affected.

