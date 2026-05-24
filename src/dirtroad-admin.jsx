import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Dirt Road Beats — Admin Song Delivery Tool
//
// HOW TO USE:
//  1. Deploy this as a separate /admin route (password-protect it in Vercel)
//  2. Fill in your real keys in the CONFIG block below
//  3. Upload the finished song to Supabase Storage, paste the signed URL here
//  4. Hit "Send Song" — customer gets a branded delivery email via Resend
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  RESEND_API_KEY: "re_YOUR_RESEND_KEY",       // get from resend.com
  FROM_EMAIL:     "songs@yourdomain.com",      // your verified sender
  FROM_NAME:      "Dirt Road Beats",
  ADMIN_PASSWORD: "changeme123",               // simple gate — use Vercel env var in prod
};

const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#f5ede0",
    fontFamily: "'DM Sans', sans-serif",
    padding: "0 0 80px",
  },
  topbar: {
    background: "#12121a",
    borderBottom: "1px solid rgba(201,168,76,.15)",
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logo: { fontFamily: "Georgia, serif", fontSize: 20, color: "#c9a84c" },
  badge: { background: "rgba(201,168,76,.12)", color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: "4px 12px", borderRadius: 50 },
  wrap: { maxWidth: 760, margin: "48px auto", padding: "0 24px" },
  card: { background: "#12121a", border: "1px solid rgba(201,168,76,.15)", borderRadius: 16, padding: 32, marginBottom: 24 },
  cardTitle: { fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", marginBottom: 6 },
  cardSub: { color: "#6b6b80", fontSize: 14, marginBottom: 28, lineHeight: 1.6 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#c9a84c", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  input: { width: "100%", background: "#1a1a26", border: "1px solid rgba(201,168,76,.2)", borderRadius: 8, padding: "12px 16px", color: "#f5ede0", fontSize: 15, outline: "none", fontFamily: "inherit", marginBottom: 20 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  btn: { background: "linear-gradient(135deg, #c9a84c, #f0d080)", border: "none", borderRadius: 50, padding: "14px 36px", color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", transition: "opacity .15s" },
  btnGhost: { background: "transparent", border: "1px solid rgba(201,168,76,.3)", borderRadius: 50, padding: "13px 28px", color: "#c9a84c", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  pill: (color) => ({ background: `${color}22`, color, fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 50, display: "inline-block" }),
  tag: { fontSize: 13, color: "#6b6b80", lineHeight: 1.8 },
};

// ── Email HTML builder ────────────────────────────────────────────────────────
function buildDeliveryEmail({ customerName, songTitle, genre, downloadUrl, expiresHours = 72 }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:16px;border:1px solid rgba(201,168,76,.2);overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1230,#0f0f1a);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎸</div>
          <div style="font-family:Georgia,serif;font-size:26px;color:#c9a84c;margin-bottom:4px;">Dirt Road Beats</div>
          <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Your Song Is Ready</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${customerName},</p>
          <p style="color:rgba(245,237,224,.7);font-size:15px;line-height:1.7;margin:0 0 32px;">
            Your custom song is finished and ready to download. We poured everything into making it exactly right for you — we hope it brings the moment to life.
          </p>

          <!-- Song info box -->
          <div style="background:#1a1a26;border-radius:12px;padding:20px 24px;margin-bottom:32px;border:1px solid rgba(201,168,76,.12);">
            <div style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Your Song</div>
            <div style="color:#fff;font-family:Georgia,serif;font-size:22px;margin-bottom:4px;">${songTitle || "Custom Song"}</div>
            ${genre ? `<div style="color:#6b6b80;font-size:13px;">${genre}</div>` : ""}
          </div>

          <!-- Download button -->
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#1a1200;text-decoration:none;font-weight:700;font-size:16px;padding:16px 48px;border-radius:50px;">
              ⬇ Download Your Song
            </a>
          </div>

          <p style="color:#6b6b80;font-size:13px;text-align:center;margin:0 0 32px;">
            This link expires in ${expiresHours} hours. Save your file after downloading.
          </p>

          <hr style="border:none;border-top:1px solid rgba(201,168,76,.1);margin:0 0 28px;" />

          <p style="color:rgba(245,237,224,.6);font-size:14px;line-height:1.7;margin:0;">
            If you have any questions or need a revision, just reply to this email and we'll take care of you. Thank you for trusting us with your story. 🎵
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(201,168,76,.08);">
          <div style="color:#6b6b80;font-size:12px;">© ${new Date().getFullYear()} Dirt Road Beats · Custom Songs Made for You</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildOrderNotificationEmail(order) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:32px;">
  <div style="background:#fff;border-radius:10px;padding:32px;max-width:600px;margin:0 auto;">
    <h2 style="color:#c9a84c;margin-top:0;">🎵 New Dirt Road Beats Order</h2>
    <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;">
      <tr><td style="color:#666;width:140px;">Order ID</td><td><strong>${order.id}</strong></td></tr>
      <tr style="background:#f9f9f9"><td style="color:#666;">Customer</td><td>${order.name} — ${order.email}</td></tr>
      <tr><td style="color:#666;">Package</td><td>${order.tier} · $${order.price}</td></tr>
      <tr style="background:#f9f9f9"><td style="color:#666;">Genre</td><td>${order.genre}</td></tr>
      <tr><td style="color:#666;">Tempo</td><td>${order.tempo}</td></tr>
      <tr style="background:#f9f9f9"><td style="color:#666;">Mood</td><td>${order.mood}</td></tr>
      <tr><td style="color:#666;">Vocals</td><td>${order.vocal}</td></tr>
      <tr style="background:#f9f9f9"><td style="color:#666;">Artist Style</td><td>${order.artistMimic || "—"}</td></tr>
      <tr><td style="color:#666;">Title/Occasion</td><td>${order.title || "—"}</td></tr>
      <tr style="background:#f9f9f9"><td style="color:#666;">Recipient</td><td>${order.recipient || "—"}</td></tr>
    </table>
    <div style="margin-top:20px;background:#f9f9f9;border-radius:8px;padding:16px;">
      <div style="color:#666;font-size:12px;font-weight:700;margin-bottom:8px;text-transform:uppercase;">Lyrics / Story Details</div>
      <div style="font-size:14px;line-height:1.7;">${order.lyrics}</div>
    </div>
    ${order.extraNotes ? `<div style="margin-top:12px;background:#fff8e6;border-radius:8px;padding:16px;border:1px solid #f0d080;">
      <div style="color:#b8860b;font-size:12px;font-weight:700;margin-bottom:8px;">EXTRA NOTES</div>
      <div style="font-size:14px;line-height:1.7;">${order.extraNotes}</div>
    </div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#999;">Log into the Dirt Road Beats Admin to deliver this song when it's ready.</p>
  </div>
</body>
</html>`;
}

// ── Send email via Resend ─────────────────────────────────────────────────────
async function sendViaResend({ to, toName, subject, html, apiKey, fromEmail, fromName }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: `${fromName} <${fromEmail}>`, to: [`${toName} <${to}>`], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Resend error");
  return data;
}

// ── Mock order database (replace with Supabase in prod) ───────────────────────
const MOCK_ORDERS = [
  { id: "SS-001", name: "Emily Carter", email: "emily@example.com", tier: "Premium", price: 89, genre: "Country", tempo: "Mid-Tempo (96–115 BPM)", mood: "Romantic", vocal: "Female lead", artistMimic: "Kacey Musgraves", title: "Golden Anniversary", recipient: "My parents", lyrics: "50 years of Saturday mornings, coffee on the porch, dancing in the kitchen to old records. They met in Shreveport in 1974.", extraNotes: "Dad's name is Bill, mom is Ruth.", status: "pending" },
  { id: "SS-002", name: "Marcus Webb", email: "marcus@example.com", tier: "Elite", price: 149, genre: "R&B / Soul", tempo: "Slow & Soulful (60–75 BPM)", mood: "Romantic", vocal: "Male lead", artistMimic: "H.E.R.", title: "Proposal Night", recipient: "Jasmine", lyrics: "Proposing at the restaurant where we had our first date. She loves the stars, astronomy, and our dog Biscuit.", extraNotes: "Must mention our dog Biscuit by name!", status: "pending" },
  { id: "SS-003", name: "Dana Price", email: "dana@example.com", tier: "Standard", price: 49, genre: "Pop", tempo: "Upbeat (116–135 BPM)", mood: "Celebratory", vocal: "Female lead", artistMimic: "Olivia Rodrigo", title: "Sweet 16", recipient: "My daughter Avery", lyrics: "Avery loves volleyball, painting sunsets, and her best friend Chloe. She's been through a tough year but is thriving.", extraNotes: "", status: "delivered" },
];

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === CONFIG.ADMIN_PASSWORD) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: 360, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>Admin Access</div>
        <div style={{ color: "#6b6b80", fontSize: 13, marginBottom: 24 }}>Dirt Road Beats Song Delivery Portal</div>
        <input
          type="password"
          style={{ ...S.input, textAlign: "center", borderColor: err ? "#e05c5c" : "rgba(201,168,76,.2)" }}
          placeholder="Enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
        />
        {err && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 12 }}>Incorrect password</div>}
        <button style={{ ...S.btn, width: "100%" }} onClick={attempt}>Enter</button>
      </div>
    </div>
  );
}

