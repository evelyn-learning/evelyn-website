# /solutions/[segment] Marketing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Six segment landing pages (`/solutions/nursing`, `test-prep-academies`, `schools`, `homeschool-charters`, `publishers-agencies`, `corporate-ld`) built from one shared template: segment hero + pain framing, an embedded live voice-tutor demo preconfigured with segment-relevant seed lessons through the existing embed-token machinery, a text-only TIME credibility line, a Crimsora client-story block on academic pages only, and a booking-link CTA.

**Architecture:** One dynamic route `src/app/solutions/[segment]/page.tsx` (server component, `generateStaticParams` + per-page `generateMetadata` with explicit canonical) driven by a static registry `src/data/solutions.ts`. The existing `VoiceTutorLiveDemo` component gains optional props (`lessons`, `source`) with defaults that keep the product page byte-identical in behavior. No new backend: the embed token is the existing client-side base64 config consumed by `/tutor-portal/embed`.

**Tech Stack:** Next.js App Router server components, Tailwind (house `primary` purple tokens + `container-wide`/`btn-primary` utilities), existing `VoiceTutorLiveDemo` + `DEMO_TEACHERS` persona machinery, house guard-script testing (`npx tsx` + node:assert).

**Demo-lesson inventory (the requested exists-vs-needs-authoring output):**

| Segment | Existing, usable today | Needs authoring |
|---|---|---|
| nursing | `evelyn.testprep.nclex.ngn-overview.v1` (NCLEX-NGN format/CJMM), `evelyn.testprep.nclex.strategy.v1` (prioritization frameworks) — exam-strategy only, no clinical content | **2 demo-only plans** (content from owner) — e.g. a clinical-judgment case walkthrough and a pharmacology/dosage-calc lesson |
| test-prep-academies | Rich: `testprep.dsat` (35), `testprep.act` (46), 612 `ap.*`, `gre`/`gmat`/`mcat`. Demo picks: dSAT linear equations (already flagship-curated), an ACT English plan, an AP Calc BC plan | none |
| schools | Excellent K-12 coverage. Demo picks from the existing flagship 7: `evelyn.g3.math.fractions.intro.v1`, `evelyn.hs.alg1.quadratic-graphs-vertex.v1`, `evelyn.g5.science.life.photosynthesis-basics.v1` | none |
| homeschool-charters | Same K-12 pool + 16 `lang.*` world-language plans. Demo picks: g5 photosynthesis, HS thesis statements, one `lang.*` plan | none |
| publishers-agencies | No lesson gap — pitch is catalog breadth (1,713 seeds) + white-label capability; demo reuses two flagship lessons | none |
| corporate-ld | **Zero.** Nearest adjacent: 37 `college.*` (intro-economics, data-structures, intro-ai) — interim demo uses `evelyn.college.intro-economics.*` + one more `college.*` | **2 demo-only plans** (content from owner) — e.g. a compliance-scenario lesson and a manager-skills lesson |

Interim rule: nursing and corporate-ld pages launch with the "existing" column lessons and swap to the authored plans when the owner supplies content (Task 6).

## Global Constraints

