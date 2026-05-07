/**
 * WhiteboardCatalog — session-scoped authoritative registry of every
 * rendered item and its named features.
 *
 * Replaces the prior fuzzy scribble-resolution pipeline (featAliases +
 * prefix-swap + snake/camel normalization + most-recent-visual fallback)
 * with a single deterministic lookup:
 *
 *   tutor emits `target: "vertex A"` →
 *   catalog.resolveTarget("vertex A") →
 *   { ok: true, itemId: "showCoordinatePlane-1", canonical: "point-a", bbox }
 *
 * Each renderer's buildXxxManifest populates the catalog's `features[]`;
 * each feature carries an explicit `labels[]` array enumerating every
 * natural-language variant the tutor may use ("A", "point A", "vertex A").
 * Renderers that haven't been migrated yet fall through to a small set of
 * auto-generated labels (bare name + kind-prefix swaps) so they remain
 * resolvable, but the only "fuzziness" in the whole system now lives
 * inside this one file.
 *
 * Invariants:
 *   - Every rendered item gets exactly one CatalogItem, keyed by itemId.
 *   - Features are registered in render order.
 *   - resolveTarget iterates items newest-first so "circle vertex A"
 *     resolves to the most recent triangle on the board.
 *   - On miss, the result carries a structured candidate list the handler
 *     can echo back to the tutor in the tool_result — the tutor retries
 *     with a correct target; we never silently draw on the wrong thing.
 */

