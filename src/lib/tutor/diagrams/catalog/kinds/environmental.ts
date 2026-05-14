/**
 * Environmental / demographic diagram kinds (AP Env Sci, AP Human Geo,
 * AP Macro):
 *   - population_pyramid: horizontal age-sex distribution (males left,
 *     females right). Used to predict population trajectory.
 *   - climate_diagram: monthly temperature (line) + precipitation (bars)
 *     for one location. Walter-Lieth style.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

interface PopulationPyramidBin {
  ageLabel: string;
  male: number;
  female: number;
}

interface ClimateDiagramMonth {
  label: string;
  temp: number;
  precip: number;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

// ── population_pyramid ──────────────────────────────────────────────────

export interface PopulationPyramidFigure {
  ageGroups: PopulationPyramidBin[];
  mode: 'count' | 'percent';
  maxValue: number;
  title?: string;
  xLabel?: string;
  ageGroupLabel: string;
}

export function solvePopulationPyramid(params: Record<string, unknown>): PopulationPyramidFigure {
  if (!Array.isArray(params.ageGroups) || params.ageGroups.length === 0) {
    throw new Error('ageGroups must be a non-empty array of {ageLabel, male, female} or [ageLabel, male, female]');
  }
  const ageGroups: PopulationPyramidBin[] = (params.ageGroups as unknown[]).map((g, i): PopulationPyramidBin => {
    if (Array.isArray(g)) {
      if (typeof g[0] !== 'string' || !isFiniteNumber(g[1]) || !isFiniteNumber(g[2])) {
        throw new Error(`ageGroups[${i}] tuple needs [ageLabel:string, male:number, female:number]`);
      }
      if (g[1] < 0 || g[2] < 0) throw new Error(`ageGroups[${i}] counts must be ≥ 0`);
      return { ageLabel: g[0], male: g[1], female: g[2] };
    }
    if (!g || typeof g !== 'object') throw new Error(`ageGroups[${i}] must be {ageLabel,male,female} or [ageLabel,male,female]`);
    const gg = g as Record<string, unknown>;
    if (typeof gg.ageLabel !== 'string' || !isFiniteNumber(gg.male) || !isFiniteNumber(gg.female)) {
      throw new Error(`ageGroups[${i}] needs string ageLabel and finite male, female`);
    }
    if (gg.male < 0 || gg.female < 0) throw new Error(`ageGroups[${i}] counts must be ≥ 0`);
    return { ageLabel: gg.ageLabel, male: gg.male, female: gg.female };
  });

  const mode: 'count' | 'percent' = params.mode === 'count' ? 'count' : 'percent';
  const maxValue = ageGroups.reduce((m, g) => Math.max(m, g.male, g.female), 0) || 1;

  return {
    ageGroups,
    mode,
    maxValue: isFiniteNumber(params.maxValue) && (params.maxValue as number) > 0 ? (params.maxValue as number) : maxValue * 1.1,
    title: typeof params.title === 'string' ? params.title : undefined,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
    ageGroupLabel: typeof params.ageGroupLabel === 'string' ? params.ageGroupLabel : 'Age',
  };
}

// ── climate_diagram ─────────────────────────────────────────────────────

export interface ClimateDiagramFigure {
  months: ClimateDiagramMonth[];
  tempUnit: string;
  precipUnit: string;
  location?: string;
  title?: string;
  meanAnnualTemp?: number;
  totalAnnualPrecip?: number;
}

export function solveClimateDiagram(params: Record<string, unknown>): ClimateDiagramFigure {
  if (!Array.isArray(params.months) || params.months.length === 0) {
    throw new Error('months must be an array of {label,temp,precip} or [label,temp,precip]');
  }
  const months: ClimateDiagramMonth[] = (params.months as unknown[]).map((m, i): ClimateDiagramMonth => {
    if (Array.isArray(m)) {
      if (typeof m[0] !== 'string' || !isFiniteNumber(m[1]) || !isFiniteNumber(m[2])) {
        throw new Error(`months[${i}] tuple needs [label:string, temp:number, precip:number]`);
      }
      if (m[2] < 0) throw new Error(`months[${i}] precipitation must be ≥ 0`);
      return { label: m[0], temp: m[1], precip: m[2] };
    }
    if (!m || typeof m !== 'object') throw new Error(`months[${i}] must be {label,temp,precip} or [label,temp,precip]`);
    const mm = m as Record<string, unknown>;
    if (typeof mm.label !== 'string' || !isFiniteNumber(mm.temp) || !isFiniteNumber(mm.precip)) {
      throw new Error(`months[${i}] needs label:string, temp:number, precip:number`);
    }
    if (mm.precip < 0) throw new Error(`months[${i}] precipitation must be ≥ 0`);
    return { label: mm.label, temp: mm.temp, precip: mm.precip };
  });

  const tempUnit = params.tempUnit === '°F' ? '°F' : '°C';
  const precipUnit = params.precipUnit === 'in' ? 'in' : 'mm';

  const meanAnnualTemp = months.reduce((s, m) => s + m.temp, 0) / months.length;
  const totalAnnualPrecip = months.reduce((s, m) => s + m.precip, 0);

  return {
    months,
    tempUnit,
    precipUnit,
    location: typeof params.location === 'string' ? params.location : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
    meanAnnualTemp: isFiniteNumber(params.meanAnnualTemp) ? (params.meanAnnualTemp as number) : meanAnnualTemp,
    totalAnnualPrecip: isFiniteNumber(params.totalAnnualPrecip) ? (params.totalAnnualPrecip as number) : totalAnnualPrecip,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Phase 12 manifests (whiteboard markup initiative).
// ═══════════════════════════════════════════════════════════════════

function _envSlug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── population_pyramid ───────────────────────────────────────────
export const populationPyramidFeatureNames = {
  diagram: 'population-pyramid',
  malesSide: 'males',
  femalesSide: 'females',
  ageGroup: (label: string): string => `age-${_envSlug(label)}`,
  maleBar: (label: string): string => `male-bar-${_envSlug(label)}`,
  femaleBar: (label: string): string => `female-bar-${_envSlug(label)}`,
  base: 'pyramid-base',
  top: 'pyramid-top',
};

export function buildPopulationPyramidManifest(figure: PopulationPyramidFigure): FeatureManifestEntry[] {
  const N = populationPyramidFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'population pyramid (age-sex distribution)',
      labels: ['population pyramid', 'the population pyramid', 'the pyramid', 'the diagram', 'the graph', 'age-sex distribution'],
      displayName: figure.title || 'population pyramid',
      scribbleable: true,
    },
    {
      name: N.malesSide,
      kind: 'region',
      description: 'males (left side of pyramid)',
      labels: ['males', 'the males', 'male side', 'the male side', 'left side', 'the left side', 'men'],
      displayName: 'males',
      scribbleable: true,
    },
    {
      name: N.femalesSide,
      kind: 'region',
      description: 'females (right side of pyramid)',
      labels: ['females', 'the females', 'female side', 'the female side', 'right side', 'the right side', 'women'],
      displayName: 'females',
      scribbleable: true,
    },
  ];
  // The bottom and top age groups are pedagogically important: wide base
  // = expanding, narrow base = declining.
  if (figure.ageGroups.length > 0) {
    const youngest = figure.ageGroups[0];
    features.push({
      name: N.base,
      kind: 'label',
      description: `pyramid base (youngest age group: ${youngest.ageLabel})`,
      labels: ['base', 'the base', 'pyramid base', 'the pyramid base', 'bottom', 'the bottom', 'youngest', 'the youngest', `the ${youngest.ageLabel} age group`],
      displayName: `base (${youngest.ageLabel})`,
      scribbleable: true,
    });
    const oldest = figure.ageGroups[figure.ageGroups.length - 1];
    features.push({
      name: N.top,
      kind: 'label',
      description: `pyramid top (oldest age group: ${oldest.ageLabel})`,
      labels: ['top', 'the top', 'pyramid top', 'the pyramid top', 'oldest', 'the oldest', 'elderly', `the ${oldest.ageLabel} age group`],
      displayName: `top (${oldest.ageLabel})`,
      scribbleable: true,
    });
  }
  figure.ageGroups.forEach((g) => {
    const desc = `age ${g.ageLabel}: ${g.male.toFixed(1)}${figure.mode === 'percent' ? '%' : ''} male, ${g.female.toFixed(1)}${figure.mode === 'percent' ? '%' : ''} female`;
    features.push({
      name: N.ageGroup(g.ageLabel),
      kind: 'label',
      description: desc,
      labels: [
        g.ageLabel, `"${g.ageLabel}"`, `the ${g.ageLabel} group`, `age group ${g.ageLabel}`,
        `the ${g.ageLabel} age group`, `the ${g.ageLabel} cohort`,
        desc,
      ],
      displayName: `age ${g.ageLabel}`,
      scribbleable: true,
    });
    features.push({
      name: N.maleBar(g.ageLabel),
      kind: 'label',
      description: `male bar at age ${g.ageLabel}: ${g.male.toFixed(1)}${figure.mode === 'percent' ? '%' : ''}`,
      labels: [
        `male ${g.ageLabel}`, `male bar at ${g.ageLabel}`, `the male ${g.ageLabel} bar`,
        `the ${g.ageLabel} males`, `${g.ageLabel} men`,
      ],
      displayName: `male ${g.ageLabel}`,
      scribbleable: true,
    });
    features.push({
      name: N.femaleBar(g.ageLabel),
      kind: 'label',
      description: `female bar at age ${g.ageLabel}: ${g.female.toFixed(1)}${figure.mode === 'percent' ? '%' : ''}`,
      labels: [
        `female ${g.ageLabel}`, `female bar at ${g.ageLabel}`, `the female ${g.ageLabel} bar`,
        `the ${g.ageLabel} females`, `${g.ageLabel} women`,
      ],
      displayName: `female ${g.ageLabel}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── climate_diagram ──────────────────────────────────────────────
export const climateDiagramFeatureNames = {
  diagram: 'climate-diagram',
  tempLine: 'temperature-line',
  precipBars: 'precipitation-bars',
  month: (label: string): string => `month-${_envSlug(label)}`,
  meanTemp: 'mean-temp-label',
  totalPrecip: 'total-precip-label',
  location: 'location-label',
};

export function buildClimateDiagramManifest(figure: ClimateDiagramFigure): FeatureManifestEntry[] {
  const N = climateDiagramFeatureNames;
  const loc = figure.location || 'this location';
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: `Walter-Lieth climate diagram for ${loc}`,
      labels: ['climate diagram', 'the climate diagram', 'Walter-Lieth diagram', 'the diagram', 'the graph'],
      displayName: figure.title || `climate diagram (${loc})`,
      scribbleable: true,
    },
    {
      name: N.tempLine,
      kind: 'label',
      description: 'monthly temperature line (red)',
      labels: [
        'temperature', 'the temperature', 'temperature line', 'the temperature line',
        'temp', 'the temp', 'temp line', 'the temp line',
        'red line', 'the red line', 'temperature curve', 'the temperature curve',
        // Verbose description-format (brain copies from description).
        'monthly temperature line (red)',
        'monthly temperature line',
      ],
      displayName: 'temperature line',
      scribbleable: true,
    },
    {
      name: N.precipBars,
      kind: 'region',
      description: 'monthly precipitation bars (blue)',
      labels: [
        'precipitation', 'the precipitation', 'precip', 'the precip',
        'precipitation bars', 'the precipitation bars', 'rainfall', 'the rainfall',
        'blue bars', 'the blue bars', 'rain bars', 'the rain bars',
        // Verbose description-format.
        'monthly precipitation bars (blue)',
        'monthly precipitation bars',
      ],
      displayName: 'precipitation bars',
      scribbleable: true,
    },
  ];
  figure.months.forEach((m) => {
    const desc = `${m.label}: ${m.temp.toFixed(1)}${figure.tempUnit}, ${m.precip.toFixed(0)}${figure.precipUnit}`;
    features.push({
      name: N.month(m.label),
      kind: 'label',
      description: desc,
      labels: [
        m.label, `the ${m.label}`, `"${m.label}"`,
        `${m.label} bar`, `the ${m.label} bar`,
        `${m.label} month`, `the ${m.label} month`,
        desc,
      ],
      displayName: m.label,
      scribbleable: true,
    });
  });
  if (figure.meanAnnualTemp !== undefined) {
    features.push({
      name: N.meanTemp,
      kind: 'label',
      description: `mean annual temperature: ${figure.meanAnnualTemp.toFixed(1)}${figure.tempUnit}`,
      labels: [
        'mean temperature', 'the mean temperature', 'mean annual temperature', 'annual mean temp',
        'average temperature', 'the average temperature',
        `${figure.meanAnnualTemp.toFixed(1)}${figure.tempUnit}`,
      ],
      displayName: `mean = ${figure.meanAnnualTemp.toFixed(1)}${figure.tempUnit}`,
      scribbleable: true,
    });
  }
  if (figure.totalAnnualPrecip !== undefined) {
    features.push({
      name: N.totalPrecip,
      kind: 'label',
      description: `total annual precipitation: ${figure.totalAnnualPrecip.toFixed(0)}${figure.precipUnit}`,
      labels: [
        'total precipitation', 'the total precipitation', 'annual precipitation', 'total rainfall', 'annual rainfall',
        `${figure.totalAnnualPrecip.toFixed(0)}${figure.precipUnit}`,
      ],
      displayName: `total = ${figure.totalAnnualPrecip.toFixed(0)}${figure.precipUnit}`,
      scribbleable: true,
    });
  }
  if (figure.location) {
    features.push({
      name: N.location,
      kind: 'label',
      description: `location: ${figure.location}`,
      labels: [figure.location, `the ${figure.location}`, `"${figure.location}"`, 'location', 'the location'],
      displayName: figure.location,
      scribbleable: true,
    });
  }
  return features;
}
