/**
 * Pure parsers + grouping for the admin "System Health" breakdown.
 * No I/O here: vps-collect.ts runs the commands and feeds the strings in,
 * so everything in this file is unit-testable with fixtures.
 *
 * Read-only by design: there is deliberately no delete / cleanup path
 * anywhere in the breakdown (2026-11-03, Praveen: "security risk, I can
 * always delete from the shell").
 */

export const KB = 1024;

// ---------------------------------------------------------------- parsers

export interface ProcRow { pid: number; ppid: number; user: string; rssKb: number; cpu: number; etimes: number; comm: string; args: string }

/** `ps -eo pid,ppid,user,rss,pcpu,etimes,comm,args --no-headers` */
export function parsePs(out: string): ProcRow[] {
  const rows: ProcRow[] = [];
  for (const raw of out.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+([\d.]+)\s+(\d+)\s+(\S+)\s*(.*)$/);
    if (!m) continue;
    rows.push({ pid: +m[1], ppid: +m[2], user: m[3], rssKb: +m[4], cpu: +m[5], etimes: +m[6], comm: m[7], args: m[8] });
  }
  return rows;
}

export interface Pm2Proc { name: string; pid: number; cwd: string; restarts: number; uptimeMs: number | null; status: string; memory: number; cpu: number }

/** `pm2 jlist` */
export function parsePm2Jlist(json: string): Pm2Proc[] {
  let list: unknown;
  try { list = JSON.parse(json); } catch { return []; }
  if (!Array.isArray(list)) return [];
  return list.map((p) => {
    const o = p as Record<string, unknown>;
    const env = (o.pm2_env ?? {}) as Record<string, unknown>;
    const monit = (o.monit ?? {}) as Record<string, unknown>;
    return {
      name: String(o.name ?? ""),
      pid: Number(o.pid ?? 0),
      cwd: String(env.pm_cwd ?? ""),
      restarts: Number(env.restart_time ?? 0),
      uptimeMs: typeof env.pm_uptime === "number" ? env.pm_uptime : null,
      status: String(env.status ?? ""),
      memory: Number(monit.memory ?? 0),
      cpu: Number(monit.cpu ?? 0),
    };
  }).filter((p) => p.name);
}

export interface UnitRow { unit: string; pid: number; cwd: string }

/** `systemctl show --property=Id,MainPID,WorkingDirectory <units…>` (blank line between units) */
export function parseSystemctlShow(out: string): UnitRow[] {
  const units: UnitRow[] = [];
  for (const block of out.split(/\n\s*\n/)) {
    const kv: Record<string, string> = {};
    for (const line of block.split("\n")) {
      const i = line.indexOf("=");
      if (i > 0) kv[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    if (!kv.Id) continue;
    units.push({ unit: kv.Id.replace(/\.service$/, ""), pid: Number(kv.MainPID ?? 0), cwd: kv.WorkingDirectory ?? "" });
  }
  return units;
}

export interface MemInfo { totalMb: number; freeMb: number; availableMb: number; buffCacheMb: number; usedMb: number; swapTotalMb: number; swapUsedMb: number }

/** /proc/meminfo */
export function parseMeminfo(text: string): MemInfo | null {
  const kb: Record<string, number> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^(\w+):\s+(\d+)\s*kB/);
    if (m) kb[m[1]] = +m[2];
  }
  if (!kb.MemTotal || kb.MemFree === undefined) return null;
  const mb = (k: number) => Math.round(k / KB);
  const buffCache = (kb.Buffers ?? 0) + (kb.Cached ?? 0) + (kb.SReclaimable ?? 0);
  const totalMb = mb(kb.MemTotal), freeMb = mb(kb.MemFree), buffCacheMb = mb(buffCache);
  return {
    totalMb, freeMb, buffCacheMb,
    availableMb: mb(kb.MemAvailable ?? kb.MemFree),
    usedMb: totalMb - freeMb - buffCacheMb,
    swapTotalMb: mb(kb.SwapTotal ?? 0),
    swapUsedMb: mb((kb.SwapTotal ?? 0) - (kb.SwapFree ?? 0)),
  };
}

export interface DuEntry { path: string; kb: number; mtime?: number }

/** `du -xsk …` → "kb<TAB>path" lines */
export function parseDu(out: string): DuEntry[] {
  const rows: DuEntry[] = [];
  for (const line of out.split("\n")) {
    const m = line.match(/^(\d+)\t(.+)$/);
    if (m) rows.push({ path: m[2], kb: +m[1] });
  }
  return rows;
}

export interface FileStat { mtime: number; bytes: number }

