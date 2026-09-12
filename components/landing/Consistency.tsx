"use client";

import { useEffect, useRef, useState } from "react";

const consistencyDays = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,

  true,
  true,
  true,
  true,
  true,
  true,
  true,

  true,
  true,
  true,
  true,
  true,
  false,
  true,
];

const achievements = [
  {
    label: "First week",
    value: "7 days completed",
    icon: "check",
  },
  {
    label: "Milestone",
    value: "500 XP earned",
    icon: "arrow",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-3.5"
    >
      <path
        d="m3.5 8.2 2.6 2.6 6.4-6.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MilestoneIcon({ type }: { type: "check" | "arrow" }) {
  if (type === "check") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
        <CheckIcon />
      </span>
    );
  }

  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="size-3.5"
      >
        <path
          d="M3.5 11.5 11.5 3.5M6.5 3.5h5v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Flame() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-10 text-[#F97316]"
    >
      <path
        d="
          M13.36 2.25
          C13.7 5.1 12.82 6.84 11.55 8.34
          C10.62 9.43 9.74 10.47 9.55 12.15
          C9.4 13.5 9.88 14.61 10.72 15.52
          C8.82 14.78 7.47 13.29 6.92 11.45
          C5.44 13.4 4.5 15.6 4.5 17.36
          C4.5 20.5 6.95 22.75 10.05 22.75
          C11.1 22.75 12.08 22.47 12.94 21.95
          C13.82 22.47 14.85 22.75 15.95 22.75
          C19.06 22.75 21.5 20.28 21.5 17.18
          C21.5 12.77 18.47 8.9 13.36 2.25
          Z
        "
        fill="currentColor"
      />

      <path
        d="
          M12.78 12.4
          C12.92 14.05 12.3 15.17 11.6 16.08
          C10.98 16.89 10.68 17.65 10.78 18.45
          C10.91 19.5 11.76 20.28 12.94 20.58
          C13.43 20.7 13.95 20.75 14.47 20.75
          C15.89 20.75 17.02 19.72 17.02 18.3
          C17.02 16.67 15.85 14.83 12.78 12.4
          Z
        "
        fill="#FFF7ED"
      />
    </svg>
  );
}

export default function Consistency() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [activeDays, setActiveDays] = useState(0);
  const [streak, setStreak] = useState(0);

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
        threshold: 0.2,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let day = 0;

    const interval = window.setInterval(() => {
      day += 1;

      setActiveDays(day);

      if (day >= consistencyDays.length) {
        window.clearInterval(interval);

        window.setTimeout(() => {
          setStreak(17);
        }, 180);
      }
    }, 45);

    return () => window.clearInterval(interval);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="consistency"
      aria-labelledby="consistency-heading"
      className="overflow-hidden bg-[#18181B] text-[#FAFAF9]"
    >
      <div className="container">
        {/* =====================================================
            INTRO
            ===================================================== */}

        <div
          className={[
            "mx-auto max-w-3xl pt-24 text-center sm:pt-28 lg:pt-32",
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-white/20"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Progress
            </span>

            <span
              aria-hidden="true"
              className="h-px w-7 bg-white/20"
            />
          </div>

          <h2
            id="consistency-heading"
            className="
              mt-7
              text-[clamp(3rem,6vw,5rem)]
              font-semibold
              leading-[0.94]
              tracking-[-0.06em]
              text-white
            "
          >
            Your effort should
            <br className="hidden sm:block" /> leave evidence.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-7 tracking-[-0.012em] text-white/55 sm:text-[17px] sm:leading-8">
            Every completed commitment becomes part of a larger pattern.
          </p>
        </div>

        {/* =====================================================
            MAIN VISUAL
            ===================================================== */}

        <div
          className={[
            "mx-auto mt-16 max-w-[980px] pb-24 sm:mt-20 sm:pb-28 lg:mt-24 lg:pb-32",
            "transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0",
          ].join(" ")}
        >
          <div className="relative">
            {/* =================================================
                CONSISTENCY CARD
                ================================================= */}

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.10] bg-white/[0.045] p-5 backdrop-blur-sm sm:p-7 lg:p-8">
              {/* Header */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                    Consistency
                  </p>

                  <div className="mt-3 flex items-end gap-3">
                    <span
                      key={streak}
                      className="
                        text-[clamp(3.5rem,7vw,5.75rem)]
                        font-semibold
                        leading-[0.85]
                        tracking-[-0.07em]
                        text-white
                      "
                    >
                      {streak || 17}
                    </span>

                    <span className="pb-1.5 text-[13px] font-medium tracking-[-0.01em] text-white/45">
                      day streak
                    </span>
                  </div>
                </div>

                {/* Flame */}
                <div
                  className={[
                    "flex size-16 items-center justify-center rounded-2xl border",
                    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    activeDays >= consistencyDays.length
                      ? "scale-100 border-[#F97316]/20 bg-[#F97316]/10 opacity-100"
                      : "scale-90 border-white/10 bg-white/[0.03] opacity-40",
                  ].join(" ")}
                >
                  <Flame />
                </div>
              </div>

              {/* Divider */}
              <div className="my-7 h-px bg-white/[0.08] sm:my-8" />

              {/* Calendar */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    Last 21 days
                  </span>

                  <span className="text-[10px] text-white/30">
                    Consistency history
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {consistencyDays.map((completed, index) => {
                    const active = index < activeDays;

                    return (
                      <div
                        key={index}
                        className="flex aspect-square items-center justify-center"
                      >
                        <span
                          className={[
                            "flex size-full max-w-[54px] items-center justify-center rounded-xl border",
                            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            active && completed
                              ? "border-white/[0.12] bg-white text-[#18181B] shadow-[0_4px_16px_rgb(255_255_255/0.06)]"
                              : active
                                ? "border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]"
                                : "border-white/[0.08] bg-white/[0.025] text-transparent",
                            active ? "scale-100 opacity-100" : "scale-90 opacity-60",
                          ].join(" ")}
                        >
                          {active && completed ? (
                            <svg
                              viewBox="0 0 16 16"
                              fill="none"
                              aria-hidden="true"
                              className="size-3.5"
                            >
                              <path
                                d="m3.5 8 2.7 2.7L12.5 5"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer stat */}
              <div className="mt-7 flex flex-col gap-2 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-white/40">
                  17 consecutive days of showing up.
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/25">
                  Keep going
                </p>
              </div>
            </div>

            {/* =================================================
                ACHIEVEMENTS
                ================================================= */}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.label}
                  className={[
                    "flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5",
                    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    activeDays >= consistencyDays.length
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0",
                  ].join(" ")}
                  style={{
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <MilestoneIcon type={achievement.icon as "check" | "arrow"} />

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
                      {achievement.label}
                    </p>

                    <p className="mt-0.5 text-[12px] font-medium tracking-[-0.01em] text-white/65">
                      {achievement.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                CLOSING STATEMENT
                ================================================= */}

            <p
              className={[
                "mx-auto mt-9 max-w-md text-center text-[12px] leading-6 tracking-[-0.005em] text-white/35",
                "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                activeDays >= consistencyDays.length
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              ].join(" ")}
              style={{ transitionDelay: "450ms" }}
            >
              <span className="text-white/60">
                17 days isn&apos;t the goal.
              </span>{" "}
              Showing up is.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
