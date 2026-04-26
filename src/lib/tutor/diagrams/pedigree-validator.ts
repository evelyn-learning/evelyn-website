/**
 * Post-emit validator for show_pedigree. Catches structural errors:
 * unknown ids in marriages/children, marriages between same individual,
 * orphaned children references, malformed individuals.
 *
 * We do NOT validate inheritance physics (carrier vs affected) — that's
 * the model's domain knowledge.
 */

export interface PedigreeIndividual {
  id?: string;
  sex?: 'male' | 'female' | 'unknown';
  status?: 'unaffected' | 'affected' | 'carrier' | 'deceased';
  generation?: number;
  position?: number;
}

export interface PedigreeMarriage {
  pair?: string[];
}

export interface PedigreeChild {
  parents?: string[];
  childId?: string;
}

export interface PedigreeInput {
  individuals?: PedigreeIndividual[];
  marriages?: PedigreeMarriage[];
  children?: PedigreeChild[];
}

export interface PedigreeValidationResult {
  ok: boolean;
  reason?: string;
}

export function validatePedigree(input: PedigreeInput): PedigreeValidationResult {
  const inds = Array.isArray(input.individuals) ? input.individuals : [];
  const marriages = Array.isArray(input.marriages) ? input.marriages : [];
  const children = Array.isArray(input.children) ? input.children : [];

  if (inds.length === 0) {
    return { ok: false, reason: 'show_pedigree was called with no individuals. Re-emit with at least one individual.' };
  }

  const ids = new Set<string>();
  for (let i = 0; i < inds.length; i++) {
    const ind = inds[i];
    if (typeof ind.id !== 'string' || !ind.id.trim()) {
      return { ok: false, reason: `individuals[${i}] is missing a string id.` };
    }
    if (ids.has(ind.id)) {
      return { ok: false, reason: `Duplicate individual id "${ind.id}". Each individual must have a unique id.` };
    }
    ids.add(ind.id);
    if (typeof ind.generation !== 'number' || !Number.isInteger(ind.generation) || ind.generation < 1) {
      return { ok: false, reason: `individuals[${i}] (id "${ind.id}") needs an integer \`generation\` ≥ 1.` };
    }
    if (typeof ind.position !== 'number' || !Number.isInteger(ind.position) || ind.position < 0) {
      return { ok: false, reason: `individuals[${i}] (id "${ind.id}") needs an integer \`position\` ≥ 0.` };
    }
  }

  for (let i = 0; i < marriages.length; i++) {
    const m = marriages[i];
    const pair = Array.isArray(m.pair) ? m.pair : [];
    if (pair.length !== 2) {
      return { ok: false, reason: `marriages[${i}].pair must be an array of exactly two ids.` };
    }
    if (pair[0] === pair[1]) {
      return { ok: false, reason: `marriages[${i}].pair has the same id twice ("${pair[0]}"). A marriage must link two different individuals.` };
    }
    for (const id of pair) {
      if (!ids.has(id)) {
        return { ok: false, reason: `marriages[${i}] references unknown individual id "${id}". Add this individual to \`individuals\` first.` };
      }
    }
  }

  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    const parents = Array.isArray(c.parents) ? c.parents : [];
    if (parents.length === 0) {
      return { ok: false, reason: `children[${i}] has no parents. Provide at least one parent id.` };
    }
    for (const id of parents) {
      if (!ids.has(id)) {
        return { ok: false, reason: `children[${i}] parent "${id}" is not in \`individuals\`. Add this individual first.` };
      }
    }
    if (typeof c.childId !== 'string' || !c.childId.trim()) {
      return { ok: false, reason: `children[${i}] is missing a string \`childId\`.` };
    }
    if (!ids.has(c.childId)) {
      return { ok: false, reason: `children[${i}].childId "${c.childId}" is not in \`individuals\`. Add this individual first.` };
    }
  }

  return { ok: true };
}
