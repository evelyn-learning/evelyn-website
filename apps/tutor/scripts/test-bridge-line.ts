/** Bridge line: fixed, model-free first words. Run: npx tsx scripts/test-bridge-line.ts */
import { bridgeLineFor, BRIDGE_SPOKEN_DIRECTIVE } from '@/lib/tutor/voice/bridge-line';
const checks: Array<[string, boolean]> = [];
const v = { inputMode: 'voice' as const, resume: false };
checks.push(['in-flow with name and title', bridgeLineFor({ ...v, studentName: 'Maya', title: 'Own a Piece?', inFlow: true }) === 'Hey Maya. Own a Piece? — let’s look at it.']);
checks.push(['in-flow without title', bridgeLineFor({ ...v, studentName: 'Maya', inFlow: true }) === 'Hey Maya. Let’s look at it.']);
checks.push(['standalone with name', bridgeLineFor({ ...v, studentName: 'Alex', inFlow: false }) === 'Hey Alex. Let’s get started.']);
checks.push(['no name', bridgeLineFor({ ...v, inFlow: false }) === 'Hey. Let’s get started.']);
checks.push(['first name only', bridgeLineFor({ ...v, studentName: 'Maya Chen', inFlow: false })?.startsWith('Hey Maya.') === true]);
checks.push(['long title is cut', (bridgeLineFor({ ...v, studentName: 'M', title: 'x'.repeat(200), inFlow: true }) ?? '').length < 90]);
checks.push(['text mode → null', bridgeLineFor({ ...v, inputMode: 'text', studentName: 'Maya', inFlow: true }) === null]);
checks.push(['resume → null', bridgeLineFor({ ...v, resume: true, studentName: 'Maya', inFlow: true }) === null]);
checks.push(['directive tells the brain not to greet again', /already greeted|do not greet again/i.test(BRIDGE_SPOKEN_DIRECTIVE)]);
let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
