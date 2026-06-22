/**
 * Board-anchor structural assists (pure, side-effect-free, unit-tested).
 *
 * Two helpers for the Board-Anchored-Speech feature where prompt pressure
 * plateaued (measured 2026-06-22, Console1/2/3):
 *
 *  1. RE-ANCHOR (emit-ordering) — the brain front-loads a turn-opening
 *     equation/figure tool-call, so render-sync (which anchors a render to its
 *     PRECEDING stream sentence) surfaces it during the opening sentence rather
 *     than when it's introduced. `extractAnchorKeywords` + `sentenceIntroduces-
 *     Anchor` let the orchestrator hold a turn-opening anchor and re-anchor it
 *     to the first later sentence that NAMES it (fail-safe to turn-end).
 *
 *  2. TRANSFORMATION ARROW (SKETCH, transformations only) — when the tutor
 *     narrates a clean "A turns into B" transformation and fires NO board anchor
 *     that turn, `detectTransformation` extracts (A, B) so the orchestrator can
 *     auto-write a short "A → B". Deliberately CONSERVATIVE: only explicit-A
 *     patterns, blocks figurative "becomes <adjective/sign>", fails safe to null
 *     (render nothing) rather than risk writing a wrong arrow. Implicit-subject
 *     ("turning into X") and reaction-equation ("reacts to form X") cases are
 *     skipped as too ambiguous to render safely.
 *
 * Both are gated OFF by default behind NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_ASSIST in
 * the orchestrator. See project_tutor_board_anchored_speech.
 */

export interface AnchorKeywords {
  kind: 'equation' | 'figure';
  /** Distinctive title/label words (≥4 chars, lowercased) that a sentence
   *  naming this anchor is likely to repeat. */
  tokens: string[];
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'into', 'from', 'over',
  'your', 'their', 'about', 'these', 'those', 'show', 'shows', 'graph',
  'equation', 'formula', 'diagram', 'figure', 'chart', 'table',
]);

/** Words a sentence uses to point at an equation / a figure. The introducing
 *  sentence for an anchor almost always contains one of these. */
const KIND_WORDS: Record<AnchorKeywords['kind'], string[]> = {
  equation: ['equation', 'formula'],
  figure: ['graph', 'plot', 'curve', 'diagram', 'figure', 'picture', 'sketch'],
};

/**
 * Pull the kind + distinctive title words from a whiteboard render command, or
 * null if it isn't a "discussable" anchor (problems, tables, scribbles, meta
 * commands are excluded — they aren't front-loaded-then-narrated the same way).
 */
export function extractAnchorKeywords(cmd: unknown): AnchorKeywords | null {
  const c = cmd as { action?: string; label?: string; title?: string; data?: { title?: string } };
  const action = String(c?.action ?? '');
  let kind: AnchorKeywords['kind'] | null = null;
  if (action === 'showEquation') kind = 'equation';
  else if (action === 'showGraph' || action === 'showFunctionGraph' || action === 'showGeometry' || action === 'showDiagram') kind = 'figure';
  if (!kind) return null;

  const title = c.label || c.title || c.data?.title || '';
  const tokens = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
  return { kind, tokens };
}

/**
 * Does this sentence INTRODUCE the given anchor — i.e. is it the line the tutor
 * speaks as it brings the equation/figure up? True when the sentence names the
 * anchor's kind ("equation"/"graph"/…) or repeats a distinctive title word.
 */
export function sentenceIntroducesAnchor(sentence: string, anchor: AnchorKeywords): boolean {
  const s = ` ${String(sentence ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ')} `;
  for (const kw of KIND_WORDS[anchor.kind]) {
    if (s.includes(` ${kw} `)) return true;
  }
  for (const tok of anchor.tokens) {
    if (s.includes(` ${tok} `)) return true;
  }
  return false;
}

// ─────────────────────────── transformation arrow ───────────────────────────

/** B-side words that signal a figurative / state-change "becomes", NOT a
 *  thing-into-thing transformation we should draw (e.g. "ΔS becomes negative",
 *  "it becomes clear"). Blocks the most common false fires. */
