/**
 * Ingest (upsert) one hand-written lesson plan JSON into the lessonplans
 * collection — the GDI trial plans live in docs/whitelabel/gdi/plans/ and
 * are not TS seeds. Runs parseLessonPlan via upsertLessonPlan, so an invalid
 * plan fails here, not on the engine.
 *
 *   MONGODB_URI=mongodb://127.0.0.1:2710/evelyn npx tsx scripts/tutor/ingest-lesson-plan.ts <plan.json>
 *
 * ⚠️  127.0.0.1:2710 is the PROD tunnel: this is a prod write. The URI must
 * name the database explicitly (refused otherwise).
 */
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import connectDB from '@core/db';
import { upsertLessonPlan } from '../../src/lib/tutor/lesson-plan/store';

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('usage: ingest-lesson-plan.ts <plan.json>');
  const uri = process.env.MONGODB_URI ?? '';
  if (!/\/[A-Za-z0-9_-]+(\?|$)/.test(uri.replace(/^mongodb(\+srv)?:\/\/[^/]+/, ''))) {
    throw new Error('MONGODB_URI must name the database explicitly (e.g. .../evelyn)');
  }
  const raw = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  await connectDB();
  const plan = await upsertLessonPlan(raw);
  console.log(`upserted ${plan.id} — ${plan.segments.length} segments, ${plan.estimatedMinutes ?? '?'} min, subject ${plan.subject}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
