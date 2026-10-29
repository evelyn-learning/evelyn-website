# Contabo US migration (Germany → Seattle)

Written 2026-10-08. Owner: Praveen. Status: PLAN, nothing ordered, nothing changed on any box.

## Decisions taken (Praveen, 10-08)

- Same provider and plan: Contabo Cloud VPS 8 (8 vCPU / 24 GB), location **Seattle (US West)**.
- **One shared box.** GreenApple gets nothing special: same VPS as every other brand, its own database
  (`greenapple`, as today) and its own processes (as today), and later the shared tutor engine again.
  The September "dedicated server for GAC only" wording is superseded, because the GAC scope shrank to a
  white-labelled Homework Help + Self Study section inside their own LMS. The reply to Milo has to say
  this plainly (see "What we tell GAC").
- Reason for the move: GAC's data-location concern. Everything moves to the US; the Evelyn stack first.
- Date promised to Milo for the full response + release candidate: **Thu 15 Oct**. Phase 1 below has to
  be live and settled before that.

## What is on the German box today (read 10-08, read-only)

Ubuntu 24.04.3, Node 20.20.0, MongoDB 8.0.16 (one mongod, 127.0.0.1:2710, rs0, 13 GB data dir),
nginx 1.24, pm2 6.0.14, redis on localhost, 24 GB RAM (15 used), disk 144 GB used of 193 GB
(the disk is 400 GB; the root partition was never grown past 199 GB).

| Group | Processes | Moves in |
|---|---|---|
| Evelyn engine | pm2 `evelyn-tutor` :3007 (`/root/evelyn-tutor`) | Phase 1 |
| GAC pinned engine | pm2 `evelyn-tutor-gac` :3008 (`/root/evelyn-tutor-gac`), `session.evelynlearning.com` | Phase 1 |
| GreenApple app | pm2 `greenapple-web` :3016, `greenapple-api` :4015 (`/root/greenapple`) | Phase 1 |
| Marketing site | pm2 `evelyn-marketing` :3001 (`/root/evelyn-marketing`) | Phase 1 |
| Engine ops | cron: `evelyn-tutor-ops/export-partner-metering.sh` (daily), `mail-partner-metering.js` (Mon) | Phase 1 |
| Crimsora, evelyntutor.com | pm2 `crimsora-*` :4000, `evelyntutor-*` :4001, 4 Crimsora crons | Phase 2 |
| Static sites | evelynedu.com + the six shop/site domains (nginx only) | Phase 2 |
| Stayfari, Rydovia | 8 systemd services, 5 crons, 39 GB under `/root/stayfari` | Phase 3 |
| PageVault, Sacred Tree, school projects | 9 pm2 processes | Phase 3 |

Things that are easy to miss:

- `evelynlearning.com` nginx also serves four school projects by path (`/racman`, `/bartr`,
  `/hummiguard-ai`, `/fridgecheck`). They stay in Germany until phase 3, so the new box must proxy those
  four paths back.
- Both engines write the same `evelyn` database, so they cannot move one at a time. Phase 1 is one window.
- Crimsora and evelyntutor.com reach the engine over `https://www.evelynlearning.com`, so they keep working
  from Germany after the cut-over, with one transatlantic hop per server call. CONFIRM in step 0 that
  neither app opens the `evelyn` database directly.
- Three deploy scripts hard-code the IP: `deploy-tutor.sh:146`, `deploy-marketing.sh:69`,
  academy `deploy-greenapple.sh:11`; plus `scripts/tutor/*-provision.sh` and the pinned-engine deploy copy.
- The laptop's `127.0.0.1:2710` tunnel points at Germany. After phase 1 it reaches a database the Evelyn
  apps no longer use.

## Method: dump and restore in one short window, not a replica-set member

The earlier idea was to add the US box as a member of `rs0`. I recommend against it:

- A replica-set member copies all ~18 databases, including Stayfari's and Rydovia's. The point of the
  move is where data sits; shipping unrelated data across first is the wrong direction.
- The German mongod listens on localhost only and has no authentication. Joining a remote member means
  rebinding and restarting the one mongod that also serves Stayfari's live booking database, and
  exposing an unauthenticated database to a network path.
- The data is small (13 GB in total). A dump and restore of the Evelyn databases is minutes.

So: rehearse the restore twice on the new box, time it, then do the real one with the apps stopped.
Expected write stop: 20 to 30 minutes, at a quiet hour.

## Step 0 — facts still missing (Praveen runs these; the permission check stops me)

