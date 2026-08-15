// Shared contract for lead-enrichment vendor adapters (Apollo, Hunter,
// Prospeo). Each adapter implements EnrichProvider against its own vendor
// API but exposes the same match() shape so Task 4's chain can iterate
// providers uniformly and fall through on a null result.

export interface EnrichInput {
  name: string;
  title?: string;
  company: string;
  websiteDomain: string;
}

export interface EnrichResult {
  email?: string;
  linkedinUrl?: string;
  provider: string;
  creditsUsed: number;
}

export interface EnrichProvider {
  name: string;
  isConfigured(): boolean;
  match(input: EnrichInput, fetchFn?: typeof fetch): Promise<EnrichResult | null>;
}

// Thrown by an adapter when the vendor reports the account is out of
// credits/rate-limited (HTTP 402/429), so the chain can skip straight to
// the next provider instead of retrying a dead one. Message intentionally
// carries only the provider name, never the API key.
export class QuotaExhaustedError extends Error {
  constructor(public provider: string) {
    super(`QUOTA_EXHAUSTED:${provider}`);
    this.name = "QuotaExhaustedError";
  }
}
