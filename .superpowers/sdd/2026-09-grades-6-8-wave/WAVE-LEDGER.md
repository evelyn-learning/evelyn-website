# Grades 6/8 MS Course Wave — Ledger

Plan: docs/superpowers/plans/2026-09-02-grades-6-8-ms-course-wave.md (main e78c09f2). Read the plan + its Global Constraints before acting; this ledger is the resume point across sessions.

## Course status matrix

| Course | Curriculum | Sign-off | Exemplars | Plans /40 | Lint+reg | Items | Notes | Guides | Reviewed | Cost actuals |
|---|---|---|---|---|---|---|---|---|---|---|
| m6math | ✓ (m6math-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (reviewed) | 40/40 | ✓ 200 OK | ✓ 239 (95.4%) | ✓ 40 + ptrs | ✓ 40 | gate MET | – |
| m6ela | ✓ (m6ela-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (repaired) | 40/40 | ✓ 244 OK | ✓ 240 (95.0%) | ✓ 40 + ptrs | ✓ 40 | gate MET | – |
| m6sci | ✓ (m6sci-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 (repaired) | 40/40 | ✓ 282 OK | ✓ 240 (97.9%) | ✓ 40 + ptrs | ✓ 40 | gate MET | – |
| m6geo | ✓ (m6geo-CURRICULUM.md) | ✓ 2026-09-02 | ✓ 2 + contract | 40/40 | ✓ 320 OK | ✓ 239 (97.1%) | ✓ 40 + ptrs | ✓ 40 | gate MET | – |
| m8math | ✓ (m8math-CURRICULUM.md, drafted 2026-09-03) | ✓ 2026-09-03 (batch, as drafted) | ✓ 2 (reviewed) | 40/40 | ✓ 366 OK | – | – | – | – | – | – |
| m8ela | ✓ (m8ela-CURRICULUM.md, drafted 2026-09-03) | ✓ 2026-09-03 (batch, as drafted) | ✓ 2 (reviewed) | 11/40 on disk (8 verified, 3 checklist-pending) | – | – | – | – | – | – |
| m8sci | ✓ (m8sci-CURRICULUM.md, drafted 2026-09-03) | ✓ 2026-09-03 (batch, as drafted) | ✓ 2 (reviewed) | 2/40 | – | – | – | – | – | – |
| m8geo | ✓ (m8geo-CURRICULUM.md, drafted 2026-09-03) | ✓ 2026-09-03 (batch, as drafted) | ✓ 2 (reviewed) | 2/40 | – | – | – | – | – | – |

## Contract sources (Task 0.3)

G7 ORIGINALS copied here from `/Users/luke/Dev/academy/.superpowers/sdd/2026-08-20-grade7-wave2/`: `ELA-FANOUT-CONTRACT.md`, `ELA-BANK-CONTRACT.md`, `DEFERRED-FIXES.md` (GEO/SCI variants remain in the academy dir — copy per course as needed). ⚠️ The Grade-7 MATH fan-out contract no longer exists on disk; for m6math/m8math derive from the ELA contract + the math differences it itself documents (tryFormat two-mcq-one-numeric; numeric third try_yourself) + the m7math exemplar seeds. Bank contracts are reference-only for item STYLE — item GENERATION is scripted this wave (generate-bank-items, not agent-authored).

Per-course instantiation: clone the nearest subject contract, substitute grade/audience-age/naming block (grammar in the plan's Global Constraints), the exemplar paths (this course's two, from Task 1.3 Step 1), and the worktree path CURRENT AT EXECUTION TIME (the G7 contracts hardcode a dead worktree path — always update it).

## Standing per-course command block (Task 1.4-1.6; run from the engine worktree unless noted)

```
# items (after plans registered + LOS file built)
TUTOR_MODEL_CONTENT_GEN=claude-haiku-4-5 npx tsx scripts/generate-bank-items.ts \
  --los-file <wave-dir>/<course>-los.json --scope-note-file <wave-dir>/scope-notes/<course>-scope-note.md --ms-conventions --difficulty-spread 1,2,2,3,3,4 \
  --items-per-lo 6 --ced-prefix <M6MATH…> --subject-label "<Grade 6 Mathematics…>" \
  --grounding-from-seeds --out-dir src/data/problem-bank/<bank-dir>/   # bank-dir = TAXONOMY id (grade-6-math), not plan prefix (m6math)
# verify (sequential — --batch is UNPROVEN, do not use)
npx tsx scripts/seed-problem-bank.ts --course=<bank-dir> --dry-run   # EQUALS FORM ONLY: the space form silently falls back to ap-statistics
# notes
npx tsx scripts/extract-topic-notes-baselines.ts <planId>   # ×40, then ONE controller store.ts edit
TUTOR_MODEL_NOTES_POINTERS=claude-haiku-4-5 npx tsx scripts/gen-topic-notes-pointers.ts …
npx tsx scripts/topic-notes-smoke.ts "<portal course title>"  # NEVER bare (defaults to Algebra 1)
# guides (from an academy WORKTREE cut from fetched origin/main — root main is STALE)
GUIDES_MODEL=claude-haiku-4-5 npx tsx tools/generate-guides.ts --course <KEY>
```

## Decisions / rulings log

- 2026-09-03 (Fable session evelynlearning-1c): all four Grade 8 curricula SIGNED OFF as drafted (Praveen: "Keep going" on the batched request). Controller defaults applied: m8geo 7.2 absorbs the greenhouse mechanism at define depth; the three missing G6 `unit-titles.ts` blocks ride in the G8 unit-titles commit. Exemplars chosen: m8math 6.1 identifying-functions (concept) + 4.1 equations-with-variables-on-both-sides (procedure); m8ela 2.2 dramatic-irony-suspense-and-humor (reading) + 5.3 active-and-passive-voice (grammar); m8sci 2.1 newtons-first-law-inertia-and-friction (concept) + 8.1 evidence-of-a-chemical-reaction (classification); m8geo 7.1 hazard-risk-exposure-and-vulnerability (concept) + 1.1 counts-rates-and-fair-comparison (data procedure).

- 2026-09-02: m6math curriculum drafted; flag for Praveen: topics 1.2/1.3 share 6.RP.A.3a and 9.1 splits 6.G.A.1 by pedagogical stage rather than one-code-per-topic.
- 2026-09-02: Task 0.1 shipped `--ms-conventions` + `--difficulty-spread` (commit 920eff7a); known stricter behavior: a model-dropped item leaves a difficulty gap rather than repacking (regen the LO instead).
- 2026-09-02: Controller-model ruling (Praveen): wave execution continues in an OPUS 5 session; this Fable session lands Phase 0 + m6math curriculum only.
- 2026-09-02 (Opus session): m6math curriculum SIGNED OFF as drafted, both flags accepted. Science taxonomy ids ruled NGSS-rotation: `grade-6-earth-space-science` / `grade-8-physical-science` (landed, commit 21a5c321). Curriculum sign-off batched per DROP (4 tables at a time), not per course.
- 2026-09-02: `extract-topic-notes-baselines.ts` holds a THIRD `MS_COURSE_NAMES` registry beyond the plan's trap-#1 pair — now carries all 8 grade-6/8 rows (commit 21a5c321). Add it to the trap list for the Grade 8 drop.
- 2026-09-02: the `\$` currency-escape rule applies to GUIDES ONLY, never to lesson seeds — shipped `m7math-u4-percent-increase-decrease.ts` uses bare `$12` in prod. Struck from the m6math fan-out contract.


## Grade 6 drop — BUILT 2026-09-03, awaiting Praveen's ship gate

Engine (worktree-demo-gate): plans 160/160 `lint-ms-plans: 320 plans OK`; banks 958 at 96.3% verified (no unit <90%, no LO <4); notes 160 baselines + 1,132 pointers; TTS
double-hyphen fix; new scripts build-los-file / emit-portal-course-nodes.
Academy (ms-grade6-guides): 4 courses in seed/mappings.json, 160 guides, catalog-nav
test moved from the uncapped to the capped band, tests/unit 1152 pass.
NOTHING pushed or deployed. Phase 2 is Praveen's call.

⚠️ Open product question for Praveen: m6geo and m6sci duplicate five topics (Earth's
layers, rock cycle, weathering/erosion/deposition, water cycle, weather vs climate).
The wave's overlap apparatus only points vertically between grades and cannot see a
sibling course in the same grade.


## Grade 8 drop — curricula DRAFTED 2026-09-03 (session evelynlearning-1c), sign-off PENDING

Four tables drafted by parallel agents from `G8-CURRICULUM-BRIEF.md` (scratchpad; copy in this dir), each
shape-checked with `gen-lesson-briefs.py` (10 × 4 = 40, unique slugs). Every table opens with a
`## ⚠️ For sign-off` section; the batched sign-off request lists them.

Cross-course findings resolved by the controller after the drafts landed:
- m8sci 1.2 (distance-time graphs) vs m8math 3.1/3.3 (slope): math owns slope; science stays in words.
- **No MS science course owns the greenhouse MECHANISM** (m6sci 10.1-10.2 = carbon cycle + evidence;
  m8sci excludes climate by design). m8geo 7.2 offers to absorb a one-paragraph mechanism — owner's call.
- m8sci has no hazard/weather/climate row, so m8geo U7 has no same-grade sibling overlap (unlike m6geo/m6sci).
- m8geo scoping decision: blended vertical-BY-DEPTH spine + 2 North America units (the G6 file's two
  candidate seats, both taken) — owner rules.
- New upper neighbours the plan never listed: `ap-human-geo-*` (grade 11, imported) for m8geo;
  14 `ap-physics*` seeds for m8sci (no HS physics course exists); 11 legacy `g8-sci-*` files are the
  best physical-science salvage.
- ⚠️ Shipped-G6 gap found while preparing Task 1.2: `unit-titles.ts` carries ONLY `grade-6-math`; the
  lesson picker shows bare "UNIT N" headers for grade-6-ela / grade-6-earth-space-science /
  grade-6-world-geography. Fix folds into the G8 unit-titles commit (same file, signed G6 titles).
- The plan's "registries already carry all eight grade-6/8 rows" is TRUE for the engine (taxonomy, lint,
  COURSE_NAMES, COURSE_PREFIX, MS_COURSE_NAMES, MS_SUBJECT_PHRASE) and FALSE for academy
  `seed/mappings.json` (generated; G8 keys appear only after Task 1.6's `buildCourse` + `seed:gen`).

## Grade 8 drop — EXEMPLARS DONE, FAN-OUT IN PROGRESS (2026-09-03, session evelynlearning-1c)

- Contracts: `m8{math,ela,sci,geo}-FANOUT-CONTRACT.md` (cloned from G6 by agents; controller rulings appended:
  description = positive scope statement + citation only; authoring qualifiers and curriculum cross-references
  drop out; em dash → ` -- `). Scope notes in `scope-notes/`. Briefs in `lesson-briefs/<course>/` (38 each).
- Exemplars (8) committed `2c1455b0`, registered with empty chains; `lint-ms-plans: 328 plans OK`; tsc clean.
  Every exemplar passed `g8-seed-audit.mts` (DF-1 formula, MCQ shape, description hygiene, U+2212, minutes).
- Fan-out mechanics: `G8-FANOUT-PROMPT.md` + one brief per agent, ≤8 concurrent, per course in curriculum order.
  After each batch: `ls seeds | grep -c m8<c>-` → `npx tsx g8-seed-audit.mts <course> <PREFIX>` (from apps/tutor)
  → tsc. Register all 40 per course with `register-course.py` (wires nothing — chains come from the seeds; the
  exemplars' chains must be hand-wired at that point) → `lint-ms-plans` expected 360/400/440/480.
- Batch 1 (m8math U1-U2, 8 rows) dispatched 2026-09-03.
- 2026-09-03 late: **m8math COMPLETE** — 40/40 registered in one edit (`register-course.py` + hand-wired exemplar chains), tsc clean, `lint-ms-plans: 366 plans OK` (328 + 38; next 404/442/480). Audit: 80 MCQs, longest-answer keyed 5/80 (6%, DIAGNOSTIC — below chance; distractors were lengthened per contract, no key trimmed). Controller spot-read 6 (2.2, 3.3, 5.2, 8.2, 9.3, 10.2): all sound. Four fan-out agents were cut off by a session rate limit mid-checklist; their files were complete on disk and passed the audit; each was RESUMED via SendMessage to finish its checklist rather than re-dispatched (recommended: check disk first, resume second).
- m8ela fan-out started (U1-U2 rows in flight).

## ✅ RESUMED AND CLEARED 2026-09-04 — the pause handoff below was executed in full; see the m8ela section at the end

## ⏸ PAUSED 2026-09-03 23:xx IST — HANDOFF TO AN OPUS SESSION (Fable quota)

Praveen paused the Fable session to continue in Opus. State at pause (all committed on `worktree-demo-gate`):
- **m8math: COMPLETE** (40/40 registered, lint 366, spot-read ×6). Nothing left.
- **m8ela: 11/40 files on disk.** Exemplars 2.2, 5.3. Fan-out rows VERIFIED by their author's full checklist and controller audit:
  1.1 strongest-textual-evidence · 1.2 how-dialogue-propels-action-and-reveals-character · 1.3 how-an-incident-provokes-a-decision ·
  1.4 comparing-the-structure-of-two-texts · 2.1 how-a-theme-develops-through-character-and-setting · 2.3 allusions-and-analogies-in-literature.
  **CHECKLIST-PENDING** (agent killed at pause AFTER writing the file; file imports, passes `g8-seed-audit`, tsc clean, but the author never ran
  blind-answer / quotation-sourcing / DF-3 distractor pass / SCOPE GUARD read-back — DF-3 is 7/9 keyed-longest on these three, the tell):
  2.4 modern-stories-and-traditional-patterns · 3.1 how-a-central-idea-develops · 3.3 word-choice-and-analogy-in-informational-text.
  **NOT STARTED / NO FILE** (agents killed before writing): 3.2 connections-and-distinctions-among-ideas · 3.4 the-role-of-a-sentence-in-a-paragraph ·
  4.1 how-an-author-responds-to-opposing-views · 4.2 is-the-reasoning-sound · 4.3 where-two-texts-disagree-fact-or-interpretation · and every row from 4.4 on.
- m8sci, m8geo: exemplars only (2/40 each), registered.

### Resume procedure (Opus session; run from `apps/tutor` of the demo-gate worktree)
1. `ls src/lib/tutor/lesson-plan/seeds | grep -c m8ela-` (expect 11) and `npx tsx ../../.superpowers/sdd/2026-09-grades-6-8-wave/g8-seed-audit.mts m8ela M8ELA` (expect clean).
2. For the 3 CHECKLIST-PENDING files: dispatch one agent each with `G8-FANOUT-PROMPT.md` + its brief + the instruction "the file exists; do NOT rewrite it; run the contract's Before-you-finish checklist on it, fix what it finds, report". (The same resume-not-redispatch move worked for 4 rate-limited math agents.)
3. Fan out the remaining 29 m8ela rows ≤8 at a time: one agent per row, prompt = "Read `<wave-dir>/G8-FANOUT-PROMPT.md` and follow it exactly. Your brief: `<wave-dir>/lesson-briefs/m8ela/u<N>-<slug>.md` (course m8ela)." After each batch: audit + tsc, commit the batch (`git add` the seed files only).
4. When 40 on disk: `python3 <wave-dir>/register-course.py m8ela M8ELA <wave-dir>/m8ela-CURRICULUM.md src/lib/tutor/lesson-plan/store.ts` (registers 38, skips the 2 exemplars), then HAND-WIRE the two exemplars' `prerequisites`/`followUps` (2.2: 2.1 → 2.3; 5.3: 5.2 → 5.4), tsc, `npm run lint:ms-plans` → expect **404**. Spot-read 6 (weight to U5-U6 grammar and U8-U10 writing rows). Commit.
5. Repeat for m8sci (exemplars 2.1, 8.1; chains 1.4→2.1→2.2 and 7.4→8.1→8.2; lint 442) and m8geo (exemplars 7.1, 1.1; chains 6.4→7.1→7.2 and 1.1→1.2; lint 480).
6. Then banks/notes/guides per the standing command block above; the G6 ship record in memory `project_grades_6_8_wave.md` carries the deploy traps.


## m8ela COMPLETE 2026-09-04 (Opus session, worktree `demo-gate`)

**`lint-ms-plans: 404 plans OK`** — the predicted number (328 + 38 m8math + 38 m8ela). tsc clean.
`g8-seed-audit m8ela M8ELA`: 40 plans, 120 MCQs, ALL CHECKS CLEAN. `check-course-consistency`:
40 rows / 40 files, no missing, no orphans, both exemplar chains hand-wired (2.2: 2.1→2.3; 5.3: 5.2→5.4).

Ran as four batches of ≤8 (3 checklist-repair + 29 authoring + the 8 already on disk). Commits:
`7442208b` (batch 1) · `b8a49f16` (audit fix) · `03fc346b` (batch 2) · `8933c986` + `58abf32a` (batch 3
+ rulings) · `d606ec99` (batch 4 + registration).

**DF-3 across the finished course: 37/120 keyed-longest = 30.8%** against 25% chance. Healthy in BOTH
directions — compare m8math's 6% (inverted) and the 67-94% shipped defect the apparatus was built for.

**Controller spot-read: 6 rows, 18 items, all blind-answered cold** (5.1 gerunds, 6.3 dashes, 4.4 media,
8.3 cohesion, 9.2 precise language, 10.4 citations). Every key forced; every real-world claim checked
(magma vs lava, inverter DC→AC, folding, MLA 9 order/punctuation, gerund vs participle, dash vs comma).

### Two defects found in SIGNED material — Praveen should know
1. **m8ela row 5.1's scope cell called "the swimming pool" a PARTICIPLE.** The pool does not swim; that
   is a gerund used attributively, and it fails the exact job test the row teaches. The cell is
   student-facing AND grounds the bank generator, so it would have seeded items for the lesson that
   teaches the distinction. Corrected to "the rattling window" in curriculum, brief and seed.
2. **The ` -- ` description convention was imported into ELA from science.** Measured: shipped ELA uses
   the em dash in 24 descriptions and ` -- ` in ZERO; science/math are the reverse. 12 m8ela descriptions
   were corrected back. m8math left alone — it matches its own subject.

### Instrument failure #8 (fixed) — it failed in BOTH directions at once
The audit's grade check was `/last year|next year/`, case-SENSITIVE. It flagged 11 innocent passage
sentences across 3 seeds while MISSING three real leaks that began with a capital "Last year" — one of
them in already-registered m8math. Narrowing it to teaching verbs then missed "Last year you FOUND the
volume". A verb list cannot be completed, so the check is now ADVISORY: phrase + first/second-person
learner, and it PRINTS THE SENTENCE. Three hits across 60 files, all real. Four self-tests pin it.
The leaks are fixed to the house convention "you already know" (`Last year you learned` has zero
precedent in the shipped corpus).

### Contract rulings 16-31 added (four blocks, all in `m8ela-FANOUT-CONTRACT.md`)
16 DF-3 is a band not a floor · 17 the SCOPE GUARD sample is an illustration, not a template ·
18 never assert a past school year · 19 ledger a distractor's world-facts, not its false premise ·
20 "character-for-character" governs words/order/case, not boundary punctuation · 21 dual-code rows cite
once at the end · 22 no specimen shared between a TEACHING segment and an ITEM (narrowed after 7.1 showed
the first version contradicted the exemplar) · 23+26 bare `WRONG:` only for non-standard English;
otherwise the label names the criterion · 24 em dash stays in ELA descriptions · 25+29 the ledger is
required wherever the row's SUBJECT is a claim about the world · 27 U+2026 → ASCII · 28 **the variant
labels do NOT match a `WRONG:` grep — my error, measured: 29/40 files hit, 11 missed; use
`grep -E 'WRONG|WEAK:|VAGUE:'`** · 30 cell→description transforms (em dash stays, U+2026 → "...",
U+2192 → "becomes", "the student's" → "your") · 31 a row may be honestly untestable in part — row 4.4
teaches "convey a mood" and deliberately does not test it, because a described medium cannot carry one.

### What the fan-out taught this round
- **Three of my own steering notes were wrong** (two swapped row numbers, one "you are the last row").
  Agents caught all three from their briefs; one had already ignored me before my correction arrived.
  Steering remains the least reliable document in the stack — the brief is authoritative, say so every time.
- **The DF-3 inversion is a real failure mode**: two agents independently closed a keyed-longest gap by
  growing every distractor and made the key the SHORTEST choice in every item. Ruling 16 exists for this.
- Agents converge. Seven independently decided a vocabulary/research row needs a claim ledger despite the
  all-fiction exemption; two independently reached the same dual-code citation convention. Convergence
  across independent agents is the strongest signal available here that a contract rule is missing.

### Next: m8sci then m8geo (2/40 each, exemplars only)
Same procedure. m8sci exemplars 2.1, 8.1 (chains 1.4→2.1→2.2 and 7.4→8.1→8.2), expected lint **442**.
m8geo exemplars 7.1, 1.1 (chains 6.4→7.1→7.2 and 1.1→1.2), expected lint **480**.
⚠️ Rulings 16-31 live in the m8ela contract; 16-20 were copied into all four, **21-31 were not**. Copy the
ones that generalise before fanning out sci/geo, and re-derive per subject anything measured on ELA —
ruling 24 in particular is ELA-specific and its science/math answer is the opposite.

## m8sci COMPLETE 2026-09-19 (Fable session; worktree `demo-gate`)

`lint-ms-plans: 442 plans OK` (predicted). tsc clean; `g8-seed-audit` clean over 40 plans / 120 MCQs; DF-3 40/120 = 33%
keyed-longest (at chance, healthy); `check-course-consistency` 40 rows / 40 files, no orphans (DESCRIPTION lines are the
documented false-positive class — m8ela control trips 39/40). 30 rows authored across four batches (8/8/8/6) of Opus
agents; ONE controller content edit in the whole course (four British spellings in batch 2). Exemplar chains hand-wired.

**Rulings 33–40** appended (33–39 to sci AND geo; 40 sci-only): cells have UP TO three parts; ruling 17's example is
ELA-origin; ledger exempt from the 25-line cap; ruling 32 burns cell examples (key-lengthening allowed, reported);
5.1 on the arithmetic-risk list; apparatus ban = never require the student to HAVE equipment; required quantities in
words, no symbol; formula rule yields to the formula-reading row. Prompt now asks agents to run tsc.

**For Praveen at review (cell wording, science):** 6.2 objective says "breaking particles apart" (rule-12-shaped,
disarmed in-file); 8.3 names an instant COLD PACK as a reaction (real packs dissolve); 9.1 carries "slinky" (trade
name) into a student-facing objective. **Shipped-G6 defect:** `g6-sci-atoms-elements.ts` says oxygen is flammable.
**Spot-read (keys lengthened under ruling 36):** 3.3 i1, 3.4 i1, 7.1 i1+i2, 9.3 i1. Salvage pointers were wrong
three times (7.3, 7.4, 10.1) because ruling 32 burns what part (i) names — the salvage column predates ruling 32.
Ruling 21's dual-code list (1.1/6.4/7.1/9.3/9.4/10.3) is ELA-ported; only 9.3 and 10.2 were genuinely dual.

Next: m8geo (2/40, exemplars 7.1 + 1.1; chains 6.4→7.1→7.2 and 1.1→1.2; lint **480**). Same procedure.

## m8geo COMPLETE 2026-09-19 (same Fable session as m8sci) — GRADE 8 PLANS DONE, lint 480

`lint-ms-plans: 480 plans OK` (predicted). tsc clean; `g8-seed-audit` clean over 40 plans / 120 MCQs; DF-3 28/120 = 23%
(at chance); consistency 40/40, no orphans. 38 rows authored across five batches (8/8/8/8/6) of Opus agents; controller
content edits for the whole course: cancelled→canceled ×3 files and one NGS-11 citation string. Exemplar chains wired.

**Geo contract/curriculum defects found by agents and FIXED in this session:** ruling 32 never ported (`d037ef51`);
checklist item 14 banned "already know" against ruling 18 (`fd32a2db`); the cross-reference warning block carried
science's item numbers (`f72c59a8`); NGS 9/11/13 table rows disagreed with the shipped precedent and my first count
missed escaped apostrophes — measured with `\'` normalized: NGS 7 "Earth's surface" 13/2, NGS 9 "on Earth surface"
9/0, NGS 11 7/1, NGS 13 5/0 (`eb37e0a5`, `bf2d5484`, `4906223b`); curriculum "Explicitly excluded" line 162 contradicted
the 7.2 greenhouse-absorb ruling (`bf2d5484`).

**Not fixed — for Praveen at review (student-facing objectives carry the cell verbatim):** 3.1 western ranges "at an
active plate margin" (Rockies are inland); 3.3 "Colorado to the Pacific" (no regular flow to the sea since 1960);
3.4 cross-ref "m6sci 6.3" should be 6.4; 5.1 has no course-wide pyramid-shape criterion (agent used "one outer band
≥ 2× the other"); 6.4 names three food-security dimensions vs FAO's four; 9.3 "each state acting alone" (US student
may hear a US state); NGS 5 table says "Earth's complexity", corpus says "the complexity of Earth"; contract line 74's
exemplar list mislabels 7.3/8.3/10.2 as "scoring" rows and its depth-floor table omits 9.1's classify step.
**Spot-read (keys edited under ruling 36):** 2.1 i1, 3.4 i3, 4.4 i3, 6.1 i1, 7.3 i1–i3, 8.4 i2, 10.2 i1–i2; 4.2 i2 was
SHORTENED (non-load-bearing spec removed). **Sixth depth-floor test worth writing as a ruling:** stipulation-
consistency (9.1 found its own case self-contradictory; no gate sees it), plus the sideways-neighbour headline check
for synthesis rows (10.2).

**Next (Phase B of the Grade 8 drop):** banks → notes → guides per the standing command block; then ingest
(crimsora + evelyntutor per the Grade 7 recipe), catalog/nav (the academy `catalog-nav` exact-count test WILL break —
move Middle School to the capped test if not already), merge origin/main → gate → deploy → push, marketing stats sync.
Also fold into the merge: amend `docs/superpowers/plans/2026-09-20-next-sessions-content-and-partner-portal.md`
(Praveen's 2026-09-19 decision: partner console at partners.evelynlearning.com + api.evelynlearning.com, not
/tutor-portal/app/*; memory `partner-platform-domains-decision`).
