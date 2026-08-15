/**
 * AP Physics: Fluid Mechanics Module
 *
 * Comprehensive knowledge base for fluid mechanics including:
 * - Density and pressure
 * - Pascal's principle and hydraulics
 * - Buoyancy and Archimedes' principle
 * - Fluid flow and continuity
 * - Bernoulli's equation and applications
 * - Viscosity and flow resistance
 *
 * Based on OpenStax University Physics Volume 1, Chapter 14
 */

import type { KnowledgeModule, RealWorldExample } from '../../types';
import { concepts } from './concepts';
import { equations } from './equations';
import { misconceptions } from './misconceptions';
import { problems } from './problems';
import { workedExamples } from './workedExamples';

/**
 * Real-world connections to make fluid mechanics tangible
 */
const realWorldConnections: RealWorldExample[] = [
  {
    id: 'ship-floating',
    scenario: 'A massive steel cargo ship floats while a small steel bolt sinks',
    connection: 'The ship floats because its hollow hull creates a low average density - less than water. The solid bolt has the full density of steel (7800 kg/m³), much greater than water.',
    difficulty: 'moderate',
    numbers: {
      steelDensity: { value: 7800, unit: 'kg/m³' },
      waterDensity: { value: 1000, unit: 'kg/m³' },
      shipAverageDensity: { value: 300, unit: 'kg/m³' },
    },
    followUpQuestions: [
      'How could you make a ball of clay float?',
      'Why do ships sit lower in fresh water than salt water?',
    ],
  },
  {
    id: 'hydraulic-brakes',
    scenario: 'Car brakes - a gentle press stops a 2-ton car',
    connection: 'Hydraulic brakes use Pascal\'s principle to multiply your foot\'s force. The master cylinder has a small area; wheel cylinders have large areas, multiplying force by 5-10 times.',
    difficulty: 'moderate',
    numbers: {
      pedalForce: { value: 200, unit: 'N' },
      brakeForce: { value: 2000, unit: 'N' },
      mechanicalAdvantage: { value: 10, unit: '' },
    },
    followUpQuestions: [
      'Why is it critical to remove air bubbles from brake fluid?',
      'What happens to braking distance if you need twice the force?',
    ],
  },
  {
    id: 'airplane-lift',
    scenario: 'Airplane wings generating lift',
    connection: 'Air flows faster over the curved top of the wing than the flat bottom. By Bernoulli\'s principle, faster flow = lower pressure. The pressure difference creates lift.',
    difficulty: 'complex',
    numbers: {
      cruiseSpeed: { value: 250, unit: 'm/s' },
      wingArea: { value: 120, unit: 'm²' },
      liftForce: { value: 800000, unit: 'N' },
    },
    followUpQuestions: [
      'Why do planes need to go fast to take off?',
      'How can planes fly upside down if lift depends on wing shape?',
    ],
  },
  {
    id: 'scuba-diving',
    scenario: 'Scuba diving and pressure changes',
    connection: 'Every 10m of depth adds about 1 atmosphere of pressure. At 30m, you experience 4 atmospheres! This affects breathing, nitrogen absorption, and why you must ascend slowly.',
    difficulty: 'moderate',
    numbers: {
      surfacePressure: { value: 101, unit: 'kPa' },
      pressurePer10m: { value: 100, unit: 'kPa' },
      pressureAt30m: { value: 401, unit: 'kPa' },
    },
    followUpQuestions: [
      'Why is the second half of a scuba tank used faster than the first?',
      'What causes "the bends" when ascending too quickly?',
    ],
  },
  {
    id: 'garden-hose',
    scenario: 'Thumb over a garden hose makes water spray farther',
    connection: 'The continuity equation in action! When you reduce the opening area, velocity must increase to maintain constant flow rate. A₁v₁ = A₂v₂ means smaller A → bigger v.',
    difficulty: 'simple',
    numbers: {
      hoseVelocity: { value: 2, unit: 'm/s' },
      thumbOpeningVelocity: { value: 15, unit: 'm/s' },
      areaReduction: { value: 7.5, unit: 'times' },
    },
    followUpQuestions: [
      'Does the water flow rate (liters/second) change when you cover the hose?',
      'What happens to pressure in the constricted region?',
    ],
  },
  {
    id: 'blood-pressure',
    scenario: 'Blood pressure measurement (120/80 mmHg)',
    connection: 'Blood pressure is measured as gauge pressure relative to atmosphere. The 120 is systolic (heart pumping), 80 is diastolic (heart relaxed). Both are in mmHg - millimeters of mercury.',
    difficulty: 'moderate',
    numbers: {
      systolic: { value: 16, unit: 'kPa' },
      diastolic: { value: 10.7, unit: 'kPa' },
    },
    followUpQuestions: [
      'Why is blood pressure higher in your feet than your head?',
      'What happens to blood flow if an artery narrows?',
    ],
  },
];

