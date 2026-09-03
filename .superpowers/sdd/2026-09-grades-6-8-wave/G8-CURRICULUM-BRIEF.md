# Grade 8 curriculum drafting brief (common to all four courses)

You are drafting ONE Grade 8 middle-school curriculum table for the Evelyn Learning engine's
Grades 6/8 course wave. Grade 6 (four courses) and Grade 7 (four courses) are SHIPPED. Your table
is the foundation that 40 lesson plans, 240 bank items, 40 notes and 40 guides will be built from,
so every row must be a real, distinct, one-lesson-sized learning objective.

## Where things are

- Engine worktree (read here; write ONLY your one output file):
  `/Users/luke/Dev/evelynlearning/.claude/worktrees/demo-gate`
- Wave directory: `<worktree>/.superpowers/sdd/2026-09-grades-6-8-wave/`
  - Your OUTPUT: `<wave-dir>/<course>-CURRICULUM.md` (course = m8math | m8ela | m8sci | m8geo)
  - Your FORMAT EXEMPLAR and lower neighbour: `<wave-dir>/m6<subject>-CURRICULUM.md`. Read it in full.
    Clone its structure exactly: identity header block, then `## Unit N — Title` × 10, each with a
    5-column table `| Slug | Title | Standard | Scope | Salvage |` of EXACTLY 4 rows, then
    `## Progression rationale` and `## Explicitly excluded`. A downstream parser REFUSES any table
    that is not exactly 10 units × 4 topics, so count before you finish.
- Shipped Grade 7 seeds (the course directly below yours, read to avoid duplicating it):
  `<worktree>/apps/tutor/src/lib/tutor/lesson-plan/seeds/m7<subject>-u<N>-<slug>.ts` (40 files).
  Read AT LEAST two in full for granularity (one topic = one 20-25 minute lesson, never a week).
  Read every file name (`ls`), and read the LO `description` of any file whose topic is adjacent
  to a row you are writing. A row that re-teaches a G7 lesson at the same depth is a defect.
- Grade 7 unit titles: `<worktree>/apps/tutor/src/lib/tutor/lesson-plan/unit-titles.ts`. It also
  holds the HS courses' unit titles (`algebra-1`, `geometry`, `hs-english`, `biology`, `chemistry`,
  `world-history`), which are your UPPER neighbours; HS seeds are `alg1-*`, `geom-*`, `engl-*`,
  `bio-*`, `chem-*`, `whist-*` in the same seeds dir.
- Grade 7 fan-out contracts carry the full 40-row G7 tables with scope lines:
  ELA: `<wave-dir>/ELA-FANOUT-CONTRACT.md`;
  SCI and GEO: `/Users/luke/Dev/academy/.superpowers/sdd/2026-08-20-grade7-wave2/SCI-FANOUT-CONTRACT.md`
  and `GEO-FANOUT-CONTRACT.md` (read-only; do not write in the academy repo).
  There is no G7 MATH contract on disk; use the m7math seed files.
- Legacy salvage candidates: `ls <seeds-dir> | grep -E '^g[678]-'`. These are pre-convention files,
  never imported; cite one in the Salvage column only where it covers adjacent ground, and say what
  is reusable and what must NOT be carried forward. Otherwise `none`.

## Identity block for Grade 8 (verified against the registries in the worktree)

| course | title (byte-exact, from `scripts/seed-problem-bank.ts` COURSE_NAMES) | taxonomy id = bank dir | portal key | std prefix | tryFormat |
|---|---|---|---|---|---|
| m8math | Grade 8 Math | grade-8-math | GRADE_8_MATH | M8MATH | two-mcq-one-numeric |
| m8ela | Grade 8 English Language Arts | grade-8-ela | GRADE_8_ELA | M8ELA | three-mcq |
| m8sci | Grade 8 Science | grade-8-physical-science (label "Grade 8 Science (Physical Science)") | GRADE_8_SCIENCE | M8SCI | three-mcq |
| m8geo | Grade 8 World Geography | grade-8-world-geography | GRADE_8_WORLD_GEOGRAPHY | M8GEO | three-mcq |

Everything else in the header mirrors the G6 sibling with 6 → 8: plan id `evelyn.ms.m8<subj>.<slug>.v1`,
export `SEED_M8<SUBJ>_U<N>_<SLUG>`, LO id `m8<subj>.<slug>`, `gradeLabel: 'Grade 8'`, `grade: '8'`,
`exam: 'MS'`, the fixed 9-segment recipe, `MS_SOURCE`, `MS_PACING_THRESHOLDS`, difficulty spread `1,2,2,3,3,4`.
Note the G6 geo file says `GRADE_6_GEOGRAPHY`; the academy registry actually uses `GRADE_6_WORLD_GEOGRAPHY`,
so use `GRADE_8_WORLD_GEOGRAPHY`.

## Rules that every row must satisfy

1. **One row = one lesson.** 20-25 minutes of voice tutoring on ONE learning objective. If a
   standard needs two lessons, split it by pedagogical stage and say so in the Scope cell (the G6
   files show the pattern). If it needs half a lesson, merge it with a neighbour under one row.
2. **Scope cell = what the lesson does AND what it withholds.** Name the course and lesson that
   owns each withheld piece (e.g. "not yet X, which is Algebra 1 `alg1-u5-systems-elimination.ts`").
   The withheld part is what the lesson planners will need most.
3. **Verify every claim about a shipped course by reading that file.** "The G7 course covers X"
   is only allowed if you opened the seed and it does. State the file name. A claim you did not
   verify must say `UNVERIFIED`. Production status means something passed a gate, not that it is
   true or complete.
4. **The exclusion shape differs by subject** and your `Explicitly excluded` section must follow
   your subject's shape (stated in your course section below). Do not clone another subject's
   exclusion phrasing.
5. **Standards column** cites the REAL code (CCSS `8.EE.C.7b`, NGSS `MS-PS2-2` or DCI `PS2.A`,
   NGS `NGS 12`). The engine's `standard` field stays `M8<SUBJ>-<u>.<t>`; the header says so.
6. **Slugs**: lowercase kebab-case, unique within the course, descriptive, no grade number, no
   unit number, no apostrophes. Titles use `&` for "and" as the G6 files do.
7. **Pick up what Grade 6 explicitly reserved for Grade 8.** Each G6 file has an "Explicitly
   excluded (reserved for G7/G8)" section; anything it reserves for G8 that is genuinely Grade 8
   content must appear in your table or be explicitly declined with a reason.
8. **Do not reach into high school.** Algebra 1, Geometry, HS English, Biology, Chemistry are
   shipped; your Explicitly-excluded section must name what you leave to them, with the seed file
   that owns it.
9. **Open decisions go to the owner, not into silence.** Put a short `## ⚠️ For sign-off` section
   at the top listing every judgement call a curriculum owner would want to rule on (scope choices,
   standards you split or merged, anything you excluded that a reader might expect). Keep it to
   genuine decisions. The owner signs off all four Grade 8 tables as one batch.
10. **If anything in this brief conflicts with what you find in the repo, the repo wins, and say
    so in your report.** This brief was written from memory notes; the files are the truth.
11. Write ONLY your curriculum file. Do not edit, create, commit, or run anything else. Do not
    write into the academy repo. Do not touch `store.ts`, `unit-titles.ts`, or any seed.

## Report back (in your final message, not in the file)

- The output path.
- Unit count and per-unit row count (must be 10 × 4).
- The list of `For sign-off` items, one line each.
- Every place the repo contradicted this brief.
- Which shipped files you read IN FULL (not just listed).
