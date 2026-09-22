import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import Calendar from "@/components/calendar/Calendar";
import { getCalendarData } from "@/lib/calendar/data";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Calendar",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; date?: string }>;
}) {
  const { month: monthParam, year: yearParam, date: dateParam } = await searchParams;
  const month = monthParam ? Number(monthParam) : null;
  const year = yearParam ? Number(yearParam) : null;
  const selectedDate = dateParam ?? null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <AuthenticatedShell name={name}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Calendar</h1>
          <p className="mt-2 text-zinc-500">See your consistency day by day.</p>
        </header>

        <Suspense fallback={<LoadingCalendar />}>
          <CalendarContent
            month={month}
            year={year}
            selectedDate={selectedDate}
          />
        </Suspense>
      </div>
    </AuthenticatedShell>
  );
}

async function CalendarContent({
  month,
  year,
  selectedDate,
}: {
  month: number | null;
  year: number | null;
  selectedDate: string | null;
}) {
  const data = await getCalendarData(month, year, selectedDate);
  return <Calendar data={data} />;
}

function LoadingCalendar() {
  return <div className="h-96 flex items-center justify-center">Loading calendar...</div>;
}
