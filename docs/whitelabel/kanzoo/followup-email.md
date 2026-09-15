# Follow-up to Muneeb — corrected guide

**To:** muneeb@kanzoo.org
**Cc:** developer@kanzooglobal.com
**Subject:** Re: Integration Inquiry — AI Voice Tutor for DUC Academy — updated integration guide (v1.1)
**Attach:** `integration-guide.md` (the version committed at `03f6a5cc` or later)

---

Hi Muneeb,

A short follow-up with an updated integration guide (v1.1), attached. Two corrections and two improvements since the copy I sent yesterday:

**Corrections**

1. `assigned-practice` is a POST with a JSON body (`{ "studentId": "...", "courseId": "..." }`), not a GET with query parameters. Section 8.1 is fixed.
2. The `sessions/summary` response no longer includes an `estimatedCostUsd` field for partners. `durationSec` remains the billing figure. If your developer has already mapped the response, that field can simply be dropped.

**Improvements**

3. The developer site at https://tutor.evelynlearning.com/docs now matches the guide exactly (token claims, events, request signing, and the full endpoint list), so either source is safe to build from. The older pages I warned you about are gone.
4. A token that omits the `teacher` persona now gets our default natural voice instead of a generic synthetic one. I still recommend sending a persona per course so students always hear the same teacher, but a missing persona is no longer a bad experience.

Nothing else changes. Your credentials, the sample link and the examples folder on Drive are all still valid.

Speak Thursday or Friday, whichever suits your team.

Best regards,
Praveen Tyagi
Co-founder, Evelyn Learning
+1 415 513 0895 (WhatsApp) · Pacific time
