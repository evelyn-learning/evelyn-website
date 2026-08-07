import { EnrichInput, EnrichProvider, EnrichResult, QuotaExhaustedError } from "./types";

// Prospeo's email-finder returns either a nested shape
// (`response.email.email` + `response.email.email_status`) or a flat one
// (`response.email` as a string + a sibling `response.email_status`).
// Accept both.
function extractEmail(response: Record<string, unknown>): { email?: string; status?: string } {
  const emailField = response.email;
  if (emailField && typeof emailField === "object") {
    const nested = emailField as Record<string, unknown>;
    return {
      email: typeof nested.email === "string" ? nested.email : undefined,
      status: typeof nested.email_status === "string" ? nested.email_status : undefined,
    };
  }
  if (typeof emailField === "string") {
    return {
      email: emailField,
      status: typeof response.email_status === "string" ? (response.email_status as string) : undefined,
    };
  }
  return {};
}

async function match(input: EnrichInput, fetchFn: typeof fetch = fetch): Promise<EnrichResult | null> {
  const apiKey = process.env.PROSPEO_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetchFn("https://api.prospeo.io/email-finder", {
      method: "POST",
      headers: { "content-type": "application/json", "X-KEY": apiKey },
      body: JSON.stringify({ full_name: input.name, company: input.websiteDomain }),
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 402 || res.status === 429) throw new QuotaExhaustedError("prospeo");
    if (!res.ok) return null;

    const json = await res.json();
    const response = json?.response;
    if (!response) return null;

    const result: EnrichResult = { provider: "prospeo", creditsUsed: 1 };

    const { email, status } = extractEmail(response);
    if (email && status === "VALID") {
      result.email = email;
    }
    if (response.linkedin) {
      result.linkedinUrl = response.linkedin;
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
