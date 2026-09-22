# CRM: unified lead timeline across contact form, Gmail, and LinkedIn — Spec

**Date:** 2026-09-21 · **Owner:** Praveen · **App:** `apps/marketing` (admin outreach console at `/admin/outreach`)

## Problem

The outreach console (find → review → today → pipeline) already keeps a per-lead `touches[]` timeline, but:

- touches store a one-line summary, never the message body;
- inbound email is only detected on threads the console itself drafted;
- contact-form submissions land in `ContactSubmission`, never linked to a `Lead`;
- LinkedIn conversations have no ingest path at all;
- a lead has one global status; there is no per-product stage.

Praveen copies conversations by hand today. The goal is that every channel grows the lead's timeline automatically (or with one click), so the console becomes the CRM.

## Decisions (locked)

1. **The `Lead` is the CRM record.** No new "Contact" or "Activity" collection. `touches[]` grows `subject`, `body`, `from`, `to`, `externalId`, `account`. Dedupe on `externalId` (Gmail message id, LinkedIn message hash).
2. **One lead per organisation; opportunities per product.** `Lead.opportunities[]` = `{ product, stage, nextActionAt, notes, updatedAt }`. Stage lists live in a `PipelineConfig` collection keyed by product, defaulting to the existing seven `LEAD_STATUSES`. `Lead.status` stays as the global outreach status (the cadence machinery depends on it).
3. **Products:** `voice_tutor | academy | mock_exams | white_label | content_services | other`.
4. **Matching order for any inbound identity:** exact email (against `decisionMaker.email` or `Lead.emails[]`) → normalised LinkedIn profile URL → organisation domain (email domain or `website` host, excluding free-mail providers) → create a new lead (`segment: "other"`, `source` names the channel).
5. **Status effects of ingest:** a lead with any inbound touch that is `staged | approved | contacted | parked` becomes `replied`. A newly created lead with only outbound touches becomes `contacted` with `nextActionAt = null` (imported conversations do not enter the 4-step cadence). `dead`, `replied`, `call_booked` are never changed by ingest.
6. **Contact form:** a required "What is this about?" select — `product_inquiry | demo_request | partnership | careers | support | other` — plus a hidden `product` set from the CTA query string. `careers` (and a keyword screen: resume, résumé, cv, position, applying, job, internship, vacancy) never creates a lead; it points to `/careers`. Everything else upserts a lead with an inbound `form` touch carrying the full message. The existing `ContactSubmission` row is still written (back-compat for `/admin/contacts`) and stores `reason` + `product`.
7. **Gmail:** two mailboxes, `praveen@evelynlearning.com` and `info@evelynlearning.com`. `info@` aliases (treated as self): contact, hello, legal, support, admin, training, security `@evelynlearning.com`. Ingest = **sent-folder threads, last 365 days**, paged 50 threads per request, dry-run first. Ongoing = the reply watcher cron also ingests threads labelled `CRM` in either mailbox (`label:CRM newer_than:3d`).
8. **Gmail thread skip rules (per thread):** (a) every self message has subject exactly `Thank you for contacting Evelyn Learning` → skip as `auto_reply_only`; (b) subject starts with `New Contact Form Submission:` → skip as `self_notification`; (c) no external participant after removing evelynlearning.com, evelyntutor.com, crimsora.com addresses → skip as `internal`; (d) any participant matching `no-?reply|notifications?|billing|calendar|mailer-daemon|postmaster|apollo|hunter|prospeo` local-parts/domains → skip as `machine`; (e) one outbound message and no reply → **import but flag `needsReview: true`** (lead created as `staged` so it lands in the Review tab). Everything else imports.
9. **LinkedIn:** no API. Two paths. (a) **Same-day:** a bookmarklet on the open LinkedIn conversation collects the thread text + profile URL + name and opens `/admin/outreach/linkedin-import#<base64url JSON>`; that page (same-origin, admin session) previews the parsed messages and POSTs them. A plain textarea on the same page is the fallback. (b) **Backfill:** upload LinkedIn data-archive `messages.csv` + `Connections.csv`; only conversations where the owner sent at least one message are imported.
10. **Legacy stores untouched:** `Prospect`, `ProspectingConfig` stay as they are. A one-off script backfills non-careers `ContactSubmission` rows into leads (dry-run by default).
11. **UI:** Pipeline tab gets a product filter, an opportunities column, and a per-lead timeline drawer showing full touch bodies. A new **Import** tab hosts Gmail import (account, days, dry-run → preview → run), the LinkedIn import link/bookmarklet, and archive upload.

## Non-goals

Gmail push notifications (Pub/Sub); a browser extension; merging `Prospect` into `Lead`; email sending (the console still creates drafts only); per-user CRM permissions.

## Environment

- `GMAIL_OUTREACH_ACCOUNTS` = `praveen@evelynlearning.com,info@evelynlearning.com` (new; comma-separated; the existing `GMAIL_OUTREACH_USER` remains the default account).
- `LINKEDIN_OWNER_NAME` = `Praveen Tyagi`; `LINKEDIN_OWNER_PROFILE_URL` = owner's `https://www.linkedin.com/in/...` (new; used to mark outbound).
- Gmail OAuth consent must be granted once for `info@` via the existing `/api/admin/outreach/gmail/auth?account=info@evelynlearning.com`.

## Acceptance

- Submitting the contact form with reason `careers` creates no lead; with `demo_request` + `product=voice_tutor` creates/updates a lead whose latest touch is an inbound `form` touch with the full message and whose `opportunities` has `voice_tutor` at stage `replied`.
- Gmail dry-run over `info@` for 365 days returns counts per skip reason and a sample of kept threads; a real run creates leads and touches with bodies; re-running creates zero duplicates.
- Pasting the Skyler Scarlett conversation from this session into the LinkedIn import page yields 5 messages, correct direction, attached to one lead.
- Uploading a LinkedIn archive imports only conversations with an owner-sent message; re-upload is idempotent.
- Pipeline tab filters by product; the timeline drawer shows bodies.
