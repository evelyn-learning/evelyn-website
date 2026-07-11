/**
 * AP US Government & Politics — CED Unit 1.4-1.5: Challenges of the
 * Articles of Confederation & Ratification of the Constitution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.constitution-ratification.v1`. Covers the Articles of
 * Confederation's structural weaknesses and Shays's Rebellion as catalyst,
 * the Constitutional Convention's core compromises (Great/Connecticut,
 * Three-Fifths, Electoral College), and the Federalist/Anti-Federalist
 * ratification debate anchored on Brutus No. 1 and Federalist No. 10.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_CONSTITUTION_RATIFICATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.constitution-ratification.v1',
  course: 'AP US Government & Politics',
  cedUnit: 1,
  cedTopic: '1.4-1.5',
  cedTitle: 'Challenges of the Articles of Confederation & Ratification of the Constitution',
  planId: 'evelyn.ap.apgov.constitution-ratification.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.constitution-ratification.v1' }],
  theory: [
    {
      loId: 'apgov.constitution-ratification',
      kind: 'cause',
      title: "the Articles' structural weaknesses set up the Convention",
      content:
        'The Articles of Confederation (ratified 1781) created a deliberately weak national government: no power to levy taxes directly (only to REQUEST money from states via "requisition," which states often ignored), no separate executive branch, no national judiciary, and amendment required the UNANIMOUS consent of all 13 states — making reform nearly impossible even when most states agreed change was needed.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'event',
      title: "Shays's Rebellion (1786-87)",
      content:
        'Debt-burdened Massachusetts farmers, many Revolutionary War veterans facing land foreclosures and high state taxes, took up arms and shut down local courts. The Confederation Congress had NO national army to respond — Massachusetts had to raise its own private militia. This exposed that the national government could not guarantee order even within a single state, and became the specific crisis that convinced many leaders a stronger national government was necessary.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'event',
      title: 'the Constitutional Convention (Philadelphia, summer 1787)',
      content:
        'Delegates convened, officially, to REVISE the Articles of Confederation. Instead, meeting behind closed doors, they scrapped the Articles entirely and drafted an altogether new frame of government built around federalism, separation of powers, and checks and balances.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'definition',
      title: 'Great (Connecticut) Compromise',
      content:
        'Resolved the dispute between large states (wanting representation by population) and small states (wanting equal representation) by creating a BICAMERAL Congress: the House of Representatives apportioned by population, and the Senate with equal representation — two seats per state.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'definition',
      title: 'Three-Fifths Compromise',
      content:
        "Resolved a dispute between Southern states (wanting enslaved people counted toward population for greater representation, without extending them rights) and Northern states (objecting to counting enslaved people for representation while excluding them from taxation) by counting three-fifths of a state's enslaved population toward BOTH representation and direct taxation.",
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'definition',
      title: 'Electoral College Compromise',
      content:
        'Resolved a dispute over choosing the President between letting Congress select the President directly (risking executive dependence on the legislature) and a direct national popular vote (distrusted for a large, dispersed electorate). The compromise: each state appoints electors equal to its combined House-plus-Senate delegation, and those electors formally choose the President — insulated from both alternatives.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'concept',
      title: 'Federalists vs. Anti-Federalists',
      content:
        'Federalists (Hamilton, Madison, Jay — jointly "Publius" in the Federalist Papers) supported ratification, arguing a large, diverse republic could actually control the dangers of faction better than a small one, and that checks and balances would prevent tyranny. Anti-Federalists (Patrick Henry, George Mason, and the essayist "Brutus") opposed ratification, arguing the new national government would be too powerful and too distant from the people, and — most damagingly — that the Constitution as drafted contained no bill of rights.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'event',
      title: "Brutus No. 1's fear: republic size",
      content:
        'The seeded excerpt argues from history: "no example of a free republic, any thing like the extent of the United States" — free governments (Greek, Roman) that expanded over large territories turned tyrannical. Brutus\'s fear: a republic as large as the proposed United States cannot stay a genuine, accountable self-government.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'trap',
      title: "the Federalist No. 10 excerpt is a definition only",
      content:
        'The seeded Federalist No. 10 excerpt is ONLY Madison\'s definition of a faction — a group, majority or minority, united by an interest "adverse to the rights of other citizens, or to the permanent and aggregate interests of the community." It does NOT contain Madison\'s separate, more famous "a large republic controls the mischiefs of faction" argument, which appears later in the same essay outside this excerpt. Credit only the definition to the excerpt itself.',
    },
    {
      loId: 'apgov.constitution-ratification',
      kind: 'framework',
      title: 'resolution: ratification plus a promise',
      content:
        'The Constitution secured the required nine of thirteen state ratifications by 1788, but several key states ratified only after Federalists promised to add a bill of rights — delivered by Madison as the first ten amendments in 1791. Ratifying the Constitution did NOT mean surrendering all state power: it created a federal system in which national and state governments each hold real, distinct authority.',
    },
  ],
  methods: [
    {
      title: 'Compare a Federalist and an Anti-Federalist excerpt on the same question',
      when_to_use:
        'Use this whenever a prompt pairs two ratification-era excerpts (e.g. Brutus No. 1 and Federalist No. 10) arguing opposite sides of the same underlying question.',
      steps: [
        'SOURCE BOTH. Note the year (1787-88), the pen name or attribution, and which side of ratification each writer argues.',
        "IDENTIFY EACH WRITER'S CLAIM using only what the excerpt actually says — don't import a famous argument from the same essay that isn't in the quoted text.",
        'NAME WHAT IS GENUINELY ABSENT from an excerpt if a well-known part of the full document is not included (e.g. Federalist No. 10\'s "large republic controls faction" argument is not in the definition-only excerpt) — flag it explicitly rather than silently assuming it.',
        "CONNECT BOTH TO THE SAME UNDERLYING DISPUTE — the two writers usually agree on what's AT STAKE (e.g. republic size) even while reaching opposite conclusions about it.",
        "LINK TO THE CONVENTION'S ACTUAL DESIGN CHOICES (the compromises) or to the eventual resolution (ratification plus the promised Bill of Rights) to show how the political disagreement was resolved even if the philosophical one wasn't.",
      ],
      example: {
        problem:
          'Brutus No. 1 argues no free republic has ever governed successfully at the size of the proposed United States. What does a Federalist supporter say in response, using Madison\'s broader (non-excerpt) Federalist No. 10 reasoning?',
        solution:
          'A Federalist would argue the opposite conclusion from the same premise: rather than being fatal to free government, a large, diverse republic actually controls the danger of faction BETTER than a small one, because so many competing interests make it difficult for any single faction to seize control of the whole government — turning Brutus\'s fear of size into an argument that size is protective.',
      },
      relatedLoIds: ['apgov.constitution-ratification'],
    },
  ],
  pointers: [
    { content: 'The Great Compromise created a BICAMERAL Congress (House by population, Senate equal per state) — naming only one chamber earns no credit.', kind: 'trap' },
    { content: "The Three-Fifths Compromise counted enslaved people toward BOTH representation and direct taxation — don't name only one.", kind: 'trap' },
    { content: 'The seeded Federalist No. 10 excerpt only DEFINES faction. Don\'t attribute the "large republic controls faction" argument to this excerpt — it is unquoted, from later in the same essay.', kind: 'trap' },
    { content: 'The Electoral College Compromise deliberately avoids BOTH alternatives — Congress choosing the President AND a pure national popular vote. State both when explaining "why."', kind: 'tip' },
    { content: "Ratification succeeded only after Federalists promised a bill of rights (delivered 1791) — don't describe ratification as uncontested or immediate.", kind: 'tip' },
  ],
};
