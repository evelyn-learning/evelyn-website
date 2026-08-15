import { Grade } from '../store';

export interface ClassStudent {
  name: string;
  progress: number;
  status: 'On Track' | 'Excelling' | 'Needs Attention';
  currentTopic: string;
  lastActive: string;
}

export interface ClassPerformance {
  topic: string;
  score: number;
}

export interface StudentAlert {
  name: string;
  issues: string;
  suggestion: string;
}

export interface ClassData {
  instructor: string;
  gradeLabel: string;
  students: ClassStudent[];
  performance: ClassPerformance[];
  alerts: StudentAlert[];
  curriculumPath: { id: string; topic: string; priority: 'high' | 'normal' | 'low' }[];
}

export const CLASS_DATA: Record<Grade, ClassData> = {
  3: {
    instructor: 'Ms. Williams',
    gradeLabel: 'Grade 3 Math & Science',
    students: [
      { name: 'Jaylen Thompson', progress: 72, status: 'On Track', currentTopic: 'Adding Fractions', lastActive: 'Today' },
      { name: 'Amari Davis', progress: 91, status: 'Excelling', currentTopic: 'Properties of Multiplication', lastActive: 'Today' },
      { name: 'Sofia Rodriguez', progress: 78, status: 'On Track', currentTopic: 'Life Cycles of Plants', lastActive: 'Today' },
      { name: 'Marcus Williams', progress: 42, status: 'Needs Attention', currentTopic: 'Adding Fractions', lastActive: '3 days ago' },
      { name: 'Destiny Johnson', progress: 68, status: 'On Track', currentTopic: 'Geometry Basics', lastActive: 'Yesterday' },
      { name: 'Isabella Martinez', progress: 75, status: 'On Track', currentTopic: 'Measurement', lastActive: 'Today' },
      { name: 'DeShawn Brown', progress: 80, status: 'On Track', currentTopic: 'Weather & Water', lastActive: 'Yesterday' },
      { name: 'Kiara Mitchell', progress: 95, status: 'Excelling', currentTopic: 'Properties of Multiplication', lastActive: 'Today' },
      { name: 'Xavier Harris', progress: 40, status: 'Needs Attention', currentTopic: 'Addition & Subtraction', lastActive: '2 days ago' },
      { name: 'Marisol Gonzalez', progress: 74, status: 'On Track', currentTopic: 'Patterns', lastActive: 'Today' },
      { name: 'Elijah Carter', progress: 82, status: 'On Track', currentTopic: 'Life Cycles of Plants', lastActive: 'Today' },
      { name: 'Aaliyah Moore', progress: 70, status: 'On Track', currentTopic: 'Adding Fractions', lastActive: 'Yesterday' },
    ],
    performance: [
      { topic: 'Addition', score: 79 },
      { topic: 'Fractions', score: 52 },
      { topic: 'Multiplication', score: 65 },
      { topic: 'Geometry', score: 71 },
      { topic: 'Life Cycles', score: 84 },
      { topic: 'Weather', score: 60 },
    ],
    alerts: [
      { name: 'Marcus Williams', issues: 'Struggling with Fractions (38%) and Addition (45%) — not active for 3 days', suggestion: 'Recommend fraction manipulatives and one-on-one tutoring session.' },
      { name: 'Xavier Harris', issues: 'Falling behind in Addition & Subtraction (40%) and Multiplication (35%)', suggestion: 'Consider visual aids, number lines, and parent notification.' },
      { name: 'Destiny Johnson', issues: 'Needs help with Geometry (48%) — inconsistent attendance', suggestion: 'Assign extra geometry practice and check in during small group time.' },
    ],
    curriculumPath: [
      { id: 'fractions-3', topic: 'Fractions (Like Denominators)', priority: 'high' },
      { id: 'mult-3', topic: 'Multiplication Properties', priority: 'high' },
      { id: 'add-sub-3', topic: 'Addition & Subtraction', priority: 'high' },
      { id: 'patterns-3', topic: 'Patterns', priority: 'normal' },
      { id: 'geometry-3', topic: 'Geometry', priority: 'normal' },
      { id: 'measurement-3', topic: 'Measurement', priority: 'low' },
      { id: 'life-cycles-3', topic: 'Life Cycles of Plants', priority: 'high' },
      { id: 'forces-3', topic: 'Forces & Motion', priority: 'normal' },
      { id: 'weather-3', topic: 'Weather & Water Cycle', priority: 'normal' },
    ],
  },
  6: {
    instructor: 'Mr. Jackson',
    gradeLabel: 'Grade 6 Math & Science',
    students: [
      { name: 'Aaliyah King', progress: 85, status: 'On Track', currentTopic: 'Ratios & Proportions', lastActive: 'Today' },
      { name: 'Jordan Taylor', progress: 78, status: 'On Track', currentTopic: 'Expressions & Equations', lastActive: 'Today' },
      { name: 'Imani Washington', progress: 92, status: 'Excelling', currentTopic: 'Cells & Organisms', lastActive: 'Today' },
      { name: 'Tyler Brooks', progress: 55, status: 'Needs Attention', currentTopic: 'Ratios & Proportions', lastActive: '2 days ago' },
      { name: 'Jasmine Rivera', progress: 80, status: 'On Track', currentTopic: 'Geometry', lastActive: 'Today' },
      { name: 'Darius Coleman', progress: 74, status: 'On Track', currentTopic: 'Fractions & Decimals', lastActive: 'Yesterday' },
      { name: 'Maya Foster', progress: 88, status: 'Excelling', currentTopic: 'Data Analysis', lastActive: 'Today' },
      { name: 'Brandon Hayes', progress: 50, status: 'Needs Attention', currentTopic: 'Expressions & Equations', lastActive: '3 days ago' },
      { name: 'Zaria Phillips', progress: 76, status: 'On Track', currentTopic: 'Electricity', lastActive: 'Yesterday' },
      { name: 'Caleb Robinson', progress: 82, status: 'On Track', currentTopic: 'Space & Astronomy', lastActive: 'Today' },
      { name: 'Destiny Nelson', progress: 71, status: 'On Track', currentTopic: 'Integers', lastActive: 'Yesterday' },
      { name: 'Isaiah Clark', progress: 68, status: 'On Track', currentTopic: 'Cells & Organisms', lastActive: 'Today' },
    ],
    performance: [
      { topic: 'Ratios', score: 74 },
      { topic: 'Expressions', score: 58 },
      { topic: 'Geometry', score: 72 },
      { topic: 'Data Analysis', score: 68 },
      { topic: 'Cells', score: 82 },
      { topic: 'Electricity', score: 50 },
    ],
    alerts: [
      { name: 'Tyler Brooks', issues: 'Struggling with Ratios (42%) and Expressions (38%) — not active for 2 days', suggestion: 'Recommend ratio manipulatives and step-by-step guided practice.' },
      { name: 'Brandon Hayes', issues: 'Falling behind in Expressions & Equations (35%) and Geometry (40%) — not active for 3 days', suggestion: 'Consider one-on-one tutoring and parent conference.' },
      { name: 'Destiny Nelson', issues: 'Needs help with Electricity (44%) and Data Analysis (48%)', suggestion: 'Assign foundational Science exercises before next unit.' },
    ],
    curriculumPath: [
      { id: 'ratios-6', topic: 'Ratios & Proportional Relationships', priority: 'high' },
      { id: 'expressions-6', topic: 'Expressions & Equations', priority: 'high' },
      { id: 'geometry-6', topic: 'Geometry', priority: 'normal' },
      { id: 'data-6', topic: 'Data Analysis', priority: 'normal' },
      { id: 'fractions-6', topic: 'Fractions & Decimals', priority: 'normal' },
      { id: 'integers-6', topic: 'Integers', priority: 'low' },
      { id: 'cells-6', topic: 'Cells & Organisms', priority: 'high' },
      { id: 'electricity-6', topic: 'Electricity', priority: 'normal' },
      { id: 'space-6', topic: 'Space & Astronomy', priority: 'normal' },
    ],
  },
};

export function getClassData(grade: Grade): ClassData {
  return CLASS_DATA[grade];
}
