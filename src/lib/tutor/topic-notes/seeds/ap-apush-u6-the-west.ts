/**
 * AP US History — Unit 6 CED 6.2-6.3: The West and the New South.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.the-west-new-south.v1`. Covers federally subsidized
 * western settlement (Homestead Act, transcontinental railroad), the
 * Plains Wars (Little Bighorn, Wounded Knee), the Dawes Act, and the gap
 * between "New South" boosterism and the Jim Crow/tenant-farming reality
 * (through Plessy v. Ferguson).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_THE_WEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.the-west-new-south.v1',
  course: 'AP United States History',
  cedUnit: 6,
  cedTopic: '6.2-6.3',
  cedTitle: 'The West and the New South',
  planId: 'evelyn.ap.apush.the-west-new-south.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.the-west-new-south.v1' }],
  theory: [
    {
      loId: 'apush.the-west-new-south',
      kind: 'definition',
      title: 'Homestead Act (1862)',
      content:
        'Federal law granting 160 acres of public land nearly free to settlers who worked and improved it for five years. Combined with federal land grants and loans subsidizing transcontinental railroad construction, it drove rapid settlement of the Great Plains.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'definition',
      title: 'Dawes Act (1887)',
      content:
        'Federal law breaking up communally held reservation land into individual family allotments (typically 160 acres) to force assimilation into individual farming; "surplus" land was sold to non-Native settlers. Devastated Native landholding (roughly halved in following decades) without achieving its stated assimilationist goal.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'definition',
      title: 'crop-lien system',
      content:
        'A credit arrangement in which tenant farmers and sharecroppers borrowed against a future harvest to buy supplies, frequently trapping them in cyclical debt to landowners or merchants — the economic reality underneath "New South" boosterism.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'event',
      title: 'the transcontinental railroad (completed 1869)',
      content:
        'The Union Pacific (building west from Omaha) and Central Pacific (building east from Sacramento, relying heavily on Chinese immigrant laborers) met at Promontory Summit, Utah, in 1869, cutting coast-to-coast travel time and cost and accelerating settlement, mining, and ranching.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'event',
      title: 'the Plains Wars',
      content:
        'Escalating conflict between the U.S. and Plains nations (Lakota Sioux, Cheyenne, and others) as railroads, settlers, and commercial buffalo hunting destroyed the herds Plains nations depended on. Battle of the Little Bighorn (1876): Lakota and Cheyenne forces under Sitting Bull and Crazy Horse defeated Custer\'s Seventh Cavalry — a rare decisive Native victory. Wounded Knee (1890): U.S. cavalry killed roughly 150-300 Lakota men, women, and children in the context of the Ghost Dance movement\'s suppression, generally treated as marking the end of large-scale armed resistance on the Plains. Both require measured, non-triumphalist treatment.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'event',
      title: '"New South" rhetoric vs. reality',
      content:
        'Boosters like Atlanta journalist Henry Grady promoted a vision of a modernized, diversified, industrializing South. Real but limited industrial growth occurred (textile mills, some rail expansion), but most former slaves and many poor white farmers became tenant farmers or sharecroppers trapped in the crop-lien system, continuing cotton-economy dependence rather than achieving the promised diversification.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'event',
      title: 'Jim Crow and Plessy v. Ferguson (1896)',
      content:
        'Southern state legislatures passed segregation laws ("Jim Crow") and voting restrictions (poll taxes, literacy tests, grandfather clauses). Plessy v. Ferguson (1896) upheld racial segregation on railway cars under a "separate but equal" doctrine, giving constitutional cover to segregation for nearly six decades.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'framework',
      title: 'the through-line: subsidized "opportunity" and displacement',
      content:
        'Both the West and the New South were sold to contemporaries as open frontiers of opportunity, but both require reckoning with who was already there (Plains nations; formerly enslaved Black Southerners) and how quickly new structures (the Dawes Act; Jim Crow and the crop-lien system) reasserted control over land and labor.',
    },
    {
      loId: 'apush.the-west-new-south',
      kind: 'trap',
      title: 'the "empty frontier" myth',
      content:
        'Avoid describing the West as empty, unclaimed land. It was home to Native nations with treaty-recognized claims and subsistence dependent on the buffalo herds that railroads and settlement destroyed — displacement is a direct EFFECT of federal settlement policy, not a side note to it.',
    },
  ],
  methods: [
    {
      title: 'Read a settlement-era statistic for what it shows AND what it omits',
      when_to_use:
        'Use this when a source presents settlement, land-claim, or development statistics (e.g. homestead filings, railroad mileage) without mentioning displacement.',
      steps: [
        'Read the statistic literally first: what does it directly measure? (e.g. legal land claims filed, not land use history.)',
        'Identify the policy machinery that produced the pattern (e.g. Homestead Act + railroad land grants working together).',
        'Ask what the statistic does NOT measure — often, prior occupancy or use by groups whose claims are not reflected in the data source\'s categories.',
        'State the fuller picture: the statistic can be accurate evidence of rapid, subsidized development AND incomplete evidence unless paired with what it displaced.',
      ],
      example: {
        problem:
          'Dakota Territory homestead filings rose from a few hundred per year in the early 1870s to tens of thousands per year by the early 1880s, tracking railroad branch-line arrival.',
        solution:
          'This shows subsidized settlement (Homestead Act + railroad land grants) working together to drive rapid development — but every acre "opened" for filing in a rail corridor was land Plains nations already used or held treaty claims to, so the same data is also evidence of the displacement driving the era\'s Plains Wars.',
      },
      relatedLoIds: ['apush.the-west-new-south'],
    },
  ],
  pointers: [
    { content: 'The West was NOT empty land — describing it that way erases the displacement of Plains nations that federally subsidized settlement directly caused.', kind: 'trap' },
    { content: 'Little Bighorn (1876) and Wounded Knee (1890) both require measured, exam-neutral treatment — no triumphalist framing, no flattening into a single villain/victim story.', kind: 'tip' },
    { content: 'Keep the Homestead Act (1862, land to settlers) distinct from the Homestead STRIKE (1892, Carnegie Steel labor conflict) — same word, unrelated events in different plans.', kind: 'gotcha' },
    { content: 'The Dawes Act (1887) is assimilationist land-allotment policy — it dismantled communal landholding, it did not protect it.', kind: 'tip' },
    { content: '"New South" boosterism promised diversification; the crop-lien system and Jim Crow (Plessy v. Ferguson, 1896) show what actually persisted. Name the specific mechanism, not just "things stayed the same."', kind: 'frq-vocab' },
  ],
};
