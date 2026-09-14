import { createClient } from "@/lib/supabase/server";
import { dateRange, percent, previousDate, safeDate, safeTimeZone, weekdayLabel, dateAtOffset } from "@/lib/dashboard/data-utils";
import { getStreaks } from "@/lib/dashboard/metrics";

export type Period = "7d" | "30d" | "90d" | "all";

export type ProgressData = {
  period: Period;
  overview: {
    completionRate: number;
    completionRateChange: number | null;
    goalsCompleted: number;
    goalsPlanned: number;
    currentStreak: number;
    bestStreak: number;
  };
  performanceOverTime: Array<{
    date: string;
    completed: number;
    total: number;
    percentage: number;
    goals: Array<{ name: string; completed: boolean }>;
  }>;
  goalAnalytics: Array<{
    id: string;
    name: string;
    completionRate: number;
    completedCount: number;
    plannedCount: number;
    currentStreak: number;
    trend: "improving" | "declining" | "stable";
    change: number | null;
  }>;
  patterns: {
    dayOfWeek: Array<{ day: string; percentage: number }>;
    bestDay: string | null;
    worstDay: string | null;
  };
  distribution: Array<{
    range: string;
    count: number;
  }>;
  insights: {
    strengths: string[];
    weaknesses: string[];
  };
  nextFocus: {
    title: string;
    description: string;
  } | null;
};

type GoalRow = { id: string; name: string; position: number; created_at: string; active: boolean };
type LogRow = { goal_id: string; date: string; value: number | string };

