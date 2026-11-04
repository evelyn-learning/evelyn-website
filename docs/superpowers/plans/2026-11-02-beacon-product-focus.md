# Beacon product focus (evelynlearning.com first) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Beacon's evelynlearning.com digest from a site-wide SEO report into a weekly product report (AI Voice Tutor + Academy as white-label products) and let Beacon act on its own — noindex dead blog posts, add product CTAs to traffic posts, steer the autoblogger to buyer topics — with every action reversible.

**Architecture:** Two repos. evelynlearning `apps/marketing` gains a token-authenticated Beacon ingest API (blog post flags, funnel counts, autoblog topic queue) plus blog rendering for `noindex` / `ctaProduct`. Beacon (academy repo, `apps/api/src/services/beacon`, run by host cron from `/root/crimsora`) gains AI-visibility syncs (GA4 AI referrals, nginx AI-agent fetch log), a funnel sync and three new auto-actions that call the ingest API, and a product-layout weekly digest selected per tenant. Crimsora / evelyntutor keep the classic layout until their own rollout.

**Tech Stack:** Next.js 15 + mongoose (marketing, tests = `npx tsx` scripts with `node:assert`), Node/TS + mongoose + vitest + mongodb-memory-server (academy, `tests/unit/*.test.ts`, `tests/helpers/mongo.js`), nginx on the US box 85.239.239.134.

**Spec:** Agreed in chat 2026-11-02 (Praveen): noindex not delete · API spend OK · weekly digest · go ahead. Source facts: `/Users/luke/Dev/academy/docs/beacon.md`, `/Users/luke/Dev/academy/docs/superpowers/specs/2026-08-18-beacon-evelynlearning-tenant-design.md`.

## Global Constraints

- Nothing is deleted. Dead posts get `noindex` (robots meta + removed from sitemap), reversible from marketing `/admin/blog`.
- A post a human restored (`beaconLocked: true`) is never touched by Beacon again.
- Outbound / public-copy stays human: no emails, no Reddit, no edits to product pages in code, no pricing claims in CTAs.
- Ingest API: `Authorization: Bearer <BEACON_INGEST_TOKEN>`, constant-time compare, **503 when the env var is unset**, 401 on mismatch. Same token in marketing env and `/root/crimsora/.env.local` (Beacon side env name `BEACON_INGEST_TOKEN_EVELYNLEARNING`, read via tenant field `ingestTokenEnv`).
- Undo links are dashboard/admin buttons, never GET links in email (mail scanners pre-fetch links).
- New collections (academy `crimsora` DB): `beaconaireferrals`, `beaconaifetches`, `beaconfunneldailies`. New marketing fields are additive/optional.
- Copy rules: CTA copy names no client, no price. Voice tutor CTA → `/products/voice-tutor`; Academy CTA → `/products/academy`.
- Crimsora + evelyntutor behaviour unchanged: every new tenant field defaults to today's behaviour (`digestLayout: 'classic'`, no `ingestBaseUrl` → new actions/syncs skip).
- Flag rule: new behaviour is selected by tenant config, not code branches per tenant.

## Review Focus

1. Ingest API unreachable / token missing → Beacon run logs and continues (no tenant-run abort, no false "0 demos" in the digest — section says "funnel unavailable").
2. GSC returns no page rows (sync outage) → noindex action must propose nothing, not noindex every post.
3. Spoofed AI user-agents (scanner "ChatGPT-User" hitting `/api/.env`, 404s, assets) → excluded; agents with a published IP list are counted only when the IP verifies.
4. A restored post (`beaconLocked`) or a post newer than 90 days → never noindexed.
5. Week with zero AI referrals / zero fetches / zero demos → digest renders "none this week", not an empty table or NaN%.

---

### Task 1: Marketing — blog post flags render (noindex, CTA, sitemap, admin restore)

**Files:**
- Modify: `apps/marketing/src/models/BlogPost.ts` (fields)
- Create: `apps/marketing/src/lib/blog/beacon-flags.ts` (pure helpers)
- Create: `apps/marketing/src/lib/blog/beacon-flags.test.ts`
- Create: `apps/marketing/src/components/blog/ProductCta.tsx`
- Modify: `apps/marketing/src/app/blog/[slug]/page.tsx` (generateMetadata robots + render CTA)
- Modify: `apps/marketing/src/app/sitemap.ts` (exclude noindex posts; static pages drop `lastModified: now`, blog posts use `updatedAt`)
- Modify: `apps/marketing/src/app/admin/blog/**` list page — "Hidden by Beacon" filter + Restore button (sets `noindex:false, beaconLocked:true`) and "Remove CTA" (sets `ctaProduct:null, beaconLocked:true`), through the existing admin blog API route.
- Modify: `apps/marketing/package.json` → `"test:beacon-blog": "npx tsx src/lib/blog/beacon-flags.test.ts"`

