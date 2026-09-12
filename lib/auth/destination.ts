import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedDestination() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.onboarding_completed ? "/dashboard" : "/onboarding";
}
