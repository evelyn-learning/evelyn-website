"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Trash2, X, Zap } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/outreach/enums";
import {
  compareLeads,
  leadMatchesQuery,
  sourcePill,
  type SortDir,
  type SortKey,
} from "@/lib/crm/console-helpers";
import type { LeadJSON, LeadTouch } from "./OutreachConsole";
import { SEGMENT_LABELS } from "./ReviewQueueTab";
import TimelineDrawer from "./TimelineDrawer";

// Mirrors the server's cap on one bulk request (leads/bulk/route.ts
// MAX_IDS) — checked client-side so a huge selection is rejected before the
// confirm() dialog even appears, not after the operator has already said yes.
const MAX_DELETE_IDS = 200;

const STATUS_COLORS: Record<string, string> = {
  staged: "bg-gray-100 text-gray-700",
  approved: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  replied: "bg-purple-100 text-purple-700",
  call_booked: "bg-green-100 text-green-700",
  parked: "bg-orange-100 text-orange-700",
  dead: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  staged: "Staged",
  approved: "Approved",
  contacted: "Contacted",
  replied: "Replied",
  call_booked: "Call booked",
  parked: "Parked",
  dead: "Dead",
};

const PILL_TONES: Record<string, string> = {
  gmail: "bg-rose-50 text-rose-700",
  form: "bg-emerald-50 text-emerald-700",
  linkedin: "bg-sky-50 text-sky-700",
  research: "bg-gray-100 text-gray-600",
};

// Column widths total 1200px, 16px under the console's max-w-7xl (1280px)
// main column minus its px-4 gutters — a classic (non-overlay) scrollbar on
// the scroll container below eats horizontal space, and without this slack
// it forces the table into horizontal scroll (round-2 §6 fix round 1). `table-fixed`
// makes these authoritative instead of advisory.
const COLUMNS: { key: SortKey | null; label: string; width: number }[] = [
  { key: null, label: "", width: 36 },
  { key: "company", label: "Company", width: 190 },
  { key: "segment", label: "Segment", width: 130 },
  { key: "status", label: "Status", width: 150 },
  { key: "product", label: "Product", width: 130 },
  { key: "decisionMaker", label: "Decision maker", width: 190 },
  { key: "touches", label: "Touches", width: 60 },
  { key: "nextActionAt", label: "Next action", width: 96 },
  { key: "lastTouchAt", label: "Last touch", width: 218 },
];

/**
 * Round-2 fix round 1 (item 5): the newest touch by timestamp, not the last
 * array element — touches are not guaranteed to arrive in chronological
 * order (imports/backfills can append out of order), and this must agree
 * with `compareLeads(..., "lastTouchAt")`, which sorts on the max `at`.
 */
function latestTouch(touches: LeadTouch[]): LeadTouch | null {
  let best: LeadTouch | null = null;
  let bestTime = -Infinity;
  for (const t of touches) {
    const time = new Date(t.at).getTime();
    if (Number.isNaN(time)) continue;
    if (time >= bestTime) {
      bestTime = time;
      best = t;
    }
  }
  return best;
}

