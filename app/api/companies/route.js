import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Company from "@/app/models/Companies";
import { getAuthUser } from "@/app/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const companies = await Company.find().populate("createdBy", "name username role").sort({ createdAt: -1 });

    const enriched = companies.map((company) => ({
      ...company.toObject(),
      id: company._id.toString(),
      createdBy: company.createdBy ? {
        ...company.createdBy.toObject(),
        id: company.createdBy._id.toString(),
      } : null,
    }));

    return NextResponse.json({ companies: enriched });
  } catch (error) {
    console.error("Get companies error:", error);
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

    const company = await Company.create({
      ...body,
      createdBy: userId,
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
