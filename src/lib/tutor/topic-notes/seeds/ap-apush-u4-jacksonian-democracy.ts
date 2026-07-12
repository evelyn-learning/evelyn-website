/**
 * AP US History — Unit 4 CED 4.8-4.9: Jacksonian Democracy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.jacksonian-democracy.v1`. Covers expanded white male
 * suffrage and the spoils system, the Bank War, the nullification
 * crisis, and Indian Removal (Worcester v. Georgia, the Trail of
 * Tears) — discussed in measured, factual terms.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_JACKSONIAN_DEMOCRACY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.jacksonian-democracy.v1',
  course: 'AP United States History',
  cedUnit: 4,
  cedTopic: '4.8-4.9',
  cedTitle: 'Jacksonian Democracy',
  planId: 'evelyn.ap.apush.jacksonian-democracy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.jacksonian-democracy.v1' }],
  theory: [
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'framework',
      title: 'expanded white male suffrage',
      content:
        'by the late 1820s-30s, most states had eliminated property-ownership requirements for voting, dramatically expanding the electorate for White men. Free Black men faced growing restrictions on voting in most states during this same period, and women of any race could not vote at all.',
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'definition',
      title: 'spoils system',
      content:
        "the practice of a newly elected administration replacing federal officeholders with its own political supporters, expanded significantly under Jackson; defenders called it democratizing government service, critics called it rewarding party loyalty over competence.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'definition',
      title: 'Bank War',
      content:
        "Jackson's fight against the Second Bank of the United States, which he viewed as an unaccountable tool of wealthy elites; culminated in his 1832 veto of its early recharter, framed in populist terms and central to his decisive 1832 reelection.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'definition',
      title: 'nullification',
      content:
        "the doctrine, associated with Vice President John C. Calhoun, that a state could declare a federal law void within its own borders if the state judged the law unconstitutional.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'event',
      title: 'the nullification crisis (1832-33)',
      content:
        "South Carolina, angered by a high protective tariff, invoked nullification to declare it void within the state and threatened secession. Jackson obtained the Force Bill authorizing federal enforcement, while Congress also passed a compromise tariff lowering rates enough to defuse the crisis — Jackson using assertive federal power despite his states'-rights sympathies on other issues.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'event',
      title: 'the Indian Removal Act (1830) and Worcester v. Georgia (1832)',
      content:
        "the Indian Removal Act authorized negotiating (and, in practice, coercing) treaties relocating Native American nations from the Southeast west of the Mississippi. The Cherokee challenged Georgia's authority in Worcester v. Georgia; the Supreme Court ruled in the Cherokees' favor, but the Jackson administration did not enforce the ruling, and removal proceeded.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'event',
      title: 'the Trail of Tears',
      content:
        "the late-1830s forced relocation of the Cherokee and other Southeastern nations, resulting in thousands of deaths from exposure, disease, and starvation during the journey west — a documented human catastrophe with immense, lasting costs.",
    },
    {
      loId: 'apush.jacksonian-democracy',
      kind: 'trap',
      title: '"democracy" expanded selectively, not universally',
      content:
        'Jacksonian democracy specifically expanded political participation for White men. It did not expand — and in some respects worsened — the standing of free Black Americans, Native Americans, or women during the same period.',
    },
  ],
  methods: [
    {
      title: 'Analyze a populist policy argument (like the Bank veto)',
      when_to_use:
        'Use on any Jacksonian-era document that frames a policy dispute as ordinary people versus a privileged elite, before evaluating whether the framing matches the policy\'s actual stakes and consequences.',
      steps: [
        'IDENTIFY WHO THE DOCUMENT CLAIMS TO DEFEND (e.g. "farmers, mechanics, and laborers") and who it casts as the threat (e.g. "the rich and powerful").',
        'CHECK WHAT SPECIFIC POLICY IS AT STAKE and what it would concretely change.',
        'EXPLAIN WHY THE POPULIST FRAME WAS POLITICALLY EFFECTIVE — usually because it turns a technical dispute into a simple moral choice a broad coalition can rally behind.',
        'CONNECT TO THE BROADER JACKSONIAN PATTERN — the same populist logic recurs across the spoils system, the Bank veto, and Jackson\'s general appeal.',
      ],
      example: {
        problem: 'Why was Jackson\'s Bank veto message politically effective?',
        solution:
          'Jackson framed the Bank as an "artificial distinction" granting exclusive privilege to the already rich and powerful, at the expense of "the humble members of society-the farmers, mechanics, and laborers". This turned a complex monetary-policy dispute into a simple populist referendum, which helped make the veto a central, winning issue in his 1832 reelection.',
      },
      relatedLoIds: ['apush.jacksonian-democracy'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: "Jacksonian democracy" expanded rights for White men specifically — free Black men and Native Americans lost ground in the same period, and women gained nothing.', kind: 'trap' },
    { content: 'The Bank veto was a defining political and economic confrontation, not a neutral policy dispute — it was central to Jackson\'s 1832 reelection.', kind: 'trap' },
    { content: 'Worcester v. Georgia (1832) ruled FOR the Cherokee — but the ruling was not enforced. Know both halves: the decision AND its non-enforcement.', kind: 'tip' },
    { content: 'Nullification and Indian Removal both show Jackson using federal power assertively — do not assume Jackson was reflexively a states\'-rights president; the nullification response contradicts that.', kind: 'tip' },
    { content: 'The Trail of Tears is a documented catastrophe (thousands of deaths) — cite it factually and specifically, not in vague or minimizing terms.', kind: 'tip' },
  ],
};
