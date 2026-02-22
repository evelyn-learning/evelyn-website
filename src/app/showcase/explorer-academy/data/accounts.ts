import { DemoAccount } from '../store';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  // Grade 3
  {
    id: 'student-aanya-3',
    name: 'Aanya Sharma',
    role: 'student',
    grade: 3,
    avatar: 'A',
    color: 'bg-purple-500',
  },
  {
    id: 'student-adaptive-3',
    name: 'Alex Rivera',
    role: 'student',
    grade: 3,
    avatar: 'AR',
    color: 'bg-amber-500',
    isAdaptive: true,
  },
  {
    id: 'parent-aanya-3',
    name: 'Priya Sharma',
    role: 'parent',
    grade: 3,
    avatar: 'P',
    color: 'bg-blue-500',
    childId: 'student-aanya-3',
  },
  {
    id: 'instructor-3',
    name: 'Ms. Chen',
    role: 'instructor',
    grade: 3,
    avatar: 'C',
    color: 'bg-green-500',
  },

  // Grade 6
  {
    id: 'student-ethan-6',
    name: 'Ethan Williams',
    role: 'student',
    grade: 6,
    avatar: 'E',
    color: 'bg-purple-500',
  },
  {
    id: 'parent-ethan-6',
    name: 'Sarah Williams',
    role: 'parent',
    grade: 6,
    avatar: 'S',
    color: 'bg-blue-500',
    childId: 'student-ethan-6',
  },
  {
    id: 'instructor-6',
    name: 'Mr. Thompson',
    role: 'instructor',
    grade: 6,
    avatar: 'T',
    color: 'bg-green-500',
  },
];

export function getAccountsByGrade(grade: 3 | 6) {
  return DEMO_ACCOUNTS.filter((a) => a.grade === grade);
}

export function getChildAccount(parentId: string) {
  const parent = DEMO_ACCOUNTS.find((a) => a.id === parentId);
  if (!parent?.childId) return null;
  return DEMO_ACCOUNTS.find((a) => a.id === parent.childId) || null;
}
