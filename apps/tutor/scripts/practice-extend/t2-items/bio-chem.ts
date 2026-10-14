/** GreenApple T2 figure items — group "bio-chem". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, arr, sum, falseOne, type Ctx, type Item, type P, type Spec } from './kit';

// ── helpers ─────────────────────────────────────────────────────────────────

/** Cell cycle wheel: [name, duration, label?]. */
const wheel = (phases: Array<[string, number, string?]>, extra: P = {}): Spec => S('cell_cycle_wheel', { phases: phases.map(([name, duration, label]) => ({ name, duration, ...(label ? { label } : {}) })), ...extra });
const bio = (variant: string, params: P): Spec => S('bio_schematic', { variant, ...params });
const MITOSIS = ['prophase', 'metaphase', 'anaphase', 'telophase'];

/** Pedigree: [id, sex, affected?, father?, mother?]. */
type Ind = [string, 'M' | 'F', 0 | 1, string?, string?];
const ped = (inds: Ind[], extra: P = {}): Spec => S('pedigree', { individuals: inds.map(([id, sex, aff, father, mother]) => ({ id, sex, affected: aff === 1, ...(father ? { father, mother } : {}) })), ...extra });
interface Person { id: string; sex: string; affected: boolean; father?: string; mother?: string }
const people = (c: Ctx): Person[] => arr(c.p.individuals) as unknown as Person[];
const person = (c: Ctx, id: string): Person => { const q = people(c).find((x) => x.id === id); if (!q) throw new Error(`no individual ${id}`); return q; };
const childrenOf = (c: Ctx, id: string): Person[] => people(c).filter((k) => k.father === id || k.mother === id);
const fits = (c: Ctx, mode: string): boolean => c.txt('pedigree_mode_consistent', { mode }) === 'yes';
/** X-linked recessive: an unaffected female who must carry the allele (an affected father or an affected son). */
const forcedCarrier = (c: Ctx, k: Person): boolean => k.sex === 'F' && !k.affected && ((!!k.father && person(c, k.father).affected) || childrenOf(c, k.id).some((x) => x.sex === 'M' && x.affected));

/** Gels. */
const gel = (sizes: number[], lanes: Array<[string, number[]]>, extra: P = {}): Spec => S('gel_electrophoresis', { ladder: { sizes }, lanes: lanes.map(([label, bands]) => ({ label, bands })), ...extra });
const bandsOf = (c: Ctx, lane: string): number[] => Array.from({ length: c.num('gel_fragment_count', { lane }) }, (_, band) => c.num('gel_band_size', { lane, band }));

/** Cladograms. */
const tree = (t: unknown, extra: P = {}): Spec => S('phylogenetic_tree', { tree: t, ...extra });
/** The path of internal nodes from the root to a tip, on the spec's own tree. */
const pathTo = (c: Ctx, tip: string): unknown[] => {
  const walk = (n: unknown, acc: unknown[]): unknown[] | null => {
    if (typeof n === 'string') return n === tip ? acc : null;
    const o = n as P;
    if (!o.children) return o.name === tip ? acc : null;
    for (const k of o.children as unknown[]) { const r = walk(k, [...acc, o]); if (r) return r; }
    return null;
  };
  const r = walk(c.p.tree, []);
  if (!r) throw new Error(`no tip ${tip}`);
  return r;
};
/** Depth of the most recent common ancestor of two tips (0 = the root). */
const ancDepth = (c: Ctx, x: string, y: string): number => { const a = pathTo(c, x); const b = pathTo(c, y); let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i - 1; };
/** x shares a more recent common ancestor with a than with b. */
const closer = (c: Ctx, x: string, a: string, b: string): boolean => ancDepth(c, x, a) > ancDepth(c, x, b);
const hasTrait = (c: Ctx, trait: string, tip: string): boolean => c.txt('phylo_shared_trait', { trait }).split(', ').includes(tip);

/** Flow diagrams. */
const flow = (variant: string, params: P): Spec => S('flow_diagram', { variant, ...params });
const N = (id: string, label: string, col: number, row: number): P => ({ id, label, col, row });
const E = (pairs: Array<[string, string]>): P[] => pairs.map(([from, to]) => ({ from, to }));
/** Every position (1 = producer) at which a node stands in the chains of a web, from the spec's own arrows. */
const levelsOf = (c: Ctx, id: string): Set<number> => {
  const edges = arr(c.p.edges).map((e) => [e.from as string, e.to as string]);
  const out = new Set<number>();
  const up = (n: string, depth: number) => { const prey = edges.filter(([, to]) => to === n).map(([f]) => f); if (!prey.length) out.add(depth); for (const p of prey) up(p, depth + 1); };
  up(id, 1);
  return out;
};
const nodeId = (c: Ctx, label: string): string => { const n = arr(c.p.nodes).find((k) => k.label === label); if (!n) throw new Error(`no box ${label}`); return n.id as string; };

/** Molecules. */
const at = (id: string, el: string, extra: P = {}): P => ({ id, el, ...extra });
const bd = (a: string, b: string, order = 1, extra: P = {}): P => ({ a, b, order, ...extra });
const molecule = (atoms: P[], bonds: P[], extra: P = {}): P => ({ atoms, bonds, ...extra });
const mols = (molecules: P[], extra: P = {}): Spec => S('molecular_structure', { molecules, ...extra });
const VALENCE: Record<string, number> = { H: 1, C: 4, N: 5, O: 6 };
/** Electrons round one atom of a drawn molecule: 2 per lone pair + 2 per shared pair. */
const shellOf = (m: P, id: string): number => { const a = arr(m.atoms).find((k) => k.id === id)!; return 2 * ((a.lonePairs as number) ?? 0) + 2 * sum(arr(m.bonds).filter((b) => b.a === id || b.b === id).map((b) => (b.order as number) ?? 1)); };
/** A drawn structure is right when it spends exactly the valence electrons of its atoms and every atom has a full shell (H 2, others 8). */
const lewisRight = (c: Ctx, i: number): boolean => {
  const m = arr(c.p.molecules)[i];
  const budget = sum(arr(m.atoms).map((a) => VALENCE[a.el as string]));
  return c.num('mol_count', { want: 'valence_electrons', molecule: i }) === budget && arr(m.atoms).every((a) => shellOf(m, a.id as string) === (a.el === 'H' ? 2 : 8));
};
const ALT_LEWIS = 'Bonds are drawn as lines (one line a single bond, two a double, three a triple) and lone pairs as pairs of dots beside their atom.';

