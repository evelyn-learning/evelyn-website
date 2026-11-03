import { strict as assert } from "node:assert";
import {
  parsePs, parsePm2Jlist, parseSystemctlShow, parseMeminfo, parseDu, parseFileStats,
  groupProcesses, buildDiskGroups, ageBuckets, KB,
} from "./vps-breakdown";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

// ---- parsers -------------------------------------------------------------

const PS = `
      1       0 root     14108  0.1 1266717 systemd         /usr/lib/systemd/systemd --system --deserialize=170
 846274       1 mongodb  10441728  3.2 1200000 mongod          /usr/bin/mongod --config /etc/mongod.conf
1194831    1100 root     594944  2.1  300000 next-server     (v1 next-server (v16.3.1)
 977096       1 root     899072  0.8  400000 node            /root/.nvm/versions/node/v22.21.1/bin/node dist/api/server.js
 808170       1 root     297984  0.0  500000 node            /root/.nvm/versions/node/v18.20.8/bin/node /root/stayfari-experts/server/app.js
   2000       1 root       512  0.0      10 sleep           sleep 30
   1130    1100 root     61440  0.3  600000 npm             npm start
   1343    1130 root    325632  0.7  600000 next-server     (v1 next-server (v16.1.6)
   5000       1 root    204800  0.1  100000 node            /root/.nvm/versions/node/v18.20.8/bin/node /root/stayfari/server/app.js
`;
test("parsePs: one row per line, args keep their spaces", () => {
  const rows = parsePs(PS);
  assert.equal(rows.length, 9);
  assert.deepEqual(rows[1], { pid: 846274, ppid: 1, user: "mongodb", rssKb: 10441728, cpu: 3.2, etimes: 1200000, comm: "mongod", args: "/usr/bin/mongod --config /etc/mongod.conf" });
  assert.equal(rows[2].args, "(v1 next-server (v16.3.1)");
});
test("parsePs: ignores blank and malformed lines", () => {
  assert.equal(parsePs("\n\ngarbage\n").length, 0);
});

const PM2 = JSON.stringify([
  { name: "evelyn-tutor", pid: 1194831, monit: { memory: 600000000, cpu: 2 }, pm2_env: { restart_time: 0, pm_uptime: 1700000000000, status: "online", pm_cwd: "/root/evelyn-tutor/apps/tutor" } },
  { name: "crimsora-web", pid: 1207572, monit: { memory: 200000000, cpu: 0 }, pm2_env: { restart_time: 3, pm_uptime: 1700000000000, status: "online", pm_cwd: "/root/crimsora" } },
  { name: "pagevault-client", pid: 1130, monit: { memory: 60000000, cpu: 0 }, pm2_env: { restart_time: 0, pm_uptime: 1700000000000, status: "online", pm_cwd: "/root/pagevault/client" } },
]);
test("parsePm2Jlist: name, pid, cwd, restarts", () => {
  const p = parsePm2Jlist(PM2);
  assert.equal(p.length, 3);
  assert.equal(p[0].name, "evelyn-tutor");
  assert.equal(p[0].cwd, "/root/evelyn-tutor/apps/tutor");
  assert.equal(p[1].restarts, 3);
});
test("parsePm2Jlist: bad json → empty", () => {
  assert.deepEqual(parsePm2Jlist("not json"), []);
});

const SYSTEMCTL = `Id=rydoviaapi.service
MainPID=977096
WorkingDirectory=/root/rydovia/api

Id=stayfari-experts.service
MainPID=808170
WorkingDirectory=/root/stayfari-experts

Id=nginx.service
MainPID=1500
WorkingDirectory=

Id=mongod.service
MainPID=846274
WorkingDirectory=
`;
test("parseSystemctlShow: blocks → unit/pid/cwd", () => {
  const u = parseSystemctlShow(SYSTEMCTL);
  assert.deepEqual(u[0], { unit: "rydoviaapi", pid: 977096, cwd: "/root/rydovia/api" });
  assert.equal(u[2].cwd, "");
});

