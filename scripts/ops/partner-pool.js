// mongosh script for scripts/ops/partner-pool.sh — see that file for usage.
// ARGS = { cmd, partner, value } is injected by the wrapper's --eval.
// Mirrors apps/tutor/src/lib/tutor/portal/partner-pool.ts: remaining =
// max(0, cap − used); exhausted = remaining < 60 s; alert stamps
// (alerts.pct80At / pct100At) are cleared when usage falls back under the line.
/* global ARGS, db, print */
(function () {
  const { cmd, partner, value } = ARGS;
  const pools = db.getCollection('partnerpools');
  const sessions = db.getCollection('tutorsessions');
  const min = (sec) => (Math.round((sec || 0) / 6) / 10).toFixed(1);
  const now = () => new Date().toISOString();

  function show() {
    const doc = pools.findOne({ _id: partner });
    if (!doc) { print(`no pool doc for '${partner}' (not pooled; no cap enforced)`); return; }
    const cap = doc.capSec || 0, used = doc.usedSec || 0, remaining = Math.max(0, cap - used);
    print(`pool ${partner}`);
    print(`  cap        ${min(cap)} min  (${cap} s)`);
    print(`  used       ${min(used)} min  (${used} s)`);
    print(`  remaining  ${min(remaining)} min  ${remaining < 60 ? '← EXHAUSTED (starts refused)' : ''}`);
    print(`  session-max ${min(doc.sessionMaxSec ?? 900)} min   idle-end ${min(doc.idleEndSec ?? 1800)} min`);
    print(`  alerts     80%: ${doc.alerts?.pct80At || '-'}   100%: ${doc.alerts?.pct100At || '-'}`);
    print(`  updatedAt  ${doc.updatedAt || '-'}`);
    const recent = sessions.find({ sourcePartnerId: partner, poolCharges: { $exists: true, $ne: [] } }, { sessionId: 1, startedAt: 1, poolCharges: 1, status: 1 })
      .sort({ startedAt: -1 }).limit(5).toArray();
    print(`  last charged sessions (${recent.length}):`);
    for (const s of recent) {
      const charged = (s.poolCharges || []).reduce((a, c) => a + (c.chargedSec || 0), 0);
      print(`    ${s.sessionId}  ${new Date(s.startedAt).toISOString()}  ${s.status}  ${s.poolCharges.length} sitting(s)  ${min(charged)} min`);
    }
  }

  function clearedAlerts(capSec, usedSec, alerts) {
    const unset = {};
    if (alerts?.pct80At && usedSec < capSec * 0.8) unset['alerts.pct80At'] = '';
    if (alerts?.pct100At && usedSec < capSec * 1.0) unset['alerts.pct100At'] = '';
    return unset;
  }

  function write(update, label) {
    const before = pools.findOne({ _id: partner });
    const res = pools.findOneAndUpdate({ _id: partner }, update, { upsert: true, returnDocument: 'after' });
    const after = res && res.value ? res.value : (res || pools.findOne({ _id: partner }));
    const unset = clearedAlerts(after.capSec || 0, after.usedSec || 0, after.alerts);
    if (Object.keys(unset).length) pools.updateOne({ _id: partner }, { $unset: unset });
    print(`${label}: ${partner}  cap ${min(before?.capSec)} → ${min(after.capSec)} min, used ${min(after.usedSec)} min${Object.keys(unset).length ? ', alert stamps cleared: ' + Object.keys(unset).join(', ') : ''}`);
    show();
  }

  const minutes = Number(value);
  const sec = Math.round(minutes * 60);
  switch (cmd) {
    case 'show': show(); break;
    case 'set':
      write({ $set: { capSec: sec, updatedAt: now() }, $setOnInsert: { usedSec: 0 } }, 'set');
      break;
    case 'add':
      write({ $inc: { capSec: sec }, $set: { updatedAt: now() }, $setOnInsert: { usedSec: 0 } }, 'add');
      break;
    case 'session-max':
      write({ $set: { sessionMaxSec: sec, updatedAt: now() }, $setOnInsert: { capSec: 0, usedSec: 0 } }, 'session-max');
      break;
    case 'idle-end':
      write({ $set: { idleEndSec: sec, updatedAt: now() }, $setOnInsert: { capSec: 0, usedSec: 0 } }, 'idle-end');
      break;
    default: print(`unknown command ${cmd}`);
  }
})();
