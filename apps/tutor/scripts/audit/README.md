# Answer-key audit

Independently validates the stored answer key of every servable practice item.

- Works from a JSON worklist file only. **Opens no database connection** and
  reads no `.env` file. The only credential is `ANTHROPIC_API_KEY` from the
  process environment.
- Writes only under `--out`.

## Files

| File | What |
|---|---|
| `audit-answer-keys.ts` | CLI: selection, model calls, retries, resume, outputs |
| `compare.ts` | Pure logic: worklist normalisation, MCQ key resolution, number / relation / text comparison, verdict rules |
| `prompts.ts` | Solver, judge and rubric-review prompts + JSON schemas (pure) |
| `compare.test.ts` | Tests for the pure modules: `npx tsx scripts/audit/compare.test.ts` |

## Worklist

Either an object keyed by item id or an array of rows. A row is a tuple
`[course, source, format, question, key|null, choices|null]` or an object
`{ id, course, source, format, question, key | expectedAnswer, choices, rubric? }`.
Choices are strings or `{ id, text, correct? }`. `rubric` is optional; without
it, items that have no expected answer are reviewed on the question alone.

## Method (per item)

1. **Blind solve** — the model sees the question (and options) only. The stored
   key and every `correct` flag are stripped by `solverViewOf`; solver prompts
   are built from that view and nothing else. The solver writes its working
   first, then the answer, and must say `ill_posed` rather than guess. It also
   names any answer-changing value it had to assume (e.g. an unstated constant).
2. **Compare**
   - multiple choice: chosen option vs keyed option (`correct` flag, else a
     letter, else the option text — the app's `correctChoiceIdOf` rule). A key
     that matches no option, or a flag that contradicts the key text, is
     `NEEDS_HUMAN`.
   - everything else: deterministic first — identical text after notation
     clean-up, the engine's `compareRelationTexts` for inequalities, single
     numbers within `max(0.01, 1 %)` (the engine's `answersAgree` tolerance).
     Anything not plainly decidable goes to a model judge:
     `SAME / DIFFERENT / KEY_INCOMPLETE / CANNOT_JUDGE`.
   - no expected answer: no solve; a review of question (+ rubric) → `OK / PROBLEM`.
3. **Tie-break** on any non-agreement — a fresh, independent solve at higher
   effort, again question only.

| Verdict | Meaning |
|---|---|
| `KEY_OK` | blind solve agrees with the key; or the tie-break agrees with the key (`tiebreakOutcome: KEY_OK_SOLVER_ERRED`); or review OK |
| `KEY_WRONG` | both independent solves agree with each other and not with the key |
| `KEY_INCOMPLETE` | key is a fragment / less precise than asked, but not wrong |
| `ILL_POSED` | both solvers say the question cannot be answered as written; or the review found a defect in the question |
| `NEEDS_HUMAN` | all three differ; the tie-break alone says ill-posed; the solvers agree against the key but had to assume an unstated value; unusable MCQ key; rubric defect |
| `ERROR` | the item failed (timeout, API error after retries, unparseable reply) — re-run with `--retry-errors` |

## Running

From `apps/tutor`. Pass the key on the command line; the script never reads env files.

```bash
# what would run, and how many model calls (no calls, nothing written)
npx tsx scripts/audit/audit-answer-keys.ts --in servable.json --out out/ --dry-run

# a filtered run
ANTHROPIC_API_KEY="$(grep -E '^ANTHROPIC_API_KEY=' /Users/luke/Dev/evelynlearning/.env.local | cut -d= -f2-)" \
  npx tsx scripts/audit/audit-answer-keys.ts --in servable.json --out out/ --source gentry --course PHYSICS --limit 200

# everything (re-run the same command to resume after a stop or crash)
ANTHROPIC_API_KEY="$(grep -E '^ANTHROPIC_API_KEY=' /Users/luke/Dev/evelynlearning/.env.local | cut -d= -f2-)" \
  npx tsx scripts/audit/audit-answer-keys.ts --in servable.json --out out/
```

Options: `--source`, `--course`, `--format` (comma lists), `--ids-file`
(one id per line or a JSON array), `--offset`, `--limit`, `--concurrency`
(default 6), `--stage1-only`, `--resume` (default) / `--no-resume` (moves the old
`results.jsonl` aside), `--retry-errors`, `--dry-run`, `--item-timeout <s>`
(default 600), `--solve-effort` (default `medium`), `--tiebreak-effort`
(default `xhigh`), `--tiebreak-model`.

`--stage1-only` writes `KEY_OK` where the blind solve agrees deterministically
and a partial record (`verdict: null`) otherwise; a later full run reuses the
stored blind answer and finishes those items.

Ctrl-C finishes in-flight items and writes the summary; a second Ctrl-C exits
at once (`results.jsonl` is still intact).

## Output (`--out`)

- `results.jsonl` — one object per item, appended and fsynced as each finishes.
  The last record per id wins.
- `summary.json` — verdict counts overall and by course / source / format,
  token usage and estimated cost (cumulative over the directory), plus this run's
  wall time.
- `flagged.csv` — every item whose verdict is not `KEY_OK`, for a reviewer.

## Models and prices

Model id comes from the registry role `content-verify`
(`src/lib/tutor/ai/model-registry.ts`; `TUTOR_MODEL_CONTENT_VERIFY` overrides):
currently `claude-sonnet-5` for the blind solve (adaptive thinking, effort
`medium`), the judge (effort `low`) and the review (effort `medium`). The
tie-break is the same model at effort `xhigh` unless `--tiebreak-model` is given.
Prices come from `src/lib/tutor/ai/model-rates.ts`: `claude-sonnet-5` =
$2 / MTok input, $10 / MTok output (thinking is billed as output).

## Known weaknesses

False alarms
- Questions that leave a constant or convention unstated (g = 9.8 vs 10,
  rounding) — the solvers pick one value, the key the other. Surfaced as
  `NEEDS_HUMAN` when the solvers report the assumption, `KEY_WRONG` when they
  do not.
- Keys rounded or truncated differently from the solver's value, outside the
  1 % tolerance.
- Questions that depend on course-specific framing (a definition or method the
  lesson taught) which a blind solver answers from general knowledge.
- Open explanatory answers where the judge reads a difference of emphasis as
  `DIFFERENT`.

Missed errors
- Blind solver and tie-break are the same model: an error both make the same
  way as the key's author goes through as `KEY_OK`.
- The 1 % / 0.01 tolerance accepts a key that is slightly off, and an absolute
  0.01 is wide for very small values.
- The judge is lenient on prose: a key that is vague, or right for the wrong
  reason, can be judged `SAME`.
- Multiple choice: a keyed option that is right while another option is also
  defensible is `KEY_OK` unless the solver notices and reports ill-posed.
  Distractors are not otherwise checked.
- Items that need a figure the text does not carry may be answered from the
  wording alone and pass.
- Items with no expected answer are only reviewed for gradability; when the
  worklist has no `rubric` field the rubric itself is not checked at all.
