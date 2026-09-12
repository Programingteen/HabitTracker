"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthFrame from "@/components/auth/AuthFrame";
import { createClient } from "@/lib/supabase/client";

const errors: Record<string, string> = { missing_code: "That sign-in link is incomplete. Please request a new one.", auth_failed: "That sign-in link has expired or is invalid. Please try again.", session_failed: "We couldn’t confirm your session. Please sign in again." };

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return; setMessage(""); setPending(true);
    const form = new FormData(event.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({ email: String(form.get("email") ?? "").trim(), password: String(form.get("password") ?? "") });
    if (error) { setMessage("We couldn’t sign you in with those details."); setPending(false); return; }
    router.replace("/"); router.refresh();
  }
  const callbackMessage = params.get("error") ? errors[params.get("error")!] ?? "We couldn’t complete that request. Please try again." : "";
  return <AuthFrame><section className="w-full max-w-md"><div className="mb-8 text-center"><p className="text-sm font-medium text-[#71717A]">Welcome back</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Keep showing up.</h1><p className="mt-4 text-[15px] leading-7 text-[#52525B]">Pick up where you left off.</p></div><form onSubmit={submit} className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8"><div className="space-y-5"><label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required disabled={pending} className="mt-2 h-12 w-full border border-[#D4D4D8] bg-[#FAFAF9] px-4 text-[15px] outline-none transition focus:border-[#18181B]" placeholder="you@example.com" /></label><label className="block text-sm font-medium">Password<Link href="/forgot-password" className="float-right text-xs font-medium text-[#52525B] underline underline-offset-4">Forgot password?</Link><input name="password" type="password" autoComplete="current-password" required disabled={pending} className="mt-2 h-12 w-full border border-[#D4D4D8] bg-[#FAFAF9] px-4 text-[15px] outline-none transition focus:border-[#18181B]" placeholder="Your password" /></label>{(message || callbackMessage) && <p role="alert" className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">{message || callbackMessage}</p>}<button disabled={pending} className="h-12 w-full rounded-full bg-[#18181B] px-5 text-sm font-semibold text-white transition hover:bg-[#29292C] disabled:opacity-60">{pending ? "Signing in…" : "Log in"}</button></div></form><p className="mt-7 text-center text-sm text-[#71717A]">New here? <Link href="/signup" className="font-semibold text-[#18181B] underline underline-offset-4">Create an account</Link></p></section></AuthFrame>;
}
