/**
 * Source documents on practice items (contract v1.22.0 `PracticeItem.sources`).
 *
 * Why: a DBQ, SAQ, argument essay, synthesis essay or passage-based question
 * is written about documents — "Using the five documents below…". Those
 * documents are stored as passages (passages/store.ts) and referenced from a
 * try-yourself (`passageId` / `passageIds` + `packetLabel`) or a bank row
 * (`passageId`). Until now the engine resolved them for GRADING only
 * (adapters.ts `resolvePassageText`), so the practice card showed the
 * question with no documents, and the 2026-10-04 answer-key audit withdrew
 * those items as unanswerable.
 *
 * The rule:
 *   - A caller that can show documents says so: the request lists `sources`
 *     in `accepts`, and the code calling `retrievePractice` passes
 *     `options.allowSources` (the practice route does; assessments and
 *     assigned practice do not). Every item that references passages is then
 *     returned WITH them, in the order the item's text refers to them,
 *     labelled the way the grader labels them ("Document 1", "Source A";
 *     "Source" for a single one).
 *   - An item on the SOURCES-REQUIRED list (src/data/sources-required-items.json:
 *     items the audit withdrew only because the card hid their documents, put
 *     back after a re-check with the documents shown) cannot be answered
 *     without them. It is served ONLY to such a caller and only when every one
 *     of its passages resolves; everywhere else it is dropped exactly like a
 *     withdrawn item — so no caller that cannot show documents ever sees it.
 *   - Any other item behaves exactly as before for a caller that does not
 *     accept sources (no `sources` field).
 *
 * Like the withdrawn list this is about SERVING only: the answer-key resolvers
 * (`resolveGradeItem` / `resolveAssessmentItem`) do not consult it.
 *
 * Pure apart from the skip log lines. No env, no I/O.
 */
// Relative on purpose: voice/problem-generator.ts (relative-import-only) loads this too.
import required from '../../../data/sources-required-items.json';
import { resolvePassage } from '../passages/store';
import type { Passage } from '../passages/types';

/** The wire shape (contract `PracticeSource`), repeated so this module stays
 *  importable by relative path alone; scripts/test-practice-source-items.ts
 *  pins it against the contract schema. */
export interface ServableSource {
  label: string;
  title?: string;
  attribution?: string;
  text: string;
  table?: { caption?: string; columns: string[]; rows: string[][] };
}

/** Where an item's documents are stored (a try-yourself segment or a bank row). */
export interface PassageRefs {
  passageId?: string;
  passageIds?: string[];
  packetLabel?: 'source' | 'document';
}

/** Contract caps (`PracticeSourceSchema`, `PracticeItem.sources`). */
export const MAX_SOURCES_PER_ITEM = 12;
const MAX_TEXT = 20_000;
const MAX_TITLE = 300;
const MAX_ATTRIBUTION = 300;

const REQUIRED: ReadonlySet<string> = new Set(Object.keys(required.items as Record<string, string>));

/** Every item id that may only be served with its documents. */
export const SOURCES_REQUIRED_ITEM_IDS: ReadonlySet<string> = REQUIRED;

/** May this item only be served with its documents? */
export function requiresSources(id: string | null | undefined, list: ReadonlySet<string> = REQUIRED): boolean {
  return typeof id === 'string' && list.has(id);
}

/** Did the request list `sources` in `accepts`? */
export function acceptsSources(req: { accepts?: readonly string[] }): boolean {
  return Array.isArray(req.accepts) && req.accepts.includes('sources');
}

/** The passage ids an item refers to, in order, de-duplicated. */
export function passageIdsOf(refs: PassageRefs | null | undefined): string[] {
  if (!refs) return [];
  const ids = [
    ...(typeof refs.passageId === 'string' && refs.passageId ? [refs.passageId] : []),
    ...(Array.isArray(refs.passageIds) ? refs.passageIds.filter((x): x is string => typeof x === 'string' && x.length > 0) : []),
  ];
  return [...new Set(ids)];
}

/** Does this segment / row reference any passage? */
export function carriesPassages(refs: PassageRefs | null | undefined): boolean {
  return passageIdsOf(refs).length > 0;
}

