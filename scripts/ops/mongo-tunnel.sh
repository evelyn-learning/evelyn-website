#!/usr/bin/env bash
# Prod Mongo tunnel (laptop :2710 → US box 127.0.0.1:2710) with keepalive and
# auto-restart.
#
# 2026-10-18: the plain `ssh -f -N -L 2710:…` tunnel dropped silently during a
# GDI local test (embed-1792361732296): the dev server ran the whole session
# with ECONNREFUSED on :2710 — no session row, no debug events, partner
# registry "unavailable" (401s on the profile), 30-s audio uploads. This keeps
# the forward alive (ServerAlive every 20 s, 3 misses → exit) and restarts it
# within 3 s whenever ssh exits.
#
# Usage:
#   scripts/ops/mongo-tunnel.sh start    # idempotent: no-op when :2710 already listens
#   scripts/ops/mongo-tunnel.sh status
#   scripts/ops/mongo-tunnel.sh stop     # stops the loop AND its ssh child, by PID only
#
# ⚠️ Anything on the laptop that talks to 127.0.0.1:2710 writes PROD.
set -euo pipefail
HOST="${MONGO_TUNNEL_HOST:-root@85.239.239.134}"
PORT=2710
STATE_DIR="$HOME/.evelyn"
PID_FILE="$STATE_DIR/mongo-tunnel.pid"
LOG_FILE="$STATE_DIR/mongo-tunnel.log"
mkdir -p "$STATE_DIR"

listening() { lsof -iTCP:$PORT -sTCP:LISTEN -n >/dev/null 2>&1; }
loop_alive() { [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; }

case "${1:-start}" in
  start)
    if loop_alive; then echo "tunnel loop already running (pid $(cat "$PID_FILE"))"; exit 0; fi
    if listening; then echo "something already listens on :$PORT (a plain tunnel?) — stop it first if you want the auto-restarting one"; exit 0; fi
    # 2026-10-21: two things locked us out of the box for ~10 min. (1) With the
    # host's ControlMaster in ~/.ssh/config, `ssh -N -L` became a mux client:
    # the master held the forward and the client exited 0 at once, so this loop
    # restarted it every 3 s all day (17k times) — harmless while the master
    # lived. (2) When the master died, each 3 s restart was a NEW TCP
    # connection: 10 per 30 s, past the box's `ufw limit` on port 22 (6 per
    # 30 s), which then REFUSED every attempt — including the retries that kept
    # the ban alive. So: no control master (a real ssh that exits only on a real
    # drop), and a 15 s back-off (at most 2 connections per 30 s).
    nohup bash -c '
      while true; do
        ssh -N -o ControlMaster=no -o ControlPath=none \
            -o ServerAliveInterval=20 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes \
            -o ConnectTimeout=10 -L '"$PORT"':127.0.0.1:'"$PORT"' '"$HOST"'
        echo "$(date -u +%FT%TZ) tunnel exited ($?), restarting in 15 s"
        sleep 15
      done' >>"$LOG_FILE" 2>&1 &
    echo $! >"$PID_FILE"
    for _ in 1 2 3 4 5 6 7 8 9 10; do listening && break; sleep 0.5; done
    if listening; then echo "tunnel up on :$PORT (loop pid $(cat "$PID_FILE"), log $LOG_FILE)"; else echo "tunnel NOT up yet — see $LOG_FILE"; exit 1; fi
    ;;
  status)
    if listening; then echo "listening on :$PORT"; else echo "NOT listening on :$PORT"; fi
    if loop_alive; then echo "loop pid $(cat "$PID_FILE") alive"; else echo "no auto-restart loop"; fi
    ;;
  stop)
    if loop_alive; then
      LOOP=$(cat "$PID_FILE")
      pkill -P "$LOOP" 2>/dev/null || true   # the ssh child, by parent pid
      kill "$LOOP" 2>/dev/null || true
      rm -f "$PID_FILE"
      echo "stopped loop $LOOP"
    else
      echo "no loop to stop"
    fi
    ;;
  *) echo "usage: $0 start|status|stop"; exit 2 ;;
esac
