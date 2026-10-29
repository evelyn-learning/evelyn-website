# US cut-over runbook (Germany → Seattle), phase 1

Written 2026-10-13. Owner: Praveen. Status: READY FOR REVIEW. Nothing in this file has been run.
Parent plan: `docs/superpowers/plans/2026-10-08-contabo-us-migration.md` (its dates and the pinned-engine
parts are superseded by this file).

- Germany: `84.247.185.169` (stays up for Crimsora, evelyntutor.com, Stayfari, Rydovia, PageVault, school projects)
- US: `85.239.239.134` (Contabo Seattle, Ubuntu 24.04.5, 8 vCPU / 24 GB / 290 GB)

## Changes since this was written (13 Oct, afternoon) — read first

Everything else has already moved to the US box: the seven static sites, Sacred Tree, PageVault,
evelyntutor.com, Crimsora, Stayfari and Rydovia. Evelyn and the school projects are the last.

- **DNS TTL is already lowered** to 60 s on the four A records (13 Oct 15:23 PDT). "At least 4 hours before", item 1, is done.
- **The five school projects now move too** (Praveen, 13 Oct). Rehearsed: `/root/schoolprojects` and the
  databases `soysauce`, `racman`, `bartr`, `fridgecheck`, `squirrelrun3d` are copied, the five pm2 apps run on
  the US box (not yet `pm2 save`d), and 34 of 34 compared pages and assets match Germany. The US
  `evelynlearning` site file now serves `/fridgecheck`, `/hummiguard-ai`, `/racman`, `/bartr` locally, and
  `/root/migration-staging/de-straggler/evelynlearning` forwards them to the US box.
  - Window step 1 also stops them: `pm2 stop soysauce racman bartr hummiguard-ai fridgecheck`.
  - Window step 2, after `cutover-us.sh`: `/root/migration-staging/batch7-pull.sh`, then
    `pm2 restart soysauce racman bartr hummiguard-ai fridgecheck && pm2 save`.
  - The address-based links (`http://84.247.185.169/soysauce`, `/racman`, `/bartr`) work on
    `http://85.239.239.134/...`; the old ones die when the Germany box is shut down. `/soysauce` has no
    `evelynlearning.com` path.
- **Before window step 2**, on the US box: restore the Evelyn line in `/etc/hosts` (it is commented
  `#EVELYN-CUTOVER-ONLY`; the original is in `/root/migration-staging/hosts.with-evelyn-names`).
  `cutover-us.sh` does not do this, and its own health check depends on it. The four Evelyn rehearsal apps
  are currently stopped; the script deletes and restarts them in production mode.
- **Crimsora and evelyntutor.com are already on the US box**, so "Verify" checks them there and step 9
  no longer needs to leave their deploy scripts alone (they are already repointed). Add to step 9:
  `/Users/luke/Dev/schoolprojects/fridgecheck/deploy-to-production.sh` and
  `/Users/luke/Dev/schoolprojects/hummiguard-ai/deploy-to-production.sh`.
- After the window: change the `engine-in-germany` line in `/root/migration-staging/us-monitor.sh`.

## What moves

| Thing | Detail |
|---|---|
| Processes | `evelyn-tutor` :3007, `evelyn-marketing` :3001, `greenapple-web` :3016, `greenapple-api` :4015 |
| Databases | `evelyn`, `greenapple`, `evelyn-test-review` (about 65 MB together) + the `evelyn` database user |
| Files | `/root/evelyn-tutor`, `/root/evelyn-marketing`, `/root/greenapple`, `/root/evelyn-tutor-ops`, `/root/partner-metering`, `/var/data/evelyn/audio` (30 GB) |
| Scheduled jobs | the two partner-metering crons (02:07 daily, Mon 17:12, Berlin time) |
| DNS | A records `evelynlearning.com`, `tutor`, `greenapple`, `session` (`www` is a CNAME to the apex and follows) |

Not moving: the pinned engine `evelyn-tutor-gac` :3008 is retired (stopped at cut-over, not copied).
The four school-project paths (`/racman`, `/bartr`, `/hummiguard-ai`, `/fridgecheck`) stay in Germany; the
US box forwards them back.

## Measured in rehearsal (13 Oct, Germany live)