// ── Delivery Modal ────────────────────────────────────────────────────────────
function DeliveryModal({ order, onClose, onDelivered }) {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [expiresHours, setExpiresHours] = useState("72");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!downloadUrl.trim()) { setError("Paste the download URL first."); return; }
    setSending(true); setError("");
    try {
      const html = buildDeliveryEmail({
        customerName: order.name.split(" ")[0],
        songTitle: order.title || "Your Custom Song",
        genre: order.genre,
        downloadUrl,
        expiresHours: parseInt(expiresHours),
      });
      await sendViaResend({
        to: order.email,
        toName: order.name,
        subject: `🎵 Your Dirt Road Beats song is ready, ${order.name.split(" ")[0]}!`,
        html,
        apiKey: CONFIG.RESEND_API_KEY,
        fromEmail: CONFIG.FROM_EMAIL,
        fromName: CONFIG.FROM_NAME,
      });
      setSent(true);
      onDelivered(order.id);
    } catch (e) {
      setError(e.message || "Failed to send. Check your Resend API key.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...S.card, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#6b6b80", fontSize: 20, cursor: "pointer" }}>✕</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>Song Delivered!</div>
            <div style={{ color: "#6b6b80", fontSize: 14, marginBottom: 24 }}>
              Email sent to <strong style={{ color: "#c9a84c" }}>{order.email}</strong>
            </div>
            <button style={S.btn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={S.cardTitle}>Deliver Song</div>
            <div style={S.cardSub}>Send the finished song download link to the customer.</div>

            {/* Order summary */}
            <div style={{ background: "#1a1a26", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, marginBottom: 2 }}>{order.name}</div>
                  <div style={{ color: "#6b6b80", fontSize: 13 }}>{order.email}</div>
                </div>
                <div style={S.pill("#c9a84c")}>{order.tier}</div>
              </div>
              <div style={{ marginTop: 10, color: "#6b6b80", fontSize: 13 }}>
                {order.genre} · {order.mood} · {order.vocal}
                {order.artistMimic && ` · Like ${order.artistMimic}`}
              </div>
              {order.title && <div style={{ color: "#f5ede0", fontSize: 14, marginTop: 6 }}>"{order.title}"</div>}
            </div>

            <div>
              <label style={S.label}>Download URL (from Supabase Storage)</label>
              <input
                style={{ ...S.input, borderColor: error ? "#e05c5c" : "rgba(201,168,76,.2)" }}
                placeholder="https://xyz.supabase.co/storage/v1/object/sign/songs/..."
                value={downloadUrl}
                onChange={e => setDownloadUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={S.label}>Link Expires After</label>
              <select style={{ ...S.input, appearance: "none" }} value={expiresHours} onChange={e => setExpiresHours(e.target.value)}>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">72 hours (recommended)</option>
                <option value="168">7 days</option>
              </select>
            </div>

            {error && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 16, background: "rgba(224,92,92,.1)", padding: "10px 14px", borderRadius: 8 }}>{error}</div>}

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button style={S.btnGhost} onClick={onClose}>Cancel</button>
              <button
                style={{ ...S.btn, display: "flex", alignItems: "center", gap: 10, opacity: sending ? .7 : 1 }}
                onClick={send}
                disabled={sending}
              >
                {sending ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid #1a1200", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Sending…</>
                ) : "📧 Send Download Email"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Copy Block ────────────────────────────────────────────────────────────────
