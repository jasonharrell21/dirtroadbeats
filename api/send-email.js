import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let to, toName, subject, html;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    to = body.to;
    toName = body.toName;
    subject = body.subject;
    html = body.html;
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dirtroadbeat@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "Dirt Road Beats <dirtroadbeat@gmail.com>",
      to: `${toName} <${to}>`,
      subject,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log("Email error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
