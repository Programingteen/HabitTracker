"use client";

import { useState } from "react";

type PreferenceProps<T extends string | number> = {
  label: string;
  description: string;
  value: T;
  options: { label: string; value: T }[];
  onSave?: (value: T) => Promise<void>;
};

export default function PreferenceSelect<T extends string | number>({
  label,
  description,
  value,
  options,
  onSave,
}: PreferenceProps<T>) {
  const [pending, setPending] = useState(false);

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!onSave) return;

    const selectedValue = event.target.value;

    const option = options.find(
      (opt) => String(opt.value) === selectedValue
    );

    if (!option) return;

    setPending(true);

    try {
      await onSave(option.value);
    } catch (error) {
      console.error("Failed to save preference:", error);
      alert("Failed to save preference");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[15px] font-medium text-zinc-900">
          {label}
        </span>

        <select
          value={value}
          disabled={pending}
          onChange={handleChange}
          className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 sm:w-auto"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[13px] text-zinc-500">
        {description}
      </p>
    </div>
  );
}
