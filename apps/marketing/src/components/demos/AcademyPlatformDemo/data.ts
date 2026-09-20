/**
 * Sample data for the Academy demo. Everything here is fictional — a made-up
 * course, made-up learners — shaped like the real platform's course workspace
 * (units → lessons → learning objectives, mastery, gaps, homework, mock exam).
 */

export type Mastery = 'none' | 'low' | 'developing' | 'strong';
export type LessonStatus = 'done' | 'in-progress' | 'not-started';

export interface DemoLesson {
  id: string;
  title: string;
  objective: string;
  minutes: number;
  status: LessonStatus;
  mastery: Mastery;
}

export interface DemoUnit {
  id: string;
  title: string;
  lessons: DemoLesson[];
}

export const COURSE = {
  title: 'Business Communication',
  level: 'BBA · Semester 2',
  teacher: { name: 'Ms. Kiara', style: 'Warm, example-led, asks before she tells' },
  learner: 'Aarav',
};

export const UNITS: DemoUnit[] = [
  {
    id: 'u1',
    title: 'Unit 1 · Foundations of Professional Communication',
    lessons: [
      { id: 'u1l1', title: 'The communication process', objective: 'Explain sender, message, channel, noise and feedback in a workplace exchange', minutes: 22, status: 'done', mastery: 'strong' },
      { id: 'u1l2', title: 'Audience analysis', objective: 'Adapt tone and detail to a manager, a client and a peer', minutes: 25, status: 'done', mastery: 'strong' },
      { id: 'u1l3', title: 'Barriers to communication', objective: 'Diagnose semantic, cultural and organisational barriers', minutes: 20, status: 'done', mastery: 'developing' },
      { id: 'u1l4', title: 'Active listening', objective: 'Apply paraphrasing and clarifying questions in a meeting', minutes: 18, status: 'done', mastery: 'strong' },
    ],
  },
  {
    id: 'u2',
    title: 'Unit 2 · Business Writing',
    lessons: [
      { id: 'u2l1', title: 'Writing a professional email', objective: 'Structure a request email with a clear subject, ask and deadline', minutes: 24, status: 'done', mastery: 'developing' },
      { id: 'u2l2', title: 'Reports and executive summaries', objective: 'Condense a 5-page report into a 150-word executive summary', minutes: 28, status: 'in-progress', mastery: 'low' },
      { id: 'u2l3', title: 'Persuasive proposals', objective: 'Build a proposal around problem, solution, proof and ask', minutes: 26, status: 'not-started', mastery: 'none' },
      { id: 'u2l4', title: 'Delivering bad news in writing', objective: 'Use the buffer–reason–news–goodwill pattern', minutes: 20, status: 'not-started', mastery: 'none' },
    ],
  },
  {
    id: 'u3',
    title: 'Unit 3 · Presentations & Interviews',
    lessons: [
      { id: 'u3l1', title: 'Structuring a presentation', objective: 'Open with a hook, signpost three points, close with an ask', minutes: 25, status: 'not-started', mastery: 'none' },
      { id: 'u3l2', title: 'Handling Q&A', objective: 'Bridge from a hostile question back to your message', minutes: 18, status: 'not-started', mastery: 'none' },
      { id: 'u3l3', title: 'Interview answers with STAR', objective: 'Answer behavioural questions with Situation–Task–Action–Result', minutes: 30, status: 'not-started', mastery: 'none' },
      { id: 'u3l4', title: 'Group discussions', objective: 'Enter, build on and summarise a group discussion', minutes: 22, status: 'not-started', mastery: 'none' },
    ],
  },
];

export const PROJECTION = { label: 'Course readiness', low: 68, high: 76, unit: '%' };

export const PACE = {
  goal: 'Semester exam · 12 Dec',
  status: 'On track' as const,
  detail: '5 of 12 lessons done · about 2 lessons a week keeps you on pace',
};

export const GAPS = [
  { lo: 'Executive summaries', evidence: 'Summaries ran long in 2 of 3 attempts — key finding buried in paragraph two.' },
  { lo: 'Barriers to communication', evidence: 'Mixed up semantic and cultural barriers in the last quiz.' },
];

