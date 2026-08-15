/**
 * Biology-specific validators.
 *
 * These cover teaching failure modes that Wolfram math validation
 * cannot catch: case-sensitive genotype notation, ABO/Rh blood type
 * compatibility, and Punnett-square offspring checks.
 *
 * Each validator returns `{correct, issues, expected?}` so the caller
 * can inject a correction through the same injectContext pipeline used
 * for math-validation mismatches.
 */

// ------------------------------------------------------------------
// Genotype notation
// ------------------------------------------------------------------

export type Zygosity = 'homozygous-dominant' | 'homozygous-recessive' | 'heterozygous' | 'hemizygous' | 'unknown';

/**
 * Given a 2-character genotype string, classify its zygosity based on case.
 * Returns "unknown" if the input isn't two letters (e.g. "XX-" or "Pp ").
 * Case is what matters: uppercase = dominant, lowercase = recessive.
 */
export function classifyGenotype(genotype: string): Zygosity {
  if (!genotype) return 'unknown';
  const g = genotype.replace(/\s+/g, '');
  // X-linked single allele (hemizygous) — single letter or "XY"
  if (/^X[YyZ]$/.test(g) || /^[xy]Y$/.test(g)) return 'hemizygous';
  if (g.length !== 2) return 'unknown';
  const [a, b] = [g[0], g[1]];
  if (!/^[a-zA-Z]$/.test(a) || !/^[a-zA-Z]$/.test(b)) return 'unknown';
  // Same letter, different case → heterozygous (Xx, Pp, Rr)
  if (a.toLowerCase() === b.toLowerCase()) {
    if (a === b) {
      // Both same case: either both upper or both lower
      return a === a.toUpperCase() ? 'homozygous-dominant' : 'homozygous-recessive';
    }
    return 'heterozygous';
  }
  // Different letters (multi-trait shorthand like "AB" for alleles) — unknown
  return 'unknown';
}

const ZYGOSITY_PHRASES: Record<Zygosity, RegExp> = {
  'homozygous-dominant': /\b(homozygous\s+dominant|homozygous(\s+)?dom\b|pure\s+dominant)\b/i,
  'homozygous-recessive': /\b(homozygous\s+recessive|homozygous(\s+)?rec\b|pure\s+recessive)\b/i,
  'heterozygous': /\b(heterozygous|hybrid|carrier(?!\s+of))\b/i,
  'hemizygous': /\b(hemizygous|single\s+X)\b/i,
  'unknown': /(?!)/,
};

/**
 * Verify a tutor/student assertion pairing a genotype with a zygosity phrase.
 * Example: the tutor says "Xx is homozygous recessive" — we classify Xx as
 * heterozygous and return {correct: false, expected: 'heterozygous'}.
 */
export function validateGenotypeAssertion(text: string): {
  correct: boolean;
  genotype?: string;
  actual?: Zygosity;
  claimed?: Zygosity;
  issues?: string[];
} {
  if (!text) return { correct: true };

  // Identify any claimed zygosity phrase in the text first.
  let claimed: Zygosity | undefined;
  for (const z of Object.keys(ZYGOSITY_PHRASES) as Zygosity[]) {
    if (z === 'unknown') continue;
    if (ZYGOSITY_PHRASES[z].test(text)) {
      claimed = z;
      break;
    }
  }
  if (!claimed) return { correct: true };

  // Find a 2-letter genotype token anywhere in the same sentence. We scan
  // all candidates rather than requiring one specific order — the Kayla
  // bug had "homozygous recessive, Xx, just like..." with the genotype
  // trailing the zygosity phrase.
  // Skip common 2-letter non-genotype words (is/as/to/it/we/us/...) to
  // keep false positives down.
  const STOPWORDS = new Set([
    'is', 'as', 'to', 'it', 'we', 'us', 'be', 'by', 'or', 'so', 'on', 'in', 'at',
    'of', 'if', 'up', 'no', 'an', 'do', 'my', 'me', 'go', 'ok',
    'hi', 'oh', 'ah', 'eh', 'uh', 'um', 'yo', 'ya', 'll', 've', 'rd', 'st', 'nd', 'th',
  ]);
  const genotypePattern = /\b([A-Za-z]{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = genotypePattern.exec(text)) !== null) {
    const token = m[1];
    if (STOPWORDS.has(token.toLowerCase())) continue;
    const actual = classifyGenotype(token);
    if (actual === 'unknown' || actual === 'hemizygous') continue;
    if (claimed !== actual) {
      return {
        correct: false,
        genotype: token,
        actual,
        claimed,
        issues: [`${token} is ${actual.replace('-', ' ')}, not ${claimed.replace('-', ' ')}`],
      };
    }
    // First matching genotype agrees with claimed — stop; don't let a
    // later unrelated token flip the result.
    return { correct: true, genotype: token, actual, claimed };
  }
  return { correct: true };
}

