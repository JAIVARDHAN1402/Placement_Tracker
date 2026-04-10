"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = usePlacementStore();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await login(form.username, form.password);

    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    if (result.user.role !== "student") {
      setMessage("Use the admin login page for admin accounts.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="page-stack">
      <section className="hero-shell card-pad-lg" style={{ minHeight: "220px" }}>
        <span className="eyebrow">User Access</span>
        <h1 className="page-title">Login to your account.</h1>
        <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
          Enter your username and password to continue.
        </p>
      </section>

      <section className="card card-strong card-pad-lg" style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
        <span className="eyebrow eyebrow-light">User Login</span>
        <form className="page-stack" style={{ paddingBottom: 0, marginTop: "0.85rem" }} onSubmit={handleLogin}>
          <label className="label">
            Username
            <input
              className="input"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm((c) => ({ ...c, password: event.target.value }))}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="actions-row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <span className="muted">No account?</span>
          <Link href="/signup" className="btn btn-secondary">
            Register here
          </Link>
        </div>
      </section>

      {message ? <section className="card card-pad" style={{ maxWidth: "640px", margin: "0 auto", width: "100%", color: "var(--danger)" }}>{message}</section> : null}
    </div>
  );
}
