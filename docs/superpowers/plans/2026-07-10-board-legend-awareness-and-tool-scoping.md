# Backlog — board legend awareness + subject tool scoping

Opened 2026-07-10 from the photosynthesis/KE-PE investigation (session-1783680636885).
Immediate scope fix already shipped: `show_energy_bars` description now says MECHANICS ONLY (commit e322a04).

Both items below are **scoped for later**, not started.

---

## #1 — The brain answers questions about board elements it cannot see

### What happened
Student asked "What does red mean?" twice about the energy-bars chart. Red is the `KE (kinetic)` legend swatch. The brain has no idea colours or legends exist, so it improvised: *"the red chunk in that first bar is light energy."*

### How the board is described to the brain today (NOT vision)
It is a **deterministic text pipeline**, not an image model:

1. Every renderer ships a pure `buildXxxManifest(props) → FeatureManifestEntry[]`
   (e.g. `buildEnergyBarsManifest` in `src/app/tutor/components/whiteboard/EnergyBarsRenderer.tsx`).
   `FeatureManifestEntry` (`src/lib/tutor/diagrams/layout.ts:44`) = `{ name, kind, description?, bbox?, labels? }`.
2. `WhiteboardCatalog` stores those entries per rendered item.
3. `buildWhiteboardSummary` (`src/lib/tutor/whiteboard/summary.ts:54`) renders the snapshot
   into the `<whiteboard_state>` block injected on every brain turn
   (`claude-brain.ts:1097` / `:1270`).
4. **`featureLines()` emits ONLY `f.description`.** `labels` are match surfaces for
   scribble targeting; they never reach the prompt.

### The gap (concrete)
For the photosynthesis call, `<whiteboard_state>` contained approximately:

```
[1] showEnergyBars — Every bite of food you eat traces back to sunlight [CURRENT PAGE]
   - dashed total-energy line at 100 J (conservation reference)
   - stacked energy bar at position "Sunlight hitting a leaf" (total 100 J)
   - stacked energy bar at position "Stored as sugar" (total 100 J)
```

Absent from every description: the legend text (`KE (kinetic)`, `PE (gravitational)`),
the colour→component mapping (red=ke, green=pe, blue=spring, purple=thermal — `COLORS`,
EnergyBarsRenderer.tsx:43), and **which component each bar actually contains**. Both bars
read identically as "total 100 J". The bogus `J` unit is also visible.

### Fix direction (cheap, deterministic — no vision needed)
Enrich the manifest `description` strings so they carry what a student can see:

- per-bar: `stacked energy bar at "Sunlight hitting a leaf": KE (kinetic, red) 100 J`
- add a legend feature entry: `legend: red = KE (kinetic), green = PE (gravitational), …`
- consider an optional `visual?: { color?: string; legendLabel?: string }` on
  `FeatureManifestEntry` rather than stuffing prose into `description`.

Then audit the other renderers with the same blind spot (any renderer whose output has a
legend, a colour key, or an axis label the brain never sees). Vision AI over a rasterised
board is a possible alternative but is slower, costlier, and non-deterministic; the manifest
is already the right seam and is regression-testable.

Guardrail either way: a prompt rule that the brain must not describe colours/legend text it
has no `<whiteboard_state>` evidence for — say "look at the legend" instead of inventing.

Watch: prompt size. `<whiteboard_state>` rides every turn; keep added text terse.

---

## #2 — Whiteboard tools are not scoped by subject

### What happened
Every one of the ~40 `WHITEBOARD_TOOLS` (`src/app/tutor/hooks/toolDefinitions.ts`) is offered
on every turn regardless of session subject. A biology session is handed free-body diagrams,
collision simulators, dimensional analysis, and energy bars. There is **no subject filter
anywhere** in the tool-selection path — `WHITEBOARD_TOOLS` is passed whole to the brain.

That is what let a photosynthesis lesson reach for a mechanics chart.

### Fix direction
Gate the tool list on the session's `subject` (already on the session doc / prompt context):

- Tag each tool with the subjects it belongs to (`physics`, `math`, `biology`, `chemistry`,
  universal). Default = universal so untagged tools keep working.
- Filter in whichever place builds the tool array for the brain call.
- Keep universally-useful tools (show_equation, show_problem, show_diagram, scribble,
  advance_lesson, …) always on.

Two wins: fewer misuse opportunities, and a smaller cached tool prefix — tools are a large
share of the per-turn prompt (see `scripts/measure-tools-tokens.ts`).

Care needed:
- Cross-subject lessons are real (physics in a math class, chemistry energetics). Prefer
  additive tagging over strict exclusion, and consider a soft warning in the description
  rather than hard removal for borderline tools.
- The `subject` field is coarse (`science` covers biology + physics + chemistry — this very
  session was `subject: science, topic: biology`). Gating may need `topic`, not just `subject`.
