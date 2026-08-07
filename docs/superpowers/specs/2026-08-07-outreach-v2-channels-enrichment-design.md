# Outreach v2: per-channel drafts + enrichment — design

**Date:** 2026-08-07
**Status:** Approved by owner (grill-me session; "Nothing to amend, proceed")
**Context:** Owner worked the first live batch and hit four gaps: the email
draft doesn't fit LinkedIn InMail or contact forms; no way to pull a lead back
into Today; some leads lack emails that data vendors could supply; LinkedIn
URLs get dropped by the visited-page gate even when profiles exist.

## Owner decisions (from the grill)

1. **Cadence stays strict** — one channel-touch per day; Mark Sent advancing
   the lead out of Today is correct behavior. Only addition: a **"Work
   today"** control on Pipeline rows pulling a lead back into Today now.
2. **Channel tabs on one Today card** — Email | LinkedIn | Contact form,
   defaulting to today's expected cadence channel; each tab: its own draft,
   links, copy, Mark Sent.
3. **LinkedIn tier: Sales Navigator** — generate one InMail draft (subject +
   body ≤ 500 chars).
4. **Vendor emails accepted with provenance labels** — `published` keeps the
   green verified badge; vendor-sourced shows the provider name; owner always
   sees which is which before approving.
5. **Enrichment trigger: auto for gaps + manual button** — pipeline
   auto-enriches only leads finishing research with a named decision-maker but
   missing email or LinkedIn URL; per-lead "Enrich" button covers the rest.
6. **Auto-failover provider chain** — Apollo → Hunter.io → Prospeo, skipping
   unconfigured/exhausted providers, with a per-provider monthly credit
   ledger visible in the console.

## Schema changes (Lead)

- `decisionMaker.emailSource?: "published" | "vendor"` — set whenever `email`
  is present. `emailVerified` keeps its existing strict meaning
  (server-fetched-and-found on the cited page) and is **only** true for
  `published`.
- `decisionMaker.emailProvider?: string` — e.g. `"apollo"`, set when
  `emailSource === "vendor"`.
- `decisionMaker.linkedinSource?: "research" | "vendor"` — vendor-supplied
  URLs are accepted and labeled (parallel of the email decision).
- `linkedinDraft?: { subject: string; body: string }` — InMail, body ≤ 500
  chars (soft limit enforced by prompt, not schema).
- `contactFormDraft?: { body: string }` — self-contained (no threading):
  includes a sign-off with Praveen's name + evelynlearning.com + reply email.
- `contactPageUrl?: string` — the organization's contact/inquiry page, found
  at research time; powers the contact-form tab's link.
- `currentDraft` unchanged — remains the email draft + Gmail id carrier; the
  email tab reads it as today. No migration needed; new fields are optional.

New model **`ProviderCredit`**: `{ provider: string, month: "YYYY-MM",
used: number }` with unique index `{provider, month}`. Caps come from env
(`APOLLO_MONTHLY_CAP` default 100, `HUNTER_MONTHLY_CAP` 25,
`PROSPEO_MONTHLY_CAP` 75) so a free-tier limit change is an env tweak +
restart, not a code change.

## Enrichment library — `src/lib/outreach/enrich/`

- `types.ts`: `EnrichInput { name, title, company, websiteDomain }`,
  `EnrichResult { email?, linkedinUrl?, provider, creditsUsed }`,
  `EnrichProvider { name, isConfigured(), match(input): Promise<EnrichResult | null> }`.
- `apollo.ts` — POST `https://api.apollo.io/api/v1/people/match`
  (`x-api-key: APOLLO_API_KEY`), body `{ name, organization_name, domain,
  reveal_personal_emails: false }`. Uses `person.email` (skip
  `email_not_unlocked@…` placeholders) + `person.linkedin_url`.
- `hunter.ts` — GET `https://api.hunter.io/v2/email-finder?domain=&full_name=&api_key=`;
  accept only `score >= 80`; no LinkedIn from Hunter.
- `prospeo.ts` — POST `https://api.prospeo.io/email-finder`
  (`X-KEY` header), `{ full_name, company: domain }`; accept only
  `email_status === "VALID"`.
- `chain.ts` — `enrichLead(input): Promise<EnrichResult | null>`: iterate
  providers in order; skip if `!isConfigured()` or monthly ledger at cap;
  increment ledger on any attempt that returns data (a reveal = a credit);
  on 402/429/quota-shaped errors, mark the provider exhausted for the month
  (set `used = cap`) and continue down the chain. Provider HTTP calls have a
  10s timeout; provider errors never throw out of `enrichLead`.
