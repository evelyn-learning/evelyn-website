/**
 * Lever A — conservative subject filter for the brain tools array.
 *
 * Design locked via a 6-question grill 2026-05-18; full rationale +
 * do-NOT-regress list in memory `project_lever_a_tools_filter.md`.
 *
 * Posture: CONSERVATIVE EXCLUDE + FAIL OPEN. A tool is KEPT unless it is
 * explicitly tagged here AND none of its tagged subjects intersect the
 * session's allowed set. Any tool NOT in TOOL_SUBJECTS is universal CORE
 * and is ALWAYS sent — so only the ~30-40 clearly single-subject tools
 * need an entry and `toolDefinitions.ts` stays zero-touch.
 *
 * Cache safety (RISK 4): the filter is order-preserving and deterministic
 * given the allowed set, and the session subject is immutable for a
 * running session, so the emitted tools array is byte-stable per session
 * (prefix stays cached — no per-turn re-create). Never reorder `tools`.
 */
import type { ToolDefinition } from '@/app/tutor/hooks/toolDefinitions';

export type CatalogSubject =
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'earth'
  | 'cs'
  | 'ela'
  | 'social';

/**
 * Only tools SAFE TO EXCLUDE from other subjects appear here. Mirrors the
 * catalog-manifest tagging convention. Multi-element arrays = genuinely
 * cross-subject (kept for any of those subjects). `show_diagram` (the
 * catalog dispatcher) and every lesson-control / generic-quant tool are
 * deliberately ABSENT ⇒ universal CORE.
 */
const TOOL_SUBJECTS: Record<string, CatalogSubject[]> = {
  // chemistry
  show_molecule: ['chemistry'],
  show_lewis: ['chemistry'],
  show_lewis_constructed: ['chemistry'],
  show_periodic_table: ['chemistry'],
  show_balanced_equation: ['chemistry'],
  show_reaction_coordinate: ['chemistry'],
  show_orbital_diagram: ['chemistry', 'physics'],
  show_dimensional_check: ['chemistry', 'physics'],
  // physics
  show_circuit: ['physics'],
  show_collision: ['physics'],
  show_energy_bars: ['physics'],
  show_free_body_diagram: ['physics'],
  show_motion_diagram: ['physics'],
  show_projectile_motion: ['physics'],
  show_simple_machine: ['physics'],
  show_pendulum: ['physics'],
  show_spring_mass: ['physics'],
  show_ray_diagram: ['physics'],
  show_wave: ['physics'],
  // biology
  show_pedigree: ['biology'],
  show_punnett: ['biology'],
  show_cell_diagram: ['biology'],
  show_dna: ['biology'],
  show_food_web: ['biology', 'earth'],
  // ela / social
  show_phonics: ['ela'],
  show_writing_frame: ['ela'],
  show_graphic_organizer: ['ela', 'social'],
  show_annotated_passage: ['ela', 'social'],
  show_timeline: ['ela', 'social'],
  show_map: ['social', 'earth'],
  // math
  show_fraction_bar: ['math'],
  show_early_math: ['math'],
  show_manipulative: ['math'],
  show_unit_circle: ['math', 'physics'],
  show_matrix: ['math', 'physics', 'cs'],
  // cs — CS↔math overlap is real (algorithmic-math legitimately uses
  // code/flowchart/call-stack views); conservative ruling = also 'math'.
  show_code: ['cs', 'math'],
  show_run_code: ['cs', 'math'],
  show_flowchart: ['cs', 'math'],
  show_call_stack: ['cs', 'math'],
};

/**
 * UI subject (page.tsx `selectedSubject`) → the CatalogSubject set this
 * session may use. `null` ⇒ FAIL OPEN (caller sends the full array).
 * 'science' is the science-union (v1 decision); 'test-prep' /
 * 'languages' / 'arts' / unknown ⇒ fail open.
 */
export function resolveToolSubjects(
  uiSubject: string | undefined | null,
  topic?: string | null,
): CatalogSubject[] | null {
  const s = (uiSubject || '').trim().toLowerCase();
  switch (s) {
    case 'math':
      return ['math'];
    case 'physics':
      return ['physics'];
    case 'chemistry':
      return ['chemistry'];
    case 'biology':
      return ['biology'];
    case 'earth':
    case 'earth-science':
    case 'earth science':
      return ['earth'];
    case 'cs':
    case 'computer-science':
    case 'computer science':
      return ['cs'];
    case 'ela':
    case 'english':
    case 'english-language-arts':
      return ['ela'];
    case 'social':
    case 'ss':
    case 'social-studies':
    case 'social studies':
    case 'history':
      return ['social'];
    case 'science':
    case 'sci':
      // Science-union: a generic-science session spans the four lab
      // sciences. Still conservative — drops only ela/cs/social/
      // pure-early-math tools.
      return ['physics', 'chemistry', 'biology', 'earth'];
    default:
      // 'test-prep' / 'languages' / 'arts' / '' / unknown — no trusted scope
      // from the subject alone. Try the TOPIC (e.g. "neet-biology",
      // "jee-physics"); fail open only when the topic reveals nothing.
      return subjectsFromTopic(topic);
  }
}

