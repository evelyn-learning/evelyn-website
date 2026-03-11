'use client';

import React, { useState, useMemo } from 'react';

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  overallProgress: number;
  streak: number;
  subjects: {
    name: string;
    progress: number;
    trend: 'up' | 'down' | 'stable';
    recentScore: number;
  }[];
  recentActivity: {
    date: string;
    action: string;
    subject: string;
    result?: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
}

interface ClassData {
  totalStudents: number;
  averageProgress: number;
  activeToday: number;
  averageStreak: number;
  topPerformers: { name: string; progress: number }[];
  needsAttention: { name: string; issue: string; studentId?: string }[];
  subjectBreakdown: {
    name: string;
    classAverage: number;
    studentCount: number;
  }[];
  weeklyActivity: number[];
}

const ALL_STUDENTS: StudentData[] = [
  {
    id: '1', name: 'Emma Wilson', avatar: '👩', grade: 'A-', overallProgress: 87, streak: 12,
    subjects: [
      { name: 'Math', progress: 92, trend: 'up', recentScore: 95 },
      { name: 'Reading', progress: 85, trend: 'stable', recentScore: 82 },
      { name: 'Science', progress: 88, trend: 'up', recentScore: 90 },
      { name: 'Writing', progress: 78, trend: 'down', recentScore: 75 },
    ],
    recentActivity: [
      { date: '2 hours ago', action: 'Completed', subject: 'Math Quiz', result: '95%' },
      { date: 'Yesterday', action: 'Practiced', subject: 'Algebra', result: '30 min' },
      { date: '2 days ago', action: 'Mastered', subject: 'Fractions', result: '100%' },
    ],
    strengths: ['Problem Solving', 'Critical Thinking', 'Numerical Analysis'],
    areasForImprovement: ['Essay Structure', 'Time Management'],
  },
  {
    id: '2', name: 'James Chen', avatar: '👨', grade: 'B+', overallProgress: 78, streak: 5,
    subjects: [
      { name: 'Math', progress: 72, trend: 'up', recentScore: 78 },
      { name: 'Reading', progress: 85, trend: 'up', recentScore: 88 },
      { name: 'Science', progress: 80, trend: 'stable', recentScore: 79 },
      { name: 'Writing', progress: 75, trend: 'up', recentScore: 80 },
    ],
    recentActivity: [
      { date: '3 hours ago', action: 'Completed', subject: 'Reading Passage', result: '88%' },
      { date: 'Yesterday', action: 'Started', subject: 'Quadratic Equations' },
      { date: '3 days ago', action: 'Reviewed', subject: 'Essay Feedback' },
    ],
    strengths: ['Reading Comprehension', 'Creativity', 'Collaboration'],
    areasForImprovement: ['Algebraic Concepts', 'Test-Taking Speed'],
  },
  {
    id: '3', name: 'Sofia Martinez', avatar: '👩', grade: 'A', overallProgress: 94, streak: 28,
    subjects: [
      { name: 'Math', progress: 96, trend: 'up', recentScore: 98 },
      { name: 'Reading', progress: 92, trend: 'stable', recentScore: 90 },
      { name: 'Science', progress: 95, trend: 'up', recentScore: 97 },
      { name: 'Writing', progress: 90, trend: 'up', recentScore: 92 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Completed', subject: 'Advanced Calculus', result: '98%' },
      { date: 'Today', action: 'Mastered', subject: 'Physics Concepts', result: '100%' },
      { date: 'Yesterday', action: 'Helped', subject: 'Peer Tutoring', result: '2 students' },
    ],
    strengths: ['All Subjects', 'Self-Motivation', 'Analytical Thinking'],
    areasForImprovement: ['Already excelling - consider advanced content'],
  },
  {
    id: '4', name: 'Tyler Robinson', avatar: '👦', grade: 'C', overallProgress: 52, streak: 0,
    subjects: [
      { name: 'Math', progress: 38, trend: 'down', recentScore: 45 },
      { name: 'Reading', progress: 65, trend: 'stable', recentScore: 62 },
      { name: 'Science', progress: 55, trend: 'down', recentScore: 50 },
      { name: 'Writing', progress: 50, trend: 'stable', recentScore: 55 },
    ],
    recentActivity: [
      { date: '3 days ago', action: 'Attempted', subject: 'Math Quiz', result: '45%' },
      { date: '5 days ago', action: 'Started', subject: 'Algebra' },
    ],
    strengths: ['Reading Comprehension'],
    areasForImprovement: ['Math fundamentals', 'Study consistency', 'Test preparation'],
  },
  {
    id: '5', name: 'Maya Lewis', avatar: '👧', grade: 'B-', overallProgress: 68, streak: 0,
    subjects: [
      { name: 'Math', progress: 70, trend: 'stable', recentScore: 72 },
      { name: 'Reading', progress: 72, trend: 'stable', recentScore: 70 },
      { name: 'Science', progress: 65, trend: 'down', recentScore: 60 },
      { name: 'Writing', progress: 64, trend: 'stable', recentScore: 65 },
    ],
    recentActivity: [
      { date: '5 days ago', action: 'Completed', subject: 'Reading Quiz', result: '70%' },
      { date: '6 days ago', action: 'Practiced', subject: 'Writing' },
    ],
    strengths: ['Consistent effort when engaged'],
    areasForImprovement: ['Regular practice schedule', 'Science concepts', 'Re-engagement needed'],
  },
  {
    id: '6', name: 'Aiden Park', avatar: '👦', grade: 'A', overallProgress: 91, streak: 18,
    subjects: [
      { name: 'Math', progress: 94, trend: 'up', recentScore: 96 },
      { name: 'Reading', progress: 88, trend: 'stable', recentScore: 87 },
      { name: 'Science', progress: 92, trend: 'up', recentScore: 94 },
      { name: 'Writing', progress: 86, trend: 'up', recentScore: 88 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Completed', subject: 'Physics Lab', result: '96%' },
      { date: 'Today', action: 'Practiced', subject: 'Calculus', result: '45 min' },
      { date: 'Yesterday', action: 'Mastered', subject: 'Linear Equations', result: '100%' },
    ],
    strengths: ['STEM aptitude', 'Consistent study habits', 'Problem solving'],
    areasForImprovement: ['Literary analysis depth'],
  },
  {
    id: '7', name: 'Olivia Thompson', avatar: '👩', grade: 'B+', overallProgress: 81, streak: 9,
    subjects: [
      { name: 'Math', progress: 74, trend: 'up', recentScore: 78 },
      { name: 'Reading', progress: 90, trend: 'up', recentScore: 92 },
      { name: 'Science', progress: 76, trend: 'stable', recentScore: 75 },
      { name: 'Writing', progress: 88, trend: 'up', recentScore: 90 },
    ],
    recentActivity: [
      { date: '4 hours ago', action: 'Completed', subject: 'Essay Draft', result: '90%' },
      { date: 'Yesterday', action: 'Practiced', subject: 'Geometry', result: '20 min' },
      { date: '2 days ago', action: 'Completed', subject: 'Book Report', result: '92%' },
    ],
    strengths: ['Creative Writing', 'Reading Comprehension', 'Vocabulary'],
    areasForImprovement: ['Geometry concepts', 'Science lab skills'],
  },
  {
    id: '8', name: 'Ethan Davis', avatar: '👦', grade: 'B', overallProgress: 74, streak: 3,
    subjects: [
      { name: 'Math', progress: 78, trend: 'stable', recentScore: 76 },
      { name: 'Reading', progress: 70, trend: 'down', recentScore: 68 },
      { name: 'Science', progress: 82, trend: 'up', recentScore: 85 },
      { name: 'Writing', progress: 65, trend: 'stable', recentScore: 64 },
    ],
    recentActivity: [
      { date: 'Yesterday', action: 'Completed', subject: 'Science Project', result: '85%' },
      { date: '2 days ago', action: 'Attempted', subject: 'Reading Quiz', result: '68%' },
    ],
    strengths: ['Scientific inquiry', 'Hands-on learning'],
    areasForImprovement: ['Reading stamina', 'Written expression', 'Vocabulary building'],
  },
  {
    id: '9', name: 'Ava Rodriguez', avatar: '👩', grade: 'A-', overallProgress: 85, streak: 15,
    subjects: [
      { name: 'Math', progress: 88, trend: 'up', recentScore: 90 },
      { name: 'Reading', progress: 82, trend: 'stable', recentScore: 80 },
      { name: 'Science', progress: 86, trend: 'up', recentScore: 88 },
      { name: 'Writing', progress: 84, trend: 'up', recentScore: 86 },
    ],
    recentActivity: [
      { date: '2 hours ago', action: 'Completed', subject: 'Math Test', result: '90%' },
      { date: 'Today', action: 'Practiced', subject: 'Chemistry', result: '25 min' },
      { date: 'Yesterday', action: 'Reviewed', subject: 'Essay Feedback' },
    ],
    strengths: ['Well-rounded', 'Self-directed learner', 'Strong work ethic'],
    areasForImprovement: ['Advanced literary analysis'],
  },
  {
    id: '10', name: 'Liam Johnson', avatar: '👦', grade: 'C+', overallProgress: 58, streak: 1,
    subjects: [
      { name: 'Math', progress: 48, trend: 'down', recentScore: 52 },
      { name: 'Reading', progress: 62, trend: 'stable', recentScore: 60 },
      { name: 'Science', progress: 60, trend: 'stable', recentScore: 58 },
      { name: 'Writing', progress: 55, trend: 'down', recentScore: 50 },
    ],
    recentActivity: [
      { date: '2 days ago', action: 'Attempted', subject: 'Math Quiz', result: '52%' },
      { date: '4 days ago', action: 'Started', subject: 'Reading Assignment' },
    ],
    strengths: ['Participates in class discussions'],
    areasForImprovement: ['Math computation', 'Writing mechanics', 'Homework completion'],
  },
  {
    id: '11', name: 'Isabella Kim', avatar: '👩', grade: 'A', overallProgress: 93, streak: 22,
    subjects: [
      { name: 'Math', progress: 95, trend: 'up', recentScore: 97 },
      { name: 'Reading', progress: 91, trend: 'stable', recentScore: 90 },
      { name: 'Science', progress: 94, trend: 'up', recentScore: 96 },
      { name: 'Writing', progress: 88, trend: 'up', recentScore: 90 },
    ],
    recentActivity: [
      { date: '30 min ago', action: 'Completed', subject: 'AP Math Practice', result: '97%' },
      { date: 'Today', action: 'Mastered', subject: 'Organic Chemistry', result: '100%' },
      { date: 'Yesterday', action: 'Completed', subject: 'Research Paper', result: '90%' },
    ],
    strengths: ['Academic excellence', 'Research skills', 'Peer mentoring'],
    areasForImprovement: ['Already excelling - consider leadership opportunities'],
  },
  {
    id: '12', name: 'Noah Williams', avatar: '👦', grade: 'B-', overallProgress: 66, streak: 2,
    subjects: [
      { name: 'Math', progress: 60, trend: 'stable', recentScore: 62 },
      { name: 'Reading', progress: 68, trend: 'down', recentScore: 65 },
      { name: 'Science', progress: 72, trend: 'up', recentScore: 75 },
      { name: 'Writing', progress: 58, trend: 'down', recentScore: 55 },
    ],
    recentActivity: [
      { date: 'Yesterday', action: 'Completed', subject: 'Science Lab', result: '75%' },
      { date: '3 days ago', action: 'Attempted', subject: 'Essay Assignment', result: '55%' },
    ],
    strengths: ['Science curiosity', 'Lab participation'],
    areasForImprovement: ['Essay writing', 'Reading comprehension', 'Study habits'],
  },
  {
    id: '13', name: 'Mia Patel', avatar: '👩', grade: 'A-', overallProgress: 84, streak: 10,
    subjects: [
      { name: 'Math', progress: 82, trend: 'up', recentScore: 85 },
      { name: 'Reading', progress: 88, trend: 'up', recentScore: 90 },
      { name: 'Science', progress: 80, trend: 'stable', recentScore: 78 },
      { name: 'Writing', progress: 86, trend: 'up', recentScore: 88 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Completed', subject: 'Reading Quiz', result: '90%' },
      { date: 'Today', action: 'Practiced', subject: 'Algebra', result: '35 min' },
      { date: 'Yesterday', action: 'Completed', subject: 'Creative Writing', result: '88%' },
    ],
    strengths: ['Language arts', 'Creative thinking', 'Attention to detail'],
    areasForImprovement: ['Science experiments', 'Data analysis'],
  },
  {
    id: '14', name: 'Lucas Brown', avatar: '👦', grade: 'C-', overallProgress: 45, streak: 0,
    subjects: [
      { name: 'Math', progress: 35, trend: 'down', recentScore: 40 },
      { name: 'Reading', progress: 50, trend: 'stable', recentScore: 48 },
      { name: 'Science', progress: 48, trend: 'down', recentScore: 42 },
      { name: 'Writing', progress: 45, trend: 'stable', recentScore: 44 },
    ],
    recentActivity: [
      { date: '4 days ago', action: 'Attempted', subject: 'Math Test', result: '40%' },
      { date: '1 week ago', action: 'Started', subject: 'Reading' },
    ],
    strengths: ['Verbal communication'],
    areasForImprovement: ['All core subjects', 'Attendance', 'Assignment completion', 'Tutoring recommended'],
  },
  {
    id: '15', name: 'Charlotte Lee', avatar: '👩', grade: 'B+', overallProgress: 80, streak: 7,
    subjects: [
      { name: 'Math', progress: 76, trend: 'up', recentScore: 80 },
      { name: 'Reading', progress: 84, trend: 'stable', recentScore: 82 },
      { name: 'Science', progress: 78, trend: 'up', recentScore: 80 },
      { name: 'Writing', progress: 82, trend: 'up', recentScore: 85 },
    ],
    recentActivity: [
      { date: '3 hours ago', action: 'Completed', subject: 'Writing Assignment', result: '85%' },
      { date: 'Yesterday', action: 'Practiced', subject: 'Math Problems', result: '40 min' },
      { date: '2 days ago', action: 'Completed', subject: 'Science Quiz', result: '80%' },
    ],
    strengths: ['Writing skills', 'Steady improvement', 'Class participation'],
    areasForImprovement: ['Advanced math concepts', 'Test confidence'],
  },
  {
    id: '16', name: 'Alexander Garcia', avatar: '👦', grade: 'B', overallProgress: 73, streak: 4,
    subjects: [
      { name: 'Math', progress: 80, trend: 'up', recentScore: 82 },
      { name: 'Reading', progress: 66, trend: 'stable', recentScore: 65 },
      { name: 'Science', progress: 78, trend: 'up', recentScore: 80 },
      { name: 'Writing', progress: 62, trend: 'down', recentScore: 58 },
    ],
    recentActivity: [
      { date: 'Yesterday', action: 'Completed', subject: 'Math Quiz', result: '82%' },
      { date: '2 days ago', action: 'Attempted', subject: 'Essay', result: '58%' },
      { date: '3 days ago', action: 'Practiced', subject: 'Science Review', result: '30 min' },
    ],
    strengths: ['Math skills', 'Science interest', 'Hands-on projects'],
    areasForImprovement: ['Written communication', 'Reading analysis', 'Proofreading'],
  },
  {
    id: '17', name: 'Amelia White', avatar: '👩', grade: 'A-', overallProgress: 86, streak: 14,
    subjects: [
      { name: 'Math', progress: 84, trend: 'stable', recentScore: 83 },
      { name: 'Reading', progress: 90, trend: 'up', recentScore: 92 },
      { name: 'Science', progress: 82, trend: 'stable', recentScore: 80 },
      { name: 'Writing', progress: 88, trend: 'up', recentScore: 91 },
    ],
    recentActivity: [
      { date: '2 hours ago', action: 'Completed', subject: 'AP English Essay', result: '91%' },
      { date: 'Today', action: 'Practiced', subject: 'Statistics', result: '30 min' },
      { date: 'Yesterday', action: 'Mastered', subject: 'Grammar Rules', result: '100%' },
    ],
    strengths: ['Language arts mastery', 'Academic writing', 'Critical reading'],
    areasForImprovement: ['Statistics', 'Lab report writing'],
  },
  {
    id: '18', name: 'Daniel Taylor', avatar: '👦', grade: 'C+', overallProgress: 56, streak: 1,
    subjects: [
      { name: 'Math', progress: 52, trend: 'stable', recentScore: 54 },
      { name: 'Reading', progress: 58, trend: 'down', recentScore: 55 },
      { name: 'Science', progress: 62, trend: 'up', recentScore: 65 },
      { name: 'Writing', progress: 48, trend: 'down', recentScore: 45 },
    ],
    recentActivity: [
      { date: '2 days ago', action: 'Completed', subject: 'Science Quiz', result: '65%' },
      { date: '5 days ago', action: 'Attempted', subject: 'Writing Assignment', result: '45%' },
    ],
    strengths: ['Science engagement', 'Group work'],
    areasForImprovement: ['Writing fundamentals', 'Reading comprehension', 'Study schedule'],
  },
  {
    id: '19', name: 'Harper Anderson', avatar: '👩', grade: 'B', overallProgress: 76, streak: 6,
    subjects: [
      { name: 'Math', progress: 72, trend: 'up', recentScore: 75 },
      { name: 'Reading', progress: 80, trend: 'stable', recentScore: 78 },
      { name: 'Science', progress: 74, trend: 'up', recentScore: 76 },
      { name: 'Writing', progress: 78, trend: 'stable', recentScore: 77 },
    ],
    recentActivity: [
      { date: 'Yesterday', action: 'Completed', subject: 'Reading Assignment', result: '78%' },
      { date: '2 days ago', action: 'Practiced', subject: 'Algebra', result: '25 min' },
      { date: '3 days ago', action: 'Completed', subject: 'Writing Draft', result: '77%' },
    ],
    strengths: ['Balanced performance', 'Good attendance', 'Homework completion'],
    areasForImprovement: ['Math confidence', 'Deeper analysis in essays'],
  },
  {
    id: '20', name: 'Benjamin Moore', avatar: '👦', grade: 'B+', overallProgress: 79, streak: 8,
    subjects: [
      { name: 'Math', progress: 85, trend: 'up', recentScore: 88 },
      { name: 'Reading', progress: 74, trend: 'stable', recentScore: 72 },
      { name: 'Science', progress: 84, trend: 'up', recentScore: 86 },
      { name: 'Writing', progress: 70, trend: 'stable', recentScore: 68 },
    ],
    recentActivity: [
      { date: '3 hours ago', action: 'Completed', subject: 'Geometry Test', result: '88%' },
      { date: 'Yesterday', action: 'Practiced', subject: 'Physics', result: '40 min' },
      { date: '2 days ago', action: 'Reviewed', subject: 'Writing Feedback' },
    ],
    strengths: ['Mathematical reasoning', 'Scientific thinking', 'Persistence'],
    areasForImprovement: ['Literary analysis', 'Essay organization', 'Vocabulary range'],
  },
  {
    id: '21', name: 'Ella Jackson', avatar: '👩', grade: 'A-', overallProgress: 83, streak: 11,
    subjects: [
      { name: 'Math', progress: 80, trend: 'stable', recentScore: 79 },
      { name: 'Reading', progress: 86, trend: 'up', recentScore: 88 },
      { name: 'Science', progress: 82, trend: 'stable', recentScore: 81 },
      { name: 'Writing', progress: 84, trend: 'up', recentScore: 87 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Completed', subject: 'Literature Analysis', result: '88%' },
      { date: 'Today', action: 'Practiced', subject: 'Trigonometry', result: '30 min' },
      { date: 'Yesterday', action: 'Completed', subject: 'Lab Report', result: '81%' },
    ],
    strengths: ['Literary analysis', 'Consistent performer', 'Research skills'],
    areasForImprovement: ['Advanced math', 'Science experimentation'],
  },
  {
    id: '22', name: 'Ryan Mitchell', avatar: '👦', grade: 'D+', overallProgress: 40, streak: 0,
    subjects: [
      { name: 'Math', progress: 32, trend: 'down', recentScore: 35 },
      { name: 'Reading', progress: 45, trend: 'down', recentScore: 42 },
      { name: 'Science', progress: 42, trend: 'stable', recentScore: 40 },
      { name: 'Writing', progress: 38, trend: 'down', recentScore: 35 },
    ],
    recentActivity: [
      { date: '1 week ago', action: 'Attempted', subject: 'Math Quiz', result: '35%' },
      { date: '10 days ago', action: 'Started', subject: 'Reading' },
    ],
    strengths: ['Verbal participation when present'],
    areasForImprovement: ['All subjects', 'Attendance', 'Assignment submission', 'Immediate intervention needed'],
  },
  {
    id: '23', name: 'Zoe Carter', avatar: '👩', grade: 'B', overallProgress: 72, streak: 4,
    subjects: [
      { name: 'Math', progress: 68, trend: 'up', recentScore: 72 },
      { name: 'Reading', progress: 76, trend: 'stable', recentScore: 74 },
      { name: 'Science', progress: 70, trend: 'up', recentScore: 73 },
      { name: 'Writing', progress: 74, trend: 'stable', recentScore: 72 },
    ],
    recentActivity: [
      { date: 'Yesterday', action: 'Completed', subject: 'Math Homework', result: '72%' },
      { date: '2 days ago', action: 'Practiced', subject: 'Reading Skills', result: '20 min' },
      { date: '3 days ago', action: 'Completed', subject: 'Lab Activity', result: '73%' },
    ],
    strengths: ['Improving trajectory', 'Good attitude', 'Seeks help when needed'],
    areasForImprovement: ['Math fluency', 'Test-taking strategies'],
  },
  {
    id: '24', name: 'Michael Scott', avatar: '👦', grade: 'B-', overallProgress: 65, streak: 2,
    subjects: [
      { name: 'Math', progress: 62, trend: 'stable', recentScore: 60 },
      { name: 'Reading', progress: 70, trend: 'up', recentScore: 72 },
      { name: 'Science', progress: 66, trend: 'stable', recentScore: 64 },
      { name: 'Writing', progress: 60, trend: 'down', recentScore: 56 },
    ],
    recentActivity: [
      { date: '2 days ago', action: 'Completed', subject: 'Reading Quiz', result: '72%' },
      { date: '4 days ago', action: 'Attempted', subject: 'Essay Draft', result: '56%' },
    ],
    strengths: ['Reading improvement', 'Class engagement'],
    areasForImprovement: ['Writing structure', 'Math problem solving', 'Time management'],
  },
  {
    id: '25', name: 'Sophia Nguyen', avatar: '👩', grade: 'A', overallProgress: 92, streak: 20,
    subjects: [
      { name: 'Math', progress: 94, trend: 'up', recentScore: 95 },
      { name: 'Reading', progress: 90, trend: 'stable', recentScore: 89 },
      { name: 'Science', progress: 93, trend: 'up', recentScore: 95 },
      { name: 'Writing', progress: 90, trend: 'up', recentScore: 92 },
    ],
    recentActivity: [
      { date: '1 hour ago', action: 'Mastered', subject: 'AP Biology', result: '95%' },
      { date: 'Today', action: 'Completed', subject: 'Calculus Practice', result: '95%' },
      { date: 'Yesterday', action: 'Completed', subject: 'Research Essay', result: '92%' },
    ],
    strengths: ['Top performer', 'Self-motivated', 'Strong across all subjects'],
    areasForImprovement: ['Consider AP/honors courses', 'Leadership development'],
  },
];

// Compute class data dynamically
const computeClassData = (students: StudentData[]): ClassData => {
  const avgProgress = Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length);
  const avgStreak = Math.round(students.reduce((sum, s) => sum + s.streak, 0) / students.length);
  const activeToday = students.filter(s => s.streak > 0).length;

  const subjects = ['Math', 'Reading', 'Science', 'Writing'];
  const subjectBreakdown = subjects.map(name => {
    const scores = students.map(s => s.subjects.find(sub => sub.name === name)?.progress ?? 0);
    return {
      name,
      classAverage: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      studentCount: students.length,
    };
  });

  const sorted = [...students].sort((a, b) => b.overallProgress - a.overallProgress);
  const topPerformers = sorted.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0] + ' ' + s.name.split(' ')[1]?.[0] + '.',
    progress: s.overallProgress,
  }));

  const needsAttention = students
    .filter(s => s.overallProgress < 60 || s.streak === 0)
    .sort((a, b) => a.overallProgress - b.overallProgress)
    .slice(0, 5)
    .map(s => ({
      name: s.name.split(' ')[0] + ' ' + s.name.split(' ')[1]?.[0] + '.',
      issue: s.overallProgress < 50
        ? 'Critical - needs immediate support'
        : s.streak === 0
        ? 'No recent activity'
        : 'Falling behind in multiple subjects',
      studentId: s.id,
    }));

  return {
    totalStudents: students.length,
    averageProgress: avgProgress,
    activeToday,
    averageStreak: avgStreak,
    topPerformers,
    needsAttention,
    subjectBreakdown,
    weeklyActivity: [85, 92, 78, 95, 88, 42, 38],
  };
};

