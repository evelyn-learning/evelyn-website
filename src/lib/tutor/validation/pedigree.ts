/**
 * Pedigree inheritance-pattern classifier.
 *
 * Given a pedigree as a graph of individuals (sex + affected status + parent
 * links + generation), classify the most likely inheritance pattern:
 *   - autosomal-dominant
 *   - autosomal-recessive
 *   - x-linked-dominant
 *   - x-linked-recessive
 *   - y-linked
 *   - mitochondrial
 *
 * Uses the standard diagnostic heuristics:
 *   • Appears every generation & affected father → unaffected daughter rare → dominant.
 *   • Skips generations / two unaffected parents → affected child → recessive.
 *   • Affected males outnumber females heavily → X-linked.
 *   • No father→son transmission → X-linked (fathers pass Y to sons).
 *   • All daughters of affected father affected, no sons → X-linked dominant.
 *   • Only males affected, father→son always → Y-linked.
 *   • Affected mother passes to all children, affected father passes to none → mitochondrial.
 */

export interface Individual {
  id: string;
  sex: 'male' | 'female';
  affected: boolean;
  generation: number;
  motherId?: string;
  fatherId?: string;
}

export type InheritancePattern =
  | 'autosomal-dominant'
  | 'autosomal-recessive'
  | 'x-linked-dominant'
  | 'x-linked-recessive'
  | 'y-linked'
  | 'mitochondrial'
  | 'indeterminate';

interface Evidence {
  pattern: InheritancePattern;
  score: number;       // +/- confidence contribution
  reason: string;
}

