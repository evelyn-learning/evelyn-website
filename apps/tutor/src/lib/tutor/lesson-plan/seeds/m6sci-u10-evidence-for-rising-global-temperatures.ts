/**
 * Grade 6 Science (Earth & Space Science) — Human Activity & Earth's
 * Systems: Evidence for Rising Global Temperatures.
 *
 * PROCEDURE-LED fan-out row for m6sci (NGSS MS-ESS3-5). One routine runs the
 * whole lesson: read a temperature record and a carbon-dioxide (CO2) record
 * across many decades, check that each shows a genuine sustained direction
 * rather than a single-year blip, compute how much each record changes from
 * decade to decade to see whether the rise is speeding up, compare the
 * TIMING of the two records against each other and against the scale-up of
 * human fossil-fuel combustion, and bring in the one known physical
 * mechanism (carbon dioxide traps outgoing heat) that explains why the two
 * would move together rather than merely happen to rise in the same years.
 * Trend, timing and mechanism together are the standard this lesson holds
 * evidence to; any one of the three alone is treated as weaker.
 *
 * The trap this row is built to kill is the single-reading trap named in row
 * 8.1 (weather versus climate), scaled up: a single unusually warm or cold
 * YEAR is exactly the kind of one-reading claim that row 8.1 already taught
 * cannot establish a trend, and this row is where that same logic pays off
 * at the century timescale that MS-ESS3-5 actually asks about. A second trap
 * this row kills is treating two co-rising trends, by themselves, as
 * sufficient proof of a causal link — real trends can rise together by
 * coincidence, and this lesson insists on a matching-timing check and a
 * known mechanism before calling the case strong.
 *
 * FIGURES: this row states no exact current CO2 concentration and no exact
 * amount of warming to date, because both are figures that move year to
 * year as new data arrive, which is precisely the failure mode named for
 * this row. Every quantitative record in this file is an invented,
 * explicitly labeled "index" — never degrees Celsius, never parts per
 * million — built only to carry the correct SHAPE of the real records
 * (comparatively flat early, then rising, fastest in the most recent
 * decades) so that the reading-and-arithmetic routine can be practiced and
 * checked without asserting a real-world number that could go stale or be
 * wrong. Every real-world claim in this file (that Earth has warmed, that
 * CO2 has risen, that fossil-fuel combustion scaled up over the century) is
 * stated as a SHAPE or a settled historical fact, never as a precise value.
 *
 * SCOPE GUARD: this plan evaluates an invented temperature index and an
 * invented CO2 index, both spanning the same six decades from the early
 * 1900s to recent decades, as evidence for a warming trend and for that
 * trend's association with the rise in human fossil-fuel combustion over
 * the same span. It does not do anything belonging to a neighboring row:
 *   - ROW 10.1 (the carbon cycle in rocks, ocean and air) already covers how
 *     carbon moves between the geosphere, ocean and atmosphere as a
 *     reservoir-to-reservoir cycle. That reservoir language is not repeated
 *     here. Fossil-fuel combustion appears in this file only as the human
 *     activity whose scale is being compared against the two records; it is
 *     not re-explained as a step in the carbon cycle.
 *   - ROW 10.3 (monitoring and reducing human impact) owns evaluating a
 *     proposed design, filter, or policy response. This file proposes no
 *     mitigation, no technology, and no policy anywhere; it evaluates
 *     evidence for a trend and an association, and stops there.
 *   - ROW 10.4 (population growth and resource demand) owns population and
 *     per-person consumption figures. No population number and no
 *     consumption-per-person figure appears anywhere in this file.
 *   - ROW 8.1 (weather versus climate) already established that a single
 *     day's weather is not evidence about a region's climate. This file
 *     builds directly on that same logic, scaled from a day to a year and
 *     from a region to the globe, and says so explicitly, but it does not
 *     redefine "weather" or "climate" — those definitions live in row 8.1
 *     and are only referenced here, not restated.
 *   - ROW 8.4 (reading climate graphs) already solved presenting graphed
 *     data in printed words, and this file follows that same convention:
 *     every record here is two lists of numbers with stated units (or, for
 *     the invented index values, an explicit "no real unit" label), and
 *     every item is solvable from the text printed inside it.
 *   - ROWS 9.1 and 9.2 (renewable and nonrenewable resources; how geologic
 *     processes distribute resources) own classifying fossil fuels as
 *     nonrenewable and explaining where fuel deposits form. Neither
 *     classification nor geologic origin is discussed here.
 *   - GRADE 7 LIFE SCIENCE boundary: no ecological framing is in scope for
 *     this row, and none appears in the lesson itself — no food web, no
 *     ecosystem, no biodiversity, and no population framed as an ecological
 *     quantity anywhere in the segments a student sees.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: the greenhouse effect is named and
 *     used only at the qualitative level the curriculum's own boundary
 *     table allows for carbon dioxide — a named substance that traps
 *     outgoing heat. The lesson itself contains no wavelength, no radiation
 *     named as a mode of heat transfer, no particle-level account of
 *     absorption, and no equation or calculated quantity of energy.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * temperature and CO2 record in this file is written out as a labeled list
 * of numbers in the running text, and every item is solvable entirely from
 * the numbers printed inside it. Never write "the graph shown" or "the line
 * above," and never assume the student has seen a real temperature or CO2
 * graph's plotted shape.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U10_EVIDENCE_FOR_RISING_GLOBAL_TEMPERATURES: LessonPlan = {
  id: 'evelyn.ms.m6sci.evidence-for-rising-global-temperatures.v1',
  title: 'Evidence for Rising Global Temperatures',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.evidence-for-rising-global-temperatures',
      standard: 'M6SCI-10.2',
      description:
        'Evaluate graphed temperature and atmospheric-CO2 data over the past century as evidence for a warming trend and its association with human fossil-fuel use (NGSS MS-ESS3-5).',
    },
  ],
  prerequisites: ['m6sci.the-carbon-cycle-in-rocks-ocean-and-air'],
  followUps: ['m6sci.monitoring-and-reducing-human-impact-on-earth-systems'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surface the single-reading trap in a form the student has probably already heard, before naming any of the actual evidence.',
      script:
        'You have probably heard somebody say something like this. On a freezing cold day: "so much for global warming." On a scorching hot day: "see, that right there is climate change." Both comments are making the exact same mistake, just pointed in opposite directions. A single day, or even a single year, is one reading. It cannot tell you whether Earth is warming, cooling, or holding steady over the long run, for the same reason that one hot afternoon could not tell you whether an entire region\'s climate had shifted. So what would actually settle the question? Today you learn to read the kind of evidence that can: records that stretch across decades, and the reasoning that turns those records into a real answer.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trend-timing-mechanism',
      kind: 'concept',
      goal: 'Install the trend-versus-single-reading distinction, the shape of the real temperature and CO2 records, the heat-trapping mechanism, and the three-part standard for strong evidence of an association.',
      keyIdeas: [
        'A TREND IS NOT A SINGLE READING. A temperature record moves up and down from year to year because of ordinary variation, the same way a single day\'s weather can sit above or below a region\'s climate pattern. A real trend can only be seen by looking at many decades of readings together. One unusually warm year is not evidence that Earth is warming, and one unusually cold year is not evidence that it is not -- in either direction, a single year is one reading, not a trend.',
        'THE TEMPERATURE RECORD HAS A SHAPE. Direct instrument records covering the past century and more show that Earth\'s average temperature has been higher, on average, in recent decades than it was in the early 1900s, and the rise has been fastest in the most recent several decades rather than steady the whole way through. This lesson works with the SHAPE of that record -- comparatively flat, then rising, then rising faster -- rather than any single current number, because the exact current number changes as new data arrive every year.',
        'THE CO2 RECORD HAS A MATCHING SHAPE. Carbon dioxide in the atmosphere is measured directly today and reconstructed from air trapped in ice for earlier periods. That record also rises over the same century-plus span: comparatively steady for a long stretch, then rising, with the fastest rise in the decades since large-scale fossil-fuel combustion -- coal first, then oil and natural gas -- expanded sharply worldwide, roughly from the middle of the 1900s onward, alongside fast industrial growth.',
        'THE MECHANISM THAT CONNECTS THEM. Sunlight passes through the atmosphere and warms Earth\'s surface. Earth then radiates some of that heat back outward. Carbon dioxide absorbs part of that outgoing heat and keeps it from escaping right away, which warms the lower atmosphere -- this is the greenhouse effect, and the natural version of it is what keeps Earth\'s surface warm enough to support life in the first place. Adding more carbon dioxide to the atmosphere strengthens that heat-trapping effect. This mechanism is the physical reason a rising CO2 trend and a rising temperature trend are expected to move together, rather than being two unrelated lines that simply happen to rise in the same years.',
        'STRONG EVIDENCE FOR AN ASSOCIATION NEEDS THREE THINGS TOGETHER. First, each record must show a sustained trend across many decades, not a single-year blip. Second, the timing of the fastest rise in each record must line up with the timing of the sharpest scale-up in human fossil-fuel combustion. Third, there must be a known physical mechanism -- carbon dioxide\'s heat-trapping property -- that explains why the two would rise together. Two records rising over the same stretch of decades, by themselves, are not enough on their own: plenty of unrelated things can rise over the same span purely by coincidence. It is trend, matching timing, and mechanism together that make the case strong, not any one of the three alone, and not simply how many people repeat the conclusion.',
        'WHAT THIS EVIDENCE DOES, AND DOES NOT, ESTABLISH. Reading the records this way supports the conclusion that Earth\'s warming trend over the past century is real and is associated with the rise in human fossil-fuel use. It does not, by itself, predict next year\'s weather at any one place, and it says nothing about what should be done in response -- proposing or evaluating a response is a different lesson.',
      ],
      vocabulary: [
        { term: 'trend', definition: 'a sustained direction seen across many readings taken over time, as distinct from any single reading.' },
        { term: 'atmospheric carbon dioxide (CO2)', definition: 'a gas in the atmosphere, measured directly today and reconstructed from ice for earlier periods, that absorbs some of Earth\'s outgoing heat.' },
        { term: 'greenhouse effect', definition: 'the trapping of some of Earth\'s outgoing heat by gases including carbon dioxide, which keeps Earth\'s surface warmer than it would otherwise be.' },
        { term: 'fossil fuel', definition: 'coal, oil, or natural gas, burned by people for energy, releasing carbon dioxide that had been stored out of the atmosphere for a very long time.' },
        { term: 'association', definition: 'a relationship in which two things reliably rise or fall together, supported here by a matching trend, matching timing, and a known mechanism connecting them.' },
      ],
      suggestedTools: ['show_table', 'show_timeline'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reading-the-temperature-index',
      kind: 'worked_example',
      problem:
        'A simplified temperature index is reported for six decades, from the early 1900s to recent decades. The index numbers, oldest to most recent, are: 100, 101, 102, 104, 108, 115. There is no real unit here; the numbers are invented for this exercise to carry the correct shape of the real record. Does this record show a genuine multi-decade trend, and if so, is the pace of that trend speeding up, slowing down, or steady?',
      steps: [
        'First, read the direction from one decade to the next: 100, then 101, then 102, then 104, then 108, then 115. Every single step is an increase. Across all six decades, the index never once goes down.',
        'A rise that holds across six separate decades, with no reversal, is a genuine multi-decade trend, not a single-reading blip -- this is exactly the kind of evidence a single year could never provide by itself.',
        'Now compute how much the index changes from one decade to the next, to see whether the pace is steady or changing: 101 - 100 = 1; 102 - 101 = 1; 104 - 102 = 2; 108 - 104 = 4; 115 - 108 = 7.',
        'Read the five differences in order: 1, 1, 2, 4, 7. The differences themselves are getting bigger, not staying the same. That means the index is not just rising -- it is rising FASTER in the more recent decades than it did in the earliest ones.',
        'WRONG: "The index went up in every decade, so the rate of increase must be about the same throughout." CORRECT: "The index went up in every decade, and the SIZE of each decade\'s increase grew over time, from 1 in the earliest decades to 7 in the most recent one, so the rise has been speeding up."',
        'Run the three-clues check, since there is no equation to work backward through here. First, a consistency clue: every one of the five decade-to-decade steps is upward, with no exception across the whole six-decade span. Second, a magnitude clue, independent of the first: the size of the increases themselves grows over time (1, 1, 2, 4, 7), which is a second and separate way the data show acceleration, not merely persistence. Third, a shape clue: this pattern -- comparatively flat early, then rising faster later -- matches the general shape of the real, published temperature record, without needing to state any of its actual numbers.',
        'Now change the input and check that the answer moves with it. Suppose the index had instead read 100, 105, 103, 108, 104, 110 -- up, then down, then up, then down, then up. That record would NOT show a genuine trend, because the direction reverses rather than holding across the six decades; no conclusion about warming could be drawn from a record shaped like that, however far the last number sits above the first.',
      ],
      answer:
        'Yes, this is a genuine multi-decade warming trend: the index rises in every one of the six decades with no reversal. The pace is also speeding up, not steady -- the decade-to-decade increases grow from 1 to 1 to 2 to 4 to 7, so the rise has been faster in the most recent decades than in the earliest ones.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-comparing-temperature-and-co2-timing',
      kind: 'worked_example',
      problem:
        'Alongside the temperature index from the previous problem, a simplified CO2 index is reported for the same six decades, oldest to most recent: 100, 100, 101, 104, 110, 121. Again, there is no real unit; the numbers are invented to carry the shape of the real record. Using both records together, evaluate whether the data support an association between the rising CO2 trend and the rising temperature trend, and whether that association fits with the history of human fossil-fuel use.',
      steps: [
        'Read the CO2 index\'s direction the same way as before: 100, 100, 101, 104, 110, 121. It never decreases across any of the six decades -- a second genuine multi-decade trend, by the same test used on the temperature index.',
        'Compute the decade-to-decade increases: 100 - 100 = 0; 101 - 100 = 1; 104 - 101 = 3; 110 - 104 = 6; 121 - 110 = 11.',
        'Read the five differences in order: 0, 1, 3, 6, 11. Just like the temperature index, the CO2 index is not just rising -- it is rising faster over time, and it is doing so in the SAME later decades: the temperature increases jumped from small (1, 1) to much larger (2, 4, 7) starting at the fourth decade, and the CO2 increases jumped from small (0, 1) to much larger (3, 6, 11) starting at that same fourth decade. That is a timing match between the two records, not just two separate trends that both happen to rise somewhere in the six decades.',
        'Bring in the history: large-scale fossil-fuel combustion scaled up sharply beginning around the middle of the 1900s, as coal use kept growing and oil and natural gas use expanded worldwide alongside rapid industrial growth. That is the same stretch of decades where both indexes\' increases jump from small to much larger.',
        'Bring in the mechanism from the concept segment: carbon dioxide absorbs some of the heat Earth radiates outward, trapping it near the surface. That known mechanism is WHY a rise in CO2 would be expected to cause more warming, rather than the two trends merely happening to occur in the same years.',
        'WRONG: "The temperature index and the CO2 index both went up over the six decades, so one must be the entire explanation for the other." CORRECT: "The two sustained trends, their matching acceleration timing, and the independently known heat-trapping property of carbon dioxide together support an association; the rise in the two indexes alone, without the timing match and the mechanism, would be much weaker evidence."',
        'Run the three-clues check, using three genuinely different kinds of evidence. First, a consistency clue, within each record on its own: neither index ever reverses across the six decades. Second, a timing clue, comparing the two records to each other: both indexes\' increases jump from small to large starting in the same later decade, matching the era when fossil-fuel combustion itself scaled up. Third, a mechanism clue, independent of both records: carbon dioxide\'s known heat-trapping property gives a physical reason the two would rise together, not merely an observed coincidence.',
        'Now change one input and check that the conclusion moves with it. Suppose the CO2 index had instead stayed flat at 100 across all six decades while the temperature index still rose the way it did. The timing match would be gone, and there would be no reason from this evidence to connect the temperature trend to CO2 specifically, even though the temperature trend itself would still be real. Take away the matching timing, or take away the mechanism, and the case for an association gets much weaker -- which is exactly why this lesson checks for all three rather than stopping at "both went up."',
      ],
      answer:
        'Yes: both indexes show a genuine multi-decade trend, both accelerate in the same later decades, that timing matches the historical scale-up of fossil-fuel combustion, and carbon dioxide\'s known heat-trapping property supplies the mechanism connecting the two. Trend, matching timing, and mechanism together support an association between rising CO2 from human fossil-fuel use and the rising temperature trend -- not simply two lines that happen to move at the same time.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-single-year-is-not-a-trend',
      kind: 'try_yourself',
      problem:
        'One particular year in Earth\'s temperature record turns out warmer than every year that came before it. A student says: "That proves Earth\'s climate is warming." Is the student\'s reasoning solid?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'No -- one especially warm year is a single reading. A genuine warming trend can only be shown by a sustained rise across many decades of records, not by any single year, however warm.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Yes -- since that year beat every previous year in the record, that single year is by itself enough to establish that the overall trend is upward.',
        },
        {
          id: 'c',
          text: 'No -- a single warm year actually counts as evidence against a warming trend, because a reading that extreme is too unusual to represent a real long-term pattern.',
        },
        {
          id: 'd',
          text: 'Yes -- because the temperature that year was measured directly with instruments, and a direct instrument measurement is automatically strong evidence about the long-term trend.',
        },
      ],
      expectedAnswer:
        'No -- one especially warm year is a single reading. A genuine warming trend can only be shown by a sustained rise across many decades of records, not by any single year, however warm.',
      hints: [
        'Ask what a trend actually requires: a pattern seen across how many readings? Does one year, however warm, supply that many readings on its own?',
        'Recall the single-day-versus-climate idea from an earlier lesson: one unusual reading can be real and still tell you nothing about the long-run pattern it stands out from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reading-two-records-together',
      kind: 'try_yourself',
      problem:
        'A temperature index and a CO2 index are each reported for the same four decades, oldest to most recent. Temperature index: 100, 100, 102, 107. CO2 index: 100, 101, 103, 109. Which statement best describes what this pair of records shows?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Only the CO2 index shows a genuine multi-decade trend; the temperature index rises by too small an amount in the first two decades to count as part of a trend at all.',
        },
        {
          id: 'b',
          text: 'Both indexes rise across all four decades with no reversal, and in both indexes the biggest jump happens in the same most recent decade, which is the kind of timing match that supports linking the two trends.',
          correct: true,
        },
        {
          id: 'c',
          text: 'The two indexes cannot be compared to each other at all, because they use different index values and start from different starting numbers, so their shapes cannot be lined up.',
        },
        {
          id: 'd',
          text: 'Both indexes rise by about the same fixed amount in every decade, so there is no meaningful pattern in how the size of the increases changes over time.',
        },
      ],
      expectedAnswer:
        'Both indexes rise across all four decades with no reversal, and in both indexes the biggest jump happens in the same most recent decade, which is the kind of timing match that supports linking the two trends.',
      hints: [
        'Compute the decade-to-decade differences for each index separately before comparing them: for the temperature index, 100 to 100, then 100 to 102, then 102 to 107. Do the same for the CO2 index.',
        'A trend does not require a large increase in every single decade -- it requires the direction to hold. Once you have both sets of differences, ask which decade carries the biggest jump in EACH index, and whether that is the same decade in both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-makes-the-evidence-strong',
      kind: 'try_yourself',
      problem:
        'Which of these is the strongest reason to conclude that the rise in human fossil-fuel use is associated with the rise in global temperature, rather than the two simply being an unrelated coincidence?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Both trends have risen over the same century, and since two records that move in the same direction across that many years are extremely unlikely to do so purely by chance, that shared upward direction by itself is already enough to establish a real connection between them.',
        },
        {
          id: 'b',
          text: 'The great majority of scientists who study Earth\'s climate agree that the two are connected, and when that many trained scientists in the same field reach the same conclusion independently, the size of that agreement is treated here as strong enough proof on its own, without needing to check the trend, the timing, or the mechanism directly.',
        },
        {
          id: 'c',
          text: 'Both trends have persisted over many decades rather than appearing in just one year, the fastest rise in each has happened in the same decades as the sharpest scale-up in fossil-fuel combustion, and carbon dioxide is independently known to trap outgoing heat -- a sustained trend, matching timing, and a known mechanism together, not simply two lines that happen to move at the same time.',
          correct: true,
        },
        {
          id: 'd',
          text: 'Computer models built to predict future temperatures show continued warming under continued fossil-fuel use, and because those same models were built using the past temperature and CO2 records, a prediction that matches the expected future trend is treated here as proof that the models correctly captured what caused the warming that already happened.',
        },
      ],
      expectedAnswer:
        'Both trends have persisted over many decades rather than appearing in just one year, the fastest rise in each has happened in the same decades as the sharpest scale-up in fossil-fuel combustion, and carbon dioxide is independently known to trap outgoing heat -- a sustained trend, matching timing, and a known mechanism together, not simply two lines that happen to move at the same time.',
      hints: [
        'Two things rising over the same stretch of decades can still be an unrelated coincidence. What would you need in addition to "they both went up" to rule coincidence out?',
        'Look for the choice that combines three separate kinds of support -- a sustained trend, a timing match, and a known mechanism -- rather than the choice that leans on only one of those, or on how many people state the conclusion.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-single-reading-and-small-fraction',
      kind: 'misconception_check',
      question:
        'Two students make claims. Student one says: "It was unusually cold where I live last winter, so global warming cannot be real." Student two says: "Carbon dioxide is only a small fraction of the atmosphere, so it cannot possibly cause a big change in temperature." What is wrong with each claim?',
      commonErrors: [
        {
          answer: 'It was unusually cold where I live last winter, so global warming cannot be real.',
          misconception:
            'Treating one local, single-season reading as if it were evidence about a global, multi-decade trend, because a personal, recent experience feels like strong evidence on its own.',
          correctsTo:
            'One unusually cold winter at one place is a single reading, in one location, over one season. It does not test the global multi-decade record at all. A genuine warming trend is established only by looking at temperature records across many decades and across the whole globe, not by any single place\'s single season -- and a real long-term warming trend can still include individual cold winters at individual places, in the same way a rainy-climate region can still have a dry week without its climate description being wrong.',
        },
        {
          answer: 'Carbon dioxide is only a small fraction of the atmosphere, so it cannot possibly cause a big change in temperature.',
          misconception:
            'Assuming that the SIZE of a gas\'s share of the atmosphere is what determines the SIZE of its effect, rather than the gas\'s specific properties.',
          correctsTo:
            'Nitrogen makes up about 78 percent of the atmosphere and oxygen about 21 percent, leaving carbon dioxide as a small fraction of the total -- that part is true. But nitrogen and oxygen do not trap outgoing heat the way carbon dioxide does, so the amount of the atmosphere a gas takes up is not what decides its effect; its specific heat-trapping property is. A small quantity of something can still have a large effect if it has a strong specific property: a small amount of dye placed in a large tank of water is still enough to change the color of the whole tank, because color-changing is a property of the dye itself, not something that requires a large quantity of it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A trend requires a sustained direction across many decades of records. A single year, warmer or colder than usual, is one reading, not a trend, in either direction.',
        'Earth\'s temperature record and the atmospheric CO2 record both show the same shape over the past century and more: comparatively flat early on, then rising, fastest in the most recent decades.',
        'Carbon dioxide absorbs some of the heat Earth radiates outward and traps it near the surface -- the greenhouse effect. Adding more CO2 strengthens that trapping, which is the mechanism connecting the two rising trends.',
        'Strong evidence for an association needs three things together: a sustained trend in each record, matching timing between the two records and with the scale-up of fossil-fuel combustion, and a known mechanism connecting them. Any one of the three alone is weaker.',
        'Two trends rising over the same span, a conclusion resting on how many people state it, or a model\'s future prediction, are each weaker forms of support than trend, timing and mechanism taken together.',
        'This evidence establishes that Earth\'s warming trend is real and is associated with human fossil-fuel use. It does not by itself predict next year\'s weather or say what to do in response.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Evidence for Rising Global Temperatures' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