- Quality floor: a vendor email is stored only when the provider marks it
  verified/valid (Apollo `email_status verified`, Hunter score ≥ 80, Prospeo
  VALID). Catch-all/guessed statuses are discarded — the no-fabrication bar
  applies to vendors too, just with the vendor's verifier instead of ours.

## Integration points

- **Pipeline (auto-for-gaps):** in `processJob`, after a candidate outcome of
  `inserted`/`no_email` where `decisionMakerName` is non-empty AND (no email
  OR no linkedinUrl): call `enrichLead`; merge results into the row before
  insert (email → `emailSource: "vendor"`, `emailVerified: false`,
  `emailProvider`; linkedinUrl → `linkedinSource: "vendor"`). Candidate note
  records the provider used. Enrichment failure is never a candidate error.
- **Manual:** `POST /api/admin/outreach/leads/[id]/enrich` (session-gated) —
  runs the same chain for one lead, merges the same way (never overwrites a
  published email with a vendor one), returns the updated lead + ledger
  state.
- **Ledger view:** `GET /api/admin/outreach/enrich/credits` → per-provider
  `{ provider, configured, used, cap, month }`; rendered as a small meter row
  in the Find-leads tab.
- **"Work today":** new `workToday` action in the existing lead PATCH route —
  sets `nextActionAt = now` (status untouched; Today tab already lists
  approved/contacted leads with due nextActionAt). Button on Pipeline rows.

## Draft generation

- **Research pipeline:** `LEAD_SCHEMA` + candidate prompt extended with
  `contactPageUrl`, `inmailSubject`, `inmailBody` (≤500 chars), and
  `contactFormBody` (self-contained, sign-off with contact info; still cites
  the specific real hook; `[DEMO_LINK]` line in all three drafts).
  `researchedToLeadRow` maps them to `linkedinDraft` / `contactFormDraft` /
  `contactPageUrl`.
- **Manual prompt** (`research-prompt.ts` + doc twin): same new fields.
- **Backfill for existing leads:** `scripts/backfill-channel-drafts.ts` —
  for staged/approved/contacted leads missing `linkedinDraft`: one Claude
  call per lead (claude-opus-5, NO web tools — drafts derive from stored
  `about`/`whyFit`/`useCaseHypothesis`; structured output), dry-run default,
  `--apply` writes. Run once at ship time by the operator (me), incl. against
  prod via the SSH tunnel.

## Today tab UI

Replace the single-draft area of each Today card with three tabs:
- **Email** — existing behavior verbatim (draft, Create Gmail draft, copy,
  Mark Sent email) reading `currentDraft`.
- **LinkedIn** — InMail subject+body from `linkedinDraft`, copy button, link
  to `decisionMaker.linkedinUrl` (with source badge; hidden if absent), Mark
  Sent (channel `linkedin`).
- **Contact form** — `contactFormDraft.body`, copy button, links to
  `contactPageUrl` (fallback: website), Mark Sent (channel `form`).
Default tab = the cadence's `expectedNextChannel` for the lead. Tabs with no
draft show a "Generate drafts" hint pointing at the backfill (no in-UI
generation in this round — YAGNI until the backfill proves insufficient).
Email-source badges appear wherever the email shows (Today + Review Queue):
green "Verified" (published) vs neutral badge with provider name (vendor).

## Env

`APOLLO_API_KEY` (from the owner's key file, added to `.env.local.production`
at ship time), optional `HUNTER_API_KEY` / `PROSPEO_API_KEY`, optional
`*_MONTHLY_CAP` overrides. Missing keys are fine — the chain skips them.

## Testing (house harness, no live vendor calls)

- Provider adapters: response parsing + quality-floor rejection per provider
  (fixture JSON, injected fetch).
- Chain: skip-unconfigured, skip-at-cap, quota-error failover, ledger
  increments, never-throws (all with fake providers + in-memory ledger fns
  where DB-free; ledger model gets validateSync tests).
- Pipeline merge: vendor email/linkedin merge rules incl. never-overwrite
  published email (extends pipeline.test.ts with fake enricher).
- Prompt/schema: new fields present in LEAD_SCHEMA + candidateParams; mapper
  tests for the three drafts + contactPageUrl.
- Guards: `test:outreach-guards` auto-covers new files (no value-imports from
  @/models in client code; no wide-inbox Gmail calls).

## Out of scope

- Sending InMails/contact forms programmatically (copy-paste flow only).
- Bulk enrichment button ("enrich all") — per-lead + auto-gaps only.
- Paid vendor tiers / plan upgrades; revisit when free credits actually bind.
- In-UI per-lead draft generation (backfill covers existing leads; research
  covers new ones).
