# shellcheck shell=bash
# rehearse.remote.sh — the SERVER half of rehearse.sh. Piped after rehearse.config.sh and slot-lib.sh; never run by
# hand. RH_MODE = run | cleanup (given by rehearse.sh).
#
# Touches, and removes again: $RH_ROOT, pm2 processes mk-rehearsal-a/-b (never `pm2 save`), two nginx files in
# conf.d (mk-rehearsal-*.conf), $RH_ACCESS_LOG. nginx is reloaded gracefully: once to add the throwaway block,
# once per simulated deploy (3), once to remove it. The failover step writes a few hundred "Connection refused"
# lines naming :3931/:3932 to /var/log/nginx/error.log; they stay there.
# Reads, never writes: the live app dir (the build and .env.local are copied out), the live node_modules (through
# a symlink), production MongoDB (the two health pages render from it).

[ "$BG_ROOT" = "/root/mk-rehearsal" ] && [ "$BG_NAME" = "mk-rehearsal" ] || bg_die "rehearsal config not loaded (BG_ROOT=$BG_ROOT, BG_NAME=$BG_NAME): refusing to run with production values."
case "$BG_UPSTREAM_FILE$RH_SERVER_FILE" in *evelyn-marketing*) bg_die "rehearsal nginx files point at production names." ;; esac

LOOP_PIDS=""
rh_cleanup() {
  local p
  rm -f "$RH_ROOT/.loops-on" 2>/dev/null
  for p in $LOOP_PIDS; do kill "$p" 2>/dev/null; done
  bg_stop_name "$(bg_pm2 a)" >/dev/null 2>&1; bg_stop_name "$(bg_pm2 b)" >/dev/null 2>&1
  if [ -e "$BG_UPSTREAM_FILE" ] || [ -e "$RH_SERVER_FILE" ]; then
    rm -f "$BG_UPSTREAM_FILE" "$RH_SERVER_FILE"
    if nginx -t 2>/dev/null; then nginx -s reload; else echo "[rehearsal] nginx -t FAILS after removing the rehearsal files — look now: nginx -t" >&2; fi
    sleep 1
  fi
  rm -f "$RH_ACCESS_LOG" /root/.pm2/logs/mk-rehearsal-[ab]-out*.log /root/.pm2/logs/mk-rehearsal-[ab]-error*.log
  case "$RH_ROOT" in /root/mk-rehearsal) rm -rf "$RH_ROOT" ;; esac
}

rh_snapshot() {   # rh_snapshot <before|after>
  pm2 jlist 2>/dev/null | python3 -c '
import json, sys
for p in sorted(json.load(sys.stdin), key=lambda p: p.get("name", "")):
    e = p.get("pm2_env", {})
    print(p.get("name"), p.get("pid"), e.get("status"), e.get("restart_time"), e.get("pm_exec_path"), e.get("args"), e.get("pm_cwd"), e.get("kill_timeout"))
' > "$RH_SNAP.$1.pm2"
  nginx -T 2>/dev/null > "$RH_SNAP.$1.nginx"
  md5sum /root/.pm2/dump.pm2 2>/dev/null | cut -d' ' -f1 > "$RH_SNAP.$1.dump"
}

if [ "${RH_MODE:-}" = "cleanup" ]; then
  echo "[rehearsal] cleanup only: removing whatever an interrupted rehearsal left."
  rh_cleanup
  pm2 jlist 2>/dev/null | python3 -c 'import json,sys; print("[rehearsal] pm2 processes named mk-rehearsal-*:", [p["name"] for p in json.load(sys.stdin) if p["name"].startswith("mk-rehearsal")] or "none")'
  echo "[rehearsal] nginx files left: $(ls /etc/nginx/conf.d/mk-rehearsal-* 2>/dev/null | tr '\n' ' ')(none expected); scratch dir: $([ -e "$RH_ROOT" ] && echo STILL THERE || echo gone)"
  rm -f "$RH_SNAP".*
  exit 0
fi
[ "${RH_MODE:-}" = "run" ] || bg_die "RH_MODE must be run or cleanup"

