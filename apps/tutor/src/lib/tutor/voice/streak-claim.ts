// src/lib/tutor/voice/streak-claim.ts
/**
 * Streak / tally praise guard.
 *
 * WHY (production, 2026-10-03): the tutor said "five for five" (on a wrong
 * answer), "Nine in a row", "Twelve straight", "fifteen problems deep with
 * zero misses" — to a student with wrong answers and several "I don't know".
 * The model keeps no count; it produces the SHAPE of streak praise and fills
 * in a number. The orchestrator does keep the count (studentStreakRef, the
 * `pacing_streak` event), so a spoken number can be checked against it.
 *
 * Two pure pieces:
 *
 *  detectStreakClaims(sentence) — numeric streak/tally claims in one tutor
 *  sentence, with the claimed count(s).
 *
 *  assessStreakClaim(sentence, tracked) — pass / drop / advisory.
 *
 * WHAT COUNTS AS A CLAIM. A claim needs a FORM and a PRAISE CONTEXT.
 *
 *  Forms (N as digits or number words, zero…ninety-nine):
 *    tally    "N for N", "N out of N"        (N = N ⇒ a perfect record)
 *    streak   "N in a row", "N straight", "N consecutive"
 *    deep     "N problems/questions deep"
 *    perfect  "zero/no misses", "without a miss", "perfect so far/record/
 *             score/streak", "haven't missed one/any"   (no number)
 *
 *  The forms are closed on the right so that a counted THING is not a tally:
 *  after the form must come the end of the clause or a function word, or one
 *  of the tally nouns (problems, questions, answers, correct, right…). That
 *  is what keeps "3 out of 5 trips", "5 for 5 dollars", "five straight
 *  lines" and "three consecutive integers" out. "N of N" without "out" is
 *  not a form at all ("Round 2 of 3", "Step 3 of 3"). "N in a row" is
 *  rejected after a placement word ("place four in a row", "with six in a
 *  row", "there are six in a row").
 *
 *  Praise context (the sentence is ABOUT the student's record, not a
 *  problem statement) — any one of:
 *    · second person: you / you're / you've / your;
 *    · evaluative framing: "that's", "that makes", nice / great / nailed /
 *      on a roll / streak / wow / boom / well done / keep it up …;
 *    · a bare exclamatory fragment — the claim is essentially the whole
 *      sentence ("Nine in a row." / "Twelve straight!").
 *  The number-less `perfect` forms need second person, the fragment shape,
 *  or a numeric claim beside them ("A perfect score is 100 points" is not
 *  praise; evaluative words cannot vouch for a form that is itself one).
 *
 *  A numeric form is NOT a claim when a content verb governs it — a verb of
 *  having / needing / getting / counting / seeing / flipping / rolling /
 *  placing / winning anywhere before it ("You need three in a row to win",
 *  "You flipped heads three in a row", "So you get 5 out of 5"). "You've got
 *  N in a row" is the one praise idiom with such a verb and is exempt.
 *
 * THE DECISION (2026-10-04: narrow, fail-open).
 *  The tracked count is NOT ground truth: it is credited only on verification
 *  turns, zeroed on a topic switch and can be restored from a snapshot. So a
 *  claim is acted on only when it is clearly too HIGH, and a sentence is
 *  dropped only when ALL of these hold:
 *   1. it is a praise tally and nothing else — a bare fragment ("Nine in a
 *      row." / "Twelve straight!") or "that's / that makes / you're / you've
 *      got N …", with no further content clause, question or verdict;
 *   2. the claim is UNSCOPED — no "on this page / on that one / on slope
 *      problems / in this set" (a scoped tally can be true whatever the
 *      session streak is);
 *   3. the claimed count exceeds the tracked consecutive-correct count by TWO
 *      or more (claimed > tracked + 1) — or it is a perfect / zero-miss
 *      record of N while a wrong answer is on the ledger and N is larger than
 *      the answers credited. One above the tracked count always passes: the
 *      ref is credited AFTER the turn streams, and one uncredited correct
 *      answer must not cost the student a true "three in a row".
 *  Everything else passes, at most with an advisory event:
 *  - Real count unknown ⇒ pass (never drop on no evidence).
 *  - An under-claim (N below the tracked count) ⇒ pass.
 *  - N out of M (N ≠ M) is a partial score; nothing tracked can verify it.
 *  - deep N: checked only when nothing has been wrong, or when a zero-miss
 *    claim sits beside it; otherwise unverifiable.
 *  - A perfect-record claim that is not provably too high ("Perfect so far."
 *    with a wrong answer on the ledger; "five for five" when five or more
 *    answers were credited) ⇒ advisory, never dropped — it may be true of the
 *    current set.
 *  - A too-high claim in a sentence that also asks a question, carries a
 *    verdict, is scoped, or has other content ⇒ advisory.
 *
 * Generic shapes only — no subject content. Pure; never throws.
 */

