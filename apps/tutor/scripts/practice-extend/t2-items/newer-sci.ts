/** GreenApple T2 figure items — group "newer-sci". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, near, arr, falseOne, pick, force, rc, pes, Ctx, type Item, type P, type Spec } from './kit';

// ── local helpers ───────────────────────────────────────────────────────────

/** Gels: ladder sizes and lanes [label, bands]. */
const gel = (sizes: number[], lanes: Array<[string, Array<number | P>]>, extra: P = {}): Spec =>
  S('gel_electrophoresis', { ladder: { sizes }, lanes: lanes.map(([label, bands]) => ({ label, bands })), ...extra });
const ALT_GEL = 'Wells are at the top; a band nearer the bottom is a shorter fragment. The left-hand lane is a ladder of fragments of known size.';

/** Pedigree: [id, sex, affected?, father?, mother?]. */
type Ind = [string, 'M' | 'F', 0 | 1, string?, string?];
const ped = (inds: Ind[], extra: P = {}): Spec => S('pedigree', {
  individuals: inds.map(([id, sex, aff, father, mother]) => ({ id, sex, affected: aff === 1, ...(father ? { father, mother } : {}) })),
  ...extra,
});
const ALT_PED = 'Squares are males and circles are females; a filled symbol is an affected individual.';
const MODES = ['autosomal_dominant', 'autosomal_recessive', 'x_linked_dominant', 'x_linked_recessive'] as const;
const fitsMode = (c: Ctx, mode: string): boolean => c.txt('pedigree_mode_consistent', { mode }) === 'yes';
const modesFit = (c: Ctx): string[] => MODES.filter((m) => fitsMode(c, m));

/** Phylogenetic trees, and their structure read from the spec. */
type Clade = string | { name?: string; node?: string; children?: Clade[] };
const tree = (t: Clade, extra: P = {}): Spec => S('phylogenetic_tree', { tree: t, ...extra });
const tipsOf = (k: Clade): string[] => (typeof k === 'string' ? [k] : k.children ? k.children.flatMap(tipsOf) : [k.name as string]);
const internals = (k: Clade, depth = 0): Array<{ node?: string; depth: number; tips: string[] }> =>
  typeof k === 'string' || !k.children ? [] : [{ node: k.node, depth, tips: tipsOf(k) }, ...k.children.flatMap((x) => internals(x, depth + 1))];
const nodesOf = (c: Ctx) => internals(c.p.tree as Clade);
/** How far from the root the most recent common ancestor of the taxa lies (larger = more recent). */
const mrcaDepth = (c: Ctx, taxa: string[]): number => Math.max(...nodesOf(c).filter((n) => taxa.every((t) => n.tips.includes(t))).map((n) => n.depth));
const tipsUnder = (c: Ctx, node: string): string[] => { const n = nodesOf(c).find((x) => x.node === node); if (!n) throw new Error(`no node ${node}`); return n.tips; };
const sameSet = (a: string[], b: string[]): boolean => a.length === b.length && a.every((x) => b.includes(x));

/** Mass spectra. */
const mass = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'mass', peaks: peaks.map(([mz, abundance]) => ({ mz, abundance })), ...extra });
const ALT_PES = 'Binding energy increases to the left on a logarithmic axis; the height of a peak is the relative number of electrons.';
const configOf = (c: Ctx): Array<{ sub: string; n: number }> => {
  const subs = arr(c.p.peaks).map((_, i) => c.txt('spectrum_peak_subshell', { peak: i }));
  return arr(c.p.peaks).map((p, i) => ({ sub: subs[i], n: p.electrons as number }));
};

/** Circuits: resistors printed with their names only. */
const circ = (emf: number, circuit: P): Spec => S('circuit_diagram', { battery: { emf }, circuit });
const R = (name: string, value: number): P => ({ type: 'resistor', name, value, show: 'name' });
const ser = (...xs: P[]): P => ({ series: xs });
const par = (...xs: P[]): P => ({ parallel: xs });
/** The series / parallel groups of the circuit tree, each with the names of its DIRECT component members. */
const groupsOf = (n: P, out: Array<{ kind: string; names: string[] }> = []): Array<{ kind: string; names: string[] }> => {
  for (const kind of ['series', 'parallel']) {
    if (Array.isArray(n[kind])) {
      const xs = n[kind] as P[];
      out.push({ kind, names: xs.filter((x) => typeof x.name === 'string').map((x) => x.name as string) });
      xs.forEach((x) => groupsOf(x, out));
    }
  }
  return out;
};
const sameGroup = (c: Ctx, kind: string, names: string[]): boolean => groupsOf(c.p.circuit as P).some((g) => g.kind === kind && names.every((x) => g.names.includes(x)));
/** The number of different paths from one end of a network to the other (series: product; parallel: sum). */
const pathsOf = (n: P): number => (Array.isArray(n.series) ? (n.series as P[]).reduce((t, x) => t * pathsOf(x), 1) : Array.isArray(n.parallel) ? (n.parallel as P[]).reduce((t, x) => t + pathsOf(x), 0) : 1);

/** Motion graphs. */
const motion = (quantity: string, series: P[], extra: P = {}): Spec => S('motion_graph', { quantity, series, tStep: 1, ...extra });

