// The manual lead-research prompt, surfaced via a copy button in the console's
// Import JSON section (FindLeadsTab). Paste it into any Claude chat (web or
// Code), fill the three <BLANKS>, and the output is a JSON array the import
// box accepts. Mirrors the automated pipeline's quality bar — the server-side
// email-verification gate does NOT run on manual imports, so emailVerified is
// the researcher's assertion; the prompt demands source URLs for spot-checks.
// Doc twin: docs/superpowers/lead-research-prompt.md (update both if the Lead
// schema or the quality rules change).
// This module is client-safe: no mongoose, no @/models imports.

export const MANUAL_RESEARCH_PROMPT = `Research B2B sales leads for Evelyn Learning (AI voice-tutoring platform: live
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
  with: Best,\\nPraveen\\nEvelyn Learning. No pricing claims, no invented
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
      "body": "Hi Dana,\\n\\n...\\n\\n[DEMO_LINK]\\n\\nBest,\\nPraveen\\nEvelyn Learning"
    },
    "notes": "Email published at https://acme.edu/staff. Sources: ..."
  }
]

Valid segment values (use exactly one per lead): nursing_program,
testprep_academy, homeschool_charter, microschool, school_district,
private_school, intl_school, library, publisher, agency, corporate_ld, other.

Omit the email key entirely (and set emailVerified false) rather than
including an unverified one.`;
