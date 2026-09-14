"use client";

import { useTransition } from "react";
import { toggleTodayGoal } from "@/app/dashboard/actions";
import Link from "next/link";

interface Goal {
  id: string;
  name: string;
  completed: boolean;
  value: number;
}

export default function TodayGoals({
  goals,
  today,
  onToggle
}: {
  goals: Goal[];
  today: string;
  onToggle: (id: string, completed: boolean) => Promise<void>;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Today&apos;s Goals</h2>
        <Link
          href="/goals"
          className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors"
        >
          Manage goals
        </Link>
      </div>

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <p className="font-medium text-zinc-600">No active goals yet</p>
            <p className="mt-1 text-sm text-zinc-400">Add goals to start tracking your habits.</p>
            <Link
              href="/goals"
              className="mt-6 inline-flex rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Add a goal
            </Link>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              today={today}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </section>
  );
}

function GoalRow({
  goal,
  today,
  onToggle
}: {
  goal: Goal;
  today: string;
  onToggle: (id: string, completed: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
        goal.completed
          ? "border-emerald-100 bg-emerald-50/30"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => onToggle(goal.id, goal.completed))}
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl border text-xl transition-all duration-200 ${
          goal.completed
            ? "border-emerald-200 bg-emerald-100 text-emerald-700"
            : "border-zinc-200 bg-zinc-50 text-zinc-400 group-hover:border-emerald-200 group-hover:text-emerald-600"
        } ${isPending ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
        aria-label={`${goal.completed ? "Mark incomplete" : "Complete"} ${goal.name}`}
      >
        {isPending ? (
          <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : goal.completed ? (
          "✓"
        ) : (
          "○"
        )}
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`truncate font-semibold tracking-tight ${
          goal.completed ? "text-emerald-900 line-through opacity-60" : "text-zinc-900"
        }`}>
          {goal.name}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-zinc-500">
          {goal.completed ? "Well done!" : "Next up"}
        </p>
      </div>

      <div className={`text-xs font-bold uppercase tracking-widest ${
        goal.completed ? "text-emerald-600" : "text-zinc-400"
      }`}>
        {goal.completed ? "Done" : "To do"}
      </div>
    </div>
  );
}
