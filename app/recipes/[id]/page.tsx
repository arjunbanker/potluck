"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-context";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";

export default function RecipePage({ params }: { params: { id: string } }) {
  const { session } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [existingShare, setExistingShare] = useState<any>(null);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isUpdatingRecipe, setIsUpdatingRecipe] = useState(false);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Recipe not found");
        } else if (response.status === 403) {
          setError("You don't have permission to view this recipe");
        } else {
          setError("Failed to load recipe");
        }
        return;
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError("Failed to load recipe");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchExistingShare = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}/share`);
      if (response.ok) {
        const data = await response.json();
        setExistingShare(data.share || null);
        if (data.share) {
          const shareUrl = `${window.location.origin}/recipes/shared/${data.share.token}`;
          setShareUrl(shareUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching share:", error);
    }
  };

  const handleShare = async () => {
    await fetchExistingShare();
    setShowShareModal(true);
  };

  const handleCreateShareLink = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: "view" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share link");
      }

      const data = await response.json();
      setShareUrl(data.shareUrl);
      setExistingShare(data.share);
    } catch (error) {
      console.error("Error creating share link:", error);
    }
  };

  const handleUpdatePrivacy = async (privacy: string) => {
    setIsUpdatingPrivacy(true);
    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacy }),
      });

      if (!response.ok) {
        throw new Error("Failed to update privacy");
      }

      setRecipe((prev: any) => ({ ...prev, privacy }));

      // If changing away from "link", clear any existing share
      if (privacy !== "link") {
        setExistingShare(null);
        setShareUrl("");
      } else {
        // If changing to "link", fetch any existing share
        await fetchExistingShare();
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const handleRevokeShare = async () => {
    if (!existingShare) return;

    try {
      const response = await fetch(
        `/api/recipes/${params.id}/share?token=${existingShare.token}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setExistingShare(null);
        setShareUrl("");
      }
    } catch (error) {
      console.error("Error revoking share:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditForm({
      title: recipe.title,
      privacy: recipe.privacy,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setIsUpdatingRecipe(true);
    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setIsUpdatingRecipe(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowEditModal(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading recipe...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error}
            </h2>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = recipe?.userId === session?.user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isOwner && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                />
              </svg>
              Share
            </button>
          </div>
        )}

        <RecipeViewer
          title={recipe.title}
          data={recipe.data}
          source={recipe.source}
        />
      </main>

      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowShareModal(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Escape" && setShowShareModal(false)}
              aria-label="Close modal"
            />

            <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Share & Privacy Settings
              </h3>

              {/* Current Privacy Status */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Privacy Level
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      value: "private",
                      label: "Private",
                      desc: "Only you can see this recipe",
                    },
                    {
                      value: "link",
                      label: "Anyone with link",
                      desc: "Shareable via link only",
                    },
                    {
                      value: "friends",
                      label: "Friends only",
                      desc: "Visible to your friends",
                    },
                    {
                      value: "public",
                      label: "Public",
                      desc: "Everyone can discover this recipe",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="privacy"
                        value={option.value}
                        checked={recipe?.privacy === option.value}
                        onChange={(e) => handleUpdatePrivacy(e.target.value)}
                        disabled={isUpdatingPrivacy}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Share Link Section */}
              {recipe?.privacy === "link" && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Share Link
                  </h4>

                  {!existingShare ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">
                        No share link created yet
                      </p>
                      <button
                        onClick={handleCreateShareLink}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Create Share Link
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={shareUrl}
                          readOnly
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded bg-white"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={handleRevokeShare}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Revoke
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(existingShare.createdAt).toLocaleDateString()}
                        {existingShare.expiresAt &&
                          ` • Expires: ${new Date(existingShare.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Public Recipe Info */}
              {recipe?.privacy === "public" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Recipe is Public
                      </p>
                      <p className="text-sm text-green-700">
                        This recipe appears in community feeds and can be
                        discovered by anyone.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Friends Only Info */}
              {recipe?.privacy === "friends" && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5"
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
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Visible to Friends
                      </p>
                      <p className="text-sm text-blue-700">
                        Only people you've added as friends can see this recipe.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowEditModal(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Escape" && setShowEditModal(false)}
              aria-label="Close modal"
            />

            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Edit Recipe
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Privacy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Privacy
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        value: "private",
                        label: "Private",
                        desc: "Only you can see this recipe",
                      },
                      {
                        value: "link",
                        label: "Anyone with link",
                        desc: "Shareable via link only",
                      },
                      {
                        value: "friends",
                        label: "Friends only",
                        desc: "Visible to your friends",
                      },
                      {
                        value: "public",
                        label: "Public",
                        desc: "Everyone can discover this recipe",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="editPrivacy"
                          value={option.value}
                          checked={editForm.privacy === option.value}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              privacy: e.target.value,
                            })
                          }
                          className="mt-1 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdatingRecipe}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingRecipe ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>

              {/* Delete Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