function CopyBlock({ brief }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };
  return (
    <div style={{ background: "#1a110a", border: "1px solid rgba(212,133,74,.25)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid rgba(212,133,74,.15)", background: "rgba(212,133,74,.06)" }}>
        <div style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          📋 Song Brief — Copy &amp; Paste into Suno
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "rgba(76,175,109,.15)" : "rgba(201,168,76,.15)",
            border: `1px solid ${copied ? "#4caf7d" : "rgba(201,168,76,.4)"}`,
            borderRadius: 50, padding: "6px 18px",
            color: copied ? "#4caf7d" : "#c9a84c",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", transition: "all .2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {copied ? "✓ Copied!" : "⎘ Copy All"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px 18px", color: "#f0e0cc", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit" }}>
        {brief}
      </pre>
    </div>
  );
}

// ── Order detail panel ────────────────────────────────────────────────────────
function OrderDetail({ order, onClose, onDeliver }) {
  const brief = [
    `GENRE: ${order.genre}`,
    `TEMPO: ${order.tempo}`,
    `MOOD: ${order.mood}`,
    `VOCALS: ${order.vocal}`,
    order.artistMimic ? `ARTIST STYLE: ${order.artistMimic}` : null,
    order.title       ? `OCCASION: ${order.title}` : null,
    order.recipient   ? `FOR: ${order.recipient}` : null,
    ``,
    `SONG DETAILS:`,
    order.lyrics,
    order.extraNotes  ? `\nEXTRA NOTES:\n${order.extraNotes}` : null,
  ].filter(Boolean).join("\n");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...S.card, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#6b6b80", fontSize: 20, cursor: "pointer" }}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div>
            <div style={S.cardTitle}>{order.name}</div>
            <div style={{ color: "#6b6b80", fontSize: 13 }}>{order.id} · {order.email}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={S.pill(order.status === "delivered" ? "#4caf7d" : "#c9a84c")}>
              {order.status === "delivered" ? "✓ Delivered" : "⏳ Pending"}
            </span>
          </div>
        </div>

        <CopyBlock brief={brief} />

        {order.status !== "delivered" && (
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button style={S.btn} onClick={() => onDeliver(order)}>📧 Deliver Song →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Admin App ────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliverOrder, setDeliverOrder] = useState(null);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const markDelivered = (id) => {
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: "delivered" } : ord));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const pending   = orders.filter(o => o.status === "pending").length;
  const delivered = orders.filter(o => o.status === "delivered").length;

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Topbar */}
      <div style={S.topbar}>
        <span style={S.logo}>🎸 Dirt Road Beats</span>
        <span style={S.badge}>ADMIN</span>
        <span style={{ marginLeft: "auto", color: "#6b6b80", fontSize: 13 }}>Song Delivery Portal</span>
      </div>

      <div style={S.wrap}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Orders", value: orders.length, color: "#fff" },
            { label: "Pending Delivery", value: pending, color: "#c9a84c" },
            { label: "Delivered", value: delivered, color: "#4caf7d" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...S.card, textAlign: "center", padding: "24px 16px", marginBottom: 0 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color, fontFamily: "Georgia,serif" }}>{value}</div>
              <div style={{ color: "#6b6b80", fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["all", "pending", "delivered"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "linear-gradient(135deg,#c9a84c,#f0d080)" : "transparent",
                border: filter === f ? "none" : "1px solid rgba(201,168,76,.2)",
                borderRadius: 50, padding: "8px 20px",
                color: filter === f ? "#1a1200" : "#c9a84c",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? `All (${orders.length})` : f === "pending" ? `Pending (${pending})` : `Delivered (${delivered})`}
            </button>
          ))}
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", padding: 48, color: "#6b6b80" }}>No orders in this category.</div>
        ) : (
          filtered.map(order => (
            <div key={order.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.15)"}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{order.name}</span>
                  <span style={S.pill(order.status === "delivered" ? "#4caf7d" : "#c9a84c")}>
                    {order.status === "delivered" ? "✓ Delivered" : "⏳ Pending"}
                  </span>
                </div>
                <div style={{ color: "#6b6b80", fontSize: 13 }}>
                  {order.id} · {order.genre} · {order.mood}
                  {order.artistMimic ? ` · Like ${order.artistMimic}` : ""}
                  {order.title ? ` · "${order.title}"` : ""}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: "#c9a84c", fontWeight: 700, fontSize: 17 }}>${order.price}</div>
                <div style={{ color: "#6b6b80", fontSize: 12 }}>{order.tier}</div>
              </div>
              {order.status === "pending" && (
                <button
                  style={{ ...S.btn, padding: "10px 20px", fontSize: 13, flexShrink: 0 }}
                  onClick={e => { e.stopPropagation(); setDeliverOrder(order); }}
                >
                  Deliver →
                </button>
              )}
            </div>
          ))
        )}

        {/* Setup instructions */}
        <div style={{ ...S.card, marginTop: 32, borderColor: "rgba(123,79,207,.3)" }}>
          <div style={{ color: "#7b4fcf", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Setup Checklist</div>
          {[
            ["1", "Create a free account at resend.com and verify your sending domain"],
            ["2", "Add RESEND_API_KEY and FROM_EMAIL to your Vercel environment variables"],
            ["3", "Create a Supabase project → Storage → New bucket called 'songs' (private)"],
            ["4", "Upload finished MP3/WAV to the songs bucket → Get Signed URL → Paste into Deliver modal"],
            ["5", "Password-protect this /admin route in Vercel using middleware or a simple env-var check"],
          ].map(([n, text]) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(123,79,207,.2)", color: "#7b4fcf", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
              <div style={{ color: "rgba(245,237,224,.7)", fontSize: 14, lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && !deliverOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDeliver={(o) => { setSelectedOrder(null); setDeliverOrder(o); }}
        />
      )}
      {deliverOrder && (
        <DeliveryModal
          order={deliverOrder}
          onClose={() => setDeliverOrder(null)}
          onDelivered={(id) => { markDelivered(id); setDeliverOrder(null); }}
        />
      )}
    </div>
  );
}
