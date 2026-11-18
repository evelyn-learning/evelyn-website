#!/usr/bin/env bash
# Local Crimsora, for testing a tutor-engine worktree through the real site WITHOUT deploying:
#   engine = an evelynlearning worktree, `next dev` on :3019 (hot reload; development, so the v2 flag bar —
#            flag + snapshot — is on; flags are saved under <engine>/.v2-flags/<session>/)
#   api    = academy worktree crimsora-local, apps/api on :4025, LOCAL_STACK=1 (no background jobs, no report mail)
#   web    = academy worktree crimsora-local, apps/web `next dev` on :3023
#   env    = academy/.claude/worktrees/crimsora-local/.env.crimsora-local: a copy of .env.crimsora.production with
#            local URLs and the LOCAL engine's embed secret (git-ignored; rebuild it if the production env changes)
# ⚠️ Data is the LIVE crimsora + evelyn databases through the prod tunnel (:2710): you sign in with your real
#    Crimsora account, and sessions, progress and practice are written to it.
# Usage: crimsora-local.sh start | stop | status | logs        (ENG=<engine apps/tutor dir> to use another worktree)
set -uo pipefail
ENG="${ENG:-/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-v2-close-chips-money/apps/tutor}"
ACA=/Users/luke/Dev/academy/.claude/worktrees/crimsora-local
D="$HOME/.evelyn/crimsora-local"; mkdir -p "$D"
listening() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
killtree() { [ -f "$D/$1.pid" ] || return 0; local p; p=$(cat "$D/$1.pid"); pkill -P "$p" 2>/dev/null; kill "$p" 2>/dev/null; rm -f "$D/$1.pid"; }
case "${1:-status}" in
  start)
    listening 2710 || { echo "prod tunnel not up — run scripts/ops/mongo-tunnel.sh start"; exit 1; }
    [ -f "$ACA/.env.crimsora-local" ] || { echo "missing $ACA/.env.crimsora-local"; exit 1; }
    if listening 3019; then echo "engine already on :3019"; else
      (cd "$ENG" && nohup npx next dev --turbopack -p 3019 >>"$D/engine.log" 2>&1 & echo $! >"$D/engine.pid"); fi
    if listening 4025; then echo "api already on :4025"; else
      (cd "$ACA" && set -a && . ./.env.crimsora-local && set +a && nohup npx tsx apps/api/src/index.ts >>"$D/api.log" 2>&1 & echo $! >"$D/api.pid"); fi
    if listening 3023; then echo "web already on :3023"; else
      (cd "$ACA/apps/web" && set -a && . ../../.env.crimsora-local && set +a && nohup npx next dev -p 3023 >>"$D/web.log" 2>&1 & echo $! >"$D/web.pid"); fi
    for i in $(seq 1 90); do listening 3019 && listening 4025 && listening 3023 && break; sleep 1; done
    "$0" status; echo; echo "Test at: http://localhost:3023  (sign in with your Crimsora account)";;
  stop) for n in engine api web; do killtree $n; done; sleep 1; "$0" status;;
  status) for pp in engine:3019 api:4025 web:3023 tunnel:2710; do n=${pp%%:*}; p=${pp##*:}; if listening "$p"; then echo "$n :$p up"; else echo "$n :$p DOWN"; fi; done;;
  logs) tail -n 20 "$D"/engine.log "$D"/api.log "$D"/web.log;;
  *) echo "usage: $0 start|stop|status|logs"; exit 1;;
esac
