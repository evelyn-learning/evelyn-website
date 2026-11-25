# shellcheck shell=bash
# remote-deploy.sh — the SERVER half of a blue-green marketing deploy. Piped to the server after slot-lib.sh by
# deploy-marketing.sh (MARKETING_BLUE_GREEN=1); never run by hand. Needs from the caller's environment:
#   BG_TARGET      the slot the build was made for (a|b): must still be the idle one
#   BG_ZIP         the uploaded archive's name, inside $BG_ROOT
#   BG_LOCK_HASH   hash of package-lock.json (npm ci runs only when it changed)
#   BG_TMP_TAG     suffix for /tmp scratch files
#   BG_STATIC_KEEP_DAYS
# What it leaves alone on any failure before the switch: the live process, its build dir, nginx, the state files.

cd "$BG_ROOT" || bg_die "no $BG_ROOT"
[ -n "${BG_TARGET:-}" ] && [ -n "${BG_ZIP:-}" ] && [ -n "${BG_LOCK_HASH:-}" ] && [ -n "${BG_TMP_TAG:-}" ] || bg_die "BG_TARGET / BG_ZIP / BG_LOCK_HASH / BG_TMP_TAG not all given"
KEEP_DAYS="${BG_STATIC_KEEP_DAYS:-7}"

# ── 1. Which slot is live, and is the build for the other one? ───────────────────────────────────────────────
LIVE=$(bg_live)
if [ "$LIVE" = "legacy" ]; then
  # First blue-green deploy. Today's single process counts as slot a: same port (3001), build dir .next.
  LIVE_NAME="$BG_NAME"; LIVE_DIST=".next"; LIVE_PORT="$BG_PORT_A"; IDLE=b
  case "$(bg_pm2_state "$LIVE_NAME")" in online*) : ;; *) bg_die "no state file and pm2 process $LIVE_NAME is not online: nothing known to be live. Fix by hand (see the README, 'First deploy')." ;; esac
else
  LIVE_NAME=$(bg_pm2 "$LIVE"); LIVE_DIST=$(bg_live_dist "$LIVE"); LIVE_PORT=$(bg_port "$LIVE"); IDLE=$(bg_other "$LIVE")
  case "$(bg_pm2_state "$LIVE_NAME")" in online*) : ;; *) bg_die "the state file says slot $LIVE is live but pm2 process $LIVE_NAME is not online." ;; esac
fi
[ "$LIVE_DIST" != "$(bg_dist "$IDLE")" ] || bg_die "the live build dir ($LIVE_DIST) is the idle slot's build dir: refusing to delete it."
[ "$IDLE" = "$BG_TARGET" ] || bg_die "the build was made for slot $BG_TARGET but the idle slot is now $IDLE (the live slot changed since the preflight). Nothing done."
IDLE_NAME=$(bg_pm2 "$IDLE"); IDLE_DIST=$(bg_dist "$IDLE"); IDLE_PORT=$(bg_port "$IDLE")
bg_say "live: $LIVE_NAME on :$LIVE_PORT ($LIVE_DIST)   →   deploying to slot $IDLE: $IDLE_NAME on :$IDLE_PORT ($IDLE_DIST)"

# nginx must already go through the upstream, or the switch below would move nothing.
[ -f "$BG_UPSTREAM_FILE" ] || bg_die "$BG_UPSTREAM_FILE is missing: run scripts/ops/marketing-bluegreen/apply-nginx.sh first."

# A leftover of the idle slot (a failed deploy that was not cleaned up) is removed; anything else on its port stops us.
if [ "$(bg_pm2_state "$IDLE_NAME")" != "absent" ]; then bg_say "removing a leftover $IDLE_NAME"; bg_stop_name "$IDLE_NAME" || bg_die "could not remove the leftover $IDLE_NAME"; sleep 1; fi
if bg_listening "$IDLE_PORT"; then bg_die "port $IDLE_PORT is in use by something that is not $IDLE_NAME. Nothing done."; fi

