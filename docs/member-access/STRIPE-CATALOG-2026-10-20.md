# Stripe catalog setup — 20 October 2026

## Owner decisions
US$249 once is the approved founding journey price. Serve existing practitioners and business owners; direct people seeking their first paying client to the ABCs. Cohort cap 20; one included 45-minute private session within 90 days of enrollment; weekly implementation groups for the first 30 days; continuing access to this journey and revisions. More consulting and vault passes are separate.

A single journey product has reusable price variants, not three separate public packages. US$149 and US$399 are reserved campaign amounts. US$999.99 is an inactive, unpublished reference price. No evidence establishes it as a former selling price; do not display crossed-out pricing, “was”, savings percentages or inflated component values. Current copy: “Founding offer — US$249 once.”

## Actual Stripe work
Account: M.A.I.M., acct_1TLgn2BaiziDnHMm. All list calls completed without pagination remaining.
Before work: 11 live products, 20 live prices, 6 live payment links; 1 test product, 1 test price, 1 test link. This account does not contain 60 existing links. Some products belong to clients or Substack; they were left unchanged and excluded from this public register.

Created and read back:
- Test journey product prod_MAIM_ACADEMY_JOURNEY_V1 with full audience/support description.
- Four test prices: US$249, US$149, US$399 and inactive US$999.99.
- Three test payment links, each deactivated immediately after creation and verified inactive.
- Inactive test draft products for three-session advisory and knowledge-vault passes. No actual advisory/vault price is approved or created. US$450 advisory remains a proposal. Vault periods are 1/3/6/12 calendar months with no renewal; amounts and included assets remain pending.

IDs, exact amounts, titles and prepared test-link URLs are in stripe-catalog.json. Test product descriptions mark enrollment closed. The catalog URLs are for administration, not learner checkout.

Live draft-product creation returned “Authentication for Stripe was requested and accepted. Retry this tool call now.” twice. Retrying did not create the product. A subsequent live product list confirms no new Academy, advisory or knowledge-vault records. No new live links were created; no existing links/products/prices were edited.

## Wider product register
Four existing MAIM live entries were verified:
| Existing SKU | Title | Listed USD amount | Observed readiness |
| --- | --- | --- | --- |
| MAIM-BLUEPRINT-001 | Business Pressure Test + Client System Blueprint | 250 | Integration pending; distinct from the US$249 journey |
| MAIM-DIG-001 | The Pillar Scroll | 27 | Checkout hold, fulfillment unverified |
| MAIM-DIG-002 | Emerald Awakening | 97 | Product inactive, future gated |
| MAIM-DIG-003 | Pillar Code Vault | 297 | Product inactive, future gated |

These are existing records, not newly approved offers or proof of delivery. Reconcile the historical Pillar Code Vault against the new fixed-term Knowledge Vault before selling either as overlapping access.

Use one master register across MAIM, AMA Solutions and Major Dream. Each actual offer needs a stable SKU, business umbrella, title, accurate description, entitlement/deliverable, amount/currency, tax treatment decision, service/expiry/refund terms, source approval, fulfillment owner, Stripe mode/IDs and release status. Variants belong to the same product when the underlying deliverable is unchanged. New client engagements stay separate and private.

The owner's approximate 60-link estimate is a backlog for inventory, not a target to fill with invented products. The remaining named/defined offers have not been supplied as one complete list or discovered in this catalog; do not manufacture prices, content rights, subscriptions or delivery promises.

## Release gates
1. Resolve live catalog write authentication; re-list by stable product IDs before retrying to prevent duplicates.
2. Reconcile account identity/entitlements with the canonical MAIM database, njpdlomvyalxrkluaige.
3. Configure test price price_1USU9RBaiziDnHMmGWG2BrTR and amount 24900 only after auth, terms and fulfillment are ready. Price approval alone is not whole-offer release approval.
4. The existing member Checkout API binds purchases to a verified account. Raw reusable payment links do not prove learner identity or issue access. Implement and test secure claiming/identity, webhook replay/refunds, credits and global 20-seat capacity before any live link is published. Three separate links do not each receive a separate 20-seat allowance.
5. Publish the actual cohort dates and clear service/refund/cancellation terms. Discussion examples remain proposals.
6. Activate only the selected live price/link after end-to-end verification and launch approval. Other campaign variants remain internal.

## Copy and paste — Codex
Read this record, stripe-catalog.json and FOUNDING-OFFER.md in MAIMACADEMY PR #6. Use the US$249 TEST founding price and existing-practitioner audience. Keep checkout disabled until the complete auth/terms/payment/fulfillment gates pass. Preserve the existing US$250 Blueprint offer and client/Substack products. Re-list stable product IDs before retrying live drafts after authentication is fixed. Do not publish savings claims against the inactive US$999.99 reference or activate live links.

## Copy and paste — Cowork
Build the remaining real offer inventory under MAIM, AMA Solutions and Major Dream using existing approved product documents. Record missing price/scope/rights/fulfillment decisions as open. Do not create 60 placeholder links or copy client details into public Git. Return a reviewable SKU table and the exact source for each offer.

## Verification and rollback
Stripe read-back verifies product descriptions, four journey amounts and all three new links inactive. No test purchase or paid delivery is claimed. Build/HTML and local test results accompany this PR.
To withdraw this catalog, keep its new test links inactive and archive only the new test products/prices. Existing live products, Blueprint and client/Substack links remain untouched. No account-wide deletion or live configuration rollback is needed.
