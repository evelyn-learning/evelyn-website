# Evelyn Academy product page + interactive demo + video walkthrough — design

**Date:** 2026-09-16 · **Lane:** ROLE 4 / `apps/marketing` (evelynlearning.com) · **Worktree:** `.claude/worktrees/marketing-academy-page` (branch `marketing-academy-page`)
**Status:** design approved in chat by Praveen 2026-09-16 (hybrid demo + section order; sandbox tenant deferred; video walkthrough added; deploy must not touch the tutor engine).

## 1. Problem

evelynlearning.com has 24 product pages and none for **Evelyn Academy** — the white-label learning platform (the `academy` repo) that Crimsora and evelyntutor.com run on. Measured 2026-09-16: `/products/{academy,evelyn-academy,lms,learning-platform}` → 404 (control `/products/voice-tutor` → 200); `academy.evelynlearning.com` does not resolve. The only mention is a two-line Crimsora card on `/products/voice-tutor`.

Inbound leads (e.g. Nisarg Foundation, 2026-09-16: custom modules + e-learning videos for MBA/BBA PD training) are asking for video-course production. The pitch is that a voice-tutor academy replaces passive video courses — and there is no page to send them to.

## 2. Goals / non-goals

**Goals**
1. A product page at `/products/academy` that sells the platform (not just the tutor) to institutions, training providers and ed-tech companies.
2. An interactive, no-login demo on that page: a simulated Academy workspace with a **live brand switcher**, a **role switcher**, and the **real voice tutor** inside the lesson tab.
3. A ~60 s video walkthrough built with the Crimsora promo pipeline, shown on the page.
4. Ship with **zero effect on the tutor engine** (§8 is a hard requirement, not a nicety).

**Non-goals (explicitly deferred)**
- A real sandbox tenant at `academy.evelynlearning.com` (seeded demo student, auto-login). Later phase; the page's CTA copy says "ask for a sandbox".
- Any change to `packages/core/**`, `apps/tutor/**`, the portal contract, the `academy` repo, nginx, env files, or npm dependencies.
- Pricing on the page (CTA → `/contact?product=academy`).

## 3. Approach (chosen: hybrid)

| Option | Verdict |
|---|---|
| **A. Simulated workspace in `apps/marketing` + real tutor embedded** | **Chosen.** Same pattern as the other 23 mocked demos; no backend, no auth, no cross-repo dependency; the one real thing (the tutor) is already gated and quota'd. |
| B. Real sandbox tenant | Deferred — new deploy, DNS, seeded student, reset job, abuse controls, crosses into the academy lane. |
| C. Screenshots/video only | Folded in as supporting proof (§7 video, §4 "live in production"), not as the demo. |

The academy repo is a separate codebase, so the demo **re-implements simplified UI with sample data** — it never imports academy code.

## 4. Page — `/products/academy`

Files (pattern = `products/voice-tutor`):
- `apps/marketing/src/app/products/academy/layout.tsx` — metadata, `SoftwareApplicationJsonLd`, `FAQPageJsonLd`, `BreadcrumbJsonLd`, (+ `VideoObject` JSON-LD once the video ships).
- `apps/marketing/src/app/products/academy/page.tsx` — sections below.

Sections, in order:
1. **Hero** — "Evelyn Academy: your branded AI learning platform, with a voice tutor teaching every lesson." CTAs: *Try the demo* (`#demo`), *Watch the 60-second tour* (`#tour`, hidden until the video exists), *Talk to us*.
2. **Why not video courses** — a 3-row comparison (passive video course vs voice-tutor academy): learners watch vs learners talk and are questioned; one pace vs per-learner pace and gaps; re-shoot to update vs edit the lesson plan. Copy stays comparative and factual — no "everyone is moving" claims, no invented metrics.
3. **Demo** (`#demo`) — §5.
4. **Video tour** (`#tour`) — §7. Renders only when `ACADEMY_TOUR_VIDEO` is set, so the page can ship before the video.
5. **Live in production** — Crimsora + evelyntutor.com cards, same FACTUAL-copy guardrail as `LiveImplementationsSection` on the voice-tutor page (what each site is, that it runs on the platform; no metrics, no quotes, no claims on their behalf).
6. **Feature grid by role** — Learner (6-tab course workspace, live lessons, practice & quizzes, tutor-assigned homework, mock exams, notes → revision sheet/PDF, mastery + review-due, session replays, teacher personas) · Parent/Sponsor (weekly progress emails, score-report emails) · Operator (students dashboard with funnel stage + hours + per-session replay, teacher/course/demo/referral admin, plans + fair-use minutes, Stripe billing, SEO engine).
7. **Bring your syllabus** — the course-builder story: upload an outline/handbook → AI drafts sections + learning objectives → you review/approve → lesson plans build in batch → the tutor teaches them. Labelled **"available on request"** (the org console is flag-off by default in code).
8. **White-label** — one codebase, brand = config (name, domain, palette, capability flags); three brands already run on it.
9. **FAQ** (from `productFAQs['academy']`) · **CTA** (`/contact?product=academy`, `&demo=true`) · **Related products** (voice-tutor, course-creator-studio, analytics-dashboard).

