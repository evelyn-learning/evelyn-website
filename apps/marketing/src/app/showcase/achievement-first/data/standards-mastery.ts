export interface StandardScore {
  studentName: string;
  scores: Record<string, number | null>; // standard code -> percentage or null (not assessed)
}

export interface ExitTicketResult {
  date: string;
  lesson: string;
  classAvg: number;
  questionsBreakdown: { question: string; percentCorrect: number }[];
  flaggedStudents: string[];
}

export interface InterventionGroup {
  name: string;
  focus: string;
  students: string[];
  recommendedContent: string;
}

export const STANDARDS_MASTERY: Record<
  3 | 6,
  {
    standards: string[];
    students: StandardScore[];
    exitTickets: ExitTicketResult[];
    interventionGroups: InterventionGroup[];
  }
> = {
  3: {
    standards: ['3.NF.A.1', '3.NF.A.3', '3.OA.B.5', '3.OA.C.7', '3.MD.C.7', '3.G.A.1'],
    students: [
      {
        studentName: 'Jaylen Thompson',
        scores: { '3.NF.A.1': 70, '3.NF.A.3': 55, '3.OA.B.5': 72, '3.OA.C.7': 68, '3.MD.C.7': 75, '3.G.A.1': 65 },
      },
      {
        studentName: 'Amari Davis',
        scores: { '3.NF.A.1': 92, '3.NF.A.3': 85, '3.OA.B.5': 95, '3.OA.C.7': 90, '3.MD.C.7': 88, '3.G.A.1': 91 },
      },
      {
        studentName: 'Sofia Rodriguez',
        scores: { '3.NF.A.1': 78, '3.NF.A.3': 60, '3.OA.B.5': 74, '3.OA.C.7': 72, '3.MD.C.7': 80, '3.G.A.1': 76 },
      },
      {
        studentName: 'Marcus Williams',
        scores: { '3.NF.A.1': 45, '3.NF.A.3': 32, '3.OA.B.5': 40, '3.OA.C.7': 42, '3.MD.C.7': 48, '3.G.A.1': 44 },
      },
      {
        studentName: 'Destiny Johnson',
        scores: { '3.NF.A.1': 68, '3.NF.A.3': 50, '3.OA.B.5': 65, '3.OA.C.7': 60, '3.MD.C.7': 55, '3.G.A.1': 48 },
      },
      {
        studentName: 'Isabella Martinez',
        scores: { '3.NF.A.1': 75, '3.NF.A.3': 58, '3.OA.B.5': 70, '3.OA.C.7': 74, '3.MD.C.7': 78, '3.G.A.1': 72 },
      },
      {
        studentName: 'DeShawn Brown',
        scores: { '3.NF.A.1': 80, '3.NF.A.3': 62, '3.OA.B.5': 78, '3.OA.C.7': 76, '3.MD.C.7': 82, '3.G.A.1': 80 },
      },
      {
        studentName: 'Kiara Mitchell',
        scores: { '3.NF.A.1': 95, '3.NF.A.3': 88, '3.OA.B.5': 92, '3.OA.C.7': 94, '3.MD.C.7': 90, '3.G.A.1': 93 },
      },
      {
        studentName: 'Xavier Harris',
        scores: { '3.NF.A.1': 42, '3.NF.A.3': 28, '3.OA.B.5': 38, '3.OA.C.7': 40, '3.MD.C.7': 45, '3.G.A.1': 40 },
      },
      {
        studentName: 'Marisol Gonzalez',
        scores: { '3.NF.A.1': 74, '3.NF.A.3': 55, '3.OA.B.5': 68, '3.OA.C.7': 70, '3.MD.C.7': 72, '3.G.A.1': null },
      },
      {
        studentName: 'Elijah Carter',
        scores: { '3.NF.A.1': 82, '3.NF.A.3': 65, '3.OA.B.5': 80, '3.OA.C.7': 78, '3.MD.C.7': 85, '3.G.A.1': 82 },
      },
      {
        studentName: 'Aaliyah Moore',
        scores: { '3.NF.A.1': 70, '3.NF.A.3': 48, '3.OA.B.5': 66, '3.OA.C.7': 64, '3.MD.C.7': null, '3.G.A.1': 68 },
      },
    ],
    exitTickets: [
      {
        date: '2026-02-14',
        lesson: 'Adding Fractions with Like Denominators',
        classAvg: 72,
        questionsBreakdown: [
          { question: 'What is 3/8 + 2/8?', percentCorrect: 82 },
          { question: 'What is 1/6 + 4/6?', percentCorrect: 75 },
          { question: 'Word problem: fraction addition', percentCorrect: 58 },
        ],
        flaggedStudents: ['Marcus Williams', 'Xavier Harris', 'Destiny Johnson'],
      },
      {
        date: '2026-02-11',
        lesson: 'Properties of Multiplication',
        classAvg: 78,
        questionsBreakdown: [
          { question: 'What is 6 x 7?', percentCorrect: 88 },
          { question: 'Commutative property example', percentCorrect: 75 },
          { question: 'Array word problem', percentCorrect: 70 },
        ],
        flaggedStudents: ['Marcus Williams', 'Xavier Harris'],
      },
    ],
    interventionGroups: [
      {
        name: 'Fraction Fundamentals',
        focus: 'Struggling with 3.NF.A.1 and 3.NF.A.3 — fraction understanding and addition',
        students: ['Marcus Williams', 'Xavier Harris', 'Aaliyah Moore', 'Destiny Johnson'],
        recommendedContent: 'Assign fraction manipulative activities, visual models lesson, and extra practice on adding fractions with like denominators.',
      },
      {
        name: 'Multiplication Mastery',
        focus: 'Struggling with 3.OA.B.5 and 3.OA.C.7 — multiplication properties and fluency',
        students: ['Marcus Williams', 'Xavier Harris', 'Destiny Johnson'],
        recommendedContent: 'Assign times table practice, array visualization exercises, and commutative property activities.',
      },
      {
        name: 'Geometry Basics',
        focus: 'Struggling with 3.G.A.1 and 3.MD.C.7 — shape identification and area',
        students: ['Xavier Harris', 'Marcus Williams', 'Destiny Johnson'],
        recommendedContent: 'Assign hands-on geometry exploration, shape sorting activity, and area measurement with grid paper.',
      },
    ],
  },
  6: {
    standards: ['6.RP.A.1', '6.RP.A.3', '6.EE.A.2', '6.EE.B.7', '6.G.A.1', '6.SP.B.5'],
    students: [
      {
        studentName: 'Aaliyah King',
        scores: { '6.RP.A.1': 85, '6.RP.A.3': 80, '6.EE.A.2': 72, '6.EE.B.7': 70, '6.G.A.1': 78, '6.SP.B.5': 75 },
      },
      {
        studentName: 'Jordan Taylor',
        scores: { '6.RP.A.1': 78, '6.RP.A.3': 74, '6.EE.A.2': 68, '6.EE.B.7': 65, '6.G.A.1': 72, '6.SP.B.5': 70 },
      },
      {
        studentName: 'Imani Washington',
        scores: { '6.RP.A.1': 94, '6.RP.A.3': 90, '6.EE.A.2': 88, '6.EE.B.7': 85, '6.G.A.1': 92, '6.SP.B.5': 90 },
      },
      {
        studentName: 'Tyler Brooks',
        scores: { '6.RP.A.1': 48, '6.RP.A.3': 42, '6.EE.A.2': 40, '6.EE.B.7': 38, '6.G.A.1': 50, '6.SP.B.5': 45 },
      },
      {
        studentName: 'Jasmine Rivera',
        scores: { '6.RP.A.1': 82, '6.RP.A.3': 78, '6.EE.A.2': 75, '6.EE.B.7': 72, '6.G.A.1': 80, '6.SP.B.5': 76 },
      },
      {
        studentName: 'Darius Coleman',
        scores: { '6.RP.A.1': 74, '6.RP.A.3': 68, '6.EE.A.2': 62, '6.EE.B.7': 60, '6.G.A.1': 70, '6.SP.B.5': null },
      },
      {
        studentName: 'Maya Foster',
        scores: { '6.RP.A.1': 90, '6.RP.A.3': 86, '6.EE.A.2': 82, '6.EE.B.7': 80, '6.G.A.1': 88, '6.SP.B.5': 85 },
      },
      {
        studentName: 'Brandon Hayes',
        scores: { '6.RP.A.1': 45, '6.RP.A.3': 40, '6.EE.A.2': 35, '6.EE.B.7': 32, '6.G.A.1': 42, '6.SP.B.5': 38 },
      },
      {
        studentName: 'Zaria Phillips',
        scores: { '6.RP.A.1': 76, '6.RP.A.3': 72, '6.EE.A.2': 65, '6.EE.B.7': 62, '6.G.A.1': 74, '6.SP.B.5': 70 },
      },
      {
        studentName: 'Caleb Robinson',
        scores: { '6.RP.A.1': 82, '6.RP.A.3': 78, '6.EE.A.2': 74, '6.EE.B.7': 72, '6.G.A.1': 80, '6.SP.B.5': null },
      },
      {
        studentName: 'Destiny Nelson',
        scores: { '6.RP.A.1': 70, '6.RP.A.3': 65, '6.EE.A.2': 58, '6.EE.B.7': 55, '6.G.A.1': 68, '6.SP.B.5': 60 },
      },
      {
        studentName: 'Isaiah Clark',
        scores: { '6.RP.A.1': 68, '6.RP.A.3': 62, '6.EE.A.2': 55, '6.EE.B.7': 52, '6.G.A.1': 65, '6.SP.B.5': 58 },
      },
    ],
    exitTickets: [
      {
        date: '2026-02-14',
        lesson: 'Ratios & Proportional Relationships',
        classAvg: 76,
        questionsBreakdown: [
          { question: 'Write the ratio 15:25 in simplest form', percentCorrect: 84 },
          { question: 'Proportion word problem: cost of apples', percentCorrect: 72 },
          { question: 'Ratio in context: boys to girls', percentCorrect: 70 },
        ],
        flaggedStudents: ['Tyler Brooks', 'Brandon Hayes'],
      },
      {
        date: '2026-02-10',
        lesson: 'Expressions & Equations Introduction',
        classAvg: 70,
        questionsBreakdown: [
          { question: 'Evaluate 3x + 5 when x = 4', percentCorrect: 78 },
          { question: 'Translate words to expression', percentCorrect: 68 },
          { question: 'Solve one-step equation: x + 7 = 15', percentCorrect: 64 },
        ],
        flaggedStudents: ['Tyler Brooks', 'Brandon Hayes', 'Destiny Nelson', 'Isaiah Clark'],
      },
    ],
    interventionGroups: [
      {
        name: 'Ratio Reasoning',
        focus: 'Struggling with 6.RP.A.1 and 6.RP.A.3 — ratio understanding and proportional reasoning',
        students: ['Tyler Brooks', 'Brandon Hayes', 'Isaiah Clark'],
        recommendedContent: 'Assign ratio table activities, visual proportion models, and guided practice with real-world ratio problems.',
      },
      {
        name: 'Equation Essentials',
        focus: 'Struggling with 6.EE.A.2 and 6.EE.B.7 — writing and solving expressions and equations',
        students: ['Tyler Brooks', 'Brandon Hayes', 'Destiny Nelson', 'Isaiah Clark'],
        recommendedContent: 'Assign step-by-step equation solving practice, variable identification exercises, and word-to-expression translation activities.',
      },
      {
        name: 'Geometry & Data Foundations',
        focus: 'Struggling with 6.G.A.1 and 6.SP.B.5 — area and statistical reasoning',
        students: ['Tyler Brooks', 'Brandon Hayes'],
        recommendedContent: 'Assign area calculation practice with composite shapes, data interpretation exercises, and mean/median/mode activities.',
      },
    ],
  },
};
