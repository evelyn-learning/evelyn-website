// Board handwriting (demo-polish, 2026-10-29): an upright hand (Kalam first,
// 24px) with a left-to-right writing reveal — a teacher's feedback was that
// many students cannot read cursive (Caveat) on the board.
import { NOTE_FONT_PX, NOTE_LINE_PX, noteFontFamilyVars, noteRevealMs } from '../src/lib/tutor/whiteboard/note-font';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('kalam first', noteFontFamilyVars().startsWith('var(--font-kalam)'));
check('caveat kept as the fallback', noteFontFamilyVars().includes('var(--font-caveat)'));
check('24px', NOTE_FONT_PX === 24);
check('line height follows', NOTE_LINE_PX === 29);
check('reveal scales with length', noteRevealMs('ten chars!') === 700);
check('reveal caps at 2.5 s', noteRevealMs('x'.repeat(100)) === 2500);
check('empty note has no reveal', noteRevealMs('') === 0);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all note-font checks passed');
