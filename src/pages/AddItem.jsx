import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CATEGORIES = [
  { id: "identity", icon: "🪪", label: "Identity", presets: ["Passport", "Driver's License", "State ID", "Global Entry"] },
  { id: "vehicle", icon: "🚗", label: "Vehicle", presets: ["Car Registration", "Inspection Sticker", "Vehicle Tag"] },
  { id: "insurance", icon: "🛡️", label: "Insurance", presets: ["Auto Insurance", "Health Insurance", "Renters Insurance", "Home Insurance", "Life Insurance"] },
  { id: "health", icon: "💊", label: "Health", presets: ["Prescription Refill", "FSA/HSA Balance", "Vision Benefits", "Dental Benefits"] },
  { id: "membership", icon: "🎟️", label: "Membership", presets: ["Gym Membership", "Costco", "AAA", "Amazon Prime", "Streaming Service"] },
  { id: "financial", icon: "💳", label: "Financial", presets: ["Credit Card Annual Fee", "CD Maturity", "Bond Maturity"] },
  { id: "warranty", icon: "📦", label: "Warranty", presets: ["Appliance Warranty", "Electronics Warranty", "Home Warranty"] },
  { id: "other", icon: "📌", label: "Other", presets: [] },
];

const LEAD_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
];

export default function AddItem() {
  const nav = useNavigate();
  const [step, setStep] = useState("category"); // category | detail
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [expDate, setExpDate] = useState("");
  const [leadDays, setLeadDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCat = CATEGORIES.find((c) => c.id === category);

  const handleCategorySelect = (cat) => {
    setCategory(cat.id);
    setName("");
    setCustomName("");
    setShowCustom(false);
    setStep("detail");
  };

  const handlePreset = (preset) => {
    setName(preset);
    setShowCustom(false);
    setCustomName("");
  };

  const handleOther = () => {
    setName("");
    setShowCustom(true);
  };

  const finalName = showCustom ? customName.trim() : name;

  const handleSave = async () => {
    if (!finalName) { setError("Please enter a name for this item."); return; }
    if (!expDate) { setError("Please enter an expiration date."); return; }
    setError("");
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { nav("/login"); return; }

    const { error: insertError } = await supabase.from("items").insert({
      user_id: user.id,
      name: finalName,
      category: category,
      exp_date: expDate,
      lead_days: leadDays,
      notes: notes.trim() || null,
      alerted: false,
    });

    if (insertError) {
      setError("Failed to save. Please try again.");
      setSaving(false);
      return;
    }

    nav("/dashboard");
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 16,
    color: "#111827",
    background: "#fff",
    outline: "none",
  };

  if (step === "category") {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => nav("/dashboard")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", padding: 0 }}>←</button>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#111827" }}>Add Item</div>
          </div>
        </div>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 16 }}>Choose a category</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "20px 16px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "border-color .15s",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setStep("category")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", padding: 0 }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{selectedCat?.icon}</span>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#111827" }}>{selectedCat?.label}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* Name presets */}
        {selectedCat?.presets.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", marginBottom: 10 }}>Quick select</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedCat.presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePreset(p)}
                  style={{
                    background: name === p && !showCustom ? "#f97316" : "#fff",
                    color: name === p && !showCustom ? "#fff" : "#374151",
                    border: name === p && !showCustom ? "1px solid #f97316" : "1px solid #e5e7eb",
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontSize: 14,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={handleOther}
                style={{
                  background: showCustom ? "#f97316" : "#fff",
                  color: showCustom ? "#fff" : "#374151",
                  border: showCustom ? "1px solid #f97316" : "1px solid #e5e7eb",
                  borderRadius: 20,
                  padding: "8px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Other…
              </button>
            </div>
          </div>
        )}

        {/* Custom name for "Other" category or when Other… selected */}
        {(selectedCat?.id === "other" || showCustom) && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Item name</label>
            <input
              style={inputStyle}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Library Card, Work Badge…"
              autoFocus
            />
          </div>
        )}

        {/* Expiration date */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Expiration date</label>
          <input
            type="date"
            style={inputStyle}
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
          />
        </div>

        {/* Alert window */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 10 }}>Alert me</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LEAD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLeadDays(opt.value)}
                style={{
                  background: leadDays === opt.value ? "#f97316" : "#fff",
                  color: leadDays === opt.value ? "#fff" : "#374151",
                  border: leadDays === opt.value ? "1px solid #f97316" : "1px solid #e5e7eb",
                  borderRadius: 20,
                  padding: "8px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {opt.label} before
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Notes <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span></label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Policy number, renewal link, etc."
          />
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#991b1b" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            background: saving ? "#fdba74" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: saving ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {saving && <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />}
          {saving ? "Saving…" : "Add to tracker"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
