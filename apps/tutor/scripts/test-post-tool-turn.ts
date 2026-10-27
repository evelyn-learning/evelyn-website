/**
 * Around a tool call in the brain's agent loop (voice/post-tool-turn.ts).
 *
 * Regressions under test (GAC typed sessions, 2026-10-26):
 *  A. "Sure, let's take this new limit one step at a time. I'm putting it on
 *     the board now." + show_equation + end_turn — the turn never asked
 *     anything (portal-55fb8446; same shape in four more subjects).
 *  B. A second call after "show_equation executed successfully." wrote the
 *     reply again in other words (portal-871c8a4e, -55fb8446, -5c2f9dea).
 *
 * Run: npx tsx scripts/test-post-tool-turn.ts
 */
import {
  decideThinToolTurnRescue,
  toolResultWithDelivered,
  isNearDuplicateSentence,
  contentWords,
  THIN_TURN_RESCUE_INSTRUCTION,
} from '../src/lib/tutor/voice/post-tool-turn';

let failures = 0;
let passed = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got ${JSON.stringify(got)}` : ''}`); }
  else passed++;
}

// ── A. thin tool turn ────────────────────────────────────────────────────
const thin = {
  enabled: true,
  text: "Sure, let's take this new limit one step at a time. I'm putting it on the board now.",
  lastResponseToolUses: 1,
  lastStopReason: 'end_turn',
  toolCalls: [{ name: 'show_equation', args: { latex: 'x' } }],
  muted: false,
};
check('A: production lead-in + tool + end_turn → rescue', decideThinToolTurnRescue(thin).rescue, decideThinToolTurnRescue(thin));
for (const t of [
  "Let's take this one step at a time.",
  'Happy to help with that one. Here it is on the board.',
  "Let's take a look at this one.",
]) check(`A: "${t}" → rescue`, decideThinToolTurnRescue({ ...thin, text: t, toolCalls: [{ name: 'show_problem' }] }).rescue);
check('A: a question already asked → no rescue',
  decideThinToolTurnRescue({ ...thin, text: 'Here it is. What would you do first?' }).reason === 'has-question');
check('A: no text → left to the Option-A rescue', decideThinToolTurnRescue({ ...thin, text: '  ' }).reason === 'no-text');
check('A: no tool in the last response → no rescue',
  decideThinToolTurnRescue({ ...thin, lastResponseToolUses: 0 }).reason === 'no-tool-in-last-response');
check('A: stop=tool_use (capped loop) → no rescue',
  decideThinToolTurnRescue({ ...thin, lastStopReason: 'tool_use' }).reason === 'tool-round-trip');
check('A: closing the session → no rescue',
  decideThinToolTurnRescue({ ...thin, text: 'Great work today.', toolCalls: [{ name: 'close_session_notes' }] }).reason === 'closing-tool');
check('A: a student hold → no rescue',
  decideThinToolTurnRescue({ ...thin, text: 'Sure, take your time.', toolCalls: [{ name: 'hold_for_student' }] }).reason === 'closing-tool');
check('A: advance to the recap → no rescue (the recap card path owns it)',
  decideThinToolTurnRescue({ ...thin, text: "Sounds good. Let's wrap up with a quick recap.", toolCalls: [{ name: 'advance_lesson', args: { to: 'recap' } }, { name: 'show_segment_card', args: { segmentId: 'recap' } }] }).reason === 'recap');
check('A: a guard-stopped reply → no rescue', decideThinToolTurnRescue({ ...thin, muted: true }).reason === 'muted');
check('A: flag off → no rescue', decideThinToolTurnRescue({ ...thin, enabled: false }).reason === 'flag-off');
check('A: the instruction forbids repeating and asks one question',
  /Do not repeat or rephrase/.test(THIN_TURN_RESCUE_INSTRUCTION) && /one question/.test(THIN_TURN_RESCUE_INSTRUCTION) && /no tools/i.test(THIN_TURN_RESCUE_INSTRUCTION));
check('A: instruction is generic (no subject words)', !/limit|equation|slope|chemistry|denominator/i.test(THIN_TURN_RESCUE_INSTRUCTION));

