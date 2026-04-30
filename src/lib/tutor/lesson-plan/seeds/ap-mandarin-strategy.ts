/**
 * AP Chinese Language and Culture — exam strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MANDARIN_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.mandarin.strategy.v1',
  title: 'AP Chinese Language exam strategy',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'ap-chinese-lang',
  locale: 'en',
  los: [
    {
      id: 'apmandarin.strategy',
      description: 'Apply effective strategy to AP Chinese Language exam sections, including character recognition, listening comprehension, and culturally appropriate output.',
      standard: 'AP-CHIN-LANG',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Chinese is computer-based and tests COMMUNICATION + characters.',
      script: 'AP Chinese is the only AP language exam given entirely on a computer. You\'ll TYPE responses (using pinyin → character selection or Bopomofo). Like other language exams, it tests interpretive listening + reading and presentational + interpersonal writing/speaking — but you also need character RECOGNITION as well as character PRODUCTION.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Format + section strategies + character + cultural knowledge.',
      keyIdeas: [
        'FORMAT: ~2.5 hours, computer-based. Multiple choice (listening + reading) + free response (writing + speaking).',
        'INTERPRETIVE LISTENING: announcements, conversations, podcasts. Practice with a wide range of speakers and topics. Speed of native speech is the biggest challenge.',
        'INTERPRETIVE READING: signs, emails, news, stories. Need solid character recognition (~1500-2000 high-frequency characters). Skim for main idea, then detail.',
        'INTERPERSONAL WRITING: respond to an EMAIL (~15 min). Type using pinyin → IME. Polite register, address all questions, fit cultural context (proper greeting/closing).',
        'PRESENTATIONAL WRITING: a story-narration task (~15 min). Look at a 4-panel image, type a coherent story.',
        'INTERPERSONAL SPEAKING: simulated conversation, 6 prompts, 20 sec each. Speak naturally, react to what was said.',
        'PRESENTATIONAL SPEAKING: cultural presentation. 4 min total prep + recording. Compare a Chinese cultural feature to your own community.',
        'CULTURAL KNOWLEDGE: themes include family, education, traditions (Lunar New Year, Mid-Autumn Festival), modernization, environment, identity.',
        'CHARACTERS: practice both simplified AND traditional (the exam shows simplified by default but allows traditional input). Reading both helps interpretive sections.',
        'SCORING: 1-5.',
      ],
      vocabulary: [
        { term: 'pinyin', definition: 'standard romanization of Mandarin used for typing and pronunciation.' },
        { term: 'IME', definition: 'Input Method Editor — software for typing characters via romanization.' },
        { term: 'simplified vs traditional', definition: 'two character systems; simplified is mainland China standard, traditional in Taiwan and HK.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typing',
      kind: 'worked_example',
      problem: 'Typing strategy: how to use pinyin → IME efficiently under time pressure.',
      steps: [
        'Type pinyin without tone marks; the IME suggests characters.',
        'For multi-character words, type the whole word — IME suggestions improve.',
        'Watch the suggestion list — wrong character is a common error (e.g. 是 vs 事). Verify before pressing Enter.',
        'Practice with the exam\'s IME (College Board provides sample). Each IME has slightly different shortcuts.',
        'Speed comes from PRACTICE — type Chinese essays regularly months before the exam.',
        'If a character won\'t come up, try typing the full word or a different pinyin spelling.',
        'Don\'t obsess over a single character — move on, return if time permits.',
      ],
      answer: 'Type whole words (not single characters), verify suggestions, practice the actual IME pre-exam.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is character VERIFICATION (not just typing speed) crucial for AP Chinese writing scores?',
      expectedAnswer: 'Many Chinese characters are homophones — pinyin gives multiple options. Selecting the wrong one (是 vs 事 vs 试) creates errors that hurt comprehensibility and scores. A fast typist who picks wrong characters scores worse than a slower one who verifies. Always check the suggestion before confirming.',
      responseFormat: 'free',
      hints: [
        'How many characters share the same pinyin?',
        'What happens if you commit the wrong one?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grammar-only',
      kind: 'misconception_check',
      question: 'Should AP Chinese prep focus mostly on grammar drills?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Grammar-only approach.',
          correctsTo: 'No — focus on COMMUNICATION + CHARACTER MASTERY + CULTURAL knowledge. Chinese grammar is relatively simple (no conjugation, no plurals); the harder skills are character recognition, listening comprehension at native speed, and culturally appropriate register. Drill characters via flashcards, listen to native podcasts, and practice typing essays. Communication > perfect grammar.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Computer-based; type responses via pinyin → IME.',
        '4 skills + character recognition + cultural knowledge.',
        'Verify character selections — homophones are everywhere.',
        'Practice with the actual IME well before exam day.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does culture-specific vocabulary (Lunar New Year, hutong, gaokao, hongbao) appear in the exam, and how do you prepare?',
      hint: 'Both interpretive sections (you may see references) and presentational sections (you may need to USE them in cultural comparison). Read about Chinese holidays, food, education system, family structure, contemporary social issues. Maintain a personal vocabulary list of cultural terms with pinyin and characters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
