/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 */

// --- Multi-language whiteboard intent detection ---
// Detects when the tutor claims to show, write, or display something visually.
// Two layers: (1) explicit keyword patterns for major languages, (2) a universal
// math/visual content heuristic that catches any language the patterns miss.
export const WHITEBOARD_INTENT_PATTERNS = [
  // English
  /\b(show|display|put|write|post|look at|on the (?:white)?board|here(?:'| i)s|let me (?:draw|write|show|put)|i(?:'ll| will) (?:draw|write|show|put)|see (?:the|this)|check (?:the|this) out|take a look|written (?:it |everything )?(?:down|out))\b/i,
  // German
  /\b(zeig|schau|hier (?:siehst|sieht|ist|sind)|aufschreiben|aufgeschrieben|mitschreiben|hinschreiben|anschreiben|visuell|an die Tafel|auf (?:die|dem) (?:Tafel|Whiteboard|Board)|lass (?:uns|mich) (?:das )?(?:aufschreiben|anschauen|ansehen))\b/i,
  // Spanish
  /\b(mira|muestra|escrib|pon(?:go|er|gamos)|en la pizarra|aqu[ií] (?:est[áa]|tienes|ves)|te (?:muestro|enseño)|voy a (?:escribir|mostrar|dibujar)|fíjate)\b/i,
  // French
  /\b(montr|regarde|[ée]cri[st]|affich|sur le tableau|voici|voilà|je (?:te |vous )?montre|(?:je vais|laisse[z-]moi) (?:[ée]crire|montrer|dessiner))\b/i,
  // Italian
  /\b(guard[ai]|mostr[oi]|scriv[oi]|sulla lavagna|ecco|qui (?:c'è|vedi)|ti (?:mostro|faccio vedere))\b/i,
  // Portuguese
  /\b(olh[ae]|mostr[oa]|escrev[oa]|no quadro|aqui (?:está|tens|vês)|vou (?:escrever|mostrar|desenhar))\b/i,
  // Dutch
  /\b(kijk|laat (?:me |ik )?(?:zien|schrijven)|schrijf|op het (?:bord|whiteboard)|hier (?:is|staat|zie je))\b/i,
  // Russian / Cyrillic
  /\b(смотри|показ|запиш|напиш|на доск[еу]|вот (?:так|это|формула)|покажу|давай (?:запишем|напишем))\b/i,
  // Serbian / Croatian / Bosnian (Latin script)
  /\b(tabli|tabla|napisat|zapisa|prikazat|prika[zž]|pogledaj|evo|ovde|napisali|napisao)\b/i,
  // Turkish
  /\b(bak|göster|yaz|tahtaya|burada|şimdi (?:yazıyorum|gösteriyorum))\b/i,
  // Polish
  /\b(patrz|poka[żz]|pisz|na tablicy|tutaj (?:jest|masz|widzisz)|napiszę|pokażę)\b/i,
  // Czech / Slovak
  /\b(podívej|ukaž|napiš|na tabul[ie]|tady|ukážu|napíšu)\b/i,
  // Romanian
  /\b(uite|arăt|scriu|pe tablă|aici|hai să)\b/i,
  // Hungarian
  /\b(nézd|mutato|íro[mk]|táblára|itt (?:van|látod))\b/i,
  // Arabic (transliterated patterns that Whisper produces)
  /\b(شوف|أكتب|على السبورة|هنا|انظر|أريك|سأكتب)\b/,
  // Japanese (katakana/hiragana patterns)
  /(?:見て|書く|ここに|ホワイトボード|表示|見せ)/,
  // Korean
  /(?:보세요|써|칠판|여기|보여줄게)/,
  // Chinese
  /(?:看|写|黑板|白板|这里|显示)/,
  // Hindi (transliterated)
  /\b(dekh|likht?|board par|yahan|dikha)\b/i,
  // Swahili
  /\b(angalia|andika|ubao|hapa|nionyeshe)\b/i,
];

// Universal heuristic: if the tutor text contains mathematical notation
// (equations, variables, operators) without a tool call, it likely needs a whiteboard.
// This catches ANY language the patterns above might miss.
export const MATH_CONTENT_PATTERN = /(?:[=+\-*/^].*[=+\-*/^]|[xy]\s*[=+\-]|\d+\s*[=<>]\s*\d+|\b(?:equation|formula|graph|diagram|table)\b)/i;

/** Student-problem grounding: true when the brain's rendered numeric tokens
 *  substantially match the student's recent message — i.e. the divergence from
 *  the authored example is the student's OWN stated problem, not brain drift.
 *  Generic, token-overlap only (no subject specifics). */
export function rendersStudentProblem(brainNums: Set<string>, studentText: string): boolean {
  if (!brainNums || brainNums.size === 0 || !studentText) return false;
  const studentNums = new Set(studentText.match(/-?\d+(?:\.\d+)?/g) || []);
  if (studentNums.size === 0) return false;
  let matched = 0;
  brainNums.forEach((n) => { if (studentNums.has(n)) matched += 1; });
  return matched / brainNums.size >= 0.5;
}

/** Request-TO-TUTOR framing — the student is ASKING the tutor to work/show a
 *  problem, NOT narrating their own work ("let me solve", "I get…",
 *  "substituting…") or answering a Socratic question. Deliberately excludes
 *  bare work-verbs (solve/find/compute/what is) that students use while
 *  thinking aloud — those caused a false positive on a mid-derivation turn.
 *  Generic, no subject specifics. */
export const WORK_INTENT_RE = /\b(can\s+(?:we|you)\b|could\s+you\b|would\s+you\b|walk\s+me\s+through|help\s+me\b|how\s+(?:do|would|can|should)\s+(?:i|we|you)\b|work\s+(?:through|out)\b)/i;

/** Detect that the student brought their OWN concrete problem to work. Returns
 *  the student's verbatim text (to anchor on) or null. Three-way gate:
 *  (1) request framing, (2) concrete content (has numbers), (3) divergence from
 *  BOTH the authored problem AND the current active problem (so answering a
 *  Socratic question about the active problem does NOT trigger). Generic. */
export function detectStudentBroughtProblem(studentText: string, authoredText: string, activeStatement: string): string | null {
  if (!studentText || !WORK_INTENT_RE.test(studentText)) return null;
  const sNums = studentText.match(/-?\d+(?:\.\d+)?/g) || [];
  if (sNums.length === 0) return null;
  const sSet = new Set(sNums);
  const overlap = (other: string): number => {
    const oSet = new Set((other || '').match(/-?\d+(?:\.\d+)?/g) || []);
    if (oSet.size === 0) return 0;
    let m = 0; sSet.forEach((n) => { if (oSet.has(n)) m += 1; });
    return m / sSet.size;
  };
  if (overlap(authoredText) >= 0.5) return null;          // matches the authored example → not "brought"
  if (activeStatement && overlap(activeStatement) >= 0.5) return null; // answering about the active problem
  return studentText.trim();
}

// ── Student-problem grounding v2 (2026-10-04) ─────────────────────────────
// WHY: a live session grounded the active problem on a QUESTION ABOUT the
// board. The student's real problem, typed "how to solve: x>5 or x<3", did
// not match WORK_INTENT_RE ("how to solve" is not a request shape it knows);
// a later "how do you pronounce this problem… x greater than 3 or x less
// than 3" did ("how do you" + a digit), so that mis-stated sentence became
// <active_problem>, the brain boarded "x > 3 or x < 3", and the relation
// checks stood down ("no relation in the statement") for four minutes.

/** Request shapes WORK_INTENT_RE does not know: "how to solve …", "what is
 *  the solution to …". (how do I / help me / can you are already covered.) */
const SOLVE_REQUEST_RE = /\b(?:how\s+to\s+(?:solve|do|find|graph|simplify|factor|calculate|compute|evaluate|work\s+out)\b|what(?:'s|\s+is)\s+the\s+solution\s+(?:to|of|for)\b)/i;
/** Sentence-INITIAL imperative: "solve: …", "solve this …", "please solve
 *  for …". Sentence-initial on purpose — "so I solve this and get 5" /
 *  "let me solve this" is the student narrating their own work (the reason
 *  WORK_INTENT_RE excludes bare work-verbs). No lookbehind: ships to
 *  browsers, and older Safari fails to parse one. */
const SOLVE_IMPERATIVE_RE = /(?:^|[.!?;:,]\s+|\bplease\s+)\s*solve\s*(?::|\s+this\b|\s+for\b)/i;

/** A question ABOUT what is on the board (how it is read, what it means, why
 *  it is so) — never a new problem to work. */
const BOARD_QUESTION_RES: RegExp[] = [
  /\bhow\s+(?:do|would|should|can|could|does|did)\s+(?:you|i|we|one|u)\s+(?:pronounce|say|read|write|spell|call)\b/i,
  /\bhow\s+to\s+(?:pronounce|say|read|write|spell)\b/i,
  /\bhow\s+is\s+(?:this|that|it)\s+(?:pronounced|said|read|written|spelled)\b/i,
  /\bwhat\s+(?:does|do|did|would)\b[^?]*\bmean\b/i,
  /\bwhat(?:'s|\s+is)\s+(?:this|that|it)\b[^?]*\bcalled\b/i,
  /\bwhy\b/i,
  // Sentence-initial only: "is that x < 3?" asks about the board; "what is
  // this: 3x + 2 = 11 — can you solve it" does not start with it.
  /(?:^|[.!?;:,]\s+)\s*(?:(?:so|wait|but|and|oh|ok|okay|um|hmm)[\s,]+)*is\s+(?:that|it|this)\b/i,
];

export function isBoardQuestion(text: string): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  return BOARD_QUESTION_RES.some((re) => re.test(t));
}

const RELATION_CMP_RE = /(<=|>=|!=|≤|≥|≠|<|>|=)/g;
const isCmpToken = (t: string): boolean => /^(?:<=|>=|!=|≤|≥|≠|<|>|=)$/.test(t);
const MATH_FN_RE = /(?:sqrt|sin|cos|tan|log|ln|abs)/gi;
/** A function name standing alone as a token ("2 sin x = 1"). */
const isFnToken = (t: string): boolean => /^(?:sqrt|sin|cos|tan|log|ln|abs)$/i.test(t);
/** A token that can sit inside an expression: a number, a single-letter
 *  variable, or a run mixing them with operators ("3x+2", "x^2-4",
 *  "2(x+5)"). Two adjacent letters make it a WORD (function names aside). */
function isMathToken(t: string): boolean {
  if (!t) return false;
  const core = t.replace(MATH_FN_RE, '');
  if (!/^[0-9a-z^+\-−*/×÷·().√π|]+$/i.test(core)) return false;
  return !/[a-z]{2,}/i.test(core);
}
const hasAlnum = (t: string): boolean => /[0-9a-z]/i.test(t);
const isConnector = (t: string): boolean => /^(?:or|and)$/i.test(t);
const SIGNED_NUMBER_RE = /^[+\-−]?\d+(?:\.\d+)?(?:\/\d+)?$/;

interface RelToken {
  t: string;
  /** Punctuation (":", ",", "?", …) separated this token from the next one. */
  breakAfter: boolean;
  /** Punctuation separated this token from the previous one. */
  breakBefore: boolean;
}

/** One relation found in a message: operand(s) · comparator · operand(s);
 *  a chain ("3 < x < 5") is ONE span. */
interface RelationSpan {
  start: number;
  end: number;
  text: string;
  /** `<variable> = <number>` (either order) — the shape of a stated ANSWER
   *  or a given value, never a problem to solve. */
  assignment: boolean;
  answerShaped: boolean;
  hasVariable: boolean;
  hasDigit: boolean;
  /** The span's edges are not certain: an operand sat directly against the
   *  span with no operator between ("solve for x 3x + 2 = 11"), or the span
   *  holds a function ("2 sin x = 1", "f(x) = 2x + 1"). Good enough to know
   *  the message holds math; NOT good enough to hand to a relation check. */
  doubtful: boolean;
}

function tokenizeForRelations(text: string): RelToken[] {
  const norm = (text ?? '')
    .replace(/\$/g, ' ')
    .replace(/\\(?:leqslant|leq|le)(?![a-zA-Z])/g, '≤')
    .replace(/\\(?:geqslant|geq|ge)(?![a-zA-Z])/g, '≥')
    .replace(/\\(?:neq|ne)(?![a-zA-Z])/g, '≠')
    .replace(/\\lt(?![a-zA-Z])/g, '<')
    .replace(/\\gt(?![a-zA-Z])/g, '>')
    .replace(RELATION_CMP_RE, ' $1 ');
  const out: RelToken[] = [];
  for (const raw of norm.split(/\s+/)) {
    if (!raw) continue;
    if (isCmpToken(raw)) { out.push({ t: raw, breakAfter: false, breakBefore: false }); continue; }
    const t = raw.replace(/[?!,;:.…]+$/, '').replace(/^[,;:…]+/, '');
    const breakAfter = /[?!,;:.…]+$/.test(raw);
    const breakBefore = /^[,;:…]+/.test(raw);
    if (!t) {
      // Pure punctuation: a break between its neighbours.
      if (out.length > 0) out[out.length - 1].breakAfter = true;
      continue;
    }
    out.push({ t, breakAfter, breakBefore });
  }
  return out;
}

function findRelationSpans(tokens: RelToken[]): RelationSpan[] {
  const isOperand = (k: number): boolean => !isCmpToken(tokens[k].t) && hasAlnum(tokens[k].t) && !isFnToken(tokens[k].t);
  const opEdge = /[+\-−*/×÷·^]/;
  /** Two operands side by side with no operator between them. */
  const juxtaposed = (a: number, b: number): boolean =>
    isOperand(a) && isOperand(b) && !opEdge.test(tokens[a].t.slice(-1)) && !opEdge.test(tokens[b].t.charAt(0));
  const broken = (a: number, b: number): boolean => tokens[a].breakAfter || tokens[b].breakBefore;
  const canJoin = (k: number): boolean => !isCmpToken(tokens[k].t) && (isMathToken(tokens[k].t) || isFnToken(tokens[k].t));

  const raw: Array<{ l: number; r: number; doubtful: boolean }> = [];
  for (let i = 0; i < tokens.length; i++) {
    if (!isCmpToken(tokens[i].t)) continue;
    let doubtful = false;
    let l = i;
    while (l - 1 >= 0 && canJoin(l - 1) && !broken(l - 1, l)) {
      if (juxtaposed(l - 1, l)) { doubtful = true; break; }
      l--;
    }
    let r = i;
    while (r + 1 < tokens.length && canJoin(r + 1) && !broken(r, r + 1)) {
      if (juxtaposed(r, r + 1)) { doubtful = true; break; }
      r++;
    }
    // Trim operator-only edges ("problem - x > 3").
    while (l < i && !hasAlnum(tokens[l].t)) l++;
    while (r > i && !hasAlnum(tokens[r].t)) r--;
    if (l === i || r === i) continue; // a comparator with an empty side
    const last = raw[raw.length - 1];
    if (last && l <= last.r) { last.r = Math.max(last.r, r); last.doubtful = last.doubtful || doubtful; } // chain: 3 < x < 5
    else raw.push({ l, r, doubtful });
  }
  return raw.map(({ l, r, doubtful }) => {
    const rel = tokens.slice(l, r + 1).map((x) => x.t);
    const text = rel.join(' ');
    const operandText = rel.filter((t) => !isCmpToken(t)).join(' ').replace(MATH_FN_RE, '');
    const sides: string[] = [];
    const cmps: string[] = [];
    let cur = '';
    for (const t of rel) {
      if (isCmpToken(t)) { sides.push(cur); cmps.push(t); cur = ''; } else cur += t;
    }
    sides.push(cur);
    const loneVar = (s: string): boolean => /^[a-z]$/i.test(s);
    const assignment = cmps.length === 1 && cmps[0] === '=' && sides.length === 2
      && ((loneVar(sides[0]) && SIGNED_NUMBER_RE.test(sides[1])) || (loneVar(sides[1]) && SIGNED_NUMBER_RE.test(sides[0])));
    const hasFunction = rel.some((t) => isFnToken(t)) || /[a-z]\(/i.test(text) || /(?:sqrt|sin|cos|tan|log|ln|abs)/i.test(text);
    return {
      start: l,
      end: r,
      text,
      assignment,
      answerShaped: sides.filter(Boolean).every((s) => /^[+\-−]?(?:[a-z]|\d+(?:\.\d+)?(?:\/\d+)?)$/i.test(s)),
      hasVariable: /[a-z]/i.test(operandText),
      hasDigit: /\d/.test(operandText),
      doubtful: doubtful || hasFunction,
    };
  });
}

export interface SymbolicRelation {
  /** Normalised text, comparators spaced: "x > 5 or x < 3". */
  text: string;
  /** Tokens of the relation (connectors included). */
  tokenCount: number;
  /** Every side of every comparator is a lone variable or a plain number
   *  ("x = 5", "x > 5 or x < 3", "3 < x < 5") — the shape of an ANSWER. */
  answerShaped: boolean;
  hasVariable: boolean;
  hasDigit: boolean;
  /** Share of the message's word tokens that belong to the relation. */
  coverage: number;
}

/**
 * The first symbolic relation in a message: operand(s) · comparator ·
 * operand(s), chains ("3 < x < 5") and "or"/"and" compounds included. Prose
 * comparatives ("x greater than 3") are NOT relations — no comparator symbol.
 * Returns null when there is none.
 */
export function extractSymbolicRelation(text: string): SymbolicRelation | null {
  const tokens = tokenizeForRelations(text);
  if (tokens.length === 0) return null;
  const spans = findRelationSpans(tokens);
  if (spans.length === 0) return null;
  const wordTokens = tokens.filter((x) => isCmpToken(x.t) || hasAlnum(x.t)).length;
  // Compound: spans separated by exactly one "or" / "and".
  const parts = [spans[0]];
  for (let s = 1; s < spans.length; s++) {
    const prev = parts[parts.length - 1];
    if (spans[s].start === prev.end + 2 && isConnector(tokens[prev.end + 1].t)) parts.push(spans[s]);
    else break;
  }
  const start = parts[0].start;
  const end = parts[parts.length - 1].end;
  const tokenCount = end - start + 1;
  return {
    text: tokens.slice(start, end + 1).map((x) => x.t).join(' '),
    tokenCount,
    answerShaped: parts.every((p) => p.answerShaped),
    hasVariable: parts.some((p) => p.hasVariable),
    hasDigit: parts.some((p) => p.hasDigit),
    coverage: wordTokens > 0 ? tokenCount / wordTokens : 0,
  };
}

/** A message is "mostly a relation" at this share of its tokens. */
export const BARE_RELATION_MIN_COVERAGE = 0.6;

export type ProblemGroundingReason =
  // grounded
  | 'request-relation' | 'request-prose' | 'bare-relation'
  // not grounded
  | 'empty' | 'board-question' | 'answer-check' | 'assignment-only' | 'no-request' | 'no-content'
  | 'bare-problem-active' | 'bare-answer-shaped' | 'bare-no-lead-in' | 'bare-step'
  | 'matches-authored' | 'matches-active'
  // kill switch off — the legacy detector decided
  | 'legacy';

export interface ProblemGroundingDecision {
  /** The statement to ground on — the student's own SENTENCE (minus a
   *  request lead-in), never a fragment cut out of it — or null. */
  problem: string | null;
  /** The one relation the student asked to SOLVE, for the downstream relation
   *  checks only. Set only when the message holds exactly one relation, that
   *  relation is not an assignment ("x = 4"), its edges are certain, and the
   *  task is "solve" (not graph / evaluate / find the slope). Otherwise
   *  undefined — the checks then read the statement, as they do for any card. */
  relation?: string;
  reason: ProblemGroundingReason;
}

/** The student is proposing or checking an ANSWER to the problem already on
 *  the board — never a new problem, whatever request words surround it. */
const ANSWER_CHECK_RE = /\bmy\s+answer\b|\bi\s+got\b|\bis\s+it\b|\bis\s+[a-z]\s*=|\bcheck\b|\bis\s+that\s+right\b/i;

/** An explicit request to SOLVE: "how do I solve …", "how to solve …",
 *  "can you (help me) solve …", "help me solve …". */
const EXPLICIT_SOLVE_PHRASE_RE = /\b(?:how\s+(?:do|would|can|should|could)\s+(?:i|we|you|u)\s+solve|how\s+to\s+solve|(?:can|could|would|will)\s+(?:you|we|u)\s+(?:please\s+)?(?:help\s+me\s+(?:to\s+)?)?solve|help\s+me\s+(?:to\s+)?solve)\b/i;
/** "Solve 5x - 1 = 9" opening a sentence (not after a comma — "…, solve 3x =
 *  9 and get 3" is the student narrating). */
const SOLVE_SENTENCE_START_RE = /(?:^|[.!?:]\s+)\s*(?:please\s+)?solve\s+(?=\S)/i;

const SOLVE_TASK_RE = /\bsolv(?:e|ing)\b|\bsolutions?\b/i;
/** Any task other than "solve this relation" — its answer is not the
 *  relation's solution set, so no relation is handed to the checks. */
const OTHER_TASK_RE = /\b(?:graph|plot|sketch|draw|slope|intercepts?|evaluate|simplify|factor|expand|differentiate|derivative|integrate|integral|domain|range|vertex|maximum|minimum|prove|system)\b|\bfind\b(?!\s+(?:the\s+)?solutions?\b)/i;

/** BARE path only — words that say "this is a problem to work": an opening
 *  "next problem" / "my homework says" / "problem:", or a task verb. Without
 *  one, a relation typed on its own ("3x + 2 = 11", "6x = 18") cannot be told
 *  from a working STEP, and it is not grounded. */
const BARE_PROBLEM_LEAD_IN_RE = /^\s*(?:(?:the\s+)?(?:next|new|another)\s+(?:problem|question|one)\b|my\s+(?:homework|worksheet|assignment|textbook|book|teacher)\s+(?:says|asks|has|is)\b|(?:problem|question)\s*(?:\d+\s*)?:)|\b(?:solve|simplify|factor|graph|find|evaluate|expand)\b/i;
/** BARE path only — words of someone narrating their own work. */
const BARE_STEP_WORD_RE = /\b(?:so|then|right|therefore|because|thus|hence|i\s+(?:got|get|have|think))\b|\?\s*$/i;

/** Strips the request lead-in ("can you help me", "how do I", "how to",
 *  "please", "hey") from the front of a message; the task verb stays. Falls
 *  back to the full text when nothing with a digit would be left. */
function stripRequestLeadIn(text: string): string {
  let s = text.trim();
  for (let pass = 0; pass < 4; pass++) {
    const before = s;
    s = s
      .replace(/^(?:(?:ok(?:ay)?|hi|hey|hello|so|um+|uh+|well|please|also|now)\b[\s,.!]*)+/i, '')
      .replace(/^(?:can|could|would|will)\s+(?:you|we|u)\s+(?:please\s+)?(?:help\s+me(?:\s+(?:with|to))?\b|show\s+me\s+how\s+to\b|tell\s+me\s+how\s+to\b)?/i, '')
      .replace(/^(?:i\s+need\s+help|help\s+me)(?:\s+(?:with|to))?\b/i, '')
      .replace(/^how\s+(?:do|would|can|should|could)\s+(?:i|we|you|u)\b/i, '')
      .replace(/^how\s+to\b/i, '')
      .replace(/^[\s,:;.…]+/, '')
      .trim();
    if (s === before) break;
  }
  return /\d/.test(s) ? s : text.trim();
}

/**
 * Did the student bring their OWN problem — and what is its statement?
 *
 * Governing rule: act only on the unmistakable case; otherwise the active
 * problem stays what it was.
 *
 *  1. A question ABOUT the board (pronounce / read / mean / why / "is that…")
 *     does not ground — UNLESS the same message also explicitly asks for a
 *     relation to be solved ("why is 3x+2=11 solved by subtracting? can you
 *     solve 5x - 1 = 9 instead"); the explicit request wins, and the
 *     divergence test in (5) then decides whether it is a NEW problem.
 *  2. While a problem is active, a message that proposes or checks an ANSWER
 *     ("my answer", "I got", "is it", "is x =", "check", "is that right", or
 *     whose only relation is `<var> = <number>`) never grounds: grounding on
 *     it would replace the problem with its own answer. With or without an
 *     active problem, a lone `<var> = <number>` is never a problem.
 *  3. REQUEST path — the message asks the tutor to work something. Content:
 *     a symbolic relation, or failing that digits (a word problem, stored
 *     verbatim as before).
 *  4. BARE path — no request words, the message is mostly relation(s) with a
 *     variable and digits. Only while NO problem is active, only when the
 *     relations are not all answer-shaped, only with a lead-in that says it
 *     is a problem ("next problem", "my homework says", "problem:", a task
 *     verb) and no step words ("so", "then", "right", "I got", a trailing
 *     "?"). A relation typed on its own is NOT grounded: it reads as a step.
 *  5. Divergence, as before: at least half of its numbers appearing in the
 *     authored problem or the active problem means it IS that problem.
 *
 * The STATEMENT is always the student's sentence (minus the request lead-in)
 * — storing only the first relation dropped the task ("graph", "find f(3)")
 * and the rest of the givens. The relation travels separately in `relation`.
 */
export function decideStudentProblemGrounding(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_PROBLEM_GROUNDING_RELATION !== 'off');
   *  off ⇒ detectStudentBroughtProblem decides, exactly as before. */
  enabled: boolean;
  studentText: string;
  authoredText: string;
  activeStatement: string;
}): ProblemGroundingDecision {
  const text = (input.studentText ?? '').trim();
  if (!input.enabled) {
    const legacy = detectStudentBroughtProblem(text, input.authoredText, input.activeStatement);
    return { problem: legacy, reason: 'legacy' };
  }
  const no = (reason: ProblemGroundingReason): ProblemGroundingDecision => ({ problem: null, reason });
  if (!text) return no('empty');

  const active = (input.activeStatement ?? '').trim();
  const tokens = tokenizeForRelations(text);
  const spans = findRelationSpans(tokens).filter((s) => s.hasDigit);
  const problemSpans = spans.filter((s) => !s.assignment);
  const onlyAssignment = spans.length === 1 && spans[0].assignment;

  const solvePhrase = EXPLICIT_SOLVE_PHRASE_RE.exec(text) ?? SOLVE_IMPERATIVE_RE.exec(text) ?? SOLVE_SENTENCE_START_RE.exec(text);
  const explicitSolve = !!solvePhrase && problemSpans.length > 0;
  if (!explicitSolve && isBoardQuestion(text)) return no('board-question');
  if (active && (ANSWER_CHECK_RE.test(text) || onlyAssignment)) return no('answer-check');

  const request = explicitSolve || WORK_INTENT_RE.test(text) || SOLVE_REQUEST_RE.test(text) || SOLVE_IMPERATIVE_RE.test(text);
  let candidate: string;
  let reason: ProblemGroundingReason;
  /** The numbers that identify the problem, for the divergence test. */
  let identity: string;
  /** Set when `identity` is the one relation an explicit solve request names. */
  let namedRelation = false;
  if (request) {
    if (spans.length > 0) {
      // A lone "x = 4" with nothing else to work on is an answer or a given.
      if (onlyAssignment) {
        const outside = tokens.filter((_, k) => k < spans[0].start || k > spans[0].end).map((x) => x.t).join(' ');
        if (!/\d/.test(outside)) return no('assignment-only');
      }
      candidate = stripRequestLeadIn(text);
      reason = 'request-relation';
      identity = candidate;
      if (explicitSolve && solvePhrase) {
        // The relation the request NAMES: the first one after "solve", else
        // ("…, can you help me solve it") the first one in the message.
        const after = findRelationSpans(tokenizeForRelations(text.slice(solvePhrase.index + solvePhrase[0].length)))
          .filter((s) => s.hasDigit && !s.assignment);
        identity = (after[0] ?? problemSpans[0]).text;
        namedRelation = true;
      }
    } else if (/\d/.test(text)) { candidate = text; reason = 'request-prose'; identity = text; }
    else return no('no-content');
  } else {
    if (spans.length === 0 || !spans.some((s) => s.hasVariable)) return no('no-request');
    const wordTokens = tokens.filter((x) => isCmpToken(x.t) || hasAlnum(x.t)).length;
    let covered = 0;
    spans.forEach((s, k) => {
      covered += s.end - s.start + 1;
      const next = spans[k + 1];
      if (next && next.start === s.end + 2 && isConnector(tokens[s.end + 1].t)) covered += 1;
    });
    if (wordTokens === 0 || covered / wordTokens < BARE_RELATION_MIN_COVERAGE) return no('no-request');
    if (active) return no('bare-problem-active');
    if (spans.every((s) => s.answerShaped)) return no('bare-answer-shaped');
    // Review 2026-10-04: with nothing active, a student's working step
    // ("then 3x = 9 right", "2x = 8, x = 4", "3x + 2 = 11") was grounded as a
    // problem they brought — the legacy detector returned null for all of
    // them (no request wording). A relation on its own is a step as often as
    // a problem, so the bare path now needs words that say it is a problem,
    // and none that say it is a step. (Deferring to the legacy detector here
    // would add nothing: it requires WORK_INTENT_RE, which is the request
    // path above.)
    if (!BARE_PROBLEM_LEAD_IN_RE.test(text)) return no('bare-no-lead-in');
    if (BARE_STEP_WORD_RE.test(text)) return no('bare-step');
    candidate = text; reason = 'bare-relation'; identity = text;
  }

  // Relation against statement: an exponent is structure, not a value ("x^2 +
  // 5x + 6 = 0" does not share its "2" with "2x + 6 = 14"). The other paths
  // count numbers exactly as before.
  const nums = (s: string): Set<string> =>
    new Set(((namedRelation ? (s || '').replace(/\^\s*\{?\s*\d+\s*\}?/g, ' ') : s) || '').match(/\d+(?:\.\d+)?/g) || []);
  const cSet = nums(identity);
  const overlap = (other: string): number => {
    const oSet = nums(other);
    if (oSet.size === 0 || cSet.size === 0) return 0;
    let m = 0; cSet.forEach((n) => { if (oSet.has(n)) m += 1; });
    return m / cSet.size;
  };
  if (overlap(input.authoredText) >= 0.5) return no('matches-authored');
  if (active && overlap(active) >= 0.5) return no('matches-active');

  // `relation` — only the unmistakable case (see ProblemGroundingDecision).
  const all = findRelationSpans(tokens);
  const only = all.length === 1 ? all[0] : null;
  const relation = only && only.hasDigit && !only.assignment && !only.doubtful
    && SOLVE_TASK_RE.test(text) && !OTHER_TASK_RE.test(text)
    ? only.text
    : undefined;
  return relation ? { problem: candidate, relation, reason } : { problem: candidate, reason };
}

/** FIX A backstop — decide whether a turn's first sentence is a genuine
 *  content-free opener, safe to voice ungated. The prompt rule is the
 *  primary guarantee; this re-gates a sentence-0 that looks substantive
 *  so a doomed-then-retried turn never lets the student hear two voices.
 *  Deliberately liberal at catching substance: a false "not safe"
 *  (re-gating a real opener) only forfeits the latency win that turn —
 *  a false "safe" (voicing real content ungated) is the failure mode. */
export function isSafeOpener(s: string): boolean {
  if (/\d/.test(s)) return false;                  // any digit → a value/claim
  if (/[=+×÷√^%<>≤≥*/]/.test(s)) return false;     // math operators → a claim
  if (/\?/.test(s)) return false;                  // a question → student must act
  if (s.split(/\s+/).filter(Boolean).length > 10) return false; // too long for an opener
  return true;
}

/** Round-15 Issue 2 (2026-07-16) — verdict-opener detector. A sentence
 *  that OPENS with a judgment of the student's answer ("Not quite…",
 *  "That's right…", "Spot on.") must not reach the speaker until the
 *  turn's verdict is settled: the observed live failure was TTS playing
 *  "Not qu—" before the contradiction-inversion kill chopped it and the
 *  retry affirmed the same answer. Verdicts pass isSafeOpener (short,
 *  no digits/operators/question) so the fast-opener bypass voiced them
 *  instantly; this detector re-gates them into the verdict hold.
 *  Anchored to the sentence START — a mid-sentence "right"/"correct" is
 *  ordinary narration. Leans inclusive: a false positive only holds a
 *  non-verdict sentence briefly; a false negative re-opens the
 *  speak-then-kill window. Generic phrasing only, no subject content. */
/** Round-25 (2026-07-18, session portal-59ae30c7) — conversational filler
 *  inside show_equation latex. The brain second-guessed a CORRECT card,
 *  emitted a "fix", and aborted mid-thought INSIDE the latex argument:
 *  "e^x \sin x' \cdot wait" rendered verbatim on the board. Detects bare
 *  filler words in latex OUTSIDE \text{…}/\mathrm{…} wrappers (a stats
 *  problem's \text{waiting time} is legitimate). Returns the matched
 *  filler for the corrective message, or null when clean. */
const LATEX_FILLER_RE = /\b(wait|hold on|hang on|hmm+|umm+|oops|whoops|sorry|let me|actually|nevermind|never mind|scratch that|one sec|no wait)\b/i;
export function latexProseFiller(latex: string): string | null {
  const stripped = latex.replace(/\\(?:text|mathrm|textbf|mathbf)\{[^{}]*\}/g, ' ');
  const m = stripped.match(LATEX_FILLER_RE);
  return m ? m[1] : null;
}

/** Round-21 dup-def guard, extracted + hardened (2026-07-23). A show_equation
 *  latex that defines the SAME function name twice with DIFFERENT bodies is
 *  always an authoring error (letter drift: card says "g(x)=2x^2-3, g(x)=x+4"
 *  while the narration says f and g). The original inline VTR version failed
 *  open on real cards because (a) a `\\` line break swallowed the second
 *  definition into the first body capture — multi-line cards were never
 *  checked — and (b) `f\left(x\right)=` broke the name pattern. Normalizes
 *  both before matching. Returns the duplicated name, or null when clean. */
export function duplicateFunctionDef(latex: string): string | null {
  if (!latex) return null;
  const s = String(latex)
    .replace(/\\left|\\right/g, '')
    // Line breaks / spacing commands act as definition separators — turn
    // them into ',' so the body capture stops there and the NEXT definition
    // is seen. (Truncating a body at `\,` only affects both copies equally.)
    .replace(/\\\\|\\quad\b|\\qquad\b|\\;|\\,/g, ',');
  const defs = new Map<string, string>();
  // Name: single letter with optional simple subscript, not preceded by a
  // letter or backslash (so `\sin(x)=…` can't register a function "n").
  for (const m of s.matchAll(/(?<![a-zA-Z\\])([a-zA-Z](?:_\{?[a-zA-Z0-9]+\}?)?)\s*\(\s*[a-zA-Z]\s*\)\s*=\s*([^,;=]+)/g)) {
    const name = m[1];
    const body = m[2].replace(/\s+/g, '');
    const prior = defs.get(name);
    if (prior !== undefined && prior !== body) return name;
    defs.set(name, body);
  }
  return null;
}

export function isVerdictOpener(s: string): boolean {
  const t = s.trim();
  if (!t || /\?\s*$/.test(t)) return false; // a question is a prompt, not a verdict
  return /^(?:not\s+(?:quite|exactly|really|at\s+all|right|correct)\b|almost[.!,\s]|close[.!,\s]|so\s+close\b|nearly\s+there\b|nope\b|yep[.!,\s]|yes\s*[.!,—–-]|yes\s+and\s+no\s*[.!,—–-]|no\s*[.!,—–-]|hmm+,?\s+not\b|that'?s\s+(?:right|correct|exactly|it\b|not\b|wrong|close|almost)|exactly[.!,\s]|correct[.!,\s]|right\s*[.!,—–-]|right\s+(?:idea|track|direction|thinking|start)\b|perfect[.!,\s]|spot\s+on\b|bingo\b|you\s+(?:got|nailed|have)\s+it\b|you'?re\s+(?:right|correct|close|almost|nearly)\b|you\s+had\s+it\b|well\s+done\b|nice\s+(?:work|job|one)\b|great\s+(?:work|job)\b|good\s+(?:work|job|thinking|idea|start|instinct|thought)\b|wrong\b)/i.test(t);
}

// ── Judge-kill Stage 3.1 (2026-06-16) restatement detector ────────────
// When a content-correctness kill fires mid-narration and the retry comes
// back saying substantively the SAME thing (a re-statement, not a real
// correction), the orchestrator replays the killed attempt's unplayed TTS
// tail instead of letting the retry re-speak the overlap (the audible
// self-correction symptom: "Spot on. That's the hyperbola" [KILL] "Right."
// [KILL] "The equation has a minus sign…"). `isJudgeKillRestatement`
// decides "same thing" via content-word overlap PLUS a numeric-token guard.
// The numeric guard is load-bearing: validators kill on VALUE mismatches
// and the retry corrects the value, so a changed/new number is the signal
// of a REAL correction — replaying the old (wrong-value) tail there would
// voice wrong content. Generic (no subject terms), per [[feedback_generic_prompts]].
export const JUDGE_KILL_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'so', 'to', 'of', 'in', 'on', 'at',
  'is', 'are', 'was', 'were', 'that', 'this', 'it', 'its', 'as', 'for', 'with',
  'i', 'you', 'we', 'your', 'my', 'me', 'here', 'there', 'let', 'lets',
  'okay', 'ok', 'right', 'well', 'now', 'then', 'just', 'do', 'does', 'did',
  'be', 'been', 'have', 'has', 'had', 'what', 'how', 'why', 'when', 'if',
  'not', 'no', 'yes', 'yeah', 'great', 'good', 'nice', 'exactly', 'perfect',
  'spot', 'sure', 'got', 'gonna', 'going', 'about', 'into', 'from', 'by',
]);
export function judgeKillContentWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length >= 2 && !JUDGE_KILL_STOPWORDS.has(w));
}
/** Numbers, decimals, fractions (1/2), percentages (50%) — the value
 *  tokens a correctness retry would change. */
