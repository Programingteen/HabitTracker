"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type OnboardingGoal = {
  name: string;
};

const MAX_GOALS = 10;
const MAX_GOAL_NAME_LENGTH = 120;

export async function completeOnboarding(
  goals: OnboardingGoal[]
) {
  const supabase = await createClient();

  // -------------------------------------------------------
  // Get authenticated user
  // -------------------------------------------------------

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to continue.");
  }

  // -------------------------------------------------------
  // Validate input
  // -------------------------------------------------------

  if (!Array.isArray(goals) || goals.length === 0) {
    throw new Error("Add at least one goal.");
  }

  if (goals.length > MAX_GOALS) {
    throw new Error(
      `You can add up to ${MAX_GOALS} goals.`
    );
  }

  // -------------------------------------------------------
  // Normalize and validate goal names
  // -------------------------------------------------------

  const normalizedGoals = goals.map((goal) => {
    const name = goal.name.trim();

    if (!name) {
      throw new Error("Every goal needs a name.");
    }

    if (name.length > MAX_GOAL_NAME_LENGTH) {
      throw new Error(
        `Goal names must be ${MAX_GOAL_NAME_LENGTH} characters or less.`
      );
    }

    return name;
  });

  // -------------------------------------------------------
  // Prevent duplicate goal names
  // -------------------------------------------------------

  const normalizedNames = normalizedGoals.map((name) =>
    name.toLocaleLowerCase()
  );

  if (
    new Set(normalizedNames).size !==
    normalizedNames.length
  ) {
    throw new Error(
      "Each goal should have a different name."
    );
  }

  // -------------------------------------------------------
  // Build rows for Supabase
  // -------------------------------------------------------

  const goalRows = normalizedGoals.map(
    (name, index) => ({
      user_id: user.id,
      name,
      active: true,
      position: index,
    })
  );

  // -------------------------------------------------------
  // Insert goals
  // -------------------------------------------------------

  const { data: existingGoals, error: existingGoalsError } = await supabase
    .from("goals")
    .select("name")
    .eq("user_id", user.id);

  if (existingGoalsError) {
    throw new Error("We couldn't verify your existing goals. Please try again.");
  }

  const existingNames = new Set(existingGoals.map((goal) => goal.name.toLocaleLowerCase()));
  const goalsToInsert = goalRows.filter((goal) => !existingNames.has(goal.name.toLocaleLowerCase()));
  const { error: goalsError } = goalsToInsert.length
    ? await supabase.from("goals").insert(goalsToInsert)
    : { error: null };

  if (goalsError) {
    console.error(
      "Failed to save onboarding goals:",
      goalsError
    );

    throw new Error(
      "We couldn't save your goals. Please try again."
    );
  }

  // -------------------------------------------------------
  // Mark onboarding as completed
  // -------------------------------------------------------

  /*
   * Do not use upsert here. `profiles.name` is NOT NULL, and Postgres validates
   * the attempted INSERT payload before it can resolve an ON CONFLICT update.
   * Supplying only id + onboarding_completed therefore fails even for an
   * existing profile row. An explicit update also lets us verify that the
   * authenticated user's row was actually targeted.
   */
  const { data: updatedProfiles, error: profileUpdateError } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id)
    .select("id, onboarding_completed");

  if (profileUpdateError) {
    console.error(
      "Failed to update onboarding status:",
      {
        operation: "profiles.update",
        userId: user.id,
        code: profileUpdateError.code,
        message: profileUpdateError.message,
        details: profileUpdateError.details,
        hint: profileUpdateError.hint,
      }
    );

    throw new Error(
      `Your goals were saved, but we couldn't update your onboarding status${profileUpdateError.code ? ` (${profileUpdateError.code})` : ""}. Please try again.`
    );
  }

  /*
   * A profile is normally created at signup. If a legacy account has no row,
   * create the complete row rather than silently succeeding with zero updated
   * rows. This branch includes the required name field and remains scoped to
   * the authenticated user's id.
   */
  if (!updatedProfiles?.length) {
    const name =
      typeof user.user_metadata?.name === "string" &&
      user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : user.email?.split("@")[0] || "HabitTracker user";

    const { data: insertedProfile, error: profileInsertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name,
        onboarding_completed: true,
      })
      .select("id, onboarding_completed")
      .maybeSingle();

    if (profileInsertError || !insertedProfile?.onboarding_completed) {
      console.error("Failed to create missing onboarding profile:", {
        operation: "profiles.insert",
        userId: user.id,
        code: profileInsertError?.code,
        message: profileInsertError?.message,
        details: profileInsertError?.details,
        hint: profileInsertError?.hint,
        insertedProfile,
      });

      throw new Error(
        `Your goals were saved, but we couldn't create your onboarding profile${profileInsertError?.code ? ` (${profileInsertError.code})` : ""}. Please try again.`
      );
    }
  } else if (!updatedProfiles[0].onboarding_completed) {
    throw new Error(
      "Your goals were saved, but your onboarding status was not updated. Please try again."
    );
  }

  // -------------------------------------------------------
  // Send user to dashboard
  // -------------------------------------------------------

  redirect("/dashboard");
}
