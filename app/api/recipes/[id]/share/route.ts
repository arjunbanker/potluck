import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, shares } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const ShareSchema = z.object({
  permission: z.enum(["view", "edit"]).default("view"),
  expiresIn: z.number().optional(), // hours
});

function generateShareToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(
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
    const { permission, expiresIn } = ShareSchema.parse(body);

    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if a share link already exists for this recipe
    const [existingShare] = await db
      .select()
      .from(shares)
      .where(
        and(
          eq(shares.resourceType, "recipe"),
          eq(shares.resourceId, recipeId),
          eq(shares.sharedBy, session.user.id),
        ),
      )
      .limit(1);

    // If share already exists, return it instead of creating a new one
    if (existingShare) {
      const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/recipes/shared/${existingShare.token}`;
      
      return NextResponse.json({
        share: existingShare,
        shareUrl,
        token: existingShare.token,
        isExisting: true,
      });
    }

    // Create new share link only if none exists
    const token = generateShareToken();
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : undefined;

    const [share] = await db
      .insert(shares)
      .values({
        resourceType: "recipe",
        resourceId: recipeId,
        sharedBy: session.user.id,
        token,
        settings: {
          permission,
          requiresAuth: false,
        },
        expiresAt,
      })
      .returning();

    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/recipes/shared/${token}`;

    return NextResponse.json({
      share,
      shareUrl,
      token,
      isExisting: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid share settings", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating share:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = await params;

    // Get the single share link for this recipe (if any)
    const [recipeShare] = await db
      .select()
      .from(shares)
      .where(
        and(
          eq(shares.resourceType, "recipe"),
          eq(shares.resourceId, recipeId),
          eq(shares.sharedBy, session.user.id),
        ),
      )
      .limit(1);

    return NextResponse.json({ 
      share: recipeShare || null,
      shares: recipeShare ? [recipeShare] : []  // Keep for backward compatibility
    });
  } catch (error) {
    console.error("Error fetching shares:", error);
    return NextResponse.json(
      { error: "Failed to fetch shares" },
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

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const [share] = await db
      .select()
      .from(shares)
      .where(eq(shares.token, token))
      .limit(1);

    if (!share || share.sharedBy !== session.user.id) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    await db.delete(shares).where(eq(shares.token, token));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting share:", error);
    return NextResponse.json(
      { error: "Failed to delete share" },
      { status: 500 },
    );
  }
}
