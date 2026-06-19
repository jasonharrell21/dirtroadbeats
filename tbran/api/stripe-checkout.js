// POST /api/stripe-checkout?priceId=xxx
// Creates a Stripe subscription checkout session and redirects to it.
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const priceId = req.query.priceId || req.body?.priceId
  if (!priceId) {
    return res.status(400).json({ error: 'priceId required' })
  }

  try {
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5174'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/intake?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      allow_promotion_codes: true,
    })

    return res.redirect(303, session.url)
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: err.message })
  }
}
