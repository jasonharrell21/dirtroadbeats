import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    if (userId && session.subscription) {
      await supabase.from("profiles").update({
        stripe_subscription_id: session.subscription,
        subscription_status: "active",
      }).eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const customerId = session.customer;
    await supabase.from("profiles").update({ subscription_status: "canceled" }).eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.payment_failed") {
    const customerId = session.customer;
    await supabase.from("profiles").update({ subscription_status: "past_due" }).eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.payment_succeeded") {
    const customerId = session.customer;
    await supabase.from("profiles").update({ subscription_status: "active" }).eq("stripe_customer_id", customerId);
  }

  res.json({ received: true });
}
