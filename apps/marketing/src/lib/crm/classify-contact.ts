import { CONTACT_REASONS, PRODUCTS, type ContactReason } from "@/lib/outreach/enums";

const CAREERS_RE = /\b(resume|r[ée]sum[ée]|cv|applying|application for|job (opening|opportunity|role)|position|internship|vacancy|hiring|recruit(er|ing)?)\b/i;

export function classifyContact(input: { reason?: string; subject: string; message: string }): { reason: ContactReason; isCareers: boolean } {
  let reason: ContactReason = "other";
  const raw = (input.reason ?? "").trim().toLowerCase();
  if (raw === "demo") reason = "demo_request";
  else if ((CONTACT_REASONS as readonly string[]).includes(raw)) reason = raw as ContactReason;
  const text = `${input.subject}\n${input.message}`;
  const isCareers = reason === "careers" || (reason === "other" || reason === "product_inquiry") && CAREERS_RE.test(text);
  return { reason: isCareers ? "careers" : reason, isCareers };
}

const PRODUCT_PARAM: Record<string, string> = {
  "voice-tutor": "voice_tutor", "tutor-copilot": "voice_tutor", "homework-bot": "voice_tutor", "math-solver": "voice_tutor",
  academy: "academy", "evelyn-academy": "academy",
  "mock-exams": "mock_exams", "test-generator": "mock_exams",
  "white-label": "white_label", partner: "white_label",
  content: "content_services", "content-authoring": "content_services",
};

/**
 * Round 2 §2: the product list is open, so an unmapped CTA slug becomes its
 * own product rather than collapsing into "other" — a lead from
 * /products/essay-ai is recorded as `essay_ai`, which the Pipeline dropdown
 * then offers to every other lead. The map above still exists for the CTAs
 * whose slug differs from the product we sell.
 */
export function productFromParam(p: string | null): string | undefined {
  if (!p) return undefined;
  const raw = p.trim().toLowerCase();
  if (!raw) return undefined;
  const mapped = PRODUCT_PARAM[raw];
  if (mapped) return mapped;
  if ((PRODUCTS as readonly string[]).includes(raw)) return raw;
  const slug = raw.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug || undefined;
}
