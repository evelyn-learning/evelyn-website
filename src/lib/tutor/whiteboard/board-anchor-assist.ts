/**
 * Board-anchor re-anchoring (pure, side-effect-free, unit-tested).
 *
 * RE-ANCHOR (emit-ordering) — the brain front-loads a turn-opening
 * equation/figure tool-call, so render-sync (which anchors a render to its
 * PRECEDING stream sentence) surfaces it during the opening sentence rather
 * than when it's introduced. `extractAnchorKeywords` + `sentenceIntroduces-
 * Anchor` let the orchestrator hold a turn-opening anchor and re-anchor it
 * to the first later sentence that NAMES it (fail-safe to turn-end).
 *
 * Gated behind NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_ASSIST in the orchestrator.
 * See project_tutor_board_anchored_speech.
 *
 * HISTORY — this module also held two AUTO-FIRE detectors (a "A turns into B"
 * transformation arrow and an analogy→sketch extractor) that drew on the
 * brain's behalf when a turn rendered nothing. Removed 2026-07-10 after
 * session-1783693044096: they wrote spoken fragments verbatim to the board
 * ("turns them into food" → "them → food"), produced context-free doodles
 * from an isolated doodler, and — because the dedup filter drops a re-shown
 * figure before the render flag is set — replaced the figure the brain
 * correctly asked for with a redundant sketch. The brain owns show_sketch.
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
 * Task 3.2 (humanlike-latency): index of the REFERRING word within a
 * sentence's word array — the earliest word that names the anchor's kind
 * ("equation"/"graph"/…), repeats a distinctive title token, or begins a
 * spoken symbol phrase ("delta g" — counted only when the sentence speaks
 * ≥2 symbols, the same anti-noise rule as sentenceIntroducesAnchor).
 * `words` are the sentence's SPOKEN words (the rewritten transcript the WS
 * TTS timestamps — split on whitespace; punctuation is stripped per-word
 * here). Returns undefined when nothing matches — the caller then leaves
 * the entry on plain sentence semantics.
 */
export function anchorWordIndex(words: readonly string[], anchor: AnchorKeywords): number | undefined {
  const norm = words.map((w) => String(w ?? '').toLowerCase().replace(/[^a-z0-9]/g, ''));
  let best: number | undefined;
  const consider = (idx: number) => {
    if (best === undefined || idx < best) best = idx;
  };
  for (let i = 0; i < norm.length; i++) {
    const w = norm[i];
    if (!w) continue;
    if (KIND_WORDS[anchor.kind].includes(w)) consider(i);
    if (anchor.tokens.includes(w)) consider(i);
  }
  // Symbol phrases: ≥2 distinct symbol hits required; the referring index is
  // the FIRST hit's position. A symbol token is a two-word phrase
  // ("delta g") — match it against consecutive normalized words.
  if (anchor.symbolTokens.length > 0) {
    const hits: number[] = [];
    for (const tok of anchor.symbolTokens) {
      const [a, b] = tok.split(' ');
      for (let i = 0; i + 1 < norm.length; i++) {
        if (norm[i] === a && norm[i + 1] === b) { hits.push(i); break; }
      }
    }
    if (hits.length >= 2) consider(Math.min(...hits));
  }
  return best;
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
