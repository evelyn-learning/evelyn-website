---
title: "Data Processing Agreement"
subtitle: "Evelyn Learning and EdConsult Solutions · November 2026 · Draft v1.0"
---

This Data Processing Agreement ("DPA") forms part of the services agreement (the "Agreement") between **Evelyn Learning** ("Provider") and **EdConsult Solutions** ("Partner"), effective on the date of the last signature below.

## 1. Definitions

"Participant Data" means any information relating to an identified or identifiable participant (an educator or other adult taking part in a session) that Partner or its users provide to Provider, or that Provider generates in delivering the Services, including identifiers, session transcripts, screen content, session audio, reviewer notes and technical metadata, and any information about a student that a participant mentions in a session. "Services" means the AI voice tutor and related platform services described in the Agreement. "School Configuration" and "Review Configuration" have the meanings given in the Security and Data Protection Overview. "Sub-processor" means a third party engaged by Provider to process Participant Data. "Applicable Law" includes FERPA, COPPA, applicable state student privacy laws and, where applicable, GDPR and UK GDPR.

## 2. Roles and ownership

2.1 Partner is the controller of Participant Data, acting where applicable on behalf of the school or district it serves. Provider is a processor and service provider acting only on Partner's documented instructions.

2.2 Participant Data, Partner's customer relationships and Partner's customer database are and remain Partner's property. Provider acquires no rights in Participant Data other than the limited right to process it to provide the Services.

## 3. Purpose and limits of processing

3.1 Provider processes Participant Data solely to provide, secure, support and improve the Services for Partner.

3.2 Provider shall not: (a) sell Participant Data; (b) use Participant Data for advertising or to build profiles for any purpose other than the Services; (c) use Participant Data to train or fine-tune artificial-intelligence models; (d) disclose Participant Data except to Sub-processors under section 6 or as required by law.

3.3 Provider may use de-identified, aggregated data that cannot reasonably identify a participant, a student or Partner to operate and improve the Services.

## 4. Partner obligations

4.1 Partner is responsible for the lawful basis for processing, for its agreement with each school or district, and for telling participants how their session is handled. Partner will offer the Services to adults only.

4.2 Partner will pass only the identifiers necessary for the Services and is encouraged to use pseudonymous participant identifiers. Partner will ask participants not to name students.

## 5. Security

5.1 Provider maintains the technical and organisational measures described in Annex 2, which it may update provided the overall level of protection is not reduced.

5.2 Provider restricts access to Participant Data to personnel who need it to provide the Services and who are bound by confidentiality obligations.

## 6. Sub-processors

6.1 Partner authorises the categories of Sub-processor listed in Annex 3. Provider will give Partner the named list on request. The named list is Provider's confidential information: Partner will not publish it, and may share it only with a school or district that needs it to assess the Services and has agreed to keep it confidential.

6.2 Provider will give Partner 30 days' notice of any new Sub-processor. Partner may object on reasonable data-protection grounds; if the objection cannot be resolved, Partner may terminate the affected Services without penalty.

6.3 Provider remains responsible for its Sub-processors' performance.

## 7. Requests from participants, schools and authorities

Provider will, within 10 business days, assist Partner in responding to requests from participants, schools or authorities to access, correct or delete Participant Data, and will refer any such request received directly to Partner.

## 8. Security incidents

Provider will notify Partner without undue delay and no later than 72 hours after confirming a security incident involving Participant Data, will provide the information reasonably required for Partner to meet its own notification obligations, and will cooperate in remediation.

## 9. Retention, return and deletion

9.1 In the School Configuration, Provider records no audio, keeps no memory between sessions, and deletes the transcript, screen content and form of address when the session ends. It retains only a content-free session record, for the term of the Agreement and 12 months after.

9.2 In the Review Configuration, which is used only by Partner's named reviewers, Provider retains Participant Data until 30 days after Partner ends the review phase, or deletes it earlier on Partner's request.

9.3 Backups are encrypted and deleted after 30 days.

9.4 On Partner's request or on termination, Provider will export Participant Data to Partner in a standard format and delete it from its systems, including Sub-processors, within 30 days, and confirm deletion in writing, except where retention is required by law.

## 10. Audit and information

Provider will make available the information reasonably necessary to demonstrate compliance with this DPA, including its Security and Data Protection Overview, and will complete Partner's reasonable security questionnaires no more than once per year. On-site audits require 30 days' notice, are limited to once per year absent a security incident, and are at Partner's cost.

## 11. Education-specific terms (United States)

11.1 **FERPA.** Where Partner is an educational agency or institution, or acts on behalf of one, Provider is designated a "school official" with a legitimate educational interest, is under Partner's direct control with respect to the use and maintenance of education records, and will not redisclose them except as permitted by Partner in writing or required by law.

11.2 **Children.** The Services are not offered to children, and Provider does not knowingly collect personal information from them.

11.3 **State laws.** Provider will comply with applicable state privacy laws and, on request, will execute the school's or district's data privacy agreement, including the Student Data Privacy Consortium's National Data Privacy Agreement where the district uses it. In either case Provider accepts the obligations of an operator under that agreement: no sale of data, no targeted advertising, no profiling beyond the Services, reasonable security, prompt breach notice, and deletion on request and at the end of the contract.

## 12. Data location

Participant Data is stored and processed in the United States.

## 13. Term and precedence

This DPA lasts as long as Provider processes Participant Data. In case of conflict, this DPA prevails over the Agreement for data-protection matters.

## Annex 1 — Processing details

- **Subject matter:** professional-learning conversations with an AI voice tutor.
- **Duration:** term of the Agreement plus the retention period in section 9.
- **Data subjects:** adult educators and Partner's own reviewers.
- **Categories of data:** identifiers supplied by Partner, the form of address a participant chooses to give, technical metadata; and, in the Review Configuration only, session transcripts, screen content, session audio and reviewer notes.
- **Special categories:** none intended; Partner will not direct Provider to process them.

## Annex 2 — Security measures

Transport encryption (TLS 1.2/1.3); signed short-lived session tokens and per-partner API secrets; production access restricted to named engineers by SSH key, with password sign-in disabled and repeated failed attempts blocked; admin access through allow-listed single sign-on; per-partner rate limits and quotas; scripted, verified deployments; dependency vulnerability scanning; incident response per section 8. a host firewall admitting only web traffic and rate-limited administrative access; a database reachable from the server itself only; nightly encrypted off-site backups deleted after 30 days. The Security and Data Protection Overview forms part of this Annex as updated from time to time.

## Annex 3 — Authorised Sub-processors

| Sub-processor | Function | Location |
|---|---|---|
| AI model provider | Writes the tutor's replies | United States |
| Speech provider | Speech-to-text and the tutor's voice | United States |
| Real-time audio provider | Carries the live audio connection | United States |
| Backup storage provider | Holds encrypted backups | United States |
| Hosting provider | Runs the server | United States |

The named list is provided on request under section 6.1.

## Signatures

| Evelyn Learning | EdConsult Solutions |
|---|---|
| Name: Praveen Tyagi | Name: |
| Title: Founder | Title: |
| Date: | Date: |
| Signature: | Signature: |
