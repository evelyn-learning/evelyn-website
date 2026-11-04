# Typed Turn Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On fixed-script language lessons the brain returns one structured object per turn and the engine composes speech, cards, page breaks and state from its fields instead of parsing prose.

**Architecture:** The server brain (`claude-brain.ts`) gets a typed branch: structured output (`output_config.format`), no tools, an incremental field reader that emits each field as it closes, and a server-side retry when `next.kind` is outside the allowed set the client sent. The client (`VoiceTutorRealtime.tsx`, "VTR") owns the lesson state: it computes the allowed set and a `turn_state` block before each turn, receives `typed-field` events, speaks the field sentences through the existing speech queue, dispatches cards and the page break from fields via pure effect functions, and skips the prose validators and heuristic inferences for the attempt. Everything domain-specific is in two new pure modules with unit tests; VTR only wires them.

**Tech Stack:** Next.js (apps/tutor), TypeScript, `@anthropic-ai/sdk` 0.115 `client.messages.stream`, Anthropic structured outputs (`output_config.format = { type: 'json_schema', schema }`), tests = `npx tsx scripts/test-*.ts` registered in `apps/tutor/package.json`, bot harness `scripts/trial-text-session.mjs` + `trial-text-session-checks.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-04-typed-turn-design.md` (commit 1d349c15). Read it first; this plan argues from it.

All paths below are relative to `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson/apps/tutor/` unless they start with `docs/` (repo root). Line numbers are from HEAD 4e77472d and drift as tasks land; grep the quoted text when they do.

## Global Constraints

- Worktree only: `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson`, branch `gdi-trial-lesson`. Never edit `apps/tutor` while a bot run or Praveen's session is live on `:3019` (hot reload). Never two bot runs at once.
- Gate before every push: `npm run test:changed` (277/279 baseline: `test:embed-debug-coverage`, `test:portal-student-scoping` fail already) and `npx tsc --noEmit -p tsconfig.json` clean.
- Flag `TUTOR_TYPED_TURN` is the ONE flag for the whole path. Spec §4.6: OFF until the bot series is clean, then default ON (`!== 'off'`). Until Task 10 it is opt-in: `process.env.NEXT_PUBLIC_TUTOR_TYPED_TURN === 'on'`. Dev `:3019` reads `.env.local` at start: set `NEXT_PUBLIC_TUTOR_TYPED_TURN=on` there and restart the dev server before any bot run.
- Tenant gate = plan kind: the typed path exists only when `isFixedScriptPlan(lessonPlan)` is true (spec §2 non-goals). Nothing changes for maths / GAC / Crimsora sessions; every new branch in VTR and `claude-brain.ts` is behind `typedTurn` being present.
- Spec §4.1: composition order every turn is `ack → verdict_say → correction.explain → support_ja → next.say`. Budgets (prompt-stated, engine-enforced, §4.8): ack 1 sentence, verdict_say 2, explain 2, support_ja 2, next.say 3 (recap part 5). The schema carries NO `maxLength`/`minLength` (structured outputs reject them); every object has `additionalProperties: false` and lists every key in `required`.
- Spec §4.2/§6: the engine never overrides a legal `next`; it refuses an illegal one with one retry, then speaks its own existing line for the first allowed kind. No prose validator (`transition_ask_off_part`, `transition_offer_missing`, `repeat_ask_after_two_tries`, `move_on_ignored`, `required_phrase_missing`, meta-narration kills) runs on a typed attempt.
- Spec anti-goals are acceptance criteria: no engine stock sentences beyond existing fallbacks; Japanese allowed in every field (`support_ja` is an extra slot, not the only one); time to first audio no worse than today (ack/verdict stream before `next` is known).
- Spec §4.5: verdict precheck and judge stay advisory on the typed path. Never a kill, never a card source.
- Live cost: bot run ≈ $3 / 20–25 min, pool `gdi-demo` 150/300 min at 03:45Z 11-04. Budget for the series ≈ $9–15. Unit tests first; no live runs before Task 9.
- **One deviation from the spec, flagged for Praveen:** spec §4.8 bullet 2 says the illegal-`next` retry is "a client re-POST". This plan does the retry as a second SDK call inside `streamBrainTurn` (Task 6). Splice semantics are unchanged (the already-emitted fields stand; only `next` is taken from the retry object). Reason: the server already holds the messages array and nothing in the retry depends on the client; a re-POST would re-enter the client validator-retry loop the typed path retires and add a round trip before `next` can be spoken.

## Review Focus

1. Haiku emits the keys in an order other than the schema's (e.g. `next` before `ack`) → speech must still come out in composition order, nothing lost. Pinned in Task 2 (reader emits in closure order; `orderedFields` buffers) and Task 5.
2. JSON string escapes inside values (`\"`, `\n`, `こ` Japanese escapes) → the spoken text is the unescaped string. Pinned in Task 2.
3. `stop_reason = max_tokens` or `refusal` with `next` unclosed → what was spoken stays, nothing is repeated, `next` falls back to the engine line, event `typed_turn_fallback reason=cut`. Pinned in Task 6.
4. The student says "stop" / "let's move on" / picks a menu number on the typed path → the engine-side mechanisms that act before the brain still shape the allowed set and the move happens via `next.kind=move`. Pinned in Task 3 (`studentMovedOn`, `menuPick`) and Task 8.
5. `next.say` is empty on a kind that needs words (`question`, `offer`, `retry`, `item`) → the engine's existing line, never silence. Pinned in Task 4 (`engineLineFor`) and Task 7.

---

### Task 1: Flag, wire types, schema, prompt block

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (append after line 1535, `TUTOR_LAST_ITEM_NOTE`)
- Create: `src/lib/tutor/voice/typed-turn.ts`
- Test: `scripts/test-typed-turn.ts`; register `"test:typed-turn": "npx tsx scripts/test-typed-turn.ts"` in `package.json` next to line 426 (`test:fixed-script`)

**Interfaces:**
- Produces (exports of `typed-turn.ts`):
```ts
export type TypedNextKind = 'retry' | 'question' | 'offer' | 'menu' | 'item' | 'move' | 'close' | 'wait';
export const TYPED_NEXT_KINDS: readonly TypedNextKind[];
export type TypedVerdict = 'correct' | 'partly_correct' | 'incorrect' | 'none';
export interface TypedCorrection { student: string; corrected: string; emphasis: string[]; explain: string }
export interface TypedNext { kind: TypedNextKind; say: string; item: string; level: '' | 'beginner' | 'intermediate' | 'advanced' }
export interface TypedTurn { ack: string; verdict: TypedVerdict; verdict_say: string; correction: TypedCorrection | null; support_ja: string; next: TypedNext }
export type TypedField = 'ack' | 'verdict' | 'verdict_say' | 'correction' | 'support_ja' | 'next';
export const TYPED_FIELD_ORDER: readonly TypedField[]; // ['ack','verdict','verdict_say','correction','support_ja','next']
/** What the client sends in the request body. `state` is the <turn_state …/> line (Task 3). */
export interface TypedTurnRequest { state: string; allowedNext: TypedNextKind[]; recap: boolean; nudge?: boolean }
export const TYPED_TURN_SCHEMA: Record<string, unknown>;          // JSON schema, additionalProperties:false everywhere, all keys required, enums for verdict/kind/level
export const TYPED_TURN_INSTRUCTIONS: string;                      // stable system-prompt tail (session block), see Step 3
export function typedTurnStateBlock(req: TypedTurnRequest): string; // the per-turn user-content block: `<typed_turn allowed_next="…" recap="yes|no" nudge="yes|no">\n${req.state}\n</typed_turn>`
export const TYPED_SAY_BUDGET = 3, TYPED_SAY_BUDGET_RECAP = 5, TYPED_ACK_BUDGET = 1, TYPED_VERDICT_SAY_BUDGET = 2;
export function truncateToSentences(text: string, max: number): string; // uses splitSentences from '@/lib/tutor/question-gist-text'; returns text unchanged when ≤ max
export function sentenceCount(text: string): number;
export function parseTypedTurn(json: string): TypedTurn | null;    // JSON.parse + shape check (every key, enums); null on any miss
```
- flags.ts: `export const TUTOR_TYPED_TURN = process.env.NEXT_PUBLIC_TUTOR_TYPED_TURN === 'on';` with a JSDoc that says "opt-in until the bot series is clean (plan Task 10 flips it to `!== 'off'`)".

