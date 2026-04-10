"use client";

import Link from "next/link";
import StatCard from "@/app/components/StatCard";
import StatusBadge from "@/app/components/StatusBadge";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function DashboardPage() {
  const { currentUser, userAnalytics, myApplications, state, applyToCompany, hydrated } =
    usePlacementStore();

  if (!hydrated) {
    return <div className="page-stack"><section className="card card-pad-lg">Loading dashboard...</section></div>;
  }

  if (!currentUser) {
    return (
      <div className="page-stack">
        <section className="empty-state">
          <h1 className="section-title">Login to view your placement dashboard.</h1>
          <p className="lead">Your analytics, application pipeline, and deadline reminders appear here once you sign in.</p>
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </section>
      </div>
    );
  }

  // Build set of company IDs already applied to (using string comparison)
  const appliedCompanyIds = new Set(
    myApplications.map((application) => {
      const id = application.companyId?._id?.toString?.() || application.companyId?.toString?.() || application.companyId;
      return id?.trim().toLowerCase();
    }),
  );

  // Companies the user hasn't applied to yet
  const newCompanies = state.companies
    .filter((company) => {
      const companyIdStr = (company._id?.toString?.() || company.id?.toString?.() || company.id)?.trim().toLowerCase();
      return !appliedCompanyIds.has(companyIdStr);
    })
    .slice(0, 6);

  async function handleApply(companyId) {
    await applyToCompany(companyId);
  }

  // Use empty analytics object if not yet loaded
  const analytics = userAnalytics || {
    totalApplications: 0,
    rejected: 0,
    oaRejected: 0,
    interviewRejected: 0,
    advice: "Add applications to see your personalized advice.",
    weakness: "No data yet.",
    mostFailedRound: "N/A",
  };

  return (
    <div className="page-stack">
      <section className="hero-shell">
        <div className="hero-grid">
          <div className="page-stack" style={{ padding: 0 }}>
            <span className="eyebrow">Student Dashboard</span>
            <h1 className="page-title">Welcome {currentUser.name.split(" ")[0]} to your placement dashboard</h1>
            <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
              Check your stats, see where you are weak, review applied companies with deadlines, and discover new companies.
            </p>
          </div>
          <div className="stats-grid">
            <StatCard label="Applied companies" value={analytics.totalApplications} hint="Total tracked" dark />
            <StatCard label="Rejected" value={analytics.rejected} hint="Total rejections" dark />
            <StatCard label="OA rejected" value={analytics.oaRejected} hint="Failed in OA" dark />
            <StatCard label="Interview rejected" value={analytics.interviewRejected} hint="Failed in interviews" dark />
          </div>
        </div>
      </section>

      <section className="split-grid">
        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">Advice Card</span>
          <h2 className="section-title" style={{ marginTop: "0.85rem" }}>How to improve</h2>
          <p className="lead">{analytics.advice}</p>
        </article>

        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">Weakness</span>
          <h2 className="section-title" style={{ marginTop: "0.85rem" }}>Current weak area</h2>
          <p className="lead">{analytics.weakness}</p>
          <div className="tag">Most failed stage: {analytics.mostFailedRound}</div>
        </article>
      </section>

      <section className="split-grid">
        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">Applied Companies</span>
          <div className="timeline" style={{ marginTop: "1rem" }}>
            {myApplications.length === 0 && (
              <p className="muted">No applications yet. Apply from the companies page.</p>
            )}
            {myApplications.map((application) => (
              <div key={application.id} className="timeline-item">
                <div className="actions-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{application.company?.name}</strong>
                  <StatusBadge status={application.status} />
                </div>
                <span className="muted">
                  {application.company?.role} · deadline {application.company?.deadline}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">New Companies To Apply</span>
          <div className="timeline" style={{ marginTop: "1rem" }}>
            {newCompanies.length === 0 && (
              <p className="muted">You have applied to all available companies.</p>
            )}
            {newCompanies.map((company) => (
              <div key={company.id} className="timeline-item">
                <div className="actions-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{company.name}</strong>
                  <button className="btn btn-primary" onClick={() => handleApply(company.id)}>
                    Apply
                  </button>
                </div>
                <span className="muted">
                  {company.role} · deadline {company.deadline}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
