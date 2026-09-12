import Link from "next/link";

type LogoProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

/** The canonical HabitTracker mark, extracted directly from the landing navbar. */
export default function Logo({ href = "/", compact = false, className = "" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="HabitTracker home"
      className={`group/logo inline-flex items-center gap-3 ${className}`}
    >
      <span aria-hidden="true" className="relative flex size-[34px] shrink-0 items-center justify-center">
        <span className="absolute left-0 top-0 size-[18px] rounded-[5px] bg-[#1C1C1F] shadow-[0_2px_5px_rgba(28,28,31,0.10)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-[7px] group-hover/logo:translate-y-[7px] group-hover/logo:rotate-[6deg]" />
        <span className="absolute bottom-0 right-0 size-[18px] rounded-[5px] border-[1.5px] border-[#1C1C1F] bg-[#FAFAF9] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:-translate-x-[7px] group-hover/logo:-translate-y-[7px] group-hover/logo:-rotate-[6deg]" />
        <span className="absolute size-[5px] scale-50 rounded-full bg-[#FAFAF9] opacity-0 transition-all delay-100 duration-300 ease-out group-hover/logo:scale-100 group-hover/logo:opacity-100" />
      </span>
      {!compact && <span className="text-[15px] font-semibold tracking-[-0.035em] text-[#1C1C1F] transition-colors duration-200 group-hover/logo:text-[#3F3F42]">HabitTracker</span>}
    </Link>
  );
}
