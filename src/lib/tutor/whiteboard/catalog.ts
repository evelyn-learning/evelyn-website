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
  /** Friendly display name for the strip / hints. Falls through from the
   *  manifest builder if set; else the catalog leaves it undefined. */
  displayName?: string;
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
  /** Id of the Page (see {@link Page}) that was active when this item was
   *  appended. The first-class successor to pageTitle — a page's items are
   *  DERIVED by filtering on this field (single source of truth, no stored
   *  item lists). Undefined for items appended before any page was opened. */
  pageId?: string;
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
 * A first-class whiteboard page — one coherent subject/figure exploration
 * unit (the parabola: graph it, find its focus, do a problem on it = ONE
 * Page). Replaces the prior ephemeral "page is just a title string" model.
 * See project_tutor_page_grouping_design.md.
 *
 * Items are NOT stored on the Page — a page's items are derived by filtering
 * catalog items on `pageId` (single source of truth). The fields here are
 * page-level identity + lifecycle metadata only.
 */
export interface Page {
  /** Stable, session-unique id. Counter-based ("page-1", "page-2", …). */
  id: string;
  /** Human-readable page title (from the newPage command or first render). */
  title: string;
  /** Lesson-plan segment active when the page opened. Empty for free convo. */
  segmentId?: string;
  /** Subject key of the page's anchor render — the deterministic identity
   *  the H6 same-segment-different-figure backstop compares against. Set
   *  from the first PRIMARY-figure item appended; transfers on kill-recovery
   *  / redraw replace. Undefined until a primary figure lands. */
  anchorKey?: string;
  /** itemId of the anchor (primary-figure) render. Transfers on replace. */
  anchorItemId?: string;
  /** Turn index when the page was opened. */
  openedAtTurn: number;
  /** Turn index of the most recent render appended to this page. Drives the
   *  staleness backstop (a page gone N render-less turns is auto-closed). */
  lastRenderTurn: number;
  /** True when this is an overflow continuation page ("Title (cont.)"). It
   *  shares the parent's anchorKey — grouping + Board Map treat the parent
   *  and its continuations as one logical subject. */
  isContinuation?: boolean;
  /** For a continuation page: the id of the page it continues. */
  parentPageId?: string;
}

/**
 * One row of the Board Map page index ({@link WhiteboardCatalog.getPageIndex}).
 * Surfaced to the brain as the `<whiteboard_pages>` block so it can address
 * an earlier page by number via go_to_page. (Board Map feature — this is the
 * seam the page-grouping work exposes for it.)
 */
export interface PageIndexEntry {
  /** 1-based page number in creation order (the addressable handle). */
  number: number;
  id: string;
  title: string;
  /** Distinct prettified artifact kinds on the page (e.g. ["Function Graph",
   *  "Equation"]) — derived from the page's items' actions. */
  artifactTypes: string[];
  isContinuation?: boolean;
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
  /** Id of the Page this item lives on (mirrors CatalogItem.pageId). */
  pageId?: string;
  featureCount: number;
  /** Segment id the entry was appended in (mirrors CatalogItem.segmentId).
   *  When the brain's per-turn snapshot filters by segment, the entries
   *  that survive will all have the same segmentId — but we still
   *  surface the field for downstream debugging / telemetry. */
  segmentId?: string;
  /** True when the item's pageTitle equals the catalog's currentPageTitle
   *  at snapshot time — i.e., the item is on the page the student is
   *  looking at right now. False/undefined means the item is on a
   *  previous page; the brain must scroll to it (tutor_scroll_whiteboard)
   *  before narrating about it. Always undefined when no current page
   *  has been registered (free-conversation sessions / pre-newPage). */
  isOnCurrentPage?: boolean;
  /** True when the item lives on the catalog's ACTIVE page (the page new
   *  teaching renders currently accumulate onto). Distinct from
   *  isOnCurrentPage, which tracks the VIEW (where the student is looking).
   *  Active page vs. view position are intentionally separate (the Board Map
   *  seam). Undefined when no page is active. */
  isOnActivePage?: boolean;
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
  /** Friendly display name from the manifest. Orchestrator stamps it
   *  onto the scribble cmd so the strip can read it instantly without
   *  racing a DOM lookup against the first render. */
  displayName?: string;
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

