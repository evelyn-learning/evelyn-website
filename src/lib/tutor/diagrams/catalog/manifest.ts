/**
 * Diagram catalog — manifest + solver dispatch.
 *
 * Single source of truth for every kind in the catalog. The brain reads
 * the manifest to know what's available; the solver dispatch routes the
 * brain's spec to the right per-kind solver.
 */

import type { DiagramKindId, DiagramKindMeta, NormalizedFigure, SolverFn } from './types';

import { solveNumberLine } from './kinds/number-line';
import { solveEquationBalance } from './kinds/equation-balance';
import { solveTapeDiagram } from './kinds/tape-diagram';
import { solveFractionComparison } from './kinds/fraction-comparison';
import { solveAreaModel } from './kinds/area-model';
import { solvePieChart } from './kinds/pie-chart';
import { solveBarChart } from './kinds/bar-chart';
import { solveLinePlot } from './kinds/line-plot';

import {
  solveBalanceScale, solveLever, solvePulleySystem, solveInclinedPlane,
  solveSpringMass, solvePendulum, solveSimpleCircuit, solveWaveDiagram,
  solveRayDiagram, solveVectorAddition,
} from './kinds/physics';

import {
  solveElectronConfiguration, solveOrbitalDiagram, solvePeriodicTableHighlight,
  solvePunnettSquare, solveCycleStages, solveBodySystem,
} from './kinds/chem-bio';

import {
  solvePhasesOfMoon, solveSolarSystem, solveEarthLayers,
  solveEclipseDiagram, solveSeasonsDiagram, solvePlateTectonics,
  solveGeologicCrossSection, solveHRDiagram, solveVolcanoCrossSection, solveAtmosphereLayers,
} from './kinds/earth-space';

import {
  solveFlowchartSimple, solveStateMachine, solveBinaryTree,
  solveTruthTable, solveLogicGate,
} from './kinds/cs';

import {
  solveUnitCircle, solveTransformation, solveInequalityGraph,
  solveSentenceDiagram, solveArgumentStructure, solveHistoricalTimeline,
  solveGovernmentBranches, solveComparisonTable, solveOrganizer,
  solveHierarchyPyramid, solveComplexPlane, solvePlotDiagram,
} from './kinds/advanced-math-ela-social';

import {
  solveProductionPossibilities,
  solveBusinessCycle,
  solveAggregateDemandSupply,
  solveMoneyMarket,
  solveLoanableFunds,
  solvePhillipsCurve,
  solveForeignExchangeMarket,
  solveSupplyDemand,
  solveCircularFlow,
} from './kinds/economics';

import {
  solveRiemannSum,
  solveSlopeField,
  solveParametricCurve,
  solvePolarGraph,
  solveTaylorPolynomialOverlay,
} from './kinds/math-calculus';

import {
  solveHistogram,
  solveNormalCurve,
  solveScatterRegression,
} from './kinds/math-statistics';

import {
  solvePopulationPyramid,
  solveClimateDiagram,
} from './kinds/environmental';

import { solveNutrientCycle } from './kinds/nutrient-cycle';
import { solveNeuronDiagram, solveBrainRegions } from './kinds/anatomy';
import { solveConicSections } from './kinds/conic-sections';
import { solveSolidOfRevolution } from './kinds/solid-of-revolution';
import { solveSolid3D } from './kinds/solid-3d';
import { solveVectors3D } from './kinds/vectors-3d';
import { solveVseprGeometry } from './kinds/vsepr';
import { solveFieldLines } from './kinds/field-lines';
import { solvePhaseDiagram } from './kinds/phase-diagram';
import { solveHeartDiagram } from './kinds/heart';
import { solvePhotosynthesis, solveCellularRespiration } from './kinds/cell-energy';
import { solveDopplerEffect, solveStandingWave, solveInterferencePattern } from './kinds/waves';
import { solveMitosis, solveMeiosis, solveDnaReplication, solveCellMembrane } from './kinds/cell-biology';
import { solveBohrModel, solveGalvanicCell, solveTitrationCurve, solveCrystalLattice } from './kinds/chemistry';
import { solveNuclearDecay, solveEMInduction, solveMagneticFieldCurrent, solveProjectileMotion } from './kinds/em-nuclear-motion';
import { solveLeafCrossSection, solveNephron, solveDigestiveSystem, solveCirculatorySystem, solveRespiratorySystem, solveFlowerStructure, solveEnergyPyramid } from './kinds/bio-anatomy';
import { solveDataStructure, solveGraphDiagram, solveHashTable, solveRecursionTree } from './kinds/cs-structures';
import { solveProteinSynthesis, solveEnzymeAction, solveCellCycle, solveGeneExpression } from './kinds/molecular-biology';
import { solveClockFace, solveTenFrame, solveBaseTenBlocks } from './kinds/elementary-math';

/** Per-kind metadata. Add a new kind by appending here AND adding a
 *  solver entry below. The brain sees this list (filtered by session
 *  subject + grade band) so it knows what's available. */