- [ ] **Step 1: Write the failing test** `scripts/test-typed-turn.ts` (pattern: `test(name, fn)` helper + `strict as assert`, as in `scripts/test-menu-pick.ts`). Tests:
  - `TYPED_TURN_SCHEMA` walk: every object node has `additionalProperties === false` and `required` equal to its property keys; no node has `maxLength`/`minLength`; `properties.verdict.enum` deep-equals `['correct','partly_correct','incorrect','none']`; `properties.next.properties.kind.enum` deep-equals `TYPED_NEXT_KINDS`; `properties.correction.anyOf` has an object branch and `{type:'null'}`.
  - `parseTypedTurn` accepts a full valid object (with `correction: null`) and returns it; returns null for `verdict: 'ok'`, for a missing `next.say`, for `next.kind: 'ask'`.
  - `truncateToSentences('A. B. C.', 2) === 'A. B.'`; unchanged when within budget; `sentenceCount('こんにちは。元気ですか？') === 2`.
  - `typedTurnStateBlock({state:'<turn_state part="x"/>', allowedNext:['retry','question'], recap:false})` matches `/allowed_next="retry,question"/` and `/recap="no"/` and contains the state line.
  - `TYPED_TURN_INSTRUCTIONS` contains each of: `"ack"`, `"verdict_say"`, `"support_ja"`, `"next"`, `allowed_next`, the word `none` (verdict rule), `Japanese`, and does NOT contain `show_sentence` or `advance_lesson` (no tools on this path).
  - flags pin: `readFileSync('src/lib/tutor/orchestrator/flags.ts')` matches `/export const TUTOR_TYPED_TURN = process\.env\.NEXT_PUBLIC_TUTOR_TYPED_TURN === 'on';/`.
- [ ] **Step 2: Run** `npx tsx scripts/test-typed-turn.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** `typed-turn.ts` and the flag. `TYPED_TURN_INSTRUCTIONS` must state, in the brain's voice-tutor register (reuse the persona rules by reference, not by copy): the object shape and the meaning of every field; composition order (the engine speaks fields in this order, so write them to be heard in this order); budgets per field (ack 1 / verdict_say 2 / explain 2 / support_ja 2 / next.say 3, recap 5); `verdict = none` whenever the reply is not an answer to the open ask (a question to the tutor, an aside, a Japanese-only reply); `correction` only when the student's sentence is wrong, `student` verbatim, `corrected` the full model sentence, `emphasis` the changed words; Japanese allowed in any field under the lesson's teaching-language rules, `support_ja` an extra slot; `next.kind` MUST be one of `allowed_next`; the meaning of each kind (retry = ask for the same sentence once more; question = a new question on this part; offer = the one-more-or-move-on proposal; menu = read the part's choice menu; item = the next pronunciation sentence from the plan, `next.item` verbatim; move = one bridge sentence then the next part's first ask or menu, ≤ 3 sentences; close = the farewell after the summary; wait = nothing asked, the student is reading); `next.level` only on the level-check close; no tool markup, no stage directions, no "[note]" citations. One worked example object (a correction turn) and one `verdict: none` example.
- [ ] **Step 4: Run** the test → PASS. `npx tsc --noEmit -p tsconfig.json` clean.
- [ ] **Step 5: Commit** `git add src/lib/tutor/voice/typed-turn.ts src/lib/tutor/orchestrator/flags.ts scripts/test-typed-turn.ts package.json && git commit -m "tutor(typed-turn): flag, schema, wire types, prompt block (opt-in)"`

### Task 2: Incremental field reader

**Files:**
- Modify: `src/lib/tutor/voice/typed-turn.ts`
- Test: `scripts/test-typed-turn.ts` (append)

**Interfaces:**
- Produces:
```ts
export type TypedFieldValue =
  | { field: 'ack' | 'verdict_say' | 'support_ja'; value: string }
  | { field: 'verdict'; value: TypedVerdict }
  | { field: 'correction'; value: TypedCorrection | null }
  | { field: 'next'; value: TypedNext };
export class TypedTurnReader {
  /** Feed a text delta; returns the top-level fields whose values closed in this delta, in CLOSURE order. */
  push(delta: string): TypedFieldValue[];
  /** Fields closed so far, keyed by name. */
  readonly closed: Partial<Record<TypedField, TypedFieldValue>>;
  /** True once the top-level object's closing brace was seen. */
  readonly complete: boolean;
  readonly text: string; // everything pushed so far
}
/** Reorders closure-order events into TYPED_FIELD_ORDER: holds a field until every earlier field is closed. Stateful; one per stream. */
export class OrderedFieldEmitter { push(ev: TypedFieldValue): TypedFieldValue[]; flush(): TypedFieldValue[] /* whatever is still held, in order */ }
```
- Reader algorithm (the signature does not determine it): a JSON tokenizer state machine over the accumulated text tracking string/escape state and brace depth; at depth 1 a key string followed by `:` names the current top-level field; the field closes when, at depth 1, its value ends (closing `"` of a string outside escape, `}` of a nested object, or the literal `null`/`true`/`false` followed by `,` or `}`). The closed value's substring is parsed with `JSON.parse` (so escapes are handled). A nested object (`correction`, `next`) is only emitted whole.

- [ ] **Step 1: Write the failing tests** (append to `scripts/test-typed-turn.ts`):
  - Feed a full valid object in 1-character deltas; collect every pushed event; assert fields arrive in order ack, verdict, verdict_say, correction, support_ja, next, with `ack.value === 'Thanks, Praveen.'`, `correction.value.emphasis` deep-equals `['presentations']`, `next.value.kind === 'question'`; `reader.complete === true` after the last delta; `parseTypedTurn(reader.text)` is non-null.
  - Escapes: `verdict_say: "She said \"yes\".\nGood."` → value contains a literal quote and a newline; `support_ja: "こんにちは。"` → `'こんにちは。'`.
  - Out-of-order keys: object written with `next` first then `ack` → reader emits `next` first; `OrderedFieldEmitter` emits nothing until `ack` closes, then emits ack … and `next` last; `flush()` after a truncated object returns the held fields in order.
  - Truncation: feed `{"ack":"Hi.","verdict":"correct","verdict_say":"Yes.","correction":null,"support_ja":"","next":{"kind":"question","say":"Wha` → `closed.next` undefined, `complete === false`.
  - Whitespace/pretty-printed JSON (newlines and spaces between tokens) → same events as compact.
  - A string value containing `{` or `}` or `:` characters does not change depth or fields.
