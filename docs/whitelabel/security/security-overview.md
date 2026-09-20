# Evelyn Learning — Security & Data Protection Overview

**Version:** 0.1 DRAFT for Praveen's review · **Date:** 2026-09-19 · **Applies to:** the AI Voice Tutor (embedded and white-label) and the Academy platform
**Status markers:** `[VERIFY]` = fact not confirmed by inspection; `[DECISION]` = policy Praveen must set before this goes out. Remove all markers before sending.

## 1. Summary

Evelyn Learning provides an AI tutor that students use through a partner's own platform or brand. We are a **service provider / processor**: the partner (school, tutoring organisation or brand owner) controls what student identifiers are shared with us and remains the owner of its student relationship and data. We collect the minimum needed to run a tutoring session and use student data only to deliver and improve the service for that partner. Student data is never sold, never used for advertising, and never used to train AI models.

We do **not** currently hold a SOC 2 report. This document describes our controls as they are today so a partner's counsel can assess them directly.

## 2. What we collect

| Data | Source | Purpose | Notes |
|---|---|---|---|
| Student identifier (`student_id`) | Partner, signed in the embed token | Link sessions to a learner | Partner chooses the identifier; a pseudonymous id is recommended |
| Student first name (optional) | Partner | The tutor addresses the student by name | Omit it and the tutor uses no name |
| Subject, topic, level, session goal | Partner | Select the lesson | |
| Session transcript (student and tutor turns) | Generated in session | Teaching continuity, progress reports, partner API | Typed and spoken turns (speech is transcribed; audio handling in §5) |
| Whiteboard content and lesson progress | Generated in session | Resume, replay, progress | |
| Homework photos (optional) | Student upload | Read the exercise | Image is processed by the AI provider and stored with the session `[VERIFY retention]` |
| Learner model (mastery, gaps, review schedule) | Derived | Personalisation, partner reports | |
| Technical metadata (IP-derived approximate location, device type, timestamps) | Browser | Abuse prevention, analytics | IP address is hashed for demo analytics `[VERIFY: raw IP stored on tutor sessions? admin list shows clientIp]` |

We do not collect date of birth, home address, email or phone from students. Parent email addresses are collected only by the Academy platform when a parent opts into weekly reports.

## 3. Where data lives and who can reach it

- **Hosting:** a dedicated virtual private server (KVM) running Ubuntu 24.04 LTS, `[VERIFY provider and region]`. All partner tenants run on this infrastructure; each brand has its own database.
- **Transport encryption:** all traffic is served over HTTPS with TLS 1.2/1.3 and certificates from Let's Encrypt. Partner API calls are signed (HMAC) and embed sessions use short-lived signed tokens.
- **Encryption at rest:** `[DECISION — not verified on the server. Either enable disk-level encryption / encrypted volumes and state it, or state "provider-level disk encryption" only if the provider confirms it. Do NOT claim AES-256 at rest until one of these is true.]`
- **Access control:** production access is limited to Evelyn Learning engineering `[VERIFY: who has SSH keys]`. Admin dashboards require Google sign-in restricted to an allowlist of Evelyn Learning staff accounts. Partner API access is per-partner secret, rotatable on request.
- **Backups:** `[DECISION — no automated database backup job was found on the server. Set a policy (e.g. nightly encrypted dump, 30-day retention, off-box) and implement it before sending this document, or state honestly that backups are point-in-time snapshots by the hosting provider if that is verified.]`
- **Logging and monitoring:** application logs are retained on the server `[VERIFY rotation period]`; session-level telemetry is stored with the session for quality review.

## 4. Sub-processors

Student data is shared with the following providers only to deliver the service. Each receives the minimum needed for its function.

| Provider | Function | Data it sees |
|---|---|---|
| Anthropic | AI tutoring model (primary) | Session transcript, whiteboard state, homework images, student first name if provided |
| DeepSeek | AI tutoring model fallback — **not used for partner (embedded / white-label) sessions** as of 2026-09-19; applies only to Evelyn Learning's own public demo | None for partner sessions |
| OpenAI | Speech pipeline components / fallback transcription `[VERIFY exact current use]` | Audio / transcript segments |
| Cartesia | Text-to-speech and speech-to-text | Tutor text to voice; student audio to text |
| Deepgram | Speech-to-text (fallback path) | Student audio |
| Google | Admin sign-in; Google Classroom integration where enabled | Staff identity; classroom data only for partners who connect it |
| Resend | Transactional email (Academy: sign-in, parent reports) | Recipient email, report content |
| Cloudflare | Bot protection on public forms (Academy) | Request metadata |
| Stripe | Subscription billing (Academy, partner-configured) | Payment details never touch our servers |
| Copyscape | Plagiarism check (essay products only) | Submitted essay text |

Partners are notified of sub-processor changes `[DECISION: notice period, e.g. 30 days]`.

## 5. Voice and recordings

Student speech is streamed to the speech-to-text provider and transcribed in real time. Session audio may be recorded for replay and quality review `[VERIFY: recording on by default for partner tenants? retention?]`. Partners can request that recording be disabled for their tenant `[VERIFY this is configurable]`.

## 6. Retention and deletion

- Sessions, transcripts and learner data are retained for the life of the partner agreement `[DECISION: default retention, e.g. 24 months after last activity]`.
- Deletion: partners can request deletion of an individual student's data or of all tenant data; we complete deletion within `[DECISION: e.g. 30 days]` and confirm in writing. `[VERIFY: is there a deletion script/route today? If not, document the manual procedure.]`
- On termination, tenant data is exported to the partner on request and then deleted.

## 7. Student privacy laws

- **FERPA (US):** where the partner is a school or acts for one, we operate under the school-official exception: we use education records only for the contracted purpose, under the school's direct control, and do not redisclose them.
- **COPPA (US, under-13):** the partner is the operator with the direct relationship to parents and obtains verifiable parental consent where required; we collect no personal information from children beyond the identifier and optional first name the partner supplies, and we do not use it for any purpose other than the service.
- **State student-privacy laws (e.g. Illinois SOPPA, California SOPIPA):** we sign the partner's or the state consortium's student data privacy agreement where required `[DECISION: are we willing to sign the SDPC National DPA? Recommended: yes]`.
- **GDPR (EU/UK partners):** a Data Processing Agreement with standard contractual clauses is available; see the DPA.

## 8. Application security practices

- Signed embed tokens with expiry; per-partner secrets; rate limits and daily quotas per partner and endpoint; demo access gated with quotas.
- Dependencies are tracked in the repository; security advisories are reviewed `[VERIFY cadence — GitHub currently reports open dependabot findings]`.
- Deployments are scripted, run from reviewed branches, and verified after each release.
- No penetration test has been performed to date `[DECISION: commission one before the first district contract]`.

## 9. Incident response

If we become aware of a security incident affecting partner data we will notify the partner without undue delay and within **72 hours** of confirmation, with the nature of the incident, data affected, and remediation steps. `[DECISION: contact channel and named owner]`

## 10. Roadmap

`[DECISION — list only what is committed: e.g. encrypted off-box backups (date), SOC 2 Type I readiness (date), penetration test (date).]`

**Contact:** security@evelynlearning.com `[VERIFY mailbox exists]`
