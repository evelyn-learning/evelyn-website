import { google } from 'googleapis';
import { getAuthorizedClient } from './token-refresh';
import { isMockMode } from './oauth-client';
import type {
  ClassroomCourse,
  ClassroomAssignment,
  ClassroomSubmission,
  ClassroomAttachment,
} from './types';

export async function listActiveCourses(teacherId: string): Promise<ClassroomCourse[]> {
  if (isMockMode()) {
    const { mockCourses } = await import('./__mocks__/fixtures');
    return mockCourses;
  }

  const auth = await getAuthorizedClient(teacherId);
  const classroom = google.classroom({ version: 'v1', auth });
  const res = await classroom.courses.list({
    teacherId: 'me',
    courseStates: ['ACTIVE'],
    pageSize: 100,
  });
  return (res.data.courses || []).map((c) => ({
    id: c.id || '',
    name: c.name || '(untitled)',
    section: c.section || undefined,
    descriptionHeading: c.descriptionHeading || undefined,
    courseState: c.courseState || undefined,
  }));
}

export async function listAssignments(
  teacherId: string,
  courseId: string
): Promise<ClassroomAssignment[]> {
  if (isMockMode()) {
    const { mockAssignmentsByCourse } = await import('./__mocks__/fixtures');
    return mockAssignmentsByCourse[courseId] || [];
  }

  const auth = await getAuthorizedClient(teacherId);
  const classroom = google.classroom({ version: 'v1', auth });
  const res = await classroom.courses.courseWork.list({
    courseId,
    courseWorkStates: ['PUBLISHED'],
    pageSize: 100,
  });
  return (res.data.courseWork || []).map((w) => {
    const due = w.dueDate
      ? `${w.dueDate.year}-${String(w.dueDate.month).padStart(2, '0')}-${String(w.dueDate.day).padStart(2, '0')}`
      : undefined;
    return {
      id: w.id || '',
      courseId,
      title: w.title || '(untitled)',
      description: w.description || undefined,
      dueDate: due,
      workType: w.workType || undefined,
      state: w.state || undefined,
    };
  });
}

export async function listSubmissions(
  teacherId: string,
  courseId: string,
  assignmentId: string
): Promise<ClassroomSubmission[]> {
  if (isMockMode()) {
    const { mockSubmissionsByAssignment } = await import('./__mocks__/fixtures');
    return mockSubmissionsByAssignment[`${courseId}::${assignmentId}`] || [];
  }

  const auth = await getAuthorizedClient(teacherId);
  const classroom = google.classroom({ version: 'v1', auth });

  const subRes = await classroom.courses.courseWork.studentSubmissions.list({
    courseId,
    courseWorkId: assignmentId,
    pageSize: 200,
  });

  const submissions = subRes.data.studentSubmissions || [];

  const studentIds = Array.from(
    new Set(submissions.map((s) => s.userId).filter((id): id is string => !!id))
  );
  const nameByStudentId: Record<string, { name: string; email?: string }> = {};
  await Promise.all(
    studentIds.map(async (uid) => {
      try {
        const profile = await classroom.userProfiles.get({ userId: uid });
        nameByStudentId[uid] = {
          name: profile.data.name?.fullName || '(unknown)',
          email: profile.data.emailAddress || undefined,
        };
      } catch {
        nameByStudentId[uid] = { name: '(name unavailable)' };
      }
    })
  );

  return submissions.map((s) => {
    const attachments: ClassroomAttachment[] = [];
    for (const a of s.assignmentSubmission?.attachments || []) {
      if (a.driveFile?.id) {
        attachments.push({
          driveFileId: a.driveFile.id,
          title: a.driveFile.title || undefined,
        });
      }
    }

    const profile = s.userId ? nameByStudentId[s.userId] : undefined;
    return {
      id: s.id || '',
      courseId,
      assignmentId,
      studentId: s.userId || '',
      studentName: profile?.name || '(unknown student)',
      studentEmail: profile?.email,
      state: s.state || undefined,
      submittedAt: s.updateTime || undefined,
      attachments,
    };
  });
}
