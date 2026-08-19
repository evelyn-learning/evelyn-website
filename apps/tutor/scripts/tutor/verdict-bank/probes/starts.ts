// apps/tutor/scripts/tutor/verdict-bank/probes/starts.ts
/**
 * Shared picker starts for the probe bank. Split out of types.ts so
 * incidents.ts, matrix.ts, and controls.ts can all import them without a
 * cycle back through index.ts.
 */
import type { VerdictProbe } from '../types';

/** Proven in scripts/tutor-e2e/scenarios/answer-equivalence.ts. */
export const MATH_START: VerdictProbe['start'] = {
  subject: 'math',
  level: 'High School',
  topic: 'jee-math',
  lessonPlanId: 'evelyn.jee.coordinate-geometry.v1',
  studentName: 'Probe Student',
};

export const GOV_START: VerdictProbe['start'] = {
  subject: 'ss',
  level: 'AP',
  topic: 'ap-us-government',
  lessonPlanId: 'evelyn.ap.apgov.democratic-ideals.v1',
  studentName: 'Probe Student',
};

/**
 * Shared opener for every volunteered-claim probe (matrix + controls).
 *
 * Hunt round 2026-08-19: the original wording ("Hi — can we do a quick
 * lightning round? I'll state things, you tell me if I'm right.") did not
 * license claims from OUTSIDE the start's lesson topic, so the tutor
 * correctly redirected instead of grading whenever a probe stated an
 * arithmetic / probability / general-algebra claim inside a
 * coordinate-geometry plan ("Sorry, that arithmetic question doesn't match
 * what I asked — let's get you oriented on coordinate geometry first."), or
 * graded it and then bolted on a topic-steer whose "but" tripped the
 * classifier's contrast veto ("Right — that's a solid piece of algebra, but
 * it's not quite a lightning-round coordinate geometry question").
 *
 * That is a probe-steering defect, not a brain bug: topic discipline is
 * correct tutor behavior, and this bank measures verdict GRADING, so the
 * topic-relevance confound has to come out of the stimulus. The three
 * board-expression probes already prove the shape works — they carry the
 * same off-topic arithmetic and pass 3/3 because their kickoff explicitly
 * licenses it as a pre-lesson warm-up. This adopts that same license.
 *
 * Deliberately says nothing about whether any claim is right or wrong — it
 * removes the topic confound only, and must never hint at the verdict.
 */
export const LIGHTNING_KICKOFF =
  "Hi — before we start today's topic, can we do a quick warm-up lightning round? " +
  "I'll state things from anywhere in math, not just today's topic, and you just tell me " +
  "straight away whether each one is right or wrong. No need to steer me back to the lesson — " +
  "I'll get to it right after.";
