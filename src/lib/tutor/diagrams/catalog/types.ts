/**
 * Diagram catalog — type spine.
 *
 * A "kind" is a structural diagram type with a deterministic solver and
 * a renderer. The brain picks a kind from the catalog and supplies
 * params; the solver validates + normalizes; the renderer draws.
 *
 * This file defines the contract every kind implements. Adding a new
 * kind = adding a manifest entry + writing a solver + writing a
 * renderer. No system-prompt changes per kind.
 */

/** All diagram kinds shipped in the catalog. Discriminator for the
 *  show_diagram tool. New kinds are added here AND in the manifest. */
export type DiagramKindId =
  // Phase 1 — math K-8
  | 'number_line'
  | 'equation_balance'
  | 'tape_diagram'
  | 'fraction_comparison'
  | 'area_model'
  | 'pie_chart'
  | 'bar_chart'
  | 'line_plot'
  // Phase 2 — physics
  | 'balance_scale'
  | 'lever'
  | 'pulley_system'
  | 'inclined_plane'
  | 'spring_mass'
  | 'pendulum'
  | 'simple_circuit'
  | 'wave_diagram'
  | 'ray_diagram_lens'
  | 'ray_diagram_mirror'
  | 'vector_addition'
  // Phase 3 — chemistry / biology
  | 'electron_configuration'
  | 'orbital_diagram'
  | 'periodic_table_highlight'
  | 'punnett_square'
  | 'life_cycle'
  | 'water_cycle'
  | 'rock_cycle'
  | 'body_system'
  // Phase 4 — earth / space
  | 'phases_of_moon'
  | 'solar_system'
  | 'earth_layers'
  | 'eclipse_diagram'
  | 'seasons_diagram'
  | 'plate_tectonics'
  // Phase 5 — CS
  | 'flowchart_simple'
  | 'state_machine'
  | 'binary_tree'
  | 'truth_table'
  | 'logic_gate'
  // Phase 6 — advanced math
  | 'unit_circle'
  | 'transformation'
  | 'inequality_graph'
  // Phase 7 — ELA / social
  | 'sentence_diagram'
  | 'argument_structure'
  | 'historical_timeline'
  | 'government_branches'
  // Phase 8 — general organizers
  | 'comparison_table'
  | 't_chart'
  | 'kwl_chart'
  | 'frayer_model'
  | 'hierarchy_pyramid'
  // Phase 9 — economics (AP Plans Initiative; see project_ap_plans_initiative.md)
  | 'production_possibilities'
  | 'business_cycle'
  | 'aggregate_demand_supply'
  | 'money_market'
  | 'loanable_funds'
  | 'phillips_curve'
  | 'foreign_exchange_market'
  // Phase 10 — calculus (AP Calc BC)
  | 'riemann_sum'
  | 'slope_field'
  | 'parametric_curve'
  | 'polar_graph'
  | 'taylor_polynomial_overlay'
  // Phase 11 — statistics (AP Statistics)
  | 'histogram'
  | 'normal_curve'
  | 'scatterplot_regression'
  // Phase 12 — environmental / demographic (AP Env Sci, AP Human Geo, AP Macro)
  | 'population_pyramid'
  | 'climate_diagram'
  // Phase 13 — biogeochemical cycles + labeled anatomy (AP Env Sci, AP Psych/Bio)
  | 'nutrient_cycle'
  | 'neuron_diagram'
  | 'brain_regions'
  // Phase 14 — conic sections (Algebra 2 / Precalc / AP Calc / JEE)
  | 'conic_sections'
  // Phase 15 — 3D / spatial figures (AP Calc, geometry, IB/JEE, chem, physics)
  | 'solid_of_revolution';

/** Metadata for a single kind. Drives the brain's tool surface. */
export interface DiagramKindMeta {
  kind: DiagramKindId;
  /** Human-readable name shown in catalog listings (not user-facing). */
  displayName: string;
  /** When to reach for this kind. One sentence, no examples. */
  whenToUse: string;
  /** Subject filter — used when the brain restricts the catalog per session. */
  subjects: Array<'math' | 'physics' | 'chemistry' | 'biology' | 'earth' | 'cs' | 'ela' | 'social' | 'general'>;
  /** Grade range (inclusive). Use 'k' for kindergarten, 1-12 for grades.
   *  The brain restricts candidates by this band per session. */
  grades: { from: 'k' | number; to: number };
  /** Concise schema description for the param object — read by the
   *  brain when deciding whether this kind fits. NO examples, NO prose
   *  — just field names and what they accept. */
  paramSchema: string;
}

/** What the brain emits — kind + opaque params. The solver narrows
 *  params against its kind-specific shape and rejects invalid input. */
export interface DiagramSpec {
  kind: DiagramKindId;
  params: Record<string, unknown>;
}

/** Solver result — a kind-specific normalized figure ready for the
 *  renderer. Each kind defines its own NormalizedFigure shape; the
 *  renderer for that kind is the ONLY consumer, so we don't try to
 *  unify across kinds. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NormalizedFigure = any;

/** A solver validates the brain's params, fills defaults, computes any
 *  derived geometry, and either returns a normalized figure or throws
 *  with a human-readable reason that the orchestrator turns into a
 *  validator-feedback retry signal. */
export type SolverFn = (params: Record<string, unknown>) => NormalizedFigure;
