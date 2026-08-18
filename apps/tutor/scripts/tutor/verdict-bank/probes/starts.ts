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

/** Shared opener for every volunteered-claim probe (matrix + controls). */
export const LIGHTNING_KICKOFF =
  "Hi — can we do a quick lightning round? I'll state things, you tell me if I'm right.";
