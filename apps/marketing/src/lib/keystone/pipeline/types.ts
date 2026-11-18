// Shared types for the Keystone solutions pipeline. No `next/*` imports here:
// pipeline modules run from tsx scripts on a laptop as well as inside the app.

export type Role = "solver1" | "solver2" | "solver3Text" | "solver3Image" | "author" | "intake" | "working" | "audit" | "compare" | "animator";

export type Vendor = "anthropic" | "openai" | "deepseek" | "gemini";

export type ModelImage = { mime: string; data: Uint8Array };

export type ModelCall = {
  role: Role;
  system: string;
  user: string;
  images?: ModelImage[];
  schema: object;
  /** Output token limit (thinking included). Default: the adapter's own (16 000 on Claude). Claude only. */
  maxTokens?: number;
  /** Claude only: the system prompt as ordered parts, each ending a cached prefix (at most 4). When given it is
   * sent instead of `system` (which must be the same text, joined, for the other vendors). */
  systemParts?: string[];
};

/** Tokens of one call as billed. Cache figures are parts of `in` (Claude only; zero elsewhere). */
export type TokenUse = { in: number; out: number; cacheWrite: number; cacheRead: number };

export type ModelFailureReason = "shape" | "refusal" | "empty" | "transport";

export type ModelReply<T> =
  /** model = the model that served the reply; fellBack = a vendor-side fallback served it
   * instead of MODEL_FOR[role].model (Anthropic refusal fallback). */
  | { ok: true; value: T; cost: number; model: string; ms: number; fellBack: boolean; tokens?: TokenUse }
  /** transient: the call failed on a network error or a 429 / 5xx after every retry: worth trying again later. */
  | { ok: false; reason: ModelFailureReason; detail: string; cost: number; model: string; transient?: boolean; tokens?: TokenUse };

export type PriceChange = { from: string /* ISO date, in force from this day (UTC) */; pricePerMTokIn: number; pricePerMTokOut: number };

export type ModelSpec = {
  vendor: Vendor;
  model: string;
  pricePerMTokIn: number;
  pricePerMTokOut: number;
  /** Announced price changes; the latest entry whose `from` has passed applies. */
  priceChanges?: PriceChange[];
};

export type ModelDeps = {
  /** Injected HTTP for tests; also lifts the live switch (no real vendor is reached). */
  fetch?: typeof fetch;
  /** The first wait before a transport retry (then ×3, ×9, with jitter); tests set 0. Default 2000 ms. */
  backoffMs?: number;
  /** How a wait is spent (tests pass a fake that records the waits and returns at once). Default: a real timer. */
  sleep?: (ms: number) => Promise<void>;
  /** Clock for date-aware prices; tests set it. Default: now. */
  now?: Date;
};
