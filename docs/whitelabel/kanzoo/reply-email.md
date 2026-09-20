# Reply to Muneebur Rahman — sandbox credentials + pricing (FINAL, not yet sent as of 2026-09-16)

**To:** muneeb@kanzoo.org
**Cc:** developer@kanzooglobal.com
**Subject:** Re: Integration Inquiry — AI Voice Tutor for DUC Academy — sandbox access + docs
**Attach:** `integration-guide.md` (v1.1), partner secret (from `~/.evelyn/partners/kanzoo.secret`), sample link (from `~/.evelyn/partners/kanzoo.sample-embed-url.txt` — re-mint with a persona first, see notes). `examples` is linked to the Google Drive folder.

---

Hi Muneeb,

Thank you as well. I enjoyed the conversation. DUC Academy's dual-teacher model is a very good fit for what the tutor does best: giving every student a patient, always-available second teacher after the live class.

Sandbox access is provisioned.

- Partner id: `kanzoo`
- Partner secret: attached
- Embed host: `https://tutor.evelynlearning.com/embed`
- API host: `https://www.evelynlearning.com`
- Pre-signed test link for a Grade 6 ratios lesson, valid for 7 days, so you can run a session before writing any code: attached

Documentation. Attached is the integration guide with the contract your team will build against: iframe embed, the signed session token and every claim it accepts (including the teacher persona that sets the tutor's name, style and voice), the browser events (`session_started`, `progress`, `session_ended`), HMAC request signing, and the partner API for pulling session facts, learning gaps, mastery, assigned practice, and for generating lesson plans from your own assignments. The same material is on the developer site at https://tutor.evelynlearning.com/docs, so either is safe to build from. The `examples` folder has zero-dependency token signing in Node and Python, an API client, a host page, and the persona catalog (`teachers.json`).

The sandbox is the production engine on the production hosts, so nothing changes when you go live except your own configuration. It includes 300 free tutoring minutes, and if your team needs more during integration, just tell me.

On pricing. I understand the ask, and I want to be straightforward with you. $0.10 per tutoring minute is already our introductory partner rate, not a list price. It is set close to our own cost for the voice and the model that does the teaching, which is why there is no setup fee, no monthly platform fee and no minimum commitment. The integration, the whiteboard, the lesson generation from your material, the practice and grading APIs, and the learner-model data all come with the minute. There is no room underneath $0.10 without changing what is included.

What I can do:

- 300 free sandbox minutes now, and I'll extend them if integration needs it.
- Only active tutoring minutes are billed. Idle time in an open tab is not counted; the `durationSec` you read from `sessions/summary` is the number on the invoice.
- Text-only sessions cost the same per minute but run far shorter, so a practice or homework-check flow can be priced very differently from a full voice lesson if you want a cheaper tier for DUC.
- Volume pricing from 50,000 minutes a month, which we can define together once you have real usage from the first term.

At 30 students this is a small monthly number for DUC, and it grows only with actual use, so it scales with their revenue rather than ahead of it.

Next steps

1. Your developer signs a token with the examples and opens the embed. That is a 15-minute exercise.
2. Wire `session_ended` → pull `sessions/summary`, `gaps`, `mastery` into your parent and teacher dashboards.
3. Send one real DUC assignment through `plan-generate` and run it as a homework-help session.
4. Let's talk again on Thursday or Friday once your team has had a look. My WhatsApp is +1.415.513.0895. I'm on Pacific time.

Looking forward to building this with you.

Best regards,
Praveen Tyagi

---

## Notes for Praveen (not part of the email)

- **Re-mint the sample link before attaching.** The last `--sample` run used `TEACHER_ID=none` (the voice test) and overwrote the local file. Run `TEACHER_ID=ms-priya-nair ./scripts/tutor/kanzoo-provision.sh --sample` from the repo root so Muneeb's first session has the persona.
- Attach the CURRENT `integration-guide.md` (v1.1, commit `72fc0218`): assigned-practice is POST, no cost field, docs-site note updated.
- Changes from the earlier draft: dropped the "older pages are being replaced" warning (the site now matches); added the persona mention and `teachers.json`; restored the "only active minutes are billed" bullet (true since contract v1.16.0, costs nothing).
- Volume math for Thursday: Muneeb's "3–4 h/day/student" ≈ $19k/month, unrealistic. Anchor on 20–40 min/day ≈ $2k/month for 30 students.
