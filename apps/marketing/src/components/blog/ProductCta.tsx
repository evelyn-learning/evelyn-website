import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA_COPY, type CtaProduct } from "@/lib/blog/beacon-flags";

/** Product call-to-action shown after a blog article when Beacon set `ctaProduct`. */
export function ProductCta({ product }: { product: CtaProduct }) {
  const copy = CTA_COPY[product];
  return (
    <aside
      className="mt-10 rounded-xl border border-primary-200 bg-primary-50/60 p-6 md:p-8"
      data-cta-product={product}
    >
      <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">{copy.heading}</h2>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{copy.body}</p>
      <Link href={copy.href} className="btn-primary mt-5 inline-flex items-center gap-2">
        {copy.button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
