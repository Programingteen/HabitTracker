"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFrame from "@/components/auth/AuthFrame";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return; setMessage(""); const form = new FormData(event.currentTarget); const name = String(form.get("name") ?? "").trim(); const email = String(form.get("email") ?? "").trim(); const password = String(form.get("password") ?? "");
    if (!name || !email || password.length < 8) { setMessage("Enter your name, a valid email, and a password of at least 8 characters."); return; }
    setPending(true); const supabase = createClient();

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: name,
    },
    emailRedirectTo: new URL(
      "/auth/confirm",
      window.location.origin
    ).toString(),
  },
});

    if (error) { setMessage("We couldn’t create your account. Please try again."); setPending(false); return; }
    if (data.session) { router.replace("/"); router.refresh(); return; } router.replace(`/signup/check-email?email=${encodeURIComponent(email)}`);
  }
  return <AuthFrame><section className="w-full max-w-md"><div className="mb-8 text-center"><p className="text-sm font-medium text-[#71717A]">Start your journey</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Start showing up.</h1><p className="mt-4 text-[15px] leading-7 text-[#52525B]">Build a system around what matters to you.</p></div><form onSubmit={submit} className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8"><div className="space-y-5"><label className="block text-sm font-medium">Name<input name="name" autoComplete="name" required disabled={pending} className="mt-2 h-12 w-full border border-[#D4D4D8] bg-[#FAFAF9] px-4 outline-none focus:border-[#18181B]" placeholder="Your name" /></label><label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required disabled={pending} className="mt-2 h-12 w-full border border-[#D4D4D8] bg-[#FAFAF9] px-4 outline-none focus:border-[#18181B]" placeholder="you@example.com" /></label><label className="block text-sm font-medium">Password<input name="password" type="password" autoComplete="new-password" minLength={8} required disabled={pending} className="mt-2 h-12 w-full border border-[#D4D4D8] bg-[#FAFAF9] px-4 outline-none focus:border-[#18181B]" placeholder="At least 8 characters" /></label>{message && <p role="alert" className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">{message}</p>}<p className="text-xs leading-5 text-[#71717A]">By creating an account, you agree to our Terms and Privacy Policy.</p><button disabled={pending} className="h-12 w-full rounded-full bg-[#18181B] text-sm font-semibold text-white transition hover:bg-[#29292C] disabled:opacity-60">{pending ? "Creating account…" : "Create account"}</button></div></form><p className="mt-7 text-center text-sm text-[#71717A]">Already have an account? <Link href="/login" className="font-semibold text-[#18181B] underline underline-offset-4">Log in</Link></p></section></AuthFrame>;
}
