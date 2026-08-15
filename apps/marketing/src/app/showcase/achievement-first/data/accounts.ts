import { DemoAccount } from '../store';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  // Grade 3
  {
    id: 'student-jaylen-3',
    name: 'Jaylen Thompson',
    role: 'student',
    grade: 3,
    avatar: 'J',
    color: 'bg-blue-600',
  },
  {
    id: 'parent-jaylen-3',
    name: 'Marcus Thompson',
    role: 'parent',
    grade: 3,
    avatar: 'M',
    color: 'bg-sky-500',
    childId: 'student-jaylen-3',
  },
  {
    id: 'instructor-3',
    name: 'Ms. Williams',
    role: 'instructor',
    grade: 3,
    avatar: 'W',
    color: 'bg-emerald-600',
  },

  // Grade 6
  {
    id: 'student-aaliyah-6',
    name: 'Aaliyah King',
    role: 'student',
    grade: 6,
    avatar: 'A',
    color: 'bg-blue-600',
  },
  {
    id: 'parent-aaliyah-6',
    name: 'Keisha King',
    role: 'parent',
    grade: 6,
    avatar: 'K',
    color: 'bg-sky-500',
    childId: 'student-aaliyah-6',
  },
  {
    id: 'instructor-6',
    name: 'Mr. Jackson',
    role: 'instructor',
    grade: 6,
    avatar: 'J',
    color: 'bg-emerald-600',
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
