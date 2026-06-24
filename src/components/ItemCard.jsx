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
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ItemCard({ item, onClick }) {
  const days = daysUntil(item.exp_date);
  const icon = CATEGORY_ICONS[item.category] || "📌";

  let bg = "#f9fafb";
  let border = "#e5e7eb";
  let textColor = "#374151";
  let daysLabel = "";
  let daysColor = "#6b7280";

  if (days < 0) {
    bg = "#fff5f5"; border = "#fecaca"; textColor = "#111827";
    daysLabel = `Expired ${Math.abs(days)}d ago`;
    daysColor = "#991b1b";
  } else if (days <= 7) {
    bg = "#fff7ed"; border = "#fed7aa"; textColor = "#111827";
    daysLabel = `${days}d left`;
    daysColor = "#c2410c";
  } else if (days <= item.lead_days) {
    bg = "#fefce8"; border = "#fde68a"; textColor = "#111827";
    daysLabel = `${days}d left`;
    daysColor = "#a16207";
  } else {
    daysLabel = `${days}d left`;
    daysColor = "#6b7280";
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "16px",
        marginBottom: 10,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>{formatDate(item.exp_date)}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: daysColor }}>{daysLabel}</div>
      </div>
    </button>
  );
}
