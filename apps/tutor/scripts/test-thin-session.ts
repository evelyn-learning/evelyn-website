import { isThinSession, countRealStudentTurns } from '../src/lib/tutor/student-profile/thin-session';
import { renderStudentProfileBlock } from '../src/lib/tutor/student-profile/render';
import { emptyProfile, upsertSessionMemory } from '../src/lib/tutor/student-profile/store';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); } }
const T = (role: 'student' | 'tutor', text: string) => ({ role, text });
// live 2026-09-05 S2 shape: one real student utterance, two idle nudges
check('one utterance ⇒ thin', isThinSession([T('tutor', 'game plan…'), T('student', "Uh, I didn't say anything. Should we start?"), T('tutor', 'Take your time'), T('tutor', 'No rush')]) === true);
check('synthetic markers are not turns', countRealStudentTurns([T('student', '[start lesson]'), T('student', '[System note: quiet]'), T('student', 'hi')]) === 1);
check('three real turns ⇒ not thin', isThinSession([T('student', 'a'), T('tutor', 'b'), T('student', 'c'), T('student', 'd')]) === false);
check('empty ⇒ thin', isThinSession([]) === true && isThinSession(undefined) === true);

let p = emptyProfile('t-thin');
p = upsertSessionMemory(p, { sessionId: 's-thin', endedAt: '2026-09-05T20:20:15Z', subject: 'math', topic: 'ap-statistics', losTouched: [], thin: true });
p = upsertSessionMemory(p, { sessionId: 's-real', endedAt: '2026-09-03T01:30:00Z', subject: 'test-prep', topic: 'dsat', losTouched: ['dsat.circles'], summary: 'Worked circles in the coordinate plane.' });
const block = renderStudentProfileBlock(p, {} as any);
check('thin session is not listed as a prior session', !/ap-statistics/.test(block), block.slice(0, 300));
check('the real session still is', /circles/.test(block));
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
