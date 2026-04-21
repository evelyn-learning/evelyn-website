'use client';

/**
 * Punnett Square Renderer
 *
 * Proper genetics grid with gamete headers on the axes and offspring
 * genotypes in the cells. Replaces show_table for monohybrid/dihybrid
 * crosses so the headers can't collapse or duplicate the way free-form
 * tables sometimes do when the LLM emits them.
 */

import { useMemo } from 'react';

interface PunnettRendererProps {
  parent1: string;
  parent2: string;
  title?: string;
  trait?: string;          // e.g. "Pea color" or "Flower color"
  showPhenotypeRatio?: boolean;
}

// Split a genotype into gametes. For a monohybrid ("Pp"), gametes are ["P","p"].
// For a dihybrid ("RrYy"), gametes are ["RY","Ry","rY","ry"].
function gametes(genotype: string): string[] {
  const cleaned = genotype.replace(/\s+/g, '');
  if (!/^[A-Za-z]+$/.test(cleaned)) return [];
  // Pair-up letters: each trait is a pair of alleles (same letter, mixed case)
  const pairs: string[] = [];
  for (let i = 0; i < cleaned.length; i += 2) pairs.push(cleaned.slice(i, i + 2));
  if (pairs.some(p => p.length !== 2)) return [];
  // Cartesian product — one allele per pair per gamete.
  const out: string[] = [''];
  for (const pair of pairs) {
    const [a, b] = [pair[0], pair[1]];
    const next: string[] = [];
    for (const prefix of out) {
      next.push(prefix + a);
      if (a !== b) next.push(prefix + b);
    }
    // Dedupe (if a == b, we already added only one)
    out.length = 0;
    out.push(...Array.from(new Set(next)));
  }
  return out;
}

// Combine two gametes into an offspring genotype by merging each trait pair.
// Example: combine("RY", "ry") trait-by-trait → RrYy, combine("RY","rY") → RrYY.
function combineGametes(g1: string, g2: string): string {
  if (g1.length !== g2.length) return g1 + g2;
  const traits: string[] = [];
  for (let i = 0; i < g1.length; i++) {
    const a = g1[i];
    const b = g2[i];
    // Dominant (uppercase) first, then recessive.
    if (a.toLowerCase() === b.toLowerCase()) {
      if (a === a.toUpperCase() && b === b.toLowerCase()) traits.push(a + b);
      else if (a === a.toLowerCase() && b === b.toUpperCase()) traits.push(b + a);
      else traits.push(a + b);
    } else {
      traits.push([a, b].sort().join(''));
    }
  }
  return traits.join('');
}

// Classify an offspring genotype as dominant-phenotype or recessive-phenotype
// for a single-trait cross (used for the 3:1 / 1:2:1 ratio readout).
function dominantCount(genotype: string): { dominant: number; recessive: number } {
  let dominant = 0;
  let recessive = 0;
  // For each trait pair: if any letter is uppercase → dominant; else recessive.
  for (let i = 0; i < genotype.length; i += 2) {
    const pair = genotype.slice(i, i + 2);
    if (/[A-Z]/.test(pair)) dominant++;
    else recessive++;
  }
  return { dominant, recessive };
}

export function PunnettRenderer({
  parent1,
  parent2,
  title,
  trait,
  showPhenotypeRatio = true,
}: PunnettRendererProps) {
  const result = useMemo(() => {
    const g1 = gametes(parent1);
    const g2 = gametes(parent2);
    if (g1.length === 0 || g2.length === 0) return null;
    const offspring: string[][] = g1.map(row => g2.map(col => combineGametes(row, col)));
    return { g1, g2, offspring };
  }, [parent1, parent2]);

  const phenotypeReadout = useMemo(() => {
    if (!result || !showPhenotypeRatio) return null;
    const counts = new Map<string, number>();
    for (const row of result.offspring) {
      for (const gt of row) {
        counts.set(gt, (counts.get(gt) || 0) + 1);
      }
    }
    const total = result.g1.length * result.g2.length;
    const summary = Array.from(counts.entries())
      .map(([gt, n]) => `${n}/${total} ${gt}`)
      .join(', ');
    // For single-trait crosses produce a phenotype ratio (dom : rec)
    if (parent1.length === 2 && parent2.length === 2) {
      let dom = 0, rec = 0;
      for (const row of result.offspring) {
        for (const gt of row) {
          const c = dominantCount(gt);
          dom += c.dominant;
          rec += c.recessive;
        }
      }
      const phenoRatio = `Phenotype ratio — dominant : recessive = ${dom} : ${rec}`;
      return `${summary}. ${phenoRatio}`;
    }
    return summary;
  }, [result, parent1, parent2, showPhenotypeRatio]);

  if (!result) {
    return (
      <div className="p-3 rounded border border-amber-200 bg-amber-50 text-amber-800 text-sm">
        Could not render Punnett square — parents must be written as allele pairs (e.g., &quot;Pp&quot;, &quot;RrYy&quot;).
      </div>
    );
  }

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      {title && <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>}
      {trait && <p className="text-xs text-gray-500 mb-2">{trait}</p>}
      <p className="text-xs text-gray-600 mb-2">
        Parents: <span className="font-mono text-gray-800">{parent1}</span> × <span className="font-mono text-gray-800">{parent2}</span>
      </p>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-12 h-10 border border-gray-300 bg-gray-100 text-gray-500 text-xs">×</th>
            {result.g2.map((g, j) => (
              <th key={j} className="w-14 h-10 border border-gray-300 bg-blue-50 font-mono font-semibold text-blue-900">
                {g}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.g1.map((rowGamete, i) => (
            <tr key={i}>
              <th className="border border-gray-300 bg-blue-50 font-mono font-semibold text-blue-900">{rowGamete}</th>
              {result.offspring[i].map((cell, j) => (
                <td key={j} className="w-14 h-10 border border-gray-300 font-mono text-gray-800 text-center">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {phenotypeReadout && (
        <p className="text-xs text-gray-600 mt-2">{phenotypeReadout}</p>
      )}
    </div>
  );
}

export default PunnettRenderer;
