import { z } from "zod";
import type { RecipeData } from "./schema";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

export function generateUniqueSlug(title: string, userId: string): string {
  const baseSlug = generateSlug(title);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

export const RecipeDataSchema = z.object({
  summary: z.string().optional(),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string().url(),
      alt: z.string().optional(),
    })
    .optional(),

  servings: z
    .object({
      amount: z.number().positive(),
      unit: z.string().optional(),
    })
    .optional(),

  times: z
    .object({
      prep: z.number().nonnegative().optional(),
      cook: z.number().nonnegative().optional(),
      total: z.number().nonnegative().optional(),
    })
    .optional(),

  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  cuisine: z.string().optional(),
  course: z.string().optional(),
  tags: z.array(z.string()).optional(),

  ingredients: z
    .array(
      z.object({
        section: z.string().optional(),
        items: z.array(
          z.object({
            ingredient: z.string(),
            quantity: z.string().optional(),
            unit: z.string().optional(),
            preparation: z.string().optional(),
            optional: z.boolean().optional(),
            alternatives: z.array(z.string()).optional(),
          }),
        ),
      }),
    )
    .min(1),

  instructions: z
    .array(
      z.object({
        step: z.number().positive(),
        text: z.string(),
        tip: z.string().optional(),
        warning: z.string().optional(),
        duration: z.number().nonnegative().optional(),
        temperature: z.string().optional(),
        image: z.string().url().optional(),
      }),
    )
    .min(1),

  nutrition: z
    .object({
      calories: z.number().nonnegative().optional(),
      protein: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fat: z.number().nonnegative().optional(),
      fiber: z.number().nonnegative().optional(),
      sugar: z.number().nonnegative().optional(),
      sodium: z.number().nonnegative().optional(),
    })
    .optional(),

  notes: z.string().optional(),
  tips: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),

  viewCount: z.number().nonnegative().optional(),
  averageRating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().nonnegative().optional(),
});

export const CreateRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  privacy: z.enum(["private", "link", "friends", "public"]).default("private"),
  data: RecipeDataSchema,
  source: z
    .object({
      type: z.enum(["manual", "url", "text", "photo", "ai_generated"]),
      method: z.enum(["import", "create", "fork"]),
      url: z.string().url().optional(),
      originalText: z.string().optional(),
      parentRecipeId: z.string().optional(),
    })
    .optional(),
});

export const UpdateRecipeSchema = CreateRecipeSchema.partial();

export function formatCookingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

export function calculateTotalTime(data: RecipeData): number {
  if (data.times?.total) {
    return data.times.total;
  }
  const prep = data.times?.prep || 0;
  const cook = data.times?.cook || 0;
  return prep + cook;
}

export function getRecipeExcerpt(data: RecipeData, maxLength = 150): string {
  const text = data.summary || data.description || "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
