import Link from 'next/link';

export function PortalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>&copy; {new Date().getFullYear()} Evelyn Learning.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="https://www.evelynlearning.com/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="https://www.evelynlearning.com/terms" className="hover:text-slate-700">
              Terms
            </Link>
            <a href="mailto:info@evelynlearning.com" className="hover:text-slate-700">
              info@evelynlearning.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