**Interfaces:**
- Produces (BlogPost fields, all optional): `noindex?: boolean`, `noindexedAt?: Date`, `noindexReason?: string`, `ctaProduct?: 'voice-tutor' | 'academy' | null`, `beaconLocked?: boolean`.
- Produces: `blogRobots(post: { noindex?: boolean }): { index: boolean; follow: true }`; `isSitemapPost(post: { status: string; noindex?: boolean }): boolean`; `CTA_COPY: Record<'voice-tutor'|'academy', { heading: string; body: string; href: string; button: string }>`.

- [ ] **Step 1: Failing test** — `beacon-flags.test.ts`: `blogRobots({noindex:true})` → `{index:false, follow:true}`; `blogRobots({})` → `{index:true, follow:true}`; `isSitemapPost({status:'published', noindex:true})` → false; `isSitemapPost({status:'published'})` → true; `isSitemapPost({status:'draft'})` → false; `CTA_COPY['voice-tutor'].href === '/products/voice-tutor'`, `CTA_COPY.academy.href === '/products/academy'`; no CTA copy matches `/\$|\bprice\b/i`.
- [ ] **Step 2:** `npm run test:beacon-blog` → FAIL (module missing).
- [ ] **Step 3:** Implement helpers + fields + page/sitemap/admin wiring. CTA copy (fixed):
  - voice-tutor — heading "Add an AI voice tutor to your platform", body "A white-label tutor that talks students through problems on a live whiteboard, under your brand.", button "Try the live demo".
  - academy — heading "Launch your own branded online academy", body "Courses, practice and an AI tutor built in — white-label, on your domain.", button "See the Academy".
  CTA renders after the article body, before related posts, only when `ctaProduct` is set.
- [ ] **Step 4:** `npm run test:beacon-blog` PASS; `npx tsc --noEmit -p apps/marketing` clean.
- [ ] **Step 5:** Commit `marketing(blog): noindex + product CTA flags for Beacon; sitemap honours noindex and stops stamping now`.

### Task 2: Marketing — Beacon ingest API + autoblog topic queue

**Files:**
- Create: `apps/marketing/src/lib/beacon/ingest-auth.ts`, `apps/marketing/src/lib/beacon/funnel.ts`, `apps/marketing/src/lib/beacon/ingest.test.ts`
- Create routes: `apps/marketing/src/app/api/beacon/v1/posts/route.ts` (GET), `apps/marketing/src/app/api/beacon/v1/posts/[slug]/route.ts` (PATCH), `apps/marketing/src/app/api/beacon/v1/funnel/route.ts` (GET), `apps/marketing/src/app/api/beacon/v1/topics/route.ts` (PUT)
- Modify: `apps/marketing/src/models/AutoBlogSettings.ts` (+ `beaconTopics`), `apps/marketing/src/lib/services/auto-blog-generator.ts` (`decideParameters` takes the first beacon topic; pop it after a successful generation)
- Modify: `apps/marketing/package.json` → `"test:beacon-ingest": "npx tsx src/lib/beacon/ingest.test.ts"`
- Check nginx: `/api/beacon/v1` must route to :3001 (it does — only the tutor prefixes go to :3007).

**Interfaces:**
- `checkBeaconAuth(header: string | null, token: string | undefined): 200 | 401 | 503`
- GET `/api/beacon/v1/posts` → `{ posts: Array<{ slug; title; publishedAt: string /* publishedAt ?? createdAt, ISO */; noindex: boolean; ctaProduct: string | null; beaconLocked: boolean }> }` (published only)
- PATCH `/api/beacon/v1/posts/:slug` body `{ noindex?: boolean; reason?: string; ctaProduct?: 'voice-tutor'|'academy'|null }` → `{ ok: true, before: { noindex; ctaProduct } }`; **409 `{error:'locked'}` when `beaconLocked`**; 404 unknown slug.
- GET `/api/beacon/v1/funnel?from=YYYY-MM-DD&to=YYYY-MM-DD` (UTC, inclusive, max 92 days) → `{ days: Array<{ date; demoOpens: Record<productId, number>; demoEngaged: Record<productId, number>; tutorDemoSignups: number; contactForms: number }> }` — sources: `demosessions` (opens by `productId`, engaged = `summary.totalInteractions > 0`), `tutordemoleads.createdAt`, `contactsubmissions.createdAt`. (`leads` is outbound prospecting — excluded.)
- `bucketFunnel(rows: {demos, signups, contacts}, from, to)` pure aggregator in `funnel.ts` (the routes only query).
- PUT `/api/beacon/v1/topics` body `{ topics: Array<{ topic: string; reason: string; source: 'geo-lost' | 'product-query' }> }` (max 10) → replaces `AutoBlogSettings.beaconTopics`.
- `nextBeaconTopic(settings): { topic; reason } | null`.

