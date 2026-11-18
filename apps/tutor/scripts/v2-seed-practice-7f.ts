/**
 * Task 7f fix round 1 (I2), tests only: the part-flow suites (7a, 7c, 7e, final-7) run a second time with the 7f switches ON
 * (their `-7f-on` npm scripts set SEED_7F_PRACTICE=1). Their fixtures were written before the practice count (C) existed and
 * start every part at 0 sentences of the learner's own, which C holds by design; seeded at 2 for every plan part, the part
 * flow runs under C (counting and the gate live, the minimum met), D and F as production runs them. Without the variable,
 * runV2Turn as it is. Task 7i (PART_ENTERED): practice counted in a part is the lesson having entered it, so only the parts the
 * fixture has reached are seeded (the part in hand and those with a page); seeding every part made the parts after them entered.
 */
import type { V2TurnInput } from '../src/lib/tutor/v2/turn';
import { V2_MIN_PRACTICE } from '../src/lib/tutor/v2/time-fit';
import { v2PartInHand } from '../src/lib/tutor/v2/part-flow';
import { v2IsPageOfPart } from '../src/lib/tutor/v2/plan-map';

export const SEEDED_7F = !!process.env.SEED_7F_PRACTICE;
export function seedPractice7f<R>(run: (i: V2TurnInput) => R): (i: V2TurnInput) => R {
  if (!SEEDED_7F) return run;
  return (i) => {
    const plan = i.session.plan;
    if (!plan) return run(i);
    const cur = v2PartInHand(plan, i.state);
    const reached = (k: number) => k === cur || i.state.board.pages.some((pg) => v2IsPageOfPart(plan.segments[k]!, pg.title));
    const seeded = Object.fromEntries(plan.segments.map((s, k) => [s.id, reached(k) ? Math.max(V2_MIN_PRACTICE, i.state.practiceSaid?.[s.id] ?? 0) : i.state.practiceSaid?.[s.id] ?? 0]).filter((e) => (e[1] as number) > 0));
    return run({ ...i, state: { ...i.state, practiceSaid: seeded } });
  };
}
