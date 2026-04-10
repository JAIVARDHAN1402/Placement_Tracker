import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/Users";
import { getAuthUser, clearAuthCookie } from "@/app/lib/auth";

export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Hardcoded admin user for development
    if (userId === "000000000000000000000001") {
      return NextResponse.json({
        user: {
          _id: "000000000000000000000001",
          id: "000000000000000000000001",
          name: "Jai",
          username: "jai12345",
          role: "admin",
          branch: "Training & Placement Cell",
        },
      });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: user.toJSON() });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ message: "Logged out." });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
