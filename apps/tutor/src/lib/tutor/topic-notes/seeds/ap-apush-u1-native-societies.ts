/**
 * AP US History — Unit 1 CED 1.2-1.3: Native American Societies Before
 * European Contact.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.native-societies.v1`. Covers the diversity of pre-1492
 * Native American societies — Mississippian mound builders (Cahokia),
 * Ancestral Puebloans, the Haudenosaunee (Iroquois) Confederacy, and
 * Pacific Northwest maritime societies — against the linked misconceptions
 * of an "empty wilderness" and a single, uniform "Indian culture."
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_NATIVE_SOCIETIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.native-societies.v1',
  course: 'AP United States History',
  cedUnit: 1,
  cedTopic: '1.2-1.3',
  cedTitle: 'Native American Societies Before European Contact',
  planId: 'evelyn.ap.apush.native-societies.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.native-societies.v1' }],
  theory: [
    {
      loId: 'apush.native-societies',
      kind: 'definition',
      title: 'Cahokia (Mississippian culture)',
      content:
        'The largest pre-Columbian settlement north of Mexico, near present-day St. Louis. A Mississippian mound-building center peaking roughly 1050–1200 CE with an estimated population in the range of 10,000–20,000 (some estimates run higher), centered on the massive earthen Monks Mound. Supported by intensive maize agriculture in the Mississippi floodplain and long-distance trade networks (shell, copper, mica), organized under a stratified political and religious hierarchy.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'definition',
      title: 'Ancestral Puebloans',
      content:
        'A Southwest civilization (e.g., Chaco Canyon, Mesa Verde) known for multi-story stone/adobe great houses and cliff dwellings. Adapted to an arid environment through irrigated maize, beans, and squash agriculture and careful water management; Chaco Canyon anchored a regional trade network (turquoise, macaws) spanning hundreds of miles.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'definition',
      title: 'Haudenosaunee (Iroquois) Confederacy',
      content:
        'A political alliance of five Northeastern nations (Mohawk, Oneida, Onondaga, Cayuga, Seneca) united under the Great Law of Peace, with a council structure for resolving disputes between member nations. Organized around matrilineal clans, in which women held significant social and political authority, including a voice in selecting male chiefs.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'concept',
      title: 'Pacific Northwest maritime societies',
      content:
        'Coastal peoples of the Pacific Northwest built dense, permanent, socially stratified societies (chiefs, nobility, commoners) WITHOUT agriculture — annual salmon runs and other marine resources were reliable and abundant enough to support large sedentary populations. Practiced the potlatch, a ceremonial feast at which a host distributed or destroyed wealth to affirm and negotiate social status.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'framework',
      title: 'scale and diversity, not emptiness or uniformity',
      content:
        'Pre-1492 North America held an estimated population in the millions (scholarly estimates vary and remain debated, but consistently well above old "sparse wilderness" assumptions), organized into hundreds of distinct societies with different languages, economies, and governments. There was no single "Native American culture."',
    },
    {
      loId: 'apush.native-societies',
      kind: 'framework',
      title: 'the common thread is adaptation, not uniformity',
      content:
        'What these societies shared was not a common economy or government, but a common pattern of building complex, sustainable societies closely adapted to a specific environment — farming floodplains and deserts, fishing rich coastal waters, or governing through confederation rather than monarchy. The specific solution always depended on the specific place.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'trap',
      title: '"empty wilderness" myth',
      content:
        'Pre-1492 North America was not sparsely populated — Cahokia alone held an estimated 10,000–20,000+ people at its peak. Treating the continent as an empty backdrop erases the scale of pre-contact societies the AP exam expects you to be able to describe.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'trap',
      title: '"uniform culture" myth',
      content:
        'Native American societies were not one shared culture. Ancestral Puebloan irrigation farming, Haudenosaunee confederated matrilineal governance, and Pacific Northwest non-agricultural maritime hierarchies are three genuinely different models of social and political organization within the same pre-1492 period — always name the SPECIFIC society, not "Native Americans" generically.',
    },
    {
      loId: 'apush.native-societies',
      kind: 'framework',
      title: 'comparing two societies (Cahokia vs. Pacific Northwest)',
      content:
        'Cahokia and Pacific Northwest maritime societies both reached large, complex, permanent populations — but by entirely different paths: one through intensive floodplain agriculture, the other through reliance on salmon runs with no agriculture at all. Useful contrast pair for showing diversity of adaptation on the AP exam.',
    },
  ],
  methods: [
    {
      title: 'Compare two Native American societies\' adaptations to their environments',
      when_to_use:
        'Use this when asked to compare, contrast, or evaluate diversity among pre-1492 Native American societies rather than describing just one.',
      steps: [
        'NAME both societies specifically (never "Native Americans" as a single unit).',
        'IDENTIFY the environment each adapted to (floodplain, arid desert, woodlands, coastline).',
        'IDENTIFY the resulting economy (agriculture vs. maritime/hunting-fishing-gathering) and how it was shaped by that environment.',
        'IDENTIFY the resulting political/social structure (chiefdom, confederation, stratified maritime hierarchy) and connect it to the economy that supported it.',
        'STATE the contrast explicitly: what differs between the two, and why the environment explains that difference.',
      ],
      example: {
        problem: 'Compare Cahokia and the Haudenosaunee Confederacy.',
        solution:
          'Cahokia was a single stratified chiefdom supported by intensive floodplain maize agriculture, with political and religious authority concentrated in a ruling hierarchy. The Haudenosaunee Confederacy instead united five separate nations under a shared law (the Great Law of Peace), with matrilineal clans distributing political voice rather than concentrating it in one ruler — a fundamentally different political model even though both were complex, populous societies.',
      },
      relatedLoIds: ['apush.native-societies'],
    },
  ],
  pointers: [
    { content: 'Always name a SPECIFIC society (Cahokia, Ancestral Puebloans, Haudenosaunee, Pacific Northwest peoples) — never answer with "Native Americans" as an undifferentiated group.', kind: 'tip' },
    { content: 'Cahokia\'s population estimate (10,000–20,000+ at its peak, c. 1050–1200 CE) is a commonly tested specific figure — know the range, not an exact number.', kind: 'frq-vocab' },
    { content: 'The Pacific Northwest built complex, stratified societies WITHOUT agriculture — a useful example that complexity does not require farming.', kind: 'tip' },
    { content: 'The Haudenosaunee were matrilineal — women held real political authority, including a voice in selecting chiefs. Do not describe pre-contact Native governance as uniformly patriarchal.', kind: 'common-error' },
    { content: 'The #1 trap: treating pre-1492 North America as empty or uniform. Always cite the population scale (millions, hundreds of societies) and name at least two contrasting societies.', kind: 'trap' },
  ],
};
