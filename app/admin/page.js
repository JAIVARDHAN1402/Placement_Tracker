"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, hydrated, state, addCompany, updateCompany, deleteCompany, logout } = usePlacementStore();
  const [form, setForm] = useState({
    name: "",
    role: "",
    package: "",
    deadline: "",
    location: "",
    mode: "Hybrid",
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!hydrated) {
    return <div className="page-stack"><section className="card card-pad-lg">Loading admin dashboard...</section></div>;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="page-stack">
        <section className="empty-state">
          <h1 className="section-title">Admin access required.</h1>
          <p className="lead">Sign in with the admin account to add companies for users.</p>
          <Link href="/admin/login" className="btn btn-primary">
            Login as admin
          </Link>
        </section>
      </div>
    );
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", role: "", package: "", deadline: "", location: "", mode: "Hybrid" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    if (editingId) {
      await updateCompany(editingId, form);
    } else {
      await addCompany(form, { isGlobal: true });
    }

    setSaving(false);
    resetForm();
  }

  async function handleDelete(companyId) {
    await deleteCompany(companyId);
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="page-stack">
      <section className="hero-shell card-pad-lg">
        <span className="eyebrow">Admin Panel</span>
        <h1 className="page-title">Add companies for users to apply.</h1>
        <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
          Admin work here is simple: add, edit, and remove companies. These companies will appear to users in their dashboard.
        </p>
      </section>

      <section className="card card-strong card-pad-lg">
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
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update company" : "Add company"}
            </button>
            {editingId ? (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card card-strong card-pad-lg">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.companies.filter((company) => company.isGlobal).map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.role}</td>
                  <td>{company.deadline}</td>
                  <td>
                    <div className="actions-row">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingId(company.id);
                          setForm({
                            name: company.name,
                            role: company.role,
                            package: company.package,
                            deadline: company.deadline,
                            location: company.location,
                            mode: company.mode,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(company.id)}>
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

      <section className="actions-row" style={{ justifyContent: "center" }}>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </div>
  );
}
