# Reply Email to Oussama Ahmane

---

**Subject**: Re: Strategic Partnership: AI-Tutor Integration for the Algerian High School Market

Dear Oussama,

Thank you for reaching out — your understanding of the Algerian BAC market and the inadequacy of text-only AI solutions aligns closely with the problem our Voice Tutor was built to solve.

I've reviewed your technical requirements in detail and I'm confident we can support your vision. Let me address each point and outline what a partnership would look like.

---

### What We Offer

Our **AI Voice Tutor** is a multimodal tutoring system that combines natural voice conversation with a synchronized interactive whiteboard. Students speak to the AI tutor naturally, and the tutor responds verbally while simultaneously rendering equations, graphs, diagrams, and molecular structures on screen — 19 visual types in total.

I've attached two documents for your review:

1. **Product Overview (v2.1)** — Capabilities, curriculum coverage (7 subjects, 200+ topics, K through College), pedagogical approach, and visual types
2. **Technical Integration Spec (v3.7)** — Architecture, embed API, authentication, webhooks, curriculum module system, and sandbox access

---

### Your Requirements — Our Response

**Interactive Whiteboard & Real-time Visuals**
This is our core strength. The whiteboard supports LaTeX equations, interactive function graphs, free-body diagrams, vector diagrams, geometry, molecular structures, and more — all generated in real-time, synchronized with the tutor's verbal explanation. No text-only limitations.

**Multimodal Code-Switching (Darja + Arabic/French notation)**
Our whiteboard renders formal mathematical and scientific notation independently of the spoken language. The voice engine supports Arabic and French across 50+ languages. This means the tutor can speak in the student's preferred language while the whiteboard displays standard international notation. We would want to validate Algerian Darja specifically during the sandbox phase to ensure dialect recognition accuracy.

**Curriculum-Grounded RAG (Algerian STEM PDFs)**
Our platform features an extensible Knowledge Module system designed exactly for this. You upload your curriculum content — either as structured JSON or directly as PDFs — via our API, and our system ingests and indexes it automatically. The tutor then grounds all instruction in your national BAC standards. You control the modules entirely: upload, update, and manage them through the API at your own pace. Details are in Section 4 of the technical spec.

**Localized Payment Processing (Chargily / DZD)**
Our integration model keeps payments entirely on your side. You handle authentication, billing, and student management in your PWA; we provide the tutoring engine as an embedded component. Chargily integration is yours to build — no conflicts with our architecture.

---

### Integration Model

We recommend a **hosted embed** approach: you integrate the Voice Tutor into your PWA via iframe. We host and maintain the tutoring engine; you control the surrounding experience. This gets you to market fastest while preserving your full brand identity.

The flow:
1. Your student authenticates on your platform and selects a subject
2. Your backend generates a signed session token with the student's context
3. Your frontend loads our tutor embed with that token
4. We send session data (transcripts, usage, analytics) back to you via webhooks
5. Your dashboard displays progress and manages billing

Integration is self-service — we provide sandbox API keys and documentation, and your team drives the timeline. Full details including webhook formats, API reference, and configuration parameters are in the technical spec.

---

### Pricing

Simple usage pricing, no fixed fees:

- **$0.10 per tutoring minute** (voice or text) — a 30-minute session costs $3.00
- **No setup fee, no monthly platform fee, no minimum commitment**
- Every minute includes the full whiteboard (all 19 visual types), 50+ languages, session analytics and the partner API
- Minutes are metered per session and billed monthly in arrears; volume pricing is available from 50,000 minutes/month

---

### Your Timeline

Your October 2026 launch target is well within reach. Our onboarding is self-service and typically takes 3-8 weeks. With sandbox access provisioned this week and your team driving integration over the summer, you'd be production-ready well ahead of the new academic year.

---

### Next Steps

1. **Sandbox access**: I can provision your sandbox API keys immediately so your team can start exploring the embed, API, and webhook system (the sandbox runs the same engine as production, with 300 free minutes)
2. **Curriculum upload**: Once you have a sample of your target BAC syllabus (even 1-2 subjects), you can upload it via the module API or PDF ingestion endpoint and see it reflected in the tutor immediately
3. **Questions**: I'm available by email for any technical questions during integration

Please find the product overview and technical specification attached.

Best regards,

Luke
Evelyn Learning
info@evelynlearning.com
