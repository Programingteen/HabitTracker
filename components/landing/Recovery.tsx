"use client";

import { useEffect, useRef, useState } from "react";

const weeks = [
  [true, true, true, true, false, true, true],
  [true, true, true, true, true, true, true],
];

const days = ["M", "T", "W", "T", "F", "S", "S"];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-3"
    >
      <path
        d="m3.5 8 2.6 2.6L12.5 4.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Recovery() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [showGap, setShowGap] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const gapTimer = window.setTimeout(() => {
      setShowGap(true);
    }, 500);

    const returnTimer = window.setTimeout(() => {
      setShowReturn(true);
    }, 900);

    return () => {
      window.clearTimeout(gapTimer);
      window.clearTimeout(returnTimer);
    };
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="recovery"
      aria-labelledby="recovery-heading"
      className="overflow-hidden bg-[#FAFAF9]"
    >
      <div className="container">
        <div className="py-28 sm:py-32 lg:py-40">
          {/* =====================================================
              INTRO
              ===================================================== */}

          <div
            className={[
              "mx-auto max-w-3xl text-center",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#D4D4D8]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                Real life
              </span>

              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#D4D4D8]"
              />
            </div>

            <h2
              id="recovery-heading"
              className="
                mt-7
                text-[clamp(3.2rem,6.5vw,5.5rem)]
                font-semibold
                leading-[0.92]
                tracking-[-0.065em]
                text-[#18181B]
              "
            >
              Missed a day?
              <br />
              Come back anyway.
            </h2>

            <p className="mx-auto mt-7 max-w-md text-[16px] leading-7 tracking-[-0.012em] text-[#52525B] sm:text-[17px] sm:leading-8">
              Consistency isn&apos;t perfection. It&apos;s returning.
            </p>
          </div>

          {/* =====================================================
              CALENDAR
              ===================================================== */}

          <div
            className={[
              "mx-auto mt-16 max-w-[720px] sm:mt-20 lg:mt-24",
              "transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0",
            ].join(" ")}
          >
            <div className="relative">
              {/* Day labels */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {days.map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A1A1AA]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="grid grid-cols-7 gap-2 sm:gap-4"
                  >
                    {week.map((completed, dayIndex) => {
                      const isMissed =
                        weekIndex === 0 && dayIndex === 4;

                      const shouldShow =
                        !isMissed || showGap;

                      const shouldHighlightReturn =
                        weekIndex === 1 && showReturn;

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="flex aspect-square items-center justify-center"
                        >
                          <span
                            className={[
                              "relative flex size-full max-w-[64px] items-center justify-center rounded-2xl border",
                              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                              isMissed
                                ? shouldShow
                                  ? "scale-100 border-[#D4D4D8] bg-transparent opacity-100"
                                  : "scale-90 border-[#E4E4E7] bg-transparent opacity-0"
                                : completed
                                  ? "scale-100 border-[#18181B] bg-[#18181B] text-white opacity-100"
                                  : "scale-90 border-[#E4E4E7] bg-transparent opacity-0",
                              shouldHighlightReturn && !isMissed
                                ? "shadow-[0_0_0_4px_rgb(22_163_74/0.06)]"
                                : "",
                            ].join(" ")}
                          >
                            {completed && !isMissed ? (
                              <CheckIcon />
                            ) : null}

                            {shouldHighlightReturn &&
                            weekIndex === 1 &&
                            dayIndex === 0 ? (
                              <span
                                aria-hidden="true"
                                className="absolute -right-1 -top-1 size-2 rounded-full bg-[#16A34A]"
                              />
                            ) : null}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* =================================================
                  MISSED-DAY INDICATOR
                  ================================================= */}

              <div
                className={[
                  "mt-8 flex items-center justify-center gap-3",
                  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  showGap
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full border border-[#D4D4D8]"
                />

                <span className="text-[11px] font-medium tracking-[-0.005em] text-[#A1A1AA]">
                  One missed day
                </span>
              </div>

              {/* =================================================
                  RETURN MESSAGE
                  ================================================= */}

              <div
                className={[
                  "mx-auto mt-9 max-w-md text-center",
                  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  showReturn
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                ].join(" ")}
              >
                <p className="text-[13px] leading-6 text-[#71717A]">
                  The next day is still yours.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              PHILOSOPHY STATEMENT
              ===================================================== */}

          <div
            className={[
              "mx-auto mt-20 max-w-xl text-center sm:mt-24 lg:mt-28",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              showReturn
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            ].join(" ")}
          >
            <div className="mx-auto h-px w-10 bg-[#D4D4D8]" />

            <p className="mt-7 text-[14px] leading-7 tracking-[-0.01em] text-[#71717A]">
              A missed day is a gap,
              <br className="sm:hidden" /> not a reset.
            </p>

            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#A1A1AA]">
              Keep the cycle going.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
