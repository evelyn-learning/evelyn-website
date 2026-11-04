// Pure helpers for the Beacon autoblog topic queue and the post-flag PATCH body.
import { isCtaProduct, type CtaProduct } from "@/lib/blog/beacon-flags";

export type BeaconTopicSource = "geo-lost" | "product-query";
export interface BeaconTopic {
  topic: string;
  reason: string;
  source: BeaconTopicSource;
}

export const BEACON_TOPICS_MAX = 10;
const SOURCES: readonly string[] = ["geo-lost", "product-query"];

export function nextBeaconTopic(settings: { beaconTopics?: BeaconTopic[] | null }): { topic: string; reason: string } | null {
  const first = settings.beaconTopics?.[0];
  return first ? { topic: first.topic, reason: first.reason } : null;
}

export function parseTopicsBody(body: unknown): { ok: true; topics: BeaconTopic[] } | { ok: false; error: string } {
  const topics = (body as { topics?: unknown } | null)?.topics;
  if (!Array.isArray(topics)) return { ok: false, error: "topics must be an array" };
  if (topics.length > BEACON_TOPICS_MAX) return { ok: false, error: `at most ${BEACON_TOPICS_MAX} topics` };
  const out: BeaconTopic[] = [];
  for (const t of topics) {
    const topic = typeof t?.topic === "string" ? t.topic.trim() : "";
    const reason = typeof t?.reason === "string" ? t.reason.trim() : "";
    if (!topic || topic.length > 300) return { ok: false, error: "each topic needs a topic string (≤300 chars)" };
    if (reason.length > 1000) return { ok: false, error: "reason too long" };
    if (!SOURCES.includes(t?.source)) return { ok: false, error: "source must be geo-lost or product-query" };
    out.push({ topic, reason, source: t.source as BeaconTopicSource });
  }
  return { ok: true, topics: out };
}

export interface PostPatch {
  noindex?: boolean;
  reason?: string;
  ctaProduct?: CtaProduct | null;
}

export function parsePostPatch(body: unknown): { ok: true; patch: PostPatch } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "body must be an object" };
  const b = body as Record<string, unknown>;
  const patch: PostPatch = {};
  if ("noindex" in b) {
    if (typeof b.noindex !== "boolean") return { ok: false, error: "noindex must be boolean" };
    patch.noindex = b.noindex;
  }
  if ("reason" in b) {
    if (typeof b.reason !== "string" || b.reason.length > 500) return { ok: false, error: "reason must be a string (≤500 chars)" };
    patch.reason = b.reason;
  }
  if ("ctaProduct" in b) {
    if (b.ctaProduct !== null && !isCtaProduct(b.ctaProduct)) return { ok: false, error: "ctaProduct must be voice-tutor, academy or null" };
    patch.ctaProduct = b.ctaProduct as CtaProduct | null;
  }
  if (patch.noindex === undefined && patch.ctaProduct === undefined) {
    return { ok: false, error: "nothing to change (noindex or ctaProduct)" };
  }
  return { ok: true, patch };
}
