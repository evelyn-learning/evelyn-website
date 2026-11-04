# Typed turn for fixed-script language lessons — design (2026-11-04)

Status: DRAFT for Praveen's approval. Nothing is built. Written after voice runs 21–24 of the GDI trial lesson and the Task 43–46 patch rounds.

## 1. Intent and why

Every GDI voice run produces a fresh list of five to nine "minor issues", each a different class, each fixed by another regex on the tutor's prose. The harness scores the previous run's classes clean and the next run finds new ones. The cause is the contract between the brain and the engine: the brain emits one blob of free prose; the engine reverse-engineers afterwards what kind of turn it was (verdict, correction, retry ask, offer, menu, move), infers the whiteboard cards from quotes, and reconstructs pedagogical state (which item was practised, whether a correction is open, which card was answered) from text heuristics. Maths tenants do not suffer this because an answer key gives the engine facts to act on; conversation has no key.

The typed turn gives the engine those facts for conversation lessons. The brain returns a small structured object per turn; the engine composes the speech in a fixed order, places cards from fields, picks pronunciation items from the plan, turns the page when it speaks the move, and keeps state from what it declared. The brain still writes every word the learner hears, in both languages, so the voice does not change.

## 2. Goals, non-goals, anti-goals

Goals
- A turn has exactly one `next` of a fixed set, so offer-then-ask, question-under-a-move and stub turns cannot occur.
- Corrections and confirmed sentences reach the board from fields, never from quote parsing.
- The page turns on the sentence that moves, after the verdict and its card have been seen.
- Pronunciation items, answered cards, open corrections and offer acceptances are engine state set at the moment the engine speaks them.
- Most GDI-era prose filters become dead code on the typed path (they stay for the prose path).
- Latency to first audio no worse than today's median (≈1.0 s to first sentence, validator hold cap 3.5 s on prone turns).

Non-goals
- No change to maths / science / GAC / Crimsora sessions: the typed path exists only when `isFixedScriptPlan(lessonPlan)` is true. The prose path is untouched for everything else and stays available as the fallback.
- No new whiteboard tools, no change to the plan JSON format (metadata additions only if the builder needs them, documented).
- No change to the TTS language routing, the perception layer or the session cap.

Anti-goals (a failure even if it works)
- A tutor that sounds mechanical or reads a template. The words stay the brain's; the engine adds no stock sentences except its existing fallbacks.
- Thinner Japanese: the schema has an explicit place for the Japanese support sentence; the persona and teaching-language rules apply unchanged.
- A longer pause before every reply.

## 3. Constraints

- Brain model: Haiku 5.5 (`TUTOR_BRAIN_MODEL`), via `claude-brain.ts` `streamBrainTurn`, SSE to the client; the client (`VoiceTutorRealtime.tsx`) does all composition. Prompt cache: the system prompt core is shared; the typed-turn instructions go in the session part.
- Structured output is already used elsewhere in the engine via `output_config.format = json_schema` (verdict-precheck, grade-free-response, with a 400 fallback); forced tool use via `tool_choice` exists in doodler and rule8-repair. Either is available.
- Flags default ON, env kill switch, tenant gate = plan kind (CLAUDE.md rule 3). One main line.
- Budget: Praveen's run 25 and bot runs on the local dev server; no API spend outside live sessions.
- Timeline: Friday 11-06 Josh's link ships the Task 46 build. The typed turn is the work after that; it must not be deployed before a bot series and one Praveen run score clean.

## 4. The design (decided)

### 4.1 Wire format
On a fixed-script plan the brain call requests structured output (`output_config.format: json_schema`, no tools). The object:

```json
{
  "ack":        "Thanks, Praveen.",                      // ≤ 1 short sentence, or ""
  "verdict":    "correct | partly_correct | incorrect | none",
  "verdict_say":"Yes, that is the present perfect.",     // the verdict in words, or ""
  "correction": null | {
      "student":   "I have learned how to create good presentation for my boss.",
      "corrected": "I have learned how to create good presentations for my boss.",
      "emphasis":  ["presentations"],
      "explain":   "You make more than one, so we need the plural."
  },
  "support_ja": "複数形にしましょう。",                   // optional Japanese support, or ""
  "next": {
      "kind": "retry | question | offer | menu | item | move | close | wait",
      "say":  "Can you say the whole sentence once more?",
      "item": "I was responsible for communicating with our customers.",  // kind=item only (pronunciation reference text)
      "level": "beginner | intermediate | advanced"                        // level-check close only
  }
}
```

