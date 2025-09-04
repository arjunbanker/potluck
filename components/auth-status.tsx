"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Signed in as {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="text-sm text-blue-600 hover:text-blue-800 underline"
    >
      Sign in
    </Link>
  );
}
