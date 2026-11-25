# shellcheck shell=bash
# remote-rollback.sh — the SERVER half of `MARKETING_BLUE_GREEN=1 ./deploy-marketing.sh --rollback`. Piped to the
# server after slot-lib.sh; never run by hand. Brings the PREVIOUS build back the same way a deploy brings a new one
# in: start it in the idle slot, health-check, switch nginx, stop the current one. No build, no upload, no unzip.
#
# What comes back is the build dir only. src/, next.config.ts, .env.local, public/ and node_modules are shared by
# both slots and stay as the last deploy left them. After a deploy that changed package-lock.json, the previous
# build runs on the new node_modules: check the site, and redeploy the old commit if it misbehaves.

cd "$BG_ROOT" || bg_die "no $BG_ROOT"
LIVE=$(bg_live)
[ "$LIVE" != "legacy" ] || bg_die "no blue-green deploy has happened yet (no $BG_STATE_DIR/.active-slot): there is nothing to roll back to."
LIVE_NAME=$(bg_pm2 "$LIVE"); LIVE_PORT=$(bg_port "$LIVE"); LIVE_DIST=$(bg_live_dist "$LIVE")
IDLE=$(bg_other "$LIVE"); IDLE_NAME=$(bg_pm2 "$IDLE"); IDLE_PORT=$(bg_port "$IDLE")

# The previous build: the idle slot's own dir, or, right after the very first blue-green deploy, the old single
# process's .next (it ran on slot a's port, so it comes back as slot a).
if [ -f "$BG_APP/$(bg_dist "$IDLE")/BUILD_ID" ]; then PREV_DIST=$(bg_dist "$IDLE")
elif [ "$IDLE" = "a" ] && [ -f "$BG_APP/.next/BUILD_ID" ]; then PREV_DIST=".next"
else bg_die "no previous build on disk for slot $IDLE ($BG_APP/$(bg_dist "$IDLE") has no BUILD_ID). Nothing done."; fi
[ "$PREV_DIST" != "$LIVE_DIST" ] || bg_die "the previous build dir is the live one ($LIVE_DIST). Nothing done."

bg_say "live: $LIVE_NAME on :$LIVE_PORT ($LIVE_DIST, build $(cat "$BG_APP/$LIVE_DIST/BUILD_ID" 2>/dev/null))"
bg_say "rolling back to: $PREV_DIST (build $(cat "$BG_APP/$PREV_DIST/BUILD_ID")) as $IDLE_NAME on :$IDLE_PORT"
[ -f "$BG_UPSTREAM_FILE" ] || bg_die "$BG_UPSTREAM_FILE is missing."
if [ "$(bg_pm2_state "$IDLE_NAME")" != "absent" ]; then bg_stop_name "$IDLE_NAME" || bg_die "could not remove a leftover $IDLE_NAME"; sleep 1; fi
if bg_listening "$IDLE_PORT"; then bg_die "port $IDLE_PORT is in use by something that is not $IDLE_NAME. Nothing done."; fi

# Pages opened from the build being left keep their script files.
bg_carry_static "$BG_APP/$LIVE_DIST/static" "$BG_APP/$PREV_DIST/static" || bg_say "WARN: static files not carried forward"

bg_cron_guard
bg_start "$IDLE" "$PREV_DIST" || bg_die "could not start $IDLE_NAME. $LIVE_NAME is untouched and still serving."
if ! bg_health "$IDLE"; then
  pm2 logs "$IDLE_NAME" --nostream --lines 40 2>/dev/null | tail -n 60
  bg_stop_name "$IDLE_NAME"
  bg_die "the previous build did not pass its health check. It was removed; $LIVE_NAME is untouched and still serving."
fi
if ! bg_nginx_point "$IDLE_PORT" "$LIVE_PORT"; then
  bg_stop_name "$IDLE_NAME"
  bg_die "nginx was not switched. $LIVE_NAME is untouched and still serving."
fi
bg_write_active "$IDLE" "$PREV_DIST" || bg_say "WARN: could not write the state files — write '$IDLE' to $BG_STATE_DIR/.active-slot by hand"
sleep 2
bg_stop_name "$LIVE_NAME" || bg_say "WARN: $LIVE_NAME could not be stopped; it no longer receives traffic. Remove it by hand: pm2 delete $LIVE_NAME"
pm2 save >/dev/null || bg_say "WARN: pm2 save failed — run it by hand"
bg_say "ROLLED BACK. live slot: $IDLE ($IDLE_NAME, :$IDLE_PORT, $PREV_DIST). The build that was live is still in $BG_APP/$LIVE_DIST."
