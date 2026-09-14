import Link from "next/link";

export default function ConsistencyInsight({
  insight
}: {
  insight: { current: number; difference: number } | null
}) {
  if (!insight) return null;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/20 p-6 sm:flex sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-600">
          ✨
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Consistency Insight</h3>
          <p className="mt-1 text-sm text-emerald-800/70 leading-relaxed">
            You&apos;ve completed <span className="font-bold text-emerald-900">{insight.current}%</span> of your goals this week.
            {insight.difference !== 0 && (
              <> That&apos;s <span className="font-bold text-emerald-900">{Math.abs(insight.difference)}% {insight.difference > 0 ? "more" : "less"}</span> than last week.</>
            )}
            {" "}{insight.difference > 0 ? "Keep up the great momentum!" : "You can get back on track tomorrow."}
          </p>
        </div>
      </div>
      <Link
        href="/progress"
        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900 sm:mt-0 transition-colors"
      >
        View deep progress
        <span className="text-lg">→</span>
      </Link>
    </section>
  );
}
