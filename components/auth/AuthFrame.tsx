import type { ReactNode } from "react";
import Logo from "@/components/brand/Logo";

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-[#FAFAF9] text-[#18181B]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex h-20 items-center"><Logo /></header>
        <div className="flex flex-1 items-center justify-center py-10 sm:py-16">{children}</div>
        <footer className="flex h-16 items-center justify-center text-xs text-[#A1A1AA]">© {new Date().getFullYear()} HabitTracker</footer>
      </div>
    </main>
  );
}
