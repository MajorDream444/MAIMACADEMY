# MAIM Academy Commerce Architecture

**Decision date:** 2026-11-05  
**Status:** FOUNDER-APPROVED  
**Authority:** This repository owns Academy learning delivery and application behavior. Prices, SKUs, Stripe IDs, and cross-product release status belong in the MAIM Commerce Catalog.

## Academy role

MAIM teaches how to think. MAIM Academy teaches how to act, build, test, and execute. The Academy may accept learners arriving through MAIM or experienced builders entering directly.

ABCs Volume 2 is the Academy action layer: workflows, models, agents, harnesses, projects, and repeatable operating systems.

## Sellable Academy families

| Family | Customer outcome | Commercial forms |
|---|---|---|
| Academy curriculum | Turn understanding into working capability | Courses, ABCs Volume 2, six-project pathway |
| Builder labs | Produce functioning systems | Automation labs, agent labs, templates |
| Guided development | Improve work with human feedback | Office hours, reviews, cohort tuition |
| Portfolio | Produce evidence of capability | Project review, completion pathways |
| Campus Pass | Maintain structured access and momentum | Recurring membership with bounded entitlements |
| Spark Lab | Produce a defined result inside a fixed sprint | 7-, 14-, 21-, or 30-day facilitated sprint |
| Institutional | Deploy learning to a group | Licenses, facilitator kits, sponsored seats, deployments |

## Spark Lab

Spark Lab is facilitated through the Academy. Its underlying theories and mindset originate in MAIM.

Initial named sprint families include:

- Business Pressure Test
- Build While You Heal
- Stop the Bleed
- Wolf Protocol

Each sprint must define its audience, starting condition, promised outcome, duration, included support, exclusions, fulfillment evidence, and completion state before sale.

## Recurring commerce

The Campus Pass is the preferred recurring layer. It may include curriculum access, scheduled community sessions, selected templates, progress systems, and explicitly limited feedback. It must not imply unlimited consulting, coaching, implementation, or founder access.

## Youth and institutional boundary

For participants under 18, the payer and contracting party must be a parent, guardian, school, or sponsor. Youth enrollment, privacy, consent, and access controls must be designed before accepting payment.

## Direct entry

Experienced builders may buy Academy offers without completing the MAIM Foundations path. Entry assessments or prerequisites may be used when a product depends on prior capability.

## Product-state boundary

School V1, static previews, curriculum drafts, and completed front-end screens are not proof of operational commerce. An Academy offer is not live until its catalog record and production evidence confirm:

1. approved offer and terms;
2. Stripe product and price mapping;
3. working checkout;
4. verified webhook;
5. durable order persistence;
6. transactional confirmation;
7. entitlement or fulfillment;
8. return, support, retry, and refund behavior;
9. verified customer access.

## Cross-repository contract

- **Major-AI-OS:** philosophy, doctrine, journey, and ecosystem meaning.
- **MAIMACADEMY:** curriculum delivery, application behavior, learner experience, and fulfillment implementation.
- **MAIM-Academy---brand:** visual and verbal application.
- **MAIM Commerce Catalog:** offers, SKUs, pricing, Stripe mappings, readiness, and release evidence.
