# Voice Tutor — Tier 1 Structured Diagram Test Prompts

Test prompts for the 17 Tier-1 diagram tools shipped 2026-04-22.

Two variations per tool — one short/direct, one fuller scenario. Copy-paste into the voice tutor and verify the correct structured renderer appears (not `show_svg_diagram`).

Open the browser console during testing — look for `[VoiceTutorRealtime]` and any intersection/conic validator lines to confirm the right tool fired.

---

## Math / data

### `show_coordinate_plane`

**Test 1 (direct):** Plot the points A(2, 3), B(-4, 1), and C(0, -5) on a coordinate plane and connect them with line segments.

**Test 2 (vectors):** On a coordinate plane, show vectors u = (3, 4) and v = (-2, 5) both drawn from the origin.

---

### `show_scatter_plot`

**Test 1 (trend line):** Draw a scatter plot of hours studied vs test score: (1, 55), (2, 60), (3, 68), (4, 74), (5, 82), (6, 88), (7, 91). Add a trend line and report R².

**Test 2 (no trend):** Show a scatter plot of these measurements: (10, 2.1), (20, 3.9), (30, 6.2), (40, 8.0), (50, 10.1). No regression line needed.

---

## Process / concept visualizations

### `show_cycle_diagram`

**Test 1 (water cycle):** Draw the water cycle with four stages: Evaporation, Condensation, Precipitation, Collection.

**Test 2 (cell cycle):** Show the cell cycle with stages G1, S, G2, and M (mitosis) in order.

---

### `show_concept_map`

**Test 1 (vocabulary):** Make a concept map for "Photosynthesis" with these connected concepts: Light Energy, Chlorophyll, CO₂, H₂O, Glucose, O₂. Use labeled edges like "produces", "requires", "releases".

**Test 2 (themes):** Concept map for the causes of World War I — connect Militarism, Alliances, Imperialism, Nationalism, and "Assassination of Franz Ferdinand" as converging nodes.

---

## Physics — mechanics

### `show_motion_diagram`

**Test 1 (constant velocity):** A car moves at a constant 20 m/s for 5 seconds. Show x(t), v(t), and a(t) stacked on the same time axis.

**Test 2 (acceleration):** A ball is dropped from rest and falls for 3 seconds (g = 9.8 m/s²). Plot position, velocity, and acceleration vs time.

---

### `show_projectile_motion`

**Test 1 (intro):** A ball is launched at 20 m/s at 45° above horizontal. Show the trajectory with components and range.

**Test 2 (cliff):** A rock is thrown horizontally at 15 m/s from a 20 m cliff. Show the projectile motion path to when it hits the ground.

---

### `show_simple_machine`

**Test 1 (lever):** Show a class-1 lever with a 100 N load on a 0.5 m load arm and the effort applied at 2 m from the fulcrum. What's the required effort?

**Test 2 (inclined plane):** Draw a 30° inclined plane being used to raise a 200 N crate up a 3 m ramp. Compute the mechanical advantage and effort needed.

---

### `show_pendulum`

**Test 1 (basic):** Show a pendulum with string length 1 m and amplitude 20°. What's its period?

**Test 2 (longer):** A grandfather-clock pendulum has length 0.99 m. Display it with a 5° amplitude and a 2 kg bob.

---

### `show_spring_mass`

**Test 1 (horizontal):** A 0.5 kg mass is attached to a spring with k = 200 N/m and pulled 0.1 m from equilibrium. Draw the setup horizontally and compute ω and T.

**Test 2 (vertical):** Show a vertical spring with k = 50 N/m and a 1 kg mass displaced 0.2 m below equilibrium.

---

## Physics — E&M / waves / optics

### `show_ray_diagram`

**Test 1 (converging lens):** Draw a ray diagram for a converging lens with focal length 10 cm and an object at 15 cm. Where is the image and is it real or virtual?

**Test 2 (concave mirror):** Show a concave mirror (f = 20 cm) with an object placed at 30 cm. Include the focal point and image arrow.

---

### `show_wave`

**Test 1 (single):** Draw a wave with wavelength 4 m, amplitude 2, frequency 0.5 Hz. Label λ, A, and T.

**Test 2 (interference):** Show two waves with the same wavelength (2 m) and amplitude (1), one with 0° phase and one with 180° phase, plus their superposition. What is this called?

---

### `show_vector`

**Test 1 (resultant):** Draw vectors A (5, 30°) and B (3, 120°) from a common origin and show their resultant.

**Test 2 (tip-to-tail):** Show vectors (4 N East) then (3 N North) tip-to-tail and give the magnitude and direction of the sum.

---

## Chemistry

### `show_orbital_diagram`

**Test 1 (simple):** Show the orbital (box-and-arrow) diagram for nitrogen. Point out Hund's rule.

**Test 2 (transition metal):** Show the condensed orbital diagram for iron (Fe). How many unpaired electrons does it have?

---

## Biology

### `show_pedigree`

**Test 1 (autosomal recessive):** Draw a pedigree for an autosomal recessive disorder — two unaffected Generation-I parents, three Generation-II offspring where the middle child is affected.

**Test 2 (X-linked):** Show an X-linked recessive pedigree: affected grandfather in Generation I, one unaffected daughter (carrier) married to an unaffected man in Generation II, with two Generation-III grandsons of whom one is affected.

---

### `show_cell_diagram`

**Test 1 (animal):** Show an animal cell and highlight the nucleus, mitochondria, and ribosomes.

**Test 2 (plant):** Draw a plant cell highlighting the chloroplast, central vacuole, and cell wall — what makes these distinctly plant-cell features?

---

### `show_dna`

**Test 1 (helix):** Show a DNA double helix. Identify the two strand components and what the rungs represent.

**Test 2 (base pairs + mRNA):** Display DNA base pairs in sequence A-T-G-C-A-T-G-C and show the corresponding mRNA produced by transcription of the top strand.

---

### `show_food_web`

**Test 1 (simple):** Draw a food web with grass (producer), rabbit and grasshopper (primary consumers), snake (secondary consumer), and hawk (apex predator).

**Test 2 (marine):** Show a marine food web with phytoplankton, zooplankton, small fish, tuna, and shark. Label trophic levels.

---

## What to check per test

1. **Right tool fires.** In the browser console, the `tool_call` event name should match the expected `show_<x>` tool — not `show_svg_diagram`.
2. **Renderer appears on the whiteboard** — not a blank panel or a "Loading…" state that never resolves.
3. **Labels/values are correct** — the tutor's spoken numbers should match what's drawn (especially for projectile range, pendulum period, thin-lens image distance, electron count).
4. **No console errors** — particularly React key warnings or unhandled exceptions from the renderer.
5. **PDF export** (optional) — after a test, export the session as PDF; each diagram should appear as a labeled summary line (e.g. "Ray Diagram: Converging lens at f = 10 cm").

If a tool falls back to `show_svg_diagram`, the system-prompt nudge in `system-prompt-builder.ts:4a` needs strengthening for that specific trigger phrase.
