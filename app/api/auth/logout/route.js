import { NextResponse } from "next/server";

const TOKEN_NAME = "pmas-token";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully." });

    // Clear the auth cookie
    response.cookies.set(TOKEN_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // This expires the cookie immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
