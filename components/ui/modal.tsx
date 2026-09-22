"use client";

import type { ReactNode } from "react";

export default function Modal({ open, onClose, title, onAction, actionLabel, actionVariant, children }: { open: boolean; onClose: () => void; title: string; onAction?: () => void; actionLabel?: string; actionVariant?: "destructive" | "default"; children: ReactNode }) {
  if (!open) return null;

  const isDestructive = actionVariant === "destructive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
          >
            Cancel
          </button>
          {onAction && (
            <button
              onClick={onAction}
              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-emerald-500 hover:bg-emerald-600"}`}
            >
              {actionLabel || "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
