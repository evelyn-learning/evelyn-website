// scripts/test-soft-rejections.ts
// Run: npx tsx scripts/test-soft-rejections.ts
//
// A rejected whiteboard call must not cost the whole turn:
//  · label collision ⇒ paint with a unique label (never reject, never drop)
//  · unresolvable scroll/scribble/highlight target ⇒ drop that one call
//  · a runtime-substituted card that dedups against the same problem ⇒ no-op
//  · retries that remain carry the student's original words
import { strict as assert } from 'node:assert';
import {
  resolveLabelCollision,
  relabelCountAfter,
  decideUnresolvedTarget,
  decideSubstitutedDuplicate,
  sameProblemStatement,
  statementsReadIdentically,
  decideLabelReuseOnCorrection,
  hasSelfCorrectionMarker,
} from '../src/lib/tutor/whiteboard/soft-rejections';
import {
  buildValidatorFeedback,
  studentContextNote,
  TURN_CONTINUATION_ACTION,
  VALIDATOR_FEEDBACK_PREFIX,
} from '../src/lib/tutor/orchestrator/validator-feedback';

let n = 0;
const ok = (name: string, cond: boolean) => { assert.ok(cond, name); n++; };

// ── label collision ────────────────────────────────────────────────────────
// Same visible label, different latex, prior still on the page ⇒ paint with
// the label made unique.
assert.deepEqual(
  resolveLabelCollision({ enabled: true, rawLabel: 'Final answer', priorLabel: 'Final answer', relabelsSoFar: 0 }),
  { kind: 'paint', label: 'Final answer (2)', changed: true },
); n++;
// A second collision on the same heading keeps counting.
assert.deepEqual(
  resolveLabelCollision({ enabled: true, rawLabel: 'Final answer', priorLabel: 'Final answer', relabelsSoFar: 1 }),
  { kind: 'paint', label: 'Final answer (3)', changed: true },
); n++;
// Case / spacing differences are still the same visible heading.
assert.deepEqual(
  resolveLabelCollision({ enabled: true, rawLabel: '  final  Answer ', priorLabel: 'Final answer', relabelsSoFar: 0 }),
  { kind: 'paint', label: 'final Answer (2)', changed: true },
); n++;
// The collision was a NORMALISATION artefact — the two headings already read
// differently on the board. Paint as written.
assert.deepEqual(
  resolveLabelCollision({ enabled: true, rawLabel: 'Clearing with the LCD (10)', priorLabel: 'Clearing with the LCD (6)', relabelsSoFar: 0 }),
  { kind: 'paint', label: 'Clearing with the LCD (10)', changed: false },
); n++;
assert.deepEqual(
  resolveLabelCollision({ enabled: true, rawLabel: 'Step 1: Sum ✓', priorLabel: 'Step 1: Sum', relabelsSoFar: 0 }),
  { kind: 'paint', label: 'Step 1: Sum ✓', changed: false },
); n++;
// Kill switch off ⇒ the pre-fix reject-with-reason.
assert.deepEqual(
  resolveLabelCollision({ enabled: false, rawLabel: 'Final answer', priorLabel: 'Final answer', relabelsSoFar: 0 }),
  { kind: 'reject' },
); n++;

// Review finding D: the counter is scoped like the label. When the label's
// scope resets (decideLabelDuplicate → 'register': new page / new problem /
// prior off the board) the count restarts, so the first collision in the new
// scope reads "(2)", not "(3)".
{
  let count = 0;
  const collide = () => {
    const r = resolveLabelCollision({ enabled: true, rawLabel: 'Final answer', priorLabel: 'Final answer', relabelsSoFar: count });
    count = relabelCountAfter({ event: r.kind === 'paint' && r.changed ? 'relabelled' : 'unchanged', countSoFar: count });
    return r.kind === 'paint' ? r.label : '(rejected)';
  };
  assert.equal(collide(), 'Final answer (2)'); n++;
  assert.equal(collide(), 'Final answer (3)'); n++;
  // new page: the label is registered afresh
  count = relabelCountAfter({ event: 'scope-reset', countSoFar: count });
  assert.equal(count, 0); n++;
  assert.equal(collide(), 'Final answer (2)'); n++;
}
assert.equal(relabelCountAfter({ event: 'relabelled', countSoFar: 0 }), 1); n++;
assert.equal(relabelCountAfter({ event: 'unchanged', countSoFar: 2 }), 2); n++;
assert.equal(relabelCountAfter({ event: 'scope-reset', countSoFar: 7 }), 0); n++;

