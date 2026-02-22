import { LessonSegment } from './lessons';

export interface LearningObjective {
  id: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AdaptiveLessonConfig {
  id: string;
  topicKey: string;            // key into CURATED_VIDEOS
  grade: number;
  subject: 'Math' | 'Science';
  title: string;
  description: string;
  icon: string;
  learningObjectives: LearningObjective[];
  /** Hardcoded intro segments played before AI takes over */
  introSegments: LessonSegment[];
  /** Minimum correct out of 4 to count as mastery */
  masteryThreshold: number;
}

export const ADAPTIVE_LESSONS: AdaptiveLessonConfig[] = [
  {
    id: 'adaptive-g3-fractions',
    topicKey: 'g3-fractions',
    grade: 3,
    subject: 'Math',
    title: 'Understanding Fractions',
    description: 'AI-adaptive lesson on fractions — content adjusts to your level in real time.',
    icon: '🍕',
    masteryThreshold: 3,
    learningObjectives: [
      {
        id: 'frac-identify',
        description: 'Identify fractions as parts of a whole (numerator and denominator)',
        difficulty: 'easy',
      },
      {
        id: 'frac-number-line',
        description: 'Place and compare fractions on a number line',
        difficulty: 'medium',
      },
      {
        id: 'frac-equivalent',
        description: 'Recognize and generate equivalent fractions',
        difficulty: 'medium',
      },
      {
        id: 'frac-compare',
        description: 'Compare fractions with same numerator or same denominator',
        difficulty: 'hard',
      },
    ],
    introSegments: [
      {
        type: 'narration',
        title: 'Welcome to Fractions!',
        text: "Hi there, explorer! Today we're going to learn about fractions — those cool numbers that help us describe parts of a whole. Have you ever shared a pizza with friends? Then you've already used fractions! Let's find out what you already know, and then I'll teach you exactly what you need.",
      },
      {
        type: 'video',
        title: 'Introduction to Fractions',
        youtubeId: 'n0FZhQ_GkKw',
        caption: 'Math Antics introduces fractions — what they are and how they work.',
      },
    ],
  },
  {
    id: 'adaptive-g3-addition',
    topicKey: 'g3-addition',
    grade: 3,
    subject: 'Math',
    title: 'Addition Strategies',
    description: 'AI-adaptive lesson on addition — practice adapts to where you need the most help.',
    icon: '➕',
    masteryThreshold: 3,
    learningObjectives: [
      {
        id: 'add-basic',
        description: 'Add single-digit numbers fluently',
        difficulty: 'easy',
      },
      {
        id: 'add-regroup',
        description: 'Add multi-digit numbers with regrouping (carrying)',
        difficulty: 'medium',
      },
      {
        id: 'add-make10',
        description: 'Use the "Make a 10" mental math strategy',
        difficulty: 'medium',
      },
      {
        id: 'add-word-problems',
        description: 'Solve addition word problems by identifying clue words',
        difficulty: 'hard',
      },
    ],
    introSegments: [
      {
        type: 'narration',
        title: 'Welcome to Addition Strategies!',
        text: "Hey there, explorer! Today we're going to become addition experts. We'll learn some really clever tricks for adding numbers — strategies that make math feel like a superpower! First, let me see what you already know, and then I'll customize the lesson just for you.",
      },
      {
        type: 'video',
        title: 'Addition Basics',
        youtubeId: 'AuX7nPBqDts',
        caption: 'Khan Academy reviews the fundamentals of addition with clear visual examples.',
      },
    ],
  },
];

export function getAdaptiveLessonsForGrade(grade: number): AdaptiveLessonConfig[] {
  return ADAPTIVE_LESSONS.filter((l) => l.grade === grade);
}

export function getAdaptiveLessonById(id: string): AdaptiveLessonConfig | undefined {
  return ADAPTIVE_LESSONS.find((l) => l.id === id);
}
