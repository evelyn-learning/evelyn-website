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
   *  naming this anchor is likely to repeat. ANY one match → introduces. */
  tokens: string[];
  /** Spoken forms of the equation's symbols (e.g. "delta g", "delta h") parsed
   *  from its LaTeX — the brain often introduces an equation by speaking its
   *  terms ("when delta G is negative…") without saying the word "equation".
   *  Requires ≥2 matches so a single vague symbol mention doesn't trigger. */
  symbolTokens: string[];
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
  const c = cmd as { action?: string; label?: string; title?: string; latex?: string; data?: { title?: string } };
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
  const symbolTokens = kind === 'equation' ? latexToSymbolTokens(c.latex || '') : [];
  return { kind, tokens, symbolTokens };
}

const GREEK = ['alpha', 'beta', 'gamma', 'delta', 'theta', 'lambda', 'mu', 'sigma', 'omega', 'phi', 'psi', 'pi', 'rho', 'tau'];

/** Spoken-symbol tokens from an equation's LaTeX: "\Delta G" → "delta g",
 *  "\alpha" → "alpha". Greek-prefixed variables (the most distinctive, e.g.
 *  ΔG/ΔH/ΔS) only — bare single letters are too noisy to match reliably. */
function latexToSymbolTokens(latex: string): string[] {
  const out = new Set<string>();
  const s = String(latex ?? '');
  // \Delta G  /  \Delta{G}  →  "delta g"   (greek symbol immediately modifying a letter)
  const re = /\\([A-Za-z]+)\s*\{?\s*([A-Za-z])\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const g = m[1].toLowerCase();
    if (GREEK.includes(g)) out.add(`${g} ${m[2].toLowerCase()}`);
  }
  return Array.from(out);
}

/**
 * Does this sentence INTRODUCE the given anchor — i.e. is it the line the tutor
 * speaks as it brings the equation/figure up? True when the sentence names the
 * anchor's kind ("equation"/"graph"/…) or repeats a distinctive title word.
 */
