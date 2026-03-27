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

We offer usage-based pricing for white-label partners:

**Launch Partner Program (50% off)**

As one of our first integration partners, you qualify for our Launch Partner pricing:

- One-time setup: ~~$2,500~~ **$1,250** (includes sandbox access and integration support)
- Monthly platform fee: ~~$500/month~~ **$250/month for your first 12 months** (then $500/month)

**Usage (per tutoring minute)**

We offer three tiers to match different market segments:

| Engine | Per Minute | Typical 30-Min Session | Best For |
|---|---|---|---|
| Text Only | $0.02 | ~$0.60 | Budget-conscious, text-based markets |
| Standard Voice | $0.06 | ~$1.80 | Cost-effective at scale, ~1.5s response time |
| Premium Voice | $0.25 | ~$7.50 | Sub-400ms latency, natural interruptions, most conversational |

All tiers include full whiteboard support (all 19 visual types), 50+ languages, and session analytics. For your Algerian BAC market, the Standard engine at $0.06/minute is likely the right starting point — a 30-minute tutoring session costs just $1.80, making it accessible at scale. You can offer Premium as an upgrade tier for students preparing for competitive exam streams.

Volume discounts are available:

| Monthly Volume | Discount |
|---|---|
| 10,000 - 50,000 minutes | 10% |
| 50,000 - 200,000 minutes | 20% |
| 200,000+ minutes | Custom pricing |

---

### Your Timeline

Your October 2026 launch target is well within reach. Our onboarding is self-service and typically takes 3-8 weeks. With sandbox access provisioned this week and your team driving integration over the summer, you'd be production-ready well ahead of the new academic year.

---

### Next Steps

1. **Sandbox access**: I can provision your sandbox API keys immediately so your team can start exploring the embed, API, and webhook system (sandbox uses the Standard voice engine; Premium is available in production)
2. **Curriculum upload**: Once you have a sample of your target BAC syllabus (even 1-2 subjects), you can upload it via the module API or PDF ingestion endpoint and see it reflected in the tutor immediately
3. **Questions**: I'm available by email for any technical questions during integration

Please find the product overview and technical specification attached.

Best regards,

Luke
Evelyn Learning
info@evelynlearning.com
