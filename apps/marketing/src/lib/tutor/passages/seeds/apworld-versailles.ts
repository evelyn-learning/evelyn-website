import type { Passage } from '../types';

/**
 * Treaty of Versailles (signed 28 June 1919). Verbatim public-domain treaty
 * text, transcribed from the Avalon Project's (Yale Law School) full-text
 * transcripts of the official treaty, at its two-part menu:
 * avalon.law.yale.edu/imt/partviii.asp (Article 231) and
 * avalon.law.yale.edu/imt/parti.asp (Article 22, reproducing the Covenant
 * of the League of Nations as Part I of the treaty; the identical Covenant
 * text is separately catalogued at avalon.law.yale.edu/20th_century/leagcov.asp).
 * AP World Unit-7 document: two clauses from two different parts of the
 * treaty. Article 231, "The War Guilt Clause," opens Part VIII
 * ("Reparation"), Section I ("General Provisions") of the treaty proper.
 * Article 22 is NOT in the reparations sections — it is Article 22 of the
 * Covenant of the League of Nations, which the Treaty of Versailles
 * incorporates, verbatim, as Part I (Articles 1-26) of the treaty; Article
 * 22 is the clause establishing the mandate system for the former German
 * colonies and Ottoman territories. Because the two articles sit in
 * different Parts of the same treaty, the excerpt is two separate
 * contiguous spans joined by the marked ellipsis; Article 22's two opening
 * paragraphs (the "sacred trust of civilisation" principle and the
 * assignment of tutelage to Mandatory powers) are themselves one contiguous
 * span from the Part I / Covenant text.
 */
export const PASSAGE_APWORLD_VERSAILLES: Passage = {
  id: 'evelyn.passage.apworld-versailles.v1',
  title: 'Treaty of Versailles (1919): Article 231 and Article 22',
  author: 'Allied and Associated Powers / German Delegation',
  year: 1919,
  sourceUrl: 'https://avalon.law.yale.edu/imt/partviii.asp',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'ARTICLE 231.\n\nThe Allied and Associated Governments affirm and Germany accepts the responsibility of Germany and her allies for causing all the loss and damage to which the Allied and Associated Governments and their nationals have been subjected as a consequence of the war imposed upon them by the aggression of Germany and her allies.\n\n[...]\n\nARTICLE 22 (Covenant of the League of Nations, Part I of the Treaty).\n\nTo those colonies and territories which as a consequence of the late war have ceased to be under the sovereignty of the States which formerly governed them and which are inhabited by peoples not yet able to stand by themselves under the strenuous conditions of the modern world, there should be applied the principle that the well-being and development of such peoples form a sacred trust of civilisation and that securities for the performance of this trust should be embodied in this Covenant. The best method of giving practical effect to this principle is that the tutelage of such peoples should be entrusted to advanced nations who by reason of their resources, their experience or their geographical position can best undertake this responsibility, and who are willing to accept it, and that this tutelage should be exercised by them as Mandatories on behalf of the League.',
  lineNumbered: true,
  wordCount: 199,
};
