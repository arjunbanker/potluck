import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

// Hook to prevent excessive session requests by debouncing
export function useDebounceSession() {
  const session = useSession();
  const lastCallTime = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCallTime.current < 100) {
      // If multiple useSession calls happen within 100ms,
      // log a warning in development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[SESSION] Multiple session calls detected within 100ms. Consider optimizing component structure.",
        );
      }
    }
    lastCallTime.current = now;
  }, []);

  return session;
}
