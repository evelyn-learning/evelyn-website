/**
 * AP US History — CED Unit 2.2-2.3: Colonial Regions.
 *
 * Period-2 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). First plan in Period 2's within-period chain
 * (colonial-regions → transatlantic-economy → slavery-colonies →
 * colonial-society); prerequisite carries the Period-1 contrast with
 * Spanish colonization's labor-grant model.
 *
 * Anchor text: John Winthrop, "A Model of Christian Charity" (1630) —
 * evelyn.passage.apush-winthrop-charity.v1. Teaching point is New England's
 * covenant-community model versus the Chesapeake's profit motive — quoted
 * ONLY the seeded excerpt, preserving its Hanover-transcription early-modern
 * orthography ("citty", "eies", "uppon") exactly rather than the modernized
 * "city upon a hill." Bacon's Rebellion (1676) is mentioned/paraphrased as a
 * historical event only — no verbatim quotation, per the Period-2 wiring
 * (Bacon's Declaration is MCQ-reserved).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_COLONIAL_REGIONS: LessonPlan = {
  id: 'evelyn.ap.apush.colonial-regions.v1',
  title: 'U2.2 Colonial Regions',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.colonial-regions',
      description:
        'Explain how differing economic motives, religious purposes, and geography produced distinct regional societies in British North America — contrasting the Chesapeake\'s profit-driven tobacco economy with New England\'s covenant-based Puritan communities.',
      standard: 'AP-APUSH-2.2',
    },
  ],
  prerequisites: ['apush.spanish-colonization'],
  followUps: ['apush.transatlantic-economy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see "the thirteen colonies" as a misleading phrase that flattens two very different founding projects into one story.',
      script:
        "\"The thirteen colonies\" sounds like one project, but Jamestown (1607) and Plymouth (1620) were founded barely a decade apart for almost opposite reasons. Jamestown was a business venture — the Virginia Company expected colonists to find gold, or failing that, a cash crop, and turn a profit for investors back in London. Plymouth, and then Massachusetts Bay in 1630, were founded by Puritans who believed they were escaping religious corruption in England to build a righteous community that the rest of the world would judge as either a triumph or a warning. One region organized itself around tobacco and land grants. The other organized itself around a church covenant. Same ocean crossing, same rough century, radically different reasons for being there — and that difference shaped everything from family structure to how each region eventually treated labor.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-colonial-regions',
      kind: 'concept',
      goal: 'Explain how the Chesapeake, New England, Middle Colonies, and Lower South developed distinct regional societies.',
      keyIdeas: [
        "JAMESTOWN AND THE CHESAPEAKE PROFIT MOTIVE: the Virginia Company founded Jamestown in 1607 as a for-profit venture, not a religious refuge. Early years were disastrous (the 1609-10 \"starving time\"), but John Rolfe's successful cultivation of a marketable tobacco strain (from around 1612) gave Virginia a viable cash crop and created constant demand for land and labor.",
        "HEADRIGHT AND INDENTURED SERVITUDE: Virginia's headright system granted 50 acres of land to anyone who paid for a settler's passage across the Atlantic, encouraging wealthy planters to import labor. Most of that labor, through the 1600s, was English indentured servants — people who traded several years of contracted labor for the cost of their passage, not enslaved Africans. Maryland, founded in 1632 as a proprietary colony with a Catholic founding purpose, developed a very similar tobacco-and-headright economy.",
        "BACON'S REBELLION (1676) AND THE SHIFT IN LABOR: by the 1670s, Virginia had a large population of poor, land-hungry former servants and frontier settlers frustrated with the colonial government's Native American policy and unequal access to land. Nathaniel Bacon led an armed uprising against Governor Berkeley that briefly burned Jamestown before collapsing. The rebellion exposed how unstable a labor system built on masses of temporarily unfree, soon-to-be-free English poor could be — and in the following decades, Chesapeake planters increasingly turned toward enslaved African labor, which was permanent, hereditary, and did not eventually demand land and political voice the way freed servants did.",
        'NEW ENGLAND: A COVENANTED COMMUNITY. Plymouth (1620) and Massachusetts Bay (1630) were founded for religious purpose, not profit. John Winthrop, aboard the ship Arbella in 1630, cast the Massachusetts Bay venture as a COVENANT with God: the colonists had entered "into Covenant with Him for this worke," and if they upheld their end, God would bless them; if they failed, "the Lord will surely breake out in wrathe against us." Winthrop warned the settlement would be watched as a "citty upon a hill," with "the eies of all people" upon it — success or failure would be read as a verdict on the whole project.',
        'NEW ENGLAND SOCIETY: because whole families migrated together (unlike the mostly young, male Chesapeake servant population) and New England\'s climate was healthier, the region grew rapidly through natural increase rather than continuous new immigration. Towns organized life around the church and the town meeting; the economy relied on small-scale subsistence farming, fishing, and shipbuilding rather than one dominant cash crop.',
        'THE MIDDLE COLONIES: New York and Pennsylvania (founded 1681 by William Penn as a Quaker refuge) developed a grain-exporting "breadbasket" economy and, especially in Pennsylvania, an unusually diverse population and GENUINE religious toleration for multiple faiths — a real contrast to Puritan New England, which did not extend the same tolerance to religious dissent.',
        'THE LOWER SOUTH: colonies like South Carolina developed rice- and indigo-plantation economies on large landholdings, increasingly worked by enslaved labor imported directly from Africa — a regional pattern examined in depth in the slavery-in-the-colonies plan that follows.',
        'MEASURED CONTEXT: regional expansion in the Chesapeake and New England also meant conflict with Native nations already living on that land — the Pequot War (1636-38) in New England and King Philip\'s War (1675-76, fought the same year as Bacon\'s Rebellion) were costly wars that reshaped colonial-Native relations in the region.',
        "CONTRAST WITH SPANISH COLONIZATION: unlike Spanish America's centralized, Crown-administered colonial system built around the encomienda and repartimiento, English colonization was dispersed across many separately chartered or proprietary colonies, each developing its own elected assembly and its own regional economy and labor system — a much less centralized model, even though, like Spanish America, it ultimately relied on coerced labor to function.",
      ],
      vocabulary: [
        {
          term: 'headright system',
          definition:
            "Virginia's land-grant policy awarding 50 acres to anyone who paid for a settler's Atlantic passage, encouraging planters to import indentured labor.",
        },
        {
          term: 'indentured servitude',
          definition:
            'a labor contract binding a person (often poor English immigrants) to work for a fixed term of years in exchange for passage to the colonies; the dominant Chesapeake labor system before the shift to enslaved African labor.',
        },
        {
          term: "Bacon's Rebellion (1676)",
          definition:
            "an armed uprising of Virginia settlers, led by Nathaniel Bacon against Governor Berkeley, that exposed the instability of a labor system reliant on masses of newly free, land-hungry former servants and contributed to planters' shift toward enslaved African labor.",
        },
        {
          term: 'covenant',
          definition:
            "in Puritan New England, a solemn, binding agreement (with God, and among church/town members) that defined the community's shared religious and civic purpose.",
        },
      ],
      passageId: 'evelyn.passage.apush-winthrop-charity.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-winthrop',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from John Winthrop\'s "A Model of Christian Charity" (1630): "We are entered into Covenant with Him for this worke. … if wee shall neglect the observation of these articles… the Lord will surely breake out in wrathe against us… For wee must consider that wee shall be as a citty upon a hill. The eies of all people are uppon us." How does this passage reflect the New England colonial model, and how does it contrast with the Chesapeake?',
      steps: [
        "SOURCE IT FIRST. John Winthrop delivered this as a lay sermon aboard the ship Arbella in 1630, addressing the Puritan settlers about to found Massachusetts Bay — before they had even landed. This is a founding statement of purpose, not a retrospective account.",
        'IDENTIFY THE CLAIM. Winthrop frames the venture as a COVENANT: the colonists have made a binding agreement with God to build a righteous community, and God\'s favor or wrath depends on whether they keep it ("if wee shall neglect the observation of these articles… the Lord will surely breake out in wrathe against us"). This is a religious, communal purpose — not an investment prospectus.',
        'IDENTIFY THE "CITTY UPON A HILL" IMAGE. Winthrop tells the settlers they will be "as a citty upon a hill" with "the eies of all people… uppon us" — meaning the whole world will watch and judge whether this covenant community succeeds or fails. This raises the stakes of everyday behavior to a matter of collective religious reputation.',
        "CONNECT TO THE NEW ENGLAND MODEL. This is exactly the covenant-community pattern described in the concept: New England towns organized around shared religious purpose and mutual accountability, reinforced by family migration and church-centered town life — not around extracting a marketable resource.",
        "CONTRAST WITH THE CHESAPEAKE. Nothing in Winthrop's sermon mentions land grants, cash crops, or investor returns — because that is not what Massachusetts Bay was founded to do. Compare this to Virginia, founded 13 years earlier for the Virginia Company's profit, where the headright system and tobacco (not covenant theology) organized labor and settlement. Same century, same ocean crossing, opposite founding logic.",
        'STATE THE LINK TO THE COURSE THESIS, CAREFULLY. This passage is evidence of New England\'s religious founding purpose and self-conception as a watched, accountable community — it does NOT mean every colonist who crossed the Atlantic shared this motive, or that Puritan New England was tolerant of religious dissent (Puritan authorities enforced their own religious conformity strictly, as the misconception check below covers).',
      ],
      answer:
        "Winthrop casts the Massachusetts Bay venture as a religious covenant: the settlers have entered into an agreement with God, and their success or failure as a \"citty upon a hill\" — watched by \"the eies of all people\" — will be read as evidence of whether they kept that covenant. This reflects the New England model of colonization: family-based migration, town life organized around the church, and a self-understanding as a community bound by shared religious purpose rather than economic opportunity. It stands in sharp contrast to the Chesapeake, where Virginia (1607) and Maryland (1632) were founded around tobacco cultivation, the headright land-grant system, and a labor force of indentured servants working toward individual profit — a founding logic Winthrop's sermon never mentions, because covenant and profit were, for these two regions, genuinely different reasons for being in America.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE difference between the economic development of the Chesapeake region and New England in the colonial period. (b) Briefly explain ONE piece of specific historical evidence that supports your answer to (a). (c) Briefly explain ONE way geography or environment contributed to that regional difference.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine economic/social difference between the Chesapeake and New England — e.g. Chesapeake\'s cash-crop tobacco economy built on headright land grants and indentured/enslaved labor versus New England\'s subsistence-farming, fishing, and shipbuilding economy organized around covenanted towns. No credit for a vague statement with no specific named difference.',
            modelResponse:
              'The Chesapeake developed a cash-crop tobacco economy organized around large landholdings and imported indentured (and later enslaved) labor, while New England developed a subsistence-farming and fishing economy organized around small, self-governing towns.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific piece of historical evidence (an act, event, system, or document) supporting the difference named in (a), connected clearly to it. No credit for generic or unconnected evidence.",
            modelResponse:
              "Virginia's headright system granted 50 acres of land to anyone who paid for a settler's passage, which encouraged wealthy planters to import large numbers of indentured servants to grow tobacco — a labor and land system with no New England equivalent.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way geography or environment (climate, soil, disease environment, coastline) contributed to the regional difference named in (a). No credit for a vague or inaccurate environmental claim.',
            modelResponse:
              "The Chesapeake's warm climate and long growing season were well suited to tobacco cultivation but also fostered disease environments that raised mortality, while New England's colder, healthier climate supported family-based population growth through natural increase rather than a single dominant cash crop.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-religious-motive',
      kind: 'misconception_check',
      question:
        'True or false: (1) most colonists who crossed the Atlantic to British North America came primarily seeking religious freedom; and (2) Puritan New England, once established, practiced religious tolerance for those seeking to worship freely.',
      commonErrors: [
        {
          answer: 'true (statement 1)',
          misconception:
            "Generalizing New England's religious founding motive to the whole colonial population, when most colonists — especially in the Chesapeake and later the Middle and Lower South — crossed the Atlantic for economic opportunity (land, indentured-servitude contracts, profit) rather than religious purpose.",
          correctsTo:
            "FALSE. Religious purpose drove the founding of Plymouth and Massachusetts Bay, but most colonists overall — including the large populations of indentured servants and land-seekers in the Chesapeake, and later immigrants to the Middle Colonies and Lower South — came primarily for economic opportunity, not religious freedom. Do not extend New England's founding motive to \"the colonists\" as a whole.",
        },
        {
          answer: 'true (statement 2)',
          misconception:
            "Assuming a community founded to escape religious persecution automatically extended tolerance to others, rather than recognizing Puritan New England enforced its own strict religious conformity.",
          correctsTo:
            "FALSE. Puritan Massachusetts Bay enforced conformity to its own religious order and banished dissenters who challenged it — most famously Roger Williams (who went on to found Rhode Island on principles of religious liberty) and Anne Hutchinson. Puritans sought freedom to practice THEIR faith, not to tolerate competing ones; genuine religious toleration in the colonies is better associated with Pennsylvania under William Penn.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Jamestown (1607) was a for-profit Virginia Company venture; tobacco (John Rolfe) and the headright system built a labor-hungry cash-crop economy worked first by indentured servants.",
        "Bacon's Rebellion (1676) exposed the instability of relying on masses of newly free, land-hungry former servants and contributed to the Chesapeake's shift toward enslaved African labor.",
        'Massachusetts Bay (1630) was founded on Winthrop\'s covenant framing — a "citty upon a hill" watched by "the eies of all people" — organizing New England around shared religious purpose and town life, not profit.',
        'The Middle Colonies (especially Penn\'s Pennsylvania) developed real religious toleration and a diverse, grain-exporting economy; the Lower South developed rice/indigo plantation economies.',
        "Most colonists came for economic opportunity, not religious freedom, and Puritan New England enforced its own conformity rather than practicing tolerance — avoid generalizing New England's motive to the whole colonial population.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.2-2.3',
    cedTitle: 'Colonial Regions',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-winthrop-charity.v1',
        chapter: '1630',
        note: 'John Winthrop, "A Model of Christian Charity" — anchor document for the New England covenant-community model.',
      },
    ],
  },
};
