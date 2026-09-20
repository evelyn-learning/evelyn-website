/**
 * Grade 8 World Geography — Population & Migration at Scale: Refugees &
 * Displacement.
 *
 * CONCEPT-LED row (National Geography Standard 13), shaped on
 * `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`. One framework is
 * installed -- two ordered questions, a border and a decision, that sort a
 * described person into internally displaced person, asylum seeker or refugee
 * -- and the student then USES it on described data three times: on four
 * described people, on a flow table read as shares, and on two described
 * responses priced over a stated length of stay. No item is answered by a
 * definition: item 1 keys a category the data puts a family in, item 2 keys a
 * computed share with the reason the distance, fare and visa data give, and
 * item 3 keys a verdict carrying its own arithmetic.
 *
 * ⚠️ THIS IS THE MOST SENSITIVE ROW IN THE COURSE, and accuracy rules 3-8 are
 * load-bearing in it. Every country, town, plan and person here is invented
 * and every figure was written for the arithmetic. NO real conflict, event,
 * country, region, group or organization is named anywhere in the spoken body
 * -- only this doc comment names the source documents, and the student never
 * hears it -- and no side is taken on anything. People appear as described
 * situations with stated facts
 * -- a border crossed or not, a claim decided or waiting -- never as a story
 * about a kind of person, and the concept says out loud that the word names a
 * situation and a set of rules rather than a kind of person. The DEFINITIONS
 * are the one place where the file leans on the real world, and they come
 * from named sources: the 1951 Convention relating to the Status of Refugees
 * and its 1967 Protocol for the persecution limb of "refugee", with UNHCR's
 * published plain-language description ("compelled to leave ... as a result
 * of persecution, armed conflict, violence or serious public disorder")
 * grounding the conflict-and-violence limb the vocabulary entry uses;
 * UNHCR's published description of an
 * asylum seeker (a person who has asked for international protection and
 * whose claim has not yet been decided); and the 1998 UN Guiding Principles
 * on Internal Displacement for "internally displaced person" (forced or
 * obliged to flee home, in particular to avoid armed conflict, generalized
 * violence, violations of human rights or natural or human-made disasters,
 * and who have not crossed an internationally recognized State border). Those
 * three, plus the pattern claim in keyIdea 3, are the whole of this file's
 * contact with the real world, and all four are in the claim ledger.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a move
 * can be forced rather than chosen and that a move either crosses an
 * international border or stays inside one country (`m7geo-u3-migration-push-
 * and-pull.ts`), and that an international organization has member states
 * while a non-governmental organization does not (`m7geo-u6-international-
 * cooperation.ts`) -- and it re-teaches neither: no keyIdea sorts a reason
 * into a push or a pull, no keyIdea classifies a move as voluntary or forced
 * as its subject (the forced/chosen line appears once, as the gate in front
 * of the two questions), and nothing in the body names an organization or
 * sorts a body into member states and non-governmental types -- the word
 * "organization" does not occur in the body at all, and the only bodies in
 * the file are an unnamed regional authority and an unnamed agency, each
 * present only as the party making a described choice. It ADDS the three legal
 * categories and the two ordered questions that separate them, applying them
 * to described people, reading a described flow table as shares of everybody
 * who left home, explaining that pattern from described distance, fare and
 * document data, and evaluating two described responses against stated
 * criteria over a stated length of stay, including a one-time setup cost
 * spread across months. It STOPS SHORT of state / nation / nation-state and
 * of supranational-organization analysis by name (`ap-human-geo-political.ts`
 * owns the typology; no organization is named here at all), of any named
 * model of migration, of migration or asylum POLICY and of any live debate
 * about it, of any chronology of displacement (the history is `ap-apush-*`,
 * `whist-*` and the legacy `g8-ss-*` seeds), and of hazard physics for the
 * disaster half of the displacement definition (`m6sci` U6 and U9). Three
 * things ARE deliberately allowed, because neighboring rows sit close:
 * (a) distance, fare and document data are read as the reason most people
 * stay inside their own country or next door -- the row's scope cell asks for
 * exactly that, and it is done WITHOUT the vocabulary of row 5.3
 * (`migration-flows-and-their-effects`), which owns intervening obstacles and
 * chain migration by name and owns push and pull; neither term appears
 * outside this guard; (b) shares are computed from a flow table, which is
 * row 1.1's routine used as a tool rather than taught -- the words "rate" and
 * "denominator" do not occur in the body, no keyIdea defines either one or
 * weighs one denominator against another, and the single denominator in play
 * is spelled out wherever it is used ("of everybody who left home"); (c) two
 * responses are compared on criteria, which is NOT row 2.3's weighted site
 * scoring (no weights, no scores, no sites are ranked) and NOT row 10.2's
 * land-use plan (no zoning, no land use) -- the criteria are stated in the
 * problem, each is settled on its own, and the verdict names the criterion
 * the winning response loses.
 *
 * DEPTH FLOOR NOTE: the closest call in this file was keyIdea 1, because this
 * row's subject genuinely IS a set of definitions and a definition is a
 * Grade 7 shape. It survives because the keyIdea is written as an ordered
 * TEST that is run on a case -- ask the border question, then the decision
 * question -- and because every item makes the student run it rather than
 * recite it. The definitions are also new at this depth: a grep of the shipped
 * `m7geo-*` and `m6geo-*` seeds found no file that defines refugee, asylum
 * seeker or internally displaced person, so nothing here restates a keyIdea
 * from the file below. The test that was run: the four keyIdeas of
 * `m7geo-u3-migration-push-and-pull.ts` were read next to these five, and the
 * closest pair was that file's "internal migration stays inside one country;
 * international migration crosses a border" against the border clause inside
 * keyIdea 1 here -- which survives because it is one clause of premise
 * carrying a three-way legal sort the file below never makes, and because no
 * item here can be answered by the internal/international distinction alone.
 *
 * BURNED SPECIMENS (ruling 32/36): `los[0].description` is student-facing and
 * names "a camp near the border versus settlement in towns", so that PAIR is
 * inherited, not invented here; no item is answerable from it, because every
 * item turns on figures the item itself supplies and the objective states no
 * verdict, no criterion and no number. Do not "helpfully" move a worked
 * example's case into an item: the teaching segments all use Averin and
 * Solvane, and all three items use different invented countries (Halvern;
 * Ristal and Vantorra; Kessel) with different figures, so no specimen crosses
 * into an assessed item.
 *
 * ANSWER-CUE NOTE: written against deferred findings DF-1 and DF-3. Every
 * distractor states the full wrong STEP that produces it -- the forced-out
 * test applied without the border question, any border crossing read as "far
 * away", the smallest group read as the story, everybody who never crossed a
 * border dropped from the count, one criterion allowed to decide alone, a
 * one-time setup cost charged in every month -- and no key was built to be
 * the longest choice BECAUSE it is the key. Measured as a diagnostic, not as
 * a score: the key is the strictly longest choice in 1 of the 3 items -- item
 * 1, by 6 characters out of 121, after the key was anchored to the case ("the
 * flood forced them from home and their move south") so that it was not the
 * only choice in the set free of case detail. In items 2 and 3 the key is the
 * second longest, by one character in each. Chance alone produces 0 or 1 in a three-item
 * file about 84% of the time, so this number is not evidence of anything on
 * its own; the real measurement is the 120-item course rate at registration,
 * which should land near a quarter. The three keys sit at ids c, a and d,
 * which is the id set `(5 + 4) mod 4 = 1` requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table, distance and
 * plan is written out in prose inside the segment that needs it, and every
 * item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U5_REFUGEES_AND_DISPLACEMENT: LessonPlan = {
  id: 'evelyn.ms.m8geo.refugees-and-displacement.v1',
  title: 'Refugees & Displacement',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.refugees-and-displacement',
      standard: 'M8GEO-5.4',
      description:
        'Distinguish a refugee, an asylum seeker and an internally displaced person by the standard definitions (crossed an international border or not; recognized status or claim pending), classify people in a scenario correctly, explain from distance and border data why most displaced people remain in their own or a neighboring country, and evaluate two responses (a camp near the border versus settlement in towns) by stated criteria (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of Earth surface).',
    },
  ],
  prerequisites: ['m8geo.migration-flows-and-their-effects'],
  followUps: ['m8geo.water-scarcity-and-allocation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show three words being used as if they meant one thing, so the need for a test arrives before any definition does.',
      script:
        'Three lines come up on a news app inside a minute. "Thousands of refugees have arrived at the border." "Aid is reaching people displaced inside the country." "Asylum seekers are still waiting for a decision." Underneath, somebody has commented: these are all the same thing, so why three words? They are not the same thing, and the difference is not a matter of tone. Each word describes a different situation, and one of the two questions that tell them apart is simply whether a line on a map was crossed. Get the word wrong and the count is wrong, and a count that is wrong sends help to the wrong country. Today you get the two questions, in order, and then you use them on numbers: where people actually end up when they are forced out of their homes, and what the two usual ways of housing them cost, deliver, and leave behind.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-questions-and-what-follows',
      kind: 'concept',
      goal: 'Install the two ordered questions that sort a described person, and the three moves that follow: read the pattern of movement from distance, money and documents, take each group as a share of everybody who left home, and price a response against stated criteria.',
      keyIdeas: [
        'TWO QUESTIONS SETTLE WHICH WORD FITS, AND YOU ASK THEM IN ORDER. Before either one, there is a gate: was the person forced from home by danger, conflict or disaster, rather than choosing to move? Somebody who moved for a job or a school has not been displaced, and none of the three words applies to them. Once the gate is passed, question one is a line on a map: has the person crossed an international border? If the answer is no, the person is an INTERNALLY DISPLACED PERSON -- forced from home, but still inside their own country and still under its laws and its protection. If the answer is yes, ask question two: has the claim for protection been decided? While the claim is waiting, the person is counted as an ASYLUM SEEKER. Once it has been decided in their favor, they are counted as a REFUGEE. Distance settles nothing in either question: a family that traveled 600 kilometers inside their own country is internally displaced, and a family that walked 12 kilometers across a border and asked for protection is an asylum seeker.',
        'THE WORD NAMES A SITUATION AND THE RULES THAT COME WITH IT, NEVER A KIND OF PERSON. Each of the three words says which country is responsible and which rules apply -- an internally displaced person is protected by their own government, and somebody who has crossed a border is asking another country for that protection instead. It says nothing about the person. The clearest proof is that the same person can be counted in two categories in one year without changing at all: an asylum seeker whose claim is decided in their favor on a Tuesday is counted as a refugee on the Wednesday, and somebody internally displaced in March who crosses a border in June is counted as an asylum seeker in June. A border crossing and a decision moved; the person did not. So every count of these groups is a count on a stated date, and when you read one, ask what date it was taken on.',
        'DISTANCE, MONEY AND DOCUMENTS FILTER EVERY STEP AWAY FROM HOME, AND THAT IS WHY MOST PEOPLE DO NOT GET FAR. Most people forced out of their homes stay inside their own country or in the country next door, and the reason is visible in the data every time. Take a case: 40,000 people leave the eastern districts of Averin. Moving to Dorval, a city 120 kilometers away inside Averin, costs a $6 bus fare and needs no document at all. Crossing into Solvane, the neighboring country, means a 60-kilometer trip, a $12 fare and an identity card at the crossing. Getting past Solvane to Marrin means 900 kilometers, a visa that has to be applied for, and $180. Each step multiplies the money and adds a document, so each group is smaller than the one before it: 26,000 stayed inside Averin, 12,000 crossed into Solvane, and 2,000 reached Marrin or farther. That is 65 percent, 30 percent and 5 percent of the 40,000 -- and 0.65 times 40,000 is 26,000, so the shares recover the counts.',
        'TAKE EACH GROUP AS A SHARE OF EVERYBODY WHO LEFT HOME, AND CHECK THE SHARES ADD TO 100 PERCENT. A count of one group on its own settles nothing, because a claim like "most of them" is a claim about all of them, and a count cannot say what share of all of them one group is. Divide each group by everybody who left home, and the picture rearranges itself: in the Averin case the far-away group is 2,000 out of 40,000, which is 5 percent, and a claim built on that group is a claim about one person in twenty. When three shares are supposed to cover everybody, add them up. If they do not reach 100 percent, either a group is missing or somebody has been counted twice.',
        'A RESPONSE IS EVALUATED AGAINST STATED CRITERIA, OVER A STATED LENGTH OF STAY, AND SOMEBODY BEARS EVERY COST. Two responses come up again and again: a camp near the border, and settling people in towns. Neither is the right answer in general, and the way to tell them apart is to settle each stated criterion on its own -- how soon shelter is ready, the total cost over the expected stay, the share of school-age children with a school place, whether adults can earn -- and then say which criteria each response wins. Two rules do most of the work. First, a one-time setup cost is not a monthly cost: divide it by the monthly saving to find the month the cheaper-to-run response catches up, and total both responses over the same number of months before comparing. Second, ask who bears each cost, including the people who were already living where the response happens, because a cost that falls outside the plan is still a cost.',
      ],
      vocabulary: [
        {
          term: 'displacement',
          definition:
            'being forced to leave home by conflict, violence or disaster rather than choosing to move; it is the condition the three words below sort into categories.',
        },
        {
          term: 'internally displaced person',
          definition:
            'a person forced from home who has not crossed an international border, and who therefore stays under the protection of their own country.',
        },
        {
          term: 'asylum seeker',
          definition:
            'a person who has crossed an international border, asked that country for protection, and is waiting for the claim to be decided.',
        },
        {
          term: 'refugee',
          definition:
            'a person who has left their own country because of persecution, conflict or violence, and whose claim for protection has been decided in their favor.',
        },
        {
          term: 'host community',
          definition:
            'the people already living where displaced people arrive, whose housing, schools and services carry part of the cost of a response.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-two-questions',
      kind: 'worked_example',
      problem:
        'Run the two questions on four described people, then say what would have to change for any of the answers to change.\n\n"Fighting spread through the eastern districts of Averin in the spring.\n\nSena left her home in an eastern district when the fighting reached it. She moved to Dorval, a city in western Averin, 400 kilometers away, and has been there five months.\n\nTomas crossed the border into Solvane three weeks ago and asked Solvane for protection. His claim has not been decided.\n\nIlka crossed into Solvane fourteen months ago and asked for protection. Her claim was decided in her favor last spring.\n\nBran moved from Averin to Solvane four years ago to take a job at a bottling plant, and renews a work permit every year."',
      steps: [
        'Start at the gate, before either question. Sena, Tomas and Ilka each left because staying was not safe. Bran moved four years ago to take a job and renews a permit every year, so he was not forced from home and none of the three words applies to him: he is somebody who moved to another country to work. WRONG: "Bran is from Averin and lives in Solvane, so he must be a refugee now." CORRECT: "Bran chose to move for work before any of this, so the two questions never start for him."',
        'Sena, question one: has she crossed an international border? No. Dorval is in western Averin, so she is still in her own country. That settles it on the first question -- Sena is an internally displaced person -- and the 400 kilometers do not enter into it. She is still under Averin\'s laws and Averin\'s protection.',
        'Tomas, question one: yes, he is in Solvane. So ask question two: has his claim been decided? No. He asked three weeks ago and is waiting, so he is counted as an asylum seeker. WRONG: "Tomas fled the fighting, so he is a refugee." CORRECT: "Tomas crossed a border and asked for protection, and while the claim is waiting he is counted as an asylum seeker."',
        'Ilka, question one: yes. Question two: yes, her claim was decided in her favor. She is counted as a refugee. Notice what separates her from Tomas, because it is the whole of question two: not the danger they left, not the border they both crossed, but one decision on one date.',
        'Rewind the four cases and read them backwards to check nothing was misread: a work permit renewed every year, a claim decided in her favor, a claim still waiting, a move to a city inside the country. Now change ONE fact in two of them. If Solvane decides Tomas\'s claim in his favor next month, he is counted as a refugee from that day, and nothing about Tomas will have changed -- a decision will have changed. And if Sena had gone east to the Solvane border instead of west to Dorval, 60 kilometers instead of 400, and asked Solvane for protection, she would be counted as an asylum seeker rather than an internally displaced person, on the shorter journey of the two. The border and the decision do the sorting. The distance and the danger do not.',
      ],
      answer:
        'Sena is an internally displaced person: forced from home, no border crossed, so question one settles it and the 400 kilometers are irrelevant. Tomas is an asylum seeker: border crossed, claim asked for, no decision yet. Ilka is a refugee: border crossed, claim decided in her favor. Bran is none of the three, because he moved for work and was not forced from home. A decision on Tomas\'s claim would make him a refugee without anything about him changing, and Sena would have been an asylum seeker if she had traveled 60 kilometers east instead of 400 kilometers west.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-camp-or-towns',
      kind: 'worked_example',
      problem:
        'Evaluate two responses against the stated criteria, then say what would flip the verdict.\n\n"Twenty thousand people who crossed from Averin into Solvane need somewhere to live, and the regional authority in Solvane is choosing between two responses. The stay is expected to last at least two years. The stated criteria are: how soon shelter is ready, the total cost over the expected stay, the share of school-age children with a school place, and whether adults can earn. The authority has also asked who else bears a cost. 3,000 of the arrivals are school-age.\n\nResponse A, a camp on open land 8 kilometers from the border: shelter ready in 3 weeks; $60 per person per month to run; no setup cost; a camp school with places for 1,200 children; no work on the site, and the nearest town is 8 kilometers away; the camp can be closed in a week when people go home.\n\nResponse B, rented rooms and repaired empty buildings in five towns within 50 kilometers: shelter ready in 11 weeks; $45 per person per month; a one-time setup cost of $900,000 for deposits, repairs and extra teachers; town schools have places for 2,700 children; the fruit-packing plants in the five towns are short of workers and will hire; rents in the five towns rose 15 percent in the first year."',
      steps: [
        'Criterion one, how soon shelter is ready. Response A is ready in 3 weeks and Response B in 11, so A is 8 weeks sooner, and for those 8 weeks Response B leaves people in emergency shelter. Write that down as A\'s win and keep going, because one criterion is not a verdict.',
        'Criterion two, total cost, and the trap is in the shape of the numbers. The monthly figures are per person, so scale them: A is 20,000 times $60, which is $1,200,000 a month. B is 20,000 times $45, which is $900,000 a month. B is $300,000 a month cheaper to run. WRONG: "B costs $45 a person plus $900,000 every month, so B is far more expensive." CORRECT: "B costs $300,000 a month less and $900,000 once, so the real question is how many months it takes to pay that $900,000 back."',
        'Work that month out, then total both over the stated stay. $900,000 divided by $300,000 a month is 3 months, so from month 4 onward B is the cheaper response. Two years is 24 months. A: $1,200,000 times 24 is $28,800,000. B: $900,000 times 24 is $21,600,000, plus the $900,000 setup, which is $22,500,000. B costs $6,300,000 less. Invert to check by the other route: 24 months of saving $300,000 is $7,200,000, minus the $900,000 setup is $6,300,000. The two routes agree, so no zero slipped.',
        'Criterion three, school places, as a share of the children rather than a count. Of 3,000 school-age children, A seats 1,200: 1,200 divided by 3,000 is 0.40, or 40 percent. B seats 2,700: 2,700 divided by 3,000 is 0.90, or 90 percent. Check both by multiplying back -- 0.40 times 3,000 is 1,200 and 0.90 times 3,000 is 2,700 -- and take the difference: B seats 1,500 more children.',
        'Criterion four, whether adults can earn, and then the question about who else bears a cost. The camp sits 8 kilometers from the nearest town with no work on the site, so adults there earn nothing; the packing plants near the five towns are short of workers and will hire. Against that, rents in those five towns rose 15 percent in the first year, and that cost falls on the households who were already living there and were not part of the choice. Name it rather than leaving it out: a response can win on the stated criteria and still put a cost on somebody who did not choose it.',
        'Now assemble the verdict, and notice that the evidence for it is three different kinds. Money says B, by $6,300,000 over the stated stay. Children say B, by 1,500 school places. Work says B, because the plants will hire and the camp has nothing within 8 kilometers. One number is a hunch; three of different kinds, all pointing the same way, is evidence. A wins on speed by 8 weeks, and the honest verdict says so out loud instead of pretending every criterion agreed.',
        'Change ONE input and run it again. Suppose the authority expects the stay to last 2 months rather than two years. A: $1,200,000 times 2 is $2,400,000. B: $900,000 times 2 is $1,800,000, plus the $900,000 setup, which is $2,700,000. Now A is $300,000 cheaper, which follows from the 3-month figure computed earlier, and being ready 8 weeks sooner matters enormously when the whole stay is about 9 weeks -- B would barely have opened before people went home. Nothing about either response changed. The expected length of the stay flipped the verdict, which is why it belongs in the criteria and not in a footnote.',
      ],
      answer:
        'Over the stated two-year stay the criteria support Response B on three of the four, and the file should say which one it loses. Cost: B is $22,500,000 against A at $28,800,000, so B is $6,300,000 less, because $300,000 saved a month pays back the $900,000 setup in 3 months. School places: B seats 2,700 of 3,000 children, which is 90 percent, against A at 1,200, which is 40 percent, so B seats 1,500 more. Earning: the towns have plants that will hire and the camp has no work within 8 kilometers. A wins on speed, by 8 weeks. A cost also falls outside both plans: rents in the five towns rose 15 percent for the households already living there. If the expected stay were 2 months instead, A would cost $2,400,000 against B at $2,700,000 and the verdict would flip.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-the-family',
      kind: 'try_yourself',
      problem:
        'A river flood in northern Halvern destroyed the village of Ostra in the spring. The Bekker family could not rebuild. They have lived since then with a cousin in a town 300 kilometers south, still inside Halvern, and parts of Ostra are still under water. Which term fits the Bekker family?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Refugees, because a disaster forced them out of their home and they still cannot go back to the village' },
        { id: 'b', text: 'Asylum seekers, because they have asked relatives in another part of Halvern to take them in while they wait' },
        { id: 'c', text: 'Internally displaced people, because the flood forced them from home and their move south crossed no international border', correct: true },
        { id: 'd', text: 'Not displaced at all, because they moved inside their own country and are staying with family rather than in a camp' },
      ],
      expectedAnswer: 'Internally displaced people, because the flood forced them from home and their move south crossed no international border',
      hints: [
        'Two things have to be true before any of the three words fits, and then one question settles which. Was the family forced from home, and did they cross an international border?',
        'The wrong routes each swap in a different test: being forced out by a disaster, asking somebody for a place to stay, or the kind of housing a family ends up in. None of those three decides the term, and a disaster counts as forcing people from home just as conflict does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-people-went',
      kind: 'try_yourself',
      problem:
        'Violence spread through the eastern districts of Ristal and 80,000 people left their homes. 52,000 of them moved to other parts of Ristal. 24,000 crossed into Vantorra, the neighboring country, whose border is 40 kilometers away and needs no visa; the bus fare is $9. 4,000 reached countries farther off; the nearest of those is 1,100 kilometers away, needs a visa, and costs $240 to reach. A post says: "Most of the people who left home in Ristal have gone far away." Which reading do the numbers support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Not supported: 76,000 of the 80,000, or 95 percent, are inside Ristal or in Vantorra next door, and the route past Vantorra costs $240 and a visa', correct: true },
        { id: 'b', text: 'Supported: 28,000 of the 80,000, or 35 percent, crossed an international border, and crossing an international border is what going far away means' },
        { id: 'c', text: 'Supported: the 4,000 who traveled 1,100 kilometers and paid $240 each are the clearest measure of how far this displacement has carried people' },
        { id: 'd', text: 'Not supported: 52,000 of the 80,000, or 65 percent, never left Ristal at all, and only the people who crossed a border have been displaced' },
      ],
      expectedAnswer: 'Not supported: 76,000 of the 80,000, or 95 percent, are inside Ristal or in Vantorra next door, and the route past Vantorra costs $240 and a visa',
      hints: [
        'Take each group as a share of the 80,000 who left home, and check that the three shares add to 100 percent. Then ask which of those groups the words "far away" are actually about.',
        'One wrong route counts any border crossing as far away, one builds the whole answer out of the smallest group, and one drops everybody who never crossed a border from the count of the displaced. The 40 kilometers, the $9 fare and the visa explain the pattern the shares show.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-two-responses',
      kind: 'try_yourself',
      problem:
        'Five thousand people have crossed into Kessel and are expected to stay at least 18 months; 900 of them are school-age. An agency must choose between two responses, against three stated criteria: the total cost over the expected stay, the share of school-age children with a school place, and how soon shelter is ready.\n\n"Plan J, a camp 5 kilometers from the border: shelter ready in 2 weeks; $50 per person per month to run; no setup cost; school places for 270 children.\n\nPlan K, rented rooms in three towns: shelter ready in 10 weeks; $35 per person per month; a one-time setup cost of $300,000; school places for 720 children."\n\nWhich verdict do the stated criteria support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plan J, because it is ready 8 weeks sooner, and an opening date settles the choice on its own whatever the cost and the school figures say' },
        { id: 'b', text: 'Plan J, because adding the $300,000 setup to Plan K makes Plan K the more expensive of the two in every month of the stay' },
        { id: 'c', text: 'Neither, because a camp and rented rooms cannot be compared on cost when only one of the two carries a one-time setup cost' },
        { id: 'd', text: 'Plan K, because over 18 months it costs $1,050,000 less and seats 450 more children, at the price of 8 more weeks before shelter is ready', correct: true },
      ],
      expectedAnswer: 'Plan K, because over 18 months it costs $1,050,000 less and seats 450 more children, at the price of 8 more weeks before shelter is ready',
      hints: [
        'Total each plan over the whole 18 months before comparing anything: multiply the monthly figure by 5,000 people and then by 18 months, and add a one-time cost once rather than in every month.',
        'Two of the wrong routes let a single criterion decide on its own -- the opening date, or a setup cost read as a monthly bill -- and the third refuses to compare at all. Three criteria were stated, and an honest verdict also names the one the winning plan loses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-all-refugees-and-setup-as-monthly',
      kind: 'misconception_check',
      question:
        'A student who has worked the Averin case writes: "Everybody who had to leave home because of the fighting is a refugee -- that is what the word means." And, on the two responses: "The camp is obviously the cheaper one, because $60 a person each month beats $45 a person each month plus $900,000." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Everybody who had to leave home because of the fighting is a refugee.',
          misconception:
            'Treating "refugee" as the general word for anybody forced from home, so the first question -- whether an international border was crossed -- never gets asked, and the largest group ends up filed under the wrong word.',
          correctsTo:
            'Being forced from home is where the questions start, not where they finish. Of the 40,000 people who left home in eastern Averin, 26,000 never crossed a border: 26,000 divided by 40,000 is 0.65, so 65 percent of them are internally displaced people, still inside Averin and still under its protection; check, 0.65 times 40,000 is 26,000. Of the 12,000 who crossed into Solvane, the ones whose claims are still waiting are counted as asylum seekers, and only the ones whose claims have been decided in their favor are counted as refugees. WRONG: "Forced from home, therefore a refugee." CORRECT: "Forced from home, then ask whether a border was crossed, and if it was, ask whether the claim has been decided." Using one word for all three groups is not just imprecise: it hides the group that never crossed a border, and that group is usually the biggest of the three.',
        },
        {
          answer: 'The camp is the cheaper response, because $60 a person each month beats $45 a person each month plus $900,000.',
          misconception:
            'Adding a one-time setup cost onto a monthly rate, so a payment made once is charged again in every month of the stay. The two figures are not the same kind of number, and they cannot be added until the one-time cost is spread across the months.',
          correctsTo:
            'Put both responses on the same footing, which means a total over the same number of months. Running costs: 20,000 times $60 is $1,200,000 a month for the camp, and 20,000 times $45 is $900,000 a month for the towns, so the towns save $300,000 every month. The setup is $900,000 once, and $900,000 divided by $300,000 a month is 3 months, so the towns response is behind for 3 months and ahead from month 4. Over the stated two years, which is 24 months: the camp is $1,200,000 times 24, or $28,800,000; the towns are $900,000 times 24 plus the $900,000 setup, or $22,500,000; the towns cost $6,300,000 less. WRONG: "$60 beats $45 plus $900,000." CORRECT: "$45 a person plus a one-time $900,000 beats $60 a person from month 4 onward, and by $6,300,000 over two years." If the stay were 2 months instead, the same arithmetic gives the opposite answer: $2,400,000 for the camp against $2,700,000 for the towns.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two questions settle the word, in order. Was an international border crossed? If no, the person is an internally displaced person. If yes, has the claim for protection been decided? Waiting means asylum seeker; decided in the person\'s favor means refugee.',
        'Before either question there is a gate: somebody who moved for work or school was not forced from home, so none of the three words applies.',
        'Distance decides none of it. Six hundred kilometers inside one country is internal displacement; twelve kilometers across a border with a claim filed is an asylum seeker.',
        'The word names a situation and the rules that come with it, never a kind of person. The same person can be counted in two categories in one year, because a border was crossed or a decision was made.',
        'Most people forced from home stay inside their own country or in the country next door, and the data shows why: each further step costs more money and asks for another document.',
        'Take each group as a share of everybody who left home, and check the shares add to 100 percent. A count of one group cannot settle a claim about all of them.',
        'Evaluate a response against the stated criteria over the stated length of stay. Spread a one-time setup cost across the months instead of charging it every month, say which criterion the winning response loses, and say who else bears a cost.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Refugees & Displacement' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
