export interface Student {
  name: string;
  mastery: 'Proficient' | 'Approaching' | 'Developing';
  exitTicket: number;
  ell: string;
  flag: string;
  homePractice?: { minutes: number; lastActive: string };
  exitTicketHistory?: number[];
  projectPhase?: string;
}

export const STUDENTS: Student[] = [
  {
    name: 'Marcus T.',
    mastery: 'Approaching',
    exitTicket: 58,
    ell: 'No',
    flag: 'Misconception on equivalent fractions',
    homePractice: { minutes: 12, lastActive: '7:15 PM' },
    exitTicketHistory: [62, 55, 58],
    projectPhase: 'Drafting',
  },
  {
    name: 'Sofia R.',
    mastery: 'Developing',
    exitTicket: 44,
    ell: 'Yes (Spanish)',
    flag: 'Language support needed',
    homePractice: { minutes: 25, lastActive: '8:30 PM' },
    exitTicketHistory: [38, 41, 44],
    projectPhase: 'Brainstorm',
  },
  {
    name: 'Aiden K.',
    mastery: 'Proficient',
    exitTicket: 91,
    ell: 'No',
    flag: 'Ready for extension',
    homePractice: { minutes: 30, lastActive: '6:45 PM' },
    exitTicketHistory: [85, 89, 91],
    projectPhase: 'Revising',
  },
  {
    name: 'Destiny M.',
    mastery: 'Approaching',
    exitTicket: 63,
    ell: 'Yes (Vietnamese)',
    flag: 'Needs visual models',
    homePractice: { minutes: 0, lastActive: 'None' },
    exitTicketHistory: [60, 58, 63],
    projectPhase: 'Drafting',
  },
  {
    name: 'James L.',
    mastery: 'Developing',
    exitTicket: 52,
    ell: 'No',
    flag: 'Inconsistent effort',
    homePractice: { minutes: 8, lastActive: '9:10 PM' },
    exitTicketHistory: [65, 48, 52],
    projectPhase: 'Brainstorm',
  },
  {
    name: 'Priya S.',
    mastery: 'Proficient',
    exitTicket: 88,
    ell: 'No',
    flag: 'Peer tutor candidate',
    homePractice: { minutes: 20, lastActive: '7:00 PM' },
    exitTicketHistory: [82, 86, 88],
    projectPhase: 'Revising',
  },
];

export const SECTIONS = [
  { id: 'ell-copilot', label: 'ELL Co-Pilot', icon: 'Languages' },
  { id: 'teacher-brief', label: 'Teacher Brief', icon: 'FileText' },
  { id: 'ai-copilot', label: 'AI Co-Pilot', icon: 'Bot' },
  { id: 'dashboard', label: 'Single Pane', icon: 'LayoutDashboard' },
  { id: 'proposal', label: 'Pilot Proposal', icon: 'Rocket' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const MASTERY_COLORS = {
  Proficient: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  Approaching: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' },
  Developing: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
};

export const EXIT_TICKET_DATA = [
  { question: 'Q1: Compare ½ and ⅓', correct: 5, incorrect: 1 },
  { question: 'Q2: Order ¼, ⅓, ½', correct: 3, incorrect: 3 },
  { question: 'Q3: Find equivalent', correct: 2, incorrect: 4 },
  { question: 'Q4: Word problem', correct: 4, incorrect: 2 },
];

export const ACTION_CARDS = [
  {
    misconception: '3 students confused numerator/denominator roles',
    action: 'Use visual fraction strips in warm-up',
    severity: 'high',
  },
  {
    misconception: '2 students struggled with finding common denominators',
    action: 'Model with area models before transitioning to number lines',
    severity: 'medium',
  },
  {
    misconception: '1 student compared fractions by numerator only',
    action: 'Use same-denominator comparison as a bridge activity',
    severity: 'low',
  },
];

export const PARENT_MESSAGES = [
  {
    parent: 'Mrs. Rodriguez',
    student: 'Sofia R.',
    message: '¿Cómo va Sofia con las fracciones? Quiero ayudarla en casa.',
    time: '8:45 PM',
    avatar: 'SR',
  },
  {
    parent: 'Mr. Thompson',
    student: 'Marcus T.',
    message: 'Marcus said he found fractions hard today. Any practice sheets?',
    time: '7:30 PM',
    avatar: 'MT',
  },
  {
    parent: 'Mrs. Nguyen',
    student: 'Destiny M.',
    message: 'Destiny was absent yesterday. Did she miss important material?',
    time: '6:15 PM',
    avatar: 'DM',
  },
];
