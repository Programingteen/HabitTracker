"use client";

import type { ProgressData } from "@/lib/progress/data";

export default function GoalBreakdown({ goals }: { goals: ProgressData["goalAnalytics"] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-zinc-100 p-6">
        <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Individual goals</h3>
      </div>
      <div className="divide-y divide-zinc-100 sm:hidden">
        {goals.map((goal) => (
          <div key={goal.id} className="p-4">
            <div className="flex items-start justify-between gap-3"><p className="min-w-0 break-words font-medium text-zinc-900">{goal.name}</p><span className="shrink-0 text-sm font-semibold text-zinc-700">{goal.completionRate}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full bg-emerald-500" style={{ width: `${goal.completionRate}%` }} /></div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500"><span>{goal.completedCount} / {goal.plannedCount} completed</span><span>{goal.currentStreak > 0 ? `⚡ ${goal.currentStreak} day streak` : "No current streak"}</span></div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <th className="px-6 py-4">Goal</th>
              <th className="px-6 py-4">Completion</th>
              <th className="px-6 py-4">Count</th>
              <th className="px-6 py-4">Streak</th>
              <th className="px-6 py-4">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {goals.map((goal) => (
              <tr key={goal.id} className="text-sm">
                <td className="px-6 py-4 font-medium text-zinc-900">{goal.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${goal.completionRate}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-zinc-600">{goal.completionRate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-600 tabular-nums">
                  {goal.completedCount} / {goal.plannedCount}
                </td>
                <td className="px-6 py-4">
                   {goal.currentStreak > 0 ? (
                       <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 border border-orange-100">
                           ⚡ {goal.currentStreak}
                       </span>
                   ) : (
                       <span className="text-zinc-400">—</span>
                   )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
                      goal.trend === "improving"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : goal.trend === "declining"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : "bg-zinc-50 text-zinc-600 border-zinc-100"
                    }`}
                  >
                    {goal.trend === "improving" ? "↑ Improving" : goal.trend === "declining" ? "↓ Declining" : "→ Stable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
