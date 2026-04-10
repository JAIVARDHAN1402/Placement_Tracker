const demoUsers = [
  {
    id: "user-student",
    name: "Aarav Sharma",
    email: "student@pmas.dev",
    password: "student123",
    role: "student",
    branch: "B.Tech CSE",
  },
  {
    id: "user-admin",
    name: "Riya Mehta",
    email: "admin@pmas.dev",
    password: "admin123",
    role: "admin",
    branch: "Training & Placement Cell",
  },
];

const demoCompanies = [
  {
    id: "comp-1",
    name: "Google",
    role: "Software Engineer Intern",
    package: "32 LPA",
    deadline: "2026-04-14",
    location: "Bengaluru",
    mode: "Hybrid",
    createdBy: "user-admin",
    isGlobal: true,
    skills: ["DSA", "System Design", "JavaScript"],
  },
  {
    id: "comp-2",
    name: "Atlassian",
    role: "Frontend Engineer",
    package: "22 LPA",
    deadline: "2026-04-09",
    location: "Remote",
    mode: "Remote",
    createdBy: "user-admin",
    isGlobal: true,
    skills: ["React", "Accessibility", "Testing"],
  },
  {
    id: "comp-3",
    name: "Razorpay",
    role: "Product Analyst",
    package: "17 LPA",
    deadline: "2026-04-20",
    location: "Bengaluru",
    mode: "On-site",
    createdBy: "user-admin",
    isGlobal: true,
    skills: ["SQL", "Product Metrics", "Excel"],
  },
  {
    id: "comp-4",
    name: "Zepto",
    role: "SDE-1",
    package: "18 LPA",
    deadline: "2026-04-11",
    location: "Mumbai",
    mode: "Hybrid",
    createdBy: "user-admin",
    isGlobal: true,
    skills: ["Node.js", "Backend", "Problem Solving"],
  },
  {
    id: "comp-5",
    name: "Stealth Startup",
    role: "Growth Intern",
    package: "8 LPA",
    deadline: "2026-04-18",
    location: "Pune",
    mode: "Remote",
    createdBy: "user-student",
    isGlobal: false,
    skills: ["Communication", "Research", "Canva"],
  },
];

const demoApplications = [
  {
    id: "app-1",
    userId: "user-student",
    companyId: "comp-1",
    status: "Interview",
    appliedDate: "2026-03-28",
    source: "campus",
  },
  {
    id: "app-2",
    userId: "user-student",
    companyId: "comp-2",
    status: "Rejected",
    appliedDate: "2026-03-18",
    source: "campus",
    failureStage: "OA",
  },
  {
    id: "app-3",
    userId: "user-student",
    companyId: "comp-5",
    status: "Applied",
    appliedDate: "2026-03-30",
    source: "self",
  },
  {
    id: "app-4",
    userId: "user-student",
    companyId: "comp-3",
    status: "Selected",
    appliedDate: "2026-02-22",
    source: "campus",
  },
  {
    id: "app-5",
    userId: "user-student",
    companyId: "comp-4",
    status: "Rejected",
    appliedDate: "2026-03-02",
    source: "campus",
    failureStage: "Interview",
  },
];

export const demoCredentials = {
  student: { email: "student@pmas.dev", password: "student123" },
  admin: { email: "admin@pmas.dev", password: "admin123" },
};

export const statusSteps = ["Applied", "OA Cleared", "Interview", "Rejected", "Selected", "Withdrawn"];

export function createSeedState() {
  return {
    users: structuredClone(demoUsers),
    companies: structuredClone(demoCompanies),
    applications: structuredClone(demoApplications),
    currentUserId: null,
  };
}

export function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getCompanyMap(state) {
  return Object.fromEntries(state.companies.map((company) => [company.id, company]));
}

export function enrichApplications(state, userId) {
  const companyMap = getCompanyMap(state);

  return state.applications
    .filter((application) => !userId || application.userId === userId)
    .map((application) => ({
      ...application,
      company: companyMap[application.companyId],
    }))
    .filter((application) => application.company)
    .sort((left, right) => new Date(right.appliedDate) - new Date(left.appliedDate));
}

export function computeUserAnalytics(state, userId) {
  const applications = enrichApplications(state, userId);
  const totalApplications = applications.length;
  const rejected = applications.filter((item) => item.status === "Rejected").length;
  const oaRejected = applications.filter(
    (item) => item.status === "Rejected" && item.failureStage === "OA",
  ).length;
  const interviewRejected = applications.filter(
    (item) => item.status === "Rejected" && item.failureStage === "Interview",
  ).length;
  const selected = applications.filter((item) => item.status === "Selected").length;
  const interviews = applications.filter((item) => item.status === "Interview").length;
  const activePipeline = applications.filter((item) =>
    ["Applied", "OA Cleared", "Interview"].includes(item.status),
  ).length;

  const roundCounts = {
    OA: oaRejected,
    Interview: interviewRejected,
    Applied: applications.filter((item) => item.status === "Applied").length,
  };

  const mostFailedRound = Object.entries(roundCounts).sort((left, right) => right[1] - left[1])[0];
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

  return {
    totalApplications,
    rejected,
    oaRejected,
    interviewRejected,
    rejectionRate: totalApplications ? Math.round((rejected / totalApplications) * 100) : 0,
    successRate: totalApplications ? Math.round((selected / totalApplications) * 100) : 0,
    interviews,
    activePipeline,
    selected,
    mostFailedRound: mostFailedRound?.[1] ? mostFailedRound[0] : "No failures yet",
    weakness,
    advice,
  };
}

export function computeAdminAnalytics(state) {
  const totalCompanies = state.companies.length;
  const totalApplications = state.applications.length;
  const globalCompanies = state.companies.filter((company) => company.isGlobal).length;
  const externalCompanies = totalCompanies - globalCompanies;

  const companyPopularity = state.companies
    .map((company) => ({
      ...company,
      applications: state.applications.filter((application) => application.companyId === company.id).length,
    }))
    .sort((left, right) => right.applications - left.applications);

  return {
    totalCompanies,
    totalApplications,
    externalCompanies,
    globalCompanies,
    mostPopularCompany: companyPopularity[0]?.name || "No company yet",
    companyPopularity,
  };
}

export function getCurrentUser(state) {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

export function getUpcomingDeadlines(state, count = 5) {
  return [...state.companies]
    .sort((left, right) => new Date(left.deadline) - new Date(right.deadline))
    .slice(0, count);
}

export function getRecentActivities(state, userId) {
  return enrichApplications(state, userId).map((application) => ({
    id: application.id,
    title: `${application.company.name} · ${application.status}`,
    subtitle: `${application.company.role} · ${application.company.location}`,
    date: application.appliedDate,
  }));
}
