"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function signOut() {
    setPending(true);
    const { error } = await createClient().auth.signOut();
    if (!error) { router.replace("/"); router.refresh(); return; }
    setPending(false);
  }
  return <button type="button" onClick={signOut} disabled={pending} className="min-h-11 rounded-full px-4 text-sm font-medium text-[#71717A] transition hover:bg-white hover:text-[#18181B] disabled:opacity-50">{pending ? "Signing out…" : "Sign out"}</button>;
}
