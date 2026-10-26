# Restricted Academy TEST configuration — names only

Applies only to `codex/academy-member-stabilization` in Vercel `maimacademy`.
Production never satisfies the new runtime guard. No credentials belong in Git.

| Name | Purpose / required scope |
|---|---|
| VERCEL_ENV | Provider-supplied; must identify Preview |
| ACADEMY_IDENTITY_MODEL | Reviewed Supabase UUID test binding |
| ACADEMY_DATABASE_SCHEMA | Private academy_test schema only |
| ACADEMY_DATABASE_URL | Sensitive member-only Postgres login |
| ACADEMY_AUTH_DATABASE_URL | Sensitive auth-function-only Postgres login |
| ACADEMY_WORKER_DATABASE_URL | Sensitive payment-worker-only Postgres login |
| ACADEMY_AUTH_SECRET | Sensitive high-entropy cookie encryption secret, >=32 characters |
| ACADEMY_SUPABASE_URL | Owner-selected canonical Supabase origin |
| ACADEMY_SUPABASE_PUBLISHABLE_KEY | Publishable Auth key; never service-role |
| ACADEMY_ORIGIN | Exact actual protected Preview HTTPS origin |
| ACADEMY_PILOT_EMAILS | Private two-adult QA allowlist, branch override only |
| ENABLE_ACADEMY_MEMBERS | Default disabled; reviewed QA window only |
| ENABLE_ACADEMY_AUTH_EMAIL | Default disabled; existing sender/callback verified first |
| ACADEMY_RESERVATION_NOTICE_VERSION | Exact reviewed TEST consent notice version |
| ENABLE_ACADEMY_TEST_CHECKOUT | Default disabled; TEST QA only |
| ACADEMY_OFFER_APPROVED | Default disabled; exact final Academy legal/purchase approval |
| ACADEMY_STRIPE_KEY | Sensitive restricted TEST key; no unrestricted/live key |
| ACADEMY_STRIPE_WEBHOOK_SECRET | Sensitive Academy TEST endpoint signing secret |
| ACADEMY_JOURNEY_PRICE_ID | Existing approved one-time Academy TEST price, not Blueprint |
| ACADEMY_PRICE_CENTS | Fixed founding price (24900); code rejects other amounts |
| ACADEMY_TERMS_URL | Approved immutable Academy terms HTTPS URL |
| ACADEMY_AGREEMENT_VERSION | Exact approved immutable purchase agreement version |
| ENABLE_ACADEMY_RECEIPT_EMAIL | Default disabled; only approved QA receipt window |
| ACADEMY_RESEND_KEY | Sensitive restricted MAIM transactional sending credential |
| ACADEMY_EMAIL_FROM | Verified MAIM-domain sender |
| ACADEMY_SUPPORT_EMAIL | Monitored MAIM-domain support/reply address |
| ENABLE_ACADEMY_ADVISORY | Default disabled; reviewed availability/briefs required |

All application configuration is branch-scoped Preview. Keep the public site,
reservation funnel, price/cap and November11/18 decisions unchanged. Main-site
Stripe/Resend/Supabase variable names do not configure this separate engine.
`ACADEMY_AUTH_SECRET` now seals short-lived PKCE cookies, not Better Auth sessions.
No Vault subscription/renewal or live payment configuration is introduced.
