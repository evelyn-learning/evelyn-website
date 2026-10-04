// scripts/dbcheck-session-usage.ts
/**
 * Real-MongoDB check of POST /api/tutor/session-usage (the guarded atomic
 * attempt-span write, 2026-10-04). NOT part of the test set (not test-*, not
 * in package.json): it needs a mongod, and it must only ever see a THROWAWAY
 * one.
 *
 * ⚠️ SAFETY. On this laptop 127.0.0.1:2710 can be an SSH tunnel to the
 * production MongoDB and apps/tutor/.env.local points MONGODB_URI at it. This
 * script therefore:
 *   - refuses to run unless MONGODB_URI is EXACTLY the throwaway literal
 *     below (checked before any app module is imported — @core/db reads the
 *     env var at import time);
 *   - loads no env file;
 *   - re-checks host / port / database name on the live connection before
 *     the first write.
 *
 * Run (after starting a throwaway mongod on port 27999):
 *   cd apps/tutor && MONGODB_URI=mongodb://127.0.0.1:27999/evelyn_route_test npx tsx scripts/dbcheck-session-usage.ts
 */
const THROWAWAY_URI = 'mongodb://127.0.0.1:27999/evelyn_route_test';
const uri = process.env.MONGODB_URI ?? '';
if (uri !== THROWAWAY_URI || !uri.includes(':27999/') || /:2710\b/.test(uri)) {
  console.error(`REFUSING TO RUN: MONGODB_URI must be exactly ${THROWAWAY_URI} (got ${uri ? JSON.stringify(uri) : 'nothing'}).`);
  process.exit(2);
}

let passed = 0;
let failed = 0;
function check(name: string, ok: boolean, observed?: unknown) {
  if (ok) passed++; else failed++;
  console.log(`  ${ok ? '✓' : '✗'} ${name}${observed !== undefined ? `  — observed ${typeof observed === 'string' ? observed : JSON.stringify(observed)}` : ''}`);
}

