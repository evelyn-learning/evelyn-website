/**
 * Grade 8 World Geography — GIS & Geospatial Reasoning: Site Selection with
 * Weighted Criteria.
 *
 * PROCEDURE-LED row, shaped on the procedure-led exemplar
 * (`m8geo-u1-counts-rates-and-fair-comparison.ts`): the concept segment is an
 * ordered routine over described data rather than a mental model, the first
 * worked example runs the routine straight through, the second repairs a
 * student who ran it wrong, and both end with an arithmetic inversion AND a
 * one-input contrasting case. Two traps this plan is built to kill: treating a
 * must-have as a very heavy weight, and setting a total computed under one set
 * of weights against a total computed under another.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Split the criteria into must-haves (answered yes or no) and weighted
 *      preferences (answered with a rating).
 *   2. Run the gates: any site that fails a must-have leaves the comparison.
 *   3. Rate every surviving site 1-5 on every preference, multiply each rating
 *      by that criterion's weight, add the products.
 *   4. Compare the totals and say WHERE the margin was made.
 *   5. Invert: the total divided by the sum of the weights is the average
 *      rating, which must sit between that site's own lowest and highest.
 *   Then change ONE weight, re-score EVERY site, and re-run.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause inside keyIdea 1, that what
 * makes a site good is the ground itself and what it connects to (Grade 6,
 * `m6geo-u10-geographic-reasoning-in-everyday-decisions.ts`, which applied
 * site-and-situation reasoning to choose one facility's location from stated
 * reasons) and that settlements form at sites that solve a problem (Grade 7,
 * `m7geo-u3-urbanization-and-settlement.ts`), and re-teaches neither: no
 * keyIdea, worked example or item sorts a fact into site or situation, lists
 * the reasons cities form, or names a settlement shape -- the words
 * "situation", "break-of-bulk", "defensible", "linear", "clustered" and
 * "dispersed" appear nowhere in the authored body. (Every absence claim in
 * this guard is scoped to the AUTHORED BODY, per ruling 34: the chain loIds
 * legitimately carry the neighboring rows' slugs, so `prerequisites` contains
 * the word "buffers" and that is not a breach of the clause below.) It ADDS splitting a
 * criteria list into gates and weighted preferences, eliminating on the gates
 * before any scoring, computing a weighted total with the digits shown,
 * justifying the winner by naming the criterion where the margin was made, and
 * evaluating how far one weight has to move before the winner changes
 * (including the exact weight at which two sites tie). It STOPS SHORT of
 * optimization and cost-distance surfaces (the row's own withheld clause; a
 * high-school GIS elective owns them) -- nothing here searches over
 * combinations of weights or over a surface of candidate locations, and every
 * re-run changes exactly one weight by hand. It names NO industrial-location
 * theory and sites no factory (row 8.3 `where-factories-locate`; the theory
 * itself is high-school or AP). It does NOT build a composite indicator from
 * ranks and never ranks a place or a region as more developed (row 8.2
 * `composite-indicators-and-inequality`; accuracy rule 4) -- every score here
 * belongs to a candidate lot inside one town's decision, never to a place or
 * the people in it. It does NOT evaluate a land-use or zoning plan by cost and
 * who bears it (row 10.2 `evaluating-a-land-use-plan`). Four things ARE
 * deliberately allowed, because neighboring rows sit close and the line has to
 * be drawn rather than avoided: (a) worked example 1 scores an ELIMINATED site
 * anyway, with digits, because the counterintuitive edge of this row is that
 * the highest-scoring site can be the one that cannot be used, and the cost of
 * elimination has to be visible for the gate to mean anything; (b) must-haves
 * in this file are thresholds on a stated area, on ownership and on a stated
 * flood-zone listing -- no criterion anywhere is a distance-from-a-feature
 * test, so no buffer is applied and no buffer distance is varied, which is row
 * 2.2 `buffers-and-proximity`; (c) the flood-zone listing in try_yourself 1 is
 * a single stated yes-or-no fact about a lot, never a layer stacked on another
 * layer, which is row 2.1 `gis-layers-and-overlay`; (d) the second
 * misconception correction reads each total against the maximum for its own
 * weighting (40 out of 50 and 48 out of 60 are both 80 percent), which is
 * Grade 6-7 ratio arithmetic in service of the comparability rule and not a
 * normalized index. Nothing in this file measures land cover at two dates
 * (row 2.4 `change-detection-from-satellite-data`).
 *
 * SCOPE CELL PARTS: this row's cell carries all three parts -- the positive
 * statement, a lineage clause naming G6 10.1 and G7 3.4, and a withheld clause
 * ("Not yet optimization or cost-distance surfaces"). Part (i) names no
 * example specimens, so no specimen is burned for the items; all three item
 * scenarios (Harrow, Brindle, and the bike park) are fresh, and no name,
 * figure or rating from an item appears in any teaching segment.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item is answered by a decision over
 * described numbers -- which sites are still in the comparison, which weighted
 * total wins and where its margin came from, what a changed weight does to
 * both totals. Nothing asks what a good site is, why a settlement grew
 * somewhere, or what to call a pattern of homes. The keyIdea that came closest
 * to the floor is keyIdea 1, which holds the whole premise in one clause ("what
 * makes a site good -- the ground itself and what it connects to -- is already
 * on the table") and then immediately turns it into the gate-versus-weight
 * split, which is this row's own work. Test 5 was run against
 * `m7geo-u3-urbanization-and-settlement.ts`: that file's keyIdeas define
 * urbanization as a share, name three settlement shapes and list four reasons
 * cities form, and none of them is restated here; its items ask what
 * urbanization means and which shape a described settlement takes, and no
 * student who had only that lesson could eliminate a parcel on a gate or
 * compute a weighted total.
 *
 * ACCURACY NOTE: every town, district, lot and parcel in this file is
 * invented, and every figure was written for the arithmetic. The must-haves
 * are stipulated rules of the invented towns -- a sewer connection, a minimum
 * area, district ownership, a flood-zone listing -- and are not claims about
 * how any real place regulates pools, fields or youth centers. No real place
 * is named anywhere, and no place or group of people is ranked or
 * characterized: scores here belong to lots, never to people.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * per-item discipline is the point: every distractor states the full wrong
 * STEP that produces it -- a minimum read as "more than", a gate traded away
 * against extra land, a gate demoted to a preference, criteria counted instead
 * of scored, ratings added with the weights thrown away, a weight read as a
 * rank, a weight change treated as a constant shift, the comparability rule
 * applied between two sites instead of between two weightings, and only the
 * changed site re-scored -- and no key was built to be the longest choice
 * BECAUSE it is the key. Measured as a diagnostic, not as a score: the key is
 * the strictly longest choice in ONE of the three items, and in that item the
 * margin over the next-longest choice is 5 characters, which is inside the
 * noise ruling 16 describes and was left alone. Zero is not the target; the
 * meaningful measurement is the 120-item course rate taken at registration.
 * DF-1: the three keys sit at ids a, d and c -- the id set
 * `(2 + 3) mod 4 = 1` requires, omitting b. The numeric-bearing choices are
 * ordered by that rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every criteria list, rating
 * and total is written out in prose inside the segment that needs it, and
 * every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U2_SITE_SELECTION_WITH_WEIGHTED_CRITERIA: LessonPlan = {
  id: 'evelyn.ms.m8geo.site-selection-with-weighted-criteria.v1',
  title: 'Site Selection with Weighted Criteria',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.site-selection-with-weighted-criteria',
      standard: 'M8GEO-2.3',
      description:
        'Given several candidate sites and a set of criteria split into must-haves and weighted preferences, eliminate sites that fail a must-have, score the rest, and justify the choice -- then evaluate how a change in one weight changes the winner (National Geography Standard 3: how to analyze the spatial organization of people, places and environments).',
    },
  ],
  prerequisites: ['m8geo.buffers-and-proximity'],
  followUps: ['m8geo.change-detection-from-satellite-data'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a site being removed by a rule rather than beaten by a score, so the gate-versus-weight split arrives before any vocabulary does.',
      script:
        'Your town announces one new skate park this year, and three empty lots are on the table. Everybody wants the flat one behind the shopping center: it is the biggest, it is the closest to the middle school, and the ground is already level, so there is nothing to fix. Then the parks department publishes the rules a lot has to meet, and the first rule is that the town has to already own the land. That flat lot is rented from the family that owns it, and the town is not buying land this year. It is out. Not outscored -- out, before anyone gives it a single point. That is the move this lesson is built on. A real siting decision carries two kinds of criteria that behave nothing alike: rules a site either meets or does not, which decide whether the site is even in the running, and preferences that count in different amounts, which decide the winner among whatever is left. Today you split a list into those two kinds, eliminate, score the survivors with the digits showing, and then work out exactly how far one weight would have to move before the winner changes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gates-then-weights',
      kind: 'concept',
      goal: 'Install the gate-versus-weight split and the scoring routine: eliminate on must-haves, multiply rating by weight and add, justify by where the margin was made, then re-run with one weight changed.',
      keyIdeas: [
        'SPLIT THE LIST BEFORE YOU SCORE ANYTHING, BECAUSE A SITING LIST ALWAYS HOLDS TWO KINDS OF CRITERIA. What makes a site good -- the ground itself and what it connects to -- is already on the table; the work here is turning that into a decision somebody can defend in public. A MUST-HAVE is answered yes or no: the lot holds at least 2 hectares, or it does not; the town owns it, or it does not. A WEIGHTED PREFERENCE is answered with a rating and then counts in an amount somebody chose: closeness to the homes a pool would serve might count five times over while room to expand later counts twice. So the first question of a siting decision is not "which site is best" but "which sites are even in the comparison", and those two questions have different answers more often than you would expect.',
        'A MUST-HAVE IS A GATE, NOT A VERY LARGE WEIGHT. This is the step that goes wrong most often, and it goes wrong while looking careful. Once a site fails a must-have it is out, and no score anywhere else brings it back, because a must-have is a statement about whether the site can be used at all rather than about how good it would be. Turn a gate into a heavily weighted criterion and two bad things happen at once: a failing site with strong ratings everywhere else can win, and the answer starts depending on the size of a number nobody can defend. Eliminate first, score second, and expect to lose a site that would have scored highest. The honest sentence at the end of a siting decision is "the best of the sites we can actually use".',
        'A WEIGHTED TOTAL IS EVERY RATING MULTIPLIED BY ITS OWN WEIGHT, ADDED UP, AND THE ROUTINE NEVER CHANGES. One: rate every surviving site on every preference, on one fixed scale, 1 through 5, where 5 is best. Two: multiply each rating by that criterion\'s weight. Three: add the products for each site. Four: compare the totals. Five: check by dividing each total by the sum of the weights, which gives that site\'s average rating and has to land between the lowest and the highest rating you gave it. A total of 40 against weights adding to 10 is an average of 4, and if that site never scored above 3, the arithmetic slipped somewhere and the verdict is worth nothing until you find it.',
        'JUSTIFY BY NAMING WHERE THE MARGIN CAME FROM, NOT BY NAMING THE WINNER. A total on its own persuades nobody, and "it led on most of the criteria" is not a reason, because counting the criteria a site leads is a different calculation from scoring it and the two disagree all the time. A site can be rated higher on two preferences out of three and still lose, if the one it lost carries the heaviest weight and the widest rating gap. The margin is made where a big weight meets a big gap, so find that criterion, say its name, and say its numbers.',
        'THE WINNER IS A PROPERTY OF THE WEIGHTS, NOT OF THE SITE, SO CHANGE ONE WEIGHT AND RUN IT AGAIN. Weights are a judgment about what matters, different people set them differently, and a siting result is therefore only as settled as the weights behind it. Re-score every site with one weight changed and you learn something no single total can tell you: raising a weight by 3 points is worth 3 times each site\'s OWN rating on that criterion, so it pushes the sites apart instead of lifting them together. Go one step further and name the exact weight at which two sites tie. A decision that flips when a weight moves by a point or two is a decision to report as close, not as settled.',
        'TOTALS ARE ONLY COMPARABLE INSIDE ONE WEIGHTING. Every site in one comparison gets the same weights, and the moment a weight changes, every site is scored again -- including the ones nobody is worried about. A total from the old weights set beside a total from the new ones compares nothing, because the maximum moved too: weights adding to 10 put every total out of 50, and weights adding to 12 put every total out of 60. If two weightings really do have to be compared, read each total against the maximum for its own weighting, and say plainly that what changed was what somebody decided to count, not the land.',
      ],
      vocabulary: [
        {
          term: 'must-have',
          definition:
            'a criterion answered yes or no that decides whether a site is scored at all; a site that fails one leaves the comparison before any scoring starts.',
        },
        {
          term: 'weight',
          definition:
            'the number a criterion carries, saying how many points each rating point on that criterion adds to a site\'s total.',
        },
        {
          term: 'rating',
          definition:
            'the score one site is given on one criterion, on a single fixed scale used for every site, so that unlike qualities can be added together.',
        },
        {
          term: 'weighted total',
          definition:
            'the sum of every rating multiplied by its own weight; it means something only against other totals computed from the same weights.',
        },
        {
          term: 'sensitivity',
          definition:
            'how far a weight has to move before the ranking changes, found by re-scoring every site with that weight changed.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Run the routine straight through, then test the answer.\n\nThe town of Ardith is choosing a site for a new public swimming pool. Two criteria are must-haves: the lot must have at least 2 hectares of level ground, and it must already be connected to the town sewer line. Three criteria are weighted preferences: closeness to the homes the pool would serve counts 5, the cost of preparing the ground counts 3, and room to expand later counts 2. Every site is rated 1 to 5 on each preference, where 5 is best.\n\n"Larkin: 3 hectares of level ground, on the sewer line. Closeness 3, cost 5, room to expand 5.\n\nMoss Row: 4 hectares of level ground, no sewer connection -- the nearest line ends 3 kilometers away. Closeness 5, cost 4, room to expand 4.\n\nNetherby: 2 hectares of level ground, on the sewer line. Closeness 5, cost 3, room to expand 2."\n\nWhich site should Ardith choose, and how far would the closeness weight have to move before the answer changes?',
      steps: [
        'Step one: split the list and run the gates first, before anything is multiplied. The must-haves are at least 2 hectares of level ground and a sewer connection. Larkin has 3 hectares and the connection, so it passes both. Netherby has exactly 2 hectares, and "at least 2" is met by exactly 2, so it passes, and it is on the line as well. Moss Row has the most land of the three and no sewer connection, so it fails a must-have and leaves the comparison right here.',
        'Step two: score Moss Row anyway, once, so that elimination is not a word but a price. Closeness 5 times 5 is 25, cost 3 times 4 is 12, room 2 times 4 is 8, and 25 plus 12 plus 8 is 45 -- higher than anything the other two sites are going to reach. Moss Row is still out. A pool with nowhere to send its water is not a pool, and 45 points do not lay 3 kilometers of pipe. WRONG: "Moss Row scores highest, so Moss Row wins." CORRECT: "Moss Row is not in the comparison at all; the winner is the highest total among the sites Ardith can actually use."',
        'Step three: score the two survivors, one criterion at a time. Larkin: 5 times 3 is 15 for closeness, 3 times 5 is 15 for cost, 2 times 5 is 10 for room. 15 plus 15 plus 10 is 40. Netherby: 5 times 5 is 25 for closeness, 3 times 3 is 9 for cost, 2 times 2 is 4 for room. 25 plus 9 plus 4 is 38. Larkin wins, 40 to 38.',
        'Step four: invert the arithmetic to check it. The weights add to 5 plus 3 plus 2, which is 10, so every total is out of 5 times 10, which is 50, and both totals sit under that. Now divide each total by 10 to recover the average rating. Larkin: 40 divided by 10 is 4, and Larkin was rated between 3 and 5, so 4 sits where it should. Netherby: 38 divided by 10 is 3.8, and Netherby was rated between 2 and 5. Multiply back: 4 times 10 is 40, and 3.8 times 10 is 38. Nothing slipped.',
        'Step five: say where the margin came from, because a total persuades nobody by itself. Netherby is the closer site and closeness carries the heaviest weight, so it takes 5 times the 2-point rating gap, which is 10 points. Larkin takes cost, 3 times a 2-point gap, which is 6, and room to expand, 2 times a 3-point gap, which is 6. 6 plus 6 is 12 against 10, so Larkin wins by 2. That is the justification to write down: Larkin is cheaper to prepare and has room to grow, and those two together just outweigh the fact that Netherby is closer.',
        'Rewind the input and read it backwards to confirm the verdict follows from the data rather than from the order the sites were written in. Larkin was the middle site on land, took the top rating on two of the three preferences, and passed both gates. A margin of 2 points out of a possible 50 is narrow, and a narrow margin is the signal to test the weights before anybody signs anything.',
        'Now change ONE weight and run it again. Suppose the council hears from families with no car and raises the closeness weight from 5 to 7, leaving cost at 3 and room at 2. Re-score BOTH sites, not only the close one. Larkin: 7 times 3 is 21, plus 15, plus 10, which is 46. Netherby: 7 times 5 is 35, plus 9, plus 4, which is 48. Netherby now wins by 2. Not one thing about either lot changed; the council changed what it was counting. And the tipping point can be named exactly: at a closeness weight of 6, Larkin is 18 plus 15 plus 10, which is 43, and Netherby is 30 plus 9 plus 4, which is 43 as well. Below 6 Larkin wins, above 6 Netherby wins, and the pool is being sited by the choice of one number.',
      ],
      answer:
        'Larkin, at 40 points against Netherby at 38. Moss Row is eliminated before scoring because it has no sewer connection, even though it would have scored 45. Larkin\'s margin comes from cost, 3 times a 2-point gap, which is 6, and room to expand, 2 times a 3-point gap, which is 6 -- together outweighing the 10 points closeness hands Netherby. Multiplying each average rating back by the weight sum of 10 returns 40 and 38. The result is sensitive: at a closeness weight of 6 the two sites tie at 43, and at 7 Netherby wins, 48 to 46.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-the-gate',
      kind: 'worked_example',
      problem:
        'A student ran a siting decision and let a must-have be outvoted. Find the slip, repair it, and show why the student\'s method cannot be rescued by picking a better number.\n\nThe Fenmore school district is choosing a parcel for a new sports field. Two must-haves: the parcel must be at least 4 hectares, and the district must already own it, because no land can be bought this budget year. Three weighted preferences: how far students walk counts 2, how well the ground drains counts 4, and room for parking counts 4. Ratings run 1 to 5, where 5 is best.\n\n"Redding Field: district-owned, 5 hectares. Walk 3, drainage 5, parking 4.\n\nSolway Flats: privately owned and for sale, 6 hectares. Walk 5, drainage 5, parking 5.\n\nThorn Lane: district-owned, 3 hectares. Walk 4, drainage 3, parking 2.\n\nUnderhill: district-owned, 7 hectares. Walk 5, drainage 2, parking 3."\n\nThe student wrote: "Thorn Lane is only 3 hectares, so it is out. For ownership I added a fourth criterion, owned or not owned, with a weight of 1, scoring 5 for a district parcel and 1 for a private one. Solway Flats: 1 plus 50 is 51. Redding Field: 5 plus 42 is 47. Underhill: 5 plus 30 is 35. Solway Flats wins."',
      steps: [
        'Check the arithmetic before arguing with the method, because a wrong verdict is not always a wrong sum. Solway Flats on the three preferences: 2 times 5 is 10, 4 times 5 is 20, 4 times 5 is 20, and 10 plus 20 plus 20 is 50. Redding Field: 2 times 3 is 6, 4 times 5 is 20, 4 times 4 is 16, and 6 plus 20 plus 16 is 42. Underhill: 2 times 5 is 10, 4 times 2 is 8, 4 times 3 is 12, and 10 plus 8 plus 12 is 30. Add the ownership points the student invented and the three totals are 51, 47 and 35, exactly as written. Every figure is right. The method is what is wrong.',
        'Name the slip. "The district must already own it" is answered yes or no, which makes it a gate, and the student turned it into a weighted preference. Notice that the student handled the other gate correctly -- Thorn Lane is 3 hectares against a minimum of 4, so it is out -- and then let the second gate be bought off by a strong score somewhere else.',
        'Show that the method cannot be repaired by choosing a better weight, which is the move a student usually reaches for next. Keep everything else the same and try an ownership weight of 3: Solway Flats is 3 plus 50, which is 53, and Redding Field is 15 plus 42, which is 57, so Redding Field wins. Try 2: Solway Flats is 2 plus 50, which is 52, and Redding Field is 10 plus 42, which is 52 as well, a tie. Try 1, the number the student used: Solway Flats wins by 4. One method, three numbers that all look reasonable, three different answers -- and not one of them changes the fact that the district cannot buy land this year. Hunting for the right weight for a gate IS the error; it is not a fix for it.',
        'Re-run it properly. Eliminate first: Thorn Lane fails the size gate at 3 hectares, and Solway Flats fails the ownership gate because it is for sale rather than owned. Two parcels survive. Score those two on the three preferences only: Redding Field is 42 and Underhill is 30, so Redding Field wins by 12. WRONG: "Solway Flats scores 50 out of 50 on the preferences, so it is the best parcel available." CORRECT: "Solway Flats is not available, so the comparison is Redding Field at 42 against Underhill at 30, and Redding Field wins by 12."',
        'Invert to check. The weights add to 2 plus 4 plus 4, which is 10, so every total is out of 50. Solway Flats was rated 5 on all three, and its 50 is exactly that maximum, which checks that line. Redding Field: 42 divided by 10 is an average rating of 4.2, its ratings ran from 3 to 5, and 4.2 times 10 is 42. Underhill: 30 divided by 10 is 3, its ratings ran from 2 to 5, and 3 times 10 is 30.',
        'Rewind the input and read the two survivors backwards. Underhill is the larger parcel and the shorter walk; Redding Field drains better and has more room to park. Drainage and parking carry 4 each while walking carries 2, so the two criteria Redding Field leads are the two the district decided to count most heavily. The verdict follows from the weights, and the weights were the district\'s own judgment.',
        'Now change ONE weight and run it again, because a winner nobody has tested is a guess. Suppose the district finds that most students walk, and raises the walking weight from 2 to 5. Redding Field: 5 times 3 is 15, plus 20, plus 16, which is 51. Underhill: 5 times 5 is 25, plus 8, plus 12, which is 45. Redding Field still wins, and the margin has fallen from 12 to 6. Push further and the tie point is findable: at a walking weight of 8, Redding Field is 24 plus 20 plus 16, which is 60, and Underhill is 40 plus 8 plus 12, which is 60 as well -- but 8 is twice what drainage or parking carries, and the district has no reason to go there. This time the re-run confirmed the winner instead of overturning it, and that is worth just as much: now the district knows the answer does not hang on a small change.',
      ],
      answer:
        'The arithmetic was right and the method was wrong. "The district must already own it" is a must-have, answered yes or no, and the student scored it as a weighted preference instead. That method gives three different winners for three different ownership weights -- Solway Flats at a weight of 1, a tie at 2, Redding Field at 3 -- which is the sign that a number is doing work no number can defend. Run correctly, Thorn Lane is out at 3 hectares against a 4-hectare minimum and Solway Flats is out because it is for sale, leaving Redding Field at 42 against Underhill at 30. Raising the walking weight from 2 to 5 narrows the margin to 51 against 45 without changing the winner, and the two would not tie until that weight reached 8.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-run-the-gates',
      kind: 'try_yourself',
      problem:
        'The town of Harrow is choosing a lot for a new youth center. Two criteria are must-haves: the lot must have at least 1,200 square meters of buildable land, and it must not be inside the mapped flood zone. Four lots have been put forward.\n\n"Wardell: 1,500 square meters, outside the flood zone.\n\nYarrow: 2,000 square meters, inside the flood zone.\n\nZeller: 1,200 square meters, outside the flood zone.\n\nAshgrove: 900 square meters, outside the flood zone."\n\nWhich lots go on to the weighted scoring?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Wardell and Zeller, because each one clears both rules, and a minimum of 1,200 square meters is met by a lot of exactly 1,200',
          correct: true,
        },
        {
          id: 'b',
          text: 'Wardell only, because Zeller lands exactly on the 1,200-square-meter line and a lot has to pass a minimum rather than sit on it',
        },
        {
          id: 'c',
          text: 'Wardell, Zeller and Yarrow, because Yarrow holds more land than any other lot and the extra space makes up for the flood-zone listing',
        },
        {
          id: 'd',
          text: 'Wardell, Zeller and Ashgrove, because the flood zone is the only rule that removes a lot and a size minimum is a preference to be scored',
        },
      ],
      expectedAnswer:
        'Wardell and Zeller, because each one clears both rules, and a minimum of 1,200 square meters is met by a lot of exactly 1,200',
      hints: [
        'Take the two rules one at a time and answer each with a yes or a no for every lot. A must-have is not a quality a lot can have more or less of, so nothing here gets a rating yet.',
        'Read "at least 1,200" literally: a lot of exactly 1,200 square meters meets it. Then check that nothing is being traded -- extra land does not cancel a flood-zone listing, and a size rule stated as a must-have is not a preference waiting for a weight.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weighted-total',
      kind: 'try_yourself',
      problem:
        'Brindle is choosing between two sites for a recycling drop-off center, and both sites clear every must-have. Three preferences are weighted: closeness to the homes it serves counts 4, the cost of preparing the ground counts 5, and room to grow later counts 1. Ratings run 1 to 5, where 5 is best.\n\n"Kestrel: closeness 5, cost 2, room to grow 4.\n\nLowe: closeness 3, cost 5, room to grow 3."\n\nWhich site wins, and where is the margin made?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Kestrel, because it is rated higher than Lowe on two of the three preferences, closeness 5 against 3 and room to grow 4 against 3',
        },
        {
          id: 'b',
          text: 'Neither: the three ratings add to 11 for Kestrel and 11 for Lowe, so the sites are tied and Brindle has to add a fourth criterion',
        },
        {
          id: 'c',
          text: 'Kestrel, because the preference numbered 1 is the top-ranked one on the list and Kestrel leads room to grow, 4 against 3',
        },
        {
          id: 'd',
          text: 'Lowe, with 40 weighted points against 34, because cost swings 15 points to Lowe while Kestrel gains only 9 on the other two',
          correct: true,
        },
      ],
      expectedAnswer:
        'Lowe, with 40 weighted points against 34, because cost swings 15 points to Lowe while Kestrel gains only 9 on the other two',
      hints: [
        'Multiply before you compare. Each rating counts as many points as its criterion is weighted, so work out all three products for one site, add them, then do the same for the other.',
        'A weight is a multiplier, not a rank, so the preference weighted 1 is the one that counts least of the three. Adding the raw ratings throws the weights away entirely, which is why that route shows a tie where the weighted totals differ by 6, and counting the preferences a site leads is not the same calculation as scoring it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-change-one-weight',
      kind: 'try_yourself',
      problem:
        'A parks department has scored two sites for a bike park, and both clear every must-have. The weights are: closeness to where most riders live counts 3, how well the ground drains counts 4, and room for parking counts 3. Ratings run 1 to 5.\n\n"Ravel: closeness 5, drainage 2, parking 4.\n\nSedge: closeness 2, drainage 5, parking 4."\n\nThe totals come out at 35 for Ravel and 38 for Sedge. The department then doubles the closeness weight from 3 to 6 and leaves the other two weights alone. What happens?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Sedge still wins, because raising a weight adds the same number of points to every site, so the 3-point gap between them does not move',
        },
        {
          id: 'b',
          text: 'Sedge still wins at 38, because the new total for Ravel came from different weights and two totals built on different weights cannot be set against each other',
        },
        {
          id: 'c',
          text: 'Ravel now wins, 50 to 44, because the 3 extra weight points are worth 15 to Ravel and 6 to Sedge, a swing of 9 across a 3-point gap',
          correct: true,
        },
        {
          id: 'd',
          text: 'Ravel now wins, 50 to 38, because the closeness weight is the only figure that changed, so only the total for Ravel has to be worked out again',
        },
      ],
      expectedAnswer:
        'Ravel now wins, 50 to 44, because the 3 extra weight points are worth 15 to Ravel and 6 to Sedge, a swing of 9 across a 3-point gap',
      hints: [
        'Score both sites again from the start with the new weight, then compare the two new totals with each other. The other two weights are unchanged, so only the closeness product moves.',
        'A weight multiplies a rating, so raising it by 3 is worth 3 times each site\'s own closeness rating -- 15 points to a site rated 5 and 6 points to a site rated 2, which is not the same amount to both. Two totals built from the same weights do compare; an old total against a new one does not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gate-as-weight-and-cross-weighting',
      kind: 'misconception_check',
      question:
        'A student works through the Ardith pool decision and writes two sentences. First: "Moss Row scored 45, the highest of the three, so Moss Row should get the pool." Second: "Later the council raised the closeness weight, and Netherby came out at 48, which beats the 40 Larkin had. So Netherby was the better site all along and the first run just used the wrong numbers." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Moss Row scored 45, the highest of the three, so Moss Row should get the pool.',
          misconception:
            'Treating a must-have as a very heavy preference, so a high enough score everywhere else is assumed to buy a failing site back into the comparison.',
          correctsTo:
            'Moss Row has no sewer connection, and the sewer connection was a must-have, so Moss Row is not in the comparison at all and its 45 is a number about a site that cannot be used. The real comparison is Larkin, where 5 times 3 is 15, plus 3 times 5, which is 15, plus 2 times 5, which is 10, giving 40, against Netherby, where 25 plus 9 plus 4 gives 38. Larkin wins by 2. WRONG: "Moss Row scores highest, so Moss Row wins." CORRECT: "Moss Row fails a must-have and leaves before any scoring; Larkin is the best of the sites Ardith can actually use, 40 against 38." A must-have answers whether a site may be used; a weight answers how much one quality counts once the site is already allowed. Those are two different questions, and no weight is large enough to turn a no into a yes.',
        },
        {
          answer: 'Netherby scored 48 under the new weights, which beats the 40 Larkin scored, so Netherby was the better site all along.',
          misconception:
            'Comparing a total built from one set of weights with a total built from another, as though a weighted total measured the site itself rather than being produced by the weights it was computed with.',
          correctsTo:
            'Two totals compare only when the same weights produced them. Under the first weights, which add to 10, every total is out of 50: Larkin is 40, Netherby is 38, and Larkin wins. Under the raised closeness weight the weights add to 12, so every total is out of 60: Larkin is 21 plus 15 plus 10, which is 46, and Netherby is 35 plus 9 plus 4, which is 48, and Netherby wins. Setting 48 against 40 crosses the two weightings and compares nothing. If the two runs really must be read side by side, read each total against the maximum for its own weighting: 40 out of 50 is 80 percent, and 48 out of 60 is 80 percent as well. WRONG: "48 beats 40, so Netherby is the better site." CORRECT: "Larkin wins under the first weights and Netherby wins under the second, and what changed between the runs was what the council decided to count, not the land." Neither run used wrong numbers; they used different judgments, and a siting result is only as settled as the weights behind it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Split the criteria before scoring anything: must-haves are answered yes or no and decide who is in the comparison, while weighted preferences are rated and decide who wins.',
        'Eliminate first, score second. A site that fails a must-have is out however well it would have scored, and the honest verdict names the best of the sites that can actually be used.',
        'A gate has no weight. Give one a weight and the answer follows the size of that number: at a weight of 1 the ineligible parcel won, at 2 it tied, at 3 it lost.',
        'Weighted total: multiply each rating by its own weight and add. Check it by dividing the total by the sum of the weights, because that average rating has to sit between the site\'s own lowest and highest rating.',
        'Justify by naming where the margin came from. Leading on the most criteria is not winning; the margin is made where a heavy weight meets a wide rating gap.',
        'Change one weight and run it again, re-scoring every site. Raising a weight by 3 points is worth 3 times each site\'s own rating on that criterion, so it pushes sites apart rather than lifting them together.',
        'Totals compare only inside one weighting. Weights adding to 10 put every total out of 50 and weights adding to 12 put every total out of 60, so a total from one weighting says nothing against a total from the other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Site Selection with Weighted Criteria' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
