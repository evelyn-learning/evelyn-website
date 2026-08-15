/**
 * World History — Regional Civilizations: The Medieval Church & the Crusades.
 *
 * The one institution that reached every village when no king could — and
 * what happened when it called two hundred years of holy war. Feudalism
 * (4.2) explains who held the swords; this lesson explains who could tell
 * them where to point. The trade routes, port cities, and translated books
 * that come back from the eastern Mediterranean set up the late Middle
 * Ages and everything after. Salvaged factual spine from the legacy
 * medieval-Europe seed, reframed subject-first.
 * C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U4_CHURCH_AND_CRUSADES: LessonPlan = {
  id: 'evelyn.hs.whist.church-and-crusades.v1',
  title: 'The Medieval Church & the Crusades',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.church-and-crusades',
      standard: 'WHIST-4.3',
      description:
        'Explain how the medieval Catholic Church became western Europe\'s one universal institution and contested authority with kings, and evaluate the causes and long-term consequences of the Crusades for Europe, Byzantium, and the eastern Mediterranean (C3 D2.His.1.9-12, D2.His.14.9-12).',
    },
  ],
  prerequisites: ['whist.feudal-europe'],
  followUps: ['whist.late-middle-ages'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Church as the only institution that reached everyone — and show what it could do with that reach.',
      script:
        'In January 1077, the most powerful ruler in Europe stood outside a castle gate in the Italian Alps, in the snow, for three days, waiting to be let in. Henry IV ruled the German lands and northern Italy and commanded armies. The man inside was Pope Gregory VII, who commanded none — and who had just cut Henry off from the Church, which released Henry\'s own nobles from obeying him. No soldiers were needed. Eighteen years later, another pope stood up at a council in France and asked armed Christians to march two thousand miles to take Jerusalem, and tens of thousands went. Today we work out where that authority came from, what happened when it collided with kings, and how two centuries of holy war ended up reopening trade routes, enriching Venice, wrecking Byzantium, and leaving wounds between three religions that people still argue about.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-church-and-crusades',
      kind: 'concept',
      goal: 'The Church as universal institution, the clash with kings, why the Crusades began, and what they actually changed.',
      keyIdeas: [
        'ONE UNIVERSAL INSTITUTION — in a western Europe with no unified state, the Catholic Church was the only organization present in every village from Ireland to Poland, with a single head (the pope), a chain of command (pope, archbishops, bishops, parish priests), and its own courts. Kings ruled patches of land; the Church reached everyone.',
        'CRADLE TO GRAVE, AND AFTER — the Church\'s hold was built on the sacraments: baptism, marriage, confession, and last rites marked every stage of a life, and in a society that took eternal punishment literally, the power to withhold them was enormous. EXCOMMUNICATION cut one person off from the sacraments; the INTERDICT suspended them across an entire kingdom, pressuring a ruler by pressuring everyone he governed.',
        'THE CHURCH\'S POWER WAS MATERIAL TOO — the tithe (a tenth of income, owed by everyone) funded it; canon law, its own legal code, judged marriage, wills, oaths, and clergy in Church courts rather than royal ones; and centuries of donations made the Church the largest landholder in Europe. It was simultaneously a faith, a government, a court system, and a landlord.',
        'LATIN LITERACY AND THE MONASTERIES — nearly everyone who could read and write was a churchman, so kings had to staff their governments with clergy, and Latin served as the shared language of worship, law, scholarship, and diplomacy across dozens of spoken tongues. Monks and nuns following the Benedictine rule copied manuscripts by hand, preserving Roman and Greek texts that would otherwise have been lost, and ran schools, hospitals, and farms. Wealth and royal meddling corrupted many houses, so reform came from inside: the abbey of Cluny, founded in 910 and answering to the pope alone, spread a movement demanding independence from local lords — and that reforming energy is exactly what pushed the popes to confront kings.',
        'CHURCH VERSUS CROWN — THE INVESTITURE CONTROVERSY — who appoints bishops? Bishops held huge estates and troops, so kings had long installed loyal men themselves. Pope Gregory VII banned lay investiture; Emperor Henry IV refused; Gregory excommunicated him in 1076, freeing his nobles from their oaths. Henry crossed the Alps and did public penance at Canossa in 1077 to have it lifted — a political calculation more than a surrender, since the fight resumed and Henry later drove Gregory from Rome. The compromise came in 1122 at the Concordat of Worms: the Church invests bishops with spiritual office, the king with their lands. The lasting lesson is that excommunication was a weapon that worked because obedience to a ruler was itself understood as a religious duty.',
        'WHY THE CRUSADES BEGAN — several causes at once, not one. The Seljuk Turks defeated Byzantium badly at Manzikert in 1071 and took most of Anatolia, so Emperor Alexios I asked the pope for western troops — he wanted mercenaries, and got something far larger. At the Council of Clermont in 1095, Pope Urban II called on Christians to recover Jerusalem and promised that those who went would have the penalties for their sins remitted. Add land-hungry younger sons who would inherit nothing, Italian merchants who wanted eastern ports, and a papacy eager to lead a united Christendom and perhaps heal the 1054 split with the Orthodox East.',
        'HOW THE CRUSADES WENT — the First Crusade captured Jerusalem in 1099 after a brutal siege in which the Muslim and Jewish inhabitants were massacred, and set up small crusader states along the coast. It was the only major military success. Saladin retook Jerusalem in 1187; the Third Crusade (1189–1192) failed to win it back and settled for guaranteed pilgrim access. The Fourth Crusade never reached the Holy Land at all: diverted by Venetian debts and Byzantine politics, it sacked Christian Constantinople in 1204, permanently crippling the empire and hardening the East–West rift. The last mainland crusader stronghold, Acre, fell in 1291.',
        'THE CONSEQUENCES THAT ACTUALLY MATTER — measured by their stated goal the Crusades failed, yet they reshaped Europe. Sustained contact revived trade with the eastern Mediterranean (sugar, spices, silk, cotton, glass, paper) and made Venice and Genoa rich and powerful. Greek philosophy and science, Arabic mathematics, medicine, and astronomy flowed back into European universities, much of it through Muslim Spain and Sicily as well. Kings taxed and organized for war, strengthening royal power, while nobles who mortgaged estates or died abroad weakened the feudal order. Byzantium never recovered from 1204. And the wars left durable bitterness between Christians, Muslims, and Jews — including massacres of Jewish communities in the Rhineland in 1096, before the armies ever left Europe.',
      ],
      vocabulary: [
        { term: 'excommunication', definition: 'formal exclusion from the sacraments and the community of the Church — spiritually terrifying and, for a ruler, politically dangerous because it released subjects from their duty to obey.' },
        { term: 'lay investiture', definition: 'the appointment of bishops and abbots by kings or nobles rather than by the Church — the practice at the heart of the struggle between Gregory VII and Henry IV.' },
        { term: 'Crusade', definition: 'a military campaign called by the papacy, from 1095 onward, aimed chiefly at taking and holding Jerusalem and the surrounding region.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causal-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how does a Turkish victory in eastern Anatolia in 1071 end with Venetian merchants growing rich and Greek science arriving in European universities?',
      steps: [
        'Start at Manzikert, 1071. The Seljuk Turks crush a Byzantine army and take most of Anatolia — the recruiting ground and breadbasket that had kept Byzantium standing. The empire is suddenly too weak to fix this alone.',
        'Follow the appeal westward. Emperor Alexios I asks the pope for western fighting men. Note what he requests: hired soldiers under his own command, not an independent army of armed pilgrims with its own goals.',
        'Follow what the papacy does with the request. At Clermont in 1095, Urban II converts a limited military favor into something far bigger — a call to recover Jerusalem, with the penalties for sin remitted for those who go. The offer answers real anxieties, and it also puts the pope at the head of all of Christendom.',
        'Follow who answers and why. Knights bound by feudal service, younger sons with no inheritance, and genuine pilgrims all take the cross — and Italian port cities agree to move and supply them, for a price. Tens of thousands travel east, and in 1099 Jerusalem falls to the First Crusade.',
        'Follow the shipping, not the battles. Two centuries of armies needing transport, food, weapons, and money mean permanent sea lanes between Italy and the eastern Mediterranean. Venice and Genoa build fleets, warehouses, and banking to serve that traffic — and keep trading long after the fighting stops.',
        'Follow what travels on those ships besides cargo. Sugar, spices, cotton, and glass move west, and so do texts: Greek philosophy and science preserved and expanded in the Islamic world, Arabic mathematics, medicine, and astronomy. Translated in centers such as Toledo and Sicily as well as through crusader contact, these books land in the new universities.',
        'Close the chain, including the irony. A defeat in Anatolia produced an appeal, the appeal produced a holy war, the war failed at its stated goal — and its side effects (trade, cities, ideas) mattered far more than its conquests, while the empire that asked for help was wrecked by the Fourth Crusade in 1204.',
      ],
      answer:
        'Manzikert (1071) forced a Byzantine appeal, which Urban II turned into the Crusades (1095); two centuries of supplying those armies built permanent Italian trade networks with the eastern Mediterranean, and along those routes came the Greek and Arabic learning that fed European universities — consequences nobody intended and Byzantium did not survive.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-clermont-source',
      kind: 'worked_example',
      problem:
        'A chronicler recorded Pope Urban II\'s appeal at Clermont in 1095 (paraphrased): "Our brothers in the East cry out for help, for the Turks have overrun their lands; let those who once fought their own countrymen for plunder now fight a war worth fighting, and whoever dies on the road shall have his sins\' penalty remitted." Work out what this short account reveals about why the First Crusade drew so many people.',
      steps: [
        'Source it first. This is a chronicler\'s report of a speech, written down after the fact by someone who knew the crusade had already been called — so it captures the appeal as people remembered and retold it, which is exactly what makes it useful for asking why they answered.',
        'Read the first appeal: rescue. "Our brothers in the East cry out for help" frames the war as defensive aid to fellow Christians under attack — an answer to the Byzantine request, and a claim that responds to duty rather than ambition.',
        'Read the second appeal: redirection. "Those who once fought their own countrymen for plunder" is a direct comment on Europe\'s own problem — knights raiding each other constantly. The Church had already tried to limit that violence through the Peace and Truce of God; here it proposes exporting the violence instead.',
        'Read the third appeal, and the strongest one: salvation. The promise that the penalty for sins would be remitted speaks to a society that took judgment after death literally. For a knight whose profession involved killing, this reframed his exact skill set as a route to salvation.',
        'Notice the motives the passage does not mention. Nothing here about land for landless younger sons, plunder, Italian merchants seeking eastern ports, or the papacy\'s interest in leading a united Christendom and healing the 1054 split with the Orthodox Church. A source can be accurate about what it says and still be incomplete.',
        'Weigh it as evidence. Use this to explain the appeal\'s persuasive power — duty, an outlet for warriors, and salvation combined — but not as a full account of causes, and not as proof of what any individual crusader personally believed.',
      ],
      answer:
        'The appeal worked by stacking three motives at once — defending eastern Christians, redirecting Europe\'s knightly violence outward, and offering remission of sin\'s penalty to a society that feared judgment — while saying nothing about the land hunger, merchant profit, and papal ambition that historians count among the causes too.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-excommunication',
      kind: 'try_yourself',
      problem:
        'In 1076 Pope Gregory VII excommunicated Emperor Henry IV, and within months Henry crossed the Alps to do public penance at Canossa. Why was excommunication such an effective weapon against a ruler who commanded armies?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It released his nobles from their oaths of obedience, so his own vassals could rebel without breaking faith', correct: true },
        { id: 'b', text: 'It gave the pope command of a larger army than the emperor\'s' },
        { id: 'c', text: 'It automatically transferred the emperor\'s lands and treasury to the papacy' },
        { id: 'd', text: 'It was purely a private spiritual matter with no effect on politics' },
      ],
      expectedAnswer: 'It released his nobles from their oaths of obedience, so his own vassals could rebel without breaking faith',
      hints: [
        'The pope had no soldiers. Ask instead what held Henry\'s nobles to him in the first place — and what that bond was sworn on.',
        'Feudal loyalty was a religious oath. Cut the emperor out of the Church and the oath loses its footing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-crusade-cause',
      kind: 'try_yourself',
      problem:
        'What was the immediate trigger that led Pope Urban II to call the First Crusade at Clermont in 1095?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Byzantine emperor appealed to the West for military help after the Seljuk Turks took most of Anatolia following Manzikert in 1071', correct: true },
        { id: 'b', text: 'Ottoman armies captured Constantinople and threatened Rome' },
        { id: 'c', text: 'European merchants had already opened trade routes to the East and asked for protection' },
        { id: 'd', text: 'The Concordat of Worms required the pope to raise an army for the emperor' },
      ],
      expectedAnswer: 'The Byzantine emperor appealed to the West for military help after the Seljuk Turks took most of Anatolia following Manzikert in 1071',
      hints: [
        'Check the calendar on each option — Constantinople falls to the Ottomans in 1453, more than three centuries after Clermont.',
        'Trade with the eastern Mediterranean grew as a RESULT of the Crusades; look for the cause that came before 1095.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-consequences',
      kind: 'try_yourself',
      problem:
        'The Crusades failed to hold Jerusalem, yet historians call them a turning point for Europe. Which outcome best supports that judgment?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Revived trade with the eastern Mediterranean enriched Italian port cities such as Venice and Genoa and carried Greek and Arabic learning back into Europe', correct: true },
        { id: 'b', text: 'Europe permanently ruled the Holy Land and converted its population' },
        { id: 'c', text: 'They strengthened the Byzantine Empire by securing its eastern frontier' },
        { id: 'd', text: 'They united the Catholic and Orthodox churches and ended the 1054 split' },
      ],
      expectedAnswer: 'Revived trade with the eastern Mediterranean enriched Italian port cities such as Venice and Genoa and carried Greek and Arabic learning back into Europe',
      hints: [
        'Separate the military scoreboard from the economic and intellectual results — the lasting effects were mostly unintended.',
        'Ask what kept moving along those sea routes after the last crusader stronghold, Acre, fell in 1291.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fourth-crusade',
      kind: 'misconception_check',
      question:
        'A student writes: "The Crusades were always Christians fighting Muslims, and Byzantium was Europe\'s partner throughout, so the Crusades helped protect it." What needs correcting?',
      commonErrors: [
        {
          answer: 'Every crusade was Christians versus Muslims, and the Crusades protected Byzantium',
          misconception: 'Treating "Christendom" as one united side and assuming a war launched partly in response to a Byzantine appeal must therefore have benefited Byzantium — tidy religious sides standing in for the messier record.',
          correctsTo:
            'Christendom was not one side. The Catholic West and Orthodox East had split in 1054 and distrusted each other from the start; Alexios I had asked for hired soldiers under his own command and instead received independent armies with their own aims. The clearest evidence is the Fourth Crusade: entangled in Venetian debts and Byzantine succession politics, it never reached the Holy Land and instead besieged and sacked Constantinople — a Christian capital — in 1204, carrying off its wealth and relics. Byzantium was retaken by Greek rulers in 1261 but never recovered its strength, and the sack deepened the East–West rift for centuries. Crusading violence also struck non-combatants inside Europe, including massacres of Jewish communities in the Rhineland in 1096. So: the Crusades did not protect Byzantium — they helped destroy it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Church was medieval Europe\'s one universal institution: sacraments from cradle to grave, the tithe, canon law and its own courts, a near-monopoly on Latin literacy, and monasteries preserving manuscripts — reformed from within by Cluny (founded 910).',
        'The investiture controversy pitted Gregory VII against Henry IV over who appoints bishops: excommunication in 1076 freed Henry\'s nobles from their oaths, forcing his penance at Canossa in 1077; the Concordat of Worms split the difference in 1122.',
        'The Crusades had stacked causes: the Byzantine appeal after Manzikert (1071), Urban II\'s call at Clermont (1095) with remission of sin\'s penalty, landless knights, and merchants seeking eastern ports.',
        'Militarily they mostly failed — Jerusalem taken in 1099 and lost in 1187, and the Fourth Crusade sacked Christian Constantinople in 1204 instead, crippling Byzantium and deepening the East–West rift.',
        'The consequences that lasted were unintended: trade revival with the eastern Mediterranean, the rise of Venice and Genoa, Greek and Arabic learning flowing into European universities, stronger kings and weaker nobles — and enduring bitterness among Christians, Muslims, and Jews.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'The Medieval Church & the Crusades' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
