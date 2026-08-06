"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Play, Square, Upload } from "lucide-react";
import { LEAD_SEGMENTS } from "@/lib/outreach/enums";
import type { LeadSegment, ResearchJobStatus, CandidateStatus } from "@/lib/outreach/enums";
import { SEGMENT_LABELS } from "./ReviewQueueTab";

interface CandidateJSON {
  company: string;
  website: string;
  status: CandidateStatus;
  note?: string;
}

interface ResearchJobJSON {
  _id: string;
  segment: LeadSegment;
  niche?: string;
  region?: string;
  count: number;
  status: ResearchJobStatus;
  candidates: CandidateJSON[];
  progress: { inserted: number; noEmail: number; skippedDupes: number; discarded: number; errors: number };
  costUsd: number;
  createdAt: string;
}

interface ResearchState {
  workerActive: boolean;
  active: ResearchJobJSON | null;
  recent: ResearchJobJSON[];
}

const TERMINAL_LABEL: Record<string, string> = {
  done: "Done",
  failed: "Failed",
  aborted_cost: "Stopped at cost cap",
  cancelled: "Cancelled",
};

const CANDIDATE_LABEL: Record<string, string> = {
  pending: "text-gray-400",
  inserted: "text-green-600",
  no_email: "text-amber-600",
  dupe: "text-amber-600",
  discarded: "text-amber-600",
  error: "text-red-600",
};

export default function FindLeadsTab({ onLeadsChanged }: { onLeadsChanged: () => void }) {
  const [state, setState] = useState<ResearchState | null>(null);
  const [segment, setSegment] = useState<LeadSegment>("nursing_program");
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [count, setCount] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/research");
      if (res.ok) setState(await res.json());
    } catch {
      /* transient poll failure — keep last state */
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  const createJob = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/outreach/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment, niche, region, count }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Failed to create job");
      await refresh();
    } catch {
      setError("Network error — request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelJob = async (id: string) => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/admin/outreach/research/${id}/cancel`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to cancel job");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to cancel job");
    } finally {
      setCancelling(false);
    }
  };

  const runImport = async (dryRun: boolean) => {
    setImportResult(null);
    let rows: unknown;
    try {
      rows = JSON.parse(importText);
    } catch {
      setImportResult("Not valid JSON");
      return;
    }
    setImportBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportResult(data.error ?? "Import failed");
        return;
      }
      const c = data.counts;
      setImportResult(
        `${dryRun ? "[dry-run] " : ""}valid ${c.valid}, invalid ${c.invalid}` +
          (dryRun ? "" : `, inserted ${c.inserted}, dupes ${c.skippedDupes}`) +
          (c.errors?.length ? ` — ${c.errors.slice(0, 3).join("; ")}` : "")
      );
      if (!dryRun) onLeadsChanged();
    } catch {
      setImportResult("Network error — import failed");
    } finally {
      setImportBusy(false);
    }
  };

  const active = state?.active ?? null;
  const jobSummary = (j: ResearchJobJSON) =>
    `${j.progress.inserted} inserted (${j.progress.noEmail} no-email), ${j.progress.skippedDupes} dupes, ${j.progress.discarded} discarded, ${j.progress.errors} errors — $${j.costUsd.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* New job form */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Find leads</h3>
        {state && !state.workerActive && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Research worker is off (ENABLE_LEAD_RESEARCH) — jobs will queue but not run.
          </p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-gray-700">
            Segment
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as LeadSegment)}
              disabled={!!active}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              {LEAD_SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {SEGMENT_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Niche (optional)
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. PMHNP programs"
              disabled={!!active}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
          <label className="text-sm text-gray-700">
            Region (optional)
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. US Northeast"
              disabled={!!active}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
          <label className="text-sm text-gray-700">
            Count
            <input
              type="number"
              min={1}
              max={25}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={!!active}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
        </div>
        <button
          onClick={createJob}
          disabled={submitting || !!active}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start research
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Active job */}
      {active && (
        <div className="rounded-xl bg-white p-6 shadow ring-2 ring-primary-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {active.status === "queued" ? "Queued" : "Researching"}: {SEGMENT_LABELS[active.segment] ?? active.segment}
              {active.niche ? ` · ${active.niche}` : ""} ({active.count} wanted)
            </h3>
            <button
              onClick={() => cancelJob(active._id)}
              disabled={cancelling}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Square className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{jobSummary(active)}</p>
          {active.candidates.length > 0 && (
            <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto border-t border-gray-100 pt-3 text-sm">
              {active.candidates.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className={CANDIDATE_LABEL[c.status] ?? "text-gray-500"}>{c.status}</span>
                  <span className="text-gray-700">{c.company}</span>
                  {c.note && <span className="text-gray-500">— {c.note}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Recent jobs */}
      {state && state.recent.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Recent jobs</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {state.recent.map((j) => (
              <li key={j._id} className="border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
                <span className="font-medium text-gray-900">{TERMINAL_LABEL[j.status] ?? j.status}</span>{" "}
                <span className="text-gray-700">
                  {SEGMENT_LABELS[j.segment] ?? j.segment}
                  {j.niche ? ` · ${j.niche}` : ""}
                </span>{" "}
                <span className="text-gray-600">— {jobSummary(j)}</span>
                <span className="text-gray-400"> · {new Date(j.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Import JSON */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Import JSON</h3>
        <p className="mt-1 text-sm text-gray-500">
          Paste a JSON array matching the Lead schema (e.g. from a Claude research chat).
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={6}
          placeholder='[{"company": "...", "segment": "nursing_program", ...}]'
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-mono text-xs"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => runImport(true)}
            disabled={importBusy || !importText.trim()}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Dry run
          </button>
          <button
            onClick={() => runImport(false)}
            disabled={importBusy || !importText.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {importBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import
          </button>
        </div>
        {importResult && <p className="mt-2 text-sm text-gray-700">{importResult}</p>}
      </div>
    </div>
  );
}
