# ADR-0001 — Informational Academy with canonical collection links

Date: 2026-10-19. Status: proposed implementation for review; product hierarchy approved in issue #1.

Context: Academy is learning/community; Spark Lab applied building; Foundry advanced governed work evidence. Empty Academy remote and no Academy Vercel project were verified. Existing MAIM site behavior and commerce gates must be preserved.

Decision: ship four static, accessible pages with explicit maturity labels, local MAIM branding, no data collection and no payment runtime. Link to original content authorities rather than copy books. Build with Node standard library; validate output using html-validate, node tests and real-browser axe/mobile checks. Host a separate preview project. Leave live MAIM navigation integration to an additive reviewed PR after a stable destination is approved.

Alternatives: replacing the current MAIM site risks regression; a full LMS/SSO/membership system expands privacy, cost, entitlement and moderation scope beyond V1. Neither is needed for directory validation.

Consequences: fast reversible preview, no migrations or paid integrations; no learner accounts, progress tracking, certifications or active memberships. External source availability and content rights must be checked before deeper integration. Foundry PR #2 remains proposed; Academy completion does not grant institutional access or acceptance.

Human gate: HOLD for production. Preview review and all integration/rights decisions remain explicit. Client work and private records stay in their owning systems.
