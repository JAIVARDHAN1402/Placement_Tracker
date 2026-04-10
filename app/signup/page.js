"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = usePlacementStore();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    branch: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signup(form);

    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="page-stack">
      <section className="hero-shell card-pad-lg" style={{ minHeight: "220px" }}>
        <span className="eyebrow">Student Access</span>
        <h1 className="page-title">Create your placement tracker account.</h1>
        <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
          Register once to start tracking applications, deadlines, and progress.
        </p>
      </section>

      <section className="card card-strong card-pad-lg" style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
        <span className="eyebrow eyebrow-light">Signup</span>
        <form className="page-stack" style={{ paddingBottom: 0, marginTop: "0.85rem" }} onSubmit={handleSignup}>
          <label className="label">
            Full name
            <input
              className="input"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
          <label className="label">
            Username
            <input
              className="input"
              placeholder="Choose a username"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </label>
          <label className="label">
            Password
            <input
              className="input"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <label className="label">
            Branch
            <input
              className="input"
              placeholder="Optional branch or department"
              value={form.branch}
              onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))}
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="actions-row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <span className="muted">Already have an account?</span>
          <Link href="/login" className="btn btn-secondary">
            Login here
          </Link>
        </div>
      </section>

      {message ? <section className="card card-pad" style={{ maxWidth: "640px", margin: "0 auto", width: "100%", color: "var(--danger)" }}>{message}</section> : null}
    </div>
  );
}
