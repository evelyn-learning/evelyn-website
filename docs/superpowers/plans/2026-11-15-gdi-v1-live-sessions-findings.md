# GDI v1 — what the live sessions showed (input to the v2 port), 2026-11-15

Read-only dumps of prod (:3009 build) sessions; laptop copies in the 11-15 session scratchpad.

| Who | Session | Length | Reached |
|---|---|---|---|
| Josh | embed-1794204711914 (11-09) | 7 min | stopped in present perfect |
| James (CEO) | embed-1794314921551 (11-10) | 13 min | stopped at the pronunciation menu |
| tester-2 (Japanese staff) | embed-1794791354557 (11-16 JST) | 20 min | full lesson |

## Acceptance cases for v2 (each seen live)
1. **Confusion skips the question.** "Could you rephrase that?" / "Sorry, I don't understand" in the level check → v1 asks the NEXT question (James t6–8, tester-2 t3–4). v2 must rephrase or simplify the same question.
2. **False "you already answered that".** tester-2 t28: a fresh answer met with 「その質問は、もう答えてもらいましたね」.
3. **Loop on short "No" answers.** tester-2 t37–49: past-simple part drifts into present-perfect questions and asks "important project" three times. v2: a "No" is an answer; pivot to something the learner can talk about (e.g. "Tell me about something you did last week").
4. **Stop means stop.** Josh t29–32: "please stop" → tutor asked a question, then opened the next part. James t61–66 had to say "I have to finish" three times (wave 19 addressed the phrase on v1).
5. **Menu pick not heard.** James t57–60: "just a little bit of individual words" → menu re-read; "I said individual words".
6. **Robotic praise stacking.** "Nearly there." / "That is a clear answer." / "Good, that's clear." nearly every turn, often two acknowledgements back to back. Corrections over-explain (rule stated twice, once in EN and once restated).
7. **Wrong or contradictory corrections.** James t12 ("make a car" then "plural cars"); Josh t18 says the sentence still needs "have worked" when it already has it; tester-2 t83 calls an answer 「いい質問です」.
8. **Invented facts.** James t44 credits "time management" for something he did not say.
9. **Timer line interrupts a menu.** tester-2 t76–79: two-minute warning mid-menu, then a confusing "practise more words or stop?" after "skip".
10. **Resume.** Josh asked "Can we continue from this point next time?" and was told yes; v1 has no resume. v2 must not promise what it can't do (or resume from lessonProgress).

What went well: Japanese support when asked (tester-2 t7–8, t15–16), the retry-to-correct sentence loop, the summary check question (tester-2 t83–86 answered perfectly).