- [ ] **Step 2: Run** → FAIL (TypedTurnReader not exported).
- [ ] **Step 3: Implement** `TypedTurnReader` and `OrderedFieldEmitter` in `typed-turn.ts`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): incremental field reader + ordered emitter"`

### Task 3: Allowed sets and the turn_state block

**Files:**
- Create: `src/lib/tutor/lesson-plan/typed-turn-rules.ts`
- Test: `scripts/test-typed-turn-rules.ts`; register `"test:typed-turn-rules"` in `package.json`

**Interfaces:**
- Consumes from `fixed-script.ts`: `segmentTransitionKind(plan, segId)`, `fixedScriptLastSegmentId(plan)`, `fixedScriptPartLabel(plan, segId)`, `segmentMaxTurns(plan, segId)`, `needsLevelCaptureLead(plan, segId, levelKnown)`; from `sentence-board.ts`: `boardOffersChoices(problem)`; from `types.ts`: `LessonPlan`, `Segment`.
- Produces:
```ts
export type TypedPartKind = 'level_check' | 'bridge' | 'offer_part' | 'conversation' | 'menu' | 'pronunciation' | 'recap' | 'plain';
export function typedPartKind(plan: LessonPlan, segId: string, levelKnown: boolean): TypedPartKind;
  // level_check = segment.metadata.skipWhenLevelKnown; bridge = transition.kind 'bridge'; offer_part = transition.kind 'offer';
  // menu = boardOffersChoices(segment card) && !metadata.pronunciation; pronunciation = metadata.pronunciation present (menu until picked, then items);
  // recap = segment.kind === 'recap'; conversation = segment.kind === 'extension'; else plain
export interface TypedTurnState {
  openAsk: { kind: 'retry' | 'question' | 'offer' | 'menu' | 'item' | 'none'; text: string; cardQuestion?: string } ;
  correctionOpen: { student: string; corrected: string } | null;
  practisedItems: Record<string, string[]>;       // segId → item texts spoken
  offerState: Record<string, { made: boolean; accepted: boolean; served: boolean }>;
  menuState: Record<string, { asked: number; picked: string | null }>;
  answeredCards: Record<string, string[]>;         // segId → card statements answered
  lastItemAnnounced: Record<string, boolean>;
  turnsInPart: Record<string, number>;             // typed turns spoken per segId
  retriesInARow: number;                            // consecutive next.kind=retry on the same open ask
  pendingVerdict: TypedVerdict | null;              // this turn's `verdict` field once it closed (Task 4 applyField); null between turns
}
export function createTypedTurnState(): TypedTurnState;
export interface AllowedNextContext {
  plan: LessonPlan; segId: string; levelKnown: boolean; state: TypedTurnState;
  budgetDue: boolean;          // fixedScriptAutoAdvanceReason(...) !== null, computed by the caller
  lastPart: boolean;           // segId === fixedScriptLastSegmentId(plan)
  studentMovedOn: boolean;     // moveOnRequestSpan(transcript) hit, or a stop/finish decision resolved to 'finish'
  menuPick: string | null;     // resolveMenuPick result this turn, if any
  studentAnswerCount: number;  // answers given in this part so far (level check: the third answer closes it)
  nudge: boolean;              // this turn is the idle nudge
  items: readonly string[];    // pronunciation sentences listed in the plan for this part ([] elsewhere)
}
export function allowedNextFor(ctx: AllowedNextContext): TypedNextKind[];
export function turnStateLine(ctx: AllowedNextContext): string;  // `<turn_state part="…" label="…" turn="n/max" open_ask="kind" open_ask_text="…" offer_made="yes|no" offer_accepted="…" menu_picked="…|none" items_practised="a|b" items_left="c|d" last_item="yes|no" budget_due="yes|no" correction_open="yes|no" level_known="yes|no"/>` — attribute values escaped for XML; the brain reads it, the schema does not.
export function typedTurnRequestFor(ctx: AllowedNextContext): TypedTurnRequest; // { state: turnStateLine(ctx), allowedNext: allowedNextFor(ctx), recap: typedPartKind(...)==='recap', nudge: ctx.nudge }
```
- Allowed-set table (spec §4.2, made total — every state yields a non-empty set; `retry` here means "ask the same thing once more"):