- [ ] **Step 1: Failing tests** — `checkBeaconAuth(null,'t')`→401, `('Bearer t','t')`→200, `('Bearer x','t')`→401, `('Bearer t', undefined)`→503; `bucketFunnel` over 3 days with one empty day returns 3 entries, empty day all zeros; `nextBeaconTopic({beaconTopics:[]})` → null, with two → first.
- [ ] **Step 2:** `npm run test:beacon-ingest` FAIL.
- [ ] **Step 3:** Implement. Generator: when a beacon topic exists, the decide-parameters prompt receives `"Write about exactly this topic: <topic>. Why it matters to buyers: <reason>."` and the topic is removed only after the post saves.
- [ ] **Step 4:** tests PASS; typecheck clean.
- [ ] **Step 5:** Commit `marketing(beacon): ingest API (posts, funnel, topics) + autoblog takes Beacon topics first`.

### Task 3: Academy — AI visibility parsers + models + tenant fields

**Files:**
- Create: `apps/api/src/services/beacon/ai-visibility.ts`
- Create: `apps/api/src/models/BeaconAiVisibility.ts` (exports `BeaconAiReferral`, `BeaconAiFetch`, `BeaconFunnelDaily`; re-export from `models/index.ts`)
- Modify: `apps/api/src/models/BeaconTenantConfig.ts` (fields below)
- Test: `tests/unit/beacon-ai-visibility.test.ts`

