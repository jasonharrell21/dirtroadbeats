import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ItemCard from "../components/ItemCard";
import SummaryRow from "../components/SummaryRow";
import FilterTabs from "../components/FilterTabs";
import TrialBanner from "../components/TrialBanner";
import PaywallModal from "../components/PaywallModal";

const PUSH_PROMPT_KEY = "trakxp_push_prompt_dismissed";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

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

function PushPrompt({ onEnable, onDismiss }) {
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    await onEnable();
    setLoading(false);
  };

  return (
    <div style={{
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: 12,
      padding: "16px",
      marginBottom: 16,
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
    }}>
      <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1.2 }}>🔔</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>
          Get alerts on your phone
        </div>
        <div style={{ fontSize: 13, color: "#b45309", marginBottom: 12, lineHeight: 1.5 }}>
          Turn on push notifications so you never miss an expiration alert.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleEnable}
            disabled={loading}
            style={{
              background: "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {loading && <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />}
            {loading ? "Enabling…" : "Enable notifications"}
          </button>
          <button
            onClick={onDismiss}
            style={{ background: "none", border: "none", fontSize: 13, color: "#92400e", cursor: "pointer", padding: "8px 4px" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showPushPrompt, setShowPushPrompt] = useState(false);

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

      // Show push prompt if: supported, not dismissed, no subscription yet, permission not already granted
      const pushSupported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      const dismissed = localStorage.getItem(PUSH_PROMPT_KEY);
      const alreadyGranted = "Notification" in window && Notification.permission === "granted";
      if (pushSupported && !dismissed && !prof?.push_endpoint && !alreadyGranted) {
        setShowPushPrompt(true);
      }
    }
    load();
  }, []);

  const handlePushEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShowPushPrompt(false);
        localStorage.setItem(PUSH_PROMPT_KEY, "1");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("profiles").update({ notify_push: true }).eq("id", user.id);
    } catch (e) {
      console.error("Push enable error:", e);
    }
    setShowPushPrompt(false);
    localStorage.setItem(PUSH_PROMPT_KEY, "1");
  };

  const handlePushDismiss = () => {
    setShowPushPrompt(false);
    localStorage.setItem(PUSH_PROMPT_KEY, "1");
  };

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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        {showPushPrompt && <PushPrompt onEnable={handlePushEnable} onDismiss={handlePushDismiss} />}

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
