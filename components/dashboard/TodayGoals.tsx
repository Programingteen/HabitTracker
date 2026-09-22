"use client";

import { useTransition } from "react";
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
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-lg font-bold tracking-[0.08em] text-zinc-900 sm:text-2xl sm:tracking-tight">TODAY</h2>
        <Link
          href="/goals"
          className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors"
        >
          Manage goals
        </Link>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center sm:p-12">
            <p className="font-medium text-zinc-600">No active goals yet</p>
            <p className="mt-1 text-sm text-zinc-400">Add goals to start tracking your habits.</p>
            <Link
              href="/goals"
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors active:bg-zinc-800"
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
      role="button"
      tabIndex={isPending ? -1 : 0}
      aria-label={`${goal.completed ? "Mark incomplete" : "Complete"} ${goal.name}`}
      aria-pressed={goal.completed}
      onClick={() => !isPending && startTransition(() => onToggle(goal.id, goal.completed))}
      onKeyDown={(event) => {
        if (!isPending && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          startTransition(() => onToggle(goal.id, goal.completed));
        }
      }}
      className={`group flex min-h-[76px] items-center gap-4 rounded-2xl border p-4 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
        goal.completed
          ? "border-emerald-100 bg-emerald-50/30"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl border text-xl transition-all duration-200 ${
          goal.completed
            ? "border-emerald-200 bg-emerald-100 text-emerald-700"
            : "border-zinc-200 bg-zinc-50 text-zinc-400 group-hover:border-emerald-200 group-hover:text-emerald-600"
        } ${isPending ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
        aria-hidden="true"
      >
        {isPending ? (
          <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : goal.completed ? (
          "✓"
        ) : (
          "○"
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className={`line-clamp-2 font-semibold tracking-tight ${
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
