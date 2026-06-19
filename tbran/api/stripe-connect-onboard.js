// POST /api/stripe-connect-onboard
// Creates or retrieves a Stripe Connect account and returns an onboarding URL.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { customerId } = req.body || {}
  if (!customerId) return res.status(400).json({ error: 'customerId required' })

  try {
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5174'

    // Check if customer already has a Connect account
    const { data: site } = await supabase
      .from('sites')
      .select('stripe_connect_account_id, slug')
      .eq('customer_id', customerId)
      .maybeSingle()

    let accountId = site?.stripe_connect_account_id

    if (!accountId) {
      // Create a new Express account
      const account = await stripe.accounts.create({ type: 'express' })
      accountId = account.id

      // Persist it
      await supabase
        .from('sites')
        .update({ stripe_connect_account_id: accountId })
        .eq('customer_id', customerId)
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/intake?step=connect`,
      return_url: `${origin}/intake?connect=done`,
      type: 'account_onboarding',
    })

    return res.json({ url: accountLink.url })
  } catch (err) {
    console.error('Connect onboard error:', err)
    return res.status(500).json({ error: err.message })
  }
}
