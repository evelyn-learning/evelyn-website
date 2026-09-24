# CRM round 2: editable pipeline, delete with suppression, open product/segment lists — Design

**Date:** 2026-09-23 · **Owner:** Praveen · **App:** `apps/marketing` (admin outreach console at `/admin/outreach`) · **Builds on:** `docs/superpowers/specs/2026-09-21-crm-unified-timeline.md` (deployed 2026-09-22 as `e8358344`).

## Problem

After one day of live use of the CRM timeline, the console fails the operator in concrete ways:

- irrelevant leads (e.g. Pagevault correspondence pulled in by the Gmail import) were approved and cannot be removed; re-running the importer would bring them back;
- Product, Segment, Decision maker and Status are not editable in place, and Product/Segment are fixed sets;
- the Pipeline table needs horizontal scrolling, cannot be sorted or searched, and scrolls the whole page;
- leads whose contact uses a free-mail address show as company "Unknown";
- neither Pipeline nor Today shows where a lead came from (praveen@, info@, form, LinkedIn, research);
- the Today tab shows every lead fully expanded;
- the LinkedIn archive upload fails because `LINKEDIN_OWNER_PROFILE_URL` is unset.

## Decisions (locked, approved in chat 2026-09-23)

1. **One product per lead.** `Lead.product?: string` replaces `Lead.opportunities[]`. `PipelineConfig`, `GET/PUT /api/admin/outreach/pipelines`, the `setOpportunity` lead action, `src/lib/crm/opportunity.ts` and its test are removed. Remarks live in the existing `Lead.notes`.
2. **Open product and segment lists, no options manager.** `Lead.segment` and `Lead.product` are free strings. Each dropdown lists the seed values (`PRODUCTS` and `LEAD_SEGMENTS` stay in `enums.ts` as seeds and label sources) plus every distinct value present on any lead, followed by "Other…" which reveals a text box. Saving a lead with a new value is what adds it. Labels come from the existing label maps with the raw value as fallback. `ResearchJob.segment` and the research route's segment gate accept any value present in the seed list or on an existing lead.
3. **Delete with suppression.** Deleting a lead removes the document and writes a `LeadSuppression` document: `{ leadId, company, emails[], linkedinUrls[], gmailThreadIds[], conversationKeys[], snapshot (the full lead JSON), deletedAt }`. Every path that creates a NEW lead (`upsertLeadWithTouches` when no match, plus the contact form and both LinkedIn routes, which go through it) first checks suppression by any email, LinkedIn URL or conversation key and, on a hit, returns `{ suppressed: true }` without creating anything (ingest counters gain `suppressed`). Matching an existing lead is unaffected. Restore recreates the lead from the snapshot (new `_id`), then deletes the suppression document. Bulk delete = selected rows in Pipeline, native `confirm()`, `POST /api/admin/outreach/leads/bulk` with `action: "delete"`. Single delete = the same route with one id (the existing staged-only `DELETE /leads/[id]` is left as is).
4. **Company naming rule.** For a new lead: organisation domain when it is not a free-mail provider → the person's name → the email address. A maintenance action `POST /api/admin/outreach/maintenance/fix-unknown-companies` (`dryRun` default true) applies the same rule to existing leads whose company is `Unknown` (case-insensitive) or empty, returning `{ matched, updated, samples }`; the Import tab gets a "Fix Unknown companies" button (dry run → apply).
5. **Source pill.** Derived client-side from `Lead.source`: `gmail:<account>` → the account's local part (`praveen@`, `info@`); `contact-form` → `form`; `linkedin:*` → `LinkedIn`; anything else or empty → `research`. Shown in the Pipeline "Last touch" cell and beside the company name in Today rows.
6. **Pipeline table.** Fixed-height scroll container (`calc(100vh - <chrome>)`, sticky header), page does not scroll. Columns: select-box · Company (truncated; `title`/hover shows notes; click opens the timeline drawer) · Segment (inline dropdown) · Status (inline dropdown using the existing `setStatus` action; the old trailing action column is removed; "Work today" becomes an icon button beside the status when the lead is `approved`/`contacted`) · Product (inline dropdown) · Decision maker (click to edit name, title, email in place, saved via the existing `edit` action) · Touches · Next action · Last touch (+ source pill). Every header toggles ascending/descending sort. Search box beside the filters: case-insensitive substring over company, decision maker name/title/email, `emails[]`, `notes`, `source`, `product`, `segment`, and each touch's `subject`, `body`, `summary`, `from`, `to`; applied live, debounced 150 ms, combined with the filters. All client-side over the loaded leads.
7. **Today tab.** Each lead renders collapsed as one row: chevron button · company · segment pill · source pill · "Touch N of MAX" · "Next: …" · decision-maker email. The chevron expands the row into the existing full card. Expansion state is per tab session (not persisted).
8. **Env.** `LINKEDIN_OWNER_PROFILE_URL` set in production once Praveen supplies it.
9. **Migration (one-off, on deploy).** For leads with `opportunities[0].product`, set `product` to it; unset `opportunities` on all leads; drop the `opportunities.product_1_opportunities.stage_1` index; drop the `pipelineconfigs` collection if present. Delivered as `scripts/crm-migrate-round2.ts` (dry run default, `--apply`), idempotent.

## Non-goals

Per-product stages; an options-management screen; renaming or deleting a segment/product value globally; server-side pagination or search; persisting Today expansion state; keyboard accessibility beyond what the console has today; changing status-transition side effects (`setStatus` stays a raw assignment as it is today).

## Acceptance

- Selecting three Pagevault leads and clicking Delete removes them from every tab; a Gmail dry run afterwards reports them under `suppressed`, not `kept`; Restore on one brings it back with its touches.
- Changing Product to "Other… → Homework Bot" saves and the value appears in the Product dropdown for every other lead.
- Segment, Status and Decision maker edit in place and persist after reload.
- The Pipeline fits one screen width at 1280 px; the table scrolls inside a fixed-height area; clicking "Company" sorts A→Z then Z→A; typing `pagevault` in the search narrows to leads whose touches mention it.
- Leads with a gmail.com contact show the person's name (or email) as company, never "Unknown"; "Fix Unknown companies" reports `matched` and, on apply, updates them.
- Today rows are collapsed by default and expand on the chevron; each shows a source pill.
- Archive upload works once the owner URL is set.
