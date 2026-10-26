# Academy member stabilization — evidence and launch blockers

26 October 2026. **HOLD: the hosted member engine is not yet operational.**

## Delivered and actually verified

- One branch `codex/academy-member-stabilization` from Academy main `9534e9c`.
  Main-site authority `00713ff`; merged Academy PRs #20/#21/#22/#23 read first.
- Founder-approved private TEST scope in the single MAIM Ecosystem Supabase
  project. No separate project, paid branch or account upgrade created.
- Reviewed UUID/role migration applied: `20261026024608_academy_uuid_preview`.
  Provider catalog verifies 15 TEST tables with RLS, three restricted NOLOGIN
  roles and no schema access for anon/authenticated. Existing MAIM schemas,
  customer/Auth rows and global Auth settings untouched. No QA rows enrolled.
- Supabase-native UUID identity/PKCE sign-in candidate replaces runtime reliance
  on Better Auth text IDs. Opaque hashed app sessions and explicit sign-out;
  transaction-local UUID claims and RLS protect member reads/writes.
- Consent ledger, locked 20-seat TEST pool, frozen/idempotent Stripe payload,
  signed event processing, refund/dispute holds/revocation, receipt outbox and
  booking eligibility implemented behind disabled controls.
- Independent review: migration PASS for additive application; final bounded code
  review and final recovery-gate follow-up found no P0/P1. P2 worker-pool availability finding fixed by releasing
  webhook connection before receipt delivery.
- Local build, HTML lint, JavaScript syntax and 45 tests pass. Embedded PostgreSQL
  exercises the actual migration/roles/RLS, two synthetic UUID owners, denied
  cross-user writes, lesson access, hash-session revoke, consent, seat21 rejection,
  payment replay/refund, private booking and double-consumption rejection.
- Transport tests use injected Supabase/Resend responses, never real emails or
  payments. They verify PKCE/cookie handling and uncertain-delivery withholding.
  Embedded tests do not establish real concurrent hosted payment behavior.
- Public `public/`, `scripts/` and `data/` source/assets unchanged. Crest, assembly,
  video teaser, reservation page, $249/cap20 and Nov11/18 remain as merged.
- Project-scoped Supabase MCP was added/authenticated using official Codex CLI
  through npx; installed global CLI was too old and was not replaced. CLI list
  confirms enabled/OAuth. Official Supabase skill already installed and used;
  no duplicate optional skill installation was needed.

## End-to-end gate matrix

| Ordered gate | Current evidence | Status |
|---|---|---|
| Supabase UUID/role foundation | Hosted schema/catalog/privileges verified; no customer mutations | PASS for foundation |
| Two authorized QA sign-ins | PKCE/cookie tests mocked; no runtime DB logins/registered QA UUIDs | BLOCKED hosted |
| Private progress isolation | Actual embedded PostgreSQL RLS A/B and forgery tests pass | PASS local; BLOCKED hosted |
| Reservation/consent persistence | Own-UUID/version/time ledger tested; public funnel unchanged | PASS local; BLOCKED hosted |
| TEST email and inbox | Mock transport only; no send, message ID or inbox confirmation | BLOCKED |
| Capacity-safe app-created Stripe TEST checkout | Actual DB cap/retry invariants; no real Stripe Session | PASS local; BLOCKED hosted |
| Signed webhook entitlement | DB event/replay fixtures; no signed provider delivery | BLOCKED hosted |
| Refund recovery | Local reordered-event/terminal-revocation tests | PASS local; BLOCKED hosted |
| Protected lessons | Local RLS published-vs-draft test; no teaching assets published to TEST DB | BLOCKED hosted/content |
| Calendar access | Authenticated date API; real private meeting links absent | BLOCKED delivery |
| Private coaching | Local ownership/brief/deadline/credit/slot tests | PASS local; BLOCKED actual appointments |

## Exact remaining owner/provider prerequisites

1. Three dedicated restricted database login connection strings, stored privately
   on this Preview branch: `ACADEMY_DATABASE_URL`, `ACADEMY_AUTH_DATABASE_URL`,
   `ACADEMY_WORKER_DATABASE_URL`. Logical NOLOGIN roles exist, but no application
   login password was provisioned through logged SQL. Never use a shared admin
   connection to bypass this step.
2. Privately reviewed existing confirmed Auth UUIDs for the two authorized adults,
   explicit registration in academy_testers, the existing Auth callback/sender compatibility. The branch auth secret, publishable
   key and exact actual Preview origin have now been configured securely.
3. Verify the current Auth callback allowlist/sender already supports this Preview
   without changing global settings; if not, a separate reviewed solution is
   needed. Do not silently switch SMTP, templates, redirects or auto-signup.
4. Exact reviewed TEST reservation notice and final Academy terms/privacy URL and
   version. Founder operating policies are preserved; no legal flag is inferred.
5. Restricted Academy Stripe TEST key/price/signing-secret configuration; separate
   receipt credential/sender/reply inbox; real controlled provider/inbox evidence.
6. Complete reviewed lesson assets, private calendar/meeting/replay resources and
   coaching availability. Reschedule/courtesy/provider-extension workflows remain
   pending; successful initial booking logic is not full service readiness.

Environment names and role responsibilities: [ENVIRONMENT.md](../member-access/ENVIRONMENT.md).
Migration sequence, owner steps and rollback: [rollout plan](../member-access/TEST-MIGRATION-AND-ROLLOUT-2026-10-26.md).

## Boundaries and rollback

No production flags/payments, invitations, customer email, booking, lesson/replay
publication, existing customer record change or repository consolidation occurred.
Rollback starts by keeping all Preview controls disabled, withdrawing the candidate
and revoking dedicated TEST login access. Preserve audit/consent/payment evidence;
schema drop/data deletion requires explicit reviewed cleanup. No broad email-based
user deletion, shared-project reset or automatic destructive rollback.

## Protected Preview configuration receipt

The branch has the private two-adult allowlist, six disabled controls, UUID/schema
binding, existing modern publishable key, newly generated sensitive auth secret
and verified branch origin. No DB login, Stripe or mail-sending credential has
been supplied. Branch configuration is not runtime account-access proof.

Closing new checkout does not disable signed-event/refund or receipt recovery
configuration; those require their own valid TEST credentials and member runtime.
No payment-safety control is inferred from an approval or UI state alone.

Founder reports removal of the Vercel marketplace attachment. Fresh main-site
environment metadata still lists Supabase/Postgres variable names; their presence
does not prove an attachment or working connection. No inherited values were
read, copied or removed. This candidate uses explicit TEST configuration only.
