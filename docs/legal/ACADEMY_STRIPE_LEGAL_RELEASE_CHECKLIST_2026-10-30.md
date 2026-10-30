# Academy Stripe legal page release checklist — 2026-10-30

**State:** REVIEW CANDIDATES ONLY. Do not use draft text as effective terms, enroll customers or activate payments.

## Strict account boundary
- **M.A.I.M. ACADEMY Stripe**: `acct_1TLgn2BaiziDnHMm` owns MAIM / Academy payment link `plink_1UTCv1BaiziDnHMm5khsHi4K`.
- **AMA SOL AGI**: a separate Stripe account. Do not set `amasolagi.com` or AMA-specific policies in Academy Stripe by mistake.
- Stripe dashboard account selection persists independently of link navigation. In dashboard switcher, explicitly select **M.A.I.M. ACADEMY** before changing its public business details.

## Proposed dedicated Academy URLs after reviewed merge/deployment
- Business website: https://academy.majoraimindset.com
- Support: https://academy.majoraimindset.com/support.html
- Privacy: https://academy.majoraimindset.com/privacy.html
- Terms: https://academy.majoraimindset.com/terms.html
- Support email (confirm monitoring): contact@majoraimindset.com

These routes are NOT publicly available merely because this branch exists. They should only be used as effective checkout documents after owner/legal approval, publication and live HTTP validation. When approved, replace DRAFT banners/noindex, add immutable version URLs and capture agreed version in payment records.

## Existing source and approved program policies
- Existing MAIM main-site `/terms` applies to the **$250 Blueprint**, not Academy.
- Existing `/privacy` is an approval candidate for Blueprint/Main MAIM, not Academy authorization.
- `docs/member-access/FOUNDING-OFFER.md` and `FOUNDING-COHORT-2026-10-21.md`: $249 once; 20 cap; four 60-minute implementation sessions; one 45-minute private session used within 90 days; 7-day refund request; 48-hour preparation; 24-hour rescheduling with courtesy late change; replay review target 48 hours; continuing journey access without unconditional lifetime hosting.
- `data/founding-cohort.json` and `docs/decisions/MAIM_ACADEMY_SCHEDULE_REVISION_2026-10-25.md`: first live session Nov 18; remaining proposed Wednesdays Nov 25, Dec 2, Dec 9 at 14:00 UTC; host confirmation remains an open gate.
- No guarantee of revenue, employment or institutional acceptance.

## Required human review
1. Confirm exact legal provider name, registered address, governing law/venue and applicable consumer-protection language.
2. Confirm actual account controller, live processor data map, data retention/deletion periods and cross-border disclosures.
3. Confirm group recording notices, replay handling, parent/minor scope and actual support inbox monitoring.
4. Approve the final session calendar and refund/booking language.
5. Publish reviewed final legal pages and confirm HTTP200 and mobile accessibility.
6. Select M.A.I.M. ACADEMY Stripe account, set verified Terms of Service URL and Privacy URL under Public business details; set business website to Academy instead of AMA; enable required terms checkbox only after valid URL exists. Re-read link via API.
7. Prefer app-created, authenticated checkout (UUID identity, atomic 20-seat claim, agreement-version metadata, signed webhook, entitlement issuance). Standalone LIVE Payment Link must remain out of invitations until reconciled; account-level ToS checkbox alone does not solve this.
8. Live link dates were corrected on Oct 30 in Stripe hosted confirmation, and account link still ACTIVE / completed 0 of 20; no purchases initiated in this change.

## No alteration by this branch
No Stripe account settings, links, prices, live payments, production release, runtime environment, identity, or customer records are modified by this PR.