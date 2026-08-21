/**
 * Grade 7 World Geography — Europe: Economy & the European Union.
 * Unit 8, topic 8.3 (National Geography Standard 11).
 *
 * Concept-led. Teaches the MECHANISM and nothing else: many countries packed
 * into a small area with excellent transport (callback to 8.1), a regional
 * organization whose member states agree to share certain rules, the SINGLE
 * MARKET as the geographic payoff, the euro as a shared currency used by many
 * members but not all, internal borders crossed without routine checks, and
 * the honest limit (callback to 6.4) that the union works by agreement among
 * members rather than as a government over them.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than anywhere else
 * in the course: the European Union is a live political argument inside every
 * member state, and the audience is twelve. This file teaches the mechanism
 * and refuses the argument. It names NO political party, NO leader, NO
 * referendum, NO current dispute and NO accession question. It says only that
 * membership is a choice each country makes, that countries have joined, and
 * that a country has left -- and it names none of them and gives no reasons.
 * It argues neither for nor against membership or the shared currency. It does
 * not touch immigration policy. It ranks no member against another (rule 4)
 * and characterizes the people of no country (rule 5). There are no statistics
 * anywhere -- no member counts, no GDP, no population, no budget figures.
 * Every scenario in an item uses invented countries. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U8_EUROPE_ECONOMY_AND_UNION: LessonPlan = {
  id: 'evelyn.ms.m7geo.europe-economy-and-union.v1',
  title: 'Europe: Economy & the European Union',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.europe-economy-and-union',
      standard: 'M7GEO-8.3',
      description:
        'Describe how Europe packs many countries into a small area with excellent transport, explain what a single market does for the movement of goods, services, money and people among member states, distinguish the shared euro currency from national currencies, and state the limits of what a regional organization is (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.europe-history-and-culture'],
  followUps: ['m7geo.russia-and-eurasia'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the everyday border crossing feel ordinary, so the mechanism has something concrete to explain.',
      script:
        'Picture a road trip that starts after breakfast in one country, stops for lunch in a second, and reaches a hotel in a third before it gets dark. In much of Europe that is an ordinary day, not an adventure. The countries there sit close together, the roads and railways are excellent, and for a lot of those crossings nobody stops the car at all. Look at the truck in the next lane while you are stuck in traffic. It may be carrying cheese made a hundred miles back, heading for a supermarket two countries ahead, and the driver may never open a single form on the way. Today we look at the arrangement that makes that ordinary, and at exactly what it does and does not do.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-single-market-and-union',
      kind: 'concept',
      goal: 'Install the geographic setup, what the union is, the single market mechanism, the euro, and the honest limit.',
      keyIdeas: [
        'START WITH THE GEOGRAPHY, BECAUSE IT IS THE SETUP FOR EVERYTHING ELSE. Europe fits a lot of countries into a fairly small area, and that area is easy to move across. Several large rivers, including the Rhine and the Danube, are navigable far inland, so barges carry heavy cargo hundreds of miles from the sea. The coastline is deeply indented with bays, inlets and peninsulas, so a great many places sit near a port. On top of that the region has a dense network of railways and roads. Put those together and a border is not a wall on the horizon; it is something a person might cross on the way to work. When crossing borders is an everyday matter, the rules for crossing them matter every day.',
        'THE EUROPEAN UNION IS A REGIONAL ORGANIZATION WHOSE MEMBER STATES AGREE TO SHARE CERTAIN RULES. Recall the four forms of cooperation from Unit 6: this is the regional-organization form, a group of neighboring countries that agreed on rules they all follow. Two things follow immediately. First, the union is not the continent. Europe is a landmass with many countries on it, and not every country in Europe is a member of the union, so the two words are not swappable. Second, a member state is still a country. It keeps its own government, its own capital, its own languages and its own laws in most areas.',
        'THE SINGLE MARKET IS THE MECHANISM, AND IT IS THE THING TO REMEMBER. Between countries generally, sending something across a border means friction: charges collected at the border, separate product rules to meet on each side, separate permissions to work or to sell a service, separate paperwork every time. Inside the single market, member states agreed to strip most of that away among themselves. Goods, services, money and people can move from one member state to another with far less friction than between countries in general. That is why the truck in the hook keeps driving. The cheese was made to rules the members share, so it does not have to be remade or re-approved at every crossing.',
        'THE EURO IS A SHARED CURRENCY USED BY MANY MEMBER STATES, BUT NOT BY ALL OF THEM, and that is the error students make most often here. Member states that use the euro spend the same notes and coins as each other, so a shopper crossing between two of them changes no money at all. Member states that kept their national currency are full members of the union and of the single market; they simply pay in their own money at home. Being in the union and using the euro are two separate questions. Separately from currency, borders inside much of the union are crossed without routine checks -- no line of cars waiting, no passport shown at the roadside. That arrangement covers most member states, though not every one, and a few countries that are not members take part in it too.',
        'MEMBERSHIP IS A CHOICE EACH COUNTRY MAKES, AND IT HAS CHANGED OVER TIME. Countries have joined the union, and a country has left it. That is the whole of what we will say about it in this course, because the rest is an argument that people inside every member state are still having, and a geography lesson is not the place to take a side. What the fact tells you is structural: the membership of a regional organization is a list that can change, so the map of who follows which shared rules is not fixed forever.',
        'THE HONEST LIMIT, AND THE ECONOMY BEHIND IT. The union is not a government over its members. Recall Unit 6: an organization whose members are countries has no country of its own, and the rules members follow are rules the members negotiated and agreed to. Members disagree, often loudly, and working an agreement out can take years -- that is what cooperation looks like, not a sign it broke. As for the economy itself, the region is varied. Manufacturing, services, farming and tourism all matter, and different parts of Europe specialize in different mixes of them, shaped by soil, climate, coastline, minerals and what each place already built. Remember Unit 5: those are categories of activity, not a ranking. Describe the mix in a place. Never score one member against another.',
      ],
      vocabulary: [
        {
          term: 'European Union',
          definition: 'a regional organization in Europe whose members are countries that agreed to share certain rules.',
        },
        { term: 'member state', definition: 'a country that belongs to an international or regional organization.' },
        {
          term: 'single market',
          definition:
            'an arrangement in which goods, services, money and people move among member states with far less friction than between countries generally.',
        },
        { term: 'currency', definition: 'the money a country or a group of countries uses, such as notes and coins.' },
        { term: 'euro', definition: 'a shared currency used by many member states of the European Union, though not by all of them.' },
        {
          term: 'border check',
          definition: 'a stop at a border where travelers show documents before they are allowed through.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-follow-the-truck',
      kind: 'worked_example',
      problem:
        'Two invented countries, Aldenmark and Verolia, are both member states of a union with a single market. A dairy in Aldenmark loads a truck of cheese for a supermarket chain in Verolia.\n\nWork out what the single market changes about that trip, one stage at a time, and say what it does NOT change.',
      steps: [
        'First set the baseline. Imagine the same truck driving from one country to another where no such arrangement exists. At the border it stops. A charge may be collected on the cargo before it is allowed in. The cheese must meet whatever product rules the second country wrote, which may not match the first. The driver files paperwork. Every one of those is friction, and friction costs time and money.',
        'Now take the stages one at a time inside the single market. Stage one, the border charge. Member states agreed not to collect those charges on goods moving among themselves, so no charge is collected on the cheese.',
        'Stage two, the product rules. The members agreed on shared rules for how food like this is made and labeled. The dairy already made the cheese to those rules at home, so Verolia does not require it to be remade or re-approved. This is the part students miss: the rules did not disappear, they became the same rules on both sides.',
        'Stage three, the crossing itself. Inside much of the union the truck is not routinely stopped at the border at all, so the driver keeps going.',
        'Stage four, paying. If Aldenmark and Verolia both use the shared currency, the supermarket pays in the same money the dairy uses. If one of them kept its national currency, the payment is converted -- and that is normal, because using the shared currency is a separate question from being in the single market.',
        'Now the part that did NOT change, and it matters. Aldenmark and Verolia are still two countries. Each has its own government, its own capital and its own laws in most areas. The driver crossed a real border between two real countries. What changed is the amount of friction at that border, not the existence of the border.',
        'Say the whole thing in one line, because this is the line to keep: a single market lowers the cost of crossing a border. It does not erase the border, and it does not merge the countries.',
      ],
      answer:
        'The single market removes the border charge on the cheese, replaces two sets of product rules with rules both members share, and lets the truck cross without a routine check, so the trip costs less time and money than the same trip between countries generally. Payment is in the same currency only if both member states use the shared currency, which is a separate question. What does not change: Aldenmark and Verolia remain two separate countries with their own governments and laws, and the border between them still exists.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-union-is-not-a-country',
      kind: 'worked_example',
      problem:
        'A student writes: "The European Union is basically one big country now. Everyone in Europe uses the euro, and the union governs all of them."\n\nThree separate things are wrong in those two sentences. Take them one at a time and correct each.',
      steps: [
        'Wrong thing one: "one big country." Test it the way Unit 6 taught. Does the union have territory of its own, separate from its members? No. Does each member state still have its own government, capital and laws? Yes. So the members are countries that agreed to share certain rules, which is what a regional organization is. WRONG: "The union is one big country." CORRECT: "The union is an organization whose members are countries."',
        'Notice why the mistake is easy to make. When a truck crosses a border with no stop and no charge, the crossing FEELS like moving within one country. But the feeling comes from low friction, not from the countries having merged. Low friction is the whole design.',
        'Wrong thing two: "everyone in Europe uses the euro." Split that into the two errors hiding inside it. Error A: Europe is a continent and the union is an organization, and not every country in Europe is a member of it, so a claim about everyone in Europe is not a claim about the union at all. Error B: even among member states, the euro is used by many but not by all. Some members kept their national currency and are full members anyway.',
        'So the corrected version is careful about both words. WRONG: "Everyone in Europe uses the euro." CORRECT: "The euro is a shared currency used by many member states of the European Union, but not by all of them, and not every country in Europe is a member."',
        'Wrong thing three: "the union governs all of them." An organization whose members are countries does not govern those countries. The shared rules exist because the member states negotiated them and agreed to follow them. Members disagree while negotiating, and agreements take time to reach.',
        'Add the structural fact that goes with it, and stop there. Membership is a choice each country makes, and the list has changed over time: countries have joined, and a country has left. That is the extent of what we say. Why any country chose what it chose is an argument people are still having, and it is not what this lesson is for.',
        'One line to keep: the union is an agreement among countries, not a country. Every correction above is that same sentence applied to a different half of the student sentence.',
      ],
      answer:
        'First, the union is not one country -- it is a regional organization whose members are countries, each keeping its own government, capital and laws. Second, "everyone in Europe uses the euro" fails twice: not every country in Europe is a member of the union, and among member states the euro is used by many but not by all, since some kept their national currency. Third, the union does not govern its members -- the shared rules are rules the member states negotiated and agreed to follow, and membership is a choice each country makes that has changed over time.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-single-market-goods',
      kind: 'try_yourself',
      problem:
        'Two invented countries, Norvia and Castel, are both member states of a union with a single market. A furniture workshop in Norvia sells wooden chairs to stores in Castel. Which choice best describes what the single market changes for that sale?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The chairs meet product rules both members share and cross without a border charge, so selling into Castel has far less friction than selling into a country outside the union.',
          correct: true,
        },
        { id: 'b', text: 'The chairs must be sold for exactly the same price in Norvia and in Castel.' },
        { id: 'c', text: 'Norvia and Castel are now one country, so the sale never crosses a border at all.' },
        { id: 'd', text: 'The chairs may be sold only inside Norvia, because each member state keeps its own separate market.' }
      ],
      expectedAnswer:
        'The chairs meet product rules both members share and cross without a border charge, so selling into Castel has far less friction than selling into a country outside the union.',
      hints: [
        'A single market is about FRICTION at the border: charges, separate product rules, paperwork. Ask which choice is about friction and which choices are about something else.',
        'Two of the wrong choices claim something a single market never claimed to do -- set prices, and merge countries. The last one describes the opposite of a single market.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-euro-not-all-members',
      kind: 'try_yourself',
      problem: 'Which statement about the euro is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every country on the continent of Europe uses the euro.' },
        { id: 'b', text: 'Every member state of the European Union is required to use the euro.' },
        { id: 'c', text: 'The euro is used only by countries that are not members of the European Union.' },
        { id: 'd', text: 'The euro is used by many member states of the European Union, but not by all of them.', correct: true }
      ],
      expectedAnswer: 'The euro is used by many member states of the European Union, but not by all of them.',
      hints: [
        'Two separate words are being mixed up: Europe is a continent, and the European Union is an organization with member states. A statement about one is not a statement about the other.',
        'Being a member state and using the shared currency are two different questions. Some member states kept their national currency and are full members anyway.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-movement-of-people',
      kind: 'try_yourself',
      problem:
        'A nurse is a citizen of one member state of a union with a single market and takes a hospital job in a different member state. Which choice best explains why moving for that job involves less friction than moving to a country outside the union?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two member states are the same country, so the nurse did not really move anywhere.' },
        { id: 'b', text: 'The union runs the hospitals in every member state, so it simply assigned the nurse there.' },
        { id: 'c', text: 'The nurse must first give up citizenship of her own member state before taking the job.' },
        {
          id: 'd',
          text: 'The member states agreed to let people from other member states live and work among them, so the separate permissions usually needed between countries do not apply in the same way.',
          correct: true,
        }
      ],
      expectedAnswer:
        'The member states agreed to let people from other member states live and work among them, so the separate permissions usually needed between countries do not apply in the same way.',
      hints: [
        'People are one of the four things a single market moves, alongside goods, services and money. Ask what the members actually agreed to about people.',
        'Check each wrong choice against the honest limit: the union is not one country, and it is not a government that runs hospitals in its member states or takes away citizenship.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-union-versus-continent',
      kind: 'misconception_check',
      question:
        'A student writes: "The European Union is the same thing as Europe, and everyone there uses the euro." Two different mistakes are packed into that sentence. What are they, and how would you state each one correctly?',
      commonErrors: [
        {
          answer: 'The European Union is the same thing as Europe.',
          misconception:
            'Treating a continent and an organization as the same object, because the organization has the continent name in its title. The student then makes claims about a landmass that are only true of a list of member states.',
          correctsTo:
            'Europe is a continent -- a piece of the Earth surface with many countries on it. The European Union is a regional organization whose members are countries that agreed to share certain rules, and not every country in Europe is a member of it. WRONG: "Europe and the European Union are the same thing." CORRECT: "Europe is the continent; the European Union is an organization of member states located there." Once the two words are kept apart, the useful questions become askable: which countries are members, and which rules did the members agree to share.',
        },
        {
          answer: 'Everyone in the European Union uses the euro.',
          misconception:
            'Assuming that joining the organization automatically means adopting the shared currency, because both are pictured as one package labeled membership.',
          correctsTo:
            'Membership and currency are two separate questions. The euro is a shared currency used by many member states, and member states that kept their national currency are full members of the union and of the single market. WRONG: "If a country is a member, it uses the euro." CORRECT: "Many member states use the euro, and some use their own national currency." The single market is what moves goods, services, money and people with less friction; the shared currency is an extra convenience for the members that use it, not the definition of membership.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Europe packs many countries into a small area that is easy to cross -- navigable rivers, an indented coastline, dense rail and road -- so border rules affect ordinary days.',
        'The European Union is a regional organization whose member states agreed to share certain rules. It is not the continent, and a member state is still a country.',
        'The single market is the mechanism: goods, services, money and people move among member states with far less friction than between countries generally.',
        'The euro is a shared currency used by many member states, not by all of them. Membership and currency are separate questions.',
        'Borders inside much of the union are crossed without routine checks, which changes daily life for people who live near one.',
        'Membership is a choice each country makes and the list has changed over time: countries have joined, and a country has left.',
        'The union works by agreement among members who often disagree. It is not a government over them, and the economy of the region is varied rather than ranked.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Europe: Economy & the European Union' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
