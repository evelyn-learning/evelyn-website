/**
 * AP World History: Modern — CED Unit 7.4-7.6: The Great Depression and
 * the Interwar Crisis.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (the
 * Great Depression transmitted globally through trade and commodity
 * economies, not just industrial ones; interwar states responded with
 * economic nationalism and, in several cases, authoritarian
 * consolidation; and the war's unfulfilled promises fed a new wave of
 * anti-imperial political ferment); worked_example = reading a described
 * data table; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor stimulus: described Great Depression indicators data table —
 * evelyn.passage.apworld-depression-table.v1. Gandhi's Salt March, the May
 * Fourth Movement, and Ho Chi Minh's 1919 petition are covered by
 * DESCRIPTION only — zero quoted text, per the copyright/authored-summary
 * rule for post-1928 non-government or unauthenticated-quote material.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_INTERWAR: LessonPlan = {
  id: 'evelyn.ap.apworld.interwar-world.v1',
  title: 'U7.4 The Great Depression and the Interwar Crisis',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.interwar-world',
      description:
        "Explain the Great Depression's global economic transmission and the economic-nationalist responses to it, the rise of fascist, Stalinist, and militarist political movements, and the anti-imperial political ferment of the interwar period, 1929-1939.",
      standard: 'AP-APWORLD-7.4',
    },
  ],
  prerequisites: ['apworld.wwi-global'],
  followUps: ['apworld.wwii-global'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Push back on the assumption that the Great Depression was only an American or industrial-world crisis, and preview the political radicalization and anti-imperial ferment it fed.",
      script:
        "It's easy to picture the Great Depression as a story about American breadlines and bank failures. That story is true, but it is a small part of a much larger one: a credit contraction that began on Wall Street collapsed world trade so severely that farmers and miners producing rubber, coffee, copper, and wheat on the other side of the planet — in colonies and independent countries alike — lost their livelihoods within a few years. That global economic shock did two things at once: it pushed several major states toward authoritarian, state-directed politics, and it gave colonized peoples, who had already watched the WWI peace settlement betray its own promises, new energy for organized resistance to imperial rule. Today's topic covers both halves of that story.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-interwar-world',
      kind: 'concept',
      goal: "Explain the Great Depression's global transmission through trade collapse and commodity economies, the economic-nationalist and authoritarian responses to it, and the anti-imperial political movements the interwar crisis fed.",
      keyIdeas: [
        'THE GREAT DEPRESSION began with the US stock market crash (October 1929) and the credit contraction that followed, but its effects were not confined to industrial economies. The described data table for this topic shows world trade, measured in gold value, contracting by roughly 66 percent between 1929 and 1934 — falling to about ONE-THIRD of its 1929 level — a collapse that hit economies dependent on exporting commodities like rubber, coffee, copper, and wheat just as hard as it hit industrial manufacturing.',
        "THE SAME TABLE shows comparable industrial-country severity: US unemployment reached 24.9 percent in 1933 (the depression's American trough year), while German unemployment reached roughly 30 percent by 1932 — figures that make clear this was a single, US-centered credit contraction transmitted worldwide through trade and finance, not two unrelated national crises.",
        'ECONOMIC-NATIONALIST RESPONSES varied by region. In the United States, the New Deal (a set of federal relief, recovery, and reform programs, covered in the AP US History course) expanded the state\'s role in managing the economy. In Latin America, many states pursued IMPORT SUBSTITUTION INDUSTRIALIZATION (ISI): with export earnings collapsed and imports suddenly unaffordable, countries like Brazil and Mexico invested in building their own domestic industries to replace goods they could no longer profitably import. Germany and other states moved toward AUTARKY — deliberate national economic self-sufficiency — to insulate themselves from a global trading system that had just proven catastrophically fragile.',
        "THE DEPRESSION ALSO FED AUTHORITARIAN CONSOLIDATION in several major states, in each case building on the economic crisis (measured, factual — not treated as the sole cause of any of these regimes). In the USSR, Stalin's FIRST FIVE-YEAR PLAN (launched 1928, just before the Depression, but continuing through it) pursued forced, state-directed rapid industrialization and agricultural collectivization at immense human cost, including a severe famine. In Germany, worsening Depression-era unemployment and political instability were part of the context in which Adolf Hitler was appointed chancellor in 1933 and rapidly consolidated dictatorial power. In Japan, militarist factions within the government and military gained growing political influence during the Depression years, citing economic hardship and resource scarcity to help justify an expansionist foreign policy that had already produced the 1931 invasion of Manchuria — a first step examined further as part of the aggression sequence in the next topic.",
        "GANDHI'S SALT MARCH (1930, described here; his writings are not quoted) was a mass, deliberately non-violent campaign in which Mohandas Gandhi led a march to the Indian coast to produce salt in open defiance of the British colonial government's salt tax and production monopoly — a symbolic act of civil disobedience that sparked a much broader nationwide movement against British rule in India.",
        'THE MAY FOURTH MOVEMENT (1919, described here) began when Chinese students and intellectuals protested the Paris Peace Conference\'s decision to transfer Germany\'s former concessions in Shandong province to Japan rather than returning them to China — a decision widely seen in China as yet another instance of the great powers disregarding Chinese sovereignty. The protests grew into a broader nationalist and cultural movement critical of both foreign imperialism and China\'s own weak warlord-era government.',
        "HO CHI MINH'S PETITION (1919, described here; not quoted) was a set of demands a young Vietnamese nationalist later known as Ho Chi Minh submitted to the Paris Peace Conference, invoking Wilson's own stated principle of self-determination to call for basic civil rights and greater political voice for the Vietnamese people under French colonial rule. The petition was not taken up by the conference — one more instance of the gap between wartime promises and postwar treatment of colonized peoples that fed interwar anti-imperial organizing.",
      ],
      vocabulary: [
        {
          term: 'import substitution industrialization (ISI)',
          definition:
            'an economic strategy, widely adopted in interwar Latin America, of building domestic industries to replace imported goods that had become unaffordable after the collapse of export earnings and global trade.',
        },
        {
          term: 'autarky',
          definition:
            'a policy of deliberate national economic self-sufficiency, pursued by Germany and other interwar states seeking to insulate themselves from a global trading system that had proven catastrophically fragile during the Great Depression.',
        },
        {
          term: 'Five-Year Plan',
          definition:
            "Stalin's state-directed program (first launched 1928) of forced rapid industrialization and agricultural collectivization in the USSR, achieved at immense human cost, including a severe famine.",
        },
        {
          term: 'Salt March (1930)',
          definition:
            "Gandhi's mass, non-violent march to the Indian coast to produce salt in defiance of the British colonial salt tax and monopoly, sparking a broader civil disobedience movement against British rule.",
        },
      ],
      passageId: 'evelyn.passage.apworld-depression-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-depression-table',
      kind: 'worked_example',
      problem:
        "Read this data table: Great Depression indicators, 1929-1934. Row one: world trade, measured by gold value, fell by roughly 66 percent between 1929 and 1934, to about one-third of its 1929 level. Row two: US unemployment rose from about 3 percent in 1929 to 24.9 percent in 1933. Row three: German unemployment rose to roughly 30 percent by 1932. What does this table reveal about the claim that the Great Depression was mainly an industrial-country crisis, and what should a careful reader keep in mind about how to use it?",
      steps: [
        'SOURCE THE TABLE. What is being measured, over what period? The table combines a world-trade indicator (gold-value contraction, 1929-1934) with two national unemployment rates (US, trough year 1933; Germany, 1932) — three distinct but related measures of the same underlying credit and trade contraction.',
        'READ ROW ONE CAREFULLY. World trade fell by roughly two-thirds of its 1929 gold value by 1934. This is not just an industrial-country statistic — falling world trade meant collapsing prices for globally traded commodities like rubber, coffee, copper, and wheat, the export goods many colonial and Latin American economies depended on for income, regardless of whether those economies had large industrial sectors of their own.',
        'READ ROWS TWO AND THREE TOGETHER. US unemployment (24.9% in 1933) and German unemployment (roughly 30% in 1932) were each severe, and comparably so, despite the two countries having very different political systems and starting from different economic conditions — evidence that a single US-centered credit contraction was transmitted through trade and finance to other major economies, not that the US and Germany independently suffered unrelated crises.',
        "STATE THE TABLE'S SCOPE PRECISELY. This table's three rows measure trade and industrial-country unemployment; it does not itself provide separate figures for commodity-dependent colonial or Latin American economies. Row one's trade-collapse figure is the table's own evidence that the crisis reached those economies too, even though the table does not tabulate them individually.",
        "CONNECT TO THE CONCEPT. Taken together, the table refutes any claim that the Depression was mainly, let alone only, an industrial-country crisis: the same trade collapse that produced comparable mass unemployment in the US and Germany also collapsed the export earnings of commodity-dependent economies worldwide, helping explain why economic-nationalist responses (ISI in Latin America, autarky in Germany) and authoritarian political shifts appeared across such a wide range of very different societies in the same few years.",
      ],
      answer:
        "The table shows a single, US-centered credit contraction transmitted worldwide: world trade's roughly 66 percent gold-value collapse (1929-1934) meant falling prices for exported commodities like rubber, coffee, copper, and wheat, hitting colonial and Latin American economies dependent on those exports, while comparably severe unemployment in the US (24.9% in 1933) and Germany (roughly 30% in 1932) shows the crisis reaching two very different industrial economies through the same mechanism. A careful reader should note the table itself does not separately tabulate commodity-exporting economies' unemployment — but its trade-collapse row is direct evidence the crisis reached them too. Together, the rows refute the claim that the Depression was mainly an industrial-country crisis, and help explain why economic-nationalist responses (ISI in Latin America, autarky in Germany) and authoritarian political shifts appeared across such different societies within the same few years.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE economic-nationalist response to the Great Depression (e.g. the New Deal, import substitution industrialization, or autarky). (b) Explain ONE way the Depression\'s global transmission shows it was not confined to industrialized countries. (c) Explain ONE example of anti-imperial political ferment during the interwar period (e.g. the Salt March, the May Fourth Movement, or Ho Chi Minh\'s petition).',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine economic-nationalist response — e.g. the New Deal, import substitution industrialization (ISI), or autarky. No credit for a vague statement with no identifiable specific response.',
            modelResponse:
              'One economic-nationalist response to the Great Depression was import substitution industrialization, adopted by countries like Brazil and Mexico to build domestic industries replacing imports they could no longer afford.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the Depression reached beyond industrialized countries — e.g. the collapse of world trade in commodities like rubber, coffee, copper, or wheat harming export-dependent colonial or Latin American economies. No credit for a vague or unsupported claim.',
            modelResponse:
              "The Depression reached far beyond industrialized countries because the roughly 66 percent gold-value collapse in world trade (1929-1934) crashed prices for exported commodities like rubber, coffee, copper, and wheat, devastating colonial and Latin American economies that depended on those exports for income.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies and briefly explains ONE genuine anti-imperial movement or action of the interwar period — e.g. the Salt March, the May Fourth Movement, or Ho Chi Minh\'s 1919 petition. No credit for a vague or unsupported claim.',
            modelResponse:
              "One example of interwar anti-imperial ferment was Gandhi's 1930 Salt March, in which he led a mass march to the Indian coast to produce salt in defiance of the British colonial salt monopoly, sparking a broader civil disobedience campaign against British rule.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-industrial-only',
      kind: 'misconception_check',
      question:
        "True or false: the Great Depression's effects were largely confined to industrialized countries like the United States and Germany.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Focusing only on the US and German unemployment figures most often taught, missing that the same trade collapse devastated commodity-exporting colonial and Latin American economies that were not primarily industrial at all.",
          correctsTo:
            'FALSE. World trade\'s roughly 66 percent gold-value collapse between 1929 and 1934 crashed prices for globally traded commodities — rubber, coffee, copper, wheat — on which many colonial and Latin American economies depended for export income, regardless of how industrialized those economies were. The Depression\'s comparably severe unemployment in the US (24.9% in 1933) and Germany (roughly 30% in 1932) reflects the SAME underlying credit and trade contraction that also devastated commodity-exporting economies worldwide, driving several of them toward import substitution industrialization as a defensive response. Treating the Depression as an industrial-country story alone misses its truly global economic reach.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "World trade's roughly 66 percent gold-value collapse (1929-1934) transmitted the Depression globally, hitting commodity-exporting colonial and Latin American economies as hard as industrial ones.",
        'US unemployment reached 24.9% in 1933; German unemployment reached roughly 30% by 1932 — comparable severity from the same US-centered credit contraction.',
        'Responses included the New Deal (US), import substitution industrialization (Latin America), and autarky (Germany and others).',
        "The Depression fed authoritarian consolidation — Stalin's Five-Year Plans (from 1928), Hitler's 1933 appointment as chancellor, and growing militarist influence in Japan — each building on economic crisis, not caused by it alone.",
        "Anti-imperial ferment grew alongside the crisis: Gandhi's Salt March (1930), the May Fourth Movement (1919), and Ho Chi Minh's 1919 petition to Paris each responded to the gap between WWI-era promises and colonial reality — described here, never quoted.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.4-7.6',
    cedTitle: 'The Great Depression and the Interwar Crisis',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-depression-table.v1',
        chapter: '1929-1934',
        note: 'Great Depression indicators (data table) — anchor stimulus for reading a described data table showing global transmission.',
      },
    ],
  },
};
