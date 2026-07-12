/**
 * AP US History — Unit 8 CED 8.14-8.15: Nixon, Watergate, and the Crises
 * of the 1970s.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.seventies-crisis.v1`. Covers détente/China and the
 * "southern strategy," Watergate, the oil shocks and stagflation, the
 * environmental movement, 1970s feminism (ERA, Roe described), and the
 * Carter administration's foreign-policy crises. No passage anchor (plan
 * has none).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SEVENTIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.seventies-crisis.v1',
  course: 'AP United States History',
  cedUnit: 8,
  cedTopic: '8.14-8.15',
  cedTitle: 'Nixon, Watergate, and the Crises of the 1970s',
  planId: 'evelyn.ap.apush.seventies-crisis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.seventies-crisis.v1' }],
  theory: [
    {
      loId: 'apush.seventies-crisis',
      kind: 'definition',
      title: 'détente',
      content:
        'Nixon-era policy easing US-Soviet Cold War tension through arms control (SALT I, 1972) and expanded diplomacy, including the 1972 opening to Communist China — a managed easing with the USSR/China specifically, not a general US retreat from Cold War competition (Vietnam continued in parallel).',
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: 'the "southern strategy"',
      content:
        "Nixon and Republican strategists used coded appeals (states' rights, busing, \"law and order\") to win over traditionally Democratic white Southern voters — part of a longer-term realignment of the South toward the Republican party.",
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: 'Watergate (1972-74)',
      content:
        "Operatives connected to Nixon's re-election campaign broke into DNC offices at the Watergate complex; the scandal centered on the White House's COVER-UP, exposed after United States v. Nixon (1974) forced release of Oval Office tapes. Nixon resigned in August 1974 rather than face near-certain impeachment; later pardoned by Gerald Ford.",
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'definition',
      title: 'stagflation',
      content:
        "The 1970s combination of high inflation AND high unemployment occurring simultaneously — unusual by prior economic theory and hard to fix with standard tools. Worsened by the 1973 Arab oil embargo (retaliation for US support of Israel in the Yom Kippur War) and the 1979 oil shock (Iranian Revolution).",
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: 'the environmental movement (Earth Day, EPA)',
      content:
        'The first Earth Day (April 1970) marked a nationwide surge in environmental concern; the same year Nixon signed legislation creating the EPA and the Clean Air Act, part of a wave of early-1970s federal environmental regulation.',
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: '1970s feminism — the ERA fight',
      content:
        'Building on writers like Betty Friedan (1963, described here, never quoted — copyrighted), the women\'s movement pushed the ERA through Congress in 1972, but it fell short of ratification by three-fourths of states by its extended 1982 deadline, amid organized opposition (Phyllis Schlafly) arguing it would undermine traditional family roles.',
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: 'Roe v. Wade (1973) — described',
      content:
        "The Supreme Court held a constitutional right to privacy encompassed a woman's decision to have an abortion, while permitting states to regulate more closely as pregnancy progresses (the trimester framework) — one of the most contested holdings in modern American law.",
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'event',
      title: "Carter's foreign policy and the Iran hostage crisis",
      content:
        'Carter (1977-81) emphasized human rights in foreign policy and brokered the Camp David Accords (1978, Egypt-Israel peace). The Iran hostage crisis (from November 1979, 444 days) severely damaged his presidency and projected an image of American weakness abroad.',
    },
    {
      loId: 'apush.seventies-crisis',
      kind: 'trap',
      title: 'détente did not end the Cold War',
      content:
        'Détente eased tensions specifically with the USSR/China through arms control and diplomacy but did not last: tensions rose again after the Soviet invasion of Afghanistan (1979), and Reagan pursued renewed military buildup in the early 1980s. The Cold War itself continued until the late 1980s/1991.',
    },
  ],
  methods: [
    {
      title: 'Resolve an apparent contradiction between "easing tension" and "continued competition"',
      when_to_use:
        'Use when a prompt presents a foreign-policy shift (like détente) alongside continued conflict elsewhere and asks how both can be true of the same administration.',
      steps: [
        'DEFINE THE EASING POLICY PRECISELY — what specific tools does it use, and with WHICH rival(s)?',
        'CHECK WHETHER THE EASING IS LIMITED TO THOSE SPECIFIC RIVALS, or claimed to be a general retreat from all competition.',
        'IDENTIFY THE SEPARATE CONFLICT (e.g. Vietnam) and its own logic, independent of the eased relationship.',
        'STATE THE CONCLUSION: the easing was a tactic within continued competition, not a general disengagement.',
      ],
      example: {
        problem: 'How can Nixon pursue détente with the USSR/China while continuing the Vietnam War?',
        solution:
          'Détente was a managed easing of tension with the USSR and China specifically (arms control, diplomatic recognition) — not a general US retreat from Cold War competition. The China opening was itself a Cold War calculation to gain leverage over Moscow. Vietnam was treated as a separate regional conflict, so continuing it did not contradict pursuing détente elsewhere.',
      },
      relatedLoIds: ['apush.seventies-crisis'],
    },
  ],
  pointers: [
    { content: 'Watergate\'s damage came from the COVER-UP, not just the break-in — always name United States v. Nixon (1974) as the mechanism that exposed it.', kind: 'frq-vocab' },
    { content: 'Stagflation combines high inflation AND high unemployment — a pairing standard theory of the time did not expect; tie it to the 1973/1979 oil shocks.', kind: 'tip' },
    { content: 'Détente ≠ end of Cold War. Tensions resumed after the 1979 Soviet invasion of Afghanistan; the Cold War ran another decade-plus.', kind: 'trap' },
    { content: 'Never quote Betty Friedan or Roe v. Wade\'s opinion directly on this topic — describe the argument/holding in your own words to keep tone measured.', kind: 'gotcha' },
    { content: 'The ERA passed Congress (1972) but failed RATIFICATION by states (1982 deadline) — distinguish congressional passage from state ratification failure.', kind: 'trap' },
  ],
};
