/**
 * Environmental / demographic diagram kinds (AP Env Sci, AP Human Geo,
 * AP Macro):
 *   - population_pyramid: horizontal age-sex distribution (males left,
 *     females right). Used to predict population trajectory.
 *   - climate_diagram: monthly temperature (line) + precipitation (bars)
 *     for one location. Walter-Lieth style.
 */

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
