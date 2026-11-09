/**
 * Typed turn, Task 7 (client): structural pins on VoiceTutorRealtime + the
 * embed page. The client sends the typed request, handles the three typed
 * events, runs every field effect through one executor and skips the three
 * prose post-turn card blocks on a typed turn (the cards came from fields).
 * Design: docs/superpowers/specs/2026-11-04-typed-turn-design.md.
 *
 * Run: npx tsx scripts/test-typed-turn-client-pins.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { correctionEmphasis } from '../src/lib/tutor/voice/sentence-board';
import { segmentCardCommand } from '../src/lib/tutor/lesson-plan/fixed-script';
import { validatorTtsHold } from '../src/lib/tutor/voice/validator-tts-hold';
import { typedMoveLastSentence, typedPageTurnHoldDone, typedPageTurnHoldRelease } from '../src/lib/tutor/whiteboard/deferred-page-flush';

let failed = 0;
const test = (name: string, fn: () => void) => {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
};
const VTR = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const EMBED = readFileSync(join(__dirname, '../src/app/tutor-portal/embed/page.tsx'), 'utf8');

test('VTR builds and sends the typed request', () => {
  assert.ok(VTR.includes('typedTurnRequestFor('), 'typedTurnRequestFor(');
  assert.ok(VTR.includes('typedTurn: typedReq'), 'typedTurn: typedReq');
  assert.ok(VTR.includes('createTypedTurnState()'), 'typedTurnStateRef seeded');
  assert.ok(/typedTurnActive = TUTOR_TYPED_TURN && isFixedScriptPlan\(lessonPlanRef\.current\) && !opts\?\.prefetchOnly && !openingTurnPendingRef\.current;/.test(VTR), 'typed gate');
});
test('VTR handles the three typed events', () => {
  for (const s of ["ev.type === 'typed-field'", "ev.type === 'typed-turn'", "ev.type === 'typed-turn-fallback'"]) {
    assert.ok(VTR.includes(s), s);
  }
  for (const s of ['effectsForField(', 'applyField(', 'applyTypedTurn(', 'engineLineFor(']) assert.ok(VTR.includes(s), s);
});
test('VTR debug events', () => {
  for (const s of ["onDebugEvent?.('typed_turn',", "onDebugEvent?.('typed_turn_fallback',", "onDebugEvent?.('typed_turn_field',", "onDebugEvent?.('typed_turn_effect',", "onDebugEvent?.('typed_turn_bridge_missing',", "onDebugEvent?.('typed_turn_nudge',"]) {
    assert.ok(VTR.includes(s), s);
  }
  assert.ok(/verdict=\$\{[^}]+\} next=\$\{[^}]+\} ack=\$\{[^}]+\} say=\$\{[^}]+\} correction=\$\{[^}]+\} retries=\$\{/.test(VTR), 'typed_turn message format');
});
test('runTypedEffect: advance breaks the page, correction / item use their card flags', () => {
  // W2: the card + page break moved into paintTypedPartEntry (shared with the latched engine move); same strength.
  assert.ok(/case 'advance':[\s\S]{0,1500}await paintTypedPartEntry\(e\.from, e\.to, anchorSentence, false\);/.test(VTR), 'advance → paintTypedPartEntry');
  assert.ok(/const paintTypedPartEntry = async[\s\S]{0,1800}segmentCardCommand\(toStatement[\s\S]{0,200}pageBreakOnTransition: true/.test(VTR), 'paintTypedPartEntry → pageBreakOnTransition');
  assert.ok(/case 'advance':[\s\S]{0,900}applyResolvedAdvance\(/.test(VTR), 'advance → applyResolvedAdvance');
  assert.ok(/case 'set_level':[\s\S]{0,200}mapFunctionCallToCommand\('set_working_level'/.test(VTR), 'set_level → set_working_level');
  assert.ok(/case 'close':[\s\S]{0,200}mapFunctionCallToCommand\('close_session_notes'/.test(VTR), 'close → close_session_notes');
  assert.ok(/case 'arm_item':[\s\S]{0,200}armPronunciationCheckRef\.current\(e\.text, 'typed'\)/.test(VTR), 'arm_item arms the clip');
  assert.ok(/'correction_card'[\s\S]{0,2000}correctionCard: true/.test(VTR), 'correction_card → correctionCard');
  assert.ok(/'arm_item'[\s\S]{0,2000}pronunciationModel: true/.test(VTR), 'arm_item → pronunciationModel');
  assert.ok(/'model_card'[\s\S]{0,1200}studentSentenceCard: true/.test(VTR), 'model_card → studentSentenceCard');
  for (const k of ['model_card', 'correction_card', 'advance', 'arm_item', 'set_level', 'close', 'menu_asked', 'offer_made', 'offer_served', 'open_ask']) {
    assert.ok(new RegExp(`case '${k}':`).test(VTR), `runTypedEffect case ${k}`);
  }
});
test('the three prose post-turn card blocks are skipped on a typed turn', () => {
  // The existing pins (test-fixed-script-advance B, test-deferred-page-flush 45§4) hold the
  // outer `if (TUTOR_SEGMENT_CARD_AUTO …)` and the `const transitionAnchor = …` lines verbatim,
  // so the guards sit on the card block's own if and on the anchor's only typed-path reader (its log).
  assert.ok(/if \(!typedTurnActive[^)]*\)[\s\S]{0,1600}planSentenceBoard\(/.test(VTR), 'sentence-board planner guarded');
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_SENTENCE_BOARD && languageSessionRef.current && !openingTurnPendingRef.current) {'), 'sentence board: own condition');
  assert.ok(VTR.includes('if (!typedTurnActive && acPlan && acSeg && segmentNeedsAutoCard({'), 'authored-card auto guarded');
  assert.ok(/transitionSentenceIndex\(turnNarrationRef[^\n]*\n\s*(?:\/\/[^\n]*\n\s*)*if \(!typedTurnActive && transitionAnchor !== null\) onDebugEvent\?\.\('page_break_anchored'/.test(VTR), 'transitionAnchor guarded');
});
test('correctionEmphasis: positions of the field\'s words in the corrected sentence', () => {
  assert.deepEqual(correctionEmphasis('I went there yesterday.', ['went']), { emphasis: ['went'], emphasisAt: [1] });
  assert.deepEqual(correctionEmphasis('I have a dog and a cat.', ['a cat']), { emphasis: ['a', 'cat'], emphasisAt: [5, 6] });
  assert.deepEqual(correctionEmphasis('She goes to school.', ['nope']), { emphasis: [], emphasisAt: [] });
});
test('review C-1: one student turn advances at most once; the typed state is per-turn', () => {
  assert.ok(VTR.includes('const typedFromSeg = typedEngineMove?.to ?? turnStartSegmentId ?? \'\';'), 'FROM part captured once per student turn (post lesson-time guard)');
  // W3: the snapshot is typed-only (null on prose); the restore checks it.
  assert.ok(/const typedTurnStateAtTurnStart: TypedTurnState \| null = typedTurnActive \? structuredClone\(typedTurnStateRef\.current\) : null;[\s\S]{0,400}for \(let attempt = 0; attempt <= attemptCap; attempt\+\+\)/.test(VTR), 'snapshot before the attempt loop');
  assert.ok(VTR.includes('if (typedTurnActive && attempt > 0 && typedTurnStateAtTurnStart) typedTurnStateRef.current = structuredClone(typedTurnStateAtTurnStart);'), 'restored on every attempt > 0');
  assert.ok(/case 'advance':[\s\S]{0,300}if \(typedMovedThisTurn\) \{[\s\S]{0,120}onDebugEvent\?\.\('typed_turn_advance_blocked', `\$\{e\.from\}→\$\{e\.to\}`\);\s*break;/.test(VTR), 'second advance blocked');
  assert.ok(/typedMovedThisTurn = typedMoved;/.test(VTR), 'the latch is set by the advance');
});
test('review I-1: a card effect that was not placed says so', () => {
  assert.ok(/const typedCardPlacement = [\s\S]{0,200}not placed\$\{res\?\.rejected\?\.length/.test(VTR), 'placement helper');
  for (const k of ['model_card', 'correction_card']) assert.ok(VTR.includes(`onDebugEvent?.('typed_turn_effect', \`${k}\${typedCardPlacement(res)}\`);`), k);
  assert.ok(/'typed_turn_effect', `arm_item "\$\{e\.text\.slice\(0, 80\)\}"\$\{typedCardPlacement\(res\)\}`/.test(VTR), 'arm_item');
});
test('review I-2: the client never invents a next kind', () => {
  assert.ok(VTR.includes('let fallbackKind: TypedNextKind | undefined = tt.nextFallback;'), 'fallback kind = the server\'s only');
  assert.ok(!/typedReq\?\.allowedNext\[0\]/.test(VTR), 'no allowedNext[0] invention');
  assert.ok(VTR.includes("next: seenNext ?? { kind: 'wait', say: '', item: '', level: '' },"), 'synth next = wait');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_fallback', 'next=none spoken=false');"), 'next=none logged');
});
test('review I-3: one authored-card command builder for runSegmentCard and the typed advance', () => {
  assert.equal((VTR.match(/segmentCardCommand\(/g) ?? []).length, 2, 'both call sites');
  assert.ok(VTR.includes('const cmd = segmentCardCommand(acStatement, acTruth?.kind) as unknown as WhiteboardCommand;'), 'runSegmentCard');
  assert.ok(VTR.includes('const cmd = segmentCardCommand(toStatement, toTruth?.kind) as unknown as WhiteboardCommand;'), 'typed advance');
  assert.ok(!VTR.includes("title: acKind === 'try_yourself'") && !VTR.includes("title: toKind === 'try_yourself'"), 'no inline copies');
  assert.deepEqual(segmentCardCommand('Q?', 'try_yourself'), { action: 'showProblem', problem: { statement: 'Q?', format: 'free-response', title: 'Try Yourself' } });
  const plain = segmentCardCommand('Q?', 'concept');
  assert.ok('title' in plain.problem && plain.problem.title === undefined, 'title key present, undefined (as the inline literal)');
});
test('embed persists typed_turn* debug events', () => {
  const m = EMBED.match(/const EMBED_DEBUG_EVENT_PREFIXES = \[([\s\S]*?)\n\];/);
  assert.ok(m, 'prefix list found');
  assert.ok(m![1].includes("'typed_turn'"), "'typed_turn' prefix");
});

// ── Task 8: prose mechanisms stand down on a typed attempt ──────────────────
// Brief form: an `if (!typedTurnActive …` line, then the anchor within a window.
// Where the anchor's own line is pinned word-for-word by an older test, the
// guard is a nested `if (!typedTurnActive) if (<pinned>)` on that line, or sits
// on an inner line (Task 7 decision 4) — each pin below names its form.
const guardThen = (anchor: string, window = 300): boolean =>
  new RegExp(`if \\(!typedTurnActive\\b[^\\n]*\\n[\\s\\S]{0,${window}}${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(VTR);
// The `if (` head (at `indent`) of the block holding VTR[idx], up to its `) {`.
const headOf = (idx: number, indent: string): string => {
  const head = VTR.lastIndexOf(`\n${indent}if (`, idx);
  return VTR.slice(head, VTR.indexOf(') {\n', head) + 3);
};
test('Task 8: typedTurnActive is turn-scope from the pre-turn held-advance fire on', () => {
  const decl = VTR.indexOf('let typedTurnActive = TUTOR_TYPED_TURN && isFixedScriptPlan(lessonPlanRef.current) && !opts?.prefetchOnly && !openingTurnPendingRef.current;');
  assert.ok(decl > 0, 'hoisted declaration');
  assert.ok(decl < VTR.indexOf('heldAdvanceFiresNow({ held:'), 'declared before the held-advance fire');
  assert.ok(!VTR.includes('let typedTurnActive = false;'), 'no second declaration');
  assert.ok(VTR.includes('if (!typedTurnActive) if (heldAdvanceFiresNow({ held: heldAdvanceForAskRef.current,'), 'held-advance fire skipped (nested: the pinned line stays)');
});
test('Task 8: one attempt — attemptCap 0, performKill never kills, no continuation', () => {
  assert.ok(/typedTurnActive = TUTOR_TYPED_TURN [^\n]*;\n(?:\s*\/\/[^\n]*\n)*\s*if \(typedTurnActive\) attemptCap = 0;/.test(VTR), 'attemptCap = 0 right after the gate');
  assert.ok(/const performKill = async \(\): Promise<void> => \{\s*(?:\/\/[^\n]*\n\s*)*if \(typedTurnActive\) \{\s*onDebugEvent\?\.\('typed_turn_kill_skipped'[^\n]*\n\s*return;\s*\}\s*if \(attempt === attemptCap\)/.test(VTR), 'performKill returns first on typed');
  assert.ok(VTR.includes('if (!typedTurnActive && !attemptKilled && rejectionsThisAttempt.length === 0) {'), 'turn-shape continuation skipped');
  assert.ok(VTR.includes('if (!typedTurnActive && !attemptKilled && rejectionsThisAttempt.length === 0 && emptySegmentCardThisAttempt) {'), 'empty-card continuation skipped');
});
test('Task 8: holds — validator TTS hold off, VoiceVerdictGate disabled, verdict hold off; gateTimer keeps 1000 ms', () => {
  assert.ok(/pronunciationRepeatProne: [\s\S]{0,400}?typed: typedTurnActive,\s*\}\);/.test(VTR), 'validatorTtsHold({ … typed })');
  const base = { enabled: true, voice: true, attempt: 0, fixedScript: true, noteDelivered: true, repeatAttempts: 0, moveOnRequested: false, requiredPhrasesPending: true };
  assert.equal(validatorTtsHold(base), true);
  assert.equal(validatorTtsHold({ ...base, typed: true }), false, 'typed never holds');
  assert.equal(validatorTtsHold({ ...base, typed: false }), true);
  assert.ok(/const voiceGateWanted = TUTOR_VOICE_VERDICT_HOLD && sessionMode !== 'text' && attempt === 0 && !typedTurnActive\n[\s\S]{0,700}new VoiceVerdictGate\(\{\s*enabled: voiceGateWanted/.test(VTR), 'VoiceVerdictGate enabled only off typed');
  assert.ok(VTR.includes('if (attempt === 0 && !typedTurnActive) {\n            // Voice answer judging: the gate decides first (see voiceGate).'), 'round-15 verdict hold off on typed');
  assert.ok(VTR.includes('}, skipTurnMarkerPresent ? 3_600_000 : validatorHold ? VALIDATOR_TTS_HOLD_MS : 1000);'), 'gateTimer default (validatorHold is false on typed)');
});
test('Task 8: per-sentence filters skipped on typed (stripLeakedLabels kept)', () => {
  // inner line: the outer `if (typeof ev.text === 'string') {` is pinned (test-meta-narration §A "on every turn")
  assert.ok(/const noteStripped = stripNoteCitationClause\(ev\.text, [^\n]*\n\s*\/\/[^\n]*\n\s*if \(!typedTurnActive && noteStripped && noteStripped !== ev\.text\) \{/.test(VTR), 'note-citation strip');
  assert.ok(/if \(!typedTurnActive && TUTOR_CARD_ASK_ENGINE_FALLBACK && attempt > 0 && transitionAskRejected[\s\S]{0,200}offCardAskStripped\(ev\.text/.test(VTR), 'off-card ask strip');
  assert.ok(VTR.includes('const metaNarrationRe = !typedTurnActive && isMetaNarration(updatedSentence, {'), 'isMetaNarration drop');
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_OFFER_ENDS_TURN && isFixedScriptPlan(lessonPlanRef.current)) {'), 'offer-ends-turn');
  assert.ok(/if \(typeof ev\.text === 'string'\) \{\s*const unlabelled = stripLeakedLabels\(ev\.text/.test(VTR), 'stripLeakedLabels unguarded');
});
test('Task 8: every in-stream kill validator is skipped on typed', () => {
  const from = VTR.indexOf('const selfCorrectionRe = ');
  const to = VTR.indexOf('const metaNarrationRe = ');
  assert.ok(from > 0 && to > from);
  let n = 0;
  for (let i = VTR.indexOf('await performKill();', from); i > 0 && i < to; i = VTR.indexOf('await performKill();', i + 1)) {
    n++;
    const head = headOf(i, ' '.repeat(18));
    const ok = /!typedTurnActive/.test(head) || (/if \(ambiguousKill\)/.test(head) && /const ambiguousKill = !typedTurnActive && /.test(VTR));
    assert.ok(ok, `unguarded kill: ${head.slice(0, 120)}`);
  }
  assert.ok(n >= 20, `kill sites seen: ${n}`);
});
test('Task 8: end-of-attempt validators (rule8 … transition_ask_off_part) skipped on typed; teaching_language_first advisory', () => {
  const from = VTR.indexOf('// RULE8 coherence check');
  const to = VTR.indexOf('// Judge LLM groundedness check');
  const tlf = VTR.indexOf("rejectionsThisAttempt.push({ action: 'teaching_language_first'");
  let n = 0;
  for (let i = VTR.indexOf('await performKill();', from); i > 0 && i < to; i = VTR.indexOf('await performKill();', i + 1)) {
    if (i > tlf && i - tlf < 200) continue; // the advisory branch's else
    n++;
    const head = headOf(i, ' '.repeat(8));
    assert.ok(/!typedTurnActive/.test(head), `unguarded kill: ${head.slice(0, 140)}`);
  }
  assert.ok(n >= 15, `kill sites seen: ${n}`);
  for (const a of ['requiredPhraseMissAction(', 'transitionAskCheckDue({', 'fixedScriptEngineOfferLines(']) {
    assert.ok(/!typedTurnActive/.test(headOf(VTR.indexOf(a, from), ' '.repeat(8))), `${a} inside a guarded block`);
  }
  assert.ok(/teachingLanguageFirstRejected = true;\s*if \(typedTurnActive\) \{\s*\/\/[^\n]*\n\s*pendingLanguageDriftNoteRef\.current = `\[runtime note — not from the student\] [^`]*\$\{teachingLanguageFirstReason\(tutorLanguages\)\}`;\s*onDebugEvent\?\.\('typed_turn_language_note', [^\n]*\n\s*\} else \{\s*rejectionsThisAttempt\.push\(\{ action: 'teaching_language_first'[^\n]*\n\s*await performKill\(\);/.test(VTR), 'TLF: note + typed_turn_language_note, kill only on prose');
});
test('Task 8: the judge runs and never kills; on typed a kill-class flag plants judgeNotePlantRef', () => {
  const from = VTR.indexOf('if (!attemptKilled && judgeRetriesUsed < MAX_JUDGE_RETRIES && attemptText && attemptText.trim().length > 0) {');
  const to = VTR.indexOf('// #4 safety backstop', from);
  assert.ok(from > 0 && to > from, 'judge block');
  assert.ok(!VTR.slice(from, to).includes('performKill('), 'no performKill in the judge block');
  assert.ok(/onDebugEvent\?\.\('judge_correction_note_planted', killIssues\[0\]\.claim\.slice\(0, 60\)\);\s*(?:\/\/[^\n]*\n\s*)*if \(typedTurnActive\) judgeNotePlantRef\.current = \{ note: correctionNote, /.test(VTR), 'typed kill-class note is part-scoped');
});
test('Task 8: engine lines — only the typed nextFallback speaks', () => {
  assert.ok(VTR.includes('if (!typedTurnActive && currentSegmentIdRef.current === transitionAskCardSeg) {'), 'card-ask fallback');
  assert.ok(guardThen('menuEntryFallbackLine(', 400), 'menu entry (at entry)');
  assert.ok(VTR.includes('if (!typedTurnActive && menuEnteredNow) {'), 'menu entry at entry: guard');
  assert.ok(VTR.includes('if (!typedTurnActive && menuEntryPendingRef.current && !opts?.prefetchOnly && !attemptKilled) {'), 'menu entry (next turn)');
  assert.ok(VTR.includes('const naLine = typedTurnActive ? null : nonAnswerReturnLine({'), 'non-answer return ask');
  assert.ok(VTR.includes('if (!typedTurnActive) if (!attemptKilled && !(TUTOR_OFFER_ACCEPTED_ASK && offerAcceptedThisTurn)'), 'same-question move-on line');
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_NEITHER_STREAK_MOVE_ON && moveOnNoAskFallbackDue({'), 'neither-streak move-on line');
});
test('Task 8: post-turn — pronunciation auto-arm, menu counter, budget planting and answered-in-substance skipped on typed', () => {
  assert.ok(/if \(!typedTurnActive\) if \(pronunciationActive && !opts\?\.prefetchOnly && !totalToolNamesSeen\.includes\('request_pronunciation_check'\)\) \{[\s\S]{0,2000}autoArmTargetForTurn\(/.test(VTR), 'pronunciation auto-arm / re-arm');
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_MENU_ASK_CAP && lessonPlanRef.current && segIdNow'), 'menu-ask counter (menu_asked counts on typed)');
  assert.ok(/if \(TUTOR_SEGMENT_OVERLONG_NOTE && !homeworkSession && !cur\.noted && cur\.turns >= overlongTurns && !typedTurnActive /.test(VTR), 'overlong note');
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_LAST_ITEM_NOTE && autoReason === null'), 'last-item note');
  const act = VTR.indexOf('if (!typedTurnActive) if (autoPlan && advanceReason) {');
  assert.ok(act > 0, 'auto-advance / offer plant / R1 hold (nested: the pinned line stays)');
  const planted = VTR.indexOf("onDebugEvent?.('fixed_script_offer_planted'", act);
  assert.ok(planted > act && planted < VTR.indexOf('if (fixedScriptCloseRef.current && !lessonClosedRef.current) {', act), 'the offer plant is inside the guarded branch');
  assert.ok(/if \(typedTurnActive && closeAction === 'wrap-turn'\) \{\s*\/\/[^\n]*\n(?:\s*\/\/[^\n]*\n)*\s*fc\.wrapRun = true;\s*onDebugEvent\?\.\('typed_turn_close_wrap_skipped'[^\n]*\n\s*\} else if \(closeAction === 'wrap-turn'\) \{/.test(VTR), 'wrap directive not planted on typed');
  assert.ok(/if \(typedTurnActive\) \{\s*(?:\/\/[^\n]*\n\s*)*if \(nextSegmentId\(autoPlan, segIdNow, !!workingLevelRef\.current\) === null\) \{\s*fixedScriptCloseRef\.current = \{ segId: segIdNow, turnsSince: 0 \};\s*onDebugEvent\?\.\('typed_turn_close_backstop_armed'[^\n]*\n\s*\}\s*\} else if \(closeReason\) \{/.test(VTR), 'close-summary note not planted on typed; the forced close counts from the first typed turn on the last part');
  assert.ok(VTR.includes('if (!typedTurnActive) if (TUTOR_CARD_ANSWERED_IN_SUBSTANCE && isFixedScriptPlan(lessonPlanRef.current)'), 'answered-in-substance (nested)');
  assert.ok(/if \(typedTurnActive\) \{\s*(?:\/\/[^\n]*\n\s*)*const tyAnswered = typedTurnStateRef\.current\.answeredCards\[turnStartSegmentId\] \?\? \[\];[\s\S]{0,400}answeredInPartRef\.current\.set\(turnStartSegmentId, /.test(VTR), 'answeredCards mirrored into answeredInPartRef');
});
test('Task 8: a typed set_level plants no level-advance note (the typed move carries the bridge)', () => {
  assert.ok(VTR.includes("if (cmd) await handleWhiteboardCommand([cmd], { typedTurn: true });\n                onDebugEvent?.('typed_turn_effect', `set_level ${e.level}`);"), 'set_level effect marks the batch typed');
  assert.ok(/const typedTurnActive = opts\?\.typedTurn === true;\s*if \(!typedTurnActive\) \{\s*const lvKind = [\s\S]{0,700}fixedScriptLevelAdvanceLead\(lvNext, lvKind\)[\s\S]{0,900}levelAdvanceThisTurnRef\.current = lvNext;\s*levelAdvanceFromThisTurnRef\.current = lvFrom;\s*\} else \{\s*onDebugEvent\?\.\('typed_turn_level_advance'/.test(VTR), 'level-advance FACT note + continuation only off typed');
});

test('Task 8 smoke fix: the language output cap never applies to a typed turn (the object is never cut)', () => {
  const at = VTR.indexOf('const turnMaxTokens = languageTurnMaxTokens({');
  assert.ok(at > 0 && at > VTR.indexOf('let typedTurnActive = TUTOR_TYPED_TURN'), 'typedTurnActive known before the cap');
  assert.ok(/cap: typedTurnActive \? null : TUTOR_LANGUAGE_TURN_MAX_TOKENS,/.test(VTR.slice(at, at + 600)), 'no cap on typed (cap null = off)');
});

test('Task 8 smoke fix: no prose auto card on advance and no rule-8 client repair on a typed turn', () => {
  assert.ok(VTR.includes('if (!typedTurnActive && TUTOR_AUTO_SEGMENT_CARD && plan && adv && adv.atMs >= attemptStartMs'), 'auto_card_on_advance');
  assert.ok(/if \(\n\s*!typedTurnActive &&\n\s*TUTOR_CLIENT_RULE8_REPAIR &&\n\s*shouldClientRequestRepair\(\{/.test(VTR), 'rule8 client repair');
});

// ── Task 8 fix round 1 ──────────────────────────────────────────────────────
test('fix round 1 (I-1): every per-sentence drop / rewrite filter stands down on typed, except labels + katakana', () => {
  const guardedIfs = [
    "if (!typedTurnActive) if (TUTOR_ACK_OPENER_STRIP && isFirstSentenceOfTurn && ackSpokenThisTurnRef.current) {",
    "if (!typedTurnActive) if (shouldDropBareRecheck({",
    "if (!typedTurnActive) if (isFirstSentenceOfTurn && hasPriorTutorTurn) {",
    "if (!typedTurnActive) if (typeof ev.text === 'string' && /^\\s*\\[/.test(transcript)) {",
    "if (!typedTurnActive) if (isPrematureCloseLine(updatedSentence, {",
    "if (!typedTurnActive) if (isPronunciationClaimSentence(updatedSentence,",
    "if (!typedTurnActive) if (sqPersonalPinned && (retryReasksQuestion(",
    "if (!typedTurnActive) if (answeredGuardQs.length) {",
    "if (!typedTurnActive) if (noaskEchoLeading && TUTOR_NOASK_VERDICT_ECHO_DROP",
    "if (!typedTurnActive) if (answeredCardQ && reasksCardQuestion(updatedSentence, answeredCardQ)) {",
    "if (!typedTurnActive) if (probeCheckinAsks && (probeReasks(",
    "if (!typedTurnActive) if (TUTOR_FIXED_SCRIPT_NO_READINESS && readinessAskDropDue({",
    "if (!typedTurnActive) if (TUTOR_OFFER_ACCEPTED_ASK && offerAcceptedThisTurn && isBareMoveOn(updatedSentence)) {",
    "if (!typedTurnActive) if (TUTOR_MENU_WRAP_UP_DROP && isFixedScriptPlan(lessonPlanRef.current)) {",
    "if (!typedTurnActive) if (TUTOR_REPEAT_AFTER_CORRECT_DROP && attempt > 0 && repeatAfterCorrectKilled",
    "if (!typedTurnActive) if (neitherStreakAsks && noAttemptPinned && !reasksAsk(updatedSentence, noAttemptPinned)",
    "if (!typedTurnActive) if (noAttemptPinned && (reasksAsk(updatedSentence, noAttemptPinned)",
    "if (!typedTurnActive) if (correctReaskAsk && replyAnsweredAsk(",
    "&& !adjacentPrevSentence && !/^\\s*\\[/.test(transcript) && isStudentEchoOpener(",
    "if (!typedTurnActive) if (continuedTurnText && continuationRepeatsSentence(updatedSentence, continuedTurnText)) {",
    "if (!typedTurnActive) if (TUTOR_QUESTION_LEAD_IN_HOLD && continuedTurnText && !adjacentPrevSentence && !heldLeadIn",
    "if (!typedTurnActive) if (TUTOR_ADJACENT_DUPLICATE_DROP && isAdjacentDuplicate(adjacentPrevSentence, updatedSentence)) {",
    "if (!typedTurnActive) if (partDedupe !== null) {",
    "if (!typedTurnActive) if (TUTOR_ADJACENT_DUPLICATE_DROP && (subject === 'languages' || isFixedScriptPlan(lessonPlanRef.current)) && !adjacentPrevSentence && !/^\\s*\\[/.test(transcript)) {",
    "if (!typedTurnActive) if (TUTOR_ADJACENT_DUPLICATE_DROP && isRepeatThankAck(thankAckSpoken, updatedSentence)) {",
    "if (!typedTurnActive) if (TUTOR_QUESTION_LEAD_IN_HOLD && (subject === 'languages' || isFixedScriptPlan(lessonPlanRef.current))) {",
    "const correctionWorking = typedTurnActive || correctionWorkingRestoredFrame",
    "if (!typedTurnActive) if (streakClaim.action !== 'pass') {",
    "if (!typedTurnActive) if ((!assignedPracticeRef.current || homeworkPointerSpokenRef.current) && isHomeworkAnnouncement(updatedSentence)) {",
    "if (!typedTurnActive) if (stepRefMatch) {",
    "if (!typedTurnActive) if (matchesBridge && lastBridgePhraseRef.current === sentenceNorm) {",
    "if (!typedTurnActive) if (matchesDisclaimer && lastDisclaimerPhraseRef.current === sentenceNorm) {",
    "if (!typedTurnActive) if (fullOpeningDirectiveThisAttempt && attemptSentences.length === 0 && !attemptKilled) {",
    "if (!typedTurnActive) if (wordCount >= 4 && sentencesSpokenThisTurn.has(dedupNorm) && !resumeArmed) {",
  ];
  for (const g of guardedIfs) assert.ok(VTR.includes(g), g);
  assert.ok(/if \(\n\s*!typedTurnActive &&\n\s*isStockPraiseOpenerOnly\(updatedSentence\) &&/.test(VTR), 'stock opener');
  // kept on typed: TTS / rendering hygiene
  assert.ok(/if \(typeof ev\.text === 'string'\) \{\s*const unlabelled = stripLeakedLabels\(ev\.text/.test(VTR), 'stripLeakedLabels kept');
  assert.ok(/if \(sessionAllowsNonLatin\(tutorLanguages\)\) \{\s*if \(hasDottedKatakanaReading\(updatedSentence\)\) \{/.test(VTR), 'katakana drop kept');
});
test('fix round 1 (I-2): the menu-ask-cap pre-turn advance stands down; the lesson-time guard plans and latches the typed turn', () => {
  assert.ok(VTR.includes('if (!typedTurnActive && mcNext && menuAskCapDecision({'), 'menu-ask cap: one authority');
  const decl = VTR.indexOf('let typedEngineMove: { from: string; to: string } | null = null;');
  const guard = VTR.indexOf('if (TUTOR_LESSON_TIME_GUARD && !silent');
  assert.ok(decl > 0 && decl < guard, 'declared before the guard');
  assert.ok(/reason=lesson_time [^\n]*\n\s*if \(typedTurnActive\) typedEngineMove = \{ from: tgSeg, to: tg\.to \};/.test(VTR), 'the guard records its move on typed');
  assert.ok(VTR.includes('let typedMovedThisTurn: { from: string; to: string } | null = typedEngineMove;'), 'latched: a brain move is blocked (typed_turn_advance_blocked)');
  assert.ok(VTR.includes("const typedFromSeg = typedEngineMove?.to ?? turnStartSegmentId ?? '';"), 'the request plans the post-guard part');
  assert.ok(/if \(typedMovedThisTurn\) \{\s*typedMoved = typedMovedThisTurn;\s*onDebugEvent\?\.\('typed_turn_advance_blocked'/.test(VTR), 'blocked branch reads the latch');
});

test('W1: typed budget input honours the prose gate + no-attempt rule; budgetDue / lessonElapsedMs reach the rules', () => {
  assert.ok(VTR.includes('const typedBudgetTurns = TUTOR_NO_ATTEMPT_MOVE_ON ? noAttemptBudgetTurns({ dropped: noAttemptDropped, pinnedSegId: noAttemptSeg, segIdNow: typedFromSeg, turns: typedTurnsRaw }) : typedTurnsRaw;'), 'no-attempt budget turns');
  assert.ok(VTR.includes('const budgetDue = TUTOR_FIXED_SCRIPT_AUTO_ADVANCE && !typedHomeworkSession && fixedScriptAutoAdvanceReason(typedBudgetInput) !== null;'), 'auto-advance gate');
  assert.ok(VTR.includes('turns: typedBudgetTurns,'), 'turns from the no-attempt rule');
  assert.ok(VTR.includes('typedBudgetDueThisTurn = budgetDue;'), 'budgetDue latched for the field context');
  assert.ok(VTR.includes('budgetDue: typedBudgetDueThisTurn,'), 'FieldEffectContext.budgetDue');
  // R6 (fix round 2): one nudge flag for both contexts — a nudge turn never marks the summary reviewed
  assert.ok(VTR.includes('const typedNudgeThisTurn = !!opts?.silent && isIdleNudgeDirective(transcript);'), 'nudge computed once');
  assert.ok(/const buildFieldEffectContext = \(\): FieldEffectContext => \(\{[\s\S]{0,900}nudge: typedNudgeThisTurn,\n\s*languageRequest: typedLanguageRequestThisTurn,\n\s*\}\);/.test(VTR), 'FieldEffectContext.nudge');
  assert.ok(/studentReplied: Boolean\(typedStudentText\),\n(?:\s*\/\/[^\n]*\n)?\s*studentRequest: !!typedStudentText && requestShaped\(typedStudentText\),\n(?:\s*\/\/[^\n]*\n)?\s*studentStop: typedStopDecision === 'close',\n\s*nudge: typedNudgeThisTurn,\n\s*items: typedItemsFor\(typedFromSeg\),/.test(VTR), 'AllowedNextContext.nudge');
  assert.ok(VTR.includes('lessonElapsedMs: typedLessonElapsedMs,'), 'AllowedNextContext.lessonElapsedMs');
});

test('W2: pre-turn engine moves are latched, enter the part, paint once, block a second move; move-on labels', () => {
  const latch = VTR.indexOf("if (typedTurnActive && !typedEngineMove && currentSegmentIdRef.current && currentSegmentIdRef.current !== turnStartSegmentId) {");
  const skip = VTR.indexOf("if (TUTOR_SKIP_DETERMINISTIC && /\\[Skip-button-clicked/i.test(transcript)) {");
  const jump = VTR.indexOf("if (TUTOR_TYPED_ADVANCE && !silent && !isBracketed) {");
  const guard = VTR.indexOf('if (TUTOR_LESSON_TIME_GUARD && !silent');
  const snap = VTR.indexOf('const typedTurnStateAtTurnStart');
  const build = VTR.indexOf('const buildAllowedNextContext = ');
  assert.ok(latch > 0 && skip > 0 && jump > 0 && guard > 0, 'anchors present');
  assert.ok(latch > skip && latch > jump && latch > guard, 'latched after every pre-turn mechanism');
  assert.ok(latch < snap && snap < build, 'before the turn-start snapshot and the request');
  assert.ok(VTR.includes("typedEngineMove = { from: turnStartSegmentId ?? '', to: currentSegmentIdRef.current };"), 'latch value');
  assert.ok(VTR.includes('if (typedTurnActive && typedEngineMove) typedTurnStateRef.current = enterPartState(typedTurnStateRef.current, typedEngineMove.to);'), 'enterPartState');
  assert.ok(VTR.includes('engineMoved: !!typedEngineMove,'), 'AllowedNextContext.engineMoved');
  assert.ok(/onDebugEvent\?\.\('typed_turn_effect', `advance \$\{from\}→\$\{to\}\$\{engine \? ' \(engine\)' : ''\}`\);/.test(VTR), 'advance log in the paint');
  assert.ok(/if \(!typedEngineMove \|\| typedEngineMovePainted\) return;\s*typedEngineMovePainted = true;/.test(VTR), 'painted once per turn');
  assert.ok(/typedFieldAnchor = \{ field: tf\.field, narrationIndex: [^\n]+\n\s*await paintTypedEngineMove\(typedFieldAnchor\.narrationIndex\);/.test(VTR), 'painted at the first typed-field');
  assert.ok(/retryDisagreed\?: boolean \};\n\s*await paintTypedEngineMove\(/.test(VTR), 'or at the turn end');
  assert.ok(VTR.includes("studentMovedOn: !!typedStudentText && (!!moveOnRequestSpan(typedStudentText, laterPartLabels(tPlan, typedFromSeg)) || typedStopDecision === 'finish' || typedJumpToNext),"), 'later-part labels (+ Y2 jump to the next part)');
});

test('Y2 (fix wave 7, session 3): a pending named-part jump resolves before the brain call on a typed turn', () => {
  const decl = VTR.indexOf('let typedJumpToNext = false;');
  const engineDecl = VTR.indexOf('let typedEngineMove: { from: string; to: string } | null = null;');
  assert.ok(decl > 0 && engineDecl > 0 && decl > engineDecl && decl - engineDecl < 400, 'typedJumpToNext declared next to typedEngineMove');
  const pre = VTR.indexOf('const typedPendingJump = typedTurnActive && !typedEngineMove ? pendingStudentJumpRef.current : null;');
  const latch = VTR.indexOf("if (typedTurnActive && !typedEngineMove && currentSegmentIdRef.current && currentSegmentIdRef.current !== turnStartSegmentId) {");
  // Fix wave 8 Z1: the block moved up (before the note planters); it still runs before the W2 latch.
  const blockEnd = VTR.indexOf('// Fix wave 8 Z1: end of the pre-turn student jump.');
  assert.ok(pre > 0 && latch > pre && blockEnd > pre && blockEnd - pre < 1600, 'pre-turn jump block bounded, before the W2 latch');
  const block = VTR.slice(pre, blockEnd);
  assert.ok(block.includes('!(Date.now() - typedPendingJump.atMs > 90_000)'), 'the seam\'s 90 s stale rule');
  assert.ok(block.includes('lessonPlanRef.current.segments.some((s) => s.id === typedPendingJump.segId)'), 'target is a segment of the plan');
  assert.ok(block.includes('typedPendingJump.segId !== currentSegmentIdRef.current'), 'target differs from the pointer');
  assert.ok(/if \(typedPendingJump\.segId === nextSegmentId\(jumpPlan, jumpFrom, !!workingLevelRef\.current\)\) \{\s*typedJumpToNext = true;\s*\} else \{/.test(block), 'the immediate next part: the brain moves (pointer untouched, ref kept)');
  assert.ok(/\} else \{\s*applyResolvedAdvance\(jumpPlan, jumpFrom, typedPendingJump\.segId\);\s*pendingStudentJumpRef\.current = null;\s*onDebugEvent\?\.\('typed_advance_app', `"\$\{jumpFrom\}" → "\$\{typedPendingJump\.segId\}" \(student jump "\$\{typedPendingJump\.label\}"\)`\);/.test(block), 'a jump over parts: applied now (no seamMode), ref cleared, logged');
  assert.ok(!block.includes('seamMode'), 'not seamMode');
  // Fix round 1 M1: only when no pre-turn move happened (Skip, objective jump, lesson-time guard) — one advance per turn
  assert.ok(block.includes('&& currentSegmentIdRef.current === turnStartSegmentId'), 'no jump after another pre-turn move');
  // Fix round 1 M3: a backward target (an earlier part) is not excluded — it takes the apply branch, and
  // applyResolvedAdvance auto-completes only on a forward move (nothing is marked complete going back)
  assert.ok(!/findIndex|targetIdx|outgoingIdx/.test(block), 'the pre-turn block does not filter by direction');
  assert.ok(VTR.includes('if (outgoingIdx >= 0 && targetIdx > outgoingIdx) {'), 'applyResolvedAdvance auto-marks forward only');
  // levelKnown copied from buildAllowedNextContext
  assert.ok(VTR.includes('const levelKnown = !!workingLevelRef.current;'), 'buildAllowedNextContext levelKnown source');
  // the seam stands down on a typed turn
  assert.ok(/if \(pendingJump && typedTurnActive\) \{\s*onDebugEvent\?\.\('agenda_jump_typed_stand_down', `\$\{pendingJump\.label\} → \$\{pendingJump\.segId\}`\);\s*\} else if \(pendingJump && lessonPlanRef\.current\) \{/.test(VTR), 'seam: typed stand-down, ref already cleared');
});

test('Z1 (fix wave 8, run 4 51 s): the pre-turn student jump runs before every note planter', () => {
  const pre = VTR.indexOf('const typedPendingJump = typedTurnActive && !typedEngineMove ? pendingStudentJumpRef.current : null;');
  const unresolved = VTR.indexOf("onDebugEvent?.('typed_advance_unresolved'");
  const numbered = VTR.indexOf("onDebugEvent?.('numbered_question_note_planted'");
  const answered = VTR.indexOf("onDebugEvent?.('answered_in_part_note_planted'");
  const guard = VTR.indexOf('if (TUTOR_LESSON_TIME_GUARD && !silent');
  const latch = VTR.indexOf("if (typedTurnActive && !typedEngineMove && currentSegmentIdRef.current && currentSegmentIdRef.current !== turnStartSegmentId) {");
  assert.ok(pre > 0 && unresolved > 0 && numbered > 0 && answered > 0 && guard > 0 && latch > 0, 'anchors present');
  assert.ok(pre > unresolved, 'after the typed objective jump');
  // Fix round 1 I1: after the lesson-time guard too (one advance per turn: a guard move leaves the jump to the seam)
  const guardLatch = VTR.indexOf('if (typedTurnActive) typedEngineMove = { from: tgSeg, to: tg.to };');
  assert.ok(guardLatch > guard && pre > guardLatch, 'after the lesson-time guard block');
  assert.ok(pre < numbered && pre < answered, 'before the numbered-question and answered-in-part planters');
  assert.ok(pre < latch, 'before the W2 latch');
  assert.equal((VTR.match(/const typedPendingJump = /g) ?? []).length, 1, 'one pre-turn jump block');
  const tta = VTR.indexOf('let typedTurnActive = TUTOR_TYPED_TURN');
  const decl = VTR.indexOf('let typedJumpToNext = false;');
  assert.ok(tta > 0 && tta < pre && decl > 0 && decl < pre, 'typedTurnActive + typedJumpToNext declared above the block');
});
test('Z1 round 1 (review M1): a brain-written next-part move carries no old-part numbered-question note', () => {
  assert.ok(VTR.includes("if (TUTOR_NUMBERED_QUESTION_NOTE && languageSessionRef.current && !opts?.prefetchOnly && !/^\\s*\\[/.test(transcript) && !typedJumpToNext) {"), 'planter skips on typedJumpToNext');
});
test('V4 (fix wave 2): the level check counts answers (non-none verdicts) + the reply now, not turns', () => {
  // R3 (fix round 1): the rules read the committed answersInPart; the client says only whether a reply came
  assert.ok(VTR.includes('studentReplied: Boolean(typedStudentText),'), 'studentReplied');
  assert.ok(!/studentAnswerCount:/.test(VTR), 'no turn / answer count from the client');
  // moveNeedsAnswer rides in the request typedTurnRequestFor builds from that context
  assert.ok(VTR.includes('typedTurnRequestFor(buildAllowedNextContext())'), 'request from the rules helper');
});
test('V5 (fix wave 2): a typed correction feeds the pronunciation items after the authored ones', () => {
  assert.ok(/const typedCorrectedSentencesRef = useRef<string\[\]>\(\[\]\);/.test(VTR), 'the ref');
  assert.ok(/case 'correction_card': \{[\s\S]{0,400}typedCorrectedSentencesRef\.current = \[e\.corrected\.trim\(\), \.\.\.typedCorrectedSentencesRef\.current/.test(VTR), 'filled by the correction_card effect, newest first');
  // W10-1 (fix wave 10): the list follows the menu pick (this turn's, else the persisted one) — words / sentences / the learner's own.
  assert.ok(/const typedItemsFor = \(segId: string\): readonly string\[\] => \{[\s\S]{0,900}const pick = typedMenuPickText \?\? typedTurnStateRef\.current\.menuState\[segId\]\?\.picked \?\? null;[\s\S]{0,400}typedPronunciationItemsFor\(md\.pronunciation, pick, typedCorrectedSentencesRef\.current\)/.test(VTR), 'typedItemsFor follows the menu pick');
  assert.ok(/typedTurnStateRef\.current = createTypedTurnState\(\);\s*typedCorrectedSentencesRef\.current = \[\];/.test(VTR), 'plan-scoped like the typed state');
});
test('V6 (fix wave 2): the typed request carries the held working level (next_card key ideas filtered as the board)', () => {
  // R4/M7: pinned inside buildAllowedNextContext's return literal (between lessonElapsedMs and engineMoved)
  assert.ok(/lessonElapsedMs: typedLessonElapsedMs,\n\s*\/\/ V6:[^\n]*\n\s*workingLevel: workingLevelRef\.current\?\.level \?\? null,\n\s*\/\/ W2:[^\n]*\n\s*engineMoved: !!typedEngineMove,\n\s*\};/.test(VTR), 'workingLevel in the context');
});
test('W3: the turn-start typed snapshot is taken on a typed turn only (prose path inert)', () => {
  assert.ok(VTR.includes('const typedTurnStateAtTurnStart: TypedTurnState | null = typedTurnActive ? structuredClone(typedTurnStateRef.current) : null;'), 'guarded snapshot');
  assert.equal((VTR.match(/structuredClone\(typedTurnStateRef\.current\)/g) ?? []).length, 1, 'no other per-turn clone');
  assert.ok(VTR.includes('if (typedTurnActive && attempt > 0 && typedTurnStateAtTurnStart) typedTurnStateRef.current = structuredClone(typedTurnStateAtTurnStart);'), 'restore reads the guarded snapshot');
});

test('X1 (fix wave 3): the numbered-question tracker\'s all-answered state reaches the rules (partQuestionsAnswered)', () => {
  assert.ok(/const typedPartQuestionsAnsweredRef = useRef<string \| null>\(null\);/.test(VTR), 'the ref (the part id whose numbered questions are all answered)');
  assert.ok(/numberedAllAnsweredSegsRef\.current\.add\(nqSeg\);\s*typedPartQuestionsAnsweredRef\.current = nqSeg;/.test(VTR), 'set where the tracker logs all answered');
  assert.ok(VTR.includes('partQuestionsAnswered: typedPartQuestionsAnsweredRef.current === typedFromSeg,'), 'keyed on the part (a new part reads false)');
  assert.ok(/typedCorrectedSentencesRef\.current = \[\];\s*typedPartQuestionsAnsweredRef\.current = null;/.test(VTR), 'plan-scoped like the typed state');
});

test('X2 (fix wave 3): the missing required phrases (the close guard\'s own call) reach the rules', () => {
  assert.ok(/missingRequiredPhrases: missingRequiredPhrases\(\s*getSegment\(tPlan, typedFromSeg\) as \{ requiredPhrases\?: string\[\] \} \| undefined,\s*\[\.\.\.\(segmentNarrationRef\.current\.get\(typedFromSeg\) \?\? \[\]\), \.\.\.turnNarrationRef\.current, \.\.\.attemptStreamedSentencesRef\.current\],\s*\),/.test(VTR), 'missingRequiredPhrases in buildAllowedNextContext');
});

test('Y1 (fix wave 4): the typed close\'s phrase guard includes the typed turn\'s text (next.say not yet narrated)', () => {
  assert.ok(/const typedClosePendingTextRef = useRef<string\[\] \| null>\(null\);/.test(VTR), 'the ref');
  assert.ok(/case 'close': \{\s*const cmd = mapFunctionCallToCommand\('close_session_notes', \{\}\);[^\n]*\n[^\n]*\n\s*typedClosePendingTextRef\.current = typedTurnSpokenText\(typedFieldsSeen as Partial<TypedTurn>, typedFieldsSeen\.next as TypedNext \| undefined\);\s*try \{\s*if \(cmd\) await handleWhiteboardCommand\(\[cmd\]\);\s*\} finally \{ typedClosePendingTextRef\.current = null; \}/.test(VTR), 'set around the typed close command only');
  assert.ok(/const cbSpoken = \[\.\.\.\(segmentNarrationRef\.current\.get\(cbSeg\) \?\? \[\]\), \.\.\.turnNarrationRef\.current, \.\.\.attemptStreamedSentencesRef\.current\];/.test(VTR), 'spoken text as before');
  assert.ok(/const cbMissing = missingRequiredPhrases\(cbSegDef, typedClosePendingTextRef\.current \? \[\.\.\.cbSpoken, \.\.\.typedClosePendingTextRef\.current\] : cbSpoken\);/.test(VTR), 'the guard reads the pending typed text');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_close_phrases_in_say',"), 'debug event');
});

test('Z1 (fix wave 5): the server\'s no-change frame is forwarded as telemetry and logged as a debug event', () => {
  const ROUTE = readFileSync(join(__dirname, '../src/app/api/tutor/brain/stream/route.ts'), 'utf8');
  assert.ok(ROUTE.includes("|| ev.type === 'typed-turn-fallback' || ev.type === 'typed-correction-no-change') {"), 'route: telemetry, not egress');
  assert.ok(VTR.includes("(ev as { type?: string }).type === 'typed-correction-no-change'"), 'VTR handles the frame');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_correction_no_change',"), 'debug event');
});

test('Z2 (fix wave 5): a move in a turn that boarded a model card turns the page at the turn end (p2.txt 926 s)', () => {
  assert.ok(VTR.includes('let typedModelCardPlaced = false;'), 'per-attempt flag');
  assert.ok(/if \(res\?\.assignedIds\?\.\[0\]\) typedModelCardPlaced = true;\s*onDebugEvent\?\.\('typed_turn_effect', `model_card\$\{typedCardPlacement\(res\)\}`\);/.test(VTR), 'set only when the model card was placed');
  assert.ok(VTR.includes('if (typedModelCardPlaced && heldPage && heldPage.segmentId === e.to && heldPage.authored === true) {'), 'the hold condition');
  assert.ok(VTR.includes('pendingAdvanceNewPageRef.current = { ...heldPage, afterTurn: true, cardOnFlush: true };'), 'the turn-end flush carries page + card');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_page_turn_held_for_card',"), 'debug event');
  assert.ok(/\} else \{\s*\/\/ The new part's card \+ page break, anchored to the first next\.say sentence\.\s*await paintTypedPartEntry\(e\.from, e\.to, anchorSentence, false\);\s*\}/.test(VTR), 'no card this turn: unchanged');
  // the turn-end flush it relies on opens the page and adds the authored card for a cardOnFlush page
  assert.ok(VTR.includes("onDebugEvent?.('auto_newpage_on_advance_flushed', `${deferred.segmentId}: ${deferred.title} at turn end`);"), 'turn-end flush');
  assert.ok(VTR.includes('if (deferred.cardOnFlush || deferred.authored === true) {'), 'card on flush');
});

test('G1 I2 (fix wave 5 round 1): the held page turn waits for the LAST next.say sentence to finish, not "speech ended"', () => {
  // pure: the last sentence index of a move say anchored at sentence 3 (two sentences → 4); an empty say → the anchor
  assert.equal(typedMoveLastSentence(3, 'That is clear. Now let us practise pronunciation?'), 4);
  assert.equal(typedMoveLastSentence(3, ''), 3);
  // done once the sentence AFTER the last has started, or the audio drained with the last one started
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 4, why: 'speech ended' }), false, 'a gap between sentences 3 and 4');
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 5, why: 'speech ended' }), false, 'the last sentence is still playing');
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 5, why: 'brain idle' }), false);
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 5, why: 'audio drained' }), true, 'drained after the last sentence');
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 4, why: 'audio drained' }), false, 'drained before the last sentence started');
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 6, why: 'speech ended' }), true, 'a later sentence started');
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 0, why: 'interrupt' }), true, 'an interruption turns the page');
  // VTR wiring
  assert.ok(/const typedPageTurnHoldRef = useRef<\{ segmentId: string; lastSentence: number \} \| null>\(null\);/.test(VTR), 'the hold ref');
  assert.ok(VTR.includes('typedPageTurnHoldRef.current = { segmentId: e.to, lastSentence: typedMoveLastSentence(anchorSentence, (typedFieldsSeen.next as TypedNext | undefined)?.say ?? \'\') };'), 'anchored like paintTypedPartEntry: the next field\'s narration index + the say\'s sentences');
  // round 2 pin move (H1): the flush consults the hold through typedPageTurnHoldRelease (the same anchored rule + the turn-end fallback)
  assert.ok(VTR.includes('if (!tRelease) {') && VTR.includes('typedPageTurnHoldRelease({ lastSentence: tHold.lastSentence, started: ttsPlaybackStartedCountRef.current, why,'), 'the turn-end flush consults the hold');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_page_turn_on_interrupt',"), 'interrupt debug event');
  assert.equal((VTR.match(/releaseTypedPageTurnHoldOnInterrupt\(\);/g) ?? []).length, 2, 'both kill sites release the hold');
  assert.ok(/ttsPlaybackStartedCountRef\.current = 0;\s*typedPageTurnHoldRef\.current = null;/.test(VTR), 'cleared with the playback counter (turn start / retry)');
});

test('H1 (fix wave 5 round 2): a turn-end fallback releases the hold when the anchored sentence never plays', () => {
  // a dropped duplicate say sentence: lastSentence one too high, the stream ended, the audio drained → released (fallback)
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 5, started: 5, why: 'audio drained', streamEnded: true }), 'fallback');
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 5, started: 0, why: 'audio drained', streamEnded: true }), 'fallback', 'no playback at all');
  // the anchored release still reads as anchored
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 4, started: 5, why: 'audio drained', streamEnded: true }), 'anchored');
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 4, started: 6, why: 'speech ended', streamEnded: true }), 'anchored');
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 4, started: 0, why: 'interrupt', streamEnded: false }), 'anchored');
  // no fallback while the stream runs, and never on "speech ended" (it fires between sentences after the stream ended too)
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 5, started: 5, why: 'audio drained', streamEnded: false }), null);
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 5, started: 4, why: 'speech ended', streamEnded: true }), null, 'a gap between sentences');
  assert.equal(typedPageTurnHoldRelease({ lastSentence: 5, started: 5, why: 'brain idle', streamEnded: true }), null);
  // the boolean wrapper is unchanged for the anchored cases
  assert.equal(typedPageTurnHoldDone({ lastSentence: 4, started: 4, why: 'audio drained' }), false);
  // VTR wiring
  // round 3 pin moves (H2): the call also passes noAudio; the fallback event now carries reason=drained|no_audio
  assert.ok(VTR.includes('const tRelease = typedPageTurnHoldRelease({ lastSentence: tHold.lastSentence, started: ttsPlaybackStartedCountRef.current, why, streamEnded: !brainBusyRef.current, noAudio: textSessionRef.current });'), 'the flush passes the stream state');
  assert.ok(VTR.includes("if (tRelease !== 'anchored') {") && VTR.includes("onDebugEvent?.('typed_turn_page_turn_fallback', `reason=${fbReason}"), 'fallback debug event');
});

test('H2 (fix wave 5 round 3): text mode releases the held page at stream end, past the transition-sentence wait', () => {
  assert.ok(VTR.includes("const fbReason = tRelease === 'no_audio' ? 'no_audio' : 'drained';"), 'reason no_audio vs drained');
  assert.ok(VTR.includes("onDebugEvent?.('typed_turn_page_turn_fallback', `reason=${fbReason} ${why}:"), 'fallback debug event with the reason');
  assert.ok(VTR.includes("if (holdGate === 'wait') return;"), 'the flush waits on the hold');
  assert.ok(/if \(holdGate !== 'released_no_audio'\) \{\s*if \(deferred && TUTOR_PAGE_BREAK_ON_TRANSITION_SENTENCE && why === 'brain idle' && isFixedScriptPlan\(lessonPlanRef\.current\)\) \{/.test(VTR), 'a no-audio release skips the spoken-transition wait (nothing is spoken)');
});

test('A (fix wave 6): VTR sends studentEnglish from the student\'s own words', () => {
  assert.ok(VTR.includes("studentEnglish: studentSpokeEnglish(typedStudentText ?? ''),"), 'studentEnglish in the allowed-next context');
});

test('C (fix wave 6): the model card passes emphasis / emphasisAt to showSentence as the correction card does', () => {
  assert.ok(/case 'model_card': \{[\s\S]{0,600}const modelCmd = \{\s*action: 'showSentence',\s*sentence: e\.sentence,\s*\.\.\.\(e\.emphasis\?\.length \? \{ emphasis: e\.emphasis \} : \{\}\),\s*\.\.\.\(e\.emphasisAt\?\.length \? \{ emphasisAt: e\.emphasisAt \} : \{\}\),\s*\} as WhiteboardCommand;\s*const res = await handleWhiteboardCommand\(\[modelCmd\]/.test(VTR), 'model card command carries the emphasis');
});

test('W9-B3 (fix wave 9): the client passes pronunciationRepeatDue from this turn\'s unmeasured note and arms the item again on rearm_item', () => {
  assert.ok(/pronunciationRepeatDue: !!pronunciationNoteThisTurn && !pronunciationMeasuredThisTurn,/.test(VTR), 'pronunciationRepeatDue from the planted note');
  assert.ok(/case 'rearm_item': \{\s*armPronunciationCheckRef\.current\(e\.text, 'typed-retry'\);/.test(VTR), 'rearm_item arms the item');
  assert.ok(/onDebugEvent\?\.\('pronunciation_rearmed', `typed-retry "\$\{e\.text\.slice\(0, 80\)\}"`\)/.test(VTR), 'pronunciation_rearmed event');
});

test('W13-C (wave 13, run 9 585 s): the learner sentences ref collects model + correction cards, is boarded on recap entry, and rides the allowed context', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes('const typedLearnerSentencesRef = useRef<string[]>([]);'), 'ref');
  assert.ok(VTR.includes('const rememberLearnerSentence = (sentence: string): void =>'), 'helper');
  assert.ok(VTR.includes('if (res?.assignedIds?.[0]) rememberLearnerSentence(e.sentence);'), 'model card remembered when placed');
  assert.ok(VTR.includes('rememberLearnerSentence(e.corrected);'), 'correction card remembered');
  assert.ok(VTR.includes("onDebugEvent?.('recap_sentences_boarded'"), 'boarded on recap entry');
  assert.ok(VTR.includes('learnerSentences: typedLearnerSentencesForRecap()'), 'allowed context');
  // run 10 536 s: the four cards were skipped by the part-page duplicate rule — the recap board passes recapBoard through.
  assert.ok(VTR.includes('{ anchorSentence, sentenceBoardAuto: true, studentSentenceCard: true, holdDeferredPage: true, recapBoard: true }'), 'recap cards carry recapBoard');
  assert.ok(VTR.includes('recapBoard: opts?.recapBoard === true'), 'duplicate rule sees recapBoard');
});

test('W15-B (wave 15, run 12 46 s): the utterance that resolved a menu pick is not a pronunciation attempt — its clip note is dropped', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_note_dropped_menu_pick'"), 'event');
  assert.ok(VTR.includes('runTranscript = runTranscript.replace(`${pronunciationNoteThisTurn}\\n\\n`, \'\');'), 'note stripped from the brain input');
  assert.ok(VTR.includes('pronunciationNoteThisTurn = null;\n          pronunciationMeasuredThisTurn = false;\n          pronunciationLowScoreThisTurn = false;'), 'repeat_due / low_score stand down');
});

test('W17-A: the client says when the reply is a question / request (the check question stays open)', () => {
  assert.ok(VTR.includes('studentRequest: !!typedStudentText && requestShaped(typedStudentText),'), 'AllowedNextContext.studentRequest');
  assert.ok(/import \{[^}]*\brequestShaped\b[^}]*\} from '@\/lib\/tutor\/lesson-plan\/typed-turn-rules';/.test(VTR), 'requestShaped imported from the rules');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall typed-turn client pins passed');
