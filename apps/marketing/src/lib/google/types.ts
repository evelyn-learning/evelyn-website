export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  courseState?: string;
}

export interface ClassroomAssignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  workType?: string;
  state?: string;
}

export interface ClassroomAttachment {
  driveFileId: string;
  title?: string;
  mimeType?: string;
}

export interface ClassroomSubmission {
  id: string;
  courseId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  state?: string;
  submittedAt?: string;
  attachments: ClassroomAttachment[];
}
