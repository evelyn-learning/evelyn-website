/**
 * Conic-construction enforcement (project_tutor_conic_construction_fix).
 *
 * Bug (2026-06-19 Board Map verify): the brain emits a show_geometry_constructed
 * that shows conic ANNOTATIONS (directrices, latus rectum, asymptotes) but omits
 * the base curve step, so the ellipse oval / hyperbola branches vanish — and on a
 * redraw the curve-less figure SUPERSEDES the original full one.
 *
 * The renderer already supports the right workflow (an `ellipse`/`parabola`/
 * `hyperbola`/`conic` step draws the curve; `conic_directrix` etc. derive
 * annotations from it). This module is the deterministic backstop: detect a
 * conic figure missing its curve, and — when a prior same-subject conic exists —
 * CARRY FORWARD its curve step so the figure can't render curve-less. No
 * system-prompt mandate needed: the fix holds regardless of how the brain phrases
 * the construction.
 *
 * Pure + dependency-free (like page-grouping.ts); unit-tested via
 * `npm run test:conic`.
 */

/** Step kinds that draw the actual conic curve (vs. derivations/annotations). */
const CONIC_CURVE_KINDS = new Set(['ellipse', 'parabola', 'hyperbola', 'conic']);

/** A conic figure is recognized by its title naming the conic. Matches what the
 *  brain titles these figures ("Ellipse x²/9+y²/4=1", "Hyperbola … — with
 *  Directrices", "y² = 4x — Latus Rectum"). */
const CONIC_TITLE_RE = /\b(ellipse|parabola|hyperbola)\b/i;

/** Loosely-typed geometry-construction command. `steps`/`given` are
 *  renderer-defined shapes we only need to inspect structurally. */