# ── 0. Refuse unless everything the rehearsal uses is free. ──────────────────────────────────────────────────
[ ! -e "$RH_ROOT" ] || bg_die "$RH_ROOT exists (an earlier rehearsal did not finish?). Run: rehearse.sh --cleanup --yes"
[ ! -e "$BG_UPSTREAM_FILE" ] && [ ! -e "$RH_SERVER_FILE" ] || bg_die "rehearsal nginx files exist. Run: rehearse.sh --cleanup --yes"
for p in "$BG_PORT_A" "$BG_PORT_B" "$RH_NGINX_PORT"; do if bg_listening "$p"; then bg_die "port $p is in use. Pick other ports in rehearse.config.sh."; fi; done
[ "$(bg_pm2_state "$(bg_pm2 a)")" = "absent" ] && [ "$(bg_pm2_state "$(bg_pm2 b)")" = "absent" ] || bg_die "pm2 already has a mk-rehearsal process. Run: rehearse.sh --cleanup --yes"
nginx -t 2>/dev/null || bg_die "nginx -t fails before the rehearsal starts. Not touching nginx."
SRC_DIST=$(cat "$RH_SRC_ROOT/.active-dist" 2>/dev/null | tr -d '[:space:]'); SRC_DIST=${SRC_DIST:-.next}
[ -f "$RH_SRC_APP/$SRC_DIST/BUILD_ID" ] || bg_die "no live build at $RH_SRC_APP/$SRC_DIST"
need_kb=$(( $(du -sk --exclude=cache --exclude=dev "$RH_SRC_APP/$SRC_DIST" | cut -f1) * 2 + 1048576 ))
free_kb=$(df -k --output=avail /root | tail -1 | tr -d ' ')
[ "$free_kb" -gt "$need_kb" ] || bg_die "not enough free disk for two copies of the build (${need_kb} kB needed)"

rh_snapshot before
trap 'exit 129' HUP INT TERM
trap rh_cleanup EXIT
ERR_LOG_START=$(wc -l < /var/log/nginx/error.log 2>/dev/null || echo 0)

# ── 1. Two scratch copies of the live build. ─────────────────────────────────────────────────────────────────
echo "[rehearsal] copying the live build ($SRC_DIST, build $(cat "$RH_SRC_APP/$SRC_DIST/BUILD_ID")) into $RH_ROOT/a and /b ..."
for s in a b; do
  d="$RH_ROOT/$s/apps/marketing"
  mkdir -p "$d" || bg_die "mkdir $d"
  rsync -a --exclude 'cache/' --exclude 'dev/' "$RH_SRC_APP/$SRC_DIST/" "$d/.next/" || bg_die "copy failed"
  for f in next.config.ts package.json tsconfig.json .env .env.local; do [ -f "$RH_SRC_APP/$f" ] && cp -p "$RH_SRC_APP/$f" "$d/$f"; done
  [ -f "$RH_SRC_ROOT/tsconfig.base.json" ] && cp -p "$RH_SRC_ROOT/tsconfig.base.json" "$RH_ROOT/$s/tsconfig.base.json"
  ln -s "$RH_SRC_ROOT/node_modules" "$RH_ROOT/$s/node_modules" || bg_die "symlink failed"
done
# "Old tab" marker: a script file only slot a's build has. After deploy 1 it must be served by slot b.
MARKER="mk-rehearsal-oldtab-$(date +%s).js"
echo "/* only in slot a */" > "$BG_APPDIR_A/.next/static/chunks/$MARKER"

# ── 2. The throwaway nginx block: same upstream shape and next_upstream lines as the production change. ──────
bg_upstream_conf "$BG_PORT_A" "$BG_PORT_B" > "$BG_UPSTREAM_FILE"
cat > "$RH_SERVER_FILE" <<NGX
# Throwaway: marketing blue-green rehearsal. Removed by the rehearsal itself. Loopback only.
server {
    listen 127.0.0.1:$RH_NGINX_PORT;
    server_name mk-rehearsal.invalid;
    access_log $RH_ACCESS_LOG;
    client_max_body_size 200M;
    location / {
        proxy_pass http://$BG_UPSTREAM;
        proxy_next_upstream error timeout;
        proxy_next_upstream_tries 2;
        proxy_http_version 1.1;
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 300;
        proxy_request_buffering off;
    }
}
NGX
nginx -t 2>"$RH_ROOT/nginx-t.out" || { cat "$RH_ROOT/nginx-t.out" >&2; bg_die "nginx -t fails with the rehearsal block (removed again on exit)."; }
nginx -s reload || bg_die "nginx reload failed"
sleep 1

