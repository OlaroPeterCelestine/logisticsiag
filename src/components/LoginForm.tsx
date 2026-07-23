"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const AUTH_KEY = "iag-admin-auth";

export function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function clearAdminAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@iag.local");
  const [password, setPassword] = useState("iagdemo");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      const ok =
        email.trim().toLowerCase() === "admin@iag.local" &&
        password === "iagdemo";

      if (!ok) {
        setError("Invalid email or password. Use the demo credentials below.");
        setLoading(false);
        return;
      }

      localStorage.setItem(AUTH_KEY, "1");
      if (remember) localStorage.setItem("iag-admin-email", email.trim());
      router.replace("/");
      router.refresh();
    }, 550);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-text"
        >
          Work email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-bg px-3.5 py-3 text-sm text-text outline-none transition placeholder:text-text-dim focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text"
          >
            Password
          </label>
          <button
            type="button"
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3.5 py-3 pr-11 text-sm text-text outline-none transition placeholder:text-text-dim focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-[var(--accent)]"
        />
        Keep me signed in on this device
      </label>

      {error ? (
        <p className="rounded-xl border border-red/30 bg-red-muted px-3 py-2.5 text-sm text-red">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign in to console"}
      </button>

      <p className="rounded-xl border border-border bg-bg-elevated px-3.5 py-3 text-xs leading-relaxed text-text-muted">
        Demo: <span className="font-medium text-text">admin@iag.local</span> /{" "}
        <span className="font-medium text-text">iagdemo</span>
      </p>
    </form>
  );
}
