// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/StripePaymentStep.jsx
//
// Drop-in replacement for the mock payment step in custom-songs-site.jsx
//
// HOW TO INTEGRATE:
//   1. npm install @stripe/stripe-js @stripe/react-stripe-js
//   2. Replace the step===2 block in OrderForm with <StripePaymentStep ... />
//   3. Set VITE_STRIPE_PUBLIC_KEY in your .env (from stripe.com dashboard)
//   4. Deploy api/checkout.js as a Vercel serverless function
//
// ENV VARS needed (Vite):
//   VITE_STRIPE_PUBLIC_KEY=pk_test_...   (your Stripe publishable key)
//   VITE_API_URL=https://yoursite.com    (your deployed Vercel URL)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe once outside component (use your real publishable key)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_REPLACE_WITH_YOUR_KEY"
);

const API_URL = "";

// ── Stripe appearance matching Dirt Road Beats brand ──────────────────────────────
const STRIPE_APPEARANCE = {
  theme: "night",
  variables: {
    colorPrimary: "#c9a84c",
    colorBackground: "#1a1a26",
    colorText: "#f5ede0",
    colorDanger: "#e05c5c",
    colorTextPlaceholder: "#6b6b80",
    fontFamily: "'DM Sans', sans-serif",
    spacingUnit: "4px",
    borderRadius: "8px",
    fontSizeBase: "15px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(201,168,76,.2)",
      boxShadow: "none",
      padding: "12px 16px",
    },
    ".Input:focus": {
      border: "1px solid rgba(201,168,76,.6)",
      boxShadow: "0 0 0 2px rgba(201,168,76,.1)",
    },
    ".Label": {
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "#c9a84c",
      marginBottom: "8px",
    },
    ".Tab": { border: "1px solid rgba(201,168,76,.2)", background: "#12121a" },
    ".Tab--selected": { border: "1px solid #c9a84c", background: "#1a1a26" },
    ".Tab:hover": { background: "#1a1a26" },
  },
};

// ── Inner form (must be inside <Elements>) ────────────────────────────────────
function CheckoutForm({ tier, form, onSuccess, onBack, price }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [intentId, setIntentId] = useState(null);

  // Fetch clientSecret when component mounts
  useEffect(() => {
    fetch(`${API_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_intent", tier }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setIntentId(data.intentId);
        // Note: clientSecret is handled by Elements provider above
      })
      .catch(() => setError("Failed to initialize payment. Please refresh and try again."));
  }, [tier]);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // keeps user on page (no redirect needed for card payments)
      confirmParams: {
        payment_method_data: {
          billing_details: { name: form.name, email: form.email },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Confirm order server-side → sends emails
      try {
        const res = await fetch(`${API_URL}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "confirm_order",
            paymentIntentId: paymentIntent.id,
            order: { ...form, tier },
          }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess(data.orderId);
        } else {
          setError(data.error || "Order confirmation failed. Contact support with your payment ID: " + paymentIntent.id);
        }
      } catch {
        setError("Network error during confirmation. Your payment went through — email us at support@yourdomain.com with ID: " + paymentIntent.id);
      }
    }

    setProcessing(false);
  };

  const S = {
    card: {
      background: "#12121a",
      border: "1px solid rgba(201,168,76,.15)",
      borderRadius: 16,
      padding: 32,
    },
    label: {
      display: "block", fontSize: 12, fontWeight: 600,
      color: "#c9a84c", letterSpacing: 1.5,
      textTransform: "uppercase", marginBottom: 8,
    },
    btnGold: {
      background: "linear-gradient(135deg, #c9a84c, #f0d080)",
      border: "none", borderRadius: 50, padding: "15px 38px",
      color: "#1a1200", fontWeight: 700, fontSize: 15,
      cursor: processing ? "not-allowed" : "pointer",
      letterSpacing: .5, fontFamily: "'DM Sans', sans-serif",
      opacity: processing ? .7 : 1, display: "flex",
      alignItems: "center", gap: 10,
    },
    btnOutline: {
      background: "transparent", border: "1px solid #c9a84c",
      borderRadius: 50, padding: "14px 36px", color: "#c9a84c",
      fontWeight: 500, fontSize: 15, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    },
  };

  return (
    <div style={S.card}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 6 }}>
        Payment
      </div>
      <div style={{ color: "#6b6b80", fontSize: 14, marginBottom: 24 }}>
        🔒 Secured by Stripe — your card info never touches our servers.
      </div>

      {/* Order summary */}
      <div style={{
        background: "#1a1a26", borderRadius: 10, padding: "16px 20px",
        marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ color: "#c9a84c", fontWeight: 600 }}>{tier.charAt(0).toUpperCase() + tier.slice(1)} Package</div>
          <div style={{ color: "#6b6b80", fontSize: 13 }}>{form.genre} · {form.mood}</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>${price}</div>
      </div>

      {/* Stripe PaymentElement — renders card fields, Apple Pay, Google Pay automatically */}
      <div style={{ marginBottom: 24 }}>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "auto", email: "auto" } },
            defaultValues: { billingDetails: { name: form.name, email: form.email } },
          }}
        />
      </div>

      {error && (
        <div style={{
          color: "#e05c5c", fontSize: 13, marginBottom: 16,
          background: "rgba(224,92,92,.1)", padding: "12px 16px",
          borderRadius: 8, lineHeight: 1.5,
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={S.btnOutline} onClick={onBack} disabled={processing}>← Back</button>
        <button style={S.btnGold} onClick={handleSubmit} disabled={processing || !stripe}>
          {processing ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: "2px solid #1a1200",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
              }} />
              Processing…
            </>
          ) : `Pay $${price} Securely`}
        </button>
      </div>

      <div style={{ marginTop: 16, textAlign: "center", color: "#6b6b80", fontSize: 12 }}>
        Protected by 256-bit SSL encryption · Powered by Stripe
      </div>
    </div>
  );
}

