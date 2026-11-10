# Tutor brain v2 — first comparison against v1 (2026-11-09)

Fixture `calc-lhopital` (scripted student built from portal-6ed49162 / portal-4a176ab7).
Scored blind by a reviewer who read 8 transcripts without knowing which engine produced which.

| Engine | Session | Tutor turns | Re-asked | Requests ignored | Full re-derivations | Follow-up question after a correct answer | Step-splitting | Verdict errors | Narration / third person | Rating /10 |
|---|---|---|---|---|---|---|---|---|---|---|
| v2 | B | 9 | 0 | 0 of 2 | 0 | 0 of 5 | 1 | 0 | 0 | 9 |
| v2 | C | 10 | 0 | 0 of 3 | 0 | 0 of 4 | 0 | 0 | 0 | 9 |
| v2 | F | 8 | 0 | 0 of 2 | 0 | 0 of 4 | 1 | 0 | 0 | 9 |
| v1 | D | 15 | 2 | 2 of 5 | 6 | 5 of 8 | 7 | 0 | ~15 | 3 |
| v1 | E | 37 | 6 | 1 of 9 | 16 | 10 of 23 | 20 | 1 | ~43 | 3 |
| v1 | G | 16 | 2 | 0 of 4 | 7 | 5 of 12 | 8 | 1 | ~22 | 4 |
| v1 | H | 22 | 4 | 1 of 7 | 8 | 7 of 17 | 12 | 1 | ~32 | 3 |
| v1 | I | 22 | 5 | 0 of 7 | 8 | 9 of 13 | 8 | 2 | ~36 | 3 |

Counted by the harness: first text of a reply at 1.1–1.5 s median for v2 (thinking on) against 0.81–0.86 s
for v1; input tokens per session 0.19M–0.24M for v2 against 3.2M–6.3M for v1.

## Not like for like — read before quoting

- v1 ran through the real browser client (voice session, typed turns). v2 ran offline: the turn
  engine only, its own board record, no audio, no whiteboard renderer, no client.
- In the v1 runs the scripted student could not see the board (fixed in the driver afterwards, not
  yet re-run). The "what's the problem?" moments and the wrong-problem verdicts in G and I come at
  least partly from that, so the v1 verdict-error column overstates v1's faults. Re-asking,
  re-derivation, follow-up questions, step-splitting and narration do not depend on it.
- v2 sessions were shorter (8–10 tutor turns, about 10 simulated minutes).
- One fixture, one student type (a competent adult). Nothing here says how v2 does with a
  struggling or young student, in another subject, or in a language lesson.

## v2 faults seen

- Says the time aloud ("your session is about 9 minutes in").
- On the one wrong answer it gave the correct value at once instead of pointing at the step and
  letting the student fix it.
- The opener gives the first example's answer away before asking anything.
- Everything stayed on board page 1.
- Replies run long for speech (median 69–96 words).

Reviewer rubric: `apps/tutor/scripts/tutor/replay-harness/REVIEW.md`. Bundles: `apps/tutor/artifacts/replay-harness/` (not in git).

---

# Second comparison — three kinds of student (2026-11-09, later)

Both engines' students could see the board this time. v1 = real browser client, voice session with
typed turns. v2 = turn engine offline. One blind reviewer per fixture.

| Fixture | Engine | Ratings /10 | Tutor turns | Re-asked | Full re-derivations | Verdict errors | Narration turns | Student got one right alone by the end |
|---|---|---|---|---|---|---|---|---|
| Competent adult (`calc-lhopital`) | v2 | 8, 9 | 7, 11 | 0, 0 | 0, 0 | 0, 0 | 0, 0 | n/a |
| | v1 | 2, 3 | 19, 13 | 4, 1 | 6, 3 | 0, 1 | 10, 6 | n/a |
| Struggling 17-year-old (`calc-struggling`) | v2 | 6, 7, 7 | 15, 11, 22 | 0, 0, 0 | 0, 0, 0 | 0, 0, 0 | 2, 1, 2 | yes, yes, yes |
| | v1 | 2, 3 | 39, 37 | 8, 10 | 15, 15 | 2, 2 | 22, 19 | yes, yes |
| Grade 6 (`g6-fractions`) | v2 | 5, 7, 8 | 12, 23, 17 | 0, 0, 0 | 0, 0, 0 | 0, 0, 0 | 0, 5, 1 | no, yes, yes |
| | v1 | 3, 2 | 40, 40 | 7, 9 | 18, 17 | 2, 9 | 19, 21 | no, no |

What the reviewers said about v2 where it was weakest:

- Struggling student: paced for a stronger student; sometimes handed over an answer after one "I
  don't know"; worked only partly on her known gaps (the chain-rule practice was her idea); one
  third-person slip ("since she's moving quickly").
