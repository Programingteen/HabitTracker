"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CalendarDay } from "@/lib/calendar/data";

type CalendarProps = {
  data: import("@/lib/calendar/data").CalendarData;
};

export default function Calendar({ data }: CalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handlePrevMonth = () => {
    const [y, m] = [data.year, data.month];
    const newMonth = m === 1 ? 12 : m - 1;
    const newYear = m === 1 ? y - 1 : y;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(newMonth));
    params.set("year", String(newYear));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNextMonth = () => {
    const [y, m] = [data.year, data.month];
    const newMonth = m === 12 ? 1 : m + 1;
    const newYear = m === 12 ? y + 1 : y;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(newMonth));
    params.set("year", String(newYear));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleToday = () => {
    router.push(pathname);
  };

  const handleDateClick = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    router.push(`${pathname}?${params.toString()}`);
    setDetailsOpen(true);
  };

  const selectedDay = data.selectedDay;

  const isCompleted = (day: CalendarDay) => day.completed > 0 && day.completed === day.total && day.total > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 p-3 sm:p-6">
        <button
          onClick={handlePrevMonth}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-900">{data.monthLabel}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={handleToday}
            className="min-h-11 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {data.weekLabels.map((label) => (
          <div
            key={label}
            className="border-b border-zinc-100 bg-zinc-50/50 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:p-3 sm:text-xs"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {data.days.map((row, i) => (
          <React.Fragment key={`row-${i}`}>
            {row.map((day) => (
              <button
                key={day.date}
                onClick={() => !day.isFuture && handleDateClick(day.date)}
                disabled={day.isFuture}
                className={`
                  min-h-[52px] border-b border-zinc-100 p-1.5 text-center text-sm sm:min-h-[76px] sm:p-3 sm:text-left
                  hover:bg-zinc-50 transition-colors
                  ${day.isToday ? "ring-2 ring-inset ring-emerald-500" : ""}
                  ${!day.isCurrentMonth ? "opacity-50" : ""}
                  ${day.isFuture ? "cursor-not-allowed" : ""}
                `}
              >
                <div className="flex items-center justify-center sm:justify-between">
                  <span
                    className={`
                      rounded-full w-7 h-7 flex items-center justify-center font-medium text-sm
                      ${day.isToday
                        ? "bg-emerald-100 text-emerald-700 font-bold"
                        : day.isCurrentMonth
                          ? "text-zinc-900"
                          : "text-zinc-300"
                      }
                    `}
                  >
                    {day.date.split("-")[2]}
                  </span>
                  {isCompleted(day) && (
                    <div className="absolute mt-7 h-1.5 w-1.5 rounded-full bg-emerald-500 sm:static sm:mt-0" />
                  )}
                </div>

                {day.isCurrentMonth && day.completed > 0 && day.completed < day.total && (
                  <div className="mt-0.5 hidden text-xs text-emerald-600 sm:block">
                    {day.completed}/{day.total}
                  </div>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Selected day details */}
      <div className="mt-6 hidden lg:block">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-900">
              {selectedDay?.formattedDate ?? "Select a date"}
            </h3>
            {selectedDay && (
              <span className="rounded-full px-3 py-1 text-xs font-medium text-zinc-500 bg-zinc-100">
                {selectedDay.completed === selectedDay.total
                  ? "All complete"
                  : `${selectedDay.completed} of ${selectedDay.total} goals`}
              </span>
            )}
          </div>

          {selectedDay && selectedDay.total > 0 && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-500">Completion rate</span>
                  <span className="font-medium text-zinc-900">{selectedDay.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedDay.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-500">Goals for {selectedDay.date}</h4>
                {selectedDay.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-6 w-6 items-center justify-center rounded-full
                          ${goal.completed ? "bg-emerald-100" : "bg-zinc-100"}
                        `}
                      >
                        {goal.completed ? (
                          <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="h-2 w-2 bg-zinc-400 rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-zinc-900">{goal.name}</span>
                    </div>
                    <span
                      className={`
                        text-xs font-medium
                        ${goal.completed ? "text-emerald-600" : "text-zinc-500"}
                      `}
                    >
                      {goal.completed ? "Completed" : "Not completed"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(!selectedDay || selectedDay.total === 0) && (
            <div className="py-8 text-center">
              <p className="text-zinc-500">
                {selectedDay?.isFuture
                  ? "Future dates don't have completion data yet."
                  : "No goals completed for this date."}
              </p>
            </div>
          )}
        </div>
      </div>

      {detailsOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden" role="dialog" aria-modal="true" aria-label={`Details for ${selectedDay.formattedDate}`}>
          <button className="absolute inset-0" aria-label="Close details" onClick={() => setDetailsOpen(false)} />
          <div className="relative max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Day details</p><h3 className="mt-1 text-xl font-semibold text-zinc-900">{selectedDay.formattedDate}</h3></div><button className="flex size-11 items-center justify-center rounded-full bg-zinc-100 text-lg" onClick={() => setDetailsOpen(false)} aria-label="Close">×</button></div>
            <p className="mb-4 text-sm text-zinc-600">{selectedDay.completed} / {selectedDay.total} goals completed</p>
            {selectedDay.total > 0 ? <><div className="mb-5 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedDay.percentage}%` }} /></div><div className="space-y-2">{selectedDay.goals.map((goal) => <div key={goal.id} className="flex min-h-12 items-center gap-3 rounded-xl border border-zinc-100 px-3"><span className={`flex size-6 items-center justify-center rounded-full ${goal.completed ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}>{goal.completed ? "✓" : "○"}</span><span className="min-w-0 break-words text-sm font-medium text-zinc-800">{goal.name}</span></div>)}</div></> : <p className="py-6 text-center text-sm text-zinc-500">No goals completed for this date.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