// ------------------------------------------------------------------
// Punnett-square cross
// ------------------------------------------------------------------

/**
 * Detect whether a show_table payload looks like a Punnett square.
 * Heuristic: single-letter column headers + single-letter row headers and
 * rows populated with 2-character genotype cells.
 */
export function looksLikePunnett(headers: string[], rows: string[][]): boolean {
  if (!headers || !rows) return false;
  if (headers.length < 2 || headers.length > 5) return false;
  if (rows.length < 1 || rows.length > 4) return false;
  const topHeaders = headers.slice(1); // first col is usually the row-axis header
  const topAllSingle = topHeaders.every(h => /^[A-Za-z]{1,2}$/.test((h || '').trim()));
  if (!topAllSingle) return false;
  const rowLabelsAllSingle = rows.every(r => /^[A-Za-z]{1,2}$/.test((r[0] || '').trim()));
  if (!rowLabelsAllSingle) return false;
  // At least one cell should look like a 2-4 char genotype
  const cellsLookGenetic = rows.some(r => r.slice(1).some(c => /^[A-Za-z]{2,6}$/.test((c || '').trim())));
  return cellsLookGenetic;
}

/**
 * Repair a Punnett-square table whose row and column gamete headers collapsed
 * to the same letter. Example: LLM emits headers=["","P","P"] and rows with
 * row labels both "P" — should be ["","P","p"] with rows "P","p". We infer
 * the correct alleles by scanning the filled-in cells for each parent's
 * dominant/recessive pair.
 *
 * Returns repaired {headers, rows} or null if it can't tell what was intended.
 */
export function repairPunnettHeaders(headers: string[], rows: string[][]): { headers: string[]; rows: string[][] } | null {
  if (!looksLikePunnett(headers, rows)) return null;
  // Collect letters actually used in the cells (case-sensitive, dominant vs recessive)
  const allCells = rows.flatMap(r => r.slice(1)).join('');
  const uniqueLetters = Array.from(new Set(allCells.split('').filter(c => /[A-Za-z]/.test(c))));
  if (uniqueLetters.length === 0) return null;
  // Group by lowercase base to find the underlying trait letter(s)
  const traitGroups = new Map<string, string[]>();
  for (const ch of uniqueLetters) {
    const base = ch.toLowerCase();
    if (!traitGroups.has(base)) traitGroups.set(base, []);
    traitGroups.get(base)!.push(ch);
  }
  // If there's exactly one base letter with both cases present, we can fix
  // single-trait headers. Return the repaired headers using that pair.
  const singleTrait = Array.from(traitGroups.entries()).find(([, list]) => list.length === 2);
  if (!singleTrait) return null;
  const [base, pair] = singleTrait;
  const upper = pair.find(p => p === p.toUpperCase()) || base.toUpperCase();
  const lower = pair.find(p => p === p.toLowerCase()) || base;

  // Determine existing top-header pattern. If both are same letter, replace
  // with upper/lower. If already correct (one upper one lower), leave alone.
  const fixedHeaders = [...headers];
  const topHeaders = headers.slice(1);
  if (topHeaders.length === 2 && topHeaders[0].trim() === topHeaders[1].trim()) {
    fixedHeaders[1] = upper;
    fixedHeaders[2] = lower;
  }
  // Same for row labels
  const fixedRows = rows.map(r => [...r]);
  if (rows.length === 2 && (rows[0][0] || '').trim() === (rows[1][0] || '').trim()) {
    fixedRows[0][0] = upper;
    fixedRows[1][0] = lower;
  }
  // If nothing changed, return null (nothing to repair).
  if (JSON.stringify(fixedHeaders) === JSON.stringify(headers)
      && JSON.stringify(fixedRows) === JSON.stringify(rows)) {
    return null;
  }
  return { headers: fixedHeaders, rows: fixedRows };
}

