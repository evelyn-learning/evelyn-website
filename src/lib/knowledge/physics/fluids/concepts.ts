/**
 * AP Physics: Fluid Mechanics - Core Concepts
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { Concept } from '../../types';

export const concepts: Concept[] = [
  // ==========================================================================
  // FOUNDATIONAL CONCEPTS
  // ==========================================================================
  {
    id: 'density',
    name: 'Density',
    category: 'foundational',
    prerequisiteConcepts: [],

    definition: {
      formal: 'Density is the mass per unit volume of a substance, defined as ρ = m/V, where ρ (rho) is density, m is mass, and V is volume.',
      intuitive: 'Density tells you how much "stuff" is packed into a given space. A block of lead is denser than a block of wood of the same size because it has more mass crammed into the same volume.',
      forVoice: 'Density is how tightly packed the matter is in a substance. More mass in the same space means higher density.',
    },

    keyPoints: [
      'Density is an intrinsic property of a material - it doesn\'t depend on how much you have',
      'SI unit is kilograms per cubic meter (kg/m³)',
      'Water has a density of 1000 kg/m³ or 1 g/cm³',
      'Density determines whether objects sink or float',
      'Gases have much lower densities than liquids and solids',
    ],

    symbols: [
      { symbol: 'ρ', meaning: 'Density', unit: 'kilograms per cubic meter', unitSymbol: 'kg/m³' },
      { symbol: 'm', meaning: 'Mass', unit: 'kilograms', unitSymbol: 'kg' },
      { symbol: 'V', meaning: 'Volume', unit: 'cubic meters', unitSymbol: 'm³' },
    ],

    explanations: [
      {
        id: 'density-intuitive',
        approach: 'intuitive',
        name: 'Packing Analogy',
        content: 'Think of density like packing a suitcase. You can fit more clothes if you roll them tightly (high density) versus throwing them in loosely (low density). Materials with atoms packed closely together, like metals, have high density.',
        bestFor: 'Students new to the concept',
      },
      {
        id: 'density-comparison',
        approach: 'analogy',
        name: 'Common Materials Comparison',
        content: 'Water is our reference point at 1000 kg/m³. Air is about 1.2 kg/m³ - nearly 1000 times less dense! Lead is 11,340 kg/m³. Gold is even denser at 19,300 kg/m³. This is why gold feels so heavy for its size.',
        bestFor: 'Building intuition with familiar materials',
      },
    ],

    realWorldExamples: [
      {
        id: 'density-ice',
        scenario: 'Ice floating on water',
        connection: 'Ice is less dense than liquid water (917 kg/m³ vs 1000 kg/m³), which is why it floats - unusual for a solid!',
        difficulty: 'simple',
      },
      {
        id: 'density-hot-air-balloon',
        scenario: 'Hot air balloons rising',
        connection: 'Heating air decreases its density. The less dense hot air inside the balloon rises through the denser cold air outside.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Confusing density with mass',
        why: 'Both relate to "heaviness" in everyday language',
        detection: ['the heavy object has more density', 'it sinks because it has more mass'],
        correction: 'A small piece of lead has less mass than a large block of wood, but lead is denser. Density is mass per unit volume - it\'s about how tightly packed the material is, not total mass.',
      },
      {
        error: 'Thinking density depends on size',
        why: 'Students may think a bigger piece is denser',
        detection: ['the larger piece is denser', 'cutting it in half changes the density'],
        correction: 'Density is an intensive property - it stays the same regardless of how much material you have. A drop of water has the same density as a swimming pool of water.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate density from mass and volume',
        exampleTask: 'A block has mass 500 g and volume 200 cm³. What is its density?',
        successCriteria: 'Correctly calculates ρ = 2.5 g/cm³',
      },
      {
        level: 'application',
        description: 'Use density to predict floating/sinking',
        exampleTask: 'Will an object with density 800 kg/m³ float or sink in water?',
        successCriteria: 'Correctly predicts it floats because ρ_object < ρ_water',
      },
    ],

    checkQuestions: [
      'If you cut a block of aluminum in half, what happens to its density?',
      'Which is denser: a kilogram of feathers or a kilogram of lead?',
    ],

    masteryIndicators: [
      'Correctly distinguishes density from mass and weight',
      'Understands density as an intensive property',
      'Can predict floating/sinking from density comparison',
    ],
  },

  // ==========================================================================
  {
    id: 'pressure',
    name: 'Pressure',
    category: 'foundational',
    prerequisiteConcepts: [],

    definition: {
      formal: 'Pressure is the force per unit area applied perpendicular to a surface, defined as p = F/A, where p is pressure, F is the normal force, and A is the area.',
      intuitive: 'Pressure measures how concentrated a force is. The same force spread over a large area creates less pressure than when concentrated on a small area.',
      forVoice: 'Pressure is force divided by area. It tells you how much push is happening per unit of surface.',
    },

    keyPoints: [
      'SI unit is Pascal (Pa) = 1 N/m²',
      'Atmospheric pressure at sea level is about 101,325 Pa ≈ 101 kPa',
      'Pressure in a fluid acts in all directions equally at a point',
      'Pressure increases with depth in a fluid',
      'Pressure is a scalar quantity, not a vector',
    ],

    symbols: [
      { symbol: 'p', meaning: 'Pressure', unit: 'Pascal', unitSymbol: 'Pa' },
      { symbol: 'F', meaning: 'Force', unit: 'Newton', unitSymbol: 'N' },
      { symbol: 'A', meaning: 'Area', unit: 'square meters', unitSymbol: 'm²' },
      { symbol: 'p₀', meaning: 'Atmospheric pressure', unit: 'Pascal', unitSymbol: 'Pa' },
    ],

    explanations: [
      {
        id: 'pressure-snowshoes',
        approach: 'analogy',
        name: 'Snowshoe Analogy',
        content: 'Snowshoes work by spreading your weight over a large area, reducing pressure on the snow so you don\'t sink. High heels do the opposite - they concentrate your weight on a tiny area, creating enormous pressure (enough to damage floors!).',
        bestFor: 'Building intuition about force distribution',
      },
      {
        id: 'pressure-diving',
        approach: 'intuitive',
        name: 'Diving Experience',
        content: 'When you dive underwater, you feel pressure increasing in your ears. That\'s the weight of the water column above you pressing down. The deeper you go, the more water is above you, and the greater the pressure.',
        bestFor: 'Connecting to personal experience',
      },
    ],

    realWorldExamples: [
      {
        id: 'pressure-tire',
        scenario: 'Car tire pressure',
        connection: 'Tire pressure is measured in psi or kPa. Higher pressure means the tire can support more weight without deforming.',
        difficulty: 'simple',
        numbers: {
          typicalTirePressure: { value: 220, unit: 'kPa' },
        },
      },
      {
        id: 'pressure-knife',
        scenario: 'Sharp knives cutting easily',
        connection: 'A sharp knife concentrates force on a very small edge area, creating huge pressure that easily separates material.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Confusing pressure with force',
        why: 'Both relate to pushing, and everyday language doesn\'t distinguish them',
        detection: ['more pressure means more force', 'the pressure is 100 Newtons'],
        correction: 'Pressure is force per unit area. A larger force can create less pressure if spread over a bigger area. Units help: force is in Newtons, pressure is in Pascals (N/m²).',
      },
      {
        error: 'Thinking pressure only acts downward',
        why: 'We associate pressure with weight pushing down',
        detection: ['pressure pushes down on the object', 'water pressure is only from above'],
        correction: 'In a fluid, pressure acts equally in all directions at any point. That\'s why a submarine is squeezed from all sides, not just pushed from above.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate pressure from force and area',
        exampleTask: 'A 500 N force is applied over an area of 0.1 m². What is the pressure?',
        successCriteria: 'Correctly calculates p = 5000 Pa',
      },
      {
        level: 'application',
        description: 'Compare pressures in different scenarios',
        exampleTask: 'Who exerts more pressure on the floor: a 70 kg person standing on one foot (area 150 cm²) or an elephant (5000 kg on 4 feet, total area 2000 cm²)?',
        successCriteria: 'Correctly determines the person exerts more pressure',
      },
    ],

    checkQuestions: [
      'If you push with the same force using your palm versus your fingertip, which creates more pressure?',
      'Why do tractors have wide tires?',
    ],

    masteryIndicators: [
      'Correctly calculates pressure from force and area',
      'Understands pressure acts in all directions in fluids',
      'Can explain practical applications of pressure distribution',
    ],
  },

  // ==========================================================================
  {
    id: 'pressure-depth',
    name: 'Pressure and Depth',
    category: 'core',
    prerequisiteConcepts: ['pressure', 'density'],

    definition: {
      formal: 'In a static fluid, pressure increases linearly with depth according to p = p₀ + ρgh, where p₀ is the pressure at the surface, ρ is fluid density, g is gravitational acceleration, and h is depth.',
      intuitive: 'The deeper you go in a fluid, the more fluid is above you pushing down. Pressure increases by the weight of the fluid column per unit area.',
      forVoice: 'Pressure in a fluid increases with depth. The formula is p equals p naught plus rho g h, where h is how deep you are.',
    },

    keyPoints: [
      'Pressure increases linearly with depth',
      'Depends only on depth, not on the shape of container',
      'The term ρgh represents the weight of fluid column per unit area',
      'At the same depth, pressure is the same everywhere in a connected fluid',
      'Gauge pressure is p - p₀ = ρgh (pressure relative to atmospheric)',
    ],

    symbols: [
      { symbol: 'p', meaning: 'Absolute pressure at depth', unit: 'Pascal', unitSymbol: 'Pa' },
      { symbol: 'p₀', meaning: 'Surface pressure (usually atmospheric)', unit: 'Pascal', unitSymbol: 'Pa' },
      { symbol: 'ρ', meaning: 'Fluid density', unit: 'kilograms per cubic meter', unitSymbol: 'kg/m³' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'meters per second squared', unitSymbol: 'm/s²' },
      { symbol: 'h', meaning: 'Depth below surface', unit: 'meters', unitSymbol: 'm' },
    ],

    explanations: [
      {
        id: 'pressure-depth-column',
        approach: 'intuitive',
        name: 'Fluid Column Model',
        content: 'Imagine a tall column of water. At the bottom, you\'re supporting the weight of all the water above. Each additional meter of depth adds the same weight, so pressure increases at a constant rate with depth.',
        bestFor: 'Understanding why pressure increases linearly',
      },
      {
        id: 'pressure-depth-independence',
        approach: 'experimental',
        name: 'Shape Independence',
        content: 'Here\'s a surprising fact: pressure at a given depth is the same whether you\'re in a narrow tube or a wide lake! It only depends on depth, not on the total amount of water. This is called the hydrostatic paradox.',
        bestFor: 'Addressing a common misconception',
      },
    ],

    realWorldExamples: [
      {
        id: 'scuba-diving',
        scenario: 'Scuba diving depth limits',
        connection: 'At 10m depth, pressure is about 2 atm (double surface pressure). At 30m, it\'s 4 atm. This affects breathing and limits how deep you can safely dive.',
        difficulty: 'moderate',
        numbers: {
          depth10m: { value: 201, unit: 'kPa' },
          depth30m: { value: 401, unit: 'kPa' },
        },
      },
      {
        id: 'dam-thickness',
        scenario: 'Dam walls thicker at the bottom',
        connection: 'Dams are built thicker at the bottom because water pressure increases with depth. The bottom must withstand much greater pressure than the top.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Using total fluid volume instead of depth',
        why: 'Intuition suggests more water means more pressure',
        detection: ['pressure depends on how much water there is', 'the bigger container has more pressure'],
        correction: 'Pressure at a given depth is the same regardless of container shape or total volume. Only depth h matters. A deep narrow tube has higher bottom pressure than a shallow wide tank.',
      },
      {
        error: 'Forgetting surface pressure p₀',
        why: 'Focus on the depth term and forget atmospheric pressure',
        detection: ['pressure at 10m is 98,000 Pa', 'only including ρgh'],
        correction: 'The total pressure is p₀ + ρgh. At 10m in water, you have atmospheric pressure (101 kPa) PLUS water pressure (98 kPa), totaling about 199 kPa.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate pressure at a given depth',
        exampleTask: 'What is the absolute pressure at 5m depth in water? (ρ = 1000 kg/m³, p₀ = 101 kPa)',
        successCriteria: 'Correctly calculates p = 150 kPa',
      },
      {
        level: 'application',
        description: 'Compare pressures at different depths',
        exampleTask: 'At what depth in water does the pressure double compared to the surface?',
        successCriteria: 'Correctly finds h ≈ 10.3 m',
      },
    ],

    checkQuestions: [
      'If you swim at 5m depth in a lake versus 5m in a swimming pool, how does the pressure compare?',
      'What is gauge pressure, and how does it differ from absolute pressure?',
    ],

    masteryIndicators: [
      'Correctly applies p = p₀ + ρgh',
      'Understands pressure depends on depth, not container shape',
      'Distinguishes gauge and absolute pressure',
    ],
  },

  // ==========================================================================
  {
    id: 'pascals-principle',
    name: 'Pascal\'s Principle',
    category: 'core',
    prerequisiteConcepts: ['pressure'],

    definition: {
      formal: 'Pascal\'s principle states that a pressure change at any point in an enclosed, incompressible fluid is transmitted undiminished to all portions of the fluid and to the walls of the container.',
      intuitive: 'When you squeeze a closed container of fluid at one spot, the pressure increase is felt equally everywhere throughout the fluid.',
      forVoice: 'Pascal\'s principle says that pressure applied to a confined fluid spreads equally throughout. Push here, and everything inside feels it equally.',
    },

    keyPoints: [
      'Applies to enclosed, incompressible fluids',
      'Pressure change is transmitted instantaneously (in theory)',
      'Basis for hydraulic systems',
      'Force can be amplified: F₂/F₁ = A₂/A₁',
      'Work is conserved: distance moved is smaller when force is larger',
    ],

    symbols: [
      { symbol: 'F₁', meaning: 'Input force', unit: 'Newton', unitSymbol: 'N' },
      { symbol: 'F₂', meaning: 'Output force', unit: 'Newton', unitSymbol: 'N' },
      { symbol: 'A₁', meaning: 'Input piston area', unit: 'square meters', unitSymbol: 'm²' },
      { symbol: 'A₂', meaning: 'Output piston area', unit: 'square meters', unitSymbol: 'm²' },
    ],

    explanations: [
      {
        id: 'pascals-hydraulic',
        approach: 'intuitive',
        name: 'Hydraulic Lift Explanation',
        content: 'In a hydraulic lift, a small force on a small piston creates a pressure that\'s transmitted to a large piston. The large piston has more area, so the same pressure creates a larger force. Small input force becomes large output force!',
        bestFor: 'Understanding hydraulic systems',
      },
      {
        id: 'pascals-tradeoff',
        approach: 'step-by-step',
        name: 'Force-Distance Trade-off',
        content: 'You don\'t get something for nothing! While force increases, the distance moved decreases proportionally. Push the small piston 10 cm and the large piston might only move 1 cm. Work (force × distance) is conserved.',
        bestFor: 'Addressing the "free lunch" misconception',
      },
    ],

    realWorldExamples: [
      {
        id: 'car-brakes',
        scenario: 'Hydraulic car brakes',
        connection: 'When you press the brake pedal, hydraulic fluid transmits the pressure to brake cylinders at each wheel, applying force to stop the car.',
        difficulty: 'simple',
      },
      {
        id: 'car-lift',
        scenario: 'Auto shop car lifts',
        connection: 'A hydraulic lift uses Pascal\'s principle to allow a small pump to lift a heavy car. The lift piston has a much larger area than the pump piston.',
        difficulty: 'moderate',
        numbers: {
          areaRatio: { value: 100, unit: '' },
          forceMultiplied: { value: 100, unit: 'times' },
        },
      },
    ],

    commonErrors: [
      {
        error: 'Thinking hydraulics multiply energy or work',
        why: 'Students see force amplification and forget about distance',
        detection: ['hydraulics create free energy', 'you get more work out'],
        correction: 'Hydraulic systems multiply force, not energy. When force increases by factor 10, distance decreases by factor 10. Work = F × d stays the same (minus friction losses).',
      },
      {
        error: 'Applying Pascal\'s principle to compressible fluids',
        why: 'Not distinguishing gases from liquids',
        detection: ['air in the system', 'compressed gas transmits pressure'],
        correction: 'Pascal\'s principle requires an incompressible fluid. Gases compress, so pressure isn\'t transmitted uniformly. That\'s why hydraulic systems use oil, not air.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate force amplification',
        exampleTask: 'A hydraulic press has pistons with areas 10 cm² and 200 cm². If 50 N is applied to the small piston, what force is produced at the large piston?',
        successCriteria: 'Correctly calculates F₂ = 1000 N',
      },
      {
        level: 'analysis',
        description: 'Analyze work and energy in hydraulic systems',
        exampleTask: 'In the above system, if the small piston moves 20 cm, how far does the large piston move?',
        successCriteria: 'Correctly calculates d₂ = 1 cm and verifies W₁ = W₂',
      },
    ],

    checkQuestions: [
      'If a hydraulic lift multiplies force by 50 times, what happens to the distance moved?',
      'Why must hydraulic fluid be incompressible?',
    ],

    masteryIndicators: [
      'Correctly calculates force multiplication in hydraulic systems',
      'Understands work is conserved (force-distance trade-off)',
      'Recognizes the requirement for incompressible fluid',
    ],
  },

  // ==========================================================================
  {
    id: 'buoyancy',
    name: 'Buoyancy and Archimedes\' Principle',
    category: 'core',
    prerequisiteConcepts: ['pressure', 'density', 'pressure-depth'],

    definition: {
      formal: 'Archimedes\' principle states that the buoyant force on an object submerged in a fluid equals the weight of the fluid displaced by the object: F_B = ρ_fluid × V_displaced × g.',
      intuitive: 'An object in a fluid is pushed up by a force equal to the weight of the fluid it pushes aside. This is why things feel lighter in water.',
      forVoice: 'The buoyant force equals the weight of displaced fluid. More fluid pushed aside means more upward force.',
    },

    keyPoints: [
      'Buoyant force equals weight of displaced fluid: F_B = ρ_fluid × g × V_displaced',
      'Buoyancy depends on fluid density, not object density (directly)',
      'An object floats when F_B ≥ weight, sinks when F_B < weight',
      'For floating objects, weight = weight of fluid displaced',
      'Buoyancy results from pressure difference between top and bottom of object',
    ],

    symbols: [
      { symbol: 'F_B', meaning: 'Buoyant force', unit: 'Newton', unitSymbol: 'N' },
      { symbol: 'ρ_f', meaning: 'Fluid density', unit: 'kilograms per cubic meter', unitSymbol: 'kg/m³' },
      { symbol: 'V', meaning: 'Volume of fluid displaced', unit: 'cubic meters', unitSymbol: 'm³' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'meters per second squared', unitSymbol: 'm/s²' },
    ],

    explanations: [
      {
        id: 'buoyancy-pressure-difference',
        approach: 'step-by-step',
        name: 'Pressure Difference Origin',
        content: 'Why is there an upward force? Pressure increases with depth, so the bottom of a submerged object experiences higher pressure than the top. This pressure difference creates a net upward force - the buoyant force.',
        bestFor: 'Understanding why buoyancy exists',
      },
      {
        id: 'buoyancy-float-sink',
        approach: 'intuitive',
        name: 'Float vs Sink Decision',
        content: 'Compare the object\'s density to the fluid\'s density. If object density < fluid density, it floats. Equal densities: it hovers. Object denser: it sinks. That\'s why ice floats (density 917 kg/m³) in water (1000 kg/m³).',
        bestFor: 'Predicting floating and sinking',
      },
    ],

    realWorldExamples: [
      {
        id: 'buoyancy-ships',
        scenario: 'Ships floating despite being made of steel',
        connection: 'Ships have hollow hulls filled with air, making their average density less than water. The shape displaces enough water to support the ship\'s weight.',
        difficulty: 'moderate',
      },
      {
        id: 'buoyancy-submarine',
        scenario: 'Submarines changing depth',
        connection: 'Submarines have ballast tanks that fill with water to increase density (sink) or with air to decrease density (rise). They control buoyancy!',
        difficulty: 'moderate',
      },
      {
        id: 'buoyancy-hot-air-balloon',
        scenario: 'Hot air balloons',
        connection: 'Hot air is less dense than cold air, so the heated air inside the balloon experiences a net upward buoyant force from the surrounding cooler air.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Using object density instead of fluid density in F_B = ρgV',
        why: 'Students think about the object being buoyant',
        detection: ['F_B depends on object density', 'denser objects have more buoyancy'],
        correction: 'Buoyant force depends on the FLUID\'s density, not the object\'s. A steel cube and a wood cube of the same size experience the same buoyant force in water - but the steel sinks because its weight exceeds this force.',
      },
      {
        error: 'Thinking heavier objects experience less buoyancy',
        why: 'Heavier objects sink, so buoyancy must be smaller',
        detection: ['heavy objects have less buoyant force', 'buoyancy decreases with weight'],
        correction: 'Buoyancy depends on volume displaced, not weight. A heavy solid cube has the same buoyant force as a light hollow cube of the same size. The heavy one sinks because its weight exceeds the buoyant force, not because buoyancy is less.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate buoyant force',
        exampleTask: 'A cube with 0.1 m sides is fully submerged in water. What is the buoyant force? (ρ_water = 1000 kg/m³)',
        successCriteria: 'Correctly calculates F_B = 9.8 N',
      },
      {
        level: 'application',
        description: 'Determine floating or sinking',
        exampleTask: 'An object has mass 500 g and volume 400 cm³. Will it float or sink in water?',
        successCriteria: 'Correctly identifies it sinks (ρ = 1.25 g/cm³ > 1 g/cm³)',
      },
      {
        level: 'analysis',
        description: 'Calculate fraction submerged',
        exampleTask: 'A wooden block (ρ = 600 kg/m³) floats in water. What fraction is submerged?',
        successCriteria: 'Correctly calculates 60% submerged',
      },
    ],

    checkQuestions: [
      'A steel ball and a steel-coated hollow ball have the same size. Which experiences more buoyant force in water?',
      'Why does ice float with about 10% above the water surface?',
    ],

    masteryIndicators: [
      'Correctly calculates buoyant force using fluid density',
      'Can predict floating/sinking from density comparison',
      'Understands buoyancy comes from pressure difference',
    ],
  },

  // ==========================================================================
  {
    id: 'continuity',
    name: 'Continuity Equation (Flow Rate)',
    category: 'core',
    prerequisiteConcepts: ['density'],

    definition: {
      formal: 'For an incompressible fluid in steady flow, the continuity equation states that A₁v₁ = A₂v₂, where A is the cross-sectional area and v is the fluid velocity. The volume flow rate Q = Av is constant throughout the pipe.',
      intuitive: 'What flows in must flow out. If a pipe narrows, the fluid must speed up to maintain the same flow rate. Wide pipe = slow flow, narrow pipe = fast flow.',
      forVoice: 'The continuity equation says area times velocity is constant. When a pipe gets narrower, the fluid speeds up. When it widens, the fluid slows down.',
    },

    keyPoints: [
      'Volume flow rate Q = Av is constant (for incompressible fluids)',
      'A₁v₁ = A₂v₂ (continuity equation)',
      'Narrow sections have faster flow',
      'Wide sections have slower flow',
      'Mass is conserved: what goes in must come out',
    ],

    symbols: [
      { symbol: 'Q', meaning: 'Volume flow rate', unit: 'cubic meters per second', unitSymbol: 'm³/s' },
      { symbol: 'A', meaning: 'Cross-sectional area', unit: 'square meters', unitSymbol: 'm²' },
      { symbol: 'v', meaning: 'Fluid velocity', unit: 'meters per second', unitSymbol: 'm/s' },
    ],

    explanations: [
      {
        id: 'continuity-garden-hose',
        approach: 'analogy',
        name: 'Garden Hose Demonstration',
        content: 'When you put your thumb over a garden hose opening, you reduce the area. The water speeds up dramatically - that\'s continuity in action! The same volume per second must squeeze through a smaller opening, so velocity increases.',
        bestFor: 'Connecting to everyday experience',
      },
      {
        id: 'continuity-traffic',
        approach: 'analogy',
        name: 'Traffic Flow Analogy',
        content: 'Think of cars on a highway. When lanes merge and the road narrows, traffic bunches up. To maintain the same number of cars per minute passing through, they\'d need to speed up (or in reality, we get traffic jams when they can\'t!).',
        bestFor: 'Alternative intuitive explanation',
      },
    ],

    realWorldExamples: [
      {
        id: 'continuity-river',
        scenario: 'River rapids at narrow points',
        connection: 'Rivers flow faster through narrow gorges and slower in wide sections. The volume flow rate stays constant along the river.',
        difficulty: 'simple',
      },
      {
        id: 'continuity-artery',
        scenario: 'Blood flow in arteries',
        connection: 'Blood flows faster in narrow capillaries than in the wide aorta. However, the total cross-sectional area of all capillaries is actually larger, so blood slows there.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Thinking fluid slows down in narrow sections',
        why: 'Intuition from walking through a narrow space (you slow down)',
        detection: ['fluid slows in the narrow part', 'constriction slows the flow'],
        correction: 'For incompressible fluids, narrow sections have FASTER flow. The same volume must pass through per second, so a smaller area means higher velocity. Try squeezing a garden hose!',
      },
      {
        error: 'Confusing flow rate with velocity',
        why: 'Both describe "how fast" fluid moves',
        detection: ['flow rate increases in narrow pipe', 'flow rate is in m/s'],
        correction: 'Flow rate Q (m³/s) is volume per time - it stays constant. Velocity v (m/s) is how fast particles move - it changes with pipe area. Q = Av is constant means when A decreases, v increases.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Apply continuity equation',
        exampleTask: 'Water flows at 2 m/s through a 4 cm² pipe. What is its velocity in a 1 cm² section?',
        successCriteria: 'Correctly calculates v₂ = 8 m/s',
      },
      {
        level: 'application',
        description: 'Calculate flow rate',
        exampleTask: 'A pipe of radius 5 cm carries water at 3 m/s. What is the volume flow rate?',
        successCriteria: 'Correctly calculates Q ≈ 0.024 m³/s',
      },
    ],

    checkQuestions: [
      'If a pipe\'s cross-sectional area doubles, what happens to the fluid velocity?',
      'Why does water spray farther when you partially cover a hose opening?',
    ],

    masteryIndicators: [
      'Correctly applies A₁v₁ = A₂v₂',
      'Understands velocity increases when area decreases',
      'Distinguishes flow rate (Q) from velocity (v)',
    ],
  },

  // ==========================================================================
  {
    id: 'bernoullis-equation',
    name: 'Bernoulli\'s Equation',
    category: 'advanced',
    prerequisiteConcepts: ['pressure', 'continuity'],

    definition: {
      formal: 'Bernoulli\'s equation states that for steady, incompressible flow of a non-viscous fluid: p + ½ρv² + ρgy = constant. This expresses conservation of energy per unit volume along a streamline.',
      intuitive: 'As a fluid speeds up, its pressure drops. As it rises in height, pressure also drops. Energy is traded between pressure, kinetic, and potential forms.',
      forVoice: 'Bernoulli\'s equation relates pressure, velocity, and height. The key insight: where fluid moves faster, pressure is lower.',
    },

    keyPoints: [
      'p + ½ρv² + ρgy = constant along a streamline',
      'Higher velocity means lower pressure (and vice versa)',
      'Represents conservation of energy per unit volume',
      'Valid for ideal fluids (incompressible, non-viscous, steady flow)',
      'The term ½ρv² is called dynamic pressure',
    ],

    symbols: [
      { symbol: 'p', meaning: 'Static pressure', unit: 'Pascal', unitSymbol: 'Pa' },
      { symbol: 'ρ', meaning: 'Fluid density', unit: 'kilograms per cubic meter', unitSymbol: 'kg/m³' },
      { symbol: 'v', meaning: 'Fluid velocity', unit: 'meters per second', unitSymbol: 'm/s' },
      { symbol: 'y', meaning: 'Height above reference', unit: 'meters', unitSymbol: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'meters per second squared', unitSymbol: 'm/s²' },
    ],

    explanations: [
      {
        id: 'bernoulli-energy',
        approach: 'intuitive',
        name: 'Energy Conservation View',
        content: 'Think of a fluid parcel having three types of energy: pressure energy (p), kinetic energy (½ρv²), and gravitational potential energy (ρgy). As the fluid flows, energy converts between these forms, but the total stays constant.',
        bestFor: 'Students familiar with energy conservation',
      },
      {
        id: 'bernoulli-fast-low',
        approach: 'step-by-step',
        name: 'Fast Means Low Pressure',
        content: 'Why does fast-moving fluid have lower pressure? When fluid enters a narrow section and speeds up, that kinetic energy has to come from somewhere. It comes from the pressure energy - so pressure drops. This is counterintuitive but crucial!',
        bestFor: 'Addressing the main surprise of Bernoulli\'s principle',
      },
    ],

    realWorldExamples: [
      {
        id: 'bernoulli-airplane',
        scenario: 'Airplane wing lift',
        connection: 'Air moves faster over the curved top of a wing than the flat bottom. Faster flow = lower pressure on top. The pressure difference creates lift.',
        difficulty: 'moderate',
        followUpQuestions: [
          'Why are wings curved on top?',
          'How do planes fly upside down?',
        ],
      },
      {
        id: 'bernoulli-shower',
        scenario: 'Shower curtain blowing inward',
        connection: 'The fast-moving shower water creates a region of faster airflow, which has lower pressure than the still air outside. The pressure difference pushes the curtain inward.',
        difficulty: 'simple',
      },
      {
        id: 'bernoulli-baseball',
        scenario: 'Curveball in baseball',
        connection: 'A spinning ball drags air around it, creating faster flow on one side. Lower pressure on the fast side curves the ball\'s path.',
        difficulty: 'complex',
      },
    ],

    commonErrors: [
      {
        error: 'Thinking faster flow means higher pressure',
        why: 'Intuition from water hitting you harder',
        detection: ['fast water has more pressure', 'pressure increases with velocity'],
        correction: 'Static pressure DECREASES when velocity increases. What hits you harder is the dynamic pressure (½ρv²), but that\'s different from static pressure. In Bernoulli\'s equation, as v goes up, p goes down to keep the sum constant.',
      },
      {
        error: 'Applying Bernoulli\'s equation to viscous or turbulent flow',
        why: 'Not checking the assumptions',
        detection: ['using Bernoulli for honey flow', 'ignoring viscosity'],
        correction: 'Bernoulli\'s equation assumes ideal flow: incompressible, non-viscous, and steady. For thick fluids like honey or turbulent flow, you need more complex equations that account for energy dissipation.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Identify pressure changes',
        exampleTask: 'In a horizontal pipe, fluid speeds up from 2 m/s to 6 m/s. Does pressure increase or decrease?',
        successCriteria: 'Correctly identifies pressure decreases',
      },
      {
        level: 'application',
        description: 'Calculate pressure difference',
        exampleTask: 'Water flows at 1 m/s in a wide section and 3 m/s in a narrow section (same height). What is the pressure difference?',
        successCriteria: 'Correctly calculates Δp = 4000 Pa',
      },
      {
        level: 'analysis',
        description: 'Apply to real scenarios',
        exampleTask: 'Use Bernoulli\'s equation to explain why a shower curtain is pushed inward.',
        successCriteria: 'Correctly explains pressure difference from velocity difference',
      },
    ],

    checkQuestions: [
      'In a horizontal pipe, if velocity doubles, what happens to the static pressure?',
      'Why does Bernoulli\'s equation have three terms? What does each represent?',
    ],

    masteryIndicators: [
      'Correctly applies Bernoulli\'s equation to calculate pressure or velocity',
      'Understands that higher velocity means lower pressure',
      'Can explain everyday phenomena using Bernoulli\'s principle',
      'Recognizes when Bernoulli\'s equation does and doesn\'t apply',
    ],
  },

  // ==========================================================================
  {
    id: 'viscosity',
    name: 'Viscosity and Fluid Resistance',
    category: 'advanced',
    prerequisiteConcepts: ['pressure', 'continuity'],

    definition: {
      formal: 'Viscosity is a measure of a fluid\'s resistance to flow, arising from internal friction between fluid layers. It is defined by the shear stress to strain rate ratio: η = τ/(dv/dy).',
      intuitive: 'Viscosity is the "thickness" or resistance of a fluid. Honey has high viscosity (flows slowly), water has low viscosity (flows easily).',
      forVoice: 'Viscosity measures how thick or resistant to flow a fluid is. Think of honey versus water. Honey has high viscosity.',
    },

    keyPoints: [
      'High viscosity = flows slowly (honey, oil)',
      'Low viscosity = flows easily (water, air)',
      'Viscosity decreases with temperature for liquids',
      'SI unit is Pascal-second (Pa·s) or Poise (P)',
      'Viscosity causes energy dissipation (Bernoulli doesn\'t apply)',
    ],

    symbols: [
      { symbol: 'η', meaning: 'Dynamic viscosity', unit: 'Pascal-second', unitSymbol: 'Pa·s' },
      { symbol: 'τ', meaning: 'Shear stress', unit: 'Pascal', unitSymbol: 'Pa' },
    ],

    explanations: [
      {
        id: 'viscosity-layers',
        approach: 'intuitive',
        name: 'Fluid Layer Model',
        content: 'Imagine fluid as layers sliding over each other. In a viscous fluid, layers strongly resist sliding past each other - there\'s internal friction. In a low-viscosity fluid, layers slide easily. Honey layers stick together; water layers slide freely.',
        bestFor: 'Understanding the microscopic origin of viscosity',
      },
      {
        id: 'viscosity-temperature',
        approach: 'experimental',
        name: 'Temperature Effect',
        content: 'Heat your honey and it flows more easily. Cold motor oil is thick. This happens because higher temperature gives molecules more kinetic energy to overcome the intermolecular forces that cause viscosity.',
        bestFor: 'Connecting to everyday observations',
      },
    ],

    realWorldExamples: [
      {
        id: 'viscosity-motor-oil',
        scenario: 'Motor oil grades (5W-30, 10W-40)',
        connection: 'These numbers indicate viscosity at different temperatures. Lower first number = better cold flow. Higher second number = maintains viscosity when hot.',
        difficulty: 'moderate',
      },
      {
        id: 'viscosity-blood',
        scenario: 'Blood flow in the body',
        connection: 'Blood is more viscous than water. The heart must work harder to pump it, and blood pressure is affected by blood viscosity.',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Confusing viscosity with density',
        why: 'Both relate to "thick" fluids',
        detection: ['honey is denser than water so more viscous', 'mercury is thick'],
        correction: 'Density and viscosity are different! Mercury is very dense but flows easily (low viscosity). Honey is less dense than mercury but much more viscous. Density is mass/volume; viscosity is resistance to flow.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Compare viscosities',
        exampleTask: 'Rank from lowest to highest viscosity: water, honey, air, olive oil.',
        successCriteria: 'Correctly orders: air, water, olive oil, honey',
      },
      {
        level: 'application',
        description: 'Predict flow behavior',
        exampleTask: 'Why does syrup pour faster when heated?',
        successCriteria: 'Correctly explains viscosity decreases with temperature',
      },
    ],

    checkQuestions: [
      'Why do car engines need different oil viscosity in winter vs summer?',
      'Is honey denser or more viscous than water? Or both?',
    ],

    masteryIndicators: [
      'Correctly distinguishes viscosity from density',
      'Understands temperature effect on viscosity',
      'Can explain practical applications of viscosity',
    ],
  },
];
