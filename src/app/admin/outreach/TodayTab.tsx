"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Mail,
  Linkedin,
  Globe,
  FileText,
  Eye,
  Pencil,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { expectedNextChannel, SEQUENCE_STEP_LABELS, MAX_OUTBOUND_TOUCHES } from "@/lib/outreach/cadence";
import { TOUCH_CHANNELS } from "@/lib/outreach/enums";
import type { TouchChannel } from "@/lib/outreach/enums";
import type { LeadJSON } from "./OutreachConsole";
import { SEGMENT_LABELS, EmailProvenanceBadge } from "./ReviewQueueTab";

const TAB_LABELS: Record<TouchChannel, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  form: "Contact form",
};

const chipClass =
  "inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200";

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

export default function TodayTab({
  leads,
  refresh,
}: {
  leads: LeadJSON[];
  refresh: () => Promise<void>;
}) {
  const now = Date.now();
  const due = leads.filter(
    (l) =>
      l.nextActionAt != null &&
      new Date(l.nextActionAt).getTime() <= now &&
      (l.status === "approved" || l.status === "contacted")
  );

  const [pendingId, setPendingId] = useState<string | null>(null);

  const markSent = async (id: string, channel: TouchChannel) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}/mark-sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to mark sent");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to mark sent");
    } finally {
      setPendingId(null);
    }
  };

  const createGmailDraft = async (
    id: string,
    draft: { channel: TouchChannel; subject?: string; body: string }
  ): Promise<boolean> => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to create Gmail draft");
        return false;
      }
      await refresh();
      return true;
    } catch {
      alert("Failed to create Gmail draft");
      return false;
    } finally {
      setPendingId(null);
    }
  };

  // Returns true when the enrichment chain found something new, false when
  // it ran but came up empty, and null on failure (already alerted, so the
  // card has nothing further to show).
  const enrichLead = async (id: string): Promise<boolean | null> => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}/enrich`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to enrich lead");
        return null;
      }
      await refresh();
      return !!data.outcome?.result;
    } catch {
      alert("Failed to enrich lead");
      return null;
    } finally {
      setPendingId(null);
    }
  };

  if (due.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow">
        Nothing due right now.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {due.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          busy={pendingId === lead._id}
          onMarkSent={(channel) => markSent(lead._id, channel)}
          onCreateGmailDraft={(draft) => createGmailDraft(lead._id, draft)}
          onEnrich={() => enrichLead(lead._id)}
        />
      ))}
    </div>
  );
}

function LeadCard({
  lead,
  busy,
  onMarkSent,
  onCreateGmailDraft,
  onEnrich,
}: {
  lead: LeadJSON;
  busy: boolean;
  onMarkSent: (channel: TouchChannel) => void;
  onCreateGmailDraft: (draft: {
    channel: TouchChannel;
    subject?: string;
    body: string;
  }) => Promise<boolean>;
  onEnrich: () => Promise<boolean | null>;
}) {
  const dm = lead.decisionMaker;
  const [copied, setCopied] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [enrichMsg, setEnrichMsg] = useState<string | null>(null);
  // Default tab follows the card's existing today-channel hint (the same
  // cadence-derived value that drives the "Next: …" badge below) so the
  // tab that's actually due opens by default; falls back to Email when the
  // sequence is exhausted.
  const [activeTab, setActiveTab] = useState<TouchChannel>(
    () =>
      expectedNextChannel(lead.touches.map((t) => ({ ...t, at: new Date(t.at) }))) ?? "email"
  );

  const startEdit = () => {
    setEditSubject(lead.currentDraft?.subject ?? "");
    setEditBody(lead.currentDraft?.body ?? "");
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!lead.currentDraft) return;
    // Only leave edit mode on success — on failure `onCreateGmailDraft`
    // already alerted and didn't refresh, so snapping back to the
    // read-only view here would silently discard the user's in-progress
    // edit and show the stale pre-edit draft instead.
    const success = await onCreateGmailDraft({
      channel: lead.currentDraft.channel,
      subject: lead.currentDraft.channel === "email" ? editSubject : undefined,
      body: editBody,
    });
    if (success) setEditing(false);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      // clipboard unavailable — silently no-op, copy button just won't flip state
    }
  };

  const outboundCount = lead.touches.filter((t) => t.direction === "outbound").length;
  const nextChannel = expectedNextChannel(
    lead.touches.map((t) => ({ ...t, at: new Date(t.at) }))
  );
  const lastVisit = lead.demoVisits.length > 0 ? lead.demoVisits[lead.demoVisits.length - 1] : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const demoLink = lead.demoToken ? `${siteUrl}/d/${lead.demoToken}` : null;
  const contactGuess = lead.website ? `${lead.website.replace(/\/$/, "")}/contact` : null;

  const canSendEmail = !!lead.currentDraft?.gmailThreadId;
  const showCreateDraftButton =
    lead.currentDraft?.channel === "email" && !lead.currentDraft?.gmailDraftId;
  const missingChannel = !dm?.email || !dm?.linkedinUrl;

  const handleEnrich = async () => {
    setEnrichMsg(null);
    const found = await onEnrich();
    if (found === false) setEnrichMsg("Nothing new found");
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{lead.company}</h3>
            <span className="inline-flex rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
              {SEGMENT_LABELS[lead.segment] ?? lead.segment}
            </span>
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Touch {outboundCount} of {MAX_OUTBOUND_TOUCHES}
            </span>
            {nextChannel !== null && (
              <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                Next: {SEQUENCE_STEP_LABELS[outboundCount]}
              </span>
            )}
            {lastVisit && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                <Eye className="h-3.5 w-3.5" />
                Visited {relativeTime(lastVisit.at)}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>
              {dm?.name || "No decision maker on file"}
              {dm?.title ? ` — ${dm.title}` : ""}
            </span>
            <EmailProvenanceBadge
              emailVerified={dm?.emailVerified}
              emailSource={dm?.emailSource}
              emailProvider={dm?.emailProvider}
            />
            {/* The enrich route 400s without a decision-maker name to match
                against (mirrors the pipeline's auto-enrich gate) — hide the
                button rather than let the click round-trip into an alert. */}
            {missingChannel && dm?.name && (
              <button
                onClick={handleEnrich}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                Enrich
              </button>
            )}
            {enrichMsg && <span className="text-xs text-gray-400">{enrichMsg}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-4">
        <div className="flex gap-1 border-b border-gray-200">
          {TOUCH_CHANNELS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setActiveTab(ch)}
              className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === ch
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {TAB_LABELS[ch]}
            </button>
          ))}
        </div>

        {activeTab === "email" && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Drafted message</h4>
              <div className="flex items-center gap-2">
                {lead.currentDraft && !editing && (
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit draft
                  </button>
                )}
                {lead.currentDraft && !editing && (
                  <button
                    onClick={() => copy("body", lead.currentDraft!.body)}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    {copied === "body" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied ✓
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {editing ? (
              <div className="mt-2 space-y-2">
                {lead.currentDraft?.channel === "email" && (
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                )}
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveEdit}
                    disabled={busy || editBody.trim().length === 0}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : lead.currentDraft ? (
              <>
                {lead.currentDraft.subject && (
                  <div className="mt-2 text-sm font-medium text-gray-800">
                    {lead.currentDraft.subject}
                  </div>
                )}
                <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                  {lead.currentDraft.body}
                </pre>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {showCreateDraftButton && (
                    <button
                      onClick={() =>
                        onCreateGmailDraft({
                          channel: lead.currentDraft!.channel,
                          subject: lead.currentDraft!.subject,
                          body: lead.currentDraft!.body,
                        })
                      }
                      disabled={busy}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4" />
                      Create Gmail draft
                    </button>
                  )}
                  {lead.currentDraft.gmailDraftId && (
                    <a
                      href={`https://mail.google.com/mail/u/0/#drafts?compose=${lead.currentDraft.gmailDraftId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open draft in Gmail
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No draft yet. Drafts are written by the agent via the draft API (Task 8).
              </p>
            )}

            <div className="mt-3 border-t border-gray-100 pt-3">
              <button
                onClick={() => onMarkSent("email")}
                disabled={busy || !canSendEmail}
                title={!canSendEmail ? "Nothing drafted to send — create a Gmail draft first" : undefined}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                Mark Email sent
              </button>
            </div>
          </div>
        )}

        {activeTab === "linkedin" && (
          <div className="mt-3">
            {lead.linkedinDraft ? (
              <>
                <div className="text-sm font-medium text-gray-800">{lead.linkedinDraft.subject}</div>
                <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                  {lead.linkedinDraft.body}
                </pre>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      copy(
                        "linkedin",
                        `Subject: ${lead.linkedinDraft!.subject}\n\n${lead.linkedinDraft!.body}`
                      )
                    }
                    className={chipClass}
                  >
                    {copied === "linkedin" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied ✓
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  {dm?.linkedinUrl && (
                    <a href={dm.linkedinUrl} target="_blank" rel="noreferrer" className={chipClass}>
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn profile
                    </a>
                  )}
                  {dm?.linkedinSource === "vendor" && (
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {dm.linkedinProvider
                        ? dm.linkedinProvider[0].toUpperCase() + dm.linkedinProvider.slice(1)
                        : "Vendor"}
                    </span>
                  )}
                </div>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => onMarkSent("linkedin")}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Linkedin className="h-4 w-4" />
                    Mark LinkedIn sent
                  </button>
                </div>
              </>
            ) : (
              // No drafted message on file, but the owner can still hand-
              // write one outside this tool and log it here — the send did
              // happen even though the agent never drafted it, so Mark Sent
              // stays available.
              <div className="mt-2">
                <p className="text-sm text-gray-500">No draft yet — run the backfill script</p>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => onMarkSent("linkedin")}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Linkedin className="h-4 w-4" />
                    Mark LinkedIn sent
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "form" && (
          <div className="mt-3">
            {lead.contactFormDraft ? (
              <>
                <pre className="whitespace-pre-wrap text-sm text-gray-600">
                  {lead.contactFormDraft.body}
                </pre>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copy("form", lead.contactFormDraft!.body)}
                    className={chipClass}
                  >
                    {copied === "form" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied ✓
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  {lead.contactPageUrl ? (
                    <a href={lead.contactPageUrl} target="_blank" rel="noreferrer" className={chipClass}>
                      <Globe className="h-3.5 w-3.5" />
                      Contact page
                    </a>
                  ) : (
                    lead.website && (
                      <a href={lead.website} target="_blank" rel="noreferrer" className={chipClass}>
                        <Globe className="h-3.5 w-3.5" />
                        Website
                      </a>
                    )
                  )}
                </div>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => onMarkSent("form")}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    Mark Form sent
                  </button>
                </div>
              </>
            ) : (
              // Same rationale as the LinkedIn tab above: no draft doesn't
              // mean no send — keep Mark Sent available for a hand-filled
              // contact form.
              <div className="mt-2">
                <p className="text-sm text-gray-500">No draft yet — run the backfill script</p>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => onMarkSent("form")}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    Mark Form sent
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {dm?.linkedinUrl && (
          <a
            href={dm.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn profile
          </a>
        )}
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
        {contactGuess && (
          <a
            href={contactGuess}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600"
          >
            <Globe className="h-3.5 w-3.5" />
            contact page?
          </a>
        )}
        {demoLink && (
          <span className="inline-flex items-center gap-1 text-gray-500">
            <a href={demoLink} target="_blank" rel="noreferrer" className="hover:text-primary-600">
              Demo link
            </a>
            <button
              onClick={() => copy("demo", demoLink)}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              {copied === "demo" ? "Copied ✓" : <Copy className="h-3 w-3" />}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
