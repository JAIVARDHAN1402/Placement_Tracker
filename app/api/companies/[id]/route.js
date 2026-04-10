import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Company from "@/app/models/Companies";
import Application from "@/app/models/Application";
import { getAuthUser } from "@/app/lib/auth";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const company = await Company.findById(id).populate("createdBy", "name username role");

    if (!company) {
      return NextResponse.json({ message: "Company not found." }, { status: 404 });
    }

    const enriched = {
      ...company.toObject(),
      id: company._id.toString(),
      createdBy: company.createdBy ? {
        ...company.createdBy.toObject(),
        id: company.createdBy._id.toString(),
      } : null,
    };

    return NextResponse.json({ company: enriched });
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const company = await Company.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return NextResponse.json({ message: "Company not found." }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Update company error:", error);
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

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return NextResponse.json({ message: "Company not found." }, { status: 404 });
    }

    // Also remove all applications for this company
    await Application.deleteMany({ companyId: id });

    return NextResponse.json({ message: "Company and related applications deleted." });
  } catch (error) {
    console.error("Delete company error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
