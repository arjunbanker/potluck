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
        <main className="content-left py-8">
          <PublicRecipeFeed userEmail={session.user?.email || undefined} />
        </main>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
