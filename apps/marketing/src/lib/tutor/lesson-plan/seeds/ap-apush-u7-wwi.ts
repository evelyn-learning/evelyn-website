/**
 * AP US History — CED Unit 7.6-7.8: World War I.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Covers American neutrality and the path to war,
 * wartime mobilization of opinion and suppression of dissent, the Great
 * Migration, and the fight over Wilson's Fourteen Points versus the actual
 * Treaty of Versailles — anchored by Wilson's April 1917 war message.
 *
 * The Espionage/Sedition Acts and Schenck v. United States are mentioned
 * for their APUSH content (wartime dissent, mobilization) only — kept
 * APUSH-internal, not cross-wired to AP Gov's First Amendment framework.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_WWI: LessonPlan = {
  id: 'evelyn.ap.apush.wwi.v1',
  title: 'U7.6-7.8 World War I',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.wwi',
      description:
        "Explain the causes of U.S. entry into World War I, including the failure of neutrality and Wilson's idealist war aims; explain wartime mobilization of public opinion and suppression of dissent and the Great Migration; and explain the fight over the Fourteen Points and the Treaty of Versailles.",
      standard: 'AP-APUSH-7.6',
    },
  ],
  prerequisites: ['apush.progressivism'],
  followUps: ['apush.twenties'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see American entry into WWI as a late, contested decision after three years of genuine neutrality, not an automatic response to a European war.',
      script:
        "World War I began in Europe in the summer of 1914. The United States did not declare war until April 1917 — nearly three full years later. For most of that time, President Wilson insisted on American neutrality, and most Americans agreed the war was Europe's problem, not America's. So what changed? Not one single event, but an accumulating sequence: a submarine campaign that killed American civilians, a secret telegram proposing an alliance against the U.S., and a president who ultimately decided neutrality was no longer possible, or even honorable. Today we're tracing that path from neutrality to war, what the war effort demanded of Americans at home, and the surprisingly bitter argument over the peace that followed.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-wwi',
      kind: 'concept',
      goal: 'Explain the path from American neutrality to entry into World War I, wartime mobilization of opinion and dissent, the Great Migration, and the fight over the Fourteen Points and Versailles.',
      keyIdeas: [
        "AMERICAN NEUTRALITY (1914-1917): when World War I broke out in Europe in 1914, Wilson proclaimed American neutrality, though U.S. trade and loans overwhelmingly favored the Allied powers (Britain and France) over the Central Powers, straining genuine neutrality in practice.",
        "SUBMARINE WARFARE PUSHES THE U.S. TOWARD WAR: Germany's use of unrestricted submarine warfare, including the sinking of the British liner Lusitania (May 1915, killing more than 1,000 people, over 100 of them Americans), provoked American outrage. Germany temporarily suspended unrestricted submarine attacks after diplomatic protest, but resumed the policy in early 1917 as a calculated gamble to defeat Britain before American intervention could matter.",
        "THE ZIMMERMANN TELEGRAM: intercepted and made public in early 1917, a German proposal to Mexico offered to help Mexico reclaim lost territory (Texas, New Mexico, Arizona) if it allied with Germany against the United States — further inflaming American public opinion just before the U.S. entered the war.",
        "WAR ENTRY (APRIL 1917): Wilson asked Congress for a declaration of war on April 2, 1917, framing American intervention in idealist terms rather than as mere retaliation for German submarine attacks; Congress declared war within days.",
        "MOBILIZING OPINION AND SUPPRESSING DISSENT: the Committee on Public Information (CPI), led by George Creel, produced pervasive pro-war propaganda to build public support. The Espionage Act (1917) and Sedition Act (1918) criminalized speech that interfered with the war effort or criticized the government or the war, leading to thousands of prosecutions of war critics and radicals; the Supreme Court upheld such wartime speech restrictions in Schenck v. United States (1919).",
        "THE GREAT MIGRATION: wartime industrial labor demand, combined with the near-halt of European immigration during the war, pulled hundreds of thousands of African Americans out of the rural South to industrial jobs in Northern and Midwestern cities beginning around 1916 — a demographic shift that reshaped Northern urban life and helped set the stage for the Harlem Renaissance in the following decade.",
        "WILSON'S FOURTEEN POINTS (JANUARY 1918): Wilson proposed an idealistic postwar settlement centered on self-determination for nations, open diplomacy instead of secret treaties, and a League of Nations to prevent future wars.",
        "THE ACTUAL TREATY OF VERSAILLES (1919) FELL SHORT OF THAT VISION: shaped heavily by more punitive Allied demands, especially from France, the treaty imposed harsh reparations and a \"war guilt\" clause on Germany, falling well short of Wilson's idealistic Fourteen Points.",
        "THE SENATE REJECTS THE TREATY: back home, the Senate — led by Republican \"Reservationists\" like Henry Cabot Lodge, who wanted conditions attached (especially limiting Article X's collective-security obligations), and outright \"Irreconcilables\" who opposed the League altogether — rejected the Treaty of Versailles, and with it U.S. membership in the League of Nations, in votes in 1919 and again in 1920, after Wilson refused to accept the Senate's compromise reservations.",
      ],
      vocabulary: [
        {
          term: 'Zimmermann Telegram',
          definition:
            "intercepted 1917 German proposal offering to help Mexico reclaim lost territory (Texas, New Mexico, Arizona) in exchange for allying with Germany against the U.S. — a key factor pushing American opinion toward war.",
        },
        {
          term: 'Committee on Public Information (CPI)',
          definition:
            'federal agency, led by George Creel, that produced pervasive pro-war propaganda to build public support for U.S. participation in World War I.',
        },
        {
          term: 'Great Migration',
          definition:
            "the movement of hundreds of thousands of African Americans from the rural South to Northern and Midwestern industrial cities beginning around 1916, driven by wartime labor demand and the halt of European immigration.",
        },
        {
          term: 'Fourteen Points',
          definition:
            "Wilson's January 1918 proposal for an idealistic postwar settlement built on self-determination, open diplomacy, and a League of Nations — only partially reflected in the actual Treaty of Versailles.",
        },
        {
          term: 'Treaty of Versailles (1919)',
          definition:
            "the actual WWI peace treaty, imposing harsh reparations and a war-guilt clause on Germany; rejected by the U.S. Senate in 1919-1920, keeping the United States out of the League of Nations.",
        },
      ],
      passageId: 'evelyn.passage.apush-wilson-war-message.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-wilson-war-message',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Woodrow Wilson\'s address to Congress requesting a declaration of war (April 2, 1917): "The world must be made safe for democracy. Its peace must be planted upon the tested foundations of political liberty. We have no selfish ends to serve. We desire no conquest, no dominion. We seek no indemnities for ourselves, no material compensation for the sacrifices we shall freely make. We are but one of the champions of the rights of mankind." How does Wilson frame American entry into the war, and how does that framing set up a later problem?',
      steps: [
        'SOURCE IT FIRST. Woodrow Wilson, address to a joint session of Congress requesting a declaration of war against Germany, April 2, 1917 — delivered after Germany resumed unrestricted submarine warfare and the Zimmermann Telegram became public, but framed here in much broader terms than either specific provocation.',
        'IDENTIFY THE CLAIM. Wilson does not justify war primarily as retaliation for German attacks on American ships and citizens. Instead he frames American entry as a moral crusade: "the world must be made safe for democracy," with the U.S. seeking "no conquest, no dominion" and "no indemnities" — positioning America as a disinterested "champion of the rights of mankind" rather than a nation defending its own narrow interests.',
        'CONNECT TO THE CAUSES OF ENTRY. This idealistic framing sits ALONGSIDE the concrete, self-interested causes (submarine attacks on American lives and shipping, the Zimmermann Telegram\'s direct threat to American territory) — Wilson\'s speech elevates the war\'s meaning beyond retaliation into a universal cause, similar to how earlier reform rhetoric (Progressivism) framed narrower policy fights in sweeping moral terms.',
        'IDENTIFY THE LATER PROBLEM THIS FRAMING CREATES. Because Wilson set expectations so high — a war fought for no selfish end, meant to remake the world safe for democracy — the actual Treaty of Versailles, with its punitive reparations and war-guilt clause shaped by French and British demands for retribution, would inevitably look like a betrayal of these stated aims, a gap between wartime idealism and the peace settlement\'s realpolitik.',
        'CONNECT TO THE DOMESTIC MOBILIZATION EFFORT. This same idealistic language was amplified domestically by the Committee on Public Information\'s propaganda campaign, helping build public support for a war that, without such framing, might have seemed more distant from ordinary Americans\' immediate interests.',
        'STATE THE LINK TO THE COURSE THESIS. Wilson\'s idealistic war message set an extraordinarily high moral bar for the postwar peace — a bar the actual Treaty of Versailles, and the Senate\'s subsequent rejection of it, would fail to clear, making the gap between wartime rhetoric and postwar reality one of the era\'s defining tensions.',
      ],
      answer:
        'Wilson frames American entry into World War I not as retaliation for specific German provocations (submarine attacks, the Zimmermann Telegram) but as a disinterested moral crusade: the U.S. seeks "no conquest, no dominion," no "indemnities," fighting instead so that "the world must be made safe for democracy" as one of the "champions of the rights of mankind." This idealistic framing set an extremely high standard for the eventual peace — one the actual Treaty of Versailles, shaped by punitive French and British demands for reparations and a war-guilt clause, would fall well short of, creating a lasting gap between the war\'s stated moral purpose and its realpolitik settlement. That same idealistic language was amplified at home by the Committee on Public Information\'s propaganda campaign to build public support for the war effort.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE cause of U.S. entry into World War I. (b) Briefly explain ONE specific way the U.S. government mobilized public opinion or suppressed dissent during the war. (c) Briefly explain ONE reason the Senate rejected the Treaty of Versailles.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine cause of U.S. entry — e.g. German unrestricted submarine warfare (including the Lusitania), or the Zimmermann Telegram\'s proposal to Mexico. No credit for a vague statement ("Germany was aggressive") with no specific cause named.',
            modelResponse:
              "One cause of U.S. entry into World War I was Germany's resumption of unrestricted submarine warfare in early 1917, a policy that had already killed American civilians in the 1915 sinking of the Lusitania and now targeted American shipping directly.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific mobilization/dissent-suppression measure (Committee on Public Information propaganda, Espionage Act 1917, Sedition Act 1918) and its purpose or effect. No credit for a vague or unsupported claim.",
            modelResponse:
              "The federal government created the Committee on Public Information, led by George Creel, which produced widespread pro-war propaganda across posters, films, and pamphlets to build public enthusiasm and support for the war effort.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate reason for Senate rejection — e.g. Republican "Reservationist" objections to Article X\'s collective-security obligations, "Irreconcilable" opposition to the League of Nations altogether, or Wilson\'s refusal to accept compromise reservations. No credit for a vague claim.',
            modelResponse:
              "The Senate, led by Republicans like Henry Cabot Lodge who wanted conditions attached — especially limiting the obligations of Article X's collective-security provision for the League of Nations — rejected the treaty after Wilson refused to accept the Senate's proposed reservations, leaving the U.S. out of the League it had helped design.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-fought-since-1914',
      kind: 'misconception_check',
      question:
        'True or false: the United States fought in World War I from its outbreak in 1914.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Collapsing the war's European outbreak (1914) and American entry (1917) into a single moment, missing nearly three years of deliberate, genuine American neutrality.",
          correctsTo:
            "FALSE. World War I began in Europe in the summer of 1914, but the United States remained officially neutral for nearly three years, only declaring war in April 1917. Wilson's neutrality was genuinely contested and defended through much of that period — he won reelection in 1916 partly on the slogan \"He kept us out of war.\" It took an accumulating sequence of specific events — Germany's unrestricted submarine warfare (including the 1915 Lusitania sinking and its resumption in 1917) and the Zimmermann Telegram's proposal to Mexico — to shift American policy from neutrality to war. Treating 1914 and 1917 as the same moment erases the genuine three-year political debate over whether the U.S. should get involved at all.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The U.S. remained officially neutral from 1914 to April 1917, despite trade and loans favoring the Allies; German unrestricted submarine warfare (the Lusitania, 1915; its resumption in 1917) and the Zimmermann Telegram pushed the U.S. toward war.",
        'Wilson framed U.S. entry in idealistic terms ("the world must be made safe for democracy") rather than as retaliation, a framing amplified at home by the Committee on Public Information\'s propaganda.',
        'The Espionage Act (1917) and Sedition Act (1918) criminalized wartime dissent, upheld by the Supreme Court in Schenck v. United States (1919); wartime labor demand and the halt of European immigration drove the Great Migration of African Americans to Northern cities.',
        "Wilson's idealistic Fourteen Points (1918) called for self-determination, open diplomacy, and a League of Nations, but the actual Treaty of Versailles (1919) imposed harsh reparations and a war-guilt clause on Germany.",
        'The U.S. Senate rejected the Treaty of Versailles and League of Nations membership in 1919-1920 after Wilson refused to accept Senate-proposed reservations (led by Henry Cabot Lodge).',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.6-7.8',
    cedTitle: 'World War I',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-wilson-war-message.v1',
        chapter: '1917',
        note: "Woodrow Wilson's war message to Congress — anchor document for the idealist framing of U.S. entry into World War I.",
      },
    ],
  },
};
