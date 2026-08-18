// apps/tutor/scripts/tutor/verdict-bank/types.ts
import type { ProbeExpected } from './classifier';

/** One scripted student turn. Exactly one of say/compute. */
export type ProbeTurn =
  | { say: string }
  | { compute: 'board-expression'; prefix?: string; fallbackSay: string };

export interface VerdictProbe {
  id: string;
  /** Axis coordinates — documentation + report grouping, not behavior. */
  cell: { provenance: string; relation: string; answerType: string };
  /** Picker start (same shape __tutorTestStart takes via startOverride). */
  start: { subject: string; level: string; topic: string; lessonPlanId?: string; studentName?: string };
  /** First student message (kickoffOverride). */
  kickoff: string;
  /** Scripted replies; turns[i] answers the tutor's i-th captured turn. */
  turns: ProbeTurn[];
  /** Index into `turns` of the ANSWER being graded (default: last). */
  gradeTurnIndex?: number;
  expected: ProbeExpected;
  notes: string;
}
