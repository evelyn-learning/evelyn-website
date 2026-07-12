/**
 * AP World History: Modern — CED Unit 8.7-8.8: New States and Development
 * Strategies.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). No passage is wired
 * to this plan — the Unit-8 block specifies no passage for this LO, so the
 * worked example instead performs a close read of an apparent tension
 * between two true facts about non-alignment (mirroring the pattern used
 * in ap-apush-u8-postwar-society.ts for its unwired worked example), rather
 * than a primary-source excerpt.
 *
 * Covers how newly independent states navigated the Cold War through the
 * Bandung Conference and Non-Aligned Movement, pursued varied development
 * strategies, faced neocolonial-dependency critiques, and confronted
 * violent conflict along colonial-drawn borders. Bandung's communique is
 * DESCRIBED, never quoted, per the copyright/verbatim-source discipline.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_NEW_STATES: LessonPlan = {
  id: 'evelyn.ap.apworld.new-states.v1',
  title: 'U8.7-8.8 New States and Development Strategies',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.new-states',
      description:
        'Explain how newly independent states pursued the Non-Aligned Movement and varied development strategies while navigating Cold War pressure, neocolonial-dependency debates, and conflicts rooted in colonial-drawn borders.',
      standard: 'AP-APWORLD-8.7',
    },
  ],
  prerequisites: ['apworld.decolonization'],
  followUps: ['apworld.end-cold-war'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see newly independent states as active decision-makers navigating the Cold War, not passive territory being fought over.',
      script:
        "By the late 1950s, dozens of newly independent states faced an obvious pressure: the world was dividing into an American-led bloc and a Soviet-led bloc, and both superpowers wanted allies. The easy story is that new states simply picked a side. The more interesting — and more accurate — story is that many of them tried something else: refusing to formally join EITHER bloc, while still governing real countries that badly needed capital, expertise, and trade partners to develop. That balancing act, done imperfectly and under constant pressure, is one of the defining political experiments of the postwar world. Today we're tracing how new states tried to chart an independent path — and how consistently that path was tested.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-new-states-nonalignment-development',
      kind: 'concept',
      goal: 'Explain the Bandung Conference and Non-Aligned Movement, the range of development strategies newly independent states pursued, neocolonial-dependency critiques, and border-conflict challenges rooted in colonial-drawn borders.',
      keyIdeas: [
        "THE BANDUNG CONFERENCE (1955): leaders from newly independent and colonized Asian and African nations met in Bandung, Indonesia, to articulate shared solidarity, oppose colonialism, and promote economic and cultural cooperation among Asian and African states outside the two Cold War blocs. The conference's closing communique (described here, not quoted) laid the diplomatic groundwork for a formal movement of states declining to align militarily with either superpower.",
        "THE NON-ALIGNED MOVEMENT (NAM, formally founded 1961): building on Bandung, leaders including Josip Broz Tito (Yugoslavia), Jawaharlal Nehru (India), Gamal Abdel Nasser (Egypt), Sukarno (Indonesia), and Kwame Nkrumah (Ghana) formalized a policy of not joining either the US-led or Soviet-led military alliance system — a deliberate \"third path\" through Cold War bipolarity, distinct from simply picking a side.",
        "DEVELOPMENT STRATEGIES VARIED WIDELY: Jawaharlal Nehru's India pursued state-directed Five-Year industrial planning, drawing partly on Soviet planning methods without joining the Soviet bloc. Gamal Abdel Nasser's Egypt nationalized the Suez Canal and pursued the Aswan High Dam as flagship state-led development projects. Julius Nyerere's Tanzania promoted UJAMAA — a policy of communal, village-based agricultural collectivization framed as a distinctly African form of socialism. Many states, especially in Latin America and parts of Asia and Africa, pursued IMPORT SUBSTITUTION INDUSTRIALIZATION (ISI) — protecting domestic industry behind tariffs to reduce dependence on imported manufactured goods — while a smaller group of Asian economies later shifted toward EXPORT-LED GROWTH, manufacturing for global markets instead.",
        "NEOCOLONIAL-DEPENDENCY DEBATES: critics — including Nkrumah himself, who popularized the term \"neocolonialism\" — argued that formal political independence had not ended real economic dependency on former colonial powers and global markets, since many new states still relied on exporting raw materials and importing foreign capital and manufactured goods, leaving their economies structurally similar to the colonial era even after independence.",
        "ARTIFICIAL-BORDER CONFLICTS: colonial powers had drawn many borders with little regard for existing ethnic, religious, or linguistic communities, grouping rival populations into single states or splitting related communities across different states. In Nigeria, this contributed to the Nigerian Civil War (1967-1970), when the southeastern region, dominated by the Igbo ethnic group, attempted to secede as the Republic of Biafra; the resulting war and an associated humanitarian crisis produced a large death toll before the secession was defeated and Nigeria reunified.",
        "THE OVERALL PATTERN: new states pursued a genuine, if imperfectly held, alternative to simple bloc alignment — but doing so while managing real economic development needs, inherited colonial-era borders, and constant pressure from both Cold War superpowers to take a side.",
      ],
      vocabulary: [
        {
          term: 'Non-Aligned Movement (NAM)',
          definition:
            "a formal policy (founded 1961, building on the 1955 Bandung Conference) of newly independent states declining to join either the US-led or Soviet-led Cold War military alliance system — a diplomatic \"third path\" through bipolarity.",
        },
        {
          term: 'import substitution industrialization (ISI)',
          definition:
            'a development strategy of protecting domestic industry behind tariffs to reduce dependence on imported manufactured goods, pursued by many newly independent states, especially in Latin America.',
        },
        {
          term: 'ujamaa',
          definition:
            "Julius Nyerere's policy in Tanzania promoting communal, village-based agricultural collectivization, framed as a distinctly African form of socialism.",
        },
        {
          term: 'neocolonialism',
          definition:
            'a critique, popularized by Kwame Nkrumah, that formally independent states remained economically dependent on former colonial powers and global markets — political sovereignty without full economic sovereignty.',
        },
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-nonalignment-in-practice',
      kind: 'worked_example',
      problem:
        "Consider two facts about newly independent states in the 1950s-60s: (1) many, including Egypt, formally embraced non-alignment — declining to join either the US-led or Soviet-led military bloc; (2) many of those same states accepted large-scale aid from one Cold War superpower anyway — for example, after the United States and the World Bank withdrew their offer to help finance Egypt's Aswan High Dam, Gamal Abdel Nasser turned to the Soviet Union for the financing and engineering to build it. How can both of these be true, and what does that combination reveal about how non-alignment actually worked in practice?",
      steps: [
        'IDENTIFY THE APPARENT TENSION. One fact makes Egypt sound firmly outside the Cold War bloc system (a founding non-aligned state). The other shows Egypt accepting major Soviet financing and engineering for its signature development project. Both are accurate — the tension is real, not a contradiction to explain away.',
        'RESOLVE IT BY DEFINING WHAT NON-ALIGNMENT ACTUALLY MEANT. Non-alignment was a refusal to join a FORMAL MILITARY ALLIANCE (like NATO or the Warsaw Pact), not a refusal to accept aid, trade, or arms from either superpower. A state could decline to place its own military under a bloc\'s command structure while still pragmatically accepting resources from whichever side offered them.',
        'IDENTIFY THE MECHANISM. When the US and World Bank withdrew Aswan Dam financing (partly over Egyptian arms deals with the Communist bloc), Nasser did not abandon non-alignment — he used the Cold War rivalry itself as leverage, turning to Soviet financing and engineers to build the dam while nationalizing the Suez Canal to help fund it, all without joining the Warsaw Pact or hosting Soviet military bases.',
        'CONNECT TO THE BROADER PATTERN. This mirrors Nehru\'s India (which drew on Soviet-style planning methods without Soviet alliance) and other non-aligned states: accepting whichever superpower\'s aid served a specific development goal, while formally declining to become either bloc\'s military or ideological client.',
        'STATE THE BROADER LESSON. Non-alignment was a genuine, imperfectly held "third path" — a diplomatic posture of avoiding formal bloc membership, not a strategy of total isolation from superpower resources. New states routinely, and often deliberately, played the two superpowers off each other to extract aid for their own development goals, which is why "formally non-aligned" and "recipient of major superpower aid" describe the SAME state, not competing ones.',
      ],
      answer:
        'Both facts are true because non-alignment meant declining to join a FORMAL Cold War military alliance, not refusing all contact with either superpower. When the US and World Bank withdrew financing for the Aswan High Dam, partly over Egypt\'s arms deals with the Communist bloc, Nasser turned to Soviet financing and engineers to build the dam anyway, while nationalizing the Suez Canal to help fund it — all without joining the Warsaw Pact or accepting Soviet military bases. That combination shows how non-alignment actually worked in practice: it was a genuine diplomatic posture of avoiding formal bloc membership, but many non-aligned states, including Egypt and India, pragmatically accepted aid, financing, or planning models from whichever superpower served a specific development goal. Non-alignment was a real, if imperfectly held, "third path" through Cold War bipolarity — not a strategy of isolating a new state from superpower resources altogether.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE development strategy pursued by a newly independent state after 1945. (b) Explain ONE specific factor that shaped that state's choice of development strategy. (c) Explain ONE challenge new states faced due to colonial-era borders or neocolonial economic dependency.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies a genuine post-1945 development strategy — e.g. Nehru's Five-Year state-directed planning in India, Nasser's Aswan High Dam/Suez nationalization, Nyerere's ujamaa in Tanzania, or import substitution industrialization (ISI). No credit for a vague statement (\"the country tried to develop\") with no specific strategy named.",
            modelResponse:
              "One development strategy was Julius Nyerere's ujamaa policy in Tanzania, which promoted communal, village-based agricultural collectivization as a distinctly African form of socialism.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate factor shaping the named strategy — e.g. a leader's ideological commitments, the desire to reduce dependency on former colonial powers, or the availability of aid/financing from one Cold War superpower. No credit for an explanation disconnected from the strategy named in (a).",
            modelResponse:
              "Nyerere framed ujamaa partly as a deliberate alternative to both Western capitalist development models and direct Soviet-style industrialization, aiming to build a distinctly African form of socialism rooted in existing communal village structures rather than importing either bloc's economic model wholesale.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate challenge tied to colonial-era borders or neocolonial dependency — e.g. the Nigerian Civil War/Biafra secession rooted in colonial-drawn borders grouping rival ethnic communities together, or continued reliance on exporting raw materials to former colonial powers. No credit for a vague or unsupported claim.",
            modelResponse:
              "One challenge was the Nigerian Civil War (1967-1970): colonial-era borders had grouped Nigeria's diverse ethnic and religious communities into a single state, and when the Igbo-dominated southeast attempted to secede as Biafra, the resulting war and humanitarian crisis produced a large death toll before the secession was defeated.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-all-aligned-superpower',
      kind: 'misconception_check',
      question:
        'True or false: every newly independent state formally aligned with either the US-led or the Soviet-led bloc — there was no real "third path" during the Cold War.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming Cold War bipolarity left new states no real alternative to formally joining one bloc, and treating any acceptance of superpower aid as proof of formal alignment.',
          correctsTo:
            "FALSE. Beginning with the 1955 Bandung Conference and formalized in the 1961 Non-Aligned Movement, many newly independent states — including India (Nehru), Egypt (Nasser), Indonesia (Sukarno), Yugoslavia (Tito), and Ghana (Nkrumah) — deliberately declined to join either the US-led or Soviet-led formal military alliance system. This \"third path\" was real, but imperfectly held: non-aligned states routinely accepted aid, financing, or planning assistance from whichever superpower served a specific goal (as when Nasser turned to Soviet financing for the Aswan High Dam after Western financing fell through) without becoming that superpower's formal military ally. Non-alignment was a genuine, distinct posture — not simply picking a side, and not total isolation from superpower resources either.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The 1955 Bandung Conference and the 1961 Non-Aligned Movement gave newly independent states a formal, if imperfectly held, \"third path\" through Cold War bipolarity, distinct from joining either superpower's bloc.",
        "Development strategies varied widely: Nehru's state-directed planning (India), Nasser's Aswan Dam/Suez nationalization (Egypt), Nyerere's ujamaa (Tanzania), and import substitution industrialization (ISI) versus later export-led growth models.",
        "Non-alignment meant avoiding FORMAL military alliance, not refusing superpower aid — many non-aligned states pragmatically accepted aid or financing from either side, as Nasser did from the USSR for the Aswan Dam.",
        'Critics, including Nkrumah (who popularized "neocolonialism"), argued formal political independence had not ended real economic dependency on former colonial powers and global markets.',
        'Colonial-drawn borders grouping rival communities into single states produced violent conflicts after independence, including the Nigerian Civil War (1967-1970) and the failed Biafra secession.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.7-8.8',
    cedTitle: 'New States and Development Strategies',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
