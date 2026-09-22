"use client";

import type { ProgressData } from "@/lib/progress/data";

export default function InsightsSection({
  insights,
  nextFocus,
}: {
  insights: ProgressData["insights"];
  nextFocus: ProgressData["nextFocus"];
}) {
  return (
    <div className="space-y-5 sm:space-y-8">
      {nextFocus && (
        <div className="rounded-2xl border-2 border-emerald-500/10 bg-emerald-50/30 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-xl text-white shadow-lg shadow-emerald-500/20">
              🎯
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Your next focus</h3>
              <p className="mt-1 text-lg font-semibold text-emerald-950">{nextFocus.title}</p>
              <p className="mt-1 text-sm text-emerald-800/80">{nextFocus.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-700">What's working</h3>
          <ul className="space-y-3">
            {insights.strengths.length > 0 ? insights.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {s}
              </li>
            )) : (
                <li className="text-sm text-zinc-400 italic">Continue tracking to see strengths.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose-700">Where you're struggling</h3>
          <ul className="space-y-3">
            {insights.weaknesses.length > 0 ? insights.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                <span className="text-rose-500 mt-0.5">!</span>
                {w}
              </li>
            )) : (
                <li className="text-sm text-zinc-400 italic">No significant weaknesses detected.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
