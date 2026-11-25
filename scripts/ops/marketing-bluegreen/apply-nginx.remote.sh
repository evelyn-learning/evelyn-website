# shellcheck shell=bash
# apply-nginx.remote.sh — the SERVER half of apply-nginx.sh. Piped after slot-lib.sh (for bg_upstream_conf) and a
# line defining NGINX_EDIT_PY (the text of nginx-edit.py). Never run by hand.
# One-time: creates the upstream file and routes the three marketing proxy_pass lines through it.
# Backs up first; `nginx -t` decides; on any failure the backups go back and nginx is not left reloaded on a bad file.

SITE1=$(readlink -f /etc/nginx/sites-enabled/evelynlearning)
SITE2=$(readlink -f /etc/nginx/sites-enabled/keystone.evelynlearning.com)
[ -f "$SITE1" ] && [ -f "$SITE2" ] || bg_die "site files not found ($SITE1, $SITE2)"
TS=$(date +%Y%m%d-%H%M%S)
BK="/root/nginx-backups/marketing-bluegreen-$TS"     # outside /etc/nginx: nothing there is ever included

wired=$(cat "$SITE1" "$SITE2" | grep -c "proxy_pass http://$BG_UPSTREAM;")
if [ "$wired" = "3" ] && [ -f "$BG_UPSTREAM_FILE" ]; then bg_say "already applied (3 proxy_pass lines go through $BG_UPSTREAM, $BG_UPSTREAM_FILE exists). Nothing done."; exit 0; fi
[ "$wired" = "0" ] || bg_die "half-applied state: $wired of 3 proxy_pass lines already go through $BG_UPSTREAM. Fix by hand."
[ ! -e "$BG_UPSTREAM_FILE" ] || bg_die "$BG_UPSTREAM_FILE exists but the site files do not use it. Fix by hand."
python3 -c "$NGINX_EDIT_PY" "$SITE1" 2 --check || bg_die "unexpected content in $SITE1"
python3 -c "$NGINX_EDIT_PY" "$SITE2" 1 --check || bg_die "unexpected content in $SITE2"
nginx -t 2>/dev/null || bg_die "nginx -t fails BEFORE any change: the config is already broken somewhere. Not touching it."

probe() { local c; c=$(curl -s -o /dev/null -m 15 -w '%{http_code}' --resolve "$1:443:127.0.0.1" "https://$1$2" 2>/dev/null); echo "${c:-000}"; }
b1=$(probe "www.evelynlearning.com" "/"); b2=$(probe "keystone.evelynlearning.com" "/login")
bg_say "before the change, through nginx: www / → $b1, keystone /login → $b2"

mkdir -p "$BK" && cp -p "$SITE1" "$BK/evelynlearning" && cp -p "$SITE2" "$BK/keystone.evelynlearning.com" || bg_die "backup failed; nothing changed"
bg_say "backups: $BK"

restore() {
  cp -p "$BK/evelynlearning" "$SITE1"; cp -p "$BK/keystone.evelynlearning.com" "$SITE2"; rm -f "$BG_UPSTREAM_FILE"
  if nginx -t 2>/dev/null; then bg_say "restored the backups (nginx -t passes on them)."; else bg_say "RESTORED THE BACKUPS BUT nginx -t STILL FAILS — look now: nginx -t"; fi
}

# Primary = whatever is live now (3001 unless a blue-green deploy already switched to b), backup = the other port.
ACTIVE=$(cat "$BG_STATE_DIR/.active-port" 2>/dev/null | tr -d '[:space:]'); ACTIVE=${ACTIVE:-$BG_PORT_A}
if [ "$ACTIVE" = "$BG_PORT_A" ]; then OTHER=$BG_PORT_B; else OTHER=$BG_PORT_A; fi
bg_upstream_conf "$ACTIVE" "$OTHER" > "$BG_UPSTREAM_FILE" && chmod 644 "$BG_UPSTREAM_FILE" || { restore; bg_die "could not write $BG_UPSTREAM_FILE"; }
python3 -c "$NGINX_EDIT_PY" "$SITE1" 2 && python3 -c "$NGINX_EDIT_PY" "$SITE2" 1 || { restore; bg_die "edit failed"; }

echo "──── applied diff ────"
diff -u "$BK/evelynlearning" "$SITE1"; diff -u "$BK/keystone.evelynlearning.com" "$SITE2"; echo "+++ $BG_UPSTREAM_FILE (new)"; cat "$BG_UPSTREAM_FILE"
echo "──────────────────────"

if ! nginx -t; then restore; bg_die "nginx -t failed on the edited files. Backups restored, nginx NOT reloaded."; fi
nginx -s reload || { restore; nginx -s reload; bg_die "reload failed. Backups restored."; }
sleep 2

# Through nginx on the real names: both must answer exactly as they did before the change.
c1=$(probe "www.evelynlearning.com" "/"); c2=$(probe "keystone.evelynlearning.com" "/login")
if [ "$c1" != "$b1" ] || [ "$c2" != "$b2" ] || [ "$c1" = "000" ] || [ "$c2" = "000" ]; then
  restore; nginx -s reload
  bg_die "after the reload: www / → $c1 (before: $b1), keystone /login → $c2 (before: $b2). Backups restored and nginx reloaded on them."
fi
bg_say "APPLIED. www / → $c1, keystone /login → $c2 (same as before). Upstream: primary :$ACTIVE, backup :$OTHER."
bg_say "To undo by hand:  cp -p $BK/evelynlearning $SITE1 && cp -p $BK/keystone.evelynlearning.com $SITE2 && rm $BG_UPSTREAM_FILE && nginx -t && nginx -s reload"
bg_say "Then update the repo mirrors: nginx/evelynlearning-live.conf, nginx/keystone-evelynlearning-live.conf (see README)."
