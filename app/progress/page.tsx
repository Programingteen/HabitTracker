import { Suspense } from "react";
import { getProgressData, Period } from "@/lib/progress/data";
import { createClient } from "@/lib/supabase/server";
import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import ProgressHeader from "@/components/progress/ProgressHeader";
import StatsOverview from "@/components/progress/StatsOverview";
import PerformanceChart from "@/components/progress/PerformanceChart";
import GoalBreakdown from "@/components/progress/GoalBreakdown";
import InsightsSection from "@/components/progress/InsightsSection";
import PatternsSection from "@/components/progress/PatternsSection";

export const metadata = {
  title: "Progress",
};

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "7d" } = await searchParams;
  const currentPeriod = period as Period;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user?.id)
    .maybeSingle();

  const name = profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <AuthenticatedShell name={name}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Suspense fallback={<LoadingProgress currentPeriod={currentPeriod} />}>
          <ProgressContent period={currentPeriod} />
        </Suspense>
      </div>
    </AuthenticatedShell>
  );
}

async function ProgressContent({ period }: { period: Period }) {
  const data = await getProgressData(period);

  return (
    <div className="space-y-12">
      <ProgressHeader currentPeriod={period} />

      <StatsOverview overview={data.overview} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-12">
           <PerformanceChart data={data.performanceOverTime} />
           <GoalBreakdown goals={data.goalAnalytics} />
        </div>
        <div className="lg:col-span-4">
           <InsightsSection insights={data.insights} nextFocus={data.nextFocus} />
        </div>
      </div>

      <PatternsSection patterns={data.patterns} distribution={data.distribution} />
    </div>
  );
}

function LoadingProgress({ currentPeriod }: { currentPeriod: Period }) {
  return (
    <div className="animate-pulse space-y-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-48 rounded-lg bg-zinc-200" />
        <div className="h-8 w-64 rounded-lg bg-zinc-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-2xl bg-zinc-200" />)}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 h-64 rounded-2xl bg-zinc-200" />
        <div className="lg:col-span-4 h-64 rounded-2xl bg-zinc-200" />
      </div>
    </div>
  );
}
