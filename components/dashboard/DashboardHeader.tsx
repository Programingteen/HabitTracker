import { DashboardData } from "@/lib/dashboard/data";

export default function DashboardHeader({ data }: { data: DashboardData }) {
  const remaining = data.goals.length - data.todayCompleted;

  return (
    <header className="mb-10">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
          {data.formattedDate}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {data.greeting}, {data.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-500">
          {data.goals.length === 0
            ? "Start by adding the goals that matter to you."
            : remaining === 0
              ? "You've completed everything for today."
              : `You have ${remaining} goal${remaining === 1 ? "" : "s"} left today.`}
        </p>
      </div>
    </header>
  );
}
