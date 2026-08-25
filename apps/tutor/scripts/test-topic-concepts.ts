/**
 * Step 4 — concept level beneath topic. Pure helpers, no DB / no network.
 *
 * Run: npx tsx scripts/test-topic-concepts.ts
 */
import {
  getConceptsForTopic,
  findConceptInTopic,
  resolveConceptFromLabel,
  resolveConceptsCovered,
  isUrlSafeConceptId,
} from '../src/lib/tutor/topic-concepts';

let pass = 0;
let fail = 0;
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}  ${name}${ok ? '' : `  — got: ${JSON.stringify(got)}  want: ${JSON.stringify(want)}`}`);
  if (ok) pass++; else fail++;
}

// --- getConceptsForTopic -------------------------------------------------
// Backward compatibility is the whole ballgame: 256 topics ship with no
// `concepts` field and must keep working untouched.
check('topic with no concepts authored → []', getConceptsForTopic('counting'), []);
check('unknown topic id → []', getConceptsForTopic('zzz-not-a-real-topic'), []);

// --- findConceptInTopic --------------------------------------------------
// Exact id match, scoped to the parent topic (ids are only unique per leaf).
check('unknown topic → undefined', findConceptInTopic('zzz-not-a-real-topic', 'anything'), undefined);
check('topic with no concepts → undefined', findConceptInTopic('counting', 'anything'), undefined);

// --- authored slice: ap-physics-1 ---------------------------------------
// Proves the accessor really READS authored data — the empty-case tests above
// would pass against a stub returning [].
const p1 = getConceptsForTopic('ap-physics-1');
check('ap-physics-1 has concepts authored', p1.length > 0, true);
check('concept ids are unique within the leaf', new Set(p1.map((c) => c.id)).size, p1.length);
check('coulombs-law resolves in its parent topic', findConceptInTopic('ap-physics-1', 'newtons-second-law')?.label, "Newton's Second Law");
check('a concept id is NOT addressable from the wrong topic', findConceptInTopic('counting', 'newtons-second-law'), undefined);

// Every authored concept must clear the portal gate's STRUCTURAL bars, which
// are measured against 865 shipped misconceptions (evelyntutor session):
//   definition >= 120 · point >= 18 · why >= 40 · workedExample >= 60
// and a `point` must NOT open with learner framing.
const LEARNER_OPENER = /^(students?|learners?|kids|pupils|many people|people)\b/i;
for (const c of p1) {
  check(`[${c.id}] definition >= 120 chars`, c.definition.length >= 120, true);
  check(`[${c.id}] has >= 1 misconception`, c.misconceptions.length >= 1, true);
  check(`[${c.id}] has >= 1 worked example`, c.workedExamples.length >= 1, true);
  for (const m of c.misconceptions) {
    check(`[${c.id}] point >= 18`, m.point.length >= 18, true);
    check(`[${c.id}] why >= 40`, m.why.length >= 40, true);
    check(`[${c.id}] point does not open with learner framing`, LEARNER_OPENER.test(m.point), false);
  }
  for (const w of c.workedExamples) check(`[${c.id}] worked example >= 60`, w.length >= 60, true);
}

// --- resolveConceptFromLabel --------------------------------------------
// Step 4's tagging judgement, deterministic half: map a free-text label the
// tutor produced onto an AUTHORED concept id, scoped to the session's topic.
// Deliberately no embeddings here — the existing concept-registry normalizer
// (embedding cosine, 0.85) stays the fallback for labels this cannot place.
check('exact label match', resolveConceptFromLabel('ap-physics-1', "Newton's Second Law"), 'newtons-second-law');
check('case and whitespace insensitive', resolveConceptFromLabel('ap-physics-1', "  newton's   SECOND law "), 'newtons-second-law');
check('alias match', resolveConceptFromLabel('ap-physics-1', 'f equals ma'), 'newtons-second-law');
check('alias match on another concept', resolveConceptFromLabel('ap-physics-1', 'v squared over r'), 'centripetal-force');
check('concept id itself resolves', resolveConceptFromLabel('ap-physics-1', 'free-body-diagrams'), 'free-body-diagrams');
check('unrelated label → undefined', resolveConceptFromLabel('ap-physics-1', 'the french revolution'), undefined);
check('SCOPED: a valid label from another topic does not match', resolveConceptFromLabel('counting', "Newton's Second Law"), undefined);
check('unknown topic → undefined', resolveConceptFromLabel('zzz-not-real', "Newton's Second Law"), undefined);
check('empty label → undefined', resolveConceptFromLabel('ap-physics-1', '   '), undefined);

// --- resolveConceptsCovered ---------------------------------------------
// What the session actually emits. Free-text `topicsCovered` is retained in
// parallel by the caller; this is the ADDITIVE id list.
check('resolves the labels it can, drops the rest',
  resolveConceptsCovered('ap-physics-1', ["Newton's Second Law", 'the french revolution', 'v squared over r']),
  ['newtons-second-law', 'centripetal-force']);
check('deduplicates repeats across differing phrasings',
  resolveConceptsCovered('ap-physics-1', ['f equals ma', "Newton's Second Law", 'newton second law']),
  ['newtons-second-law']);
check('preserves first-seen order',
  resolveConceptsCovered('ap-physics-1', ['v squared over r', 'fbd']),
  ['centripetal-force', 'free-body-diagrams']);
check('no labels → []', resolveConceptsCovered('ap-physics-1', []), []);
check('topic with no concepts → [] (the 256 pre-Step-4 leaves)',
  resolveConceptsCovered('counting', ["Newton's Second Law", 'anything']), []);
check('unknown topic → []', resolveConceptsCovered('zzz-not-real', ['f equals ma']), []);

// --- id URL-safety -------------------------------------------------------
// A concept id BECOMES a URL segment. The evelyntutor session hit this live:
// an emergent `concept:foo` id produced `/learn/.../concept:free-body-ish`,
// a colon in a path segment. Their gate now rejects it — but a malformed id
// should fail HERE, at authoring, not silently lose its page downstream.
check('plain slug is url-safe', isUrlSafeConceptId('newtons-second-law'), true);
check('digits allowed', isUrlSafeConceptId('ap-physics-1'), true);
check('registry prefix rejected (the colon)', isUrlSafeConceptId('concept:free-body-ish'), false);
check('space rejected', isUrlSafeConceptId('free body diagrams'), false);
check('slash rejected', isUrlSafeConceptId('forces/newton'), false);
check('uppercase rejected', isUrlSafeConceptId('NewtonsSecondLaw'), false);
check('leading hyphen rejected', isUrlSafeConceptId('-leading'), false);
check('trailing hyphen rejected', isUrlSafeConceptId('trailing-'), false);
check('empty rejected', isUrlSafeConceptId(''), false);
// And every id we actually ship must clear it.
for (const c of p1) check(`[${c.id}] authored id is url-safe`, isUrlSafeConceptId(c.id), true);

// --- sibling near-duplicate bar -----------------------------------------
// The portal gate holds back the LATER of two siblings whose definitions
// reach 0.8 Jaccard similarity — silently, as an anchor with no URL. Author
// against it here, because the loss is invisible downstream.
function jaccard(a: string, b: string): number {
  const t = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const A = t(a);
  const B = t(b);
  const inter = [...A].filter((w) => B.has(w)).length;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}
let worst = 0;
let worstPair = '';
for (let i = 0; i < p1.length; i++) {
  for (let j = i + 1; j < p1.length; j++) {
    const sim = jaccard(p1[i].definition, p1[j].definition);
    if (sim > worst) { worst = sim; worstPair = `${p1[i].id} vs ${p1[j].id}`; }
  }
}
check(`no sibling pair >= 0.8 Jaccard (worst ${worst.toFixed(2)}: ${worstPair})`, worst < 0.8, true);
// Control: the measure CAN reach the bar, so the check above can fail.
check('jaccard control: identical strings score 1', jaccard('a b c', 'a b c'), 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