export const DIAGRAM_CATALOG: DiagramKindMeta[] = [
  // ── Phase 1 — math K-8 ──────────────────────────────────────────────────
  { kind: 'number_line', displayName: 'Number Line', whenToUse: 'Show numeric position, intervals, motion along a line, or inequality solutions.', subjects: ['math'], grades: { from: 'k', to: 12 }, paramSchema: 'min:number, max:number, step?:number, points?:[{value,label?,color?,style?:filled|open}], intervals?:[{from,to,fromInclusive?,toInclusive?,color?,label?}], segments?:[{from,to,label?,color?,arc?}], fractionTicks?:{denominator,showLabels?}, title?' },
  { kind: 'equation_balance', displayName: 'Balance Scale', whenToUse: 'Show equality as a balanced scale — solver enforces actual balance from item weights.', subjects: ['math', 'physics'], grades: { from: 3, to: 12 }, paramSchema: 'left:[{label,weight?,color?}], right:[{label,weight?,color?}], title?, caption?' },
  { kind: 'tape_diagram', displayName: 'Tape Diagram', whenToUse: 'Show parts-of-a-whole or comparison via proportional bars.', subjects: ['math'], grades: { from: 2, to: 8 }, paramSchema: 'bars:[{name?,segments:[{length,label?,color?,unknown?}],totalLabel?}], title?, sharedScale?:boolean' },
  { kind: 'fraction_comparison', displayName: 'Fraction Comparison', whenToUse: 'Compare multiple fractions side-by-side.', subjects: ['math'], grades: { from: 2, to: 7 }, paramSchema: 'fractions:[{numerator,denominator,label?,color?}], style?:bar|circle, title?' },
  { kind: 'area_model', displayName: 'Area Model', whenToUse: 'Show multiplication or distribution as a rectangle decomposed into sub-rectangles.', subjects: ['math'], grades: { from: 3, to: 9 }, paramSchema: 'rows:[number], cols:[number], cellLabels?:[[string]], showProducts?:boolean, title?' },
  { kind: 'pie_chart', displayName: 'Pie Chart', whenToUse: 'Show parts of a whole as proportional slices.', subjects: ['math'], grades: { from: 4, to: 12 }, paramSchema: 'slices:[{label,value,color?}], title?' },
  { kind: 'bar_chart', displayName: 'Bar Chart', whenToUse: 'Show categorical values as bars.', subjects: ['math'], grades: { from: 2, to: 12 }, paramSchema: 'categories:[string], values:[number], yLabel?, colors?:[string], title?' },
  { kind: 'line_plot', displayName: 'Line Plot', whenToUse: 'Show frequency of values as stacked dots above a number line.', subjects: ['math'], grades: { from: 3, to: 7 }, paramSchema: 'values:[number], xLabel?, title?' },

  // ── Phase 2 — physics ──────────────────────────────────────────────────
  { kind: 'balance_scale', displayName: 'Balance Scale (physics)', whenToUse: 'Show physical balance with items of differing weights; solver computes tilt direction.', subjects: ['physics'], grades: { from: 3, to: 9 }, paramSchema: 'left:[{label,weight?,color?}], right:[{label,weight?,color?}], title?, caption?' },
  { kind: 'lever', displayName: 'Lever', whenToUse: 'Show a class-1 lever with effort and load on either side of a fulcrum.', subjects: ['physics'], grades: { from: 6, to: 12 }, paramSchema: 'effort:number, load:number, effortDistance:number, loadDistance:number, title?' },
  { kind: 'pulley_system', displayName: 'Pulley System', whenToUse: 'Mode "block-tackle" (default): block-and-tackle with fixed/movable pulleys; solver computes mechanical advantage. Mode "atwood": two masses hanging on opposite ends of a rope over a single fixed pulley. Mode "table-pulley": one block on a horizontal table, second block hanging off the edge over a pulley. Mode "incline-pulley": one block on a ramp + rope over a pulley at the top + second block hanging on the far side.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'mode?:block-tackle|atwood|table-pulley|incline-pulley. block-tackle: fixedCount?:int, movableCount?:int, weightLabel?:string, weight?:number. atwood / table-pulley / incline-pulley: leftSide?:{label,weight?}, rightSide?:{label,weight?} (or loads:[{label|mass,weight?},…]). incline-pulley adds inclineAngle?:number (degrees, default 30). title?' },
  { kind: 'inclined_plane', displayName: 'Inclined Plane', whenToUse: 'Show a block on a ramp; solver places block on the slope at the specified angle.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'angle:number, mass?:number, showForces?:boolean, showFriction?:boolean, title?' },
  { kind: 'spring_mass', displayName: 'Spring-Mass System', whenToUse: 'Show a mass on a spring at displacement; orientation vertical or horizontal.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'displacement:number, orientation?:vertical|horizontal, mass?:number, k?:number, showEquilibrium?:boolean, title?' },
  { kind: 'pendulum', displayName: 'Pendulum', whenToUse: 'Show a pendulum at a given angle from vertical.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'length?:number, angleDegrees?:number, showVelocity?:boolean, title?' },
  { kind: 'simple_circuit', displayName: 'Simple Circuit', whenToUse: 'Show a single-loop circuit with battery, resistors, bulbs, switches.', subjects: ['physics'], grades: { from: 6, to: 12 }, paramSchema: 'components:[{type:battery|resistor|bulb|switch|wire|ammeter|voltmeter, label?, value?, closed?}], title?' },
  { kind: 'wave_diagram', displayName: 'Wave Diagram', whenToUse: 'Show a sinusoidal wave with labeled amplitude and wavelength.', subjects: ['physics'], grades: { from: 6, to: 12 }, paramSchema: 'amplitude:number, wavelength:number, cycles?:number, showAmplitude?:boolean, showWavelength?:boolean, title?' },
  { kind: 'ray_diagram_lens', displayName: 'Ray Diagram (Lens)', whenToUse: 'Show object/image through a converging or diverging lens.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'optical:convex_lens|concave_lens, focalLength:number, objectDistance:number, objectHeight:number, title?' },
  { kind: 'ray_diagram_mirror', displayName: 'Ray Diagram (Mirror)', whenToUse: 'Show object/image with a mirror.', subjects: ['physics'], grades: { from: 7, to: 12 }, paramSchema: 'optical:concave_mirror|convex_mirror|plane_mirror, focalLength:number, objectDistance:number, objectHeight:number, title?' },
  { kind: 'vector_addition', displayName: 'Vector Addition', whenToUse: 'Add 2+ vectors and show the resultant.', subjects: ['math', 'physics'], grades: { from: 8, to: 12 }, paramSchema: 'vectors:[{x,y,label?,color?}], method?:tip_to_tail|parallelogram, title?' },

  // ── Phase 3 — chemistry / biology ──────────────────────────────────────
  { kind: 'electron_configuration', displayName: 'Electron Configuration', whenToUse: 'Show the spectroscopic notation for an element.', subjects: ['chemistry'], grades: { from: 9, to: 12 }, paramSchema: 'element?:string, Z?:int, title?' },
  { kind: 'orbital_diagram', displayName: 'Orbital Diagram', whenToUse: 'Show shells/orbitals filled per Aufbau and Hund\'s rules.', subjects: ['chemistry'], grades: { from: 10, to: 12 }, paramSchema: 'element?:string, Z?:int, title?' },
  { kind: 'periodic_table_highlight', displayName: 'Periodic Table Highlight', whenToUse: 'Highlight specific elements on the periodic table.', subjects: ['chemistry'], grades: { from: 8, to: 12 }, paramSchema: 'highlights:[{element:symbol, color?, label?}], title?' },
  { kind: 'punnett_square', displayName: 'Punnett Square', whenToUse: 'Show a 2×2 monohybrid cross.', subjects: ['biology'], grades: { from: 8, to: 12 }, paramSchema: 'parentA:two-letter genotype, parentB:two-letter genotype, title?' },
  { kind: 'life_cycle', displayName: 'Life Cycle', whenToUse: 'Show a closed cycle of stages (organism, plant).', subjects: ['biology'], grades: { from: 'k', to: 8 }, paramSchema: 'stages:[{label,description?,color?}], title?' },
  { kind: 'water_cycle', displayName: 'Water Cycle', whenToUse: 'Show evaporation/condensation/precipitation/collection.', subjects: ['earth'], grades: { from: 3, to: 8 }, paramSchema: 'stages:[{label,description?,color?}], title?' },
  { kind: 'rock_cycle', displayName: 'Rock Cycle', whenToUse: 'Show transitions among igneous, sedimentary, metamorphic.', subjects: ['earth'], grades: { from: 4, to: 9 }, paramSchema: 'stages:[{label,description?,color?}], title?' },
  { kind: 'body_system', displayName: 'Body System', whenToUse: 'Show parts of a body system with descriptions.', subjects: ['biology'], grades: { from: 4, to: 10 }, paramSchema: 'system:string, parts:[{label,description?}], title?' },

  // ── Phase 4 — earth / space ────────────────────────────────────────────
  { kind: 'phases_of_moon', displayName: 'Phases of the Moon', whenToUse: 'Show one of the eight standard moon phases.', subjects: ['earth'], grades: { from: 3, to: 7 }, paramSchema: 'phase:new|waxing_crescent|first_quarter|waxing_gibbous|full|waning_gibbous|last_quarter|waning_crescent, title?' },
  { kind: 'solar_system', displayName: 'Solar System', whenToUse: 'Show planets in order from the Sun, optionally highlighting some.', subjects: ['earth'], grades: { from: 'k', to: 7 }, paramSchema: 'highlight?:[planet names], title?' },
  { kind: 'earth_layers', displayName: 'Earth Layers', whenToUse: 'Show concentric layers of the Earth.', subjects: ['earth'], grades: { from: 4, to: 9 }, paramSchema: 'layers?:[{name,description?,color?}], title?' },
  { kind: 'eclipse_diagram', displayName: 'Eclipse Diagram', whenToUse: 'Show solar or lunar eclipse alignment.', subjects: ['earth'], grades: { from: 5, to: 12 }, paramSchema: 'type:solar|lunar, title?' },
  { kind: 'seasons_diagram', displayName: 'Seasons Diagram', whenToUse: 'Show Earth at four points in its orbit with axial tilt.', subjects: ['earth'], grades: { from: 4, to: 7 }, paramSchema: 'hemisphere?:northern|southern, title?' },
  { kind: 'plate_tectonics', displayName: 'Plate Boundaries', whenToUse: 'Show divergent, convergent, or transform plate boundary.', subjects: ['earth'], grades: { from: 5, to: 9 }, paramSchema: 'boundary:divergent|convergent|transform, labels?:{left?,right?}, title?' },

  // ── Phase 5 — CS ───────────────────────────────────────────────────────
  { kind: 'flowchart_simple', displayName: 'Flowchart', whenToUse: 'Show a sequence of process / decision nodes connected by labeled edges.', subjects: ['cs'], grades: { from: 5, to: 12 }, paramSchema: 'nodes:[{id,type:start|end|process|decision|io,text}], edges:[{from,to,label?}], title?' },
  { kind: 'state_machine', displayName: 'State Machine', whenToUse: 'Show states and labeled transitions; supports start and accept states.', subjects: ['cs'], grades: { from: 8, to: 12 }, paramSchema: 'states:[{id,label?,isStart?,isAccept?}], transitions:[{from,to,label}], title?' },
  { kind: 'binary_tree', displayName: 'Binary Tree', whenToUse: 'Show a binary tree from a recursive node structure.', subjects: ['cs'], grades: { from: 7, to: 12 }, paramSchema: 'root:{value,left?,right?}, title?' },
  { kind: 'truth_table', displayName: 'Truth Table', whenToUse: 'Show inputs and outputs over all combinations.', subjects: ['cs'], grades: { from: 8, to: 12 }, paramSchema: 'inputs:[string], outputColumns?:[{label,values:[boolean]}], title?' },
  { kind: 'logic_gate', displayName: 'Logic Gate', whenToUse: 'Show a single logic gate with inputs and output labels.', subjects: ['cs'], grades: { from: 8, to: 12 }, paramSchema: 'gate:AND|OR|NOT|NAND|NOR|XOR|XNOR, inputs?:[string], output?:string, title?' },

  // ── Phase 6 — advanced math ────────────────────────────────────────────
  { kind: 'unit_circle', displayName: 'Unit Circle', whenToUse: 'Show an angle on the unit circle with sin/cos coordinates.', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'angleDegrees:number, showSinCos?:boolean, showRadians?:boolean, title?' },
  { kind: 'transformation', displayName: 'Transformation', whenToUse: 'Show a shape and its transformed image (translate/rotate/reflect/scale).', subjects: ['math'], grades: { from: 8, to: 12 }, paramSchema: 'shape:{type:triangle|rectangle|polygon, vertices:[{x,y}]}, transform:{type:translate|rotate|reflect|scale, tx?,ty?,angleDeg?,axis?,sx?,sy?}, title?' },
  { kind: 'inequality_graph', displayName: 'Inequality on Number Line', whenToUse: 'Show a 1-variable inequality with closed/open endpoint and ray.', subjects: ['math'], grades: { from: 6, to: 12 }, paramSchema: 'variable?:string, operator:<|>|<=|>=, value:number, title?' },

  // ── Phase 7 — ELA / social ─────────────────────────────────────────────
  { kind: 'sentence_diagram', displayName: 'Sentence Diagram', whenToUse: 'Show grammatical structure of a sentence.', subjects: ['ela'], grades: { from: 4, to: 8 }, paramSchema: 'subject:string, verb:string, object?:string, modifiers?:[{attachTo:subject|verb|object,word}], title?' },
  { kind: 'argument_structure', displayName: 'Argument Structure', whenToUse: 'Show claim + evidence + reasoning, with optional counter/rebuttal.', subjects: ['ela', 'social'], grades: { from: 6, to: 12 }, paramSchema: 'claim:string, evidence:[string], reasoning:[string], counter?:string, rebuttal?:string, title?' },
  { kind: 'historical_timeline', displayName: 'Historical Timeline', whenToUse: 'Show events along a chronological axis.', subjects: ['social'], grades: { from: 3, to: 12 }, paramSchema: 'events:[{date:string, year?:number, label, description?, color?}], title?' },
  { kind: 'government_branches', displayName: 'Branches of Government', whenToUse: 'Show executive/legislative/judicial branches with bodies and powers.', subjects: ['social'], grades: { from: 5, to: 12 }, paramSchema: 'country?:string, branches:[{name, bodies?:[string], powers?:[string]}], title?' },

  // ── Phase 8 — general organizers ───────────────────────────────────────
  { kind: 'comparison_table', displayName: 'Comparison Table', whenToUse: 'Compare items across attributes in a grid. Items become column headers; attributes become row labels.', subjects: ['general'], grades: { from: 3, to: 12 }, paramSchema: 'items:[string] (column headers, N entries), attributes:[string] (row labels, M entries), cells:string[M][N] (outer length = attributes.length; each inner row has items.length entries — one cell per item — read as cells[attributeIndex][itemIndex]), title?' },
  { kind: 't_chart', displayName: 'T-Chart', whenToUse: 'Two-column comparison (pros/cons, before/after, etc.).', subjects: ['general'], grades: { from: 2, to: 12 }, paramSchema: 'leftHeader, rightHeader, leftItems:[string], rightItems:[string], title?' },
  { kind: 'kwl_chart', displayName: 'KWL Chart', whenToUse: 'Know / Want to know / Learned chart.', subjects: ['general'], grades: { from: 2, to: 12 }, paramSchema: 'know:[string], want:[string], learned:[string], title?' },
  { kind: 'frayer_model', displayName: 'Frayer Model', whenToUse: 'Define a term via definition / characteristics / examples / non-examples.', subjects: ['general'], grades: { from: 4, to: 12 }, paramSchema: 'term:string, definition?, characteristics?:[string], examples?:[string], nonExamples?:[string], title?' },
  { kind: 'hierarchy_pyramid', displayName: 'Hierarchy Pyramid', whenToUse: 'Show ordered tiers (food pyramid, Maslow, Bloom\'s).', subjects: ['general'], grades: { from: 4, to: 12 }, paramSchema: 'tiers:[{label,description?,color?}], baseFirst?:boolean, title?' },

  // ── Phase 9 — economics (AP Plans Initiative) ──────────────────────────
  { kind: 'production_possibilities', displayName: 'Production Possibilities Curve', whenToUse: 'Show the trade-off between two goods given fixed resources; supports points inside/on/outside the curve and an optional growth/contraction shift.', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'xAxis:{label,max}, yAxis:{label,max}, curve?:bowed-out|linear (default bowed-out), points?:[{x,y,label?,position?:inside|on|outside,color?}], shift?:{direction:out|in,factor?,label?}, title?' },
  { kind: 'business_cycle', displayName: 'Business Cycle', whenToUse: 'Show the canonical expansion/peak/contraction/trough cycle of real GDP around a long-run trend, with optional output-gap shading and phase markers.', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'cycles?:number (default 1.5), amplitude?:0..1 (default 0.18), trendSlope?:number (default 0.4), showTrend?:boolean (default true), showOutputGap?:boolean (default false), labels?:all|minimal|none (default all), markers?:[{t:0..1,label,showLine?}], title?' },
  { kind: 'aggregate_demand_supply', displayName: 'AD-AS Model', whenToUse: 'Show the macroeconomic equilibrium of aggregate demand, short-run aggregate supply, and long-run aggregate supply; supports a single shift in AD/SRAS/LRAS with the new equilibrium computed automatically. Axis units are 0..100 (use 50 for "balanced" baseline).', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'potentialGdp?:number 0..100 (default 50), initialEquilibriumGdp?:number 0..100, initialPriceLevel?:number 0..100, showLras?:boolean (default true), shift?:{curve:AD|SRAS|LRAS, direction:left|right, magnitude?:number (default 10), label?}, labels?:{eqInitial?,eqFinal?,ad?,sras?,lras?}, title?' },
  { kind: 'money_market', displayName: 'Money Market', whenToUse: 'Show the money market with vertical money supply (Ms) and downward-sloping money demand (Md), nominal interest rate on the y-axis. Supports a single shift in Ms or Md with the new equilibrium computed automatically.', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'moneySupplyQuantity?:number 0..100, initialInterestRate?:number 0..100, shift?:{curve:Ms|Md, direction:left|right, magnitude?:number (default 10), label?}, title?' },
  { kind: 'loanable_funds', displayName: 'Loanable Funds Market', whenToUse: 'Show the loanable funds market with upward-sloping supply of saving and downward-sloping demand for investment (incl. government borrowing), real interest rate on the y-axis. Supports a single shift in S or D with the new equilibrium computed automatically.', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'initialQuantity?:number 0..100, initialRealRate?:number 0..100, shift?:{curve:S|D, direction:left|right, magnitude?:number (default 10), label?}, title?' },
  { kind: 'phillips_curve', displayName: 'Phillips Curve', whenToUse: 'Show the short-run Phillips Curve (downward-sloping inflation-unemployment tradeoff) and long-run Phillips Curve (vertical at NAIRU). Supports SRPC up/down shifts (inflation expectations / supply shocks) or LRPC left/right shifts (NAIRU changes).', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'nairu?:number 0..100, initialUnemployment?:number 0..100, initialInflation?:number 0..100, showLrpc?:boolean (default true), shift?:{curve:SRPC|LRPC, direction:up|down|left|right, magnitude?:number (default 10), label?}, title?' },
  { kind: 'foreign_exchange_market', displayName: 'Foreign Exchange Market', whenToUse: 'Show the FX market for one currency: upward-sloping S, downward-sloping D, exchange rate on y-axis. Supports a single shift in S or D with the new equilibrium computed automatically. Currency labels (e.g. USD vs EUR) shown on axes.', subjects: ['social'], grades: { from: 9, to: 12 }, paramSchema: 'currency?:string (default "USD"), quoteCurrency?:string (default "EUR"), initialQuantity?:number 0..100, initialExchangeRate?:number 0..100, shift?:{curve:S|D, direction:left|right, magnitude?:number (default 10), label?}, title?' },

  // ── Phase 10 — calculus (AP Calc BC) ───────────────────────────────────
  { kind: 'riemann_sum', displayName: 'Riemann Sum', whenToUse: 'Show ∫_a^b f(x) dx approximated by rectangles (or trapezoids). Brain pre-samples the curve and pre-computes each rectangle.', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'curve:[[x,y]…] (~20 samples; tuple form preferred over {x,y} to save tokens), rectangles:[[x,width,height]…] (tuple form; one per subinterval), xMin,xMax,yMin,yMax:numbers, method?:left|right|midpoint|trapezoidal (default left), n?:number, exprLabel?:string e.g. "f(x) = x²", approxArea?:number, exactArea?:number, title?' },
  { kind: 'slope_field', displayName: 'Slope Field', whenToUse: 'Show dy/dx = f(x, y) as a grid of slope segments at lattice points; optional integral curve and highlighted point.', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'samples:[[x,y,slope]…] (tuple form preferred to save tokens; 7×7 grid is plenty), xMin,xMax,yMin,yMax:numbers, solutionCurve?:[[x,y]…] (integral curve, ~25 points), highlightPoint?:{x,y}, exprLabel?:string e.g. "dy/dx = x", title?' },
  { kind: 'parametric_curve', displayName: 'Parametric Curve', whenToUse: 'Plot a 2D parametric curve (x(t), y(t)). Optional highlighted point and tangent vector at one t.', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'curve:[[x,y,t?]…] (tuple form preferred; ~30 points; if t is on every point, solver sorts by t to defang ordering hallucinations), xMin?,xMax?,yMin?,yMax?:numbers (auto-fit if omitted), highlightT?:{t?,x,y,label?}, tangentAtT?:{x,y,dx,dy,length?}, exprLabel?:string e.g. "x = cos t, y = sin t", title?' },
  { kind: 'polar_graph', displayName: 'Polar Graph', whenToUse: 'Plot r = f(θ) in polar coordinates. Optional shaded region (a subset of the curve) for area integrals.', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'curve:[[theta,r]…] (tuple form preferred; solver derives x,y; ~50 points), shadeRegion?:[[theta,r]…] (subset of curve to shade), highlightPoint?:{theta,r,label?}, rMax?:number (auto-fit if omitted), showAxes?:boolean (default true), exprLabel?:string e.g. "r = 1 + cos θ", title?' },
  { kind: 'taylor_polynomial_overlay', displayName: 'Taylor Polynomial Overlay', whenToUse: 'Show a function f(x) and one or more Taylor polynomial approximations T_n(x) about a center c.', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'baseCurve:[[x,y]…] (~30 samples; tuple form preferred), approximations:[{degree:number, curve:[[x,y]…], color?}] (one entry per Taylor polynomial), xMin?,xMax?,yMin?,yMax?:numbers (auto-fit if omitted), center?:number (default 0), exprLabel?:string e.g. "f(x) = sin x", title?' },

  // ── Phase 11 — statistics (AP Statistics) ──────────────────────────────
  { kind: 'histogram', displayName: 'Histogram', whenToUse: 'Show frequency (or relative frequency) distribution of a quantitative variable as touching bars over equal-width or unequal-width intervals. Distinct from bar_chart: bars TOUCH and bins are explicit intervals.', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'bins:[[lower,upper,count]…] (tuple form preferred to save tokens), xMin?,xMax?,yMax?:numbers (auto from bins if omitted), xLabel?:string, yLabel?:string (default "Frequency" or "Relative frequency"), title?:string, showCounts?:boolean (default true; show count atop each bar), mean?:number (vertical red line), median?:number (vertical green line), mode?:count|relative (default count)' },
  { kind: 'normal_curve', displayName: 'Normal Curve', whenToUse: 'Plot the normal distribution N(μ, σ) bell curve with optional shaded probability region (e.g. P(X > x) or P(a ≤ X ≤ b)) and labeled markers (e.g., z-scores, ±1/2/3 SDs).', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'mean:number (μ), sd:number (σ, > 0), xMin?:number (default μ−4σ), xMax?:number (default μ+4σ), shadeRegion?:{from?:number, to?:number} (omit either for ±∞), markValues?:[{x:number, label?:string}] (or [[x,label]] tuples), showSDLines?:boolean (default false; auto-draws ±1/2/3σ ticks), shadeArea?:number (pre-computed P, displayed in corner), title?:string, xLabel?:string' },
  { kind: 'scatterplot_regression', displayName: 'Scatterplot with Regression', whenToUse: 'Plot bivariate quantitative data with the LSRL overlaid. Optionally show residual segments, an equation label, and r/r² values. Highlight a single point.', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'points:[[x,y]…] (tuple form preferred; ~10–40 points), regression?:{slope:number, intercept:number} (LSRL — omit to plot points only), xMin?,xMax?,yMin?,yMax?:numbers (auto-fit if omitted), equationLabel?:string e.g. "ŷ = 2.1 + 1.3x", rValue?:number, rSquared?:number, highlightPoint?:{x,y,label?}, showResiduals?:boolean (default false; draws dashed lines from points to LSRL), xLabel?:string, yLabel?:string, title?:string' },

  // ── Phase 12 — environmental / demographic (AP Env Sci, AP Human Geo, AP Macro) ──
  { kind: 'population_pyramid', displayName: 'Population Pyramid', whenToUse: 'Show age-sex distribution as a horizontal pyramid: males extend left, females extend right. Wide base = expanding population (high TFR); narrow base = declining; column = stable. Used in AP Env Sci U3, AP Human Geo, AP Macro.', subjects: ['biology', 'social', 'general'], grades: { from: 9, to: 12 }, paramSchema: 'ageGroups:[[ageLabel,male,female]…] (tuple form preferred; e.g. ["0-4", 5.2, 5.0]; oldest age last in array), mode?:percent|count (default percent), maxValue?:number (auto from data), xLabel?:string, ageGroupLabel?:string (default "Age"), title?:string' },
  { kind: 'climate_diagram', displayName: 'Climate Diagram (Walter-Lieth)', whenToUse: 'Show one location\'s monthly temperature (line) and precipitation (bars) for a year. Identifies biome characteristics (rainfall pattern, seasonality). Used in AP Env Sci U1 biomes, U4 climate.', subjects: ['earth', 'biology', 'general'], grades: { from: 9, to: 12 }, paramSchema: 'months:[[label,temp,precip]…] (tuple form; exactly 12 months Jan-Dec; temp in °C or °F, precip in mm or in), tempUnit?:°C|°F (default °C), precipUnit?:mm|in (default mm), location?:string e.g. "Singapore", title?:string, meanAnnualTemp?:number (auto-computed if omitted), totalAnnualPrecip?:number (auto-computed if omitted)' },

  // ── Phase 13 — biogeochemical cycles + labeled anatomy (AP Env Sci, AP Psych/Bio) ──
  { kind: 'nutrient_cycle', displayName: 'Nutrient / Biogeochemical Cycle', whenToUse: 'Show a biogeochemical cycle as reservoirs (pools) connected by directed flux arrows (processes) — the carbon, nitrogen, phosphorus, or water cycle. Fluxes may connect ANY two reservoirs, not just adjacent ones (e.g. atmosphere ⇄ ocean). Prefer this over a freehand sketch for these cycles.', subjects: ['biology', 'earth', 'chemistry'], grades: { from: 6, to: 12 }, paramSchema: 'reservoirs:[{id?,label,description?,color?}] (the pools, e.g. Atmosphere, Plants, Soil, Ocean, Fossil Fuels; ≥2), fluxes:[{from,to,label?}] (a process moving the nutrient; from/to is a reservoir id or label; e.g. {from:"Atmosphere",to:"Plants",label:"photosynthesis"}), title?' },
  // 'social' is included so these surface for AP Psychology, which this app
  // files under social studies (plan subject 'ss' → catalog subject 'social').
  { kind: 'neuron_diagram', displayName: 'Labeled Neuron', whenToUse: 'Show a labeled schematic neuron (dendrites, cell body/soma, nucleus, axon, myelin sheath, nodes of Ranvier, axon terminals, synapse). Use for AP Psych Unit 1 / AP Bio neurons instead of a freehand sketch.', subjects: ['biology', 'social'], grades: { from: 7, to: 12 }, paramSchema: 'highlight?:[string] (part ids to emphasize — any of: dendrites, cell_body (aka soma), nucleus, axon, myelin_sheath, node_of_ranvier, axon_terminals, synapse), title?' },
  { kind: 'brain_regions', displayName: 'Labeled Brain', whenToUse: 'Show a labeled side-view brain. view "lobes" = the four cortical lobes + cerebellum + brain stem; view "limbic" = thalamus, hypothalamus, hippocampus, amygdala. Use for AP Psych Unit 1 brain structures instead of a freehand sketch.', subjects: ['biology', 'social'], grades: { from: 7, to: 12 }, paramSchema: 'view?:lobes|limbic (default lobes), highlight?:[string] (region ids to emphasize — lobes view: frontal_lobe, parietal_lobe, temporal_lobe, occipital_lobe, cerebellum, brain_stem; limbic view: thalamus, hypothalamus, hippocampus, amygdala), title?' },

  // ── Phase 14 — conic sections ──────────────────────────────────────────
  { kind: 'conic_sections', displayName: 'Conic Sections (cone slices)', whenToUse: 'Show the four conic sections as slices of a double cone — the "one cone, four shapes" figure (circle, ellipse, parabola, hyperbola, each from a plane at a different angle). ALWAYS use this for the cone-slicing illustration instead of a freehand sketch (a rough doodle of a sliced 3D cone is unreadable). Not for plotting a single conic curve — for that use show_function_graph / show_geometry.', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'slices?:[circle|ellipse|parabola|hyperbola] (default all four; pass a subset to show only some), highlight?:circle|ellipse|parabola|hyperbola (emphasize one), title?' },

  // ── Phase 15 — 3D / spatial figures ────────────────────────────────────
  { kind: 'solid_of_revolution', displayName: 'Solid of Revolution', whenToUse: 'Show a 2D region revolved about an axis to form a 3D solid, with a representative disk / washer / shell slice (AP Calc BC volumes). Use this for the 3D solid — a rough sketch cannot draw a surface of revolution. Pre-sample the bounding curve as the radius profile (like riemann_sum).', subjects: ['math'], grades: { from: 11, to: 12 }, paramSchema: 'outer:[[u,r]…] (radius profile along the axis — u is the position along the axis of revolution, r≥0 the distance from it; ~15-25 samples; tuple form), inner?:[[u,r]…] (inner radius ⇒ washer/hollow), axis?:x|y (default x), method?:disk|washer|shell (default washer if inner else disk), representativeAt?:number (axis coord of the highlighted slice; default midpoint), funcLabel?:string e.g. "y = √x", innerLabel?:string, axisLabel?:string, title?' },
  { kind: 'photosynthesis', displayName: 'Photosynthesis (chloroplast)', whenToUse: 'Show a schematic of photosynthesis in a chloroplast: the light reactions in the thylakoid (H2O + light → O2, ATP, NADPH) and the Calvin cycle in the stroma (CO2 + ATP + NADPH → glucose/G3P), with inputs and outputs. Use instead of a freehand sketch for the process.', subjects: ['biology'], grades: { from: 6, to: 12 }, paramSchema: 'title? (the structure is fixed)' },
  { kind: 'cellular_respiration', displayName: 'Cellular Respiration (mitochondrion)', whenToUse: 'Show a schematic of cellular respiration: glycolysis in the cytoplasm (glucose → 2 pyruvate, +2 ATP), then the Krebs cycle in the mitochondrial matrix and the electron transport chain on the inner membrane (~34 ATP, O2 → H2O), with CO2 output. Use instead of a freehand sketch.', subjects: ['biology'], grades: { from: 9, to: 12 }, paramSchema: 'title? (the structure is fixed)' },
  { kind: 'heart_diagram', displayName: 'Heart / Circulatory', whenToUse: 'Show a labeled schematic of the heart as a double pump: the four chambers (right/left atrium & ventricle), the great vessels (vena cava, pulmonary artery, pulmonary veins, aorta), and blood-flow direction (blue=deoxygenated, red=oxygenated). Use for circulatory-system teaching instead of a freehand sketch.', subjects: ['biology'], grades: { from: 5, to: 12 }, paramSchema: 'highlight?:[string] (part ids to emphasize — right_atrium, right_ventricle, left_atrium, left_ventricle, vena_cava, pulmonary_artery, pulmonary_vein, aorta), title?' },
  { kind: 'phase_diagram', displayName: 'Phase Diagram (P–T)', whenToUse: 'Show a pressure-temperature phase diagram: solid / liquid / gas regions, the three phase boundaries (sublimation, fusion, vaporization), the triple point and critical point. Supports water\'s negative-slope fusion line. Positions are normalized 0..1 so the shape is always clean.', subjects: ['chemistry', 'physics'], grades: { from: 9, to: 12 }, paramSchema: 'substance?:water|co2|generic (sets fusion slope + title), triplePoint?:{t,p,label?} (t,p in 0..1), criticalPoint?:{t,p,label?}, fusionSlope?:positive|negative (water=negative), marker?:{t,p,label?} (a state point to mark), tLabel?:string, pLabel?:string, title?' },
  { kind: 'field_lines', displayName: 'Field Lines (E / B)', whenToUse: 'Show electric or magnetic field-line patterns: a point charge (radial), a dipole (looping + to −), parallel plates (uniform field), or a bar magnet (N→S loops). The field-line geometry carries the physics; a freehand sketch can\'t draw it cleanly.', subjects: ['physics'], grades: { from: 8, to: 12 }, paramSchema: 'config:point_charge|dipole|parallel_plates|bar_magnet, field?:electric|magnetic (default electric; bar_magnet is always magnetic), charge?:+|- (for point_charge; default +), title?' },
  { kind: 'vsepr_geometry', displayName: 'VSEPR Molecular Geometry', whenToUse: 'Show an idealized 3D molecular shape (VSEPR): linear, trigonal_planar, bent, tetrahedral, trigonal_pyramidal, trigonal_bipyramidal, or octahedral — with wedge/dash bonds, lone pairs, and the bond angle. For electron/molecular geometry teaching. Distinct from show_molecule (a real 2D structure from SMILES); a freehand sketch cannot draw a 3D shape with correct angles.', subjects: ['chemistry'], grades: { from: 9, to: 12 }, paramSchema: 'geometry:linear|trigonal_planar|bent|tetrahedral|trigonal_pyramidal|trigonal_bipyramidal|octahedral, central:string (central atom symbol e.g. "C"), terminal?:string (same symbol on every bond e.g. "H") OR terminals?:[string] (per-position), lonePairs?:number (default per geometry), bondAngle?:string (default per geometry e.g. "109.5°"), title?' },
  { kind: 'vectors_3d', displayName: '3D Vectors / Axes', whenToUse: 'Show a 3D coordinate system (isometric) with vectors, points, an optional line (r = p + t·d) and an optional plane (point + normal). For IB AA / JEE / multivariable 3D vectors & geometry — a 2D vector tool and a freehand sketch cannot represent 3D space.', subjects: ['math'], grades: { from: 10, to: 12 }, paramSchema: 'vectors?:[{to:[x,y,z], from?:[x,y,z] (default origin), label?, color?}], points?:[{at:[x,y,z], label?, color?}], line?:{point:[x,y,z], dir:[x,y,z], label?}, plane?:{point:[x,y,z], normal:[x,y,z], label?}, axisRange?:number (auto from data), title?' },
  { kind: 'solid_3d', displayName: '3D Solid (labeled)', whenToUse: 'Show a labeled 3D solid in oblique projection with dimension labels — a cube, rectangular prism, triangular prism, cylinder, cone, sphere, or square pyramid. Use for volume / surface-area work instead of a freehand sketch (a doodled 3D solid is unreadable).', subjects: ['math'], grades: { from: 4, to: 12 }, paramSchema: 'shape:cube|rectangular_prism|triangular_prism|cylinder|cone|sphere|square_pyramid, dims:{ … shape-specific: cube{side}; rectangular_prism{length,width,height}; triangular_prism{base,triHeight,length}; cylinder{radius,height}; cone{radius,height}; sphere{radius}; square_pyramid{base,height} }, showNet?:boolean (also draw the unfolded net beside the solid, for surface-area work; no net for sphere), title?' },

  // ── Phase 17 — wavefront / 2D wave patterns ────────────────────────────
  { kind: 'doppler_effect', displayName: 'Doppler Effect (moving source)', whenToUse: 'Show the Doppler effect as concentric wavefronts from a MOVING source: rings bunched ahead (compressed → higher frequency / pitch) and spread behind (stretched → lower frequency / pitch), with the source, motion arrow, and labels. Use this canonical figure instead of a freehand sketch — a rough doodle of nested rings is unreadable. Not for a single transverse wave (use wave_diagram).', subjects: ['physics'], grades: { from: 8, to: 12 }, paramSchema: 'sourceSpeedFrac?:number (v/c, 0.1–0.85; default 0.5), movingRight?:boolean (default true), showObservers?:boolean (default true), nRings?:number (3–6; default 4), title?' },
  { kind: 'standing_wave', displayName: 'Standing Wave (string, harmonic n)', whenToUse: 'Show a standing wave on a string fixed at both ends vibrating in harmonic n (1–5): the two-lobe envelope (mirrored sine curves), the nodes (zero displacement) and antinodes (maximum displacement), labeled. Use for harmonics / resonance instead of a freehand sketch.', subjects: ['physics'], grades: { from: 8, to: 12 }, paramSchema: 'harmonic:number (n = 1–5, the number of loops), showNodes?:boolean (default true), title?' },
  { kind: 'interference_pattern', displayName: 'Two-Source Interference', whenToUse: 'Show two point sources emitting overlapping circular wavefronts, with the constructive (antinodal) lines and destructive (nodal) lines drawn as their true hyperbolas. Use for two-source / double-slit interference and ripple-tank patterns instead of a freehand sketch.', subjects: ['physics'], grades: { from: 9, to: 12 }, paramSchema: 'sourceSep?:number (source separation in px on the diagram; default 3×wavelength), wavelength?:number (px; default 46), title?' },

  // ── Phase 18 — cell biology / genetics ─────────────────────────────────
  { kind: 'mitosis', displayName: 'Mitosis (phases)', whenToUse: 'Show the phases of mitosis (interphase → prophase → metaphase → anaphase → telophase → cytokinesis) as a labeled grid of cells, tracking chromosome behavior and the spindle. Use this canonical figure instead of a freehand sketch — a rough doodle of dividing cells is unreadable. Not for meiosis (use meiosis).', subjects: ['biology'], grades: { from: 7, to: 12 }, paramSchema: 'phase?:interphase|prophase|metaphase|anaphase|telophase|cytokinesis (emphasise one phase; default shows all six), title?' },
  { kind: 'meiosis', displayName: 'Meiosis (I & II)', whenToUse: 'Show meiosis as a flow from one diploid (2n) cell through Meiosis I and Meiosis II to four haploid (n) cells, with homologous-pair (tetrad) synapsis, crossing over, and the two divisions. Use for meiosis / gamete formation instead of a freehand sketch. Not for mitosis (use mitosis).', subjects: ['biology'], grades: { from: 9, to: 12 }, paramSchema: 'stage?:meiosis_i|meiosis_ii|crossing_over (emphasise one stage; default shows the whole flow), title?' },
  { kind: 'dna_replication', displayName: 'DNA Replication Fork', whenToUse: 'Show the DNA replication fork: the parental double helix unwinding, the continuous leading strand and the discontinuous lagging strand made of Okazaki fragments, with the key enzymes (helicase, DNA polymerase, ligase) labeled. Use instead of a freehand sketch — a doodled fork with enzymes is unreadable.', subjects: ['biology'], grades: { from: 9, to: 12 }, paramSchema: 'showEnzymes?:boolean (label helicase / polymerase / ligase; default true), title?' },
  { kind: 'cell_membrane', displayName: 'Cell Membrane (fluid mosaic)', whenToUse: 'Show the cell membrane as the fluid-mosaic model: the phospholipid bilayer (hydrophilic heads, hydrophobic tails) with embedded channel / carrier / glycoprotein and cholesterol. Optionally illustrate a transport mode with the concentration gradient. Use instead of a freehand sketch.', subjects: ['biology'], grades: { from: 7, to: 12 }, paramSchema: 'mode?:diffusion|facilitated|active (add a transport variant with the gradient; default shows the plain labeled bilayer), title?' },

  // ── Phase 19 — chemistry ───────────────────────────────────────────────
  { kind: 'bohr_model', displayName: 'Bohr Model (atom)', whenToUse: 'Show the Bohr model of an atom: concentric electron shells around a labeled nucleus (protons + neutrons), with electrons drawn as dots filling each shell. Give the element and the solver fills the shells (2, 8, 8, …). Use this canonical figure instead of a freehand sketch — a rough doodle of nested rings of dots is unreadable. Not for orbital/subshell notation (use electron_configuration / orbital_diagram).', subjects: ['chemistry'], grades: { from: 6, to: 12 }, paramSchema: 'element?:string (symbol, e.g. "Na" — H..Ca plus Fe/Cu/Zn; default carbon), OR protons?:int + neutrons?:int + shells?:[int] (explicit per-shell electron counts), title?' },
  { kind: 'galvanic_cell', displayName: 'Galvanic / Voltaic Cell', whenToUse: 'Show an electrochemical (galvanic/voltaic) cell: two half-cells with metal electrodes in their salt solutions, a salt bridge, and the external circuit with a voltmeter and the electron-flow arrow. Labels the anode (−, oxidation, left) and cathode (+, reduction, right) with their half-reactions. Use for electrochemistry / redox instead of a freehand sketch. Default is the Daniell cell (Zn ‖ Cu).', subjects: ['chemistry'], grades: { from: 9, to: 12 }, paramSchema: 'anodeMetal?:string (metal symbol at the anode, e.g. "Zn"; default Zn), cathodeMetal?:string (metal at the cathode, e.g. "Cu"; default Cu — choices: Zn, Cu, Ag, Fe, Mg, Pb, Ni, Al), title?' },
  { kind: 'titration_curve', displayName: 'Titration Curve (pH)', whenToUse: 'Show an acid-base titration curve: pH on the y-axis vs. volume of titrant added on the x-axis, with the sigmoid shape and the equivalence point marked. A weak-strong titration also shows the buffer region and the half-equivalence point where pH = pKa. Use instead of a freehand sketch. Not a general x-y plot (use show_function_graph).', subjects: ['chemistry'], grades: { from: 10, to: 12 }, paramSchema: 'type?:strong-strong|weak-strong (default strong-strong; weak-strong adds the buffer plateau + half-equivalence pKa), title?' },
  { kind: 'crystal_lattice', displayName: 'Crystal Lattice (unit cell)', whenToUse: 'Show a cubic crystal unit cell in pseudo-3D with its lattice points: simple cubic (sc), body-centred cubic (bcc), or face-centred cubic (fcc). Corner / body-centre / face-centre atoms are colour-coded and the atoms-per-cell count is shown. Use for solid-state / crystal-structure teaching instead of a freehand sketch (a doodled 3D cell is unreadable).', subjects: ['chemistry'], grades: { from: 10, to: 12 }, paramSchema: 'type?:sc|bcc|fcc (default sc), title?' },

  // ── Phase 20 — nuclear / electromagnetism / kinematics ─────────────────
  { kind: 'nuclear_decay', displayName: 'Nuclear Decay (α / β / γ)', whenToUse: 'Show a radioactive decay: the parent nuclide → daughter nuclide + emitted particle, with the mass-number (A) and atomic-number (Z) conservation equations shown, plus a small half-life (N/N₀) decay curve. Modes: alpha, beta-minus, beta-plus, gamma. Use this canonical figure instead of a freehand sketch — the ᴬ_Z notation and the A/Z bookkeeping must be exact.', subjects: ['physics', 'chemistry'], grades: { from: 8, to: 12 }, paramSchema: 'mode?:alpha|beta-minus|beta-plus|gamma (default alpha), showHalfLife?:boolean (default true), title?' },
  { kind: 'em_induction', displayName: 'Electromagnetic Induction (Faraday / Lenz)', whenToUse: 'Show electromagnetic induction: a bar magnet moving toward or away from a coil, the changing magnetic flux inducing a current, and a galvanometer whose needle deflects. Labels the induced-current direction (opposing the change, Lenz\'s law). Use for Faraday\'s / Lenz\'s law instead of a freehand sketch.', subjects: ['physics'], grades: { from: 9, to: 12 }, paramSchema: 'motion?:in|out (magnet moving toward or away from the coil; default in), title?' },
  { kind: 'magnetic_field_current', displayName: 'Magnetic Field of a Current', whenToUse: 'Show the magnetic field produced by an electric current: either a straight wire (current out of the page) with concentric circular field lines (right-hand rule), or a solenoid with its uniform interior field and N/S poles and the ⊗/⊙ current-direction notation. Use for the magnetic-effect-of-current / right-hand-rule instead of a freehand sketch.', subjects: ['physics'], grades: { from: 8, to: 12 }, paramSchema: 'conductor?:wire|solenoid (default wire), title?' },
  { kind: 'projectile_motion', displayName: 'Projectile Motion (trajectory)', whenToUse: 'Show projectile motion: the parabolic trajectory with the launch angle θ, the launch velocity decomposed into horizontal (vₓ = v·cos θ) and vertical (v_y = v·sin θ) components, the apex (maximum height, where v_y = 0), and the range R marked. Use for 2D kinematics / projectile problems instead of a freehand sketch. Not a general x-y plot (use show_function_graph).', subjects: ['physics'], grades: { from: 8, to: 12 }, paramSchema: 'angle?:number (launch angle in degrees, 15–75; default 45), showComponents?:boolean (draw the vₓ/v_y decomposition; default true), title?' },
  // ── Phase 20 — bio anatomy / physiology ────────────────────────────────
  { kind: 'leaf_cross_section', displayName: 'Leaf Cross-Section', whenToUse: 'Show a transverse section of a leaf: the waxy cuticle, upper and lower epidermis, palisade and spongy mesophyll (with chloroplasts and air spaces), the vascular bundle (xylem / phloem) and the stomata with guard cells, plus optional CO₂-in / O₂-out gas-exchange arrows. Use for leaf structure / photosynthesis adaptations instead of a freehand sketch.', subjects: ['biology'], grades: { from: 6, to: 12 }, paramSchema: 'highlight?:[string] (part ids to emphasize — cuticle, upper_epidermis, palisade_mesophyll, spongy_mesophyll, air_space, vascular_bundle, xylem, phloem, lower_epidermis, stoma, guard_cell), showGasExchange?:boolean (CO₂-in / O₂-out arrows; default true), title?' },
  { kind: 'nephron', displayName: 'Nephron (kidney)', whenToUse: "Show the kidney nephron: Bowman's capsule with the glomerulus, the proximal tubule, the loop of Henle (descending and ascending limbs), the distal tubule and the collecting duct, with optional filtration / reabsorption arrows. Use for osmoregulation / excretion instead of a freehand sketch — a doodled coiled tubule is unreadable.", subjects: ['biology'], grades: { from: 9, to: 12 }, paramSchema: 'highlight?:[string] (part ids to emphasize — glomerulus, bowmans_capsule, proximal_tubule, descending_limb, ascending_limb, loop_of_henle, distal_tubule, collecting_duct), showFlow?:boolean (filtration / reabsorption arrows; default true), title?' },
  { kind: 'digestive_system', displayName: 'Digestive System', whenToUse: 'Show the human digestive (GI) tract in order — mouth, esophagus, stomach, small intestine, large intestine, rectum — plus the accessory organs (liver, gallbladder, pancreas), labeled. Use for digestion teaching instead of a freehand sketch.', subjects: ['biology'], grades: { from: 5, to: 12 }, paramSchema: 'highlight?:[string] (organ ids to emphasize — mouth, esophagus, stomach, liver, gallbladder, pancreas, small_intestine, large_intestine, rectum), title?' },
  { kind: 'circulatory_system', displayName: 'Circulatory System (double circulation)', whenToUse: 'Show the double circulation as a schematic: the four-chambered heart, the pulmonary loop (heart ⇄ lungs) and the systemic loop (heart ⇄ body), with oxygenated (red) vs deoxygenated (blue) blood and the major vessels (vena cava, pulmonary artery, pulmonary vein, aorta). Use for whole-body blood flow instead of a freehand sketch. For the heart alone, use heart_diagram.', subjects: ['biology'], grades: { from: 6, to: 12 }, paramSchema: 'highlight?:[string] (part ids to emphasize — heart, lungs, body, right_atrium, right_ventricle, left_atrium, left_ventricle, vena_cava, pulmonary_artery, pulmonary_vein, aorta, pulmonary_loop, systemic_loop), title?' },

  // ── Phase 22 — computer science (data structures + algorithms) ─────────
  { kind: 'data_structure', displayName: 'Data Structure (stack / queue / linked list)', whenToUse: 'Show a linear data structure as a precise labeled figure: a STACK (vertical boxes with the top marked, push/pop, LIFO), a QUEUE (horizontal boxes with front/rear, enqueue/dequeue, FIFO), or a singly LINKED LIST (value+next nodes with pointer arrows ending in null). Use this canonical figure instead of a freehand sketch — boxes, pointers and the top/front/rear labels must line up exactly. For a binary tree use binary_tree; for a graph use graph_diagram.', subjects: ['cs'], grades: { from: 7, to: 12 }, paramSchema: "structure?:stack|queue|linked_list (default stack), items?:[string] (values; default 4 sample values), title?" },
  { kind: 'graph_diagram', displayName: 'Graph (vertices + edges)', whenToUse: 'Show a graph: vertices as labeled circles on a ring layout and edges as lines (or arrows if directed), with optional edge weights and an optional BFS/DFS traversal-order overlay (numbered badges). Use for graph-theory / graph-algorithm teaching instead of a freehand sketch — a doodled node-and-edge blob is unreadable. Not for a rooted binary tree (use binary_tree) or a flowchart (use flowchart_simple).', subjects: ['cs'], grades: { from: 8, to: 12 }, paramSchema: "nodes?:[string] (vertex labels; default A–E), edges?:[[from,to]] (or [from,to,weight]; default sample edges), directed?:boolean (default false), weights?:boolean (default auto), traversal?:bfs|dfs (overlay visit order from the first node), title?" },
  { kind: 'hash_table', displayName: 'Hash Table (buckets + chaining)', whenToUse: 'Show a hash table: a bucket array (indices 0..size−1) with keys placed by a simple, shown hash function [(Σ char codes) mod size] and separate-chaining collision lists drawn as chained boxes. Use for hashing / collision-resolution teaching instead of a freehand sketch. Empty buckets are marked ∅; collisions are highlighted.', subjects: ['cs'], grades: { from: 9, to: 12 }, paramSchema: "size?:number (buckets, 3–11; default 7), entries?:[[key,value]] (default sample keys that collide), title?" },
  { kind: 'recursion_tree', displayName: 'Recursion Tree (call tree)', whenToUse: 'Show the call tree of a recursive function: FIBONACCI [fib(n) branching into fib(n−1)+fib(n−2), showing overlapping subproblems] or FACTORIAL [fact(n) → fact(n−1) → … as a chain], with base-case leaves highlighted and optional return values. Use for recursion / divide-and-conquer teaching instead of a freehand sketch — the branching and depth must be exact.', subjects: ['cs'], grades: { from: 8, to: 12 }, paramSchema: "kind?:fibonacci|factorial (default fibonacci), n?:number (fibonacci 2–6, factorial 1–7; default 5), showValues?:boolean (return values; default true), title?" },

  // ── Phase 23 — earth & space science ───────────────────────────────────
  { kind: 'geologic_cross_section', displayName: 'Geologic Cross-Section', whenToUse: 'Show a block cross-section of sedimentary rock strata (oldest at the bottom — law of superposition) cut by a fault and an igneous intrusion, with an unconformity (erosional gap). Use for relative-dating / structural-geology teaching (superposition, cross-cutting relationships, faulting, unconformities) instead of a freehand sketch.', subjects: ['earth'], grades: { from: 6, to: 12 }, paramSchema: 'showFault?:boolean (default true), faultType?:normal|reverse (default normal), showUnconformity?:boolean (default true), title?' },
  { kind: 'hr_diagram', displayName: 'Hertzsprung–Russell Diagram', whenToUse: 'Show the Hertzsprung–Russell (H–R) diagram: stellar luminosity (y, log) vs. surface temperature (x, log, REVERSED so hot is on the left), with the main-sequence diagonal, the giants (upper right), the white dwarfs (lower left), and the Sun marked. Use for stellar-classification / stellar-evolution teaching instead of a freehand sketch or a generic x-y plot.', subjects: ['earth'], grades: { from: 8, to: 12 }, paramSchema: 'highlight?:main_sequence|giants|white_dwarfs|sun (emphasize one region; default none), title?' },
  { kind: 'volcano_cross_section', displayName: 'Volcano Cross-Section', whenToUse: 'Show a labeled cross-section of a stratovolcano: the magma chamber, the central conduit/vent, the summit crater, the alternating hardened-lava-and-ash layers, and a side (parasitic) vent. Use for volcano-anatomy / volcanism teaching instead of a freehand sketch.', subjects: ['earth'], grades: { from: 4, to: 12 }, paramSchema: 'showSideVent?:boolean (default true), title?' },
  { kind: 'atmosphere_layers', displayName: "Earth's Atmosphere Layers", whenToUse: "Show Earth's atmosphere layers stacked by altitude — troposphere, stratosphere (with the ozone layer), mesosphere, thermosphere, exosphere — with altitude markers on the left axis and the temperature-vs-altitude profile curve overlaid (the zigzag: cooling, then warming through the ozone, cooling again, then warming in the thermosphere). Use for atmosphere-structure teaching instead of a freehand sketch.", subjects: ['earth'], grades: { from: 5, to: 12 }, paramSchema: 'highlight?:troposphere|stratosphere|mesosphere|thermosphere|exosphere (emphasize one layer; default none), title?' },
  // ── Phase 23 — molecular / cell biology ────────────────────────────────
  { kind: 'protein_synthesis', displayName: 'Protein Synthesis (central dogma)', whenToUse: 'Show the central dogma as a schematic: transcription (RNA polymerase copying DNA into mRNA inside the nucleus) and translation (a ribosome reading mRNA codons while tRNAs deliver amino acids to build a polypeptide), with DNA, mRNA, ribosome, tRNA, codon/anticodon and polypeptide labeled. Use instead of a freehand sketch for gene expression / protein synthesis.', subjects: ['biology'], grades: { from: 7, to: 12 }, paramSchema: "stage?:transcription|translation|both (default both), title?" },
  { kind: 'enzyme_action', displayName: 'Enzyme Action (lock-and-key / induced fit)', whenToUse: 'Show how an enzyme works: substrate binding the active site → enzyme–substrate complex → products released with the enzyme unchanged, drawn as the lock-and-key or induced-fit model, plus an activation-energy reaction-coordinate inset showing the enzyme lowering Ea. Use instead of a freehand sketch for enzyme / catalysis teaching.', subjects: ['biology', 'chemistry'], grades: { from: 8, to: 12 }, paramSchema: "model?:lock_key|induced_fit (default lock_key), title?" },
  { kind: 'cell_cycle', displayName: 'Cell Cycle (G1 → S → G2 → M)', whenToUse: 'Show the cell cycle as a labeled ring — interphase (G1, S, G2) plus the M (mitotic) phase — with the G1/S, G2/M and spindle checkpoints marked and the relative phase durations. Use instead of a freehand sketch for cell-cycle / cell-division teaching. For the phases of mitosis themselves use mitosis.', subjects: ['biology'], grades: { from: 8, to: 12 }, paramSchema: "highlight?:G1|S|G2|M (emphasize one phase), title?" },
  { kind: 'gene_expression', displayName: 'Gene Regulation (lac operon)', whenToUse: 'Show prokaryotic gene regulation via the lac operon: the regulatory gene, promoter, operator and structural genes, shown OFF (no inducer → repressor bound to the operator → RNA polymerase blocked) vs ON (inducer inactivates the repressor → RNA polymerase transcribes the genes). Use instead of a freehand sketch for operon / gene-regulation teaching.', subjects: ['biology'], grades: { from: 9, to: 12 }, paramSchema: "state?:on|off (default off), title?" },

  // ── Phase 25 — elementary-math manipulatives (K-3) ─────────────────────
  { kind: 'clock_face', displayName: 'Analog Clock', whenToUse: 'Show an analog clock reading a specific time — the hour hand (short) and minute hand (long) at the correct angles, a numbered face, and the digital time below. Use for telling-time / elapsed-time teaching instead of a freehand sketch (a doodled clock has the hands at the wrong angles). The hour hand advances with the minutes automatically (e.g. 3:30 puts it halfway to 4).', subjects: ['math'], grades: { from: 'k', to: 4 }, paramSchema: 'hour:number (1-12; 0/24 read as 12), minute?:number (0-59, default 0), showMinuteTicks?:boolean (default true), title?' },
  { kind: 'ten_frame', displayName: 'Ten-Frame', whenToUse: 'Show a ten-frame (a 2×5 grid) filled with counters — the canonical figure for number sense, subitizing, making-ten, and addition within 20. Pass a single count (0-20 auto-splits into two frames) or explicit per-frame counts. Use instead of a freehand sketch (dots must sit in exact cells).', subjects: ['math'], grades: { from: 'k', to: 2 }, paramSchema: 'count?:number (0-20, fills frames left-to-right) OR frames?:[number] (1-2 entries, each 0-10), colors?:[string] (counter color per frame), title?' },
  { kind: 'base_ten_blocks', displayName: 'Base-Ten (Place-Value) Blocks', whenToUse: 'Show a whole number as base-ten blocks: thousands cubes, hundreds flats (10×10), tens rods (1×10), and ones units, grouped into labeled place-value columns. Use for place-value / regrouping teaching instead of a freehand sketch (the block grids must be exact).', subjects: ['math'], grades: { from: 1, to: 5 }, paramSchema: 'value:number (0-9999), title?' },

  // ── Phase 26 — microeconomics ──────────────────────────────────────────
  { kind: 'supply_demand', displayName: 'Supply & Demand (single market)', whenToUse: 'Show a single-market supply & demand graph: upward S, downward D, price on the y-axis and quantity on the x-axis, with the equilibrium marked. Supports ONE comparative-statics shift (S or D, left/right) with the new equilibrium computed, OR a binding price control (ceiling/floor) with the resulting shortage/surplus shown. This is the MICRO single-market graph — for the macro economy-wide model use aggregate_demand_supply instead. Use instead of a freehand sketch.', subjects: ['social'], grades: { from: 8, to: 12 }, paramSchema: 'good?:string (axis/label noun, e.g. "coffee"), initialQuantity?:number 0..100 (default 50), initialPrice?:number 0..100 (default 50), shift?:{curve:S|D, direction:left|right, magnitude?:number (default 12), label?}, priceControl?:{type:ceiling|floor, level:number 0..100, label?}, title?' },
  { kind: 'circular_flow', displayName: 'Circular-Flow Model', whenToUse: 'Show the two-sector circular-flow model: Households and Firms connected through the Product Market (top) and the Resource/Factor Market (bottom), with the money flow (outer loop: spending → revenue → factor payments → income) and the real flow (inner loop: resources → goods & services) drawn as color-coded arrows. Use for intro-macro / intro-micro circular-flow teaching instead of a freehand sketch.', subjects: ['social'], grades: { from: 8, to: 12 }, paramSchema: 'showMoneyFlow?:boolean (default true), showRealFlow?:boolean (default true), title? (structure is otherwise fixed)' },

  // ── Phase 27 — biology (respiratory / botany / ecology) ────────────────
  { kind: 'respiratory_system', displayName: 'Respiratory System', whenToUse: 'Show the human respiratory system: nasal cavity, pharynx, larynx, trachea (windpipe), the two bronchi branching into the two lungs (right = 3 lobes, left = 2), bronchioles, an alveoli (air-sac) inset where gas exchange happens, and the diaphragm. Use for breathing / gas-exchange teaching instead of a freehand sketch. Emphasise parts with highlight.', subjects: ['biology'], grades: { from: 5, to: 12 }, paramSchema: 'highlight?:[string] (part ids — nasal_cavity, pharynx, larynx, trachea, bronchi, bronchioles, left_lung, right_lung, alveoli, diaphragm), title?' },
  { kind: 'flower_structure', displayName: 'Flower Structure', whenToUse: 'Show a longitudinal section of a flower with its parts labeled: petal & sepal, the stamen (anther + filament, male), and the carpel/pistil (stigma + style + ovary + ovule, female), plus the receptacle. Use for plant-reproduction / flower-anatomy teaching instead of a freehand sketch. Emphasise parts with highlight (stamen and carpel/pistil are accepted aliases).', subjects: ['biology'], grades: { from: 4, to: 12 }, paramSchema: 'highlight?:[string] (part ids — petal, sepal, anther, filament, stamen, stigma, style, ovary, ovule, carpel/pistil, receptacle), title?' },
  { kind: 'energy_pyramid', displayName: 'Energy Pyramid (trophic levels)', whenToUse: 'Show a trophic energy pyramid: stacked tiers widest at the bottom (producers) narrowing upward (primary → secondary → tertiary consumers), with the ~10% energy transferred up each level and ~90% lost as heat. Use for ecology / food-chain / energy-flow teaching instead of a freehand sketch. Accepts custom levels or defaults to a 4-level chain.', subjects: ['biology'], grades: { from: 4, to: 12 }, paramSchema: 'levels?:[{label, organisms?}] (bottom→top, 2-6 entries; default 4 trophic levels), startEnergy?:number (default 10000), efficiency?:number 0..1 (default 0.1), units?:string (default "kcal/m²/yr"), showEnergy?:boolean (default true), title?' },

  // ── Phase 28 — advanced math (Argand) + ELA (Freytag) ──────────────────
  { kind: 'complex_plane', displayName: 'Complex Plane (Argand diagram)', whenToUse: 'Plot one or more complex numbers a+bi on the Argand plane (real axis horizontal, imaginary axis vertical), each as a point and (by default) a position vector from the origin, with an optional modulus |z| and argument arg(z) annotation. Use for complex-number teaching instead of show_function_graph (which is for real x-y functions). Axes auto-fit unless range is given.', subjects: ['math'], grades: { from: 9, to: 12 }, paramSchema: 'points:[{re,im (or a,b), label?, color?, showVector?:boolean (default true), showModulus?:boolean, showAngle?:boolean}] (≥1), range?:number (axes span ±range; auto-fit if omitted), title?' },
  { kind: 'plot_diagram', displayName: "Plot Diagram (Freytag's pyramid)", whenToUse: "Show the five-stage dramatic-arc plot diagram (Freytag's pyramid): exposition → rising action → climax (the peak) → falling action → resolution, drawn as a rising-then-falling arc. Optional per-stage notes map a specific story onto each stage. Use for narrative-structure / story-analysis teaching instead of a freehand sketch.", subjects: ['ela'], grades: { from: 3, to: 12 }, paramSchema: 'notes?:{exposition?, rising_action?, climax?, falling_action?, resolution?} (short per-stage annotations mapping a story onto the arc; all optional), title?' },
];

/** Solver dispatch table. */
const SOLVERS: Partial<Record<DiagramKindId, SolverFn>> = {
  // Phase 1
  number_line: solveNumberLine,
  equation_balance: solveEquationBalance,
  tape_diagram: solveTapeDiagram,
  fraction_comparison: solveFractionComparison,
  area_model: solveAreaModel,
  pie_chart: solvePieChart,
  bar_chart: solveBarChart,
  line_plot: solveLinePlot,
  // Phase 2
  balance_scale: solveBalanceScale,
  lever: solveLever,
  pulley_system: solvePulleySystem,
  inclined_plane: solveInclinedPlane,
  spring_mass: solveSpringMass,
  pendulum: solvePendulum,
  simple_circuit: solveSimpleCircuit,
  wave_diagram: solveWaveDiagram,
  ray_diagram_lens: (p) => solveRayDiagram(p, false),
  ray_diagram_mirror: (p) => solveRayDiagram(p, true),
  vector_addition: solveVectorAddition,
  // Phase 3
  electron_configuration: solveElectronConfiguration,
  orbital_diagram: solveOrbitalDiagram,
  periodic_table_highlight: solvePeriodicTableHighlight,
  punnett_square: solvePunnettSquare,
  life_cycle: solveCycleStages,
  water_cycle: solveCycleStages,
  rock_cycle: solveCycleStages,
  body_system: solveBodySystem,
  // Phase 4
  phases_of_moon: solvePhasesOfMoon,
  solar_system: solveSolarSystem,
  earth_layers: solveEarthLayers,
  eclipse_diagram: solveEclipseDiagram,
  seasons_diagram: solveSeasonsDiagram,
  plate_tectonics: solvePlateTectonics,
  // Phase 5
  flowchart_simple: solveFlowchartSimple,
  state_machine: solveStateMachine,
  binary_tree: solveBinaryTree,
  truth_table: solveTruthTable,
  logic_gate: solveLogicGate,
  // Phase 6
  unit_circle: solveUnitCircle,
  transformation: solveTransformation,
  inequality_graph: solveInequalityGraph,
  // Phase 7
  sentence_diagram: solveSentenceDiagram,
  argument_structure: solveArgumentStructure,
  historical_timeline: solveHistoricalTimeline,
  government_branches: solveGovernmentBranches,
  // Phase 8
  comparison_table: solveComparisonTable,
  t_chart: (p) => solveOrganizer('t_chart', p),
  kwl_chart: (p) => solveOrganizer('kwl_chart', p),
  frayer_model: (p) => solveOrganizer('frayer_model', p),
  hierarchy_pyramid: solveHierarchyPyramid,
  // Phase 9 — economics
  production_possibilities: solveProductionPossibilities,
  business_cycle: solveBusinessCycle,
  aggregate_demand_supply: solveAggregateDemandSupply,
  money_market: solveMoneyMarket,
  loanable_funds: solveLoanableFunds,
  phillips_curve: solvePhillipsCurve,
  foreign_exchange_market: solveForeignExchangeMarket,
  // Phase 10 — calculus
  riemann_sum: solveRiemannSum,
  slope_field: solveSlopeField,
  parametric_curve: solveParametricCurve,
  polar_graph: solvePolarGraph,
  taylor_polynomial_overlay: solveTaylorPolynomialOverlay,
  // Phase 11 — statistics
  histogram: solveHistogram,
  normal_curve: solveNormalCurve,
  scatterplot_regression: solveScatterRegression,
  // Phase 12 — environmental / demographic
  population_pyramid: solvePopulationPyramid,
  climate_diagram: solveClimateDiagram,
  // Phase 13 — biogeochemical cycles + anatomy
  nutrient_cycle: solveNutrientCycle,
  neuron_diagram: solveNeuronDiagram,
  brain_regions: solveBrainRegions,
  // Phase 14 — conic sections
  conic_sections: solveConicSections,
  // Phase 15 — 3D / spatial
  solid_of_revolution: solveSolidOfRevolution,
  solid_3d: solveSolid3D,
  vectors_3d: solveVectors3D,
  vsepr_geometry: solveVseprGeometry,
  field_lines: solveFieldLines,
  phase_diagram: solvePhaseDiagram,
  heart_diagram: solveHeartDiagram,
  photosynthesis: solvePhotosynthesis,
  cellular_respiration: solveCellularRespiration,
  // Phase 17 — wavefront / 2D wave patterns
  doppler_effect: solveDopplerEffect,
  standing_wave: solveStandingWave,
  interference_pattern: solveInterferencePattern,
  // Phase 18 — cell biology / genetics
  mitosis: solveMitosis,
  meiosis: solveMeiosis,
  dna_replication: solveDnaReplication,
  cell_membrane: solveCellMembrane,
  // Phase 19 — chemistry
  bohr_model: solveBohrModel,
  galvanic_cell: solveGalvanicCell,
  titration_curve: solveTitrationCurve,
  crystal_lattice: solveCrystalLattice,
  // Phase 20 — nuclear / electromagnetism / kinematics
  nuclear_decay: solveNuclearDecay,
  em_induction: solveEMInduction,
  magnetic_field_current: solveMagneticFieldCurrent,
  projectile_motion: solveProjectileMotion,
  // Phase 20 — bio anatomy / physiology
  leaf_cross_section: solveLeafCrossSection,
  nephron: solveNephron,
  digestive_system: solveDigestiveSystem,
  circulatory_system: solveCirculatorySystem,
  // Phase 22 — computer science
  data_structure: solveDataStructure,
  graph_diagram: solveGraphDiagram,
  hash_table: solveHashTable,
  recursion_tree: solveRecursionTree,
  // Phase 23 — earth & space science
  geologic_cross_section: solveGeologicCrossSection,
  hr_diagram: solveHRDiagram,
  volcano_cross_section: solveVolcanoCrossSection,
  atmosphere_layers: solveAtmosphereLayers,
  // Phase 23 — molecular / cell biology
  protein_synthesis: solveProteinSynthesis,
  enzyme_action: solveEnzymeAction,
  cell_cycle: solveCellCycle,
  gene_expression: solveGeneExpression,
  // Phase 25 — elementary-math manipulatives
  clock_face: solveClockFace,
  ten_frame: solveTenFrame,
  base_ten_blocks: solveBaseTenBlocks,
  // Phase 26 — microeconomics
  supply_demand: solveSupplyDemand,
  circular_flow: solveCircularFlow,
  // Phase 27 — biology (respiratory / botany / ecology)
  respiratory_system: solveRespiratorySystem,
  flower_structure: solveFlowerStructure,
  energy_pyramid: solveEnergyPyramid,
  // Phase 28 — advanced math (Argand) + ELA (Freytag)
  complex_plane: solveComplexPlane,
  plot_diagram: solvePlotDiagram,
};

export function getDiagramKind(kind: string): DiagramKindMeta | undefined {
  return DIAGRAM_CATALOG.find((k) => k.kind === kind);
}

export function isImplementedKind(kind: string): kind is DiagramKindId {
  return Boolean(SOLVERS[kind as DiagramKindId]);
}

export class DiagramSolverError extends Error {
  constructor(public kind: string, message: string) {
    super(`[diagram:${kind}] ${message}`);
    this.name = 'DiagramSolverError';
  }
}

/** Dispatch a brain-issued spec to the right solver. */
export function solveDiagram(kind: string, params: Record<string, unknown>): NormalizedFigure {
  if (!isImplementedKind(kind)) {
    const meta = getDiagramKind(kind);
    if (meta) {
      throw new DiagramSolverError(kind, `kind "${kind}" is in the catalog but its solver is not yet implemented`);
    }
    throw new DiagramSolverError(kind, `unknown kind "${kind}" — see catalog manifest for valid kinds`);
  }
  try {
    return SOLVERS[kind]!(params);
  } catch (err) {
    if (err instanceof DiagramSolverError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new DiagramSolverError(kind, msg);
  }
}

/** Render the catalog as a compact prompt block. */
export function renderCatalogForPrompt(filter?: {
  subject?: DiagramKindMeta['subjects'][number];
  /** Multi-subject scope (a session may span several, e.g. NEET = bio/chem/phys).
   *  A kind is kept if it shares ANY of these subjects (or is 'general'). */
  subjects?: DiagramKindMeta['subjects'][number][];
  grade?: 'k' | number;
}): string {
  const subs = filter?.subjects ?? (filter?.subject ? [filter.subject] : undefined);
  const candidates = DIAGRAM_CATALOG.filter((k) => {
    if (subs && subs.length) {
      if (!k.subjects.some((s) => subs.includes(s)) && !k.subjects.includes('general')) return false;
    }
    if (filter?.grade !== undefined) {
      const fromN = k.grades.from === 'k' ? 0 : k.grades.from;
      const gN = filter.grade === 'k' ? 0 : filter.grade;
      if (gN < fromN || gN > k.grades.to) return false;
    }
    return true;
  });
  const lines = candidates.map((k) => {
    const grades = `${k.grades.from === 'k' ? 'K' : k.grades.from}-${k.grades.to}`;
    return `  - ${k.kind} [${grades}, ${k.subjects.join('|')}]: ${k.whenToUse}\n    params: ${k.paramSchema}`;
  });
  return [
    'Diagram catalog (use show_diagram with one of these kinds; do not invent kinds):',
    ...lines,
  ].join('\n');
}

export type { DiagramKindMeta, DiagramKindId };
