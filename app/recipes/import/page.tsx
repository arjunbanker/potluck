"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-context";

export default function ImportRecipePage() {
  const { session, status } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState<
    "private" | "link" | "friends" | "public"
  >("private");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linen-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center text-iron-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users (no redirect)
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-linen-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-12 text-center">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-iron-900">
              Sign in required
            </h3>
            <p className="mt-1 text-iron-600 mb-6">
              Please sign in to import recipes to your collection.
            </p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="inline-flex items-center px-4 py-2 bg-wood-500 text-white rounded-lg hover:bg-wood-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleImport = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const endpoint =
        activeTab === "url"
          ? "/api/recipes/import/url"
          : "/api/recipes/import/text";

      const body =
        activeTab === "url"
          ? { url, privacy }
          : { text, title: title || undefined, privacy };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setSuccess(`Recipe "${data.recipe.title}" imported successfully!`);

      // Clear form
      setUrl("");
      setText("");
      setTitle("");

      // Redirect to the new recipe after a short delay
      setTimeout(() => {
        router.push(`/recipes/${data.recipe.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-iron-900 mb-2">
              Import Recipe
            </h1>
            <p className="text-iron-600">
              Add recipes from URLs or paste text directly
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "url"
                  ? "bg-wood-500 text-white"
                  : "bg-linen-100 text-iron-700 hover:bg-linen-200 border border-linen-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                From URL
              </div>
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "text"
                  ? "bg-wood-500 text-white"
                  : "bg-linen-100 text-iron-700 hover:bg-linen-200 border border-linen-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                From Text
              </div>
            </button>
          </div>

          {activeTab === "url" ? (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-iron-700 mb-2"
                >
                  Recipe URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/recipe"
                  className="w-full px-4 py-3 border border-linen-300 rounded-lg focus:ring-wood-500 focus:border-wood-500"
                />
                <p className="text-sm text-iron-500 mt-1">
                  Paste any recipe URL from sites like AllRecipes, Food Network,
                  NYT Cooking, etc.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-iron-700 mb-2"
                >
                  Recipe Title (optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Favorite Recipe"
                  className="w-full px-4 py-3 border border-linen-300 rounded-lg focus:ring-wood-500 focus:border-wood-500"
                />
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-iron-700 mb-2"
                >
                  Recipe Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your recipe here... Include ingredients, instructions, and any other details."
                  rows={10}
                  className="w-full px-4 py-3 border border-linen-300 rounded-lg focus:ring-wood-500 focus:border-wood-500"
                />
                <p className="text-sm text-iron-500 mt-1">
                  Paste recipe text from anywhere - cookbooks, emails,
                  handwritten notes, etc.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-iron-700 mb-2">
              Privacy Setting
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="private">Private (only you can see it)</option>
              <option value="link">Shareable via link</option>
              <option value="friends">Friends only (coming soon)</option>
              <option value="public">Public (everyone can find it)</option>
            </select>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-tomato-50 border border-tomato-200 rounded-lg">
              <p className="text-sm text-tomato-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-sage-50 border border-sage-200 rounded-lg">
              <p className="text-sm text-sage-700">{success}</p>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-6 py-3 border border-linen-300 text-iron-700 rounded-lg hover:bg-linen-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={
                isLoading || (activeTab === "url" ? !url.trim() : !text.trim())
              }
              className="flex-1 px-6 py-3 bg-wood-500 text-white rounded-lg hover:bg-wood-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Importing..." : "Import Recipe"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-sage-50 border border-sage-200 rounded-lg">
            <h3 className="text-sm font-medium text-sage-800 mb-2">
              How it works:
            </h3>
            <ul className="text-sm text-sage-700 space-y-1">
              <li>
                • AI automatically extracts ingredients, instructions, and
                details
              </li>
              <li>• Instructions are summarized to respect copyright</li>
              <li>
                • All essential info (temps, times, techniques) is preserved
              </li>
              <li>• You can edit and organize recipes after import</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