Engine composition order, every turn: `ack` → `verdict_say` → `correction.explain` (the correction card is dispatched at this sentence) → `support_ja` → `next.say` (the ask / offer / menu / item / move card, page break or close happens at this sentence). Empty fields are skipped. Each field is one to two sentences; the schema's `maxLength`s enforce the turn cap (no more 127-word summaries unless the part is the recap, which allows a longer `say`).

Why structured output and not a forced tool: a tool call's JSON only completes on `content_block_stop`, so nothing could be spoken until the whole object arrived; structured output streams as text, and the client can speak `ack` and `verdict_say` as soon as those keys close (a small incremental JSON reader; builder's choice of library or hand-rolled).

### 4.2 The engine decides what is allowed, the brain decides the words
The engine already owns the lesson pointer (Task 44). On the typed path it also tells the brain, in a compact state block in the user turn, what the turn may do:

```
<turn_state part="past-simple" turn="6/8" open_ask="retry" offer_made="no" items_practised="…" allowed_next="retry,question" last_item="yes"/>
```

Allowed sets by state (engine rules, pure functions, unit-tested):
- open ask was a retry → `verdict` required; `next` ∈ {retry (once more), question, move if budget due and the retry is correct}.
- offer part, budget due, no offer made → {offer}.
- offer accepted → {question} once, then the budget rule.
- menu part on entry → {menu}; after a pick → {item}.
- pronunciation item armed → {retry (say it once more), item (next unpractised), offer, move}.
- budget due with no open ask → {move}.
- recap → {question (the contrast check), close}.
- level check → the third answer's turn carries `next.level`.

A `next.kind` outside the allowed set is answered with one retry (the schema makes the retry cheap: the object is regenerated, nothing was spoken yet because the gate holds until `next` is known to be allowed — the ack and verdict may already be playing, which is correct since they do not depend on `next`). A second failure falls to the engine's existing line for that kind (engine offer lines, card ask line, menu entry line, forced close). No prose validator (`transition_ask_off_part`, `transition_offer_missing`, `repeat_ask_after_two_tries`, `move_on_ignored`, `required_phrase_missing`, the meta-narration families) runs on the typed path; each is replaced by the allowed set or by a field check.

### 4.3 Cards and pages from fields
- `correction` → one correction card (emphasis from the field, `emphasisAt` computed), replacing the student's card of `correction.student` if one stands on the current page; anchored to the `explain` sentence; on the page being left if the turn also moves.
- `verdict = correct` and the student's last utterance is cardable → a model card of the student's sentence (cleaned by the existing `cardableStudentSentence`), anchored to `verdict_say`. The precheck's verdict is no longer a card source anywhere on the typed path.
- `next.kind = question` with a starter (`Start with "I have…"`) → the question handwritten on the current page (existing handwrite path).
- `next.kind = item` → the engine arms the pronunciation clip with `next.item`, paints the model card, and records the item as practised. A repeated item is refused before speech (allowed set) and the engine substitutes the next unpractised listed item into the state block for the retry.
- `next.kind = move` → the engine applies the advance (existing `applyResolvedAdvance`), anchors the page break and the authored card to the first sentence of `next.say`, and speaks the plan's bridge only if `next.say` has none (engine line, existing `fixedScriptBridgeClause` wording).
- `next.kind = menu` → the menu card is the authored card (existing), the engine records "menu asked".
- `next.kind = close` → the existing close sequence (summary requirements, forced close, farewell).
- `next.kind = wait` → nothing is asked (a hold while the student reads); the idle nudge remains the mechanism for silence, itself typed as {retry-of-the-open-ask} with a fixed engine lead ("Take your time.").

The brain keeps `show_sentence` / `show_problem` only through fields; it has no tools on the typed path, so duplicate cards, tagged re-paints and off-card renders cannot happen.

### 4.4 State the engine keeps because it spoke it
`openAsk {kind, text, cardQuestion?}`, `correctionOpen {student, corrected}`, `practisedItems[part]`, `offerState[part] {made, accepted, served}`, `menuState[part] {asked, picked}`, `answeredCards[part]`, `lastItemAnnounced[part]`. Existing refs are reused where they fit; the Task 43–46 heuristic inferences (answered-in-substance, retry-ask detection, verdict-echo drop, transition-sentence detection) are not consulted on the typed path.

### 4.5 Checks that stay
- Verdict precheck (Sonnet, parallel): kept as an independent opinion; a disagreement with `verdict` becomes an advisory note on the next turn (never a kill, never a card).
- Judge (false praise, grounding): kept as today, advisory.
- TTS language split per sentence, perception, barge-in, the session cap: unchanged.
- Validator TTS hold: replaced by "the gate holds until `next.kind` is known and allowed"; `ack`/`verdict_say` may stream ahead of it.

