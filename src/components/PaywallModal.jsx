import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function PaywallModal() {
  const nav = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      backdropFilter: "blur(4px)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "36px 28px",
        maxWidth: 380,
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
          Your trial has ended
        </div>
        <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
          Subscribe to continue tracking expirations and receiving alerts.
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>TrakXP Monthly</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>$4.99<span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>/mo</span></span>
          </div>
          {["Unlimited items", "Email alerts", "Cancel anytime"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "#f97316", fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => nav("/subscribe")}
          style={{
            display: "block",
            width: "100%",
            background: "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          Subscribe now
        </button>
        <button
          onClick={handleSignOut}
          style={{
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            fontSize: 14,
            color: "#9ca3af",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
