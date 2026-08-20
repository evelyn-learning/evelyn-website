"use client";

import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Pencil, Mail, Linkedin, Globe, BadgeCheck, Building2 } from "lucide-react";
import { LEAD_SEGMENTS } from "@/lib/outreach/enums";
import type { EmailSource } from "@/lib/outreach/enums";
import type { LeadJSON } from "./OutreachConsole";

export const SEGMENT_LABELS: Record<string, string> = {
  nursing_program: "Nursing Program",
  testprep_academy: "Test Prep Academy",
  homeschool_charter: "Homeschool Charter",
  microschool: "Microschool",
  school_district: "School District",
  private_school: "Private School",
  intl_school: "Intl School",
  library: "Library",
  publisher: "Publisher",
  agency: "Agency",
  corporate_ld: "Corporate L&D",
  other: "Other",
};

function titleCase(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

// Shared tiny badge showing where a decision-maker's email came from —
// used next to the email address in both the Today card and the Review
// queue card. Verified (a human-confirmed published email) always wins
// over provenance; a vendor-sourced email that hasn't been verified shows
// which vendor found it instead.
export function EmailProvenanceBadge({
  emailVerified,
  emailSource,
  emailProvider,
}: {
  emailVerified?: boolean;
  emailSource?: EmailSource;
  emailProvider?: string;
}) {
  if (emailVerified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }
  if (emailSource === "vendor") {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        {emailProvider ? titleCase(emailProvider) : "vendor"}
      </span>
    );
  }
  return null;
}

// The organization's general inbox, shown where a decision-maker's own
// address would be. Deliberately distinct from EmailProvenanceBadge: that
// badge answers "how good is this address", this one answers "this is not
// the person" — which is what changes how the draft reads.
export function GeneralInboxChip({
  email,
  sourceUrl,
}: {
  email: string;
  sourceUrl?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-gray-500">
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-1 hover:text-primary-600"
      >
        <Building2 className="h-3.5 w-3.5" />
        {email}
      </a>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          title={`Published at ${sourceUrl}`}
          className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-200"
        >
          General inbox
        </a>
      ) : (
        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          General inbox
        </span>
      )}
    </span>
  );
}

interface EditFields {
  company: string;
  segment: string;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  decisionMaker: {
    name: string;
    title: string;
    linkedinUrl: string;
    email: string;
    emailVerified: boolean;
  };
  orgEmail: string;
  website: string;
  source: string;
  notes: string;
}

function toEditFields(lead: LeadJSON): EditFields {
  return {
    company: lead.company ?? "",
    segment: lead.segment,
    about: lead.about ?? "",
    whyFit: lead.whyFit ?? "",
    useCaseHypothesis: lead.useCaseHypothesis ?? "",
    decisionMaker: {
      name: lead.decisionMaker?.name ?? "",
      title: lead.decisionMaker?.title ?? "",
      linkedinUrl: lead.decisionMaker?.linkedinUrl ?? "",
      email: lead.decisionMaker?.email ?? "",
      emailVerified: lead.decisionMaker?.emailVerified ?? false,
    },
    orgEmail: lead.orgEmail ?? "",
    website: lead.website ?? "",
    source: lead.source ?? "",
    notes: lead.notes ?? "",
  };
}