  /** Currently-visible page title — the page the student is looking at
   *  RIGHT NOW. Set by the orchestrator on every newPage processed.
   *  Used to flag CatalogSnapshotEntry.isOnCurrentPage so the brain
   *  knows whether an item it wants to reference is actually visible
   *  (vs. on a previous page that requires a tutor_scroll_whiteboard
   *  before narrating about it). Observed 2026-05-07 G5 carbon-cycle
   *  test: brain said "take a look at the cycle on the board" while
   *  the student was on a fresh empty page — cycle was on the prior
   *  page, brain didn't know it had moved. */
  private currentPageTitle = '';

  /** Ordered list of first-class Pages opened this session. See {@link Page}.
   *  Items reference these by pageId; a page's items are derived by filtering
   *  this.items, never stored on the Page. */
  private pages: Page[] = [];
  /** Id of the active page — where new teaching renders accumulate. Distinct
   *  from currentPageTitle (the VIEW). Null before any page is opened. */
  private activePageId: string | null = null;
  /** Monotonic page-id counter ("page-1", "page-2", …). */
  private nextPageNum = 1;
  /** Current turn index, mirrored from the orchestrator (setCurrentTurn).
   *  Stamped onto Page.openedAtTurn / lastRenderTurn for the staleness
   *  backstop. 0 until the orchestrator wires it. */
  private currentTurn = 0;

  /** Mirror the orchestrator's turn counter so page lifecycle metadata
   *  (openedAtTurn / lastRenderTurn) is accurate. Idempotent. */
  setCurrentTurn(turn: number): void {
    this.currentTurn = Number.isFinite(turn) ? turn : 0;
  }

  /** Open a fresh page, make it active, and return its id. The caller (the
   *  page-grouping decision module via the orchestrator) decides WHEN to
   *  open; this method only allocates + activates. A continuation page
   *  inherits its parent's anchorKey so grouping treats the unit as one
   *  subject. */
  openPage(input: {
    title?: string;
    segmentId?: string;
    isContinuation?: boolean;
    parentPageId?: string;
  } = {}): string {
    const id = `page-${this.nextPageNum++}`;
    const parent = input.parentPageId
      ? this.pages.find((p) => p.id === input.parentPageId)
      : undefined;
    const page: Page = {
      id,
      title: (input.title ?? '').trim(),
      segmentId: input.segmentId ?? (this.currentSegmentId || undefined),
      openedAtTurn: this.currentTurn,
      lastRenderTurn: this.currentTurn,
      isContinuation: input.isContinuation || undefined,
      parentPageId: input.parentPageId,
      // A continuation shares the parent's subject identity.
      anchorKey: parent?.anchorKey,
      anchorItemId: undefined,
    };
    this.pages.push(page);
    this.activePageId = id;
    return id;
  }

  /** Re-activate an existing page (e.g. resuming work on it). No-op if the
   *  id is unknown. Note: navigation/scroll does NOT call this — the VIEW is
   *  tracked separately via setCurrentPage. */
  setActivePage(pageId: string): void {
    if (this.pages.some((p) => p.id === pageId)) this.activePageId = pageId;
  }

  getActivePageId(): string | null {
    return this.activePageId;
  }

  getActivePage(): Page | undefined {
    return this.activePageId
      ? this.pages.find((p) => p.id === this.activePageId)
      : undefined;
  }

  getPages(): ReadonlyArray<Page> {
    return this.pages;
  }

  getPage(pageId: string): Page | undefined {
    return this.pages.find((p) => p.id === pageId);
  }

  /** Number of items currently on a page (derived — items are the source of
   *  truth). Used by the overflow guard and empty-page GC. */
  pageItemCount(pageId: string): number {
    return this.items.reduce((n, it) => (it.pageId === pageId ? n + 1 : n), 0);
  }

  /** Set/transfer the anchor (primary-figure identity) of a page. Called when
   *  the first primary figure lands, and on kill-recovery / redraw replace so
   *  the replacement becomes the new anchor and page identity stays coherent. */
  setPageAnchor(pageId: string, anchorItemId: string, anchorKey: string): void {
    const page = this.pages.find((p) => p.id === pageId);
    if (!page) return;
    page.anchorItemId = anchorItemId;
    page.anchorKey = anchorKey;
  }

