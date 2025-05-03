'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.expires) {
      // Get expiration time from the session
      const expiresAt = new Date(session.expires).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry <= 0) {
        // Session has already expired
        signOut({ redirect: false }).then(() => router.push("/login"));
        return;
      }

      // Set up a timeout to redirect when the session expires
      const timeout = setTimeout(() => {
        signOut({ redirect: false }).then(() => router.push("/login"));
      }, timeUntilExpiry);

      return () => clearTimeout(timeout);
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return null;
  }

  return <>{children}</>;
}