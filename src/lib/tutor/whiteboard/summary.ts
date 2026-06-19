/**
 * Pure helper: render a CatalogSnapshotEntry[] into a compact prose
 * description suitable for inclusion in LLM prompts. Lives outside
 * voice/claude-brain.ts so client-side code (the orchestrator's judge
 * call) can import it without pulling in the Anthropic SDK.
 *
 * TWO MODES (Board Map, design 2026-06-18 — see
 * project_tutor_board_map_design memory):
 *
 *  - LEGACY (no `opts.pages`): a flat numbered list of entries with title,
 *    page tag, and feature descriptions. Unchanged behaviour. This is the
 *    JUDGE path (segment-scoped snapshot, validates claims, never navigates)
 *    and any caller that doesn't opt into the map.
 *
 *  - MAP (with `opts.pages`): a page-grouped hierarchy — the Board Map. The
 *    full board's pages render in order with 1-based numbers (the handle the
 *    brain navigates / page-qualifies by). Item detail is shown only for
 *    EXPANDED pages (current segment ∪ current view page ∪ the top-N
 *    off-segment pages by lastRenderTurn); the rest collapse to a single
 *    header line (number + title + artifact kinds). This is the BRAIN path,
 *    which passes the FULL-board snapshot (not segment-scoped) so expanded
 *    off-segment pages have detail; the formatter discards collapsed-page
 *    detail so the output stays bounded.
 *
 * When entries carry `isOnCurrentPage`, both modes surface a `[CURRENT PAGE]`
 * marker. Brain reads it to decide whether to scroll/re-render before
 * referencing an item.
 */
import type { CatalogSnapshotEntry, Page } from './catalog';
import { prettyAction } from './catalog';

/** How many off-segment pages (beyond current-segment + the current view
 *  page) get their per-feature detail expanded in the Board Map. Tunable —
 *  see Q8 of the Board Map design. Keeps the per-turn payload bounded
 *  regardless of how long the session runs. */
export const AUTO_EXPAND_OFF_SEGMENT_PAGES = 2;

/** Cap per-item feature dump so a chess-board-sized renderer can't blow up
 *  the prompt; in practice geometry items have <= 20 features. */
const MAX_FEATURES_PER_ITEM = 30;

export interface BoardMapOptions {
  /** Full-board page list (catalog.getPages()). Presence switches the
   *  formatter into page-grouped MAP mode. Order defines page numbers
   *  (number = index + 1). */
  pages?: readonly Page[];
  /** Current lesson-plan segment. Pages on this segment render expanded.
   *  Undefined/'' (free convo) → every page expands. */
  currentSegmentId?: string;
  /** Override AUTO_EXPAND_OFF_SEGMENT_PAGES (mainly for tests). */
  autoExpandN?: number;
}

export function buildWhiteboardSummary(
  snapshot: CatalogSnapshotEntry[],
  opts?: BoardMapOptions,
): string {
  if (snapshot.length === 0) return '(whiteboard is empty)';
  // MAP mode only when we have a page list to group by. Otherwise fall back
  // to the legacy flat rendering (judge path + any non-opted caller).
  if (opts?.pages && opts.pages.length > 0) {
    return buildPageGroupedSummary(snapshot, opts.pages, opts);
  }
  return buildFlatSummary(snapshot);
}

/** One feature-detail line per addressable feature (capped). Shared by both
 *  modes for the items they choose to expand. */
function featureLines(entry: CatalogSnapshotEntry): string[] {
  const feats = entry.features ?? [];
  if (feats.length === 0) return [];
  const shown = feats
    .slice(0, MAX_FEATURES_PER_ITEM)
    .map((f) => `   - ${f.description}`);
  if (feats.length > MAX_FEATURES_PER_ITEM) {
    shown.push(`   - …and ${feats.length - MAX_FEATURES_PER_ITEM} more`);
  }
  return shown;
}

/** Distinct prettified artifact kinds on a page, in first-seen order. */
function artifactTypesFor(entries: CatalogSnapshotEntry[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of entries) {
    const pretty = prettyAction(e.action);
    if (pretty && !seen.has(pretty)) {
      seen.add(pretty);
      out.push(pretty);
    }
  }
  return out;
}

/* ───────────────────────── LEGACY (flat) ───────────────────────── */

