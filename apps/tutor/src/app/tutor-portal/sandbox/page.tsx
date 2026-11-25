import type { Metadata } from 'next';
import { sandboxLimits } from '../data/pricing';
import { selfServeSignupOn } from '@/lib/tutor/partner-dashboard/core';
import { portalMetadata } from '../seo';
import { RequestForm } from './RequestForm';
import { SignupForm } from './SignupForm';

// Read per request: the switch is a server env line, changed without a rebuild.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = portalMetadata('/sandbox', {
  description: `Sign up and get Voice Tutor sandbox API keys at once: ${sandboxLimits.freeMinutes} free tutoring minutes on the production engine.`,
});

// 2026-11-24: the sandbox is self-serve. This page was a request form answered by hand in a day or two; it
// now asks only what creating the sandbox needs, and the keys arrive as soon as the email is confirmed.
export default function SandboxPage() {
  if (!selfServeSignupOn()) return <RequestForm />;
  return (
    <SignupForm freeMinutes={sandboxLimits.freeMinutes} sessionMinutes={sandboxLimits.maxSessionDurationMinutes} />
  );
}
