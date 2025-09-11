import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/lib/db";

// Automatically detect the correct URL for development
const _getAuthUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Fallback for development - try to detect port from dev server
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || "3000";
    return `http://localhost:${port}`;
  }

  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - only update session in DB once per day
    generateSessionToken: () => {
      // Use crypto.randomUUID for better performance
      return crypto.randomUUID();
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (user?.email) {
        console.log("Sign in successful for:", user.email);
        return true;
      }
      return false;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ session, token }) {
      console.log("User signed out");
    },
  },
};
