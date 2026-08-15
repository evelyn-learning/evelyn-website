import type { Passage } from '../types';

/**
 * Nathaniel Bacon, "Declaration of the People" (1676), issued during Bacon's
 * Rebellion against Virginia Governor Sir William Berkeley. APUSH Period-2
 * DBQ document — the opening grievances: unjust taxation for "private
 * favorites," corrupt/ignorant magistrates, Berkeley's personal monopoly of
 * the beaver trade, and his failure to defend the frontier against Native
 * raids. Verbatim public-domain excerpt, one contiguous span (the
 * declaration's first five grievance clauses, ending before the list of
 * named "wicked and pernicious councellours"), from the documentary
 * transcript hosted at constitution.org. Verified as a contiguous substring
 * of the fetched source (17th-century spelling, e.g. "haveing", "Comonality",
 * "sattisfaction", preserved exactly as rendered).
 */
export const PASSAGE_APUSH_BACON_DECLARATION: Passage = {
  id: 'evelyn.passage.apush-bacon-declaration.v1',
  title: 'Declaration of the People',
  author: 'Nathaniel Bacon',
  year: 1676,
  sourceUrl: 'https://constitution.org/2-Authors/bcp/baconpeo.htm',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'For haveing upon specious pretences of publiqe works raised greate unjust taxes upon the Comonality for the advancement of private favorites and other sinister ends, but noe visible effects in any measure adequate, For not haveing dureing this long time of his Gouvernement in any measure advanced this hopefull Colony either by fortificacons Townes or Trade. For haveing abused and rendred contemptable the Magistrates of Justice, by advanceing to places of Judicature, scandalous and Ignorant favorites. For haveing wronged his Majesties prerogative and interest, by assumeing Monopoly of the Beaver trade, and for haveing in that unjust gaine betrayed and sold his Majesties Country and the lives of his loyall subjects, to the barbarous heathen. For haveing, protected, favoured, and Imboldned the Indians against his Majesties loyall subjects, never contriveing, requireing, or appointing any due or proper meanes of sattisfaction for theire many Invasions, robbories, and murthers comitted upon us.',
  lineNumbered: true,
  wordCount: 150,
};
