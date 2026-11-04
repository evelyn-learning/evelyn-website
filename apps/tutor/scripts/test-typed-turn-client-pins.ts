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
  assert.ok(/case 'advance':[\s\S]{0,400}applyResolvedAdvance\(/.test(VTR), 'advance → applyResolvedAdvance');
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
test('embed persists typed_turn* debug events', () => {
  const m = EMBED.match(/const EMBED_DEBUG_EVENT_PREFIXES = \[([\s\S]*?)\n\];/);
  assert.ok(m, 'prefix list found');
  assert.ok(m![1].includes("'typed_turn'"), "'typed_turn' prefix");
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall typed-turn client pins passed');
