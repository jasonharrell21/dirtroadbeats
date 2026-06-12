export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let fileName, contentType;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    fileName = body.fileName;
    contentType = body.contentType;
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!fileName || !contentType) {
    return res.status(400).json({ error: "Missing fileName or contentType" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/Songs/${fileName}`,
    {
      method: "POST",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 300 }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  const data = await response.json();
  const token = data.token;
  const signedUrl = `${SUPABASE_URL}/storage/v1/object/upload/sign/Songs/${fileName}?token=${token}`;
  return res.status(200).json({ signedUrl });
}
