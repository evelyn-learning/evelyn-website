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
} from './kinds/earth-space';

import {
  solveFlowchartSimple, solveStateMachine, solveBinaryTree,
  solveTruthTable, solveLogicGate,
} from './kinds/cs';

import {
  solveUnitCircle, solveTransformation, solveInequalityGraph,
  solveSentenceDiagram, solveArgumentStructure, solveHistoricalTimeline,
  solveGovernmentBranches, solveComparisonTable, solveOrganizer,
  solveHierarchyPyramid,
} from './kinds/advanced-math-ela-social';

import {
  solveProductionPossibilities,
  solveBusinessCycle,
  solveAggregateDemandSupply,
  solveMoneyMarket,
  solveLoanableFunds,
  solvePhillipsCurve,
  solveForeignExchangeMarket,
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
  { kind: 'comparison_table', displayName: 'Comparison Table', whenToUse: 'Compare items across attributes in a grid.', subjects: ['general'], grades: { from: 3, to: 12 }, paramSchema: 'items:[string], attributes:[string], cells:[[string]], title?' },
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
  grade?: 'k' | number;
}): string {
  const candidates = DIAGRAM_CATALOG.filter((k) => {
    if (filter?.subject && !k.subjects.includes(filter.subject)) {
      if (!k.subjects.includes('general')) return false;
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
