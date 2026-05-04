import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../src/lib/db';
import { Teacher } from '../src/models/Teacher';
import { encryptToken } from '../src/lib/crypto/token-encryption';

const TEACHER_EMAIL = process.argv[2] || 'praveen@evelynlearning.com';
const TEACHER_NAME = process.argv[3] || 'Praveen (test teacher)';
const MOCK_MODE = process.env.MOCK_GOOGLE_CLASSROOM === 'true';

async function main() {
  await connectDB();

  const update: Record<string, unknown> = {
    email: TEACHER_EMAIL.toLowerCase(),
    name: TEACHER_NAME,
  };

  if (MOCK_MODE) {
    update.googleAuth = {
      accessToken: encryptToken('mock-access-token-not-real'),
      refreshToken: encryptToken('mock-refresh-token-not-real'),
      tokenExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      connectedEmail: TEACHER_EMAIL.toLowerCase(),
      connectedAt: new Date(),
    };
  }

  const teacher = await Teacher.findOneAndUpdate(
    { email: TEACHER_EMAIL.toLowerCase() },
    { $set: update },
    { upsert: true, new: true }
  );

  console.log('\n─────────────────────────────────────────────');
  console.log('Teacher seeded successfully.');
  console.log('─────────────────────────────────────────────');
  console.log(`Email:      ${teacher.email}`);
  console.log(`Name:       ${teacher.name}`);
  console.log(`Teacher ID: ${teacher._id}`);
  console.log(`Mock auth:  ${MOCK_MODE ? 'YES (placeholder googleAuth set)' : 'no (will require OAuth)'}`);
  console.log('─────────────────────────────────────────────');
  console.log('\nTo skip the OAuth flow during local testing, paste this in the browser console');
  console.log('on http://localhost:3006/showcase/plagiarism-detection :\n');
  console.log(`localStorage.setItem('plagiarism_teacher_id', '${teacher._id}')`);
  if (MOCK_MODE) {
    console.log(`localStorage.setItem('plagiarism_teacher_email', '${teacher.email}')`);
  }
  console.log('\nThen reload the page. The Classroom tab will show as connected.\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
