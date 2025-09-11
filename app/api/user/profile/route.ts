import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

const UpdateProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  profileImage: z.string().url().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    // Build update object with only the fields that were provided
    const updateData: any = {};

    if (validatedData.firstName !== undefined) {
      updateData.firstName = validatedData.firstName;
    }

    if (validatedData.lastName !== undefined) {
      updateData.lastName = validatedData.lastName;
    }

    if (validatedData.profileImage !== undefined) {
      updateData.profileImage = validatedData.profileImage;
    }

    // Update the generic "name" field if we have firstName or lastName
    if (
      validatedData.firstName !== undefined ||
      validatedData.lastName !== undefined
    ) {
      const firstName = validatedData.firstName || "";
      const lastName = validatedData.lastName || "";
      updateData.name = `${firstName} ${lastName}`.trim() || null;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid profile data", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 },
    );
  }
}
