# Next sessions: (A) Algebra 2 + Grade 8 content, (B) Partner portal

Written 2026-09-19 for fresh sessions. Two independent threads; run them as separate sessions/worktrees. Each section lists **what exists**, **what to build**, **decisions Praveen must make**, and a **start-here** for the session.

---

## A. Content: Algebra 2 and Grade 8

### What exists (verified 2026-09-19)
- **Algebra 1** and **Geometry**: 40 authored lesson seeds each, 10 units (`apps/tutor/src/lib/tutor/lesson-plan/seeds/alg1-u*`, `geom-u*`). Taxonomy `9-10` already lists `algebra-2` (`topic-taxonomy.ts`), but **zero `alg2-*` seeds**; Algebra 2 topics are served today only by the freestyle plan engine plus adjacent AP Precalc (4) and Algebra 1 seeds.
- **Grade 8** lives on worktree `.claude/worktrees/demo-gate` (branch `worktree-demo-gate`, HEAD `1673a3d3`, **25 commits NOT on main — never delete that worktree**): m8math 40, m8ela 40, m8sci 10, m8geo 2. Grade 6 and 7 are LIVE (160 each). The wave's machinery, lint counts, curricula drafts and rulings 16–31 are in memory `project_grades_6_8_wave.md` ("Grade 8 runbook" section) — read it FIRST.
- **Generation stack** (memory `project_course_gen_model_routing.md`): generators are registry-routed (`content-gen`/`content-verify`); Praveen ruled **Haiku-gen + Sonnet-verify**; `--batch` verify is UNPROVEN (queue stalls) — sequential stays default. Plans for the MS wave were produced by agent fan-out in an Opus session (subscription economics), not by the item generator.
- **Promised to prospects (2026-09-19, GreenApple/Dee):** Algebra 2 authored before her pilot; AP Precalculus, AP Chemistry, AP Biology, AP Physics 1 "covered unit by unit" — today AP Precalc has 4 seeds, AP Chem 3, AP Bio 9, AP Physics 7 (no unit structure). Those are the next content debt after Algebra 2.
- House rule (memory `feedback_marketing_stats_sync`): any content-count/availability change ships with the homepage + marketing pages updated in the SAME drop.

### What to build
1. **Grade 8 completion** (resume, do not restart): m8sci 10→40, m8geo 2→40 on the demo-gate worktree using the Grade 8 runbook; lint expected 442 then 480; ingest into Academy (Crimsora + evelyntutor DBs per the Grade 7 recipe in `project_ms_grade7_wave.md`); catalog/nav drop; **merge + push the 25 commits** (Rule 2: merge origin/main → gate → deploy → push); marketing stats sync.
2. **Algebra 2** as a full HS course mirroring Algebra 1's shape: 10 units × 4 lessons = 40 `alg2-u{1..10}-*.ts` seeds, US Common-Core-aligned sequence (functions & transformations; quadratics revisited & complex numbers; polynomials; rational & radical functions; exponentials & logarithms; sequences & series; trigonometry & unit circle; trig identities; probability & statistics; conics/systems), each with worked example → guided → independent + `try_yourselves`; register in the lesson-plan index; practice bank items + topic notes for P&Q parity (`generate-bank-items.ts`, notes generators); lint; ingest; catalog; marketing sync.
3. **Then** the AP promises, in order of Dee's list: AP Precalculus (4 units × ~10), AP Physics 1, AP Chemistry, AP Biology — each to the "unit by unit" bar. Scope each as its own plan.

### Decisions for Praveen
- Which session model authors the plans (Opus fan-out like the MS wave vs. the Haiku-gen/Sonnet-verify pipeline)? The MS wave's quality came from agent-authored plans + lint; the item generator is for practice banks.
- Ingest targets for Algebra 2 (Crimsora? evelyntutor is open-taxonomy; academy default brand?).
- Whether Grade 8 ships before Algebra 2 (recommended: yes — it is 78% done and unpushed work is risk).

### Start-here for the content session
- `git -C .claude/worktrees/demo-gate status` (must be clean), read `project_grades_6_8_wave.md` §"Grade 8 runbook", then `m8sci` batch 2.
- For Algebra 2: copy the Algebra 1 unit skeleton (`ls seeds | grep ^alg1-`), draft the 10-unit curriculum for sign-off (2 flags max), then author in batches of one unit with lint after each.

---

## B. Partner portal (self-serve onboarding, keys, usage, billing)