export default function ReviewQueueTab({
  leads,
  refresh,
}: {
  leads: LeadJSON[];
  refresh: () => Promise<void>;
}) {
  const staged = useMemo(() => leads.filter((l) => l.status === "staged"), [leads]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // Selection is derived against the live queue on every render rather than
  // trusted as-is: a refresh (or another tab acting on the same lead) can
  // remove a row from `staged` while its id is still checked, and sending a
  // vanished id would just come back as a "not found" skip.
  const selectedIds = useMemo(
    () => staged.filter((l) => selected.has(l._id)).map((l) => l._id),
    [staged, selected]
  );
  const allSelected = staged.length > 0 && selectedIds.length === staged.length;

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(staged.map((l) => l._id)));

  const patchLead = async (id: string, body: Record<string, unknown>) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update lead");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to update lead");
    } finally {
      setPendingId(null);
    }
  };

  const approve = (id: string) => patchLead(id, { action: "approve" });

  const kill = (id: string) => {
    if (!confirm("Kill this lead? It will be marked dead.")) return;
    patchLead(id, { action: "kill" });
  };

  const saveEdit = async (id: string, fields: EditFields) => {
    await patchLead(id, { action: "edit", fields });
    setEditingId(null);
  };

  const bulk = async (action: "approve" | "kill") => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    const verb = action === "approve" ? "Approve" : "Kill";
    if (!confirm(`${verb} ${ids.length} lead${ids.length === 1 ? "" : "s"}?`)) return;

    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || `Failed to ${action} leads`);
        return;
      }
      // Report the shortfall rather than letting a partial batch look like a
      // clean sweep — a lead someone else already approved comes back here
      // as a skip, and the operator needs to know which ones stayed put.
      const skipped: { id: string; reason: string }[] = data.skipped ?? [];
      if (skipped.length > 0) {
        alert(
          `${data.updated?.length ?? 0} updated, ${skipped.length} skipped:\n` +
            skipped.map((s) => `• ${s.reason}`).join("\n")
        );
      }
      setSelected(new Set());
      await refresh();
    } catch {
      alert(`Failed to ${action} leads`);
    } finally {
      setBulkBusy(false);
    }
  };

  if (staged.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow">
        No staged leads waiting for review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={allSelected}
            // Some-but-not-all reads as a dash rather than a tick, so the
            // header box never implies the whole queue is selected.
            ref={(el) => {
              if (el) el.indeterminate = selectedIds.length > 0 && !allSelected;
            }}
            onChange={toggleAll}
          />
          Select all ({staged.length})
        </label>

        <span className="text-sm text-gray-500">
          {selectedIds.length} selected
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => bulk("approve")}
            disabled={bulkBusy || selectedIds.length === 0}
            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            {bulkBusy ? "Working…" : `Approve selected`}
          </button>
          <button
            type="button"
            onClick={() => bulk("kill")}
            disabled={bulkBusy || selectedIds.length === 0}
            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Kill selected
          </button>
        </div>
      </div>

      {staged.map((lead) =>
        editingId === lead._id ? (
          <EditCard
            key={lead._id}
            lead={lead}
            saving={pendingId === lead._id}
            onCancel={() => setEditingId(null)}
            onSave={(fields) => saveEdit(lead._id, fields)}
          />
        ) : (
          <ReviewCard
            key={lead._id}
            lead={lead}
            busy={pendingId === lead._id || bulkBusy}
            selected={selected.has(lead._id)}
            onToggleSelect={() => toggleOne(lead._id)}
            onApprove={() => approve(lead._id)}
            onEdit={() => setEditingId(lead._id)}
            onKill={() => kill(lead._id)}
          />
        )
      )}
    </div>
  );
}

