/**
 * AP US History — CED Unit 9.6: America Since 2001.
 *
 * Period-9 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale). Third stop
 * in Period 9: 9/11 and its wars, the security-vs-liberty debate, the 2008
 * financial crisis and response, the ACA, and political polarization.
 *
 * STRICTLY NON-PARTISAN, FACTUAL FRAMING NOTE: this content covers the
 * most recent and most politically live material in the AP US History
 * course. The Iraq War's justification/aftermath, the PATRIOT Act's
 * security-vs-liberty tradeoff, and the ACA's design are each presented as
 * genuinely contested/debated, not resolved one way. The 2008 crisis is
 * presented as the standard multi-factor account per this period's core
 * misconception (no single-actor cause).
 *
 * Anchor text: George W. Bush's September 20, 2001 address to a joint
 * session of Congress — evelyn.passage.apush-bush-sept-2001.v1. The
 * seeded excerpt is THREE non-adjacent segments (two elisions, both
 * explicitly marked "..." in the seed passage itself): the opening
 * "act of war on freedom itself" paragraph, then — after an elided
 * paragraph — the direct address to Muslims worldwide, itself split by
 * one elided audience-applause interjection. Quoted here exactly as
 * seeded, preserving both elisions; never presented as one continuous
 * span. Obama's 2009 inaugural is reserved for this period's MCQ bank,
 * not quoted here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_SINCE_2001: LessonPlan = {
  id: 'evelyn.ap.apush.america-since-2001.v1',
  title: 'U9.6 America Since 2001',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.america-since-2001',
      description:
        'Explain the significance of the September 11 attacks and the wars in Afghanistan and Iraq, the security-vs-liberty debate over the PATRIOT Act, the 2008 financial crisis and government response (TARP, stimulus), the Affordable Care Act, and growing political polarization.',
      standard: 'AP-APUSH-9.6',
    },
  ],
  prerequisites: ['apush.globalization-tech'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the post-2001 period as a chain of specific crises, each producing a real, still-debated tradeoff (security vs. liberty, market stability vs. moral hazard, coverage expansion vs. cost/design disputes) rather than a settled political story.',
      script:
        "On the morning of September 11, 2001, the United States experienced the deadliest attack on its own soil in its history. Within days, the federal government faced a set of genuinely hard tradeoffs it is still debated for making: how much surveillance and detention power to hand law enforcement in the name of preventing another attack, and how far US military power should reach abroad in response. Seven years later, a second kind of crisis — a financial one — forced a different tradeoff: whether the government should intervene directly in private banks and markets to prevent a wider collapse, and what that intervention should look like. Neither crisis produced a single, uncontested answer. Today we trace both chains of decisions, and the debates each one is still generating.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-america-since-2001',
      kind: 'concept',
      goal: 'Explain 9/11 and the wars in Afghanistan/Iraq, the PATRIOT Act security-vs-liberty debate, the 2008 financial crisis and response, the ACA, and rising polarization.',
      keyIdeas: [
        'SEPTEMBER 11, 2001: coordinated attacks by the al-Qaeda terrorist network on the World Trade Center and the Pentagon killed nearly 3,000 people — the deadliest terrorist attack on US soil in the nation\'s history, prompting an immediate, sweeping reassessment of American national-security policy.',
        'AFGHANISTAN (2001- ): a US-led military campaign, launched within weeks of the attacks, targeted al-Qaeda and the Taliban government that had sheltered it. US and allied military involvement continued, with fluctuating troop levels and strategy across four presidential administrations, making it the longest war in US history.',
        "IRAQ (2003, CONTESTED): the Bush administration invaded Iraq in 2003, citing intelligence — contested at the time and definitively disputed afterward — about weapons of mass destruction and alleged ties between the Iraqi government and terrorist networks. No WMD stockpiles were ultimately found. The war's initial justification, its execution, and its long aftermath (an extended US military presence and sectarian conflict within Iraq) remain genuinely disputed among historians and policymakers; this course presents that dispute rather than resolving it.",
        "THE SECURITY-VS-LIBERTY DEBATE — THE PATRIOT ACT: Congress passed the USA PATRIOT Act in October 2001, expanding government surveillance and law-enforcement authority to investigate suspected terrorism. Supporters argued the expanded powers were necessary to prevent further attacks; critics argued its surveillance and detention provisions threatened civil liberties and constitutional protections. This is a genuine, ongoing debate about the balance between collective security and individual rights — both positions reflect real historical and legal arguments, not a settled question.",
        "THE 2008 FINANCIAL CRISIS (STANDARD MULTI-FACTOR ACCOUNT): a severe financial crisis emerged from several factors operating together — a housing-price bubble fueled by widespread subprime mortgage lending, the packaging of risky mortgages into complex securities sold to investors worldwide, insufficient regulatory oversight of these practices, and excessive leverage and risk-taking by major financial institutions. The collapse of the housing bubble in 2007-08 triggered a banking crisis and the deepest US recession since the Great Depression.",
        'THE RESPONSE — TARP AND THE STIMULUS: the Troubled Asset Relief Program (TARP, October 2008, signed by President Bush) authorized federal funds to stabilize banks and other financial institutions; the American Recovery and Reinvestment Act (2009, signed by President Obama) — the "stimulus" — combined federal spending and tax measures intended to counteract the recession.',
        "THE AFFORDABLE CARE ACT (2010): signed by President Obama, the ACA expanded health insurance coverage through subsidized insurance marketplaces, an individual coverage requirement (later modified by Congress), and an option for states to expand Medicaid eligibility. It remains one of the most consequential and contested pieces of domestic legislation of the period, generating sustained political and legal debate, including Supreme Court challenges to specific provisions.",
        "POLARIZATION AND SOCIAL MEDIA: growing partisan polarization in American politics from the 2000s into the 2010s coincided with, and was shaped by, the rise of cable news and later social-media platforms. Scholars document that these media can both broaden political participation and reinforce ideological \"echo chambers\" that reduce exposure to opposing views — a factual description of a documented media/politics trend, not an evaluative claim about any party or platform.",
      ],
      vocabulary: [
        {
          term: 'USA PATRIOT Act',
          definition:
            "2001 federal law expanding government surveillance and law-enforcement powers to investigate terrorism, at the center of an ongoing security-vs-civil-liberties debate.",
        },
        {
          term: 'TARP',
          definition:
            'the Troubled Asset Relief Program (October 2008), authorizing federal funds to stabilize banks and financial institutions during the 2008 financial crisis.',
        },
        {
          term: 'Affordable Care Act (ACA)',
          definition:
            'the 2010 law expanding health insurance coverage through subsidized marketplaces, an individual coverage requirement (later modified), and optional state Medicaid expansion; a contested, still-litigated law.',
        },
        {
          term: 'polarization',
          definition:
            'the documented trend of increasing partisan division in American politics from the 2000s into the 2010s, occurring alongside the rise of cable news and social media.',
        },
      ],
      passageId: 'evelyn.passage.apush-bush-sept-2001.v1',
      estimatedMinutes: 8,
    },
    {
      id: 'worked-bush-address',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from President George W. Bush\'s address to a joint session of Congress, September 20, 2001: "On September the 11th, enemies of freedom committed an act of war against our country. Americans have known wars -- but for the past 136 years, they have been wars on foreign soil, except for one Sunday in 1941. Americans have known the casualties of war -- but not at the center of a great city on a peaceful morning. Americans have known surprise attacks -- but never before on thousands of civilians. All of this was brought upon us in a single day -- and night fell on a different world, a world where freedom itself is under attack.\n\n...\n\nI also want to speak tonight directly to Muslims throughout the world. We respect your faith. It\'s practiced freely by many millions of Americans, and by millions more in countries that America counts as friends. Its teachings are good and peaceful, and those who commit evil in the name of Allah blaspheme the name of Allah. ... The terrorists are traitors to their own faith, trying, in effect, to hijack Islam itself. The enemy of America is not our many Muslim friends; it is not our many Arab friends. Our enemy is a radical network of terrorists, and every government that supports them." What rhetorical work is this speech doing, and why does the president address Muslims worldwide directly in the same address that frames the attacks as an act of war?',
      steps: [
        'SOURCE IT FIRST. September 20, 2001 — nine days after the attacks, in an address to a joint session of Congress that would frame the administration\'s response for years to come. Note the two elisions in the excerpt (marked "..."): a separate, non-adjacent paragraph elided between the two quoted sections, and an audience-applause interjection elided within the second section. These are three distinct segments of the speech, not one continuous passage.',
        'IDENTIFY THE FIRST SEGMENT\'S FRAMING MOVE. Bush frames the attacks as "an act of war" and escalates through parallel contrasts (wars usually fought abroad, casualties usually not at home, surprise attacks usually not against civilians) to argue this attack broke all three patterns at once — concluding that "night fell on a different world, a world where freedom itself is under attack." This elevates the attack from a crime to an act of war against an abstract value (freedom), not just against the United States as a country.',
        'IDENTIFY THE SECOND SEGMENT\'S DIFFERENT AUDIENCE AND PURPOSE. After the elision, Bush shifts to address "Muslims throughout the world" directly, stating "we respect your faith," describing its teachings as "good and peaceful," and — after the second, smaller elision — declaring the terrorists "traitors to their own faith" who "hijack Islam itself." This explicitly separates the enemy (a "radical network of terrorists, and every government that supports them") from Muslims and Arabs generally.',
        'EXPLAIN WHY BOTH SEGMENTS APPEAR IN THE SAME SPEECH. Framing the conflict in civilizational terms ("freedom itself... under attack") while simultaneously and explicitly distinguishing the enemy from Islam and Muslims serves a specific rhetorical purpose: building the broadest possible domestic and international coalition (including Muslim-majority allied governments) while trying to prevent the response from being cast, at home or abroad, as a war against Islam or Muslims generally.',
        'CONNECT TO THE COURSE THESIS. This address is the founding rhetorical document of the "war on terror" framing that shaped US foreign and security policy for the following decade-plus, and its direct address to Muslims previews recurring tensions of the period — over the PATRIOT Act\'s application, the treatment of Muslim Americans, and coalition management as the conflict expanded into Afghanistan and later Iraq — without resolving those tensions itself.',
      ],
      answer:
        'The speech does two distinct pieces of rhetorical work across its non-adjacent segments. The first segment escalates the September 11 attacks from a crime to "an act of war" through a series of parallel contrasts (wars usually fought abroad, casualties usually not at home, surprise attacks usually not against civilians all broken at once), concluding that "freedom itself is under attack" — a civilizational framing, not merely a claim about an attack on the United States as a country. The second segment, addressed directly to "Muslims throughout the world," respects their faith, calls its teachings "good and peaceful," and explicitly separates the terrorists ("traitors to their own faith") and "every government that supports them" from Muslims and Arabs generally. Bush addresses Muslims directly in the same speech that frames the conflict in sweeping, civilizational terms because doing both at once serves a specific purpose: building the widest possible coalition, domestic and international (including Muslim-majority allied governments), while explicitly trying to prevent the response from being cast as a war against Islam itself — a distinction the administration would need to keep making as the "war on terror" expanded into Afghanistan and later Iraq.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE US government action taken in response to the September 11 attacks. (b) Briefly explain ONE specific piece of historical evidence that supports your answer to (a). (c) Briefly explain ONE way historians or contemporaries have debated the balance between national security and civil liberties in the government's response to 9/11.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine US government action following 9/11 — e.g. the invasion of Afghanistan (2001), the passage of the USA PATRIOT Act (2001), or the invasion of Iraq (2003). No credit for a vague statement ("the US fought terrorism") with no specific action named.',
            modelResponse:
              "One US government action was the passage of the USA PATRIOT Act in October 2001, which expanded government surveillance and law-enforcement authority to investigate suspected terrorism.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence connected clearly to the action named in (a). No credit for evidence unconnected to the stated action or too generic to verify.',
            modelResponse:
              "The PATRIOT Act expanded federal authority to conduct surveillance, search records, and detain terrorism suspects, powers federal law-enforcement agencies used in the years after 2001 in an expanded number of terrorism-related investigations, reflecting the shift toward prevention-focused security policy the Act was designed to enable.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way the security-vs-liberty debate has played out — e.g. supporters arguing expanded surveillance/detention powers were necessary to prevent further attacks, versus critics arguing those same powers threatened civil liberties and constitutional protections. No credit for a one-sided claim presented as settled or a vague, unsupported statement.",
            modelResponse:
              "Historians and contemporaries have debated the PATRIOT Act specifically: supporters argued its expanded surveillance and detention powers were a necessary and proportionate response to prevent further attacks, while critics argued the same powers threatened civil liberties and constitutional protections, such as limits on government search and surveillance authority — a genuine disagreement about how to balance collective security against individual rights that remains unresolved.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-2008-single-cause',
      kind: 'misconception_check',
      question:
        'True or false: the 2008 financial crisis was caused by a single actor or decision — for example, one bank, one regulator, or one piece of legislation acting alone.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Single-actor/single-cause reasoning — attributing a large, systemic economic event to one identifiable villain or decision, rather than recognizing the standard historical account as multi-factor.',
          correctsTo:
            "FALSE. Historians and economists generally describe the 2008 financial crisis as the product of several factors operating together, not any single actor or decision: a housing-price bubble fueled by widespread subprime mortgage lending; the packaging of risky mortgages into complex securities sold to investors worldwide, which spread the risk broadly through the financial system; insufficient regulatory oversight of these lending and securitization practices; and excessive leverage and risk-taking by major financial institutions. No single bank, regulator, or law caused the crisis in isolation — the collapse of the housing bubble in 2007-08 triggered a banking crisis specifically because these several vulnerabilities had built up together across the financial system. Reducing the crisis to one cause or one culprit oversimplifies the standard multi-factor account this course expects you to be able to give.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'September 11, 2001 prompted an immediate US invasion of Afghanistan (targeting al-Qaeda and the Taliban) and, in 2003, the more contested invasion of Iraq — no WMD stockpiles were ultimately found there.',
        "The PATRIOT Act (2001) is the center of a genuine, unresolved security-vs-liberty debate: expanded powers to prevent attacks versus threats to civil liberties — both are real historical positions, not a settled question.",
        'The 2008 financial crisis is explained by MULTIPLE factors together — the housing bubble, subprime lending, risky mortgage securitization, weak regulatory oversight, and excessive institutional leverage — never by one single cause or actor.',
        "TARP (2008, Bush) and the 2009 stimulus (Obama) were the government's two main responses to the crisis; the ACA (2010) expanded health coverage but remains a contested, still-litigated law.",
        'Rising political polarization from the 2000s into the 2010s coincided with the growth of cable news and social media, which scholars document can both broaden participation and reinforce ideological echo chambers — described factually here, not as a partisan judgment.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.6',
    cedTitle: 'America Since 2001',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-bush-sept-2001.v1',
        chapter: '2001',
        note: 'Bush address to Congress, September 20, 2001 — anchor document for the "war on terror" framing and its direct address to Muslims worldwide.',
      },
    ],
  },
};
