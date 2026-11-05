# MAIM Academy

## School V1 implementation candidate

The original informational-site description below is historical. The repository
now includes a restricted preview member/TEST commerce scaffold and a local
School V1 candidate. Start with the [current truth matrix](docs/operations/SCHOOL-V1-READINESS-2026-11-03.md)
and [implementation, QA and remaining gates](docs/school/IMPLEMENTATION-AND-QA.md).
Run `npm run check`, then `npm run dev` and visit `/school-walkthrough` for the
explicitly synthetic browser-local learner/peer/facilitator flow. Use fictional
data only. `/school` is server-protected and additionally gated by
`ENABLE_ACADEMY_SCHOOL`; the static development server does not run hosted APIs.
The new TEST migration is unapplied. This candidate does not establish hosted
enrollment, approved paid teaching, credentials or production release readiness.

Learning and library doorway within Major AI Mindset.

Authority: [MAIM Academy issue #1](https://github.com/MajorDream444/MAIMACADEMY/issues/1)
and [Major-AI-OS](https://github.com/MajorDream444/Major-AI-OS) for brand,
website architecture, design and release gates.

## Academy ABCs — Volume 2

The founder-supplied [A–Z build-and-do map](docs/curriculum/ABC_VOLUME_2_ACADEMY.md) organizes workshop and project themes. It complements the [Major AI Mindset Volume 1 philosophy map](https://github.com/MajorDream444/Major-AI-OS/blob/docs/maim-abc-volume-1-map/docs/curriculum/ABC_VOLUME_1_MINDSET.md). These are curriculum maps; they do not activate checkout or certify completed lessons.

V1 is a static informational preview. Start with
[canonical architecture](docs/CANONICAL-ARCHITECTURE.md) and
[ADR-0001](docs/adr/0001-informational-academy-directory.md).

Run `npm ci`, `npm run check`, then `npm run dev` (127.0.0.1:4173).
Output: dist/ (ignored). Routes: /, /library, /spark-lab, /foundry.
Checkout returns unavailable; there is no payment or identity integration.

No production release, live membership service or AI tutor is established here.
Preview promotion, MAIM-site navigation integration and future learner data
features require separate review. Existing MAIM website behavior is preserved.

Proposed 30-Day Major Moves activities: `/major-moves`, authored from
`data/major-moves.json`. No progress is stored. Book passage mapping and
age-specific instructional review remain open. See
[the curriculum proposal](docs/CURRICULUM-30-DAY-MAJOR-MOVES-PROPOSAL.md)
and [the Work task board](docs/WORK-AGENTS-OPERATING-PLAN.md).

## Founder-approved Academy commerce architecture — 5 November 2026

Read [MAIM Academy Commerce Architecture](docs/commerce/MAIM_ACADEMY_COMMERCE_ARCHITECTURE_2026-11-05.md) before implementing courses, Campus Pass membership, Spark Lab sprints, institutional licensing, youth enrollment, checkout, or fulfillment. It defines the Academy's execution role while keeping SKUs, Stripe mappings, and release evidence in the separate commerce catalog.
