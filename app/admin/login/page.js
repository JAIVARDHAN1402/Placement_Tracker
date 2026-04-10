"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = usePlacementStore();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await login(form.username, form.password);

    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    if (result.user.role !== "admin") {
      setMessage("This page is for admin accounts only.");
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="page-stack">
      <section className="hero-shell card-pad-lg">
        <span className="eyebrow">Admin Access</span>
        <h1 className="page-title">Login as admin to add companies.</h1>
        <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
          Enter your admin username and password.
        </p>
      </section>

      <section className="card card-strong card-pad-lg" style={{ maxWidth: "560px" }}>
        <form className="page-stack" style={{ paddingBottom: 0 }} onSubmit={handleSubmit}>
          <label className="label">
            Username
            <input
              className="input"
              placeholder="Admin username"
              value={form.username}
              onChange={(event) => setForm((c) => ({ ...c, username: event.target.value }))}
              required
            />
          </label>
          <label className="label">
            Password
            <input
              className="input"
              type="password"
              placeholder="Admin password"
              value={form.password}
              onChange={(event) => setForm((c) => ({ ...c, password: event.target.value }))}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as admin"}
          </button>
        </form>
        {message ? <div className="tag" style={{ color: "var(--danger)", marginTop: "1rem" }}>{message}</div> : null}
      </section>
    </div>
  );
}