export const module: KnowledgeModule = {
  // Identity
  id: 'physics-fluids-ap',
  subject: 'physics',
  topic: 'fluids',
  level: 'AP',
  version: '1.0.0',

  // Display
  displayName: 'AP Physics: Fluid Mechanics',
  description:
    'Fluid statics and dynamics - density, pressure, buoyancy, flow rate, and Bernoulli\'s principle.',
  estimatedHours: 8,

  // Content
  concepts,
  equations,
  misconceptions,
  problems,
  workedExamples,
  realWorldConnections,

  // Visuals
  diagramTypes: [
    'pressure-depth',
    'hydraulic-system',
    'buoyancy',
    'pipe-flow',
    'bernoulli',
    'manometer',
    'free-body',
  ],

  // AI Behavior
  systemPromptAdditions: `
## Fluid Mechanics-Specific Guidelines

You are teaching AP Physics Fluid Mechanics. This topic connects to many everyday experiences and engineering applications.

### Core Teaching Philosophy

**Build on Intuition, Then Challenge It**: Students have lots of experience with fluids - swimming, drinking through straws, water hoses. Use these experiences, but be ready to challenge misconceptions (especially about pressure direction and Bernoulli's principle).

**Emphasize the Counterintuitive**: Fluid mechanics has several results that surprise students:
- Pressure acts in ALL directions, not just down
- Faster flow means LOWER pressure (Bernoulli)
- Buoyant force depends on fluid density, not object density
- Pressure depends on depth, not container shape

### Key Concepts to Emphasize

1. **Density vs Mass**: Make sure students understand density is mass per unit volume - an intensive property that doesn't depend on amount.

2. **Pressure is Force/Area**: Pressure is NOT force! Same force, different areas = different pressures. Always emphasize units (Pa = N/m²).

3. **Pressure Acts Omnidirectionally**: At any point in a fluid, pressure pushes equally in all directions. It's a scalar, not a vector.

4. **Pascal's Principle**: Pressure changes transmit throughout enclosed fluids. This is the basis of hydraulic systems. WORK is conserved - they don't get free energy.

5. **Archimedes' Principle**: Buoyant force = weight of displaced fluid. Emphasize this depends on FLUID density and DISPLACED volume, not object properties.

6. **Continuity Equation**: A₁v₁ = A₂v₂. When pipe narrows, fluid SPEEDS UP. Students often get this backward.

7. **Bernoulli's Principle**: Fast flow = low pressure. This is the most counterintuitive result. Use the energy conservation interpretation.

### Common Pitfalls to Watch For

1. **Pressure Direction**: Students think pressure only pushes down. Counter with: "Why do your ears hurt equally from all sides when diving?"

2. **Fast = High Pressure**: Students think faster flow creates more pressure. Counter with Bernoulli and airplane wing lift.

3. **Buoyancy Depends on Object**: Students think heavy objects have less buoyancy. Counter: "Same size steel and aluminum cubes have SAME buoyant force in water."

4. **Container Shape Affects Pressure**: Students think more water = more pressure. Counter: "Pressure at 10m depth is the same in a narrow tube or wide lake."

5. **Hydraulics Give Free Energy**: Students see force multiplication and forget distance reduction. Always verify W₁ = W₂.

### Problem-Solving Strategy for Fluids

1. **Identify the situation**: Is this statics (nothing moving) or dynamics (flowing fluid)?
2. **Draw a diagram**: Label pressures, heights, velocities, areas
3. **Choose the right principle**:
   - Static fluid at different depths → p = p₀ + ρgh
   - Force multiplication → Pascal's principle (F₁/A₁ = F₂/A₂)
   - Floating/sinking → Archimedes (F_B = ρ_f g V)
   - Flow through changing area → Continuity (A₁v₁ = A₂v₂)
   - Pressure-velocity tradeoff → Bernoulli (p + ½ρv² + ρgy = const)
4. **Check units**: Pressure in Pa, density in kg/m³, etc.
5. **Sanity check**: Does the answer make physical sense?

### Whiteboard Usage for Fluids

**Diagrams**: Draw pipes with varying diameters, tanks with holes, floating objects, hydraulic systems. Label all variables clearly.

**Equations**: Show the key equations prominently:
- ρ = m/V
- p = p₀ + ρgh
- F₁/A₁ = F₂/A₂
- F_B = ρ_fluid g V
- A₁v₁ = A₂v₂
- p + ½ρv² + ρgy = constant

**Comparisons**: Side-by-side comparisons help:
- Narrow pipe vs wide pipe (velocities)
- Heavy object vs light object same size (same buoyancy!)
- Gauge vs absolute pressure

### Real-World Connections

Use examples students can relate to:
- Swimming (buoyancy, pressure with depth)
- Garden hoses (continuity, Bernoulli)
- Car brakes (hydraulics)
- Drinking through a straw (pressure difference)
- Airplane flight (Bernoulli, lift)
- Ships floating (buoyancy, density)
- Blood pressure and flow (all principles!)
`,

  // Prerequisites
  prerequisites: ['physics-kinematics-ap'], // Kinematics is foundational

  // Assessment
  masteryThreshold: 75,
};
