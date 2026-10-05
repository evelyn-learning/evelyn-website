/**
 * GAC content check — shared, deterministic checks (no model calls, no DB).
 *
 * Every check runs REAL product code:
 *   - rendering: the academy web renderer the practice card uses
 *     (apps/web/lib/rich.ts → inline-math segmenter + KaTeX, `rich()`);
 *   - MCQ rule: `correctChoiceIdOf` + `isChoiceCorrect` (the drill's on-screen
 *     verdict) and `gradeItem` (the stored grade, apps/api ArtifactService);
 *   - numeric rule: engine `gradeNumericAnswer`, academy api
 *     `numericAnswerVerdict`, academy web `numericMatch`;
 *   - typed items: engine `gradeFreeResponse` with a judge that THROWS — so an
 *     item that would reach the model judge is reported "judge", never called.
 *
 * Opens no database connection and reads no env file.
 */
import { createRequire } from 'node:module';

delete process.env.MONGODB_URI; // connectDB() then throws "not configured" if anything ever calls it

export const ACADEMY = process.env.ACADEMY_DIR ?? '/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Choice { id: string; text: string; correct?: boolean }
export interface Skill { subject: string; loId: string; title: string }
export interface Item {
  id: string;
  kind: 'bank' | 'pgen' | 'seedtry' | 'gentry' | 'revtry' | 'other';
  format?: string;
  question: string;
  key?: string;
  choices: Choice[];
  hints: string[];
  skills: Skill[];
  /** Fields the practice card never shows but the grader uses. */
  rubric?: { parts: Array<{ criterionId: string; maxPoints: number; scoringCriteria: string; modelResponse: string }> } | null;
  modelResponse?: string;
  solutionText?: string;
  passageIds: string[];
  verifierModel?: string;
  difficulty?: number;
}
export type Severity = 'blocker' | 'major' | 'minor' | 'info';
export interface Defect { cls: string; severity: Severity; field: string; excerpt: string }

export function kindOf(id: string): Item['kind'] {
  if (id.startsWith('practice-gen.')) return 'pgen';
  const i = id.indexOf('::');
  if (i < 0) return 'bank';
  const plan = id.slice(0, i);
  if (plan.startsWith('gen-')) return 'gentry';
  if (plan.startsWith('rev-')) return 'revtry';
  return 'seedtry';
}

/** How the practice drill (PracticeDrill.tsx `check`) decides this item. */
export type UiPath = 'mcq' | 'engine' | 'numeric-client';
export function uiPathOf(it: { choices?: Choice[]; format?: string }): UiPath {
  if (it.choices && it.choices.length > 0) return 'mcq';
  if (it.format === 'frq' || it.format === 'free') return 'engine';
  return 'numeric-client';
}

export interface Product {
  rich: (t: string) => { __html: string };
  katex: any;
  correctChoiceIdOf: (it: { choices?: Choice[]; expectedAnswer?: string }) => string | undefined;
  isChoiceCorrect: (answer: string, correctId?: string) => boolean;
  numericMatch: (expected: string, answer: string) => boolean;
  webNumericVerdict: (expected: string, answer: string) => boolean | null;
  apiNumericVerdict: (expected: string, answer: string) => boolean | null;
  apiGradeItem: (item: any, answer: string) => { gradable: boolean; correct?: boolean };
  engineGradeNumeric: (key: string, answer: string) => { decided: boolean; correct?: boolean };
  engineParseNumericKey: (raw: string) => { form: string; value: number; places: number; text: string } | null;
  engineGradeFreeResponse: (req: any, item: any, deps: any) => Promise<{ totalPoints: number; maxPoints: number }>;
  resolveGradeItem: (id: string, deps: any) => Promise<any>;
  resolveAssessmentItem: (id: string, deps: any) => Promise<any>;
  retrievePractice: (req: any, sources: any, gen: any, caller: any) => Promise<{ items: any[] }>;
  toPlanLite: (plan: any) => any;
  SEED_PLANS: any[];
  isWithdrawnItem: (id: string) => boolean;
  withdrawnIds: ReadonlySet<string>;
  isDrawingOnlyItem: (t: string) => boolean;
  resolvePassage: (id: string) => { id: string; title: string; author: string; fullText: string } | undefined;
}

export async function loadProduct(): Promise<Product> {
  const richMod = await import(`${ACADEMY}/apps/web/lib/rich.ts`);
  const webLib = await import(`${ACADEMY}/apps/web/components/practice/lib.ts`);
  const webShared = await import(`${ACADEMY}/apps/web/components/practice/shared.tsx`);
  const apiNum = await import(`${ACADEMY}/apps/api/src/services/numericAnswer.ts`);
  const apiArtifact = await import(`${ACADEMY}/apps/api/src/services/ArtifactService.ts`);
  const practice = await import('@/lib/tutor/portal/practice');
  const grade = await import('@/lib/tutor/portal/grade-free-response');
  const numeric = await import('@/lib/tutor/portal/numeric-answer-rule');
  const adapters = await import('@/lib/tutor/portal/adapters');
  const store = await import('@/lib/tutor/lesson-plan/store');
  const withdrawn = await import('@/lib/tutor/portal/withdrawn-items');
  const gen = await import('@/lib/tutor/portal/practice-gen');
  const passages = await import('@/lib/tutor/passages/store');
  const katex = createRequire(`${ACADEMY}/apps/web/lib/rich.ts`)('katex');
  return {
    rich: richMod.rich,
    katex,
    correctChoiceIdOf: webShared.correctChoiceIdOf,
    isChoiceCorrect: webLib.isChoiceCorrect,
    numericMatch: webLib.numericMatch,
    webNumericVerdict: webLib.numericAnswerVerdict,
    apiNumericVerdict: apiNum.numericAnswerVerdict,
    apiGradeItem: apiArtifact.gradeItem,
    engineGradeNumeric: numeric.gradeNumericAnswer as any,
    engineParseNumericKey: numeric.parseNumericKey as any,
    engineGradeFreeResponse: grade.gradeFreeResponse as any,
    resolveGradeItem: adapters.resolveGradeItem as any,
    resolveAssessmentItem: adapters.resolveAssessmentItem as any,
    retrievePractice: practice.retrievePractice as any,
    toPlanLite: adapters.toPlanLite as any,
    SEED_PLANS: store.SEED_PLANS as any[],
    isWithdrawnItem: withdrawn.isWithdrawnItem,
    withdrawnIds: withdrawn.WITHDRAWN_ITEM_IDS,
    isDrawingOnlyItem: gen.isDrawingOnlyItem,
    resolvePassage: passages.resolvePassage as any,
  };
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const decode3 = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Remove every `<span class="katex…">…</span>` block (depth-counted), leaving `⟦m⟧`. */
function stripKatex(html: string): { text: string; errors: string[] } {
  const errors: string[] = [];
  let out = '';
  let i = 0;
  while (i < html.length) {
    const at = html.indexOf('<span class="katex', i);
    if (at < 0) { out += html.slice(i); break; }
    out += html.slice(i, at);
    const isErr = html.startsWith('<span class="katex-error"', at);
    let depth = 0; let j = at;
    const re = /<span\b|<\/span>/g; re.lastIndex = at;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      if (m[0] === '</span>') { depth--; if (depth === 0) { j = m.index + 7; break; } } else depth++;
    }
    if (depth !== 0) { j = html.length; }
    const block = html.slice(at, j);
    if (isErr) {
      const title = decode3(block.match(/title="([^"]*)"/)?.[1] ?? '').replace(/&quot;/g, '"');
      errors.push(title);
      out += '⟦math-error⟧';
    } else out += '⟦m⟧';
    i = j;
  }
  return { text: out, errors };
}

export interface Rendered {
  html: string;
  /** What the student reads outside rendered maths (tags removed, entities decoded). */
  visible: string;
  katexErrors: string[];
  strictWarnings: string[];
  hasTable: boolean;
}

