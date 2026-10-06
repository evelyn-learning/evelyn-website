/**
 * Is a `show_graphic_organizer` call drawable, and in what shape?
 *
 * 2026-10-05 (live text session): the brain called show_graphic_organizer
 * without the arrays its layout needs. The tool schema only requires `kind`,
 * the call was passed straight to the renderer as `spec`, the renderer did
 * `.map` on undefined, and with no error boundary around the board the whole
 * page was replaced by "This page couldn't load".
 *
 * So every call goes through here first:
 *   - NORMALIZED when the layout still has something to show: optional
 *     arrays / headers that are missing are filled in, a lone string where a
 *     list was expected becomes a one-item list, non-text items are coerced
 *     to text or removed. A KWL chart with only the K column is the usual
 *     opening state, not an error.
 *   - DROPPED (soft: this one call, the turn continues) when the layout has
 *     nothing it could show — an empty frame on the board teaches nothing,
 *     and half a cause→effect chart is misleading.
 *
 * Pure: no React, no flags, never throws.
 */

export type GraphicOrganizerKind = 'story_map' | 'kwl' | 't_chart' | 'sequence' | 'cause_effect';

export type NormalizedGraphicOrganizerSpec =
  | { kind: 'story_map'; title?: string; character?: string; setting?: string; problem?: string; solution?: string }
  | { kind: 'kwl'; title?: string; know: string[]; want: string[]; learned: string[] }
  | { kind: 't_chart'; title?: string; leftHeader: string; rightHeader: string; leftItems: string[]; rightItems: string[] }
  | { kind: 'sequence'; title?: string; steps: string[] }
  | { kind: 'cause_effect'; title?: string; causes: string[]; effects: string[] };

export type GraphicOrganizerDropReason =
  /** The arguments are not an object at all. */
  | 'not-an-object'
  /** `kind` is missing or names a layout the renderer does not have. */
  | 'unknown-kind'
  /** The layout's own content is missing (see the per-kind rules below). */
  | 'missing-required';

export type GraphicOrganizerDecision =
  | { ok: true; spec: NormalizedGraphicOrganizerSpec }
  | { ok: false; reason: GraphicOrganizerDropReason };

const KINDS: readonly GraphicOrganizerKind[] = ['story_map', 'kwl', 't_chart', 'sequence', 'cause_effect'];

/** One displayable line of text from whatever the model put in a slot, or
 *  null when there is nothing displayable. */
export function toOrganizerText(value: unknown): string | null {
  try {
    if (typeof value === 'string') {
      const t = value.trim();
      return t ? t : null;
    }
    if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
    if (typeof value === 'boolean') return String(value);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // The model sometimes wraps an item: { text: "…" } / { label: "…" }.
      const o = value as { text?: unknown; label?: unknown };
      if (typeof o.text === 'string' && o.text.trim()) return o.text.trim();
      if (typeof o.label === 'string' && o.label.trim()) return o.label.trim();
    }
    return null;
  } catch {
    return null;
  }
}

/** A list slot as an array of displayable strings. Missing / non-list → [].
 *  A lone string or number is one item; a JSON-encoded array string (a known
 *  model habit for array arguments) is unpacked. */
export function toOrganizerItems(value: unknown): string[] {
  try {
    let list: unknown = value;
    if (typeof list === 'string') {
      const t = list.trim();
      if (t.startsWith('[')) {
        try {
          const parsed: unknown = JSON.parse(t);
          if (Array.isArray(parsed)) list = parsed;
        } catch { /* not JSON — treat as one item below */ }
      }
    }
    if (!Array.isArray(list)) {
      if (typeof list === 'string' || typeof list === 'number') {
        const one = toOrganizerText(list);
        return one === null ? [] : [one];
      }
      return [];
    }
    const out: string[] = [];
    for (const item of list) {
      const text = toOrganizerText(item);
      if (text !== null) out.push(text);
    }
    return out;
  } catch {
    return [];
  }
}

/** `kind` as the renderer spells it; forgiving of case, hyphens and spaces
 *  ("T-Chart", "Cause Effect"). Null when it is not one of the five layouts. */
export function toOrganizerKind(value: unknown): GraphicOrganizerKind | null {
  if (typeof value !== 'string') return null;
  const k = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return (KINDS as readonly string[]).includes(k) ? (k as GraphicOrganizerKind) : null;
}

/**
 * What each layout needs to be worth drawing:
 *   story_map     at least one of character / setting / problem / solution
 *   kwl           at least one item in any of know / want / learned
 *   t_chart       at least one item on either side (headers alone are a frame)
 *   sequence      at least one step
 *   cause_effect  at least one cause AND at least one effect
 */
export function normalizeGraphicOrganizerSpec(raw: unknown): GraphicOrganizerDecision {
  try {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, reason: 'not-an-object' };
    const r = raw as Record<string, unknown>;
    const kind = toOrganizerKind(r.kind);
    if (!kind) return { ok: false, reason: 'unknown-kind' };
    const titleText = toOrganizerText(typeof r.title === 'string' || typeof r.title === 'number' ? r.title : null);
    const title = titleText === null ? {} : { title: titleText };
    const missing: GraphicOrganizerDecision = { ok: false, reason: 'missing-required' };

    if (kind === 'story_map') {
      const boxes: { character?: string; setting?: string; problem?: string; solution?: string } = {};
      for (const key of ['character', 'setting', 'problem', 'solution'] as const) {
        const v = r[key];
        // Prose slots: only real text counts (a number here is not a character).
        const text = typeof v === 'string' ? toOrganizerText(v) : null;
        if (text !== null) boxes[key] = text;
      }
      if (Object.keys(boxes).length === 0) return missing;
      return { ok: true, spec: { kind, ...title, ...boxes } };
    }
    if (kind === 'kwl') {
      const know = toOrganizerItems(r.know);
      const want = toOrganizerItems(r.want);
      const learned = toOrganizerItems(r.learned);
      if (know.length + want.length + learned.length === 0) return missing;
      return { ok: true, spec: { kind, ...title, know, want, learned } };
    }
    if (kind === 't_chart') {
      const leftItems = toOrganizerItems(r.leftItems);
      const rightItems = toOrganizerItems(r.rightItems);
      if (leftItems.length + rightItems.length === 0) return missing;
      return {
        ok: true,
        spec: {
          kind,
          ...title,
          leftHeader: toOrganizerText(r.leftHeader) ?? '',
          rightHeader: toOrganizerText(r.rightHeader) ?? '',
          leftItems,
          rightItems,
        },
      };
    }
    if (kind === 'sequence') {
      const steps = toOrganizerItems(r.steps);
      if (steps.length === 0) return missing;
      return { ok: true, spec: { kind, ...title, steps } };
    }
    const causes = toOrganizerItems(r.causes);
    const effects = toOrganizerItems(r.effects);
    if (causes.length === 0 || effects.length === 0) return missing;
    return { ok: true, spec: { kind, ...title, causes, effects } };
  } catch {
    // A getter / proxy that throws is not an organizer.
    return { ok: false, reason: 'not-an-object' };
  }
}
