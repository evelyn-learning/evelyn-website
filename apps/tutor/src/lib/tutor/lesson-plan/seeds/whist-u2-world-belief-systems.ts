/**
 * World History — World Belief Systems.
 *
 * Ideas are the course's other engine: armies redraw borders, but belief
 * systems redraw how people live inside them — who eats with whom, who
 * obeys whom, what a good life even means. This lesson tracks six of them
 * and, just as importantly, the ROADS they travelled on.
 * C3 D2.His.1.9-12, D2.His.14.9-12, D2.Geo.6.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U2_WORLD_BELIEF_SYSTEMS: LessonPlan = {
  id: 'evelyn.hs.whist.world-belief-systems.v1',
  title: 'World Belief Systems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.world-belief-systems',
      standard: 'WHIST-2.4',
      description:
        'Compare the core teachings of Hinduism, Buddhism, Confucianism, Daoism, Judaism, and Christianity, explain how trade routes, empires, and missionaries carried them across Afro-Eurasia, and analyze how each reshaped government and daily life (C3 D2.His.1.9-12, D2.His.14.9-12, D2.Geo.6.9-12).',
    },
  ],
  prerequisites: ['whist.classical-india-china'],
  followUps: ['whist.rise-of-islam'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame belief systems as the invisible infrastructure of the classical world — and as ideas that travelled on the same roads as silk and spices.',
      script:
        'Empires you have studied so far conquered with armies. But the things that outlasted every one of those empires were ideas — ideas about what a person owes their family, their ruler, and the universe. Six belief systems took shape between roughly 1500 BCE and 100 CE, and today they still set holidays, shape legal codes, and settle arguments at dinner tables on every continent. Here is the part students rarely expect: these ideas travelled on trade routes. Merchants carried silk, spices, and beliefs in the same caravan. Today you learn what each one teaches, where it went, and — the historian\'s question — WHY it went there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-belief-systems',
      kind: 'concept',
      goal: 'The six belief systems, what each actually teaches, and the mechanisms that carried them across continents.',
      keyIdeas: [
        'HINDUISM GREW, IT WAS NOT FOUNDED — no single founder, no single founding moment, no one scripture. It developed over more than a thousand years out of the Vedic traditions of South Asia. Core ideas: dharma (the duties that fit your place in the world), karma (actions carry consequences), and reincarnation — the soul reborn across many lives. Historically it was interwoven with the varna/caste order, which tied a person\'s duties to birth.',
        'BUDDHISM BEGAN AS A DIAGNOSIS — Siddhartha Gautama (c. 563–483 BCE), a prince in what is now Nepal/northern India, left his palace, and after long searching taught the Four Noble Truths: life contains suffering; suffering comes from craving; craving can end; the Eightfold Path is how. He was a human teacher, not a god — "Buddha" means "the awakened one." He kept karma and rebirth but rejected the ritual authority of the priestly class, which made his teaching open to anyone regardless of birth.',
        'BUDDHISM TRAVELLED AND SPLIT — the Mauryan emperor Ashoka (ruled c. 268–232 BCE) converted after a brutal war, sponsored monasteries and missionaries, and turned a regional teaching into an export. It moved along the Silk Roads into Central Asia, China, Korea, and Japan, and by sea into Sri Lanka and Southeast Asia. It divided into Theravada ("way of the elders," dominant in Sri Lanka and Southeast Asia, closer to the earliest teaching) and Mahayana (dominant in East Asia, with bodhisattvas who delay their own release to help others). Ironically, it faded in India itself.',
        'CONFUCIANISM IS ETHICS, NOT WORSHIP — Confucius (551–479 BCE) lived through the disorder of the late Zhou period and asked a practical question: how do you make society stable? His answer was moral relationships, not law or force. Five relationships (ruler–subject, father–son, husband–wife, elder–younger sibling, friend–friend) each carry duties in BOTH directions, anchored by filial piety — respect for parents and ancestors. Rulers should govern by moral example so that people follow willingly.',
        'DAOISM IS THE COUNTERWEIGHT — associated with Laozi and the text Dao De Jing, Daoism turns away from Confucian social duty toward harmony with the Dao, the natural way of things. Its signature idea is wu wei, "effortless action" — stop forcing, work with the grain of nature. Chinese people did not usually pick one: a scholar could serve the state as a Confucian and retreat into Daoist poetry and nature, and follow Buddhist practice too.',
        'JUDAISM: MONOTHEISM, COVENANT, LAW — the Hebrews taught belief in one God at a time when nearly every neighbor worshipped many. Two ideas did the heavy lifting: covenant, a binding agreement between God and the people, and law — the Torah, including the Ten Commandments, applying moral rules to everyone rather than exempting kings. Judaism stayed a relatively small tradition, but its monotheism and ethical law became the foundation of both Christianity and, later, Islam.',
        'CHRISTIANITY RODE ROMAN INFRASTRUCTURE — Jesus of Nazareth (c. 4 BCE–30 CE) taught in Roman-ruled Judea within a Jewish framework, emphasizing love of God and neighbor, forgiveness, and the worth of the poor and outcast. After his execution, followers led by figures such as Paul carried the message to non-Jews across the Mediterranean, using Roman roads, sea lanes, and the shared Greek language. Rome persecuted Christians for refusing to honor the state cult — yet the faith grew. Constantine legalized it (Edict of Milan, 313 CE) and it became the empire\'s official religion under Theodosius (380 CE).',
        'WHY IDEAS TRAVEL — three engines, and historians look for all three: TRADE ROUTES (merchants and the monasteries and hostels along the Silk Roads and Indian Ocean), EMPIRES (Ashoka funding missionaries; Rome supplying roads and a common language), and MISSIONARIES/MONKS who deliberately taught abroad. Beliefs also ADAPTED to arrive — Buddhism in China absorbed local practice and Confucian family duty rather than replacing them.',
      ],
      vocabulary: [
        { term: 'karma / dharma', definition: 'karma — the moral weight of actions carried into future lives; dharma — the duties proper to one\'s role in the world. Shared vocabulary of Hinduism and Buddhism.' },
        { term: 'filial piety', definition: 'the Confucian duty of respect and care owed to parents, elders, and ancestors — the model for every other relationship, including loyalty to a ruler.' },
        { term: 'monotheism', definition: 'belief in a single God — the defining teaching of Judaism and, later, Christianity, in a world that was overwhelmingly polytheistic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-buddhism-spread',
      kind: 'worked_example',
      problem:
        'Build the causal chain: Buddhism began with one teacher in northern India, yet within a thousand years it was the dominant faith in China, Korea, Japan, and much of Southeast Asia — while fading in the land of its birth. How did that happen?',
      steps: [
        'Start with the teaching itself: the Buddha addressed suffering, a universal human problem, and made his path open to anyone — no priestly class required, no birth qualification. A teaching that does not depend on one society\'s social order is portable in a way that a birth-linked system is not.',
        'Add the imperial sponsor: Ashoka, sickened by the slaughter of his Kalinga campaign, adopted Buddhism (c. 260 BCE) and used the machinery of the Mauryan Empire — carved edicts, funded monasteries, and missionaries sent to Sri Lanka and beyond. State resources turned a regional teaching into an organized movement.',
        'Follow the roads: monasteries clustered along the Silk Roads, where merchants needed shelter, water, and safe stopping points. Traders donated to monasteries; monks travelled with caravans. The same routes that moved silk into Central Asia moved texts, relics, and monks — so the religion advanced at the speed of commerce.',
        'Watch it adapt on arrival: in China, Buddhism gained ground during the disorder after the Han dynasty fell (220 CE), when Confucian order looked like it had failed. Mahayana forms absorbed local practice and left room for family obligations, so converting did not mean abandoning ancestors — adaptation lowered the cost of conversion.',
        'Close the loop back home: in India, Hindu traditions renewed themselves with devotional movements and absorbed some Buddhist elements, court patronage moved elsewhere, and later invasions destroyed major monastic centers. Buddhism\'s institutions there weakened even as its exported branches flourished.',
      ],
      answer:
        'A universally-framed, birth-blind teaching + imperial sponsorship under Ashoka + trade-route monasteries + willingness to adapt to local culture carried Buddhism across Asia, while the loss of patronage and monastic institutions let it fade in India.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-buddhism-hinduism-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "Buddhism is just a newer name for Hinduism, and the Buddha is one of the Hindu gods." Untangle what is true, what is false, and why the confusion is so common.',
      steps: [
        'Grant the real overlap first: Buddhism arose in South Asia around the 500s BCE inside a world already shaped by Vedic and early Hindu ideas, so it INHERITED vocabulary — karma, dharma, rebirth. Shared vocabulary is why the two look identical from a distance.',
        'Now name the break. The Buddha rejected the ritual authority of the brahmin priesthood and the idea that birth determines spiritual worth. His Four Noble Truths and Eightfold Path are a program anyone can follow — a deliberate move away from a birth-ordered system.',
        'Correct the "god" error: Siddhartha Gautama was a historical human being (c. 563–483 BCE), and "Buddha" is a title meaning "awakened one," not a divine name. Early Buddhist teaching centers on a path to end suffering rather than on worshipping a creator god.',
        'Explain where the student\'s second claim comes from: centuries LATER, some Hindu traditions did incorporate the Buddha as an avatar of Vishnu. That is a real historical development — but it happened after the two traditions had long been distinct, so it is evidence of later absorption, not proof they were always one thing.',
        'Finish with the structural difference: Hinduism has no founder, no founding date, and no single scripture — it accumulated over more than a millennium. Buddhism has a specific founder, a specific starting point, and a teaching he articulated. That is a different KIND of religion, not a rebrand.',
      ],
      answer:
        'They share vocabulary (karma, dharma, rebirth) because Buddhism grew out of the same region, but Buddhism has a human founder who rejected priestly and birth-based authority; the Buddha-as-avatar idea is a later Hindu development, not the original relationship.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-spread-mechanism',
      kind: 'try_yourself',
      problem:
        'Buddhist monasteries appeared at oasis towns and mountain passes across Central Asia between roughly 100 BCE and 500 CE. What does that geographic pattern most strongly suggest about how the religion spread?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It travelled along established trade routes, carried by merchants and monks who used those stopping points', correct: true },
        { id: 'b', text: 'It was imposed on Central Asia by conquering Indian armies' },
        { id: 'c', text: 'It arose independently in each oasis town with no connection to India' },
        { id: 'd', text: 'It spread only after Constantine legalized it in the Roman Empire' },
      ],
      expectedAnswer: 'It travelled along established trade routes, carried by merchants and monks who used those stopping points',
      hints: [
        'Ask what oasis towns and mountain passes were FOR. Who needed to stop at exactly those places?',
        'The monasteries sit on the Silk Roads. Beliefs moved in the same caravans as the goods.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-source-governance',
      kind: 'try_yourself',
      problem:
        'Here is a paraphrase of advice from an ancient Chinese text on government: "A ruler who governs by his own good character is like the north star — it holds its place, and the other stars turn toward it." Which belief system does this reflect, and what claim about power is it making?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Confucianism — a ruler earns obedience through moral example rather than force or harsh law', correct: true },
        { id: 'b', text: 'Daoism — a ruler should withdraw from the world and stop governing entirely' },
        { id: 'c', text: 'Buddhism — a ruler achieves power by ending all personal desire' },
        { id: 'd', text: 'Judaism — a ruler holds authority through a covenant made with one God' },
      ],
      expectedAnswer: 'Confucianism — a ruler earns obedience through moral example rather than force or harsh law',
      hints: [
        'The paraphrase is about how a ruler should behave toward subjects. Which tradition built its whole system on relationships and duties between people?',
        'Nothing here mentions nature, suffering, or a deity — it is about character producing willing obedience. That is the Confucian answer to disorder.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-christianity-rome',
      kind: 'try_yourself',
      problem:
        'Christianity spread widely across the Roman Empire during the 100s and 200s CE even though Roman authorities periodically persecuted its followers. Which factor best explains that spread?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Roman roads, sea lanes, and a common Greek language let missionaries reach cities across the Mediterranean, and the message appealed strongly to the poor and the excluded', correct: true },
        { id: 'b', text: 'Roman emperors promoted Christianity from the time of Augustus onward' },
        { id: 'c', text: 'Christianity spread mainly because Constantine made it the official religion in 313 CE, which is why it grew in earlier centuries' },
        { id: 'd', text: 'Christian armies conquered the Mediterranean provinces and required conversion' },
      ],
      expectedAnswer: 'Roman roads, sea lanes, and a common Greek language let missionaries reach cities across the Mediterranean, and the message appealed strongly to the poor and the excluded',
      hints: [
        'Watch the dates. The question asks about the 100s and 200s CE — what had Rome already built by then that helped travelers move and communicate?',
        'Constantine comes later (313 CE) and legalized rather than founded the faith, so he cannot explain growth that happened before him.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-confucianism-religion',
      kind: 'misconception_check',
      question:
        'A student says: "Confucianism is China\'s religion — people worship Confucius as a god, the same way Christians worship Jesus." What needs correcting?',
      commonErrors: [
        {
          answer: 'Confucianism is a religion centered on worshipping Confucius as a divine figure',
          misconception: 'Assuming every belief system must have a god and a worshipped founder, so any organized set of Chinese teachings gets sorted into the same category as Christianity.',
          correctsTo:
            'Confucianism is best described as an ethical and political philosophy. Confucius (551–479 BCE) never claimed divinity and focused on this world: the five relationships, filial piety, and rulers who govern by moral example. Honoring ancestors is respect within a family line, not worship of Confucius. And "China\'s religion" is the wrong frame entirely — the same person could follow Confucian ethics at court, Daoist ideas about nature at home, and Buddhist practice for questions about suffering and death. These traditions coexisted rather than competing for exclusive membership.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six systems, six cores: Hinduism (dharma, karma, reincarnation, no founder); Buddhism (Siddhartha Gautama, Four Noble Truths, Eightfold Path); Confucianism (social harmony, filial piety, five relationships); Daoism (harmony with nature, wu wei); Judaism (one God, covenant, Torah law); Christianity (Jesus, love of God and neighbor, spread through Rome).',
        'Ideas travel on three engines: trade routes (Silk Roads monasteries), empires (Ashoka\'s missionaries after c. 260 BCE; Rome\'s roads and Greek language), and missionaries who taught abroad — and they adapt to local culture on arrival.',
        'Buddhism split into Theravada (Sri Lanka, Southeast Asia) and Mahayana (East Asia) and faded in India; Christianity went from persecuted to legalized (313 CE) to official (380 CE) inside the Roman Empire.',
        'Not all belief systems are the same kind of thing: Confucianism and Daoism are primarily ethical and philosophical, Judaism and Christianity are monotheistic faiths, and Hinduism and Buddhism share vocabulary but differ in founder, authority, and structure.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'World Belief Systems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
