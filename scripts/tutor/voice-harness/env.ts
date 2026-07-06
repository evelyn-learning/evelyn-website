// scripts/tutor/voice-harness/env.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export function requireKey(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in env / .env.local`);
  return v;
}
