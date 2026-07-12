/**
 * AP US History — CED Unit 6.7: The Labor Movement.
 *
 * Period-6 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * No passage is wired to this plan — the period block reserves its five
 * seeded documents for the industrialization, immigration, and
 * gilded-politics plans and the DBQ packet. The worked example instead
 * walks a described, non-passage primary-source comparison (each
 * organization's own stated membership criteria, drawn from their
 * publicly known founding constitutions) rather than quoting any seeded
 * document.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_LABOR: LessonPlan = {
  id: 'evelyn.ap.apush.labor-movement.v1',
  title: 'U6.7 The Labor Movement',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.labor-movement',
      description:
        'Explain the conditions industrial workers faced, distinguish the Knights of Labor from the American Federation of Labor, explain the significance of major strikes (1877, Haymarket, Homestead, Pullman), and evaluate the role of government injunctions and troops in labor disputes.',
      standard: 'AP-APUSH-6.7',
    },
  ],
  prerequisites: ['apush.industrialization-big-business'],
  followUps: ['apush.gilded-politics-populism'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the labor movement as a genuine internal debate over strategy — inclusive reform vs. narrow, disciplined bargaining — not a single unified radical movement.',
      script:
        "Imagine you're organizing industrial workers in the 1880s: twelve-hour days, dangerous machinery, wages that could be cut without warning, no legal right to bargain collectively. You have a real strategic choice to make. Do you organize EVERYONE — skilled and unskilled, men and women, Black and white, immigrant and native-born — into one giant movement pushing for a totally different economic system? Or do you organize only skilled workers, in narrow craft unions, focused entirely on winning better wages and hours from employers as they exist right now? Both approaches were tried in this period, by two of the era's biggest labor organizations, and they came to very different ends. Today we're tracing that strategic split — and the string of violent strikes that tested both approaches against a government and court system that, again and again, sided with employers.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-organizing-and-strikes',
      kind: 'concept',
      goal: 'Explain industrial working conditions, the Knights of Labor vs. AFL organizing strategies, the major strikes of the period, and the government\'s response to labor conflict.',
      keyIdeas: [
        'INDUSTRIAL WORKING CONDITIONS: factory and mine work in this period commonly meant ten-to-twelve-hour days, six-day weeks, dangerous unguarded machinery, low wages that employers could cut unilaterally during downturns, and widespread child labor. Workers had essentially no legal right to organize or bargain collectively, and no government safety net (no minimum wage, no workers\' compensation, no unemployment insurance) if injured or laid off.',
        'THE KNIGHTS OF LABOR: founded in 1869, reaching peak membership in the mid-1880s under leader Terence Powderly. The Knights pursued an INCLUSIVE strategy — organizing skilled AND unskilled workers, men and women, across racial lines (with notable exceptions and limits, including excluding Chinese immigrant workers), pushing for broad reforms beyond wages (an eight-hour day, an end to child labor, cooperative ownership of workplaces) and generally preferring arbitration to strikes. The Knights declined rapidly after being (unfairly) blamed for the violence at Haymarket in 1886, which the public associated with labor radicalism generally.',
        'THE AMERICAN FEDERATION OF LABOR (AFL): founded in 1886 under Samuel Gompers, organized ONLY skilled workers into craft-specific unions, and pursued a narrower "bread-and-butter" strategy — focused concretely on wages, hours, and working conditions through direct negotiation and, when necessary, strikes, rather than broader social or political reform. This narrower, more pragmatic focus let the AFL survive and grow where the more broadly ambitious Knights of Labor collapsed.',
        'THE KEY ORGANIZATIONAL DISTINCTION: the Knights of Labor and the AFL represent two genuinely different labor strategies in the same period, not a single "radical vs. not radical" story — the Knights were broadly inclusive and reform-oriented (though largely non-violent in official policy), while the AFL was narrower, more pragmatic, and focused on immediate economic gains for skilled workers specifically.',
        'THE GREAT RAILROAD STRIKE (1877): a wave of strikes across multiple states after railroad companies cut wages during an economic downturn — the first major nationwide labor conflict in U.S. history. State militias and eventually federal troops, ordered by President Hayes, suppressed the strikes, establishing an early pattern of government siding with employers against striking workers.',
        'HAYMARKET (1886): during a labor rally in Chicago tied to the broader eight-hour-day movement, an unidentified person threw a bomb at police, who then fired into the crowd; several police officers and civilians died. Though the bomber was never identified, several anarchist labor organizers were tried and convicted based on their rhetoric rather than direct evidence of the bombing, and the incident badly damaged public support for organized labor generally — unfairly tarring the much larger, largely non-violent Knights of Labor with the same brush.',
        'HOMESTEAD (1892): at Carnegie Steel\'s Homestead, Pennsylvania plant, management (acting for an absent Carnegie, under plant manager Henry Clay Frick) locked out steelworkers and hired armed Pinkerton guards to protect strikebreakers; an armed battle between strikers and Pinkertons left several dead on both sides, and the strike was ultimately broken with state militia support — a major defeat for organized steelworkers.',
        'PULLMAN (1894): after the Pullman Palace Car Company cut wages without lowering rents in its company town, workers struck, and the American Railway Union under Eugene V. Debs launched a sympathy boycott of trains carrying Pullman cars nationwide. President Cleveland sent federal troops to keep mail trains running, and a federal court issued an injunction against the strike; the Supreme Court upheld the injunction in In re Debs (1895), affirming the federal government\'s power to break strikes it judged a threat to interstate commerce or mail delivery.',
        'GOVERNMENT INJUNCTIONS AND TROOPS: across 1877, Homestead, and Pullman, the pattern is consistent — federal and state governments repeatedly used militia, federal troops, and court injunctions to suppress strikes, generally siding with employers over striking workers. This established labor injunctions as a durable anti-strike legal tool that persisted well into the twentieth century.',
      ],
      vocabulary: [
        {
          term: 'Knights of Labor',
          definition:
            'a labor organization (founded 1869, peaked mid-1880s under Terence Powderly) that organized skilled and unskilled workers broadly and pursued reforms beyond wages; declined after being blamed for Haymarket (1886).',
        },
        {
          term: 'American Federation of Labor (AFL)',
          definition:
            'a labor organization (founded 1886 under Samuel Gompers) organizing only skilled workers into craft unions, pursuing a narrower "bread-and-butter" focus on wages, hours, and conditions.',
        },
        {
          term: 'Haymarket affair (1886)',
          definition:
            'a Chicago labor rally where a bomb killed police and civilians; several anarchist organizers were convicted on limited evidence, and public support for organized labor broadly declined afterward.',
        },
        {
          term: 'In re Debs (1895)',
          definition:
            'Supreme Court decision upholding a federal injunction against the Pullman Strike leaders, affirming the federal government\'s power to use injunctions to break strikes affecting interstate commerce or mail.',
        },
        {
          term: 'labor injunction',
          definition:
            'a court order (used repeatedly against strikes in this period, e.g. Pullman 1894) prohibiting specific strike activities, backed by the threat of contempt-of-court penalties.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-knights-vs-afl-membership',
      kind: 'worked_example',
      problem:
        'Compare these two organizing approaches: the Knights of Labor\'s founding documents welcomed workers from virtually every occupation, explicitly including unskilled laborers, women, and (with notable limits) workers across racial lines, while pursuing goals including an eight-hour day, an end to child labor, and cooperative workplace ownership. The American Federation of Labor, by contrast, organized workers exclusively through skilled craft unions (e.g. separate unions for carpenters, cigar makers, printers), focusing its demands narrowly on wages, hours, and working conditions for those specific trades. What does this contrast reveal about labor strategy in this period, and why might it help explain why the AFL survived while the Knights of Labor collapsed?',
      steps: [
        'IDENTIFY THE MEMBERSHIP CONTRAST FIRST. The Knights of Labor pursued BREADTH — nearly all workers regardless of skill, and a broad reform agenda beyond wages. The AFL pursued NARROWNESS — only skilled workers, organized trade by trade, with demands limited to concrete workplace terms.',
        'CONNECT BREADTH TO VULNERABILITY. A broad, loosely organized coalition covering many trades and skill levels is harder to discipline around a single strategy and more exposed to public backlash against ANY member\'s actions — which is exactly what happened when the Knights, despite an official policy favoring arbitration over violence, were blamed for the Haymarket bombing (1886) even though the incident involved separate anarchist organizers, not the Knights\' own leadership.',
        'CONNECT NARROWNESS TO RESILIENCE. The AFL\'s narrower structure — one union per skilled trade, each with real bargaining leverage because skilled workers were harder to replace than unskilled laborers — made the movement less exposed to being blamed as a whole for any one incident, and let it focus its energy on winning concrete, achievable gains (wages, hours) rather than broader social transformation that was harder to deliver and easier to attack.',
        'AVOID THE OVERSIMPLIFIED CONCLUSION. This does NOT mean the Knights were "radical" and the AFL was "not a real union" — the Knights\' OFFICIAL policy favored arbitration over strikes, and the AFL used strikes as a central tactic (including major strikes like Homestead, 1892, which grew out of an AFL-affiliated steelworkers\' union). The real contrast is in SCOPE of membership and goals, not in militancy.',
        'STATE THE LINK TO THE COURSE THESIS. The two organizations represent a genuine strategic debate within the labor movement about how to build durable power under a hostile legal and political system — and the AFL\'s narrower, more pragmatic model proved more durable across the era\'s repeated strike defeats and government crackdowns.',
      ],
      answer:
        'The contrast shows two different labor strategies, not one uniformly "radical" labor movement. The Knights of Labor pursued a broad coalition — skilled and unskilled workers, across gender and (with real limits) racial lines — and a wide reform agenda beyond wages, including an eight-hour day and cooperative ownership. The AFL organized only skilled workers, trade by trade, focused narrowly on wages, hours, and conditions. This helps explain their different fates: the Knights\' breadth made the organization harder to control and more exposed to public backlash from any single incident — exactly what happened when the Knights were unfairly blamed for the Haymarket bombing (1886) despite it involving separate anarchist organizers, and the organization\'s membership collapsed afterward. The AFL\'s narrower, trade-based structure gave it more disciplined bargaining leverage (skilled workers were harder to replace) and less collective exposure to any one incident\'s fallout, letting it pursue concrete, winnable gains and survive where the more broadly ambitious Knights did not. This is a genuine strategic split in the labor movement, not simply a difference between a "radical" and a "moderate" organization — both used strikes as a tactic at times, and the Knights\' official policy actually favored arbitration.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE difference between the Knights of Labor and the American Federation of Labor. (b) Briefly explain the outcome of ONE major strike in this period (1877, Haymarket, Homestead, or Pullman). (c) Briefly explain how the federal government's response to labor conflict in this period generally favored employers.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine difference — e.g. the Knights of Labor organized skilled and unskilled workers broadly with a wide reform agenda, while the AFL organized only skilled workers in craft unions focused narrowly on wages and hours. No credit for a vague statement with no specific contrast named.',
            modelResponse:
              'The Knights of Labor organized both skilled and unskilled workers across a broad reform agenda (an eight-hour day, ending child labor), while the American Federation of Labor organized only skilled workers into craft-specific unions and focused narrowly on wages, hours, and working conditions.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate outcome of a named strike — e.g. the Homestead Strike (1892) was broken with state militia support after an armed clash between strikers and Pinkerton guards, or the Pullman Strike (1894) was ended by a federal injunction upheld in In re Debs (1895). No credit for a vague or unsupported claim.',
            modelResponse:
              "The Pullman Strike (1894) ended after a federal court issued an injunction against the American Railway Union's boycott and President Cleveland sent federal troops to keep trains running; the Supreme Court later upheld the injunction in In re Debs (1895), affirming federal power to break strikes threatening interstate commerce.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate pattern of the federal government favoring employers — e.g. sending federal troops to suppress the 1877 Great Railroad Strike or the Pullman Strike, or courts issuing injunctions (upheld in In re Debs) against strikers. No credit for a vague or unsupported claim.',
            modelResponse:
              'The federal government repeatedly used troops and court injunctions against strikers rather than employers — for example, President Hayes deployed federal troops to suppress the 1877 Great Railroad Strike, and in 1894 a federal court issued an injunction against the Pullman boycott that the Supreme Court upheld in In re Debs (1895), showing a consistent pattern of siding with employers in labor disputes.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-unions-uniformly-radical',
      kind: 'misconception_check',
      question:
        'True or false: the labor organizations of this period were uniformly radical, favoring violent confrontation with employers as their main strategy.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Generalizing from a few violent incidents (Haymarket, Homestead) to the labor movement as a whole, ignoring the real strategic differences between organizations and the fact that most labor organizing in this period was non-violent.',
          correctsTo:
            'FALSE. The two largest labor organizations of the period pursued genuinely different, mostly non-violent strategies: the Knights of Labor officially favored arbitration over strikes and pursued broad social reforms, while the American Federation of Labor pursued narrow, pragmatic "bread-and-butter" bargaining over wages and hours for skilled workers. Violent incidents did occur — the Haymarket bombing (1886), the armed clash at Homestead (1892) — but these were specific, contested events, not the labor movement\'s uniform strategy; the Knights were, in fact, unfairly blamed for Haymarket despite favoring arbitration as official policy. Treating "labor movement" as synonymous with "radical violence" flattens a real internal debate over strategy that the AP exam expects you to distinguish.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Knights of Labor (broad membership, wide reform agenda, favored arbitration) and the AFL (skilled workers only, narrow "bread-and-butter" focus) pursued genuinely different labor strategies.',
        'Major strikes: the Great Railroad Strike (1877, first nationwide labor conflict), Haymarket (1886, bombing wrongly discredited the broader Knights of Labor), Homestead (1892, Carnegie Steel, Pinkertons), Pullman (1894, Debs, federal injunction upheld in In re Debs, 1895).',
        'The federal and state governments repeatedly used militia, troops, and court injunctions against strikers rather than employers across this period — establishing the labor injunction as a durable anti-strike legal tool.',
        'Early unions were NOT uniformly radical: the Knights officially favored arbitration and the AFL pursued pragmatic, incremental bargaining; violent incidents were specific events, not the whole movement\'s strategy.',
        'Skilled workers had more bargaining leverage than unskilled workers because they were harder to replace — a key reason the AFL\'s narrower model proved more durable than the Knights\' broader one.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.7',
    cedTitle: 'The Labor Movement',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
