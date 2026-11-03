'use client';

/**
 * Expandable Memory / Disk panels for the admin System Health card.
 * Data comes from GET /api/admin/health/breakdown (read-only; the server
 * caches a scan for 15 min). There is intentionally no delete action here.
 */
import { useCallback, useState } from 'react';
import { ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import type { VpsBreakdown } from '@/lib/ops/vps-collect';
import type { DiskItem, DiskGroup, MemProcess, ProcKind } from '@/lib/ops/vps-breakdown';

export type { VpsBreakdown };

// ------------------------------------------------------------ data hook

export function useBreakdown() {
  const [data, setData] = useState<VpsBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/health/breakdown${refresh ? '?refresh=1' : ''}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Breakdown failed');
    }
    setLoading(false);
  }, []);

  return { data, loading, error, load };
}

// ------------------------------------------------------------ helpers

const GB = 1024 ** 3, MB = 1024 ** 2;
export function fmtBytes(b: number): string {
  if (b >= GB) return `${(b / GB).toFixed(b >= 10 * GB ? 0 : 1)} GB`;
  if (b >= MB) return `${Math.round(b / MB)} MB`;
  return `${Math.max(0, Math.round(b / 1024))} KB`;
}
export function fmtMb(mb: number): string { return fmtBytes(mb * MB); }
function fmtUptime(s: number): string {
  if (!s) return '—';
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
function fmtDate(epochSec?: number): string {
  if (!epochSec) return '';
  return new Date(epochSec * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtAgo(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return m < 1 ? 'just now' : m === 1 ? '1 min ago' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
}

const KIND_STYLE: Record<ProcKind, { chip: string; bar: string; label: string }> = {
  database: { chip: 'bg-indigo-50 text-indigo-700', bar: 'bg-indigo-500', label: 'mongod' },
  pm2: { chip: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', label: 'pm2' },
  systemd: { chip: 'bg-sky-50 text-sky-700', bar: 'bg-sky-500', label: 'systemd' },
  system: { chip: 'bg-gray-100 text-gray-600', bar: 'bg-gray-400', label: 'system' },
};
const GROUP_BAR: Record<string, string> = {
  apps: 'bg-emerald-500', data: 'bg-violet-500', backups: 'bg-amber-500', databases: 'bg-indigo-500',
  logs: 'bg-rose-400', caches: 'bg-orange-400', idle: 'bg-slate-400', other: 'bg-gray-300',
};

// ------------------------------------------------------------ shared frame

function PanelFrame({ data, loading, error, onReload, children, scanning }: {
  data: VpsBreakdown | null; loading: boolean; error: string | null; onReload: (refresh: boolean) => void;
  children: React.ReactNode; scanning: string;
}) {
  if (error) {
    return (
      <div className="mt-2 text-xs text-red-600 flex items-center justify-between">
        <span>{error}</span>
        <button onClick={() => onReload(false)} className="underline">retry</button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <RefreshCw className="w-3 h-3 animate-spin" /> {scanning}
      </div>
    );
  }
  return (
    <div className="mt-2">
      {children}
      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
        <span>
          Scanned {fmtAgo(data.generatedAt)}{data.cached ? ' (cached)' : ''} · {Math.round(data.scanMs / 1000)}s scan
          {data.warnings.length > 0 && (
            <span className="ml-2 text-amber-600 inline-flex items-center gap-1" title={data.warnings.join('\n')}>
              <AlertTriangle className="w-3 h-3" /> {data.warnings.length} partial
            </span>
          )}
        </span>
        <button onClick={() => onReload(true)} disabled={loading} className="inline-flex items-center gap-1 hover:text-gray-600 disabled:opacity-50" title="Rescan now (about a minute)">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Rescan
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ memory

export function MemoryPanel(props: { data: VpsBreakdown | null; loading: boolean; error: string | null; onReload: (refresh: boolean) => void }) {
  const { data } = props;
  return (
    <PanelFrame {...props} scanning="Reading processes…">
      {data && <MemoryBody data={data} />}
    </PanelFrame>
  );
}

function MemoryBody({ data }: { data: VpsBreakdown }) {
  const { info, processes, groups } = data.memory;
  const totalMb = info?.totalMb ?? groups.reduce((s, g) => s + g.rssMb, 0);
  const rssSum = groups.reduce((s, g) => s + g.rssMb, 0);
  const cacheMb = info ? Math.max(0, info.buffCacheMb) : 0;
  const freeMb = info ? Math.max(0, totalMb - rssSum - cacheMb) : 0;
  const pct = (mb: number) => `${Math.max(0, Math.min(100, (mb / totalMb) * 100))}%`;

  return (
    <div className="space-y-2">
      {/* stacked bar by group */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200" title="Resident memory by group; shared pages are counted once per process">
        {groups.map((g) => <div key={g.key} className={KIND_STYLE[g.key].bar} style={{ width: pct(g.rssMb) }} title={`${g.label}: ${fmtMb(g.rssMb)}`} />)}
        {info && <div className="bg-gray-300" style={{ width: pct(cacheMb) }} title={`page cache & buffers: ${fmtMb(cacheMb)} (reclaimable)`} />}
        {info && <div className="bg-gray-100" style={{ width: pct(freeMb) }} title={`free: ${fmtMb(freeMb)}`} />}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-600">
        {groups.map((g) => (
          <span key={g.key} className="inline-flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-sm ${KIND_STYLE[g.key].bar}`} />
            {g.label} <b className="text-gray-800">{fmtMb(g.rssMb)}</b> <span className="text-gray-400">({g.count})</span>
          </span>
        ))}
        {info && (
          <>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-gray-300" />cache <b className="text-gray-800">{fmtMb(cacheMb)}</b></span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-gray-100 border border-gray-200" />free <b className="text-gray-800">{fmtMb(freeMb)}</b></span>
          </>
        )}
      </div>

      {info && (
        <div className="text-[11px] text-gray-500">
          Available to apps <b className="text-gray-700">{fmtMb(info.availableMb)}</b> · swap {fmtMb(info.swapUsedMb)} / {fmtMb(info.swapTotalMb)} ·
          load {data.load.map((l) => l.toFixed(2)).join(' / ')} on {data.cpuCores} cores
        </div>
      )}

      {/* process table */}
      <div className="max-h-72 overflow-y-auto rounded-md border border-gray-100">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 sticky top-0">
            <tr>
              <th className="text-left font-medium px-2 py-1">Process</th>
              <th className="text-right font-medium px-2 py-1">RSS</th>
              <th className="text-right font-medium px-2 py-1">CPU</th>
              <th className="text-right font-medium px-2 py-1">Up</th>
              <th className="text-right font-medium px-2 py-1" title="pm2 restarts">↻</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => <ProcRow key={`${p.pid}-${p.name}`} p={p} />)}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-gray-400">
        mongod&apos;s size is its WiredTiger cache (defaults to half of RAM) and is normal; it shrinks under pressure.
      </div>
    </div>
  );
}

function ProcRow({ p }: { p: MemProcess }) {
  const st = KIND_STYLE[p.kind];
  const unhealthy = p.status && p.status !== 'online';
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50" title={p.cmd || undefined}>
      <td className="px-2 py-1 text-gray-800">
        {p.viaParent && <span className="text-gray-400 mr-1" title="child process of the row with the same name">↳</span>}
        <span className="font-medium">{p.name}</span>
        <span className={`ml-1.5 px-1 py-0.5 rounded text-[10px] ${st.chip}`}>{st.label}</span>
        {unhealthy && <span className="ml-1 px-1 py-0.5 rounded text-[10px] bg-red-50 text-red-600">{p.status}</span>}
      </td>
      <td className="px-2 py-1 text-right text-gray-700 whitespace-nowrap">{fmtMb(p.rssMb)}</td>
      <td className="px-2 py-1 text-right text-gray-500">{p.cpu.toFixed(1)}%</td>
      <td className="px-2 py-1 text-right text-gray-500 whitespace-nowrap">{fmtUptime(p.uptimeSec)}</td>
      <td className={`px-2 py-1 text-right ${(p.restarts ?? 0) > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{p.restarts ?? ''}</td>
    </tr>
  );
}

// ------------------------------------------------------------ disk

export function DiskPanel(props: { data: VpsBreakdown | null; loading: boolean; error: string | null; onReload: (refresh: boolean) => void }) {
  const { data } = props;
  return (
    <PanelFrame {...props} scanning="Scanning disk — a cold scan takes up to a minute…">
      {data && <DiskBody data={data} />}
    </PanelFrame>
  );
}

function DiskBody({ data }: { data: VpsBreakdown }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const d = data.disk;
  if (!d.scanned) return <div className="text-xs text-gray-500">{d.note}</div>;
  const used = d.usedBytes || 1;
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className="space-y-1">
      {/* stacked bar by group */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200">
        {d.groups.map((g) => <div key={g.key} className={GROUP_BAR[g.key] ?? 'bg-gray-300'} style={{ width: `${(g.bytes / used) * 100}%` }} title={`${g.label}: ${fmtBytes(g.bytes)}`} />)}
      </div>
      <div className="text-[11px] text-gray-500 pb-1">
        {fmtBytes(d.usedBytes)} used of {fmtBytes(d.totalBytes)} · logs + caches alone are <b className="text-gray-700">{fmtBytes(d.reclaimableHintBytes)}</b> · read-only view
      </div>

      {d.groups.map((g) => (
        <GroupRow key={g.key} g={g} used={used} open={!!open[g.key]} onToggle={() => toggle(g.key)}>
          {g.items.map((it, i) => <ItemRow key={`${g.key}-${i}`} it={it} used={used} depth={1} />)}
        </GroupRow>
      ))}
    </div>
  );
}

function GroupRow({ g, used, open, onToggle, children }: { g: DiskGroup; used: number; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  const share = (g.bytes / used) * 100;
  return (
    <div className="rounded-md border border-gray-100">
      <button onClick={onToggle} className="w-full px-2 py-1.5 text-left hover:bg-gray-50" aria-expanded={open}>
        <div className="flex items-center gap-1.5 text-xs">
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
          <span className={`inline-block w-2 h-2 rounded-sm ${GROUP_BAR[g.key] ?? 'bg-gray-300'}`} />
          <span className="font-medium text-gray-800 flex-1 truncate">{g.label}</span>
          <span className="text-gray-400">{g.items.length}</span>
          <span className="text-gray-800 font-medium w-16 text-right whitespace-nowrap">{fmtBytes(g.bytes)}</span>
          <span className="text-gray-400 w-9 text-right">{share < 1 ? '<1' : Math.round(share)}%</span>
        </div>
        <div className="ml-5 mt-1 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-1 ${GROUP_BAR[g.key] ?? 'bg-gray-300'}`} style={{ width: `${Math.max(1, share)}%` }} />
        </div>
        {g.note && <div className="ml-5 mt-0.5 text-[10px] text-gray-400">{g.note}</div>}
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

function ItemRow({ it, used, depth }: { it: DiskItem; used: number; depth: number }) {
  const [open, setOpen] = useState(false);
  const share = (it.bytes / used) * 100;
  const hasKids = !!it.children?.length;
  const meta = [it.note, it.count !== undefined ? `${it.count.toLocaleString()} files` : '', it.mtime && !it.note?.includes('old') ? fmtDate(it.mtime) : '']
    .filter(Boolean).join(' · ');
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 text-xs py-1 pr-2 ${hasKids ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={hasKids ? () => setOpen((o) => !o) : undefined}
        title={it.path}
      >
        {hasKids ? <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} /> : <span className="w-3" />}
        <span className="flex-1 min-w-0">
          <span className="text-gray-700 truncate block">{it.label}</span>
          {meta && <span className="text-[10px] text-gray-400 block truncate">{meta}</span>}
        </span>
        <span className="text-gray-700 w-16 text-right whitespace-nowrap">{fmtBytes(it.bytes)}</span>
        <span className="text-gray-400 w-9 text-right">{share < 1 ? '<1' : Math.round(share)}%</span>
      </div>
      {open && it.children!.map((c, i) => <ItemRow key={i} it={c} used={used} depth={depth + 1} />)}
    </div>
  );
}
