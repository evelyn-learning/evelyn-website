import { Grade } from '../store';

export interface StudentProgress {
  studentId: string;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  weeklyStats: {
    timeSpent: string;
    problemsSolved: number;
    testsCompleted: number;
    streak: string;
  };
  skills: { topic: string; mastery: number }[];
  recentActivity: { date: string; action: string; detail: string }[];
  achievements: { icon: string; title: string; description: string }[];
  todaysGoals: { label: string; done: boolean }[];
}

export const STUDENT_PROGRESS: Record<string, StudentProgress> = {
  'student-jaylen-3': {
    studentId: 'student-jaylen-3',
    overallProgress: 35,
    lessonsCompleted: 1,
    totalLessons: 2,
    weeklyStats: {
      timeSpent: '2.8 hours',
      problemsSolved: 24,
      testsCompleted: 2,
      streak: '3 days',
    },
    skills: [
      { topic: 'Addition & Subtraction', mastery: 75 },
      { topic: 'Fractions', mastery: 38 },
      { topic: 'Multiplication', mastery: 50 },
      { topic: 'Patterns', mastery: 62 },
      { topic: 'Plant Life Cycles', mastery: 85 },
      { topic: 'Weather & Water', mastery: 42 },
    ],
    recentActivity: [
      { date: 'Today', action: 'Completed lesson', detail: 'Adding Fractions with Like Denominators' },
      { date: 'Today', action: 'Practice test', detail: 'Fractions — scored 3/5' },
      { date: 'Yesterday', action: 'Homework chat', detail: 'Asked about plant life cycles' },
      { date: 'Yesterday', action: 'Completed lesson', detail: 'Life Cycles of Plants' },
      { date: '2 days ago', action: 'Practice test', detail: 'Addition & Subtraction — scored 4/5' },
      { date: '3 days ago', action: 'Math helper', detail: 'Worked on 1/4 + 2/4 step-by-step' },
    ],
    achievements: [
      { icon: '🌟', title: 'First Lesson!', description: 'Completed your first lesson' },
      { icon: '🧪', title: 'Science Explorer', description: 'Scored 80%+ on a science topic' },
      { icon: '🔥', title: '3-Day Streak', description: 'Studied 3 days in a row!' },
    ],
    todaysGoals: [
      { label: 'Complete 1 lesson', done: true },
      { label: 'Take a practice test', done: true },
      { label: 'Try the Math Helper', done: false },
    ],
  },
  'student-aaliyah-6': {
    studentId: 'student-aaliyah-6',
    overallProgress: 58,
    lessonsCompleted: 1,
    totalLessons: 2,
    weeklyStats: {
      timeSpent: '5.2 hours',
      problemsSolved: 58,
      testsCompleted: 3,
      streak: '5 days',
    },
    skills: [
      { topic: 'Ratios', mastery: 80 },
      { topic: 'Expressions & Equations', mastery: 55 },
      { topic: 'Geometry', mastery: 72 },
      { topic: 'Data Analysis', mastery: 65 },
      { topic: 'Cells & Organisms', mastery: 88 },
      { topic: 'Electricity', mastery: 45 },
    ],
    recentActivity: [
      { date: 'Today', action: 'Practice test', detail: 'Ratios — scored 4/5' },
      { date: 'Today', action: 'Math helper', detail: 'Solved ratio word problem' },
      { date: 'Yesterday', action: 'Completed lesson', detail: 'Cells: Structure & Function' },
      { date: 'Yesterday', action: 'Homework chat', detail: 'Asked about equivalent ratios' },
      { date: '2 days ago', action: 'Practice test', detail: 'Cells & Organisms — scored 4/5' },
      { date: '3 days ago', action: 'Completed lesson', detail: 'Ratios & Proportional Relationships' },
    ],
    achievements: [
      { icon: '🏆', title: 'High Scorer!', description: 'Got 4/5 on a practice test' },
      { icon: '🔬', title: 'Cell Expert', description: 'Scored 85%+ on cells topic' },
      { icon: '🔥', title: '5-Day Streak', description: 'Studied 5 days in a row!' },
      { icon: '📐', title: 'Ratio Pro', description: 'Scored 80%+ on ratios' },
    ],
    todaysGoals: [
      { label: 'Complete 1 lesson', done: false },
      { label: 'Take a practice test', done: true },
      { label: 'Review Expressions & Equations', done: false },
    ],
  },
};

export function getProgressForStudent(studentId: string): StudentProgress | null {
  return STUDENT_PROGRESS[studentId] || null;
}

/** Get progress data for a parent's child */
export function getProgressForChild(childId: string): StudentProgress | null {
  return STUDENT_PROGRESS[childId] || null;
}
