"use client";

import { useState } from "react";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

function emptyCompanyForm() {
  return {
    name: "",
    role: "",
    package: "",
    deadline: "",
    location: "",
    mode: "Hybrid",
  };
}

export default function AdminCompaniesPage() {
  const { currentUser, hydrated, state, addCompany, updateCompany, deleteCompany } = usePlacementStore();
  const [form, setForm] = useState(emptyCompanyForm);
  const [editingId, setEditingId] = useState(null);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      updateCompany(editingId, form);
      setEditingId(null);
    } else {
      addCompany(form, { isGlobal: true, createdBy: currentUser?.id || "user-admin" });
    }

    setForm(emptyCompanyForm());
  }

  function handleEdit(company) {
    setEditingId(company.id);
    setForm({
      name: company.name,
      role: company.role,
      package: company.package,
      deadline: company.deadline,
      location: company.location,
      mode: company.mode,
    });
  }

  if (!hydrated) {
    return <div className="page-stack"><section className="card card-pad-lg">Loading company manager...</section></div>;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="page-stack">
        <section className="empty-state">
          <h1 className="section-title">Only admins can manage companies.</h1>
          <p className="lead">Switch to the demo admin account from the navbar to use this screen.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="split-grid">
        <article className="card card-strong card-pad-lg">
          <span className="eyebrow eyebrow-light">Company Manager</span>
          <h1 className="section-title" style={{ marginTop: "0.85rem" }}>
            Publish and maintain campus opportunities.
          </h1>
          <form onSubmit={handleSubmit} className="page-stack" style={{ paddingBottom: 0 }}>
            <div className="field-grid">
              <label className="label">
                Company
                <input className="input" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
              </label>
              <label className="label">
                Role
                <input className="input" value={form.role} onChange={(event) => updateField("role", event.target.value)} required />
              </label>
              <label className="label">
                Package
                <input className="input" value={form.package} onChange={(event) => updateField("package", event.target.value)} required />
              </label>
              <label className="label">
                Deadline
                <input className="input" type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)} required />
              </label>
              <label className="label">
                Location
                <input className="input" value={form.location} onChange={(event) => updateField("location", event.target.value)} required />
              </label>
              <label className="label">
                Mode
                <select className="select" value={form.mode} onChange={(event) => updateField("mode", event.target.value)}>
                  <option>Hybrid</option>
                  <option>Remote</option>
                  <option>On-site</option>
                </select>
              </label>
            </div>
            <div className="actions-row">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update company" : "Add company"}
              </button>
              {editingId ? (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyCompanyForm());
                  }}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="card card-dark card-pad-lg">
          <span className="eyebrow">Admin Notes</span>
          <div className="timeline" style={{ marginTop: "1rem" }}>
            {[
              "Global companies appear for every student.",
              "Deleting a company also clears linked applications for consistency.",
              "Students can still maintain private companies separately.",
            ].map((item) => (
              <div key={item} className="timeline-item">
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card card-strong card-pad-lg">
        <span className="eyebrow eyebrow-light">Published Companies</span>
        <div className="table-wrap" style={{ marginTop: "1rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    {company.name}
                    <div className="table-subtle">{company.location}</div>
                  </td>
                  <td>{company.role}</td>
                  <td>{company.package}</td>
                  <td>{company.deadline}</td>
                  <td>
                    <div className="actions-row">
                      <button className="btn btn-secondary" onClick={() => handleEdit(company)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => deleteCompany(company.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
