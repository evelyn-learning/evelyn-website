/**
 * Generate simplified SVG path strings for the tutor's MapRenderer presets,
 * using Natural Earth 110m country boundaries.
 *
 * Source: github.com/nvkelso/natural-earth-vector (public domain)
 *
 * Runs once; the output file is committed so dev / prod don't need to fetch
 * anything at runtime. Re-run only when we want to add a new preset or bump
 * the source resolution.
 *
 *   npx ts-node scripts/generate-map-backgrounds.ts
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NE_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
const CACHE_DIR = join(__dirname, '.cache');
const CACHE_FILE = join(CACHE_DIR, 'ne_110m_countries.geojson');
const OUTPUT_FILE = join(
  __dirname,
  '..',
  'src',
  'app',
  'tutor',
  'components',
  'whiteboard',
  'map-backgrounds.generated.ts',
);

// Target SVG canvas size (matches MapRenderer's internal viewBox)
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
// Pixel margin reserved inside the SVG so pins near the outline edge aren't clipped
const INSET = 20;

type Position = [number, number]; // [lon, lat]
type Ring = Position[];
type PolygonGeom = Ring[]; // [outer, ...holes]
type MultiPolygonGeom = PolygonGeom[];

interface Feature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry:
    | { type: 'Polygon'; coordinates: PolygonGeom }
    | { type: 'MultiPolygon'; coordinates: MultiPolygonGeom }
    | null;
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

/**
 * Preset definition. Either picks countries by ADMIN name, or filters by a
 * predicate against properties. `bbox` (in lon/lat) overrides the auto-bbox
 * when we want to crop (e.g. USA = contiguous 48, skip Alaska/Hawaii).
 */
interface Preset {
  key: string;
  admins?: string[];
  filter?: (props: Record<string, unknown>) => boolean;
  /** Crop bbox in lon/lat: [west, south, east, north]. Filters out polygons whose centroid falls outside. */
  bbox?: [number, number, number, number];
  /** Douglas-Peucker tolerance in normalized (0..100) units. Higher = coarser. */
  simplifyTolerance?: number;
}

const PRESETS: Preset[] = [
  {
    key: 'usa',
    admins: ['United States of America'],
    bbox: [-125, 24, -66, 50], // contiguous 48
    simplifyTolerance: 0.3,
  },
  {
    key: 'middle-east',
    admins: [
      'Turkey',
      'Iran',
      'Iraq',
      'Syria',
      'Jordan',
      'Lebanon',
      'Israel',
      'Palestine',
      'Egypt',
      'Saudi Arabia',
      'Kuwait',
      'United Arab Emirates',
      'Qatar',
      'Bahrain',
      'Oman',
      'Yemen',
    ],
    simplifyTolerance: 0.3,
  },
  {
    key: 'europe',
    filter: (p) => p.CONTINENT === 'Europe' && p.ADMIN !== 'Russia',
    simplifyTolerance: 0.3,
  },
  {
    key: 'asia',
    filter: (p) => p.CONTINENT === 'Asia',
    simplifyTolerance: 0.4,
  },
  {
    key: 'africa',
    filter: (p) => p.CONTINENT === 'Africa',
    simplifyTolerance: 0.4,
  },
  {
    key: 'north-america',
    filter: (p) => p.CONTINENT === 'North America',
    bbox: [-170, 7, -50, 72],
    simplifyTolerance: 0.4,
  },
  {
    key: 'south-america',
    filter: (p) => p.CONTINENT === 'South America',
    simplifyTolerance: 0.4,
  },
  {
    key: 'australia',
    admins: ['Australia'],
    simplifyTolerance: 0.3,
  },
  {
    key: 'india',
    admins: ['India'],
    simplifyTolerance: 0.2,
  },
  {
    key: 'china',
    admins: ['China'],
    simplifyTolerance: 0.3,
  },
  {
    key: 'mediterranean',
    admins: [
      'Spain',
      'France',
      'Italy',
      'Greece',
      'Turkey',
      'Syria',
      'Lebanon',
      'Israel',
      'Egypt',
      'Libya',
      'Tunisia',
      'Algeria',
      'Morocco',
      'Malta',
      'Cyprus',
      'Portugal',
    ],
    bbox: [-10, 29, 40, 47],
    simplifyTolerance: 0.3,
  },
  {
    key: 'world',
    filter: () => true,
    simplifyTolerance: 0.5,
  },
];

// ────────────────────────────────────────────────────────────────────────────

async function fetchGeoJson(): Promise<FeatureCollection> {
  if (existsSync(CACHE_FILE)) {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`Fetching Natural Earth 110m from ${NE_URL}...`);
  const data = await new Promise<string>((resolve, reject) => {
    https
      .get(NE_URL, { headers: { 'User-Agent': 'evelyn-map-gen' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, (res2) => {
            const chunks: Buffer[] = [];
            res2.on('data', (c) => chunks.push(c));
            res2.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            res2.on('error', reject);
          }).on('error', reject);
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        res.on('error', reject);
      })
      .on('error', reject);
  });
  writeFileSync(CACHE_FILE, data);
  return JSON.parse(data);
}

