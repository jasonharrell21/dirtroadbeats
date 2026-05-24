// ─────────────────────────────────────────────────────────────────────────────
// FILE: /api/checkout.js
// Deploy as a Vercel Serverless Function (works with Next.js or plain Vercel)
//
// This file handles TWO endpoints based on the `action` field:
//   action: "create_intent"  → creates a Stripe PaymentIntent, returns clientSecret
//   action: "confirm_order"  → saves order + emails you (admin) via Resend
//
// ENV VARS to set in Vercel dashboard:
//   STRIPE_SECRET_KEY     → from stripe.com/dashboard (starts with sk_live_ or sk_test_)
//   RESEND_API_KEY        → from resend.com
//   ADMIN_EMAIL           → your email address to receive order notifications
//   FROM_EMAIL            → verified sender email on Resend (e.g. songs@yourdomain.com)
// ─────────────────────────────────────────────────────────────────────────────

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const TIER_PRICES = {
  one: 17999,   // in cents — $179.99
  two: 19999,   // in cents — $199.99
};

const TIER_NAMES = {
  one: "One Version",
  two: "Two Versions",
};

// ── Resend email helper ───────────────────────────────────────────────────────
async function sendEmail({ to, toName, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Dirt Road Beats <${process.env.FROM_EMAIL}>`,
      to: toName ? [`${toName} <${to}>`] : [to],
      subject,
      html,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Resend error");
  return data;
}

// ── Order notification email (to you) ────────────────────────────────────────
function buildAdminEmail(order, orderId) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:32px;margin:0;">
  <div style="background:#fff;border-radius:12px;padding:32px;max-width:620px;margin:0 auto;border-top:4px solid #c9a84c;">
    <h2 style="color:#c9a84c;margin-top:0;font-size:22px;">🎵 New Dirt Road Beats Order — ${TIER_NAMES[order.tier]} Package</h2>
    <p style="color:#666;font-size:14px;margin-bottom:24px;">Payment confirmed via Stripe. Order ID: <strong>${orderId}</strong></p>

    <table width="100%" cellpadding="10" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
      <tr style="background:#fafafa;"><td style="color:#888;width:140px;border-bottom:1px solid #eee;">Customer</td><td style="border-bottom:1px solid #eee;"><strong>${order.name}</strong></td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #eee;">Email</td><td style="border-bottom:1px solid #eee;">${order.email}</td></tr>
      <tr style="background:#fafafa;"><td style="color:#888;border-bottom:1px solid #eee;">Package</td><td style="border-bottom:1px solid #eee;"><strong>${TIER_NAMES[order.tier]} · $${TIER_PRICES[order.tier]/100}</strong></td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #eee;">Genre</td><td style="border-bottom:1px solid #eee;">${order.genre}</td></tr>
      <tr style="background:#fafafa;"><td style="color:#888;border-bottom:1px solid #eee;">Tempo</td><td style="border-bottom:1px solid #eee;">${order.tempo}</td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #eee;">Mood</td><td style="border-bottom:1px solid #eee;">${order.mood}</td></tr>
      <tr style="background:#fafafa;"><td style="color:#888;border-bottom:1px solid #eee;">Vocals</td><td style="border-bottom:1px solid #eee;">${order.vocal}</td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #eee;">Artist Style</td><td style="border-bottom:1px solid #eee;">${order.artistMimic || "—"}</td></tr>
      <tr style="background:#fafafa;"><td style="color:#888;border-bottom:1px solid #eee;">Occasion</td><td style="border-bottom:1px solid #eee;">${order.title || "—"}</td></tr>
      <tr><td style="color:#888;">Recipient</td><td>${order.recipient || "—"}</td></tr>
    </table>

    <div style="margin-top:20px;background:#fafafa;border-radius:8px;padding:18px;border-left:3px solid #c9a84c;">
      <div style="color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Lyrics / Story Details</div>
      <div style="font-size:14px;line-height:1.8;color:#333;">${order.lyrics.replace(/\n/g,"<br>")}</div>
    </div>

    ${order.extraNotes ? `
    <div style="margin-top:12px;background:#fffbf0;border-radius:8px;padding:16px;border:1px solid #f0d080;">
      <div style="color:#b8860b;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">⚠ Extra Notes</div>
      <div style="font-size:14px;line-height:1.7;color:#333;">${order.extraNotes.replace(/\n/g,"<br>")}</div>
    </div>` : ""}

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#999;font-size:13px;margin:0;">Log into your Dirt Road Beats Admin to deliver this song when it's ready.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Customer confirmation email ───────────────────────────────────────────────
function buildCustomerConfirmEmail(order, orderId, tierName, turnaround) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:16px;border:1px solid rgba(201,168,76,.2);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#1a1230,#0f0f1a);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎵</div>
          <div style="font-family:Georgia,serif;font-size:26px;color:#c9a84c;margin-bottom:4px;">Dirt Road Beats</div>
          <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${order.name.split(" ")[0]},</p>
          <p style="color:rgba(245,237,224,.7);font-size:15px;line-height:1.7;margin:0 0 28px;">
            We've received your order and we're already working on your custom song. You'll receive your download link within <strong style="color:#c9a84c;">${turnaround}</strong>.
          </p>
          <div style="background:#1a1a26;border-radius:12px;padding:20px 24px;margin-bottom:28px;border:1px solid rgba(201,168,76,.12);">
            <div style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Order Summary</div>
            <table width="100%" style="font-size:14px;">
              <tr><td style="color:rgba(245,237,224,.5);padding-bottom:6px;">Order ID</td><td style="color:#f5ede0;text-align:right;">${orderId}</td></tr>
              <tr><td style="color:rgba(245,237,224,.5);padding-bottom:6px;">Package</td><td style="color:#f5ede0;text-align:right;">${tierName}</td></tr>
              <tr><td style="color:rgba(245,237,224,.5);padding-bottom:6px;">Genre</td><td style="color:#f5ede0;text-align:right;">${order.genre}</td></tr>
              ${order.artistMimic ? `<tr><td style="color:rgba(245,237,224,.5);padding-bottom:6px;">Style</td><td style="color:#f5ede0;text-align:right;">Like ${order.artistMimic}</td></tr>` : ""}
              ${order.title ? `<tr><td style="color:rgba(245,237,224,.5);">Occasion</td><td style="color:#f5ede0;text-align:right;">${order.title}</td></tr>` : ""}
            </table>
          </div>
          <p style="color:rgba(245,237,224,.6);font-size:14px;line-height:1.7;margin:0;">
            Questions? Just reply to this email. We're here to make sure your song is exactly right.
          </p>
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

// ── Generate a short order ID ─────────────────────────────────────────────────
function genOrderId() {
  return "SS-" + Date.now().toString(36).toUpperCase().slice(-6);
}

const TURNAROUND = { one: "3–5 business days", two: "3–5 business days" };

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS headers (update origin to your domain in production)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, tier, order, paymentIntentId } = req.body;

  // ── Step 1: Create PaymentIntent ──────────────────────────────────────────
  if (action === "create_intent") {
    if (!TIER_PRICES[tier]) return res.status(400).json({ error: "Invalid tier" });

    try {
      const intent = await stripe.paymentIntents.create({
        amount: TIER_PRICES[tier],
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        description: `Dirt Road Beats ${TIER_NAMES[tier]} Song`,
        metadata: { tier, tier_name: TIER_NAMES[tier] },
      });
      return res.status(200).json({ clientSecret: intent.client_secret, intentId: intent.id });
    } catch (err) {
      console.error("Stripe error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── Step 2: Confirm order after payment succeeds ──────────────────────────
  if (action === "confirm_order") {
    if (!paymentIntentId || !order) return res.status(400).json({ error: "Missing data" });

    try {
      // Verify payment actually succeeded with Stripe
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== "succeeded") {
        return res.status(402).json({ error: "Payment not confirmed" });
      }

      const orderId = genOrderId();
      const tierName = TIER_NAMES[order.tier] || "Premium";
      const turnaround = TURNAROUND[order.tier] || "3–5 business days";

      // Send admin notification
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `🎵 New Order ${orderId} — ${tierName} · $${TIER_PRICES[order.tier]/100}`,
        html: buildAdminEmail(order, orderId),
      });

      // Send customer confirmation
      await sendEmail({
        to: order.email,
        toName: order.name,
        subject: `Your Dirt Road Beats order is confirmed, ${order.name.split(" ")[0]}! 🎵`,
        html: buildCustomerConfirmEmail(order, orderId, tierName, turnaround),
      });

      return res.status(200).json({ success: true, orderId });
    } catch (err) {
      console.error("Confirm error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
};
