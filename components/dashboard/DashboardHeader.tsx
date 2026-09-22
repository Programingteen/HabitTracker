import { DashboardData } from "@/lib/dashboard/data";

export default function DashboardHeader({ data }: { data: DashboardData }) {
  const remaining = data.goals.length - data.todayCompleted;

  return (
    <header className="mb-7 sm:mb-10">
      <div className="flex flex-col gap-1">
        <p className="order-2 mt-1 text-sm font-medium text-zinc-500 sm:order-none sm:mt-0 sm:uppercase sm:tracking-wider">
          {data.formattedDate}
        </p>
        <h1 className="order-1 text-[1.8rem] font-semibold tracking-tight text-zinc-900 sm:order-none sm:text-4xl">
          {data.greeting}, {data.name}
        </h1>
        <p className="mt-3 hidden text-lg text-zinc-500 sm:block">
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
