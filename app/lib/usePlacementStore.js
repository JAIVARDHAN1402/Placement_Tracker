"use client";

import { useState, useEffect } from "react";
import { statusSteps } from "@/app/lib/mockData";

// Normalize a MongoDB document: add an 'id' field equal to _id string
function normalize(doc) {
  if (!doc) return doc;
  const id = doc._id ? doc._id.toString() : doc.id;
  return { ...doc, id };
}

function normalizeApp(app) {
  const companyId = app.companyId?._id?.toString?.() || app.companyId?.toString?.() || app.companyId;
  return {
    ...normalize(app),
    companyId,
    company: app.company ? normalize(app.company) : null,
  };
}

export function usePlacementStore() {
  const [currentUser, setCurrentUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // ── Internal refresh helpers ──────────────────────────────

  async function refreshCompanies() {
    try {
      const res = await fetch("/api/companies", { credentials: "include" });
      const data = await res.json();
      setCompanies((data.companies || []).map(normalize));
    } catch (err) {
      console.error("Failed to refresh companies:", err);
    }
  }

  async function refreshApplications() {
    try {
      const [appsRes, analyticsRes] = await Promise.all([
        fetch("/api/application", { credentials: "include" }),
        fetch("/api/analytics/user", { credentials: "include" }),
      ]);
      const appsData = await appsRes.json();
      const analyticsData = await analyticsRes.json();
      setMyApplications((appsData.applications || []).map(normalizeApp));
      setUserAnalytics(analyticsData.analytics || null);
    } catch (err) {
      console.error("Failed to refresh applications:", err);
    }
  }

  async function refreshAdminAnalytics() {
    try {
      const res = await fetch("/api/analytics/admin", { credentials: "include" });
      const data = await res.json();
      setAdminAnalytics(data.analytics || null);
    } catch (_) {}
  }

  // ── Bootstrap on mount ───────────────────────────────────

  useEffect(() => {
    async function init() {
      try {
        // 1. Who is logged in?
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        const meData = await meRes.json();
        const user = meData.user ? normalize(meData.user) : null;
        setCurrentUser(user);

        // 2. Companies (always needed)
        const companiesRes = await fetch("/api/companies", { credentials: "include" });
        const companiesData = await companiesRes.json();
        setCompanies((companiesData.companies || []).map(normalize));

        // 3. User-specific data
        if (user) {
          await Promise.all([
            refreshApplications(),
            refreshAdminAnalytics(),
          ]);
        }
      } catch (err) {
        console.error("Store init error:", err);
      } finally {
        setHydrated(true);
      }
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth actions ─────────────────────────────────────────

  async function login(username, password) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };

      const user = normalize(data.user);
      setCurrentUser(user);
      await Promise.all([refreshApplications(), refreshAdminAnalytics()]);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, message: "Network error. Please try again." };
    }
  }

  async function signup(payload) {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };

      const user = normalize(data.user);
      setCurrentUser(user);
      await Promise.all([refreshApplications(), refreshAdminAnalytics()]);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, message: "Network error. Please try again." };
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (_) {}
    setCurrentUser(null);
    setMyApplications([]);
    setUserAnalytics(null);
    setAdminAnalytics(null);
  }

  // ── Application actions ───────────────────────────────────

  async function applyToCompany(companyId) {
    if (!currentUser) return { ok: false, message: "Login first to apply." };

    const companyIdStr = companyId?.toString();
    const existing = myApplications.find(
      (app) => app.companyId?.toString() === companyIdStr,
    );
    if (existing) return { ok: false, message: "You already have this application in your tracker." };

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyId,
          status: "Applied",
          appliedDate: new Date().toISOString().slice(0, 10),
          source: "tracker",
        }),
      });
      if (!res.ok) return { ok: false, message: "Failed to apply." };
      await refreshApplications();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: "Network error." };
    }
  }

  async function withdrawApplication(applicationId) {
    await fetch(`/api/application/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "Withdrawn" }),
    });
    await refreshApplications();
  }

  async function updateApplicationStatus(applicationId, status, failureStage = null) {
    const payload = { status };
    if (failureStage) {
      payload.failureStage = failureStage;
    }
    await fetch(`/api/application/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    await refreshApplications();
  }

  // ── Company actions ───────────────────────────────────────

  async function addCompany(payload, options = {}) {
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...payload, isGlobal: Boolean(options.isGlobal) }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refreshCompanies();
      return normalize(data.company);
    } catch (err) {
      return null;
    }
  }

  async function updateCompany(companyId, payload) {
    await fetch(`/api/companies/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    await refreshCompanies();
  }

  async function deleteCompany(companyId) {
    await fetch(`/api/companies/${companyId}`, { method: "DELETE", credentials: "include" });
    await Promise.all([refreshCompanies(), refreshApplications()]);
  }

  // ── Derived data ──────────────────────────────────────────

  const upcomingDeadlines = [...companies]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const recentActivities = myApplications.map((app) => ({
    id: app.id,
    title: `${app.company?.name} · ${app.status}`,
    subtitle: `${app.company?.role} · ${app.company?.location}`,
    date: app.appliedDate,
  }));

  // Keep the same 'state' shape so pages using state.companies still work
  const state = { companies };

  return {
    state,
    hydrated,
    currentUser,
    myApplications,
    userAnalytics,
    adminAnalytics,
    statusSteps,
    upcomingDeadlines,
    recentActivities,
    login,
    signup,
    logout,
    applyToCompany,
    withdrawApplication,
    updateApplicationStatus,
    addCompany,
    updateCompany,
    deleteCompany,
  };
}
