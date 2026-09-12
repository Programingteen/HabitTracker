import { createClient } from "@/lib/supabase/server";
import { dateRange, getStreaks, mondayFor, percent, previousDate, weekdayLabel } from "./metrics";

type GoalRow = { id: string; name: string; position: number; created_at: string };
type LogRow = { goal_id: string; date: string; value: number | string };

export type DashboardData = {
  name: string;
  today: string;
  formattedDate: string;
  greeting: string;
  goals: Array<{ id: string; name: string; completed: boolean; value: number }>;
  todayCompleted: number;
  weekCompleted: number;
  weekTotal: number;
  streak: { current: number; best: number };
  weekDays: Array<{ date: string; label: string; completed: number; total: number }>;
  insight: { current: number; difference: number } | null;
};

function getDateParts(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function safeDate(timeZone: string | null) {
  try {
    return getDateParts(timeZone || "UTC");
  } catch {
    return getDateParts("UTC");
  }
}

function safeTimeZone(timeZone: string | null) {
  try {
    Intl.DateTimeFormat("en", { timeZone: timeZone || "UTC" });
    return timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Your session has expired. Please sign in again.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, timezone, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw new Error("We couldn't load your profile.");

  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, position, created_at")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("position");
  if (goalsError) throw new Error("We couldn't load your goals.");

  const timeZone = safeTimeZone(profile?.timezone ?? null);
  const today = safeDate(timeZone);
  const weekStart = mondayFor(today);
  const previousWeekStart = previousDate(weekStart, 7);
  const historyStart = goals?.length
    ? goals.reduce((earliest: string, goal: GoalRow) => {
        const date = goal.created_at.slice(0, 10);
        return date < earliest ? date : earliest;
      }, today)
    : today;

  const { data: logs, error: logsError } = await supabase
    .from("goal_logs")
    .select("goal_id, date, value")
    .eq("user_id", user.id)
    .gte("date", historyStart)
    .lte("date", today);
  if (logsError) throw new Error("We couldn't load your completion history.");

  const activeGoals = (goals ?? []) as GoalRow[];
  const logValues = new Map<string, number>();
  for (const log of (logs ?? []) as LogRow[]) {
    const key = `${log.goal_id}:${log.date}`;
    logValues.set(key, (logValues.get(key) ?? 0) + Number(log.value));
  }

  const completionFor = (date: string) => {
    const availableGoals = activeGoals.filter((goal) => goal.created_at.slice(0, 10) <= date);
    const completed = availableGoals.filter((goal) => (logValues.get(`${goal.id}:${date}`) ?? 0) > 0).length;
    return { completed, total: availableGoals.length };
  };

  const todayCounts = completionFor(today);
  const weekDays = dateRange(weekStart, 7).map((date) => ({
    date,
    label: weekdayLabel(date),
    ...completionFor(date),
  }));
  const elapsedWeekDays = weekDays.filter((day) => day.date <= today);
  const weekCompleted = elapsedWeekDays.reduce((sum, day) => sum + day.completed, 0);
  const weekTotal = elapsedWeekDays.reduce((sum, day) => sum + day.total, 0);
  const previousDays = dateRange(previousWeekStart, 7).map(completionFor);
  const previousCompleted = previousDays.reduce((sum, day) => sum + day.completed, 0);
  const previousTotal = previousDays.reduce((sum, day) => sum + day.total, 0);
  const currentPercent = percent(weekCompleted, weekTotal);
  const previousPercent = percent(previousCompleted, previousTotal);

  const historyDays = dateRange(historyStart, Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${historyStart}T00:00:00Z`)) / 86_400_000) + 1)
    .map((date) => ({ date, ...completionFor(date) }));

  return {
    name: profile?.name?.trim() || user.user_metadata?.name || user.email?.split("@")[0] || "there",
    today,
    formattedDate: new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone }).format(new Date()),
    greeting: (() => {
      const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(new Date()));
      return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    })(),
    goals: activeGoals.map((goal) => {
      const value = logValues.get(`${goal.id}:${today}`) ?? 0;
      return { id: goal.id, name: goal.name, value, completed: value > 0 };
    }),
    todayCompleted: todayCounts.completed,
    weekCompleted,
    weekTotal,
    streak: getStreaks(historyDays, today),
    weekDays,
    insight: previousTotal > 0 && previousCompleted > 0
      ? { current: currentPercent, difference: currentPercent - previousPercent }
      : null,
  };
}