const MEMINFO = `MemTotal:       24608116 kB
MemFree:         3450000 kB
MemAvailable:    6745000 kB
Buffers:          300000 kB
Cached:          3300000 kB
SwapTotal:       4194300 kB
SwapFree:        4193000 kB
`;
test("parseMeminfo: MB values and derived used", () => {
  const m = parseMeminfo(MEMINFO)!;
  assert.equal(m.totalMb, Math.round(24608116 / 1024));
  assert.equal(m.availableMb, Math.round(6745000 / 1024));
  assert.equal(m.usedMb, m.totalMb - m.freeMb - m.buffCacheMb);
  assert.equal(m.swapUsedMb, Math.round((4194300 - 4193000) / 1024));
});
test("parseMeminfo: missing keys → null", () => {
  assert.equal(parseMeminfo("nothing"), null);
});

test("parseDu: kb + path, tabs and spaces in paths", () => {
  const d = parseDu("1024\t/root/a\n2048\t/root/with space\n");
  assert.deepEqual(d, [{ path: "/root/a", kb: 1024 }, { path: "/root/with space", kb: 2048 }]);
});

test("parseFileStats: epoch + bytes lines", () => {
  const f = parseFileStats("1700000000.123 500\n1690000000 700\n");
  assert.deepEqual(f, [{ mtime: 1700000000.123, bytes: 500 }, { mtime: 1690000000, bytes: 700 }]);
});

// ---- memory grouping -----------------------------------------------------

test("groupProcesses: pm2 name wins, systemd unit next, /root/<dir> fallback, mongod = database", () => {
  const ps = parsePs(PS);
  const pm2 = parsePm2Jlist(PM2);
  const units = parseSystemctlShow(SYSTEMCTL);
  const { processes, groups } = groupProcesses(ps, pm2, units, { minMb: 1 });
  const byName = Object.fromEntries(processes.map(p => [p.name, p]));
  assert.equal(byName["evelyn-tutor"].kind, "pm2");
  assert.equal(byName["evelyn-tutor"].restarts, 0);
  assert.equal(byName["rydoviaapi"].kind, "systemd");
  assert.equal(byName["mongod"].kind, "database", "mongod stays a database even though mongod.service owns the pid");
  assert.equal(byName["mongod"].rssMb, Math.round(10441728 / 1024));
  assert.equal(processes[0].name, "mongod", "sorted by RSS desc");
  const g = Object.fromEntries(groups.map(x => [x.key, x]));
  assert.equal(g.database.rssMb, byName["mongod"].rssMb);
  assert.equal(g.pm2.count, 3, "evelyn-tutor + pagevault-client + its next-server child");
  assert.equal(g.systemd.count, 2);
  assert.equal(g.system.count, 3, "systemd(pid1) + sleep + stayfari node");
});
test("groupProcesses: a next-server child of `npm start` inherits the pm2 app name", () => {
  const { processes } = groupProcesses(parsePs(PS), parsePm2Jlist(PM2), [], { minMb: 1 });
  const child = processes.find(p => p.pid === 1343)!;
  assert.equal(child.name, "pagevault-client");
  assert.equal(child.kind, "pm2");
  assert.equal(child.viaParent, true);
  assert.equal(child.restarts, undefined, "restart count belongs to the pm2 row, not the child");
});
test("groupProcesses: /root/.nvm/… node path still resolves to the project folder", () => {
  const { processes } = groupProcesses(parsePs(PS), [], [], { minMb: 1 });
  assert.equal(processes.find(p => p.pid === 5000)!.name, "stayfari");
  assert.equal(processes.find(p => p.pid === 808170)!.name, "stayfari-experts");
});
test("groupProcesses: tiny processes fold into one row", () => {
  const { processes } = groupProcesses(parsePs(PS), [], [], { minMb: 50 });
  const small = processes.find(p => p.kind === "system" && p.pid === 0)!;
  assert.ok(small, "synthetic row exists");
  assert.equal(small.count, 2, "systemd 13 MB + sleep (npm 60 MB stays)");
  assert.ok(small.name.includes("2 small processes"));
});

