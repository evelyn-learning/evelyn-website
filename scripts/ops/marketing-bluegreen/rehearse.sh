#!/bin/bash
# rehearse.sh — a rehearsal of the marketing blue-green switch on the production box that touches nothing live.
# Run from the laptop.
#
#   scripts/ops/marketing-bluegreen/rehearse.sh                  say what it would do; change nothing
#   scripts/ops/marketing-bluegreen/rehearse.sh --yes            run it (about 2 minutes)
#   scripts/ops/marketing-bluegreen/rehearse.sh --cleanup --yes  remove what an interrupted run left behind
#
# What it does on the server, with the SAME functions the real deploy uses (slot-lib.sh), under throwaway names:
#   1. copies the live build twice into /root/mk-rehearsal/{a,b} (plain copies: the live process's files are only read)
#   2. adds an nginx server block on 127.0.0.1:8931 (loopback only) with the same upstream + proxy_next_upstream
#      design as the production change, and reloads nginx (graceful)
#   3. starts pm2 `mk-rehearsal-a` on :3931 with the in-process schedulers switched off
#   4. sends a steady stream of GETs and POSTs through 127.0.0.1:8931
#   5. three "deploys": start the idle slot, health-check, switch nginx (reload), stop the old slot
#   6. the old-tab check: a script file only slot a has must still be served after slot a is gone
#   7. counts bad responses, removes everything, and prints a before/after comparison of pm2 and `nginx -T`
#
# It needs --yes because it reloads the production nginx five times (graceful: connections in progress are kept)
# and starts two extra Node processes (about 350 MB each) for two minutes. It never runs `pm2 save`, never touches
# the live process, its dirs, its port, its nginx files or the crontab. Its pages read production MongoDB.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
HOST="${BG_SSH_HOST:-root@85.239.239.134}"
MODE=run; YES=0
for a in "$@"; do case "$a" in --yes) YES=1 ;; --cleanup) MODE=cleanup ;; *) echo "unknown argument: $a" >&2; exit 2 ;; esac; done
for f in rehearse.config.sh slot-lib.sh rehearse.remote.sh; do [ -s "$HERE/$f" ] || { echo "missing $HERE/$f" >&2; exit 1; }; done

if [ "$YES" != "1" ]; then
  sed -n '2,24p' "$0" | sed 's/^# \{0,1\}//'
  echo
  echo "Nothing was done. Add --yes to run it."
  exit 0
fi

cat "$HERE/rehearse.config.sh" "$HERE/slot-lib.sh" "$HERE/rehearse.remote.sh" \
  | ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=10 "$HOST" "RH_MODE=$MODE bash -c 'eval \"\$(cat)\"'"
