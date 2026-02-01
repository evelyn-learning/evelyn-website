/**
 * AP Physics: Fluid Mechanics - Equations
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { Equation } from '../../types';

export const equations: Equation[] = [
  {
    id: 'density-definition',
    name: 'Density Definition',
    latex: '\\rho = \\frac{m}{V}',
    description: 'Density equals mass divided by volume',

    variables: [
      { symbol: 'ρ', name: 'Density', description: 'Mass per unit volume', unit: 'kg/m³' },
      { symbol: 'm', name: 'Mass', description: 'Total mass of substance', unit: 'kg' },
      { symbol: 'V', name: 'Volume', description: 'Total volume occupied', unit: 'm³' },
    ],

    useWhen: [
      'Finding density from mass and volume',
      'Finding mass when density and volume are known',
      'Finding volume when density and mass are known',
      'Determining if an object will float or sink',
    ],

    limitations: [
      'Assumes uniform density throughout the material',
      'Temperature and pressure can affect density',
    ],

    commonMistakes: [
      'Confusing density with mass',
      'Using inconsistent units (mixing g/cm³ with kg/m³)',
      'Forgetting that density is an intensive property (doesn\'t depend on amount)',
    ],
  },

  {
    id: 'pressure-definition',
    name: 'Pressure Definition',
    latex: 'p = \\frac{F}{A}',
    description: 'Pressure equals force perpendicular to a surface divided by the area of that surface',

    variables: [
      { symbol: 'p', name: 'Pressure', description: 'Force per unit area', unit: 'Pa (N/m²)' },
      { symbol: 'F', name: 'Force', description: 'Normal force on surface', unit: 'N' },
      { symbol: 'A', name: 'Area', description: 'Surface area over which force acts', unit: 'm²' },
    ],

    useWhen: [
      'Finding pressure from force and area',
      'Comparing pressure in different situations',
      'Understanding how force is distributed',
    ],

    limitations: [
      'Force must be perpendicular (normal) to the surface',
      'Assumes uniform pressure distribution over the area',
    ],

    commonMistakes: [
      'Confusing pressure with force',
      'Forgetting to convert area units (cm² to m²)',
      'Using the wrong force direction (must be normal to surface)',
    ],
  },

  {
    id: 'pressure-depth',
    name: 'Pressure at Depth',
    latex: 'p = p_0 + \\rho g h',
    description: 'Absolute pressure at depth h in a fluid equals surface pressure plus the weight of fluid column per unit area',

    variables: [
      { symbol: 'p', name: 'Absolute pressure', description: 'Total pressure at depth h', unit: 'Pa' },
      { symbol: 'p₀', name: 'Surface pressure', description: 'Pressure at the fluid surface (usually atmospheric)', unit: 'Pa' },
      { symbol: 'ρ', name: 'Fluid density', description: 'Density of the fluid', unit: 'kg/m³' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
      { symbol: 'h', name: 'Depth', description: 'Vertical distance below the surface', unit: 'm' },
    ],

    useWhen: [
      'Finding pressure at a depth in a liquid',
      'Calculating pressure difference between two depths',
      'Determining gauge pressure (ρgh) or absolute pressure (p₀ + ρgh)',
    ],

    limitations: [
      'Assumes constant density (incompressible fluid)',
      'Assumes constant gravitational field',
      'Only applies to static (non-moving) fluids',
    ],

    derivation: {
      steps: [
        'Consider a column of fluid of height h and cross-sectional area A',
        'The weight of this column is W = mg = ρVg = ρAhg',
        'The pressure at the bottom due to this weight is F/A = ρAhg/A = ρgh',
        'Add surface pressure: p = p₀ + ρgh',
      ],
    },

    commonMistakes: [
      'Forgetting to add atmospheric pressure (p₀) when calculating absolute pressure',
      'Using depth instead of height (h increases downward)',
      'Using object density instead of fluid density',
      'Thinking pressure depends on container shape (it only depends on depth)',
    ],
  },

  {
    id: 'gauge-pressure',
    name: 'Gauge Pressure',
    latex: 'p_{gauge} = p - p_0 = \\rho g h',
    description: 'Gauge pressure is the pressure relative to atmospheric pressure',

    variables: [
      { symbol: 'p_{gauge}', name: 'Gauge pressure', description: 'Pressure relative to atmosphere', unit: 'Pa' },
      { symbol: 'p', name: 'Absolute pressure', description: 'Total pressure', unit: 'Pa' },
      { symbol: 'p₀', name: 'Atmospheric pressure', description: 'Usually 101,325 Pa', unit: 'Pa' },
    ],

    useWhen: [
      'Measuring tire pressure',
      'Measuring blood pressure',
      'When pressure gauges read zero at atmospheric pressure',
    ],

    limitations: [
      'Gauge pressure can be negative (vacuum)',
      'Must know atmospheric pressure to convert to absolute',
    ],

    commonMistakes: [
      'Confusing gauge and absolute pressure',
      'Forgetting that most gauges read gauge pressure, not absolute',
    ],
  },

  {
    id: 'pascals-principle',
    name: 'Pascal\'s Principle (Hydraulic Systems)',
    latex: '\\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
    description: 'Pressure applied to an enclosed fluid is transmitted undiminished throughout the fluid',

    variables: [
      { symbol: 'F₁', name: 'Input force', description: 'Force applied to small piston', unit: 'N' },
      { symbol: 'A₁', name: 'Input area', description: 'Area of small piston', unit: 'm²' },
      { symbol: 'F₂', name: 'Output force', description: 'Force produced at large piston', unit: 'N' },
      { symbol: 'A₂', name: 'Output area', description: 'Area of large piston', unit: 'm²' },
    ],

    useWhen: [
      'Analyzing hydraulic lifts and brakes',
      'Calculating force multiplication in hydraulic systems',
      'Designing hydraulic machinery',
    ],

    limitations: [
      'Requires incompressible fluid (liquids, not gases)',
      'Assumes no friction or leakage',
      'Work is conserved: d₁/d₂ = A₂/A₁',
    ],

    derivation: {
      steps: [
        'Pressure is the same throughout the fluid: p₁ = p₂',
        'Using p = F/A: F₁/A₁ = F₂/A₂',
        'Rearranging: F₂ = F₁ × (A₂/A₁)',
        'Mechanical advantage = A₂/A₁',
      ],
    },

    commonMistakes: [
      'Thinking hydraulics multiply energy (they multiply force, not work)',
      'Forgetting the distance trade-off (d₁A₁ = d₂A₂)',
      'Applying to compressible fluids like air',
    ],
  },

  {
    id: 'archimedes-principle',
    name: 'Archimedes\' Principle (Buoyant Force)',
    latex: 'F_B = \\rho_{fluid} \\cdot V_{displaced} \\cdot g',
    description: 'The buoyant force equals the weight of the fluid displaced by the object',

    variables: [
      { symbol: 'F_B', name: 'Buoyant force', description: 'Upward force from fluid', unit: 'N' },
      { symbol: 'ρ_{fluid}', name: 'Fluid density', description: 'Density of the surrounding fluid', unit: 'kg/m³' },
      { symbol: 'V_{displaced}', name: 'Displaced volume', description: 'Volume of fluid displaced (= submerged volume of object)', unit: 'm³' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
    ],

    useWhen: [
      'Calculating the buoyant force on a submerged or floating object',
      'Determining if an object will float or sink',
      'Finding the fraction of a floating object that is submerged',
    ],

    limitations: [
      'Object must be in a fluid',
      'For floating objects, displaced volume < total object volume',
      'Assumes uniform fluid density',
    ],

    derivation: {
      steps: [
        'Buoyancy comes from pressure difference between top and bottom of object',
        'Pressure at bottom > pressure at top (pressure increases with depth)',
        'Net upward force = (p_bottom - p_top) × A = ρ_fluid × g × h × A',
        'Since h × A = Volume displaced: F_B = ρ_fluid × g × V_displaced',
      ],
    },

    commonMistakes: [
      'Using object density instead of fluid density',
      'Using total object volume instead of displaced volume for floating objects',
      'Forgetting that buoyant force depends on fluid density, not object density',
    ],
  },

  {
    id: 'floating-condition',
    name: 'Floating Condition',
    latex: '\\frac{V_{submerged}}{V_{object}} = \\frac{\\rho_{object}}{\\rho_{fluid}}',
    description: 'For a floating object, the fraction submerged equals the ratio of object to fluid density',

    variables: [
      { symbol: 'V_{submerged}', name: 'Submerged volume', description: 'Volume of object below fluid surface', unit: 'm³' },
      { symbol: 'V_{object}', name: 'Total volume', description: 'Total volume of the object', unit: 'm³' },
      { symbol: 'ρ_{object}', name: 'Object density', description: 'Average density of the object', unit: 'kg/m³' },
      { symbol: 'ρ_{fluid}', name: 'Fluid density', description: 'Density of the surrounding fluid', unit: 'kg/m³' },
    ],

    useWhen: [
      'Finding what fraction of an object is submerged when floating',
      'Determining object density from floating behavior',
      'Predicting if an object will float (ρ_object < ρ_fluid)',
    ],

    derivation: {
      steps: [
        'For floating: weight = buoyant force',
        'ρ_object × V_object × g = ρ_fluid × V_submerged × g',
        'Rearranging: V_submerged/V_object = ρ_object/ρ_fluid',
      ],
    },

    limitations: [
      'Only applies to floating objects (ρ_object < ρ_fluid)',
      'Assumes object is in equilibrium',
    ],

    commonMistakes: [
      'Using this for sinking objects',
      'Confusing which density goes in numerator vs denominator',
    ],
  },

  {
    id: 'continuity-equation',
    name: 'Continuity Equation',
    latex: 'A_1 v_1 = A_2 v_2',
    description: 'For incompressible fluid flow, the volume flow rate is constant: area times velocity is the same everywhere',

    variables: [
      { symbol: 'A₁', name: 'Cross-sectional area 1', description: 'Area at position 1', unit: 'm²' },
      { symbol: 'v₁', name: 'Velocity 1', description: 'Fluid velocity at position 1', unit: 'm/s' },
      { symbol: 'A₂', name: 'Cross-sectional area 2', description: 'Area at position 2', unit: 'm²' },
      { symbol: 'v₂', name: 'Velocity 2', description: 'Fluid velocity at position 2', unit: 'm/s' },
    ],

    useWhen: [
      'Finding velocity changes when pipe diameter changes',
      'Calculating flow rate through pipes',
      'Analyzing water systems, blood flow, etc.',
    ],

    limitations: [
      'Requires incompressible fluid (constant density)',
      'Assumes steady flow (not changing with time)',
      'Assumes no fluid is added or removed between points',
    ],

    derivation: {
      steps: [
        'Volume flow rate Q = volume/time = Av',
        'Mass conservation: mass in = mass out',
        'For incompressible fluid: ρA₁v₁ = ρA₂v₂',
        'Since ρ is constant: A₁v₁ = A₂v₂',
      ],
    },

    commonMistakes: [
      'Thinking fluid slows down in narrow sections (it speeds up!)',
      'Confusing flow rate (m³/s) with velocity (m/s)',
      'Forgetting to square the radius when calculating area',
    ],
  },

  {
    id: 'volume-flow-rate',
    name: 'Volume Flow Rate',
    latex: 'Q = A v = \\frac{V}{t}',
    description: 'Volume flow rate is the volume of fluid passing a point per unit time',

    variables: [
      { symbol: 'Q', name: 'Volume flow rate', description: 'Volume per unit time', unit: 'm³/s' },
      { symbol: 'A', name: 'Cross-sectional area', description: 'Area perpendicular to flow', unit: 'm²' },
      { symbol: 'v', name: 'Fluid velocity', description: 'Speed of fluid flow', unit: 'm/s' },
      { symbol: 'V', name: 'Volume', description: 'Volume of fluid', unit: 'm³' },
      { symbol: 't', name: 'Time', description: 'Time interval', unit: 's' },
    ],

    useWhen: [
      'Calculating how much fluid passes a point per second',
      'Finding time to fill a container',
      'Converting between flow rate and velocity',
    ],

    limitations: [
      'Assumes uniform velocity across the cross-section',
      'Real flows have velocity profiles (faster in center, slower at walls)',
    ],

    commonMistakes: [
      'Confusing volume flow rate with mass flow rate',
      'Forgetting that Q is constant in a continuous flow system',
    ],
  },

  {
    id: 'bernoullis-equation',
    name: 'Bernoulli\'s Equation',
    latex: 'p_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g y_1 = p_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g y_2',
    description: 'For steady, incompressible, frictionless flow, the sum of pressure, kinetic energy per volume, and potential energy per volume is constant',

    variables: [
      { symbol: 'p', name: 'Static pressure', description: 'Pressure at a point in the fluid', unit: 'Pa' },
      { symbol: 'ρ', name: 'Fluid density', description: 'Density of the fluid', unit: 'kg/m³' },
      { symbol: 'v', name: 'Fluid velocity', description: 'Speed of fluid flow', unit: 'm/s' },
      { symbol: 'y', name: 'Height', description: 'Vertical position above reference', unit: 'm' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
    ],

    useWhen: [
      'Relating pressure and velocity in moving fluids',
      'Explaining lift on airplane wings',
      'Analyzing flow through pipes with height changes',
      'Understanding carburetors, atomizers, and similar devices',
    ],

    limitations: [
      'Requires incompressible fluid (constant density)',
      'Assumes no viscosity (frictionless flow)',
      'Must be steady flow (not changing with time)',
      'Only valid along a streamline',
    ],

    derivation: {
      steps: [
        'Apply work-energy theorem to a fluid element',
        'Work done by pressure = pAΔx = pΔV',
        'Change in kinetic energy = ½ρΔV(v₂² - v₁²)',
        'Change in potential energy = ρgΔV(y₂ - y₁)',
        'Energy conservation gives Bernoulli\'s equation',
      ],
    },

    commonMistakes: [
      'Thinking faster flow means higher pressure (it\'s the opposite!)',
      'Applying to viscous fluids without corrections',
      'Forgetting the height terms when both points are at different elevations',
      'Using total pressure instead of static pressure',
    ],

    graphicalMeaning: {
      description: 'The sum p + ½ρv² + ρgy is constant along a streamline. This represents energy per unit volume.',
      whiteboard: {
        action: 'showDiagram',
        type: 'pipe-flow',
        params: { showBernoulli: true },
      },
    },
  },

  {
    id: 'bernoullis-simplified',
    name: 'Bernoulli\'s Equation (Horizontal Flow)',
    latex: 'p_1 + \\frac{1}{2}\\rho v_1^2 = p_2 + \\frac{1}{2}\\rho v_2^2',
    description: 'For horizontal flow (same height), Bernoulli\'s equation simplifies to show the trade-off between pressure and velocity',

    variables: [
      { symbol: 'p', name: 'Static pressure', description: 'Pressure at a point', unit: 'Pa' },
      { symbol: 'ρ', name: 'Fluid density', description: 'Density of the fluid', unit: 'kg/m³' },
      { symbol: 'v', name: 'Fluid velocity', description: 'Speed of fluid flow', unit: 'm/s' },
    ],

    useWhen: [
      'Flow is horizontal (no height change)',
      'Finding pressure change when velocity changes',
      'Analyzing venturi meters and pitot tubes',
    ],

    limitations: [
      'Only for horizontal flow (y₁ = y₂)',
      'Same limitations as full Bernoulli equation',
    ],

    derivation: {
      steps: [
        'Start with full Bernoulli: p₁ + ½ρv₁² + ρgy₁ = p₂ + ½ρv₂² + ρgy₂',
        'For horizontal flow: y₁ = y₂',
        'The ρgy terms cancel: p₁ + ½ρv₁² = p₂ + ½ρv₂²',
        'Rearranging: p₁ - p₂ = ½ρ(v₂² - v₁²)',
      ],
    },

    commonMistakes: [
      'Using this when there is a significant height difference',
      'Forgetting the factor of ½ in the kinetic energy terms',
    ],
  },

  {
    id: 'torricellis-law',
    name: 'Torricelli\'s Law',
    latex: 'v = \\sqrt{2gh}',
    description: 'The speed of fluid flowing out of an opening is the same as the speed it would have falling freely from the surface height',

    variables: [
      { symbol: 'v', name: 'Exit velocity', description: 'Speed of fluid leaving the opening', unit: 'm/s' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
      { symbol: 'h', name: 'Height', description: 'Vertical distance from surface to opening', unit: 'm' },
    ],

    useWhen: [
      'Finding the speed of water leaving a tank through a hole',
      'Calculating how fast a container drains',
      'Designing fountains and water systems',
    ],

    limitations: [
      'Assumes opening is small compared to tank (surface velocity ≈ 0)',
      'Ignores viscosity and turbulence',
      'Both opening and surface must be at atmospheric pressure',
    ],

    derivation: {
      steps: [
        'Apply Bernoulli between surface (point 1) and opening (point 2)',
        'At surface: v₁ ≈ 0, p₁ = p₀, y₁ = h',
        'At opening: v₂ = v, p₂ = p₀, y₂ = 0',
        'Bernoulli: p₀ + 0 + ρgh = p₀ + ½ρv² + 0',
        'Simplifying: ρgh = ½ρv² → v = √(2gh)',
      ],
    },

    commonMistakes: [
      'Forgetting this is the same as free fall velocity from height h',
      'Using when the opening is not at atmospheric pressure',
      'Applying when surface is dropping quickly (v₁ ≠ 0)',
    ],
  },

  {
    id: 'poiseuilles-law',
    name: 'Poiseuille\'s Law',
    latex: 'Q = \\frac{\\pi r^4 \\Delta p}{8 \\eta L}',
    description: 'For viscous flow in a cylindrical pipe, the volume flow rate depends on the fourth power of the radius',

    variables: [
      { symbol: 'Q', name: 'Volume flow rate', description: 'Volume per unit time', unit: 'm³/s' },
      { symbol: 'r', name: 'Pipe radius', description: 'Inner radius of the pipe', unit: 'm' },
      { symbol: 'Δp', name: 'Pressure difference', description: 'Pressure drop along the pipe', unit: 'Pa' },
      { symbol: 'η', name: 'Dynamic viscosity', description: 'Fluid viscosity', unit: 'Pa·s' },
      { symbol: 'L', name: 'Pipe length', description: 'Length of the pipe', unit: 'm' },
    ],

    useWhen: [
      'Analyzing viscous flow through pipes',
      'Understanding blood flow in arteries',
      'Designing piping systems',
    ],

    limitations: [
      'Only for laminar (smooth) flow',
      'Requires steady, fully developed flow',
      'Fluid must be Newtonian (constant viscosity)',
      'Pipe must be cylindrical with constant radius',
    ],

    derivation: {
      steps: [
        'Solve the Navier-Stokes equations for flow in a cylinder',
        'Apply no-slip boundary condition at walls',
        'Integrate the parabolic velocity profile',
        'Result: Q = πr⁴Δp / (8ηL)',
      ],
    },

    commonMistakes: [
      'Forgetting the r⁴ dependence (doubling radius increases flow by 16×!)',
      'Applying to turbulent flow',
      'Confusing with Bernoulli equation (Poiseuille includes viscosity)',
    ],
  },

  {
    id: 'reynolds-number',
    name: 'Reynolds Number',
    latex: 'Re = \\frac{\\rho v D}{\\eta} = \\frac{v D}{\\nu}',
    description: 'A dimensionless number that predicts whether flow will be laminar or turbulent',

    variables: [
      { symbol: 'Re', name: 'Reynolds number', description: 'Ratio of inertial to viscous forces', unit: 'dimensionless' },
      { symbol: 'ρ', name: 'Fluid density', description: 'Density of the fluid', unit: 'kg/m³' },
      { symbol: 'v', name: 'Flow velocity', description: 'Average fluid speed', unit: 'm/s' },
      { symbol: 'D', name: 'Characteristic length', description: 'Typically pipe diameter', unit: 'm' },
      { symbol: 'η', name: 'Dynamic viscosity', description: 'Fluid viscosity', unit: 'Pa·s' },
      { symbol: 'ν', name: 'Kinematic viscosity', description: 'η/ρ', unit: 'm²/s' },
    ],

    useWhen: [
      'Predicting laminar vs turbulent flow',
      'Scaling fluid experiments',
      'Designing pipes and channels',
    ],

    limitations: [
      'Critical value depends on geometry (≈2300 for pipe flow)',
      'Transition region between laminar and turbulent is not sharp',
    ],

    commonMistakes: [
      'Using radius instead of diameter',
      'Forgetting that Re has no units',
      'Not recognizing that high Re → turbulent, low Re → laminar',
    ],
  },
];
