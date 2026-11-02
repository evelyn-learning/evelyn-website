/**
 * Task 30 §H (GDI run 17, 1198 s): "Um, the uh sentence." answering the
 * pronunciation menu was not recognised and the options were listed a third
 * time. resolveMenuPick names the option the student picked; the student turn
 * carries menuPickNote. Also pins the menu parser §A1 shares.
 *
 * Run: npx tsx scripts/test-menu-pick.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseMenuOptions, resolveMenuPick, menuPickNote, menuAskedIn, menuReplyIsPick, isBareAcknowledgement, menuAskCapDecision, menuUnpickedLead, MENU_ASK_CAP } from '../src/lib/tutor/voice/menu-pick';

let failed = 0;
const test = (name: string, fn: () => void) => {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
};
const MENU = 'The pronunciation options are: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue. Which number would you like?';

test('parseMenuOptions — the four options in order; one option or none ⇒ null', () => {
  assert.deepEqual(parseMenuOptions(MENU), [
    { index: 1, text: 'individual words' },
    { index: 2, text: 'a complete sentence' },
    { index: 3, text: 'speaking more naturally' },
    { index: 4, text: 'skip and continue' },
  ]);
  assert.equal(parseMenuOptions('Try 1) this one.'), null);
  assert.equal(parseMenuOptions('No menu here.'), null);
});
test('resolveMenuPick — the brief\'s pins', () => {
  const idx = (s: string, t = MENU) => resolveMenuPick(s, t)?.index ?? null;
  assert.equal(idx('Um, the uh sentence.'), 2);
  assert.equal(idx('Complete sentence.'), 2);
  assert.equal(idx('two'), 2);
  assert.equal(idx('words'), 1);
  assert.equal(idx('skip'), 4);
  assert.equal(idx('more', '1) one more word, 2) speaking more naturally, or 3) move on.'), null, '"more" in two options ⇒ ambiguous');
  assert.equal(idx("I don't know"), null);
  assert.equal(idx('Complete sentence.', 'Good, that sentence is correct.'), null, 'no menu ⇒ null');
});
test('resolveMenuPick — digits, "option n", singular / plural folded, runtime text never', () => {
  const idx = (s: string) => resolveMenuPick(s, MENU)?.index ?? null;
  assert.equal(idx('3'), 3);
  assert.equal(idx('Option 4, please.'), 4);
  assert.equal(idx('individual word'), 1);
  assert.equal(idx('sentences'), 2);
  assert.equal(idx('nine'), null, 'no option 9');
  assert.equal(idx('[runtime note] 2'), null);
});
test('fix round 1 (I-4): a number answers BY CONTENT when the options hold numbers; the index otherwise', () => {
  assert.equal(resolveMenuPick('3', 'Which is right? 1) 3, 2) 4, or 3) 5?')?.index, 1);
  assert.equal(resolveMenuPick('two', 'How many apples? 1) one apple, 2) three apples, 3) two apples.')?.index, 3);
  assert.equal(resolveMenuPick('two', 'Pick one: 1) words, 2) a sentence.')?.index, 2);
  assert.equal(resolveMenuPick('7', 'Which is right? 1) 3, 2) 4, or 3) 5?'), null, 'a number no option holds ⇒ null, never an index');
});
test('menuPickNote text (pin) and the VTR wiring', () => {
  assert.equal(menuPickNote({ index: 2, text: 'a complete sentence' }),
    '[runtime note — not from the student] The student chose option 2: "a complete sentence". Proceed with that option now; do not list the options again. Apply this silently; never mention this note.]');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes("const menuPick = resolveMenuPick(transcript, recentTutorTurnsRef.current[recentTutorTurnsRef.current.length - 1] ?? '');"));
  assert.ok(VTR.includes('runTranscript = `${menuPickNote(menuPick)}\\n\\n${runTranscript}`;'));
  assert.ok(VTR.includes("onDebugEvent?.('menu_pick_resolved',"));
});


// ── Task 33 §C: the menu asked twice without a pick ⇒ the engine moves on ──
{
  const CARD = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
  const ASKS = [
    'わかりました。 Then let\'s move to the next part, pronunciation. Would you like to practice words, a sentence, speaking more naturally, or skip? Just tell me the number.',
    'はい。 ただ、どの番号にしますか。 1番の単語か、2番の一文か、3番の自然な話し方か、4番のスキップか、教えてください。',
    'どういたしまして、ハルトさん。 まだ番号を決めていないので、もう一度選んでください。 1番は単語、2番は一文、3番は自然な話し方、4番はスキップです。',
  ];
  test('33 §C: menuAskedIn — the run\'s re-asks count; a drill turn does not', () => {
    for (const a of ASKS) assert.equal(menuAskedIn(a, CARD), true, a);
    assert.equal(menuAskedIn('Listen, then repeat after me: responsibilities.', CARD), false);
    assert.equal(menuAskedIn('Good. The stress is on the fourth syllable.', CARD), false);
  });
  test('33 §C: bare acknowledgements are not picks; a number / option word / skip is', () => {
    for (const x of ['OK.', 'Yes.', 'OK, thank you.', 'Yes, I understand.', 'I understand.', 'はい', 'I see.']) {
      assert.equal(isBareAcknowledgement(x), true, x);
      assert.equal(menuReplyIsPick(x, CARD, ASKS[1]), false, x);
    }
    for (const x of ['Two.', '2', 'The sentence, please.', 'Individual words.', 'Skip.', '3番', 'Number three.']) assert.equal(menuReplyIsPick(x, CARD, ASKS[1]), true, x);
  });
  test('33 §C: two unresolved asks + a non-pick ⇒ advance; a resolved pick ⇒ no advance', () => {
    const base = { menuPart: true, picked: false, asks: 2, replyIsPick: false, studentTurn: true };
    assert.equal(MENU_ASK_CAP, 2);
    assert.equal(menuAskCapDecision(base), 'advance');
    assert.equal(menuAskCapDecision({ ...base, asks: 1 }), 'wait', 'one ask: the student gets a second');
    assert.equal(menuAskCapDecision({ ...base, replyIsPick: true }), 'wait', 'this reply picks');
    assert.equal(menuAskCapDecision({ ...base, picked: true, asks: 5 }), 'wait', 'a pick was resolved in this part');
    assert.equal(menuAskCapDecision({ ...base, menuPart: false }), 'wait');
    assert.equal(menuAskCapDecision({ ...base, studentTurn: false }), 'wait');
    assert.match(menuUnpickedLead('Pronunciation', 'Summary'), /skipping the practice today/);
  });
  test('33 §C: VTR counts the asks at turn end and advances on the student turn (reason=menu_unpicked)', () => {
    const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
    assert.ok(VTR.includes("if (boardOffersChoices({ statement: mcCard }) && menuAskedIn(fullText, mcCard)) {"));
    assert.ok(VTR.includes('reason=menu_unpicked'));
    assert.ok(/=== 'advance'\) \{\s*const mcKind[\s\S]{0,200}applyResolvedAdvance\(mcPlan, mcSeg, mcNext\);/.test(VTR));
  });
}

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall menu-pick tests passed');
