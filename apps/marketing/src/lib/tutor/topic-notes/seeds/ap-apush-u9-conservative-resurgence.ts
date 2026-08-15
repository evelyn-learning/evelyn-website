/**
 * AP US History — Unit 9 CED 9.2-9.3: The Reagan Era and the End of the
 * Cold War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.conservative-resurgence.v1`. Covers the New Right
 * coalition, Reaganomics (presented with both the growth and the
 * deficit/inequality positions), PATCO, the conservative judicial
 * strategy, and the Cold War's multi-factor end — anchored by Reagan's
 * January 1981 First Inaugural Address.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_CONSERVATIVE_RESURGENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.conservative-resurgence.v1',
  course: 'AP United States History',
  cedUnit: 9,
  cedTopic: '9.2-9.3',
  cedTitle: 'The Reagan Era and the End of the Cold War',
  planId: 'evelyn.ap.apush.conservative-resurgence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.conservative-resurgence.v1' }],
  theory: [
    {
      loId: 'apush.conservative-resurgence',
      kind: 'definition',
      title: 'New Right',
      content:
        "The coalition of economic conservatives (lower taxes, less regulation), religious conservatives (the Moral Majority, founded 1979 by Jerry Falwell), and Cold War hawks that built over the 1960s-70s (rooted in Barry Goldwater's 1964 campaign) and elected Ronald Reagan in 1980.",
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'definition',
      title: 'supply-side economics',
      content:
        'The economic theory behind "Reaganomics": cutting marginal tax rates spurs enough additional growth and investment to offset some of the resulting revenue loss. Applied via the Economic Recovery Tax Act (1981) and Tax Reform Act (1986).',
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'definition',
      title: 'glasnost / perestroika',
      content:
        "Gorbachev-era Soviet reforms from 1985: glasnost (political openness) and perestroika (economic restructuring), responses to the USSR's severe internal economic stagnation that preceded its 1991 dissolution.",
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'event',
      title: "the tax revolt and religious right's rise (1978-79)",
      content:
        "California's Proposition 13 (1978) capped property-tax increases and inspired similar measures elsewhere; the Moral Majority (1979) organized evangelical voters around social and moral issues. Both fed into the New Right coalition that elected Reagan in 1980.",
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'framework',
      title: "Reaganomics' debated legacy (present both positions)",
      content:
        'Supporters: the 1980s recovery from stagflation and sustained growth, credited to the tax cuts alongside Federal Reserve anti-inflation policy. Critics: federal deficits and the national debt grew sharply (tax cuts not matched by equivalent spending cuts; defense spending rose), and income gains were unevenly distributed, widening inequality. Both are legitimate historical positions — the AP course does not expect a single verdict.',
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'event',
      title: 'PATCO (1981)',
      content:
        "The Professional Air Traffic Controllers Organization struck illegally (federal employees are barred from striking); Reagan fired roughly 11,000 controllers and banned them from federal employment — widely read as a signal event weakening organized labor's bargaining position afterward.",
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'framework',
      title: 'the conservative judicial strategy',
      content:
        'Reagan (and successor Republican administrations) prioritized appointing federal judges, including Supreme Court justices, favoring a restrained, text/original-meaning approach to constitutional interpretation — a deliberate strategy shaping constitutional interpretation for decades beyond any one presidency.',
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'event',
      title: 'buildup, the INF Treaty (1987), and 1989-91',
      content:
        "Reagan's first term featured a major military buildup and confrontational rhetoric toward the USSR. Reagan and Gorbachev negotiated the INF Treaty (1987), eliminating an entire class of nuclear missiles. Popular pro-democracy movements toppled Eastern European Communist governments in 1989 (Berlin Wall, November 1989); the USSR itself dissolved in 1991.",
    },
    {
      loId: 'apush.conservative-resurgence',
      kind: 'trap',
      title: "the Cold War's end was multi-causal, not single-cause",
      content:
        "Sustained US military/economic pressure across decades, the USSR's own long-building internal economic stagnation (which perestroika was trying, and largely failing, to fix), and organic Eastern European reform movements all contributed together — crediting any one factor alone as \"the\" cause of the Cold War's end oversimplifies the standard account.",
    },
  ],
  methods: [
    {
      title: 'Read a political diagnosis speech for its qualifiers, not just its headline claim',
      when_to_use:
        'Use this before analyzing any speech that states a sweeping diagnosis (e.g. "government is the problem") — check whether a later sentence qualifies or complicates that headline claim.',
      steps: [
        'IDENTIFY THE HEADLINE DIAGNOSIS the speech opens with.',
        'CHECK FOR A QUALIFIER later in the same passage that adds a condition (fairness, limits, exceptions) to that diagnosis.',
        'DO NOT treat the headline alone as the full argument — the qualifier is evidence the speaker anticipated a specific counterargument or debate.',
        'CONNECT the qualifier to how later historical debate over the policy actually played out.',
      ],
      example: {
        problem:
          'Reagan\'s 1981 inaugural says "government is the problem" but ends the same passage with "solutions we seek must be equitable, with no one group singled out to pay a higher price." What does the qualifier do?',
        solution:
          "It complicates a simple \"just shrink government\" reading — Reagan pairs the small-government diagnosis with an explicit fairness commitment, which is exactly what critics later invoked when arguing the era's actual deficits and inequality didn't match that promise.",
      },
      relatedLoIds: ['apush.conservative-resurgence'],
    },
  ],
  pointers: [
    { content: 'Reaganomics has a genuinely debated legacy — state BOTH the growth account and the deficit/inequality critique; do not present either as the settled answer.', kind: 'tip' },
    { content: "Containment/rollback distinction (from Unit 8) still matters here — Reagan's Cold War buildup was still within a containment framework, not a rollback of existing Communist states.", kind: 'tip' },
    { content: 'The #1 trap: crediting the Cold War\'s end to US pressure ALONE. Always name all three factors — US pressure, Soviet internal economic strain, Eastern European reform movements.', kind: 'trap' },
    { content: 'PATCO (1981) is about labor-movement weakening, not really about air-traffic-control policy — know why it is cited as a labor-history turning point.', kind: 'tip' },
    { content: 'Reagan\'s Brandenburg Gate remarks (1987) and the INF Treaty are two different things in the same general period — don\'t conflate a speech with a signed treaty.', kind: 'trap' },
  ],
};