function buildFlatSummary(snapshot: CatalogSnapshotEntry[]): string {
  // Find the current-page title from any entry that carries it (all entries
  // from the same snapshot share the same currentPageTitle — it's a
  // per-snapshot marker, not a per-entry value).
  const currentPageEntry = snapshot.find((e) => e.isOnCurrentPage === true);
  const haveCurrentPage = !!currentPageEntry;
  const currentPageTitle = currentPageEntry?.pageTitle?.trim() ?? '';
  const lines: string[] = [];
  if (haveCurrentPage) {
    lines.push(`Currently visible page: "${currentPageTitle || '(untitled)'}"`);
    lines.push('');
  }
  snapshot.forEach((entry, i) => {
    const title = entry.title ? ` — ${entry.title}` : '';
    const page = entry.pageTitle ? ` [page: ${entry.pageTitle}]` : '';
    // Only emit page-visibility markers when we know the current page. For
    // free-conversation / pre-newPage sessions, isOnCurrentPage is undefined
    // and we omit the marker entirely (no clutter).
    let visibility = '';
    if (haveCurrentPage) {
      visibility = entry.isOnCurrentPage ? ' [CURRENT PAGE]' : ' [earlier page]';
    }
    const head = `[${i + 1}] ${entry.action}${title}${page}${visibility}`;
    const feats = featureLines(entry);
    if (feats.length === 0) {
      const count =
        entry.featureCount > 0 ? ` (${entry.featureCount} addressable features)` : '';
      lines.push(`${head}${count}`);
      return;
    }
    lines.push([head, ...feats].join('\n'));
  });
  return lines.join('\n');
}

/* ───────────────────────── MAP (page-grouped) ───────────────────────── */

function buildPageGroupedSummary(
  snapshot: CatalogSnapshotEntry[],
  pages: readonly Page[],
  opts: BoardMapOptions,
): string {
  const N = opts.autoExpandN ?? AUTO_EXPAND_OFF_SEGMENT_PAGES;
  const curSeg = (opts.currentSegmentId ?? '').trim();

  // Group snapshot entries by pageId (preserving snapshot order within a
  // page). Entries with no pageId (free convo / pre-newPage) collect in a
  // trailing "unpaged" bucket.
  const byPage = new Map<string, CatalogSnapshotEntry[]>();
  const unpaged: CatalogSnapshotEntry[] = [];
  for (const e of snapshot) {
    if (!e.pageId) {
      unpaged.push(e);
      continue;
    }
    const arr = byPage.get(e.pageId);
    if (arr) arr.push(e);
    else byPage.set(e.pageId, [e]);
  }

  // Current VIEW page = the page id of any entry flagged isOnCurrentPage.
  const viewPageId = snapshot.find((e) => e.isOnCurrentPage === true)?.pageId;

  // Decide which pages expand. Current-segment pages and the view page always
  // expand; among the REMAINING off-segment pages, the top-N by lastRenderTurn
  // also expand (Q8). Pages with no rendered items (shouldn't happen post-GC)
  // are skipped entirely.
  const renderable = pages.filter((p) => (byPage.get(p.id)?.length ?? 0) > 0);
  const alwaysExpand = (p: Page) =>
    (p.segmentId ?? '').trim() === curSeg || p.id === viewPageId;
  const offSegment = renderable
    .filter((p) => !alwaysExpand(p))
    .sort((a, b) => b.lastRenderTurn - a.lastRenderTurn);
  const autoExpanded = new Set(offSegment.slice(0, Math.max(0, N)).map((p) => p.id));
  const expanded = (p: Page) => alwaysExpand(p) || autoExpanded.has(p.id);

  const lines: string[] = [];
  const viewPage = renderable.find((p) => p.id === viewPageId);
  const viewNumber = viewPage ? pages.indexOf(viewPage) + 1 : undefined;
  lines.push(
    viewNumber
      ? `Whiteboard pages (you are viewing Page ${viewNumber} "${viewPage!.title || '(untitled)'}"):`
      : 'Whiteboard pages:',
  );
  lines.push('');

  pages.forEach((p, idx) => {
    const entries = byPage.get(p.id);
    if (!entries || entries.length === 0) return; // GC should prevent this
    const number = idx + 1;
    const title = p.title ? `"${p.title}"` : '"(untitled)"';
    const types = artifactTypesFor(entries);
    const typeTag = types.length ? ` — ${types.join(', ')}` : '';
    let marker = '';
    if (p.id === viewPageId) marker = ' [CURRENT PAGE]';
    else if ((p.segmentId ?? '').trim() !== curSeg) marker = ' [earlier]';
    const cont = p.isContinuation ? ' (cont.)' : '';
    const header = `Page ${number}: ${title}${cont}${typeTag}${marker}`;

    if (!expanded(p)) {
      // Collapsed: header only. Detail available on navigation /
      // tutor_list_whiteboard_features.
      lines.push(header);
      return;
    }

    // Expanded: header + per-item detail.
    lines.push(header);
    entries.forEach((entry) => {
      const itemTitle = entry.title ? ` — ${entry.title}` : '';
      const head = `  ${entry.action}${itemTitle}`;
      const feats = featureLines(entry);
      if (feats.length === 0) {
        const count =
          entry.featureCount > 0 ? ` (${entry.featureCount} addressable features)` : '';
        lines.push(`${head}${count}`);
        return;
      }
      lines.push([head, ...feats].join('\n'));
    });
  });

  if (unpaged.length > 0) {
    lines.push('');
    lines.push('Unpaged items:');
    unpaged.forEach((entry) => {
      const itemTitle = entry.title ? ` — ${entry.title}` : '';
      const head = `  ${entry.action}${itemTitle}`;
      const feats = featureLines(entry);
      lines.push(feats.length === 0 ? head : [head, ...feats].join('\n'));
    });
  }

  return lines.join('\n');
}
