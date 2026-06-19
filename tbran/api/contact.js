// POST /api/contact
// Forwards a customer contact form submission to the business owner's email.
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message, toEmail, businessName } = req.body || {}
  if (!name || !email || !message || !toEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await transporter.sendMail({
      from: `"${businessName} Contact Form" <${process.env.FROM_EMAIL}>`,
      replyTo: email,
      to: toEmail,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; color: #1B2430;">
          <h2 style="font-size: 20px; margin-bottom: 4px;">New contact form message</h2>
          <p style="color: #5B6470; margin-top: 0;">From your ${businessName} website</p>
          <hr style="border: none; border-top: 1px solid #E8E2D8; margin: 20px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: #FAF6EE; padding: 14px; border-radius: 6px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    })

    return res.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