export const ITEMS: Item[] = [

  // ── AP Biology · gel electrophoresis ──────────────────────────────────────
  ...G('gen-252560d4-dbb9-433c-b730-b71e34ddfd55.lo-4', 'Band position against band brightness, and fragments that add up', [
    {
      t: 'the lane with the longest fragment when brightness and band count mislead', d: 2, need: 'reason',
      spec: gel([3000, 2000, 1000, 500, 250], [['P', [1000, 500]], ['Q', [2500]], ['R', [300]], ['S', [{ size: 700, thick: 3 }]]]),
      alt: `Four sample lanes, P, Q, R and S. Lane P shows two bands; lanes Q, R and S show one band each, and the band of lane S is much thicker and brighter than the others. ${ALT_GEL}`,
      q: 'Four DNA samples were run in lanes P, Q, R and S beside a size ladder on the gel shown. Which lane holds the longest single fragment of DNA?',
      o: [
        ['Lane Q', 'correct'],
        ['Lane R', 'takes the band that travelled furthest from the wells as the longest fragment'],
        ['Lane S', 'takes the thickest, brightest band as the longest fragment; brightness shows the amount of DNA'],
        ['Lane P', 'adds the two fragments of lane P together as if they were one'],
      ],
      holds: ['the largest band size of each lane (gel_band_size on every band): the option holds when its lane has the largest fragment of all', ['Q', 'R', 'S', 'P'].map((lane) => (c: Ctx) => {
        const top = (l: string) => Math.max(...[0, 1, 2].slice(0, c.num('gel_fragment_count', { lane: l })).map((b) => c.num('gel_band_size', { lane: l, band: b })));
        return ['P', 'Q', 'R', 'S'].filter((x) => x !== lane).every((x) => top(lane) > top(x));
      })],
      h: ['A band\'s distance from the wells depends on the length of its fragment: shorter fragments move further.', 'The brightness of a band tells you how much DNA it holds, not how long the fragment is.'],
      s: 'Read from the figure: the band of lane Q lies between the 3000 and 2000 bp ladder bands, closer to the wells than any other sample band. The band of lane S is bright but lies between 1000 and 500 bp (a large amount of a short fragment), lane R\'s band lies just above the 250 bp marker, and lane P holds two separate fragments of 1000 and 500 bp. The longest single fragment is in lane Q.',
    },
    {
      t: 'length of a linear molecule from the fragments of its digest', d: 3, need: 'calc',
      spec: gel([6000, 4000, 3000, 2000, 1500, 1000, 500], [['Cut', [3000, 1500, 500]]]),
      alt: `One sample lane, Cut, shows three bands, each level with a ladder band. ${ALT_GEL}`,
      q: 'A linear DNA molecule was cut with a restriction enzyme into fragments that all have different lengths, and the digest was run in lane Cut beside a size ladder on the gel shown. How long was the DNA molecule before it was cut, in base pairs?',
      n: '5000',
      calc: ['the sum of the band sizes of lane Cut (gel_band_size on each of its gel_fragment_count bands)', (c) => { const k = c.num('gel_fragment_count', { lane: 'Cut' }); let t = 0; for (let b = 0; b < k; b++) t += c.num('gel_band_size', { lane: 'Cut', band: b }); return t; }],
      h: ['Find the size of each band in the digest by following it across to the ladder.', 'Cutting a molecule does not lose any DNA: the pieces together make up the whole molecule.'],
      s: 'Read from the figure: the three bands of lane Cut are level with the ladder bands of 3000, 1500 and 500 bp. The enzyme cut the molecule into these three pieces, so the uncut molecule was 3000 + 1500 + 500 = 5000 bp long.',
    },
  ]),

  // ── AP Biology · pedigree mode of inheritance ─────────────────────────────
  ...G('gen-fc12780a-98b2-44f6-84b4-de68cab7cef5.lo-3', 'Ruling modes of inheritance in and out', [
    {
      t: 'the one mode that a chart rules out', d: 2, need: 'reason',
      spec: ped([['f', 'M', 1], ['m', 'F', 0], ['s1', 'M', 1, 'f', 'm'], ['d1', 'F', 0, 'f', 'm'], ['s2', 'M', 0, 'f', 'm']]),
      alt: `${ALT_PED} Two generations: an affected father and an unaffected mother in generation I, and their three children in generation II: an affected son, an unaffected daughter and an unaffected son.`,
      q: 'The trait in the pedigree shown is caused by a single gene. Which mode of inheritance can be ruled out by the pedigree?',
      o: [
        ['X-linked dominant', 'correct'],
        ['X-linked recessive', 'takes the affected son of an affected father to rule out X-linkage, though his X came from his mother, who may be a carrier'],
        ['Autosomal recessive', 'thinks a recessive trait cannot appear in a parent and a child, although the mother may be a carrier'],
        ['Autosomal dominant', 'thinks an unaffected child of an affected parent rules out every dominant mode'],
      ],
      holds: ['pedigree_mode_consistent for each mode: the option holds when the chart does NOT fit that mode', ['x_linked_dominant', 'x_linked_recessive', 'autosomal_recessive', 'autosomal_dominant'].map((m) => (c: Ctx) => !fitsMode(c, m))],
      h: ['For each mode, ask which children an affected father could have, and from which parent a son and a daughter get their X chromosomes.', 'Look for a child whose phenotype one mode cannot produce.'],
      s: 'Read from the pedigree: the affected father I-1 has an unaffected daughter, II-2. A father passes his only X chromosome to every daughter, so under X-linked dominant inheritance every daughter of an affected father would be affected. That mode is ruled out. Autosomal dominant (father heterozygous), autosomal recessive (mother a carrier) and X-linked recessive (mother a carrier, who gave her son his X) all fit the chart.',
    },
    {
      t: 'the two modes that a chart leaves open', d: 3, need: 'reason',
      spec: ped([['gf', 'M', 1], ['gm', 'F', 0], ['d', 'F', 0, 'gf', 'gm'], ['s', 'M', 0, 'gf', 'gm'], ['h', 'M', 0], ['c1', 'M', 1, 'h', 'd'], ['c2', 'F', 0, 'h', 'd'], ['c3', 'M', 0, 'h', 'd']]),
      alt: `${ALT_PED} Three generations: an affected grandfather and an unaffected grandmother; their unaffected daughter and unaffected son; the daughter's unaffected husband; and the daughter's three children, two sons and a daughter, of whom one son is affected.`,
      q: 'The trait in the three-generation pedigree shown is caused by a single gene. Which modes of inheritance can explain the pedigree?',
      o: [
        ['Autosomal recessive and X-linked recessive', 'correct'],
        ['X-linked recessive only', 'overlooks that the affected grandson\'s father may carry an autosomal recessive allele'],
        ['Autosomal dominant and X-linked dominant', 'reads the trait reappearing two generations later as a vertical, dominant pattern'],
        ['Autosomal recessive only', 'thinks a trait passed from a grandfather to a grandson cannot be X-linked'],
      ],
      holds: pick('pedigree_mode_consistent for each of the four modes: the option holds when the set of modes that fit is exactly the set it names', modesFit, [
        ['autosomal_recessive', 'x_linked_recessive'],
        ['x_linked_recessive'],
        ['autosomal_dominant', 'x_linked_dominant'],
        ['autosomal_recessive'],
      ]),
      h: ['Find an affected child whose parents are both unaffected. What does that say about dominant modes?', 'For each recessive mode, ask where the affected grandson\'s allele (or alleles) could have come from.'],
      s: 'Read from the pedigree: the affected son III-1 has two unaffected parents, II-1 and II-2, so the allele is recessive and both dominant modes are ruled out. X-linked recessive fits: II-2 got her father\'s X with the allele, is a carrier, and passed it to her son. Autosomal recessive also fits: II-2 is a carrier from her affected father I-1, and her husband II-1 can be a carrier too. Both recessive modes can explain the pedigree.',
    },
  ]),

  // ── AP Biology · what a phylogenetic tree represents ──────────────────────
  ...G('gen-42e27041-da88-49e0-8c70-2a2ed12ad383.lo-1', 'Branch points as divergence events; tips are not ancestors', [
    {
      t: 'number of divergence events on a cladogram', d: 2, need: 'reason',
      spec: tree({ children: [{ children: ['Dog', { children: ['Bear', 'Seal'] }] }, { children: ['Hyena', { children: ['Lion', 'House cat'] }] }] }),
      alt: 'A cladogram of six carnivores, from top to bottom: Dog, Bear, Seal, Hyena, Lion, House cat. The root splits into two groups of three tips; no node is labelled.',
      q: 'On a cladogram, each branch point marks a divergence event, where one ancestral lineage split into two. How many divergence events does the cladogram shown?',
      n: '5',
      ck: ['phylo_clade_count', {}],
      h: ['Count the places where one line splits into two, starting with the root at the far left.', 'Tips are living groups at the ends of branches; they are not divergence events.'],
      s: 'Read from the cladogram: the root splits once; the upper group splits again where the dog separates from the bear–seal line and where the bear and seal separate; the lower group splits where the hyena separates and where the lion and house cat separate. That is 1 + 2 + 2 = 5 branch points, so 5 divergence events.',
    },
    {
      t: 'the false statement about what a cladogram shows', d: 3, need: 'reason',
      spec: tree({ children: ['Shark', { children: ['Salmon', { children: [{ children: ['Frog', 'Salamander'] }, { children: ['Lizard', 'Mouse'] }] }] }] }),
      alt: 'A cladogram of six vertebrates, from top to bottom: Shark, Salmon, Frog, Salamander, Lizard, Mouse. The shark branches off first, then the salmon; the last four tips form two pairs that join each other.',
      q: 'Which statement about the cladogram shown is FALSE?',
      o: [
        ['The frog evolved from the salamander', 'correct'],
        ['The salmon is more closely related to the frog than the shark is', 'thinks the shark and the salmon, both fish, must be equally related to the frog'],
        ['The frog, salamander, lizard and mouse form a clade', 'thinks a clade must share an obvious body plan'],
        ['The lizard and the mouse share an ancestor not shared with the frog', 'reads the lizard as closer to the amphibians because of its appearance'],
      ],
      holds: falseOne('from the spec tree: whether the salamander is an ancestor (an internal node) of the frog; phylo_closer_relative; phylo_monophyletic; the most recent common ancestor of the lizard and the mouse lies beyond that of the lizard and the frog', [
        (c) => nodesOf(c).some((n) => n.node === 'Salamander'),
        (c) => c.txt('phylo_closer_relative', { taxon: 'Frog', a: 'Salmon', b: 'Shark' }) === 'Salmon',
        (c) => c.txt('phylo_monophyletic', { taxa: ['Frog', 'Salamander', 'Lizard', 'Mouse'] }) === 'yes',
        (c) => mrcaDepth(c, ['Lizard', 'Mouse']) > mrcaDepth(c, ['Lizard', 'Frog']),
      ]),
      h: ['Every tip of a cladogram is a living group; ancestors are the branch points inside the tree.', 'For each statement about relatedness, trace the named tips back until their paths meet.'],
      s: 'Read from the cladogram: the frog and the salamander are two tips that meet at a shared branch point, their common ancestor; neither is the ancestor of the other, so "the frog evolved from the salamander" is false. The salmon meets the frog at a later branch point than the shark does; the frog, salamander, lizard and mouse are all the descendants of one branch point; and the lizard and the mouse meet at their own branch point before joining the frog.',
    },
  ]),

  // ── AP Biology · relatedness on a cladogram ───────────────────────────────
  ...G('gen-42e27041-da88-49e0-8c70-2a2ed12ad383.lo-3', 'Equal relatedness and a ranking by common ancestor', [
    {
      t: 'how many tips are closer relatives than the first-branching tip', d: 2, need: 'calc',
      spec: tree({ children: ['Moss', { children: [{ children: ['Fern', 'Horsetail'] }, { children: ['Pine', { children: ['Oak', 'Grass'] }] }] }] }),
      alt: 'A cladogram of six plants, from top to bottom: Moss, Fern, Horsetail, Pine, Oak, Grass. The moss branches off at the root; the fern and horsetail form a pair that joins a group of the pine, oak and grass.',
      q: 'On the cladogram shown, with how many of the other plants does the fern share a more recent common ancestor than it shares with the moss?',
      n: '4',
      calc: ['from the spec tree: the plants (other than the fern and the moss) whose most recent common ancestor with the fern lies further from the root than that of the fern and the moss', (c) => tipsOf(c.p.tree as Clade).filter((y) => y !== 'Fern' && y !== 'Moss' && mrcaDepth(c, ['Fern', y]) > mrcaDepth(c, ['Fern', 'Moss'])).length],
      h: ['Trace back from the fern and from the moss until their paths meet; that branch point is their common ancestor.', 'Every plant whose path meets the fern\'s path before (to the right of) that branch point shares a more recent ancestor with the fern.'],
      s: 'Read from the cladogram: the paths of the fern and the moss meet only at the root. Every other plant meets the fern at a later branch point: the horsetail at the pair\'s own branch point, and the pine, oak and grass where the two groups join. That is 4 plants, all more closely related to the fern than the moss is.',
    },
    {
      t: 'rank three tips by relatedness to a fourth', d: 3, need: 'reason',
      spec: tree({ children: ['Platypus', { children: ['Kangaroo', { children: [{ children: ['Bat', 'Horse'] }, { children: [{ children: ['Mouse', 'Rat'] }, 'Rabbit'] }] }] }] }),
      alt: 'A cladogram of seven mammals, from top to bottom: Platypus, Kangaroo, Bat, Horse, Mouse, Rat, Rabbit. The platypus and then the kangaroo branch off first; the last five tips form two groups that join each other.',
      q: 'According to the cladogram shown, which lists the horse, the kangaroo and the rabbit from the most closely related to the least closely related to the mouse?',
      o: [
        ['Rabbit, horse, kangaroo', 'correct'],
        ['Horse, rabbit, kangaroo', 'reads relatedness from how close together the tips are drawn'],
        ['Kangaroo, horse, rabbit', 'ranks by branch points counted from the root instead of from the mouse'],
        ['Rabbit, kangaroo, horse', 'places the kangaroo before the horse, missing the branch point the horse shares with the mouse'],
      ],
      holds: ['from the spec tree: the depth of the most recent common ancestor of the mouse with each animal (deeper = more recent); the option holds when its order is strictly from most to least recent', [
        ['Rabbit', 'Horse', 'Kangaroo'], ['Horse', 'Rabbit', 'Kangaroo'], ['Kangaroo', 'Horse', 'Rabbit'], ['Rabbit', 'Kangaroo', 'Horse'],
      ].map((order) => (c: Ctx) => { const d = order.map((x) => mrcaDepth(c, ['Mouse', x])); return d[0] > d[1] && d[1] > d[2]; })],
      h: ['Trace back from the mouse; note the branch point where it first meets each of the three animals.', 'The later (more recent) that meeting point, the more closely related the two animals are.'],
      s: 'Read from the cladogram: tracing back from the mouse, it meets the rat first, then the rabbit at the next branch point, then the bat and horse at the branch point that joins the two groups, and only after that the kangaroo. So from most to least closely related to the mouse: rabbit, horse, kangaroo — although the horse is drawn right next to the mouse.',
    },
  ]),

  // ── AP Biology · common ancestors and divergence ──────────────────────────
  ...G('gen-42e27041-da88-49e0-8c70-2a2ed12ad383.lo-4', 'Numbered ancestors: three tips, and descendants of one node but not another', [
    {
      t: 'how many tips descend from the common ancestor of three tips', d: 2, need: 'calc',
      spec: tree({ children: ['Shark', { children: ['Frog', { children: [{ children: ['Turtle', { children: ['Crocodile', 'Bird'] }] }, { children: ['Mouse', 'Human'] }] }] }] }),
      alt: 'A cladogram of seven vertebrates, from top to bottom: Shark, Frog, Turtle, Crocodile, Bird, Mouse, Human. The shark and then the frog branch off first; the last five tips form a group of three joined to a pair. No node is labelled.',
      q: 'Find the most recent common ancestor of the turtle, the bird and the mouse on the cladogram shown. How many of the animals on the cladogram are descended from that ancestor?',
      n: '5',
      calc: ['from the spec tree: the number of tips under the deepest node whose tips include the turtle, the bird and the mouse (phylo_monophyletic confirms the group is a clade)', (c) => { const d = mrcaDepth(c, ['Turtle', 'Bird', 'Mouse']); const n = nodesOf(c).find((x) => x.depth === d && ['Turtle', 'Bird', 'Mouse'].every((t) => x.tips.includes(t)))!; if (c.txt('phylo_monophyletic', { taxa: n.tips }) !== 'yes') throw new Error('not a clade'); return n.tips.length; }],
      h: ['Trace back toward the root from each of the three animals; the first branch point on all three paths is their most recent common ancestor.', 'From that branch point, follow every branch toward the tips and count all the animals you reach.'],
      s: 'Read from the cladogram: the paths from the turtle, the bird and the mouse first meet at the branch point where the turtle–crocodile–bird group joins the mouse–human pair. Its descendants are the turtle, crocodile, bird, mouse and human: 5 animals. The shark and the frog branched off earlier.',
    },
    {
      t: 'descendants of one node that do not descend from a later node', d: 3, need: 'reason',
      spec: tree({ children: ['Lamprey', { node: '1', children: ['Shark', { children: ['Tuna', { node: '2', children: ['Frog', { children: ['Lizard', 'Mouse'] }] }] }] }] }),
      alt: 'A cladogram of six vertebrates, from top to bottom: Lamprey, Shark, Tuna, Frog, Lizard, Mouse. Two branch points are labelled, node 1 and node 2; the root and the other branch points are not labelled.',
      q: 'Which animals on the cladogram shown are descended from the ancestor at node 1 but not from the ancestor at node 2?',
      o: [
        ['The shark and the tuna', 'correct'],
        ['The frog, the lizard and the mouse', 'lists the descendants of node 2 instead of leaving them out'],
        ['The shark only', 'stops at the tip that branches off at node 1 itself'],
        ['The lamprey and the shark', 'takes in the lamprey, which branched off before node 1, and misses the tuna'],
      ],
      holds: ['from the spec tree: the tips under node 1 minus the tips under node 2, compared with each list', [['Shark', 'Tuna'], ['Frog', 'Lizard', 'Mouse'], ['Shark'], ['Lamprey', 'Shark']].map((list) => (c: Ctx) => sameSet(tipsUnder(c, '1').filter((x) => !tipsUnder(c, '2').includes(x)), list))],
      h: ['From node 1, follow every branch toward the tips and list all the animals you reach.', 'Then do the same from node 2 and strike those animals off the first list.'],
      s: 'Read from the cladogram: node 1 leads to the shark and, through a later branch point, to the tuna and to node 2, whose descendants are the frog, the lizard and the mouse. The lamprey branches off at the root, before node 1. Leaving out the three descendants of node 2 leaves the shark and the tuna.',
    },
  ]),

  // ── AP Chemistry · mass spectrum ──────────────────────────────────────────
  ...G('gen-ada76c1a-ef68-47c2-bb64-f9ce239234d2.lo-2', 'Abundance ratios and the element behind a spectrum', [
    {
      t: 'ratio of the abundances of two isotopes', d: 2, need: 'calc',
      spec: mass([[69, 60], [71, 40]], { xRange: [67, 73], xStep: 1, yMax: 100, yStep: 20 }),
      alt: 'A mass spectrum of gallium with two peaks, one at a lower m/z and a shorter one at a higher m/z; relative abundance in percent on the vertical axis.',
      q: 'The mass spectrum of gallium is shown; each peak is one isotope, as a 1+ ion. How many times as abundant is the lighter isotope of gallium as the heavier isotope?',
      n: '1.5',
      calc: ['abundance of the lower-m/z peak ÷ abundance of the higher-m/z peak (spec)', (c) => { const p = arr(c.p.peaks).slice().sort((a, b) => (a.mz as number) - (b.mz as number)); return (p[0].abundance as number) / (p[1].abundance as number); }],
      h: ['The lighter isotope gives the peak at the lower m/z value; the heavier isotope gives the other one.', 'Read the height of each peak on the abundance axis and divide.'],
      s: 'Read from the spectrum: the peak at m/z = 69 (gallium-69) reaches 60 % and the peak at m/z = 71 (gallium-71) reaches 40 %. The lighter isotope is 60 ÷ 40 = 1.5 times as abundant as the heavier one.',
    },
    {
      t: 'identify the element from its isotope peaks', d: 3, need: 'reason',
      spec: mass([[20, 90], [22, 10]], { xRange: [18, 24], xStep: 1, yMax: 100, yStep: 10 }),
      alt: 'A mass spectrum with two peaks: a tall one at the lower m/z and a short one two units higher; relative abundance in percent on the vertical axis.',
      q: 'The mass spectrum of a sample of one element is shown; each peak is one isotope, as a 1+ ion. Which element is it?',
      o: [
        ['Neon', 'correct'],
        ['Calcium', 'takes the m/z of the tallest peak, 20, as the atomic number'],
        ['Titanium', 'takes the m/z of the heavier isotope, 22, as the atomic number'],
        ['Sodium', 'takes the heavier isotope\'s mass as the average atomic mass, ignoring the peak heights'],
      ],
      holds: pick('spectrum_element (from the abundance-weighted average mass)', (c) => c.txt('spectrum_element', {}).toLowerCase(), ['neon', 'calcium', 'titanium', 'sodium']),
      h: ['Read the m/z and the abundance of each peak; the m/z of a 1+ ion is the isotope\'s mass, not its atomic number.', 'Weight each mass by its abundance to get the average atomic mass, then match it to the periodic table.'],
      s: 'Read from the spectrum: 90 % of the atoms have mass 20 and 10 % have mass 22. Average atomic mass = 0.90 × 20 + 0.10 × 22 = 18 + 2.2 = 20.2. The element with an average atomic mass of about 20.2 is neon (20.18), whose isotopes are neon-20 and neon-22.',
    },
  ]),

  // ── AP Chemistry · activation energy on energy profiles ───────────────────
  ...G('gen-27b58964-9294-4c9d-873c-36a0a9a9c3fb.lo-2', 'The barrier from the products, and from the right baseline', [
    {
      t: 'activation energy of the reverse reaction', d: 2, need: 'calc',
      spec: rc({ reactantsEnergy: 20, productsEnergy: 60, activationEnergies: [70] }),
      alt: 'One energy curve that rises from a reactant level over a single peak and comes down to a product level that is higher than the reactants; both levels are above zero.',
      q: 'The energy profile of a reaction is shown. In the reverse reaction, the products shown react to give back the reactants. What is the activation energy of the reverse reaction, in kJ/mol?',
      n: '30',
      ck: ['rc_activation_energy', { curve: 0, direction: 'reverse' }],
      h: ['For the reverse reaction the starting point is the products\' level, and the same peak must be climbed.', 'Activation energy is the vertical distance from the starting level up to the top of the peak.'],
      s: 'Read from the diagram: the products are at 60 kJ/mol and the top of the peak is at 90 kJ/mol. The reverse reaction starts from the products, so its activation energy is 90 − 60 = 30 kJ/mol.',
    },
    {
      t: 'the false statement about the barrier of an exothermic profile', d: 3, need: 'reason',
      spec: rc({ reactantsEnergy: 40, productsEnergy: 20, activationEnergies: [60] }),
      alt: 'One energy curve that rises from a reactant level over a single peak and comes down to a product level below the reactants; both levels are above zero.',
      q: 'The energy profile of a reaction is shown. Which statement about the profile is FALSE?',
      o: [
        ['The activation energy of the forward reaction is 100 kJ/mol', 'correct'],
        ['The activation energy of the forward reaction is 60 kJ/mol', 'expects the barrier to be measured from zero, not from the reactants'],
        ['The activation energy of the reverse reaction is 80 kJ/mol', 'measures the reverse barrier from the reactants instead of from the products'],
        ['The reaction releases 20 kJ/mol overall', 'takes the climb to the peak as the energy change of the reaction'],
      ],
      holds: falseOne('rc_activation_energy (forward and reverse) and rc_delta_h on the spec', [
        (c) => near(c.num('rc_activation_energy', { curve: 0, direction: 'forward' }), 100),
        (c) => near(c.num('rc_activation_energy', { curve: 0, direction: 'forward' }), 60),
        (c) => near(c.num('rc_activation_energy', { curve: 0, direction: 'reverse' }), 80),
        (c) => near(c.num('rc_delta_h'), -20),
      ]),
      h: ['Read three levels from the axis: the reactants, the top of the peak and the products.', 'Each activation energy is measured from the level where that reaction starts up to the peak, never from zero.'],
      s: 'Read from the diagram: the reactants are at 40 kJ/mol, the peak at 100 kJ/mol and the products at 20 kJ/mol. Forward activation energy = 100 − 40 = 60 kJ/mol; reverse activation energy = 100 − 20 = 80 kJ/mol; ΔH = 20 − 40 = −20 kJ/mol, so 20 kJ/mol is released. The statement that the forward activation energy is 100 kJ/mol reads the peak from zero, so it is false.',
    },
  ]),

  // ── AP Chemistry · PES peaks and subshells ────────────────────────────────
  ...G('gen-f5cf533c-f147-4572-b1f0-53ea99dfcaaf.lo-3', 'The tallest peak, and the peak after a full 3p subshell', [
    {
      t: 'subshell of the tallest peak', d: 2, need: 'reason',
      spec: pes([[208, 2], [18.7, 2], [13.5, 6], [1.95, 2], [1.06, 3]], { showEnergies: false }),
      alt: `${ALT_PES} A photoelectron spectrum with five peaks of different heights and no printed energies: one far to the left, two close together in the middle and two close together at the right.`,
      q: 'The photoelectron spectrum shown is the complete spectrum of a neutral atom in its ground state. Which subshell produces the tallest peak of the spectrum?',
      o: [
        ['2p', 'correct'],
        ['1s', 'takes the tallest peak to be the innermost electrons'],
        ['3p', 'assigns the subshells starting from the right-hand end'],
        ['2s', 'starts the count at 2s, missing the 1s peak at the far left'],
      ],
      holds: pick('spectrum_peak_subshell of the tallest peak (electrons from the spec)', (c) => { const e = arr(c.p.peaks).map((p) => p.electrons as number); return c.txt('spectrum_peak_subshell', { peak: e.indexOf(Math.max(...e)) }); }, ['2p', '1s', '3p', '2s']),
      h: ['The peak furthest to the left has the highest binding energy: the electrons closest to the nucleus.', 'Name the peaks in order from left to right, following the order in which subshells fill.'],
      s: 'Read from the spectrum: from left to right the five peaks are 1s, 2s, 2p, 3s and 3p, since binding energy increases to the left. The tallest peak is the third one from the left, 2p, which holds six electrons — three times the height of the 1s peak.',
    },
    {
      t: 'subshells whose peaks match the height of the 1s peak', d: 3, need: 'reason',
      spec: pes([[239, 2], [22.7, 2], [16.5, 6], [2.05, 2], [1.0, 4]], { showEnergies: false }),
      alt: `${ALT_PES} A photoelectron spectrum with five peaks and no printed energies: one far to the left, two close together in the middle and two close together at the right, of different heights.`,
      q: 'In the complete photoelectron spectrum of a ground-state atom shown, the peak furthest to the left comes from the 1s subshell. Which other subshells produce peaks of the same height as that peak?',
      o: [
        ['2s and 3s', 'correct'],
        ['2s and 2p', 'names the next two subshells in order of filling instead of matching the heights'],
        ['3s and 3p', 'assigns the subshells starting from the right-hand end'],
        ['2p and 3p', 'takes the peaks that pair up in the middle and at the right to be the p subshells'],
      ],
      holds: pick('spectrum_peak_subshell of every peak other than the first whose electrons (spec) equal those of the first', (c) => { const e = arr(c.p.peaks).map((p) => p.electrons as number); return e.map((x, i) => (i > 0 && x === e[0] ? c.txt('spectrum_peak_subshell', { peak: i }) : '')).filter(Boolean).join(' and '); }, ['2s and 3s', '2s and 2p', '3s and 3p', '2p and 3p']),
      h: ['Name the peaks from left to right in order of filling: 1s, 2s, 2p, 3s, 3p.', 'An s subshell holds at most 2 electrons and a p subshell at most 6; compare each peak\'s height with the 1s peak.'],
      s: 'Read from the spectrum: from left to right the peaks are 1s, 2s, 2p, 3s and 3p. Measured in gridline units they are 2, 2, 6, 2 and 4 units tall, so the peaks as tall as the 1s peak are the second and the fourth: 2s and 3s, each holding two electrons.',
    },
  ]),

  // ── AP Chemistry · configuration from a complete PES ──────────────────────
  ...G('gen-f5cf533c-f147-4572-b1f0-53ea99dfcaaf.lo-5', 'Counting p electrons, and the spectrum of the next element', [
    {
      t: 'electrons in p subshells from a complete spectrum', d: 2, need: 'calc',
      spec: pes([[189, 2], [15.1, 2], [10.3, 6], [1.46, 2], [0.79, 2]]),
      alt: `${ALT_PES} A photoelectron spectrum with five peaks; from left to right they are printed at 189, 15.1, 10.3, 1.46 and 0.79 MJ/mol. Four of the peaks (at 189, 15.1, 1.46 and 0.79) are the same height, two gridline units; the peak at 10.3 is three times as tall, six units.`,
      q: 'In the complete photoelectron spectrum of a ground-state neutral atom shown, the peak furthest to the left stands for 2 electrons. How many electrons does the atom have in p subshells altogether?',
      n: '8',
      calc: ['the electrons of the peaks whose subshell (spectrum_peak_subshell) is a p subshell, summed', (c) => configOf(c).filter((x) => x.sub.endsWith('p')).reduce((t, x) => t + x.n, 0)],
      h: ['Assign the peaks to subshells from left to right, starting with 1s at the highest binding energy.', 'Use the height of the left-hand peak to turn each height into a number of electrons, then add those of the p subshells.'],
      s: 'Read from the spectrum: taking the left-hand peak as 2 electrons, the five peaks represent 2, 2, 6, 2 and 2 electrons: 1s² 2s² 2p⁶ 3s² 3p² (silicon). The p subshells are 2p⁶ and 3p², so the atom has 6 + 2 = 8 electrons in p subshells.',
    },
    {
      t: 'how the spectrum of the next element differs', d: 3, need: 'reason',
      spec: pes([[309, 2], [31.5, 2], [24.1, 6], [2.82, 2], [1.52, 6]], { showEnergies: false }),
      alt: `${ALT_PES} A photoelectron spectrum with five peaks and no printed energies: one far to the left, then two pairs of peaks close together; in each pair the second peak is the taller.`,
      q: 'Shown is the complete photoelectron spectrum of a ground-state neutral atom, whose leftmost peak stands for 2 electrons. How would the spectrum of the element with one more electron differ at its low-energy end?',
      o: [
        ['A new peak for 1 electron would appear to the right of all the others', 'correct'],
        ['The peak furthest to the right would be one electron taller', 'adds the electron to the 3p subshell, which is already full'],
        ['A new peak for 1 electron would appear for the 3d subshell', 'fills 3d before 4s'],
        ['No new peak would appear; every peak would move right', 'thinks an added electron changes only binding energies, not the subshells filled'],
      ],
      holds: ['spectrum_configuration of the spec: the last subshell is full (p⁶), so the next electron starts a new subshell, 4s, of lower binding energy than any shown', [
        (c) => { const k = configOf(c); const last = k[k.length - 1]; return last.sub === '3p' && last.n === 6; },
        (c) => { const k = configOf(c); const last = k[k.length - 1]; return last.n < (last.sub.endsWith('s') ? 2 : 6); },
        () => false, // 4s fills before 3d: the table of the kind never puts 3d before 4s
        () => false, // an electron in a new subshell always adds a peak
      ]],
      h: ['Work out the electron configuration from the heights of the peaks, starting with 1s at the left.', 'Ask whether the last subshell has room for another electron; if not, which subshell fills next, and where its peak would lie.'],
      s: 'Read from the spectrum: the peaks represent 2, 2, 6, 2 and 6 electrons, so the atom is 1s² 2s² 2p⁶ 3s² 3p⁶ (argon), with a full 3p subshell. The next element (potassium) puts its extra electron in 4s, which fills before 3d and holds its electron less tightly than any subshell shown: a new 1-electron peak appears to the right of all the others.',
    },
  ]),

  // ── Physics · series and parallel sections ────────────────────────────────
  ...G('gen-8f54b2e2-5be7-4bf9-af4f-1151c9d94c49.lo-2', 'Describing the groups, and counting the paths', [
    {
      t: 'the correct description of two parallel groups in series', d: 2, need: 'reason',
      spec: circ(12, ser(R('R₁', 4), par(R('R₂', 6), R('R₃', 3)), par(R('R₄', 10), R('R₅', 5)))),
      alt: 'A circuit diagram: a 12 volt battery, resistor R₁, then a junction with two branches holding R₂ and R₃, and after they rejoin a second junction with two branches holding R₄ and R₅. No resistance values are printed.',
      q: 'Which description of the circuit shown is correct?',
      o: [
        ['R₂ and R₃ are in parallel, and so are R₄ and R₅', 'correct'],
        ['R₁, R₂ and R₄ are all in series', 'takes the resistors along the top wire as one series path, ignoring the junctions'],
        ['R₃ and R₄ are in series', 'joins two resistors on branches of different junctions'],
        ['R₂, R₃, R₄ and R₅ are all in parallel', 'treats every resistor on a branch as part of one parallel group'],
      ],
      holds: ['the spec\'s circuit tree: whether the named resistors are direct members of one series or one parallel group', [
        (c) => sameGroup(c, 'parallel', ['R₂', 'R₃']) && sameGroup(c, 'parallel', ['R₄', 'R₅']),
        (c) => sameGroup(c, 'series', ['R₁', 'R₂', 'R₄']),
        (c) => sameGroup(c, 'series', ['R₃', 'R₄']),
        (c) => sameGroup(c, 'parallel', ['R₂', 'R₃', 'R₄', 'R₅']),
      ]],
      h: ['Mark every junction (a dot where three wires meet). Resistors on separate branches between the same two junctions are in parallel.', 'Two resistors are in series only if all the current through one must pass through the other with no junction between.'],
      s: 'Read from the diagram: R₂ and R₃ sit on two branches between the same pair of junctions, so they are in parallel; R₄ and R₅ sit on two branches between a second pair of junctions, so they are also in parallel. R₁ is in series with each of these two parallel groups. No two of R₂ to R₅ are in series, and the four are not one parallel group because the current passes through one pair and then the other.',
    },
    {
      t: 'number of current paths through two parallel sections', d: 3, need: 'calc',
      spec: circ(9, ser(R('R₁', 2), par(R('R₂', 6), R('R₃', 3)), par(R('R₄', 6), R('R₅', 6), R('R₆', 6)))),
      alt: 'A circuit diagram: a 9 volt battery, resistor R₁, then a junction with two branches holding R₂ and R₃, and after they rejoin a junction with three branches holding R₄, R₅ and R₆. No resistance values are printed.',
      q: 'A path through the circuit shown runs from the + terminal of the battery to the − terminal, passing through each resistor at most once. How many different paths can the current take?',
      n: '6',
      calc: ['paths through the spec\'s circuit tree: a series chain multiplies the counts of its parts, a parallel group adds the counts of its branches', (c) => pathsOf(c.p.circuit as P)],
      h: ['Trace from the + terminal: at each parallel section the current can take any one of its branches.', 'Every choice in the first parallel section can be followed by every choice in the second.'],
      s: 'Read from the diagram: every path passes through R₁ (in series), then through one of the two branches R₂ or R₃, then through one of the three branches R₄, R₅ or R₆. The number of different paths is 1 × 2 × 3 = 6.',
    },
  ]),

  // ── Physics · force–time graphs ───────────────────────────────────────────
  ...G('gen-02fe8c70-d4cf-4895-8514-dcf7d9c9d4ec.lo-2', 'What the area means, and the average force it gives', [
    {
      t: 'what the area under a rising stretch stands for, with its value', d: 2, need: 'reason',
      spec: force([{ points: [[0, 0], [4, 40], [6, 40], [10, 0]] }], [0, 11], [0, 50]),
      alt: 'A force–time graph in three straight pieces: it rises from the origin, runs level, and falls back to zero.',
      q: 'The graph shows the force on a crate while it is pushed. What does the area under the graph from t = 0 to t = 4 s represent, and what is its value?',
      o: [
        ['The impulse on the crate, 80 N·s', 'correct'],
        ['The impulse on the crate, 160 N·s', 'takes base × height and leaves out the ½ for a triangle'],
        ['The impulse on the crate, 40 N·s', 'reads the force at t = 4 s as the area'],
        ['The force on the crate, 80 N', 'calls the area a force; an area under a force–time graph has the unit N·s'],
      ],
      holds: ['series_area from 0 to 4 s: an impulse option holds when its value is that area; the force option never holds (the area is an impulse)', [
        (c) => near(c.num('series_area', { series: 0, t1: 0, t2: 4 }), 80),
        (c) => near(c.num('series_area', { series: 0, t1: 0, t2: 4 }), 160),
        (c) => near(c.num('series_area', { series: 0, t1: 0, t2: 4 }), 40),
        () => false, // an area under a force–time graph is force × time, an impulse, never a force
      ]],
      h: ['Multiply the units of the two axes to find what kind of quantity the area is.', 'Under the rising stretch the area is a triangle: ½ × base × height.'],
      s: 'Read from the graph: from t = 0 to t = 4 s the force rises steadily from 0 to 40 N. The area is a triangle, ½ × 4 s × 40 N = 80 N·s. An area under a force–time graph is force × time, which is impulse, so it is an impulse of 80 N·s.',
    },
    {
      t: 'average force over a push from the area', d: 3, need: 'calc',
      spec: force([{ points: [[0, 0], [4, 60], [6, 0]] }], [0, 7], [0, 70]),
      alt: 'A force–time graph in two straight pieces: it rises from the origin to a peak and falls back to zero sooner than it rose.',
      q: 'The graph shows the force on a ball while a player kicks it. The average force is the constant force that would give the same impulse in the same time. What is the average force on the ball during the kick, in N?',
      n: '30',
      calc: ['series_area over the whole push ÷ its duration', (c) => c.num('series_area', { series: 0, t1: 0, t2: 6 }) / 6],
      h: ['First find the impulse: the area of the triangle under the graph.', 'A constant force acting for the same time gives a rectangle of the same area; divide the impulse by the time.'],
      s: 'Read from the graph: the force rises from 0 at t = 0 to 60 N at t = 4 s and falls back to 0 at t = 6 s. The impulse is the area of the triangle, ½ × 6 s × 60 N = 180 N·s. The average force is 180 N·s ÷ 6 s = 30 N.',
    },
  ]),

  // ── Physics · velocity from the slope of an x–t graph ─────────────────────
  ...G('gen-2b38f7f9-87cf-4b25-8180-eea40e8da90d.lo-2', 'Comparing two slopes, and the steepest stretch either way', [
    {
      t: 'which of two objects is faster, and by how much', d: 2, need: 'reason',
      spec: motion('position', [{ points: [[0, 0], [8, 24]], label: 'P' }, { points: [[0, 16], [8, 32]], label: 'Q' }], { tRange: [0, 9], yRange: [0, 40], yStep: 8, yLabel: 'Position (m)' }),
      alt: 'Two straight position–time lines, P and Q. Q starts higher up and stays above P; P is the steeper line.',
      q: 'The position–time graphs of two carts, P and Q, moving along parallel tracks are shown. Which cart has the greater velocity, and by how much?',
      o: [
        ['Cart P, by 1 m/s', 'correct'],
        ['Cart Q, by 1 m/s', 'takes the line drawn higher up to be the faster cart'],
        ['Cart Q, by 8 m/s', 'compares the final positions, 32 m and 24 m'],
        ['Cart P, by 3 m/s', 'gives the velocity of P rather than the difference'],
      ],
      holds: ['series_slope of each line from 0 to 8 s: the option holds when the difference is as it states', (() => {
        const diff = (c: Ctx) => c.num('series_slope', { series: 0, t1: 0, t2: 8 }) - c.num('series_slope', { series: 1, t1: 0, t2: 8 });
        return [1, -1, -8, 3].map((v) => (c: Ctx) => near(diff(c), v));
      })()],
      h: ['The velocity of each cart is the slope of its own line: change in position ÷ change in time.', 'A line drawn higher up is further from the start, not necessarily faster.'],
      s: 'Read from the graph: P goes from 0 m to 24 m in 8 s, a velocity of 24 ÷ 8 = 3 m/s. Q goes from 16 m to 32 m in 8 s, a velocity of 16 ÷ 8 = 2 m/s. Cart P is faster by 3 − 2 = 1 m/s, even though Q is ahead the whole time.',
    },
    {
      t: 'greatest speed over stretches that rise and fall', d: 3, need: 'calc',
      spec: motion('position', [{ points: [[0, 0], [4, 24], [6, 24], [8, 4], [11, 28]] }], { tRange: [0, 12], yRange: [0, 32], yStep: 4, yLabel: 'Position (m)' }),
      alt: 'A position–time graph in four straight stretches: it rises, runs level, falls, and rises again.',
      q: 'The position–time graph of a robot moving back and forth along a straight line is shown. What is the greatest speed of the robot at any time during the 11 s, in m/s?',
      n: '10',
      calc: ['the largest |series_slope| over the four stretches between the corners', (c) => Math.max(...[[0, 4], [4, 6], [6, 8], [8, 11]].map(([a, b]) => Math.abs(c.num('series_slope', { series: 0, t1: a, t2: b }))))],
      h: ['Find the slope of each straight stretch: change in position ÷ change in time.', 'Speed is the size of the velocity; a stretch that falls has a negative slope but can still be fast.'],
      s: 'Read from the graph: from 0 to 4 s the position goes from 0 to 24 m (6 m/s); from 4 to 6 s it stays at 24 m (0 m/s); from 6 to 8 s it falls from 24 to 4 m (−10 m/s); from 8 to 11 s it rises from 4 to 28 m (8 m/s). The greatest speed is 10 m/s, on the falling stretch: a velocity of −10 m/s is a speed of 10 m/s, more than on either rising stretch, which each cover 24 m.',
    },
  ]),

  // ── Physics · displacement from the area under a v–t graph ────────────────
  ...G('gen-2b38f7f9-87cf-4b25-8180-eea40e8da90d.lo-4', 'A trapezium of area, and displacement against distance', [
    {
      t: 'displacement while speeding up from a non-zero velocity', d: 2, need: 'calc',
      spec: motion('velocity', [{ points: [[0, 4], [4, 12], [8, 12]] }], { tRange: [0, 9], yRange: [0, 14], yStep: 2, yLabel: 'Velocity (m/s)' }),
      alt: 'A velocity–time graph in two straight pieces: the velocity rises steadily from a value above zero and then stays level.',
      q: 'The velocity–time graph of a cyclist on a straight road is shown. What is the cyclist\'s displacement while speeding up, from t = 0 to t = 4 s, in meters?',
      n: '32',
      ck: ['series_area', { series: 0, t1: 0, t2: 4 }],
      h: ['Displacement is the area between the graph and the time axis over the interval.', 'Split the area into a rectangle under the starting velocity and a triangle on top of it.'],
      s: 'Read from the graph: the velocity rises from 4 m/s at t = 0 to 12 m/s at t = 4 s. The area is a rectangle, 4 m/s × 4 s = 16 m, plus a triangle, ½ × 4 s × 8 m/s = 16 m. The displacement is 16 + 16 = 32 m.',
    },
    {
      t: 'displacement and distance when the velocity changes sign', d: 3, need: 'reason',
      spec: motion('velocity', [{ points: [[0, 6], [4, 6], [6, 0], [8, -6], [10, -6]] }], { tRange: [0, 11], yRange: [-8, 8], yStep: 2, yLabel: 'Velocity (m/s)' }),
      alt: 'A velocity–time graph in three straight pieces with corners at (0 s, 6 m/s), (4 s, 6 m/s), (8 s, −6 m/s) and (10 s, −6 m/s): level at 6 m/s, then falling steadily and crossing the time axis at 6 s, then level at −6 m/s.',
      q: 'The velocity–time graph of a toy car on a straight track is shown; a negative velocity means it moves backwards. What are the car\'s displacement and the distance it travels from t = 0 to t = 10 s?',
      o: [
        ['Displacement 12 m, distance 48 m', 'correct'],
        ['Displacement 48 m, distance 48 m', 'counts the area below the axis as positive for the displacement too'],
        ['Displacement 12 m, distance 12 m', 'takes the distance to be the same as the displacement'],
        ['Displacement −12 m, distance 48 m', 'subtracts the area above the axis from the area below it'],
      ],
      holds: ['series_area from 0 to 10 s for the displacement; the area from 0 to 6 s plus the size of the area from 6 to 10 s for the distance (the line crosses the axis at series_crossing)', (() => {
        const both = (c: Ctx) => { const t0 = c.num('series_crossing', { series: 0, value: 0, want: 'only' }); return [c.num('series_area', { series: 0, t1: 0, t2: 10 }), c.num('series_area', { series: 0, t1: 0, t2: t0 }) + Math.abs(c.num('series_area', { series: 0, t1: t0, t2: 10 }))]; };
        return [[12, 48], [48, 48], [12, 12], [-12, 48]].map(([d, s]) => (c: Ctx) => { const [dd, ss] = both(c); return near(dd, d) && near(ss, s); });
      })()],
      h: ['Find the area above the time axis and the area below it separately, as rectangles and triangles.', 'Displacement counts the area below the axis as negative; distance adds the sizes of all the areas.'],
      s: 'Read from the graph: above the axis there is a rectangle, 6 m/s × 4 s = 24 m, and a triangle, ½ × 2 s × 6 m/s = 6 m: 30 m forwards. Below the axis there is a triangle, ½ × 2 s × 6 m/s = 6 m, and a rectangle, 6 m/s × 2 s = 12 m: 18 m backwards. Displacement = 30 − 18 = 12 m; distance = 30 + 18 = 48 m.',
    },
  ]),
];
