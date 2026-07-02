/**
 * Feature-manifest dispatcher.
 *
 * Each structured renderer exports a pure buildXxxManifest(props) function
 * that enumerates the named features its SVG will emit. This dispatcher
 * routes a WhiteboardCommand to the right builder by action, so the command
 * handler can attach the manifest to its result synchronously — before
 * React renders the actual SVG.
 *
 * Adding a new renderer:
 *   1. Export buildXxxManifest(props) from the renderer file (colocated with
 *      the feat() calls so names stay in sync).
 *   2. Import it here and add a case to the switch.
 *
 * Unknown / unmigrated actions return null — the tool-result then omits the
 * features array entirely, and the tutor falls back to the (soon-trimmed)
 * per-renderer feature docs in the system prompt.
 */

import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { FeatureManifestEntry } from './layout';

// Pilots (landed first)
import { buildScatterPlotManifest } from '@/app/tutor/components/whiteboard/ScatterPlotRenderer';
import { buildSpringMassManifest } from '@/app/tutor/components/whiteboard/SpringMassRenderer';

// Physics
import { buildRayDiagramManifest } from '@/app/tutor/components/whiteboard/RayDiagramRenderer';
import { buildWaveManifest } from '@/app/tutor/components/whiteboard/WaveRenderer';
import { buildPendulumManifest } from '@/app/tutor/components/whiteboard/PendulumRenderer';
import { buildProjectileMotionManifest } from '@/app/tutor/components/whiteboard/ProjectileMotionRenderer';
import { buildMotionDiagramManifest } from '@/app/tutor/components/whiteboard/MotionDiagramRenderer';
import { buildFreeBodyDiagramManifest } from '@/app/tutor/components/whiteboard/FreeBodyDiagramRenderer';
import { buildEnergyBarsManifest } from '@/app/tutor/components/whiteboard/EnergyBarsRenderer';
import { buildCollisionManifest } from '@/app/tutor/components/whiteboard/CollisionRenderer';
import { buildSimpleMachineManifest } from '@/app/tutor/components/whiteboard/SimpleMachineRenderer';
import { buildCircuitManifest } from '@/app/tutor/components/whiteboard/CircuitRenderer';

