import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, shares } from "@/lib/schema";
import { UpdateRecipeSchema, generateSlug } from "@/lib/recipe-utils";
import { eq, and, or } from "drizzle-orm";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: recipeId } = await params;

    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const canView =
      recipe.privacy === "public" ||
      recipe.userId === session?.user?.id ||
      (recipe.privacy === "link" && request.headers.get("x-share-token"));

    if (!canView) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (recipe.privacy === "public" || recipe.userId !== session?.user?.id) {
      const currentViewCount = (recipe.data.viewCount || 0) as number;
      await db
        .update(recipes)
        .set({
          data: {
            ...recipe.data,
            viewCount: currentViewCount + 1,
          },
        })
        .where(eq(recipes.id, recipeId));
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = await params;
    const body = await request.json();

    // Simple privacy update validation
    const PrivacyUpdateSchema = z.object({
      privacy: z.enum(["private", "link", "friends", "public"]),
    });

    const { privacy } = PrivacyUpdateSchema.parse(body);

    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [updatedRecipe] = await db
      .update(recipes)
      .set({ 
        privacy,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipeId))
      .returning();

    // Clean up share links if changing away from "link" privacy
    if (privacy !== "link") {
      await db
        .delete(shares)
        .where(
          and(
            eq(shares.resourceType, "recipe"),
            eq(shares.resourceId, recipeId),
            eq(shares.sharedBy, session.user.id)
          )
        );
    }

    return NextResponse.json({ recipe: updatedRecipe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid privacy setting", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating recipe privacy:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = await params;
    const body = await request.json();
    const validatedData = UpdateRecipeSchema.parse(body);

    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validatedData.title) {
      updateData.title = validatedData.title;
      updateData.slug =
        generateSlug(validatedData.title) + "-" + recipeId.substring(0, 8);
    }

    if (validatedData.privacy) {
      updateData.privacy = validatedData.privacy;
    }

    if (validatedData.data) {
      updateData.data = {
        ...existingRecipe.data,
        ...validatedData.data,
      };
    }

    if (validatedData.source) {
      updateData.source = {
        ...existingRecipe.source,
        ...validatedData.source,
      };
    }

    const [updatedRecipe] = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, recipeId))
      .returning();

    return NextResponse.json({ recipe: updatedRecipe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid recipe data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = await params;

    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.delete(recipes).where(eq(recipes.id, recipeId));

    await db
      .delete(shares)
      .where(
        and(eq(shares.resourceType, "recipe"), eq(shares.resourceId, recipeId)),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 },
    );
  }
}
