/**
 * AP Psychology — CED Unit 3.3: Gender and Sexual Orientation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U3_GENDER_SEXUAL_ORIENTATION: LessonPlan = {
  id: 'evelyn.ap.psych.gender-sexual-orientation.v1',
  title: 'U3.3 Gender and Sexual Orientation',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.gender-sexual-orientation',
      description:
        'Distinguish biological sex from gender; explain how gender identity and gender roles develop (gender schema theory, social learning); define sexual orientation; and describe the interaction of biological and environmental influences, using research-based, non-stereotyped framing.',
      standard: 'AP-PSYCH-3.3',
    },
  ],
  prerequisites: ['appsych.developmental-themes-methods'],
  followUps: ['appsych.cognitive-development'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame gender and sexual orientation as developmental topics studied scientifically.',
      script:
        "Some of who you are is about biology, and some is about the roles and expectations you grow up with. Psychology studies gender and sexual orientation the same way it studies any developmental topic — with definitions, theories, and evidence, not assumptions. Let's get the vocabulary precise, because the AP exam rewards careful distinctions here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-gender',
      kind: 'concept',
      goal: 'Cover sex vs gender, gender identity/roles, theories of gender development, and sexual orientation.',
      keyIdeas: [
        'SEX vs GENDER — a key distinction. SEX refers to BIOLOGICAL characteristics (chromosomes, hormones, anatomy). GENDER refers to the socially and psychologically constructed characteristics, roles, and identity associated with being male, female, or other.',
        'GENDER IDENTITY: a person\'s internal sense of their own gender. GENDER ROLES: a culture\'s expectations about how people of a given gender should behave (these vary across cultures and over time, evidence of nurture\'s role).',
        'GENDER TYPING: the process of acquiring a gender role. ANDROGYNY: displaying both traditionally masculine and feminine psychological characteristics.',
        'THEORY 1 — SOCIAL LEARNING THEORY (nurture emphasis): children learn gender roles through REINFORCEMENT (rewarded for gender-consistent behavior) and OBSERVATIONAL LEARNING (imitating same-gender models). Connects to Bandura (Unit 3.9).',
        'THEORY 2 — GENDER SCHEMA THEORY (cognitive): children form mental frameworks ("schemas") for what their culture associates with each gender, then organize experience and self-concept around those schemas. Combines social learning with cognitive development.',
        'BIOLOGICAL INFLUENCES: prenatal hormones (e.g. testosterone) influence brain development and some gendered behavior. As with all developmental topics, the consensus is a NATURE-NURTURE INTERACTION, not a single cause.',
        'SEXUAL ORIENTATION: an enduring pattern of emotional/romantic/sexual attraction (e.g. to the same sex, the other sex, or both). It is distinct from gender identity (who you ARE vs who you are ATTRACTED TO).',
        'EVIDENCE ON SEXUAL ORIENTATION: research points to substantial BIOLOGICAL influences (genetics, prenatal hormonal environment, twin-study concordance, fraternal-birth-order effect). Orientation is not something chosen, and major psychological organizations classify it as a normal variation. Frame all of this in research terms, avoiding stereotypes.',
      ],
      vocabulary: [
        { term: 'gender role', definition: 'a culture\'s expectations about behavior for a given gender; varies across cultures and time.' },
        { term: 'gender schema theory', definition: 'children develop mental frameworks for gender that organize self-concept and behavior.' },
        { term: 'sexual orientation', definition: 'an enduring pattern of attraction; distinct from gender identity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-sex-vs-gender',
      kind: 'try_yourself',
      problem:
        'A textbook states: "Chromosomes and hormones are to ___ as cultural expectations about behavior are to ___." Fill in the blanks and explain the distinction.',
      expectedAnswer:
        'Chromosomes and hormones are to SEX as cultural expectations about behavior are to GENDER. SEX is the set of BIOLOGICAL characteristics (XX/XY chromosomes, hormones like estrogen/testosterone, anatomy). GENDER is the SOCIALLY and PSYCHOLOGICALLY constructed set of roles, behaviors, and identity a culture associates with being male/female/other. The evidence that gender roles differ across cultures and change over time shows that gender is heavily shaped by nurture, whereas sex is biological. Strong answers correctly assign biology to sex and social expectation to gender, and note that the two are related but not identical.',
      responseFormat: 'free',
      hints: [
        'Which term is biological — chromosomes/hormones?',
        'Which term is about social roles and expectations?',
        'Gender roles vary by culture; that signals nurture.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-theories-apply',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A 4-year-old insists trucks are "for boys" and dolls are "for girls," refuses a doll, and is praised by a parent for "acting like a big boy." (a) Explain this using social learning theory. (b) Explain it using gender schema theory. (c) Briefly note one biological consideration, and (d) state the overall nature-nurture conclusion.',
      expectedAnswer:
        '(a) SOCIAL LEARNING THEORY: the child has been REINFORCED for gender-consistent behavior (praised for "acting like a big boy") and has OBSERVED and IMITATED same-gender models who use certain toys. Reward + modeling shape the gendered preference. (b) GENDER SCHEMA THEORY: the child has built a mental SCHEMA of what the culture labels "for boys" vs "for girls" and now filters experience through it — sorting toys into gender categories and aligning his own behavior with his self-schema as a boy. (c) BIOLOGICAL CONSIDERATION: prenatal hormone exposure may contribute to some average differences in activity/toy preference, so biology is not zero. (d) OVERALL: gender development reflects a NATURE-NURTURE INTERACTION — biological predispositions shaped by reinforcement, modeling, and cognitive schemas — not a single cause. Strong answers correctly apply BOTH theories (reinforcement/modeling vs cognitive schema), add a biological factor, and land on interaction.',
      responseFormat: 'frq',
      hints: [
        'Social learning = reinforcement + modeling.',
        'Gender schema = a cognitive framework that sorts the world by gender.',
        'End on nature-nurture interaction.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sex = biological (chromosomes/hormones); gender = social/psychological roles and identity.',
        'Gender roles vary across cultures and time — evidence for nurture.',
        'Social learning theory: gender via reinforcement + modeling.',
        'Gender schema theory: gender via cognitive frameworks that organize behavior.',
        'Sexual orientation is distinct from gender identity and has strong biological correlates; frame in research terms.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3',
    cedTitle: 'Gender and Sexual Orientation',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '10', note: 'Sex/gender distinction, theories of gender development, sexual orientation.' },
    ],
  },
};