/**
 * Generate the 4-cell offspring of a monohybrid cross.
 * Example: monohybridCross("Pp", "pp") → ["Pp", "Pp", "pp", "pp"]
 */
export function monohybridCross(parent1: string, parent2: string): string[] | null {
  if (!/^[A-Za-z]{2}$/.test(parent1) || !/^[A-Za-z]{2}$/.test(parent2)) return null;
  const [a, b] = [parent1[0], parent1[1]];
  const [c, d] = [parent2[0], parent2[1]];
  const combine = (x: string, y: string) => {
    // Canonical order: uppercase first, then lowercase if same letter; otherwise alphabetical
    if (x.toLowerCase() === y.toLowerCase()) {
      return x === x.toUpperCase() ? x + y : y + x;
    }
    return [x, y].sort().join('');
  };
  return [combine(a, c), combine(a, d), combine(b, c), combine(b, d)];
}

// ------------------------------------------------------------------
// ABO + Rh blood-type compatibility
// ------------------------------------------------------------------

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

const ALL_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Return the set of blood types a recipient can safely receive.
 * Rule: recipient cannot have foreign antigens.
 *   - ABO: recipient's red cells must not encounter antigens absent in recipient
 *   - Rh: Rh- recipient cannot receive Rh+ blood (but Rh+ can receive either)
 */
export function canReceiveFrom(recipient: BloodType): BloodType[] {
  const [abo, rh] = parseBloodType(recipient);
  const compat: BloodType[] = [];
  for (const t of ALL_TYPES) {
    const [dAbo, dRh] = parseBloodType(t);
    // ABO check
    const recipAntigens = abo === 'O' ? [] : abo === 'AB' ? ['A', 'B'] : [abo];
    const donorAntigens = dAbo === 'O' ? [] : dAbo === 'AB' ? ['A', 'B'] : [dAbo];
    const foreign = donorAntigens.filter(a => !recipAntigens.includes(a));
    if (foreign.length > 0) continue;
    // Rh check
    if (rh === '-' && dRh === '+') continue;
    compat.push(t);
  }
  return compat;
}

/**
 * Return the set of blood types a donor can safely give to.
 * Symmetric to canReceiveFrom.
 */
export function canDonateTo(donor: BloodType): BloodType[] {
  return ALL_TYPES.filter(recip => canReceiveFrom(recip).includes(donor));
}

function parseBloodType(t: string): [string, '+' | '-'] {
  const m = t.match(/^(AB|A|B|O)\s*([+-]|pos|neg|positive|negative)?$/i);
  if (!m) return ['O', '+']; // default, shouldn't happen for validated input
  const abo = m[1].toUpperCase();
  const rhRaw = (m[2] || '+').toLowerCase();
  const rh = rhRaw.startsWith('n') || rhRaw === '-' ? '-' : '+';
  return [abo, rh as '+' | '-'];
}

/**
 * Validate a claim like "AB- can receive from A-, B-, AB-, O-".
 * Parses the claim and cross-checks against canReceiveFrom.
 * Returns the correct set so the caller can surface it to the tutor.
 */
export function validateReceiveClaim(recipient: BloodType, claimedTypes: BloodType[]): {
  correct: boolean;
  expected: BloodType[];
  missing: BloodType[];
  extra: BloodType[];
} {
  const expected = canReceiveFrom(recipient);
  const missing = expected.filter(t => !claimedTypes.includes(t));
  const extra = claimedTypes.filter(t => !expected.includes(t));
  return {
    correct: missing.length === 0 && extra.length === 0,
    expected,
    missing,
    extra,
  };
}

