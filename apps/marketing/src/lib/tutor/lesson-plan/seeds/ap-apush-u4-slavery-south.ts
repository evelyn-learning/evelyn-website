/**
 * AP US History — CED Unit 4.12-4.13: African Americans in the
 * Antebellum South.
 *
 * Period-4 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale). Covers the cotton gin's expansion of cotton cultivation,
 * the internal slave trade, the planter/yeoman social structure,
 * enslaved family, culture, and resistance (including Nat Turner's
 * 1831 rebellion), and the hardening of proslavery ideology in
 * response. Measured, exam-neutral tone throughout, per the Global
 * Constraints.
 *
 * Anchor text: William Lloyd Garrison, The Liberator No. 1 (1831) —
 * evelyn.passage.apush-garrison-liberator.v1 — used here as the
 * abolitionist COUNTERPOINT to hardening Southern proslavery ideology
 * (quoted only as the short excerpt already seeded), not as a Southern
 * document itself.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_SLAVERY_SOUTH: LessonPlan = {
  id: 'evelyn.ap.apush.slavery-south.v1',
  title: 'U4.12 African Americans in the Antebellum South',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.slavery-south',
      description:
        "Explain how the cotton gin expanded cotton cultivation and the internal slave trade, describe the antebellum South's planter and yeoman social structure, and explain enslaved people's family life, culture, and resistance (including Nat Turner's 1831 rebellion) alongside the hardening of proslavery ideology it provoked.",
      standard: 'AP-APUSH-4.12',
    },
  ],
  prerequisites: ['apush.jacksonian-democracy'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish that a single mechanical invention reshaped the entire economic and social structure of the antebellum South, and that this system provoked both resistance from within it and a hardening ideological defense.',
      script:
        "In 1793, a single machine — the cotton gin — solved a problem that had limited how much cotton could be profitably grown: separating cotton fibers from their seeds by hand was slow and expensive. The gin did it far faster. Within a few decades, cotton cultivation exploded across the Deep South, and with it, the demand for enslaved labor to plant and pick it. That single invention reorganized an entire region's economy, its social hierarchy, and the lives of millions of enslaved people forced to work that land. Enslaved communities resisted this system in many ways, from everyday acts of resistance to the ultimate risk of open rebellion — and each act of resistance pushed White Southern defenders of slavery toward a harder, more absolute ideological defense of the system. Today we're tracing how one invention reshaped a region, and how the people living under that system responded to it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-slavery-south',
      kind: 'concept',
      goal: "Explain the cotton gin's economic effects, the internal slave trade, the planter/yeoman social structure, enslaved family and resistance, and hardening proslavery ideology.",
      keyIdeas: [
        'THE COTTON GIN (1793) AND COTTON\'S EXPANSION: Eli Whitney\'s cotton gin mechanized the separation of cotton fiber from seed, making short-staple cotton — which grew well across much of the Deep South — hugely profitable to cultivate at scale. Cotton production and cotton-growing territory expanded dramatically across the early 1800s, making the American South the world\'s dominant cotton supplier and tying the region\'s economy tightly to international (especially British) textile manufacturing.',
        "THE INTERNAL SLAVE TRADE: this same expansion drove a massive INTERNAL SLAVE TRADE — the forced sale and relocation of enslaved people from the Upper South (Virginia, Maryland) to the expanding cotton lands of the Deep South (Alabama, Mississippi, Louisiana). This trade routinely separated enslaved families, a devastating consequence directly tied to cotton's economic expansion rather than a separate phenomenon.",
        "PLANTER AND YEOMAN SOCIAL STRUCTURE: Southern White society was sharply stratified. A small class of large PLANTERS (typically defined as owning 20+ enslaved people) held disproportionate wealth, political power, and social status, even though most White Southern families owned no enslaved people at all. Most White Southerners were YEOMAN FARMERS working small farms themselves, often without any enslaved labor; yet many yeomen still supported slavery, tied to it by kinship, racial hierarchy, hope of future upward mobility, or the local economy's dependence on the planter class.",
        "ENSLAVED FAMILY AND CULTURE: despite facing constant threat of sale and family separation, enslaved communities built resilient family structures, oral traditions, religious practices (blending Christianity with African cultural retentions), and community networks that sustained identity and mutual support under extraordinarily difficult conditions.",
        "ENSLAVED RESISTANCE: resistance took many forms, from everyday acts (work slowdowns, feigned illness, subtle sabotage) to escape attempts, to organized rebellion. NAT TURNER'S REBELLION (Southampton County, Virginia, August 1831) was an armed uprising that killed dozens of White Virginians before being suppressed; the rebellion and its brutal suppression are documented historical events discussed here in factual terms.",
        "HARDENING PROSLAVERY IDEOLOGY: in the years surrounding Nat Turner's rebellion and the rise of immediatist abolitionism (Garrison's The Liberator, also launched in 1831), White Southern defenders of slavery shifted from earlier arguments that treated slavery as a regrettable, temporary \"necessary evil\" toward an aggressive \"positive good\" defense — claiming slavery was beneficial to both enslaved people and society. This ideological hardening was, in part, a direct reaction to the threat both rebellion and Northern abolitionism posed to the system's continuation.",
      ],
      vocabulary: [
        {
          term: 'cotton gin',
          definition:
            "Eli Whitney's 1793 machine that mechanized separating cotton fiber from seed, making short-staple cotton hugely profitable and driving cotton cultivation's rapid expansion across the Deep South.",
        },
        {
          term: 'internal slave trade',
          definition:
            "the forced sale and relocation of enslaved people from the Upper South to the expanding cotton lands of the Deep South, routinely separating enslaved families.",
        },
        {
          term: 'planter class',
          definition:
            "the small class of large slaveholders (typically 20+ enslaved people) who held disproportionate wealth, political power, and social status in the antebellum South, though most White Southern families owned no enslaved people.",
        },
        {
          term: "Nat Turner's Rebellion (1831)",
          definition:
            "an armed uprising of enslaved people in Southampton County, Virginia, that killed dozens of White Virginians before being suppressed; its aftermath hardened White Southern proslavery ideology and tightened restrictions on enslaved and free Black people.",
        },
        {
          term: '"positive good" defense',
          definition:
            'the hardened proslavery argument, gaining ground especially after 1831, claiming slavery benefited both enslaved people and society — a shift from earlier framing of slavery as a regrettable "necessary evil."',
        },
      ],
      passageId: 'evelyn.passage.apush-garrison-liberator.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-garrison-counterpoint',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from William Lloyd Garrison's The Liberator, No. 1 (January 1, 1831): \"On this subject, I do not wish to think, or speak, or write, with moderation... I am in earnest -- I will not equivocate -- I will not excuse -- I will not retreat a single inch -- AND I WILL BE HEARD .\" This document was published the same year as Nat Turner's Rebellion. How does it help explain the hardening of proslavery ideology in the South during this period?",
      steps: [
        'SOURCE IT FIRST. William Lloyd Garrison, January 1, 1831 — the founding issue of The Liberator, an abolitionist newspaper published in Boston, months before Nat Turner\'s Rebellion (August 1831) in Virginia.',
        'IDENTIFY GARRISON\'S CLAIM AND TONE. Garrison explicitly REJECTS moderation on the subject of slavery ("I do not wish to think, or speak, or write, with moderation"), comparing gradual or cautious approaches to telling a man whose house is on fire to sound only a "moderate alarm." His demand is immediate and absolute: "I will not equivocate -- I will not excuse -- I will not retreat a single inch -- AND I WILL BE HEARD ."',
        "CONNECT TO IMMEDIATISM. This uncompromising tone reflects Garrison's broader position, launched with this same issue: IMMEDIATE, uncompensated emancipation, rejecting the gradual emancipation or colonization approaches earlier anti-slavery reformers had favored.",
        'CONNECT TO THE SAME YEAR\'S REBELLION. Garrison\'s Liberator and Nat Turner\'s Rebellion both occurred in 1831, independently, but White Southerners increasingly perceived Northern abolitionism and enslaved resistance as connected threats — a newspaper demanding immediate abolition and an armed rebellion happening the same year reinforced Southern fears that the system itself was under direct, urgent attack from multiple directions.',
        'EXPLAIN THE HARDENING THIS PROVOKED. In response to this perceived dual threat, White Southern defenders of slavery increasingly abandoned the older "necessary evil" framing in favor of the more aggressive "positive good" defense, alongside tightened legal restrictions on enslaved people\'s movement, education, and assembly, and heightened suspicion of any Northern abolitionist literature or influence in the South.',
        "STATE THE LINK TO THE COURSE THESIS. Garrison's uncompromising 1831 manifesto shows the abolitionist side of a mutually reinforcing cycle: as immediatist abolitionism grew louder and enslaved resistance (Turner's Rebellion) grew more direct, White Southern ideology hardened in response, entrenching rather than weakening the system in the short term.",
      ],
      answer:
        "Garrison's Liberator No. 1 explicitly rejects moderation on slavery, demanding immediate, uncompromising action rather than gradual reform — a position (immediatism) more radical than earlier gradual-emancipation or colonization approaches. Published the same year as Nat Turner's Rebellion (August 1831), Garrison's uncompromising abolitionist manifesto and an armed uprising of enslaved people reinforced White Southern fears that the slave system faced coordinated, urgent threats from both Northern abolitionists and enslaved people themselves. In response, White Southern defenders of slavery increasingly hardened their position — shifting from calling slavery a regrettable \"necessary evil\" to defending it as a \"positive good,\" while also tightening legal restrictions on enslaved people and suppressing abolitionist literature. Garrison's document illustrates the abolitionist half of a cycle in which resistance and reform on one side provoked ideological and legal hardening on the other.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way the cotton gin changed the economy or social structure of the antebellum South. (b) Briefly explain ONE specific example of enslaved resistance to slavery in this period. (c) Briefly explain ONE way White Southern proslavery ideology changed in response to abolitionism or enslaved resistance.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes an effect of the cotton gin — e.g. dramatically expanding profitable cotton cultivation across the Deep South, or driving the internal slave trade relocating enslaved people from the Upper South to Deep South cotton lands. No credit for a vague statement ("it made farming easier") with no specific economic or social consequence named.',
            modelResponse:
              "The cotton gin made short-staple cotton highly profitable to grow across the Deep South, and this expansion drove a massive internal slave trade forcibly relocating enslaved people from the Upper South to new cotton lands in states like Alabama and Mississippi.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate example of enslaved resistance — e.g. Nat Turner's Rebellion (1831), everyday resistance (work slowdowns, sabotage), or escape attempts. No credit for a vague or unsupported example.",
            modelResponse:
              "Nat Turner led an armed rebellion of enslaved people in Southampton County, Virginia, in August 1831, which killed dozens of White Virginians before being suppressed — one of the era's most direct examples of organized enslaved resistance.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate shift in proslavery ideology — e.g. moving from the "necessary evil" framing to the "positive good" defense, or tightening legal restrictions on enslaved people and abolitionist literature, in response to Nat Turner\'s Rebellion and/or growing immediatist abolitionism. No credit for a vague or unsupported claim.',
            modelResponse:
              "In the years surrounding Nat Turner's Rebellion and the launch of Garrison's immediatist Liberator (both 1831), White Southern defenders of slavery increasingly shifted from calling slavery a regrettable \"necessary evil\" to defending it as a \"positive good\" beneficial to society, while also tightening legal restrictions on enslaved people's movement and education.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-most-southerners-owned-slaves',
      kind: 'misconception_check',
      question:
        'True or false: most White Southern families owned enslaved people in the antebellum period.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming the region's dominant economic and political system (slavery) reflects the typical individual family's direct economic stake in it.",
          correctsTo:
            'FALSE. Most White Southern families owned no enslaved people at all — they were YEOMAN FARMERS working smaller farms with family or hired labor. A relatively small PLANTER class (commonly defined as owning 20 or more enslaved people) held a disproportionate share of enslaved labor, wealth, and political power. Non-slaveholding yeomen still often supported the slave system for reasons including kinship ties to slaveholding relatives, racial hierarchy, hope of future upward mobility into the planter class, and the broader regional economy\'s dependence on cotton and slavery even for those who did not personally own enslaved people. Conflating "the South\'s economy depended on slavery" with "most Southern families owned slaves" is a common and testable AP US History error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The cotton gin (1793) made cotton hugely profitable across the Deep South, driving a massive internal slave trade that relocated and separated enslaved families from the Upper South.",
        'Most White Southern families were yeoman farmers who owned no enslaved people; a small planter class (20+ enslaved people) held disproportionate wealth and political power.',
        'Enslaved communities sustained family, culture, and religious life despite constant threat of sale, and resisted through everyday acts and organized rebellion, including Nat Turner\'s Rebellion (1831).',
        'Garrison\'s Liberator (1831) demanded immediate, uncompromising abolition — a more radical position than earlier gradual-emancipation or colonization approaches.',
        'Turner\'s Rebellion and rising immediatist abolitionism, both in 1831, pushed White Southern ideology from a "necessary evil" framing toward an aggressive "positive good" defense of slavery.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.12-4.13',
    cedTitle: 'African Americans in the Antebellum South',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-garrison-liberator.v1',
        chapter: '1831',
        note: "Garrison's Liberator No. 1 — the abolitionist counterpoint used to explain hardening Southern proslavery ideology, not a Southern document itself.",
      },
    ],
  },
};