export function judgeKillNumericTokens(s: string): string[] {
  return s.match(/\d+(?:[./]\d+)?%?/g) ?? [];
}
/** True when `retry` is a re-statement of `killed`: ≥60% content-word
 *  overlap relative to the SHORTER text, ≥2 shared content words, AND no
 *  number in `retry` absent from `killed` (so a value correction is never
 *  mistaken for a restatement).
 *
 *  The min-denominator matters: the killed text is captured at kill time, so
 *  it's a truncated prefix (often a single sentence — the kill fires mid-
 *  stream), while a faithful retry re-delivers the FULL response. Dividing by
 *  the retry length systematically under-scored faithful restatements
 *  (observed 2026-06-16: an IDENTICAL retry scored 0.23 and wrongly "diverged"
 *  because the killed snippet was a 1-sentence prefix of the 3-sentence
 *  retry). Relative-to-shorter treats "killed ⊆ retry" as the strong
 *  restatement signal it is. */
export function isJudgeKillRestatement(retry: string, killed: string): boolean {
  const rSet = new Set(judgeKillContentWords(retry));
  const kSet = new Set(judgeKillContentWords(killed));
  if (rSet.size === 0 || kSet.size === 0) return false;
  let shared = 0;
  for (const w of rSet) if (kSet.has(w)) shared++;
  const overlap = shared / Math.min(rSet.size, kSet.size);
  if (shared < 2 || overlap < 0.6) return false;
  const kNums = new Set(judgeKillNumericTokens(killed));
  if (judgeKillNumericTokens(retry).some((n) => !kNums.has(n))) return false;
  return true;
}