/**
 * Try to extract a "recipient → list of acceptable types" assertion from
 * free-form tutor text. Returns the claim if parseable, else null.
 * Matches phrases like "AB- can receive A-, B-, AB-, O-".
 */
export function extractReceiveClaim(text: string): { recipient: BloodType; types: BloodType[] } | null {
  if (!text) return null;
  // Match "<TYPE> ... can receive ..." with up to ~40 chars of filler
  // between the type and the verb (e.g. "For AB negative, they can receive").
  const recipPattern = /\b(AB|A|B|O)\s*([+\-]|positive|negative)\b[\s\S]{0,40}?(?:can|could|may|are\s+able\s+to)\s+(?:safely\s+)?(?:receive|get|accept|take)/i;
  const m = text.match(recipPattern);
  if (!m) return null;
  const recipient = canonicalBloodType(m[1] + (m[2] || '+'));
  if (!recipient) return null;
  // Pull everything after the verb, find all A/B/AB/O(+-) tokens
  const afterVerbIdx = text.indexOf(m[0]) + m[0].length;
  const tail = text.slice(afterVerbIdx);
  const typePattern = /\b(AB|A|B|O)\s*([+\-]|positive|negative)\b/gi;
  const types: BloodType[] = [];
  let tm;
  while ((tm = typePattern.exec(tail)) !== null) {
    const bt = canonicalBloodType(tm[1] + (tm[2] || '+'));
    if (bt && !types.includes(bt)) types.push(bt);
  }
  if (types.length === 0) return null;
  return { recipient, types };
}

function canonicalBloodType(raw: string): BloodType | null {
  const m = raw.match(/^(AB|A|B|O)\s*([+\-]|pos|neg|positive|negative)?$/i);
  if (!m) return null;
  const abo = m[1].toUpperCase();
  const rhRaw = (m[2] || '+').toLowerCase();
  const rh = rhRaw.startsWith('n') || rhRaw === '-' ? '-' : '+';
  const t = `${abo}${rh}` as BloodType;
  return ALL_TYPES.includes(t) ? t : null;
}

// ------------------------------------------------------------------
// DNA → RNA codon translation
// ------------------------------------------------------------------

export const CODON_TABLE: Record<string, string> = {
  UUU: 'F', UUC: 'F', UUA: 'L', UUG: 'L',
  UCU: 'S', UCC: 'S', UCA: 'S', UCG: 'S',
  UAU: 'Y', UAC: 'Y', UAA: '*', UAG: '*',
  UGU: 'C', UGC: 'C', UGA: '*', UGG: 'W',
  CUU: 'L', CUC: 'L', CUA: 'L', CUG: 'L',
  CCU: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
  CAU: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
  CGU: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
  AUU: 'I', AUC: 'I', AUA: 'I', AUG: 'M',
  ACU: 'T', ACC: 'T', ACA: 'T', ACG: 'T',
  AAU: 'N', AAC: 'N', AAA: 'K', AAG: 'K',
  AGU: 'S', AGC: 'S', AGA: 'R', AGG: 'R',
  GUU: 'V', GUC: 'V', GUA: 'V', GUG: 'V',
  GCU: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
  GAU: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
  GGU: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
};

/** Transcribe DNA → RNA (template strand T→A, A→U). */
export function transcribe(dna: string): string {
  return dna.toUpperCase().replace(/[^ATGC]/g, '').replace(/T/g, 'U');
}

/** Translate an RNA sequence to a protein (single-letter amino acids). */
export function translate(rna: string): string {
  const clean = rna.toUpperCase().replace(/[^AUGC]/g, '');
  const protein: string[] = [];
  for (let i = 0; i + 3 <= clean.length; i += 3) {
    const codon = clean.slice(i, i + 3);
    const aa = CODON_TABLE[codon];
    if (!aa) break;
    if (aa === '*') break;
    protein.push(aa);
  }
  return protein.join('');
}
