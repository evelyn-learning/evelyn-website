# shellcheck shell=bash
# slot-lib.sh — the SERVER-side functions of the marketing app's two-slot (blue-green) deploy.
#
# Never run by itself and never copied to the server: the caller pipes it, followed by its own main part, into
# `ssh root@host 'VAR=... bash -s'`. Two callers, on purpose the same code:
#   deploy-marketing.sh (MARKETING_BLUE_GREEN=1)  → slot-lib.sh + remote-deploy.sh, production values (the defaults below)
#   rehearse.sh                                    → slot-lib.sh + rehearse.remote.sh, throwaway names, ports and dirs
#
# The design, in one paragraph. Two slots: a = port 3001, b = port 3021. One is live, the other is not running.
# A deploy starts the new build in the idle slot, health-checks it on its own port, rewrites the one nginx upstream
# file so the new port is the primary and the old one its `backup`, reloads nginx (graceful), and only then stops
# the old process. Nothing is ever not listening: nginx workers from before the reload still try the old port
# first, get "connection refused" once it stops, and pass that same request to the backup, which is the new slot.
# A refused connect means no byte of the request was sent, so this is safe for a POST too (nginx retries a
# non-idempotent request only when nothing was sent, unless `non_idempotent` is set, and it is not).

BG_ROOT="${BG_ROOT:-/root/evelyn-marketing}"          # the workspace root on the server (node_modules lives here)
BG_APP="${BG_APP:-apps/marketing}"                    # the app dir under it: the process's cwd
BG_NAME="${BG_NAME:-evelyn-marketing}"                # pm2 names are $BG_NAME-a / $BG_NAME-b
BG_PORT_A="${BG_PORT_A:-3001}"
BG_PORT_B="${BG_PORT_B:-3021}"
# Where each slot's process runs and which build dir it reads. Production: one app dir, two build dirs.
# The rehearsal overrides these (two scratch app dirs, each with an ordinary .next).
BG_APPDIR_A="${BG_APPDIR_A:-$BG_ROOT/$BG_APP}"
BG_APPDIR_B="${BG_APPDIR_B:-$BG_ROOT/$BG_APP}"
BG_DIST_A="${BG_DIST_A:-.next-a}"
BG_DIST_B="${BG_DIST_B:-.next-b}"
BG_NEXT_BIN="${BG_NEXT_BIN:-../../node_modules/.bin/next}"   # relative to the app dir, as in the single-process deploy
BG_STATE_DIR="${BG_STATE_DIR:-$BG_ROOT}"              # holds .active-slot and .active-port
BG_UPSTREAM="${BG_UPSTREAM:-evelyn_marketing}"
BG_UPSTREAM_FILE="${BG_UPSTREAM_FILE:-/etc/nginx/conf.d/evelyn-marketing-upstream.conf}"
# The previous upstream file, kept for one step back. NOT inside conf.d and not ending in .conf: nginx includes conf.d/*.conf.
BG_UPSTREAM_PREV="${BG_UPSTREAM_PREV:-/etc/nginx/evelyn-marketing-upstream.prev}"
BG_KILL_TIMEOUT_MS="${BG_KILL_TIMEOUT_MS:-10000}"     # how long pm2 lets a stopping slot finish its requests
BG_HEALTH_SECS="${BG_HEALTH_SECS:-45}"
BG_HEALTH_PATH="${BG_HEALTH_PATH:-/}"                 # checked with no Host header: the marketing site
BG_HEALTH_HOST="${BG_HEALTH_HOST:-keystone.evelynlearning.com}"
BG_HEALTH_HOST_PATH="${BG_HEALTH_HOST_PATH:-/login}"  # checked with that Host header: Keystone's sign-in page
BG_CRON_GUARD_SEC="${BG_CRON_GUARD_SEC:-90}"          # 0 = off (the rehearsal, whose processes run no schedulers)
BG_EXTRA_ENV="${BG_EXTRA_ENV:-}"                      # extra VAR=value words for the started process (rehearsal only)

bg_say() { echo "[blue-green] $*"; }
bg_die() { echo "[blue-green] FATAL: $*" >&2; exit 1; }

bg_other() { if [ "$1" = "a" ]; then echo b; else echo a; fi; }
bg_port() { if [ "$1" = "a" ]; then echo "$BG_PORT_A"; else echo "$BG_PORT_B"; fi; }
bg_appdir() { if [ "$1" = "a" ]; then echo "$BG_APPDIR_A"; else echo "$BG_APPDIR_B"; fi; }
bg_dist() { if [ "$1" = "a" ]; then echo "$BG_DIST_A"; else echo "$BG_DIST_B"; fi; }
bg_pm2() { echo "$BG_NAME-$1"; }

