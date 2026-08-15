import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function PublicNavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur
      dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/events" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">M</span>
          MSc Society
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/admin/login" className="btn-secondary !px-3.5 !py-2 text-sm">Admin Login</Link>
        </div>
      </div>
    </header>
  );
}