"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/onboarding/actions";
import Logo from "@/components/brand/Logo";

type GoalDraft = {
  id: string;
  name: string;
};

const MAX_GOALS = 10;
const MAX_GOAL_NAME_LENGTH = 120;

function createGoal(name = ""): GoalDraft {
  return {
    id: crypto.randomUUID(),
    name,
  };
}

export default function OnboardingForm() {
  const [goals, setGoals] = useState<GoalDraft[]>([
    createGoal(),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const namedGoals = goals.filter(
    (goal) => goal.name.trim().length > 0
  );

  function updateGoal(id: string, name: string) {
    setError(null);

    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? { ...goal, name }
          : goal
      )
    );
  }

  function addGoal() {
    if (goals.length >= MAX_GOALS) {
      setError(`You can add up to ${MAX_GOALS} goals.`);
      return;
    }

    setError(null);

    setGoals((current) => [
      ...current,
      createGoal(),
    ]);
  }

  function removeGoal(id: string) {
    setError(null);

    setGoals((current) => {
      const next = current.filter(
        (goal) => goal.id !== id
      );

      return next.length > 0
        ? next
        : [createGoal()];
    });
  }

  function validate() {
    if (namedGoals.length === 0) {
      return "Add at least one goal to get started.";
    }

    const names = namedGoals.map((goal) =>
      goal.name.trim()
    );

    const normalizedNames = names.map((name) =>
      name.toLocaleLowerCase()
    );

    if (
      new Set(normalizedNames).size !==
      normalizedNames.length
    ) {
      return "Each goal should have a different name.";
    }

    for (const name of names) {
      if (name.length > MAX_GOAL_NAME_LENGTH) {
        return `Goal names must be ${MAX_GOAL_NAME_LENGTH} characters or less.`;
      }
    }

    return null;
  }

  async function handleSubmit() {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding(
        namedGoals.map((goal) => ({
          name: goal.name.trim(),
        }))
      );
    } catch (err) {
      console.error("Onboarding failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#fafaf9] text-zinc-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex h-16 items-center justify-between sm:h-20">
          <Logo />

          <span className="text-xs font-medium text-zinc-400">
            Setup
          </span>
        </header>

        {/* Main */}
        <div className="flex flex-1 items-start justify-center py-12 sm:py-16 lg:items-center lg:py-20">
          <section className="w-full max-w-2xl">

            {/* Heading */}
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500">
                Let&apos;s get started
              </p>

              <h1
                className="
                  mt-3
                  text-[clamp(2.25rem,7vw,4.5rem)]
                  font-semibold
                  leading-[0.98]
                  tracking-[-0.055em]
                "
              >
                Build your daily system.
              </h1>

              <p
                className="
                  mx-auto mt-5 max-w-xl
                  text-[15px] leading-7
                  text-zinc-500
                  sm:text-base
                "
              >
                What do you want to show up for?
                Add the things that matter to you.
              </p>
            </div>

            {/* Goal editor */}
            <div className="mt-10 sm:mt-12">

              <div
                className="
                  overflow-hidden
                  rounded-[22px]
                  border border-zinc-200/90
                  bg-white
                  shadow-[0_8px_30px_rgba(0,0,0,0.035)]
                "
              >
                {goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className="
                      group flex min-h-[68px]
                      items-center
                      gap-3
                      border-b border-zinc-100
                      px-4
                      transition-colors
                      last:border-b-0
                      focus-within:bg-zinc-50/70
                      sm:min-h-[76px]
                      sm:px-5
                    "
                  >
                    {/* Goal indicator */}
                    <div
                      className="
                        flex h-7 w-7 shrink-0 items-center
                        justify-center
                        rounded-full
                        border border-zinc-200
                        bg-zinc-50
                        text-[11px]
                        font-medium
                        text-zinc-400
                        transition-colors
                        group-focus-within:border-zinc-300
                        group-focus-within:text-zinc-600
                      "
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>

                    {/* Input */}
                    <input
                      value={goal.name}
                      onChange={(event) =>
                        updateGoal(
                          goal.id,
                          event.target.value
                        )
                      }
                      maxLength={MAX_GOAL_NAME_LENGTH}
                      type="text"
                      placeholder={
                        index === 0
                          ? "Study mathematics"
                          : "What else matters?"
                      }
                      aria-label={`Goal ${index + 1}`}
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        py-5
                        text-[15px]
                        font-medium
                        tracking-[-0.01em]
                        text-zinc-900
                        outline-none
                        placeholder:text-zinc-300
                        sm:text-base
                      "
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        removeGoal(goal.id)
                      }
                      aria-label={`Remove ${
                        goal.name || "goal"
                      }`}
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-zinc-300
                        opacity-100
                        transition-colors
                        hover:bg-zinc-100
                        hover:text-zinc-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-zinc-200
                        sm:opacity-0
                        sm:group-hover:opacity-100
                        sm:group-focus-within:opacity-100
                      "
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add goal */}
              <button
                type="button"
                onClick={addGoal}
                disabled={goals.length >= MAX_GOALS}
                className="
                  mt-3
                  flex min-h-[58px] w-full
                  items-center justify-center
                  gap-2
                  rounded-[18px]
                  border border-dashed
                  border-zinc-300
                  bg-transparent
                  px-4
                  text-sm font-medium
                  text-zinc-500
                  transition-all
                  hover:border-zinc-400
                  hover:bg-white
                  hover:text-zinc-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <span className="text-lg leading-none">
                  +
                </span>

                Add another goal
              </button>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="mt-4 text-sm font-medium text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Bottom */}
              <div
                className="
                  mt-7
                  flex flex-col gap-4
                  sm:mt-8
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    {namedGoals.length === 0
                      ? "Your goals"
                      : `${namedGoals.length} ${
                          namedGoals.length === 1
                            ? "goal"
                            : "goals"
                        } added`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    You can edit or remove them later.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    namedGoals.length === 0
                  }
                  className="
                    flex min-h-[52px]
                    w-full items-center
                    justify-center
                    rounded-[16px]
                    bg-zinc-900
                    px-6
                    text-sm font-semibold
                    text-white
                    shadow-[0_1px_2px_rgba(0,0,0,0.1)]
                    transition-all
                    hover:bg-zinc-800
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:bg-zinc-200
                    disabled:text-zinc-400
                    disabled:shadow-none
                    sm:w-auto
                    sm:min-w-[210px]
                  "
                >
                  {isSubmitting
                    ? "Setting things up..."
                    : "Start my streak"}

                  {!isSubmitting && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 8h9M8.5 4.5L12 8l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Philosophy */}
            <p className="mt-12 text-center text-xs text-zinc-400">
              Progress, not perfection.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