// ---- disk grouping -------------------------------------------------------

const NOW = 1_800_000_000; // epoch seconds
const DAY = 86400;
test("ageBuckets: four buckets, counts and bytes", () => {
  const b = ageBuckets([
    { mtime: NOW - 1 * DAY, bytes: 10 }, { mtime: NOW - 20 * DAY, bytes: 20 },
    { mtime: NOW - 60 * DAY, bytes: 30 }, { mtime: NOW - 200 * DAY, bytes: 40 }, { mtime: NOW - 400 * DAY, bytes: 1 },
  ], NOW);
  assert.deepEqual(b.map(x => [x.label, x.count, x.bytes]), [
    ["last 7 days", 1, 10], ["8–30 days", 1, 20], ["31–90 days", 1, 30], ["older than 90 days", 2, 41],
  ]);
});

function diskInput() {
  return {
    now: NOW,
    usedBytes: 100 * KB * KB * KB, // 100 GB
    rootDirs: [
      { path: "/root/evelyn-tutor", kb: 2_300_000, mtime: NOW - DAY },
      { path: "/root/rydovia", kb: 5_400_000, mtime: NOW - DAY },
      { path: "/root/stayfari-static", kb: 366_000, mtime: NOW - 30 * DAY },
      { path: "/root/backups", kb: 38_000_000, mtime: NOW - 20 * DAY },
      { path: "/root/.npm", kb: 2_200_000, mtime: NOW },
      { path: "/root/.pm2", kb: 300_000, mtime: NOW },
      { path: "/root/.nvm", kb: 400_000, mtime: NOW },
      { path: "/root/notes.txt", kb: 4, mtime: NOW },
    ],
    appSubdirs: [
      { path: "/root/evelyn-tutor/node_modules", kb: 1_700_000 },
      { path: "/root/evelyn-tutor/apps/tutor/.next", kb: 400_000 },
      { path: "/root/rydovia/client/.next", kb: 3_000_000 },
    ],
    pm2: parsePm2Jlist(PM2),
    units: parseSystemctlShow(SYSTEMCTL),
    dataDirs: [{ path: "/var/data/evelyn/audio", kb: 36_000_000, mtime: NOW }],
    dataFiles: { "/var/data/evelyn/audio": [{ mtime: NOW - DAY, bytes: 1000 }, { mtime: NOW - 100 * DAY, bytes: 5000 }] },
    backups: [
      { path: "/root/backups/prod-stayfari.kpb9v-dump", kb: 38_000_000, mtime: NOW - 200 * DAY },
      { path: "/root/backups/pre-deploy-test-2026-10-13", kb: 1000, mtime: NOW - 20 * DAY },
    ],
    logs: [
      { path: "/var/log/journal", kb: 1_400_000 }, { path: "/var/log/nginx", kb: 134_000 }, { path: "/var/log/tiny.log", kb: 10 },
    ],
    logFiles: [{ path: "/root/.pm2/logs/evelyn-marketing-error.log", kb: 52_000 }],
    caches: [{ path: "/var/cache/apt", kb: 504_000 }],
    mongo: { dataKb: 7_700_000, dbs: [{ name: "autobot", bytes: 5e9 }, { name: "evelyn", bytes: 2e9 }] },
    systemDirs: [{ path: "/usr", kb: 3_100_000 }, { path: "/var/lib", kb: 7_900_000 }],
  };
}