function ReviewCard({
  lead,
  busy,
  selected,
  onToggleSelect,
  onApprove,
  onEdit,
  onKill,
}: {
  lead: LeadJSON;
  busy: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onApprove: () => void;
  onEdit: () => void;
  onKill: () => void;
}) {
  const dm = lead.decisionMaker;
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow ${
        selected ? "ring-2 ring-primary-300" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1.5 h-4 w-4 rounded border-gray-300"
            checked={selected}
            onChange={onToggleSelect}
            aria-label={`Select ${lead.company}`}
          />
          <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{lead.company}</h3>
            <span className="inline-flex rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
              {SEGMENT_LABELS[lead.segment] ?? lead.segment}
            </span>
          </div>
          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
            >
              <Globe className="h-3.5 w-3.5" />
              {lead.website}
            </a>
          )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </button>
          <button
            onClick={onEdit}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onKill}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Kill
          </button>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        {lead.about && (
          <div>
            <dt className="font-medium text-gray-700">About</dt>
            <dd className="text-gray-600">{lead.about}</dd>
          </div>
        )}
        {lead.whyFit && (
          <div>
            <dt className="font-medium text-gray-700">Why fit</dt>
            <dd className="text-gray-600">{lead.whyFit}</dd>
          </div>
        )}
        {lead.useCaseHypothesis && (
          <div>
            <dt className="font-medium text-gray-700">Use-case hypothesis</dt>
            <dd className="text-gray-600">{lead.useCaseHypothesis}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 text-sm">
        <span className="text-gray-700">
          {dm?.name || "No decision maker on file"}
          {dm?.title ? ` — ${dm.title}` : ""}
        </span>
        <EmailProvenanceBadge
          emailVerified={dm?.emailVerified}
          emailSource={dm?.emailSource}
          emailProvider={dm?.emailProvider}
        />
        {dm?.email && (
          <a
            href={`mailto:${dm.email}`}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600"
          >
            <Mail className="h-3.5 w-3.5" />
            {dm.email}
          </a>
        )}
        {/* Only when there's no personal address: this is the fallback the
            draft would actually go to, so it's the address the reviewer is
            deciding about. Showing it alongside a personal email would just
            be noise. */}
        {!dm?.email && lead.orgEmail && (
          <GeneralInboxChip email={lead.orgEmail} sourceUrl={lead.orgEmailSourceUrl} />
        )}
        {dm?.linkedinUrl && (
          <a
            href={dm.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600"
          >
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        )}
        {lead.source && (
          <span className="ml-auto text-xs uppercase tracking-wide text-gray-400">
            Source: {lead.source}
          </span>
        )}
      </div>
    </div>
  );
}

function EditCard({
  lead,
  saving,
  onCancel,
  onSave,
}: {
  lead: LeadJSON;
  saving: boolean;
  onCancel: () => void;
  onSave: (fields: EditFields) => void;
}) {
  const [fields, setFields] = useState<EditFields>(() => toEditFields(lead));

  return (
    <form
      className="rounded-xl bg-white p-6 shadow ring-2 ring-primary-200"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(fields);
      }}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit {lead.company}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-gray-700">
          Company
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={fields.company}
            onChange={(e) => setFields((f) => ({ ...f, company: e.target.value }))}
          />
        </label>
        <label className="text-sm text-gray-700">
          Segment
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={fields.segment}
            onChange={(e) => setFields((f) => ({ ...f, segment: e.target.value }))}
          >
            {LEAD_SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {SEGMENT_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm text-gray-700">
        About
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={2}
          value={fields.about}
          onChange={(e) => setFields((f) => ({ ...f, about: e.target.value }))}
        />
      </label>

      <label className="mt-4 block text-sm text-gray-700">
        Why fit
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={2}
          value={fields.whyFit}
          onChange={(e) => setFields((f) => ({ ...f, whyFit: e.target.value }))}
        />
      </label>

      <label className="mt-4 block text-sm text-gray-700">
        Use-case hypothesis
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={2}
          value={fields.useCaseHypothesis}
          onChange={(e) => setFields((f) => ({ ...f, useCaseHypothesis: e.target.value }))}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-gray-700">
          Website
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={fields.website}
            onChange={(e) => setFields((f) => ({ ...f, website: e.target.value }))}
          />
        </label>
        <label className="text-sm text-gray-700">
          Source
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={fields.source}
            onChange={(e) => setFields((f) => ({ ...f, source: e.target.value }))}
          />
        </label>
      </div>

      <fieldset className="mt-4 rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">Decision maker</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-gray-700">
            Name
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={fields.decisionMaker.name}
              onChange={(e) =>
                setFields((f) => ({
                  ...f,
                  decisionMaker: { ...f.decisionMaker, name: e.target.value },
                }))
              }
            />
          </label>
          <label className="text-sm text-gray-700">
            Title
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={fields.decisionMaker.title}
              onChange={(e) =>
                setFields((f) => ({
                  ...f,
                  decisionMaker: { ...f.decisionMaker, title: e.target.value },
                }))
              }
            />
          </label>
          <label className="text-sm text-gray-700">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={fields.decisionMaker.email}
              onChange={(e) =>
                setFields((f) => ({
                  ...f,
                  decisionMaker: { ...f.decisionMaker, email: e.target.value },
                }))
              }
            />
          </label>
          <label className="text-sm text-gray-700">
            LinkedIn URL
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={fields.decisionMaker.linkedinUrl}
              onChange={(e) =>
                setFields((f) => ({
                  ...f,
                  decisionMaker: { ...f.decisionMaker, linkedinUrl: e.target.value },
                }))
              }
            />
          </label>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={fields.decisionMaker.emailVerified}
            onChange={(e) =>
              setFields((f) => ({
                ...f,
                decisionMaker: { ...f.decisionMaker, emailVerified: e.target.checked },
              }))
            }
          />
          Email verified
        </label>
      </fieldset>

      <label className="mt-4 block text-sm text-gray-700">
        Organization inbox
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="info@example.edu"
          value={fields.orgEmail}
          onChange={(e) => setFields((f) => ({ ...f, orgEmail: e.target.value }))}
        />
        <span className="mt-1 block text-xs text-gray-500">
          Used only when the decision-maker has no email of their own. The draft
          then opens &ldquo;Hello,&rdquo; and asks to be passed to them by name.
        </span>
      </label>

      <label className="mt-4 block text-sm text-gray-700">
        Notes
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={2}
          value={fields.notes}
          onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
        />
      </label>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
