/**
 * AP World History: Modern — CED Unit 5.1: The Enlightenment.
 *
 * Unit-5 fan-out content plan, first in the within-unit chain
 * (enlightenment → atlantic-revolutions → nationalism-unification →
 * industrial-revolution → industrial-society). concept = the historical
 * argument (how did Enlightenment natural-rights and social-contract theory
 * provide the intellectual toolkit later applied — unevenly — to revolution,
 * abolition, suffrage, and feminism?); worked_example = annotated document
 * analysis; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor text: Mary Wollstonecraft, "A Vindication of the Rights of Woman"
 * (1792) — evelyn.passage.apworld-wollstonecraft.v1. Quotes ONLY the seeded
 * excerpt (the individual-education/reason argument, one paragraph elided,
 * marked). Measured, exam-neutral tone throughout, per Global Constraints.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_ENLIGHTENMENT: LessonPlan = {
  id: 'evelyn.ap.apworld.enlightenment.v1',
  title: 'U5.1 The Enlightenment',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.enlightenment',
      description:
        'Explain the core natural-rights and social-contract ideas of the Enlightenment (Locke, Rousseau) and how they were extended, unevenly, to movements including abolition, suffrage, and early feminism (Wollstonecraft).',
      standard: 'AP-APWORLD-5.1',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.atlantic-revolutions'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Enlightenment as a toolkit of arguments that different groups later picked up selectively, not a single settled political program.',
      script:
        "It's tempting to picture \"the Enlightenment\" as one coherent package that led directly and inevitably to modern democracy. Look at who actually picked up its arguments and the picture gets messier. The same natural-rights language that justified American independence was used, within a few decades, to demand the abolition of slavery, the extension of the vote, and — in Mary Wollstonecraft's case, writing in 1792 — the education and rational equality of women. But plenty of Enlightenment thinkers themselves would have been startled, or alarmed, by some of those later uses. This unit is about the core ideas — natural rights, the social contract — and about how unevenly, and by whom, they got applied over the following century.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-enlightenment',
      kind: 'concept',
      goal: 'Explain Locke\'s and Rousseau\'s social-contract theories, natural rights, and the uneven later application of these ideas to abolition, suffrage, feminism, and deism/secularism.',
      keyIdeas: [
        "LOCKE'S NATURAL RIGHTS AND CONSENT: John Locke argued that individuals possess natural rights — to life, liberty, and property — that exist prior to and independent of government, and that legitimate government rests on the consent of the governed. If a government violated those rights, Locke argued, the people retained a right to alter or replace it.",
        "ROUSSEAU'S SOCIAL CONTRACT AND THE GENERAL WILL: Jean-Jacques Rousseau argued that legitimate political authority comes from a social contract in which individuals collectively form a political community and submit to the \"general will\" — the collective good of the community as a whole, which could in principle override an individual's private preference.",
        'FROM NATURAL RIGHTS TO WOLLSTONECRAFT: Mary Wollstonecraft\'s "A Vindication of the Rights of Woman" (1792) applied the Enlightenment\'s reason-based case for natural rights to women\'s education, arguing that virtue and reason are not sex-specific faculties — extending Rousseau\'s own argument about the individual exercise of reason to women, against Rousseau\'s own restriction of that argument to men. Her argument is a direct bridge from social-contract theory to 19th-century feminism, including the Seneca Falls Convention (1848), which echoed natural-rights language in its own Declaration of Sentiments.',
        'APPLICATIONS TO ABOLITION AND SUFFRAGE: abolitionist and suffrage movements across the eighteenth and nineteenth centuries drew directly on Enlightenment natural-rights language, arguing that rights claimed as universal (life, liberty, equality before the law) could not be coherently limited by race or sex — an argument Enlightenment writers themselves did not uniformly accept or apply.',
        'DEISM AND SECULARISM: many Enlightenment thinkers embraced deism, the view that a rational creator set the universe in motion according to natural laws but does not intervene supernaturally afterward, and argued more broadly for religious toleration and a reduced role for organized religious authority in political life — a significant departure from the divine-right justifications of earlier monarchies.',
      ],
      vocabulary: [
        {
          term: 'natural rights',
          definition:
            'rights (Locke: life, liberty, property) held to exist prior to and independent of government, which legitimate government exists to protect.',
        },
        {
          term: 'social contract',
          definition:
            "the theory (Locke, Rousseau) that legitimate political authority derives from an agreement among individuals to form a political community, rather than from divine right or inherited status.",
        },
        {
          term: 'deism',
          definition:
            'the Enlightenment-era view that a rational creator established the universe according to natural laws but does not intervene in it afterward, in contrast to organized revealed religion.',
        },
      ],
      passageId: 'evelyn.passage.apworld-wollstonecraft.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-wollstonecraft',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Mary Wollstonecraft\'s "A Vindication of the Rights of Woman" (1792): "By individual education, I mean--for the sense of the word is not precisely defined--such an attention to a child as will slowly sharpen the senses, form the temper, regulate the passions, as they begin to ferment, and set the understanding to work before the body arrives at maturity; so that the man may only have to proceed, not to begin, the important task of learning to think and reason. ... Consequently, the most perfect education, in my opinion, is such an exercise of the understanding as is best calculated to strengthen the body and form the heart; or, in other words, to enable the individual to attain such habits of virtue as will render it independent. In fact, it is a farce to call any being virtuous whose virtues do not result from the exercise of its own reason. This was Rousseau\'s opinion respecting men: I extend it to women, and confidently assert that they have been drawn out of their sphere by false refinement, and not by an endeavour to acquire masculine qualities." How does Wollstonecraft use Enlightenment reasoning here, and what claim is she making against Rousseau specifically?',
      steps: [
        'SOURCE IT FIRST. Mary Wollstonecraft published "A Vindication of the Rights of Woman" in 1792, in direct conversation with (and challenge to) other Enlightenment writers, including Rousseau, whose views on education and the sexes she engages directly by name.',
        'IDENTIFY THE CORE CLAIM ABOUT VIRTUE AND REASON. Wollstonecraft argues that "it is a farce to call any being virtuous whose virtues do not result from the exercise of its own reason" — virtue, for her, is not a fixed trait but the product of an individual actually exercising their own rational faculties, following her earlier point that education should "set the understanding to work" so a person learns "to think and reason."',
        "IDENTIFY THE MOVE AGAINST ROUSSEAU. She states explicitly: \"This was Rousseau's opinion respecting men: I extend it to women.\" Rousseau had argued that reasoned, self-directed virtue applied to men; Wollstonecraft takes his own premise (virtue requires the individual's own exercise of reason) and applies it to women too, rejecting his restriction of that premise to one sex.",
        "CONNECT TO THE CONCEPT'S BROADER CLAIM. This is a clear example of Enlightenment natural-rights/reason-based argument being extended beyond where its original authors applied it — the same pattern later visible in abolitionist and suffrage arguments that took \"universal\" rights language more literally than many of its original authors intended.",
        'STATE THE LINK TO THE COURSE THESIS. Wollstonecraft\'s 1792 argument is a direct intellectual bridge forward to 19th-century feminism, including the Seneca Falls Convention (1848), which drew on the same natural-rights, reason-based logic to argue for women\'s political and legal equality.',
      ],
      answer:
        "Wollstonecraft uses the Enlightenment's own reason-based case for natural rights and virtue — the idea that education should \"set the understanding to work\" so a person learns \"to think and reason,\" and that true virtue requires \"the exercise of its own reason\" — and applies it to a group (women) that its most prominent proponent, Rousseau, had excluded. She names Rousseau directly (\"This was Rousseau's opinion respecting men: I extend it to women\"), taking his own premise about reason-based virtue and refusing his restriction of that premise to men, arguing instead that women's exclusion from full rational development reflects \"false refinement\" imposed on them rather than any natural incapacity. This is a clear instance of Enlightenment natural-rights reasoning being extended by a later writer well beyond where its original author applied it — the same pattern of selective, uneven application later visible in abolitionist and suffrage arguments, and a direct intellectual bridge to 19th-century feminism, including the Seneca Falls Convention (1848).",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE natural right proposed by Locke or Rousseau. (b) Explain ONE way Mary Wollstonecraft applied Enlightenment reasoning to the question of women's education or rights. (c) Explain ONE other movement (abolition or suffrage) that drew on Enlightenment natural-rights language.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies ONE genuine natural right or social-contract concept associated with Locke (life, liberty, property; government by consent) or Rousseau (the general will; popular sovereignty). No credit for a vague or unattributed claim.",
            modelResponse:
              'Locke argued that individuals possess natural rights to life, liberty, and property that exist independent of government, and that government exists to protect those rights.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way Wollstonecraft applied Enlightenment reasoning to women — e.g. extending Rousseau's own reason-based standard of virtue to women, or arguing women's exclusion from rational development reflected imposed \"false refinement\" rather than natural incapacity. No credit for a vague or unconnected claim.",
            modelResponse:
              "In \"A Vindication of the Rights of Woman\" (1792), Wollstonecraft took Rousseau's own claim that virtue requires the individual exercise of reason — which he applied only to men — and extended it to women, arguing that women's apparent limitations reflected imposed \"false refinement\" rather than any natural incapacity for reason.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way an abolition or suffrage movement drew on Enlightenment natural-rights language — e.g. arguing rights claimed as universal could not be coherently limited by race or sex. No credit for a vague or unsupported claim.',
            modelResponse:
              'Abolitionist movements argued that Enlightenment natural-rights language, which claimed rights like liberty applied universally to all people, could not be coherently limited to exclude enslaved people on the basis of race.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-enlightenment-democracy',
      kind: 'misconception_check',
      question:
        'True or false: Enlightenment thinkers broadly agreed that direct, universal democracy was the ideal form of government.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming Enlightenment natural-rights and social-contract theory necessarily implied support for direct, universal democracy, and projecting later democratic outcomes backward onto the thinkers who supplied only some of the intellectual raw material for them.',
          correctsTo:
            "FALSE. Enlightenment thinkers disagreed sharply on the ideal form of government, and many feared direct or universal democracy specifically — worrying about the \"tyranny of the majority,\" mob rule, or the political judgment of the propertyless. Locke's own framework was compatible with constitutional monarchy limited by consent, not universal suffrage; Rousseau's \"general will\" is not identical to representative, universal-suffrage democracy as later practiced. Many Enlightenment-influenced constitutions (the U.S. included) initially restricted political participation by property, race, and sex — the ideas provided a toolkit that was extended toward broader democracy only gradually, and unevenly, by later movements.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Locke: natural rights (life, liberty, property) exist prior to government; legitimate government rests on the consent of the governed.',
        "Rousseau: legitimate authority comes from a social contract submitting individuals to the \"general will\" of the political community.",
        'Wollstonecraft (1792) extended Rousseau\'s own reason-based standard of virtue to women, a direct intellectual bridge to 19th-century feminism (Seneca Falls, 1848).',
        'Abolition and suffrage movements later drew on the same natural-rights language, applying it more literally than many of its original Enlightenment authors did.',
        'Deism and religious toleration reduced the role of divine-right and organized religious authority in Enlightenment political thought.',
        'Many Enlightenment thinkers feared direct/universal democracy — the ideas were a toolkit extended toward broader democracy only gradually and unevenly by later movements.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.1',
    cedTitle: 'The Enlightenment',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-wollstonecraft.v1',
        chapter: '1792',
        note: 'Mary Wollstonecraft, "A Vindication of the Rights of Woman" — anchor document for the Enlightenment reason/natural-rights argument extended to women.',
      },
    ],
  },
};
