"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
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

  const handleImport = async () => {
    setError("");
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

      router.push(`/recipes/${data.recipe.id}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close modal"
        />

        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Import Recipe</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "url"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              From URL
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "text"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              From Text
            </button>
          </div>

          {activeTab === "url" ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipe URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/recipe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipe Title (optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Favorite Recipe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipe Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your recipe here..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="private">Private (only you)</option>
              <option value="link">Shareable via link</option>
              <option value="friends">Friends only</option>
              <option value="public">Public</option>
            </select>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isLoading || (activeTab === "url" ? !url : !text)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Importing..." : "Import Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
