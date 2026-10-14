/**
 * The objectives of the T4 drawn items, by writing group, with the number of
 * items each gets (about 2–3: quality over count). Only objectives whose task
 * is naturally to plot points, graph a line through two points, or show ONE
 * interval / ray on a number line — the three drawn kinds of contract v1.22.0.
 *
 * Older subjects: seed LO ids. Newer subjects (Algebra II, Precalculus,
 * AP Calculus AB): `gen-<uuid>.lo-N` objective ids of the generated course
 * plans (practice-expand-2026-10-12 packs).
 */
export const T4_GROUPS: Record<string, Record<string, number>> = {
  alg1: {
    'alg1.one-variable-inequalities': 3,
    'alg1.compound-inequalities': 3,
    'alg1.absolute-value': 2,
    'alg1.slope-intercept-form': 3,
    'alg1.point-slope-standard-form': 3,
    'alg1.parallel-perpendicular': 2,
    'alg1.relations-functions': 2,
    'alg1.systems-by-graphing': 2,
    'alg1.quadratic-graphs-vertex': 2,
    'alg1.exponential-functions': 2,
  },
  geom: {
    'geom.segments-distance-midpoint': 2,
    'geom.slopes-parallel-perpendicular': 3,
    'geom.translations': 2,
    'geom.reflections': 3,
    'geom.rotations': 3,
    'geom.dilations-scale-factor': 2,
    'geom.compositions-symmetry': 2,
    'geom.area-polygons': 2,
    'geom.parallelograms': 2,
    'geom.circle-equations': 2,
  },
  'calcbc-stats': {
    'apcalcbc.power-series': 3,
    'apcalcbc.linearization': 2,
    'apcalcbc.derivative-definition': 2,
    'apcalcbc.first-derivative-analysis': 2,
    'apcalcbc.concavity-second-derivative': 2,
    'apcalcbc.polar-coordinates': 2,
    'apcalcbc.parametric': 2,
    'apstats.scatterplots': 2,
    'apstats.residuals': 2,
    'apstats.linear-regression': 2,
  },
  alg2: {
    'gen-aaee386b-351d-405b-a040-769c7eeec0ac.lo-3': 2, // compound inequalities and interval notation (absolute value unit)
    'gen-aaee386b-351d-405b-a040-769c7eeec0ac.lo-4': 3, // absolute value inequalities
    'gen-cf736403-4ea0-4840-b62a-ae1c3e510c78.lo-6': 2, // vertex and axis of symmetry from any form
    'gen-cf736403-4ea0-4840-b62a-ae1c3e510c78.lo-7': 2, // x- and y-intercepts from any form
    'gen-ceed2913-7343-4e20-a623-a508a9965d5b.lo-2': 2, // domain of square root functions
    'gen-ceed2913-7343-4e20-a623-a508a9965d5b.lo-4': 2, // translations of square root functions
    'gen-bb35e95e-18e8-4ab2-9730-381a1befe991.lo-3': 2, // vertex from focus and directrix
    'gen-739c0ae5-de9d-428b-8319-f488ff6c76e5.lo-2': 2, // corner points of a feasible region
    'gen-e1dd6556-d228-4d1f-b3b4-ec1038fc7ee0.lo-3': 2, // solving linear systems (graphing)
  },
  precalc: {
    'gen-4ecdb7b8-a064-4200-992c-ed7522798e81.lo-3': 3, // polynomial / rational inequality solution sets
    'gen-61afb8a2-e9b4-419e-881e-64aaac359d87.lo-3': 2, // domain from an equation
    'gen-a3a0849a-4fde-4fb4-aeed-8d3cca7873c8.lo-6': 2, // domain of a composite
    'gen-2515225c-cc4c-4136-a844-d07fbebae2a4.lo-1': 2, // complex numbers as points
    'gen-ea46bc2b-6a29-40ed-9938-19abb8ba2a0e.lo-3': 2, // polar → rectangular points
    'gen-2753d0ea-f0fb-41e7-b6eb-2333667f9831.lo-3': 2, // hyperbola vertices
    'gen-85ec2ae2-32e8-4279-9381-99017036f227.lo-2': 2, // ellipse centre
    'gen-20c673c2-3b4a-41c3-bfab-a2c77b2b5064.lo-5': 2, // nonlinear systems: intersection points
  },
  calcab: {
    'gen-3c586ec0-3b8e-4ce2-99f0-8d22c6497083.lo-4': 3, // tangent line equations
    'gen-01e222df-db1e-4e6b-ac3b-4ce3a0269f5e.lo-2': 2, // local linearization
    'gen-5fec1ce2-0c3e-40e0-b82d-26fa9f2c5db7.lo-2': 2, // increasing / decreasing intervals
    'gen-d1d61003-4372-4cee-b061-aac17d32d42f.lo-2': 2, // concave up
    'gen-d1d61003-4372-4cee-b061-aac17d32d42f.lo-3': 2, // concave down
  },
};

/** Every objective id → its group. */
export const T4_OBJECTIVE_GROUP: Record<string, string> = Object.fromEntries(
  Object.entries(T4_GROUPS).flatMap(([g, los]) => Object.keys(los).map((lo) => [lo, g])),
);
