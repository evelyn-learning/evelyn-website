/**
 * Grade 8 World Geography — North America: People, Cities & Economy: North
 * America: Economic Regions & Trade.
 *
 * PROCEDURE-LED row 4.4 (National Geography Standard 11), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is an ordered routine run over described data rather than a
 * mental model, the first worked example runs the routine straight through on
 * five described North American regions, the second runs the trade half of it
 * on a described two-way table, and each worked example closes with one of the
 * two standardized check moves. Two traps this plan is built to kill: hanging
 * one activity label on a whole region instead of on each step inside it, and
 * reading a raw trade total as though it measured dependence.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. Split the described region into STEPS, and label each step by what it
 *      does to the material (primary, secondary, tertiary, quaternary).
 *   2. For each step, name ONE factor that pins it there and say whether the
 *      factor is PHYSICAL (what the place itself supplies) or LOCATIONAL
 *      (what being near something supplies).
 *   3. Check the label with the could-it-move test: physically pinned work
 *      cannot leave its factor; work pinned by nearness can go wherever that
 *      nearness is cheaper.
 *   4. For trade, read the table down BOTH columns, then divide each
 *      country\'s shipment to its partner by everything that country sells
 *      abroad to get the share.
 *   5. Invert: multiply each share back by the total and recover the shipment;
 *      add the column back up and recover the total.
 *   Then change ONE input and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each where it is used, that
 * primary work takes material out of the earth while secondary work makes
 * something of it, tertiary work serves people and quaternary work handles
 * information (Grade 7, `m7geo-u5-resources-and-economic-activity.ts`), and
 * that a shipment leaving one place is the same shipment arriving in another
 * (Grade 7, `m7geo-u5-trade-and-interdependence.ts`), and re-teaches neither:
 * no keyIdea in this file defines a natural resource, sorts resources into
 * renewable and nonrenewable, defines import or export, or traces a supply
 * chain, and the strings "renewable", "nonrenewable", "supply chain" and
 * "import" appear in no authored string in this file, while "export" appears
 * in exactly one, as the vocabulary term "export share", which names a
 * division this row performs rather than one of the Grade 7 pair of labels
 * (all five checked by grep against the finished file; the two `import`
 * keywords below are TypeScript, not prose, and the words in this comment are
 * the guard, not the body). The four level names are USED as labels
 * throughout and are never given a segment, a vocabulary entry, a worked
 * example or an item of their own; the single compressed clause of premise
 * sits inside keyIdea 1, where the row\'s own work -- splitting a region into
 * steps -- takes over in the same sentence. It ADDS labeling each STEP of a
 * described regional economy rather than the region, naming one pinning factor
 * per step and sorting it into physical or locational, using the could-it-move
 * test to check the sort, reading a two-way trade table down both columns
 * before drawing any conclusion, converting each direction into a share of the
 * sending country\'s total sales abroad, and finding that the larger shipment
 * usually belongs to the less dependent country. It STOPS SHORT of
 * comparative-advantage arithmetic -- no table of what two places can produce
 * with the same effort, no gain-from-specializing computation, no single point
 * of failure and no priced backup (row 8.1 `specialization-and-supply-chain-
 * risk`) -- of multi-factor siting decisions and clustering as a subject in its
 * own right (row 8.3 `where-factories-locate`), of measuring built-up area and
 * evaluating a growth proposal (row 4.3 `north-america-metropolitan-regions`),
 * of building a composite indicator or reading an inequality measure (row 8.2
 * `composite-indicators-and-inequality`), of quantifying a strait or canal
 * closure (row 9.4 `chokepoints-and-strategic-location`), of industrial-
 * location theory by name (high school / AP), and of every chronology of
 * industry, settlement or trade (`g8-ss-industrial-revolution*.ts`,
 * `g8-ss-immigration-industrial.ts`, `ap-apush-*`). No trade agreement,
 * tariff, exchange rate or live dispute is named or evaluated anywhere.
 * Four things ARE deliberately allowed, because neighboring rows sit close
 * and the line has to be drawn rather than avoided: (a) real North American
 * regions are NAMED and what they produce is stated, which accuracy rule 9
 * requires of Unit 4 and which the scope cell asks for by name -- every
 * FIGURE in this file belongs to an invented country, basin or district, and
 * no real dollar value, tonnage, share or count appears anywhere; (b) ONE
 * clause in worked example 1 says that manufacturing regions shift over
 * decades while an oil field does not, which is the "where history explains a
 * pattern, say so in one clause" allowance and is not a chronology -- no era,
 * decade, industry history or event is named, and "decade" occurs in exactly
 * that one clause; (c) the four level names are re-used as LABELS on
 * described steps, which is application and is this row\'s, while what each
 * level IS stays unexplained, which is Grade 7\'s; (d) the observation that
 * service and information work COLLECTS in large metropolitan areas is stated
 * once, in the fifth step of worked example 1, as a consequence of the three
 * locational factors just named -- it is an observation this row\'s own scope
 * cell puts in the description ("clustered in large metropolitan areas") and
 * it is never made a subject, never explained by firms drawing other firms,
 * and never turned into a siting decision, all of which are row 8.3\'s.
 *
 * SCOPE CELL PARTS (ruling 33): the cell carries all three parts. Part (i) is
 * in `los[0].description`; parts (ii) and (iii) are the lineage and boundary
 * clauses above and appear nowhere a student can hear them. Two divergences,
 * both recorded rather than papered over. FIRST: part (i) ends "without naming
 * or evaluating any trade agreement", which is an authoring constraint rather
 * than a description of what the student does, so it was dropped from the
 * student-facing description and is mirrored in the guard above instead.
 * SECOND, and it is the substantive one: part (i) asks for "a described
 * two-way trade table between the United States and Canada", while accuracy
 * rule 3 forbids attaching an invented figure to a real named country and
 * prescribes the repair ("un-name the region and keep the pattern"). Both are
 * honored here rather than one being chosen over the other. The United States
 * and Canada DO get a two-way table, in keyIdea 4, written as the two columns
 * of GOODS that cross in each direction with no values attached -- every claim
 * in it verified this session against a named source and ledgered. The table
 * that carries VALUES, and therefore the arithmetic, belongs to an invented
 * pair (Halder and Norvane) whose described geography keeps the pattern: a
 * large southern country, a smaller northern neighbor, a long shared land
 * border, and most of the northern country\'s people living in a band close to
 * it.
 *
 * BURNED EXAMPLES (ruling 32 and 36): `los[0].description` is student-facing
 * and names five region-and-product pairs, so all five are burned as item
 * specimens. They are this row\'s teaching material and are worked in full in
 * worked example 1; every one of the three items therefore invents its own
 * basin, country pair or district. A later editor should not "helpfully" turn
 * the interior plains, the dry western valleys, the Gulf refineries, the Great
 * Lakes factories or the metropolitan service cluster into an item stem, and
 * should not move the Halder-Norvane table into an item either -- it is worked
 * in full in worked example 2 and re-used in the misconception check, which
 * ruling 22 permits between two teaching segments and forbids into an item.
 *
 * ACCURACY NOTE: every figure in this file belongs to an invented country,
 * basin or district and was written for the arithmetic. The claims about the
 * real world are the qualitative regional ones the scope cell asks for, and
 * three of them were verified against named sources during authoring rather
 * than recalled: that crude oil and natural gas cross from Canada into the
 * United States (Canada Energy Regulator, "Overview of Canada-U.S. Energy
 * Trade"); that motor vehicles and vehicle parts are among the largest goods
 * moving in BOTH directions across that border (Library of Parliament,
 * "Canadian Trade and Investment Activity: Canada-United States"); that cheap
 * lake transport bringing Lake Superior iron ore together with Appalachian
 * coal is the locational factor behind Great Lakes manufacturing (USIA, "An
 * Outline of American Geography", chapter 5); and that dry valleys in the West
 * are arid to semi-arid, farmed under irrigation, and watered in large part by
 * mountain snowmelt delivered by canal (USGS California Water Science Center,
 * "California\'s Central Valley"). All four are in the claim ledger with those
 * sources. The remaining real-place claims -- deep soils and level land on the
 * interior plains, oil and gas in the rock of the western interior and along
 * the Gulf, refineries where pipelines meet deep water, services and
 * technology clustered in large metropolitan areas -- are long-settled
 * physical and structural facts of the kind accuracy rule 2 calls safe. No
 * region, country or group of people is ranked anywhere: keyIdea 6, the SIXTH
 * step of worked example 1, the last step of worked example 2, the first
 * misconception and the last recap line each say out loud that a mix or a
 * share is a measurement of factors and flows and never a score. The only
 * authored strings in which "more advanced" and "catch up" occur are the
 * three inside the first misconception check, where they are the student
 * error being quoted and corrected.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor states the full wrong
 * STEP that produces it -- one label hung on a whole region, services and
 * information work denied the status of activity, a label picked by an
 * employment share the data never gives, a raw shipment read as dependence,
 * the difference between two shipments read as dependence, a refusal to
 * compare because the totals differ, a step that needs a material read as
 * pinned to it, a nearby physical feature read as the pin for an office, and
 * information work read as unable to travel -- and no key was built to be the
 * longest choice BECAUSE it is the key. Measured as a diagnostic, not as a
 * score: the key is the strictly longest choice in NONE of the three items,
 * ranking third, fourth and fourth of four by character count (170 against
 * 183/172/163; 148 against 180/157/150; 150 against 157/155/153). Zero is not
 * the target and is not evidence that anything worked -- chance alone produces
 * zero or one in a three-item file about 84% of the time -- and a whole course
 * driven to zero would be the same tell inverted. Ruling 16 says to re-measure
 * for the inverted tell, so it was: item 3\'s key first measured 118 against
 * 153-157, strictly shortest by a margin a student could see, and it was
 * lengthened by one load-bearing clause -- "which the place itself supplies",
 * the criterion the stem actually names -- to 150, which is mid-pack. No
 * distractor was grown anywhere, and item 2\'s key sits 2 characters under the
 * next choice, a margin inside noise that was left alone. The real measurement is the
 * 120-item course rate taken at registration, which should land near a
 * quarter. The three keys sit at ids b, c and d, which is the id set
 * `(4 + 4) mod 4 = 0` requires, omitting a. No numeric choice is ordered by
 * magnitude anywhere.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.3 -> 4.4 -> 5.1,
 * and both neighbors are written here as their real loIds
 * (`m8geo.north-america-metropolitan-regions` and
 * `m8geo.population-pyramids-and-dependency`) even though neither file exists
 * on disk yet. All 40 plans are registered in one controller commit, so the
 * chain resolves then; the two exemplars ship with empty arrays only because
 * they were registered alone, and that is not the pattern to copy.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every region description and
 * every trade table is written out in prose inside the segment that needs it,
 * and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U4_NORTH_AMERICA_ECONOMIC_REGIONS_AND_TRADE: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-economic-regions-and-trade.v1',
  title: 'North America: Economic Regions & Trade',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-economic-regions-and-trade',
      standard: 'M8GEO-4.4',
      description:
        'Given data on what several North American regions produce (grain and livestock on the interior plains, irrigated fruit and vegetables in dry western valleys, oil and gas in the western interior and along the Gulf, manufacturing in the Great Lakes region, services and technology clustered in large metropolitan areas), classify each into primary through quaternary activity, explain the location of each from physical and locational factors, and read a two-way trade table between the United States and Canada to show interdependence in both directions (National Geography Standard 11: the patterns and networks of economic interdependence on Earth\'s surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-metropolitan-regions'],
  followUps: ['m8geo.population-pyramids-and-dependency'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Break the one-way picture of trade with a pattern the student can picture, and set up the idea that one object carries four different kinds of work.',
      script:
        'Stand beside the highway at a busy land border for ten minutes and count the trucks. Some are going one way and some the other, which is unsurprising. Here is the part that is surprising: some of them are carrying the same kind of thing in both directions. Vehicle parts one way, finished vehicles the other. That cannot happen if trade is one country selling and the other country buying. It happens because a single production line has been cut in half and laid across a border, so the two halves have to keep sending each other pieces all day long. Now rewind past the trucks. Somebody pumped the oil out of rock, somebody stamped the panel, somebody drove the load, and somebody wrote the program that told the driver which dock to back into. Four completely different kinds of work on one object, and every one of them sits where it sits for a reason you can name out loud. Today you name those reasons, and then you read a trade table the way it has to be read, which is down both columns at once.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-steps-factors-and-two-columns',
      kind: 'concept',
      goal: 'Install the routine: split a region into steps and label each, name one pinning factor per step and sort it physical or locational, check with the could-it-move test, then read a trade table down both columns and turn each direction into a share.',
      keyIdeas: [
        'CLASSIFY THE STEP, NEVER THE REGION AND NEVER THE INDUSTRY. Primary work takes material out of the earth, secondary work makes something out of it, tertiary work moves it or serves the people who use it, and quaternary work handles the information about it -- and the thing you hang one of those four labels on is a STEP. "A wheat region" is not a classification, because growing the wheat is primary, milling it into flour is secondary, hauling the flour is tertiary, and the office that forecasts the harvest is quaternary, and all four of those can sit inside one county. So when a description hands you a region, split it into steps first, then ask of every step the same question: what was the material when this step began, and what is it when the step ends? Nearly every region in North America runs all four levels at once, and a report that hangs a single label on a whole region has skipped the split.',
        'EVERY STEP SITS WHERE IT SITS FOR A REASON YOU CAN NAME, AND THE REASON IS EITHER PHYSICAL OR LOCATIONAL. A PHYSICAL factor is something the place itself supplies: deep soil and level land, a long frost-free season, water that can be delivered to it, oil and gas in the rock below, a harbor deep enough for a loaded ship. A LOCATIONAL factor is something that being NEAR supplies: a large market close at hand, cheap water or rail transport, other firms doing related work, a pool of workers already trained for the job. Neither kind outranks the other and both are real explanations. The discipline is to name ONE factor for each step and to say which of the two kinds it is before explaining anything, because everything you do next depends on the kind.',
        'THE KIND OF FACTOR TELLS YOU WHETHER THE WORK COULD MOVE, AND THAT IS HOW YOU CHECK THE LABEL. Work pinned by a physical factor cannot leave it: the gas is where the rock put it, and an orchard cannot be carried to a region with a shorter growing season. Work pinned by a locational factor can move, because a second place is able to offer the same nearness -- cheaper transport, a larger market, more trained workers. So run the test on every step you have just labeled: if you called a factor physical and you can still picture the work happening three states away, you named the wrong factor. The sharp cases are the secondary steps, which go sometimes to the material and sometimes to the market, depending on which of the two is more expensive to move.',
        'A TRADE TABLE HAS TWO COLUMNS, AND A CLAIM BUILT ON ONE OF THEM IS NOT A CLAIM ABOUT TRADE. Every trading pair has a flow in each direction, and the finding called interdependence is simply that both flows are large: each place is a supplier to the other and a customer of the other at the same time. The United States and Canada are the clearest case on this continent, and the two columns are worth hearing side by side. Crossing from Canada into the United States: crude oil and natural gas, and motor vehicles and vehicle parts. Crossing from the United States into Canada: motor vehicles and vehicle parts again, along with machinery. Read one column and you can write "one country supplies the other". Read both and you find the same product family moving in both directions, which happens only when factories on the two sides of the border are working on parts of the same thing.',
        'DEPENDENCE IS A SHARE, NOT A TOTAL, AND THE LARGER SHIPMENT USUALLY BELONGS TO THE LESS DEPENDENT COUNTRY. To say how much a place depends on one partner, divide what it sends to that partner by everything it sends abroad, and set the two shares side by side. A large country spreads its selling across many partners, so even a huge shipment to one neighbor can be a small slice of its total; a smaller neighbor may send almost everything it sells to that one country, so a smaller shipment is nearly all of its total. That is exactly backwards from the way a raw total reads, and reading the total as the dependence is the most common mistake made with a trade table. A share is a measurement of a flow, never a score for a country or for the people in it.',
        'READ A REGION\'S MIX BACKWARD TO ITS FACTORS, AND STOP THERE. Once every step is labeled and every factor named, the mix says something real: a region full of primary work is a region where the soil, the water or the rock is, and a region full of quaternary work is a region where trained workers and related firms are. That is the whole of what a mix supports. It does not support a ranking. A region of grain fields and gas wells is not behind a region of design studios, and the people in it are not less capable -- the grain and the gas are there, and work follows what is there. Describe the mix, trace it back to the factors, and stop. Never score it, and never score the people.',
      ],
      vocabulary: [
        {
          term: 'physical factor',
          definition:
            'a reason a step sits where it does that the place itself supplies -- its soil, water, climate, rock or harbor -- and that the work cannot take with it.',
        },
        {
          term: 'locational factor',
          definition:
            'a reason a step sits where it does that comes from what the place is near: a market, cheap transport, other firms, or a pool of trained workers.',
        },
        {
          term: 'activity mix',
          definition:
            'the split of the work done in a place across the four levels, found by labeling each step separately instead of labeling the place as a whole.',
        },
        {
          term: 'trade flow',
          definition:
            'the value of goods moving in ONE direction between two places over a stated period; a two-way table holds one flow for each direction.',
        },
        {
          term: 'export share',
          definition:
            'the fraction of everything a place sells abroad that goes to one named partner, found by dividing the flow to that partner by that place\'s total sales abroad.',
        },
        {
          term: 'interdependence',
          definition:
            'what a two-way table shows when both flows are large: each place is at the same time a supplier to the other and a customer of the other.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-label-the-steps-and-name-the-factors',
      kind: 'worked_example',
      problem:
        'Five parts of North America, and the work done in each. For every one, name the level of activity, name the ONE factor that pins the work to that place, say whether that factor is physical or locational, and then run the test: could the work move?\n\n"Interior plains: level land, deep soils and wide fields, with steady rain in the eastern half and grassland further west. Grain is grown and cattle are raised.\n\nDry valleys in the West: very little rain falls, the growing season is long and sunny with few frosts, and irrigation water arrives by canal from snow melting in the mountains alongside them. Fruit, nuts and vegetables are grown.\n\nWestern interior and the Gulf coast: oil and natural gas lie in the rock below. Wells pump them, pipelines carry them, and refineries on the Gulf coast turn crude oil into fuels beside water deep enough for tankers.\n\nThe Great Lakes region: factories build machinery and vehicles. Iron ore comes down the lakes from ranges to the north, coal comes up from hills to the southeast, and lake freighters move heavy cargo cheaply.\n\nLarge metropolitan areas: banks, hospitals, universities, design studios and software firms."',
      steps: [
        'Interior plains first, and split before labeling. Ask the one question: what was the material when the step began, and what is it when the step ends? Nothing existed before the field and the herd; the land produced the grain and the cattle. That is PRIMARY work. The factor is level land and deep soil with enough rain, all of which the plains themselves supply, so the factor is PHYSICAL. Could the work move? Not off that soil and not out of that rain, so the answer is no.',
        'Dry valleys in the West. Fruit and vegetables come out of the ground too, so this is also PRIMARY -- but the factor is a different one, and reading it as the same one is the first trap. Very little rain falls on these valleys. What makes the orchards possible is a long frost-free season with a great deal of sun, which the valley does supply, together with water that the valley does not supply and that arrives by canal from mountain snow. Both halves are PHYSICAL, and the work sits exactly where the two halves meet. WRONG: "These valleys are farmed for the same reason the plains are, because rain falls on them." CORRECT: "Very little rain falls on them, so the farming rests on a long growing season plus a water delivery, and taking either one away stops the orchards."',
        'Oil and gas, and this is where two levels sit side by side pinned by two different kinds of factor. Pumping crude oil and natural gas out of the rock is PRIMARY, and its factor is as PHYSICAL as a factor gets: the oil and gas are where the rock put them, and no decision anybody makes can move them. Now look at the refineries on the Gulf coast. Turning crude oil into fuels is SECONDARY, and the refinery is not sitting on an oil field at all. It is sitting where the pipelines from the fields meet water deep enough for tankers. That is a LOCATIONAL factor: nearness to two different ways of moving the material.',
        'The Great Lakes region. Building machinery and vehicles is SECONDARY. The factor is LOCATIONAL: two heavy materials, iron ore from ranges to the north and coal from hills to the southeast, had to be brought together, and moving heavy cargo across the lakes was the cheap way to do it, after which the suppliers and the customers were there too. Could the work move? Yes, in principle, and that is exactly why manufacturing regions shift over decades while an oil field never does.',
        'Large metropolitan areas. Banks, hospitals and universities serve people, which is TERTIARY. Design studios and software firms work on information, which is QUATERNARY. Both have the same LOCATIONAL factor, and it has three parts: a large pool of trained workers, customers close at hand, and other firms doing related work. Could this move? Yes, and it does move, which is why it collects in large metropolitan areas instead of spreading itself evenly across the map.',
        'Read the labels down the list and say what the pattern is -- and then say what it is not. Every primary step here is pinned by something in the ground, the water or the sky. Every tertiary and quaternary step is pinned by nearness to people. The secondary steps split, one going to where the pipelines meet deep water and one going to where cheap transport brought two heavy materials together. That is a description of factors. It is not a ranking: a region of grain fields and gas wells is not behind a region of software firms, it is a region where the grain and the gas are.',
        'Rewind the data and read it backwards to confirm every label came from a sentence and not from memory: software firms and banks, vehicle factories on cheap lake transport, refineries at pipelines and deep water, wells on the oil and gas, orchards on sun and delivered water, grain and cattle on deep soil. Now change ONE input, twice, once on each kind of factor. First, suppose the canal deliveries to the dry valleys were cut in half. The sun does not change and the soil does not change, but the water does, and physically pinned work cannot follow a factor it has lost, so the orchards shrink where they stand. Second, suppose moving cargo across the lakes stopped being cheap. The vehicle factories are pinned by nearness rather than by rock, and a second place can offer the same nearness, so the work moves instead of shrinking. One change each way, and the difference between the two kinds of factor turns into the difference between shrinking and moving.',
      ],
      answer:
        'Grain and cattle on the interior plains: primary, pinned by a physical factor (level land, deep soil, enough rain), and it cannot move. Irrigated fruit and vegetables in dry western valleys: primary, pinned by two physical factors that meet there (a long frost-free sunny season, plus water delivered by canal from mountain snow), and it cannot move. Oil and gas in the western interior and along the Gulf: pumping is primary and pinned physically by what is in the rock, while refining on the Gulf coast is secondary and pinned by a locational factor, the meeting of pipelines and deep water. Machinery and vehicles in the Great Lakes region: secondary, pinned by the locational factor of cheap lake transport bringing ore and coal together, and it could move. Services and technology in large metropolitan areas: tertiary and quaternary, pinned by the locational factor of trained workers, nearby customers and related firms, and it moves to wherever those are. Cut the canal water and physically pinned work shrinks in place; raise the cost of lake shipping and work pinned by nearness relocates.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-read-the-table-both-ways',
      kind: 'worked_example',
      problem:
        'A large southern country, Halder, and its smaller northern neighbor, Norvane, share a long land border, and most people in Norvane live in a band close to it. Here is one year of trade between them.\n\n"Crossing south, from Norvane into Halder: crude oil and natural gas, 60 billion dollars; vehicle parts, 15 billion dollars.\n\nCrossing north, from Halder into Norvane: machinery and finished vehicles, 70 billion dollars; packaged foods and household goods, 20 billion dollars.\n\nNorvane sells 100 billion dollars abroad in total. Halder sells 600 billion dollars abroad in total."\n\nA commentator says: "Norvane depends on Halder, and Halder barely notices Norvane." Test the claim against the table.',
      steps: [
        'Add each direction before comparing anything, because a trade table is read down both columns and never down one. Crossing south: 60 billion dollars plus 15 billion is 75 billion. Crossing north: 70 billion plus 20 billion is 90 billion. Both figures are large and neither is zero, so goods are moving in both directions, and that single fact already breaks the picture of one country supplying another.',
        'Now read what is inside each column, not only the totals. Vehicle parts cross south and finished vehicles cross north. The same product family is moving both ways, and that happens only when factories on the two sides of the border are working on parts of the same thing. A one-way supply relationship cannot produce that pattern at all.',
        'Turn each direction into a share of the sending country\'s own selling, because that is what dependence is. Norvane sells 100 billion abroad in all, and 75 billion of it crosses into Halder: 75 divided by 100 is 0.75, which is 75 percent. Halder sells 600 billion abroad in all, and 90 billion of it crosses into Norvane: 90 divided by 600 is 0.15, which is 15 percent.',
        'Invert both, because a slipped zero inside a share stays invisible until you multiply back. 0.75 times 100 is 75, which is the southbound total, and 60 plus 15 is 75, so the column adds up as well. 0.15 times 600 is 90, which is the northbound total, and 70 plus 20 is 90. Every figure returns.',
        'Give the verdict on each half of the claim separately. "Norvane depends on Halder" is supported, and the share says how much: three quarters of everything Norvane sells abroad goes to one neighbor. "Halder barely notices Norvane" is NOT supported. Fifteen percent is a smaller share than 75 percent, but it is 90 billion dollars of sales, which is more than crosses the other way, and Halder would have to find other buyers for all of it. WRONG: "Halder ships the larger load, so Halder is the more dependent of the two." CORRECT: "Halder ships the larger load and carries the smaller share, because a large seller spreads its selling across many partners." And WRONG: "Halder\'s share is small, so Halder barely notices." CORRECT: "A small share of a large total is still a large amount, and 15 percent of 600 billion is 90 billion."',
        'The check to remember, and notice that it rests on three clues of three different kinds. The direction totals are one kind: 75 billion south and 90 billion north, both large, so the flow runs both ways. What is inside the columns is a second kind: parts going one way and finished vehicles coming back means a single production chain crosses the border twice. The shares are a third kind: 75 percent against 15 percent, which says the dependence is real on both sides and uneven in size. One number is a hunch; three of different kinds, all pointing the same way, is evidence. The verdict is that the two countries are interdependent, with Norvane carrying the larger share, and that verdict is a measurement of two flows -- never a score for either country or for the people in it.',
      ],
      answer:
        'The claim is half right. Crossing south is 60 plus 15, which is 75 billion dollars, and crossing north is 70 plus 20, which is 90 billion, so both directions are large and the trade is two-way. As a share of its own selling abroad, Norvane sends 75 of 100 billion to Halder, which is 75 percent, while Halder sends 90 of 600 billion to Norvane, which is 15 percent; multiplying each share back by its total returns 75 and 90. So Norvane does depend heavily on Halder, but Halder does not barely notice: 15 percent of a large total is 90 billion dollars of sales, more than crosses the other way, and vehicle parts going south against finished vehicles coming north show one production chain crossing the border in both directions.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-label-the-steps-not-the-basin',
      kind: 'try_yourself',
      problem:
        'The Averlin Basin, in an invented country, works like this. "Natural gas is pumped from wells across the basin. A plant beside the wells chills the gas into a liquid so that it takes up less room to ship. A rail company hauls the liquid to a port. An office in the basin\'s one town keeps the well records and forecasts how long each field will last." A regional report says: "The Averlin Basin is a primary-activity region." Which reading does the description support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: everything in the basin exists because of the gas underneath it, and work that exists because of a resource is primary activity whatever it does to that resource' },
        { id: 'b', text: 'Not quite: the wells are primary, the chilling plant is secondary, the rail haul is tertiary and the forecasting office is quaternary, so all four levels sit in one basin', correct: true },
        { id: 'c', text: 'Not quite: the wells are primary and the chilling plant is secondary, but hauling and record-keeping produce no object at all, so only two of the four steps count as economic activity' },
        { id: 'd', text: 'Supported: a region takes the label of the step that employs the most people in it, and pumping gas out of the ground is the step this whole basin was built around' },
      ],
      expectedAnswer: 'Not quite: the wells are primary, the chilling plant is secondary, the rail haul is tertiary and the forecasting office is quaternary, so all four levels sit in one basin',
      hints: [
        'Take the region apart into its steps before hanging any label, and ask of each step what the material was when the step began and what it is when the step ends. A label belongs to a step, not to a basin.',
        'Four steps are described: pumping, chilling, hauling and forecasting. Test each one against a different level instead of accepting a single label for the whole basin. Moving something and producing information about it are both real economic activity even though neither makes an object, and the description gives no employment figures at all, so no step can be picked out as the biggest employer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-share-not-total',
      kind: 'try_yourself',
      problem:
        'Two neighboring countries trade with each other. "Ostrey sells 40 billion dollars of goods to Palven in a year, and everything Ostrey sells abroad adds up to 50 billion dollars. Palven sells 60 billion dollars of goods to Ostrey in the same year, and everything Palven sells abroad adds up to 500 billion dollars." A report says: "Palven is the more dependent of the two, because it ships more across the border than Ostrey does." Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: 60 billion dollars crossing one way is more than the 40 billion crossing the other, and the country that ships more has more riding on that border' },
        { id: 'b', text: 'Not supported: the two countries sell such different amounts abroad in total that their trade with each other cannot be compared on any measure at all' },
        { id: 'c', text: 'Not supported: 40 of the 50 billion Ostrey sells abroad goes to Palven, which is 80 percent, against 60 of Palven\'s 500 billion, which is 12 percent', correct: true },
        { id: 'd', text: 'Supported: Palven sends 60 billion and receives 40 billion, so it has 20 billion more tied up in that border than Ostrey has, and the larger figure names the more dependent country' },
      ],
      expectedAnswer: 'Not supported: 40 of the 50 billion Ostrey sells abroad goes to Palven, which is 80 percent, against 60 of Palven\'s 500 billion, which is 12 percent',
      hints: [
        'Dependence asks how much of a country\'s own selling rides on one partner, so the figure you divide by is everything that country sells abroad, not the shipment crossing the border.',
        'Divide each country\'s shipment to its neighbor by that country\'s own total sales abroad, then multiply each share back by that total and check the shipment returns. Comparing the two shipments against each other, subtracting one from the other, or refusing to compare because the totals differ are three ways of never doing that division.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-step-is-pinned-physically',
      kind: 'try_yourself',
      problem:
        'The Ferrow district, in an invented country, runs from an iron-ore range inland, along a rail line, down to a deep natural harbor on the coast. "Four kinds of work go on in it: a mine on the ore range; a smelter at the harbor that turns the ore into metal bars; a shipping agency that books cargo space for the smelter and for other firms; and an engineering firm that designs ore-handling machinery and sells the designs to customers abroad." Which one of the four is pinned to its place by a PHYSICAL factor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The smelter, because it cannot exist without the ore, and a step that depends on a material is held in place by that material just as firmly as the mine is' },
        { id: 'b', text: 'The shipping agency, because the deep natural harbor is a physical feature of the district and booking cargo through that harbor is the whole of the business' },
        { id: 'c', text: 'The engineering firm, because ore-handling machinery can only be designed where ore is actually being handled, so the ore range reaches that step as well' },
        { id: 'd', text: 'The mine, because the ore lies in the rock where the rock put it, which the place itself supplies, so a district without that rock has nothing to mine', correct: true },
      ],
      expectedAnswer: 'The mine, because the ore lies in the rock where the rock put it, which the place itself supplies, so a district without that rock has nothing to mine',
      hints: [
        'Ask of each step whether the place itself supplies its reason, or whether being near something supplies it. Only one of the four is held by something that is in the ground.',
        'Run the could-it-move test on all four: a smelter can be built at another harbor with a rail line behind it, an agency can book cargo from any office with a telephone, and a design travels as information to wherever it is wanted. Needing a material is not the same thing as being pinned to where that material is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mix-as-rank-and-total-as-dependence',
      kind: 'misconception_check',
      question:
        'A student writes two sentences. On two regions: "Region Kesset grows grain and pumps gas while Region Denby writes software, so Denby is the more advanced of the two and Kesset needs to catch up." On the Halder and Norvane table: "Halder ships 90 billion dollars of goods north and Norvane ships 75 billion south, so Halder is the one with more at stake in that border." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Region Denby writes software and Region Kesset grows grain and pumps gas, so Denby is more advanced and Kesset needs to catch up.',
          misconception:
            'Reading the four levels as a ladder of progress, so that a region\'s mix turns into a score for the region and, without anyone meaning it, for the people who live there. The words primary, secondary, tertiary and quaternary sound like an order, and the mix is then treated as a position in that order rather than as evidence about factors.',
          correctsTo:
            'A mix is evidence about factors and nothing else. Kesset has grain and gas because the soil, the rain and the rock are there, and those are physical factors that no region can decide to have. Denby has software firms because trained workers, clients and other design firms are there, and those are locational factors. Split each region into steps and both regions turn out to run all four levels anyway: Kesset\'s grain fields are primary, the mill that turns the grain into flour is secondary, the trucks that carry the flour are tertiary, and the office that forecasts the harvest is quaternary. WRONG: "Denby is more advanced, and Kesset needs to catch up." CORRECT: "Kesset\'s mix follows its soil and its rock, and Denby\'s follows its workers and its clients, so each mix names the factors that region has and neither names a rank." A mix is described and traced back to its factors. It is never scored, and the people are never scored either.',
        },
        {
          answer: 'Halder ships 90 billion dollars north and Norvane ships 75 billion south, so Halder has more at stake in that border.',
          misconception:
            'Reading a raw shipment as though it measured dependence, which sets the two shipments against each other instead of setting each shipment against the country that sent it.',
          correctsTo:
            'Dependence is a share, so each shipment is divided by that country\'s own total sales abroad. Norvane sells 100 billion dollars abroad in all and 75 billion of it goes to Halder: 75 divided by 100 is 0.75, which is 75 percent. Halder sells 600 billion abroad in all and 90 billion of it goes to Norvane: 90 divided by 600 is 0.15, which is 15 percent. Check both by multiplying back: 0.75 times 100 is 75, and 0.15 times 600 is 90, so both shipments return. WRONG: "Halder ships more, so Halder has more at stake." CORRECT: "Halder ships the larger load and carries the smaller share, 15 percent against 75 percent, because Halder spreads its selling across many partners while Norvane sends three quarters of everything it sells to one neighbor." The 90 billion is still real and still matters, because Halder would have to find other buyers for it, so the finding is that the dependence runs in both directions and is uneven, not that it runs one way.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Classify the step, never the region. Growing the grain is primary, milling it is secondary, hauling the flour is tertiary and forecasting the harvest is quaternary, and one region runs all four at once.',
        'Name one factor for each step and say which kind it is. A physical factor is what the place itself supplies; a locational factor is what being near something supplies.',
        'Check the label with the could-it-move test. Physically pinned work cannot leave its soil, water or rock; work pinned by nearness goes wherever that nearness is cheaper.',
        'Primary steps are nearly always pinned physically and quaternary steps nearly always by nearness. The secondary steps are the interesting ones: a refinery goes where the pipelines meet deep water, and a vehicle plant goes where cheap transport and suppliers are.',
        'Read a trade table down both columns before saying anything. Interdependence is the finding that both flows are large, so each place is a supplier to the other and a customer of the other at the same time.',
        'Dependence is a share, not a total: divide each country\'s shipment to its partner by everything that country sells abroad. The larger shipment usually belongs to the less dependent country.',
        'A mix is evidence about factors and never a rank. A region carries the work its soil, rock, water, workers and neighbors allow, and no region and no group of people is ahead of or behind another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'North America: Economic Regions & Trade' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
