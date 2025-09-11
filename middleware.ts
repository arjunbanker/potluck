import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for session cookie first (quick check that doesn't require token validation)
  const sessionCookie = request.cookies.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
  );

  // If there's a session cookie and it's not empty, assume user is authenticated
  // This prevents unnecessary token validation requests
  if (sessionCookie?.value) {
    return NextResponse.next();
  }

  // Only do expensive token validation if no session cookie exists
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      // Prevent automatic session refresh during token validation
      raw: false,
    });

    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // If token validation fails, redirect to sign-in
    console.error("Token validation error:", error);
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
