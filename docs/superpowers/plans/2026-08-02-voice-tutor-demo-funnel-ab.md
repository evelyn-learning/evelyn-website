# Voice Tutor Demo Funnel A+B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed the real voice tutor on `/products/voice-tutor` behind a click-to-start cover (Option A) and turn `/tutor` into a curated demo lobby with site chrome (Option B), plus the P0 canonical fix and GA4 demo instrumentation.

**Architecture:** The embed reuses the existing `/tutor-portal/embed?token=` surface — the token is base64 JSON (`parseToken` in embed/page.tsx uses `atob`), so the marketing page mints its config client-side; no new API route. A shared curated-lessons module feeds both the product-page chips and the /tutor lobby tiles; tile clicks route through the existing `handleSearchSelect(PlanIndexEntry)` path via `usePlanIndex` lookup. Canonical fix = move `alternates.canonical` out of the root layout (where it's inherited as `/` by every page) onto the pages that own it.

**Tech Stack:** Next.js app router, Tailwind, existing `usePlanIndex` / `DEMO_TEACHERS` / `accentFromTimezone` / `teachersForAccent` utilities, gtag.js (GA4), tsx test scripts, Playwright for responsive screenshots.

## Global Constraints

- SEO freeze on `/products/voice-tutor`: URL, h1, headings, body copy, FAQ text, SoftwareApplication/FAQPage/Breadcrumb JSON-LD unchanged. `#demo` section id stays.
- `/tutor` stays at its URL, no redirect; session stage stays chromeless (header only on setup stage).
- Demo embed: `max_duration_minutes: 10`, `wrap_at_minutes: 8`, click-to-start only (no engine cost until user gesture).
- Marketing-stats sync rule: breadth numbers ("1,710 lessons") must come from the live plan index (`usePlanIndex().count`), never hardcoded.
- All new user-facing surfaces responsive at 390px and 1440px; verified with Playwright screenshots before deploy.
- `npm run lint` is broken repo-wide (Next removed `next lint`; no eslint config) — gate on `npx tsc --noEmit` + prod build + test scripts.

---

### Task 1: Curated demo lessons module + existence test

**Files:**
- Create: `src/lib/tutor/demo/curated-demo-lessons.ts`
- Create: `scripts/test-curated-demo-lessons.ts`
- Modify: `package.json` (add `"test:curated-demo": "tsx scripts/test-curated-demo-lessons.ts"`)

**Interfaces:**
- Produces: `CURATED_DEMO_LESSONS: CuratedDemoLesson[]` where `CuratedDemoLesson = { planId: string; title: string; subjectLabel: string; levelLabel: string; hook: string; tone: 'indigo'|'emerald'|'amber'|'rose' }`

- [ ] **Step 1: Write the module** with these 7 verified seed plan ids (verified against seeds 2026-08-02):

```ts
export interface CuratedDemoLesson {
  planId: string;
  title: string;        // display title (may differ from plan title for scanability)
  subjectLabel: string; // "Math · Grade 3"
  levelLabel: string;
  hook: string;         // one-line why-this-lesson
  tone: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export const CURATED_DEMO_LESSONS: CuratedDemoLesson[] = [
  { planId: 'evelyn.g3.math.fractions.intro.v1', title: 'Fractions', subjectLabel: 'Math', levelLabel: 'Grade 3', hook: 'Equal parts of a whole, visually', tone: 'indigo' },
  { planId: 'evelyn.g5.science.life.photosynthesis-basics.v1', title: 'Photosynthesis', subjectLabel: 'Science', levelLabel: 'Grade 5', hook: 'How plants make their own food', tone: 'emerald' },
  { planId: 'evelyn.hs.science.physics.newtons-second-law.v1', title: "Newton's Second Law", subjectLabel: 'Physics', levelLabel: 'High school', hook: 'F = ma on the live whiteboard', tone: 'rose' },
  { planId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1', title: 'Quadratic Graphs', subjectLabel: 'Algebra 1', levelLabel: 'High school', hook: 'Parabolas & vertex form', tone: 'indigo' },
  { planId: 'evelyn.testprep.dsat.linear-equations-one-var.v1', title: 'SAT Linear Equations', subjectLabel: 'Test prep', levelLabel: 'Digital SAT', hook: 'Real SAT-style items', tone: 'emerald' },
  { planId: 'evelyn.hs.engl.thesis-statements.v1', title: 'Thesis Statements', subjectLabel: 'English', levelLabel: 'High school', hook: 'From claim to defensible thesis', tone: 'amber' },
  { planId: 'evelyn.hs.whist.industrial-revolution.v1', title: 'The Industrial Revolution', subjectLabel: 'World History', levelLabel: 'High school', hook: 'Machines, cities, and change', tone: 'rose' },
];
```

- [ ] **Step 2: Write the failing-loud test** — every `planId` must exist in `SEED_PLANS` and resolve to a non-orphan taxonomy cell (so tile clicks can drive the cascade):

```ts
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import { CURATED_DEMO_LESSONS } from '../src/lib/tutor/demo/curated-demo-lessons';
// resolve cell exactly like plan-index-cache buildIndex does (import resolveCell from resolve-cell.ts)
```
Assert: id found; resolved cell non-null on all three fields; duplicate planIds rejected. Exit 1 with the offending id on failure.

- [ ] **Step 3: Run** `npm run test:curated-demo` → PASS (7 checked). Commit.

### Task 2: GA4 event helper

**Files:**
- Create: `src/lib/analytics/events.ts`

**Interfaces:**
- Produces: `trackEvent(name: DemoEventName, params?: Record<string, string | number | boolean>): void` with `DemoEventName = 'demo_start_click' | 'tutor_session_started' | 'lesson_selected' | 'teacher_changed' | 'demo_expand_fullscreen'`

- [ ] **Step 1: Implement** — safe no-op when gtag absent (GoogleAnalytics inline script defines global `gtag`):

```ts
type DemoEventName =
  | 'demo_start_click' | 'tutor_session_started' | 'lesson_selected'
  | 'teacher_changed' | 'demo_expand_fullscreen';

export function trackEvent(name: DemoEventName, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try { w.gtag?.('event', name, params ?? {}); } catch { /* analytics must never break the app */ }
}
```

- [ ] **Step 2: tsc clean. Commit** (with Task 3, small).

### Task 3: Canonical fix (P0)

**Files:**
- Modify: `src/app/layout.tsx:116-118` — REMOVE the `alternates: { canonical: "/" }` block from root metadata.
- Modify: `src/app/page.tsx` — homepage is a server component with no metadata export; add `export const metadata = { alternates: { canonical: "/" } };` at top level.
- Modify: `src/app/products/voice-tutor/layout.tsx` — add `alternates: { canonical: "/products/voice-tutor" }` to its metadata export.

**Rationale locked in proposal:** inherited root canonical stamps `href="https://www.evelynlearning.com"` on every page without its own alternates (live-verified). Removing it means such pages emit NO canonical (correct default); pages that matter declare their own.

- [ ] **Step 1: Apply the three edits.**
- [ ] **Step 2: Verify locally** — `npm run build` then `grep canonical` in `.next` output for `/products/voice-tutor` HTML, or `curl localhost:3006` on dev: product page → self-canonical; `/about` → no canonical; `/` → `/`. Commit.

### Task 4: /tutor metadata layout (self-canonical + real title/description)

**Files:**
- Create: `src/app/tutor/layout.tsx` (server component — page.tsx is `'use client'` and cannot export metadata)

- [ ] **Step 1: Implement:**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Try the AI Voice Tutor Live',
  description:
    'Start a live voice tutoring session — pick a lesson, talk to the AI tutor, and watch the whiteboard. 1,700+ lessons across math, science, English, history, test prep, and more.',
  alternates: { canonical: '/tutor' },
};

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: tsc + verify the title renders on /tutor. Commit** (with Task 3).

