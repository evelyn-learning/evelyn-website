// What every vendor adapter returns to callModel, and how it reports HTTP trouble.

export type VendorReply = {
  /** The reply's text (thinking/reasoning excluded). */
  text: string;
  /** Set when the vendor's documented refusal signal fired; the value is a short reason. */
  refusal?: string;
  /** True when the reply stopped at the output token limit. */
  truncated?: boolean;
  tokensIn: number;
  /** Of tokensIn: tokens written to / read from the prompt cache (Claude; priced 1.25× / 0.1× the input rate). */
  cacheWriteTokens?: number;
  cacheReadTokens?: number;
  /** Output tokens as billed, reasoning/thinking included. */
  tokensOut: number;
  /** The model that actually served the reply, when the vendor says. */
  model?: string;
  /** True when a vendor-side fallback model served the reply. */
  fellBack?: boolean;
};

/**
 * Network or HTTP failure. Retryable (callModel retries it): a network error (no status), or HTTP 429, 500, 502,
 * 503, 504, 529. Never 400 / 401 / 403 / 404 (or any other status). `retryAfter`: the reply's Retry-After header, as sent.
 */
export class TransportError extends Error {
  constructor(message: string, readonly retryable: boolean, readonly status?: number, readonly retryAfter?: string | null) {
    super(message);
  }
}

/** HTTP statuses worth another attempt: rate limit and the transient server errors (529 = Anthropic overloaded). */
export const RETRY_STATUSES: ReadonlySet<number> = new Set([429, 500, 502, 503, 504, 529]);

export function retryableStatus(status: number | undefined): boolean {
  return status === undefined || RETRY_STATUSES.has(status);
}

/** A 200 whose content cannot be read although its usage block can: the call is still billed, at these tokens. */
export class UnreadableReply extends Error {
  constructor(message: string, readonly tokensIn: number, readonly tokensOut: number) {
    super(message);
  }
}

/** The Retry-After header of an SDK error's headers (a Headers object or a plain record), or null. */
export function retryAfterOf(headers: unknown): string | null {
  if (!headers) return null;
  try {
    if (typeof (headers as Headers).get === "function") return (headers as Headers).get("retry-after");
    const rec = headers as Record<string, unknown>;
    for (const k of Object.keys(rec)) if (k.toLowerCase() === "retry-after" && typeof rec[k] === "string") return rec[k] as string;
  } catch {
    // unreadable headers: no hint
  }
  return null;
}

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"] as const;
export type ImageType = (typeof IMAGE_TYPES)[number];

export function toBase64(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

/** Long reasoning calls: give each request up to 15 minutes. */
export const REQUEST_TIMEOUT_MS = 15 * 60_000;
