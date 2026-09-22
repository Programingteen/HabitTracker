import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import { getGoals } from "@/lib/goals/data";
import { GoalList } from "@/components/goals/GoalList";

export const metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const { goals, userName } = await getGoals();

  return (
    <AuthenticatedShell name={userName}>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:py-20">
        <header className="mb-7 sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Goals
          </h1>
          <p className="mt-2 text-zinc-500">
            Build your daily system
          </p>
          <p className="mt-3 text-sm text-zinc-400 sm:mt-4">
            Add, edit, or remove your goals to track your progress
          </p>
        </header>

        <GoalList goals={goals} />
      </div>
    </AuthenticatedShell>
  );
}
