/**
 * AP US History — CED Unit 4.10-4.11: Religion and Reform in Antebellum
 * America.
 *
 * Period-4 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale). Covers the Second Great Awakening (Charles Finney and the
 * "burned-over district"), temperance, abolition (Garrison and
 * Douglass), the Seneca Falls Convention, utopian communities, and
 * Horace Mann's common-school movement.
 *
 * Anchor text: Declaration of Sentiments, Seneca Falls Convention (1848)
 * — evelyn.passage.apush-seneca-falls.v1. Teaching point is the
 * document's deliberate repurposing of the Declaration of Independence's
 * frame for women's rights (quoted only as the short excerpt already
 * seeded).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_REFORM_AWAKENING: LessonPlan = {
  id: 'evelyn.ap.apush.reform-awakening.v1',
  title: 'U4.10 Religion and Reform in Antebellum America',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.reform-awakening',
      description:
        'Explain the causes and effects of the Second Great Awakening, and the temperance, abolition, women\'s rights, utopian, and common-school reform movements it helped inspire, including the Seneca Falls Convention and the limits of these movements\' popularity and reach.',
      standard: 'AP-APUSH-4.10',
    },
  ],
  prerequisites: ['apush.jacksonian-democracy'],
  followUps: ['apush.slavery-south'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the reform era as a religious revival that fanned out into a wide range of social-reform movements, several of which were controversial even among reformers.',
      script:
        "Starting in the 1820s and 30s, traveling preachers drew huge crowds to outdoor revival meetings across upstate New York — a region so thoroughly swept by religious fervor that people called it the \"burned-over district,\" as if revival had scorched through it again and again. But the Second Great Awakening didn't stay inside church walls. Converts who believed they could perfect their own souls started asking whether they could perfect SOCIETY too — and launched movements against alcohol, against slavery, for women's rights, for public education, even for entirely new experimental communities. Not everyone welcomed all of this. Some reformers picked one cause and ignored the others; some causes (abolition especially) provoked violent backlash even in the North. Today we're tracing how a religious revival turned into a decades-long argument about what a more perfect society should look like — and who got to decide.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-reform-awakening',
      kind: 'concept',
      goal: "Explain the Second Great Awakening's religious roots and the temperance, abolition, women's rights, utopian, and common-school movements it inspired.",
      keyIdeas: [
        'THE SECOND GREAT AWAKENING: a wave of Protestant religious revivalism sweeping the country from the 1790s through the 1840s, especially associated with preachers like CHARLES FINNEY, who preached that individuals could actively choose salvation and work toward moral perfection through their own efforts — a shift from earlier Calvinist ideas of predestination. Upstate New York, repeatedly swept by revivals, became known as the "BURNED-OVER DISTRICT."',
        "FROM PERSONAL TO SOCIAL REFORM: the Awakening's emphasis on individual moral improvement fed directly into a belief that SOCIETY, too, could be perfected through reform. This conviction inspired a wide range of movements — not a single unified cause, but a decade-spanning family of efforts targeting different social ills.",
        'TEMPERANCE: reformers organized against alcohol consumption, which they linked to poverty, domestic violence, and moral decay; the American Temperance Society (founded 1826) became one of the era\'s largest reform organizations, though it stopped well short of the total, nationwide prohibition that would come much later (1920).',
        'ABOLITION: WILLIAM LLOYD GARRISON launched The Liberator (1831), demanding IMMEDIATE, uncompensated emancipation rather than the gradual approach or colonization (relocating freed Black Americans to Africa) that earlier anti-slavery reformers had favored — a position that made him controversial even among some abolitionists. FREDERICK DOUGLASS, a formerly enslaved man, became one of the movement\'s most powerful voices, combining firsthand testimony with reasoned argument in his writing and speeches. Abolition was the era\'s most polarizing reform: it provoked violent mobs even in Northern cities and deepened, rather than healed, sectional division.',
        "THE SENECA FALLS CONVENTION (1848): organized by ELIZABETH CADY STANTON and Lucretia Mott, this first major women's rights convention produced the DECLARATION OF SENTIMENTS, deliberately modeled on the Declaration of Independence's structure and language, asserting that \"all men and women are created equal\" and cataloguing specific grievances — including women's exclusion from voting and lack of legal standing. Many participants, including Stanton and Mott, had been active first in the abolition movement, which sharpened their sense of women's own political exclusion.",
        "UTOPIAN COMMUNITIES AND EDUCATION REFORM: reformers also experimented with entirely new social models — utopian communities like Brook Farm and Oneida attempted alternative arrangements of property, labor, or family life on a small scale. HORACE MANN led the common-school movement in Massachusetts, arguing that free, publicly funded education was essential to a functioning democracy and to social mobility, laying groundwork for public education systems that spread to other states.",
      ],
      vocabulary: [
        {
          term: 'Second Great Awakening',
          definition:
            "wave of Protestant religious revivalism (1790s-1840s) emphasizing individual choice in salvation and moral self-improvement, associated with preachers like Charles Finney; fed directly into the era's social-reform movements.",
        },
        {
          term: 'burned-over district',
          definition:
            "nickname for upstate New York, repeatedly swept by waves of religious revival during the Second Great Awakening.",
        },
        {
          term: 'immediatism',
          definition:
            "William Lloyd Garrison's position, launched in The Liberator (1831), demanding immediate and uncompensated emancipation of enslaved people, rejecting gradual emancipation or colonization.",
        },
        {
          term: 'Declaration of Sentiments',
          definition:
            'document produced at the 1848 Seneca Falls Convention, deliberately modeled on the Declaration of Independence, asserting the equality of men and women and cataloguing specific grievances against women\'s legal and political exclusion.',
        },
        {
          term: 'common-school movement',
          definition:
            "reform effort led by Horace Mann arguing for free, publicly funded education as essential to democracy and social mobility, laying groundwork for public education systems.",
        },
      ],
      passageId: 'evelyn.passage.apush-seneca-falls.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-declaration-of-sentiments',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from the Declaration of Sentiments (Seneca Falls, 1848): \"We hold these truths to be self-evident; that all men and women are created equal; that they are endowed by their Creator with certain inalienable rights; that among these are life, liberty, and the pursuit of happiness; that to secure these rights governments are instituted, deriving their just powers from the consent of the governed.\" ... \"He has never permitted her to exercise her inalienable right to the elective franchise. He has compelled her to submit to laws, in the formation of which she had no voice.\" What strategy is the document using, and why was that strategy effective?",
      steps: [
        'SOURCE IT FIRST. Drafted primarily by Elizabeth Cady Stanton, presented at the Seneca Falls Convention (July 1848), the first major women\'s rights convention in the United States.',
        'IDENTIFY THE STRATEGY IN THE FIRST LINE. The Declaration deliberately echoes the Declaration of Independence\'s exact structure and language ("We hold these truths to be self-evident... life, liberty, and the pursuit of happiness... consent of the governed") but inserts one crucial change: "all men and women are created equal" where the original said only "all men."',
        'EXPLAIN WHY THIS MATTERS. By using the Founding generation\'s own words and logic — the same document Americans already revered as a statement of universal, self-evident rights — the authors argue women\'s exclusion from full citizenship is a betrayal of the nation\'s own founding principles, not a request for something new or foreign.',
        'CONNECT TO THE GRIEVANCE LIST. The second excerpt (voting rights, no voice in lawmaking) mirrors the original Declaration\'s list of grievances against George III — reusing the SAME rhetorical form (a list of specific wrongs following a statement of universal rights) to catalogue women\'s specific legal and political exclusions.',
        'CONNECT TO THE BROADER REFORM MOVEMENT. Many Seneca Falls organizers, including Stanton and Mott, came directly out of the abolition movement — applying the same natural-rights, "created equal" reasoning already used against slavery to argue for women\'s political equality.',
        'STATE THE LINK TO THE COURSE THESIS. The Declaration of Sentiments shows how antebellum reformers reused the Revolution\'s own founding language as a rhetorical weapon: if "all men are created equal" justified independence, the same logic — extended to "all men and women" — could justify a wholly new claim to full citizenship for women.',
      ],
      answer:
        "The Declaration of Sentiments deliberately borrows the Declaration of Independence's exact structure and language, changing only \"all men\" to \"all men and women are created equal\" and follows with a list of specific grievances (denial of the vote, no voice in lawmaking) that mirrors the original document's list of grievances against George III. This strategy was effective because it forced readers to confront women's exclusion using the Founders' own revered words and logic — arguing that denying women full citizenship was a betrayal of principles Americans already claimed to hold as self-evident, not a foreign or radical new idea. Many organizers, including Stanton, had come out of the abolition movement, where the same natural-rights reasoning had already been used against slavery, showing how reformers across different causes reused a shared rhetorical toolkit.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. Using the excerpt from the Declaration of Sentiments below, and your knowledge of antebellum reform: \"We hold these truths to be self-evident; that all men and women are created equal... that to secure these rights governments are instituted, deriving their just powers from the consent of the governed.\" (a) Briefly describe the strategy the excerpt uses to advance its claim. (b) Briefly explain ONE historical development that led to the Seneca Falls Convention. (c) Briefly explain ONE way another antebellum reform movement shared the excerpt's approach.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-seneca-falls.v1',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly describes the strategy visible in the excerpt — deliberately echoing the Declaration of Independence\'s language and structure ("created equal," "consent of the governed") while inserting women, to argue women\'s exclusion betrays the nation\'s own founding principles. No credit for a response that ignores the excerpt\'s specific borrowed language.',
            modelResponse:
              'The excerpt deliberately mirrors the Declaration of Independence\'s exact language and structure, changing "all men" to "all men and women are created equal" to argue that denying women full citizenship contradicts principles Americans already claimed to hold as self-evident.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate historical development leading to Seneca Falls — e.g. the Second Great Awakening\'s emphasis on moral reform and self-improvement, or women\'s prior activism in the abolition movement (many organizers, including Stanton, came directly out of it). No credit for a vague or unsupported development.',
            modelResponse:
              "Many Seneca Falls organizers, including Elizabeth Cady Stanton, had been active first in the abolition movement, where their exclusion from full participation (such as being barred from speaking at some anti-slavery conventions) sharpened their sense of women's own political exclusion and led directly to organizing a convention for women's rights.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way another antebellum reform movement shared the excerpt\'s approach — e.g. Garrison\'s abolitionism also invoking natural-rights/"created equal" language against slavery, or temperance/common-school reformers also framing their cause as fulfilling the nation\'s founding moral promise. No credit for a disconnected or vague comparison.',
            modelResponse:
              "William Lloyd Garrison's abolitionist movement used a similar natural-rights strategy, arguing that slavery contradicted the same principle that all people are entitled to inalienable rights — applying the founding generation's own language to a different excluded group, just as the Declaration of Sentiments did for women.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-reform-universally-popular',
      kind: 'misconception_check',
      question:
        'True or false: antebellum reform movements like temperance, abolition, and women\'s rights were universally popular and widely embraced across American society.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that a reform movement studied favorably in retrospect must have been broadly popular at the time it occurred.',
          correctsTo:
            "FALSE. These movements were often controversial, minority positions, even among people otherwise sympathetic to reform. Abolition was the most polarizing: Garrison's demand for immediate, uncompensated emancipation provoked violent mobs even in Northern cities and divided abolitionists themselves (some favored gradual emancipation or colonization instead). The Seneca Falls Convention's Declaration of Sentiments was mocked in the press and considered radical by many, including some reformers who supported abolition but not women's suffrage specifically. Temperance had wide support but still faced organized opposition. Studying these movements as significant does not mean they were widely embraced at the time — AP US History rewards recognizing that reform movements provoked real, organized resistance.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Second Great Awakening (Finney, the "burned-over district") preached individual moral perfectibility, which fed directly into belief that society itself could be reformed.',
        "Garrison's Liberator (1831) demanded immediate, uncompensated emancipation — more radical than earlier gradual-emancipation or colonization approaches; Frederick Douglass became a leading abolitionist voice.",
        'The Seneca Falls Convention (1848) produced the Declaration of Sentiments, deliberately modeled on the Declaration of Independence to argue women\'s political exclusion betrayed founding principles.',
        'Utopian communities (Brook Farm, Oneida) and Horace Mann\'s common-school movement extended reform beyond temperance and abolition into experiments in living and public education.',
        'Reform movements were NOT universally popular — abolition provoked violent backlash even in the North, and women\'s rights was considered radical by many, including some fellow reformers.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.10-4.11',
    cedTitle: 'Religion and Reform in Antebellum America',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-seneca-falls.v1',
        chapter: '1848',
        note: 'Declaration of Sentiments — the Declaration of Independence\'s frame repurposed for women\'s rights.',
      },
    ],
  },
};