| state | allowed |
|---|---|
| nudge turn | `[openAsk.kind === 'none' ? 'question' : openAsk.kind, 'wait']` |
| studentMovedOn && !lastPart | `['move']`; lastPart → `['close']` |
| level_check: studentAnswerCount < 3 | `['question','retry']`; `>= 3` → `['move']` (the move turn carries `next.level`) |
| menu / pronunciation, no pick yet, asked < 2 | `['menu']`; asked ≥ 2 → `['move']` |
| pronunciation, picked, items left | `['item','retry','offer','move']` minus `retry` when `openAsk.kind !== 'item'`; items exhausted → `['offer','move']` |
| offer_part, budgetDue, !offer.made | `['offer']` |
| offer_part, offer.made && !accepted, openAsk.kind==='offer' | `['move','question']` (the student's reply decides; `question` = served item once → sets accepted/served) |
| offer_part, accepted && !served | `['question']` |
| offer_part, accepted && served, budgetDue | `['move']` |
| openAsk.kind==='retry' | `retriesInARow >= 2 ? ['question', ...(budgetDue?['move']:[])] : ['retry','question', ...(budgetDue?['move']:[])]` |
| recap | `['question','close']`; after the contrast question was asked (turnsInPart ≥ 1) → `['close','question']` (close first) |
| budgetDue, openAsk.kind==='none' | `['move']` (lastPart → `['close']`) |
| budgetDue, open ask pending (not retry) | `['question','move']` (the reply decides; spec R1: a move on the reply turn) |
| otherwise | `['question','retry']` (retry only when `openAsk.kind !== 'none'`) |

- [ ] **Step 1: Write the failing tests** `scripts/test-typed-turn-rules.ts`. Load the GDI plan from `docs/whitelabel/gdi/plans/gdi-work-projects-v1.json` the way `scripts/test-gdi-work-projects.ts:24` does. Tests (`assert.deepEqual` on sorted arrays):
  - `typedPartKind` for each of the 8 segments: overview→plain, level-check→level_check, topic-intro→bridge, present-perfect→offer_part, past-simple→offer_part, open-conversation→conversation, pronunciation→pronunciation, summary→recap.
  - Level check: fresh state, answers 0 → `['question','retry']`; answers 3 → `['move']`; `levelKnown: true` on `level-check` is never asked (the caller skips it) — assert `allowedNextFor` on topic-intro with levelKnown true is `['question','retry']`… and the turnStateLine contains `level_known="yes"`.
  - Offer part: budgetDue, offer not made → `['offer']`; offer made, openAsk offer → `['move','question']`; accepted not served → `['question']`; accepted+served+budgetDue → `['move']`.
  - Retry chain: openAsk retry, retriesInARow 0 → includes `retry`; 2 → excludes `retry`; with budgetDue → includes `move`.
  - Menu: pronunciation part, no pick, asked 0 → `['menu']`; asked 2 → `['move']`; picked, items `['a','b']`, practised `['a']` → includes `item`; practised both → `['offer','move']`.
  - Student moved on in past-simple → `['move']`; in summary → `['close']`.
  - Nudge with openAsk question → `['question','wait']`.
  - Recap fresh → `['question','close']`; turnsInPart 1 → `['close','question']`.
  - `turnStateLine` escapes `"` and `<` in `open_ask_text`, lists `items_left` as the plan's sentences minus practised, and `turn="3/8"` for present-perfect with turnsInPart 3.
- [ ] **Step 2: Run** `npx tsx scripts/test-typed-turn-rules.ts` → FAIL.
- [ ] **Step 3: Implement** `typed-turn-rules.ts` (pure; no React, no VTR imports).
- [ ] **Step 4: Run** → PASS; tsc clean.
- [ ] **Step 5: Commit** `git add src/lib/tutor/lesson-plan/typed-turn-rules.ts scripts/test-typed-turn-rules.ts package.json && git commit -m "tutor(typed-turn): allowed-next table + turn_state line (pure, tested on the GDI plan)"`

### Task 4: Field effects and the state reducer

**Files:**
- Modify: `src/lib/tutor/lesson-plan/typed-turn-rules.ts`
- Test: `scripts/test-typed-turn-rules.ts` (append)

**Interfaces:**
- Consumes: `cardableStudentSentence(raw)` from `src/lib/tutor/voice/sentence-board.ts:468`; `nextSegmentId(plan, fromId, levelKnown)`, `fixedScriptEngineOfferLines(plan, from, next, {japanese})`, `fixedScriptBridgeClause` from `fixed-script.ts`; `cardAskLine(card)` from `src/lib/tutor/lesson-plan/transition-ask.ts:146`.
- Produces:
```ts
export type TypedEffect =
  | { kind: 'model_card'; sentence: string }                                        // student's correct sentence, cleaned
  | { kind: 'correction_card'; student: string; corrected: string; emphasis: string[] }
  | { kind: 'advance'; from: string; to: string; bridgeMissing: boolean }           // bridgeMissing = from is a bridge part and next.say carries no bridge sentence (advisory only, logged)
  | { kind: 'arm_item'; text: string }
  | { kind: 'set_level'; level: 'beginner' | 'intermediate' | 'advanced' }
  | { kind: 'close' }
  | { kind: 'menu_asked' } | { kind: 'offer_made' } | { kind: 'offer_served' }
  | { kind: 'open_ask'; ask: TypedTurnState['openAsk'] };
export interface FieldEffectContext { plan: LessonPlan; segId: string; levelKnown: boolean; state: TypedTurnState; studentLast: string; cardStatement: string | null; items: readonly string[] }
/** Effects to run when one field closes (cards anchor to the sentence about to be spoken). Pure. */
export function effectsForField(ev: TypedFieldValue, ctx: FieldEffectContext): TypedEffect[];
/** The state after the whole turn was spoken. Pure. */
export function applyTypedTurn(state: TypedTurnState, turn: TypedTurn, ctx: FieldEffectContext, moved: { from: string; to: string } | null): TypedTurnState;
/** The engine's own line for a refused / missing `next` (spec §4.2 second failure, §4.6). Returns null for 'wait' and 'close' (close runs the forced-close path). */
export function engineLineFor(kind: TypedNextKind, ctx: FieldEffectContext & { japanese: boolean }): string | null;
  // retry → state.openAsk.text ; question → cardAskLine(card) ; menu → cardStatement ; offer → fixedScriptEngineOfferLines(...).join(' ') ; item → the first unpractised item text ; move → cardAskLine of the NEXT part's card (the caller advances first)
export function nextItemFor(ctx: FieldEffectContext): string | null;   // first plan item not in practisedItems[segId]
export function sayWithinBudget(next: TypedNext, recap: boolean): boolean;
```
- Rules for `effectsForField`:
  - `verdict_say` with `state.pendingVerdict === 'correct'` (the reader emitted `verdict` before `verdict_say`; keep the verdict in `ctx.state` via `applyField`, see below) and `cardableStudentSentence(ctx.studentLast)` non-null → `model_card`. Never from the precheck.
  - `correction` non-null → `correction_card` (the card replaces a model card of `correction.student` on the same page: the executor passes `correctionCard: true`, which already does this in VTR).
  - `next`: `item` → `arm_item` (if `next.item` is in the plan list and not practised; else substitute `nextItemFor`); `move` → `advance` with `to = nextSegmentId(plan, segId, levelKnown)` (null → `close` instead) and `bridgeMissing = fixedScriptBridgeClause(plan, from, to) !== '' && !/\b(learned|told me|you said|about you)\b|について/i.test(next.say)`; `level` present → `set_level` first; `menu` → `menu_asked`; `offer` → `offer_made`; `question` on an accepted-not-served offer → `offer_served`; `close` → `close`; every kind except `wait`/`close` → `open_ask` with `{kind, text: next.say, cardQuestion: cardStatement when kind==='question' && say mentions the card's question words}`; `wait` → `open_ask` unchanged.
- Because `verdict` closes before `verdict_say`, add `export function applyField(state: TypedTurnState, ev: TypedFieldValue): TypedTurnState` that records `pendingVerdict` (field declared in Task 3's interface) — the VTR executor calls `applyField` then `effectsForField` per event.

- [ ] **Step 1: Write the failing tests** (append):
  - `applyField` on `{field:'verdict', value:'correct'}` sets `pendingVerdict`; then `effectsForField` on `verdict_say` with studentLast `"yes, I have worked here for five years"` → one `model_card` with the cleaned sentence; verdict `none` → no card; verdict correct but studentLast `"yes"` → no card. `applyTypedTurn` resets `pendingVerdict` to null.
  - correction field → `correction_card` with emphasis `['presentations']`.
  - next move from present-perfect → `advance {from:'present-perfect', to:'past-simple', bridgeMissing:false}`; from topic-intro (bridge) with say `"Let's practise the present perfect. Have you worked here long?"` → `bridgeMissing: true`; with say containing "You told me you work in sales" → false. From summary → `close`.
  - next item `"I was responsible for communicating with our customers."` not practised → `arm_item` with that text; already practised → `arm_item` with the other listed item; both practised → no `arm_item` and an `open_ask` of kind `item`.
  - next move with level `'intermediate'` on level-check → `[set_level, advance, open_ask]` in that order.
  - `applyTypedTurn`: after a move, `turnsInPart[to] === 0` and `openAsk` from `next.say`; after an item, `practisedItems[segId]` includes it; after retry, `retriesInARow` increments; after any non-retry, resets to 0; after `menu`, `menuState[seg].asked === 1`; after offer, `offerState[seg].made === true`; after a question on an accepted offer, `served === true`; after `verdict: correct` with `openAsk.cardQuestion` set, `answeredCards[seg]` includes it.
  - `engineLineFor('offer', …)` equals the English engine offer line for present-perfect→past-simple; `('question', …)` equals `cardAskLine(card)`; `('wait', …)` and `('close', …)` are null; `('item', …)` is the first unpractised item.
  - `sayWithinBudget({say: 'A. B. C. D.'}, false) === false`; `(…, true) === true`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** in `typed-turn-rules.ts`.
- [ ] **Step 4: Run** → PASS; tsc clean.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): field effects, state reducer, engine fallback lines"`

### Task 5: Server typed branch — schema request, field events, no tools

**Files:**
- Modify: `src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput` ~260–616, `BrainStreamEvent` ~732–837, params lambda ~2987–2998, per-turn blocks ~2909–2943, text-delta handling ~3077–3086, `content_block_stop` ~3090–3184)
- Modify: `src/app/api/tutor/brain/stream/route.ts` (`BrainStreamRequestBody` ~93–253; `turnInput` ~973–1114; tools ~740–847)
- Test: `scripts/test-typed-turn-brain.ts`; register `"test:typed-turn-brain"`

