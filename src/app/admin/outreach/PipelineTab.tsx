"use client";

import { useMemo, useState } from "react";
import { LEAD_SEGMENTS, LEAD_STATUSES, type LeadStatus } from "@/lib/outreach/enums";
import type { LeadJSON } from "./OutreachConsole";
import { SEGMENT_LABELS } from "./ReviewQueueTab";

const STATUS_COLORS: Record<LeadStatus, string> = {
  staged: "bg-gray-100 text-gray-700",
  approved: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  replied: "bg-purple-100 text-purple-700",
  call_booked: "bg-green-100 text-green-700",
  parked: "bg-orange-100 text-orange-700",
  dead: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  staged: "Staged",
  approved: "Approved",
  contacted: "Contacted",
  replied: "Replied",
  call_booked: "Call booked",
  parked: "Parked",
  dead: "Dead",
};

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const mins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    return `${mins}m ago`;
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function PipelineTab({
  leads,
  refresh,
}: {
  leads: LeadJSON[];
  refresh: () => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const setStatus = async (id: string, status: LeadStatus) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update status");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to update status");
    } finally {
      setPendingId(null);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (segmentFilter !== "all" && l.segment !== segmentFilter) return false;
      return true;
    });
  }, [leads, statusFilter, segmentFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Status
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Segment
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
          >
            <option value="all">All</option>
            {LEAD_SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {SEGMENT_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Company",
                "Segment",
                "Status",
                "Decision maker",
                "Touches",
                "Next action",
                "Last visit",
                "Last touch",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const dm = lead.decisionMaker;
                const outboundCount = lead.touches.filter((t) => t.direction === "outbound").length;
                const lastVisit =
                  lead.demoVisits.length > 0 ? lead.demoVisits[lead.demoVisits.length - 1] : null;
                const lastTouch = lead.touches.length > 0 ? lead.touches[lead.touches.length - 1] : null;

                return (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {lead.company}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {SEGMENT_LABELS[lead.segment] ?? lead.segment}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[lead.status]}`}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {dm?.name || "—"}
                      {dm?.title ? ` (${dm.title})` : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">{outboundCount}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {lead.nextActionAt ? new Date(lead.nextActionAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                      {lastVisit ? relativeTime(lastVisit.at) : "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-2 text-gray-600" title={lastTouch?.summary}>
                      {lastTouch?.summary || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <select
                        className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
                        value={lead.status}
                        disabled={pendingId === lead._id}
                        onChange={(e) => setStatus(lead._id, e.target.value as LeadStatus)}
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
