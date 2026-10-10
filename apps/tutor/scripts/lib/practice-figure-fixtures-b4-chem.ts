/**
 * Batch-4 fixtures, part "chem" — energy_levels (orbital_boxes, levels),
 * heating_curve, electrochemical_cell. Conventions: practice-figure-fixtures-batch4.ts.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const ORBITAL: FigureFixture[] = [
  {
    id: 'orbital-simple-nitrogen',
    note: 'simple: one row, 1s 2s 2p, three unpaired electrons',
    question: 'The orbital diagram of a neutral atom in its ground state is shown. Which element is it?',
    alt: 'An orbital box diagram: one box labelled "1s" and one labelled "2s", each with a pair of opposite arrows, and three boxes labelled "2p", each with a single upward arrow.',
    spec: { type: 'energy_levels', params: { variant: 'orbital_boxes', diagrams: [{ config: '1s2 2s2 2p3' }] } },
  },
  {
    id: 'orbital-dense-which-ground-state',
    note: 'dense: four stacked diagrams on plates I–IV — one valid, one breaking Hund\'s rule, one breaking the Pauli principle, one breaking the filling order',
    question: 'Four orbital diagrams for an atom with eight electrons are shown. Which diagram shows the ground state?',
    alt: 'Four orbital box diagrams, labelled with Roman numerals on small plates, each with boxes for the 1s, 2s and 2p subshells and a 3s box, filled with arrows in different ways.',
    spec: {
      type: 'energy_levels',
      params: {
        variant: 'orbital_boxes',
        diagrams: [
          { label: 'I', subshells: [{ name: '1s', electrons: 2 }, { name: '2s', electrons: 2 }, { name: '2p', boxes: ['ud', 'ud', ''] }, { name: '3s', electrons: 0 }] },
          { label: 'II', subshells: [{ name: '1s', electrons: 2 }, { name: '2s', electrons: 2 }, { name: '2p', boxes: ['ud', 'u', 'u'] }, { name: '3s', electrons: 0 }] },
          { label: 'III', subshells: [{ name: '1s', electrons: 2 }, { name: '2s', boxes: ['uu'] }, { name: '2p', boxes: ['ud', 'u', 'u'] }, { name: '3s', electrons: 0 }] },
          { label: 'IV', subshells: [{ name: '1s', electrons: 2 }, { name: '2s', electrons: 2 }, { name: '2p', boxes: ['u', 'u', 'u'] }, { name: '3s', electrons: 1 }] },
        ],
      },
    },
  },
  {
    id: 'orbital-blank-oxygen-2p',
    note: 'a blank: the three 2p boxes are "?" boxes; the 3s row is hidden with the noble-gas core printed',
    question: 'The orbital diagram of a ground-state oxygen atom is shown with the 2p boxes left blank. How many unpaired electrons does the atom have?',
    alt: 'An orbital box diagram: boxes labelled "1s" and "2s" each hold a pair of opposite arrows; the three boxes labelled "2p" are blank, each shown as a boxed question mark.',
    spec: { type: 'energy_levels', params: { variant: 'orbital_boxes', diagrams: [{ subshells: [{ name: '1s', electrons: 2 }, { name: '2s', electrons: 2 }, { name: '2p', boxes: ['?', '?', '?'] }] }] } },
  },
  {
    id: 'orbital-ladder-iron',
    note: 'ladder layout: iron on an energy arrow, 4s below 3d, the 3d row with four unpaired electrons',
    question: 'The orbital energy diagram of a neutral atom in its ground state is shown. How many unpaired electrons does the atom have?',
    alt: 'An orbital energy diagram beside an upward arrow labelled "Energy": rows of boxes for the 1s, 2s, 2p, 3s, 3p, 4s and 3d subshells, rising in that order, filled with arrows.',
    spec: { type: 'energy_levels', params: { variant: 'orbital_boxes', layout: 'ladder', diagrams: [{ config: '1s2 2s2 2p6 3s2 3p6 4s2 3d6' }] } },
  },
  {
    id: 'orbital-core-wrap-arsenic',
    note: 'a noble-gas core printed in front of the boxes: [Ar] 4s 3d 4p',
    question: 'The orbital diagram of the electrons beyond the argon core of a neutral atom is shown. Which element is it?',
    alt: 'An orbital box diagram that starts with the core "[Ar]", then one box labelled "4s" and five boxes labelled "3d", all holding pairs of arrows, and three boxes labelled "4p", each with a single upward arrow.',
    spec: { type: 'energy_levels', params: { variant: 'orbital_boxes', diagrams: [{ core: 'Ar', config: '4s2 3d10 4p3' }] } },
  },
];

const LEVELS: FigureFixture[] = [
  {
    id: 'levels-simple-three-levels',
    note: 'simple: three levels to scale, energies printed, one downward transition',
    question: 'The energy-level diagram of an atom is shown. What is the energy of the photon emitted in transition A?',
    alt: 'An energy-level diagram with three horizontal levels, each labelled with its energy in electronvolts, and one downward arrow labelled "A" from the top level to the bottom level.',
    spec: { type: 'energy_levels', params: { variant: 'levels', levels: [{ energy: -10, label: 'E₁' }, { energy: -4, label: 'E₂' }, { energy: -1, label: 'E₃' }], transitions: [{ from: 3, to: 1, label: 'A' }] } },
  },
  {
    id: 'levels-dense-hydrogen-five-transitions',
    note: 'dense: hydrogen n = 1 to 6 with the ionisation line, evenly spaced with "not to scale" printed, five lettered transitions (four emissions and an absorption)',
    question: 'The energy-level diagram of hydrogen is shown with five transitions. Which transition emits the photon of shortest wavelength?',
    alt: 'An energy-level diagram of hydrogen with six levels labelled by n and by their energies, a dashed line for the ionisation limit, and five lettered vertical arrows between levels, four pointing down and one pointing up. It is marked as not to scale.',
    spec: {
      type: 'energy_levels',
      params: {
        variant: 'levels', hydrogen: { nMax: 6 }, ionization: true,
        transitions: [{ from: 2, to: 1, label: 'P' }, { from: 4, to: 2, label: 'Q' }, { from: 6, to: 3, label: 'R' }, { from: 1, to: 3, label: 'S' }, { from: 5, to: 4, label: 'T' }],
      },
    },
  },
  {
    id: 'levels-blank-hydrogen-n3',
    note: 'a blank: hydrogen n = 1 to 4, the energy of n = 3 is a "?" box; one transition',
    question: 'The energy-level diagram of hydrogen is shown. What is the energy of the n = 3 level, in eV?',
    alt: 'An energy-level diagram of hydrogen with four levels labelled by n. Three are labelled with their energies and one energy is left blank, shown as a boxed question mark. One downward arrow labelled "X" joins two of the levels.',
    spec: { type: 'energy_levels', params: { variant: 'levels', hydrogen: { nMax: 4, blank: [3] }, transitions: [{ from: 3, to: 2, label: 'X' }] } },
  },
  {
    id: 'levels-true-scale-hydrogen-warns',
    note: 'warns: hydrogen n = 1 to 5 forced to true scale — the upper levels run together (crowded)',
    question: 'The energy levels of hydrogen are drawn to scale. Between which two neighbouring levels is the energy gap largest?',
    alt: 'An energy-level diagram of hydrogen drawn to scale: the lowest level is far below the others, which crowd together near the top.',
    spec: { type: 'energy_levels', params: { variant: 'levels', hydrogen: { nMax: 5 }, scale: 'true', energies: 'none' } },
  },
];

const WATER = { mass: 10, meltingPoint: 0, boilingPoint: 100, cSolid: 2.09, cLiquid: 4.18, cGas: 2.01, heatFusion: 334, heatVaporization: 2260 };

const HEATING: FigureFixture[] = [
  {
    id: 'heating-simple-lettered',
    note: 'simple: five segments through given corners on gridlines, lettered A–E, both axes numbered',
    question: 'The heating curve of a pure substance is shown. During which lettered segment is the substance melting?',
    alt: 'A heating curve: temperature in degrees Celsius against heat added in kilojoules, rising in three sloped segments separated by two flat segments. The five segments are lettered "A" to "E".',
    spec: { type: 'heating_curve', params: { corners: [[0, -20], [2, 0], [8, 0], [14, 80], [26, 80], [28, 100]], segmentLabels: 'letters', yRange: [-40, 120], yStep: 20, xStep: 4 } },
  },
  {
    id: 'heating-dense-water-computed',
    note: 'dense: 10 g of water from −40 °C to 140 °C computed from its constants — a short ice segment, a long boiling plateau, letters, two marked points, plateau temperatures printed',
    question: 'The heating curve of a 10 g sample of water is shown. About how much heat is needed to boil the sample once it has reached its boiling point?',
    alt: 'A heating curve of temperature in degrees Celsius against heat added in kilojoules, with five lettered segments. The two flat segments are labelled "0 °C" and "100 °C", and two points on the curve are marked "P" and "Q".',
    spec: { type: 'heating_curve', params: { substance: WATER, startTemp: -40, endTemp: 140, segmentLabels: 'letters', plateauLabels: 'value', marks: [{ x: 6, label: 'P' }, { x: 20, label: 'Q' }] } },
  },
  {
    id: 'heating-blank-plateaus-cooling',
    note: 'a blank: a cooling curve against time with unnumbered axes — both plateau temperatures are "?" boxes',
    question: 'A gas is cooled at a steady rate until it is a solid, as shown. Which of the two blank temperatures is the freezing point of the substance?',
    alt: 'A cooling curve: temperature against time, falling in three sloped segments separated by two flat segments, on axes without numbers. The temperature of each flat segment is left blank, shown as a boxed question mark. The segments are numbered with Roman numerals.',
    spec: { type: 'heating_curve', params: { corners: [[0, 140], [3, 100], [12, 100], [17, 20], [21, 20], [24, -10]], xQuantity: 'time', xNumbers: false, yNumbers: false, plateauLabels: 'blank', segmentLabels: ['I', 'II', 'III', 'IV', 'V'] } },
  },
  {
    id: 'heating-short-stage-warns',
    note: 'warns: 2 g of ice warmed only from −2 °C before melting and boiling — the first lettered segment is too short to label (crowded)',
    question: 'The heating curve of a sample of water is shown. Which segment shows the liquid warming?',
    alt: 'A heating curve with lettered segments; the first sloped segment is very short.',
    spec: { type: 'heating_curve', params: { substance: { ...WATER, mass: 2 }, startTemp: -2, endTemp: 110, segmentLabels: 'letters' } },
  },
];

const CELL: FigureFixture[] = [
  {
    id: 'cell-simple-daniell',
    note: 'simple: zinc–copper galvanic cell, two beakers, salt bridge, voltmeter; nothing says which electrode is the anode',
    question: 'The galvanic cell shown uses a zinc electrode in Zn²⁺(aq) and a copper electrode in Cu²⁺(aq). E°(Zn²⁺/Zn) = −0.76 V and E°(Cu²⁺/Cu) = +0.34 V. Which electrode is the anode?',
    alt: 'A galvanic cell: two beakers joined by a salt bridge, an electrode labelled "Zn" in a solution labelled "1.0 M ZnSO₄" and an electrode labelled "Cu" in a solution labelled "1.0 M CuSO₄", wired through a voltmeter.',
    spec: { type: 'electrochemical_cell', params: { left: { electrode: 'Zn', solution: '1.0 M ZnSO₄' }, right: { electrode: 'Cu', solution: '1.0 M CuSO₄' }, anode: 'left' } },
  },
  {
    id: 'cell-dense-all-labels',
    note: 'dense: everything on — roles, the electron arrow, signs, salt-bridge ions with their arrows, a voltmeter reading',
    question: 'The galvanic cell shown is running. Toward which half-cell do the nitrate ions in the salt bridge move, and why?',
    alt: 'A galvanic cell with electrodes labelled "Ag" and "Cu" in solutions labelled "1.0 M AgNO₃" and "1.0 M Cu(NO₃)₂", joined by a salt bridge labelled "KNO₃" and wired through a voltmeter. The electrodes are labelled "cathode" and "anode" and marked plus and minus, an arrow labelled "e⁻" lies along the wire, and arrows under the bridge are labelled "NO₃⁻" and "K⁺".',
    spec: {
      type: 'electrochemical_cell',
      params: {
        left: { electrode: 'Ag', solution: '1.0 M AgNO₃' }, right: { electrode: 'Cu', solution: '1.0 M Cu(NO₃)₂' }, anode: 'right',
        roles: 'value', electronFlow: 'value', polarity: 'value', saltBridge: 'KNO₃', bridgeIons: { anion: 'NO₃⁻', cation: 'K⁺' }, meterLabel: '0.46 V',
      },
    },
  },
  {
    id: 'cell-blank-roles-and-flow',
    note: 'a blank: the two role labels and the direction of electron flow are "?" boxes, and so is the voltmeter reading',
    question: 'In the galvanic cell shown, E°(Fe²⁺/Fe) = −0.44 V and E°(Ni²⁺/Ni) = −0.25 V. What is the standard cell potential?',
    alt: 'A galvanic cell with electrodes labelled "Ni" and "Fe" in solutions labelled "Ni²⁺(aq)" and "Fe²⁺(aq)", joined by a salt bridge and wired through a voltmeter. The label over each electrode, the direction of electron flow marked "e⁻" and the voltmeter reading are left blank, shown as boxed question marks.',
    spec: { type: 'electrochemical_cell', params: { left: { electrode: 'Ni', solution: 'Ni²⁺(aq)' }, right: { electrode: 'Fe', solution: 'Fe²⁺(aq)' }, anode: 'right', roles: 'blank', electronFlow: 'blank', meterLabel: '?' } },
  },
  {
    id: 'cell-electrolytic-simple-molten',
    note: 'simple: electrolysis in one container — a battery in the wire (long plate = positive), two inert electrodes in molten NaCl',
    question: 'Molten sodium chloride is electrolysed with inert electrodes, as shown. At which electrode does sodium metal form?',
    alt: 'An electrolytic cell: one container of liquid labelled "molten NaCl" holding two electrodes labelled "X" and "Y", wired to a battery.',
    spec: { type: 'electrochemical_cell', params: { variant: 'electrolytic', left: { electrode: 'X', solution: 'molten NaCl' }, right: { electrode: 'Y' }, anode: 'left' } },
  },
  {
    id: 'cell-electrolytic-dense-plating',
    note: 'dense: electroplating — battery terminals signed, the electron arrow, roles printed, one container',
    question: 'A spoon is plated with silver in the electrolytic cell shown. A current of 2.00 A flows for 965 s. What mass of silver is deposited?',
    alt: 'An electrolytic cell: one container of solution labelled "AgNO₃(aq)" holding electrodes labelled "spoon" and "Ag", wired to a battery whose terminals are marked plus and minus. The electrodes are labelled "cathode" and "anode" and an arrow labelled "e⁻" lies along the wire.',
    spec: { type: 'electrochemical_cell', params: { variant: 'electrolytic', left: { electrode: 'spoon', solution: 'AgNO₃(aq)' }, right: { electrode: 'Ag' }, anode: 'right', roles: 'value', electronFlow: 'value', polarity: 'value' } },
  },
  {
    id: 'cell-electrolytic-blank-roles',
    note: 'a blank: electrolysis of aqueous copper(II) sulfate — both role labels are "?" boxes',
    question: 'Aqueous copper(II) sulfate is electrolysed with graphite electrodes, as shown. Which electrode, P or Q, is the cathode?',
    alt: 'An electrolytic cell: one container of solution labelled "CuSO₄(aq)" holding two electrodes labelled "P" and "Q", wired to a battery. The label over each electrode is left blank, shown as a boxed question mark.',
    spec: { type: 'electrochemical_cell', params: { variant: 'electrolytic', left: { electrode: 'P', solution: 'CuSO₄(aq)' }, right: { electrode: 'Q' }, anode: 'right', roles: 'blank' } },
  },
];

export const FIXTURES: FigureFixture[] = [...ORBITAL, ...LEVELS, ...HEATING, ...CELL];