### Task 5: `VoiceTutorLiveDemo` — the product-page live embed (Option A)

**Files:**
- Create: `src/components/demos/VoiceTutorLiveDemo.tsx`
- Modify: `src/app/products/voice-tutor/page.tsx:9-12` (dynamic import) and `:75-140` DemoSection (swap `<VoiceTutorPreview />` → `<VoiceTutorLiveDemo />`, update the two-line subcopy under "Try the AI Voice Tutor")
- Delete: `src/components/demos/VoiceTutorPreview.tsx`

**Interfaces:**
- Consumes: `CURATED_DEMO_LESSONS`, `trackEvent`, `DEMO_TEACHERS`, `resolveInitialTeacherId` (teacher-persona.ts), `accentFromTimezone` (geo-accent.ts), `teachersForAccent` (cartesia-voice-registry.ts), `EmbedConfig` token contract (base64 JSON per `parseToken`).
- Produces: default-exported client component, no props.

- [ ] **Step 1: Implement the component.** States: `cover` (default) → `running` (iframe). Key parts:

```tsx
'use client';
// Teacher default: same localStorage key as /tutor ('evelyn:tutor:selectedTeacher')
// + same geo pre-select (accentFromTimezone → teachersForAccent → 50/50 pick,
// persisted). Selected lesson: useState(CURATED_DEMO_LESSONS[0]).

function buildEmbedToken(lesson: CuratedDemoLesson, teacher: TeacherPersonaWire): string {
  const cfg = {
    partner_id: 'evelyn-marketing',
    student_id: `demo-${Math.random().toString(36).slice(2, 10)}`,
    subject: lesson.subjectLabel.toLowerCase(),
    level: lesson.levelLabel,
    curriculum_module: lesson.planId,
    max_duration_minutes: 10,
    wrap_at_minutes: 8,
    input_mode: 'voice',
    target_kind: 'lessonNode',
    teacher,
    features: { voice_mode: true, text_mode: true, homework_upload: false },
    metadata: { source: 'products-voice-tutor-demo' },
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
}
// iframe: src={`/tutor-portal/embed?token=${encodeURIComponent(token)}`}
//         allow="microphone" className="w-full h-[560px] sm:h-[620px] rounded-2xl border ..."
```

