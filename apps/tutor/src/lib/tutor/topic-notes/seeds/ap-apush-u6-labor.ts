/**
 * AP US History — Unit 6 CED 6.7: The Labor Movement.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.labor-movement.v1`. Covers industrial working
 * conditions, the Knights of Labor vs. AFL organizing strategies, the
 * major strikes of the period (1877, Haymarket, Homestead, Pullman), and
 * government injunctions/troops used against strikers.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_LABOR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.labor-movement.v1',
  course: 'AP United States History',
  cedUnit: 6,
  cedTopic: '6.7',
  cedTitle: 'The Labor Movement',
  planId: 'evelyn.ap.apush.labor-movement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.labor-movement.v1' }],
  theory: [
    {
      loId: 'apush.labor-movement',
      kind: 'definition',
      title: 'Knights of Labor',
      content:
        'Founded 1869, peaked mid-1880s under Terence Powderly. Organized skilled AND unskilled workers broadly (men and women, across racial lines with real limits, excluding Chinese immigrants), pursued reforms beyond wages (eight-hour day, ending child labor, cooperative ownership), and officially preferred arbitration to strikes. Declined rapidly after being unfairly blamed for Haymarket (1886).',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'definition',
      title: 'American Federation of Labor (AFL)',
      content:
        'Founded 1886 under Samuel Gompers. Organized ONLY skilled workers into craft-specific unions, pursuing a narrower "bread-and-butter" strategy focused on wages, hours, and conditions through direct negotiation and strikes. This narrower, pragmatic focus let it survive and grow where the Knights collapsed.',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'framework',
      title: 'the Knights vs. AFL distinction',
      content:
        'A genuine strategic split, not "radical vs. moderate": the Knights were broad in membership and reform ambition (though officially non-violent), while the AFL was narrow in membership and goals but still used strikes as a central tactic. Do not equate "narrower" with "less willing to strike."',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'event',
      title: 'the Great Railroad Strike (1877)',
      content:
        'First major nationwide labor conflict, sparked by wage cuts during an economic downturn. State militias and federal troops (ordered by President Hayes) suppressed the strikes — establishing an early pattern of government siding with employers.',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'event',
      title: 'Haymarket (1886)',
      content:
        'A bomb thrown at police during a Chicago labor rally (tied to the eight-hour-day movement) killed police and civilians after police fired into the crowd. Several anarchist organizers were convicted on limited evidence. Badly damaged public support for organized labor generally, unfairly tarring the much larger, largely non-violent Knights of Labor.',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'event',
      title: 'Homestead (1892)',
      content:
        'At Carnegie Steel\'s Homestead, PA plant, management (Henry Clay Frick, acting for an absent Carnegie) locked out steelworkers and hired armed Pinkerton guards; an armed battle left several dead, and the strike was broken with state militia support.',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'event',
      title: 'Pullman (1894)',
      content:
        'After the Pullman Palace Car Company cut wages without lowering company-town rents, workers struck; the American Railway Union under Eugene V. Debs launched a nationwide sympathy boycott. President Cleveland sent federal troops; a federal injunction against the strike was upheld by the Supreme Court in In re Debs (1895).',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'law',
      title: 'In re Debs (1895)',
      content:
        'Supreme Court decision upholding the federal injunction against the Pullman Strike leaders, affirming federal power to use injunctions to break strikes threatening interstate commerce or mail delivery — a durable anti-strike legal tool.',
    },
    {
      loId: 'apush.labor-movement',
      kind: 'trap',
      title: 'early unions were not uniformly radical',
      content:
        'The Knights officially favored arbitration over strikes; the AFL pursued pragmatic, incremental bargaining. Violent incidents (Haymarket, Homestead) were specific, contested events, not the whole movement\'s strategy.',
    },
  ],
  methods: [
    {
      title: 'Compare two labor organizations by membership scope and goals, not by "militancy"',
      when_to_use:
        'Use this when asked to distinguish the Knights of Labor from the AFL, or any two labor organizations more generally.',
      steps: [
        'Identify WHO each organization admits as members (skill level, gender, race).',
        'Identify the SCOPE of each organization\'s goals (narrow wage/hour bargaining vs. broad social reform).',
        'Connect membership breadth to vulnerability: broader coalitions are harder to discipline and more exposed to backlash from any one incident.',
        'Avoid collapsing the comparison into "radical vs. not a real union" — check each organization\'s OFFICIAL policy on strikes vs. arbitration before assuming.',
      ],
      example: {
        problem: 'Why did the AFL survive while the Knights of Labor collapsed after 1886?',
        solution:
          'The Knights\' broad membership and agenda made it vulnerable to public backlash from any single incident (Haymarket, despite the Knights\' own arbitration-favoring policy); the AFL\'s narrower, trade-based structure gave skilled workers more bargaining leverage and less collective exposure, letting it pursue concrete, winnable gains.',
      },
      relatedLoIds: ['apush.labor-movement'],
    },
  ],
  pointers: [
    { content: 'Knights of Labor = broad membership + broad reform agenda + official arbitration preference. AFL = skilled workers only + narrow wage/hour focus + used strikes. Do not swap these.', kind: 'frq-vocab' },
    { content: 'Early unions were NOT uniformly radical — most labor organizing was non-violent; Haymarket and Homestead are specific events, not the whole movement\'s character.', kind: 'trap' },
    { content: 'Strike order to memorize with outcomes: 1877 (Great RR Strike, troops), 1886 (Haymarket, bombing/convictions), 1892 (Homestead, Pinkertons/militia), 1894 (Pullman, injunction/In re Debs 1895).', kind: 'tip' },
    { content: 'In re Debs (1895) is the go-to case citation for "government sided with employers via the courts" — pair it with the Pullman Strike specifically.', kind: 'frq-vocab' },
    { content: 'Keep Homestead STRIKE (1892, labor) distinct from the Homestead ACT (1862, land settlement) — same word, unrelated topics in different plans.', kind: 'gotcha' },
  ],
};