**Interfaces:**
- Tenant fields (all optional, defaults = today's behaviour): `digestLayout: 'classic'|'product'` (default `'classic'`); `productPages: [{ id: string; label: string; pathPrefixes: string[]; demoProductIds: string[] }]` (default `[]`); `ingestBaseUrl: string` (default `''`); `ingestTokenEnv: string` (default `''`); `aiFetchLogPaths: string[]` (default `[]`); `noindexAfterDays: number` (default 90).
- `classifyAiSource(source: string): AiAssistant | null` with `AiAssistant = 'chatgpt'|'gemini'|'perplexity'|'claude'|'copilot'|'meta'|'deepseek'|'doubao'|'grok'|'mistral'`; matches hosts `chatgpt.com, chat.openai.com, gemini.google.com, gemini, perplexity.ai, www.perplexity.ai, claude.ai, copilot.com, copilot.microsoft.com, l.meta.ai, meta.ai, chat.deepseek.com, doubao.com, grok.com, chat.mistral.ai`.
- `parseAiFetchLine(line: string): AiFetchHit | null` for the `ai_fetch` nginx format (Task 5): `$time_iso8601 $host $remote_addr "$request" $status "$http_user_agent"`; `AiFetchHit = { date: string; host: string; ip: string; method: string; path: string; status: number; agent: AiAgent }`; `AiAgent` ∈ `ChatGPT-User, OAI-SearchBot, GPTBot, Claude-User, Claude-SearchBot, ClaudeBot, Perplexity-User, PerplexityBot, meta-externalagent, Applebot-Extended, Google-Extended, Bingbot`.
- `agentPurpose(agent: AiAgent): 'answer' | 'search-index' | 'training'` (User agents → answer; SearchBot/PerplexityBot/Bingbot → search-index; rest → training).
- `isCountableFetch(hit: AiFetchHit): boolean` — GET, status 200–399, path has no extension or ends `.html`/`.md`/`.txt`, not under `/api/`, `/_next/`, no `/.` segment, not matching `/wp-|\.php|\.env|\.git/i`.
- `ipInCidrs(ip: string, cidrs: string[]): boolean` (IPv4 + IPv6).
- `AI_IP_SOURCES: Partial<Record<AiAgent, string>>` — `ChatGPT-User: https://openai.com/chatgpt-user.json`, `OAI-SearchBot: https://openai.com/searchbot.json`, `GPTBot: https://openai.com/gptbot.json`, `Perplexity-User: https://www.perplexity.ai/perplexity-user.json`, `PerplexityBot: https://www.perplexity.ai/perplexitybot.json`; `loadIpRanges(fetchFn) → Partial<Record<AiAgent,string[]>>` reads `prefixes[].ipv4Prefix|ipv6Prefix`; a failed list fetch yields no entry for that agent.
- `verifyStatus(hit, ranges): 'verified' | 'unverified' | 'spoofed'` — list present & IP in it → verified; list present & IP not in it → spoofed (dropped); no list → unverified (kept, labelled).
- Models: `BeaconAiReferral { tenantId, date, assistant, landingPage, sessions }` unique `(tenantId,date,assistant,landingPage)`; `BeaconAiFetch { tenantId, date, agent, purpose, verify, path, hits }` unique `(tenantId,date,agent,verify,path)`; `BeaconFunnelDaily { tenantId, date, demoOpens: Mixed, demoEngaged: Mixed, tutorDemoSignups, contactForms }` unique `(tenantId,date)`.

- [ ] **Step 1: Failing tests** — `classifyAiSource('chatgpt.com')==='chatgpt'`, `('gemini')==='gemini'`, `('google')===null`, `('l.meta.ai')==='meta'`; parse a sample line → expected hit; `isCountableFetch` false for `/api/.env` 404, `/sitemap.xml`→false (extension), `/blog/x` 200→true; `ipInCidrs('20.171.207.5',['20.171.206.0/23'])` true, IPv6 `2a02:6ea0::1` in `2a02:6ea0::/32` true; `verifyStatus` three cases; default tenant doc has `digestLayout==='classic'` and `productPages.length===0`.
- [ ] **Step 2:** `npx vitest run tests/unit/beacon-ai-visibility.test.ts` FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** PASS; `npm run typecheck` clean.
- [ ] **Step 5:** Commit `beacon: AI visibility parsers (referrals, verified agent fetches) + product tenant fields`.

### Task 4: Academy — syncs (AI referrals, AI fetches, funnel) wired into beacon-daily

**Files:**
- Modify: `apps/api/src/services/beacon/google.ts` (+ `fetchGa4AiReferrals`, `fetchGscPageTotals`), `types.ts` (fetcher interface)
- Create: `apps/api/src/services/beacon/ingest-client.ts`, `apps/api/src/services/beacon/ai-sync.ts`
- Modify: `apps/api/src/scripts/beacon-daily.ts` (three guarded stages after GA4 sync)
- Test: `tests/unit/beacon-ai-sync.test.ts`

**Interfaces:**
- `fetchGa4AiReferrals(propertyId, start, end): Promise<Array<{ date; source; landingPage; sessions }>>` — GA4 dims `date, sessionSource, landingPage`, metric `sessions`, dimensionFilter `sessionSource` FULL_REGEXP over the Task 3 host list.
- `fetchGscPageTotals(siteUrl, start, end): Promise<Array<{ page; clicks; impressions }>>` — dimensions `['page']`, rowLimit 25000.
- `makeIngestClient(baseUrl: string, token: string, fetchFn = fetch): IngestClient` with `listPosts()`, `patchPost(slug, body)`, `funnel(from, to)`, `putTopics(topics)` — 15 s timeout, throws `IngestError(status)` on non-2xx.
- `ingestClientFor(tenant, env = process.env): IngestClient | null` — null when `ingestBaseUrl` or the env var named by `ingestTokenEnv` is empty.
- `syncAiReferrals(fetchers, tenant, {days})`, `syncAiFetches(tenant, { readLines: (path) => AsyncIterable<string>, ranges })` (only complete UTC days before today; recomputes and `$set`s each (date,agent,verify,path) so reruns are idempotent; host must equal `tenant.domain` or its apex), `syncFunnel(client, tenant, {days})`. Each returns counts for `BeaconRun.stats`.
- beacon-daily: each stage in its own try/catch → `stats.aiReferrals | aiFetches | funnel = 'error' | 'skipped'`, never aborting the tenant.

- [ ] **Step 1: Failing tests** (memory mongo, injected fetchers): referral rows for `chatgpt.com` + `google` → only chatgpt stored with assistant `chatgpt`; fetch lines for two days incl. a spoofed ChatGPT-User IP and a different host → only the verified, same-host, countable hit stored; rerun gives same counts; `syncFunnel` with a client that throws → resolves `'error'`, writes nothing; `ingestClientFor` with no env → null.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS + typecheck.
- [ ] **Step 5:** Commit `beacon: sync GA4 AI referrals, verified AI-agent fetches and product funnel`.

### Task 5: Ops — nginx AI-agent log on the US box (done by the controller, not a subagent)

- [ ] Add to `/etc/nginx/nginx.conf` http block: `map $http_user_agent $is_ai_agent { default 0; ~*(ChatGPT-User|OAI-SearchBot|GPTBot|Claude-User|Claude-SearchBot|ClaudeBot|Perplexity-User|PerplexityBot|meta-externalagent|Applebot-Extended|bingbot) 1; }` and `log_format ai_fetch '$time_iso8601 $host $remote_addr "$request" $status "$http_user_agent"';`
- [ ] In the evelynlearning.com 443 server block: `access_log /var/log/nginx/ai-fetch.log ai_fetch if=$is_ai_agent;` (existing access_log stays).
- [ ] Back up both files first (`.bak-2026-11-02`), `nginx -t`, `systemctl reload nginx`, curl with a `ChatGPT-User` UA and see one line appear.
- [ ] logrotate: `/var/log/nginx/ai-fetch.log` daily, rotate 14 (copy of the nginx stanza). Commit the snippets to `docs/ops/nginx-ai-fetch.md` in the evelynlearning worktree.

### Task 6: Academy — auto-actions (noindex dead posts, product CTA, autoblog topics)

**Files:**
- Modify: `apps/api/src/models/BeaconAction.ts` (kinds `noindex_blog_post`, `add_blog_cta`, `set_blog_topics`; status `reverted`)
- Create: `apps/api/src/services/beacon/product-actions.ts`
- Modify: `apps/api/src/services/beacon/actions.ts` (apply the three kinds via `IngestClient`; a 409 `locked` marks the action `rejected` with error `locked`)
- Modify: `apps/api/src/scripts/beacon-daily.ts` (propose + apply when `ingestClientFor` non-null), `beacon-weekly.ts` (topics after GEO)
- Test: `tests/unit/beacon-product-actions.test.ts`

**Interfaces:**
- `proposeNoindex(tenant, { posts, pageTotals, now }): ActionDraft[]` — post age (from `publishedAt`) > `noindexAfterDays`, not `noindex`, not `beaconLocked`, zero impressions in `pageTotals` for `https://<domain>/blog/<slug>` over the last `noindexAfterDays` days; **returns [] when `pageTotals` is empty**; cap 25 per run, oldest first.
- `proposeCtas(tenant, { posts, pageTotals28d }): ActionDraft[]` — top 10 blog pages by 28-day clicks with `ctaProduct == null`, not locked, not noindexed; product = `'academy'` when title matches `/course|curricul|academy|lms|online learning|school/i`, else `'voice-tutor'`.
- `proposeTopics(tenant, { lostGeo: Array<{question}>, productQueries: Array<{query; impressions; position}> }): ActionDraft | null` — up to 6 topics: every lost product GEO question (`source:'geo-lost'`), then product-page queries with position 5–20 by impressions (`source:'product-query'`); null when none. Weekly.
- `ActionDraft = { kind; mode: 'auto'; title; detail; payload }`; dedupe: same kind + slug within 30 days.
- Product queries come from a GSC query×page pull limited to `productPages[].pathPrefixes` (add `fetchGscPageQueries(siteUrl,start,end)` dims `['query','page']`, rowLimit 5000).

- [ ] **Step 1: Failing tests** — empty pageTotals → no noindex drafts; locked post skipped; 60-day-old post skipped at 90; 26 eligible → 25; CTA picks academy for "Curriculum design for online courses" and voice-tutor for "What is proportion"; topics from 2 lost questions + 3 queries → 5 topics, geo first; apply with a 409 client → status `rejected`, error `locked`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS + typecheck.
- [ ] **Step 5:** Commit `beacon: auto-noindex dead posts, product CTAs on traffic posts, autoblog topics from lost GEO + product queries`.

### Task 7: Academy — product-layout weekly digest

**Files:**
- Create: `apps/api/src/services/beacon/product-digest.ts`
- Modify: `apps/api/src/scripts/beacon-weekly.ts` (`tenant.digestLayout === 'product'` → product builder/renderer/narrator; classic unchanged)
- Test: `tests/unit/beacon-product-digest.test.ts`

**Interfaces:**
- `buildProductDigest(tenant, now): Promise<ProductDigest>` — window = last 7 complete days (D-9..D-3 for GSC; D-7..D-1 for funnel/AI) vs the 7 before.
  - `products: Array<{ id; label; search: {clicks; impressions; position; prev...}; demoOpens; demoEngaged; prevDemoOpens; prevDemoEngaged }>` (search from `BeaconPageStat` rows whose page path starts with a `pathPrefix`).
  - `funnel: { tutorDemoSignups; contactForms; prev... } | null` (null = no funnel rows in window → "funnel unavailable").
  - `ai: { referrals: Array<{assistant; sessions; topLanding}>; fetches: Array<{agent; purpose; verify; hits; topPaths: string[]}>; totals }`.
  - `geo: { asked; cited; lost: string[]; won: string[] }` (latest run).
  - `actions: Array<{ kind; title; status; appliedAt }>` (last 7 days).
  - `health: string[]` (stale run >48 h, stage errors from last BeaconRun.stats).
- `renderProductDigestHtml(d, narrative, dashboardUrl, adminBlogUrl)`: sections in order — Summary (narrative), Products, Inbound (signups/contact), AI assistants (referrals, then "assistants reading our pages to answer someone" = purpose `answer`, then index/training one-line totals), Beacon did this week (each row: what + "undo in admin" link to `adminBlogUrl` for blog actions), Health. Empty arrays render "none this week".
- `makeProductNarrator(apiKey, model, brandName)` — system prompt: B2B analyst for white-label AI tutor + academy; ≤120 words; name at most 2 next steps a human must do (things Beacon did not already do); never recommend generic SEO for student-intent queries.
- Subject: `weekly — Voice Tutor & Academy — <weekLabel>`.

- [ ] **Step 1: Failing tests** — products aggregate only matching prefixes; zero-data week renders "none this week" and no `NaN`; funnel null renders "funnel unavailable"; spoofed fetches never appear (they are not stored, but assert `verify` labels render); classic tenant still uses `buildDigestSummary` (beacon-weekly switch unit via exported `pickDigest(tenant)`).
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS + `npm test` (full academy suite) green except known baseline.
- [ ] **Step 5:** Commit `beacon: product-layout weekly digest (products, inbound, AI assistants, actions)`.

### Task 8: Rollout (controller)

- [ ] Marketing: gate (`test:beacon-blog`, `test:beacon-ingest`, `tsc`, prod build), generate token (`openssl rand -hex 32`), add `BEACON_INGEST_TOKEN` to the marketing prod env file, `./deploy-marketing.sh` from the worktree (carries the uploadDate fix 9f5ec5a0), verify `/products/academy` JSON-LD `uploadDate` has `+00:00`, `GET /api/beacon/v1/posts` 401 without token / 200 with.
- [ ] Nginx: Task 5.
- [ ] Academy: before deploying, diff what `/root/crimsora` runs vs academy main (memory: main carries the GAC web build unreviewed for Crimsora; 6ce601d0 not deployed). If main ≠ prod beyond Beacon, **ask Praveen** before `deploy-crimsora.sh`; Beacon itself only needs the API source tree (cron runs `npx tsx`).
- [ ] Tenant config (`crimsora` DB, targeted `$set` on `tenantId:'evelynlearning'` only — never a full re-seed): `digestFrequency:'weekly'`, `digestLayout:'product'`, `productPages` = voice-tutor (`/products/voice-tutor`, `/tutor`; demo ids `voice-tutor`) and academy (`/products/academy`, `/showcase/crimsora`; demo ids `academy`), `ingestBaseUrl:'https://www.evelynlearning.com'`, `ingestTokenEnv:'BEACON_INGEST_TOKEN_EVELYNLEARNING'`, `aiFetchLogPaths:['/var/log/nginx/ai-fetch.log','/var/log/nginx/ai-fetch.log.1']`, `geoQuestions` = product-only set: whitelabel-tutor, voice-tutor-cost, khanmigo-vs-custom, ferpa-soc2, lms-embed, plus `academy-whitelabel`: "Which platforms let a tutoring company launch its own branded online academy with an AI tutor built in?". Update `seed/beacon/evelynlearning.json` to match.
- [ ] Force one `beacon-daily.ts` + one `beacon-weekly.ts` for evelynlearning; read BeaconRun stats; check the email; check crimsora/evelyntutor runs unchanged (classic, same stages).
- [ ] `wt.sh finish` both repos; memory entry with build ids + what is owed (Crimsora + evelyntutor rollout).
