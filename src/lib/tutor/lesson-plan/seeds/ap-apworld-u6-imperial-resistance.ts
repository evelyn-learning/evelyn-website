/**
 * AP World History: Modern — CED Unit 6.3: Resistance to Imperialism.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument
 * (colonized and threatened peoples resisted imperial expansion through a
 * range of military, religious, and diplomatic means, with a range of
 * outcomes — resistance was not uniformly futile); worked_example = a
 * document-free comparative analysis (why did one resistance succeed where
 * another failed?); try_yourself = a 3-point SAQ-style short-answer.
 *
 * NO wired passage — this topic is deliberately left unanchored to a
 * specific primary source in the Unit-6 content-plan set. All events described here are
 * authored, measured summaries, not passage-quoted.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_IMPERIAL_RESISTANCE: LessonPlan = {
  id: 'evelyn.ap.apworld.imperial-resistance.v1',
  title: 'U6.3 Resistance to Imperialism',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.imperial-resistance',
      description:
        'Explain the range of ways colonized and threatened peoples resisted imperial expansion in the period 1750-1900, and evaluate why some resistance movements succeeded in preserving sovereignty or forcing concessions while others were suppressed.',
      standard: 'AP-APWORLD-6.3',
    },
  ],
  prerequisites: ['apworld.imperial-expansion'],
  followUps: ['apworld.economic-imperialism'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Push back on the assumption that imperial expansion simply rolled over everyone in its path — resistance was constant, took many forms, and sometimes worked.',
      script:
        "It's tempting to picture the Scramble for Africa and the expansion of empire in Asia as a one-sided story: powerful industrial states arrive, and everyone else is conquered. That picture is wrong in an important way. Every single expansion covered in the last topic was met with resistance — sometimes armed rebellion, sometimes prophetic religious movements, sometimes shrewd diplomacy. And resistance did not always fail: one African state fought a European invasion and WON, decisively enough that it kept its independence for another four decades. Understanding imperialism in this period means understanding the resistance as fully as the expansion — and understanding why some resistance succeeded while other resistance, facing very similar odds, did not.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperial-resistance',
      kind: 'concept',
      goal: 'Explain the range of resistance movements against imperial expansion — armed rebellion, monarchical/military resistance, millenarian movements — and the factors that explain why some succeeded and others were suppressed.',
      keyIdeas: [
        "THE SEPOY REBELLION (1857), also called the Indian Rebellion or Indian Mutiny, was a large-scale uprising of Indian soldiers (sepoys) in the British East India Company's army, joined by many Indian rulers and civilians, sparked by grievances including new cartridges rumored to be greased with cow and pig fat (offensive to Hindu and Muslim soldiers alike) layered on top of long-building resentment at Company rule. The British suppressed it after over a year of fighting — but the rebellion was serious enough that the Crown dissolved Company rule entirely in 1858 and took over direct governance (the Raj). Even a suppressed rebellion could force a fundamental restructuring of imperial administration.",
        "YAA ASANTEWAA led the Asante Empire's War of the Golden Stool (1900) in what is now Ghana: when the British governor demanded the Golden Stool (the sacred symbol of Asante royal authority) be surrendered as a token of submission, Yaa Asantewaa, Queen Mother of Ejisu, rallied Asante forces to resist — the last major Asante war against British rule. The uprising was ultimately suppressed and Asante was formally annexed, but it stands as a striking example of a woman leading a state's most significant armed resistance to colonization.",
        "THE ZULU KINGDOM resisted British invasion in the Anglo-Zulu War (1879), inflicting a major defeat on British forces at the Battle of Isandlwana — one of the most significant tactical defeats a colonial power suffered against an African army in this period. Despite that victory, sustained British reinforcement led to Zulu defeat later the same year and the eventual breakup of the Zulu kingdom's independent power.",
        'ETHIOPIA WON. At the Battle of Adwa (1896), Emperor Menelik II\'s forces decisively defeated an invading Italian army, forcing Italy to recognize Ethiopian independence in the resulting treaty. Adwa is the single clearest counterexample to any claim that resistance to imperial conquest was uniformly futile: Ethiopia remained one of only two African states (with Liberia) never formally colonized, directly because of this military victory.',
        'THE BOXER UPRISING (1899-1901) was an anti-foreign, anti-Christian movement in Qing China (participants were called "Boxers" by outside observers for their martial-arts training), which besieged foreign legations in Beijing with eventual Qing court support. An international Eight-Nation Alliance military force suppressed the uprising, and the resulting Boxer Protocol (1901) imposed a large indemnity and further concessions on China — a case where resistance provoked an even harsher round of foreign intervention rather than relief from it.',
        'MILLENARIAN MOVEMENTS responded to imperial and settler pressure with religious, prophetic frameworks rather than conventional warfare: in southern Africa, the Xhosa cattle-killing movement (1856-57) followed a prophecy that killing cattle and destroying crops would bring ancestral spirits to drive out European settlers — the resulting famine catastrophically weakened Xhosa capacity to resist further encroachment, a case where a resistance movement\'s methods backfired against the resisting society itself. A comparable pattern (a prophetic movement responding to settler dispossession, described here for comparison, not in scope for its own separate account in this course) is the Ghost Dance movement among Native American peoples in the same era.',
        'WHY OUTCOMES DIVERGED: several factors distinguish Adwa\'s success from most other resistance in this period — Ethiopia was a relatively centralized, unified state under Menelik II, able to acquire modern rifles (partly via European rivals of Italy) and mass a large, coordinated army, and Italy\'s invading force was comparatively small and overextended. Where resisting states were more fragmented, less able to arm themselves comparably, or faced larger and better-supplied invading/reinforcing forces (as with the Zulu after Isandlwana, or Qing China facing the Eight-Nation Alliance), resistance was ultimately suppressed even after real tactical successes.',
      ],
      vocabulary: [
        {
          term: 'Sepoy Rebellion (1857)',
          definition:
            "a large-scale uprising of Indian soldiers and civilians against British East India Company rule, suppressed after over a year of fighting, but serious enough that the Crown dissolved Company rule and assumed direct control (the Raj) in 1858.",
        },
        {
          term: 'millenarian movement',
          definition:
            'a religious or prophetic movement (e.g. the Xhosa cattle-killing movement) that responds to crisis or foreign pressure with the expectation of imminent, often supernaturally delivered, deliverance or transformation, rather than conventional political or military organizing.',
        },
        {
          term: 'Battle of Adwa (1896)',
          definition:
            "Ethiopia's decisive military victory over an invading Italian army under Emperor Menelik II, forcing Italian recognition of Ethiopian independence and making Ethiopia (with Liberia) one of only two African states never formally colonized.",
        },
        {
          term: 'Boxer Protocol (1901)',
          definition:
            'the settlement imposed on Qing China by the Eight-Nation Alliance after suppressing the Boxer Uprising, requiring a large indemnity payment and further concessions to foreign powers.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-comparing-outcomes',
      kind: 'worked_example',
      problem:
        'Compare the Battle of Adwa (1896) to the Sepoy Rebellion (1857): both were significant armed resistance to imperial or colonial power, but one preserved the resisting state\'s formal independence and the other did not. What explains the difference in outcome?',
      steps: [
        'IDENTIFY WHAT IS BEING COMPARED. Adwa: Ethiopia, a unified state under Emperor Menelik II, fought a foreign invasion attempting initial conquest and won decisively in a single major battle. The Sepoy Rebellion: an uprising WITHIN an already-established zone of British Company control in India, involving soldiers and rulers rebelling against existing rule rather than repelling a new invasion.',
        "STATE AND ARMAMENT. Menelik II had spent years consolidating central authority over Ethiopia's regions and had acquired substantial modern weaponry, partly through rivalries among European powers eager to check Italian expansion — Ethiopia could field a large, comparatively well-armed, unified army. Indian resistance in 1857, while widespread, was not unified under one central command or one coherent political goal across the many regions and rulers involved.",
        'SCALE OF THE OPPOSING FORCE. Italy\'s invading army at Adwa was a single, overextended expeditionary force at the edge of its logistical reach. Britain, by contrast, could draw on its existing large military and administrative presence already established across India plus reinforcements from across the empire — a fundamentally larger and more sustainable opposing force to defeat.',
        "WEIGH THE STAKES FOR THE IMPERIAL POWER. For Italy, losing at Adwa meant abandoning a NEW, not-yet-established claim — a serious but survivable diplomatic and military reversal. For Britain, losing control of India (already a central pillar of the empire) after decades of established rule was a far larger stake, justifying a much larger and more sustained military and political response, including a full restructuring of colonial administration (Company to Raj) rather than withdrawal.",
        "STATE THE COMPARATIVE CONCLUSION. Adwa succeeded in preserving formal independence because Ethiopia was unified, well-armed, and fighting a smaller invading force with limited immediate stakes for Italy; the Sepoy Rebellion, despite serious and widespread resistance, was suppressed because it challenged an already-entrenched, heavily invested colonial power with much larger, sustainable military reserves — though even in defeat, the rebellion was consequential enough to force Britain to fundamentally restructure how it ruled India.",
      ],
      answer:
        'Adwa (1896) preserved Ethiopian independence because Ethiopia fought as a unified, comparatively well-armed state against a single, overextended Italian invading force with limited immediate stakes for Italy in defeat. The Sepoy Rebellion (1857), by contrast, challenged an already-entrenched British colonial power in India with much larger, sustainable military reserves and much higher stakes in maintaining control — so despite serious, widespread fighting, it was suppressed. Neither outcome was preordained by "resistance never/always works" — both reflect the specific balance of unity, armament, and stakes on each side, and even the SUPPRESSED Sepoy Rebellion still forced a fundamental restructuring of British rule in India (Company to Raj), showing that resistance shaped imperial outcomes even where it did not preserve full independence.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE resistance movement against imperial expansion, 1750-1900. (b) Explain ONE factor that helps account for whether that movement succeeded or was suppressed. (c) Explain ONE way that resistance (successful or suppressed) shaped how an imperial power subsequently governed or treated the resisting territory.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine resistance movement — e.g. the Sepoy Rebellion, the War of the Golden Stool, the Anglo-Zulu War, the Battle of Adwa, the Boxer Uprising, or the Xhosa cattle-killing movement. No credit for a vague statement with no identifiable specific movement, or an anachronistic/incorrect item.',
            modelResponse:
              'One resistance movement against imperial expansion was the Battle of Adwa (1896), in which Ethiopian forces under Emperor Menelik II defeated an invading Italian army.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate factor (e.g. unity/centralization, access to modern weaponry, size/overextension of the opposing force) that helps account for the outcome named. No credit for an explanation disconnected from the movement named in (a).',
            modelResponse:
              "Ethiopia succeeded at Adwa in large part because Emperor Menelik II had consolidated a unified, well-armed state, allowing it to field a large coordinated army against a comparatively small, overextended Italian invading force.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate consequence of the resistance for subsequent imperial governance or policy — e.g. the Crown replacing Company rule in India, the Boxer Protocol\'s indemnity and concessions, or Ethiopian independence being formally recognized. No credit for a vague or unsupported claim.',
            modelResponse:
              "Ethiopia's victory at Adwa forced Italy to formally recognize Ethiopian independence in the resulting treaty, making Ethiopia one of only two African states (with Liberia) never formally colonized during the Scramble for Africa.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-resistance-always-failed',
      kind: 'misconception_check',
      question:
        'True or false: resistance to imperial expansion always failed to preserve the resisting state\'s independence or force meaningful concessions.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Generalizing from the fact that MOST resistance movements in this period were eventually suppressed to the claim that resistance NEVER worked — missing the AP exam\'s expectation that you can name at least one clear counterexample and explain the conditions that produced it.',
          correctsTo:
            "FALSE. Ethiopia's victory at the Battle of Adwa (1896) forced Italy to formally recognize Ethiopian independence — Ethiopia remained one of only two African states, with Liberia, never formally colonized. Even resistance that was ultimately suppressed still forced consequential change: the Sepoy Rebellion (1857) led the British Crown to dissolve East India Company rule and take over direct governance in 1858, and Meiji Japan's program of centralized, negotiated modernization (covered in the reform topic) let it revise the unequal treaties imposed on it rather than accept them permanently. \"Resistance always failed\" collapses a real range of outcomes — outright success (Adwa), consequential restructuring despite suppression (the Sepoy Rebellion), and negotiated revision (Japan) — into a single false generalization.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Sepoy Rebellion (1857) was suppressed but forced the Crown to dissolve East India Company rule and assume direct governance (the Raj) in 1858.',
        'Yaa Asantewaa led the Asante Empire\'s War of the Golden Stool (1900); the Zulu Kingdom defeated the British at Isandlwana (1879) before eventual defeat later that year.',
        'The Battle of Adwa (1896) is the clearest counterexample to "resistance always failed": Ethiopia decisively defeated Italy and preserved its formal independence.',
        'The Boxer Uprising (1899-1901) was suppressed by an Eight-Nation Alliance, resulting in the harsher Boxer Protocol (1901) — resistance sometimes provoked worse terms, not relief.',
        'Millenarian movements like the Xhosa cattle-killing movement responded to imperial/settler pressure with prophecy rather than conventional warfare, sometimes catastrophically weakening the resisting society itself.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.3',
    cedTitle: 'Resistance to Imperialism',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
    ],
  },
};
