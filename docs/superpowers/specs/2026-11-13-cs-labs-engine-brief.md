# Coding labs for the tutor — brief for the tutor-engine session

Date: 2026-11-13. Written by the course-building session, for the session
that owns the tutor engine. Praveen agreed the split on 2026-11-13.

## 1. What this is for

We are adding a first computer science course, **Computer Science
Foundations (grades 6–8)**: 10 units, 78 lessons, a project at the end of
every unit, mapped to all 45 CSTA 2026 middle school standards. Visual
outline: https://claude.ai/artifact/4g8gqBGnhshqgmnzZVqKkZ (private to
Praveen; the unit list is repeated in §8).

Today a lesson is the tutor and its board in a frame. A student has nowhere
to write code, run it, or keep what they made. The course needs that, and
Praveen decided it lives **inside the tutor's lesson screen**, so the tutor
sees the code as the student writes it.

## 2. Who does what

| Tutor-engine session (you) | Course session (me) |
|---|---|
| Lab frame and the labs in §4 | 78 lesson plans, lab challenges, practice bank, topic notes, project briefs, guides |
| Automatic checking of student code (§6) | Catalogue entry for Computer Science in academy |
| The tutor seeing the student's code (§7) | Saved projects / portfolio storage and pages in academy |
| New question types on the board (§9) | The same question types in academy practice and quizzes |

The one thing we must agree **before either side builds** is the challenge
format in §5: every challenge I write is data your lab loads. Please
confirm it or change it, in this file, and tell Praveen. I start content
when it is settled.

## 3. What exists today (checked 2026-11-13, main `ad8f09ba`)

* `show_run_code` — `apps/tutor/src/app/tutor/hooks/toolDefinitions.ts:1059`.
  The tutor supplies code and tests; the student cannot edit. JS on
  `node:vm` (`app/api/tutor/run-code/route.ts`), Python in the browser on
  Pyodide 0.28.0 from jsdelivr (`lib/tutor/validation/python-runtime.ts`),
  which preloads numpy, pandas and sympy.
* `CodeRunDispatcher.tsx`, `CodeRunRenderer.tsx`, `CallStackRenderer.tsx`,
  `CatalogCSRenderers.tsx` under `app/tutor/components/whiteboard/`.
* Four grades 6–8 CS plans, one objective each, pseudocode only:
  `lesson-plan/seeds/g68-cs-{intro-coding,scratch-block,web-basics,digital-literacy}.ts`.
  I will replace these with the unitised set.
* Host ↔ engine: the only host→engine message is `evelyn:host_end`. Practice
  formats in portal-contract are `mcq | frq | numeric | free | drawn`.
* Nothing for blocks, an editable editor, an HTML preview, or saved work.

## 4. The labs

All labs share one frame: **task** (what to do, plus the check list),
**editor**, **result**, and the buttons Run, Stop, Check, Reset, Ask the
tutor, Save. The audience is an 11-year-old on a school Chromebook, so:
large targets, no setup, nothing to install, works at 1366×768, and every
error is explained in plain words.

| Lab | Units | Must do |
|---|---|---|
| Blocks, maze mode | 1 | Blockly workspace with a limited toolbox per challenge; a character on a grid; step-by-step run with the current block highlighted; block count shown. |
| Blocks, stage mode | 2, 3, 4 | Stage with characters (sprites), x/y, costumes, say, sound, events, loops, variables, if/else, key and touch input, collisions, random, broadcast, user-defined blocks. A "show this in Python" view for Unit 4. |
| Python | 4, 5, 8, 9 | Editable editor, console with `input()`, turtle drawing on a canvas, Stop that really stops an endless loop, friendly error messages (line highlighted, one-sentence explanation). |
| Web | 6, 10 | HTML and CSS editor with a sandboxed live preview; images from a provided library only. |
| Data | 7 | A table to sort, filter, group and summarise; a chart maker (bar, line, scatter, pie) where the student controls the axes, so misleading charts can be made and spotted. |
| Model | 9 | Train a small classifier in the browser from labelled examples, test it on new examples, see confidence and where it is wrong. |
| Simulations | 1, 8 | Flowchart builder; binary and pixel grids; text/image/sound as numbers; packets crossing a network with a link that can be cut; password strength and Caesar cipher tools. |

Decisions already made by Praveen:

* **Blockly**, not Scratch's engine. scratch-vm moved to AGPL-3.0 in
  November 2024. Blockly's licence is Apache-2.0 from memory — **please
  verify before adding the dependency.** We draw our own stage.
* **No hardware.** Laptop or Chromebook only. Blocks should also work on a
  tablet; Python needs a keyboard.
* **No public gallery.** Private share links only (academy side).

Things I would ask you to weigh (yours to decide):

* The current Pyodide load pulls numpy, pandas and sympy. A child's first
  Python lesson should not wait for those. A lean load for the lab, and a
  measured load time on a real Chromebook, would settle Pyodide vs a lighter
  runtime. The stdlib `turtle` needs Tkinter, so turtle needs its own
  canvas implementation either way.
* Student code should run off the main thread, with no network access, and
  the web preview in a sandboxed frame.

## 5. Challenge format (proposal — please confirm or amend)

