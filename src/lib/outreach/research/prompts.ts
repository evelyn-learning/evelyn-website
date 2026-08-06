// Model id, tool defs, JSON schemas, and prompt builders for lead research.
// Schemas use all-required + additionalProperties:false (structured-outputs
// constraint); empty string means "absent" — the pipeline interprets.

export const RESEARCH_MODEL = "claude-opus-5";

export const RESEARCH_TOOLS = [
  { type: "web_search_20260209", name: "web_search", max_uses: 8 },
  { type: "web_fetch_20260209", name: "web_fetch", max_uses: 8 },
];

export const DISCOVERY_SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          website: { type: "string" },
        },
        required: ["company", "website"],
        additionalProperties: false,
      },
    },
  },
  required: ["candidates"],
  additionalProperties: false,
} as const;

export interface ResearchedLead {
  company: string;
  website: string;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  source: string;
  decisionMakerName: string;
  decisionMakerTitle: string;
  linkedinUrl: string;
  email: string;
  emailSourceUrl: string;
  nameSourceUrl: string;
  sourceUrls: string[];
  draftSubject: string;
  draftBody: string;
}

export const LEAD_SCHEMA = {
  type: "object",
  properties: {
    company: { type: "string" },
    website: { type: "string" },
    about: { type: "string" },
    whyFit: { type: "string" },
    useCaseHypothesis: { type: "string" },
    source: { type: "string" },
    decisionMakerName: { type: "string" },
    decisionMakerTitle: { type: "string" },
    linkedinUrl: { type: "string" },
    email: { type: "string" },
    emailSourceUrl: { type: "string" },
    nameSourceUrl: { type: "string" },
    sourceUrls: { type: "array", items: { type: "string" } },
    draftSubject: { type: "string" },
    draftBody: { type: "string" },
  },
  required: [
    "company", "website", "about", "whyFit", "useCaseHypothesis", "source",
    "decisionMakerName", "decisionMakerTitle", "linkedinUrl", "email",
    "emailSourceUrl", "nameSourceUrl", "sourceUrls", "draftSubject", "draftBody",
  ],
  additionalProperties: false,
} as const;

const SEGMENT_CONTEXT: Record<string, string> = {
  nursing_program: "nursing schools and NCLEX-prep programs",
  testprep_academy: "test-prep academies (SAT/ACT/AP)",
  homeschool_charter: "homeschool charter programs",
  microschool: "microschools",
  school_district: "school districts",
  private_school: "private K-12 schools",
  intl_school: "international schools",
  library: "public library systems",
  publisher: "education publishers",
  agency: "education agencies/consultancies",
  corporate_ld: "corporate learning & development teams",
  other: "education organizations",
};

export function discoveryParams(input: {
  segment: string; niche: string; region: string; wanted: number; excludeCompanies: string[];
}): Record<string, unknown> {
  const kind = SEGMENT_CONTEXT[input.segment] ?? "education organizations";
  const exclude = input.excludeCompanies.length
    ? `\n\nDo NOT include any of these (already in our pipeline):\n${input.excludeCompanies.map((c) => `- ${c}`).join("\n")}`
    : "";
  return {
    model: RESEARCH_MODEL,
    max_tokens: 16000,
    tools: RESEARCH_TOOLS,
    output_config: { format: { type: "json_schema", schema: DISCOVERY_SCHEMA } },
    messages: [{
      role: "user",
      content:
`Find up to ${input.wanted} real, currently-operating ${kind}${input.niche ? ` — specifically: ${input.niche}` : ""}${input.region ? ` in ${input.region}` : ""} that could plausibly buy an AI voice-tutoring platform (Evelyn Learning) for their students or staff.

Use web search to find real institutions. For each, give the official organization name and its official website homepage URL. Prefer mid-sized organizations where a single decision-maker is reachable. Only include organizations you actually found via search — never invent names or URLs.${exclude}`,
    }],
  };
}

export function candidateParams(input: {
  segment: string; niche: string; company: string; website: string;
}): Record<string, unknown> {
  const kind = SEGMENT_CONTEXT[input.segment] ?? "education organization";
  return {
    model: RESEARCH_MODEL,
    max_tokens: 16000,
    tools: RESEARCH_TOOLS,
    output_config: { format: { type: "json_schema", schema: LEAD_SCHEMA } },
    messages: [{
      role: "user",
      content:
`Research this ${kind} as a sales lead for Evelyn Learning (AI voice-tutoring platform: live voice sessions with an AI tutor over an interactive whiteboard; students practice, get diagnostic feedback, and drill weak areas — strong fit for exam prep and skills training).

Organization: ${input.company}
Website: ${input.website}
${input.niche ? `Focus area: ${input.niche}\n` : ""}
Using web search and web fetch, research the organization's OWN website (programs, about, staff/leadership pages). Produce:

- about: 1-2 sentences on what they do, grounded in their site.
- whyFit: why Evelyn specifically helps THEM — cite something real and specific you found (a program, a stated challenge, a scale number).
- useCaseHypothesis: the concrete first use case they'd deploy.
- source: the single most informative page URL you used.
- decisionMakerName/decisionMakerTitle: a REAL person you found named on their site or an official directory who owns this decision (dean, director, head of L&D). If you cannot find a real named person, return empty strings.
- nameSourceUrl: the URL where that person is named (empty if none).
- email: the person's email ONLY if it is published on an official page you actually fetched. NEVER guess or construct an email — do not infer patterns like first.last@domain. If not published, return "".
- emailSourceUrl: the exact page URL where the email appears (empty if email is empty).
- linkedinUrl: the person's LinkedIn URL ONLY if you actually visited it; else "".
- sourceUrls: every URL you actually used.
- draftSubject/draftBody: a short (120-180 word) personalized intro email from Praveen at Evelyn Learning to that person (or "Hi there" if no person found). Reference the specific real thing from whyFit. Include this exact line on its own line where the demo link belongs: [DEMO_LINK]. End: "Best,\\nPraveen\\nEvelyn Learning". No pricing claims, no fake statistics.

Accuracy over completeness: an empty field is correct; an invented one is a serious failure.`,
    }],
  };
}
