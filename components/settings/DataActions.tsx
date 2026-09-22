"use client";

import { useState } from "react";
import { exportUserData, deleteAccount } from "@/app/settings/actions";

export default function DataActions() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `habittracker-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (err) {
      alert("Failed to delete account");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-medium text-zinc-900">Export my data</p>
          <p className="text-[13px] text-zinc-500">Download a JSON file of your goals and history.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="min-h-11 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "Export data"}
        </button>
      </div>

      <div className="pt-2">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="min-h-11 px-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Delete my account
          </button>
        ) : (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
            <p className="text-sm font-medium text-red-900">Are you absolutely sure?</p>
            <p className="mt-1 text-[13px] text-red-700">
              This will permanently delete your profile, all goals, and your entire completion history. This action cannot be undone.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:flex">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="min-h-12 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete everything"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="min-h-12 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