export type StreakClaimKind = 'tally' | 'streak' | 'deep' | 'perfect';

export interface StreakClaim {
  kind: StreakClaimKind;
  /** Claimed count; null for the number-less `perfect` forms. */
  count: number | null;
  /** tally only: the denominator ("3 out of 5" → 5). */
  of?: number;
  /** The matched text. */
  text: string;
  index: number;
}

const ONES = 'one|two|three|four|five|six|seven|eight|nine';
const TEENS = 'ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen';
const TENS = 'twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety';
const NUM = `(?:\\d{1,3}|(?:${TENS})(?:[-\\s](?:${ONES}))?|${TEENS}|${ONES}|zero)`;
/** A count token must stand alone: not part of a word, decimal or price. */
const NUM_L = `(?<![\\w.$])(${NUM})`;
const NUM_R = `(${NUM})(?![\\w%]|\\.\\d)`;

const WORD_VALUES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

/** "12" → 12, "Twelve" → 12, "twenty-one" → 21; anything else → null. */
export function parseCountToken(token: string): number | null {
  if (typeof token !== 'string') return null;
  const t = token.trim().toLowerCase();
  if (/^\d{1,3}$/.test(t)) return Number(t);
  const parts = t.split(/[-\s]+/);
  if (parts.length === 1) return parts[0] in WORD_VALUES ? WORD_VALUES[parts[0]] : null;
  if (parts.length === 2 && parts[0] in WORD_VALUES && parts[1] in WORD_VALUES
      && WORD_VALUES[parts[0]] >= 20 && WORD_VALUES[parts[1]] >= 1 && WORD_VALUES[parts[1]] <= 9) {
    return WORD_VALUES[parts[0]] + WORD_VALUES[parts[1]];
  }
  return null;
}

const TALLY_NOUN = '(?:problems?|questions?|answers?|ones|tries|attempts|wins|correct|right)';
/** Right edge: end of clause, or a function word — never a counted thing. */
const TAIL = '(?=\\s*(?:$|[.!?,;:—–)\\-]|(?:so|on|now|today|this|and|with|there|already|here|in|at|after|since|for|to|until|before|when|but|then|yet)\\b))';

