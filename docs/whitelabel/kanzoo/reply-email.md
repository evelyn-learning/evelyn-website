# Reply to Muneebur Rahman — sandbox credentials + pricing

**To:** muneeb@kanzoo.org
**Cc:** developer@kanzooglobal.com
**Subject:** Re: Integration Inquiry — AI Voice Tutor for DUC Academy — sandbox access + docs
**Attach:** `integration-guide.md` (or PDF export), `examples/` folder (sign-embed-token.js, sign-embed-token.py, portal-api-client.js, embed.html, teachers.json)

---

Hi Muneeb,

Thank you as well. I enjoyed the conversation, and DUC Academy's dual-teacher model is a very good fit for what the tutor does best: giving every student a patient, always-available second teacher after the live class.

**Sandbox access is provisioned.**

- Partner id: `kanzoo`
- Partner secret: `[PASTE from ~/.evelyn/partners/kanzoo.secret]` — please keep it server-side only and share it with your developer directly; never put it in client code.
- Embed host: `https://tutor.evelynlearning.com/embed`
- API host: `https://www.evelynlearning.com`
- A pre-signed test link for a Grade 6 ratios lesson, valid for 7 days, so you can run a session before writing any code: `[PASTE from ~/.evelyn/partners/kanzoo.sample-embed-url.txt]`

**Documentation.** Attached is the integration guide with the real contract your team will build against: iframe embed, the signed session token and every claim it accepts, the browser events (`session_started`, `progress`, `session_ended`), HMAC request signing, and the partner API for pulling session facts, learning gaps, mastery, assigned practice, and for generating lesson plans from your own assignments. The `examples` folder has zero-dependency token signing in Node and Python, an API client, and a host page. Please treat this guide as the source of truth; a few older pages on the developer site are being replaced and describe endpoints that are not part of the contract.

The sandbox is the production engine on the production hosts, so nothing changes when you go live except your own configuration. It includes **300 free tutoring minutes**, and if your team needs more during integration, just tell me.

**On pricing.** I understand the ask, and I want to be straightforward with you. $0.10 per tutoring minute is already our introductory partner rate, not a list price. It is set close to our own cost for the voice and the model that does the teaching, which is why there is no setup fee, no monthly platform fee and no minimum commitment. The integration, the whiteboard, the lesson generation from your material, the practice and grading APIs, and the learner-model data all come with the minute. There is not room underneath $0.10 without changing what is included.

What I can do:

- **300 free sandbox minutes** now, and I'll extend them if integration needs it.
- **Only active tutoring minutes are billed.** Idle time in an open tab is not counted; the number you see in `sessions/summary` is what appears on the invoice.
- **Text-only sessions cost the same per minute but run far shorter**, so a practice or homework-check flow can be priced very differently from a full voice lesson if you want a cheaper tier for DUC.
- **Volume pricing from 50,000 minutes a month**, which we can define together once you have real usage from the first term.

At 30 students this is a small monthly number for DUC, and it grows only with actual use, so it scales with their revenue rather than ahead of it.

**Next steps**

1. Your developer signs a token with the examples and opens the embed. That is a 15-minute exercise.
2. Wire `session_ended` → pull `sessions/summary`, `gaps`, `mastery` into your parent and teacher dashboards.
3. Send one real DUC assignment through `plan-generate` and run it as a homework-help session.
4. The token carries the tutor's persona and voice (`teachers.json`, guide §5.1). Pick one per course so students always hear the same teacher.
5. Let's talk again on Thursday or Friday once your team has had a look. My WhatsApp is +1 [OFFICE NUMBER]; I'm on Pacific time.

Looking forward to building this with you.

Best regards,
Praveen Tyagi
Co-founder, Evelyn Learning
info@evelynlearning.com

---

## Notes for Praveen (not part of the email)

- **Do the math before the call on Thursday.** Muneeb said 30 students × 3–4 h/day. That is ~190,000 min/month ≈ $19,000/month, which no 30-student academy will pay. His real usage will be far lower (Crimsora's real active hours ran ~4.6 h across ALL sessions when we measured). Anchor him on 20–40 min/student/day: 30 students × 30 min × 22 school days ≈ 20,000 min ≈ $2,000/month, ~$66/student. That is the number to say out loud if he pushes.
- The "only active minutes are billed" line is true (contract v1.16.0 `durationSec` = capped transcript gaps), and it is the concession that costs us nothing.
- The "text-only sessions" line is true (same token, `input_mode: "text"`), and the brain cost is the bulk of it, so it is not a loss-leader.
- Volume tier from 50k min/month was already in the first reply; no number attached. Do not attach one yet.
- Fill in `[OFFICE NUMBER]` before sending.
- ⚠️ `GET /sessions/summary` returns `estimatedCostUsd` per session — that is OUR model+voice cost estimate, visible to any partner. At $0.10/min a partner can compute our margin from it. The guide tells them to ignore it; consider dropping the field from the partner response in the next contract bump (crimsora/evelyntutor are our own tenants and can keep reading it via a flag).
