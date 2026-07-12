/**
 * AP World History: Modern — CED Unit 5.2: The Atlantic Revolutions.
 *
 * Unit-5 fan-out content plan, second in the within-unit chain
 * (enlightenment → atlantic-revolutions → nationalism-unification →
 * industrial-revolution → industrial-society). concept = the historical
 * argument (how did Enlightenment universalism and specific local
 * grievances combine and diverge across the American, French, Haitian, and
 * Latin American revolutions, 1776-1826?); worked_example = a compare-two-
 * documents exercise; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor texts: Declaration of the Rights of Man and of the Citizen (1789,
 * Avalon trans.) — evelyn.passage.apworld-rights-of-man.v1, wired at the
 * concept segment; Simón Bolívar's Jamaica Letter (1815, quoted here in
 * Guillermo A. Sherwell's 1921 PD English rendering, PER THAT SEED'S OWN
 * DOC COMMENT — never presented as Bolívar's original-language text) —
 * evelyn.passage.apworld-bolivar-jamaica.v1, quoted directly in the worked
 * example's problem text (SegmentWorkedExample has no passageId field).
 * Quotes ONLY each seeded excerpt, ellipses preserved exactly as seeded.
 * Measured, exam-neutral tone throughout, per Global Constraints.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_ATLANTIC_REVOLUTIONS: LessonPlan = {
  id: 'evelyn.ap.apworld.atlantic-revolutions.v1',
  title: 'U5.2 The Atlantic Revolutions',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.atlantic-revolutions-era',
      description:
        'Explain the sequence, mutual influences, and divergences among the American, French, Haitian, and Latin American revolutions (1776-1826), including the distinctive role of enslaved self-liberation in Haiti and creole leadership in Latin America.',
      standard: 'AP-APWORLD-5.2',
    },
  ],
  prerequisites: ['apworld.enlightenment', 'apworld.atlantic-slave-trade'],
  followUps: ['apworld.nationalism-unification'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Atlantic Revolutions as a connected but divergent chain, each redrawing the line of who counted as equal differently.',
      script:
        "Between 1776 and 1826, four major revolutions swept the Atlantic world, each one influenced by the last: American independence in 1776, the French Revolution in 1789, the Haitian Revolution running from 1791 to 1804, and a wave of Latin American independence movements from 1808 to 1826. It's tempting to see these as one continuous unfolding of the same Enlightenment principle — liberty, equality, natural rights. Look closely at any two of them and a sharper pattern shows up: each revolution drew the line of who actually got to be free and equal in a different place. The French Declaration proclaimed universal rights in the abstract; Haiti was the only one of the four where enslaved people themselves seized and kept that freedom by force; Latin American independence was led overwhelmingly by American-born creole elites with their own specific colonial grievances, not by a mass movement demanding universal rights for everyone. This unit is about tracing both the connections and the divergences.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-atlantic-revolutions',
      kind: 'concept',
      goal: 'Explain the sequence and mutual influence of the American, French, Haitian, and Latin American revolutions, and the distinct exclusions/grievances shaping each.',
      keyIdeas: [
        'THE AMERICAN REVOLUTION (1776) AS FIRST LINK: the thirteen British colonies declared independence in 1776, justifying the break in the language of natural rights and government by consent — a direct application of Lockean social-contract theory that circulated back across the Atlantic and helped inspire French reformers.',
        'THE FRENCH REVOLUTION (FROM 1789): a fiscal crisis forced Louis XVI to convene the Estates-General in 1789; the Third Estate broke away to form the National Assembly, which — after the storming of the Bastille (July 14, 1789) — issued the Declaration of the Rights of Man and of the Citizen in August 1789, proclaiming natural, universal rights (liberty, property, security, resistance to oppression) and national sovereignty in place of divine-right monarchy.',
        "THE HAITIAN REVOLUTION (1791-1804) AND ENSLAVED SELF-LIBERATION: enslaved people in the French colony of Saint-Domingue rose in a massive 1791 revolt and, under leaders including Toussaint L'Ouverture, fought French, British, and Spanish forces over more than a decade. Haiti declared independence in 1804 under Jean-Jacques Dessalines — the only revolution of the four in which enslaved people themselves achieved permanent abolition and independence by their own sustained armed struggle, not through a colonial power's own reform. Haiti's independence was met with diplomatic and economic isolation by France, the United States, and other slaveholding powers, which refused recognition for years and, in France's case, later extracted a crippling indemnity (1825) as the price of recognition.",
        "LATIN AMERICAN INDEPENDENCE (1808-1826) AND CREOLE LEADERSHIP: Napoleon's 1808 invasion of Spain, which deposed the Spanish king, triggered a crisis of political legitimacy across Spanish America. Independence movements, led chiefly by American-born Spanish colonists (creoles) such as Simón Bolívar in the north and José de San Martín in the south, achieved independence for most of Spanish America by 1826. Creole leaders' central grievance, as Bolívar's own writing shows, was exclusion from high colonial office (viceregal, ecclesiastical, diplomatic, administrative posts reserved for peninsular-born Spaniards) — not, in the first instance, the universal-rights language of the French Declaration.",
        'A CHAIN OF INFLUENCE WITH SHARP DIVERGENCES: each revolution influenced the next (American precedent circulating to France; French revolutionary upheaval destabilizing Saint-Domingue; the crisis of Spanish royal authority in 1808 opening space for Latin American independence) — but each also drew its own, different line around who counted as free and equal: property qualifications limited who could vote in the American and French cases; slavery persisted in the United States and, initially, in French colonies outside Haiti; women were excluded from full political rights nearly everywhere; and Latin American independence, despite Bolívar\'s stated aspirations, largely preserved existing racial and social hierarchies under new creole-led governments.',
      ],
      vocabulary: [
        {
          term: 'Estates-General',
          definition:
            "the French assembly of the three estates (clergy, nobility, commoners) convened by Louis XVI in 1789 amid fiscal crisis; the Third Estate's breakaway formed the National Assembly.",
        },
        {
          term: 'creole',
          definition:
            'in the Spanish American colonial context, a person of Spanish descent born in the Americas, generally excluded from the highest colonial offices reserved for peninsula-born Spaniards, and the social group that led most Latin American independence movements.',
        },
        {
          term: "Haitian self-liberation",
          definition:
            "the process by which enslaved people in Saint-Domingue rose in 1791, fought a sustained war against multiple colonial powers, and achieved abolition and independence (1804) through their own armed struggle rather than through a colonial power's reform.",
        },
      ],
      passageId: 'evelyn.passage.apworld-rights-of-man.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rights-of-man-vs-bolivar',
      kind: 'worked_example',
      problem:
        'Compare these two excerpts. First, from the Declaration of the Rights of Man and of the Citizen (1789): "1. Men are born and remain free and equal in rights. Social distinctions may be founded only upon the general good. 2. The aim of all political association is the preservation of the natural and imprescriptible rights of man. These rights are liberty, property, security, and resistance to oppression." Second, from Simón Bolívar\'s Jamaica Letter (1815, in Guillermo A. Sherwell\'s 1921 English rendering): "We were never viceroys or governors except by very extraordinary reasons; archbishops and bishops, seldom; ambassadors, never; military men, only as subordinates; nobles, without privileges; lastly, we were neither magistrates nor financiers, and hardly merchants. All this we had to accept in direct opposition to our institutions." What kind of claim is each document making, and how do they differ?',
      steps: [
        'SOURCE EACH DOCUMENT. The French Declaration was issued by the National Assembly in August 1789, an official state document proclaiming universal principles for all citizens of the new French nation. Bolívar\'s Jamaica Letter was a private 1815 letter to a Jamaican correspondent, written in exile after early independence setbacks, arguing the case for Spanish American independence — quoted here in Sherwell\'s 1921 PD English rendering, not Bolívar\'s Spanish original.',
        'IDENTIFY THE FRENCH DECLARATION\'S KIND OF CLAIM. Its claim is abstract and universal: it asserts that ALL men are "born and remain free and equal in rights," and names specific natural rights (liberty, property, security, resistance to oppression) as belonging to people as such, not to any one national or colonial group.',
        "IDENTIFY BOLÍVAR'S KIND OF CLAIM. Bolívar's claim is concrete and specific to colonial administration: he catalogs the offices Spanish Americans were shut out of under colonial rule — viceroy, governor, archbishop, ambassador, military command, magistrate, financier — arguing colonial exclusion from office, not an abstract deprivation of natural rights in the French Declaration's sense.",
        'STATE THE STRUCTURAL DIFFERENCE. The French Declaration argues from universal principle down to specific rights; Bolívar argues from specific, lived colonial grievances (exclusion from office) up toward a claim for self-government. Both invoke a form of injustice, but the French document\'s register is philosophical and universal while Bolívar\'s is administrative and particular to the creole colonial experience.',
        "CONNECT TO THE BROADER PATTERN. This illustrates why the Atlantic Revolutions cannot be read as one uniform application of French-style universalism: Bolívar's creole-led movement drew on a different, locally rooted set of grievances even as it shared the broader revolutionary-era conviction that the existing political order lacked legitimacy.",
      ],
      answer:
        "The French Declaration makes an abstract, universal claim — that ALL men are \"born and remain free and equal in rights,\" entitled to specific natural rights (liberty, property, security, resistance to oppression) simply as people, independent of any particular colonial or national context. Bolívar's Jamaica Letter, by contrast, makes a concrete, administrative claim rooted in the specific colonial experience of Spanish American creoles: he catalogs the high offices (viceroy, governor, archbishop, ambassador, military command, magistrate, financier) that Spanish Americans were excluded from under colonial rule. The French document argues from universal principle; Bolívar argues from specific, lived exclusion toward a claim for self-government. Reading them side by side shows why the Atlantic Revolutions were not one uniform application of French-style universalism — Bolívar's creole-led movement was grounded in its own distinct grievances even while sharing the era's broader conviction that existing political authority had lost its legitimacy.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Explain ONE way the American Revolution's principles influenced the French Revolution. (b) Explain ONE way the Haitian Revolution differed from the French Revolution in terms of who achieved freedom and how. (c) Explain ONE way creole leadership shaped the Latin American independence movements.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way American revolutionary principles (natural rights, government by consent) influenced French reformers or revolutionary rhetoric. No credit for a vague or unsupported claim.',
            modelResponse:
              "The American Revolution's success in justifying independence through natural-rights and consent-of-the-governed language circulated back across the Atlantic and helped inspire French reformers to challenge the legitimacy of Bourbon absolute monarchy on similar grounds.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate difference — e.g. Haiti (1791-1804) was the only one of the four revolutions in which enslaved people themselves achieved abolition and independence through sustained armed struggle, versus the French Declaration\'s proclamation of universal rights without ending slavery in most French colonies. No credit for a vague or unsupported claim.',
            modelResponse:
              'Unlike the French Revolution, which proclaimed universal rights in 1789 without ending slavery in most French colonies, the Haitian Revolution (1791-1804) was the one Atlantic revolution in which enslaved people themselves, under leaders including Toussaint L\'Ouverture, achieved permanent abolition and independence through their own sustained armed struggle.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way creole leadership shaped Latin American independence — e.g. creoles' exclusion from high colonial office as a central grievance, or creole-led governments largely preserving existing racial/social hierarchies after independence. No credit for a vague or unconnected claim.",
            modelResponse:
              "Latin American independence was led chiefly by American-born creoles such as Simón Bolívar, whose central grievance, as his Jamaica Letter shows, was exclusion from high colonial offices (viceregal, ecclesiastical, military) reserved for peninsula-born Spaniards — and creole-led governments that emerged after independence largely preserved existing racial and social hierarchies rather than overturning them.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-equal-rights-everywhere',
      kind: 'misconception_check',
      question:
        'True or false: the Atlantic Revolutions all extended rights and citizenship equally to everyone within their societies.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating shared revolutionary-era rhetoric (liberty, equality, natural rights) as evidence that all four revolutions actually delivered equal rights in practice, rather than recognizing that each drew its own, different line around who was included.",
          correctsTo:
            "FALSE. Each of the four revolutions drew a different line around who counted as free and equal. The American and French revolutions limited full political participation by property (and, in the U.S. case, preserved slavery); the French Declaration's universal language did not end slavery in most French colonies; women were excluded from full political rights in nearly every case; Haiti was the sole revolution in which enslaved people achieved abolition and independence by their own struggle; and Latin American independence, despite Bolívar's own stated aspirations for American greatness and freedom, largely preserved existing racial and social hierarchies under new creole-led governments rather than extending equal rights broadly.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "American independence (1776) supplied natural-rights/consent language that helped inspire French reformers.",
        'The French Revolution (from 1789: Estates-General → National Assembly → Bastille, July 14 → Declaration of the Rights of Man, August) proclaimed universal natural rights and national sovereignty.',
        "The Haitian Revolution (1791-1804), under leaders including Toussaint L'Ouverture, was the only one of the four in which enslaved people achieved abolition and independence through their own sustained armed struggle — and Haiti faced diplomatic/economic isolation afterward.",
        "Latin American independence (1808-1826), sparked by Napoleon's 1808 invasion of Spain, was led chiefly by creoles (Bolívar, San Martín) whose central grievance was exclusion from colonial office, not abstract universal-rights language.",
        'Each revolution drew a different line around who counted as free and equal — by property, race, and gender — rather than extending rights uniformly.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2',
    cedTitle: 'The Atlantic Revolutions',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-rights-of-man.v1',
        chapter: '1789',
        note: 'Declaration of the Rights of Man and of the Citizen — anchor document for French Revolution universalist rights language.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-bolivar-jamaica.v1',
        chapter: '1815',
        note: "Simón Bolívar, Jamaica Letter (Sherwell's 1921 PD English rendering) — creole-grievance counterpoint to French universalism, quoted directly in the worked example.",
      },
    ],
  },
};
