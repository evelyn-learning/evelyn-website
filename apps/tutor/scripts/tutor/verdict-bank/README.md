# Verdict Probe Bank

## Purpose

The 2026-08 live-session triage (`project_tutor_session_triage_2026_08_17`
memory) surfaced five real incidents where the tutor's *verdict opener* — the
first sentence or two of its reply after a student states or answers
something — graded the student wrong: a correct restatement was denied, a
correct concept name was denied then quietly reversed, a one-letter
non-answer ("a") was praised as a right answer, a clarifying request was
answered as if it were the answer, and "I don't know" got a praise-phrased
reveal. Those five incidents are pinned as permanent regression probes in
`probes/incidents.ts` so a future prompt or guard change can't silently
reintroduce them. The bank is a hunt tool, not a unit-test gate: it drives
the REAL claude-brain through a real headless session for every probe,
classifies what the tutor actually said, and reports PASS/FAIL/FLAKY per
probe — a black-box measurement of the brain's verdict-grading behavior, not
of this directory's code.

## Prerequisites

- **A dev server.** This directory does not start one for you — `run-bank.ts`
  does a bare reachability `fetch()` at startup and exits loudly if nothing
  answers.
- **`ANTHROPIC_API_KEY`.** Resolved the same way the pedagogy harness already
  resolves it, via `scripts/tutor-e2e/llm.ts`'s `loadApiKey()`: the
  `ANTHROPIC_API_KEY` env var if set, else an `ANTHROPIC_API_KEY=` line read
  out of `apps/tutor/.env.local` (a symlink to the repo-root `.env.local`).
  No separate setup needed if that repo-root file already has the key.

### ⚠️ Port gotcha (controller ruling — read this before you start a server yourself)

The plan text says "dev server on :3006 (`npm run dev`)", but
`apps/tutor/package.json` actually defines:

```
"dev": "next dev --turbopack -p 3007"
```

— i.e. `npm run dev` from `apps/tutor/` serves **:3007**, not :3006. Both
`runScenario` (pedagogy-harness) and `run-bank.ts`'s `--base-url` default to
**`http://localhost:3006`**. If you start the server yourself with
`npm run dev` and then run the hunt with no `--base-url`, the reachability
preflight will fail — loudly, not silently — but the error text
(`"dev server not reachable — run 'npm run dev' in apps/tutor first"`) points
you right back at the command that caused the mismatch, which reads like the
server isn't running at all when it actually is, just on the wrong port.

Fix: either run a server that's actually bound to :3006 (e.g. another app in
this monorepo already listening there — confirm with
`curl -s -o /dev/null -w '%{http_code}' http://localhost:3006/tutor`), or if
you deliberately started `apps/tutor`'s own `npm run dev` on :3007, pass
`--base-url http://localhost:3007` (or set `TUTOR_E2E_URL` if the harness
honors it) on every `hunt:verdicts` invocation.

## Commands

Smoke run (2 probes, 1 sample each — confirms the stack works before
spending real money on the full bank):

```bash
npm run hunt:verdicts -- --probe mx-equiv-form --probe ct-wrong-arith --samples 1
```

Full hunt (all 21 probes × 3 samples each — the real triage run):

```bash
npm run hunt:verdicts
```

Single-probe repro (re-run one probe at higher N to resolve a FLAKY/no-verdict
result, or to confirm a fix landed):

```bash
npm run hunt:verdicts -- --probe <id> --samples 5
```

## Cost and time

Each sample is one real headless browser session against the real AI brain:
roughly **$0.15–0.40 per session**. The full 21-probe × 3-sample hunt is
**~$10–25 and ~60–90 minutes**, run **sequentially** — one browser session at
a time, never in parallel — so budget the wall-clock time accordingly before
kicking it off.

## How to read the report

`run-bank.ts` writes `artifacts/verdict-bank/<stamp>/report.md` (and a
parallel `results.json`), rewritten after every sample so a crash or Ctrl-C
mid-hunt still leaves a readable partial report.

- **PASS** — every sample of that probe graded correctly against its
  expected verdict class (`affirm` / `deny` / `none`).
- **FAIL** — at least one sample graded against the expected class. Read the
  quoted opener in the probe's detail section first — this is very likely a
  **finding about the tutor's brain** (a real mis-grading), which is exactly
  what the bank exists to catch. Do not "fix" the probe or the runner just to
  make it pass; file it as a triage item the same way the five pinned
  incidents were filed.