/** Extract the first sentence of a brain response and normalize it for
 *  cross-turn comparison. Used by the disclaimer-verbatim-reuse guard
 *  to detect openers that repeat across consecutive generate_problem
 *  hits. Split on terminal punctuation (. ! ?) and take the first
 *  non-empty chunk; lowercase + collapse whitespace. Some brain outputs
 *  omit the post-period space ("for you.Off the top of my head…"), so
 *  the regex doesn't require a trailing space. Falls back to the full
 *  string if no terminal punctuation is found. */
export function extractSentence1Normalized(s: string): string {
  const m = s.match(/^[^.!?]+/);
  return (m ? m[0] : s).toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Strict deep-equal for prescribedRender validator. Returns true when
 *  `a` and `b` are structurally identical (same keys + same primitive
 *  values + element-wise array equality). Types are NOT coerced: the
 *  string "5" is not equal to the number 5. Used to verify the brain's
 *  emitted tool args match the lesson-plan-authored prescribed params
 *  verbatim. */
export function deepEqualParams(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqualParams(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const ak = Object.keys(ao); const bk = Object.keys(bo);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => Object.prototype.hasOwnProperty.call(bo, k) && deepEqualParams(ao[k], bo[k]));
  }
  if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) return true;
  return false;
}

/** Detect a "mute me" / "stop listening" voice command so the orchestrator can
 *  mute the mic instead of routing it to the brain as a question. Kept tight to
 *  avoid false positives: it must be a SHORT command-like utterance (a long
 *  sentence that merely mentions "mute" is not a command). The student re-opens
 *  the mic with the dock button (a muted mic can't hear an "unmute" command). */
export function isMuteMeCommand(text: string): boolean {
  const t = text.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t) return false;
  const words = t.split(' ');
  if (words.length > 7) return false; // a command, not a sentence about muting
  if (/\bstop listening\b/.test(t)) return true;
  if (/\bmute\b/.test(t) && /\b(me|mic|mike|microphone|my|myself|yourself|it|that|now|please)\b/.test(t)) return true;
  if (/^mute$/.test(t)) return true;
  return false;
}
