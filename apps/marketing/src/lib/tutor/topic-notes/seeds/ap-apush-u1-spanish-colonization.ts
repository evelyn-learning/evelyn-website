/**
 * AP US History — Unit 1 CED 1.6-1.7: Spanish Colonization and Labor
 * Systems.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.spanish-colonization.v1`. Covers the encomienda and
 * repartimiento labor systems, the casta social hierarchy, and the
 * Valladolid debate (1550–51) — with the explicit correction that Las
 * Casas's advocacy produced partial legal reform, not the end of forced
 * Indigenous labor.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SPANISH_COLONIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.spanish-colonization.v1',
  course: 'AP United States History',
  cedUnit: 1,
  cedTopic: '1.6-1.7',
  cedTitle: 'Spanish Colonization and Labor Systems',
  planId: 'evelyn.ap.apush.spanish-colonization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.spanish-colonization.v1' }],
  theory: [
    {
      loId: 'apush.spanish-colonization',
      kind: 'definition',
      title: 'encomienda',
      content:
        'A Spanish colonial labor system granting an individual colonist (an encomendero) the right to demand labor and tribute from a designated group of Native people, nominally in exchange for protection and instruction in Catholicism. In practice, encomienda labor — especially in mining and agriculture — was frequently coercive and, combined with disease, contributed to devastating mortality.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'definition',
      title: 'repartimiento',
      content:
        'The system that succeeded the encomienda as criticism grew and Native population collapse made individual labor grants unsustainable: rotational forced labor drafts administered directly by colonial officials rather than granted to individual encomenderos. Reduced some of the encomienda\'s worst individual abuses but remained coercive, not free labor.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'definition',
      title: 'casta system',
      content:
        'The hierarchical classification of Spanish colonial society by ancestry and birthplace: peninsulares (born in Spain) at the top, then criollos (American-born, Spanish descent), mestizos (mixed Spanish/Native), mulattos (mixed Spanish/African), Native peoples, and enslaved Africans. Casta status shaped legal standing, tax obligations, and access to office.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'event',
      title: 'the Valladolid debate (1550–51)',
      content:
        'A formal debate convened by the Spanish Crown in Valladolid, Spain, between Bartolomé de las Casas (arguing Native Americans were fully rational people who should be evangelized by persuasion, not conquered or enslaved) and Juan Ginés de Sepúlveda (arguing conquest and forced labor were justified). No side was formally declared the winner. Shows the treatment of Native Americans was a contested question within Spain\'s own colonial establishment.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'event',
      title: 'Las Casas\'s testimony and the New Laws (1542)',
      content:
        'Bartolomé de las Casas, a Dominican friar and former encomendero, documented the encomienda\'s operation firsthand and rejected Spain\'s official justifications (honoring God, saving souls, serving the King), naming "insatiable Avarice and Ambition" as the real motive. Partly in response to his decades of advocacy, the Crown issued the New Laws (1542) restricting inheritance of encomiendas — but colonial encomenderos resisted fiercely (violently in Peru), enforcement was weak, and forced Indigenous labor continued via the repartimiento afterward.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'framework',
      title: 'from conquest to colonial administration',
      content:
        'Following conquests such as Hernán Cortés\'s defeat of the Aztec Empire (1519–1521), Spain established colonial administration over vast territories, extracting labor and resources through systems (encomienda, then repartimiento) that bound Native peoples to Spanish colonists.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'trap',
      title: 'internal debate and legal reform ≠ ending the practice',
      content:
        'Advocacy (Las Casas) and legal reform (the New Laws, 1542) are not the same as enforcement or abolition. Forced Indigenous labor continued in evolving forms (the repartimiento) for generations after 1542, despite decades of internal Spanish criticism.',
    },
    {
      loId: 'apush.spanish-colonization',
      kind: 'trap',
      title: 'Spanish colonization was one European approach, not the template',
      content:
        'Spain\'s extractive, labor-grant model of colonization was one approach among several European strategies for organizing contact with Native peoples — a reminder against treating "European colonization" as a single uniform process.',
    },
  ],
  methods: [
    {
      title: "Analyze Las Casas's testimony as evidence, not proof of reform",
      when_to_use:
        'Use this when a primary source documents an abuse or a reform effort, to avoid concluding the documented critique automatically changed practice on the ground.',
      steps: [
        'IDENTIFY what the source directly documents (e.g., the mechanics of forced labor).',
        'IDENTIFY the source\'s own argument or claim (e.g., naming avarice as the true motive, rejecting official justifications).',
        'CONNECT to the broader internal debate the source is evidence of (e.g., Valladolid).',
        'DO NOT assume the critique or resulting law ended the practice — check what happened AFTER the reform (enforcement, resistance, continuation in a new form).',
      ],
      example: {
        problem: "Does Las Casas's account prove the encomienda ended?",
        solution:
          "No — his account documents how the encomienda operated and is evidence of internal Spanish debate over its morality, which fed into the Valladolid debate and the New Laws (1542). But colonial resistance and weak enforcement meant forced labor continued via the repartimiento; the source is evidence of the argument, not evidence the argument was won on the ground.",
      },
      relatedLoIds: ['apush.spanish-colonization'],
    },
  ],
  pointers: [
    { content: 'Know the encomienda → repartimiento sequence: individual labor grants first, then rotational drafts administered by officials — both coercive.', kind: 'frq-vocab' },
    { content: 'The #1 trap: assuming Las Casas or the Valladolid debate ended forced Indigenous labor. The New Laws (1542) were resisted and weakly enforced; the repartimiento continued the practice.', kind: 'trap' },
    { content: 'Casta terms (peninsulares, criollos, mestizos, mulattos) are commonly tested vocabulary — know the ancestry basis of each tier, not just the names.', kind: 'frq-vocab' },
    { content: 'Valladolid (1550–51): Las Casas vs. Sepúlveda — no declared winner. Do not claim either side "won" the debate.', kind: 'common-error' },
    { content: 'Quote Las Casas\'s stated motive as "insatiable Avarice and Ambition" — his own explicit rejection of Spain\'s official justifications (God, souls, King).', kind: 'tip' },
  ],
};
