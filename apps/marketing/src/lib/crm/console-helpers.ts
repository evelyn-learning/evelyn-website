// Pure, mongoose-free helpers the outreach console's CLIENT components
// import directly (see the header comment in src/lib/outreach/enums.ts for
// why anything they import must not touch mongoose, and
// scripts/test-outreach-guards.ts for the guard that enforces it).
// Task 5 adds sourcePill / leadMatchesQuery / compareLeads below.

/**
 * Round 2 §2. The option list behind an open dropdown: the seed values in
 * their declared order (they carry the label maps and the product taxonomy),
 * then every other value actually present on a lead, sorted. Saving a lead
 * with a new value is what adds it — there is no options manager.
 */
export function mergeOptionValues(
  seeds: readonly string[],
  present: (string | null | undefined)[]
): string[] {
  const out: string[] = [];
  for (const s of seeds) {
    const v = s.trim();
    if (v && !out.includes(v)) out.push(v);
  }
  const extras: string[] = [];
  for (const p of present) {
    const v = (p ?? "").trim();
    if (!v || out.includes(v) || extras.includes(v)) continue;
    extras.push(v);
  }
  extras.sort((a, b) => a.localeCompare(b));
  return [...out, ...extras];
}

/**
 * Round 2 §5. Where a lead came from, derived from `Lead.source` on the
 * client. Source forms in the wild: `gmail:<account>`, `contact-form`,
 * `linkedin:paste`, `linkedin:archive`, `research-job:<id>`, plus legacy
 * free text (`claude-research-2026-08`) and empty — anything unrecognised is
 * research, because that is what every pre-CRM lead was.
 */
export function sourcePill(source?: string): { label: string; tone: "gmail" | "form" | "linkedin" | "research" } {
  const s = (source ?? "").trim().toLowerCase();
  if (s.startsWith("gmail:")) {
    const local = s.slice("gmail:".length).split("@")[0].trim();
    return { label: local ? `${local}@` : "gmail", tone: "gmail" };
  }
  if (s === "contact-form" || s === "form") return { label: "form", tone: "form" };
  if (s.startsWith("linkedin")) return { label: "LinkedIn", tone: "linkedin" };
  return { label: "research", tone: "research" };
}

export interface SearchableTouch {
  at?: string;
  subject?: string;
  body?: string;
  summary?: string;
  from?: string;
  to?: string;
}

export interface SearchableLead {
  company?: string;
  segment?: string;
  product?: string;
  status?: string;
  notes?: string;
  source?: string;
  emails?: string[];
  decisionMaker?: { name?: string; title?: string; email?: string };
  touches?: SearchableTouch[];
}

/**
 * Round 2 §6. Case-insensitive substring over everything the operator can
 * see or remember about a lead, INCLUDING touch bodies — "typing pagevault
 * narrows to leads whose touches mention it" is the acceptance case. Applied
 * client-side over the already-loaded list, so an empty query must be cheap
 * and must match everything.
 */
export function leadMatchesQuery(lead: SearchableLead, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const fields: (string | undefined)[] = [
    lead.company,
    lead.segment,
    lead.product,
    lead.status,
    lead.notes,
    lead.source,
    lead.decisionMaker?.name,
    lead.decisionMaker?.title,
    lead.decisionMaker?.email,
    ...(lead.emails ?? []),
  ];
  for (const t of lead.touches ?? []) fields.push(t.subject, t.body, t.summary, t.from, t.to);
  return fields.some((f) => !!f && f.toLowerCase().includes(needle));
}

export type SortKey =
  | "company" | "segment" | "status" | "product" | "decisionMaker"
  | "touches" | "nextActionAt" | "lastTouchAt";
export type SortDir = "asc" | "desc";

export interface SortableLead extends SearchableLead {
  status?: string;
  nextActionAt?: string | null;
}

const NUMERIC_KEYS: SortKey[] = ["touches", "nextActionAt", "lastTouchAt"];

function textOf(lead: SortableLead, key: SortKey): string {
  switch (key) {
    case "company": return lead.company ?? "";
    case "segment": return lead.segment ?? "";
    case "status": return lead.status ?? "";
    case "product": return lead.product ?? "";
    // The cell renders the name, falling back to the address — sort on
    // whatever it actually shows.
    case "decisionMaker": return lead.decisionMaker?.name || lead.decisionMaker?.email || "";
    default: return "";
  }
}

/** null means "this lead has no value for this column" — always sorted last. */
function numberOf(lead: SortableLead, key: SortKey): number | null {
  if (key === "touches") return (lead.touches ?? []).length;
  if (key === "nextActionAt") {
    if (!lead.nextActionAt) return null;
    const t = new Date(lead.nextActionAt).getTime();
    return Number.isNaN(t) ? null : t;
  }
  const stamps = (lead.touches ?? [])
    .map((t) => (t.at ? new Date(t.at).getTime() : Number.NaN))
    .filter((n) => !Number.isNaN(n));
  return stamps.length ? Math.max(...stamps) : null;
}

/**
 * Round 2 §6: every Pipeline header toggles asc/desc. Blank cells always
 * sink to the bottom, in BOTH directions — flipping the sort to find the
 * newest reply should not fill the top of the table with leads that have
 * never been touched.
 */
export function compareLeads(a: SortableLead, b: SortableLead, key: SortKey, dir: SortDir): number {
  const sign = dir === "desc" ? -1 : 1;
  if (NUMERIC_KEYS.includes(key)) {
    const x = numberOf(a, key);
    const y = numberOf(b, key);
    if (x === null && y === null) return 0;
    if (x === null) return 1;
    if (y === null) return -1;
    return (x - y) * sign;
  }
  const x = textOf(a, key);
  const y = textOf(b, key);
  if (!x && !y) return 0;
  if (!x) return 1;
  if (!y) return -1;
  return x.localeCompare(y) * sign;
}
