"use client";

import { useState } from "react";
import { updateProfileName } from "@/app/settings/actions";

export default function EditableName({ initialName }: { initialName: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    if (name.trim() === initialName) {
      setIsEditing(false);
      return;
    }
    setPending(true);
    try {
      await updateProfileName(name);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update name");
    } finally {
      setPending(false);
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-12 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
          autoFocus
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            disabled={pending}
            className="min-h-11 rounded-xl bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setName(initialName);
              setIsEditing(false);
            }}
            disabled={pending}
            className="min-h-11 rounded-xl border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <span className="min-w-0 break-words text-[15px] font-medium text-zinc-900">{name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="min-h-11 shrink-0 px-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
      >
        Edit
      </button>
    </div>
  );
}
