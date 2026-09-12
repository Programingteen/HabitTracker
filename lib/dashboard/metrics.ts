export type DailyCompletion = {
  date: string;
  completed: number;
  total: number;
};

const DAY_MS = 86_400_000;

function dateAtOffset(date: string, offset: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
}

export function percent(completed: number, total: number) {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

/**
 * A streak counts successful days. A single missed day is a grace day; two
 * consecutive misses end the run. This is deliberately pure so that both the
 * dashboard and future history views use the same definition.
 */
export function getStreaks(days: DailyCompletion[], today: string) {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const firstDate = days[0]?.date;

  if (!firstDate) return { current: 0, best: 0 };

  const successful = (date: string) => {
    const day = byDate.get(date);
    return Boolean(day && day.total > 0 && day.completed >= day.total);
  };

  let current = 0;
  let missed = 0;
  for (let date = today; date >= firstDate; date = dateAtOffset(date, -1)) {
    if (successful(date)) {
      current += 1;
      missed = 0;
    } else {
      missed += 1;
    }
    if (missed === 2) break;
  }

  let best = 0;
  let running = 0;
  let gaps = 0;
  for (let date = firstDate; date <= today; date = dateAtOffset(date, 1)) {
    if (successful(date)) {
      running += 1;
      gaps = 0;
    } else {
      gaps += 1;
      if (gaps === 2) {
        best = Math.max(best, running);
        running = 0;
        gaps = 0;
      }
    }
  }

  return { current, best: Math.max(best, running) };
}

export function mondayFor(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return dateAtOffset(date, weekday === 0 ? -6 : 1 - weekday);
}

export function previousDate(date: string, days: number) {
  return dateAtOffset(date, -days);
}

export function dateRange(start: string, length: number) {
  return Array.from({ length }, (_, index) => dateAtOffset(start, index));
}

export function weekdayLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day))
  );
}

export const DAY_IN_MILLISECONDS = DAY_MS;
