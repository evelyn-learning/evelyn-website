/**
 * Grade 8 World Geography — Globalization, Trade Networks & Development:
 * Specialization & Supply-Chain Risk.
 *
 * CONCEPT-LED (shaped on `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`).
 * The row installs TWO computations and then makes the student use each on
 * described data: (1) from a two-country, two-good same-effort table, divide
 * inside each country's own row to get what one good COSTS that country in the
 * other, pick the specializer by the smaller give-up figure, check that the
 * agreed trade rate sits between the two figures, and subtract to size each
 * side's gain; (2) walk a chain stage by stage, count the alternatives at each
 * stage to find the single points of failure, and price a proposed backup
 * against the stoppage it prevents. Every item is answered by a computed
 * figure, a named place-in-the-data or a verdict with its arithmetic, never by
 * a definition.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each where it is used, that
 * places trade because no place produces everything and that a finished object
 * arrives through a sequence of places (Grade 7,
 * `m7geo-u5-trade-and-interdependence.ts`), and re-teaches neither: no keyIdea
 * in this file defines trade, import, export, interdependence or supply chain,
 * no such term appears in the vocabulary list (which is six analytical terms,
 * each defined by the operation it names), and the premise clause appears once,
 * inside keyIdea 1, where it is called the starting line rather than the
 * lesson. It ADDS the give-up arithmetic from a same-effort table, the ruling
 * that a country cannot give up less in both goods, the test that a workable
 * trade rate lies between the two give-up figures, the subtraction that sizes
 * each side's gain in its own good, the stage-by-stage count of alternatives
 * that locates a single point of failure, and the break-even that prices a
 * backup. It STOPS SHORT of tariffs, exchange rates between currencies, trade
 * policy and every named trade agreement, which the signed curriculum puts
 * outside this course at any grade; of siting a firm from location factors
 * (row 8.3 `where-factories-locate`); of building a composite or reading an
 * inequality share (row 8.2 `composite-indicators-and-inequality`); of
 * measuring an access gap (row 8.4 `connectivity-and-the-digital-divide`); of
 * classifying activity or reading a two-way regional trade table (row 4.4
 * `north-america-economic-regions-and-trade`); and of any named economic model
 * or curve -- the words "comparative advantage" and "absolute advantage" are
 * deliberately not used with the student, who is given "gives up less" and
 * "ahead in both", and nothing is drawn or written algebraically. Three things
 * ARE deliberately allowed, because two neighbors sit close and the line has to
 * be drawn rather than avoided: (a) currency figures, which the register rule
 * names this row as one of four that may carry them, and which the backup
 * pricing genuinely needs; (b) a strait appears as ONE link inside an invented
 * firm's chain and is IDENTIFIED as a single point of failure by its count of
 * alternatives -- it is never priced by the share of a good passing through it
 * nor by the distance or days an alternative route would add, which is row 9.4
 * `chokepoints-and-strategic-location`, and no real strait, canal or port is
 * named anywhere in the body; (c) the break-even in the second worked example
 * divides one stoppage's loss by the backup's yearly cost, because "the cost of
 * a backup" is in this row's signed scope -- it computes no chance per year, no
 * product of components and no risk figure, which is row 7.1's
 * `hazard-risk-exposure-and-vulnerability`. The signed scope cell for this row
 * carries all three parts (positive statement, lineage clause, withheld
 * clause), so no part is missing and none was invented.
 *
 * BURNED BY THE OBJECTIVE (ruling 36): `los[0].description` is student-facing
 * and names the triad "one supplier, one strait, one port" as the kinds of
 * single point of failure. A later editor must NOT build an item whose whole
 * work is naming that triad. Item 3 is written past the burn: its work is
 * counting a ROUTE as a stage and then judging whether a second supplier on the
 * same side of the same strait removes the route failure too.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: read every keyIdea and notice what each
 * one is ABOUT. None of them says why places trade, what an export is, or what
 * a supply chain is; every one says what you DO -- divide inside a row, read a
 * ratio upside down, check a rate against a range, subtract to size a gain,
 * count the choices at a stage, divide a loss by a yearly cost. The Grade 7
 * file this row deepens was read next to this one, and the closest pair was
 * keyIdea 5 here ("count the choices at every stage, and a route is a stage")
 * against Grade 7's "a supply chain is the whole route an object took before it
 * reached you". KeyIdea 5 survived because it is a counting procedure over a
 * described chain whose output is a located failure point, and the Grade 7
 * lesson's items are answered by naming the chain rather than measuring it.
 *
 * ACCURACY NOTE: no real country, firm, product chain, strait, canal or port is
 * named anywhere in the file, and no real place carries a number. Every place,
 * firm and figure is invented and was written for the arithmetic. No place or
 * its people is ranked, and the file says out loud that a country ahead in both
 * goods is not thereby a better place -- the figures rank what it costs each
 * place to make a thing, and nothing else. The only claims about the real world
 * are that no place produces everything it uses (the premise the signed scope
 * line names) and that the two give-up figures computed from one country's row
 * are the same ratio read upside down, which is arithmetic rather than
 * geography.
 *
 * ANSWER-CUE NOTE: the three MCQs are written against deferred finding DF-3
 * (in the shipped Grade 7 Geography bank the keyed answer was the strictly
 * longest choice 67% of the time; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor states the full wrong STEP
 * that produces it -- output read instead of give-up, the two countries' costs
 * compared with each other instead of price against home cost, the flour handed
 * over read as the saving, a stage weighed by value instead of counted by
 * alternatives, a second supplier assumed to fix the route it shares -- and no
 * key was built to be the longest choice BECAUSE it is the key. Measured as a
 * diagnostic and not as a score: the key is the strictly longest choice in one
 * of the three items, ranking second, fourth and second of four by character
 * count in items 1, 2 and 3. Zero is NOT the target and neither is three; the
 * meaningful measurement is the 120-item course rate taken at registration,
 * which should land near a quarter. The three keys sit at ids a, c and d, which
 * is the id set `(8 + 1) mod 4 = 1` requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table, chain and
 * geometry is written out in prose inside the segment that needs it, and every
 * item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U8_SPECIALIZATION_AND_SUPPLY_CHAIN_RISK: LessonPlan = {
  id: 'evelyn.ms.m8geo.specialization-and-supply-chain-risk.v1',
  title: 'Specialization & Supply-Chain Risk',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.specialization-and-supply-chain-risk',
      standard: 'M8GEO-8.1',
      description:
        'Given a two-country, two-good table of what each can produce with the same effort, show why both gain when each specializes in what it produces relatively better and trades, then evaluate a multi-country supply chain for its single points of failure (one supplier, one strait, one port) and the cost of a backup (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.mitigation-adaptation-and-resilience'],
  followUps: ['m8geo.composite-indicators-and-inequality'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a late delivery and a low price side by side so the student wants both the arithmetic of the gain and the walk down the chain, before either one is named.',
      script:
        'Your school ordered 400 laptops in September and they arrived in May. The note from the supplier said one plant, in one town on the other side of an ocean, had stopped for three weeks. One plant stopping, and the order arrived eight months after it was placed. Now the part that sounds like a contradiction. Those same laptops still cost the school less than having them built in your own town would have -- and that would have been true even if your town could build every single part of them better than the places that actually did. Both of those facts fall out of the same kind of table: a few numbers about what each place can make with the same effort. Today you work that table twice. First you compute who should make what, and exactly how much each side gains. Then you walk the chain from part to doorstep and find the one link where all of it can stop.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-give-up-less-and-count-the-links',
      kind: 'concept',
      goal: 'Install the two computations this row runs -- what each place gives up, read out of a same-effort table, and the count of choices at each stage of a chain -- and the two decisions they feed: which good each place should make and what each side gains, and where a chain can stop and whether a backup is worth its price.',
      keyIdeas: [
        'PRODUCING MORE IS NOT THE QUESTION. GIVING UP LESS IS, AND YOU DIVIDE TO FIND IT. That no place produces everything it uses is the starting line here, not the lesson. Put a two-country, two-good table in front of you -- what each place can make with the SAME effort -- and the figure that decides everything is not printed in it. You compute it, and you compute it inside one country\'s own row: divide that country\'s output of one good by its output of the other, and you have what one unit of the second good COSTS that country in the first. A month of effort that makes 900 tons of grain or 300 crates of glass says that each crate costs that country 900 divided by 300, which is 3 tons of grain it did not grow. Never divide across the two countries. The give-up figure is a fact about one place\'s own choices, and it is the only figure specializing is decided on.',
        'NO PLACE GIVES UP LESS IN BOTH GOODS -- THE ARITHMETIC WILL NOT LET IT. Run the same row both directions and watch. If one country gives up more grain for each crate of glass than the other does, then it gives up less glass for each ton of grain, every single time, because the two figures are the same ratio read upside down. So a two-good table always hands each side exactly one good it is the cheaper maker of. It does this even when one country is ahead in both columns of the table, which is the case worth slowing down for: being ahead in both is about how much comes out, and the give-up figure is about what had to be dropped to get it. The one case with nothing to gain is the tie, where the two countries give up the same amount, and then there is no cheaper maker and no trade worth making.',
        'A WORKABLE TRADE RATE SITS BETWEEN THE TWO GIVE-UP FIGURES, AND THAT GAP IS WHERE THE GAIN LIVES. Suppose a crate costs one country 3 tons of grain to make and the other 1 ton. Any rate between 1 and 3 tons of grain per crate leaves both sides better off than making the crate themselves: at 2 tons per crate the first country pays 2 for what would have cost it 3, and the second country takes in 2 for something that cost it 1. Outside that gap the arithmetic says no. At 4 tons per crate the buyer would rather make its own, and at half a ton the seller would rather keep its glass. So before you price a trade, check the rate against the two figures -- if it is not between them, one side is being asked to accept less than it can get at home.',
        'THE GAIN IS A SUBTRACTION, AND EACH SIDE COUNTS ITS OWN GAIN IN ITS OWN GOOD. For each side: work out what the goods would have cost at home, using that side\'s own give-up figure, then subtract what they actually cost through the trade, and multiply out for the quantity. The buyer of glass counts its saving in tons of grain it did not have to hand over; the seller of glass counts its saving in crates it did not have to give up to grow grain. That is why "who gained more" is usually the wrong question -- the two savings are measured in different goods -- and why "did both gain" is answerable with digits every time.',
        'TO FIND WHERE A CHAIN BREAKS, COUNT THE CHOICES AT EVERY STAGE -- AND A ROUTE IS A STAGE. Walk the chain from raw material to buyer and write the number of alternatives beside each step: three mills, two dye houses, one cutting plant, one rail tunnel, four warehouses. The stage with a count of one is the single point of failure, because when it stops, everything after it stops. Size is not the test and value is not the test: a stage spread across three mills that carries most of the value of the finished thing sends its work to the other two and the chain keeps moving, while a stage with one plant making the cheapest part in the product takes the whole chain down with it. And the stages a supplier list leaves out are the ones to look for hardest -- a single road, a strait, a tunnel, a port that everything passes through -- because nobody writes a strait on a purchase order.',
        'PRICE A BACKUP AGAINST THE STOPPAGE IT PREVENTS, THEN CHECK THAT IT IS REALLY A BACKUP. A second supplier costs extra every year, needed or not, so put the two figures side by side: divide what one stoppage costs by what the backup costs in a year, and the answer is how rarely a stoppage can arrive before the backup stops being worth it. Then run the check that most answers skip. A backup that depends on the same single link is not a backup: two suppliers on the same side of the same strait, two warehouses on the same one road, two plants drawing from the same one power line. The count at that shared stage is still one, and the money bought nothing there.',
      ],
      vocabulary: [
        {
          term: 'give-up figure',
          definition:
            'what one unit of a good costs a place in the OTHER good, found by dividing that place\'s output of the two goods for the same effort.',
        },
        {
          term: 'specialization',
          definition:
            'putting a place\'s effort into the good it gives up the least to make, and trading for the rest.',
        },
        {
          term: 'trade rate',
          definition:
            'how much of one good is handed over for one unit of the other in an agreed trade -- the figure that has to sit between the two sides\' give-up figures for both of them to gain.',
        },
        {
          term: 'single point of failure',
          definition:
            'a stage of a chain with exactly one supplier, route or facility, so that everything after it stops when that one stops.',
        },
        {
          term: 'backup',
          definition:
            'a second supplier, route or facility added at a stage, which counts as one only if it does not depend on the same single link the first one does.',
        },
        {
          term: 'break-even',
          definition:
            'the point where what a backup costs equals what the stoppage it prevents would cost, found by dividing the loss from one stoppage by the backup\'s cost for a year.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-who-makes-what-and-what-each-gains',
      kind: 'worked_example',
      problem:
        'Two invented countries, Avenor and Brindale, are deciding what to make and what to buy.\n\n"With the same effort -- one month of work from the same number of workers -- Avenor can produce either 600 tons of grain or 300 crates of glass. Brindale can produce either 150 tons of grain or 150 crates of glass."\n\nAvenor is ahead in both goods. Work out which country should make which good, then find how much each side gains if Avenor buys 100 crates of glass at a rate of 3 tons of grain for every 2 crates.',
      steps: [
        'Read the table before dividing anything, and notice the trap sitting in it. With the same effort Avenor makes more grain than Brindale, 600 tons against 150, and more glass too, 300 crates against 150. WRONG: "Avenor is ahead in both, so Avenor should make both and Brindale should make nothing." CORRECT: "Being ahead in both is a fact about how much comes out. What decides who makes what is what each country gives up, and that figure is not in the table yet."',
        'Compute what a crate of glass costs each country in grain, inside each country\'s own row. Avenor: 600 tons divided by 300 crates is 2, so every crate of glass Avenor makes costs it 2 tons of grain it did not grow. Brindale: 150 divided by 150 is 1, so a crate costs Brindale 1 ton of grain. Brindale gives up less for a crate, so glass is Brindale\'s good.',
        'Now run the same two rows the other way, for grain. Avenor: 300 crates divided by 600 tons is 0.5, so every ton of grain costs Avenor half a crate of glass. Brindale: 150 divided by 150 is 1, so a ton of grain costs Brindale a whole crate. Avenor gives up less for a ton of grain, so grain is Avenor\'s good. Each country came out the cheaper maker of exactly one good, which is what this arithmetic always does: one country\'s two figures are the same ratio read upside down.',
        'Check the agreed rate before pricing anything with it. A crate costs Brindale 1 ton of grain to make and costs Avenor 2 tons, so any rate between 1 and 2 tons of grain per crate leaves both sides better off than making the crate at home. The agreed rate is 3 tons for every 2 crates, and 3 divided by 2 is 1.5 tons per crate. 1.5 is between 1 and 2, so the rate works for both.',
        'Price the trade from Avenor\'s side. Avenor buys 100 crates at 1.5 tons each: 100 times 1.5 is 150 tons of grain handed over. Making those same 100 crates at home would have cost Avenor 100 times 2, which is 200 tons of grain given up. 200 minus 150 is 50, so Avenor comes out 50 tons of grain ahead.',
        'Now stand in Brindale and price the same trade in Brindale\'s own good. Brindale takes in 150 tons of grain. Growing 150 tons at home would have cost Brindale 150 crates of glass, because a ton of grain costs it a whole crate. It handed over 100 crates. 150 minus 100 is 50, so Brindale comes out 50 crates of glass ahead. Both sides gained, and each counted the gain in the good it did not have to give up.',
        'Invert the arithmetic before trusting it. 100 crates times 1.5 tons is 150 tons, which is the payment, and 150 tons divided by 1.5 is 100 crates, which is the shipment -- the two directions agree. Check the trade against the table too: a month of Brindale\'s effort makes 150 crates, so shipping 100 leaves it 50, and a month of Avenor\'s effort makes 600 tons, so shipping 150 leaves it 450. Nothing in the trade is bigger than what the table says can be made.',
        'Rewind the table, then change ONE input. Read the four figures back through: 150 and 150 for Brindale, 300 and 600 for Avenor. Now suppose Brindale could make 150 tons of grain or only 75 crates of glass. 150 divided by 75 is 2, which is exactly what a crate costs Avenor. No rate sits between 2 and 2: at 2 tons per crate Avenor pays 100 times 2, which is 200 tons, for crates that making at home would also have cost it 200 tons, and 200 minus 200 is 0. Nobody gained anything. The gain never came from Avenor being ahead or Brindale being behind. It came from the two give-up figures being different.',
      ],
      answer:
        'Glass is Brindale\'s good and grain is Avenor\'s. A crate of glass costs Avenor 2 tons of grain (600 divided by 300) and costs Brindale 1 ton (150 divided by 150); a ton of grain costs Avenor half a crate (300 divided by 600) and costs Brindale a whole crate. The agreed 3 tons for every 2 crates is 1.5 tons per crate, which sits between 1 and 2, so it works for both. Avenor pays 150 tons for 100 crates that would have cost it 200 tons to make and gains 50 tons of grain; Brindale takes in 150 tons of grain that would have cost it 150 crates to grow and pays 100 crates, gaining 50 crates of glass. Avenor being ahead in both goods does not change the answer -- but if Brindale\'s glass figure fell to 75 crates, both countries would give up 2 tons of grain per crate and the trade would gain nobody anything.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-find-the-break-and-price-the-backup',
      kind: 'worked_example',
      problem:
        'A firm assembles field radios. Stage by stage, here is its chain and how many places it can turn to at each stage.\n\n"Case plastic: molded at any of four plants. Circuit boards: made at any of three plants. Battery cells: made at one plant, in the town of Ostral. The cells travel to the assembly region through the Kelter Strait, which is the only sea route between the two regions. They land at either of two ports. Assembly: either of two plants."\n\nTwo pieces of history: two years ago a fire closed one of the four molding plants for a month, the other three took the work, and no radio shipped late; three years ago the Ostral plant stopped for three weeks and the assembly lines stopped with it.\n\nThe firm can add a second cell plant, in the same region as Ostral, whose cells would sail through the same strait. The firm buys 100,000 cells a year, the second plant would charge $3 more for each cell, assembly runs 2,000 radios a week, and the firm loses $200 on every radio it cannot deliver. Find the single points of failure, and decide whether the second cell plant is worth its price.',
      steps: [
        'Walk the chain and write the count of choices beside each stage, in order: molding 4, boards 3, cells 1, sea route 1, ports 2, assembly 2. Those six numbers are the whole analysis of where this chain can break. WRONG: "Start with the biggest stage, because that is where most can go wrong." CORRECT: "Start with the smallest count, because a stage with four plants sends its work to the other three and a stage with one sends it nowhere."',
        'Name the single points of failure: the cell plant at Ostral, with a count of 1, and the Kelter Strait, also with a count of 1. A route is a stage in exactly the same way a factory is. It is also the stage a supplier list leaves out, because nobody writes a strait on a purchase order.',
        'Price the backup. The second cell plant would charge $3 more for each cell and the firm buys 100,000 cells a year, so 100,000 times $3 is $300,000 a year -- paid every year, whether or not Ostral ever stops again.',
        'Price the stoppage the backup prevents, using the one that actually happened. Ostral stopped for three weeks and assembly runs 2,000 radios a week: 3 times 2,000 is 6,000 radios not built. The firm loses $200 on every radio it cannot deliver: 6,000 times $200 is $1,200,000.',
        'Put the two figures together. $1,200,000 divided by $300,000 is 4. So the backup pays for itself if a three-week cell stoppage would otherwise arrive more often than once in four years, and it is money spent for nothing if such a stoppage is rarer than that. Invert to check every figure: $300,000 a year for 4 years is $1,200,000, which is the loss; $1,200,000 divided by 6,000 radios is $200 a radio; 6,000 radios divided by 2,000 a week is 3 weeks; and $300,000 divided by 100,000 cells is $3 a cell. Everything returns.',
        'Now ask what the backup does NOT buy, which is the step most answers skip. Both cell plants would sit in the same region, on the same side of the Kelter Strait, and every cell from either of them sails through it. The count at the cell stage rises from 1 to 2. The count at the route stage stays at 1. A closed strait stops this chain exactly as thoroughly after the backup is built as before it.',
        'The check to remember: three clues of three different kinds, all pointing the same way. The counts are one kind of evidence, and they put a 1 at the cell stage and a 1 at the route stage. The history is a second kind: the one time the chain actually stopped, it stopped at a stage with a count of one, while a month-long fire at a stage with a count of four cost nothing at all. The geography is a third kind: both cell plants would sit on the same side of the same strait, so the second one cannot rescue the route. One number is a hunch; three of different kinds, all agreeing, is evidence. The verdict: two single points of failure, a backup that removes one of them for $300,000 a year and pays for itself against stoppages more frequent than once in four years, and nothing bought against a closed strait.',
      ],
      answer:
        'The counts along the chain are 4, 3, 1, 1, 2, 2, so there are two single points of failure: the one cell plant at Ostral and the one sea route through the Kelter Strait. The backup costs 100,000 times $3, which is $300,000 a year, against a stoppage that cost 3 times 2,000, which is 6,000 radios, at $200 each, which is $1,200,000. $1,200,000 divided by $300,000 is 4, so the second cell plant is worth its price if a three-week stoppage would otherwise arrive more often than once in four years. It removes the cell-plant failure only: both plants would ship through the same strait, so the route stage still has a count of one.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-who-specializes-in-what',
      kind: 'try_yourself',
      problem:
        '"Sarnia can produce, with one month of effort, either 800 tons of rice or 400 crates of tiles. Tevane can produce, with the same effort, either 300 tons of rice or 300 crates of tiles."\n\nWhich country should make which good, and on what figure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sarnia should make the rice and Tevane the tiles, because a crate of tiles costs Sarnia 2 tons of rice and costs Tevane 1 ton', correct: true },
        { id: 'b', text: 'Sarnia should make both goods, because the same effort gives it 800 tons of rice against 300 and 400 crates of tiles against 300' },
        { id: 'c', text: 'Sarnia should make the tiles and Tevane the rice, because Sarnia turns out 400 crates against Tevane\'s 300 and is the stronger tile maker' },
        { id: 'd', text: 'Neither should specialize, because Sarnia is ahead in both goods and would be giving up output whichever good it moved its effort into' },
      ],
      expectedAnswer: 'Sarnia should make the rice and Tevane the tiles, because a crate of tiles costs Sarnia 2 tons of rice and costs Tevane 1 ton',
      hints: [
        'Producing more and giving up less are two different questions, and only the second one decides this. Inside each country\'s own row, divide the tons of rice by the crates of tiles, and you have the rice each crate costs that country.',
        'Both give-up figures come from a country\'s own two numbers, never from setting one country\'s output against the other\'s. Reading off who turns out more tiles, handing both goods to the country that is ahead in both, or deciding that being ahead in both means specializing gains nothing are three ways of never doing that division.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-size-of-the-gain',
      kind: 'try_yourself',
      problem:
        'Making one crate of rope costs Lonn 4 sacks of flour it could have made with the same effort. The same crate costs Merrow 2 sacks. The two agree to trade at 3 sacks of flour for each crate of rope, and Lonn buys 50 crates. How much flour does Lonn save, compared with making those 50 crates itself?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '100 sacks of flour, the gap between what a crate costs Lonn and what it costs Merrow, taken 50 times' },
        { id: 'b', text: '200 sacks of flour, what making the 50 crates at home would have cost Lonn in flour given up' },
        { id: 'c', text: '50 sacks of flour, the 200 sacks making them at home would have cost, less the 150 sacks paid', correct: true },
        { id: 'd', text: '150 sacks of flour, the flour Lonn hands over for the 50 crates at the agreed rate of 3 sacks each' },
      ],
      expectedAnswer: '50 sacks of flour, the 200 sacks making them at home would have cost, less the 150 sacks paid',
      hints: [
        'A saving is a difference, not a total. Work out what the 50 crates would have cost Lonn in flour at its own rate of 4 sacks each, then what the 50 crates actually cost at the agreed 3 sacks each.',
        'Subtract the second from the first. The flour handed over and the flour that making the crates at home would have cost are both real figures here, but neither one is the saving by itself, and the gap between the two countries\' own give-up figures answers a different question altogether.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-the-chain-breaks',
      kind: 'try_yourself',
      problem:
        'A firm builds water pumps.\n\n"The steel body is cast at any of five foundries. The motor is wound at one plant, in Haldane. The motors travel to the assembly region through the Serrin Strait, the only sea route between Haldane and that region. Assembly happens at either of two plants. The finished pumps leave through any of three ports."\n\nThe firm proposes a second motor plant, in the same region as Haldane, shipping through the same strait. Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The chain has one single point of failure, the one motor plant, and the second plant removes it, so the chain is then left with none' },
        { id: 'b', text: 'The chain is weakest at the five foundries, because the more plants a stage is spread across, the more places a stoppage can begin' },
        { id: 'c', text: 'The chain has two single points of failure, and the second motor plant removes both, because motors would then come from two different plants' },
        { id: 'd', text: 'The chain has two single points of failure, the one motor plant and the one sea route, and the second plant removes only the first', correct: true },
      ],
      expectedAnswer: 'The chain has two single points of failure, the one motor plant and the one sea route, and the second plant removes only the first',
      hints: [
        'Walk the chain one stage at a time and write down how many choices the firm has at each: foundries, motor plants, sea routes, assembly plants, ports. Any stage with exactly one is a place the whole chain can stop.',
        'A route is a stage too, so it gets counted like the rest. Then ask where the proposed second motor plant would sit: if it is on the same side of the same strait, the strait is still the only way through, so the second plant fixes the stage it stands at and nothing else. A stage with five choices is not the weak point however much of the pump it makes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ahead-in-both-and-biggest-stage',
      kind: 'misconception_check',
      question:
        'A student works two invented cases. First, a table: Velka can produce either 900 tons of timber or 300 tons of steel with one month of effort, and Wren can produce either 400 tons of timber or 200 tons of steel with the same effort. The student writes: "Velka is ahead in both columns, so Velka should make both goods and trade for nothing." Second, a chain whose first stage is spread across four mills that supply 60 percent of the value of the finished product, and whose third stage is a single plant making one small part. The student writes: "The four mills are the single point of failure, because that is where most of the value comes from." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Velka is ahead in both columns, so Velka should make both goods and trade for nothing.',
          misconception:
            'Deciding who makes what from how much each place produces instead of from what each place gives up. Being ahead in both columns feels as though it settles the question, and it settles nothing until each row has been divided through.',
          correctsTo:
            'Divide inside each country\'s own row. Velka: 900 tons of timber or 300 tons of steel, and 900 divided by 300 is 3, so each ton of steel costs Velka 3 tons of timber. Wren: 400 divided by 200 is 2, so each ton of steel costs Wren 2 tons of timber. Wren gives up less for a ton of steel, so steel is Wren\'s good -- even though Velka out-produces it in steel, 300 tons against 200. Read the same rows the other way and the ratios flip, as they always do: Velka gives up 1 ton of steel for every 3 tons of timber it makes, Wren gives up 1 ton of steel for every 2 tons, so timber costs Velka less and timber is Velka\'s good. WRONG: "Ahead in both columns, so it should make both." CORRECT: "Ahead in both columns, and still the more expensive maker of steel, because 3 tons of timber given up is more than 2." Check the divisions back: 3 times 300 is 900, and 2 times 200 is 400, so both rows return. And note what this is not: the figures say what a thing costs each place to make, and they rank neither country nor the people in it.',
        },
        {
          answer: 'The four mills are the single point of failure, because that is where most of the value comes from.',
          misconception:
            'Ranking the stages of a chain by how big they are rather than by how many choices the firm has at each one, so the stage that matters most in money is read as the stage that can stop everything.',
          correctsTo:
            'A single point of failure is counted, not weighed. Four mills at one stage means that when one mill stops the work moves to the other three and the chain keeps running, and that is true whether the stage carries 60 percent of the value or 6 percent. One plant at the third stage means that when it stops, every stage after it stops with it, and that is true even though the part it makes is the smallest thing in the product. WRONG: "Most of the value, so that is the weak point." CORRECT: "Four choices at that stage, so it is not the weak point; one choice at the third stage, so that is." Then count the stages a supplier list leaves out: a sea route, a single road, a tunnel and a port that everything passes through are each a stage, and if all the suppliers at a stage use the same one of them, adding suppliers leaves that count at one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Who produces more is not the question. Divide inside each place\'s own row -- what the same effort could have made instead -- and the smaller give-up figure names the place that should make that good.',
        'No place gives up less in both goods, because one place\'s two figures are the same ratio read upside down. A table always hands each side one good to specialize in, and the only case with nothing to gain is the tie.',
        'A place that is ahead in both goods still gains by buying the good it is the more expensive maker of.',
        'A workable trade rate sits between the two give-up figures. Outside them, one side would rather make the good at home.',
        'Each side\'s gain is a subtraction: what the goods would have cost at home, less what they cost through the trade. The two sides count their gains in different goods, so "did both gain" is the answerable question and "who gained more" usually is not.',
        'To find where a chain breaks, walk it stage by stage and count the choices at each one. The stage with one choice stops everything after it, whatever share of the value it carries, and a road, a strait or a port is a stage in exactly the same way as a factory.',
        'Price a backup against the stoppage it prevents: divide the loss from one stoppage by the backup\'s cost for a year. And a second supplier that depends on the same single link is not a backup -- the count at that stage is still one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Specialization & Supply-Chain Risk' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
