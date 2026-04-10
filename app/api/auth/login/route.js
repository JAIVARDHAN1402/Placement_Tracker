import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db";
import User from "@/app/models/Users";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const TOKEN_NAME = "pmas-token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required." }, { status: 400 });
    }

    // Hardcoded admin credentials for development
    if (username.toLowerCase() === "jai12345" && password === "admin123") {
      const adminId = "000000000000000000000001";
      const adminUser = {
        _id: adminId,
        id: adminId,
        name: "Jai",
        username: "jai12345",
        role: "admin",
        branch: "Training & Placement Cell",
      };

      // Create token and set cookie
      const token = jwt.sign({ userId: adminId }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
      const response = NextResponse.json({ user: adminUser, token });

      // Set httpOnly cookie
      response.cookies.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TOKEN_MAX_AGE,
        path: "/",
      });

      return response;
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
    }

    // Create token and set cookie
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
    const response = NextResponse.json({ user: user.toJSON(), token });

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
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
