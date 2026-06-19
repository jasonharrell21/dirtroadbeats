import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import StarterSite from './sites/StarterSite.jsx'
import ProSite from './sites/ProSite.jsx'
import BusinessSite from './sites/BusinessSite.jsx'

export default function CustomerSite({ slug }) {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .eq('is_live', true)
        .maybeSingle()

      if (!data) {
        setNotFound(true)
      } else {
        setSite(data)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <SiteLoader />
  if (notFound) return <SiteNotFound slug={slug} />

  if (site.plan === 'starter') return <StarterSite site={site} />
  if (site.plan === 'pro') return <ProSite site={site} />
  if (site.plan === 'business') return <BusinessSite site={site} />

  return <StarterSite site={site} />
}

function SiteLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #E8E2D8', borderTopColor: '#1B2430', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function SiteNotFound({ slug }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#8A9099', marginBottom: '16px' }}>{slug}.tbran.com</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 700, color: '#1B2430', marginBottom: '12px' }}>Site not found</h1>
        <p style={{ color: '#5B6470', marginBottom: '24px' }}>This subdomain doesn't have an active site yet.</p>
        <a href="https://tbran.com" style={{ color: '#C24A36', fontWeight: 500 }}>Build your own site at Tbran →</a>
      </div>
    </div>
  )
}