### 4.6 Fallbacks
- Structured-output request rejected (HTTP 400) or JSON unparseable after one repair retry → that turn runs on the prose path (existing code), event `typed_turn_fallback`. The flag `TUTOR_TYPED_TURN` (default ON for fixed scripts once the bot series is clean; OFF until then) switches the whole path.
- A field that is not usable (empty `next.say` on a kind that needs one) → the engine's existing line for that kind.

### 4.7 Observability and harness
Each turn logs one `typed_turn` event with the kinds and lengths (`verdict=correct next=question len=…`), plus `typed_turn_retry reason=…` and `typed_turn_fallback`. The harness gets a block that asserts from these events (one `next` per turn; correction field ⇒ correction card; item never repeated; move ⇒ page break on the same turn; no prose-era FAIL classes) and the existing checks keep running on the transcript.

## 4.8 Builder-check answers (my calls, marked for Praveen to check)
- **A move turn is one turn.** `next.kind = move` carries, in `next.say`, the bridge sentence and the new part's opening ask (its first question, or the menu line, up to three sentences; the recap opening up to five). The engine sets `openAsk` from the authored card when the ask matches it, otherwise from `next.say`'s last question. The page break and the authored card anchor to the first sentence of `next.say`. No second brain call, no stock sentence.
- **Illegal `next` retry = splice.** What the first object already said (`ack`, `verdict_say`, `correction`, `support_ja`) stands and is never re-spoken; the retry request (a client re-POST, as validator retries are today) carries `refused_next`, the allowed set, and the already-spoken fields marked "already said"; only `next` is taken from the retry object. A differing verdict or correction in the retry is ignored (logged `typed_turn_retry_disagreed`); it may become an advisory note on the following turn, never a second card.
- **Length limits are prompt-stated, engine-enforced.** Structured outputs do not accept `maxLength`, so the schema carries none. The prompt states the sentence budgets (ack 1, verdict 2, explain 2, support 2, next 3 / recap 5). The engine truncates `ack` and `verdict_say` at a sentence boundary when over budget; `next.say` is never cut: over budget it is regenerated once with the budget restated, then spoken as is.
- **Japanese may appear in any field.** The teaching-language rules and the persona apply unchanged: for a beginner the explanation leads in Japanese, the model sentence is English, and the per-sentence TTS routing handles the mix. `support_ja` is the dedicated slot for an extra Japanese support sentence, not the only place Japanese is allowed. The existing teaching-language-first check runs on the composed text.
- **Student-initiated turns.** The engine-side mechanisms that act before the brain (stop request, finish-or-summary choice, move-on request, menu pick parsing) keep running on the typed path and shape the allowed set for that turn. A student question to the tutor, an off-topic remark or a Japanese-only answer is answered inside `verdict_say`/`support_ja` with `verdict = none` and a `next` from the allowed set (usually `question` that returns to the open ask, or `retry`). `verdict` is `none` whenever the reply is not an answer to the open ask; the schema enum and the prompt both say so.
- **Precheck and text mode.** The in-stream voice verdict hold/cut is off on the typed path (the brain's `verdict` field is the verdict; the precheck is advisory for the next turn). The typed path runs in voice and in text mode; the bot harness (text sessions) is the gate, so text-mode thinking deadlines and levers must be verified against the field reader by the builder.
- **Bot series.** "Clean" = three consecutive bot runs (straight, wild, pron) with 0 FAIL on the typed-turn block and no new FAIL on the existing blocks, then Praveen's voice run. At ≈ $3 per run that is ≈ $9–15 including one iteration round. Praveen confirms the budget.

## 5. What is left to the builder
- The exact system-prompt section for the typed path (the composition order, the field semantics, the examples) and the user-turn `turn_state` encoding; both go in the session part of the prompt, not the cached core.
- The incremental JSON reader and where it sits in the SSE pipeline (`claude-brain.ts` emits `field` events, or the client parses `sentence` text).
- Schema `maxLength`s per field and per part (recap longer).
- How the eight GDI parts map to allowed sets, as a table in `fixed-script.ts`, with unit tests per state.
- Which existing refs are reused for 4.4 and which are new.
- The order of flag rollout: bot series on `TUTOR_TYPED_TURN=on` locally, Praveen's run, then default ON.

## 6. Rulings made here (check these while reading)
- Structured output over forced tool use (streaming the ack and verdict matters more than tool ergonomics).
- No tools on the typed path at all; every side effect comes from fields.
- The engine never overrides a legal `next`; it only refuses an illegal one (one retry, then its own line).
- The precheck stays as an advisory second opinion, not a card source.
- Scope is all eight parts of a fixed-script plan from day one, not a subset.
