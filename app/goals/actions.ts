"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Your session has expired. Please sign in again.");

  return { user, supabase };
}

export async function addGoal(formData: FormData) {
  const { user, supabase } = await getAuthenticatedUser();

  const name = formData.get("goal-name") as string;
  const description = formData.get("goal-description") as string | null;

  if (!name?.trim()) throw new Error("Goal name is required.");

  const { error } = await supabase.from("goals").insert({
    name: name.trim(),
    description: description?.trim() || null,
    user_id: user.id,
    active: true,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/goals");
}

export async function editGoal(formData: FormData) {
  const { user, supabase } = await getAuthenticatedUser();

  const goalId = formData.get("goal-id") as string;
  const name = formData.get("goal-name") as string;
  const description = formData.get("goal-description") as string | null;

  if (!goalId) throw new Error("Goal not found.");
  if (!name?.trim()) throw new Error("Goal name is required.");

  const { error } = await supabase
    .from("goals")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/goals");
}

export async function deleteGoal(formData: FormData) {
  const { user, supabase } = await getAuthenticatedUser();

  const goalId = formData.get("goal-id") as string;

  if (!goalId) throw new Error("Goal not found.");

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/goals");
}