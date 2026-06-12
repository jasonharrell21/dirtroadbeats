import { useState, useRef, useEffect } from "react";

const CONFIG = {
  RESEND_API_KEY: "re_YOUR_RESEND_KEY",
  FROM_EMAIL:     "songs@yourdomain.com",
  FROM_NAME:      "Dirt Road Beats",
  ADMIN_PASSWORD: "changeme123",
};

const S = {
  page: { minHeight: "100vh", background: "#0a0a0f", color: "#f5ede0", fontFamily: "'DM Sans', sans-serif", padding: "0 0 80px" },
  topbar: { background: "#12121a", borderBottom: "1px solid rgba(201,168,76,.15)", padding: "18px 40px", display: "flex", alignItems: "center", gap: 14 },
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

function buildDeliveryEmail({ customerName, songTitle, genre, downloadUrl, expiresHours = 72 }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:16px;border:1px solid rgba(201,168,76,.2);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#1a1230,#0f0f1a);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎸</div>
          <div style="font-family:Georgia,serif;font-size:26px;color:#c9a84c;margin-bottom:4px;">Dirt Road Beats</div>
          <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Your Song Is Ready</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${customerName},</p>
          <p style="color:rgba(245,237,224,.7);font-size:15px;line-height:1.7;margin:0 0 32px;">Your custom song is finished and ready to download. We poured everything into making it exactly right for you.</p>
          <div style="background:#1a1a26;border-radius:12px;padding:20px 24px;margin-bottom:32px;border:1px solid rgba(201,168,76,.12);">
            <div style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Your Song</div>
            <div style="color:#fff;font-family:Georgia,serif;font-size:22px;margin-bottom:4px;">${songTitle || "Custom Song"}</div>
            ${genre ? `<div style="color:#6b6b80;font-size:13px;">${genre}</div>` : ""}
          </div>
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#1a1200;text-decoration:none;font-weight:700;font-size:16px;padding:16px 48px;border-radius:50px;">⬇ Download Your Song</a>
          </div>
          <p style="color:#6b6b80;font-size:13px;text-align:center;margin:0 0 32px;">This link expires in ${expiresHours} hours. Save your file after downloading.</p>
          <hr style="border:none;border-top:1px solid rgba(201,168,76,.1);margin:0 0 28px;" />
          <p style="color:rgba(245,237,224,.6);font-size:14px;line-height:1.7;margin:0;">If you have any questions or need a revision, just reply to this email. 🎵</p>
        </td></tr>
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
    ${order.extraNotes ? `<div style="margin-top:12px;background:#fff8e6;border-radius:8px;padding:16px;border:1px solid #f0d080;"><div style="color:#b8860b;font-size:12px;font-weight:700;margin-bottom:8px;">EXTRA NOTES</div><div style="font-size:14px;line-height:1.7;">${order.extraNotes}</div></div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#999;">Log into the Dirt Road Beats Admin to deliver this song when it's ready.</p>
  </div>
</body>
</html>`;
}

async function sendViaResend({ to, toName, subject, html }) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, toName, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Email send failed");
  return data;
}

const SUPABASE_URL = "https://fonqowbipddufdrekwab.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

async function fetchOrders() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc`, {
    headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order_id=eq.${orderId}`, {
    method: "PATCH",
    headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order");
}

async function getSignedUploadUrl(fileName, contentType) {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!res.ok) throw new Error("Could not get upload URL. Check server logs.");
  const data = await res.json();
  return data.signedUrl;
}

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
        <input type="password" style={{ ...S.input, textAlign: "center", borderColor: err ? "#e05c5c" : "rgba(201,168,76,.2)" }} placeholder="Enter password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} />
        {err && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 12 }}>Incorrect password</div>}
        <button style={{ ...S.btn, width: "100%" }} onClick={attempt}>Enter</button>
      </div>
    </div>
  );
}

