"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LeadSegment, LeadStatus, TouchChannel } from "@/models";
import ReviewQueueTab from "./ReviewQueueTab";

export interface LeadTouch {
  at: string;
  channel: TouchChannel;
  direction: "outbound" | "inbound";
  summary: string;
  gmailMessageId?: string;
}

export interface LeadDraft {
  channel: TouchChannel;
  subject?: string;
  body: string;
  gmailDraftId?: string;
  gmailThreadId?: string;
}

export interface LeadJSON {
  _id: string;
  company: string;
  segment: LeadSegment;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  decisionMaker: {
    name: string;
    title: string;
    linkedinUrl?: string;
    email?: string;
    emailVerified: boolean;
  };
  website: string;
  source: string;
  status: LeadStatus;
  demoToken?: string;
  demoVisits: { at: string; ua: string }[];
  gmailThreadIds: string[];
  nextActionAt?: string | null;
  touches: LeadTouch[];
  currentDraft?: LeadDraft | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type TabKey = "review" | "today" | "pipeline";

export default function OutreachConsole({ initialLeads }: { initialLeads: LeadJSON[] }) {
  const [leads, setLeads] = useState<LeadJSON[]>(initialLeads);
  const [tab, setTab] = useState<TabKey>("review");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/outreach/leads");
    if (!res.ok) return;
    const data = await res.json();
    setLeads(data.leads ?? []);
  }, []);

  const counts = useMemo(() => {
    const staged = leads.filter((l) => l.status === "staged").length;
    const now = Date.now();
    const due = leads.filter(
      (l) =>
        (l.status === "approved" || l.status === "contacted") &&
        l.nextActionAt &&
        new Date(l.nextActionAt).getTime() <= now
    ).length;
    return { staged, due, total: leads.length };
  }, [leads]);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "review", label: "Review", count: counts.staged },
    { key: "today", label: "Today", count: counts.due },
    { key: "pipeline", label: "Pipeline", count: counts.total },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Outreach Console</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tab === t.key
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {tab === "review" && <ReviewQueueTab leads={leads} refresh={refresh} />}
        {tab === "today" && (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow">
            Built in Task 6.
          </div>
        )}
        {tab === "pipeline" && (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow">
            Built in Task 6.
          </div>
        )}
      </main>
    </div>
  );
}
