// Links from www to the developer portal (2026-11-24). The portal is a
// separate host served by apps/tutor; before this file www had no link to it.
// One place for the URLs and the public API facts so pages, the footer, the
// chat prompt and /llms.txt cannot drift apart.
// Copy rules: no provider or model names, no client names, no numbers that
// are not listed here.

export const PORTAL_URL = "https://tutor.evelynlearning.com";

export const PORTAL_LINKS = {
  home: PORTAL_URL,
  docs: `${PORTAL_URL}/docs`,
  packages: `${PORTAL_URL}/docs/package`,
  integrationGuide: `${PORTAL_URL}/docs/integration.md`,
  llmsTxt: `${PORTAL_URL}/llms.txt`,
  pricing: `${PORTAL_URL}/pricing`,
  demo: `${PORTAL_URL}/demo`,
  sandbox: `${PORTAL_URL}/sandbox`,
  signIn: `${PORTAL_URL}/dashboard/login`,
} as const;

export const NPM_PACKAGE = "@evelynlearning/tutor";
export const PYPI_PACKAGE = "evelyn-tutor";
export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@evelynlearning/tutor";
export const PYPI_PACKAGE_URL = "https://pypi.org/project/evelyn-tutor/";

/** Languages a whole lesson can be taught in. Not the wider language-reach claim. */
export const TAUGHT_LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Spanish",
  "French",
  "Japanese",
  "Traditional Chinese",
  "Simplified Chinese",
] as const;

/** "English, Hindi, ... or Simplified Chinese" */
export const TAUGHT_LANGUAGES_SENTENCE = `${TAUGHT_LANGUAGES.slice(0, -1).join(", ")} or ${TAUGHT_LANGUAGES[TAUGHT_LANGUAGES.length - 1]}`;

export const API_PRICING = {
  voicePerMinute: "0.20",
  typedPerMinute: "0.16",
  sandboxMinutes: 300,
  packs: [
    { minutes: "500", price: "$100" },
    { minutes: "2,500", price: "$450" },
    { minutes: "10,000", price: "$1,600" },
  ],
} as const;

/** Footer "Developers" group. Passed to the shared Footer by AppShell only. */
export const FOOTER_DEVELOPER_LINKS = [
  { name: "API docs", href: PORTAL_LINKS.docs },
  { name: "API pricing", href: PORTAL_LINKS.pricing },
  { name: "Free sandbox", href: PORTAL_LINKS.sandbox },
  { name: "Developer packages", href: PORTAL_LINKS.packages },
  { name: "Partner sign-in", href: PORTAL_LINKS.signIn },
];
