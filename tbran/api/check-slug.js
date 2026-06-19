// GET /api/check-slug?slug=tomsboats
// Returns { available: true|false }
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { slug } = req.query
  if (!slug) return res.status(400).json({ error: 'slug required' })

  const { data } = await supabase
    .from('sites')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  return res.json({ available: !data })
}
