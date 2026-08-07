import { EnrichInput, EnrichProvider, EnrichResult, QuotaExhaustedError } from "./types";

const EMAIL_NOT_UNLOCKED = /email_not_unlocked/;

async function match(input: EnrichInput, fetchFn: typeof fetch = fetch): Promise<EnrichResult | null> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetchFn("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({
        name: input.name,
        organization_name: input.company,
        domain: input.websiteDomain,
        reveal_personal_emails: false,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 402 || res.status === 429) throw new QuotaExhaustedError("apollo");
    if (!res.ok) return null;

    const json = await res.json();
    const person = json?.person;
    if (!person) return null;

    const result: EnrichResult = { provider: "apollo", creditsUsed: 1 };

    if (person.email && !EMAIL_NOT_UNLOCKED.test(person.email) && person.email_status === "verified") {
      result.email = person.email;
    }
    if (person.linkedin_url) {
      result.linkedinUrl = person.linkedin_url;
    }

    if (!result.email && !result.linkedinUrl) return null;
    return result;
  } catch (err) {
    if (err instanceof QuotaExhaustedError) throw err;
    return null;
  }
}

export const apolloProvider: EnrichProvider = {
  name: "apollo",
  isConfigured: () => !!process.env.APOLLO_API_KEY,
  match,
};
