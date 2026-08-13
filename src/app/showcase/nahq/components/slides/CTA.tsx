import { Mail, Phone } from "lucide-react";
import { SlideShell } from "../SlideShell";

export default function CTA() {
  return (
    <SlideShell align="center">
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-300 sm:text-sm">
        Next steps
      </span>
      <h2 className="font-heading mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
        Let&apos;s go through it together.
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
        Questions before, during, or after today&apos;s call — reach us
        directly. This deck is yours to keep.
      </p>
      <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
        <a
          href="mailto:contact@evelynlearning.com"
          className="flex items-center gap-2.5 text-lg font-medium text-white transition-colors hover:text-primary-300"
        >
          <Mail className="h-5 w-5 text-primary-400" />
          contact@evelynlearning.com
        </a>
        <a
          href="tel:+13022120975"
          className="flex items-center gap-2.5 text-lg font-medium text-white transition-colors hover:text-primary-300"
        >
          <Phone className="h-5 w-5 text-primary-400" />
          +1 (302) 212-0975
        </a>
      </div>
    </SlideShell>
  );
}
