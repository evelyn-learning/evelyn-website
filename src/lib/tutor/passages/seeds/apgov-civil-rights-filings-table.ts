import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * Gov Unit-3: civil rights case filings in U.S. district courts, 1964-2020.
 * Primary source is the Bureau of Justice Statistics special report "Civil
 * Rights Complaints in U.S. District Courts, 1990-2006" (BJS Special
 * Report, NCJ 222989, August 2008) — verified against the report's own
 * text and Table 1: the 1990 figure (18,922) and 1997 peak (43,278) are
 * quoted directly from the report's opening summary paragraph, and the
 * 2006 figure (32,865) is the "Total cases filed" value in Table 1. No BJS
 * report on this topic was published in 2021 (confirmed against BJS's own
 * civil-rights publication list, which ends with the 2008 report); the
 * 1964 figure (709 cases, the first full year after Title VII of the Civil
 * Rights Act of 1964) and the 2020 figure (41,044 cases) are both real,
 * published Administrative Office of the U.S. Courts caseload figures —
 * 1964 from a 2014 uscourts.gov news release ("Over Two Decades, Civil
 * Rights Cases Rise 27 Percent") and 2020 from Judicial Business Table
 * C-2A ("Civil Rights, Total"), which uses the same "excludes prisoner
 * petitions" definition as the BJS report. All five figures are real
 * published values from the same lineage of AOUSC civil caseload data; the
 * 1997 figure is honestly the highest in the five-year table (2020 has
 * partially but not fully rebounded to the historic peak). Text-only
 * passage, so fullText is a factual DESCRIPTION of the table, not the
 * table itself — mirrors the visual-document pattern used for described
 * images and data tables elsewhere in this course.
 */
export const PASSAGE_APGOV_CIVIL_RIGHTS_FILINGS_TABLE: Passage = {
  id: 'evelyn.passage.apgov-civil-rights-filings-table.v1',
  title: 'Civil Rights Filings in U.S. District Courts (data table, 1964–2020)',
  author: 'Bureau of Justice Statistics',
  year: 2008,
  sourceUrl: 'https://bjs.ojp.gov/content/pub/pdf/crcusdc06.pdf',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the Bureau of Justice Statistics special report "Civil Rights Complaints in U.S. District Courts, 1990-2006" (BJS Special Report, NCJ 222989, August 2008), supplemented with historical and current caseload data from the Administrative Office of the U.S. Courts, showing the number of civil rights lawsuits filed in U.S. district courts (excluding prisoner petitions) in five selected years: 1964 — 709 cases, the year after Title VII of the Civil Rights Act of 1964 created a new federal cause of action for employment discrimination; 1990 — 18,922 cases; 1997 — 43,278 cases, the high point of the series, reached after Congress further expanded civil-rights causes of action through the Americans with Disabilities Act of 1990 and the Civil Rights Act of 1991; 2006 — 32,865 cases, following a decline of nearly 20% between 2003 and 2006; and 2020 — 41,044 cases. The data support one clear trend: civil rights litigation, a negligible share of the federal civil docket in the early 1960s, expanded roughly sixty-one-fold between 1964 and 1997 as new civil-rights statutes gave individuals federal causes of action they could enforce by suing in district court. One identify item: the single highest year in the table is 1997, with 43,278 filings — the twentieth-century peak. One conclusion: even after a mid-2000s decline, civil rights filings in 2020 remained nearly 60 times the 1964 level and continued to run in the tens of thousands per year — evidence that, decades after the key civil-rights statutes were enacted, federal district courts remain a primary venue through which individuals pursue civil rights claims.',
  lineNumbered: false,
  wordCount: 268,
};