- **FLAKY / no-verdict** — no gradeable tutor reply was captured for one or
  more samples (empty text, a thrown session, or the tutor's turn genuinely
  never showed a verdict). See the triage note below before assuming this is
  a brain problem.
- **`## Guard saves`** section — each entry here is a sample where a
  deterministic guard (a `denied_answer_*`, `inverse_verdict_*`,
  `arith_claim_*`, `praise_echo_*`, `contradiction_inversion`,
  `verdict_guard`, `simplification_verdict`, or `nonanswer` debug event)
  intervened during the session. This means **the brain misfired and a
  guard caught it** — the sample still counts as a pass/fail on its own
  merits, but every guard save is still worth filing: the guards' fire-rate
  is the metric that should trend toward zero over time, and a rising rate
  on a previously-quiet probe is itself a signal.

## Triage pointers

- A **FAIL** is a brain-grading finding — read the opener, classify it per
  the round-7 invariants (brain reasoning error / guard under-fire / prompt
  gap), and open a fix round. The 2026-08 triage memory documents the
  fix pattern used for the five pinned incidents (deterministic guard +
  red-first test + a prompt rule when the issue is generic, not
  topic-specific — see `feedback_generic_prompts`).
- A **persistent FLAKY / no-verdict** result (reproduces at `--samples 5`)
  usually means the *probe's* steering never produced a gradeable exchange —
  the scripted kickoff/turns didn't reliably provoke the tutor into stating a
  verdict at all. Fix the **probe's wording**, not the brain, in that case.
- **Guard saves** are not failures to chase away — they're the brain
  misfiring and being caught. Track the rate; don't try to make it zero by
  editing probes.

## Known limitations (controller rulings)

1. **`compute: 'board-expression'` turns currently fall back to
   `fallbackSay` on every real run.** The provider (`provider.ts`) has a
   recursive extractor that would pull a computed value out of a
   `tool_call` debug event's structured `latex` field, but no such field is
   exposed by the brain's debug events today — so this path always takes the
   fallback. The extractor is there so the seam works automatically the day
   that instrumentation is added, but until then, treat any board-expression
   probe as running its fallback string verbatim. This affects
   `inc-arith-tutor-posed`, `mx-delayed-answer`, and
   `mx-jump-to-conclusion`.
2. **Plain `npx tsc --noEmit` does not type-check this directory.**
   `apps/tutor/tsconfig.json` excludes `scripts/` entirely. Use
   `npm run typecheck:verdict-bank` (which runs
   `npx tsc --noEmit -p tsconfig.verdict-bank.json`, a config that
   specifically includes `scripts/tutor/verdict-bank/**/*.ts`) — that's the
   real type check for this code.

## The growth rule

**Every live incident adds a pinned probe to `probes/incidents.ts` in the
same round as its fix.** A fix round that resolves a live mis-grading
incident without also adding a reproducing probe here is incomplete — the
whole point of the pinned-incident set is that a regression in a previously
fixed class gets caught by the next hunt, not rediscovered live.

## File map

| File | Role |
| --- | --- |
| `classifier.ts` | Deterministic (regex, no LLM) verdict-opener classifier — scans the first two sentences of a tutor reply and returns `affirm` / `deny` / `none`, plus `gradeOutcome` to compare against a probe's `expected`. |
| `types.ts` | `VerdictProbe` / `ProbeTurn` shape shared by every probe file. |
| `probes/` | The 21-probe bank: `incidents.ts` (5 pinned live incidents), `matrix.ts` (11 provenance × relation × answer-type combinations), `controls.ts` (5 plainly-wrong controls), `starts.ts` (shared lesson-start configs), `index.ts` (`ALL_PROBES` + documented known gaps: voice channel, MCQ-letter answers, board-card submissions). |
| `provider.ts` | `makeProbeProvider` — turns a probe's scripted `turns` into a `studentTurnProvider` for `runScenario`, including the board-expression recursive extractor (see limitation 1 above). |
| `report.ts` | Pure markdown renderer (`renderReport`, `renderSummaryTable`) — no I/O, so it's unit-testable without a browser. |
| `run-bank.ts` | The CLI (`npm run hunt:verdicts`) — the only I/O-doing file here: CLI arg parsing, dev-server reachability check, drives `runScenario` per sample via the pedagogy harness, grades each sample, and persists `results.json` + `report.md` after every sample. |

## Test commands

```bash
npm run test:verdict-classifier
npm run test:verdict-probes
npm run test:verdict-provider
npm run test:verdict-report
npm run typecheck:verdict-bank
```