  /** Drop any page that has zero derived items (empty-page GC). Returns the
   *  ids removed. Called after removeByIds so a kill-recovery sweep that
   *  empties a page doesn't leave a phantom page in the Board Map index. The
   *  active page is preserved even when empty (it's about to receive a
   *  render); only NON-active empty pages are collected. */
  gcEmptyPages(): string[] {
    const removed: string[] = [];
    this.pages = this.pages.filter((p) => {
      if (p.id === this.activePageId) return true;
      if (this.pageItemCount(p.id) > 0) return true;
      removed.push(p.id);
      return false;
    });
    return removed;
  }

  /** Compact page index for the Board Map `<whiteboard_pages>` block. One row
   *  per page, in creation order, with the distinct artifact kinds on each. */
  getPageIndex(): PageIndexEntry[] {
    return this.pages.map((p, i) => {
      const types = new Set<string>();
      for (const it of this.items) {
        if (it.pageId === p.id) types.add(prettyAction(it.action));
      }
      return {
        number: i + 1,
        id: p.id,
        title: p.title,
        artifactTypes: Array.from(types),
        isContinuation: p.isContinuation,
      };
    });
  }

  /** Update the current-segment marker. Subsequent append()s stamp
   *  this segmentId on their items. The orchestrator calls this on
   *  every brain turn to mirror lessonPlanRef + currentSegmentIdRef
   *  state into the catalog. Idempotent. */
  setCurrentSegment(segmentId: string): void {
    this.currentSegmentId = segmentId || '';
  }

  /** Update the current-visible-page marker. The orchestrator calls
   *  this whenever a newPage command processes (the brain explicitly
   *  switched pages). Idempotent.
   *
   *  Phase 1 bridge: a newPage flows through here, so this is also where the
   *  first-class Page model is populated off the EXISTING newPage path —
   *  behavior-neutral (nothing reads the Page model yet). A new title that
   *  differs from the active page opens a fresh Page. Phase 3 will drive
   *  openPage() directly from the page-grouping decision module and this
   *  bridge can be retired. */
  setCurrentPage(pageTitle: string | undefined): void {
    const title = (pageTitle ?? '').trim();
    this.currentPageTitle = title;
    const active = this.getActivePage();
    if (!active || active.title !== title) {
      this.openPage({ title });
    }
  }

  getCurrentPageTitle(): string {
    return this.currentPageTitle;
  }