- Segment slugs, verbatim: `nursing | test-prep-academies | schools | homeschool-charters | publishers-agencies | corporate-ld`.
- Demo embeds use **neutral branding** (no `branding` override in the embed config) on all six pages.
- TIME credibility is **text only** — reuse the homepage eyebrow copy `TIME 2026: Ranked #9 in America's Top EdTech · #35 in the World`, linking to `/press/time-top-edtech-2026`. No badge, no image.
- Crimsora block appears **only** on academic pages: nursing, test-prep-academies, schools, homeschool-charters. Copy stays inside the cross-promo guardrail (academy repo `docs/superpowers/specs/2026-08-04-crimsora-evelyn-cross-promotion-design.md`): factual client-story framing — only claims verifiably live on crimsora.com at ship time (amendment A5) — links to `/showcase/crimsora` (built by that plan) and `https://crimsora.com`. **No invented metrics or quotes; the "Crimsora testimonials.txt" sample quotes must not be used.**
- CTA = the owner's booking link. `BOOKING_URL` constant in `src/data/solutions.ts`; **actual URL is an open input from the owner** — until supplied, fall back to `/contact?segment=<slug>&demo=true` (verify `ContactForm.tsx` captures the param; if not, one-line hidden-field addition).
- Every page declares its own `alternates.canonical` (root layout deliberately has none — see `src/app/layout.tsx:113-118` and fix commit `0f9069f4`; a dynamic route that skips this inherits nothing but also emits nothing).
- Sitemap: add a `solutionPages` block to `src/app/sitemap.ts` generated from the segments registry (mirroring the `servicePages` pattern) — `/industries/*` precedent is NOT in the sitemap, so this is explicit work.
- Do not touch `Header.tsx` nav or the `/industries/*` pages in v1 (the 4-of-6 overlap is a flagged follow-up decision, not this plan's scope).
- Existing `VoiceTutorLiveDemo` behavior on `/products/voice-tutor` must be unchanged (props all optional, defaults = current constants).
- Verification: `npx tsc --noEmit`, `npm run test:solutions-demo` (new guard), `npm run test:curated-demo` (existing guard still green), `npm run build`.
- Commits: `feat(solutions): ...`.

---

### Task 1: Segments registry + demo-lesson guard

**Files:**
- Create: `src/data/solutions.ts`
- Create: `scripts/test-solutions-demo-lessons.ts`
- Modify: `package.json` (add `"test:solutions-demo"`)

**Interfaces:**
- Consumes: `SEED_PLANS` via `src/lib/tutor/lesson-plan/store.ts` (same import path `scripts/test-curated-demo-lessons.ts` uses).
- Produces:
  - `interface SolutionSegment { slug: string; name: string; heroTitle: string; heroSub: string; pains: Array<{ problem: string; solution: string }>; demoLessons: Array<{ planId: string; title: string; subjectLabel: string; levelLabel: string; hook: string }>; demoSubject: string; demoLevel: string; showCrimsora: boolean; metaTitle: string; metaDescription: string }`
  - `export const SOLUTION_SEGMENTS: SolutionSegment[]` (all six, full copy)
  - `export const BOOKING_URL: string | null` (null until owner supplies; consumers fall back to contact route)
  - `export function getSegment(slug: string): SolutionSegment | undefined`

- [ ] **Step 1: Write the guard script (failing)** — clone the structure of `scripts/test-curated-demo-lessons.ts`: for every segment, every `demoLessons[].planId` must exist in `SEED_PLANS`; slugs unique; exactly six segments; `showCrimsora === false` for publishers-agencies and corporate-ld. House harness, exits non-zero on failure.
- [ ] **Step 2: Run it** — `npx tsx scripts/test-solutions-demo-lessons.ts` → FAIL (module `src/data/solutions.ts` missing).
- [ ] **Step 3: Write the registry with real copy.** Full copy for all six segments — hero + subhead + 3 pains each. Content sketch to write out in full (each pain as `{ problem, solution }`):
  - **nursing** — hero "Every nursing student gets a 1-on-1 NCLEX tutor"; pains: NCLEX-NGN clinical-judgment format anxiety / faculty can't scale 1-on-1 remediation / at-risk students found too late. Demo lessons: the two NCLEX plans (interim). `showCrimsora: true`.
  - **test-prep-academies** — hero "Scale your best tutor to every student"; pains: tutor payroll is the #1 cost / evening-peak scheduling / parents expect score reports. Demo: dSAT linear equations, ACT English, AP Calc BC. `showCrimsora: true`.
  - **schools** — hero "1-on-1 voice tutoring for every student, every subject"; pains: intervention blocks understaffed / homework help gap after 3pm / IEP-scale differentiation. Demo: g3 fractions, HS quadratic graphs, g5 photosynthesis. `showCrimsora: true`.
  - **homeschool-charters** — hero "A patient tutor for every subject you don't teach"; pains: parent can't cover calculus and chemistry / curriculum-neutral supplementation / evidence of learning for charter funds. Demo: g5 photosynthesis, HS thesis statements, one `lang.*`. `showCrimsora: true`.
  - **publishers-agencies** — hero "Put a live voice tutor inside your product"; pains: static content losing to interactive competitors / build-vs-buy on voice AI / white-label + integration lift. Demo: two flagship lessons. `showCrimsora: false`.
  - **corporate-ld** — hero "Training that talks back"; pains: completion-click compliance training / no practice before high-stakes conversations / L&D content that never gets rehearsed. Demo: two `college.*` plans (interim). `showCrimsora: false`.
- [ ] **Step 4: Guard passes** — `npx tsx scripts/test-solutions-demo-lessons.ts` → `failed: 0`; register `"test:solutions-demo"`; `npx tsc --noEmit` (note: `scripts/` is tsconfig-excluded; the registry itself lives in `src/` so it is type-checked).
- [ ] **Step 5: Commit** — `git add src/data/solutions.ts scripts/test-solutions-demo-lessons.ts package.json && git commit -m "feat(solutions): segment registry + demo-lesson guard"`

---

### Task 2: Parameterize VoiceTutorLiveDemo

**Files:**
- Modify: `src/components/demos/VoiceTutorLiveDemo.tsx`

**Interfaces:**
- Consumes: current internal lesson constants and `buildEmbedToken()` (lines 41-62).
- Produces: `export default function VoiceTutorLiveDemo(props: { lessons?: DemoLessonOption[]; source?: string } = {})` where `DemoLessonOption = { planId: string; title: string; subjectLabel: string; levelLabel: string; hook: string }` (exported). Defaults: current lesson list and `metadata.source: 'products-voice-tutor-demo'`. When props are provided: lesson chips render from `props.lessons`, embed config takes `curriculum_module` from the selected option, `subject`/`level` derive from the option labels, `metadata.source = props.source`.

- [ ] **Step 1: Refactor** — lift the hardcoded lesson list to a default parameter; thread `source` into the `metadata` object in `buildEmbedToken`. Keep persona picker, geo pre-select, name field, 10-min cap, `session_ended` listener untouched.
- [ ] **Step 2: Regression check** — `npx tsc --noEmit`; `npm run dev`, open `/products/voice-tutor`, start a demo, confirm identical lesson chips and a working session (config unchanged when no props passed).
- [ ] **Step 3: Commit** — `git commit -am "feat(solutions): parameterize VoiceTutorLiveDemo (lessons/source props, defaults unchanged)"`

---

### Task 3: The shared template route

**Files:**
- Create: `src/app/solutions/[segment]/page.tsx`
- Create: `src/app/solutions/components/CrimsoraClientStory.tsx`

**Interfaces:**
- Consumes: `SOLUTION_SEGMENTS`, `getSegment`, `BOOKING_URL` (Task 1); `VoiceTutorLiveDemo` with props (Task 2); `BreadcrumbJsonLd` from `src/components/seo/JsonLd.tsx`.
- Produces: statically-generated pages for the six slugs; 404 via `notFound()` for anything else. `AppShell` wraps automatically (route isn't in the skip list).

- [ ] **Step 1: Page skeleton**

```tsx
// src/app/solutions/[segment]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import { SOLUTION_SEGMENTS, getSegment, BOOKING_URL } from "@/data/solutions";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import CrimsoraClientStory from "../components/CrimsoraClientStory";

const VoiceTutorLiveDemo = dynamicImport(() => import("@/components/demos/VoiceTutorLiveDemo"));

export function generateStaticParams() {
  return SOLUTION_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ segment: string }> }
): Promise<Metadata> {
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function SolutionSegmentPage(
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) notFound();
  const cta = BOOKING_URL ?? `/contact?segment=${s.slug}&demo=true`;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Solutions", url: "/solutions" }, { name: s.name, url: `/solutions/${s.slug}` }]} />
      {/* Hero: gradient per industries pattern, primary tokens not raw purple-600 */}
      {/* TIME eyebrow: text pill linking to /press/time-top-edtech-2026 */}
      {/* Pain framing: two-column problem/solution cards from s.pains */}
      {/* <section id="demo"><VoiceTutorLiveDemo lessons={s.demoLessons} source={`solutions-${s.slug}`} /></section> */}
      {/* {s.showCrimsora && <CrimsoraClientStory />} */}
      {/* CTA band: <a href={cta}>Book a call</a> (external target=_blank when BOOKING_URL set) */}
    </>
  );
}
```

(The commented sections are written out in full in this task — hero/pains/TIME/CTA are plain Tailwind sections in the `/industries/test-prep` idiom, standardized on `primary` tokens and `container-wide`/`btn-primary`. Check the `params`-as-Promise signature against a neighboring dynamic route and match the house Next version.)

- [ ] **Step 2: Crimsora block** — `CrimsoraClientStory.tsx`. Factual-only means only what's verifiably live on crimsora.com at ship time. Approved copy (amendment A5, verbatim): "Crimsora runs its consumer AP, SAT, ACT and High School tutoring product on Evelyn Learning's Voice Tutor — live voice + whiteboard sessions." Links: `/showcase/crimsora` ("Read the client story") and `https://crimsora.com` ("See it live"). If `/showcase/crimsora` hasn't shipped yet (cross-promo plan), point the primary link at `https://crimsora.com` and leave a one-line TODO referencing that plan — do not block this task on it.
- [ ] **Step 3: Verify** — `npx tsc --noEmit`; dev-run all six URLs; bogus slug 404s; demo starts on at least two segments (one with interim lessons, e.g. corporate-ld); view-source shows per-page canonical.
- [ ] **Step 4: Commit** — `git add src/app/solutions && git commit -m "feat(solutions): six segment landing pages from shared template"`

---

### Task 4: Solutions hub + sitemap

**Files:**
- Create: `src/app/solutions/page.tsx` (thin index: six cards linking to the segment pages — needed as the breadcrumb/`/solutions` target; mirrors `src/app/industries/page.tsx` at smaller scale)
- Modify: `src/app/sitemap.ts` (add `solutionPages` generated from `SOLUTION_SEGMENTS`, plus `/solutions`)

**Interfaces:**
- Consumes: `SOLUTION_SEGMENTS`.
- Produces: `/solutions` hub with `metadata` incl. canonical; sitemap entries `changeFrequency: "monthly", priority: 0.8`.

- [ ] **Step 1: Hub page** — metadata + six-card grid (name, one-liner from `heroSub`, link).
- [ ] **Step 2: Sitemap block** — after `productPages`, `const solutionPages = [base + "/solutions", ...SOLUTION_SEGMENTS.map(s => base + "/solutions/" + s.slug)]` mapped into the entry shape used by `servicePages`; spread into the returned array.
- [ ] **Step 3: Verify + commit** — dev `GET /sitemap.xml` contains the seven URLs. `git add src/app/solutions/page.tsx src/app/sitemap.ts && git commit -m "feat(solutions): hub page + sitemap entries"`

---

### Task 5: Contact-form segment capture (CTA fallback path)

**Files:**
- Modify: `src/components/ContactForm.tsx` (only if inspection shows the query param isn't captured)

**Interfaces:**
- Consumes: `useSearchParams` (or the form's existing param handling — inspect first; `/contact?industry=...` links exist today but may be display-only).
- Produces: `segment` query param lands in the `ContactSubmission` payload (existing free-text/metadata field — do not change the model).

- [ ] **Step 1: Inspect** `ContactForm.tsx` + `src/models/ContactSubmission.ts` for existing param capture. If `industry`/`product` params are already captured, extend the same mechanism to `segment`; if nothing is captured, add a hidden field appending `[segment: X]` to the message body — smallest change, no schema touch.
- [ ] **Step 2: Verify + commit** — submit from `/contact?segment=schools&demo=true` in dev; see the segment in the admin contacts view. `git commit -am "feat(solutions): capture segment param on contact form"`

---

### Task 6: Demo-only seed plans for nursing + corporate-ld (gated on owner content)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/nclex-clinical-judgment-case.ts`, `seeds/nclex-dosage-calculations.ts`
- Create: `src/lib/tutor/lesson-plan/seeds/corpld-compliance-scenario.ts`, `seeds/corpld-difficult-conversations.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts` (register in `SEED_PLANS`), `src/data/solutions.ts` (swap interim lessons)

**Interfaces:**
- Consumes: owner-supplied lesson content (**blocking input** — the plan defines ids/structure only); seed-plan type from `src/lib/tutor/lesson-plan/types.ts`; existing NCLEX seeds as the structural template for the nursing pair, `college.*` seeds for the corporate pair.
- Produces: plan ids `evelyn.testprep.nclex.clinical-judgment-case.v1`, `evelyn.testprep.nclex.dosage-calculations.v1` (resolve under the existing test-prep/NCLEX taxonomy cell — satisfies the non-orphan guard), `evelyn.college.corpld.compliance-scenario.v1`, `evelyn.college.corpld.difficult-conversations.v1` (college taxonomy home; if the topic cell doesn't resolve, register the nearest college cell rather than adding taxonomy — flag if impossible).

- [ ] **Step 1: Scaffold the four seed files** from the owner's content, copying the structure of `seeds/nclex-strategy.ts` / a `college.*` seed.
- [ ] **Step 2: Register + swap** — add to `SEED_PLANS`; replace the interim `demoLessons` entries for nursing and corporate-ld in `src/data/solutions.ts`.
- [ ] **Step 3: Verify + commit** — `npm run test:solutions-demo` and `npm run test:curated-demo` both `failed: 0`; live demo session on each new plan in dev. `git commit -m "feat(solutions): demo seed plans for nursing + corporate L&D"`

---

### Task 7: Final pass

- [ ] **Step 1:** `npx tsc --noEmit` · `npm run test:solutions-demo` · `npm run test:curated-demo` · `npm run build` — all clean.
- [ ] **Step 2:** Manual sweep of all six pages + hub: canonical per page, TIME line links, Crimsora block on exactly the four academic pages, CTA hrefs, demo session start/end on each page (mic permission → talk → session_ended returns to cover).
- [ ] **Step 3:** Commit residue: `git add -A && git commit -m "feat(solutions): final polish"`

---

## Self-Review Notes

- **Spec coverage:** shared template → Task 3; segment hero + pain framing → Tasks 1+3; embedded live demo w/ segment lessons + neutral branding → Tasks 1-3; TIME text line → Task 3; Crimsora block academic-only → Tasks 1 (flag) + 3; booking CTA → Tasks 1+3+5; demo-lesson inventory → header table; 2×2 new demo plans → Task 6.
- **Open inputs from owner:** (1) the actual booking URL; (2) lesson content for the four Task-6 seed plans. Both have working fallbacks (contact route; interim lessons), so Tasks 1-5 ship without them.
- **Deliberate exclusions (v1):** Header nav / "Who We Serve" integration and the `/industries` overlap (4 of 6 segments collide — needs a supersede/redirect product call); white-label `branding` showcase on the publishers page (spec says neutral branding everywhere); embed-token hardening (client-side base64 with a standing TODO at `embed/page.tsx:190-203` — flagged as risk since these pages multiply exposure).
- **Cross-plan dependencies:** `/d/[token]` links from the outreach-console plan land on these pages (`segment-landing.ts` map); the Crimsora block links to `/showcase/crimsora` from the cross-promo plan, with a non-blocking fallback.
