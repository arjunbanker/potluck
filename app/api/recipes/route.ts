import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, users } from "@/lib/schema";
import { CreateRecipeSchema, generateUniqueSlug } from "@/lib/recipe-utils";
import { eq, and, or, sql } from "drizzle-orm";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const privacy = searchParams.get("privacy");

    // Allow public recipe access without authentication
    if (privacy === "public") {
      const limit = parseInt(searchParams.get("limit") || "50", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);
      
      const publicRecipes = await db
        .select({
          // Recipe fields
          id: recipes.id,
          userId: recipes.userId,
          title: recipes.title,
          slug: recipes.slug,
          privacy: recipes.privacy,
          data: recipes.data,
          source: recipes.source,
          createdAt: recipes.createdAt,
          updatedAt: recipes.updatedAt,
          // User fields (contributor)
          contributor: {
            id: users.id,
            name: users.name,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profileImage: users.profileImage,
            image: users.image,
          },
        })
        .from(recipes)
        .leftJoin(users, eq(recipes.userId, users.id))
        .where(eq(recipes.privacy, "public"))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${recipes.createdAt} DESC`);

      return NextResponse.json({ recipes: publicRecipes });
    }

    // For other requests, require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Build the base query with user join
    const baseQuery = db
      .select({
        // Recipe fields
        id: recipes.id,
        userId: recipes.userId,
        title: recipes.title,
        slug: recipes.slug,
        privacy: recipes.privacy,
        data: recipes.data,
        source: recipes.source,
        createdAt: recipes.createdAt,
        updatedAt: recipes.updatedAt,
        // User fields (contributor)
        contributor: {
          id: users.id,
          name: users.name,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImage: users.profileImage,
          image: users.image,
        },
      })
      .from(recipes)
      .leftJoin(users, eq(recipes.userId, users.id));

    let userRecipes;

    if (privacy === "public") {
      // Only public recipes from all users
      userRecipes = await baseQuery
        .where(eq(recipes.privacy, "public"))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${recipes.createdAt} DESC`);
    } else if (privacy === "my") {
      // Only user's own recipes (private and public)
      userRecipes = await baseQuery
        .where(eq(recipes.userId, session.user.id))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${recipes.createdAt} DESC`);
    } else if (privacy === "private") {
      // Only user's private recipes
      userRecipes = await baseQuery
        .where(
          and(
            eq(recipes.userId, session.user.id),
            eq(recipes.privacy, "private"),
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${recipes.createdAt} DESC`);
    } else {
      // Default: user's recipes + all public recipes
      userRecipes = await baseQuery
        .where(
          or(eq(recipes.userId, session.user.id), eq(recipes.privacy, "public")),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${recipes.createdAt} DESC`);
    }

    return NextResponse.json({ recipes: userRecipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateRecipeSchema.parse(body);

    const slug = generateUniqueSlug(validatedData.title, session.user.id);

    const [newRecipe] = await db
      .insert(recipes)
      .values({
        userId: session.user.id,
        title: validatedData.title,
        slug,
        privacy: validatedData.privacy || "private",
        data: validatedData.data,
        source: validatedData.source || {
          type: "manual",
          method: "create",
          importedAt: new Date().toISOString(),
        },
      })
      .returning();

    return NextResponse.json({ recipe: newRecipe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid recipe data", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 },
    );
  }
}
