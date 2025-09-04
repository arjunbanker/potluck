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

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          {privacy !== "private" && (
            <span className="shrink-0 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {privacy}
            </span>
          )}
        </div>

        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{excerpt}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
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
          <div className="mt-3 flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full"
              >
                {tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded-full">
                +{data.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Contributor Section */}
        {contributor && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {contributor.profileImage || contributor.image ? (
                  <img
                    src={contributor.profileImage || contributor.image}
                    alt={contributor.name || "Contributor"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-3 h-3 text-gray-400"
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
                <p className="text-xs text-gray-500 truncate">
                  Recipe by{" "}
                  <span className="font-medium text-gray-700">
                    {contributor.firstName && contributor.lastName
                      ? `${contributor.firstName} ${contributor.lastName}`
                      : contributor.name || contributor.email.split('@')[0]}
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
