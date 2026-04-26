# Voice Tutor — Tier 2 Whiteboard Tool Test Prompts

36 tools, 2–3 phrasings each, grouped by category. Paste any one into the
voice tutor to exercise the corresponding renderer. (Unchecked tools are
still to be built; this doc is the test bed once each ships.)

---

## Physics — advanced

### `show_pv_diagram` (pressure vs volume for thermodynamic cycles)
1. Draw a PV diagram for a Carnot cycle with isothermal expansion from 2L to 6L at 600 K, then adiabatic, isothermal compression at 300 K, and adiabatic return.
2. Show the PV diagram for an isobaric process where a gas expands from 1 L to 3 L at 2 atm, label W = PΔV.
3. Plot a complete Otto cycle on a PV diagram and label the four strokes (intake, compression, power, exhaust).

### `show_phase_diagram` (P vs T phase boundaries)
1. Draw the phase diagram of water, label the triple point (0.01 °C, 0.006 atm) and critical point (374 °C, 218 atm), and show why ice melts under pressure.
2. Show the CO₂ phase diagram and explain why dry ice sublimates at atmospheric pressure.
3. Draw a generic P–T phase diagram and mark the solid, liquid, gas, and supercritical-fluid regions with the three coexistence curves.

### `show_electric_field`
1. Draw the electric field lines of a point charge of +2 μC.
2. Sketch the field lines between two opposite charges (a dipole) of ±3 nC separated by 4 cm.
3. Show the uniform electric field between two parallel plates with +Q on top and −Q on bottom.

### `show_magnetic_field`
1. Show the magnetic field pattern around a long straight current-carrying wire with current flowing out of the page.
2. Draw the magnetic field of a bar magnet, label N and S poles.
3. Sketch the magnetic field inside and outside a solenoid with 10 turns carrying 2 A.

### `show_standing_wave`
1. Draw the fundamental, 2nd, and 3rd harmonics on a string fixed at both ends, label nodes and antinodes.
2. Show the first three standing-wave modes in a tube open at both ends.
3. Sketch the standing wave on a string of length 1 m at its third harmonic and label the wavelength.

### `show_doppler`
1. Draw the Doppler-shifted wavefronts for a source moving to the right at 0.5c_sound, label observed frequency ahead and behind.
2. Show an ambulance moving toward observer A and away from observer B at 30 m/s, label the compressed and stretched wavefronts.
3. Sketch a stationary source first, then the same source moving, to contrast concentric circles vs. off-center wavefronts.

---

## Chemistry — advanced

### `show_titration_curve`
1. Draw the titration curve for 25 mL of 0.1 M HCl titrated with 0.1 M NaOH; label equivalence point pH = 7.
2. Show the titration of a weak acid (acetic acid, pKa 4.76) with NaOH; mark the half-equivalence point where pH = pKa and the equivalence point above 7.
3. Plot the titration of a diprotic acid (H₂CO₃) with NaOH and label both equivalence points.

### `show_phase_change_plot` (temperature vs time / heating curve)
1. Draw the heating curve for 100 g of ice from −20 °C to 120 °C at constant heat input, label all five segments (ice warming, melting, liquid warming, vaporizing, vapor warming).
2. Show the cooling curve of water from steam at 150 °C back to ice at −10 °C.
3. Sketch a heating curve and label each plateau with the latent heat (Lf or Lv) being absorbed.

### `show_vsepr` (molecular geometry)
1. Draw the VSEPR geometry of methane (CH₄), label the tetrahedral shape and 109.5° bond angle.
2. Show the trigonal-pyramidal geometry of NH₃ with the lone pair compressing bond angles below 109.5°.
3. Draw the bent geometry of water (H₂O) with two lone pairs, label the bond angle ~104.5°.

### `show_crystal_lattice`
1. Draw a simple cubic crystal lattice, label unit-cell edges and the 6 nearest neighbors.
2. Show a face-centered cubic (FCC) lattice like copper; label coordination number 12.
3. Sketch a body-centered cubic (BCC) lattice like iron; label coordination number 8.

---

## Biology — advanced

