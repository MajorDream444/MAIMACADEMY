# Academy canonical database — 20 October 2026

Owner selected MAIM Ecosystem njpdlomvyalxrkluaige. This supersedes the earlier unresolved database-target blocker in DATABASE-VERIFICATION-2026-10-20.md. Access is verified through the MAIM ECOSYSTEM connector. The STB/Academy connector's inactive project is not the Academy target.

Canonical decision and inventory: https://github.com/MajorDream444/Major-AI-OS/pull/44

Existing maim schema has nine RLS-enabled tables and Supabase auth.users foreign keys. Academy draft SQL assumes Better Auth text user IDs. Reconcile identity and entitlement ownership with that existing schema before applying draft SQL; do not run schema.sql in public or assume the project is empty.

Administrative maim_ops.application_registry now records Academy as pilot_draft, runtime_verified=false, with no selected application schema yet. This metadata does not enable hosted learning.

Next: inspect current ecosystem auth/entitlement integrations, implement scoped Academy migrations, generate a reviewed auth mapping, configure preview-only runtime credentials, run real two-user/session/payment/booking tests. No learner/client seed data, live payment keys or production cutover are authorized by this target selection.

Keep other application data isolated within the shared project. Never use one broad browser key or shared role as proof of entitlement to all products. Existing 26 local tests remain evidence for draft logic/schema only.
