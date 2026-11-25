# Marketing app: blue-green deploy (no closed port)

Status: written 2026-11-24, **not yet rehearsed, not yet used**. `deploy-marketing.sh` keeps deploying the single
process only with `MARKETING_BLUE_GREEN=0`. Blue-green is the default since 2026-11-25: the rehearsal passed and the first live deploy (slot b, :3021) was clean.

## Why

The marketing app also serves keystone.evelynlearning.com. A single-process deploy closes port 3001 for about
5 seconds; a reviewer working in Keystone got 502s from it. With two slots the port nginx sends to is never closed.

## The design

| | port | build dir | pm2 name |
|---|---|---|---|
| slot a | 3001 | `apps/marketing/.next-a` | `evelyn-marketing-a` |
| slot b | 3021 | `apps/marketing/.next-b` | `evelyn-marketing-b` |

One slot is live; the other is not running between deploys. Both share one app dir (`/root/evelyn-marketing/apps/marketing`),
so `public/`, `.env.local`, `src/`, `next.config.ts` and the workspace `node_modules` are shared.

State on the server, written at each switch:

- `/root/evelyn-marketing/.active-slot` — `a` or `b`
- `/root/evelyn-marketing/.active-port` — `3001` or `3021` (the cron lines read this)
- `/root/evelyn-marketing/.active-dist` — the live build dir's name
- `/etc/nginx/conf.d/evelyn-marketing-upstream.conf` — `upstream evelyn_marketing`: live port first, the other as `backup`

A deploy: build locally for the idle slot (`NEXT_DIST_DIR`), unzip beside the live build, copy the live build's
static files into the new one, start the idle slot, health-check it on its own port (`/` and Keystone's `/login`,
up to 45 s), rewrite the upstream file, `nginx -t`, `nginx -s reload`, stop the old slot (it finishes its
requests), `pm2 save`. Any failure before the reload removes the new slot and leaves the old one serving.

Why nothing gets a 502 at the switch: nginx workers from before the reload still try the old port first. Once the
old slot stops, that connect is refused and the same request goes to the backup, which is the new slot. A refused
connect means nothing was sent, so nginx retries a POST too (it never retries a POST after sending; `non_idempotent`
is not set and must never be).

## Files here

| file | runs on | what |
|---|---|---|
| `slot-lib.sh` | server (piped) | the functions: start, health, nginx switch, stop, state files |
| `remote-deploy.sh` | server (piped) | the server half of a blue-green deploy |
| `remote-rollback.sh` | server (piped) | the server half of `--rollback` |
| `apply-nginx.sh` + `apply-nginx.remote.sh` + `nginx-edit.py` | laptop → server | one-time nginx change |
| `nginx-live.diff` | — | that change as a diff against the live files (for reading) |
| `apply-cron.sh` | laptop → server | one-time crontab change |
| `rehearse.sh` + `rehearse.config.sh` + `rehearse.remote.sh` | laptop → server | the rehearsal |

Nothing is copied to the server: each script's text is piped over ssh and read whole before it runs.

## One-time setup, in this order

Every script prints what it would do when run without `--yes`.

1. **Rehearse** (touches nothing live; reloads nginx five times, gracefully):
   `scripts/ops/marketing-bluegreen/rehearse.sh --yes` → must end with `PASS`.
   If it is interrupted: `scripts/ops/marketing-bluegreen/rehearse.sh --cleanup --yes`.
2. **Cron** (safe at any time; before the first blue-green deploy the lines still resolve to 3001):
   `scripts/ops/marketing-bluegreen/apply-cron.sh` then `... --yes`.
3. **nginx** (no behaviour change while only the single process runs):
   `scripts/ops/marketing-bluegreen/apply-nginx.sh` then `... --yes`. It backs up, edits, runs `nginx -t`, reloads
   only if that passes, checks both sites through nginx and restores the backups on any failure.
   Afterwards refresh the repo mirrors:
   `ssh root@85.239.239.134 'cat /etc/nginx/sites-enabled/evelynlearning'` → `nginx/evelynlearning-live.conf` (keep its header),
   same for `keystone.evelynlearning.com` → `nginx/keystone-evelynlearning-live.conf`.
4. **First blue-green deploy**: `./deploy-marketing.sh` from a worktree, after the usual gate.
   It refuses unless steps 2 and 3 are done. Today's process `evelyn-marketing` (port 3001, `.next`) counts as
   slot a; the build goes to slot b (3021); after the switch `evelyn-marketing` is stopped and removed from pm2.
   Its build stays in `apps/marketing/.next` as the rollback target; delete that dir (about 700 MB) once the new
   layout is trusted.
5. Flip the default in `deploy-marketing.sh` (`MARKETING_BLUE_GREEN="${MARKETING_BLUE_GREEN:-1}"`) and update the
   places listed under "The pm2 name" below.

## A normal deploy

```
./deploy-marketing.sh
```

Slots alternate by themselves. The Keystone-in-use check still applies (`KEYSTONE_BUSY_OK=1` to deploy anyway; once
blue-green is trusted that check can be dropped for this path). If a quarter-hour is less than 90 s away the
server waits until just past it before starting the new slot (see "The in-process schedulers").

## Which slot is live

```
ssh root@85.239.239.134 'cat /root/evelyn-marketing/.active-slot /root/evelyn-marketing/.active-port; pm2 list | grep evelyn-marketing; cat /etc/nginx/conf.d/evelyn-marketing-upstream.conf'
```

## Rollback

```
./deploy-marketing.sh --rollback
```

