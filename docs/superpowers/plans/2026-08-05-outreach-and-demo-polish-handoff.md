# Handoff — outreach self-serve + demo-session polish (next session)

**Written:** 2026-08-05, at the end of a long session. Everything below is
either verified live or explicitly marked as unverified.

---

## Current state (verified live on prod)

- **Outreach console** at `/admin/outreach` — live, Gmail connected as
  `praveen@evelynlearning.com`, reply watcher active on `*/15 * * * *`.
- **20 nursing leads imported** to prod, all `status: staged`, each with a
  pre-written intro email in `currentDraft`. 15 have an email address
  confirmed published on the institution's own page; 1 (The College of New
  Jersey) is flagged `emailVerified: false` with a note because it could not
  be independently confirmed; 4 have a real named decision-maker but no email.
  Source JSON: `scratchpad/leads-nursing-batch1.json` (session scratchpad —
  copy somewhere durable if it still matters).
- **Six `/solutions/[segment]` pages** live, CTAs pointing at the owner's
  Google Calendar booking link.
- **Four demo lessons** live in the catalog: NCLEX heart failure, NCLEX
  insulin management, corporate P&L, corporate generative-AI.
- Deploy: use **`./deploy-to-production.sh`** (fast path, ~7 min on a good
  connection). See "Deploy gotchas" at the bottom.

---

## A. The strategic ask — self-serve lead generation

> "How do we add more leads to the queue for different programs? We can't keep
> doing this using Claude Code every time."

**This is the real product gap and should be the session's main design work.**
Today, lead research happens by an agent doing web research and emitting JSON,
which `scripts/import-leads.ts` ingests. That was the frozen V1 design
(spec item 6: "ingest JSON arrays matching the Lead schema (Claude research
output)") — but it means every new batch requires a developer session.

**Do brainstorming/design before building.** The options, roughly in
increasing cost:

1. **A saved research prompt + import, run by the owner.** Cheapest. A
   documented prompt template the owner pastes into any Claude session,
   producing schema-valid JSON they import themselves. No code. Doesn't scale
   past occasional batches and still needs a terminal for the import.
2. **An import UI in the console.** Paste-JSON or file-upload box in a fourth
   tab, hitting a new gated API route that reuses the importer's validation
   and dedupe. Removes the terminal step. Still needs a Claude session for
   research.
3. **In-console research trigger.** A "Find leads" action taking segment +
   region + count, which runs the research server-side (Claude API + web
   search) and writes staged leads directly. This is the actual ask, and the
   biggest build: needs an API-key-backed research path, a job/queue since it
   takes minutes, a cost ceiling, and dedupe against existing leads.
4. **Reuse the legacy `prospect-discovery` skill.** Exists at
   `.claude/skills/prospect-discovery/`, but it feeds the **legacy `Prospect`
   model** (`businessName`/`websiteUrl`/`contactEmail`), not `Lead`. It would
   need a mapping layer and doesn't produce `whyFit`/`useCaseHypothesis`/
   per-lead drafts, which are what make these emails land.

**Recommendation to discuss:** option 2 first (small, removes the terminal
dependency, useful regardless), then option 3 as its own project. Option 3's
hard parts are cost control and quality — the 20 leads that landed were good
because each email cited something real and specific from the institution's
own site, and a naive automated version will regress to generic mail-merge.

**Quality bar to preserve, whatever gets built:** never fabricate a person,
email, or LinkedIn URL. `emailVerified: true` must mean "found published on
an official page". An empty field is correct; a plausible guess is a failure
that emails a real stranger. One research agent this session tried to
construct a guessed address via hex/XOR obfuscation — it was caught and that
lead discarded, but it shows the failure mode is live.

---

## B. Nursing demo session — `embed-1785972176560`

### B1. Insulin action graph is wrong (screenshot: Desmos plot)
The lesson asked for insulin action over time; the board rendered a Desmos
plot with two asymptotic curves over roughly x ∈ [-5, 5], including negative
time, with a stray "Lunch was due here" point. It does not resemble an
onset/peak/duration curve and would embarrass us in front of a nursing dean.

Root cause is likely the lesson hint, not the renderer:
`src/lib/tutor/lesson-plan/seeds/nclex-insulin-management.ts` sets
`suggestedTools: ['show_function_graph']` on three segments, but an insulin
action profile is not a closed-form function — asking a model to plot it in
Desmos invites nonsense.

Two candidate fixes, decide during the session:
- Change those hints to a shape the catalog draws well (a labelled timeline /
  `show_diagram` kind, or `show_table` for onset/peak/duration).
- Or pin the figure deterministically with **`prescribedRender`** — it exists
  on `SegmentBase` (`src/lib/tutor/lesson-plan/types.ts:70-78, :95`), the
  orchestrator deep-equals emitted params and substitutes on mismatch
  (`src/app/tutor/components/VoiceTutorRealtime.tsx:~9791-9895`), and no
  content seed uses it yet. This is exactly the "must draw one exact figure"
  case it was built for.

### B2. Number-line labels clipped (screenshot: "ected + lunch due")
Labels near the left edge overflow and get cut ("Injected + lunch due" →
"ected + lunch due"). Tool is `show_number_line`
(`src/app/tutor/hooks/toolDefinitions.ts:227`). Note the file already warns at
`:1326` that improvised number-line plots "clip their labels" — so
label-clipping is a known failure class for this renderer, probably a
viewBox/padding issue when a label sits at or before the first tick.

### B3. Replace the NCLEX-NGN overview as a demo tile
> "it's just an informational lesson about the exam, better to have a lesson
> that explains the topic, is great visually, something potential leads will
> appreciate."