export function sentenceIntroducesAnchor(sentence: string, anchor: AnchorKeywords): boolean {
  const s = ` ${String(sentence ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ')} `;
  // Names the kind ("equation"/"graph") → introduces.
  for (const kw of KIND_WORDS[anchor.kind]) {
    if (s.includes(` ${kw} `)) return true;
  }
  // Repeats a distinctive title word → introduces.
  for (const tok of anchor.tokens) {
    if (s.includes(` ${tok} `)) return true;
  }
  // Speaks ≥2 of the equation's symbols ("delta H … delta S") → introduces.
  let symHits = 0;
  for (const tok of anchor.symbolTokens) {
    if (s.includes(` ${tok} `)) symHits++;
    if (symHits >= 2) return true;
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

const ENTITY_STOPWORDS = new Set(['the', 'a', 'an', 'one', 'some', 'any', 'its', 'their', 'this', 'that', 'back', 'just', 'only', 'pure']);

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
  return detectBecomes(t);
}

// B-side words that END a "<A> becomes <B>" target — prepositions / verbs /
// clause words after which the rest is modifier, not the entity itself
// ("...particles SPREAD throughout...", "...negative FOR rusting").
const BECOMES_B_STOP = new Set([
  'for', 'at', 'in', 'on', 'through', 'throughout', 'with', 'by', 'from', 'over',
  'spread', 'spreading', 'because', 'since', 'which', 'while', 'when', 'so',
  'then', 'that', 'as', 'it', 'they', 'this', 'these', 'rather', 'instead',
]);

/**
 * "<A> becomes <B>" — handled separately + MUCH more conservatively than the
 * "turns into" family, because figurative state-changes ("ΔS becomes negative",
 * "becomes favorable", "it becomes clear") share the verb. Guards: A is a
 * letters-only phrase (so leading numerals like "1 intact glass" start at the
 * noun); B is taken only up to the first preposition/verb/clause word and must
 * be a ≥2-word noun phrase that survives the NON_ENTITY_WORDS blocklist. A bare
 * single-word B (almost always an adjective) is rejected.
 */
function detectBecomes(text: string): Transformation | null {
  const m = text.match(/\b([a-z][a-z\s]{1,38}?)\s+becomes?\s+(.+)/i);
  if (!m) return null;
  const from = cleanEntity(m[1]);
  if (!from) return null;
  const after = m[2].toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const bWords: string[] = [];
  for (const w of after) {
    if (BECOMES_B_STOP.has(w)) break;
    bWords.push(w);
    if (bWords.length >= 4) break;
  }
  const to = cleanEntity(bWords.join(' '));
  if (!to || from === to || to.split(' ').length < 2) return null;
  return { from, to };
}

/** LaTeX for the auto-drawn transformation arrow: `\text{A} \rightarrow \text{B}`. */
export function buildTransformationLatex(t: Transformation): string {
  const esc = (s: string) => s.replace(/[\\{}]/g, '');
  return `\\text{${esc(t.from)}} \\rightarrow \\text{${esc(t.to)}}`;
}

// ─────────────────────────── analogy → sketch ───────────────────────────
// The fragile, prompt-couldn't-move case (SKETCH under-fire, all 4 ear-tests):
// the brain narrates a VISUAL/SPATIAL analogy ("imagine a ball rolling down a
// hill") and draws nothing. detectAnalogy pulls the narrated scene clause so the
// orchestrator can auto-fire show_sketch with it as the concept. CONSERVATIVE by
// design (the prompt path is primary; this is the safety net) + only fires when
// the brain drew nothing + gated OFF by default. Fail-safe = null (no sketch).

const ANALOGY_END = '(?:[.,;:!?—]|\\b(?:because|since|which|while|when|where|so that|and then|so|but)\\b|$)';
// Concrete physical-process words (gerunds). Used both for the bare-"like"
// cue and for the declarative-imagery patterns ("a glass shattering") that the
// 2026-06-23 ear-test exposed — the brain narrates analogies WITHOUT an
// "imagine/picture/like" cue, so cue-only detection missed them.
const PHYSICAL_GERUNDS =
  'rolling|falling|flowing|sliding|spreading|scattering|stretching|bouncing|swinging|sinking|rising|colliding|orbiting|melting|shattering|pouring|stacking|spinning|floating|mixing|dropping|rusting|dissolving|evaporating|condensing|freezing|boiling|burning|exploding|expanding|contracting|breaking|collapsing|crashing|settling|leaking|bubbling|crumbling|tumbling';
const ANALOGY_CUES: RegExp[] = [
  // strongest: explicit imagery verbs
  new RegExp(`\\b(?:imagine|picture|visuali[sz]e|envision)\\s+(.+?)\\s*${ANALOGY_END}`, 'i'),
  // "think of it/this as|like X"
  new RegExp(`\\bthink\\s+of\\s+(?:it|this|them|that)\\s+(?:as|like)\\s+(.+?)\\s*${ANALOGY_END}`, 'i'),
  // "it's/that's/this is (just) like X"
  new RegExp(`\\b(?:it'?s|that'?s|this\\s+is)\\s+(?:just\\s+|kind\\s+of\\s+|sort\\s+of\\s+)?like\\s+(.+?)\\s*${ANALOGY_END}`, 'i'),
  // bare "like X" / "as if X" only when X carries a concrete motion verb (so
  // "like the last example" / "like I said" don't fire)
  new RegExp(`\\b(?:like|as\\s+if)\\s+(.+?\\b(?:${PHYSICAL_GERUNDS})\\b.*?)\\s*${ANALOGY_END}`, 'i'),
  // DECLARATIVE imagery (no cue word): "<a/an/the X> is a perfect/classic example".
  // Capture the subject before the example-frame. (2026-06-23: "A glass shattering
  // is a perfect example".)
  new RegExp(`\\b((?:(?:a|an|the)\\s+)?[a-z][a-z\\s]{2,34}?)\\s+is\\s+(?:a|an)\\s+(?:perfect|classic|good|great|nice|common|everyday|familiar|simple|textbook|clear|wonderful)\\s+example\\b`, 'i'),
  // DECLARATIVE imagery: a standalone physical image "a/an <np> <physical-gerund>"
  // ("a glass shattering", "a perfume bottle spreading"). Constrained to the
  // physical-gerund list so "a function mapping…" / "a reaction releasing…" don't fire.
  new RegExp(`\\b((?:a|an)\\s+[a-z][a-z\\s]{1,28}?\\s+(?:${PHYSICAL_GERUNDS}))\\b`, 'i'),
  // "take <the/a> <np> <physical-gerund>" ("take the iron rusting").
  new RegExp(`\\btake\\s+(?:the\\s+|a\\s+|an\\s+)?([a-z][a-z\\s]{1,28}?\\s+(?:${PHYSICAL_GERUNDS}))\\b`, 'i'),
];

// Abstract head nouns that shouldn't be doodled as a scene (math/CS objects,
// not physical imagery). If the captured concept's head is one of these, skip.
const ABSTRACT_HEADS = new Set([
  'function', 'number', 'equation', 'formula', 'variable', 'value', 'set',
  'concept', 'idea', 'process', 'way', 'case', 'example', 'rule', 'theorem',
  'definition', 'term', 'factor', 'ratio', 'fraction', 'percentage', 'percent',
  'probability', 'sum', 'product', 'matrix', 'vector', 'derivative', 'integral',
  'sequence', 'series', 'expression', 'inequality', 'graph', 'word', 'sentence',
]);

// Function-word heads → the captured "concept" is junk, not a scene. Guards the
// "picture/imagine as a SPEECH VERB" false positive: "let me pull up a quick
// picture FOR THAT" matched the picture-cue and yielded "for that" (2026-06-23).
// Rejecting it lets detectAnalogy fall through to the REAL later cue in the
// sentence (e.g. "think of it like water in a pipe").
const FUNCTION_HEADS = new Set([
  'for', 'of', 'to', 'that', 'this', 'it', 'at', 'in', 'on', 'here', 'there',
  'up', 'out', 'with', 'by', 'from', 'as', 'so', 'then', 'when', 'where',
  'because', 'about', 'into', 'over', 'than', 'and', 'but', 'or', 'me', 'us',
]);

function cleanAnalogyConcept(raw: string): string | null {
  const s = String(raw ?? '').trim().replace(/\s+/g, ' ').replace(/[.,;:!?—\s]+$/, '').trim();
  const words = s.split(' ').filter(Boolean);
  if (words.length < 2 || words.length > 14) return null;
  // Reject second-person / word-problem framing ("you have 5 apples").
  if (/^(?:you|we|i|he|she|they)\b/i.test(s)) return null;
  // Head = first content word (skip a leading article).
  const lead = words[0].toLowerCase();
  const headRaw = (lead === 'a' || lead === 'an' || lead === 'the') ? (words[1] ?? '') : words[0];
  const head = headRaw.toLowerCase().replace(/[^a-z]/g, '');
  if (head && (ABSTRACT_HEADS.has(head) || FUNCTION_HEADS.has(head))) return null;
  return s;
}

export interface Analogy { concept: string }

/**
 * Detect a narrated visual/spatial analogy and return its scene clause as a
 * `concept` for show_sketch, or null. Conservative: explicit imagery cues only,
 * abstract-head + second-person guards, fail-safe to null.
 */
export function detectAnalogy(text: string): Analogy | null {
  const t = String(text ?? '');
  if (!t.trim()) return null;
  for (const re of ANALOGY_CUES) {
    const m = t.match(re);
    if (!m) continue;
    const concept = cleanAnalogyConcept(m[1]);
    if (concept) return { concept };
  }
  return null;
}