**Interfaces:**
- Consumes: Task 1 (`TYPED_TURN_SCHEMA`, `TYPED_TURN_INSTRUCTIONS`, `typedTurnStateBlock`, `truncateToSentences`, budgets, `parseTypedTurn`), Task 2 (`TypedTurnReader`, `OrderedFieldEmitter`).
- Produces:
```ts
// BrainTurnInput gains:
typedTurn?: TypedTurnRequest;
// BrainStreamEvent gains:
| { type: 'typed-field'; field: TypedField; value: TypedFieldValue['value']; retried?: boolean }
| { type: 'typed-turn'; turn: TypedTurn | null; retries: number; nextFallback?: TypedNextKind; retryReason?: 'illegal_kind' | 'say_over_budget' }
| { type: 'typed-turn-fallback'; reason: 'format_rejected' | 'provider' | 'cut' | 'unparseable' }
// route body gains: typedTurn?: TypedTurnRequest  (passed straight through to turnInput)
```
- Behaviour when `input.typedTurn` is present (`typed = true`):
  - Params lambda: `tools` omitted; `output_config = { ...(thinking ? { effort } : {}), format: { type: 'json_schema', schema: TYPED_TURN_SCHEMA } }`. If `target` is not a native Anthropic provider (`stripAnthropicOnlyParams` would drop `output_config`), emit `typed-turn-fallback reason=provider` and run the prose path for this turn.
  - System: `buildSystemBlocks(input.systemPrompt + '\n\n' + TYPED_TURN_INSTRUCTIONS, input.systemPromptCore)` (the tail block; the core stays byte-identical).
  - Per-turn blocks: skip `turn_shape`, work-then-match and `verdict_guard` blocks; keep `<answer_check>` (text mode) with one appended line `(advisory: your own "verdict" field decides)`; append `typedTurnStateBlock(input.typedTurn)` immediately before `<student_said>`.
  - Stream: on `text_delta` → `reader.push(delta)` → `ordered.push(ev)` → for each emitted field: apply budgets (`ack` → `truncateToSentences(v, 1)`, `verdict_say` → 2, `correction.explain` → 2, `support_ja` → 2), yield `{type:'typed-field', field, value}`; then for speech fields (`ack`, `verdict_say`, `correction` → its `explain`, `support_ja`, `next` → its `say`) push the text through a fresh `SentenceBuffer` (scrub + boundary, NOT `guardedSentence`) and yield each `{type:'sentence', text}` plus `flush()`. `verdict` and `correction` yield only the `typed-field` event (plus explain sentences for correction).
  - `next` is held by the emitter until it closes whole; Task 6 adds the legality gate before it is yielded. In this task: yield it when allowed, else yield `typed-turn` with `nextFallback = allowedNext[0]` and no `next` sentences.
  - On `content_block_stop` of the text block: `parseTypedTurn(reader.text)` → yield `{type:'typed-turn', turn, retries: 0}` (null turn → `typed-turn-fallback reason=unparseable` first). Skip the prose `heldTail` / tool handling on typed. `done` as today.
  - Thinking re-issue paths (unasked / deadline / starved / empty-cap) keep working because they call the same params lambda; add nothing there except a fresh reader per SDK call.
- Route: add `typedTurn` to the body interface and copy it to `turnInput` with a shape check (`Array.isArray(allowedNext) && allowedNext.every(k => TYPED_NEXT_KINDS.includes(k)) && typeof state === 'string'`), else drop it and log `typed_turn_body_rejected`.

- [ ] **Step 1: Write the failing test** `scripts/test-typed-turn-brain.ts`, built like `scripts/test-text-thinking.ts` (fake `getModelClient` returning a scripted `messages.stream`; capture the params the fake receives). Scripts and assertions:
  - A full typed object streamed as `text_delta` in 3 chunks, `stop_reason end_turn`. Assert: the captured params have no `tools` key, `output_config.format.type === 'json_schema'`, `system` tail contains `TYPED_TURN_INSTRUCTIONS`; the last user message contains `<typed_turn allowed_next="retry,question"` and ends with `<student_said>`; it does NOT contain `<turn_shape`. Event sequence (types only, filtered to typed/sentence/typed-turn): `typed-field ack`, `sentence`, `typed-field verdict`, `typed-field verdict_say`, `sentence`, `typed-field correction`, `sentence` (explain), `typed-field support_ja`, `sentence`, `typed-field next`, `sentence`, `typed-turn`, `done`. The `typed-turn` event's `turn.next.kind === 'question'`.
  - Same with pretty-printed JSON and the keys in a scrambled order → identical sequence.
  - `ack` of three sentences → the `typed-field ack` value and the sentences are the first sentence only.
  - `next.kind: 'offer'` with `allowedNext: ['retry','question']` → no `next` sentences, `typed-turn.nextFallback === 'retry'` (Task 6 replaces this expectation with the retry).
  - Prose input (no `typedTurn`) → captured params still have `tools` and no `format` (regression pin).
  - Route pin: `readFileSync(route)` matches `/typedTurn\?: TypedTurnRequest/` and `/TYPED_NEXT_KINDS/`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** in `claude-brain.ts` and the route.
- [ ] **Step 4: Run** the new test, then `npx tsx scripts/test-text-thinking.ts` and `npm run test:changed` → PASS (baseline failures only); tsc clean.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): server branch — structured output, no tools, typed-field events, route passthrough"`

### Task 6: Server retry, over-budget regeneration, fallbacks

**Files:**
- Modify: `src/lib/tutor/voice/claude-brain.ts`, `src/lib/tutor/voice/typed-turn.ts`
- Test: `scripts/test-typed-turn-brain.ts` (append), `scripts/test-typed-turn.ts` (append)

**Interfaces:**
- Produces in `typed-turn.ts`:
```ts
export function typedTurnRetryMessage(input: { reason: 'illegal_kind' | 'say_over_budget'; refused: TypedNext; allowedNext: TypedNextKind[]; alreadySaid: Pick<TypedTurn,'ack'|'verdict'|'verdict_say'|'correction'|'support_ja'>; budget: number }): string;
  // '[typed turn retry — not from the student] …' : names the refused kind, the allowed set, says the listed fields were ALREADY SPOKEN and must be returned unchanged, and that only `next` is read from this reply.
export function isStructuredOutputRejection(err: unknown): boolean; // move the predicate from src/lib/tutor/portal/grade-free-response.ts:247 here and re-export it there
```
- Behaviour (spec §4.2, §4.6, §4.8):
  - Illegal `next.kind` (not in `allowedNext`) or `!sayWithinBudget(next, recap)` → do NOT yield `next`; after the first object completes, open a second SDK call with the same params and `messages + [assistant: reader.text, user: typedTurnRetryMessage(...)]`; read its object whole (same reader); take only `next`. Legal → yield `typed-field next` with `retried: true`, then its sentences; `typed-turn` carries `retries: 1, retryReason`. Still illegal/over budget → `typed-turn` with `nextFallback = allowedNext[0]` (over budget on the retry: speak it as is, spec §4.8). A retry object whose `verdict`/`correction` differ is ignored and logged via `typed-turn.retryDisagreed: true` (add the optional field).
  - One retry per turn, max.
  - 400 with `isStructuredOutputRejection(err)` before any event → `typed-turn-fallback reason=format_rejected`, then the prose path for this turn (re-enter the existing loop with `typed = false`, tools on).
  - `stop_reason` `max_tokens` or `refusal` with `reader.complete === false` → `typed-turn-fallback reason=cut` and `typed-turn { turn: null, nextFallback: allowedNext[0] }`; already-yielded fields are never re-yielded; no second call.
