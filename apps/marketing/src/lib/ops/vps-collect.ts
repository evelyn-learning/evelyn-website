/**
 * Server-side collector for the admin System Health breakdown.
 * Runs read-only shell commands (ps, du, find, stat, df, pm2 jlist,
 * systemctl show) under nice/ionice, feeds the output to the pure parsers
 * in vps-breakdown.ts, and caches the result for CACHE_TTL_MS because a cold
 * `du` over every app directory takes ~50 s on the prod box (6 s warm).
 *
 * Nothing in here writes, moves or deletes anything.
 */
import { execFile } from "child_process";
import { readFile } from "fs/promises";
import os from "os";
import mongoose from "mongoose";
import { connectDB } from "@core/db";
import {
  parsePs, parsePm2Jlist, parseSystemctlShow, parseMeminfo, parseDu, parseFileStats,
  groupProcesses, buildDiskGroups, KB,
  type DuEntry, type FileStat, type MemInfo, type MemProcess, type MemGroup, type DiskBreakdown,
} from "./vps-breakdown";

export interface VpsBreakdown {
  generatedAt: string;
  scanMs: number;
  cached: boolean;
  platform: string;
  load: number[];
  cpuCores: number;
  memory: { info: MemInfo | null; processes: MemProcess[]; groups: MemGroup[] };
  disk: (DiskBreakdown & { totalBytes: number; availableBytes: number; scanned: true }) | { scanned: false; note: string };
  warnings: string[];
}

const CACHE_TTL_MS = 15 * 60 * 1000;
const CMD_TIMEOUT_MS = 150_000;
const MAX_BUFFER = 64 * 1024 * 1024;

const APP_ROOT = process.env.ADMIN_VPS_APP_ROOT || "/root";
const DATA_DIRS = (process.env.ADMIN_VPS_DATA_DIRS || "/var/data/evelyn").split(",").map((s) => s.trim()).filter(Boolean);
const BACKUP_DIRS = (process.env.ADMIN_VPS_BACKUP_DIRS || "/root/backups").split(",").map((s) => s.trim()).filter(Boolean);
const MONGO_DATA_DIR = process.env.ADMIN_VPS_MONGO_DIR || "/var/lib/mongodb";

let cache: { at: number; data: VpsBreakdown } | null = null;
let inflight: Promise<VpsBreakdown> | null = null;

/** Run a bash snippet; never throws — a failing command just yields "" and a warning. */
async function sh(cmd: string, warnings: string[], label: string): Promise<string> {
  return new Promise((resolve) => {
    execFile("bash", ["-c", cmd], { timeout: CMD_TIMEOUT_MS, maxBuffer: MAX_BUFFER, env: { ...process.env, LC_ALL: "C" } }, (err, stdout) => {
      if (err && !stdout) { warnings.push(`${label}: ${String(err.message).split("\n")[0]}`); resolve(""); return; }
      resolve(String(stdout));
    });
  });
}

const NICE = "if command -v ionice >/dev/null 2>&1; then ionice -c3 nice -n19 \"$@\"; else nice -n19 \"$@\"; fi";
/** `du -xsk` wrapped in nice/ionice so a scan never competes with the tutor. */
const du = (paths: string) => `bash -c '${NICE}' _ du -xsk ${paths} 2>/dev/null`;
/** `du` lines + mtimes for the same paths. */
const duWithMtime = (paths: string) => `${du(paths)}; echo "__MTIME__"; stat -c '%Y\t%n' ${paths} 2>/dev/null`;

function parseDuWithMtime(out: string): DuEntry[] {
  const [duPart, mtPart = ""] = out.split("__MTIME__");
  const mt = new Map<string, number>();
  for (const line of mtPart.split("\n")) { const m = line.match(/^(\d+)\t(.+)$/); if (m) mt.set(m[2], +m[1]); }
  return parseDu(duPart).map((d) => ({ ...d, mtime: mt.get(d.path) }));
}

/** macOS `ps` has no `etimes`; turn its `etime` ([[dd-]hh:]mm:ss) into seconds so parsePs sees one format. */
function normalizeEtime(out: string): string {
  return out.split("\n").map((line) => line.replace(/^(\s*\d+\s+\d+\s+\S+\s+\d+\s+[\d.]+\s+)(\S+)/, (_, head, et) => {
    if (/^\d+$/.test(et)) return head + et;
    const m = et.match(/^(?:(\d+)-)?(?:(\d+):)?(\d+):(\d+)$/);
    if (!m) return head + "0";
    const secs = (+(m[1] ?? 0)) * 86400 + (+(m[2] ?? 0)) * 3600 + (+m[3]) * 60 + (+m[4]);
    return head + secs;
  })).join("\n");
}

async function listMongoDbs(warnings: string[]): Promise<{ name: string; bytes: number }[]> {
  try {
    await connectDB();
    const admin = mongoose.connection.db?.admin();
    if (!admin) return [];
    const res = await admin.listDatabases();
    return (res.databases ?? []).map((d) => ({ name: d.name, bytes: Number(d.sizeOnDisk ?? 0) })).sort((a, b) => b.bytes - a.bytes);
  } catch (e) {
    warnings.push(`mongo listDatabases: ${e instanceof Error ? e.message : String(e)}`);
    return [];
  }
}

