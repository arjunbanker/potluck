"use client";

import { SessionProvider } from "next-auth/react";

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      // Disable aggressive refetching to prevent excessive API calls
      refetchOnWindowFocus={false}
      // Only refetch every 15 minutes
      refetchInterval={15 * 60}
      // Don't refetch when offline
      refetchWhenOffline={false}
      // Explicit base path
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}