const FOR_RE = new RegExp(`${NUM_L}[\\s-]+for[\\s-]+${NUM_R}${TAIL}`, 'gi');
const OUT_OF_RE = new RegExp(`${NUM_L}\\s+out\\s+of\\s+${NUM_R}(?:\\s+${TALLY_NOUN})?${TAIL}`, 'gi');
const ROW_RE = new RegExp(`${NUM_L}(?:\\s+${TALLY_NOUN}(?:\\s+(?:correct|right))?)?\\s+in\\s+a\\s+row\\b`, 'gi');
const STRAIGHT_RE = new RegExp(`${NUM_L}\\s+(?:straight|consecutive)(?:\\s+${TALLY_NOUN}(?:\\s+(?:correct|right))?)?${TAIL}`, 'gi');
const DEEP_RE = new RegExp(`${NUM_L}\\s+(?:problems?|questions?|answers?)\\s+deep\\b`, 'gi');
const PERFECT_RE =
  /\b(?:zero|no)\s+miss(?:es)?\b|\bwithout\s+a(?:\s+single)?\s+miss\b|\bnot\s+a\s+single\s+miss\b|\bperfect\s+(?:so\s+far|record|score|streak|run)\b|\bhaven[’']?t\s+missed\s+(?:one|any|a\s+single(?:\s+one)?|a\s+thing)\b/gi;

/** A verb of having / needing / getting / counting / seeing / flipping /
 *  rolling / placing / winning before a numeric form: the sentence is content
 *  (a game, a probability problem, an array), not praise. "you've got" and
 *  "on a roll" are praise idioms and are not matched. */
const CONTENT_VERB_RE =
  /\b(?:need(?:s|ed)?|want(?:s|ed)?|ha(?:ve|s|d)(?!\s+got\b)|get(?:s|ting)?|(?<!['’]ve\s)(?<!\bhave\s)got(?:ten)?|count(?:s|ed|ing)?|see(?:s|n|ing)?|saw|flip(?:s|ped|ping)?|toss(?:es|ed|ing)?|(?<!\ba\s)roll(?:s|ed|ing)?|throw(?:s|n|ing)?|threw|spin(?:s|ning)?|spun|land(?:s|ed|ing)?|draw(?:s|n|ing)?|drew|pick(?:s|ed|ing)?|win(?:s|ning)?|won|los(?:e|es|t|ing)|scor(?:e|es|ed|ing)|put(?:s|ting)?|plac(?:e|es|ed|ing)|lin(?:e|es|ed|ing)\s+up|arrang(?:e|es|ed|ing)|stack(?:s|ed|ing)?|plant(?:s|ed|ing)?|seat(?:s|ed|ing)?)\b/i;

/** "place four in a row" / "with six in a row" / "there are six in a row". */
const PLACEMENT_BEFORE_RE =
  /\b(?:put|puts|place[sd]?|placing|line[sd]?|lining|arrange[sd]?|set|sets|seat(?:s|ed)?|sit|sits|stand|stands|plant(?:s|ed)?|stack(?:s|ed)?|lay|lays|draw|draws|drawn|fit|fits|with|of|has|is|are|were|was)\s+(?:up\s+)?$/i;

const SECOND_PERSON_RE = /\byou(?:['’](?:re|ve|ll|d))?\b|\byour\b/i;
const EVALUATIVE_RE =
  /\b(?:that['’]?s|that\s+is|that\s+makes|makes\s+it|nice|nicely|great|awesome|amazing|excellent|nailed|crush(?:ing|ed)|on\s+a\s+roll|on\s+fire|streak|wow|boom|impressive|well\s+done|keep\s+it\s+up|good|love|brilliant|fantastic|beautiful|solid)\b/i;
const VERDICT_RE =
  /\b(?:correct|incorrect|right|wrong|exactly|yes|yep|yeah|nope|not\s+quite|close|almost|spot\s+on|nailed\s+it|got\s+it|that['’]?s\s+it|bingo|precisely)\b/i;
/** Words that are part of praise framing, not "other content". */
const FRAMING_WORD_RE =
  /^(?:you|you['’]?re|you['’]?ve|that['’]?s|that|is|are|a|the|and|with|now|so|far|today|already|just|again|nice|nicely|work|great|job|wow|boom|awesome|amazing|excellent|keep|it|up|going|way|to|go|got|nailed|makes|make|on|roll|fire|streak)$/i;
/** A scope after the claim: "on this page", "on that one", "on slope
 *  problems", "in this set". ("on a roll" / "on fire" are praise.) */
const SCOPE_RE = /\b(?:on|in|at|for|during|across)\s+(?!a\s+roll\b|fire\b)[\w$]/i;

function wordsOf(s: string): string[] {
  return s.split(/[^A-Za-z0-9'’]+/).filter(Boolean);
}

function removeSpans(sentence: string, claims: StreakClaim[]): string {
  let out = '';
  let pos = 0;
  for (const c of [...claims].sort((a, b) => a.index - b.index)) {
    if (c.index < pos) continue;
    out += sentence.slice(pos, c.index) + ' ';
    pos = c.index + c.text.length;
  }
  return out + sentence.slice(pos);
}

export function detectStreakClaims(sentence: string): StreakClaim[] {
  const s = typeof sentence === 'string' ? sentence : '';
  if (!s) return [];
  const numeric: StreakClaim[] = [];
  const scan = (re: RegExp, build: (m: RegExpExecArray) => StreakClaim | null) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      const c = build(m);
      if (c) numeric.push(c);
      if (m[0].length === 0) re.lastIndex++;
    }
  };
  const tally = (m: RegExpExecArray): StreakClaim | null => {
    const n = parseCountToken(m[1]);
    const of = parseCountToken(m[2]);
    if (n == null || of == null || of === 0 || n > of) return null;
    return { kind: 'tally', count: n, of, text: m[0], index: m.index };
  };
  const single = (kind: StreakClaimKind) => (m: RegExpExecArray): StreakClaim | null => {
    const n = parseCountToken(m[1]);
    if (n == null) return null;
    return { kind, count: n, text: m[0], index: m.index };
  };
  const content = <T extends (m: RegExpExecArray) => StreakClaim | null>(build: T) =>
    (m: RegExpExecArray): StreakClaim | null => (CONTENT_VERB_RE.test(s.slice(0, m.index)) ? null : build(m));
  scan(FOR_RE, content(tally));
  scan(OUT_OF_RE, content(tally));
  scan(ROW_RE, content((m) => (PLACEMENT_BEFORE_RE.test(s.slice(0, m.index)) ? null : single('streak')(m))));
  scan(STRAIGHT_RE, content(single('streak')));
  scan(DEEP_RE, content(single('deep')));

  const perfect: StreakClaim[] = [];
  PERFECT_RE.lastIndex = 0;
  let pm: RegExpExecArray | null;
  while ((pm = PERFECT_RE.exec(s)) !== null) {
    perfect.push({ kind: 'perfect', count: null, text: pm[0], index: pm.index });
  }
  if (numeric.length === 0 && perfect.length === 0) return [];

  const all = [...numeric, ...perfect];
  const residualWords = wordsOf(removeSpans(s, all));
  const fragment = residualWords.length <= 2 && wordsOf(s).length <= 6;
  const secondPerson = SECOND_PERSON_RE.test(s);
  const numericOk = numeric.length > 0 && (secondPerson || fragment || EVALUATIVE_RE.test(removeSpans(s, all)));
  const perfectOk = perfect.length > 0 && (secondPerson || fragment || numericOk);
  const out: StreakClaim[] = [];
  if (numericOk) out.push(...numeric);
  if (perfectOk) out.push(...perfect);
  return out.sort((a, b) => a.index - b.index);
}

export type StreakClaimAction = 'pass' | 'drop' | 'advisory';
export type StreakClaimReason =
  | 'flag-off' | 'no-claim' | 'unknown' | 'match'
  | 'count-mismatch' | 'perfect-with-wrong'
  | 'has-question' | 'has-verdict' | 'scoped' | 'other-content' | 'unverifiable';

export interface StreakClaimAssessment {
  action: StreakClaimAction;
  reason: StreakClaimReason;
  /** For advisory: what the mismatch was. */
  mismatch?: 'count-mismatch' | 'perfect-with-wrong';
  claims: StreakClaim[];
  /** The numeric counts claimed, in sentence order. */
  claimed: number[];
}

export function assessStreakClaim(
  sentence: string,
  tracked: {
    /** NEXT_PUBLIC_TUTOR_STREAK_CLAIM_GUARD !== 'off' */
    enabled: boolean;
    /** Tracked consecutive-correct count; null = unknown (no credited
     *  answer yet this session) ⇒ never drop. */
    consecutiveCorrect: number | null;
    /** Wrong answers credited this session; null = unknown. */
    wrongThisSession: number | null;
    /** Answers credited this session (correct + wrong), when the caller
     *  keeps that ledger. Omitted/null ⇒ the lower bound streak + wrong. */
    answersCredited?: number | null;
  },
): StreakClaimAssessment {
  const none = (reason: StreakClaimReason, claims: StreakClaim[] = []): StreakClaimAssessment => ({
    action: 'pass', reason, claims,
    claimed: claims.filter((c) => c.count != null).map((c) => c.count as number),
  });
  if (!tracked?.enabled) return none('flag-off');
  let claims: StreakClaim[] = [];
  try { claims = detectStreakClaims(sentence); } catch { return none('no-claim'); }
  if (claims.length === 0) return none('no-claim');
  const streak = tracked.consecutiveCorrect;
  if (streak == null) return none('unknown', claims);
  const wrong = tracked.wrongThisSession;
  const hadWrong = wrong != null && wrong > 0;
  const credited = tracked.answersCredited ?? (wrong != null ? streak + wrong : null);
  /** Clearly too high: two or more above the tracked streak. */
  const over = (n: number) => n > streak + 1;
  /** A perfect record of N with a wrong answer on the ledger and N larger
   *  than everything credited. */
  const falsePerfect = (n: number) => hadWrong && credited != null && n > credited;
  const hasPerfect = claims.some((c) => c.kind === 'perfect');

  // `hard` = provably too high (may drop); `soft` = a perfect-record claim
  // with a wrong answer on the ledger that may still be true of the current
  // set (advisory only).
  let hard = null as 'count-mismatch' | 'perfect-with-wrong' | null;
  let soft = false;
  const raise = (m: 'count-mismatch' | 'perfect-with-wrong') => {
    if (m === 'perfect-with-wrong' || !hard) hard = m;
  };
  for (const c of claims) {
    const n = c.count as number;
    if (c.kind === 'streak') {
      if (over(n)) raise('count-mismatch');
    } else if (c.kind === 'tally') {
      if (c.count !== c.of) continue;
      if (falsePerfect(n)) raise('perfect-with-wrong');
      else if (over(n)) raise('count-mismatch');
      else if (hadWrong) soft = true;
    } else if (c.kind === 'deep') {
      if (hasPerfect && falsePerfect(n)) raise('perfect-with-wrong');
      else if ((wrong === 0 || hasPerfect) && over(n)) raise('count-mismatch');
    } else if (hadWrong) {
      soft = true;
    }
  }
  const base = none('match', claims);
  if (!hard) {
    return soft ? { ...base, action: 'advisory', reason: 'unverifiable', mismatch: 'perfect-with-wrong' } : base;
  }
  const mismatch: 'count-mismatch' | 'perfect-with-wrong' = hard;
  const s = typeof sentence === 'string' ? sentence : '';
  const residual = removeSpans(s, claims);
  if (/\?/.test(s)) return { ...base, action: 'advisory', reason: 'has-question', mismatch };
  if (VERDICT_RE.test(residual)) return { ...base, action: 'advisory', reason: 'has-verdict', mismatch };
  if (SCOPE_RE.test(residual)) return { ...base, action: 'advisory', reason: 'scoped', mismatch };
  // Praise only: every word outside the claim is praise framing.
  if (wordsOf(residual).some((w) => !FRAMING_WORD_RE.test(w))) return { ...base, action: 'advisory', reason: 'other-content', mismatch };
  return { ...base, action: 'drop', reason: mismatch };
}
