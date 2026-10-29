#!/usr/bin/env bash
# Local GAC (GreenApple) stack for testing the gac-29oct release WITHOUT deploying:
#   engine  = evelynlearning worktree gac-29oct, `next dev` on :3007 (hot reload),
#             GAC env overrides as in deploy-tutor-gac.sh
#   api     = academy worktree gac-29oct, apps/api on :4015 (restart after api code changes)
#   web     = academy worktree gac-29oct, apps/web `next dev` on :3016 (hot reload)
#   env     = academy/.claude/worktrees/gac-29oct/.env.gac-local (copy of .env.greenapple.production with local URLs)
# ⚠️ Data is the LIVE greenapple + evelyn DBs through the prod tunnel (:2710) — sessions show up in the
#    real GAC admin. The tunnel must be up: scripts/ops/mongo-tunnel.sh start
# 2026-10-20: the engine worktree's root .env.local was a stale copy (no PORTAL_SECRET_ENC_KEY → every
#    partner call 401); it is now a symlink to the main checkout's .env.local.
# Usage: gac-local.sh start | stop | status | logs
set -uo pipefail
ENG=/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor
ACA=/Users/luke/Dev/academy/.claude/worktrees/gac-29oct
D="$HOME/.evelyn/gac-local"; mkdir -p "$D"
listening() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
killtree() { [ -f "$D/$1.pid" ] || return 0; local p; p=$(cat "$D/$1.pid"); pkill -P "$p" 2>/dev/null; kill "$p" 2>/dev/null; rm -f "$D/$1.pid"; }
case "${1:-status}" in
  start)
    listening 2710 || { echo "prod tunnel not up — run scripts/ops/mongo-tunnel.sh start"; exit 1; }
    [ -f "$ACA/.env.gac-local" ] || { echo "missing $ACA/.env.gac-local"; exit 1; }
    if listening 3007; then echo "engine already on :3007"; else
      (cd "$ENG" && ENABLE_LEARNER_MODEL_SNAPSHOT=false PRACTICE_DRAWN_ANSWER_PARTNERS=greenapple nohup npm run dev >>"$D/engine.log" 2>&1 & echo $! >"$D/engine.pid"); fi
    if listening 4015; then echo "api already on :4015"; else
      (cd "$ACA" && set -a && . ./.env.gac-local && set +a && nohup npx tsx apps/api/src/index.ts >>"$D/api.log" 2>&1 & echo $! >"$D/api.pid"); fi
    if listening 3016; then echo "web already on :3016"; else
      (cd "$ACA/apps/web" && set -a && . ../../.env.gac-local && set +a && nohup npx next dev -p 3016 >>"$D/web.log" 2>&1 & echo $! >"$D/web.pid"); fi
    for i in $(seq 1 60); do listening 3007 && listening 4015 && listening 3016 && break; sleep 1; done
    "$0" status; echo; echo "Test at: http://localhost:3016  (sign in as the GAC test student)";;
  stop) for n in engine api web; do killtree $n; done; sleep 1; "$0" status;;
  status) for pp in engine:3007 api:4015 web:3016 tunnel:2710; do n=${pp%%:*}; p=${pp##*:}; if listening "$p"; then echo "$n :$p up"; else echo "$n :$p DOWN"; fi; done;;
  logs) tail -n 20 "$D"/engine.log "$D"/api.log "$D"/web.log;;
  *) echo "usage: $0 start|stop|status|logs"; exit 1;;
esac
