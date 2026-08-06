# Manual lead research — prompt template for the JSON import box

Use this when you want to research leads yourself in any Claude chat (claude.ai,
desktop, anywhere) instead of the automated "Find leads" button. The output is a
JSON array you paste into **Admin → Outreach → Find leads → Import JSON**
(always click **Dry run** first).

**Quality bar — the same one the automated pipeline enforces:** never let the
model guess or construct an email. The automated path verifies every email by
fetching the cited page server-side; the manual path has no such gate, so
`emailVerified: true` is YOUR assertion. Set it true only when the chat shows
you the page URL and you (or the chat, with browsing) actually saw the address
published there. An empty email is correct; a plausible guess emails a real
stranger.

---

## The prompt (copy from here, fill the three blanks)

```
Research B2B sales leads for Evelyn Learning (AI voice-tutoring platform: live
voice sessions with an AI tutor over an interactive whiteboard; students
practice, get diagnostic feedback, and drill weak areas — strong fit for exam
prep and skills training).

Find <COUNT> real, currently-operating <SEGMENT DESCRIPTION, e.g. "nursing
schools with NCLEX-prep programs"> in <REGION>. Use web search, and research
each organization's OWN website (programs, about, staff/leadership pages).
Prefer mid-sized organizations where a single decision-maker is reachable.
Do not include: <LIST COMPANIES ALREADY IN THE PIPELINE, or "none">.

Rules that are non-negotiable:
- Only real institutions you actually found via search. Never invent names,
  URLs, or people.
- decisionMaker must be a REAL person named on their site or an official
  directory (dean, director, head of L&D). If none found, use empty strings.
- email ONLY if it is published on an official page you actually opened —
  never infer patterns like first.last@domain. If not published, use "" and
  set emailVerified false. When you do include an email, tell me the exact
  page URL where it appears and put that URL in the notes field.
- linkedinUrl only if you actually visited the profile.
- The draft email cites something real and specific from their site (a
  program, a stated challenge, a scale number). 120-180 words. Include the
  literal line [DEMO_LINK] on its own line where the demo link belongs. End
  with: Best,\nPraveen\nEvelyn Learning. No pricing claims, no invented
  statistics.

Output ONLY a JSON array (no prose, no markdown fence), one object per lead,
exactly this shape:

[
  {
    "company": "Acme Nursing College",
    "segment": "nursing_program",
    "about": "1-2 sentences on what they do, grounded in their site.",
    "whyFit": "Why Evelyn helps THEM specifically, citing something real.",
    "useCaseHypothesis": "The concrete first use case they'd deploy.",
    "website": "https://acme.edu",
    "source": "https://acme.edu/programs (the most informative page you used)",
    "decisionMaker": {
      "name": "Dana Smith",
      "title": "Dean of Nursing",
      "linkedinUrl": "",
      "email": "dsmith@acme.edu",
      "emailVerified": true
    },
    "currentDraft": {
      "channel": "email",
      "subject": "NCLEX prep at Acme",
      "body": "Hi Dana,\n\n...\n\n[DEMO_LINK]\n\nBest,\nPraveen\nEvelyn Learning"
    },
    "notes": "Email published at https://acme.edu/staff. Sources: ..."
  }
]

Valid segment values (use exactly one per lead): nursing_program,
testprep_academy, homeschool_charter, microschool, school_district,
private_school, intl_school, library, publisher, agency, corporate_ld, other.

Omit the email key entirely (and set emailVerified false) rather than
including an unverified one.
```

---

## Importing

1. Find leads tab → Import JSON box → paste the array → **Dry run**. Fix any
   rows it reports invalid (the counts show which row and which fields).
2. Click **Import**. Dupes (same company + email) are skipped automatically;
   leads land as `staged` in the Review Queue with their drafts, exactly like
   automated ones.
3. Spot-check any `emailVerified: true` rows: open the URL in `notes` and
   confirm the address is really there before approving the send.

The CLI path still works too if you ever want it:
`npx tsx scripts/import-leads.ts <file.json>` (dry-run) then `--apply`.
