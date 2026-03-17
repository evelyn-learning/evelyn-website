'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import { DemoTrackingProvider, useTrackInteraction } from '@/components/demos/DemoTrackingContext';
import {
  Lock, Eye, FileText, Presentation, ChevronRight, ChevronLeft, ArrowRight,
  Users, Clock, CheckCircle, AlertCircle, Edit3, Download,
  Sparkles, BookOpen, GraduationCap, Brain, Star,
  UserCheck, ClipboardList, Zap, Settings,
  MessageSquare, Search, Filter, PlusCircle, ChevronDown, ChevronUp,
  Play, Check, Loader2, Copy, FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';

/* ─────────────── Brand Palette ─────────────── */
const HUGO = {
  primary: '#1B3A5C',
  primaryLight: '#2B5A8C',
  primaryDark: '#0F2440',
  gold: '#D4A853',
  goldLight: '#E8C97D',
  accent: '#2B6CB0',
  success: '#38A169',
  warning: '#DD6B20',
  danger: '#E53E3E',
  bg: '#F7FAFC',
  cardBg: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
};

const EL = {
  purple: '#7a2a8e',
  purpleLight: '#9B4DB5',
};

/* ─────────────── Types ─────────────── */
interface SurveyResponse {
  category: string;
  questions: { q: string; a: string }[];
}

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: string;
  status: 'new' | 'in_progress' | 'generated' | 'approved';
  submittedDate: string;
  mentor?: string;
  avatar: string;
  survey: SurveyResponse[];
  report?: ReportSection[];
}

interface ReportSection {
  title: string;
  content: string;
}

/* ─────────────── Survey Template (for new survey form) ─────────────── */
const SURVEY_TEMPLATE: { category: string; questions: { q: string; type: 'text' | 'textarea' | 'select' | 'rating'; options?: string[]; }[] }[] = [
  {
    category: 'Academic Profile',
    questions: [
      { q: 'Current GPA range', type: 'select', options: ['Below 3.0', '3.0 - 3.4', '3.5 - 3.7', '3.7 - 3.8', '3.8 - 3.9', '3.9 - 4.0 (Unweighted)', '4.0+ (Weighted)'] },
      { q: 'AP/Honors courses taken', type: 'textarea' },
      { q: 'Primary academic interests', type: 'textarea' },
      { q: 'Academic strengths (self-identified)', type: 'textarea' },
    ],
  },
  {
    category: 'Research Experience',
    questions: [
      { q: 'Previous research experience', type: 'textarea' },
      { q: 'Research skills and tools', type: 'textarea' },
      { q: 'Publications or presentations', type: 'textarea' },
    ],
  },
  {
    category: 'Goals & Aspirations',
    questions: [
      { q: 'Why are you seeking mentorship?', type: 'textarea' },
      { q: 'College and career goals', type: 'textarea' },
      { q: 'What do you hope to gain?', type: 'textarea' },
    ],
  },
  {
    category: 'Learning Preferences',
    questions: [
      { q: 'Preferred meeting frequency', type: 'select', options: ['Weekly (1 hour)', 'Weekly (90 minutes)', 'Bi-weekly (1 hour)', 'Bi-weekly (90 minutes)', 'Monthly'] },
      { q: 'Communication style preference', type: 'textarea' },
      { q: 'Feedback preferences', type: 'textarea' },
    ],
  },
  {
    category: 'Self-Assessment (1-5 scale)',
    questions: [
      { q: 'Analytical thinking', type: 'rating' },
      { q: 'Scientific writing', type: 'rating' },
      { q: 'Time management', type: 'rating' },
      { q: 'Creativity / original thinking', type: 'rating' },
      { q: 'Presentation skills', type: 'rating' },
    ],
  },
];

/* ─────────────── Pre-fill data for the new survey ─────────────── */
const NEW_SURVEY_PREFILL: Record<string, string> = {
  'student_name': 'Sofia Martinez',
  'student_school': 'Brooklyn Technical High School',
  'student_grade': '11th',
  'Academic Profile__Current GPA range': '3.9 - 4.0 (Unweighted)',
  'Academic Profile__AP/Honors courses taken': 'AP Biology, AP English Language, AP World History, Honors Organic Chemistry',
  'Academic Profile__Primary academic interests': 'Marine biology, environmental conservation, and oceanographic research',
  'Academic Profile__Academic strengths (self-identified)': 'Scientific observation, field research documentation, persuasive writing, data collection methods',
  'Research Experience__Previous research experience': 'Volunteered at the New York Aquarium assisting with coral reef health monitoring over two summers. Maintained field observation logs and helped with water quality data collection for an ongoing study on local marine ecosystems in Jamaica Bay.',
  'Research Experience__Research skills and tools': 'Field observation protocols, water quality testing (pH, salinity, dissolved oxygen), data logging in Excel, species identification guides, scientific photography',
  'Research Experience__Publications or presentations': 'Presented a poster on Jamaica Bay water quality trends at the school science symposium. Wrote a feature article for the school magazine on urban marine conservation.',
  'Goals & Aspirations__Why are you seeking mentorship?': 'I want to design and conduct a real research study on how urban runoff affects coral and shellfish health in the New York Bight. I need guidance from a marine scientist who can help me develop proper sampling protocols, statistical analysis methods, and mentor me through the scientific writing process.',
  'Goals & Aspirations__College and career goals': 'Hoping to study marine biology or environmental science at Woods Hole-affiliated programs, UC Santa Barbara, or University of Miami. Long-term dream is to work on coral reef restoration projects or lead marine conservation research.',
  'Goals & Aspirations__What do you hope to gain?': 'A completed research paper that could be submitted to a student journal, hands-on field research experience under expert guidance, and a letter of recommendation from a professor in marine science.',
  'Learning Preferences__Preferred meeting frequency': 'Weekly (1 hour)',
  'Learning Preferences__Communication style preference': 'I love hands-on learning and field work. I learn best when I can see and do things, not just read about them. I appreciate mentors who share real stories from their research experiences.',
  'Learning Preferences__Feedback preferences': 'I prefer feedback that shows me examples of what good work looks like, along with specific suggestions. Positive encouragement helps me push through challenging moments.',
  'Self-Assessment (1-5 scale)__Analytical thinking': '4',
  'Self-Assessment (1-5 scale)__Scientific writing': '3',
  'Self-Assessment (1-5 scale)__Time management': '4',
  'Self-Assessment (1-5 scale)__Creativity / original thinking': '5',
  'Self-Assessment (1-5 scale)__Presentation skills': '3',
};