# ── 3. Slot a up, as "the live build". ───────────────────────────────────────────────────────────────────────
bg_start a || bg_die "could not start slot a"
bg_health a || { pm2 logs "$(bg_pm2 a)" --nostream --lines 30 2>/dev/null | tail -n 40; bg_die "slot a not healthy"; }
bg_write_active a
LIVE=a

# What a page loaded from slot a holds: one of its script files, and the server-action ids of its build.
KS_HOST="$BG_HEALTH_HOST"
CHUNK=$(curl -s -m 15 -H "Host: $KS_HOST" "http://127.0.0.1:$BG_PORT_A$BG_HEALTH_HOST_PATH" | grep -oE '/_next/static/chunks/[A-Za-z0-9._~-]+\.js' | head -1)
[ -n "$CHUNK" ] || echo "[rehearsal] WARN: no script URL found in slot a's $BG_HEALTH_HOST_PATH page (old-tab chunk check will use the marker only)"

# ── 4. Traffic through the throwaway nginx port for the whole run. ───────────────────────────────────────────
: > "$RH_ROOT/.loops-on"
rh_loop() {   # rh_loop <name> <curl args...>   one line per request: "<epoch> <code>"
  local name=$1; shift
  while [ -e "$RH_ROOT/.loops-on" ]; do
    echo "$(date +%s) $(curl -s -o /dev/null -m 20 -w '%{http_code}' "$@" 2>/dev/null)" >> "$RH_ROOT/loop.$name"
    sleep 0.05
  done
}
N="http://127.0.0.1:$RH_NGINX_PORT"
rh_loop get-home "$N$BG_HEALTH_PATH" & LOOP_PIDS="$LOOP_PIDS $!"
rh_loop get-keystone -H "Host: $KS_HOST" "$N$BG_HEALTH_HOST_PATH" & LOOP_PIDS="$LOOP_PIDS $!"
rh_loop get-keystone-2 -H "Host: $KS_HOST" "$N$BG_HEALTH_HOST_PATH" & LOOP_PIDS="$LOOP_PIDS $!"
# A POST with a body that changes nothing: the cron route answers 404 to a call without its secret, before any work.
rh_loop post -X POST -H "Host: $KS_HOST" -H 'Content-Type: application/x-www-form-urlencoded' --data 'rehearsal=1&pad=0123456789012345678901234567890123456789' "$N/api/keystone/cron/release" & LOOP_PIDS="$LOOP_PIDS $!"
rh_loop post-2 -X POST -H "Host: $KS_HOST" -H 'Content-Type: application/x-www-form-urlencoded' --data 'rehearsal=1&pad=0123456789012345678901234567890123456789' "$N/api/keystone/cron/release" & LOOP_PIDS="$LOOP_PIDS $!"
sleep 5

# ── 5. Three simulated deploys, with the same functions the real deploy uses. ────────────────────────────────
OLDTAB="not run"
for i in 1 2 3; do
  IDLE=$(bg_other "$LIVE")
  echo "[rehearsal] ── deploy $i: slot $LIVE (:$(bg_port "$LIVE")) → slot $IDLE (:$(bg_port "$IDLE")) ── $(date +%H:%M:%S)"
  if [ "$i" = "1" ]; then bg_carry_static "$(bg_appdir "$LIVE")/.next/static" "$(bg_appdir "$IDLE")/.next/static" || bg_die "carry-forward failed"; fi
  bg_start "$IDLE" || bg_die "deploy $i: could not start slot $IDLE"
  bg_health "$IDLE" || bg_die "deploy $i: slot $IDLE not healthy"
  bg_nginx_point "$(bg_port "$IDLE")" "$(bg_port "$LIVE")" || bg_die "deploy $i: nginx switch failed"
  bg_write_active "$IDLE"
  sleep 2
  bg_stop_name "$(bg_pm2 "$LIVE")" || bg_die "deploy $i: could not stop slot $LIVE"
  LIVE=$IDLE
  sleep 4
  if [ "$i" = "1" ]; then
    # The old tab: slot a is gone; its script files and its action ids must still be there.
    m=$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$N/_next/static/chunks/$MARKER")
    c="n/a"; [ -n "$CHUNK" ] && c=$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$N$CHUNK")
    ids=$(python3 - "$BG_APPDIR_A/.next/server/server-reference-manifest.json" "$BG_APPDIR_B/.next/server/server-reference-manifest.json" <<'PY'
import json, sys
def ids(p):
    m = json.load(open(p)); return set(m.get("node", {})) | set(m.get("edge", {}))
try:
    a, b = ids(sys.argv[1]), ids(sys.argv[2])
    print(f"{len(a & b)}/{len(a)}")
except Exception as e:
    print(f"unreadable ({e})")
PY
)
    OLDTAB="marker file only slot a had, served by slot b: $m (want 200) | a script URL from slot a's page ($CHUNK): $c (want 200) | slot a's action ids present in slot b: $ids (want all)"
    echo "[rehearsal] old tab: $OLDTAB"
  fi
