export default function MomentumCard({ streak }: { streak: { current: number, best: number } }) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 shadow-sm sm:border-zinc-200 sm:bg-white sm:p-6">
      <p className="hidden text-[11px] font-bold uppercase tracking-widest text-zinc-400 sm:block">Your Momentum</p>

      <div className="flex items-center gap-3 sm:mt-4 sm:gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-orange-100/70 text-2xl sm:size-14 sm:rounded-2xl sm:bg-orange-50 sm:text-3xl">
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

      <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 sm:mt-6 sm:border-zinc-100 sm:pt-6">
        <span className="text-xs font-medium text-zinc-500">Personal Best</span>
        <span className="text-sm font-bold text-zinc-900">{streak.best} days</span>
      </div>
    </section>
  );
}
