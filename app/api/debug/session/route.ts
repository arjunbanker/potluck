import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
      sessionExpires: session?.expires,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to get session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