import type { FeatureKind, FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export interface CatalogFeature {
  /** data-feature attribute value the renderer emits; authoritative. */
  canonical: string;
  kind: FeatureKind;
  description?: string;
  /** Every string that should resolve to this feature. Normalized at match time. */
  labels: string[];
  /** 0–1 fractions of the target item's viewBox. Optional — overlay reads DOM when missing. */
  bbox?: { cx: number; cy: number; w: number; h: number };
  /**
   * Whether tutor_scribble can mark this feature. Defaults to true.
   * Iframe-backed items (Desmos, Ketcher) register a single non-
   * scribbleable whole-item feature: scrolling to them works, marking
   * inside them does not, and the catalog tells the handler so it can
   * redirect the tutor to tutor_scroll_whiteboard with a clear message.
   */
  scribbleable: boolean;
}

export interface CatalogItem {
  /** e.g. "showCoordinatePlane-1". */
  itemId: string;
  /** Insertion order across the whole session. */
  order: number;
  /** Action name the item was rendered by, e.g. "showCoordinatePlane". */
  action: string;
  /** Page title at time of render, if any (tracks cross-page resolution later). */
  pageTitle?: string;
  /** Optional human-readable title (e.g. show_problem.problem.title or show_energy_bars.title). */
  title?: string;
  /**
   * Stable hash of the show_* tool args used to dedupe replays. Two calls
   * with the same signature register the SAME catalog item — the second
   * call is reported back as a duplicate and not rendered.
   */
  signature?: string;
  /**
   * The lesson-plan segment id that was active when this item was
   * appended (e.g. "worked-1"). Empty string for free-conversation
   * sessions. Used by getSnapshot's segment filter to restrict the
   * brain's per-turn view to current-segment content only — old
   * segments stay visually accessible to the student via page nav
   * but don't bloat the brain's prompt or confuse the judge LLM
   * about which card the student is attending to.
   */
  segmentId?: string;
  features: CatalogFeature[];
}

/**
 * One row of the per-turn whiteboard snapshot returned alongside every
 * show_* tool_result. The tutor reads this to remember what's already on
 * the board and route through scroll/scribble instead of redrawing.
 */
export interface CatalogSnapshotEntry {
  itemId: string;
  action: string;
  title?: string;
  pageTitle?: string;
  featureCount: number;
  /** Segment id the entry was appended in (mirrors CatalogItem.segmentId).
   *  When the brain's per-turn snapshot filters by segment, the entries
   *  that survive will all have the same segmentId — but we still
   *  surface the field for downstream debugging / telemetry. */
  segmentId?: string;
  /** Per-feature short descriptions surfaced to the brain so it can preserve
   *  exact coordinates / labels across turns. Without these, the brain sees
   *  only "[1] showGeometry — Circle: Center O(-2,3), Radius 5 (5 features)"
   *  and re-imagines coordinates on the next turn — observed 2026-04-26 with
   *  C and D on a circle being silently relocated off-circle when the user
   *  asked to extend the figure. */
  features?: Array<{ canonical: string; kind: string; description?: string }>;
}

export interface ResolveSuccess {
  ok: true;
  itemId: string;
  canonical: string;
  kind: FeatureKind;
  bbox?: { cx: number; cy: number; w: number; h: number };
  scribbleable: boolean;
  /** Item action (e.g. "showGraph") — handlers use this in redirect messages. */
  action: string;
}

export interface ResolveFailure {
  ok: false;
  reason: 'empty_query' | 'no_items' | 'no_match' | 'ambiguous';
  message: string;
  /** Short list of (feature, item) pairs the tutor can retry with. */
  candidates: Array<{ target: string; on: string }>;
}

export type ResolveResult = ResolveSuccess | ResolveFailure;

/**
 * Normalize a free-form target string for matching. Lowercase, strip
 * diacritics, collapse punctuation/whitespace to single dashes.
 *   "Vertex A"   → "vertex-a"
 *   "point A"    → "point-a"
 *   "A"          → "a"
 *   "y-axis"     → "y-axis"
 *   "  A (2,3)"  → "a-2-3"
 */
export function normalizeToken(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * When a manifest entry doesn't declare explicit labels, synthesize a
 * minimal set so the feature still answers to:
 *   - its canonical name           ("point-a")
 *   - the bare identifier after a kind-prefix ("a")
 *   - the humanized form            ("point a")
 *   - common kind-prefix swaps      ("vertex-a", "node-a" for points)
 *
 * Keep this list short — renderers that care about richer aliasing should
 * declare `labels` explicitly on the manifest entry. This fallback exists
 * so unmigrated renderers don't regress while the fan-out is in flight.
 */
export function canonicalizeLabels(entry: Pick<FeatureManifestEntry, 'name' | 'kind' | 'labels'>): string[] {
  const explicit = Array.isArray(entry.labels) ? entry.labels : [];
  if (explicit.length > 0) {
    const out = new Set<string>(explicit.map((s) => s.trim()).filter(Boolean));
    out.add(entry.name);
    return Array.from(out);
  }

  const out = new Set<string>([entry.name]);
  const dashIdx = entry.name.indexOf('-');
  if (dashIdx > 0) {
    const prefix = entry.name.slice(0, dashIdx);
    const tail = entry.name.slice(dashIdx + 1);
    if (tail) {
      out.add(tail);
      out.add(entry.name.replace(/-/g, ' '));

      const SYNONYMS: Record<string, string[]> = {
        point: ['vertex', 'node'],
        vertex: ['point', 'node'],
        node: ['point', 'vertex'],
        line: ['segment', 'edge'],
        segment: ['line', 'edge'],
        edge: ['line', 'segment'],
        region: ['area', 'zone'],
        area: ['region', 'zone'],
        zone: ['region', 'area'],
      };
      for (const alt of SYNONYMS[prefix] ?? []) {
        out.add(`${alt}-${tail}`);
      }
    }
  }
  return Array.from(out);
}

export class WhiteboardCatalog {
  private items: CatalogItem[] = [];
  private nextOrder = 0;
  /** Active lesson-plan segment id at the time of the next append().
   *  Stamped onto each CatalogItem so getSnapshot can filter to the
   *  current segment for the brain's per-turn view. Empty string =
   *  no plan / free-conversation session (filter is a no-op then). */
  private currentSegmentId = '';

  /** Update the current-segment marker. Subsequent append()s stamp
   *  this segmentId on their items. The orchestrator calls this on
   *  every brain turn to mirror lessonPlanRef + currentSegmentIdRef
   *  state into the catalog. Idempotent. */
  setCurrentSegment(segmentId: string): void {
    this.currentSegmentId = segmentId || '';
  }

  append(input: {
    itemId: string;
    action: string;
    pageTitle?: string;
    title?: string;
    signature?: string;
    features: FeatureManifestEntry[];
  }): CatalogItem {
    const features: CatalogFeature[] = input.features.map((f) => ({
      canonical: f.name,
      kind: f.kind,
      description: f.description,
      bbox: f.bbox,
      labels: canonicalizeLabels(f),
      scribbleable: f.scribbleable !== false,
    }));
    // Synthesize a whole-item feature so the tutor can scrollTo using the
    // item's title or a pretty-printed action ("the energy bar chart").
    // The boardSnapshot surfaces titles; without this, the tutor pastes
    // them into scrollTo and gets a no_match because no feature uses the
    // title as a label. The synthetic feature's canonical = itemId never
    // matches a data-feature element, so the renderer's scrollTo handler
    // falls through to itemEl.scrollIntoView — exactly the right
    // behavior for "scroll to the chart". Marked non-scribbleable on
    // purpose: circling a whole item is rarely the right ask, and the
    // tutor should pick a sub-feature for marks.
    //
    // CRITICAL: Dedupe against existing feature labels first. For
    // "atomic" items (e.g. showEquation: features = [equation,
    // equation-label]), the title is ALREADY a label on the primary
    // equation feature. If we add a non-scribbleable synthetic with the
    // same label, the resolver's newest-first iteration picks the
    // synthetic and scribble rejects with whole-item-alias. Dropping
    // already-covered labels means the synthetic only carries genuinely
    // new aliases (generic action words like "the chart") — and
    // disappears entirely for atomic items where every alias collides.
    const wholeItemLabels = wholeItemLabelsFor(input.action, input.title);
    if (wholeItemLabels.length > 0) {
      const existingLabelSet = new Set<string>();
      for (const f of features) {
        for (const l of f.labels) existingLabelSet.add(normalizeToken(l));
      }
      const novelLabels = wholeItemLabels.filter((l) => !existingLabelSet.has(normalizeToken(l)));
      if (novelLabels.length > 0) {
        features.unshift({
          canonical: input.itemId,
          kind: 'region',
          description: input.title
            ? `whole item: ${input.title}`
            : `whole ${prettyAction(input.action)}`,
          labels: novelLabels,
          scribbleable: false,
        });
      }
    }
    const item: CatalogItem = {
      itemId: input.itemId,
      order: this.nextOrder++,
      action: input.action,
      pageTitle: input.pageTitle,
      title: input.title,
      signature: input.signature,
      segmentId: this.currentSegmentId || undefined,
      features,
    };
    const existing = this.items.findIndex((i) => i.itemId === input.itemId);
    if (existing >= 0) {
      this.items[existing] = { ...item, order: this.items[existing].order };
    } else {
      this.items.push(item);
    }
    return item;
  }

  /** Find an existing item with this exact tool-args signature, if any. */
  findBySignature(signature: string): CatalogItem | undefined {
    if (!signature) return undefined;
    return this.items.find((i) => i.signature === signature);
  }

  /**
   * Compact per-turn board state appended to every show_* tool_result.
   * Lets the tutor see what is already drawn and route through
   * tutor_scroll_whiteboard / tutor_scribble instead of redrawing.
   *
   * When `opts.currentSegmentId` is provided, the snapshot is FILTERED
   * to items stamped with that segmentId. This is the auto-clear
   * mechanism: the brain only sees current-segment content per turn,
   * keeping its prompt focused and the judge LLM unambiguous about
   * which card the student is looking at. Items from prior segments
   * remain in the catalog (still scrollable for the student) but
   * don't bloat the brain's view. Items with NO segmentId (e.g.,
   * free-conversation sessions, or items appended before the
   * orchestrator wired setCurrentSegment) are always included so we
   * don't accidentally hide free-form content.
   */
  getSnapshot(opts?: { currentSegmentId?: string }): CatalogSnapshotEntry[] {
    const filterSeg = opts?.currentSegmentId;
    const items = filterSeg
      ? this.items.filter((it) => !it.segmentId || it.segmentId === filterSeg)
      : this.items;
    return items.map((it) => ({
      itemId: it.itemId,
      action: it.action,
      title: it.title,
      pageTitle: it.pageTitle,
      featureCount: it.features.length,
      segmentId: it.segmentId,
      // Pull a compact list of per-feature descriptions. Skip the synthetic
      // whole-item region (kind === 'region') — its description is just the
      // title we already surface above. The remaining descriptions carry
      // the structural detail (coordinates for points, endpoint refs for
      // segments) that the brain needs to extend a figure consistently.
      features: it.features
        .filter((f) => f.kind !== 'region' && !!f.description)
        .map((f) => ({
          canonical: f.canonical,
          kind: f.kind,
          description: f.description,
        })),
    }));
  }

  getItems(): ReadonlyArray<CatalogItem> {
    return this.items;
  }

  /** Most-recent-first iteration — resolveTarget prefers newer items on ties. */
  getItemsReversed(): ReadonlyArray<CatalogItem> {
    return [...this.items].reverse();
  }

  getItem(itemId: string): CatalogItem | undefined {
    return this.items.find((i) => i.itemId === itemId);
  }

  /** Resolve a query against page TITLES (not feature names). Used as a
   *  scroll-handler fallback when the brain emits the page title as the
   *  scrollTo target (e.g. `target: "Six Kingdoms"` after a recent
   *  new_page call). Matches any item whose pageTitle normalizes to the
   *  same token as the query; returns the most recent such item so the
   *  scroll lands at the page's current bottom. Returns null when no
   *  page title matches. */
  resolvePageTitle(raw: string): { pageTitle: string; itemId: string } | null {
    const q = normalizeToken(raw);
    if (!q) return null;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (!item.pageTitle) continue;
      if (normalizeToken(item.pageTitle) === q) {
        return { pageTitle: item.pageTitle, itemId: item.itemId };
      }
    }
    return null;
  }

  clear(): void {
    this.items = [];
    this.nextOrder = 0;
  }

  /**
   * Deterministic target resolution. Priority:
   *   1. Exact match against canonical OR any label (newest item first).
   *   2. Bare identifier ("a", "x1") → canonical ending in "-a", "-x1".
   *
   * Ambiguity rule: if a single target matches features on 2+ DISTINCT
   * items AND those items can be disambiguated by other labels, return
   * an ambiguous-failure with a list of distinguishing target strings —
   * the tutor must retry with a specific one. Without this, generic
   * targets like "the equation" silently land on the most recent
   * equation, which is wrong when the tutor meant an earlier one
   * (2026-04-25 cubic-roots session: "the equation" hit Quadratic
   * formula setup instead of Set equal for intersection). When no
   * distinguishing labels exist (e.g., two identical "object" features),
   * we fall back to newest-first.
   */
  resolveTarget(raw: string): ResolveResult {
    const q = normalizeToken(raw);
    if (!q) {
      return {
        ok: false,
        reason: 'empty_query',
        message: 'target is empty — specify which feature to mark.',
        candidates: this.candidatesList(),
      };
    }
    if (this.items.length === 0) {
      return {
        ok: false,
        reason: 'no_items',
        message: 'Nothing has been drawn on the whiteboard yet — render a show_* item first.',
        candidates: [],
      };
    }

    // Phase 1: collect ONE matching feature per item (newest-first, first
    // matching feature within the item wins). Multiple items in this
    // map = ambiguous match.
    const matches = new Map<string, { item: CatalogItem; feature: CatalogFeature }>();
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (matches.has(item.itemId)) continue;
      for (const f of item.features) {
        if (normalizeToken(f.canonical) === q || f.labels.some((l) => normalizeToken(l) === q)) {
          matches.set(item.itemId, { item, feature: f });
          break;
        }
      }
    }

    // Phase 2: bare-identifier fallback only if Phase 1 found nothing.
    if (matches.size === 0 && /^[a-z0-9]{1,4}$/.test(q)) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (matches.has(item.itemId)) continue;
        for (const f of item.features) {
          if (f.canonical.endsWith(`-${q}`)) {
            matches.set(item.itemId, { item, feature: f });
            break;
          }
        }
      }
    }

    if (matches.size === 0) {
      return {
        ok: false,
        reason: 'no_match',
        message: `No feature matching "${raw}" on the current whiteboard.`,
        candidates: this.candidatesForQuery(q, 14),
      };
    }

    if (matches.size === 1) {
      const { item, feature } = matches.values().next().value!;
      return this.ok(item, feature);
    }

    // Ambiguous: 2+ items matched the same target. Find a distinguishing
    // label for each (a label that NO other matched item's feature has).
    const matchList = Array.from(matches.values());
    const distinguishers = matchList.map(({ item, feature }) => {
      const candidates = [feature.canonical, ...feature.labels];
      for (const label of candidates) {
        const labelNorm = normalizeToken(label);
        if (!labelNorm || labelNorm === q) continue;
        const sharedWithOther = matchList.some(
          (m) => m.item.itemId !== item.itemId
            && [m.feature.canonical, ...m.feature.labels].some((l) => normalizeToken(l) === labelNorm),
        );
        if (!sharedWithOther) {
          return { item, feature, distinguishLabel: label };
        }
      }
      return { item, feature, distinguishLabel: null as string | null };
    });

    const hasDistinguishers = distinguishers.some((d) => d.distinguishLabel !== null);
    if (!hasDistinguishers) {
      // No way to disambiguate — accept newest-first match.
      const newest = matchList[0];
      return this.ok(newest.item, newest.feature);
    }

    return {
      ok: false,
      reason: 'ambiguous',
      message: `"${raw}" matches ${matches.size} items on the whiteboard. Specify which one by its distinguishing label.`,
      candidates: distinguishers.map((d) => ({
        target: d.distinguishLabel ?? d.feature.canonical,
        on: describeItem(d.item),
      })),
    };
  }

  private ok(item: CatalogItem, f: CatalogFeature): ResolveSuccess {
    return {
      ok: true,
      itemId: item.itemId,
      canonical: f.canonical,
      kind: f.kind,
      bbox: f.bbox,
      scribbleable: f.scribbleable,
      action: item.action,
    };
  }

  /**
   * Flat list of (preferred-label, item-description) pairs distributed
   * round-robin across items so every item gets at least one entry
   * before any single item monopolises the slice. Without this, a
   * feature-rich item (e.g. a flowchart with 12 edges) fills the cap
   * entirely and the tutor never sees that other items exist on the
   * board — leading to "the graph isn't here, let me redraw it"
   * regressions (2026-04-24 calc session: tutor missed an existing
   * Desmos graph because all 12 hint slots went to flowchart edges).
   */
  private candidatesList(limit = 24): Array<{ target: string; on: string }> {
    const out: Array<{ target: string; on: string }> = [];
    if (this.items.length === 0) return out;
    let level = 0;
    let advanced = true;
    while (advanced && out.length < limit) {
      advanced = false;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        const f = item.features[level];
        if (!f) continue;
        const preferred = pickDisplayLabel(f);
        out.push({ target: preferred, on: describeItem(item) });
        advanced = true;
        if (out.length >= limit) return out;
      }
      level += 1;
    }
    return out;
  }

  /**
   * Query-aware candidates: rank items by token overlap between the
   * normalized query and each item's feature labels, then take that
   * top item's features first before falling back to round-robin. The
   * tutor's miss usually carries enough words ("step 3 result", "the
   * KE bar", "vertex C") to identify which item it meant; surfacing
   * THAT item's features first means the next retry almost always
   * succeeds. Without this, a "final answer" miss returns a list
   * dominated by axis labels and edges from unrelated items.
   */
  private candidatesForQuery(normalizedQuery: string, limit = 14): Array<{ target: string; on: string }> {
    if (this.items.length === 0) return [];
    const queryTokens = normalizedQuery.split('-').filter((t) => t.length > 1);
    if (queryTokens.length === 0) return this.candidatesList(limit);

    const score = (item: CatalogItem): number => {
      let s = 0;
      for (const f of item.features) {
        const labelText = [f.canonical, ...f.labels].map((l) => normalizeToken(l)).join(' ');
        for (const tok of queryTokens) {
          if (labelText.includes(tok)) s += 1;
        }
      }
      // Bias toward newer items on ties — the tutor most often refers
      // to the most recent thing it drew.
      return s + item.order * 0.001;
    };

    const ranked = [...this.items]
      .map((it) => ({ item: it, s: score(it) }))
      .sort((a, b) => b.s - a.s);

    const out: Array<{ target: string; on: string }> = [];
    if (ranked[0] && ranked[0].s > 0) {
      // Front-load the best-matching item's features.
      const best = ranked[0].item;
      for (const f of best.features) {
        if (out.length >= Math.min(8, limit)) break;
        out.push({ target: pickDisplayLabel(f), on: describeItem(best) });
      }
    }
    // Fill remaining slots with round-robin from other items so the tutor
    // still sees that other items exist on the board.
    const rrPool: Array<CatalogItem> = ranked.map((r) => r.item).filter((it) => it !== ranked[0]?.item);
    let level = 0;
    while (out.length < limit) {
      let advanced = false;
      for (const item of rrPool) {
        const f = item.features[level];
        if (!f) continue;
        out.push({ target: pickDisplayLabel(f), on: describeItem(item) });
        advanced = true;
        if (out.length >= limit) return out;
      }
      if (!advanced) break;
      level += 1;
    }
    return out;
  }

  /**
   * Items currently on the board whose features are non-scribbleable
   * (iframe-backed). Used by the handler to attach a redirect hint to
   * scribble misses — when the tutor's target probably lives inside an
   * iframe, the right action is tutor_scroll_whiteboard, never redraw.
   */
  getNonScribbleableItems(): CatalogItem[] {
    return this.items.filter((item) =>
      item.features.length > 0 && item.features.every((f) => !f.scribbleable),
    );
  }
}

