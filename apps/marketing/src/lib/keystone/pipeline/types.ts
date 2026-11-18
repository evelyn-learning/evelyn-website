// Shared types for the Keystone solutions pipeline. No `next/*` imports here:
// pipeline modules run from tsx scripts on a laptop as well as inside the app.

export type Role = "solver1" | "solver2" | "solver3Text" | "solver3Image" | "author" | "intake" | "working" | "audit" | "compare";

export type Vendor = "anthropic" | "openai" | "deepseek" | "gemini";

export type ModelImage = { mime: string; data: Uint8Array };

export type ModelCall = { role: Role; system: string; user: string; images?: ModelImage[]; schema: object };

export type ModelFailureReason = "shape" | "refusal" | "empty" | "transport";

export type ModelReply<T> =
  /** model = the model that served the reply; fellBack = a vendor-side fallback served it
   * instead of MODEL_FOR[role].model (Anthropic refusal fallback). */
  | { ok: true; value: T; cost: number; model: string; ms: number; fellBack: boolean }
  | { ok: false; reason: ModelFailureReason; detail: string; cost: number; model: string };

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
  /** Wait before the one transport retry; tests set 0. Default 2000 ms. */
  backoffMs?: number;
  /** Clock for date-aware prices; tests set it. Default: now. */
  now?: Date;
};
