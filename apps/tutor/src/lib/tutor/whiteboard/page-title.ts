/**
 * Titles for the auto-newPage that fires on a segment advance.
 *
 * portal-704e3e01 (2026-09-04) @1122.5s produced a page headed "Try: Solve
 * for x and type your answer as a number: 2(x + 5) − 3 = 4x −" carrying a
 * card that read "Solve for x: x/2 + 3 = x/5 + 6." Two causes, both fixed
 * here: the title was built at ADVANCE time from the plan's authored problem
 * while the card was a generate_problem substitute resolved seconds later,
 * and a fixed slice(0, 70) cut it mid-expression on a trailing minus.
 * The student asked "Wait, for which problem?" four minutes later.
 *
 * Pure module — no side effects, never throws.
 */

const DEFAULT_MAX = 70;
/** Trailing operators, opening brackets and separators a title must not end on. */
const DANGLING_RE = /[\s.,;:+\-−*/=(<[{]+$/;

export function truncatePageTitle(text: string, max: number = DEFAULT_MAX): string {
  const s = (text ?? '').trim();
  if (s.length <= max) return s;
  // Reserve one character for the ellipsis, then cut back to the last space
  // so a token is never split; if there is no space to fall back to (a long
  // unbroken run) take the hard cut, which is still bounded.
  const budget = max - 1;
  let cut = s.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > budget * 0.5) cut = cut.slice(0, lastSpace);
  cut = cut.replace(DANGLING_RE, '');
  return `${cut}…`;
}

/** Everything before the first ': ' is the stage prefix ("Try: ", "Check: ").
 *  Preserved when a page is retitled so the progress read stays consistent. */
function stagePrefix(title: string): string {
  const i = (title ?? '').indexOf(': ');
  return i > 0 ? title.slice(0, i + 2) : '';
}

/** Normalized for comparison only — never for display. */
function comparable(s: string): string {
  return (s ?? '').toLowerCase().replace(/[\s$\\{}]+/g, '');
}

export function retitleFromBatch(args: {
  /** Title computed at advance time from the plan's authored segment. */
  deferredTitle: string;
  /** Statement of the showProblem actually in the flushing batch, if any. */
  renderedStatement?: string;
}): { title: string; retitled: boolean } {
  const deferred = (args.deferredTitle ?? '').trim();
  const rendered = (args.renderedStatement ?? '').trim();
  if (!rendered) return { title: deferred, retitled: false };
  // The authored card IS what rendered — leave the title alone. The deferred
  // title carries the authored text after its stage prefix, so compare that.
  const deferredBody = deferred.slice(stagePrefix(deferred).length);
  if (comparable(deferredBody).includes(comparable(rendered))
    || comparable(rendered).includes(comparable(deferredBody))) {
    return { title: deferred, retitled: false };
  }
  return { title: truncatePageTitle(`${stagePrefix(deferred)}${rendered}`), retitled: true };
}
