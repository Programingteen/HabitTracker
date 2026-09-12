import { redirect } from "next/navigation";
import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import { createClient } from "@/lib/supabase/server";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login"); const { data: profile } = await supabase.from("profiles").select("name, onboarding_completed").eq("id", user.id).maybeSingle(); if (!profile?.onboarding_completed) redirect("/onboarding"); return <AuthenticatedShell name={profile.name?.trim() || user.user_metadata?.name || user.email?.split("@")[0] || "Account"}>{children}</AuthenticatedShell>; }
