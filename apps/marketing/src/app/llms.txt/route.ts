// /llms.txt for www (2026-11-24): a plain-text map of the site for AI
// assistants. Before this www had none, and nothing on www told an assistant
// that the Voice Tutor API, its sandbox or the developer portal exist.
// Built from the same data as the sitemap (products, services) so it cannot
// drift, plus the API facts in src/lib/portal-links.ts. The company lines
// repeat the site's own metadata; nothing here is a new claim.
// src/proxy.ts passes this path through on www, and robots.ts does not block it.

import { productCategories } from "@/data/products";
import { services } from "@/data/services";
import {
  API_PRICING,
  NPM_PACKAGE,
  NPM_PACKAGE_URL,
  PORTAL_LINKS,
  PYPI_PACKAGE,
  PYPI_PACKAGE_URL,
  TAUGHT_LANGUAGES_SENTENCE,
} from "@/lib/portal-links";

// Same content for every request, so it is built once.
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com";

function buildLlmsTxt(): string {
  const packs = API_PRICING.packs
    .map((p) => `${p.minutes} minutes for ${p.price}`)
    .join(", ");

  const products = productCategories.flatMap((category) => [
    "",
    `### ${category.name}`,
    ...category.products.map(
      (p) => `- [${p.title}](${SITE_URL}/products/${p.id}): ${p.tagline}`
    ),
  ]);

  const serviceLines = services.map(
    (s) => `- [${s.title}](${SITE_URL}/services/${s.id}): ${s.description}`
  );

  return [
    "# Evelyn Learning",
    "",
    "> Evelyn Learning provides AI-powered learning solutions for K-12, higher education and workforce development, including an AI voice tutor, AI essay feedback, virtual lab simulations, career exploration software and 24/7 student support AI. Its AI Voice Tutor is also available to developers as an API: a hosted tutor with voice, a live whiteboard and typed chat that a product embeds with one signed link.",
    "",
    "Ranked #9 in America and #35 in the world among TIME's Top EdTech Companies of 2026. The company is ELS Corp dba Evelyn Learning, based in San Francisco, CA.",
    "",
    "## Voice Tutor API for developers",
    "",
    "The developer portal is a separate site: " + PORTAL_LINKS.home,
    "",
    "- What it is: a hosted AI tutor with voice, a live whiteboard and typed chat. Your server signs one link and your app opens it in an iframe or a mobile WebView. It is white-label: students see your brand.",
    `- Price: $${API_PRICING.voicePerMinute} per voice minute and $${API_PRICING.typedPerMinute} per typed minute. Prepaid packs: ${packs}.`,
    `- Free sandbox: ${API_PRICING.sandboxMinutes} tutoring minutes. Keys are issued as soon as you sign up, and no card is needed.`,
    `- Lesson languages: a lesson can be taught entirely in ${TAUGHT_LANGUAGES_SENTENCE}.`,
    "- Worksheets: send a photo of a worksheet and the tutor takes the student through it question by question.",
    "- Partner dashboard: usage, keys, sessions and replays, billing and webhooks.",
    `- Developer packages: ${NPM_PACKAGE} (npm) and ${PYPI_PACKAGE} (PyPI), including an MCP server for coding assistants.`,
    "",
    "Links:",
    "",
    `- [Portal llms.txt](${PORTAL_LINKS.llmsTxt}): the map of the developer portal, for assistants`,
    `- [API docs](${PORTAL_LINKS.docs}): quickstart, authentication, embedding, webhooks and the API reference`,
    `- [One-file integration guide](${PORTAL_LINKS.integrationGuide}): the whole integration in one Markdown file`,
    `- [Free sandbox sign-up](${PORTAL_LINKS.sandbox})`,
    `- [API pricing](${PORTAL_LINKS.pricing})`,
    `- [Live demo](${PORTAL_LINKS.demo})`,
    `- [Partner sign-in](${PORTAL_LINKS.signIn})`,
    `- [${NPM_PACKAGE} on npm](${NPM_PACKAGE_URL})`,
    `- [${PYPI_PACKAGE} on PyPI](${PYPI_PACKAGE_URL})`,
    `- [AI Voice Tutor product page](${SITE_URL}/products/voice-tutor): what the tutor does for students, with a live demo`,
    "",
    "## Products",
    "",
    `All products: ${SITE_URL}/products`,
    ...products,
    "",
    "## Services",
    "",
    ...serviceLines,
    "",
    "## Who we serve",
    "",
    `- [Test Prep & Tutoring](${SITE_URL}/industries/test-prep)`,
    `- [K-12 Schools](${SITE_URL}/industries/k12)`,
    `- [Higher Education](${SITE_URL}/industries/higher-ed)`,
    `- [Publishers](${SITE_URL}/industries/publishers)`,
    `- [Enterprise](${SITE_URL}/industries/enterprise)`,
    "",
    "## Company and resources",
    "",
    `- [About](${SITE_URL}/about)`,
    `- [Integrations](${SITE_URL}/integrations): LMS integrations and developer resources`,
    `- [Security](${SITE_URL}/security)`,
    `- [Responsible Data Policy](${SITE_URL}/responsible-data)`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [Case Studies](${SITE_URL}/case-studies)`,
    `- [Contact](${SITE_URL}/contact)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
