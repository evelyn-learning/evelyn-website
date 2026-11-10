# Replay harness — reviewer rubric

The scripted student's own tags under-report (it complains far less than the real student did), so
the judged measures are scored by a reviewer reading each transcript blind to the engine.

Prepare: write each bundle's turns to `session-<letter>.txt` as `[n] TUTOR: …` / `[n] STUDENT: …`,
shuffled; keep the letter→arm key outside the folder the reviewer reads.

Measures, counted per transcript with turn numbers:

- (a) Re-asked: asks something the student already answered or showed.
- (b) Ignored request: a student request the tutor's next turn did not carry out; give ignored / total.
- (c) Unwanted working: re-derives the student's solution instead of confirming or naming the one wrong step (full, and brief in brackets).
- (d) Question after a correct answer about the same thing; give count / correct answers.
- (e) Step-splitting: asks only a sub-step of a problem the student could do whole.
- (f) Verdict errors: right called wrong, wrong called right, muddled, or judged against another problem. Check the mathematics; quote the sentence.
- (g) Narration / third person: "the student", "they", process or tool talk.
- (h) Other problems, one line each. (i) What was done well. (j) Rating 1–10 against a good human tutor for this student.

End with a summary table and whether the sessions fall into visibly different groups.

## Extra measures for a student who needs help (fixtures `calc-struggling`, `g6-fractions`)

For these students questions and small steps are often the right thing, so (d) and (e) above are
reported but not held against the tutor unless the student had already shown the skill.

- (k) Left behind: the tutor moved on, or repeated the same explanation in the same words, after the student signalled they did not understand.
- (l) Gave it away: the tutor stated the answer or the corrected result before the student had a fair try (two attempts) at it.
- (m) Over their head: vocabulary or reasoning above the student's level without explanation; or a monologue (more than about 60 words for a child, 90 for a teenager) with nothing for the student to do.
- (n) Diagnosis: did the tutor identify the student's actual misconception or gap and change approach because of it? yes / partly / no, with the turn.
- (o) Learning: by the end, did the student get one right on their own that they could not do at the start? yes / no, with the turn.

## How to run a comparison (learned the hard way, 2026-11-09/10)

- Rubrics are in `rubrics/<fixture>.txt`; `prepare-review.mjs` builds the blinded folder and keeps the key outside it.
- Score all arms of a fixture together, in one review, by two independent reviewers. Scores from
  different reviews are not comparable: the same transcripts were rated two points apart by
  different reviewers. Within a review, two reviewers agree to within a point per session.
- Three sessions per arm is not enough. Session-to-session spread is about 1.5 points, and with
  three per arm a lucky or unlucky trio moved an arm's mean by two points — enough to "show" that a
  change helped one student and hurt another when it did neither. Use at least six per arm; nine is
  better. The engine-against-engine gap (2–3 against 6–8) is the only kind visible at three.
- Ask reviewers to end with fixed lines (`SCORES: A=7 B=5 …`) so results decode mechanically.
- The offline runner uses the engine's default effort unless `--effort` is given. Check the first
  line of a run's log if a result looks odd (first words near 0.5 s means low effort).