export async function getProgressData(period: Period = "7d"): Promise<ProgressData> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Your session has expired. Please sign in again.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();

  const timeZone = safeTimeZone(profile?.timezone ?? null);
  const today = safeDate(timeZone);

  // Calculate dates based on period
  let startDate: string;
  let days: number;

  switch (period) {
    case "7d":
      days = 7;
      startDate = previousDate(today, 6);
      break;
    case "30d":
      days = 30;
      startDate = previousDate(today, 29);
      break;
    case "90d":
      days = 90;
      startDate = previousDate(today, 89);
      break;
    case "all":
      const { data: firstGoal } = await supabase
        .from("goals")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      startDate = firstGoal?.created_at?.slice(0, 10) || previousDate(today, 30);
      days = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000) + 1;
      break;
  }

  // Comparison period
  const comparisonStartDate = previousDate(startDate, days);
  const comparisonEndDate = previousDate(startDate, 1);

  // Fetch all goals for the user
  const { data: goals } = await supabase
    .from("goals")
    .select("id, name, position, created_at, active")
    .eq("user_id", user.id);

  const activeGoals = (goals ?? []) as GoalRow[];

  // Fetch logs for current and comparison period
  const { data: logs } = await supabase
    .from("goal_logs")
    .select("goal_id, date, value")
    .eq("user_id", user.id)
    .gte("date", comparisonStartDate)
    .lte("date", today);

  const logEntries = (logs ?? []) as LogRow[];
  const logMap = new Map<string, number>();
  logEntries.forEach(log => {
    const key = `${log.goal_id}:${log.date}`;
    logMap.set(key, (logMap.get(key) ?? 0) + Number(log.value));
  });

  const getCompletionForRange = (start: string, end: string) => {
    const dates = dateRange(start, Math.floor((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) + 1);
    let completed = 0;
    let total = 0;

    dates.forEach(date => {
      const availableGoals = activeGoals.filter(g => g.active && g.created_at.slice(0, 10) <= date);
      availableGoals.forEach(g => {
        total++;
        if ((logMap.get(`${g.id}:${date}`) ?? 0) > 0) {
          completed++;
        }
      });
    });

    return { completed, total };
  };

  const currentPeriod = getCompletionForRange(startDate, today);
  const prevPeriod = getCompletionForRange(comparisonStartDate, comparisonEndDate);

  const completionRate = percent(currentPeriod.completed, currentPeriod.total);
  const prevCompletionRate = percent(prevPeriod.completed, prevPeriod.total);

  // Performance Over Time
  const performanceOverTime = dateRange(startDate, days).map(date => {
    const availableGoals = activeGoals.filter(g => g.active && g.created_at.slice(0, 10) <= date);
    const dayGoals = availableGoals.map(g => ({
      name: g.name,
      completed: (logMap.get(`${g.id}:${date}`) ?? 0) > 0
    }));
    const dayCompleted = dayGoals.filter(g => g.completed).length;
    return {
      date,
      completed: dayCompleted,
      total: availableGoals.length,
      percentage: percent(dayCompleted, availableGoals.length),
      goals: dayGoals
    };
  });

  // Streaks
  const historyDays = dateRange(comparisonStartDate, Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${comparisonStartDate}T00:00:00Z`)) / 86_400_000) + 1)
    .map(date => {
      const availableGoals = activeGoals.filter(g => g.active && g.created_at.slice(0, 10) <= date);
      const completedCount = availableGoals.filter(g => (logMap.get(`${g.id}:${date}`) ?? 0) > 0).length;
      return { date, completed: completedCount, total: availableGoals.length };
    });
  const streaks = getStreaks(historyDays, today);

  // Goal Analytics
  const goalAnalytics = activeGoals.filter(g => g.active).map(goal => {
    const goalLogs = logEntries.filter(l => l.goal_id === goal.id && l.date >= startDate && l.date <= today);
    const goalPrevLogs = logEntries.filter(l => l.goal_id === goal.id && l.date >= comparisonStartDate && l.date <= comparisonEndDate);

    const goalDays = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${goal.created_at.slice(0,10) > startDate ? goal.created_at.slice(0,10) : startDate}T00:00:00Z`)) / 86_400_000) + 1;
    const completedCount = goalLogs.filter(l => Number(l.value) > 0).length;
    const goalRate = percent(completedCount, goalDays);

    const startOfPrev = goal.created_at.slice(0,10) > comparisonStartDate ? goal.created_at.slice(0,10) : comparisonStartDate;
    const prevGoalDays = startOfPrev <= comparisonEndDate ? Math.floor((Date.parse(`${comparisonEndDate}T00:00:00Z`) - Date.parse(`${startOfPrev}T00:00:00Z`)) / 86_400_000) + 1 : 0;
    const prevCompletedCount = goalPrevLogs.filter(l => Number(l.value) > 0).length;
    const prevGoalRate = prevGoalDays > 0 ? percent(prevCompletedCount, prevGoalDays) : null;

    // Calculate goal specific streak
    let currentGoalStreak = 0;
    for (let d = today; d >= goal.created_at.slice(0,10); d = dateAtOffset(d, -1)) {
        if ((logMap.get(`${goal.id}:${d}`) ?? 0) > 0) {
            currentGoalStreak++;
        } else if (d < today) {
            break;
        }
    }

    const trend: "improving" | "declining" | "stable" = prevGoalRate === null ? "stable" : goalRate > prevGoalRate ? "improving" : goalRate < prevGoalRate ? "declining" : "stable";

    return {
      id: goal.id,
      name: goal.name,
      completionRate: goalRate,
      completedCount,
      plannedCount: goalDays,
      currentStreak: currentGoalStreak,
      trend,
      change: prevGoalRate !== null ? goalRate - prevGoalRate : null
    };
  });

  // Patterns
  const dayOfWeekPerf = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(dayName => {
    const daysOfName = performanceOverTime.filter(d => weekdayLabel(d.date, true) === dayName);
    const total = daysOfName.reduce((sum, d) => sum + d.total, 0);
    const completed = daysOfName.reduce((sum, d) => sum + d.completed, 0);
    return { day: dayName, percentage: percent(completed, total) };
  });

  const bestDay = [...dayOfWeekPerf].sort((a, b) => b.percentage - a.percentage)[0];
  const worstDay = [...dayOfWeekPerf].sort((a, b) => a.percentage - b.percentage)[0];

  // Distribution
  const distribution = [
    { range: "100%", count: performanceOverTime.filter(d => d.percentage === 100).length },
    { range: "75-99%", count: performanceOverTime.filter(d => d.percentage >= 75 && d.percentage < 100).length },
    { range: "50-74%", count: performanceOverTime.filter(d => d.percentage >= 50 && d.percentage < 75).length },
    { range: "25-49%", count: performanceOverTime.filter(d => d.percentage >= 25 && d.percentage < 50).length },
    { range: "0-24%", count: performanceOverTime.filter(d => d.percentage < 25).length },
  ];

  // Insights
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (completionRate > 80) strengths.push("You have an exceptional overall completion rate.");
  if (streaks.current > 5) strengths.push(`You're on a strong ${streaks.current}-day streak.`);
  if (bestDay && bestDay.percentage > 90) strengths.push(`You're most consistent on ${bestDay.day}s.`);

  const lowestGoal = [...goalAnalytics].sort((a, b) => a.completionRate - b.completionRate)[0];
  if (lowestGoal && lowestGoal.completionRate < 50) weaknesses.push(`${lowestGoal.name} is currently your weakest goal.`);
  if (worstDay && worstDay.percentage < 50) weaknesses.push(`Your completion rate drops significantly on ${worstDay.day}s.`);
  if (completionRate < prevCompletionRate) weaknesses.push("Your overall completion rate has declined compared to the previous period.");

  // Next Focus
  let nextFocus: { title: string; description: string } | null = null;
  if (worstDay && worstDay.percentage < 70) {
    nextFocus = {
        title: `Strengthen your ${worstDay.day}s`,
        description: `Your ${worstDay.day} completion is only ${worstDay.percentage}%, while your best day is ${bestDay.percentage}%.`
    };
  } else if (lowestGoal) {
    nextFocus = {
        title: `Focus on ${lowestGoal.name}`,
        description: `This goal has your lowest completion rate at ${lowestGoal.completionRate}%.`
    };
  }

  return {
    period,
    overview: {
      completionRate,
      completionRateChange: prevPeriod.total > 0 ? completionRate - prevCompletionRate : null,
      goalsCompleted: currentPeriod.completed,
      goalsPlanned: currentPeriod.total,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
    },
    performanceOverTime,
    goalAnalytics,
    patterns: {
      dayOfWeek: dayOfWeekPerf,
      bestDay: bestDay?.percentage > 0 ? bestDay.day : null,
      worstDay: worstDay?.percentage < 100 ? worstDay.day : null,
    },
    distribution,
    insights: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
    },
    nextFocus
  };
}
