/**
 * AP US History — CED Unit 8.14-8.15: Nixon, Watergate, and the Crises of
 * the 1970s.
 *
 * Period-8 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale). No passage
 * is wired to this plan: the period block specifies "no passage" for this
 * LO, so the worked example instead performs a close analytical read of a
 * described policy contradiction (détente alongside continued Cold War
 * competition) rather than a primary-source excerpt.
 *
 * COPYRIGHT / SENSITIVITY NOTE — ROE V. WADE (1973) AND BETTY FRIEDAN: Roe
 * is described in outline (holding + trimester framework), not quoted, to
 * keep the tone measured on a sensitive and contested topic; Betty
 * Friedan's "The Feminine Mystique" (1963) is still under copyright and is
 * likewise described entirely in the plan's own words, with ZERO quoted
 * text from either source.
 *
 * Covers: Nixon (détente/China, the "southern strategy"), Watergate,
 * the 1970s oil shocks and stagflation, the environmental movement
 * (Earth Day, EPA), 1970s feminism (the ERA fight, Roe described),
 * and Carter (human-rights foreign policy, the Iran hostage crisis).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_SEVENTIES: LessonPlan = {
  id: 'evelyn.ap.apush.seventies-crisis.v1',
  title: 'U8.14-8.15 Nixon, Watergate, and the Crises of the 1970s',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.seventies-crisis',
      description:
        'Explain the significance of Nixon\'s foreign policy (détente, the opening to China) and the "southern strategy," Watergate, the 1970s oil shocks and stagflation, the environmental and feminist movements of the decade, and the Carter administration\'s human-rights foreign policy and the Iran hostage crisis.',
      standard: 'AP-APUSH-8.14',
    },
  ],
  prerequisites: ['apush.sixties-vietnam'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the 1970s as a decade defined by the erosion of confidence in institutions that had seemed stable for a generation — the presidency, the economy, and American global power alike.',
      script:
        "By 1968, Americans had lived through more than two decades in which the presidency generally commanded trust, the economy generally grew steadily, and the United States generally seemed like the world's unquestioned dominant power. The 1970s took all three of those assumptions apart, one at a time. A president resigned rather than face removal from office for covering up a break-in. The economy produced a combination — rising prices AND rising unemployment together — that mainstream economics had insisted couldn't happen at the same time. And American diplomats found themselves negotiating with a Communist superpower and a formerly hostile Communist government as equals, then watching American hostages held for over a year by a country the US could not simply force into submission. Today we trace how each of these came apart, and why none of them fully recovered by decade's end.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-seventies-crises',
      kind: 'concept',
      goal: 'Explain Nixon\'s foreign policy and "southern strategy," Watergate, the 1970s oil shocks and stagflation, the era\'s environmental and feminist movements, and the Carter administration\'s foreign-policy crises.',
      keyIdeas: [
        "NIXON'S FOREIGN POLICY — DÉTENTE AND CHINA: President Nixon pursued a policy of DÉTENTE (an easing of tensions) with the Soviet Union, including the SALT I arms-control agreement (1972) limiting certain nuclear weapons. In a major diplomatic surprise, Nixon also traveled to Communist China in 1972, opening formal relations with a government the US had refused to recognize since the Communist revolution of 1949 — a strategic move partly meant to increase US leverage over the Soviet Union by improving relations with its Communist rival.",
        "THE \"SOUTHERN STRATEGY\": Nixon and Republican strategists pursued a political strategy aimed at winning over white Southern voters who had traditionally voted Democratic, using coded appeals around states' rights, busing, and \"law and order\" rather than explicit racial language — contributing to a longer-term political realignment in which the once solidly Democratic South became increasingly Republican in subsequent decades.",
        "WATERGATE (1972-74): operatives connected to Nixon's re-election campaign broke into the Democratic National Committee's offices at the Watergate complex in 1972; the ensuing scandal centered less on the break-in itself than on the White House's sustained COVER-UP of its involvement. Congressional investigation and the Supreme Court's order that Nixon turn over secret Oval Office tape recordings (United States v. Nixon, 1974) revealed his direct involvement in the cover-up. Facing near-certain impeachment and removal, Nixon resigned in August 1974 — the only US president to do so — and was later pardoned by his successor, Gerald Ford.",
        "THE OIL SHOCKS AND STAGFLATION: in 1973, Arab oil-producing nations imposed an embargo on the US (in retaliation for American support of Israel in the Yom Kippur War), causing fuel shortages and a sharp spike in oil prices; a second oil shock followed in 1979 amid the Iranian Revolution. Combined with other economic pressures, the decade produced STAGFLATION — the historically unusual combination of high inflation AND high unemployment occurring at the same time, which conventional economic theory of the era had not expected to see together, and which proved difficult for policymakers to fix with the era's standard tools.",
        "THE ENVIRONMENTAL MOVEMENT: growing public concern about pollution and environmental degradation culminated in the first Earth Day (April 1970), a nationwide day of environmental demonstrations and awareness-raising. The same year, Nixon (despite his generally conservative domestic instincts) signed legislation creating the Environmental Protection Agency (EPA) and signed the Clean Air Act, part of a wave of federal environmental regulation in the early 1970s.",
        "1970s FEMINISM — THE ERA FIGHT AND ROE (DESCRIBED): the women's movement gained new organizational strength in the 1970s, building on the arguments of writers like Betty Friedan (described here in the plan's own words, never quoted), whose 1963 book had argued that many educated, middle-class women experienced deep dissatisfaction with a domestic role that offered them no outlet beyond homemaking. Congress passed the Equal Rights Amendment (ERA) in 1972, but it fell short of ratification by the required three-fourths of states by its extended 1982 deadline, amid organized opposition (notably led by Phyllis Schlafly) arguing the amendment would undermine traditional family roles and protections. In Roe v. Wade (1973), the Supreme Court held that a constitutional right to privacy encompassed a woman's decision to have an abortion, while permitting states to regulate abortion more closely as a pregnancy progressed — a holding that became, and remains, one of the most contested in modern American law.",
        "CARTER'S FOREIGN POLICY: President Jimmy Carter (1977-81) emphasized human rights as an explicit element of US foreign policy, and brokered the Camp David Accords (1978), a peace agreement between Egypt and Israel. His presidency was severely damaged by the Iran hostage crisis (beginning November 1979), in which Iranian revolutionaries seized the US embassy in Tehran and held American diplomatic personnel hostage for 444 days — a prolonged crisis that projected an image of American weakness abroad and contributed heavily to Carter's 1980 re-election defeat.",
      ],
      vocabulary: [
        {
          term: 'détente',
          definition:
            "Nixon-era policy of easing US-Soviet Cold War tensions through arms-control agreements (SALT I, 1972) and expanded diplomacy, including the 1972 opening to Communist China.",
        },
        {
          term: 'Watergate',
          definition:
            "the 1972-74 scandal originating in a break-in at Democratic Party offices, centered on the Nixon White House's cover-up of its involvement; led to Nixon's resignation in August 1974.",
        },
        {
          term: 'stagflation',
          definition:
            'the 1970s combination of high inflation and high unemployment occurring simultaneously — unusual by prior economic theory and difficult to address with standard policy tools; worsened by the 1973 and 1979 oil shocks.',
        },
        {
          term: 'Equal Rights Amendment (ERA)',
          definition:
            'a proposed constitutional amendment guaranteeing equal rights regardless of sex; passed by Congress in 1972 but fell short of ratification by three-fourths of states by its extended 1982 deadline.',
        },
        {
          term: 'Iran hostage crisis',
          definition:
            'the 444-day (beginning November 1979) holding of American diplomatic personnel in Tehran by Iranian revolutionaries; severely damaged the Carter administration and contributed to his 1980 election defeat.',
        },
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'worked-detente-contradiction',
      kind: 'worked_example',
      problem:
        'Nixon signed the SALT I arms-control treaty with the Soviet Union in 1972 and opened formal relations with Communist China the same year — both often described as "easing" Cold War tensions. At the very same time, the United States continued fighting an active war against a Communist government in Vietnam, and Nixon significantly expanded US military spending and covert Cold War operations elsewhere in the world. How can BOTH of these be accurate descriptions of Nixon-era foreign policy, and what does that combination reveal about what "détente" actually meant?',
      steps: [
        'IDENTIFY THE APPARENT TENSION. Easing tensions with the two largest Communist powers (USSR, China) sounds like a retreat from Cold War competition; continuing an active war against a Communist government and expanding military/covert activity elsewhere sounds like the opposite. Both are accurate for the same administration in the same years.',
        'RESOLVE IT BY DEFINING DÉTENTE PRECISELY. Détente meant a more STABLE, MANAGED relationship with the Soviet Union and China specifically — arms-control limits, diplomatic recognition, expanded trade and contact — not a general American retreat from Cold War competition everywhere. It was a shift in HOW the US competed with its two main Communist rivals, not an end to competing with Communism as a whole.',
        'CONNECT THE CHINA OPENING TO STRATEGY, NOT SENTIMENT. Nixon\'s opening to China was explicitly designed to increase US leverage over the Soviet Union, by improving relations with Moscow\'s major Communist rival — a Cold War CALCULATION (playing rivals against each other), not a sign the administration had abandoned containment as a goal.',
        'EXPLAIN WHY VIETNAM CONTINUED ANYWAY. Vietnam was, in the administration\'s own framing, a separate, regional conflict against a specific Communist government already at war with a US ally — détente with Moscow and Beijing did not require ending US involvement there, and in practice Nixon continued (and for a time expanded) US military action in Southeast Asia even as he pursued arms control with the USSR.',
        'STATE THE BROADER LESSON. "Détente" describes a specific, managed easing of tension with the USSR and China through arms control and diplomacy — it was a TACTIC within continued Cold War competition, not a policy of general disengagement, and it is a mistake to read it as ending, or even pausing, the broader Cold War contest.',
      ],
      answer:
        'Both are accurate because "détente" described a specific, managed easing of tension with the Soviet Union and China through tools like the SALT I arms-control treaty and new diplomatic recognition — not a general American retreat from Cold War competition. The China opening was itself a Cold War calculation, designed to increase US leverage over the Soviet Union by improving relations with its Communist rival, not a sign of abandoning containment. Vietnam, in the administration\'s framing, was a separate regional conflict against a specific Communist government already at war with a US ally, so pursuing détente with Moscow and Beijing did not require ending US involvement there. Détente was a tactic within continued Cold War competition, not a policy of general disengagement from it.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way the Watergate scandal damaged public trust in the presidency. (b) Briefly explain ONE specific economic development of the 1970s and ONE of its causes. (c) Briefly explain ONE significant development in the women's movement during the 1970s.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes how Watergate damaged trust — e.g. the White House cover-up of its involvement in the DNC break-in, the Supreme Court forcing release of the Oval Office tapes (United States v. Nixon, 1974), or Nixon\'s resignation to avoid near-certain impeachment. No credit for a vague statement ("Nixon did something wrong") with no specific mechanism named.',
            modelResponse:
              "Watergate damaged trust because the scandal centered not just on the 1972 break-in at Democratic Party offices but on the Nixon White House's sustained cover-up of its involvement, which the Supreme Court's order (United States v. Nixon, 1974) forcing release of secret Oval Office tapes ultimately exposed — leading Nixon to resign in 1974 rather than face near-certain impeachment.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific 1970s economic development and a specific cause — e.g. stagflation caused partly by the 1973 oil embargo (or the 1979 oil shock). No credit for a vague or unconnected economic claim.',
            modelResponse:
              "One development was stagflation — the unusual combination of high inflation and high unemployment occurring at the same time — caused partly by the 1973 Arab oil embargo (imposed in retaliation for US support of Israel in the Yom Kippur War), which sharply raised oil prices and fuel costs across the economy.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate 1970s feminist-movement development — e.g. the ERA\'s passage by Congress (1972) and failed ratification by 1982, or Roe v. Wade (1973) establishing a constitutional right to abortion subject to state regulation as pregnancy progresses. No credit for a vague or inaccurate claim.',
            modelResponse:
              "Congress passed the Equal Rights Amendment in 1972, but it fell short of ratification by the required three-fourths of states by its extended 1982 deadline, facing organized opposition (notably led by Phyllis Schlafly) that argued it would undermine traditional family roles and legal protections for women.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-detente-ended-cold-war',
      kind: 'misconception_check',
      question:
        'True or false: détente in the early-to-mid 1970s ended the Cold War.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Confusing a temporary, managed EASING of US-Soviet tension (détente) with a permanent END to Cold War competition, rather than recognizing détente as one phase within a Cold War that continued for another decade and a half.',
          correctsTo:
            'FALSE. Détente eased tensions with the Soviet Union and China through specific tools — arms control (SALT I, 1972), diplomatic recognition, expanded trade — but it did not end Cold War competition, and it did not last. Tensions rose again by the end of the 1970s, especially after the Soviet invasion of Afghanistan (1979), and the early 1980s under President Reagan saw a renewed military buildup and sharply more confrontational rhetoric toward the USSR. The Cold War itself did not end until the late 1980s/1991, roughly two decades after détente began — a reminder that détente was a specific policy phase, not a resolution of the broader conflict.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Détente (SALT I, the 1972 opening to China) eased tension with the USSR and China specifically — it was a Cold War tactic, not an end to Cold War competition, and did not survive the decade unchanged.',
        "Watergate (1972-74) damaged trust in the presidency less through the original break-in than through the White House's cover-up, exposed via United States v. Nixon (1974); Nixon resigned rather than face impeachment.",
        'The 1973 and 1979 oil shocks fed stagflation — high inflation and high unemployment together — challenging both economic theory and standard policy tools.',
        'The EPA and Earth Day (1970) marked new federal environmental commitment; the ERA passed Congress in 1972 but failed ratification by 1982, while Roe v. Wade (1973, described here) established a contested constitutional abortion right.',
        "Carter's human-rights foreign policy and the Camp David Accords (1978) were overshadowed by the 444-day Iran hostage crisis (from November 1979), which badly damaged his presidency.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.14-8.15',
    cedTitle: 'Nixon, Watergate, and the Crises of the 1970s',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
