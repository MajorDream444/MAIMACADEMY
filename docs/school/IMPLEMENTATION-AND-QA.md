# School V1 — first slice review packet

Status: **HOLD — local implementation and synthetic evidence only**. Feature branch `codex/academy-school-v1`, based on Academy `eb4828ce64c6f77d8c6b1e5a7a2a7adff5cc18d8`. Open PR inventory returned zero open PRs at inspection. Founder conditional GO on 3 November authorizes the isolated commit and draft PR only. No hosted preview is created by this candidate. PR #39 is a merged planning charter, not this implementation.

## What is implemented locally

- Existing static build and server API retained. `/school` and nested school routes rewrite to an authenticated server handler; no learner HTML/data is emitted until the existing session, membership, expiry and entitlement checks pass. A separate `ENABLE_ACADEMY_SCHOOL=true` flag is required in addition to existing restricted preview configuration. Production remains refused by the inherited runtime.
- Today, Classroom, Build Studio, Community, Live Sessions, My Progress and role-gated Facilitator Desk. Six project milestones with date-only founder schedule; no copied old UTC time or invented meeting link.
- Additive **unapplied** TEST migration: memberships, separately reviewed lessons, versioned private submissions, peer/facilitator reviews, immutable-to-member activity history, cohort posts/replies and moderator reports. Seven RLS-enabled tables; member mutations only through narrow functions, fixed search paths and explicit EXECUTE grants. No public/anon/authenticated Data API grants or new project.
- Submission revision loop, optimistic version checks, explicit opt-in sharing and withdrawal, no self-review or learner acceptance, new peer feedback required after revision, human reviewer/time receipt, scoped progress and self export after expiry/revocation. Community posts do not inherit submission text. Report/hide moderation exists.
- A separate seven-day editorial manifest and six draft project briefs. **Zero paid lessons seeded or published.** Existing ABC/Ten Pillars content and public funnel are unchanged.
- `/school-walkthrough` is explicitly synthetic, browser-local storage and role switching; it never calls member/payment APIs. It is not an authentication or privacy boundary. Use fictional data only. Export is labeled synthetic.

## Current verification

`npm ci --ignore-scripts`; baseline `npm run check`: **50/50**. Initial School `npm run check`: **64/64**; sharing regression follow-up: **65/65**; final conditional-GO candidate: **66/66**, including real embedded PostgreSQL schema/API tests. `git diff --check`: passed. Node 22.22.3, npm 10.9.8, macOS ARM64.

PostgreSQL/API tests cover absent configuration, anonymous/nonmember/expired/revoked denial, wrong-origin rejection, private draft isolation, forged owner/state/role writes, stale version conflicts, draft lesson direct-request denial, published synthetic lesson access, peer-first revision/acceptance, immutable reviewer evidence, peer-sharing withdrawal, cross-cohort isolation, discussion/report/hide, export ownership and denied definer execution by anon/auth roles. Existing checkout, signed-event/replay/refund, capacity and session tests remain passing. Embedded tests do **not** prove Supabase Auth, pooled hosted connections, real provider callbacks or hosted concurrency.

Browser flow under test: local synthetic dashboard → Audit submission with sharing consent → Peer B feedback → facilitator acceptance → Learner A progress shows 1/6 → downloaded JSON contains one accepted submission and two reviews. Download content inspected; local reload preserved the synthetic record. Revision/resubmit is additionally tested through the actual API handler against embedded PostgreSQL.

| Browser check | Result |
| --- | --- |
| Identity / meaningful content / no framework overlay | PASS: `School · MAIM Academy`, localhost walkthrough |
| Interaction | PASS: submission, peer feedback, human decision, progress and export |
| Console | No relevant errors in captured browser logs; final capture empty; mobile document width and scroll width both 390 px |
| Responsive | 1440×1000 desktop and 390×844 mobile, full-page screenshots outside repository |
| Browser path | Preferred Browser skill bootstrap failed: macOS rejected classic-level module code signature. Used the available Computer Use in-app browser API. No security settings changed. |

Screenshots: `../school-desktop.png`, `../school-mobile.png`. Source comparisons: approved brand `278d882f3f3d8a32cd4e71f6e9dbcf11d0c68a5e`, project submission/onboarding/schedule templates. Checked black #050505, gold #D8AF55 primary actions, green→gold→blue order, square geometry, readable responsive typography, project/feedback/history hierarchy and unchanged mark. These are adapted school components, not a claim of pixel-identical approved mockups. CSS declares approved Archivo/JetBrains Mono with local fallbacks; no font files added or third-party font requests. Exact font asset/license delivery remains open. No existing public copy was revised; new school content explicitly labels pending instruction and links.

