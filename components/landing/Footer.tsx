import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return <footer className="border-t border-[#E4E4E7] bg-[#FAFAF9]"><div className="container"><div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between"><div><Logo /><p className="mt-4 text-sm text-[#71717A]">Consistency, made visible.</p></div><nav aria-label="Footer navigation" className="flex gap-6 text-sm font-medium text-[#71717A]"><Link href="#how-it-works" className="hover:text-[#18181B]">How it works</Link><Link href="#about" className="hover:text-[#18181B]">About</Link></nav></div><div className="flex flex-col gap-2 border-t border-[#EDEDEB] py-5 text-xs text-[#A1A1AA] sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} HabitTracker</span><span>One day at a time.</span></div></div></footer>;
}
