"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur
      dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-base font-semibold">Event Dashboard</h1>
          <p className="text-xs text-slate-500">MSc Society Admin Portal</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={handleLogout} className="btn-secondary gap-1.5 !px-3.5 !py-2 text-sm">
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>
    </header>
  );
}