/**
 * Topic-plan generation cache.
 *
 * Runtime lesson generation (POST /api/portal/v1/plan-generate, Task 4) is
 * an LLM call — expensive and slow. Most requests for "teach me the
 * Pythagorean theorem, grade 10, 30 minutes" are functionally identical to
 * a request for "grade 11, 28 minutes": same grade band, same session-
 * length bucket. `topicCacheKey` normalizes a request down to that
 * equivalence class; `findCachedPlan` looks up a previously generated plan
 * stored under that key (`plan.metadata.cacheKey`) within a TTL window.
 */

import connectDB from '@/lib/db';
import { LessonPlanModel } from '@/models/LessonPlan';
import { getLessonPlan } from './store';
import type { LessonPlan } from './types';

const DEFAULT_TTL_DAYS = 30;

type GradeBand = 'K-2' | '3-5' | '6-8' | '9-12' | 'other';

/** Grade -> band, mirroring `minutesPerLOForGrade`'s token matching
 *  (session-budget.ts:32) exactly so the two can never drift apart. Keep
 *  every branch here in lockstep with that function's grade tokens —
 *  including the literal '9-12' band-label token (the portal is likely to
 *  send band labels directly, not individual grade numbers) — only the
 *  fallback differs on purpose: 'other' is a distinct band here (unknown
 *  grades must NOT share a cache key with 6-8), whereas minutesPerLOForGrade
 *  merely picks a safe default per-LO minute value. */
function gradeBandForCacheKey(grade: string): GradeBand {
  const g = (grade ?? '').trim().toLowerCase();
  if (g === 'k' || g === 'k-2' || g === '1' || g === '2') return 'K-2';
  if (g === '3' || g === '4' || g === '5' || g === '3-5') return '3-5';
  if (g === '6' || g === '7' || g === '8' || g === '6-8') return '6-8';
  if (g === '9' || g === '10' || g === '9-10' || g === '11' || g === '12' || g === '11-12' || g === '9-12') return '9-12';
  if (g === 'ap' || g === 'college' || g === 'sat-act' || g === 'iitjee' || g === 'graduate' || g === 'nursing') return '9-12';
  return 'other';
}

type LengthBucket = 'short' | 'std' | 'long';

function lengthBucketFor(sessionMinutes: number): LengthBucket {
  if (sessionMinutes <= 15) return 'short';
  if (sessionMinutes <= 30) return 'std';
  return 'long';
}

/** Normalize a generation request to a cache-key string. Two requests
 *  collide iff their topic strings are equal after lowercase/trim/
 *  whitespace-collapse, AND their subjects are equal after lowercase/trim,
 *  AND their grades map to the same band, AND their sessionMinutes map to
 *  the same length bucket, AND their locales match (default 'en').
 *
 *  `subject` and `locale` are load-bearing, not decoration: without them a
 *  topic string alone collides across contexts that are NOT the same
 *  lesson — "waves" in physics vs. "waves" in music, or an English-locale
 *  request serving a Spanish-locale student a plan they can't read.
 *
 *  e.g. topicCacheKey({ topic: 'Pythagorean Theorem', subject: 'Math',
 *  grade: '10', sessionMinutes: 28 }) === "pythagorean theorem|math|9-12|std|en" */
export function topicCacheKey(args: {
  topic: string;
  subject: string;
  grade: string;
  sessionMinutes: number;
  locale?: string;
}): string {
  const topic = args.topic.trim().toLowerCase().replace(/\s+/g, ' ');
  const subject = args.subject.trim().toLowerCase();
  const band = gradeBandForCacheKey(args.grade);
  const bucket = lengthBucketFor(args.sessionMinutes);
  const locale = (args.locale ?? 'en').trim().toLowerCase();
  return `${topic}|${subject}|${band}|${bucket}|${locale}`;
}

/** Look up a previously generated plan by cache key, within `ttlDays` of
 *  its creation. Returns null on a miss, an expired hit, or any DB error
 *  (matches store.ts's swallow-and-return-null style — cache misses must
 *  never fail the caller's request, they just fall through to a fresh
 *  generation). Returned plan is parsed through the store's canonical
 *  `getLessonPlan` path, not a raw Mongo doc. */
export async function findCachedPlan(cacheKey: string, ttlDays: number = DEFAULT_TTL_DAYS): Promise<LessonPlan | null> {
  try {
    await connectDB();
    const cutoff = new Date(Date.now() - ttlDays * 24 * 60 * 60 * 1000);
    const doc = await LessonPlanModel.findOne({
      'metadata.cacheKey': cacheKey,
      createdAt: { $gte: cutoff },
    })
      .sort({ createdAt: -1 })
      .select('_id');
    if (!doc) return null;
    return await getLessonPlan(String(doc._id));
  } catch {
    return null;
  }
}
