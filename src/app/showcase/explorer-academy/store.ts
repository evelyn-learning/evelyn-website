import { create } from 'zustand';

export type Role = 'student' | 'parent' | 'instructor';
export type Grade = 3 | 6;
export type Screen =
  | 'login'
  | 'student-home'
  | 'lesson'
  | 'math-helper'
  | 'practice-test'
  | 'homework-chat'
  | 'parent-dashboard'
  | 'instructor-dashboard';

export interface DemoAccount {
  id: string;
  name: string;
  role: Role;
  grade: Grade;
  avatar: string; // single letter or initials
  color: string; // tailwind bg color
  /** For parents: which student account they're linked to */
  childId?: string;
}

interface ExplorerStore {
  currentUser: DemoAccount | null;
  screen: Screen;
  activeLessonId: string | null;
  lessonSegmentIndex: number;
  completedLessons: string[];
  testScores: Record<string, number>;
  assignedLessons: Record<string, string[]>;   // studentName → lessonId[]
  assignedTests: Record<string, string[]>;     // studentName → testTopic[]
  preSelectedTestTopic: string | null;

  login: (account: DemoAccount) => void;
  logout: () => void;
  navigate: (screen: Screen) => void;
  startLesson: (lessonId: string) => void;
  advanceSegment: () => void;
  setSegmentIndex: (index: number) => void;
  completeLesson: (lessonId: string) => void;
  recordTestScore: (topic: string, score: number) => void;
  assignLesson: (studentName: string, lessonId: string) => void;
  assignTest: (studentName: string, topic: string) => void;
  setPreSelectedTestTopic: (topic: string | null) => void;
}

export const useExplorerStore = create<ExplorerStore>((set) => ({
  currentUser: null,
  screen: 'login',
  activeLessonId: null,
  lessonSegmentIndex: 0,
  completedLessons: [],
  testScores: {},
  assignedLessons: {},
  assignedTests: {},
  preSelectedTestTopic: null,

  login: (account) =>
    set({
      currentUser: account,
      screen:
        account.role === 'student'
          ? 'student-home'
          : account.role === 'parent'
            ? 'parent-dashboard'
            : 'instructor-dashboard',
    }),

  logout: () =>
    set({
      currentUser: null,
      screen: 'login',
      activeLessonId: null,
      lessonSegmentIndex: 0,
    }),

  navigate: (screen) => set({ screen }),

  startLesson: (lessonId) =>
    set({ activeLessonId: lessonId, lessonSegmentIndex: 0, screen: 'lesson' }),

  advanceSegment: () =>
    set((state) => ({ lessonSegmentIndex: state.lessonSegmentIndex + 1 })),

  setSegmentIndex: (index) => set({ lessonSegmentIndex: index }),

  completeLesson: (lessonId) =>
    set((state) => ({
      completedLessons: state.completedLessons.includes(lessonId)
        ? state.completedLessons
        : [...state.completedLessons, lessonId],
      screen: 'student-home',
      activeLessonId: null,
      lessonSegmentIndex: 0,
    })),

  recordTestScore: (topic, score) =>
    set((state) => ({
      testScores: { ...state.testScores, [topic]: score },
    })),

  assignLesson: (studentName, lessonId) =>
    set((state) => {
      const current = state.assignedLessons[studentName] || [];
      if (current.includes(lessonId)) return state;
      return {
        assignedLessons: {
          ...state.assignedLessons,
          [studentName]: [...current, lessonId],
        },
      };
    }),

  assignTest: (studentName, topic) =>
    set((state) => {
      const current = state.assignedTests[studentName] || [];
      if (current.includes(topic)) return state;
      return {
        assignedTests: {
          ...state.assignedTests,
          [studentName]: [...current, topic],
        },
      };
    }),

  setPreSelectedTestTopic: (topic) => set({ preSelectedTestTopic: topic }),
}));
