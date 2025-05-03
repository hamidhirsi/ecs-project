"use client";

import { SessionProvider } from "next-auth/react";
import SessionGuard from "../ui/sessionGuard";

export default function SessionGuardProvider({ session, children }: { session: any, children: React.ReactNode }) {
  return (
    <SessionProvider session={session}>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
