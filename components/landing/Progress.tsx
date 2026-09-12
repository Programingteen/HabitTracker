"use client";

import { useEffect, useRef, useState } from "react";

const goals = [
  {
    name: "Mathematics",
    value: 94,
  },
  {
    name: "Reading",
    value: 87,
  },
  {
    name: "Exercise",
    value: 71,
  },
  {
    name: "Personal project",
    value: 52,
  },
];

const chartPoints = [
  { x: 0, y: 72 },
  { x: 12, y: 68 },
  { x: 24, y: 75 },
  { x: 36, y: 64 },
  { x: 48, y: 69 },
  { x: 60, y: 58 },
  { x: 72, y: 62 },
  { x: 84, y: 47 },
  { x: 100, y: 52 },
];

function buildLinePath() {
  return chartPoints
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${point.x} ${point.y}`;
    })
    .join(" ");
}

function buildAreaPath() {
  const line = buildLinePath();

  return `${line} L 100 100 L 0 100 Z`;
}

export default function Insights() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [consistency, setConsistency] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);

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

    let value = 0;

    const interval = window.setInterval(() => {
      value += 2;

      if (value >= 82) {
        value = 82;
        window.clearInterval(interval);
      }

      setConsistency(value);
    }, 18);

    const barsTimer = window.setTimeout(() => {
      setBarsVisible(true);
    }, 550);

    const insightTimer = window.setTimeout(() => {
      setInsightVisible(true);
    }, 850);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(barsTimer);
      window.clearTimeout(insightTimer);
    };
  }, [visible]);

  const linePath = buildLinePath();
  const areaPath = buildAreaPath();

  return (
    <section
      ref={sectionRef}
      id="insights"
      aria-labelledby="insights-heading"
      className="overflow-hidden bg-[#FAFAF9]"
    >
      <div className="container">
        <div
          className="
            grid
            items-center
            gap-14
            py-24
            sm:py-28
            lg:grid-cols-[0.78fr_1.22fr]
            lg:gap-20
            lg:py-32
          "
        >
          {/* =====================================================
              COPY
              ===================================================== */}

          <div
            className={[
              "max-w-xl",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#D4D4D8]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                Insight
              </span>
            </div>

            <h2
              id="insights-heading"
              className="
                mt-7
                max-w-[10ch]
                text-[clamp(3rem,5.5vw,5rem)]
                font-semibold
                leading-[0.94]
                tracking-[-0.06em]
                text-[#18181B]
              "
            >
              Don&apos;t just track it.
              <br />
              Understand it.
            </h2>

            <p className="mt-7 max-w-md text-[16px] leading-7 tracking-[-0.012em] text-[#52525B] sm:text-[17px] sm:leading-8">
              See where you&apos;re consistent, where you&apos;re slipping,
              and what deserves your attention next.
            </p>

            <div className="mt-10 border-l border-[#D4D4D8] pl-4">
              <p className="max-w-sm text-[13px] leading-6 tracking-[-0.005em] text-[#71717A]">
                <span className="font-medium text-[#52525B]">
                  Numbers are useful
                </span>{" "}
                when they change what you do next.
              </p>
            </div>
          </div>

          {/* =====================================================
              ANALYTICS PANEL
              ===================================================== */}

          <div
            className={[
              "relative",
              "transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0",
            ].join(" ")}
          >
            <div className="rounded-[1.75rem] border border-[#E4E4E7] bg-white p-5 shadow-[var(--shadow-md)] sm:p-7 lg:p-8">
              {/* =================================================
                  PANEL HEADER
                  ================================================= */}

              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                    Consistency
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <span
                      key={consistency}
                      className="
                        min-w-[3.1ch]
                        text-[clamp(3.5rem,7vw,5rem)]
                        font-semibold
                        leading-[0.85]
                        tracking-[-0.07em]
                        text-[#18181B]
                      "
                    >
                      {consistency}
                    </span>

                    <span className="pb-1.5 text-[13px] font-medium text-[#A1A1AA]">
                      %
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#A1A1AA]">
                    Last 30 days
                  </p>
                </div>

                <div className="rounded-full border border-[#E4E4E7] bg-[#FAFAF9] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71717A]">
                  Overview
                </div>
              </div>

              {/* =================================================
                  CHART
                  ================================================= */}

              <div className="mt-8">
                <div className="relative h-[150px] overflow-hidden rounded-2xl bg-[#FAFAF9] p-4 sm:h-[180px] sm:p-5">
                  {/* Grid lines */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 inset-y-5 flex flex-col justify-between sm:inset-x-5"
                  >
                    <span className="h-px w-full bg-[#EDEDEB]" />
                    <span className="h-px w-full bg-[#EDEDEB]" />
                    <span className="h-px w-full bg-[#EDEDEB]" />
                    <span className="h-px w-full bg-[#EDEDEB]" />
                  </div>

                  {/* SVG graph */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] sm:inset-5 sm:h-[calc(100%-2.5rem)] sm:w-[calc(100%-2.5rem)]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="insight-area"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#18181B"
                          stopOpacity="0.08"
                        />
                        <stop
                          offset="100%"
                          stopColor="#18181B"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d={areaPath}
                      fill="url(#insight-area)"
                      className={[
                        "transition-opacity duration-1000",
                        visible ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#18181B"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                      pathLength="1"
                      className={[
                        "transition-[stroke-dashoffset] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        visible
                          ? "[stroke-dashoffset:0]"
                          : "[stroke-dashoffset:1]",
                      ].join(" ")}
                      style={{
                        strokeDasharray: 1,
                        strokeDashoffset: visible ? 0 : 1,
                      }}
                    />

                    <circle
                      cx="100"
                      cy="52"
                      r="2.2"
                      fill="#18181B"
                      vectorEffect="non-scaling-stroke"
                      className={[
                        "transition-all duration-500 delay-700",
                        visible
                          ? "scale-100 opacity-100"
                          : "scale-0 opacity-0",
                      ].join(" ")}
                      style={{
                        transformOrigin: "100px 52px",
                      }}
                    />
                  </svg>

                  {/* Graph labels */}
                  <div className="absolute bottom-2.5 left-4 right-4 flex justify-between text-[9px] font-medium text-[#A1A1AA] sm:left-5 sm:right-5">
                    <span>Aug 11</span>
                    <span>Aug 18</span>
                    <span>Aug 25</span>
                    <span>Sep 9</span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  GOALS
                  ================================================= */}

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A1A1AA]">
                    Commitments
                  </span>

                  <span className="text-[10px] text-[#A1A1AA]">
                    Consistency
                  </span>
                </div>

                <div className="space-y-3">
                  {goals.map((goal, index) => {
                    const strong = goal.value >= 80;
                    const attention = goal.value < 60;

                    return (
                      <div key={goal.name}>
                        <div className="mb-1.5 flex items-center justify-between gap-4">
                          <span className="text-[11px] font-medium tracking-[-0.005em] text-[#52525B]">
                            {goal.name}
                          </span>

                          <span
                            className={[
                              "text-[10px] font-semibold",
                              attention
                                ? "text-[#D97706]"
                                : strong
                                  ? "text-[#16A34A]"
                                  : "text-[#71717A]",
                            ].join(" ")}
                          >
                            {goal.value}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F0EF]">
                          <div
                            className={[
                              "h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                              attention
                                ? "bg-[#D97706]"
                                : strong
                                  ? "bg-[#18181B]"
                                  : "bg-[#71717A]",
                            ].join(" ")}
                            style={{
                              width: barsVisible ? `${goal.value}%` : "0%",
                              transitionDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  ACTIONABLE INSIGHT
                  ================================================= */}

              <div
                className={[
                  "mt-7 rounded-2xl border border-[#F2E7D7] bg-[#FFFCF8] p-4 sm:p-5",
                  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  insightVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                ].join(" ")}
              >
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706]">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="size-3.5"
                    >
                      <path
                        d="M8 2.5v11M4.5 6 8 2.5 11.5 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#B49B7D]">
                      Needs attention
                    </p>

                    <p className="mt-1 text-[13px] font-semibold tracking-[-0.015em] text-[#18181B]">
                      Personal project
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#8A7B69]">
                      Your weakest commitment this month. Consider lowering
                      the target or protecting time for it.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FOOTER
                  ================================================= */}

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-medium text-[#A1A1AA]">
                  Based on your completed commitments.
                </span>

                <span className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA] sm:inline">
                  Learn from the pattern
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CLOSING TRANSITION
            ===================================================== */}

        <div className="flex justify-center pb-20 sm:pb-24 lg:pb-28">
          <p
            className={[
              "max-w-md text-center text-[12px] leading-6 text-[#A1A1AA]",
              "transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            ].join(" ")}
          >
            <span className="text-[#71717A]">
              Progress becomes useful
            </span>{" "}
            when it helps you decide what to do next.
          </p>
        </div>
      </div>
    </section>
  );
}
