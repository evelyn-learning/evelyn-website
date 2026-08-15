/**
 * AP US Government & Politics — CED Unit 4.1-4.4: Political Socialization &
 * Public Opinion.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.socialization-opinion.v1`. Covers the five agents of
 * political socialization (family, school, peers, media, religion);
 * generational (cohort) effects vs. lifecycle (aging) effects; the five
 * core American values; and globalization's influence on public opinion.
 *
 * DATA ATTRIBUTION: the age-ideology figures referenced below (conservative
 * self-identification rising 23% -> 33% -> 43% -> 45% with age; liberal
 * falling 34% -> 25% -> 19% then ticking up to 21%) are GALLUP's 2021
 * calendar-year polling ("U.S. Political Ideology Steady; Conservatives,
 * Moderates Tie," news.gallup.com/poll/388988), described via
 * `evelyn.passage.apgov-ideology-age-table.v1` — every reference to this
 * data below is attributed to GALLUP, never ANES.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_SOCIALIZATION_OPINION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.socialization-opinion.v1',
  course: 'AP US Government & Politics',
  cedUnit: 4,
  cedTopic: '4.1-4.4',
  cedTitle: 'Political Socialization & Public Opinion',
  planId: 'evelyn.ap.apgov.socialization-opinion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [
    { type: 'plan', planId: 'evelyn.ap.apgov.socialization-opinion.v1' },
    {
      type: 'other',
      book: 'evelyn.passage.apgov-ideology-age-table.v1',
      chapter: 'Gallup, "U.S. Political Ideology Steady; Conservatives, Moderates Tie" (2021 calendar-year polling).',
    },
  ],
  theory: [
    {
      loId: 'apgov.socialization-opinion',
      kind: 'definition',
      title: 'political socialization',
      content:
        'The lifelong process by which people acquire their political attitudes, values, and knowledge, primarily through family, school, peers, media, and religion. It happens gradually, through repeated exposure to these "agents," not through any single deliberate decision.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'concept',
      title: 'the five agents of socialization',
      content:
        'FAMILY: typically the strongest, earliest influence — party identification especially is passed down through everyday conversation, well before a child independently evaluates policy. SCHOOL: civics/history curricula, the Pledge of Allegiance, and school structures (student government) transmit civic knowledge and democratic values. PEERS: friend groups increasingly shape attitudes through adolescence and young adulthood, especially on newly salient issues. MEDIA: news, entertainment, and social media shape both WHAT people think about (agenda-setting) and how they interpret it — usually filtered through family/peer discussion, not absorbed in isolation. RELIGION: shapes attitudes both directly (explicit teaching on moral/social questions) and indirectly (through the community and social networks it builds).',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'definition',
      title: 'generational (cohort) effect',
      content:
        'A political attitude shared by people who came of age during the same historical period, formed by that period\'s events, and persisting across the cohort\'s lifetime even as its members age. The difference between age groups reflects WHEN they came of age, not aging itself.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'definition',
      title: 'lifecycle (aging) effect',
      content:
        'A political attitude shift that occurs as an individual personally ages, independent of which historical period they came of age in — the same person becomes more conservative (or liberal) simply by growing older, regardless of birth cohort.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'concept',
      title: 'reading the Gallup age-ideology pattern correctly',
      content:
        'Gallup\'s 2021 calendar-year polling shows conservative self-identification rising steadily with age (23% ages 18-29 -> 33% ages 30-49 -> 43% ages 50-64 -> 45% ages 65+), with the steepest jump between the two middle groups. Liberal self-identification is NOT a perfect mirror image: it falls across the first three groups (34% -> 25% -> 19%) but ticks up slightly for the oldest group (21% for 65+, versus 19% for 50-64). Political-socialization research generally attributes this pattern MORE to a generational/cohort effect than to a pure lifecycle/aging effect — each cohort\'s formative political era persisting over its lifetime, rather than individuals simply drifting rightward as they personally age. All figures here are GALLUP\'s, not ANES.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'concept',
      title: 'the five core American values',
      content:
        'INDIVIDUALISM (personal responsibility and self-reliance are primary; government is not the first answer to every problem). EQUALITY OF OPPORTUNITY (everyone should have a fair chance to succeed — distinct from equality of OUTCOME, and people disagree about what a "fair chance" requires). FREE ENTERPRISE (a market economy with limited government interference is the default economic arrangement). RULE OF LAW (officials and citizens alike are bound by publicly known, generally applicable law). LIMITED GOVERNMENT (government\'s power is bounded, not open-ended). These values are broadly SHARED across the ideological spectrum — common ground, not a partisan checklist — even though liberals, conservatives, and libertarians weigh and apply them differently.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'concept',
      title: 'globalization\'s influence on public opinion',
      content:
        'Increased international trade, migration, communication, and cultural exchange expose Americans to comparative reference points (e.g. how other countries handle healthcare or economic policy) that did not previously factor into domestic debate as readily. Globalization also raises new domestic fault lines (trade\'s effect on manufacturing jobs, immigration policy, international institutions\' role) that did not exist in the same form for earlier generations — itself a source of generational difference in attitudes.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'trap',
      title: '"moderate" is a substantive position, not an absence of opinion',
      content:
        '"Moderate" is a real self-identification on the SAME liberal-to-conservative scale as "liberal" and "conservative" — in Gallup\'s 2021 data, moderates make up 32-41% of respondents depending on age group, often the single largest category. Choosing "moderate" typically reflects holding a mix of liberal- and conservative-leaning positions across issues, or genuinely centrist views — not disengagement. Political engagement and ideological self-placement are separate things: a moderate can be just as engaged as a strong partisan.',
    },
    {
      loId: 'apgov.socialization-opinion',
      kind: 'trap',
      title: 'the liberal trend is not simply the conservative trend reversed',
      content:
        'Don\'t assume the two ideology trends in Gallup\'s age data must mirror each other. Conservative identification rises at every age-group interval (23/33/43/45), but liberal identification is NOT strictly monotonic — it falls through the 50-64 group (34/25/19) before ticking UP slightly for 65+ (21%). Describing the liberal trend as "the exact opposite" of the conservative trend overstates the pattern.',
    },
  ],
  methods: [
    {
      title: 'Identify the agent of socialization or core value in a scenario',
      when_to_use:
        'Use this whenever a prompt describes a person\'s upbringing, schooling, social circle, media habits, or religious background and asks which agent (or core value) is illustrated.',
      steps: [
        'ASK WHO OR WHAT IS DOING THE SHAPING: parents/household (family), curriculum/school structure (school), friend groups (peers), news/entertainment/social platforms (media), or a faith community (religion).',
        'CHECK WHETHER THE SCENARIO INSTEAD DESCRIBES AN ECONOMIC OR GOVERNANCE PRINCIPLE (market allocation, personal responsibility, equal chances, bounded government, rule-following) — that signals a CORE VALUE, not an agent of socialization.',
        'IF THE SCENARIO INVOLVES INTERNATIONAL EXPOSURE (travel, comparing U.S. policy to another country\'s), classify it as GLOBALIZATION\'S INFLUENCE, distinct from the five domestic agents.',
        'EXPLAIN THE MECHANISM, not just the label — e.g. family transmits attitudes through repeated everyday exposure before independent evaluation is possible.',
      ],
      example: {
        problem: 'A student\'s parents discuss self-reliance and skepticism of government aid at dinner regularly. What agent of socialization is illustrated?',
        solution:
          'FAMILY — the earliest and strongest agent, transmitting attitudes through repeated everyday conversation well before the child can independently evaluate policy alternatives.',
      },
      relatedLoIds: ['apgov.socialization-opinion'],
    },
    {
      title: 'Distinguish a generational (cohort) effect from a lifecycle (aging) effect',
      when_to_use:
        'Use this whenever a prompt presents an age-based ideology or opinion pattern and asks which explanation the pattern favors.',
      steps: [
        'STATE THE PATTERN PRECISELY using the actual figures given — note whether it rises/falls at every interval or has an exception (e.g. Gallup\'s liberal share ticks up at 65+ rather than continuing to fall).',
        'NAME THE TWO COMPETING HYPOTHESES: lifecycle (individuals personally shift as they age) vs. generational/cohort (each age group\'s outlook reflects its formative era and persists).',
        'APPLY THE COHORT EXPLANATION WHEN THAT IS WHAT THE RESEARCH FAVORS: political-socialization research generally reads the Gallup age-ideology pattern as more generational than lifecycle.',
        'STATE THE PREDICTIVE STAKES: a lifecycle reading predicts today\'s younger cohort will resemble today\'s older cohort once it ages; a generational reading predicts the younger cohort mostly carries its current profile forward, so aggregate ideology shifts gradually through generational replacement.',
      ],
      relatedLoIds: ['apgov.socialization-opinion'],
    },
  ],
  pointers: [
    { content: 'All age-ideology figures in this unit (23/33/43/45 conservative; 34/25/19/21 liberal) are GALLUP\'s 2021 calendar-year polling — never attribute them to ANES.', kind: 'trap' },
    { content: 'The liberal trend is not a mirror image of the conservative trend: it falls through age 64 but ticks up slightly for 65+. Don\'t describe it as strictly monotonic.', kind: 'trap' },
    { content: '"Moderate" is a substantive ideological self-identification, often the single largest category by age group — not an absence of political opinion.', kind: 'tip' },
    { content: 'Political-socialization research favors a generational (cohort) reading of the Gallup age pattern over a pure lifecycle (aging) reading — know which prediction each implies for the next twenty years.', kind: 'tip' },
    { content: 'Core American values (individualism, equality of opportunity, free enterprise, rule of law, limited government) are shared across ideologies, not a partisan checklist — don\'t assign them to only one side.', kind: 'tip' },
    { content: 'Globalization is a distinct source of opinion change from the five domestic agents — look for international/comparative exposure (travel, cross-country comparison) as the tell.', kind: 'tip' },
  ],
};
