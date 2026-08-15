/**
 * AP Physics: Fluid Mechanics - Practice Problems
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { Problem } from '../../types';

export const problems: Problem[] = [
  // ============================================================================
  // DENSITY PROBLEMS
  // ============================================================================
  {
    id: 'density-basic-1',
    source: 'curated',
    concepts: ['density'],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 2,

    title: 'Calculating Density',
    statement: 'A metal cube has sides of 4 cm and a mass of 500 g. What is the density of the metal?',

    givenValues: [
      { symbol: 's', value: 4, unit: 'cm', description: 'Side length of cube' },
      { symbol: 'm', value: 500, unit: 'g', description: 'Mass' },
    ],
    unknowns: [
      { symbol: 'ρ', description: 'Density', unit: 'g/cm³' },
    ],

    solution: {
      approach: 'Calculate volume from side length, then use ρ = m/V.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate the volume of the cube',
          equation: 'V = s^3 = (4\\text{ cm})^3 = 64\\text{ cm}^3',
        },
        {
          stepNumber: 2,
          description: 'Calculate density using ρ = m/V',
          substitution: '\\rho = \\frac{500\\text{ g}}{64\\text{ cm}^3}',
          result: '\\rho = 7.81\\text{ g/cm}^3',
        },
      ],
      finalAnswer: { value: 7.81, unit: 'g/cm³' },
      conceptualAnswer: 'This density is close to iron (7.87 g/cm³), suggesting the metal might be iron or steel.',
    },

    hints: [
      { level: 1, hint: 'First find the volume of the cube.' },
      { level: 2, hint: 'Volume of a cube = side³' },
      { level: 3, hint: 'Then use ρ = m/V' },
    ],

    tags: ['density', 'basic', 'calculation'],
  },

  {
    id: 'density-float-sink-1',
    source: 'curated',
    concepts: ['density', 'buoyancy'],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 3,

    title: 'Float or Sink?',
    statement: 'An object has a mass of 150 g and a volume of 200 cm³. Will it float or sink in water (ρ = 1.0 g/cm³)? What fraction of its volume will be submerged if it floats?',

    givenValues: [
      { symbol: 'm', value: 150, unit: 'g', description: 'Mass of object' },
      { symbol: 'V', value: 200, unit: 'cm³', description: 'Volume of object' },
      { symbol: 'ρ_w', value: 1.0, unit: 'g/cm³', description: 'Density of water' },
    ],

    solution: {
      approach: 'Calculate object density and compare to water density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate object density',
          equation: '\\rho_{object} = \\frac{m}{V} = \\frac{150\\text{ g}}{200\\text{ cm}^3} = 0.75\\text{ g/cm}^3',
        },
        {
          stepNumber: 2,
          description: 'Compare to water density',
          explanation: 'Since ρ_object (0.75) < ρ_water (1.0), the object floats.',
        },
        {
          stepNumber: 3,
          description: 'Calculate fraction submerged',
          equation: '\\frac{V_{sub}}{V_{total}} = \\frac{\\rho_{object}}{\\rho_{water}} = \\frac{0.75}{1.0} = 0.75',
          result: '75\\% \\text{ of the object is submerged}',
        },
      ],
      finalAnswer: { text: 'Floats with 75% submerged' },
    },

    hints: [
      { level: 1, hint: 'First calculate the object\'s density.' },
      { level: 2, hint: 'Compare object density to water density to determine float/sink.' },
      { level: 3, hint: 'Fraction submerged = ρ_object / ρ_fluid' },
    ],

    tags: ['density', 'floating', 'buoyancy'],
  },

  // ============================================================================
  // PRESSURE PROBLEMS
  // ============================================================================
  {
    id: 'pressure-depth-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14',
    concepts: ['pressure-depth'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Pressure at Depth',
    statement: 'A scuba diver descends to a depth of 15 m in the ocean (ρ = 1025 kg/m³). What is the absolute pressure at this depth? What is the gauge pressure? (Use g = 10 m/s², p₀ = 101 kPa)',

    givenValues: [
      { symbol: 'h', value: 15, unit: 'm', description: 'Depth' },
      { symbol: 'ρ', value: 1025, unit: 'kg/m³', description: 'Seawater density' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
      { symbol: 'p_0', value: 101000, unit: 'Pa', description: 'Atmospheric pressure' },
    ],
    unknowns: [
      { symbol: 'p', description: 'Absolute pressure', unit: 'Pa' },
      { symbol: 'p_{gauge}', description: 'Gauge pressure', unit: 'Pa' },
    ],

    solution: {
      approach: 'Use p = p₀ + ρgh for absolute pressure, and p_gauge = ρgh.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate gauge pressure',
          equation: 'p_{gauge} = \\rho g h = (1025)(10)(15) = 153,750\\text{ Pa}',
        },
        {
          stepNumber: 2,
          description: 'Calculate absolute pressure',
          equation: 'p = p_0 + \\rho g h = 101,000 + 153,750 = 254,750\\text{ Pa}',
          result: 'p \\approx 255\\text{ kPa} \\approx 2.5\\text{ atm}',
        },
      ],
      finalAnswer: { text: 'Absolute: 255 kPa (2.5 atm), Gauge: 154 kPa' },
    },

    hints: [
      { level: 1, hint: 'Use the pressure-depth equation: p = p₀ + ρgh' },
      { level: 2, hint: 'Gauge pressure is just the ρgh part.' },
      { level: 3, hint: 'Remember 1 atm ≈ 101 kPa' },
    ],

    tags: ['pressure', 'depth', 'diving'],
  },

  {
    id: 'pressure-comparison-1',
    source: 'curated',
    concepts: ['pressure'],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 4,

    title: 'Pressure Comparison',
    statement: 'A 70 kg person stands on one foot (area 200 cm²). An elephant of mass 5000 kg stands on four feet (total area 2000 cm²). Who exerts more pressure on the ground?',

    givenValues: [
      { symbol: 'm_p', value: 70, unit: 'kg', description: 'Person\'s mass' },
      { symbol: 'A_p', value: 200, unit: 'cm²', description: 'One foot area' },
      { symbol: 'm_e', value: 5000, unit: 'kg', description: 'Elephant\'s mass' },
      { symbol: 'A_e', value: 2000, unit: 'cm²', description: 'Total foot area' },
    ],

    solution: {
      approach: 'Calculate pressure for each using p = F/A = mg/A.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate person\'s pressure',
          equation: 'p_p = \\frac{m_p g}{A_p} = \\frac{70 \\times 10}{0.02} = 35,000\\text{ Pa}',
        },
        {
          stepNumber: 2,
          description: 'Calculate elephant\'s pressure',
          equation: 'p_e = \\frac{m_e g}{A_e} = \\frac{5000 \\times 10}{0.2} = 250,000\\text{ Pa}',
        },
        {
          stepNumber: 3,
          description: 'Compare',
          result: 'The elephant exerts about 7× more pressure',
        },
      ],
      finalAnswer: { text: 'The elephant exerts more pressure (250 kPa vs 35 kPa)' },
      conceptualAnswer: 'Despite the elephant being much heavier, both have surprisingly high pressures. This is why both can damage soft surfaces.',
    },

    hints: [
      { level: 1, hint: 'Convert areas to m² (divide cm² by 10,000).' },
      { level: 2, hint: 'Use p = mg/A for each' },
      { level: 3, hint: 'Compare the two pressure values' },
    ],

    tags: ['pressure', 'comparison', 'real-world'],
  },

  // ============================================================================
  // PASCAL'S PRINCIPLE PROBLEMS
  // ============================================================================
  {
    id: 'hydraulic-lift-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14',
    concepts: ['pascals-principle'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,

    title: 'Hydraulic Car Lift',
    statement: 'A hydraulic car lift has a small piston with radius 2 cm and a large piston with radius 20 cm. (a) What force must be applied to the small piston to lift a 1500 kg car? (b) If the small piston is pushed down 50 cm, how much does the car rise?',

    givenValues: [
      { symbol: 'r_1', value: 2, unit: 'cm', description: 'Small piston radius' },
      { symbol: 'r_2', value: 20, unit: 'cm', description: 'Large piston radius' },
      { symbol: 'm', value: 1500, unit: 'kg', description: 'Car mass' },
    ],
    unknowns: [
      { symbol: 'F_1', description: 'Force on small piston', unit: 'N' },
      { symbol: 'd_2', description: 'Distance car rises', unit: 'cm' },
    ],

    solution: {
      approach: 'Use Pascal\'s principle: F₁/A₁ = F₂/A₂, and volume conservation: A₁d₁ = A₂d₂.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate the area ratio',
          equation: '\\frac{A_2}{A_1} = \\frac{\\pi r_2^2}{\\pi r_1^2} = \\frac{r_2^2}{r_1^2} = \\frac{(20)^2}{(2)^2} = 100',
        },
        {
          stepNumber: 2,
          description: 'Calculate weight of car',
          equation: 'F_2 = mg = 1500 \\times 10 = 15,000\\text{ N}',
        },
        {
          stepNumber: 3,
          description: 'Find force on small piston using F₁/A₁ = F₂/A₂',
          equation: 'F_1 = F_2 \\times \\frac{A_1}{A_2} = 15,000 \\times \\frac{1}{100} = 150\\text{ N}',
        },
        {
          stepNumber: 4,
          description: 'Find distance car rises using volume conservation',
          equation: 'd_2 = d_1 \\times \\frac{A_1}{A_2} = 50 \\times \\frac{1}{100} = 0.5\\text{ cm}',
        },
      ],
      finalAnswer: { text: '(a) 150 N, (b) 0.5 cm' },
      conceptualAnswer: 'The mechanical advantage is 100 - you apply only 150 N to lift a 15,000 N car! But you must push 50 cm to raise the car just 0.5 cm.',
    },

    hints: [
      { level: 1, hint: 'The area ratio equals the radius ratio squared.' },
      { level: 2, hint: 'Use F₁/A₁ = F₂/A₂ (Pascal\'s principle)' },
      { level: 3, hint: 'Volume is conserved: A₁d₁ = A₂d₂' },
    ],

    problemSpecificErrors: [
      {
        error: 'Forgetting to square the radii for area ratio',
        howToDetect: 'Gets area ratio of 10 instead of 100',
        feedback: 'Area = πr². When comparing areas, you need (r₂/r₁)², not just r₂/r₁.',
      },
    ],

    tags: ['hydraulics', 'pascal', 'mechanical-advantage'],
  },

  // ============================================================================
  // BUOYANCY PROBLEMS
  // ============================================================================
  {
    id: 'buoyancy-force-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14',
    concepts: ['buoyancy'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Buoyant Force Calculation',
    statement: 'A cube with 10 cm sides is fully submerged in water. What is the buoyant force on the cube? (ρ_water = 1000 kg/m³, g = 10 m/s²)',

    givenValues: [
      { symbol: 's', value: 10, unit: 'cm', description: 'Side length' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'Water density' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'F_B', description: 'Buoyant force', unit: 'N' },
    ],

    solution: {
      approach: 'Use Archimedes\' principle: F_B = ρ_fluid × g × V_displaced.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate volume in m³',
          equation: 'V = (0.10\\text{ m})^3 = 0.001\\text{ m}^3 = 1\\text{ L}',
        },
        {
          stepNumber: 2,
          description: 'Calculate buoyant force',
          equation: 'F_B = \\rho g V = (1000)(10)(0.001) = 10\\text{ N}',
        },
      ],
      finalAnswer: { value: 10, unit: 'N' },
      conceptualAnswer: 'This equals the weight of 1 kg of water - exactly the mass of water displaced by the 1 L cube.',
    },

    hints: [
      { level: 1, hint: 'First convert the volume to m³.' },
      { level: 2, hint: '10 cm = 0.1 m, so V = (0.1)³ m³' },
      { level: 3, hint: 'Apply F_B = ρgV' },
    ],

    tags: ['buoyancy', 'archimedes', 'basic'],
  },

  {
    id: 'buoyancy-apparent-weight-1',
    source: 'curated',
    concepts: ['buoyancy'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Apparent Weight in Water',
    statement: 'A gold crown has a mass of 5.0 kg. When submerged in water, it has an apparent weight of 46.7 N. Is the crown pure gold? (ρ_gold = 19,300 kg/m³, ρ_water = 1000 kg/m³, g = 10 m/s²)',

    givenValues: [
      { symbol: 'm', value: 5.0, unit: 'kg', description: 'Crown mass' },
      { symbol: 'W_{app}', value: 46.7, unit: 'N', description: 'Apparent weight in water' },
      { symbol: 'ρ_{gold}', value: 19300, unit: 'kg/m³', description: 'Gold density' },
      { symbol: 'ρ_w', value: 1000, unit: 'kg/m³', description: 'Water density' },
    ],

    solution: {
      approach: 'Find actual volume from buoyant force, then calculate density and compare to gold.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate actual weight',
          equation: 'W = mg = 5.0 \\times 10 = 50\\text{ N}',
        },
        {
          stepNumber: 2,
          description: 'Calculate buoyant force',
          equation: 'F_B = W - W_{app} = 50 - 46.7 = 3.3\\text{ N}',
        },
        {
          stepNumber: 3,
          description: 'Find volume from buoyant force',
          equation: 'V = \\frac{F_B}{\\rho_w g} = \\frac{3.3}{1000 \\times 10} = 3.3 \\times 10^{-4}\\text{ m}^3',
        },
        {
          stepNumber: 4,
          description: 'Calculate crown\'s density',
          equation: '\\rho = \\frac{m}{V} = \\frac{5.0}{3.3 \\times 10^{-4}} = 15,150\\text{ kg/m}^3',
        },
        {
          stepNumber: 5,
          description: 'Compare to gold density',
          result: '15,150 < 19,300 \\Rightarrow \\text{Not pure gold!}',
        },
      ],
      finalAnswer: { text: 'No, the crown is not pure gold (ρ = 15,150 kg/m³ < 19,300 kg/m³)' },
      conceptualAnswer: 'This is the legendary test Archimedes used to check if King Hiero\'s crown was pure gold!',
    },

    hints: [
      { level: 1, hint: 'Apparent weight = actual weight - buoyant force' },
      { level: 2, hint: 'Use the buoyant force to find the volume' },
      { level: 3, hint: 'Then calculate density = m/V and compare to gold' },
    ],

    tags: ['buoyancy', 'archimedes', 'historical'],
  },

  // ============================================================================
  // CONTINUITY PROBLEMS
  // ============================================================================
  {
    id: 'continuity-pipe-1',
    source: 'curated',
    concepts: ['continuity'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Water Pipe Flow',
    statement: 'Water flows through a pipe at 2 m/s where the radius is 5 cm. The pipe narrows to a radius of 2 cm. What is the velocity in the narrow section?',

    givenValues: [
      { symbol: 'v_1', value: 2, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'r_1', value: 5, unit: 'cm', description: 'Initial radius' },
      { symbol: 'r_2', value: 2, unit: 'cm', description: 'Final radius' },
    ],
    unknowns: [
      { symbol: 'v_2', description: 'Final velocity', unit: 'm/s' },
    ],

    solution: {
      approach: 'Use continuity equation A₁v₁ = A₂v₂.',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply continuity equation',
          equation: 'A_1 v_1 = A_2 v_2',
        },
        {
          stepNumber: 2,
          description: 'Substitute areas (πr²) and solve for v₂',
          equation: '\\pi r_1^2 v_1 = \\pi r_2^2 v_2',
          result: 'v_2 = v_1 \\times \\frac{r_1^2}{r_2^2}',
        },
        {
          stepNumber: 3,
          description: 'Calculate',
          substitution: 'v_2 = 2 \\times \\frac{5^2}{2^2} = 2 \\times \\frac{25}{4} = 12.5\\text{ m/s}',
        },
      ],
      finalAnswer: { value: 12.5, unit: 'm/s' },
    },

    hints: [
      { level: 1, hint: 'Use the continuity equation: A₁v₁ = A₂v₂' },
      { level: 2, hint: 'Area = πr², so A₁/A₂ = (r₁/r₂)²' },
      { level: 3, hint: 'v₂ = v₁ × (r₁/r₂)²' },
    ],

    problemSpecificErrors: [
      {
        error: 'Thinking velocity decreases in narrow section',
        howToDetect: 'Student predicts v₂ < v₁',
        feedback: 'Remember: when area decreases, velocity INCREASES to maintain constant flow rate.',
      },
    ],

    tags: ['continuity', 'flow-rate', 'velocity'],
  },

  {
    id: 'flow-rate-1',
    source: 'curated',
    concepts: ['continuity'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Volume Flow Rate',
    statement: 'A garden hose with a 2 cm diameter delivers water at 3 m/s. (a) What is the volume flow rate? (b) How long does it take to fill a 100 L bucket?',

    givenValues: [
      { symbol: 'd', value: 2, unit: 'cm', description: 'Hose diameter' },
      { symbol: 'v', value: 3, unit: 'm/s', description: 'Water velocity' },
      { symbol: 'V', value: 100, unit: 'L', description: 'Bucket volume' },
    ],

    solution: {
      approach: 'Calculate Q = Av, then find time = V/Q.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate cross-sectional area',
          equation: 'A = \\pi r^2 = \\pi (0.01)^2 = 3.14 \\times 10^{-4}\\text{ m}^2',
        },
        {
          stepNumber: 2,
          description: 'Calculate volume flow rate',
          equation: 'Q = Av = (3.14 \\times 10^{-4})(3) = 9.42 \\times 10^{-4}\\text{ m}^3/\\text{s}',
          result: 'Q = 0.942\\text{ L/s}',
        },
        {
          stepNumber: 3,
          description: 'Calculate time to fill bucket',
          equation: 't = \\frac{V}{Q} = \\frac{100}{0.942} = 106\\text{ s} \\approx 1.8\\text{ min}',
        },
      ],
      finalAnswer: { text: '(a) 0.94 L/s, (b) 106 seconds (≈1.8 min)' },
    },

    hints: [
      { level: 1, hint: 'First find the cross-sectional area of the hose.' },
      { level: 2, hint: 'Volume flow rate Q = Area × velocity' },
      { level: 3, hint: 'Time = Volume / Flow rate' },
    ],

    tags: ['continuity', 'flow-rate', 'practical'],
  },

  // ============================================================================
  // BERNOULLI'S EQUATION PROBLEMS
  // ============================================================================
  {
    id: 'bernoulli-pressure-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14',
    concepts: ['bernoullis-equation', 'continuity'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Pressure in a Pipe Constriction',
    statement: 'Water flows at 1 m/s in a horizontal pipe where the pressure is 200 kPa. The pipe narrows to half its diameter. What is the pressure in the narrow section? (ρ = 1000 kg/m³)',

    givenValues: [
      { symbol: 'v_1', value: 1, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'p_1', value: 200000, unit: 'Pa', description: 'Initial pressure' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'Water density' },
    ],
    unknowns: [
      { symbol: 'p_2', description: 'Pressure in narrow section', unit: 'Pa' },
    ],

    solution: {
      approach: 'Use continuity to find v₂, then Bernoulli\'s equation to find p₂.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find velocity in narrow section using continuity',
          explanation: 'If diameter halves, area decreases by factor of 4',
          equation: 'v_2 = v_1 \\times \\frac{A_1}{A_2} = 1 \\times 4 = 4\\text{ m/s}',
        },
        {
          stepNumber: 2,
          description: 'Apply Bernoulli\'s equation (horizontal, so no height term)',
          equation: 'p_1 + \\frac{1}{2}\\rho v_1^2 = p_2 + \\frac{1}{2}\\rho v_2^2',
        },
        {
          stepNumber: 3,
          description: 'Solve for p₂',
          substitution: 'p_2 = p_1 + \\frac{1}{2}\\rho(v_1^2 - v_2^2)',
          equation: 'p_2 = 200,000 + \\frac{1}{2}(1000)(1 - 16)',
          result: 'p_2 = 200,000 - 7,500 = 192,500\\text{ Pa} = 192.5\\text{ kPa}',
        },
      ],
      finalAnswer: { value: 192.5, unit: 'kPa' },
      conceptualAnswer: 'The pressure DROPPED when velocity increased - this is the key insight of Bernoulli\'s principle.',
    },

    hints: [
      { level: 1, hint: 'First use continuity to find the new velocity.' },
      { level: 2, hint: 'When diameter halves, area decreases by factor of 4.' },
      { level: 3, hint: 'Apply Bernoulli: p₁ + ½ρv₁² = p₂ + ½ρv₂²' },
    ],

    problemSpecificErrors: [
      {
        error: 'Expecting pressure to increase with velocity',
        howToDetect: 'Student gets p₂ > p₁',
        feedback: 'In Bernoulli\'s equation, when velocity INCREASES, pressure DECREASES. They trade off!',
      },
    ],

    tags: ['bernoulli', 'continuity', 'pressure'],
  },

  {
    id: 'torricelli-tank-1',
    source: 'curated',
    concepts: ['bernoullis-equation'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,

    title: 'Water Tank Drainage',
    statement: 'A water tank has a small hole 3 meters below the water surface. What is the speed of water leaving the hole? How far from the base of the tank does the water land if the hole is 1 meter above the ground? (g = 10 m/s²)',

    givenValues: [
      { symbol: 'h_1', value: 3, unit: 'm', description: 'Depth of hole below surface' },
      { symbol: 'h_2', value: 1, unit: 'm', description: 'Height of hole above ground' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],

    solution: {
      approach: 'Use Torricelli\'s law for exit velocity, then projectile motion for range.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find exit velocity using Torricelli\'s law',
          equation: 'v = \\sqrt{2gh_1} = \\sqrt{2 \\times 10 \\times 3} = \\sqrt{60} \\approx 7.75\\text{ m/s}',
        },
        {
          stepNumber: 2,
          description: 'Find time for water to fall 1 m (horizontal projectile)',
          equation: 'h_2 = \\frac{1}{2}gt^2 \\Rightarrow t = \\sqrt{\\frac{2h_2}{g}} = \\sqrt{\\frac{2}{10}} = 0.45\\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Find horizontal range',
          equation: 'R = v \\times t = 7.75 \\times 0.45 = 3.5\\text{ m}',
        },
      ],
      finalAnswer: { text: 'Exit velocity: 7.75 m/s, Range: 3.5 m from base' },
    },

    hints: [
      { level: 1, hint: 'Use Torricelli\'s law: v = √(2gh)' },
      { level: 2, hint: 'The water leaves horizontally - this is a projectile motion problem!' },
      { level: 3, hint: 'Find time from vertical motion, then distance from horizontal motion.' },
    ],

    tags: ['torricelli', 'projectile', 'applications'],
  },

  // ============================================================================
  // CHALLENGING PROBLEMS
  // ============================================================================
  {
    id: 'submarine-depth-1',
    source: 'curated',
    concepts: ['pressure-depth', 'buoyancy'],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 6,

    title: 'Submarine at Depth',
    statement: 'A submarine has a total volume of 4000 m³ and a mass (without ballast) of 3.5e6 kg. (a) How much water must the ballast tanks hold for the submarine to hover at a fixed depth in seawater (ρ = 1025 kg/m³)? (b) What is the pressure on the submarine hull at a depth of 200 m?',

    givenValues: [
      { symbol: 'V', value: 4000, unit: 'm³', description: 'Submarine volume' },
      { symbol: 'm', value: 3500000, unit: 'kg', description: 'Mass without ballast' },
      { symbol: 'ρ', value: 1025, unit: 'kg/m³', description: 'Seawater density' },
      { symbol: 'h', value: 200, unit: 'm', description: 'Depth' },
    ],

    solution: {
      approach: 'For hovering, weight must equal buoyant force. Then use p = p₀ + ρgh for pressure.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate buoyant force (= weight of displaced water)',
          equation: 'F_B = \\rho_{water} \\times V \\times g = 1025 \\times 4000 \\times 10 = 41 \\times 10^6\\text{ N}',
        },
        {
          stepNumber: 2,
          description: 'For hovering: total weight = buoyant force',
          equation: '(m + m_{ballast})g = F_B',
        },
        {
          stepNumber: 3,
          description: 'Calculate required total mass',
          equation: 'm_{total} = \\frac{F_B}{g} = \\frac{41 \\times 10^6}{10} = 4.1 \\times 10^6\\text{ kg}',
        },
        {
          stepNumber: 4,
          description: 'Calculate ballast water needed',
          equation: 'm_{ballast} = m_{total} - m = 4.1 \\times 10^6 - 3.5 \\times 10^6 = 6 \\times 10^5\\text{ kg}',
          result: 'm_{ballast} = 600,000\\text{ kg} = 600\\text{ m}^3 \\text{ of water}',
        },
        {
          stepNumber: 5,
          description: 'Calculate pressure at 200 m depth',
          equation: 'p = p_0 + \\rho g h = 101,000 + 1025 \\times 10 \\times 200',
          result: 'p = 101,000 + 2,050,000 = 2.15\\text{ MPa} \\approx 21\\text{ atm}',
        },
      ],
      finalAnswer: { text: '(a) 600,000 kg (600 m³) of water, (b) 2.15 MPa (≈21 atm)' },
    },

    hints: [
      { level: 1, hint: 'For hovering: weight = buoyant force (neutral buoyancy)' },
      { level: 2, hint: 'Find the total mass needed, then subtract the submarine\'s mass.' },
      { level: 3, hint: 'For pressure: p = p₀ + ρgh' },
    ],

    tags: ['buoyancy', 'pressure', 'submarine', 'multi-step'],
  },

  {
    id: 'venturi-meter-1',
    source: 'curated',
    concepts: ['bernoullis-equation', 'continuity'],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 7,

    title: 'Venturi Meter',
    statement: 'A Venturi meter has a main pipe diameter of 10 cm and a throat diameter of 4 cm. If the pressure difference between the main pipe and throat is 15,000 Pa, what is the flow speed in the main pipe? (ρ = 1000 kg/m³)',

    givenValues: [
      { symbol: 'd_1', value: 10, unit: 'cm', description: 'Main pipe diameter' },
      { symbol: 'd_2', value: 4, unit: 'cm', description: 'Throat diameter' },
      { symbol: 'Δp', value: 15000, unit: 'Pa', description: 'Pressure difference' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'Fluid density' },
    ],
    unknowns: [
      { symbol: 'v_1', description: 'Flow speed in main pipe', unit: 'm/s' },
    ],

    solution: {
      approach: 'Combine continuity and Bernoulli equations to solve for v₁.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find area ratio',
          equation: '\\frac{A_1}{A_2} = \\frac{d_1^2}{d_2^2} = \\frac{100}{16} = 6.25',
        },
        {
          stepNumber: 2,
          description: 'Express v₂ in terms of v₁ using continuity',
          equation: 'v_2 = v_1 \\times \\frac{A_1}{A_2} = 6.25 v_1',
        },
        {
          stepNumber: 3,
          description: 'Apply Bernoulli (horizontal pipe)',
          equation: 'p_1 - p_2 = \\frac{1}{2}\\rho(v_2^2 - v_1^2) = \\frac{1}{2}\\rho v_1^2(6.25^2 - 1)',
        },
        {
          stepNumber: 4,
          description: 'Solve for v₁',
          equation: '15,000 = \\frac{1}{2}(1000)v_1^2(39.0625 - 1) = 500 \\times 38.0625 \\times v_1^2',
          result: 'v_1 = \\sqrt{\\frac{15,000}{19,031}} = \\sqrt{0.788} = 0.89\\text{ m/s}',
        },
      ],
      finalAnswer: { value: 0.89, unit: 'm/s' },
      conceptualAnswer: 'Venturi meters use the pressure drop in a constriction to measure flow rate - a direct application of Bernoulli\'s principle.',
    },

    hints: [
      { level: 1, hint: 'You need both continuity (to relate v₁ and v₂) and Bernoulli (to relate pressure and velocity).' },
      { level: 2, hint: 'From continuity: v₂ = v₁ × (A₁/A₂)' },
      { level: 3, hint: 'Substitute into Bernoulli and solve for v₁' },
    ],

    tags: ['bernoulli', 'continuity', 'venturi', 'measurement'],
  },

  // ============================================================================
  // OPENSTAX EXTRACTED PROBLEMS (Added 2026-01-31)
  // ============================================================================
  {
    id: 'openstax-ch14-p41',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 41',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Volume of Gold from Mass and Density',
    statement: 'Gold is sold by the troy ounce (31.103 g). What is the volume of 1 troy ounce of pure gold?',
    givenValues: [
      { symbol: 'm', value: 31.103, unit: 'g', description: 'Mass of 1 troy ounce of gold' },
      { symbol: '\rho_{Au}', value: 19300, unit: 'kg/m³', description: 'Density of gold' },
    ],
    unknowns: [
      { symbol: 'V', description: 'Volume of gold', unit: 'cm³' },
    ],
    solution: {
      approach: 'Use the density equation to find volume from mass and density',
      steps: [
        {
          stepNumber: 1,
          description: 'Write the density equation',
          explanation: 'Density relates mass and volume',
          equation: '\\rho = \\frac{m}{V}',
          result: '\\rho = \\frac{m}{V}',
        },
        {
          stepNumber: 2,
          description: 'Solve for volume',
          explanation: 'Rearrange to isolate V',
          equation: 'V = \\frac{m}{\\rho}',
          result: 'V = \\frac{m}{\\rho}',
        },
        {
          stepNumber: 3,
          description: 'Convert mass to kg',
          explanation: 'Need consistent units',
          equation: 'm = 31.103 \\text{ g} = 0.031103 \\text{ kg}',
          result: 'm = 0.031103 \\text{ kg}',
        },
        {
          stepNumber: 4,
          description: 'Substitute values',
          equation: 'V = \\frac{0.031103 \\text{ kg}}{19300 \\text{ kg/m³}}',
          result: 'V = 1.61 \\times 10^{-6} \\text{ m³}',
        },
        {
          stepNumber: 5,
          description: 'Convert to cm³',
          equation: 'V = 1.61 \\times 10^{-6} \\text{ m³} \\times \\frac{10^6 \\text{ cm³}}{1 \\text{ m³}}',
          result: 'V = 1.61 \\text{ cm³}',
        },
      ],
      finalAnswer: { value: 1.61, unit: 'cm³' },
    },
    hints: [
      { level: 1, hint: 'Think about the relationship between mass, density, and volume' },
      { level: 2, hint: 'Use the density formula ρ = m/V and solve for V' },
      { level: 3, hint: 'Look up the density of gold and make sure your units are consistent' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong density value or units',
        howToDetect: 'Check if density of gold (~19,300 kg/m³) is used correctly',
        feedback: 'Make sure to use the correct density of gold and convert units consistently',
      },
      {
        error: 'Unit conversion mistakes',
        howToDetect: 'Final answer not in reasonable range for gold volume',
        feedback: 'Remember to convert between grams/kg and m³/cm³ properly',
      },
    ],
    tags: ["density","unit-conversion","precious-metals"],
  },

  {
    id: 'openstax-ch14-p42',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 42',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Volume of Mercury Flask',
    statement: 'Mercury is commonly supplied in flasks containing 34.5 kg (about 76 lb.). What is the volume in liters of this much mercury?',
    givenValues: [
      { symbol: 'm', value: 34.5, unit: 'kg', description: 'Mass of mercury' },
      { symbol: '\rho_{Hg}', value: 13600, unit: 'kg/m³', description: 'Density of mercury' },
    ],
    unknowns: [
      { symbol: 'V', description: 'Volume of mercury', unit: 'L' },
    ],
    solution: {
      approach: 'Use density equation to find volume, then convert to liters',
      steps: [
        {
          stepNumber: 1,
          description: 'Use density equation',
          equation: 'V = \\frac{m}{\\rho}',
          result: 'V = \\frac{m}{\\rho}',
        },
        {
          stepNumber: 2,
          description: 'Substitute values',
          equation: 'V = \\frac{34.5 \\text{ kg}}{13600 \\text{ kg/m³}}',
          result: 'V = 2.54 \\times 10^{-3} \\text{ m³}',
        },
        {
          stepNumber: 3,
          description: 'Convert to liters',
          equation: 'V = 2.54 \\times 10^{-3} \\text{ m³} \\times \\frac{1000 \\text{ L}}{1 \\text{ m³}}',
          result: 'V = 2.54 \\text{ L}',
        },
      ],
      finalAnswer: { value: 2.54, unit: 'L' },
    },
    hints: [
      { level: 1, hint: 'You need the density of mercury to solve this problem' },
      { level: 2, hint: 'Use V = m/ρ with mercury\'s density of 13,600 kg/m³' },
      { level: 3, hint: 'After finding volume in m³, multiply by 1000 to convert to liters' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong mercury density',
        howToDetect: 'Check if density ~13,600 kg/m³ is used',
        feedback: 'Mercury has a density of approximately 13,600 kg/m³',
      },
      {
        error: 'Forgetting to convert m³ to liters',
        howToDetect: 'Answer is very small number instead of ~2.5',
        feedback: 'Remember that 1 m³ = 1000 L',
      },
    ],
    tags: ["density","unit-conversion","mercury"],
  },

  {
    id: 'openstax-ch14-p43',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 43',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Mass of Air in Deep Breath',
    statement: 'What is the mass of a deep breath of air having a volume of 2.00 L? Discuss the effect taking such a breath has on your body\'s volume and density.',
    givenValues: [
      { symbol: 'V', value: 2, unit: 'L', description: 'Volume of air in deep breath' },
      { symbol: '\rho_{air}', value: 1.29, unit: 'kg/m³', description: 'Density of air at STP' },
    ],
    unknowns: [
      { symbol: 'm', description: 'Mass of air', unit: 'g' },
    ],
    solution: {
      approach: 'Use density equation to find mass of air, then discuss body effects',
      steps: [
        {
          stepNumber: 1,
          description: 'Convert volume to m³',
          equation: 'V = 2.00 \\text{ L} = 2.00 \\times 10^{-3} \\text{ m³}',
          result: 'V = 2.00 \\times 10^{-3} \\text{ m³}',
        },
        {
          stepNumber: 2,
          description: 'Use density equation to find mass',
          equation: 'm = \\rho V',
          result: 'm = \\rho V',
        },
        {
          stepNumber: 3,
          description: 'Substitute values',
          equation: 'm = (1.29 \\text{ kg/m³})(2.00 \\times 10^{-3} \\text{ m³})',
          result: 'm = 2.58 \\times 10^{-3} \\text{ kg}',
        },
        {
          stepNumber: 4,
          description: 'Convert to grams',
          equation: 'm = 2.58 \\times 10^{-3} \\text{ kg} \\times \\frac{1000 \\text{ g}}{1 \\text{ kg}}',
          result: 'm = 2.58 \\text{ g}',
        },
      ],
      finalAnswer: { text: '2.58 g. Taking a deep breath increases body volume by 2.00 L while adding only 2.58 g of mass, so overall body density decreases slightly.' },
    },
    hints: [
      { level: 1, hint: 'You need to know the density of air at room temperature and pressure' },
      { level: 2, hint: 'Use m = ρV with air density ≈ 1.29 kg/m³, and don\'t forget unit conversions' },
      { level: 3, hint: 'Convert 2.00 L to m³, then multiply by air density to get mass in kg' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong air density',
        howToDetect: 'Mass calculated is not around 2-3 grams',
        feedback: 'Use standard air density of approximately 1.29 kg/m³ at room conditions',
      },
      {
        error: 'Unit conversion errors',
        howToDetect: 'Final mass is not in reasonable range',
        feedback: 'Remember: 1 L = 10⁻³ m³ and 1 kg = 1000 g',
      },
    ],
    tags: ["density","air","human-physiology","unit-conversion"],
  },

  {
    id: 'openstax-ch14-p44',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 44',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Density of Rock by Water Displacement',
    statement: 'A straightforward method of finding the density of an object is to measure its mass and then measure its volume by submerging it in a graduated cylinder. What is the density of a 240-g rock that displaces 89.0 cm³ of water?',
    givenValues: [
      { symbol: 'm', value: 240, unit: 'g', description: 'Mass of rock' },
      { symbol: 'V', value: 89, unit: 'cm³', description: 'Volume of water displaced' },
    ],
    unknowns: [
      { symbol: '\rho', description: 'Density of rock', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Use the density equation with given mass and displaced volume',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply density definition',
          explanation: 'The displaced volume equals the rock\'s volume',
          equation: '\\rho = \\frac{m}{V}',
          result: '\\rho = \\frac{m}{V}',
        },
        {
          stepNumber: 2,
          description: 'Substitute values',
          equation: '\\rho = \\frac{240 \\text{ g}}{89.0 \\text{ cm³}}',
          result: '\\rho = 2.70 \\text{ g/cm³}',
        },
      ],
      finalAnswer: { value: 2.7, unit: 'g/cm³' },
    },
    hints: [
      { level: 1, hint: 'The volume of water displaced equals the volume of the rock' },
      { level: 2, hint: 'Use the basic density formula ρ = m/V' },
      { level: 3, hint: 'Simply divide 240 g by 89.0 cm³' },
    ],
    problemSpecificErrors: [
      {
        error: 'Not recognizing displaced volume equals object volume',
        howToDetect: 'Student tries to find volume some other way',
        feedback: 'The volume of water displaced by a submerged object equals the object\'s volume',
      },
      {
        error: 'Unit confusion',
        howToDetect: 'Answer not in g/cm³ or wrong magnitude',
        feedback: 'Keep units consistent: grams and cm³ give density in g/cm³',
      },
    ],
    tags: ["density","water-displacement","measurement"],
  },

  {
    id: 'openstax-ch14-p45',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 45',
    concepts: ["density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Coffee Mug Radius from Volume',
    statement: 'Suppose you have a coffee mug with a circular cross-section and vertical sides (uniform radius). What is its inside radius if it holds 375 g of coffee when filled to a depth of 7.50 cm? Assume coffee has the same density as water.',
    givenValues: [
      { symbol: 'm', value: 375, unit: 'g', description: 'Mass of coffee' },
      { symbol: 'h', value: 7.5, unit: 'cm', description: 'Depth of coffee' },
      { symbol: '\rho', value: 1, unit: 'g/cm³', description: 'Density of coffee (same as water)' },
    ],
    unknowns: [
      { symbol: 'r', description: 'Inside radius of mug', unit: 'cm' },
    ],
    solution: {
      approach: 'Find volume from mass and density, then use cylinder volume formula',
      steps: [
        {
          stepNumber: 1,
          description: 'Find volume of coffee',
          equation: 'V = \\frac{m}{\\rho}',
          substitution: 'V = \\frac{375 \\text{ g}}{1.00 \\text{ g/cm³}}',
          result: 'V = 375 \\text{ cm³}',
        },
        {
          stepNumber: 2,
          description: 'Use cylinder volume formula',
          equation: 'V = \\pi r^2 h',
          result: 'V = \\pi r^2 h',
        },
        {
          stepNumber: 3,
          description: 'Solve for radius',
          equation: 'r = \\sqrt{\\frac{V}{\\pi h}}',
          result: 'r = \\sqrt{\\frac{V}{\\pi h}}',
        },
        {
          stepNumber: 4,
          description: 'Substitute values',
          equation: 'r = \\sqrt{\\frac{375 \\text{ cm³}}{\\pi (7.50 \\text{ cm})}}',
          result: 'r = \\sqrt{15.92} = 3.99 \\text{ cm}',
        },
      ],
      finalAnswer: { value: 3.99, unit: 'cm' },
    },
    hints: [
      { level: 1, hint: 'First find the volume of coffee using its mass and density' },
      { level: 2, hint: 'Then use the cylinder volume formula V = πr²h to find the radius' },
      { level: 3, hint: 'Solve r = √(V/πh) where V = 375 cm³' },
    ],
    problemSpecificErrors: [
      {
        error: 'Forgetting to convert mass to volume',
        howToDetect: 'Student tries to use mass directly in volume formula',
        feedback: 'First convert mass to volume using density, then use geometry',
      },
      {
        error: 'Using wrong cylinder formula',
        howToDetect: 'Getting unreasonable radius value',
        feedback: 'For a cylinder: V = πr²h, so r = √(V/πh)',
      },
    ],
    tags: ["density","cylinder-volume","geometry"],
  },

  {
    id: 'openstax-ch14-p50',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 50',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Force on Nail Tip from Pressure',
    statement: 'The tip of a nail exerts tremendous pressure when hit by a hammer because it exerts a large force over a small area. What force must be exerted on a nail with a circular tip of 1.00-mm diameter to create a pressure of 3.00e9 N/m²?',
    givenValues: [
      { symbol: 'd', value: 1, unit: 'mm', description: 'Diameter of nail tip' },
      { symbol: 'P', value: 3000000000, unit: 'N/m²', description: 'Desired pressure' },
    ],
    unknowns: [
      { symbol: 'F', description: 'Force required', unit: 'N' },
    ],
    solution: {
      approach: 'Find area of nail tip, then use pressure formula to find force',
      steps: [
        {
          stepNumber: 1,
          description: 'Convert diameter to radius in meters',
          equation: 'r = \\frac{d}{2} = \\frac{1.00 \\times 10^{-3} \\text{ m}}{2}',
          result: 'r = 5.00 \\times 10^{-4} \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Calculate area of circular tip',
          equation: 'A = \\pi r^2',
          substitution: 'A = \\pi (5.00 \\times 10^{-4})^2',
          result: 'A = 7.85 \\times 10^{-7} \\text{ m²}',
        },
        {
          stepNumber: 3,
          description: 'Use pressure formula to find force',
          equation: 'P = \\frac{F}{A} \\Rightarrow F = PA',
          substitution: 'F = (3.00 \\times 10^9)(7.85 \\times 10^{-7})',
          result: 'F = 2.36 \\times 10^3 \\text{ N}',
        },
      ],
      finalAnswer: { value: 2360, unit: 'N' },
    },
    hints: [
      { level: 1, hint: 'You need to find the area of the nail tip first' },
      { level: 2, hint: 'Use A = πr² for the circular tip area, then P = F/A' },
      { level: 3, hint: 'Convert 1.00 mm diameter to 0.5 mm radius, then calculate area in m²' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using diameter instead of radius',
        howToDetect: 'Area calculation is 4 times too large',
        feedback: 'Remember that radius is half the diameter: r = d/2',
      },
      {
        error: 'Unit conversion mistakes',
        howToDetect: 'Force value is way off from expected ~2000 N',
        feedback: 'Convert mm to m: 1.00 mm = 1.00e-3 m',
      },
    ],
    tags: ["pressure","force","circular-area"],
  },

  {
    id: 'openstax-ch14-p51',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 51',
    concepts: ["pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Height of Mercury Column for 1 atm Pressure',
    statement: 'A glass tube contains mercury. What would be the height of the column of mercury which would create pressure equal to 1.00 atm?',
    givenValues: [
      { symbol: 'P', value: 101325, unit: 'Pa', description: 'Pressure of 1 atmosphere' },
      { symbol: '\rho_{Hg}', value: 13600, unit: 'kg/m³', description: 'Density of mercury' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'Acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'Height of mercury column', unit: 'm' },
    ],
    solution: {
      approach: 'Use hydrostatic pressure equation P = ρgh',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply hydrostatic pressure equation',
          equation: 'P = \\rho g h',
          result: 'P = \\rho g h',
        },
        {
          stepNumber: 2,
          description: 'Solve for height',
          equation: 'h = \\frac{P}{\\rho g}',
          result: 'h = \\frac{P}{\\rho g}',
        },
        {
          stepNumber: 3,
          description: 'Substitute values',
          equation: 'h = \\frac{101325 \\text{ Pa}}{(13600 \\text{ kg/m³})(9.80 \\text{ m/s²})}',
          result: 'h = \\frac{101325}{133280} = 0.760 \\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Convert to mm Hg',
          equation: 'h = 0.760 \\text{ m} = 760 \\text{ mm}',
          result: 'h = 760 \\text{ mm Hg}',
        },
      ],
      finalAnswer: { value: 0.76, unit: 'm (760 mm Hg)' },
    },
    hints: [
      { level: 1, hint: 'Use the relationship between pressure and height of a fluid column' },
      { level: 2, hint: 'Apply P = ρgh where ρ is mercury\'s density' },
      { level: 3, hint: 'Solve h = P/(ρg) with P = 101,325 Pa and ρ = 13,600 kg/m³' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong mercury density',
        howToDetect: 'Height not close to 760 mm',
        feedback: 'Mercury density is 13,600 kg/m³',
      },
      {
        error: 'Forgetting to use gauge pressure',
        howToDetect: 'This problem uses absolute pressure',
        feedback: 'This is finding the height for 1 atm absolute pressure',
      },
    ],
    tags: ["pressure-depth","mercury","barometer"],
  },

  {
    id: 'openstax-ch14-p52',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 52',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Pressure at Bottom of Marianas Trench',
    statement: 'The greatest ocean depths on Earth are found in the Marianas Trench near the Philippines. Calculate the pressure due to the ocean at the bottom of this trench, given its depth is 11.0 km and assuming the density of seawater is constant all the way down.',
    givenValues: [
      { symbol: 'h', value: 11, unit: 'km', description: 'Depth of Marianas Trench' },
      { symbol: '\rho_{sw}', value: 1025, unit: 'kg/m³', description: 'Density of seawater' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'Acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P', description: 'Pressure due to ocean', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use hydrostatic pressure equation for deep water',
      steps: [
        {
          stepNumber: 1,
          description: 'Convert depth to meters',
          equation: 'h = 11.0 \\text{ km} = 11.0 \\times 10^3 \\text{ m}',
          result: 'h = 1.10 \\times 10^4 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Apply hydrostatic pressure equation',
          equation: 'P = \\rho g h',
          result: 'P = \\rho g h',
        },
        {
          stepNumber: 3,
          description: 'Substitute values',
          equation: 'P = (1025 \\text{ kg/m³})(9.80 \\text{ m/s²})(1.10 \\times 10^4 \\text{ m})',
          result: 'P = 1.11 \\times 10^8 \\text{ Pa}',
        },
        {
          stepNumber: 4,
          description: 'Express in atmospheres',
          equation: 'P = \\frac{1.11 \\times 10^8}{1.01 \\times 10^5} = 1100 \\text{ atm}',
          result: 'P = 1.11 \\times 10^8 \\text{ Pa} = 1100 \\text{ atm}',
        },
      ],
      finalAnswer: { value: 111000000, unit: 'Pa (1100 atm)' },
    },
    hints: [
      { level: 1, hint: 'This is a straightforward application of hydrostatic pressure' },
      { level: 2, hint: 'Use P = ρgh with seawater density ~1025 kg/m³' },
      { level: 3, hint: 'Don\'t forget to convert 11.0 km to meters first' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using freshwater density instead of seawater',
        howToDetect: 'Pressure is slightly low',
        feedback: 'Use seawater density ~1025 kg/m³, not freshwater (1000 kg/m³)',
      },
      {
        error: 'Unit conversion error',
        howToDetect: 'Pressure is off by factor of 1000',
        feedback: 'Remember: 11.0 km = 11,000 m',
      },
    ],
    tags: ["pressure-depth","ocean","extreme-conditions"],
  },

  {
    id: 'openstax-ch14-p54',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 54',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Pressure on Bottom of Gas Tank',
    statement: 'What pressure is exerted on the bottom of a gas tank that is 0.500-m wide and 0.900-m long and can hold 50.0 kg of gasoline when full?',
    givenValues: [
      { symbol: 'w', value: 0.5, unit: 'm', description: 'Width of tank' },
      { symbol: 'l', value: 0.9, unit: 'm', description: 'Length of tank' },
      { symbol: 'm', value: 50, unit: 'kg', description: 'Mass of gasoline when full' },
      { symbol: '\rho_{gas}', value: 680, unit: 'kg/m³', description: 'Density of gasoline' },
    ],
    unknowns: [
      { symbol: 'P', description: 'Pressure on bottom', unit: 'Pa' },
    ],
    solution: {
      approach: 'Find depth of gasoline using volume and area, then use hydrostatic pressure',
      steps: [
        {
          stepNumber: 1,
          description: 'Find volume of gasoline',
          equation: 'V = \\frac{m}{\\rho}',
          substitution: 'V = \\frac{50.0 \\text{ kg}}{680 \\text{ kg/m³}}',
          result: 'V = 0.0735 \\text{ m³}',
        },
        {
          stepNumber: 2,
          description: 'Calculate base area of tank',
          equation: 'A = w \\times l',
          substitution: 'A = 0.500 \\text{ m} \\times 0.900 \\text{ m}',
          result: 'A = 0.450 \\text{ m²}',
        },
        {
          stepNumber: 3,
          description: 'Find height of gasoline',
          equation: 'h = \\frac{V}{A}',
          substitution: 'h = \\frac{0.0735 \\text{ m³}}{0.450 \\text{ m²}}',
          result: 'h = 0.163 \\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Calculate pressure using hydrostatic pressure',
          equation: 'P = \\rho g h',
          substitution: 'P = (680)(9.80)(0.163)',
          result: 'P = 1.09 \\times 10^3 \\text{ Pa}',
        },
      ],
      finalAnswer: { value: 1090, unit: 'Pa' },
    },
    hints: [
      { level: 1, hint: 'First find how deep the gasoline is in the tank' },
      { level: 2, hint: 'Use the mass and density to find volume, then V = A×h to find height' },
      { level: 3, hint: 'Once you have the height, use P = ρgh for the pressure' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong gasoline density',
        howToDetect: 'Volume or height calculation seems off',
        feedback: 'Gasoline density is approximately 680 kg/m³',
      },
      {
        error: 'Forgetting to calculate height',
        howToDetect: 'Student tries to use pressure formula without finding h',
        feedback: 'You need the height of gasoline column: h = V/A',
      },
    ],
    tags: ["pressure-depth","gasoline","tank-geometry"],
  },

  {
    id: 'openstax-ch14-p64',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 64',
    concepts: ["buoyancy"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Fraction of Ice Submerged in Water',
    statement: 'What fraction of ice is submerged when it floats in freshwater, given the density of water at 0°C is very close to 1000 kg/m³?',
    givenValues: [
      { symbol: '\rho_{ice}', value: 917, unit: 'kg/m³', description: 'Density of ice' },
      { symbol: '\rho_{water}', value: 1000, unit: 'kg/m³', description: 'Density of water at 0°C' },
    ],
    unknowns: [
      { symbol: 'f', description: 'Fraction submerged', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle: weight equals buoyant force for floating object',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply floating equilibrium condition',
          explanation: 'Weight of ice equals buoyant force',
          equation: '\\rho_{ice} V_{ice} g = \\rho_{water} V_{submerged} g',
          result: '\\rho_{ice} V_{ice} = \\rho_{water} V_{submerged}',
        },
        {
          stepNumber: 2,
          description: 'Find fraction submerged',
          equation: 'f = \\frac{V_{submerged}}{V_{ice}} = \\frac{\\rho_{ice}}{\\rho_{water}}',
          result: 'f = \\frac{\\rho_{ice}}{\\rho_{water}}',
        },
        {
          stepNumber: 3,
          description: 'Substitute values',
          equation: 'f = \\frac{917 \\text{ kg/m³}}{1000 \\text{ kg/m³}}',
          result: 'f = 0.917 = 91.7\\%',
        },
      ],
      finalAnswer: { value: 0.917, unit: '(91.7%)' },
    },
    hints: [
      { level: 1, hint: 'For a floating object, the weight equals the buoyant force' },
      { level: 2, hint: 'Use Archimedes\' principle: ρ_object × V_object = ρ_fluid × V_submerged' },
      { level: 3, hint: 'The fraction submerged equals the ratio of densities: ρ_ice/ρ_water' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong ice density',
        howToDetect: 'Answer not close to 0.92',
        feedback: 'Ice density is approximately 917 kg/m³',
      },
      {
        error: 'Inverting the density ratio',
        howToDetect: 'Answer greater than 1',
        feedback: 'Fraction submerged = ρ_object/ρ_fluid, not the reverse',
      },
    ],
    tags: ["buoyancy","archimedes-principle","ice","floating"],
  },

  {
    id: 'openstax-ch14-p65',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 14, Problem 65',
    concepts: ["buoyancy"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Person Floating in Fresh and Salt Water',
    statement: 'If a person\'s body has a density of 995 kg/m³, what fraction of the body will be submerged when floating gently in (a) freshwater? (b) In salt water with a density of 1027 kg/m³?',
    givenValues: [
      { symbol: '\rho_{body}', value: 995, unit: 'kg/m³', description: 'Density of person\'s body' },
      { symbol: '\rho_{fresh}', value: 1000, unit: 'kg/m³', description: 'Density of freshwater' },
      { symbol: '\rho_{salt}', value: 1027, unit: 'kg/m³', description: 'Density of salt water' },
    ],
    unknowns: [
      { symbol: 'f_a', description: 'Fraction submerged in freshwater', unit: 'dimensionless' },
      { symbol: 'f_b', description: 'Fraction submerged in salt water', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Apply Archimedes\' principle for floating objects in both fluids',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply floating condition',
          explanation: 'For floating: weight = buoyant force',
          equation: '\\rho_{body} V_{body} g = \\rho_{fluid} V_{submerged} g',
          result: 'f = \\frac{V_{submerged}}{V_{body}} = \\frac{\\rho_{body}}{\\rho_{fluid}}',
        },
        {
          stepNumber: 2,
          description: 'Calculate fraction in freshwater',
          equation: 'f_a = \\frac{\\rho_{body}}{\\rho_{fresh}}',
          substitution: 'f_a = \\frac{995}{1000}',
          result: 'f_a = 0.995 = 99.5\\%',
        },
        {
          stepNumber: 3,
          description: 'Calculate fraction in salt water',
          equation: 'f_b = \\frac{\\rho_{body}}{\\rho_{salt}}',
          substitution: 'f_b = \\frac{995}{1027}',
          result: 'f_b = 0.969 = 96.9\\%',
        },
      ],
      finalAnswer: { text: '(a) 99.5% submerged in freshwater, (b) 96.9% submerged in salt water' },
    },
    hints: [
      { level: 1, hint: 'Use the same principle as the ice problem - fraction submerged depends on density ratio' },
      { level: 2, hint: 'For floating objects: fraction submerged = ρ_object/ρ_fluid' },
      { level: 3, hint: 'Apply this formula twice: once for freshwater (1000 kg/m³) and once for salt water (1027 kg/m³)' },
    ],
    problemSpecificErrors: [
      {
        error: 'Not recognizing less submersion in denser fluid',
        howToDetect: 'Salt water fraction not less than freshwater fraction',
        feedback: 'Denser salt water provides more buoyant force, so less of the body needs to be submerged',
      },
      {
        error: 'Inverting density ratios',
        howToDetect: 'Fractions greater than 1',
        feedback: 'Fraction submerged = ρ_body/ρ_fluid',
      },
    ],
    tags: ["buoyancy","human-body","freshwater","saltwater"],
  },

  // ============================================================================
  // OPENSTAX EXTRACTED PROBLEMS (Added 2026-01-31)
  // ============================================================================
  {
    id: 'pdf-ch11-p31',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 31',
    concepts: ["buoyancy","pressure"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Marbles in Bathtub - Buoyancy and Weight',
    statement: 'Marbles dropped into a partially filled bathtub sink to the bottom. Part of their weight is supported by buoyant force, yet the downward force on the bottom of the tub increases by exactly the weight of the marbles. Explain why.',
    solution: {
      approach: 'Apply Newton\'s third law and buoyancy principles to understand force distribution in the system.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what happens to the water when the marbles displace it.' },
      { level: 2, hint: 'Think about Newton\'s third law - if water pushes up on marbles, what do marbles do to water?' },
      { level: 3, hint: 'The buoyant force is internal to the system; the total weight affecting the tub bottom includes both water and marbles.' },
    ],
    tags: ["buoyancy","archimedes-principle","newtons-laws","force-analysis"],
  },

  {
    id: 'pdf-ch11-p32',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 32',
    concepts: ["density","buoyancy"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 6,
    title: 'Oil Tanker Displacement',
    statement: 'The density of oil is less than that of water, yet a loaded oil tanker sits lower in the water than an empty one. Why?',
    givenValues: [
      { symbol: '\rho_{oil}', value: 0, unit: '\rho_{water}', description: 'Oil density less than water density' },
    ],
    solution: {
      approach: 'Apply Archimedes\' principle to understand how total mass affects displacement.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'What determines how much water a floating object displaces?' },
      { level: 2, hint: 'Compare the total weight of an empty tanker versus a loaded tanker.' },
      { level: 3, hint: 'Apply Archimedes\' principle: displaced water weight equals object weight.' },
    ],
    tags: ["archimedes-principle","floating","displacement","density-comparison"],
  },

  {
    id: 'pdf-ch11-p33',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 33',
    concepts: [],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'Surface Tension Forces',
    statement: 'Is surface tension due to cohesive or adhesive forces, or both?',
    solution: {
      approach: 'Analyze the molecular forces responsible for surface tension phenomenon.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what forces exist between like molecules versus unlike molecules.' },
      { level: 2, hint: 'Think about the molecular environment at the surface versus in the bulk liquid.' },
      { level: 3, hint: 'Surface molecules experience unbalanced forces due to fewer neighbors above them.' },
    ],
    tags: ["surface-tension","cohesive-forces","molecular-interactions","surface-phenomena"],
  },

  {
    id: 'pdf-ch11-p34',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 34',
    concepts: [],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'Capillary Action Forces',
    statement: 'Is capillary action due to cohesive or adhesive forces, or both?',
    solution: {
      approach: 'Analyze the molecular forces responsible for capillary action in narrow tubes.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider the forces between liquid-solid and liquid-liquid molecules.' },
      { level: 2, hint: 'Think about what determines whether water rises or mercury falls in glass tubes.' },
      { level: 3, hint: 'The competition between adhesive and cohesive forces determines meniscus shape and capillary height.' },
    ],
    tags: ["capillary-action","cohesive-forces","adhesive-forces","meniscus","surface-phenomena"],
  },

  {
    id: 'pdf-ch11-p35',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 35',
    concepts: ["density","buoyancy"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Water Birds Floating Despite High Density',
    statement: 'Birds such as ducks, geese, and swans have greater densities than water, yet they are able to sit on its surface. Explain this ability, noting that water does not wet their feathers and that they cannot sit on soapy water.',
    givenValues: [
      { symbol: '\rho_{bird}', value: 0, unit: '\rho_{water}', description: 'Bird density greater than water density' },
    ],
    solution: {
      approach: 'Analyze how surface tension and air trapping enable birds to float despite higher density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider how the bird\'s feathers interact with water and what gets trapped in them.' },
      { level: 2, hint: 'Think about how surface tension can provide upward forces, and what soap does to surface tension.' },
      { level: 3, hint: 'The bird floats due to trapped air buoyancy plus surface tension support; soap eliminates the latter.' },
    ],
    tags: ["surface-tension","buoyancy","hydrophobic","effective-density","floating"],
  },

  {
    id: 'pdf-ch11-p36',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 36',
    concepts: [],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 6,
    title: 'Water Beading on Oiled Skin',
    statement: 'Water beads up on an oily sunbather, but not on her neighbor, whose skin is not oiled. Explain in terms of cohesive and adhesive forces.',
    solution: {
      approach: 'Compare cohesive and adhesive forces for water on oiled versus clean skin.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Compare the strength of water-water forces versus water-oil and water-skin forces.' },
      { level: 2, hint: 'When cohesive forces dominate, liquids tend to minimize surface contact.' },
      { level: 3, hint: 'Oil creates a hydrophobic surface that weakens adhesive interactions with water.' },
    ],
    tags: ["cohesive-forces","adhesive-forces","contact-angle","hydrophobic","wetting"],
  },

  {
    id: 'pdf-ch11-p37',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 37',
    concepts: [],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Capillary Action in Weightless Environment',
    statement: 'Could capillary action be used to move fluids in a \'weightless\' environment, such as in an orbiting space probe?',
    solution: {
      approach: 'Analyze whether capillary action depends on gravitational forces.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what forces actually cause capillary action - are they gravitational?' },
      { level: 2, hint: 'Think about what normally limits capillary rise on Earth.' },
      { level: 3, hint: 'Surface tension is a molecular force that doesn\'t depend on gravity.' },
    ],
    tags: ["capillary-action","surface-tension","weightlessness","molecular-forces","space-applications"],
  },

  {
    id: 'pdf-ch11-p38',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 38',
    concepts: ["pressure"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Capillary Action Effect on Manometer Reading',
    statement: 'What effect does capillary action have on the reading of a manometer with uniform diameter? Explain your answer.',
    solution: {
      approach: 'Analyze how capillary effects in both arms of a manometer affect pressure measurements.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider that a manometer measures the difference in liquid heights, not absolute heights.' },
      { level: 2, hint: 'Think about what happens when both arms of the manometer have the same diameter.' },
      { level: 3, hint: 'If capillary effects are equal in both arms, how does this affect the height difference?' },
    ],
    tags: ["capillary-action","manometer","pressure-measurement","differential-measurement"],
  },

  {
    id: 'pdf-ch11-p39',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 39',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Lung Pressure During Exhalation',
    statement: 'Pressure between the inside chest wall and the outside of the lungs normally remains negative. Explain how pressure inside the lungs can become positive (to cause exhalation) without muscle action.',
    solution: {
      approach: 'Analyze the pressure relationships in the respiratory system and how elastic recoil creates positive pressure.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what happens when you stretch a rubber band and then let go.' },
      { level: 2, hint: 'Think about the natural tendency of the lungs to collapse due to their elastic properties.' },
    ],
    tags: ["respiratory-system","pressure-gradients","elastic-recoil"],
  },

  {
    id: 'pdf-ch11-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 1',
    concepts: ["density"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Volume of Gold Troy Ounce',
    statement: 'Gold is sold by the troy ounce (31.103 g). What is the volume of 1 troy ounce of pure gold?',
    givenValues: [
      { symbol: 'm', value: 31.103, unit: 'g', description: 'mass of 1 troy ounce of gold' },
      { symbol: 'ρ', value: 19.3, unit: 'g/cm³', description: 'density of gold' },
    ],
    unknowns: [
      { symbol: 'V', description: 'volume of gold', unit: 'cm³' },
    ],
    solution: {
      approach: 'Use the density formula ρ = m/V and solve for volume.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the density of gold from reference tables (19.3 g/cm³).' },
      { level: 2, hint: 'Remember that density = mass/volume, so volume = mass/density.' },
    ],
    tags: ["density-calculation","precious-metals"],
  },

  {
    id: 'pdf-ch11-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 2',
    concepts: ["density"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Volume of Mercury in Flask',
    statement: 'Mercury is commonly supplied in flasks containing 34.5 kg (about 76 lb). What is the volume in liters of this much mercury?',
    givenValues: [
      { symbol: 'm', value: 34.5, unit: 'kg', description: 'mass of mercury' },
      { symbol: 'ρ', value: 13600, unit: 'kg/m³', description: 'density of mercury' },
    ],
    unknowns: [
      { symbol: 'V', description: 'volume of mercury', unit: 'L' },
    ],
    solution: {
      approach: 'Use density formula to find volume, then convert to liters.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Look up the density of mercury (13,600 kg/m³).' },
      { level: 2, hint: 'Remember to convert from m³ to liters (1 m³ = 1000 L).' },
    ],
    tags: ["density-calculation","unit-conversion","mercury"],
  },

  {
    id: 'pdf-ch11-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 3',
    concepts: ["density"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 5,
    title: 'Mass and Effects of Deep Breath',
    statement: '(a) What is the mass of a deep breath of air having a volume of 2.00 L? (b) Discuss the effect taking such a breath has on your body\'s volume and density.',
    givenValues: [
      { symbol: 'V', value: 2.00, unit: 'L', description: 'volume of air breathed' },
      { symbol: 'ρ_{air}', value: 1.29, unit: 'kg/m³', description: 'density of air at STP' },
    ],
    unknowns: [
      { symbol: 'm', description: 'mass of air', unit: 'g' },
    ],
    solution: {
      approach: 'Calculate mass using density, then analyze physiological effects.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the density of air at standard conditions (1.29 kg/m³).' },
      { level: 2, hint: 'Consider how adding a small mass but larger volume affects overall density.' },
    ],
    tags: ["density-calculation","human-physiology","air-density"],
  },

  {
    id: 'pdf-ch11-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 4',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Rock Density by Water Displacement',
    statement: 'A straightforward method of finding the density of an object is to measure its mass and then measure its volume by submerging it in a graduated cylinder. What is the density of a 240-g rock that displaces 89.0 cm³ of water? (Note that the accuracy and practical applications of this technique are more limited than a variety of others that are based on Archimedes\' principle.)',
    givenValues: [
      { symbol: 'm', value: 240, unit: 'g', description: 'mass of rock' },
      { symbol: 'V', value: 89.0, unit: 'cm³', description: 'volume of water displaced' },
    ],
    unknowns: [
      { symbol: 'ρ', description: 'density of rock', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Use the principle that displaced volume equals object volume, then apply density formula.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The volume of water displaced equals the volume of the submerged object.' },
      { level: 2, hint: 'Simply divide mass by the displaced volume to get density.' },
    ],
    tags: ["density-measurement","water-displacement","experimental-method"],
  },

  {
    id: 'pdf-ch11-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 5',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Coffee Mug Inside Radius',
    statement: 'Suppose you have a coffee mug with a circular cross section and vertical sides (uniform radius). What is its inside radius if it holds 375 g of coffee when filled to a depth of 7.50 cm? Assume coffee has the same density as water.',
    givenValues: [
      { symbol: 'm', value: 375, unit: 'g', description: 'mass of coffee' },
      { symbol: 'h', value: 7.50, unit: 'cm', description: 'depth of coffee' },
      { symbol: 'ρ', value: 1.00, unit: 'g/cm³', description: 'density of coffee (same as water)' },
    ],
    unknowns: [
      { symbol: 'r', description: 'inside radius of mug', unit: 'cm' },
    ],
    solution: {
      approach: 'Find volume from mass and density, then use cylindrical volume formula to find radius.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'First find the volume of coffee using its mass and density.' },
      { level: 2, hint: 'Use the formula for the volume of a cylinder: V = πr²h.' },
    ],
    tags: ["density-application","cylindrical-volume","practical-geometry"],
  },

  {
    id: 'pdf-ch11-p6',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 6',
    concepts: ["density"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Gasoline Tank Dimensions',
    statement: '(a) A rectangular gasoline tank can hold 50.0 kg of gasoline when full. What is the depth of the tank if it is 0.500-m wide by 0.900-m long? (b) Discuss whether this gas tank has a reasonable volume for a passenger car.',
    givenValues: [
      { symbol: 'm', value: 50.0, unit: 'kg', description: 'mass of gasoline' },
      { symbol: 'w', value: 0.500, unit: 'm', description: 'width of tank' },
      { symbol: 'l', value: 0.900, unit: 'm', description: 'length of tank' },
      { symbol: 'ρ', value: 680, unit: 'kg/m³', description: 'density of gasoline' },
    ],
    unknowns: [
      { symbol: 'd', description: 'depth of tank', unit: 'm' },
    ],
    solution: {
      approach: 'Calculate volume from mass and density, then use rectangular volume formula to find depth.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the density of gasoline (approximately 680 kg/m³).' },
      { level: 2, hint: 'Convert the final volume to liters to better assess reasonableness for a car.' },
    ],
    tags: ["density-application","rectangular-volume","automotive-engineering"],
  },

  {
    id: 'pdf-ch11-p7',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 7',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Trash Compactor Density Change',
    statement: 'A trash compactor can reduce the volume of its contents to 0.350 their original value. Neglecting the mass of air expelled, by what factor is the density of the rubbish increased?',
    givenValues: [
      { symbol: 'V_f/V_i', value: 0.350, unit: 'dimensionless', description: 'final volume to initial volume ratio' },
    ],
    unknowns: [
      { symbol: 'ρ_f/ρ_i', description: 'density increase factor', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use the relationship between density and volume when mass remains constant.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'When mass stays constant but volume decreases, how does density change?' },
      { level: 2, hint: 'The density ratio is the inverse of the volume ratio when mass is constant.' },
    ],
    tags: ["density-change","volume-compression","waste-management"],
  },

  {
    id: 'pdf-ch11-p8',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 8',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Average Density of Steel Gasoline Can',
    statement: 'A 2.50-kg steel gasoline can holds 20.0 L of gasoline when full. What is the average density of the full gas can, taking into account the volume occupied by steel as well as by gasoline?',
    givenValues: [
      { symbol: 'm_steel', value: 2.5, unit: 'kg', description: 'mass of steel can' },
      { symbol: 'V_gasoline', value: 20, unit: 'L', description: 'volume of gasoline' },
      { symbol: 'ρ_gasoline', value: 680, unit: 'kg/m³', description: 'density of gasoline (typical)' },
      { symbol: 'ρ_steel', value: 7800, unit: 'kg/m³', description: 'density of steel (typical)' },
    ],
    unknowns: [
      { symbol: 'ρ_avg', description: 'average density of full can', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Find total mass and total volume, then calculate average density',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'You need to find both the total mass and total volume of the system' },
      { level: 2, hint: 'Don\'t forget to include the volume occupied by the steel itself' },
      { level: 3, hint: 'Use typical values for densities: gasoline ≈ 680 kg/m³, steel ≈ 7800 kg/m³' },
    ],
    tags: ["density","mixture","volume"],
  },

  {
    id: 'pdf-ch11-p9',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 9',
    concepts: ["density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Density of 18-Karat Gold Alloy',
    statement: 'What is the density of 18.0-karat gold that is a mixture of 18 parts gold, 5 parts silver, and 1 part copper? (These values are parts by mass, not volume.) Assume that this is a simple mixture having an average density equal to the weighted densities of its constituents.',
    givenValues: [
      { symbol: 'm_gold', value: 18, unit: 'parts', description: 'mass parts of gold' },
      { symbol: 'm_silver', value: 5, unit: 'parts', description: 'mass parts of silver' },
      { symbol: 'm_copper', value: 1, unit: 'parts', description: 'mass parts of copper' },
      { symbol: 'ρ_gold', value: 19300, unit: 'kg/m³', description: 'density of gold' },
      { symbol: 'ρ_silver', value: 10500, unit: 'kg/m³', description: 'density of silver' },
      { symbol: 'ρ_copper', value: 8960, unit: 'kg/m³', description: 'density of copper' },
    ],
    unknowns: [
      { symbol: 'ρ_alloy', description: 'density of 18-karat gold alloy', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Calculate volumes of each component and use weighted average based on volumes',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The parts given are by mass, not volume' },
      { level: 2, hint: 'Calculate the volume each component would occupy for a given total mass' },
      { level: 3, hint: 'Use the relationship: total density = total mass / total volume' },
    ],
    tags: ["density","alloy","weighted-average","mixture"],
  },

  {
    id: 'pdf-ch11-p10',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 10',
    concepts: ["density"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Nuclear Density and Neutron Star Calculations',
    statement: 'There is relatively little empty space between atoms in solids and liquids, so that the average density of an atom is about the same as matter on a macroscopic scale—approximately 10³ kg/m³. The nucleus of an atom has a radius about 10⁻⁵ times that of the atom and contains nearly all the mass of the entire atom. (a) What is the approximate density of a nucleus? (b) One remnant of a supernova, called a neutron star, can have the density of a nucleus. What would be the radius of a neutron star with a mass 10 times that of our Sun (the radius of the Sun is 6.96e8 m)?',
    givenValues: [
      { symbol: 'ρ_atom', value: 1000, unit: 'kg/m³', description: 'typical density of matter' },
      { symbol: 'r_nucleus/r_atom', value: 0.00001, unit: 'dimensionless', description: 'ratio of nuclear to atomic radius' },
      { symbol: 'M_neutron_star', value: 1.99e31, unit: 'kg', description: 'mass of neutron star (10 solar masses)' },
      { symbol: 'M_sun', value: 1.99e+30, unit: 'kg', description: 'mass of the Sun' },
      { symbol: 'R_sun', value: 696000000, unit: 'm', description: 'radius of the Sun' },
    ],
    unknowns: [
      { symbol: 'ρ_nucleus', description: 'density of nucleus', unit: 'kg/m³' },
      { symbol: 'R_neutron_star', description: 'radius of neutron star', unit: 'm' },
    ],
    solution: {
      approach: 'Use volume scaling relationships and density formulas',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that volume scales as the cube of linear dimensions' },
      { level: 2, hint: 'For part (a), the nucleus has the same mass as the atom but much smaller volume' },
      { level: 3, hint: 'For part (b), use the sphere volume formula and the nuclear density from part (a)' },
    ],
    tags: ["density","nuclear-physics","scaling","astrophysics"],
  },

  {
    id: 'pdf-ch11-p11',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 11',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Pressure from High-Heeled Shoe',
    statement: 'As a woman walks, her entire weight is momentarily placed on one heel of her high-heeled shoes. Calculate the pressure exerted on the floor by the heel if it has an area of 1.50 cm² and the woman\'s mass is 55.0 kg. Express the pressure in Pa. (In the early days of commercial flight, women were not allowed to wear high-heeled shoes because aircraft floors were too thin to withstand such large pressures.)',
    givenValues: [
      { symbol: 'm', value: 55, unit: 'kg', description: 'woman\'s mass' },
      { symbol: 'A', value: 1.5, unit: 'cm²', description: 'heel area' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure exerted by heel', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use pressure formula P = F/A where force equals weight',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Pressure is force per unit area: P = F/A' },
      { level: 2, hint: 'The force is the woman\'s weight: F = mg' },
      { level: 3, hint: 'Convert the area from cm² to m² before calculating' },
    ],
    tags: ["pressure","force","area","weight"],
  },

  {
    id: 'pdf-ch11-p12',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 12',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 7,
    title: 'Pressure from Phonograph Needle',
    statement: 'The pressure exerted by a phonograph needle on a record is surprisingly large. If the equivalent of 1.00 g is supported by a needle, the tip of which is a circle 0.200 mm in radius, what pressure is exerted on the record in N/m²?',
    givenValues: [
      { symbol: 'm', value: 1, unit: 'g', description: 'equivalent mass supported' },
      { symbol: 'r', value: 0.2, unit: 'mm', description: 'radius of needle tip' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure exerted by needle', unit: 'N/m²' },
    ],
    solution: {
      approach: 'Calculate force from weight and area from circular tip, then find pressure',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The needle tip has a circular area: A = πr²' },
      { level: 2, hint: 'Convert all units to SI base units (kg, m) before calculating' },
      { level: 3, hint: 'The force is the weight of the equivalent mass: F = mg' },
    ],
    tags: ["pressure","circular-area","force","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p13',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 13',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Force Required for High Pressure on Nail',
    statement: 'Nail tips exert tremendous pressures when they are hit by hammers because they exert a large force over a small area. What force must be exerted on a nail with a circular tip of 1.00 mm diameter to create a pressure of 3.00e9 N/m²? (This high pressure is possible because the hammer striking the nail is brought to rest in such a short distance.)',
    givenValues: [
      { symbol: 'd', value: 1, unit: 'mm', description: 'diameter of nail tip' },
      { symbol: 'P', value: 3000000000, unit: 'N/m²', description: 'desired pressure' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force required', unit: 'N' },
    ],
    solution: {
      approach: 'Use pressure formula P = F/A, solve for force F = PA',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the pressure formula: P = F/A, so F = PA' },
      { level: 2, hint: 'The area is circular: A = πr², where r = d/2' },
      { level: 3, hint: 'Convert diameter from mm to m before calculating the area' },
    ],
    tags: ["pressure","force","circular-area","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p14',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 14',
    concepts: ["pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Depth of Mercury for 1 atm Pressure',
    statement: 'What depth of mercury creates a pressure of 1.00 atm?',
    givenValues: [
      { symbol: 'P', value: 101325, unit: 'Pa', description: '1 atmosphere pressure' },
      { symbol: 'ρ_Hg', value: 13600, unit: 'kg/m³', description: 'density of mercury' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'h', description: 'depth of mercury', unit: 'm' },
    ],
    solution: {
      approach: 'Use hydrostatic pressure formula P = ρgh',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure formula: P = ρgh' },
      { level: 2, hint: 'Mercury has a very high density: 13,600 kg/m³' },
      { level: 3, hint: '1 atmosphere = 101,325 Pa' },
    ],
    tags: ["pressure-depth","mercury","atmospheric-pressure","hydrostatic"],
  },

  {
    id: 'pdf-ch11-p15',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 15',
    concepts: ["pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Pressure at Bottom of Marianas Trench',
    statement: 'The greatest ocean depths on the Earth are found in the Marianas Trench near the Philippines. Calculate the pressure due to the ocean at the bottom of this trench, given its depth is 11.0 km and assuming the density of sea water is constant at 1025 kg/m³ all the way down.',
    givenValues: [
      { symbol: 'h', value: 11, unit: 'km', description: 'depth of Marianas Trench' },
      { symbol: 'ρ_seawater', value: 1025, unit: 'kg/m³', description: 'density of sea water' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure due to ocean water', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use hydrostatic pressure formula P = ρgh',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure formula: P = ρgh' },
      { level: 2, hint: 'Convert the depth from km to m before calculating' },
      { level: 3, hint: 'This pressure is much larger than atmospheric pressure - compare the result' },
    ],
    tags: ["pressure-depth","ocean","hydrostatic","extreme-pressure"],
  },

  {
    id: 'pdf-ch11-p16',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 16',
    concepts: ["pressure"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Verify SI Unit of Pressure',
    statement: 'Verify that the SI unit of pressure is N/m².',
    unknowns: [
      { symbol: 'unit', description: 'SI unit of pressure', unit: 'N/m²' },
    ],
    solution: {
      approach: 'Use dimensional analysis to verify the SI unit of pressure from its definition as force per unit area.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Start with the definition of pressure as force per unit area.' },
      { level: 2, hint: 'Remember that force is measured in Newtons and area in square meters.' },
    ],
    tags: ["units","dimensional-analysis","pressure-definition"],
  },

  {
    id: 'pdf-ch11-p17',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 17',
    concepts: ["pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Water Tower Height for Gauge Pressure',
    statement: 'Water towers store water above the level of consumers for times of heavy use, eliminating the need for high-speed pumps. How high above a user must the water level be to create a gauge pressure of 3.00e5 Pa?',
    givenValues: [
      { symbol: 'P_g', value: 3.00e5, unit: 'Pa', description: 'gauge pressure' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height of water above user', unit: 'm' },
    ],
    solution: {
      approach: 'Use the hydrostatic pressure equation to find the required height.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure equation P = ρgh.' },
      { level: 2, hint: 'Remember that gauge pressure is the pressure above atmospheric pressure.' },
      { level: 3, hint: 'Solve for h by rearranging the pressure equation.' },
    ],
    tags: ["hydrostatic-pressure","water-tower","gauge-pressure"],
  },

  {
    id: 'pdf-ch11-p18',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 18',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Eye Pressure from Force',
    statement: 'The aqueous humor in a person\'s eye is exerting a force of 0.300 N on the 1.10 cm² area of the cornea. (a) What pressure is this in mm Hg? (b) Is this value within the normal range for pressures in the eye?',
    givenValues: [
      { symbol: 'F', value: 0.300, unit: 'N', description: 'force on cornea' },
      { symbol: 'A', value: 1.10, unit: 'cm²', description: 'area of cornea' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure in Pa and mm Hg', unit: 'Pa, mm Hg' },
    ],
    solution: {
      approach: 'Calculate pressure from force and area, then convert to mm Hg and compare to normal values.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use P = F/A to find pressure in Pa first.' },
      { level: 2, hint: 'Convert cm² to m² by multiplying by 10⁻⁴.' },
      { level: 3, hint: 'Use the conversion 1 mm Hg = 133.3 Pa.' },
    ],
    tags: ["pressure-calculation","unit-conversion","biological-pressure"],
  },

  {
    id: 'pdf-ch11-p19',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 19',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Atmospheric Force on Paper',
    statement: 'How much force is exerted on one side of an 8.50 cm by 11.0 cm sheet of paper by the atmosphere? How can the paper withstand such a force?',
    givenValues: [
      { symbol: 'l₁', value: 8.50, unit: 'cm', description: 'length of paper' },
      { symbol: 'l₂', value: 11.0, unit: 'cm', description: 'width of paper' },
      { symbol: 'P_atm', value: 1.013e5, unit: 'Pa', description: 'atmospheric pressure' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force exerted by atmosphere', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate the area of the paper and multiply by atmospheric pressure to find force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Calculate the area of the paper first.' },
      { level: 2, hint: 'Use F = PA to find the force.' },
      { level: 3, hint: 'Consider why the paper doesn\'t collapse under this large force.' },
    ],
    tags: ["atmospheric-pressure","force-calculation","pressure-equilibrium"],
  },

  {
    id: 'pdf-ch11-p20',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 20',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Pressure from Gasoline Weight',
    statement: 'What pressure is exerted on the bottom of a 0.500-m-wide by 0.900-m-long gas tank that can hold 50.0 kg of gasoline by the weight of the gasoline in it when it is full?',
    givenValues: [
      { symbol: 'w', value: 0.500, unit: 'm', description: 'width of tank' },
      { symbol: 'l', value: 0.900, unit: 'm', description: 'length of tank' },
      { symbol: 'm', value: 50.0, unit: 'kg', description: 'mass of gasoline' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure on bottom of tank', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate the weight of gasoline and divide by the bottom area of the tank.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'First calculate the weight of the gasoline using W = mg.' },
      { level: 2, hint: 'Find the area of the tank bottom.' },
      { level: 3, hint: 'Use P = F/A where F is the weight of gasoline.' },
    ],
    tags: ["pressure-calculation","weight","tank-pressure"],
  },

  {
    id: 'pdf-ch11-p21',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 21',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Shot Put Pressure on Palm',
    statement: 'Calculate the average pressure exerted on the palm of a shot-putter\'s hand by the shot if the area of contact is 50.0 cm² and he exerts a force of 800 N on it. Express the pressure in Pa and compare it with the pressures sometimes encountered in the skeletal system.',
    givenValues: [
      { symbol: 'A', value: 50.0, unit: 'cm²', description: 'area of contact' },
      { symbol: 'F', value: 800, unit: 'N', description: 'force exerted' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure on palm', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate pressure from force and area, then compare to typical skeletal system pressures.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert the area from cm² to m² first.' },
      { level: 2, hint: 'Use P = F/A to calculate pressure.' },
      { level: 3, hint: 'Compare your result to typical skeletal pressures (10⁵-10⁶ Pa).' },
    ],
    tags: ["pressure-calculation","biomechanics","skeletal-system"],
  },

  {
    id: 'pdf-ch11-p22',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 22',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Heart Force from Blood Pressure',
    statement: 'The left side of the heart creates a pressure of 120 mm Hg by exerting a force directly on the blood over an effective area of 15.0 cm². What force does it exert to accomplish this?',
    givenValues: [
      { symbol: 'P', value: 120, unit: 'mm Hg', description: 'blood pressure' },
      { symbol: 'A', value: 15.0, unit: 'cm²', description: 'effective area' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force exerted by heart', unit: 'N' },
    ],
    solution: {
      approach: 'Convert pressure to Pa and area to m², then use F = PA to find force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert mm Hg to Pa using 1 mm Hg = 133.3 Pa.' },
      { level: 2, hint: 'Convert cm² to m² by multiplying by 10⁻⁴.' },
      { level: 3, hint: 'Use F = PA to find the force.' },
    ],
    tags: ["pressure-calculation","cardiovascular","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p23',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 23',
    concepts: ["pressure-depth"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 20,
    title: 'Force on Rectangular Dam',
    statement: 'Show that the total force on a rectangular dam due to the water behind it increases with the square of the water depth. In particular, show that this force is given by F = ½ρgD²w, where ρ is the density of water, D is its depth at the dam, and w is the length of the dam. You may assume the face of the dam is vertical. (Hint: Calculate the average pressure exerted and multiply this by the area in contact with the water.)',
    givenValues: [
      { symbol: 'ρ', value: 'variable', unit: 'kg/m³', description: 'density of water' },
      { symbol: 'D', value: 'variable', unit: 'm', description: 'depth of water at dam' },
      { symbol: 'w', value: 'variable', unit: 'm', description: 'width (length) of dam' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'F', description: 'total force on dam', unit: 'N' },
    ],
    solution: {
      approach: 'Use integration or average pressure method to find the total force on the vertical dam face.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Pressure varies linearly with depth: P = ρgh.' },
      { level: 2, hint: 'Use the hint about average pressure - it\'s half the maximum pressure at the bottom.' },
      { level: 3, hint: 'The total area in contact with water is D × w.' },
    ],
    tags: ["hydrostatic-force","integration","dam-engineering","pressure-variation"],
  },

  {
    id: 'pdf-ch11-p24',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 24',
    concepts: ["pascals-principle","pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Pressure Transmission in Hydraulic System',
    statement: 'How much pressure is transmitted in the hydraulic system considered in Example 11.6? Express your answer in pascals and in atmospheres.',
    givenValues: [
      { symbol: 'F_1', value: 500, unit: 'N', description: 'input force from Example 11.6' },
      { symbol: 'A_1', value: 0.00349, unit: 'm²', description: 'input area from Example 11.6' },
    ],
    unknowns: [
      { symbol: 'P', description: 'transmitted pressure', unit: 'Pa and atm' },
    ],
    solution: {
      approach: 'Use Pascal\'s principle that pressure is transmitted equally throughout a fluid',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'In a hydraulic system, pressure is transmitted equally throughout the fluid' },
      { level: 2, hint: 'Use P = F/A to find the pressure' },
      { level: 3, hint: 'Convert pascals to atmospheres using 1 atm = 101,325 Pa' },
    ],
    tags: ["hydraulic-systems","pressure-conversion","pascals-principle"],
  },

  {
    id: 'pdf-ch11-p25',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 25',
    concepts: ["pascals-principle","pressure"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 15,
    title: 'Force on Hydraulic Lift Pedal',
    statement: 'What force must be exerted on the pedal cylinder of a hydraulic lift to support the weight of a 2000-kg car (a large car) resting on the wheel cylinder? The pedal cylinder has a 2.00-cm diameter and the wheel has a 24.0-cm diameter.',
    givenValues: [
      { symbol: 'm', value: 2000, unit: 'kg', description: 'mass of car' },
      { symbol: 'd_1', value: 2, unit: 'cm', description: 'diameter of pedal cylinder' },
      { symbol: 'd_2', value: 24, unit: 'cm', description: 'diameter of wheel cylinder' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'F_1', description: 'force on pedal cylinder', unit: 'N' },
    ],
    solution: {
      approach: 'Apply Pascal\'s principle: F₁/A₁ = F₂/A₂, where F₂ is the weight of the car',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The force on the wheel cylinder equals the weight of the car' },
      { level: 2, hint: 'Use Pascal\'s principle: F₁/A₁ = F₂/A₂' },
      { level: 3, hint: 'Calculate areas using A = πr² where r = d/2' },
    ],
    tags: ["hydraulic-lift","mechanical-advantage","pascals-principle"],
  },

  {
    id: 'pdf-ch11-p26',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 26',
    concepts: ["pascals-principle","pressure"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 15,
    title: 'Cork and Jug Bottom Force',
    statement: 'A crass host pours the remnants of several bottles of wine into a jug after a party. He then inserts a cork with a 2.00-cm diameter into the bottle, placing it in direct contact with the wine. He is amazed when he pounds the cork into place and the bottom of the jug (with a 14.0-cm diameter) breaks away. Calculate the extra force exerted against the bottom if he pounded the cork with a 120-N force.',
    givenValues: [
      { symbol: 'F_1', value: 120, unit: 'N', description: 'force on cork' },
      { symbol: 'd_1', value: 2, unit: 'cm', description: 'diameter of cork' },
      { symbol: 'd_2', value: 14, unit: 'cm', description: 'diameter of jug bottom' },
    ],
    unknowns: [
      { symbol: 'F_2', description: 'extra force on jug bottom', unit: 'N' },
    ],
    solution: {
      approach: 'Apply Pascal\'s principle to find the force transmitted to the larger area',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The pressure created by the cork is transmitted throughout the wine' },
      { level: 2, hint: 'The force is magnified by the ratio of areas' },
      { level: 3, hint: 'F₂ = F₁ × (A₂/A₁) where A₂ > A₁' },
    ],
    tags: ["pascals-principle","force-magnification","pressure-transmission"],
  },

  {
    id: 'pdf-ch11-p27',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 27',
    concepts: ["pascals-principle"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 20,
    title: 'Hydraulic System Design Ratios',
    statement: 'A certain hydraulic system is designed to exert a force 100 times as large as the one put into it. (a) What must be the ratio of the area of the wheel cylinder to the area of the pedal cylinder? (b) What must be the ratio of their diameters? (c) By what factor is the distance through which the output force moves reduced relative to the distance through which the input force moves? Assume no losses to friction.',
    givenValues: [
      { symbol: 'F_2/F_1', value: 100, unit: 'dimensionless', description: 'force multiplication factor' },
    ],
    unknowns: [
      { symbol: 'A_2/A_1', description: 'ratio of areas', unit: 'dimensionless' },
      { symbol: 'd_2/d_1', description: 'ratio of diameters', unit: 'dimensionless' },
      { symbol: 'x_1/x_2', description: 'ratio of distances', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use Pascal\'s principle and conservation of volume',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use Pascal\'s principle: pressure is the same throughout the fluid' },
      { level: 2, hint: 'Area is proportional to diameter squared' },
      { level: 3, hint: 'Volume of fluid displaced is conserved: A₁x₁ = A₂x₂' },
    ],
    tags: ["hydraulic-design","mechanical-advantage","conservation-of-volume"],
  },

  {
    id: 'pdf-ch11-p28',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 28',
    concepts: ["pascals-principle"],
    difficulty: 4,
    type: 'conceptual',
    estimatedMinutes: 25,
    title: 'Work Conservation in Hydraulic Systems',
    statement: '(a) Verify that work input equals work output for a hydraulic system assuming no losses to friction. Do this by showing that the distance the output force moves is reduced by the same factor that the output force is increased. Assume the volume of the fluid is constant. (b) What effect would friction within the fluid and between components in the system have on the output force? How would this depend on whether or not the fluid is moving?',
    unknowns: [
      { symbol: 'W_in/W_out', description: 'ratio of input to output work', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use conservation principles and analyze friction effects',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Work equals force times distance: W = Fx' },
      { level: 2, hint: 'Use both Pascal\'s principle and volume conservation' },
      { level: 3, hint: 'Consider how friction depends on whether the fluid is static or moving' },
    ],
    tags: ["work-energy","conservation-laws","friction-effects"],
  },

  {
    id: 'pdf-ch11-p29',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 29',
    concepts: ["pressure","pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 20,
    title: 'Manometer Pressure Readings',
    statement: 'Find the gauge and absolute pressures in the balloon and peanut jar shown in Figure 11.14, assuming the manometer connected to the balloon uses water whereas the manometer connected to the jar contains mercury. Express in units of centimeters of water for the balloon and millimeters of mercury for the jar, taking atmospheric pressure as 76.0 cm Hg for each.',
    givenValues: [
      { symbol: 'P_atm', value: 76, unit: 'cm Hg', description: 'atmospheric pressure' },
      { symbol: 'h_balloon', value: 10, unit: 'cm H₂O', description: 'water column height in balloon manometer' },
      { symbol: 'h_jar', value: 5, unit: 'mm Hg', description: 'mercury column height in jar manometer' },
    ],
    unknowns: [
      { symbol: 'P_gauge_balloon', description: 'gauge pressure in balloon', unit: 'cm H₂O' },
      { symbol: 'P_abs_balloon', description: 'absolute pressure in balloon', unit: 'cm H₂O' },
      { symbol: 'P_gauge_jar', description: 'gauge pressure in jar', unit: 'mm Hg' },
      { symbol: 'P_abs_jar', description: 'absolute pressure in jar', unit: 'mm Hg' },
    ],
    solution: {
      approach: 'Use manometer readings to find gauge pressure, then add atmospheric pressure for absolute pressure',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Gauge pressure is the difference from atmospheric pressure' },
      { level: 2, hint: 'Absolute pressure = atmospheric pressure + gauge pressure' },
      { level: 3, hint: 'Use density ratios to convert between different fluid columns: ρ_Hg/ρ_H₂O = 13.6' },
    ],
    tags: ["manometer","gauge-pressure","absolute-pressure"],
  },

  {
    id: 'pdf-ch11-p30',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 30',
    concepts: ["pressure","pressure-depth"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 20,
    title: 'Blood Pressure Conversion and Analysis',
    statement: '(a) Convert normal blood pressure readings of 120 over 80 mm Hg to newtons per meter squared using the relationship for pressure due to the weight of a fluid rather than a conversion factor. (b) Discuss why blood pressures for an infant could be smaller than those for an adult. Specifically, consider the smaller height to which blood must be pumped.',
    givenValues: [
      { symbol: 'P_systolic', value: 120, unit: 'mm Hg', description: 'systolic blood pressure' },
      { symbol: 'P_diastolic', value: 80, unit: 'mm Hg', description: 'diastolic blood pressure' },
      { symbol: 'ρ_Hg', value: 13600, unit: 'kg/m³', description: 'density of mercury' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P_systolic_Pa', description: 'systolic pressure in pascals', unit: 'Pa' },
      { symbol: 'P_diastolic_Pa', description: 'diastolic pressure in pascals', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use P = ρgh to convert from mm Hg to Pa, then discuss physiological factors',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure formula P = ρgh' },
      { level: 2, hint: 'Convert mm to meters before calculating' },
      { level: 3, hint: 'Consider that blood pressure must overcome the height difference between heart and brain' },
    ],
    tags: ["blood-pressure","hydrostatic-pressure","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p31',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 31',
    concepts: ["pressure","pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Water Manometer Height for Blood Pressure',
    statement: 'How tall must a water-filled manometer be to measure blood pressures as high as 300 mm Hg?',
    givenValues: [
      { symbol: 'P', value: 300, unit: 'mm Hg', description: 'maximum blood pressure to measure' },
      { symbol: 'ρ_Hg', value: 13.6, unit: 'g/cm³', description: 'density of mercury' },
      { symbol: 'ρ_water', value: 1, unit: 'g/cm³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'h_water', description: 'height of water column', unit: 'mm' },
    ],
    solution: {
      approach: 'Use the principle that equal pressures correspond to fluid columns inversely proportional to their densities',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The same pressure can be measured by different height columns of different fluids' },
      { level: 2, hint: 'Use the relationship: h₁ρ₁ = h₂ρ₂ for equal pressures' },
      { level: 3, hint: 'Water is much less dense than mercury, so the column must be much taller' },
    ],
    tags: ["manometer","density-comparison","pressure-measurement"],
  },

  {
    id: 'pdf-ch11-p32',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 32',
    concepts: ["pressure","pascals-principle"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Force on Pressure Cooker Lid',
    statement: 'Pressure cookers have been around for more than 300 years, although their use has strongly declined in recent years (early models had a nasty habit of exploding). How much force must the latches holding the lid onto a pressure cooker be able to withstand if the circular lid is 0.25 m in diameter and the gauge pressure inside is 300 atm? Neglect the weight of the lid.',
    givenValues: [
      { symbol: 'd', value: 0.25, unit: 'm', description: 'diameter of circular lid' },
      { symbol: 'P_{gauge}', value: 300, unit: 'atm', description: 'gauge pressure inside' },
      { symbol: 'P_{atm}', value: 1.01e5, unit: 'Pa', description: 'atmospheric pressure' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force on lid', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate the net pressure difference across the lid and multiply by the area to find the force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Gauge pressure is the pressure above atmospheric pressure' },
      { level: 2, hint: 'Force equals pressure times area: F = PA' },
      { level: 3, hint: 'Convert atmospheric pressure units carefully: 1 atm = 1.01 × 10^5 Pa' },
    ],
    tags: ["pressure","force","circular-area","gauge-pressure"],
  },

  {
    id: 'pdf-ch11-p33',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 33',
    concepts: ["pressure","pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Blood Pressure Measurement at Different Heights',
    statement: 'Suppose you measure a standing person\'s blood pressure by placing the cuff on his leg 0.500 m below the heart. Calculate the pressure you would observe (in units of mm Hg) if the pressure at the heart were 120 over 80 mm Hg. Assume that there is no loss of pressure due to resistance in the circulatory system (a reasonable assumption, since major arteries are large).',
    givenValues: [
      { symbol: 'h', value: 0.500, unit: 'm', description: 'height difference below heart' },
      { symbol: 'P_{heart,sys}', value: 120, unit: 'mm Hg', description: 'systolic pressure at heart' },
      { symbol: 'P_{heart,dia}', value: 80, unit: 'mm Hg', description: 'diastolic pressure at heart' },
      { symbol: 'ρ_{blood}', value: 1060, unit: 'kg/m³', description: 'density of blood' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P_{leg}', description: 'blood pressure at leg', unit: 'mm Hg' },
    ],
    solution: {
      approach: 'Use the hydrostatic pressure equation to find the additional pressure due to height difference, then convert to mm Hg.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Pressure increases with depth in a fluid' },
      { level: 2, hint: 'Use ΔP = ρgh where ρ is the density of blood' },
      { level: 3, hint: 'Convert Pa to mm Hg using: 1 mm Hg = 133.3 Pa' },
    ],
    tags: ["hydrostatic-pressure","blood-pressure","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p34',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 34',
    concepts: ["pressure","pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Force to Open Submarine Hatch',
    statement: 'A submarine is stranded on the bottom of the ocean with its hatch 25.0 m below the surface. Calculate the force needed to open the hatch from the inside, given it is circular and 0.450 m in diameter. Air pressure inside the submarine is 1.00 atm.',
    givenValues: [
      { symbol: 'h', value: 25.0, unit: 'm', description: 'depth below surface' },
      { symbol: 'd', value: 0.450, unit: 'm', description: 'diameter of hatch' },
      { symbol: 'P_{inside}', value: 1.00, unit: 'atm', description: 'air pressure inside' },
      { symbol: 'ρ_{water}', value: 1025, unit: 'kg/m³', description: 'density of seawater' },
      { symbol: 'P_{atm}', value: 1.01e5, unit: 'Pa', description: 'atmospheric pressure' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force needed to open hatch', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate the pressure outside the hatch due to water depth, find the net pressure difference, and multiply by the hatch area.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The pressure outside includes both atmospheric pressure and water pressure' },
      { level: 2, hint: 'Use P = P₀ + ρgh for pressure at depth' },
      { level: 3, hint: 'The net force is due to the pressure difference across the hatch' },
    ],
    tags: ["hydrostatic-pressure","underwater-pressure","force","circular-area"],
  },

  {
    id: 'pdf-ch11-p35',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 35',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Contact Area of Bicycle Tires',
    statement: 'Assuming bicycle tires are perfectly flexible and support the weight of bicycle and rider by pressure alone, calculate the total area of the tires in contact with the ground. The bicycle plus rider has a mass of 80.0 kg, and the gauge pressure in the tires is 7.00 × 10^5 Pa.',
    givenValues: [
      { symbol: 'm', value: 80.0, unit: 'kg', description: 'mass of bicycle and rider' },
      { symbol: 'P_{gauge}', value: 7.00e5, unit: 'Pa', description: 'gauge pressure in tires' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'A', description: 'total contact area', unit: 'm²' },
    ],
    solution: {
      approach: 'The upward force due to pressure must equal the weight. Use F = PA to find the contact area.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The tires support the weight through pressure force' },
      { level: 2, hint: 'Use equilibrium: upward pressure force = weight' },
      { level: 3, hint: 'Gauge pressure is the pressure above atmospheric, which creates the net upward force' },
    ],
    tags: ["pressure","equilibrium","weight","contact-area"],
  },

  {
    id: 'pdf-ch11-p36',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 36',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Fraction of Ice Submerged in Water',
    statement: 'What fraction of ice is submerged when it floats in freshwater, given the density of water at 0°C is very close to 1000 kg/m³ and the density of ice is 917 kg/m³?',
    givenValues: [
      { symbol: 'ρ_{water}', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'ρ_{ice}', value: 917, unit: 'kg/m³', description: 'density of ice' },
    ],
    unknowns: [
      { symbol: 'f', description: 'fraction submerged', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle: for floating objects, the weight equals the buoyant force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use Archimedes\' principle for floating objects' },
      { level: 2, hint: 'Weight of object = buoyant force on submerged portion' },
      { level: 3, hint: 'The fraction submerged equals the ratio of densities' },
    ],
    tags: ["archimedes-principle","floating","density-ratio","ice"],
  },

  {
    id: 'pdf-ch11-p37',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 37',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Average Density of Floating Log',
    statement: 'Logs sometimes float vertically in a lake because one end has become water-logged and denser than the other. What is the average density of a uniform-diameter log that floats with 0.900 of its length above water?',
    givenValues: [
      { symbol: 'f_{above}', value: 0.900, unit: 'dimensionless', description: 'fraction of length above water' },
      { symbol: 'ρ_{water}', value: 1000, unit: 'kg/m³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'ρ_{log}', description: 'average density of log', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle with the fraction submerged to find the average density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Find what fraction is submerged first' },
      { level: 2, hint: 'For a uniform diameter, volume ratios equal length ratios' },
      { level: 3, hint: 'The average density times total volume gives the total weight' },
    ],
    tags: ["archimedes-principle","floating","vertical-floating","average-density"],
  },

  {
    id: 'pdf-ch11-p38',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 38',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 7,
    title: 'Density of Fluid from Hydrometer Reading',
    statement: 'Find the density of a fluid in which a hydrometer having a density of 0.750 g/cm³ floats with 8.92% of its volume submerged.',
    givenValues: [
      { symbol: 'ρ_{hydrometer}', value: 0.750, unit: 'g/cm³', description: 'density of hydrometer' },
      { symbol: 'f_{sub}', value: 0.0892, unit: 'dimensionless', description: 'fraction of volume submerged' },
    ],
    unknowns: [
      { symbol: 'ρ_{fluid}', description: 'density of fluid', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Apply Archimedes\' principle: weight of hydrometer equals buoyant force from displaced fluid.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The hydrometer floats, so weight equals buoyant force' },
      { level: 2, hint: 'Only the submerged portion contributes to buoyant force' },
      { level: 3, hint: 'The small submerged fraction suggests a very dense fluid' },
    ],
    tags: ["archimedes-principle","hydrometer","floating","dense-fluid"],
  },

  {
    id: 'pdf-ch11-p39',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 39',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Fraction of Body Submerged in Different Waters',
    statement: 'If your body has a density of 985 kg/m³, what fraction of you will be submerged when floating gently in: (a) freshwater? (b) salt water, which has a density of 1025 kg/m³?',
    givenValues: [
      { symbol: 'ρ_{body}', value: 985, unit: 'kg/m³', description: 'density of human body' },
      { symbol: 'ρ_{fresh}', value: 1000, unit: 'kg/m³', description: 'density of freshwater' },
      { symbol: 'ρ_{salt}', value: 1025, unit: 'kg/m³', description: 'density of salt water' },
    ],
    unknowns: [
      { symbol: 'f_{fresh}', description: 'fraction submerged in freshwater', unit: 'dimensionless' },
      { symbol: 'f_{salt}', description: 'fraction submerged in salt water', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle: for floating objects, the fraction submerged equals the ratio of object density to fluid density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For floating objects, use the density ratio formula' },
      { level: 2, hint: 'Fraction submerged = density of object / density of fluid' },
      { level: 3, hint: 'Higher fluid density means less of the object is submerged' },
    ],
    tags: ["archimedes-principle","human-body","floating","freshwater","saltwater"],
  },

  {
    id: 'pdf-ch11-p40',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 40',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Bird Bone Density Using Buoyancy',
    statement: 'Bird bones have air pockets in them to reduce their weight—this also gives them an average density significantly less than that of the bones of other animals. Suppose an ornithologist weighs a bird bone in air and in water and finds its mass is 45.0 g and its apparent mass when submerged is 3.60 g (the bone is watertight). (a) What mass of water is displaced? (b) What is the volume of the bone? (c) What is its average density?',
    givenValues: [
      { symbol: 'm_{air}', value: 45.0, unit: 'g', description: 'mass of bone in air' },
      { symbol: 'm_{apparent}', value: 3.60, unit: 'g', description: 'apparent mass when submerged' },
      { symbol: '\rho_{water}', value: 1.00, unit: 'g/cm³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'm_{displaced}', description: 'mass of water displaced', unit: 'g' },
      { symbol: 'V', description: 'volume of bone', unit: 'cm³' },
      { symbol: '\rho_{bone}', description: 'average density of bone', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle: the buoyant force equals the weight of displaced fluid. The difference between actual mass and apparent mass equals the mass of displaced water.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The buoyant force equals the weight of the displaced fluid.' },
      { level: 2, hint: 'The mass of displaced water equals the difference between the actual mass and apparent mass.' },
      { level: 3, hint: 'Use the density of water to find the volume from the displaced mass.' },
    ],
    tags: ["archimedes-principle","apparent-weight","fluid-displacement"],
  },

  {
    id: 'pdf-ch11-p41',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 41',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Rock Density Measurement',
    statement: 'A rock with a mass of 540 g in air is found to have an apparent mass of 342 g when submerged in water. (a) What mass of water is displaced? (b) What is the volume of the rock? (c) What is its average density? Is this consistent with the value for granite?',
    givenValues: [
      { symbol: 'm_{air}', value: 540, unit: 'g', description: 'mass of rock in air' },
      { symbol: 'm_{apparent}', value: 342, unit: 'g', description: 'apparent mass when submerged' },
      { symbol: '\rho_{water}', value: 1.00, unit: 'g/cm³', description: 'density of water' },
      { symbol: '\rho_{granite}', value: 2.7, unit: 'g/cm³', description: 'typical density of granite' },
    ],
    unknowns: [
      { symbol: 'm_{displaced}', description: 'mass of water displaced', unit: 'g' },
      { symbol: 'V', description: 'volume of rock', unit: 'cm³' },
      { symbol: '\rho_{rock}', description: 'average density of rock', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Apply Archimedes\' principle to find displaced water mass, then calculate volume and density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The buoyant force reduces the apparent weight of the submerged object.' },
      { level: 2, hint: 'The difference in weights equals the weight of displaced water.' },
      { level: 3, hint: 'Compare your calculated density with typical values for granite (around 2.7 g/cm³).' },
    ],
    tags: ["archimedes-principle","material-identification","density-comparison"],
  },

  {
    id: 'pdf-ch11-p42',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 42',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Fluid Density Determination Using Iron',
    statement: 'Archimedes\' principle can be used to calculate the density of a fluid as well as that of a solid. Suppose a chunk of iron with a mass of 390.0 g in air is found to have an apparent mass of 350.5 g when completely submerged in an unknown liquid. (a) What mass of fluid does the iron displace? (b) What is the volume of iron, using its density as given in Table 11.1? (c) Calculate the fluid\'s density and identify it.',
    givenValues: [
      { symbol: 'm_{air}', value: 390.0, unit: 'g', description: 'mass of iron in air' },
      { symbol: 'm_{apparent}', value: 350.5, unit: 'g', description: 'apparent mass when submerged' },
      { symbol: '\rho_{iron}', value: 7.86, unit: 'g/cm³', description: 'density of iron from Table 11.1' },
    ],
    unknowns: [
      { symbol: 'm_{displaced}', description: 'mass of fluid displaced', unit: 'g' },
      { symbol: 'V_{iron}', description: 'volume of iron', unit: 'cm³' },
      { symbol: '\rho_{fluid}', description: 'density of unknown fluid', unit: 'g/cm³' },
    ],
    solution: {
      approach: 'Use the known density of iron to find its volume, then use Archimedes\' principle to determine the fluid density.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'You can find the iron\'s volume using its known density and mass.' },
      { level: 2, hint: 'The volume of displaced fluid equals the volume of the submerged iron.' },
      { level: 3, hint: 'Compare your calculated fluid density with common liquids like alcohol, oil, or water.' },
    ],
    tags: ["fluid-identification","archimedes-principle","reverse-calculation"],
  },

  {
    id: 'pdf-ch11-p43',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 43',
    concepts: ["buoyancy","density"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Human Body Density and Buoyancy',
    statement: 'In an immersion measurement of a woman\'s density, she is found to have a mass of 62.0 kg in air and an apparent mass of 0.0850 kg when completely submerged with lungs empty. (a) What mass of water does she displace? (b) What is her volume? (c) Calculate her density. (d) If her lung capacity is 1.75 L, is she able to float without treading water with her lungs filled with air?',
    givenValues: [
      { symbol: 'm_{air}', value: 62.0, unit: 'kg', description: 'mass in air' },
      { symbol: 'm_{apparent}', value: 0.0850, unit: 'kg', description: 'apparent mass when submerged (lungs empty)' },
      { symbol: 'V_{lungs}', value: 1.75, unit: 'L', description: 'lung capacity' },
      { symbol: '\rho_{water}', value: 1000, unit: 'kg/m³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'm_{displaced}', description: 'mass of water displaced', unit: 'kg' },
      { symbol: 'V_{body}', description: 'volume of body', unit: 'm³' },
      { symbol: '\rho_{body}', description: 'body density', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle to find body density with empty lungs, then determine if she can float with air-filled lungs.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The apparent weight is much less than the actual weight because water provides significant buoyant force.' },
      { level: 2, hint: 'For floating, the average density must be less than water\'s density.' },
      { level: 3, hint: 'Air in the lungs increases volume but not mass, reducing the effective density.' },
    ],
    tags: ["human-body","floating-conditions","lung-capacity","effective-density"],
  },

  {
    id: 'pdf-ch11-p44',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 44',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Force Required for Fish to Stay Submerged',
    statement: 'Some fish have a density slightly less than that of water and must exert a force (swim) to stay submerged. What force must an 85.0-kg grouper exert to stay submerged in salt water if its body density is 1015 kg/m³?',
    givenValues: [
      { symbol: 'm', value: 85.0, unit: 'kg', description: 'mass of grouper' },
      { symbol: '\rho_{fish}', value: 1015, unit: 'kg/m³', description: 'density of fish' },
      { symbol: '\rho_{saltwater}', value: 1025, unit: 'kg/m³', description: 'density of salt water' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'F', description: 'downward force fish must exert', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate the net upward buoyant force and find the additional downward force needed for equilibrium.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The fish is less dense than salt water, so it naturally wants to float.' },
      { level: 2, hint: 'Calculate both the buoyant force and the fish\'s weight.' },
      { level: 3, hint: 'The required force is the difference between buoyant force and weight.' },
    ],
    tags: ["marine-biology","equilibrium-forces","saltwater-buoyancy"],
  },

  {
    id: 'pdf-ch11-p45',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 45',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Helium Balloon Buoyancy',
    statement: '(a) Calculate the buoyant force on a 2.00-L helium balloon. (b) Given the mass of the rubber in the balloon is 1.50 g, what is the net vertical force on the balloon if it is let go? You can neglect the volume of the rubber.',
    givenValues: [
      { symbol: 'V', value: 2.00, unit: 'L', description: 'volume of balloon' },
      { symbol: 'm_{rubber}', value: 1.50, unit: 'g', description: 'mass of rubber' },
      { symbol: '\rho_{air}', value: 1.29, unit: 'kg/m³', description: 'density of air' },
      { symbol: '\rho_{helium}', value: 0.179, unit: 'kg/m³', description: 'density of helium' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'F_b', description: 'buoyant force', unit: 'N' },
      { symbol: 'F_{net}', description: 'net vertical force', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate the buoyant force from displaced air, then find the net force considering weights of helium and rubber.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The buoyant force equals the weight of displaced air.' },
      { level: 2, hint: 'Consider the weights of both the helium and the rubber balloon.' },
      { level: 3, hint: 'The net force is buoyant force minus the total weight of balloon and helium.' },
    ],
    tags: ["helium-balloon","gas-density","net-force-calculation"],
  },

  {
    id: 'pdf-ch11-p46',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 46',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Floating Woman Density Calculation',
    statement: '(a) What is the density of a woman who floats in freshwater with 4.00% of her volume above the surface? This could be measured by placing her in a tank with marks on the side to measure how much water she displaces when floating and when held under water (briefly). (b) What percent of her volume is above the surface when she floats in seawater?',
    givenValues: [
      { symbol: 'f_{above,fresh}', value: 4.00, unit: '%', description: 'fraction above surface in freshwater' },
      { symbol: '\rho_{freshwater}', value: 1000, unit: 'kg/m³', description: 'density of freshwater' },
      { symbol: '\rho_{seawater}', value: 1025, unit: 'kg/m³', description: 'density of seawater' },
    ],
    unknowns: [
      { symbol: '\rho_{woman}', description: 'density of woman', unit: 'kg/m³' },
      { symbol: 'f_{above,sea}', description: 'fraction above surface in seawater', unit: '%' },
    ],
    solution: {
      approach: 'Use the floating equilibrium condition where weight equals buoyant force to find density, then apply to seawater.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For floating, the weight equals the buoyant force from the submerged portion.' },
      { level: 2, hint: 'If 4% is above water, then 96% is submerged and contributing to buoyancy.' },
      { level: 3, hint: 'Higher density fluids provide more buoyant force, allowing more of the body to be above surface.' },
    ],
    tags: ["floating-equilibrium","freshwater-vs-seawater","body-density"],
  },

  {
    id: 'pdf-ch11-p47',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 47',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Buoyant Force of Air on Human Body',
    statement: 'A certain man has a mass of 80 kg and a density of 985 kg/m³ (excluding the air in his lungs). (a) Calculate his volume. (b) Find the buoyant force air exerts on him. (c) What is the ratio of the buoyant force to his weight?',
    givenValues: [
      { symbol: 'm', value: 80, unit: 'kg', description: 'mass of man' },
      { symbol: '\rho_{man}', value: 985, unit: 'kg/m³', description: 'density of man (excluding lung air)' },
      { symbol: '\rho_{air}', value: 1.29, unit: 'kg/m³', description: 'density of air' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'V', description: 'volume of man', unit: 'm³' },
      { symbol: 'F_b', description: 'buoyant force from air', unit: 'N' },
      { symbol: 'ratio', description: 'ratio of buoyant force to weight', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Calculate volume from mass and density, then find buoyant force and compare to weight.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the definition of density to find volume from mass.' },
      { level: 2, hint: 'Air provides buoyant force just like any other fluid, though it\'s much less dense than water.' },
      { level: 3, hint: 'The buoyant force from air is very small compared to body weight.' },
    ],
    tags: ["air-buoyancy","human-body","force-ratios","everyday-physics"],
  },

  {
    id: 'pdf-ch11-p48',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 48',
    concepts: ["density","buoyancy"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Cork and Magnet Compass Buoyancy',
    statement: 'A simple compass can be made by placing a small bar magnet on a cork floating in water. (a) What fraction of a plain cork will be submerged when floating in water? (b) If the cork has a mass of 10.0 g and a 20.0-g magnet is placed on it, what fraction of the cork will be submerged? (c) Will the bar magnet and cork float in ethyl alcohol?',
    givenValues: [
      { symbol: 'ρ_cork', value: 240, unit: 'kg/m³', description: 'density of cork' },
      { symbol: 'ρ_water', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'ρ_alcohol', value: 789, unit: 'kg/m³', description: 'density of ethyl alcohol' },
      { symbol: 'm_cork', value: 10, unit: 'g', description: 'mass of cork' },
      { symbol: 'm_magnet', value: 20, unit: 'g', description: 'mass of magnet' },
      { symbol: 'ρ_iron', value: 7860, unit: 'kg/m³', description: 'density of iron (magnet)' },
    ],
    unknowns: [
      { symbol: 'f_sub1', description: 'fraction of cork submerged alone', unit: 'dimensionless' },
      { symbol: 'f_sub2', description: 'fraction of cork submerged with magnet', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use buoyancy principle: for floating objects, weight equals buoyant force',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For floating objects, the weight equals the buoyant force' },
      { level: 2, hint: 'The fraction submerged equals the ratio of object density to fluid density' },
      { level: 3, hint: 'For part (c), calculate the average density of the cork-magnet system' },
    ],
    tags: ["buoyancy","floating","density","archimedes-principle"],
  },

  {
    id: 'pdf-ch11-p49',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 49',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Buoyant Force on Iron Anchor',
    statement: 'What fraction of an iron anchor\'s weight will be supported by buoyant force when submerged in saltwater?',
    givenValues: [
      { symbol: 'ρ_iron', value: 7860, unit: 'kg/m³', description: 'density of iron' },
      { symbol: 'ρ_saltwater', value: 1025, unit: 'kg/m³', description: 'density of saltwater' },
    ],
    unknowns: [
      { symbol: 'f_buoyant', description: 'fraction of weight supported by buoyant force', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Compare buoyant force to weight using Archimedes\' principle',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use Archimedes\' principle: buoyant force equals weight of displaced fluid' },
      { level: 2, hint: 'The fraction is the ratio of fluid density to object density' },
    ],
    tags: ["buoyancy","archimedes-principle","submerged-object"],
  },

  {
    id: 'pdf-ch11-p50',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 50',
    concepts: ["buoyancy","density"],
    difficulty: 4,
    type: 'calculation',
    estimatedMinutes: 15,
    title: 'Detecting Gold-Plated Tungsten Fraud',
    statement: 'Scurrilous con artists have been known to represent gold-plated tungsten ingots as pure gold and sell them at prices much below gold value but deservedly far above the cost of tungsten. With what accuracy must you be able to measure the mass of such an ingot in and out of water to tell that it is almost pure tungsten rather than pure gold?',
    givenValues: [
      { symbol: 'ρ_gold', value: 19300, unit: 'kg/m³', description: 'density of gold' },
      { symbol: 'ρ_tungsten', value: 19250, unit: 'kg/m³', description: 'density of tungsten' },
      { symbol: 'ρ_water', value: 1000, unit: 'kg/m³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'accuracy', description: 'required measurement accuracy', unit: '%' },
    ],
    solution: {
      approach: 'Use the difference in apparent weight loss in water to distinguish materials',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use Archimedes\' principle to find the apparent weight loss in water' },
      { level: 2, hint: 'Calculate the weight loss for both materials and find the difference' },
      { level: 3, hint: 'The required accuracy is related to the fractional difference in weight loss' },
    ],
    tags: ["buoyancy","density-measurement","archimedes-principle","precision"],
  },

  {
    id: 'pdf-ch11-p51',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 51',
    concepts: ["buoyancy","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Air Mattress Buoyancy Capacity',
    statement: 'A twin-sized air mattress used for camping has dimensions of 100 cm by 200 cm by 15 cm when blown up. The weight of the mattress is 2 kg. How heavy a person could the air mattress hold if it is placed in freshwater?',
    givenValues: [
      { symbol: 'l', value: 100, unit: 'cm', description: 'length of mattress' },
      { symbol: 'w', value: 200, unit: 'cm', description: 'width of mattress' },
      { symbol: 'h', value: 15, unit: 'cm', description: 'height of mattress' },
      { symbol: 'm_mattress', value: 2, unit: 'kg', description: 'mass of mattress' },
      { symbol: 'ρ_water', value: 1000, unit: 'kg/m³', description: 'density of freshwater' },
    ],
    unknowns: [
      { symbol: 'm_person', description: 'maximum mass of person', unit: 'kg' },
    ],
    solution: {
      approach: 'Apply buoyancy principle: maximum buoyant force occurs when fully submerged',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Calculate the volume of the mattress first' },
      { level: 2, hint: 'Maximum buoyant force occurs when the mattress is fully submerged' },
      { level: 3, hint: 'Set total weight equal to maximum buoyant force for equilibrium' },
    ],
    tags: ["buoyancy","floating","volume-calculation"],
  },

  {
    id: 'pdf-ch11-p53',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 53',
    concepts: ["buoyancy","density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Human Lung Capacity from Buoyancy',
    statement: 'A 75.0-kg man floats in freshwater with 3.00% of his volume above water when his lungs are empty, and 5.00% of his volume above water when his lungs are full. Calculate the volume of air he inhales—called his lung capacity—in liters. Does this lung volume seem reasonable?',
    givenValues: [
      { symbol: 'm', value: 75, unit: 'kg', description: 'mass of man' },
      { symbol: 'f_empty', value: 3, unit: '%', description: 'fraction above water with empty lungs' },
      { symbol: 'f_full', value: 5, unit: '%', description: 'fraction above water with full lungs' },
      { symbol: 'ρ_water', value: 1000, unit: 'kg/m³', description: 'density of freshwater' },
      { symbol: 'ρ_air', value: 1.29, unit: 'kg/m³', description: 'density of air' },
    ],
    unknowns: [
      { symbol: 'V_lung', description: 'lung capacity', unit: 'L' },
    ],
    solution: {
      approach: 'Use buoyancy equilibrium for both lung states to find body volume and air volume',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the floating condition: weight equals buoyant force for both cases' },
      { level: 2, hint: 'The fraction submerged relates to the buoyant force' },
      { level: 3, hint: 'The difference in submerged fractions gives the lung air volume effect' },
    ],
    tags: ["buoyancy","floating","human-body","lung-capacity"],
  },

  {
    id: 'pdf-ch11-p54',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 54',
    concepts: ["pressure","surface-tension"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Pressure in Alveolus from Surface Tension',
    statement: 'What is the pressure inside an alveolus having a radius of 2.50e-4 m if the surface tension of the fluid-lined wall is the same as for soapy water? You may assume the pressure is the same as that created by a spherical bubble.',
    givenValues: [
      { symbol: 'r', value: 0.00025, unit: 'm', description: 'radius of alveolus' },
      { symbol: 'γ', value: 0.037, unit: 'N/m', description: 'surface tension of soapy water' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure inside alveolus', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use the pressure formula for a spherical bubble with surface tension',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the Young-Laplace equation for pressure across a curved surface' },
      { level: 2, hint: 'For a single curved surface: ΔP = 2γ/r' },
    ],
    tags: ["surface-tension","pressure","spherical-surface","alveolus"],
  },

  {
    id: 'pdf-ch11-p55',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 55',
    concepts: ["pressure","surface-tension"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Surface Tension from Alveolus Pressure',
    statement: 'The pressure inside an alveolus with a 2.50e-4-m radius is 1.40e3 Pa, due to its fluid-lined walls. Assuming the alveolus acts like a spherical bubble, what is the surface tension of the fluid? Identify the likely fluid.',
    givenValues: [
      { symbol: 'r', value: 0.00025, unit: 'm', description: 'radius of alveolus' },
      { symbol: 'ΔP', value: 1400, unit: 'Pa', description: 'excess pressure inside alveolus' },
    ],
    unknowns: [
      { symbol: 'γ', description: 'surface tension of fluid', unit: 'N/m' },
    ],
    solution: {
      approach: 'Use the pressure-surface tension relationship to find surface tension',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Rearrange the Young-Laplace equation to solve for surface tension' },
      { level: 2, hint: 'Compare the result to known surface tension values in Table 11.3' },
    ],
    tags: ["surface-tension","pressure","alveolus","lung-surfactant"],
  },

  {
    id: 'pdf-ch11-p56',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 56',
    concepts: ["pressure","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Gauge Pressure in Soap Bubble',
    statement: 'What is the gauge pressure in millimeters of mercury inside a soap bubble 0.100 m in diameter?',
    givenValues: [
      { symbol: 'd', value: 0.1, unit: 'm', description: 'diameter of soap bubble' },
      { symbol: 'γ', value: 0.037, unit: 'N/m', description: 'surface tension of soap solution' },
      { symbol: 'ρ_Hg', value: 13600, unit: 'kg/m³', description: 'density of mercury' },
    ],
    unknowns: [
      { symbol: 'P_gauge', description: 'gauge pressure inside bubble', unit: 'mm Hg' },
    ],
    solution: {
      approach: 'Use the Young-Laplace equation for pressure inside a soap bubble, then convert to mm Hg.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'A soap bubble has two surfaces, so the pressure formula includes factor of 4' },
      { level: 2, hint: 'Use P = 4γ/r for soap bubbles, where r is the radius' },
      { level: 3, hint: 'Convert Pa to mm Hg using: 1 mm Hg = 133.3 Pa' },
    ],
    tags: ["surface tension","pressure","soap bubble","unit conversion"],
  },

  {
    id: 'pdf-ch11-p57',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 57',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Force on Wire Due to Surface Tension',
    statement: 'Calculate the force on the slide wire if it is 3.50 cm long and the fluid is ethyl alcohol.',
    givenValues: [
      { symbol: 'L', value: 3.5, unit: 'cm', description: 'length of wire' },
      { symbol: 'γ', value: 0.0223, unit: 'N/m', description: 'surface tension of ethyl alcohol' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force on the wire', unit: 'N' },
    ],
    solution: {
      approach: 'Use the relationship between surface tension and force: F = γL, accounting for both sides of the wire.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Surface tension acts along the perimeter where the wire contacts the fluid' },
      { level: 2, hint: 'The wire has contact with fluid on both sides, so multiply by 2' },
      { level: 3, hint: 'Use F = 2γL where L is the length of the wire' },
    ],
    tags: ["surface tension","force","wire","ethyl alcohol"],
  },

  {
    id: 'pdf-ch11-p58',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 58',
    concepts: ["density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Capillary Action Height Calculations',
    statement: 'Figure 11.32 (a) shows the effect of tube radius on the height to which capillary action can raise a fluid. (a) Calculate the height for water in a glass tube with a radius of 0.900 cm—a rather large tube like the one on the left. (b) What is the radius of the glass tube on the right if it raises water to 4.00 cm?',
    givenValues: [
      { symbol: 'r_a', value: 0.9, unit: 'cm', description: 'radius of large tube' },
      { symbol: 'h_b', value: 4, unit: 'cm', description: 'height in small tube' },
      { symbol: 'γ', value: 0.0728, unit: 'N/m', description: 'surface tension of water' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'θ', value: 0, unit: '°', description: 'contact angle (water on glass)' },
    ],
    unknowns: [
      { symbol: 'h_a', description: 'height in large tube', unit: 'm' },
      { symbol: 'r_b', description: 'radius of small tube', unit: 'm' },
    ],
    solution: {
      approach: 'Use the capillary rise equation h = 2γcos(θ)/(ρgr) for both parts.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the capillary rise equation: h = 2γcos(θ)/(ρgr)' },
      { level: 2, hint: 'For water on glass, the contact angle θ = 0°, so cos(θ) = 1' },
      { level: 3, hint: 'In part (b), rearrange the equation to solve for r' },
    ],
    tags: ["capillary action","surface tension","water","glass tube","contact angle"],
  },

  {
    id: 'pdf-ch11-p59',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 59',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Sap Rise in Xylem Tube',
    statement: 'We stated in Example 11.12 that a xylem tube is of radius 2.50e-5 m. Verify that such a tube raises sap less than a meter by finding h for it, making the same assumptions that sap\'s density is 1050 kg/m³, its contact angle is zero, and its surface tension is the same as that of water at 20.0°C.',
    givenValues: [
      { symbol: 'r', value: 0.000025, unit: 'm', description: 'radius of xylem tube' },
      { symbol: 'ρ', value: 1050, unit: 'kg/m³', description: 'density of sap' },
      { symbol: 'θ', value: 0, unit: '°', description: 'contact angle' },
      { symbol: 'γ', value: 0.0728, unit: 'N/m', description: 'surface tension (same as water at 20°C)' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height sap rises', unit: 'm' },
    ],
    solution: {
      approach: 'Use the capillary rise equation and verify the height is less than 1 meter.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the same capillary rise equation as in the previous problem' },
      { level: 2, hint: 'The contact angle is zero, so cos(θ) = 1' },
      { level: 3, hint: 'Compare your calculated height to 1 meter to verify the claim' },
    ],
    tags: ["capillary action","xylem","sap","plant biology","surface tension"],
  },

  {
    id: 'pdf-ch11-p60',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 60',
    concepts: ["density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Identify Fluid from Surface Tension Force',
    statement: 'What fluid is in the device shown in Figure 11.26 if the force is 3.16e-3 N and the length of the wire is 2.50 cm? Calculate the surface tension and find a likely match from Table 11.3.',
    givenValues: [
      { symbol: 'F', value: 0.00316, unit: 'N', description: 'force on wire' },
      { symbol: 'L', value: 2.5, unit: 'cm', description: 'length of wire' },
    ],
    unknowns: [
      { symbol: 'γ', description: 'surface tension of fluid', unit: 'N/m' },
    ],
    solution: {
      approach: 'Calculate surface tension from force and wire length, then compare to table values.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The force equation for surface tension is F = 2γL for a wire' },
      { level: 2, hint: 'Rearrange to solve for γ: γ = F/(2L)' },
      { level: 3, hint: 'Compare your calculated value to typical surface tensions in Table 11.3' },
    ],
    tags: ["surface tension","force","wire","fluid identification","table lookup"],
  },

  {
    id: 'pdf-ch11-p61',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 61',
    concepts: ["pressure","density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Effective Surface Tension of Balloon',
    statement: 'If the gauge pressure inside a rubber balloon with a 10.0-cm radius is 1.50 cm of water, what is the effective surface tension of the balloon?',
    givenValues: [
      { symbol: 'r', value: 10, unit: 'cm', description: 'radius of balloon' },
      { symbol: 'P_gauge', value: 1.5, unit: 'cm H₂O', description: 'gauge pressure inside balloon' },
      { symbol: 'ρ_water', value: 1000, unit: 'kg/m³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'γ', description: 'effective surface tension of balloon', unit: 'N/m' },
    ],
    solution: {
      approach: 'Convert pressure to Pa, then use balloon pressure equation to find surface tension.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert cm of water pressure to Pascals using P = ρgh' },
      { level: 2, hint: 'For a balloon (single surface), use P = 2γ/r' },
      { level: 3, hint: 'Rearrange to solve for γ: γ = Pr/2' },
    ],
    tags: ["balloon","surface tension","pressure","gauge pressure","rubber"],
  },

  {
    id: 'pdf-ch11-p62',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 62',
    concepts: ["pressure","density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Gauge Pressures in Different Bubbles',
    statement: 'Calculate the gauge pressures inside 2.00-cm-radius bubbles of water, alcohol, and soapy water. Which liquid forms the most stable bubbles, neglecting any effects of evaporation?',
    givenValues: [
      { symbol: 'r', value: 2, unit: 'cm', description: 'radius of bubbles' },
      { symbol: 'γ_water', value: 0.0728, unit: 'N/m', description: 'surface tension of water' },
      { symbol: 'γ_alcohol', value: 0.0223, unit: 'N/m', description: 'surface tension of alcohol' },
      { symbol: 'γ_soap', value: 0.037, unit: 'N/m', description: 'surface tension of soap solution' },
    ],
    unknowns: [
      { symbol: 'P_water', description: 'gauge pressure in water bubble', unit: 'Pa' },
      { symbol: 'P_alcohol', description: 'gauge pressure in alcohol bubble', unit: 'Pa' },
      { symbol: 'P_soap', description: 'gauge pressure in soap bubble', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use the bubble pressure equation P = 4γ/r for each liquid and compare stability.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Bubbles have two surfaces, so use P = 4γ/r' },
      { level: 2, hint: 'Calculate the pressure for each liquid separately' },
      { level: 3, hint: 'Lower internal pressure means more stable bubbles' },
    ],
    tags: ["bubbles","surface tension","pressure","stability","comparison"],
  },

  {
    id: 'pdf-ch11-p63',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 63',
    concepts: ["density"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Capillary Action in Different Materials',
    statement: 'Suppose water is raised by capillary action to a height of 5.00 cm in a glass tube. (a) To what height will it be raised in a paraffin tube of the same radius? (b) In a silver tube of the same radius?',
    givenValues: [
      { symbol: 'h_glass', value: 5, unit: 'cm', description: 'height in glass tube' },
      { symbol: 'θ_glass', value: 0, unit: '°', description: 'contact angle for water on glass' },
      { symbol: 'θ_paraffin', value: 107, unit: '°', description: 'contact angle for water on paraffin' },
      { symbol: 'θ_silver', value: 90, unit: '°', description: 'contact angle for water on silver' },
    ],
    unknowns: [
      { symbol: 'h_paraffin', description: 'height in paraffin tube', unit: 'cm' },
      { symbol: 'h_silver', description: 'height in silver tube', unit: 'cm' },
    ],
    solution: {
      approach: 'Use the ratio of capillary heights based on contact angles, since other parameters are constant.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The height is proportional to cos(θ) when other factors are constant' },
      { level: 2, hint: 'Use ratios: h₂/h₁ = cos(θ₂)/cos(θ₁)' },
      { level: 3, hint: 'Negative height means the meniscus is depressed below normal level' },
    ],
    tags: ["capillary action","contact angle","glass","paraffin","silver","meniscus"],
  },

  {
    id: 'pdf-ch11-p64',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 64',
    concepts: ["pressure","density"],
    difficulty: 4,
    type: 'calculation',
    estimatedMinutes: 15,
    title: 'Contact Angle for Olive Oil in Capillary Action',
    statement: 'Calculate the contact angle for olive oil if capillary action raises it to a height of 7.07 cm in a glass tube with a radius of 0.100 mm. Is this value consistent with that for most organic liquids?',
    givenValues: [
      { symbol: 'h', value: 7.07, unit: 'cm', description: 'height of capillary rise' },
      { symbol: 'r', value: 0.1, unit: 'mm', description: 'radius of glass tube' },
      { symbol: '\gamma', value: 0.023, unit: 'N/m', description: 'surface tension of olive oil (typical value)' },
      { symbol: '\rho', value: 915, unit: 'kg/m³', description: 'density of olive oil (typical value)' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: '\theta', description: 'contact angle', unit: 'degrees' },
    ],
    solution: {
      approach: 'Use the capillary rise equation h = (2γcos(θ))/(ρgr) and solve for the contact angle θ.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the capillary rise equation relating height to surface tension and contact angle.' },
      { level: 2, hint: 'Make sure to convert all units to SI before calculating.' },
      { level: 3, hint: 'The surface tension value for olive oil may need to be looked up or estimated as ~0.033 N/m.' },
    ],
    tags: ["capillary-action","surface-tension","contact-angle","organic-liquids"],
  },

  {
    id: 'pdf-ch11-p65',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 65',
    concepts: ["pressure"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Soap Bubble Pressure and Merging',
    statement: 'When two soap bubbles touch, the larger is inflated by the smaller until they form a single bubble. (a) What is the gauge pressure inside a soap bubble with a 1.50-cm radius? (b) Inside a 4.00-cm-radius soap bubble? (c) Inside the single bubble they form if no air is lost when they touch?',
    givenValues: [
      { symbol: 'r_1', value: 1.5, unit: 'cm', description: 'radius of smaller bubble' },
      { symbol: 'r_2', value: 4, unit: 'cm', description: 'radius of larger bubble' },
      { symbol: '\gamma', value: 0.037, unit: 'N/m', description: 'surface tension of soap solution' },
    ],
    unknowns: [
      { symbol: 'P_1', description: 'gauge pressure in smaller bubble', unit: 'Pa' },
      { symbol: 'P_2', description: 'gauge pressure in larger bubble', unit: 'Pa' },
      { symbol: 'P_3', description: 'gauge pressure in combined bubble', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use the soap bubble pressure equation P = 4γ/r for each bubble, then use volume conservation for part (c).',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Soap bubbles have two surfaces, so the pressure equation is P = 4γ/r.' },
      { level: 2, hint: 'For part (c), use conservation of volume to find the radius of the combined bubble.' },
      { level: 3, hint: 'The smaller bubble has higher pressure and will deflate into the larger one.' },
    ],
    tags: ["soap-bubbles","surface-tension","pressure","volume-conservation"],
  },

  {
    id: 'pdf-ch11-p66',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 66',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Capillary Action Height Ratio for Water and Mercury',
    statement: 'Calculate the ratio of the heights to which water and mercury are raised by capillary action in the same glass tube.',
    givenValues: [
      { symbol: '\gamma_w', value: 0.0728, unit: 'N/m', description: 'surface tension of water' },
      { symbol: '\gamma_m', value: 0.486, unit: 'N/m', description: 'surface tension of mercury' },
      { symbol: '\rho_w', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: '\rho_m', value: 13600, unit: 'kg/m³', description: 'density of mercury' },
      { symbol: '\theta_w', value: 0, unit: 'degrees', description: 'contact angle for water on glass' },
      { symbol: '\theta_m', value: 140, unit: 'degrees', description: 'contact angle for mercury on glass' },
    ],
    unknowns: [
      { symbol: '\frac{h_w}{h_m}', description: 'ratio of water height to mercury height', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use the capillary rise equation for both liquids and take the ratio.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the capillary rise equation and take the ratio for both liquids.' },
      { level: 2, hint: 'Remember that mercury has a large contact angle (>90°), so cos(θ) is negative.' },
      { level: 3, hint: 'The negative ratio indicates mercury is depressed rather than raised in the tube.' },
    ],
    tags: ["capillary-action","surface-tension","contact-angle","mercury","water"],
  },

  {
    id: 'pdf-ch11-p67',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 67',
    concepts: ["density"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Capillary Action Height Ratio for Ethyl Alcohol and Water',
    statement: 'What is the ratio of heights to which ethyl alcohol and water are raised by capillary action in the same glass tube?',
    givenValues: [
      { symbol: '\gamma_e', value: 0.0223, unit: 'N/m', description: 'surface tension of ethyl alcohol' },
      { symbol: '\gamma_w', value: 0.0728, unit: 'N/m', description: 'surface tension of water' },
      { symbol: '\rho_e', value: 789, unit: 'kg/m³', description: 'density of ethyl alcohol' },
      { symbol: '\rho_w', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: '\theta_e', value: 0, unit: 'degrees', description: 'contact angle for ethyl alcohol on glass' },
      { symbol: '\theta_w', value: 0, unit: 'degrees', description: 'contact angle for water on glass' },
    ],
    unknowns: [
      { symbol: '\frac{h_e}{h_w}', description: 'ratio of ethyl alcohol height to water height', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use the capillary rise equation for both liquids and take the ratio.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the capillary rise equation and take the ratio for both liquids.' },
      { level: 2, hint: 'Both liquids have zero contact angle with glass, so cos(θ) = 1 for both.' },
      { level: 3, hint: 'The ratio depends on both surface tension and density of the liquids.' },
    ],
    tags: ["capillary-action","surface-tension","ethyl-alcohol","water","density-comparison"],
  },

  {
    id: 'pdf-ch11-p68',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 68',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Force on Diaphragm During Forced Exhalation',
    statement: 'During forced exhalation, such as when blowing up a balloon, the diaphragm and chest muscles create a pressure of 60.0 mm Hg between the lungs and chest wall. What force in newtons does this pressure create on the surface area of the diaphragm?',
    givenValues: [
      { symbol: 'P', value: 60, unit: 'mm Hg', description: 'gauge pressure' },
      { symbol: 'A', value: 600, unit: 'cm²', description: 'surface area of diaphragm (typical value)' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force on diaphragm', unit: 'N' },
    ],
    solution: {
      approach: 'Convert pressure to pascals and use F = PA to find the force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the relationship F = PA between force, pressure, and area.' },
      { level: 2, hint: 'Convert mm Hg to pascals using the conversion factor 1 mm Hg = 133.3 Pa.' },
      { level: 3, hint: 'Make sure to convert the area from cm² to m² before calculating.' },
    ],
    tags: ["pressure","force","diaphragm","breathing","unit-conversion"],
  },

  {
    id: 'pdf-ch11-p69',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 69',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Pressure Created by Tooth Bite Force',
    statement: 'You can chew through very tough objects with your incisors because they exert a large force on the small area of a pointed tooth. What pressure in pascals can you create by exerting a force of 500 N with your tooth on an area of 1.00 mm²?',
    givenValues: [
      { symbol: 'F', value: 500, unit: 'N', description: 'force exerted by tooth' },
      { symbol: 'A', value: 1, unit: 'mm²', description: 'contact area of tooth' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure created', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use the pressure equation P = F/A after converting area to square meters.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use P = F/A to calculate pressure.' },
      { level: 2, hint: 'Convert mm² to m² by dividing by 10⁶.' },
      { level: 3, hint: 'This extremely high pressure explains why teeth can cut through tough materials.' },
    ],
    tags: ["pressure","force","area","teeth","bite-force"],
  },

  {
    id: 'pdf-ch11-p70',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 70',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Force Required for Artificial Respiration',
    statement: 'One way to force air into an unconscious person\'s lungs is to squeeze on a balloon appropriately connected to the subject. What force must you exert on the balloon with your hands to create a gauge pressure of 4.00 cm water, assuming you squeeze on an effective area of 50.0 cm²?',
    givenValues: [
      { symbol: 'P', value: 4, unit: 'cm H₂O', description: 'gauge pressure required' },
      { symbol: 'A', value: 50, unit: 'cm²', description: 'effective squeeze area' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force required', unit: 'N' },
    ],
    solution: {
      approach: 'Convert pressure to pascals and use F = PA to find the required force.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use F = PA to find the force from pressure and area.' },
      { level: 2, hint: 'Convert cm H₂O to pascals using 1 cm H₂O = 98.1 Pa.' },
      { level: 3, hint: 'This relatively small force shows why manual resuscitation is feasible.' },
    ],
    tags: ["pressure","force","artificial-respiration","medical-physics","water-pressure"],
  },

  {
    id: 'pdf-ch11-p71',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 71',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Maximum Breathing Depth Through Reed',
    statement: 'Heroes in movies hide beneath water and breathe through a hollow reed (villains never catch on to this trick). In practice, you cannot inhale in this manner if your lungs are more than 60.0 cm below the surface. What is the maximum negative gauge pressure you can create in your lungs on dry land, assuming you can achieve the same water pressure with your lungs 60.0 cm below the surface?',
    givenValues: [
      { symbol: 'h', value: 60, unit: 'cm', description: 'maximum depth below surface' },
      { symbol: '\rho', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P', description: 'maximum negative gauge pressure', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate the water pressure at 60 cm depth, which equals the maximum negative pressure you can create.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The maximum negative pressure you can create equals the water pressure at the limiting depth.' },
      { level: 2, hint: 'Use P = ρgh to calculate pressure due to water depth.' },
      { level: 3, hint: 'This pressure limit explains why snorkels have a maximum practical length.' },
    ],
    tags: ["pressure-depth","breathing","snorkel","negative-pressure","lung-capacity"],
  },

  {
    id: 'pdf-ch11-p72',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 72',
    concepts: ["pressure","pressure-depth"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Infant Brain Pressure and Skull Force',
    statement: 'Gauge pressure in the fluid surrounding an infant\'s brain may rise as high as 85.0 mm Hg (5 to 12 mm Hg is normal), creating an outward force large enough to make the skull grow abnormally large. (a) Calculate this outward force in newtons on each side of an infant\'s skull if the effective area of each side is 40.0 cm². (b) What is the net force acting on the skull?',
    givenValues: [
      { symbol: 'P_g', value: 85.0, unit: 'mm Hg', description: 'gauge pressure in brain fluid' },
      { symbol: 'A', value: 40.0, unit: 'cm²', description: 'effective area of each side of skull' },
    ],
    unknowns: [
      { symbol: 'F', description: 'outward force on each side', unit: 'N' },
      { symbol: 'F_net', description: 'net force on skull', unit: 'N' },
    ],
    solution: {
      approach: 'Convert pressure to Pa, then use F = PA to find force on each side. Net force is zero since forces are equal and opposite.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember to convert mm Hg to Pa using the conversion factor 1 mm Hg = 133.3 Pa' },
      { level: 2, hint: 'The net force is zero because equal forces act outward on opposite sides of the skull' },
      { level: 3, hint: 'Convert cm² to m² by dividing by 10,000 or multiplying by (0.01)²' },
    ],
    tags: ["biomedical","pressure conversion","force calculation"],
  },

  {
    id: 'pdf-ch11-p73',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 73',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Fetal Weight Pressure on Bladder',
    statement: 'A full-term fetus typically has a mass of 3.50 kg. (a) What pressure does the weight of such a fetus create if it rests on the mother\'s bladder, supported on an area of 90.0 cm²? (b) Convert this pressure to millimeters of mercury and determine if it alone is great enough to trigger the micturition reflex (it will add to any pressure already existing in the bladder).',
    givenValues: [
      { symbol: 'm', value: 3.50, unit: 'kg', description: 'mass of fetus' },
      { symbol: 'A', value: 90.0, unit: 'cm²', description: 'contact area on bladder' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure on bladder', unit: 'Pa' },
      { symbol: 'P_mmHg', description: 'pressure in mm Hg', unit: 'mm Hg' },
    ],
    solution: {
      approach: 'Calculate weight force, then pressure using P = F/A, and convert to mm Hg.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Start by calculating the weight of the fetus using W = mg' },
      { level: 2, hint: 'Convert cm² to m² before calculating pressure' },
      { level: 3, hint: 'The micturition reflex typically occurs at bladder pressures of 25-30 mm Hg' },
    ],
    tags: ["biomedical","pressure","weight","unit conversion"],
  },

  {
    id: 'pdf-ch11-p74',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 74',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Stomach Fluid Rise in Esophagus',
    statement: 'If the pressure in the esophagus is -2.00 mm Hg while that in the stomach is +20.0 mm Hg, to what height could stomach fluid rise in the esophagus, assuming a density of 1.10 g/mL? (This movement will not occur if the muscle closing the lower end of the esophagus is working properly.)',
    givenValues: [
      { symbol: 'P_esophagus', value: -2.00, unit: 'mm Hg', description: 'pressure in esophagus' },
      { symbol: 'P_stomach', value: +20.0, unit: 'mm Hg', description: 'pressure in stomach' },
      { symbol: 'ρ', value: 1.10, unit: 'g/mL', description: 'density of stomach fluid' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height fluid can rise', unit: 'm' },
    ],
    solution: {
      approach: 'Find pressure difference and use hydrostatic pressure equation to find height.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The pressure difference drives the fluid upward - subtract the esophageal pressure from stomach pressure' },
      { level: 2, hint: 'Use the hydrostatic pressure equation: ΔP = ρgh' },
      { level: 3, hint: 'Remember to convert g/mL to kg/m³ by multiplying by 1000' },
    ],
    tags: ["biomedical","hydrostatic pressure","fluid mechanics"],
  },

  {
    id: 'pdf-ch11-p75',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 75',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Spinal Fluid Pressure Measurement',
    statement: 'Pressure in the spinal fluid is measured as shown in Figure 11.40. If the pressure in the spinal fluid is 10.0 mm Hg: (a) What is the reading of the water manometer in cm water? (b) What is the reading if the person sits up, placing the top of the fluid 60 cm above the tap? The fluid density is 1.05 g/mL.',
    givenValues: [
      { symbol: 'P_spinal', value: 10.0, unit: 'mm Hg', description: 'pressure in spinal fluid' },
      { symbol: 'ρ_fluid', value: 1.05, unit: 'g/mL', description: 'spinal fluid density' },
      { symbol: 'ρ_water', value: 1.00, unit: 'g/mL', description: 'water density' },
      { symbol: 'h_elevation', value: 60, unit: 'cm', description: 'height difference when sitting' },
    ],
    unknowns: [
      { symbol: 'h_lying', description: 'manometer reading when lying', unit: 'cm H₂O' },
      { symbol: 'h_sitting', description: 'manometer reading when sitting', unit: 'cm H₂O' },
    ],
    solution: {
      approach: 'Convert pressure to water column height, then account for elevation change when sitting.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert mm Hg to Pa first, then use the hydrostatic pressure equation' },
      { level: 2, hint: 'When sitting up, the fluid column creates additional hydrostatic pressure' },
      { level: 3, hint: 'The additional pressure depends on the spinal fluid density, not water density' },
    ],
    tags: ["biomedical","manometer","hydrostatic pressure","pressure measurement"],
  },

  {
    id: 'pdf-ch11-p76',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 76',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Blood Force on Aneurysm',
    statement: 'Calculate the maximum force in newtons exerted by the blood on an aneurysm, or ballooning, in a major artery, given the maximum blood pressure for this person is 150 mm Hg and the effective area of the aneurysm is 1.50 cm². Note that this force is great enough to cause further enlargement and subsequently greater force on the ever-thinner vessel wall.',
    givenValues: [
      { symbol: 'P_blood', value: 150, unit: 'mm Hg', description: 'maximum blood pressure' },
      { symbol: 'A', value: 1.50, unit: 'cm²', description: 'effective area of aneurysm' },
    ],
    unknowns: [
      { symbol: 'F', description: 'maximum force on aneurysm', unit: 'N' },
    ],
    solution: {
      approach: 'Convert pressure to Pa and area to m², then use F = PA.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use F = PA where P is pressure and A is area' },
      { level: 2, hint: 'Convert mm Hg to Pa using 1 mm Hg = 133.3 Pa' },
      { level: 3, hint: 'Convert cm² to m² by dividing by 10,000' },
    ],
    tags: ["biomedical","pressure","force","cardiovascular"],
  },

  {
    id: 'pdf-ch11-p77',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 77',
    concepts: ["pressure"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Spinal Disk Compression',
    statement: 'During heavy lifting, a disk between spinal vertebrae is subjected to a 5000-N compressional force. (a) What pressure is created, assuming that the disk has a uniform circular cross section 2.00 cm in radius? (b) What deformation is produced if the disk is 0.800 cm thick and has a Young\'s modulus of 1.50e6 Pa?',
    givenValues: [
      { symbol: 'F', value: 5000, unit: 'N', description: 'compressional force' },
      { symbol: 'r', value: 2.00, unit: 'cm', description: 'radius of disk' },
      { symbol: 't', value: 0.800, unit: 'cm', description: 'thickness of disk' },
      { symbol: 'Y', value: 1.50e6, unit: 'Pa', description: 'Young\'s modulus' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure created', unit: 'Pa' },
      { symbol: 'ΔL', description: 'deformation of disk', unit: 'm' },
    ],
    solution: {
      approach: 'Calculate pressure using P = F/A, then use Young\'s modulus to find deformation.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Calculate the circular cross-sectional area using A = πr²' },
      { level: 2, hint: 'Young\'s modulus relates stress (F/A) to strain (ΔL/L₀)' },
      { level: 3, hint: 'Rearrange Young\'s modulus equation to solve for ΔL' },
    ],
    tags: ["biomedical","pressure","elastic deformation","Young's modulus"],
  },

  {
    id: 'pdf-ch11-p78',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 78',
    concepts: ["pressure-depth"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Blood Pressure Change When Standing',
    statement: 'When a person sits erect, increasing the vertical position of their brain by 36.0 cm, the heart must continue to pump blood to the brain at the same rate. (a) What is the gain in gravitational potential energy for 100 mL of blood raised 36.0 cm? (b) What is the drop in pressure, neglecting any losses due to friction? (c) Discuss how the gain in gravitational potential energy and the decrease in pressure are related.',
    givenValues: [
      { symbol: 'V', value: 100, unit: 'mL', description: 'volume of blood' },
      { symbol: 'h', value: 36.0, unit: 'cm', description: 'height increase' },
      { symbol: 'ρ_blood', value: 1.05, unit: 'g/mL', description: 'density of blood' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'ΔPE', description: 'gain in potential energy', unit: 'J' },
      { symbol: 'ΔP', description: 'drop in pressure', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate potential energy change, then pressure change using hydrostatic principles.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Calculate the mass of blood first using m = ρV' },
      { level: 2, hint: 'Use ΔPE = mgh for potential energy and ΔP = ρgh for pressure change' },
      { level: 3, hint: 'The energy per unit volume (J/m³) equals the pressure change (Pa)' },
    ],
    tags: ["biomedical","potential energy","hydrostatic pressure","cardiovascular"],
  },

  {
    id: 'pdf-ch11-p79',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 79',
    concepts: ["pressure"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Capillary Action in Glass Tube',
    statement: '(a) How high will water rise in a glass capillary tube with a 0.500-mm radius? (b) How much gravitational potential energy does the water gain? (c) Discuss possible sources of this energy.',
    givenValues: [
      { symbol: 'r', value: 0.500, unit: 'mm', description: 'radius of capillary tube' },
      { symbol: 'γ', value: 0.0728, unit: 'N/m', description: 'surface tension of water' },
      { symbol: 'θ', value: 0, unit: 'degrees', description: 'contact angle for water on clean glass' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height of water rise', unit: 'm' },
      { symbol: 'ΔPE', description: 'gravitational potential energy gained', unit: 'J' },
    ],
    solution: {
      approach: 'Use capillary rise formula, then calculate potential energy of raised water column.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the capillary rise formula h = (2γ cos θ)/(ρgr)' },
      { level: 2, hint: 'For potential energy, use the center of mass height (h/2) since water is distributed along the column' },
      { level: 3, hint: 'Surface tension provides the energy by doing work as the meniscus rises' },
    ],
    tags: ["surface tension","capillary action","potential energy","fluid mechanics"],
  },

  {
    id: 'pdf-ch11-p80',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 80',
    concepts: ["pressure","pressure-depth"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Negative Pressure Water Lifting',
    statement: 'A negative pressure of 25.0 atm can sometimes be achieved with the device in Figure 11.41 before the water separates. (a) To what height could such a negative gauge pressure raise water? (b) How much would a steel wire of the same diameter and length as this capillary stretch if suspended from above?',
    givenValues: [
      { symbol: 'P', value: 25, unit: 'atm', description: 'negative gauge pressure' },
      { symbol: '\rho_{water}', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height water can be raised', unit: 'm' },
      { symbol: '\Delta L', description: 'stretch of steel wire', unit: 'm' },
    ],
    solution: {
      approach: 'Use pressure-depth relationship for part (a) and stress-strain relationship for part (b)',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert atmospheric pressure to Pascals first' },
      { level: 2, hint: 'Use the hydrostatic pressure formula P = ρgh' },
      { level: 3, hint: 'For wire stretch, you need σ = E·ε where E is Young\'s modulus' },
    ],
    tags: ["pressure","hydrostatics","negative pressure","materials"],
  },

  {
    id: 'pdf-ch11-p81',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 81',
    concepts: ["pressure"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Hammer Impact on Steel Nail',
    statement: 'Suppose you hit a steel nail with a 0.500-kg hammer, initially moving at 10.0 m/s and brought to rest in 2.80 mm. (a) What average force is exerted on the nail? (b) How much is the nail compressed if it is 2.50 mm in diameter and 6.00-cm long? (c) What pressure is created on the 1.00-mm-diameter tip of the nail?',
    givenValues: [
      { symbol: 'm', value: 0.5, unit: 'kg', description: 'mass of hammer' },
      { symbol: 'v_0', value: 10, unit: 'm/s', description: 'initial velocity of hammer' },
      { symbol: 'd', value: 2.8, unit: 'mm', description: 'stopping distance' },
      { symbol: 'D_{nail}', value: 2.5, unit: 'mm', description: 'nail diameter' },
      { symbol: 'L_{nail}', value: 6, unit: 'cm', description: 'nail length' },
      { symbol: 'D_{tip}', value: 1, unit: 'mm', description: 'tip diameter' },
    ],
    unknowns: [
      { symbol: 'F', description: 'average force on nail', unit: 'N' },
      { symbol: '\Delta L', description: 'compression of nail', unit: 'm' },
      { symbol: 'P', description: 'pressure on tip', unit: 'Pa' },
    ],
    solution: {
      approach: 'Use work-energy theorem for force, stress-strain for compression, and force/area for pressure',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use conservation of energy: kinetic energy converts to work done' },
      { level: 2, hint: 'Work = Force × distance for constant force' },
      { level: 3, hint: 'Pressure = Force/Area, be careful with units for the tip area' },
    ],
    tags: ["pressure","force","work-energy","materials","impact"],
  },

  {
    id: 'pdf-ch11-p82',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 82',
    concepts: ["pressure-depth","density"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Pressure at Mariana Trench',
    statement: 'Calculate the pressure due to the ocean at the bottom of the Marianas Trench near the Philippines, given its depth is 11.0 km and assuming the density of seawater is constant all the way down. (b) Calculate the percent decrease in volume of seawater due to such a pressure, assuming its bulk modulus is the same as water and is constant. (c) What would be the percent increase in its density? Is the assumption of constant density valid? Will the actual pressure be greater or smaller than that calculated under this assumption?',
    givenValues: [
      { symbol: 'h', value: 11, unit: 'km', description: 'depth of Mariana Trench' },
      { symbol: '\rho', value: 1025, unit: 'kg/m³', description: 'density of seawater' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
      { symbol: 'B', value: 2200000000, unit: 'Pa', description: 'bulk modulus of water' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure at depth', unit: 'Pa' },
      { symbol: '\Delta V/V', description: 'percent volume change', unit: '%' },
      { symbol: '\Delta \rho/\rho', description: 'percent density change', unit: '%' },
    ],
    solution: {
      approach: 'Use hydrostatic pressure formula, then bulk modulus relationship for volume and density changes',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use P = ρgh for hydrostatic pressure' },
      { level: 2, hint: 'Bulk modulus relates pressure change to volume change: B = -ΔP/(ΔV/V)' },
      { level: 3, hint: 'If volume decreases, density must increase since mass is conserved' },
    ],
    tags: ["pressure","depth","bulk modulus","compressibility","deep ocean"],
  },

  {
    id: 'pdf-ch11-p83',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 83',
    concepts: ["pascals-principle","pressure"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Hydraulic System of Backhoe',
    statement: 'The hydraulic system of a backhoe is used to lift a load as shown in Figure 11.42. (a) Calculate the force the secondary cylinder must exert to support the 400-kg load and the 150-kg brace and shovel. (b) What is the pressure in the hydraulic fluid if the secondary cylinder is 2.50 cm in diameter? (c) What force would you have to exert on a lever with a mechanical advantage of 5.00 acting on a primary cylinder 0.800 cm in diameter to create this pressure?',
    givenValues: [
      { symbol: 'm_{load}', value: 400, unit: 'kg', description: 'mass of load' },
      { symbol: 'm_{brace}', value: 150, unit: 'kg', description: 'mass of brace and shovel' },
      { symbol: 'D_2', value: 2.5, unit: 'cm', description: 'secondary cylinder diameter' },
      { symbol: 'D_1', value: 0.8, unit: 'cm', description: 'primary cylinder diameter' },
      { symbol: 'MA', value: 5, unit: 'dimensionless', description: 'mechanical advantage of lever' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'F_2', description: 'force from secondary cylinder', unit: 'N' },
      { symbol: 'P', description: 'pressure in hydraulic fluid', unit: 'Pa' },
      { symbol: 'F_{applied}', description: 'force applied to lever', unit: 'N' },
    ],
    solution: {
      approach: 'Use force balance, pressure definition, and Pascal\'s principle with mechanical advantage',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The secondary cylinder must support the total weight of load plus equipment' },
      { level: 2, hint: 'Pressure is force divided by area: P = F/A' },
      { level: 3, hint: 'Pascal\'s principle: same pressure throughout fluid, then apply mechanical advantage' },
    ],
    tags: ["hydraulics","pascals-principle","mechanical-advantage","pressure","force"],
  },

  {
    id: 'pdf-ch11-p84',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 84',
    concepts: ["pressure-depth"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 6,
    title: 'Mine Shaft Water Removal Problem',
    statement: 'Some miners wish to remove water from a mine shaft. A pipe is lowered to the water 90 m below, and a negative pressure is applied to raise the water. (a) Calculate the pressure needed to raise the water. (b) What is unreasonable about this pressure? (c) What is unreasonable about the premise?',
    givenValues: [
      { symbol: 'h', value: 90, unit: 'm', description: 'depth of water below surface' },
      { symbol: '\rho', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P', description: 'pressure needed to raise water', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate required pressure using hydrostatic formula, then analyze physical limitations',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure formula P = ρgh' },
      { level: 2, hint: 'Compare the required pressure to atmospheric pressure' },
      { level: 3, hint: 'Consider the physical limit of creating a vacuum - maximum is 1 atmosphere' },
    ],
    tags: ["pressure","vacuum","pumps","physical-limitations","conceptual"],
  },

  {
    id: 'pdf-ch11-p85',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 85',
    concepts: ["pressure"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Bicycle Tire Pump Force',
    statement: 'You are pumping up a bicycle tire with a hand pump, the piston of which has a 2.00-cm radius. (a) What force in newtons must you exert to create a pressure of 6.90e5 Pa (100 psi)? (b) What is unreasonable about this result? (c) Which premises are unreasonable or inconsistent?',
    givenValues: [
      { symbol: 'r', value: 2, unit: 'cm', description: 'radius of piston' },
      { symbol: 'P', value: 690000, unit: 'Pa', description: 'desired pressure (100 psi)' },
    ],
    unknowns: [
      { symbol: 'F', description: 'force required on piston', unit: 'N' },
    ],
    solution: {
      approach: 'Calculate force using pressure and area, then analyze reasonableness',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use F = P × A where A is the piston area' },
      { level: 2, hint: 'Calculate the area using A = πr²' },
      { level: 3, hint: 'Consider whether a person could realistically apply this much force' },
    ],
    tags: ["pressure","force","area","practical-applications","reasonableness"],
  },

  {
    id: 'pdf-ch11-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 1',
    concepts: ["density"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Volleyball Density Change with Radius Increase',
    statement: 'An under-inflated volleyball is pumped full of air so that its radius increases by 10%. Ignoring the mass of the air inserted into the ball, what will happen to the volleyball\'s density?\na. The density of the volleyball will increase by approximately 25%.\nb. The density of the volleyball will increase by approximately 10%.\nc. The density of the volleyball will decrease by approximately 10%.\nd. The density of the volleyball will decrease by approximately 17%.\ne. The density of the volleyball will decrease by approximately 25%.',
    givenValues: [
      { symbol: '\Delta r/r', value: 0.10, unit: '', description: 'fractional increase in radius' },
    ],
    unknowns: [
      { symbol: '\Delta \rho/\rho', description: 'fractional change in density', unit: '' },
    ],
    solution: {
      approach: 'Use the relationship between density, mass, and volume. Since mass stays constant and volume changes with radius cubed, calculate the density change.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that density = mass/volume, and the mass of the ball material stays constant.' },
      { level: 2, hint: 'Volume of a sphere is proportional to radius cubed.' },
      { level: 3, hint: 'If radius increases by 10%, then r_new = 1.10 × r_old, so volume increases by (1.10)³.' },
    ],
    tags: ["density","volume","sphere","multiple-choice"],
  },

  {
    id: 'pdf-ch11-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 2',
    concepts: ["density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Aluminum Foil Cube Dimensions',
    statement: 'A piece of aluminum foil has a known surface density of 15 g/cm². If a 100-gram hollow cube were constructed using this foil, determine the approximate side length of this cube.\na. 1.05 cm\nb. 1.10 cm\nc. 2.6 cm\nd. 6.67 cm\ne. 15 cm',
    givenValues: [
      { symbol: '\sigma', value: 15, unit: 'g/cm²', description: 'surface density of aluminum foil' },
      { symbol: 'm', value: 100, unit: 'g', description: 'total mass of cube' },
    ],
    unknowns: [
      { symbol: 's', description: 'side length of cube', unit: 'cm' },
    ],
    solution: {
      approach: 'Use the relationship between surface density, total surface area of cube, and mass to find the side length.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Surface density relates mass to surface area: mass = surface density × surface area.' },
      { level: 2, hint: 'A cube has 6 faces, each with area s².' },
      { level: 3, hint: 'Set up the equation: 100 g = 15 g/cm² × 6s² and solve for s.' },
    ],
    tags: ["density","surface-area","cube","multiple-choice"],
  },

  {
    id: 'pdf-ch11-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 3',
    concepts: ["density","buoyancy"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Polystyrene Block Floating Analysis',
    statement: 'A cube of polystyrene measuring 10 cm per side lies partially submerged in a large container of water.\na. If 90% of the polystyrene floats above the surface of the water, what is the density of the polystyrene? (Note: The density of water is 1000 kg/m³.)\nb. A 0.5 kg mass is placed on the block of polystyrene. What percentage of the block now remains above water?\nc. The water is poured out of the container and replaced with ethyl alcohol (density = 790 kg/m³).\n   i. Will the block be able to remain partially submerged in this new fluid? Explain.\n   ii. Will the block be able to remain partially submerged in this new fluid with the 0.5 kg mass placed on top? Explain.\nd. Without using a container of water, explain how you could determine the density of the polystyrene mentioned above if the material instead were spherical.',
    givenValues: [
      { symbol: 's', value: 10, unit: 'cm', description: 'side length of cube' },
      { symbol: '\rho_w', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'm_{added}', value: 0.5, unit: 'kg', description: 'added mass' },
      { symbol: '\rho_{alcohol}', value: 790, unit: 'kg/m³', description: 'density of ethyl alcohol' },
    ],
    unknowns: [
      { symbol: '\rho_p', description: 'density of polystyrene', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Use Archimedes\' principle and buoyancy equilibrium conditions for each part.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use Archimedes\' principle: buoyant force equals weight of displaced fluid.' },
      { level: 2, hint: 'For floating objects, the weight of the object equals the weight of the displaced fluid.' },
      { level: 3, hint: 'If 90% is above water, then 10% is submerged and displacing water.' },
    ],
    tags: ["buoyancy","archimedes-principle","floating","density"],
  },

  {
    id: 'pdf-ch11-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 4',
    concepts: ["density"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 12,
    title: 'Ranking Sphere Densities from Spring Data',
    statement: 'Four spheres are hung from a variety of different springs. The table below describes the characteristics of both the spheres and the springs from which they are hung. Use this information to rank the density of each sphere from least to greatest. Show work supporting your ranking.\n\n| Material | Radius of Sphere | Stretch of Spring | Spring Constant |\n|----------|------------------|-------------------|------------------|\n| A        | 10 cm           | 5 cm             | 2 N/m           |\n| B        | 5 cm            | 8 cm             | 8 N/m           |\n| C        | 8 cm            | 10 cm            | 6 N/m           |\n| D        | 8 cm            | 12 cm            | 10 N/m          |',
    givenValues: [
      { symbol: 'r_A', value: 10, unit: 'cm', description: 'radius of sphere A' },
      { symbol: 'x_A', value: 5, unit: 'cm', description: 'spring stretch for sphere A' },
      { symbol: 'k_A', value: 2, unit: 'N/m', description: 'spring constant for sphere A' },
      { symbol: 'r_B', value: 5, unit: 'cm', description: 'radius of sphere B' },
      { symbol: 'x_B', value: 8, unit: 'cm', description: 'spring stretch for sphere B' },
      { symbol: 'k_B', value: 8, unit: 'N/m', description: 'spring constant for sphere B' },
      { symbol: 'r_C', value: 8, unit: 'cm', description: 'radius of sphere C' },
      { symbol: 'x_C', value: 10, unit: 'cm', description: 'spring stretch for sphere C' },
      { symbol: 'k_C', value: 6, unit: 'N/m', description: 'spring constant for sphere C' },
      { symbol: 'r_D', value: 8, unit: 'cm', description: 'radius of sphere D' },
      { symbol: 'x_D', value: 12, unit: 'cm', description: 'spring stretch for sphere D' },
      { symbol: 'k_D', value: 10, unit: 'N/m', description: 'spring constant for sphere D' },
    ],
    unknowns: [
      { symbol: '\rho_{A,B,C,D}', description: 'densities of spheres A, B, C, D', unit: 'kg/m³' },
    ],
    solution: {
      approach: 'Use Hooke\'s law to find the weight of each sphere, then calculate density using sphere volume.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The spring force equals the weight of the sphere: F = kx = mg.' },
      { level: 2, hint: 'Density equals mass divided by volume: ρ = m/V where V = (4/3)πr³ for a sphere.' },
      { level: 3, hint: 'You can compare densities by calculating kx/r³ for each sphere since density is proportional to this ratio.' },
    ],
    tags: ["density","hookes-law","sphere-volume","ranking"],
  },

  {
    id: 'pdf-ch11-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 11, Problem 5',
    concepts: ["pressure","pressure-depth"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Pressure in Cylindrical Petroleum Ether Drum',
    statement: 'A cylindrical drum of radius 0.5 m is used to hold 400 liters of petroleum ether (density = 0.68 g/mL or 680 kg/m³). (Note: 1 liter = 0.001 m³)\na. Determine the amount of pressure applied to the walls of the drum if the petroleum ether fills the drum to its top.\nb. Determine the amount of pressure applied to the floor of the drum if the petroleum ether fills the drum to its top.\nc. If the drum were redesigned to hold 800 liters of petroleum ether:\n   i. How would the pressure on the walls change? Would it increase, decrease, or stay the same?\n   ii. How would the pressure on the floor change? Would it increase, decrease, or stay the same?',
    givenValues: [
      { symbol: 'r', value: 0.5, unit: 'm', description: 'radius of cylindrical drum' },
      { symbol: 'V', value: 400, unit: 'L', description: 'volume of petroleum ether' },
      { symbol: '\rho', value: 680, unit: 'kg/m³', description: 'density of petroleum ether' },
    ],
    unknowns: [
      { symbol: 'P_{wall}', description: 'pressure on walls', unit: 'Pa' },
      { symbol: 'P_{floor}', description: 'pressure on floor', unit: 'Pa' },
    ],
    solution: {
      approach: 'Calculate the height of fluid, then use hydrostatic pressure formula P = ρgh for different positions.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the hydrostatic pressure formula: P = ρgh, where h is the depth below the surface.' },
      { level: 2, hint: 'First find the height of the fluid using volume and cylinder area.' },
      { level: 3, hint: 'For pressure on walls, use average depth (h/2). For floor pressure, use full depth (h).' },
    ],
    tags: ["pressure","hydrostatic","cylinder","fluid-depth"],
  },

  {
    id: 'pdf-ch12-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 12, Problem 1',
    concepts: ["continuity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Water Speed Through Garden Hose and Nozzle',
    statement: 'A nozzle with a radius of 0.250 cm is attached to a garden hose with a radius of 0.900 cm. The flow rate through hose and nozzle is 0.500 L/s. Calculate the speed of the water (a) in the hose and (b) in the nozzle.',
    givenValues: [
      { symbol: 'r_1', value: 0.9, unit: 'cm', description: 'radius of garden hose' },
      { symbol: 'r_2', value: 0.25, unit: 'cm', description: 'radius of nozzle' },
      { symbol: 'Q', value: 0.5, unit: 'L/s', description: 'flow rate through system' },
    ],
    unknowns: [
      { symbol: 'v_1', description: 'speed of water in hose', unit: 'm/s' },
      { symbol: 'v_2', description: 'speed of water in nozzle', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use the relationship between flow rate and velocity Q = Av, and the continuity equation A₁v₁ = A₂v₂',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that flow rate Q = Av where A is cross-sectional area and v is velocity' },
      { level: 2, hint: 'For a circular pipe, the cross-sectional area is A = πr²' },
      { level: 3, hint: 'Use the continuity equation: the product Av must be the same at both locations' },
    ],
    tags: ["fluid-dynamics","continuity-equation","flow-rate","velocity"],
  },

  {
    id: 'pdf-ch12-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 12, Problem 2',
    concepts: ["continuity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Blood Flow in Cardiovascular System',
    statement: 'The aorta is the principal blood vessel through which blood leaves the heart in order to circulate around the body. (a) Calculate the average speed of the blood in the aorta if the flow rate is 5.0 L/min. The aorta has a radius of 10 mm. (b) Blood also flows through smaller blood vessels known as capillaries. When the rate of blood flow in the aorta is 5.0 L/min, the speed of blood in the capillaries is about 0.33 mm/s. Given that the average diameter of a capillary is 8.0 μm, calculate the number of capillaries in the blood circulatory system.',
    givenValues: [
      { symbol: 'Q', value: 5, unit: 'L/min', description: 'blood flow rate' },
      { symbol: 'r_1', value: 10, unit: 'mm', description: 'radius of aorta' },
      { symbol: 'v_2', value: 0.33, unit: 'mm/s', description: 'speed of blood in capillaries' },
      { symbol: 'd_2', value: 8, unit: 'μm', description: 'diameter of capillary' },
    ],
    unknowns: [
      { symbol: 'v_1', description: 'speed of blood in aorta', unit: 'm/s' },
      { symbol: 'N_2', description: 'number of capillaries', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use Q = Av for part (a), then apply continuity equation in general form for branching flow',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For part (a), use the basic relationship Q = Av' },
      { level: 2, hint: 'For part (b), the total flow rate must be conserved, but it\'s divided among many capillaries' },
      { level: 3, hint: 'The continuity equation for branching flow is A₁v₁ = N₂A₂v₂, where N₂ is the number of branches' },
    ],
    tags: ["cardiovascular-system","continuity-equation","branching-flow","blood-flow"],
  },

  {
    id: 'pdf-ch12-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 12, Problem 3',
    concepts: ["bernoulls-equation"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Pressure Drop in Water Hose and Nozzle',
    statement: 'In the previous problem, we found that the speed of water in a hose increased from 1.96 m/s to 25.5 m/s going from the hose to the nozzle. Calculate the pressure in the hose, given that the absolute pressure in the nozzle is 1.01e5 Pa (atmospheric, as it must be) and assuming level, frictionless flow.',
    givenValues: [
      { symbol: 'v_1', value: 1.96, unit: 'm/s', description: 'speed of water in hose' },
      { symbol: 'v_2', value: 25.5, unit: 'm/s', description: 'speed of water in nozzle' },
      { symbol: 'P_2', value: 101000, unit: 'Pa', description: 'absolute pressure in nozzle' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'density of water' },
    ],
    unknowns: [
      { symbol: 'P_1', description: 'absolute pressure in hose', unit: 'Pa' },
    ],
    solution: {
      approach: 'Apply Bernoulli\'s principle for constant height flow',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Since the flow is level, height terms cancel in Bernoulli\'s equation' },
      { level: 2, hint: 'Use Bernoulli\'s principle: P₁ + ½ρv₁² = P₂ + ½ρv₂²' },
      { level: 3, hint: 'The pressure in the hose must be higher than atmospheric to accelerate the water' },
    ],
    tags: ["bernoulli-principle","pressure","fluid-flow","constant-height"],
  },

  {
    id: 'pdf-ch12-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 12, Problem 4',
    concepts: ["bernoulls-equation"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Fire Hose Nozzle Pressure Calculation',
    statement: 'Fire hoses used in major structure fires have inside diameters of 6.40 cm. Suppose such a hose carries a flow of 40.0 L/s starting at a gauge pressure of 1.62e6 Pa. The hose goes 10.0 m up a ladder to a nozzle having an inside diameter of 3.00 cm. Assuming negligible resistance, what is the pressure in the nozzle?',
    givenValues: [
      { symbol: 'd_1', value: 6.4, unit: 'cm', description: 'inside diameter of hose' },
      { symbol: 'd_2', value: 3, unit: 'cm', description: 'inside diameter of nozzle' },
      { symbol: 'Q', value: 40, unit: 'L/s', description: 'flow rate' },
      { symbol: 'P_1', value: 1620000, unit: 'Pa', description: 'gauge pressure at ground level' },
      { symbol: 'h', value: 10, unit: 'm', description: 'height difference' },
      { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'density of water' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'P_2', description: 'gauge pressure in nozzle', unit: 'Pa' },
    ],
    solution: {
      approach: 'Apply full Bernoulli\'s equation accounting for height change and velocity differences',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'This problem requires the full Bernoulli equation since both height and velocity change' },
      { level: 2, hint: 'Calculate the velocities at both points using the continuity equation' },
      { level: 3, hint: 'Remember that the pressure decreases due to both increased velocity and increased height' },
    ],
    tags: ["bernoulli-equation","height-change","velocity-change","fire-hose","pressure-calculation"],
  },

  {
    id: 'pdf-ch12-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 12, Problem 5',
    concepts: ["bernoulls-equation"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Torricelli\'s Theorem - Water Exit Velocity',
    statement: 'Water flows from a large reservoir through an opening at a depth of 5.0 m below the surface. Assuming negligible resistance, calculate the speed of water as it emerges from the opening using Torricelli\'s theorem.',
    givenValues: [
      { symbol: 'h', value: 5, unit: 'm', description: 'depth below surface' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v', description: 'exit velocity of water', unit: 'm/s' },
    ],
    solution: {
      approach: 'Apply Torricelli\'s theorem, which states that the exit velocity equals the velocity from free fall through the same height',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'This is a direct application of Torricelli\'s theorem' },
      { level: 2, hint: 'The velocity at the exit is the same as if the water had fallen freely through height h' },
      { level: 3, hint: 'Use the kinematic equation v = √(2gh) for free fall' },
    ],
    tags: ["torricelli-theorem","exit-velocity","free-fall","reservoir"],
  },
];
