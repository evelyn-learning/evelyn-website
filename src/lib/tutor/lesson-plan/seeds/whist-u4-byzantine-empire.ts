/**
 * World History — Regional Civilizations: The Byzantine Empire.
 *
 * The half of Rome that never fell. This lesson is the course's big
 * continuity callback (Unit 2's "fall of Rome" was only half a fall) and
 * a supply line running forward: Justinian's law into European legal
 * systems, Cyrillic into the Slavic world, and Greek manuscripts carried
 * west in 1453 into the Renaissance (6.1). Factual spine salvaged from
 * the legacy medieval-Europe seed and reframed subject-first.
 * C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U4_BYZANTINE_EMPIRE: LessonPlan = {
  id: 'evelyn.hs.whist.byzantine-empire.v1',
  title: 'The Byzantine Empire',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.byzantine-empire',
      standard: 'WHIST-4.1',
      description:
        "Explain how the eastern Roman empire survived the fall of the west, analyze Justinian's legal, religious, and architectural legacy and the causes of the Great Schism, and trace Byzantine cultural transmission to the Slavic world and to Renaissance Europe (C3 D2.His.1.9-12, D2.His.14.9-12).",
    },
  ],
  prerequisites: ['whist.mongol-empire'],
  followUps: ['whist.feudal-europe'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Overturn the "Rome fell in 476" story students arrive with — and show that the surviving half shipped its law, its faith, and its books into the modern world.',
      script:
        'You have probably been told that Rome fell in 476. Half true — and the half nobody mentions ran for another thousand years. While western Europe broke into small kingdoms, the eastern Roman empire kept its capital, its taxes, its army, and its emperors, ruling from Constantinople until 1453. Its people never called themselves Byzantines; they called themselves Romans, because they were. And when their city finally fell, scholars fled west carrying crates of Greek manuscripts that had survived nowhere else — helping ignite the Renaissance. Today: how one half of an empire outlived the other by a millennium, and what it handed us on the way out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-byzantium',
      kind: 'concept',
      goal: "Continuity from Rome, Constantinople's defenses, Justinian's century, the Great Schism, Slavic transmission, and the long decline to 1453.",
      keyIdeas: [
        'THE EMPIRE THAT DIDN\'T FALL — 476 CE deposed the last WESTERN emperor. The eastern half, governed from Constantinople since Constantine refounded the city in 330 CE, simply kept going: same laws, same taxes, same title. Its people called themselves Romans (Rhomaioi) to the very end. "Byzantine" is a label invented by historians centuries later — nobody living there ever used it.',
        "WHY THE EAST SURVIVED — money, geography, and one unconquerable city. The east held Egypt's grain, the crowded cities of Syria and Anatolia, and the trade crossroads between the Mediterranean and Asia, so it could tax, hire soldiers, and pay invaders to go elsewhere; the poorer, more rural west could not. Constantinople itself sat on a peninsula guarded by water on three sides, astride the Bosporus strait and the sea route to the Black Sea. The Theodosian Walls (built and rebuilt in the 400s CE) made it the hardest target in the medieval world, and Greek fire — a liquid incendiary that burned on water, its recipe a state secret — wrecked besieging fleets.",
        "JUSTINIAN (RULED 527-565) — the most consequential emperor. He ordered Roman law compiled and rationalized into the Corpus Juris Civilis (Justinian's Code); rebuilt Hagia Sophia with its enormous dome after riots burned the old church; and sent generals to reconquer Italy, North Africa, and southern Spain. His wife Theodora, a former performer, talked him out of fleeing during the Nika riots of 532 and helped save his throne.",
        'THE OVERREACH AND THE PLAGUE — the reconquests were expensive, thinly garrisoned, and mostly lost within a century. Then the plague of Justinian struck (beginning 541 CE), killing a huge share of the population, gutting tax revenue and army recruitment. Lesson worth naming: military triumph plus demographic catastrophe can leave a state weaker than it started.',
        "THE LAW OUTLIVED THE EMPIRE — Justinian's Code preserved a thousand years of Roman legal thinking in one usable body. Rediscovered in western Europe from the 1000s onward and taught in the new universities, it became the foundation of the civil-law tradition still used across continental Europe and Latin America today.",
        'GREEK, ORTHODOX, AND DRIFTING FROM ROME — the east spoke Greek, not Latin; its emperors claimed authority over church affairs, while western popes claimed supreme authority over all Christians. Add disputes over the wording of the creed, whether clergy could marry, and the veneration of icons, and the two halves of Christianity drifted for centuries. In 1054 the pope\'s representative and the patriarch of Constantinople excommunicated each other — the GREAT SCHISM, splitting Christianity into Roman Catholic and Eastern Orthodox. The split was the hardening of a long drift, not a sudden argument.',
        "TRANSMISSION TO THE SLAVIC WORLD — Byzantine missionaries Cyril and Methodius preached to Slavic peoples in the 800s CE in their own language, devising a written script for it; their followers developed the Cyrillic alphabet, named for Cyril and still used for Russian, Ukrainian, Bulgarian, and Serbian. When Kievan Rus converted to Orthodox Christianity around 988 CE, it took Byzantine faith, art, and architecture with it — which is why Moscow later called itself the 'third Rome.'",
        'DECLINE, 1204, AND 1453 — squeezed for centuries between western powers and advancing Turkish forces, the empire shrank steadily. In 1204 crusaders of the Fourth Crusade sacked Constantinople itself and ruled it until 1261; the city never recovered its wealth. In 1453 Ottoman sultan Mehmed II broke the walls with heavy cannon and took the city, ending the Roman state after roughly 1,500 years. Greek-speaking scholars fled west with manuscripts of Plato, Aristotle, and Greek science — fuel for the Renaissance you meet in Unit 6.',
      ],
      vocabulary: [
        {
          term: 'Byzantine Empire',
          definition:
            'the eastern Roman empire, ruled from Constantinople from 330 CE to 1453 — a later historians\' name for a state whose own people called themselves Romans.',
        },
        {
          term: "Justinian's Code",
          definition:
            'the Corpus Juris Civilis, Roman law collected and organized under Justinian in the 500s CE — later the foundation of European civil law.',
        },
        {
          term: 'Great Schism',
          definition:
            'the 1054 formal split of Christianity into Roman Catholic (west, Latin, papal authority) and Eastern Orthodox (east, Greek, patriarchs and emperor).',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-east-survived',
      kind: 'worked_example',
      problem:
        'Build the causal chain: the same empire, the same century, the same invaders on the move — so why did the western half collapse by 476 CE while the eastern half survived another thousand years?',
      steps: [
        'Start with money, because armies run on it. The eastern provinces — Egypt, Syria, Anatolia, Greece — held the empire\'s densest cities and its grain surplus. Taxable wealth meant the east could pay soldiers, hire allies, and simply bribe invading groups to move on. The west, poorer and more rural, could not.',
        'Add geography. The west had to defend a long, porous land frontier along the Rhine and Danube against groups being pushed westward. The east\'s frontier was shorter, and its capital sat behind water and the Theodosian Walls — attackers who could overrun a western province bounced off Constantinople.',
        'Follow the migrations. Groups crossing into the empire were often deflected westward by eastern diplomacy and fortifications, concentrating the pressure on Italy, Gaul, and Spain — the half least able to absorb it.',
        'Watch the institutions. In the west, real power drained to landowning aristocrats and Germanic commanders while emperors became figureheads. In the east, a functioning bureaucracy kept collecting taxes and appointing officials, so the state survived even bad emperors.',
        'Close the chain: wealth funded defense, geography concentrated the damage on the west, and a working bureaucracy kept the eastern state coherent. 476 CE removed a western figurehead; the eastern half of the same empire never missed a year of government.',
      ],
      answer:
        "The east had more taxable wealth, a shorter and better-fortified frontier centered on Constantinople, and an intact bureaucracy — so it could pay, deflect, or absorb the same pressures that dismantled the west's government.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rus-envoys',
      kind: 'worked_example',
      problem:
        'A later Rus chronicle describes envoys sent around 987 CE to inspect neighboring faiths (paraphrased): "We went to the Greeks, and they led us to the building where they worship their God, and we did not know whether we stood in heaven or on earth, for on earth there is no such splendor. We only know that God dwells there among them, and we cannot forget that beauty." What does this account help explain, and what should a careful reader keep in mind about it?',
      steps: [
        'Identify the setting first. "The Greeks" means the Byzantines, and the building is almost certainly Hagia Sophia in Constantinople — Justinian\'s domed church, deliberately built to overwhelm anyone who walked in. Byzantine liturgy paired that space with gold mosaics, incense, and chant.',
        'Read what the envoys are actually reporting: not doctrine, not scripture, not an argument. They report an EXPERIENCE — beauty so total they could not locate themselves. Byzantine religious architecture and ritual were designed to do exactly this, and here it works.',
        "Connect it to the outcome. Kievan Rus adopted Orthodox Christianity around 988 CE. With the faith came Byzantine church architecture, icon painting, and the Cyrillic alphabet that Cyril and Methodius's followers had developed for Slavic languages — a whole cultural package moving north.",
        'Weigh the source honestly. This is a chronicle written down long after the events, by Orthodox churchmen, about why their own ruler chose their own faith. It is shaped to make the choice look inevitable and divinely confirmed. Treat it as evidence of how Byzantine influence was REMEMBERED and justified, not as a transcript of a diplomatic trip.',
        "Then note what the account leaves out: Rus rulers also had hard political reasons to align with Constantinople — trade down the Dnieper to the Black Sea, a marriage alliance with the imperial family, and prestige. Splendor was real, but it was not the only argument in the room.",
      ],
      answer:
        "It shows Byzantine worship and architecture working as cultural persuasion — the pathway by which Orthodox Christianity, Byzantine art, and Cyrillic writing reached the Slavic world — while a careful reader treats a later, church-written chronicle as a justification story that omits the trade and alliance motives behind the conversion.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-east-survival',
      kind: 'try_yourself',
      problem:
        'Which best explains why the eastern Roman empire survived the crises of the 400s CE while the western half collapsed?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The east held more taxable wealth and a shorter, better-fortified frontier centered on Constantinople, so it could pay for or repel the pressures that broke the west',
          correct: true,
        },
        { id: 'b', text: 'The eastern provinces were never reached by migrating or invading groups' },
        { id: 'c', text: 'Eastern emperors adopted Christianity while western emperors remained pagan' },
        { id: 'd', text: "Justinian's reconquests in the 500s CE prevented the western half from falling" },
      ],
      expectedAnswer:
        'The east held more taxable wealth and a shorter, better-fortified frontier centered on Constantinople, so it could pay for or repel the pressures that broke the west',
      hints: [
        'Ask what a late Roman government actually needed to survive: revenue to pay an army, and a defensible place to put it.',
        'Check the dates on any answer that names Justinian — he ruled in the 500s, decades AFTER 476.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-schism',
      kind: 'try_yourself',
      problem:
        'What best explains the Great Schism of 1054, which divided Christianity into Roman Catholic and Eastern Orthodox churches?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Centuries of drift over papal authority, the Greek and Latin languages, and religious practice hardened into a formal break',
          correct: true,
        },
        { id: 'b', text: "The crusaders' sack of Constantinople in 1204 forced the eastern church to separate" },
        { id: 'c', text: 'Byzantine emperors abandoned Christianity and adopted a different religion' },
        { id: 'd', text: 'Ottoman armies captured Constantinople in 1054 and installed a new church' },
      ],
      expectedAnswer:
        'Centuries of drift over papal authority, the Greek and Latin languages, and religious practice hardened into a formal break',
      hints: [
        'A split that permanent rarely starts in the year it becomes official — look for the slow causes underneath the date.',
        'Two of these answers are dated wrong: 1204 and 1453 both come AFTER 1054, so neither can have caused it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-1453-renaissance',
      kind: 'try_yourself',
      problem:
        'How did the Ottoman capture of Constantinople in 1453 contribute to the Renaissance in western Europe?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Greek-speaking scholars fled westward carrying manuscripts of classical texts, strengthening the revival of Greek learning in Italy',
          correct: true,
        },
        { id: 'b', text: 'The conquest destroyed all Greek writings, so classical learning stayed lost until the 1800s' },
        { id: 'c', text: 'The Renaissance began in 1453 and had no roots before that year' },
        { id: 'd', text: 'The fall of the city reunited the Catholic and Orthodox churches, freeing scholars to study' },
      ],
      expectedAnswer:
        'Greek-speaking scholars fled westward carrying manuscripts of classical texts, strengthening the revival of Greek learning in Italy',
      hints: [
        'Ask what physically moved in 1453 — people leaving a captured city do not travel empty-handed.',
        'The Renaissance was already underway in Italy by 1453; the refugees accelerated it by supplying Greek texts and teachers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-new-empire',
      kind: 'misconception_check',
      question:
        'A student writes: "After Rome fell in 476, a brand-new empire called Byzantium was founded in the east." What needs correcting?',
      commonErrors: [
        {
          answer: 'Byzantium was a new empire founded after Rome fell',
          misconception:
            'Treating the later historians\' label "Byzantine" as the name of a separate state, and assuming 476 CE ended the Roman empire everywhere rather than only in the west.',
          correctsTo:
            'Nothing was founded in 476. The empire had been administered in eastern and western halves for over a century, with an eastern capital at Constantinople since 330 CE. When the last western emperor was deposed, the eastern half continued without interruption — same laws, same taxes, same imperial title — and its people called themselves Romans (Rhomaioi) right up to 1453. "Byzantine" is a convenient label historians applied centuries afterward. Continuity, not refounding.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '476 CE ended the WESTERN empire only; the eastern half ruled from Constantinople until 1453 and called itself Roman the whole time.',
        'It survived on wealth, a short defensible frontier, the Theodosian Walls, Greek fire, and a bureaucracy that outlasted weak emperors.',
        "Justinian (527-565): the Code that became the base of European civil law, Hagia Sophia, Theodora and the Nika riots — then costly reconquests and the plague of 541 CE that drained the state.",
        'The Great Schism of 1054 formalized centuries of drift over papal authority, language, and practice: Roman Catholic west, Eastern Orthodox east.',
        'Byzantium exported its culture north — Cyril and Methodius, the Cyrillic alphabet, and the conversion of Kievan Rus around 988 CE.',
        'Sacked by crusaders in 1204, taken by the Ottomans in 1453 — and the scholars who fled carried Greek manuscripts west into the Renaissance.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'The Byzantine Empire' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