// Math / Stats / Data
import { buildCoordinatePlaneManifest } from '@/app/tutor/components/whiteboard/CoordinatePlaneRenderer';
import { buildStatsManifest } from '@/app/tutor/components/whiteboard/StatsRenderer';
import { buildManipulativeManifest } from '@/app/tutor/components/whiteboard/ManipulativeRenderer';
import { buildNumberLineManifest } from '@/app/tutor/components/whiteboard/NumberLineRenderer';
import { buildFractionBarManifest } from '@/app/tutor/components/whiteboard/FractionBarRenderer';
import { buildGeometryManifest } from '@/app/tutor/components/whiteboard/GeometryRenderer';
import { solveGeometry } from '@/lib/tutor/diagrams/geometry-solver';
import {
  buildComparisonTableManifest,
  solveComparisonTable,
  buildTChartManifest,
  buildKwlChartManifest,
  buildFrayerModelManifest,
  buildArgumentStructureManifest,
  buildGovernmentBranchesManifest,
  buildSentenceDiagramManifest,
  buildHistoricalTimelineManifest,
  buildHierarchyPyramidManifest,
  solveOrganizer,
  solveArgumentStructure,
  solveGovernmentBranches,
  solveSentenceDiagram,
  solveHistoricalTimeline,
  solveHierarchyPyramid,
  // Phase 6 — advanced math.
  buildUnitCircleManifest as buildCatalogUnitCircleManifest,
  buildTransformationManifest,
  buildInequalityGraphManifest,
  solveUnitCircle,
  solveTransformation,
  solveInequalityGraph,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import {
  buildCycleStagesManifest,
  buildBodySystemManifest,
  buildElectronConfigurationManifest,
  // Aliased: the legacy `showOrbitalDiagram` tool (NOT the catalog-
  // dispatched `show_diagram(orbital_diagram)`) already imports a
  // function with the same name from a different renderer.
  buildOrbitalDiagramManifest as buildCatalogOrbitalDiagramManifest,
  buildPeriodicTableHighlightManifest,
  buildPunnettSquareManifest,
  solveCycleStages,
  solveBodySystem,
  solveElectronConfiguration,
  solveOrbitalDiagram,
  solvePeriodicTableHighlight,
  solvePunnettSquare,
} from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';
import {
  buildPhasesOfMoonManifest,
  buildSolarSystemManifest,
  buildEarthLayersManifest,
  buildEclipseDiagramManifest,
  buildSeasonsDiagramManifest,
  buildPlateTectonicsManifest,
  solvePhasesOfMoon,
  solveSolarSystem,
  solveEarthLayers,
  solveEclipseDiagram,
  solveSeasonsDiagram,
  solvePlateTectonics,
} from '@/lib/tutor/diagrams/catalog/kinds/earth-space';
import {
  // Aliased: the legacy `show_flowchart` tool already imports a
  // function named `buildFlowchartManifest` from a different module.
  buildFlowchartSimpleManifest as buildCatalogFlowchartSimpleManifest,
  buildStateMachineManifest,
  buildBinaryTreeManifest,
  buildTruthTableManifest as buildCatalogTruthTableManifest,
  buildLogicGateManifest,
  solveFlowchartSimple,
  solveStateMachine,
  solveBinaryTree,
  solveTruthTable,
  solveLogicGate,
} from '@/lib/tutor/diagrams/catalog/kinds/cs';
import {
  buildProductionPossibilitiesManifest,
  buildBusinessCycleManifest,
  buildAggregateDemandSupplyManifest,
  buildMoneyMarketManifest,
  buildLoanableFundsManifest,
  buildPhillipsCurveManifest,
  buildForeignExchangeMarketManifest,
  solveProductionPossibilities,
  solveBusinessCycle,
  solveAggregateDemandSupply,
  solveMoneyMarket,
  solveLoanableFunds,
  solvePhillipsCurve,
  solveForeignExchangeMarket,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';
import {
  buildRiemannSumManifest,
  buildSlopeFieldManifest,
  buildParametricCurveManifest,
  buildPolarGraphManifest,
  buildTaylorPolynomialOverlayManifest,
  solveRiemannSum,
  solveSlopeField,
  solveParametricCurve,
  solvePolarGraph,
  solveTaylorPolynomialOverlay,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import {
  buildHistogramManifest,
  buildNormalCurveManifest,
  buildScatterRegressionManifest,
  solveHistogram,
  solveNormalCurve,
  solveScatterRegression,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';
import {
  buildPopulationPyramidManifest,
  buildClimateDiagramManifest,
  solvePopulationPyramid,
  solveClimateDiagram,
} from '@/lib/tutor/diagrams/catalog/kinds/environmental';
import {
  buildNutrientCycleManifest,
  solveNutrientCycle as solveNutrientCycleForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/nutrient-cycle';
import {
  buildNeuronManifest,
  solveNeuronDiagram as solveNeuronForManifest,
  buildBrainRegionsManifest,
  solveBrainRegions as solveBrainForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/anatomy';
import {
  buildConicSectionsManifest,
  solveConicSections as solveConicSectionsForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/conic-sections';
import {
  buildSolidOfRevolutionManifest,
  solveSolidOfRevolution as solveSolidOfRevolutionForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/solid-of-revolution';
import {
  buildSolid3DManifest,
  solveSolid3D as solveSolid3DForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/solid-3d';
import {
  buildVectors3DManifest,
  solveVectors3D as solveVectors3DForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/vectors-3d';
import {
  buildVseprManifest,
  solveVseprGeometry as solveVseprForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/vsepr';
import {
  buildFieldLinesManifest,
  solveFieldLines as solveFieldLinesForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/field-lines';
import {
  buildPhaseDiagramManifest,
  solvePhaseDiagram as solvePhaseDiagramForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/phase-diagram';
import {
  buildHeartManifest,
  solveHeartDiagram as solveHeartForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/heart';
import {
  buildCellEnergyManifest,
  solvePhotosynthesis as solvePhotoForManifest,
  solveCellularRespiration as solveRespForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/cell-energy';
import {
  buildDopplerManifest,
  solveDopplerEffect as solveDopplerForManifest,
  buildStandingWaveManifest,
  solveStandingWave as solveStandingWaveForManifest,
  buildInterferenceManifest,
  solveInterferencePattern as solveInterferenceForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/waves';
import {
  buildMitosisManifest,
  solveMitosis as solveMitosisForManifest,
  buildMeiosisManifest,
  solveMeiosis as solveMeiosisForManifest,
  buildDnaReplicationManifest,
  solveDnaReplication as solveDnaReplicationForManifest,
  buildCellMembraneManifest,
  solveCellMembrane as solveCellMembraneForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/cell-biology';
import {
  buildBohrManifest,
  solveBohrModel as solveBohrForManifest,
  buildGalvanicManifest,
  solveGalvanicCell as solveGalvanicForManifest,
  buildTitrationManifest,
  solveTitrationCurve as solveTitrationForManifest,
  buildLatticeManifest,
  solveCrystalLattice as solveLatticeForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/chemistry';
import {
  buildNuclearDecayManifest,
  solveNuclearDecay as solveNuclearDecayForManifest,
  buildEMInductionManifest,
  solveEMInduction as solveEMInductionForManifest,
  buildMagneticFieldManifest,
  solveMagneticFieldCurrent as solveMagneticFieldForManifest,
  buildProjectileManifest,
  solveProjectileMotion as solveProjectileForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/em-nuclear-motion';
import {
  buildLeafCrossSectionManifest,
  solveLeafCrossSection as solveLeafForManifest,
  buildNephronManifest,
  solveNephron as solveNephronForManifest,
  buildDigestiveSystemManifest,
  solveDigestiveSystem as solveDigestiveForManifest,
  buildCirculatorySystemManifest,
  solveCirculatorySystem as solveCirculatoryForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/bio-anatomy';
import {
  buildDataStructureManifest,
  solveDataStructure as solveDataStructureForManifest,
  buildGraphManifest as buildGraphDiagramManifest,
  solveGraphDiagram as solveGraphForManifest,
  buildHashTableManifest,
  solveHashTable as solveHashTableForManifest,
  buildRecursionTreeManifest,
  solveRecursionTree as solveRecursionTreeForManifest,
} from '@/lib/tutor/diagrams/catalog/kinds/cs-structures';

/**
 * Run the same solver used at render time, then feed the resulting
 * primitive geometry into buildGeometryManifest. This registers the
 * SOLVED point coordinates with the catalog (e.g. "point \"A\" at
 * (-1.21, 3.83)") so the snapshot the brain sees on the next turn
 * carries those coords. Without this, every showGeometryConstructed
 * item registers as zero features and the brain has to re-imagine
 * where it placed P, Q, A, etc. — observed as cross-turn coordinate
 * drift across slides 21-25 in the 2026-04-26 session.
 */
function buildGeometryConstructedManifest(cmd: { title?: string; given?: unknown[]; steps?: unknown[]; display?: Record<string, unknown> }) {
  try {
    const solved = solveGeometry({
      title: cmd.title,
      given: cmd.given as never,
      steps: cmd.steps as never,
      display: cmd.display as never,
    });
    return buildGeometryManifest({
      title: solved.title,
      points: solved.points,
      segments: solved.segments,
      polygons: solved.polygons,
      circles: solved.circles,
      arcs: solved.arcs,
      angles: solved.angles,
      showGrid: solved.showGrid,
      showAxes: solved.showAxes,
      viewRange: solved.viewRange,
    });
  } catch {
    // Bad spec — manifest is empty. Renderer will surface the
    // construction error; we don't need to double-report.
    return [];
  }
}
import { buildUnitCircleManifest } from '@/app/tutor/components/whiteboard/UnitCircleRenderer';
import { buildVectorManifest } from '@/app/tutor/components/whiteboard/VectorRenderer';

// Biology / Chemistry / Diagrams
import { buildCellDiagramManifest } from '@/app/tutor/components/whiteboard/CellDiagramRenderer';
import { buildDnaManifest } from '@/app/tutor/components/whiteboard/DnaRenderer';
import { buildFoodWebManifest } from '@/app/tutor/components/whiteboard/FoodWebRenderer';
import { buildPedigreeManifest } from '@/app/tutor/components/whiteboard/PedigreeRenderer';
import { buildReactionCoordinateManifest } from '@/app/tutor/components/whiteboard/ReactionCoordinateRenderer';
import { buildLewisManifest } from '@/app/tutor/components/whiteboard/LewisRenderer';
import { solveLewis } from '@/lib/tutor/diagrams/lewis-solver';

/** Solve a constructed-Lewis spec and feed the resulting primitive
 *  payload through buildLewisManifest — same approach as the
 *  geometry-constructed manifest. Lets cross-turn snapshot show solved
 *  atom positions instead of an empty manifest. */
function buildLewisConstructedManifest(cmd: { title?: string; formula?: string; geometry?: string; atoms: unknown[]; bonds: unknown[]; layout?: string; centerAtomId?: string; skipValidation?: boolean }) {
  try {
    const solved = solveLewis({
      title: cmd.title,
      formula: cmd.formula,
      geometry: cmd.geometry,
      atoms: cmd.atoms as never,
      bonds: cmd.bonds as never,
      layout: cmd.layout as never,
      centerAtomId: cmd.centerAtomId,
      skipValidation: cmd.skipValidation,
    });
    return buildLewisManifest({
      title: solved.title,
      formula: solved.formula,
      geometry: solved.geometry,
      atoms: solved.atoms,
      bonds: solved.bonds,
    });
  } catch {
    return [];
  }
}
import { buildOrbitalDiagramManifest } from '@/app/tutor/components/whiteboard/OrbitalDiagramRenderer';
import { buildPeriodicTableManifest } from '@/app/tutor/components/whiteboard/PeriodicTableRenderer';
import { buildCycleDiagramManifest } from '@/app/tutor/components/whiteboard/CycleDiagramRenderer';
import { buildConceptMapManifest } from '@/app/tutor/components/whiteboard/ConceptMapRenderer';
import { buildFlowchartManifest } from '@/app/tutor/components/whiteboard/FlowchartRenderer';
import { buildTreeManifest } from '@/app/tutor/components/whiteboard/TreeRenderer';
import { buildVennDiagramManifest } from '@/app/tutor/components/whiteboard/VennDiagramRenderer';
import { buildTimelineManifest } from '@/app/tutor/components/whiteboard/TimelineRenderer';
import { buildMapManifest } from '@/app/tutor/components/whiteboard/MapRenderer';

/**
 * HTML-rendered renderers (KaTeX equations, problem cards, solution
 * steps, tables, code blocks, ...). The catalog flags these as
 * scribbleable; the live overlay + PDF capture both detect HTML mode
 * and resolve features via getBoundingClientRect on data-feature attrs
 * the renderer embeds in its DOM.
 *
 * Equation labels are ordered SPECIFIC → GENERIC so the catalog's
 * candidates hint shows distinguishing names (e.g. "Set equal for
 * intersection") rather than the generic "equation" — when several
 * equations are on the board, the tutor can pick the right one. Each
 * equation also carries:
 *   - the latex string itself (lets the tutor address by content,
 *     e.g. target: "x^3 + 3x^2 - 2x = 0")
 *   - a plain-text rendering of the latex
 *   - math-class hints ("cubic", "quadratic", "trig", "integral", ...)
 *     detected from the latex source
 */
function buildEquationManifest(cmd: { latex?: string; label?: string }): FeatureManifestEntry[] {
  const latex = (cmd.latex ?? '').trim();
  const label = (cmd.label ?? '').trim();
  const features: FeatureManifestEntry[] = [];

  const specific = label
    ? [label, `${label} equation`, `the ${label}`, `${label} formula`]
    : [];
  const generic = [
    'equation', 'the equation',
    'formula', 'the formula',
  ];
  const fromLatex = latex
    ? [latex, latexToPlainText(latex)].filter((s, i, a) => s && a.indexOf(s) === i)
    : [];
  const mathClass = latex ? detectMathClassLabels(latex) : [];

  features.push({
    name: 'equation',
    kind: 'equation',
    description: label
      ? `equation "${label}": ${latex}`
      : `equation: ${latex}`,
    // Specific first → labels[0] is what shows in the catalog candidates
    // hint when scribble misses, so the tutor sees the exact label.
    // Stems intentionally removed: the tutor now receives authoritative
    // target strings from every show_*'s tool_result and should use them
    // verbatim; paraphrase-matching was a crutch that caused false hits.
    labels: [...specific, ...mathClass, ...fromLatex, ...generic].filter(Boolean),
    scribbleable: true,
  });
  if (label) {
    features.push({
      name: 'equation-label',
      kind: 'label',
      description: `equation label "${label}"`,
      labels: [
        `${label} caption`, 'equation label', 'the label',
        'caption', 'the caption',
      ],
      scribbleable: true,
    });
  }
  return features;
}


/**
 * Pull labels referencing the quantity computed in this step from its
 * description / equation / result. The tutor often points at "the value
 * of KE" or "the velocity result" rather than "step 3 result"; matching
 * those phrases requires synthesizing aliases like "value of KE",
 * "KE result", "ke-result". Returns lowercase aliases — the resolver
 * normalizes to the same form.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractQuantityLabels(step: any): string[] {
  const tokens = new Set<string>();
  // Common physics / math quantity symbols. Order matters for greedy
  // longest-first capture in the abbreviation regex (handles "KE_max"
  // before "KE", "PE_grav" before "PE", etc.).
  const SYMBOLS = ['KE', 'PE', 'TE', 'U', 'F', 'a', 'v', 'p', 'q', 'x', 'y', 'z'];
  // Words the tutor might use in step descriptions to name the quantity.
  const WORDS = [
    'kinetic energy', 'potential energy', 'total energy',
    'velocity', 'speed', 'acceleration', 'force', 'momentum',
    'displacement', 'distance', 'mass', 'weight', 'pressure',
    'volume', 'density', 'temperature', 'work', 'power',
    'angle', 'area', 'perimeter', 'radius', 'diameter',
    'slope', 'intercept', 'derivative', 'integral',
  ];
  const text = `${step?.description ?? ''} ${step?.equation ?? ''} ${step?.result ?? ''}`;
  for (const sym of SYMBOLS) {
    const re = new RegExp(`\\b${sym}\\b`);
    if (re.test(text)) {
      tokens.add(sym.toLowerCase());
    }
  }
  for (const w of WORDS) {
    if (text.toLowerCase().includes(w)) {
      tokens.add(w);
    }
  }
  const out: string[] = [];
  for (const t of tokens) {
    out.push(`${t} result`, `value of ${t}`, `the value of ${t}`,
      `final ${t}`, `final value of ${t}`, `the final value of ${t}`,
      `${t}-result`, `${t} value`, `where ${t} is calculated`, `where ${t} was calculated`);
  }
  return out;
}

/**
 * show_solution: each step is an independently addressable feature so
 * the tutor can say target: "step 1" or "step 2: compute du". The step's
 * description + equation text becomes the primary label so the tool_result
 * hands the tutor exact strings to pass verbatim.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSolutionManifest(cmd: { steps?: any[] }): FeatureManifestEntry[] {
  const steps = Array.isArray(cmd.steps) ? cmd.steps : [];
  // Detect the "final answer" step (the last one with a numeric/equation
  // result). The tutor often refers to the closing computation as "the
  // final answer", "final value of X", "the result", etc., regardless of
  // which step number it landed on. We tag that step with extra labels
  // so those references resolve.
  const lastResultIdx = (() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      const s = steps[i];
      if (s?.result || s?.equation) return i;
    }
    return -1;
  })();
  const features: FeatureManifestEntry[] = [
    {
      name: 'solution',
      kind: 'region',
      description: 'the full solution',
      labels: ['solution', 'the solution', 'the whole solution'],
      scribbleable: true,
    },
    {
      name: 'solution-title',
      kind: 'label',
      description: 'the "Solution" header',
      labels: ['solution title', 'solution header', 'the Solution header'],
      scribbleable: true,
    },
  ];
  steps.forEach((step, i) => {
    const stepNum = step?.stepNumber ?? (i + 1);
    const description = String(step?.description ?? '').trim();
    const preview = description.length > 80 ? description.slice(0, 77) + '...' : description;
    const primaryLabel = preview ? `step ${stepNum}: ${preview}` : `step ${stepNum}`;
    features.push({
      name: `step-${stepNum}`,
      kind: 'region',
      description: preview || `step ${stepNum}`,
      labels: [
        primaryLabel,
        ...(preview ? [preview, `step ${stepNum} — ${preview}`] : []),
        `step-${stepNum}`,
        `step ${stepNum}`,
        `the ${stepNum}${ordinalSuffix(stepNum)} step`,
        `${stepNum}${ordinalSuffix(stepNum)} step`,
        ...(stepNum === 1 ? ['first step', 'the first step'] : []),
        ...(stepNum === 2 ? ['second step', 'the second step'] : []),
        ...(stepNum === 3 ? ['third step', 'the third step'] : []),
      ],
      scribbleable: true,
    });
    if (step?.description) {
      features.push({
        name: `step-${stepNum}-description`,
        kind: 'label',
        description: `description of step ${stepNum}`,
        labels: [
          `description of step ${stepNum}`, `step ${stepNum} description`,
          `step ${stepNum} prose`, `step ${stepNum} text`,
        ],
        scribbleable: true,
      });
    }
    if (step?.equation) {
      features.push({
        name: `step-${stepNum}-equation`,
        kind: 'equation',
        description: `equation in step ${stepNum}: ${step.equation}`,
        labels: [
          `equation in step ${stepNum}`, `step ${stepNum} equation`,
          `the equation in step ${stepNum}`,
          String(step.equation),
        ],
        scribbleable: true,
      });
    }
    if (step?.substitution) {
      features.push({
        name: `step-${stepNum}-substitution`,
        kind: 'equation',
        description: `substitution in step ${stepNum}: ${step.substitution}`,
        labels: [
          `substitution in step ${stepNum}`, `step ${stepNum} substitution`,
          `the substitution in step ${stepNum}`,
          String(step.substitution),
        ],
        scribbleable: true,
      });
    }
    if (step?.result) {
      const isFinal = i === lastResultIdx;
      const quantityLabels = isFinal ? extractQuantityLabels(step) : [];
      features.push({
        name: `step-${stepNum}-result`,
        kind: 'equation',
        description: `result in step ${stepNum}: ${step.result}`,
        labels: [
          `result of step ${stepNum}`, `step ${stepNum} result`,
          `the result in step ${stepNum}`,
          String(step.result),
          // Tutor-vocabulary aliases for the closing computation. Only
          // the last result-bearing step gets these — they collapse the
          // tutor's natural references ("the final value", "the answer
          // for KE") onto a deterministic feature.
          ...(isFinal ? [
            'final answer', 'the final answer', 'final result', 'the final result',
            'final value', 'the final value', 'the answer', 'the result',
            'final-answer', 'final-result', 'answer',
          ] : []),
          ...quantityLabels,
        ],
        scribbleable: true,
      });
    }
    if (step?.explanation) {
      features.push({
        name: `step-${stepNum}-explanation`,
        kind: 'label',
        description: `explanation of step ${stepNum}`,
        labels: [
          `explanation of step ${stepNum}`, `step ${stepNum} explanation`,
        ],
        scribbleable: true,
      });
    }
  });
  return features;
}

function ordinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  const mod10 = n % 10;
  if (mod10 === 1) return 'st';
  if (mod10 === 2) return 'nd';
  if (mod10 === 3) return 'rd';
  return 'th';
}

/**
 * show_problem: statement, title, source, difficulty, and each answer
 * choice become independent catalog features.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProblemManifest(cmd: { problem?: any }): FeatureManifestEntry[] {
  const problem = cmd.problem ?? {};
  const features: FeatureManifestEntry[] = [
    {
      name: 'problem',
      kind: 'region',
      description: 'the whole problem card',
      labels: ['problem', 'the problem', 'the problem card', 'the question', 'the prompt'],
      scribbleable: true,
    },
    {
      name: 'statement',
      kind: 'label',
      description: 'the problem statement text',
      labels: ['statement', 'the statement', 'the problem statement', 'the prompt', 'the question text'],
      scribbleable: true,
    },
    {
      name: 'title',
      kind: 'label',
      description: `problem title: ${problem.title || 'Problem'}`,
      labels: ['title', 'the title', 'problem title', 'the problem title'],
      scribbleable: true,
    },
  ];
  if (problem.sourceTag) {
    features.push({
      name: 'source',
      kind: 'label',
      description: `source tag: ${problem.sourceTag}`,
      labels: ['source', 'the source', 'source tag', problem.sourceTag],
      scribbleable: true,
    });
  }
  if (problem.difficultyLabel) {
    features.push({
      name: 'difficulty',
      kind: 'label',
      description: `difficulty: ${problem.difficultyLabel}`,
      labels: ['difficulty', 'the difficulty', problem.difficultyLabel, `${problem.difficultyLabel} badge`],
      scribbleable: true,
    });
  }
  const givenValues = Array.isArray(problem.givenValues) ? problem.givenValues : [];
  if (givenValues.length > 0) {
    features.push({
      name: 'given',
      kind: 'region',
      description: 'the givens list',
      labels: ['given', 'the given', 'the givens', 'the given values', 'givens'],
      scribbleable: true,
    });
    givenValues.forEach((gv: { symbol?: string; value?: string | number; unit?: string }, i: number) => {
      const sym = gv?.symbol ?? '?';
      features.push({
        name: `given-${i + 1}`,
        kind: 'label',
        description: `given ${i + 1}: ${sym} = ${gv?.value ?? '?'} ${gv?.unit ?? ''}`.trim(),
        labels: [`given ${i + 1}`, `given-${i + 1}`, sym, `the given ${sym}`],
        scribbleable: true,
      });
    });
  }
  const answerChoices = Array.isArray(problem.answerChoices) ? problem.answerChoices : [];
  if (answerChoices.length > 0) {
    features.push({
      name: 'choices',
      kind: 'region',
      description: 'the answer choices list',
      labels: ['choices', 'the choices', 'answer choices', 'the options'],
      scribbleable: true,
    });
    answerChoices.forEach((ac: { letter?: string; text?: string }, i: number) => {
      const letter = (ac?.letter || String.fromCharCode(65 + i)).toLowerCase();
      const text = String(ac?.text ?? '').trim();
      const preview = text.length > 60 ? text.slice(0, 57) + '...' : text;
      features.push({
        name: `choice-${letter}`,
        kind: 'label',
        description: `choice ${letter.toUpperCase()}: ${preview}`,
        labels: [
          `choice ${letter.toUpperCase()}`, `choice-${letter}`, `option ${letter.toUpperCase()}`,
          `answer ${letter.toUpperCase()}`, letter.toUpperCase(),
          ...(preview ? [preview] : []),
        ],
        scribbleable: true,
      });
    });
  }
  return features;
}

/**
 * show_table: every cell, row, column header, and the full table become
 * independent catalog features. Cell content (when short) is also a label
 * so the tutor can point at a cell by its value.
 */
function buildTableManifest(cmd: { headers?: string[]; rows?: string[][] }): FeatureManifestEntry[] {
  const headers = Array.isArray(cmd.headers) ? cmd.headers : [];
  const rows = Array.isArray(cmd.rows) ? cmd.rows : [];
  const features: FeatureManifestEntry[] = [
    {
      name: 'table',
      kind: 'region',
      description: `table with ${headers.length} columns and ${rows.length} rows`,
      labels: ['table', 'the table', 'the data table'],
      scribbleable: true,
    },
    {
      name: 'header-row',
      kind: 'region',
      description: 'the header row',
      labels: ['header row', 'the header row', 'headers', 'the headers'],
      scribbleable: true,
    },
  ];
  headers.forEach((h, j) => {
    const text = String(h ?? '').trim();
    features.push({
      name: `header-col-${j + 1}`,
      kind: 'label',
      description: `column ${j + 1} header: ${text}`,
      labels: [
        `column ${j + 1} header`, `header ${j + 1}`, `col ${j + 1} header`,
        `header-col-${j + 1}`, ...(text ? [text, `"${text}" header`, `${text} column`] : []),
      ],
      scribbleable: true,
    });
    features.push({
      name: `col-${j + 1}`,
      kind: 'region',
      description: `column ${j + 1}${text ? ` (${text})` : ''}`,
      labels: [
        `column ${j + 1}`, `col ${j + 1}`, `col-${j + 1}`,
        ...(text ? [`${text} column`, `the ${text} column`] : []),
      ],
      scribbleable: true,
    });
  });
  rows.forEach((row, i) => {
    features.push({
      name: `row-${i + 1}`,
      kind: 'region',
      description: `row ${i + 1}`,
      labels: [
        `row ${i + 1}`, `row-${i + 1}`, `the ${i + 1}${ordinalSuffix(i + 1)} row`,
        ...(i === 0 ? ['first row', 'the first row'] : []),
      ],
      scribbleable: true,
    });
    row.forEach((cell, j) => {
      const text = String(cell ?? '').trim();
      const preview = text.length > 40 ? text.slice(0, 37) + '...' : text;
      features.push({
        name: `cell-r${i + 1}-c${j + 1}`,
        kind: 'label',
        description: `cell at row ${i + 1} column ${j + 1}: ${preview}`,
        labels: [
          `cell ${i + 1} ${j + 1}`, `cell-r${i + 1}-c${j + 1}`,
          `row ${i + 1} column ${j + 1}`, `row ${i + 1} col ${j + 1}`,
          // Natural-language phrasings the brain reaches for after
          // reading the boardSnapshot (which surfaces the description
          // text "cell at row N column M: …"). Without these the brain
          // echoes back the description and the matcher misses (observed
          // 2026-05-06 G5 classification session: target="cell at row 1
          // column 1" silently dropped).
          `cell at row ${i + 1} column ${j + 1}`,
          `cell at row ${i + 1} col ${j + 1}`,
          `the cell at row ${i + 1} column ${j + 1}`,
          `the cell at row ${i + 1} col ${j + 1}`,
          ...(preview ? [preview, `the ${preview}`] : []),
        ],
        scribbleable: true,
      });
    });
  });
  return features;
}

function latexToPlainText(latex: string): string {
  return latex
    .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\(?:cdot|times)\b/g, '*')
    .replace(/\\(?:left|right)\b/g, '')
    .replace(/\\text\s*\{([^{}]+)\}/g, '$1')
    .replace(/\\[a-zA-Z]+\b/g, '')
    .replace(/[{}]/g, '')
    .replace(/\^\s*([a-zA-Z0-9])/g, '^$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectMathClassLabels(latex: string): string[] {
  const out: string[] = [];
  if (/x\s*\^\s*\{?\s*3\b/.test(latex) || /x\s*\*\s*x\s*\*\s*x/.test(latex)) {
    out.push('cubic', 'the cubic', 'cubic equation', 'the cubic equation', 'cubic polynomial', 'the cubic polynomial');
  } else if (/x\s*\^\s*\{?\s*2\b/.test(latex) || /\\sqrt|quadratic/i.test(latex)) {
    out.push('quadratic', 'the quadratic', 'quadratic equation', 'the quadratic equation');
  }
  if (/(\\sin|\\cos|\\tan|\\theta|\\phi)\b/.test(latex)) {
    out.push('trig', 'trigonometric', 'trig equation', 'trigonometric equation');
  }
  if (/\\int\b/.test(latex)) {
    out.push('integral', 'the integral', 'integration');
  }
  if (/\\sum\b/.test(latex)) {
    out.push('sum', 'the sum', 'summation');
  }
  if (/\\sqrt\b/.test(latex)) {
    out.push('square root', 'sqrt', 'radical', 'the radical');
  }
  if (/\\frac\b/.test(latex)) {
    out.push('fraction', 'the fraction');
  }
  return out;
}

/**
 * Iframe-backed renderers (Desmos graph, Ketcher molecule). The catalog
 * cannot reach inside a third-party iframe to draw an overlay, so each
 * registers a single whole-item feature with scribbleable: false. The
 * tutor can still scroll to them via tutor_scroll_whiteboard, and the
 * scribble handler redirects on attempt with a helpful message.
 */
function buildGraphManifest(): FeatureManifestEntry[] {
  return [{
    name: 'graph',
    kind: 'object',
    description: 'the function graph (Desmos iframe)',
    labels: [
      'graph', 'the graph', 'the function graph', 'function graph',
      'desmos', 'the desmos graph', 'plot', 'the plot', 'the chart',
    ],
    scribbleable: false,
  }];
}

function buildMoleculeManifest(): FeatureManifestEntry[] {
  return [{
    name: 'molecule',
    kind: 'object',
    description: 'the molecular structure (Ketcher iframe)',
    labels: [
      'molecule', 'the molecule', 'the structure', 'molecular structure',
      'the chemical structure', 'compound', 'the compound', 'ketcher',
    ],
    scribbleable: false,
  }];
}

export function buildManifestForCommand(cmd: WhiteboardCommand): FeatureManifestEntry[] | null {
  const action = String((cmd as { action?: string }).action ?? '');
  try {
    return dispatch(cmd, action);
  } catch (err) {
    // A builder threw on a malformed or incomplete payload (e.g., the tutor
    // emitted showWave without a `wave` object, or a field the builder
    // expected is undefined). Manifests are best-effort metadata — a crash
    // here must NOT take down the whole command pipeline (which would leave
    // the student with an empty whiteboard). Log and fall back to null; the
    // prompt's catalog handles the tutor's next feature-name lookup.
    console.warn(`[manifests] Builder for action="${action}" threw; falling back to null:`, err);
    return null;
  }
}

function dispatch(cmd: WhiteboardCommand, action: string): FeatureManifestEntry[] | null {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  switch (action) {
    // Pilots
    case 'showScatterPlot':       return buildScatterPlotManifest(cmd as any);
    case 'showSpringMass':        return buildSpringMassManifest(cmd as any);
    // Physics
    case 'showRayDiagram':        return buildRayDiagramManifest(cmd as any);
    case 'showWave':              return buildWaveManifest(cmd as any);
    case 'showPendulum':          return buildPendulumManifest(cmd as any);
    case 'showProjectileMotion':  return buildProjectileMotionManifest(cmd as any);
    case 'showMotionDiagram':     return buildMotionDiagramManifest(cmd as any);
    case 'showFreeBodyDiagram':   return buildFreeBodyDiagramManifest(cmd as any);
    case 'showEnergyBars':        return buildEnergyBarsManifest(cmd as any);
    case 'showCollision':         return buildCollisionManifest(cmd as any);
    case 'showSimpleMachine':     return buildSimpleMachineManifest(cmd as any);
    case 'showCircuit':           return buildCircuitManifest(cmd as any);
    // Math / Stats / Data
    case 'showCoordinatePlane':   return buildCoordinatePlaneManifest(cmd as any);
    case 'showStats':             return buildStatsManifest(cmd as any);
    case 'showManipulative':      return buildManipulativeManifest(cmd as any);
    case 'showNumberLine':        return buildNumberLineManifest(cmd as any);
    case 'showFractionBar':       return buildFractionBarManifest(cmd as any);
    case 'showGeometry':          return buildGeometryManifest(cmd as any);
    case 'showGeometryConstructed': return buildGeometryConstructedManifest(cmd as any);
    case 'showUnitCircle':        return buildUnitCircleManifest(cmd as any);
    case 'showVector':            return buildVectorManifest(cmd as any);
    // Biology / Chemistry
    case 'showCellDiagram':       return buildCellDiagramManifest(cmd as any);
    case 'showDna':               return buildDnaManifest(cmd as any);
    case 'showFoodWeb':           return buildFoodWebManifest(cmd as any);
    case 'showPedigree':          return buildPedigreeManifest(cmd as any);
    case 'showReactionCoordinate':return buildReactionCoordinateManifest(cmd as any);
    case 'showLewis':             return buildLewisManifest(cmd as any);
    case 'showLewisConstructed': return buildLewisConstructedManifest(cmd as any);
    case 'showOrbitalDiagram':    return buildOrbitalDiagramManifest(cmd as any);
    case 'showPeriodicTable':     return buildPeriodicTableManifest(cmd as any);
    // Diagrams / Timelines / Maps
    case 'showCycleDiagram':      return buildCycleDiagramManifest(cmd as any);
    case 'showConceptMap':        return buildConceptMapManifest(cmd as any);
    case 'showFlowchart':         return buildFlowchartManifest(cmd as any);
    case 'showTree':              return buildTreeManifest(cmd as any);
    case 'showVennDiagram':       return buildVennDiagramManifest(cmd as any);
    case 'showTimeline':          return buildTimelineManifest(cmd as any);
    case 'showMap':               return buildMapManifest(cmd as any);
    // Iframe-backed (whole-item, non-scribbleable)
    case 'showGraph':             return buildGraphManifest();
    case 'showMolecule':          return buildMoleculeManifest();
    // HTML-backed (whole-item via data-feature on wrapper div)
    case 'showEquation':          return buildEquationManifest(cmd as any);
    case 'showSolution':          return buildSolutionManifest(cmd as any);
    case 'showProblem':           return buildProblemManifest(cmd as any);
    case 'showTable':             return buildTableManifest(cmd as any);
    // Catalog-dispatched diagrams (show_diagram with type=loanable_funds,
    // money_market, t_chart, etc.) need at least a minimal manifest so
    // the WhiteboardCatalog registers them and signature-based dedup
    // works across turns. Without this case, every show_diagram emission
    // is missing from the catalog → findBySignature returns null → the
    // brain re-emits identical diagrams every turn. Observed 2026-05-11
    // AP Macro session: 4 identical show_diagram(loanable_funds) calls
    // back-to-back, none dedup'd.
    case 'showDiagram':           return buildDiagramManifest(cmd as any);
    case 'showSketch':            return buildSketchManifest(cmd as any);
    case 'handwrite':             return buildHandwriteManifest(cmd as any);
    default:                      return null;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** Manifest for `show_sketch` doodles. Registers the WHOLE doodle as one
 *  addressable feature so it catalogs (dedup / evolve-in-place) and the brain
 *  can scribble it by title ("circle the sketch"). Internal-label features are
 *  deferred — at manifest-build time the doodler's primitives don't exist yet
 *  (they resolve async). See project_tutor_sketch_capability. */
function buildSketchManifest(cmd: { concept?: string; title?: string }): FeatureManifestEntry[] {
  const title = String(cmd.title ?? '').trim();
  const concept = String(cmd.concept ?? '').trim();
  const desc = title || (concept.length > 60 ? `${concept.slice(0, 57)}...` : concept) || 'sketch';
  return [{
    name: 'sketch',
    kind: 'shape',
    description: `sketch: ${desc}`,
    labels: ['sketch', 'doodle', 'drawing', 'the sketch', 'the drawing', ...(title ? [title] : [])],
    scribbleable: true,
  }];
}

/** Manifest for `tutor_handwrite` commands. Post-redesign each handwrite
 *  is just a strip entry, but it still registers as a single addressable
 *  feature so the brain can see it in subsequent boardSnapshots and (if
 *  it wants to) scribble against it. Content-aware aliases let brain
 *  target strings like `the note "key idea"` or `"key idea"` resolve.
 */
function buildHandwriteManifest(cmd: { text?: string }): FeatureManifestEntry[] {
  const text = String(cmd.text ?? '').trim();
  const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
  return [
    {
      name: 'handwrite',
      kind: 'label',
      description: preview ? `strip note "${preview}"` : 'strip note',
      labels: [
        'handwrite', 'the handwrite', 'the note', 'handwriting',
        ...(preview ? [
          preview, `the ${preview}`, `"${preview}"`,
          `the note "${preview}"`, `the handwrite "${preview}"`,
          `the "${preview}" note`,
        ] : []),
      ],
      scribbleable: true,
    },
  ];
}

/** Manifest dispatcher for catalog-dispatched `show_diagram` commands.
 *
 *  Phase 1 (whiteboard markup initiative, 2026-05-13 audit) routes
 *  organizer-shaped kinds through per-kind rich manifest builders so the
 *  brain can address rows / cols / cells / stages by name and
 *  tutor_scribble lands. Add cases as Phase 2 ships more kinds.
 *
 *  Unmigrated kinds fall through to the impoverished catch-all: one
 *  synthetic whole-item `region` feature (non-scribbleable, filtered out
 *  of the snapshot per-feature listing) — enough to register the item in
 *  WhiteboardCatalog so signature-based cross-turn dedup still works,
 *  but the brain has no per-feature targets. */
function buildDiagramManifest(cmd: {
  type?: string;
  params?: Record<string, unknown> & { title?: string };
}): FeatureManifestEntry[] {
  const type = cmd.type || 'diagram';
  const params = cmd.params ?? {};

  switch (type) {
    case 'comparison_table': {
      // Solve first so the manifest sees the normalized figure shape
      // (items/attributes/cells). On a malformed payload, fall through
      // to the catch-all so we still register the item for dedup —
      // the renderer's own error surface handles user feedback.
      try {
        const figure = solveComparisonTable(params);
        return buildComparisonTableManifest(figure);
      } catch {
        // fall through to catch-all
      }
      break;
    }
    // Phase 2a — organizer kinds. Each solves → builds the rich
    // manifest. On solver failure fall through to the catch-all
    // single-region feature so the catalog still registers the item.
    case 't_chart': {
      try {
        const figure = solveOrganizer('t_chart', params);
        return buildTChartManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'kwl_chart': {
      try {
        const figure = solveOrganizer('kwl_chart', params);
        return buildKwlChartManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'frayer_model': {
      try {
        const figure = solveOrganizer('frayer_model', params);
        return buildFrayerModelManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'argument_structure': {
      try {
        const figure = solveArgumentStructure(params);
        return buildArgumentStructureManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'government_branches': {
      try {
        const figure = solveGovernmentBranches(params);
        return buildGovernmentBranchesManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 2b — SVG-coordinate organizers + body_system (HTML grid).
    case 'sentence_diagram': {
      try {
        const figure = solveSentenceDiagram(params);
        return buildSentenceDiagramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'historical_timeline': {
      try {
        const figure = solveHistoricalTimeline(params);
        return buildHistoricalTimelineManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'hierarchy_pyramid': {
      try {
        const figure = solveHierarchyPyramid(params);
        return buildHierarchyPyramidManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'body_system': {
      try {
        const figure = solveBodySystem(params);
        return buildBodySystemManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'life_cycle':
    case 'water_cycle':
    case 'rock_cycle': {
      try {
        const figure = solveCycleStages(params);
        return buildCycleStagesManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 3 — chem/bio remaining kinds.
    case 'electron_configuration': {
      try {
        const figure = solveElectronConfiguration(params);
        return buildElectronConfigurationManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'orbital_diagram': {
      try {
        const figure = solveOrbitalDiagram(params);
        return buildCatalogOrbitalDiagramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'periodic_table_highlight': {
      try {
        const figure = solvePeriodicTableHighlight(params);
        return buildPeriodicTableHighlightManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'punnett_square': {
      try {
        const figure = solvePunnettSquare(params);
        return buildPunnettSquareManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 4 — earth & space.
    case 'phases_of_moon': {
      try {
        const figure = solvePhasesOfMoon(params);
        return buildPhasesOfMoonManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'solar_system': {
      try {
        const figure = solveSolarSystem(params);
        return buildSolarSystemManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'earth_layers': {
      try {
        const figure = solveEarthLayers(params);
        return buildEarthLayersManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'eclipse_diagram': {
      try {
        const figure = solveEclipseDiagram(params);
        return buildEclipseDiagramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'seasons_diagram': {
      try {
        const figure = solveSeasonsDiagram(params);
        return buildSeasonsDiagramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'plate_tectonics': {
      try {
        const figure = solvePlateTectonics(params);
        return buildPlateTectonicsManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 5 — CS.
    case 'flowchart_simple': {
      try {
        const figure = solveFlowchartSimple(params);
        return buildCatalogFlowchartSimpleManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'state_machine': {
      try {
        const figure = solveStateMachine(params);
        return buildStateMachineManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'binary_tree': {
      try {
        const figure = solveBinaryTree(params);
        return buildBinaryTreeManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'truth_table': {
      try {
        const figure = solveTruthTable(params);
        return buildCatalogTruthTableManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'logic_gate': {
      try {
        const figure = solveLogicGate(params);
        return buildLogicGateManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 6 — advanced math.
    case 'unit_circle': {
      try {
        const figure = solveUnitCircle(params);
        return buildCatalogUnitCircleManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'transformation': {
      try {
        const figure = solveTransformation(params);
        return buildTransformationManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'inequality_graph': {
      try {
        const figure = solveInequalityGraph(params);
        return buildInequalityGraphManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 9 — economics.
    case 'production_possibilities': {
      try {
        const figure = solveProductionPossibilities(params);
        return buildProductionPossibilitiesManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'business_cycle': {
      try {
        const figure = solveBusinessCycle(params);
        return buildBusinessCycleManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'aggregate_demand_supply': {
      try {
        const figure = solveAggregateDemandSupply(params);
        return buildAggregateDemandSupplyManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'money_market': {
      try {
        const figure = solveMoneyMarket(params);
        return buildMoneyMarketManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'loanable_funds': {
      try {
        const figure = solveLoanableFunds(params);
        return buildLoanableFundsManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'phillips_curve': {
      try {
        const figure = solvePhillipsCurve(params);
        return buildPhillipsCurveManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'foreign_exchange_market': {
      try {
        const figure = solveForeignExchangeMarket(params);
        return buildForeignExchangeMarketManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 10 — calculus.
    case 'riemann_sum': {
      try {
        const figure = solveRiemannSum(params);
        return buildRiemannSumManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'slope_field': {
      try {
        const figure = solveSlopeField(params);
        return buildSlopeFieldManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'parametric_curve': {
      try {
        const figure = solveParametricCurve(params);
        return buildParametricCurveManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'polar_graph': {
      try {
        const figure = solvePolarGraph(params);
        return buildPolarGraphManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'taylor_polynomial_overlay': {
      try {
        const figure = solveTaylorPolynomialOverlay(params);
        return buildTaylorPolynomialOverlayManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 11 — statistics.
    case 'histogram': {
      try {
        const figure = solveHistogram(params);
        return buildHistogramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'normal_curve': {
      try {
        const figure = solveNormalCurve(params);
        return buildNormalCurveManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'scatterplot_regression': {
      try {
        const figure = solveScatterRegression(params);
        return buildScatterRegressionManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 12 — environmental / demographic.
    case 'population_pyramid': {
      try {
        const figure = solvePopulationPyramid(params);
        return buildPopulationPyramidManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'climate_diagram': {
      try {
        const figure = solveClimateDiagram(params);
        return buildClimateDiagramManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    // Phase 13 — biogeochemical cycles + anatomy.
    case 'nutrient_cycle': {
      try {
        const figure = solveNutrientCycleForManifest(params);
        return buildNutrientCycleManifest(figure);
      } catch { /* fall through */ }
      break;
    }
    case 'neuron_diagram': {
      try {
        return buildNeuronManifest(solveNeuronForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'brain_regions': {
      try {
        return buildBrainRegionsManifest(solveBrainForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'conic_sections': {
      try {
        return buildConicSectionsManifest(solveConicSectionsForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'solid_of_revolution': {
      try {
        return buildSolidOfRevolutionManifest(solveSolidOfRevolutionForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'solid_3d': {
      try {
        return buildSolid3DManifest(solveSolid3DForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'vectors_3d': {
      try {
        return buildVectors3DManifest(solveVectors3DForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'vsepr_geometry': {
      try {
        return buildVseprManifest(solveVseprForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'field_lines': {
      try {
        return buildFieldLinesManifest(solveFieldLinesForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'phase_diagram': {
      try {
        return buildPhaseDiagramManifest(solvePhaseDiagramForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'heart_diagram': {
      try {
        return buildHeartManifest(solveHeartForManifest(params));
      } catch { /* fall through */ }
      break;
    }
    case 'photosynthesis': {
      try { return buildCellEnergyManifest(solvePhotoForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'cellular_respiration': {
      try { return buildCellEnergyManifest(solveRespForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'doppler_effect': {
      try { return buildDopplerManifest(solveDopplerForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'standing_wave': {
      try { return buildStandingWaveManifest(solveStandingWaveForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'interference_pattern': {
      try { return buildInterferenceManifest(solveInterferenceForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'mitosis': {
      try { return buildMitosisManifest(solveMitosisForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'meiosis': {
      try { return buildMeiosisManifest(solveMeiosisForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'dna_replication': {
      try { return buildDnaReplicationManifest(solveDnaReplicationForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'cell_membrane': {
      try { return buildCellMembraneManifest(solveCellMembraneForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'bohr_model': {
      try { return buildBohrManifest(solveBohrForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'galvanic_cell': {
      try { return buildGalvanicManifest(solveGalvanicForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'titration_curve': {
      try { return buildTitrationManifest(solveTitrationForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'crystal_lattice': {
      try { return buildLatticeManifest(solveLatticeForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'nuclear_decay': {
      try { return buildNuclearDecayManifest(solveNuclearDecayForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'em_induction': {
      try { return buildEMInductionManifest(solveEMInductionForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'magnetic_field_current': {
      try { return buildMagneticFieldManifest(solveMagneticFieldForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'projectile_motion': {
      try { return buildProjectileManifest(solveProjectileForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'leaf_cross_section': {
      try { return buildLeafCrossSectionManifest(solveLeafForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'nephron': {
      try { return buildNephronManifest(solveNephronForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'digestive_system': {
      try { return buildDigestiveSystemManifest(solveDigestiveForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'circulatory_system': {
      try { return buildCirculatorySystemManifest(solveCirculatoryForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'data_structure': {
      try { return buildDataStructureManifest(solveDataStructureForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'graph_diagram': {
      try { return buildGraphDiagramManifest(solveGraphForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'hash_table': {
      try { return buildHashTableManifest(solveHashTableForManifest(params)); } catch { /* fall through */ }
      break;
    }
    case 'recursion_tree': {
      try { return buildRecursionTreeManifest(solveRecursionTreeForManifest(params)); } catch { /* fall through */ }
      break;
    }
    default:
      break;
  }

  const title = typeof params.title === 'string' ? params.title : undefined;
  return [
    {
      name: `diagram-${type}`,
      kind: 'region',
      description: title ?? `${type} diagram`,
      scribbleable: false,
    },
  ];
}
