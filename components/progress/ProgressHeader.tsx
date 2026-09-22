"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Period } from "@/lib/progress/data";

const periods: Array<{ label: string; value: Period }> = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
];

export default function ProgressHeader({ currentPeriod }: { currentPeriod: Period }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setPeriod(period: Period) {
    const params = new URLSearchParams(searchParams);
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">Progress</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your personal performance and habit patterns.
        </p>
      </div>

      <div className="grid w-full grid-cols-4 gap-1 self-start rounded-xl bg-zinc-100 p-1 sm:flex sm:w-auto">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`min-h-10 rounded-lg px-1 py-1.5 text-[11px] font-medium transition sm:px-3 sm:text-xs ${
              currentPeriod === p.value
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
