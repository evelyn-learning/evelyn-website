import { sanitize } from "./render";

// Review notes are typed fast and sometimes carry markup pasted straight from
// SOLARO (a missing postamble table, 2026-11-16). Shown raw, the tags filled
// the history and the lists. A note is split into its words and, when it has
// markup, a cleaned copy that renders as the table or text it stands for.

const ALLOWED = new Set([
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  "p", "div", "span", "br", "ul", "ol", "li", "b", "strong", "i", "em", "u", "sub", "sup",
]);
const VOID = new Set(["br", "col"]);
const KEEP_ATTR = /\s(colspan|rowspan)="(\d{1,2})"/gi;

/** Only structural tags survive, with no attributes except colspan/rowspan. */
export function cleanPastedHtml(html: string): string {
  return sanitize(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)([A-Za-z][\w:-]*)([^>]*)>/g, (_m, close: string, name: string, attrs: string) => {
      const tag = name.toLowerCase();
      if (!ALLOWED.has(tag)) return " ";
      if (close) return VOID.has(tag) ? "" : `</${tag}>`;
      const kept = [...attrs.matchAll(KEEP_ATTR)].map((a) => ` ${a[1].toLowerCase()}="${a[2]}"`).join("");
      return `<${tag}${kept}${VOID.has(tag) ? " /" : ""}>`;
    })
    .trim();
}

const decode = (s: string) =>
  s.replace(/&nbsp;|&#160;|&#xa0;/gi, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");

export type NoteParts = {
  /** The words the reviewer typed (before any pasted markup), blank lines closed up. */
  text: string;
  /** Pasted markup, cleaned; null when the note is plain text. */
  html: string | null;
  /** One line of plain text for lists. */
  plain: string;
  /** Too long to show whole in a list of activity. */
  long: boolean;
};

export function splitNote(body: string | undefined | null): NoteParts {
  const src = (body ?? "").replace(/\r\n/g, "\n").trim();
  const at = src.search(/<(table|div|p|ul|ol|span|tbody|tr|td|html)\b/i);
  const text = (at < 0 ? src : src.slice(0, at)).replace(/\n\s*\n+/g, "\n").trim();
  const html = at < 0 ? null : cleanPastedHtml(src.slice(at)) || null;
  const htmlText = html ? decode(html.replace(/<[^>]+>/g, " ")) : "";
  const plain = `${text} ${htmlText}`.replace(/\s+/g, " ").trim();
  const long = !!html || plain.length > 260 || text.split("\n").length > 4;
  return { text, html, plain, long };
}
