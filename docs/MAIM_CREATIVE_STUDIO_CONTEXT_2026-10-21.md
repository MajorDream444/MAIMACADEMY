# MAIM creative studio ecosystem context

Date: 2026-10-21 (Asia/Makassar). Scope: documentation and skill connectivity; no runtime integrations are activated by this document.

## Start here

Read [Major-AI-OS brand canon](https://github.com/MajorDream444/Major-AI-OS/blob/main/DESIGN.md), [current ecosystem handover](https://github.com/MajorDream444/Major-AI-OS/blob/main/docs/handoffs/MAIM_ECOSYSTEM_CONTEXT_SYNC_2026-10-15.md), and the owning repository's instructions before work. Read live default-branch files; the inspected SHAs below are evidence snapshots, not permanent pins. An open PR is proposed source, not merged or deployed behavior.

## Authority map

| Domain | Owner | Contract |
|---|---|---|
| Brand, founder voice, messaging, approved design families | Major-AI-OS | Reference canon; do not redefine it in downstream repos |
| Learning/library entry and learner experiences | MAIMACADEMY | Studio can become a proposed learning destination; preserve Academy V1 release gates |
| Production job schemas, validation, state, recovery | MAIM-PRODUCTION-OS | Studio handoff must map into existing schema; never bypass readiness gates |
| Archive/wisdom into media products | MAIM-Legacy-Media-Studio | Own legacy-media workflows; consume shared creative skills |
| Reusable creative playbooks and skill source | HAMAL_MOB_PLAYBOOKS | Proposed reviewable source at 02_playbooks/creative-studio; no autonomous activation |
| Working private studio UI | Existing Sites project | appgprj_6ad81c31e4048191bafdf183aa58e3d7; preserve this identity and private access |
| Original media, private reference indexes and exports | Controlled Google Drive | Keep raw media, private locators, voice/provider IDs and credentials out of Git |

The existing studio is https://maim-creative-studio.majoraimindset.chatgpt.site (owner-private). It supports browser-local briefs, skill browsing, reference records, backup import/export and copyable handoffs. CSS 3D motion and native-scroll storytelling are a presentation layer, not production integration. Hanzo generation, shared storage, Flow/Remotion execution and marketing delivery remain unimplemented here unless separately verified. No SSO or cross-repository synchronization service is implied.

## Skill discovery

Six original skills were saved to the user's Skills service: maim-brand-asset-steward; maim-layered-cover-builder; maim-storyboard-continuity-director; maim-motion-graphics-producer; maim-marketing-asset-packager; maim-creative-workflow-orchestrator.

Repository distribution is proposed at [HAMAL creative studio](https://github.com/MajorDream444/HAMAL_MOB_PLAYBOOKS/tree/main/02_playbooks/creative-studio). Until its PR merges, load that PR branch explicitly or use the saved Skills service definitions; do not assume the main link exists. Each skill includes its production contract. The existing [Integrity publishing skill](https://github.com/MajorDream444/Major-AI-OS/tree/main/.agents/skills/maim-integrity-publishing-design) controls collection-specific design and takes precedence over generic cover guidance.

Install/update skills deliberately, record source commit and hash, and report installed versus available states. Do not create competing copies in every repository. Treat browser registry copies as distribution snapshots; promote a new skill version through review, then update the UI registry and saved Skills definitions with an explicit receipt. No automatic sync exists.

## Context and handoff contract

A cross-repository handoff includes: owning_repo, source_commit, canonical_doc_urls, skill_names_versions, approved_asset_aliases, requested_outputs, job_schema_version, budget_ceiling, status, unresolved, review_receipts. Use safe aliases for private assets. Reference existing Production OS states rather than inventing a parallel state machine.

Use a preservation -> specialist production -> review -> marketing handoff. Brand Asset Steward inventories real existing work first; cover/layout reconstructs editable components; storyboard director preserves cast/set continuity; motion producer composes exact type/marks; marketing packager derives channel assets; orchestrator maintains evidence and dependencies. These are roles and skills, not evidence of six autonomous agents running.

Studio backup JSON is a planning export, not a valid Production OS job by default. A future adapter must validate field mapping, exact reference resolution, explicit authorizations and state transitions before submission. Foundry acceptance, learner completion and production approval remain distinct.

## Brand and motion direction

Founder direction on 2026-10-21: prefer an engaging first ten seconds, a moving three-dimensional 'spark to signature' hero, and sticky scroll-driven scenes rather than a stack of static sections. Preserve approved Major Dream marks and cover directions. Read [motion contract](https://github.com/MajorDream444/Major-AI-OS/blob/main/docs/design-system/MAIM_CREATIVE_STUDIO_MOTION_2026-10-21.md) once its PR merges.

Use native wheel/touch/keyboard scrolling, sticky scene panels, explicit pause control and reduced-motion fallback. The main production form stays direct and stable. No autoplay audio, forced scroll capture or inaccessible motion. Proposed studio visuals do not silently replace the MAIM public homepage or Academy design.

## Source snapshots inspected

| Repository | Default-branch SHA |
|---|---|
| [MAIMACADEMY](https://github.com/MajorDream444/MAIMACADEMY) | `14b27c833ac16af5993c7f4292be580141e48e7d` |
| [MAIM-PRODUCTION-OS](https://github.com/MajorDream444/MAIM-PRODUCTION-OS) | `668ee87ab6d6f36e0b0f1e78d13d7fc9ed0c487f` |
| [MAIM-Legacy-Media-Studio](https://github.com/MajorDream444/MAIM-Legacy-Media-Studio) | `72468226f7808ae30f478c470e56c5f4f010a437` |
| [Major-AI-OS](https://github.com/MajorDream444/Major-AI-OS) | `ec7bac2e889a57803a65078182cc50c5bb76b98e` |
| [HAMAL_MOB_PLAYBOOKS](https://github.com/MajorDream444/HAMAL_MOB_PLAYBOOKS) | `9291d06603e0ad905d344bfdfbc37dfb2866fca1` |

The Legacy Media Studio root contained only README.md at inspection; its listed future docs are plans, not existing implementation. Academy remains informational. Production OS's Flow and Remotion adapters remain contract-only. HAMAL remains Stage A.

## Next bounded implementation

Recover approved Claude Design projects and source assets using their canonical records. Preserve originals. Build one editable adult Integrity master and channel derivatives within its locked A/B family. Implement a validated studio-to-Production-OS manifest adapter before any live job submission. Verify actual Hanzo endpoints with current official integration information; adapters need authentication, cost limits, idempotency, retries and evidence-backed health checks. No model weights or compute are supplied merely by creating an MCP wrapper.

## Copy-and-paste agent instruction

Read this context and this repo's README/instructions. Fetch current upstream brand and Production OS contracts. Load the selected MAIM skill and the Integrity publishing skill when applicable. Record the exact source versions and unresolved inputs. Produce a reversible, reviewable change in the owning repository. Validate it with that repository's checks. Do not mark open PRs merged, contracts integrated, references usable, or jobs executed without receipts. Return the result, evidence, remaining blockers and a concrete next task. Preserve release, credit-spend and publication gates.