```
! ssh root@84.247.185.169 'mongosh --quiet --port 2710 --eval "db.adminCommand({listDatabases:1}).databases.forEach(d=>print(d.name,(d.sizeOnDisk/1e6).toFixed(0)+\"MB\"))"'
! ssh root@84.247.185.169 'for d in /root/evelyn-tutor/apps/tutor /root/evelyn-tutor-gac/apps/tutor /root/evelyn-marketing/apps/marketing /root/greenapple /root/crimsora /root/evelyntutor; do echo "--- $d"; grep -hoE "^(MONGO[A-Z_]*|TUTOR_AUDIO_DIR|REDIS[A-Z_]*)=[^?]*" $d/.env.local | sed -E "s#//[^@/]*@#//***@#"; done'
```

From the output, settle:

1. Which databases belong to phase 1 (expected: `evelyn`, `greenapple`, and whatever marketing uses).
2. Where `TUTOR_AUDIO_DIR` points and its size (handoff says about 28 GB).
3. Whether anything in phase 1 uses redis.
4. Whether Crimsora or evelyntutor.com open `evelyn` directly. If yes, they move in phase 1 too.
5. Whether any outside service allow-lists the German IP (SPF `ip4:` entries, partner firewalls).

## Phase 1 — Evelyn stack (target: live Sun 11 Oct, settled by Tue 13 Oct)

### Thu 8 Oct — order

- Praveen orders Cloud VPS 8, region US West (Seattle), Ubuntu 24.04, largest disk option at that tier
  (need 60 GB for phase 1, about 160 GB once everything is over). Add Contabo Object Storage (US) or another
  US bucket for backups.
- Lower the Cloudflare TTL to 60 s on: `evelynlearning.com`, `www`, `tutor`, `greenapple`, `session`.
  All stay DNS-only (never proxied).

### Fri 9 Oct — build the box (no production impact)

1. Base: hostname, timezone, unattended upgrades, the same SSH hardening as Germany (keys only,
   `PerSourceMaxStartups 3`, fail2ban 3/1h → 24h), ufw (22 limited, 80/443 open).
2. Same versions as Germany: Node 20.20.0, pm2 6.0.14 + pm2-logrotate, nginx 1.24, MongoDB 8.0.x,
   certbot. The pinned engine is copied byte for byte, so Node and OS must match.
3. Encrypted data volume (LUKS) mounted at `/data`: MongoDB data dir, tutor audio, uploads, local
   backup staging. Key kept off the box.
   Trade-off to accept: after any reboot someone has to unlock the volume before the apps come up.
   (Full-disk encryption of the root disk on a Contabo VPS needs a custom install and a console unlock on
   every boot; the data volume covers the student data with far less risk.) DECISION for Praveen: accept
   manual unlock, or skip encryption at rest and say so to GAC.
4. mongod: localhost only, port 2710, single-node replica set `rs0`, data on `/data/mongodb`. Same
   port and set name means no connection-string changes.
5. Copy from Germany with rsync (pull, read-only on the source): `/root/evelyn-tutor`,
   `/root/evelyn-tutor-gac`, `/root/evelyn-marketing`, `/root/greenapple`, `/root/evelyn-tutor-ops`,
   `/root/.pm2/dump.pm2` (reference only), the audio directory, the four nginx site files,
   `/etc/letsencrypt` for the five hostnames. `.env.local` files travel inside the directories; nothing
   is printed.
6. nginx: the four Evelyn site files unchanged, plus the four school-project paths proxied to
   `https://legacy.evelynlearning.com` (new DNS name pointing at Germany, added to the German
   `evelynlearning` server block and certificate). Replace the Germany IP in `server_name`.
7. Rehearsal restore #1: `mongodump --db` per phase-1 database on Germany (reads only, off-peak),
   restore on the new box, record the time.
8. Start all six pm2 processes against the restored copy with outbound side effects off for the test
   (usage-report and metering crons not installed yet; feed sweep left alone since it only reads/writes
   the local copy).
9. Test through a hosts-file override on the laptop (no DNS change): marketing home, `/tutor` demo,
   one GreenApple sign-in → Homework Help text session → practice → feed record via the partner key,
   one replay with audio. Confirm `session.evelynlearning.com` reports build `GM1Hypd01hCZ9_J1GWndF`.

### Sat 10 Oct — rehearse, back up, tell people

1. Rehearsal restore #2 from a fresh dump, timed end to end, with the audio delta rsync. This gives
   the real window length.
2. Nightly backup job: `mongodump` of all databases on the box → compressed → encrypted (age, public
   key on the box, private key off it) → US bucket, 30-day retention. Run it once and restore from it
   once.
3. Write the cut-over runbook with the exact commands and the measured times; Praveen reads it.
4. Praveen tells Milo before the move (it falls inside the freeze): hosting moves to the US on Sunday,
   application build unchanged, about 30 minutes of downtime, time stated in Central.
5. Tell GameClass and Kanzoo the window if either has weekend usage (check the last four Sundays in the
   session log first).