export function classifyPedigree(people: Individual[]): {
  pattern: InheritancePattern;
  evidence: Evidence[];
  alternativePatterns: InheritancePattern[];
} {
  const byId = new Map(people.map(p => [p.id, p]));
  const children = new Map<string, string[]>();
  for (const p of people) {
    for (const pid of [p.motherId, p.fatherId]) {
      if (!pid) continue;
      if (!children.has(pid)) children.set(pid, []);
      children.get(pid)!.push(p.id);
    }
  }

  const evidence: Evidence[] = [];
  const scores = new Map<InheritancePattern, number>([
    ['autosomal-dominant', 0],
    ['autosomal-recessive', 0],
    ['x-linked-dominant', 0],
    ['x-linked-recessive', 0],
    ['y-linked', 0],
    ['mitochondrial', 0],
  ]);
  const bump = (p: InheritancePattern, delta: number, reason: string) => {
    scores.set(p, (scores.get(p) || 0) + delta);
    evidence.push({ pattern: p, score: delta, reason });
  };

  const affected = people.filter(p => p.affected);
  const affectedMales = affected.filter(p => p.sex === 'male').length;
  const affectedFemales = affected.filter(p => p.sex === 'female').length;

  // Heuristic 1: skipping generations (two unaffected parents → affected child)
  let skipsGenerations = false;
  for (const p of affected) {
    const m = p.motherId ? byId.get(p.motherId) : null;
    const f = p.fatherId ? byId.get(p.fatherId) : null;
    if (m && f && !m.affected && !f.affected) {
      skipsGenerations = true;
      break;
    }
  }
  if (skipsGenerations) {
    bump('autosomal-recessive', 3, 'Two unaffected parents produce an affected child (skips generations) → recessive.');
    bump('x-linked-recessive', 2, 'Skipping generations is also consistent with X-linked recessive.');
    bump('autosomal-dominant', -4, 'Dominant traits don\'t skip generations.');
    bump('x-linked-dominant', -3, 'X-linked dominant also doesn\'t typically skip.');
  }

  // Heuristic 2: appears every generation
  const generations = new Set(people.map(p => p.generation));
  const generationsWithAffected = new Set(affected.map(p => p.generation));
  if (generations.size >= 3 && generationsWithAffected.size === generations.size) {
    bump('autosomal-dominant', 2, 'Trait appears in every generation → dominant.');
    bump('x-linked-dominant', 1, 'Could also be X-linked dominant.');
    bump('autosomal-recessive', -2, 'Recessive rarely appears in every generation.');
  }

  // Heuristic 3: sex ratio
  if (affected.length >= 4) {
    if (affectedMales > affectedFemales * 3) {
      bump('x-linked-recessive', 3, `${affectedMales} affected males vs ${affectedFemales} females → strong X-linked recessive signal.`);
      bump('y-linked', 1, 'Male-heavy could also be Y-linked (check father→son).');
      bump('autosomal-recessive', -1, 'Autosomal traits affect sexes equally.');
    } else if (affectedFemales > affectedMales && affected.length > 4) {
      bump('x-linked-dominant', 2, `More females affected than males → X-linked dominant possible.`);
    } else if (Math.abs(affectedMales - affectedFemales) <= 1) {
      bump('autosomal-dominant', 1, 'Sexes affected roughly equally → autosomal.');
      bump('autosomal-recessive', 1, 'Sexes affected roughly equally → autosomal.');
    }
  }

  // Heuristic 4: father→son transmission
  let fatherSonTransmission = false;
  let fatherSonChecked = 0;
  for (const p of affected.filter(x => x.sex === 'male')) {
    const sons = (children.get(p.id) || [])
      .map(id => byId.get(id)!)
      .filter(c => c && c.sex === 'male');
    for (const son of sons) {
      fatherSonChecked++;
      if (son.affected) { fatherSonTransmission = true; }
    }
  }
  if (fatherSonChecked >= 2) {
    if (!fatherSonTransmission) {
      bump('x-linked-recessive', 2, 'No affected father→son transmission (fathers pass Y to sons).');
      bump('x-linked-dominant', 2, 'No affected father→son transmission.');
    } else {
      bump('x-linked-recessive', -3, 'Father→son transmission rules out X-linked.');
      bump('x-linked-dominant', -3, 'Father→son transmission rules out X-linked.');
      bump('autosomal-dominant', 1, 'Father→son transmission is consistent with autosomal.');
    }
  }

  // Heuristic 5: Y-linked — only males affected + every affected father has all affected sons
  if (affectedFemales === 0 && affectedMales >= 2) {
    let allYLinked = true;
    for (const p of affected.filter(x => x.sex === 'male')) {
      const sons = (children.get(p.id) || [])
        .map(id => byId.get(id)!)
        .filter(c => c && c.sex === 'male');
      if (sons.some(s => !s.affected)) { allYLinked = false; break; }
    }
    if (allYLinked && affectedMales >= 2) {
      bump('y-linked', 5, 'Only males affected + every affected father passes to all sons.');
      bump('autosomal-dominant', -2, 'Exclusive male-to-male transmission argues against autosomal dominance (would affect both sexes).');
    }
  }

  // Heuristic 6: Mitochondrial — affected mother passes to all children,
  // affected father passes to none.
  let mitoMaternalOk = 0, mitoPaternalNone = 0;
  for (const p of affected.filter(x => x.sex === 'female')) {
    const kids = (children.get(p.id) || []).map(id => byId.get(id)!);
    if (kids.length > 0 && kids.every(k => k.affected)) mitoMaternalOk++;
  }
  for (const p of affected.filter(x => x.sex === 'male')) {
    const kids = (children.get(p.id) || []).map(id => byId.get(id)!);
    if (kids.length > 0 && kids.every(k => !k.affected)) mitoPaternalNone++;
  }
  if (mitoMaternalOk >= 1 && mitoPaternalNone >= 1) {
    bump('mitochondrial', 3, 'Affected mothers pass to all children, affected fathers pass to none → mitochondrial.');
  }

  // Pick winner
  const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  const [winner, topScore] = sorted[0];
  const runnerUp = sorted[1];
  const alternativePatterns: InheritancePattern[] = [];
  if (runnerUp && topScore - runnerUp[1] < 2) alternativePatterns.push(runnerUp[0]);
  const pattern: InheritancePattern = topScore > 0 ? winner : 'indeterminate';
  return { pattern, evidence, alternativePatterns };
}
