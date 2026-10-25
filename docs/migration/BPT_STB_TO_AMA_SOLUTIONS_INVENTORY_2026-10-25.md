# Migration inventory: Business Pressure Test and Stop the Bleed → AMA Solutions

**Status: inventory only, 25 October 2026.** Nothing has been deleted, moved,
renamed or redirected. Major's direction: AMA Solutions owns the agents and
the business-diagnostic and practitioner-service work. **Spark Lab and every
educational offering stay in MAIM.** This file records what exists and what each
item touches, so the move can be planned and approved before anything changes.

Compiled by Claude Code from: the GitHub repository list, the Vercel team
`hamal-agi` (projects, domains, latest deployments, env var **names** only),
and searches of `MAIMACADEMY` and `Major-AI-OS`. No env var values, keys or
personal addresses are copied here.

## 1. Repositories

| Repository | Visibility | Last push | What it is | Proposed owner |
|---|---|---|---|---|
| `MajorDream444/business-pressure-test-scratch-off` | public | 14 Oct | The Business Pressure Test app; backs the Vercel project below | AMA Solutions |
| `MajorDream444/business-pressure-test-v2` | public | 7 Jun | Earlier BPT version | AMA Solutions (archive candidate) |
| `MajorDream444/STB-Practitioner-Business-OS` | public | 20 Oct | Stop the Bleed practitioner service OS; backs the Vercel project below | AMA Solutions |
| `MajorDream444/STB-COMMAND-CENTER` | public | 17 Aug | STB operations | AMA Solutions |
| `MajorDream444/STB-Come-Back-To-Yourself` | public | 14 Oct | STB-branded offer, needs Major's call | **Decide:** educational or service? |
| `MajorDream444/SPARK-LAB-STB` | public | 16 Aug | Spark Lab methodology written inside STB | **Split:** methodology stays in MAIM Spark Lab; STB delivery goes to AMA |

`list_repos` reported an incomplete listing. Search the remaining repositories
for `stb`, `pressure` and `bleed` again before cutover.

## 2. Vercel projects (team `hamal-agi`)