// ── B1. tool_result says what was already delivered ──────────────────────
{
  const said = "The limit's final value is 1/4. How do you get rid of the 0 in the denominator?";
  const r = toolResultWithDelivered('show_equation executed successfully.', 'show_equation', said, true);
  check('B: default ack quotes what was delivered', r.startsWith('show_equation executed successfully.') && r.includes(`«${said}»`), r);
  check('B: default ack forbids restating', /Do not restate or rephrase/.test(r), r);
  check('B: nothing said yet → bare ack', toolResultWithDelivered('show_equation executed successfully.', 'show_equation', ' ', true) === 'show_equation executed successfully.');
  const data = '{"canonicalText":"Solve 2x = 6"}';
  check('B: a resolver result is unchanged', toolResultWithDelivered(data, 'generate_problem', said, true) === data);
  const rej = 'show_equation rejected: bad latex. Do not retry with the same args — emit a corrected call or skip this tool.';
  check('B: a rejection is unchanged', toolResultWithDelivered(rej, 'show_equation', said, true) === rej);
  check('B: flag off → bare ack', toolResultWithDelivered('show_equation executed successfully.', 'show_equation', said, false) === 'show_equation executed successfully.');
  const long = 'word '.repeat(400);
  const clipped = toolResultWithDelivered('x executed successfully.', 'x', long, true);
  check('B: long text is clipped to its tail', clipped.length < 900 && clipped.includes('«…'), clipped.length);
}

// ── B2. near-duplicate backstop, on the production replies ───────────────
{
  // portal-55fb8446 "maybe 1/4?"
  const first = [
    "The limit's final value is $\\frac{1}{4}$, so $\\frac{1}{4}$ is the right final answer.",
    "You said you weren't sure, so show me the step that gets you there.",
    'How do you get rid of the $0$ in the denominator?',
  ];
  check('B: restated verdict dropped', isNearDuplicateSentence("The limit's value is $\\frac{1}{4}$, which is the right final answer.", first));
  check('B: restated question dropped', isNearDuplicateSentence('How do you deal with the $0$ in the denominator?', first));
}
{
  // portal-5c2f9dea first reply
  const first = [
    'Your working is right: GPP minus respiration gives NPP, and 1000 minus 600 is 400 kcal/m²/yr, which is the value you wrote.',
    'Part (a) is done.',
    'For part (b), the ten percent rule says about 10% of energy passes up each trophic level.',
    'Starting from your 400, how much would reach the primary consumers?',
  ];
  check('B: APES restated working dropped', isNearDuplicateSentence('Your working is right: the equation is on the board now, and it gives the 400 you wrote.', first));
  check('B: APES restated rule dropped', isNearDuplicateSentence('For part (b), the ten percent rule says about 10% of energy passes to the next trophic level.', first));
  check('B: APES restated question dropped', isNearDuplicateSentence('Starting from your 400, how much reaches the primary consumers?', first));
}
{
  // portal-871c8a4e "maybe y = -2?"
  const first = [
    "Let's check it in the original equation.",
    'The left side is 5(2(−2) + 1) = −15, and the right side is 3(−2) − 9 = −15.',
    'Both sides match, so y = −2 is the value you gave.',
    'Now show me the steps that get you there, starting from 5(2y + 1) = 3y − 9.',
  ];
  check('B: Algebra restated check dropped',
    isNearDuplicateSentence("Let's check it in the original equation: 5(2(−2) + 1) = −15 and 3(−2) − 9 = −15, so y = −2 does satisfy the equation.", first));
}
// Must keep.
{
  const lead = ["Here's 2x + 3 = 7 on the board."];
  check('keep: a new question built from the lead-in\'s own words', !isNearDuplicateSentence('What is 2x + 3 = 7 solved for x?', lead));
  check('keep: nothing earlier → never a duplicate', !isNearDuplicateSentence('Both sides match, so y = 2 works.', []));
  check('keep: short sentences are never dropped', !isNearDuplicateSentence('Nice work.', ['Nice work there.']));
  check('keep: new content after a check',
    !isNearDuplicateSentence('Next, subtract 4 from all three parts of the inequality.', ['Your value of 6 matches the final answer.']));
  check('keep: a different question after an earlier one',
    !isNearDuplicateSentence('Which number do you subtract from the middle part?', ['How many transfers does the energy pass through?']));
  check('contentWords drops LaTeX commands and function words',
    [...contentWords("The limit's value is $\\frac{1}{4}$")].sort().join(',') === '1,4,limit,value', [...contentWords("The limit's value is $\\frac{1}{4}$")]);
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log(`test:post-tool-turn PASS (${passed} checks)`);
