/**
 * vectors_3d — a 3D coordinate system (isometric) with vectors, points, an
 * optional line (r = p + t·d) and an optional plane (point + normal, drawn as a
 * parallelogram patch). For IB AA / JEE / multivariable vectors & 3D geometry,
 * which a 2D vector tool and a rough sketch both can't represent.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export type Vec3 = [number, number, number];

export interface Vectors3DFigure {
  vectors: Array<{ to: Vec3; from: Vec3; label?: string; color?: string }>;
  points: Array<{ at: Vec3; label?: string; color?: string }>;
  line?: { point: Vec3; dir: Vec3; label?: string };
  plane?: { point: Vec3; normal: Vec3; label?: string };
  range: number;
  title?: string;
}

function vec3(v: unknown): Vec3 | null {
  if (Array.isArray(v) && v.length >= 3) {
    const [a, b, c] = [Number(v[0]), Number(v[1]), Number(v[2])];
    if ([a, b, c].every(Number.isFinite)) return [a, b, c];
  }
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const [a, b, c] = [Number(o.x), Number(o.y), Number(o.z)];
    if ([a, b, c].every(Number.isFinite)) return [a, b, c];
  }
  return null;
}

export function solveVectors3D(params: Record<string, unknown>): Vectors3DFigure {
  const vectors: Vectors3DFigure['vectors'] = [];
  if (Array.isArray(params.vectors)) {
    for (const raw of params.vectors as Array<Record<string, unknown>>) {
      const to = vec3(raw.to ?? raw.components ?? raw.v);
      if (!to) continue;
      vectors.push({
        to,
        from: vec3(raw.from) ?? [0, 0, 0],
        label: typeof raw.label === 'string' ? raw.label : undefined,
        color: typeof raw.color === 'string' ? raw.color : undefined,
      });
    }
  }
  const points: Vectors3DFigure['points'] = [];
  if (Array.isArray(params.points)) {
    for (const raw of params.points as Array<Record<string, unknown>>) {
      const at = vec3(raw.at ?? raw.point ?? raw);
      if (!at) continue;
      points.push({
        at,
        label: typeof raw.label === 'string' ? raw.label : undefined,
        color: typeof raw.color === 'string' ? raw.color : undefined,
      });
    }
  }
  let line: Vectors3DFigure['line'];
  if (params.line && typeof params.line === 'object') {
    const l = params.line as Record<string, unknown>;
    const point = vec3(l.point ?? l.through);
    const dir = vec3(l.dir ?? l.direction);
    if (point && dir) line = { point, dir, label: typeof l.label === 'string' ? l.label : undefined };
  }
  let plane: Vectors3DFigure['plane'];
  if (params.plane && typeof params.plane === 'object') {
    const p = params.plane as Record<string, unknown>;
    const point = vec3(p.point ?? p.through);
    const normal = vec3(p.normal ?? p.n);
    if (point && normal) plane = { point, normal, label: typeof p.label === 'string' ? p.label : undefined };
  }

  // Auto axis range from the data unless given.
  const coords: number[] = [];
  vectors.forEach((v) => coords.push(...v.to, ...v.from));
  points.forEach((p) => coords.push(...p.at));
  if (line) coords.push(...line.point);
  if (plane) coords.push(...plane.point);
  const auto = Math.ceil(Math.max(3, ...coords.map((c) => Math.abs(c)), 1));
  const range = typeof params.axisRange === 'number' && params.axisRange > 0 ? params.axisRange : auto;

  return { vectors, points, line, plane, range, title: typeof params.title === 'string' ? params.title : undefined };
}

export const vectors3DFeatureNames = {
  axes: 'axes',
  vector: (i: number): string => `vector-${i + 1}`,
  point: (i: number): string => `point-${i + 1}`,
  line: 'line',
  plane: 'plane',
};

export function buildVectors3DManifest(figure: Vectors3DFigure): FeatureManifestEntry[] {
  const N = vectors3DFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.axes,
      kind: 'axis',
      description: '3D coordinate axes',
      labels: ['the axes', 'axes', 'coordinate system', 'the diagram'],
      displayName: figure.title || '3D axes',
      scribbleable: true,
    },
  ];
  figure.vectors.forEach((v, i) => {
    features.push({
      name: N.vector(i),
      kind: 'segment',
      description: v.label ? `vector ${v.label}` : `vector ${i + 1}`,
      labels: [...(v.label ? [v.label, `vector ${v.label}`, `the ${v.label} vector`] : []), `vector ${i + 1}`],
      displayName: v.label || `vector ${i + 1}`,
      scribbleable: true,
    });
  });
  figure.points.forEach((p, i) => {
    features.push({
      name: N.point(i),
      kind: 'point',
      description: p.label ? `point ${p.label}` : `point ${i + 1}`,
      labels: [...(p.label ? [p.label, `point ${p.label}`] : []), `point ${i + 1}`],
      displayName: p.label || `point ${i + 1}`,
      scribbleable: true,
    });
  });
  if (figure.line) features.push({ name: N.line, kind: 'curve', description: figure.line.label || 'line', labels: ['the line', 'line', ...(figure.line.label ? [figure.line.label] : [])], displayName: figure.line.label || 'line', scribbleable: true });
  if (figure.plane) features.push({ name: N.plane, kind: 'area', description: figure.plane.label || 'plane', labels: ['the plane', 'plane', ...(figure.plane.label ? [figure.plane.label] : [])], displayName: figure.plane.label || 'plane', scribbleable: true });
  return features;
}