### What exists (verified 2026-09-19)
- **Public portal** `tutor.evelynlearning.com` (`apps/tutor/src/app/tutor-portal/*`): landing, pricing ($0.15 voice / $0.12 text, calculator), docs (8 pages — **4 are aspirational**: quickstart/api/authentication/webhooks describe `api.evelynlearning.com`, `X-API-Key` and 34 REST endpoints that do not exist), demo (voice + text, gated 3/IP/day · 3/email), sandbox request form (stores + emails; provisioning MANUAL), embed endpoint, replay.
- **Real integration surface**: signed HS256 embed token (claims incl. `input_mode`), `/api/portal/v1/*` HMAC-signed partner API (17 routes: sessions/summary with `mode`, practice, grade, notes, plan-generate with materials, learner-state, mastery, gaps, student-erase, taxonomy-generate…), `evelyn:*` postMessage events. THE contract doc is `docs/whitelabel/kanzoo/integration-guide.md`; the portal-contract package (sibling repo, v1.18.0) types the wire.
- **Partner registry**: `models/Partner.ts` (name, kind partner|first-party|test, status, AES-GCM **sealed secrets** with key versions + expiry, `allowedEndpoints`, `limits {rpm, burst, dailyQuota}`, `flagOverrides`, `metering.plan`); `PartnerCounter.ts` for quotas; provisioning via `scripts/tutor/kanzoo-provision.sh` (one-shot, dry-run default, secret to `~/.evelyn/partners/<id>.secret`). Partners today: academy, crimsora, evelyn-marketing (+ kanzoo provisioned).
- **Metering**: sessions carry `durationSec` (active seconds), `inputMode`, `sourcePartnerId`, `estimatedCost`; on-box crons `export-partner-metering.sh` (daily 02:07) + `mail-partner-metering.js` (Mon 17:12) under `evelyn-tutor-ops`. **No invoicing, no Stripe in the engine.** Academy (sibling repo) HAS Stripe checkout/portal/webhooks for consumer subscriptions per tenant — different problem.
- **Tenancy**: a white-label Academy brand = a new deploy (BRAND env, own DB, nginx, pm2), not a row; `Org` model is theming-only. Engine partners are rows.
- **Kanzoo/DUC asks (call 2026-09-15, memory `project_kanzoo_duc_academy_inquiry.md`)**: embed under own brand, lesson/assignment context in, session/progress data out, sandbox, pricing, self-serve keys + metering. Decision then: portal not built that round. GreenApple (2026-09-19) asks the same plus pseudonymous IDs, US hosting, encryption at rest. Hungarian prospect asks for full brand + own billing (Academy tenant).

### Two partner archetypes the portal must serve
| | **API / embed partner** (Kanzoo, GreenApple option B) | **White-label Academy tenant** (Crimsora, GreenApple option A, Hungarian brand) |
|---|---|---|
| Identity of students | theirs (pseudonymous ids in the token) | ours per tenant (email accounts) |
| What they configure | keys, allowed endpoints, branding of the embed (persona/voice/logo), webhooks, input mode default | brand, domain, content catalog, teacher personas, Stripe, parent reports |
| What they watch | minutes (voice/text), sessions, per-student summaries, errors, invoices | students, revenue, sessions, content coverage |
| Provisioning today | manual script | manual deploy |

### Proposed portal scope (MVP → later)
**Phase 0 — truth.** Delete or rewrite the 4 aspirational docs pages so the portal documents only what exists (embed token + `/api/portal/v1` + events). Generate the API reference FROM the portal-contract package so it cannot drift again.

**Phase 1 — partner sign-in + read-only console (no new billing yet).** Portal accounts (Google + email magic link) linked to a Partner row; members/roles; **Usage dashboard** from existing data: minutes by mode, sessions, active students, cost-to-them at list rates, per-day chart, CSV export (reuse the metering export); **Keys page**: view partner id, rotate secret (registry already versions secrets), see allowed endpoints + limits; **Token playground** (sign a test token in-browser with a sandbox secret); **Sessions** list with summaries/replays scoped to `sourcePartnerId`; **Data** tab: student export + erase (wraps `student-erase`).

