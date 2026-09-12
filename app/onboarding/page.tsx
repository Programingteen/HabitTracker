import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();

  // -------------------------------------------------------
  // Require authentication
  // -------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // -------------------------------------------------------
  // Check onboarding status
  // -------------------------------------------------------

  const {
    data: profile,
    error,
  } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load onboarding status:",
      error
    );

    // Don't silently let the user continue when we
    // couldn't determine their onboarding state.
    throw new Error(
      "We couldn't load your account. Please try again."
    );
  }

  // -------------------------------------------------------
  // Already onboarded
  // -------------------------------------------------------

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  // -------------------------------------------------------
  // Show onboarding
  // -------------------------------------------------------

  return <OnboardingForm />;
}