// ── unresolvable target ────────────────────────────────────────────────────
assert.equal(decideUnresolvedTarget({ enabled: true, action: 'scrollTo' }), 'drop'); n++;
assert.equal(decideUnresolvedTarget({ enabled: true, action: 'scribble' }), 'drop'); n++;
assert.equal(decideUnresolvedTarget({ enabled: true, action: 'highlight' }), 'drop'); n++;
assert.equal(decideUnresolvedTarget({ enabled: false, action: 'scrollTo' }), 'reject'); n++;
// Content renders are never soft: a missing card / wrong figure still rejects.
assert.equal(decideUnresolvedTarget({ enabled: true, action: 'showProblem' }), 'reject'); n++;
assert.equal(decideUnresolvedTarget({ enabled: true, action: 'showEquation' }), 'reject'); n++;

// ── substituted duplicate ──────────────────────────────────────────────────
const authored = 'A ball rolls down a 30° incline of length 2 m. Find its *acceleration*.';
ok('identical modulo emphasis/whitespace is the same problem',
  sameProblemStatement('A ball rolls down a 30° incline of length 2 m.  Find its acceleration.', authored));
ok('same numbers, light rewording is the same problem',
  sameProblemStatement('A ball rolls down an incline of length 2 m at 30°. Find its acceleration.', authored));
ok('different numbers is a DIFFERENT problem',
  !sameProblemStatement('A ball rolls down a 45° incline of length 5 m. Find its acceleration.', authored));
ok('unrelated text is a different problem',
  !sameProblemStatement('Find the mean of 2, 4, 6, 8, 10.', authored));
ok('empty is never the same problem', !sameProblemStatement('', authored) && !sameProblemStatement(authored, ''));

// ── same-problem comparator, inequality lessons (substitute-same-only round) ─
// Production: the brain posed a ticket-resale problem and the board showed the
// authored "Solve and graph: 4x + 9 ≤ 33" while the speech described tickets.
const authoredIneq = 'Solve and graph: 4x + 9 ≤ 33';
ok('ticket word problem is NOT the authored inequality',
  !sameProblemStatement('A reseller pays an $80 fee and $15 per ticket and must spend less than $500: 15n + 80 < 500. How many tickets can she buy?', authoredIneq));
ok('light rewording of the authored inequality is the same problem',
  sameProblemStatement('Solve 4x + 9 ≤ 33 and graph the solution', authoredIneq));
ok('a longer rewording (extra instruction words) is still the same problem',
  sameProblemStatement('Solve 4x + 9 ≤ 33 and graph the solution on a number line', authoredIneq));
ok('the bare relation is the same problem as the authored card that wraps it',
  sameProblemStatement('4x + 9 ≤ 33', authoredIneq));
ok('latex vs unicode comparator is the same problem',
  sameProblemStatement('Solve and graph: $4x + 9 \\le 33$', authoredIneq));
ok('a FLIPPED comparator is a different problem (same numbers, same words)',
  !sameProblemStatement('Solve and graph: 4x + 9 ≥ 33', authoredIneq));
ok('strict vs non-strict comparator is a different problem',
  !sameProblemStatement('Solve and graph: 4x + 9 < 33', authoredIneq));
ok('same numbers in another role, unrelated words, is a different problem',
  !sameProblemStatement('A rectangle has sides 4 and 9 and a diagonal under 33. Find its area.', authoredIneq));
ok('same numbers attached to different terms is a different problem',
  !sameProblemStatement('Solve 9x + 4 ≤ 33 and graph the solution on a number line', authoredIneq));
// Containment never rescues a single shared number.
ok('one shared number + contained words is not enough',
  !sameProblemStatement('Find the area when the side is 5 and explain every step you take carefully', 'Find the area 5'));

// statementsReadIdentically — "is this exact card the one on the board?"
ok('identical modulo emphasis / $ / whitespace / case reads identically',
  statementsReadIdentically('Solve and  graph: $4x + 9 ≤ 33$', '*Solve* and graph: 4x + 9 ≤ 33'));