function describeItem(item: CatalogItem): string {
  const pretty = prettyAction(item.action);
  if (item.title) return `${pretty} "${item.title}"`;
  return item.pageTitle ? `${pretty} (${item.pageTitle})` : `${pretty} [${item.itemId}]`;
}

/**
 * Pick the most natural-language label to surface in rejection candidate
 * lists. Dash-cased canonicals like "bar-release-10-m" actively HURT the
 * model: it sees "bar-X" in the hint, decides "bar-" is a universal
 * prefix, then invents "bar-Top" / "bar-1" / "bar-Release-ke" which all
 * fail. Preferring a spaced, human-readable alias ("Release (10 m)" or
 * "the Release bar") lets the next retry actually succeed.
 */
function pickDisplayLabel(f: CatalogFeature): string {
  for (const l of f.labels) {
    const trimmed = l.trim();
    if (!trimmed) continue;
    // Skip pure canonical-style strings (all-lowercase, dashed, no space).
    if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(trimmed)) continue;
    if (trimmed.includes(' ')) return trimmed;
  }
  // No spaced alias — pick the first non-canonical label, or fall back.
  for (const l of f.labels) {
    if (l && l !== f.canonical) return l;
  }
  return f.labels[0] || f.canonical;
}

/**
 * "showEnergyBars" → "Energy Bars". Used in describeItem (catalog hints)
 * and to seed whole-item synonyms ("the energy bars chart").
 */
