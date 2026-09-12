
"use client";

import Link from "next/link";
import { useState } from "react";

const initialGoals = [
  {
    name: "Mathematics",
    target: "2 hours",
    completed: true,
  },
  {
    name: "Reading",
    target: "30 minutes",
    completed: true,
  },
  {
    name: "Exercise",
    target: "30 minutes",
    completed: true,
  },
  {
    name: "Personal project",
    target: "1 hour",
    completed: false,
  },
];

function Checkmark({ completed }: { completed: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex size-7 shrink-0 items-center justify-center rounded-full border",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        completed
          ? "border-[#16A34A] bg-[#16A34A] text-white"
          : "border-[#D4D4D8] bg-white text-transparent",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-3.5"
      >
        <path
          d="m4 8 2.5 2.5L12 5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* =========================================================
   CTA ICON
   A genuine curved-forward arrow.
   ========================================================= */

function CurvedForwardIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="
        size-3.5
        transition-transform
        duration-300
        ease-out
        group-hover:translate-x-0.5
        group-hover:-translate-y-0.5
      "
    >
      <path
        d="M4 12L12 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M7 4H12V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
/* =========================================================
   STREAK ICON
   Clean filled flame silhouette.
   ========================================================= */

export default function Hero() {
  const [goals, setGoals] = useState(initialGoals);

  const completedCount = goals.filter((goal) => goal.completed).length;
  const progress = completedCount * 25;

  /*
   * Streak state:
   *
   * 4/4 -> 17, orange
   * 3/4 -> 17, orange
   * 2/4 -> 16, gray
   * 1/4 -> 16, gray
   * 0/4 -> 16, gray
   */
  const streak = completedCount >= 3 ? 17 : 16;
  const streakIsMuted = completedCount <= 2;

  function toggleGoal(index: number) {
    setGoals((currentGoals) =>
      currentGoals.map((goal, goalIndex) =>
        goalIndex === index
          ? {
              ...goal,
              completed: !goal.completed,
            }
          : goal,
      ),
    );
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="container">
        <div
          className="
            grid
            min-h-[calc(100svh-88px)]
            items-center
            gap-14
            py-16
            sm:py-20
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
            lg:py-24
          "
        >
          {/* =====================================================
              HERO COPY
              ===================================================== */}

          <div className="relative z-10 max-w-xl">
            <div
              className="
                mb-7
                flex
                items-center
                gap-3
                opacity-0
                animate-fade-up
              "
              style={{ animationDelay: "40ms" }}
            >
              <span className="h-px w-7 bg-[#D4D4D8]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                Consistency, made visible
              </span>
            </div>

            <h1
              id="hero-heading"
              className="
                max-w-[10ch]
                text-[clamp(3.6rem,6vw,5.8rem)]
                font-semibold
                leading-[0.92]
                tracking-[-0.06em]
                text-[#18181B]
                opacity-0
                animate-fade-up
              "
              style={{ animationDelay: "100ms" }}
            >
              Keep showing up.
            </h1>

            <p
              className="
                mt-7
                max-w-[32rem]
                text-[17px]
                leading-8
                tracking-[-0.015em]
                text-[#52525B]
                opacity-0
                animate-fade-up
                sm:text-[18px]
              "
              style={{ animationDelay: "180ms" }}
            >
              Turn the things that matter to you into daily commitments,
              then build consistency one day at a time.
            </p>

            {/* CTA */}
            <div
              className="
                mt-9
                flex
                flex-col
                items-start
                gap-3
                opacity-0
                animate-fade-up
              "
              style={{ animationDelay: "260ms" }}
            >
              <Link
                href="/signup"
                className="
                  group
                  inline-flex
                  h-12
                  items-center
                  gap-3
                  rounded-full
                  bg-[#18181B]
                  pl-5
                  pr-2
                  text-[13px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#ffffff]
                  shadow-[0_2px_8px_rgb(0_0_0/0.07)]
                  transition-all
                  duration-300
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:-translate-y-px
                  hover:bg-[#29292C]
                  hover:shadow-[0_10px_24px_rgb(0_0_0/0.12)]
                  active:translate-y-0
                "
              >
                <span className="text-[#ffffff]">
                  Start your first streak
                </span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FAFAF9]
                    text-[#18181B]
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                >
                  <CurvedForwardIcon />
                </span>
              </Link>

              <span className="text-[11px] text-[#A1A1AA]">
                Free to start. No complicated setup.
              </span>
            </div>

            {/* Philosophy signal */}
            <div
              className="
                mt-11
                flex
                items-center
                gap-3
                text-[11px]
                font-medium
                tracking-[-0.005em]
                text-[#A1A1AA]
                opacity-0
                animate-fade-up
              "
              style={{ animationDelay: "340ms" }}
            >
              <span className="size-1.5 rounded-full bg-[#16A34A]" />

              <span>Built around progress, not perfection.</span>
            </div>
          </div>

          {/* =====================================================
              PRODUCT PREVIEW
              ===================================================== */}

          <div className="relative mx-auto w-full max-w-[650px] lg:justify-self-end">
            <div
              aria-hidden="true"
              className="
                absolute
                inset-x-8
                bottom-[-28px]
                top-8
                rounded-[2.5rem]
                bg-black/[0.035]
                blur-3xl
              "
            />

            <div
              className="
                relative
                opacity-0
                animate-scale-in
              "
              style={{ animationDelay: "160ms" }}
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-[#E4E4E7]
                  bg-white
                  shadow-[var(--shadow-product)]
                "
              >
                {/* =================================================
                    APP HEADER
                    ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#F0F0EF]
                    px-5
                    py-4
                    sm:px-6
                  "
                >
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#16A34A]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                      Today
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-[#A1A1AA]">
                    Wed · Sep 9
                  </span>
                </div>

                {/* =================================================
                    APP CONTENT
                    ================================================= */}

                <div className="bg-[#FAFAF9] p-5 sm:p-6">
                  {/* Greeting + streak */}
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#A1A1AA]">
                        Good morning.
                      </p>

                      <h2 className="mt-1.5 text-[25px] font-semibold tracking-[-0.045em] text-[#18181B] sm:text-[28px]">
                        Show up for yourself.
                      </h2>
                    </div>

                    {/* =============================================
                        STREAK
                        ============================================= */}

                    <div
                      className={[
                        "flex shrink-0 items-center gap-2.5 rounded-full",
                        "border px-3 py-2 transition-all duration-500",
                        streakIsMuted
                          ? "border-[#E4E4E7] bg-white"
                          : "border-[#F2E6DC] bg-[#FFFCF9]",
                      ].join(" ")}
                    >
                      <span
  aria-hidden="true"
  className={[
    "text-[22px] leading-none transition-all duration-500",
    streakIsMuted ? "grayscale opacity-30" : "",
  ].join(" ")}
>
  🔥
</span>

                      <div className="leading-none">
                        <p
                          key={streak}
                          className="
                            text-[12px]
                            font-semibold
                            tracking-[-0.015em]
                            text-[#18181B]
                          "
                        >
                          {streak} day streak
                        </p>

                        <p className="mt-1 text-[9px] text-[#A1A1AA]">
                          {streakIsMuted
                            ? "Work harder tomorrow"
                            : "Keep showing up"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-7">
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#A1A1AA]">
                        Daily progress
                      </span>

                      <span
                        key={progress}
                        className="
                          text-[10px]
                          font-semibold
                          text-[#16A34A]
                          transition-all
                          duration-300
                        "
                      >
                        {progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EAEAE8]">
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#18181B]
                          transition-[width]
                          duration-500
                          ease-[cubic-bezier(0.16,1,0.3,1)]
                        "
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="mt-5 divide-y divide-[#F0F0EF] rounded-[1.15rem] border border-[#E4E4E7] bg-white px-4 sm:px-5">
                    {goals.map((goal, index) => (
                      <button
                        key={goal.name}
                        type="button"
                        onClick={() => toggleGoal(index)}
                        aria-pressed={goal.completed}
                        className="
                          group
                          flex
                          min-h-[74px]
                          w-full
                          items-center
                          justify-between
                          gap-4
                          text-left
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span className="transition-transform duration-300 group-hover:scale-105">
                            <Checkmark completed={goal.completed} />
                          </span>

                          <span className="min-w-0">
                            <span
                              className={[
                                "block truncate text-[13px] font-medium tracking-[-0.015em]",
                                "transition-colors duration-300",
                                goal.completed
                                  ? "text-[#18181B]"
                                  : "text-[#52525B]",
                              ].join(" ")}
                            >
                              {goal.name}
                            </span>

                            <span className="mt-0.5 block text-[11px] text-[#A1A1AA]">
                              {goal.target}
                            </span>
                          </span>
                        </div>

                        <span
                          className={[
                            "shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em]",
                            "transition-colors duration-300",
                            goal.completed
                              ? "text-[#16A34A]"
                              : "text-[#A1A1AA]",
                          ].join(" ")}
                        >
                          {goal.completed ? "Done" : "Next"}
                        </span>

                        <span className="sr-only">
                          {goal.completed
                            ? `Mark ${goal.name} incomplete`
                            : `Mark ${goal.name} complete`}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Status */}
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-[1.1rem]
                      border
                      border-[#E4E4E7]
                      bg-white
                      px-4
                      py-3.5
                      transition-all
                      duration-500
                      sm:px-5
                    "
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                        Today
                      </p>

                      <p
                        key={completedCount}
                        className="mt-1 text-[12px] font-medium tracking-[-0.01em] text-[#52525B]"
                      >
                        {completedCount === 4
                          ? "Every commitment kept."
                          : completedCount === 0
                            ? "Start again tomorrow."
                            : `${4 - completedCount} more to go.`}
                      </p>
                    </div>

                    <span
                      className={[
                        "text-[9px] font-semibold uppercase tracking-[0.12em]",
                        completedCount === 4
                          ? "text-[#16A34A]"
                          : "text-[#A1A1AA]",
                      ].join(" ")}
                    >
                      {completedCount === 4
                        ? "Complete"
                        : "Keep going"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-[#F0F0EF]
                    bg-white
                    px-5
                    py-3.5
                    sm:px-6
                  "
                >
                  <span className="text-[10px] font-medium text-[#A1A1AA]">
                    Progress over perfection.
                  </span>
                </div>
              </div>

              {/* Floating confirmation */}
              <div
                className="
                  absolute
                  -bottom-5
                  -left-4
                  hidden
                  rounded-2xl
                  border
                  border-[#E4E4E7]
                  bg-white
                  px-4
                  py-3
                  shadow-[var(--shadow-md)]
                  sm:block
                  sm:opacity-0
                  sm:animate-fade-up
                "
                style={{ animationDelay: "800ms" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="size-3.5 text-[#16A34A]"
                      aria-hidden="true"
                    >
                      <path
                        d="m3.5 8.5 2.7 2.7L12.5 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold text-[#18181B]">
                      {completedCount} commitments kept
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#A1A1AA]">
                      {completedCount === 4
                        ? "Day complete."
                        : "Keep going."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SCROLL CUE
            ========================================================= */}

        <div className="-mt-2 flex justify-center pb-8 sm:pb-10 lg:-mt-4">
          <a
            href="#how-it-works"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-[#A1A1AA]
              transition-colors
              duration-200
              hover:text-[#52525B]
            "
          >
            <span>See how it works</span>

            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="
                size-3
                transition-transform
                duration-300
                ease-out
                group-hover:translate-y-0.5
              "
            >
              <path
                d="M8 3v9M4.5 8.5 8 12l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}