# Voice Tutor — Scribble / Scroll / Dedup Test Prompts

Test prompts you (the student) speak in a session. They're designed so the
**tutor** internally decides to call `tutor_scribble`, `tutor_scroll_whiteboard`,
or — if it slips — a duplicate `show_*`. Use the dev console to confirm the
right tool fired.

## What to watch in the dev console

- `[VoiceTutor] show_*-dedup: <action> matched existing <itemId> by signature`
  — signature dedup caught a re-render attempt (good).
- `[VoiceTutor] dedup-drop: <action> — already emitted this turn`
  — same-turn dedup caught it (also good, slightly weaker signal).
- `[VoiceTutor] scribble-resolved: target="..." → <itemId>/<feature>`
  — clean scribble hit.
- `[VoiceTutor] scribble-reject: target="..." (no_match | ambiguous | whole-item)`
  — model should retry with a candidate from the rejection hint.
- `[VoiceTutor] scrollTo-resolved: target="..." → <itemId>`
  — clean scroll hit.
- `[Realtime] Tool call was rejected by handler: ... duplicate: true`
  — the dedup hint reached the model; expect it to switch to scrollTo.

---

## Setup A — Energy bar chart + Solution

### Seed (one student message to set up the board)

> A 2 kg ball is dropped from 10 m onto a spring with k = 500 N/m. Show the energy bar chart at the moment of release, just before impact, at maximum compression, and when the ball rebounds to height 6 m.

Then:

> How did you calculate the KE as 196 for the first bar? Show me the steps.

Now the board has `showEnergyBars-1` + `showSolution-1`.

### Tests

**A1 — Idempotent dedup**

> Can you show me the chart again?

Pass: `tutor_scroll_whiteboard` to the chart. Fail: `show_energy_bars` redraw
(should be caught by signature dedup if args match).

**A2 — Title-based scroll**

> Can you bring up the energy bar chart?

Pass: `tutor_scroll_whiteboard({ target: "Energy of 2 kg Ball and Spring System" })`
or `target: "the energy bar chart"` resolves via the synthetic whole-item alias.

**A3 — Final answer alias**

> Can you point to where you calculated the final value of KE?

Pass: `tutor_scribble({ target: "final answer" })` or `target: "value of KE"`
lands on the last step's result.

**A4 — Per-segment energy reference**

> Can you mark the kinetic energy in the Release bar?

Pass: `tutor_scribble({ target: "KE at Release" })` or `"Release-KE"` lands
on the bar group.

**A5 — Step-by-number**

> Highlight step 2 for me.

Pass: `tutor_scribble({ target: "step 2" })` lands on step 2.

**A6 — Total-line scroll**

> Where's the conservation line on the chart?

Pass: `tutor_scroll_whiteboard({ target: "total energy" })` then a scribble
on `total-line`.

---

## Setup B — Geometry triangle

### Seed

> Draw a triangle with vertices A(0,0), B(4,0), C(2,3) on a coordinate plane and find its area.

### Tests

**B1 — Vertex resolution**

> Circle vertex C.

Pass: `tutor_scribble({ target: "C" })` or `"vertex C"` lands on point C.

**B2 — Same-shape duplicate**

> Can you draw the triangle again so I can see it?

Pass: signature dedup hits. Tutor switches to `tutor_scroll_whiteboard`.

**B3 — Cross-item disambiguation**

After the seed, also ask:

> Walk through the area calculation step by step.

Then:

> Point to where you used the coordinates A, B, C.

Pass: scribble lands on the substitution step in the solution, NOT on the
triangle vertices.

---

## Setup C — Multiple equations on the same board

### Seed

> Show the formula for kinetic energy.

> Now show the formula for spring potential energy.

> Now show conservation of energy: KE_i + PE_i = KE_f + PE_f.

### Tests

**C1 — Ambiguity rejection**

> Underline the equation.

Pass: rejected with `ambiguous` and three distinguishing labels. Model
retries with a specific one (e.g., `target: "spring potential energy formula"`).

**C2 — Latex literal addressing**

> Highlight one-half m v squared.

Pass: tutor passes the latex string from the original tool_result and it
resolves via the latex label.

**C3 — Math-class addressing**

If one equation is quadratic:

> Box the quadratic.

Pass: math-class label hits.

**C4 — Idempotent equation**

> Show me the conservation of energy equation again.

Pass: signature dedup on the existing `showEquation`.

---

## Setup D — Iframe scroll-only items (Desmos / Ketcher)

### Seed

> Graph y = x squared and y = 2x on the same axes.

> Show me the molecule for ethanol.

### Tests

**D1 — Iframe redirect**

> Circle the intersection points on the graph.

Pass: scribble rejected with iframe redirect; tutor calls
`tutor_scroll_whiteboard({ target: "the graph" })` and explains verbally.
NEVER redraws.

**D2 — Iframe dedup**

> Can you show me the graph one more time?

Pass: dedup OR `tutor_scroll_whiteboard` — never another `show_graph`.

**D3 — Cross-item snapshot awareness**

> Show me the ethanol molecule.

Pass: dedup — `boardSnapshot` already lists `showMolecule-1`.

---

## Setup E — Cross-page reference

### Seed (page 1)

> Solve x squared minus 5x plus 6 equals 0 step by step.

### Seed (page 2 — say something that triggers newPage)

> Now solve x squared minus 7x plus 12 equals 0.

### Tests

**E1 — Cross-page scribble**

While on page 2:

> Remind me — what was the discriminant in the first problem?

Pass: scribble auto-injects a page-1 navigation, then lands on the page-1
discriminant step.

**E2 — Stale-snapshot guard**

> Show me the solution to the first problem again.

Pass: signature dedup OR scrollTo to existing `showSolution-1`.

---

## Setup F — Stress / failure mode

**F1 — Nonexistent target**

> Underline the integral sign.

(when there's no integral on the board)
Pass: `no_match` rejection with the query-aware candidates list. Model
picks a real target and retries.

**F2 — Snapshot read**

After 3+ items are on the board, ask:

> What have you drawn so far?

Pass: tutor recites items from `boardSnapshot` accurately (no hallucinated
items).

**F3 — Generic "the chart" with multiple charts**

Render two different charts (energy bars + a stats histogram). Then:

> Highlight the chart.

Pass: ambiguity rejection with two distinguishing titles. Model retries
with one of them.

---

## Diagnostic protocol when a test fails

1. Copy the tool_call args from the dev console (model's `target` string).
2. Copy the rejection log line (`scribble-reject` / `scrollTo-reject`).
3. Note which test setup + test number.
4. Send the bundle so we can identify whether it's:
   - a missing label (extend the manifest),
   - an ambiguity false-positive (the tutor's target collides with another
     item — tighten labels),
   - a renderer not yet emitting `data-feature` (renderer fan-out work),
   - a model regression (prompt update needed).