**Phase 2 — self-serve onboarding + Stripe metered billing.** Sign up → verify email → org → pick product (Voice Tutor embed; text-only default toggle) → **sandbox key auto-provisioned** (300 free minutes, enforced by a real meter, not honour) → add card (Stripe Customer + metered subscription: two metered prices, voice-minute and text-minute; usage records pushed nightly from `durationSec` by mode) → **production key** issued on card-on-file; monthly Stripe invoices; prepaid bundles as Stripe one-off invoices with a credit balance for partners who cannot pay per-minute (India: per-student bundles per Praveen's rule); volume tiers ≥50k min via Stripe tiered pricing. Suspend on failed payment (Partner.status). Admin side: approve/limit, plan overrides, cost vs. revenue per partner (estimatedCost already exists — never expose it to partners).

**Phase 3 — white-label tenant self-service.** Requires an architectural decision: **multi-tenant Academy (tenant = row: brand, domain, content, Stripe account)** vs. **automated deploy-per-tenant**. Recommended: per-row tenancy for brand/content/config with per-tenant DB names and a shared deploy; custom domains via a wildcard + per-tenant TLS (Cloudflare for SaaS or Caddy). Until then: an "Apply for a white-label brand" form that feeds the manual provisioning runbook.

**Phase 4 — API breadth.** Webhooks (session.started/ended — tables already documented, no dispatcher exists), module/curriculum upload as a first-class API (today: `taxonomy-generate` + org ingest, admin-only), voices catalog, SDK snippets, status page.

### Billing wiring, concretely
1. **Source of truth for a billable minute** = `activeSeconds(transcript)` on session end (already the `durationSec` in `sessions/summary`), tagged by `inputMode` and `sourcePartnerId`. Add a **`PartnerUsage` daily rollup** (partnerId, date, voiceSec, textSec, sessions, students) written by the end-of-session commit (idempotent upsert) — replaces the cron export as the ledger; keep the cron as a cross-check.
2. **Stripe**: one Customer per Partner; a metered Subscription with two Prices (voice $0.15/min, text $0.12/min, per-minute unit, `aggregate_usage: sum`); a nightly job posts usage records per price from the rollup; Stripe invoices monthly; webhook handler (invoice.paid / payment_failed / customer.subscription.deleted) updates `Partner.status` and `metering.plan`. Bundles/prepaid: Stripe invoice items + a `credits` balance decremented before usage records. Taxes via Stripe Tax; India partners invoiced in INR bundles (Praveen's rule: never per-minute to Indian customers).
3. **Free sandbox**: sandbox keys carry `metering.plan='sandbox'` and a 300-minute cap enforced in `demo-gate/enforce.ts`-style middleware on the brain route (the same place partner quotas live) — today the 300 is honour-system.
4. **Partner-visible numbers** = minutes and list-rate charges only. `estimatedCostUsd` (our cost) is stripped for non-first-party tenants (contract v1.17.0 already does this on the wire — verify the dashboard never shows it).

### Decisions for Praveen (before the portal session starts)
1. Archetype priority: API partners first (Kanzoo, GreenApple B) — recommended — or tenant self-service first (Hungarian)?
2. Self-serve production keys on card-on-file, or manual approval of every partner (recommended for the first 10)?
3. Billing model defaults: per-minute metered (US/EU) + bundles (India) as above? Prepaid credits required before production, or postpaid with a cap?
4. Multi-tenant Academy (row) vs deploy-per-tenant — a real architecture call; needed only for Phase 3.
5. Where the portal lives — **DECIDED 2026-09-19 (Praveen):** partners will use other products too (virtual lab, AI co-pilot, Academy), so the console is NOT tutor-scoped. Structure: `partners.evelynlearning.com` = the ONE partner console (served by `apps/tutor` behind an nginx alias for now; extractable later); `api.evelynlearning.com` = one API host, path-namespaced `/v1/tutor|academy|labs|copilot`; one subdomain per product (`tutor.`, `academy.`, …); `evelynlearning.com` stays marketing-only. Rules: no cross-subdomain cookies (signed tokens only); ONE `PartnerUsage (partnerId, product, unit, qty, date)` rollup feeds billing for every product; one Stripe customer per partner. Memory: `partner-platform-domains-decision`.
6. Kill the 4 aspirational docs pages now (Phase 0 is one session and removes a live liability).

### Start-here for the portal session
- Read memories: `project_whitelabel_portal.md`, `project_kanzoo_duc_academy_inquiry.md`, `project_partner_secret_registry_gap.md`, `project_tutor_demo_gate.md`, `reference_tutor_cost_per_minute_measured.md`, and this file. Then brainstorm (architectural path) Phase 1 only; write its spec; plan; SDD.
- Inventory first: `apps/tutor/src/app/api/portal/v1/*` (17 routes), `models/Partner.ts`, `models/PartnerCounter.ts`, `lib/tutor/portal/{registry,auth,limits,session-summary}.ts`, the two on-box metering crons, `scripts/tutor/kanzoo-provision.sh`.
