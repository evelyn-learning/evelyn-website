/**
 * World History — Absolutism & Constitutionalism.
 *
 * The 1600s run a live experiment on one question: after the religious
 * wars, who holds final power? France answers "the king, and only the
 * king"; England answers "the king, under law, with Parliament." Both
 * answers get exported worldwide — and both feed straight into the
 * revolutions of Unit 7.3. Factual spine on centralization tools and
 * elite control salvaged from the legacy land-empires material and
 * rewritten subject-first. C3 D2.His.14.9-12, D2.Civ.4.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U7_ABSOLUTISM_CONSTITUTIONALISM: LessonPlan = {
  id: 'evelyn.hs.whist.absolutism-constitutionalism.v1',
  title: 'Absolutism & Constitutionalism',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.absolutism-constitutionalism',
      standard: 'WHIST-7.2',
      description:
        "Compare the absolutist and constitutional answers to the question of who holds final power in a state, explaining how divine-right rulers such as Louis XIV and Peter the Great concentrated authority while England's civil war and Glorious Revolution produced a monarch bound by law and consent (C3 D2.His.14.9-12, D2.Civ.4.9-12).",
    },
  ],
  prerequisites: ['whist.scientific-revolution'],
  followUps: ['whist.enlightenment'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the 1600s as a live experiment in where final power should sit — and show that both answers are still running today.',
      script:
        'Europe spent a century killing itself over religion. By 1648 the survivors agreed on almost nothing except that the chaos had to stop — and then split hard over HOW. One answer: give one person total authority, because a state with a single unquestioned head cannot tear itself apart. That is Louis XIV, building a palace designed to swallow an entire aristocracy. The other answer: bind the ruler with law, because the person who cannot be told no is exactly the danger. That is England, which put a king on trial and cut off his head. Two countries, one question, opposite answers — and every constitution written since has been an argument between them. Today you learn both machines and why one of them collapsed in 1789.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-absolutism-constitutionalism',
      kind: 'concept',
      goal: 'The absolutist model and its toolkit, the constitutional alternative, and the global parallels — plus the confusions students reliably hit.',
      keyIdeas: [
        'ONE QUESTION, TWO ANSWERS — after the French wars of religion (1562-98) and the Thirty Years\' War (1618-48), rulers and thinkers agreed order was urgent. ABSOLUTISM answered: concentrate all power in the monarch. CONSTITUTIONALISM answered: limit the monarch by law and by a representative body. The 1600s test both in real time.',
        'DIVINE RIGHT WAS THE THEORY — Bishop Jacques-Bénigne Bossuet argued kings receive authority directly from God and answer to God alone, so resisting a king is a sin. Note what this does: it makes obedience religious, and it makes the king legally unaccountable to any human body. Louis XIV probably never said "l\'etat, c\'est moi" ("I am the state") — the line was attributed to him long after his death — but it fairly summarizes the theory.',
        'THE ABSOLUTIST TOOLKIT — divine right alone controls nobody. Louis XIV (r. 1643-1715) added machinery: royal officials (intendants) sent from Paris to govern provinces instead of local nobles; a large standing army loyal to the crown; and never once summoning the Estates-General, France\'s representative assembly, in his 72-year reign.',
        'VERSAILLES WAS A MACHINE FOR TAMING NOBLES — the palace was not just display. Nobles who came to compete for the king\'s favor (who hands him his shirt at the morning ceremony) were nobles NOT sitting on their estates raising private armies, as they had during the Fronde revolts (1648-53) that terrified Louis as a boy. Aristocrats kept status and pensions; they lost independent power.',
        'MERCANTILISM PAID THE BILLS — Jean-Baptiste Colbert, Louis\'s finance minister, ran the economy to fill the royal treasury: subsidize French manufacturing, tax imports, build a merchant fleet and colonies, export more than you import. State power and economic policy were the same project.',
        'THE COSTS COMPOUND — Louis revoked the Edict of Nantes in 1685, ending the toleration French Protestants (Huguenots) had held since 1598; roughly 200,000 skilled artisans, merchants, and soldiers fled to the Dutch Republic, England, and Prussia, handing rivals their talent. Meanwhile decades of wars drained the treasury while nobles and clergy stayed largely tax-exempt. France\'s peasants and middle class paid. That unpaid bill arrives in 1789.',
        'THE MODEL TRAVELS — Peter the Great of Russia (r. 1682-1725) westernized by decree: built St. Petersburg from swampland as a window on Europe, reorganized the army, and turned his nobility into a SERVICE nobility ranked by achieved office rather than birth alone (the Table of Ranks, 1722). Beyond Europe, the Ottoman sultans and Ming and Qing China had long run centralized states staffed by officials who owed their position to the ruler — recruited by levy in the Ottoman case, by competitive written civil-service testing in China. Centralizing power was a global pattern, not a European invention.',
        'ENGLAND TAKES THE OTHER ROAD — Parliament held the POWER OF THE PURSE: only Parliament could grant new taxes, so a king who needed money had to summon it and bargain. Charles I tried to rule without it; the result was civil war (1642-49), his trial and public execution, and Oliver Cromwell\'s military Commonwealth. The monarchy was restored in 1660, but the quarrel was not settled.',
        'THE GLORIOUS REVOLUTION SETTLED IT — in 1688, Parliament invited William of Orange and Mary to replace James II, who fled; the transfer was nearly bloodless in England (Ireland and Scotland saw real fighting). The price of the crown was the English Bill of Rights (1689): the monarch cannot suspend laws, cannot tax without Parliament, cannot keep a standing army in peacetime without consent, and Parliament must meet regularly. A monarch UNDER law.',
        'LOCKE SUPPLIED THE ARGUMENT — John Locke\'s Two Treatises of Government (published 1689) held that people possess natural rights to life, liberty, and property; that government exists by their CONSENT to protect those rights; and that a ruler who breaks that trust may rightfully be replaced. Directly opposite to Bossuet — and the bridge into the Enlightenment and the revolutions of 7.3. The Dutch Republic offered a third live example: no monarch at all, run by merchant-dominated provincial assemblies, and the richest state per person in Europe.',
      ],
      vocabulary: [
        { term: 'absolutism', definition: 'a system in which the monarch claims total sovereign power, unchecked by any assembly, court, or written limit.' },
        { term: 'divine right', definition: 'the theory that a monarch\'s authority comes directly from God, making the ruler answerable to God rather than to subjects.' },
        { term: 'constitutionalism', definition: 'the principle that a ruler\'s power is limited by law and by an institution — such as Parliament — that must consent to taxes and legislation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-versailles-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did decades of religious warfare and noble rebellion end up producing Versailles — and why did that solution eventually bankrupt France?',
      steps: [
        'Start with the disorder: the French wars of religion (1562-98) and the Thirty Years\' War (1618-48) had shown what happens when great nobles with private armies and rival faiths fight over the state. Then the Fronde revolts (1648-53) drove the child Louis XIV out of Paris in the night — a personal lesson he never forgot.',
        'Diagnose as Louis did: the threat is not foreign invasion, it is powerful subjects with independent power bases. Any solution must strip the nobility of independence WITHOUT provoking another rebellion.',
        'Follow the solution: pull nobles to court at Versailles, where status is awarded by proximity to the king; send royal intendants to actually govern the provinces; keep a standing army answering to the crown; and never summon the Estates-General, so no assembly can bargain with you.',
        'Follow the money: this machinery — palace, army, officials, wars — is enormously expensive, so Colbert runs mercantilist policy to maximize revenue. But nobles and clergy keep their tax exemptions, so the burden falls on peasants and the commercial middle class.',
        'Follow the damage: revoking the Edict of Nantes in 1685 exiles roughly 200,000 productive Huguenots to France\'s rivals, and Louis\'s wars run for decades. Close the chain: disorder produced concentration of power; concentration produced a costly, exempt-at-the-top fiscal system; and a state where the excluded pay for everything and cannot bargain over taxes hands its successors the crisis that opens in 1789.',
      ],
      answer:
        'Civil disorder and the Fronde pushed Louis XIV to neutralize the nobility through Versailles, intendants, and a standing army; that machinery required revenue the tax-exempt elite would not supply, and war costs plus the Huguenot exodus compounded the strain — a fiscal and political dead end that culminates in the French Revolution of 1789.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-1689-source',
      kind: 'worked_example',
      problem:
        'A supporter of the 1688 settlement wrote (paraphrased): "The king may not set aside laws, nor levy money, nor keep an army in time of peace, unless Parliament assembled has consented; and Parliament shall be held often." A student reads this and concludes England became a democracy in 1689 and abolished its monarchy. Work out what the passage actually establishes — and what it does not.',
      steps: [
        'Read what is restricted, item by item: suspending laws, raising taxes, and maintaining a peacetime army — precisely the three powers Charles I and James II had tried to exercise alone. The document is a list of the previous fifty years\' grievances, turned into law.',
        'Name the principle underneath: the monarch is not above the law and cannot fund himself independently. Combined with the requirement that Parliament meet often, that makes the crown permanently dependent on the assembly — the power of the purse written into the constitution.',
        'Correct the first half of the student\'s claim: the monarchy was not abolished. William and Mary were offered the crown and accepted these conditions with it. England became a CONSTITUTIONAL MONARCHY — a real king, with real powers, operating inside legal limits.',
        'Correct the second half: this is not democracy. Parliament in 1689 was elected by a small fraction of adult men who met property qualifications; women, most men, and the enslaved and colonized had no vote. Limited government and broad suffrage are different achievements, separated here by more than two centuries.',
        'Place it in the argument: Bossuet said the king answers only to God; this settlement says the king answers to law and to Parliament. Locke published his case for government by consent the same year — which is why the revolutionaries of the 1770s and 1780s quote 1689 and Locke rather than Versailles.',
      ],
      answer:
        'The passage establishes a monarch bound by law — no suspending statutes, no taxation and no peacetime army without Parliament, and regular Parliaments — creating a constitutional monarchy, not a democracy and not a republic; the crown survived, the franchise stayed narrow, and the limits on power are what changed.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-versailles-purpose',
      kind: 'try_yourself',
      problem:
        'Louis XIV required France\'s leading nobles to spend much of the year at Versailles competing for ceremonial honors. What was the political purpose of this arrangement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It kept nobles chasing royal favor at court instead of building independent power on their own estates', correct: true },
        { id: 'b', text: 'It let the nobility vote on royal policy in a permanent national assembly' },
        { id: 'c', text: 'It concentrated France\'s defenders in one fortress against foreign invasion' },
        { id: 'd', text: 'It was purely artistic display with no effect on how France was governed' },
      ],
      expectedAnswer: 'It kept nobles chasing royal favor at court instead of building independent power on their own estates',
      hints: [
        'Ask what a great noble CANNOT do while he is at Versailles waiting to hand the king his shirt.',
        'Remember the Fronde: Louis had seen what nobles do on their own lands with their own armed followers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-nantes-revocation',
      kind: 'try_yourself',
      problem:
        'In 1685 Louis XIV revoked the Edict of Nantes, which had protected French Protestants since 1598. What was the most significant long-term consequence for France?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Roughly 200,000 skilled Huguenots emigrated, carrying their trades and capital to rival states', correct: true },
        { id: 'b', text: 'It ended the French wars of religion and brought decades of peace' },
        { id: 'c', text: 'It forced England to become a Catholic kingdom under James II' },
        { id: 'd', text: 'It granted French Protestants new rights to worship and hold office' },
      ],
      expectedAnswer: 'Roughly 200,000 skilled Huguenots emigrated, carrying their trades and capital to rival states',
      hints: [
        'Check the direction first: the 1598 edict GRANTED toleration, so revoking it in 1685 took toleration away.',
        'When a state expels its artisans and merchants, ask which neighbors gained them — the Dutch Republic, England, and Prussia all did.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-power-of-purse',
      kind: 'try_yourself',
      problem:
        'English monarchs in the 1600s claimed divine right just as French monarchs did, yet none of them ever ruled as Louis XIV did. Which factor best explains the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Only Parliament could grant new taxes, so a king who needed money had to summon it and bargain', correct: true },
        { id: 'b', text: 'English kings never claimed authority from God and accepted limits willingly' },
        { id: 'c', text: 'Parliament elected each new English monarch by popular vote' },
        { id: 'd', text: 'England faced no wars and so never needed to raise revenue' },
      ],
      expectedAnswer: 'Only Parliament could grant new taxes, so a king who needed money had to summon it and bargain',
      hints: [
        'Follow the money: what did Charles I have to do every time a war made him short of funds?',
        'A ruler who cannot tax on his own authority cannot ignore the body that can — that leverage is the whole story.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-absolute-means-unlimited',
      kind: 'misconception_check',
      question:
        'A student says: "Absolute monarchs like Louis XIV and Peter the Great had total control — whatever they ordered simply happened everywhere in their kingdoms." What needs correcting?',
      commonErrors: [
        {
          answer: 'Absolute rulers controlled everything and everyone in their states',
          misconception:
            'Treating absolutism as an achieved fact rather than a CLAIM and an ongoing project — and forgetting that pre-modern states lacked the communications, roads, police, and money to enforce a ruler\'s will down to the village.',
          correctsTo:
            'Absolutism describes what monarchs CLAIMED and worked toward, not what they fully achieved. Louis XIV still ran into provincial law courts (the parlements) that resisted registering his edicts, nobles and clergy whose tax exemptions he never broke, and a treasury that repeatedly ran dry. Peter the Great could order beards shaved and a capital built, yet his decrees thinned out across thousands of miles of countryside where local landowners actually ruled. That is exactly why absolutist rulers invested so heavily in tools of enforcement — intendants, standing armies, service nobility, mercantilist revenue. Judge these states by their machinery and its limits, not by the theory\'s advertising.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One question after the religious wars — where does final power sit? — got two answers: absolutism (all power in the monarch) and constitutionalism (a monarch limited by law and an assembly).',
        'Louis XIV\'s machinery: divine-right theory from Bossuet, Versailles to tame the nobility, intendants governing the provinces, a standing army, Colbert\'s mercantilism, and the Estates-General never summoned.',
        'The costs compounded: revoking the Edict of Nantes (1685) exiled roughly 200,000 Huguenots, endless wars drained the treasury, and a tax-exempt elite left the bill to everyone else — payable in 1789.',
        'England\'s path ran through Parliament\'s power of the purse: civil war (1642-49) and the execution of Charles I, Cromwell, the Restoration, then the Glorious Revolution of 1688 and the English Bill of Rights (1689) — no suspending laws, no taxes or peacetime army without consent, regular Parliaments.',
        'Locke answered Bossuet: natural rights, government by consent, and the right to replace a ruler who breaks trust — the argument that carries straight into the Enlightenment and the Atlantic revolutions.',
        'Centralization was global (Peter the Great\'s St. Petersburg and service nobility, Ottoman and Ming-Qing bureaucracies), and "absolute" always meant claimed, never total — while the merchant-run Dutch Republic proved a state could prosper with no monarch at all.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Absolutism & Constitutionalism' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
