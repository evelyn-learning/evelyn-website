#!/bin/bash
# Partner minute pool — inspect and top up a partner's bank of wall-clock
# tutoring minutes (collection `partnerpools`, enforced by the tutor engine;
# spec docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md).
#
#   scripts/ops/partner-pool.sh show        <partner>             read-only
#   scripts/ops/partner-pool.sh set         <partner> <minutes>   cap = minutes (creates the pool)
#   scripts/ops/partner-pool.sh add         <partner> <minutes>   cap += minutes (top-up)
#   scripts/ops/partner-pool.sh session-max <partner> <minutes>   per-session wall-clock cap (default 15)
#   scripts/ops/partner-pool.sh idle-end    <partner> <minutes>   parked-standby end (default 30)
#
# ⚠️  127.0.0.1:2710 on this laptop is the PROD Mongo tunnel (US box). `show`
#     is a read; every other command WRITES PROD — run them only with
#     Praveen's go-ahead. Needs the tunnel: scripts/ops/mongo-tunnel.sh start
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMD="${1:-}"; PARTNER="${2:-}"; VALUE="${3:-}"
case "$CMD" in
  show|set|add|session-max|idle-end) ;;
  *) sed -n 2,14p "$0"; exit 1 ;;
esac
[ -n "$PARTNER" ] || { echo "partner slug required"; exit 1; }
if [ "$CMD" != "show" ]; then
  [[ "$VALUE" =~ ^[0-9]+([.][0-9]+)?$ ]] || { echo "minutes (a number) required"; exit 1; }
fi
MONGO_URI="${PARTNER_POOL_MONGO_URI:-mongodb://127.0.0.1:2710/evelyn?directConnection=true}"
exec mongosh "$MONGO_URI" --quiet --eval "const ARGS = { cmd: '$CMD', partner: '$PARTNER', value: '$VALUE' };" "$HERE/partner-pool.js"
