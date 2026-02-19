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
  'student-aanya-3': {
    studentId: 'student-aanya-3',
    overallProgress: 35,
    lessonsCompleted: 1,
    totalLessons: 2,
    weeklyStats: {
      timeSpent: '3.2 hours',
      problemsSolved: 28,
      testsCompleted: 2,
      streak: '3 days',
    },
    skills: [
      { topic: 'Addition & Subtraction', mastery: 78 },
      { topic: 'Multiplication Basics', mastery: 52 },
      { topic: 'Fractions', mastery: 30 },
      { topic: 'Patterns', mastery: 65 },
      { topic: 'Plant Life Cycles', mastery: 88 },
      { topic: 'Forces & Motion', mastery: 45 },
    ],
    recentActivity: [
      { date: 'Today', action: 'Completed lesson', detail: 'Addition Strategies' },
      { date: 'Today', action: 'Practice test', detail: 'Addition & Subtraction — scored 4/5' },
      { date: 'Yesterday', action: 'Homework chat', detail: 'Asked about plant life cycles' },
      { date: 'Yesterday', action: 'Completed lesson', detail: 'Life Cycles of Plants' },
      { date: '2 days ago', action: 'Practice test', detail: 'Patterns & Sorting — scored 3/5' },
      { date: '3 days ago', action: 'Math helper', detail: 'Worked on 24 + 38 step-by-step' },
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
  'student-ethan-6': {
    studentId: 'student-ethan-6',
    overallProgress: 58,
    lessonsCompleted: 1,
    totalLessons: 2,
    weeklyStats: {
      timeSpent: '5.8 hours',
      problemsSolved: 64,
      testsCompleted: 4,
      streak: '6 days',
    },
    skills: [
      { topic: 'Ratios', mastery: 82 },
      { topic: 'Integers', mastery: 75 },
      { topic: 'Expressions & Equations', mastery: 58 },
      { topic: 'Geometry', mastery: 71 },
      { topic: 'Cells & Organisms', mastery: 90 },
      { topic: 'Electricity', mastery: 48 },
    ],
    recentActivity: [
      { date: 'Today', action: 'Practice test', detail: 'Ratios — scored 5/5' },
      { date: 'Today', action: 'Math helper', detail: 'Solved ratio word problem' },
      { date: 'Yesterday', action: 'Completed lesson', detail: 'Cells: Building Blocks of Life' },
      { date: 'Yesterday', action: 'Homework chat', detail: 'Asked about equivalent ratios' },
      { date: '2 days ago', action: 'Practice test', detail: 'Cells & Organisms — scored 4/5' },
      { date: '3 days ago', action: 'Completed lesson', detail: 'Ratios and Proportional Relationships' },
    ],
    achievements: [
      { icon: '🏆', title: 'Perfect Score!', description: 'Got 5/5 on a practice test' },
      { icon: '🔬', title: 'Cell Expert', description: 'Scored 90%+ on cells topic' },
      { icon: '🔥', title: '6-Day Streak', description: 'Studied 6 days in a row!' },
      { icon: '📐', title: 'Ratio Master', description: 'Scored 80%+ on ratios' },
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
