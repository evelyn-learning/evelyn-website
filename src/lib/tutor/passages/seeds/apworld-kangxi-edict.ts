import type { Passage } from '../types';

/**
 * The Kangxi Emperor's Sacred Edict (Sheng-yu), Maxim I, "Enforce
 * duteousness and subordination, so as to emphasize social obligations"
 * (issued 1670) — quoted here in Wang Yupu's later colloquial paraphrase
 * ("Direct Explanation") of the Yongzheng Emperor's classical Amplification
 * of that maxim, in F. W. Baller's 1892 PD translation, The Sacred Edict
 * (American Presbyterian Mission Press, Shanghai). AP World Unit-3 document
 * on filial piety as the foundation of Qing Confucian social and political
 * orthodoxy: the exposition's vivid recounting of parental sacrifice as the
 * ground of a child's lifelong debt of "duteousness." Verbatim public-domain
 * excerpt, two contiguous spans joined with an ellipsis marking a page break
 * (nine footnotes of Baller's grammatical notes on the Chinese, interposed
 * on the same page between the two spans, were elided rather than quoted).
 * Fetched from the archive.org fulltext of Baller's 1892 first edition
 * (identifier sacrededict01kang; also thesacrededict01kanguoft), Chapter I,
 * "Indebtedness to Parents." Verified as a contiguous substring after
 * disclosed OCR normalization only: stripping of Baller's inline footnote
 * call-out digits fused onto words ("could6" -> "could"), and one word
 * ("you", badly garbled by the scanner in the 1892 copy at "followed
 * }'0u") cross-checked and restored from two independent archive.org scans
 * of the same Baller translation that render it clearly — the 1892 Princeton
 * Theological Seminary copy's own parallel page and the 1907 revised
 * edition (identifier thesacrededict00chinuoft), both unambiguous. No
 * wording was altered.
 */
export const PASSAGE_APWORLD_KANGXI_EDICT: Passage = {
  id: 'evelyn.passage.apworld-kangxi-edict.v1',
  title: 'The Sacred Edict — Maxim I, "Duteousness and Subordination"',
  author: 'Kangxi Emperor (Wang Yupu colloquial rendering, trans. F. W. Baller)',
  year: 1670,
  sourceUrl: 'https://archive.org/details/sacrededict01kang',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'When you were (a babe) in arms, were you hungry? you could not feed yourself: cold? you could not clothe yourself. Your parents looked upon your face, listened to your voice. Did you laugh? they were pleased; did you cry? they were sad; did you toddle? step by step they followed you. If you had never so trifling an ailment they were distressed to the last degree, and could not take their food. They grieved, not that children were difficult to rear, but at their own blunders;\n\n' +
    '… and were more than willing to bear (the sickness) in their own persons. They waited till you were well before their minds were at ease. They looked forward with great expectation to your coming to manhood. You do not know how much fatigue they endured; how much anxiety they bore to rear you and to instruct you.',
  lineNumbered: true,
  wordCount: 144,
};
