"use client";

import type { ProgressData } from "@/lib/progress/data";

export default function PatternsSection({
  patterns,
  distribution,
}: {
  patterns: ProgressData["patterns"];
  distribution: ProgressData["distribution"];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7">
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-900">Day-of-week performance</h3>
        <div className="space-y-4">
          {patterns.dayOfWeek.map((day) => (
            <div key={day.day} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-600">{day.day}</span>
                <span className="text-zinc-900">{day.percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full transition-all ${
                    day.percentage > 70 ? "bg-emerald-500" : day.percentage > 40 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${day.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5">
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-900">Completion distribution</h3>
        <div className="space-y-6">
          {distribution.map((item) => (
            <div key={item.range} className="flex items-center gap-4">
              <span className="w-12 text-xs font-medium text-zinc-500">{item.range}</span>
              <div className="relative h-4 flex-1">
                 <div className="absolute inset-0 rounded-sm bg-zinc-50" />
                 <div
                    className="absolute inset-y-0 rounded-sm bg-emerald-500/20 border-r-2 border-emerald-500"
                    style={{ width: `${(item.count / Math.max(...distribution.map(d => d.count), 1)) * 100}%` }}
                 />
                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600">
                    {item.count} {item.count === 1 ? 'day' : 'days'}
                 </span>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            This shows how often you reach different completion thresholds each day.
          </p>
        </div>
      </div>
    </div>
  );
}