/** `find … -printf '%T@ %s\n'` */
export function parseFileStats(out: string): FileStat[] {
  const rows: FileStat[] = [];
  for (const line of out.split("\n")) {
    const m = line.match(/^([\d.]+)\s+(\d+)$/);
    if (m) rows.push({ mtime: +m[1], bytes: +m[2] });
  }
  return rows;
}

// --------------------------------------------------------------- memory

export type ProcKind = "pm2" | "systemd" | "database" | "system";

export interface MemProcess {
  name: string; kind: ProcKind; pid: number; rssMb: number; cpu: number; uptimeSec: number;
  restarts?: number; status?: string; cmd: string; count?: number;
  /** true when the name was inherited from a pm2/systemd ancestor (e.g. the next-server child of `npm start`) */
  viaParent?: boolean;
}
export interface MemGroup { key: ProcKind; label: string; rssMb: number; count: number }

const GROUP_LABEL: Record<ProcKind, string> = {
  database: "MongoDB (mongod)",
  pm2: "Node apps under pm2",
  systemd: "Services under systemd",
  system: "System & other",
};

function shortCmd(args: string): string {
  return args.length > 90 ? args.slice(0, 87) + "…" : args;
}

/**
 * Name every process the way an operator knows it: pm2 name, then mongod,
 * then systemd unit, then the nearest pm2/systemd ancestor (pm2 → `npm start`
 * → `next-server` children carry their app's name), then the /root/<project>
 * folder it runs from, else the command. Rows under `minMb` fold into one
 * synthetic "N small processes" row.
 */
