import { decode, toHtml } from "./qti";

// Reads the standard QTI 2.1 interactions out of an item body (regex, like qti.ts;
// namespace-free, attributes in any order). Read-only: the item page shows each
// kind so a reviewer sees the whole question; later tasks check completeness and
// compare answers from `interactions` and `keys`.

type Opt = { label: string; html: string };
export type Interaction =
  | { kind: "choice"; maxChoices: number; options: Opt[] }
  | { kind: "textEntry"; responseId: string } // numerical or typed answer
  | { kind: "inlineChoice"; responseId: string; choices: Opt[] } // drop-down
  | { kind: "match"; premises: Opt[]; responses: Opt[] }
  | { kind: "gapMatch"; gaps: string[]; choices: Opt[] } // drag and drop
  | { kind: "order"; choices: Opt[] }
  | { kind: "extendedText"; responseId: string } // written response
  | { kind: "unsupported"; element: string };

const BLANK = '<span class="fill-in-the-blank"></span>';
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
      return { kind: "choice", maxChoices: Number(attr(attrs, "maxChoices") ?? 1), options: opts(inner, "simpleChoice") };
    case "textEntryInteraction":
      return { kind: "textEntry", responseId };
    case "inlineChoiceInteraction":
      return { kind: "inlineChoice", responseId, choices: opts(inner, "inlineChoice") };
    case "matchInteraction": {
      const sets = [...inner.matchAll(/<simpleMatchSet\b[^>]*>([\s\S]*?)<\/simpleMatchSet>/g)].map((m) => opts(m[1], "simpleAssociableChoice"));
      return { kind: "match", premises: sets[0] ?? [], responses: sets[1] ?? [] };
    }
    case "gapMatchInteraction":
      return {
        kind: "gapMatch",
        gaps: [...inner.matchAll(/<gap\b([^>]*?)\/?>/g)].map((m) => attr(m[1], "identifier") ?? ""),
        choices: opts(inner, "gapText"),
      };
    case "orderInteraction":
      return { kind: "order", choices: opts(inner, "simpleChoice") };
    case "extendedTextInteraction":
      return { kind: "extendedText", responseId };
    default:
      return { kind: "unsupported", element };
  }
}

export function parseInteractions(itemBodyXml: string): Interaction[] {
  const found = [...itemBodyXml.matchAll(ELEMENT)].map((m) => one(m[1], m[2], m[3] ?? ""));
  // SOLARO's numerical response has no interaction element, only a blank in the stem.
  if (!found.length && /class="[^"]*\bfill-in-the-blank\b/.test(itemBodyXml)) return [{ kind: "textEntry", responseId: "RESPONSE" }];
  return found;
}

/** The stem with inline interactions as visible blanks and block interactions removed (shown from `interactions`). */
export function stemWithoutInteractions(body: string): string {
  return body.replace(ELEMENT, (_all, element: string, _attrs: string, inner = "") => {
    if (element === "textEntryInteraction" || element === "inlineChoiceInteraction") return BLANK;
    if (element === "choiceInteraction") return "";
    // Keep the prompt, and for gapMatch the text around the gaps.
    const prompt = inner.match(/<prompt\b[^>]*>([\s\S]*?)<\/prompt>/)?.[1];
    const lead = prompt ? `<p>${prompt}</p>` : "";
    if (element === "gapMatchInteraction") {
      const text = inner.replace(/<prompt\b[\s\S]*?<\/prompt>/g, "").replace(/<gapText\b[\s\S]*?<\/gapText>/g, "").replace(/<gap\b[^>]*?\/?>(?:\s*<\/gap>)?/g, BLANK);
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