About 15 seconds, no build, no closed port: the previous build is still in the other slot's dir and is brought
back the same way a deploy brings a new one in. Not held back by the Keystone check. Run it again to go forward
again. Limits: only the build dir comes back. `public/`, `.env.local`, `src/` and `node_modules` stay as the last
deploy left them; after a deploy that changed `package-lock.json`, check the site after rolling back, and
redeploy the old commit if it misbehaves.

By hand on the server, if the laptop script cannot be used (live slot b → back to a):

```
cd /root/evelyn-marketing/apps/marketing
NEXT_DIST_DIR=.next-a pm2 start ../../node_modules/.bin/next --name evelyn-marketing-a --kill-timeout 10000 -- start -p 3001
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3001/        # 200 before going on
# in /etc/nginx/conf.d/evelyn-marketing-upstream.conf: put 3001 on the first server line, 3021 on the backup line
nginx -t && nginx -s reload
echo a > /root/evelyn-marketing/.active-slot; echo 3001 > /root/evelyn-marketing/.active-port; echo .next-a > /root/evelyn-marketing/.active-dist
pm2 delete evelyn-marketing-b && pm2 save
```

(Use `.next` instead of `.next-a`, in both places, when rolling back from the very first blue-green deploy.)

## Back to the single process (untested, by hand)

`MARKETING_BLUE_GREEN=0 ./deploy-marketing.sh` refuses while `.active-slot` exists. To return: make slot b
the live one (deploy or roll back until it is), then on the server
`rm /root/evelyn-marketing/.active-slot /root/evelyn-marketing/.active-port /root/evelyn-marketing/.active-dist`,
run the single-process `./deploy-marketing.sh` (it starts `evelyn-marketing` on 3001 from `.next`), put 3001 first
in the upstream file, `nginx -t && nginx -s reload`, `pm2 delete evelyn-marketing-b && pm2 save`. The nginx and
cron changes can stay: with no state file they mean port 3001.

## The in-process schedulers

`apps/marketing/src/instrumentation.ts` starts four node-cron jobs in every process, so both slots run them while
both are up (roughly 10 to 50 seconds per deploy):

| job | fires | if it fires in both |
|---|---|---|
| blog queue | minute 0 of every hour | both read the same pending posts (plain `find`, no claim) → a post can be published twice |
| auto-blog | 09:00 server time | two posts generated, two sets of model calls |
| reply watcher | every 15 min | both read the same Gmail threads → a reply or bounce recorded twice on the lead (the "in progress" flag is per process) |
| lead research | every minute | harmless: a job is claimed atomically (`findOneAndUpdate` with a lease) |

The three harmful ones fire only on quarter-hours. Guard (in `slot-lib.sh`, `bg_cron_guard`): the idle slot is not
started when a quarter-hour is less than `BG_CRON_GUARD_SEC` (90) seconds away; the server sleeps until 8 s past
it. The overlap then ends about 14 minutes before the next one. The hourly Keystone cron (`curl` at minute 0) is
kept clear of the switch by the same guard.

## The pm2 name

`evelyn-marketing` becomes `evelyn-marketing-a` or `evelyn-marketing-b` (whichever is live). Log files become
`/root/.pm2/logs/evelyn-marketing-{a,b}-{out,error}.log`. Places in this repo that name the process:

| where | edit |
|---|---|
| `deploy-marketing.sh` (header lines 13-17, `PM2_NAME`) | `PM2_NAME` stays: it is the base of both slot names. Reword the header once blue-green is the default. |
| `README.md` lines 12 and 26 | `evelyn-marketing-a/-b` on :3001/:3021 |
| `docs/ops/WORKFLOW.md` line 27 | same; add the `--rollback` line |
| `deploy-tutor.sh` line 14 (comment) | same |
| `nginx/evelynlearning-live.conf` (comment "pm2 evelyn-marketing"), `nginx/keystone-evelynlearning-live.conf` line 6 | comments in the live files; reword when the mirrors are refreshed |
| `apps/marketing/src/lib/ops/vps-breakdown.test.ts` lines 188, 240 | nothing: a test fixture's file name |
| admin VPS page (`apps/marketing/src/lib/ops/vps-collect.ts`, `vps-breakdown.ts`) | nothing: it reads names from `pm2 jlist`, none is written in the code. It will show the live slot's name, and both during a deploy. |
| `docs/superpowers/plans/*` (cutover and migration runbooks) | nothing: history |
| `evelyn-marketing` in `apps/tutor/**` | nothing: that is the tutor's partner id, not the pm2 process |

Outside the repo: the memory notes and any habit of `pm2 logs evelyn-marketing` (now
`pm2 logs evelyn-marketing-$(cat /root/evelyn-marketing/.active-slot)`). On the server only the old
`/root/migration-staging/*.sh` scripts name it (the Germany → US cutover; not in use).

## Known limits

- **`npm ci`** (only when `package-lock.json` changed) replaces the shared `node_modules` under the live process,
  as it always has. A lockfile deploy is the one kind that can still disturb the live build; do it when Keystone
  is quiet.
- The unzip also replaces the shared `src/`, `next.config.ts` and `packages/core/src` while the old build is still
  live. A running process has already loaded its config; a slot started later by `--rollback` reads the newer
  `next.config.ts`.
- A request the old slot is still working on when its 10 s kill timeout ends is cut (the timeout is
  `BG_KILL_TIMEOUT_MS`).
- For the seconds both slots are up, direct callers of the old port still reach the old build (nginx does not).
- Each deploy reloads nginx once. A reload is graceful, but it is box-wide: if any other site's config on the box
  is broken, `nginx -t` fails, the deploy stops before the switch and the new slot is removed.
- pm2 remembers `NEXT_DIST_DIR` in the process environment (`pm2 save`), so a reboot brings the live slot back on
  the right build. Not tested by the rehearsal (it never saves).
