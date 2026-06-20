# Tutor e2e harness

Drives a **real claude-brain tutor session** in headless Chromium through the
typed-input path (no mic/voice) and captures an artifact bundle for review —
replacing the manual test drill (start session → pick lesson → drive
conversation → screenshot → collect console + PDF). See
`project_tutor_test_automation` in memory for the full design.

## Run

```bash
npm run dev                              # dev server on :3006 (separate terminal)
npm run test:tutor-e2e -- jee-conics-tangent
npm run test:tutor-e2e -- jee-conics-tangent --headed   # watch it run
```

Output bundle → `artifacts/tutor-e2e/<scenario>-<timestamp>/`:
`00..NN-*.png` (per-turn screenshots), `console.log` (full browser console +
network errors), `session.pdf` (exported), `transcript.txt` (brain turn log),
`summary.json` (screenshots + `watchFor` notes + anomaly flags).

## Add a scenario

Drop a file in `scenarios/` exporting a `Scenario` (see `types.ts`):

```ts
const scenario: Scenario = {
  name: 'my-scenario',
  description: '…',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1' },
  seedTurns: [{ say: 'conics' }],                     // fast-forward to testable state
  testTurns: [{ say: 'draw the ellipse …', watchFor: 'true ellipse, real tangent' }],
};
export default scenario;
```

`watchFor` is the "what should be true" note — surfaced in `summary.json` for
manual review and consumed by the (future) Phase-2 LLM-judge. Turns can also
fire dev triggers: `{ trigger: '__tutorForceKill', triggerArg: '…' }`.

## How it works (dev hooks)

The harness drives the app via 3 NODE_ENV-guarded `window` hooks (page.tsx):
`__tutorTestStart(cfg)` (pick lesson + start — selecting a lessonPlanId flips
the engine to claude-brain), `__tutorSendText(text)` (= typed student turn),
`__tutorTestState()` (poll state for turn-sync). Turn-sync waits for the brain
to go busy then idle for 3.5s (quiescence — rides through auto-chained turns).

## Scope / caveats

- **Functional/visual correctness** (headless): renders, math, page grouping,
  coherence, console errors, PDF fidelity. Audio doesn't play headless, so
  render↔speech-sync flushes renders on its 6s stall timer — the harness
  settles 7.5s before each screenshot so buffered figures are on the board.
- Each run hits the real brain API ($ + a few minutes/scenario). Curate a small
  canonical set; not a 1000-case suite.
- `POST /api/tutor/session-usage` 500s are known-benign telemetry (filtered).
- Phase 2 (LLM-judge over the bundle) is not built yet.
