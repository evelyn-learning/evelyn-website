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

## Grades 6 & 8 generation estimate (Task 10, 2026-09-02)

Every number below is either **MEASURED** (a direct cite to a row above) or **MODELED** (labeled, with the modeling assumption stated). Arithmetic is shown so any cell can be recomputed by hand.

### Scope assumption (trimmable, not a decision)

Mirrors Grade 7 (per `academy/docs/superpowers/plans/2026-08-20-grade7-wave2-courses.md`): **4 courses/grade (Math, ELA, Science, Geography) × 2 grades (6 and 8) = 8 courses.** Per course: 40 lesson plans · 240 bank items (40 LOs × 6) · 40 notes baselines · 40 guides. Praveen can shrink this (fewer subjects, one grade only, fewer items/LO) before any generation is scheduled — nothing below assumes he won't.

**Mock exams**: not in the Grade-7 shape and no pilot data exists for their generation cost profile (they aren't a simple N-item scale of the bank-items pipeline). **Not priced.**

### Cost model (formulas used in every cell)

- `guides = 40 × (leg printed cost ÷ 5 nodes) ÷ first-pass yield`
- `items-gen = 40 LOs × (leg gen cost ÷ 5 LOs) ÷ MEASURED overall yield` (overall yield = final verify-passing items ÷ 30 requested, i.e. sonnet 18/30=60%, haiku 22/30≈73%, deepseek 21/30=70% — combines generation failures *and* verify rejections, matching the pilot's actual loss profile)
- `items-verify = 300 × (leg verify cost ÷ items verified in that leg)` — 300 = 240 target items × 1.25, the assumed regeneration-cycle inflation (**stated assumption**, not measured: to land 240 *good* items you must generate/verify more than 240 given yield < 100%; 1.25× is a round approximation, not derived per-model)
- `notes-pointers = 40 calls × ~2K in / ~2K out MODELED tokens × model rate` (**MODELED** — Task 5's per-plan pointer-pass instrumentation was not re-run in this pilot; notes *baseline* generation is mechanical, $0)

### Stack 1 — all-Sonnet baseline (items-gen + items-verify on Sonnet)

Guides priced two ways since both ran clean 5/5 in the pilot:

| Artifact | Per-unit basis (MEASURED) | Yield | Per-course | 8 courses |
|---|---|---|---|---|
| Guides — **Opus** (today's default) | $0.990/5 = $0.198/guide | 5/5 (100%) | $7.92 | $63.36 |
| Guides — **Sonnet** (alternative) | $0.310/5 = $0.062/guide | 5/5 (100%) | $2.48 | $19.84 |
| Items-gen (Sonnet) | $0.166/5 LOs = $0.0332/LO | 18/30=60% | $2.21 | $17.71 |
| Items-verify (Sonnet on Sonnet-gen) | $0.011/18 = $0.00061/item | — | $0.18 | $1.47 (batch: $0.74 *if it works*) |
| Notes-pointers (MODELED, Sonnet $2/$10) | 40×(2K×$2+2K×$10)/1e6 | — | $0.96 | $7.68 |
| Notes baseline | mechanical | — | $0 | $0 |
| **Total (Sonnet guides)** | | | **$5.84** | **$46.69** |
| **Total (Opus guides)** | | | **$11.28** | **$90.21** |

### Stack 2 — Haiku-gen + Sonnet-verify (guides also Haiku)

| Artifact | Per-unit basis (MEASURED) | Yield | Per-course | 8 courses |
|---|---|---|---|---|
| Guides — Haiku | $0.126/5 = $0.0252/guide | 4/5=80% first-pass* | $1.26 | $10.08 |
| Items-gen (Haiku) | $0.041/5 LOs = $0.0082/LO | 22/30≈73% | $0.45 | $3.58 |
| Items-verify (Sonnet on Haiku-gen) | $0.016/24 = $0.00067/item | — | $0.20 | $1.60 (batch: $0.80 *if it works*) |
| Notes-pointers (MODELED, Haiku $1/$5) | 40×(2K×$1+2K×$5)/1e6 | — | $0.48 | $3.84 |
| Notes baseline | mechanical | — | $0 | $0 |
| **Total** | | | **$2.39** | **$19.10** |

\* Caveat: the Haiku guides leg's $0.126 total already *includes* the one retry (`apmacro.scarcity`, `richTextMathErrors`); dividing by 0.8 again applies a second retry-inflation on top of a cost that's already retry-inclusive. This makes the $1.26/$10.08 line **conservative (slightly overstated)**, kept for formula-consistency across all three stacks rather than special-cased.

### Stack 3 — DeepSeek-gen + Sonnet-verify (guides fall back to Sonnet)

No DeepSeek guides leg exists — academy's `generate-guides.ts` has no base-URL override plumbing (see Conditions above), so this stack's guides are priced at the Stack-1 Sonnet rate, not a DeepSeek measurement.

| Artifact | Per-unit basis | Yield | Per-course | 8 courses |
|---|---|---|---|---|
| Guides — Sonnet (**fallback, not a DeepSeek measurement**) | $0.310/5 = $0.062/guide | 5/5 | $2.48 | $19.84 |
| Items-gen (DeepSeek) | $0.009/5 LOs = $0.0018/LO | 21/30=70% | $0.10 | $0.82 |
| Items-verify (Sonnet on DeepSeek-gen) | $0.018/24 = $0.00075/item | — | $0.23 | $1.80 (batch: $0.90 *if it works*) |
| Notes-pointers (**MODELED**, DeepSeek blended rate) | see note below | — | $0.11 | $0.89 |
| Notes baseline | mechanical | — | $0 | $0 |
| **Total** | | | **$2.92** | **$23.35** |

DeepSeek blended rate note: DeepSeek publishes separate in/out per-MTok prices, but the pilot only measured one aggregate leg cost ($0.009 for 8,746 in + 4,231 out tokens = 12,977 tokens). We back out a single blended $/MTok = $0.009 ÷ 12,977 × 1e6 ≈ **$0.694/MTok** (combined in+out) and apply it to the 4K-token modeled pointer call. This is a single-datapoint approximation, not DeepSeek's real in/out-split pricing — **MODELED, low confidence**.

### Lesson plans — two options, priced side by side

**(a) Agent fan-out, as Grade 7 did it — ESTIMATED-UNMEASURED, no dollar figure.** Grade 7's runbook (`academy/docs/superpowers/plans/2026-08-20-grade7-wave2-courses.md`) dispatched "one lesson per agent, batches of at most 8" for its per-course lesson count. At 40 plans/course ÷ 8/batch = **5 agent-batches/course**, × 8 courses = **~40 agent-batches total** (sequential per the runbook's machine-load caution — a fan-out run alongside a build/vitest run adds wall-clock). Claude Code subagent usage was never metered in that run or this pilot, so no per-batch or total dollar figure is given — this is a session/batch-count estimate only.

**(b) Scripted generation, `generate-from-text.ts`-style — MODELED, requires its own build task.** No seed-driven scripted lesson-plan pipeline exists today; the bank-items pattern (Task 7-9) proves the shape (seed → structured JSON → verify) is buildable, but plans themselves would need a new script in the wave plan. If priced at the guides-leg's per-call cost/token scale as a structural proxy (single structured JSON artifact per unit, roughly comparable scope to a guide) — Sonnet rate, $0.062/plan-equivalent-call × 40 = **$2.48/course MODELED, $19.84/8 courses MODELED** — this number assumes the *not-yet-built* script would cost about what guide generation costs per call; treat as a rough floor, not a commitment, and it depends on the build task actually landing.

### Add-ons / not priced

- **Mock exams**: not in the Grade-7 shape; no pilot data on their generation cost profile. Not priced.
- **Batch API discount**: our two `--batch --dry-run` attempts never completed (see Batch-discount check above — canceled at 14.6 min, 0/18 resolved). Shown only as the parenthetical "(batch: $X *if it works*)" alongside each verify line — **never folded into any headline total.**
- **Notes baseline**: $0, mechanical, already included in every stack total above.

### Assumptions register

1. Scope mirrors Grade 7 exactly (8 courses × 40/240/40/40) — Praveen-trimmable.
2. Guides formula divides by first-pass yield even where the measured total already includes retry cost (Haiku case) — conservative, flagged above.
3. Items-gen divides by the pilot's *overall* yield (gen failures + verify rejections combined), not generation-only yield, since that's what the pilot actually measured end-to-end.
4. Items-verify assumes 300 verified items per course (240 × 1.25 regen-cycle inflation) — a round, stated approximation, not derived per-model from the pilot's actual gen-yield-vs-verify-yield split (which varied: sonnet's loss was 100% generation-side, haiku/deepseek's was mixed).
5. Notes-pointers cost is entirely MODELED (40 calls × ~2K in/2K out) — Task 5's real single-plan instrumentation was not re-pulled for this estimate.
6. Notes-pointers model choice mirrors each stack's items-gen model; this role is independently configurable (per the registry role list `content-gen`/`content-verify`/`notes-pointers`) and could be pinned to Sonnet everywhere regardless of stack.
7. DeepSeek guides do not exist as a measured leg (no base-URL plumbing in `generate-guides.ts`) — Stack 3's guides use the Sonnet fallback, not a DeepSeek number.
8. DeepSeek's modeled pointer-pass rate is a single-datapoint blended $/MTok backed out of one gen leg, not DeepSeek's published in/out split.
9. Batch discount (−50%) is never in a headline total; the pilot's two batch attempts never completed and produced no comparative data.
10. Lesson-plan option (b) is priced by structural analogy to the guides leg, not a real script — the script doesn't exist yet and would need its own build task.

### What the data supports

At n=5-nodes/n=5-LOs per leg, this pilot is falsification-grade, not a production-scale sample. What it does support: Haiku guides needed one retry (`apmacro.scarcity`, a currency/math-span collision in `richTextMathErrors`) but the post-retry output was structurally comparable to Sonnet/Opus on a one-file skim; Haiku and DeepSeek bank-item generation both showed the same failure signature at verify — an answer-key letter that doesn't match the model's stated answer (Haiku: 2/24 rejected; DeepSeek: 3/24 rejected, plus one `$<digit>` currency/KaTeX validator warning) — while Sonnet's own bank-item *generation* failed outright on 2 of 5 LOs (JSON/answer-range shape errors) even though everything it did successfully generate passed verify 18/18 clean. That's a real, if small, signal about where each model's failure mode concentrates (Sonnet: generation-shape brittleness; Haiku/DeepSeek: answer-key fidelity) — not evidence sufficient to recommend a production default.
