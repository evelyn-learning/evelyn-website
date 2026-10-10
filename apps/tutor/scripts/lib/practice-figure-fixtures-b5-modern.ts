/**
 * Batch-5 fixtures, part "modern" (doppler_wavefronts, photoelectric_setup:
 * tube, graph) — see practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  // --- doppler_wavefronts -----------------------------------------------------
  {
    id: 'doppler-simple-half-speed',
    note: 'simple: a source at half the wave speed, five fronts, an observer on each side, nothing printed but the names',
    question: 'The source S moves as the arrow shows. Which observer receives the waves at the higher frequency?',
    alt: 'A source moving to the right through five circular wavefronts that are bunched together ahead of it and spread out behind it, with one observer ahead and one behind.',
    spec: { type: 'doppler_wavefronts', params: { speedRatio: 0.5, observers: [{ position: 'ahead' }, { position: 'behind' }] } },
  },
  {
    id: 'doppler-dense-speeds-frequency',
    note: 'dense: seven fronts with their emission points, both speeds and the source frequency printed, moving LEFT, observers numbered',
    question: 'The siren shown emits sound at the frequency given. What frequency does observer 1, ahead of the siren, hear?',
    alt: 'A source moving to the left through seven circular wavefronts, bunched ahead of it and spread out behind, with a dot where each was emitted. Two observers are numbered; the wave speed, the source speed and the source frequency are printed.',
    spec: { type: 'doppler_wavefronts', params: { waveSpeed: 340, sourceSpeed: 102, frequency: 500, fronts: 7, direction: 'left', emissionPoints: true, letterLabels: 'numerals', observers: [{ position: 'ahead', label: 'P' }, { position: 'behind', label: 'Q' }], title: 'A siren moving past two listeners' } },
  },
  {
    id: 'doppler-blank-source-speed',
    note: 'a "?" on the velocity arrow; the wave speed and the source frequency printed; one observer ahead',
    question: 'The observer X hears a frequency of 600 Hz. What is the speed of the source, marked "?"?',
    alt: 'A source moving to the right through five circular wavefronts, bunched ahead of it, towards an observer. The wave speed and the source frequency are printed; the speed of the source is marked with a boxed question mark.',
    spec: { type: 'doppler_wavefronts', params: { waveSpeed: 340, sourceSpeed: 68, frequency: 480, showSourceSpeed: 'blank', observers: [{ position: 'ahead' }] } },
  },
  {
    id: 'doppler-supersonic-cone',
    note: 'supersonic at twice the wave speed: the fronts fall behind the source and the two Mach lines touch them all; the ratio printed, the angle asked for',
    question: 'The source shown moves at twice the speed of the waves. What is the angle marked "?" between its path and the edge of the cone?',
    alt: 'A source moving to the right faster than its own waves: six circular wavefronts lie behind it inside a cone formed by two straight lines from the source. The speed ratio is printed; the half-angle of the cone is marked with a boxed question mark.',
    spec: { type: 'doppler_wavefronts', params: { speedRatio: 2, fronts: 6, shockCone: true, coneAngle: 'blank', showRatio: 'value' } },
  },
  {
    id: 'doppler-sonic-fronts-touch',
    note: 'exactly the wave speed: every front touches at the source (no cone to draw); an observer behind only',
    question: 'What does the figure show about the speed of the source compared with the speed of the waves?',
    alt: 'A source moving to the right with five circular wavefronts that all touch at the source itself, and one observer behind it.',
    spec: { type: 'doppler_wavefronts', params: { speedRatio: 1, observers: [{ position: 'behind', label: 'Y' }] } },
  },
  // --- photoelectric_setup: tube ------------------------------------------------
  {
    id: 'photo-tube-simple-sodium',
    note: 'simple: light of a given wavelength on a sodium plate, work function printed, electrons crossing',
    question: 'What is the maximum kinetic energy of the electrons leaving the plate, in eV? (hc = 1240 eV·nm)',
    alt: 'A photoelectric tube: light falls on a sodium plate inside an evacuated tube and electrons cross to a collector. A microammeter and a variable voltage source complete the circuit. The wavelength of the light and the work function of the plate are printed.',
    spec: { type: 'photoelectric_setup', params: { variant: 'tube', wavelength: 400, workFunction: 2.28, metal: 'sodium', showElectrons: true } },
  },
  {
    id: 'photo-tube-dense-stopping-voltage',
    note: 'dense: frequency, work function and the stopping voltage all printed, electrons drawn, a title',
    question: 'Use the stopping voltage shown to find the work function of the plate — does it agree with the value printed?',
    alt: 'A photoelectric tube with light on a potassium plate, electrons crossing to the collector, a microammeter and a variable source. The frequency of the light, the work function and the stopping voltage are all printed.',
    spec: { type: 'photoelectric_setup', params: { variant: 'tube', frequency: 7.5, workFunction: 2.3, metal: 'potassium', showStoppingVoltage: 'value', showElectrons: true, title: 'Measuring the stopping voltage' } },
  },
  {
    id: 'photo-tube-blank-work-function',
    note: 'a "?" on the work function AND on the stopping voltage; the light printed; no electrons drawn (the picture does not say whether any leave)',
    question: 'The stopping voltage is found to be 0.65 V. What is the work function of the plate, marked "?", in eV?',
    alt: 'A photoelectric tube with light on a metal plate, a collector, a microammeter and a variable source. The wavelength of the light is printed; the work function of the plate and the stopping voltage are marked with boxed question marks.',
    spec: { type: 'photoelectric_setup', params: { variant: 'tube', wavelength: 250, workFunction: 4.31, showWorkFunction: 'blank', showStoppingVoltage: 'blank' } },
  },
  // --- photoelectric_setup: graph -----------------------------------------------
  {
    id: 'photo-graph-simple-one-metal',
    note: 'simple: one metal with its threshold on a gridline (5.0), numbered axes, nothing labelled — everything is read',
    question: 'The graph shows the maximum kinetic energy of photoelectrons from a metal. What is the threshold frequency of the metal?',
    alt: 'A graph of maximum kinetic energy in electronvolts against frequency: a straight line rising from a point on the frequency axis.',
    spec: { type: 'photoelectric_setup', params: { variant: 'graph', metals: [{ threshold: 5 }], fMax: 12, xStep: 2 } },
  },
  {
    id: 'photo-graph-dense-two-metals-extended',
    note: 'dense: two metals as a solid and a dashed line, each continued (thin dashes) back to the energy axis, two lettered points, a legend',
    question: 'Which of the two metals shown has the larger work function, and how do you know the two lines must be parallel?',
    alt: 'A graph of maximum kinetic energy against frequency with two parallel straight lines, one solid and one dashed, for two metals. Each line is continued by thin dashes down to a negative value on the energy axis. Two lettered points are marked.',
    spec: { type: 'photoelectric_setup', params: { variant: 'graph', metals: [{ threshold: 4, label: 'metal P' }, { threshold: 7, label: 'metal Q' }], extend: true, fMax: 14, xStep: 2, marks: [{ frequency: 10, label: 'R' }, { frequency: 12, label: 'S', metal: 1 }] } },
  },
  {
    id: 'photo-graph-blank-threshold-slope',
    note: 'a "?" on the threshold frequency and on the slope, the work function printed at the intercept; unnumbered axes',
    question: 'The line meets the energy axis at the value shown. What is the threshold frequency marked "?"? (h = 4.14 × 10⁻¹⁵ eV·s)',
    alt: 'A graph of maximum kinetic energy against frequency on unnumbered axes: a straight line rising from the frequency axis, continued by dashes down to a labelled value on the energy axis. The threshold frequency and the slope are marked with boxed question marks.',
    spec: { type: 'photoelectric_setup', params: { variant: 'graph', metals: [{ workFunction: 2.28 }], extend: true, xNumbers: false, yNumbers: false, thresholdLabel: 'blank', workFunctionLabel: 'value', slopeLabel: 'blank' } },
  },
  {
    id: 'photo-graph-labelled-values',
    note: 'threshold and slope printed, no extension — labels beside the line on a numbered grid',
    question: 'Use the threshold frequency and the slope shown to find the work function of the metal, in eV.',
    alt: 'A graph of maximum kinetic energy against frequency: a straight line rising from a labelled point on the frequency axis, with its slope printed.',
    spec: { type: 'photoelectric_setup', params: { variant: 'graph', metals: [{ workFunction: 2.28 }], thresholdLabel: 'value', slopeLabel: 'value' } },
  },
];
