import type { Passage } from '../types';

/**
 * President Woodrow Wilson's Fourteen Points, delivered as a joint address
 * to Congress (8 January 1918). US-government work (17 USC §105); public
 * domain regardless of date. Verbatim excerpt, transcribed from the Avalon
 * Project's (Yale Law School) full-text transcript of the address. AP World
 * Unit-7 document: three of the fourteen points — Point I (open diplomacy),
 * Point V (the "impartial adjustment of all colonial claims," the clause AP
 * World courses cite for Wilson's stated principle that colonized peoples'
 * interests should weigh equally with the claims of the colonizing power),
 * and Point XIV (the "general association of nations," the seed of the
 * League of Nations). Each point is a contiguous span from the source;
 * points II-IV, VI-XIII are omitted, marked by the ellipsis between points.
 */
export const PASSAGE_APWORLD_FOURTEEN_POINTS: Passage = {
  id: 'evelyn.passage.apworld-fourteen-points.v1',
  title: "President Woodrow Wilson's Fourteen Points (1918)",
  author: 'Woodrow Wilson',
  year: 1918,
  sourceUrl: 'https://avalon.law.yale.edu/20th_century/wilson14.asp',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'I.\n\nOpen covenants of peace, openly arrived at, after which there shall be no private international understandings of any kind but diplomacy shall proceed always frankly and in the public view.\n\n[...]\n\nV.\n\nA free, open-minded, and absolutely impartial adjustment of all colonial claims, based upon a strict observance of the principle that in determining all such questions of sovereignty the interests of the populations concerned must have equal weight with the equitable claims of the government whose title is to be determined.\n\n[...]\n\nXIV.\n\nA general association of nations must be formed under specific covenants for the purpose of affording mutual guarantees of political independence and territorial integrity to great and small states alike.',
  lineNumbered: true,
  wordCount: 110,
};
