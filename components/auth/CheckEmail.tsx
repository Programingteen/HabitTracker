"use client";

import Link from "next/link";
import AuthFrame from "@/components/auth/AuthFrame";

export default function CheckEmail({ email }: { email?: string }) {
  return <AuthFrame><section className="w-full max-w-md rounded-3xl border border-[#E4E4E7] bg-white p-7 text-center shadow-[var(--shadow-md)] sm:p-9"><span aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] text-xl">✉</span><p className="mt-7 text-sm font-medium text-[#71717A]">One more step</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">Check your email.</h1><p className="mt-4 text-[15px] leading-7 text-[#52525B]">We sent a confirmation link to <span className="font-medium text-[#18181B]">{email || "your email address"}</span>. Open it to finish creating your account.</p><p className="mt-5 rounded-xl bg-[#F5F5F4] px-4 py-3 text-sm leading-6 text-[#71717A]">It may take a minute to arrive. Check your spam or junk folder too.</p><Link href="/login" className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#18181B] text-sm font-semibold text-white">Back to login</Link><Link href="/signup" className="mt-4 inline-block text-sm font-medium text-[#52525B] underline underline-offset-4">Use a different email</Link></section></AuthFrame>;
}
