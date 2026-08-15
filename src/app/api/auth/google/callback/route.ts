import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getOAuthClient } from '@/lib/google/oauth-client';
import { encryptToken } from '@/lib/crypto/token-encryption';
import { verifyOAuthState } from '@/lib/google/oauth-state';
import { connectDB } from '@core/db';
import { Teacher } from '@core/models/Teacher';

const SHOWCASE_PATH = '/showcase/plagiarism-detection';

function appBaseUrl(req: NextRequest): string {
  const callback = process.env.GOOGLE_CLASSROOM_CALLBACK_URL || '';
  try {
    const u = new URL(callback);
    return `${u.protocol}//${u.host}`;
  } catch {
    return new URL(req.url).origin;
  }
}

function errorRedirect(base: string, code: string) {
  const url = new URL(SHOWCASE_PATH, base);
  url.searchParams.set('google_error', code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const base = appBaseUrl(req);
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) return errorRedirect(base, error);
  if (!code) return errorRedirect(base, 'missing_code');

  const stateCheck = verifyOAuthState(state);
  if (!stateCheck.ok) {
    return errorRedirect(base, `state_${stateCheck.reason}`);
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return errorRedirect(base, 'missing_tokens');
    }

    client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const profile = await oauth2.userinfo.get();
    const email = profile.data.email?.toLowerCase();
    if (!email) return errorRedirect(base, 'missing_email');

    await connectDB();

    const expiry = new Date(tokens.expiry_date || Date.now() + 3500 * 1000);

    const teacher = await Teacher.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          name: profile.data.name || undefined,
          googleAuth: {
            accessToken: encryptToken(tokens.access_token),
            refreshToken: encryptToken(tokens.refresh_token),
            tokenExpiry: expiry,
            connectedEmail: email,
            connectedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    const redirectUrl = new URL(SHOWCASE_PATH, base);
    redirectUrl.searchParams.set('google_connected', 'true');
    redirectUrl.searchParams.set('teacher_id', String(teacher._id));
    redirectUrl.searchParams.set('teacher_email', email);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'callback_failed';
    console.error('Google OAuth callback error:', msg);
    return errorRedirect(base, 'callback_failed');
  }
}
