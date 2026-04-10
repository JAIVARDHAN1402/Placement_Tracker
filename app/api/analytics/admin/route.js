import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Company from "@/app/models/Companies";
import Application from "@/app/models/Application";
import { getAuthUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const companies = await Company.find();
    const applications = await Application.find();

    const totalCompanies = companies.length;
    const totalApplications = applications.length;
    const globalCompanies = companies.filter((c) => c.isGlobal).length;
    const externalCompanies = totalCompanies - globalCompanies;

    // Company popularity
    const companyPopularity = companies
      .map((company) => ({
        ...company.toObject(),
        id: company._id,
        applications: applications.filter(
          (app) => app.companyId.toString() === company._id.toString()
        ).length,
      }))
      .sort((a, b) => b.applications - a.applications);

    return NextResponse.json({
      analytics: {
        totalCompanies,
        totalApplications,
        externalCompanies,
        globalCompanies,
        mostPopularCompany: companyPopularity[0]?.name || "No company yet",
        companyPopularity,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
