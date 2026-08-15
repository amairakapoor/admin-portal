"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Welcome back!");

      router.push(
        searchParams.get("redirectTo") || "/admin/dashboard"
      );

      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden
        bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900
        p-10 text-white lg:flex"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            M
          </span>

          MSc Society
        </div>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-semibold leading-tight">
            Manage every society event from one place.
          </h2>

          <p className="mt-4 max-w-sm text-sm text-white/70">
            Create, update, and publish events instantly to the public
            events page — no spreadsheets, no group chats.
          </p>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} MSc Society. Admin access only.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex w-full max-w-sm items-center justify-between lg:justify-end">
          <span className="text-lg font-semibold lg:hidden">
            MSc Society
          </span>

          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Login
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to manage events for the society.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  autoFocus
                  className="input-field pl-10"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full gap-1.5"
            >
              {loading ? "Signing in…" : "Sign In"}

              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Use the credentials configured in your environment variables.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-slate-500">Loading...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}