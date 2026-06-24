import { useNavigate } from "react-router-dom";

const S = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    maxWidth: 480,
    margin: "0 auto",
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: -0.5,
  },
  logoAccent: { color: "#f97316" },
  hero: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "60px 24px 48px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#fff7ed",
    color: "#c2410c",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 20,
    border: "1px solid #fed7aa",
  },
  h1: {
    fontSize: 40,
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.1,
    marginBottom: 16,
    letterSpacing: -1,
  },
  sub: {
    fontSize: 17,
    color: "#6b7280",
    lineHeight: 1.65,
    marginBottom: 36,
    maxWidth: 360,
    margin: "0 auto 36px",
  },
  cta: {
    display: "block",
    width: "100%",
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "16px 0",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 12,
  },
  ctaSecondary: {
    display: "block",
    width: "100%",
    background: "transparent",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "15px 0",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: 28,
  },
  hint: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  features: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 24,
    padding: "18px",
    background: "#f9fafb",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
  featureIcon: {
    fontSize: 28,
    flexShrink: 0,
    lineHeight: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.55,
  },
  pricing: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "0 24px 60px",
    textAlign: "center",
  },
  pricingCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "28px 24px",
    textAlign: "center",
  },
  footer: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "24px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    fontSize: 13,
    color: "#9ca3af",
  },
};

const FEATURES = [
  { icon: "🪪", title: "Every document, one place", desc: "Passport, driver's license, insurance cards, registrations — track them all without opening a drawer." },
  { icon: "📧", title: "Email alerts before it's too late", desc: "Set custom lead times. Get a heads-up 7, 14, 30, or 90 days before anything expires." },
  { icon: "⚡", title: "30 seconds to add anything", desc: "Pick a category, tap a preset, set the date. No clutter, no friction." },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo}>Trak<span style={S.logoAccent}>XP</span></div>
        <button
          onClick={() => nav("/login")}
          style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer" }}
        >
          Log in
        </button>
      </nav>

      <div style={S.hero}>
        <div style={S.badge}>Free 14-day trial</div>
        <h1 style={S.h1}>Nothing<br /><span style={{ color: "#f97316" }}>slips through.</span></h1>
        <p style={S.sub}>
          Track passports, insurance, registrations, and anything else with an expiration date.
          Get email alerts before it&rsquo;s too late.
        </p>
        <div style={{ maxWidth: 380, margin: "0 auto" }}>
          <button style={S.cta} onClick={() => nav("/signup")}>
            Start free trial — no card required
          </button>
          <button style={S.ctaSecondary} onClick={() => nav("/login")}>
            I already have an account
          </button>
        </div>
        <p style={S.hint}>14 days free · $4.99/month after · Cancel anytime</p>
      </div>

      <div style={S.features}>
        {FEATURES.map((f) => (
          <div key={f.title} style={S.featureItem}>
            <span style={S.featureIcon}>{f.icon}</span>
            <div>
              <div style={S.featureTitle}>{f.title}</div>
              <div style={S.featureDesc}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.pricing}>
        <div style={S.pricingCard}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f97316", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Simple pricing</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#111827", marginBottom: 4 }}>$4.99<span style={{ fontSize: 18, fontWeight: 500, color: "#6b7280" }}>/mo</span></div>
          <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 20 }}>after 14-day free trial</div>
          {["Unlimited items tracked", "Email alerts for every expiration", "All 8 categories", "Cancel anytime"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, textAlign: "left" }}>
              <span style={{ color: "#f97316", fontWeight: 700, fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
            </div>
          ))}
          <button
            style={{ ...S.cta, marginTop: 20, marginBottom: 0 }}
            onClick={() => nav("/signup")}
          >
            Get started free
          </button>
        </div>
      </div>

      <footer style={S.footer}>
        <div style={{ marginBottom: 8, fontWeight: 600, color: "#374151" }}>Trak<span style={{ color: "#f97316" }}>XP</span></div>
        <div>© {new Date().getFullYear()} TrakXP. All rights reserved.</div>
      </footer>
    </div>
  );
}
