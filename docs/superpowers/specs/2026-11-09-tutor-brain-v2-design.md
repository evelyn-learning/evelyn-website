# Tutor brain v2 — design

Date: 2026-11-09 · Worktree: `tutor-fixes` · Status: DRAFT for Praveen's review. No code written.

Source session: `portal-6ed49162-7b27-4260-a01e-b9b101bde0ca` (AP Calc BC, L'Hôpital, voice, 21.5 min).
Earlier source: `portal-4a176ab7` (10-30, same lesson, same complaints).

## 1. The problem in one paragraph

The tutor behaves as if it forgets the conversation and the board. It does not lack
context: the whole transcript is sent every turn. What it lacks is authority. Around the
conversation we send about 120K tokens of standing rules and 8K–18K tokens of per-turn
blocks, many of them instructions derived from client-side heuristics. Those instructions
outrank what the student just said. Every past fix added another rule, check or flag, and
they now conflict. This design removes that layer and lets the model run the lesson from
facts.

## 2. What the engine does today (measured, with code references)

Paths are under `apps/tutor/`. CB = `src/lib/tutor/voice/claude-brain.ts`,
VTR = `src/app/tutor/components/VoiceTutorRealtime.tsx`.

| Item | Today |
|---|---|
| System prompt, shared core | `BASE_PROMPT`, about 180K characters. "HARD RULES" is about 50K, "Whiteboard Usage" about 76K. |
| Tools | 86 always sent, about 150K characters of definitions (`src/app/tutor/hooks/toolDefinitions.ts`). |
| Standing prefix on turn 1 of the source session | 113,155 cached tokens (prompt plus tools). |
| Per-turn user message | Up to 31 blocks (CB:2977–3015). 8K–18K uncached tokens per turn in the source session. |
| History | Whole session, spoken text only. The brain's own tool calls are not in it. |
| Thinking | Text: on. Voice: off unless `TUTOR_VOICE_THINKING=on` (3 s deadline). Off in the source session. |
| Voice answer check | Sonnet pre-check runs in parallel with the brain and is never in the brain's first request (CB:2919–2948). The browser holds verdict sentences up to 3.9 s and cuts the turn if the check disagrees. |
| Work-then-match | On for every voice turn. With thinking off it makes the model speak one line of working before any verdict (`voice-judging.ts:154`). |
| Kill and retry | About 45 rejection kinds can kill an attempt (verdict, lesson-flow, render). Up to 3 attempts per turn. |
| Judge | Haiku, after the turn. Can no longer kill; plants a correction note on the next turn. |
| Planted notes | About 25 kinds of "[runtime note — not from the student]" text prepended to the student's words (VTR:14075–14530). |
| Flags | 213 exported in `src/lib/tutor/orchestrator/flags.ts`. |

### Causes confirmed for the source session

| Symptom | Cause | Confidence |
|---|---|---|
| Streak read 13 on the first answer | Correct-streak is saved to localStorage per plan (`evelyn:pacing-v2:<planId>`, VTR:5096) and restored on every new session (VTR:12562). It is never reset per segment or per session. | Confirmed in code |
| Working spoken on every answer | Voice work-then-match with thinking off. Designed behaviour. | Confirmed |
| "Before the recap, let's settle the one open choice" | `<active_question>` quotes the last question and says "grade it against THIS"; the lesson-plan block says to stay in the segment until its goal is met. | Likely; needs a payload replay |
| "The question I asked is still open" | Same `<active_question>` block plus the work-then-match non-answer form ("don't solve the open question"). | Likely; needs a payload replay |
| "You haven't given me your answers yet" | The turn was classed as a non-answer, which selects the non-answer form of the rule. | Likely; needs a payload replay |
| "ln y = 1. Not quite." and "let's work it out" after a correct answer | Voice verdict cut: the turn was cut mid-speech and continued by a retry. | Confirmed in events |
| Session saved as "abandoned" | A closed lesson is only saved as completed after 45 s of quiet; closing the tab first saves "abandoned". | Confirmed in code |

Two corrections to what I said earlier in the session: the question pin (66 refused
clears) is a display banner and is not sent to the brain, so it did not cause the
re-asking; and the voice pre-check is not in the brain's request, so it did not cause the
"haven't given me your answers" reply.

## 3. Principles

1. The conversation is the memory. Nothing the runtime infers may contradict it.
2. The runtime gives facts and tools. The model decides what to say and do next.
3. The student's last message outranks the plan.
4. Checking happens before speaking, once, and unheard.
5. A fix is a change to a principle, a fact or a tool. It is never a new rule keyed to a symptom.
6. Nothing ships without a before/after replay score.

## 4. Design

### 4.1 A second brain path, selected per session

- New turn assembler `brain-v2` beside `streamBrainTurn`. v1 code is not edited.
- Selected by a session option resolved from the partner row
  (`lib/tutor/portal/partner-session-options.ts`) and a local override for testing.
- Default stays v1 until cutover. This is a deliberate exception to "new flags default
  ON": it is a path selector for an unproven rewrite. Needs Praveen's agreement (D1).
- GAC (:3008, text, pinned) is out of scope until v2 passes a GAC replay of its own.

### 4.2 What v2 sends each turn

| Part | v2 |
|---|---|
| System, shared core | A constitution: how a good tutor behaves, how the board works, how to use the session note. Target under 6K tokens. No per-symptom rules. |
| System, session part | Student, subject, level, language, persona, time box, and the plan as a map (4.4). |
| Tools | Only what the session's subject needs. Target 20–30, using the existing subject filter (`TUTOR_TOOL_SUBJECT_FILTER`) and shorter descriptions. |
| History | Real turns: assistant text plus its tool calls, and a tool result saying what painted, what was dropped and why. |
| Final user message | One `<facts>` block, then the student's words. Facts: what is on the board now, time used and left, answer-check result if any, the session note. No instructions. |
| Thinking | Adaptive, low effort, in voice as well as text. |

Target standing prefix: under 25K tokens, against 113K today. This also cuts cost per
turn and first-sentence latency.

### 4.3 The session note (the model's own memory)

- One tool, `update_session_note`, that the model calls when something changes.
- Content, a few lines each: what has been covered and shown; what the student has
  demonstrated; how this student wants to be taught ("verdict only", "skip what I know",
  "faster"); what is open; what comes next.
- The runtime stores it and returns it verbatim in `<facts>` each turn. It never edits it.
- Replaces as instruction: `<active_question>`, `<student_state>` and its hints, pace and
  difficulty preference blocks, the streak counters, the overlong note, and most planted
  notes.
- The runtime may still read it for the UI (rail, progress), never the other way round.

### 4.4 The plan as a map

- The plan is presented as goals, each with its materials: hook, examples, practice
  problems with keys, recap points.
- The model marks a goal with one tool: `set_goal_status(goal, shown | demonstrated | skipped, why)`.
- No "stay within the current segment" mandate, no turn budgets, no problem lock.
- The rail and progress follow the goal statuses. The closing summary and practice
  assignment are built from them, so skipped content cannot be reported as covered.
- Fixed-script language lessons (GDI typed turns) keep their own path; they are a
  different product shape and are not part of v2's first cut.

### 4.5 One answer check, before speaking

- Key at pose time: kept as is (generated problems, `verify-answer` for improvised ones,
  authored keys).
- When a verified key exists: the comparison is deterministic and goes into `<facts>`.
- When no key exists: the model's own silent thinking is the check. The Sonnet pre-check
  runs only for multi-step answers, is awaited up to a cap (proposed 2.5 s, covered by the
  existing thinking cue), and its result is a fact in the same request. Needs a decision
  on the latency trade (D3).
- Removed in v2: the browser-side verdict hold and cut, work-then-match, the match-statement
  reader, the judge's correction notes, and all verdict and lesson-flow kill kinds.
- Kept: tool and render validation, meta-narration filter as a last-line safety net, and
  the GAC no-reveal guard on the server (re-expressed as a fact plus the existing guard).
- The judge moves offline: it becomes one of the harness scorers.

### 4.6 The audio layer stays, fenced off

- Barge-in, perception stages, fragments, idle nudges, the thinking cue and TTS gating are
  unchanged.
- They no longer touch teaching state. A superseded fragment is simply removed from the
  history that the model sees.
- Idle nudge: the runtime reports the silence as a fact; the model chooses what to say.

### 4.7 What v2 deletes (after cutover)

The per-turn instruction blocks, about 25 planted-note kinds, the pacing counters and
their localStorage persistence, the question-pin clearing heuristics as a control input,
work-then-match, verdict hold and cut, about 35 of the 45 rejection kinds, and the flags
that gate them. Deletion happens only after cutover, in its own change.

### 4.8 A new session client (replaces VoiceTutorRealtime for v2)

`VoiceTutorRealtime.tsx` is 32,419 lines in one component: 194 refs, 80 effects, 84
callbacks, 266 imports, and 1,052 debug-event call sites. Audio, turn-taking, the brain
call, validation, pacing, the plan pointer, the board and persistence all share its
state, which is why a fix in one area keeps breaking another. v2 does not edit it. It
gets a new client, built from the parts that already exist as separate modules.

| Module | Job | Source |
|---|---|---|
| Audio in | Mic capture, speech recognition, barge-in and fragment decisions | Reuse the existing hooks (`useAudioCapture`, `usePerceptionWS`, `useTranscription`); lift the perception logic out of VTR unchanged |
| Audio out | Sentence queue, TTS, thinking cue, interruption | Reuse (`useAudioPlayback`, `useCartesiaSonicWS`); lift the queue out of VTR |
| Turn loop | One function: student turn in, brain stream out, sentences to audio, tool calls to the board, results back into history | New, small. This is where most of VTR's size disappears, because v2 has no kill-and-retry, no planted notes and no pacing counters |
| Board | Apply tool calls, report what painted | Reuse the whiteboard components and catalog as they are |
| Session state | History, session note, goal statuses, time box | New, one plain store. No refs shared across concerns |
| Persistence and telemetry | Periodic saves, end-of-session save, debug events | Reuse the save route; one typed event emitter in place of 1,052 call sites |
| Shell | `TutorSession.tsx` and the embed page | Reuse; they mount the v2 client when the session is v2 |

Rules for the build:

- Each module has one owner of its state and a typed interface. No module reads another's refs.
- Target: no file over about 1,500 lines; the turn loop under 800.
- Text sessions use the same turn loop with the audio modules absent.
- Nothing is copied from VTR without a reason written next to it. Behaviour that only
  existed to police the v1 brain is not carried over.
- v1 sessions keep using VTR untouched until cutover, then VTR is deleted.

Risk: VTR holds years of small fixes for real devices (mic re-acquire, iOS audio, noisy
rooms, iframe teardown). Phase 1 starts with an inventory of those, taken from the code
and its comments, so each is either carried into the right module or consciously dropped.

## 5. The replay harness (built first)

Existing pieces to build on, not replace:

- `apps/tutor/scripts/tutor/pedagogy-harness/` — drives a real session with a Haiku
  student simulator, has assertions and a judge.
- `apps/tutor/scripts/replay-gac-teaching-turns.ts` and `replay-verdict-turns.ts` — rebuild
  a brain request from a stored session and run the production brain offline.

What is added:

- A scripted student built from a real transcript: it says what the real student said,
  with a small set of rules for when the tutor's reply diverges.
- Four fixtures: this session, the 10-30 session, one GDI trial run, one GAC homework run.
- A fixed scorecard per run:

| Measure | How it is scored |
|---|---|
| Re-asked a question the student already answered | Scorer agent over the transcript |
| Turns between a student request and it being served | Scorer agent |
| Working given after a "verdict only" request | Scorer agent |
| Share of tutor turns ending in a question after a correct answer | Deterministic |
| Wrong or contradictory verdicts | Against the fixture's known answers |
| Turns to obey "move on" or "recap" | Deterministic |
| Narration leaks | Deterministic filter |
| First-sentence latency p50 and p95, cost per minute | From usage |

Cost: brain calls in a replay are API spend and cannot be moved to the subscription. The
source session cost $0.70. A round of 4 fixtures × 2 arms × 3 runs is about $17. Scoring
runs as in-session agents at no API cost. Each round needs Praveen's go-ahead (D2).

## 6. Phases

| Phase | What | Exit test |
|---|---|---|
| 0a | Two v1 repairs that are plain bugs, shipped on their own from worktree `tutor-streak-close-fix`: the streak carried across sessions, and the closed lesson saved as "abandoned". | Unit tests; deployed to :3007 |
| 0b | Harness, fixtures, v1 baseline scores. | Baseline scorecard exists |
| 1 | Inventory of device and audio fixes in VTR. v2 payload: constitution, `<facts>`, history with tool calls, session note, voice thinking. New turn loop and session state, text sessions first (cheapest to replay), then the audio modules. | v2 beats v1 on the scorecard for the two calculus fixtures |
| 2 | Plan as a map and goal statuses; rail, summary and practice driven from them. | No skipped goal reported as covered; recap on request in one turn |
| 3 | One answer check; verdict hold, cut and work-then-match off in v2. | Zero contradictory verdicts on fixtures; latency within the agreed cap |
| 4 | Praveen's own voice sessions locally, then on :3009. | His sign-off |
| 5 | Cutover on :3007 partner by partner; then delete v1 rules and flags. | A week of sessions with no v1-only regression |

Each phase ends with `npm run test:changed` (and `test:all`, since `claude-brain.ts` and
the client are cross-cutting) and a prod build. No deploy before phase 4.

## 7. Where the 31 listed fixes land

| Fix | Covered by |
|---|---|
| A1–A8 (10-30 probe and pacing rules) | Constitution (principle 3), session note, plan as map. Scorecard measures each. |
| B1 verdict-only, B3 request first, B8 recap and end | Session note plus principle 3 |
| B2 no re-asking, B10 forgotten answers | Removal of `<active_question>` and work-then-match; history is the memory |
| B4 clear verdicts, B5 no invented corrections | One check before speaking |
| B6 streak counter | Phase 0 repair, then deleted with the counters |
| B7 no going backwards, B13 honest close | Plan as map |
| B9 narration leak | Fewer leaks once thinking is silent; filter stays |
| B14 opener, B17 stock phrases | Constitution; remove the phrase-forcing rules |
| B11 multi-part cards | Separate small change to the problem card |
| B12 practice trigger and wording | Separate small change (`homework-pointer.ts`, ledger threshold) |
| B15 idle nudge | 4.6, plus a look at the two long silences |
| B16 session row | Phase 0 repair |
| C1 swap-back plan, C3 new page on swap, C4 subject on swap | Separate small changes in the swap route and embed page |
| C2 deflected switch, C6 question-only first turn | Principle 3 |
| C5 duplicate equations | History with tool calls |

## 8. Risks

- The first v2 will lose behaviours the old rules handled quietly (board hygiene, language
  lessons, young-grade pacing). The fixtures must include a lower-grade and a bilingual
  session before cutover.
- Voice thinking adds latency. The scorecard tracks p95; the thinking cue covers the gap.
- A shorter prompt changes the shared cache entry. v1 and v2 will hold separate entries
  while both run.
- Haiku 5.5 may not hold a lesson from a short constitution as well as hoped. The harness
  allows an A/B against Sonnet 5 as the brain before deciding.
- This is several weeks of work. Phase 0 and the bug repairs are useful on their own.

## 9. Decisions

Settled 2026-11-09:

- D4. The two bugs are fixed and shipped first, separately. Everything else is v2 and is
  built in this worktree.
- D5. Fixtures: the newest GAC sessions (all text) and the newest GDI sessions, since they
  carry the latest fixes. Plus the two Crimsora calculus voice sessions.
- The session client is rebuilt for v2 (4.8), reusing existing modules.

Still open:

- D1. Agree that the v2 selector defaults to v1 until cutover.
- D2. Approve replay spend per round (about $17) and the first baseline round.
- D3. Voice answer check: accept up to 2.5 s extra on multi-step answers with no key, or
  keep the check parallel and let the model's own thinking decide.