function clip(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function attributionOf(p: Passage): string | undefined {
  const year = Number.isFinite(p.year) && p.year > 0 ? `${p.yearApproximate ? 'c. ' : ''}${p.year}` : '';
  const parts = [p.author?.trim(), year].filter(Boolean);
  return parts.length ? clip(parts.join(', '), MAX_ATTRIBUTION) : undefined;
}

/** A label per position, matching adapters.ts `resolvePassageText` (what the
 *  grader is shown): "Document 1..N" for a document packet, "Source A..Z"
 *  otherwise; a single passage is "Source". */
export function sourceLabel(index: number, count: number, packetLabel: PassageRefs['packetLabel']): string {
  if (count <= 1) return 'Source';
  return packetLabel === 'document' ? `Document ${index + 1}` : `Source ${String.fromCharCode(65 + index)}`;
}

function tableOf(p: Passage): ServableSource['table'] | undefined {
  const t = p.table;
  if (!t || !Array.isArray(t.columns) || t.columns.length === 0 || !Array.isArray(t.rows) || t.rows.length === 0) return undefined;
  if (t.columns.length > 12 || t.rows.length > 60 || t.rows.some((r) => !Array.isArray(r) || r.length > 12)) return undefined;
  return {
    ...(t.caption ? { caption: clip(t.caption, 300) } : {}),
    columns: t.columns.map((c) => clip(String(c), 120)),
    rows: t.rows.map((r) => r.map((c) => clip(String(c), 200))),
  };
}

/**
 * The documents for an item, ready for the wire — or null when the item
 * references none, or when ANY referenced passage does not resolve (an item
 * missing one of its documents is not shown with a partial packet).
 */
export function practiceSourcesFor(
  refs: PassageRefs | null | undefined,
  resolve: (id: string) => Passage | undefined = resolvePassage,
): ServableSource[] | null {
  const ids = passageIdsOf(refs);
  if (ids.length === 0 || ids.length > MAX_SOURCES_PER_ITEM) return null;
  const out: ServableSource[] = [];
  for (const [i, id] of ids.entries()) {
    const p = resolve(id);
    if (!p || typeof p.fullText !== 'string' || p.fullText.trim().length === 0) return null;
    const attribution = attributionOf(p);
    const table = tableOf(p);
    out.push({
      label: sourceLabel(i, ids.length, refs?.packetLabel),
      ...(p.title ? { title: clip(p.title, MAX_TITLE) } : {}),
      ...(attribution ? { attribution } : {}),
      text: clip(p.fullText, MAX_TEXT),
      ...(table ? { table } : {}),
    });
  }
  return out;
}

const PASSAGE_ID_RE = /evelyn\.passage\.[a-z0-9-]+\.v\d+/g;

/**
 * Some authored prompts name their passage by its internal id ("Using the
 * passage evelyn.passage.lincoln-gettysburg.v1, write…") — the tutor resolves
 * it, a student cannot. When the item is SENT WITH its documents, each such id
 * becomes the passage's title in quotes; an id in parentheses after a phrase
 * that already names the work ("Lincoln's Gettysburg Address (evelyn.…v1)")
 * is dropped. An id that does not resolve is left as it is. Pure.
 */
export function withPassageTitles(
  problemText: string,
  resolve: (id: string) => Passage | undefined = resolvePassage,
): string {
  if (!problemText.includes('evelyn.passage.')) return problemText;
  return problemText
    .replace(/\s*\((evelyn\.passage\.[a-z0-9-]+\.v\d+)\)/g, (m, id: string) => (resolve(id) ? '' : m))
    .replace(PASSAGE_ID_RE, (id) => {
      const p = resolve(id);
      return p?.title ? `"${p.title}"` : id;
    });
}

export function logSourcesItemSkip(id: string, why: 'not-accepted' | 'unresolved', where: string): void {
  console.log(`[practice] sources item not served ${id} why=${why} where=${where}`);
}

/**
 * THE SOURCES GATE, over assembled items. `refsById` maps an item id to the
 * passages its segment / row references.
 *   - `serve` true: an item with passages gets `sources` (and any internal
 *     passage id in its text becomes the passage's title); a required item
 *     whose passages do not all resolve is dropped.
 *   - `serve` false: a required item is dropped; every other item is
 *     returned untouched.
 * Applied before de-dup, excludeIds and slicing, so a dropped item takes no
 * slot. Pure apart from the log lines.
 */
export function applySourcesGate<T extends { id: string; problemText?: string; sources?: ServableSource[] }>(
  items: readonly T[],
  refsById: ReadonlyMap<string, PassageRefs>,
  serve: boolean,
  where: string,
  list: ReadonlySet<string> = REQUIRED,
  resolve?: (id: string) => Passage | undefined,
): T[] {
  const out: T[] = [];
  for (const it of items) {
    const needs = requiresSources(it.id, list);
    if (!serve) {
      if (needs) {
        logSourcesItemSkip(it.id, 'not-accepted', where);
        continue;
      }
      out.push(it);
      continue;
    }
    const refs = refsById.get(it.id);
    const sources = carriesPassages(refs) ? practiceSourcesFor(refs, resolve) : null;
    if (sources) {
      out.push({
        ...it,
        ...(typeof it.problemText === 'string' ? { problemText: withPassageTitles(it.problemText, resolve) } : {}),
        sources,
      });
      continue;
    }
    if (needs) {
      logSourcesItemSkip(it.id, 'unresolved', where);
      continue;
    }
    out.push(it);
  }
  return out;
}

/** Drop required items (a reader that never shows documents — the in-session
 *  bank query). Logs one line per skipped id. */
export function withoutSourcesRequired<T extends { id: string }>(items: readonly T[], where: string, list: ReadonlySet<string> = REQUIRED): T[] {
  return items.filter((it) => {
    if (!requiresSources(it.id, list)) return true;
    logSourcesItemSkip(it.id, 'not-accepted', where);
    return false;
  });
}
