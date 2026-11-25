#!/bin/bash
# apply-nginx.sh — ONE-TIME nginx change for the marketing app's blue-green deploy. Run from the laptop, from the
# repo (worktree) root or anywhere: paths are taken from this file's place.
#
#   scripts/ops/marketing-bluegreen/apply-nginx.sh           show the diff against the LIVE files; change nothing
#   scripts/ops/marketing-bluegreen/apply-nginx.sh --yes     back up, apply, `nginx -t`, reload only if it passes,
#                                                            check both sites through nginx, restore on any failure
#
# What changes on the server (root@85.239.239.134):
#   /etc/nginx/conf.d/evelyn-marketing-upstream.conf   NEW: upstream evelyn_marketing { live port; other port backup }
#   /etc/nginx/sites-available/evelynlearning          2 × proxy_pass 127.0.0.1:3001 → evelyn_marketing (+ next_upstream)
#   /etc/nginx/sites-available/keystone.evelynlearning.com   1 × the same
# Backups: /root/nginx-backups/marketing-bluegreen-<timestamp>/ on the server.
# With only the single process running (today), behaviour is unchanged: the backup port has no listener and is
# only ever tried when a connect to :3001 is refused, which today is a 502 anyway.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
HOST="${BG_SSH_HOST:-root@85.239.239.134}"
SSH=(ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$HOST")

for f in slot-lib.sh apply-nginx.remote.sh nginx-edit.py; do [ -s "$HERE/$f" ] || { echo "missing $HERE/$f" >&2; exit 1; }; done

if [ "${1:-}" != "--yes" ]; then
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  mkdir -p "$TMP/live" "$TMP/new"
  # One read-only ssh for both files.
  "${SSH[@]}" 'cat /etc/nginx/sites-enabled/evelynlearning; echo "@@@@SPLIT@@@@"; cat /etc/nginx/sites-enabled/keystone.evelynlearning.com' > "$TMP/both" || { echo "could not read the live files" >&2; exit 1; }
  awk -v d="$TMP/live" 'BEGIN{f=d"/evelynlearning"} /^@@@@SPLIT@@@@$/{f=d"/keystone.evelynlearning.com"; next} {print > f}' "$TMP/both"
  cp "$TMP/live/"* "$TMP/new/"
  python3 "$HERE/nginx-edit.py" "$TMP/new/evelynlearning" 2 >/dev/null || { echo "the live evelynlearning file does not have exactly 2 marketing proxy_pass lines (already applied?)" >&2; exit 1; }
  python3 "$HERE/nginx-edit.py" "$TMP/new/keystone.evelynlearning.com" 1 >/dev/null || { echo "the live keystone file does not have exactly 1 marketing proxy_pass line (already applied?)" >&2; exit 1; }
  echo "DRY RUN — nothing changed. The diff against the live files as they are right now:"
  echo
  (cd "$TMP" && diff -u live/evelynlearning new/evelynlearning; diff -u live/keystone.evelynlearning.com new/keystone.evelynlearning.com)
  echo
  echo "+++ /etc/nginx/conf.d/evelyn-marketing-upstream.conf (new file; primary = the live port)"
  # shellcheck source=/dev/null
  (. "$HERE/slot-lib.sh"; bg_upstream_conf 3001 3021)
  echo
  echo "To apply:  $0 --yes"
  exit 0
fi

echo "Applying the nginx change on $HOST (backup → edit → nginx -t → reload → check → restore on failure)..."
{
  cat "$HERE/slot-lib.sh"
  echo "NGINX_EDIT_PY=\$(cat <<'NGINX_EDIT_PY_EOF'"
  cat "$HERE/nginx-edit.py"
  echo "NGINX_EDIT_PY_EOF"
  echo ")"
  cat "$HERE/apply-nginx.remote.sh"
} | "${SSH[@]}" "bash -c 'eval \"\$(cat)\"'"