- Grade 6: used "common denominator", "multiple", "numerators" before explaining them; did the first
  example for him; pushed a three-fraction problem straight after his first guided success; one run
  never gave him a problem to do alone; one run said its whole reply twice; one run left a wrong
  answer on the board (51/24) and corrected it; one run answered "can we stop?" with an empty reply.
- Competent adult: one time remark; announced "the trap" before posing it; "plan" talk.

v1's faults were the same in all three: a re-derivation after nearly every correct answer,
re-asked questions, narration and third person, two replies glued into one, and — with the weaker
students — correct answers called wrong (grade 6 run E: nine muddled or wrong verdicts).

Changes made to v2 afterwards (not yet re-scored at the time of writing):

- Engine: a turn ends after one model call when the tutor has spoken and every tool call worked
  (removes the repeated reply and a wait); a reply with no words is always followed up (removes the
  empty goodbye); a stored tool call always has its result (a cut-off reply had broken a session).
- Constitution: level sets vocabulary, step size and how fast difficulty rises; a gap that shows
  becomes the lesson until the student can do one alone; "I don't know" earns a smaller step, not the
  answer; a new word is explained when first used; the plan is never mentioned to the student.

---

# Third review — did the revised constitution help the weaker students? No.

Old v2 against revised v2 ("v2b": gap-becomes-the-lesson wording, single model call per turn),
three runs each, scored blind and mixed, with a stricter rubric (pace, "left behind", "gave it
away" now counted more tightly).

| Fixture | Old v2 | Revised v2 |
|---|---|---|
| Struggling 17-year-old | 5, 4, 6 | 4, 3, 5 |
| Grade 6 | 3.5, 5.5, 7 | 6, 4, 4.5 |

- No improvement; if anything slightly worse, within noise.
- The same three old-v2 struggling transcripts were rated 6, 7, 7 by the previous reviewer and
  5, 4, 6 by this one. Reviewer-to-reviewer spread is 1–2 points, so differences of that size
  between arms mean nothing at three runs each. The v1-to-v2 gap (2–3 against 5–9) is well outside it.
- Struggling student: "none made her gaps the lesson." All six told her the derivative of ln x and
  moved on; the chain rule was practised only when she asked or when a problem happened to need it.
  One revised run reversed its own verdict mid-turn and narrated ("let me update my notes", "let me
  log the goals as covered", "her derivative calculation gave 2").
- Grade 6: the revised wording produced a new fault in two of three runs — one tiny step per turn
  for 30 turns with a child who was getting everything right, never letting him do a whole problem
  alone ("too slow"), while still jumping to three fractions. The old runs erred the other way
  (first example done for him, too fast).
- The simulated student is not equally weak from run to run (she did the chain rule unaided in one
  session and failed it twice in another), which adds noise of its own.

Conclusion: wording changes to the constitution are not moving the weaker-student results. Next
is to test levers that are not wording — thinking effort and the model — and to cut the noise
(more runs per arm, one reviewer for all arms of a fixture).

# Browser smoke of the v2 voice client (first cut)

A 4.5-minute voice session with typed turns ran end to end: start tap, 12 turns, sentences sent to
the speech queue, board painted, session saved. Faults seen: the silence check-in fired after 25 s
while the student was working and talked over the answer (now 75 s, then 120 s); one third-person
sentence ("He handled the repeat application cleanly"); an empty transcript entry was refused by
the session save (fixed: the tutor's entry appears with its first words). Not tested: a real
microphone, echo, interruption by voice.

---

# Fourth review — thinking effort and model (the weaker students)

Same revised v2, three arms, three runs each per fixture, all nine sessions of a fixture scored
blind and together by two independent reviewers.

| Fixture | Arm | Reviewer 1 | Reviewer 2 | Mean |
|---|---|---|---|---|
| Struggling 17-year-old | Haiku 5.5, effort low (current) | 3, 3, 2 | 3, 4, 3 | 3.0 |
| | Haiku 5.5, effort **medium** | 4, 5, 5 | 4, 7, 6 | **5.2** |
| | Sonnet 5, effort low | 4, 3, 2 | 4, 2, 3 | 3.0 |
| Grade 6 | Haiku 5.5, effort low (current) | 4, 6, 4 | 4, 7, 3 | 4.7 |
| | Haiku 5.5, effort **medium** | 9, 7, 7 | 9, 7, 6 | **7.5** |
| | Sonnet 5, effort low | 2, 3, 6 | 2, 4, 5 | 3.7 |

- The two reviewers agreed to within a point on almost every session and ranked the arms the same
  way on both fixtures. Scoring all arms of a fixture together removes most of the reviewer noise
  seen in the third review.
- Medium effort is the best arm on both fixtures. What the reviewers saw in it: hints that name the
  place and not the fix, the child building the sixths himself and then being released to do whole
  problems, backing off a problem that was too much, no verdict errors in the best runs.
- Sonnet 5 at low effort was not better than Haiku 5.5 at low effort: "tell, then race ahead",
  heaviest vocabulary, false "you did it on your own" praise.
- Low effort produced the verdict errors (a wrong derivative confirmed twice; a verdict reversed
  mid-turn) and the narration ("let me update my notes").
- Still true of every arm with the struggling student: "no session made her gaps the lesson" — none
  stopped to give two or three chain-rule or ln x problems until she did one cold. Best score 7.
- Cost of medium effort, from the runs: first words at about 1.2–1.4 s median (0.5–0.7 s at low;
  2–3.7 s at the 95th percentile), and about 6–8.5K output tokens per session against 2.6–4.7K.

Decision: v2 runs at medium effort by default. A gap tracker (a `track_gap` tool whose list is
shown back in the facts every turn) is being tested at medium effort against this arm.

---

# Fifth review — the gap tracker (medium effort in both arms)

`track_gap` lets the tutor record a gap and how far it has been worked on; the list is shown back
in the facts every turn. Three runs per arm per fixture, all six of a fixture scored blind and
together by two independent reviewers.

| Fixture | Arm | Reviewer 1 | Reviewer 2 | Mean |
|---|---|---|---|---|
| Struggling 17-year-old | no tracker | 3, 4, 5 | 3, 4, 4.5 | 3.9 |
| | **with tracker** | 6, 5, 6 | 6, 5, 6.5 | **5.8** |
| Grade 6 | no tracker | 4, 7, 5 | 4, 8, 5 | 5.5 |
| | **with tracker** | 7, 6, 8 | 7, 6, 8 | **7.0** |

- Both reviewers put the arms in the same order on both fixtures and agreed to within a point on
  every session.
- Struggling student: all three tracker sessions deliberately came back to a gap with a fresh
  problem of the same kind and waited for a solo success ("try a similar one with no help"); none
  of the no-tracker sessions did. Each tracker session ended with her doing one of
  those gaps alone on a new problem (the chain rule in two, the ln x derivative in one); without
  the tracker the only solo successes were incidental recall of ln x inside a later problem.
- Grade 6: the tracker sessions withdrew the three-fraction problem when he balked and went back
  to whole two-fraction sums (3–4 unaided additions each); two of the three no-tracker sessions
  pushed him through it by step-feeding (0–1 unaided).
- These reviewers scored the no-tracker medium sessions about two points lower than the previous
  pair did (5.5 against 7.5 for the same grade 6 transcripts). Scores compare within a review, not
  across reviews.
- Still short of a good human tutor for the struggling student (best 6.5): the return happened for
  one gap per session, the ln x derivative was told and never deliberately practised in most, and
  nobody asked her to say back what "indeterminate" means. Tracker sessions still raced on to
  1^∞ forms after closing one gap.
- At low effort the tutor barely used the tracker (recorded in 0–2 turns a session); at medium it
  used it in 2–4.

Decision: the gap tracker stays.

---

# Sixth review — like for like: both engines through the real browser client (2026-11-10)

The comparison the earlier reviews lacked. Both engines ran as a voice session in the real embed
(silent microphone, typed student turns), same driver, same scripted students, same model
(Haiku 5.5). v2 = medium effort, gap tracker, and the three 11-10 changes on. Two sessions per
engine per fixture, four scored blind together by one reviewer per fixture.

| Fixture | v2 (browser) | v1 (browser) |
|---|---|---|
| Competent adult | 8, 7 | 3, 2 |
| Struggling 17-year-old | 7, 6 | 3, 4 |
| Grade 6 | 8, 7 | 3, 2 |

| Measure (per session) | v2 | v1 |
|---|---|---|
| Tutor turns | 10–22 | 13–40 |
| Re-asked something already answered | 0–1 | 1–9 |
| Full re-derivations of a correct answer | 0–2 | 5–18 |
| Verdict errors | 0–2 | 1–9 |
| Narration / third-person turns | 0–3 | 5–14 |
| Grade 6: whole problems done unaided | 6, 4 | 0, 0 |
| Struggling: deliberate returns to a gap | 4, 2 | 1, 1 |
| First words, median (driver's measure) | 1.2–2.0 s | 0.8–1.4 s |

- All six v2 sessions ran to completion with no errors: start tap, turns, sentences to the speech
  queue, board painted, lesson closed, session saved.
- v2 faults the reviewers found: it announces the method or the trap with almost every problem
  (3–10 turns a session); "common denominator" is used and never explained to the child; one
  session confirmed an answer without noticing the student had worked a different function and
  misdescribed which factors cancel; one false statement ("your common denominator was 10 both
  times"); one closing line leaked a to-do ("next time, look at why adding tops and bottoms fails").
- v1 faults were the familiar ones, plus two sessions each ending with the student protesting
  ("I already said 3 sixths") and broken turns in which a correct answer is called wrong and then
  right in the same reply.
- Not covered by this: a real microphone, echo, interruption by voice, speech timing.

Cost note: v2 sessions were being priced at a fallback rate because v2 did not report which model
answered; fixed (usage now carries the model). The per-minute figures recorded for the v2 sessions
above ($0.032–0.040) are therefore overstated and are not comparable with v1's.

# The three 11-10 changes (plan labels, open gaps on goal marking, "pose it bare") — unresolved

Scored offline, three runs per arm, two reviewers per fixture: better for the struggling student
(6.0 and 6.3 against 3.7 and 4.0), worse for grade 6 (4.7 and 5.0 against 7.0 and 7.0), level for
the competent adult (7.5 against 7.0). But the two grade 6 browser sessions above ran with all
three changes on and scored 8 and 7. Three runs per arm is not enough to separate these; a
one-change-at-a-time test is running.

---

# Seventh to tenth reviews — the three 11-10 changes do not help; reverted (2026-11-10)

The changes: (1) plan labels ("each practice problem is one example…", extension marked optional),
(2) reporting the gaps not yet done alone when a goal is marked, (3) "pose it bare". Base = medium
effort + gap tracker with none of them.

| Review | Sessions per arm | Struggling: base / all three | Grade 6: base / all three | Notes |
|---|---|---|---|---|
| 7 (first look) | 3 | 3.9 / 6.2 | 7.0 / 4.9 | looked like "helps one, hurts the other" |
| 8 (one change at a time) | 3 | 5.9 / 7.5; each alone 5.3 | 8.0 / 5.3; each alone 5.0–6.3 | no single change stood out |
| 9 (larger sample) | 9 | 5.5 / 6.3 | 6.6 / 5.9 | the 3-session gaps shrank to under a point |
| 10 (refined version) | 6 | 6.0 / 5.6; refined 4.8 | 6.0 / 5.9; refined 5.2 | refined = change 2 with "a harder problem is not a gap" |

(Each cell is the mean of two reviewers. Reviews are not comparable with each other.)

- With enough sessions the base is as good as or better than any variant for both students. The
  striking early numbers were three-session luck: the original three base sessions for grade 6
  were good ones (8.3) and six fresh ones averaged 5.8; the original three "all" sessions for the
  struggling student were good ones (7.3) and six fresh ones averaged 5.6.
- Two effects did survive the larger samples: with the changes on, the tutor returned to a gap
  more often for the struggling student (2.0 against 1.1 per session in review 9), and pushed the
  three-fraction stretch problem on the child more often (5 of 9 and 4–5 of 6, against 1 of 9 and
  1 of 6). Neither moved the overall ratings reliably, and the refined version kept the pushing.
- Decision: all three changes and the refinement are removed. v2 is back to the base. The
  experiment switches are gone from the code.
- What this cost and taught: about 80 sessions and 20 reviewer passes to learn that three sessions
  per arm cannot distinguish changes of this size. `scripts/tutor/replay-harness/REVIEW.md` now
  says how to run a comparison (six or more per arm, all arms in one review, two reviewers).

# Where v2 stands after the night

| Student | v1 (browser) | v2 base (browser, 2 sessions) | v2 base (offline; 3 sessions for the adult, 6–9 for the others; later, stricter reviews) |
|---|---|---|---|
| Competent adult | 2–3 | 7–8 | 7–8 |
| Struggling 17-year-old | 3–4 | 6–7 | 5.5–6 |
| Grade 6 | 2–3 | 7–8 | 6–6.6 |

(The browser v2 sessions ran with the three changes on; the later reviews show they make no
reliable difference, so they stand as a fair picture of v2.)

Known v2 faults, none yet fixed by anything tried:
- Announces the method, the form or the trap along with the problem (every session, 2–12 turns).
- Tells the fix or the fact after a single miss more often than a good tutor would.
- For a student who is behind: returns to one gap, not all; never has her say back what
  "indeterminate" means or why it is not the quotient rule; drifts to harder forms.
- For a child: uses "common denominator" / "divide evenly" unexplained; states the reason at turn 3
  before asking; sometimes pushes the stretch problem; praises as "on your own" what was step-fed.
- Occasional wrong statements (the pizzas "are different sizes"; a wrong derivative confirmed; a
  correct rewrite rejected): about one session in three has one.
- First words at 1.2–2.0 s in the browser at medium effort (v1: 0.8–1.4 s).
