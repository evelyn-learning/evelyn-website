/**
 * Fixed-script segments advance on the CLIENT (GDI trial live run 1,
 * 2026-10-29: the brain never called advance_lesson in a conversation
 * lesson; the cursor sat on the first segment for 15 minutes).
 *   - fixedScriptAutoAdvanceReason decides "due": 'turns' at overlong + 2,
 *     'time' at max(120 s, minutes × 1.5), null for any other plan or the
 *     last on-topic segment;
 *   - levelSetAdvanceTarget: set_working_level on a level-check segment ⇒
 *     the next segment;
 *   - the planted note is a FACT, and a pending note about the segment just
 *     left is replaced rather than kept;
 *   - VoiceTutorRealtime wires both moves (source pins).
 *
 * Run: npx tsx scripts/test-fixed-script-advance.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  fixedScriptAutoAdvanceReason, overlongTurnThreshold, levelSetAdvanceTarget,
  fixedScriptAdvancedNote, fixedScriptAutoAdvanceLead, fixedScriptLevelAdvanceLead, mergePendingRuntimeNote,
  FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS, FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR, FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS,
  FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS, holdAutoAdvanceForPronunciation,
  missingRequiredPhrases, scriptMissingAdvanceReason,
  segmentMaxTurns, needsLevelCaptureLead, LEVEL_CAPTURE_LEAD, FIXED_SCRIPT_LEVEL_MISSING_REASON,
  fixedScriptCloseReason, fixedScriptCloseForced, FIXED_SCRIPT_CLOSE_NOTE, FIXED_SCRIPT_CLOSE_GRACE_TURNS,
} from '../src/lib/tutor/lesson-plan/fixed-script';
import { buildRailModel, secondTutorLanguage, fixedScriptPartTitle, fixedScriptOutlineTable, authoredSegmentLabel } from '../src/lib/tutor/lesson-plan/rail-labels';
import { extractCommandTitle, catalogItemTitle } from '../src/lib/tutor/whiteboard/catalog';
import { parseLessonPlan } from '../src/lib/tutor/lesson-plan/parser';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

const RAW = {
  id: 'test.fixed-script-advance',
  title: 'Fixed script',
  curriculum: 'test',
  grade: 'adult',
  subject: 'languages',
  estimatedMinutes: 10,
  metadata: { fixedScript: true },
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2 },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 1 },
    { id: 'no-minutes', kind: 'concept', goal: 'Teach more', keyIdeas: ['b'] },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const fixed: LessonPlan = parseLessonPlan(RAW);
const ordinary: LessonPlan = { ...fixed, metadata: {} };
const base = { plan: fixed, segmentId: 'overview', turns: 0, overlongTurns: 6, elapsedMs: 0, levelKnown: false };

test('constants', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_EXTRA_TURNS, 2);
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_TIME_FACTOR, 1.5);
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MIN_MS, 120_000);
});
test('parser keeps segment estimatedMinutes (overview 2 min ⇒ overlong 6)', () => {
  assert.equal(fixed.segments[0].estimatedMinutes, 2);
  assert.equal(overlongTurnThreshold(fixed, 'overview', 6), 6);
});
test('non-fixed plan → null at any value', () => {
  for (const turns of [0, 8, 100]) for (const elapsedMs of [0, 180_000, 10_000_000]) {
    assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: ordinary, turns, elapsedMs }), null);
  }
});
test('missing plan / segment / unknown segment → null', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: null, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: undefined, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: null, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: '', turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: 'nope', turns: 99 }), null);
});
test('overview: turns 7 → null, turns 8 → turns', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 7 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 8 }), 'turns');
});
test('overview: turns 3, elapsed 179_999 → null, 180_000 → time', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 3, elapsedMs: 179_999 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 3, elapsedMs: 180_000 }), 'time');
});
test('turns checked before time', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 8, elapsedMs: 999_999 }), 'turns');
});
test('1-minute segment uses the 120 s floor', () => {
  const b = { ...base, segmentId: 'topic-intro', turns: 1 };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 119_999 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 120_000 }), 'time');
});
test('segment without minutes never advances on time (turns still do)', () => {
  const b = { ...base, segmentId: 'no-minutes', turns: 1 };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, elapsedMs: 10_000_000 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 8 }), 'turns');
});
test('last segment → null', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, segmentId: 'recap', turns: 99, elapsedMs: 10_000_000 }), null);
});
test('levelKnown: successor skipped for known level, a later segment exists ⇒ still due', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, levelKnown: true, turns: 8 }), 'turns');
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, levelKnown: true, turns: 3, elapsedMs: 180_000 }), 'time');
});
test('levelKnown: only remaining successor skipped ⇒ null', () => {
  const p: LessonPlan = { ...fixed, segments: [fixed.segments[0], fixed.segments[1]] };
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: p, levelKnown: true, turns: 99 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, plan: p, levelKnown: false, turns: 99 }), 'turns');
});

// ── §3 level set ⇒ leave the level-check segment ─────────────────────────
test('levelSetAdvanceTarget: level-check segment → next on-topic segment', () => {
  assert.equal(levelSetAdvanceTarget(fixed, 'level-check'), 'topic-intro');
});
test('levelSetAdvanceTarget: null off a level-check segment / non-fixed plan / missing', () => {
  assert.equal(levelSetAdvanceTarget(fixed, 'overview'), null);
  assert.equal(levelSetAdvanceTarget(ordinary, 'level-check'), null);
  assert.equal(levelSetAdvanceTarget(null, 'level-check'), null);
  assert.equal(levelSetAdvanceTarget(fixed, ''), null);
  const p: LessonPlan = { ...fixed, segments: [fixed.segments[0], fixed.segments[1]] };
  assert.equal(levelSetAdvanceTarget(p, 'level-check'), null);
});

// ── the planted note ─────────────────────────────────────────────────────
test('auto-advance note is a FACT, verbatim', () => {
  const n = fixedScriptAdvancedNote(fixedScriptAutoAdvanceLead('overview', 'topic-intro', 'concept'), 'topic-intro');
  assert.equal(n, '[runtime note — not from the student] The "overview" part of the lesson is over and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). If the student is mid-exchange, close it in one sentence, then teach "topic-intro" from its notes. Do not call advance_lesson for this move. Apply this silently; never mention this note.]');
});
test('level-advance note first sentence', () => {
  const n = fixedScriptAdvancedNote(fixedScriptLevelAdvanceLead('topic-intro', 'concept'), 'topic-intro');
  assert.ok(n.startsWith('[runtime note — not from the student] The level check is complete and the lesson pointer has ALREADY moved to segment "topic-intro" (concept). If the student'));
});
test('mergePendingRuntimeNote: none pending → the new note', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: null, segId: null }, 'a', 'b', 'N'), { note: 'N', segId: 'b' });
});
test('mergePendingRuntimeNote: other pending note survives, new one after it', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: 'P', segId: 'b' }, 'a', 'b', 'N'), { note: 'P\n\nN', segId: 'b' });
  assert.deepEqual(mergePendingRuntimeNote({ note: 'P', segId: null }, 'a', 'b', 'N'), { note: 'P\n\nN', segId: 'b' });
});
test('mergePendingRuntimeNote: a note about the segment just left is dropped', () => {
  assert.deepEqual(mergePendingRuntimeNote({ note: 'call advance_lesson', segId: 'a' }, 'a', 'b', 'N'), { note: 'N', segId: 'b' });
});

// ── wiring pins ──────────────────────────────────────────────────────────
const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const FLAGS = read('src/lib/tutor/orchestrator/flags.ts');
test('flag default ON', () => {
  pin(FLAGS, /export const TUTOR_FIXED_SCRIPT_AUTO_ADVANCE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_AUTO_ADVANCE !== 'off';/);
});
test('turn counter carries startedAt at every reset', () => {
  const resets = VTR.match(/turnsInSegmentRef\.current = \{[^}]*\}/g) ?? [];
  assert.ok(resets.length >= 3, `resets=${resets.length}`);
  for (const r of resets) assert.ok(/startedAt: Date\.now\(\)/.test(r), r);
});
test('auto-advance wired after the overlong note, through applyResolvedAdvance', () => {
  const at = VTR.indexOf("'segment_overlong_note_planted'");
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({', at);
  assert.ok(at > 0 && auto > at, 'auto-advance must follow the overlong note');
  const block = VTR.slice(auto, auto + 5000);
  pin(block, /applyResolvedAdvance\(autoPlan, segIdNow, autoNext\)/);
  pin(block, /pendingRuntimeNoteSegRef\.current = merged\.segId/);
  pin(block, /'fixed_script_auto_advance', `"\$\{segIdNow\}" → "\$\{autoNext\}" reason=\$\{advanceReason\} turns=\$\{autoTurns\} elapsed=\$\{autoElapsedS\}s`/);
});
// ── fix round 10-11 ──────────────────────────────────────────────────────
test('A: auto-advance held while a pronunciation clip is armed', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  const block = VTR.slice(auto, auto + 5000);
  pin(block, /if \(autoNext && holdAutoAdvanceForPronunciation\(pronArmed, autoAdvancePronHeldRef\.current\)\) \{[\s\S]*?autoAdvancePronHeldRef\.current \+= 1;[\s\S]*?'fixed_script_auto_advance_held_pron'[\s\S]*?\} else if \(autoNext\) \{\s*autoAdvancePronHeldRef\.current = 0;/);
  pin(block, /const pronArmed = !!clipCaptureRef\.current\?\.isArmed\(\);/);
  assert.ok(block.indexOf('isArmed()') < block.indexOf('applyResolvedAdvance(autoPlan'), 'hold check precedes the advance');
});
test('C: the pronunciation hold is capped at 3 consecutive turns; the 4th advances', () => {
  assert.equal(FIXED_SCRIPT_AUTO_ADVANCE_MAX_HELD_TURNS, 3);
  assert.equal(holdAutoAdvanceForPronunciation(true, 0), true);
  assert.equal(holdAutoAdvanceForPronunciation(true, 2), true);
  assert.equal(holdAutoAdvanceForPronunciation(true, 3), false);
  assert.equal(holdAutoAdvanceForPronunciation(false, 0), false);
  // the held count resets when nothing is due (a new segment) and on the advance
  pin(VTR, /if \(!advanceReason\) autoAdvancePronHeldRef\.current = 0;/);
});
test('B: FACT notes are urgent (never held) and delivery is logged', () => {
  const auto = VTR.indexOf('fixedScriptAutoAdvanceReason({');
  pin(VTR.slice(auto, auto + 5000), /pendingRuntimeNoteUrgentRef\.current = true;/);
  // Task 14 §G: the tool path's level apply moved into applyWorkingLevelRef.
  const lv = VTR.indexOf("applyWorkingLevelRef.current(wl.level, wl.evidence ?? '', 'tool')");
  assert.ok(lv > 0);
  pin(VTR.slice(lv, lv + 2500), /pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /const deliver = urgentNote \|\| !openQuestionAtTurnStartRef\.current/);
  pin(VTR, /if \(urgentNote\) \{\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = true;\n\s*onDebugEvent\?\.\('fixed_script_note_delivered'/);
  // the overlong note itself stays holdable
  const ov = VTR.indexOf("'segment_overlong_note_planted'");
  pin(VTR.slice(ov - 2500, ov), /pendingRuntimeNoteUrgentRef\.current = false;/);
});
test('D: the turn counter + auto-advance run under the auto-advance flag alone', () => {
  pin(VTR, /if \(\(TUTOR_SEGMENT_OVERLONG_NOTE \|\| TUTOR_FIXED_SCRIPT_AUTO_ADVANCE\) && totalSentenceCount > 0\) \{/);
  pin(VTR, /if \(TUTOR_SEGMENT_OVERLONG_NOTE && !homeworkSession && !cur\.noted && cur\.turns >= overlongTurns/);
});
test('level-set advance wired in the setWorkingLevel handler with the double-advance guard', () => {
  const at = VTR.indexOf("applyWorkingLevelRef.current(wl.level, wl.evidence ?? '', 'tool')");
  assert.ok(at > 0);
  const block = VTR.slice(at, at + 2000);
  pin(block, /levelSetAdvanceTarget\(lvPlan, lvFrom\)/);
  pin(block, /applyResolvedAdvance\(lvPlan, lvFrom, lvNext\)/);
  pin(block, /inferredAdvanceThisTurnRef\.current = lvNext/);
  pin(block, /'fixed_script_level_advance'/);
});
test('applyResolvedAdvance disarms a pending pronunciation arm', () => {
  const at = VTR.indexOf('const applyResolvedAdvance = useCallback(');
  pin(VTR.slice(at, at + 8000), /disarmPronunciationOnSegmentAdvanceRef\.current\(currentSegmentIdRef\.current, next\)/);
});

// ── run 2 (10-29): a fixed-script segment is not left before its script was said ──
const OVERVIEW = { requiredPhrases: ['present perfect', 'past simple'] };
test('missingRequiredPhrases: both present → []', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['Today we compare the present perfect', 'with the past simple.']), []);
});
test('missingRequiredPhrases: one missing → [that one]', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['Today we look at the present perfect.']), ['past simple']);
});
test('missingRequiredPhrases: case-insensitive', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, ['PRESENT PERFECT and Past Simple.']), []);
});
test('missingRequiredPhrases: empty narration → all', () => {
  assert.deepEqual(missingRequiredPhrases(OVERVIEW, []), ['present perfect', 'past simple']);
});
test('missingRequiredPhrases: no requiredPhrases → []', () => {
  assert.deepEqual(missingRequiredPhrases({}, []), []);
  assert.deepEqual(missingRequiredPhrases(undefined, []), []);
  assert.deepEqual(missingRequiredPhrases({ requiredPhrases: [] }, ['x']), []);
});
test('scriptMissingAdvanceReason names every missing phrase and says "this turn"', () => {
  const r = scriptMissingAdvanceReason(['present perfect', 'past simple']);
  assert.ok(r.includes('"present perfect", "past simple"') && /Say it in this turn/.test(r), r);
});
test('VTR: advance_lesson guard refuses before the homework guard, without moving the cursor', () => {
  const at = VTR.indexOf("'fixed_script_advance_refused_script_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 1800, at + 400);
  pin(block, /TUTOR_FIXED_SCRIPT_ADVANCE_GUARD && next && isFixedScriptPlan\(plan\)/);
  pin(block, /missingRequiredPhrases\(/);
  pin(block, /\.\.\.turnNarrationRef\.current/);
  pin(block, /rejected\.push\(\{ action: 'advance_lesson', reason: scriptMissingAdvanceReason\(missing\) \}\);\s*continue;/);
  pin(block, /scriptAdvanceRefusedSegRef\.current = curSegId/);
  assert.ok(at < VTR.indexOf('const hwAdvance = next && TUTOR_HOMEWORK_ADVANCE_GUARD'), 'before the homework guard / any applyResolvedAdvance');
});
test('VTR: mark_segment_complete of the current fixed-script segment is skipped while its script is missing', () => {
  const at = VTR.indexOf("'fixed_script_mark_refused_script_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 1400, at + 200);
  pin(block, /c\.segmentId === currentSegmentIdRef\.current/);
  pin(VTR.slice(at, at + 200), /continue;/);
});
test('VTR: a refused advance does not defer the required-phrase check', () => {
  const at = VTR.indexOf('const advancedIntoSegmentThisTurn =');
  const block = VTR.slice(at - 600, at + 200);
  pin(block, /scriptAdvanceRefusedSegRef\.current === segIdForPhrases/);
  pin(block, /advancedIntoSegmentThisTurn = !advanceRefusedHere &&/);
  pin(VTR, /turnNarrationRef\.current = \[\];\n\s*scriptAdvanceRefusedSegRef\.current = '';/);
});

// ── Task 13 §A: authored pacing (metadata.maxTurns) ──
const MT_RAW = {
  ...RAW,
  id: 'test.fixed-script-maxturns',
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { maxTurns: 2 } },
    { id: 'level-check', kind: 'misconception_check', question: 'Tell me about your work.', misconception: 'n/a', metadata: { skipWhenLevelKnown: true, maxTurns: 5 } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 1 },
    { id: 'bad', kind: 'concept', goal: 'Teach', keyIdeas: ['b'], estimatedMinutes: 1, metadata: { maxTurns: 2.5 } },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const mt: LessonPlan = parseLessonPlan(MT_RAW);
test('A: segmentMaxTurns reads a positive integer on a fixed script only', () => {
  assert.equal(segmentMaxTurns(mt, 'overview'), 2);
  assert.equal(segmentMaxTurns(mt, 'topic-intro'), undefined);
  assert.equal(segmentMaxTurns(mt, 'bad'), undefined);
  assert.equal(segmentMaxTurns({ ...mt, metadata: {} }, 'overview'), undefined);
  assert.equal(segmentMaxTurns(mt, 'nope'), undefined);
});
test('A: maxTurns 2 → null at 1, turns at 2', () => {
  const b = { plan: mt, segmentId: 'overview', overlongTurns: 1, elapsedMs: 0, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 1 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 2 }), 'turns');
});
test('A: a segment with maxTurns ignores the 1.5× time rule', () => {
  assert.equal(fixedScriptAutoAdvanceReason({ plan: mt, segmentId: 'overview', turns: 1, overlongTurns: 1, elapsedMs: 10 * 60_000, levelKnown: false }), null);
});
test('A: a segment without maxTurns keeps the old rules', () => {
  const b = { plan: mt, segmentId: 'topic-intro', overlongTurns: 6, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 7, elapsedMs: 0 }), null);
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 8, elapsedMs: 0 }), 'turns');
  assert.equal(fixedScriptAutoAdvanceReason({ ...b, turns: 1, elapsedMs: 120_000 }), 'time');
});
test('A: overlong threshold = maxTurns − 1 (min 1); otherwise unchanged', () => {
  assert.equal(overlongTurnThreshold(mt, 'overview', 6), 1);
  assert.equal(overlongTurnThreshold(mt, 'level-check', 6), 4);
  assert.equal(overlongTurnThreshold(mt, 'topic-intro', 6), 6);
  const one = parseLessonPlan({ ...MT_RAW, segments: [{ ...MT_RAW.segments[0], metadata: { maxTurns: 1 } }, MT_RAW.segments[4]] });
  assert.equal(overlongTurnThreshold(one, 'overview', 6), 1);
});
test('A: level-capture lead only when leaving a level check with no level', () => {
  assert.equal(needsLevelCaptureLead(mt, 'level-check', false), true);
  assert.equal(needsLevelCaptureLead(mt, 'level-check', true), false);
  assert.equal(needsLevelCaptureLead(mt, 'overview', false), false);
  assert.equal(needsLevelCaptureLead({ ...mt, metadata: {} }, 'level-check', false), false);
  assert.equal(LEVEL_CAPTURE_LEAD, 'Before anything else this turn, call set_working_level with the level you heard in the level check. ');
});
test('VTR: auto-advance note prepends the level-capture lead', () => {
  pin(VTR, /needsLevelCaptureLead\(autoPlan, segIdNow, !!workingLevelRef\.current\) \? LEVEL_CAPTURE_LEAD : ''\) \+\s*\(advanceReason === 'announced'\s*\? fixedScriptAnnouncedAdvanceLead\(segIdNow, autoNext, autoKind\)\s*: fixedScriptAutoAdvanceLead\(/);
});

// ── Task 13 §B: authored labels → rail, page titles, outline ──
const LB_RAW = {
  ...RAW,
  id: 'test.fixed-script-labels',
  segments: [
    { id: 'overview', kind: 'hook', goal: 'Welcome', estimatedMinutes: 2, metadata: { label: 'Overview', labelLocalized: { ja: '概要' } } },
    { id: 'topic-intro', kind: 'concept', goal: 'Teach', keyIdeas: ['a'], estimatedMinutes: 4, metadata: { label: 'Your job' } },
    { id: 'pron', kind: 'concept', goal: 'Sounds', keyIdeas: ['b'], estimatedMinutes: 3, metadata: { label: 'Pronunciation', labelLocalized: { ja: '発音' }, optional: true } },
    { id: 'recap', kind: 'recap', mustRemember: ['a'], estimatedMinutes: 2 },
  ],
};
const lb: LessonPlan = parseLessonPlan(LB_RAW);
test('B: secondTutorLanguage = first non-English code', () => {
  assert.equal(secondTutorLanguage(['en', 'ja']), 'ja');
  assert.equal(secondTutorLanguage(['en']), undefined);
  assert.equal(secondTutorLanguage(undefined), undefined);
});
test('B: rail uses the authored label (before Hook/Recap words), localized when a second language matches', () => {
  const en = buildRailModel(lb, 'overview', new Set(), { 'topic-intro': 'Generated thing' })!;
  assert.deepEqual(en.items.map((i) => i.label), ['Overview', 'Your job', 'Pronunciation', 'Recap']);
  const ja = buildRailModel(lb, 'overview', new Set(), null, 'ja')!;
  assert.deepEqual(ja.items.map((i) => i.label), ['Overview · 概要', 'Your job', 'Pronunciation · 発音', 'Recap']);
});
test('B: plans without labels keep their rail', () => {
  const m = buildRailModel(fixed, 'overview', new Set(), null, 'ja')!;
  assert.equal(m.items[0].label, 'Hook');
  assert.equal(authoredSegmentLabel(fixed.segments[0], 'ja'), null);
});
test('B: advance page title "Part <n> · <label>[ · <localized>]" on a fixed script only', () => {
  assert.equal(fixedScriptPartTitle(lb, 'topic-intro'), 'Part 2 · Your job');
  assert.equal(fixedScriptPartTitle(lb, 'pron', 'ja'), 'Part 3 · Pronunciation · 発音');
  assert.equal(fixedScriptPartTitle(lb, 'recap'), null);
  assert.equal(fixedScriptPartTitle({ ...lb, metadata: {} }, 'topic-intro'), null);
});
test('B: outline table — plan title, #/Part/Minutes, (optional), localized column', () => {
  const t = fixedScriptOutlineTable(lb)!;
  assert.equal(t.title, 'Fixed script');
  assert.deepEqual(t.headers, ['#', 'Part', 'Minutes']);
  assert.deepEqual(t.rows[2], ['3', 'Pronunciation (optional)', '3']);
  assert.deepEqual(t.rows[3], ['4', 'Recap', '2']);
  const tj = fixedScriptOutlineTable(lb, 'ja')!;
  assert.deepEqual(tj.headers, ['#', 'Part', 'Part (ja)', 'Minutes']);
  assert.deepEqual(tj.rows[0], ['1', 'Overview', '概要', '2']);
  assert.equal(fixedScriptOutlineTable({ ...lb, metadata: {} }), null);
});
test('B: a sentence never titles a page; the catalog item still names it', () => {
  const cmd = { action: 'showSentence', sentence: 'I have worked here for ten years.' };
  assert.equal(extractCommandTitle(cmd), undefined);
  assert.equal(catalogItemTitle(cmd), 'I have worked here for ten years.');
  assert.equal(catalogItemTitle({ action: 'showTable', title: 'Outline', headers: [], rows: [] }), 'Outline');
});
test('VTR: advance page title, outline card wiring, rail language', () => {
  pin(VTR, /const authoredPartTitle = fixedScriptPartTitle\(plan, next, secondTutorLanguageRef\.current\);\s*const newPageTitle = authoredPartTitle/);
  pin(VTR, /TUTOR_FIXED_SCRIPT_OUTLINE && openingTurnPendingRef\.current && !opts\?\.prefetchOnly && !fixedScriptOutlineShownRef\.current/);
  pin(VTR, /handleWhiteboardCommand\(\[cmd\], \{ anchorSentence: 0 \}\)/);
  pin(VTR, /'fixed_script_outline_card', `rows=\$\{outline\.rows\.length\}/);
  assert.ok(!/extractCommandTitle/.test(VTR), 'catalog appends use catalogItemTitle');
  pin(read('src/app/tutor/components/session/TutorSession.tsx'), /segmentLabels, secondTutorLanguage\(tutorLanguages\)\)/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /TUTOR_FIXED_SCRIPT_OUTLINE = process\.env\.NEXT_PUBLIC_TUTOR_FIXED_SCRIPT_OUTLINE !== 'off'/);
});

// ── Task 13 fix round 1 (I-4): leaving the level check without a level ──
test('I-4: the overlong note carries the level-capture lead before the advance hint', () => {
  pin(VTR, /const levelLead = needsLevelCaptureLead\(plan, segIdNow, !!workingLevelRef\.current\) \? LEVEL_CAPTURE_LEAD : '';/);
  pin(VTR, /`\$\{OVERLONG_FINISH_FIRST\}\$\{levelLead\}\$\{nextHint\} `/);
});
test('I-4: a brain advance off the level check with no level (and no set_working_level in the batch) is refused', () => {
  assert.equal(FIXED_SCRIPT_LEVEL_MISSING_REASON, 'Set the working level first: call set_working_level({level}) with the level you heard in this check, then advance.');
  const at = VTR.indexOf("'fixed_script_advance_refused_level_missing'");
  assert.ok(at > 0, 'event');
  const block = VTR.slice(at - 700, at + 300);
  pin(block, /levelCheckActive\s*&& needsLevelCaptureLead\(plan, curSegId, !!workingLevelRef\.current\)\s*&& !processed\.some\(\(c\) => \(c\.action as string\) === 'setWorkingLevel'\)/);
  pin(block, /rejected\.push\(\{ action: 'advance_lesson', reason: FIXED_SCRIPT_LEVEL_MISSING_REASON \}\);\s*continue;/);
  assert.ok(at < VTR.indexOf('const hwAdvance = next && TUTOR_HOMEWORK_ADVANCE_GUARD'), 'before any applyResolvedAdvance');
});

// ── Task 14 §J: page titles visible in the embed ──
test('J: the embed board shows the current page title as a one-line header', () => {
  const WB = read('src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx');
  pin(WB, /const headerTitle = chrome === 'minimal' && pageTitleHeader \? stripLatexForTitle\(currentPage\.title\)\.trim\(\) : '';/);
  pin(WB, /\{headerTitle && \(\s*\/\/[^\n]*\n\s*<div className="shrink-0 [^"]*truncate" data-wb-page-title="1"/);
  pin(WB, /pageTitleHeader = false,/);
  const TS = read('src/app/tutor/components/session/TutorSession.tsx');
  pin(TS, /pageTitleHeader=\{TUTOR_PAGE_TITLE_HEADER && !!embedded && isFixedScriptPlan\(lessonProgress\.plan\)\}/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_PAGE_TITLE_HEADER = process\.env\.NEXT_PUBLIC_TUTOR_PAGE_TITLE_HEADER !== 'off';/);
});

// ── Task 14 §H: the last part closes the lesson ──
test('H: the last on-topic fixed-script part is due to CLOSE at its maxTurns; auto-advance stays null there', () => {
  const plan: LessonPlan = { ...fixed, segments: fixed.segments.map((sg) => (sg.id === 'recap' ? { ...sg, metadata: { maxTurns: 4 } } : sg)) as LessonPlan['segments'] };
  const base = { plan, segmentId: 'recap', overlongTurns: 3, elapsedMs: 0, levelKnown: false };
  assert.equal(fixedScriptAutoAdvanceReason({ ...base, turns: 4 }), null);
  assert.equal(fixedScriptCloseReason({ ...base, turns: 3 }), null);
  assert.equal(fixedScriptCloseReason({ ...base, turns: 4 }), 'turns');
  assert.equal(fixedScriptCloseReason({ ...base, segmentId: 'topic-intro', turns: 99 }), null, 'not the last part');
  assert.equal(fixedScriptCloseReason({ ...base, plan: { ...plan, metadata: {} } as LessonPlan, turns: 9 }), null, 'not a fixed script');
});
test('H: the close note is the brief\'s FACT; forced after two tutor turns unless the lesson closed', () => {
  assert.ok(FIXED_SCRIPT_CLOSE_NOTE.includes('The lesson is complete. Give the closing summary now in two or three sentences and call close_session_notes in this turn; do not ask another question.'));
  assert.equal(FIXED_SCRIPT_CLOSE_GRACE_TURNS, 2);
  assert.equal(fixedScriptCloseForced(1, false), false);
  assert.equal(fixedScriptCloseForced(2, false), true);
  assert.equal(fixedScriptCloseForced(2, true), false);
});
test('H: VTR plants the close note (urgent) and force-closes through the normal close path', () => {
  pin(VTR, /pendingRuntimeNoteRef\.current = FIXED_SCRIPT_CLOSE_NOTE;\s*pendingRuntimeNoteSegRef\.current = segIdNow;\s*pendingRuntimeNoteUrgentRef\.current = true;/);
  pin(VTR, /onDebugEvent\?\.\('fixed_script_close_requested'/);
  pin(VTR, /if \(fixedScriptCloseForced\(fc\.turnsSince, lessonClosedRef\.current\)\) \{\s*lessonClosedRef\.current = true;\s*onDebugEvent\?\.\('fixed_script_close_forced'[^\n]*\n\s*onDebugEvent\?\.\('lesson_closed', 'fixed-script close forced'\);[\s\S]{0,600}?void endSessionNowRef\.current\(\{ farewell: goodbyeLine\(studentName\) \}\);/);
  // the same farewell + end call the time-box hard stop makes
  pin(VTR, /void endSessionNowRef\.current\(\{ farewell: line, reason: 'time_limit' \}\);/);
});

// ── Task 15 §D: the required-phrase kill defers on a CLIENT auto-advance transition turn ──
test('D: fixedScriptNoteDeliveredThisTurnRef — set at the FACT-note emit, reset per brain turn, read by the deferral', () => {
  pin(VTR, /const fixedScriptNoteDeliveredThisTurnRef = useRef\(false\);/);
  pin(VTR, /verdictPrecheckKillUsedRef\.current = false;\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = false;/);
  pin(VTR, /if \(urgentNote\) \{\n\s*fixedScriptNoteDeliveredThisTurnRef\.current = true;\n\s*onDebugEvent\?\.\('fixed_script_note_delivered'/);
  pin(VTR, /const clientAdvanceTransition = fixedScriptNoteDeliveredThisTurnRef\.current;/);
  pin(VTR, /const deferPhraseCheck = advancedIntoSegmentThisTurn \|\| clientAdvanceTransition;/);
  pin(VTR, /\(client auto-advance transition turn\)/);
  // the check itself runs only when not deferred, and the deferral does not mark the segment checked
  pin(VTR, /segIdForPhrases &&\n\s*!deferPhraseCheck &&\n\s*!segmentRequiredPhrasesCheckedRef\.current\.has\(segIdForPhrases\)/);
  const at = VTR.indexOf('const deferPhraseCheck');
  const deferBlock = VTR.slice(at, VTR.indexOf('!deferPhraseCheck', at));
  assert.ok(!deferBlock.includes('segmentRequiredPhrasesCheckedRef.current.add'), 'deferral must not mark the segment checked');
  // reset happens before the note can be delivered in the same turn
  assert.ok(VTR.indexOf('fixedScriptNoteDeliveredThisTurnRef.current = false;') < VTR.indexOf('fixedScriptNoteDeliveredThisTurnRef.current = true;'));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
