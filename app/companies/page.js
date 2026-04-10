"use client";

import { useState } from "react";
import StatusBadge from "@/app/components/StatusBadge";
import StatCard from "@/app/components/StatCard";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function CompaniesPage() {
  const { state, currentUser, hydrated, myApplications, applyToCompany, addCompany } = usePlacementStore();
  const [form, setForm] = useState({
    name: "",
    role: "",
    package: "",
    deadline: "",
    location: "",
    mode: "Remote",
  });

  // Build set of company IDs already applied to (string comparison)
  const applicationIds = new Set(
    myApplications.map((application) => {
      const id = application.companyId?._id?.toString?.() || application.companyId?.toString?.() || application.companyId;
      return id?.trim().toLowerCase();
    }),
  );

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCustomSubmit(event) {
    event.preventDefault();
    await addCompany(form, { isGlobal: false });
    setForm({ name: "", role: "", package: "", deadline: "", location: "", mode: "Remote" });
  }

  async function handleApply(companyId) {
    await applyToCompany(companyId);
  }

  if (!hydrated) {
    return <div className="page-stack"><section className="card card-pad-lg">Loading companies...</section></div>;
  }

  return (
    <div className="page-stack">
      <section className="split-grid">
        <article className="hero-shell card-pad-lg">
          <span className="eyebrow">Opportunity Explorer</span>
          <h1 className="page-title">Browse campus drives and add your own off-campus companies.</h1>
          <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
            This screen combines admin-posted companies with your personal tracking list so nothing important gets lost.
          </p>
        </article>

        <div className="stats-grid">
          <StatCard label="Open listings" value={state.companies.length} hint="Total companies" />
          <StatCard label="Applied" value={applicationIds.size} hint="Already in tracker" />
          <StatCard label="Private companies" value={state.companies.filter((company) => !company.isGlobal).length} hint="Student-added company" />
        </div>
      </section>

      <section className="split-grid">
        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">Add Your Off-Campus Company</span>
          <h2 className="section-title" style={{ marginTop: "0.85rem" }}>Track an external opportunity privately</h2>
          <form className="page-stack" style={{ paddingBottom: 0 }} onSubmit={handleCustomSubmit}>
            <div className="field-grid">
              <label className="label">
                Company
                <input className="input" value={form.name} onChange={(event) => updateForm("name", event.target.value)} required />
              </label>
              <label className="label">
                Role
                <input className="input" value={form.role} onChange={(event) => updateForm("role", event.target.value)} required />
              </label>
              <label className="label">
                Package
                <input className="input" value={form.package} onChange={(event) => updateForm("package", event.target.value)} required />
              </label>
              <label className="label">
                Deadline
                <input className="input" type="date" value={form.deadline} onChange={(event) => updateForm("deadline", event.target.value)} required />
              </label>
              <label className="label">
                Location
                <input className="input" value={form.location} onChange={(event) => updateForm("location", event.target.value)} required />
              </label>
              <label className="label">
                Mode
                <select className="select" value={form.mode} onChange={(event) => updateForm("mode", event.target.value)}>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={!currentUser}>
              Add to tracker
            </button>
          </form>
        </article>
      </section>

      <section className="company-grid">
        {state.companies.map((company) => {
          const companyIdStr = (company._id?.toString?.() || company.id?.toString?.() || company.id)?.trim().toLowerCase();
          const alreadyApplied = applicationIds.has(companyIdStr);

          return (
            <article key={company.id} className="card card-strong card-pad-lg" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Header with company info and badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <span className="eyebrow eyebrow-light">{company.isGlobal ? "Campus drive" : "Private entry"}</span>
                  <h2 className="section-title" style={{ marginTop: "0.25rem", marginBottom: "0.25rem" }}>{company.name}</h2>
                  <p className="muted" style={{ marginBottom: 0 }}>{company.role}</p>
                </div>
                {alreadyApplied && <StatusBadge status="Applied" />}
              </div>

              {/* Tags row - always shows */}
              <div className="chip-row">
                <span className="tag">{company.package}</span>
                <span className="tag">{company.location}</span>
                <span className="tag">{company.mode}</span>
                <span className="tag">Deadline {company.deadline}</span>
              </div>

              {/* Skills row - only if skills exist */}
              {company.skills && company.skills.length > 0 && (
                <div className="chip-row">
                  {company.skills.map((skill) => (
                    <span key={skill} className="tag">{skill}</span>
                  ))}
                </div>
              )}

              {/* Button - always at bottom */}
              <button
                className={`btn ${alreadyApplied ? "btn-secondary" : "btn-primary"}`}
                onClick={() => handleApply(company.id)}
                disabled={!currentUser || alreadyApplied}
                style={{ marginTop: "auto" }}
              >
                {alreadyApplied ? "Already added" : "Apply / Track"}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
