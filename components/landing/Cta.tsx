"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="
        size-3.5
        transition-transform
        duration-300
        ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:translate-x-0.5
        group-hover:-translate-y-0.5
      "
    >
      <path
        d="M4 12 12 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M7 4h5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
        threshold: 0.3,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="final-cta-heading"
      className="overflow-hidden bg-[#18181B] text-[#FAFAF9]"
    >
      <div className="container">
        <div className="flex min-h-[56svh] items-center justify-center py-24 sm:min-h-[60svh] sm:py-28 lg:py-32">
          <div
            className={[
              "w-full max-w-3xl text-center",
              "transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-white/15"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Begin
              </span>

              <span
                aria-hidden="true"
                className="h-px w-7 bg-white/15"
              />
            </div>

            <h2
              id="final-cta-heading"
              className="
                mt-8
                text-[clamp(3.4rem,7vw,6rem)]
                font-semibold
                leading-[0.9]
                tracking-[-0.07em]
                text-white
              "
            >
              Start your
              <br />
              first streak.
            </h2>

            <p
              className={[
                "mx-auto mt-7 max-w-md text-[15px] leading-7 tracking-[-0.01em] text-white/50 sm:text-[16px] sm:leading-8",
                "transition-all duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              ].join(" ")}
            >
              Build consistency one day at a time.
            </p>

            <div
              className={[
                "mt-9 flex flex-col items-center gap-4",
                "transition-all duration-700 delay-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              ].join(" ")}
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
                  bg-[#FAFAF9]
                  pl-5
                  pr-2
                  text-[13px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#18181B]
                  shadow-[0_4px_12px_rgb(0_0_0/0.18)]
                  transition-all
                  duration-300
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:-translate-y-px
                  hover:bg-white
                  hover:shadow-[0_10px_28px_rgb(0_0_0/0.24)]
                  active:translate-y-0
                "
              >
                <span>Start your first streak</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#18181B]
                    text-[#FAFAF9]
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                >
                  <ArrowIcon />
                </span>
              </Link>

              <span className="text-[11px] text-white/30">
                Free to start. No complicated setup.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
