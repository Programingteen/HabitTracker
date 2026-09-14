"use client";

import { useState, useTransition } from "react";
import { toggleTodayGoal } from "@/app/dashboard/actions";
import type { DashboardData } from "@/lib/dashboard/data";

import DashboardHeader from "./DashboardHeader";
import TodayProgress from "./TodayProgress";
import TodayGoals from "./TodayGoals";
import MomentumCard from "./MomentumCard";
import WeeklyOverview from "./WeeklyOverview";
import ConsistencyInsight from "./ConsistencyInsight";

export default function Dashboard({ data }: { data: DashboardData }) {
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleToggleGoal(id: string, completed: boolean) {
    setError(null);
    try {
      await toggleTodayGoal(id, data.today, completed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't update this goal.");
      throw err; // Re-throw to handle in component if needed
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <DashboardHeader data={data} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          <TodayProgress
            completed={data.todayCompleted}
            total={data.goals.length}
          />

          <TodayGoals
            goals={data.goals}
            today={data.today}
            onToggle={handleToggleGoal}
          />

          {error && (
            <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <MomentumCard streak={data.streak} />
          <WeeklyOverview days={data.weekDays} today={data.today} />
        </div>
      </div>

      <ConsistencyInsight insight={data.insight} />
    </div>
  );
}
