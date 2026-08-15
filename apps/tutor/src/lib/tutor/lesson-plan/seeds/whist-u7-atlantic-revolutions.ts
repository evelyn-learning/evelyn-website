/**
 * World History — Revolutions & Enlightenment: The Atlantic Revolutions.
 *
 * One wave, not four stories: Enlightenment ideas plus war debt light the
 * fuse in British America, the fire jumps to France, the enslaved of
 * Saint-Domingue take the words literally, and Spanish America breaks free
 * when Napoleon knocks out Madrid. The through-line students carry forward:
 * every revolution here writes "all men" and then argues about who counts.
 * Salvaged factual spine from the legacy world-history Atlantic-revolutions
 * seed, reframed subject-first. C3 D2.His.1.9-12, D2.His.14.9-12,
 * D2.Civ.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U7_ATLANTIC_REVOLUTIONS: LessonPlan = {
  id: 'evelyn.hs.whist.atlantic-revolutions.v1',
  title: 'The Atlantic Revolutions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.atlantic-revolutions',
      standard: 'WHIST-7.4',
      description:
        'Trace how Enlightenment ideas and imperial war debts touched off a connected wave of revolutions in the American colonies, France, Haiti, and Latin America (1775-1825), and evaluate how each revolution decided who its universal language of rights actually included (C3 D2.His.1.9-12, D2.His.14.9-12, D2.Civ.14.9-12).',
    },
  ],
  prerequisites: ['whist.enlightenment'],
  followUps: ['whist.industrial-revolution'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the era as one chain reaction around the Atlantic — and set up the question of who the word "all" actually covered.',
      script:
        'In 1776, a group of colonists wrote that all men are created equal — while many of the men who signed it owned other human beings. Fifteen years later, in France, a new assembly declared that men are born free and equal in rights. Fifteen months after that, enslaved people on a Caribbean sugar island read those same words, decided they meant exactly what they said, and fought a thirteen-year war to prove it. That island became Haiti, the only place in history where an enslaved population overthrew its owners and founded its own country. In fifty years, the Atlantic Ocean stopped being a trade route and became a circuit board — ideas, debts, armies, and refugees firing from one shore to another. Today you trace the current, and you watch a question get asked over and over: when a revolution says "everyone," who does it actually mean?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-atlantic-revolutions',
      kind: 'concept',
      goal: 'The shared fuel, the four linked upheavals in order, and the recurring gap between universal language and actual rights.',
      keyIdeas: [
        'SHARED FUEL, NOT COINCIDENCE — two things were loose in the Atlantic world at once: Enlightenment arguments (Locke on natural rights and government by consent, Rousseau on popular sovereignty, Montesquieu on separated powers) and enormous WAR DEBT. Empires that had fought each other for a century now had to tax somebody to pay for it, and taxes are where philosophy meets the wallet.',
        'THE AMERICAN REVOLUTION (1775-83) — Britain won the Seven Years\' War (1756-63) and then handed the bill to the colonies: the Stamp Act, the Townshend duties, the Tea Act. The colonial answer, "no taxation without representation," was a constitutional argument before it was an independence movement. The Declaration of Independence (1776) is Locke applied out loud: rights are natural, government exists by consent, and consent can be withdrawn.',
        'THE BOOMERANG — France funded the American rebels to hurt Britain, and it worked; it also pushed an already strained French treasury over the edge. French officers who fought in America came home carrying both the ideas and the sense that it could be done. The revolution France bankrolled abroad arrived at its own door within six years.',
        'THE FRENCH REVOLUTION (1789) — bankruptcy forced Louis XVI to convene the Estates-General in 1789 for the first time since 1614. The Third Estate (everyone who was not clergy or nobility, about 97 percent of France) broke away as the National Assembly, crowds stormed the Bastille on July 14, and in August the Assembly issued the Declaration of the Rights of Man and of the Citizen — sovereignty moved from the king to the nation.',
        'RADICALIZATION AND NAPOLEON — foreign invasion, food shortages, and internal revolt pushed the revolution far past 1789: the king was executed in 1793, and the Reign of Terror (1793-94) under Robespierre and the Committee of Public Safety executed tens of thousands before Robespierre himself was guillotined. Into the exhaustion stepped Napoleon Bonaparte, who took power in 1799 and crowned himself emperor in 1804. He is genuinely both things at once: his Napoleonic Code exported legal equality, careers open to talent, and the end of feudal privilege across Europe, while he built an empire, muzzled the press, and RESTORED SLAVERY in France\'s colonies in 1802.',
        'THE HAITIAN REVOLUTION (1791-1804) — Saint-Domingue was France\'s richest colony, producing much of the world\'s sugar and coffee with roughly half a million enslaved people. In 1791 they rose in a mass revolt and took the Declaration of the Rights of Man at its word. Toussaint Louverture, born enslaved, built them into an army that beat French, Spanish, and British forces in turn; after his capture and death in a French prison, Jean-Jacques Dessalines declared independence on January 1, 1804. It is the ONLY successful large-scale slave revolution in recorded history and the world\'s first Black republic — and slaveholding powers, the United States among them, answered with non-recognition and economic isolation, while France later demanded a crushing indemnity (1825) as the price of being acknowledged at all.',
        'LATIN AMERICAN INDEPENDENCE (1810s-20s) — the opening was Napoleon: his 1808 invasion of Spain removed the Spanish king and left colonies asking who they now owed loyalty to. Leadership came mostly from CREOLES — American-born colonists of Spanish descent, wealthy but barred from the top offices reserved for Spain-born officials. Simon Bolivar liberated the north, Jose de San Martin the south, and in Mexico the priest Miguel Hidalgo launched a mass uprising in 1810. By the mid-1820s most of Spanish America was independent — and largely run by the same creole elite, with racial and class hierarchies mostly intact.',
        'THE PATTERN — each revolution radicalized the next: American natural-rights language traveled to Paris, Paris\'s Declaration traveled to Saint-Domingue, and Haiti proved the words were dangerous to anyone who did not mean them. And each revolution drew its own line — property qualifications on voting, slavery preserved in the new United States and re-imposed in French colonies, women excluded nearly everywhere, indigenous and mixed-race majorities still governed by creoles. The gap between the language and the delivery is not a footnote to this era; it is the engine of the next two centuries of reform movements.',
      ],
      vocabulary: [
        {
          term: 'Estates-General',
          definition:
            "France's old assembly of the three estates — clergy, nobility, and everyone else — summoned in 1789 after 175 years because the crown was out of money.",
        },
        {
          term: 'creole',
          definition:
            'in Spanish America, a person of Spanish descent born in the Americas — often rich, but shut out of the highest colonial offices, which went to Spain-born officials.',
        },
        {
          term: 'Napoleonic Code',
          definition:
            "Napoleon's 1804 civil law code: one written law for all men, equality before the courts, no feudal privilege — spread across the territories he conquered, and silent on the rights of women and the enslaved.",
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-debt-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did Britain WINNING the Seven Years\' War in 1763 help destroy the French monarchy in 1789?',
      steps: [
        'Start with the victory. Britain beat France decisively in 1763 and took Canada and territory in India — but a global war on that scale roughly doubled the British national debt.',
        'Follow the bill. Britain decided the colonies that had been defended should help pay, so Parliament imposed new taxes: Stamp Act, Townshend duties, Tea Act. Colonists had no members in Parliament, so they framed the taxes not as expensive but as ILLEGITIMATE — no taxation without representation.',
        'Follow the rebellion. That constitutional argument hardened into independence in 1776, justified in Locke\'s language of natural rights and consent. But thirteen colonies could not beat the Royal Navy alone.',
        'Follow the French money. France joined in 1778 purely to weaken its rival — troops, ships, and loans. Strategically it worked: Britain lost in 1783. Financially it was ruinous, piling new debt on a France that was already borrowing to service old war debt, under a tax system that exempted the nobility and clergy.',
        'Close the chain. By 1788 France could not pay its creditors, and the only body that could authorize new taxation was the Estates-General, unsummoned since 1614. Calling it opened the door the Third Estate walked through in 1789. British victory to colonial taxes to American independence to French bankruptcy to revolution in Paris — the war France won abroad, it lost at home.',
      ],
      answer:
        "Britain's victory produced a debt it passed to the colonies as taxes, the colonies rebelled, France bankrolled that rebellion out of rivalry, and the resulting bankruptcy forced Louis XVI to call the Estates-General — the meeting that became the French Revolution.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-creole-grievance',
      kind: 'worked_example',
      problem:
        'A Spanish American independence leader wrote in 1815 (paraphrased in modern wording): "We were never permitted to govern our own provinces, only rarely made bishops, never sent abroad as ambassadors, and allowed into the army only as junior officers. We were strangers holding the lowest offices in the land of our birth." Work out what this complaint tells you about who led Latin American independence — and what it does not tell you.',
      steps: [
        'Source it first. This is a creole leader writing in exile, arguing a case for independence to an outside audience. It is a persuasive document, not a neutral report — expect the grievances that best serve the argument to be front and center.',
        'Read what the complaint IS. Every item is an OFFICE: governor, bishop, ambassador, army command. The injury described is exclusion from the top of the colonial administration, reserved for officials born in Spain.',
        'Identify the speaker\'s group. Only a wealthy, educated, Spanish-descended colonial elite could plausibly expect to be a governor or a bishop. This is the voice of the creole class — locally powerful, imperially blocked.',
        'Read what the complaint is NOT. There is nothing here about slavery, about land taken from indigenous communities, or about the mixed-race and indigenous majority who made up most of the population and would never have been considered for these offices in the first place. The grievance is about the ceiling above the creoles, not the floor beneath everyone else.',
        'Predict the outcome from the grievance. If the injury is "the wrong people hold the top jobs," then success means creoles take those jobs — and independence arrives without a social revolution. That is largely what happened: by the mid-1820s Spanish America was independent, republics replaced viceroys, and the racial and class hierarchy underneath stayed substantially in place. Compare Haiti, where the people with the grievance were the enslaved themselves, and the social order was destroyed along with the colonial one.',
      ],
      answer:
        'The complaint is a catalog of blocked OFFICES, so it identifies the movement as creole-led — an elite grievance about exclusion from colonial power, not a demand to remake colonial society. That explains why independence changed who governed far more than it changed the hierarchy being governed.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-french-fiscal-crisis',
      kind: 'try_yourself',
      problem:
        'Why was the French monarchy financially desperate enough by 1789 to summon the Estates-General for the first time since 1614?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Decades of war spending, including funding the American Revolution, met a tax system that exempted the nobility and clergy',
          correct: true,
        },
        { id: 'b', text: "Napoleon's European campaigns had drained the treasury" },
        { id: 'c', text: 'Factories and railroads had bankrupted French agriculture' },
        { id: 'd', text: 'Britain had conquered and was occupying most of France' },
      ],
      expectedAnswer:
        'Decades of war spending, including funding the American Revolution, met a tax system that exempted the nobility and clergy',
      hints: [
        'Check the dates on each option — two of these describe things that had not happened yet in 1789.',
        'Ask both halves of a budget question: what was France spending money on, and which French people were legally not paying for it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-haiti-unique',
      kind: 'try_yourself',
      problem:
        'What makes the Haitian Revolution (1791-1804) unique among the Atlantic Revolutions?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Enslaved people themselves overthrew slavery and founded an independent state — the only successful large-scale slave revolution in history',
          correct: true,
        },
        { id: 'b', text: 'It was the first colony in the Americas to win independence from a European power' },
        { id: 'c', text: "France's National Assembly granted the colony both freedom and independence in 1794" },
        { id: 'd', text: 'It abolished slavery throughout the Atlantic world by treaty' },
      ],
      expectedAnswer:
        'Enslaved people themselves overthrew slavery and founded an independent state — the only successful large-scale slave revolution in history',
      hints: [
        'Two of these hand the credit to somebody other than the people of Saint-Domingue — check who is doing the acting in each choice.',
        'Ask who fought the thirteen-year war, and what they held at the end of it that no other rebelling enslaved population ever kept.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-latin-hierarchy',
      kind: 'try_yourself',
      problem:
        'Most new Latin American republics of the 1820s kept colonial-era racial and class hierarchies largely intact. What best explains this?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The movements were led by creole elites whose main grievance was exclusion from high office, not the social order itself',
          correct: true,
        },
        { id: 'b', text: 'Spain required it as a condition of granting independence' },
        { id: 'c', text: 'The new states were monarchies that formally rejected republican ideas' },
        { id: 'd', text: 'The indigenous majority had already been granted full legal equality under colonial rule' },
      ],
      expectedAnswer:
        'The movements were led by creole elites whose main grievance was exclusion from high office, not the social order itself',
      hints: [
        'Start with who led the wars — and what those leaders personally stood to gain once Spain was gone.',
        'A revolution tends to change exactly what its leaders were angry about; the creoles were angry about a ceiling, not a hierarchy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-napoleon',
      kind: 'misconception_check',
      question:
        'A student writes: "Napoleon ended the French Revolution and put everything back the way it was before 1789." What needs correcting?',
      commonErrors: [
        {
          answer: 'Napoleon simply restored the old regime',
          misconception:
            'Treating Napoleon as a straight reversal of the revolution, because he took the title of emperor — and so missing that he simultaneously spread its legal core and betrayed its universal promise.',
          correctsTo:
            'Napoleon did both, and the "both" is the point. He ended the revolution as a popular movement — seizing power in 1799, crowning himself emperor in 1804, censoring the press — and he re-imposed empire abroad. But he did NOT restore the old regime: the Napoleonic Code carried equality before the law, careers open to talent, and the abolition of feudal privilege into every territory his armies reached, which is why kings kept fighting him and reformers kept quoting him. And the sharpest correction is the third piece: in 1802 he RESTORED SLAVERY in France\'s colonies, which is precisely what pushed Saint-Domingue to fight to full independence in 1804.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One wave, not four stories: Enlightenment natural-rights arguments plus imperial war debt lit the same fuse around the Atlantic between 1775 and 1825.',
        "The boomerang: Britain's war debt taxed the colonies into revolt (1776), France funded that revolt out of rivalry, and the resulting bankruptcy forced the Estates-General in 1789.",
        'France in sequence: Estates-General to National Assembly to Declaration of the Rights of Man (1789), then radicalization and the Terror (1793-94) under Robespierre, then Napoleon — Code and empire, legal equality and restored colonial slavery, at the same time.',
        'Haiti (1791-1804) is the pivot: enslaved people led by Toussaint Louverture took the rights of man literally and won — the only successful large-scale slave revolution and the first Black republic, then punished with isolation and an indemnity by slaveholding powers.',
        "Latin America (1810s-20s): Napoleon's invasion of Spain opened the door; Bolivar, San Martin, and Hidalgo led creole-dominated movements that won independence while leaving the social hierarchy standing.",
        'The through-line to carry forward: every one of these revolutions wrote universal language and then narrowed it by property, race, and gender — and closing that gap is the story of the reform movements ahead.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'The Atlantic Revolutions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