function prettyAction(action: string): string {
  return action.replace(/^show/, '').replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Synonyms that resolve to the whole item. Includes the literal title,
 * a pretty action label, and a small set of generic synonyms keyed off
 * the action. Keep this short — the catalog's ambiguity rejection
 * handles cases where 2+ items share a label, so the tutor gets a
 * disambiguation hint instead of marking the wrong item.
 */
function wholeItemLabelsFor(action: string, title?: string): string[] {
  const out = new Set<string>();
  if (title) {
    out.add(title);
    out.add(title.toLowerCase());
  }
  const pretty = prettyAction(action);
  if (pretty) {
    out.add(pretty);
    out.add(`the ${pretty.toLowerCase()}`);
  }
  // Action-specific generic synonyms. The tutor often refers to its own
  // work in these terms ("the chart", "the diagram", "the equation");
  // resolving them to the whole item lets scrollTo land cleanly without
  // requiring the tutor to remember a specific feature label.
  const GENERIC: Record<string, string[]> = {
    showEnergyBars: ['the chart', 'the energy chart', 'the energy bar chart', 'the bar chart', 'the energy diagram'],
    showSolution: ['the solution', 'the steps', 'the worked solution'],
    showProblem: ['the problem', 'the problem card', 'the question'],
    showEquation: ['the equation', 'the formula'],
    showTable: ['the table', 'the data table'],
    showCode: ['the code', 'the code block'],
    showGraph: ['the graph', 'the plot'],
    showScatterPlot: ['the chart', 'the scatter plot', 'the scatter chart'],
    showCoordinatePlane: ['the diagram', 'the coordinate plane', 'the plane'],
    showGeometry: ['the diagram', 'the figure', 'the shape'],
    showMolecule: ['the molecule', 'the structure'],
    showCircuit: ['the circuit', 'the circuit diagram'],
    showFreeBodyDiagram: ['the diagram', 'the FBD', 'the free body diagram'],
    showFlowchart: ['the flowchart', 'the flow chart', 'the diagram'],
    showCellDiagram: ['the diagram', 'the cell diagram', 'the cell'],
    showFoodWeb: ['the food web', 'the diagram'],
    showPedigree: ['the pedigree', 'the family tree'],
    showTree: ['the tree', 'the tree diagram'],
    showVennDiagram: ['the diagram', 'the venn diagram'],
    showTimeline: ['the timeline'],
    showMap: ['the map'],
    showNumberLine: ['the number line'],
    showFractionBar: ['the fraction bar', 'the diagram'],
    showUnitCircle: ['the unit circle'],
    showVector: ['the vector', 'the diagram'],
    showWave: ['the wave', 'the diagram'],
    showPendulum: ['the pendulum', 'the diagram'],
    showProjectileMotion: ['the diagram', 'the projectile diagram'],
    showMotionDiagram: ['the motion diagram', 'the diagram'],
    showCollision: ['the collision', 'the diagram'],
    showSimpleMachine: ['the diagram', 'the machine'],
    showRayDiagram: ['the ray diagram', 'the diagram'],
    showSpringMass: ['the diagram', 'the spring-mass system'],
    showStats: ['the chart', 'the diagram'],
    showManipulative: ['the diagram'],
    showLewis: ['the lewis structure', 'the diagram'],
    showOrbitalDiagram: ['the orbital diagram', 'the diagram'],
    showPeriodicTable: ['the periodic table', 'the table'],
    showCycleDiagram: ['the cycle', 'the diagram'],
    showConceptMap: ['the concept map', 'the diagram'],
    showReactionCoordinate: ['the reaction coordinate', 'the diagram'],
    showDna: ['the DNA', 'the diagram'],
  };
  for (const g of GENERIC[action] ?? []) out.add(g);
  return Array.from(out);
}

/**
 * Stable hash of a show_* tool's args. Used for duplicate detection — two
 * calls with the same canonicalized JSON are treated as the same item.
 *
 * Strips bookkeeping fields (id, action, _internal markers, computed
 * targetId/targetFeature stamps) before hashing so signatures collide on
 * the user-meaningful payload only. Keys are sorted for determinism.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildShowSignature(action: string, cmd: any): string {
  // Decorative / orchestration fields that don't change the rendered
  // figure. Stripping `title` (and similar) so two calls with the
  // same parametric content but different headings dedup as one
  // diagram. Otherwise the brain re-renders the same figure under a
  // new section heading instead of scrolling — observed 2026-04-30
  // cell-bio session, where 9 identical earth_layers diagrams were
  // emitted across the session because each had a different
  // "Inside the Earth" / "Earth's Four Layers" / etc. title.
  const STRIP = new Set([
    'id', 'action', 'page', 'targetId', 'targetFeature',
    'targetItemIndex', 'targetPageIndex', 'targetPageTitle',
    '_scribbleRejected', '_duplicateOf',
    'title', 'heading', 'label',
    // Metadata that decorates the rendered card (badge / source tag /
    // difficulty pill) but doesn't change the rendered figure's
    // content. Two problem cards with the same `statement` should
    // dedup as one regardless of whether one came in via
    // show_segment_card (no difficultyLabel) and another via
    // show_problem (difficultyLabel="medium"). Observed 2026-05-04
    // AP Precalc session: judge-killed show_segment_card("try-1")
    // stayed on board, retry's free-form show_problem had identical
    // statement but added difficultyLabel — both cards rendered.
    'difficultyLabel', 'sourceTag', 'difficulty', 'source',
  ]);
  const seen = new WeakSet<object>();
  const canon = (v: unknown): unknown => {
    if (v === null || typeof v !== 'object') return v;
    if (seen.has(v as object)) return undefined;
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(canon);
    const out: Record<string, unknown> = {};
    const keys = Object.keys(v as Record<string, unknown>).filter((k) => !STRIP.has(k)).sort();
    for (const k of keys) {
      const cv = canon((v as Record<string, unknown>)[k]);
      if (cv !== undefined) out[k] = cv;
    }
    return out;
  };
  try {
    return `${action}|${JSON.stringify(canon(cmd))}`;
  } catch {
    return `${action}|<unhashable>`;
  }
}

/**
 * Best-effort extraction of a human-readable title from a show_* command,
 * for snapshot rendering and the catalog's `describeItem`. Looks at common
 * places title-bearing data lives across our renderers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractCommandTitle(cmd: any): string | undefined {
  if (!cmd || typeof cmd !== 'object') return undefined;
  const candidates = [
    cmd.title,
    cmd.problem?.title,
    cmd.label,
    cmd.equation?.label,
    cmd.heading,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return undefined;
}
