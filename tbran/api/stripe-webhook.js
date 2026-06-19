// POST /api/stripe-webhook
// Handles Stripe subscription lifecycle events.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN = {
  [process.env.STRIPE_STARTER_PRICE_ID]: 'starter',
  [process.env.STRIPE_PRO_PRICE_ID]: 'pro',
  [process.env.STRIPE_BUSINESS_PRICE_ID]: 'business',
}

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerId = session.customer
        const subscriptionId = session.subscription
        const email = session.customer_details?.email

        // Determine plan from subscription items
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price'],
        })
        const priceId = subscription.items.data[0]?.price?.id
        const plan = PRICE_TO_PLAN[priceId] || 'starter'

        // Upsert customer record
        await supabase.from('customers').upsert({
          email,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })

        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const priceId = sub.items.data[0]?.price?.id
        const plan = PRICE_TO_PLAN[priceId]
        if (plan) {
          await supabase.from('customers')
            .update({ plan, updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', sub.id)

          // Also update the site plan
          const { data: customer } = await supabase.from('customers').select('id').eq('stripe_subscription_id', sub.id).maybeSingle()
          if (customer) {
            await supabase.from('sites').update({ plan }).eq('customer_id', customer.id)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        // Mark site as offline
        const { data: customer } = await supabase.from('customers').select('id').eq('stripe_subscription_id', sub.id).maybeSingle()
        if (customer) {
          await supabase.from('sites').update({ is_live: false }).eq('customer_id', customer.id)
        }
        break
      }
    }

    return res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}