Cover layout (responsive): chips row (`flex flex-wrap gap-2 justify-center`, selected chip highlighted, each chip = lesson title + subject dot colored by tone); card split `grid md:grid-cols-[1.2fr_1fr]` — left: mic circle + "Start live demo — {lesson.title}" + "Uses your microphone · voice + whiteboard · 10-minute demo" + Start button; right: teacher row (initial-avatar, name, accent hint or "picked for your region", "Change ▾" toggling a compact list of all 18 `DEMO_TEACHERS` with radio semantics) + "18 tutors · 9 accents" line + "Open full-screen tutor ↗" link to `/tutor`. On `< md` the grid stacks.
Events: chip click → `lesson_selected {plan_id, surface:'product_embed'}`; teacher pick → `teacher_changed {teacher_id, surface:'product_embed'}`; Start → `demo_start_click {plan_id}` then set running; full-screen link → `demo_expand_fullscreen`.

- [ ] **Step 2: Swap DemoSection.** Replace the dynamic import target (`VoiceTutorPreview` → `VoiceTutorLiveDemo`, keep `ssr:false` + skeleton). Subcopy: "Pick a lesson and start talking — this is the real tutor, not a video. No signup, ~2 minutes." Feature cards, heading, `id="demo"` unchanged.
- [ ] **Step 3: Delete `VoiceTutorPreview.tsx`;** grep repo for other imports (none expected).
- [ ] **Step 4: tsc + dev-server manual check (desktop+mobile viewport) + commit.**

### Task 6: Product-page meta description refresh (original task 3)

**Files:**
- Modify: `src/app/products/voice-tutor/layout.tsx:12` description (and matching og description L14-18)

- [ ] **Step 1:** Keep the keyword-bearing opening ("An AI voice tutor is…" sentence structure); update the trailing capability clause to current reality (voice conversation, live whiteboard with equation rendering, transcript drawer, homework upload, 18 tutor personas, try-it-live on the page). Title unchanged.
- [ ] **Step 2: Commit** (with Task 5).

### Task 7: /tutor curated lobby (Option B)

**Files:**
- Modify: `src/app/tutor/page.tsx` setup-stage block (`:2082-2174`) + imports + `usePlanIndex` wiring + event calls in `handleSearchSelect` / teacher setter / `handleStartSession`
- Modify: `src/app/tutor/components/PlanSearchBar.tsx:30-39,152-172` — remove the `POPULAR_SUGGESTIONS` chips row (tiles supersede it); keep placeholder + ⌘K + results list

**Interfaces:**
- Consumes: `CURATED_DEMO_LESSONS`, `usePlanIndex()` (`{ entries, count }` — look up `PlanIndexEntry` by `planId`), existing `handleSearchSelect(entry)`, `orderedTeachers`, `selectedTeacherId`, `geoPairIds`, `Header` from `@/components/layout/Header`.

- [ ] **Step 1: Setup-stage chrome.** Render `<Header />` above the setup container (setup stage only — session/summary stages untouched). Back link: `href="/products/voice-tutor"`, label "AI Voice Tutor". Container `max-w-2xl` → `max-w-5xl`; LessonPicker + teacher panel constrained to `max-w-3xl mx-auto` so forms don't stretch.
- [ ] **Step 2: Curated tiles grid** between the h1 block and LessonPicker:

