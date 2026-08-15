/**
 * One-off inspector: list freestyle plans with extra detail.
 * Read-only — no deletion. Used to decide what cleanup-freestyle-plans.ts
 * should target.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(MONGODB_URI);
  const LessonPlan = mongoose.connection.collection('lessonplans');

  const docs = await LessonPlan
    .find({ 'metadata.generatedFromText': true })
    .sort({ createdAt: 1 })
    .toArray();

  console.log(`Total freestyle plans: ${docs.length}\n`);
  for (const d of docs) {
    const created = (d as { createdAt?: Date }).createdAt;
    const updated = (d as { updatedAt?: Date }).updatedAt;
    const meta = (d.metadata as Record<string, unknown> | undefined) ?? {};
    const segCount = Array.isArray(d.segments) ? d.segments.length : 0;
    const loCount = Array.isArray(d.los) ? d.los.length : 0;
    const pending = meta.pendingPicker ? '[pending]' : '         ';
    const sourceLen = typeof meta.sourceTextLength === 'number' ? `${meta.sourceTextLength}c` : '-';
    const sessMin = typeof meta.sessionMinutes === 'number' ? `${meta.sessionMinutes}m` : '-';
    const generatorOk = meta.generatorOk === false ? '(fallback)' : '';
    console.log(
      `  ${d._id}  ${pending}  los=${String(loCount).padStart(2)} segs=${String(segCount).padStart(2)}  src=${sourceLen.padStart(6)}  sess=${sessMin}  created=${created ? new Date(created).toISOString() : 'n/a'}  "${d.title}" ${generatorOk}`,
    );
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