- [ ] **Step 1: Write the failing tests:**
  - `typedTurnRetryMessage` contains `refused "offer"`, `allowed: retry, question`, `ALREADY SPOKEN`, and the ack text.
  - Brain: first object `next.kind offer` (illegal), second scripted call returns `next.kind question` → events include exactly one `typed-field next` with `retried: true`, sentences of the retry's say, `typed-turn.retries === 1`; the second call's messages end with `[assistant JSON, user retry message]`; `ack` sentences appear once.
  - Both illegal → no `next` sentences; `typed-turn.nextFallback === 'retry'`; `retries === 1`.
  - `next.say` of 4 sentences on a non-recap part → retry; 4 sentences on `recap: true` → no retry.
  - First call rejects with `{status: 400, message: 'output_config.format is not supported'}` → `typed-turn-fallback format_rejected`, then the second (prose) call's params have `tools` and no `format`, and `sentence` events from the prose text.
  - Truncated object + `max_tokens` → `typed-turn-fallback cut`, `typed-turn.turn === null`, `nextFallback` set, the spoken `ack` not repeated, no second call.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** typed tests + `npx tsx scripts/test-grade-free-response*.ts` if present (the moved predicate) + `npm run test:changed` → PASS; tsc clean.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): illegal-next server retry (splice), say budget regen, format/cut fallbacks"`

### Task 7: Client — request, state, field events, effect executor

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`: imports (~13–451), refs near `pronunciationPractisedRef` (1642), `callBrainOnce` attempt setup (~14723–15100), request `input` (15046), event dispatch chain (16387 `'sentence'`, 20041–20051 before `'done'`), post-turn blocks (23081 `transitionAnchor`, 23085 authored card, 23127 sentence board)
- Modify: `src/app/tutor-portal/embed/page.tsx:73` (`EMBED_DEBUG_EVENT_PREFIXES` += `'typed_turn'`)
- Test: `scripts/test-typed-turn-client-pins.ts`; register `"test:typed-turn-client-pins"`

**Interfaces:**
- Consumes: Task 3 (`createTypedTurnState`, `allowedNextFor`, `typedTurnRequestFor`, `typedPartKind`), Task 4 (`applyField`, `effectsForField`, `applyTypedTurn`, `engineLineFor`, `nextItemFor`), Task 5 events. VTR internals by name: `handleWhiteboardCommand(commands, opts)` (6950), `applyResolvedAdvance(plan, from, next)` (6107), `armPronunciationCheckRef.current(text, kind)` (1691), `mapFunctionCallToCommand('close_session_notes', {})` / `('set_working_level', { level })` (toolDefinitions.ts 3151 / 3132), `speakOnePart(s)` (15655), `turnNarrationRef` (2689), `attemptNarrationStartRef` (1640), `onDebugEvent` (968), `currentSegmentIdRef`, `lessonPlanRef`, `turnsInSegmentRef`, `fixedScriptAutoAdvanceReason` call inputs (22467), `pronunciationPractisedRef` (1642), `transitionOfferMadeRef`/`transitionOfferSpokenRef` (4282/4289), `menuAskCountRef`/`menuPickedSegsRef` (4298/4299), `answeredInPartRef` (5419), `lessonClosedRef` (3683), `segmentCardStatement(plan, segId)` (691), `resolveMenuPick` pre-turn (14130), `moveOnRequestSpan`.
- Produces (inside VTR):
```ts
const typedTurnStateRef = useRef<TypedTurnState>(createTypedTurnState());
// per attempt, inside callBrainOnce:
const typedTurnActive = TUTOR_TYPED_TURN && isFixedScriptPlan(lessonPlanRef.current) && !opts?.prefetchOnly && !openingTurnPendingRef.current;
const typedReq: TypedTurnRequest | undefined = typedTurnActive ? typedTurnRequestFor(buildAllowedNextContext()) : undefined; // sent as input.typedTurn
let typedFieldAnchor: { field: TypedField; narrationIndex: number } | null;   // set on each typed-field event: narrationIndex = turnNarrationRef.current.length - attemptNarrationStartRef.current
let typedMoved: { from: string; to: string } | null = null;
const runTypedEffect = async (e: TypedEffect, anchorSentence: number): Promise<void>;
```
- `buildAllowedNextContext()` fills `AllowedNextContext` from refs: `budgetDue = fixedScriptAutoAdvanceReason({...same inputs as line 22467...}) !== null`, `studentMovedOn = !!moveOnRequestSpan(transcript) || stopDecision === 'finish'`, `menuPick` from the pre-turn `resolveMenuPick` result, `items = segment.metadata.pronunciation?.sentences ?? []`, `levelKnown` as the existing code computes it for `nextSegmentId`, `nudge = opts?.silent && transcript is the idle-nudge directive`.
- `runTypedEffect` mapping (anchor = `typedFieldAnchor.narrationIndex`):
  - `model_card` → `handleWhiteboardCommand([{action:'showSentence', sentence}], { anchorSentence, sentenceBoardAuto: true, studentSentenceCard: true, holdDeferredPage: true })`
  - `correction_card` → `[{action:'showSentence', sentence: corrected, emphasis}]` with `{ anchorSentence, sentenceBoardAuto: true, correctionCard: true, holdDeferredPage: true }` (emphasisAt as `dispatchBoardCard` computes it today — reuse that helper or lift it)
  - `advance` → `applyResolvedAdvance(plan, from, to)`; then the authored card of `to` exactly as `runSegmentCard` does at 23085 but with `{ anchorSentence, pageBreakOnTransition: true }` (the page break anchors to the first `next.say` sentence); `typedMoved = {from,to}`; if `bridgeMissing` → log `typed_turn_bridge_missing` only (no engine speech: the bridge clause is a brain instruction, and the anti-goal forbids stock sentences). Record `onDebugEvent('typed_turn_effect', 'advance from→to')`.
  - `arm_item` → `armPronunciationCheckRef.current(text, 'typed')` + the model card `{action:'showSentence', sentence: text}` with `{ anchorSentence, sentenceBoardAuto: true, pronunciationModel: true }`
  - `set_level` → `handleWhiteboardCommand([mapFunctionCallToCommand('set_working_level', { level })])`
  - `close` → `handleWhiteboardCommand([mapFunctionCallToCommand('close_session_notes', {})])`
  - `menu_asked` → `menuAskCountRef` +1 for the part; `offer_made` → `transitionOfferMadeRef.add`, `transitionOfferSpokenRef.add`, `transitionOfferSpokenAtRef.set(now)`; `offer_served` → `offerAcceptedRef` served marker; `open_ask` → `typedTurnStateRef.current.openAsk` (the reducer also sets it; the executor mirrors it into `recentTutorTurnsRef`-independent state only).
- Event handling in the dispatch chain (add before `'done'`):
  - `typed-field` → `typedFieldAnchor = {...}`; `typedTurnStateRef.current = applyField(state, ev)`; `for (const e of effectsForField(ev, ctx)) await runTypedEffect(e, anchor)`; `onDebugEvent('typed_turn_field', \`${field}${retried ? ' retried' : ''}\`)`.
  - `typed-turn` → if `turn` non-null: `typedTurnStateRef.current = applyTypedTurn(state, turn, ctx, typedMoved)`; `onDebugEvent('typed_turn', \`verdict=${turn.verdict} next=${turn.next.kind} ack=${sentenceCount(turn.ack)} say=${sentenceCount(turn.next.say)} correction=${turn.correction ? 'yes' : 'no'} retries=${retries}${retryReason ? ' reason=' + retryReason : ''}\`)`. If `nextFallback`: `const line = engineLineFor(nextFallback, …)`; for `move` first run the `advance` effect for `nextSegmentId`; `close` → the existing forced-close path (`fixedScriptCloseForcedAction` branch, 22742); otherwise `speakOnePart(line)` when non-null and set `openAsk`; `onDebugEvent('typed_turn_fallback', \`next=${nextFallback} spoken=${!!line}\`)`.
  - `typed-turn-fallback` → `onDebugEvent('typed_turn_fallback', \`reason=${reason}\`)`; on `format_rejected`/`provider` set `typedTurnActive = false` for the rest of the attempt so the prose post-turn blocks run.
  - `sentence` → unchanged path (the speech queue, captions, chat bubble). The validators that would `continue` (drop) a sentence stay for now; Task 8 bypasses them.
- Post-turn: when `typedTurnActive` is still true at turn end, skip the sentence-board planner block (23127), the authored-card auto block (23085) and `transitionAnchor` (23081) — cards came from fields. The `turnsInSegmentRef` increment stays. Reset `typedTurnStateRef` when a new lesson plan loads (where `pronunciationPractisedRef` is reset).
- Idle nudge on typed: before `callBrainOnce` for the nudge directive, `speakOnePart('Take your time.')` is NOT added (anti-goal: stock sentences); the prompt's nudge handling (`nudge="yes"` → the brain's `ack` carries the patience) covers it. Log `typed_turn_nudge`.