Registration (single source of truth = `src/data/products.ts`):
- New `Product` `{ id: 'academy', title: 'Evelyn Academy', tagline: 'White-label AI learning platform with a voice tutor in every lesson', demoStatus: 'live', … }` as the **first item of "Tutoring AI"**, with 7–8 FAQs. This feeds the sitemap, `/products` listing, chat-widget KB and FAQ JSON-LD automatically.
- `src/lib/seo/keywords.ts` — `academy` keyword set (white-label LMS, AI learning platform, AI tutor LMS, video course alternative, corporate/professional training platform).
- Product-count copy **24 → 25**: `src/models/SiteSettings.ts:77,83`, `src/lib/chat/knowledge-base.ts:50,53,144,202`, and the `sitemap.ts:39` comment. ⚠ `SiteSettings.ts` is a Mongoose default — check whether a live `sitesettings` doc overrides it before assuming the copy changes in prod; if it does, that DB edit is a separate, announced step (not part of this deploy).
- **PageVault → Academy (Praveen, 2026-09-16):** the homepage flagship hero card (`src/app/page.tsx`) and the `/products#flagship` grid (`FLAGSHIP_IDS` + the removed `PageVaultCard` in `src/app/products/page.tsx`) now feature Evelyn Academy instead of the external PageVault card. `/industries/publishers` keeps its PageVault section (not in scope). Product `gradient` classes must already appear in a scanned file — Tailwind `content` does not include `src/data/`.
- Cross-links: add Academy to `RelatedProductsSection` on `/products/voice-tutor`; homepage product strip only if it is data-driven from `products.ts` (no bespoke homepage work in this spec).

## 5. Demo — `AcademyPlatformDemo`

Location: `apps/marketing/src/components/demos/AcademyPlatformDemo/` (folder, because one 1,000-line file is the failure mode of the existing demos):