/** Compute bbox [west, south, east, north] of a feature's geometry. */
function featureBbox(f: Feature): [number, number, number, number] | null {
  if (!f.geometry) return null;
  let w = Infinity,
    s = Infinity,
    e = -Infinity,
    n = -Infinity;
  const visitRing = (ring: Ring) => {
    for (const [lon, lat] of ring) {
      if (lon < w) w = lon;
      if (lat < s) s = lat;
      if (lon > e) e = lon;
      if (lat > n) n = lat;
    }
  };
  if (f.geometry.type === 'Polygon') {
    for (const r of f.geometry.coordinates) visitRing(r);
  } else {
    for (const poly of f.geometry.coordinates) for (const r of poly) visitRing(r);
  }
  if (!isFinite(w)) return null;
  return [w, s, e, n];
}

function bboxIntersects(
  a: [number, number, number, number],
  b: [number, number, number, number],
): boolean {
  return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);
}

/** Collect all polygons from the selected features, optionally cropped by bbox. */
function collectPolygons(
  features: Feature[],
  crop?: [number, number, number, number],
): Ring[] {
  const rings: Ring[] = [];
  for (const f of features) {
    if (!f.geometry) continue;
    const polys =
      f.geometry.type === 'Polygon'
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    for (const poly of polys) {
      // The outer ring is coordinates[0]; skip holes (coordinates[1+])
      const outer = poly[0];
      if (!outer || outer.length < 4) continue;
      if (crop) {
        let ringW = Infinity,
          ringS = Infinity,
          ringE = -Infinity,
          ringN = -Infinity;
        for (const [lon, lat] of outer) {
          if (lon < ringW) ringW = lon;
          if (lat < ringS) ringS = lat;
          if (lon > ringE) ringE = lon;
          if (lat > ringN) ringN = lat;
        }
        if (!bboxIntersects([ringW, ringS, ringE, ringN], crop)) continue;
      }
      rings.push(outer);
    }
  }
  return rings;
}

// ────────────────────────────────────────────────────────────────────────────
// Projection + simplification
// ────────────────────────────────────────────────────────────────────────────

/**
 * Equirectangular projection into the 0..100 normalized canvas space, given
 * the preset's bounding box (west, south, east, north). Aspect ratio is
 * preserved so outlines don't get stretched — the map is letterboxed inside
 * the 100×100 box if the bbox aspect ratio doesn't match.
 */
function makeProjection(
  bbox: [number, number, number, number],
): (lon: number, lat: number) => [number, number] {
  const [w, s, e, n] = bbox;
  const lonRange = e - w;
  const latRange = n - s;
  // Apply latitude correction at the midpoint — at mid-latitudes,
  // longitude degrees are narrower than latitude degrees on screen. Without
  // this, Europe/Middle East stretch east-west.
  const midLat = (s + n) / 2;
  const lonScale = Math.cos((midLat * Math.PI) / 180);
  const effLonRange = lonRange * lonScale;

  const availW = 100 - (INSET / SVG_WIDTH) * 200;
  const availH = 100 - (INSET / SVG_HEIGHT) * 200;
  const scale = Math.min(availW / effLonRange, availH / latRange);
  const outW = effLonRange * scale;
  const outH = latRange * scale;
  const offX = (100 - outW) / 2;
  const offY = (100 - outH) / 2;

  return (lon, lat) => {
    const x = offX + (lon - w) * lonScale * scale;
    // SVG y is top-down; latitude is bottom-up. Flip.
    const y = offY + (n - lat) * scale;
    return [x, y];
  };
}

/** Convert 0..100 normalized coords to SVG pixel coords for the final path. */
function toSvgCoord(x: number, y: number): [number, number] {
  return [
    (x / 100) * SVG_WIDTH,
    (y / 100) * SVG_HEIGHT,
  ];
}

/**
 * Ramer-Douglas-Peucker: drop points that deviate less than `tolerance`
 * (in normalized 0..100 units) from the line between their neighbors.
 */
