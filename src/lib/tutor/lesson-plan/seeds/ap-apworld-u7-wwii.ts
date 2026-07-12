/**
 * AP World History: Modern — CED Unit 7.7: World War II as a Global War.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (a
 * sequence of unanswered aggressions, not a single 1939 starting point,
 * escalated into a war fought across multiple global theaters, again
 * through colonial manpower and civilian home fronts, and ending in the
 * Holocaust and the atomic bombings); worked_example = close reading of
 * FDR's Four Freedoms speech as a wartime statement of universal aims;
 * try_yourself = a 3-point SAQ-style short-answer.
 *
 * REUSE anchor text: FDR's Four Freedoms speech (1941) —
 * evelyn.passage.apush-four-freedoms.v1 (cross-course reuse from the APUSH
 * fan-out; resolves from the shared passage registry). Quoted only as the
 * excerpt already seeded. The Holocaust and atomic-bomb decision are
 * presented factually and measuredly, per the block spec.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_WWII: LessonPlan = {
  id: 'evelyn.ap.apworld.wwii-global.v1',
  title: 'U7.7 World War II as a Global War',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.wwii-global',
      description:
        'Explain the sequence of aggressions that led to World War II, its conduct as a global war across multiple theaters involving colonial manpower and civilian home fronts, the Holocaust, and the atomic bombings that ended the war, 1931-1945.',
      standard: 'AP-APWORLD-7.7',
    },
  ],
  prerequisites: ['apworld.interwar-world'],
  followUps: ['apworld.conflict-legacies'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Push back on 1939 as a single, universal start date for WWII, and frame the war as a genuinely global conflict fought across multiple theaters and home fronts.',
      script:
        "Most timelines mark World War II's start as September 1939, when Germany invaded Poland. For a large part of the world, that date is simply wrong. Japan had already invaded Manchuria eight years earlier, in 1931, and was fighting a full-scale war against China from 1937 — years before a single German soldier crossed into Poland. World War II wasn't one war that suddenly started in 1939; it was a sequence of unanswered aggressions, stretching back to the start of the decade, that eventually merged into a single global conflict fought across Europe, North Africa, the Atlantic, the Eastern Front, and the Pacific — mobilizing colonial manpower once again, and ending with two of the most consequential and morally fraught events of the century.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-wwii-global',
      kind: 'concept',
      goal: "Explain the sequence of aggressions that escalated into WWII, the war's global theaters and colonial manpower and home fronts, the Holocaust, and the debated atomic-bomb decision that ended the war.",
      keyIdeas: [
        "THE AGGRESSION SEQUENCE began years before 1939. JAPAN invaded Manchuria in 1931, establishing the puppet state of Manchukuo, and began a full-scale war against China in 1937 (following the Marco Polo Bridge Incident) — Asia's war, in other words, was already underway. ITALY invaded Ethiopia in 1935 under Mussolini, in defiance of ineffective League of Nations sanctions. Germany's escalating demands culminated in the MUNICH CONFERENCE (1938), where Britain and France, pursuing a policy of APPEASEMENT, allowed Hitler to annex the Sudetenland (part of Czechoslovakia) in exchange for a promise of no further territorial demands — a promise Hitler broke within months. Germany's invasion of Poland (September 1939) is the conventional start date for the WAR IN EUROPE specifically, not for the war worldwide.",
        'GLOBAL THEATERS eventually connected these separate conflicts into a single world war: the EUROPEAN THEATER (including Germany\'s June 1941 invasion of the USSR, Operation Barbarossa, opening the enormous EASTERN FRONT), NORTH AFRICA, and the PACIFIC THEATER, which expanded dramatically after Japan\'s attack on Pearl Harbor (December 1941) brought the United States fully into the war and Japan rapidly seized territory across Southeast Asia and the Pacific.',
        'COLONIAL MANPOWER was mobilized again, on an even larger scale than in WWI: the British Indian Army alone grew to roughly 2.5 million volunteers by the war\'s end, the largest all-volunteer force in history, fighting across the Middle East, North Africa, and Southeast Asia. Free French forces fighting from exile relied heavily on troops recruited from French colonial territories in Africa.',
        'HOME FRONTS were mobilized worldwide: belligerent states redirected industry to war production, rationed civilian consumption, and drew women into industrial labor on an unprecedented scale — a global intensification of the total-war pattern already seen in WWI. FDR\'s Four Freedoms speech (January 1941), delivered before the United States formally entered the war, framed the Allied cause in explicitly universal, moral terms: freedom of speech and expression, freedom of worship, freedom from want, and freedom from fear, for "everywhere in the world" — read closely in the worked example below.',
        'THE HOLOCAUST was Nazi Germany\'s systematic murder of six million Jews and millions of others (including Roma, disabled people, political prisoners, and Slavic civilians), carried out through a documented, bureaucratically organized state campaign as Germany occupied much of Europe — presented here factually and without graphic detail, as the era\'s defining atrocity.',
        'THE ATOMIC-BOMB DECISION remains a genuinely debated historical question, not a settled verdict. Facing the prospect of a costly invasion of Japan\'s home islands, President Truman authorized atomic bombings of Hiroshima (6 August 1945) and Nagasaki (9 August 1945). Some historians argue the bombings were necessary to end the war quickly and avoid enormous further casualties from an invasion; others argue Japan was already close to surrender, or that the bombings were partly intended to demonstrate American power to the Soviet Union. Both positions rest on real historical evidence, and the debate remains open.',
        "THE WAR'S END came in stages: Germany surrendered in May 1945 (VE Day), and Japan formally surrendered in September 1945 (following the atomic bombings and the Soviet Union's entry into the Pacific war), bringing the global conflict to a close.",
      ],
      vocabulary: [
        {
          term: 'appeasement',
          definition:
            "Britain and France's policy of conceding to escalating German demands (culminating in the 1938 Munich Conference's cession of the Sudetenland) in hopes of avoiding another war — a policy that failed to prevent further German aggression.",
        },
        {
          term: 'Eastern Front',
          definition:
            "the enormous theater of war opened by Germany's June 1941 invasion of the Soviet Union (Operation Barbarossa), which became the war's largest and most costly land theater.",
        },
        {
          term: 'the Holocaust',
          definition:
            'Nazi Germany\'s systematic murder of six million Jews and millions of others (Roma, disabled people, political prisoners, Slavic civilians) during World War II, carried out through a documented, bureaucratically organized state campaign.',
        },
        {
          term: 'the atomic-bomb decision',
          definition:
            "President Truman's 1945 authorization of atomic bombings on Hiroshima and Nagasaki to end the war — a decision historians continue to debate as necessary to avoid a costly invasion versus unnecessary given Japan's weakening position.",
        },
      ],
      passageId: 'evelyn.passage.apush-four-freedoms.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-four-freedoms',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from FDR\'s Annual Message to Congress (6 January 1941): "In the future days, which we seek to make secure, we look forward to a world founded upon four essential human freedoms. The first is freedom of speech and expression—everywhere in the world. The second is freedom of every person to worship God in his own way—everywhere in the world. The third is freedom from want—which, translated into world terms, means economic understandings which will secure to every nation a healthy peacetime life for its inhabitants-everywhere in the world. The fourth is freedom from fear—which, translated into world terms, means a world-wide reduction of armaments to such a point and in such a thorough fashion that no nation will be in a position to commit an act of physical aggression against any neighbor—anywhere in the world." What do these four freedoms reveal about how Allied war aims were framed, and how do they connect to the crises of the preceding decade?',
      steps: [
        'SOURCE IT FIRST. Delivered by President Roosevelt to Congress on 6 January 1941 — nearly a year before Pearl Harbor and formal US entry into the war, while the United States was still formally neutral but already supplying Britain under Lend-Lease.',
        'IDENTIFY THE FOUR FREEDOMS AND THEIR SCOPE. Freedom of speech and expression, freedom of worship, freedom from want, and freedom from fear are each explicitly stated to apply "everywhere in the world" or "anywhere in the world" — a deliberately universal, not merely American, framing of the postwar goal.',
        'CONNECT "FREEDOM FROM WANT" TO THE PREVIOUS DECADE. FDR defines freedom from want as requiring "economic understandings which will secure to every nation a healthy peacetime life" — language that directly answers the previous topic\'s Depression-era economic nationalism (autarky, beggar-thy-neighbor trade policy) by imagining a postwar international economic order built on cooperation rather than competitive self-sufficiency.',
        'CONNECT "FREEDOM FROM FEAR" TO THE AGGRESSION SEQUENCE. FDR defines freedom from fear as "a world-wide reduction of armaments" sufficient that "no nation will be in a position to commit an act of physical aggression against any neighbor" — a direct response to the decade of unanswered aggression (Manchuria, Ethiopia, the Sudetenland) that the speech implicitly indicts.',
        'WEIGH THE PARALLEL TO WILSON\'S FOURTEEN POINTS. Like Wilson\'s 1918 address, FDR\'s speech is an idealistic statement of principles issued DURING an ongoing war (though before formal US entry, unlike Wilson\'s January 1918 timing, which came after nearly four years of US neutrality then involvement) — a reminder that such statements express aspirations for the peace to come, not guarantees; whether the postwar order fulfills them is a separate historical question, as the Fourteen Points/mandate-system gap already showed.',
        'STATE THE LINK TO THE COURSE THESIS. The Four Freedoms speech shows the Allied cause being framed in universal moral terms — freedom from want answering Depression-era economic nationalism, freedom from fear answering a decade of unanswered aggression — even before the US formally entered the war, exactly the kind of idealistic wartime statement of aims that this unit has already shown can diverge sharply from the postwar settlement that follows it.',
      ],
      answer:
        'FDR\'s Four Freedoms speech (January 1941) frames the Allied cause in explicitly universal terms — each freedom applies "everywhere" or "anywhere in the world," not just to the United States. "Freedom from want," defined as securing "a healthy peacetime life" through international "economic understandings," directly answers the previous decade\'s Depression-driven economic nationalism (autarky, collapsed trade). "Freedom from fear," defined as worldwide disarmament sufficient to prevent aggression, directly answers the decade\'s unanswered aggressions (Manchuria, Ethiopia, the Sudetenland). Like Wilson\'s Fourteen Points, this is an idealistic wartime statement of postwar aims, issued (in this case) even before US formal entry into the war — and, as the Fourteen Points/mandate-system gap already demonstrated in this unit, such statements express hopes for the peace to come, not a guarantee of what the actual postwar settlement will deliver.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE event in the sequence of aggressions that led to World War II. (b) Explain ONE way World War II was fought as a truly global war (theaters or colonial manpower). (c) Explain ONE reason historians continue to debate the atomic-bomb decision.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine event in the aggression sequence — e.g. Japan\'s invasion of Manchuria (1931), Italy\'s invasion of Ethiopia (1935), the Munich Conference/appeasement (1938), or Germany\'s invasion of Poland (1939). No credit for a vague statement with no identifiable specific event.',
            modelResponse:
              "One event in the sequence of aggressions leading to World War II was Japan's 1931 invasion of Manchuria, which established the puppet state of Manchukuo years before the war in Europe began.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way WWII was a global war — e.g. multiple theaters (Eastern Front, Pacific, North Africa) or colonial manpower (the British Indian Army). No credit for a vague or unsupported claim.',
            modelResponse:
              'World War II was fought as a global war in part because the British Indian Army grew to roughly 2.5 million volunteers, the largest all-volunteer force in history, fighting across the Middle East, North Africa, and Southeast Asia.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate reason the atomic-bomb decision remains debated — e.g. disagreement over whether Japan was already near surrender, or whether the bombings partly aimed to signal power to the USSR, versus the argument that they avoided a costly invasion. No credit for a vague or unsupported claim.",
            modelResponse:
              'Historians continue to debate the atomic-bomb decision because while some argue the bombings were necessary to avoid the massive casualties an invasion of Japan\'s home islands would have caused, others argue Japan was already close to surrender or that the bombings were partly meant to demonstrate American power to the Soviet Union.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-1939-everywhere',
      kind: 'misconception_check',
      question:
        'True or false: World War II began in 1939 everywhere in the world.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating Germany's September 1939 invasion of Poland as the war's universal start date, missing that Asia's war against Japanese aggression had already been underway for years.",
          correctsTo:
            "FALSE. Japan invaded Manchuria in 1931 and began a full-scale war against China in 1937 — both years before Germany invaded Poland in September 1939. 1939 marks the conventional start of the war IN EUROPE, not a universal starting point; for large parts of Asia, the war against Japanese aggression had already been underway for years. Understanding World War II as a genuinely global conflict means recognizing it emerged from a sequence of separate, unanswered aggressions (Manchuria 1931, Ethiopia 1935, the Sudetenland 1938, Poland 1939) that eventually merged, rather than a single event with one universal start date.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The aggression sequence began years before 1939: Japan's invasion of Manchuria (1931) and full-scale war with China (1937), Italy's invasion of Ethiopia (1935), and the Munich Conference/appeasement (1938) all preceded Germany's invasion of Poland.",
        'The war spanned multiple global theaters (Eastern Front, North Africa, Pacific) and mobilized colonial manpower again — the British Indian Army alone grew to roughly 2.5 million volunteers.',
        "FDR's Four Freedoms speech (January 1941) framed Allied war aims in universal terms, answering both Depression-era economic nationalism (freedom from want) and the decade's unanswered aggressions (freedom from fear).",
        'The Holocaust — the systematic murder of six million Jews and millions of others — was Nazi Germany\'s defining atrocity, carried out through a documented, organized state campaign.',
        'The atomic bombings of Hiroshima and Nagasaki (August 1945) ended the war but remain a genuinely debated historical decision, not a settled verdict.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.7',
    cedTitle: 'World War II as a Global War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-four-freedoms.v1',
        chapter: '1941',
        note: "FDR's Four Freedoms speech (cross-course reuse from the APUSH fan-out) — anchor for the universal framing of Allied war aims.",
      },
    ],
  },
};
