'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Map Renderer
 *
 * A pragmatic map canvas for social studies / geography teaching. Uses real
 * country outlines from Natural Earth 110m (see
 * scripts/generate-map-backgrounds.ts) so shapes are recognizable as
 * "actual USA / actual Middle East" rather than hand-drawn blobs. Pins and
 * labeled regions are placed in a normalized [0, 100] coordinate system on
 * top of the outline.
 */

import React from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { deoverlapLabels } from '@/lib/tutor/whiteboard/label-deoverlap';
import { MAP_BACKGROUND_PATHS, MAP_BACKGROUND_BBOXES } from './map-backgrounds.generated';

export interface MapPin {
  /**
   * Geographic latitude of the pin. If `lat` and `lon` are both provided,
   * they are projected using the active preset's bounding box and take
   * precedence over `x`/`y`. Preferred for real cities (Cairo, Houston, …)
   * since the model can just state the coordinates it knows.
   */
  lat?: number;
  /** Geographic longitude of the pin. See `lat`. */
  lon?: number;
  /** Fallback: normalized 0..100 x coord (left → right). Ignored if lat/lon set. */
  x?: number;
  /** Fallback: normalized 0..100 y coord (top → bottom). Ignored if lat/lon set. */
  y?: number;
  label: string;
  color?: string;
}

export interface MapRegion {
  /** SVG path data in the 0–100 coordinate system, or a list of polygon points "x,y x,y x,y". */
  points?: string;
  path?: string;
  label?: string;
  color?: string; // Fill color (will be rendered at low opacity).
}

export interface MapRendererProps {
  title?: string;
  /** Preset background region. If provided, a hand-drawn outline is shown. */
  background?:
    | 'blank'
    | 'world'
    | 'north-america'
    | 'south-america'
    | 'europe'
    | 'asia'
    | 'africa'
    | 'australia'
    | 'usa'
    | 'india'
    | 'china'
    | 'middle-east'
    | 'mediterranean';
  pins?: MapPin[];
  regions?: MapRegion[];
  /** Optional caption under the map. */
  caption?: string;
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
// Must match the INSET used by scripts/generate-map-backgrounds.ts so pins
// projected from lat/lon align exactly with the background outline.
const BG_INSET = 20;

/**
 * Project a lat/lon onto the 0..100 normalized canvas using the preset's
 * geographic bounding box. Equirectangular with cosine-latitude correction
 * — same formula as the generation script — so pins align exactly with
 * country borders in the rendered map.
 */
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
  const x = offX + (lon - w) * lonScale * scale;
  const y = offY + (n - lat) * scale;
  return [x, y];
}

/**
 * Transform normalized (0–100) coords to SVG pixel coords.
 * Slight inset so pins near the edge aren't clipped.
 */
