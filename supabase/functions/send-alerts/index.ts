import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (_req) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: items, error } = await supabase
    .from("items")
    .select("*, profiles!inner(email, subscription_status)")
    .eq("alerted", false)
    .in("profiles.subscription_status", ["trialing", "active"]);

  if (error) {
    console.error("Query error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const toAlert = (items || []).filter((item) => {
    const expDate = new Date(item.exp_date + "T00:00:00");
    const alertDate = new Date(expDate);
    alertDate.setDate(alertDate.getDate() - item.lead_days);
    return alertDate <= today && expDate >= today;
  });

  const gmailUser = Deno.env.get("GMAIL_USER")!;
  const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD")!;

  const client = new SmtpClient();
  await client.connectTLS({ hostname: "smtp.gmail.com", port: 465, username: gmailUser, password: gmailPass });

  let sent = 0;
  const errors: string[] = [];

  for (const item of toAlert) {
    const expDate = new Date(item.exp_date + "T00:00:00");
    const daysLeft = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const email = item.profiles.email;

    const subject = `Your ${item.name} expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
    const html = buildEmail(item.name, item.exp_date, daysLeft);

    try {
      await client.send({
        from: `TrakXP Alerts <${gmailUser}>`,
        to: email,
        subject,
        content: html,
        html,
      });

      await supabase.from("items").update({ alerted: true }).eq("id", item.id);
      sent++;
    } catch (e) {
      errors.push(`${item.id}: ${e}`);
    }
  }

  await client.close();

  return new Response(JSON.stringify({ checked: items?.length, sent, errors }), {
    headers: { "Content-Type": "application/json" },
  });
});

function buildEmail(name: string, expDateStr: string, daysLeft: number): string {
  const formatted = new Date(expDateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:#f97316;padding:24px 32px;">
      <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px;">TrakXP</div>
      <div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:2px;">Expiration Alert</div>
    </div>
    <div style="padding:32px;">
      <div style="font-size:22px;font-weight:700;color:#111827;margin-bottom:8px;">
        Your ${escHtml(name)} expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}
      </div>
      <div style="font-size:15px;color:#6b7280;margin-bottom:28px;line-height:1.6;">
        Expiration date: <strong style="color:#111827;">${formatted}</strong>
      </div>
      <a href="https://trakxp.com/dashboard"
        style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;">
        View in TrakXP →
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;line-height:1.6;">
      You're receiving this because you have alerts enabled in TrakXP.
      Manage your account at <a href="https://trakxp.com/account" style="color:#f97316;">trakxp.com</a>
    </div>
  </div>
</body>
</html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