async function main() {
  const { NextRequest } = await import('next/server');
  const mongoose = (await import('mongoose')).default;
  const { connectDB } = await import('@core/db');
  const { TutorSession } = await import('../src/models/TutorSession');
  const route = await import('../src/app/api/tutor/session-usage/route');
  const { sessionActiveSeconds } = await import('../src/lib/tutor/recordings/active-seconds');

  await connectDB();
  const conn = mongoose.connection;
  if (conn.host !== '127.0.0.1' || conn.port !== 27999 || conn.name !== 'evelyn_route_test') {
    console.error(`REFUSING TO RUN: connected to ${conn.host}:${conn.port}/${conn.name}, not the throwaway database.`);
    process.exit(2);
  }
  console.log(`connected: ${conn.host}:${conn.port}/${conn.name} · mongoose ${mongoose.version}`);
  const col = conn.db!.collection(TutorSession.collection.name);

  // Observation only: count how often the route's guarded write MISSED (null
  // on an existing document) or hit the unique index (E11000) — proof that
  // the concurrency scenarios really exercised the retry paths.
  const seenRaces = { guardMiss: 0, duplicateKey: 0 };
  {
    const model = TutorSession as unknown as { findOneAndUpdate: (...a: unknown[]) => { exec: () => Promise<unknown> } };
    const original = model.findOneAndUpdate.bind(TutorSession);
    model.findOneAndUpdate = (...a: unknown[]) => {
      const q = original(...a);
      const exec = q.exec.bind(q);
      q.exec = async () => {
        try {
          const r = await exec();
          if (r == null) seenRaces.guardMiss++;
          return r;
        } catch (err) {
          if ((err as { code?: unknown } | null)?.code === 11000) seenRaces.duplicateKey++;
          throw err;
        }
      };
      return q;
    };
  }

  const run = Date.now().toString(36);
  const sid = (tag: string) => `dbcheck-${run}-${tag}`;
  // Recent starts: the model has a 180-day TTL index on startedAt.
  const BASE = Date.now() - 6 * 3600_000;
  const at = (offsetSec: number) => new Date(BASE + offsetSec * 1000).toISOString();

  const statuses: number[] = [];
  async function post(body: Record<string, unknown>): Promise<{ status: number; json: Record<string, unknown> }> {
    const req = new NextRequest('https://engine.test/api/tutor/session-usage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const res = await route.POST(req);
    statuses.push(res.status);
    let json: Record<string, unknown> = {};
    try { json = (await res.json()) as Record<string, unknown>; } catch { /* no body */ }
    return { status: res.status, json };
  }
  type Stored = Record<string, unknown> & { duration?: number; attemptSpans?: Array<{ startedAt: Date; duration: number; endedAt?: Date }> };
  const docs = (sessionId: string) => col.find({ sessionId }).toArray() as unknown as Promise<Stored[]>;
  const one = async (sessionId: string): Promise<Stored> => (await docs(sessionId))[0] ?? ({} as Stored);
  const spansOf = (d: Stored) => (d.attemptSpans ?? []).map((s) => ({ start: Math.round((new Date(s.startedAt).getTime() - BASE) / 1000), duration: s.duration }));
  const base = { subject: 'Math', topic: 'Linear equations', level: 'Grade 8', inputMode: 'voice' };

  // ── 0. Indexes ──────────────────────────────────────────────────────────
  console.log('\n[0] indexes');
  {
    // What the app itself does: connectDB() + a first write, no explicit init.
    const r = await post({ sessionId: sid('idx'), ...base, startedAt: at(0), duration: 1 });
    check('first POST on an empty database → 200', r.status === 200, r);
    await new Promise((res) => setTimeout(res, 1500));
    const before = await col.indexes();
    const uniqBefore = before.find((i) => i.key && (i.key as Record<string, unknown>).sessionId === 1);
    check('unique sessionId index exists WITHOUT an explicit init() (autoIndex after connectDB)', !!uniqBefore?.unique, before.map((i) => `${i.name}${i.unique ? '(unique)' : ''}`).join(', '));
    await TutorSession.init();
    await TutorSession.ensureIndexes();
    const after = await col.indexes();
    const uniq = after.find((i) => i.key && (i.key as Record<string, unknown>).sessionId === 1);
    check('unique sessionId index exists after init()/ensureIndexes()', !!uniq?.unique, after.map((i) => `${i.name}${i.unique ? '(unique)' : ''}`).join(', '));
    if (!uniq?.unique) { console.error('no unique index — the concurrency scenarios would be meaningless; aborting'); process.exit(1); }
  }

  // ── a. one mount: grow, out-of-order ────────────────────────────────────
  console.log('\n[a] new session, one mount');
  {
    const s = sid('a');
    let r = await post({ sessionId: s, ...base, startedAt: at(0), duration: 30 });
    let d = await one(s);
    check('first save 30 → 200, one span 30, duration 30', r.status === 200 && d.duration === 30 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":30}]', { status: r.status, res: r.json, duration: d.duration, spans: spansOf(d) });
    check('insert-only fields stored (subject/topic/level/inputMode/startedAt)', d.subject === 'Math' && d.topic === 'Linear equations' && d.level === 'Grade 8' && d.inputMode === 'voice' && new Date(d.startedAt as Date).toISOString() === at(0));
    check('timestamps: createdAt + updatedAt set on the upsert', d.createdAt instanceof Date && d.updatedAt instanceof Date);
    r = await post({ sessionId: s, ...base, startedAt: at(0), duration: 60 });
    d = await one(s);
    check('second save 60 → one span 60, duration 60', r.status === 200 && d.duration === 60 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":60}]', { res: r.json, duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s, ...base, startedAt: at(0), duration: 45 });
    d = await one(s);
    check('out-of-order save 45 → still 60 / 60', r.status === 200 && d.duration === 60 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":60}]', { res: r.json, duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s, ...base, startedAt: at(0), duration: 75, endedAt: at(75), status: 'completed' });
    d = await one(s);
    check('final save with endedAt → span endedAt + doc endedAt + status', d.duration === 75 && d.status === 'completed' && new Date(d.endedAt as Date).toISOString() === at(75) && !!d.attemptSpans?.[0]?.endedAt && new Date(d.attemptSpans[0].endedAt!).toISOString() === at(75), { duration: d.duration, status: d.status, spanEndedAt: d.attemptSpans?.[0]?.endedAt });
    check('exactly one document', (await docs(s)).length === 1);
  }

  // ── b. every field the HEAD route wrote is still written ────────────────
  console.log('\n[b] field persistence');
  {
    const s = sid('b');
    const transcript1 = [{ role: 'tutor', text: 'Hello', timestamp: at(1) }, { role: 'student', text: 'x = 3', timestamp: at(5), pedagogicalIntent: 'answer' }];
    let r = await post({
      sessionId: s, ...base, sessionGoal: 'practice', source: 'embed', sourcePartnerId: 'partner-x', sourceHost: 'host.test',
      startedAt: at(0), duration: 20,
      studentName: 'Ada', voiceEngine: 'claude-brain', messageCount: 2, whiteboardItemCount: 1,
      totalInputTokens: 100, totalOutputTokens: 50, estimatedCost: 0.0123, status: 'active',
      topicsCovered: ['t1'], conceptsCovered: ['c1'], weakTopics: [{ topic: 'w1', count: 2 }],
      lessonProgress: { lessonPlanId: 'plan-1', currentSegmentId: 'seg-2', completedSegmentIds: ['seg-1'] },
      tokenUsage: [{ operation: 'brain', inputTokens: 100, outputTokens: 50 }],
      debugEvents: [{ type: 'brain_turn', message: 'ok' }, { type: 'empty', message: '' }],
      transcript: transcript1,
      whiteboardCommands: [{ action: 'show_equation', data: { latex: 'x=3' }, sourceMessageIndex: 0 }],
    });
    let d = await one(s);
    const lp = d.lessonProgress as { lessonPlanId?: string; currentSegmentId?: string; completedSegmentIds?: string[] } | undefined;
    check('full save → 200', r.status === 200, r);
    check('$setOnInsert fields: sessionGoal/source/sourcePartnerId/sourceHost', d.sessionGoal === 'practice' && d.source === 'embed' && d.sourcePartnerId === 'partner-x' && d.sourceHost === 'host.test');
    check('$set scalars: studentName/voiceEngine/messageCount/whiteboardItemCount/tokens/cost/status', d.studentName === 'Ada' && d.voiceEngine === 'claude-brain' && d.messageCount === 2 && d.whiteboardItemCount === 1 && d.totalInputTokens === 100 && d.totalOutputTokens === 50 && d.estimatedCost === 0.0123 && d.status === 'active');
    check('$set arrays: topicsCovered/conceptsCovered/weakTopics', JSON.stringify([d.topicsCovered, d.conceptsCovered]) === '[["t1"],["c1"]]' && (d.weakTopics as Array<{ topic?: string; count?: number }>)?.[0]?.topic === 'w1' && (d.weakTopics as Array<{ count?: number }>)[0].count === 2);
    check('lessonProgress checkpoint', lp?.lessonPlanId === 'plan-1' && lp?.currentSegmentId === 'seg-2' && JSON.stringify(lp?.completedSegmentIds) === '["seg-1"]', lp);
    check('transcript (2 entries, roles + text + intent)', Array.isArray(d.transcript) && (d.transcript as Array<Record<string, unknown>>).length === 2 && (d.transcript as Array<Record<string, unknown>>)[1].text === 'x = 3' && (d.transcript as Array<Record<string, unknown>>)[1].pedagogicalIntent === 'answer');
    check('whiteboardCommands (1 entry)', Array.isArray(d.whiteboardCommands) && (d.whiteboardCommands as Array<Record<string, unknown>>).length === 1 && (d.whiteboardCommands as Array<Record<string, unknown>>)[0].action === 'show_equation');
    check('$push tokenUsage + debugEvents alongside the span $push', (d.tokenUsage as unknown[])?.length === 1 && (d.debugEvents as unknown[])?.length === 2 && spansOf(d).length === 1 && d.duration === 20, { tokenUsage: (d.tokenUsage as unknown[])?.length, debugEvents: (d.debugEvents as unknown[])?.length, spans: spansOf(d), duration: d.duration });

    // Transcript-only save: no startedAt, no duration.
    const transcript2 = [...transcript1, { role: 'tutor', text: 'Exactly.', timestamp: at(8) }];
    r = await post({ sessionId: s, transcript: transcript2 });
    d = await one(s);
    check('transcript-only save (no startedAt/duration) → 200, transcript now 3, duration/spans untouched', r.status === 200 && (d.transcript as unknown[]).length === 3 && d.duration === 20 && spansOf(d).length === 1, { status: r.status, res: r.json, transcript: (d.transcript as unknown[]).length, duration: d.duration, spans: spansOf(d) });
    check('…and nothing else was cleared', d.studentName === 'Ada' && (d.whiteboardCommands as unknown[]).length === 1 && (d.lessonProgress as { lessonPlanId?: string })?.lessonPlanId === 'plan-1' && (d.tokenUsage as unknown[]).length === 1);

    // Transcript + startedAt, still no duration (checkpoint-style save).
    const transcript3 = [...transcript2, { role: 'student', text: 'ok', timestamp: at(9) }];
    r = await post({ sessionId: s, startedAt: at(0), transcript: transcript3, lessonProgress: { lessonPlanId: 'plan-1', currentSegmentId: 'seg-3', completedSegmentIds: ['seg-1', 'seg-2'] } });
    d = await one(s);
    check('transcript + checkpoint save with startedAt but no duration → persisted, duration untouched', r.status === 200 && (d.transcript as unknown[]).length === 4 && (d.lessonProgress as { currentSegmentId?: string }).currentSegmentId === 'seg-3' && d.duration === 20, { res: r.json, transcript: (d.transcript as unknown[]).length, duration: d.duration });

    // Periodic save: transcript + whiteboard + duration + more token usage on the recorded span (positional $max path).
    r = await post({ sessionId: s, startedAt: at(0), duration: 50, transcript: transcript3, whiteboardCommands: [{ action: 'a' }, { action: 'b' }], tokenUsage: [{ operation: 'brain', inputTokens: 1, outputTokens: 1 }], estimatedCost: 0.02, messageCount: 4 });
    d = await one(s);
    check('periodic save on a recorded span: positional $max + $set + $push together', r.status === 200 && d.duration === 50 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":50}]' && (d.whiteboardCommands as unknown[]).length === 2 && (d.tokenUsage as unknown[]).length === 2 && d.estimatedCost === 0.02 && d.messageCount === 4, { res: r.json, duration: d.duration, spans: spansOf(d), wb: (d.whiteboardCommands as unknown[]).length, tokenUsage: (d.tokenUsage as unknown[]).length });
  }

  // ── c. resume ───────────────────────────────────────────────────────────
  console.log('\n[c] resume (second mount)');
  {
    const s = sid('c');
    await post({ sessionId: s, ...base, startedAt: at(0), duration: 120 });
    let r = await post({ sessionId: s, ...base, startedAt: at(600), duration: 100 });
    let d = await one(s);
    check('second mount saves 100 → two spans, duration 220, priorActiveSeconds 120', r.status === 200 && d.duration === 220 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":120},{"start":600,"duration":100}]' && r.json.priorActiveSeconds === 120 && r.json.activeSeconds === 220, { res: r.json, duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s, ...base, startedAt: at(600), duration: 200 });
    d = await one(s);
    check('second mount saves 200 → two spans, duration 320, priorActiveSeconds 120', r.status === 200 && d.duration === 320 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":120},{"start":600,"duration":200}]' && r.json.priorActiveSeconds === 120 && r.json.activeSeconds === 320, { res: r.json, duration: d.duration, spans: spansOf(d) });
    check('startedAt stays pinned to the first mount', new Date(d.startedAt as Date).toISOString() === at(0));
    const g = await route.GET(new NextRequest(`https://engine.test/api/tutor/session-usage?sessionId=${encodeURIComponent(s)}`));
    const gj = (await g.json()) as Record<string, unknown>;
    check('GET reports activeSeconds 320 (informational: depends on embed-auth mode)', g.status !== 200 || gj.activeSeconds === 320, { status: g.status, activeSeconds: gj.activeSeconds });
  }

  // ── d. pre-spans document ───────────────────────────────────────────────
  console.log('\n[d] pre-spans document resumed');
  {
    const s = sid('d');
    await col.insertOne({ sessionId: s, startedAt: new Date(at(0)), duration: 500 });
    let r = await post({ sessionId: s, ...base, startedAt: at(3600), duration: 60 });
    let d = await one(s);
    check('new mount saves 60 → seed span 500 + own 60, duration 560, prior 500', r.status === 200 && d.duration === 560 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":500},{"start":3600,"duration":60}]' && r.json.priorActiveSeconds === 500, { res: r.json, duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s, ...base, startedAt: at(3600), duration: 90 });
    d = await one(s);
    check('saves 90 → duration 590', r.status === 200 && d.duration === 590 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":500},{"start":3600,"duration":90}]', { res: r.json, duration: d.duration, spans: spansOf(d) });
    for (let i = 0; i < 4; i++) r = await post({ sessionId: s, ...base, startedAt: at(3600), duration: 90 });
    d = await one(s);
    check('four repeated saves of 90 do not inflate (still 590, two spans)', d.duration === 590 && spansOf(d).length === 2 && r.json.priorActiveSeconds === 500, { res: r.json, duration: d.duration, spans: spansOf(d) });
    // Pre-spans doc whose stored duration exceeds the gap to the new mount: seed is capped.
    const s2 = sid('d2');
    await col.insertOne({ sessionId: s2, startedAt: new Date(at(0)), duration: 500 });
    r = await post({ sessionId: s2, ...base, startedAt: at(200), duration: 60 });
    d = await one(s2);
    // OBSERVATION, by design of `$max`: the stored `duration` (500) is never lowered, so it stays above the
    // union of the spans (260) until the new mount outgrows it. Readers of the spans see 260, readers of `duration` 500.
    check('seed capped at the gap (stored 500, new mount 200 s after start) → spans 200 + 60; stored duration stays 500 ($max never lowers)', JSON.stringify(spansOf(d)) === '[{"start":0,"duration":200},{"start":200,"duration":60}]' && d.duration === 500 && r.json.activeSeconds === 260, { res: r.json, duration: d.duration, union: sessionActiveSeconds(d), spans: spansOf(d) });
    // Pre-spans doc, SAME mount keeps saving (retail /tutor resume keeps startedAt).
    const s3 = sid('d3');
    await col.insertOne({ sessionId: s3, startedAt: new Date(at(0)), duration: 500 });
    r = await post({ sessionId: s3, ...base, startedAt: at(0), duration: 530 });
    d = await one(s3);
    check('pre-spans doc, same startedAt saves 530 → one span 530, duration 530 (no seed)', d.duration === 530 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":530}]', { res: r.json, duration: d.duration, spans: spansOf(d) });
  }

  // ── e. two overlapping mounts ───────────────────────────────────────────
  console.log('\n[e] overlapping mounts (two tabs)');
  {
    const s = sid('e');
    await post({ sessionId: s, ...base, startedAt: at(0), duration: 100 });
    let r = await post({ sessionId: s, ...base, startedAt: at(40), duration: 100 });
    let d = await one(s);
    check('tab A [0,100] + tab B [40,140] → duration 140 (union), not 200', r.status === 200 && d.duration === 140 && spansOf(d).length === 2, { res: r.json, duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s, ...base, startedAt: at(0), duration: 160 });
    d = await one(s);
    check('tab A grows to 160 → union 160', d.duration === 160 && sessionActiveSeconds(d) === 160, { res: r.json, duration: d.duration, spans: spansOf(d) });
  }

  // ── f. concurrency ──────────────────────────────────────────────────────
  console.log('\n[f] concurrency');
  const consistent = (d: Stored) => d.duration === sessionActiveSeconds(d);
  {
    // f1: 5 parallel first saves, one mount, one NEW sessionId. Repeated to give the race a chance.
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`f1-${round}`);
      const rs = await Promise.all([10, 20, 30, 40, 50].map((duration) => post({ sessionId: s, ...base, startedAt: at(0), duration, transcript: [{ role: 'tutor', text: `d${duration}`, timestamp: at(duration) }] })));
      const ds = await docs(s);
      const d = ds[0] ?? ({} as Stored);
      const ok = ds.length === 1 && rs.every((r) => r.status === 200) && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":50}]' && d.duration === 50 && (d.transcript as unknown[])?.length === 1;
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((r) => r.status).join(','), duration: d.duration, spans: spansOf(d) });
    }
    check('8 rounds × 5 parallel FIRST saves (same mount, durations 10–50): one doc, one span 50, duration 50, all 200', allOk, seen);
  }
  {
    // f1b: parallel first saves from TWO mounts of a new session.
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`f1b-${round}`);
      const rs = await Promise.all([
        post({ sessionId: s, ...base, startedAt: at(0), duration: 30 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 20 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 40 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 25 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 35 }),
      ]);
      const ds = await docs(s);
      const d = ds[0] ?? ({} as Stored);
      const spans = spansOf(d).sort((x, y) => x.start - y.start);
      const ok = ds.length === 1 && rs.every((r) => r.status === 200) && JSON.stringify(spans) === '[{"start":0,"duration":40},{"start":1000,"duration":25}]' && d.duration === 65 && consistent(d);
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((r) => r.status).join(','), duration: d.duration, union: sessionActiveSeconds(d), spans });
    }
    check('8 rounds × 5 parallel first saves from TWO mounts of a new session: one doc, spans 40 + 25, duration 65', allOk, seen);
  }
  {
    // f2: existing session with one recorded mount; 5 parallel saves from two mounts (the 2nd is new).
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`f2-${round}`);
      await post({ sessionId: s, ...base, startedAt: at(0), duration: 100 });
      const rs = await Promise.all([
        post({ sessionId: s, ...base, startedAt: at(0), duration: 110 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 50 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 130 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 70 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 120 }),
      ]);
      const ds = await docs(s);
      const d = ds[0] ?? ({} as Stored);
      const spans = spansOf(d).sort((x, y) => x.start - y.start);
      const ok = ds.length === 1 && rs.every((r) => r.status === 200) && JSON.stringify(spans) === '[{"start":0,"duration":130},{"start":1000,"duration":70}]' && d.duration === 200 && consistent(d);
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((r) => r.status).join(','), duration: d.duration, union: sessionActiveSeconds(d), spans });
    }
    check('8 rounds × 5 parallel saves, two mounts (one new) on an EXISTING session: spans 130 + 70, duration 200 = union', allOk, seen);
  }
  {
    // f3: both mounts already recorded; 5 parallel saves growing both.
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`f3-${round}`);
      await post({ sessionId: s, ...base, startedAt: at(0), duration: 100 });
      await post({ sessionId: s, ...base, startedAt: at(1000), duration: 50 });
      const rs = await Promise.all([
        post({ sessionId: s, ...base, startedAt: at(0), duration: 110 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 60 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 130 }),
        post({ sessionId: s, ...base, startedAt: at(1000), duration: 70 }),
        post({ sessionId: s, ...base, startedAt: at(0), duration: 120 }),
      ]);
      const ds = await docs(s);
      const d = ds[0] ?? ({} as Stored);
      const spans = spansOf(d).sort((x, y) => x.start - y.start);
      const ok = ds.length === 1 && rs.every((r) => r.status === 200) && JSON.stringify(spans) === '[{"start":0,"duration":130},{"start":1000,"duration":70}]' && d.duration === 200 && consistent(d);
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((r) => r.status).join(','), duration: d.duration, union: sessionActiveSeconds(d), spans });
    }
    check('8 rounds × 5 parallel saves, two RECORDED mounts on an existing session: spans 130 + 70, duration 200 = union', allOk, seen);
  }
  {
    // f4: pre-spans document, 5 parallel saves from a new mount (seed must be pushed once).
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`f4-${round}`);
      await col.insertOne({ sessionId: s, startedAt: new Date(at(0)), duration: 500 });
      const rs = await Promise.all([10, 20, 30, 40, 50].map((duration) => post({ sessionId: s, ...base, startedAt: at(3600), duration })));
      const ds = await docs(s);
      const d = ds[0] ?? ({} as Stored);
      const spans = spansOf(d).sort((x, y) => x.start - y.start);
      const ok = ds.length === 1 && rs.every((r) => r.status === 200) && JSON.stringify(spans) === '[{"start":0,"duration":500},{"start":3600,"duration":50}]' && d.duration === 550;
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((r) => r.status).join(','), duration: d.duration, union: sessionActiveSeconds(d), spans });
    }
    check('8 rounds × 5 parallel saves of a new mount on a PRE-SPANS doc: seed once + span 50, duration 550', allOk, seen);
  }

  // ── g. legacy: no usable startedAt ──────────────────────────────────────
  console.log('\n[g] no usable startedAt');
  {
    const s = sid('g');
    let r = await post({ sessionId: s, ...base, duration: 77, transcript: [{ role: 'tutor', text: 'hi', timestamp: at(1) }] });
    let d = await one(s);
    check('new session, no startedAt, duration 77 → 200, duration 77 verbatim, no spans', r.status === 200 && d.duration === 77 && (d.attemptSpans ?? []).length === 0 && (d.transcript as unknown[])?.length === 1, { status: r.status, res: r.json, duration: d.duration, spans: d.attemptSpans, startedAt: d.startedAt });
    r = await post({ sessionId: s, duration: 40 });
    d = await one(s);
    check('second save, no startedAt, duration 40 → verbatim $set (old behaviour)', r.status === 200 && d.duration === 40, { res: r.json, duration: d.duration });
    const sc = sid('c');
    r = await post({ sessionId: sc, duration: 5 });
    d = await one(sc);
    check('(informational) no-startedAt save on a session WITH spans overwrites duration verbatim', r.status === 200, { res: r.json, duration: d.duration, union: sessionActiveSeconds(d) });
    r = await post({ sessionId: sc, ...base, startedAt: at(600), duration: 200 });
    d = await one(sc);
    check('…and the next ordinary save of that mount restores the cumulative figure (320)', d.duration === 320, { res: r.json, duration: d.duration });
    const s2 = sid('g2');
    r = await post({ sessionId: s2, ...base, startedAt: at(0), duration: '12' });
    d = await one(s2);
    check('(informational) non-numeric duration with a valid startedAt', r.status < 500, { status: r.status, res: r.json, duration: d.duration, spans: d.attemptSpans });
  }

  check('no request in the whole run returned a 5xx', statuses.every((c) => c < 500), `${statuses.length} requests; non-200: ${statuses.filter((c) => c !== 200).join(',') || 'none'}`);
  check('the retry paths were really exercised: at least one E11000 and one guard miss were absorbed', seenRaces.duplicateKey > 0 && seenRaces.guardMiss > 0, seenRaces);
  const total = await col.countDocuments({});
  console.log(`\ndocuments in ${conn.name}.${col.collectionName}: ${total}`);
  await mongoose.disconnect();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
