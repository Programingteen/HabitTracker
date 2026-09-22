"use client";

import { useTransition } from "react";

type Goal = { id: string; name: string; description?: string | null };

export default function Goals({ goals, onEdit, onDelete }: { goals?: Goal[]; onEdit?: (goal: Goal) => void; onDelete?: (goal: Goal) => void }) {
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {!goals || goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl font-semibold text-zinc-900">No goals yet</p>
          <p className="mt-2 text-zinc-500">
            Start by adding goals that matter to you.
          </p>
          <button
            onClick={() => startTransition(() => undefined)}
            className="mt-4 rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            + Add goal
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id} className="flex justify-between items-center px-4 py-2 border-b border-zinc-200/30">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-medium text-zinc-900">{goal.name}</span>
                {goal.description && (
                  <p className="text-sm text-zinc-400 max-w-2xl line-clamp-2">
                    {goal.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => startTransition(() => onEdit?.(goal))}
                  className="rounded-lg bg-zinc-50 px-3 py-1 text-sm text-zinc-800 hover:bg-zinc-100"
                  aria-label="Edit goal"
                >
                  Edit
                </button>
                <button
                  onClick={() => startTransition(() => onDelete?.(goal))}
                  className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                  aria-label="Delete goal"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
