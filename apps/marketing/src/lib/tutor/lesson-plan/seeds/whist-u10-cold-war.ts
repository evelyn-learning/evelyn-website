/**
 * World History — The Contemporary World: The Cold War, A Divided World.
 *
 * The rivalry that organized the second half of the twentieth century: two
 * victors of one war becoming the antagonists of the next, a divided map,
 * and a nuclear standoff that pushed the fighting sideways into other
 * people's countries. Salvaged factual spine from the legacy world-history
 * Cold War seed, reframed subject-first for the survey course.
 * C3 D2.His.1.9-12, D2.His.14.9-12, D2.Civ.13.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U10_COLD_WAR: LessonPlan = {
  id: 'evelyn.hs.whist.cold-war.v1',
  title: 'The Cold War: A Divided World',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.cold-war',
      standard: 'WHIST-10.1',
      description:
        'Explain why the wartime alliance between the United States and the Soviet Union broke apart after 1945, analyze how nuclear weapons pushed their rivalry into divided nations, proxy wars, and propaganda instead of direct combat, and evaluate the consequences for the countries caught in between (C3 D2.His.1.9-12, D2.His.14.9-12, D2.Civ.13.9-12).',
    },
  ],
  prerequisites: ['whist.holocaust-human-rights'],
  followUps: ['whist.decolonization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Cold War as a forty-five-year global chess game — and show the student how much of the world they live in was set up by it.',
      script:
        'In May 1945, American and Soviet soldiers met at the Elbe River in Germany, shook hands, and posed for photographs. They had just destroyed Hitler together. Within two years those same two countries were arming against each other, and within four they were both building weapons that could end civilization. They never once fought each other directly — and yet their rivalry killed millions of people in Korea, Vietnam, Angola, and Afghanistan, split Germany in half, and put a wall through the middle of a city. Look at a news map today: a still-divided Korea, an alliance called NATO, nuclear arsenals, a space program. Those are all leftovers from this story. Today you learn how allies became enemies, and why the board never quite blew up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cold-war',
      kind: 'concept',
      goal: 'The breakdown of the alliance, the divided map, the nuclear logic, the proxy wars, and the countries that refused to choose.',
      keyIdeas: [
        'FROM ALLIES TO RIVALS IN TWO YEARS — the alliance was against Hitler, not for a shared future. The United States and Britain were market economies with elected governments; the Soviet Union under Stalin was a one-party communist state with a state-run economy, and each side believed the other\'s system could not survive alongside its own. Add a power vacuum — Germany flattened, Britain and France broke, the old European order gone — and two enormous armies sitting in the middle of it.',
        'EACH SIDE READ THE OTHER\'S DEFENSE AS AGGRESSION — Stalin had watched invading armies cross Poland into Russia twice in thirty years and wanted friendly governments as a buffer; Washington and London saw those same governments installed by force and read it as expansion. American aid and a rebuilt western Germany looked like security to the West and like a rearmed invader to Moscow. Historians call this trap a security dilemma: every defensive move looks like a threat to the other side, and the answer to it is another defensive move.',
        'THE IRON CURTAIN AND CONTAINMENT BY AID — Churchill announced in a March 1946 speech at Fulton, Missouri that an "iron curtain" had come down across Europe, and by the 1948 coup in Czechoslovakia the line was solid. The American answer was containment — stopping the spread rather than rolling it back. The Truman Doctrine (March 1947) promised support to "free peoples" resisting subjugation, and the Marshall Plan (from 1948) sent about 13 billion dollars to rebuild Western European economies, on the reasoning that hungry, ruined countries elect communists. The Soviet Union refused the aid and forbade its bloc to take it.',
        'THE DIVIDING LINE HARDENS: BERLIN AND TWO ALLIANCES — Germany was split into occupation zones, and Berlin was split the same way even though it sat deep inside the Soviet zone. When Stalin cut the land routes to West Berlin in June 1948, the Western allies supplied two million people entirely by air for eleven months — a plane landing every few minutes at the peak — until the blockade was lifted in May 1949. Result: two Germanies (1949), NATO the same year binding the United States to Western Europe\'s defense, the Warsaw Pact in 1955 answering it, and in August 1961 the Berlin Wall, built to stop East Germans from walking out.',
        'THE NUCLEAR SHADOW — the American monopoly lasted four years: the Soviet Union tested its own bomb in August 1949, and both sides had hydrogen bombs, hundreds of times more powerful, within a few years. Arsenals eventually reached tens of thousands of warheads. That produced mutual assured destruction: neither side could strike first without being destroyed in return, so a direct war between them stopped being a usable option — and the rivalry went sideways instead, into allies, money, spies, propaganda, and space.',
        'FIGHTING THROUGH OTHERS — Korea (1950-53) began when the Soviet-backed North invaded the South; a United Nations force led by the United States pushed north, Chinese troops entered, and the war ended in an armistice almost exactly where it started, with two to three million dead, mostly Korean civilians, and a peninsula still divided today with no peace treaty. The same pattern repeated in Vietnam and in Afghanistan after the Soviet invasion of 1979. The superpowers stayed safe; the countries they fought through did not.',
        'THIRTEEN DAYS IN OCTOBER 1962 — American reconnaissance found Soviet nuclear missile sites under construction in Cuba, about 90 miles from Florida. For thirteen days the world came closer to nuclear war than at any other moment. It ended in compromise rather than victory: Khrushchev withdrew the missiles, Kennedy publicly pledged not to invade Cuba and quietly removed American missiles from Turkey, and the two governments installed a direct communication link — the "hotline" — in 1963 so a future crisis could not turn on a slow telegram.',
        'LIFE INSIDE THE RIVALRY, AND THE COUNTRIES THAT REFUSED TO PICK — the contest ran through science and culture: Sputnik in 1957 (the first human-made object to orbit Earth) shocked the United States into a space program that reached the Moon in 1969, while films, radio, athletes, and exhibitions all became arguments about which system worked. Both blocs policed dissent, and not equally: in the United States McCarthyism cost people careers, reputations, and in some cases their freedom, while in the Eastern bloc Soviet troops crushed the Hungarian uprising of 1956 and the Prague Spring of 1968 outright. Meanwhile Nehru of India, Nasser of Egypt, and Tito of Yugoslavia built the Non-Aligned Movement (Bandung 1955, Belgrade 1961) for newly independent states that refused to be anyone\'s piece on the board — and the blocs themselves cracked, as China went communist under Mao in 1949 but had split openly with Moscow by the early 1960s.',
      ],
      vocabulary: [
        {
          term: 'containment',
          definition:
            'the American strategy of blocking the spread of communism wherever it appeared — by aid, alliances, or force — rather than trying to reverse it where it already existed.',
        },
        {
          term: 'proxy war',
          definition:
            'a conflict in which rival powers arm and back opposing sides instead of fighting each other directly.',
        },
        {
          term: 'mutual assured destruction',
          definition:
            'the standoff in which each side keeps enough nuclear weapons to destroy the other even after being attacked first — making a full exchange suicide for whoever starts it.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-alliance-breakdown',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did two countries that won a world war side by side end up pointing nuclear weapons at each other within four years?',
      steps: [
        'Start with what held them together: a shared enemy, nothing more. Remove Hitler in 1945 and the alliance loses the only thing both sides actually agreed on.',
        'Add the vacuum: central and eastern Europe are destroyed and ungoverned, and the only forces standing in it are the Red Army in the east and the Western armies in the west. Somebody is going to decide what those countries become.',
        'Add the incompatible systems: a one-party state-run economy and a group of market democracies each treat the other\'s spread as a mortal threat — so whatever fills the vacuum is read as a gain for one side and a loss for the other.',
        'Now run the fear loop, and notice it runs in BOTH directions. Stalin installs friendly governments across Eastern Europe as a defensive buffer; the West reads conquest and answers with the Truman Doctrine and Marshall Plan aid. Moscow reads that aid, and a rebuilt western Germany, as an American takeover of Europe and a rearmed invader — and cuts the roads to West Berlin in 1948.',
        'Close the chain: the airlift beats the blockade, so the West formalizes the split with NATO and a separate West German state in 1949 — the same year the Soviet Union tests its atomic bomb, ending the American monopoly. Shared enemy gone, vacuum to fill, incompatible systems, each defensive step read as aggression, and now both sides armed with the bomb.',
      ],
      answer:
        'No single villain: the shared enemy disappeared, a power vacuum had to be filled, the two systems could not tolerate each other, and every defensive move by one side looked like aggression to the other — a loop that ran from Eastern Europe to Berlin to NATO and the Soviet bomb in just four years.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cuba-broadcast',
      kind: 'worked_example',
      problem:
        'On October 22, 1962, the American president went on television and told the country, in substance: we can no longer treat the actual firing of weapons as the only real danger, because missiles now fly so fast and destroy so much that a sudden change in where they are placed is itself a threat to peace — and so ships carrying offensive weapons to Cuba will be stopped and turned back. Why stop ships instead of bombing the missile sites, and what does that choice show about how nuclear weapons changed confrontation?',
      steps: [
        'Situate the moment: air reconnaissance had photographed Soviet nuclear missile sites going up in Cuba, roughly 90 miles from Florida. Moscow, for its part, could point to American missiles already stationed in Turkey, on the Soviet border.',
        'Read the claim about danger. The key move in the statement is that the threat now begins BEFORE anything is fired — speed and destructive power mean that merely moving weapons is an act of war-level significance. That is the nuclear age redefining what counts as an attack.',
        'Read the chosen response. Bombing the sites would kill Soviet personnel and hand Moscow no option but to answer somewhere — probably in Berlin. Stopping ships at sea does something different: it blocks what has not arrived yet, applies real pressure, and leaves the other side a move that is not war.',
        'Name the logic: with mutual assured destruction in the background, both leaders needed an exit that did not look like surrender at home. So the crisis was fought with ships, deadlines, and back-channel letters instead of bombers.',
        'Check the ending against the logic. It closed with a trade, not a win: the Soviet missiles left Cuba, the United States publicly promised not to invade Cuba, and American missiles quietly came out of Turkey. Then both governments built the hotline in 1963 — an admission that the real danger was misunderstanding each other too slowly.',
      ],
      answer:
        'Because a strike would have forced Moscow to retaliate, the president chose the least escalatory tool that still applied pressure — a naval blockade of incoming weapons. Under mutual assured destruction, the goal in a crisis is not to win but to leave the other side a way out, which is exactly how the crisis ended: missiles out of Cuba, a pledge not to invade, a quiet withdrawal from Turkey, and a hotline.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-proxies',
      kind: 'try_yourself',
      problem:
        'The United States and the Soviet Union armed opposite sides in Korea, Vietnam, and Afghanistan, but never fought each other directly. Which best explains why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A direct war between two nuclear-armed states risked destroying both, so the competition was pushed into other countries instead',
          correct: true,
        },
        { id: 'b', text: 'Neither superpower had an army large enough to fight the other' },
        { id: 'c', text: 'The United Nations legally forbade its permanent members from ever going to war' },
        { id: 'd', text: 'Their governments actually agreed on most political questions by the 1950s' },
      ],
      expectedAnswer:
        'A direct war between two nuclear-armed states risked destroying both, so the competition was pushed into other countries instead',
      hints: [
        'Ask what changed in 1949, when the Soviet Union tested its own atomic bomb — what became impossible to win after that?',
        'If neither side can survive striking first, the rivalry does not stop; it moves somewhere the bombs are not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-marshall-plan',
      kind: 'try_yourself',
      problem:
        'From 1948 the United States sent about 13 billion dollars to rebuild the economies of Western Europe. Which best explains the strategic reasoning behind that aid?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Prosperous, stable countries were far less likely to turn communist — rebuilding them was containment carried out with money',
          correct: true,
        },
        { id: 'b', text: 'It was a reward to the countries that had done the most fighting against Germany' },
        { id: 'c', text: 'It was payment for European colonies being transferred to American control' },
        { id: 'd', text: 'The wartime agreements at Yalta legally required the United States to rebuild Europe' },
      ],
      expectedAnswer:
        'Prosperous, stable countries were far less likely to turn communist — rebuilding them was containment carried out with money',
      hints: [
        'Notice who was offered the aid and who refused it: the Soviet Union blocked its own bloc from accepting a single dollar. Why would aid look dangerous to Moscow?',
        'Connect it to the Truman Doctrine one year earlier — same goal, different instrument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-berlin-wall',
      kind: 'try_yourself',
      problem: 'The Berlin Wall went up in August 1961. Which statement correctly identifies who built it and why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'East Germany sealed the border because huge numbers of East Germans were escaping to the West through Berlin',
          correct: true,
        },
        { id: 'b', text: 'The Western allies built it to keep Soviet troops out of West Berlin' },
        { id: 'c', text: 'It was built in 1948 to enforce the Soviet blockade of West Berlin' },
        { id: 'd', text: 'It marked the border between the occupation zones agreed at the Yalta Conference in 1945' },
      ],
      expectedAnswer:
        'East Germany sealed the border because huge numbers of East Germans were escaping to the West through Berlin',
      hints: [
        'A wall can face either way. Ask which direction people were actually moving, and which government that embarrassed.',
        'West Berlin was an open door in the middle of East Germany — and by 1961 millions had walked through it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-everywhere',
      kind: 'misconception_check',
      question:
        'A student says: "It was called the Cold War because nobody actually fought — it was all threats and propaganda." What needs correcting?',
      commonErrors: [
        {
          answer: 'Nobody actually fought; it was only threats',
          misconception:
            'Taking "cold" to describe the whole world rather than only the relationship between the two superpowers — which erases the wars that were the rivalry\'s real body count.',
          correctsTo:
            '"Cold" describes one specific thing: American and Soviet forces never fought each other head-on. Everywhere else it was hot. Korea (1950-53) killed two to three million people and left the peninsula divided to this day; Vietnam and the Soviet war in Afghanistan after 1979 killed millions more; Soviet tanks put down Hungary in 1956 and Czechoslovakia in 1968. The nuclear standoff did not prevent Cold War violence — it relocated it onto other people\'s countries.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The alliance broke because it was only ever against Hitler: incompatible systems plus a power vacuum in ruined Europe, with each side reading the other\'s defensive moves as aggression.',
        'The map hardened fast — iron curtain 1946, Truman Doctrine 1947, Marshall Plan 1948, Berlin blockade and airlift 1948-49, two Germanies and NATO 1949, Warsaw Pact 1955, Berlin Wall 1961.',
        'The Soviet bomb in 1949 ended the American monopoly; mutual assured destruction made direct war unusable, so the rivalry was fought THROUGH others — Korea, Vietnam, Afghanistan.',
        'The Cuban Missile Crisis of October 1962 was the closest approach to nuclear war, and it ended in compromise: missiles out of Cuba, no invasion promised, American missiles quietly out of Turkey, hotline installed.',
        'The two-bloc picture is a simplification: China went communist in 1949 but split with Moscow by the early 1960s, and the Non-Aligned Movement under Nehru, Nasser, and Tito refused to pick a side at all.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'The Cold War: A Divided World' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
