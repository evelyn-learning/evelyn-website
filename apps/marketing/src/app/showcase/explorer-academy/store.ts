import { create } from 'zustand';
import { LessonSegment } from './data/lessons';

export type Role = 'student' | 'parent' | 'instructor';
export type Grade = 3 | 6;
export type Screen =
  | 'login'
  | 'student-home'
  | 'lesson'
  | 'adaptive-lesson'
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
  /** Whether this account uses AI-adaptive lessons */
  isAdaptive?: boolean;
}

export type AdaptivePhase = 'INTRO' | 'DIAGNOSTIC' | 'TEACH' | 'ASSESS' | 'SUMMARY';

export interface AdaptiveHistoryEntry {
  phase: AdaptivePhase;
  segmentType: string;
  objectiveId?: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
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

  // Adaptive lesson state
  adaptivePhase: AdaptivePhase;
  adaptiveSegments: LessonSegment[];
  adaptiveSegmentIndex: number;
  adaptiveHistory: AdaptiveHistoryEntry[];
  adaptiveVideosUsed: string[];
  adaptiveLessonId: string | null;

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

  // Adaptive actions
  startAdaptiveLesson: (lessonId: string) => void;
  setAdaptivePhase: (phase: AdaptivePhase) => void;
  appendAdaptiveSegments: (segments: LessonSegment[]) => void;
  advanceAdaptiveSegment: () => void;
  setAdaptiveSegmentIndex: (index: number) => void;
  addAdaptiveHistory: (entry: AdaptiveHistoryEntry) => void;
  addAdaptiveVideoUsed: (youtubeId: string) => void;
  completeAdaptiveLesson: () => void;
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

  // Adaptive defaults
  adaptivePhase: 'INTRO',
  adaptiveSegments: [],
  adaptiveSegmentIndex: 0,
  adaptiveHistory: [],
  adaptiveVideosUsed: [],
  adaptiveLessonId: null,

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
      adaptivePhase: 'INTRO',
      adaptiveSegments: [],
      adaptiveSegmentIndex: 0,
      adaptiveHistory: [],
      adaptiveVideosUsed: [],
      adaptiveLessonId: null,
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

  // Adaptive actions
  startAdaptiveLesson: (lessonId) =>
    set({
      adaptiveLessonId: lessonId,
      adaptivePhase: 'INTRO',
      adaptiveSegments: [],
      adaptiveSegmentIndex: 0,
      adaptiveHistory: [],
      adaptiveVideosUsed: [],
      screen: 'adaptive-lesson',
    }),

  setAdaptivePhase: (phase) => set({ adaptivePhase: phase }),

  appendAdaptiveSegments: (segments) =>
    set((state) => ({
      adaptiveSegments: [...state.adaptiveSegments, ...segments],
    })),

  advanceAdaptiveSegment: () =>
    set((state) => ({ adaptiveSegmentIndex: state.adaptiveSegmentIndex + 1 })),

  setAdaptiveSegmentIndex: (index) => set({ adaptiveSegmentIndex: index }),

  addAdaptiveHistory: (entry) =>
    set((state) => ({
      adaptiveHistory: [...state.adaptiveHistory, entry],
    })),

  addAdaptiveVideoUsed: (youtubeId) =>
    set((state) => ({
      adaptiveVideosUsed: state.adaptiveVideosUsed.includes(youtubeId)
        ? state.adaptiveVideosUsed
        : [...state.adaptiveVideosUsed, youtubeId],
    })),

  completeAdaptiveLesson: () =>
    set((state) => ({
      completedLessons: state.adaptiveLessonId && !state.completedLessons.includes(state.adaptiveLessonId)
        ? [...state.completedLessons, state.adaptiveLessonId]
        : state.completedLessons,
      screen: 'student-home',
      adaptiveLessonId: null,
      adaptivePhase: 'INTRO',
      adaptiveSegments: [],
      adaptiveSegmentIndex: 0,
      adaptiveHistory: [],
      adaptiveVideosUsed: [],
    })),
}));