/** Derive the catalog-subject set from a topic slug, for sessions whose subject
 *  is generic (test-prep / science / unknown) — so NEET/JEE/etc. sessions get a
 *  filtered catalog instead of the whole list. High-precision keyword stems; an
 *  unrecognized subject falls back to the EXAM's subject span, then to null
 *  (fail open). It never narrows to the WRONG subject — when unsure it returns
 *  null, which the caller treats as "show everything" (the safe prior behavior). */
function subjectsFromTopic(topic?: string | null): CatalogSubject[] | null {
  const t = (topic || '').toLowerCase();
  if (!t) return null;
  const KW: Array<[RegExp, CatalogSubject]> = [
    [/biolog|botan|zoolog|anatom|physiolog|genetic|ecolog|evolution/, 'biology'],
    [/chemis|\bchem\b|organic|inorganic|stoichi|electrochem|thermochem/, 'chemistry'],
    [/physic|\bphys\b|mechanic|electromag|thermodynam|optic|kinemat|electrostat|magnetism/, 'physics'],
    [/\bmath|calculus|algebra|geometr|trigonom|statistic|probabilit|arithmetic|matrix|matrices/, 'math'],
    [/comput|programming|algorithm|\bcs\b|data.structur/, 'cs'],
    [/econom|macroecon|microecon|civics|geograph|histor|government|political/, 'social'],
    [/earth-sci|geolog|astronom|environ|climate|meteorolog/, 'earth'],
    [/english|literatur|grammar|\bela\b|reading|writing|essay|poetry|rhetoric/, 'ela'],
  ];
  const found = new Set<CatalogSubject>();
  for (const [re, sub] of KW) if (re.test(t)) found.add(sub);
  if (found.size) return [...found];
  // Topic names the EXAM, not a subject → that exam's subject span.
  if (/neet|mcat|aiims/.test(t)) return ['biology', 'chemistry', 'physics'];
  if (/jee|iitjee|bitsat/.test(t)) return ['math', 'physics', 'chemistry'];
  if (/\bgre\b|\bgmat\b/.test(t)) return ['math'];
  if (/\bsat\b|\bact\b/.test(t)) return ['math', 'ela'];
  return null;
}

let assertedOnce = false;
function assertTaxonomyKeysValid(tools: ToolDefinition[]): void {
  if (assertedOnce || process.env.NODE_ENV === 'production') return;
  assertedOnce = true;
  const names = new Set(tools.map((t) => t.name));
  const stray = Object.keys(TOOL_SUBJECTS).filter((k) => !names.has(k));
  if (stray.length) {
    console.error(
      `[toolfilter] taxonomy keys absent from WHITEBOARD_TOOLS ` +
        `(renamed/removed — fix the taxonomy): ${stray.join(', ')}`,
    );
  }
}

export interface ToolFilterResult {
  tools: ToolDefinition[];
  mode: 'failopen' | 'filter';
  sent: number;
  total: number;
  excluded: string[];
}

/**
 * Keep a tool unless it is tagged AND none of its subjects are allowed.
 * `allowed === null` ⇒ fail open (return the input array unchanged, same
 * reference — byte-identical). Order-preserving + deterministic.
 */
export function filterToolsForSubject(
  tools: ToolDefinition[],
  allowed: CatalogSubject[] | null,
): ToolFilterResult {
  assertTaxonomyKeysValid(tools);
  if (allowed === null) {
    return {
      tools,
      mode: 'failopen',
      sent: tools.length,
      total: tools.length,
      excluded: [],
    };
  }
  const allowSet = new Set<CatalogSubject>(allowed);
  const excluded: string[] = [];
  const kept = tools.filter((t) => {
    const tagged = TOOL_SUBJECTS[t.name];
    if (!tagged) return true; // universal CORE — always sent
    const ok = tagged.some((subj) => allowSet.has(subj));
    if (!ok) excluded.push(t.name);
    return ok;
  });
  return {
    tools: kept,
    mode: 'filter',
    sent: kept.length,
    total: tools.length,
    excluded,
  };
}
