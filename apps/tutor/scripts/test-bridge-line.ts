/** Bridge line: fixed, model-free first words. Run: npx tsx scripts/test-bridge-line.ts */
import { bridgeLineFor, bridgeSpokeName, BRIDGE_SPOKEN_DIRECTIVE, BRIDGE_SPOKEN_NO_NAME_DIRECTIVE } from '@/lib/tutor/voice/bridge-line';
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
// 2026-10-18 (embed-1792378728971, GDI demo): "Hey Sato. Let’s get started." opened a Japanese
// beginner lesson — English, casual, and the FAMILY name of "Sato Kenji". A session whose tutor
// languages include Japanese gets a Japanese line with no name (a romaji name has no safe order;
// the brain greets by name right after); any other non-Latin language gets no bridge at all.
checks.push(['ja session → Japanese line, no name', bridgeLineFor({ ...v, studentName: 'Sato Kenji', inFlow: false, tutorLanguages: ['ja', 'en'] }) === 'こんにちは。それでは、始めましょう。']);
checks.push(['ja session in-flow → same Japanese line (no English title)', bridgeLineFor({ ...v, studentName: 'Sato Kenji', title: 'Experiences — Starter', inFlow: true, tutorLanguages: ['ja'] }) === 'こんにちは。それでは、始めましょう。']);
checks.push(['ja session: no English and no name anywhere', !/Hey|Sato|Kenji|let/i.test(bridgeLineFor({ ...v, studentName: 'Sato Kenji', inFlow: false, tutorLanguages: ['ja'] }) ?? 'Hey')]);
checks.push(['other non-Latin language without a line → null', bridgeLineFor({ ...v, studentName: 'Amal', inFlow: false, tutorLanguages: ['ar', 'en'] }) === null]);
checks.push(['English-only session unchanged', bridgeLineFor({ ...v, studentName: 'Alex', inFlow: false, tutorLanguages: ['en'] }) === 'Hey Alex. Let’s get started.']);
checks.push(['no-name directive: hello was said, name was not', /without the student's name/i.test(BRIDGE_SPOKEN_NO_NAME_DIRECTIVE) && /do not say hello again/i.test(BRIDGE_SPOKEN_NO_NAME_DIRECTIVE)]);
checks.push(['bridgeSpokeName: ja line did not say the name', bridgeSpokeName('こんにちは。それでは、始めましょう。') === false && bridgeSpokeName('Hey Alex. Let’s get started.') === true]);
let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
