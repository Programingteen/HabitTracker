"use client";

import type { ProgressData } from "@/lib/progress/data";

export default function StatsOverview({ overview }: { overview: ProgressData["overview"] }) {
  const { completionRate, completionRateChange, goalsCompleted, goalsPlanned, currentStreak, bestStreak } = overview;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Completion rate"
        value={`${completionRate}%`}
        change={completionRateChange}
        description={`${goalsCompleted} of ${goalsPlanned} goals`}
      />
      <StatCard
        label="Current streak"
        value={currentStreak.toString()}
        description="Consecutive days"
        icon="⚡"
      />
      <StatCard
        label="Best streak"
        value={bestStreak.toString()}
        description="Personal record"
        icon="🏆"
      />
      <StatCard
        label="Consistency"
        value={completionRate > 70 ? "High" : completionRate > 40 ? "Moderate" : "Low"}
        description="Based on activity"
        icon="📊"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  description,
  icon,
}: {
  label: string;
  value: string;
  change?: number | null;
  description: string;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-zinc-900">{value}</span>
        {change !== undefined && change !== null && (
          <span
            className={`text-xs font-bold ${
              change >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
