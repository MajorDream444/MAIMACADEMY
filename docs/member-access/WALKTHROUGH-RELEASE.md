# Learner walkthrough and advisory reservation — 20 October 2026

Scope: continuation of PR #5; interactive /walkthrough with fictional in-memory state, Week 1 practitioner-pilot drafts, private advisory API and draft schema extension. No production activation, actual booking, schema application or external calendar/email mutation.

The walkthrough contains only the public Day 1 example. No full paid lesson dataset is copied into the browser. Demo note resets on refresh. A clearly labeled simulated review opens a fictional reservation; it never sets real reviewer authority or grants backend access.

Actual API /api/advisory is separately disabled unless ENABLE_ACADEMY_MEMBERS and ENABLE_ACADEMY_ADVISORY are configured. It derives identity from the verified session, checks active journey access and scopes all user data. A submitted brief cannot self-approve. An operator must review and mark approval in the private database; no public admin route is exposed.

Reservation transaction locks the user's credit, reviewed brief and slot. Constraints allow one booking per credit, brief and slot; overlapping slots for Major are excluded by a draft DB range constraint. Appointment must finish within the 90-day credit window and last 45 minutes. Founding-credit trigger issues at most one credit per active journey grant. Existing grants need a separately reviewed backfill. Account-level group/session eligibility dates derive from enrollment, not first login.

Database integration/transaction/trigger/concurrency tests remain OPEN because no database is connected. Draft SQL is NOT an applied migration. Service-credit completion, cancellation, no-show, refund restoration and operator review UI require further policy and implementation. No cohort capacity enforcement or live group admission is claimed. These remain gates before purchase activation. Existing test checkout remains disabled with no approved price.

Sources: approved founding offer record, Major's conversation/file organization stories and the follow-up discussion of glossary, multimodal explanation and bounded support. Public knowledge webinars/live-build events remain outside this scope.

Review sequence: inspect walkthrough → review Week 1 → configure isolated DB/auth → run real two-user/session/payment/booking tests → implement capacity and remaining booking policies → approve price/terms → consider pilot activation. No user secrets in chat or public Git.
