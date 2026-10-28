/**
 * Tool-call markup written as TEXT — never reaches speech or the transcript.
 *
 * GDI session embed-1792350642171 (2026-10-18, Kenji v4): after the lesson
 * had closed, two tutor turns came back as
 *   `<function_calls><function_invoke name="close_session_notes">
 *    <parameter name="reason">…</parameter>…`
 * in the TEXT stream — the model wrote its tool call out instead of issuing
 * it. The meta-narration filter's structural rule kept the sentences off
 * TTS (it drops a sentence carrying an attribute-bearing tag), but it works
 * one sentence at a time, so the transcript still showed the raw markup
 * (Praveen saw "tags"), and a tag that straddled a sentence boundary could
 * have been spoken.
 *
 * This filter is stateful across the sentences of one model reply: from an
 * opening tool-markup tag to its closing tag — across sentence boundaries —
 * nothing is forwarded. Text before the opener and after the closer is kept.
 * A stray closing tag on its own is removed too.
 *
 * Only the tool-call vocabulary is matched (function_calls / function_invoke
 * / invoke / parameter / tool_call / tool_use, with or without an `antml:`
 * prefix). Inequalities, LaTeX and ordinary prose are untouched.
 *
 * Pure module — no side effects, never throws.
 */

const TAG_NAMES = '(?:function_calls|function_invoke|function_results|invoke|parameter|tool_call|tool_use|tool_result)';
const OPEN_RE = new RegExp(`<(?:antml:)?${TAG_NAMES}\\b[^<>]*>`, 'i');
const STRAY_CLOSE_RE = new RegExp(`<\\/(?:antml:)?${TAG_NAMES}\\s*>`, 'gi');

/** The closing tag that ends a block opened by `openTag`. A function_calls /
 *  function_results block swallows everything up to its own close; any other
 *  opener closes at its own close tag. */
function closerFor(openTag: string): RegExp {
  const name = /^<(?:antml:)?([a-z_]+)/i.exec(openTag)?.[1]?.toLowerCase() ?? 'function_calls';
  return new RegExp(`<\\/(?:antml:)?${name}\\s*>`, 'i');
}

export interface ToolMarkupResult {
  /** What may be forwarded (possibly empty). */
  text: string;
  /** True when anything was removed. */
  stripped: boolean;
}

export class ToolMarkupFilter {
  private closer: RegExp | null = null;

  /** Start of a new model reply: no block is open. */
  reset(): void {
    this.closer = null;
  }

  /** True while inside an unclosed tool-markup block. */
  get open(): boolean {
    return this.closer !== null;
  }

  filter(sentence: string): ToolMarkupResult {
    let rest = typeof sentence === 'string' ? sentence : '';
    let out = '';
    let stripped = false;
    for (let guard = 0; guard < 50 && rest; guard++) {
      if (this.closer) {
        const close = this.closer.exec(rest);
        if (!close) { stripped = true; rest = ''; break; }
        rest = rest.slice(close.index + close[0].length);
        this.closer = null;
        stripped = true;
        continue;
      }
      const open = OPEN_RE.exec(rest);
      if (!open) { out += rest; rest = ''; break; }
      out += rest.slice(0, open.index);
      this.closer = closerFor(open[0]);
      rest = rest.slice(open.index + open[0].length);
      stripped = true;
    }
    if (STRAY_CLOSE_RE.test(out)) {
      out = out.replace(STRAY_CLOSE_RE, ' ');
      stripped = true;
    }
    STRAY_CLOSE_RE.lastIndex = 0;
    const text = stripped ? out.replace(/\s{2,}/g, ' ').trim() : out;
    return { text, stripped };
  }
}

/** One-shot form for a whole text (a transcript entry, the done frame's
 *  fullText): blocks never stay open across calls. */
export function stripToolMarkup(text: string): ToolMarkupResult {
  return new ToolMarkupFilter().filter(text);
}

/** Does this text carry tool-call markup at all? */
export function hasToolMarkup(text: string): boolean {
  if (typeof text !== 'string') return false;
  if (OPEN_RE.test(text)) return true;
  const hit = STRAY_CLOSE_RE.test(text);
  STRAY_CLOSE_RE.lastIndex = 0;
  return hit;
}
