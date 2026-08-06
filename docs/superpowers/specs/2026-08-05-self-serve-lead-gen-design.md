# Self-serve lead generation — design

**Date:** 2026-08-05
**Status:** Approved by owner (this session)
**Context:** Outreach console V1 requires a Claude Code session to research and
import each lead batch (`scripts/import-leads.ts`). The owner wants a
one-button, in-console flow: enter segment/niche/region/count, get researched,
drafted, staged leads. Handoff doc:
`docs/superpowers/plans/2026-08-05-outreach-and-demo-polish-handoff.md` §A
(this implements option 3, with option 2's import UI included as a fallback).

## Requirements (owner-confirmed)

- **Workflow:** one button in `/admin/outreach` — research runs server-side,
  staged leads appear in the existing Review Queue. No terminal, no Claude
  session.
- **Output:** leads arrive complete — `whyFit`, `useCaseHypothesis`, a real
  named decision-maker where findable, and a personalized, cited intro email in
  `currentDraft`. The operator still approves every email before send.
- **Cost:** ~$10–20 per 20-lead batch, enforced as a hard ceiling; the run
  aborts cleanly if hit.
- **Quality bar (non-negotiable):** never fabricate a person, email, or
  LinkedIn URL. `emailVerified: true` means "found published on an official
  page". Empty is correct; a plausible guess emails a real stranger.

## Architecture

```
Console "Find leads" tab
  → POST /api/admin/outreach/research        (creates ResearchJob, status: queued)
  → node-cron worker claims job              (in-process, instrumentation.ts,
       runs discovery + per-candidate research  same pattern as reply-watcher /
       via Claude API, inserts staged Leads)    blog-scheduler)
  → console polls GET /research every 5s     (live progress, cost, cancel)
```

- One active job at a time (create route rejects while one is queued/running).
- Worker: `src/lib/outreach/research-worker.ts`, node-cron `*/1 * * * *`,
  module-level `isRunning` overlap guard, started from `instrumentation.ts`
  behind `ENABLE_LEAD_RESEARCH` (copy the reply-watcher structure).
- Restart-safe: the candidate list and per-candidate status live on the job
  doc. After a pm2 restart/deploy the worker re-claims the `running` job and
  continues with unprocessed candidates; inserted leads are never lost.

## Data model — `ResearchJob` (new Mongoose model)

| Field | Type | Notes |
|---|---|---|
| `segment` | LeadSegment enum | one of the 6 existing segments |
| `niche` | string | free text, e.g. "PMHNP programs"; optional |
| `region` | string | free text, e.g. "US Northeast"; optional |
| `count` | number | requested leads, 1–25 |
| `status` | enum | `queued` \| `running` \| `done` \| `failed` \| `aborted_cost` \| `cancelled` |
| `candidates` | array | `{ company, website, status: pending\|inserted\|no_email\|dupe\|discarded\|error, note }` |
| `progress` | object | `{ inserted, noEmail, skippedDupes, discarded, errors }` |
| `costUsd` | number | running total |
| `tokens` | object | `{ input, output }` accumulated from `usage` |
| `error` | string | terminal error message if `failed` |
| timestamps | | createdAt / updatedAt |

## Research pipeline (per job)

Claude API via `@anthropic-ai/sdk` (bumped — 0.71 predates current tool
versions), model `claude-opus-5`, server-side tools
`web_search_20260209` + `web_fetch_20260209`, structured outputs
(`output_config.format`) for schema-valid JSON. `ANTHROPIC_API_KEY` already on
the server (tutor uses it).

1. **Discovery (1 call).** Find ~1.5× `count` candidate institutions matching
   segment + niche + region. The prompt includes existing Lead company names
   for that segment so the model avoids known companies up front. Result saved
   to `job.candidates`.
2. **Deep research (1 call per candidate).** Research the institution's own
   site; find a real named decision-maker and a *published* email; emit a
   Lead-schema JSON plus evidence fields: `emailSourceUrl` (required whenever
   `email` is present), `nameSourceUrl`, `sourceUrls`. Includes the cited
   intro draft (`currentDraft.subject`/`body`, with the literal `[DEMO_LINK]`
   line, matching batch-1 convention). Prompt states the no-fabrication rules
   explicitly.
3. **Deterministic anti-fabrication gate (server code, no model).** The server
   fetches `emailSourceUrl` itself and checks the email string appears in the
   page content (tolerant of common obfuscations like `name [at] domain`).
   - Found → `emailVerified: true`.
   - Fetch fails or email absent → **email stripped**, `emailVerified: false`,
     note recorded on the candidate. The lead still inserts (batch 1 had 4
     no-email leads with real decision-makers — that's a valid outcome).
   - LinkedIn URLs: kept only if they appear in `sourceUrls` (i.e. the model
     actually visited them); otherwise stripped.
4. **Insert as `staged`.** Reuse importer validation + dedupe
   (company + decisionMaker.email), extracted from `scripts/import-leads.ts`
   into `src/lib/outreach/import-leads.ts` (the script becomes a thin CLI
   wrapper over the shared lib). Dupes recorded as `skippedDupes`.

## Cost control

- Price every response from `usage` (input/output token counts × Opus 5 rates
  $5/$25 per MTok, + per-search fees) and accumulate on the job doc.
- Hard cap `LEAD_RESEARCH_COST_CAP_USD` (default 20). Checked between
  candidates; on breach the job ends `aborted_cost`, keeping inserted leads.
- `count ≤ 25` bounds the worst case independently of the meter.

## API routes

All session-gated like the rest of `/api/admin/outreach/*` — per the admin-auth
model, every route gates itself.

| Route | Behavior |
|---|---|
| `POST /api/admin/outreach/research` | validate input; reject if a job is queued/running; create job |
| `GET /api/admin/outreach/research` | active job + recent jobs (last ~10) |
| `POST /api/admin/outreach/research/[id]/cancel` | mark cancelled; worker stops at next candidate boundary |
| `POST /api/admin/outreach/import` | paste-JSON import; `dryRun` flag; reuses shared importer lib |

## UI — fourth console tab "Find leads"

- Form: segment select, niche text, region text, count (default 20).
- Active-job card: status, candidate-by-candidate progress, running cost,
  cancel button; polls every 5s.
- Recent jobs list: outcome counts (inserted / no-email / dupes / discarded)
  with per-candidate notes explaining drops.
- "Import JSON" box: paste a batch, dry-run preview (valid/invalid/dupes),
  then apply. Covers Claude-chat-researched batches; removes the terminal
  dependency entirely.
- Inserted leads flow into the existing Review Queue unchanged.

## Error handling

- Per-candidate try/catch: a failure logs a note on the candidate and skips;
  the job fails only after 3 consecutive errors.
- `stop_reason: "refusal"` handled explicitly (skip candidate with note) —
  never read `content[0]` unconditionally.
- SDK retries 429/5xx automatically; no extra retry layer.
- Cost abort, cancel, and worker restart all preserve inserted leads.

## Testing (house harness: `npx tsx` + node:assert, no live API calls)

- Email-verification gate: published (plain + obfuscated), absent, fetch-fail.
- Cost meter: accumulation and cap-abort behavior.
- Shared importer lib: validation, field-stripping, dedupe (moved tests keep
  covering the CLI path).
- Pipeline test with the Anthropic client mocked: discovery → per-candidate →
  insert, including refusal and consecutive-error paths.

## Env

- `ENABLE_LEAD_RESEARCH` (worker on/off; mirrors `ENABLE_OUTREACH_WATCHER`)
- `LEAD_RESEARCH_COST_CAP_USD=20`
- existing `ANTHROPIC_API_KEY`

## Out of scope

- Scheduled/recurring research runs (manual trigger only).
- Automating `[DEMO_LINK]` substitution (existing approve-time flow stands).
- New segments (uses the existing 6; niche free-text covers sub-programs).
- The legacy `prospect-discovery` skill / `Prospect` model — untouched.