export interface GeoConstructionCommand {
  action?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  given?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

function isGeometryConstructed(cmd: unknown): cmd is GeoConstructionCommand {
  return !!cmd && typeof cmd === 'object'
    && (cmd as GeoConstructionCommand).action === 'showGeometryConstructed';
}

function steps(cmd: GeoConstructionCommand): any[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  return Array.isArray(cmd.steps) ? cmd.steps : [];
}

function hasCurveStep(cmd: GeoConstructionCommand): boolean {
  return steps(cmd).some((s) => CONIC_CURVE_KINDS.has(String(s?.kind)));
}

/** A conic figure (by title) whose steps contain NO base curve step → it will
 *  render annotations/points with no actual conic. The detector for the fix. */
export function isCurveLessConic(cmd: unknown): boolean {
  if (!isGeometryConstructed(cmd)) return false;
  if (!CONIC_TITLE_RE.test(String(cmd.title ?? ''))) return false;
  return !hasCurveStep(cmd);
}

/** A conic figure (by title) that DOES contain its curve — a valid source to
 *  carry a curve FROM. */
export function isCompleteConic(cmd: unknown): boolean {
  return isGeometryConstructed(cmd)
    && CONIC_TITLE_RE.test(String((cmd as GeoConstructionCommand).title ?? ''))
    && hasCurveStep(cmd as GeoConstructionCommand);
}

/** Same conic SUBJECT? Compares the conic-naming token in each title, plus a
 *  fuzzy base-title check, so "Ellipse x²/9+y²/4=1" and
 *  "Ellipse x²/9+y²/4=1 — with Directrices" match while "Ellipse …" vs
 *  "Hyperbola …" do not. Deliberately conservative — only carry a curve from a
 *  figure that is clearly the same conic. */
export function sameConicSubject(a: GeoConstructionCommand, b: GeoConstructionCommand): boolean {
  const ta = String(a.title ?? '');
  const tb = String(b.title ?? '');
  const ca = ta.match(CONIC_TITLE_RE)?.[1]?.toLowerCase();
  const cb = tb.match(CONIC_TITLE_RE)?.[1]?.toLowerCase();
  if (!ca || !cb || ca !== cb) return false;
  // Base title = up to the first " — " annotation suffix, normalized.
  const base = (t: string) => t.split('—')[0].replace(/\s+/g, ' ').trim().toLowerCase();
  const ba = base(ta);
  const bb = base(tb);
  return ba === bb || ba.startsWith(bb) || bb.startsWith(ba);
}

/** Point ids a curve step references (so carry-forward can pull any that the
 *  curve-less command doesn't already re-declare). */
function curveStepPointRefs(step: any): string[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  const out: string[] = [];
  const push = (v: unknown) => { if (typeof v === 'string') out.push(v); };
  push(step?.center);
  push(step?.vertex);
  push(step?.focus);
  push(step?.directrix);
  if (Array.isArray(step?.foci)) for (const f of step.foci) push(f);
  return out;
}

function givenIds(cmd: GeoConstructionCommand): Set<string> {
  const out = new Set<string>();
  for (const g of (Array.isArray(cmd.given) ? cmd.given : [])) {
    if (g && typeof g.id === 'string') out.add(g.id);
  }
  return out;
}

function stepIds(cmd: GeoConstructionCommand): Set<string> {
  const out = new Set<string>();
  for (const s of steps(cmd)) if (s && typeof s.id === 'string') out.add(s.id);
  return out;
}

/**
 * Inject `prior`'s conic curve step(s) into the curve-less `target` so the
 * figure renders complete. Returns a NEW merged command (does not mutate).
 *
 * Strategy (kept simple because the brain reuses the same point ids — O, F1, F2
 * — across the original and the redraw, so a carried `center:"O"` resolves
 * against the redraw's own points):
 *  - Prepend the prior curve step(s) so they render UNDER the annotations.
 *  - Carry only the referenced `given` points the target doesn't already declare.
 *  - Rename a carried curve-step id only on collision with a target step id
 *    (annotations here don't reference the curve step by id, so no inbound refs
 *    to rewrite for the hand-rolled case).
 */
export function carryForwardConicCurve(
  target: GeoConstructionCommand,
  prior: GeoConstructionCommand,
): GeoConstructionCommand {
  const curveSteps = steps(prior).filter((s) => CONIC_CURVE_KINDS.has(String(s?.kind)));
  if (curveSteps.length === 0) return target;

  const targetStepIds = stepIds(target);
  const targetGivenIds = givenIds(target);

  // Clone + de-collide curve step ids.
  const carriedSteps = curveSteps.map((s, i) => {
    let id = typeof s?.id === 'string' ? s.id : `__cf_conic_${i}`;
    if (targetStepIds.has(id)) id = `__cf_${id}`;
    return { ...s, id };
  });

  // Carry referenced points the target doesn't already declare.
  const priorGiven: any[] = Array.isArray(prior.given) ? prior.given : []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const priorById = new Map<string, any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const g of priorGiven) if (g && typeof g.id === 'string') priorById.set(g.id, g);

  const carriedGiven: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const seen = new Set<string>();
  for (const step of curveSteps) {
    for (const ref of curveStepPointRefs(step)) {
      if (!targetGivenIds.has(ref) && priorById.has(ref) && !seen.has(ref)) {
        carriedGiven.push(priorById.get(ref));
        seen.add(ref);
      }
    }
  }

  return {
    ...target,
    given: [...(Array.isArray(target.given) ? target.given : []), ...carriedGiven],
    steps: [...carriedSteps, ...steps(target)],
  };
}

/**
 * Find the most-recent complete conic command in a command history that shares
 * `target`'s subject — the source to carry a curve from. Newest-first so an
 * evolving figure (parabola → parabola+focus → …) carries from its latest form.
 * Returns null if none (caller falls back to reject-retry).
 */
export function findPriorConic(
  target: GeoConstructionCommand,
  history: readonly unknown[],
): GeoConstructionCommand | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const c = history[i];
    if (isCompleteConic(c) && sameConicSubject(target, c as GeoConstructionCommand)) {
      return c as GeoConstructionCommand;
    }
  }
  return null;
}
