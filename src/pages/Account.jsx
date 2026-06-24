import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function formatDate(isoStr) {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Account() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { nav("/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile({ ...prof, email: user.email });
      setLoading(false);
    }
    load();
  }, [nav]);

  const handlePortal = async () => {
    setPortalLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    try {
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ customerId: profile?.stripe_customer_id }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch {
      // fail silently
    }
    setPortalLoading(false);
  };

  const handleSignOut = async () => {
    setSigning(true);
    await supabase.auth.signOut();
    nav("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #f97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statusLabels = {
    trialing: "Free trial",
    active: "Active",
    past_due: "Past due",
    canceled: "Canceled",
  };

  const statusColors = {
    trialing: { color: "#92400e", bg: "#fefce8", border: "#fde68a" },
    active: { color: "#166534", bg: "#f0fdf4", border: "#bbf7d0" },
    past_due: { color: "#991b1b", bg: "#fff5f5", border: "#fecaca" },
    canceled: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  };

  const status = profile?.subscription_status || "trialing";
  const sc = statusColors[status] || statusColors.trialing;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("/dashboard")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#111827" }}>Account</div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* Profile */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Account</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid #f3f4f6", marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Email</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{profile?.email}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Status</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, padding: "4px 10px" }}>
              {statusLabels[status]}
            </span>
          </div>
        </div>

        {/* Subscription */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Subscription</div>

          {status === "trialing" && (
            <div style={{ fontSize: 14, color: "#374151", marginBottom: 14 }}>
              Trial ends <strong>{formatDate(profile?.trial_end)}</strong>
            </div>
          )}

          {status === "active" && profile?.stripe_customer_id && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{
                width: "100%",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "14px",
                fontSize: 15,
                fontWeight: 500,
                color: "#374151",
                cursor: portalLoading ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {portalLoading && <div style={{ width: 16, height: 16, border: "2px solid #d1d5db", borderTopColor: "#374151", borderRadius: "50%", animation: "spin .7s linear infinite" }} />}
              {portalLoading ? "Loading…" : "Manage subscription →"}
            </button>
          )}

          {(status === "canceled" || status === "past_due" || status === "trialing") && (
            <button
              onClick={() => nav("/subscribe")}
              style={{ width: "100%", background: "#f97316", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              {status === "trialing" ? "Upgrade to paid plan" : "Reactivate subscription"}
            </button>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={signing}
          style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 500, color: "#6b7280", cursor: signing ? "default" : "pointer" }}
        >
          {signing ? "Signing out…" : "Sign out"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
