import { connectDB } from '@/lib/db';
import { Teacher } from '@/models/Teacher';
import { decryptToken, encryptToken } from '@/lib/crypto/token-encryption';
import { getOAuthClient } from './oauth-client';
import type { OAuth2Client } from 'google-auth-library';

export class GoogleAuthError extends Error {
  code: 'NOT_CONNECTED' | 'INVALID_GRANT' | 'REFRESH_FAILED';
  constructor(code: 'NOT_CONNECTED' | 'INVALID_GRANT' | 'REFRESH_FAILED', message: string) {
    super(message);
    this.code = code;
    this.name = 'GoogleAuthError';
  }
}

const EXPIRY_SKEW_MS = 60_000;

export async function getAuthorizedClient(teacherId: string): Promise<OAuth2Client> {
  await connectDB();
  const teacher = await Teacher.findById(teacherId);
  if (!teacher || !teacher.googleAuth) {
    throw new GoogleAuthError('NOT_CONNECTED', 'Teacher has no Google Classroom connection.');
  }

  const auth = teacher.googleAuth;
  let accessToken = decryptToken(auth.accessToken);
  const refreshToken = decryptToken(auth.refreshToken);
  let tokenExpiry = auth.tokenExpiry;

  const client = getOAuthClient();
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: tokenExpiry.getTime(),
  });

  const expired = !tokenExpiry || tokenExpiry.getTime() - EXPIRY_SKEW_MS < Date.now();
  if (expired) {
    try {
      const { credentials } = await client.refreshAccessToken();
      if (!credentials.access_token) {
        throw new GoogleAuthError('REFRESH_FAILED', 'Refresh response missing access_token.');
      }
      accessToken = credentials.access_token;
      tokenExpiry = new Date(credentials.expiry_date || Date.now() + 3500 * 1000);

      teacher.googleAuth = {
        ...auth,
        accessToken: encryptToken(accessToken),
        refreshToken: credentials.refresh_token
          ? encryptToken(credentials.refresh_token)
          : auth.refreshToken,
        tokenExpiry,
      };
      await teacher.save();

      client.setCredentials({
        access_token: accessToken,
        refresh_token: credentials.refresh_token || refreshToken,
        expiry_date: tokenExpiry.getTime(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('invalid_grant')) {
        throw new GoogleAuthError('INVALID_GRANT', 'Refresh token revoked. User must reconnect.');
      }
      throw new GoogleAuthError('REFRESH_FAILED', `Token refresh failed: ${msg}`);
    }
  }

  return client;
}
