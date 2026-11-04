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
  assert.ok(/(?:kind === 'advance'|case 'advance':)[\s\S]{0,2500}pageBreakOnTransition: true/.test(VTR), 'advance → pageBreakOnTransition');
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
  assert.ok(VTR.includes('const typedFromSeg = turnStartSegmentId ?? \'\';'), 'FROM part captured once per student turn');
  assert.ok(/const typedTurnStateAtTurnStart: TypedTurnState = structuredClone\(typedTurnStateRef\.current\);[\s\S]{0,400}for \(let attempt = 0; attempt <= attemptCap; attempt\+\+\)/.test(VTR), 'snapshot before the attempt loop');
  assert.ok(VTR.includes('if (typedTurnActive && attempt > 0) typedTurnStateRef.current = structuredClone(typedTurnStateAtTurnStart);'), 'restored on every attempt > 0');
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

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall typed-turn client pins passed');
