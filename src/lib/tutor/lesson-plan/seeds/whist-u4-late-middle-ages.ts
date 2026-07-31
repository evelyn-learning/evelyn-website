/**
 * World History — The Medieval World: The Late Middle Ages.
 *
 * Catastrophe as an accelerant. Towns, guilds, and universities are
 * already reviving when plague arrives along the very trade routes that
 * carried silk and ideas (3.4) — and the death toll does what centuries
 * of custom could not: it prices labor, cracks serfdom, and starts the
 * unraveling that ends in the Renaissance (6.1). Salvaged factual spine
 * from the legacy world-history trade-diffusion seed, reframed
 * subject-first. C3 D2.His.14.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U4_LATE_MIDDLE_AGES: LessonPlan = {
  id: 'evelyn.hs.whist.late-middle-ages.v1',
  title: 'The Late Middle Ages: Plague, Towns & Change',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.late-middle-ages',
      standard: 'WHIST-4.4',
      description:
        'Explain how the revival of towns, trade, and universities and the demographic shock of the Black Death (1347-1351) combined to erode serfdom, strain the Church and the old order, and set medieval Europe on the road to the Renaissance (C3 D2.His.14.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.church-and-crusades'],
  followUps: ['whist.west-african-empires'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Black Death not as an ending but as the most violent accelerant of social change in European history.',
      script:
        'In 1348, a laborer in England could be whipped for leaving his lord\'s land without permission. Thirty years later, that same kind of laborer could walk to the next village, name his price, and get it. Nothing in between was a revolution, a war of independence, or a new philosophy. What happened was that roughly one out of every three people in Europe died — and the survivors suddenly became scarce, and scarce things get expensive, even people. Today we follow the strangest cause-and-effect chain in this course: how a bacterium riding a trade route did more to loosen serfdom than four centuries of custom ever did.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-late-middle-ages',
      kind: 'concept',
      goal: 'The revival already underway, the plague that hit it, and the chain of consequences that unravels the medieval order.',
      keyIdeas: [
        'THE REVIVAL CAME FIRST — the plague did not hit a frozen world. From roughly 1000 to 1300 CE, better plows, horse collars, and the three-field rotation raised harvests; a food surplus fed people who did not farm; and TOWNS regrew for the first time since Rome. Common student slip: assuming the Middle Ages were static until the plague or the Renaissance "woke Europe up."',
        'TRADE AND THE MONEY ECONOMY RETURN — the Hanseatic League linked Baltic and North Sea ports (Lubeck, Hamburg, Bergen) into a merchant alliance with its own fleets and rules; the Champagne fairs in France became the great inland meeting point of Italian and Flemish merchants. Deals needed coin, credit, and bills of exchange, so a barter-and-obligation economy shifted back toward MONEY — which quietly matters later, because a lord who wants cash must rent land rather than command labor.',
        'GUILDS RAN THE TOWNS — associations of craftsmen or merchants that set prices, fixed quality standards, and controlled training through the apprentice-journeyman-master ladder. They protected members and limited competition. Towns won charters of self-government from lords who wanted the tax revenue; the saying "town air makes you free" reflected the rule in many places that a serf who lived in a town a year and a day was no longer bound.',
        'UNIVERSITIES GREW OUT OF CATHEDRAL SCHOOLS — Bologna (law, c. 1088), Paris (theology), and Oxford began as guild-like corporations of scholars and students, not as royal projects. They taught logic, law, medicine, and theology, and the recovery of Aristotle through Arabic and Greek texts drove thinkers like Thomas Aquinas to try to reconcile reason with faith. Europe now had permanent institutions for producing trained lawyers, doctors, and administrators.',
        'THE BLACK DEATH, 1347-1351 — the plague pathogen, most likely moving out of Central Asia, traveled the SAME routes that carried silk, silver, and scholars: the Mongol-protected overland roads studied in 3.4, then Genoese ships out of Black Sea ports into Sicily, Italy, and onward. It killed roughly one-third of Europe\'s population in about four years, with comparable devastation across the Middle East. The key point is connection, not filth: the more integrated a region, the faster it was reached.',
        'LABOR SHORTAGE IS THE ENGINE — with a third of the workers gone, land was suddenly abundant and PEOPLE were scarce. Wages rose, rents fell, and serfs discovered they could bargain or simply leave for a lord who offered better terms. Serfdom in western Europe eroded over the following century. Elites fought back with wage-freezing laws (England\'s Statute of Labourers, 1351) and new taxes, and when they pushed too hard the result was revolt: the French Jacquerie (1358) and the English Peasants\' Revolt of 1381, led by Wat Tyler.',
        'THE CHURCH TAKES A DENT — plague killed the pious and the wicked alike, and it killed priests at high rates because they attended the dying. Prayer, processions, and penance visibly failed to stop it. Church authority survived but never fully regained its unquestioned standing, and the credibility damage compounds later with the Great Schism and, eventually, the Reformation.',
        'WAR AND LAW RESHAPE THE STATE — the Hundred Years\' War (1337-1453) between England and France replaced feudal levies of knights with paid, professional troops and gunpowder weapons, and figures like Joan of Arc gave both sides something new to feel: national identity rather than loyalty to a local lord. Earlier, Magna Carta (1215) had forced King John to accept that the monarch was under the law — a seed of limited monarchy that grows into Parliament. Add it up and the medieval order is unraveling into something else: the Renaissance world of 6.1.',
      ],
      vocabulary: [
        { term: 'guild', definition: 'a town association of craftsmen or merchants that controlled training, quality, and prices in its trade.' },
        { term: 'serfdom', definition: 'the condition of peasants legally bound to a lord\'s land, owing labor and dues and unable to leave at will.' },
        { term: 'Hanseatic League', definition: 'the alliance of northern European trading towns that dominated Baltic and North Sea commerce in the later Middle Ages.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plague-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a disease that killed roughly one-third of Europe end up making the SURVIVORS freer and better paid — and then trigger a peasant revolt in 1381?',
      steps: [
        'Start with the demographic shock: between 1347 and 1351 the plague kills about a third of Europe\'s people. Land, tools, and houses survive; the people who worked them do not.',
        'Apply the basic economics: when a thing becomes scarce while demand for it stays the same, its price rises. Here the scarce thing is LABOR. Lords still need fields plowed and harvests brought in, and there are far fewer hands to do it.',
        'Follow the bargaining power: a surviving peasant can now say no. If this lord will not pay wages or lower dues, the next manor over — desperate for workers — will. Serfdom depended on peasants having nowhere else to go, and suddenly they did.',
        'Follow the lords\' reaction: elites tried to legislate the change away. England\'s Statute of Labourers (1351) made it illegal to pay or accept wages above pre-plague rates, and lords tried to reimpose old labor obligations. Then came new head taxes to pay for the Hundred Years\' War.',
        'Close the chain: peasants who could feel their real bargaining power being taken back by law exploded. The Peasants\' Revolt of 1381, led by Wat Tyler, marched on London demanding an end to serfdom. The revolt was crushed and Tyler killed — but the market pressure never went away, and serfdom in western Europe faded anyway over the next century.',
      ],
      answer:
        'Mass death made labor scarce, scarcity raised its price, higher price gave peasants leverage against serfdom, and elite attempts to freeze wages and revive old obligations by law provoked the 1381 revolt — catastrophe acting as an engine of social change.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-chronicler-account',
      kind: 'worked_example',
      problem:
        'A merchant in Florence wrote in 1348 (paraphrased): "The sickness reached us from the East, carried, they say, in the ships that come from the Black Sea ports. Fathers abandoned children, and the priests who buried the dead were buried after them. Where last year I hired a field hand for a few coins, this year no man will come for triple the money." Work out what this short account reveals about how the plague spread and what it changed.',
      steps: [
        'Source it first: a Florentine merchant writing in 1348, in the first year of the outbreak. He is a commercial man in one of Europe\'s busiest trading cities — exactly the kind of person who would notice both shipping routes and the price of labor.',
        'Read the first sentence as evidence of ROUTE: he traces the disease to ships from Black Sea ports. That matches what we know — the Mongol-protected overland roads carried the pathogen west across Asia, and Genoese trading ships carried it the last leg into Mediterranean Europe. The same connections that made Florence rich made it reachable.',
        'Read the second sentence as evidence of SOCIAL COLLAPSE: family bonds and religious duty both break down under a death rate no one could explain. Note the detail that priests died burying the dead — that is one concrete reason Church authority and clerical numbers took a lasting hit.',
        'Read the third sentence as evidence of ECONOMICS: his complaint is a labor shortage in real time. He is not describing a policy or a revolt; he is describing a price. Triple wages within a year is the market repricing scarce workers, and it is the mechanism that erodes serfdom over the following decades.',
        'Weigh what the account cannot tell you: one merchant in one city, writing while it happened, gives vivid detail but no measure of scale — he cannot know that a third of the continent will die, and his "they say" about the ships is rumor, not proof. Use it as a window on how the crisis was experienced, and pair it with broader evidence for the numbers.',
      ],
      answer:
        'The account captures all three threads at once: the plague arriving along established trade routes, the collapse of social and religious routine, and the labor shortage that immediately tripled the price of a field hand — the beginning of serfdom\'s erosion, witnessed as a price complaint.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plague-routes',
      kind: 'try_yourself',
      problem:
        'The Black Death reached Sicily, Italy, and then most of Europe within about four years of arriving in the Mediterranean. Which factor best explains that speed and reach?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It traveled the established long-distance trade routes and shipping lanes that already connected Asia, the Middle East, and Europe', correct: true },
        { id: 'b', text: 'European cities were dirtier than cities elsewhere, so the disease originated in them' },
        { id: 'c', text: 'Armies of the Hundred Years\' War deliberately spread it as a weapon across the continent' },
        { id: 'd', text: 'It spread through the new universities, since students traveled between Bologna, Paris, and Oxford' },
      ],
      expectedAnswer: 'It traveled the established long-distance trade routes and shipping lanes that already connected Asia, the Middle East, and Europe',
      hints: [
        'Ask what was already moving quickly between Asia and Europe in the 1340s — and what else could ride along with it.',
        'The same Mongol-protected roads and Genoese ships that carried silk and silver carried the pathogen; connection, not filth, set the pace.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wages',
      kind: 'try_yourself',
      problem:
        'In the decades after 1351, wages for agricultural laborers in western Europe rose sharply and many lords began renting land for cash instead of demanding labor service. What most directly explains this shift?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plague deaths made workers scarce, so surviving laborers could demand better pay and terms', correct: true },
        { id: 'b', text: 'The Peasants\' Revolt of 1381 succeeded and abolished serfdom by law' },
        { id: 'c', text: 'Kings across Europe issued decrees freeing serfs out of sympathy after the plague' },
        { id: 'd', text: 'New farm machinery invented in the 1300s made each laborer far more productive' },
      ],
      expectedAnswer: 'Plague deaths made workers scarce, so surviving laborers could demand better pay and terms',
      hints: [
        'Count what changed first: the number of people, or the laws about people?',
        'Land survived the plague; workers did not. Whichever side of a bargain is scarce gains the leverage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-town-revival',
      kind: 'try_yourself',
      problem:
        'Towns across Europe grew steadily between roughly 1000 and 1300 CE, well before the plague. Which combination best explains that growth?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Better farming produced a food surplus, freeing people for crafts and trade, while revived commerce like the Hanseatic League and the Champagne fairs gave towns a reason to exist', correct: true },
        { id: 'b', text: 'Survivors of the Black Death abandoned the countryside and crowded into the towns' },
        { id: 'c', text: 'Feudal lords ordered peasants to move into towns to make them easier to tax' },
        { id: 'd', text: 'Roman cities had never declined, so medieval towns simply continued at their ancient size' },
      ],
      expectedAnswer: 'Better farming produced a food surplus, freeing people for crafts and trade, while revived commerce like the Hanseatic League and the Champagne fairs gave towns a reason to exist',
      hints: [
        'Check the dates in the question: this growth is finished before 1347, so any answer starting with the plague is in the wrong century.',
        'A town cannot exist unless farmers grow more food than farmers eat — start with the harvest, then ask what the extra people did.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-serfdom-ended',
      kind: 'misconception_check',
      question:
        'A student writes: "The Black Death immediately ended serfdom and feudalism everywhere in Europe." What needs correcting?',
      commonErrors: [
        {
          answer: 'The plague instantly abolished serfdom across Europe',
          misconception:
            'Turning a gradual, uneven economic pressure into a single instant legal event — and assuming a continent-wide change when the effect actually ran in opposite directions in different regions.',
          correctsTo:
            'The plague created PRESSURE, not a decree. In western Europe serfdom eroded over roughly a century as scarce laborers bargained for wages and cash rents, and elites resisted the whole way with measures like England\'s Statute of Labourers (1351), which is exactly what provoked the Peasants\' Revolt of 1381 — a revolt that was crushed. In parts of eastern Europe the same era saw landlords tighten control and bind peasants MORE firmly. So: slow, contested, and regionally opposite, not instant or universal.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The revival came first: farming surpluses, reviving trade (Hanseatic League, Champagne fairs), guild-run chartered towns, a returning money economy, and universities growing out of cathedral schools at Bologna, Paris, and Oxford.',
        'The Black Death (1347-1351) traveled the same trade routes that carried silk and ideas and killed roughly one-third of Europe — the more connected the region, the faster it arrived.',
        'The engine of change: fewer workers means scarce labor, scarce labor means higher wages and weaker serfdom; elite attempts to freeze wages by law produced revolts such as England\'s in 1381.',
        'Institutions shifted too: Church authority was dented when piety failed to stop the plague, the Hundred Years\' War (1337-1453) built professional armies and national feeling, and Magna Carta (1215) had already seeded the idea of a monarch bound by law.',
        'Catastrophe as accelerant: the medieval order did not simply end, it unraveled into the Renaissance world of 6.1.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'The Late Middle Ages: Plague, Towns & Change' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
