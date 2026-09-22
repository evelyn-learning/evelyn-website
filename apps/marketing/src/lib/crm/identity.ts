// Mongoose-free identity helpers shared by every ingest path.
export const SELF_DOMAINS = ["evelynlearning.com", "evelyntutor.com", "crimsora.com"] as const;
export const INFO_ALIASES = ["info", "contact", "hello", "legal", "support", "admin", "training", "security"] as const;

const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com", "outlook.com", "live.com",
  "icloud.com", "me.com", "aol.com", "protonmail.com", "proton.me", "mail.com", "msn.com", "ymail.com",
]);

export function normalizeEmail(s: string): string {
  const m = s.match(/<([^>]+)>/);
  return (m ? m[1] : s).trim().toLowerCase();
}

export function emailDomain(email: string): string {
  const e = normalizeEmail(email);
  const i = e.lastIndexOf("@");
  return i === -1 ? "" : e.slice(i + 1);
}

export function isFreeMailDomain(domain: string): boolean {
  return FREE_MAIL.has(domain.toLowerCase());
}

export function isSelfAddress(email: string): boolean {
  const d = emailDomain(email);
  return (SELF_DOMAINS as readonly string[]).includes(d);
}

export function normalizeLinkedinUrl(u: string): string {
  const m = u.trim().match(/linkedin\.com\/in\/([^/?#\s]+)/i);
  return m ? `https://www.linkedin.com/in/${decodeURIComponent(m[1]).toLowerCase()}` : "";
}

export function websiteDomain(url: string): string {
  if (!url) return "";
  try {
    const host = new URL(url.includes("://") ? url : `https://${url}`).hostname.toLowerCase();
    return host.replace(/^www\./, "");
  } catch {
    return "";
  }
}
