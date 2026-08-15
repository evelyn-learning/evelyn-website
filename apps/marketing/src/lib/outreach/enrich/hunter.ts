import { EnrichInput, EnrichProvider, EnrichResult, QuotaExhaustedError } from "./types";

async function match(input: EnrichInput, fetchFn: typeof fetch = fetch): Promise<EnrichResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) return null;

  const url =
    `https://api.hunter.io/v2/email-finder?domain=${input.websiteDomain}` +
    `&full_name=${encodeURIComponent(input.name)}&api_key=${apiKey}`;

  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(10_000) });

    if (res.status === 402 || res.status === 429) throw new QuotaExhaustedError("hunter");
    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data;
    if (!data) return null;
    if (!data.email || !(data.score >= 80)) return null;

    return { email: data.email, provider: "hunter", creditsUsed: 1 };
  } catch (err) {
    if (err instanceof QuotaExhaustedError) throw err;
    return null;
  }
}

export const hunterProvider: EnrichProvider = {
  name: "hunter",
  isConfigured: () => !!process.env.HUNTER_API_KEY,
  match,
};