- [ ] **Step 1: Write the failing pins test** `scripts/test-typed-turn-client-pins.ts` (structural pins on VTR + embed source, as `scripts/test-menu-pick.ts` does): VTR contains `typedTurnRequestFor(`, `typedTurn: typedReq`, `ev.type === 'typed-field'`, `ev.type === 'typed-turn'`, `ev.type === 'typed-turn-fallback'`, `effectsForField(`, `applyTypedTurn(`, `engineLineFor(`, `onDebugEvent?.('typed_turn',`, `onDebugEvent?.('typed_turn_fallback',`, `pageBreakOnTransition: true` within 40 lines after `kind === 'advance'` (regex with `[\s\S]{0,2000}`), `correctionCard: true` after `'correction_card'`, `pronunciationModel: true` after `'arm_item'`; the three post-turn blocks are guarded: regex `/if \(!typedTurnActive[^)]*\)[\s\S]{0,400}planSentenceBoard\(/`, same for `segmentNeedsAutoCard(` and `transitionSentenceIndex(`; embed page: `'typed_turn'` inside `EMBED_DEBUG_EVENT_PREFIXES`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** in VTR and the embed page. Keep every addition inside `if (typedTurnActive)` or the new event branches; do not touch the prose branches' bodies.
- [ ] **Step 4: Run** the pins test, `npm run test:changed` (VTR is cross-cutting: it advises `test:all`; run `npm run test:all` once here) → PASS (baseline failures only); tsc clean.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): client — typed request, field events, effect executor, state ref, embed event prefix"`

