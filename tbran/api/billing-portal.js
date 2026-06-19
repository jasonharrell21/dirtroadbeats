// GET /api/billing-portal
// Redirects authenticated customer to their Stripe billing portal.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Read Bearer token from Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', user.email)
      .maybeSingle()

    if (!customer?.stripe_customer_id) {
      return res.status(404).json({ error: 'No Stripe customer found' })
    }

    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5174'

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    })

    return res.redirect(303, session.url)
  } catch (err) {
    console.error('Billing portal error:', err)
    return res.status(500).json({ error: err.message })
  }
}
