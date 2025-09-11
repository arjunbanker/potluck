"use client";

import { useState } from "react";
import { formatCookingTime } from "@/lib/recipe-utils";
import type { RecipeData } from "@/lib/schema";

interface RecipeViewerProps {
  title: string;
  data: RecipeData;
  source?: any;
}

export function RecipeViewer({ title, data, source }: RecipeViewerProps) {
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {data.image?.url && (
          <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-t-lg">
            <img
              src={data.image.url}
              alt={data.image.alt || title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

          {data.summary && (
            <p className="text-lg text-gray-600 mb-4">{data.summary}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            {data.times?.total && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                    <span className="text-gray-500 ml-2">
                      (Prep: {formatCookingTime(data.times.prep)})
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.servings && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                  className="w-5 h-5 text-gray-400"
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
                  className="w-5 h-5 text-gray-400"
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
                  className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Ingredients</h2>
                {data.servings && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setServingMultiplier(
                          Math.max(0.5, servingMultiplier - 0.5),
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
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
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
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
                      <h3 className="font-medium text-gray-700 mb-2">
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
                              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={id}
                              className={`flex-1 cursor-pointer ${
                                checkedIngredients.has(id)
                                  ? "line-through text-gray-400"
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
                                <span className="text-gray-500">
                                  , {item.preparation}
                                </span>
                              )}
                              {item.optional && (
                                <span className="text-gray-400 text-sm ml-1">
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Instructions
              </h2>

              <div className="space-y-4">
                {data.instructions.map((instruction, index) => (
                  <div
                    key={`instruction-${index}`}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {instruction.step}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-800">{instruction.text}</p>

                        {instruction.duration && (
                          <p className="text-sm text-gray-500 mt-1">
                            Time: {formatCookingTime(instruction.duration)}
                          </p>
                        )}

                        {instruction.temperature && (
                          <p className="text-sm text-gray-500 mt-1">
                            Temperature: {instruction.temperature}
                          </p>
                        )}

                        {instruction.tip && (
                          <p className="text-sm text-indigo-600 mt-2">
                            💡 Tip: {instruction.tip}
                          </p>
                        )}

                        {instruction.warning && (
                          <p className="text-sm text-orange-600 mt-2">
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
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              {data.notes && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
                  <p className="text-gray-600">{data.notes}</p>
                </div>
              )}

              {data.tips && data.tips.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Tips</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {data.tips.map((tip, index) => (
                      <li key={`tip-${index}`} className="text-gray-600">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {source?.url && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Recipe imported from:{" "}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {new URL(source.url).hostname}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
