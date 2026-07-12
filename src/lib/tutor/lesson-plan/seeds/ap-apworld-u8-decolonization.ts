/**
 * AP World History: Modern — CED Unit 8.5-8.6: Decolonization.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). Covers the collapse
 * of European empires after 1945 across very different paths — negotiated
 * (Ghana) versus violent (Algeria, Kenya) versus Cold-War-entangled
 * (Vietnam) — with India/Pakistan's 1947 partition as the era's largest and
 * bloodiest transfer of sovereignty, and the "Year of Africa" (1960) as the
 * decade's single largest wave of new independent states.
 *
 * Anchor text: the UN's own published membership-growth roster, described
 * as a data table — evelyn.passage.apworld-un-membership-table.v1 — wired
 * in both the concept (as quantitative evidence of decolonization's pace)
 * and the worked example (a close read of the table's largest single-year
 * jump). Gandhi, Nehru, and Nkrumah are DESCRIBED throughout with ZERO
 * quoted text, per the copyright discipline for post-1928 landmark figures.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_DECOLONIZATION: LessonPlan = {
  id: 'evelyn.ap.apworld.decolonization.v1',
  title: 'U8.5-8.6 Decolonization',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.decolonization',
      description:
        'Explain the causes and varied paths of decolonization after 1945 — negotiated, violent, and Cold-War-entangled — including India/Pakistan\'s partition, Ghana\'s and Algeria\'s contrasting independence movements, and the Suez Crisis as a marker of European imperial decline.',
      standard: 'AP-APWORLD-8.5',
    },
  ],
  prerequisites: ['apworld.cold-war-global'],
  followUps: ['apworld.new-states'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that decolonization was not one uniform process — the SAME goal (ending colonial rule) was reached through dramatically different, and sometimes far more violent, paths.',
      script:
        "Between 1945 and the early 1960s, dozens of countries across Asia and Africa went from colonies to independent, UN-recognized states — one of the fastest reorganizations of the world map in history. It's tempting to picture this as one single story: empires got tired, colonies asked for independence, independence was granted. That story is true for some places. It is badly wrong for others. In Ghana, a largely political movement negotiated independence with remarkably little bloodshed. In Algeria, at almost the same moment, achieving the same goal required an eight-year war that killed hundreds of thousands. In India and Pakistan, independence itself came with a partition so violent it displaced roughly fifteen million people. Today we're tracing WHY the same historical process — the end of European empire — took such different, and sometimes devastating, forms.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-decolonization-paths',
      kind: 'concept',
      goal: "Explain why decolonization occurred after 1945, and how it produced contrasting paths — negotiated, violent, and Cold-War-entangled — using India/Pakistan's partition, Ghana, Algeria, Kenya, Indonesia, Vietnam, and the Suez Crisis as evidence.",
      keyIdeas: [
        "WHY DECOLONIZATION ACCELERATED AFTER 1945: World War II left Britain and France economically exhausted and militarily overextended, undermining their ability to hold overseas territories by force. At the same time, wartime rhetoric about freedom and self-determination (and the new United Nations' founding principles) made continued colonial rule harder to justify internationally, while nationalist movements within the colonies themselves had grown stronger and more organized over decades.",
        "INDIA AND PAKISTAN (August 1947): Britain granted independence to British India, but partitioned it into two states, India (Hindu-majority) and Pakistan (Muslim-majority), largely along religious lines. The partition triggered massive, often communal violence as millions of Hindus, Muslims, and Sikhs crossed the new borders in fear or under attack; measured estimates put the toll at roughly one million deaths and around fifteen million people displaced — the era's largest single population transfer.",
        "GANDHI AND NEHRU IN INDIA'S INDEPENDENCE MOVEMENT: Mohandas Gandhi led decades of mass, deliberately nonviolent civil-disobedience campaigns against British rule, building the broad-based nationalist pressure that made continued British control increasingly untenable. Jawaharlal Nehru, a close political ally of Gandhi within the Indian National Congress, became independent India's first Prime Minister; in a nationally broadcast speech delivered at the stroke of midnight as British rule ended, he described India's independence as a long-awaited moment of national awakening after decades of struggle.",
        "GHANA'S NEGOTIATED PATH (1957): under the leadership of Kwame Nkrumah, the Gold Coast pursued independence primarily through sustained political organizing, strikes, and negotiation with Britain rather than sustained armed conflict, becoming Ghana in 1957 — the first sub-Saharan African colony to achieve independence, and a model other African independence movements looked to.",
        "ALGERIA'S VIOLENT PATH (1954-1962): unlike Ghana, Algeria was treated by France as an integral part of France itself, with a large French settler population resisting any concession. The National Liberation Front (FLN) waged a prolonged, brutal war for independence against French rule; the conflict, marked by significant violence on multiple sides, ended with Algerian independence in 1962 only after inflicting severe political and social costs on France as well.",
        "KENYA: the Mau Mau uprising (1950s) was an armed anti-colonial rebellion against British rule and land policies favoring white settlers; British forces suppressed it forcefully, including mass detention of suspected rebels, before Kenya achieved independence in 1963 — another case where the path to independence involved substantial armed conflict.",
        "INDONESIA: after Japan's WWII occupation ended Dutch colonial control, Indonesian nationalists declared independence in 1945, but the Netherlands attempted to reassert colonial rule, leading to years of conflict before international pressure helped secure Dutch recognition of Indonesian independence in 1949.",
        "VIETNAM'S COLD-WAR-ENTANGLED PATH: Vietnamese nationalists fought French colonial rule directly, defeating France at Dien Bien Phu (1954) and ending French control — but the country was then divided, and the ensuing conflict between North and South Vietnam became one of the Cold War's defining proxy wars, showing how decolonization and superpower rivalry could become inseparable in the same conflict.",
        "THE SUEZ CRISIS (1956) AS IMPERIAL TWILIGHT: after Egyptian President Gamal Abdel Nasser nationalized the Suez Canal, Britain, France, and Israel launched a joint military intervention to retake it — but US and Soviet pressure (for their own, different Cold War reasons) forced the invading powers to withdraw. The episode publicly demonstrated that Britain and France could no longer act as independent great powers without superpower approval, a symbolic marker of European imperial decline.",
        "THE OVERALL PATTERN: the SAME broad cause (weakened European empires + rising nationalism + a less colonialism-tolerant international order) produced sharply different processes depending on local conditions — whether a colonial power was willing to negotiate, whether a substantial settler population resisted concessions, and whether a Cold War superpower saw strategic stakes in the outcome.",
      ],
      vocabulary: [
        {
          term: 'partition',
          definition:
            "the 1947 division of British India into India and Pakistan along largely religious lines, accompanied by measured estimates of roughly one million deaths and about fifteen million people displaced in communal violence and mass migration.",
        },
        {
          term: 'negotiated independence',
          definition:
            "a path to decolonization achieved primarily through political organizing and negotiation with the colonial power rather than sustained armed conflict — exemplified by Ghana's 1957 independence under Kwame Nkrumah.",
        },
        {
          term: 'Suez Crisis',
          definition:
            "the 1956 episode in which Britain, France, and Israel intervened militarily after Egypt nationalized the Suez Canal, but were forced to withdraw under US and Soviet pressure — widely read as a marker of European imperial decline.",
        },
        {
          term: 'FLN (National Liberation Front)',
          definition:
            "the Algerian nationalist movement that waged a prolonged, violent war (1954-1962) for independence from France, which had treated Algeria as an integral part of French territory.",
        },
      ],
      passageId: 'evelyn.passage.apworld-un-membership-table.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-un-membership-table',
      kind: 'worked_example',
      problem:
        'Consider this data table adapted from the United Nations\' own published roster of membership growth: total UN membership stood at 51 in 1945, 76 in 1955, 99 in 1960, 127 in 1970, 154 in 1980, 159 in 1990, and 189 in 2000. The single largest one-year jump in this period came in 1960, when membership rose from 82 to 99 — 17 new members in one year, 16 of them newly independent African states (the seventeenth, Cyprus, the only non-African admission that year). What does this table reveal about the pace of decolonization, and what should a careful reader keep in mind about what a membership count can and cannot show?',
      steps: [
        'SOURCE IT FIRST. This is a quantitative document: a UN-published roster counting total member states at several points between 1945 and 2000, not a narrative account — it can show scale and timing precisely, but nothing about the process behind the numbers.',
        'IDENTIFY THE HEADLINE PATTERN. Membership rises at every interval shown, growing from 51 in 1945 to 189 by 2000 — but the growth is not smooth: the single biggest jump is concentrated in one year, 1960, when 17 new states joined at once.',
        'IDENTIFY WHAT DROVE THAT SPIKE. Of the 17 new members admitted in 1960, 16 were newly independent African states — a wave large enough that 1960 is often called the "Year of Africa." This single-year concentration is a direct, measurable trace of how rapidly decolonization accelerated across the African continent right around 1960, well after Ghana\'s 1957 breakthrough had shown other movements a viable path.',
        'WEIGH WHAT THE TABLE DOES AND DOES NOT SHOW. The table proves precisely WHEN and HOW MANY new sovereign states joined the international system — powerful evidence of decolonization\'s pace. It says nothing about HOW each of those 16 states achieved independence: some (like Ghana\'s neighbors following its negotiated model) may have taken a comparatively negotiated route, while others involved far more violence. A membership count is evidence of an outcome (new sovereign states), not of the process that produced it.',
        'STATE THE LINK TO THE COURSE THESIS. The 1960 spike is strong quantitative confirmation that decolonization was not a slow, steady trickle but included a genuine acceleration point concentrated in Africa — while reminding a careful reader that this kind of document tells you THAT independence happened and roughly how much, but not whether it happened through negotiation, warfare, or something in between.',
      ],
      answer:
        'The table shows decolonization accelerating sharply rather than proceeding as a slow, even trickle: total UN membership rose at every interval from 51 (1945) to 189 (2000), but the single largest one-year jump — 82 to 99, +17 members — came in 1960, when 16 of those 17 new members were newly independent African states (the "Year of Africa"). That concentration is strong quantitative evidence that African decolonization accelerated dramatically right around 1960, after Ghana\'s 1957 breakthrough had already shown one viable path. A careful reader should note the limits of the document, though: a membership count proves precisely WHEN and HOW MANY new sovereign states joined the international system, but says nothing about HOW each got there — whether through Ghana-style negotiation, Algeria- or Kenya-style armed conflict, or some path in between. The table is powerful evidence of decolonization\'s pace, not of its process.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE specific decolonization movement or event after 1945. (b) Explain ONE specific factor that shaped whether that movement's path to independence was comparatively negotiated or comparatively violent. (c) Explain ONE effect of decolonization on international institutions or global politics.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies a genuine decolonization movement/event — e.g. India/Pakistan's partition, Ghana's 1957 independence, the Algerian War, the Mau Mau uprising in Kenya, Indonesian independence, Vietnam's independence from France, or the Suez Crisis. No credit for a vague, unnamed \"a colony became independent\" statement.",
            modelResponse:
              "One decolonization movement was Ghana's independence from Britain in 1957, achieved under the leadership of Kwame Nkrumah.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate factor shaping whether the named movement's path was negotiated or violent — e.g. the presence/absence of a large settler population resisting concessions, the colonial power's willingness to negotiate, or Cold War strategic interest. No credit for an explanation disconnected from the movement named in (a).",
            modelResponse:
              "Ghana's path was comparatively negotiated because Britain, unlike France in Algeria, did not face a large local settler population determined to keep the colony under direct rule, which made sustained political organizing and negotiation — rather than prolonged armed conflict — a viable route to independence.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate effect of decolonization on international institutions/global politics — e.g. the rapid growth of UN membership (especially around 1960), the rise of the Non-Aligned Movement, or new states becoming Cold War proxy-conflict sites. No credit for a vague or unsupported claim.",
            modelResponse:
              'One effect of decolonization was a rapid expansion of UN membership: total membership grew from 51 in 1945 to 99 by 1960 alone, as dozens of newly independent African and Asian states — 16 of them admitted in 1960 alone — joined the international system as sovereign members for the first time.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-independence-uniform',
      kind: 'misconception_check',
      question:
        'True or false: independence came to Britain\'s and France\'s colonies in essentially the same way everywhere after 1945 — mostly through peaceful, negotiated transfers of power.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Generalizing from one visible, comparatively negotiated case (e.g. Ghana) to decolonization as a whole, erasing the substantial violence that accompanied independence in many other places.',
          correctsTo:
            "FALSE. Decolonization followed sharply different paths depending on local conditions. Ghana's 1957 independence, under Kwame Nkrumah, came through largely political organizing and negotiation with Britain. But Algeria's independence from France (1954-1962) required a prolonged, violent war fought by the FLN against a French government that treated Algeria as an integral part of France itself, and Kenya's independence involved the armed Mau Mau uprising and a forceful British suppression campaign before independence in 1963. India and Pakistan's 1947 partition, while formally a negotiated transfer of sovereignty, was accompanied by roughly a million deaths and about fifteen million people displaced in communal violence. Even Vietnam's independence, won by defeating France militarily at Dien Bien Phu in 1954, then became entangled in a Cold War proxy conflict. There was no single template for how empires ended.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "WWII exhaustion, weakened claims to colonial legitimacy, and stronger nationalist movements together drove decolonization after 1945 — but the SAME broad cause produced very different local paths.",
        "India/Pakistan's 1947 partition, though a negotiated transfer of sovereignty, was accompanied by roughly one million deaths and about fifteen million displaced — the era's largest population transfer.",
        "Ghana (1957, Nkrumah) shows a comparatively negotiated path; Algeria (1954-1962, FLN vs. France) and Kenya (Mau Mau uprising) show comparatively violent paths — the difference often turned on settler resistance and the colonial power's willingness to negotiate.",
        "Vietnam's independence from France (1954) became entangled with Cold War rivalry, showing decolonization and superpower competition could be inseparable in the same conflict.",
        "The Suez Crisis (1956) — Britain, France, and Israel forced to withdraw from Egypt under US/Soviet pressure — is a symbolic marker of European imperial decline; the 1960 \"Year of Africa\" (16 new UN members in one year) is quantitative evidence of decolonization's accelerating pace.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.5-8.6',
    cedTitle: 'Decolonization',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-un-membership-table.v1',
        chapter: '1945-2000',
        note: 'UN membership-growth data table — anchor document for the pace and scale of decolonization, especially the 1960 "Year of Africa" spike.',
      },
    ],
  },
};