async function collect(): Promise<VpsBreakdown> {
  const t0 = Date.now();
  const warnings: string[] = [];
  const linux = os.platform() === "linux";

  // ---- processes (works on linux + macOS)
  const psCmd = linux
    ? "ps -eo pid,ppid,user,rss,pcpu,etimes,comm,args --no-headers"
    : "ps -axo pid,ppid,user,rss,pcpu,etime,comm,args | tail -n +2";
  const [psOut, pm2Out, unitsOut, meminfoText] = await Promise.all([
    sh(psCmd, warnings, "ps").then((o) => (linux ? o : normalizeEtime(o))),
    sh("PM2=$(command -v pm2 || ls /usr/local/bin/pm2 /usr/bin/pm2 \"$HOME\"/.nvm/versions/node/*/bin/pm2 2>/dev/null | head -1); [ -n \"$PM2\" ] && \"$PM2\" jlist 2>/dev/null || echo '[]'", warnings, "pm2 jlist"),
    linux ? sh("systemctl list-units --type=service --state=running --no-legend --plain 2>/dev/null | awk '{print $1}' | xargs -r systemctl show --property=Id,MainPID,WorkingDirectory", warnings, "systemctl") : Promise.resolve(""),
    linux ? readFile("/proc/meminfo", "utf8").catch(() => "") : Promise.resolve(""),
  ]);
  const pm2 = parsePm2Jlist(pm2Out);
  const units = parseSystemctlShow(unitsOut);
  const memory = { info: parseMeminfo(meminfoText), ...groupProcesses(parsePs(psOut), pm2, units) };

  // ---- disk (linux only: du -x / stat -c / find -printf are GNU)
  let disk: VpsBreakdown["disk"] = { scanned: false, note: "Disk breakdown runs on the Linux server only." };
  if (linux) {
    const dfOut = await sh("df -kP / | tail -1", warnings, "df");
    const [, totalKb, usedKb, availKb] = dfOut.trim().split(/\s+/).map(Number);
    const dataRootsGlob = DATA_DIRS.map((d) => `${d}/*`).join(" ");
    const backupGlob = BACKUP_DIRS.map((d) => `${d}/*`).join(" ");

    const [rootOut, subOut, dataOut, backupOut, logsOut, logFilesOut, cachesOut, mongoOut, sysOut, dbs] = await Promise.all([
      sh(duWithMtime(`${APP_ROOT}/* ${APP_ROOT}/.npm ${APP_ROOT}/.cache ${APP_ROOT}/.pm2 ${APP_ROOT}/.nvm`), warnings, "du root"),
      sh(`find ${APP_ROOT} -mindepth 2 -maxdepth 5 -type d \\( -name node_modules -o -name .next \\) -prune -print0 2>/dev/null | xargs -0 -r bash -c '${NICE}' _ du -xsk 2>/dev/null`, warnings, "du app subdirs"),
      sh(duWithMtime(dataRootsGlob), warnings, "du data"),
      sh(duWithMtime(backupGlob), warnings, "du backups"),
      sh(du("/var/log/*"), warnings, "du logs"),
      sh(`${du(`${APP_ROOT}/.pm2/logs/*`)} | sort -rn | head -12`, warnings, "du pm2 logs"),
      sh(du("/var/cache/apt /var/lib/snapd /var/cache/nginx"), warnings, "du caches"),
      sh(du(MONGO_DATA_DIR), warnings, "du mongo"),
      sh(du(`--exclude='${MONGO_DATA_DIR}' /usr /var/lib /opt /snap /boot /home /srv /tmp`), warnings, "du system"),
      listMongoDbs(warnings),
    ]);

    const dataDirs = parseDuWithMtime(dataOut);
    const dataFiles: Record<string, FileStat[]> = {};
    await Promise.all(dataDirs.map(async (d) => {
      const out = await sh(`find '${d.path.replace(/'/g, "'\\''")}' -type f -printf '%T@ %s\\n' 2>/dev/null`, warnings, `find ${d.path}`);
      dataFiles[d.path] = parseFileStats(out);
    }));

    const breakdown = buildDiskGroups({
      now: Math.floor(Date.now() / 1000),
      usedBytes: (usedKb || 0) * KB,
      rootDirs: parseDuWithMtime(rootOut),
      appSubdirs: parseDu(subOut),
      pm2, units,
      dataDirs, dataFiles,
      backups: parseDuWithMtime(backupOut),
      logs: parseDu(logsOut),
      logFiles: parseDu(logFilesOut),
      caches: parseDu(cachesOut),
      mongo: { dataKb: parseDu(mongoOut)[0]?.kb ?? 0, dbs },
      systemDirs: parseDu(sysOut),
    });
    disk = { ...breakdown, totalBytes: (totalKb || 0) * KB, availableBytes: (availKb || 0) * KB, scanned: true };
  }

  return {
    generatedAt: new Date().toISOString(),
    scanMs: Date.now() - t0,
    cached: false,
    platform: os.platform(),
    load: os.loadavg(),
    cpuCores: os.cpus().length,
    memory, disk, warnings,
  };
}

export async function getVpsBreakdown(opts: { refresh?: boolean } = {}): Promise<VpsBreakdown> {
  if (!opts.refresh && cache && Date.now() - cache.at < CACHE_TTL_MS) return { ...cache.data, cached: true };
  if (!inflight) {
    inflight = collect().then((data) => { cache = { at: Date.now(), data }; return data; }).finally(() => { inflight = null; });
  }
  return inflight;
}
