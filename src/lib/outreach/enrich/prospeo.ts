import { EnrichInput, EnrichProvider, EnrichResult, QuotaExhaustedError } from "./types";

// Prospeo's enrich-person response nesting isn't fully documented — probe
// the plausible locations (`person`, `response`, top-level) for both the
// email object and the linkedin url, same defensive pattern either way.
function extractEmail(json: Record<string, unknown>): { email?: string; status?: string; revealed?: boolean } {
  const person = json.person as Record<string, unknown> | undefined;
  const response = json.response as Record<string, unknown> | undefined;
  const emailField = person?.email ?? response?.email ?? json.email;
  if (!emailField || typeof emailField !== "object") return {};
  const nested = emailField as Record<string, unknown>;
  return {
    email: typeof nested.email === "string" ? nested.email : undefined,
    status: typeof nested.status === "string" ? nested.status : undefined,
    revealed: nested.revealed as boolean | undefined,
  };
}

function extractLinkedin(json: Record<string, unknown>): string | undefined {
  const person = json.person as Record<string, unknown> | undefined;
  const response = json.response as Record<string, unknown> | undefined;
  const linkedin = person?.linkedin_url ?? response?.linkedin_url ?? json.linkedin_url;
  return typeof linkedin === "string" && linkedin.length > 0 ? linkedin : undefined;
}

async function match(input: EnrichInput, fetchFn: typeof fetch = fetch): Promise<EnrichResult | null> {
  const apiKey = process.env.PROSPEO_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetchFn("https://api.prospeo.io/enrich-person", {
      method: "POST",
      headers: { "content-type": "application/json", "X-KEY": apiKey },
      body: JSON.stringify({
        data: {
          full_name: input.name,
          company_website: input.websiteDomain,
          only_verified_email: true,
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 429 || res.status === 402) throw new QuotaExhaustedError("prospeo");

    if (res.status === 400) {
      // Prospeo signals credit depletion as a 400 with a body, not a 402 —
      // has to be read before we can tell it apart from a plain miss
      // (e.g. NO_MATCH).
      const body = await res.json().catch(() => null);
      if (body?.error_code === "INSUFFICIENT_CREDITS") throw new QuotaExhaustedError("prospeo");
      return null;
    }

    if (!res.ok) return null;

    const json = await res.json();

    const result: EnrichResult = { provider: "prospeo", creditsUsed: 1 };

    const { email, status, revealed } = extractEmail(json);
    if (email && revealed !== false && (status === "VERIFIED" || status === "VALID")) {
      result.email = email;
    }

    const linkedinUrl = extractLinkedin(json);
    if (linkedinUrl) {
      result.linkedinUrl = linkedinUrl;
    }

    if (!result.email && !result.linkedinUrl) return null;
    return result;
  } catch (err) {
    if (err instanceof QuotaExhaustedError) throw err;
    return null;
  }
}

export const prospeoProvider: EnrichProvider = {
  name: "prospeo",
  isConfigured: () => !!process.env.PROSPEO_API_KEY,
  match,
};
