# Course-generation model pilot — raw measurements

Date: 2026-09-02. Numbers only — no conclusions (Task 10 draws those).

## Conditions

- **Guides pilot (academy)**: course `AP_MACROECONOMICS`, same 5 nodes per leg (`apmacro.scarcity`, `apmacro.ppc`, `apmacro.resource-allocation`, `apmacro.cost-benefit`, `apmacro.comparative-advantage`) via `--limit 5 --force` into a fresh `--out-dir` per leg (confirmed same 5 filenames across all three legs). Concurrency 3 (script-internal). `GUIDES_MODEL` env var. Wall-clock for this pilot is **approximate** — derived from output-file mtime span (first file written → last file written), not a `time`-wrapped measurement, and legs partly ran in parallel background shells; treat as a rough signal only.
- **Bank-items pilot (engine)**: `apps/tutor/scripts/generate-bank-items.ts --grounding-from-seeds` (local Mongo unavailable, per Task 7's report — seed-catalog grounding used instead). LOS file: 5 Grade-7 Math LOs — `m7math.integers-and-absolute-value`, `m7math.rational-numbers-on-the-number-line`, `m7math.comparing-and-ordering-rationals`, `m7math.fractions-decimals-percents`, `m7math.adding-rational-numbers` (units 1–2, curated `SEED_PLANS` catalog). `--items-per-lo 6` (30 items requested per leg). `TUTOR_MODEL_CONTENT_GEN` env var selects the generator model per leg.
- **Verify gate**: `apps/tutor/scripts/seed-problem-bank.ts --dry-run`, verifier pinned to the default (`claude-sonnet-5`) on every leg — never varied. Each generator leg's output was copied into a throwaway `src/data/problem-bank/zz-throwaway-pilot-<model>/` dir, verified, then deleted immediately after (nothing left under `src/data`, nothing committed).
- **DeepSeek leg**: ran. Balance check (`GET /user/balance`) returned `$9.77` available, above the `$1` skip threshold — key sourced from `~/Downloads/Deepseek.api.key.txt`. Invoked via `TUTOR_MODEL_CONTENT_GEN=deepseek-chat TUTOR_MODEL_CONTENT_GEN_BASE_URL=https://api.deepseek.com/anthropic TUTOR_MODEL_CONTENT_GEN_API_KEY=<key>`. DeepSeek leg exists for the items-gen step only, per the task brief (no DeepSeek guides leg — academy's `generate-guides.ts` has no base-url override plumbing).
- **Batch-discount check**: `--batch --dry-run` verify re-run over the sonnet-generated 18-item set (same items as that leg's sequential verify baseline). **NOT-COMPLETED** — see the dedicated row below; batch was still `canceling` with 0/18 resolved when the polling budget (~15 min observed, exceeding the ~10 extra minutes authorized after the first monitor timeout) was exhausted and cancellation was issued. No cost line available (0 requests resolved before cancellation).
- "First-pass yield" for guides = 5 minus the script's own `retry` warning count (i.e. nodes that validated on the *first* generation attempt, before any feedback-driven regeneration). "First-pass yield" for bank-items has two layers, both reported: (a) generation-level — items successfully generated out of 30 requested (some LOs returned 0/6 on a parse/shape failure with no retry in this script); (b) verify-gate pass rate — the decision metric — measured only over items that were successfully generated.

## Guides pilot — academy, AP_MACROECONOMICS, 5 nodes/leg

| Model | Tokens in | Tokens out | Printed cost | Wall-clock (approx) | First-pass yield | Final ok/FAIL |
|---|---|---|---|---|---|---|
| claude-opus-5 | 11,876 | 37,221 | $0.990 | ~2m21s | 5/5 | 5 ok, 0 failed |
| claude-sonnet-5 | 11,876 | 28,606 | $0.310 | ~1m24s | 5/5 | 5 ok, 0 failed |
| claude-haiku-4-5 | 11,168 | 22,965 | $0.126 | ~46s | 4/5 (1 retry: `apmacro.scarcity`, currency/math-span collision — `richTextMathErrors`) | 5 ok, 0 failed |

Quality skim (one guide per model, `apmacro.scarcity.json`):
- opus: 4 sections, 8 keyTerms, 3 sampleQuestions, 4 FAQ; fluent, dense intro.
- sonnet: 4 sections, 7 keyTerms, 3 sampleQuestions, 4 FAQ; comparable structure and register to opus, slightly leaner prose.
- haiku: 5 sections, 6 keyTerms, 3 sampleQuestions, 4 FAQ (post-retry version); passed validation but needed the one retry logged above.

## Bank-items pilot — engine, 5 Grade-7 Math LOs, 6 items/LO (30 requested/leg)

| Generator model | Gen tokens in/out | Gen printed cost | LOs at 0/6 (generation failure) | Items generated | Verify tokens in/out | Verify printed cost | Verify pass/reject |
|---|---|---|---|---|---|---|---|
| claude-sonnet-5 | 12,835 / 14,048 | $0.166 | `m7math.comparing-and-ordering-rationals` (answer-letter-out-of-range), `m7math.rational-numbers-on-the-number-line` (unterminated JSON string) | 18/30 | 4,428 / 198 | $0.011 | 18/18 passed, 0 rejected |
| claude-haiku-4-5 | 9,530 / 6,256 | $0.041 | `m7math.rational-numbers-on-the-number-line` (answer-letter-out-of-range, full answer text returned instead of a letter) | 24/30 | 5,887 / 436 | $0.016 | 22/24 passed, 2 rejected (`m7math-gen-gen.integers-absolute-value.03` key=C model=A; `m7math-gen-gen.comparing-and-ordering-rationals.04` key=B model=A) |
| deepseek-chat | 8,746 / 4,231 | $0.009 | `m7math.comparing-and-ordering-rationals` (malformed JSON array) | 24/30 | 5,890 / 621 | $0.018 | 21/24 passed, 3 rejected (`m7math-gen-gen.integers-absolute-value.04` key=A model=B; `m7math-gen-gen.adding-rational-numbers.03` key=A model=B; `m7math-gen-gen.adding-rational-numbers.06` key=A model=C); also 1 validator warning (`m7math-gen-gen.adding-rational-numbers.02`: `problemText` has `$<digit>` currency/KaTeX trap) |

All three verify legs ran at the pinned default verifier (`claude-sonnet-5`, no env override).

## Batch-discount check

| Run | Batch id | Items submitted | Final observed status | request_counts at cutoff | Outcome |
|---|---|---|---|---|---|
| sonnet items, verify `--batch --dry-run` | `msgbatch_01La1BCSfv5mQ18vYiDQMKfu` | 18 | `canceling` (cancel issued, not yet `ended`) | `{processing: 18, succeeded: 0, errored: 0, canceled: 0, expired: 0}` at time of cutoff | **NOT-COMPLETED** — created `2026-09-02T09:12:58Z`, polled `in_progress` continuously to `14.7m elapsed`, cancel issued `09:27:32Z` (~14.6 min after submission) per the brief's do-not-retry instruction; batch had not transitioned to `ended` and had 0/18 resolved requests at last check. No comparative cost/verdict data available — this run produced no results. |

## Total measured spend (excludes the NOT-COMPLETED batch leg, which billed $0 — no requests resolved)

| Leg | Cost |
|---|---|
| Guides: opus | $0.990 |
| Guides: sonnet | $0.310 |
| Guides: haiku | $0.126 |
| Items-gen: sonnet | $0.166 |
| Items-gen: haiku | $0.041 |
| Items-gen: deepseek | $0.009 |
| Verify: sonnet-generated set | $0.011 |
| Verify: haiku-generated set | $0.016 |
| Verify: deepseek-generated set | $0.018 |
| **Total** | **$1.687** |
