"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-context";
import { ImportModal } from "@/components/recipes/import-modal";
import { RecipeCard } from "@/components/recipes/recipe-card";

export default function Dashboard() {
  const { session, status } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "private" | "public">("all");

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();

      // Dashboard should show only user's recipes
      if (filter === "all") {
        params.set("privacy", "my"); // Get all user's recipes
      } else {
        params.set("privacy", filter); // Get private or public user recipes
      }

      const response = await fetch(`/api/recipes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Middleware handles auth redirect, so just fetch recipes when ready
    if (status === "authenticated") {
      setIsLoading(true);
      fetchRecipes();
    } else if (status === "unauthenticated") {
      // Reset loading state if user is unauthenticated
      setIsLoading(false);
    }
  }, [status]);

  // Show minimal loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linen-50">
        <div className="content-left py-8">
          <div className="h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50">
      <main className="content-left py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-iron-900">My Recipes</h1>
            <p className="mt-1 text-iron-600">
              Welcome back, {session?.user?.email}!
            </p>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Import Recipe
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "private", "public"] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-wood-500 text-white"
                    : "bg-white text-iron-700 hover:bg-linen-50 border border-linen-300"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="px-4 py-2 text-sage-600 bg-sage-50 border border-sage-200 rounded-lg hover:bg-sage-100 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Browse Community
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-iron-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-iron-900">
              No recipes yet
            </h3>
            <p className="mt-1 text-iron-500">
              Get started by importing your first recipe.
            </p>
            <button
              onClick={() => setShowImportModal(true)}
              className="mt-4 px-4 py-2 bg-wood-500 text-white rounded-lg hover:bg-wood-600 transition-colors"
            >
              Import Your First Recipe
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                slug={recipe.slug}
                data={recipe.data}
                privacy={recipe.privacy}
                contributor={recipe.contributor}
              />
            ))}
          </div>
        )}
      </main>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}