/* ─────────────── Existing Students ─────────────── */
const STUDENTS: StudentData[] = [
  {
    id: '1',
    name: 'Maya Chen',
    school: 'Stuyvesant High School',
    grade: '11th',
    status: 'new',
    submittedDate: '2026-01-28',
    avatar: 'MC',
    survey: [
      {
        category: 'Academic Profile',
        questions: [
          { q: 'Current GPA range', a: '3.9 - 4.0 (Unweighted)' },
          { q: 'AP/Honors courses taken', a: 'AP Biology, AP Chemistry, AP Psychology, Honors Statistics' },
          { q: 'Primary academic interests', a: 'Neuroscience, cognitive psychology, and behavioral research' },
          { q: 'Academic strengths (self-identified)', a: 'Analytical writing, experimental design, data interpretation' },
        ],
      },
      {
        category: 'Research Experience',
        questions: [
          { q: 'Previous research experience', a: 'Completed a semester-long independent study on memory consolidation during sleep under my biology teacher\'s guidance. Also participated in a summer science program at Columbia University.' },
          { q: 'Research skills and tools', a: 'Literature review, basic statistical analysis (SPSS), lab notebook documentation, scientific writing (IMRaD format)' },
          { q: 'Publications or presentations', a: 'Presented poster at school science fair (2nd place). No formal publications yet.' },
        ],
      },
      {
        category: 'Goals & Aspirations',
        questions: [
          { q: 'Why are you seeking mentorship?', a: 'I want to conduct a rigorous research project on how sleep deprivation affects adolescent cognitive performance, specifically working memory and decision-making. I need guidance from someone with expertise in neuroscience research methodology.' },
          { q: 'College and career goals', a: 'Aspiring to study neuroscience at a top research university (MIT, Stanford, or Johns Hopkins). Long-term goal is to become a research scientist studying brain health.' },
          { q: 'What do you hope to gain?', a: 'A publishable research paper, stronger research methodology skills, and a meaningful recommendation from a professor in my field of interest.' },
        ],
      },
      {
        category: 'Learning Preferences',
        questions: [
          { q: 'Preferred meeting frequency', a: 'Weekly (1 hour sessions)' },
          { q: 'Communication style preference', a: 'I prefer structured agendas with clear milestones, but I also appreciate room for open-ended discussion when exploring new ideas.' },
          { q: 'Feedback preferences', a: 'Direct and detailed feedback. I want to know exactly what needs improvement and why.' },
        ],
      },
      {
        category: 'Self-Assessment (1-5 scale)',
        questions: [
          { q: 'Analytical thinking', a: '5 - I enjoy breaking down complex problems and finding patterns in data' },
          { q: 'Scientific writing', a: '4 - Strong but want to improve technical writing for peer-reviewed publication' },
          { q: 'Time management', a: '4 - Generally good with deadlines, occasionally need reminders for long-term projects' },
          { q: 'Creativity / original thinking', a: '3 - I\'m better at systematic analysis than generating novel hypotheses, which is something I want to develop' },
          { q: 'Presentation skills', a: '3 - Comfortable presenting to classmates but nervous about formal academic presentations' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'James Rodriguez',
    school: 'Phillips Exeter Academy',
    grade: '12th',
    status: 'in_progress',
    submittedDate: '2026-01-25',
    mentor: 'Dr. Sarah Williams (Yale, Environmental Policy)',
    avatar: 'JR',
    survey: [
      {
        category: 'Academic Profile',
        questions: [
          { q: 'Current GPA range', a: '3.7 - 3.8 (Unweighted)' },
          { q: 'AP/Honors courses taken', a: 'AP Environmental Science, AP US Government, AP Economics, Honors Urban Studies' },
          { q: 'Primary academic interests', a: 'Environmental policy, urban planning, climate adaptation' },
          { q: 'Academic strengths (self-identified)', a: 'Policy analysis, persuasive writing, connecting interdisciplinary concepts' },
        ],
      },
      {
        category: 'Research Experience',
        questions: [
          { q: 'Previous research experience', a: 'Interned at a local city council office researching urban green space policies. Wrote a 15-page policy brief on heat island mitigation for the town planning board.' },
          { q: 'Research skills and tools', a: 'Policy analysis frameworks, GIS mapping (basic), interview/survey design, qualitative data analysis' },
          { q: 'Publications or presentations', a: 'Policy brief presented to town planning board. Op-ed published in school newspaper on campus sustainability.' },
        ],
      },
      {
        category: 'Goals & Aspirations',
        questions: [
          { q: 'Why are you seeking mentorship?', a: 'I want to develop a comprehensive research project analyzing urban heat island mitigation strategies across US cities, comparing policy effectiveness. Need academic guidance on research methodology for environmental policy.' },
          { q: 'College and career goals', a: 'Targeting Yale, Georgetown, or Columbia for environmental studies/policy. Career goal is to work in urban sustainability policy, potentially at the EPA or a think tank.' },
          { q: 'What do you hope to gain?', a: 'A deep-dive research paper worthy of a writing supplement, stronger quantitative analysis skills, and connections in the environmental policy field.' },
        ],
      },
      {
        category: 'Learning Preferences',
        questions: [
          { q: 'Preferred meeting frequency', a: 'Bi-weekly (90-minute sessions)' },
          { q: 'Communication style preference', a: 'I learn best through discussion and debate. I like when mentors challenge my assumptions and push me to consider alternative perspectives.' },
          { q: 'Feedback preferences', a: 'Big-picture feedback first, then details. I like understanding the "why" behind suggestions.' },
        ],
      },
      {
        category: 'Self-Assessment (1-5 scale)',
        questions: [
          { q: 'Analytical thinking', a: '4 - Strong with qualitative analysis, developing quantitative skills' },
          { q: 'Scientific writing', a: '4 - Experienced with policy writing, learning to adapt to academic format' },
          { q: 'Time management', a: '3 - Balancing sports and extracurriculars makes scheduling challenging' },
          { q: 'Creativity / original thinking', a: '5 - I excel at connecting ideas across disciplines and proposing novel policy solutions' },
          { q: 'Presentation skills', a: '5 - Comfortable speaking to various audiences including town officials' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Aisha Patel',
    school: 'Bronx High School of Science',
    grade: '11th',
    status: 'generated',
    submittedDate: '2026-01-20',
    mentor: 'Prof. David Liu (NYU, Computer Science & Ethics)',
    avatar: 'AP',
    survey: [
      {
        category: 'Academic Profile',
        questions: [
          { q: 'Current GPA range', a: '4.0+ (Weighted)' },
          { q: 'AP/Honors courses taken', a: 'AP Computer Science A, AP Statistics, AP Calculus BC, Honors Philosophy' },
          { q: 'Primary academic interests', a: 'AI ethics, algorithmic fairness, computational social science' },
          { q: 'Academic strengths (self-identified)', a: 'Programming (Python, Java), logical reasoning, ethical argumentation' },
        ],
      },
      {
        category: 'Research Experience',
        questions: [
          { q: 'Previous research experience', a: 'Built a Python tool that audits machine learning model predictions for demographic bias. Won 3rd place at NYC Science & Engineering Fair. Currently reading extensively on fairness in AI.' },
          { q: 'Research skills and tools', a: 'Python (scikit-learn, pandas, matplotlib), experimental design, technical documentation, peer review' },
          { q: 'Publications or presentations', a: 'Science fair presentation, school tech blog articles on AI ethics topics' },
        ],
      },
      {
        category: 'Goals & Aspirations',
        questions: [
          { q: 'Why are you seeking mentorship?', a: 'I want to investigate algorithmic bias in college admissions AI systems. I need guidance on research ethics, proper methodology for studying algorithmic fairness, and help designing experiments that can produce meaningful results.' },
          { q: 'College and career goals', a: 'Aiming for MIT, Carnegie Mellon, or Stanford for CS with a focus on AI ethics. Long-term: building fair AI systems or working in tech policy.' },
          { q: 'What do you hope to gain?', a: 'A rigorous research paper combining computer science and ethics, experience working with a professor in the field, and clarity on how to pursue this interdisciplinary path.' },
        ],
      },
      {
        category: 'Learning Preferences',
        questions: [
          { q: 'Preferred meeting frequency', a: 'Weekly (1 hour sessions)' },
          { q: 'Communication style preference', a: 'I like a mix of structured guidance and independent exploration. I appreciate being pointed to resources and then having time to work through them before discussing.' },
          { q: 'Feedback preferences', a: 'Balanced - I want both positive reinforcement and constructive criticism. Written feedback I can review later is especially helpful.' },
        ],
      },
      {
        category: 'Self-Assessment (1-5 scale)',
        questions: [
          { q: 'Analytical thinking', a: '5 - Strong logical and computational thinking skills' },
          { q: 'Scientific writing', a: '3 - Technical writing is good but academic paper writing is new to me' },
          { q: 'Time management', a: '5 - Very organized, use project management tools for my personal projects' },
          { q: 'Creativity / original thinking', a: '4 - Good at seeing connections between technology and social impact' },
          { q: 'Presentation skills', a: '4 - Comfortable with technical presentations, less experienced with policy audiences' },
        ],
      },
    ],
    report: [
      { title: 'Executive Summary', content: 'Aisha Patel is an exceptionally motivated 11th-grade student at Bronx High School of Science who demonstrates a rare combination of advanced technical skills and deep ethical awareness. Her interest in algorithmic fairness, particularly in educational contexts, represents a sophisticated and timely research direction. With her existing programming capabilities and analytical mindset, Aisha is well-positioned for a rigorous research mentorship that bridges computer science and social justice.' },
      { title: 'Student Profile & Context', content: 'Aisha maintains a 4.0+ weighted GPA while pursuing an ambitious course load spanning computer science, mathematics, and philosophy. Her interdisciplinary academic profile reflects a student who naturally synthesizes technical and humanistic perspectives — a critical skill for her chosen research area. Her participation in AP Computer Science A and AP Statistics provides her with the foundational quantitative toolkit necessary for AI fairness research, while her Honors Philosophy coursework equips her with frameworks for ethical reasoning.' },
      { title: 'Interest & Aptitude Analysis', content: 'Aisha\'s self-directed work building a bias-auditing tool in Python demonstrates initiative well beyond her grade level. Her 3rd place finish at the NYC Science & Engineering Fair validates the quality of her technical work. Self-assessment scores reveal a student who is highly self-aware: she correctly identifies scientific writing as an area for growth while recognizing her exceptional strengths in analytical thinking and time management. This self-awareness will accelerate her development during mentorship.' },
      { title: 'Research Readiness Assessment', content: 'STRENGTHS: Strong programming foundation in Python with relevant ML libraries; demonstrated ability to design and execute independent technical projects; genuine intellectual curiosity about AI ethics evidenced by extensive self-directed reading; excellent organizational skills and time management.\n\nAREAS FOR DEVELOPMENT: Transitioning from technical documentation to academic paper writing (IMRaD format); developing formal research ethics knowledge (IRB processes, human subjects considerations); strengthening qualitative research methods for studying social impacts; building experience communicating technical findings to non-technical audiences.' },
      { title: 'Recommended Research Directions', content: '1. PRIMARY RECOMMENDATION: "Auditing Algorithmic Fairness in College Admissions AI" — A systematic study examining publicly available or simulated admissions AI systems for demographic bias, combining computational analysis with ethical framework evaluation. This directly aligns with Aisha\'s stated interests and existing skills.\n\n2. ALTERNATIVE: "Designing Fair-by-Design Educational Assessment Tools" — A constructive approach to building assessment algorithms that incorporate fairness constraints from the ground up, allowing Aisha to both critique existing systems and propose improvements.\n\n3. EXPLORATORY: "Student Perspectives on AI in Education: A Mixed-Methods Study" — Combining Aisha\'s technical knowledge with survey research to understand how students perceive and are affected by AI decision-making in educational settings.' },
      { title: 'Suggested Mentor Match Profile', content: 'Aisha would benefit most from a mentor who: (1) has active research in AI fairness, algorithmic accountability, or computational social science; (2) can guide her through the academic paper writing process; (3) has experience with interdisciplinary research bridging CS and social science; (4) can challenge her technically while supporting her growth in academic communication.\n\nIdeal mentor profile: Assistant or Associate Professor in Computer Science or Information Science with a focus on responsible AI, preferably at a university Aisha is considering for college (MIT, CMU, Stanford) to provide both mentorship and institutional insight.' },
      { title: 'Personalized Development Plan', content: 'WEEKS 1-3: Literature review of key AI fairness papers (Buolamwini & Gebru, Chouldechova, etc.) and research question refinement.\nWEEKS 4-6: Research methodology design including data collection strategy, fairness metric selection, and ethics considerations.\nWEEKS 7-10: Data collection and computational analysis, with regular mentor check-ins on methodology.\nWEEKS 11-14: Results analysis, interpretation, and first draft of research paper.\nWEEKS 15-17: Paper revision based on mentor feedback, preparation of presentation materials.\nWEEK 18: Final paper submission and presentation to mentor and peers.\n\nMILESTONES: Literature review summary (Week 3), methodology proposal (Week 6), preliminary results (Week 10), final paper (Week 18).' },
    ],
  },
  {
    id: '4',
    name: 'Ethan Kim',
    school: 'Dalton School',
    grade: '12th',
    status: 'approved',
    submittedDate: '2026-01-15',
    mentor: 'Dr. Rachel Foster (Columbia, Behavioral Economics)',
    avatar: 'EK',
    survey: [
      {
        category: 'Academic Profile',
        questions: [
          { q: 'Current GPA range', a: '3.8 - 3.9 (Unweighted)' },
          { q: 'AP/Honors courses taken', a: 'AP Macroeconomics, AP Microeconomics, AP Statistics, Honors Behavioral Science' },
          { q: 'Primary academic interests', a: 'Behavioral economics, financial literacy, decision science' },
          { q: 'Academic strengths (self-identified)', a: 'Statistical analysis, survey design, connecting economic theory to real-world behavior' },
        ],
      },
      {
        category: 'Research Experience',
        questions: [
          { q: 'Previous research experience', a: 'Designed and administered a survey of 200+ high school students about financial decision-making habits for an economics class project. Analyzed results using Excel and basic regression analysis.' },
          { q: 'Research skills and tools', a: 'Survey design (Google Forms, Qualtrics), Excel/Sheets (advanced), basic R programming, data visualization' },
          { q: 'Publications or presentations', a: 'Presented findings to school economics department. Blog post on personal finance for teens on Medium (500+ views).' },
        ],
      },
      {
        category: 'Goals & Aspirations',
        questions: [
          { q: 'Why are you seeking mentorship?', a: 'I want to conduct a formal study on how financial literacy education affects actual spending and saving behavior in teenagers. Need guidance on designing a proper experiment with control groups and longitudinal tracking.' },
          { q: 'College and career goals', a: 'Columbia or UPenn for economics/behavioral science. Aspire to work in financial policy or start a fintech company focused on teen financial health.' },
          { q: 'What do you hope to gain?', a: 'A well-designed behavioral study I can reference in college applications, stronger research methodology skills, and insight into what academic research in behavioral economics looks like day-to-day.' },
        ],
      },
      {
        category: 'Learning Preferences',
        questions: [
          { q: 'Preferred meeting frequency', a: 'Weekly (1 hour sessions)' },
          { q: 'Communication style preference', a: 'I like practical, hands-on guidance. I prefer working through real examples and data rather than purely theoretical discussion.' },
          { q: 'Feedback preferences', a: 'Quick, actionable feedback. I\'d rather get frequent small corrections than one big round of feedback at the end.' },
        ],
      },
      {
        category: 'Self-Assessment (1-5 scale)',
        questions: [
          { q: 'Analytical thinking', a: '4 - Strong quantitative reasoning, still building more advanced statistical skills' },
          { q: 'Scientific writing', a: '3 - Good writer overall but new to academic economic writing conventions' },
          { q: 'Time management', a: '4 - Well-organized, use calendars and project tracking tools' },
          { q: 'Creativity / original thinking', a: '4 - Good at designing experiments and asking interesting research questions' },
          { q: 'Presentation skills', a: '4 - Confident presenter, experienced with data-driven presentations' },
        ],
      },
    ],
    report: [
      { title: 'Executive Summary', content: 'Ethan Kim is an ambitious 12th-grade student at the Dalton School with a demonstrated passion for understanding the intersection of economics and human behavior. His prior experience designing and administering surveys to hundreds of students, combined with his growing analytical skills, positions him well for a research mentorship in behavioral economics. His proposed study on financial literacy education\'s impact on teen behavior is both personally meaningful and academically rigorous.' },
      { title: 'Student Profile & Context', content: 'Ethan brings a strong foundation in both micro and macroeconomics through his AP coursework, complemented by practical experience in survey design and data analysis. His coursework in Honors Behavioral Science provides the theoretical grounding needed to understand the psychological mechanisms behind financial decision-making. His 3.8-3.9 unweighted GPA across challenging coursework demonstrates consistent academic dedication. Notably, his initiative in publishing a Medium blog post about personal finance for teens shows an entrepreneurial mindset and genuine desire to make economic knowledge accessible.' },
      { title: 'Interest & Aptitude Analysis', content: 'Ethan\'s strongest asset is his practical orientation — he consistently connects theoretical knowledge to real-world applications. His survey of 200+ students demonstrates both the initiative and logistical skills needed for primary research. Self-assessment reveals a realistic awareness of his strengths (quantitative reasoning, experimental design) and growth areas (advanced statistics, academic writing conventions). His preference for hands-on, iterative feedback suggests he will thrive in an active mentorship with regular deliverables and check-ins.' },
      { title: 'Research Readiness Assessment', content: 'STRENGTHS: Proven ability to design and deploy large-scale surveys; strong quantitative foundation with growth mindset toward advanced methods; genuine personal motivation for the research topic; practical experience with data tools (Excel, basic R); entrepreneurial thinking that will serve well in research design.\n\nAREAS FOR DEVELOPMENT: Advancing from basic to intermediate statistical methods (regression, significance testing, effect sizes); learning experimental design principles (randomization, control groups, pre/post measurement); developing academic writing skills for economics journals; understanding IRB/ethics considerations for human subjects research.' },
      { title: 'Recommended Research Directions', content: '1. PRIMARY RECOMMENDATION: "The Impact of Structured Financial Literacy Programs on Adolescent Spending Behavior: A Quasi-Experimental Study" — A pre-post study comparing students who complete a financial literacy module versus a control group, measuring changes in self-reported spending, saving, and budgeting behaviors over 8-12 weeks.\n\n2. ALTERNATIVE: "Nudging Teens Toward Better Financial Decisions: A Behavioral Design Study" — Designing and testing behavioral nudges (e.g., savings goal visualization, spending alerts) on a sample of high school students to measure impact on financial behavior.\n\n3. EXPLORATORY: "Peer Effects on Teen Financial Decision-Making: A Social Network Analysis" — Investigating how peer groups influence financial attitudes and behaviors among adolescents using network analysis methods.' },
      { title: 'Suggested Mentor Match Profile', content: 'Ethan would benefit most from a mentor who: (1) has expertise in behavioral economics or financial decision-making research; (2) can provide practical guidance on experimental design and statistical analysis; (3) has experience working with human subjects research and IRB processes; (4) appreciates and can channel Ethan\'s entrepreneurial energy into rigorous academic inquiry.\n\nIdeal mentor profile: Professor or researcher in economics, behavioral science, or financial psychology at Columbia or UPenn (aligning with his college interests), preferably someone who has published in applied behavioral economics.' },
      { title: 'Personalized Development Plan', content: 'WEEKS 1-2: Review of key behavioral economics literature (Thaler, Kahneman, Lusardi) and refinement of research question.\nWEEKS 3-4: Experimental design workshop — defining variables, control groups, measurement instruments, and timeline.\nWEEKS 5-6: Survey/instrument development with mentor review and pilot testing.\nWEEKS 7-10: Data collection phase with regular check-ins on methodology and challenges.\nWEEKS 11-13: Statistical analysis of results using R, with mentor guidance on appropriate tests.\nWEEKS 14-16: Paper drafting with iterative feedback.\nWEEKS 17-18: Final revision and presentation preparation.\n\nMILESTONES: Research design proposal (Week 4), instrument finalization (Week 6), preliminary data report (Week 10), final paper (Week 18).' },
    ],
  },
];

/* ─────────────── Case Study Slides Data ─────────────── */
interface Slide {
  type: 'title' | 'section' | 'content' | 'stats' | 'comparison' | 'questions' | 'closing';
  title?: string;
  subtitle?: string;
  content?: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  bgColor?: string;
  columns?: { title: string; items: string[] }[];
}

const SLIDES: Slide[] = [
  { type: 'title', title: 'Transforming Student Assessments with AI', subtitle: 'How Evelyn Learning builds intelligent report generation systems for education', content: 'Prepared for Hugo Mentors  |  Evelyn Learning' },
  { type: 'content', title: 'Our Understanding of Hugo Mentors', bullets: [
    'Hugo Mentors connects intellectually curious high school students with university professors for personalized 1:1 research mentorship experiences',
    'Reviewers currently copy/paste student survey data, run ad-hoc LLM queries, and manually assemble individualized narrative reports',
    'The goal: a streamlined, reliable, reviewer-friendly web-based system that generates individualized reports from survey responses automatically',
    'This system must maintain the personalized, high-quality narrative voice that Hugo Mentors is known for — automation should enhance quality, not dilute it',
  ]},
  { type: 'section', title: 'Case Study 1', subtitle: 'Pathways Academy Network', content: 'Automating Narrative Progress Reports for a K-12 Charter School Network', bgColor: '#1B3A5C' },
  { type: 'content', title: 'Pathways Academy — The Challenge', bullets: [
    'Network of 15 charter schools serving 3,200+ students across three states',
    'Teachers spent 8-12 hours per reporting cycle writing individualized narrative progress reports for each student',
    'Inconsistent quality and voice across schools — some reports were detailed and insightful, others were generic and formulaic',
    'Parents repeatedly requested richer, more actionable feedback about their children\'s learning journey',
    'School leaders needed standardized quality without losing the personal touch that differentiated them from traditional schools',
  ]},
  { type: 'stats', title: 'Pathways Academy — The Results', subtitle: 'After implementing AI-powered narrative report generation', stats: [
    { value: '85%', label: 'Reduction in report writing time per student' },
    { value: '94%', label: 'Parent satisfaction with report quality (up from 71%)' },
    { value: '3,200+', label: 'Individualized reports generated per semester' },
    { value: '99.2%', label: 'Reports approved by teachers with minor or no edits' },
  ], bullets: [
    'System ingests rubric-based assessments, classroom observation notes, and assignment grades to generate rich narrative paragraphs',
    'Teachers review and personalize AI-generated drafts rather than writing from scratch',
    'Built-in style guide ensures consistent professional voice across all 15 schools while preserving teacher personality',
  ]},
  { type: 'section', title: 'Case Study 2', subtitle: 'ResearchConnect University Program', content: 'Intelligent Mentorship Matching & Automated Progress Evaluations', bgColor: '#2B6CB0' },
  { type: 'content', title: 'ResearchConnect — The Challenge', bullets: [
    'Top-20 university research mentorship program pairing 500+ undergraduates with faculty each semester',
    'Matching process was manual — coordinators reviewed applications, emailed faculty, and tracked responses in spreadsheets',
    'Mid-term and final evaluations required faculty to write detailed narrative assessments, with high variance in completion rates and quality',
    'Program coordinators spent 60% of their time on administrative tasks instead of supporting student-mentor relationships',
    'Students received generic feedback that didn\'t help them understand their specific growth trajectory',
  ]},
  { type: 'stats', title: 'ResearchConnect — The Results', subtitle: 'After implementing the survey-driven matching and evaluation system', stats: [
    { value: '3x', label: 'Faster mentor matching process (5 days → <2 days)' },
    { value: '97%', label: 'Faculty evaluation completion rate (up from 68%)' },
    { value: '40%', label: 'Increase in student satisfaction with evaluations' },
    { value: '60%', label: 'Reduction in coordinator administrative workload' },
  ], bullets: [
    'Survey-based matching algorithm considers research interests, learning style preferences, availability, and personality compatibility',
    'AI pre-generates evaluation narratives from structured faculty input, which faculty then review and approve',
    'Students receive rich, multi-section reports covering research skills, communication growth, and personalized recommendations',
  ]},
  { type: 'section', title: 'Case Study 3', subtitle: 'LearnPath Global', content: 'Personalized Learning Narratives at Scale for an Online Education Platform', bgColor: '#38A169' },
  { type: 'content', title: 'LearnPath Global — The Challenge', bullets: [
    'Online learning platform serving 50,000+ students with adaptive coursework in STEM and humanities',
    'Students received only numerical scores and generic completion badges — no narrative explanation of their learning journey',
    'Parents and school partners demanded richer reporting that explained what students had learned, how they learned it, and what to focus on next',
    'Content team manually wrote "learning summaries" for premium tier — capped at 200 students due to bandwidth',
    'Needed to scale personalized narrative feedback to all 50,000+ students without adding headcount',
  ]},
  { type: 'stats', title: 'LearnPath Global — The Results', subtitle: 'After deploying AI-generated individualized learning narratives', stats: [
    { value: '50,000+', label: 'Students receiving personalized narrative reports' },
    { value: '41%', label: 'Increase in course completion rates' },
    { value: '4.7/5', label: 'Average parent rating of report usefulness' },
    { value: '$0', label: 'Additional headcount cost to scale narratives' },
  ], bullets: [
    'System analyzes assessment data, learning patterns, time-on-task, and error patterns to generate individualized narratives',
    'Reports include strength areas, challenge areas, recommended next courses, and motivational messaging tailored to student personality profiles',
    'School partners receive aggregated class-level narrative summaries alongside individual student reports',
  ]},
  { type: 'section', title: 'Case Study 4', subtitle: 'BrightMinds Youth Mentorship', content: 'Survey-Driven Report Generation for a Mentorship Nonprofit', bgColor: '#D4A853' },
  { type: 'content', title: 'BrightMinds — The Challenge', subtitle: 'The scenario most similar to Hugo Mentors', bullets: [
    'Youth mentorship nonprofit pairing 800 high school students annually with professional mentors across 12 cities',
    'Program counselors spent 6+ hours per student writing individualized development reports based on student surveys, mentor feedback, and session notes',
    'Reports were critical for funding applications, parent communications, and student college applications',
    'Quality varied significantly based on which counselor wrote the report — some were exceptional, others were thin',
    'Total annual report writing consumed 4,800+ counselor hours that could have been spent on direct student support',
  ]},
  { type: 'stats', title: 'BrightMinds — The Results', subtitle: 'After implementing the AI-powered report generation system', stats: [
    { value: '72%', label: 'Time savings on report generation per student' },
    { value: '800', label: 'Individualized reports generated per cycle' },
    { value: '4.8/5', label: 'Counselor satisfaction with report quality' },
    { value: '3,400+', label: 'Counselor hours redirected to student support annually' },
  ], bullets: [
    'Student intake surveys, mentor session summaries, and milestone tracking data feed into an AI system that drafts comprehensive development reports',
    'Counselors review, personalize, and approve each report through a streamlined reviewer dashboard',
    'Consistent report quality across all 12 cities while preserving each counselor\'s personal insights and observations',
    'Reports include growth narrative, skill development analysis, mentor relationship summary, and forward-looking recommendations',
  ]},
  { type: 'section', title: 'Why Evelyn Learning', subtitle: 'Our Approach & Capabilities', content: '', bgColor: '#7a2a8e' },
  { type: 'comparison', title: 'What Sets Us Apart', columns: [
    { title: 'Education Domain Expertise', items: [
      'Deep experience building AI systems specifically for educational organizations',
      'Understanding of assessment design, rubric interpretation, and narrative pedagogy',
      'Track record with mentorship platforms, tutoring systems, and school networks',
    ]},
    { title: 'Production-Ready Engineering', items: [
      'Full-stack teams experienced in Next.js, Node.js, and MongoDB',
      'LLM integration with guardrails, prompt engineering, and output validation',
      'Reviewer-friendly interfaces designed with educator workflows in mind',
    ]},
  ]},
  { type: 'section', title: 'Discovery Questions', subtitle: 'Topics We\'d Love to Explore Together', content: '', bgColor: '#1B3A5C' },
  { type: 'questions', title: 'Understanding Your Current Workflow', bullets: [
    'Can you walk us through the current end-to-end process from when a student submits a survey to when they receive their final report?',
    'How many survey questions do students typically answer, and are they multiple choice, free text, rating scales, or a mix?',
    'What does the current manual "report assembly" look like — is there a template with sections that reviewers fill in?',
    'How many reviewers are involved, and does each reviewer handle specific students or sections?',
    'What LLM tools are reviewers currently using ad-hoc (ChatGPT, Claude, etc.), and what prompts or approaches work best?',
  ]},
  { type: 'questions', title: 'Report Requirements & Quality', bullets: [
    'Could you share a sample of a finished report that represents the quality and format you\'re aiming for?',
    'What are the key sections of the report, and which sections benefit most from AI generation vs. human writing?',
    'How much personalization is expected — should reports reference specific survey answers, or synthesize themes?',
    'Is there a specific voice/tone the reports should follow? (academic, encouraging, clinical, conversational?)',
    'What quality control or approval steps should be built into the workflow before a report reaches the student?',
  ]},
  { type: 'questions', title: 'Scale, Timeline & New Product', bullets: [
    'How many students/reports do you need to support per cycle, and how often do cycles run?',
    'What\'s the turnaround expectation from survey completion to report delivery?',
    'You mentioned a new product you\'re developing — can you share how this report system fits into that larger vision?',
    'Are there other data inputs beyond surveys (mentor notes, session logs, assessments) that should feed into reports?',
    'What does success look like in 3 months vs. 12 months? Is there a phased rollout approach you\'re considering?',
    'Who are the primary users of this system — program coordinators, reviewers, mentors, or a combination?',
  ]},
  { type: 'closing', title: 'Let\'s Build Something Great Together', subtitle: 'We\'re excited about the possibility of partnering with Hugo Mentors to transform how students experience personalized mentorship assessment.', content: 'Praveen Tyagi  |  praveen@evelynlearning.com  |  evelynlearning.com' },
];


/* ═══════════════════════════════════════════════
   ACCESS GATE COMPONENT
   ═══════════════════════════════════════════════ */
function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (code.trim().toUpperCase() === 'HM2026') {
        sessionStorage.setItem('hugo_mentors_access', 'true');
        onUnlock();
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${HUGO.primary} 0%, ${HUGO.primaryDark} 50%, ${EL.purple} 100%)` }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.gold})` }}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: HUGO.textPrimary }}>Hugo Mentors</h1>
            <p className="text-sm mt-1" style={{ color: HUGO.textMuted }}>Assessment Report System Demo</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-xs" style={{ color: HUGO.textMuted }}>Built by</span>
              <span className="text-xs font-semibold" style={{ color: EL.purple }}>Evelyn Learning</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-2" style={{ color: HUGO.textSecondary }}>
              <Lock className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Enter Access Code
            </label>
            <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setError(false); }} placeholder="Enter your access code"
              className="w-full px-4 py-3 rounded-lg border-2 text-center text-lg font-mono tracking-widest focus:outline-none transition-colors"
              style={{ borderColor: error ? HUGO.danger : HUGO.border, color: HUGO.textPrimary }} autoFocus />
            {error && <p className="text-sm mt-2 flex items-center gap-1" style={{ color: HUGO.danger }}><AlertCircle className="w-4 h-4" /> Invalid access code. Please try again.</p>}
            <button type="submit" disabled={loading || !code.trim()} className="w-full mt-4 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2">Access Demo <ArrowRight className="w-4 h-4" /></span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   SURVEY FORM COMPONENT (new survey-taking flow)
   ═══════════════════════════════════════════════ */
function SurveyForm({ onSubmit, onCancel }: { onSubmit: (student: StudentData) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>(NEW_SURVEY_PREFILL);
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Convert form data into StudentData format
    const surveyResponses: SurveyResponse[] = SURVEY_TEMPLATE.map(section => ({
      category: section.category,
      questions: section.questions.map(q => {
        const key = `${section.category}__${q.q}`;
        let answer = formData[key] || '';
        // For rating type, add a description
        if (q.type === 'rating' && answer) {
          const ratingDescriptions: Record<string, string> = {
            '1': '1 - Beginning',
            '2': '2 - Developing',
            '3': '3 - Competent',
            '4': '4 - Strong',
            '5': '5 - Exceptional',
          };
          answer = ratingDescriptions[answer] || answer;
        }
        return { q: q.q, a: answer };
      }),
    }));

    const name = formData['student_name'] || 'New Student';
    const newStudent: StudentData = {
      id: 'new-' + Date.now(),
      name,
      school: formData['student_school'] || '',
      grade: formData['student_grade'] || '',
      status: 'new',
      submittedDate: new Date().toISOString().split('T')[0],
      avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      survey: surveyResponses,
    };

    setTimeout(() => {
      setSubmitting(false);
      onSubmit(newStudent);
    }, 800);
  };

  const section = SURVEY_TEMPLATE[currentSection];
  const progress = ((currentSection + 1) / (SURVEY_TEMPLATE.length + 1)) * 100; // +1 for student info step

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ background: HUGO.bg }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back to Student List */}
        <button onClick={onCancel} className="flex items-center gap-1.5 text-sm mb-4 hover:underline" style={{ color: HUGO.accent }}>
          <ChevronLeft className="w-4 h-4" /> Back to Student Assessments
        </button>

        {/* Survey Header */}
        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: HUGO.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.gold})` }}>
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: HUGO.textPrimary }}>Hugo Mentors Student Assessment Survey</h2>
              <p className="text-sm" style={{ color: HUGO.textMuted }}>Pre-filled with sample student data for demonstration</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full" style={{ background: `${HUGO.primary}15` }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${HUGO.primary}, ${HUGO.accent})` }} />
            </div>
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: HUGO.textMuted }}>
              {currentSection === 0 ? 'Student Info' : `Section ${currentSection} of ${SURVEY_TEMPLATE.length}`}
            </span>
          </div>
        </div>

        {/* Student Info (first step, shown before sections) */}
        {currentSection === 0 && (
          <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: HUGO.border }}>
            <h3 className="font-semibold mb-4 text-lg" style={{ color: HUGO.textPrimary }}>Student Information</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: HUGO.textSecondary }}>Full Name</label>
                <input type="text" value={formData['student_name'] || ''} onChange={e => updateField('student_name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: HUGO.textSecondary }}>School</label>
                <input type="text" value={formData['student_school'] || ''} onChange={e => updateField('student_school', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: HUGO.textSecondary }}>Grade</label>
                <select value={formData['student_grade'] || ''} onChange={e => updateField('student_grade', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }}>
                  <option value="">Select grade</option>
                  {['9th', '10th', '11th', '12th'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Survey Section */}
        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: HUGO.border }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg" style={{ color: HUGO.textPrimary }}>{section.category}</h3>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${HUGO.accent}10`, color: HUGO.accent }}>
              Section {currentSection + 1} / {SURVEY_TEMPLATE.length}
            </span>
          </div>
          <div className="space-y-5">
            {section.questions.map((q, qi) => {
              const key = `${section.category}__${q.q}`;
              const value = formData[key] || '';
              return (
                <div key={qi}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: HUGO.textSecondary }}>{q.q}</label>
                  {q.type === 'textarea' && (
                    <textarea value={value} onChange={e => updateField(key, e.target.value)} rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }} />
                  )}
                  {q.type === 'text' && (
                    <input type="text" value={value} onChange={e => updateField(key, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }} />
                  )}
                  {q.type === 'select' && (
                    <select value={value} onChange={e => updateField(key, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" style={{ borderColor: HUGO.border, color: HUGO.textPrimary }}>
                      <option value="">Select an option</option>
                      {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                  {q.type === 'rating' && (
                    <div className="flex gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button key={r} onClick={() => updateField(key, String(r))}
                          className="w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all"
                          style={{
                            borderColor: value === String(r) ? HUGO.accent : HUGO.border,
                            background: value === String(r) ? `${HUGO.accent}15` : 'white',
                            color: value === String(r) ? HUGO.accent : HUGO.textMuted,
                          }}>
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentSection(s => Math.max(s - 1, 0))} disabled={currentSection === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-30 transition-colors"
            style={{ borderColor: HUGO.border, color: HUGO.textSecondary }}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentSection < SURVEY_TEMPLATE.length - 1 ? (
            <button onClick={() => setCurrentSection(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium text-sm transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
              Next Section <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${HUGO.success}, #2F855A)` }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   PDF EXPORT HELPER
   ═══════════════════════════════════════════════ */
function exportReportToPDF(student: StudentData, sections: ReportSection[]) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (neededSpace: number) => {
    if (y + neededSpace > 270) {
      pdf.addPage();
      y = 20;
    }
  };

  // Header
  pdf.setFillColor(27, 58, 92); // HUGO.primary
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hugo Mentors', margin, 18);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Individualized Assessment Report', margin, 28);
  pdf.setFontSize(9);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, 35);

  y = 50;

  // Student Info
  pdf.setTextColor(26, 32, 44);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(student.name, margin, y);
  y += 7;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(113, 128, 150);
  pdf.text(`${student.school}  |  ${student.grade} Grade`, margin, y);
  if (student.mentor) {
    y += 5;
    pdf.text(`Mentor: ${student.mentor}`, margin, y);
  }
  y += 10;

  // Divider
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Sections
  sections.forEach((section) => {
    addPageIfNeeded(30);

    // Section title
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(27, 58, 92);
    pdf.text(section.title, margin, y);
    y += 7;

    // Section content - wrap text
    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(74, 85, 104);

    const lines = pdf.splitTextToSize(section.content, contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(5);
      pdf.text(line, margin, y);
      y += 4.5;
    });

    y += 6;
  });

  // Footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`Built by Evelyn Learning  |  evelynlearning.com`, margin, 290);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, 290);
  }

  pdf.save(`${student.name.replace(/\s+/g, '_')}_Assessment_Report.pdf`);
}


/* ═══════════════════════════════════════════════
   LIVE DEMO COMPONENT
   ═══════════════════════════════════════════════ */
function LiveDemo() {
  const trackInteraction = useTrackInteraction();
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [students, setStudents] = useState<StudentData[]>(STUDENTS);
  const [viewMode, setViewMode] = useState<'list' | 'survey_form' | 'survey' | 'generating' | 'report'>('list');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSections, setGeneratedSections] = useState<ReportSection[]>([]);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [promptLoaded, setPromptLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const generationRef = useRef<NodeJS.Timeout | null>(null);
  const prevViewRef = useRef(viewMode);

  // Track view mode changes
  useEffect(() => {
    if (viewMode !== prevViewRef.current) {
      trackInteraction('navigation', viewMode, { from: prevViewRef.current });
      prevViewRef.current = viewMode;
    }
  }, [viewMode, trackInteraction]);

  // Load default prompt
  useEffect(() => {
    if (!promptLoaded) {
      fetch('/api/showcase/hugo-mentors/generate-report')
        .then(r => r.json())
        .then(data => { setSystemPrompt(data.defaultPrompt || ''); setPromptLoaded(true); })
        .catch(() => setPromptLoaded(true));
    }
  }, [promptLoaded]);

  const generateReport = useCallback(async (student: StudentData) => {
    if (generationRef.current) clearInterval(generationRef.current);
    setViewMode('generating');
    setGenerationProgress(0);
    setGeneratedSections([]);
    setApiError(null);

    // Animate progress bar while waiting for API
    let fakeProgress = 0;
    const progressInterval = setInterval(() => {
      fakeProgress += Math.random() * 8;
      if (fakeProgress > 85) fakeProgress = 85;
      setGenerationProgress(fakeProgress);
    }, 500);
    generationRef.current = progressInterval;

    try {
      const response = await fetch('/api/showcase/hugo-mentors/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          school: student.school,
          grade: student.grade,
          surveyData: student.survey,
          systemPrompt: systemPrompt || undefined,
        }),
      });

      clearInterval(progressInterval);
      generationRef.current = null;

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const sections: ReportSection[] = data.sections || [];

      // Animate sections appearing
      setGenerationProgress(90);
      for (let i = 0; i < sections.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setGeneratedSections(prev => [...prev, sections[i]]);
        setGenerationProgress(90 + ((i + 1) / sections.length) * 10);
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      setViewMode('report');
      setStudents(prev => prev.map(s =>
        s.id === student.id ? { ...s, status: 'generated' as const, report: sections } : s
      ));
      setSelectedStudent(prev => prev ? { ...prev, status: 'generated', report: sections } : null);
      trackInteraction('tool_use', 'generate_report', {
        studentName: student.name, sectionCount: sections.length,
        ...(data.usage && { inputTokens: data.usage.inputTokens, outputTokens: data.usage.outputTokens, model: data.usage.model }),
      });
    } catch (err) {
      clearInterval(progressInterval);
      generationRef.current = null;
      setApiError(err instanceof Error ? err.message : 'Unknown error');
      setGenerationProgress(0);
    }
  }, [systemPrompt]);

  useEffect(() => {
    return () => { if (generationRef.current) clearInterval(generationRef.current); };
  }, []);

  const handleApprove = () => {
    if (selectedStudent) {
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, status: 'approved' as const } : s));
      setSelectedStudent(prev => prev ? { ...prev, status: 'approved' } : null);
      trackInteraction('tool_use', 'approve_report', { studentName: selectedStudent.name });
    }
  };

  const handleSurveySubmit = (newStudent: StudentData) => {
    setStudents(prev => {
      // Prevent duplicates in case of double-submit
      if (prev.some(s => s.id === newStudent.id)) return prev;
      return [newStudent, ...prev];
    });
    setSelectedStudent(newStudent);
    setViewMode('survey');
    trackInteraction('tool_use', 'submit_survey', { studentName: newStudent.name, grade: newStudent.grade });
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: 'New', color: HUGO.accent, bg: '#EBF8FF' },
    in_progress: { label: 'In Progress', color: HUGO.warning, bg: '#FFFAF0' },
    generated: { label: 'Report Ready', color: HUGO.success, bg: '#F0FFF4' },
    approved: { label: 'Approved', color: '#553C9A', bg: '#FAF5FF' },
  };

  /* ──── SURVEY FORM VIEW ──── */
  if (viewMode === 'survey_form') {
    return <SurveyForm onSubmit={handleSurveySubmit} onCancel={() => setViewMode('list')} />;
  }

  /* ──── STUDENT LIST VIEW ──── */
  if (viewMode === 'list') {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: HUGO.textPrimary }}>Student Assessments</h2>
            <p className="text-sm mt-1" style={{ color: HUGO.textMuted }}>Review survey responses and generate individualized reports</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: HUGO.bg }}>
              <Search className="w-4 h-4" style={{ color: HUGO.textMuted }} />
              <input type="text" placeholder="Search students..." className="bg-transparent text-sm focus:outline-none w-40" style={{ color: HUGO.textPrimary }} />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: HUGO.border, color: HUGO.textSecondary }}>
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => setViewMode('survey_form')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
              <PlusCircle className="w-4 h-4" /> New Survey
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: students.length, icon: Users, color: HUGO.primary },
            { label: 'Awaiting Review', value: students.filter(s => s.status === 'new').length, icon: ClipboardList, color: HUGO.accent },
            { label: 'Reports Ready', value: students.filter(s => s.status === 'generated').length, icon: FileText, color: HUGO.success },
            { label: 'Approved', value: students.filter(s => s.status === 'approved').length, icon: CheckCircle, color: '#553C9A' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: HUGO.border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: HUGO.textPrimary }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: HUGO.textMuted }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Configuration */}
        <div className="bg-white rounded-xl border mb-6 overflow-hidden" style={{ borderColor: HUGO.border }}>
          <button onClick={() => setShowPromptEditor(!showPromptEditor)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ color: HUGO.textSecondary }}>
            <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> AI Prompt Configuration</span>
            {showPromptEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showPromptEditor && (
            <div className="px-5 pb-5 border-t" style={{ borderColor: HUGO.border }}>
              <p className="text-xs mt-3 mb-2" style={{ color: HUGO.textMuted }}>Edit the system prompt used by GPT-4o-mini to generate reports. Changes apply to all new report generations.</p>
              <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={12}
                className="w-full px-3 py-2.5 rounded-lg border text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
                style={{ borderColor: HUGO.border, color: HUGO.textPrimary }} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: HUGO.textMuted }}>Model: gpt-4o-mini</span>
                <button onClick={() => { setPromptLoaded(false); }}
                  className="text-xs px-3 py-1.5 rounded-md" style={{ color: HUGO.accent, background: `${HUGO.accent}10` }}>
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Student Cards */}
        <div className="space-y-3">
          {students.map((student) => {
            const status = statusConfig[student.status];
            return (
              <div key={student.id} onClick={() => { setSelectedStudent(student); setViewMode('survey'); }}
                className="bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md hover:border-blue-200 group" style={{ borderColor: HUGO.border }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors" style={{ color: HUGO.textPrimary }}>{student.name}</h3>
                      <p className="text-sm" style={{ color: HUGO.textMuted }}>{student.school} · {student.grade} Grade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {student.mentor && (
                      <p className="text-xs hidden md:block" style={{ color: HUGO.textMuted }}>
                        <UserCheck className="w-3.5 h-3.5 inline mr-1" />{student.mentor}
                      </p>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                    <p className="text-xs hidden md:block" style={{ color: HUGO.textMuted }}>
                      <Clock className="w-3.5 h-3.5 inline mr-1" />{new Date(student.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <ChevronRight className="w-5 h-5" style={{ color: HUGO.textMuted }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ──── SURVEY VIEWER ──── */
  if (viewMode === 'survey' && selectedStudent) {
    const isNewlySubmitted = selectedStudent.id.startsWith('new-');
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => { setViewMode('list'); setSelectedStudent(null); }} className="hover:underline" style={{ color: HUGO.accent }}>Students</button>
          <ChevronRight className="w-4 h-4" style={{ color: HUGO.textMuted }} />
          <span style={{ color: HUGO.textPrimary }}>{selectedStudent.name}</span>
        </div>

        {isNewlySubmitted && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border animate-fadeIn" style={{ background: '#F0FFF4', borderColor: '#C6F6D5' }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: HUGO.success }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#276749' }}>Survey submitted successfully</p>
              <p className="text-xs" style={{ color: '#48BB78' }}>Review the responses below, then generate an AI-powered report.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: HUGO.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
                {selectedStudent.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: HUGO.textPrimary }}>{selectedStudent.name}</h2>
                <p className="text-sm" style={{ color: HUGO.textMuted }}>
                  {selectedStudent.school} · {selectedStudent.grade} Grade
                  {selectedStudent.mentor && <span> · Mentor: {selectedStudent.mentor}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedStudent.report && selectedStudent.report.length > 0 ? (
                <button onClick={() => { setGeneratedSections(selectedStudent.report!); setViewMode('report'); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium text-sm transition-all hover:shadow-lg" style={{ background: HUGO.success }}>
                  <Eye className="w-4 h-4" /> View Report
                </button>
              ) : (
                <button onClick={() => generateReport(selectedStudent)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium text-sm transition-all hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.accent})` }}>
                  <Sparkles className="w-4 h-4" /> Generate Report with AI
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {selectedStudent.survey.map((section, sIdx) => (
            <div key={sIdx} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: HUGO.border }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: HUGO.border, background: HUGO.bg }}>
                <h3 className="font-semibold" style={{ color: HUGO.textPrimary }}>{section.category}</h3>
              </div>
              <div className="p-6 space-y-5">
                {section.questions.map((qa, qIdx) => (
                  <div key={qIdx}>
                    <p className="text-sm font-medium mb-1.5" style={{ color: HUGO.textSecondary }}>{qa.q}</p>
                    <p className="text-sm leading-relaxed pl-3 border-l-2" style={{ color: HUGO.textPrimary, borderColor: `${HUGO.accent}40` }}>{qa.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──── GENERATION VIEW ──── */
  if (viewMode === 'generating' && selectedStudent) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ background: `${HUGO.accent}15` }}>
              <Brain className="w-10 h-10" style={{ color: HUGO.accent }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: HUGO.textPrimary }}>Generating Report for {selectedStudent.name}</h2>
            <p className="text-sm" style={{ color: HUGO.textMuted }}>Sending survey data to GPT-4o-mini for analysis...</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl border-2 flex items-start gap-3" style={{ borderColor: HUGO.danger, background: '#FFF5F5' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: HUGO.danger }} />
              <div>
                <p className="text-sm font-medium" style={{ color: HUGO.danger }}>Report generation failed</p>
                <p className="text-xs mt-1" style={{ color: HUGO.textSecondary }}>{apiError}</p>
                <button onClick={() => generateReport(selectedStudent)} className="text-xs mt-2 underline" style={{ color: HUGO.accent }}>Retry</button>
                <span className="text-xs mx-2" style={{ color: HUGO.textMuted }}>or</span>
                <button onClick={() => { setViewMode('survey'); setApiError(null); }} className="text-xs underline" style={{ color: HUGO.textSecondary }}>Go back</button>
              </div>
            </div>
          )}

          {!apiError && (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span style={{ color: HUGO.textSecondary }}>Progress</span>
                  <span className="font-medium" style={{ color: HUGO.accent }}>{Math.round(generationProgress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: HUGO.bg }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${generationProgress}%`, background: `linear-gradient(90deg, ${HUGO.primary}, ${HUGO.accent})` }} />
                </div>
              </div>
              <div className="space-y-4">
                {generatedSections.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-xl border p-5 animate-fadeIn" style={{ borderColor: HUGO.border }}>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5" style={{ color: HUGO.success }} />
                      <h3 className="font-semibold" style={{ color: HUGO.textPrimary }}>{section.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: HUGO.textSecondary }}>{section.content}</p>
                  </div>
                ))}
                {generationProgress < 100 && generationProgress > 0 && (
                  <div className="bg-white rounded-xl border p-5 animate-pulse" style={{ borderColor: HUGO.border }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: HUGO.accent }} />
                      <h3 className="font-semibold" style={{ color: HUGO.textMuted }}>Generating with GPT-4o-mini...</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 rounded w-full" style={{ background: HUGO.bg }} />
                      <div className="h-3 rounded w-4/5" style={{ background: HUGO.bg }} />
                      <div className="h-3 rounded w-3/5" style={{ background: HUGO.bg }} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ──── REPORT VIEW ──── */
  if (viewMode === 'report' && selectedStudent) {
    const reportSections = (selectedStudent.report && selectedStudent.report.length > 0) ? selectedStudent.report : generatedSections;
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => { setViewMode('list'); setSelectedStudent(null); }} className="hover:underline" style={{ color: HUGO.accent }}>Students</button>
          <ChevronRight className="w-4 h-4" style={{ color: HUGO.textMuted }} />
          <button onClick={() => setViewMode('survey')} className="hover:underline" style={{ color: HUGO.accent }}>{selectedStudent.name}</button>
          <ChevronRight className="w-4 h-4" style={{ color: HUGO.textMuted }} />
          <span style={{ color: HUGO.textPrimary }}>Report</span>
        </div>
        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: HUGO.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: HUGO.textPrimary }}>Assessment Report — {selectedStudent.name}</h2>
              <p className="text-sm mt-1" style={{ color: HUGO.textMuted }}>
                Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {selectedStudent.status === 'approved' && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#FAF5FF', color: '#553C9A' }}>
                    <CheckCircle className="w-3 h-3" /> Approved
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { exportReportToPDF(selectedStudent, reportSections); trackInteraction('tool_use', 'export_pdf', { studentName: selectedStudent.name }); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: HUGO.border, color: HUGO.textSecondary }}>
                <FileDown className="w-4 h-4" /> Export PDF
              </button>
              {selectedStudent.status !== 'approved' && (
                <button onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm" style={{ background: HUGO.success }}>
                  <CheckCircle className="w-4 h-4" /> Approve Report
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {reportSections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: HUGO.border }}>
              <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: HUGO.border, background: HUGO.bg }}>
                <h3 className="font-semibold" style={{ color: HUGO.textPrimary }}>{section.title}</h3>
                <button onClick={() => { setEditingSection(idx); setEditText(section.content); }}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors" style={{ color: HUGO.textMuted }}>
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="p-6">
                {editingSection === idx ? (
                  <div>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
                      style={{ borderColor: HUGO.border, color: HUGO.textPrimary, minHeight: '200px' }} />
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => setEditingSection(null)} className="px-3 py-1.5 rounded-md text-sm" style={{ color: HUGO.textSecondary }}>Cancel</button>
                      <button onClick={() => {
                        const updated = [...reportSections];
                        updated[idx] = { ...updated[idx], content: editText };
                        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, report: updated } : s));
                        setSelectedStudent(prev => prev ? { ...prev, report: updated } : null);
                        setGeneratedSections(updated);
                        setEditingSection(null);
                      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm" style={{ background: HUGO.accent }}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: HUGO.textSecondary }}>{section.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}


/* ═══════════════════════════════════════════════
   CASE STUDIES / PRESENTATION COMPONENT
   (Fixed: use viewport height instead of h-full)
   ═══════════════════════════════════════════════ */
function CaseStudiesPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = SLIDES.length;

  const next = useCallback(() => setCurrentSlide(s => Math.min(s + 1, totalSlides - 1)), [totalSlides]);
  const prev = useCallback(() => setCurrentSlide(s => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const slide = SLIDES[currentSlide];

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 md:px-16" style={{ background: `linear-gradient(135deg, ${HUGO.primary} 0%, ${HUGO.primaryDark} 50%, ${EL.purple} 100%)` }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">{slide.subtitle}</p>
            <p className="text-sm text-white/50 tracking-wider">{slide.content}</p>
          </div>
        );
      case 'section':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ background: `linear-gradient(135deg, ${slide.bgColor} 0%, ${slide.bgColor}dd 100%)` }}>
            <p className="text-sm text-white/60 tracking-widest uppercase mb-4">{slide.title}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{slide.subtitle}</h2>
            {slide.content && <p className="text-lg text-white/80 max-w-xl">{slide.content}</p>}
          </div>
        );
      case 'content':
        return (
          <div className="flex flex-col h-full bg-white px-8 md:px-16 py-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: HUGO.textPrimary }}>{slide.title}</h2>
              {slide.subtitle && <p className="text-sm mb-6 px-3 py-1.5 rounded-md inline-block" style={{ background: `${HUGO.gold}20`, color: HUGO.gold }}>{slide.subtitle}</p>}
              {!slide.subtitle && <div className="mb-6" />}
              <div className="space-y-4">
                {slide.bullets?.map((bullet, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: `${HUGO.primary}10` }}>
                      <span className="text-sm font-bold" style={{ color: HUGO.primary }}>{i + 1}</span>
                    </div>
                    <p className="text-base leading-relaxed flex-1" style={{ color: HUGO.textSecondary }}>{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="flex flex-col h-full bg-white px-8 md:px-16 py-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: HUGO.textPrimary }}>{slide.title}</h2>
              <p className="text-sm mb-8" style={{ color: HUGO.textMuted }}>{slide.subtitle}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {slide.stats?.map((stat, i) => (
                  <div key={i} className="rounded-xl p-5 text-center" style={{ background: `${HUGO.primary}08`, border: `1px solid ${HUGO.primary}15` }}>
                    <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: HUGO.primary }}>{stat.value}</p>
                    <p className="text-xs leading-snug" style={{ color: HUGO.textMuted }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              {slide.bullets && (
                <div className="space-y-3">
                  {slide.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: HUGO.success }} />
                      <p className="text-sm leading-relaxed" style={{ color: HUGO.textSecondary }}>{bullet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'comparison':
        return (
          <div className="flex flex-col h-full bg-white px-8 md:px-16 py-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: HUGO.textPrimary }}>{slide.title}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {slide.columns?.map((col, i) => (
                  <div key={i} className="rounded-xl border p-6" style={{ borderColor: HUGO.border }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: i === 0 ? `${HUGO.primary}15` : `${EL.purple}15` }}>
                        {i === 0 ? <BookOpen className="w-5 h-5" style={{ color: HUGO.primary }} /> : <Zap className="w-5 h-5" style={{ color: EL.purple }} />}
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: HUGO.textPrimary }}>{col.title}</h3>
                    </div>
                    <div className="space-y-4">
                      {col.items.map((item, j) => (
                        <div key={j} className="flex gap-3 items-start">
                          <Check className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: HUGO.success }} />
                          <p className="text-sm leading-relaxed" style={{ color: HUGO.textSecondary }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'questions':
        return (
          <div className="flex flex-col h-full bg-white px-8 md:px-16 py-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: HUGO.textPrimary }}>{slide.title}</h2>
              <div className="space-y-4">
                {slide.bullets?.map((q, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: HUGO.bg }}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${HUGO.gold}25` }}>
                      <MessageSquare className="w-4 h-4" style={{ color: HUGO.gold }} />
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: HUGO.textPrimary }}>{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'closing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ background: `linear-gradient(135deg, ${HUGO.primary} 0%, ${EL.purple} 100%)` }}>
            <Star className="w-12 h-12 text-white/40 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{slide.title}</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">{slide.subtitle}</p>
            <p className="text-sm text-white/50 tracking-wider">{slide.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Use explicit height calculation instead of h-full
  const slideHeight = 'calc(100vh - 4rem - 48px)'; // viewport - header - nav bar

  return (
    <div className="flex flex-col bg-gray-900" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Slide Area */}
      <div className="relative overflow-hidden" style={{ height: slideHeight }}>
        <div className="absolute inset-0">
          {renderSlide()}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={prev} disabled={currentSlide === 0}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{currentSlide + 1} / {totalSlides}</span>
          <div className="flex gap-1">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === currentSlide ? HUGO.gold : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
        <button onClick={next} disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors">
          Next <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════ */
function MainApp() {
  const [activeTab, setActiveTab] = useState<'demo' | 'casestudies'>('demo');
  const { onView, onTry, trackInteraction } = useDemoTracker('hugo-mentors', 'Hugo Mentors');

  useEffect(() => { onView(); }, [onView]);

  return (
    <DemoTrackingProvider trackInteraction={trackInteraction}>
    <div className="min-h-screen flex flex-col" style={{ background: HUGO.bg }} onClick={onTry}>
      <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: HUGO.border }}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${HUGO.primary}, ${HUGO.gold})` }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none" style={{ color: HUGO.textPrimary }}>Hugo Mentors</h1>
                <p className="text-[11px] leading-tight mt-0.5" style={{ color: HUGO.textMuted }}>Assessment Report System</p>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: HUGO.bg }}>
              <button onClick={() => { setActiveTab('demo'); trackInteraction('navigation', 'tab_switch', { tab: 'demo' }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
                style={{ background: activeTab === 'demo' ? 'white' : 'transparent', color: activeTab === 'demo' ? HUGO.primary : HUGO.textMuted, boxShadow: activeTab === 'demo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                <Play className="w-4 h-4" /> Live Demo
              </button>
              <button onClick={() => { setActiveTab('casestudies'); trackInteraction('navigation', 'tab_switch', { tab: 'casestudies' }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
                style={{ background: activeTab === 'casestudies' ? 'white' : 'transparent', color: activeTab === 'casestudies' ? HUGO.primary : HUGO.textMuted, boxShadow: activeTab === 'casestudies' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                <Presentation className="w-4 h-4" /> Case Studies & Questions
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${EL.purple}10`, color: EL.purple }}>
                Built by Evelyn Learning
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {activeTab === 'demo' ? (
          <div className="max-w-screen-2xl mx-auto">
            <LiveDemo />
          </div>
        ) : (
          <CaseStudiesPresentation />
        )}
      </main>
    </div>
    </DemoTrackingProvider>
  );
}


/* ═══════════════════════════════════════════════
   PAGE ROOT
   ═══════════════════════════════════════════════ */
export default function HugoMentorsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('hugo_mentors_access');
    if (stored === 'true') setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: HUGO.bg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: HUGO.accent }} />
      </div>
    );
  }

  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;
  return <MainApp />;
}