export const REVIEW_DUE = [
  { lo: 'Audience analysis', due: 'Due today' },
  { lo: 'The communication process', due: 'Due in 2 days' },
];

export const NEXT_ACTION = {
  title: 'Continue: Reports and executive summaries',
  reason: 'You paused mid-lesson, and it is your top gap.',
  lessonId: 'u2l2',
};

export const HOMEWORK = {
  lo: 'Writing a professional email',
  reason: '“You nailed the structure, but your subject lines stayed vague. Four quick ones to sharpen them before we move to reports.”',
  assigned: 'Assigned Tue · Unit 2 · 4 questions',
};

export interface DrillQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export const DRILL: DrillQuestion[] = [
  {
    prompt: 'Which subject line best fits an email asking your manager to approve a budget by Friday?',
    options: ['Budget', 'Quick question', 'Approval needed by Fri: Q3 training budget (₹2.4L)', 'Hi'],
    answer: 2,
    explain: 'A strong subject line carries the ask, the deadline and the topic — the reader can act before opening.',
  },
  {
    prompt: 'A client email should open with…',
    options: ['Your full company history', 'The purpose of the email', 'An apology for writing', 'A joke'],
    answer: 1,
    explain: 'Lead with purpose. Context follows only as far as the reader needs it.',
  },
  {
    prompt: 'Where does the deadline belong in a request email?',
    options: ['Only in the signature', 'Nowhere — it sounds pushy', 'With the ask, stated once and clearly', 'In a follow-up email'],
    answer: 2,
    explain: 'The ask and its deadline travel together, so the reader never has to hunt for it.',
  },
];

export const OBJECTIVES = [
  { lo: 'The communication process', mastery: 'strong' as Mastery, last: '9/10 · 3 days ago', reviewDue: true },
  { lo: 'Audience analysis', mastery: 'strong' as Mastery, last: '8/10 · 6 days ago', reviewDue: true },
  { lo: 'Barriers to communication', mastery: 'developing' as Mastery, last: '6/10 · 5 days ago', reviewDue: false },
  { lo: 'Writing a professional email', mastery: 'developing' as Mastery, last: '7/10 · 2 days ago', reviewDue: false },
  { lo: 'Reports and executive summaries', mastery: 'low' as Mastery, last: '4/10 · yesterday', reviewDue: false },
];

export const QUIZZES = [
  { name: 'Unit 2 · Quiz A', state: 'Best 80%', history: [50, 70, 80], locked: false },
  { name: 'Unit 2 · Quiz B', state: 'Not attempted', history: [] as number[], locked: false },
  { name: 'Unit 2 · Unit Test', state: 'Unlocks after Quiz A + B', history: [] as number[], locked: true },
];

export interface MockQuestion {
  unit: string;
  prompt: string;
  options: string[];
  answer: number;
}

export const MOCK_EXAM = {
  title: 'Mid-semester mock · Form A',
  seconds: 8 * 60,
  questions: [
    { unit: 'Unit 1', prompt: 'A manager reads “ASAP” as “today”; the writer meant “this week”. Which barrier is this?', options: ['Physical', 'Semantic', 'Organisational', 'Emotional'], answer: 1 },
    { unit: 'Unit 1', prompt: 'Paraphrasing a colleague’s point before responding is a technique of…', options: ['Active listening', 'Persuasion', 'Grapevine communication', 'Noise reduction'], answer: 0 },
    { unit: 'Unit 1', prompt: 'When presenting quarterly results to the board, the detail level should be…', options: ['Every transaction', 'Headline outcomes with drill-down on request', 'Only good news', 'Identical to the team update'], answer: 1 },
    { unit: 'Unit 2', prompt: 'An executive summary should primarily…', options: ['Introduce the author', 'List every data table', 'State the finding and the recommendation', 'Repeat the table of contents'], answer: 2 },
    { unit: 'Unit 2', prompt: 'The buffer–reason–news–goodwill pattern is used for…', options: ['Sales pitches', 'Bad-news messages', 'Meeting minutes', 'Cover letters'], answer: 1 },
  ] as MockQuestion[],
};