ok('a different sign does not read identically',
  !statementsReadIdentically('Solve and graph: 4x - 9 ≤ 33', authoredIneq));
ok('empty never reads identically', !statementsReadIdentically('', '') && !statementsReadIdentically(authoredIneq, ''));

// Runtime rewrote show_problem → show_segment_card, the card is already on
// the board and it IS the problem the brain asked for ⇒ nothing is missing.
assert.deepEqual(
  decideSubstitutedDuplicate({ enabled: true, substitutedByRuntime: true, brainStatement: authored, authoredStatement: authored }),
  { silent: true, reason: 'same-problem-already-on-board' },
); n++;
// The brain asked for a different problem ⇒ its card really is missing —
// keep the rejection (guards a missing problem card).
assert.deepEqual(
  decideSubstitutedDuplicate({ enabled: true, substitutedByRuntime: true, brainStatement: 'Find the mean of 12, 14, 16.', authoredStatement: 'Find the mean of 2, 4, 6.' }),
  { silent: false, reason: 'different-problem' },
); n++;
// The brain itself emitted show_segment_card ⇒ not this rule's business.
assert.deepEqual(
  decideSubstitutedDuplicate({ enabled: true, substitutedByRuntime: false, brainStatement: authored, authoredStatement: authored }),
  { silent: false, reason: 'not-substituted' },
); n++;
assert.deepEqual(
  decideSubstitutedDuplicate({ enabled: false, substitutedByRuntime: true, brainStatement: authored, authoredStatement: authored }),
  { silent: false, reason: 'flag-off' },
); n++;

// ── validator feedback carries the student's words ─────────────────────────
const rej = [{ action: 'show_diagram', reason: 'params failed validation' }];

// Legacy shape (context off) is byte-stable: prefix, numbered list, the
// delivered-in-full note.
const legacy = buildValidatorFeedback({ rejections: rej, attemptKilled: false, originalTranscript: "I don't know", includeStudentContext: false });
ok('legacy starts with the bracket prefix', legacy.startsWith(`${VALIDATOR_FEEDBACK_PREFIX} Your last turn emitted tool call(s) that the runtime structural validator rejected:\n[1] show_diagram: params failed validation\n`));
ok('legacy delivered note', legacy.includes('DELIVERED IN FULL') && legacy.endsWith('do not re-ask.'));
ok('legacy has no student block', !legacy.includes("I don't know"));

const killedLegacy = buildValidatorFeedback({ rejections: rej, attemptKilled: true, originalTranscript: 'x', includeStudentContext: false });
ok('killed note', killedLegacy.includes('CUT OFF by a kill bridge') && !killedLegacy.includes('DELIVERED IN FULL'));

// With context: the student's exact words ride in the feedback message.
const withCtx = buildValidatorFeedback({ rejections: rej, attemptKilled: true, originalTranscript: "I don't know", includeStudentContext: true });
ok('context: still bracket-prefixed (server treats it as non-spoken)', withCtx.startsWith('['));
ok('context: begins with the legacy body', withCtx.startsWith(killedLegacy));
ok('context: quotes the student verbatim', withCtx.includes(`"I don't know"`));
ok('context: says it is not new input / not agreement', /not (?:a )?new input/i.test(withCtx) && /agreement/i.test(withCtx));

// A runtime-triggered turn ([start lesson], resume kickoff, button markers)
// has no student words — say so instead of quoting the marker as speech.
const synthetic = studentContextNote('[Session-resumed: the student reloaded mid-session; pick up exactly where you left off]');
ok('synthetic: names the runtime event', synthetic.includes('[Session-resumed'));
ok('synthetic: never claims the student said it', /not by anything the student said/i.test(synthetic));
ok('empty transcript ⇒ no note', studentContextNote('   ') === '');
// Very long utterances are capped, not dropped.
const long = studentContextNote('a'.repeat(2000));
ok('long utterance capped', long.length < 1100 && long.includes('aaaa'));
// Quotes in the student's words cannot break out of the quoted span.
ok('quotes neutralised', !studentContextNote('he said "yes" to me').includes('"yes"'));

