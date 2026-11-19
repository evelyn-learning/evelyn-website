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
  | { ok: true; value: T; cost: number; model: string; ms: number; fellBack: boolean; tokens?: TokenUse; batch?: boolean }
  /** transient: the call failed on a network error or a 429 / 5xx after every retry: worth trying again later. */
  | { ok: false; reason: ModelFailureReason; detail: string; cost: number; model: string; transient?: boolean; tokens?: TokenUse; batch?: boolean };

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
  /** Bulk mode (bulk.ts): where a call's reply comes from a vendor batch instead of a live request. */
  batch?: BatchPort;
};

/** The reply fields a vendor adapter returns (vendors/common.ts VendorReply), as bulk mode stores them. */
export type StoredReply = {
  text: string; refusal?: string; truncated?: boolean; tokensIn: number; cacheWriteTokens?: number; cacheReadTokens?: number;
  tokensOut: number; model?: string; fellBack?: boolean;
};

/**
 * What bulk mode answers when callModel is about to make a call:
 *   reply  the reply is there: from the batch (pricing "batch") or from a live call made earlier in its place (pricing "live");
 *   live   the batch gave no usable reply for this request (errored, expired, canceled, lost, or refused: a batch has
 *          no refusal fallback): make the live call now, once, and hand its reply to `settle` so it is kept.
 * `extraCost`: what the batch already charged for this request before the live call replaced it (a billed refusal).
 */
export type BatchServe =
  | { kind: "reply"; id: string; reply: StoredReply; pricing: "batch" | "live"; extraCost: number }
  | { kind: "live"; id: string; why: string; extraCost: number; settle(reply: StoredReply, cost: number): Promise<void> };

export interface BatchPort {
  /** Whether calls of this role go through a batch (the vendor has a batch endpoint we use and the role is batched). */
  takes(role: Role, vendor: Vendor): boolean;
  /** Synchronous. Throws BatchPending when the request is waiting on a batch (already submitted, or queued by this very call). */
  serve(role: Role, spec: ModelSpec, body: Record<string, unknown>): BatchServe;
  /** Told once per served call, for the step's record: its id, whether it was priced at the batch rate, and what the batch rate saved. */
  record(use: { id: string; batch: boolean; saved: number }): void;
}

/** Thrown through the run when a model call is waiting on a batch: the item's run stops here, unfinished, and continues at a later invocation. */
export class BatchPending extends Error {
  constructor(message = "waiting on a batch") {
    super(message);
    this.name = "BatchPending";
  }
}
