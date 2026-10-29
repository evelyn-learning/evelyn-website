// Thinking cue label + default (2026-10-29, Praveen: the GDI chime + on-stage
// "Thinking…" goes to every tenant, in the language the tutor is teaching).
import { thinkingCueLabel, thinkingCueLanguage, parseThinkingCue, resolveThinkingCueClaim } from '../src/lib/tutor/voice/thinking-cue';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('english default', thinkingCueLabel(undefined) === 'Thinking…');
check('japanese', thinkingCueLabel('ja') === '考えています…');
check('spanish', thinkingCueLabel('es') === 'Pensando…');
check('french', thinkingCueLabel('fr') === 'Je réfléchis…');
check('german', thinkingCueLabel('de') === 'Ich überlege…');
check('portuguese', thinkingCueLabel('pt') === 'Pensando…');
check('chinese', thinkingCueLabel('zh') === '思考中…');
check('hindi', thinkingCueLabel('hi') === 'सोच रहा हूँ…');
check('unknown code falls back to english', thinkingCueLabel('xx') === 'Thinking…');

// Language choice: a monolingual non-English session uses that language; a
// bilingual ja session follows the tutor's last line (as before); plain
// English sessions stay English.
check('monolingual es', thinkingCueLanguage(['es'], 'Hola, ¿listo?') === 'es');
check('bilingual ja, tutor just spoke japanese', thinkingCueLanguage(['en', 'ja'], 'こんにちは') === 'ja');
check('bilingual ja, tutor just spoke english', thinkingCueLanguage(['en', 'ja'], 'Hello there') === undefined);
check('english only', thinkingCueLanguage(['en'], 'Hello') === undefined);
check('no languages', thinkingCueLanguage(undefined, 'Hello') === undefined);

// Default ON: an absent claim means on; an explicit false/"off" turns it off.
check('absent claim ⇒ on', resolveThinkingCueClaim(undefined) === true);
check('explicit false ⇒ off', resolveThinkingCueClaim(false) === false);
check('"off" ⇒ off', resolveThinkingCueClaim('off') === false);
check('true stays on', resolveThinkingCueClaim(true) === true);
check('parseThinkingCue unchanged', parseThinkingCue(undefined) === false && parseThinkingCue('on') === true);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all thinking-cue checks passed');
