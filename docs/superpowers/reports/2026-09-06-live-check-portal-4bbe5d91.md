# Live check — portal-4bbe5d91 (Praveen, Crimsora, Algebra 1 simplifying-expressions, 2026-09-06 05:00–06:04 UTC)

Build under test: engine `bRvjBzVabMN8QdKn0tbDl`, academy `dd956a7`. 87 messages, 44 brain turns, $4.70, typed input.

## Checklist verdicts
| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Goal in opener | not exercisable | enrollment has no goal (`goal: null`); set a target date to test |
| 2 | Stuck cues | n/a (typed, no fillers); `gap_inferred` came from INCORRECT_STREAK_2_PLUS (real sign-error streak) | 05:46:21 |
| 3 | Recap voiced + reply | ✅ | armed 05:53:10 → offer voiced first time (no `recap_offer_unvoiced`) → `accept` 05:54:48 → started → wrap nudge → returned 05:59:20 |
| 4 | MCQ letter reconciliation | not exercised | no letter+content utterance |
| 5 | Goodbye → homework | ❌ | `close_session_notes` called with NO objectives → `practice_assign_skipped no-lo-requested` despite ledger recurrence + recap outcome still_struggling; no announcement (correct given nothing assigned) |
| 6 | `profile_commit_final` | ✅ (indirect) | profile summary + nextSessionIntent written 06:04:15 — the awaited End-path commit landed; the event itself post-dates the last debug flush |
| 7 | Card + chip | ❌ consequence of 5; chip additionally never populates for live sessions (recordSessionEnded ignored the result fields) | academy Session row: no assignedPractice |
| 8 | Next session | pending | nextSessionIntent is stored: "Start with a quick refresher on combining like terms, then move into solving multi-step equations." |
| 9 | Thin session | not exercised | — |

## Defects found (all fixed in the follow-up round)
1. **Fatal 400 mid-lesson** (05:46:46): `messages.46.content.0.text: cache_control cannot be set for empty text blocks` — a killed/retried assistant turn left an empty transcript entry that became the last history message. Student saw "I'm having trouble reaching my brain right now". Fix: empty messages dropped before the cache marker.
2. **No homework despite the ledger** — brain passed no objectives. Fix: ledger-backed fallback (≥2 detections) with a default reason; `practice_assign_fallback`.
3. **False-praise kill on a partial answer** (05:09:41): "30p" to "5 × 6p?" killed against verified "100 + 30p". Fix: a value that is a term of the key is advisory only.
4. **Judge advisory on a correct "Not quite"** (05:46) → note timed out and was "volunteered" → brain retracted a right verdict ("you had the setup exactly right, my mistake"); the validator caught the mid-turn self-correction and retried. Fix: denial-shaped advisories are suppressed when the deterministic key says the student really disagreed.
5. **Chip never populates for live sessions** — the web calls `/sessions/ended` + `/sessions/live-result`, never `/sessions/result`; `recordSessionEnded` fetched the engine result but only used the social delta. Fix: it now applies `assignedPractice` + `nextSessionIntent`.
6. Telemetry gap: nothing said whether the host minted `practice_locator`/`goal_note`. Fix: `embed_config` boot event (presence only).

## Observations (not changed)
- Two judge correction notes timed out (20 s) and were "volunteered"; in both cases the note was unnecessary (one flagged the tutor's own correct correction; the other the correct "Not quite"). The bare-arithmetic drop worked on the first (`correction_recheck_dropped`).
- Recap outcome recorded `still_struggling` although the student opted out of the recap ("oh i am ok on this question, lets move on") and then answered correctly; the outcome reflects in-recap correctness only.
- Academy Session row stays `in_progress` after End/Pause by design (resumable); the engine's tutorsessions `endedAt` reflects the FIRST End (05:47) even though the session resumed to 06:04.
- The tutor's judgement "all locked in" at goodbye contradicted its own ledger; with the fallback the homework now follows the ledger regardless.