function normToSvg(x: number, y: number): [number, number] {
  const inset = 10;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

/** Half-extent of a pin's dot (r=6 + 2px stroke), in SVG units. A pin whose
 *  dot cannot be drawn whole is the thing the student actually sees clipped. */
const PIN_DOT_RADIUS = 8;

export interface OutOfBoundsPin {
  label: string;
  lat: number;
  lon: number;
  /** Which edge it fell past — for the error message, not for layout. */
  edge: 'north' | 'south' | 'east' | 'west';
  /** Degrees past that edge, rounded to 1dp. */
  by: number;
}

/**
 * R50 T6 (live, portal-b0a1b396 image 1): the brain pinned "Warm rainy
 * island" at 18.2°N — Puerto Rico — on the `south-america` background, whose
 * bbox tops out at 12.437°N. `projectLatLon` had no bounds check, so the pin
 * projected to py = 0.0 exactly (the top edge of the viewBox) and both the
 * dot and its label were clipped.
 *
 * Deliberately NOT clamped into view. Clamping would park the dot on
 * northern Colombia while the label still read "Warm rainy island" — turning
 * a rendering defect into a taught geography error, which is strictly worse
 * than showing nothing. Instead this surfaces a construction error the brain
 * re-renders from, the same affordance that fixed the R49 geometry
 * point-step bug (an error box the brain self-corrects from, rather than a
 * silent no-op it never learns about).
 *
 * Pure; safe on missing bbox (unknown background ⇒ no claim, no error).
 */
export function findOutOfBoundsPins(
  background: string,
  pins: readonly { label?: string; lat?: number; lon?: number }[],
): OutOfBoundsPin[] {
  const bbox = MAP_BACKGROUND_BBOXES[background];
  if (!bbox) return [];
  const [w, s2, e, n] = bbox;
  const out: OutOfBoundsPin[] = [];
  for (const pin of pins) {
    if (pin.lat == null || pin.lon == null) continue;
    const [nx, ny] = projectLatLon(pin.lat, pin.lon, bbox);
    const [px, py] = normToSvg(nx, ny);
    // The projected dot must fit wholly inside the viewBox. Testing the
    // PROJECTED position (not a degree tolerance) targets the defect the
    // student sees — a coastal pin a shade outside the landmass bbox still
    // lands on canvas and must not error.
    const offTop = py - PIN_DOT_RADIUS < 0;
    const offBottom = py + PIN_DOT_RADIUS > SVG_HEIGHT;
    const offLeft = px - PIN_DOT_RADIUS < 0;
    const offRight = px + PIN_DOT_RADIUS > SVG_WIDTH;
    if (!offTop && !offBottom && !offLeft && !offRight) continue;
    const edge: OutOfBoundsPin['edge'] =
      offTop ? 'north' : offBottom ? 'south' : offLeft ? 'west' : 'east';
    const by =
      edge === 'north' ? pin.lat - n
        : edge === 'south' ? s2 - pin.lat
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

/** The narrowest known background whose bbox contains every supplied pin —
 *  the actionable half of the error message. Null when none qualifies. */
export function suggestContainingBackground(
  pins: readonly { lat?: number; lon?: number }[],
): string | null {
  const pts = pins.filter((p) => p.lat != null && p.lon != null) as { lat: number; lon: number }[];
  if (pts.length === 0) return null;
  let best: string | null = null;
  let bestArea = Infinity;
  for (const [name, [w, s2, e, n]] of Object.entries(MAP_BACKGROUND_BBOXES)) {
    if (!pts.every((p) => p.lat <= n && p.lat >= s2 && p.lon >= w && p.lon <= e)) continue;
    const area = (e - w) * (n - s2);
    if (area < bestArea) { bestArea = area; best = name; }
  }
  return best;
}

/**
 * Real country outlines from Natural Earth 110m. The paths below are the
 * generated fallback — if a preset is missing from the generated file, the
 * hand-drawn version here is used. In practice all canonical presets are
 * covered by the generated file.
 */
const LEGACY_BACKGROUND_PATHS: Record<string, string> = {
  // Schematic world with recognizable continent hooks (FL, Africa horn, Italy boot)
  world:
    // North America — Florida hook on SE corner
    'M 70,105 Q 140,80 220,95 L 245,110 L 235,135 L 220,160 L 210,175 Q 220,190 230,185 L 225,195 L 215,205 L 200,200 L 180,200 L 160,205 L 140,200 Q 110,190 80,175 Q 60,150 70,105 Z ' +
    // South America
    'M 200,210 Q 240,215 255,245 L 250,280 L 240,320 Q 220,355 200,355 Q 185,330 185,290 Q 190,240 200,210 Z ' +
    // Europe
    'M 275,110 Q 320,95 365,110 L 370,125 L 355,140 L 355,155 L 340,160 L 315,160 L 300,155 L 290,150 L 280,140 Q 265,130 275,110 Z ' +
    // Africa — includes Horn
    'M 290,170 L 320,170 L 345,185 L 350,215 L 340,250 L 325,285 L 310,325 L 285,335 L 270,310 L 265,275 L 275,235 L 282,200 L 290,170 Z ' +
    // Asia — Indian subcontinent dangles south
    'M 375,100 Q 440,85 510,95 L 545,115 L 550,145 L 530,165 L 510,170 L 490,170 Q 475,175 465,190 Q 470,220 450,240 L 435,230 L 425,200 L 420,180 L 400,175 L 380,165 Q 370,140 375,100 Z ' +
    // Australia
    'M 490,260 Q 520,250 550,260 L 555,285 Q 530,300 500,295 L 490,280 Z',
  'north-america':
    // Recognizable: wide top, tapers through Mexico to Central America, Florida hook, Baja peninsula
    'M 80,80 Q 180,55 280,70 Q 360,75 430,90 L 465,105 L 490,130 L 495,155 L 480,170 L 470,175 Q 475,195 465,210 L 450,225 L 445,245 L 450,270 L 440,285 Q 425,280 420,260 L 410,245 L 395,240 L 385,225 L 370,230 L 355,245 L 340,260 L 330,275 L 325,295 L 315,310 L 305,315 L 295,305 L 300,285 L 310,265 L 295,260 L 275,255 L 260,270 Q 245,265 235,245 L 220,235 Q 200,245 180,240 Q 150,225 130,200 Q 105,170 95,135 Q 80,110 80,80 Z',
  'south-america':
    // Tapered southern cone, wide Brazil bulge in NE
    'M 240,60 Q 310,50 360,75 L 390,100 L 410,135 L 420,175 L 410,220 L 390,255 L 370,285 L 350,310 L 330,335 L 310,355 L 295,365 L 285,355 L 280,335 L 290,305 L 285,275 L 265,250 L 245,225 L 230,200 L 220,170 L 215,135 L 225,95 Q 230,70 240,60 Z',
  europe:
    // Iberian SW, France/Benelux, Italian boot, Greece, Scandinavia N, Eastern Europe
    'M 85,215                 ' +  // SW Portugal/Algarve
    'L 90,255                 ' +  // S Spain
    'Q 130,275 175,260        ' +  // SE Spain coast (Valencia)
    'Q 210,245 245,235        ' +  // Balearics / S France
    'Q 265,255 270,280        ' +  // Italy north shoulder
    'L 285,305                ' +  // Italy boot shin
    'L 295,320                ' +  // Italy toe
    'L 305,310                ' +  // Italy heel
    'L 295,290                ' +  // Italy E coast
    'L 310,275                ' +  // Adriatic bridge
    'Q 345,290 375,300        ' +  // Balkans / Greece W
    'L 390,315                ' +  // Peloponnese
    'L 405,295                ' +  // Greece E
    'L 420,275                ' +  // Aegean
    'Q 445,260 455,230        ' +  // W Turkey (Istanbul)
    'L 465,195                ' +  // Black Sea south rim
    'Q 475,165 455,135        ' +  // E Europe / Ukraine
    'L 440,105                ' +  // Baltic south
    'L 425,80                 ' +  // Gulf of Finland
    'Q 400,55 355,45          ' +  // N Scandinavia (Finland/N Sweden)
    'L 320,35                 ' +  // N Norway
    'Q 290,55 275,95          ' +  // Norway W coast
    'L 265,140                ' +  // S Norway / Denmark
    'Q 240,160 205,155        ' +  // N Germany / Denmark
    'Q 175,150 150,160        ' +  // Low Countries / N France
    'Q 120,170 95,190         ' +  // Brittany / Bay of Biscay
    'L 85,215 Z',
  asia:
    // Broad with Indian subcontinent dangling, SE Asia hook, Korean peninsula, Arabian peninsula on left
    'M 60,110 Q 180,75 340,95 Q 450,105 530,130 L 555,160 L 550,195 L 520,215 L 495,225 L 480,240 L 505,265 L 500,295 L 475,305 L 450,295 L 440,270 L 420,260 L 395,275 L 385,300 L 375,325 L 355,335 L 340,315 L 350,285 L 335,265 L 315,260 L 295,275 L 275,285 L 260,275 L 250,255 L 225,245 L 200,230 L 175,210 L 150,195 L 120,175 L 90,155 L 70,135 Q 55,120 60,110 Z',
  africa:
    // Bulging West Africa, narrowing through Congo to wide southern cone, Horn of Africa on NE
    'M 170,75 Q 250,60 330,75 L 365,95 L 385,120 L 400,140 ' +  // Mediterranean coast
    'L 410,150 L 425,145 L 435,160 L 430,175 L 415,185 ' +       // Horn of Africa (Somalia)
    'L 400,200 L 390,220 L 385,245 L 375,270 L 360,300 ' +        // E Africa coast
    'L 345,325 L 325,345 L 305,355 L 285,350 L 270,330 ' +        // S Africa
    'L 265,305 L 260,275 L 255,245 L 250,215 L 240,195 ' +        // W coast (Angola/Namibia)
    'L 225,180 L 205,170 L 185,155 L 170,130 L 165,100 Z',        // Gulf of Guinea / West Africa
  australia:
    // Distinctive rectangular-ish shape with cape york north, great bight south
    'M 120,155 Q 220,140 330,145 L 390,155 L 440,160 L 480,175 ' +
    'L 495,195 L 490,220 L 475,245 L 450,265 L 415,275 L 375,278 ' +
    'L 330,275 Q 285,270 240,265 L 195,260 L 155,250 L 120,230 ' +
    'L 100,200 L 105,175 Z',
  usa:
    // Recognizable: flat Canadian border, Maine bump NE, Florida hook SE, Texas dip S, California coast W
    'M 80,150 ' +
    'Q 250,145 420,150 ' +        // Canadian border (slight bow)
    'L 440,155 ' +                 // ME border entering
    'L 485,175 ' +                 // Maine NE tip
    'Q 478,195 465,210 ' +         // Maine to MA coast
    'L 470,245 ' +                 // Mid-Atlantic (NY/NJ)
    'Q 475,272 462,282 ' +         // Carolinas
    'L 478,290 ' +                 // FL panhandle east entering
    'L 490,300 ' +                 // FL east coast
    'L 485,325 ' +                 // South FL / Keys
    'L 468,325 ' +                 // FL SW tip
    'L 452,305 ' +                 // FL W coast
    'L 442,288 ' +                 // Tampa
    'Q 425,282 395,285 ' +         // Panhandle / AL coast
    'Q 365,295 345,288 ' +         // LA delta bulge
    'Q 305,283 260,272 ' +         // TX Gulf coast
    'L 250,260 ' +                 // Rio Grande
    'Q 195,258 155,262 ' +         // SW border
    'L 120,260 ' +                 // CA south (San Diego)
    'Q 95,240 88,215 ' +           // central CA coast
    'L 82,185 ' +                  // Oregon coast
    'L 78,165 ' +                  // Washington
    'L 80,150 Z',                  // close at Puget Sound
  india:
    // Distinctive inverted triangle — wide Himalayan base, tapered southern tip (Kanyakumari)
    'M 140,90 ' +
    'Q 240,75 340,85 ' +           // Himalayan northern arc
    'L 395,95 ' +                  // NE India / Bangladesh corner
    'L 410,120 ' +                 // Bay of Bengal entry
    'L 395,155 ' +                 // E coast (Andhra)
    'L 380,195 ' +                 // Tamil Nadu coast
    'L 360,240 ' +                 // SE coast narrowing
    'L 340,285 ' +                 // Kanyakumari (southern tip area)
    'L 325,320 ' +                 // Southern tip
    'L 305,305 ' +                 // Kerala coast
    'L 285,270 ' +                 // Karnataka coast
    'L 270,235 ' +                 // Goa
    'L 250,195 ' +                 // Maharashtra (Mumbai)
    'L 235,160 ' +                 // Gujarat coast
    'L 215,135 ' +                 // Kutch
    'L 185,115 ' +                 // Rajasthan / Pakistan border
    'L 155,100 ' +                 // Punjab
    'L 140,90 Z',
  china:
    // Recognizable rough shape — wide mid, rooster-tail NE, Yangtze valley bulge SE, Xinjiang tapering W
    'M 80,110 Q 180,85 310,95 L 400,105 L 470,115 L 515,135 L 535,160 L 545,185 L 530,205 L 500,220 L 470,235 L 435,245 L 395,250 L 365,255 L 345,275 L 330,285 L 315,270 L 295,265 L 270,260 L 240,255 L 210,250 L 175,240 L 145,225 L 115,210 L 90,185 L 75,160 L 70,135 Z',
  'middle-east':
    // One contiguous landmass: Turkey at top, Iran east, Arabian peninsula
    // south-east, Egypt / Levant west. The Red Sea is NOT traced as a notch —
    // filling it as land keeps the outline a single coherent blob (previous
    // version created a visible vertical channel that read as two separate
    // regions). Pins at Cairo / Jerusalem / Alexandria latitudes land inside.
    'M 100,95 ' +
    'Q 260,80 410,95 ' +           // Turkey northern arc
    'L 450,120 ' +                 // Caucasus border
    'Q 490,155 510,195 ' +         // Iran (Caspian to central)
    'L 520,235 ' +                 // SE Iran
    'Q 510,265 475,280 ' +         // Strait of Hormuz
    'L 450,295 ' +                 // Oman NE
    'L 430,310 ' +                 // Oman coast
    'Q 395,325 350,335 ' +         // Yemen SE
    'L 315,345 ' +                 // Yemen S (Aden)
    'Q 250,350 195,290 ' +         // Fill across to Egypt-Sudan border (Red Sea not traced)
    'L 140,305 ' +                 // N Sudan / Halayeb triangle
    'L 95,285 ' +                  // Egypt-Sudan-Libya corner
    'L 80,235 ' +                  // Egypt Western Desert / Libya border
    'L 80,190 ' +                  // Egypt Mediterranean coast
    'L 105,160 ' +                 // Alexandria
    'L 125,145 ' +                 // Nile Delta
    'L 130,130 ' +                 // Levant coast (Gaza)
    'L 115,110 ' +                 // Lebanon / Syria coast
    'L 100,95 Z',
  mediterranean:
    // Central sea with Italy boot dangling, Iberian W, North African coast S, Greece/Turkey E
    'M 60,130 Q 130,110 220,120 L 250,125 L 265,145 L 280,175 L 290,200 L 280,215 L 260,210 L 250,195 L 240,175 L 220,165 L 180,170 L 130,180 L 80,175 L 50,155 L 60,130 Z ' +
    'M 310,140 Q 400,130 500,140 Q 540,150 540,180 L 525,200 L 480,210 L 430,215 L 370,210 L 320,195 L 300,175 L 310,140 Z',
};

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Regions without a path or points produce no feature (renderer returns null).
 */
export function buildMapManifest(props: MapRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const regions = props.regions ?? [];
  regions.forEach((region, i) => {
    if (!region.path && !region.points) return;
    const name = region.label ? `region-${featSlug(region.label)}` : `region-${i + 1}`;
    const labels = new Set<string>([
      name,
      `region-${i + 1}`,
      `region ${i + 1}`,
      `area ${i + 1}`,
      `zone ${i + 1}`,
    ]);
    if (region.label) {
      labels.add(region.label);
      labels.add(`the ${region.label}`);
      labels.add(`${region.label} region`);
      labels.add(`${region.label} area`);
      labels.add(`the ${region.label} region`);
    }
    entries.push({
      name,
      kind: 'region',
      description: region.label ? `region "${region.label}"` : `region ${i + 1}`,
      labels: Array.from(labels),
    });
  });
  const pins = props.pins ?? [];
  pins.forEach((pin, i) => {
    const name = pin.label ? `pin-${featSlug(pin.label)}` : `pin-${i + 1}`;
    const labels = new Set<string>([
      name,
      `pin-${i + 1}`,
      `pin ${i + 1}`,
      `marker ${i + 1}`,
      `location ${i + 1}`,
    ]);
    if (pin.label) {
      labels.add(pin.label);
      labels.add(`the ${pin.label}`);
      labels.add(`${pin.label} pin`);
      labels.add(`pin ${pin.label}`);
      labels.add(`${pin.label} marker`);
      labels.add(`the ${pin.label} pin`);
    }
    entries.push({
      name,
      kind: 'point',
      description: pin.label ? `map pin "${pin.label}"` : `map pin ${i + 1}`,
      labels: Array.from(labels),
    });
  });
  return entries;
}

export default function MapRenderer({
  title,
  background = 'blank',
  pins = [],
  regions = [],
  caption,
}: MapRendererProps) {
  // Prefer the real Natural-Earth-generated outline; fall back to the legacy
  // hand-drawn one if a preset isn't in the generated file.
  const bgPath = MAP_BACKGROUND_PATHS[background] ?? LEGACY_BACKGROUND_PATHS[background];

  // Pin dot positions, hoisted so the label texts can be de-overlapped as a
  // group. Pins for nearby cities (LLM-supplied coords, no collision
  // awareness) otherwise draw their labels on top of each other. Only the
  // TEXT is nudged (vertically) — the pin dot stays at its true location.
  const pinPts = pins.map((pin) => {
    const bbox = MAP_BACKGROUND_BBOXES[background];
    let normX: number;
    let normY: number;
    if (pin.lat != null && pin.lon != null && bbox) {
      [normX, normY] = projectLatLon(pin.lat, pin.lon, bbox);
    } else {
      normX = pin.x ?? 50;
      normY = pin.y ?? 50;
    }
    const [px, py] = normToSvg(normX, normY);
    return { px, py };
  });
  // R50 T7 (live, portal-b0a1b396 image 3): the de-overlap pass moves label
  // boxes against OTHER LABEL boxes only, so a label nudged clear of its
  // neighbour could still land squarely on a pin's marker — the live capture
  // shows a blue dot sitting inside the word "Pacific". Two pins at the same
  // latitude (−20, lon −75 and −68) projected to an identical py of 192.0
  // with overlapping x-ranges, which is the shape that triggers it.
  //
  // deoverlapLabels already supports exactly this via `obstacles` ("fixed
  // boxes labels must stay clear of", added 2026-07-19 for the number-line
  // axis band and FBD arrow shafts) — MapRenderer simply never passed the
  // dots. The markers stay at their true positions; only text moves.
  const pinDotObstacles = pinPts.map(({ px, py }) => ({
    left: px - PIN_DOT_RADIUS,
    right: px + PIN_DOT_RADIUS,
    top: py - PIN_DOT_RADIUS,
    bottom: py + PIN_DOT_RADIUS,
  }));
  const pinLabelPos = deoverlapLabels(
    pinPts.map(({ px, py }, i) => ({
      x: px + 10,
      y: py + 4,
      text: pins[i].label || '',
      fontSize: 12,
      anchor: 'start' as const,
    })),
    { width: SVG_WIDTH, height: SVG_HEIGHT },
    // fontWeight 600 glyphs run a bit wider than the default estimate.
    { charWidth: 0.62, pad: 2, baseline: 'alphabetic', edgePad: 2, obstacles: pinDotObstacles },
  );

  // Region labels go through the SAME deoverlap pass as pin labels
  // (2026-08-07 clip audit): a centroid near the map edge used to draw its
  // centered label straight off the viewBox. The clampX pre-pass pulls it
  // back inside; the vertical pass keeps stacked region labels apart.
  const regionLabelInputs = regions.flatMap((region, i) => {
    if (!region.points || !region.label) return [];
    const coords = region.points.trim().split(/\s+/).map((pt) => pt.split(',').map(Number));
    const rcx = coords.reduce((s, [x]) => s + x, 0) / coords.length;
    const rcy = coords.reduce((s, [, y]) => s + y, 0) / coords.length;
    const [lx, ly] = normToSvg(rcx, rcy);
    return [{ key: i, x: lx, y: ly, text: region.label, fontSize: 12, anchor: 'middle' as const }];
  });
  const regionLabelPos = new Map(
    deoverlapLabels(
      regionLabelInputs,
      { width: SVG_WIDTH, height: SVG_HEIGHT },
      // R50 T7: region labels dodge the pin markers too — same reasoning.
      { charWidth: 0.62, pad: 2, baseline: 'alphabetic', edgePad: 2, obstacles: pinDotObstacles },
    ).map((l) => [l.key, { x: l.x, y: l.y }]),
  );

  // R50 T6: refuse to draw a map whose pins fall outside the chosen
  // background. Rendering the error instead of the map is deliberate — a
  // half-clipped pin looks like a styling nit, so it shipped unnoticed;
  // an error box is something the brain reads back off the board and
  // re-renders from, and something a human triages immediately.
  const outOfBounds = findOutOfBoundsPins(background, pins);
  if (outOfBounds.length > 0) {
    const suggestion = suggestContainingBackground(pins);
    return (
      <div className="map-renderer">
        {title && (
          <div className="text-center text-sm font-semibold text-gray-700 mb-2">
            <InlineMathText text={title} />
          </div>
        )}
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          Construction error: {outOfBounds.length === 1 ? 'a pin falls' : `${outOfBounds.length} pins fall`}
          {' '}outside the &ldquo;{background}&rdquo; map.
          {outOfBounds.map((p) => (
            <div key={p.label} className="mt-1">
              &ldquo;{p.label}&rdquo; ({p.lat}, {p.lon}) is {p.by}° past the {p.edge} edge.
            </div>
          ))}
          <div className="mt-2">
            {suggestion
              ? <>Use <code>background: &quot;{suggestion}&quot;</code>, or pick a location inside this map.</>
              : <>Pick locations inside this map, or use <code>background: &quot;world&quot;</code>.</>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#eff6ff" rx={4} />

        {/* Background region outline */}
        {bgPath && (
          <path
            d={bgPath}
            fill="#cbd5e1"
            fillOpacity={0.5}
            stroke="#64748b"
            strokeWidth={1.5}
          />
        )}

        {/* Regions: labeled highlighted areas */}
        {regions.map((region, i) => {
          const color = region.color || '#fbbf24';
          const regionName = region.label ? `region-${featSlug(region.label)}` : `region-${i + 1}`;
          if (region.path) {
            return (
              <g key={`region-${i}`} {...feat(regionName, { cx: SVG_WIDTH / 2, cy: SVG_HEIGHT / 2, w: SVG_WIDTH, h: SVG_HEIGHT }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
                <path
                  d={region.path}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={1.5}
                />
              </g>
            );
          }
          if (region.points) {
            // Convert normalized "x,y x,y" list to SVG coords
            const svgPts = region.points
              .trim()
              .split(/\s+/)
              .map((pt) => {
                const [nx, ny] = pt.split(',').map(Number);
                const [sx, sy] = normToSvg(nx, ny);
                return `${sx},${sy}`;
              })
              .join(' ');
            const ptCoords = region.points.trim().split(/\s+/).map((pt) => pt.split(',').map(Number));
            const rMinX = Math.min(...ptCoords.map((p) => p[0]));
            const rMaxX = Math.max(...ptCoords.map((p) => p[0]));
            const rMinY = Math.min(...ptCoords.map((p) => p[1]));
            const rMaxY = Math.max(...ptCoords.map((p) => p[1]));
            const [bbxMin, bbyMin] = normToSvg(rMinX, rMinY);
            const [bbxMax, bbyMax] = normToSvg(rMaxX, rMaxY);
            return (
              <g key={`region-${i}`} {...feat(regionName, { cx: (bbxMin + bbxMax) / 2, cy: (bbyMin + bbyMax) / 2, w: bbxMax - bbxMin + 20, h: bbyMax - bbyMin + 20 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
                <polygon
                  points={svgPts}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={1.5}
                />
                {region.label && regionLabelPos.has(i) && (() => {
                  // Centroid-seeded position, clamped/de-overlapped above.
                  const pos = regionLabelPos.get(i)!;
                  return (
                    <text x={pos.x} y={pos.y} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1f2937">
                      {region.label}
                    </text>
                  );
                })()}
              </g>
            );
          }
          return null;
        })}

        {/* Pins. Positions were projected above (lat/lon preferred, same
            formula the background was generated with, so pins sit on the
            right country regardless of preset; normalized x/y fallback). */}
        {pins.map((pin, i) => {
          const { px, py } = pinPts[i];
          const color = pin.color || '#dc2626';
          const pinName = pin.label ? `pin-${featSlug(pin.label)}` : `pin-${i + 1}`;
          return (
            <g key={`pin-${i}`} {...feat(pinName, { cx: px, cy: py, w: 40, h: 40 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
              {/* Pin shape: circle with small triangle tail */}
              <circle cx={px} cy={py} r={6} fill={color} stroke="#fff" strokeWidth={2} />
              <text
                x={pinLabelPos[i].x}
                y={pinLabelPos[i].y}
                fontSize={12}
                fontWeight={600}
                fill="#1f2937"
              >
                {pin.label}
              </text>
            </g>
          );
        })}
      </svg>

      {caption && (
        <div className="text-center text-xs text-gray-500 mt-1 italic">
          {caption}
        </div>
      )}
    </div>
  );
}
