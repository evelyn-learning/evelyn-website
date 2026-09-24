"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { LeadJSON } from "./OutreachConsole";

export default function TimelineDrawer({
  lead,
  onClose,
  refresh,
  updateLead,
}: {
  lead: LeadJSON;
  onClose: () => void;
  refresh: () => Promise<void>;
  updateLead: (lead: LeadJSON) => void;
}) {
  const touches = [...lead.touches].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${lead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", fields: { notes } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to save notes");
        return;
      }
      setSaved(true);
      // Round 2 final fix wave §6: splice the updated lead into console
      // state instead of refetching the whole corpus for a notes edit.
      if (data.lead) updateLead(data.lead as LeadJSON);
      else await refresh();
    } catch {
      alert("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lead.company}</h2>
            <p className="text-sm text-gray-600">{lead.decisionMaker?.name}{lead.decisionMaker?.title ? ` · ${lead.decisionMaker.title}` : ""}</p>
            <p className="text-xs text-gray-500">{(lead.emails ?? []).join(", ")}{lead.decisionMaker?.linkedinUrl ? ` · ${lead.decisionMaker.linkedinUrl}` : ""}</p>
            {/* Round 2 §1: one product, edited in the Pipeline row. */}
            <p className="mt-1 text-xs text-gray-600">Product: {lead.product || "—"}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="lead-notes">
            Notes
          </label>
          <textarea
            id="lead-notes"
            className="mt-1 h-24 w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Remarks about this lead"
          />
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void saveNotes()}
              disabled={saving}
              className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
            {saved && <span className="text-xs text-green-600">Saved</span>}
          </div>
        </div>

        {touches.length === 0 ? (
          <p className="text-sm text-gray-500">No touches yet.</p>
        ) : (
          <ol className="space-y-3">
            {touches.map((t, i) => (
              <li key={t.externalId ?? i} className={`rounded-lg border p-3 text-sm ${t.direction === "outbound" ? "border-blue-100 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="mb-1 flex flex-wrap gap-x-2 text-xs text-gray-500">
                  <span className="font-semibold uppercase">{t.channel}</span>
                  <span>{t.direction}</span>
                  <span>{new Date(t.at).toLocaleString()}</span>
                  {t.account && <span>{t.account}</span>}
                  {t.origin && <span>via {t.origin}</span>}
                </div>
                {t.subject && <div className="font-medium text-gray-900">{t.subject}</div>}
                <div className="whitespace-pre-wrap text-gray-800">{t.body ?? t.summary}</div>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