export function renderRich(P: Product, text: string): Rendered {
  // KaTeX prints its non-strict warnings with console.warn; the strict pass below reports them instead.
  const warn = console.warn; console.warn = () => {};
  let html: string;
  try { html = P.rich(text ?? '').__html; } finally { console.warn = warn; }
  const { text: noMath, errors } = stripKatex(html);
  const strictWarnings: string[] = [];
  for (const m of html.matchAll(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)) {
    const tex = decode3((m[1] ?? '').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&quot;/g, '"'));
    try { P.katex.renderToString(tex, { throwOnError: true, strict: 'error' }); } catch (e) {
      strictWarnings.push(`${String((e as Error).message).slice(0, 140)} :: ${tex.slice(0, 80)}`);
    }
  }
  const visible = decode3(
    noMath
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<\/(th|td)>/g, ' ¦ ')
      .replace(/<\/tr>/g, '\n')
      .replace(/<\/?(table|thead|tbody|tr|th|td|strong|em)\b[^>]*>/g, ''),
  );
  return { html, visible, katexErrors: errors, strictWarnings, hasTable: html.includes('<table') };
}

const ex = (s: string, at = 0, n = 110) => {
  const a = Math.max(0, at - 30);
  return (a > 0 ? '…' : '') + s.slice(a, a + n).replace(/\s+/g, ' ') + (a + n < s.length ? '…' : '');
};
const hit = (s: string, re: RegExp): { index: number; match: string } | null => {
  const m = re.exec(s);
  return m ? { index: m.index, match: m[0] } : null;
};

