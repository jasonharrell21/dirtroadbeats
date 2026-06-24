import { useNavigate } from "react-router-dom";

export default function TrialBanner({ daysLeft }) {
  const nav = useNavigate();

  return (
    <div style={{
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#92400e" }}>
          {daysLeft === 0 ? "Trial ends today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in trial`}
        </div>
        <div style={{ fontSize: 12, color: "#c2410c", marginTop: 2 }}>$4.99/month after</div>
      </div>
      <button
        onClick={() => nav("/subscribe")}
        style={{
          background: "#f97316",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Subscribe
      </button>
    </div>
  );
}
