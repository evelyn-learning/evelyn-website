/**
 * AP Physics: Fluid Mechanics - Worked Examples
 * Step-by-step walkthroughs with teaching notes for common problem types
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { WorkedExample } from '../../types';

export const workedExamples: WorkedExample[] = [
  {
    id: 'worked-density-calculation',
    title: 'Calculating Density and Predicting Floating',
    concepts: ['density', 'buoyancy'],
    difficulty: 2,

    problem: {
      statement: 'A wooden block has dimensions 20 cm × 10 cm × 5 cm and a mass of 800 g. Will this block float in water? If so, what fraction is submerged?',
      givenValues: [
        { symbol: 'l', value: 20, unit: 'cm', description: 'Length' },
        { symbol: 'w', value: 10, unit: 'cm', description: 'Width' },
        { symbol: 'h', value: 5, unit: 'cm', description: 'Height' },
        { symbol: 'm', value: 800, unit: 'g', description: 'Mass' },
      ],
      find: 'Whether it floats, and fraction submerged',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Let\'s start by figuring out what we need. To know if something floats, we compare its density to water\'s density. First, let\'s calculate the block\'s density.',
        checkQuestion: 'What\'s the formula for density?',
      },
      {
        step: 2,
        tutorSays: 'Right, density equals mass divided by volume. We have mass, so let\'s find the volume first.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'V = l \\times w \\times h = 20 \\times 10 \\times 5 = 1000\\text{ cm}^3',
          label: 'Volume calculation',
        },
      },
      {
        step: 3,
        tutorSays: 'Now we can find the density. What do you get?',
        checkQuestion: 'ρ = m/V = ?',
      },
      {
        step: 4,
        tutorSays: 'Let me show the calculation.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\rho = \\frac{800\\text{ g}}{1000\\text{ cm}^3} = 0.8\\text{ g/cm}^3',
          label: 'Density calculation',
        },
      },
      {
        step: 5,
        tutorSays: 'Now here\'s the key question: water has a density of 1.0 grams per cubic centimeter. Our block has a density of 0.8. Does it float or sink?',
        checkQuestion: 'Compare 0.8 g/cm³ to 1.0 g/cm³. Float or sink?',
        commonStumble: 'Students sometimes think "less dense means lighter means sinks" - remind them it\'s the opposite!',
      },
      {
        step: 6,
        tutorSays: 'Since the block is LESS dense than water, it floats! Objects float when their density is less than the fluid density. Now, what fraction is submerged?',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\frac{V_{sub}}{V_{total}} = \\frac{\\rho_{object}}{\\rho_{fluid}} = \\frac{0.8}{1.0} = 0.8 = 80\\%',
          label: 'Fraction submerged',
        },
      },
      {
        step: 7,
        tutorSays: '80% of the block is underwater. This makes sense - the block needs to displace enough water to equal its own weight. A denser block would sit lower in the water.',
      },
    ],

    keyTakeaways: [
      'An object floats when ρ_object < ρ_fluid',
      'Fraction submerged = ρ_object / ρ_fluid',
      'Denser objects sink lower (but may still float if ρ < ρ_fluid)',
      'The floating condition comes from weight = buoyant force',
    ],

    practiceNow: 'density-float-sink-1',
  },

  {
    id: 'worked-pressure-depth',
    title: 'Pressure at Different Depths',
    concepts: ['pressure-depth'],
    difficulty: 2,

    problem: {
      statement: 'A diver is 25 m below the surface of a lake. What is the total pressure on the diver? What is the gauge pressure? (Use ρ = 1000 kg/m³, g = 10 m/s², p₀ = 101 kPa)',
      givenValues: [
        { symbol: 'h', value: 25, unit: 'm', description: 'Depth' },
        { symbol: 'ρ', value: 1000, unit: 'kg/m³', description: 'Water density' },
        { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
        { symbol: 'p_0', value: 101, unit: 'kPa', description: 'Atmospheric pressure' },
      ],
      find: 'Total (absolute) pressure and gauge pressure',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Let\'s think about what creates pressure at the bottom of a lake. There\'s the atmosphere pressing down on the surface, PLUS all the water above the diver pressing down.',
        checkQuestion: 'What two contributions to pressure does the diver experience?',
      },
      {
        step: 2,
        tutorSays: 'Exactly - atmospheric pressure and water pressure. The water pressure comes from the weight of the water column above. That\'s where our formula comes from.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p = p_0 + \\rho g h',
          label: 'Pressure at depth',
        },
      },
      {
        step: 3,
        tutorSays: 'Let\'s calculate the water pressure first - that\'s the gauge pressure. It\'s just the ρgh part.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_{gauge} = \\rho g h = (1000)(10)(25) = 250,000\\text{ Pa} = 250\\text{ kPa}',
          label: 'Gauge pressure',
        },
      },
      {
        step: 4,
        tutorSays: 'Now for total pressure, we add atmospheric pressure. This is what the diver\'s body actually experiences.',
        checkQuestion: 'What\'s 101 kPa + 250 kPa?',
      },
      {
        step: 5,
        tutorSays: 'Total pressure is 351 kPa. Let\'s put that in perspective.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p = 101 + 250 = 351\\text{ kPa} \\approx 3.5\\text{ atm}',
          label: 'Absolute pressure',
        },
      },
      {
        step: 6,
        tutorSays: 'The diver experiences about 3.5 atmospheres of pressure. That\'s 3.5 times what you feel at the surface! This is why deep diving requires special equipment and training.',
        commonStumble: 'Students often forget to add p₀ when asked for absolute pressure. Gauge pressure is relative to atmosphere; absolute pressure is the total.',
      },
    ],

    keyTakeaways: [
      'Absolute pressure = p₀ + ρgh',
      'Gauge pressure = ρgh (pressure above atmospheric)',
      'Each 10 m of water depth adds about 1 atmosphere',
      'Most pressure gauges read gauge pressure, not absolute',
    ],

    practiceNow: 'pressure-depth-1',
  },

  {
    id: 'worked-hydraulic-system',
    title: 'Analyzing a Hydraulic System',
    concepts: ['pascals-principle'],
    difficulty: 3,

    problem: {
      statement: 'A hydraulic lift has pistons with diameters of 4 cm (input) and 40 cm (output). A force of 100 N is applied to the input piston. (a) What force is exerted by the output piston? (b) If the input piston moves down 20 cm, how far does the output piston move?',
      givenValues: [
        { symbol: 'd_1', value: 4, unit: 'cm', description: 'Input piston diameter' },
        { symbol: 'd_2', value: 40, unit: 'cm', description: 'Output piston diameter' },
        { symbol: 'F_1', value: 100, unit: 'N', description: 'Input force' },
        { symbol: 'h_1', value: 20, unit: 'cm', description: 'Input displacement' },
      ],
      find: 'Output force and output displacement',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Hydraulic systems use Pascal\'s principle: pressure applied to an enclosed fluid is transmitted equally throughout. Let\'s see how this creates force multiplication.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_1 = p_2 \\Rightarrow \\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
          label: 'Pascal\'s Principle',
        },
      },
      {
        step: 2,
        tutorSays: 'The key is the area ratio. Remember, area depends on radius (or diameter) SQUARED. What\'s the area ratio here?',
        checkQuestion: 'If d₂/d₁ = 40/4 = 10, what is A₂/A₁?',
      },
      {
        step: 3,
        tutorSays: 'Since area goes as diameter squared, A₂/A₁ = (d₂/d₁)² = 10² = 100. The output piston has 100 times the area!',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\frac{A_2}{A_1} = \\left(\\frac{d_2}{d_1}\\right)^2 = \\left(\\frac{40}{4}\\right)^2 = 100',
          label: 'Area ratio',
        },
      },
      {
        step: 4,
        tutorSays: 'Now we can find the output force. From F₁/A₁ = F₂/A₂, we get F₂ = F₁ × (A₂/A₁).',
        tutorDoes: {
          action: 'showEquation',
          latex: 'F_2 = F_1 \\times \\frac{A_2}{A_1} = 100 \\times 100 = 10,000\\text{ N}',
          label: 'Output force',
        },
      },
      {
        step: 5,
        tutorSays: 'Wow, 10,000 N from just 100 N input! But here\'s the catch - you don\'t get something for nothing. Let\'s find the output displacement.',
        commonStumble: 'Students sometimes think hydraulics multiply work. They don\'t - work is conserved.',
      },
      {
        step: 6,
        tutorSays: 'The fluid volume pushed out of one cylinder equals the volume entering the other. Volume is area times height.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'A_1 h_1 = A_2 h_2 \\Rightarrow h_2 = h_1 \\times \\frac{A_1}{A_2}',
          label: 'Volume conservation',
        },
      },
      {
        step: 7,
        tutorSays: 'The output moves 100 times LESS than the input - that\'s the trade-off!',
        tutorDoes: {
          action: 'showEquation',
          latex: 'h_2 = 20 \\times \\frac{1}{100} = 0.2\\text{ cm} = 2\\text{ mm}',
          label: 'Output displacement',
        },
      },
      {
        step: 8,
        tutorSays: 'Let\'s verify work is conserved. Input work: 100 N × 0.2 m = 20 J. Output work: 10,000 N × 0.002 m = 20 J. Perfect - work is the same!',
      },
    ],

    keyTakeaways: [
      'Force multiplication = Area ratio = (d₂/d₁)²',
      'Distance reduction = 1/(Area ratio)',
      'Work is conserved: F₁d₁ = F₂d₂',
      'You trade distance for force - no free lunch!',
    ],

    practiceNow: 'hydraulic-lift-1',
  },

  {
    id: 'worked-buoyancy-analysis',
    title: 'Analyzing Buoyant Force and Apparent Weight',
    concepts: ['buoyancy'],
    difficulty: 3,

    problem: {
      statement: 'A solid aluminum cube (ρ = 2700 kg/m³) with sides of 10 cm is suspended from a scale and lowered into water. What does the scale read when the cube is (a) in air, and (b) fully submerged in water? (ρ_water = 1000 kg/m³, g = 10 m/s²)',
      givenValues: [
        { symbol: 's', value: 10, unit: 'cm', description: 'Side length' },
        { symbol: 'ρ_{Al}', value: 2700, unit: 'kg/m³', description: 'Aluminum density' },
        { symbol: 'ρ_w', value: 1000, unit: 'kg/m³', description: 'Water density' },
      ],
      find: 'Scale reading in air and in water',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'First, let\'s find the weight in air. We need mass, which comes from density and volume.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'V = (0.1\\text{ m})^3 = 0.001\\text{ m}^3',
          label: 'Volume',
        },
      },
      {
        step: 2,
        tutorSays: 'Now we can find the mass using ρ = m/V.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'm = \\rho V = 2700 \\times 0.001 = 2.7\\text{ kg}',
          label: 'Mass',
        },
      },
      {
        step: 3,
        tutorSays: 'The weight in air is straightforward.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'W = mg = 2.7 \\times 10 = 27\\text{ N}',
          label: 'Weight in air',
        },
      },
      {
        step: 4,
        tutorSays: 'Now for the interesting part - what happens when we submerge it in water? The water exerts an upward buoyant force.',
        checkQuestion: 'What determines the buoyant force?',
      },
      {
        step: 5,
        tutorSays: 'The buoyant force equals the weight of water displaced. Since the cube is fully submerged, it displaces its own volume of water.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'F_B = \\rho_w g V = 1000 \\times 10 \\times 0.001 = 10\\text{ N}',
          label: 'Buoyant force',
        },
      },
      {
        step: 6,
        tutorSays: 'The scale reads the apparent weight - that\'s the true weight minus the buoyant force.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'W_{apparent} = W - F_B = 27 - 10 = 17\\text{ N}',
          label: 'Apparent weight',
        },
      },
      {
        step: 7,
        tutorSays: 'The cube seems to "weigh" only 17 N when in water. This is why things feel lighter in water! The water is helping support them.',
        commonStumble: 'Students sometimes think the buoyant force depends on the object\'s density. It doesn\'t - only on fluid density and displaced volume.',
      },
    ],

    keyTakeaways: [
      'Apparent weight = True weight - Buoyant force',
      'Buoyant force = ρ_fluid × g × V_displaced',
      'Buoyancy depends on FLUID density, not object density',
      'Objects feel lighter in denser fluids',
    ],

    practiceNow: 'buoyancy-apparent-weight-1',
  },

  {
    id: 'worked-bernoulli-pipe',
    title: 'Applying Bernoulli\'s Equation to Pipe Flow',
    concepts: ['bernoullis-equation', 'continuity'],
    difficulty: 4,

    problem: {
      statement: 'Water flows through a horizontal pipe. In a wide section (diameter 10 cm), the pressure is 300 kPa and velocity is 2 m/s. The pipe narrows to diameter 5 cm. Find the velocity and pressure in the narrow section. (ρ = 1000 kg/m³)',
      givenValues: [
        { symbol: 'd_1', value: 10, unit: 'cm', description: 'Wide section diameter' },
        { symbol: 'd_2', value: 5, unit: 'cm', description: 'Narrow section diameter' },
        { symbol: 'p_1', value: 300000, unit: 'Pa', description: 'Pressure in wide section' },
        { symbol: 'v_1', value: 2, unit: 'm/s', description: 'Velocity in wide section' },
      ],
      find: 'Velocity and pressure in narrow section',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'This problem needs two principles: continuity to find velocity, then Bernoulli to find pressure. Let\'s start with continuity.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'A_1 v_1 = A_2 v_2',
          label: 'Continuity equation',
        },
      },
      {
        step: 2,
        tutorSays: 'The area ratio is the square of the diameter ratio. What\'s A₁/A₂?',
        checkQuestion: 'If d₁/d₂ = 10/5 = 2, then A₁/A₂ = ?',
      },
      {
        step: 3,
        tutorSays: 'A₁/A₂ = 4, so the velocity must increase by a factor of 4 to maintain constant flow rate.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_2 = v_1 \\times \\frac{A_1}{A_2} = 2 \\times 4 = 8\\text{ m/s}',
          label: 'Velocity in narrow section',
        },
      },
      {
        step: 4,
        tutorSays: 'Now for the pressure. Here\'s the crucial question: when velocity increases, what happens to pressure?',
        checkQuestion: 'According to Bernoulli, does pressure increase or decrease?',
        commonStumble: 'Many students intuitively think faster flow = higher pressure. Bernoulli says the opposite!',
      },
      {
        step: 5,
        tutorSays: 'Pressure DECREASES when velocity increases - that\'s Bernoulli\'s key insight. Let\'s calculate. For horizontal flow, we use:',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_1 + \\frac{1}{2}\\rho v_1^2 = p_2 + \\frac{1}{2}\\rho v_2^2',
          label: 'Bernoulli (horizontal)',
        },
      },
      {
        step: 6,
        tutorSays: 'Let\'s solve for p₂.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_2 = p_1 + \\frac{1}{2}\\rho(v_1^2 - v_2^2) = 300,000 + \\frac{1}{2}(1000)(4 - 64)',
          label: 'Solving for p₂',
        },
      },
      {
        step: 7,
        tutorSays: 'Let me compute that.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_2 = 300,000 - 30,000 = 270,000\\text{ Pa} = 270\\text{ kPa}',
          label: 'Pressure in narrow section',
        },
      },
      {
        step: 8,
        tutorSays: 'The pressure dropped from 300 kPa to 270 kPa as the water sped up from 2 to 8 m/s. The kinetic energy increased, so pressure energy had to decrease. That\'s energy conservation in fluids!',
      },
    ],

    keyTakeaways: [
      'Use continuity first to find velocity changes',
      'Velocity increases when pipe narrows',
      'CRITICAL: Pressure DECREASES when velocity increases',
      'Bernoulli is energy conservation per unit volume',
    ],

    practiceNow: 'bernoulli-pressure-1',
  },

  {
    id: 'worked-torricelli',
    title: 'Draining a Tank - Torricelli\'s Law',
    concepts: ['bernoullis-equation'],
    difficulty: 3,

    problem: {
      statement: 'Water drains from a large tank through a small hole at the bottom. The water surface is 5 m above the hole. What is the speed of water leaving the hole? What volume flows out per second if the hole has diameter 2 cm? (g = 10 m/s²)',
      givenValues: [
        { symbol: 'h', value: 5, unit: 'm', description: 'Height of water above hole' },
        { symbol: 'd', value: 2, unit: 'cm', description: 'Hole diameter' },
        { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
      ],
      find: 'Exit velocity and volume flow rate',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'This is a classic application of Bernoulli\'s equation called Torricelli\'s law. The water at the surface and at the hole are at the same pressure - both are open to atmosphere.',
        checkQuestion: 'What is the pressure at both the surface and the hole?',
      },
      {
        step: 2,
        tutorSays: 'Both are at atmospheric pressure. Also, the tank is large, so the surface level drops very slowly - we can say the surface velocity is essentially zero.',
        tutorDoes: {
          action: 'showTable',
          headers: ['', 'Surface (1)', 'Hole (2)'],
          rows: [
            ['Pressure', 'p₀', 'p₀'],
            ['Velocity', '≈ 0', 'v (find this!)'],
            ['Height', 'h', '0'],
          ],
        },
      },
      {
        step: 3,
        tutorSays: 'Let\'s apply Bernoulli between the surface and the hole.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'p_0 + 0 + \\rho g h = p_0 + \\frac{1}{2}\\rho v^2 + 0',
          label: 'Bernoulli equation',
        },
      },
      {
        step: 4,
        tutorSays: 'The p₀ terms cancel, and we\'re left with something beautiful!',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\rho g h = \\frac{1}{2}\\rho v^2 \\Rightarrow v = \\sqrt{2gh}',
          label: 'Torricelli\'s Law',
        },
      },
      {
        step: 5,
        tutorSays: 'This is Torricelli\'s law! Notice it\'s the same as the free-fall formula. Water exits at the same speed it would have if it fell freely from the surface height.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v = \\sqrt{2 \\times 10 \\times 5} = \\sqrt{100} = 10\\text{ m/s}',
          label: 'Exit velocity',
        },
      },
      {
        step: 6,
        tutorSays: 'Now for the flow rate. We need the area of the hole.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'A = \\pi r^2 = \\pi (0.01)^2 = 3.14 \\times 10^{-4}\\text{ m}^2',
          label: 'Hole area',
        },
      },
      {
        step: 7,
        tutorSays: 'Volume flow rate is area times velocity.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'Q = Av = (3.14 \\times 10^{-4})(10) = 3.14 \\times 10^{-3}\\text{ m}^3/\\text{s} = 3.14\\text{ L/s}',
          label: 'Flow rate',
        },
      },
    ],

    keyTakeaways: [
      'Torricelli\'s law: v = √(2gh)',
      'Exit velocity = free-fall velocity from that height',
      'Same physics as free-fall - just applied to fluids',
      'Flow rate Q = Area × velocity',
    ],

    practiceNow: 'torricelli-tank-1',
  },
];
