/**
 * AP US History — CED Unit 2.5/2.7: Colonial Society and Culture.
 *
 * Period-2 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Fourth and final plan in Period 2's within-period chain
 * (colonial-regions → transatlantic-economy → slavery-colonies →
 * colonial-society).
 *
 * Anchor text: Jonathan Edwards, "Sinners in the Hands of an Angry God"
 * (1741) — evelyn.passage.apush-edwards-sinners.v1. Teaching point is the
 * First Great Awakening's emotional, individual, mass-audience preaching
 * style, contrasted with Enlightenment reason — quotes ONLY the seeded
 * excerpt, preserving its exact wording ("flung the door of mercy wide
 * open," not "thrown"). The plan's framing of colonial assemblies and
 * salutary neglect stays consistent with the transatlantic-economy plan and
 * the Period-3 causes-of-revolution plan: a policy in place through the
 * colonial era, largely unbroken until 1763.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_COLONIAL_SOCIETY: LessonPlan = {
  id: 'evelyn.ap.apush.colonial-society.v1',
  title: 'U2.7 Colonial Society and Culture',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.colonial-society',
      description:
        'Explain how Anglicization, print culture, Enlightenment thought, the First Great Awakening, and self-governing colonial assemblies shaped colonial society and culture by the mid-18th century.',
      standard: 'AP-APUSH-2.7',
    },
  ],
  prerequisites: ['apush.slavery-colonies'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see mid-18th-century colonial society as pulled in two different directions at once, not moving toward a single cultural trend.',
      script:
        "By the 1730s and 40s, British North America was, in some ways, becoming MORE British — colonial elites increasingly bought British goods, read British books, and modeled their homes and manners on London fashion. And at almost the exact same moment, a wave of emotional religious revivals was sweeping the same colonies, with traveling preachers shouting to enormous outdoor crowds about hellfire and instant conversion — a movement with almost nothing to do with polite British taste. Colonial society in this period wasn't heading in one direction. It was absorbing an increasingly British, reason-and-manners elite culture and an emotional, mass religious upheaval at the very same time — and figuring out how those two forces fit together (or didn't) is the real story of colonial society by 1750.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-colonial-society',
      kind: 'concept',
      goal: 'Explain Anglicization, print culture, the Enlightenment, the First Great Awakening, and colonial self-government.',
      keyIdeas: [
        'ANGLICIZATION: by the early-to-mid 1700s, colonial elites increasingly emulated British fashion, architecture, consumer goods, and cultural institutions — a trend fed by the growing colonial wealth and expanding British manufactured-goods trade covered in the transatlantic-economy plan\'s "consumer revolution." Colonists increasingly saw themselves as British subjects sharing in British culture, even while governing much of their own daily affairs.',
        "PRINT CULTURE: growing numbers of colonial newspapers, printers, and pamphlets — Benjamin Franklin's Pennsylvania Gazette among the best known — spread religious, political, and scientific ideas across a widely scattered colonial population, creating something like a shared colonial public conversation for the first time.",
        'THE ENLIGHTENMENT: an intellectual movement emphasizing human REASON, empirical observation, and natural law (associated with thinkers like Locke and Newton) as the paths to truth and to a rationally ordered, legitimate government. Colonial elites absorbed Enlightenment ideas through print culture and correspondence with Europe.',
        'THE FIRST GREAT AWAKENING (1730s-40s): a wave of emotional religious revivals across the colonies, led by preachers such as Jonathan Edwards and the itinerant British preacher George Whitefield, who preached outdoors to enormous, socially mixed crowds. The Awakening emphasized a direct, individual, emotional experience of conversion, in contrast to formal church hierarchy and rote religious observance.',
        "ENLIGHTENMENT AND AWAKENING WERE GENUINELY DIFFERENT IMPULSES: though they overlapped in time, the two movements pulled in different directions. The Enlightenment elevated calm reason and this-worldly inquiry; the Awakening elevated urgent emotional piety and the fear of damnation. They are not the same phenomenon wearing two names — even though both, in their own way, encouraged ordinary colonists to trust their own judgment (reasoned, in one case; spiritual, in the other) over inherited authority.",
        "THE AWAKENING'S SOCIAL REACH: Awakening preaching drew mass, socially mixed crowds — not an elite-driven movement, but one that often unsettled elites. Established, formally trained clergy frequently viewed itinerant preachers like Whitefield and Edwards as threats to their authority and to orderly church governance. The Awakening contributed to the growth of new evangelical denominations (Baptists, Methodists) and challenged established church hierarchies (Congregational, Anglican).",
        'COLONIAL ASSEMBLIES AND SELF-GOVERNMENT: representative colonial assemblies — such as Virginia\'s House of Burgesses (founded 1619) — developed real governing power over local taxation and legislation across the colonial era. This grew naturally out of the same loose British oversight described in the transatlantic-economy plan: with Britain\'s trade-law enforcement (and colonial governance generally) left largely in local hands through most of the colonial era — a policy that remained largely unbroken until 1763 — colonial assemblies gained genuine practical experience running their own affairs.',
      ],
      vocabulary: [
        {
          term: 'Anglicization',
          definition:
            "the trend of colonial elites increasingly emulating British fashion, goods, architecture, and cultural institutions during the mid-18th century.",
        },
        {
          term: 'the Enlightenment',
          definition:
            "an intellectual movement emphasizing human reason, empirical observation, and natural law as the paths to truth and legitimate government.",
        },
        {
          term: 'First Great Awakening',
          definition:
            'a wave of emotional religious revivals across the colonies (1730s-40s), led by preachers like Jonathan Edwards and George Whitefield, emphasizing direct, individual, emotional conversion over formal church hierarchy.',
        },
        {
          term: 'colonial assemblies',
          definition:
            "representative colonial legislatures (e.g. Virginia's House of Burgesses) that developed real governing power over local taxation and legislation during the era of loose British oversight.",
        },
      ],
      passageId: 'evelyn.passage.apush-edwards-sinners.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-edwards',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Jonathan Edwards\'s "Sinners in the Hands of an Angry God" (1741): "The God that holds you over the pit of hell, much as one holds a spider or some loathsome insect over the fire, abhors you, and is dreadfully provoked… Christ has flung the door of mercy wide open, and stands in the door calling and crying with a loud voice to poor sinners… Therefore let every one that is out of Christ now awake and fly from the wrath to come." How does this passage reflect the First Great Awakening, and how does it contrast with the Enlightenment?',
      steps: [
        'SOURCE IT FIRST. Jonathan Edwards preached this sermon at Enfield, Connecticut, in 1741, during the First Great Awakening — a period of intense, emotional revival preaching across the colonies.',
        'IDENTIFY THE IMAGERY. Edwards describes God holding the unconverted sinner "over the pit of hell, much as one holds a spider… over the fire" — a vivid, frightening image meant to make the listener FEEL their spiritual precariousness immediately, not reason their way to a conclusion over time.',
        'IDENTIFY THE CALL TO ACTION. Despite the frightening imagery, Edwards also insists Christ "has flung the door of mercy wide open" and calls sinners to "awake and fly from the wrath to come" — an urgent, individual, emotional call to immediate conversion, addressed to "poor sinners" broadly, not a narrow theological argument for trained clergy.',
        'CONNECT TO THE AWAKENING\'S SOCIAL REACH. This sermon was preached to an ordinary mixed congregation, not delivered as an academic treatise — reflecting the Awakening\'s mass, socially broad audience and its emphasis on each individual\'s own emotional conversion experience, which is why established clergy often viewed itinerant Awakening preaching as unsettling to orderly religious authority.',
        'CONTRAST WITH THE ENLIGHTENMENT. Nothing here appeals to calm reason, empirical evidence, or natural law — the opposite of the Enlightenment\'s emphasis on rational inquiry. The two movements were genuinely different impulses that happened to overlap in time, not the same underlying idea expressed two ways.',
        'STATE THE LINK TO THE COURSE THESIS, CAREFULLY. This sermon is evidence of Awakening preaching STYLE and its emotionally urgent content — it does not, by itself, prove how many listeners actually converted, or represent the full range of Awakening preaching (Whitefield\'s sermons, for instance, could be more hopeful in tone); those claims require separate outside evidence.',
      ],
      answer:
        "Edwards's sermon uses vivid, frightening imagery — God holding the sinner \"over the pit of hell, much as one holds a spider… over the fire\" — to make listeners feel their spiritual precariousness immediately, then pairs it with an urgent call to individual conversion: Christ has \"flung the door of mercy wide open,\" and sinners should \"awake and fly from the wrath to come.\" Preached to an ordinary mixed congregation at Enfield in 1741, this reflects the First Great Awakening's mass audience and its emphasis on direct, emotional, individual conversion — not an elite or narrowly theological movement, which is why established clergy often saw itinerant Awakening preaching as a threat to their authority. It stands in sharp contrast to the Enlightenment's emphasis on calm reason and natural law: the two movements overlapped in time but pulled in genuinely different directions, one toward emotional urgency and one toward rational inquiry. Read carefully, the sermon is evidence of Awakening preaching style and content, not proof of exactly how many listeners converted or of the Awakening's full stylistic range.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE feature of the First Great Awakening. (b) Briefly explain ONE piece of specific historical evidence distinguishing the Awakening from Enlightenment thought. (c) Briefly explain ONE way colonial assemblies exercised self-government during the colonial era.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine feature of the First Great Awakening — e.g. emotional, individual conversion experiences; itinerant preachers like Whitefield/Edwards; mass, socially mixed outdoor preaching; growth of new evangelical denominations. No credit for a vague, unnamed "religious movement."',
            modelResponse:
              'The First Great Awakening featured itinerant preachers like George Whitefield and Jonathan Edwards, who preached emotional sermons to enormous, socially mixed outdoor crowds, emphasizing direct, individual conversion over formal church ritual.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (a text, event, or contrast) distinguishing the Awakening from the Enlightenment, connected clearly to both. No credit for a vague or unsupported contrast.',
            modelResponse:
              "Jonathan Edwards's 1741 sermon \"Sinners in the Hands of an Angry God\" used vivid, fear-inducing imagery to provoke immediate emotional conversion, the opposite of Enlightenment writing, which appealed to calm reason and natural law rather than emotional urgency.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way a colonial assembly exercised self-government (e.g. the House of Burgesses controlling local taxation/legislation) during the era of loose British oversight. No credit for a vague or inaccurate claim.',
            modelResponse:
              "Virginia's House of Burgesses, founded in 1619, developed real practical authority over local taxation and legislation over the colonial era, as Britain left day-to-day colonial governance largely in local hands through most of the period.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-awakening-elite-and-same-as-enlightenment',
      kind: 'misconception_check',
      question:
        'True or false: (1) the First Great Awakening was primarily an elite-driven movement; and (2) the Enlightenment and the First Great Awakening were essentially the same intellectual impulse, since both happened around the same time.',
      commonErrors: [
        {
          answer: 'true (statement 1)',
          misconception:
            "Assuming any historically significant intellectual/cultural movement must have been driven from the top down by educated elites, rather than recognizing the Awakening as a genuinely mass, popular movement that often unsettled established elite religious authority.",
          correctsTo:
            "FALSE. The First Great Awakening drew huge, socially mixed crowds across the colonies and was often received as a THREAT by established, formally trained clergy, who saw itinerant preachers like Whitefield and Edwards as undermining orderly church hierarchy — not an elite project, but a broadly popular one that unsettled elites.",
        },
        {
          answer: 'true (statement 2)',
          misconception:
            "Conflating temporal overlap with shared substance — assuming two movements happening around the same decades must share the same underlying logic.",
          correctsTo:
            "FALSE. The Enlightenment and the First Great Awakening were genuinely different impulses that happened to overlap in time: the Enlightenment emphasized calm reason, empirical observation, and natural law, while the Awakening emphasized urgent emotional piety and individual conversion. Both, in different ways, encouraged colonists to trust their own judgment over inherited authority — but the JUDGMENT each appealed to (reasoned vs. spiritual) was fundamentally different.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Anglicization: colonial elites increasingly emulated British goods, fashion, and culture by the mid-1700s, fed by the era's consumer revolution.",
        "Print culture (newspapers, pamphlets, Franklin's Pennsylvania Gazette) spread ideas across the scattered colonies, creating a shared public conversation.",
        'The Enlightenment (reason, natural law) and the First Great Awakening (emotional, individual conversion — Edwards, Whitefield) overlapped in time but were genuinely different impulses, not the same movement.',
        'The Awakening was a mass, socially broad movement, not elite-driven — it often unsettled established clergy and spurred new evangelical denominations.',
        "Colonial assemblies (like Virginia's House of Burgesses) developed real self-governing power during the colonial era's loose British oversight — a policy that remained largely unbroken until 1763.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.5/2.7',
    cedTitle: 'Colonial Society and Culture',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-edwards-sinners.v1',
        chapter: '1741',
        note: 'Jonathan Edwards, "Sinners in the Hands of an Angry God" — anchor document for the First Great Awakening\'s preaching style.',
      },
    ],
  },
};
