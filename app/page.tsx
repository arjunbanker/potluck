"use client";

import { LandingPage } from "@/components/landing-page";
import { useAuth } from "@/components/providers/auth-context";
import { PublicRecipeFeed } from "@/components/recipes/public-recipe-feed";

export default function Home() {
  const { session, status } = useAuth();

  // Show content immediately and let components handle their own loading
  if (status === "loading") {
    // Show the landing page while auth loads to prevent flash
    return (
      <div className="min-h-screen bg-linen-50">
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50">
      {session ? (
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <PublicRecipeFeed userEmail={session.user?.email || undefined} />
          </div>
        </main>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
