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
    instructor: 'Ms. Chen',
    gradeLabel: 'Grade 3 Math & Science',
    students: [
      { name: 'Aanya Sharma', progress: 78, status: 'On Track', currentTopic: 'Addition Strategies', lastActive: 'Today' },
      { name: 'Liam Nguyen', progress: 92, status: 'Excelling', currentTopic: 'Multiplication Basics', lastActive: 'Today' },
      { name: 'Sophia Chen', progress: 65, status: 'Needs Attention', currentTopic: 'Fractions Introduction', lastActive: 'Yesterday' },
      { name: 'Jack Robinson', progress: 85, status: 'On Track', currentTopic: 'Plant Life Cycles', lastActive: 'Today' },
      { name: 'Harleen Kaur', progress: 44, status: 'Needs Attention', currentTopic: 'Addition & Subtraction', lastActive: '3 days ago' },
      { name: 'Oliver Park', progress: 88, status: 'Excelling', currentTopic: 'Patterns & Sorting', lastActive: 'Today' },
      { name: 'Emma Watson', progress: 72, status: 'On Track', currentTopic: 'Forces & Motion', lastActive: 'Yesterday' },
      { name: 'Arjun Patel', progress: 58, status: 'Needs Attention', currentTopic: 'Weather & Water', lastActive: '2 days ago' },
    ],
    performance: [
      { topic: 'Addition', score: 82 },
      { topic: 'Multiplication', score: 61 },
      { topic: 'Fractions', score: 48 },
      { topic: 'Patterns', score: 74 },
      { topic: 'Life Cycles', score: 86 },
      { topic: 'Forces', score: 55 },
    ],
    alerts: [
      { name: 'Harleen Kaur', issues: 'Struggling with Addition & Subtraction (44%) — not active for 3 days', suggestion: 'Recommend extra practice with regrouping and parent notification.' },
      { name: 'Sophia Chen', issues: 'Falling behind in Fractions (48%) and Geometry (42%)', suggestion: 'Consider visual manipulatives and hands-on activities.' },
      { name: 'Arjun Patel', issues: 'Needs help with Weather & Water (38%) and Measurement (45%)', suggestion: 'Assign foundational Science exercises before next unit.' },
    ],
    curriculumPath: [
      { id: 'add-sub-3', topic: 'Addition & Subtraction Strategies', priority: 'high' },
      { id: 'mult-3', topic: 'Multiplication Basics', priority: 'high' },
      { id: 'fractions-3', topic: 'Fractions Introduction', priority: 'high' },
      { id: 'patterns-3', topic: 'Patterns & Sorting', priority: 'normal' },
      { id: 'geometry-3', topic: 'Geometry Basics', priority: 'normal' },
      { id: 'measurement-3', topic: 'Measurement', priority: 'low' },
      { id: 'life-cycles-3', topic: 'Life Cycles of Plants', priority: 'high' },
      { id: 'forces-3', topic: 'Forces & Motion', priority: 'normal' },
      { id: 'weather-3', topic: 'Weather & Water Cycle', priority: 'normal' },
    ],
  },
  6: {
    instructor: 'Mr. Thompson',
    gradeLabel: 'Grade 6 Math & Science',
    students: [
      { name: 'Ethan Williams', progress: 88, status: 'Excelling', currentTopic: 'Ratios & Proportions', lastActive: 'Today' },
      { name: 'Aiden Chen', progress: 78, status: 'On Track', currentTopic: 'Integers', lastActive: 'Today' },
      { name: 'Maya Patel', progress: 65, status: 'Needs Attention', currentTopic: 'Expressions & Equations', lastActive: 'Yesterday' },
      { name: 'Mei-Lin Wong', progress: 92, status: 'Excelling', currentTopic: 'Cells & Organisms', lastActive: 'Today' },
      { name: 'Riya Singh', progress: 44, status: 'Needs Attention', currentTopic: 'Fractions & Decimals', lastActive: '3 days ago' },
      { name: 'Noah Thompson', progress: 72, status: 'On Track', currentTopic: 'Geometry & Measurement', lastActive: 'Yesterday' },
      { name: 'Priya Dhillon', progress: 81, status: 'On Track', currentTopic: 'Electricity & Circuits', lastActive: 'Today' },
      { name: 'Lucas Martin', progress: 58, status: 'Needs Attention', currentTopic: 'Data Analysis', lastActive: '2 days ago' },
    ],
    performance: [
      { topic: 'Ratios', score: 76 },
      { topic: 'Integers', score: 68 },
      { topic: 'Expressions', score: 53 },
      { topic: 'Geometry', score: 72 },
      { topic: 'Cells', score: 84 },
      { topic: 'Electricity', score: 45 },
    ],
    alerts: [
      { name: 'Riya Singh', issues: 'Struggling with Fractions & Decimals (44%) — not active for 3 days', suggestion: 'Recommend extra practice and parent notification.' },
      { name: 'Maya Patel', issues: 'Falling behind in Expressions & Equations (48%)', suggestion: 'Consider step-by-step equation solving exercises.' },
      { name: 'Lucas Martin', issues: 'Needs help with Data Analysis (38%) and Electricity (42%)', suggestion: 'Assign foundational exercises before moving to next unit.' },
    ],
    curriculumPath: [
      { id: 'ratios-6', topic: 'Ratios & Proportional Relationships', priority: 'high' },
      { id: 'integers-6', topic: 'Integers', priority: 'high' },
      { id: 'expressions-6', topic: 'Expressions & Equations', priority: 'high' },
      { id: 'geometry-6', topic: 'Geometry & Measurement', priority: 'normal' },
      { id: 'fractions-6', topic: 'Fractions & Decimals', priority: 'normal' },
      { id: 'data-6', topic: 'Data Analysis', priority: 'low' },
      { id: 'cells-6', topic: 'Cells: Building Blocks of Life', priority: 'high' },
      { id: 'electricity-6', topic: 'Electricity & Circuits', priority: 'normal' },
      { id: 'space-6', topic: 'Space & Astronomy', priority: 'normal' },
    ],
  },
};

export function getClassData(grade: Grade): ClassData {
  return CLASS_DATA[grade];
}
