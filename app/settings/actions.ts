"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileName(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ name: name.trim() })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function updatePreferences(preferences: {
  week_starts_on?: "monday" | "sunday";
  default_progress_range?: 7 | 30 | 90;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update(preferences)
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
}

export async function saveWeekStartsOn(value: "monday" | "sunday") {
  await updatePreferences({
    week_starts_on: value,
  });
}

export async function saveProgressRange(value: 7 | 30 | 90) {
  await updatePreferences({
    default_progress_range: value,
  });
}

export async function exportUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const [profile, goals, logs] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("goals").select("*").eq("user_id", user.id),
    supabase.from("goal_logs").select("*").eq("user_id", user.id),
  ]);

  return {
    account: profile.data,
    goals: goals.data,
    history: logs.data,
    exported_at: new Date().toISOString(),
  };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await supabase.from("goal_logs").delete().eq("user_id", user.id);
  await supabase.from("goals").delete().eq("user_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);

  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);

  redirect("/");
}