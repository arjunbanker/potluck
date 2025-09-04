"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { LandingPage } from "@/components/landing-page";
import { PublicRecipeFeed } from "@/components/recipes/public-recipe-feed";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
      <Navbar />

      {session ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PublicRecipeFeed userEmail={session.user?.email} />
        </main>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