# "a" or "b" from the state file; "legacy" when there is none yet (the single process `$BG_NAME` on port a, build dir .next).
bg_live() {
  local s
  s=$(cat "$BG_STATE_DIR/.active-slot" 2>/dev/null | tr -d '[:space:]')
  case "$s" in a|b) echo "$s" ;; "") echo legacy ;; *) bg_die "$BG_STATE_DIR/.active-slot holds '$s' (expected a or b)" ;; esac
}

# pm2's view of one process name: "<status> <restarts> <pid>", or "absent".
bg_pm2_state() {
  pm2 jlist 2>/dev/null | python3 -c '
import json, sys
name = sys.argv[1]
try:
    procs = json.load(sys.stdin)
except Exception:
    print("unknown"); sys.exit(0)
for p in procs:
    if p.get("name") == name:
        e = p.get("pm2_env", {})
        print(e.get("status", "?"), e.get("restart_time", 0), p.get("pid", 0)); break
else:
    print("absent")
' "$1"
}

bg_listening() { ss -ltnH 2>/dev/null | awk '{print $4}' | grep -Eq "[:.]$1\$"; }

# The whole upstream file. max_fails=0: a server is never marked "down". With marking on, one failed request to the
# live port would send every request to the (stopped) backup for fail_timeout. Without it each request simply
# tries the primary and, only if the connect fails, the backup. Between deploys the backup is never touched, so the
# stopped slot costs nothing and writes nothing to the error log. No `keepalive`: an idle connection the old
# process closes while nginx is writing a POST to it would be an error AFTER sending, which is not retried.
bg_upstream_conf() {
  cat <<EOF
# Written by the marketing blue-green deploy (scripts/ops/marketing-bluegreen). Do not edit by hand: the next
# deploy rewrites it. Primary = the live slot; backup = the other slot's port (running only during a deploy).
upstream $BG_UPSTREAM {
    server 127.0.0.1:$1 max_fails=0;
    server 127.0.0.1:$2 max_fails=0 backup;
}
EOF
}

# Point nginx at <primary port> (backup <other port>) and reload. On a failed `nginx -t` the previous file is put
# back and nothing is reloaded. Returns non-zero when nginx was NOT switched.
bg_nginx_point() {
  local primary=$1 backup=$2 tmp
  tmp=$(mktemp /tmp/.bg-upstream.XXXXXX) || return 1
  bg_upstream_conf "$primary" "$backup" > "$tmp"
  if [ -f "$BG_UPSTREAM_FILE" ]; then cp -p "$BG_UPSTREAM_FILE" "$BG_UPSTREAM_PREV" || { rm -f "$tmp"; return 1; }; fi
  chmod 644 "$tmp" && mv "$tmp" "$BG_UPSTREAM_FILE" || { rm -f "$tmp"; return 1; }
  if ! nginx -t 2>/tmp/.bg-nginx-t.$$; then
    cat /tmp/.bg-nginx-t.$$ >&2; rm -f /tmp/.bg-nginx-t.$$
    if [ -f "$BG_UPSTREAM_PREV" ]; then cp -p "$BG_UPSTREAM_PREV" "$BG_UPSTREAM_FILE"; else rm -f "$BG_UPSTREAM_FILE"; fi
    bg_say "nginx -t failed with the new upstream file; the previous one is back in place, nginx was not reloaded."
    return 1
  fi
  rm -f /tmp/.bg-nginx-t.$$
  nginx -s reload || { bg_say "nginx -s reload failed"; return 1; }
  return 0
}

# The three state files: .active-slot (a|b), .active-port (what cron and people read), .active-dist (the live
# build dir: the slot's own, except after a rollback onto the pre-blue-green build, which lives in .next).
bg_write_active() {
  local slot=$1 dist=${2:-$(bg_dist "$1")} f
  for f in slot port dist; do rm -f "$BG_STATE_DIR/.active-$f.tmp"; done
  printf '%s\n' "$dist" > "$BG_STATE_DIR/.active-dist.tmp" && mv "$BG_STATE_DIR/.active-dist.tmp" "$BG_STATE_DIR/.active-dist" || return 1
  printf '%s\n' "$(bg_port "$slot")" > "$BG_STATE_DIR/.active-port.tmp" && mv "$BG_STATE_DIR/.active-port.tmp" "$BG_STATE_DIR/.active-port" || return 1
  printf '%s\n' "$slot" > "$BG_STATE_DIR/.active-slot.tmp" && mv "$BG_STATE_DIR/.active-slot.tmp" "$BG_STATE_DIR/.active-slot"
}

