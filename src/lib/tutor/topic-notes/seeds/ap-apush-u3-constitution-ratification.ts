/**
 * AP US History — Unit 3 CED 3.10: The Constitutional Convention and
 * Ratification Debate.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.constitution-ratification.v1`. Covers the Convention's
 * core compromises (Great/Connecticut, Three-Fifths, Commerce) and the
 * Federalist/Anti-Federalist ratification debate, resolved by the promise
 * of a Bill of Rights.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_CONSTITUTION_RATIFICATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.constitution-ratification.v1',
  course: 'AP United States History',
  cedUnit: 3,
  cedTopic: '3.10',
  cedTitle: 'The Constitutional Convention and Ratification Debate',
  planId: 'evelyn.ap.apush.constitution-ratification.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.constitution-ratification.v1' }],
  theory: [
    {
      loId: 'apush.constitution-ratification',
      kind: 'event',
      title: 'from revision to replacement',
      content:
        'The Constitutional Convention (Philadelphia, summer 1787) was called to revise the Articles of Confederation. Delegates instead drafted an entirely new frame of government with a stronger national structure: separation of powers (legislative, executive, judicial), checks and balances among them, and federalism (power divided between national and state governments) — directly addressing the Articles\' missing taxing power, missing executive/judiciary, and missing national defense capacity.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Great (Connecticut) Compromise',
      content:
        'Resolved the large-state/small-state deadlock over how Congress should be structured by creating a BICAMERAL Congress: the House of Representatives apportioned by population, and the Senate with equal representation (two seats per state).',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Three-Fifths Compromise',
      content:
        "Counted three-fifths of a state's enslaved population toward BOTH representation and direct taxation. Resolved a dispute in which Southern states wanted enslaved people counted for representation (without rights) and Northern states objected to counting them for representation while excluding them from taxation. Entrenched slavery's political power in the new national government from its founding.",
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Commerce Compromise',
      content:
        'Congress gained power to regulate interstate and foreign commerce (fixing an Articles weakness), but was PERMANENTLY barred from taxing exports (Art. I, §9) — still in force today. As a separate concession to Southern states, Congress was barred from banning the international slave trade until 1808, a time-limited protection that did expire.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Federalists',
      content:
        'Supporters of ratifying the Constitution — led by Alexander Hamilton, James Madison, and John Jay, who jointly wrote the Federalist Papers under the pen name "Publius." Argued a large, diverse republic could actually CONTROL the dangers of faction (Federalist No. 10) better than a small one, and that checks and balances would prevent tyranny.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Anti-Federalists',
      content:
        'Opponents of ratifying the Constitution — led by figures like Patrick Henry and George Mason, represented in essays like "Brutus No. 1." Argued the new government was too powerful and too distant from the people, threatened state sovereignty, and — most damagingly — contained NO Bill of Rights protecting individual liberties.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'framework',
      title: 'the Federalist No. 10 vs. Brutus No. 1 disagreement',
      content:
        'Both sides agree that a republic\'s SIZE matters to its survival — they draw opposite conclusions. Madison (Federalist No. 10) argues a large, diverse republic controls the danger of faction because so many competing interests make it hard for any one faction to dominate. Brutus argues from history that no free republic has ever governed a territory as large as the proposed United States without sliding into tyranny.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'event',
      title: 'ratification plus a promise',
      content:
        'The Constitution secured the required nine of thirteen state ratifications by 1788, but several key states (including Massachusetts and Virginia) ratified only after Federalists promised to add a bill of rights once the new government was in place.',
    },
    {
      loId: 'apush.constitution-ratification',
      kind: 'definition',
      title: 'Bill of Rights',
      content:
        'The first ten amendments to the Constitution, ratified in 1791 — four years after the original 1787 Constitution. Drafted by James Madison as a direct political concession to Anti-Federalist objections about missing individual-liberty protections; NOT part of the original document signed at the Convention.',
    },
  ],
  methods: [
    {
      title: 'Compare two competing ratification-debate documents',
      when_to_use:
        'Use when asked to compare a Federalist and an Anti-Federalist source (e.g. Federalist No. 10 and Brutus No. 1) and identify exactly where they agree and disagree.',
      steps: [
        'SOURCE BOTH — note both are 1787 ratification-debate essays, often directly answering each other in competing newspapers.',
        "IDENTIFY EACH WRITER'S CLAIM SEPARATELY before comparing them.",
        'FIND THE SHARED PREMISE — what do both sides agree matters, even though they reach opposite conclusions from it?',
        'LOCATE THE EXACT POINT OF DISAGREEMENT — state precisely where the two arguments diverge, not just that they "disagree."',
        'CONNECT TO THE CONVENTION\'S DESIGN CHOICES — explain how a specific constitutional feature (checks and balances, federalism, the Bill of Rights) responds to the disagreement.',
      ],
      example: {
        problem:
          'Compare Federalist No. 10 (Madison: a large republic controls "faction") and Brutus No. 1 (a free republic cannot survive over so large a territory).',
        solution:
          "Both agree size is decisive for a republic's survival. Madison says large size is the SOLUTION to faction — more diversity of interests prevents any one faction from taking over. Brutus says large size is the PROBLEM — distance and diversity make free government unaccountable and prone to tyranny. The Convention's checks and balances partly answer Brutus's fear; the promised Bill of Rights was the direct concession that helped secure ratification without resolving the disagreement philosophically.",
      },
      relatedLoIds: ['apush.constitution-ratification'],
    },
  ],
  pointers: [
    { content: 'The Bill of Rights was NOT part of the original 1787 Constitution — it was ratified in 1791 as a promised concession to Anti-Federalists.', kind: 'trap' },
    { content: 'The Great Compromise created a BICAMERAL Congress — House by population, Senate equal per state. Don\'t confuse it with the Three-Fifths Compromise.', kind: 'tip' },
    { content: 'Only the international-slave-trade protection (1808) had a 20-year sunset; the export-tax ban is permanent — know which Commerce Compromise clause is which.', kind: 'trap' },
    { content: 'Federalists ≠ pro-monarchy. They favored a strong but checked national government, not unlimited central power.', kind: 'tip' },
    { content: 'When citing Federalist No. 10, always name Madison specifically — the exam expects the author, not just "the Federalists."', kind: 'tip' },
  ],
};