const heating = (params: P): Spec => S('heating_curve', params);

// ── items ───────────────────────────────────────────────────────────────────

export const ITEMS: Item[] = [
  // ════ Biology: cell cycle & mitosis ════
  ...G('bio.cell-cycle-mitosis', 'Reading the cell cycle and the stages of mitosis from a figure', [
    {
      t: 'pick out the DNA-copying phase on a wheel with three unnamed sectors, and read its length', d: 2, need: 'reason',
      spec: wheel([['G1', 9, 'P'], ['S', 6, 'Q'], ['G2', 3, 'R'], ['M', 2]], { interphase: true }),
      alt: 'Clockwise from the top, the sectors are labelled P (9 h printed beside it), then Q (6 h), then R (3 h), then M (2 h). An arc outside P, Q and R is labelled interphase.',
      q: 'The wheel shown is one cell cycle, read clockwise from the top. Three of its phases are labelled only P, Q and R. Which sector is the phase in which the cell copies its DNA, so that each chromosome becomes two sister chromatids?',
      o: [
        ['Sector Q', 'correct'],
        ['Sector P', 'takes the first and longest phase of interphase, where the cell only grows, as the copying phase'],
        ['Sector R', 'places the copying in the gap just before mitosis, where the cell proofreads the copies'],
        ['Sector M', 'thinks the DNA is copied during mitosis itself'],
      ],
      holds: ['the phase each option names (cycle_phase of its label; M is printed) is S', [
        (c) => c.txt('cycle_phase', { label: 'Q' }) === 'S',
        (c) => c.txt('cycle_phase', { label: 'P' }) === 'S',
        (c) => c.txt('cycle_phase', { label: 'R' }) === 'S',
        (c) => (arr(c.p.phases).find((k) => !k.label)?.name as string) === 'S',
      ]],
      h: ['Interphase runs G1, then S, then G2, and mitosis follows. Start from the sector that is named and go round clockwise.', 'The copying happens in the middle part of interphase, before mitosis begins.'],
      s: 'Read from the figure: going clockwise from the top the sectors are P (9 h), Q (6 h), R (3 h) and M (2 h), and the interphase arc covers P, Q and R. Interphase runs G1, S, G2 in that order, so P is G1, Q is S and R is G2. DNA is copied in S phase, so the answer is sector Q, the 6 h phase between G1 and G2.',
    },
    {
      t: 'count the chromosomes in a dividing cell and give the number each daughter cell will have', d: 3, need: 'calc',
      spec: bio('division', { n: 3, cells: [{ stage: 'anaphase' }] }),
      alt: 'One cell in the middle of a mitotic division, with its chromosomes drawn as single sticks pulled toward the two ends of the cell. Pairs of sticks of the same length are drawn, one solid and one hollow.',
      q: 'The cell shown is dividing by mitosis. Count its chromosomes using the rule of one chromosome for each centromere. When mitosis and cytokinesis are complete, how many chromosomes will each of the two daughter cells contain?',
      n: '6',
      calc: ['division_count(chromosomes) of the anaphase cell (division_stage) ÷ 2: the separated chromatids are shared equally between the two poles', (c) => { if (c.txt('division_stage', { cell: 0 }) !== 'anaphase') throw new Error('not anaphase'); return c.num('division_count', { cell: 0, want: 'chromosomes' }) / 2; }],
      h: ['First name the stage: are the chromosomes X-shaped, or have the sister chromatids already come apart and started moving to the two ends?', 'Once sister chromatids separate, each one counts as a chromosome. Each end of the cell receives one full set.'],
      s: 'Read from the figure: the sister chromatids have separated and are moving to opposite ends, so the cell is in anaphase. There are 12 single sticks, each with its own centromere, so the cell holds 12 chromosomes at this moment, 6 moving to each end. Each daughter cell therefore gets 6 chromosomes, the same as the parent cell had before division.',
    },
    {
      t: 'put four cells drawn out of order into the order of mitosis', d: 2, need: 'reason',
      spec: bio('division', { n: 2, cells: [{ stage: 'anaphase', label: 'P' }, { stage: 'prophase', label: 'Q' }, { stage: 'telophase', label: 'R' }, { stage: 'metaphase', label: 'S' }] }),
      alt: 'Four cells labelled P, Q, R and S, each at a different stage of mitosis, drawn in no particular order, with their chromosomes drawn as sticks.',
      q: 'The four cells shown, labelled P, Q, R and S, are at different stages of mitosis and are drawn in no particular order. In which order do these stages happen?',
      o: [
        ['Q, S, P, R', 'correct'],
        ['Q, P, S, R', 'has the chromatids separate before the chromosomes line up at the middle'],
        ['S, Q, P, R', 'starts with the lined-up chromosomes, before they have condensed'],
        ['R, P, S, Q', 'reads the two groups at the ends of the cell as the start of division'],
      ],
      calc: ['the cell labels sorted by stage (division_stage of each cell) into prophase, metaphase, anaphase, telophase', (c) => arr(c.p.cells).map((k) => k.label as string).sort((x, y) => MITOSIS.indexOf(c.txt('division_stage', { cell: x })) - MITOSIS.indexOf(c.txt('division_stage', { cell: y }))).join(', ')],
      h: ['Name each cell\'s stage from where its chromosomes are: scattered, lined up across the middle, moving apart, or gathered at the two ends.', 'The order of mitosis is prophase, metaphase, anaphase, telophase.'],
      s: 'Read from the figure: in cell Q the X-shaped chromosomes are scattered (prophase); in cell S they are lined up across the middle (metaphase); in cell P single chromatids are moving to opposite ends (anaphase); in cell R they are gathered at the two ends (telophase). The order is Q, S, P, R.',
    },
  ]),

  // ════ Biology: pedigrees ════
  ...G('bio.pedigrees-human-genetics', 'Reading an X-linked or autosomal pattern from a pedigree', [
    {
      t: 'genotype of an unaffected woman whose son is affected', d: 2, need: 'reason',
      spec: ped([['a', 'M', 0], ['b', 'F', 0], ['s', 'M', 1, 'a', 'b'], ['d', 'F', 0, 'a', 'b'], ['h', 'M', 0], ['k1', 'M', 1, 'h', 'd'], ['k2', 'F', 0, 'h', 'd']]),
      alt: 'Generation I: the couple I-1 (unaffected male) and I-2 (unaffected female). Their children in generation II: II-1 (affected male) and II-2 (unaffected female). II-2 is partnered with II-3, an unaffected male who married in; their children in generation III: III-1 (affected male) and III-2 (unaffected female).',
      q: 'The pedigree shown follows an X-linked recessive trait (Xᴬ is the normal allele, Xᵃ the recessive allele). Which describes II-2 and gives her genotype?',
      o: [
        ['Carrier, Xᴬ Xᵃ', 'correct'],
        ['Homozygous normal, Xᴬ Xᴬ', 'reads an unshaded symbol as carrying no recessive allele at all'],
        ['Affected, Xᵃ Xᵃ', 'gives her the allele on both X chromosomes, which would make her affected'],
        ['Hemizygous normal, Xᴬ Y', 'writes a female genotype with a Y chromosome'],
      ],
      holds: ['II-2 is d (the daughter of I-1 and I-2, drawn left of her husband): unaffected, female, with an affected son, so under X-linked recessive inheritance (pedigree_mode_consistent: yes) she must be Xᴬ Xᵃ; each option compared with that genotype', [
        (c) => fits(c, 'x_linked_recessive') && forcedCarrier(c, person(c, 'd')),
        (c) => !forcedCarrier(c, person(c, 'd')) && person(c, 'd').sex === 'F' && !person(c, 'd').affected,
        (c) => person(c, 'd').affected,
        (c) => person(c, 'd').sex === 'M',
      ]],
      h: ['A son gets his only X chromosome from his mother.', 'An unshaded symbol means unaffected, which does not rule out carrying one recessive allele.'],
      s: 'Read from the figure: II-2 is an unshaded circle, an unaffected woman, and her son III-1 is shaded, affected. An affected son is Xᵃ Y, and his X came from his mother. Since she is unaffected, her other X must carry the normal allele, so II-2 is a carrier: Xᴬ Xᵃ.',
    },
    {
      t: 'count the women who must be carriers of an X-linked recessive allele', d: 3, need: 'reason',
      spec: ped([['f', 'M', 1], ['m', 'F', 0], ['d1', 'F', 0, 'f', 'm'], ['h1', 'M', 0], ['s1', 'M', 0, 'f', 'm'], ['w', 'F', 0], ['d2', 'F', 0, 'f', 'm'], ['g1', 'M', 1, 'h1', 'd1'], ['g2', 'F', 0, 'h1', 'd1'], ['g3', 'M', 1, 's1', 'w']]),
      alt: 'Generation I: a couple, an affected man and an unaffected woman. Generation II, left to right: a married-in unaffected man, partnered with the couple\'s first daughter (unaffected); the couple\'s son (unaffected), partnered with an unaffected woman who married in; and the couple\'s second daughter (unaffected, no partner shown). Generation III: the first daughter\'s children, an affected son and an unaffected daughter; the son\'s one child, an affected son.',
      q: 'The pedigree shown follows an X-linked recessive trait. Counting only the unaffected women in the pedigree, how many of them must be carriers (Xᴬ Xᵃ)?',
      n: '3',
      calc: ['unaffected females with an affected father or an affected son (spec); the chart fits X-linked recessive inheritance (pedigree_mode_consistent)', (c) => { if (!fits(c, 'x_linked_recessive')) throw new Error('not X-linked recessive'); return people(c).filter((k) => forcedCarrier(c, k)).length; }],
      h: ['A father passes his X chromosome to every daughter, and a son gets his X chromosome from his mother.', 'Check each unshaded circle: does she have a shaded father, or a shaded son? If neither, the chart does not decide.'],
      s: 'Read from the figure: I-1 is affected (Xᵃ Y), so both of his daughters in generation II received his Xᵃ and are carriers. The unaffected woman who married his unaffected son has an affected son in generation III; that son\'s X came from her, so she is a carrier too. I-2 and the unaffected granddaughter have no affected father or son, so the chart does not decide for them. That makes 3.',
    },
    {
      t: 'decide which modes of inheritance the chart allows', d: 3, need: 'reason',
      spec: ped([['a', 'M', 0], ['b', 'F', 0], ['s', 'M', 1, 'a', 'b'], ['d', 'F', 0, 'a', 'b'], ['h', 'M', 1], ['c1', 'F', 1, 'h', 'd'], ['c2', 'M', 1, 'h', 'd'], ['c3', 'M', 0, 'h', 'd']]),
      alt: 'Generation I: the couple I-1 (unaffected male) and I-2 (unaffected female). Their children in generation II: II-1 (affected male) and II-2 (unaffected female). II-2 is partnered with II-3, an affected male who married in; their children in generation III: III-1 (affected female), III-2 (affected male) and III-3 (unaffected male).',
      q: 'Which conclusion about the trait in the pedigree shown is correct?',
      o: [
        ['It is recessive, and it could be X-linked or autosomal', 'correct'],
        ['It is recessive, and it must be autosomal', 'reads the affected daughter as ruling out X-linkage without checking her father'],
        ['It is dominant, and it could be X-linked or autosomal', 'reads the trait showing up in two generations in a row as dominance and misses that two unaffected parents in generation I have an affected son'],
        ['It is recessive, and it must be X-linked', 'takes the larger number of affected males as proof of X-linkage'],
      ],
      holds: ['pedigree_mode_consistent for autosomal dominant, autosomal recessive and X-linked recessive, each option tested against those verdicts', [
        (c) => fits(c, 'autosomal_recessive') && fits(c, 'x_linked_recessive') && !fits(c, 'autosomal_dominant'),
        (c) => fits(c, 'autosomal_recessive') && !fits(c, 'x_linked_recessive'),
        (c) => fits(c, 'autosomal_dominant') || fits(c, 'x_linked_dominant'),
        (c) => fits(c, 'x_linked_recessive') && !fits(c, 'autosomal_recessive'),
      ]],
      h: ['Look for two unaffected parents with an affected child: a dominant trait cannot appear from nowhere.', 'An affected daughter rules out X-linked recessive only when her father is unaffected. Check her father\'s symbol.'],
      s: 'Read from the figure: the unaffected couple in generation I have an affected son, so the trait is recessive. In generation III the affected daughter has an affected father (II-3) and an unaffected mother (II-2), who would have to be a carrier, since her affected son got his X from her. Xᴬ Xᵃ × Xᵃ Y can give an affected daughter and an affected son, so X-linked recessive fits; autosomal recessive (Aa × aa) fits too. The chart does not decide between them.',
    },
  ]),

  // ════ Biology: biotechnology ════
  ...G('bio.biotechnology', 'Reading DNA fingerprints and fragment sizes from a gel', [
    {
      t: 'match a crime-scene DNA fingerprint to one suspect', d: 2, need: 'reason',
      spec: gel([1000, 700, 500, 400, 300, 200, 100], [['CS', [900, 450, 250]], ['P', [900, 350, 250]], ['Q', [900, 450, 250]], ['R', [600, 450, 150]]]),
      alt: 'A gel with a ladder lane and four sample lanes: CS (the crime-scene sample) and suspects P, Q and R. Each sample lane shows three bands, some of them at the same level as bands in other lanes.',
      q: 'The gel shown holds the DNA fingerprint from a crime-scene sample (lane CS) and from three suspects (lanes P, Q and R). Which suspect\'s DNA matches the crime-scene sample?',
      o: [
        ['Suspect Q', 'correct'],
        ['Suspect P', 'accepts a lane that matches two of the three bands'],
        ['Suspect R', 'matches on a single shared band'],
        ['None of the suspects', 'expects an exact match to look different from the sample, not identical'],
      ],
      calc: ['gel_match (identity) of lane CS among lanes P, Q, R', (c) => `Suspect ${c.txt('gel_match', { mode: 'identity', sample: 'CS', candidates: ['P', 'Q', 'R'] })}`],
      h: ['A match must line up with the crime-scene lane band for band, with no band missing and none extra.', 'Follow each band of lane CS straight across the gel and check every suspect lane at that level.'],
      s: 'Read from the figure: lane CS has three bands. Lane Q has bands at exactly those three levels and no others. Lane P shares the top and bottom bands but its middle band sits lower; lane R shares only the middle band. Only suspect Q matches band for band.',
    },
    {
      t: 'paternity test: find the man who accounts for every band the child did not get from the mother', d: 3, need: 'reason',
      spec: gel([1000, 700, 500, 400, 300, 200, 100], [['Mother', [800, 600, 300, 200]], ['Child', [800, 500, 300, 150]], ['P', [500, 400, 250, 150]], ['Q', [500, 350, 300, 120]], ['R', [800, 400, 300, 150]]]),
      alt: 'A gel with a ladder lane and five sample lanes: Mother, Child and three men, P, Q and R. Every sample lane shows four bands, several of them at the same level as bands in the child\'s lane.',
      q: 'The gel shown holds DNA fingerprints from a mother (lane Mother), her child (lane Child) and three men (lanes P, Q and R). Which man could be the child\'s biological father?',
      o: [
        ['Man P', 'correct'],
        ['Man Q', 'checks only one of the two bands the child did not get from the mother'],
        ['Man R', 'picks the man who shares the most bands with the child, counting bands that came from the mother'],
        ['None of the three men', 'expects the father to share every one of the child\'s bands'],
      ],
      calc: ['gel_match (paternity) with child lane Child, mother lane Mother, candidates P, Q, R', (c) => `Man ${c.txt('gel_match', { mode: 'paternity', child: 'Child', mother: 'Mother', candidates: ['P', 'Q', 'R'] })}`],
      h: ['Every band of the child came from the mother or from the father. First cross off the child\'s bands that the mother also has.', 'The father must have every one of the child\'s bands that are left.'],
      s: 'Read from the figure: the child has four bands; two of them are level with bands of the mother, so those came from her. The other two must come from the father. Man P has bands at both of those levels. Man Q has only the upper one, and man R only the lower one, although man R shares three bands with the child, two of them from the mother. Only man P can be the father.',
    },
    {
      t: 'length of a linear DNA molecule from the sizes of its fragments', d: 3, need: 'calc',
      spec: gel([3000, 2000, 1500, 1000, 700, 500, 300, 200], [['D', [1500, 700, 200]]]),
      alt: 'A gel with a ladder lane, its band sizes in base pairs printed beside it, and one sample lane D holding three bands, each level with a ladder band.',
      q: 'A linear DNA molecule was cut with a restriction enzyme at every one of its recognition sites, and the pieces were run in lane D of the gel shown beside a size ladder. How long was the uncut molecule, in base pairs?',
      n: '2400',
      calc: ['the sum of the band sizes of lane D (gel_band_size of each band)', (c) => sum(bandsOf(c, 'D'))],
      h: ['Read each band of lane D against the ladder band at the same level; smaller pieces travel farther from the wells.', 'Cutting does not lose any DNA, so the pieces add back up to the whole molecule.'],
      s: 'Read from the figure: lane D has three bands, level with the ladder bands of 1500, 700 and 200 base pairs. Cutting only splits the molecule, so the uncut molecule was 1500 + 700 + 200 = 2400 base pairs long.',
    },
  ]),

  // ════ Biology: cladograms ════
  ...G('bio.phylogenetics-cladograms', 'Reading relationships and characters from a cladogram', [
    {
      t: 'which tips inherited a character marked on a branch', d: 2, need: 'reason',
      spec: tree({ children: ['Lamprey', { traits: ['jaws'], children: [{ traits: ['four limbs'], children: [{ traits: ['amniotic egg'], children: ['Mouse', 'Lizard'] }, 'Frog'] }, 'Shark'] }] }, { traitStyle: 'label' }),
      alt: 'A cladogram with five tips, top to bottom: Lamprey, Mouse, Lizard, Frog, Shark. Three characters are marked on branches: jaws, four limbs and amniotic egg.',
      q: 'On the cladogram shown, each character is marked on the branch where it first evolved. According to the cladogram, which of the animals inherited four limbs?',
      o: [
        ['Mouse, lizard and frog', 'correct'],
        ['Frog only', 'gives the character only to the tip drawn nearest the mark'],
        ['Mouse and lizard only', 'starts from the next mark up the tree, the amniotic egg'],
        ['Mouse, lizard, frog and shark', 'goes back one branch point too far, to the mark for jaws'],
      ],
      holds: ['phylo_shared_trait("four limbs") compared with the set each option names', [
        (c) => c.txt('phylo_shared_trait', { trait: 'four limbs' }) === 'Mouse, Lizard, Frog',
        (c) => c.txt('phylo_shared_trait', { trait: 'four limbs' }) === 'Frog',
        (c) => c.txt('phylo_shared_trait', { trait: 'four limbs' }) === 'Mouse, Lizard',
        (c) => c.txt('phylo_shared_trait', { trait: 'four limbs' }) === 'Mouse, Lizard, Frog, Shark',
      ]],
      h: ['A character marked on a branch evolved once in that lineage, and every tip above that mark inherits it.', 'Find the four-limbs mark, then follow every branch on the tip side of it out to the tips.'],
      s: 'Read from the figure: the four-limbs mark sits on the branch leading to the branch point from which the frog, the lizard and the mouse all descend. Every tip beyond the mark inherits the character, so the mouse, the lizard and the frog have four limbs; the shark and the lamprey branch off before the mark.',
    },
    {
      t: 'work backwards from the characters to describe the animal missing from a tip', d: 3, need: 'reason',
      spec: tree({ children: ['Lancelet', { traits: ['backbone'], children: ['Lamprey', { traits: ['jaws'], children: ['Shark', { traits: ['lungs'], children: [{ name: 'Frog', blank: true }, { traits: ['amniotic egg'], children: ['Lizard', 'Mouse'] }] }] }] }] }, { traitStyle: 'key', outgroup: 'Lancelet' }),
      alt: 'A cladogram with six tips, top to bottom: Lancelet (the outgroup), Lamprey, Shark, a tip whose name is hidden by a question mark, Lizard and Mouse. Four characters are marked on branches: backbone, jaws, lungs and amniotic egg.',
      q: 'On the cladogram shown, each character is marked on the branch where it first evolved, and the name of one animal is hidden by a question mark. Which set of characters does the hidden animal have?',
      o: [
        ['Backbone, jaws and lungs, but no amniotic egg', 'correct'],
        ['Backbone, jaws, lungs and an amniotic egg', 'puts the hidden animal above the amniotic-egg mark'],
        ['Backbone and jaws, but no lungs', 'stops one mark short of the branch the hidden animal sits on'],
        ['Lungs only, with no backbone or jaws', 'counts only the mark nearest the tip, not every mark on its path from the root'],
      ],
      holds: ['which marked characters the blank tip (phylo_blank) has, by phylo_shared_trait for each character, compared with the set each option names', [
        (c) => { const x = c.txt('phylo_blank', { what: 'tip' }); return ['backbone', 'jaws', 'lungs'].every((t) => hasTrait(c, t, x)) && !hasTrait(c, 'amniotic egg', x); },
        (c) => { const x = c.txt('phylo_blank', { what: 'tip' }); return ['backbone', 'jaws', 'lungs', 'amniotic egg'].every((t) => hasTrait(c, t, x)); },
        (c) => { const x = c.txt('phylo_blank', { what: 'tip' }); return ['backbone', 'jaws'].every((t) => hasTrait(c, t, x)) && !hasTrait(c, 'lungs', x); },
        (c) => { const x = c.txt('phylo_blank', { what: 'tip' }); return hasTrait(c, 'lungs', x) && !hasTrait(c, 'backbone', x) && !hasTrait(c, 'jaws', x); },
      ]],
      h: ['Trace the path from the root out to the hidden tip and note every character mark you pass.', 'A mark on a branch that leads away from the hidden tip belongs only to the tips beyond it.'],
      s: 'Read from the figure: going from the root to the hidden tip you pass the marks for backbone, jaws and lungs. The amniotic-egg mark is on the branch leading only to the lizard and the mouse, so the hidden animal does not have it. It has a backbone, jaws and lungs but no amniotic egg.',
    },
    {
      t: 'find the false statement about relatedness on a tree whose tip order misleads', d: 3, need: 'reason',
      spec: tree({ children: [{ children: [{ children: [{ children: ['Bird', 'Crocodile'] }, 'Turtle'] }, { children: ['Salamander', 'Frog'] }] }, 'Shark'] }),
      alt: 'A cladogram with six tips, top to bottom: Bird, Crocodile, Turtle, Salamander, Frog, Shark. No characters are marked; the shark is drawn at the bottom.',
      q: 'Which statement about the cladogram shown is FALSE?',
      o: [
        ['The crocodile is more closely related to the turtle than to the bird', 'correct'],
        ['The turtle is equally related to the salamander and to the frog', 'judges relatedness by how near the tips are drawn'],
        ['The bird shares a more recent common ancestor with the turtle than with the frog', 'compares the distance between tips down the page instead of the branch points'],
        ['The shark is equally related to all five of the other animals', 'treats the tip drawn last as the most distant from its neighbour'],
      ],
      holds: falseOne('depth of the most recent common ancestors compared on the spec tree', [
        (c) => closer(c, 'Crocodile', 'Turtle', 'Bird'),
        (c) => ancDepth(c, 'Turtle', 'Salamander') === ancDepth(c, 'Turtle', 'Frog'),
        (c) => closer(c, 'Bird', 'Turtle', 'Frog'),
        (c) => ['Bird', 'Crocodile', 'Turtle', 'Salamander', 'Frog'].every((t) => ancDepth(c, 'Shark', t) === 0),
      ]),
      h: ['To compare two tips, trace back from each until the paths meet. The more recent the meeting point, the closer the relationship.', 'Do not judge by how close together two tips are drawn: the tree can be rotated at any branch point.'],
      s: 'Read from the figure: the bird and the crocodile join first, at the most recent branch point; the turtle joins that pair one branch point further back. So the crocodile is more closely related to the bird than to the turtle, and that statement is false. The turtle meets the salamander and the frog at the same branch point; the bird meets the turtle before it meets the frog; the shark meets all the others only at the root.',
    },
  ]),

  // ════ Biology: energy flow ════
  ...G('bio.energy-flow-food-webs', 'Energy pyramids and food webs read from a figure', [
    {
      t: 'carry the 10 percent rule up an energy pyramid from the one printed level', d: 2, need: 'calc',
      spec: flow('pyramid', { levels: [{ label: 'Producers' }, { label: 'Primary consumers', value: 4000 }, { label: 'Secondary consumers' }, { label: 'Tertiary consumers', value: 40, show: 'blank' }], unit: 'kJ', transferPercent: 10 }),
      alt: 'An energy pyramid of four stacked bars, widest at the bottom: producers, primary consumers, secondary consumers and tertiary consumers. The value 4000 kJ is printed beside the primary consumers bar only; the top bar, tertiary consumers, carries a question mark.',
      q: 'The energy pyramid shown gives the energy stored in one of its levels. Using the 10 percent rule, about how much energy, in kJ, is stored in the tertiary consumers (the level marked with a question mark)?',
      n: '40',
      ck: ['flow_energy_at_level', { level: 3, percent: 10 }],
      h: ['Going up one level, only about 10 percent of the energy is passed on: divide by 10.', 'Count how many levels separate the printed level from the level with the question mark.'],
      s: 'Read from the figure: the primary consumers store 4000 kJ. The secondary consumers are one level up and get about 10 percent of that, 400 kJ; the tertiary consumers are one more level up and get about 10 percent of 400, which is 40 kJ.',
    },
    {
      t: 'count the separate food chains in a pond food web', d: 2, need: 'reason',
      spec: flow('web', {
        nodes: [N('alg', 'Algae', 0, 3), N('pl', 'Water plants', 2, 3), N('may', 'Mayfly larvae', 0, 2), N('sn', 'Snails', 2, 2), N('fr', 'Frog', 0, 1), N('fi', 'Small fish', 2, 1), N('he', 'Heron', 1, 0)],
        edges: E([['alg', 'may'], ['alg', 'sn'], ['pl', 'sn'], ['may', 'fi'], ['sn', 'fi'], ['may', 'fr'], ['fi', 'he'], ['fr', 'he']]),
      }),
      alt: 'A pond food web of seven boxes: algae and water plants in the bottom row; mayfly larvae and snails above them; a frog and small fish above those; and a heron at the top. Arrows: algae to mayfly larvae, algae to snails, water plants to snails, mayfly larvae to frog, mayfly larvae to small fish, snails to small fish, frog to heron, small fish to heron.',
      q: 'In the pond food web shown, each arrow points from the organism that is eaten to the organism that eats it. How many different food chains run from a producer to the heron?',
      n: '4',
      ck: ['flow_chain_count', {}],
      h: ['A food chain starts at a producer, which no arrow points to, and follows the arrows to the top predator.', 'Start at each producer in turn and follow every branch of arrows separately, counting each complete path once.'],
      s: 'Read from the figure: from the algae, the arrows lead algae → mayfly larvae → small fish → heron, algae → mayfly larvae → frog → heron, and algae → snails → small fish → heron. From the water plants they lead water plants → snails → small fish → heron. That is 4 food chains.',
    },
    {
      t: 'find the organism that feeds at two different trophic levels in a web', d: 3, need: 'reason',
      spec: flow('web', {
        nodes: [N('gr', 'Grass', 1, 3), N('gh', 'Grasshopper', 0, 2), N('mo', 'Mouse', 2, 2), N('fr', 'Frog', 0, 1), N('sn', 'Snake', 2, 1), N('ha', 'Hawk', 1, 0)],
        edges: E([['gr', 'gh'], ['gr', 'mo'], ['gh', 'fr'], ['fr', 'sn'], ['mo', 'sn'], ['sn', 'ha']]),
      }),
      alt: 'A field food web of six boxes: grass in the bottom row; a grasshopper and a mouse above it; a frog and a snake above those; and a hawk at the top. Arrows: grass to grasshopper, grass to mouse, grasshopper to frog, frog to snake, mouse to snake, snake to hawk.',
      q: 'In the food web shown, each arrow points from the organism that is eaten to the organism that eats it. Which organism is a secondary consumer in one of its food chains and a tertiary consumer in another?',
      o: [
        ['The snake', 'correct'],
        ['The frog', 'gives the frog a second level although it eats only the grasshopper'],
        ['The hawk', 'takes the top predator as the one that feeds at several levels, without counting its chains'],
        ['The mouse', 'reads the arrows the wrong way, from eater to eaten'],
      ],
      holds: ['the trophic positions of each organism in every chain of the spec web (secondary consumer = position 3, tertiary = position 4)', [
        (c) => { const l = levelsOf(c, nodeId(c, 'Snake')); return l.has(3) && l.has(4); },
        (c) => { const l = levelsOf(c, nodeId(c, 'Frog')); return l.has(3) && l.has(4); },
        (c) => { const l = levelsOf(c, nodeId(c, 'Hawk')); return l.has(3) && l.has(4); },
        (c) => { const l = levelsOf(c, nodeId(c, 'Mouse')); return l.has(3) && l.has(4); },
      ]],
      h: ['Number the levels along each chain: producer, primary consumer, secondary consumer, tertiary consumer.', 'Follow every chain that reaches each candidate and see whether it stands at the same place in all of them.'],
      s: 'Read from the figure: the snake eats the mouse (grass → mouse → snake, so there it is a secondary consumer) and the frog (grass → grasshopper → frog → snake, so there it is a tertiary consumer). The frog is always a secondary consumer, the mouse always a primary consumer, and the hawk eats only the snake, so it is a tertiary or a quaternary consumer, never a secondary one.',
    },
  ]),

  // ════ Chemistry: Lewis structures ════
  ...G('chem.covalent-bonding-lewis', 'Reading and checking Lewis structures', [
    {
      t: 'count the valence electrons a drawn Lewis structure accounts for', d: 2, need: 'calc',
      spec: mols([molecule([at('H1', 'H'), at('O1', 'O', { lonePairs: 2 }), at('O2', 'O', { lonePairs: 2 }), at('H2', 'H')], [bd('H1', 'O1'), bd('O1', 'O2'), bd('O2', 'H2')], { layout: { type: 'chain', atoms: ['H1', 'O1', 'O2', 'H2'] } })]),
      alt: `The Lewis structure of hydrogen peroxide: two oxygen atoms joined to each other, each also joined to one hydrogen atom, with lone pairs drawn on the oxygens. ${ALT_LEWIS}`,
      q: 'The Lewis structure of hydrogen peroxide, H₂O₂, is shown. Counting both electrons of every bond and both electrons of every lone pair, how many valence electrons does the structure account for in total?',
      n: '14',
      ck: ['mol_count', { want: 'valence_electrons' }],
      h: ['Each line is one shared pair of electrons, and each pair of dots is a lone pair.', 'Count the bonds and the lone pairs separately, then turn each pair into two electrons.'],
      s: 'Read from the figure: three single bonds (H–O, O–O and O–H) hold 3 × 2 = 6 electrons, and the two lone pairs on each oxygen are 4 lone pairs, 4 × 2 = 8 electrons. In total 6 + 8 = 14, which matches 2 × 1 + 2 × 6 = 14 valence electrons from the atoms.',
    },
    {
      t: 'find a hidden carbon–carbon bond order from the octets', d: 3, need: 'reason',
      spec: mols([molecule([at('C1', 'C', { x: 0, y: 0, lonePairs: 0 }), at('C2', 'C', { x: 1, y: 0, lonePairs: 0 }), at('H1', 'H', { from: 'C1', angle: 120 }), at('H2', 'H', { from: 'C1', angle: 240 }), at('H3', 'H', { from: 'C2', angle: 60 }), at('H4', 'H', { from: 'C2', angle: 300 })], [bd('C1', 'C2', 2, { show: 'blank' }), bd('C1', 'H1'), bd('C1', 'H2'), bd('C2', 'H3'), bd('C2', 'H4')])]),
      alt: `Two carbon atoms side by side, each joined to two hydrogen atoms; the bond between the two carbons is hidden by a question mark, and no lone pairs are drawn. ${ALT_LEWIS}`,
      q: 'In the Lewis structure of ethene, C₂H₄, shown, the bond between the two carbon atoms is hidden by a question mark. Neither carbon has a lone pair, and each carbon has a complete octet. What is the order of the hidden bond (1 for single, 2 for double, 3 for triple)?',
      n: '2',
      ck: ['mol_bond_order', { a: 'C1', b: 'C2' }],
      h: ['Count the electrons each carbon already has from the bonds that are drawn.', 'The shared electrons of the hidden bond count for both carbons; work out how many more each carbon needs to reach eight.'],
      s: 'Read from the figure: each carbon has two single bonds to hydrogen, 2 × 2 = 4 electrons, and no lone pairs. To reach an octet each carbon needs 4 more electrons from the bond between them. Four shared electrons are two shared pairs, so the hidden bond is a double bond, order 2.',
    },
    {
      t: 'judge three proposed structures by the electron budget and the octets', d: 3, need: 'reason',
      spec: mols([
        molecule([at('H1', 'H', { x: 0, y: 0 }), at('C1', 'C', { x: 1, y: 0, lonePairs: 0 }), at('C2', 'C', { x: 2, y: 0, lonePairs: 0 }), at('H2', 'H', { x: 3, y: 0 })], [bd('H1', 'C1'), bd('C1', 'C2', 3), bd('C2', 'H2')], { label: 'I' }),
        molecule([at('H1', 'H', { x: 0, y: 0 }), at('C1', 'C', { x: 1, y: 0, lonePairs: 1 }), at('C2', 'C', { x: 2, y: 0, lonePairs: 1 }), at('H2', 'H', { x: 3, y: 0 })], [bd('H1', 'C1'), bd('C1', 'C2', 2), bd('C2', 'H2')], { label: 'II' }),
        molecule([at('H1', 'H', { x: 0, y: 0 }), at('C1', 'C', { x: 1, y: 0, lonePairs: 1 }), at('C2', 'C', { x: 2, y: 0, lonePairs: 1 }), at('H2', 'H', { x: 3, y: 0 })], [bd('H1', 'C1'), bd('C1', 'C2'), bd('C2', 'H2')], { label: 'III' }),
      ], { showFormalCharges: false }),
      alt: `Three proposed structures for ethyne, labelled I, II and III, each with the atoms in the order H, C, C, H; they differ in the bond between the carbons and in the lone pairs drawn on the carbons. ${ALT_LEWIS}`,
      q: 'Three students drew the Lewis structures I, II and III shown for ethyne, C₂H₂ (carbon has 4 valence electrons, hydrogen has 1). Which of these structures is correct?',
      o: [
        ['Structure I only', 'correct'],
        ['Structure II only', 'checks the octets but not the total: it adds two electrons the atoms do not have'],
        ['Structure III only', 'checks the total but not the octets: each carbon is left with only six electrons'],
        ['Structures I and III', 'checks only that the electron total is right'],
      ],
      holds: ['each structure tested for the electron budget (mol_count valence_electrons against the atoms\' valence electrons) and a full shell on every atom (spec bonds and lone pairs); each option compared with the set of right structures', [
        (c) => lewisRight(c, 0) && !lewisRight(c, 1) && !lewisRight(c, 2),
        (c) => lewisRight(c, 1) && !lewisRight(c, 0) && !lewisRight(c, 2),
        (c) => lewisRight(c, 2) && !lewisRight(c, 0) && !lewisRight(c, 1),
        (c) => lewisRight(c, 0) && lewisRight(c, 2) && !lewisRight(c, 1),
      ]],
      h: ['First find the electron budget for C₂H₂, then count the electrons each structure actually shows.', 'Then check each carbon: the electrons in its bonds plus its lone-pair electrons must make eight.'],
      s: 'Read from the figure: the budget is 2 × 4 + 2 × 1 = 10 electrons. Structure I shows two C–H bonds and a triple bond, 5 pairs = 10 electrons, and each carbon has 2 + 6 = 8. Structure II shows 4 bonding pairs and 2 lone pairs, 12 electrons: too many. Structure III shows 3 bonding pairs and 2 lone pairs, 10 electrons, but each carbon has only 2 + 2 + 2 = 6. Only structure I is correct.',
    },
  ]),

  // ════ Chemistry: heating curves ════
  ...G('chem.phase-changes-heating-curves', 'Reading phases and heats from a heating curve', [
    {
      t: 'pick the segment on which liquid and gas are both present', d: 2, need: 'reason',
      spec: heating({ corners: [[0, -40], [2, -10], [5, -10], [9, 50], [20, 50], [22, 80]], xStep: 2, yStep: 20, segmentLabels: ['P', 'Q', 'R', 'S', 'T'] }),
      alt: 'The five segments of the curve are labelled P, Q, R, S and T in order: the line rises, runs flat, rises again, runs flat for a longer stretch at a higher temperature, then rises once more.',
      q: 'The heating curve shown is for a pure substance heated at a steady rate; it starts as a solid. On which labelled segment are the liquid and the gas both present?',
      o: [
        ['Segment S', 'correct'],
        ['Segment Q', 'takes the first plateau, where the solid melts, as the boiling'],
        ['Segment R', 'takes a rising segment as a change of state'],
        ['Segment T', 'thinks boiling continues after the second plateau, where only gas warms'],
      ],
      calc: ['the label of the boiling segment (heating_segment_for boiling); heating_segment state of it is "liquid and gas"', (c) => { const l = c.txt('heating_segment_for', { want: 'boiling' }); if (c.txt('heating_segment', { segment: l, want: 'state' }) !== 'liquid and gas') throw new Error('not liquid and gas'); return `Segment ${l}`; }],
      h: ['A flat segment is a change of state at constant temperature; a rising segment is one phase warming.', 'Starting from a solid, the first flat segment is melting and the second is boiling.'],
      s: 'Read from the figure: the curve rises (P, solid warming), runs flat at −10 °C (Q, melting: solid and liquid), rises (R, liquid warming), runs flat at 50 °C (S, boiling) and rises again (T, gas warming). Liquid and gas are both present while it boils, on segment S.',
    },
    {
      t: 'specific heat of the liquid from the slope segment, with q = mcΔT', d: 3, need: 'calc',
      spec: heating({ corners: [[0, -20], [2, 0], [6, 0], [12, 60], [28, 60], [30, 80]], xStep: 2, yStep: 20, title: 'Sample mass: 50.0 g' }),
      alt: 'The line rises, runs flat, rises again more gently, runs flat for a long stretch at a higher temperature, then rises once more. The sample mass is printed above the graph; neither flat stretch is labelled.',
      q: 'The heating curve shown is for a sample of a pure substance X; the sample mass is printed above the graph. Using q = mcΔT, what is the specific heat of liquid X, in J/g·°C?',
      n: '2',
      calc: ['heating_specific_heat on the liquid segment (segment 3, the slope between the two plateaus: heating_segment state "liquid") with the 50.0 g of the title', (c) => { if (c.txt('heating_segment', { segment: 2, want: 'state' }) !== 'liquid') throw new Error('segment 3 is not the liquid'); return c.num('heating_specific_heat', { segment: 2, mass: 50 }); }],
      h: ['The liquid warms on the rising segment between the two flat stretches. Read the heat added and the temperature change along that segment only.', 'Rearrange q = mcΔT to c = q ÷ (m × ΔT), with the heat in joules.'],
      s: 'Read from the figure: the liquid warms from 0 °C to 60 °C between 6 kJ and 12 kJ, so q = 6 kJ = 6000 J and ΔT = 60 °C. With m = 50.0 g, c = q ÷ (m × ΔT) = 6000 ÷ (50.0 × 60) = 2.0 J/g·°C.',
    },
    {
      t: 'heat of vaporization from the length of the boiling plateau, with q = mΔH', d: 3, need: 'calc',
      spec: heating({ corners: [[0, 20], [2, 60], [5, 60], [8, 120], [20, 120], [22, 160]], xStep: 2, yStep: 20, title: 'Sample mass: 40.0 g' }),
      alt: 'The line rises, runs flat, rises again, runs flat for a much longer stretch at a higher temperature, then rises once more. The sample mass is printed above the graph; neither flat stretch is labelled.',
      q: 'The heating curve shown is for a sample of a pure substance X; the sample mass is printed above the graph. Using q = mΔH, what is the heat of vaporization of X, in J/g?',
      n: '300',
      calc: ['heating_latent_heat on the boiling plateau (heating_segment process "boiling" on segment 4) with the 40.0 g of the title', (c) => { if (c.txt('heating_segment', { segment: 3, want: 'process' }) !== 'boiling') throw new Error('segment 4 is not boiling'); return c.num('heating_latent_heat', { segment: 3, mass: 40 }); }],
      h: ['Boiling is the flat stretch at the higher temperature; its length along the heat axis is the heat it took.', 'Rearrange q = mΔH to ΔH = q ÷ m, with the heat in joules.'],
      s: 'Read from the figure: the higher flat stretch (boiling, at 120 °C) runs from 8 kJ to 20 kJ, so vaporizing the sample takes 12 kJ = 12,000 J. With m = 40.0 g, ΔHvap = 12,000 ÷ 40.0 = 300 J/g.',
    },
  ]),
];

