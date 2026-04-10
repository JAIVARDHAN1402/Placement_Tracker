import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db";
import User from "@/app/models/Users";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const TOKEN_NAME = "pmas-token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export async function POST(request) {
  try {
    await connectDB();
    const { name, username, password, branch } = await request.json();

    if (!name || !username || !password) {
      return NextResponse.json(
        { message: "Name, username, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: "Username already taken." }, { status: 409 });
    }

    const user = await User.create({
      name,
      username,
      password,
      role: "student",
      branch: branch || "",
    });

    // Create token and set cookie
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
    const response = NextResponse.json({ user: user.toJSON(), token }, { status: 201 });

    // Set httpOnly cookie
    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