// ── Shared file upload box (mobile-safe label wrapper) ──
function FileUploadBox({ label, sublabel, file, onFile, dragging, onDragOver, onDragLeave }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>}
      {sublabel && <div style={{ color: "#6b6b80", fontSize: 12, marginBottom: 8 }}>{sublabel}</div>}
      <label style={{ display: "block", cursor: "pointer" }}>
        <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" style={{ display: "none" }}
          onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
        <div onDragOver={e => { e.preventDefault(); onDragOver && onDragOver(); }}
          onDragLeave={() => onDragLeave && onDragLeave()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); onDragLeave && onDragLeave(); }}
          style={{ border: `2px dashed ${dragging ? "#c9a84c" : file ? "#4caf7d" : "rgba(201,168,76,.3)"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: dragging ? "rgba(201,168,76,.06)" : file ? "rgba(76,175,109,.06)" : "rgba(201,168,76,.02)", transition: "all .2s" }}>
          {file ? (
            <><div style={{ fontSize: 30, marginBottom: 8 }}>🎵</div><div style={{ color: "#4caf7d", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{file.name}</div><div style={{ color: "#6b6b80", fontSize: 12 }}>{(file.size/1024/1024).toFixed(1)} MB · Tap to change</div></>
          ) : (
            <><div style={{ fontSize: 30, marginBottom: 8 }}>📂</div><div style={{ color: "#c9a84c", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>Tap to select file</div><div style={{ color: "#6b6b80", fontSize: 12 }}>WAV or MP3 · phone and desktop</div></>
          )}
        </div>
      </label>
    </div>
  );
}

// ── Upload helper ──
async function uploadFile(file, prefix, orderId) {
  const ext = file.name.split(".").pop().toLowerCase();
  const fileName = `${prefix}-${orderId}-${Date.now()}.${ext}`;
  const contentType = file.type || (ext === "mp3" ? "audio/mpeg" : "audio/wav");
  const signedUrl = await getSignedUploadUrl(fileName, contentType);
  const res = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: file });
  if (!res.ok) throw new Error("Upload failed — check Supabase storage settings.");
  return `${SUPABASE_URL}/storage/v1/object/public/Songs/${fileName}`;
}

// ── Sample email builder ──
function buildSampleEmail({ firstName, songTitle, genre, playerPageUrl, buyUrl, customerEmail }) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0d0a07;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#1c1410;border-radius:16px;border:1px solid rgba(212,133,74,.2);overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#2a1208,#0d0a07);padding:40px 40px 32px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">🎵</div>
        <div style="font-family:Georgia,serif;font-size:26px;color:#d4854a;margin-bottom:4px;">Dirt Road Beats</div>
        <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Your Sample Is Ready</div>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${firstName},</p>
        <p style="color:rgba(245,237,224,.8);font-size:15px;line-height:1.7;margin:0 0 24px;">Your 30-second custom song sample is ready. Tap the button below to hear it — plays right in your browser, no download needed.</p>
        <div style="background:#261d15;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid rgba(212,133,74,.15);text-align:center;">
          <div style="color:#d4854a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">🎵 ${songTitle || "Your Custom Song"}</div>
          <div style="color:#7a6050;font-size:13px;margin-bottom:20px;">${genre} · 30-Second Preview</div>
          <a href="${playerPageUrl}" style="display:inline-block;background:linear-gradient(135deg,#d4854a,#edb87a);color:#1a0d05;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;">▶ Play Your Sample</a>
          <p style="color:#5a4030;font-size:11px;margin:12px 0 0;">🔒 Protected 30-second preview</p>
        </div>
        <div style="text-align:center;margin-bottom:28px;">
          <p style="color:#e0cdb8;font-size:15px;margin-bottom:6px;">Love what you hear? Get the full song.</p>
          <p style="color:#7a6050;font-size:12px;margin-bottom:20px;">Choose your version below.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding:0 6px 12px;">
                <a href="https://buy.stripe.com/00weV7f755pg2YygiegMw00?prefilled_email=${encodeURIComponent(customerEmail)}" style="display:inline-block;background:linear-gradient(135deg,#d4854a,#edb87a);color:#1a0d05;text-decoration:none;font-weight:700;font-size:14px;padding:14px 24px;border-radius:50px;">🎸 One Version — $179.99</a>
              </td>
              <td style="padding:0 6px 12px;">
                <a href="https://buy.stripe.com/9B600d3oncRI56Gc1YgMw01?prefilled_email=${encodeURIComponent(customerEmail)}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#1a1200;text-decoration:none;font-weight:700;font-size:14px;padding:14px 24px;border-radius:50px;">🎶 Two Versions — $199.99</a>
              </td>
            </tr>
          </table>
          <p style="color:#5a4030;font-size:11px;margin-top:4px;">Two Versions = two unique takes on your song. Pick your favorite or keep both.</p>
        </div>
        <p style="color:rgba(245,237,224,.5);font-size:13px;line-height:1.7;text-align:center;">Questions? Just reply to this email.</p>
      </td></tr>
      <tr><td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(212,133,74,.08);">
        <div style="color:#3a2a1a;font-size:12px;">© ${new Date().getFullYear()} Dirt Road Beats · Custom Songs Made for You</div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

// ── Full song email builder ──
function buildFullSongEmail({ firstName, songTitle, genre, downloadUrls, isTwoVersions }) {
  const btn = `display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#1a1200;text-decoration:none;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;margin:8px;`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:16px;border:1px solid rgba(201,168,76,.2);overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#1a1230,#0f0f1a);padding:40px 40px 32px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">🎸</div>
        <div style="font-family:Georgia,serif;font-size:26px;color:#c9a84c;margin-bottom:4px;">Dirt Road Beats</div>
        <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Your Song${isTwoVersions ? "s Are" : " Is"} Ready</div>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${firstName},</p>
        <p style="color:rgba(245,237,224,.7);font-size:15px;line-height:1.7;margin:0 0 32px;">Your full custom song${isTwoVersions ? "s are" : " is"} finished and ready to download. ${isTwoVersions ? "You ordered two versions — both are included below." : "We poured everything into making it exactly right for you."}</p>
        <div style="background:#1a1a26;border-radius:12px;padding:20px 24px;margin-bottom:32px;border:1px solid rgba(201,168,76,.12);">
          <div style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Your Song${isTwoVersions ? "s" : ""}</div>
          <div style="color:#fff;font-family:Georgia,serif;font-size:22px;margin-bottom:4px;">${songTitle || "Custom Song"}</div>
          ${genre ? `<div style="color:#6b6b80;font-size:13px;">${genre}</div>` : ""}
        </div>
        <div style="text-align:center;margin-bottom:32px;">
          ${isTwoVersions
            ? `<p style="color:#c9a84c;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Download Both Versions</p><a href="${downloadUrls[0]}" style="${btn}">⬇ Version 1</a><a href="${downloadUrls[1]}" style="${btn}">⬇ Version 2</a>`
            : `<a href="${downloadUrls[0]}" style="${btn}">⬇ Download Your Song</a>`}
        </div>
        <p style="color:#6b6b80;font-size:13px;text-align:center;margin:0 0 32px;">Save your file after downloading — this link does not expire.</p>
        <hr style="border:none;border-top:1px solid rgba(201,168,76,.1);margin:0 0 28px;" />
        <p style="color:rgba(245,237,224,.6);font-size:14px;line-height:1.7;margin:0;">Questions or need a revision? Just reply to this email. 🎵</p>
      </td></tr>
      <tr><td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(201,168,76,.08);">
        <div style="color:#6b6b80;font-size:12px;">© ${new Date().getFullYear()} Dirt Road Beats · Custom Songs Made for You</div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function DeliveryModal({ order, onClose, onDelivered }) {
  const isTwoVersions = order.tier && order.tier.toLowerCase().includes("two");
  const buyUrl = isTwoVersions
    ? "https://buy.stripe.com/9B600d3oncRI56Gc1YgMw01"
    : "https://buy.stripe.com/00weV7f755pg2YygiegMw00";

  const [step, setStep] = useState("sample");
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleDragging, setSampleDragging] = useState(false);
  const [sampleDone, setSampleDone] = useState(false);
  const [fullFile1, setFullFile1] = useState(null);
  const [fullFile2, setFullFile2] = useState(null);
  const [fullDragging1, setFullDragging1] = useState(false);
  const [fullDragging2, setFullDragging2] = useState(false);
  const [fullDone, setFullDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState("");
  const [error, setError] = useState("");

  const firstName = order.name.split(" ")[0];

  const sendSample = async () => {
    if (!sampleFile) { setError("Select a file first."); return; }
    setBusy(true); setError(""); setBusyMsg("Uploading song…");
    try {
      const fileUrl = await uploadFile(sampleFile, "sample", order.id);
      const playerParams = new URLSearchParams({
        file: fileUrl,
        title: order.title || "Your Custom Song",
        genre: order.genre || "Country",
        buy: buyUrl,
        email: order.email,
      });
      const playerPageUrl = `https://www.dirtroadbeats.com/player?${playerParams.toString()}`;
      setBusyMsg("Sending email…");
      const html = buildSampleEmail({ firstName, songTitle: order.title, genre: order.genre, playerPageUrl, buyUrl, customerEmail: order.email });
      await sendViaResend({ to: order.email, toName: order.name, subject: `🎵 Your Dirt Road Beats sample is ready, ${firstName}!`, html });
      await updateOrderStatus(order.id, "sample_delivered");
      setBusy(false); setSampleDone(true);
      onDelivered(order.id);
    } catch (e) { setBusy(false); setError(e.message || "Something went wrong."); }
  };

  const sendFull = async () => {
    if (!fullFile1) { setError("Select the song file first."); return; }
    if (isTwoVersions && !fullFile2) { setError("Select both version files."); return; }
    setBusy(true); setError(""); setBusyMsg("Uploading song…");
    try {
      const url1 = await uploadFile(fullFile1, "full", order.id);
      let url2 = null;
      if (isTwoVersions) { setBusyMsg("Uploading version 2…"); url2 = await uploadFile(fullFile2, "full2", order.id); }
      setBusyMsg("Sending email…");
      const downloadUrls = isTwoVersions ? [url1, url2] : [url1];
      const html = buildFullSongEmail({ firstName, songTitle: order.title, genre: order.genre, downloadUrls, isTwoVersions });
      await sendViaResend({ to: order.email, toName: order.name, subject: `🎸 Your Dirt Road Beats song${isTwoVersions ? "s are" : " is"} ready, ${firstName}!`, html });
      await updateOrderStatus(order.id, "delivered");
      setBusy(false); setFullDone(true);
      onDelivered(order.id);
    } catch (e) { setBusy(false); setError(e.message || "Something went wrong."); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ ...S.card, width: "100%", maxWidth: 560, position: "relative", margin: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#6b6b80", fontSize: 20, cursor: "pointer" }}>✕</button>

        {/* Order header */}
        <div style={{ background: "#1a1a26", borderRadius: 10, padding: "14px 18px", marginBottom: 24, border: "1px solid rgba(201,168,76,.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{order.name}</div>
              <div style={{ color: "#6b6b80", fontSize: 13 }}>{order.email}</div>
            </div>
            <span style={S.pill("#c9a84c")}>{order.tier}</span>
          </div>
          {order.title && <div style={{ color: "#c9a84c", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>"{order.title}"</div>}
        </div>

        {/* Step tabs */}
        <div style={{ display: "flex", marginBottom: 24, border: "1px solid rgba(201,168,76,.2)", borderRadius: 10, overflow: "hidden" }}>
          {[["sample", "🎵 Send Sample"], ["full", "🎸 Send Full Song"]].map(([id, label]) => (
            <button key={id} onClick={() => { setStep(id); setError(""); }}
              style={{ flex: 1, padding: "12px 8px", background: step === id ? "linear-gradient(135deg,#c9a84c,#f0d080)" : "#1a1a26", color: step === id ? "#1a1200" : "#6b6b80", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>

        {/* SAMPLE STEP */}
        {step === "sample" && (sampleDone ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#c9a84c", marginBottom: 8 }}>Sample Sent!</div>
            <div style={{ color: "#b09880", fontSize: 14, marginBottom: 16 }}>30-second protected preview emailed to <strong style={{ color: "#c9a84c" }}>{order.email}</strong></div>
            <div style={{ color: "#6b6b80", fontSize: 13, marginBottom: 24 }}>When they purchase, use the <strong style={{ color: "#f5ede0" }}>Send Full Song</strong> tab.</div>
            <button style={S.btn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div style={S.cardTitle}>Send 30-Second Sample</div>
            <div style={S.cardSub}>Upload the full song — the customer only hears the first 30 seconds in a protected browser player. Includes a buy button.</div>
            <FileUploadBox label="Upload Full Song (protected to 30 sec)" file={sampleFile} onFile={setSampleFile} dragging={sampleDragging} onDragOver={() => setSampleDragging(true)} onDragLeave={() => setSampleDragging(false)} />
            {busy && step === "sample" && (
              <div style={{ background: "#1a1a26", borderRadius: 10, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, height: 20, border: "2px solid rgba(201,168,76,.2)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />
                <div style={{ color: "#c9a84c", fontSize: 14 }}>{busyMsg}</div>
              </div>
            )}
            {error && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 16, background: "rgba(224,92,92,.1)", padding: "12px 16px", borderRadius: 8 }}>⚠️ {error}</div>}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button style={S.btnGhost} onClick={onClose} disabled={busy}>Cancel</button>
              <button style={{ ...S.btn, opacity: (busy || !sampleFile) ? .6 : 1 }} onClick={sendSample} disabled={busy || !sampleFile}>
                {busy ? busyMsg : "📧 Send Sample to Customer"}
              </button>
            </div>
          </>
        ))}

        {/* FULL SONG STEP */}
        {step === "full" && (fullDone ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎸</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#c9a84c", marginBottom: 8 }}>Song{isTwoVersions ? "s" : ""} Delivered!</div>
            <div style={{ color: "#b09880", fontSize: 14, marginBottom: 20 }}>Download link{isTwoVersions ? "s" : ""} sent to <strong style={{ color: "#c9a84c" }}>{order.email}</strong></div>
            <button style={S.btn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div style={S.cardTitle}>Send Full Song{isTwoVersions ? "s" : ""}</div>
            <div style={S.cardSub}>{isTwoVersions ? "Upload both versions — customer gets download links for both in one email." : "Upload the finished song — customer gets a direct download link."}</div>
            <FileUploadBox label={isTwoVersions ? "Version 1" : "Full Song (WAV or MP3)"} sublabel={isTwoVersions ? "First version" : null} file={fullFile1} onFile={setFullFile1} dragging={fullDragging1} onDragOver={() => setFullDragging1(true)} onDragLeave={() => setFullDragging1(false)} />
            {isTwoVersions && <FileUploadBox label="Version 2" sublabel="Second version" file={fullFile2} onFile={setFullFile2} dragging={fullDragging2} onDragOver={() => setFullDragging2(true)} onDragLeave={() => setFullDragging2(false)} />}
            {busy && step === "full" && (
              <div style={{ background: "#1a1a26", borderRadius: 10, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, height: 20, border: "2px solid rgba(201,168,76,.2)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />
                <div style={{ color: "#c9a84c", fontSize: 14 }}>{busyMsg}</div>
              </div>
            )}
            {error && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 16, background: "rgba(224,92,92,.1)", padding: "12px 16px", borderRadius: 8 }}>⚠️ {error}</div>}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button style={S.btnGhost} onClick={onClose} disabled={busy}>Cancel</button>
              <button style={{ ...S.btn, opacity: (busy || !fullFile1 || (isTwoVersions && !fullFile2)) ? .6 : 1 }} onClick={sendFull} disabled={busy || !fullFile1 || (isTwoVersions && !fullFile2)}>
                {busy ? busyMsg : `🎸 Send Full Song${isTwoVersions ? "s" : ""} to Customer`}
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

function CopyBlock({ brief }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(brief).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };
  return (
    <div style={{ background: "#1a110a", border: "1px solid rgba(212,133,74,.25)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid rgba(212,133,74,.15)", background: "rgba(212,133,74,.06)" }}>
        <div style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>📋 Song Brief — Copy &amp; Paste into Suno</div>
        <button onClick={handleCopy} style={{ background: copied ? "rgba(76,175,109,.15)" : "rgba(201,168,76,.15)", border: `1px solid ${copied ? "#4caf7d" : "rgba(201,168,76,.4)"}`, borderRadius: 50, padding: "6px 18px", color: copied ? "#4caf7d" : "#c9a84c", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", display: "flex", alignItems: "center", gap: 6 }}>
          {copied ? "✓ Copied!" : "⎘ Copy All"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px 18px", color: "#f0e0cc", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit" }}>{brief}</pre>
    </div>
  );
}

function OrderDetail({ order, onClose, onDeliver }) {
  const brief = [
    `GENRE: ${order.genre}`, `TEMPO: ${order.tempo}`, `MOOD: ${order.mood}`, `VOCALS: ${order.vocal}`,
    order.artistMimic ? `ARTIST STYLE: ${order.artistMimic}` : null,
    order.title ? `OCCASION: ${order.title}` : null,
    order.recipient ? `FOR: ${order.recipient}` : null,
    ``, `SONG DETAILS:`, order.lyrics,
    order.extraNotes ? `\nEXTRA NOTES:\n${order.extraNotes}` : null,
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
            <span style={S.pill(order.status === "delivered" || order.status === "sample_delivered" ? "#4caf7d" : "#c9a84c")}>
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

function SamplesManager() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadGenre, setUploadGenre] = useState("Country");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const GENRES = ["Country","R&B / Soul","Pop","Hip-Hop","Rock","Folk / Acoustic","Gospel","Blues","Other"];

  const loadSamples = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/samples?order=created_at.desc`, {
        headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
      });
      const data = await res.json();
      setSamples(Array.isArray(data) ? data : []);
    } catch(e) { setError("Failed to load samples."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSamples(); }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".wav") || file.name.endsWith(".mp3"))) {
      setPendingFile(file); setUploadName(file.name.replace(/\.(wav|mp3)$/i, "")); setError("");
    } else { setError("Please drop a WAV or MP3 file."); }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setPendingFile(file); setUploadName(file.name.replace(/\.(wav|mp3)$/i, "")); setError(""); }
  };

  const uploadSample = async () => {
    if (!pendingFile || !uploadName.trim()) { setError("Please provide a song name."); return; }
    setUploading(true); setError(""); setSuccess("");
    try {
      const ext = pendingFile.name.split(".").pop();
      const fileName = `sample-${Date.now()}.${ext}`;
      const contentType = pendingFile.type || "audio/wav";
      const signedUrl = await getSignedUploadUrl(fileName, contentType);
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: pendingFile,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const url = `${SUPABASE_URL}/storage/v1/object/public/Songs/${fileName}`;
      const saveRes = await fetch(`${SUPABASE_URL}/rest/v1/samples`, {
        method: "POST",
        headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({ title: uploadName.trim(), genre: uploadGenre, url }),
      });
      if (!saveRes.ok) throw new Error("Failed to save sample");
      setSuccess(`"${uploadName}" added to the home page!`);
      setPendingFile(null); setUploadName(""); setUploadGenre("Country");
      loadSamples();
    } catch(e) { setError(e.message || "Upload failed."); }
    finally { setUploading(false); }
  };

  const deleteSample = async (id, title) => {
    if (!confirm(`Remove "${title}" from the home page?`)) return;
    await fetch(`${SUPABASE_URL}/rest/v1/samples?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
    });
    loadSamples();
  };

  return (
    <div>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#d4854a", marginBottom: 6 }}>Sample Songs</div>
      <div style={{ color: "#b09880", fontSize: 14, marginBottom: 24 }}>Drag & drop songs here to add them to the home page.</div>
      <div style={S.card}>
        <div style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Add New Sample</div>
        <label style={{ display: "block", marginBottom: 16, cursor: "pointer" }}>
          <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" style={{ display: "none" }} onChange={handleFileSelect} />
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
            style={{ border: `2px dashed ${dragging ? "#c9a84c" : pendingFile ? "#4caf7d" : "rgba(201,168,76,.3)"}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", background: dragging ? "rgba(201,168,76,.05)" : pendingFile ? "rgba(76,175,109,.05)" : "transparent", transition: "all .2s" }}>
            {pendingFile ? (
              <><div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div><div style={{ color: "#4caf7d", fontWeight: 600 }}>{pendingFile.name}</div><div style={{ color: "#6b6b80", fontSize: 12, marginTop: 4 }}>{(pendingFile.size/1024/1024).toFixed(1)} MB · Tap to change</div></>
            ) : (
              <><div style={{ fontSize: 28, marginBottom: 8 }}>📂</div><div style={{ color: "#c9a84c", fontWeight: 600 }}>{dragging ? "Drop it!" : "Tap to select WAV or MP3"}</div><div style={{ color: "#6b6b80", fontSize: 12, marginTop: 4 }}>works on phone and desktop</div></>
            )}
          </div>
        </label>
        {pendingFile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><label style={S.label}>Song Title</label><input style={S.input} value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="e.g. Spring Bayou" /></div>
            <div><label style={S.label}>Genre</label><select style={{ ...S.input, appearance: "none" }} value={uploadGenre} onChange={e => setUploadGenre(e.target.value)}>{GENRES.map(g => <option key={g}>{g}</option>)}</select></div>
          </div>
        )}
        {error && <div style={{ color: "#e05c5c", fontSize: 13, marginBottom: 12, background: "rgba(224,92,92,.1)", padding: "10px 14px", borderRadius: 8 }}>⚠️ {error}</div>}
        {success && <div style={{ color: "#4caf7d", fontSize: 13, marginBottom: 12, background: "rgba(76,175,109,.1)", padding: "10px 14px", borderRadius: 8 }}>✅ {success}</div>}
        {pendingFile && <button style={{ ...S.btn, opacity: uploading ? .7 : 1 }} onClick={uploadSample} disabled={uploading}>{uploading ? "Uploading…" : "🎸 Add to Home Page"}</button>}
      </div>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#fff", marginBottom: 14 }}>Currently on Home Page ({samples.length})</div>
      {loading ? (
        <div style={{ ...S.card, textAlign: "center", padding: 32, color: "#6b6b80" }}>Loading…</div>
      ) : samples.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", padding: 32, color: "#6b6b80" }}>No samples yet — upload one above!</div>
      ) : (
        samples.map(s => (
          <div key={s.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 24 }}>🎵</div>
            <div style={{ flex: 1 }}><div style={{ color: "#fff", fontWeight: 600 }}>{s.title}</div><div style={{ color: "#6b6b80", fontSize: 13 }}>{s.genre}</div></div>
            <button onClick={() => deleteSample(s.id, s.title)} style={{ background: "rgba(224,92,92,.1)", border: "1px solid rgba(224,92,92,.3)", borderRadius: 50, padding: "6px 16px", color: "#e05c5c", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliverOrder, setDeliverOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data.map(o => ({
        id: o.order_id, name: o.name, email: o.email, tier: o.tier_name, price: o.price,
        genre: o.genre, tempo: o.tempo, mood: o.mood, vocal: o.vocal, artistMimic: o.artist_mimic,
        title: o.title, recipient: o.recipient, lyrics: o.lyrics, extraNotes: o.extra_notes,
        status: o.status, date: new Date(o.created_at).toLocaleDateString(),
      })));
    } catch (e) { console.error("Failed to load orders:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (authed) loadOrders(); }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const markDelivered = async (id) => {
    await updateOrderStatus(id, "delivered");
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: "delivered" } : ord));
  };

  const deleteOrder = async (id, name) => {
    if (!window.confirm(`Delete order for ${name}? This cannot be undone.`)) return;
    await fetch(`${SUPABASE_URL}/rest/v1/orders?order_id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
    });
    setOrders(o => o.filter(ord => ord.id !== id));
  };

  const filtered = filter === "all" ? orders : filter === "pending" ? orders.filter(o => ["pending","pending_payment","sample_requested","sample_delivered"].includes(o.status)) : orders.filter(o => o.status === filter);
  const pending = orders.filter(o => ["pending","pending_payment","sample_requested"].includes(o.status)).length;
  const delivered = orders.filter(o => o.status === "delivered" || o.status === "sample_delivered").length;

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.topbar}>
        <span style={S.logo}>🎸 Dirt Road Beats</span>
        <span style={S.badge}>ADMIN</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {tab === "orders" && <button onClick={loadOrders} style={{ background: "rgba(201,168,76,.15)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 50, padding: "6px 16px", color: "#c9a84c", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{loading ? "Loading…" : "⟳ Refresh"}</button>}
          <span style={{ color: "#6b6b80", fontSize: 13 }}>Song Delivery Portal</span>
        </span>
      </div>
      <div style={{ background: "#12121a", borderBottom: "1px solid rgba(201,168,76,.1)", display: "flex" }}>
        {[["orders","📋 Orders"],["samples","🎵 Sample Songs"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", borderBottom: tab === id ? "2px solid #c9a84c" : "2px solid transparent", padding: "14px 28px", color: tab === id ? "#c9a84c" : "#6b6b80", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>
      <div style={S.wrap}>
        {tab === "orders" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {[{ label: "Total Orders", value: orders.length, color: "#fff" }, { label: "Pending Delivery", value: pending, color: "#c9a84c" }, { label: "Delivered", value: delivered, color: "#4caf7d" }].map(({ label, value, color }) => (
                <div key={label} style={{ ...S.card, textAlign: "center", padding: "24px 16px", marginBottom: 0 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color, fontFamily: "Georgia,serif" }}>{value}</div>
                  <div style={{ color: "#6b6b80", fontSize: 13, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {["all","pending","delivered"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "linear-gradient(135deg,#c9a84c,#f0d080)" : "transparent", border: filter === f ? "none" : "1px solid rgba(201,168,76,.2)", borderRadius: 50, padding: "8px 20px", color: filter === f ? "#1a1200" : "#c9a84c", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                  {f === "all" ? `All (${orders.length})` : f === "pending" ? `Pending (${pending})` : `Delivered (${delivered})`}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", padding: 48, color: "#6b6b80" }}>No orders in this category.</div>
            ) : (
              filtered.map(order => (
                <div key={order.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "border-color .15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.15)"}
                  onClick={() => setSelectedOrder(order)}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: order.status === "delivered" || order.status === "sample_delivered" ? "#4caf7d" : "#c9a84c", boxShadow: ["pending","pending_payment","sample_requested"].includes(order.status) ? "0 0 6px #c9a84c" : "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{order.name}</span>
                      <span style={S.pill(order.status === "delivered" || order.status === "sample_delivered" ? "#4caf7d" : "#c9a84c")}>{order.status === "delivered" ? "✓ Delivered" : "⏳ Pending"}</span>
                    </div>
                    <div style={{ color: "#6b6b80", fontSize: 13 }}>{order.id} · {order.genre} · {order.mood}{order.artistMimic ? ` · Like ${order.artistMimic}` : ""}{order.title ? ` · "${order.title}"` : ""}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: "#c9a84c", fontWeight: 700, fontSize: 17 }}>${order.price}</div>
                    <div style={{ color: "#6b6b80", fontSize: 12 }}>{order.date}</div>
                  </div>
                  {order.status === "pending" && (
                    <button style={{ ...S.btn, padding: "10px 20px", fontSize: 13, flexShrink: 0 }} onClick={e => { e.stopPropagation(); setDeliverOrder(order); }}>Deliver →</button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); deleteOrder(order.id, order.name); }}
                    style={{ background: "rgba(224,92,92,.1)", border: "1px solid rgba(224,92,92,.3)", borderRadius: 50, padding: "8px 14px", color: "#e05c5c", fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                    🗑
                  </button>
                </div>
              ))
            )}
          </>
        )}
        {tab === "samples" && <SamplesManager />}
      </div>
      {selectedOrder && !deliverOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} onDeliver={(o) => { setSelectedOrder(null); setDeliverOrder(o); }} />}
      {deliverOrder && <DeliveryModal order={deliverOrder} onClose={() => setDeliverOrder(null)} onDelivered={(id) => { markDelivered(id); setDeliverOrder(null); }} />}
    </div>
  );
}
