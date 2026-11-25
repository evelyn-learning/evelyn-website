# shellcheck shell=bash
# rehearse.config.sh — the throwaway names, ports and dirs of the rehearsal. Piped FIRST (before slot-lib.sh), so
# slot-lib.sh's production defaults never apply. Nothing here names a live process, port, dir or nginx file.
RH_ROOT="/root/mk-rehearsal"                      # the scratch dir: created by the rehearsal, removed by it
RH_SRC_APP="/root/evelyn-marketing/apps/marketing"   # READ ONLY: the build is copied out of it
RH_SRC_ROOT="/root/evelyn-marketing"
RH_NGINX_PORT="8931"                              # the throwaway server block listens on 127.0.0.1 only
RH_SERVER_FILE="/etc/nginx/conf.d/mk-rehearsal-server.conf"
RH_ACCESS_LOG="/var/log/nginx/mk-rehearsal.access.log"
RH_SNAP="/tmp/mk-rehearsal-snap"                  # before/after snapshots, outside the scratch dir

BG_ROOT="$RH_ROOT"
BG_APP="apps/marketing"
BG_NAME="mk-rehearsal"                            # pm2: mk-rehearsal-a / mk-rehearsal-b
BG_PORT_A="3931"
BG_PORT_B="3932"
# Two scratch app dirs, each holding an ordinary .next: a copy of the live build, started exactly as built.
BG_APPDIR_A="$RH_ROOT/a/apps/marketing"
BG_APPDIR_B="$RH_ROOT/b/apps/marketing"
BG_DIST_A=".next"
BG_DIST_B=".next"
BG_NEXT_BIN="../../node_modules/.bin/next"
BG_STATE_DIR="$RH_ROOT"
BG_UPSTREAM="mk_rehearsal"
BG_UPSTREAM_FILE="/etc/nginx/conf.d/mk-rehearsal-upstream.conf"
BG_UPSTREAM_PREV="$RH_ROOT/upstream.prev"
BG_KILL_TIMEOUT_MS="10000"
BG_HEALTH_SECS="45"
BG_CRON_GUARD_SEC="0"
# The rehearsal processes must not run the in-process schedulers (blog queue, auto-blog, reply watcher, lead
# research): the real process already does. A variable set in the process environment wins over .env.local.
BG_EXTRA_ENV="ENABLE_BLOG_SCHEDULER=false ENABLE_OUTREACH_WATCHER=false ENABLE_LEAD_RESEARCH=false"