One challenge is one small task with automatic checks. A lesson has three
or four. I will author them as data files; a model answer ships with each,
and a CI script must prove **every model answer passes its own checks**.

```ts
interface LabChallenge {
  id: string;                 // "csf.u4.l5.c2"  (course.unit.lesson.challenge)
  lab: 'blocks-maze' | 'blocks-stage' | 'python' | 'web' | 'data' | 'model' | 'sim';
  title: string;
  prompt: string;             // the task, grade 6 wording, plain text + inline code
  starter: unknown;           // lab-specific saved state the editor opens with
  solution: unknown;          // same shape as starter; never sent to the student
  checks: LabCheck[];         // all must pass
  hints: string[];            // least revealing first; the tutor may use them
  config?: unknown;           // lab-specific: maze layout, allowed blocks, dataset id, sprites
}

interface LabCheckBase { label: string; failHint?: string }   // label = the tick line the student sees

type LabCheck = LabCheckBase & (
  | { kind: 'stdout'; stdin?: string[]; equals?: string; contains?: string[] }
  | { kind: 'py-test'; code: string }                      // test_* functions, as show_run_code does today
  | { kind: 'source'; mustUse?: string[]; mustNotUse?: string[]; max?: Record<string, number> }
                                                           // structure, not text: "uses one for loop"
  | { kind: 'drawing'; matchesSolution: true; tolerance?: number }   // turtle path vs the model answer's
  | { kind: 'stage'; after: StageScript; expect: StageExpectation[] } // simulated inputs, then end state
  | { kind: 'maze'; reachesGoal: true; maxBlocks?: number }
  | { kind: 'dom'; selector: string; exists?: boolean; text?: string; style?: Record<string, string> }
  | { kind: 'data'; resultEquals: unknown }
);
```

`starter`, `solution`, `config`, `StageScript` and `StageExpectation` are
yours to define per lab; I need them documented with one worked example
each. What matters to me is that a check names **what the student sees**
(`label`), fails with a **specific hint** (`failHint`), and tests
**behaviour or structure**, never the exact text of the code.

## 6. Checking

* Check runs in the browser, on demand, and returns one pass/fail per
  check plus the first failing hint.
* The result is reported to the tutor (§7) and to the host page, so
  academy can record the challenge as done.
* The same check runner must run headless in CI over every challenge's
  model answer. That script is my quality gate for content.

## 7. The tutor and the student's code

When the student presses "Ask the tutor", or speaks while a lab is open,
the tutor needs: the challenge id and prompt, the student's current code
(or block program as text), the last run's output or error, and which
checks pass. The teaching rule I will write into the lesson plans is
"hint, do not hand over the answer"; the core prompt stays generic.

## 8. Lesson plans and the labs

I need a way for a lesson plan segment to say "open this challenge". A
proposal: an optional `lab: { challengeIds: string[] }` on `try_yourself`
segments (`lesson-plan/types.ts`), which the tutor opens with a tool call.
If you prefer a different hook, say which and I will author to it.

Unit list, with the lab each needs first:

1. How Computers Think — blocks, maze mode; flowchart builder
2. Animate a Story — blocks, stage mode
3. Build a Game — blocks, stage mode
4. From Blocks to Python — Python with turtle; blocks "show in Python"
5. Python That Decides — Python with console input
6. Build a Web Page — web
7. Data Detectives — data
8. Inside Computers and the Internet — simulations; Python
9. AI and Machine Learning — model; Python
10. Computing, People and Your Own Project — any lab, open-ended (no checks)

## 9. What academy needs from the engine

* **Project state out and in.** Each lab can serialise its whole state
  (JSON, target under 200 KB) and reload it. The frame posts it to the
  host on Save and autosave; the host can hand one back at session start.
  Academy stores it and builds "My projects". Please propose the message
  names and a schema; a portal-contract change is additive and a version
  bump per `docs/ops/WORKFLOW.md` §8.
* **Free-play mode.** A lab opened with no challenge and no tutor turn
  required, for projects and for reopening saved work.
* **Challenge result events** to the host: challenge id, passed, attempts.
* **New question types** for the board and the practice contract:
  order-the-lines (Parsons), predict-the-output, fix-the-bug, fill-the-gap.
  I will build the academy renderers once the contract carries them.

## 10. Order, and the first proof

1. **Python lab + lab frame + checking**, with the tutor seeing the code.
   Proof: three Unit 4 lessons I supply (print, turtle square, for loop)
   run end to end in a tutor session — the student edits, runs, checks,
   asks for a hint, and the result reaches the host.
2. **Blocks**: maze mode, then stage mode. Units 1–3 then go live.
3. Project state out and in; free-play mode; new question types.
4. Web, data, simulations, model labs.

Usual rules apply: new behaviour behind a flag that defaults ON, no
per-tenant branch, the core prompt stays generic.

## 11. Questions back to the course session

Write answers or changes into this file (or tell Praveen):

1. Is §5 acceptable as written? If not, what shape do you want?
2. Which hook do lesson plans use to open a challenge (§8)?
3. Where should challenge files live so both the engine and CI read them?
4. Does the lab work under tutor v2 only, or v1 as well?
