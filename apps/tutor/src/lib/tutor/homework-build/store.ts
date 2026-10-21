/**
 * Storage for HomeworkBuild records (one per homework plan id).
 */

import connectDB from '@core/db';
import { HomeworkBuildModel } from '@/models/HomeworkBuild';
import { problemHash, type HomeworkBuildDoc, type ProblemBuild } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getHomeworkBuild(planId: string): Promise<HomeworkBuildDoc | null> {
  await connectDB();
  return (await HomeworkBuildModel.findById(planId).lean()) as HomeworkBuildDoc | null;
}

/** Idempotent: an existing doc is returned untouched. */
export async function ensureHomeworkBuild(
  planId: string,
  partnerId: string,
  problems: Array<{ n: number; text: string }>,
): Promise<HomeworkBuildDoc> {
  await connectDB();
  const now = new Date();
  const fresh = {
    partnerId,
    problems: problems.map((p) => ({
      n: p.n, text: p.text, hash: problemHash(p.text), status: 'preparing',
      figure: null, key: null, verify: { agreed: false }, updatedAt: now,
    })),
    startedAt: now,
    updatedAt: now,
    done: false,
  };
  return (await HomeworkBuildModel.findOneAndUpdate(
    { _id: planId },
    { $setOnInsert: fresh },
    { upsert: true, new: true, lean: true },
  )) as unknown as HomeworkBuildDoc;
}

export async function patchProblemBuild(
  planId: string,
  n: number,
  patch: Partial<Omit<ProblemBuild, 'n' | 'text' | 'hash'>>,
): Promise<void> {
  await connectDB();
  const now = new Date();
  const set: Record<string, unknown> = { updatedAt: now, 'problems.$.updatedAt': now };
  for (const [k, v] of Object.entries(patch)) {
    if (k !== 'updatedAt' && v !== undefined) set[`problems.$.${k}`] = v;
  }
  const doc = (await HomeworkBuildModel.findOneAndUpdate(
    { _id: planId, 'problems.n': n },
    { $set: set },
    { new: true, lean: true },
  )) as HomeworkBuildDoc | null;
  if (!doc) return;
  const done = doc.problems.every((p) => p.status !== 'preparing');
  if (done !== doc.done) await HomeworkBuildModel.updateOne({ _id: planId }, { $set: { done } });
}

/** Newest ready|unverified problem with this hash, updated within maxAgeMs. */
export async function findCachedProblem(hash: string, maxAgeMs: number = DAY_MS): Promise<ProblemBuild | null> {
  if (maxAgeMs <= 0) return null;
  await connectDB();
  const cutoff = new Date(Date.now() - maxAgeMs);
  const docs = (await HomeworkBuildModel.find({ 'problems.hash': hash }).lean()) as unknown as HomeworkBuildDoc[];
  let best: ProblemBuild | null = null;
  for (const d of docs) {
    for (const p of d.problems) {
      if (p.hash !== hash || (p.status !== 'ready' && p.status !== 'unverified')) continue;
      if (p.updatedAt < cutoff) continue;
      if (!best || p.updatedAt > best.updatedAt) best = p;
    }
  }
  return best;
}
