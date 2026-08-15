'use client';

import React from 'react';
import type { AssignmentContext as AssignmentContextType } from './types';

interface AssignmentContextProps {
  context: AssignmentContextType;
  onChange: (context: AssignmentContextType) => void;
  enabled?: boolean;
}

export default function AssignmentContext({ context, onChange, enabled = true }: AssignmentContextProps) {
  if (!enabled) return null;

  const selectClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent';
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Assignment Context</h4>
      <p className="text-xs text-gray-500 mb-3">
        Setting context helps calibrate detection thresholds for more accurate results.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Grade Level</label>
          <select
            value={context.gradeLevel}
            onChange={(e) => onChange({ ...context, gradeLevel: Number(e.target.value) as 9 | 10 | 11 | 12 })}
            className={selectClass}
          >
            <option value={9}>9th Grade</option>
            <option value={10}>10th Grade</option>
            <option value={11}>11th Grade</option>
            <option value={12}>12th Grade</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Subject</label>
          <select
            value={context.subject}
            onChange={(e) => onChange({ ...context, subject: e.target.value as AssignmentContextType['subject'] })}
            className={selectClass}
          >
            <option value="english">English</option>
            <option value="history">History</option>
            <option value="science">Science</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Assignment Type</label>
          <select
            value={context.assignmentType}
            onChange={(e) => onChange({ ...context, assignmentType: e.target.value as AssignmentContextType['assignmentType'] })}
            className={selectClass}
          >
            <option value="essay">Essay</option>
            <option value="research-paper">Research Paper</option>
            <option value="short-answer">Short Answer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