const NON_ENTITY_WORDS = new Set([
  'clear', 'clearer', 'obvious', 'apparent', 'evident', 'easier', 'harder',
  'easy', 'hard', 'simple', 'simpler', 'positive', 'negative', 'zero', 'large',
  'larger', 'small', 'smaller', 'bigger', 'less', 'more', 'greater', 'higher',
  'lower', 'spontaneous', 'unstable', 'stable', 'important', 'possible',
  'impossible', 'true', 'false', 'clearer', 'visible', 'dominant',
]);

const ENTITY_STOPWORDS = new Set(['the', 'a', 'an', 'some', 'any', 'its', 'their', 'this', 'that', 'back', 'just', 'only', 'pure']);

/** Trailing adverbial / temporal words to strip off a captured entity
 *  ("iron oxide over time" → "iron oxide"). */
const ENTITY_TRAILING = new Set(['over', 'time', 'now', 'again', 'eventually', 'slowly', 'quickly', 'gradually', 'today', 'instead', 'here', 'there', 'completely', 'entirely']);

/** Clean a captured noun phrase: trim, drop leading determiners, collapse space.
 *  Returns null if it isn't a plausible entity (empty, too long, no real noun-
 *  like word, or a blocked figurative term). */
function cleanEntity(raw: string): string | null {
  let s = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = s.split(' ').filter(Boolean);
  while (words.length && ENTITY_STOPWORDS.has(words[0])) words.shift();
  while (words.length && ENTITY_TRAILING.has(words[words.length - 1])) words.pop();
  if (words.length === 0 || words.length > 5) return null;
  // Reject figurative / sign / adjective targets.
  if (words.every((w) => NON_ENTITY_WORDS.has(w))) return null;
  if (words.length === 1 && NON_ENTITY_WORDS.has(words[0])) return null;
  s = words.join(' ');
  if (s.length < 2) return null;
  return s;
}

// Explicit-A transformation patterns only (precision over recall). Each capture
// group 1 = A (source), group 2 = B (target). End the target capture at a clause
// boundary so we don't swallow the rest of the sentence.
const END = '(?:[.,;:!?—]|\\b(?:because|since|which|while|when|so that|and then|so)\\b|$)';
const TRANSFORM_PATTERNS: RegExp[] = [
  new RegExp(`\\bturning\\s+(.+?)\\s+(?:back\\s+)?into\\s+(.+?)\\s*${END}`, 'i'),
  new RegExp(`\\bturns?\\s+(.+?)\\s+(?:back\\s+)?into\\s+(.+?)\\s*${END}`, 'i'),
  new RegExp(`\\bconvert(?:ing|s)?\\s+(.+?)\\s+(?:back\\s+)?(?:in)?to\\s+(.+?)\\s*${END}`, 'i'),
  new RegExp(`\\b(.+?)\\s+turns?\\s+into\\s+(.+?)\\s*${END}`, 'i'),
];

export interface Transformation { from: string; to: string }

/**
 * Detect a clean "A turns into B" transformation in a sentence and return the
 * two entities, or null. Conservative by design — only explicit-A patterns,
 * both sides must clean to plausible entities, figurative "becomes X" is not
 * matched at all.
 */
export function detectTransformation(text: string): Transformation | null {
  const t = String(text ?? '');
  if (!t.trim()) return null;
  for (const re of TRANSFORM_PATTERNS) {
    const m = t.match(re);
    if (!m) continue;
    const from = cleanEntity(m[1]);
    const to = cleanEntity(m[2]);
    if (from && to && from !== to) return { from, to };
  }
  return null;
}

/** LaTeX for the auto-drawn transformation arrow: `\text{A} \rightarrow \text{B}`. */
export function buildTransformationLatex(t: Transformation): string {
  const esc = (s: string) => s.replace(/[\\{}]/g, '');
  return `\\text{${esc(t.from)}} \\rightarrow \\text{${esc(t.to)}}`;
}