| Step | Time |
|---|---|
| Stop apps on the US box | 2 s |
| Stream + restore the three databases | 44 s |
| File changes since last sync (audio + app folders) | 69 s |
| Start apps, first good responses | 8 s |
| US side total | 123 s |

Expected visitor-facing downtime: about 3 to 4 minutes (from stopping Germany to Germany forwarding to
the US box). The whole window with checks: about 20 minutes.

## State of the US box before cut-over

- Hardened (key-only SSH, ufw 22 limited + 80/443, fail2ban), Node 20.20.0, pm2 6.0.14, nginx 1.24,
  MongoDB 8.0.16 on `127.0.0.1:2710` `rs0`, timezone Europe/Berlin (the 02:07 metering job depends on it).
- The four apps run there now as a REHEARSAL: schedulers and mail off, against a copy. The copy is
  overwritten at cut-over.
- `/etc/hosts` maps the five Evelyn names to the box itself, so GreenApple → engine calls stay local.
- Nightly encrypted backup to Cloudflare R2 `evelyn-backups` at 03:30; one restore proven.
- Prepared, not run: `/root/migration-staging/cutover-us.sh`, `/root/migration-staging/production.config.js`,
  `/root/migration-staging/de-straggler/` (the four German site files changed to forward to the US box).

## At least 4 hours before the window

1. **Lower DNS TTL.** The four A records are at 14400 s (4 hours). Set each to 60 s in Cloudflare, DNS-only
   as now. Without this, some visitors keep reaching Germany for up to 4 hours (they are still served,
   forwarded by Germany, but slower).
2. **Tell Milo** (GAC): hosting moves to the US at the chosen hour, a few minutes of downtime, the
   application build is unchanged. Tell GameClass and Kanzoo if they have usage at that hour.
3. **No deploys** of engine, marketing or GreenApple by any session from now until step 9 is done.
   The deploy scripts still point at Germany and would restart the stopped processes there.

## The window (each numbered step needs Praveen's go)

Pre-checks, all must pass:
- No live tutor session: `https://www.evelynlearning.com/admin/tutor-sessions`.
- `/tmp/evelyn-deploy.lock` absent on Germany; no other session deploying.
- Last night's R2 backup present (`/var/log/evelyn-backup.log` on the US box ends with `OK`).

**1. Germany: stop the Evelyn processes and the two metering crons.**
```
ssh root@84.247.185.169 'pm2 stop evelyn-tutor evelyn-tutor-gac evelyn-marketing greenapple-web greenapple-api'
ssh root@84.247.185.169 'crontab -l > /root/crontab.before-us-cutover && crontab -l | sed -E "/partner-metering/ s/^/#MOVED-TO-US /" | crontab -'
```
Stop, never delete. Never `pm2 restart all`. Downtime starts here.

**2. US: final copy and start in production mode.**
```
ssh -A -o ControlPath=none root@85.239.239.134 /root/migration-staging/cutover-us.sh
```
The script refuses to run if any of the five processes is still online in Germany. It restores the three
databases, syncs files, compares the document count of every collection on both sides, and starts the
apps only if all counts match. It then installs the two metering crons and saves the pm2 list.

**3. Germany: forward late visitors to the US box.** Downtime ends here.
```
ssh root@84.247.185.169 'mkdir -p /root/nginx-before-us-cutover && cp -a /etc/nginx/sites-enabled/evelynlearning /etc/nginx/sites-enabled/greenapple.evelynlearning.com /etc/nginx/sites-enabled/session.evelynlearning.com /etc/nginx/sites-available/tutor-evelynlearning /root/nginx-before-us-cutover/'
scp -3 root@85.239.239.134:/root/migration-staging/de-straggler/{evelynlearning,greenapple.evelynlearning.com,session.evelynlearning.com} root@84.247.185.169:/etc/nginx/sites-enabled/
scp -3 root@85.239.239.134:/root/migration-staging/de-straggler/tutor-evelynlearning root@84.247.185.169:/etc/nginx/sites-available/
ssh root@84.247.185.169 'nginx -t && systemctl reload nginx'
```
Check through Germany (DNS still points there): home page, `/tutor`, `https://greenapple.evelynlearning.com/`,
one `/_next/static/` file on each site, `/racman`.

**4. Cloudflare: point the four A records at `85.239.239.134`.** DNS-only, TTL 60.
`evelynlearning.com`, `tutor`, `greenapple`, `session`. Do not touch MX or TXT.

