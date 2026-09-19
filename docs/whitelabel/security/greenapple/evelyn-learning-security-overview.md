---
title: "Evelyn Learning — Security and Data Protection Overview"
subtitle: "Prepared for GreenApple Campus · September 2026 · v1.0"
---

## 1. Summary

Evelyn Learning provides an AI tutor that students use through a partner's own platform or brand. We act as a **service provider** to the partner: the partner controls which student identifiers are shared with us and remains the owner of its student relationships and data. We collect the minimum needed to run a tutoring session, use student data only to deliver and support the service for that partner, and never sell it, use it for advertising, or use it to train AI models.

We do **not** hold a SOC 2 report. Rather than offer a badge, this document describes our controls as they stand today so that your team can assess them directly, and lists what we are changing next.

## 2. What we collect

| Data | Source | Purpose |
|---|---|---|
| Student identifier | Partner, signed into the session token | Link sessions to a learner. A pseudonymous ID is recommended |
| Student first name (optional) | Partner | The tutor addresses the student by name. Omit it and no name is used |
| Subject, topic, level, session goal | Partner | Select the lesson |
| Session transcript (student and tutor turns) | Generated in session | Teaching continuity, progress reports, partner API |
| Whiteboard content and lesson progress | Generated in session | Resume, replay, progress |
| Homework photos (optional) | Student upload | Read the exercise; stored with the session |
| Learner model (mastery, gaps, review schedule) | Derived | Personalisation and partner reports |
| Session audio | Generated in session | Replay and quality review; can be disabled per partner on request |
| IP address, approximate location, device type, timestamps | Browser | Abuse prevention and analytics |

We do not collect date of birth, home address, email or phone number from students.

## 3. Where data lives and who can reach it

- **Hosting.** A dedicated virtual private server operated by Contabo GmbH in Düsseldorf, Germany (EU), running Ubuntu 24.04 LTS. Each white-label brand runs on its own database on this infrastructure.
- **Data location.** Student data is stored in the European Union and processed in the United States by the AI and speech providers listed in section 4. A US-hosted deployment is available for partners who require US data residency.
- **Transport encryption.** All traffic is served over HTTPS with TLS 1.2/1.3 and automatically renewed certificates. Partner API calls are signed with a per-partner secret; student sessions use short-lived signed tokens.
- **Encryption at rest.** Data is not currently encrypted at the database layer. Enabling encrypted storage is scheduled for the fourth quarter of 2026.
- **Access control.** Production access is limited to a small number of named Evelyn Learning engineers using SSH keys. Admin dashboards require Google sign-in restricted to an allow-list of staff accounts. Partner API secrets are rotated on request.
- **Backups.** Automated nightly encrypted database backups with 30-day retention and an off-site copy are being put in place, scheduled for October 2026. Until then, recovery relies on the hosting provider's snapshots and our scripted, repeatable deployments.
- **Logging.** Application logs rotate at 50 MB per file with the last 14 files retained. Session-level telemetry is stored with the session for quality review.

## 4. Sub-processors

Student data is shared with the following providers only to deliver the service. Each receives the minimum needed for its function.

| Provider | Function | Location |
|---|---|---|
| Anthropic PBC | AI tutoring model | United States |
| Cartesia AI | Text-to-speech and speech-to-text | United States |
| Deepgram | Speech-to-text (fallback path) | United States |
| OpenAI | Speech pipeline components | United States |
| Google LLC | Staff sign-in; Google Classroom integration only for partners who connect it | United States |
| Resend | Transactional email (sign-in links, parent reports) | United States |
| Cloudflare | Bot protection on public forms | United States |
| Stripe | Subscription billing for partners who use it; payment details never touch our servers | United States |
| Contabo GmbH | Hosting | Germany |

Partners are given 30 days' notice of any new sub-processor and may object on reasonable data-protection grounds.

## 5. Retention and deletion

- Sessions, transcripts, audio and learner data are retained for the term of the partner agreement and for 24 months after a student's last activity, unless the partner instructs otherwise.
- Deletion of an individual student's data, or of all partner data, is completed within 30 days of a written request and confirmed in writing. Learner-model data can be erased immediately through the partner API; transcripts, audio and session records are removed by our engineering team under the same request.
- On termination, partner data is exported to the partner on request and then deleted.

## 6. Student privacy laws

- **FERPA (US).** Where the partner is a school or acts on a school's behalf, we operate under the school-official exception: education records are used only for the contracted purpose, under the school's direct control, and are never redisclosed.
- **COPPA (US, under 13).** The partner, as the operator with the direct relationship to families, obtains verifiable parental consent where required. We collect no personal information from children beyond the identifier and optional first name the partner supplies, and use it for no purpose other than the service.
- **State student-privacy laws** (including Illinois SOPPA and California SOPIPA). We sign the partner's or the Student Data Privacy Consortium's standard student data privacy agreement where required.
- **GDPR / UK GDPR.** A Data Processing Agreement incorporating the Standard Contractual Clauses is available for partners subject to EU or UK law.

## 7. Application security

- Signed, expiring session tokens; per-partner secrets; per-partner rate limits and daily quotas; gated demo access.
- Typed codebase with automated test suites; code review before release; scripted deployments verified after every release; dependencies scanned for known vulnerabilities.
- No third-party penetration test has been completed yet. One is planned before our first school-district contract.

## 8. Incident response

If we become aware of a security incident affecting partner data, we notify the partner without undue delay and within 72 hours of confirmation, with the nature of the incident, the data affected and the remediation steps. Incident owner: Praveen Tyagi, Founder, praveen@evelynlearning.com.

## 9. What changes next

| Item | Target |
|---|---|
| Automated nightly encrypted backups with off-site copy | October 2026 |
| Encrypted storage at the database layer | Q4 2026 |
| Third-party penetration test | Before the first district contract |
| SOC 2 Type I readiness assessment | On partner demand |

**Contact:** Praveen Tyagi, Founder — praveen@evelynlearning.com
