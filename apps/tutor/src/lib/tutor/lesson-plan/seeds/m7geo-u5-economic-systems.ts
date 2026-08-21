/**
 * Grade 7 World Geography — Economics & Development: Economic Systems.
 *
 * Concept-led row (National Geography Standard 11). Teaches ONE analytical
 * frame -- every economy must answer three questions (what to produce, how to
 * produce it, who gets it), and traditional / command / market / mixed name
 * WHO DOES THE DECIDING -- then hands the geographic connection forward to
 * 5.2 (what a place has shapes what it produces).
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than almost
 * anywhere else in the course: economic systems is one of the two rows most
 * likely to slide into politics, and the audience is twelve. This file
 * describes each system by its DECISION-MAKING MECHANISM ONLY. It does not
 * rank the systems, does not endorse or criticize any of them, does not name
 * a real country as an example of a pure type, and does not touch any live
 * political or economic argument. Every scenario uses invented countries
 * (Talmere, Oravia, Kestria) and invented places. There are no statistics of
 * any kind -- no GDP figures, no growth rates, no rankings. Keep it that way.
 *
 * The word "traditional" is handled with particular care: it names where the
 * answers come from, never a stage of progress. "Backward" and "behind" are
 * banned framings and appear here only inside an explicitly-labeled WRONG.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U5_ECONOMIC_SYSTEMS: LessonPlan = {
  id: 'evelyn.ms.m7geo.economic-systems.v1',
  title: 'Economic Systems',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.economic-systems',
      standard: 'M7GEO-5.1',
      description:
        'Compare how traditional, command, market and mixed economies answer the three basic economic questions -- what to produce, how to produce it, and who receives it -- and explain why essentially every real economy is mixed and why economic activity in a place is shaped by the resources, climate, land and location that place has (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.cultural-change-and-globalization'],
  followUps: ['m7geo.resources-and-economic-activity'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the three basic economic questions in one small object the student actually bought, before any system vocabulary.',
      script:
        'Think about the last small thing you bought. A snack, a game, a pair of shoelaces. Somebody decided to make that thing rather than something else. Somebody decided how to make it, and how many. And somebody decided that you would be the one to end up with it, instead of the kid two towns over. Nobody on Earth held a meeting about your shoelaces, and yet all three of those decisions got made. Every group of people, from a village of forty to a country of a hundred million, has to answer those same three questions about everything it produces. Today we look at the different arrangements people use to answer them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-questions-four-systems',
      kind: 'concept',
      goal: 'Install the three basic questions, name the four systems by decision-making mechanism only, establish that real economies are mixed, and open the geographic connection to 5.2.',
      keyIdeas: [
        'EVERY ECONOMY ANSWERS THE SAME THREE QUESTIONS. First, WHAT should be produced -- rice or wheat, buses or bicycles. Second, HOW should it be produced -- by hand or by machine, on many small farms or a few large ones. Third, WHO GETS IT -- which people end up with the goods and services once they exist. An economy is simply the arrangement a group of people uses to answer those three questions. No group escapes them, because there is never enough of everything for everyone.',
        'IN A TRADITIONAL ECONOMY, THE ANSWERS COME MOSTLY FROM CUSTOM AND LONG PRACTICE. What was produced last year is produced this year, and the work is often divided the way it has been divided for a long time. Much of what is made is used by the household or the village that made it, which is called subsistence. Notice exactly what the word "traditional" is doing here: it names WHERE THE ANSWERS COME FROM, and nothing else. It is not a score and it is not a stage on the way to somewhere else.',
        'IN A COMMAND ECONOMY, THE ANSWERS COME MOSTLY FROM A CENTRAL AUTHORITY. A government office or a planning body decides what the farms and factories will produce, how much of it, and how it will be distributed. The decisions travel outward from one center to everybody else.',
        'IN A MARKET ECONOMY, THE ANSWERS COME MOSTLY FROM THE CHOICES OF BUYERS AND SELLERS, and prices are how those choices get communicated. When many people want something scarce, the price of it tends to rise and producers tend to make more. When few people want it, the price tends to fall and producers tend to make less. No single person is deciding; the pattern comes out of an enormous number of separate decisions. And markets always operate inside laws -- rules about contracts, safety, weights and measures -- so "market" never means "no rules".',
        'IN PRACTICE, ESSENTIALLY EVERY REAL ECONOMY IS MIXED. A mixed economy combines the ways of deciding: many choices are left to buyers and sellers, some are made by a government, and some still follow long custom. Traditional, command and market are ANALYTICAL CATEGORIES -- clean types we use to compare how decisions get made -- not descriptions of actual countries. So do not label a real country a pure type, and do not rank the types against one another. The useful question is never "which one is best", it is "for this decision, who is deciding, and what are they deciding with".',
        'THE SYSTEM SAYS WHO DECIDES; THE PLACE SHAPES WHAT THERE IS TO DECIDE ABOUT. Deep soil and a long growing season make grain farming possible. Metal ore in the ground makes mining possible. A deep harbor, a river boats can travel, or a position between two large markets makes shipping and trading easier. Two countries running the very same economic system can produce completely different things, because they sit in different places. That connection is where this unit goes next.',
      ],
      vocabulary: [
        { term: 'economy', definition: 'the arrangement a group of people uses to decide what gets produced, how, and who receives it.' },
        { term: 'traditional economy', definition: 'an economy in which the answers come mostly from custom and long practice, often producing for the household or village itself.' },
        { term: 'command economy', definition: 'an economy in which the answers come mostly from a central authority such as a government planning body.' },
        { term: 'market economy', definition: 'an economy in which the answers come mostly from the choices of buyers and sellers, coordinated by prices.' },
        { term: 'mixed economy', definition: 'an economy that combines these ways of deciding, which is what essentially every real economy does.' },
        { term: 'price', definition: 'what something costs, which in a market carries information about how much of it people want and how scarce it is.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-one-question-three-deciders',
      kind: 'worked_example',
      problem:
        'Run ONE question through three different systems.\n\n"The village of Ferran Hollow, in the invented country of Talmere, has land that can grow either barley or potatoes, but not both in the same season."\n\nDescribe how a traditional economy, a command economy and a market economy would each answer the question "what should we produce?" Do not say which answer is better.',
      steps: [
        'Name the question exactly. This is the first of the three basic questions: WHAT should be produced. The choice on the table is barley or potatoes.',
        'TRADITIONAL. The answer comes from custom. Ferran Hollow has planted barley every spring for as long as anyone in the village can remember, so the fields go to barley again. No meeting was held and no price was consulted. The reason is that this is what is done here.',
        'COMMAND. The answer comes from a central authority. A national planning office in Talmere reviews what the country is short of, decides that potatoes are wanted, and instructs Ferran Hollow to plant potatoes. The reason is that an authority directed it.',
        'MARKET. The answer comes from buyers and sellers through prices. Potato prices have been high for two seasons and barley prices have been low, so the farmers of Ferran Hollow expect to earn more from potatoes and plant potatoes. The reason is that the price made potatoes look worth more than barley.',
        'Now look at what changed across the three and what did not. The question was identical each time, and the crop even came out the same in two of them. The only thing that differed is WHO DID THE DECIDING and WHAT INFORMATION they used -- custom, an authority, or a price.',
        'Notice the last line of the prompt. We described three mechanisms and ranked none of them. That is the whole job. Whether one arrangement is better than another is an argument about values, and it is not what geography is asking here.',
      ],
      answer:
        'Traditional: barley, because barley is what the village has always planted. Command: potatoes, because a central planning office directed it. Market: potatoes, because potato prices were high and the farmers expected to earn more. Same question, three different deciders -- custom, an authority, and prices.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-why-real-economies-are-mixed',
      kind: 'worked_example',
      problem:
        'A student writes: "Oravia is a market economy." Here is everything the case says about Oravia, an invented country.\n\n"Most businesses in Oravia are privately owned, and their owners decide what to make and what to charge for it. The government of Oravia builds the roads, runs the public schools and the fire service, and inspects food for safety. In one mountain valley, families still herd sheep the way the generation before them herded, and use most of the wool themselves."\n\nIs the student label correct? Explain.',
      steps: [
        'Go through the case one decision at a time and mark WHO is making each one. Privately owned businesses choosing what to make and what to charge -- that is buyers and sellers deciding, which is the market mechanism.',
        'Roads, public schools, a fire service and food inspection -- those are decided and run by a government, which is a central authority deciding.',
        'Sheep herded the way the previous generation herded them, with most of the wool used at home -- that is custom deciding, and it is subsistence production.',
        'So all three mechanisms are present in the same country at the same time. That is exactly what MIXED means, and it is why the pure types do not work as country labels.',
        'WRONG: "Oravia is a market economy." CORRECT: "Oravia is a mixed economy in which most production decisions are left to buyers and sellers." The second sentence says which mechanism does most of the deciding without pretending the other two are absent.',
        'One more thing to catch here. Oravia inspects food and still has a busy market. Rules and markets are not opposites -- every market anywhere runs inside a set of laws.',
      ],
      answer:
        'The label is not right. Oravia shows all three mechanisms at once: private businesses setting their own output and prices, a government running roads, schools, a fire service and inspections, and a valley where herding follows long custom. Oravia is a MIXED economy in which market decision-making is the largest part -- which is how essentially every real economy works.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-identify-the-decider',
      kind: 'try_yourself',
      problem:
        'Read the case, then decide which kind of economy it describes.\n\n"In the invented country of Kestria, a national planning office decides each year how many tractors the factories will build, which farms will receive them, and what they will be sold for."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A traditional economy, because the planning office repeats the process every year' },
        { id: 'b', text: 'A command economy, because a central authority is making the decisions', correct: true },
        { id: 'c', text: 'A market economy, because tractors are being produced and sold' },
        { id: 'd', text: 'A mixed economy, because Kestria has both factories and farms' }
      ],
      expectedAnswer: 'A command economy, because a central authority is making the decisions',
      hints: [
        'Ask the one question that sorts these types apart: WHO is doing the deciding, and what are they deciding with -- custom, an authority, or prices?',
        'Check the wrong ideas too. Repeating something yearly is not the same as custom, having both factories and farms is not the same as mixing systems, and something being sold does not mean a market set the price.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pure-types-versus-real-countries',
      kind: 'try_yourself',
      problem:
        'Which statement most accurately describes how traditional, command and market economies relate to real countries today?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each real country uses exactly one of the three, and its type can simply be looked up.' },
        { id: 'b', text: 'A country counts as a market economy only if its government makes no rules about business.' },
        { id: 'c', text: 'A country is a command economy whenever its government collects taxes.' },
        { id: 'd', text: 'Essentially every real economy is mixed, and the three types are categories for comparing how decisions get made.', correct: true }
      ],
      expectedAnswer: 'Essentially every real economy is mixed, and the three types are categories for comparing how decisions get made.',
      hints: [
        'Think about where you live. Are there decisions there made by a government? Any left to buyers and sellers? Any that simply follow long custom?',
        'Two of these wrong choices treat any government activity at all as proof of one system or proof against another. A market and a set of laws sit together in every economy there is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-place-shapes-production',
      kind: 'try_yourself',
      problem:
        'Two invented countries share a border, and both are mixed economies.\n\n"Talmere is mountainous, with short cool summers and thin soil. Oravia is mostly flat, with long warm summers, deep soil, and a river that runs down to a deep harbor. Oravia grows and ships far more grain than Talmere does."\n\nWhat does this comparison best show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Oravia must be a market economy and Talmere must be a command economy.' },
        { id: 'b', text: 'The resources a place has decide which economic system it uses.' },
        { id: 'c', text: 'What a place produces is shaped by its land, climate and location.', correct: true },
        { id: 'd', text: 'Places with mountains cannot take part in trade.' }
      ],
      expectedAnswer: 'What a place produces is shaped by its land, climate and location.',
      hints: [
        'Both countries were given the SAME economic system in the case, so the system cannot be what explains the difference between them. What else is different?',
        'Reread the physical description of each country -- soil, growing season, and how goods can reach a harbor -- and remember that the system says who decides while the place shapes what there is to decide about.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-traditional-is-not-a-ranking',
      kind: 'misconception_check',
      question:
        'A student writes: "Talmere is a traditional economy, so it is behind the other countries and needs to catch up." Two separate things have gone wrong in that one sentence. What are they?',
      commonErrors: [
        {
          answer: 'Talmere is a traditional economy, so it is behind the other countries and needs to catch up.',
          misconception:
            'Reading the three types as a ladder with traditional at the bottom, and hearing the word "traditional" as a judgment about people rather than a description of how decisions are made.',
          correctsTo:
            'WRONG: traditional means behind, or early, or on the way to something better. CORRECT: traditional describes WHERE THE ANSWERS COME FROM -- custom and long practice -- in exactly the way that command describes answers coming from an authority and market describes answers coming from prices. The three are sorted by mechanism, not stacked by score. There is no ladder here, no ranking, and nothing to catch up to. Words like "behind" or "backward" are not geography; they are judgments about people, and this course does not make them.',
        },
        {
          answer: 'A whole country can be called a traditional economy.',
          misconception:
            'Applying a pure type as a label for a real country, when the pure types are analytical categories built for comparing mechanisms.',
          correctsTo:
            'WRONG: naming any real country as a pure traditional, command or market economy. CORRECT: essentially every real economy is MIXED, and the honest sentence names which mechanism does most of the deciding -- for example, "a mixed economy in which most decisions are left to buyers and sellers". Custom-based subsistence production usually appears in PARTS of a country, such as one valley or one set of households, while markets and government programs operate elsewhere in the same country at the same time.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every economy answers three questions: WHAT to produce, HOW to produce it, and WHO gets it.',
        'Traditional: the answers come mostly from custom and long practice, often producing for the household or village itself.',
        'Command: the answers come mostly from a central authority.',
        'Market: the answers come mostly from the choices of buyers and sellers, communicated through prices -- and always inside a set of laws.',
        'Essentially every real economy is MIXED. The pure types are categories for comparing how decisions are made, not labels for real countries, and they are not ranked against each other.',
        'The system says WHO DECIDES. The place -- its resources, climate, land and location -- shapes WHAT THERE IS TO DECIDE ABOUT, which is the next lesson.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Economic Systems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
