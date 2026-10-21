# Live Stripe catalog receipt — 20 October 2026

This supersedes the earlier live-write authentication blocker in STRIPE-CATALOG-2026-10-20.md and stripe-catalog.json. The former test records are preserved; they are not the live IDs.

Live writes now work. The canonical 63-offer register, descriptions, prices, exact IDs and verification evidence are in:
https://github.com/MajorDream444/Major-AI-OS/pull/45

Live Academy product: prod_MAIM_ACADEMY_JOURNEY_V1 (inactive).
Founding price: price_1USUWmBaiziDnHMm4AdgcMqx, USD24900 (US$249), archived.
Reserved alternate live prices:
- promotion_149: price_1USUWuBaiziDnHMm5BFecYPP, USD minor units 14900, archived.
- alternate_399: price_1USUX2BaiziDnHMmkzmMFX9A, USD minor units 39900, archived.
- unpublished_standard_999_99: price_1USUXABaiziDnHMmwsuM2Ihi, USD minor units 99999, archived.

All live journey prices were read back. No live default_price is assigned because Stripe requires the archived price to be activated first. Automatic approval review rejected activating the live founding price while enrollment is closed and activation is not authorized. No workaround was used. Product metadata is saved without activation.

The advisory product now exists in live mode as prod_MAIM_ADVISORY_3_V1, inactive, with a US$450 working price. Separate vault passes exist for 1/3/6/12 months at US$49/129/229/399, also inactive. Exact IDs are in the canonical register. New working prices resolve catalog gaps; they do not certify delivery, cancellation/refund terms or a stocked vault.

The complete catalog has 59 new inactive live products plus four pre-existing MAIM entries. Books and Lucky volume titles remain explicitly draft/provisional where source production is unfinished. No new live payment links were created. Existing six live links, client records and Substack products remain unchanged.

Next: release-ready assets and rights, identity/entitlements on the MAIM database, terms, test purchase/fulfillment, capacity/booking controls, then separately authorized activation. Do not put live keys in chat/Git or bypass the test-only member runtime.