| File | Responsibility |
|---|---|
| `index.tsx` | Shell: browser-chrome frame, brand bar, role switcher, tab routing, analytics. Default export, mounted via `dynamic(..., { ssr:false })`. |
| `brand.ts` | `DemoBrand { name, primary, accent, logoInitials }`, presets (Evelyn Academy blue · Crimsora crimson `#a51c30` · Evelyn Tutor teal `#0d9488` · **Your brand**), contrast-safe foreground helper. Applied as CSS variables on the frame root — mirrors the real "rebrand = token swap" architecture. |
| `data.ts` | Sample course **"Business Communication (BBA)"**: 3 units × ~4 lessons, LOs, mastery grid, gaps, review-due, practice items, a 5-question mini mock, notes, a parent-report week, 8 roster students. Fictional names only. |
| `student/{Overview,Lessons,Practice,MockExam,Notes}.tsx` | One file per tab. |
| `ParentReport.tsx` | Weekly progress email preview (minutes, days active, lessons, "you nailed", stuck vs resolved gaps, teacher's note). |
| `AdminRoster.tsx` | Students table: funnel-stage pill, sessions/hours, last seen, access; one row expands to a session list with "replay" chips. |

Behaviour:
- **Brand switcher** — presets + "Your brand": institution-name input (≤ 40 chars, rendered as text only) and a colour input. Re-themes the whole frame instantly. This is the white-label moment and the first thing the visitor is nudged to try.
- **Role switcher** — Student / Parent / Admin.
- **Student tabs** — *Overview*: projection band, pace vs goal, unit × LO mastery heatmap, gap cards, review-due, next-best-action. *Lessons*: units → lessons with phase pills, teacher chip, **Study** button. *Practice*: a "From your tutor" homework card (with the tutor's reason), objective rows with mastery dots + review-due flag, a working 3-question drill. *Mock exam*: mini player — timer, question palette, answer eliminator, mark-for-review → score report with per-unit breakdown and a "Review with your tutor" button. *Notes*: Detailed ↔ Revision toggle.
- **The real part** — *Study* (and "Review with your tutor") swaps the lesson pane for the existing `VoiceTutorLiveDemo` with `source="products-academy-demo"`. It is lazy-imported on click, keeps its own name+email gate and 3/IP/day · 3/email quotas, and needs **no engine change** (verified 2026-09-16: `source` is a free-string prop → `metadata.source`; neither `demo-start/route.ts` nor `demo-gate/mint.ts` inspects it, and `/solutions/[segment]` already ships non-default values `solutions-<slug>` in prod).
- A persistent footnote: "Simulated workspace with sample data — the tutor session is real."

Constraints: no new npm dependencies (root `package-lock.json` is shared with the tutor); Tailwind + lucide only; no network calls except the embedded live demo; works at 360 px (tabs collapse to a scroll strip, heatmap scrolls inside its card, no page-level horizontal scroll); keyboard-reachable tabs with `aria-selected`.

Analytics (a LOCAL `trackAcademyDemo` gtag helper in `ui.tsx` — the shared `trackEvent` has a closed event-name union in `packages/core`, which this work must not touch): `academy_demo_brand_change {preset|custom}`, `academy_demo_role_change`, `academy_demo_tab_view`, `academy_demo_live_lesson_open`. Custom institution names are **not** sent.

## 6. Copy guardrails

- Crimsora / evelyntutor: factual only (cross-promo spec 2026-08-04).
- No fabricated metrics, testimonials, customer logos or adoption claims.
- Course builder, sandbox tenant: "on request".
- Catalog numbers, if quoted, come from the academy seed at write time (26 courses / 1,073 lessons / 1,106 study guides as of 2026-09-16) and are dated in a code comment so they can be re-derived.

## 7. Video walkthrough (cues from the Crimsora promo)

Pipeline = `academy/scripts/promo/` + `academy/scripts/capture-session-video.mjs`, **invoked by path, read-only** — nothing is committed to the academy repo.

What we keep from the Crimsora promo: real product footage only; narration in a real teacher voice via Cartesia (`gen-vo.mjs`, `atempo=1.09`); scene label chips; branded intro/end cards; separately licensed music bed ~10–13 dB under voice; `loudnorm` to −16 LUFS; 1080p; ~45–60 s. What we change: the footage is the **neutral `academy` brand** (`BRAND` unset → "Evelyn Academy", blue) on the local stack, so the video sells the white-label product rather than Crimsora; the story is B2B (institution → branded academy), not B2C.

Storyboard (~60 s):
| # | Scene | Source | ~s |
|---|---|---|---|
| 0 | Intro card — "Evelyn Academy · your branded AI learning platform" | re-skinned `introcard.html` | 3 |
| 1 | Course workspace → Lessons → click Study | `capture-page-scroll` + logged-in state, academy brand | 8 |
| 2 | **Live lesson, board drawing, tutor voice** (tutor-only audio) | `CAPTURE_TTS=1 capture-session-video.mjs` + `tts-track.mjs` | 14 |
| 3 | Practice & Quizzes — homework from the tutor, a drill | logged-in capture | 8 |
| 4 | Mock exam player → score report | logged-in capture | 8 |
| 5 | Overview — mastery heatmap, review-due | logged-in capture (account with real usage data) | 6 |
| 6 | **Brand swap** — same screen in academy blue → crimsora crimson → evelyn teal | Playwright three-brand builds (:3011/:3012/:3013), hard cuts | 5 |
| 7 | Admin students dashboard | logged-in admin capture, **local seeded data only** | 5 |
| 8 | End card — "Bring your syllabus. evelynlearning.com/products/academy" | re-skinned `endcard.html` | 3 |

Hard rules: **no real student's voice, name, email or session** in any frame (the v3 re-cut exists because of this) — tutor-only TTS capture, local seeded accounts, admin footage from the local in-memory stack (`tools/e2e-backend.mjs`), never prod. The capture needs the local tutor engine on :3006 — running it locally is not a deploy.

Durability (the v2 sources were lost in a scratchpad): commit the small sources — `scenes.json`, `vo-script.json`, the two re-skinned cards — under `apps/marketing/scripts/promo-academy/` (outside the deploy allow-list); keep raw webm/VO/music under `~/.evelyn/promo/academy-v1/` and record that path in the scripts' README.

On the page: `apps/marketing/public/videos/academy-tour-v1.mp4` (target ≤ 8 MB, H.264 + faststart) + poster jpg; click-to-play lightbox **with sound**, `preload="none"`, no autoplay (voices are the product; LCP untouched); `VideoObject` JSON-LD. `public/` is on the deploy allow-list and in `.deploy-public-manifest` — still verify the served URL returns 200/206 after deploy rather than assuming. Optional later: a 1440p upscale to YouTube.

Verification before it ships: duration, `ebur128` ≈ −16 LUFS, Deepgram `diarize` shows narrator + tutor only (no third speaker), spot-frames checked for PII.

## 8. Deploy isolation — the tutor engine must not be affected

**Structural facts (measured in `deploy-marketing.sh`, 2026-09-16):** this script ships `apps/marketing` → `/root/evelyn-marketing` → pm2 `evelyn-marketing` :3001. The tutor is `deploy-tutor.sh` → `/root/evelyn-tutor` → pm2 `evelyn-tutor` :3007. Separate remote dirs, separate pm2 processes, separate server env destinations. `deploy-tutor.sh` is **never run** in this work.

**The only real couplings, and the rule for each:**
| Coupling | Rule |
|---|---|
| `packages/core` is bundled into both apps | **Zero changes under `packages/core/**`.** The live demo is reused through its existing props. |
| Root `package-lock.json` / `package.json` shared | **No new dependencies.** |
| `.env.local.production` is one local source for both scripts (time-shifted coupling) | **No env edits.** Worktree copy must be byte-identical to root (`cmp`) before deploy. |
| `/tmp/evelyn-deploy.lock` shared by the two scripts | Marketing takes it only for the duration of its own deploy; announce before/after; it can delay a concurrent tutor deploy, never trigger one. |
| `pm2 save` inside the script writes the global dump | Expected; it snapshots `evelyn-tutor` as-is. Verified by the before/after below. |
| `/api/tutor/demo-start` is served by the engine | Reused unchanged; only a new `metadata.source` string. Existing quotas bound the cost. |
| `main == prod` invariant | After deploy, `main` advances with marketing-only commits. Tutor prod then trails `main` by commits that contain no `apps/tutor/` or `packages/core/` file — tutor-inert. Record this in the ROLE 4 handoff so the next tutor deploy is not surprised. |

**Gate (fails closed, run on the merged tree before deploy):**
```
git -C <worktree> diff --name-only origin/main...HEAD | grep -vE '^(apps/marketing/|docs/)'   # must print NOTHING
git -C <worktree> diff --name-only origin/main...HEAD | grep -cE '^apps/marketing/'             # control: must be > 0
```
**Tutor untouched — measured, not assumed (before and after the marketing deploy):** `evelyn-tutor` pm2 `restart_time` and `pm_uptime` identical; `/root/evelyn-tutor/apps/tutor/.next/BUILD_ID` identical; control = `evelyn-marketing` `pm_uptime` **must change** (proves the instrument can see a restart).

Sequence (protocol v3.5): merge `origin/main` → gate (tsc + build + the two greps) → announce → `deploy-marketing.sh` from the worktree → verify → push `main`. Deploy only on Praveen's explicit go.

## 9. Testing

- `tsc` clean; production build of `apps/marketing` green on the merged tree.
- Built sitemap contains `/products/academy` exactly once; product `<loc>` count 24 → 25 (count from built output, don't add deltas).
- Manual pass at 360 / 768 / 1280 px: no horizontal page scroll; brand switch re-themes every tab; each role renders; drill and mini mock complete end-to-end; Study opens the gated live demo and a session starts.
- Post-deploy: page 200; a literal unique to this page found in the served `.next/static/chunks` tree **on the server** (the initial-HTML scan is blind to `ssr:false` lazy chunks), with a bogus-string control = 0; video URL 200/206 once shipped.

## 10. Phases

1. **Page + registry + demo shell** (brand + role switchers) → 2. **Student tabs** → 3. **Parent + Admin views, live-tutor wiring** → 4. gate, deploy on go, verify, push → 5. **Video**: capture → assemble → verify → add asset + flip `ACADEMY_TOUR_VIDEO` → second marketing-only deploy.
Later, separately specced: sandbox tenant at `academy.evelynlearning.com`.

## 11. Open items (none block phase 1–3)

- Music bed: needs a licensed track (or ship v1 without music).
- Which Cartesia teacher voice narrates (default: the Crimsora promo's narrator voice, if Praveen is happy reusing it for the Evelyn brand).
- Whether a live `sitesettings` doc overrides the "24 products" default copy.
