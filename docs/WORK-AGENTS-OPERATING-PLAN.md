# Academy Work session — 19 October 2026

## Inventory and branch ownership

VERIFIED through GitHub and Vercel reads this session:
- Academy main `0ead0fafc720f8f4d94c7d8dcd8841ff394442a1`: README and .gitignore only.
- Codex PR #2, `codex/academy-v1-pathways`, `0bb7d6d7e68c5f84ada2c2fcaca26f61b8c96237`: four-page informational implementation, architecture, ADR and release checklist. Preserve this branch.
- Handover PR #3, `2229927322cbad31484ae024d1bc34132afde306`: documentation only. Preserve separately.
- Vercel project `hamal-agi/maimacademy`, `prj_lhYc5ptVPNomKGu4zI1HHhiplkJV`: protected previews. Existing deployment `dpl_2dBEc4xatSuUx1tH5Sa4M3sMe6Lv` is READY, exact Codex SHA, URL https://maimacademy-4yxwjxgw0-hamal-agi.vercel.app . Provider state independently checked; prior browser/accessibility receipts belong to Codex, not this session.
- Latest handover deployment `dpl_BQVZdbZ5x9aaqaFg2hSb5oq3UxCM` is ERROR. Build logs show ENOENT `/vercel/path0/package.json` on docs/work-agent-handover-2026-10-19. This does not invalidate the existing app preview. No provider configuration changed to suppress this documentation-branch failure.
- Major-AI-OS main tree `db9fdc01aa76cc034bd2cff745e47b1967886555` read for design, source authority and release standards. PR #43 is an existing deployment audit; its older deployment snapshot is not a fresh confirmation of current production.

This branch: `work/academy-curriculum-2026-10-19`, based on Codex PR #2. It is a stacked continuation, not a replacement app. PR base must remain codex/academy-v1-pathways until #2 is merged, then retarget after checking upstream changes. Do not merge the stack to production from this report.

## Task board and responsibilities

Roles executed sequentially in this session; no separate autonomous workers claimed.

| Lane | Result | Next gate |
| --- | --- | --- |
| Orchestration | VERIFIED branch inventory and isolated continuation | Check Codex head freshness before integration |
| Repository audit | VERIFIED existing app and provider preview | Current MAIM site/deployment binding and inbound integration still OPEN |
| UX/brand | Reuse existing tokens, medallion, shell and nav | Browser/mobile/keyboard review of new route OPEN |
| Curriculum/library | PROPOSED 30 daily activities with artifacts and completion criteria | Book passage mapping, source rights and age adaptation review OPEN |
| Engineering | Add /major-moves to existing static build | Reviewed PR and preview receipt |
| Data/safeguarding | No accounts, forms, saved progress or cross-product export | Future identity/privacy design separate |
| Integrations | Read-only Vercel state; existing unavailable checkout preserved | No Stripe/Resend/Airtable runtime activation tested or needed for this scope |
| Release QA | Build, HTML lint and route/data tests required | No production authorization inferred |

## Source and architecture record

Existing docs/CANONICAL-ARCHITECTURE.md and ADR-0001 remain the implementation contract. No duplicate authority document is created. MAIM OS owns brand/site/release; Academy owns this discovery interface; Ten Pillars and Lucky retain content authority; Spark Lab retains applied and STB boundaries; Foundry owns independently authorized advanced evidence review. Related canonical source links are already in the architecture record.

Navigation: Academy → Library / 30 Major Moves; journey → optional Spark Lab; Spark Lab → separately scoped Foundry information. No automatic enrollment, evidence export, occupational qualification or ownership guarantee.

## Release decision

Reviewable continuation only. Main, Codex branch, existing production site, DNS, checkout, mail and learner records were not changed. Rollback: withdraw this continuation PR; the Codex baseline remains intact. Existing PR #2 preview does not contain the new route. A new preview receipt must name this continuation's exact SHA before anyone treats /major-moves as deployed.
