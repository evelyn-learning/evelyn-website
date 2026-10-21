/**
 * Pure builder for the GET homework-build response. Never exposes the full key
 * or `canonical`; `finals` only when two solvers agreed. Null when the build
 * belongs to another partner (the route answers 404).
 */

import type { HomeworkBuildDoc } from './types';

export function buildStatusResponse(build: HomeworkBuildDoc, partnerId: string) {
  if (build.partnerId !== partnerId) return null;
  return {
    planId: build._id,
    done: build.done,
    startedAt: build.startedAt,
    updatedAt: build.updatedAt,
    problems: build.problems.map((p) => ({
      n: p.n,
      status: p.status,
      hasFigure: p.figure != null,
      ...(p.figureSvg ? { figureSvg: p.figureSvg } : {}),
      verify: { agreed: p.verify.agreed, ...(p.verify.candidates ? { candidates: p.verify.candidates } : {}) },
      ...(p.verify.agreed && p.key ? { finals: p.key.parts.map((k) => k.final) } : {}),
    })),
  };
}
