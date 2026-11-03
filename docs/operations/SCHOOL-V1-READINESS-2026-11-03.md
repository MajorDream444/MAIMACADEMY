# School V1 — current truth and release gate

Date: 3 November 2026. Release: **HOLD**. Phase 0 inventory, before implementation.

| Surface | Observed state | Evidence / implication |
| --- | --- | --- |
| Academy source | VERIFIED | Main `eb4828ce64c6f77d8c6b1e5a7a2a7adff5cc18d8`; PR #39 merged, merge SHA `a45a387b5fc8fe8c863ff23fc43cf0908e28bbdc`. Planning charter, not School implementation. |
| Brand authority | VERIFIED | Main `278d882f3f3d8a32cd4e71f6e9dbcf11d0c68a5e`; Nov 1 founder decisions approve visuals, Sunday teaching and six projects. Operational readiness explicitly OPEN. |
| Parent architecture | VERIFIED source | Major-AI-OS `DESIGN.md` read via GitHub (blob `1b4d4c63e01c67c4b11fc3030da437a93c1445f6`). Academy-specific Nov 1 typography/square corners govern school. |
| Public front door | IMPLEMENTED source | Static build, reservation funnel and informational pathways. README and canonical architecture lag current member scaffold. No public changes in this slice. |
| Identity / entitlement | IMPLEMENTED LOCAL | `api/member.js`, `lib/member-runtime.js`: UUID allowlist sessions, preview-only configuration, three distinct restricted TEST role connections, RLS. Not hosted acceptance. |
| Commerce | IMPLEMENTED LOCAL / BLOCKED hosted | App-created TEST checkout, signed webhook/capacity/refund tests exist. Existing exact-SHA two-user acceptance packet still requires provider/identity/terms approval. No transaction or email executed here. |
| Database | BLOCKED live inventory | Supabase connector `list_tables` and `list_migrations` require a `link_id` not supplied by available discovery. Do not assume Oct 30 counts remain current. Existing migration has 15 RLS tables; school entities absent from source. |
| School / curriculum | PROPOSED at baseline | No school routes; generic 30-day content remains separate. Paid source mappings/teaching are not approved lessons. |
| Preview | NOT VERIFIED | PR #39 has a bot-reported Ready planning preview; not direct hosted runtime evidence. No preview created by this run. |
| Baseline | PASS | `npm ci --ignore-scripts`; `npm run check`: build, HTML lint, 50/50 tests. npm reports three moderate advisories; no automatic upgrade. |
| REA | BLOCKED / optional | Prior report is a different sandbox; current Mac Node 22.22.3 below reported minimum. No verified isolated sandbox; no installation or configuration changes. |

## Reconcile before customer-facing publication

1. Preserve older offer/Stripe/ICS records as evidence. `data/founding-cohort.json`, public home/reserve/journey and `.ics` still use Wednesday Nov 18/25, Dec 2/9, 14:00 UTC; Nov 1 approves Nov 18 orientation, Sunday Nov 22/29, Dec 6/13 teaching, Wednesday office hours, Dec 17 close. **Times, timezone, venue and links remain OPEN.** Do not carry old times into new dates.
2. Replay target: older 48 hours versus newer 24 hours. Confirm delivery capacity before making the promise.
3. Access: older no-routine-expiry journey versus 12 months of cohort workspace after close, 30-day export warning, durable credentials. Clarify continuing community/content entitlements and existing customer commitments; do not retroactively revoke grants.
4. Founder/legal review must approve reconciled public/checkout/terms/calendar copy before invitations. Review the existing standalone live Payment Link privately; never distribute it as admission.
5. Complete rights-cleared paid instruction, support inbox, booking/replay service, moderation, retention/privacy/consent and 20-person facilitation capacity.

## First implementation scope

Extend existing static site + server handlers, no framework replacement. Add a private school shell and a separate explicitly synthetic local walkthrough; additive TEST-only schema proposal; human-reviewed six-project workflow and opt-in peer feedback. No hosted migration, live payments, invitations, production push, cross-grants, or REA dependency. Local fixtures do not prove hosted identity/provider readiness.
