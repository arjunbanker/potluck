// Debug utility to track session requests
let sessionRequestCount = 0;
let lastSessionRequest = 0;

export function logSessionRequest(source: string) {
  const now = Date.now();
  sessionRequestCount++;

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[SESSION DEBUG] Request #${sessionRequestCount} from: ${source}`,
      {
        timeSinceLastRequest: now - lastSessionRequest,
        timestamp: new Date().toISOString(),
      },
    );
  }

  lastSessionRequest = now;
}

export function resetSessionRequestCount() {
  sessionRequestCount = 0;
  lastSessionRequest = 0;
}