const RAW_LATEX_RE = /\\(?:frac|dfrac|tfrac|sqrt|times|cdot|div|pm|mp|left|right|text|mathrm|mathbf|mathit|pi|theta|alpha|beta|gamma|delta|Delta|lambda|mu|sigma|omega|Omega|phi|rho|epsilon|le|leq|ge|geq|neq|ne|approx|equiv|int|sum|prod|lim|infty|rightarrow|Rightarrow|leftarrow|to|circ|degree|overline|underline|vec|hat|bar|log|ln|sin|cos|tan|sec|csc|cot|begin|end|quad|qquad|cdots|ldots|dots|angle|triangle|perp|parallel|sim|cong|subset|cup|cap|in|notin|forall|exists|partial|nabla|ce|boxed|displaystyle|binom|[()\[\]]|,|;|!)(?![a-zA-Z])|\^\{|_\{|\\\\/;
const LITERAL_NL_RE = /\\[nrt](?![a-zA-Z])|\\n(?=[A-Z][a-z])/;
const ENTITY_RE = /&(?:[a-zA-Z]{2,8}|#\d{2,5}|#x[0-9a-fA-F]{2,5});/;
const TAG_RE = /<\/?(?:b|i|u|p|br|div|span|sub|sup|strong|em|ul|ol|li|table|tr|td|th|img|a|h[1-6]|code|pre|font|center|math|svg)\b[^<>]{0,80}>/i;
const MOJIBAKE_RE = /\u00C3[\u0080-\u00BF]|\u00E2\u20AC|\u00C2[\u00A0-\u00BF]|\uFFFD|\u00EF\u00BF\u00BD|\u00E2\u0080/;
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060\uFEFF]/;
const PLACEHOLDER_HARD_RE = /\{\{\s*[\w.$]+\s*\}\}|\[TODO\]|\bTODO\b|\[object Object\]|\bNaN\b|\blorem ipsum\b|\bTBD\b|\[insert[^\]]*\]|<placeholder>|\bXXX+\b|\$\{[a-zA-Z_]/i;
const UNDEFINED_OK_RE = /(slope|is|are|be|becomes?|was|remains?|left|expression|function|value|limit|tan|sec|csc|cot|division|quotient|derivative|term|or|and|not|as|,|:|=|it's|its)\s+["“']?undefined|undefined\s+(slope|at|for|when|because|since|value|term|terms|behavior|point|expression|there|here|or|and|if|in)\b|\bundefined[.,;)"”?]|^\s*undefined\s*$/i;
const NULL_OK_RE = /null\s+(hypothes[ie]s|set|space|result|model|distribution|vector|allele|mutation|alleles|value|case|point|curriculum|findings?|effect)|\bH0\b|\bnon-?null\b|\bnull and alternative\b|the null\b|\ba null\b|\bnull,|reject(?:ing|ed|s)? (?:the )?null|null is|null would|null was|under the null|null (?:could|can|should|must|cannot)/i;
const ENUM_RE = /^\s*\(?([A-Ea-e])[).:]\s+\S/;
const DOUBLE_ENUM_RE = /^\s*\(?[A-Ea-e][).:]\s*\(?[A-Ea-e][).:]\s/;
const LETTER_REF_RE = /\b(?:both|either|neither|only)\s+\(?[A-E]\)?\s+(?:and|or|nor|&)\s+\(?[A-E]\)?(?![a-z])|\b(?:options?|choices?|answers?)\s+\(?[A-E]\)?(?:\s*(?:,|and|or|&)\s*\(?[A-E]\)?)*(?![a-zA-Z'’])|^\s*\(?[A-E]\)?\s+(?:and|or|&)\s+\(?[A-E]\)?\s*(?:only)?\.?\s*$|^\s*[A-E],\s*[A-E](?:,?\s*(?:and|or)\s*[A-E])?\s*(?:only)?\.?\s*$/;
const ROMAN_REF_RE = /^\s*(?:I|II|III|IV)(?:\s*(?:,|and|or|&)\s*(?:I|II|III|IV))*\s*(?:only)?\.?\s*$/;
const ALL_NONE_RE = /\b(?:all|none|both|neither) of the (?:above|below|these|preceding|following)\b|\ball of these\b|\bnone of these\b/i;

/** Text-level checks on a field shown through `rich()`. */
export function checkRichField(P: Product, field: string, text: string, opts: { isKey?: boolean; completedByOptions?: boolean } = {}): { defects: Defect[]; rendered: Rendered } {
  const d: Defect[] = [];
  const push = (cls: string, severity: Severity, excerpt: string) => d.push({ cls, severity, field, excerpt });
  const r = renderRich(P, text ?? '');
  const v = r.visible;
  // A formula KaTeX cannot parse is printed as red error text — the student sees an error.
  for (const e of r.katexErrors) push('katex_parse_error', 'blocker', e.slice(0, 200));
  // With throwOnError:false an undefined command is not a katex-error block: KaTeX prints the command
  // itself in red inside the formula. The strict pass catches it; only "LaTeX-incompatible input" is cosmetic.
  if (!r.katexErrors.length) for (const w of r.strictWarnings) {
    if (/LaTeX-incompatible input/.test(w)) push('katex_strict_warning', 'minor', w);
    else push('katex_parse_error', 'blocker', w);
  }
  let h = hit(v, LITERAL_NL_RE);
  if (h) push('literal_backslash_n_or_t', 'major', ex(v, h.index));
  h = hit(v, RAW_LATEX_RE);
  if (h && !LITERAL_NL_RE.test(h.match)) push('raw_latex_shown_as_source', 'major', ex(v, h.index));
  else if (/\\/.test(v.replace(LITERAL_NL_RE, ''))) { const hb = hit(v, /\\/)!; push('literal_backslash_escape_shown', 'major', ex(v, hb.index)); }
  // `$` left in the readable text: currency ($50, $1,200.50, $x per …) is literal by design.
  const dollars = [...v.matchAll(/\$/g)].filter((m) => !/^\$\s?\d/.test(v.slice(m.index!)) && !/^\$\s?[−-]?\d/.test(v.slice(m.index!)));
  if (dollars.length) {
    const at = dollars[0]!.index!;
    const span = v.slice(at, at + 60);
    if (/^\$[^$]{0,50}[\\^_={}][^$]{0,50}\$|^\$[^$\s][^$]{0,40}\$/.test(span) || /^\$\s*[\\({]/.test(span)) push('unrendered_dollar_math', 'major', ex(v, at));
    else push('dollar_sign_before_non_number', 'minor', ex(v, at));
  }
  const srcDollars = (text.replace(/\\\$/g, '').match(/\$/g) ?? []).length;
  if (srcDollars % 2 === 1 && !dollars.length && !/\$\s?\d/.test(text)) push('unbalanced_dollar', 'major', ex(text, text.indexOf('$')));
  h = hit(v, ENTITY_RE);
  if (h) push('html_entity_shown_as_text', 'major', ex(v, h.index));
  h = hit(v, TAG_RE);
  if (h) push('html_tag_shown_as_text', 'major', ex(v, h.index));
  h = hit(v, /\*\*/);
  if (h) push('markdown_stray_bold', 'major', ex(v, h.index));
  h = hit(v, /(^|\n|\s)#{1,6}\s+\S/);
  if (h && !/#\s*\d/.test(h.match)) push('markdown_heading_shown_raw', 'major', ex(v, h.index));
  h = hit(v, /(^|[\s(])\*[^\s*][^*\n]{0,60}[^\s*]\*(?=[\s).,;:!?]|$)|(^|[\s(])_[A-Za-z][^_\n]{0,60}[A-Za-z]_(?=[\s).,;:!?]|$)|`[^`\n]+`/);
  if (h) push('markdown_emphasis_or_code_shown_raw', 'minor', ex(v, h.index));
  if (!r.hasTable && /^\s*\|.*\|\s*$/m.test(text) && (text.match(/^\s*\|.*\|\s*$/gm) ?? []).length >= 2) push('table_not_rendered', 'major', ex(text, text.search(/^\s*\|.*\|\s*$/m)));
  // Rows of "a | b | c" on separate lines that are not a markdown table: single newlines collapse, the rows run together.
  const barLines = text.split('\n').filter((l) => (l.match(/\s\|\s/g) ?? []).length >= 2);
  if (!r.hasTable && barLines.length >= 2 && !d.some((x) => x.cls === 'table_not_rendered')) push('tabular_rows_collapsed_into_one_line', 'major', ex(text, text.indexOf(barLines[0]!)));
  h = hit(text, MOJIBAKE_RE);
  if (h) push('mojibake', 'major', ex(text, h.index));
  h = hit(text, CONTROL_RE);
  if (h) push('control_character', 'minor', `U+${text.charCodeAt(h.index).toString(16).toUpperCase().padStart(4, '0')} at ${h.index}: ${ex(text, h.index, 60)}`);
  h = hit(v, PLACEHOLDER_HARD_RE);
  if (h) push('template_placeholder', 'major', ex(v, h.index));
  // "undefined" / "null" are ordinary words in maths and statistics; only a field that IS the word
  // (or repeats it the way a failed template does) is a placeholder. A key of "undefined" is a real answer.
  if (field === 'question' && /^\s*(?:undefined|null)\s*$/i.test(v)) push('placeholder_word_as_whole_field', 'major', v.trim());
  else if (/\bundefined\b[\s,;:/|-]*\bundefined\b|\bnull\b[\s,;:/|-]*\bnull\b|\[(?:undefined|null)\]|\((?:undefined|null)\)/i.test(v)) push('placeholder_word_repeated', 'major', ex(v, v.search(/undefined|null/i)));
  void UNDEFINED_OK_RE; void NULL_OK_RE;
  if (/ {2,}/.test(text.trim()) && !r.hasTable) push('double_space', 'minor', ex(text, text.search(/ {2,}/)));
  if (text !== text.trim()) push('leading_or_trailing_whitespace', 'minor', JSON.stringify(text.slice(0, 12)) + '…' + JSON.stringify(text.slice(-12)));
  // A stem that ends in a dash / "to" is completed by its options; only a typed item's text may not trail off.
  h = hit(text.trim(), opts.completedByOptions ? /[\\(\[{]$/ : /(?:[\\,(\[{]|\s[-–—]|\b(?:and|or|the|of|to|a)\s*)$/i);
  if (h) push('trailing_junk_or_truncated', 'minor', ex(text.trim(), Math.max(0, text.trim().length - 60)));
  // Single newlines collapse to a space in rich(): a multi-line list / data block runs together.
  if (!r.hasTable && /[^\n]\n[^\n]/.test(text.trim())) push('line_breaks_collapsed', 'minor', ex(text, text.search(/[^\n]\n[^\n]/)));
  h = hit(v, /[A-Za-z0-9)\]]\^[A-Za-z0-9({\-−]|\bsqrt\(|<=|>=|!=|\b\d+\s?\*\s?\d+|\b[a-z]_\d\b/);
  if (h) push('ascii_math_notation', 'minor', ex(v, h.index));
  if (!opts.isKey && v.trim() === '') push('renders_empty', 'blocker', JSON.stringify(text.slice(0, 60)));
  return { defects: d, rendered: r };
}

/** A hint is rendered as plain React text (`Hint: {it.hints[0]}`) — no maths, no bold. */
export function checkPlainField(field: string, text: string): Defect[] {
  const d: Defect[] = [];
  const push = (cls: string, severity: Severity, excerpt: string) => d.push({ cls, severity, field, excerpt });
  let h = hit(text, /\$[^$\n]*[\\^_{=][^$\n]*\$|\$\$|\$[A-Za-z]\$|\$\d*[a-zA-Z][^$\n]{0,20}\$/) ?? hit(text, RAW_LATEX_RE);
  if (h) push('hint_shown_as_raw_math_source', 'major', ex(text, h.index));
  h = hit(text, /\*\*[^*]+\*\*/);
  if (h) push('hint_markdown_shown_raw', 'minor', ex(text, h.index));
  h = hit(text, LITERAL_NL_RE);
  if (h) push('literal_backslash_n_or_t', 'major', ex(text, h.index));
  h = hit(text, ENTITY_RE);
  if (h) push('html_entity_shown_as_text', 'major', ex(text, h.index));
  h = hit(text, TAG_RE);
  if (h) push('html_tag_shown_as_text', 'major', ex(text, h.index));
  h = hit(text, MOJIBAKE_RE);
  if (h) push('mojibake', 'major', ex(text, h.index));
  h = hit(text, CONTROL_RE);
  if (h) push('control_character', 'minor', `U+${text.charCodeAt(h.index).toString(16).toUpperCase().padStart(4, '0')}: ${ex(text, h.index, 60)}`);
  h = hit(text, PLACEHOLDER_HARD_RE);
  if (h) push('template_placeholder', 'major', ex(text, h.index));
  if (text.trim() === '') push('hint_empty', 'minor', '');
  return d;
}

/* ------------------------------------------------------------------ */
/* Self-containment                                                    */
/* ------------------------------------------------------------------ */

const VIS = '(?:figure|diagram|graph|chart|table|map|image|picture|cartoon|photograph|photo|illustration|scatterplot|scatter plot|histogram|boxplot|box plot|dotplot|dot plot|stemplot|bar graph|pie chart|number line|circuit|free[- ]body diagram|pedigree|cladogram|phylogenetic tree|food web|timeline|drawing|sketch)';
const TXT = '(?:passage|excerpt|document|poem|stanza|quotation|speech|letter|article|text|source|paragraph)';
interface RefRule { kind: 'figure' | 'table' | 'data' | 'passage' | 'deictic'; strength: 'location' | 'definite'; re: RegExp }
const REF_RULES: RefRule[] = [
  // "location" references point at a place on the page: something must be there.
  { kind: 'figure', strength: 'location', re: new RegExp(`\\b(?:shown|pictured|depicted|displayed|illustrated|drawn|graphed|plotted|given|provided|seen)\\s+(?:above|below|here|at (?:the )?(?:left|right)|to the (?:left|right)|in the (?:accompanying |following )?${VIS})\\b|\\b${VIS}\\s+(?:above|below|shown|pictured|at (?:the )?(?:right|left))\\b|\\b(?:above|below|following|accompanying|attached)\\s+${VIS}\\b|\\bas\\s+shown\\b(?!\\s+(?:by|that|in (?:the )?(?:text|previous|preceding)))|\\bsee\\s+(?:the\\s+)?${VIS}\\b|\\bfigure\\s+\\d\\b|\\b(?:reaction|structure|molecule|compound|triangle|rectangle|circle|polygon|quadrilateral|shape|curve|region|parabola|apparatus|setup|trapezoid|prism|cylinder|cone|solid)s?\\s+(?:shown|pictured|depicted)\\b`, 'i') },
  { kind: 'passage', strength: 'location', re: new RegExp(`\\b${TXT}\\s+(?:above|below)\\b|\\b(?:above|below|following|accompanying|attached)\\s+(?:passage|excerpt|document|poem|quotation|speech|letter|article|text)\\b|\\b(?:in|from)\\s+(?:lines?|paragraphs?)\\s+\\d|\\b(?:lines?|paragraphs?)\\s+\\d+\\s*[-–—]\\s*\\d+\\b|\\bDocument\\s+[1-9]\\b|\\bSource\\s+[A-G]\\b|\\b(?:the|this) passage\\b|\\b(?:the|this) excerpt\\b|\\baccording to the (?:author|speaker|writer|passage|excerpt|document|article)\\b`, 'i') },
  { kind: 'data', strength: 'location', re: /\b(?:data|values|results|measurements|scores|information)\s+(?:shown|given|listed|provided|displayed)?\s*(?:above|below|in the table)\b|\bthe\s+following\s+(?:data|values|measurements|scores|data set|dataset|sample|observations|distribution)\b|\b(?:computer|regression|calculator|software)\s+output\b/i },
  // "definite" references name a visual as if the student can see it; fine when the text describes it.
  { kind: 'table', strength: 'definite', re: /\b(?:the|this)\s+(?:two-way |frequency |data |contingency )?table\b(?!\s+of\s+(?:ranks|contents|elements))|\b(?:a|the)\s+(?:two-way |frequency |data |contingency )?table\s+(?:shows|gives|lists|displays|summarizes)\b|\bfrom the table\b/i },
  { kind: 'figure', strength: 'definite', re: /\b(?:the|this)\s+(?:graph|chart|diagram|map|cartoon|photograph|illustration|scatterplot|scatter plot|histogram|boxplot|box plot|dotplot|dot plot|stemplot|bar graph|pie chart|pedigree|cladogram|food web)\b(?!\s+of\s+(?:the\s+)?(?:\$|[a-zA-Z]\b|function|equation|line|parabola|inequality|derivative|relation|polynomial|system))/i },
  { kind: 'passage', strength: 'definite', re: /\b(?:this)\s+(?:document|poem|speech|letter|article|text|source|paragraph|essay|quotation)\b/i },
  { kind: 'deictic', strength: 'definite', re: /\b(?:shown|given|listed|described|presented|provided|stated)\s+(?:above|below)\b|\b(?:the\s+)?(?:above|below)\s+(?:equation|reaction|expression|statement|scenario|situation|information|argument|sentence|claim|example|system|inequality|function|problem|question)\b|\bsee\s+(?:above|below)\b|\bthe\s+following\s+(?:equation|reaction|expression|statements?|scenario|sentences?|system|inequalit(?:y|ies)|functions?|sequence|list|argument|claim|steps?|pairs?|sets?|compounds?|molecules?|events?|quotation|quote)\b/i },
];

export interface RefFinding { kind: RefRule['kind']; phrase: string; status: 'missing' | 'inline'; why: string }

/** Spans of the text that are quotations (the reference is being quoted, not made). */
function quotedSpans(q: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const m of q.matchAll(/["“][^"”]{8,}["”]|(?<![A-Za-z])'[^'\n]{25,}'(?![A-Za-z])/g)) out.push([m.index!, m.index! + m[0].length]);
  return out;
}

/** Is the thing the text points at actually present in the text the student gets? */
export function selfContainment(P: Product, it: Item, rq: Rendered): RefFinding[] {
  const q = it.question;
  const out: RefFinding[] = [];
  const quotes = quotedSpans(q);
  const inQuote = (i: number) => quotes.some(([a, b]) => i >= a && i < b);
  const numbers = (q.match(/-?\d+(?:\.\d+)?/g) ?? []).length;
  const longQuote = quotes.some(([a, b]) => b - a >= 60) || /(?:^|\n)\s*>\s?\S/.test(q);
  const listData = /(?:-?\d+(?:\.\d+)?\s*[,;]\s*){3,}-?\d/.test(q) || /\{[^{}]*\d[^{}]*,[^{}]*\}/.test(q) || /(?:\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)[\s,;and]*){2,}/.test(q) || (q.match(/[=→:]\s*-?\$?\d/g) ?? []).length >= 3;
  const pipeRows = (q.match(/\|/g) ?? []).length >= 4;
  const tabular = rq.hasTable || pipeRows || ((q.match(/\n/g) ?? []).length >= 2 && numbers >= 4);
  const periodic = /\bperiodic\b|\bPeriod \d|\bGroup \d+/i.test(q);
  const geometryImage = /\b(?:translat|reflect|rotat|dilat|transform|preimage|pre-image|maps?\b)/i.test(q);
  const seen = new Set<string>();
  for (const rule of REF_RULES) {
    const re = new RegExp(rule.re.source, 'gi');
    let m: RegExpExecArray | null = null;
    for (let c = re.exec(q); c; c = re.exec(q)) { if (!inQuote(c.index)) { m = c; break; } }
    if (!m) continue;
    const phrase = m[0].trim();
    if (rule.kind === 'table' && (periodic || /\b(?:on|at|across|around|under|off|to)\s+the\s+table\b/i.test(q.slice(Math.max(0, m.index - 12), m.index + phrase.length)) || /table\s+(?:went|was set|is set)/i.test(q.slice(m.index, m.index + 40)))) continue;
    if (/\b(?:image|figure)\b/i.test(phrase) && geometryImage && rule.strength === 'definite') continue;
    if (seen.has(rule.kind)) continue;
    seen.add(rule.kind);
    const before = q.slice(0, m.index).trim();
    const after = q.slice(m.index + m[0].length).trim();
    const noun = (phrase.match(new RegExp(`${VIS}|${TXT}|table`, 'i')) ?? [''])[0].toLowerCase();
    const introduced = noun !== '' && new RegExp(`\\b(?:an?|one|two|three|each|every|some|its|his|her|their)\\s+(?:[\\w-]+\\s+){0,4}${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i').test(q);
    let status: RefFinding['status'] = 'missing'; let why = 'nothing in the text supplies it; the practice card shows text only';
    const set = (w: string) => { status = 'inline'; why = w; };
    if (rule.kind === 'passage') {
      if (longQuote) set('a quoted passage (60+ characters) is in the text');
      else if (quotes.length >= 1 && rule.strength === 'definite') set('the quoted line is in the text');
      else if (quotes.length >= 2) set('the quoted lines are in the text');
      else if (quotes.length >= 1 && after.length + before.length >= 40) set('the quoted text is in the question');
      else if (introduced && before.length >= 60) set('the text is described in the question (introduced with a/an before the reference)');
      else if (before.length >= 150) set('the material is given before the reference');
      else if (rule.strength === 'definite' && (before.length >= 120 || after.length >= 150)) set('the material is given in the question');
      else if (/\bSource\s+[A-G]\b|\bDocument\s+\d/i.test(phrase) && q.length > 250) set('the source is summarised in the question');
    } else if (rule.kind === 'deictic') {
      if (/following|below/i.test(phrase) && (after.length > 20 || it.choices.length > 0)) set('the referenced material follows in the text / options');
      else if (/above/i.test(phrase) && before.length > 60) set('the referenced material precedes the reference');
    } else if (rule.kind === 'data') {
      if (tabular || listData || numbers >= 5) set('the data values are listed in the text');
      else if (/following/i.test(phrase) && it.choices.length > 0) set('"the following" points at the answer options');
    } else {
      // figure / table: a text-only card can stand in for a visual only by describing it.
      const hasNoun = new RegExp(VIS, 'i').test(phrase);
      if (rq.hasTable) set('a markdown table is rendered in the question');
      else if (!hasNoun && /below|following/i.test(phrase) && it.choices.length > 0) set('the material referred to is the answer options');
      else if (/^an?\s/i.test(phrase)) set('a hypothetical visual, described in the sentence');
      else if (rule.strength === 'definite' && (before.length >= 40 || before.length + after.length >= 200)) set('the visual is described in words in the question');
      else if (tabular || listData) set('the values the visual would show are listed in the text');
      else if (introduced && (numbers >= 2 || before.length + after.length >= 120)) set('the visual is described in words in the question');
      else if (rule.strength === 'definite' && before.length >= 100) set('the material is described before the reference');
      else if (rule.strength === 'definite' && /^(?:a|the)\s+(?:[\w-]+\s+)?table\s+(?:shows|gives|lists|displays|summarizes)/i.test(phrase) && numbers >= 3) set('the table is given as values in the sentence');
    }
    out.push({ kind: rule.kind, phrase: phrase.slice(0, 80), status, why });
  }
  // An internal passage id written into the question ("Using the passage evelyn.passage.….v1"): the student never gets that passage.
  const idRef = /\b[a-z]+\.passage\.[a-z0-9.-]+\b/i.exec(q);
  // Stimulus passage attached by id: the grader receives it, the practice card does not.
  for (const pid of new Set([...it.passageIds, ...(idRef ? [idRef[0]] : [])])) {
    const p = P.resolvePassage(pid);
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    let status: RefFinding['status'] = 'missing'; let why = `passage ${pid} is attached for the grader but is not part of the practice payload`;
    if (idRef && idRef[0] === pid) why = `the question names passage ${pid} by its internal id; the practice card never shows the passage`;
    else if (p) {
      const quoted = quotes.map(([a, b]) => norm(q.slice(a, b)));
      const full = norm(p.fullText);
      const hitQ = quoted.filter((s) => s.length >= 12 && full.includes(s.slice(0, 50)));
      if (hitQ.length > 0) { status = 'inline'; why = `the question quotes the lines it asks about (${hitQ.length} quote${hitQ.length === 1 ? '' : 's'} from "${p.title}")`; } else if (quotes.some(([a, b]) => b - a >= 40)) { status = 'inline'; why = 'the question carries its own quotation'; } else if (!/\b(?:passage|excerpt|text|author|speaker|lines?|paragraph|speech|document|source)\b/i.test(q) && out.every((o) => o.status !== 'missing')) { status = 'inline'; why = 'the question does not refer to the passage text'; }
    } else why = `passage id ${pid} does not resolve in the engine passage store`;
    out.push({ kind: 'passage', phrase: `passageId ${pid}`, status, why });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Normalisation / duplicates                                          */
/* ------------------------------------------------------------------ */

/** Comparison form of a text: whitespace, dash style, maths delimiters and markdown removed. CASE and
 *  primes are kept (X^C vs X^c, f(x) vs f'(x), BB vs Bb are different things). */
export const normText = (s: string): string =>
  (s ?? '').replace(/[−–—]/g, '-').replace(/\$|\\[()[\]]|\\left|\\right/g, '').replace(/[“”]/g, '"').replace(/[’‘]/g, "'").replace(/\*\*/g, '').replace(/\s+/g, ' ').replace(/\s*([=+\-*/^(),:;?])\s*/g, '$1').trim().replace(/[.?:]+$/, '');

export function levenshteinWithin(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = new Array(b.length + 1); let cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i; let rowMin = cur[0];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}

/* ------------------------------------------------------------------ */
/* Structure + key acceptance                                          */
/* ------------------------------------------------------------------ */

const UNIT_TAIL_RE = /^\s*(?:°\s?[CFK]?|%|[a-zA-Zµμ°Ω]{1,12}(?:\s?[·⋅*/.-]\s?[a-zA-Zµμ°Ω]{1,8}){0,3}(?:\s?(?:\^?-?\d|[²³⁻¹]+))?(?:\s?\/\s?[a-zA-Zµμ]{1,8}(?:\^?\d|[²³])?)?|(?:square|cubic|sq\.?)\s+[a-z]+|[a-z]+\s+(?:per|squared|cubed)\s*[a-z]*)\s*\.?\s*$/;
const UNIT_WORDS = 'meters?|metres?|centimeters?|centimetres?|millimeters?|kilometers?|inches|inch|feet|foot|yards?|miles?|seconds?|minutes?|hours?|days?|years?|grams?|kilograms?|milligrams?|pounds?|ounces?|liters?|litres?|milliliters?|moles?|mol|newtons?|joules?|kilojoules?|watts?|volts?|amperes?|amps?|ohms?|pascals?|atm|kelvins?|degrees?|radians?|percent|dollars?|cents|units?|square units|cubic units|m\\/s\\^?2|m\\/s²|m\\/s|km\\/h|mph|cm|mm|km|kg|mg|mL|kJ|kPa|nm|Hz|N|J|W|V|A|K|L|g|m|s';
const ASKED_UNIT_RE = new RegExp(`\\b(?:in|to the nearest|express(?:ed)? (?:your answer )?in|answer in|measured in|give your answer in)\\s+((?:${UNIT_WORDS}))(?![a-zA-Z])`);
const SOLVE_VAR_RE = /\b(?:solve(?:\s+the\s+equation)?(?:\s+for)?|find(?:\s+the\s+value\s+of)?|what\s+is(?:\s+the\s+value\s+of)?|determine(?:\s+the\s+value\s+of)?|value\s+of)\s+\$?([a-zA-Z])\$?(?=\s*[.:?,;]|\s+(?:if|when|in|such|that|for|given|so)\b|\s*$)/;

export interface KeyVariant { name: string; answer: string }
export function keyVariants(P: Product, it: Item): KeyVariant[] {
  const key = it.key ?? '';
  const out: KeyVariant[] = [{ name: 'key', answer: key }, { name: 'surrounding_spaces', answer: `  ${key}  ` }];
  const plain = P.engineParseNumericKey(key);
  const q = it.question;
  if (plain) {
    const v = SOLVE_VAR_RE.exec(q)?.[1] ?? (/\bsolve\b/i.test(q) && /\bx\b/.test(q) ? 'x' : undefined);
    if (v) out.push({ name: 'var_equals_key', answer: `${v} = ${key.trim()}` });
    const u = ASKED_UNIT_RE.exec(q)?.[1];
    if (u) out.push({ name: 'key_with_stated_unit', answer: `${key.trim()} ${u}` });
    if (/^\s*-?\$?\d+\.\d+\s*$/.test(key)) out.push({ name: 'comma_decimal', answer: key.trim().replace('.', ',') });
    out.push({ name: 'trailing_full_stop', answer: `${key.trim()}.` });
  } else {
    const m = key.trim().match(/^(-?\$?\d+(?:\.\d+)?(?:\s*\/\s*-?\d+)?)\s*(.+)$/);
    if (m && UNIT_TAIL_RE.test(m[2] ?? '')) out.push({ name: 'key_without_its_unit', answer: m[1]!.trim() });
    const eq = key.trim().match(/^([a-zA-Z])\s*=\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)$/);
    if (eq) out.push({ name: 'bare_value_of_var_key', answer: eq[2]! });
    if (/[A-Z]/.test(key) || /[a-z]/.test(key)) out.push({ name: 'lowercased', answer: key.toLowerCase() });
    if (/\s/.test(key.trim())) out.push({ name: 'no_inner_spaces', answer: key.trim().replace(/\s+/g, '') });
  }
  return out;
}

export class JudgeNeeded extends Error { constructor(public which: 'rubric' | 'single') { super('judge'); } }
const JUDGE_DEPS = {
  async gradeRubricPart() { throw new JudgeNeeded('rubric'); },
  async judgeSingleAnswer() { throw new JudgeNeeded('single'); },
};

export type Verdict = 'correct' | 'incorrect' | 'judge' | 'judge-rubric' | 'n/a';

/** The engine's /grade decision for a typed answer, offline: deterministic rule or "judge". */
export async function engineVerdict(P: Product, gradeItem: any, answer: string): Promise<Verdict> {
  try {
    const r = await P.engineGradeFreeResponse({ studentId: 'offline', itemId: gradeItem.itemId, response: { text: answer } }, gradeItem, JUDGE_DEPS);
    return r.maxPoints > 0 && r.totalPoints >= r.maxPoints ? 'correct' : 'incorrect';
  } catch (e) {
    if (e instanceof JudgeNeeded) return e.which === 'rubric' ? 'judge-rubric' : 'judge';
    throw e;
  }
}

export interface KeyAcceptance {
  uiPath: UiPath;
  /** variant → verdict per grader. */
  variants: Array<{ name: string; answer: string; web: Verdict; api: Verdict; engine: Verdict }>;
  mcq?: { webKeyId?: string; apiKeyId?: string; engineKeyId?: string; flagged: number; perChoice: Array<{ id: string; web: boolean; api: boolean }> };
  judgeGraded: boolean;
  judgeKind?: 'rubric' | 'single-answer' | 'numeric-key-nonnumeric-answer-only';
}

const b2v = (b: boolean | null | undefined): Verdict => (b === true ? 'correct' : b === false ? 'incorrect' : 'n/a');

/** `gradeItem` = what the engine's resolveGradeItem returns for the id (or an equivalent built from the payload). */
export async function keyAcceptance(P: Product, it: Item, gradeItem: any | null, assessmentKey: any | null): Promise<{ acc: KeyAcceptance; defects: Defect[] }> {
  const d: Defect[] = [];
  const uiPath = uiPathOf(it);
  const served = { id: it.id, problemText: it.question, responseFormat: it.format, expectedAnswer: it.key, choices: it.choices.length ? it.choices : undefined };
  const acc: KeyAcceptance = { uiPath, variants: [], judgeGraded: false };
  if (uiPath === 'mcq') {
    const webKeyId = P.correctChoiceIdOf(served);
    const flagged = it.choices.filter((c) => c.correct).length;
    const perChoice = it.choices.map((c) => ({ id: c.id, web: P.isChoiceCorrect(c.id, webKeyId), api: P.apiGradeItem({ ...served, responseFormat: 'mcq' }, c.id).correct === true }));
    const apiKeyIds = perChoice.filter((c) => c.api).map((c) => c.id);
    const webKeyIds = perChoice.filter((c) => c.web).map((c) => c.id);
    acc.mcq = { webKeyId, apiKeyId: apiKeyIds.join('|') || undefined, engineKeyId: assessmentKey?.correctChoiceId, flagged, perChoice };
    const keyTxt = `key=${JSON.stringify(it.key ?? null)} options=${JSON.stringify(it.choices.map((c) => `${c.id}${c.correct ? '*' : ''}:${c.text}`)).slice(0, 220)}`;
    if (webKeyIds.length !== 1) d.push({ cls: 'mcq_no_single_keyed_option_onscreen', severity: 'blocker', field: 'key', excerpt: `on-screen rule keys ${webKeyIds.length} options; ${keyTxt}` });
    if (apiKeyIds.length !== 1) d.push({ cls: 'mcq_no_single_keyed_option_stored_grade', severity: 'blocker', field: 'key', excerpt: `stored-grade rule keys ${apiKeyIds.length} options; ${keyTxt}` });
    if (webKeyIds.length === 1 && apiKeyIds.length === 1 && webKeyIds[0] !== apiKeyIds[0]) d.push({ cls: 'mcq_onscreen_and_stored_grade_disagree', severity: 'blocker', field: 'key', excerpt: `on-screen ${webKeyIds[0]} vs stored ${apiKeyIds[0]}; ${keyTxt}` });
    if (assessmentKey && webKeyIds.length === 1 && (assessmentKey.correctChoiceId ?? '').toLowerCase() !== webKeyIds[0]!.toLowerCase()) d.push({ cls: 'mcq_engine_key_differs_from_app_key', severity: 'blocker', field: 'key', excerpt: `engine ${assessmentKey.correctChoiceId ?? 'none'} vs app ${webKeyIds[0]}; ${keyTxt}` });
    if (flagged > 1) d.push({ cls: 'mcq_multiple_options_flagged_correct', severity: 'blocker', field: 'choices', excerpt: keyTxt });
    if (it.format !== 'mcq') d.push({ cls: 'choices_on_non_mcq_format', severity: 'major', field: 'format', excerpt: `responseFormat=${it.format}; the drill shows options but the attempt is not stored for frq/free` });
    return { acc, defects: d };
  }
  const key = it.key ?? '';
  const judgeDecidesKey = async (ans: string): Promise<Verdict> => (gradeItem ? engineVerdict(P, gradeItem, ans) : 'n/a');
  for (const v of keyVariants(P, it)) {
    const web = uiPath === 'numeric-client' ? b2v(P.numericMatch(key, v.answer)) : b2v(P.webNumericVerdict(key, v.answer));
    const api = uiPath === 'numeric-client' ? b2v(P.apiGradeItem({ ...served, responseFormat: 'numeric' }, v.answer).correct === true) : b2v(P.apiNumericVerdict(key, v.answer));
    const engine = await judgeDecidesKey(v.answer);
    acc.variants.push({ name: v.name, answer: v.answer, web, api, engine });
  }
  const k = acc.variants[0]!;
  if (uiPath === 'numeric-client') {
    if (k.web !== 'correct') d.push({ cls: 'key_rejected_onscreen', severity: 'blocker', field: 'key', excerpt: `typing the stored key ${JSON.stringify(key)} is marked "Not quite" by the drill` });
    if (k.api !== 'correct') d.push({ cls: 'key_rejected_by_stored_grade', severity: 'blocker', field: 'key', excerpt: `typing the stored key ${JSON.stringify(key)}: drill ${k.web === 'correct' ? 'shows Correct' : 'shows Not quite'} but the stored attempt / feed records it wrong (key is not a number the api rule reads)` });
    const eng = P.engineGradeNumeric(key, key);
    if (!eng.decided || !eng.correct) d.push({ cls: 'numeric_item_key_not_a_plain_number', severity: 'major', field: 'key', excerpt: `key ${JSON.stringify(key)} on a numeric-format item is not a plain number for the engine rule (${eng.decided ? 'rejected' : 'not decided'})` });
  } else {
    if (!gradeItem) d.push({ cls: 'grade_item_unresolvable', severity: 'blocker', field: 'id', excerpt: 'the engine cannot resolve this id to an answer key (grade endpoint → 404)' });
    else if (k.engine === 'incorrect') d.push({ cls: 'key_rejected_by_engine_rule', severity: 'blocker', field: 'key', excerpt: `the engine numeric rule rejects the stored key ${JSON.stringify(key)} typed as the answer` });
    else if (k.engine === 'judge-rubric') { acc.judgeGraded = true; acc.judgeKind = 'rubric'; } else if (k.engine === 'judge') { acc.judgeGraded = true; acc.judgeKind = 'single-answer'; } else if (k.engine === 'correct') acc.judgeKind = 'numeric-key-nonnumeric-answer-only';
    if (k.engine === 'correct' && k.api === 'incorrect') d.push({ cls: 'numeric_mirror_disagrees_on_key', severity: 'major', field: 'key', excerpt: `engine accepts key ${JSON.stringify(key)}, academy mirror rejects it` });
  }
  return { acc, defects: d };
}

export function structureChecks(P: Product, it: Item): Defect[] {
  const d: Defect[] = [];
  const push = (cls: string, severity: Severity, field: string, excerpt: string) => d.push({ cls, severity, field, excerpt });
  const uiPath = uiPathOf(it);
  const key = (it.key ?? '').trim();
  if (!it.question || !it.question.trim()) push('empty_question', 'blocker', 'question', '');
  if (it.format === 'mcq' && it.choices.length === 0) push('mcq_without_options', 'blocker', 'choices', `key=${JSON.stringify(key)} — the drill shows a text box and compares with the key letter`);
  if (uiPath === 'mcq') {
    const texts = it.choices.map((c) => normText(c.text));
    if (it.choices.length < 2) push('mcq_fewer_than_two_options', 'blocker', 'choices', JSON.stringify(it.choices.map((c) => c.text)));
    it.choices.forEach((c, i) => { if (!c.text || !c.text.trim()) push('mcq_empty_option', 'blocker', `choice:${c.id}`, `option ${i + 1} is empty`); });
    const seen = new Map<string, string>();
    it.choices.forEach((c, i) => {
      const t = texts[i]!;
      if (seen.has(t)) push('mcq_identical_options', 'blocker', `choice:${c.id}`, `options ${seen.get(t)} and ${c.id} are the same after normalisation: ${JSON.stringify(c.text).slice(0, 120)}`);
      else seen.set(t, c.id);
    });
    const ids = it.choices.map((c) => c.id);
    if (new Set(ids.map((x) => x.toLowerCase())).size !== ids.length) push('mcq_duplicate_option_ids', 'blocker', 'choices', ids.join(','));
    const flagged = it.choices.find((c) => c.correct);
    if (flagged && key && !/^[A-E]$/i.test(key)) {
      const a = normText(flagged.text); const b = normText(key);
      if (a !== b && !a.includes(b) && !b.includes(a)) push('mcq_flagged_option_differs_from_key_text', 'major', 'key', `flagged option ${JSON.stringify(flagged.text).slice(0, 90)} vs expectedAnswer ${JSON.stringify(key).slice(0, 90)}`);
    }
    if (/^[A-E]$/i.test(key)) {
      const idx = key.toUpperCase().charCodeAt(0) - 65;
      if (!it.choices.some((c) => c.id.toUpperCase() === key.toUpperCase())) push('mcq_key_letter_has_no_option', 'blocker', 'key', `key ${key} but options are ${ids.join(',')}`);
      void idx;
    }
    it.choices.forEach((c, i) => {
      if (DOUBLE_ENUM_RE.test(c.text)) push('option_duplicated_enumerator', 'major', `choice:${c.id}`, c.text.slice(0, 80));
      else {
        const m = ENUM_RE.exec(c.text);
        if (m) {
          const pos = String.fromCharCode(65 + i);
          if (m[1]!.toUpperCase() !== pos) push('option_enumerator_differs_from_position', 'major', `choice:${c.id}`, `option ${i + 1} (position ${pos}) starts with "${m[1]}": ${c.text.slice(0, 70)}`);
          else push('option_text_starts_with_enumerator', 'minor', `choice:${c.id}`, c.text.slice(0, 80));
        }
      }
      // "A and B only" is a letter reference only when B, C… are not things the question itself talks about (blood type B, point C).
      const lettersUsed = (c.text.match(/\b[B-E]\b/g) ?? []);
      if (LETTER_REF_RE.test(c.text) && !lettersUsed.some((l) => new RegExp(`\\b${l}\\b`).test(it.question))) push('option_refers_to_option_letters_not_shown', 'major', `choice:${c.id}`, `the drill shows no A/B/C/D labels: ${c.text.slice(0, 80)}`);
      if (ROMAN_REF_RE.test(c.text) && it.choices.filter((x) => ROMAN_REF_RE.test(x.text)).length >= 2 && !/\bI{1,3}[.)]\s|\bI\.\s|\(I\)|\bIV[.)]/.test(it.question)) push('option_refers_to_roman_statements_not_in_question', 'major', `choice:${c.id}`, c.text.slice(0, 80));
      if (ALL_NONE_RE.test(c.text)) push('all_or_none_of_the_above_option', 'info', `choice:${c.id}`, `position ${i + 1} of ${it.choices.length} (order is fixed, the drill does not shuffle): ${c.text.slice(0, 60)}`);
    });
    if (/\b(?:option|choice|answer)s?\s+\(?[A-E]\)?(?![a-zA-Z'’])|\bwhich of (?:A|B|C|D)\b/.test(it.question)) push('question_refers_to_option_letters_not_shown', 'major', 'question', ex(it.question, it.question.search(/\b(?:option|choice|answer)s?\s+\(?[A-E]\)?/)));
    return d;
  }
  // typed
  if (!key && !(it.rubric && it.rubric.parts?.length)) push('no_key_and_no_rubric', 'blocker', 'key', `responseFormat=${it.format}: nothing to grade against`);
  if (key && /^(?:n\/?a|none|null|undefined|nan|tbd|todo|\?+|-+|answer|see solution|varies|answers? (?:may|will) vary.*)$/i.test(key)) push('placeholder_key', 'blocker', 'key', JSON.stringify(key));
  if (uiPath === 'numeric-client' && key) {
    const plain = P.engineParseNumericKey(key);
    if (!plain) {
      const lead = key.match(/^(-?\$?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*-?\d+(?:\.\d+)?)?)\s*(%?)(.*)$/s);
      const webNum = P.webNumericVerdict(key, key);
      if (webNum === null) push('numeric_item_text_key_exact_match_only', 'blocker', 'key', `key ${JSON.stringify(key.slice(0, 80))} is not read as a number: only the exact same text is accepted on screen, and the stored grade is always wrong`);
      else if (lead) {
        const tail = (lead[3] ?? '').trim();
        if (/,/.test(lead[1]!) && !/^-?\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(lead[1]!)) push('numeric_key_comma_read_as_thousands', 'blocker', 'key', `key ${JSON.stringify(key)} — the grader deletes commas and reads one number`);
        else if (tail === '' ) { /* "50%" etc. */ } else if (UNIT_TAIL_RE.test(tail)) push('numeric_key_carries_units', 'minor', 'key', `key ${JSON.stringify(key)} — only the leading number is compared; any or no unit is accepted`);
        else push('numeric_key_only_leading_number_is_graded', 'blocker', 'key', `key ${JSON.stringify(key.slice(0, 80))} — the grader reads only the leading number, so partial or different answers that start with it are marked correct`);
      }
    }
  }
  // units
  if (key) {
    const m = key.match(/^-?\$?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?\s*(?:[x×]\s*10\^?-?\d+\s*)?([A-Za-zµμ°Ω%][^\d=]{0,18})$/);
    const asked = ASKED_UNIT_RE.exec(it.question)?.[1];
    if (m && UNIT_TAIL_RE.test(m[1]!) && m[1]!.trim() !== '%') {
      const unit = m[1]!.trim().replace(/\.$/, '');
      const qn = it.question.toLowerCase();
      const first = unit.split(/[\s/·⋅^]/)[0]!.toLowerCase();
      const LONG: Record<string, string> = { m: 'met', cm: 'centim', mm: 'millim', km: 'kilom', s: 'second', g: 'gram', kg: 'kilogram', n: 'newton', j: 'joule', w: 'watt', v: 'volt', a: 'amp', l: 'lit', ml: 'millil', mol: 'mol', k: 'kelvin', '°': 'degree', '°c': 'celsius', hz: 'hertz', pa: 'pascal', ft: 'f', in: 'inch', h: 'hour', min: 'minute' };
      const mentioned = new RegExp(`(?:\\d|\\b)\\s?${first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`, 'i').test(it.question) || (LONG[first] ? qn.includes(LONG[first]!) : qn.includes(first));
      if (!mentioned && first.length <= 12) push('key_has_unit_not_stated_in_question', 'minor', 'key', `key ${JSON.stringify(key)}; the unit "${unit}" does not appear in the question`);
    } else if (asked && P.engineParseNumericKey(key)) {
      push('question_states_unit_key_is_bare_number', 'info', 'key', `question asks "${asked}", key ${JSON.stringify(key)}`);
    }
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Language / white-label scan                                         */
/* ------------------------------------------------------------------ */

const PROFANITY_RE = /\b(?:fuck\w*|shit\w*|bitch\w*|asshole\w*|bastard\w*|cunt\w*|dick(?:head|s)?|piss(?:ed|ing)?|slut\w*|whore\w*|nigg\w*|fag(?:got)?s?|retard(?:ed|s)?|crap(?:py)?|damn(?:ed)?|bullshit|wtf|sexy|porn\w*)\b/i;
const BRAND_RE = /\b(?:crimsora|kanzoo|gameclass|game class|evelyn\s?tutor|evelyn\s?learning|evelyn\s?academy|evelynedu|stayfari|solaro|castle rock|steminnokey|anqa)\b/i;
const EVELYN_RE = /\bevelyn\b/i;
const VENDOR_HARD_RE = /\b(?:anthropic|openai|chatgpt|gpt-?[345]\w*|deepseek|cartesia|as an ai\b|language model|llm\b|ai[- ]generated|generated by ai|claude(?:\s+(?:sonnet|haiku|opus|\d))|sonnet\s?\d|haiku\s?\d|opus\s?\d)\b/i;
const VENDOR_SOFT_RE = /\b(?:claude|gemini|copilot|llama|mistral)\b/i;
const INTERNAL_ID_RE = /\b(?:gen|rev|freestyle)-[0-9a-f]{8}-[0-9a-f]{4}\b|\bpractice-gen\.|\bbrain-gen\.|\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b|\b[0-9a-f]{24}\b|\bevelyn\.[a-z]+\.[a-z0-9.-]+\.v\d\b|\b(?:alg1|alg2|geom|bio|chem|apstats|apcalc\w*|apush|apwh|apgov|apes|appsych|apmacro|apenglang|hseng|wh|phys)\.[a-z0-9]+(?:-[a-z0-9]+)+\b|\blo-\d+(?:-try\d*)?\b|\btry-\d+\b|\bloId\b|\bLO\s?\d+\.\d+\b/i;

export function languageScan(field: string, visible: string): Defect[] {
  const d: Defect[] = [];
  const push = (cls: string, severity: Severity, at: number) => d.push({ cls, severity, field, excerpt: ex(visible, at) });
  let h = hit(visible, PROFANITY_RE); if (h) push('profanity_or_crude_word', 'major', h.index);
  h = hit(visible, BRAND_RE); if (h) push('other_brand_or_partner_name', 'blocker', h.index);
  else { h = hit(visible, EVELYN_RE); if (h) push('says_evelyn', 'major', h.index); }
  h = hit(visible, VENDOR_HARD_RE); if (h) push('model_or_vendor_name', 'major', h.index);
  else { h = hit(visible, VENDOR_SOFT_RE); if (h) push('possible_vendor_name_review', 'info', h.index); }
  h = hit(visible, INTERNAL_ID_RE); if (h) push('internal_id_in_visible_text', 'major', h.index);
  return d;
}

/* ------------------------------------------------------------------ */
/* One item, every check                                               */
/* ------------------------------------------------------------------ */

export interface ItemResult {
  id: string; kind: string; format?: string; uiPath: UiPath;
  subjects: string[]; skills: Skill[];
  question: string; key?: string; choices: Choice[]; hints: string[];
  checks: {
    presence: { withdrawn: boolean; hasQuestion: boolean; hasKeyOrRubric: boolean; rubricParts: number };
    rendering: Record<string, { katexErrors: number; strictWarnings: number; classes: string[] }>;
    selfContainment: RefFinding[];
    structure: string[];
    keyAcceptance: KeyAcceptance;
    language: string[];
    duplicates?: { exactSameKey: string[]; conflictingKey: string[]; near: string[] };
  };
  defects: Defect[];
}

export async function checkItem(P: Product, it: Item, gradeItem: any | null, assessmentKey: any | null): Promise<ItemResult> {
  const defects: Defect[] = [];
  const rendering: ItemResult['checks']['rendering'] = {};
  const lang: Defect[] = [];
  const addRich = (field: string, text: string, isKey = false, completedByOptions = false) => {
    const { defects: dd, rendered } = checkRichField(P, field, text, { isKey, completedByOptions });
    defects.push(...dd);
    rendering[field] = { katexErrors: rendered.katexErrors.length, strictWarnings: rendered.strictWarnings.length, classes: dd.map((x) => x.cls) };
    lang.push(...languageScan(field, rendered.visible));
    return rendered;
  };
  const withdrawn = P.isWithdrawnItem(it.id);
  if (withdrawn) defects.push({ cls: 'withdrawn_item_in_service', severity: 'blocker', field: 'id', excerpt: it.id });
  const rq = addRich('question', it.question ?? '', false, it.choices.length > 0);
  for (const c of it.choices) addRich(`choice:${c.id}`, c.text ?? '', false, true);
  const uiPath = uiPathOf(it);
  // What the card reveals after a wrong answer ("Answer: …"): the keyed option's text (already
  // checked as a choice), the expected answer (numeric path), or the engine's modelResponse.
  if (uiPath !== 'mcq') {
    const revealed = it.rubric?.parts?.length ? it.rubric.parts.filter((p) => p.modelResponse).map((p) => `${p.criterionId}: ${p.modelResponse}`).join('\n') : (it.key ?? '');
    if (revealed) addRich('key', revealed, true);
  }
  if (it.hints[0] !== undefined) {
    const hd = checkPlainField('hint:1', it.hints[0] ?? '');
    defects.push(...hd);
    rendering['hint:1'] = { katexErrors: 0, strictWarnings: 0, classes: hd.map((x) => x.cls) };
    lang.push(...languageScan('hint:1', it.hints[0] ?? ''));
  }
  // Not shown by the practice card (hints 2+, solution text): scanned, reported as info only.
  const hidden: Array<[string, string]> = [...it.hints.slice(1).map((h, i) => [`hint:${i + 2}(not shown)`, h] as [string, string]), ...(it.solutionText ? [['solution(not shown)', it.solutionText] as [string, string]] : [])];
  for (const [f, t] of hidden) {
    const dd = [...checkPlainField(f, t ?? ''), ...languageScan(f, t ?? '')].filter((x) => x.cls !== 'hint_shown_as_raw_math_source' && x.cls !== 'hint_markdown_shown_raw');
    for (const x of dd) defects.push({ ...x, severity: 'info' });
  }
  defects.push(...lang);
  const refs = selfContainment(P, it, rq);
  for (const r of refs) if (r.status === 'missing') defects.push({ cls: `refers_to_missing_${r.kind}`, severity: 'major', field: 'question', excerpt: `"${r.phrase}" — ${r.why}` });
  const st = structureChecks(P, it);
  defects.push(...st);
  const { acc, defects: kd } = await keyAcceptance(P, it, gradeItem, assessmentKey);
  defects.push(...kd);
  return {
    id: it.id, kind: it.kind, format: it.format, uiPath,
    subjects: [...new Set(it.skills.map((s) => s.subject))], skills: it.skills,
    question: it.question, key: it.key, choices: it.choices, hints: it.hints,
    checks: {
      presence: { withdrawn, hasQuestion: !!(it.question && it.question.trim()), hasKeyOrRubric: uiPath === 'mcq' ? !!acc.mcq?.webKeyId : !!((it.key ?? '').trim() || it.rubric?.parts?.length), rubricParts: it.rubric?.parts?.length ?? 0 },
      rendering, selfContainment: refs, structure: st.map((x) => x.cls), keyAcceptance: acc, language: lang.map((x) => x.cls),
    },
    defects,
  };
}

export const csvCell = (v: unknown): string => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const csvRow = (cells: unknown[]): string => cells.map(csvCell).join(',');