# ── 2. Unpack. Only the idle build dir is new; the live build dir is not touched. ────────────────────────────
if [ -f .deploy-public-manifest ]; then cp .deploy-public-manifest "/tmp/.deploy-public-manifest.$BG_TMP_TAG.prev"; else : > "/tmp/.deploy-public-manifest.$BG_TMP_TAG.prev"; fi
# The idle dir holds the build before last: no process reads it (checked above). Starting from an empty dir means
# no orphaned server chunks ever accumulate in a slot. The live dir (the rollback target) stays whole.
rm -rf "${BG_APP:?}/${IDLE_DIST:?}"
unzip -qo "$BG_ZIP" || bg_die "unzip failed"
rm -f "$BG_ZIP"
[ -f "$BG_APP/$IDLE_DIST/BUILD_ID" ] || bg_die "the archive did not contain $BG_APP/$IDLE_DIST (built for another slot?)"
if [ ! -s "$BG_APP/.env.local" ]; then bg_die "$BG_ROOT/$BG_APP/.env.local is missing or empty. Refusing to start $IDLE_NAME — it would start with none of its secrets."; fi

# public/ is shared by both slots: files removed from the repo since the last deploy are pruned, as before.
STALE_FILES=$(comm -23 "/tmp/.deploy-public-manifest.$BG_TMP_TAG.prev" .deploy-public-manifest | grep -v -e "^$BG_APP/public/images/blog/" -e "^$BG_APP/public/client-samples/" || true)
if [ -n "$STALE_FILES" ]; then echo "Pruning stale public/ files:"; echo "$STALE_FILES"; echo "$STALE_FILES" | xargs -r rm -f; else echo "No stale public/ files to prune."; fi
rm -f "/tmp/.deploy-public-manifest.$BG_TMP_TAG.prev"

# ── 3. Static files: carry the live build's forward, then age out what no recent build has. ──────────────────
bg_carry_static "$BG_APP/$LIVE_DIST/static" "$BG_APP/$IDLE_DIST/static" || bg_die "could not carry the static files forward"
if [ -s .deploy-static-manifest ]; then
  find "$BG_APP/$IDLE_DIST/static" -type f | LC_ALL=C sort > "/tmp/.static-have.$BG_TMP_TAG"
  LC_ALL=C sort .deploy-static-manifest > "/tmp/.static-keep.$BG_TMP_TAG"
  comm -23 "/tmp/.static-have.$BG_TMP_TAG" "/tmp/.static-keep.$BG_TMP_TAG" > "/tmp/.static-orphans.$BG_TMP_TAG"
  if [ -s "/tmp/.static-orphans.$BG_TMP_TAG" ]; then
    echo "$(wc -l < "/tmp/.static-orphans.$BG_TMP_TAG") static file(s) in $IDLE_DIST are from prior builds: kept for pages still open on them, removed once older than $KEEP_DAYS days"
    while IFS= read -r f; do find "$f" -type f -mtime +"$KEEP_DAYS" -delete 2>/dev/null; done < "/tmp/.static-orphans.$BG_TMP_TAG"
  else
    echo "No static files from prior builds in $IDLE_DIST."
  fi
  rm -f "/tmp/.static-have.$BG_TMP_TAG" "/tmp/.static-keep.$BG_TMP_TAG" "/tmp/.static-orphans.$BG_TMP_TAG"
else
  echo "WARN: .deploy-static-manifest missing/empty — skipping the static age prune (safety)"
fi

# Server chunks: the dir was emptied before the unzip, so it holds this build's chunks and nothing else. Checked, not assumed.
if [ -s .deploy-server-chunks-manifest ]; then
  EXTRA=$(comm -23 <(find "$BG_APP/$IDLE_DIST/server/chunks" -type f | LC_ALL=C sort) <(LC_ALL=C sort .deploy-server-chunks-manifest) | wc -l | tr -d ' ')
  if [ "$EXTRA" = "0" ]; then echo "Server chunks in $IDLE_DIST match the build's manifest (no orphans)."; else echo "WARN: $EXTRA file(s) in $IDLE_DIST/server/chunks are not in the build's manifest (left in place)."; fi
fi

# Buttons on pages opened from the live build: how many of its server-action ids the new build still has.
python3 - "$BG_APP/$LIVE_DIST/server/server-reference-manifest.json" "$BG_APP/$IDLE_DIST/server/server-reference-manifest.json" <<'PY' || true
import json, sys
def ids(p):
    try:
        m = json.load(open(p))
    except Exception:
        return None
    return set(m.get("node", {})) | set(m.get("edge", {}))