const OTHER = "__other__";

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
  updateLead,
}: {
  leads: LeadJSON[];
  refresh: () => Promise<void>;
  updateLead: (lead: LeadJSON) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [options, setOptions] = useState<{ products: string[]; segments: string[] }>({ products: [], segments: [] });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // Default order = most recent conversation first (Praveen, 2026-09-24);
  // leads with no touches sort last regardless of direction (compareLeads).
  const [sortKey, setSortKey] = useState<SortKey>("lastTouchAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  // At most one "Other…" text box and one decision-maker editor open at a
  // time — the row is 130px wide, and two open editors never fit.
  const [otherFor, setOtherFor] = useState<{ id: string; field: "segment" | "product" } | null>(null);
  const [otherValue, setOtherValue] = useState("");
  const [dmFor, setDmFor] = useState<string | null>(null);
  // linkedinUrl/emailVerified ride along even though this editor has no UI
  // for them (round-2 fix round 1, C1): mergeDecisionMakerEdit only preserves
  // a field the payload OMITS, so if the payload included these keys at all
  // they'd need real values — carrying the lead's current values here means
  // the merge is a true no-op for them, exactly like ReviewQueueTab's
  // toEditFields/EditFields form does.
  const [dmDraft, setDmDraft] = useState({ name: "", title: "", email: "", linkedinUrl: "", emailVerified: false });

  const loadOptions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/options");
      if (!res.ok) return;
      const data = await res.json();
      setOptions({ products: data.products ?? [], segments: data.segments ?? [] });
    } catch {
      // A failed options fetch leaves the dropdowns showing the lead's own
      // value plus "Other…", which is still fully usable.
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  // 150ms debounce (round-2 §6): the search runs over every loaded lead and
  // every touch body, so filtering on each keystroke is visibly janky.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Round 2 final fix wave §6: a successful PATCH already returns the
  // updated lead — splice it into local state instead of refetching every
  // lead just to redraw one row. Only a response with no `lead` (shouldn't
  // happen for these actions, but this is defensive) falls back to a full
  // refresh.
  const applyPatchResult = async (data: { lead?: LeadJSON }) => {
    if (data.lead) updateLead(data.lead);
    else await refresh();
  };

  const setStatus = async (id: string, status: LeadStatus) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }
      await applyPatchResult(data);
    } catch {
      alert("Failed to update status");
    } finally {
      setPendingId(null);
    }
  };

  const saveFields = async (id: string, fields: Record<string, unknown>, failure: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", fields }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || failure);
        return false;
      }
      await applyPatchResult(data);
      // A brand-new "Other…" value only becomes available on every other row
      // once the options endpoint has seen it on a lead. Cheap, so this
      // still runs alongside the local splice above.
      await loadOptions();
      return true;
    } catch {
      alert(failure);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  const workToday = async (id: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "workToday" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to bump lead to today");
        return;
      }
      await applyPatchResult(data);
    } catch {
      alert("Failed to bump lead to today");
    } finally {
      setPendingId(null);
    }
  };

  const onPickOption = async (lead: LeadJSON, field: "segment" | "product", value: string) => {
    if (value === OTHER) {
      setOtherFor({ id: lead._id, field });
      setOtherValue("");
      return;
    }
    // Round-2 fix round 1 (item 4): picking "—" on Product sends `null`
    // (not ""), which the PATCH route's `edit` action reads as "unset this
    // field" — Product is the only optional one of the two, so this only
    // ever applies to it (Segment has no blank option).
    const payloadValue = field === "product" && value === "" ? null : value;
    await saveFields(lead._id, { [field]: payloadValue }, `Failed to update ${field}`);
  };

  const saveOther = async () => {
    if (!otherFor) return;
    const trimmed = otherValue.trim();
    if (!trimmed) return;
    // Controller ruling: before saving a typed value, fold it onto an
    // existing option's exact spelling when it matches case-insensitively —
    // avoids "Academy" beside "academy" in the same dropdown.
    const base = otherFor.field === "segment" ? options.segments : options.products;
    const existing = base.find((o) => o.toLowerCase() === trimmed.toLowerCase());
    const value = existing ?? trimmed;
    const ok = await saveFields(otherFor.id, { [otherFor.field]: value }, `Failed to update ${otherFor.field}`);
    if (ok) {
      setOtherFor(null);
      setOtherValue("");
    }
  };

  const startDmEdit = (lead: LeadJSON) => {
    setDmFor(lead._id);
    setDmDraft({
      name: lead.decisionMaker?.name ?? "",
      title: lead.decisionMaker?.title ?? "",
      email: lead.decisionMaker?.email ?? "",
      linkedinUrl: lead.decisionMaker?.linkedinUrl ?? "",
      emailVerified: lead.decisionMaker?.emailVerified ?? false,
    });
  };

  const saveDm = async () => {
    if (!dmFor) return;
    // The `edit` action MERGES decisionMaker (lib/outreach/lead-edit.ts). This
    // editor has no UI for linkedinUrl/emailVerified, so the draft carries
    // the lead's own current values for them (stashed in startDmEdit) —
    // sending them unchanged means the merge can't mistake "field omitted
    // from this narrow form" for "field cleared", which would otherwise
    // wipe the LinkedIn provenance on every name/title/email-only edit.
    const ok = await saveFields(
      dmFor,
      {
        decisionMaker: {
          name: dmDraft.name.trim(),
          title: dmDraft.title.trim(),
          email: dmDraft.email.trim(),
          linkedinUrl: dmDraft.linkedinUrl.trim(),
          emailVerified: dmDraft.emailVerified,
        },
      },
      "Failed to update decision maker"
    );
    if (ok) setDmFor(null);
  };

  const deleteSelected = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    // Round-2 fix round 1 (item 9): check the server's cap BEFORE the
    // confirm() dialog — an operator who says "yes" to a request that can
    // only fail is worse than one who never sees the dialog.
    if (ids.length > MAX_DELETE_IDS) {
      alert(`You can delete at most ${MAX_DELETE_IDS} leads in one request; ${ids.length} are selected. Narrow the selection (filters or search) and try again.`);
      return;
    }
    if (
      !confirm(
        `Delete ${ids.length} lead${ids.length === 1 ? "" : "s"}? They are removed and suppressed, so a re-import will not bring them back. You can restore them from the Import tab.`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to delete leads");
        return;
      }
      if (Array.isArray(data.skipped) && data.skipped.length > 0) {
        alert(`Deleted ${data.deleted?.length ?? 0}; skipped ${data.skipped.length}: ${data.skipped.map((s: { id: string; reason: string }) => `${s.id} (${s.reason})`).join(", ")}`);
      }
      setSelected(new Set());
      await refresh();
      await loadOptions();
    } catch {
      alert("Failed to delete leads");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const rows = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (segmentFilter !== "all" && l.segment !== segmentFilter) return false;
      if (productFilter !== "all" && (l.product ?? "") !== productFilter) return false;
      return leadMatchesQuery(l, debouncedQuery);
    });
    return rows.sort((a, b) => compareLeads(a, b, sortKey, sortDir));
  }, [leads, statusFilter, segmentFilter, productFilter, debouncedQuery, sortKey, sortDir]);

  // Round-2 fix round 1 (I2): keep `selected` a subset of what's currently
  // visible. Without this, checking rows, then narrowing the filter/search,
  // then hitting "Delete selected" would delete leads the operator can no
  // longer see and never re-confirmed against.
  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const visible = new Set(filtered.map((l) => l._id));
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (visible.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [filtered]);

  const allShownSelected = filtered.length > 0 && filtered.every((l) => selected.has(l._id));

  const toggleAllShown = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allShownSelected) for (const l of filtered) next.delete(l._id);
      else for (const l of filtered) next.add(l._id);
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const optionList = (kind: "segment" | "product", current?: string) => {
    const base = kind === "segment" ? options.segments : options.products;
    // A lead's own value must always be selectable even if the options fetch
    // failed or the value has since been renamed away from every other lead.
    return current && !base.includes(current) ? [current, ...base] : base;
  };

  const labelFor = (kind: "segment" | "product", value: string) =>
    kind === "segment" ? SEGMENT_LABELS[value] ?? value : value;

  return (
    <div className="space-y-3">
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
                {STATUS_LABELS[s] ?? s}
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
            {options.segments.map((s) => (
              <option key={s} value={s}>
                {SEGMENT_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Product
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="all">All</option>
            {options.products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <input
          type="search"
          className="w-64 rounded-lg border border-gray-300 px-3 py-1 text-sm"
          placeholder="Search company, contact, notes, messages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {selected.size > 0 && (
          <button
            type="button"
            onClick={deleteSelected}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting…" : `Delete selected (${selected.size})`}
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      {/* Fixed-height scroll area with a sticky header (round-2 §6): the table
          scrolls inside this box so the page itself does not. 280px is the
          console chrome above it — header, tab bar, filter row, and the
          main column's own bottom padding (missed in the first pass, hence
          260px there). This offset is a deploy-time measurement, not a
          computed constant — re-check it against the live console chrome
          if the header/tabs/filter row height ever changes. */}
      <div
        className="overflow-auto rounded-xl bg-white shadow"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label || "select"} style={{ width: `${c.width}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COLUMNS.map((c) =>
                c.key === null ? (
                  <th key="select" className="sticky top-0 z-10 bg-gray-50 px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      aria-label="Select all shown leads"
                      checked={allShownSelected}
                      onChange={toggleAllShown}
                    />
                  </th>
                ) : (
                  <th
                    key={c.key}
                    className="sticky top-0 z-10 bg-gray-50 px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key as SortKey)}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                    >
                      {c.label}
                      {sortKey === c.key && <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>}
                    </button>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const dm = lead.decisionMaker;
                // Round-2 controller ruling: the Touches column shows the
                // TOTAL touch count (inbound + outbound) so it matches
                // compareLeads(..., "touches"), which sorts on the same
                // total — a direction-filtered count here would silently
                // disagree with the sort arrow.
                const touchCount = lead.touches.length;
                const lastTouch = latestTouch(lead.touches);
                const pill = sourcePill(lead.source);
                const busy = pendingId === lead._id;

                return (
                  <tr key={lead._id} className="align-top hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select ${lead.company}`}
                        checked={selected.has(lead._id)}
                        onChange={() => toggleOne(lead._id)}
                      />
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      <button
                        type="button"
                        title={lead.notes || undefined}
                        className="block w-full truncate text-left font-medium text-primary-700 hover:underline"
                        onClick={() => setOpenId(lead._id)}
                      >
                        {lead.company}
                      </button>
                    </td>
                    <td className="px-2 py-2">
                      {otherFor?.id === lead._id && otherFor.field === "segment" ? (
                        <OtherInput
                          value={otherValue}
                          busy={busy}
                          onChange={setOtherValue}
                          onSave={saveOther}
                          onCancel={() => setOtherFor(null)}
                        />
                      ) : (
                        <select
                          className="w-full rounded-lg border border-gray-300 px-1 py-1 text-xs"
                          value={lead.segment}
                          disabled={busy}
                          onChange={(e) => void onPickOption(lead, "segment", e.target.value)}
                        >
                          {optionList("segment", lead.segment).map((s) => (
                            <option key={s} value={s}>
                              {labelFor("segment", s)}
                            </option>
                          ))}
                          <option value={OTHER}>Other…</option>
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <select
                          className={`w-full rounded-lg border-0 px-1 py-1 text-xs font-semibold ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-700"}`}
                          value={lead.status}
                          disabled={busy}
                          onChange={(e) => void setStatus(lead._id, e.target.value as LeadStatus)}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s] ?? s}
                            </option>
                          ))}
                        </select>
                        {/* parked leads are at the touch cap; reviving them past the cadence is an owner product decision — not silently supported. */}
                        {(lead.status === "approved" || lead.status === "contacted") && (
                          <button
                            type="button"
                            onClick={() => void workToday(lead._id)}
                            disabled={busy}
                            title="Work today — bump this lead's next action to now"
                            aria-label="Work today"
                            className="shrink-0 rounded-lg bg-gray-100 p-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Zap className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      {otherFor?.id === lead._id && otherFor.field === "product" ? (
                        <OtherInput
                          value={otherValue}
                          busy={busy}
                          onChange={setOtherValue}
                          onSave={saveOther}
                          onCancel={() => setOtherFor(null)}
                        />
                      ) : (
                        <select
                          className="w-full rounded-lg border border-gray-300 px-1 py-1 text-xs"
                          value={lead.product ?? ""}
                          disabled={busy}
                          onChange={(e) => void onPickOption(lead, "product", e.target.value)}
                        >
                          <option value="">—</option>
                          {optionList("product", lead.product).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                          <option value={OTHER}>Other…</option>
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      {dmFor === lead._id ? (
                        <div className="space-y-1">
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Name"
                            value={dmDraft.name}
                            onChange={(e) => setDmDraft((d) => ({ ...d, name: e.target.value }))}
                          />
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Title"
                            value={dmDraft.title}
                            onChange={(e) => setDmDraft((d) => ({ ...d, title: e.target.value }))}
                          />
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Email"
                            value={dmDraft.email}
                            onChange={(e) => setDmDraft((d) => ({ ...d, email: e.target.value }))}
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => void saveDm()}
                              disabled={busy}
                              className="rounded bg-primary-600 p-1 text-white disabled:opacity-50"
                              aria-label="Save decision maker"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDmFor(null)}
                              className="rounded bg-gray-100 p-1 text-gray-600"
                              aria-label="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startDmEdit(lead)}
                          title={[dm?.name, dm?.title, dm?.email].filter(Boolean).join(" · ") || "Click to edit name, title and email"}
                          className="block w-full truncate text-left hover:text-primary-700 hover:underline"
                        >
                          {dm?.name || "—"}
                          {dm?.title ? ` (${dm.title})` : ""}
                          {dm?.email ? ` · ${dm.email}` : ""}
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-2 text-gray-600">{touchCount}</td>
                    <td className="px-2 py-2 text-gray-600">
                      {lead.nextActionAt ? new Date(lead.nextActionAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${PILL_TONES[pill.tone]}`}>
                          {pill.label}
                        </span>
                        <span className="truncate" title={lastTouch?.summary}>
                          {lastTouch ? `${relativeTime(lastTouch.at)} · ${lastTouch.summary}` : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {openId &&
        (() => {
          const l = leads.find((x) => x._id === openId);
          return l ? (
            <TimelineDrawer key={l._id} lead={l} onClose={() => setOpenId(null)} refresh={refresh} updateLead={updateLead} />
          ) : null;
        })()}
    </div>
  );
}

// The "Other…" text box that replaces a dropdown in place. Enter saves,
// Escape cancels — the cell is too narrow for a labelled button pair.
function OtherInput({
  value,
  busy,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  busy: boolean;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
        placeholder="New value"
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void onSave();
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        type="button"
        onClick={() => void onSave()}
        disabled={busy || !value.trim()}
        className="shrink-0 rounded bg-primary-600 p-1 text-white disabled:opacity-50"
        aria-label="Save new value"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded bg-gray-100 p-1 text-gray-600"
        aria-label="Cancel"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
