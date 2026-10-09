/** Round 4 (E5): text-mode kickoff for any goal on the host's tutor_opens claim;
 *  round-2 homework kickoff unchanged; voice never. Usage: npx tsx scripts/test-text-kickoff.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { textKickoffReady, textKickoffMessage, isKickoffMessage, decideTypedDuringTurn } from '../src/app/tutor/components/session/text-kickoff';

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

// 2026-10-08 (portal-09624999): the student typed at 8.0 s while the automatic
// opening turn (dispatched at 0.4 s, first sentence at 10.0 s) was in flight.
// The composer cleared the busy flag without aborting it, so the typed turn
// ran beside it (0.4–11.6 s and 8.1–19.7 s): two tutor messages back to back,
// the first one answering nothing the student had written.
const typedAt = { sessionMode: 'text', brainBusy: true, inFlightTranscript: '[start lesson]' as string | null, inFlightShown: false };
assert(decideTypedDuringTurn(typedAt) === 'supersede_opening', 'recorded: typed while the opening turn has shown nothing → the opening turn is aborted');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: '[start session]' }) === 'supersede_opening', 'the planless opener is an opening turn too');
assert(decideTypedDuringTurn({ ...typedAt, inFlightShown: true }) === 'queue_after_opening', 'the opening turn has already shown a sentence → the typed message runs right after it');
assert(decideTypedDuringTurn({ ...typedAt, brainBusy: false }) === 'dispatch', 'nothing in flight → dispatched as before');
assert(decideTypedDuringTurn({ ...typedAt, brainBusy: false, inFlightShown: true }) === 'dispatch', 'nothing in flight → dispatched as before (whatever the last turn showed)');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: 'x = 4' }) === 'force_clear', 'an ordinary student turn in flight → unchanged (busy flag force-cleared)');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: '[Skip-button-clicked: advance]' }) === 'force_clear', 'another runtime dispatch in flight → unchanged');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: null }) === 'force_clear', 'busy with no turn on record (a stale flag) → unchanged');
assert(decideTypedDuringTurn({ ...typedAt, sessionMode: 'voice' }) === 'force_clear', 'voice → unchanged');
assert(isKickoffMessage(' [start lesson] ') && isKickoffMessage('[start session]') && !isKickoffMessage('start lesson') && !isKickoffMessage(null) && !isKickoffMessage('[Session-resumed]'), 'only the two session-start kickoffs are opening turns');

const composer = vtr.slice(vtr.indexOf('const typedDuringTurn = decideTypedDuringTurn({'));
assert(vtr.split('decideTypedDuringTurn({').length - 1 === 1 && composer.length > 0, 'wiring: the composer decides with decideTypedDuringTurn');
assert(/typedDuringTurn === 'supersede_opening'[\s\S]{0,900}openerSupersededByStudentRef\.current = true;[\s\S]{0,400}inFlightBrainAbortRef\.current\?\.abort\(\)/.test(composer), 'wiring: superseding flags the opening turn, then aborts it');
assert(/typedDuringTurn === 'force_clear'\) \{[\s\S]{0,300}setBrainBusy\(false\);\s*queuedTranscriptsRef\.current = \[\];/.test(composer), 'wiring: the busy flag is force-cleared only on force_clear');
assert(vtr.includes('const isAbort =\n        supersededByStudent || ('), 'wiring: an opening turn aborted for the student is a silent abort — no opener retry, no stall retry, no apology');
assert(vtr.includes('openingTurnPendingRef.current && !supersededByStudent'), 'wiring: no fallback opener card for it, and the student turn stays the opening turn');
assert(vtr.split('markInFlightTurnShown()').length - 1 === 2, 'wiring: both sentence-dispatch sites mark the turn in flight as shown');
assert(vtr.includes('inFlightTurnRef.current = { transcript, shown: false };') && vtr.includes('inFlightTurnRef.current = { transcript: combined, shown: false };') && vtr.includes('inFlightTurnRef.current = null;'), 'wiring: the turn in flight is recorded per dispatch (direct and queue-drained) and cleared at the end');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
