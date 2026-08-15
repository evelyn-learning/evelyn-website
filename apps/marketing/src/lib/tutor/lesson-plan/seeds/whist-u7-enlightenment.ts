/**
 * World History — Revolutions & Enlightenment: The Enlightenment.
 *
 * The moment thinkers turned Newton's method on human society: if the
 * heavens run on discoverable laws, why not governments? Salvaged factual
 * spine from the legacy world-history enlightenment seed, reframed
 * subject-first — natural rights, separation of powers, the general will,
 * the salons and cheap print that carried them, and the gap between what
 * the philosophes wrote and who they were willing to include (7.4).
 * C3 D2.His.1.9-12, D2.Civ.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U7_ENLIGHTENMENT: LessonPlan = {
  id: 'evelyn.hs.whist.enlightenment.v1',
  title: 'The Enlightenment',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.enlightenment',
      standard: 'WHIST-7.3',
      description:
        'Explain how Enlightenment thinkers applied reason and natural law to government and society, analyze how their ideas spread through print and sociable public spaces, and evaluate the gap between the universal language they used and the exclusions they accepted (C3 D2.His.1.9-12, D2.Civ.1.9-12).',
    },
  ],
  prerequisites: ['whist.absolutism-constitutionalism'],
  followUps: ['whist.atlantic-revolutions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Frame the Enlightenment as a method borrowed from physics and pointed at kings — and show why literate publics made it dangerous.",
      script:
        'Isaac Newton did something unsettling: he showed that planets, cannonballs, and falling apples all obey a few laws you can discover by thinking carefully. Within a generation, writers in Paris, Edinburgh, and Naples asked the obvious follow-up question — if the universe runs on discoverable laws, why should government be a mystery handed down by God to one family? That question sounds academic. It was not. Once printers could sell those arguments cheaply, and once people read them aloud in salons and coffeehouses, the question stopped being philosophy and started being a threat. Kings noticed. Today you learn the ideas, how they traveled, and where their authors quietly stopped applying them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-enlightenment',
      kind: 'concept',
      goal: "Newton's method applied to society; the major thinkers and their specific claims; how the ideas spread; enlightened absolutism's limits; the contradictions.",
      keyIdeas: [
        "THE CORE MOVE: NATURAL LAW APPLIED TO SOCIETY — after Newton's Principia (1687) showed the physical world obeys knowable laws, eighteenth-century writers called philosophes argued that human society must have discoverable laws too. Politics became something you could REASON about from first principles instead of inherit — a direct challenge to divine-right monarchy.",
        'LOCKE: NATURAL RIGHTS AND CONSENT — John Locke (writing in the 1680s-90s) argued people are born with rights to LIFE, LIBERTY, AND PROPERTY that exist before any government. Government is a contract created to protect those rights and rests on the consent of the governed; a ruler who breaks the contract can rightfully be replaced. That last clause is the one revolutionaries would quote.',
        'MONTESQUIEU: SEPARATION OF POWERS — Montesquieu argued in The Spirit of the Laws (1748) that liberty survives only when power is divided among branches that can check one another. He built the argument by admiring England, which he partly MISREAD — English government was less neatly separated than he described. The misreading became the blueprint anyway.',
        'VOLTAIRE, ROUSSEAU, BECCARIA, WOLLSTONECRAFT — Voltaire attacked religious persecution and censorship with ridicule (Candide, 1759), making wit a political weapon. Rousseau argued sovereignty belongs to the PEOPLE as a whole, expressed through the "general will" — later invoked by radicals to justify acting in the name of the nation. Beccaria argued against torture and cruel punishment (1764). Mary Wollstonecraft (1792) turned the rights logic on its authors: if reason grounds rights, women have reason and therefore rights.',
        "SMITH: MARKETS AGAINST MERCANTILISM — Adam Smith's The Wealth of Nations (1776) argued that a nation grows rich through production and free exchange, not by hoarding bullion and strangling trade with monopolies. Individuals pursuing self-interest, he claimed, coordinate the economy better than royal ministers directing it — the same anti-authority instinct applied to economics.",
        'HOW IDEAS SPREAD IS PART OF THE STORY — none of this mattered until it circulated: salons (private gatherings, often organized and steered by women such as Marie-Therese Geoffrin), the Encyclopedie (edited by Diderot from 1751, a multi-volume attempt to put all useful knowledge in reach), coffeehouses where strangers argued across class lines, and cheap print running on the printing revolution you met in 6.1. Literacy plus cheap paper turned private arguments into public opinion.',
        'ENLIGHTENED ABSOLUTISM AND ITS LIMIT — some rulers adopted the style: Frederick II of Prussia called himself "first servant of the state," welcomed philosophes, and eased censorship; Catherine the Great of Russia corresponded with Voltaire and drafted reform proposals. Both kept their armies, their nobles, and — decisively — serfdom. Reform stopped exactly where it would have cost the crown power.',
        'THE CONTRADICTION AT THE CENTER — most philosophes wrote about universal liberty while accepting, profiting from, or ignoring slavery and colonial empire; most also assumed rights meant propertied European men. Wollstonecraft pushed on the gender exclusion in 1792. The enslaved revolutionaries of Haiti would soon force the racial one open by taking the language literally (7.4).',
      ],
      vocabulary: [
        { term: 'philosophe', definition: 'an eighteenth-century writer-critic who applied reason to society, government, religion, and economics — a public intellectual, not a professional academic.' },
        { term: 'social contract', definition: 'the idea that government is an agreement among people to secure their rights, not a gift from God to a dynasty — and can be revised when it fails.' },
        { term: 'salon', definition: 'a regular private gathering, frequently hosted by an educated woman, where writers, nobles, and officials debated new ideas and carried them outward.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-newton-to-dynamite',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a book about planetary motion published in 1687 end up threatening European monarchies within a century?',
      steps: [
        "Start with the method, not the content. Newton's achievement was not the specific law of gravitation — it was the demonstration that observation plus reason could uncover rules governing everything, with no appeal to mystery or authority.",
        'Transfer the method. Philosophes asked what happens if you apply that same procedure to society. Locke had already reasoned from a starting premise — people exist before governments do — to a conclusion: government must therefore be a human arrangement serving human purposes, revisable when it fails.',
        'Notice what the transfer destroys. Divine-right monarchy claimed authority came from God and could not be questioned. A contract theory makes government a thing with a JOB. Anything with a job can be evaluated, and anything evaluated can be found failing.',
        'Add the delivery system. Arguments only bite when people encounter them. The Encyclopedie, cheap pamphlets, smuggled editions, salons hosted by women who curated who met whom, and coffeehouses where a merchant could argue with a lawyer put contract theory in front of tens of thousands of literate, taxed, ambitious people.',
        'Close the chain. Reasoned method → society treated as a knowable system → government reframed as a revocable contract → mass circulation to a literate public that had grievances → a shared vocabulary for saying a king is illegitimate. That vocabulary is what revolutionaries in America, France, and Haiti pick up next (7.4).',
      ],
      answer:
        "Newton's method — not his physics — was the export: reason applied to society reframed government as a human contract with a job, and cheap print plus salons and coffeehouses put that reframing in the hands of a literate public that could act on it.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rights-paraphrase',
      kind: 'worked_example',
      problem:
        'A pamphlet printed in London in 1792 argued (paraphrased): "If it is the possession of reason that entitles a man to rights, then one of two things must be true. Either women possess reason, and their exclusion is simple injustice — or the gentlemen who exclude them must admit that rights rest not on reason at all, but on force." Work out what argumentative move this makes, and why it was so hard to answer.',
      steps: [
        'Identify the borrowed premise. The writer does not invent a new standard. She takes the philosophes\' own claim — rights follow from the capacity to reason — and treats it as settled ground, so opponents cannot reject it without abandoning their own position.',
        'Trace the forced choice. The passage builds a trap with only two exits: admit women reason (so they hold rights), or admit rights actually come from power. There is no comfortable third door, which is exactly the point of framing it this way.',
        'Name the target. The argument is aimed less at kings than at reformers — men who had just finished writing about universal liberty while assuming "man" meant propertied men. Mary Wollstonecraft published A Vindication of the Rights of Woman in that year, 1792, making precisely this move.',
        'See the general pattern. This is the Enlightenment\'s recurring internal problem: universal language plus selective application. The same lever works on other exclusions — an enslaved person in a French colony could run the identical argument about race, and within two years people in Saint-Domingue were doing so with weapons.',
        'Judge the immediate result honestly. The argument did not win in 1792; women gained no political rights then, and most readers filed it away as provocation. Its force was delayed: it became a standard text for nineteenth-century campaigners because the logic never stopped being unanswerable on its own terms.',
      ],
      answer:
        'It turns the philosophes\' own premise against them — if reason grounds rights, excluding women either is unjust or exposes rights as resting on force — the same universal-language-versus-selective-application lever that anti-slavery revolutionaries would soon pull.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-locke-consent',
      kind: 'try_yourself',
      problem:
        "Locke argued that people form governments to protect rights they already possess. Which conclusion follows most directly from that starting point?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A government that violates those rights breaks its contract, and the people may rightfully replace it', correct: true },
        { id: 'b', text: 'Monarchs receive their authority directly from God and cannot be judged by subjects' },
        { id: 'c', text: 'A nation grows wealthy by accumulating gold and restricting foreign trade' },
        { id: 'd', text: 'Power must always be divided among three separate branches of government' },
      ],
      expectedAnswer: 'A government that violates those rights breaks its contract, and the people may rightfully replace it',
      hints: [
        'If rights come FIRST and government comes second to protect them, what happens when the protector becomes the threat?',
        'Two of these belong to other thinkers entirely — Montesquieu on branches, mercantilists on hoarding gold.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-enlightened-absolutism',
      kind: 'try_yourself',
      problem:
        'Catherine the Great of Russia corresponded with Voltaire, praised legal reform, and patronized Enlightenment writers — yet Russian serfdom expanded during her reign. What does this pattern best illustrate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rulers adopted Enlightenment style and vocabulary but stopped short of reforms that would weaken their own power base', correct: true },
        { id: 'b', text: 'Enlightenment ideas had not yet reached eastern Europe in the 1700s' },
        { id: 'c', text: 'Catherine privately rejected reason and defended divine-right monarchy in her writings' },
        { id: 'd', text: 'Serfdom was abolished across Europe in the 1600s, so the comparison does not apply' },
      ],
      expectedAnswer: 'Rulers adopted Enlightenment style and vocabulary but stopped short of reforms that would weaken their own power base',
      hints: [
        'Ask who Catherine depended on to govern and to raise armies — and what freeing the serfs would have done to those nobles.',
        'Frederick II of Prussia shows the same shape: real reforms in law and censorship, no touching the social order underneath.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spread',
      kind: 'try_yourself',
      problem:
        'Enlightenment arguments reached far beyond the small circle of writers who produced them. Which factor best explains that reach?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cheap print, the Encyclopedie, salons, and coffeehouses circulated the ideas among a growing literate public', correct: true },
        { id: 'b', text: 'European monarchs required the ideas to be taught in state schools' },
        { id: 'c', text: 'The Catholic Church financed and distributed the philosophes\' works' },
        { id: 'd', text: 'Radio and newspapers carried the debates to mass audiences' },
      ],
      expectedAnswer: 'Cheap print, the Encyclopedie, salons, and coffeehouses circulated the ideas among a growing literate public',
      hints: [
        'One of these is off by more than a century — check the technology dates before anything else.',
        'Think about who was hosting the salons and who was buying pamphlets: circulation was private, commercial, and often semi-legal, not official.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-enlightenment-democracy',
      kind: 'misconception_check',
      question:
        'A student writes: "The Enlightenment thinkers all wanted democracy and equal rights for everyone." What needs correcting?',
      commonErrors: [
        {
          answer: 'They all wanted democracy and equal rights for everyone',
          misconception:
            'Reading later democratic outcomes backward onto the writers who supplied only part of the raw material, and treating a quarrelsome group of individuals as one unified program.',
          correctsTo:
            'They disagreed constantly, and most were not democrats. Voltaire preferred a strong reforming monarch to rule by what he considered an ignorant public; Locke\'s framework fit a constitutional monarchy limited by consent, not universal voting; Montesquieu wanted power divided, not handed to everyone. "Everyone" was narrower still: most assumed propertied European men, most accepted slavery and empire, and it took Wollstonecraft (1792) and the Haitian revolutionaries to press the universal language toward its literal meaning.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The core move: Newton showed nature obeys discoverable laws, so philosophes asked what laws govern society — turning government from a divine gift into a human arrangement you can evaluate.",
        'Know who argued what: Locke (natural rights, consent, right to replace a broken government), Montesquieu (separation of powers, from a partly misread England), Voltaire (toleration and free speech, wielded through wit), Rousseau (popular sovereignty, the general will), Beccaria (against torture), Wollstonecraft (rights logic extended to women, 1792), Smith (markets against mercantilism, 1776).',
        'Circulation is causation: salons run largely by women, the Encyclopedie, coffeehouses, and cheap print built on the 6.1 printing revolution turned private arguments into public opinion.',
        'Enlightened absolutism had a hard ceiling — Frederick II and Catherine the Great adopted the vocabulary and kept serfdom, because reform stopped where it would have cost them power.',
        'Universal words, selective application: philosophes wrote about liberty while accepting slavery and empire — the contradiction that revolutionaries in Haiti will force open in 7.4.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'The Enlightenment' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
