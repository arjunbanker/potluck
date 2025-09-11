"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RecipeCard } from "./recipe-card";

interface PublicRecipeFeedProps {
  userEmail?: string;
}

export function PublicRecipeFeed({ userEmail }: PublicRecipeFeedProps) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPublicRecipes = async () => {
    try {
      const response = await fetch("/api/recipes?privacy=public&limit=50");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
      } else {
        setError("Failed to load recipes");
      }
    } catch (error) {
      console.error("Error fetching public recipes:", error);
      setError("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchPublicRecipes}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No public recipes yet
        </h3>
        <p className="mt-1 text-gray-500">
          Be the first to share a recipe with the community!
        </p>
        <Link
          href="/recipes/import"
          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Import & Share Recipe
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Community Recipes
          </h1>
          <p className="mt-1 text-gray-600">
            Discover amazing recipes shared by the community
            {userEmail && (
              <>
                {" • "}
                <span className="text-indigo-600">
                  Welcome back, {userEmail}!
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            My Recipes
          </Link>
          <Link
            href="/recipes/import"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Recipe
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {recipes.length >= 50 && (
        <div className="text-center mt-12">
          <p className="text-gray-500">Showing first 50 recipes</p>
        </div>
      )}
    </div>
  );
}
