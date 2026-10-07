"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import SolutionPlayer from "../../_components/SolutionPlayer";
import { SHOWCASE } from "../../_lib/config";
import { findSolution } from "../../_solutions";

export default function SolutionPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const solution = findSolution(itemId);
  if (!solution) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-slate-900">No sample for item {itemId}</h1>
        <p className="mt-3 text-slate-700">
          <Link href={`${SHOWCASE.basePath}/solutions`} className="font-medium text-primary-600 hover:text-primary-800">See the available sample solutions</Link>
        </p>
      </div>
    );
  }
  // Keyed so moving between items resets playback.
  return <SolutionPlayer key={solution.itemId} solution={solution} />;
}