### `show_mitosis_meiosis`
1. Show the four stages of mitosis (prophase, metaphase, anaphase, telophase) for a cell with 2n = 4.
2. Draw meiosis I and meiosis II side by side for 2n = 4, highlight crossing-over in prophase I and the reduction to n = 2 after meiosis I.
3. Compare mitosis vs. meiosis in two parallel columns for the same starting cell, highlight that meiosis produces 4 haploid non-identical cells vs. mitosis's 2 identical diploid cells.

### `show_protein_synthesis`
1. Show transcription of DNA to mRNA in the nucleus, then translation at a ribosome in the cytoplasm with tRNA bringing amino acids; label the start codon AUG.
2. Draw the flow from DNA → mRNA → protein, label RNA polymerase, ribosome, and polypeptide chain.
3. Show a ribosome with A, P, and E sites during translation and a tRNA in each.

### `show_enzyme_action`
1. Draw an enzyme binding its substrate at the active site (lock-and-key vs. induced fit) and releasing the products.
2. Show the effect of a competitive inhibitor binding the active site vs. a non-competitive inhibitor binding elsewhere.
3. Illustrate how lowering activation energy lets enzymes speed up a reaction; overlay on a reaction-coordinate curve.

### `show_trophic_pyramid`
1. Draw an energy pyramid for a grassland ecosystem with producers, primary consumers, secondary consumers, tertiary consumers; show the 10% rule.
2. Show a biomass pyramid for an inverted marine food chain where phytoplankton biomass is less than zooplankton.
3. Draw a numbers pyramid starting with 1 oak tree at the base and many insect herbivores above.

### `show_anatomy` (body systems)
1. Draw the human digestive system and label mouth, esophagus, stomach, small intestine, large intestine, liver, and pancreas.
2. Show the heart with its four chambers and major vessels, label oxygenated vs. deoxygenated blood paths.
3. Draw the human respiratory system with trachea, bronchi, bronchioles, alveoli, and diaphragm.
4. Sketch the nervous system with brain, spinal cord, and major peripheral nerves.
5. Show the skeletal system and label the skull, spine, rib cage, pelvis, femur, and tibia.

---

## Earth & space

### `show_solar_system`
1. Draw the solar system with the sun and all eight planets in order, not to scale but correctly ordered.
2. Show the inner rocky planets (Mercury, Venus, Earth, Mars) with the asteroid belt separating them from the outer gas/ice giants.
3. Sketch Earth's and Mars's orbits around the Sun and show where Mars is at opposition.

### `show_moon_phases`
1. Show the 8 phases of the moon in order starting with new moon, and label which side of Earth is illuminated by the sun in each.
2. Draw the positions of the moon relative to Earth and sun for new moon, first quarter, full moon, and last quarter.
3. Explain the difference between waxing and waning phases with a diagram.

### `show_seasons`
1. Draw Earth's orbit around the sun showing the 23.5° axial tilt, label summer and winter solstices and both equinoxes for the Northern Hemisphere.
2. Show why the Northern Hemisphere has summer in June and winter in December using the tilt-direction diagram.
3. Illustrate the Sun's apparent path through the sky on the summer solstice vs. winter solstice at 40° N latitude.

### `show_layers_of_earth`
1. Draw a cross-section of Earth's interior labeling crust, mantle, outer core, and inner core with approximate depths.
2. Show the compositional layers (crust, mantle, core) next to the mechanical layers (lithosphere, asthenosphere, mesosphere, outer core, inner core).
3. Sketch Earth's layers and mark where seismic P and S waves can travel.

### `show_plate_tectonics`
1. Draw the three types of plate boundaries (convergent, divergent, transform) with labeled arrows showing plate motion.
2. Show a subduction zone where an oceanic plate dives under a continental plate, label the trench, volcanic arc, and earthquakes.
3. Sketch the Mid-Atlantic Ridge as a divergent boundary with new crust forming.

### `show_weather_front`
1. Draw a cold front moving into a warm air mass with the typical cumulonimbus cloud wedge, label precipitation zone.
2. Show a warm front with its gentle slope and stratiform cloud sequence (cirrus → altostratus → nimbostratus).
3. Sketch an occluded front where a cold front catches up to a warm front and lifts the warm air mass aloft.

---

## K–5 math

### `show_place_value_chart`
1. Show the number 4,382 in a place-value chart labeling thousands, hundreds, tens, and ones.
2. Draw a decimal place-value chart for 56.47 with tens, ones, tenths, and hundredths.
3. Show 1,000,000 in a place-value chart labeling all seven positions.

