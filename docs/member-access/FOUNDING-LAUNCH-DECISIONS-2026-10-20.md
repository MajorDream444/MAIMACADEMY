# Founding launch decision sheet — 20 October 2026

Status: historical proposal sheet. Owner answers and current direction are recorded in FOUNDING-COHORT-2026-10-21.md; that record supersedes pending questions below. Final customer legal wording remains subject to review. Enrollment closed. Source of approved inclusions: FOUNDING-OFFER.md.

## Approved baseline
US$249 once; existing practitioners/business owners; 20 seats maximum; this journey and revisions; one 45-minute private session used within 90 days of enrollment; weekly implementation groups during the first 30 days; preparation reviewed before private booking. Advisory packages and Vault passes separate. Public Knowledge Sessions and live-build funnels remain deferred.

## Recommended operating choices — pending owner answers
1. Fixed cohort: announce an actual start date after readiness verification. Do not take payment against an unspecified start. Publish four group dates and timezone before purchase; reserve enough private appointment capacity for all 20 members within their windows.
2. Refund proposal: a simple seven-day request window from purchase, without requiring proof of effort. Keep private appointments outside that initial window. This is a business proposal, not a statement of applicable consumer law; do not publish or enforce before owner approval and jurisdiction review. Mandatory customer rights must be preserved.
3. Booking proposal: preparation brief at least 48 hours before the appointment; rescheduling at least 24 hours beforehand; one courtesy late change, followed by explicit review rather than automatic forfeiture. If Major cancels or available appointments cannot accommodate the 90-day window, offer replacement availability and extend the window. These rules are proposals.
4. Group privacy: do not record member disclosures by default. Prefer a separate teaching recap without participant details. Peer advice is optional; no member owes unpaid consulting.
5. Access wording: continuing access to the purchased journey and its revisions, separate from time-limited human support. Define a closure/export plan before describing duration publicly; do not promise unconditional lifetime hosting.

## Next interview — three decisions
- Which actual cohort start date and weekly group day/time work for Major? Use Asia/Makassar and publish member-friendly timezone conversions.
- Does Major approve the proposed seven-day refund window, or prefer another approach?
- Does Major approve the proposed 48-hour brief, 24-hour rescheduling rule and one courtesy late change?

No unanswered proposal is treated as approved. Keep policy-version acceptance unavailable until the final text is reviewed.

## Implementation sequence
1. Capture owner answers in FOUNDING-OFFER.md and a versioned customer-facing policy; complete necessary jurisdiction review before publishing legal terms.
2. Reconcile Academy identity with canonical MAIM Supabase auth/entitlements; isolate private Academy data and enforce access on the server.
3. Configure preview-only secrets and test checkout. Bind purchase to verified identity, enforce a single 20-seat pool across campaign prices, and expire abandoned reservations.
4. Test payment replay, failed/out-of-order events, refunds/access holds, two-user isolation, private lesson access, credits and competing booking requests.
5. Verify actual lesson completeness, rights, welcome delivery, support calendar and owner booking capacity.
6. Return preview URL, commit, test evidence and remaining gaps. Request launch approval only when the release is concretely reviewable. Live prices remain archived; do not bypass earlier activation rejection.

## Copy and paste — Codex implementation owner
Continue MAIMACADEMY PR #7 on work/member-pilot-readiness-2026-10-20. Read FOUNDING-OFFER.md, CANONICAL-DATABASE.md, LIVE-CATALOG-RECEIPT-2026-10-20.md and this decision sheet. Approved offer is US$249 once, cap20, one45-minute session within90days and groups in first30days. Operational proposals in this sheet are not final policies. Preserve other agents' work. Next technical task is identity/entitlement reconciliation against the existing canonical MAIM schema, then a reviewed isolated migration and preview-only test flow. Do not apply Better Auth text-ID SQL against Supabase UUID identities unchanged. Do not activate live checkout or treat local tests as hosted verification. Report exact evidence and unresolved owner decisions.