test("buildDiskGroups: app dirs are labelled by what runs from them", () => {
  const { groups } = buildDiskGroups(diskInput());
  const apps = groups.find(g => g.key === "apps")!;
  const tutor = apps.items.find(i => i.path === "/root/evelyn-tutor")!;
  assert.equal(tutor.label, "evelyn-tutor");
  assert.equal(tutor.note, "runs: evelyn-tutor (pm2)");
  const ry = apps.items.find(i => i.path === "/root/rydovia")!;
  assert.equal(ry.note, "runs: rydoviaapi (systemd)");
  // children: node_modules, .next, remainder
  const kids = tutor.children!.map(c => [c.label, c.bytes]);
  assert.deepEqual(kids, [
    ["node_modules", 1_700_000 * KB], [".next (build)", 400_000 * KB], ["source & other", 200_000 * KB],
  ]);
});
test("buildDiskGroups: folders with nothing running are their own group with age", () => {
  const { groups } = buildDiskGroups(diskInput());
  const idle = groups.find(g => g.key === "idle")!;
  assert.equal(idle.items.length, 1);
  assert.equal(idle.items[0].label, "stayfari-static");
  assert.equal(idle.items[0].note, "no running process · 30 days old");
});
test("buildDiskGroups: data dirs carry age buckets; backups carry dates; caches include .npm", () => {
  const { groups } = buildDiskGroups(diskInput());
  const data = groups.find(g => g.key === "data")!;
  assert.equal(data.bytes, 36_000_000 * KB);
  assert.equal(data.items[0].count, 2);
  assert.equal(data.items[0].children!.length, 4);
  const backups = groups.find(g => g.key === "backups")!;
  assert.equal(backups.items[0].label, "prod-stayfari.kpb9v-dump");
  assert.equal(backups.items[0].note, "200 days old");
  const caches = groups.find(g => g.key === "caches")!;
  assert.ok(caches.items.some(i => i.path === "/root/.npm"));
  assert.ok(caches.items.some(i => i.path === "/var/cache/apt"));
});
test("buildDiskGroups: databases list per-DB with a journal remainder; logs drop <1 MB and include pm2 files", () => {
  const { groups } = buildDiskGroups(diskInput());
  const db = groups.find(g => g.key === "databases")!;
  assert.equal(db.bytes, 7_700_000 * KB);
  assert.deepEqual(db.items.map(i => i.label), ["autobot", "evelyn", "journal & other"]);
  const withLocal = buildDiskGroups({ ...diskInput(), mongo: { dataKb: 7_700_000, dbs: [{ name: "local", bytes: 3e9 }] } });
  assert.match(withLocal.groups.find(g => g.key === "databases")!.items.find(i => i.label === "local")!.note!, /oplog/);
  assert.equal(db.items[2].bytes, 7_700_000 * KB - 7e9);
  const logs = groups.find(g => g.key === "logs")!;
  assert.ok(!logs.items.some(i => i.path === "/var/log/tiny.log"));
  const pm2 = logs.items.find(i => i.path === "/root/.pm2/logs")!;
  assert.equal(pm2.children![0].label, "evelyn-marketing-error.log");
});
test("buildDiskGroups: 'everything else' closes the gap to used bytes and is never negative", () => {
  const r = buildDiskGroups(diskInput());
  const rest = r.groups.find(g => g.key === "other")!;
  const sumNamed = r.groups.filter(g => g.key !== "other").reduce((s, g) => s + g.bytes, 0);
  assert.equal(rest.bytes, r.usedBytes - sumNamed);
  assert.ok(rest.bytes >= 0);
  const tiny = buildDiskGroups({ ...diskInput(), usedBytes: 1 });
  assert.equal(tiny.groups.find(g => g.key === "other")!.bytes, 0);
});
test("buildDiskGroups: groups sorted by size desc, reclaimable hint = logs + caches", () => {
  const r = buildDiskGroups(diskInput());
  for (let i = 1; i < r.groups.length; i++) assert.ok(r.groups[i - 1].bytes >= r.groups[i].bytes || r.groups[i].key === "other");
  const logs = r.groups.find(g => g.key === "logs")!.bytes, caches = r.groups.find(g => g.key === "caches")!.bytes;
  assert.equal(r.reclaimableHintBytes, logs + caches);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
