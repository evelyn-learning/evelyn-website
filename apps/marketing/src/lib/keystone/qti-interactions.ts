import { decode, toHtml } from "./qti";

// Reads the standard QTI 2.1 interactions out of an item body (regex, like qti.ts;
// namespace-free, attributes in any order). Read-only: the item page shows each
// kind so a reviewer sees the whole question; later tasks check completeness and
// compare answers from `interactions` and `keys`.

type Opt = { label: string; html: string };
export type Interaction =
  | { kind: "choice"; responseId: string; maxChoices: number; options: Opt[] }
  | { kind: "textEntry"; responseId: string } // numerical or typed answer
  | { kind: "inlineChoice"; responseId: string; choices: Opt[] } // drop-down
  | { kind: "match"; responseId: string; premises: Opt[]; responses: Opt[] }
  | { kind: "gapMatch"; responseId: string; gaps: string[]; choices: Opt[] } // drag and drop
  | { kind: "order"; responseId: string; choices: Opt[] }
  | { kind: "extendedText"; responseId: string } // written response
  | { kind: "unsupported"; element: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const BLANK = '<span class="fill-in-the-blank"></span>';
// Known limit: an interaction nested inside another of the same element name is not supported.
const ELEMENT = /<(\w+Interaction)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/g;

function attr(attrs: string, name: string): string | undefined {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`));
  return m ? decode(m[1] ?? m[2] ?? "") : undefined;
}

function opts(xml: string, element: string): Opt[] {
  const out: Opt[] = [];
  for (const m of xml.matchAll(new RegExp(`<${element}\\b([^>]*?)(?:/>|>([\\s\\S]*?)</${element}>)`, "g"))) {
    out.push({ label: attr(m[1], "identifier") ?? "", html: toHtml(m[2] ?? "") });
  }
  return out;
}

function one(element: string, attrs: string, inner: string): Interaction {
  const responseId = attr(attrs, "responseIdentifier") ?? "RESPONSE";
  switch (element) {
    case "choiceInteraction":
      return { kind: "choice", responseId, maxChoices: Number(attr(attrs, "maxChoices") ?? 1), options: opts(inner, "simpleChoice") };
    case "textEntryInteraction":
      return { kind: "textEntry", responseId };
    case "inlineChoiceInteraction":
      return { kind: "inlineChoice", responseId, choices: opts(inner, "inlineChoice") };
    case "matchInteraction": {
      const sets = [...inner.matchAll(/<simpleMatchSet\b[^>]*>([\s\S]*?)<\/simpleMatchSet>/g)].map((m) => opts(m[1], "simpleAssociableChoice"));
      return { kind: "match", responseId, premises: sets[0] ?? [], responses: sets[1] ?? [] };
    }
    case "gapMatchInteraction":
      return {
        kind: "gapMatch",
        responseId,
        gaps: [...inner.matchAll(/<gap\b([^>]*?)\/?>/g)].map((m) => attr(m[1], "identifier") ?? ""),
        choices: opts(inner, "gapText"),
      };
    case "orderInteraction":
      return { kind: "order", responseId, choices: opts(inner, "simpleChoice") };
    case "extendedTextInteraction":
      return { kind: "extendedText", responseId };
    default:
      return { kind: "unsupported", element };
  }
}

export function parseInteractions(itemBodyXml: string): Interaction[] {
  const found = [...itemBodyXml.matchAll(ELEMENT)].map((m) => one(m[1], m[2], m[3] ?? ""));
  // SOLARO's numerical response has no interaction element, only a blank in the stem.
  if (!found.length && /class\s*=\s*(?:"[^"]*|'[^']*)\bfill-in-the-blank\b/.test(itemBodyXml)) return [{ kind: "textEntry", responseId: "RESPONSE" }];
  return found;
}

/** The stem with inline interactions as visible blanks and block interactions removed (shown from `interactions`). */
export function stemWithoutInteractions(body: string): string {
  // With several responses a blank must say which one it is.
  const several = [...body.matchAll(ELEMENT)].length > 1;
  return body.replace(ELEMENT, (_all, element: string, attrs: string, inner = "") => {
    if (element === "textEntryInteraction" || element === "inlineChoiceInteraction") {
      const id = attr(attrs, "responseIdentifier");
      return several && id ? `${BLANK}<sub class="ks-gap-id">${esc(id)}</sub>` : BLANK;
    }
    if (element === "choiceInteraction") return "";
    // Keep the prompt, and for gapMatch the text around the gaps.
    const prompt = inner.match(/<prompt\b[^>]*>([\s\S]*?)<\/prompt>/)?.[1];
    const lead = prompt ? `<p>${prompt}</p>` : "";
    if (element === "gapMatchInteraction") {
      const text = inner.replace(/<prompt\b[\s\S]*?<\/prompt>/g, "").replace(/<gapText\b[\s\S]*?<\/gapText>/g, "").replace(/<gap\b([^>]*?)\/?>(?:\s*<\/gap>)?/g, (_g: string, a: string) => {
        const id = esc(attr(a, "identifier") ?? "");
        return `<span class="fill-in-the-blank" data-gap="${id}"></span><sub class="ks-gap-id">${id}</sub>`;
      });
      return lead + text;
    }
    return lead;
  });
}

/** responseId → correct values, in document order. */
export function keyFor(apipXml: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const m of apipXml.matchAll(/<responseDeclaration\b([^>]*?)(?:\/>|>([\s\S]*?)<\/responseDeclaration>)/g)) {
    const id = attr(m[1], "identifier");
    const cr = (m[2] ?? "").match(/<correctResponse\b[^>]*>([\s\S]*?)<\/correctResponse>/)?.[1];
    if (!id || cr === undefined) continue;
    out[id] = [...cr.matchAll(/<value\b[^>]*>([\s\S]*?)<\/value>/g)].map((v) => decode(v[1].trim()));
  }
  return out;
}

/** One plain line for the key of a textEntry / order / match / gapMatch interaction, or null when there is none. */
export function keyLine(i: Interaction, keys: Record<string, string[]>): string | null {
  if (i.kind !== "order" && i.kind !== "match" && i.kind !== "gapMatch" && i.kind !== "textEntry") return null;
  const vals = keys[i.responseId];
  if (!vals?.length) return null;
  if (i.kind === "textEntry") return `Key: ${vals.join(", ")}`;
  if (i.kind === "order") return `Key order: ${vals.join(", ")}`;
  return `Key pairs: ${vals.map((v) => v.trim().split(/\s+/).join(" → ")).join("; ")}`;
}