function simplify(points: Array<[number, number]>, tolerance: number): Array<[number, number]> {
  if (points.length < 3) return points;
  const keep = new Array<boolean>(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  const distSq = (p: [number, number], a: [number, number], b: [number, number]): number => {
    const [px, py] = p;
    const [ax, ay] = a;
    const [bx, by] = b;
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) {
      const ex = px - ax;
      const ey = py - ay;
      return ex * ex + ey * ey;
    }
    const t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    const cx = ax + Math.max(0, Math.min(1, t)) * dx;
    const cy = ay + Math.max(0, Math.min(1, t)) * dy;
    const ex = px - cx;
    const ey = py - cy;
    return ex * ex + ey * ey;
  };

  const tolSq = tolerance * tolerance;
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    let maxD = 0;
    let maxI = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = distSq(points[i], points[lo], points[hi]);
      if (d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    if (maxD > tolSq && maxI > 0) {
      keep[maxI] = true;
      stack.push([lo, maxI]);
      stack.push([maxI, hi]);
    }
  }
  const out: Array<[number, number]> = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

function ringToSvgPath(ring: Array<[number, number]>): string {
  if (ring.length === 0) return '';
  const cmds: string[] = [];
  const [sx, sy] = ring[0];
  cmds.push(`M${sx.toFixed(1)},${sy.toFixed(1)}`);
  for (let i = 1; i < ring.length; i++) {
    const [x, y] = ring[i];
    cmds.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  cmds.push('Z');
  return cmds.join('');
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const fc = await fetchGeoJson();
  console.log(`Loaded ${fc.features.length} countries`);

  const output: Record<string, string> = {};
  const presetBboxes: Record<string, [number, number, number, number]> = {};

  for (const preset of PRESETS) {
    // Select features
    let selected: Feature[] = [];
    if (preset.admins) {
      const adminSet = new Set(preset.admins);
      selected = fc.features.filter((f) =>
        typeof f.properties.ADMIN === 'string' && adminSet.has(f.properties.ADMIN as string),
      );
    } else if (preset.filter) {
      selected = fc.features.filter((f) => preset.filter!(f.properties));
    }

    if (selected.length === 0) {
      console.warn(`Preset "${preset.key}": no features matched`);
      continue;
    }

    // Compute bbox. Use the preset.bbox as crop (features outside are discarded)
    // AND as the projection extent.
    let bbox: [number, number, number, number];
    if (preset.bbox) {
      bbox = preset.bbox;
    } else {
      let w = Infinity,
        s = Infinity,
        e = -Infinity,
        n = -Infinity;
      for (const f of selected) {
        const bb = featureBbox(f);
        if (!bb) continue;
        if (bb[0] < w) w = bb[0];
        if (bb[1] < s) s = bb[1];
        if (bb[2] > e) e = bb[2];
        if (bb[3] > n) n = bb[3];
      }
      bbox = [w, s, e, n];
    }

    const project = makeProjection(bbox);

    // Collect + project + simplify each polygon ring
    const rings = collectPolygons(selected, preset.bbox);
    const paths: string[] = [];
    for (const ring of rings) {
      // Project lon/lat → 0..100 normalized
      const projected: Array<[number, number]> = ring.map(([lon, lat]) => project(lon, lat));
      // Simplify in normalized space
      const simplified = simplify(projected, preset.simplifyTolerance ?? 0.3);
      if (simplified.length < 4) continue;
      // Project normalized → SVG pixel
      const svgRing = simplified.map(([x, y]) => toSvgCoord(x, y));
      paths.push(ringToSvgPath(svgRing));
    }
    if (paths.length === 0) {
      console.warn(`Preset "${preset.key}": no rings after simplification`);
      continue;
    }
    output[preset.key] = paths.join(' ');
    presetBboxes[preset.key] = bbox;
    console.log(
      `Preset "${preset.key}": ${paths.length} ring(s), ${output[preset.key].length} chars, bbox ${bbox.map((v) => v.toFixed(1)).join(',')}`,
    );
  }

  // Also emit the bbox per preset so the renderer could potentially project
  // pin coords back — but we're keeping pin coords in 0..100 for now so
  // this is mostly informational.
  const lines: string[] = [
    '// AUTO-GENERATED by scripts/generate-map-backgrounds.ts',
    '// Source: Natural Earth 110m country boundaries (public domain).',
    '// DO NOT EDIT — re-run the script if the source needs to change.',
    '',
    'export const MAP_BACKGROUND_PATHS: Record<string, string> = {',
  ];
  for (const key of Object.keys(output)) {
    lines.push(`  ${JSON.stringify(key)}: ${JSON.stringify(output[key])},`);
  }
  lines.push('};');
  lines.push('');
  lines.push('/** Geographic bounding box per preset: [west, south, east, north] in lon/lat. */');
  lines.push('export const MAP_BACKGROUND_BBOXES: Record<string, [number, number, number, number]> = {');
  for (const key of Object.keys(presetBboxes)) {
    const b = presetBboxes[key];
    lines.push(`  ${JSON.stringify(key)}: [${b.map((v) => v.toFixed(3)).join(', ')}],`);
  }
  lines.push('};');
  lines.push('');

  writeFileSync(OUTPUT_FILE, lines.join('\n'));
  console.log(`\nWrote ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