const MOCK_CLASS_DATA = computeClassData(ALL_STUDENTS);

type PerformanceFilter = 'all' | 'high' | 'mid' | 'low';

export default function AnalyticsDashboardDemo() {
  const [view, setView] = useState<'class' | 'student'>('class');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceFilter>('all');
  const [drillDownSubject, setDrillDownSubject] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const filteredStudents = useMemo(() => {
    return ALL_STUDENTS.filter(s => {
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (performanceFilter === 'high' && s.overallProgress < 80) return false;
      if (performanceFilter === 'mid' && (s.overallProgress < 60 || s.overallProgress >= 80)) return false;
      if (performanceFilter === 'low' && s.overallProgress >= 60) return false;
      return true;
    });
  }, [searchQuery, performanceFilter]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportCSV = () => {
    const headers = ['Name', 'Grade', 'Overall Progress', 'Streak', 'Math', 'Reading', 'Science', 'Writing', 'Strengths', 'Areas for Improvement'];
    const rows = ALL_STUDENTS.map(s => [
      s.name,
      s.grade,
      s.overallProgress,
      s.streak,
      s.subjects.find(sub => sub.name === 'Math')?.progress ?? '',
      s.subjects.find(sub => sub.name === 'Reading')?.progress ?? '',
      s.subjects.find(sub => sub.name === 'Science')?.progress ?? '',
      s.subjects.find(sub => sub.name === 'Writing')?.progress ?? '',
      s.strengths.join('; '),
      s.areasForImprovement.join('; '),
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Class_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportStudentPDF = async (student: StudentData) => {
    setIsExportingPDF(true);
    try {
      const { exportStudentReportPDF } = await import('@/lib/utils/export/pdf-student-report');
      await exportStudentReportPDF(student, {
        totalStudents: MOCK_CLASS_DATA.totalStudents,
        averageProgress: MOCK_CLASS_DATA.averageProgress,
        subjectAverages: MOCK_CLASS_DATA.subjectBreakdown,
      });
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setIsExportingPDF(false);
  };

  const drillDownStudents = useMemo(() => {
    if (!drillDownSubject) return [];
    return [...ALL_STUDENTS]
      .map(s => ({
        ...s,
        subjectData: s.subjects.find(sub => sub.name === drillDownSubject),
      }))
      .filter(s => s.subjectData)
      .sort((a, b) => (b.subjectData?.progress ?? 0) - (a.subjectData?.progress ?? 0));
  }, [drillDownSubject]);

  return (
    <div className="bg-gradient-to-br from-slate-100 to-blue-100 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Student Analytics Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore class-wide insights and individual student progress with real-time data visualization.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl p-1 shadow-lg inline-flex">
            <button
              onClick={() => {
                setView('class');
                setSelectedStudent(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                view === 'class'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Class Overview
            </button>
            <button
              onClick={() => setView('student')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                view === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👤 Student View
            </button>
          </div>
        </div>

        {view === 'class' ? (
          /* Class Overview */
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: MOCK_CLASS_DATA.totalStudents, icon: '👥', color: 'bg-blue-500' },
                { label: 'Class Average', value: `${MOCK_CLASS_DATA.averageProgress}%`, icon: '📊', color: 'bg-green-500' },
                { label: 'Active Today', value: MOCK_CLASS_DATA.activeToday, icon: '✨', color: 'bg-purple-500' },
                { label: 'Avg Streak', value: `${MOCK_CLASS_DATA.averageStreak} days`, icon: '🔥', color: 'bg-orange-500' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                    {metric.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Subject Performance</h3>
                <div className="space-y-4">
                  {MOCK_CLASS_DATA.subjectBreakdown.map((subject, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDrillDownSubject(drillDownSubject === subject.name ? null : subject.name)}
                      className={`w-full text-left rounded-lg p-2 -m-2 transition ${
                        drillDownSubject === subject.name ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 flex items-center gap-1">
                          {subject.name}
                          <svg className={`w-3 h-3 text-gray-400 transition-transform ${drillDownSubject === subject.name ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                        <span className="font-medium">{subject.classAverage}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(subject.classAverage)} transition-all`}
                          style={{ width: `${subject.classAverage}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Drill-down panel */}
                {drillDownSubject && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">{drillDownSubject} — Student Breakdown</h4>
                      <button
                        onClick={() => setDrillDownSubject(null)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto space-y-1.5">
                      {drillDownStudents.map(s => {
                        const progress = s.subjectData?.progress ?? 0;
                        return (
                          <button
                            key={s.id}
                            onClick={() => { setSelectedStudent(s); setView('student'); }}
                            className="w-full flex items-center gap-2 text-xs p-1.5 rounded hover:bg-gray-50 transition"
                          >
                            <span className="w-20 truncate text-left font-medium text-gray-700">{s.name.split(' ')[0]}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${getProgressColor(progress)}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className={`w-8 text-right font-bold ${progress >= 80 ? 'text-green-600' : progress >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {progress}%
                            </span>
                            <span className="text-gray-400">{getTrendIcon(s.subjectData?.trend ?? 'stable')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Weekly Activity</h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${MOCK_CLASS_DATA.weeklyActivity[idx]}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lists Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Performers */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏆 Top Performers</h3>
                <div className="space-y-3">
                  {MOCK_CLASS_DATA.topPerformers.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}</span>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span className="font-bold text-green-600">{student.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">⚠️ Needs Attention</h3>
                <div className="space-y-3">
                  {MOCK_CLASS_DATA.needsAttention.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-yellow-700">{student.issue}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const found = ALL_STUDENTS.find(s => s.id === student.studentId);
                          if (found) {
                            setSelectedStudent(found);
                            setView('student');
                          }
                        }}
                        className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-300 transition"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student List with Search/Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-gray-800">All Students</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students..."
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-44"
                    />
                  </div>
                  {/* Performance filter */}
                  <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                    {([['all', 'All'], ['high', 'High'], ['mid', 'Mid'], ['low', 'Low']] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setPerformanceFilter(key)}
                        className={`px-3 py-1 rounded-md font-medium transition ${
                          performanceFilter === key ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {/* Export CSV */}
                  <button
                    onClick={exportCSV}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setView('student');
                    }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{student.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="font-bold text-blue-600">{student.overallProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${getProgressColor(student.overallProgress)}`}
                        style={{ width: `${student.overallProgress}%` }}
                      />
                    </div>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    No students match your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Student View */
          <div className="space-y-6">
            {/* Student Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {ALL_STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition whitespace-nowrap text-sm ${
                      selectedStudent?.id === student.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{student.avatar}</span>
                    {student.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {selectedStudent ? (
              <>
                {/* Student Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-6">
                    <span className="text-6xl">{selectedStudent.avatar}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Grade: {selectedStudent.grade}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                          🔥 {selectedStudent.streak} day streak
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {selectedStudent.overallProgress}% Progress
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${selectedStudent.overallProgress * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{selectedStudent.overallProgress}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleExportStudentPDF(selectedStudent)}
                        disabled={isExportingPDF}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {isExportingPDF ? 'Exporting...' : 'Export PDF'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subject Progress */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Subject Progress</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedStudent.subjects.map((subject, idx) => {
                      const classAvg = MOCK_CLASS_DATA.subjectBreakdown.find(s => s.name === subject.name);
                      const diff = classAvg ? subject.progress - classAvg.classAverage : 0;
                      return (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{subject.name}</span>
                            <span className={`flex items-center gap-1 ${getTrendColor(subject.trend)}`}>
                              {getTrendIcon(subject.trend)}
                              <span className="text-sm">{subject.trend}</span>
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full ${getProgressColor(subject.progress)}`}
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{subject.progress}% mastery</span>
                            <span>Last score: {subject.recentScore}%</span>
                          </div>
                          {classAvg && (
                            <div className="mt-1 text-xs">
                              <span className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {diff >= 0 ? '+' : ''}{diff}% vs class avg ({classAvg.classAverage}%)
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity & Insights */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {selectedStudent.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                            {activity.action === 'Completed' ? '✅' : activity.action === 'Mastered' ? '🏆' : '📚'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.action}</span> {activity.subject}
                            </p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                          {activity.result && (
                            <span className="font-medium text-blue-600">{activity.result}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">💪 Strengths</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.strengths.map((strength, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">🎯 Areas to Improve</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.areasForImprovement.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <span className="text-5xl mb-4 block">👤</span>
                <p className="text-gray-500">Select a student above to view their detailed analytics</p>
              </div>
            )}
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Dashboard Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📊', title: 'Real-time Data', desc: 'Live progress tracking' },
              { icon: '🎯', title: 'Insights', desc: 'AI-powered recommendations' },
              { icon: '📈', title: 'Trend Analysis', desc: 'Performance over time' },
              { icon: '⚠️', title: 'Early Alerts', desc: 'At-risk identification' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
