/**
 * Tutor brain v2 — did this reply say mathematics aloud?
 *
 * Mathematics that is only heard is lost: the student cannot hold an expression or a step in their
 * head while the next one arrives (Praveen, embed-1794339843244: "one gets lost and feels like an
 * automated machine is speaking some math incoherently"). When a reply speaks mathematics, the
 * runtime checks that the board shows it (turn.ts, the board pass). A bare verdict ("Yes, the limit
 * is 0") is not enough to count.
 */
const TOKEN = /\$[^$]+\$|\d+(?:\.\d+)?|[=+−×÷^√∞²³]|(?<![A-Za-z])[a-z](?![A-Za-z'’])|\b(?:over|minus|plus|times|divided|squared|cubed|equals?|root|power|derivative|integral|limit|numerator|denominator|fraction|factorial|logarithm|ln|log|sin|sine|cos|cosine|tan|tangent|half|halves|thirds?|quarters?|fifths?|sixths?|eighths?|tenths?|percent|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi;

export function speaksMaths(spoken: string, minTokens = 6): boolean {
  if (/\$[^$]*[\\^_=+\-/][^$]*\$/.test(spoken)) return true;
  // "a" and "I" are words, not variables.
  const hits = (spoken.match(TOKEN) ?? []).filter((t) => !/^(a|i)$/i.test(t));
  return hits.length >= minTokens;
}

/** One spelling for an expression however it was written: LaTeX on the board, plain symbols in speech. */
export function canonMaths(s: string): string {
  let t = s.replace(/\\(?:left|right|displaystyle|quad|qquad|,|;|!)/g, '').replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
  for (let i = 0; i < 4; i++) t = t.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
  t = t.replace(/\\(?:times|cdot)/g, '*').replace(/[×·]/g, '*').replace(/\\pm/g, '±').replace(/\\sqrt/g, '√').replace(/[−–]/g, '-')
    .replace(/\^\{([^{}]*)\}/g, '^$1').replace(/²/g, '^2').replace(/³/g, '^3');
  return t.replace(/[\s$&{}\\]/g, '').toLowerCase();
}

/** The equations a spoken reply said: `$…$` spans, and runs of symbols in plain words ("x²/9 + y²/4 = 1"). */
export function spokenEquations(said: string): string[] {
  const out: string[] = [];
  for (const m of said.matchAll(/\$([^$]+)\$/g)) if (m[1].includes('=')) out.push(m[1].trim());
  // An integral named aloud is something to look at: "Now try ∫ x sin x dx" was asked over a board without it
  // (AP Calc BC, embed-1794511321049).
  for (const m of said.matchAll(/∫\s*[^.?!:;]{1,40}?\bd[a-z]\b/g)) out.push(m[0].trim());
  const tokens = said.replace(/\$[^$]+\$/g, ' . ').split(/\s+/).filter(Boolean);
  const bare = (t: string) => t.replace(/^["'“(]+(?=["'“(]*[^(])|[.,;:?!"'”]+$/g, '');
  const mathy = (t: string) => { const b = t.replace(/[.,;:?!"'”]+$/g, ''); return !!b && /^[0-9a-zA-Z()+\-−×·*/^²³√|=±<>≤≥.,]+$/.test(b) && (/[0-9()+\-−×·*/^²³√|=±<>≤≥]/.test(b) || /^[a-zA-Z]$/.test(b)); };
  let run: string[] = [];
  const close = () => {
    // "a" and "I" at either end are words.
    while (run.length && /^(a|i)$/i.test(bare(run[0]))) run.shift();
    while (run.length && /^(a|i)$/i.test(bare(run[run.length - 1]))) run.pop();
    const text = run.join(' ').replace(/[.,;:?!]+$/, '');
    if (run.length >= 3 && text.includes('=') && /[a-zA-Z]/.test(text)) out.push(text);
    run = [];
  };
  for (const t of tokens) {
    if (!mathy(t)) { close(); continue; }
    run.push(t);
    // A sentence end closes the run.
    if (/[.?!;:]$/.test(t)) close();
  }
  close();
  return [...new Set(out)];
}

/** Equations said aloud that no board item holds. `boardTexts`: what each item on the board shows. */
export function unwrittenEquations(said: string, boardTexts: string[]): string[] {
  const have = boardTexts.map(canonMaths);
  return spokenEquations(said).filter((e) => { const c = canonMaths(e); return c.length >= 6 && !have.some((h) => h.includes(c)); });
}
