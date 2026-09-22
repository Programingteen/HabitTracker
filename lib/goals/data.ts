import { createClient } from "@/lib/supabase/server";

type GoalRow = { id: string; name: string; description: string | null; active: boolean; created_at: string };

export async function getGoals(): Promise<{ goals: GoalRow[]; userName: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Your session has expired. Please sign in again.");

  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, description, active, created_at")
    .eq("user_id", user.id)
    .order("position");

  if (goalsError) {
  console.error("getGoals Supabase error:", goalsError);
  throw new Error(`Failed to load goals: ${goalsError.message}`);
}

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "there";

  return { goals: goals ?? [], userName };
}