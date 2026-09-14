export default function MomentumCard({ streak }: { streak: { current: number, best: number } }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Your Momentum</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
          🔥
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-zinc-900">{streak.current}</span>
            <span className="text-sm font-medium text-zinc-500">days</span>
          </div>
          <p className="text-xs font-medium text-zinc-400 mt-0.5">Current streak</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">Personal Best</span>
        <span className="text-sm font-bold text-zinc-900">{streak.best} days</span>
      </div>
    </section>
  );
}
