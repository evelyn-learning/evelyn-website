import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

export const GOOGLE_SCOPES = [
  // Sign-in scopes — needed so we can read the teacher's own email via userinfo.
  // (classroom.profile.emails grants access to *students'* emails in rosters,
  // not the signed-in user's email — those are different scopes.)
  'openid',
  'email',
  'profile',
  // Classroom + Drive + Docs (read-only).
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/documents.readonly',
];

export function getOAuthClient(): OAuth2Client {
  // Namespaced under GOOGLE_CLASSROOM_* so production can keep separate
  // GOOGLE_CLIENT_ID/SECRET values for GA/GSC tooling.
  const clientId = process.env.GOOGLE_CLASSROOM_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLASSROOM_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CLASSROOM_CALLBACK_URL;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Google Classroom OAuth env vars missing: GOOGLE_CLASSROOM_CLIENT_ID, GOOGLE_CLASSROOM_CLIENT_SECRET, GOOGLE_CLASSROOM_CALLBACK_URL'
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function isMockMode(): boolean {
  return process.env.MOCK_GOOGLE_CLASSROOM === 'true';
}
