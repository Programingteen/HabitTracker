"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Commit",
    description: "Choose what matters.",
  },
  {
    number: "02",
    title: "Act",
    description: "Do the work.",
  },
  {
    number: "03",
    title: "Record",
    description: "Mark it done.",
  },
  {
    number: "04",
    title: "Return",
    description: "Come back tomorrow.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  /* ---------------------------------------------------------
     Start the sequence only when the section enters the
     viewport.
     --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     Finite animation:
     Commit -> Act -> Record -> Return
     --------------------------------------------------------- */

  useEffect(() => {
    if (!visible) return;

    let step = -1;

    const interval = window.setInterval(() => {
      step += 1;

      if (step > steps.length - 1) {
        window.clearInterval(interval);
        return;
      }

      setActiveStep(step);
    }, 700);

    return () => window.clearInterval(interval);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-[#FAFAF9]"
    >
      <div className="container">
        {/* =====================================================
            INTRO
            ===================================================== */}

        <div
          className={[
            "mx-auto max-w-3xl pt-20 text-center sm:pt-24 lg:pt-28",
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#D4D4D8]"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
              How it works
            </span>

            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#D4D4D8]"
            />
          </div>

          <h2
            id="how-it-works-heading"
            className="
              mt-7
              text-[clamp(3rem,6vw,5rem)]
              font-semibold
              leading-[0.94]
              tracking-[-0.06em]
              text-[#18181B]
            "
          >
            Consistency is a cycle.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-7 tracking-[-0.012em] text-[#52525B] sm:text-[17px] sm:leading-8">
            Choose what matters. Do the work. Record it. Come back tomorrow.
          </p>
        </div>

        {/* =====================================================
            DESKTOP TIMELINE
            ===================================================== */}

        <div
          className={[
            "relative mx-auto mt-20 hidden max-w-[1080px] sm:block lg:mt-24",
            "transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0",
          ].join(" ")}
        >
          {/* Base line */}
          <div
            aria-hidden="true"
            className="
              absolute
              left-[11%]
              right-[11%]
              top-[11px]
              h-px
              bg-[#D4D4D8]
            "
          />

          {/* Active line */}
          <div
            aria-hidden="true"
            className="
              absolute
              left-[11%]
              top-[11px]
              h-px
              bg-[#18181B]
              transition-[width]
              duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
            "
            style={{
              width:
                activeStep < 0
                  ? "0%"
                  : `${(activeStep / 3) * 78}%`,
            }}
          />

          {/* Return line */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute left-[11%] right-[11%] top-[11px]",
              "h-[72px] border-b border-l border-r border-[#D4D4D8]",
              "rounded-b-[2rem]",
              "transition-colors duration-500",
              activeStep >= 3 ? "border-[#18181B]" : "",
            ].join(" ")}
          />

          {/* Return arrow */}
          <div
            aria-hidden="true"
            className={[
              "absolute bottom-[-7px] left-[10.2%]",
              "flex size-3 items-center justify-center",
              "transition-all duration-500",
              activeStep >= 3
                ? "translate-y-0 text-[#18181B]"
                : "translate-y-1 text-[#A1A1AA]",
            ].join(" ")}
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="size-3"
            >
              <path
                d="M9.5 4.5 6 8 2.5 4.5"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-4">
            {steps.map((step, index) => {
              const active = activeStep >= index;
              const current = activeStep === index;

              return (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <span
                    aria-hidden="true"
                    className={[
                      "relative z-10 flex size-[23px] items-center justify-center rounded-full border bg-[#FAFAF9]",
                      "transition-all duration-500",
                      active
                        ? "border-[#18181B]"
                        : "border-[#D4D4D8]",
                      current ? "scale-110" : "scale-100",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "size-1.5 rounded-full transition-all duration-500",
                        active
                          ? "bg-[#18181B]"
                          : "bg-[#D4D4D8]",
                        current ? "scale-125" : "scale-100",
                      ].join(" ")}
                    />
                  </span>

                  {/* Step copy */}
                  <div className="mt-7">
                    <p
                      className={[
                        "text-[10px] font-semibold tracking-[0.16em] transition-colors duration-300",
                        active
                          ? "text-[#A1A1AA]"
                          : "text-[#D4D4D8]",
                      ].join(" ")}
                    >
                      {step.number}
                    </p>

                    <h3
                      className={[
                        "mt-2 text-[16px] font-semibold tracking-[-0.025em] transition-colors duration-300",
                        active
                          ? "text-[#18181B]"
                          : "text-[#A1A1AA]",
                      ].join(" ")}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={[
                        "mx-auto mt-1.5 max-w-[130px] text-[12px] leading-5 transition-colors duration-300",
                        active
                          ? "text-[#71717A]"
                          : "text-[#A1A1AA]",
                      ].join(" ")}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loop-back caption */}
          <div className="mt-24 flex items-center justify-center gap-2">
            <span className="text-[11px] font-medium text-[#A1A1AA]">
              Then begin again.
            </span>

            <span
              aria-hidden="true"
              className={[
                "text-[13px] transition-colors duration-500",
                activeStep >= 3
                  ? "text-[#18181B]"
                  : "text-[#A1A1AA]",
              ].join(" ")}
            >
              ↺
            </span>
          </div>
        </div>

        {/* =====================================================
            MOBILE TIMELINE
            ===================================================== */}

        <div
          className={[
            "mt-14 sm:hidden",
            "transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0",
          ].join(" ")}
        >
          <div className="relative ml-3 border-l border-[#D4D4D8] pl-8">
            {steps.map((step, index) => {
              const active = activeStep >= index;
              const current = activeStep === index;

              return (
                <div
                  key={step.title}
                  className={[
                    "relative pb-11 last:pb-0",
                    "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active
                      ? "translate-x-0 opacity-100"
                      : "translate-x-2 opacity-50",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute -left-[2.4rem] top-0.5 flex size-4 items-center justify-center rounded-full border bg-[#FAFAF9]",
                      "transition-all duration-500",
                      active
                        ? "border-[#18181B]"
                        : "border-[#D4D4D8]",
                      current ? "scale-125" : "scale-100",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "size-1.5 rounded-full transition-all duration-500",
                        active
                          ? "bg-[#18181B]"
                          : "bg-transparent",
                      ].join(" ")}
                    />
                  </span>

                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "text-[9px] font-semibold tracking-[0.15em] transition-colors duration-300",
                            active
                              ? "text-[#A1A1AA]"
                              : "text-[#D4D4D8]",
                          ].join(" ")}
                        >
                          {step.number}
                        </span>

                        <h3
                          className={[
                            "text-[16px] font-semibold tracking-[-0.025em] transition-colors duration-300",
                            active
                              ? "text-[#18181B]"
                              : "text-[#A1A1AA]",
                          ].join(" ")}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <p className="mt-1.5 text-[13px] leading-6 text-[#71717A]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-9 flex items-center gap-2 pl-1">
            <span className="text-[13px] text-[#A1A1AA]">
              ↺
            </span>

            <span className="text-[11px] font-medium text-[#A1A1AA]">
              Then begin again.
            </span>
          </div>
        </div>

        {/* =====================================================
            CLOSING STATEMENT
            ===================================================== */}

        <div
          className="
            mx-auto
            max-w-xl
            pb-20
            pt-14
            text-center
            sm:pb-24
            sm:pt-16
            lg:pb-28
          "
        >
          <p className="text-[13px] leading-6 tracking-[-0.005em] text-[#71717A]">
            <span className="text-[#52525B]">
              The goal isn&apos;t to finish once.
            </span>{" "}
            It&apos;s to keep returning.
          </p>
        </div>
      </div>
    </section>
  );
}
