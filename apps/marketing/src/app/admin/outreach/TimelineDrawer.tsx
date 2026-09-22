"use client";

import { X } from "lucide-react";
import type { LeadJSON } from "./OutreachConsole";

export default function TimelineDrawer({ lead, onClose }: { lead: LeadJSON; onClose: () => void }) {
  const touches = [...lead.touches].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lead.company}</h2>
            <p className="text-sm text-gray-600">{lead.decisionMaker?.name}{lead.decisionMaker?.title ? ` · ${lead.decisionMaker.title}` : ""}</p>
            <p className="text-xs text-gray-500">{(lead.emails ?? []).join(", ")}{lead.decisionMaker?.linkedinUrl ? ` · ${lead.decisionMaker.linkedinUrl}` : ""}</p>
            {(lead.opportunities ?? []).length > 0 && (
              <p className="mt-1 text-xs text-gray-600">{(lead.opportunities ?? []).map((o) => `${o.product}: ${o.stage}`).join(" · ")}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
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
