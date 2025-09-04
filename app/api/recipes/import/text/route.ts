import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { parseRecipeFromText } from "@/lib/ai-parser";
import { generateUniqueSlug } from "@/lib/recipe-utils";
import { z } from "zod";

const ImportTextSchema = z.object({
  text: z.string().min(50).max(50000),
  title: z.string().min(1).max(200).optional(),
  privacy: z.enum(["private", "link", "friends", "public"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      text,
      title: providedTitle,
      privacy,
    } = ImportTextSchema.parse(body);

    const recipeData = await parseRecipeFromText(text);

    const title =
      providedTitle || recipeData.summary?.split(".")[0] || "Imported Recipe";
    const slug = generateUniqueSlug(title, session.user.id);

    const [newRecipe] = await db
      .insert(recipes)
      .values({
        userId: session.user.id,
        title,
        slug,
        privacy: privacy || "private",
        data: recipeData,
        source: {
          type: "text",
          method: "import",
          originalText: text.substring(0, 5000),
          importedAt: new Date().toISOString(),
          aiModel: process.env.OPENAI_API_KEY ? "gpt-4" : "mock",
        },
      })
      .returning();

    return NextResponse.json({
      recipe: newRecipe,
      message: "Recipe imported successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid text data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error importing recipe from text:", error);
    return NextResponse.json(
      { error: "Failed to import recipe from text" },
      { status: 500 },
    );
  }
}
