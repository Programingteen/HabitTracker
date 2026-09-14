"use client";

import type { ProgressData } from "@/lib/progress/data";
import { weekdayLabel } from "@/lib/dashboard/data-utils";

export default function PerformanceChart({
  data,
}: {
  data: ProgressData["performanceOverTime"];
}) {
  if (data.length === 0) return null;

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Performance over time</h3>
        <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-zinc-500">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-zinc-200"></div>
                <span className="text-xs text-zinc-500">Planned</span>
            </div>
        </div>
      </div>

      <div className="relative h-64 w-full">
        <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2">
          {data.map((day, i) => (
            <div key={day.date} className="group relative flex h-full flex-1 flex-col justify-end">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[10px] text-white shadow-xl group-hover:block z-10 whitespace-nowrap">
                <p className="font-semibold">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                <p>{day.completed} / {day.total} goals ({day.percentage}%)</p>
              </div>

              {/* Bar background (total goals) */}
              <div
                className="w-full rounded-t-sm bg-zinc-100 transition-colors group-hover:bg-zinc-200"
                style={{ height: `${(day.total / maxTotal) * 100}%` }}
              >
                {/* Completion fill */}
                <div
                    className="w-full rounded-t-sm bg-emerald-500 transition-all"
                    style={{ height: `${(day.completed / (day.total || 1)) * 100}%` }}
                />
              </div>

              {/* X-axis labels (only show some on mobile) */}
              <div className={`mt-2 text-center text-[10px] text-zinc-400 ${data.length > 10 && i % Math.ceil(data.length / 7) !== 0 ? 'hidden sm:block' : ''}`}>
                {weekdayLabel(day.date).slice(0, 1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
