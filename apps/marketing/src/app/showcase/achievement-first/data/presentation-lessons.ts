export type PresentationSegmentType =
  | 'opener-hook'
  | 'direct-instruction'
  | 'think-pair-share'
  | 'guided-practice'
  | 'check-for-understanding'
  | 'independent-practice'
  | 'exit-ticket';

export interface OpenerHookSegment {
  type: 'opener-hook';
  title: string;
  doNowPrompt: string;
  timerSeconds: number;
}

export interface DirectInstructionSegment {
  type: 'direct-instruction';
  title: string;
  youtubeId: string;
  teacherNotes: string;
  takeaways: string[];
}

export interface ThinkPairShareSegment {
  type: 'think-pair-share';
  title: string;
  prompt: string;
  timerSeconds: number;
  teacherTips: string;
}

export interface GuidedPracticeSegment {
  type: 'guided-practice';
  title: string;
  problem: string;
  steps: { label: string; content: string }[];
}

export interface CheckForUnderstandingSegment {
  type: 'check-for-understanding';
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  simulatedResults: { option: string; count: number; students: string[] }[];
}

export interface IndependentPracticeSegment {
  type: 'independent-practice';
  title: string;
  problems: string[];
  timerSeconds: number;
}

export interface ExitTicketSegment {
  type: 'exit-ticket';
  title: string;
  questions: { question: string; correctAnswer: string }[];
  simulatedClassAvg: number;
  flaggedStudents: string[];
}

export type PresentationSegment =
  | OpenerHookSegment
  | DirectInstructionSegment
  | ThinkPairShareSegment
  | GuidedPracticeSegment
  | CheckForUnderstandingSegment
  | IndependentPracticeSegment
  | ExitTicketSegment;

export interface PresentationLesson {
  id: string;
  grade: 3 | 6;
  title: string;
  standard: string;
  segments: PresentationSegment[];
}

