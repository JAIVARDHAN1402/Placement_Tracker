export default function StatCard({ label, value, hint, dark = false }) {
  return (
    <article className={`card metric-card ${dark ? "card-dark" : "card-strong"} card-pad`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {hint ? <span className="metric-label">{hint}</span> : null}
    </article>
  );
}
