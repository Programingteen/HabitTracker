import { percent } from "@/lib/dashboard/data-utils";

export default function TodayProgress({ completed, total }: { completed: number, total: number }) {
  const progressPercent = percent(completed, total);
  const remaining = total - completed;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200/50">
      <div className="relative z-10">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">Today&apos;s Progress</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter">{completed}</span>
          <span className="text-2xl text-zinc-500 font-medium">/ {total}</span>
        </div>

        <p className="mt-2 text-lg font-medium text-zinc-300">
          {total === 0
            ? "No goals set for today"
            : remaining === 0
              ? "All goals completed!"
              : `${remaining} goals remaining`}
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-2 text-sm font-medium">
            <span className="text-zinc-400">Completion</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 size-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 size-64 rounded-full bg-emerald-500/5 blur-3xl" />
    </section>
  );
}