```tsx
// const planIndex = usePlanIndex(); — page-level (module cache + sessionStorage make this cheap)
// const curatedEntries = CURATED_DEMO_LESSONS.map(c => ({ c, entry: planIndex.entries?.find(e => e.id === c.planId) }))
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {/* tile per curated lesson: subjectLabel eyebrow (tone color), title, hook, selected ring
      when selectedLessonPlanId === planId; onClick → entry && (handleSearchSelect(entry),
      trackEvent('lesson_selected', {plan_id, surface:'tutor_lobby'})) */}
  {/* 8th tile: "Browse everything →" scrolls to / expands LessonPicker's browse panel */}
</div>
```
Breadth stat line beside the h1: `{planIndex.count ?? '1,700+'} lessons · 8 subjects · 13 levels` (count from index, fallback string while loading). Tiles render disabled-skeleton until index loads.

- [ ] **Step 3: Teacher panel → compact row.** Replace the always-open 18-card grid: one row showing selected teacher (initial avatar, name, `ACCENT_CARD_HINTS[id]` or "picked for your region" when `geoPairIds.includes(id)`), "Change tutor ▾" button toggling `teacherPickerOpen`; when open render the existing radiogroup grid unchanged (all markup/behavior preserved, incl. `ORIGINAL_TEACHER_IDS` hint logic). Wrap teacher pick with `trackEvent('teacher_changed', {teacher_id, surface:'tutor_lobby'})`.
- [ ] **Step 4: Events.** `handleStartSession` (both entry points if two) → `trackEvent('tutor_session_started', {plan_id: selectedLessonPlanId || 'freestyle', teacher_id: selectedTeacherId, surface:'tutor_lobby'})`. `handleSearchSelect` already covered via tile path; add same call inside `handleSearchSelect` with `surface:'search'` (skip when invoked from tile to avoid double-fire — tile calls a wrapper that passes surface).
- [ ] **Step 5: PlanSearchBar chip removal** — delete `POPULAR_SUGGESTIONS` const + its render block; keep helper copy "Or use the structured picker below…".
- [ ] **Step 6: tsc + commit.**

### Task 8: Responsive verification (user-requested) + full gate

- [ ] **Step 1:** `npm run dev` (port 3006) in background; wait for ready.
- [ ] **Step 2:** Playwright screenshot script (scratchpad, throwaway): viewports 1440×900 and 390×844 → `/products/voice-tutor` (top + `#demo`) and `/tutor`. Review images myself; fix any overflow/stack/tap-target issues found; re-shoot until clean.
- [ ] **Step 3:** Click-through smoke on desktop viewport: chip select → Start → iframe boots embed cover (engine call OK locally? if local engine env incomplete, verify iframe URL + token decode shape instead); /tutor tile → pickers snap + Start enabled.
- [ ] **Step 4:** Full gate: `npx tsc --noEmit`, `npm run build` (pipefail), `npm run test:curated-demo`, spot-run `test:cover-layer` (nearest suite touching VTR surface) — all green.
- [ ] **Step 5: Commit any fixes.**

### Task 9: Deploy + live verify

- [ ] **Step 1:** `npx tsx scripts/inspect-tutor-session.ts --since 2h` with prod `MONGODB_URI` → require zero sessions.
- [ ] **Step 2:** `./deploy-update.sh` (ONLY this script). Push main.
- [ ] **Step 3:** Live checks: product page → self-canonical, `#demo` renders cover with chips (curl for component markers), `/tutor` → new title + canonical + header present; `/about` → no canonical; homepage → `/` canonical. GA4: `gtag` present on both pages.
- [ ] **Step 4:** Update memory (evelyn-demo-funnel-redesign.md → SHIPPED state + live-verify list for user: real mic session on prod embed, GA4 DebugView events, 10-min cap observed).

## Self-Review

- Spec coverage: A (Task 5-6), B (Task 7), canonical P0 (Task 3-4), events (Task 2 + wired in 5/7), curated+breadth+teacher consolidation (1, 5, 7), responsive testing (8), SEO freeze (constraints + 3/6 scoped edits), deploy (9). Original user tasks: 1→A, 2→B+answers, 3→Task 5 delete + Task 6 description.
- No placeholders: code given for new modules; page edits reference exact line ranges + existing symbols verified in-session.
- Type consistency: `CuratedDemoLesson.planId` used by both surfaces; `PlanIndexEntry` lookup by `id`; `TeacherPersonaWire` is `DEMO_TEACHERS`' element type (verified L73).