export function groupProcesses(ps: ProcRow[], pm2: Pm2Proc[], units: UnitRow[], opts: { minMb?: number } = {}): { processes: MemProcess[]; groups: MemGroup[] } {
  const minMb = opts.minMb ?? 10;
  const byPm2 = new Map(pm2.map((p) => [p.pid, p]));
  const byUnit = new Map(units.filter((u) => u.pid > 0).map((u) => [u.pid, u]));
  const byPid = new Map(ps.map((r) => [r.pid, r]));
  const named: MemProcess[] = [];
  const small = { rssMb: 0, cpu: 0, count: 0 };

  type Ident = { kind: ProcKind; name: string; restarts?: number; status?: string };
  const direct = (r: ProcRow): Ident | null => {
    const p = byPm2.get(r.pid);
    if (p) return { kind: "pm2", name: p.name, restarts: p.restarts, status: p.status };
    if (/^mongod\b/.test(r.comm)) return { kind: "database", name: "mongod" };
    const u = byUnit.get(r.pid);
    if (u) return { kind: "systemd", name: u.unit };
    return null;
  };
  const projectDir = (args: string): string | null => {
    for (const m of args.matchAll(/\/root\/([^/\s]+)\//g)) if (!m[1].startsWith(".")) return m[1];
    return null;
  };

  for (const r of ps) {
    const rssMb = Math.round(r.rssKb / KB);
    let id = direct(r), viaParent = false;
    if (!id) {
      // walk up the parent chain (bounded) to inherit a pm2 / systemd identity
      let cur = byPid.get(r.ppid);
      for (let depth = 0; cur && depth < 6 && !id; depth++) {
        const d = direct(cur);
        if (d && d.kind !== "database" && !/^pm2-/.test(d.name) && d.name !== "init") { id = { kind: d.kind, name: d.name }; viaParent = true; }
        cur = byPid.get(cur.ppid);
      }
    }
    if (!id) id = { kind: "system", name: projectDir(r.args) ?? r.comm };
    if (id.kind === "system" && rssMb < minMb) { small.rssMb += rssMb; small.cpu += r.cpu; small.count++; continue; }
    named.push({ name: id.name, kind: id.kind, pid: r.pid, rssMb, cpu: r.cpu, uptimeSec: r.etimes, restarts: id.restarts, status: id.status, cmd: shortCmd(r.args), viaParent: viaParent || undefined });
  }
  if (small.count) {
    named.push({ name: `${small.count} small processes (< ${minMb} MB each)`, kind: "system", pid: 0, rssMb: small.rssMb, cpu: Math.round(small.cpu * 10) / 10, uptimeSec: 0, cmd: "", count: small.count });
  }
  named.sort((a, b) => b.rssMb - a.rssMb);

  const groups = new Map<ProcKind, MemGroup>();
  for (const p of named) {
    const g = groups.get(p.kind) ?? { key: p.kind, label: GROUP_LABEL[p.kind], rssMb: 0, count: 0 };
    g.rssMb += p.rssMb; g.count += p.count ?? 1; groups.set(p.kind, g);
  }
  return { processes: named, groups: [...groups.values()].sort((a, b) => b.rssMb - a.rssMb) };
}

// ----------------------------------------------------------------- disk

export interface DiskItem { label: string; path?: string; bytes: number; mtime?: number; count?: number; note?: string; children?: DiskItem[] }
export interface DiskGroup { key: string; label: string; bytes: number; items: DiskItem[]; note?: string }

export interface DiskInput {
  now: number;                     // epoch seconds
  usedBytes: number;
  rootDirs: DuEntry[];             // du of /root/* and the dot-dirs we care about (with mtime)
  appSubdirs: DuEntry[];           // du of node_modules / .next inside the app dirs
  pm2: Pm2Proc[];
  units: UnitRow[];
  dataDirs: DuEntry[];             // e.g. /var/data/evelyn/*
  dataFiles: Record<string, FileStat[]>; // per data dir, every file's mtime + size
  backups: DuEntry[];              // entries of the backup dir(s), with mtime
  logs: DuEntry[];                 // /var/log/* entries
  logFiles: DuEntry[];             // the biggest pm2 log files
  caches: DuEntry[];               // /var/cache/apt etc.
  mongo: { dataKb: number; dbs: { name: string; bytes: number }[] };
  systemDirs: DuEntry[];           // /usr, /var/lib (minus mongo) … informational
}

export interface DiskBreakdown { usedBytes: number; groups: DiskGroup[]; accountedBytes: number; reclaimableHintBytes: number }

const DAY = 86400;
export function daysOld(mtime: number, now: number): number { return Math.max(0, Math.floor((now - mtime) / DAY)); }
function ageNote(mtime: number | undefined, now: number): string {
  if (mtime === undefined) return "";
  const d = daysOld(mtime, now);
  return d === 0 ? "today" : d === 1 ? "1 day old" : `${d} days old`;
}
const base = (p: string) => p.replace(/\/+$/, "").split("/").pop() ?? p;

export function ageBuckets(files: FileStat[], now: number): DiskItem[] {
  const b = [
    { label: "last 7 days", max: 7 }, { label: "8–30 days", max: 30 }, { label: "31–90 days", max: 90 }, { label: "older than 90 days", max: Infinity },
  ].map((x) => ({ label: x.label, max: x.max, bytes: 0, count: 0 }));
  for (const f of files) {
    const d = (now - f.mtime) / DAY;
    const slot = b.find((x) => d <= x.max) ?? b[b.length - 1];
    slot.bytes += f.bytes; slot.count++;
  }
  return b.map(({ label, bytes, count }) => ({ label, bytes, count }));
}

/** Which named processes run out of a given /root/<dir>? */
function runners(dir: string, pm2: Pm2Proc[], units: UnitRow[]): string[] {
  const inside = (cwd: string) => cwd === dir || cwd.startsWith(dir + "/");
  const names = [
    ...pm2.filter((p) => inside(p.cwd)).map((p) => `${p.name} (pm2)`),
    ...units.filter((u) => u.cwd && inside(u.cwd)).map((u) => `${u.unit} (systemd)`),
  ];
  return [...new Set(names)];
}

export function buildDiskGroups(input: DiskInput): DiskBreakdown {
  const { now, pm2, units } = input;
  const B = (kb: number) => kb * KB;
  const isHidden = (p: string) => base(p).startsWith(".");

  // --- /root/* → apps / idle / caches / logs
  const apps: DiskItem[] = [], idle: DiskItem[] = [];
  const caches: DiskItem[] = input.caches.map((c) => ({ label: base(c.path) === "apt" ? "apt package cache" : base(c.path), path: c.path, bytes: B(c.kb) }));
  const logs: DiskItem[] = [];
  const backupRoots = new Set(input.backups.map((b) => b.path.replace(/\/[^/]+$/, "")));

  for (const d of input.rootDirs) {
    const name = base(d.path);
    if (backupRoots.has(d.path)) continue;                  // handled by the backups group
    if (name === ".npm" || name === ".cache") { caches.push({ label: name === ".npm" ? "npm cache (~/.npm)" : "~/.cache", path: d.path, bytes: B(d.kb) }); continue; }
    if (name === ".pm2") { continue; }                        // its logs are in logFiles; the rest is tiny
    if (isHidden(d.path)) { continue; }                       // .nvm, .ssh, … → "everything else"
    if (d.kb < 1024) continue;                                // < 1 MB: files, scripts — noise
    const who = runners(d.path, pm2, units);
    if (who.length) {
      const subs = input.appSubdirs.filter((s) => s.path.startsWith(d.path + "/"));
      const nm = subs.filter((s) => base(s.path) === "node_modules").reduce((s, x) => s + x.kb, 0);
      const nx = subs.filter((s) => base(s.path) === ".next").reduce((s, x) => s + x.kb, 0);
      const children: DiskItem[] = [];
      if (nm) children.push({ label: "node_modules", bytes: B(nm) });
      if (nx) children.push({ label: ".next (build)", bytes: B(nx) });
      children.push({ label: "source & other", bytes: Math.max(0, B(d.kb - nm - nx)) });
      apps.push({ label: name, path: d.path, bytes: B(d.kb), mtime: d.mtime, note: `runs: ${who.join(", ")}`, children });
    } else {
      idle.push({ label: name, path: d.path, bytes: B(d.kb), mtime: d.mtime, note: `no running process · ${ageNote(d.mtime, now)}` });
    }
  }

  // --- data dirs (recordings etc.) with age buckets
  const data: DiskItem[] = input.dataDirs.map((d) => {
    const files = input.dataFiles[d.path] ?? [];
    return { label: base(d.path), path: d.path, bytes: B(d.kb), count: files.length || undefined, children: files.length ? ageBuckets(files, now) : undefined };
  });

  // --- backups with dates
  const backups: DiskItem[] = input.backups.map((b) => ({ label: base(b.path), path: b.path, bytes: B(b.kb), mtime: b.mtime, note: ageNote(b.mtime, now) }));

  // --- databases
  const dbBytes = input.mongo.dbs.reduce((s, d) => s + d.bytes, 0);
  const databases: DiskItem[] = [
    ...input.mongo.dbs.map((d) => ({ label: d.name, bytes: d.bytes, note: d.name === "local" ? "replica-set oplog (fixed-size ring, not app data)" : undefined })),
    { label: "journal & other", bytes: Math.max(0, B(input.mongo.dataKb) - dbBytes) },
  ];

  // --- logs (≥ 1 MB) + pm2 log files
  for (const l of input.logs) if (l.kb >= 1024) logs.push({ label: base(l.path), path: l.path, bytes: B(l.kb) });
  if (input.logFiles.length) {
    const pm2Dir = input.logFiles[0].path.replace(/\/[^/]+$/, "");
    const total = input.rootDirs.find((d) => base(d.path) === ".pm2");
    logs.push({
      label: "pm2 logs", path: pm2Dir, bytes: B(total?.kb ?? input.logFiles.reduce((s, f) => s + f.kb, 0)),
      children: input.logFiles.map((f) => ({ label: base(f.path), path: f.path, bytes: B(f.kb) })),
    });
  }

  const sum = (xs: DiskItem[]) => xs.reduce((s, x) => s + x.bytes, 0);
  const sortDesc = <T extends { bytes: number }>(xs: T[]) => xs.sort((a, b) => b.bytes - a.bytes);
  const groups: DiskGroup[] = [
    { key: "apps", label: "App directories", bytes: sum(apps), items: sortDesc(apps), note: "code + node_modules + builds of every deployed app" },
    { key: "data", label: "Data & recordings", bytes: sum(data), items: sortDesc(data) },
    { key: "backups", label: "Backups", bytes: sum(backups), items: sortDesc(backups) },
    { key: "databases", label: "Databases (MongoDB on disk)", bytes: B(input.mongo.dataKb), items: sortDesc(databases) },
    { key: "logs", label: "Logs", bytes: sum(logs), items: sortDesc(logs) },
    { key: "caches", label: "Caches", bytes: sum(caches), items: sortDesc(caches) },
    { key: "idle", label: "Folders with nothing running", bytes: sum(idle), items: sortDesc(idle), note: "in /root but no pm2 or systemd process runs from them" },
  ].filter((g) => g.items.length > 0);
  sortDesc(groups);

  const accounted = groups.reduce((s, g) => s + g.bytes, 0);
  const sys = input.systemDirs.map((d) => ({ label: d.path, path: d.path, bytes: B(d.kb) }));
  groups.push({
    key: "other", label: "System, packages & everything else", bytes: Math.max(0, input.usedBytes - accounted),
    items: sortDesc(sys), note: "OS, /usr, package libraries, tooling — the gap between the groups above and the disk total",
  });

  const g = (k: string) => groups.find((x) => x.key === k)?.bytes ?? 0;
  return { usedBytes: input.usedBytes, groups, accountedBytes: accounted, reclaimableHintBytes: g("logs") + g("caches") };
}
