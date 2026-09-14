import { createClient } from "@/lib/supabase/server";

export type UserSettings = {
  id: string;
  name: string;
  email: string;
  timezone: string;
  week_starts_on: "monday" | "sunday";
  default_progress_range: 7 | 30 | 90;
};

export async function getUserSettings(): Promise<UserSettings> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, timezone, week_starts_on, default_progress_range")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Settings profile query failed:", profileError);
    throw new Error(`Failed to load settings: ${profileError.message}`);
  }

  // Ensure the columns exist, use defaults if not
  return {
    id: user.id,
    name: profile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    timezone: profile?.timezone || "UTC",
    week_starts_on: (profile?.week_starts_on as "monday" | "sunday") || "monday",
    default_progress_range: (Number(profile?.default_progress_range) as 7 | 30 | 90) || 30,
  };
}