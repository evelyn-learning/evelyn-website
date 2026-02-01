/**
 * Get Dropbox Refresh Token
 *
 * This script helps you get a refresh token for long-term API access.
 *
 * Step 1: Run this script to get the authorization URL
 * Step 2: Open the URL in your browser and authorize the app
 * Step 3: Copy the authorization code from the redirect
 * Step 4: Run this script again with the code to get your refresh token
 *
 * Usage:
 *   npx tsx scripts/get-dropbox-refresh-token.ts              # Get auth URL
 *   npx tsx scripts/get-dropbox-refresh-token.ts <auth_code>  # Exchange for tokens
 */

const APP_KEY = '3ddxjp6beys8hus';
const APP_SECRET = 'lh8iee2ngxyv7o9';
const REDIRECT_URI = 'http://localhost:3000/api/dropbox/callback';

async function main() {
  const authCode = process.argv[2];

  if (!authCode) {
    // Step 1: Generate authorization URL
    const authUrl = new URL('https://www.dropbox.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', APP_KEY);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('token_access_type', 'offline'); // This gives us a refresh token!
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);

    console.log('🔐 Dropbox OAuth Setup\n');
    console.log('Step 1: Open this URL in your browser:\n');
    console.log(authUrl.toString());
    console.log('\nStep 2: Authorize the app and copy the code from the redirect URL');
    console.log('        (The code appears after "code=" in the URL)\n');
    console.log('Step 3: Run this script again with the code:');
    console.log('        npx tsx scripts/get-dropbox-refresh-token.ts YOUR_CODE_HERE\n');

    // Alternative: Use the simple code flow
    const simpleAuthUrl = new URL('https://www.dropbox.com/oauth2/authorize');
    simpleAuthUrl.searchParams.set('client_id', APP_KEY);
    simpleAuthUrl.searchParams.set('response_type', 'code');
    simpleAuthUrl.searchParams.set('token_access_type', 'offline');

    console.log('Alternative (no redirect needed):');
    console.log(simpleAuthUrl.toString());
    console.log('\n(This will show the code directly on Dropbox\'s page)');
  } else {
    // Step 2: Exchange code for tokens
    console.log('🔄 Exchanging authorization code for tokens...\n');

    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';
    const params = new URLSearchParams({
      code: authCode,
      grant_type: 'authorization_code',
      client_id: APP_KEY,
      client_secret: APP_SECRET,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Error:', error);
        return;
      }

      const data = await response.json();

      console.log('✅ Success! Here are your tokens:\n');
      console.log('Access Token (expires in ~4 hours):');
      console.log(data.access_token);
      console.log('\nRefresh Token (never expires):');
      console.log(data.refresh_token);
      console.log('\nAccount ID:', data.account_id);
      console.log('Token Type:', data.token_type);
      console.log('Expires In:', data.expires_in, 'seconds');

      console.log('\n📝 Add these to your .env.local file:');
      console.log('─'.repeat(50));
      console.log(`DROPBOX_ACCESS_TOKEN=${data.access_token}`);
      console.log(`DROPBOX_REFRESH_TOKEN=${data.refresh_token}`);
      console.log(`DROPBOX_APP_KEY=${APP_KEY}`);
      console.log(`DROPBOX_APP_SECRET=${APP_SECRET}`);
      console.log('─'.repeat(50));
    } catch (error) {
      console.error('❌ Error exchanging code:', error);
    }
  }
}

main();