old, new = ids(sys.argv[1]), ids(sys.argv[2])
if old is None or new is None:
    print("[blue-green] server-action ids: a manifest could not be read (not compared)")
else:
    gone = sorted(old - new)
    print(f"[blue-green] server-action ids: {len(old & new)} of the live build's {len(old)} exist in the new build" + (f"; NOT in the new build: {', '.join(gone[:8])}" if gone else ""))
PY

# ── 4. Dependencies (shared by both slots). ──────────────────────────────────────────────────────────────────
if [ -d node_modules ] && [ "$(cat .deploy-lock-hash 2>/dev/null)" = "$BG_LOCK_HASH" ]; then
  echo "npm ci skipped — package-lock.json unchanged since the last install ($BG_LOCK_HASH)"
else
  echo "npm ci — lockfile changed or first install. NOTE: node_modules is shared with the LIVE process; it is replaced under it while this runs (as it always was)."
  npm ci --omit=dev || bg_die "npm ci failed (the live slot $LIVE_NAME is still serving; check that node_modules is whole before anything else)"
  echo "$BG_LOCK_HASH" > .deploy-lock-hash
fi

# ── 5. Start the idle slot and prove it before any traffic reaches it. ───────────────────────────────────────
bg_cron_guard
bg_start "$IDLE" || bg_die "could not start $IDLE_NAME. $LIVE_NAME is untouched and still serving."
if ! bg_health "$IDLE"; then
  pm2 logs "$IDLE_NAME" --nostream --lines 40 2>/dev/null | tail -n 60
  bg_stop_name "$IDLE_NAME"
  bg_die "the new build did not pass its health check. It was removed; $LIVE_NAME is untouched and still serving."
fi

# ── 6. Switch nginx, then stop the old process. ──────────────────────────────────────────────────────────────
if ! bg_nginx_point "$IDLE_PORT" "$LIVE_PORT"; then
  bg_stop_name "$IDLE_NAME"
  bg_die "nginx was not switched. The new slot was removed; $LIVE_NAME is untouched and still serving."
fi
bg_write_active "$IDLE" || bg_say "WARN: could not write $BG_STATE_DIR/.active-slot — write '$IDLE' there by hand before the next deploy"
sleep 2   # the new nginx workers are up; requests still in the old workers finish on the old slot
bg_say "nginx now sends to :$IDLE_PORT. Stopping $LIVE_NAME (it finishes its requests, up to its kill timeout)."
bg_stop_name "$LIVE_NAME" || bg_say "WARN: $LIVE_NAME could not be stopped; it no longer receives traffic. Remove it by hand: pm2 delete $LIVE_NAME"
pm2 save >/dev/null || bg_say "WARN: pm2 save failed — run it by hand, or a reboot brings back the old process list"

# End to end, through nginx, on the real host name.
CODE=$(curl -s -o /dev/null -m 15 -w '%{http_code}' --resolve "$BG_HEALTH_HOST:443:127.0.0.1" "https://$BG_HEALTH_HOST$BG_HEALTH_HOST_PATH" 2>/dev/null)
if [ "$CODE" = "200" ]; then bg_say "through nginx: https://$BG_HEALTH_HOST$BG_HEALTH_HOST_PATH → 200"; else bg_say "WARN: through nginx https://$BG_HEALTH_HOST$BG_HEALTH_HOST_PATH → ${CODE:-000}. Check now; roll back with: MARKETING_BLUE_GREEN=1 ./deploy-marketing.sh --rollback"; fi

bg_say "DONE. live slot: $IDLE  ($IDLE_NAME, :$IDLE_PORT, build $(cat "$BG_APP/$IDLE_DIST/BUILD_ID" 2>/dev/null)).  Previous build kept in $BG_APP/$LIVE_DIST for a rollback."
if [ "$LIVE" = "legacy" ]; then bg_say "This was the first blue-green deploy: the old process '$BG_NAME' is gone, and $BG_APP/.next (the old build) can be deleted once this one is trusted."; fi
