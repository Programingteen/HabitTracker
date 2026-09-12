"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleTodayGoal(goalId: string, date: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("You must be signed in to update a goal.");

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (goalError || !goal) throw new Error("That goal is no longer available.");

  const { data: existing, error: existingError } = await supabase
    .from("goal_logs")
    .select("id")
    .eq("goal_id", goalId)
    .eq("user_id", user.id)
    .eq("date", date);
  if (existingError) throw new Error("We couldn't update this goal.");

  if (completed) {
    const { error } = existing.length
      ? await supabase.from("goal_logs").update({ value: 0 }).in("id", existing.map((row) => row.id))
      : await supabase.from("goal_logs").insert({ goal_id: goalId, user_id: user.id, date, value: 0 });
    if (error) throw new Error("We couldn't update this goal.");
  } else {
    const { error } = existing.length
      ? await supabase.from("goal_logs").update({ value: 1 }).in("id", existing.map((row) => row.id))
      : await supabase.from("goal_logs").insert({ goal_id: goalId, user_id: user.id, date, value: 1 });
    if (error) throw new Error("We couldn't update this goal.");
  }

  revalidatePath("/dashboard");
}
