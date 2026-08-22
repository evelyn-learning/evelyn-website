/**
 * Map pin bounds — pure geometry, shared by the RENDERER and the tool-call
 * VALIDATOR so the two can never disagree about what "out of bounds" means.
 *
 * R52 (live, portal-8d15f85c). R50 added an out-of-bounds check that rendered
 * a construction error IN THE CARD. It fired correctly — a pin at (18.5,-77)
 * is Jamaica, 6.1° past the north edge of `south-america` — but it was only
 * half a fix, and the session showed exactly how:
 *
 *   · the command was still ACCEPTED, stored, and summarised into
 *     <whiteboard_state>, so the brain believed the map was on the board;
 *   · it then scribbled TWICE onto pins of a map that was never drawn
 *     ("latitude — near equator", "height — elevation");
 *   · and spent the rest of the lesson referring to "our map" and "the two
 *     towns on the board" while the student looked at an error box.
 *
 * Zero error events were recorded for that session. **The rationale R50
 * shipped with — "an error box the brain self-corrects from" — was false:
 * nothing told the brain.** Rendering is too late. The decision belongs at
 * tool-call acceptance, where a rejection reason is fed back and the turn is
 * killed and retried.
 */
import { MAP_BACKGROUND_BBOXES } from '@/app/tutor/components/whiteboard/map-backgrounds.generated';

/** Must match MapRenderer's viewBox and the background generator's inset. */
export const SVG_WIDTH = 600;
export const SVG_HEIGHT = 400;
const BG_INSET = 20;
/** Half-extent of a pin dot (r=6 + 2px stroke). A pin whose dot cannot be
 *  drawn whole is the thing the student actually sees clipped. */
export const PIN_DOT_RADIUS = 8;

/** Equirectangular with cosine-latitude correction — the same formula the
 *  background SVGs were generated with, so pins land on the right country. */
function projectLatLon(
  lat: number,
  lon: number,
  bbox: [number, number, number, number],
): [number, number] {
  const [w, s, e, n] = bbox;
  const midLat = (s + n) / 2;
  const lonScale = Math.cos((midLat * Math.PI) / 180);
  const effLonRange = (e - w) * lonScale;
  const latRange = n - s;
  const availW = 100 - (BG_INSET / SVG_WIDTH) * 200;
  const availH = 100 - (BG_INSET / SVG_HEIGHT) * 200;
  const scale = Math.min(availW / effLonRange, availH / latRange);
  const outW = effLonRange * scale;
  const outH = latRange * scale;
  const offX = (100 - outW) / 2;
  const offY = (100 - outH) / 2;
  return [offX + (lon - w) * lonScale * scale, offY + (n - lat) * scale];
}

/** Normalized 0–100 → SVG pixels, with the renderer's 10px inset. */
function normToSvg(x: number, y: number): [number, number] {
  const inset = 10;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

export interface OutOfBoundsPin {
  label: string;
  lat: number;
  lon: number;
  /** Which edge it fell past — for the message, not for layout. */
  edge: 'north' | 'south' | 'east' | 'west';
  /** Degrees past that edge, 1dp. */
  by: number;
}

export interface MapPinLike {
  label?: string;
  lat?: number;
  lon?: number;
}

/**
 * Pins whose projected dot cannot be drawn wholly inside the viewBox.
 *
 * Tests the PROJECTED position rather than a degree tolerance, because that
 * is the defect the student sees — a coastal pin a shade outside the landmass
 * bbox still lands on canvas and must not be rejected.
 *
 * Pure; unknown background ⇒ no claim, no error (never invent a failure for a
 * preset we have no bbox for).
 */
export function findOutOfBoundsPins(
  background: string,
  pins: readonly MapPinLike[],
): OutOfBoundsPin[] {
  const bbox = MAP_BACKGROUND_BBOXES[background];
  if (!bbox) return [];
  const [w, s, e, n] = bbox;
  const out: OutOfBoundsPin[] = [];
  for (const pin of pins ?? []) {
    if (pin?.lat == null || pin?.lon == null) continue;
    if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lon)) continue;
    const [nx, ny] = projectLatLon(pin.lat, pin.lon, bbox);
    const [px, py] = normToSvg(nx, ny);
    const offTop = py - PIN_DOT_RADIUS < 0;
    const offBottom = py + PIN_DOT_RADIUS > SVG_HEIGHT;
    const offLeft = px - PIN_DOT_RADIUS < 0;
    const offRight = px + PIN_DOT_RADIUS > SVG_WIDTH;
    if (!offTop && !offBottom && !offLeft && !offRight) continue;
    const edge: OutOfBoundsPin['edge'] =
      offTop ? 'north' : offBottom ? 'south' : offLeft ? 'west' : 'east';
    const by =
      edge === 'north' ? pin.lat - n
        : edge === 'south' ? s - pin.lat
        : edge === 'west' ? w - pin.lon
        : pin.lon - e;
    out.push({
      label: pin.label || '(unlabelled)',
      lat: pin.lat,
      lon: pin.lon,
      edge,
      by: Math.round(Math.max(0, by) * 10) / 10,
    });
  }
  return out;
}

/** Narrowest known background containing every supplied pin — the actionable
 *  half of the rejection message. Null when none qualifies. */
export function suggestContainingBackground(pins: readonly MapPinLike[]): string | null {
  const pts = (pins ?? []).filter(
    (p): p is { lat: number; lon: number } =>
      p?.lat != null && p?.lon != null && Number.isFinite(p.lat) && Number.isFinite(p.lon),
  );
  if (pts.length === 0) return null;
  let best: string | null = null;
  let bestArea = Infinity;
  for (const [name, [w, s, e, n]] of Object.entries(MAP_BACKGROUND_BBOXES)) {
    if (!pts.every((p) => p.lat <= n && p.lat >= s && p.lon >= w && p.lon <= e)) continue;
    const area = (e - w) * (n - s);
    if (area < bestArea) { bestArea = area; best = name; }
  }
  return best;
}

/**
 * The rejection reason fed back to the brain. Actionable by construction:
 * names the offending pin, how far out it is, and the concrete alternative —
 * because a rejection the brain cannot act on just costs a turn.
 */
export function buildMapBoundsRejection(
  background: string,
  pins: readonly MapPinLike[],
  bad: readonly OutOfBoundsPin[],
): string {
  const suggestion = suggestContainingBackground(pins);
  const list = bad
    .map((p) => `"${p.label}" (${p.lat}, ${p.lon}) is ${p.by}° past the ${p.edge} edge`)
    .join('; ');
  return (
    `show_map was rejected because ${bad.length === 1 ? 'a pin falls' : `${bad.length} pins fall`} ` +
    `outside the "${background}" background: ${list}. ` +
    (suggestion
      ? `RETRY with background: "${suggestion}", which contains every pin you listed — or drop/move the offending pin(s) to locations inside "${background}".`
      : `RETRY with background: "world", or replace the offending pin(s) with locations inside "${background}".`) +
    ` Do NOT scribble at, scroll to, or refer to this map until a show_map call succeeds — nothing was drawn.`
  );
}