Agreed and consistent with why we added clinical lessons in the first place.
The tile is in `src/data/solutions.ts:89`
(`evelyn.testprep.nclex.ngn-overview.v1`) on the nursing segment. Options:
promote heart failure + insulin (already there at :96 and :103) and simply
drop the overview, or author a third clinical lesson to replace it. Prior
research flagged **fluid & electrolytes (e.g. hyperkalemia and the heart)** as
the strongest untapped pick — it threads through every nursing course and
draws well (body-diagram + normal-range/symptom table). Acid-base/ABG was
explicitly rejected as oversaturated and mnemonic-flavoured.
Guard to keep green: `npm run test:solutions-demo`.

### B4. Tool cluster collapses when the mute button is clicked
Should stay expanded. There's precedent for exactly this bug class — memory
records R40b, "re-open tools cluster on session start — the Start tap's own
outside-tap dismiss collapsed it". Almost certainly the same outside-tap
dismiss handler treating the mute button as an outside click. `toggleMute` is
at `src/app/tutor/components/VoiceTutor.tsx:352` (rendered at `:574`); the
cluster state didn't match a `toolsOpen`-style grep, so find it via the
dismiss handler rather than the name.

---

## C. Corporate demo session — `embed-1785973014012`

### C1. Diagram redrawn after the student said "fresh"
The France prompt→???→answer flowchart was drawn a second time after the user
asked for a fresh board. Expected: clear/advance, not re-emit the same figure.
Note `new_page` is deprecated for layout (`toolDefinitions.ts:164-165`) and the
runtime lays out pages automatically — so this is likely the auto-layout
re-rendering a prior figure, or the model re-emitting it. Worth checking
whether "fresh" is even a recognized instruction, or whether it fell through
to a generic re-render.

### C2. Board scrolled to an older region while narrating the current one
While the tutor spoke the "tokens become numbers" line, the board scrolled up
to the earlier France flowchart instead of staying on the "Tokenizing a
sentence" figure being described. Scroll/anchor logic candidates:
`src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx`,
`src/app/tutor/components/VoiceTutorRealtime.tsx`. Memory records a related
prior fix ("scroll-before-reference rule", R40) — check whether this is a
regression of it or a distinct anchor-selection bug.

### C3. Flowchart had a long empty branch
From "Turn tokens into numbers" a connector ran far right/down with nothing
between it and "Add it, repeat" — a large blank gap mid-figure (the student
had to scroll past emptiness). Layout/edge-routing issue in the flowchart
renderer.

---

## Suggested sequencing

1. **Brainstorm A (self-serve lead gen)** first, while context is fresh — it's
   the only item that needs a product decision rather than a fix. Use the
   brainstorming skill; don't jump to building option 3.
2. **B3** (swap the demo tile) — pure content/registry, no engine risk, and it
   directly improves what the 20 leads will see.
3. **B1 + B2** (insulin graph + number-line clipping) — both hurt the nursing
   demo specifically, which is the segment with live leads in the queue.
4. **B4, C1, C2, C3** (engine/UI) — group these; they're all tutor-runtime and
   likely share investigation surface. C2 and C3 may be one bug.

Items 2–4 are a good fit for the round-based workflow this repo already uses
(`docs/superpowers/plans/`, per-round branch, live-verify list).

---

## Deploy gotchas (learned the hard way this session)

- **`./deploy-to-production.sh`** = fast path. Builds locally (~4 min), zips
  ~306 MB, uploads, swaps, pm2 restart. Total ~7 min on a good connection —
  but the upload dominates: on a slow link it took 50+ minutes and had to be
  killed. Probe the link first if unsure.
- **The fast path ships a build with ~100 prerendered routes instead of ~505**,
  because production `MONGODB_URI` is loopback-only on the server and a local
  build can't reach it. Blog/speaker pages fall back to on-demand render with
  60s ISR (they don't 404 — `dynamicParams` defaults true), but they lose
  their prebuilt output. Use `./deploy-update.sh` (server-side build, ~30 min)
  when a deploy touches blog or speaker content.
- **Never run two deploys concurrently.**
- To reach the prod DB from a laptop: `ssh -f -N -L 2710:127.0.0.1:2710
  root@84.247.185.169`. Tunnel on the **matching port** — Mongo is a replica
  set (`rs0`) and advertises `127.0.0.1:2710`, so a different local port fails
  topology discovery. Close the tunnel when done.

---

## Still open from earlier (not regressions, just unfinished)

- Highest-value missing test: a unit test for `runReplyCheck()` with
  `getThreadMessages` stubbed. The "never parse the wider inbox" constraint and
  the watcher's state machine are currently guarded only by
  `scripts/test-outreach-guards.ts` (a grep) and code review.
- Each `currentDraft` contains a literal `[DEMO_LINK]` line — the tracked
  per-lead token is minted at approve time, so the operator pastes it from the
  Today tab before sending. Worth automating if outreach scales.
- `/d/[token]` is an unauthenticated DB write with no rate limit (bounded at 50
  visits/lead, UA truncated). An nginx limit is cheap insurance.
- `/solutions/*` overlaps `/industries/*` on 4 of 6 segments; neither the
  supersede/redirect decision nor header-nav placement has been made.
- The embed token is still unauthenticated client-side base64 with a standing
  TODO in `src/app/tutor-portal/embed/page.tsx`.
- Owner copy call: corporate-L&D hero still says "rehearse it out loud", which
  points at roleplay the product doesn't do.
- Lesson content review by the owner — particularly the clinical numbers in
  the insulin lesson (onset/peak/duration ranges, DKA vs HHS thresholds,
  hold parameters), which the drafting agent flagged as approximate.
