/**
 * World History — Regional Civilizations: Feudal Europe.
 *
 * What people build when the state disappears: with Rome gone in the west,
 * Charlemagne's empire split, and raiders arriving from three directions,
 * Europeans traded freedom for protection and rebuilt authority from the
 * ground up — a bargain Japan reached independently, and one that towns
 * (4.4) will eventually dissolve. Salvaged factual spine from the legacy
 * medieval-Europe seed, reframed subject-first.
 * C3 D2.His.14.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U4_FEUDAL_EUROPE: LessonPlan = {
  id: 'evelyn.hs.whist.feudal-europe.v1',
  title: 'Feudal Europe: Lords, Vassals & Manors',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.feudal-europe',
      standard: 'WHIST-4.2',
      description:
        'Explain why feudalism and manorialism emerged from the collapse of central authority in western Europe, describe the mutual obligations that bound lords, vassals, and serfs, and compare this decentralized order to the parallel system that developed in Japan (C3 D2.His.14.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.byzantine-empire'],
  followUps: ['whist.church-and-crusades'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame feudalism as a rational answer to a terrifying question: who protects you when there is no government?',
      script:
        'Imagine there is no police force, no army, no courts, no tax collector — because there is no government left to run them. That was western Europe in the 800s and 900s. Rome was long gone, Charlemagne\'s empire had split among quarreling grandsons, and Viking longships were sailing up the rivers while Magyar horsemen rode in from the east. If raiders burned your village, nobody was coming to help. So people made a deal: the man with the armored horsemen would protect you, and in exchange you gave him your service, your crops, or your loyalty for life. That deal built the next six hundred years of European society — and, remarkably, samurai Japan struck almost the same bargain on the other side of the world.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-feudal-europe',
      kind: 'concept',
      goal: 'Why feudalism appeared, how the contract worked, how the manor fed it, and why it counts as a form of government.',
      keyIdeas: [
        "WHY IT APPEARED — a power vacuum, not a plan. The western Roman Empire ended in 476 CE; Charlemagne briefly reassembled much of western Europe and was crowned emperor in 800 CE, but his empire was divided among his grandsons by the Treaty of Verdun in 843 and kept fragmenting. Then came a century of raids from three directions: Vikings from the north (Lindisfarne, 793), Magyars from the east, and Muslim raiders along the Mediterranean coast. With no empire-wide army or tax system, protection had to be organized locally — by whoever could afford armored horsemen.",
        'THE FEUDAL CONTRACT IS MUTUAL — this is the idea students most often get backwards. A lord granted a vassal a fief (land and the peasants working it). In return the vassal knelt, placed his hands in the lord\'s, and swore homage and fealty, promising military service (commonly about 40 days a year), counsel in the lord\'s court, and aid in emergencies such as ransoming the lord. The lord owed protection and justice back. Both sides could break faith; both sides could be called out for it. It was an exchange, not one-way tyranny.',
        'THE "PYRAMID" LEAKED — the neat diagram of king → nobles → knights → peasants is a simplification. Vassals granted fiefs to their own vassals (subinfeudation), and an ambitious noble might hold land from two rival lords at once, owing service to both. Loyalty was a tangled web, and conflicting oaths were a routine cause of private war.',
        "KNIGHTS AND CHIVALRY — IDEAL VS REALITY. A mounted, armored knight was ferociously expensive: warhorse, mail, weapons, squire, years of training. The fief existed to pay for exactly that. Chivalry — protect the weak, keep your word, show mercy — was an ideal preached hard by the Church (movements like the Peace of God and Truce of God tried to ban fighting on holy days and near churches) precisely BECAUSE knights in practice raided, extorted, and fought each other constantly.",
        'MANORIALISM IS THE ECONOMIC BASE — keep the two systems straight: feudalism organizes who owes whom military service and loyalty; manorialism organizes who grows the food. The manor was a near-self-sufficient village: the lord\'s own fields (the demesne), peasant strips, a mill, a church, woods and pasture. Nearly everything was made on site, and most people never traveled more than a few miles from where they were born.',
        'SERFS WERE NOT ENSLAVED PEOPLE — the distinction matters. Serfs were bound to the land: they owed labor days on the demesne, dues in grain and eggs, fees to use the mill and oven, and needed the lord\'s permission to marry off the manor or leave. But they were not property. They could not be bought and sold as individuals apart from the land, and custom guaranteed them their strips, their cottage, and their family. Not free — and not enslaved.',
        'A QUIET FARMING REVOLUTION UNDERNEATH — three-field rotation (one field to winter grain, one to spring crops such as beans and peas, one resting) replaced the older two-field system, and the heavy moldboard plow, the horse collar, and water mills spread with it. Beans restored nitrogen and fed people protein. More food meant more people — and eventually a surplus that could feed somebody who was NOT a farmer, which is how towns and fairs come back (4.4) and how serfdom starts to dissolve.',
        'FEUDALISM AS GOVERNMENT — power was LOCAL. The lord held court, judged disputes, collected dues, and raised troops; kings had grand titles but very little machinery, often controlling little beyond their own family lands. Same problem, same answer somewhere else: as central authority weakened in Japan from the late 1100s, warrior lords (daimyo) and their samurai retainers built a strikingly similar arrangement — land and protection exchanged for armed service, with an emperor reduced to a ceremonial figure while a shogun and his warriors actually ruled. Two societies with no contact reached comparable solutions to the same problem.',
      ],
      vocabulary: [
        { term: 'fief / vassal', definition: "the grant of land a lord gives / the man who receives it and owes the lord military service and loyalty in return." },
        { term: 'manorialism', definition: 'the economic system of the self-sufficient farming estate, where peasants worked the lord\'s land in exchange for protection and the right to farm strips of their own.' },
        { term: 'serf', definition: 'a peasant legally bound to the manor — owing labor and dues and unable to leave freely, but not owned as property and not sellable apart from the land.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causal-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how does the collapse of central authority in western Europe end in a peasant owing three days of labor a week to a knight on a hill?',
      steps: [
        'Start with the vacuum: Rome ended in the west in 476 CE, and Charlemagne\'s revived empire — he was crowned in 800 CE — was split by the Treaty of Verdun in 843 and kept splintering. No empire-wide army, no tax system, no courts with reach.',
        'Add the threat: through the 800s and 900s, Viking raiders came up the rivers, Magyar horsemen rode in from the east, and Muslim raiders struck the Mediterranean coasts. Villages were burned faster than any distant king could respond.',
        'Follow the need for defense: the only effective answer to a fast raid is a fast, armored, mounted fighter stationed nearby. But a knight is enormously expensive — horse, armor, weapons, training, no time left to farm.',
        'Follow the money: there is barely any coined money in circulation, so the only wealth a lord can pay with is LAND. He grants a fief; the vassal swears homage and fealty and turns up armed when called. Military service is purchased with acres instead of wages.',
        'Follow the land down: the fief is only valuable if somebody farms it. Peasants accept binding to the manor — labor days, dues, restricted movement — in exchange for protection behind the lord\'s walls and a guaranteed strip of their own.',
        'Close the chain: no central state → constant raids → local armored defenders → land granted instead of pay → peasants tied to that land to make it produce. Feudalism and manorialism are two halves of one survival system, assembled piece by piece rather than designed.',
      ],
      answer:
        'Collapse of central authority plus relentless raiding forced defense to become local; with no cash economy, land became the only way to pay armored defenders, and serfdom became the way to make that land pay.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-homage-source',
      kind: 'worked_example',
      problem:
        'A chronicler in Flanders described a ceremony around 1127 CE (paraphrased): "The count asked the man whether he wished to become his man without reserve, and the man answered that he did, folding his hands between the count\'s. Then, with his hand on the relics, he swore faith — and the count granted him a fief in return." Work out what this short account reveals about how feudal power actually worked.',
      steps: [
        'Source it first: this is an eyewitness-style account of a homage ceremony in Flanders, roughly 1127 CE — a routine legal act described by a chronicler, not a law code or a philosopher\'s theory. It shows practice, not ideal.',
        'Read the order of events. Homage comes first (becoming "his man"), then the oath of fealty sworn on relics, and the fief comes LAST. The land is not a gift preceding loyalty; it is the consideration paid FOR the promise. The sequence itself proves this is a transaction.',
        'Read the gesture. Hands folded inside the lord\'s hands is the whole relationship in one image: the vassal is enclosed — subordinate — but also held and shielded. Subordination and protection are the same motion.',
        'Read the religion. Swearing on relics puts the oath under God\'s enforcement. Notice why that is necessary: there is no state to sue in, no police to compel performance. Divine sanction and personal honor are the ONLY enforcement mechanisms available.',
        'Read what is absent. No written contract quoted, no bureaucracy, no court of appeal, no mention of a king anywhere. The bond is personal, between two named individuals — which is also why it had to be renewed by each new generation when either man died.',
        'Weigh the reciprocity. The count gains a fighter; the man gains land, income, and protection. If the man refuses to serve, or the count seizes the fief without cause, the other side is understood to be released. That two-way structure is the point.',
      ],
      answer:
        'The ceremony shows feudalism as a personal, two-way, religiously enforced exchange: loyalty and armed service sworn first, land granted in return — a private contract standing in for the government that no longer existed.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-local-power',
      kind: 'try_yourself',
      problem:
        'Around 1000 CE, a French king was often obeyed only in the lands he personally owned, while great nobles ruled their own territories, held their own courts, and fought their own wars. What does this best illustrate about feudal Europe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Government was decentralized — real political power sat with local lords, not with the crown', correct: true },
        { id: 'b', text: 'Medieval kings ruled as absolute monarchs over unified nation-states' },
        { id: 'c', text: 'The Vikings had conquered and governed all of France by 1000 CE' },
        { id: 'd', text: 'Europe had no form of government or law of any kind' },
      ],
      expectedAnswer: 'Government was decentralized — real political power sat with local lords, not with the crown',
      hints: [
        'Ask where the courts, the troops, and the tax collection actually happened — near the king, or near each castle?',
        'Weak center plus strong localities is not the absence of government; it is government scattered into many small pieces.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-three-field',
      kind: 'try_yourself',
      problem:
        'Manors gradually shifted from planting half their land each year to a three-field rotation: winter grain, spring crops such as beans and peas, and one field left to rest. What was the most important consequence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'More land under cultivation each year and richer soil, producing food surpluses that supported population growth', correct: true },
        { id: 'b', text: 'Manors abandoned farming and switched to trade and manufacturing' },
        { id: 'c', text: 'Serfs were immediately freed from all labor obligations to the lord' },
        { id: 'd', text: 'Lords no longer needed knights because farming had become profitable' },
      ],
      expectedAnswer: 'More land under cultivation each year and richer soil, producing food surpluses that supported population growth',
      hints: [
        'Count the fields actually planted: half the land per year, or two-thirds of it?',
        'Beans and peas both feed people protein and restore the soil — then ask what extra food does to a population.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-japan-comparison',
      kind: 'try_yourself',
      problem:
        'Feudal Japan developed daimyo lords granting land rights to samurai warriors in exchange for armed service, while the emperor became a ceremonial figure. What best explains the resemblance to European feudalism?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both societies faced weak central authority and local insecurity, and independently reached a similar land-for-service solution', correct: true },
        { id: 'b', text: 'Japanese leaders copied the European system after studying it directly' },
        { id: 'c', text: 'Both systems were created by treaties signed between European kings and Japanese emperors' },
        { id: 'd', text: 'Both were designed by the Catholic Church to organize warriors worldwide' },
      ],
      expectedAnswer: 'Both societies faced weak central authority and local insecurity, and independently reached a similar land-for-service solution',
      hints: [
        'Check the map and the calendar: how much sustained contact was there between France and Japan in the 1100s?',
        'When two isolated societies hit the same problem, they can invent comparable answers without ever meeting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-serf-slave',
      kind: 'misconception_check',
      question:
        'A student writes: "Serfs were just European slaves — the lord owned them and could sell them whenever he wanted." What needs correcting?',
      commonErrors: [
        {
          answer: 'Serfs were slaves owned by the lord',
          misconception: 'Collapsing two different legal statuses — unfree-but-protected tenancy and chattel ownership of a person — because both involve forced labor.',
          correctsTo:
            'Serfs were bound to the LAND, not owned as property. They owed labor days, dues, and fees, and needed permission to leave or marry off the manor — genuinely unfree. But custom guaranteed them their strips, their cottage, and their family, they could not be sold as individuals apart from the land, and if the manor changed hands they stayed with the manor. The right test is the question "can this person be bought and sold on their own?" For a serf the answer is no; for an enslaved person it is yes. Unfree and enslaved are not the same category.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Feudalism was an answer to a vacuum: Rome gone in the west, Charlemagne's empire split after 843, and Viking, Magyar, and Muslim raids in the 800s and 900s with no central protection.",
        'The feudal contract ran both ways: the lord granted a fief and owed protection and justice; the vassal swore homage and fealty and owed military service and counsel. Mutual obligation, not one-way tyranny.',
        'Feudalism organized military and political loyalty; manorialism organized the economy — a near-self-sufficient manor worked by serfs, who were bound to the land but not owned as property.',
        'Three-field rotation, the heavy plow, and the horse collar quietly produced surpluses — the food that will refill towns in 4.4 and eventually undo serfdom itself.',
        'Power was local: kings were weak and lords governed. Japan built a comparable samurai and daimyo order independently, showing the same problem can produce the same shape of solution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Feudal Europe: Lords, Vassals & Manors' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
