import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/Application";
import { getAuthUser } from "@/app/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const application = await Application.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Application deleted." });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
