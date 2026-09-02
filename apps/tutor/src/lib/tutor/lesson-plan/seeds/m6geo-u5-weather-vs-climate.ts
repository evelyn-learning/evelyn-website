/**
 * Grade 6 World Geography — Weather, Climate & Ecosystems: Weather vs.
 * Climate.
 *
 * CONCEPT-LED fan-out row for m6geo (National Geography Standard 7). The
 * whole lesson installs one distinction and stops: WEATHER is what the
 * atmosphere is doing at one place right now or over a few days; CLIMATE is
 * the pattern of weather that place usually has, year after year. The two
 * traps this plan is built to kill: treating a place's known climate as a
 * guarantee about what today's weather must be, and treating one unusual
 * stretch of weather as proof that a place's climate has changed to
 * something else.
 *
 * SCOPE GUARD: this row says THAT weather is a short-span description (right
 * now or a few days) and THAT climate is the long-term pattern a place
 * usually has, and it gives a described example of each. It never says WHY
 * one place's usual pattern differs from another's. The five controls on
 * climate -- latitude, elevation, distance from water, ocean currents, and
 * mountain barriers -- name NO appearance anywhere in this file, by term or
 * by paraphrase; that mechanism belongs to Grade 7's
 * `m7geo-u2-weather-climate-and-factors.ts`. What IS deliberately allowed,
 * because that Grade 7 row sits directly next to this one: naming that
 * different invented places can have different climates and different
 * weather on a given day, and giving a described example of each, with no
 * explanation attached for why any one place's pattern is what it is. This
 * file also never mentions global warming, a rising temperature trend, or
 * any human cause -- that is outside this row's scope sentence entirely and
 * is reserved territory even in the sibling science course (see below), not
 * a line this row needs to walk up to at all.
 *
 * SIBLING-COURSE NOTE (m6sci-u8-weather-versus-climate.ts): the Grade 6
 * SCIENCE course teaches this identical pair of words, and this file does
 * not contradict it on any shared fact -- both agree that a single
 * observation is evidence about weather, not climate, and both agree that a
 * climate description does not guarantee what any one day will be like.
 * Where the two differ is depth and apparatus, not fact. The science file
 * ties climate to a measurement procedure -- "generally at least three
 * decades" of averaged records -- and spends two worked examples on
 * evidentiary reasoning about single measurements versus multi-year
 * averages; that framing is a step toward MECHANISM (how you would actually
 * establish a climate figure) and is this course's sibling subject's choice
 * to make, not this row's. This file states the same underlying distinction
 * at plain DEFINE / IDENTIFY / CLASSIFY depth -- "right now or a few days"
 * versus "the pattern a place usually has, year after year" -- with no
 * numeric year-count, no averaging procedure, and no claim about how many
 * years of records it would take to prove a pattern. It also uses only
 * invented, described places (Baytown, Riverton, Rimwood, Sandy Cove,
 * Foxhollow), never the science file's real-vs-invented framing question,
 * because at this depth an invented place is the safer and sufficient
 * example for every item.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item below is
 * answered by DEFINE, IDENTIFY, or CLASSIFY. Nothing here explains why a
 * place has the climate it has, and nothing here builds a chain of more than
 * one plain-language reason. The strongest item (the Riverton thunderstorm,
 * `try-one-afternoon-is-evidence-about`) gives one specific observation and
 * asks which of the two questions it is evidence about, which is where this
 * age group's confidence outruns its accuracy: a student who can recite both
 * definitions cleanly will still call one dramatic afternoon proof that a
 * place's climate has changed.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was built to be the longest choice BECAUSE it is
 * the key. Measured as a diagnostic, not a score to minimize: the key is the
 * strictly longest choice in 2 of the 3 items -- item 1 (137 characters)
 * leads its nearest distractor (134) by 3 characters, which the contract
 * calls a tie rather than a signal, and item 3 (131) leads its nearest
 * distractor (101) by 30. In item 2 the key (117) is NOT the longest choice;
 * a distractor (120) is, by a 3-character margin. Full counts for all twelve
 * choices are in the authoring report. The three keys sit at ids a, d, and b
 * -- the id set `(5 + 1) mod 4 = 2` requires, omitting c.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U5_WEATHER_VS_CLIMATE: LessonPlan = {
  id: 'evelyn.ms.m6geo.weather-vs-climate.v1',
  title: 'Weather vs. Climate',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.weather-vs-climate',
      standard: 'M6GEO-5.1',
      description:
        "Distinguish weather -- the atmosphere right now or over a few days -- from climate -- the long-term pattern of weather a place usually has -- using a described example of each (National Geography Standard 7: the physical processes that shape the patterns of Earth's surface).",
    },
  ],
  prerequisites: ['m6geo.reading-elevation-and-relief'],
  followUps: ['m6geo.the-water-cycle'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surface the everyday confusion between what a place is usually like and what it is doing today, before either word arrives.',
      script:
        'Your cousin lives somewhere famous for being hot and dry -- every visitor packs shorts and sunscreen. Today she sends a message: it is cold and pouring rain outside, and she cannot remember the last time that happened. For a second you wonder if she has her own home wrong. She does not, and neither do you. Without realizing it, the two of you are actually talking about two different questions. One question is what the air outside her window is doing at this exact moment. The other question is what her home is usually like, day after day, year after year. Both questions have true answers, and they do not have to agree with each other. Today you get the two words for those two questions, and by the end you can take one reported fact and say right away which question it answers.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-weather-and-climate',
      kind: 'concept',
      goal: 'Install the weather/climate distinction by time span, and establish that a climate description does not predict any single day.',
      keyIdeas: [
        'WEATHER IS WHAT THE ATMOSPHERE IS DOING AT ONE PLACE, RIGHT NOW OR OVER A FEW DAYS. Is it raining. Is it sunny. Is it windy, hot, or cold. Weather is whatever the sky and the air are actually doing today, this week, or on any other short stretch of time you can point to.',
        'CLIMATE IS THE PATTERN OF WEATHER A PLACE USUALLY HAS, YEAR AFTER YEAR. It is not what the atmosphere is doing on one day. It is the kind of weather a place is known for overall, once you look at that place across many years rather than any single day among them.',
        'A PLACE CAN HAVE ONE KIND OF CLIMATE AND STILL HAVE A DAY THAT DOES NOT MATCH IT. A place known for a warm, sunny climate can still have one cold, rainy day. That day is real weather, and it does not change what the place\'s climate is, because a climate description is about the pattern overall, not about any single day picked out of it.',
        'THE SAME PLACE CAN BE TRUTHFULLY DESCRIBED BOTH WAYS AT ONCE. Saying a place\'s climate is dry does not mean it never rains there, and saying it rained there today does not mean the place\'s climate is not dry. Weather and climate answer two different questions about the very same place, and neither answer cancels the other out.',
        'TO TELL THE TWO APART, ASK ONE QUESTION: IS THIS ABOUT RIGHT NOW OR A FEW DAYS, OR IS THIS ABOUT THE PATTERN A PLACE IS USUALLY LIKE? A short stretch of time, however unusual, is weather. The usual pattern, the kind of weather the place is known for overall, is climate.',
      ],
      vocabulary: [
        { term: 'weather', definition: 'the condition of the atmosphere -- such as temperature, rain, wind, or sunshine -- at one place, right now or over a few days.' },
        { term: 'climate', definition: 'the pattern of weather a place usually has, year after year.' },
        { term: 'pattern', definition: 'something that happens in a similar way over and over, rather than just one time.' },
        { term: 'forecast', definition: 'a prediction of what the weather will do in the near future, such as tomorrow or later this week.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-one-report-one-moment',
      kind: 'worked_example',
      problem:
        "A radio announcer says: \"It is windy and 14 degrees Celsius in Baytown right now.\" Baytown is usually known for calm, mild weather all year. Is the announcer's statement about Baytown's weather or its climate?",
      steps: [
        "Ask the one question first: does the statement describe right now (or a few days), or does it describe the pattern Baytown is usually like? The announcer says \"right now,\" which names one single moment.",
        'A statement naming one moment is weather, not climate, no matter what the actual conditions are. It does not matter that windy and 14 degrees is different from Baytown\'s usual calm, mild pattern -- the statement is still reporting what the atmosphere is doing at this one moment.',
        'Separate that from what is already known about Baytown. "Usually known for calm, mild weather all year" describes the pattern Baytown has overall, which is climate, not weather.',
        'So the two sentences describe two different things about the same place: one describes its weather right now, and the other describes its climate. They are not two competing answers to one question -- they are answers to two different questions.',
        'Check the answer with a contrasting case. If Baytown had windy, 14-degree days like this one nearly every week, all year, every year, that repeated pattern would actually belong in a description of Baytown\'s climate, not just in a report of one day\'s weather. One windy day is weather. The same kind of day happening over and over, year after year, is what a climate pattern is made of.',
      ],
      answer:
        "The announcer's statement is about Baytown's weather -- it names what the atmosphere is doing right now, at one moment. The description of Baytown as usually calm and mild is about its climate. One windy, cool moment does not change what Baytown's climate is.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-claims-two-mistakes',
      kind: 'worked_example',
      problem:
        'A student says: "Rimwood has a cold, snowy climate, so it must be snowing there right now. And Sandy Cove had one very hot week last month, so Sandy Cove\'s climate must be hot." Both sentences make a mistake. Find the mistake in each one and correct it.',
      steps: [
        'Take the Rimwood sentence first. WRONG: "Rimwood has a cold, snowy climate, so it must be snowing there right now." Knowing a place\'s climate tells you the pattern it usually has, not what the atmosphere is doing at this exact moment.',
        'CORRECT: a place with a cold, snowy climate can still have a day that is not snowing. Climate describes the pattern overall; it does not describe every single day.',
        'Now take the Sandy Cove sentence. WRONG: "Sandy Cove had one very hot week last month, so Sandy Cove\'s climate must be hot." One week, however hot, is a short stretch of time -- that makes it weather, not a description of the pattern Sandy Cove has overall.',
        'CORRECT: to say anything about Sandy Cove\'s climate, you would need to know what kind of weather it usually has, year after year, not just what happened during one week.',
        'Name the mistake both sentences share: each one treats one side of the question as if it settles the other side -- knowing the climate as if it settles today\'s weather, and knowing one week\'s weather as if it settles the climate. The two questions have to be answered separately.',
        'Check with a contrasting case. If Sandy Cove had a very hot week like that nearly every year, in the same season, that repeated pattern would actually belong in a description of Sandy Cove\'s climate. One hot week is weather. The same kind of week happening again and again, year after year, is what turns into a climate pattern.',
      ],
      answer:
        "Rimwood's cold, snowy climate does not mean it is snowing there right now -- that would need a weather report, not a climate description. Sandy Cove's one hot week is weather, not proof that its climate is hot; a climate description needs the pattern that repeats year after year, not a single week.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-report-about-one-moment',
      kind: 'try_yourself',
      problem:
        "A radio announcer says: \"It is windy and 14 degrees Celsius in Baytown right now.\" Baytown is usually known for calm, mild weather all year. Which does that statement describe?",
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: "Weather, because the statement describes what the atmosphere is doing in Baytown at this one moment, not the pattern Baytown usually has.",
          correct: true,
        },
        {
          id: 'b',
          text: 'Climate, because the statement gives an exact number, and only a climate description would use an exact number.',
        },
        {
          id: 'c',
          text: 'Climate, because Baytown usually has calm, mild weather, and windy conditions are close enough to that pattern to count as part of it.',
        },
        {
          id: 'd',
          text: 'Neither one, because a single report about right now cannot be classified as either weather or climate.',
        },
      ],
      expectedAnswer:
        'Weather, because the statement describes what the atmosphere is doing in Baytown at this one moment, not the pattern Baytown usually has.',
      hints: [
        'Ask whether the statement describes what is happening at one moment, or the pattern the place is usually known for.',
        'A report of "right now" names one moment in time. It does not need to match the place\'s usual pattern to still count as a real weather report.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-afternoon-is-evidence-about',
      kind: 'try_yourself',
      problem:
        'Riverton is known as a place with a warm, sunny climate. One afternoon in Riverton, a sudden thunderstorm brings heavy rain and the temperature drops sharply for a few hours. What is that thunderstorm afternoon evidence about?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: "It is evidence that Riverton's warm, sunny climate has already changed into a wetter one.",
        },
        {
          id: 'b',
          text: "It is evidence that the earlier description of Riverton's climate as warm and sunny must have been wrong from the start.",
        },
        {
          id: 'c',
          text: 'It is evidence that every afternoon in Riverton will now bring a similar thunderstorm.',
        },
        {
          id: 'd',
          text: "It is evidence about Riverton's weather that afternoon, and it does not change the description of Riverton's climate.",
          correct: true,
        },
      ],
      expectedAnswer:
        "It is evidence about Riverton's weather that afternoon, and it does not change the description of Riverton's climate.",
      hints: [
        'Ask what span of time the thunderstorm actually covers: one afternoon, or the many years that make up a climate pattern.',
        'One afternoon, however dramatic, is not the same as the long pattern that makes up a place\'s climate. It is still just one afternoon.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weather-climate-fill-in',
      kind: 'try_yourself',
      problem: 'Which pair correctly completes this sentence? Weather describes ___, and climate describes ___.',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'the pattern a place is known for over many years; what the atmosphere is doing at one place right now',
        },
        {
          id: 'b',
          text: 'what the atmosphere is doing at one place right now or over a few days; the pattern of weather a place usually has, year after year',
          correct: true,
        },
        {
          id: 'c',
          text: 'how strong the wind is blowing today; how strong the wind usually blows on that very same day',
        },
        {
          id: 'd',
          text: 'a forecast of what tomorrow will be like; a forecast of what next year will be like',
        },
      ],
      expectedAnswer:
        'what the atmosphere is doing at one place right now or over a few days; the pattern of weather a place usually has, year after year',
      hints: [
        'Weather covers a short span of time -- right now or a few days. Climate covers a long span -- the pattern a place usually has, year after year.',
        'Look for the pair where the first blank names the short span and the second blank names the long-term pattern, in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-climate-as-a-guarantee',
      kind: 'misconception_check',
      question:
        'A student says: "Foxhollow has a sunny climate, so it must be sunny outside right now. Also, the forecast says it will rain for the next four days, so Foxhollow\'s climate must actually be rainy." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: 'Foxhollow has a sunny climate, so it must be sunny outside right now.',
          misconception:
            'Treating knowledge of a place\'s usual climate pattern as if it guarantees what the weather is doing on one particular day.',
          correctsTo:
            'Knowing a place\'s climate tells you the pattern it usually follows, not what is happening on one particular day. A place with a sunny climate can still have a cloudy or rainy day sometimes, and that day is weather -- it does not contradict the climate description. WRONG: "a sunny climate means it must be sunny right now." CORRECT: "a sunny climate means sunny days are the usual pattern there, but any single day can still turn out differently."',
        },
        {
          answer: "The forecast says it will rain for the next four days, so Foxhollow's climate must actually be rainy.",
          misconception:
            'Treating a short forecast, even one covering several days, as if it were long enough to describe the pattern a place usually has.',
          correctsTo:
            'A four-day forecast describes what the atmosphere is expected to do over a few days, which is still weather, no matter how many days it covers. Climate describes the pattern a place has year after year, not what is forecast for this week. WRONG: "a four-day rainy forecast changes Foxhollow\'s climate." CORRECT: "a four-day forecast is still weather; only the pattern found across many years counts as climate."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weather is what the atmosphere is doing at one place, right now or over a few days.',
        'Climate is the pattern of weather a place usually has, year after year.',
        'A place can have a certain climate and still have a day of weather that does not match it.',
        'Knowing a place\'s climate does not tell you what the weather is doing on any single day, and knowing today\'s weather does not tell you what the place\'s climate is.',
        'A forecast, even one covering several days, is still weather, not climate.',
        'To decide whether a statement is about weather or climate, ask whether it describes right now (or a few days) or the pattern a place is known for, year after year.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Weather vs. Climate' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
