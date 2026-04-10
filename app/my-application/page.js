"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/app/components/StatusBadge";
import StatCard from "@/app/components/StatCard";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function MyApplicationsPage() {
  const { currentUser, hydrated, myApplications, statusSteps, updateApplicationStatus, withdrawApplication, userAnalytics } =
    usePlacementStore();
  const [showFailureStage, setShowFailureStage] = useState(null);

  if (!hydrated) {
    return <div className="page-stack"><section className="card card-pad-lg">Loading application tracker...</section></div>;
  }

  if (!currentUser) {
    return (
      <div className="page-stack">
        <section className="empty-state">
          <h1 className="section-title">Login to manage your applications.</h1>
          <p className="lead">You can update every stage here, from Applied to Selected, and keep a clean interview history.</p>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </section>
      </div>
    );
  }

  const analytics = userAnalytics || { totalApplications: 0, interviews: 0, rejectionRate: 0 };

  return (
    <div className="page-stack">
      <section className="split-grid">
        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">My Tracker</span>
          <h1 className="section-title" style={{ marginTop: "0.85rem" }}>Your history of every application.</h1>
          <p className="lead">
            Update progress as soon as rounds change. Your dashboard analytics use this data directly, so accurate tracking gives better insight.
          </p>
        </article>
        <div className="stats-grid">
          <StatCard label="Total applications" value={analytics.totalApplications} hint="Current volume" />
          <StatCard label="Interviewing" value={analytics.interviews} hint="Active interview rounds" />
          <StatCard label="Rejection rate" value={`${analytics.rejectionRate}%`} hint="Current outcome mix" />
        </div>
      </section>

      {myApplications.length ? (
        <section className="page-stack">
          {myApplications.map((application) => (
            <article key={application.id} className="card card-strong card-pad-lg">
              <div className="split-grid">
                <div className="page-stack" style={{ gap: "0.65rem", padding: 0 }}>
                  <div className="actions-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 className="section-title">{application.company?.name}</h2>
                      <p className="muted">
                        {application.company?.role} · {application.company?.location} · {application.company?.package}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="chip-row">
                    <span className="tag">Applied on {application.appliedDate}</span>
                    <span className="tag">Deadline {application.company?.deadline}</span>
                    <span className="tag">{application.company?.mode}</span>
                  </div>
                </div>

                <div className="page-stack" style={{ gap: "0.8rem", padding: 0 }}>
                  <label className="label">
                    Update status
                    <select
                      className="select"
                      value={showFailureStage === application.id ? "Rejected" : application.status}
                      onChange={(event) => {
                        const newStatus = event.target.value;
                        if (newStatus === "Rejected") {
                          setShowFailureStage(application.id);
                        } else {
                          updateApplicationStatus(application.id, newStatus, null);
                          setShowFailureStage(null);
                        }
                      }}
                    >
                      {statusSteps.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  {showFailureStage === application.id ? (
                    <div style={{ backgroundColor: "#f0f7f6", padding: "1rem", borderRadius: "8px" }}>
                      <label className="label">
                        At which stage were you rejected?
                        <select
                          className="select"
                          defaultValue={application.failureStage || ""}
                          onChange={(event) => {
                            updateApplicationStatus(application.id, "Rejected", event.target.value || null);
                            setShowFailureStage(null);
                          }}
                        >
                          <option value="">No assessment (direct rejection)</option>
                          <option value="OA">OA (Online Assessment)</option>
                          <option value="Interview">Interview Round</option>
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <button className="btn btn-danger" onClick={() => withdrawApplication(application.id)}>
                    Mark as withdrawn
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2 className="section-title">No applications yet.</h2>
          <p className="lead">Start from the companies page and add your first opportunity to begin tracking.</p>
          <Link href="/companies" className="btn btn-primary">
            Browse companies
          </Link>
        </section>
      )}
    </div>
  );
}