export const NOTES = {
  lesson: 'Writing a professional email',
  detailed: [
    { heading: 'The four parts of a request email', body: 'Subject line that carries the ask · one-line purpose · the context the reader needs (and no more) · the ask with its deadline, stated once.' },
    { heading: 'What we worked through', body: 'You rewrote “Budget” as “Approval needed by Fri: Q3 training budget”. Ms. Kiara pointed out that the second version lets a busy manager act from the inbox view.' },
    { heading: 'Your common slip', body: 'Apologising in the opening line (“Sorry to bother you…”). It delays the purpose and weakens the ask. Replace it with the purpose itself.' },
  ],
  revision: [
    'Subject = ask + deadline + topic',
    'Line 1 = purpose. No apology openers',
    'Context: only what the reader needs to decide',
    'Ask + deadline together, once',
    'Close with the next step, not “let me know”',
  ],
};

export const PARENT_REPORT = {
  week: 'Week of 8–14 Sep',
  to: 'Sponsor / parent of Aarav',
  stats: [
    { label: 'Tutoring time', value: '1h 48m' },
    { label: 'Days active', value: '4 of 7' },
    { label: 'Lessons', value: '3' },
    { label: 'Practice questions', value: '27' },
  ],
  nailed: ['Audience analysis — adapted one message for three readers without prompting', 'Active listening — paraphrased accurately in the role-play'],
  stuck: ['Executive summaries — still burying the recommendation'],
  resolved: ['Subject lines — vague last week, specific this week'],
  note: 'Aarav is quick once he sees an example, so I have been leading with one. Next week we finish reports, then start proposals. A short summary-writing exercise is waiting in his practice tab.',
  teacher: 'Ms. Kiara',
};

export type FunnelStage = 'signed up' | 'enrolled' | 'first session' | 'engaged';

export interface RosterStudent {
  name: string;
  joined: string;
  source: string;
  stage: FunnelStage;
  sessions: number;
  hours: string;
  lastSeen: string;
  access: string;
}

export const ROSTER: RosterStudent[] = [
  { name: 'Aarav M.', joined: '02 Sep', source: 'Campus code BBA-2', stage: 'engaged', sessions: 9, hours: '4.2h', lastSeen: 'Today', access: 'Full' },
  { name: 'Diya K.', joined: '02 Sep', source: 'Campus code BBA-2', stage: 'engaged', sessions: 7, hours: '3.1h', lastSeen: 'Yesterday', access: 'Full' },
  { name: 'Kabir S.', joined: '03 Sep', source: 'Campus code BBA-2', stage: 'first session', sessions: 1, hours: '0.4h', lastSeen: '6 days ago', access: 'Full' },
  { name: 'Meera R.', joined: '05 Sep', source: 'Referral', stage: 'engaged', sessions: 5, hours: '2.6h', lastSeen: 'Today', access: 'Full' },
  { name: 'Rohan T.', joined: '06 Sep', source: 'Website', stage: 'enrolled', sessions: 0, hours: '0h', lastSeen: '9 days ago', access: 'Trial' },
  { name: 'Sana P.', joined: '08 Sep', source: 'Campus code MBA-1', stage: 'engaged', sessions: 6, hours: '3.4h', lastSeen: '2 days ago', access: 'Full' },
  { name: 'Vikram J.', joined: '10 Sep', source: 'Website', stage: 'signed up', sessions: 0, hours: '0h', lastSeen: '5 days ago', access: 'Trial' },
  { name: 'Zoya H.', joined: '11 Sep', source: 'Campus code MBA-1', stage: 'first session', sessions: 2, hours: '0.9h', lastSeen: 'Yesterday', access: 'Full' },
];

export const ROSTER_SESSIONS = [
  { when: 'Today 10:12', lesson: 'Reports and executive summaries', status: 'Paused', time: '18 min', coverage: '3 of 5 parts' },
  { when: 'Sat 17:40', lesson: 'Writing a professional email', status: 'Completed', time: '24 min', coverage: '5 of 5 parts' },
  { when: 'Thu 19:05', lesson: 'Active listening', status: 'Completed', time: '19 min', coverage: '4 of 4 parts' },
];
