"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RecipeCard } from "./recipes/recipe-card";

export function LandingPage() {
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeaturedRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes?privacy=public&limit=6");
      if (response.ok) {
        const data = await response.json();
        setFeaturedRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error("Error fetching featured recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  return (
    <main className="content-left">
      {/* Hero Section - Left Aligned */}
      <div className="hero-asymmetric py-16 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold text-iron-900 sm:text-5xl lg:text-6xl">
            Welcome to <span className="text-wood-600">Potluck</span>
          </h1>
          <p className="mt-6 text-lg text-iron-600 sm:text-xl max-w-2xl">
            Collect, organize, and share your favorite recipes with friends and
            family. Join our community of home cooks and discover amazing dishes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-wood-500 hover:bg-wood-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#featured"
              className="inline-flex items-center justify-center px-8 py-3 border border-wood-500 text-base font-medium rounded-md text-wood-600 bg-white hover:bg-linen-50 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
        
        {/* Hero visual placeholder for future enhancement */}
        <div className="hidden lg:block">
          <div className="w-full h-64 bg-linen-100 rounded-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-iron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <section id="featured" className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-iron-900">Featured Recipes</h2>
            <p className="mt-2 text-iron-600">Discover popular dishes from our community</p>
          </div>
          <Link
            href="/auth/signin"
            className="hidden sm:inline-flex items-center text-wood-600 hover:text-wood-700 font-medium"
          >
            View all recipes
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="recipe-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-linen-200 animate-pulse">
                <div className="h-48 bg-linen-100 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-linen-100 rounded w-3/4"></div>
                  <div className="h-3 bg-linen-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredRecipes.length > 0 ? (
          <div className="recipe-grid">
            {featuredRecipes.map((recipe) => (
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
        ) : (
          <div className="text-center py-12 bg-linen-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-iron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-iron-900">No recipes yet</h3>
            <p className="mt-2 text-iron-600">Be the first to share a recipe with the community!</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-wood-600 hover:text-wood-700 font-medium"
          >
            View all recipes
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mb-12">
          <h2 className="text-base text-sage-600 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold text-iron-900 sm:text-4xl">
            Everything you need for your recipes
          </p>
        </div>

        <div className="layout-three-col">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Smart Import
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Import recipes from any website URL or paste text directly.
                  AI-powered parsing extracts all the details.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12-9.032 7.326"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Easy Sharing
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Share recipes with friends via private links or make them
                  public. Control who sees your collection.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Collections
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Organize recipes into custom collections. Create meal plans,
                  seasonal menus, or dietary groups.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Flexible Privacy
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Keep recipes private, share with select friends, or publish to
                  the community. You're in control.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Clean Recipe View
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Distraction-free recipe display with ingredient checkboxes,
                  step-by-step mode, and serving adjustments.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-wood-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-iron-900">
                  Community
                </p>
                <p className="mt-2 ml-16 text-base text-iron-600">
                  Discover amazing recipes from other home cooks and share your
                  favorites with the community.
                </p>
              </div>
        </div>
      </section>
    </main>
  );
}