done

# ── 5b. The safety net by itself: the live slot dies while nginx still names it as primary. ──────────────────
# This is what an nginx worker from before a reload sees once the old slot stops, and what a crash of the live
# slot during a deploy would look like: every request is refused on the primary and must be answered by the
# backup, POSTs included. No nginx change in this step.
OTHER=$(bg_other "$LIVE")
echo "[rehearsal] ── failover: slot $OTHER up as backup, then slot $LIVE (the primary) stopped with nginx unchanged ── $(date +%H:%M:%S)"
bg_start "$OTHER" || bg_die "failover: could not start slot $OTHER"
bg_health "$OTHER" || bg_die "failover: slot $OTHER not healthy"
bg_stop_name "$(bg_pm2 "$LIVE")" || bg_die "failover: could not stop slot $LIVE"
sleep 4
rm -f "$RH_ROOT/.loops-on"; sleep 1
for p in $LOOP_PIDS; do kill "$p" 2>/dev/null; done; LOOP_PIDS=""

# ── 6. Tally. A GET must be 2xx/3xx; the POST must be the route's own 404 (anything else came from nginx or a dead port). ──
echo
echo "[rehearsal] ════ RESULT ════"
BAD=0
for f in "$RH_ROOT"/loop.*; do
  name=${f##*/loop.}
  total=$(wc -l < "$f" | tr -d ' ')
  case "$name" in post*) bad=$(awk '$2 != "404"' "$f" | wc -l | tr -d ' ') ;; *) bad=$(awk '$2 !~ /^[23][0-9][0-9]$/' "$f" | wc -l | tr -d ' ') ;; esac
  echo "[rehearsal] $name: $total requests, by status: $(awk '{print $2}' "$f" | sort | uniq -c | awk '{printf "%s×%s ", $2, $1}') → $bad bad"
  BAD=$((BAD + bad))
done
REFUSED=$(tail -n +"$((ERR_LOG_START + 1))" /var/log/nginx/error.log 2>/dev/null | grep -cE "Connection refused.*127\.0\.0\.1:(${BG_PORT_A}|${BG_PORT_B})")
echo "[rehearsal] requests nginx first sent to a stopped slot and passed on to the other one (error.log 'Connection refused' lines for :$BG_PORT_A/:$BG_PORT_B): $REFUSED"
echo "[rehearsal] old tab: $OLDTAB"
case "$OLDTAB" in *"served by slot b: 200"*) : ;; *) BAD=$((BAD + 1)); echo "[rehearsal] old-tab check did not pass" ;; esac
if [ "$REFUSED" = "0" ]; then BAD=$((BAD + 1)); echo "[rehearsal] the failover step produced no refused-then-passed-on request: the backup path was NOT exercised"; fi

# ── 7. Remove everything, then prove nothing is left. ────────────────────────────────────────────────────────
trap - EXIT
rh_cleanup
rh_snapshot after
echo
SAME=1
for k in pm2 nginx dump; do
  if cmp -s "$RH_SNAP.before.$k" "$RH_SNAP.after.$k"; then echo "[rehearsal] before/after $k: IDENTICAL"; else SAME=0; echo "[rehearsal] before/after $k: DIFFERENT:"; diff "$RH_SNAP.before.$k" "$RH_SNAP.after.$k" | head -40; fi
done
echo "[rehearsal]   (pm2 = name, pid, status, restarts, script, args, cwd, kill timeout of every process; nginx = full \`nginx -T\`; dump = md5 of ~/.pm2/dump.pm2)"
rm -f "$RH_SNAP".*
echo
if [ "$BAD" = "0" ] && [ "$SAME" = "1" ]; then echo "[rehearsal] PASS: 0 bad responses through 3 switches; server left as it was."; exit 0; fi
echo "[rehearsal] FAIL: $BAD bad response(s); server state identical: $([ "$SAME" = 1 ] && echo yes || echo NO)."
exit 1
