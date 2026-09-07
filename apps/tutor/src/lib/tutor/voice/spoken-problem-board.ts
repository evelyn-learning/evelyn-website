/**
 * Spoken-problem board net (live check 6, 2026-09-07, portal-63ee9f2c).
 *
 * The brain posed three word problems in SPEECH only — "a 12 oz jar costs
 * $3.60 and a 20 oz jar costs $6.00, which is the better deal?", "18 out of
 * 24 shots", "a jacket priced at $80 with a 25% discount" — and painted only
 * numberless templates (`price/ounces = price/ounces`). The student opened
 * the transcript drawer three times to re-read numbers that existed nowhere
 * on the board. The existing board-anchor net (question-anchor.ts) needs a
 * turn with ZERO content renders, so a template render hid all three.
 *
 * This detector asks the narrower question the net cannot: did this turn
 * pose a problem whose NUMBERS are not on the board? It is pure and
 * deterministic — no LLM, never throws — and the orchestrator answers a hit
 * by rendering the spoken sentences as a problem card at stream end
 * (`spoken_problem_boarded`), never by killing the turn: the audio already
 * played, and a card that arrives a few seconds late still beats a card
 * that never arrives.
 */

export interface SpokenProblemDetection {
  /** The spoken sentences that carry the problem, joined, discourse-stripped. */
  statement: string;
  /** Normalized numeric tokens the statement carries (deduped). */
  numbers: string[];
  /** Normalized numeric tokens already present in the supplied board texts. */
  covered: string[];
}

const NUM_RE = /(?:\$\s?)?\d[\d,]*(?:\.\d+)?(?:\s?%|\s?percent\b)?/gi;

/** Distinct numeric values in `text`, normalized so "$3.60", "3.6" and
 *  "3,600"-style tokens compare by value. Percent/currency markers are
 *  dropped — the board writes `25\%` or `0.25`; the value is the anchor. */
export function numericTokens(text: string): string[] {
  const out = new Set<string>();
  for (const m of (text || '').match(NUM_RE) ?? []) {
    const bare = m.replace(/[$,%\s]/g, '').replace(/percent$/i, '');
    if (!bare) continue;
    const n = Number(bare);
    if (!Number.isFinite(n)) continue;
    out.add(String(n));
  }
  return [...out];
}

/** A sentence that hands the student something to COMPUTE or SET UP with the
 *  numbers. A bare "?" is deliberately not enough: the prod control (60
 *  sessions, 1,603 tutor turns) showed yes/no conceptual questions that carry
 *  numbers — "does a = 5 versus a = 1 change where the vertex sits?", "does
 *  seeing the roofs make it click?" — and those are not problems to board. */
const ASK_RE =
  /\b(?:set (?:it|that|this|one|them) up|set up|find|figure out|work out|solve|calculate|compute|write (?:an|the|out)|what(?:'s| is| would| does| do| are|'re)|which|how (?:much|many|would|do|far|long|fast)|tell me)\b/i;

/** Windows that are not problems even when they carry numbers + a question:
 *  session logistics, wrap-ups, pointers to practice elsewhere. */