### Task 8: Client — retire prose mechanisms on a typed attempt

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`: validator hold (15440), `VoiceVerdictGate` creation (15747), `gateTimer` (16080), sentence filters (`isMetaNarration` 17599, offer-ends-turn 17777, note-citation strip 16494), end-of-attempt validators (20560–20916), judge (20919ff), answered-in-substance (22948), budget auto-advance / offer plant / R1 hold (22467–22771), held-advance fire (13169), last-item note (22481), close-summary request (22780), menu entry fallback (21567–21611), engine offer lines (21516), card-ask fallback (21543), `teaching_language_first` (20654)
- Test: `scripts/test-typed-turn-client-pins.ts` (append)

**Interfaces:**
- Consumes: Task 7's `typedTurnActive`.
- Produces: no new exports. Rules (each one a guard, not a rewrite):
  - `validatorTtsHold(...)` → `false` when typed (speech streams; `next` is gated server-side). `VoiceVerdictGate` not created when typed. `gateTimer` uses the 1000 ms default.
  - Per-sentence drops `isMetaNarration`, offer-ends-turn (`TUTOR_OFFER_ENDS_TURN` block), `stripNoteCitationClause`, and the off-card-ask strip are skipped when typed (the schema makes them unreachable; keep `stripLeakedLabels`).
  - End-of-attempt kill validators: the whole block from `required_phrase_missing` through `transition_ask_off_part` is skipped when typed, EXCEPT `teaching_language_first`, which becomes advisory: no kill, `onDebugEvent('typed_turn_language_note', …)` and plant the existing language note for the next turn.
  - Judge: runs; on typed, a judge rejection never calls `performKill`; it sets `judgeNotePlantRef` as the advisory path already does for notes.
  - `TUTOR_CARD_ANSWERED_IN_SUBSTANCE` block (22948) skipped when typed (the reducer's `answeredCards` replaces it). Mirror `typedTurnStateRef.current.answeredCards[seg]` into `answeredInPartRef` after each typed turn so the close note (`fixedScriptCloseNote(answered)`) keeps working.
  - Budget block (22467–22771): when typed, skip the auto-advance / offer plant / R1 hold / last-item-note planting / close-summary planting. Budget-due still feeds `allowedNextFor` (Task 7). The close summary is requested by the typed path as `allowedNext = ['close', 'question']` on the recap part; the forced close (`fixedScriptCloseForcedAction`, 22742) stays as the backstop and keeps counting `turnsSince` from the first typed turn on the recap part.
  - Held-advance fire at 13169 skipped when typed (no held advance exists on the typed path).
  - Engine lines at 21516 / 21543 / 21567–21611 skipped when typed (Task 7's `nextFallback` path is the only engine speaker).
  - Pronunciation post-turn auto-arm (22272–22327) skipped when typed (`arm_item` is the only arm source); the brain `requestPronunciationCheck` tool cannot fire (no tools).
- [ ] **Step 1: Write the failing pins** (append): for each guard above a regex pin of the form `/if \(!typedTurnActive\b[^\n]*\n[\s\S]{0,300}<anchor text>/` with anchors `validatorTtsHold({`, `new VoiceVerdictGate(`, `isMetaNarration(updatedSentence`, `TUTOR_OFFER_ENDS_TURN && isFixedScriptPlan`, `requiredPhraseMissAction(`, `transitionAskCheckDue({`, `cardAnsweredInSubstance(`, `fixedScriptAutoAdvanceReason({` (the acting branch, not the context builder: pin `fixed_script_offer_planted` instead), `heldAdvanceFiresNow({`, `fixedScriptEngineOfferLines(`, `menuEntryFallbackLine(`, `autoArmTargetForTurn(`; plus `typed_turn_language_note` present; plus a negative pin that `performKill()` is not called within 200 chars after `judge_fail` when typed (regex on the judge branch: `typedTurnActive ? … : await performKill()` or an `if (!typedTurnActive) await performKill()` form).
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the guards.
- [ ] **Step 4: Run** pins + `npm run test:all` → PASS (baseline only); tsc clean. Then start the dev server with `NEXT_PUBLIC_TUTOR_TYPED_TURN=on` and run ONE smoke: `node scripts/trial-text-session.mjs --variant straight --student gdi-trial-bot-r51 --port 3019 --smoke --out <scratchpad>/bot` → confirm `typed_turn` events appear in the dump and no `brain_validator_retry`. Fix anything it shows before Task 9.
- [ ] **Step 5: Commit** `git commit -am "tutor(typed-turn): client — prose validators, holds, heuristic inferences and engine lines stand down on a typed attempt"`

### Task 9: Harness block 10m + bot series

**Files:**
- Modify: `scripts/trial-text-session-checks.mjs` (new block `// 10m. typed turn` before `// 11.` at 557; add `'typed_turn'` to the 11 counts array)
- Modify: `docs/superpowers/plans/2026-11-04-gdi-trial-day5-handoff.md` §3 (bot recipe gains the env line)
- Test: the block itself is exercised by `node -e "import('./scripts/trial-text-session-checks.mjs')…"` on a fixture dump

**Interfaces:**
- Consumes: dump format (`parseDump`: events `{t,type,msg}`, `tutor`, `student`, whiteboard rows with `newPage`/`showSentence`), events from Task 7: `typed_turn` (`verdict=… next=… correction=yes|no retries=n`), `typed_turn_field`, `typed_turn_effect` (`advance from→to`, `arm_item "<text>"`), `typed_turn_fallback`, `typed_turn_language_note`.
- Produces: checks (skipped with one `INFO typed turn: off (no typed_turn events)` when none):
  - `TT1 one next per turn`: `ev('typed_turn').length === ev('brain_turn').length - ev('typed_turn_fallback').filter(reason=format_rejected|provider).length` (FAIL otherwise).
  - `TT2 correction field ⇒ correction card before any newPage of the same turn`: for each `typed_turn` with `correction=yes` at t, a `showSentence` with `emphasis` in `[t-8, t+4]` whose whiteboard index is lower than any `newPage` in the same window.
  - `TT3 no item repeated`: `arm_item` texts unique per run.
  - `TT4 move ⇒ page break on the same turn`: for each `typed_turn_effect advance` at t, a `newPage` in `[t-2, t+6]`.
  - `TT5 prose classes silent`: counts of `brain_validator_retry`, `transition_ask_off_part`, `transition_offer_missing`, `repeat_ask_after_two_tries`, `move_on_ignored`, `required_phrase_missing`, `validator_tts_hold_started` are all 0 on a typed run.
  - `TT6 fallbacks`: `typed_turn_fallback` count 0 (FAIL if > 0, detail = reasons); `retries` sum ≤ 2 (WARN above).
  - `TT7 budgets`: no `typed_turn` with `say=` > 3 outside the summary part window (the recap turn is identified by `advance …→summary` time) — WARN.
  - `TT8 Japanese present`: at least one tutor sentence matching `/[぀-ヿ一-鿿]/` in the first 3 tutor turns (anti-goal: thinner Japanese) — WARN if none.
- [ ] **Step 1: Write the fixture-based test**: save a 40-line synthetic dump string in `scripts/test-trial-checks-typed.mjs` (events + 2 whiteboard rows) covering a pass and a TT2 fail, assert `runChecks(dump).lines` contain `PASS  TT1` and `FAIL  TT2`; register `"test:trial-checks-typed": "node scripts/test-trial-checks-typed.mjs"`.
- [ ] **Step 2: Run** → FAIL (no TT lines).
- [ ] **Step 3: Implement** block 10m.
- [ ] **Step 4: Run** → PASS. Then the live series on `:3019` (flag on), one at a time, ≈ $3 each, scoring each with the recipe in the day-5 handoff §3: `straight` (r52), `wild` (r53), `pron` (r54). "Clean" = 0 FAIL on TT1–TT6 and no new FAIL on the existing blocks (spec §4.8). Engine findings → fix → re-run that variant; harness strictness → fix the check. Append each run's line to `.superpowers/sdd/2026-10-28-gdi-trial-lesson/progress.md`.
- [ ] **Step 5: Commit** `git commit -am "harness: block 10m typed-turn checks; day-5 recipe gains the flag env"` and push.

### Task 10: Default ON + handoff (gated on Praveen)

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (`TUTOR_TYPED_TURN`), `scripts/test-typed-turn.ts` (the flag pin), `docs/superpowers/plans/2026-11-04-gdi-trial-day5-handoff.md`, memory file `~/.claude/projects/-Users-luke-Dev-evelynlearning/memory/project_gdi_communications_inquiry.md`

**Preconditions (do not start without both):** Task 9's three consecutive clean runs AND Praveen's voice run on the typed build scored and accepted by him. Mint him a fresh new-learner link first (handoff §3).

- [ ] **Step 1:** Change the pin to `!== 'off'`; run `npx tsx scripts/test-typed-turn.ts` → FAIL.
- [ ] **Step 2:** Flip the flag; JSDoc: "default ON since <date>; `NEXT_PUBLIC_TUTOR_TYPED_TURN=off` restores the prose path for fixed scripts". Test → PASS; `npm run test:changed`; tsc clean.
- [ ] **Step 3:** Update the handoff (state, what shipped, the deviation, open items) and the memory file + `MEMORY.md` line.
- [ ] **Step 4: Commit** `git commit -am "tutor(typed-turn): default ON after the clean bot series + Praveen's run"` and push. Deploy only on Praveen's word (`./deploy-tutor-demo.sh` from the worktree after merging origin/main; `:3007` and `:3008` untouched).

---

## Self-review notes

- Spec coverage: §4.1 wire format → T1/T2/T5; §4.2 allowed sets, one retry, engine line → T3/T6/T7; §4.3 cards/pages/items/menu/close/wait → T4/T7; §4.4 state → T3/T4; §4.5 precheck/judge advisory, hold replaced by the `next` gate → T5 (`answer_check` advisory), T8; §4.6 fallbacks + flag → T1/T6/T10; §4.7 events + harness → T7/T9; §4.8 move-turn-is-one-turn (T4 `advance` from `next.say`), splice (T6, flagged deviation on transport), budgets (T1/T5/T6), Japanese anywhere (T1 prompt, T9 TT8), student-initiated turns (T3 `studentMovedOn`/`menuPick`/`nudge`), text mode as the gate (T8 smoke, T9), bot series (T9). §5 builder items: prompt text T1, reader placement T5 (server), budgets T1, part→allowed table T3, refs reused T7, rollout T1→T10.
- Not built here, by the spec's own scope: the soft session cap, decisions A/F/N, Japanese-first pronunciation line.
