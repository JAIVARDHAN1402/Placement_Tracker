import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/Application";
import { getAuthUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const applications = await Application.find({ userId }).populate("companyId");
    const total = applications.length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const oaRejected = applications.filter(
      (a) => a.status === "Rejected" && a.failureStage === "OA"
    ).length;
    const interviewRejected = applications.filter(
      (a) => a.status === "Rejected" && a.failureStage === "Interview"
    ).length;
    const selected = applications.filter((a) => a.status === "Selected").length;
    const interviews = applications.filter((a) => a.status === "Interview").length;
    const activePipeline = applications.filter((a) =>
      ["Applied", "OA Cleared", "Interview"].includes(a.status)
    ).length;

    const roundCounts = {
      OA: oaRejected,
      Interview: interviewRejected,
      Applied: applications.filter((a) => a.status === "Applied").length,
    };

    const mostFailedRound = Object.entries(roundCounts).sort((a, b) => b[1] - a[1])[0];
    const weakness = mostFailedRound?.[1]
      ? mostFailedRound[0] === "OA"
        ? "OA rounds are your weakest area right now."
        : mostFailedRound[0] === "Interview"
          ? "Interview rounds are your current weak spot."
          : "Applications are not moving quickly beyond the first stage."
      : "Your pipeline is balanced right now.";
    const advice =
      mostFailedRound?.[0] === "OA"
        ? "Practice timed aptitude and coding assessments, and review patterns from your last OA-heavy companies."
        : mostFailedRound?.[0] === "Interview"
          ? "Focus on mock interviews, storytelling, and explaining your projects with clearer structure."
          : "Keep applying consistently and convert active applications into interview-ready preparation.";

    return NextResponse.json({
      analytics: {
        totalApplications: total,
        rejected,
        oaRejected,
        interviewRejected,
        rejectionRate: total ? Math.round((rejected / total) * 100) : 0,
        successRate: total ? Math.round((selected / total) * 100) : 0,
        interviews,
        activePipeline,
        selected,
        mostFailedRound: mostFailedRound?.[1] ? mostFailedRound[0] : "No failures yet",
        weakness,
        advice,
      },
    });
  } catch (error) {
    console.error("User analytics error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
