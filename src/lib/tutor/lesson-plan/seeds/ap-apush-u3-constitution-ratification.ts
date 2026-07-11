/**
 * AP US History — CED Unit 3.10: The Constitutional Convention and
 * Ratification Debate.
 *
 * Period-3 Vertical Slice content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Covers the Philadelphia Convention's core compromises (Great/Connecticut
 * Compromise, Three-Fifths Compromise, Commerce Compromise) and the
 * Federalist/Anti-Federalist ratification debate, resolved by the promise
 * of a Bill of Rights.
 *
 * DOCUMENT-BASED try_yourself: this is the one Period-3 plan where the
 * try_yourself SAQ explicitly instructs the student to use a stimulus
 * (Federalist No. 10), so — unlike every other plan in this slice — its
 * passageId is intentionally SET. See the worked_example for a second,
 * paired document comparison (Federalist No. 10 vs. Brutus No. 1); that
 * segment type has no passageId field, so both quotes are embedded
 * directly in `problem`.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_CONSTITUTION_RATIFICATION: LessonPlan = {
  id: 'evelyn.ap.apush.constitution-ratification.v1',
  title: 'U3.10 The Constitutional Convention and Ratification Debate',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.constitution-ratification',
      description:
        "Explain the key compromises of the Constitutional Convention (Great Compromise, Three-Fifths Compromise, Commerce Compromise) and the Federalist / Anti-Federalist debate over ratification, including the role of the promised Bill of Rights.",
      standard: 'AP-APUSH-3.10',
    },
  ],
  prerequisites: ['apush.articles-of-confederation'],
  followUps: ['apush.new-republic'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Convention as delegates secretly exceeding their mandate, and ratification as a real, close political fight — not a formality.',
      script:
        "Here's something that surprises a lot of students: the 55 delegates who gathered in Philadelphia in the summer of 1787 were not sent there to write a new constitution. Their instructions were to REVISE the Articles of Confederation. Instead, meeting behind closed doors and sworn to secrecy, they scrapped the Articles entirely and wrote something new — a much stronger national government. Then came the hard part: convincing nine of thirteen skeptical states to actually ratify it, against serious, well-organized opposition that thought this new government looked less like a fix and more like a new king in disguise. Today we're tracing the deals that made the Constitution possible, and the fight over whether it should be ratified at all.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-convention-and-debate',
      kind: 'concept',
      goal: 'Explain the Convention\'s core compromises and the Federalist/Anti-Federalist ratification debate.',
      keyIdeas: [
        "FROM REVISION TO REPLACEMENT: the Constitutional Convention (Philadelphia, summer 1787) was called to revise the Articles of Confederation. Delegates instead drafted an entirely new frame of government with a stronger national structure — separation of powers into legislative, executive, and judicial branches, checks and balances among them, and federalism (power divided between national and state governments) — directly addressing the Articles' missing taxing power, missing executive/judiciary, and missing national defense capacity.",
        "THE GREAT (CONNECTICUT) COMPROMISE: large and small states disagreed over how Congress should be structured — large states wanted representation by population, small states wanted equal representation regardless of size. The compromise created a BICAMERAL Congress: the House of Representatives apportioned by population, and the Senate with equal representation (two seats per state), resolving the large-state/small-state deadlock.",
        'THE THREE-FIFTHS COMPROMISE: Southern states wanted enslaved people counted toward population (increasing their House representation and Electoral College votes) without extending them any rights; Northern states objected to counting enslaved people at all for representation while excluding them for taxation purposes. The compromise counted three-fifths of a state\'s enslaved population for BOTH representation and direct taxation — a bargain that entrenched slavery\'s political power in the new national government from its very founding.',
        "THE COMMERCE COMPROMISE: Congress was granted power to regulate interstate and foreign commerce (fixing an Articles weakness), but in exchange Congress was barred from taxing exports and from interfering with the international slave trade for twenty years (until 1808) — another compromise that protected slavery's economic base to secure Southern support for the stronger national government.",
        'FEDERALISTS SUPPORTED RATIFICATION: led by figures like Alexander Hamilton, James Madison, and John Jay (who jointly wrote the Federalist Papers under the pen name "Publius"), Federalists argued the new government was necessary and safe — that a large, diverse republic could actually CONTROL the dangers of faction (Federalist No. 10) better than a small one could, and that checks and balances would prevent any branch from becoming tyrannical.',
        "ANTI-FEDERALISTS OPPOSED RATIFICATION: led by figures like Patrick Henry and George Mason, and represented in essays like \"Brutus No. 1,\" Anti-Federalists argued the new government was too powerful and too distant from the people, that it threatened state sovereignty, and — most damagingly — that it contained NO Bill of Rights explicitly protecting individual liberties like freedom of speech, religion, and the press from federal overreach.",
        "RESOLUTION: RATIFICATION PLUS A PROMISE. The Constitution secured the required nine of thirteen state ratifications by 1788, but several key states (including Massachusetts and Virginia) ratified only after Federalists promised to add a bill of rights once the new government was in place. Madison delivered on that promise, and the first ten amendments — the Bill of Rights — were ratified in 1791, directly answering the Anti-Federalists' core objection without unraveling the new structure.",
      ],
      vocabulary: [
        {
          term: 'Great (Connecticut) Compromise',
          definition:
            'the Convention agreement creating a bicameral Congress — House of Representatives by population, Senate with equal representation per state — resolving the large-state/small-state dispute.',
        },
        {
          term: 'Three-Fifths Compromise',
          definition:
            "the Convention agreement counting three-fifths of a state's enslaved population toward both representation and direct taxation, entrenching slavery's political power in the new government.",
        },
        {
          term: 'Federalists',
          definition:
            'supporters of ratifying the Constitution (e.g. Hamilton, Madison, Jay), who argued a stronger national government with checks and balances was necessary and safe.',
        },
        {
          term: 'Anti-Federalists',
          definition:
            'opponents of ratifying the Constitution (e.g. Patrick Henry, George Mason, "Brutus"), who feared excessive centralized power and objected to the absence of a bill of rights.',
        },
        {
          term: 'Bill of Rights',
          definition:
            "the first ten amendments to the Constitution (ratified 1791), promised by Federalists during the ratification debate to address Anti-Federalist objections about missing individual-rights protections.",
        },
      ],
      passageId: 'evelyn.passage.apush-federalist-10.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-federalist-brutus',
      kind: 'worked_example',
      problem:
        'Compare these two excerpts from the ratification debate. Federalist No. 10 (James Madison, 1787): "By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community." Brutus No. 1 (Anti-Federalist, 1787): "History furnishes no example of a free republic, any thing like the extent of the United States... Both of these, it is true, in process of time, extended their conquests over large territories of country; and the consequence was, that their governments were changed from that of free governments to those of the most tyrannical that ever existed in the world." What is each side arguing, and where exactly do they disagree?',
      steps: [
        'SOURCE BOTH. Both essays were published in 1787, during the ratification debate, in competing New York newspapers — Federalist No. 10 by Madison writing as "Publius" to defend the proposed Constitution; Brutus No. 1 by an Anti-Federalist author (attributed to Robert Yates) to oppose it. They are directly answering each other.',
        "IDENTIFY MADISON'S CLAIM. Madison defines \"faction\" as any group — majority or minority — pursuing an interest adverse to others' rights or the common good. His larger argument (not fully quoted here but implied) is that a LARGE, diverse republic actually controls factions better than a small one, because so many competing interests make it hard for any single faction to dominate the whole government.",
        "IDENTIFY BRUTUS'S CLAIM. Brutus argues from history: no free republic has ever successfully governed a territory as large as the proposed United States. When free governments (Greek, Roman) DID expand over large territories, they became tyrannical, not because the people changed, but because a government spanning such distance and diversity cannot stay accountable to its citizens.",
        "LOCATE THE EXACT DISAGREEMENT. Both writers agree that SIZE matters to a republic's survival — they draw the OPPOSITE conclusion from it. Madison says large size is the SOLUTION to faction (more diversity of interests prevents any one from taking over). Brutus says large size is the PROBLEM (distance and diversity make free government impossible to sustain, and history proves it).",
        'CONNECT TO THE CONVENTION\'S DESIGN CHOICES. The structural safeguards from the concept — checks and balances, federalism, a bicameral Congress — are partly the Federalists\' answer to Brutus\'s specific fear: if a large republic is naturally prone to sliding toward tyranny, then build MULTIPLE, deliberately competing centers of power (branches, states vs. federal) so no single faction or branch can dominate, even in a large, diverse country.',
        'STATE THE LINK TO THE COURSE THESIS. This single document pair captures the entire ratification debate in miniature: is a large, powerful national government the CURE for factionalism and disorder (Federalist), or its CAUSE (Anti-Federalist)? The eventual compromise — ratification plus a promised Bill of Rights — did not resolve this disagreement philosophically; it resolved it politically, by adding the individual-rights safeguard Anti-Federalists most wanted without abandoning the structure Federalists had built.',
      ],
      answer:
        'Madison (Federalist No. 10) argues that a large, diverse republic actually controls the danger of faction better than a small one, because so many competing interests make it hard for any single faction to seize control of the whole government. Brutus (Anti-Federalist) argues from historical example that free republics have never successfully governed territories as large as the proposed United States — when they tried, they slid into tyranny — because distance and diversity make a government unaccountable to its citizens. Both agree size is decisive for a republic\'s survival; they draw opposite conclusions from it. The Convention\'s structural safeguards (checks and balances, federalism, bicameralism) are partly a Federalist answer to Brutus\'s fear, while the promised Bill of Rights was the direct concession that helped secure ratification despite the disagreement never being fully resolved.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq-federalist10',
      kind: 'try_yourself',
      problem:
        "SAQ practice. Using the excerpt from Federalist No. 10 below, and your knowledge of the ratification debate: \"By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community.\" (a) Briefly describe Madison's argument in this excerpt about the danger a faction poses. (b) Briefly explain how ONE specific feature of the Constitution (e.g. federalism, checks and balances, the size/structure of the new republic) reflects Madison's reasoning in practice. (c) Briefly explain ONE specific objection Anti-Federalists raised to arguments like Madison's.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-federalist-10.v1',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly describes Madison\'s definition/danger of faction from the excerpt — a group (majority or minority) united by shared passion or interest adverse to others\' rights or the common good. No credit for a response that ignores the excerpt or restates only a generic idea of "disagreement."',
            modelResponse:
              "In the excerpt, Madison defines a faction as any group of citizens — whether a majority or a minority — united by a shared interest or passion that works against the rights of others or against the broader public good, making faction a threat regardless of whether it represents few people or many.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific constitutional feature (federalism, separation of powers/checks and balances, bicameral Congress, the large-republic structure itself) and connects it clearly to controlling faction, consistent with Madison's reasoning. No credit for a feature with no clear connection to controlling faction.",
            modelResponse:
              "The Constitution's separation of powers and checks and balances put Madison's reasoning into practice: by dividing power across branches (and between federal and state governments) that can check one another, no single faction — even a majority faction — can easily seize control of the entire government at once, which is exactly the safeguard against faction Madison argues a large, structurally divided republic provides.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate Anti-Federalist objection to Federalist arguments like Madison\'s — e.g. Brutus\'s argument that free republics cannot survive over so large a territory, or the broader Anti-Federalist objection that the Constitution lacked a bill of rights protecting individual liberties. No credit for a vague or unsupported objection.',
            modelResponse:
              'Anti-Federalists like the author of Brutus No. 1 objected that history showed no free republic had ever successfully governed a territory as large as the proposed United States — arguing that distance and diversity would make the new government unaccountable and prone to becoming tyrannical, the opposite of what Madison claimed a large republic would achieve.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-bill-of-rights-original',
      kind: 'misconception_check',
      question:
        'True or false: the Bill of Rights was part of the original Constitution drafted at the Philadelphia Convention in 1787.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Collapsing the Constitution and the Bill of Rights into a single founding moment, when they were actually separated by four years and a real political fight.",
          correctsTo:
            "FALSE. The Constitution as drafted and signed at the Philadelphia Convention in September 1787 contained NO bill of rights — this omission was Anti-Federalists' single most damaging objection during the ratification debate, since it left no explicit textual protection for individual liberties like speech, religion, and the press against the new, stronger federal government. Federalists secured ratification in several key states only by PROMISING to add such protections once the government was established. James Madison — ironically, a leading Federalist — then drafted the amendments himself, and the Bill of Rights (the first ten amendments) was ratified in 1791, four years after the original Constitution and as a direct political concession to Anti-Federalist concerns, not as part of the founding document itself.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Convention was called to revise the Articles but instead drafted an entirely new government with separation of powers, checks and balances, and federalism.",
        "The Great Compromise created a bicameral Congress (House by population, Senate equal); the Three-Fifths and Commerce Compromises both entrenched slavery's protection to secure Southern support.",
        "Federalists (Hamilton, Madison, Jay) argued a large republic controls faction and needs checks and balances to prevent tyranny; Anti-Federalists (Henry, Mason, Brutus) feared excessive centralized power and the missing bill of rights.",
        "Ratification succeeded (9/13 states, 1788) only after Federalists promised a bill of rights — delivered by Madison as the first ten amendments in 1791, NOT part of the original 1787 Constitution.",
        'Madison and Brutus both agreed a republic\'s size matters to its survival — they drew opposite conclusions about whether large size helps or hurts.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.10',
    cedTitle: 'The Constitutional Convention and Ratification Debate',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-federalist-10.v1',
        chapter: '1787',
        note: 'Federalist No. 10 — Madison\'s Federalist argument that a large republic controls the "mischiefs of faction."',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1 — the Anti-Federalist argument that free republics cannot survive over so large a territory; paired with Federalist No. 10 in the worked example.',
      },
    ],
  },
};
