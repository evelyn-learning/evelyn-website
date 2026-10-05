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
  const { computeUsageTotals } = await import('../src/lib/tutor/ai/usage-totals');

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
  // The document the route's LAST guarded write got back (hydrated, `new: true`) — what its totals reconcile reads.
  let lastReturned: unknown = null;
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
          else lastReturned = r;
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
  type Stored = Record<string, unknown> & { tokenUsage?: unknown; voiceEngine?: unknown; duration?: number; attemptSpans?: Array<{ startedAt: Date; duration: number; endedAt?: Date }> };
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

  // ── h. token totals + cost from the stored usage entries (2026-10-04) ───
  console.log('\n[h] token totals + cost');
  {
    type Entry = Record<string, unknown>;
    const brain = (sec: number, i: number, o: number, cr = 0, cw = 0, model: string | undefined = 'claude-sonnet-5'): Entry =>
      ({ operation: 'brain-turn', timestamp: at(sec), inputTokens: i, outputTokens: o, ...(cr ? { cacheReadTokens: cr } : {}), ...(cw ? { cacheCreationTokens: cw } : {}), ...(model ? { model } : {}) });
    const totalsOf = (d: Stored) => ({ totalInputTokens: d.totalInputTokens, totalOutputTokens: d.totalOutputTokens, estimatedCost: d.estimatedCost });
    const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    // Concurrent appends land in an arbitrary order, and a float sum taken in a different order can round
    // differently in the 4th decimal: tokens must match exactly, cost to the stored precision.
    const sameTotals = (got: ReturnType<typeof totalsOf>, want: { totalInputTokens: number; totalOutputTokens: number; estimatedCost: number }) =>
      got.totalInputTokens === want.totalInputTokens && got.totalOutputTokens === want.totalOutputTokens
      && typeof got.estimatedCost === 'number' && Math.abs(got.estimatedCost - want.estimatedCost) <= 0.00011;
    // What the page sends: its OWN list's totals (the shared function, dedupe off — the page's arithmetic).
    const pageTotals = (list: Entry[], engine = 'claude-brain') => computeUsageTotals(list, engine, { dedupe: false });
    // What must be stored: the totals of the entries actually in the document.
    const fromStored = (d: Stored) => computeUsageTotals(d.tokenUsage, d.voiceEngine);
    const hb = { ...base, voiceEngine: 'claude-brain' };
    const sitting1 = [brain(5, 312, 214, 0, 126_600), brain(40, 96, 301, 126_600), brain(90, 143, 288, 126_600), brain(150, 77, 324, 126_829)];
    const sitting2 = [brain(600, 204, 190, 0, 9_800), brain(640, 88, 412, 136_400), brain(700, 1500, 600, 30_000, 0, 'deepseek-chat'), { operation: 'greeting', timestamp: at(601), inputTokens: 900, outputTokens: 120 }];

    // h1: one sitting, saved in two steps — exactly what the page computed, as before.
    const s1 = sid('h1');
    let r = await post({ sessionId: s1, ...hb, startedAt: at(0), duration: 60, tokenUsage: sitting1.slice(0, 2), ...pageTotals(sitting1.slice(0, 2)) });
    let d = await one(s1);
    check('h1 first save of a NEW session ($max totals on the upsert insert) → 200, totals = the page\'s', r.status === 200 && eq(totalsOf(d), pageTotals(sitting1.slice(0, 2))), { status: r.status, res: r.json, stored: totalsOf(d), page: pageTotals(sitting1.slice(0, 2)) });
    r = await post({ sessionId: s1, ...hb, startedAt: at(0), duration: 160, tokenUsage: sitting1.slice(2), ...pageTotals(sitting1) });
    d = await one(s1);
    check('h1 single sitting: stored totals = the page\'s totals = the sum of the stored entries (unchanged behaviour)', r.status === 200 && (d.tokenUsage as unknown[]).length === 4 && eq(totalsOf(d), pageTotals(sitting1)) && eq(totalsOf(d), fromStored(d)), { stored: totalsOf(d), page: pageTotals(sitting1), fromEntries: fromStored(d) });
    check('h1 …and the span write is untouched by the totals (one span 160, duration 160)', d.duration === 160 && JSON.stringify(spansOf(d)) === '[{"start":0,"duration":160}]', { duration: d.duration, spans: spansOf(d) });
    r = await post({ sessionId: s1, startedAt: at(0), lessonProgress: { lessonPlanId: 'plan-1', currentSegmentId: 'seg-2', completedSegmentIds: [] } });
    d = await one(s1);
    check('h1 a checkpoint save (no totals, no entries) leaves the totals alone', r.status === 200 && eq(totalsOf(d), pageTotals(sitting1)), totalsOf(d));

    // h2: THE DEFECT — reload mid-session; the page's list restarts empty and it sends the second sitting's totals only.
    const s2 = sid('h2');
    await post({ sessionId: s2, ...hb, startedAt: at(0), duration: 160, tokenUsage: sitting1, ...pageTotals(sitting1) });
    r = await post({ sessionId: s2, ...hb, startedAt: at(0), duration: 700, tokenUsage: sitting2.slice(0, 2), ...pageTotals(sitting2.slice(0, 2)) });
    d = await one(s2);
    check('h2 resumed (retail /tutor, same startedAt): first save of sitting 2 → totals = sitting 1 + what sitting 2 has sent', r.status === 200 && (d.tokenUsage as unknown[]).length === 6 && eq(totalsOf(d), computeUsageTotals([...sitting1, ...sitting2.slice(0, 2)], 'claude-brain')), { stored: totalsOf(d), want: computeUsageTotals([...sitting1, ...sitting2.slice(0, 2)], 'claude-brain'), sitting2Only: pageTotals(sitting2.slice(0, 2)) });
    r = await post({ sessionId: s2, ...hb, startedAt: at(0), duration: 760, endedAt: at(760), status: 'completed', tokenUsage: sitting2.slice(2), ...pageTotals(sitting2) });
    d = await one(s2);
    const both = computeUsageTotals([...sitting1, ...sitting2], 'claude-brain');
    check('h2 final save of sitting 2 → totals cover BOTH sittings (all 8 entries), not the last sitting', r.status === 200 && (d.tokenUsage as unknown[]).length === 8 && eq(totalsOf(d), both) && eq(totalsOf(d), fromStored(d)) && (d.estimatedCost as number) > pageTotals(sitting2).estimatedCost && (d.totalOutputTokens as number) === pageTotals(sitting1).totalOutputTokens + pageTotals(sitting2).totalOutputTokens, { stored: totalsOf(d), want: both, sitting2Only: pageTotals(sitting2) });
    {
      // The reconcile prices from the document the write RETURNED: its entries must carry `model` (and the cache
      // buckets), or the DeepSeek turn would be priced at the fallback (Sonnet) rate.
      const returned = ((lastReturned as { tokenUsage?: unknown[] } | null)?.tokenUsage ?? []) as Array<{ toObject?: () => Record<string, unknown> }>;
      const plain = returned.map((e) => (typeof e?.toObject === 'function' ? e.toObject() : (e as Record<string, unknown>)));
      const wantModels = [...sitting1, ...sitting2].map((e) => (e.model as string | undefined) ?? null);
      const returnedModels = plain.map((e) => (e.model as string | undefined) ?? null);
      const storedModels = ((d.tokenUsage as Array<Record<string, unknown>>) ?? []).map((e) => (e.model as string | undefined) ?? null);
      const noModel = computeUsageTotals(plain.map((e) => ({ ...e, model: undefined })), 'claude-brain').estimatedCost;
      check('h2 entries on the document the write RETURNED carry `model` (as do the stored ones); cache buckets survive too', eq(returnedModels, wantModels) && eq(storedModels, wantModels) && plain[1]?.cacheReadTokens === 126_600 && plain[0]?.cacheCreationTokens === 126_600, { returnedModels, storedModels, hydratedAccessorTypeof: typeof (returned[6] as { model?: unknown })?.model });
      check('h2 …and the model matters: the same entries priced without it cost more than what is stored', noModel > (d.estimatedCost as number) && eq(computeUsageTotals(plain, 'claude-brain'), both), { stored: d.estimatedCost, pricedWithoutModel: noModel });
    }
    check('h2 one span, duration 760, status completed (the guarded write still does its job)', d.duration === 760 && spansOf(d).length === 1 && d.status === 'completed', { duration: d.duration, spans: spansOf(d), status: d.status });

    // h2b: resumed as a NEW mount (embed-style second span) that does send entries.
    const s2b = sid('h2b');
    await post({ sessionId: s2b, ...hb, startedAt: at(0), duration: 160, tokenUsage: sitting1, ...pageTotals(sitting1) });
    r = await post({ sessionId: s2b, ...hb, startedAt: at(600), duration: 150, tokenUsage: sitting2, ...pageTotals(sitting2) });
    d = await one(s2b);
    check('h2b second mount pushing a new span AND entries in one write → two spans, duration 310, totals = both sittings', r.status === 200 && d.duration === 310 && spansOf(d).length === 2 && eq(totalsOf(d), both), { duration: d.duration, spans: spansOf(d), stored: totalsOf(d), want: both });

    // h3: the client's figures are not trusted downwards.
    const s3 = sid('h3');
    r = await post({ sessionId: s3, ...hb, startedAt: at(0), duration: 30, tokenUsage: sitting1, totalInputTokens: 0, totalOutputTokens: 0, estimatedCost: 0 });
    d = await one(s3);
    check('h3 client sends zeros with its entries → stored = the sum of the entries', r.status === 200 && eq(totalsOf(d), pageTotals(sitting1)), totalsOf(d));
    const s3b = sid('h3b');
    r = await post({ sessionId: s3b, ...hb, startedAt: at(0), duration: 30, tokenUsage: sitting1 });
    d = await one(s3b);
    check('h3 client sends entries and NO totals → stored = the sum of the entries', r.status === 200 && eq(totalsOf(d), pageTotals(sitting1)), totalsOf(d));
    const s3c = sid('h3c');
    r = await post({ sessionId: s3c, ...hb, startedAt: at(0), duration: 30, tokenUsage: sitting1, totalInputTokens: 'lots', totalOutputTokens: -5, estimatedCost: null });
    d = await one(s3c);
    check('h3 non-numeric / negative / null totals are ignored (200, not a validation error) → the sum of the entries', r.status === 200 && eq(totalsOf(d), pageTotals(sitting1)), { status: r.status, res: r.json, stored: totalsOf(d) });
    const s3d = sid('h3d');
    r = await post({ sessionId: s3d, ...hb, startedAt: at(0), duration: 30, tokenUsage: sitting1.slice(0, 1), totalInputTokens: 999_999, totalOutputTokens: 9_999, estimatedCost: 1.5 });
    d = await one(s3d);
    check('h3 (by design) a client total ABOVE its stored entries is kept — raise-only; an append lost to a failed save lives only in the page\'s total', r.status === 200 && d.totalInputTokens === 999_999 && d.totalOutputTokens === 9_999 && d.estimatedCost === 1.5, totalsOf(d));

    // h4: the same entries stored twice.
    const s4 = sid('h4');
    await post({ sessionId: s4, ...hb, startedAt: at(0), duration: 30, tokenUsage: sitting1, ...pageTotals(sitting1) });
    r = await post({ sessionId: s4, ...hb, startedAt: at(0), duration: 60, tokenUsage: [sitting1[2], sitting1[3], brain(200, 50, 60)], ...pageTotals([...sitting1, brain(200, 50, 60)]) });
    d = await one(s4);
    check('h4 two entries re-sent: the array holds them twice (7), the totals count each call once', r.status === 200 && (d.tokenUsage as unknown[]).length === 7 && eq(totalsOf(d), pageTotals([...sitting1, brain(200, 50, 60)])) && eq(totalsOf(d), fromStored(d)), { entries: (d.tokenUsage as unknown[]).length, stored: totalsOf(d), want: pageTotals([...sitting1, brain(200, 50, 60)]) });

    // h5: a client that sends totals and never entries (the embed).
    const s5 = sid('h5');
    r = await post({ sessionId: s5, ...hb, source: 'embed', startedAt: at(0), duration: 100, totalInputTokens: 5000, totalOutputTokens: 700, estimatedCost: 0.0421 });
    d = await one(s5);
    check('h5 totals-only client, first sitting → stored verbatim (no entries to derive from)', r.status === 200 && d.totalInputTokens === 5000 && d.totalOutputTokens === 700 && d.estimatedCost === 0.0421 && ((d.tokenUsage as unknown[]) ?? []).length === 0, totalsOf(d));
    r = await post({ sessionId: s5, ...hb, source: 'embed', startedAt: at(0), duration: 130, totalInputTokens: 6100, totalOutputTokens: 820, estimatedCost: 0.0502 });
    d = await one(s5);
    check('h5 …its totals grow within the sitting', d.totalInputTokens === 6100 && d.totalOutputTokens === 820 && d.estimatedCost === 0.0502, totalsOf(d));
    r = await post({ sessionId: s5, ...hb, source: 'embed', startedAt: at(900), duration: 40, totalInputTokens: 1200, totalOutputTokens: 150, estimatedCost: 0.0098 });
    d = await one(s5);
    // OBSERVATION: the embed resets its accumulator on every mount and sends no entries, so the true total
    // (sitting 1 + sitting 2) cannot be rebuilt here. Raise-only keeps the LARGER sitting instead of the last one.
    check('h5 (known gap) totals-only client resumed with smaller figures → NOT lowered to the last sitting; still not the sum', r.status === 200 && d.totalInputTokens === 6100 && d.totalOutputTokens === 820 && d.estimatedCost === 0.0502 && d.duration === 170, { stored: totalsOf(d), duration: d.duration, trueSumWouldBe: { totalInputTokens: 7300, totalOutputTokens: 970, estimatedCost: 0.06 } });

    // h6: a stored document the old route left wrong is repaired by its next save.
    const s6 = sid('h6');
    await col.insertOne({ sessionId: s6, subject: 'Math', topic: 'Linear equations', level: 'Grade 8', inputMode: 'voice', voiceEngine: 'claude-brain', startedAt: new Date(at(0)), duration: 700,
      tokenUsage: [...sitting1, ...sitting2].map((e) => ({ ...e, timestamp: new Date(e.timestamp as string) })), ...pageTotals(sitting2) });
    r = await post({ sessionId: s6, startedAt: at(0), duration: 710 });
    d = await one(s6);
    check('h6 document left with the last sitting\'s totals → repaired to all its entries by the next save (no new entries needed)', r.status === 200 && eq(totalsOf(d), both), { stored: totalsOf(d), want: both });

    // h7: realtime entries are priced by the session's voiceEngine.
    const rt = [{ operation: 'realtime-response', timestamp: at(10), inputTokens: 0, outputTokens: 0, inputAudioTokens: 180_000, outputAudioTokens: 240_000, inputTextTokens: 30_000, outputTextTokens: 15_000 }];
    const s7 = sid('h7');
    await post({ sessionId: s7, ...base, voiceEngine: 'realtime-2', startedAt: at(0), duration: 30, tokenUsage: rt });
    d = await one(s7);
    check('h7 realtime-2 session, no client totals → cost from the realtime-2 rate card', d.estimatedCost === computeUsageTotals(rt, 'realtime-2').estimatedCost && d.estimatedCost !== computeUsageTotals(rt, 'realtime').estimatedCost, { stored: d.estimatedCost, rt2: computeUsageTotals(rt, 'realtime-2').estimatedCost, rt: computeUsageTotals(rt, 'realtime').estimatedCost });

    // h8: concurrency — appends and totals must agree whatever the interleaving.
    let allOk = true;
    const seen: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`h8-${round}`);
      // Sitting 1 stored; then two mounts (the old one and a new one) save at once, each appending its own entries
      // and each sending ONLY its own totals — the worst case for a totals write computed from a stale read.
      await post({ sessionId: s, ...hb, startedAt: at(0), duration: 100, tokenUsage: sitting1, ...pageTotals(sitting1) });
      const a = [brain(1000 + round, 11, 21), brain(1010 + round, 12, 22, 5000), brain(1020 + round, 13, 23, 5000)];
      const b = [brain(2000 + round, 31, 41, 0, 7000), brain(2010 + round, 32, 42, 7000), brain(2020 + round, 33, 43, 7000, 0, 'deepseek-chat')];
      const rs = await Promise.all([
        post({ sessionId: s, ...hb, startedAt: at(0), duration: 110, tokenUsage: [a[0]], ...pageTotals([...sitting1, a[0]]) }),
        post({ sessionId: s, ...hb, startedAt: at(1000), duration: 20, tokenUsage: [b[0]], ...pageTotals([b[0]]) }),
        post({ sessionId: s, ...hb, startedAt: at(0), duration: 120, tokenUsage: [a[1]], ...pageTotals([...sitting1, a[0], a[1]]) }),
        post({ sessionId: s, ...hb, startedAt: at(1000), duration: 30, tokenUsage: [b[1]], ...pageTotals([b[0], b[1]]) }),
        post({ sessionId: s, ...hb, startedAt: at(0), duration: 130, tokenUsage: [a[2]], ...pageTotals([...sitting1, ...a]) }),
        post({ sessionId: s, ...hb, startedAt: at(1000), duration: 40, tokenUsage: [b[2]], ...pageTotals(b) }),
      ]);
      const ds = await docs(s);
      const dd = ds[0] ?? ({} as Stored);
      const want = computeUsageTotals([...sitting1, ...a, ...b], 'claude-brain');
      const spans = spansOf(dd).sort((x, y) => x.start - y.start);
      const ok = ds.length === 1 && rs.every((x) => x.status === 200) && (dd.tokenUsage as unknown[]).length === 10
        && sameTotals(totalsOf(dd), want) && eq(totalsOf(dd), fromStored(dd))
        && JSON.stringify(spans) === '[{"start":0,"duration":130},{"start":1000,"duration":40}]' && dd.duration === 170 && consistent(dd);
      if (!ok) allOk = false;
      seen.push({ docs: ds.length, statuses: rs.map((x) => x.status).join(','), entries: (dd.tokenUsage as unknown[])?.length, stored: totalsOf(dd), want, duration: dd.duration, spans });
    }
    check('h8 8 rounds × 6 parallel saves from two mounts, each appending entries: all 10 entries stored, totals = their sum, spans 130 + 40, duration 170', allOk, seen);

    let allNew = true;
    const seenNew: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`h9-${round}`);
      const es = [0, 1, 2, 3, 4].map((k) => brain(10 + k, 100 + k, 50 + k, 1000 * k, k === 0 ? 4000 : 0));
      const rs = await Promise.all(es.map((e, k) => post({ sessionId: s, ...hb, startedAt: at(0), duration: 10 * (k + 1), tokenUsage: [e], ...pageTotals(es.slice(0, k + 1)) })));
      const ds = await docs(s);
      const dd = ds[0] ?? ({} as Stored);
      const ok = ds.length === 1 && rs.every((x) => x.status === 200) && (dd.tokenUsage as unknown[]).length === 5 && sameTotals(totalsOf(dd), pageTotals(es)) && eq(totalsOf(dd), fromStored(dd)) && dd.duration === 50;
      if (!ok) allNew = false;
      seenNew.push({ docs: ds.length, statuses: rs.map((x) => x.status).join(','), entries: (dd.tokenUsage as unknown[])?.length, stored: totalsOf(dd), want: pageTotals(es) });
    }
    check('h9 8 rounds × 5 parallel FIRST saves of a new session, each with one entry (insert race + retry): 5 entries, totals = their sum', allNew, seenNew);

    // h10: 5 parallel saves on an EXISTING session, each re-sending an entry another save also sends (duplicates in the array).
    let allDup = true;
    const seenDup: unknown[] = [];
    for (let round = 0; round < 8; round++) {
      const s = sid(`h10-${round}`);
      await post({ sessionId: s, ...hb, startedAt: at(0), duration: 100, tokenUsage: sitting1, ...pageTotals(sitting1) });
      const es = [0, 1, 2, 3, 4].map((k) => brain(300 + 10 * k + round, 200 + k, 80 + k, 2000 * (k + 1), 0, k === 3 ? 'deepseek-chat' : 'claude-sonnet-5'));
      // save k sends entry k AND re-sends entry k-1 (save 0 re-sends the last entry of sitting 1).
      const rs = await Promise.all(es.map((e, k) => post({ sessionId: s, ...hb, startedAt: at(0), duration: 110 + 10 * k, tokenUsage: [k === 0 ? sitting1[3] : es[k - 1], e], ...pageTotals([...sitting1, ...es.slice(0, k + 1)]) })));
      const ds = await docs(s);
      const dd = ds[0] ?? ({} as Stored);
      const want = computeUsageTotals([...sitting1, ...es], 'claude-brain');
      const ok = ds.length === 1 && rs.every((x) => x.status === 200) && (dd.tokenUsage as unknown[]).length === 14 && sameTotals(totalsOf(dd), want) && eq(totalsOf(dd), fromStored(dd)) && dd.duration === 150 && spansOf(dd).length === 1;
      if (!ok) allDup = false;
      seenDup.push({ docs: ds.length, statuses: rs.map((x) => x.status).join(','), entries: (dd.tokenUsage as unknown[])?.length, stored: totalsOf(dd), want, withDuplicatesWouldBe: computeUsageTotals(dd.tokenUsage, 'claude-brain', { dedupe: false }), duration: dd.duration });
    }
    check('h10 8 rounds × 5 parallel saves on an existing session, each re-sending a neighbour\'s entry: 14 stored (5 duplicates), totals = the sum of the 9 DISTINCT entries', allDup, seenDup);

    // h11 (informational): entries sent with NO timestamp. No client does this (the page always sends one, the embed
    // sends no entries) — the schema then stamps each with Date.now at the write, so identical calls in one save can
    // share a millisecond and be read as one call.
    const s11 = sid('h11');
    const bare = { operation: 'chat', inputTokens: 1000, outputTokens: 100 };
    r = await post({ sessionId: s11, ...hb, startedAt: at(0), duration: 5, tokenUsage: [bare, bare, bare] });
    d = await one(s11);
    check('h11 (informational) three identical entries with no timestamp in one save → 200', r.status === 200 && (d.tokenUsage as unknown[]).length === 3, { stored: totalsOf(d), ifCountedThreeTimes: pageTotals([bare, bare, bare]), distinctTimestamps: new Set((d.tokenUsage as Array<{ timestamp?: Date }>).map((e) => e.timestamp?.getTime())).size });
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
