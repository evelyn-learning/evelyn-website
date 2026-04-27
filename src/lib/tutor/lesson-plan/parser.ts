/**
 * Validate / normalize a raw lesson-plan-shaped object into a typed
 * LessonPlan. Used by the admin upload route AND by partners ingesting
 * plans from their own format. Failures throw with specific paths so
 * authors can fix the offending field.
 */

import {
  type LessonPlan,
  type Segment,
  LESSON_PLAN_SCHEMA_VERSION,
} from './types';

class PlanParseError extends Error {
  constructor(public path: string, message: string) {
    super(`lesson-plan @ ${path}: ${message}`);
  }
}

function requireString(obj: unknown, path: string, field: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (obj as any)?.[field];
  if (typeof v !== 'string' || !v.trim()) {
    throw new PlanParseError(`${path}.${field}`, 'must be a non-empty string');
  }
  return v;
}

function optionalString(obj: unknown, field: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (obj as any)?.[field];
  return typeof v === 'string' && v.trim() ? v : undefined;
}

function requireNumber(obj: unknown, path: string, field: string): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (obj as any)?.[field];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new PlanParseError(`${path}.${field}`, 'must be a finite number');
  }
  return v;
}

function requireArray<T>(obj: unknown, path: string, field: string, fn: (item: unknown, i: number) => T): T[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (obj as any)?.[field];
  if (!Array.isArray(v)) throw new PlanParseError(`${path}.${field}`, 'must be an array');
  return v.map(fn);
}

function parseSegment(raw: unknown, i: number): Segment {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = raw as any;
  const path = `segments[${i}]`;
  const id = requireString(r, path, 'id');
  const kind = requireString(r, path, 'kind');
  const teacherNote = optionalString(r, 'teacherNote');
  const estimatedMinutes = typeof r.estimatedMinutes === 'number' ? r.estimatedMinutes : undefined;
  const base = { id, teacherNote, estimatedMinutes };

  switch (kind) {
    case 'hook':
      return { ...base, kind: 'hook', goal: requireString(r, path, 'goal'), script: optionalString(r, 'script'), suggestedTools: r.suggestedTools };
    case 'concept':
      return {
        ...base, kind: 'concept',
        goal: requireString(r, path, 'goal'),
        keyIdeas: requireArray(r, path, 'keyIdeas', (s, j) => {
          if (typeof s !== 'string') throw new PlanParseError(`${path}.keyIdeas[${j}]`, 'must be string');
          return s;
        }),
        vocabulary: r.vocabulary,
        suggestedTools: r.suggestedTools,
        references: r.references,
      };
    case 'worked_example':
      return {
        ...base, kind: 'worked_example',
        problem: requireString(r, path, 'problem'),
        steps: requireArray(r, path, 'steps', (s, j) => {
          if (typeof s !== 'string') throw new PlanParseError(`${path}.steps[${j}]`, 'must be string');
          return s;
        }),
        answer: optionalString(r, 'answer'),
      };
    case 'try_yourself':
      return {
        ...base, kind: 'try_yourself',
        problem: requireString(r, path, 'problem'),
        expectedAnswer: optionalString(r, 'expectedAnswer'),
        hints: r.hints,
        responseFormat: r.responseFormat,
        choices: r.choices,
      };
    case 'misconception_check':
      return {
        ...base, kind: 'misconception_check',
        question: requireString(r, path, 'question'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        commonErrors: (r.commonErrors ?? []) as any,
      };
    case 'recap':
      return {
        ...base, kind: 'recap',
        mustRemember: requireArray(r, path, 'mustRemember', (s, j) => {
          if (typeof s !== 'string') throw new PlanParseError(`${path}.mustRemember[${j}]`, 'must be string');
          return s;
        }),
      };
    case 'extension':
      return {
        ...base, kind: 'extension',
        advancedQuestion: requireString(r, path, 'advancedQuestion'),
        hint: optionalString(r, 'hint'),
      };
    default:
      throw new PlanParseError(path, `unknown segment kind "${kind}"`);
  }
}

export function parseLessonPlan(raw: unknown): LessonPlan {
  if (!raw || typeof raw !== 'object') {
    throw new PlanParseError('$', 'must be an object');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = raw as any;
  const id = requireString(r, '$', 'id');
  const title = requireString(r, '$', 'title');
  const curriculum = requireString(r, '$', 'curriculum');
  const grade = requireString(r, '$', 'grade');
  const subject = requireString(r, '$', 'subject');
  const estimatedMinutes = requireNumber(r, '$', 'estimatedMinutes');
  const segments = requireArray(r, '$', 'segments', parseSegment);
  if (segments.length === 0) throw new PlanParseError('segments', 'must contain at least one segment');

  return {
    id,
    title,
    curriculum,
    grade,
    subject,
    topic: optionalString(r, 'topic'),
    locale: optionalString(r, 'locale') ?? 'en',
    los: r.los ?? [],
    estimatedMinutes,
    segments,
    prerequisites: r.prerequisites ?? [],
    followUps: r.followUps ?? [],
    source: r.source,
    schemaVersion: typeof r.schemaVersion === 'number' ? r.schemaVersion : LESSON_PLAN_SCHEMA_VERSION,
    metadata: r.metadata ?? {},
  };
}
