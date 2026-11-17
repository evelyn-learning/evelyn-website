/**
 * Task 7f fix round 1 (I2), tests only: the part-flow suites (7a, 7c, 7e, final-7) run a second time with the 7f switches ON
 * (their `-7f-on` npm scripts set SEED_7F_PRACTICE=1). Their fixtures were written before the practice count (C) existed and
 * start every part at 0 sentences of the learner's own, which C holds by design; seeded at 2 for every plan part, the part
 * flow runs under C (counting and the gate live, the minimum met), D and F as production runs them. Without the variable,
 * runV2Turn as it is.
 */
import type { V2TurnInput } from '../src/lib/tutor/v2/turn';
import { V2_MIN_PRACTICE } from '../src/lib/tutor/v2/time-fit';

export const SEEDED_7F = !!process.env.SEED_7F_PRACTICE;
export function seedPractice7f<R>(run: (i: V2TurnInput) => R): (i: V2TurnInput) => R {
  if (!SEEDED_7F) return run;
  return (i) => {
    const plan = i.session.plan;
    if (!plan) return run(i);
    const seeded = Object.fromEntries(plan.segments.map((s) => [s.id, Math.max(V2_MIN_PRACTICE, i.state.practiceSaid?.[s.id] ?? 0)]));
    return run({ ...i, state: { ...i.state, practiceSaid: seeded } });
  };
}
