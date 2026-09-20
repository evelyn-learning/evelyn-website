/**
 * Grade 8 World Geography — Unit 1 CED 1.1: Counts, Rates & Fair Comparison.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8geo.counts-rates-and-fair-comparison.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8GEO_U1_COUNTS_RATES_AND_FAIR_COMPARISON: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8geo.counts-rates-and-fair-comparison.v1',
  course: 'Grade 8 World Geography',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Counts, Rates & Fair Comparison',
  planId: 'evelyn.ms.m8geo.counts-rates-and-fair-comparison.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8geo.counts-rates-and-fair-comparison.v1' }],
  theory: [
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `THE CLAIM NAMES THE DENOMINATOR, SO READ THE CLAIM BEFORE YOU TOUCH THE TABLE. A rate is a count divided by something, and that something is the DENOMINATOR. Which one you use is not a matter of taste; it is fixed by what the claim is about. A claim about how packed the LAND is ("more crowded", "denser") needs land area under the count: people per square kilometer. A claim about how well the PEOPLE are served ("better coverage", "easier access") needs population under the count: doctors, buses or hectares of park per 1,000 people. A claim about how much each PERSON gets or spends ("more money behind each resident") needs the number of people under the count with no scaling: dollars per capita, which means per person. Say the denominator out loud before dividing anything.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `A COUNT ANSWERS "HOW MANY" AND NOTHING ELSE. Twelve thousand people is a real fact about a town, and it is the right figure when the question is how many school seats or bus passes the town needs. It becomes misleading only when it is used to compare two places of different size, because the bigger place wins every count automatically. "Ferris has more people" is a fact; "Ferris is more crowded" is a claim about people for each square kilometer, and a count cannot answer it. Whenever a claim compares places, and the places are not the same size, the count is the wrong tool and the rate is the right one.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `THE ROUTINE, IN ORDER. One: read the claim and name the denominator it needs. Two: for each place, divide the count by that denominator. Three: compare the rates, not the counts, and give a verdict on the claim. Four: check by inverting -- multiply each rate back by its denominator and make sure the original count comes back. If the count does not come back, the division went wrong somewhere, and it is nearly always a slipped zero.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `PER 1,000 IS A SCALING CHOICE, NOT A DIFFERENT KIND OF RATE. Dividing 24 doctors by 8,000 people gives 0.003 doctors per person, which is true and nearly impossible to read. Multiplying by 1,000 turns it into 3 doctors per 1,000 people, which is the same fact at a readable size. The scale is chosen for the reader, and the only rule is that every place in the comparison gets the same scale. Setting 3 per 1,000 against 0.002 per person is not wrong, but it is unreadable, and unreadable comparisons hide mistakes.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `THE SAME TABLE CAN RANK THE PLACES ONE WAY UNDER ONE DENOMINATOR AND THE OPPOSITE WAY UNDER ANOTHER, AND BOTH RANKINGS ARE TRUE. Sixty doctors on a small patch of land can be the densest cluster of doctors per square kilometer and, at the same time, the thinnest coverage per 1,000 residents, because the two rates answer two different questions. This is the reason the denominator has to come from the claim: pick it by habit instead and you can hand any claim the rate that flatters it. The test of a fair comparison is not whether the arithmetic is right -- both rates are right -- but whether the denominator matches what the claim is actually about.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', content: `A RATE CAN ALSO BE THE WRONG TOOL. When the question really is a total -- how many vaccine doses to ship, how many desks to buy, how many buses a route needs on its first day -- the count is the answer, and dividing it by anything throws information away. The routine starts with reading the claim precisely because sometimes the honest verdict is: this claim is about a total, so the count is the fair comparison here.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', kind: 'definition', title: 'rate', content: `a count divided by a chosen denominator, so that places of different size can be compared on the same footing.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', kind: 'definition', title: 'denominator', content: `the quantity a count is divided by to make a rate -- land area, population, or the number of people -- and the thing the claim decides.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', kind: 'definition', title: 'per capita', content: `a rate whose denominator is the number of people and which is left unscaled, giving the amount for each one person.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', kind: 'definition', title: 'per 1,000 people', content: `a rate whose denominator is population, multiplied by 1,000 so that a small figure becomes readable.` },
    { loId: 'm8geo.counts-rates-and-fair-comparison', kind: 'definition', title: 'raw count', content: `the total number of something in a place before any division has been done to it.` },
  ],
  methods: [
    {
      title: 'Worked run the routine',
      steps: [
        `Step one: read the claim and name the denominator. The claim is "most crowded". Crowded is about how packed the land is, so the denominator is land area, and the rate is people per square kilometer. Notice that the newspaper backed its claim with a count, and the count is even true: 4,500 plus 6,000 is 10,500, which is less than 12,000. A true count is still the wrong tool for a crowding claim.`,
        `Step two: divide each count by its land area. Ferris: 12,000 people divided by 40 square kilometers is 300 people per square kilometer. Galen: 4,500 divided by 9 is 500 people per square kilometer. Holm: 6,000 divided by 24 is 250 people per square kilometer.`,
        `Step three: compare the rates and give the verdict. Galen at 500 is the highest, Ferris at 300 is second, Holm at 250 is third. The claim is NOT supported: the town with the most people is not the most crowded, and the town with the FEWEST people is. WRONG: "Ferris has the most people, so it is the most crowded." CORRECT: "Galen has the most people for each square kilometer, so it is the most crowded, at 500 against 300 for Ferris and 250 for Holm."`,
        `Step four: invert to check the arithmetic. 300 times 40 is 12,000. 500 times 9 is 4,500. 250 times 24 is 6,000. All three counts come back, so no zero slipped.`,
        `Rewind the input and read it backwards. Galen has fewer than half the people of Ferris on less than a quarter of the land. Fewer people on much less land is exactly what a higher rate looks like, so the verdict follows from the table and not from a guess.`,
        `Now change ONE input and run it again, so the result is not memorized as "the small town always wins". Suppose Galen had 18 square kilometers instead of 9, with the same 4,500 people. 4,500 divided by 18 is 250 people per square kilometer, and the check is 250 times 18, which is 4,500. Galen now ties Holm at 250, and Ferris at 300 becomes the most crowded -- the newspaper would be right, and for the wrong reason. Nobody moved; only the denominator changed. The count never moved either, which is exactly why the count could not have told you.`,
      ],
      example: { problem: `Run the routine straight through on a newspaper claim.

Three towns sit in the same county. "Ferris: 12,000 people, 40 square kilometers. Galen: 4,500 people, 9 square kilometers. Holm: 6,000 people, 24 square kilometers." The county newspaper writes: "Ferris is the most crowded town in the county -- it has more people than Galen and Holm put together." Test the claim.`, solution: `The claim is not supported. Crowding needs people per square kilometer: Ferris is 300 (12,000 divided by 40), Galen is 500 (4,500 divided by 9) and Holm is 250 (6,000 divided by 24), so Galen, the town with the fewest people, is the most crowded. Multiplying each rate back by its area returns each count. With Galen's land doubled to 18 square kilometers its rate halves to 250 and Ferris becomes the most crowded, which shows that the ranking lives in the denominator, not in the count.` },
      relatedLoIds: ['m8geo.counts-rates-and-fair-comparison'],
    },
    {
      title: 'Worked repair the denominator',
      steps: [
        `Check the arithmetic first, because a wrong verdict is not always a wrong division. 60 divided by 20 is 3, and 3 times 20 is 60. 24 divided by 12 is 2, and 2 times 12 is 24. Both divisions are right. The slip is not in the arithmetic.`,
        `Now go back to step one of the routine, which the student skipped: read the claim and name the denominator. The claim is about RESIDENTS and their access to a doctor. That is a claim about people, so the denominator has to be people, not land. The student divided by square kilometers, which answers a different question: how close together the doctors are.`,
        `Re-run step two with the right denominator. Marlow: 60 doctors divided by 30,000 people is 0.002 doctors per person. Nesbit: 24 doctors divided by 8,000 people is 0.003 doctors per person. Those are true and unreadable, so scale both by 1,000: Marlow is 2 doctors per 1,000 people and Nesbit is 3 doctors per 1,000 people.`,
        `Step three: compare and give the verdict. Nesbit at 3 per 1,000 is higher than Marlow at 2 per 1,000, so the claim IS supported. WRONG: "Marlow has 3 doctors per square kilometer against 2, so Marlow residents have better access." CORRECT: "Nesbit has 3 doctors for every 1,000 residents against 2 in Marlow, so Nesbit residents have better access, even though Marlow has more doctors in total and more doctors on each square kilometer."`,
        `Step four: invert. 2 per 1,000 times 30 thousand people is 60 doctors. 3 per 1,000 times 8 thousand people is 24 doctors. Both counts come back.`,
        `Say what the student's numbers were. They were not wrong numbers; they were right answers to a question nobody asked. Three doctors per square kilometer says Marlow's doctors sit closer together, which would matter if the claim were about how far a patient has to travel. It says nothing about how many patients each doctor is shared among. One table, two denominators, two opposite rankings, and both are true -- the claim decides which one counts.`,
        `Change ONE input and run it again. Suppose Nesbit grew to 16,000 people with the same 24 doctors. 24 divided by 16,000 is 0.0015, which is 1.5 doctors per 1,000 people, and the check is 1.5 times 16, which is 24. Nesbit now falls below Marlow at 2, and the claim stops being supported. Not one doctor left town; the denominator doubled, so the rate halved.`,
      ],
      example: { problem: `A student ran the routine and got the denominator wrong. Find the slip, repair it, and say what the wrong number was actually measuring.

"Marlow: 60 doctors, 30,000 people, 20 square kilometers. Nesbit: 24 doctors, 8,000 people, 12 square kilometers." The claim under test: "Residents of Nesbit have better access to a doctor than residents of Marlow." The student wrote: "Marlow: 60 divided by 20 is 3 doctors per square kilometer. Nesbit: 24 divided by 12 is 2 doctors per square kilometer. Marlow is higher, so the claim is false."`, solution: `The arithmetic was right and the denominator was wrong. The claim is about residents, so the count of doctors has to be divided by people: Marlow is 60 divided by 30,000, which is 2 doctors per 1,000 people, and Nesbit is 24 divided by 8,000, which is 3 per 1,000, so the claim is supported. The student's 3 and 2 doctors per square kilometer are correct figures for a different question, how close together the doctors are, and that question ranks the towns the opposite way. If Nesbit doubled to 16,000 people its rate would halve to 1.5 per 1,000 and the claim would fail.` },
      relatedLoIds: ['m8geo.counts-rates-and-fair-comparison'],
    },
  ],
  pointers: [
    { content: `Students often say "Ulm has four times the people, so it is four times as crowded." — Crowding is people for each square kilometer, so divide. Ulm: 20,000 divided by 50 is 400 people per square kilometer; check, 400 times 50 is 20,000. Vance: 5,000 divided by 5 is 1,000 people per square kilometer; check, 1,000 times 5 is 5,000. WRONG: "Ulm has four times the people, so it is four times as crowded." CORRECT: "Vance is the more crowded town, at 1,000 people per square kilometer against 400, even though Ulm has four times as many people, because Ulm also has ten times as much land." The count ranks the towns one way and the rate ranks them the other, and only the rate answers a crowding claim.`, kind: 'common-error' },
    { content: `Students often say "Any rate will do, so park land divided by town area shows that Vance residents get more park." — The claim is "Vance residents get more park", which is about people, so the denominator is people. Ulm: 100 hectares divided by 20,000 people, scaled to per 1,000, is 5 hectares per 1,000 people; check, 5 times 20 is 100. Vance: 15 hectares divided by 5,000 people is 3 hectares per 1,000 people; check, 3 times 5 is 15. Ulm residents get more park, 5 per 1,000 against 3. The student's figures were not wrong: 100 divided by 50 is 2 hectares per square kilometer for Ulm, and 15 divided by 5 is 3 for Vance, so Vance does have more park for its land. That answers which town is greener for its size, not which residents get more park. WRONG: "Any rate will do." CORRECT: "The claim names the denominator, and a rate with the wrong denominator is a right answer to the wrong question."`, kind: 'common-error' },
    { content: `Read the claim first. The claim names the denominator: land for crowding, people for coverage and access, each person for spending and income.`, kind: 'tip' },
    { content: `A count answers only "how many". Comparing counts across places of different size is where a count misleads, because the bigger place wins every count.`, kind: 'tip' },
    { content: `The routine: name the denominator, divide each count by it, compare the rates, then multiply each rate back to recover the count.`, kind: 'tip' },
    { content: `Per 1,000 people is the same rate at a readable scale. Keep every place in a comparison on the same scale.`, kind: 'tip' },
    { content: `One table can rank places one way per square kilometer and the opposite way per 1,000 people. Both are true; the claim decides which one is the fair comparison.`, kind: 'tip' },
    { content: `Change one input and run it again. If doubling the land halves the rate while the count stands still, the count was never going to tell you.`, kind: 'tip' },
    { content: `Sometimes the count is the fair comparison: when the question is a total, do not divide.`, kind: 'tip' },
    { content: `Read the claim before touching the table. The claim tells you the denominator: "crowded" → land area; "better access" → people; "per person" → each person. Wrong denominator = wrong answer to the wrong question.`, kind: 'gotcha' },
    { content: `A raw count is true but misleading when you compare places of different sizes. "Ferris has more people" is a fact; "Ferris is more crowded" is not. Never use a count to support a comparison claim across places—divide it first.`, kind: 'common-error' },
    { content: `Always invert to check: multiply the rate back by the denominator and confirm the original count returns. If it doesn't, a zero slipped in the division—almost always the culprit.`, kind: 'tip' },
    { content: `Per 1,000 is a scaling choice, not a different kind of rate. 0.003 doctors per person and 3 doctors per 1,000 people are the same fact. Keep all places in one comparison on the same scale or you hide mistakes.`, kind: 'vocab-note' },
    { content: `One table, two denominators, two opposite rankings—both true. Marlow's doctors per square kilometer (crowded clinic) ranks opposite to doctors per 1,000 residents (patient load). The claim decides which one is fair.`, kind: 'edge-case' },
    { content: `If the question is a total ("How many desks to buy?" "How many vaccine doses to ship?"), the count is the right tool. Do not divide it. The routine starts with reading the claim precisely because sometimes the honest answer is: use the count.`, kind: 'edge-case' },
    { content: `Change one input and run the routine again. If doubling the land halves the rate while the count stays the same, the count was never going to tell you which town is crowded. The denominator drives the ranking.`, kind: 'tip' },
    { content: `Don't confuse 'per square kilometer' with 'per 1,000 people.' One measures how packed the land is; the other measures how thinly spread across residents. Same count, opposite answers—check the claim to pick the right one.`, kind: 'vocab-note' },
  ],
};
