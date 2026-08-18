# Session prompt — run the verdict-probe hunt and triage it

> Paste everything below the line into a fresh Claude Code session started in
> `/Users/luke/Dev/evelynlearning` (so the project memory auto-loads).

---

Run the full verdict-probe hunt against the live tutor brain, then triage the results. You own this end to end — start the dev server, run the hunt, read the report, root-cause every failure, and land fixes. I am not watching; don't ask permission for steps that follow from this brief.

## Authorization (explicit)

You ARE authorized to run the full 21-probe × 3-sample hunt, which drives ~63 real headless browser sessions against the live AI brain, costs roughly **$10–25**, and takes **60–90 minutes**. Do not ask me first. The runner prints a cost estimate and waits 10 seconds before the first sample — that guard exists for accidental invocations, not for you; let it pass.

## What already exists

Branch `verdict-probe-bank` (13 commits off main @ `18d461d1`, **not merged**, awaiting review) added a verdict probe bank under `apps/tutor/scripts/tutor/verdict-bank/`: 21 scripted probes where the student's answer AND its correct verdict are both known, a deterministic classifier that grades the tutor's reply opener as affirm/deny/none, and a runner that drives each probe through the real brain and reports PASS/FLAKY/FAIL per probe.

**Check out that branch first** (`git checkout verdict-probe-bank`) — it is not on main. Then read `apps/tutor/scripts/tutor/verdict-bank/README.md`; it is the runbook and it carries the gotchas. Background on why each pinned probe exists is in the project memory `project_tutor_session_triage_2026_08_17`, which auto-loads.

A 2-probe smoke run already passed (`mx-equiv-form` → affirm, `ct-wrong-arith` → deny), so the plumbing is known-good. What has never been run is the full bank.

## Steps

**1. Dev server.** Check whether one is already listening: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3006/tutor`. If that returns 200, use it as-is. If not, start one — but note `apps/tutor`'s `npm run dev` is configured as `next dev --turbopack -p 3007`, while the harness defaults to `:3006`. So either pass `--base-url http://localhost:3007` to the hunt, or set `TUTOR_E2E_URL`. Getting this wrong fails loudly at preflight with a message that points at the wrong thing.

**2. Run the hunt**, from `apps/tutor/`, in the foreground with a long timeout:

```
npm run hunt:verdicts
```

It writes `artifacts/verdict-bank/<stamp>/report.md` and `results.json`, rewriting both after every sample — so if it dies partway you still have everything up to that point. Don't restart from scratch on a partial failure; read what landed first.

**3. Triage.** For every row that isn't PASS, decide which of three things it is. This distinction is the whole point of the exercise — getting it wrong sends you fixing the wrong layer:

- **A brain bug.** The tutor genuinely graded a known-correct answer as wrong, rubber-stamped a known-wrong answer, or issued a verdict on a non-answer. This is a finding: pull the bundle (`bundleDir` in the report has screenshots, transcript, and `debug-events.json`), root-cause it, and fix it.
- **A probe bug.** The probe's steering never produced a gradeable exchange, or its `expected` was wrong for what the tutor was actually asked. Persistent FLAKY/no-verdict usually means this. **Fix the probe's wording, not the brain.**
- **A classifier miss.** The tutor's verdict was correct but the regex misread it. Read the quoted opener before concluding anything else — every sample quotes it verbatim.

Re-run individual suspects at higher N to separate signal from noise: `npm run hunt:verdicts -- --probe <id> --samples 5`.

**4. The `## Guard saves` section is its own finding list.** Every entry there means the brain misfired and a deterministic guard caught it. Those rows are findings even where the grade says PASS — the guards' fire-rate is the metric that should trend toward zero. Record them.

## Known false positives — discount these before chasing them

The classifier's affirm/deny matching was widened late and introduced acknowledgment misgrades. Treat these as instrument error, not brain error:

- `"Got it — here's another example."` and `"Absolutely — …"` grade as **affirm**
- `"Hold on, …"` and `"Actually, …"` grade as **deny**
- `"Absolutely not — that flips the sign."` grades as **affirm** (a real denial read as praise)

Exposure concentrates on `inc-request-not-answer` and `inc-nonanswer-submission`, where an acknowledgment is a *plausible correct* tutor reply — so treat FAIL rows on those two as suspect until you read the opener. Same caution for any deny-expected probe whose opener starts "Absolutely not". If the hunt shows these actually occurring, tighten the regexes (red-first test, as below) rather than living with them.

Also known: `compute: 'board-expression'` turns are dormant (no debug event exposes structured `latex`), so probes `inc-arith-tutor-posed`, `mx-delayed-answer` and `mx-jump-to-conclusion` send their `fallbackSay`. Their expressions are pinned in the kickoffs so ground truth is static — but if the tutor puts a *different* expression on the board anyway, that's a probe-steering problem, not a brain bug.

## How to fix anything you decide to fix

Follow the repo's established pattern, which the triage memory documents: **deterministic guard + red-first test suite + a prompt rule only when it can be stated generically.** Never a topic-specific example as a guardrail — see the `feedback_generic_prompts` memory. Concretely:

- Write the failing test first, from the verbatim session text that exposed the bug.
- Prefer a pure, testable guard module over a prompt rule; prompt rules are probabilistic and have been violated in production before.
- Keep `npm run typecheck:verdict-bank` clean (plain `npx tsc --noEmit` does **not** cover `scripts/` — the tsconfig excludes it).
- Keep `test:pedagogy-driver-unit` (57/0) and `test:pedagogy-sim` (7/0) green; they are the regression net on the shared harness.
- **Growth rule, enforced:** every live incident you root-cause adds a pinned probe to `probes/incidents.ts` in the same round as its fix.

Use `superpowers:systematic-debugging` for root-causing, and consider subagents for independent per-probe investigations — but keep the verdict on what's a real finding yourself.

## Deliverables

Report back with: the full report table; per-failure classification (brain / probe / classifier) with evidence; what you fixed and its commits; the Guard-saves list; and the bank's pass-rate as a baseline to track. Then update the memory `project_tutor_session_triage_2026_08_17` with findings and pass-rates.

**Do not merge to main** — leave the branch for my review. Don't deploy anything.
