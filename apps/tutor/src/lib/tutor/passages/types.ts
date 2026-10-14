/**
 * A public-domain stimulus passage shared across a lesson plan, its topic
 * notes, a passage-grouped MCQ set, and/or an essay try-yourself. Referenced
 * by `passageId` from those consumers; resolved via passages/store.ts.
 */
export interface Passage {
  /** 'evelyn.passage.<slug>.v1' */
  id: string;
  title: string;
  author: string;
  /** Publication/delivery year. Must be public domain — pre-1929, or exempt
   *  from copyright regardless of year (US government works, 17 USC §105). */
  year: number;
  /** Canonical public-domain source (Wikisource/Gutenberg/archives). */
  sourceUrl: string;
  license: 'public-domain' | 'internal-original';
  genre: 'speech' | 'essay' | 'letter' | 'sermon' | 'pamphlet' | 'memoir' | 'document' | 'political-cartoon' | 'constitution' | 'fiction' | 'informational' | 'science';
  /** Paragraph-delimited full text (\n\n between paragraphs). AP-typical
   *  excerpt length ~600-800 words to keep grader prompts affordable. */
  fullText: string;
  /** AP passages are line-numbered for citation. */
  lineNumbered: boolean;
  wordCount: number;
  /** A data-table stimulus's data AS A TABLE, for surfaces that can draw one
   *  (the Self Study practice card — portal/source-items.ts). `fullText`
   *  stays the description every other reader (grader, tutor) uses; every
   *  value in a cell is a value `fullText` states. */
  table?: PassageTable;
}

export interface PassageTable {
  caption?: string;
  /** Column headings, left to right. */
  columns: string[];
  /** One array of display strings per row, one string per column. */
  rows: string[][];
}
