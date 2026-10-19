# Private preview configuration — no secret values

All flags default off. No environment values were changed by this build.

| Variable | Purpose |
| --- | --- |
| ENABLE_ACADEMY_MEMBERS | Explicit private-pilot enable switch |
| ACADEMY_DATABASE_URL | Private Postgres connection; trusted TLS configured by provider |
| ACADEMY_AUTH_SECRET | High-entropy secret, at least 32 characters |
| ACADEMY_ORIGIN | Exact HTTPS origin without a path or trailing slash |
| ACADEMY_PILOT_EMAILS | Approved adult pilot email allowlist; private env only |
| ENABLE_ACADEMY_AUTH_EMAIL | Enable delivery only after sender and recipient review |
| ACADEMY_RESEND_KEY | Restricted email credential |
| ACADEMY_EMAIL_FROM | Verified sender |
| ENABLE_ACADEMY_TEST_CHECKOUT | Explicit test checkout switch |
| ACADEMY_OFFER_APPROVED | Confirmed price/terms/support readiness |
| ACADEMY_STRIPE_KEY | Test-only restricted Stripe key |
| ACADEMY_STRIPE_WEBHOOK_SECRET | Test endpoint signing secret |
| ACADEMY_JOURNEY_PRICE_ID | Approved one-time test price; currently unset |
| ACADEMY_PRICE_CENTS | Approved amount; currently undecided/unset |
| ACADEMY_TERMS_URL | Approved HTTPS terms URL |
| ACADEMY_AGREEMENT_VERSION | Immutable offer terms version |

No vault price IDs or renewal schedule configured. No production credentials requested or read.
