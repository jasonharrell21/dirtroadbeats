// GET /api/intake-session?session_id=xxx
// Returns customer record from a completed Stripe checkout session.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { session_id } = req.query
  if (!session_id) return res.status(400).json({ error: 'session_id required' })

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    const email = session.customer_details?.email

    if (!email) return res.status(400).json({ error: 'No email on session' })

    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    return res.json({ customer: customer || { email, plan: 'starter' } })
  } catch (err) {
    console.error('intake-session error:', err)
    return res.status(500).json({ error: err.message })
  }
}
