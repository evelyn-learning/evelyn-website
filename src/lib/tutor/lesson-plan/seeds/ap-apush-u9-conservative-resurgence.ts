/**
 * AP US History — CED Unit 9.2-9.3: The Reagan Era and the End of the Cold
 * War.
 *
 * Period-9 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale). First stop
 * in Period 9 (1980-present): the coalition and policies behind the
 * "conservative resurgence" of 1980-1992, and the multi-factor end of the
 * Cold War.
 *
 * NON-PARTISAN FRAMING NOTE: this period covers living political memory.
 * Reaganomics is presented with BOTH the growth account and the
 * deficit/inequality critique as recognized historian/economist positions,
 * not a settled verdict either way. The Cold War's end is presented as
 * multi-causal (US pressure AND Soviet internal economic strain AND
 * organic Eastern European reform movements) per this period's core
 * misconception.
 *
 * Anchor text: Ronald Reagan's First Inaugural Address, January 20, 1981 —
 * evelyn.passage.apush-reagan-inaugural.v1. Teaching point is the speech's
 * DIAGNOSIS (government itself, not just a specific policy, as the
 * problem) paired with its own fairness qualifier — quoted only as the
 * short excerpt already seeded. Reagan's June 12, 1987 Brandenburg Gate
 * remarks and Obama's 2009 inaugural are reserved for this period's MCQ
 * bank, not quoted here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_CONSERVATIVE_RESURGENCE: LessonPlan = {
  id: 'evelyn.ap.apush.conservative-resurgence.v1',
  title: 'U9.2-9.3 The Reagan Era and the End of the Cold War',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.conservative-resurgence',
      description:
        'Explain the roots and policies of the conservative resurgence of 1980-1992, including the New Right coalition, Reaganomics and its deficit/growth debate, PATCO, the conservative judicial strategy, and the multi-factor end of the Cold War (US pressure, Soviet internal economic strain, and Eastern European reform movements).',
      standard: 'AP-APUSH-9.2',
    },
  ],
  prerequisites: ['apush.cold-war-origins', 'apush.seventies-crisis'],
  followUps: ['apush.globalization-tech'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see 1980 as a coalition winning an argument about the proper size and role of government, not just a personality change in the White House.',
      script:
        "By the late 1970s, many Americans had lived through a decade of stagflation, an energy crisis, and a presidency that had resigned in disgrace. In 1980, voters elected a president who ran on a strikingly different diagnosis of what was wrong: not that government had the wrong policies, but that government itself — its size, its taxes, its reach — was a big part of the problem. That diagnosis didn't come from nowhere. It had been building for two decades among tax-revolt organizers, religious conservatives newly active in politics, and Cold War hawks who thought détente had gone too soft on the Soviet Union. Today we trace how that coalition governed once it won, what its economic program actually did (and who it helped and who it didn't), and how — a decade later — the Cold War it had vowed to win actually ended.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-conservative-resurgence',
      kind: 'concept',
      goal: "Explain the New Right coalition's roots, Reaganomics and its debated economic legacy, PATCO, the conservative judicial strategy, and the multi-factor end of the Cold War.",
      keyIdeas: [
        "THE NEW RIGHT'S ROOTS: Senator Barry Goldwater's 1964 presidential campaign (described here, not quoted) argued for a much smaller federal government and greater states' rights — a landslide loss at the time, but a template conservative organizers built on for the next fifteen years. By the late 1970s that organizing had produced a broader coalition: economic conservatives favoring lower taxes and less regulation, a property-tax \"tax revolt\" (California's Proposition 13, 1978, capped state property tax increases and inspired similar measures elsewhere), newly mobilized religious conservatives (the Moral Majority, founded by Jerry Falwell in 1979, organized evangelical voters around social and moral issues), and Cold War hawks who argued 1970s détente had left the US dangerously behind. This coalition elected Ronald Reagan in 1980.",
        "REAGANOMICS — SUPPLY-SIDE ECONOMICS: Reagan's economic program rested on supply-side theory: that cutting marginal tax rates would spur enough additional economic growth and investment to offset (or partly offset) the lost tax revenue. The Economic Recovery Tax Act (1981) cut individual income tax rates significantly; the Tax Reform Act (1986) simplified the tax code and lowered top rates further.",
        "REAGANOMICS' DEBATED LEGACY (present both positions): supporters point to the 1980s recovery from stagflation and sustained economic growth as evidence the tax cuts (alongside the Federal Reserve's anti-inflation policy) worked. Critics point out that federal deficits and the national debt grew sharply during the Reagan years — tax cuts were not matched by equivalent spending cuts, and defense spending in fact rose substantially — and that income gains over the decade were not evenly distributed, with inequality widening. Both are legitimate historical positions historians and economists continue to weigh; the AP course expects you to be able to state both, not pick a winner.",
        "PATCO (1981): the Professional Air Traffic Controllers Organization struck for better pay and working conditions, violating a federal law barring strikes by government employees. Reagan fired the roughly 11,000 striking controllers and banned them from federal employment. The episode is widely read, at the time and since, as a signal event that weakened organized labor's bargaining position for the years that followed.",
        "THE CONSERVATIVE JUDICIAL STRATEGY: Reagan (and the Republican administrations that followed) prioritized appointing federal judges — including Supreme Court justices — who favored a more restrained, text- and original-meaning-focused approach to constitutional interpretation. This was a deliberate, longer-term legal strategy: judicial appointments shape constitutional interpretation for decades beyond any single presidential term.",
        "THE COLD WAR ENDGAME — BUILDUP: Reagan's first term featured a major US military buildup and more confrontational rhetoric toward the Soviet Union, including the Strategic Defense Initiative (a proposed missile-defense system) — part of the administration's theory that renewed pressure, not just continued détente, would bring the USSR to the table or force it to compete beyond its means.",
        "THE COLD WAR ENDGAME — GORBACHEV, INF, AND 1989-91: Soviet leader Mikhail Gorbachev (from 1985) pursued glasnost (political openness) and perestroika (economic restructuring), reforms responding to the USSR's own severe internal economic stagnation. Reagan and Gorbachev negotiated the Intermediate-Range Nuclear Forces (INF) Treaty (1987), eliminating an entire class of nuclear missiles — a striking turn from the early-1980s buildup. Popular pro-democracy movements toppled Communist governments across Eastern Europe in 1989 (the Berlin Wall fell in November 1989), and the Soviet Union itself dissolved in 1991.",
        "MULTIPLE FACTORS, NOT ONE CAUSE: the Cold War's end is best explained by several factors together — sustained US military and economic pressure across decades, the Soviet economy's own long-building structural weaknesses (which perestroika was trying, and largely failing, to fix), and genuinely organic pro-democracy movements within Eastern European societies themselves. No single one of these alone fully explains why the Cold War ended when and how it did.",
      ],
      vocabulary: [
        {
          term: 'New Right',
          definition:
            'the coalition of economic conservatives, religious conservatives (e.g. the Moral Majority), and Cold War hawks that came together from the mid-1960s through the 1970s and elected Ronald Reagan in 1980.',
        },
        {
          term: 'supply-side economics',
          definition:
            'the economic theory, central to "Reaganomics," that cutting marginal tax rates spurs enough additional growth and investment to offset some of the resulting revenue loss.',
        },
        {
          term: 'PATCO strike',
          definition:
            "the 1981 strike by federal air-traffic controllers, illegal under federal law; Reagan fired the striking controllers, an event widely read as weakening organized labor's bargaining position.",
        },
        {
          term: 'INF Treaty',
          definition:
            'the 1987 Intermediate-Range Nuclear Forces Treaty between Reagan and Gorbachev, eliminating an entire class of nuclear missiles — a marker of the Cold War thaw following the early-1980s buildup.',
        },
        {
          term: 'glasnost / perestroika',
          definition:
            "Gorbachev-era Soviet reforms (from 1985): glasnost (political openness) and perestroika (economic restructuring), responses to the USSR's severe internal economic stagnation that preceded its 1991 dissolution.",
        },
      ],
      passageId: 'evelyn.passage.apush-reagan-inaugural.v1',
      estimatedMinutes: 8,
    },
    {
      id: 'worked-reagan-inaugural',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from Ronald Reagan's First Inaugural Address, January 20, 1981: \"In this present crisis, government is not the solution to our problem; government is the problem. From time to time we've been tempted to believe that society has become too complex to be managed by self-rule, that government by an elite group is superior to government for, by, and of the people. Well, if no one among us is capable of governing himself, then who among us has the capacity to govern someone else? All of us together, in and out of government, must bear the burden. The solutions we seek must be equitable, with no one group singled out to pay a higher price.\" What diagnosis is Reagan making of the era's crisis, and how does the final sentence complicate a simple \"just shrink government\" reading of the speech?",
      steps: [
        'SOURCE IT FIRST. January 20, 1981 — Reagan\'s first inaugural, delivered after a decade of stagflation, the 1979 oil shock, and the Iran hostage crisis (covered in the prior period). "This present crisis" refers to that accumulated economic and confidence crisis, not any single event.',
        'IDENTIFY THE CORE DIAGNOSIS. Reagan does not name a specific policy as the problem — he names GOVERNMENT ITSELF ("government is not the solution... government is the problem"). This reframes the era\'s troubles as a structural, not merely a policy-level, failure: too much government management, not simply the wrong management.',
        "TRACE THE ARGUMENT'S LOGIC. The rhetorical question — \"if no one among us is capable of governing himself, then who among us has the capacity to govern someone else?\" — argues that if ordinary citizens can't be trusted to self-govern, no elite group drawn from those same citizens should be trusted either. This is a democratic-self-rule argument for reducing government's reach, not a technical economic argument.",
        'DO NOT MISS THE QUALIFIER. The final sentence — "solutions we seek must be equitable, with no one group singled out to pay a higher price" — pairs the small-government diagnosis with an explicit fairness commitment. This complicates a reading of the speech as simply "cut spending and get out of the way": Reagan is also promising that whatever changes follow will be shared burden, not concentrated on one group.',
        "CONNECT TO THE DEBATED LEGACY. This pairing previews the decade's central historical debate: supporters can point to the diagnosis (government overreach) as the basis for the tax cuts and deregulation that followed; critics can invoke the SAME speech's fairness promise when arguing the era's actual outcomes — rising deficits, and inequality that widened rather than narrowed — did not match it. The passage supports both readings; it does not resolve the debate itself.",
        'STATE THE LINK TO THE COURSE THESIS. This inaugural address supplies the New Right coalition\'s founding diagnosis (government overreach) in the same speech that promises equity in whatever follows — exactly the tension the Reaganomics debate over growth versus deficits and inequality would play out over the following decade.',
      ],
      answer:
        'Reagan diagnoses the era\'s crisis as a structural problem with government itself — not a specific bad policy, but government having grown too large and too involved in managing a society it should instead let govern itself. His rhetorical question (if citizens can\'t govern themselves, how can an elite few govern them?) makes this a democratic-self-rule argument, not just an economic one. The final sentence, however, complicates a simple "just shrink government" reading: by promising that "solutions we seek must be equitable, with no one group singled out to pay a higher price," Reagan pairs the small-government diagnosis with an explicit fairness commitment. That pairing previews the decade\'s central historical debate — supporters cite the diagnosis as grounds for the tax cuts and deregulation that followed and credit them with ending stagflation, while critics invoke this same fairness promise when pointing out that deficits rose sharply and income gains were not evenly distributed. The passage supports both readings without settling which one is correct.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE domestic economic policy or action of the Reagan administration. (b) Briefly explain ONE specific piece of historical evidence that supports your answer to (a). (c) Briefly explain ONE reason historians and economists disagree about the Reagan-era economic program's overall legacy.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine Reagan-era domestic economic policy or action — e.g. the Economic Recovery Tax Act (1981) or Tax Reform Act (1986) cutting income tax rates (supply-side economics), or the firing of the striking PATCO air-traffic controllers (1981). No credit for a vague statement ("Reagan cut taxes") with no specific act or event named.',
            modelResponse:
              "One domestic economic policy was the Economic Recovery Tax Act of 1981, which significantly cut individual income tax rates based on supply-side theory — the idea that lower marginal rates would spur enough additional growth and investment to offset some of the resulting revenue loss.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence connected clearly to the policy named in (a). No credit for evidence unconnected to the stated policy or too generic to verify.',
            modelResponse:
              "The Tax Reform Act of 1986 followed the 1981 cuts by simplifying the tax code and lowering top marginal rates further, evidence that supply-side tax policy remained the administration's core economic approach throughout Reagan's two terms, not just a one-time 1981 measure.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate reason for disagreement over the Reagan-era economic legacy — e.g. the tension between crediting the tax cuts (with Federal Reserve policy) for ending stagflation and 1980s growth versus pointing to sharply rising federal deficits and widening income inequality during the same period. No credit for a one-sided claim presented as settled fact, or a vague, unsupported reason.",
            modelResponse:
              "Historians and economists disagree partly because both claims are supported by real evidence: the 1980s did see the end of 1970s-style stagflation and sustained economic growth, which supporters credit to the tax cuts, but federal deficits and the national debt also grew sharply because the tax cuts were not matched by equivalent spending cuts (defense spending rose), and income gains were not evenly distributed — critics point to that widening inequality and rising debt as evidence the program's benefits and costs were unevenly shared.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-cold-war-end',
      kind: 'misconception_check',
      question:
        'True or false: the Cold War ended solely because of sustained US military and economic pressure on the Soviet Union during the 1980s.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Single-factor causation — crediting one actor (US pressure) with an outcome that historians explain as the product of several factors operating together, and overlooking the Soviet Union\'s own internal weaknesses and the agency of Eastern European reform movements.',
          correctsTo:
            "FALSE. Historians generally explain the Cold War's end as the product of several factors combined, not any single cause. US military and economic pressure across the decades (culminating in the early-1980s buildup) was one real factor. But the Soviet Union's own long-building internal economic stagnation was at least as significant — it was the underlying problem Gorbachev's perestroika reforms were trying (and largely failing) to fix from 1985 onward. And the popular pro-democracy movements that toppled Communist governments across Eastern Europe in 1989 arose from those societies' own internal dynamics, not simply from American pressure. The INF Treaty (1987) itself resulted from negotiation between Reagan and Gorbachev, not US pressure alone forcing Soviet capitulation. Treating any one of these three factors as the sole cause oversimplifies a genuinely multi-causal historical outcome — exactly the kind of single-factor reasoning the AP exam asks you to avoid.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The New Right coalition (economic conservatives, religious conservatives like the Moral Majority, Cold War hawks) built over the 1960s-70s and elected Reagan in 1980.',
        'Reaganomics (supply-side tax cuts, 1981/1986) has a genuinely debated legacy: credited with ending stagflation and driving 1980s growth by supporters, criticized for sharply rising deficits and widening inequality by critics — both are legitimate historical positions.',
        'PATCO (1981) — firing striking federal air-traffic controllers — is widely read as weakening organized labor\'s bargaining position for years afterward.',
        "The Cold War's end (INF Treaty 1987, Eastern Europe 1989, USSR dissolution 1991) resulted from MULTIPLE factors together: sustained US pressure, the USSR's own internal economic stagnation, and organic Eastern European reform movements — not any single cause alone.",
        "Reagan's judicial appointment strategy aimed to shape constitutional interpretation for decades beyond his own presidency, not just to win immediate policy fights.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.2-9.3',
    cedTitle: 'The Reagan Era and the End of the Cold War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-reagan-inaugural.v1',
        chapter: '1981',
        note: 'Reagan First Inaugural Address — anchor document for the New Right\'s small-government diagnosis and its fairness qualifier.',
      },
    ],
  },
};
