/**
 * Grades 6-8 Social Studies — World Religions Intro.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_WORLD_RELIGIONS: LessonPlan = {
  id: 'evelyn.g68.ss.world-religions.v1',
  title: 'Grades 6-8 SS — World Religions',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.world-religions',
      description: 'Identify the major world religions, their core beliefs, and their geographic distribution.',
      standard: 'NCSS 6-8 Culture',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'About 85% of people on Earth identify with a religion — understanding the major ones builds global literacy.',
      script: 'Christianity. Islam. Hinduism. Buddhism. Judaism. Each has shaped art, law, ethics, and politics across centuries. Today we drill core beliefs and where each is most practised.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-religions',
      kind: 'concept',
      goal: 'Five major world religions + key beliefs + geography.',
      keyIdeas: [
        'WORLD RELIGIONS: huge religious traditions with millions of adherents and global presence. Five biggest by population: Christianity, Islam, Hinduism, Buddhism, Judaism.',
        'CHRISTIANITY (~2.4 billion): based on Jesus Christ, who Christians believe is the Son of God. Core text: Bible. Practised globally — strongest in Americas, Europe, Africa.',
        'ISLAM (~1.9 billion): based on the prophet Muhammad and the Quran. Believe in one God (Allah). Five Pillars (faith, prayer, charity, fasting, pilgrimage). Strongest in Middle East, North Africa, South/Southeast Asia.',
        'HINDUISM (~1.2 billion): one of the oldest religions, no single founder. Many gods/goddesses (different schools). Concepts: dharma, karma, reincarnation. Strongest in India and Nepal.',
        'BUDDHISM (~500 million): based on the Buddha (Siddhartha Gautama). Four Noble Truths and Eightfold Path. Goal: end suffering through enlightenment. Strongest in East and Southeast Asia.',
        'JUDAISM (~15 million): one of the oldest monotheistic religions. Core text: Torah. Beliefs: covenant with God, ethical living. Practised globally with major centres in Israel, US.',
        'OTHER major traditions: Sikhism, Jainism, Shinto, Bahá\'í, Indigenous religions, secular/non-religious.',
        'COMMON THREADS: most religions address questions about meaning, ethics, suffering, death, community.',
        'RESPECT: studying religions academically (their beliefs, practices, history) is different from practising them. Goal is UNDERSTANDING, not converting.',
        'NOTE: every religion has DIVERSITY within it. "Christians" includes Catholics, Orthodox, Protestants, and many denominations.',
      ],
      vocabulary: [
        { term: 'monotheism', definition: 'belief in one God.' },
        { term: 'polytheism', definition: 'belief in many gods.' },
        { term: 'religion', definition: 'a system of beliefs, practices, and community related to the sacred or divine.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-similar',
      kind: 'worked_example',
      problem: 'Christianity, Islam, and Judaism are sometimes called the "Abrahamic religions". Why?',
      steps: [
        'All three trace their origins to the figure of ABRAHAM, a religious patriarch.',
        'All three are MONOTHEISTIC (believe in one God).',
        'All three share many of the same prophets and stories (e.g. Adam, Noah, Moses).',
        'They emerged in the Middle East from related historical roots.',
        'Despite shared origins, each developed distinct beliefs, practices, and texts.',
        'Important context: the religions also have histories of conflict; understanding common roots helps build respect.',
      ],
      answer: 'All trace to Abraham; all monotheistic; share prophets and Middle Eastern origin.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Where is HINDUISM most practised, and what are TWO of its core concepts?',
      expectedAnswer: 'Most practised in India and Nepal. Core concepts: dharma (right way of living), karma (cause-and-effect of actions across lives), reincarnation (rebirth into new lives).',
      responseFormat: 'free',
      hints: [
        'It originated on a specific subcontinent.',
        'Karma and dharma are widely-known concepts.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-monolithic',
      kind: 'misconception_check',
      question: 'A student says "Christians all believe the same things." Why is this wrong?',
      commonErrors: [
        {
          answer: 'All Christians the same',
          misconception: 'Treating any religion as a single uniform set of beliefs.',
          correctsTo: 'Christianity is a HUGE family of traditions. Catholics, Orthodox, and Protestants all have differences. Within Protestantism alone: Lutherans, Methodists, Baptists, Pentecostals, etc. — each with distinct beliefs and practices. Same applies to Islam (Sunni, Shia, Sufi, etc.), Buddhism (Theravada, Mahayana, Zen, etc.), and others. Religions contain diverse communities.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five major: Christianity, Islam, Hinduism, Buddhism, Judaism.',
        'Christianity & Islam are the largest.',
        'Each region tends to have a dominant tradition.',
        'Within each religion, many denominations and views.',
        'Goal of study: understanding, not conversion.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is religious literacy IMPORTANT in a globally connected world?',
      hint: 'Religion shapes politics, conflict, art, law, holidays, ethical norms. Most international news involves religious context — peacefully or in conflict. Understanding the religion of friends, neighbours, and global partners builds bridges. Also helps interpret literature and history. Religious illiteracy leaves you with shallow understanding of much of human experience. The point isn\'t to BELIEVE all religions — it\'s to UNDERSTAND them.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
