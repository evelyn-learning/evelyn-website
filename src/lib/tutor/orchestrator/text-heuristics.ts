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
  return /^(?:not\s+(?:quite|exactly|really|at\s+all|right|correct)\b|almost[.!,\s]|close[.!,\s]|so\s+close\b|nearly\s+there\b|nope\b|yep[.!,\s]|yes[.!,]|no[.!,]|hmm+,?\s+not\b|that'?s\s+(?:right|correct|exactly|it\b|not\b|wrong|close|almost)|exactly[.!,\s]|correct[.!,\s]|right[.!,]|right\s+(?:idea|track|direction|thinking|start)\b|perfect[.!,\s]|spot\s+on\b|bingo\b|you\s+(?:got|nailed|have)\s+it\b|you'?re\s+(?:right|correct|close|almost|nearly)\b|you\s+had\s+it\b|well\s+done\b|nice\s+(?:work|job|one)\b|great\s+(?:work|job)\b|good\s+(?:work|job|thinking|idea|start|instinct|thought)\b|wrong\b)/i.test(t);
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
