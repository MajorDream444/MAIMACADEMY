# MAIM Academy canonical architecture — V1

Implementation contract: [issue #1](https://github.com/MajorDream444/MAIMACADEMY/issues/1). Founder direction approved; release remains review-gated. Snapshot 19 October 2026.

## Authority and evidence

| Concern | Authority | State / boundary |
| --- | --- | --- |
| Brand, website architecture, design, release gates | MajorDream444/Major-AI-OS, main `db9fdc01aa76cc034bd2cff745e47b1967886555`; README, DESIGN, data/design-tokens.json, context handover, ecosystem-map, definition-of-done, apps/maim-site | Canonical upstream; Academy is not a replacement website |
| Academy learning/community doorway | MAIMACADEMY issue #1 | Approved product direction; V1 implementation informational |
| Lucky canon / Reading Room | MAIM-LUCKY-LIBRARY; README, canonical architecture, Reading Room | 27-volume canon at foundation stage; no copied manuscripts or paid downloads |
| Ten Pillars | MAIM_10_Pillars; books/PRODUCTION_AND_COMMUNITY_PLAN.md | Public collection site exists; book production/community plans and prices remain proposals |
| Applied experiments | SPARK-LAB-STB | Methodology source, not proof of an operational learning service |
| Practitioner services | STB-Practitioner-Business-OS README and canonical blueprint | Distinct service-first scope; demand and commercialization not validated |
| Advanced evidence pathway | HAMAL-Foundry-OS; CANONICAL-TRUTH, AGENTS, governance | Separate authorization; no Academy entitlement or employer acceptance inferred |

Reviewed Foundry PR #2 at `9a3daf01ea727fe4b4824c734679b83b35ca62e1` (OPEN, draft): CAP-009 and DR-004/005 propose Academy interfaces; they do not establish operational SSO, passports, exports, buyer acceptance or deployed capabilities. The draft preserves evidence classifications appropriately; approval, customer evidence and runtime review remain OPEN. No Foundry files or statuses changed here.

The two founder-supplied conceptual attachments provide historical design context. Issue #1 controls naming and V1: Learn → Build → Prove → Own. Longer progression, memberships, AI tutors and institution-scale LMS ideas are roadmap, not current functionality or pricing.

## Route map

| Route | Purpose | External destination |
| --- | --- | --- |
| / | Academy landing / pathway map | Existing MAIM homepage and campus |
| /library | Collection directory | Public Ten Pillars site; Lucky architecture and Reading Room source; existing free MAIM guide |
| /spark-lab | Informational applied-building path | Methodology and practitioner service sources |
| /foundry | Proposed advanced work-evidence path | Foundry governance/source |
| /api/checkout | Static unavailable response | None; no Stripe or provider credentials |

GitHub source links are explicitly labeled plans/scope, not live books or learner services. No copied third-party book content, invented biographies, live memberships or unselected AI provider. The gold MD medallion is reused from the canonical MAIM source. Exact MAIM token colors govern this V1; local system-font fallback avoids third-party font/data requests.

## Integration contract — PROPOSAL

Future content metadata: content_id, canonical_repo, canonical_path, content_version, age_band, rights_status. Rights review precedes ingestion. Learner preferences/progress belong to Academy and remain private. Authorized Spark Lab submissions use project_id/submission_ref/review_status. Foundry controls evidence_id/reviewer_authority/buyer_acceptance_status. Completion never sets external acceptance automatically.

Shared sign-in is OPEN. Tenant isolation, minors' consent, parent/teacher controls, deletion/export and institutional permissions need a separate design and review. No public minor identities, private employer files or practitioner/client data enter this repository. No forms, cookies, analytics, scripts, chat, auth, uploads, transactions, AI tutors or backend storage in V1.

## Hosting and integration

The Academy remote was empty and no Academy Vercel project existed at inventory. Baseline README commit establishes main; all application work is on codex/academy-v1-pathways. A separate maimacademy project in HAMAL AGI hosts preview only; no production alias or custom domain is authorized.

Existing Major-AI-OS checkout and website are untouched. The MAIM-site inbound Academy entry is an OPEN integration gate: after preview review and destination approval, submit a separate additive navigation PR in Major-AI-OS. Do not replace the homepage, point a production CTA at an unapproved preview, or silently reassign its Vercel project.

## Release and rollback

Build/lint, local-link tests, real browser accessibility/mobile checks, external-link checks, checkout-unavailable checks, exact preview SHA and provider status are required before preview handoff. Preview review is not production approval. Production requires reviewed PR, explicit owner promotion authority, correct project/domain, smoke tests and rollback receipt.

Rollback: before merge, close the PR and discard the preview from promotion; main retains documentation-only baseline. After an approved future release, redeploy the previously reviewed immutable deployment or revert the specific change through review. No DNS, provider settings or existing website changes are needed to withdraw this preview.
