# Data Processing Agreement (Template)

**Version:** 0.1 DRAFT for Praveen's review — **have counsel review before first use.** Bracketed fields are filled per partner. This template is written for a US education partner; the GDPR annex applies only where the partner is subject to EU/UK law.

This Data Processing Agreement ("DPA") forms part of the services agreement (the "Agreement") between **Evelyn Learning** ("Provider") and **[PARTNER LEGAL NAME]** ("Partner"), effective **[DATE]**.

## 1. Definitions

"Student Data" means any information relating to an identified or identifiable student that Partner or its users provide to Provider or that Provider generates in delivering the Services, including identifiers, session transcripts, whiteboard content, uploaded images, learner progress and technical metadata. "Services" means the AI tutoring and related platform services described in the Agreement. "Sub-processor" means a third party engaged by Provider to process Student Data. "Applicable Law" includes FERPA, COPPA, applicable state student privacy laws, and, where applicable, GDPR/UK GDPR.

## 2. Roles and ownership

2.1 Partner is the controller (and, where applicable, the "school" or "operator") of Student Data. Provider is a processor / service provider acting only on Partner's documented instructions.
2.2 Student Data, the Partner's customer relationships and customer database are and remain Partner's property. Provider acquires no rights in Student Data other than the limited right to process it to provide the Services.

## 3. Purpose and limits of processing

3.1 Provider processes Student Data solely to provide, secure, support and improve the Services for Partner.
3.2 Provider shall not: (a) sell Student Data; (b) use Student Data for advertising or to build profiles for any purpose other than the Services; (c) use Student Data to train or fine-tune artificial-intelligence models; (d) disclose Student Data except to Sub-processors under §6 or as required by law.
3.3 Provider may use de-identified, aggregated data that cannot reasonably identify a student or Partner to operate and improve the Services.

## 4. Partner obligations

4.1 Partner is responsible for the lawful basis for processing, including obtaining any consents required from parents or guardians (including verifiable parental consent under COPPA for students under 13), and for providing required privacy notices.
4.2 Partner will pass only the identifiers necessary for the Services and is encouraged to use pseudonymous student identifiers.

## 5. Security

5.1 Provider maintains the technical and organisational measures described in **Annex 2** (Security Measures), which it may update provided the overall level of protection is not reduced.
5.2 Provider restricts access to Student Data to personnel who need it to provide the Services and who are bound by confidentiality obligations.

## 6. Sub-processors

6.1 Partner authorises the Sub-processors listed in **Annex 3**.
6.2 Provider will give Partner **[30] days'** notice of any new Sub-processor. Partner may object on reasonable data-protection grounds; if the objection cannot be resolved, Partner may terminate the affected Services without penalty.
6.3 Provider remains responsible for its Sub-processors' performance.

## 7. Data subject and parent requests

Provider will, within **[10] business days**, assist Partner in responding to requests from parents, eligible students or authorities to access, correct or delete Student Data, and will refer any such request received directly to Partner.

## 8. Security incidents

Provider will notify Partner without undue delay and no later than **72 hours** after confirming a security incident involving Student Data, and will provide information reasonably required for Partner to meet its own notification obligations, and cooperate in remediation.

## 9. Retention, return and deletion

9.1 Provider retains Student Data for the term of the Agreement and **[24 months]** after last activity, unless Partner instructs otherwise.
9.2 On Partner's request or on termination, Provider will export Student Data to Partner in a standard format and delete it from its systems (including Sub-processors) within **[30] days**, and confirm deletion in writing, except where retention is required by law.

## 10. Audit and information

Provider will make available the information reasonably necessary to demonstrate compliance with this DPA, including the Security Overview, and will complete Partner's reasonable security questionnaires no more than once per year. On-site audits require **[30] days'** notice, are limited to once per year absent a security incident, and are at Partner's cost.

## 11. Education-specific terms (US)

11.1 **FERPA.** Where Partner is an educational agency or institution or acts on its behalf, Provider is designated a "school official" with a legitimate educational interest, is under Partner's direct control with respect to the use and maintenance of education records, and will not redisclose them except as permitted by Partner in writing or required by law.
11.2 **COPPA.** Provider collects personal information from children only as directed by Partner and uses it solely to provide the Services to Partner, consistent with the school-consent exception where applicable.
11.3 **State laws.** Provider will comply with applicable state student privacy laws (including Illinois SOPPA and California SOPIPA where applicable) and, on request, execute the applicable state student data privacy agreement.

## 12. International transfers (only where GDPR/UK GDPR applies)

Student Data is processed in **[the United States]**. Where GDPR/UK GDPR applies, the parties incorporate the EU Standard Contractual Clauses (Module 2) and the UK Addendum by reference, with Partner as data exporter and Provider as data importer.

## 13. Term and precedence

This DPA lasts as long as Provider processes Student Data. In case of conflict, this DPA prevails over the Agreement for data-protection matters.

---

## Annex 1 — Processing details

- **Subject matter:** AI tutoring sessions and learning progress.
- **Duration:** term of the Agreement plus the retention period in §9.
- **Categories of data subjects:** students (including minors), and parents/guardians where they opt into reports.
- **Categories of data:** identifiers supplied by Partner, optional first name, session transcripts and whiteboard content, uploaded homework images, learner progress, technical metadata.
- **Special categories:** none intended; Partner will not direct Provider to process them.

## Annex 2 — Security measures

Transport encryption (TLS 1.2/1.3); signed short-lived session tokens and per-partner API secrets; access to production restricted to named engineering staff; admin access via allow-listed single sign-on; rate limiting and quotas; **[encryption at rest — state only what is true]**; **[backup policy — state only what is true]**; incident response per §8. Full description: the Security Overview, as updated.

## Annex 3 — Authorised Sub-processors

| Sub-processor | Function | Location |
|---|---|---|
| Anthropic PBC | AI tutoring model | United States |
| Cartesia AI | Text-to-speech / speech-to-text | United States |
| Deepgram | Speech-to-text (fallback) | United States |
| OpenAI | Speech pipeline components `[VERIFY]` | United States |
| Google LLC | Staff sign-in; Google Classroom integration (if enabled by Partner) | United States |
| Resend | Transactional email (Academy) | United States |
| Cloudflare | Bot protection (Academy) | United States |
| Stripe | Payments (Academy, Partner-configured) | United States |

**Signatures**

Evelyn Learning: ______________________ Name / Title / Date
[PARTNER]: ______________________ Name / Title / Date
