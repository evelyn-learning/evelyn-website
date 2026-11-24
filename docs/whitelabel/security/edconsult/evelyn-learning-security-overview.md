---
title: "Evelyn Learning — Security and Data Protection Overview"
subtitle: "Prepared for EdConsult Solutions · November 2026 · Draft v1.0"
---

## 1. Summary

Evelyn Learning provides the voice tutor behind the ECS Voice Tutors. EdConsult Solutions ("ECS") offers it to schools as professional learning for educators. We act as a **service provider** to ECS: ECS decides who takes part and what identifies them, and remains the owner of its school relationships.

The people who use an ECS Voice Tutor are **adult educators**, not students. No student accounts are created and no student records are requested.

For school sessions the tutor keeps nothing of the conversation: no audio is recorded, nothing is remembered between sessions, and the transcript is deleted when the session ends. We never sell data, never use it for advertising, and do not use conversations to train AI models.

We do not hold a SOC 2 report. This document describes our controls as they stand so that a district can assess them directly.

## 2. Two configurations

**School configuration: nothing kept.** Every session offered to a school runs this way.

- No audio is recorded.
- Nothing is remembered from one session to the next.
- The transcript, what was shown on the screen, and the name the participant chose to give are deleted when the session ends.

What remains is a session record without content: that a session took place, when, for how long, and technical diagnostics.

**Review configuration: kept for improvement.** While a tutor is being developed, ECS's own named reviewers use separate links that keep the transcript, the audio and their review notes, so that ECS and Evelyn Learning can improve the tutor. These links are never given to school participants. Review data is deleted within 30 days of ECS ending the review phase, or earlier on request.

## 3. What we collect

| Data | Source | School configuration | Review configuration |
|---|---|---|---|
| Participant identifier | ECS, signed into the session link | Kept. A pseudonymous ID is recommended | Kept |
| How the person asks to be addressed | Spoken by the participant, optional | Used in the session, deleted at session end | Kept with the transcript |
| Session transcript (participant and tutor turns) | Generated in session | Deleted at session end | Kept |
| What is shown on the screen | Generated in session | Deleted at session end | Kept |
| Session audio | Generated in session | Not recorded | Kept |
| Memory between sessions | Derived | Off | On |
| Reviewer notes | Spoken or typed by an ECS reviewer | Not available | Kept |
| IP address, approximate location, device type, timestamps | Browser | Kept for abuse prevention and diagnostics | Kept |

We do not collect date of birth, home address, email or phone number from participants. Participants are asked to talk about their own practice. The tutor does not ask for students' names, and participants are asked not to give them.

## 4. Where data lives and how it is protected

- **Hosting.** A dedicated server with a US-based hosting provider, located in Seattle, Washington, running Ubuntu 24.04 LTS. ECS runs under its own partner identity on this infrastructure.
- **Data location.** Data is stored and processed in the United States.
- **Encryption in transit.** All traffic is served over HTTPS with TLS 1.2/1.3 and automatically renewed certificates.
- **Signed session links.** Each link is signed with a secret held only by ECS and Evelyn Learning, names one participant, and expires.
- **Server access.** Administrative access is by SSH key only. Password sign-in is switched off, and repeated failed attempts are blocked automatically.
- **Network.** A firewall admits only web traffic and rate-limited administrative access. The database accepts connections from the server itself only and cannot be reached from the internet.
- **Staff access.** Production access is limited to a small number of named Evelyn Learning engineers. Admin dashboards require Google sign-in restricted to an allow-list of staff accounts.
- **Backups.** The database is backed up every night. Each backup is encrypted before it leaves the server, stored off-site, and deleted after 30 days.
- **Logging.** Application logs record technical events, rotate at 50 MB per file, and keep the last 14 files. In the school configuration they contain no conversation content.

## 5. Sub-processors

During a session, what is said is sent to a small number of specialist providers so that the tutor can listen, think and speak. Each receives only what its function needs, under terms that bar the use of our content to train its models. All are based in the United States.

| Provider | Function | Location | Provider's own retention |
|---|---|---|---|
| AI model provider | Writes the tutor's replies | United States | Up to 30 days, then deleted |
| Speech provider | Speech-to-text and the tutor's voice | United States | Not retained |
| Real-time audio provider | Carries the live audio connection | United States | Up to 30 days for abuse monitoring, then deleted |
| Backup storage provider | Holds encrypted backups | United States | 30 days |
| Hosting provider | Runs the server | United States | For the term of service |

The named list is provided to ECS, and to a district's data privacy officer on request, under confidentiality. ECS is given 30 days' notice of any new sub-processor and may object on reasonable data-protection grounds.

## 6. Retention and deletion

- **School configuration.** Conversation content is deleted when the session ends. The content-free session record is kept for the term of the agreement and 12 months after.
- **Review configuration.** Deleted within 30 days of ECS ending the review phase, or earlier on request.
- **Backups.** Deleted after 30 days.
- **On request.** Deletion of one participant's data, or of all ECS data, is completed within 30 days of a written request and confirmed in writing.
- **On termination.** ECS data is exported to ECS on request and then deleted.

## 7. Privacy laws

- **Who the data is about.** Participants are school staff taking part in professional learning. This is not a student education record.
- **FERPA.** If a participant mentions information from a student's education record in conversation, we treat it under the school-official exception: used only to deliver the session, under the school's direct control, and never redisclosed. In the school configuration it is deleted with the rest of the conversation at session end.
- **COPPA.** The service is offered to adults only and is not directed to children.
- **New Jersey districts.** We sign the district's own data privacy agreement, or the Student Data Privacy Consortium's National Data Privacy Agreement where the district uses it. In either case we accept the obligations districts ask of an operator: no sale of data, no targeted advertising, no profiling beyond the service, reasonable security, prompt breach notice, and deletion on request and at the end of the contract.

## 8. Application security

- Signed, expiring session links; a per-partner secret; per-partner rate limits and a usage cap.
- Typed codebase with automated test suites; scripted deployments checked after every release.
- An independent penetration test is planned before the first district contract.

## 9. Incident response

If we become aware of a security incident affecting ECS data, we notify ECS without undue delay and within 72 hours of confirmation, with the nature of the incident, the data affected and the remediation steps. Incident owner: Praveen Tyagi, Founder, praveen@evelynlearning.com.

**Contact:** Praveen Tyagi, Founder — praveen@evelynlearning.com
