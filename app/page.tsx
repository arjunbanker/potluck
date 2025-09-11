"use client";

import { useAuth } from "@/components/providers/auth-context";
import { LandingPage } from "@/components/landing-page";
import { PublicRecipeFeed } from "@/components/recipes/public-recipe-feed";

export default function Home() {
  const { session, status } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PublicRecipeFeed userEmail={session.user?.email || undefined} />
        </main>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