// A turn-continuation request (no tool was rejected — the turn just stopped
// early) gets its own body: continue, don't repeat, hand the floor over.
const cont = buildValidatorFeedback({
  rejections: [{ action: TURN_CONTINUATION_ACTION, reason: 'it made no whiteboard tool call and asked nothing' }],
  attemptKilled: false, originalTranscript: '[start lesson]', includeStudentContext: true,
});
ok('continuation: bracket-prefixed', cont.startsWith(VALIDATOR_FEEDBACK_PREFIX));
ok('continuation: not framed as a rejected tool call', !cont.includes('structural validator rejected'));
ok('continuation: do not repeat', /do not repeat/i.test(cont));
ok('continuation: board + hand the floor', /board/i.test(cont) && /question/i.test(cont));
ok('continuation: carries the reason', cont.includes('it made no whiteboard tool call and asked nothing'));
// Mixed with a real rejection (or after a kill) ⇒ the ordinary body, with the
// continuation listed as one of the items.
const mixed = buildValidatorFeedback({
  rejections: [...rej, { action: TURN_CONTINUATION_ACTION, reason: 'stopped early' }],
  attemptKilled: false, originalTranscript: 'ok', includeStudentContext: false,
});
ok('mixed: ordinary body', mixed.includes('structural validator rejected') && mixed.includes(`[2] ${TURN_CONTINUATION_ACTION}: stopped early`));

