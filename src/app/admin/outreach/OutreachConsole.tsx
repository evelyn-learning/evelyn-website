"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw, X } from "lucide-react";
import type { EmailSource, LeadSegment, LeadStatus, LinkedinSource, TouchChannel } from "@/lib/outreach/enums";
import ReviewQueueTab from "./ReviewQueueTab";
import TodayTab from "./TodayTab";
import PipelineTab from "./PipelineTab";
import FindLeadsTab from "./FindLeadsTab";

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
    emailSource?: EmailSource;
    emailProvider?: string;
    linkedinSource?: LinkedinSource;
    linkedinProvider?: string;
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
  linkedinDraft?: { subject: string; body: string } | null;
  contactFormDraft?: { body: string } | null;
  contactPageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type TabKey = "review" | "today" | "pipeline" | "find";

interface GmailStatus {
  connected: boolean;
  account: string;
  connectedAt: string | null;
}

export default function OutreachConsole({ initialLeads }: { initialLeads: LeadJSON[] }) {
  const [leads, setLeads] = useState<LeadJSON[]>(initialLeads);
  const [tab, setTab] = useState<TabKey>("review");
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [watcherActive, setWatcherActive] = useState<boolean | null>(null);
  const [watcherChecking, setWatcherChecking] = useState(false);
  const [watcherError, setWatcherError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/outreach/gmail/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setGmailStatus(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/outreach/watcher")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setWatcherActive(!!data.active);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // The callback route encodes ?gmail_error=<code> (and ?gmail=connected) on
  // redirect back here. Surface the error rather than letting a failed
  // connect look identical to never having tried; strip both params from the
  // URL afterward so a page refresh doesn't repeat the message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("gmail_error");
    if (err) setGmailError(err);
    if (err || params.has("gmail")) {
      params.delete("gmail_error");
      params.delete("gmail");
      const qs = params.toString();
      window.history.replaceState(
        {},
        "",
        qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      );
    }
  }, []);

  const gmailConnectedLabel = useMemo(() => {
    if (!gmailStatus?.connectedAt) return null;
    try {
      return new Date(gmailStatus.connectedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }, [gmailStatus]);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/outreach/leads");
    if (!res.ok) return;
    const data = await res.json();
    setLeads(data.leads ?? []);
  }, []);

  const checkRepliesNow = useCallback(async () => {
    setWatcherChecking(true);
    setWatcherError(null);
    try {
      const res = await fetch("/api/admin/outreach/watcher", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setWatcherError(data?.error || "Reply check failed");
        return;
      }
      await refresh();
    } catch {
      setWatcherError("Reply check failed");
    } finally {
      setWatcherChecking(false);
    }
  }, [refresh]);

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

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "review", label: "Review", count: counts.staged },
    { key: "today", label: "Today", count: counts.due },
    { key: "pipeline", label: "Pipeline", count: counts.total },
    { key: "find", label: "Find leads" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Outreach Console</h1>
            </div>
            <div className="flex items-center gap-2">
              {watcherError && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Reply check failed: {watcherError}
                  <button
                    type="button"
                    onClick={() => setWatcherError(null)}
                    aria-label="Dismiss"
                    className="text-red-700/70 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {watcherActive !== null && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    watcherActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Watcher {watcherActive ? "active" : "off"}
                </span>
              )}
              <button
                type="button"
                onClick={checkRepliesNow}
                disabled={watcherChecking}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${watcherChecking ? "animate-spin" : ""}`} />
                {watcherChecking ? "Checking…" : "Check replies now"}
              </button>
              {gmailError && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Gmail connect failed: {gmailError}
                  <button
                    type="button"
                    onClick={() => setGmailError(null)}
                    aria-label="Dismiss"
                    className="text-red-700/70 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {gmailStatus?.connected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <Mail className="h-3.5 w-3.5" />
                  Gmail connected ({gmailStatus.account}
                  {gmailConnectedLabel ? ` since ${gmailConnectedLabel}` : ""})
                </span>
              ) : gmailStatus ? (
                <a
                  href="/api/admin/outreach/gmail/auth"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Connect Gmail
                </a>
              ) : null}
            </div>
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
              {t.count !== undefined && (
                <span
                  className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    tab === t.key
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "review" && <ReviewQueueTab leads={leads} refresh={refresh} />}
        {tab === "today" && <TodayTab leads={leads} refresh={refresh} />}
        {tab === "pipeline" && <PipelineTab leads={leads} refresh={refresh} />}
        {tab === "find" && <FindLeadsTab onLeadsChanged={refresh} />}
      </main>
    </div>
  );
}
