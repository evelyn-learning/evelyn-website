import type { Passage } from '../types';

/**
 * The Universal Declaration of Human Rights, adopted by the UN General
 * Assembly on December 10, 1948 (Resolution 217 A). AP World Unit-8
 * document — the opening and closing clauses of the Preamble plus Articles
 * 1 and 2 in full (the "class excerpt" typically used to teach the
 * Declaration's universalist claim). The United Nations places the UDHR
 * text in the public domain for reproduction; excerpt verified as
 * contiguous spans (two opening Preamble clauses, elided to the closing
 * "Now, therefore" / "Proclaims" clause, marked ". . .", then Articles 1-2
 * verbatim) against the United Nations' own full-text page for the
 * Declaration.
 */
export const PASSAGE_APWORLD_UDHR: Passage = {
  id: 'evelyn.passage.apworld-udhr.v1',
  title: 'Universal Declaration of Human Rights (Preamble; Articles 1-2)',
  author: 'United Nations General Assembly',
  year: 1948,
  sourceUrl: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights',
  license: 'public-domain',
  genre: 'constitution',
  fullText:
    'Whereas recognition of the inherent dignity and of the equal and inalienable rights of all members of the human family is the foundation of freedom, justice and peace in the world,\n\n' +
    'Whereas disregard and contempt for human rights have resulted in barbarous acts which have outraged the conscience of mankind, and the advent of a world in which human beings shall enjoy freedom of speech and belief and freedom from fear and want has been proclaimed as the highest aspiration of the common people,\n\n' +
    '. . .\n\n' +
    'Now, therefore,\n\n' +
    'The General Assembly,\n\n' +
    'Proclaims this Universal Declaration of Human Rights as a common standard of achievement for all peoples and all nations, to the end that every individual and every organ of society, keeping this Declaration constantly in mind, shall strive by teaching and education to promote respect for these rights and freedoms and by progressive measures, national and international, to secure their universal and effective recognition and observance, both among the peoples of Member States themselves and among the peoples of territories under their jurisdiction.\n\n' +
    'Article 1\n\n' +
    'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.\n\n' +
    'Article 2\n\n' +
    'Everyone is entitled to all the rights and freedoms set forth in this Declaration, without distinction of any kind, such as race, colour, sex, language, religion, political or other opinion, national or social origin, property, birth or other status. Furthermore, no distinction shall be made on the basis of the political, jurisdictional or international status of the country or territory to which a person belongs, whether it be independent, trust, non-self-governing or under any other limitation of sovereignty.',
  lineNumbered: true,
  wordCount: 287,
};