# The live slot's build dir name.
bg_live_dist() {
  local d
  d=$(cat "$BG_STATE_DIR/.active-dist" 2>/dev/null | tr -d '[:space:]')
  if [ -n "$d" ]; then echo "$d"; else bg_dist "$1"; fi
}

# The in-process schedulers (src/instrumentation.ts) fire on the quarter-hours. While both slots are up each one
# would fire in both, and three of the four do not claim their work atomically (a blog post published twice, a
# second generated post, a reply recorded twice). So the idle slot is not started when a quarter-hour is closer
# than BG_CRON_GUARD_SEC: wait until just past it. The overlap (health check + switch + drain) is far shorter than
# the 15 minutes to the next one.
bg_cron_guard() {
  local now rem
  [ "${BG_CRON_GUARD_SEC:-0}" -gt 0 ] 2>/dev/null || return 0
  now=$(date +%s); rem=$((900 - now % 900))
  if [ "$rem" -lt "$BG_CRON_GUARD_SEC" ]; then
    bg_say "a quarter-hour is ${rem}s away (the in-process schedulers fire then): waiting $((rem + 8))s so they fire in one process only."
    sleep $((rem + 8))
  fi
}

# bg_start <slot> [build dir]   (the build dir defaults to the slot's own)
bg_start() {
  local slot=$1 name port dir dist
  name=$(bg_pm2 "$slot"); port=$(bg_port "$slot"); dir=$(bg_appdir "$slot"); dist=${2:-$(bg_dist "$slot")}
  [ -d "$dir/$dist" ] || { bg_say "no build at $dir/$dist"; return 1; }
  if bg_listening "$port"; then bg_say "port $port is already in use; not starting $name"; return 1; fi
  # NEXT_DIST_DIR is in the process's environment, so pm2 keeps it (pm2 save / resurrect after a reboot).
  # shellcheck disable=SC2086
  (cd "$dir" && env NEXT_DIST_DIR="$dist" $BG_EXTRA_ENV pm2 start "$BG_NEXT_BIN" --name "$name" --kill-timeout "$BG_KILL_TIMEOUT_MS" -- start -p "$port") >/dev/null \
    || { bg_say "pm2 start failed for $name"; return 1; }
  bg_say "started $name on :$port (build dir $dist)"
}

# 200 from both health URLs on the slot's own port, with the process online and never restarted, within BG_HEALTH_SECS.
bg_health() {
  local slot=$1 port name deadline c1 c2 st
  port=$(bg_port "$slot"); name=$(bg_pm2 "$slot"); deadline=$(( $(date +%s) + BG_HEALTH_SECS )); c1=000; c2=000
  while [ "$(date +%s)" -lt "$deadline" ]; do
    st=$(bg_pm2_state "$name")
    case "$st" in
      "online 0 "*) : ;;
      online*|errored*|stopped*|absent) bg_say "$name is not healthy under pm2 ($st)"; return 1 ;;
    esac
    c1=$(curl -s -o /dev/null -m 10 -w '%{http_code}' "http://127.0.0.1:$port$BG_HEALTH_PATH" 2>/dev/null); c1=${c1:-000}
    if [ "$c1" = "200" ]; then
      c2=$(curl -s -o /dev/null -m 10 -w '%{http_code}' -H "Host: $BG_HEALTH_HOST" "http://127.0.0.1:$port$BG_HEALTH_HOST_PATH" 2>/dev/null); c2=${c2:-000}
      if [ "$c2" = "200" ]; then bg_say "$name healthy on :$port ($BG_HEALTH_PATH 200, $BG_HEALTH_HOST$BG_HEALTH_HOST_PATH 200)"; return 0; fi
    fi
    sleep 1
  done
  bg_say "$name did not become healthy in ${BG_HEALTH_SECS}s (last: $BG_HEALTH_PATH $c1, $BG_HEALTH_HOST$BG_HEALTH_HOST_PATH $c2)"
  return 1
}

# pm2 delete sends SIGINT and waits up to the process's own kill timeout: `next start` stops accepting, finishes
# the requests it has, runs pending after() callbacks, exits.
bg_stop_name() {
  local name=$1
  [ "$(bg_pm2_state "$name")" = "absent" ] && return 0
  pm2 delete "$name" >/dev/null 2>&1 || { bg_say "pm2 delete $name failed"; return 1; }
  bg_say "stopped $name"
}

# Old pages keep working: the live build's script files are copied into the new build's static dir (never over an
# existing file; times kept, so the age prune below still sees their real age). Names carry a content hash.
bg_carry_static() {
  local from=$1 to=$2
  [ -d "$from" ] || { bg_say "no static files to carry forward from $from"; return 0; }
  mkdir -p "$to" && cp -a -n "$from/." "$to/" || return 1
  bg_say "carried the live build's static files forward: $from -> $to"
}
