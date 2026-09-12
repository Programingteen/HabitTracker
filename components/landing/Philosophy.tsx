"use client";

import { useEffect, useRef, useState } from "react";

export default function Philosophy() {
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
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="philosophy-heading"
      className="overflow-hidden bg-[#FAFAF9]"
    >
      <div className="container">
        <div className="flex min-h-[62svh] items-center justify-center py-28 sm:py-32 lg:min-h-[68svh] lg:py-40">
          <div
            className={[
              "max-w-4xl text-center",
              "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
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

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">
                The idea
              </span>

              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#D4D4D8]"
              />
            </div>

            <h2
              id="philosophy-heading"
              className="
                mt-9
                text-[clamp(3.5rem,8vw,7.5rem)]
                font-semibold
                leading-[0.88]
                tracking-[-0.075em]
                text-[#18181B]
              "
            >
              <span className="block">Small promises.</span>

              <span
                className={[
                  "mt-2 block text-[#71717A] sm:mt-3",
                  "transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                ].join(" ")}
              >
                Kept repeatedly.
              </span>
            </h2>

            <div
              className={[
                "mx-auto mt-10 h-px w-10 bg-[#D4D4D8]",
                "transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
              ].join(" ")}
            />

            <p
              className={[
                "mx-auto mt-7 max-w-md text-[15px] leading-7 tracking-[-0.01em] text-[#71717A] sm:text-[16px] sm:leading-8",
                "transition-all duration-700 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              ].join(" ")}
            >
              That&apos;s how consistency is built.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
