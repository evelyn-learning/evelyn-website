/**
 * Batch-5 fixtures, part "em" (transformer; induction_loop: magnet, field) —
 * see practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const T = (params: Record<string, unknown>): FigureFixture['spec'] => ({ type: 'transformer', params });
const I = (params: Record<string, unknown>): FigureFixture['spec'] => ({ type: 'induction_loop', params });

export const FIXTURES: FigureFixture[] = [
  // --- transformer -------------------------------------------------------------
  {
    id: 'transformer-simple-step-down',
    note: 'simple: a step-down transformer — both turn counts and the primary voltage printed, the secondary voltage not marked (the question asks for it)',
    question: 'The ideal transformer shown is connected to a 120 V AC supply. What is the voltage across the secondary coil?',
    alt: 'A transformer: two coils wound on opposite sides of a rectangular core. The primary coil is connected to an AC source and the secondary coil to a resistor. The number of turns of each coil and the primary voltage are marked.',
    spec: T({ primary: { turns: 500, voltage: 120 }, secondary: { turns: 100 } }),
  },
  {
    id: 'transformer-dense-all-six',
    note: 'dense: a step-up transformer with all six values printed (turns, voltages, currents), a named core and a labelled load',
    question: 'What power does the ideal transformer shown deliver to the resistor?',
    alt: 'A step-up transformer on an iron core, its primary coil connected to an AC source and its secondary coil to a resistor. The turns, the voltage and the current of each coil are marked.',
    spec: T({ primary: { turns: 200, voltage: 12, current: 5 }, secondary: { turns: 1600, voltage: 96, current: 0.625 }, coreLabel: 'iron core', loadLabel: 'R = 153.6 Ω', title: 'An ideal transformer' }),
  },
  {
    id: 'transformer-blank-secondary-turns',
    note: 'a "?" on the secondary turns; both voltages printed; the coils drawn alike (windings: equal) so the picture does not say which has more turns',
    question: 'The ideal transformer shown changes 240 V to 12 V. How many turns does the secondary coil have?',
    alt: 'A transformer with its primary coil connected to an AC source and its secondary coil to a lamp. The primary turns and both voltages are marked; the number of secondary turns is a boxed question mark.',
    spec: T({ primary: { turns: 1000, voltage: 240 }, secondary: { turns: 50, voltage: 12 }, show: { Ns: 'blank' }, windings: 'equal', load: 'lamp' }),
  },
  {
    id: 'transformer-blank-current-step-up',
    note: 'a "?" on the secondary current of a step-up transformer; the author\'s own symbols (Np, Ns, Ip, Is) in place of the numbered defaults',
    question: 'The ideal transformer shown draws 4 A from its supply. What current flows in the secondary coil?',
    alt: 'A step-up transformer with its primary coil connected to an AC source and its secondary coil to a resistor. Both turn counts and the primary current are marked; the secondary current is a boxed question mark.',
    spec: T({ primary: { turns: 50, current: 4 }, secondary: { turns: 400, current: 0.5 }, show: { Is: 'blank' }, symbols: { Np: 'Np', Ns: 'Ns', Ip: 'Ip', Is: 'Is' } }),
  },
  {
    id: 'transformer-counted-windings',
    note: 'windings: counted — the loops drawn ARE the turns (6 and 3), nothing printed but the primary voltage; the secondary terminals are open',
    question: 'Count the turns of each coil of the transformer shown. If the primary voltage is 18 V, what is the secondary voltage?',
    alt: 'A transformer whose two coils are drawn with countable loops, the primary connected to an AC source and the secondary ending in two open terminals. The primary voltage is marked.',
    spec: T({ primary: { turns: 6, voltage: 18 }, secondary: { turns: 3 }, show: { Np: 'none', Ns: 'none' }, windings: 'counted', load: 'none' }),
  },
  // --- induction_loop: magnet ----------------------------------------------------
  {
    id: 'induction-magnet-simple-north-toward',
    note: 'simple: the north pole of a bar magnet moving toward a loop; no current marked (the question asks its direction)',
    question: 'The north pole of the magnet shown moves toward the loop. As seen from the magnet, in which direction does the induced current flow round the loop?',
    alt: 'A bar magnet on the axis of a circular loop of wire drawn in perspective, its north pole facing the loop. An arrow over the magnet shows it moving toward the loop.',
    spec: I({ variant: 'magnet', pole: 'N', motion: 'toward' }),
  },
  {
    id: 'induction-magnet-dense-coil-meter-current',
    note: 'dense: a south pole pulled away from a 200-turn coil joined to a galvanometer, the magnet on the right, the speed printed and the induced current drawn on the near side of the coil',
    question: 'The magnet shown is pulled away from the coil. Which statement explains the direction of the induced current that is drawn?',
    alt: 'A bar magnet to the right of a coil of wire drawn in perspective, its south pole facing the coil, with an arrow showing it moving away. The coil is joined to a galvanometer, its number of turns is marked, and an arrow on the near side of the coil shows the induced current.',
    spec: I({ variant: 'magnet', pole: 'S', motion: 'away', magnetSide: 'right', turns: 200, meter: true, current: 'value', velocityLabel: 'v = 0.5 m/s', title: 'A magnet and a coil' }),
  },
  {
    id: 'induction-magnet-blank-current',
    note: 'a "?" on the near side of the loop where the current arrow would be: a south pole approaching',
    question: 'The south pole of the magnet shown approaches the loop. Does the induced current on the near side of the loop, at the "?", flow up or down the page?',
    alt: 'A bar magnet on the axis of a circular loop of wire drawn in perspective, its south pole facing the loop, with an arrow showing it moving toward the loop. A boxed question mark on the near side of the loop stands where the direction of the induced current would be drawn.',
    spec: I({ variant: 'magnet', pole: 'S', motion: 'toward', current: 'blank' }),
  },
  {
    id: 'induction-magnet-blank-poles',
    note: 'the reverse question: the induced current is drawn, the magnet moves away, and both poles are "?"',
    question: 'The magnet shown is moving away from the loop, and the induced current flows as drawn. Which pole of the magnet faces the loop?',
    alt: 'A bar magnet on the axis of a circular loop of wire drawn in perspective, with an arrow showing the magnet moving away from the loop. An arrow on the near side of the loop shows the induced current. The two poles of the magnet are boxed question marks.',
    spec: I({ variant: 'magnet', pole: 'N', motion: 'away', current: 'value', showPoles: 'blank' }),
  },
  // --- induction_loop: field -----------------------------------------------------
  {
    id: 'induction-field-simple-entering',
    note: 'simple: a rectangular loop moving to the right into a region of field directed into the page (crosses); nothing else marked',
    question: 'The loop shown is moving to the right into a region of uniform magnetic field directed into the page. In which direction does the induced current flow round the loop?',
    alt: 'A rectangular loop of wire half inside a dashed region filled with crosses, which stand for a magnetic field into the page. An arrow shows the loop moving to the right, further into the region.',
    spec: I({ variant: 'field', field: 'into', position: 'entering', direction: 'right' }),
  },
  {
    id: 'induction-field-dense-leaving-values',
    note: 'dense: a loop leaving a field out of the page (dots) with B, the side length, the speed and the resistance printed and the induced current drawn',
    question: 'What is the induced current in the loop shown as it leaves the field?',
    alt: 'A rectangular loop of wire half inside a dashed region filled with dots, which stand for a magnetic field out of the page, moving to the right out of the region. The field strength, the length of the side of the loop, its speed and its resistance are marked, and arrows on the loop show the induced current.',
    spec: I({ variant: 'field', field: 'out', position: 'leaving', direction: 'right', B: 0.5, length: 0.2, speed: 4, resistance: 2, current: 'value', title: 'A loop pulled out of a magnetic field' }),
  },
  {
    id: 'induction-field-blank-current-increasing',
    note: 'a "?" on the loop where the current arrows would be: a loop at rest inside a field into the page that is increasing',
    question: 'The magnetic field through the stationary loop shown is directed into the page and is increasing. In which direction does the induced current flow round the loop?',
    alt: 'A rectangular loop of wire at rest inside a dashed region filled with crosses, which stand for a magnetic field into the page; the field is marked as increasing. A boxed question mark on the loop stands where the direction of the induced current would be drawn.',
    spec: I({ variant: 'field', field: 'into', position: 'inside', change: 'increasing', current: 'blank' }),
  },
  {
    id: 'induction-field-inside-no-current',
    note: 'a loop moving wholly inside a uniform field: the flux does not change — "I = 0" printed in the loop; the loop moves left',
    question: 'The loop shown moves to the left while it is wholly inside a uniform magnetic field. Why is no current induced in it?',
    alt: 'A rectangular loop of wire wholly inside a dashed region filled with dots, which stand for a magnetic field out of the page, with an arrow showing it moving to the left. The loop is marked as carrying no current.',
    spec: I({ variant: 'field', field: 'out', position: 'inside', direction: 'left', current: 'value' }),
  },
  {
    id: 'induction-field-blank-field-direction',
    note: 'the reverse question: the current is drawn (counter-clockwise) on a loop leaving the region; the field direction is a "?" and no dots or crosses are drawn; the speed is a "?" too',
    question: 'The loop shown is pulled to the left out of a region of uniform magnetic field, and the induced current flows as drawn. Is the field directed into or out of the page?',
    alt: 'A rectangular loop of wire half inside a dashed region, moving to the left out of it. Arrows on the loop show the induced current. The direction of the magnetic field in the region and the speed of the loop are boxed question marks.',
    spec: I({ variant: 'field', field: 'out', position: 'leaving', direction: 'left', current: 'value', showField: 'blank', show: { speed: 'blank' } }),
  },
];
