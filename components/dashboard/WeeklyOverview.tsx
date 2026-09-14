import { percent } from "@/lib/dashboard/data-utils";

export default function WeeklyOverview({
  days,
  today
}: {
  days: Array<{ date: string; label: string; completed: number; total: number }>;
  today: string;
}) {
  const weekCompleted = days.filter(d => d.date <= today).reduce((s, d) => s + d.completed, 0);
  const weekTotal = days.filter(d => d.date <= today).reduce((s, d) => s + d.total, 0);
  const weekPercent = percent(weekCompleted, weekTotal);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">This Week</p>
        <span className="text-sm font-bold text-zinc-900">{weekPercent}%</span>
      </div>

      <div className="flex items-end justify-between gap-1 h-24">
        {days.map((day) => {
          const isToday = day.date === today;
          const isFuture = day.date > today;
          const completionRate = day.total > 0 ? (day.completed / day.total) : 0;

          return (
            <div key={day.date} className="flex flex-col items-center flex-1 gap-2">
              <div className="relative w-full flex flex-col justify-end h-16 bg-zinc-50 rounded-lg overflow-hidden">
                {!isFuture && day.total > 0 && (
                  <div
                    className={`w-full transition-all duration-500 rounded-t-sm ${
                      completionRate >= 1 ? "bg-emerald-500" : "bg-emerald-500/40"
                    }`}
                    style={{ height: `${completionRate * 100}%` }}
                  />
                )}
                {isToday && (
                  <div className="absolute inset-0 ring-2 ring-emerald-500 ring-inset rounded-lg pointer-events-none" />
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                isToday ? "text-emerald-600" : isFuture ? "text-zinc-300" : "text-zinc-500"
              }`}>
                {day.label.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3 pt-6 border-t border-zinc-100">
        {days.filter(d => d.date <= today).reverse().slice(0, 3).map(day => (
          <div key={day.date} className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-500">{day.date === today ? "Today" : day.label}</span>
            <div className="flex items-center gap-2">
              <div className="h-1 w-20 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${percent(day.completed, day.total)}%` }}
                />
              </div>
              <span className="font-bold text-zinc-900 w-6 text-right">{day.completed}/{day.total}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
