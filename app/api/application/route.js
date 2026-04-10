import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/Application";
import { getAuthUser } from "@/app/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const userId = new URL(request.url).searchParams.get("userId");
    const authUserId = await getAuthUser();

    const filter = userId ? { userId } : authUserId ? { userId: authUserId } : {};

    const applications = await Application.find(filter)
      .populate("companyId")
      .populate("userId", "name username role")
      .sort({ appliedDate: -1 });

    // Reshape to match frontend expectations
    const enriched = applications.map((app) => ({
      id: app._id,
      _id: app._id,
      userId: app.userId?._id || app.userId,
      companyId: app.companyId?._id || app.companyId,
      status: app.status,
      appliedDate: app.appliedDate,
      source: app.source,
      failureStage: app.failureStage,
      company: app.companyId
        ? {
            id: app.companyId._id,
            _id: app.companyId._id,
            name: app.companyId.name,
            role: app.companyId.role,
            package: app.companyId.package,
            deadline: app.companyId.deadline,
            location: app.companyId.location,
            mode: app.companyId.mode,
            isGlobal: app.companyId.isGlobal,
            skills: app.companyId.skills,
          }
        : null,
    }));

    return NextResponse.json({ applications: enriched });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const application = await Application.create({
      ...body,
      userId,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
