/**
 * Student Progress — Prior-Session Lookup
 *
 * Given a studentName + subject/topic/level triplet, return a merged view
 * of the student's weak topics and topics covered across their recent
 * completed sessions. Consumed at the start of a new session so the tutor
 * can proactively surface targeted review of whatever the student
 * struggled with most last time.
 *
 * We match by lowercased studentName + exact subject/topic/level. This is
 * sufficient for the current demo identity model (no login — studentName
 * is a free-text field). If a student uses a different name variation,
 * they simply start fresh, which is acceptable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TutorSession } from '@/models';

const RECENT_SESSIONS_LIMIT = 5;          // How many prior sessions to aggregate
const RECENT_SESSIONS_WINDOW_DAYS = 30;   // Only consider sessions within the last N days

interface RequestBody {
  studentName?: string;
  subject?: string;
  topic?: string;
  level?: string;
  excludeSessionId?: string;
}

interface WeakTopicDoc { topic: string; count: number }

interface SessionDoc {
  _id: unknown;
  sessionId?: string;
  startedAt?: Date;
  weakTopics?: WeakTopicDoc[];
  topicsCovered?: string[];
  duration?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const studentName = (body.studentName || '').trim();
    const subject = (body.subject || '').trim();
    const topic = (body.topic || '').trim();
    const level = (body.level || '').trim();

    // No student name → nothing to personalize.
    if (!studentName) {
      return NextResponse.json({
        sessionCount: 0,
        weakTopics: [],
        topicsCovered: [],
        lastSessionAt: null,
      });
    }

    await connectDB();

    const since = new Date(Date.now() - RECENT_SESSIONS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const query: Record<string, unknown> = {
      studentName: { $regex: `^${escapeRegex(studentName)}$`, $options: 'i' },
      status: 'completed',
      startedAt: { $gte: since },
    };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (level) query.level = level;
    if (body.excludeSessionId) query.sessionId = { $ne: body.excludeSessionId };

    const sessions = await TutorSession.find(query)
      .sort({ startedAt: -1 })
      .limit(RECENT_SESSIONS_LIMIT)
      .select('sessionId startedAt weakTopics topicsCovered duration')
      .lean<SessionDoc[]>();

    if (sessions.length === 0) {
      return NextResponse.json({
        sessionCount: 0,
        weakTopics: [],
        topicsCovered: [],
        lastSessionAt: null,
      });
    }

    // Merge weakTopics (sum counts across sessions)
    const weakMap = new Map<string, number>();
    for (const s of sessions) {
      for (const wt of s.weakTopics || []) {
        if (!wt?.topic) continue;
        weakMap.set(wt.topic, (weakMap.get(wt.topic) || 0) + (wt.count || 1));
      }
    }
    const weakTopics = Array.from(weakMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Union topicsCovered (preserve first-seen order)
    const topicsSeen = new Set<string>();
    const topicsCovered: string[] = [];
    for (const s of sessions) {
      for (const t of s.topicsCovered || []) {
        if (!t || topicsSeen.has(t)) continue;
        topicsSeen.add(t);
        topicsCovered.push(t);
      }
    }

    const lastSessionAt = sessions[0].startedAt ? sessions[0].startedAt : null;

    return NextResponse.json({
      sessionCount: sessions.length,
      weakTopics,
      topicsCovered,
      lastSessionAt,
    });
  } catch (err) {
    console.error('[student-progress] error:', err);
    return NextResponse.json({
      sessionCount: 0,
      weakTopics: [],
      topicsCovered: [],
      lastSessionAt: null,
    });
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
