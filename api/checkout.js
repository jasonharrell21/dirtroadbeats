const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const TIER_NAMES = { one: "One Version", two: "Two Versions" };

function genOrderId() {
  return "DRB-" + Date.now().toString(36).toUpperCase().slice(-6);
}

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dirtroadbeat@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendEmail({ to, toName, subject, html }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: "Dirt Road Beats <dirtroadbeat@gmail.com>",
    to: toName ? `${toName} <${to}>` : to,
    subject,
    html,
  });
}

async function saveOrder(order) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Supabase error:", err);
  }
}

function buildAdminEmail(session, orderId) {
  const meta = session.metadata || {};
  const amount = (session.amount_total / 100).toFixed(2);
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:32px;margin:0;">
  <div style="background:#fff;border-radius:12px;padding:32px;max-width:620px;margin:0 auto;border-top:4px solid #d4854a;">
    <h2 style="color:#d4854a;margin-top:0;">🎸 New Dirt Road Beats Order!</h2>
    <p style="color:#666;font-size:14px;">Order ID: <strong>${orderId}</strong> · Payment: <strong>$${amount}</strong></p>
    <table width="100%" cellpadding="10" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
      <tr><td style="color:#888;width:140px;">Customer</td><td><strong>${session.customer_details?.name || meta.name || "—"}</strong></td></tr>
      <tr><td style="color:#888;">Email</td><td>${session.customer_details?.email || "—"}</td></tr>
      <tr><td style="color:#888;">Amount</td><td>$${amount}</td></tr>
      <tr><td style="color:#888;">Genre</td><td>${meta.genre || "—"}</td></tr>
      <tr><td style="color:#888;">Tempo</td><td>${meta.tempo || "—"}</td></tr>
      <tr><td style="color:#888;">Mood</td><td>${meta.mood || "—"}</td></tr>
      <tr><td style="color:#888;">Vocals</td><td>${meta.vocal || "—"}</td></tr>
      <tr><td style="color:#888;">Artist Style</td><td>${meta.artistMimic || "—"}</td></tr>
      <tr><td style="color:#888;">Occasion</td><td>${meta.title || "—"}</td></tr>
      <tr><td style="color:#888;">Recipient</td><td>${meta.recipient || "—"}</td></tr>
    </table>
    ${meta.lyrics ? `<div style="margin-top:20px;background:#fafafa;border-radius:8px;padding:18px;border-left:3px solid #d4854a;">
      <div style="color:#888;font-size:11px;font-weight:700;margin-bottom:10px;">SONG DETAILS</div>
      <div style="font-size:14px;line-height:1.8;">${meta.lyrics.replace(/\n/g,"<br>")}</div>
    </div>` : ""}
    ${meta.extraNotes ? `<div style="margin-top:12px;background:#fff8f0;border-radius:8px;padding:16px;">
      <div style="color:#b8640b;font-size:11px;font-weight:700;margin-bottom:8px;">EXTRA NOTES</div>
      <div style="font-size:14px;line-height:1.7;">${meta.extraNotes.replace(/\n/g,"<br>")}</div>
    </div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#999;">Log into your Dirt Road Beats Admin to deliver this song.</p>
  </div>
</body>
</html>`;
}

function buildCustomerEmail(session, orderId) {
  const name = session.customer_details?.name || "there";
  const firstName = name.split(" ")[0];
  const amount = (session.amount_total / 100).toFixed(2);
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0d0a07;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1c1410;border-radius:16px;border:1px solid rgba(212,133,74,.2);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#2a1208,#0d0a07);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎸</div>
          <div style="font-family:Georgia,serif;font-size:26px;color:#d4854a;margin-bottom:4px;">Dirt Road Beats</div>
          <div style="color:rgba(245,237,224,.5);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#f5ede0;font-size:17px;margin:0 0 8px;">Hi ${firstName},</p>
          <p style="color:rgba(245,237,224,.8);font-size:15px;line-height:1.7;margin:0 0 28px;">We've got your order and we're already excited to create your custom song! You'll receive your WAV file within <strong style="color:#edb87a;">3–5 business days</strong>.</p>
          <div style="background:#261d15;border-radius:12px;padding:20px 24px;margin-bottom:28px;border:1px solid rgba(212,133,74,.15);">
            <div style="color:#d4854a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Order Summary</div>
            <table width="100%" style="font-size:14px;">
              <tr><td style="color:rgba(245,237,224,.5);padding-bottom:6px;">Order ID</td><td style="color:#f5ede0;text-align:right;">${orderId}</td></tr>
              <tr><td style="color:rgba(245,237,224,.5);">Amount Paid</td><td style="color:#f5ede0;text-align:right;">$${amount}</td></tr>
            </table>
          </div>
          <p style="color:rgba(245,237,224,.7);font-size:14px;line-height:1.7;margin:0;">Questions? Email us at <a href="mailto:dirtroadbeat@gmail.com" style="color:#d4854a;">dirtroadbeat@gmail.com</a></p>
        </td></tr>
        <tr><td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(212,133,74,.08);">
          <div style="color:#7a6050;font-size:12px;">© ${new Date().getFullYear()} Dirt Road Beats · Custom Songs Made for You</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const orderId = genOrderId();
      const meta = session.metadata || {};
      const customerEmail = session.customer_details?.email || meta.email || "";
      const customerName = session.customer_details?.name || meta.name || "Customer";

      try {
        await saveOrder({
          order_id: orderId,
          name: customerName,
          email: customerEmail,
          tier: meta.tier || "one",
          tier_name: TIER_NAMES[meta.tier] || "One Version",
          price: session.amount_total / 100,
          genre: meta.genre || "",
          tempo: meta.tempo || "",
          mood: meta.mood || "",
          vocal: meta.vocal || "",
          artist_mimic: meta.artistMimic || null,
          title: meta.title || null,
          recipient: meta.recipient || null,
          lyrics: meta.lyrics || "",
          extra_notes: meta.extraNotes || null,
          status: "pending",
          payment_intent_id: session.payment_intent,
        });

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🎸 New Order ${orderId} — $${(session.amount_total/100).toFixed(2)}`,
          html: buildAdminEmail(session, orderId),
        });

        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            toName: customerName,
            subject: `Your Dirt Road Beats order is confirmed! 🎸`,
            html: buildCustomerEmail(session, orderId),
          });
        }

        console.log(`Order ${orderId} processed successfully`);
      } catch (err) {
        console.error("Order processing error:", err);
      }
    }
  }

  return res.status(200).json({ received: true });
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
