import { emailDomain, isFreeMailDomain, normalizeEmail, normalizeLinkedinUrl, websiteDomain } from "./identity";

export interface ContactIdentity {
  email?: string;
  linkedinUrl?: string;
  name?: string;
  company?: string;
  website?: string;
  title?: string;
}

export interface MatchableLead {
  _id: string;
  emails: string[];
  decisionMaker: { email?: string; linkedinUrl?: string };
  website: string;
}

export type MatchBy = "email" | "linkedin" | "domain";

/** Spec §4: email → linkedin → org domain. Pure; caller loads candidates. */
export function pickLead(
  identity: ContactIdentity,
  candidates: MatchableLead[]
): { lead: MatchableLead; by: MatchBy } | null {
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");

  if (email) {
    const hit = candidates.find(
      (c) => c.emails.map(normalizeEmail).includes(email) || (c.decisionMaker.email && normalizeEmail(c.decisionMaker.email) === email)
    );
    if (hit) return { lead: hit, by: "email" };
  }
  if (li) {
    const hit = candidates.find((c) => c.decisionMaker.linkedinUrl && normalizeLinkedinUrl(c.decisionMaker.linkedinUrl) === li);
    if (hit) return { lead: hit, by: "linkedin" };
  }
  if (domain && !isFreeMailDomain(domain)) {
    const hit = candidates.find(
      (c) => websiteDomain(c.website) === domain || c.emails.some((e) => emailDomain(e) === domain) || (c.decisionMaker.email && emailDomain(c.decisionMaker.email) === domain)
    );
    if (hit) return { lead: hit, by: "domain" };
  }
  return null;
}

/** Mongo filter that loads every plausible candidate for `pickLead`. */
export function matchQuery(identity: ContactIdentity): Record<string, unknown> | null {
  const or: Record<string, unknown>[] = [];
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");
  if (email) {
    or.push({ emails: email }, { "decisionMaker.email": new RegExp(`^${escapeRe(email)}$`, "i") });
  }
  if (li) or.push({ "decisionMaker.linkedinUrl": new RegExp(escapeRe(li.replace("https://www.", "")), "i") });
  if (domain && !isFreeMailDomain(domain)) {
    const re = new RegExp(`${escapeRe(domain)}(\\/|$)`, "i");
    or.push({ website: re }, { emails: new RegExp(`@${escapeRe(domain)}$`, "i") }, { "decisionMaker.email": new RegExp(`@${escapeRe(domain)}$`, "i") });
  }
  return or.length ? { $or: or } : null;
}

export function newLeadFields(identity: ContactIdentity, source: string) {
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");
  const company = identity.company?.trim() || (domain && !isFreeMailDomain(domain) ? domain : identity.name?.trim() || "Unknown");
  return {
    company,
    segment: "other",
    about: "",
    whyFit: "",
    useCaseHypothesis: "",
    decisionMaker: {
      name: identity.name?.trim() ?? "",
      title: identity.title?.trim() ?? "",
      email: email || undefined,
      emailVerified: false,
      linkedinUrl: identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) || undefined : undefined,
    },
    website: identity.website ?? (domain && !isFreeMailDomain(domain) ? `https://${domain}` : ""),
    source,
    status: "staged",
    emails: email ? [email] : [],
  };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
