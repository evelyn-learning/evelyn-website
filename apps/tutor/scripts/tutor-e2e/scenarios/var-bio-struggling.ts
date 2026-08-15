import type { Scenario } from '../types';
/** Sciences/bio + STRUGGLING student. Tutor must re-explain on confusion. */
const scenario: Scenario = {
  name: 'var-bio-struggling',
  description: 'AP Bio Hardy-Weinberg — a struggling, confused student.',
  start: { subject: 'science', level: 'AP', topic: 'ap-bio', lessonPlanId: 'evelyn.ap.bio.hardy-weinberg.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'hardy weinberg' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'struggling',
    firstSay: "I always get really confused by Hardy-Weinberg — can we go through it slowly?",
    goal: 'Given homozygous-recessive frequency q²=0.16, derive q=0.4, p=0.6, heterozygous 2pq=0.48, homozygous-dominant p²=0.36. Known answers: q=0.4, p=0.6, 2pq=0.48, p²=0.36.',
    turns: 8,
  },
};
export default scenario;
