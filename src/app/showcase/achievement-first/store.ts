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
  | 'instructor-dashboard'
  | 'presentation';

export type InstructorTab = 'todays-lesson' | 'class-data' | 'assignments' | 'scope-sequence';

export interface DemoAccount {
  id: string;
  name: string;
  role: Role;
  grade: Grade;
  avatar: string;
  color: string;
  childId?: string;
}

interface AFStore {
  currentUser: DemoAccount | null;
  screen: Screen;
  activeLessonId: string | null;
  lessonSegmentIndex: number;
  completedLessons: string[];
  testScores: Record<string, number>;
  assignedLessons: Record<string, string[]>;
  assignedTests: Record<string, string[]>;
  preSelectedTestTopic: string | null;

  // Instructor-specific
  instructorTab: InstructorTab;
  presentationLessonId: string | null;
  presentationSegmentIndex: number;
  interventionAssignments: Record<string, string[]>;

  // Actions
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
  setInstructorTab: (tab: InstructorTab) => void;
  startPresentation: (lessonId: string) => void;
  advancePresentationSegment: () => void;
  setPresentationSegmentIndex: (index: number) => void;
  exitPresentation: () => void;
  assignIntervention: (groupName: string, studentNames: string[]) => void;
}

export const useAFStore = create<AFStore>((set) => ({
  currentUser: null,
  screen: 'login',
  activeLessonId: null,
  lessonSegmentIndex: 0,
  completedLessons: [],
  testScores: {},
  assignedLessons: {},
  assignedTests: {},
  preSelectedTestTopic: null,
  instructorTab: 'todays-lesson',
  presentationLessonId: null,
  presentationSegmentIndex: 0,
  interventionAssignments: {},

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
      instructorTab: 'todays-lesson',
      presentationLessonId: null,
      presentationSegmentIndex: 0,
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

  setInstructorTab: (tab) => set({ instructorTab: tab }),

  startPresentation: (lessonId) =>
    set({ presentationLessonId: lessonId, presentationSegmentIndex: 0, screen: 'presentation' }),

  advancePresentationSegment: () =>
    set((state) => ({ presentationSegmentIndex: state.presentationSegmentIndex + 1 })),

  setPresentationSegmentIndex: (index) => set({ presentationSegmentIndex: index }),

  exitPresentation: () =>
    set({ screen: 'instructor-dashboard', presentationLessonId: null, presentationSegmentIndex: 0 }),

  assignIntervention: (groupName, studentNames) =>
    set((state) => ({
      interventionAssignments: {
        ...state.interventionAssignments,
        [groupName]: studentNames,
      },
    })),
}));