### `show_ten_frame`
1. Show the number 7 on a single ten-frame.
2. Show 13 using two ten-frames (one full, one with 3 dots).
3. Draw two ten-frames showing 8 + 5 and show how to "make ten" by moving 2 dots over.

### `show_tape_diagram`
1. Draw a tape diagram for "Maria has 4 times as many apples as Tom, and together they have 30 apples."
2. Show a tape diagram for the fraction problem: "3/5 of a number is 24; what is the number?"
3. Draw a comparison tape diagram for "The blue ribbon is 15 cm; the red ribbon is 9 cm longer."

### `show_clock` (analog clock face)
1. Show an analog clock reading 3:45.
2. Draw a clock at 7:20 and ask what time it will be in 45 minutes.
3. Show two clocks side by side: one at 10:15 a.m. (start) and one at 2:30 p.m. (end); ask for elapsed time.

### `show_ruler`
1. Draw a ruler measuring a 6.5 cm line segment.
2. Show an inch ruler with two objects: a 2 3/4-inch pencil and a 4 1/2-inch crayon.
3. Show a ruler measuring 12.3 cm with the millimeter marks visible.

### `show_pictograph`
1. Draw a pictograph of favorite fruits: apples 6, bananas 4, grapes 8, where each 🍎 = 2 fruits.
2. Show a pictograph of books read in a month: Ana 12, Ben 8, Carlos 16, where each 📚 = 4 books.
3. Show a pictograph with a half-icon for odd counts: Monday 5 rainy days, where ☔ = 2 days.

---

## CS / logic

### `show_logic_gates` (+ truth table)
1. Draw an AND gate with inputs A and B and show its truth table.
2. Show a half-adder circuit using XOR and AND gates with its full truth table for inputs A, B.
3. Draw the circuit for (A AND B) OR (NOT C) and show the 8-row truth table.

### `show_linked_list`
1. Draw a singly linked list with nodes 10 → 20 → 30 → null.
2. Show a doubly linked list with nodes A ↔ B ↔ C and label head and tail pointers.
3. Show the step-by-step of inserting a node with value 15 between 10 and 20.

### `show_stack`
1. Draw a stack after pushing 1, 2, 3, then popping once; label top of stack.
2. Show a call stack for a recursive factorial(3) with three frames.
3. Illustrate a stack with push/pop operations, labeling LIFO order.

### `show_queue`
1. Draw a queue after enqueueing A, B, C; label front and rear.
2. Show a queue processing: enqueue X, enqueue Y, dequeue, enqueue Z — with the final state.
3. Draw a circular queue of capacity 5 with 3 elements and mark head and tail indices.

### `show_binary_tree`
1. Draw a binary search tree after inserting 50, 30, 70, 20, 40, 60, 80.
2. Show the tree from inserting 5, 3, 8, 1, 4 and label it with in-order traversal 1, 3, 4, 5, 8.
3. Show a heap (max-heap) with values 10, 8, 9, 4, 5, 6, 7 satisfying the heap property.

### `show_graph_network`
1. Draw an undirected graph with vertices A, B, C, D and edges A–B, B–C, C–D, D–A, A–C.
2. Show a directed weighted graph for a shortest-path example: 4 cities with road distances.
3. Draw a simple social-network graph of 5 people with bidirectional friendships.

---

## ELA / humanities

### `show_plot_diagram` (Freytag pyramid)
1. Draw a plot diagram for "The Three Little Pigs" labeling exposition, rising action, climax, falling action, and resolution.
2. Show a Freytag pyramid for "Romeo and Juliet" with key events at each stage.
3. Draw a plot diagram for a generic hero-journey story with 3 rising-action events.

### `show_sentence_diagram`
1. Diagram the sentence "The quick brown fox jumps over the lazy dog."
2. Diagram "She gave her friend a beautifully wrapped gift."
3. Diagram a compound sentence: "I wanted to go, but it was too late."

### `show_character_web`
1. Draw a character web for "The Giver" with Jonas at the center connected to the Giver, Fiona, Asher, his parents, and Gabriel.
2. Show a character-relationship map for "Charlotte's Web" with Fern, Wilbur, Charlotte, Templeton, and the goose.
3. Draw the main character relationships in "Romeo and Juliet" showing Montagues vs. Capulets.
