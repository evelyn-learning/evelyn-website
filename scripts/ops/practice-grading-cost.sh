#!/bin/bash
# Evelyn-internal cost of free-response grading in partner Self Study
# (practicegradeusages, written by POST /api/portal/v1/grade since 2026-10-16).
# Same numbers as the engine's /admin/practice-grading page.
# Usage: scripts/ops/practice-grading-cost.sh [days=30] [partner]
# Needs the prod Mongo tunnel: ssh -f -N -L 2710:127.0.0.1:2710 root@85.239.239.134
set -euo pipefail
DAYS="${1:-30}"
PARTNER="${2:-}"
mongosh "mongodb://127.0.0.1:2710/evelyn?directConnection=true" --quiet --eval "
const DAYS = Number('$DAYS'), PARTNER = '$PARTNER';
const m = { createdAt: { \$gte: new Date(Date.now() - DAYS * 864e5) } };
if (PARTNER) m.partnerId = PARTNER;
const sums = {
  grades: { \$sum: 1 }, calls: { \$sum: '\$calls' },
  inTok: { \$sum: { \$add: ['\$inputTokens', '\$cacheReadTokens', '\$cacheCreationTokens'] } },
  outTok: { \$sum: '\$outputTokens' }, cost: { \$sum: '\$costUsd' },
};
const c = db.practicegradeusages;
function show(title, pipeline) {
  const rows = c.aggregate([{ \$match: m }, ...pipeline]).toArray();
  print('\n' + title);
  if (!rows.length) print('  (none yet)');
  for (const r of rows) {
    const id = typeof r._id === 'object' ? Object.values(r._id).join(' · ') : String(r._id);
    print('  ' + id.padEnd(44) + ' grades ' + String(r.grades).padStart(5) + '  calls ' + String(r.calls).padStart(5)
      + '  in ' + String(r.inTok).padStart(9) + '  out ' + String(r.outTok).padStart(8)
      + '  \$' + r.cost.toFixed(4) + '  (\$' + (r.cost / r.grades).toFixed(4) + '/grade)');
  }
}
show('By partner, last ' + DAYS + ' days', [{ \$group: { _id: '\$partnerId', ...sums } }, { \$sort: { cost: -1 } }]);
show('By day (UTC)', [{ \$group: { _id: { \$dateToString: { format: '%Y-%m-%d', date: '\$createdAt' } }, ...sums } }, { \$sort: { _id: -1 } }]);
show('Top students', [{ \$group: { _id: { p: '\$partnerId', s: '\$studentId' }, ...sums } }, { \$sort: { cost: -1 } }, { \$limit: 15 }]);
"
