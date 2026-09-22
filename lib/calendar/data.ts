import { createClient } from "@/lib/supabase/server";
import { safeDate, safeTimeZone, dateAtOffset, percent } from "@/lib/dashboard/data-utils";
import type { UserSettings } from "@/lib/settings/data";

type GoalRow = { id: string; name: string; position: number; created_at: string };
type LogRow = { goal_id: string; date: string; value: number | string };

export type CalendarDay = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  completed: number;
  total: number;
  percentage: number;
};

export type CalendarGoal = {
  id: string;
  name: string;
  completed: boolean;
  value: number;
};

export type CalendarDayDetails = {
  date: string;
  formattedDate: string;
  completed: number;
  total: number;
  percentage: number;
  goals: CalendarGoal[];
  isFuture: boolean;
};

export type CalendarData = {
  today: string;
  year: number;
  month: number;
  monthLabel: string;
  weekStartsOn: "monday" | "sunday";
  days: CalendarDay[][];
  selectedDate: string;
  selectedDay: CalendarDayDetails | null;
  goals: CalendarGoal[];
  weekLabels: string[];
};

function getMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1))
  );
}

function getWeekStartOffset(weekStartsOn: "monday" | "sunday"): number {
  return weekStartsOn === "monday" ? 1 : 0;
}

function dayOfWeekUTC(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function getCalendarGrid(
  year: number,
  month: number,
  weekStartsOn: "monday" | "sunday",
  today: string
): { days: CalendarDay[][] } {
  const offset = getWeekStartOffset(weekStartsOn);
  const firstDow = dayOfWeekUTC(`${year}-${String(month).padStart(2, "0")}-01`);
  const startOffset = (firstDow - offset + 7) % 7;

  const startDate = dateAtOffset(`${year}-${String(month).padStart(2, "0")}-01`, -(startOffset as any));

  const totalDays = 42;
  const grid: CalendarDay[][] = [];
  let currentRow: CalendarDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const dateStr = dateAtOffset(startDate, i);
    const [y, m] = dateStr.split("-").map(Number);
    const monthNum = m;

    const isCurrentMonth = monthNum === month;
    const isToday = dateStr === today;
    const isPast = dateStr < today;
    const isFuture = dateStr > today;

    currentRow.push({
      date: dateStr,
      isCurrentMonth,
      isToday,
      isPast,
      isFuture,
      completed: 0,
      total: 0,
      percentage: 0,
    });

    if (currentRow.length === 7) {
      grid.push(currentRow);
      currentRow = [];
    }
  }

  return { days: grid };
}

export async function getCalendarData(
  monthParam?: number | null,
  yearParam?: number | null,
  selectedDateParam?: string | null
): Promise<CalendarData> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Your session has expired. Please sign in again.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, week_starts_on")
    .eq("id", user.id)
    .maybeSingle();

  const timeZone = safeTimeZone(profile?.timezone ?? null);
  const today = safeDate(timeZone);
  const weekStartsOn = (profile?.week_starts_on as "monday" | "sunday") || "monday";

  const [currentYear, currentMonth] = today.split("-").map(Number);
  const targetYear = yearParam ?? currentYear;
  const targetMonth = monthParam ?? currentMonth;

  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, position, created_at")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("position");
  if (goalsError) throw new Error("We couldn't load your goals.");

  const activeGoals = (goals ?? []) as GoalRow[];

  const yearStart = `${targetYear}-01-01`;
  const yearEnd = `${targetYear}-12-31`;

  const { data: logs, error: logsError } = await supabase
    .from("goal_logs")
    .select("goal_id, date, value")
    .eq("user_id", user.id)
    .gte("date", yearStart)
    .lte("date", yearEnd);
  if (logsError) throw new Error("We couldn't load your completion history.");

  const logMap = new Map<string, number>();
  for (const log of (logs ?? []) as LogRow[]) {
    const key = `${log.goal_id}:${log.date}`;
    logMap.set(key, (logMap.get(key) ?? 0) + Number(log.value));
  }

  const completionFor = (date: string) => {
    const availableGoals = activeGoals.filter(
      (goal) => goal.created_at.slice(0, 10) <= date
    );
    const completed = availableGoals.filter(
      (goal) => (logMap.get(`${goal.id}:${date}`) ?? 0) > 0
    ).length;
    return { completed, total: availableGoals.length };
  };

  // Build the calendar grid for target month/year
  const { days } = getCalendarGrid(targetYear, targetMonth, weekStartsOn, today);

  // Fill in completion data for each day cell
  const daysWithData = days.map((row) =>
    row.map((day) => {
      const { completed, total } = completionFor(day.date);
      return {
        ...day,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  // Determine selected date - use provided, or today if viewing current month
  const selectedDate = selectedDateParam || (targetYear === currentYear && targetMonth === currentMonth ? today : `${targetYear}-${String(targetMonth).padStart(2, "0")}-01`);

  // Build selected day details
  const selectedDay = buildDayDetails(selectedDate, activeGoals, logMap, today);

  // Goals for the selected date
  const goalData = activeGoals.map((goal) => {
    const value = logMap.get(`${goal.id}:${selectedDate}`) ?? 0;
    return { id: goal.id, name: goal.name, completed: value > 0, value };
  });

  // Week labels starting from the configured week start
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const dow = (i + getWeekStartOffset(weekStartsOn)) % 7;
    return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(
      new Date(Date.UTC(2025, 0, dow === 0 ? 6 : dow - 1))
    );
  });

  return {
    today,
    year: targetYear,
    month: targetMonth,
    monthLabel: getMonthLabel(targetYear, targetMonth),
    weekStartsOn,
    days: daysWithData,
    selectedDate,
    selectedDay,
    goals: goalData,
    weekLabels: dayNames,
  };
}

function buildDayDetails(
  date: string,
  activeGoals: GoalRow[],
  logMap: Map<string, number>,
  today: string
): { date: string; formattedDate: string; completed: number; total: number; percentage: number; goals: Array<{ id: string; name: string; completed: boolean; value: number }>; isFuture: boolean } {
  const availableGoals = activeGoals.filter(
    (goal) => goal.created_at.slice(0, 10) <= date
  );
  const completed = availableGoals.filter(
    (goal) => (logMap.get(`${goal.id}:${date}`) ?? 0) > 0
  ).length;
  const total = availableGoals.length;

  const goals = activeGoals.map((goal) => {
    const value = logMap.get(`${goal.id}:${date}`) ?? 0;
    return { id: goal.id, name: goal.name, completed: value > 0, value };
  });

  const [y, m, d] = date.split("-").map(Number);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));

  return {
    date,
    formattedDate,
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    goals,
    isFuture: date > today,
  };
}