| Project | Git source | Domains | State |
|---|---|---|---|
| `business-pressure-test` (`prj_kat96PeUmiWkNRDjAbtQkoYU4NV5`) | `business-pressure-test-scratch-off` @ `6cacfd1` ("Align AMA seller identity and provision authorized MAIM Supabase foundation") | `*.vercel.app` only; no custom domain | Latest deploy READY, target **staging**; SSO protection on |
| `stb-practitioner-business-os` (`prj_RelsRHR1aaA5Oq82dpozfZ7sshEy`) | `STB-Practitioner-Business-OS` @ branch `work/maim-database-target-2026-10-20` | `stb-practitioner-os.vercel.app` (+ team aliases) | Latest deploy READY (preview); SSO protection on; **0 env vars** |
| `amasolagi-site` (`prj_LWSTjiGqkAwTNZyFNb5FK4NOHkhl`) | `amasolagi-site` | (AMA's own) | The destination |

Neither BPT nor STB is on a `majoraimindset.com` domain, so DNS needs no unpicking.

### `business-pressure-test` env var names (values not read)

- Secrets (placeholders, marked "feature activation remains disabled"):
  `AIRTABLE_PAT`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`.
- Flags, all `false`: `ENABLE_CHECKOUT`, `ENABLE_SUBMISSIONS`, `ENABLE_NURTURE`,
  `CHECKOUT_TERMS_APPROVED`. `STRIPE_MODE=test` (preview).
- Config: `APP_ORIGIN`, `SUPABASE_URL`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`,
  `AIRTABLE_CONTACTS_TABLE_ID`, `AIRTABLE_ASSESSMENTS_TABLE_ID`,
  `AIRTABLE_ORDERS_TABLE_ID`, `AIRTABLE_FOLLOWUP_TABLE_ID`,
  `STRIPE_BLUEPRINT_PRICE_ID`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`,
  `GOOGLE_CALENDAR_ID`, `SHOP_BOOKING_URL`, `VITE_GOOGLE_BOOKING_URL`,
  `SHOP_SUPPORT_EMAIL`, `SHOP_TERMS_URL`, `SHOP_AGREEMENT_VERSION`,
  `MAILING_ADDRESS`, `MAIM_VIDEO_1_URL`…`_3_URL`.

## 3. Shared systems (the hard part of the move)

These are where BPT/STB and MAIM are **coupled today**. They decide the order of
the migration.

| System | Coupling | Note for the move |
|---|---|---|
| **Supabase `njpdlomvyalxrkluaige`** | BPT's `SUPABASE_URL` points at the **canonical MAIM project**. `maim_ops.application_registry` lists `stb` (and `ama`) as `planned` apps on the same project. | Decide whether AMA keeps a schema in the MAIM project (with a restricted role) or gets its own project. No data has been written for `stb`/`ama` yet (`setup_state: planned`). |
| **Resend** | BPT sends as `hello@majoraimindset.com`. | AMA should send from an AMA domain. The MAIM cohort segment is not touched by BPT. |
| **Stripe** | `MAIM-BLUEPRINT-001` "Business Pressure Test + Client System Blueprint", US$250 (`data/commerce/stripe-master-catalog-2026-10-20.*`). The main site has the Blueprint checkout: `apps/maim-site/api/checkout.ts`, `api/stripe-webhook.ts`, `lib/fulfillment.js`, `/terms/blueprint/*`. | This is a BPT product sold through MAIM's Stripe account and site. It needs a plan for which account sells it after the move, and for its terms pages. Checkout is currently off. |
| **Airtable** | Base `AIRTABLE_BASE_ID` with contacts, assessments, orders and follow-up tables. | Confirm whether this base is BPT-only or shared with MAIM. |
| **Google Calendar booking** | BPT booking link and calendar ID | Move to AMA's booking identity. |

## 4. References inside MAIM properties

**On `majoraimindset.com` (`Major-AI-OS/apps/maim-site`):**
- `maim/majoraimindset_front_door.html`: a **"Pressure Test" section**
  (CSS block at line ~1038, markup at line ~1894, script at line ~2220), a
  first-question preview and "Pressure Test result — your personal map" in the
  register features.
- The Blueprint checkout and terms listed above.

**In the ABC Studio app (`Major-AI-OS/major-ai-mindset-abc-studio`):**
- `src/components/BusinessPressureTest.tsx`, `src/App.tsx` (section 3
  "Business Pressure Test (diagnostic)", the CTA "Take the Business Pressure
  Test", and the recommendation `pressure-test`), and
  `src/components/SparkLabVault.tsx`.

**On `academy.majoraimindset.com` (`MAIMACADEMY`):**
- `/spark-lab`: a "Practitioner services" card linking to
  `STB-Practitioner-Business-OS`, and "View the Spark Lab methodology source"
  linking to `SPARK-LAB-STB`. The page already says the STB service and client
  work stay in their own repositories, and Academy membership doesn't grant
  service access. **Left in place.** At cutover, point the card at AMA Solutions
  and the methodology link at a MAIM-owned Spark Lab source.

**Docs that mention BPT/STB (update at cutover, no action now):**
- `Major-AI-OS`: `docs/ECOSYSTEM-RECONCILIATION-2026-10-15.md`, `docs/MAIM_LAUNCH_DIRECTIVE_2026-10-15.md`,
  `docs/commerce/LIVE_LADDER_COPY_2026-10-22.md` (US$250 rung),
  `docs/commerce/STRIPE_LIVE_RECONCILIATION_2026-10-22.md`,
  `docs/decisions/MAIM_DATABASE_CONSOLIDATION_2026-10-20.md`,
  `docs/architecture/maim-ecosystem-wireframe-v2.md`, `docs/architecture/maim-service-blueprint.md`,
  `docs/audits/PUBLISHING_MASTER_INVENTORY_2026-10-22.md`, `docs/audits/MAIM_SITE_DEPLOYMENT_AUDIT_2026-10-19.md`,
  `supabase/project-inventory.json`, `supabase/migrations/20261020030402_maim_canonical_application_registry.sql`,
  `references/google-ai-studio/DESIGN_HANDOFF.md`.
- `MAIMACADEMY`: `docs/CANONICAL-ARCHITECTURE.md`, `docs/member-access/CANONICAL-DATABASE.md`,
  `docs/member-access/STRIPE-CATALOG-2026-10-20.md`, `docs/WORK-AGENTS-OPERATING-PLAN.md`,
  `docs/V1-RELEASE-CHECKLIST.md`, `docs/WORK_MODE_*`.

## 5. Other assets

- **Claude skills (account level):** `stb-continuity-keeper`, `stb-doorkeeper`,
  `stb-evidence-tracker`, `stb-gumroad-asset-builder`, `stb-offer-architect`,
  `stb-trip-wire-detector`, `stb-webinar-os`. Move them with the STB repos, or
  rename them under AMA.
- **YouTube:** one **private** video, "business Pressure Test Conversation"
  (`IPyOudguHJ0`). It stays private. Decide which channel owns it.
- **Gumroad:** the `stb-gumroad-asset-builder` skill implies STB assets on Gumroad. Not inventoried.

## 6. Proposed order (needs Major's approval for each step)

1. **Decide the open calls:** STB-Come-Back-To-Yourself (education or service?),
   the Spark Lab methodology split, and where the Blueprint product is sold.
2. Stand up AMA's own Resend sender, Stripe account or product, and booking
   identity. Keep MAIM's untouched.
3. Decide the database: an AMA schema in `njpdlomvyalxrkluaige` with a restricted
   role, or a separate project. No STB/AMA data exists yet, so nothing needs
   migrating.
4. Move the Vercel projects (or redeploy under AMA) and point the env vars at the
   AMA identities.
5. Only then update the MAIM references: the front-door Pressure Test section, the
   ABC Studio component, the Academy Spark Lab card and the Blueprint checkout.
   Each one gets either a redirect to AMA Solutions or a removal, per Major.
6. Transfer or archive the repositories and skills.

**Not to do until approved:** delete, redirect, transfer, archive, or change any
env var or Stripe object.
