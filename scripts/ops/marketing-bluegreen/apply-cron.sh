#!/bin/bash
# apply-cron.sh — ONE-TIME change to root's crontab on the server for the marketing app's blue-green deploy.
#
# The two Keystone cron lines call the app on 127.0.0.1:3001 directly. With two slots the live port is 3001 or
# 3021, written by each deploy to /root/evelyn-marketing/.active-port. The lines are changed to read it:
#
#   http://127.0.0.1:3001/api/keystone/cron/...
#     →  http://127.0.0.1:$(cat /root/evelyn-marketing/.active-port 2>/dev/null || echo 3001)/api/keystone/cron/...
#
# No file yet (before the first blue-green deploy) means 3001, so this can be applied at any time beforehand.
# cron runs each line with /bin/sh, where $(...) works; the lines contain no % (which cron would treat specially).
#
#   scripts/ops/marketing-bluegreen/apply-cron.sh          show the diff; change nothing
#   scripts/ops/marketing-bluegreen/apply-cron.sh --yes    back up to /root/crontab-backups/, install, show the result
set -u
HOST="${BG_SSH_HOST:-root@85.239.239.134}"
SSH=(ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$HOST")
OLD='http://127.0.0.1:3001/api/keystone/cron/'
NEW='http://127.0.0.1:$(cat /root/evelyn-marketing/.active-port 2>/dev/null || echo 3001)/api/keystone/cron/'

if [ "${1:-}" != "--yes" ]; then
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  "${SSH[@]}" 'crontab -l' > "$TMP/crontab.live" || { echo "could not read the crontab" >&2; exit 1; }
  n=$(grep -cF "$OLD" "$TMP/crontab.live")
  if [ "$n" != "2" ]; then echo "expected 2 lines calling $OLD, found $n (already applied?). Nothing to show." >&2; exit 1; fi
  OLD="$OLD" NEW="$NEW" python3 -c 'import os,sys; sys.stdout.write(sys.stdin.read().replace(os.environ["OLD"], os.environ["NEW"]))' < "$TMP/crontab.live" > "$TMP/crontab.new"
  echo "DRY RUN — nothing changed. The diff against root's live crontab:"
  echo
  (cd "$TMP" && diff -u crontab.live crontab.new)
  echo
  echo "To apply:  $0 --yes"
  exit 0
fi

# The replacement is done ON the server, on the crontab as it is at that moment (not on a copy fetched earlier).
"${SSH[@]}" "bash -c 'eval \"\$(cat)\"'" <<'REMOTE'
set -u
OLD='http://127.0.0.1:3001/api/keystone/cron/'
NEW='http://127.0.0.1:$(cat /root/evelyn-marketing/.active-port 2>/dev/null || echo 3001)/api/keystone/cron/'
TS=$(date +%Y%m%d-%H%M%S); BK=/root/crontab-backups; mkdir -p "$BK" || exit 1
crontab -l > "$BK/crontab.$TS" || { echo "could not read the crontab"; exit 1; }
n=$(grep -cF "$OLD" "$BK/crontab.$TS")
if [ "$n" != "2" ]; then echo "expected 2 lines calling $OLD, found $n (already applied?). Nothing changed."; rm -f "$BK/crontab.$TS"; exit 1; fi
OLD="$OLD" NEW="$NEW" python3 -c 'import os,sys; sys.stdout.write(sys.stdin.read().replace(os.environ["OLD"], os.environ["NEW"]))' < "$BK/crontab.$TS" > "$BK/crontab.$TS.new" || exit 1
[ "$(wc -l < "$BK/crontab.$TS")" = "$(wc -l < "$BK/crontab.$TS.new")" ] || { echo "line count changed; not installing"; exit 1; }
diff -u "$BK/crontab.$TS" "$BK/crontab.$TS.new"
crontab "$BK/crontab.$TS.new" || { echo "crontab install failed; the old one is still in place"; exit 1; }
echo "installed. Backup: $BK/crontab.$TS    Undo: crontab $BK/crontab.$TS"
echo "the two lines now:"; crontab -l | grep -F '/api/keystone/cron/'
echo "the port they resolve to right now: $(cat /root/evelyn-marketing/.active-port 2>/dev/null || echo 3001)"
REMOTE
