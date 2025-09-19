"use client";

import { useState } from "react";
import { formatCookingTime } from "@/lib/recipe-utils";
import type { RecipeData } from "@/lib/schema";

interface RecipeViewerProps {
  title: string;
  data: RecipeData;
  source?: any;
  user?: {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    image?: string | null;
    profileImage?: string | null;
  };
}

export function RecipeViewer({ title, data, source, user }: RecipeViewerProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const toggleIngredient = (id: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCheckedIngredients(newSet);
  };

  const adjustQuantity = (quantity?: string): string => {
    if (!quantity || servingMultiplier === 1) return quantity || "";

    const match = quantity.match(/^([\d./]+)(.*)/);
    if (!match) return quantity;

    const [, num, rest] = match;

    if (num.includes("/")) {
      const [numerator, denominator] = num.split("/").map(Number);
      const adjusted = (numerator / denominator) * servingMultiplier;
      return adjusted.toFixed(2).replace(/\.?0+$/, "") + rest;
    }

    const adjusted = parseFloat(num) * servingMultiplier;
    return adjusted.toFixed(2).replace(/\.?0+$/, "") + rest;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm">
        {data.image?.url && (
          <div className="aspect-video relative overflow-hidden bg-linen-100 rounded-t-lg">
            <img
              src={data.image.url}
              alt={data.image.alt || title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-iron-900 mb-2">{title}</h1>

          {data.summary && (
            <p className="text-lg text-iron-600 mb-4">{data.summary}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            {data.times?.total && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-iron-400"
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
                <div>
                  <span className="font-medium">Total: </span>
                  {formatCookingTime(data.times.total)}
                  {data.times.prep && (
                    <span className="text-iron-500 ml-2">
                      (Prep: {formatCookingTime(data.times.prep)})
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.servings && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-iron-400"
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
                <span className="font-medium">
                  {data.servings.amount * servingMultiplier}{" "}
                  {data.servings.unit || "servings"}
                </span>
              </div>
            )}

            {data.difficulty && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-iron-400"
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
                <span className="font-medium capitalize">
                  {data.difficulty}
                </span>
              </div>
            )}

            {data.cuisine && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-iron-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
                <span className="font-medium">{data.cuisine}</span>
              </div>
            )}
          </div>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-sage-50 text-sage-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-iron-900">Ingredients</h2>
                {data.servings && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setServingMultiplier(
                          Math.max(0.5, servingMultiplier - 0.5),
                        )
                      }
                      className="w-8 h-8 rounded-full bg-linen-100 hover:bg-linen-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium px-2">
                      {servingMultiplier}x
                    </span>
                    <button
                      onClick={() =>
                        setServingMultiplier(servingMultiplier + 0.5)
                      }
                      className="w-8 h-8 rounded-full bg-linen-100 hover:bg-linen-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {data.ingredients.map((group, groupIndex) => (
                  <div key={`ingredient-group-${groupIndex}`}>
                    {group.section && (
                      <h3 className="font-medium text-iron-700 mb-2">
                        {group.section}
                      </h3>
                    )}
                    <ul className="space-y-2">
                      {group.items.map((item, itemIndex) => {
                        const id = `${groupIndex}-${itemIndex}`;
                        return (
                          <li key={id} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={id}
                              checked={checkedIngredients.has(id)}
                              onChange={() => toggleIngredient(id)}
                              className="mt-1 rounded border-linen-300 text-sage-600 focus:ring-wood-500"
                            />
                            <label
                              htmlFor={id}
                              className={`flex-1 cursor-pointer ${
                                checkedIngredients.has(id)
                                  ? "line-through text-iron-400"
                                  : ""
                              }`}
                            >
                              <span className="font-medium">
                                {adjustQuantity(item.quantity)}
                              </span>
                              {item.unit && (
                                <span className="ml-1">{item.unit}</span>
                              )}
                              <span className="ml-1">{item.ingredient}</span>
                              {item.preparation && (
                                <span className="text-iron-500">
                                  , {item.preparation}
                                </span>
                              )}
                              {item.optional && (
                                <span className="text-iron-400 text-sm ml-1">
                                  (optional)
                                </span>
                              )}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-iron-900 mb-4">
                Instructions
              </h2>

              <div className="space-y-4">
                {data.instructions.map((instruction, index) => (
                  <div
                    key={`instruction-${index}`}
                    className="p-4 rounded-lg border border-linen-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-wood-500 text-white flex items-center justify-center font-bold">
                        {instruction.step}
                      </span>
                      <div className="flex-1">
                        <p className="text-iron-800">{instruction.text}</p>

                        {instruction.duration && (
                          <p className="text-sm text-iron-500 mt-1">
                            Time: {formatCookingTime(instruction.duration)}
                          </p>
                        )}

                        {instruction.temperature && (
                          <p className="text-sm text-iron-500 mt-1">
                            Temperature: {instruction.temperature}
                          </p>
                        )}

                        {instruction.tip && (
                          <p className="text-sm text-sage-600 mt-2">
                            💡 Tip: {instruction.tip}
                          </p>
                        )}

                        {instruction.warning && (
                          <p className="text-sm text-tomato-600 mt-2">
                            ⚠️ Warning: {instruction.warning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(data.notes || data.tips) && (
            <div className="mt-8 p-4 bg-linen-50 rounded-lg">
              {data.notes && (
                <div className="mb-4">
                  <h3 className="font-medium text-iron-700 mb-2">Notes</h3>
                  <p className="text-iron-600">{data.notes}</p>
                </div>
              )}

              {data.tips && data.tips.length > 0 && (
                <div>
                  <h3 className="font-medium text-iron-700 mb-2">Tips</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {data.tips.map((tip, index) => (
                      <li key={`tip-${index}`} className="text-iron-600">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recipe Attribution Section */}
          <div className="mt-8 space-y-4">
            {/* Source URL Card */}
            {source?.url && (
              <div className="p-4 bg-linen-50 rounded-lg border border-linen-200">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 bg-white rounded-lg border border-linen-200 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-iron-400"
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
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-iron-900 mb-1">
                      Original Recipe
                    </p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
                    >
                      <span className="truncate">
                        {source.title ||
                          new URL(source.url).hostname.replace("www.", "")}
                      </span>
                      <svg
                        className="shrink-0 w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                    {source.description && (
                      <p className="text-xs text-iron-500 mt-1 line-clamp-2">
                        {source.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Shared By Card */}
            {user && (
              <div className="p-4 bg-white rounded-lg border border-linen-200">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {user.profileImage || user.image ? (
                      <img
                        src={user.profileImage || user.image || ""}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-linen-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-iron-500"
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
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-iron-500">Shared by</p>
                    <p className="font-medium text-iron-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || user.email.split("@")[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
