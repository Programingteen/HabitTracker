"use client";

import { useState } from "react";
import { addGoal, editGoal, deleteGoal } from "@/app/goals/actions";

interface GoalRow {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

interface GoalListProps {
  goals: GoalRow[];
}

export function GoalList({ goals }: GoalListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  async function handleAddGoal(formData: FormData) {
    setPendingAction("add");
    setError(null);
    try {
      await addGoal(formData);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add goal.");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEditGoal(formData: FormData) {
    setPendingAction("edit");
    setError(null);
    try {
      await editGoal(formData);
      setEditGoalId(null);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal.");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDeleteGoal(formData: FormData) {
    setPendingAction("delete");
    setError(null);
    try {
      await deleteGoal(formData);
      setDeleteGoalId(null);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal.");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100 mb-6">
          {error}
        </div>
      )}

      <div className="mb-5 sm:mb-6">
        <button
          onClick={() => { setEditGoalId(null); setIsModalOpen(true); }}
          className="flex min-h-12 w-full items-center justify-center space-x-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition active:bg-emerald-600 sm:w-auto"
        >
          <span>+ Add goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl font-semibold text-zinc-900">No goals yet</p>
          <p className="mt-2 text-zinc-500">Start by adding goals that matter to you.</p>
          <button
            onClick={() => { setEditGoalId(null); setIsModalOpen(true); }}
            className="mt-4 rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            + Add goal
          </button>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {goals.map((goal) => (
            <li key={goal.id} className="rounded-2xl border border-zinc-200 bg-white p-4 transition sm:flex sm:items-center sm:justify-between sm:px-4 sm:py-3">
              <div className="min-w-0">
                <span className="block break-words text-base font-semibold text-zinc-900">{goal.name}</span>
                {goal.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{goal.description}</p>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:ml-4 sm:mt-0 sm:flex sm:shrink-0">
                <button
                  onClick={() => { setEditGoalId(goal.id); setIsModalOpen(true); }}
                  className="min-h-11 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition active:bg-zinc-200"
                  aria-label={`Edit ${goal.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteGoalId(goal.id)}
                  className="min-h-11 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition active:bg-red-100"
                  aria-label={`Delete ${goal.name}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setIsModalOpen(false); setEditGoalId(null); }} />
          <div className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              {editGoalId ? "Edit goal" : "Add goal"}
            </h2>
            <form action={editGoalId ? handleEditGoal : handleAddGoal} className="mt-4 space-y-4">
              {editGoalId && <input type="hidden" name="goal-id" value={editGoalId} />}
              <div>
                <label htmlFor="goal-name" className="block text-sm font-medium text-zinc-700">Goal name</label>
                <input
                  id="goal-name"
                  name="goal-name"
                  type="text"
                  defaultValue={editGoalId ? goals.find(g => g.id === editGoalId)?.name : ""}
                  placeholder="Enter your goal"
                  className="mt-1 block min-h-12 w-full rounded-xl border-zinc-300 px-3 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="goal-description" className="block text-sm font-medium text-zinc-700">Description (optional)</label>
                <textarea
                  id="goal-description"
                  name="goal-description"
                  defaultValue={editGoalId ? goals.find(g => g.id === editGoalId)?.description || "" : ""}
                  placeholder="Add a description for your goal"
                  rows={3}
                  className="mt-1 block w-full rounded-xl border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditGoalId(null); }}
                  disabled={pendingAction !== null}
                  className="min-h-12 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pendingAction !== null}
                  className="min-h-12 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
                >
                  {pendingAction === "edit" ? "Saving..." : pendingAction === "add" ? "Adding..." : editGoalId ? "Save changes" : "Add goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteGoalId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteGoalId(null)} />
          <div className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Delete goal</h2>
            <p className="mt-2 text-zinc-600">
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
            <form action={handleDeleteGoal} className="mt-4">
              <input type="hidden" name="goal-id" value={deleteGoalId} />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteGoalId(null)}
                  disabled={pendingAction === "delete"}
                  className="min-h-12 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pendingAction === "delete"}
                  className="min-h-12 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
                >
                  {pendingAction === "delete" ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
