export function getDateParts(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function safeDate(timeZone: string | null) {
  try {
    return getDateParts(timeZone || "UTC");
  } catch {
    return getDateParts("UTC");
  }
}

export function safeTimeZone(timeZone: string | null) {
  try {
    Intl.DateTimeFormat("en", { timeZone: timeZone || "UTC" });
    return timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function dateAtOffset(date: string, offset: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
}

export function percent(completed: number, total: number) {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export function previousDate(date: string, days: number) {
  return dateAtOffset(date, -days);
}

export function dateRange(start: string, length: number) {
  return Array.from({ length }, (_, index) => dateAtOffset(start, index));
}

export function weekdayLabel(date: string, long = false) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { weekday: long ? "long" : "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day))
  );
}
