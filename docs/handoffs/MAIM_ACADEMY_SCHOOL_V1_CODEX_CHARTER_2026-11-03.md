# MAIM Academy School V1 — Codex execution charter
Date: 2026-11-03. **Status: implementation proposal, not launch authorization.**

## Vision and separation
Build an independent MAIM Academy learning/community platform behind the existing public Academy website; **do not purchase or clone Skool**. Preserve the useful patterns (community, classroom, calendar/live events, paid memberships, meaningful recognition) and build MAIM-specific project work, cohorts, peer/facilitator feedback and demonstrated results. “Learn together. Build together. Grow together.”

MAIM = movement, philosophy and free discovery. Academy = practical learning, school, projects, community, credentials. Spark Lab = bounded applied experiments. Foundry OS = separate work evidence and advanced pathway, no automatic grant. AMA Solutions = distinct consulting/product business. No cross-system permissions or client data sharing.

## Canonical authorities (read first)
- `MajorDream444/MAIMACADEMY`: `docs/CANONICAL-ARCHITECTURE.md`, `docs/member-access/FOUNDING-OFFER.md`, `api/member.js`, `api/academy-checkout.js`, `api/academy-webhook.js`, `lib/member-runtime.js`, `data/major-moves.json`, `docs/operations/EXTERNAL-QA-TEST-PACKET-2026-10-27.md`
- `MajorDream444/MAIM-Academy---brand`: `handoffs/FOUNDER_DECISIONS_2026-11-01.md` is the **newer founder decision authority**; `brand/FOUNDATION.md`, `handoffs/CLAUDE_DESIGN.md`, approved assets and 20 `design/*.dc.html` templates, including onboarding, lesson/workbook, project submission, community recognition, credentials, schedule and completion.
- `MajorDream444/Major-AI-OS`: upstream public site, MAIM design tokens and approved brand architecture.
- Canonical Supabase: `njpdlomvyalxrkluaige`, existing restricted Academy TEST schema. No new project.
- A longer source-grounded Codex V1 handoff is available separately as `MAIM_ACADEMY_SCHOOL_CODEX_V1_HANDOFF_2026-11-03.md` (supplied in conversation); request its content if not mounted. Do not assume the user's Downloads folder retains it.

## **Critical founder decision / calendar supersession**
Nov 1 approved schedule is **not** the older four Wednesday group sessions: Nov 18 orientation + office hours, Sunday sessions Nov 22/29 and Dec 6/13, Wednesday office hours, Dec 17 cohort close. Six projects: Audit taught Nov 22/due Nov 24; Design Nov 22/due Nov 27; Prototype Nov 29/due Dec 1; Test Nov 29/due Dec 4; Ship Dec 6/due Dec 8; Measure Dec 6/due Dec 12; Dec 13 showcase. Exact live times/timezone/platform are still open. **Do not silently alter customer-facing Stripe dates, invitations or legal agreements**; surface/reconcile older calendars first.

Founder approved: $249 one time, 20 capacity, 45-minute private within 90 days, replays target 24h, payment invite seat hold 72h, readiness SLA 2 workdays, project review SLA 3 workdays, 12-month access to cohort work after close and 30-day export notice. Certificate and badge only when all 6 projects accepted, 4 sessions live/replay+takeaway, final showcase and evidence saved; peer feedback first, human facilitator decision. Community contributions recognized separately. No accredited credential or earned-income guarantees. Academy ABCs Vol 2 are workshop themes not forced alphabet sequence; begin Audit → Design → Prototype → Test → Ship → Measure.

## School V1 modules
1. Protected School Home dashboard: current work, progress, next session, feedback.
2. Classroom: approved lessons, read/hear/see/do, action/reflection/artifact and version/publish state. **Do not treat current 30-day generic ABC roadmap as approved paid cohort lessons**; all 30 generic source mappings are open. Separate manifest for paid practitioner cohort.
3. Six-project private workspace: draft/submitted/peer feedback/facilitator review/revisions/accepted with evidence history; explicit sharing controls.
4. Cohort community: introductions, daily moves, questions, wins, showcases; posts/replies/reactions, pinned facilitation, reporting/moderation. Private project work never auto-public.
5. Calendar/meeting/office hours and included private session; restricted replay, attendance or reviewed replay takeaway, no invented Meet links.
6. Member progress/export and separate contribution recognition vs actual verified performance credential.
7. Facilitator dashboard: submission queue, comments, SLA timers, session roster, moderation, explicit credential decision and audit trail.
8. Cohort-to-alumni transition preserving governed access. No subscription, AI tutor, Foundry passport, token reward or public minors in V1.

## Design implementation
Preserve the existing public front door. Reuse approved Academy crest/small mark, Archivo 900 sentence-case headings, Archivo 400–600 body, JetBrains Mono labels, gold CTA, restrained Jamaica green/gold/blue tri-bar, Academy square corners, accessible readable content layouts. Implement from the brand repo's approved 20 templates; no speculative redesign or Skool copy.

## Security/commerce
Existing member runtime is intentionally preview-only with 3 distinct restricted TEST DB roles, UUID identity and RLS. Do not bypass this. Stripe M.A.I.M. Academy is separate from AMA. Standalone live Payment Link is NOT verified as member admission and must not be used in invitations. Implement/test app-created Stripe TEST checkout with seat claim, signed webhook, grant, refund/revocation and idempotency, authorized QA A/B, actual supported receipt inbox. No live payments or provider writes without separately approved scope.

## Sequenced implementation and gates
- **P0** Inventory current main/PRs/assets/migrations/envs; compare approved Nov 1 schedule vs stale website/Stripe. Report verified/local/mock/proposed/blocked.
- **P1** Build branded protected school shell on feature branch, with fixtures and mobile/desktop QA; do not touch public funnel.
- **P2** Draft reviewed paid curriculum manifest and first seven lessons; six projects with rubrics; TEST-only storage/permissions and human acceptance.
- **P3** Test real authenticated user lesson/progress, project submissions/feedback, private community, facilitator and learner isolation, export.
- **P4** Authorized bounded Stripe TEST checkout → seat → grant → protected lessons → refund; calendars/replays/booking, exact SHAs and provider receipts.
- **P5** Final GO/HOLD with legal, content, service capacity, privacy, support inbox, calendar, QA and rollback.

REA is optional: install and verify in **Codex sandbox** before any use; doctor+controlled test required. Only analyze the user's owned repo/site build or licensed local fixtures. Never scrape private Skool features or extract third-party proprietary code. No REA tool results means no claim of analysis.

**Deliver:** reviewed PR(s), exact pinned SHAs, screenshots, test commands/logs, A/B access evidence, unresolved approval blockers, rollback instructions and a candid HOLD until founder explicitly authorizes production activation.