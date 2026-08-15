/**
 * LanguageTool grammar + style check.
 *
 * Uses the free public endpoint at api.languagetool.org/v2/check.
 * Rate-limited — self-host LanguageTool for production scale.
 *
 * Returns a compact view of the matches found so the tutor can surface
 * a couple of the most important issues without overwhelming the student.
 */

const DEFAULT_ENDPOINT = 'https://api.languagetool.org/v2/check';
const MAX_TEXT_CHARS = 2000; // keep the request body reasonable

export interface GrammarIssue {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  category: string;
  suggestion?: string;
  severity: 'typo' | 'grammar' | 'style' | 'other';
}

function classifySeverity(category: string): GrammarIssue['severity'] {
  const c = category.toLowerCase();
  if (c.includes('typo')) return 'typo';
  if (c.includes('grammar') || c.includes('agreement')) return 'grammar';
  if (c.includes('style') || c.includes('redundan') || c.includes('word')) return 'style';
  return 'other';
}

export async function checkGrammar(text: string, opts: {
  language?: string;      // "en-US" | "en-GB" | "fr" | "de" | ...
  endpoint?: string;
  signal?: AbortSignal;
} = {}): Promise<{ issues: GrammarIssue[]; source: 'languagetool' }> {
  if (!text || !text.trim()) return { issues: [], source: 'languagetool' };
  const payload = new URLSearchParams({
    text: text.slice(0, MAX_TEXT_CHARS),
    language: opts.language || 'en-US',
    enabledOnly: 'false',
  });
  const endpoint = opts.endpoint || process.env.LANGUAGETOOL_ENDPOINT || DEFAULT_ENDPOINT;

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload,
      signal: opts.signal ?? AbortSignal.timeout(6000),
    });
    if (!resp.ok) return { issues: [], source: 'languagetool' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await resp.json() as { matches?: any[] };
    const matches = Array.isArray(data.matches) ? data.matches : [];
    return {
      issues: matches.map((m): GrammarIssue => ({
        message: m.message,
        shortMessage: m.shortMessage,
        offset: m.offset,
        length: m.length,
        category: m.rule?.category?.name || 'unknown',
        suggestion: (m.replacements && m.replacements[0]?.value) || undefined,
        severity: classifySeverity(m.rule?.category?.name || ''),
      })),
      source: 'languagetool',
    };
  } catch (err) {
    console.error('[LanguageTool] check failed:', err);
    return { issues: [], source: 'languagetool' };
  }
}
