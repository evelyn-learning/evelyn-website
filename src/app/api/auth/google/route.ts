import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient, GOOGLE_SCOPES } from '@/lib/google/oauth-client';
import { encodeOAuthState } from '@/lib/google/oauth-state';

export async function GET(_req: NextRequest) {
  try {
    const client = getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GOOGLE_SCOPES,
      state: encodeOAuthState(),
      include_granted_scopes: true,
    });
    return NextResponse.redirect(url);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'OAuth initiation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
