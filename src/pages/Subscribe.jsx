import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Subscribe() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { nav("/login"); return; }

    const { data: { session } } = await supabase.auth.getSession();

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError("Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Your free trial has ended</div>
          <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
            Subscribe to keep tracking your expirations and receiving alerts.
          </div>
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f97316", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>TrakXP Monthly</div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#111827" }}>$4.99</span>
            <span style={{ fontSize: 18, color: "#6b7280", fontWeight: 500 }}>/month</span>
          </div>

          {["Unlimited items tracked", "Email alerts for every expiration", "All 8 categories", "Cancel anytime"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ color: "#f97316", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 15, color: "#374151" }}>{f}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#991b1b" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#fdba74" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {loading && <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />}
          {loading ? "Loading checkout…" : "Subscribe now — $4.99/mo"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
          Secured by Stripe · Cancel anytime from your account
        </div>
      </div>
    </div>
  );
}