const EXCLUDE_RE =
  /\b(?:wrap(?:ping)? up|see you|next time|minutes?|today'?s session|homework|practice (?:set|area|tab)|great work today|nice work today)\b/i;

/** Leading discourse the card should not carry ("Alright, so —", "Here's one:"). */
const DISCOURSE_RE =
  /^(?:(?:alright|okay|ok|so|now|right|great|good|nice|exactly|perfect|well|here'?s (?:one|another|a quick one)|here we go|let'?s (?:try|do) (?:this|one|another)|say|imagine|picture this|try this)[,:.!\s—-]+)+/i;

const MAX_WINDOW_SENTENCES = 3;

/**
 * Detect a numeric problem posed in speech whose numbers are not on the board.
 *
 * `sentences` — this turn's spoken sentences, in order (raw text, $…$ math
 * intact). `boardTexts` — statements / latex of everything rendered this turn
 * plus the problem currently tracked and recent board renders; coverage is
 * judged against their numbers, so a scaffolding question about a number
 * already on the board ("what is 0.75 × 80?") never fires.
 *
 * Returns null when: no ask sentence; fewer than two distinct numbers in the
 * window; the numbers the student needs are already on the board (see the
 * coverage rule inline); the window reads as logistics; or the statement is
 * too long to be a card.
 */
export function detectSpokenProblem(
  sentences: string[],
  boardTexts: string[],
  opts: { maxChars?: number } = {},
): SpokenProblemDetection | null {
  try {
    const maxChars = opts.maxChars ?? 360;
    const clean = (sentences ?? []).map((s) => (s ?? '').trim()).filter(Boolean);
    if (!clean.length) return null;
    let qi = -1;
    for (let i = clean.length - 1; i >= 0; i--) {
      if (ASK_RE.test(clean[i])) { qi = i; break; }
    }
    if (qi < 0) return null;
    // Window: the ask sentence plus the contiguous run of number-bearing
    // sentences immediately before it (the numbers often sit one sentence
    // ahead of the question: "…costs $6.00. Which is the better deal?").
    const window: string[] = [clean[qi]];
    for (let i = qi - 1; i >= 0 && window.length < MAX_WINDOW_SENTENCES; i--) {
      if (numericTokens(clean[i]).length === 0) break;
      // A short verdict on the PREVIOUS answer ("Nice, 75%.") carries a
      // number but is not part of the new problem.
      if (clean[i].split(/\s+/).length < 4) break;
      window.unshift(clean[i]);
    }
    const statementRaw = window.join(' ');
    if (EXCLUDE_RE.test(statementRaw)) return null;
    const numbers = numericTokens(statementRaw);
    if (numbers.length < 2) return null;
    const boardNums = new Set<string>();
    for (const t of boardTexts ?? []) for (const n of numericTokens(t)) boardNums.add(n);
    const covered = numbers.filter((n) => boardNums.has(n));
    // Coverage is judged on the ASK sentence's own numbers when it carries at
    // least two (the setup sentence may cite a formula constant like 100), and
    // a board full of small integers must not mask a problem by coincidence —
    // portal-63ee9f2c's "18 out of 24" was masked by the previous recipe's
    // "3x = 18". Fire when two or more of the problem's numbers are missing
    // from the board, or when a two-number ask is missing one DISTINCTIVE
    // number (≥ 10, or a decimal).
    const askNums = numericTokens(clean[qi]);
    const primary = askNums.length >= 2 ? askNums : numbers;
    const uncovered = primary.filter((n) => !boardNums.has(n));
    const distinctive = (n: string) => Math.abs(Number(n)) >= 10 || n.includes('.');
    // The one-missing-number shortcut applies only when the ASK sentence itself
    // carries both numbers ("18 out of 24 … what percent?"); a decimal cited in
    // a setup sentence ("e^0.1 lands a bit above 1.1 … add the four terms")
    // is context, not the problem.
    const fires = uncovered.length >= 2 || (uncovered.length === 1 && askNums.length === 2 && distinctive(uncovered[0]));
    if (!fires) return null;
    const statement = statementRaw.replace(DISCOURSE_RE, '').trim();
    if (!statement || statement.length > maxChars) return null;
    return { statement, numbers, covered };
  } catch {
    return null;
  }
}


/** Live check 7 (portal-8ed0fb65, 11:05:50Z): "That matches the board. So the
 *  full equation now reads $5x - 15 = 2x + 9$." — the board showed only the
 *  distribution step; the full equation existed in speech alone, and the
 *  judge flagged the turn for the wrong reason. A board CLAIM about an
 *  equation that is not on the board is boarded by the runtime. */
const EQUATION_CLAIM_CUE =
  /\b(?:now reads|reads|on the board|board (?:now )?(?:shows|reads|has)|matches the board|we (?:now )?have|so we have|now have|becomes|the (?:full |whole )?equation (?:is|now|becomes)|leaves us with|that leaves|simplifies to|gives us|we get|we're left with)\b/i;

export function normalizeLatexForMatch(latex: string): string {
  return (latex || '')
    .replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\(?:left|right|,|;|!|quad|qquad|displaystyle)/g, '')
    .replace(/\\(?:cdot|times)/g, '*')
    .replace(/\\implies|\\Rightarrow|⟹|⇒/g, '=>')
    .replace(/[−–]/g, '-')
    .replace(/\s+/g, '')
    .toLowerCase();
}

/** A hypothetical, deliberately wrong, or counterfactual equation is not a
 *  board claim — the prod control surfaced "Say instead the formula reads
 *  $P = 2l + 2lw$, weird made-up formula" (a wrong formula used as a foil). */
const EQUATION_CLAIM_NEGATIVE =
  /\b(?:say instead|instead of|made[- ]up|suppose|imagine|pretend|wrong|incorrect|mistake|shouldn'?t|would be wrong|if you (?:had|wrote|did)|had written|not the|isn'?t|is not|don'?t|doesn'?t)\b/i;

export interface SpokenEquationClaim { latex: string; sentence: string }

/** The LAST spoken equation (`$…=…$`, with a variable) in a sentence that
 *  claims it is on the board, when no board text contains it. */
export function detectSpokenEquationClaim(sentences: string[], boardTexts: string[]): SpokenEquationClaim | null {
  try {
    const board = (boardTexts ?? []).map(normalizeLatexForMatch).join('\n');
    const clean = (sentences ?? []).map((x) => (x ?? '').trim()).filter(Boolean);
    for (let i = clean.length - 1; i >= 0; i--) {
      const sent = clean[i];
      if (!EQUATION_CLAIM_CUE.test(sent) || EQUATION_CLAIM_NEGATIVE.test(sent)) continue;
      const spans = [...sent.matchAll(/\$([^$\n]{3,80})\$/g)].map((m) => m[1]);
      for (let k = spans.length - 1; k >= 0; k--) {
        const latex = spans[k].trim();
        if (!/=/.test(latex) || !/[a-z]/i.test(latex.replace(/\\[a-zA-Z]+/g, ''))) continue;
        if (/[<>≤≥≠]|\\(?:le|ge|neq|approx)\b/.test(latex)) continue;
        const norm = normalizeLatexForMatch(latex);
        if (norm.length < 5 || board.includes(norm)) continue;
        return { latex, sentence: sent };
      }
    }
    return null;
  } catch {
    return null;
  }
}
