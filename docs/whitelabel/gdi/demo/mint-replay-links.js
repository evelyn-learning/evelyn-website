#!/usr/bin/env node
// Print one replay link per gdi-demo session (audio + transcript + PDF export), for Josh's review.
//   PARTNER_SECRET="$(cat ~/.evelyn/partners/gdi-demo.secret)" \
//     node mint-replay-links.js --since 2026-11-01 [--student gdi-trial-1] --db evelyn
//   (or MONGODB_URI=mongodb://127.0.0.1:2710/<db>?replicaSet=rs0&directConnection=true instead of --db)
// READ-ONLY: only runs find() on the `tutorsessions` collection. Needs the prod Mongo tunnel on :2710
// (scripts/ops/mongo-tunnel.sh start). Refuses to run without an explicit --db or MONGODB_URI
// (the DB name must be explicit, never bare).
// Token shape = apps/tutor/src/lib/tutor/portal/replay-token.ts: {mode:'replay', partner_id, student_id, session_id, exp}.
'use strict';
const path = require('path');
const { signEmbedToken } = require(path.join(__dirname, '../../kanzoo/examples/sign-embed-token.js'));

const PARTNER = 'gdi-demo';
const ORIGIN = 'https://tutor-demo.evelynlearning.com';
const TTL_DAYS = 30;

function arg(name) { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; }

function replayLink(secret, { studentId, sessionId }, now = Math.floor(Date.now() / 1000)) {
  const payload = { mode: 'replay', partner_id: PARTNER, student_id: studentId, session_id: sessionId, exp: now + TTL_DAYS * 86400 };
  return `${ORIGIN}/tutor-portal/replay?token=${signEmbedToken(payload, secret)}`;
}
module.exports = { replayLink };

if (require.main === module) {
  (async () => {
    const secret = process.env.PARTNER_SECRET;
    if (!secret) { console.error('set PARTNER_SECRET'); process.exit(1); }
    const since = arg('--since');
    if (!since || Number.isNaN(Date.parse(since))) { console.error('--since YYYY-MM-DD required'); process.exit(1); }
    const db = arg('--db');
    const uri = db ? `mongodb://127.0.0.1:2710/${db}?replicaSet=rs0&directConnection=true` : process.env.MONGODB_URI;
    if (!uri || !/^mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri)) {
      console.error('refusing: pass --db <name> or MONGODB_URI with an explicit database name'); process.exit(1);
    }
    const student = arg('--student');
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    try {
      await client.connect();
      const filter = { sourcePartnerId: PARTNER, startedAt: { $gte: new Date(since) } };
      if (student) filter.studentId = student;
      const rows = await client.db().collection('tutorsessions')
        .find(filter, { projection: { sessionId: 1, studentId: 1, startedAt: 1, durationSeconds: 1, duration: 1 } })
        .sort({ startedAt: 1 }).toArray();
      for (const r of rows) {
        if (!r.sessionId || !r.studentId) continue; // replay needs both (ownership check)
        const when = r.startedAt ? new Date(r.startedAt).toISOString() : '?';
        console.log(`${r.studentId}\t${when}\t${r.sessionId}\t${replayLink(secret, { studentId: r.studentId, sessionId: r.sessionId })}`);
      }
      console.error(`${rows.length} session(s) since ${since}`);
    } finally { await client.close(); }
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