// ── Outer wrapper — fetches clientSecret then mounts Elements ─────────────────
export default function StripePaymentStep({ tier, price, form, onSuccess, onBack }) {
  const [clientSecret, setClientSecret] = useState("");
  const [initError, setInitError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_intent", tier }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setInitError(data.error || "Could not initialize payment.");
      })
      .catch(() => setInitError("Network error. Please refresh and try again."));
  }, [tier]);

  if (initError) {
    return (
      <div style={{ background: "#12121a", border: "1px solid rgba(224,92,92,.3)", borderRadius: 16, padding: 32, textAlign: "center" }}>
        <div style={{ color: "#e05c5c", marginBottom: 12 }}>⚠️ {initError}</div>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #c9a84c", borderRadius: 50, padding: "12px 28px", color: "#c9a84c", cursor: "pointer", fontFamily: "inherit" }}>
          ← Go Back
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={{ background: "#12121a", border: "1px solid rgba(201,168,76,.15)", borderRadius: 16, padding: 48, textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(201,168,76,.2)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "#6b6b80", fontSize: 14 }}>Initializing secure payment…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
    >
      <CheckoutForm
        tier={tier}
        price={price}
        form={form}
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </Elements>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// HOW TO WIRE THIS INTO custom-songs-site.jsx
// ─────────────────────────────────────────────────────────────────────────────
//
// 1. At the top of custom-songs-site.jsx, add:
//      import StripePaymentStep from "./StripePaymentStep";
//
// 2. In the OrderForm component, find the step === 2 block and replace it:
//
//    BEFORE:
//      {step === 2 && (
//        <div style={S.card}>
//          ... mock card inputs ...
//        </div>
//      )}
//
//    AFTER:
//      {step === 2 && (
//        <StripePaymentStep
//          tier={selectedTier}
//          price={tier.price}
//          form={form}
//          onSuccess={(orderId) => { setOrderId(orderId); setStep(3); }}
//          onBack={() => setStep(1)}
//        />
//      )}
//
// 3. Add orderId to state at the top of OrderForm:
//      const [orderId, setOrderId] = useState("");
//
// 4. In the step === 3 confirmation screen, show it:
//      Order ID: {orderId}
//
// ─────────────────────────────────────────────────────────────────────────────