export const PRESENTATION_LESSONS: PresentationLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // Grade 3: Adding Fractions with Like Denominators
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pres-g3-fractions',
    grade: 3,
    title: 'Lesson 3.4: Adding Fractions with Like Denominators',
    standard: '3.NF.A.3',
    segments: [
      // 1. Opener / Hook — Do Now
      {
        type: 'opener-hook',
        title: 'Do Now: Fractions in Everyday Life',
        doNowPrompt: 'Write 3 fractions you see in everyday life. Then solve: What is 1/4 + 2/4?',
        timerSeconds: 120,
      },

      // 2. Direct Instruction — Video
      {
        type: 'direct-instruction',
        title: 'Adding Fractions with Like Denominators',
        youtubeId: '5juto2ze8Lg',
        teacherNotes: 'Pause at 1:30 to check for understanding on what "like denominators" means. Emphasize that the denominator tells us the SIZE of each piece — it stays the same when we add.',
        takeaways: [
          'Like denominators means the bottom numbers are the same',
          'When adding fractions with like denominators, add the numerators and keep the denominator',
          'The denominator tells us the size of each piece — it does not change',
        ],
      },

      // 3. Think-Pair-Share
      {
        type: 'think-pair-share',
        title: 'Think-Pair-Share: Pizza Problem',
        prompt: 'If you eat 2/8 of a pizza and your friend eats 3/8, what fraction of the pizza did you eat together? Draw a model to prove it.',
        timerSeconds: 90,
        teacherTips: 'Circulate and look for students who draw fraction bars or circles divided into eighths. Prompt struggling students: "How many pieces is the pizza cut into? How many did you eat total?" Call on 2-3 pairs to share.',
      },

      // 4. Guided Practice
      {
        type: 'guided-practice',
        title: 'Guided Practice: Adding 3/6 + 2/6',
        problem: 'What is 3/6 + 2/6?',
        steps: [
          {
            label: 'Step 1: Check the denominators',
            content: 'Both fractions have a denominator of 6. They are like fractions! The pieces are the same size (sixths).',
          },
          {
            label: 'Step 2: Add the numerators',
            content: 'Add the top numbers: 3 + 2 = 5. This tells us the total number of pieces.',
          },
          {
            label: 'Step 3: Keep the denominator',
            content: 'The denominator stays 6. Our answer is 5/6.',
          },
          {
            label: 'Step 4: Check — can we simplify?',
            content: '5 and 6 share no common factors other than 1, so 5/6 is already in simplest form. We ate 5 out of 6 equal pieces!',
          },
        ],
      },

      // 5. Check for Understanding
      {
        type: 'check-for-understanding',
        title: 'Quick Check: What is 2/5 + 1/5?',
        question: 'What is 2/5 + 1/5?',
        options: ['2/5', '3/5', '3/10', '2/10'],
        correctIndex: 1,
        simulatedResults: [
          { option: '2/5', count: 1, students: ['Xavier Harris'] },
          { option: '3/5', count: 18, students: ['Jaylen Thompson', 'Amari Davis', 'Sofia Rodriguez', 'Destiny Johnson', 'Isabella Martinez', 'DeShawn Brown', 'Kiara Mitchell', 'Marisol Gonzalez', 'Elijah Carter', 'Aaliyah Moore', 'Marcus Williams', 'Jaylen Thompson', 'Amari Davis', 'Sofia Rodriguez', 'Isabella Martinez', 'DeShawn Brown', 'Kiara Mitchell', 'Elijah Carter'] },
          { option: '3/10', count: 4, students: ['Marcus Williams', 'Destiny Johnson', 'Aaliyah Moore', 'Marisol Gonzalez'] },
          { option: '2/10', count: 1, students: ['Xavier Harris'] },
        ],
      },

      // 6. Independent Practice
      {
        type: 'independent-practice',
        title: 'Independent Practice: Fraction Addition',
        problems: [
          '1/3 + 1/3 = ?',
          '2/8 + 4/8 = ?',
          '3/10 + 5/10 = ?',
          'Maria ate 1/6 of a cake. Her sister ate 3/6. How much cake did they eat together?',
          'A jar is 2/5 full of marbles. You add enough marbles to fill another 2/5. How full is the jar now?',
        ],
        timerSeconds: 180,
      },

      // 7. Direct Instruction — Simplifying
      {
        type: 'direct-instruction',
        title: 'Simplifying Fractions After Adding',
        youtubeId: 'DnFrOetuUKg',
        teacherNotes: 'Focus on the idea that 2/4 is the same as 1/2. Use visual models to show that simplifying does not change the amount — just the way we write it.',
        takeaways: [
          'After adding, check if the fraction can be simplified',
          'Simplify by dividing the numerator and denominator by the same number',
          'Example: 2/4 + 2/4 = 4/4 = 1 whole',
        ],
      },

      // 8. Exit Ticket
      {
        type: 'exit-ticket',
        title: 'Exit Ticket: Adding Fractions',
        questions: [
          { question: 'What is 3/8 + 2/8?', correctAnswer: '5/8' },
          { question: 'What is 1/6 + 4/6?', correctAnswer: '5/6' },
          { question: 'Jaylen drank 2/5 of a water bottle. After recess, he drank 2/5 more. What fraction of the water bottle did he drink in total?', correctAnswer: '4/5' },
        ],
        simulatedClassAvg: 78,
        flaggedStudents: ['Marcus Williams', 'Xavier Harris', 'Destiny Johnson'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Grade 6: Ratios & Proportional Relationships
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pres-g6-ratios',
    grade: 6,
    title: 'Lesson 6.7: Ratios & Proportional Relationships',
    standard: '6.RP.A.1',
    segments: [
      // 1. Opener / Hook — Do Now
      {
        type: 'opener-hook',
        title: 'Do Now: Ratios All Around Us',
        doNowPrompt: 'In a bag of 20 marbles, 8 are blue and 12 are red. Write the ratio of blue to red marbles in 3 different ways.',
        timerSeconds: 120,
      },

      // 2. Direct Instruction — Video
      {
        type: 'direct-instruction',
        title: 'Introduction to Ratios',
        youtubeId: 'RQ2nYUBVvqI',
        teacherNotes: 'Pause at 2:15 to discuss the three ways to write a ratio (using "to", colon notation, and fraction form). Have students practice writing the Do Now answer in all three forms.',
        takeaways: [
          'A ratio compares two quantities — it can be written as "a to b", a:b, or a/b',
          'Ratios can be simplified just like fractions by dividing by the GCF',
          'The order of a ratio matters: "boys to girls" is different from "girls to boys"',
        ],
      },

      // 3. Think-Pair-Share
      {
        type: 'think-pair-share',
        title: 'Think-Pair-Share: Recipe Ratios',
        prompt: 'A recipe calls for 3 cups of flour for every 2 cups of sugar. If you want to make a triple batch, how much of each ingredient do you need? Explain your reasoning.',
        timerSeconds: 90,
        teacherTips: 'Look for students who multiply both parts of the ratio by 3. Some students may try to add 3 to each — redirect them to think about "scaling" both sides equally. Have pairs share different strategies.',
      },

      // 4. Guided Practice
      {
        type: 'guided-practice',
        title: 'Guided Practice: Solving a Proportion',
        problem: 'If 4 notebooks cost $6, how much do 10 notebooks cost?',
        steps: [
          {
            label: 'Step 1: Write the known ratio',
            content: '4 notebooks / $6 — this is our known ratio.',
          },
          {
            label: 'Step 2: Set up the proportion',
            content: '4/6 = 10/x — we need to find x (the cost of 10 notebooks).',
          },
          {
            label: 'Step 3: Cross-multiply',
            content: '4 × x = 6 × 10, so 4x = 60.',
          },
          {
            label: 'Step 4: Solve for x',
            content: 'x = 60 ÷ 4 = $15. Ten notebooks cost $15.',
          },
        ],
      },

      // 5. Check for Understanding
      {
        type: 'check-for-understanding',
        title: 'Quick Check: Ratio Problem',
        question: 'In a class of 30 students, the ratio of boys to girls is 2:3. How many girls are there?',
        options: ['12', '15', '18', '20'],
        correctIndex: 1,
        simulatedResults: [
          { option: '12', count: 2, students: ['Tyler Brooks', 'Brandon Hayes'] },
          { option: '15', count: 18, students: ['Aaliyah King', 'Jordan Taylor', 'Imani Washington', 'Jasmine Rivera', 'Darius Coleman', 'Maya Foster', 'Zaria Phillips', 'Caleb Robinson', 'Destiny Nelson', 'Isaiah Clark', 'Aaliyah King', 'Jordan Taylor', 'Imani Washington', 'Jasmine Rivera', 'Maya Foster', 'Zaria Phillips', 'Caleb Robinson', 'Isaiah Clark'] },
          { option: '18', count: 3, students: ['Tyler Brooks', 'Darius Coleman', 'Destiny Nelson'] },
          { option: '20', count: 1, students: ['Brandon Hayes'] },
        ],
      },

      // 6. Independent Practice
      {
        type: 'independent-practice',
        title: 'Independent Practice: Ratios & Proportions',
        problems: [
          'Simplify the ratio 12:18 to its simplest form.',
          'A car travels 150 miles in 3 hours. At the same rate, how far will it travel in 5 hours?',
          'The ratio of cats to dogs at a shelter is 5:8. If there are 40 dogs, how many cats are there?',
          'A map scale is 1 inch : 25 miles. Two cities are 3.5 inches apart on the map. What is the actual distance?',
          'Which is the better deal: 3 pens for $4.50 or 5 pens for $7.00? Show your work.',
        ],
        timerSeconds: 180,
      },

      // 7. Direct Instruction — Proportions
      {
        type: 'direct-instruction',
        title: 'Solving Proportions with Cross-Multiplication',
        youtubeId: 'USmit5zUGas',
        teacherNotes: 'Emphasize that cross-multiplication is a shortcut for finding equivalent ratios. Walk through 2-3 examples before the exit ticket. Remind students to always check their answers by substituting back.',
        takeaways: [
          'A proportion is two equal ratios: a/b = c/d',
          'Cross-multiply to solve: a × d = b × c',
          'Always check your answer by plugging it back in to verify the ratios are equal',
        ],
      },

      // 8. Exit Ticket
      {
        type: 'exit-ticket',
        title: 'Exit Ticket: Ratios & Proportions',
        questions: [
          { question: 'Write the ratio 15:25 in simplest form.', correctAnswer: '3:5' },
          { question: 'If 6 apples cost $4, how much do 15 apples cost?', correctAnswer: '$10' },
          { question: 'The ratio of boys to girls in a club is 3:4. If there are 28 students total, how many are girls?', correctAnswer: '16' },
        ],
        simulatedClassAvg: 82,
        flaggedStudents: ['Tyler Brooks', 'Brandon Hayes'],
      },
    ],
  },
];

export function getPresentationLessonById(id: string): PresentationLesson | undefined {
  return PRESENTATION_LESSONS.find((l) => l.id === id);
}
