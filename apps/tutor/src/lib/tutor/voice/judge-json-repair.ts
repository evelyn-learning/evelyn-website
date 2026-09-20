/**
 * Salvage a judge verdict from JSON the model mangled.
 *
 * Live 2026-09-05 (portal-51b667f1, error log): the judge answered with a
 * fenced object whose "claim" string carried UNESCAPED inner quotes
 * ("…the "new layout" door versus the "old layout" door…"). JSON.parse threw,
 * the route failed OPEN (grounded, no issues) and a flagged issue was lost.
 *
 * Two passes, both pure:
 *   1. escape bare double quotes that sit INSIDE a string value — a quote
 *      that is not followed (after optional whitespace) by one of the
 *      structural characters `,` `}` `]` `:` is treated as content;
 *   2. if that still fails, a field-level regex salvage of `grounded` and
 *      every `claim`/`why` pair.
 * Returns null when nothing verdict-shaped can be recovered.
 */
export interface RepairedJudgeJson {
  grounded?: boolean;
  issues?: Array<{ claim: string; why: string; kind?: string; severity?: string }>;
  method: 'escaped' | 'salvaged';
}

function escapeInnerQuotes(json: string): string {
  let out = '';
  let inStr = false;
  for (let i = 0; i < json.length; i++) {
    const c = json[i];
    if (!inStr) {
      out += c;
      if (c === '"') inStr = true;
      continue;
    }
    if (c === '\\') { out += c + (json[i + 1] ?? ''); i++; continue; }
    if (c === '"') {
      // Closing quote only if the next non-space char is structural.
      let j = i + 1;
      while (j < json.length && /\s/.test(json[j])) j++;
      const next = json[j];
      if (next === undefined || next === ',' || next === '}' || next === ']' || next === ':') { out += c; inStr = false; }
      else out += '\\"';
      continue;
    }
    out += c;
  }
  return out;
}

export function repairJudgeJson(raw: string): RepairedJudgeJson | null {
  const text = (raw || '').replace(/```(?:json)?/gi, '');
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(escapeInnerQuotes(text.slice(start, end + 1))) as { grounded?: unknown; issues?: unknown };
      const issues = Array.isArray(parsed.issues)
        ? parsed.issues.filter((i): i is { claim: string; why: string } => typeof (i as { claim?: unknown })?.claim === 'string' && typeof (i as { why?: unknown })?.why === 'string')
        : undefined;
      return { ...(typeof parsed.grounded === 'boolean' ? { grounded: parsed.grounded } : {}), ...(issues ? { issues } : {}), method: 'escaped' };
    } catch { /* fall through to salvage */ }
  }
  const g = /"grounded"\s*:\s*(true|false)/i.exec(text);
  const issues: Array<{ claim: string; why: string }> = [];
  const pair = /"claim"\s*:\s*"([\s\S]*?)"\s*,\s*"why"\s*:\s*"([\s\S]*?)"\s*[,}]/g;
  let m: RegExpExecArray | null;
  while ((m = pair.exec(text))) issues.push({ claim: m[1].trim(), why: m[2].trim() });
  if (!g && issues.length === 0) return null;
  return { ...(g ? { grounded: g[1].toLowerCase() === 'true' } : {}), issues, method: 'salvaged' };
}
