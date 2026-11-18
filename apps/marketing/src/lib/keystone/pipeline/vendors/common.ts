// What every vendor adapter returns to callModel, and how it reports HTTP trouble.

export type VendorReply = {
  /** The reply's text (thinking/reasoning excluded). */
  text: string;
  /** Set when the vendor's documented refusal signal fired; the value is a short reason. */
  refusal?: string;
  /** True when the reply stopped at the output token limit. */
  truncated?: boolean;
  tokensIn: number;
  /** Output tokens as billed, reasoning/thinking included. */
  tokensOut: number;
  /** The model that actually served the reply, when the vendor says. */
  model?: string;
  /** True when a vendor-side fallback model served the reply. */
  fellBack?: boolean;
};

/** Network or HTTP failure. Retryable: network error, 408, 429, 5xx (incl. 529). */
export class TransportError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
  }
}

export function retryableStatus(status: number | undefined): boolean {
  return status === undefined || status === 408 || status === 429 || status >= 500;
}

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"] as const;
export type ImageType = (typeof IMAGE_TYPES)[number];

export function toBase64(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

/** Long reasoning calls: give each request up to 15 minutes. */
export const REQUEST_TIMEOUT_MS = 15 * 60_000;
