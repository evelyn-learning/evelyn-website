import { SlideShell } from "@/components/showcase-deck/SlideShell";

const US = ["Hosting, uptime, security and data protection", "Curriculum adaptation and review cycles", "Platform updates and support", "Onboarding and admin training", "Weekly reports and the admin dashboard"];
const YOU = ["Your syllabus and written material", "A subject expert to review and approve modules", "Brand assets and a subdomain (DNS)", "Student rosters and named admins", "Students with a device, a microphone and internet"];

export default function WhoDoesWhat() {
  return (
    <SlideShell kicker="Before you ask" title="Who does what, and who owns what" subtitle="A managed white-label deployment: we build, host and operate; the adapted content and your student data are yours, exportable at any time.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[["Evelyn takes care of", US], ["United Trade School provides", YOU]].map(([t, items]) => (
          <div key={t as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-lg font-semibold text-white">{t as string}</p>
            <ul className="mt-4 space-y-2">
              {(items as string[]).map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-300" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
