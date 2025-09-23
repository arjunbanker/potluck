"use client";

import Link from "next/link";
import { formatCookingTime, getRecipeExcerpt } from "@/lib/recipe-utils";
import type { RecipeData } from "@/lib/schema";

interface RecipeCardProps {
  id: string;
  title: string;
  slug: string | null;
  data: RecipeData;
  privacy: string;
  contributor?: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profileImage: string | null;
    image: string | null;
  } | null;
}

export function RecipeCard({
  id,
  title,
  slug,
  data,
  privacy,
  contributor,
}: RecipeCardProps) {
  const totalTime =
    data.times?.total || (data.times?.prep || 0) + (data.times?.cook || 0);
  const excerpt = getRecipeExcerpt(data);

  return (
    <Link
      href={`/recipes/${id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {data.image?.url && (
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <img
            src={data.image.url}
            alt={data.image.alt || title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-iron-900 line-clamp-2">
            {title}
          </h3>
          <div className="shrink-0 flex items-center gap-1">
            {privacy === "private" && (
              <svg
                className="w-4 h-4 text-iron-500"
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
            )}
            {privacy === "public" && (
              <svg
                className="w-4 h-4 text-sage-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {privacy === "link" && (
              <svg
                className="w-4 h-4 text-wood-600"
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
            )}
            {privacy === "friends" && (
              <svg
                className="w-4 h-4 text-iron-500"
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
            )}
          </div>
        </div>

        {excerpt && (
          <p className="text-sm text-iron-600 line-clamp-2 mb-3">{excerpt}</p>
        )}

        <div className="flex-grow"></div>

        <div className="flex items-center gap-4 text-sm text-iron-500 mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatCookingTime(totalTime)}</span>
            </div>
          )}

          {data.servings && (
            <div className="flex items-center gap-1">
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
              <span>
                {data.servings.amount} {data.servings.unit || "servings"}
              </span>
            </div>
          )}

          {data.difficulty && (
            <div className="flex items-center gap-1">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="capitalize">{data.difficulty}</span>
            </div>
          )}
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-sage-50 text-sage-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Contributor Section */}
        {contributor && (
          <div className="pt-3 border-t border-linen-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-linen-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {contributor.profileImage || contributor.image ? (
                  <img
                    src={contributor.profileImage || contributor.image || ""}
                    alt={contributor.name || "Contributor"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-3 h-3 text-iron-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-iron-500 truncate">
                  Recipe by{" "}
                  <span className="font-medium text-iron-700">
                    {contributor.firstName && contributor.lastName
                      ? `${contributor.firstName} ${contributor.lastName}`
                      : contributor.name || contributor.email.split("@")[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