// ── label reuse in a correction turn (2026-10-04) ──────────────────────────
// Live: "How to read it aloud" boarded with latex "x > 3 or x < 3"; the
// self-correction reused the label and the relabel rule painted
// "How to read it aloud (2)" beside the wrong original.
//
// CHANGED (review item 3). The first version of this block pinned three
// behaviours that deleted an earlier card on weak evidence, all reversed:
//   · `correctionNoteThisTurn: true` alone ⇒ replace (the flag is true for
//     ANY delivered judge note, usually about the student's verdict) — the
//     input is gone from the rule;
//   · loose markers ⇒ replace: "Correction: …", "That line should read …",
//     "Actually, …", "My mistake — …", "I misspoke there." — now relabel;
//   · no look at the two equations at all — now the new latex must be a
//     small edit of the earlier card's.
{
  const PRIOR = 'x > 3 \\text{ or } x < 3';
  const FIXED = 'x > 5 \\text{ or } x < 3';
  const base = {
    enabled: true, tutorSpeechThisTurn: '',
    priorLatex: PRIOR, newLatex: FIXED,
    priorItemId: 'showEquation-4' as string | null, priorPendingRevision: false,
  };
  const d = (over: Partial<typeof base>) => decideLabelReuseOnCorrection({ ...base, ...over });

  // The production case.
  {
    const r = d({
      tutorSpeechThisTurn: 'I notice the board says x > 3 or x < 3 in the label… let me fix that label.',
      priorLatex: 'x > 3 or x < 3', newLatex: 'x > 5 or x < 3',
    });
    ok('production case ⇒ replace', r.action === 'replace' && r.reason === 'self-correction-speech');
  }
  // (i) first-person statements about the tutor's OWN earlier writing.
  for (const speech of [
    'Let me fix that card.',
    'Let me correct that.',
    'Let me rewrite that line.',
    'Let me redo that.',
    'I wrote that wrong a moment ago.',
    'I made a mistake there.',
    'I made an error on the board.',
    'I made a mistake in that line.',
    'That line was wrong.',
    'That label is wrong.',
    'That equation is wrong, sorry.',
    'Scratch that, here it is again.',
    'That line should read x greater than 5, not x greater than 3.',
    'What I wrote should say 5, not 3.',
  ]) {
    const r = d({ tutorSpeechThisTurn: speech });
    ok(`own-writing correction + small edit ⇒ replace: "${speech}"`, r.action === 'replace' && r.reason === 'self-correction-speech');
  }
  // The reviewer's eight false positives — every one keeps the earlier card.
  for (const speech of [
    "Actually, that's a great way to see it.",
    'Good correction!',
    'Nice self-correction there.',
    'Your answer should say x = 4.',
    'So the next line should read 2x = 8.',
    'One small correction to your work: the sign.',
    'My bad for going fast.',
    "Now, actually, let's write step 2.",
  ]) {
    const r = d({ tutorSpeechThisTurn: speech });
    ok(`not about the tutor's own writing ⇒ relabel: "${speech}"`, r.action === 'relabel' && r.reason === 'not-a-correction');
    ok(`marker detector false: "${speech}"`, hasSelfCorrectionMarker(speech) === false);
  }
  // Formerly-accepted loose markers and ordinary speech.
  for (const speech of [
    'Correction: it is x greater than 5 or x less than 3.',
    'That line should read x is greater than 5.',
    'Actually, the first part is x greater than 5.',
    'My mistake — here is the right inequality.',
    'I misspoke there.',
    'Now the final answer for part b.',
    'Great, here is the next step.',
    'That is actually a really good question.',
    'The answer should be positive, so we keep going.',
    'You made a mistake in that line, can you spot it?',
    'Can you fix that line for me?',
    '',
  ]) {
    const r = d({ tutorSpeechThisTurn: speech });
    ok(`ordinary label reuse keeps the relabel: "${speech}"`, r.action === 'relabel' && r.reason === 'not-a-correction');
  }
  // (ii) the new equation must be a small edit of the earlier one.
  const FIX = 'Let me fix that.';
  ok('same label, completely different equation ⇒ a new step ⇒ relabel',
    d({ tutorSpeechThisTurn: FIX, priorLatex: '2x + 6 = 14', newLatex: 'x = 4' }).reason === 'different-equation'
    && d({ tutorSpeechThisTurn: FIX, priorLatex: '2x + 6 = 14', newLatex: 'x = 4' }).action === 'relabel');
  ok('different equation: "Step" 3x + 2 = 11 → \\frac{9}{3} = x', d({ tutorSpeechThisTurn: FIX, priorLatex: '3x + 2 = 11', newLatex: '\\frac{9}{3} = x' }).action === 'relabel');
  ok('one sign changed ⇒ replace', d({ tutorSpeechThisTurn: FIX, priorLatex: '2x - 6 = 14', newLatex: '2x + 6 = 14' }).action === 'replace');
  ok('one side rewritten, the other identical ⇒ replace',
    d({ tutorSpeechThisTurn: FIX, priorLatex: 'y = 3', newLatex: 'y = \\frac{12 - 3}{4 - 1}' }).action === 'replace');
  ok('whitespace / \\left \\right differences are not differences',
    d({ tutorSpeechThisTurn: FIX, priorLatex: '\\left( x+1 \\right)^2 = 8', newLatex: '(x + 1)^2 = 9' }).action === 'replace');
  ok('earlier latex unknown ⇒ relabel', d({ tutorSpeechThisTurn: FIX, priorLatex: '' }).reason === 'different-equation');
  ok('new latex unknown ⇒ relabel', d({ tutorSpeechThisTurn: FIX, newLatex: '  ' }).reason === 'different-equation');
  // A judge note in the turn is no longer an input at all.
  ok('correctionNoteThisTurn is not part of the rule',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decideLabelReuseOnCorrection({ ...base, correctionNoteThisTurn: true } as any).action === 'relabel');
  ok('prior card not addressable ⇒ relabel', d({ tutorSpeechThisTurn: FIX, priorItemId: null }).reason === 'prior-not-addressable');
  ok('prior pending kill-recovery ⇒ relabel', d({ tutorSpeechThisTurn: FIX, priorPendingRevision: true }).reason === 'prior-pending-revision');
  ok('kill switch ⇒ relabel', d({ enabled: false, tutorSpeechThisTurn: FIX }).reason === 'flag-off' && d({ enabled: false, tutorSpeechThisTurn: FIX }).action === 'relabel');
  ok('marker detector: empty', hasSelfCorrectionMarker('') === false && hasSelfCorrectionMarker('   ') === false);
  // The relabel rule itself is untouched for a non-correction reuse.
  ok('non-correction reuse still relabels "(2)"',
    JSON.stringify(resolveLabelCollision({ enabled: true, rawLabel: 'How to read it aloud', priorLabel: 'How to read it aloud', relabelsSoFar: 0 }))
      === JSON.stringify({ kind: 'paint', label: 'How to read it aloud (2)', changed: true }));
}

console.log(`soft-rejections: ${n} cases passed`);
