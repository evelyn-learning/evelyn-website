/**
 * Pure helper: render a CatalogSnapshotEntry[] into a compact prose
 * description suitable for inclusion in LLM prompts. Lives outside
 * voice/claude-brain.ts so client-side code (the orchestrator's judge
 * call) can import it without pulling in the Anthropic SDK.
 *
 * Format mirrors what the brain sees on each turn: numbered list of
 * entries with title, page, and feature descriptions where present.
 */
import type { CatalogSnapshotEntry } from './catalog';

export function buildWhiteboardSummary(snapshot: CatalogSnapshotEntry[]): string {
  if (snapshot.length === 0) return '(whiteboard is empty)';
  return snapshot
    .map((entry, i) => {
      const title = entry.title ? ` — ${entry.title}` : '';
      const page = entry.pageTitle ? ` [page: ${entry.pageTitle}]` : '';
      const head = `[${i + 1}] ${entry.action}${title}${page}`;
      const feats = entry.features ?? [];
      if (feats.length === 0) {
        const count = entry.featureCount > 0 ? ` (${entry.featureCount} addressable features)` : '';
        return `${head}${count}`;
      }
      // Cap per-item feature dump so a chess-board-sized renderer can't blow
      // up the prompt; in practice geometry items have ≤ 20 features.
      const MAX = 30;
      const shown = feats.slice(0, MAX).map((f) => `   - ${f.description}`);
      const overflow = feats.length > MAX ? `   - …and ${feats.length - MAX} more` : '';
      return [head, ...shown, overflow].filter(Boolean).join('\n');
    })
    .join('\n');
}
