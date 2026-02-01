/**
 * AP Physics: Fluid Mechanics - Common Misconceptions
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { Misconception } from '../../types';

export const misconceptions: Misconception[] = [
  {
    id: 'density-mass-confusion',
    name: 'Density vs Mass Confusion',
    relatedConcepts: ['density'],
    severity: 'moderate',

    description: 'Believing that heavier objects are denser, or that density depends on the size or total mass of an object.',

    origin: 'In everyday language, "heavy" and "dense" are often used interchangeably. Students associate the feeling of heaviness with density rather than understanding it as mass per unit volume.',

    detectPatterns: {
      verbal: [
        'the heavy object is denser',
        'it has more mass so it\'s denser',
        'cut it in half and the density changes',
        'a bigger piece is denser',
      ],
      problemSolving: [
        'Using total mass instead of mass/volume to compare densities',
        'Thinking a larger block of wood is denser than a smaller one',
        'Confusing "heavier" with "denser"',
      ],
    },

    correction: {
      acknowledge: 'It makes sense to connect heaviness with density - in everyday life, dense things often feel heavy for their size.',
      conflictQuestion: 'Which is denser: a kilogram of lead or a kilogram of feathers?',
      conflictExample: 'They have the same mass (1 kg), but the lead takes up much less space. The lead is about 10,000 times denser because the same mass is packed into a tiny volume compared to the feathers.',
      correctExplanation: 'Density is mass per unit volume (ρ = m/V). It tells you how tightly packed the matter is, not how much total mass there is. A tiny piece of gold has the same density as a huge gold bar. Density is an intensive property - it doesn\'t depend on the amount of material.',
      verificationQuestion: 'If you had a 10 kg block of aluminum and cut it in half, what would happen to the density of each piece?',
    },

    persistence: 'medium',
  },

  {
    id: 'pressure-force-confusion',
    name: 'Pressure vs Force Confusion',
    relatedConcepts: ['pressure'],
    severity: 'moderate',

    description: 'Treating pressure and force as interchangeable, or believing that more force always means more pressure.',

    origin: 'Both pressure and force relate to "pushing," and everyday language doesn\'t distinguish them. We say "apply pressure" when we mean "apply force."',

    detectPatterns: {
      verbal: [
        'the pressure is 100 Newtons',
        'more force means more pressure',
        'pressure pushes the object',
        'applying pressure to the object',
      ],
      problemSolving: [
        'Using Newton as the unit for pressure',
        'Not considering area when comparing pressures',
        'Treating pressure as a vector with direction',
      ],
    },

    correction: {
      acknowledge: 'It\'s natural to connect pressure with pushing force - they are related! But physics defines them precisely.',
      conflictQuestion: 'Which applies more pressure to the ground: an elephant standing on all four feet, or a woman in high heels standing on one heel?',
      conflictExample: 'The elephant has much more weight (force), but the woman in high heels often exerts MORE pressure because the force is concentrated on a tiny area. High heels can damage floors that elephants walk across safely!',
      correctExplanation: 'Pressure = Force / Area. The same force creates more pressure when applied to a smaller area. That\'s why snowshoes (big area) help you walk on snow, and why sharp knives (tiny edge area) cut easily.',
      whiteboard: [
        {
          action: 'showTable',
          headers: ['Scenario', 'Force (N)', 'Area (m²)', 'Pressure (Pa)'],
          rows: [
            ['Elephant foot', '50,000', '0.1', '500,000'],
            ['High heel', '500', '0.0001', '5,000,000'],
          ],
        },
      ],
      verificationQuestion: 'Why do tractors have such wide tires?',
    },

    persistence: 'medium',
  },

  {
    id: 'pressure-direction',
    name: 'Pressure Only Acts Downward',
    relatedConcepts: ['pressure', 'pressure-depth'],
    severity: 'critical',

    description: 'Believing that pressure in a fluid only acts downward, or that pressure has a specific direction.',

    origin: 'We experience pressure from water "pushing down" on us when diving. The association of pressure with the weight of fluid above leads to thinking pressure is directional.',

    detectPatterns: {
      verbal: [
        'pressure pushes down on the object',
        'the pressure from above',
        'pressure in the downward direction',
        'water pressure only acts vertically',
      ],
      problemSolving: [
        'Drawing pressure arrows only pointing down',
        'Calculating only the downward pressure',
        'Forgetting sideways pressure on container walls',
      ],
    },

    correction: {
      acknowledge: 'It\'s true that we often think about the weight of fluid "above" us creating pressure. But there\'s more to the story.',
      conflictQuestion: 'When you dive underwater, why do your ears hurt equally from all directions, not just from above?',
      conflictExample: 'At depth, water presses on you from all sides - up, down, left, right, front, back - equally. That\'s why submarines are crushed from all directions, not just squished from top to bottom.',
      correctExplanation: 'Pressure in a fluid acts equally in all directions at any given point. This is because fluid molecules are in constant random motion, hitting surfaces from all angles. Pressure is a scalar (no direction), not a vector. The force it creates is always perpendicular to any surface.',
      whiteboard: [
        {
          action: 'showDiagram',
          type: 'pressure-all-directions',
          params: { showArrows: true },
        },
      ],
      verificationQuestion: 'A rectangular fish tank has water in it. Is the pressure on the bottom different from the pressure on the sides at the same depth?',
    },

    persistence: 'high',
    relatedMisconceptions: ['pressure-force-confusion'],
  },

  {
    id: 'pressure-container-shape',
    name: 'Pressure Depends on Container Shape',
    relatedConcepts: ['pressure-depth'],
    severity: 'moderate',

    description: 'Believing that pressure at a given depth depends on the shape or total volume of fluid in a container.',

    origin: 'Intuition suggests that more water should create more pressure. A wide lake seems like it should have more pressure than a narrow pipe of the same depth.',

    detectPatterns: {
      verbal: [
        'more water above means more pressure',
        'the wide container has more pressure',
        'pressure depends on the amount of water',
        'the lake has more pressure than the tube',
      ],
      problemSolving: [
        'Including container width in pressure calculations',
        'Thinking pressure differs in connected containers at the same depth',
        'Using volume instead of depth in p = ρgh',
      ],
    },

    correction: {
      acknowledge: 'It does seem logical that having more water above you would create more pressure. But this leads to a fascinating paradox!',
      conflictQuestion: 'Imagine a very narrow tube of water 10m tall versus a wide swimming pool 10m deep. At the bottom, which has greater pressure?',
      conflictExample: 'They have exactly the same pressure at 10m depth! This is called the hydrostatic paradox. It puzzled scientists for centuries. The pressure only depends on depth, not on how much water is off to the sides.',
      correctExplanation: 'Pressure at depth h equals p₀ + ρgh. Notice there\'s no term for width or total volume! Only the vertical depth matters. The water beside you isn\'t "above" you - it contributes no additional pressure. The container walls hold up the extra water.',
      verificationQuestion: 'If you connect a narrow tube to the bottom of a wide tank of water, where will the water level equalize?',
    },

    persistence: 'high',
  },

  {
    id: 'buoyancy-object-density',
    name: 'Buoyant Force Depends on Object Density',
    relatedConcepts: ['buoyancy'],
    severity: 'critical',

    description: 'Believing that the buoyant force depends on the object\'s density or weight, rather than on the fluid\'s density and displaced volume.',

    origin: 'Since heavy objects sink and light objects float, students assume buoyancy is less for heavy objects. The outcome (sink/float) is confused with the cause (buoyant force).',

    detectPatterns: {
      verbal: [
        'heavy objects have less buoyancy',
        'the buoyant force depends on the object\'s density',
        'denser objects experience less buoyant force',
        'it sinks because buoyancy is less',
      ],
      problemSolving: [
        'Using object density instead of fluid density in F_B = ρgV',
        'Calculating different buoyant forces for different materials of the same size',
        'Thinking a steel ball has less buoyant force than a wooden ball of the same size',
      ],
    },

    correction: {
      acknowledge: 'I see why you\'d think that - heavy things sink, so they must have less buoyancy, right? But let\'s look more carefully.',
      conflictQuestion: 'A solid steel cube and a hollow steel cube (same outer dimensions) are both fully submerged in water. Which experiences more buoyant force?',
      conflictExample: 'They experience exactly the same buoyant force! Both displace the same volume of water. The solid cube sinks because its weight exceeds the buoyant force; the hollow cube may float because its weight is less than the buoyant force. But the buoyant force is identical.',
      correctExplanation: 'Buoyant force = ρ_fluid × g × V_displaced. Notice: it depends on the FLUID\'s density and the DISPLACED VOLUME - not on anything about the object itself! The object\'s density determines whether it floats or sinks, but not the buoyant force magnitude.',
      whiteboard: [
        {
          action: 'showEquation',
          latex: 'F_B = \\rho_{fluid} \\cdot g \\cdot V_{displaced}',
          label: 'Buoyant force - note: no object properties!',
        },
      ],
      verificationQuestion: 'Two balls of the same size - one made of wood, one of iron - are both fully submerged. Compare their buoyant forces.',
    },

    persistence: 'high',
    relatedMisconceptions: ['density-mass-confusion'],
  },

  {
    id: 'continuity-slow-narrow',
    name: 'Fluid Slows in Narrow Sections',
    relatedConcepts: ['continuity'],
    severity: 'critical',

    description: 'Believing that fluid flows slower through narrow sections of a pipe, perhaps by analogy to traffic or people squeezing through a doorway.',

    origin: 'When people crowd through a narrow doorway, they slow down. Students transfer this intuition to fluid flow, not recognizing that incompressible fluids behave differently.',

    detectPatterns: {
      verbal: [
        'fluid slows down in narrow sections',
        'it\'s harder to get through so it slows',
        'constrictions slow the flow',
        'water backs up and slows at the narrow part',
      ],
      problemSolving: [
        'Predicting velocity decreases as area decreases',
        'Drawing slower velocity vectors in narrow pipes',
        'Using inverse continuity (A₁v₁ ≠ A₂v₂)',
      ],
    },

    correction: {
      acknowledge: 'That matches our experience with crowds - people slow down at bottlenecks. But fluids are different!',
      conflictQuestion: 'When you put your thumb over a garden hose opening, what happens to the water speed?',
      conflictExample: 'The water speeds up dramatically and sprays much farther! By reducing the opening, you\'re forcing the same volume of water per second through a smaller area - it has to speed up to maintain the flow rate.',
      correctExplanation: 'For incompressible fluids, A₁v₁ = A₂v₂ (continuity equation). If area decreases, velocity must INCREASE to maintain constant flow rate. The same volume must pass through per second, so smaller area means faster speed.',
      whiteboard: [
        {
          action: 'showDiagram',
          type: 'pipe-constriction',
          params: { showVelocityVectors: true },
        },
      ],
      verificationQuestion: 'A river flows slowly in a wide section. What happens to its speed when it enters a narrow gorge?',
    },

    persistence: 'high',
  },

  {
    id: 'bernoulli-fast-high-pressure',
    name: 'Fast Flow Means High Pressure',
    relatedConcepts: ['bernoullis-equation'],
    severity: 'critical',

    description: 'Believing that faster-moving fluid has higher pressure, perhaps because fast-moving water hits you harder.',

    origin: 'When you stand in a strong current or wind, you feel a strong "push." This is confused with static pressure. Students conflate the impact of momentum transfer with static fluid pressure.',

    detectPatterns: {
      verbal: [
        'fast-moving fluid has more pressure',
        'the pressure increases with velocity',
        'high-speed air creates high pressure',
        'the pressure is higher because it\'s moving faster',
      ],
      problemSolving: [
        'Adding velocity and pressure as though both increase together',
        'Expecting pressure to increase where a pipe narrows',
        'Incorrectly applying Bernoulli\'s equation',
      ],
    },

    correction: {
      acknowledge: 'Fast-moving water does hit you harder - but that\'s different from static pressure. Let me explain the key distinction.',
      conflictQuestion: 'In a horizontal pipe that narrows, where fluid speeds up, does the pressure increase or decrease?',
      conflictExample: 'Pressure DECREASES where the fluid speeds up! This is Bernoulli\'s principle. The energy that goes into speeding up the fluid has to come from somewhere - it comes from the pressure energy. That\'s why airplane wings work: fast air over the top has LOWER pressure.',
      correctExplanation: 'Bernoulli\'s equation: p + ½ρv² + ρgy = constant. If v increases, p must DECREASE to keep the sum constant. What you feel when hit by fast water is dynamic pressure (½ρv²), which is different from static pressure (p). Static pressure drops when velocity increases.',
      whiteboard: [
        {
          action: 'showEquation',
          latex: 'p_1 + \\frac{1}{2}\\rho v_1^2 = p_2 + \\frac{1}{2}\\rho v_2^2',
          label: 'If v₂ > v₁, then p₂ < p₁',
        },
      ],
      verificationQuestion: 'Air blows quickly between two pieces of paper hanging side by side. Do they move apart or come together? Why?',
    },

    persistence: 'high',
    relatedMisconceptions: ['pressure-force-confusion'],
  },

  {
    id: 'hydraulics-free-energy',
    name: 'Hydraulics Create Free Energy',
    relatedConcepts: ['pascals-principle'],
    severity: 'moderate',

    description: 'Believing that hydraulic systems create energy because they multiply force - getting more output force than input force.',

    origin: 'Seeing that a hydraulic jack can lift a car with a small pump stroke seems like magic. The force multiplication appears to violate energy conservation.',

    detectPatterns: {
      verbal: [
        'hydraulics create extra force',
        'you get more work out than you put in',
        'hydraulics multiply energy',
        'it lifts the car with less energy',
      ],
      problemSolving: [
        'Not accounting for distance in work calculations',
        'Thinking output work > input work',
        'Ignoring the force-distance trade-off',
      ],
    },

    correction: {
      acknowledge: 'Hydraulics do seem almost magical - how can a small force lift a heavy car? But energy is always conserved.',
      conflictQuestion: 'If a hydraulic lift multiplies force by 100, and you push down 10 cm on the small piston, how far does the car rise?',
      conflictExample: 'The car only rises 0.1 cm! You traded distance for force. Work = Force × Distance. You push with small force through a large distance; the car experiences large force through a small distance. Total work is the same (minus friction losses).',
      correctExplanation: 'Hydraulics multiply force, not work or energy. F₁d₁ = F₂d₂ (work is conserved). When area ratio is 100:1, force multiplies by 100, but distance divides by 100. You can\'t get something for nothing!',
      whiteboard: [
        {
          action: 'showTable',
          headers: ['', 'Small piston', 'Large piston'],
          rows: [
            ['Force', 'F', '100F'],
            ['Distance', 'd', 'd/100'],
            ['Work', 'Fd', 'Fd'],
          ],
        },
      ],
      verificationQuestion: 'A hydraulic press has a mechanical advantage of 50. If you push down 20 cm, how far does the output piston move?',
    },

    persistence: 'medium',
  },

  {
    id: 'viscosity-density-confusion',
    name: 'Viscosity vs Density Confusion',
    relatedConcepts: ['viscosity', 'density'],
    severity: 'minor',

    description: 'Confusing viscosity (resistance to flow) with density (mass per volume), often because both relate to "thickness."',

    origin: 'Everyday language uses "thick" for both viscous liquids (honey) and dense materials (lead). This linguistic overlap creates conceptual confusion.',

    detectPatterns: {
      verbal: [
        'honey is denser than water',
        'the thick fluid is denser',
        'high density means high viscosity',
        'mercury is viscous because it\'s dense',
      ],
      problemSolving: [
        'Using density when viscosity is needed',
        'Assuming dense fluids are more viscous',
        'Confusing the two properties in Poiseuille\'s law',
      ],
    },

    correction: {
      acknowledge: 'Both viscosity and density can make fluids seem "thick" - that\'s a tricky overlap in everyday language.',
      conflictQuestion: 'Mercury is very dense (13,600 kg/m³). Is it hard to pour like honey?',
      conflictExample: 'Mercury pours easily like water, despite being 13 times denser! It has LOW viscosity. Meanwhile, honey is less dense than mercury but much more viscous. Density tells you mass per volume; viscosity tells you resistance to flow. They\'re completely different properties.',
      correctExplanation: 'Density = mass/volume (how heavy per unit space). Viscosity = resistance to flow (how "sticky" internally). A liquid can be dense but flow easily (mercury), or not very dense but flow slowly (honey). The two properties are independent.',
      whiteboard: [
        {
          action: 'showTable',
          headers: ['Substance', 'Density (kg/m³)', 'Viscosity (Pa·s)'],
          rows: [
            ['Water', '1,000', '0.001'],
            ['Honey', '1,400', '2-10'],
            ['Mercury', '13,600', '0.0015'],
            ['Motor oil', '900', '0.1-0.3'],
          ],
        },
      ],
      verificationQuestion: 'Rank these from lowest to highest viscosity: water, honey, mercury.',
    },

    persistence: 'low',
    relatedMisconceptions: ['density-mass-confusion'],
  },

  {
    id: 'floating-heavy-light',
    name: 'Only Light Objects Float',
    relatedConcepts: ['buoyancy', 'density'],
    severity: 'moderate',

    description: 'Believing that only "light" objects can float, when floating actually depends on density relative to the fluid.',

    origin: 'Daily experience shows light things (leaves, wood) floating and heavy things (rocks, metal) sinking. Students generalize this to absolute weight rather than relative density.',

    detectPatterns: {
      verbal: [
        'it floats because it\'s light',
        'heavy things sink',
        'the ship is too heavy to float',
        'metal can\'t float',
      ],
      problemSolving: [
        'Using mass instead of density to predict floating',
        'Not understanding how ships float despite being made of steel',
        'Thinking larger objects can\'t float',
      ],
    },

    correction: {
      acknowledge: 'You\'re right that in everyday experience, light things often float. But there\'s more to the story!',
      conflictQuestion: 'A massive ocean liner made of steel weighs over 200,000 tons. How can it possibly float?',
      conflictExample: 'The ship floats because its AVERAGE density is less than water! The hull is mostly hollow (filled with air), so the total mass divided by total volume gives a density less than 1000 kg/m³. The steel shell itself is dense, but the ship as a whole isn\'t.',
      correctExplanation: 'Floating depends on average density compared to the fluid, not total mass. An object floats if ρ_object < ρ_fluid, regardless of how heavy it is. A 200,000-ton ship with average density 500 kg/m³ floats; a 1-gram solid iron nail (density 7,800 kg/m³) sinks.',
      verificationQuestion: 'How could you make a ball of clay float when a solid ball of clay sinks?',
    },

    persistence: 'medium',
    relatedMisconceptions: ['buoyancy-object-density'],
  },
];