  append(input: {
    itemId: string;
    action: string;
    pageTitle?: string;
    /** Page to stamp this item onto. Defaults to the active page. Phase 3
     *  passes an explicit id to pin a kill-recovery replacement to the killed
     *  render's page (replace-in-place beats any split signal). */
    pageId?: string;
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
      displayName: f.displayName,
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
    const pageId = input.pageId ?? this.activePageId ?? undefined;
    const item: CatalogItem = {
      itemId: input.itemId,
      order: this.nextOrder++,
      action: input.action,
      pageTitle: input.pageTitle,
      pageId,
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
    // Page lifecycle bookkeeping: bump the render-turn watermark (staleness
    // backstop) and seed a provisional anchor if the page has none yet. The
    // PRIMARY-figure anchor + anchorKey are set explicitly by the orchestrator
    // via setPageAnchor (it has the raw command); this only ensures a page
    // that received a render has some anchorItemId for empty-page reasoning.
    if (pageId) {
      const page = this.pages.find((p) => p.id === pageId);
      if (page) {
        page.lastRenderTurn = this.currentTurn;
        if (!page.anchorItemId) page.anchorItemId = item.itemId;
      }
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
    const currentPage = this.currentPageTitle;
    const haveCurrentPage = currentPage.length > 0;
    const activePageId = this.activePageId;
    return items.map((it) => ({
      itemId: it.itemId,
      action: it.action,
      title: it.title,
      pageTitle: it.pageTitle,
      pageId: it.pageId,
      featureCount: it.features.length,
      segmentId: it.segmentId,
      isOnCurrentPage: haveCurrentPage
        ? (it.pageTitle ?? '').trim() === currentPage
        : undefined,
      isOnActivePage: activePageId ? it.pageId === activePageId : undefined,
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

  /** Forget the listed items. Called by the orchestrator when a brain
   *  attempt is killed AFTER it dispatched renders — the figures are
   *  pulled off the board (via a 'removeItems' whiteboard command), so
   *  the catalog must also drop them or the brain's per-turn snapshot
   *  and scribble/scroll target resolution would still reference renders
   *  the student can no longer see. Returns the count actually removed. */
  removeByIds(ids: string[]): number {
    if (ids.length === 0) return 0;
    const drop = new Set(ids);
    const before = this.items.length;
    this.items = this.items.filter((it) => !drop.has(it.itemId));
    // Empty-page GC: a sweep (e.g. kill-recovery) may have emptied a page.
    // Drop now-empty non-active pages so they don't linger in the Board Map
    // index. Also clear a stale anchor that pointed at a removed item.
    for (const page of this.pages) {
      if (page.anchorItemId && drop.has(page.anchorItemId)) {
        page.anchorItemId = undefined;
      }
    }
    this.gcEmptyPages();
    return before - this.items.length;
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
    this.pages = [];
    this.activePageId = null;
    this.nextPageNum = 1;
    this.currentPageTitle = '';
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
    //
    // Phase 1a (exact case-insensitive label match) runs FIRST so that a
    // query with a normalize-stripped distinguisher (apostrophe, prime,
    // dash) still routes to the right feature. Example: query="Ms'"
    // normalizes to "ms" and so does the unshifted Ms label "Ms" —
    // both would match in normalized form, with first-registered (Ms)
    // winning. The exact-match phase routes "Ms'" to the shifted
    // feature whose label literally is "Ms'".
    const matches = new Map<string, { item: CatalogItem; feature: CatalogFeature }>();
    const rawLower = String(raw ?? '').trim().toLowerCase();
    if (rawLower) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (matches.has(item.itemId)) continue;
        for (const f of item.features) {
          if (
            f.canonical.toLowerCase() === rawLower ||
            f.labels.some((l) => l.toLowerCase() === rawLower) ||
            // Description-verbatim match. The brain habitually copies the
            // manifest's `description` field literally into the scribble
            // target (observed 2026-05-14 Phase 5 BST session: targets
            // like `node "4" (leaf) at depth 2` and
            // `output column "A AND B"` came straight from the
            // description and silent-dropped because no label carried
            // the depth-suffix / column-prefix exactly). Cheaper to
            // accept the description here than to enumerate every
            // suffix variant in every manifest's labels list.
            (typeof f.description === 'string' && f.description.toLowerCase() === rawLower)
          ) {
            matches.set(item.itemId, { item, feature: f });
            break;
          }
        }
      }
    }
    // Phase 1b: fall back to normalized matching for items that didn't
    // exact-match (the common case).
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (matches.has(item.itemId)) continue;
      for (const f of item.features) {
        if (
          normalizeToken(f.canonical) === q ||
          f.labels.some((l) => normalizeToken(l) === q) ||
          (typeof f.description === 'string' && normalizeToken(f.description) === q)
        ) {
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

    // Ambiguous: 2+ items matched the same target. Newest-first wins
    // silently. The brain is almost always referring to the diagram it
    // just emitted, so returning an `ambiguous` error here forced the
    // orchestrator to silent-drop the scribble — yet the brain's
    // intent (mark the newest match) was clear (observed 2026-05-13
    // session: target="claim" silent-dropped because two
    // argument_structure diagrams shared the "claim" label;
    // target="left-column" silent-dropped across two t_charts).
    //
    // `matches` is built newest-first (items iterated from
    // this.items.length - 1 downward), so matchList[0] is the most
    // recent item that matched. Accept it.
    //
    // We keep the distinguisher-walk only for the rare case where the
    // brain's query is so generic that every item on the board could
    // mean it (and the brain genuinely needs a hint to disambiguate).
    // That case is now unreachable in practice — soft pedagogy aids
    // (scribble) deserve "go with the latest", not a retry cycle.
    const matchList = Array.from(matches.values());
    const newest = matchList[0];
    return this.ok(newest.item, newest.feature);
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
      displayName: f.displayName,
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
 * Per-kind structural-signature rules for "organizer" renderers where the
 * brain re-emits the SAME diagram on a follow-up turn with slightly
 * different wording for the content cells (e.g., comparison_table emitted
 * twice with cells=[["Fixed shape", …]] then [["Fixed", …]]).
 *
 * The generic JSON-canonicalization path treats those as DIFFERENT items
 * because the cell strings differ. The cross-turn dedup at
 * VoiceTutorRealtime.handleWhiteboardCommand misses, the same figure
 * renders twice, and the student sees stacked near-duplicates.
 *
 * For these kinds the structural identity lives in the AXES (headers /
 * items / attributes / term / claim / stage labels), not the content
 * cells. Returning a signature built from axes only collapses those
 * near-duplicates correctly.
 *
 * Confirmed re-emission cases (audit 2026-05-13):
 *   - showTable: headers structural, rows content (legacy F-13).
 *   - showDiagram(comparison_table): items + attributes structural,
 *     cells content (today's confirmed bug).
 *   - showDiagram(t_chart): left/rightHeader structural, items content.
 *   - showDiagram(frayer_model): term structural, definition/examples/
 *     nonExamples content.
 *   - showDiagram(hierarchy_pyramid): tier LABELS structural,
 *     descriptions content.
 *   - showDiagram(argument_structure): claim structural, evidence/
 *     reasoning content.
 *   - showDiagram(government_branches): country + branch NAMES
 *     structural, bodies/powers content.
 *   - showDiagram(body_system): system + part LABELS structural,
 *     descriptions content.
 *   - showDiagram(life_cycle | water_cycle | rock_cycle): stage LABELS
 *     structural, descriptions content.
 *
 * Add a kind to this dispatcher when you see the brain re-emit the SAME
 * figure with reworded cells on a follow-up turn and dedup misses.
 *
 * Kinds intentionally NOT here:
 *   - kwl_chart, sentence_diagram: content IS the structural identity.
 *   - population_pyramid, production_possibilities, business_cycle and
 *     other numeric kinds: re-emit with different numbers is a genuinely
 *     different plot.
 *   - historical_timeline: events list may grow turn-to-turn (brain
 *     adding events as discussion progresses) — collapsing too eagerly
 *     would hide the new events.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function structuralAxesFor(action: string, cmd: any): { tag: string; axes: unknown } | null {
  // Header / label normalization: lower-cased + whitespace-collapsed so
  // "Particle Motion" vs "Particle motion" vs "Particle  Motion" all
  // collapse to the same structural identity. Brain re-emissions
  // frequently drift on header casing alone.
  const normLabel = (s: unknown): string =>
    typeof s === 'string' ? s.trim().toLowerCase().replace(/\s+/g, ' ') : '';
  const normList = (xs: unknown): string[] =>
    Array.isArray(xs) ? xs.map(normLabel) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelsOf = (xs: unknown, key: string): string[] =>
    Array.isArray(xs)
      ? xs.map((x) => (x && typeof x === 'object' ? normLabel((x as any)[key]) : normLabel(x)))
      : [];

  if (action === 'showTable') {
    return { tag: 'showTable', axes: { headers: normList(cmd?.headers) } };
  }
  if (action === 'showDiagram' && cmd && typeof cmd === 'object') {
    const type = typeof cmd.type === 'string' ? cmd.type : '';
    const params: Record<string, unknown> = cmd.params && typeof cmd.params === 'object' ? cmd.params : {};
    switch (type) {
      case 'comparison_table':
        return { tag: 'showDiagram:comparison_table', axes: { items: normList(params.items), attributes: normList(params.attributes) } };
      case 't_chart':
        return { tag: 'showDiagram:t_chart', axes: { leftHeader: normLabel(params.leftHeader), rightHeader: normLabel(params.rightHeader) } };
      case 'frayer_model':
        return { tag: 'showDiagram:frayer_model', axes: { term: normLabel(params.term) } };
      case 'hierarchy_pyramid':
        return { tag: 'showDiagram:hierarchy_pyramid', axes: { tierLabels: labelsOf(params.tiers, 'label') } };
      case 'argument_structure':
        return { tag: 'showDiagram:argument_structure', axes: { claim: normLabel(params.claim) } };
      case 'government_branches':
        return { tag: 'showDiagram:government_branches', axes: { country: normLabel(params.country), branchNames: labelsOf(params.branches, 'name') } };
      case 'body_system':
        return { tag: 'showDiagram:body_system', axes: { system: normLabel(params.system), partLabels: labelsOf(params.parts, 'label') } };
      case 'life_cycle':
      case 'water_cycle':
      case 'rock_cycle':
        return { tag: `showDiagram:${type}`, axes: { stageLabels: labelsOf(params.stages, 'label') } };
      default:
        return null;
    }
  }
  return null;
}

/**
 * Stable hash of a show_* tool's args. Used for duplicate detection — two
 * calls with the same canonicalized JSON are treated as the same item.
 *
 * Strips bookkeeping fields (id, action, _internal markers, computed
 * targetId/targetFeature stamps) before hashing so signatures collide on
 * the user-meaningful payload only. Keys are sorted for determinism.
 *
 * For "organizer" kinds (see `structuralAxesFor`) the signature collapses
 * to structural axes only so reworded content cells still dedup.
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
  // Kind-aware structural identity (organizer renderers — see
  // `structuralAxesFor`). When a rule applies, the axes alone determine
  // the signature so reworded content cells still dedup.
  const structural = structuralAxesFor(action, cmd);
  if (structural) {
    try {
      return `${action}|${structural.tag}|${JSON.stringify(canon(structural.axes))}`;
    } catch {
      return `${action}|${structural.tag}|<unhashable>`;
    }
  }

  try {
    return `${action}|${JSON.stringify(canon(cmd))}`;
  } catch {
    return `${action}|<unhashable>`;
  }
}

/**
 * Render actions that are PRIMARY FIGURES — the big visual anchors that
 * define a page's subject identity (graphs, diagrams, geometry, charts,
 * trees, maps…). Used by the page-grouping H6 backstop (only a primary
 * figure whose subject differs from the page anchor forces a split) and by
 * the overflow guard (primaries weigh more than supporting renders).
 *
 * Everything NOT in this set — equations, derivations, code, problem/
 * solution cards, plain tables, reading passages — is SUPPORTING: it
 * accompanies the anchor and never triggers a page split, so a follow-up
 * "explain its focus" equation groups onto the figure's page (G1).
 *
 * Bias-to-group: actions absent from this set default to SUPPORTING, so an
 * unrecognized renderer under-splits (recoverable, capped by overflow)
 * rather than scattering. ADD a new big-figure renderer here when you author
 * one — mirror the orchestrator's teachingActions list.
 */
const PRIMARY_FIGURE_ACTIONS = new Set<string>([
  'showDiagram', 'showGraph', 'showFunctionGraph', 'showGeometry',
  'showGeometryConstructed', 'showCoordinatePlane', 'showSvgDiagram',
  'showScatterPlot', 'showRayDiagram', 'showSpringMass', 'showWave',
  'showFoodWeb', 'showMotionDiagram', 'showProjectileMotion',
  'showSimpleMachine', 'showPendulum', 'showVector', 'showCycleDiagram',
  'showConceptMap', 'showOrbitalDiagram', 'showPedigree', 'showCellDiagram',
  'showDna', 'showFreeBodyDiagram', 'showEnergyBars', 'showCollision',
  'showReactionCoordinate', 'showPunnett', 'showLewis', 'showPeriodicTable',
  'showFlowchart', 'showManipulative', 'showNumberLine', 'showFractionBar',
  'showTree', 'showTimeline', 'showMap', 'showVennDiagram', 'showStats',
  'showUnitCircle', 'showCircuit', 'showMolecule', 'showCallStack',
]);

/**
 * Is this render a primary figure (a page-anchor candidate) vs a supporting
 * render (equation/text/card that accompanies it)? See
 * {@link PRIMARY_FIGURE_ACTIONS}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPrimaryFigure(action: string, _cmd?: any): boolean {
  return PRIMARY_FIGURE_ACTIONS.has(action);
}

/** Normalize a label/expression for anchor-key comparison. */
function normForKey(s: unknown): string {
  return typeof s === 'string' ? s.trim().toLowerCase().replace(/\s+/g, ' ') : '';
}

/**
 * Figure CATEGORY for page membership (H6). Deliberately COARSE — the render
 * KIND only, NOT its content: `showGraph`, `showGeometryConstructed`,
 * `showDiagram:eclipse_diagram`, etc. Two primary figures share a category
 * when they're the same kind of figure, even if their titles/expressions
 * differ (a parabola graph and the same parabola redrawn with its directrix
 * are both `showGraph` → one page; the "evolving figure" case, design Q6).
 *
 * H6 ("same-segment different primary figure → split") compares categories,
 * so it splits a graph from a construction (different kind) but NOT a graph
 * from an evolved graph (same kind). Genuinely different same-kind subjects
 * (a parabola vs a hyperbola graph) are left to topic-shift / segment
 * boundaries — the bias is toward grouping. Derived from the render itself,
 * never from student text — deterministic.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computeFigureCategory(action: string, cmd: any): string {
  if (
    action === 'showDiagram' &&
    cmd && typeof cmd === 'object' &&
    typeof cmd.type === 'string' && cmd.type
  ) {
    return `showDiagram:${cmd.type}`;
  }
  return action;
}

/**
 * The page's subject anchor key — a composite `${category}|||${normTitle}`.
 * H6 compares two of these via {@link anchorsDiverge}, which treats the
 * category EXACTLY (a graph and a construction are different kinds → split)
 * but the title FUZZILY (containment / token overlap), so:
 *   - a parabola graph "Parabola: y² = 4x" and the same parabola redrawn
 *     "Parabola: y² = 4x with Directrix" → same kind, title is a prefix-
 *     superset → SAME subject → group (the evolving-figure case, Q6);
 *   - a parabola graph and an ellipse graph → same kind but dissimilar
 *     titles ("Parabola: …" vs "Ellipse: …") → DIFFERENT subject → split.
 * Deliberately drops raw expressions (which split evolving figures whose
 * content drifts, e.g. y=2√x vs y=√(4x) — the same curve). Derived from the
 * render itself, never from student text — deterministic.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computeAnchorKey(action: string, cmd: any): string {
  return `${computeFigureCategory(action, cmd)}|||${normForKey(extractCommandTitle(cmd))}`;
}

/** Alphanumeric tokens of a normalized title, for the H6 fuzzy compare. */
function titleTokens(s: string): Set<string> {
  return new Set(s.split(/[^a-z0-9]+/).filter((t) => t.length > 0));
}

/**
 * H6 predicate: do two page-anchor keys ({@link computeAnchorKey}) name
 * DIFFERENT figure subjects (→ split onto a new page)? Different category →
 * always diverge. Same category → diverge only when the titles are dissimilar
 * (neither contains the other AND token-overlap < 0.5), so an evolving figure
 * (title grows a qualifier) stays together while a genuinely different
 * same-kind subject splits. Missing title info → assume same (group; bias).
 */
export function anchorsDiverge(a: string, b: string): boolean {
  if (a === b) return false;
  const sepA = a.indexOf('|||');
  const sepB = b.indexOf('|||');
  const catA = sepA >= 0 ? a.slice(0, sepA) : a;
  const catB = sepB >= 0 ? b.slice(0, sepB) : b;
  if (catA !== catB) return true; // different figure kind → split
  const titleA = sepA >= 0 ? a.slice(sepA + 3) : '';
  const titleB = sepB >= 0 ? b.slice(sepB + 3) : '';
  if (!titleA || !titleB) return false; // no title to compare → group
  if (titleA.includes(titleB) || titleB.includes(titleA)) return false; // evolving figure
  const ta = titleTokens(titleA);
  const tb = titleTokens(titleB);
  if (ta.size === 0 || tb.size === 0) return false;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const jaccard = inter / (ta.size + tb.size - inter);
  return jaccard < 0.5; // dissimilar titles → different subject → split
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
    // Some renderers nest their title under a `data` config (e.g.
    // show_function_graph → { action:'showGraph', data:{ title } }). Without
    // this, a graph's catalog title AND its auto-page title fall back to a
    // generic "Next" (observed 2026-06-19 JEE parabola session).
    cmd.data?.title,
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
