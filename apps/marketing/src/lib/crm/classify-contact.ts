import { CONTACT_REASONS, type ContactReason, type Product } from "@/lib/outreach/enums";

const CAREERS_RE = /\b(resume|r[ée]sum[ée]|\bcv\b|applying|application for|job (opening|opportunity|role)|position|internship|vacancy|hiring|recruit)/i;

export function classifyContact(input: { reason?: string; subject: string; message: string }): { reason: ContactReason; isCareers: boolean } {
  let reason: ContactReason = "other";
  const raw = (input.reason ?? "").trim().toLowerCase();
  if (raw === "demo") reason = "demo_request";
  else if ((CONTACT_REASONS as readonly string[]).includes(raw)) reason = raw as ContactReason;
  const text = `${input.subject}\n${input.message}`;
  const isCareers = reason === "careers" || (reason === "other" || reason === "product_inquiry") && CAREERS_RE.test(text);
  return { reason: isCareers ? "careers" : reason, isCareers };
}

const PRODUCT_PARAM: Record<string, Product> = {
  "voice-tutor": "voice_tutor", "tutor-copilot": "voice_tutor", "homework-bot": "voice_tutor", "math-solver": "voice_tutor",
  academy: "academy", "evelyn-academy": "academy",
  "mock-exams": "mock_exams", "test-generator": "mock_exams",
  "white-label": "white_label", partner: "white_label",
  content: "content_services", "content-authoring": "content_services",
};

export function productFromParam(p: string | null): Product | undefined {
  if (!p) return undefined;
  return PRODUCT_PARAM[p.toLowerCase()] ?? "other";
}