### Sun 11 Oct, about 02:00 PT — cut-over (one window, 20–30 min of downtime)

Pre-checks: no live sessions (`/admin/tutor-sessions`), `/tmp/evelyn-deploy.lock` absent, no other
session deploying, last night's backup present.

1. Germany: `pm2 stop evelyn-tutor evelyn-tutor-gac evelyn-marketing greenapple-web greenapple-api`
   (stop, never delete; never `pm2 restart all`). Comment out the two metering crons.
2. Germany: final `mongodump` of the phase-1 databases. Final audio rsync.
3. US: stop the six processes, drop the rehearsal copies, restore the final dump, compare collection
   counts for every collection against Germany.
4. US: start the six processes, `pm2 save`, `pm2 startup`. Install the two metering crons.
5. Cloudflare: point the five records at the new IP (DNS-only).
6. Germany nginx: the Evelyn server blocks proxy to the new box for stragglers on cached DNS, so nobody
   lands on stopped processes.
7. Verify on the real names: the step-9 checks from Friday, a GameClass embed start, a Kanzoo token
   start, Crimsora and evelyntutor.com each starting one tutor session (they now call the US engine),
   certbot dry run for the five hostnames, GAC build id unchanged.
8. Laptop: move the SSH ControlMaster entry and the `:2710` tunnel to the new IP. Update the three
   deploy scripts and the provision scripts (commit on a branch, merge after the gate).

Rollback: allowed only until the first real student write on the new box. Put the five records back,
start the five processes in Germany, remove the proxy rule. After real writes, fix forward (or dump the
phase-1 databases back the other way in a second window).

### Mon 12 – Tue 13 Oct — settle

- Watch pm2 logs, memory, the 06:00 PT GreenApple usage report and the 02:07 metering export.
- Re-run the GreenApple regression (session → assigned practice → feed; grading run) on the new box.
- After 72 h clean: delete the phase-1 databases' stale copies in Germany only when Praveen says so
  (they are the fallback until then); raise the TTLs.
- Update memory files: prod IP, tunnel warning, pinned-engine paths, deploy rules.

## Phase 2 — Crimsora, evelyntutor.com, static sites (after 15 Oct)

Same method per app: copy the directory, restore its database in a short window, move the DNS record,
move its crons (trial reminders, Beacon daily/weekly). ⚠️ crimsora.com and evelyntutor.com are
Cloudflare-proxied: add the Cloudflare ranges to ufw on the new box as in Germany. ⚠️ static sites:
A records only, never MX/TXT. ⚠️ Crimsora prod runs `tour-v4-ship`, not main; copy the directory, do
not redeploy.

## Phase 3 — Stayfari, Rydovia, PageVault, Sacred Tree, school projects

Own plan with those projects' sessions (systemd units, change streams on `rs0`, 39 GB of files, port
9000 open to the internet). Germany is cancelled only after this phase and a full billing cycle of
fallback.

## What we tell GAC (for the 15 Oct response; Praveen writes it)

- Production for GreenApple is hosted in the United States (Seattle) from 11 Oct; provider named.
- Shared platform server, not a GAC-only machine: GreenApple has its own database and application
  processes; the tutor engine and its database serve several partners. This replaces the September
  one-pager's "dedicated server", and the reply should say so in one sentence rather than leave Milo to
  find it.
- Encryption at rest and nightly encrypted US backups with 30-day retention: state only what is
  actually running on the day.
- The move changed infrastructure only; the build under review is the same build.
- Until phases 2 and 3 finish, no GAC data remains in Germany once the fallback copies are deleted;
  give the deletion date.

## Fit with the 15 Oct date

| Day | Migration | Other GAC work (separate sessions) |
|---|---|---|
| Thu 8 | Order box, step 0, lower TTLs | stu005 investigation; holding note to Milo with the 15 Oct date and the Sunday move |
| Fri 9 | Build + rehearsal 1 | 13-subject validation runs start; practice-card figure support |
| Sat 10 | Rehearsal 2, backups, runbook | Depth audit; open-source item import (licences checked first) |
| Sun 11 | Cut-over | Review validation findings |
| Mon 12 | Settle | Fixes; GameClass delivery promised to Skyler is due today |
| Tue 13 | Regression on new box | Fixes; graph items audited |
| Wed 14 | Freeze ends | Build the release candidate into the pinned engine; re-validate |
| Thu 15 | — | Response, readiness table, evidence, requirements, RC named |

Risks to the date, in order: (1) what the 13-subject validation and the depth audit find is unknown and
their fixes have no slack; (2) GameClass is due Monday in the same week; (3) the release candidate is
built on Wed and validated in one day; (4) Contabo may take up to a day to hand over a new-region VPS.
