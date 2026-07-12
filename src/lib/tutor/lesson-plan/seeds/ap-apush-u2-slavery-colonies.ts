/**
 * AP US History — CED Unit 2.6: Slavery in the Colonies.
 *
 * Period-2 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Third plan in Period 2's within-period chain
 * (colonial-regions → transatlantic-economy → slavery-colonies →
 * colonial-society).
 *
 * Anchor text: Olaudah Equiano, "The Interesting Narrative" (1789) —
 * evelyn.passage.apush-equiano.v1. Teaching point is Equiano's testimony as
 * EVIDENCE of the Middle Passage's dehumanizing conditions, read by the
 * plan's worked example in its actual historical role: evidence used within
 * the British parliamentary debate over abolishing the slave trade. Quotes
 * ONLY the seeded excerpt, in the measured register the passage itself was
 * selected for. Bacon's Rebellion is referenced only as background (no
 * verbatim quotation — MCQ-reserved per the Period-2 wiring). Slavery is
 * treated with a measured, exam-neutral tone throughout, per Global
 * Constraints.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_SLAVERY_COLONIES: LessonPlan = {
  id: 'evelyn.ap.apush.slavery-colonies.v1',
  title: 'U2.6 Slavery in the Colonies',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.slavery-colonies',
      description:
        'Explain the shift from indentured servitude to hereditary racial slavery in British North America, regional variation in how slavery developed, the codification of slave codes, and enslaved people\'s resistance, including the Stono Rebellion (1739).',
      standard: 'AP-APUSH-2.6',
    },
  ],
  prerequisites: ['apush.transatlantic-economy'],
  followUps: ['apush.colonial-society'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see hereditary racial slavery as a specific, decades-long institutional shift, not something that was simply always the labor system of British North America.',
      script:
        "For most of the 1600s, the dominant labor force on Chesapeake tobacco farms wasn't enslaved Africans — it was English indentured servants working off a set term of years. That changed. By the early 1700s, colonial legislatures across British North America had built an entirely different system: labor that was racial, hereditary, and lifelong, backed by increasingly detailed law. Understanding colonial slavery means understanding both halves of that sentence — how the shift happened, and what the system it produced actually looked like once colonial law had fully built it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-slavery-in-the-colonies',
      kind: 'concept',
      goal: 'Explain the shift from indentured servitude to racial slavery, the Middle Passage, regional variation, slave codes, and the Stono Rebellion.',
      keyIdeas: [
        "FROM INDENTURED SERVITUDE TO RACIAL SLAVERY: through most of the 1600s, Chesapeake planters relied primarily on English indentured servants. As the supply of servants willing to migrate declined and the unrest around Bacon's Rebellion (1676) exposed the risks of a labor force of increasingly desperate, land-hungry former servants, planters turned toward enslaved African labor instead — permanent, hereditary, and, unlike freed servants, never entitled to land or a political voice at the end of a term.",
        'THE MIDDLE PASSAGE: enslaved Africans were transported across the Atlantic under deliberately dehumanizing conditions — confined, chained, and treated as cargo rather than people. First-person accounts, like Olaudah Equiano\'s, describe the psychological terror of being inspected and "handled" by a ship\'s crew before ever leaving the African coast.',
        "REGIONAL VARIATION IN SLAVERY: slavery took different forms across regions. In the Chesapeake, enslaved people typically worked tobacco under a gang-labor system, and by the 18th century a more balanced sex ratio allowed more enslaved families to form. In the Lower South (South Carolina, Georgia), rice and indigo plantations relied on a task-labor system on large landholdings, and in places like coastal South Carolina enslaved people came to outnumber the free population. In the Middle Colonies and New England, slavery existed on a smaller scale, often urban, domestic, and artisanal rather than plantation-based — present in every region, not confined to the South.",
        'SLAVE CODES AND HEREDITARY STATUS: colonial legislatures codified race-based, lifelong, hereditary enslavement into law. Virginia\'s 1662 law establishing that a child\'s status followed the mother\'s (enslaved or free) made slavery hereditary regardless of the father\'s status; increasingly detailed slave codes by the early 1700s restricted enslaved people\'s legal rights, mobility, and ability to gather, and treated them as property under the law.',
        "THE STONO REBELLION (1739) AND COVERT RESISTANCE: near the Stono River in South Carolina, a group of enslaved people seized weapons and attempted to escape south toward Spanish Florida, which had offered freedom to enslaved people fleeing British colonies; colonial militia suppressed the uprising, and South Carolina responded with an even harsher slave code (the Negro Act of 1740) restricting movement, assembly, and literacy. Open rebellion like Stono was rare; far more common was covert, day-to-day resistance — work slowdowns, maintaining family and kinship ties, preserving cultural and religious practices, and individual escape.",
        "EQUIANO'S TESTIMONY AND ITS LATER USE: Olaudah Equiano's Interesting Narrative, published in 1789 (decades after the events it describes), recounts his own childhood experience of capture and the Middle Passage. Published in Britain during the era's growing parliamentary debate over abolishing the transatlantic slave trade, it became influential first-person evidence in that debate — testimony to the human experience underlying an economic system that colonial law had, over the preceding century, worked hard to make permanent and race-based.",
      ],
      vocabulary: [
        {
          term: 'Middle Passage',
          definition:
            'the forced transatlantic transport of enslaved Africans to the Americas, under confined, chained, and deliberately dehumanizing conditions.',
        },
        {
          term: 'task system',
          definition:
            "a labor system, common on Lower South rice and indigo plantations, assigning enslaved workers a fixed daily task rather than continuous supervised gang labor.",
        },
        {
          term: 'slave codes',
          definition:
            'colonial laws (increasingly detailed by the early 1700s) codifying hereditary, race-based, lifelong enslavement and restricting enslaved people\'s legal rights and mobility.',
        },
        {
          term: 'Stono Rebellion (1739)',
          definition:
            'an armed uprising of enslaved people near the Stono River, South Carolina, attempting escape to Spanish Florida; suppressed, and followed by a harsher slave code (the Negro Act of 1740).',
        },
      ],
      passageId: 'evelyn.passage.apush-equiano.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-equiano',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Olaudah Equiano\'s "The Interesting Narrative" (1789): "The first object which saluted my eyes when I arrived on the coast was the sea, and a slave ship… I was immediately handled and tossed up to see if I were sound by some of the crew… and saw a large furnace or copper boiling, and a multitude of black people of every description chained together, every one of their countenances expressing dejection and sorrow, I no longer doubted of my fate; and, quite overpowered with horror and anguish, I fell motionless on the deck and fainted." What is Equiano documenting, and how was this testimony later used?',
      steps: [
        "SOURCE IT FIRST. Olaudah Equiano published his Interesting Narrative in 1789 in Britain, decades after the childhood experience it recounts, at a time when Parliament was actively debating whether to abolish the transatlantic slave trade. He is a formerly enslaved man writing his own account for a British reading public engaged in that debate.",
        "IDENTIFY WHAT THE PASSAGE DOCUMENTS. Equiano describes being physically inspected — \"handled and tossed up to see if I were sound\" — the language of livestock or cargo appraisal, applied to a person. He then describes seeing other captives \"chained together\" aboard ship, and his own overwhelming psychological reaction: \"overpowered with horror and anguish, I fell motionless on the deck and fainted.\"",
        "CONNECT TO THE CONCEPT. This is a first-person account of the Middle Passage's dehumanizing treatment of enslaved people as commodities to be inspected and transported, not evidence about the trade's overall scale or numbers — those come from separate outside evidence (shipping and customs records, demographic estimates).",
        "IDENTIFY THE AUDIENCE AND PURPOSE. Equiano is writing for a British public already engaged in the parliamentary debate over abolishing the slave trade. By making the Middle Passage's cruelty vivid and personal through his own remembered experience, his narrative functions as evidence and argument at once — turning an abstract policy debate into an account of one specific person's terror.",
        "STATE THE LINK TO THE COURSE THESIS, CAREFULLY. Equiano's testimony is evidence of the Middle Passage's psychological and physical conditions, and of how formerly enslaved people's own accounts came to shape the later British abolition debate — it is not, by itself, proof of how the slave trade was administered by law or how large the trade was; those require the slave codes and trade-volume evidence covered separately in the concept.",
      ],
      answer:
        "Equiano documents the terror and dehumanization of the Middle Passage from firsthand experience: being physically inspected by the crew (\"handled and tossed up to see if I were sound,\" language usually applied to livestock or cargo), seeing other enslaved people \"chained together\" aboard ship, and his own overwhelming reaction — fainting from \"horror and anguish.\" Published in 1789, decades after the events it describes, his narrative was written for a British public actively debating whether to abolish the transatlantic slave trade, and it became influential first-person evidence in that debate — turning an abstract policy question into an account of one person's remembered terror. Read carefully, the passage is best understood as evidence of the Middle Passage's conditions and of how survivors' testimony shaped the later abolition debate, not as a stand-alone account of the trade's full legal structure or scale.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE feature of colonial slave codes or the shift from indentured servitude to racial slavery. (b) Briefly explain ONE piece of specific historical evidence of regional variation in how slavery developed in the colonies. (c) Briefly explain ONE way enslaved people resisted their condition.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine feature of colonial slave codes (e.g. Virginia\'s 1662 law making status follow the mother, hereditary and lifelong enslavement) or the shift from indentured servitude to slavery (declining servant supply, unrest around Bacon\'s Rebellion). No credit for a vague, unnamed description with no specific feature.',
            modelResponse:
              "Virginia's 1662 law established that a child's status as enslaved or free followed the status of the mother, making slavery hereditary and lifelong regardless of the father's status.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (a region, labor system, or demographic pattern) of regional variation in colonial slavery, connected clearly to the region named. No credit for vague or unconnected evidence.',
            modelResponse:
              'In the Lower South, rice and indigo plantations relied on a task-labor system on large landholdings, and in coastal South Carolina enslaved people came to outnumber the free population — a very different pattern from the smaller-scale, often urban and domestic slavery found in the Middle Colonies and New England.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate form of resistance — open rebellion (the Stono Rebellion, 1739) or covert, day-to-day resistance (work slowdowns, maintaining family/cultural ties, escape). No credit for a vague or inaccurate description.',
            modelResponse:
              "In the Stono Rebellion (1739), a group of enslaved people near the Stono River in South Carolina seized weapons and attempted to escape south to Spanish Florida, which had offered freedom to enslaved people fleeing British colonies — an example of open, armed resistance, though far more common was covert resistance such as work slowdowns and maintaining family and cultural ties.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-slavery-southern-only',
      kind: 'misconception_check',
      question:
        'True or false: slavery in colonial British North America existed only in the Southern colonies, with the Middle Colonies and New England essentially free of it.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Projecting the 19th-century sectional divide over slavery backward onto the colonial period, and assuming a region's SCALE of slavery (much larger in the South by the 18th century) means slavery was entirely ABSENT elsewhere.",
          correctsTo:
            "FALSE. Slavery existed in every colonial region during Period 2 — including the Middle Colonies and New England, where it was typically smaller-scale, urban, domestic, and artisanal rather than plantation-based. It was most numerically dominant in the Chesapeake and especially the Lower South, where large tobacco, rice, and indigo plantations relied heavily on enslaved labor, but no region was free of it. The strong North/South sectional divide over slavery is a later development, not a colonial-era reality.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Chesapeake planters shifted from indentured servitude to racial slavery over the late 1600s, a shift accelerated by the instability exposed by Bacon's Rebellion (1676).",
        "The Middle Passage transported enslaved Africans under confined, dehumanizing conditions — documented in first-person accounts like Equiano's.",
        'Slavery varied regionally: Chesapeake gang labor on tobacco, Lower South task labor on rice/indigo (with enslaved majorities in places), and smaller-scale urban/domestic slavery in the Middle Colonies and New England.',
        "Slave codes (e.g. Virginia's 1662 law on hereditary status via the mother) made slavery race-based, hereditary, and lifelong under colonial law.",
        'The Stono Rebellion (1739) was rare, open armed resistance; far more common was covert, day-to-day resistance. Slavery existed in every colonial region, not only the South.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.6',
    cedTitle: 'Slavery in the Colonies',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-equiano.v1',
        chapter: '1789',
        note: 'Olaudah Equiano, "The Interesting Narrative of the Life of Olaudah Equiano" — anchor document for firsthand Middle Passage testimony.',
      },
    ],
  },
};
