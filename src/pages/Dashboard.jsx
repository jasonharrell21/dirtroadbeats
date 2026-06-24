import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ItemCard from "../components/ItemCard";
import SummaryRow from "../components/SummaryRow";
import FilterTabs from "../components/FilterTabs";
import TrialBanner from "../components/TrialBanner";
import PaywallModal from "../components/PaywallModal";

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + "T00:00:00");
  return Math.round((exp - today) / (1000 * 60 * 60 * 24));
}

function getItemStatus(item) {
  const days = daysUntil(item.exp_date);
  if (days < 0) return "expired";
  if (days <= 7) return "critical";
  if (days <= item.lead_days) return "warning";
  return "good";
}

export default function Dashboard() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: prof }, { data: its }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("items").select("*").eq("user_id", user.id).order("exp_date", { ascending: true }),
      ]);

      setProfile(prof);
      setItems(its || []);
      setLoading(false);
    }
    load();
  }, []);

  const isPaywalled = () => {
    if (!profile) return false;
    const status = profile.subscription_status;
    if (status === "active") return false;
    if (status === "trialing" && new Date(profile.trial_end) > new Date()) return false;
    return true;
  };

  const trialDaysLeft = () => {
    if (!profile || profile.subscription_status !== "trialing") return null;
    const diff = Math.ceil((new Date(profile.trial_end) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const filteredItems = items.filter((item) => {
    const status = getItemStatus(item);
    if (filter === "attention") return status === "expired" || status === "critical" || status === "warning";
    if (filter === "good") return status === "good";
    return true;
  });

  const expired = items.filter((i) => daysUntil(i.exp_date) < 0).length;
  const comingUp = items.filter((i) => {
    const d = daysUntil(i.exp_date);
    return d >= 0 && d <= i.lead_days;
  }).length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #f97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const paywalled = isPaywalled();
  const trialLeft = trialDaysLeft();

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {paywalled && <PaywallModal />}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            Trak<span style={{ color: "#f97316" }}>XP</span>
          </div>
          <button
            onClick={() => nav("/account")}
            style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer" }}
          >
            {profile?.subscription_status === "trialing" ? "Free trial" : "Account"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px" }}>
        {trialLeft !== null && trialLeft >= 0 && <TrialBanner daysLeft={trialLeft} />}

        <SummaryRow expired={expired} comingUp={comingUp} total={items.length} />
        <FilterTabs active={filter} onChange={setFilter} />

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#6b7280", marginBottom: 6 }}>
              {filter === "all" ? "Nothing tracked yet" : "Nothing here"}
            </div>
            <div style={{ fontSize: 14 }}>
              {filter === "all" ? "Tap + to add your first item" : "Change filter to see all items"}
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => nav(`/item/${item.id}`)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => nav("/add")}
        style={{
          position: "fixed",
          bottom: 28,
          right: "max(16px, calc(50% - 224px))",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#f97316",
          color: "#fff",
          border: "none",
          fontSize: 28,
          lineHeight: 1,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(249,115,22,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        +
      </button>
    </div>
  );
}
