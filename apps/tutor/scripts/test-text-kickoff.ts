/** Round 4 (E5): text-mode kickoff for any goal on the host's tutor_opens claim;
 *  round-2 homework kickoff unchanged; voice never. Usage: npx tsx scripts/test-text-kickoff.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { textKickoffReady, textKickoffMessage } from '../src/app/tutor/components/session/text-kickoff';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };
const base = { sessionMode: 'text', sessionGoal: 'concept-review', tutorOpens: false, homeworkReady: false, hasPlanId: true, planLoaded: true };

assert(!textKickoffReady({ ...base, sessionMode: 'voice', tutorOpens: true }), 'voice never kicks off');
assert(textKickoffReady({ ...base, sessionGoal: 'homework-help', homeworkReady: true }), 'round 2: homework problems kick off without the claim');
assert(!textKickoffReady(base), 'no claim: a concept-review text session waits (other hosts unchanged)');
assert(textKickoffReady({ ...base, tutorOpens: true }), 'claim + plan loaded → kick off');
assert(!textKickoffReady({ ...base, tutorOpens: true, planLoaded: false }), 'claim + plan still loading → wait');
assert(textKickoffReady({ ...base, tutorOpens: true, hasPlanId: false, planLoaded: false }), 'claim + planless → kick off');
assert(textKickoffReady({ ...base, sessionGoal: 'homework-help', tutorOpens: true }), 'homework goal fell back to a normal plan: claim kicks off');
assert(textKickoffMessage(true) === '[start lesson]' && textKickoffMessage(false) === '[start session]', 'message mirrors the mic-tap start');

const root = join(__dirname, '..', 'src/app');
const vtr = readFileSync(join(root, 'tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const ts = readFileSync(join(root, 'tutor/components/session/TutorSession.tsx'), 'utf8');
const embed = readFileSync(join(root, 'tutor-portal/embed/page.tsx'), 'utf8');
const docs = readFileSync(join(root, 'tutor-portal/data/config-params.ts'), 'utf8');
assert(vtr.includes('textKickoffReady(') && !vtr.includes("sessionGoal !== 'homework-help' || !homeworkReady) return;"), 'wiring: VTR kickoff uses textKickoffReady');
assert(vtr.includes('textKickoffMessage('), 'wiring: kickoff message chosen by plan presence');
assert(ts.includes('tutorOpens={tutorOpens}'), 'wiring: TutorSession passes tutorOpens');
assert(embed.includes('tutor_opens?: boolean') && embed.includes('tutorOpens={tutorOpens}'), 'wiring: embed claim → prop');
assert(docs.includes("name: 'tutor_opens'"), 'docs: claim documented');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
