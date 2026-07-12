/**
 * AP US History — CED Unit 2.4: The Transatlantic Economy.
 *
 * Period-2 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Second plan in Period 2's within-period chain
 * (colonial-regions → transatlantic-economy → slavery-colonies →
 * colonial-society).
 *
 * UNWIRED — no passage. Teaching point is mercantilism, the Navigation Acts,
 * the triangular trade, the consumer revolution, and the ORIGIN of salutary
 * neglect (loose enforcement of the Navigation Acts long before 1763). This
 * origin story must stay consistent with the Period-3 causes-of-revolution
 * plan's framing: salutary neglect is a policy "in place through the
 * colonial era… remained largely unbroken until 1763" — this plan shows how
 * that policy began, not a competing account of when it ended.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_TRANSATLANTIC_ECONOMY: LessonPlan = {
  id: 'evelyn.ap.apush.transatlantic-economy.v1',
  title: 'U2.4 The Transatlantic Economy',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.transatlantic-economy',
      description:
        'Explain how mercantilist theory, the Navigation Acts, and the triangular trade organized the colonial economy, and how loose enforcement of those trade laws before 1763 gave rise to the policy later called salutary neglect.',
      standard: 'AP-APUSH-2.4',
    },
  ],
  prerequisites: ['apush.colonial-regions'],
  followUps: ['apush.slavery-colonies'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the colonial economy as a deliberately designed system, not just scattered local farming and trading.',
      script:
        "Picture a Boston merchant in the mid-1700s: his ship carries rum and manufactured goods to West Africa, trades for captives there, carries them to the West Indies to sell for sugar and molasses, then sails home to Boston to distill that molasses into more rum. By law, that ship has to be English or colonial-built and crewed. By law, if he's carrying tobacco instead, he can't sail it straight to a buyer in Amsterdam — it has to pass through an English port first. None of this happened by accident. Britain designed its colonies, on paper, to run on a specific economic logic: colonies exist to enrich the mother country. The catch is that \"on paper\" and \"in practice\" are two very different things — and the gap between them is where one of the most important background facts of the whole colonial period begins.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-transatlantic-economy',
      kind: 'concept',
      goal: 'Explain mercantilism, the Navigation Acts, the triangular trade, the consumer revolution, and the origins of salutary neglect.',
      keyIdeas: [
        'MERCANTILISM: the dominant European economic theory of the colonial era — colonies exist to enrich the mother country by supplying raw materials and serving as a captive market for the mother country\'s manufactured goods. The goal is a favorable balance of trade: exports worth more than imports.',
        'THE NAVIGATION ACTS: Parliament passed a series of Navigation Acts beginning in 1651 (aimed partly at excluding Dutch shipping) and strengthened in 1660, requiring that colonial trade travel on English or colonial-built and -crewed ships, and that certain "enumerated" goods (tobacco, sugar, and later others) be shipped only to England or English colonies, even if the final buyer was elsewhere in Europe.',
        'ENFORCEMENT WAS LOOSE — THE ORIGIN OF SALUTARY NEGLECT: despite the Navigation Acts being law, Britain enforced them only loosely for decades. Customs officials in the colonies were few, oversight from London was slow and inconsistent, and smuggling — especially by New England merchants trading with the French and Dutch West Indies — was widespread and often tacitly tolerated. This decades-long pattern of light-touch enforcement is the origin of what later became known as salutary neglect: a policy that remained largely unbroken through the rest of the colonial era, until Britain\'s war debt after 1763 forced a change (the turning point covered in the causes-of-the-Revolution unit).',
        "THE TRIANGULAR TRADE: a network of overlapping Atlantic trade routes, not one fixed triangle — New England rum and manufactured goods to West Africa; enslaved people carried from Africa to the West Indies and mainland colonies (the Middle Passage); sugar and molasses carried back to New England to be distilled into more rum. Different colonial regions plugged into this Atlantic system in different ways, tying together the economies described in the colonial-regions plan.",
        'THE CONSUMER REVOLUTION: rising colonial wealth from this Atlantic trade, combined with a growing supply of British manufactured goods (textiles, ceramics, tea, and more), produced an eighteenth-century "consumer revolution" — colonists across a widening range of social classes, not just elites, increasingly purchased and displayed British goods, tying colonial daily life more closely to British culture and taste.',
        'A CONSTITUTIONAL PRECEDENT, EVEN IF LOOSELY ENFORCED: even though the Navigation Acts went largely unenforced in practice for decades, they established the legal PRINCIPLE that Parliament could regulate colonial trade. That principle would matter enormously after 1763, when Parliament — needing revenue rather than merely trade regulation — began enforcing and expanding its authority over the colonies far more aggressively.',
      ],
      vocabulary: [
        {
          term: 'mercantilism',
          definition:
            "the theory that colonies exist to enrich the mother country by supplying raw materials and serving as a market for its manufactured goods, aiming for a favorable balance of trade.",
        },
        {
          term: 'Navigation Acts',
          definition:
            'a series of English/British trade laws (beginning 1651, strengthened 1660) requiring colonial trade on English/colonial ships and routing certain enumerated goods through England — enforced loosely for decades.',
        },
        {
          term: 'salutary neglect',
          definition:
            "Britain's long-running policy of loosely enforcing trade and tax laws in the colonies, which originated in the decades-long under-enforcement of the Navigation Acts and remained largely unbroken until 1763.",
        },
        {
          term: 'triangular trade',
          definition:
            'the network of overlapping Atlantic trade routes connecting the colonies, West Africa, and the West Indies — carrying manufactured goods, enslaved people, and raw materials like sugar and molasses.',
        },
        {
          term: 'consumer revolution',
          definition:
            'the eighteenth-century expansion of colonial purchasing and display of British manufactured goods across a widening range of social classes.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-triangular-voyage',
      kind: 'worked_example',
      problem:
        "Consider a Boston merchant's 1750 voyage: his English-built ship carries rum and manufactured goods to West Africa, trades for captives, carries them to the West Indies to sell for sugar and molasses, then returns to Boston, where the molasses is distilled into more rum. Colonial law requires the ship be English or colonial-built and crewed, and requires that enumerated goods like tobacco pass through an English port before reaching a non-English buyer. A customs officer in the port, however, rarely inspects this merchant's cargo closely. Explain the economic logic behind the legal requirements, and explain why enforcement might be lax anyway.",
      steps: [
        'IDENTIFY THE MERCANTILIST FRAMEWORK. The voyage exists inside a system designed so that colonial trade ultimately channels wealth and goods back through England: English/colonial ships carry the cargo, and enumerated goods route through English ports — keeping shipping profits and trade oversight in English (or colonial, still under English law) hands rather than a rival power\'s.',
        "IDENTIFY THE NAVIGATION ACTS' SPECIFIC RULES AT WORK. The ship-nationality requirement and the enumerated-goods routing requirement (tobacco to an English port before Amsterdam) are both direct products of the Navigation Acts (1651, 1660) — designed to keep colonial trade profits from flowing to rival powers like the Dutch.",
        "CONNECT THE VOYAGE TO THE TRIANGULAR TRADE. This merchant's route — rum/goods to West Africa, enslaved people to the West Indies, sugar/molasses back to New England for more rum — is a textbook example of one leg of the larger, overlapping Atlantic trade network, not a one-off trip.",
        "EXPLAIN WHY ENFORCEMENT IS LAX. Britain had a small customs bureaucracy relative to the size and distance of its colonial trade, communication and oversight from London were slow, and tolerating a degree of smuggling kept colonial merchants profitable and colonial markets stable — which, ironically, still served mercantilist goals in the broad sense of a functioning, trade-generating colonial economy. This is the specific pattern that would later be named salutary neglect.",
        "STATE THE LINK TO THE COURSE THESIS. The legal framework (mercantilism, Navigation Acts) and the practical reality (loose enforcement, smuggling) are BOTH true at once, and both matter: the legal framework set a precedent Parliament could later draw on, while the loose enforcement let colonists get used to real economic self-direction — a combination that made Parliament's post-1763 crackdown feel like such a sharp break.",
      ],
      answer:
        "The voyage's legal requirements — an English/colonial-built ship, tobacco routed through an English port — reflect mercantilist theory as enforced through the Navigation Acts (1651, 1660): trade profits and oversight were meant to stay within the English commercial system rather than flow to rival powers. The voyage itself, rum and goods out, enslaved people carried to the West Indies, sugar and molasses carried home, is one leg of the broader triangular trade network. Enforcement is lax because Britain's colonial customs bureaucracy was small relative to the scale and distance of Atlantic trade, oversight from London was slow, and tolerating routine smuggling kept colonial merchants and markets functioning — the exact pattern of light-touch enforcement that became known as salutary neglect. That policy would remain largely unbroken until 1763, when Britain's postwar debt gave Parliament a reason to start enforcing (and expanding) the authority the Navigation Acts had established on paper decades earlier.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE feature of mercantilism or the Navigation Acts. (b) Briefly explain ONE piece of specific historical evidence of how the transatlantic economy (the triangular trade or the consumer revolution) shaped colonial economic life. (c) Briefly explain ONE reason why British enforcement of colonial trade laws before 1763 differed from British policy after 1763.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine feature of mercantilism (colonies as raw-material supplier and captive market, aiming for a favorable balance of trade) or the Navigation Acts (English/colonial-ship requirement, enumerated goods routed through England). No credit for a vague, unnamed "trade law."',
            modelResponse:
              'Under the Navigation Acts, certain enumerated colonial goods such as tobacco could only be shipped to England or English colonies, even when the final buyer was elsewhere in Europe.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (a trade route, good, or pattern) of the triangular trade or the consumer revolution shaping colonial economic life, connected clearly to that concept. No credit for vague or unconnected evidence.',
            modelResponse:
              'New England merchants carried rum and manufactured goods to West Africa, exchanged them for enslaved people transported to the West Indies, and returned home with sugar and molasses — direct evidence of colonial regions being tied into an Atlantic-wide triangular trade network.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate reason enforcement differed before/after 1763 — e.g. before 1763, Britain loosely enforced the Navigation Acts (salutary neglect, small customs bureaucracy, tolerated smuggling); after 1763, war debt from the French and Indian War pushed Parliament to enforce and expand its authority over colonial trade and taxation. No credit for a vague or unsupported contrast.',
            modelResponse:
              "Before 1763, Britain enforced the Navigation Acts loosely — customs oversight was thin and smuggling was widely tolerated, a pattern later called salutary neglect. After 1763, the massive war debt from the French and Indian War gave Parliament a fiscal reason to enforce trade laws far more strictly and add new direct taxes, ending that loose enforcement.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-navigation-acts-enforced',
      kind: 'misconception_check',
      question:
        'True or false: the Navigation Acts were strictly enforced from the moment they were passed, so colonial merchants had little practical ability to evade them before 1763.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming a law's existence on the books means it was consistently enforced in practice, rather than recognizing enforcement can be loose or inconsistent for decades — especially across an ocean, before fast communication existed.",
          correctsTo:
            "FALSE. The Navigation Acts (1651, 1660) were law, but Britain enforced them loosely for decades: colonial customs offices were understaffed, oversight from London was slow, and smuggling — especially by New England merchants trading with the French and Dutch West Indies — was widespread and often tacitly tolerated. This decades-long gap between the law on paper and enforcement in practice is precisely the origin of salutary neglect, which remained largely unbroken until Britain's post-1763 war debt pushed Parliament to enforce trade and tax laws far more aggressively.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mercantilism: colonies exist to enrich the mother country, supplying raw materials and buying manufactured goods to keep a favorable balance of trade.',
        'The Navigation Acts (1651, 1660) required English/colonial ships and routed enumerated goods (like tobacco) through England.',
        'Enforcement of the Navigation Acts was loose for decades — the origin of salutary neglect, which stayed largely unbroken until 1763.',
        'The triangular trade was a network of overlapping Atlantic routes (goods, enslaved people, raw materials), not one fixed triangle.',
        'The consumer revolution tied colonists across social classes more closely to British goods and culture — a background condition for the "Anglicization" covered in the colonial-society plan.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4',
    cedTitle: 'The Transatlantic Economy',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
