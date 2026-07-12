/**
 * AP US History — Unit 2 CED 2.5/2.7: Colonial Society and Culture.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.colonial-society.v1`. Covers Anglicization, print
 * culture, the Enlightenment, the First Great Awakening, and colonial
 * self-government — with the explicit correction that the Awakening was a
 * mass, not elite-driven, movement genuinely distinct from Enlightenment
 * thought.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_COLONIAL_SOCIETY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.colonial-society.v1',
  course: 'AP United States History',
  cedUnit: 2,
  cedTopic: '2.5/2.7',
  cedTitle: 'Colonial Society and Culture',
  planId: 'evelyn.ap.apush.colonial-society.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.colonial-society.v1' }],
  theory: [
    {
      loId: 'apush.colonial-society',
      kind: 'definition',
      title: 'Anglicization',
      content:
        "The trend of colonial elites increasingly emulating British fashion, goods, architecture, and cultural institutions during the mid-18th century, fed by the era's growing colonial wealth and expanding British manufactured-goods trade (the consumer revolution).",
    },
    {
      loId: 'apush.colonial-society',
      kind: 'definition',
      title: 'the Enlightenment',
      content:
        'An intellectual movement emphasizing human reason, empirical observation, and natural law (associated with thinkers like Locke and Newton) as the paths to truth and to a rationally ordered, legitimate government.',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'definition',
      title: 'First Great Awakening',
      content:
        'A wave of emotional religious revivals across the colonies (1730s-40s), led by preachers like Jonathan Edwards and the itinerant British preacher George Whitefield, who preached outdoors to enormous, socially mixed crowds, emphasizing direct, individual, emotional conversion over formal church hierarchy.',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'framework',
      title: 'print culture',
      content:
        "Growing numbers of colonial newspapers, printers, and pamphlets — Benjamin Franklin's Pennsylvania Gazette among the best known — spread religious, political, and scientific ideas across a widely scattered colonial population, creating something like a shared colonial public conversation.",
    },
    {
      loId: 'apush.colonial-society',
      kind: 'event',
      title: 'Jonathan Edwards, "Sinners in the Hands of an Angry God" (1741)',
      content:
        'Preached at Enfield, Connecticut, during the First Great Awakening. Uses vivid, frightening imagery — God holding the sinner "over the pit of hell, much as one holds a spider… over the fire" — paired with an urgent call to conversion: Christ has "flung the door of mercy wide open," and sinners should "awake and fly from the wrath to come." Reflects the Awakening\'s emotional, mass-audience preaching style.',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'framework',
      title: 'Enlightenment vs. Awakening — genuinely different impulses',
      content:
        'Though they overlapped in time, the two movements pulled in different directions: the Enlightenment elevated calm reason and this-worldly inquiry, while the Awakening elevated urgent emotional piety and fear of damnation. Both encouraged colonists to trust their own judgment over inherited authority — but the kind of judgment (reasoned vs. spiritual) was fundamentally different.',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'framework',
      title: "the Awakening's social reach and effects",
      content:
        'The Awakening drew huge, socially mixed crowds — often received as a THREAT by established, formally trained clergy, who saw itinerant preachers like Whitefield and Edwards as undermining orderly church hierarchy. It contributed to the growth of new evangelical denominations (Baptists, Methodists) and challenged established churches (Congregational, Anglican).',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'event',
      title: "colonial assemblies and self-government",
      content:
        "Representative colonial assemblies — such as Virginia's House of Burgesses (founded 1619) — developed real governing power over local taxation and legislation across the colonial era, growing naturally out of Britain's loose oversight of colonial trade and governance, a policy that remained largely unbroken until 1763.",
    },
    {
      loId: 'apush.colonial-society',
      kind: 'trap',
      title: 'the Awakening was not elite-driven',
      content:
        'The First Great Awakening was a broadly popular, mass movement that often unsettled elites, not a top-down elite project. Established clergy frequently viewed itinerant Awakening preachers as threats to their own authority.',
    },
    {
      loId: 'apush.colonial-society',
      kind: 'trap',
      title: 'Enlightenment and Awakening are not the same movement',
      content:
        'Temporal overlap does not mean shared substance. The Enlightenment (reason, natural law) and the Awakening (emotional piety, individual conversion) were genuinely different impulses that happened to overlap in the same decades.',
    },
  ],
  methods: [
    {
      title: "Source and analyze an Awakening-era sermon (HIPP)",
      when_to_use:
        'Use this as the first move on any unfamiliar First Great Awakening primary-source excerpt, before making any claim about what the text argues or represents.',
      steps: [
        'H — HISTORICAL CONTEXT: when and where was this preached, during which wave of revival?',
        'I — INTENDED AUDIENCE: an ordinary, mixed congregation, not trained theologians.',
        'P — PURPOSE: state the purpose as a verb (provoke immediate emotional conversion), not a topic (sin).',
        'P — POINT OF VIEW: the preacher\'s Awakening-style emphasis on individual, emotional, urgent conversion.',
        'CONTRAST with the Enlightenment\'s reliance on reason and natural law — do not treat the two as the same impulse.',
        'DO NOT overclaim: a single sermon is evidence of preaching style/content, not proof of exactly how many people converted.',
      ],
      example: {
        problem: 'What does Edwards\'s "Sinners in the Hands of an Angry God" (1741) reveal about the First Great Awakening?',
        solution:
          "Preached to an ordinary Enfield congregation in 1741, it uses vivid, frightening imagery paired with an urgent call to individual conversion — reflecting the Awakening's mass, emotional preaching style, genuinely distinct from Enlightenment reason. It is evidence of preaching style and content, not proof of exact conversion numbers.",
      },
      relatedLoIds: ['apush.colonial-society'],
    },
  ],
  pointers: [
    { content: 'Quote Edwards\'s seeded wording exactly: "flung the door of mercy wide open," not "thrown open."', kind: 'gotcha' },
    { content: "The #1 trap: calling the Awakening elite-driven. It was a mass movement that often threatened established clergy's authority.", kind: 'trap' },
    { content: 'Do not conflate the Enlightenment and the Awakening just because they overlapped in time — reason vs. emotional piety are different appeals.', kind: 'common-error' },
    { content: "Colonial assemblies' self-government grew out of the SAME loose British oversight (salutary neglect) covered in the transatlantic-economy topic — a useful cross-topic link.", kind: 'tip' },
    { content: 'Anglicization and the consumer revolution are linked: rising colonial wealth from trade fed elite emulation of British culture.', kind: 'frq-vocab' },
  ],
};
