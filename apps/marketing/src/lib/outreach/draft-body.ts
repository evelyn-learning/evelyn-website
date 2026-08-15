/**
 * Draft-body preparation shared by the Gmail draft path and the console's
 * copy-to-clipboard buttons.
 *
 * The research prompts instruct the model to emit a literal `[DEMO_LINK]`
 * line where the per-lead demo URL belongs (see research/prompts.ts). Nothing
 * ever substituted it: the token was persisted verbatim on
 * `lead.currentDraft.body` and carried straight into the Gmail draft, so
 * every generated draft arrived advertising a walkthrough behind the text
 * "[DEMO_LINK]". Operators worked around it by composing the mail by hand in
 * Gmail and pasting the link from the console's own copy button — which is
 * also why the draft's thread id never matched the sent conversation.
 */

export const DEMO_LINK_TOKEN = "[DEMO_LINK]";

/** The per-lead demo URL, or null when the lead has no token yet. */
export function demoLinkFor(siteUrl: string, demoToken: string | undefined | null): string | null {
  if (!demoToken) return null;
  return `${siteUrl.replace(/\/+$/, "")}/d/${demoToken}`;
}

/**
 * Replace the `[DEMO_LINK]` placeholder with `demoLink`.
 *
 * When there is no demo link the placeholder LINE is dropped entirely rather
 * than left in place — a body reading "[DEMO_LINK]" is worse than one with no
 * link at all, and this path is one `await lead.save()` away from a real
 * prospect. Collapses the blank line the token sat on so the paragraph
 * spacing doesn't gap.
 */
export function applyDemoLink(body: string, demoLink: string | null): string {
  if (!body.includes(DEMO_LINK_TOKEN)) return body;
  if (demoLink) return body.split(DEMO_LINK_TOKEN).join(demoLink);
  return body
    .split("\n")
    .filter((line) => line.trim() !== DEMO_LINK_TOKEN)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]!);
}

/**
 * Render a plain-text draft body as the HTML half of a multipart/alternative
 * message, approximating what Gmail's own compose window produces.
 *
 * Why this exists: the draft was sent as bare `text/plain`, which Gmail
 * displays in a narrow fixed-width column with its own hard wrapping — the
 * generated body has no wrapping of its own (paragraphs run to 400+ chars),
 * so the ragged column was purely a rendering artifact of the content type.
 * A hand-composed Gmail message is multipart/alternative, and flows to the
 * reader's full width.
 *
 * Blank-line-separated blocks become <p>; single newlines inside a block
 * become <br> (that's how the sign-off block keeps its shape). Bare URLs are
 * linkified so the demo link is clickable rather than plain text.
 */
export function bodyToHtml(body: string): string {
  const paragraphs = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      // Escape first, THEN linkify, so a URL's own characters can't be
      // mangled by the escaper and markup can't be injected from the body.
      const escaped = escapeHtml(block).replace(/\n/g, "<br>");
      const linked = escaped.replace(
        /https?:\/\/[^\s<]+[^\s<.,)"']/g,
        (url) => `<a href="${url}">${url}</a>`,
      );
      return `<p>${linked}</p>`;
    })
    .join("\n");

  // Inline styles only — Gmail strips <style> blocks. The font stack matches
  // Gmail's compose default so a generated draft and a hand-written one look
  // the same in the recipient's inbox.
  return [
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222">',
    paragraphs,
    "</div>",
  ].join("\n");
}
