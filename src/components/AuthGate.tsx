"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthed } from "./LoginForm";

const PUBLIC_PREFIXES = ["/login", "/track"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const isPublic = PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    if (isPublic) {
      if (pathname === "/login" && isAdminAuthed()) {
        router.replace("/");
        return;
      }
      setAllowed(true);
      setReady(true);
      return;
    }

    if (!isAdminAuthed()) {
      router.replace("/login");
      setAllowed(false);
      setReady(true);
      return;
    }

    setAllowed(true);
    setReady(true);
  }, [pathname, router, isPublic]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-text-muted">
        Loading…
      </div>
    );
  }

  if (!allowed && !isPublic) return null;

  return <>{children}</>;
}
