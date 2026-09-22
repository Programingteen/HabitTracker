import type { ReactNode } from "react";
import Logo from "@/components/brand/Logo";

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-[#FAFAF9] text-[#18181B]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:px-8">
        <header className="flex h-16 items-center sm:h-20"><Logo /></header>
        <div className="flex flex-1 items-start justify-center py-8 sm:items-center sm:py-16">{children}</div>
        <footer className="flex min-h-14 items-center justify-center text-center text-xs text-[#A1A1AA]">© {new Date().getFullYear()} HabitTracker</footer>
      </div>
    </main>
  );
}
