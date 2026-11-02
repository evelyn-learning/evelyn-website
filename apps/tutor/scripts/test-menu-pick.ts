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
import { parseMenuOptions, resolveMenuPick, menuPickNote } from '../src/lib/tutor/voice/menu-pick';

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
test('menuPickNote text (pin) and the VTR wiring', () => {
  assert.equal(menuPickNote({ index: 2, text: 'a complete sentence' }),
    '[runtime note — not from the student] The student chose option 2: "a complete sentence". Proceed with that option now; do not list the options again. Apply this silently; never mention this note.]');
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(VTR.includes("const menuPick = resolveMenuPick(transcript, recentTutorTurnsRef.current[recentTutorTurnsRef.current.length - 1] ?? '');"));
  assert.ok(VTR.includes('runTranscript = `${menuPickNote(menuPick)}\\n\\n${runTranscript}`;'));
  assert.ok(VTR.includes("onDebugEvent?.('menu_pick_resolved',"));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall menu-pick tests passed');
