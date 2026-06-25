import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

  const { subscription } = req.body;
  if (!subscription?.endpoint) return res.status(400).json({ error: "Invalid subscription" });

  const { endpoint, keys } = subscription;

  const { error } = await supabase.from("profiles").update({
    push_endpoint: endpoint,
    push_p256dh: keys.p256dh,
    push_auth: keys.auth,
  }).eq("id", user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ ok: true });
}
