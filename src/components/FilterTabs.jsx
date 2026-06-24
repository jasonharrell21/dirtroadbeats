const TABS = [
  { id: "all", label: "All" },
  { id: "attention", label: "Needs attention" },
  { id: "good", label: "Good" },
];

export default function FilterTabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            background: active === tab.id ? "#111827" : "#fff",
            color: active === tab.id ? "#fff" : "#6b7280",
            border: active === tab.id ? "1px solid #111827" : "1px solid #e5e7eb",
            borderRadius: 20,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