**5. Verify on the real names** (from the laptop, once `dig +short evelynlearning.com` shows the new IP):
- Marketing home, `/tutor` demo start, `/blog`.
- GreenApple: launch-link sign-in, one Homework Help text session, one practice set, partner feed with the key.
- One replay with audio.
- GameClass embed start and Kanzoo token start.
- Crimsora and evelyntutor.com each start one tutor session (they call the engine by hostname, now the US box).
- The four school-project paths.
- `ssh root@85.239.239.134 'certbot renew --dry-run'` for the four certificates.

**6. US: confirm the schedulers are on.** `pm2 logs evelyn-marketing --nostream --lines 40` shows the blog
scheduler, reply watcher and lead-research worker started; `greenapple-api` shows `[usage-report] started`.

**7. Laptop.** Move the `:2710` tunnel: `ssh -f -N -L 2710:127.0.0.1:2710 root@85.239.239.134`.
From now the tunnel reaches the US production database.

**8. Germany: stop certificate renewal for the four moved names** (they can no longer validate there):
move `/etc/letsencrypt/renewal/{evelynlearning.com,greenapple.evelynlearning.com,session.evelynlearning.com,tutor.evelynlearning.com}.conf`
to `/root/letsencrypt-renewal-moved-to-us/`. The existing certificates stay valid into December, which
covers the forwarding period.

**9. Repoint the deploy scripts** (branch, gate, merge), then deploys are allowed again:

| File | Line |
|---|---|
| `/Users/luke/Dev/evelynlearning/deploy-tutor.sh` | 4, 146 |
| `/Users/luke/Dev/evelynlearning/deploy-marketing.sh` | 4, 69 |
| `/Users/luke/Dev/evelynlearning/scripts/tutor/gameclass-provision.sh` | 17 |
| `/Users/luke/Dev/evelynlearning/scripts/tutor/kanzoo-provision.sh` | 17 |
| `/Users/luke/Dev/evelynlearning/apps/tutor/scripts/make-session-clip.mjs` | 41 |
| `/Users/luke/Dev/evelynlearning/nginx/evelynlearning-live.conf` | 7, 393 |
| `/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot/deploy-greenapple.sh` | 11 |
| `/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot/deploy/env-drift-check.sh` | 37 (GreenApple only; Crimsora and evelyntutor.com stay on Germany) |

`deploy-crimsora.sh` and `deploy-evelyntutor.com.sh` keep the German IP until phase 2.

## Rollback

Allowed only until the first real student write on the US box.
1. Cloudflare: the four A records back to `84.247.185.169`.
2. Germany: restore the four site files from `/root/nginx-before-us-cutover/`, `nginx -t && systemctl reload nginx`.
3. Germany: `pm2 start evelyn-tutor evelyn-marketing greenapple-web greenapple-api` and `crontab /root/crontab.before-us-cutover`.
4. US: `pm2 stop` the four apps and remove the two metering crons.

After real writes on the US box: fix forward, or run the same dump/restore in the other direction in a
second window.

## After the window

- Watch for 72 hours: pm2 logs and memory on the US box, the 02:07 metering export, the GreenApple daily
  usage report (13:00 UTC), the nightly backup log.
- After 72 clean hours and only on Praveen's word: delete the `evelyn`, `greenapple` and
  `evelyn-test-review` databases, the audio folder and the stopped processes in Germany; raise the DNS TTLs.
  Until then Germany holds a stale copy of GAC data, so the "no GAC data in Germany" statement to Milo
  needs that deletion date.
- Update memory: production IP, the `:2710` tunnel warning, deploy rules, retired pinned engine.

## Known limits

- Praveen tested the US box on 13 Oct in a separate Chrome window: GreenApple Homework Help, practice,
  replay, PDF download, and a voice session on `/tutor` (heard correctly once the right microphone was
  chosen in the fresh Chrome profile). All passed.
- Already broken in production before the move, to fix after cut-over: `/api/tutor/validate` with
  `chemistry-smiles` fails on every molecule (RDKit wasm not found at run time), on both boxes.
- Visitors forwarded through Germany are served, but with one transatlantic hop.
- R2 location is a request (Western North America), not a guarantee. Backups are encrypted before upload.
- The backup decryption key is only at `/Users/luke/.config/evelyn-backup/age-identity.txt`.
