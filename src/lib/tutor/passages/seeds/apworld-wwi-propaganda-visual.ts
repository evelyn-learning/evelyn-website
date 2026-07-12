import type { Passage } from '../types';

/**
 * Described visual (Visual Sources document type) for AP World Unit-7: a
 * WWI Indian Army recruitment poster from the "this soldier is defending
 * India" design family, produced by the Times Press, Bombay, c.1914-1918
 * and held by the Imperial War Museums, London (catalogued Art.IWM PST
 * 12594, object record iwm.org.uk/collections/item/object/31136, "[Hindi
 * Text Poster featuring an Indian Soldier and a Map of India]"). IWM issued
 * this single base design with a blank caption strip at the bottom so that
 * regional recruiting offices could paste in a locally translated caption;
 * IWM's collection holds separately catalogued Hindi, Urdu (Art.IWM PST
 * 12580, object 31129, "[This Soldier is Defending India]"), and other
 * language-strip variants of the same image. A public-domain copy of the
 * Hindi-caption version is also mirrored at Wikimedia Commons
 * (commons.wikimedia.org/wiki/File:Indian_Army_World_War_I_Hindi_
 * Recruitment_Poster.jpg), whose file description corroborates the IWM
 * catalogue record used here (artist, printer, and caption translation).
 * Text-only passage, so fullText is a factual DESCRIPTION of the poster's
 * imagery and cataloguing (how a Visual Sources document is presented for
 * analysis), not a transcription of its Hindi/Urdu caption text — mirrors
 * apworld-catalan-atlas.ts. British Crown/government WWI-era work,
 * public domain. IWM does not assign this object a single production year
 * (catalogued only as part of the "WW1 Indian Home Front" collection,
 * 1914-1918); `year` uses 1918, the terminal year of that campaign and of
 * the war itself, as the closest defensible single-year value rather than
 * asserting false precision.
 */
export const PASSAGE_APWORLD_WWI_PROPAGANDA_VISUAL: Passage = {
  id: 'evelyn.passage.apworld-wwi-propaganda-visual.v1',
  title: 'Indian Army Recruitment Poster (World War I, c.1914-1918)',
  author: 'Times Press, Bombay (printer; artist unrecorded)',
  year: 1918,
  sourceUrl: 'https://www.iwm.org.uk/collections/item/object/31136',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL — description] A recruitment poster produced in British India during the First World War and catalogued by the Imperial War Museums (Art.IWM PST 12594 and the related Urdu-language variant, Art.IWM PST 12580). The image shows a full-length Indian soldier in British Indian Army uniform, rifle held with bayonet fixed, standing in front of a large red-toned outline map of India; the composition is set on a plain white ground inside a narrow black border. A separate printed paper strip is pasted along the bottom edge of the sheet, carrying a caption in the language of the region where the poster was distributed — a production method that let the Times Press of Bombay reissue one base design across India\'s many linguistic regions; the Imperial War Museums catalogues separate Hindi-, Urdu-, Tamil-, and Gujarati-caption copies of the same design under adjacent object numbers, each translating to the sense that this soldier is defending India and that the best way to help one\'s home and family is to join the army. The design was one of many such posters used to recruit soldiers and labourers from British India, which by the 1918 armistice had contributed more than 1.3 million men to Allied forces overseas, without the political self-determination promised elsewhere in wartime Allied propaganda.',
  lineNumbered: false,
  wordCount: 210,
};
