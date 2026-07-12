import type { Passage } from '../types';

/**
 * Karl Marx and Friedrich Engels, "The Communist Manifesto" (1848), Section
 * I ("Bourgeois and Proletarians") and the closing lines. AP World Unit-5
 * DBQ document — the class-conflict analysis of industrial society, framed
 * as a primary-source response to the same conditions documented in the
 * Sadler Committee testimony. Excerpt covers the bourgeoisie's own creation
 * of the modern proletariat as a wage-dependent "commodity" class, then
 * (one paragraph elided, marked) the closing call to revolutionary action
 * and "WORKING MEN OF ALL COUNTRIES, UNITE!" Verbatim public-domain text
 * from Samuel Moore's authorized 1888 English translation (edited by
 * Engels), the standard PD English edition, Project Gutenberg #61; italic
 * markup underscores around "i.e." in the Gutenberg plain-text file are
 * formatting artifacts, stripped here.
 */
export const PASSAGE_APWORLD_COMMUNIST_MANIFESTO: Passage = {
  id: 'evelyn.passage.apworld-communist-manifesto.v1',
  title: 'The Communist Manifesto',
  author: 'Karl Marx and Friedrich Engels (Moore trans.)',
  year: 1848,
  sourceUrl: 'https://www.gutenberg.org/ebooks/61',
  license: 'public-domain',
  genre: 'pamphlet',
  fullText:
    'The weapons with which the bourgeoisie felled feudalism to the ground are now turned against the bourgeoisie itself.\n\nBut not only has the bourgeoisie forged the weapons that bring death to itself; it has also called into existence the men who are to wield those weapons—the modern working class—the proletarians.\n\nIn proportion as the bourgeoisie, i.e., capital, is developed, in the same proportion is the proletariat, the modern working class, developed—a class of labourers, who live only so long as they find work, and who find work only so long as their labour increases capital. These labourers, who must sell themselves piece-meal, are a commodity, like every other article of commerce, and are consequently exposed to all the vicissitudes of competition, to all the fluctuations of the market.\n\n... The Communists disdain to conceal their views and aims. They openly declare that their ends can be attained only by the forcible overthrow of all existing social conditions. Let the ruling classes tremble at a Communistic revolution. The proletarians have nothing to lose but their chains. They have a world to win.\n\nWORKING MEN OF ALL COUNTRIES, UNITE!',
  lineNumbered: true,
  wordCount: 187,
};