## Release gaps and approval sequence

1. Founder conditional GO authorizes commit and draft PR. Vercel branch auto-deployment remains disabled in source. Do not merge, deploy, enable hosted services, apply a hosted migration, issue credentials or invite learners. Engineering/product review and all production gates remain pending.
2. Restore authenticated Supabase connector link discovery; inventory live migration history, roles, table schema and nonpersonal counts for `njpdlomvyalxrkluaige`. Review additive migration and role ownership before approval to apply to `academy_test` only. Do not run historical drafts or seed live users. Test memberships and reviewed content require a separately approved exact-SHA packet.
3. Membership provisioning is deliberately not coupled to payment in this slice. Define reviewed cohort/role/expiry mapping after TEST seat/grant creation; prove automatic enrollment and revocation with two approved adults using the existing bounded acceptance packet. No provider emails, sessions or payments were created here.
4. Approve sources and complete paid instruction. Review six editorial rubrics and first seven-day themes; source_ref is null and publication disabled until rights/teaching approval. Lesson publishing UI and full 30-day teaching remain incomplete.
5. Reconcile older Wednesday/48-hour/no-routine-expiry copy versus Nov 1 Sunday/24-hour/12-month workspace decisions before new public/Stripe/ICS/terms changes. Confirm timezone, time, provider, support and private links; do not alter prior customer commitments silently.
6. Remaining product/ops: authenticated hosted browser journey; uploads and rights/retention/deletion; notification preferences/expiry warnings; reactions/pinning/recognition awards; attendance/replay takeaways; 1:1 calendar provider; facilitator roster/readiness/publishing tools; credential decisions/generation/consent verification; staffed SLAs and community rate limits. No credential or unlimited community promise is inferred.
7. Lock and review three moderate **development tooling** advisories (`glob`, `html-validate`, `minimatch`); npm suggests a breaking html-validate major upgrade. No automatic dependency change. No high/critical advisory reported.

REA remains optional and unused. Current machine is the user's Mac, not the authorized isolated Codex sandbox. No REA, Node, Codex/Claude config, Yawdie, production flags or provider settings were changed.

Rollback: before commit discard only reviewed School changes, leaving the clone baseline intact. After an approved candidate, withdraw its preview or revert its application commit through review. Disable only the future preview School flag first. Never drop the TEST schema, delete learners, revoke production grants or reset Auth as application rollback.

## Conditional-GO follow-up evidence

The initial 64-test receipt remains in `evidence/initial-64-tests.log`. The final receipt is `evidence/final-66-tests.log`. Two additional regressions cover later opt-in sharing/withdrawal and export ownership/decision evidence/credential suppression; there are no contradictory test totals. Tests are implementer-produced evidence awaiting independent review.

The sharing defect is fixed: a private submitted record can explicitly enable peer sharing later, and withdraw it again without rewriting work, version or acceptance. Owner-only database enforcement and browser behavior are tested. In-flight saves disable controls to suppress duplicate actions. Progress labels/counts distinguish submitted, awaiting review, revisions requested and accepted. The hardcoded demo expiry is removed; [policy reconciliation](POLICY-RECONCILIATION.md) states the approved 12-month duration and unresolved exact cutoff. Credential copy matches all four Nov 1 criteria and issuance remains disabled.

Final browser run used already-installed Playwright and Chrome in an isolated temporary headless profile: the preferred Browser runtime failed macOS code-signature validation; the Computer Use reconnect also reported `browser.user is unavailable`. No browser dependencies, normal profiles or security settings were changed. The localhost server remained running; a sandbox-network probe initially appeared disconnected, while the host-network check succeeded.

Verified at 1440×1000 and 390×844: private submit → explicit sharing → peer feedback → facilitator requests revision → version-2 resubmission → fresh peer feedback → human acceptance → 1/6 progress; reload persistence; owned JSON download; community post/reply/report/moderator-hide; withdrawal removes peer visibility; unpublished classroom and date-only schedule. Console errors: zero; mobile viewport and scroll width: both 390 px. Download inspected: one own accepted version-2 submission, four feedback/decision entries, seven activity events, `schema_version:1` and `credential_issued:false`. This proves the synthetic UI, not hosted Auth or payment enrollment.

Screenshots and browser receipts are in `evidence/`; they contain synthetic fixtures only. [Foundry candidate 02](HAMAL-FOUNDRY-CANDIDATE.md) records the proposed reusable pattern without promoting capabilities or changing another workspace.
