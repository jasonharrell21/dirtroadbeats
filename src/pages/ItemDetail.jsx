import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CATEGORY_ICONS = {
  identity: "🪪", vehicle: "🚗", insurance: "🛡️", health: "💊",
  membership: "🎟️", financial: "💳", warranty: "📦", other: "📌",
};

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + "T00:00:00");
  return Math.round((exp - today) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ItemDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    supabase.from("items").select("*").eq("id", id).single().then(({ data }) => {
      setItem(data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("items").delete().eq("id", id);
    nav("/dashboard");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #f97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 16, color: "#6b7280" }}>Item not found.</div>
        <button onClick={() => nav("/dashboard")} style={{ color: "#f97316", background: "none", border: "none", cursor: "pointer", fontSize: 15 }}>← Back to dashboard</button>
      </div>
    );
  }

  const days = daysUntil(item.exp_date);
  const icon = CATEGORY_ICONS[item.category] || "📌";

  let statusColor = "#374151";
  let statusBg = "#f9fafb";
  let statusBorder = "#e5e7eb";
  let statusLabel = "";

  if (days < 0) {
    statusColor = "#991b1b"; statusBg = "#fff5f5"; statusBorder = "#fecaca";
    statusLabel = `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  } else if (days <= 7) {
    statusColor = "#92400e"; statusBg = "#fff7ed"; statusBorder = "#fed7aa";
    statusLabel = `Expires in ${days} day${days === 1 ? "" : "s"}`;
  } else if (days <= item.lead_days) {
    statusColor = "#92400e"; statusBg = "#fefce8"; statusBorder = "#fde68a";
    statusLabel = `Expires in ${days} days`;
  } else {
    statusColor = "#374151"; statusBg = "#f9fafb"; statusBorder = "#e5e7eb";
    statusLabel = `${days} days remaining`;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("/dashboard")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", padding: 0 }}>←</button>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#111827" }}>Item Details</div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>
        <div style={{ background: "#fff", border: `1px solid ${statusBorder}`, borderRadius: 16, padding: "28px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 44, lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{item.name}</div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2, textTransform: "capitalize" }}>{item.category}</div>
            </div>
          </div>

          <div style={{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: statusColor }}>{statusLabel}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Expiration date</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{formatDate(item.exp_date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Alert window</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.lead_days} days before</span>
            </div>
            {item.notes && (
              <div style={{ paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.55 }}>{item.notes}</div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>Alert sent</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: item.alerted ? "#374151" : "#9ca3af" }}>
                {item.alerted ? "Yes" : "Not yet"}
              </span>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{ width: "100%", background: "#fff", border: "1px solid #fecaca", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 500, color: "#991b1b", cursor: "pointer" }}
          >
            Remove this item
          </button>
        ) : (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "20px" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#991b1b", marginBottom: 8 }}>Remove this item?</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>This can&rsquo;t be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, background: "#991b1b", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: deleting ? "default" : "pointer" }}
              >
                {deleting ? "Removing…" : "Yes, remove"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
