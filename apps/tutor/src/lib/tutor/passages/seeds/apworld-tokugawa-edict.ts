import type { Passage } from '../types';

/**
 * CONVERTED TO A DESCRIBED DOCUMENT (2026-07-12 controller fix). The prior
 * version of this seed quoted an "unattributed" English rendering of the
 * 1635 Closed Country Edict fetched from a course-reader page linked off
 * Fordham's East Asian History Sourcebook. On review, clauses 1-3 of that
 * quoted text matched David J. Lu's translation in "Japan: A Documentary
 * History" (M.E. Sharpe, 1997, (c) 2001) word-for-word — a translation that
 * is currently under copyright, not public domain. No pre-1929 (or
 * otherwise verifiably public-domain) English translation of this edict
 * could be confirmed: 19th/early-20th-century Japanology sources were not
 * located with a matching, checkable rendering, and every other modern
 * English translation encountered is likewise a copyrighted secondary work.
 * Quoting any of them under `license: 'public-domain'` would misrepresent
 * their copyright status.
 *
 * Per this fan-out's sanctioned fallback for exactly this situation
 * (mirrors `apworld-zheng-he-visual.ts` and `apworld-potosi-silver-table.ts`
 * in this same worktree), the seed is now a DESCRIBED DOCUMENT: fullText is
 * original prose, written for this project, that describes the edict's
 * content and context rather than quoting or paraphrasing any specific
 * translator's wording. `genre: 'political-cartoon'` is used here only
 * because it is this codebase's described-stimulus type slot (see the two
 * seeds above for the same convention); it is not a claim that the
 * underlying document is visual.
 *
 * Facts covered below (verified against the archived course-reader page,
 * used only as a factual reference, and against standard secondary
 * accounts of the 1635 edict and the sakoku policy): issued 1635 by the
 * Tokugawa shogunate to the Nagasaki commissioners (bugyō); forbade
 * Japanese ships and subjects from traveling abroad; ordered death for any
 * Japanese subject who returned from overseas; banned Christianity and
 * ordered rewards for informants who exposed missionaries and converts;
 * restricted foreign trade to a small number of designated, closely
 * supervised ports; and was one step in the broader sakoku policy that, by
 * 1641, confined European trade to the Dutch at Dejima in Nagasaki harbor.
 *
 * WARNING TO DOWNSTREAM TASKS: do not quote or closely paraphrase any
 * published translation of this edict (Lu's or any other) anywhere this
 * passage is used — no quotation marks around any edict language, in this
 * file or in any lesson-plan segment, MCQ stem, or essay prompt that
 * references it. Treat the edict only through this described-document
 * summary.
 */
export const PASSAGE_APWORLD_TOKUGAWA_EDICT: Passage = {
  id: 'evelyn.passage.apworld-tokugawa-edict.v1',
  title: 'Closed Country Edict of 1635 (described document)',
  author: 'Tokugawa shogunate (Edo bakufu)',
  year: 1635,
  sourceUrl:
    'https://web.archive.org/web/20230305000400/http://users.wfu.edu/watts/w03_Japancl.html',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    "[DOCUMENT — description] A description of the Closed Country Edict of 1635, one of a series of directives the Tokugawa shogunate (Edo bakufu) issued to the two magistrates (bugyō) responsible for the port city of Nagasaki, tightening the shogunate's control over Japan's contact with the outside world. The edict forbade Japanese ships from sailing to foreign countries and forbade Japanese subjects from traveling abroad at all, closing off the outward movement that earlier decades of overseas trade and settlement had allowed. It further directed that any Japanese subject who had gone abroad and later returned to Japan be put to death, treating re-entry after residence overseas as itself a capital offense, regardless of the traveler's original intentions. The edict renewed and strengthened the shogunate's ban on Christianity, directing local officials to investigate thoroughly wherever the religion was suspected of being practiced, and it established rewards meant to encourage informants to come forward and expose missionaries and Japanese converts alike, turning suppression of the faith into a matter of active, incentivized surveillance rather than passive prohibition. Foreign trade itself was not ended outright, but it was narrowed and concentrated: incoming merchant ships were to be confined to a small number of designated ports, where their cargoes, crews, and dealings with Japanese merchants could be closely supervised by shogunate officials rather than allowed to spread freely along the coast. This edict was one step in the broader sakoku policy, often glossed in English as Japan's closed-country policy, that unfolded over the following years; by 1641 the shogunate had carried the process to its logical end, expelling the Portuguese and confining the last permitted European trading presence, the Dutch East India Company, to the small artificial island of Dejima in Nagasaki harbor, where its ships and personnel could be watched continuously and kept apart from the Japanese population at large.",
  lineNumbered: false,
  wordCount: 307,
};
