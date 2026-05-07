/**
 * Pure helper: render a CatalogSnapshotEntry[] into a compact prose
 * description suitable for inclusion in LLM prompts. Lives outside
 * voice/claude-brain.ts so client-side code (the orchestrator's judge
 * call) can import it without pulling in the Anthropic SDK.
 *
 * Format mirrors what the brain sees on each turn: numbered list of
 * entries with title, page, and feature descriptions where present.
 *
 * When entries carry `isOnCurrentPage`, the summary surfaces a `[CURRENT
 * PAGE]` marker on visible entries and a `[earlier page]` marker on the
 * rest, plus a top-of-block header naming the active page. Brain reads
 * the markers to decide whether to scroll/re-render before referencing
 * an item.
 */
import type { CatalogSnapshotEntry } from './catalog';

export function buildWhiteboardSummary(snapshot: CatalogSnapshotEntry[]): string {
  if (snapshot.length === 0) return '(whiteboard is empty)';
  // Find the current-page title from any entry that carries it (all
  // entries from the same snapshot share the same currentPageTitle —
  // it's a per-snapshot marker, not a per-entry value).
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
    // Only emit page-visibility markers when we know the current page.
    // For free-conversation / pre-newPage sessions, isOnCurrentPage is
    // undefined and we omit the marker entirely (no clutter).
    let visibility = '';
    if (haveCurrentPage) {
      visibility = entry.isOnCurrentPage ? ' [CURRENT PAGE]' : ' [earlier page]';
    }
    const head = `[${i + 1}] ${entry.action}${title}${page}${visibility}`;
    const feats = entry.features ?? [];
    if (feats.length === 0) {
      const count = entry.featureCount > 0 ? ` (${entry.featureCount} addressable features)` : '';
      lines.push(`${head}${count}`);
      return;
    }
    // Cap per-item feature dump so a chess-board-sized renderer can't blow
    // up the prompt; in practice geometry items have ≤ 20 features.
    const MAX = 30;
    const shown = feats.slice(0, MAX).map((f) => `   - ${f.description}`);
    const overflow = feats.length > MAX ? `   - …and ${feats.length - MAX} more` : '';
    lines.push([head, ...shown, overflow].filter(Boolean).join('\n'));
  });
  return lines.join('\n');
}
