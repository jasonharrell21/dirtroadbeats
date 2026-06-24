export default function SummaryRow({ expired, comingUp, total }) {
  const stats = [
    { label: "Expired", value: expired, color: "#991b1b", bg: "#fff5f5", border: "#fecaca" },
    { label: "Coming up", value: comingUp, color: "#92400e", bg: "#fff7ed", border: "#fed7aa" },
    { label: "Total", value: total, color: "#374151", bg: "#f9fafb", border: "#e5e7eb" },
  ];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 12,
            padding: "14px 12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
