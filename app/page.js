import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-shell" style={{ minHeight: "560px", display: "grid", alignItems: "center" }}>
        <div className="hero-grid">
          <div className="page-stack" style={{ padding: 0 }}>
            <span className="eyebrow">Placement Management System</span>
            <h1 className="page-title">Choose your role and enter the placement tracker.</h1>
            <p className="lead" style={{ color: "rgba(255,255,255,0.82)" }}>
              Students get one clear place to track applications, see rejections, understand weak areas, and add personal
              companies. Admin only adds companies that students can later apply to.
            </p>
          </div>

          <div className="split-grid" style={{ alignItems: "stretch" }}>
            <Link
              href="/admin/login"
              className="card card-pad-lg"
              style={{ background: "rgba(255,255,255,0.12)", minHeight: "240px", display: "grid", alignContent: "start" }}
            >
              <span className="eyebrow">Admin</span>
              <h2 className="section-title" style={{ marginTop: "0.85rem" }}>Admin Login</h2>
              <p className="lead" style={{ color: "rgba(255,255,255,0.78)" }}>
                Login to add placement companies and publish opportunities for users.
              </p>
            </Link>

            <Link
              href="/login"
              className="card card-pad-lg"
              style={{ background: "rgba(255,255,255,0.12)", minHeight: "240px", display: "grid", alignContent: "start" }}
            >
              <span className="eyebrow">User</span>
              <h2 className="section-title" style={{ marginTop: "0.85rem" }}>User Login</h2>
              <p className="lead" style={{ color: "rgba(255,255,255,0.78)" }}>
                Login to track applications, see stats, and add your own companies.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
