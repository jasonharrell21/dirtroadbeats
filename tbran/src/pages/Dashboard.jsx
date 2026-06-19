import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase.js'

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'google', label: 'Google Business' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
]

const UPLOAD_LIMITS = { starter: 0, pro: 10, business: 25 }

export default function Dashboard() {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('sites')
        .select('*')
        .eq('owner_email', session.user.email)
        .maybeSingle()
      setSite(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingScreen />

  if (!site) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 600, color: '#1B2430', marginBottom: '12px' }}>No site found</h2>
          <p style={{ color: '#5B6470', marginBottom: '24px' }}>We couldn't find a site linked to this account. Did you complete the intake form?</p>
          <a href="/intake" style={{ padding: '12px 24px', background: '#C24A36', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: 600 }}>Set up my site</a>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'media', label: `Media (${(site.media_urls || []).length}/${UPLOAD_LIMITS[site.plan]})` },
    ...(site.plan === 'pro' || site.plan === 'business' ? [{ id: 'social', label: 'Social links' }] : []),
    ...(site.plan === 'business' ? [{ id: 'payments', label: 'Payments' }, { id: 'testimonials', label: 'Testimonials' }] : []),
    { id: 'account', label: 'Account' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Top bar */}
      <TopBar slug={site.slug} plan={site.plan} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #E8E2D8', marginBottom: '32px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeTab === t.id ? 600 : 400,
                color: activeTab === t.id ? '#1B2430' : '#8A9099',
                borderBottom: `2px solid ${activeTab === t.id ? '#1B2430' : 'transparent'}`,
                marginBottom: '-1px', whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab site={site} setSite={setSite} />}
        {activeTab === 'content' && <ContentTab site={site} setSite={setSite} />}
        {activeTab === 'media' && <MediaTab site={site} setSite={setSite} />}
        {activeTab === 'social' && <SocialTab site={site} setSite={setSite} />}
        {activeTab === 'payments' && <PaymentsTab site={site} />}
        {activeTab === 'testimonials' && <TestimonialsTab site={site} setSite={setSite} />}
        {activeTab === 'account' && <AccountTab site={site} />}
      </div>
    </div>
  )
}

function TopBar({ slug, plan }) {
  return (
    <div style={{ background: '#1B2430', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HexLogo size={22} color="#FAF6EE" />
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 600, color: '#FAF6EE' }}>Tbran</span>
        <span style={{ color: '#5B6470', margin: '0 4px' }}>·</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#8A9099' }}>{slug}.tbran.com</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7C9070', background: 'rgba(124,144,112,0.15)', padding: '3px 8px', borderRadius: '4px' }}>{plan}</span>
        <a href={`https://${slug}.tbran.com`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '13px', color: '#FAF6EE', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '5px', fontWeight: 500 }}>
          View site ↗
        </a>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
          style={{ fontSize: '13px', color: '#8A9099', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

// Shared save hook
function useSiteField(site, setSite) {
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  async function save(updates) {
    setSaving(true)
    const { error } = await supabase
      .from('sites')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('slug', site.slug)
    if (!error) {
      setSite(prev => ({ ...prev, ...updates }))
      setSavedAt(new Date())
      setDirty(false)
    }
    setSaving(false)
    return !error
  }

  return { dirty, setDirty, saving, savedAt, save }
}

function SaveBar({ dirty, saving, savedAt, onSave }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: dirty ? '#FFF8F0' : '#F6F8F5', border: `1px solid ${dirty ? '#E8D8C8' : '#E8E2D8'}`, borderRadius: '8px', marginBottom: '24px' }}>
      <span style={{ fontSize: '13px', color: dirty ? '#8A6A50' : '#7C9070' }}>
        {saving ? 'Saving…' : dirty ? 'Unsaved changes' : savedAt ? `Saved ${timeAgo(savedAt)}` : 'No changes'}
      </span>
      <button
        onClick={onSave}
        disabled={!dirty || saving}
        style={{ padding: '8px 18px', background: dirty ? '#1B2430' : '#D4CEC5', color: '#FAF6EE', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: dirty ? 'pointer' : 'default', transition: 'background 0.2s' }}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}

function OverviewTab({ site, setSite }) {
  const { dirty, setDirty, saving, savedAt, save } = useSiteField(site, setSite)
  const [businessName, setBusinessName] = useState(site.business_name || '')
  const [tagline, setTagline] = useState(site.tagline || '')

  function handleSave() {
    save({ business_name: businessName, tagline })
  }

  return (
    <div>
      <SectionHeader title="Overview" subtitle="Your site's basic identity. Changes appear instantly." />
      <SaveBar dirty={dirty} saving={saving} savedAt={savedAt} onSave={handleSave} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={cardStyle}>
          <StatLabel>Plan</StatLabel>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#1B2430', textTransform: 'capitalize' }}>{site.plan}</div>
          <a href="#upgrade" style={{ fontSize: '12px', color: '#C24A36', marginTop: '4px', display: 'block' }}>Upgrade plan →</a>
        </div>
        <div style={cardStyle}>
          <StatLabel>Your URL</StatLabel>
          <a href={`https://${site.slug}.tbran.com`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#1B2430', textDecoration: 'none' }}>
            {site.slug}.tbran.com ↗
          </a>
        </div>
      </div>

      <div style={{ ...formCard, marginTop: '24px' }}>
        <EditField label="Business name"
          value={businessName}
          onChange={v => { setBusinessName(v); setDirty(true) }}
        />
        <EditField label="Tagline"
          value={tagline}
          onChange={v => { setTagline(v); setDirty(true) }}
          hint="One line that captures what makes your business great."
        />
      </div>
    </div>
  )
}

function ContentTab({ site, setSite }) {
  const { dirty, setDirty, saving, savedAt, save } = useSiteField(site, setSite)
  const [services, setServices] = useState(site.services || [{ name: '', description: '', price: '' }])
  const [about, setAbout] = useState(site.about_text || '')
  const [contact, setContact] = useState({
    phone: site.contact_phone || '',
    email: site.contact_email || '',
    address: site.contact_address || '',
    hours: site.contact_hours || '',
  })

  const hasPro = site.plan === 'pro' || site.plan === 'business'

  function handleSave() {
    save({
      services: services.filter(s => s.name.trim()),
      about_text: about,
      contact_phone: contact.phone,
      contact_email: contact.email,
      contact_address: contact.address,
      contact_hours: contact.hours,
    })
  }

  return (
    <div>
      <SectionHeader title="Content" subtitle="Your services, contact info, and story." />
      <SaveBar dirty={dirty} saving={saving} savedAt={savedAt} onSave={handleSave} />

      {hasPro && (
        <div style={{ ...formCard, marginBottom: '20px' }}>
          <label style={labelStyle}>About your business</label>
          <textarea
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            value={about}
            onChange={e => { setAbout(e.target.value); setDirty(true) }}
            placeholder="Tell visitors your story…"
          />
        </div>
      )}

      <div style={{ ...formCard, marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 600, color: '#1B2430', marginBottom: '16px', fontSize: '15px' }}>Services & products</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {services.map((svc, i) => (
            <div key={i} style={{ background: '#FAF6EE', border: '1px solid #E8E2D8', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#8A9099', fontWeight: 600 }}>ITEM {i + 1}</span>
                {services.length > 1 && (
                  <button onClick={() => { setServices(prev => prev.filter((_, idx) => idx !== i)); setDirty(true) }}
                    style={{ fontSize: '12px', color: '#C24A36', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
              <input style={{ ...inputStyle, marginBottom: '8px' }} value={svc.name} placeholder="Service name"
                onChange={e => { setServices(prev => prev.map((s, idx) => idx === i ? { ...s, name: e.target.value } : s)); setDirty(true) }} />
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', marginBottom: '8px' }} value={svc.description} placeholder="Description"
                onChange={e => { setServices(prev => prev.map((s, idx) => idx === i ? { ...s, description: e.target.value } : s)); setDirty(true) }} />
              <input style={{ ...inputStyle, maxWidth: '160px' }} value={svc.price} placeholder="Price (optional)"
                onChange={e => { setServices(prev => prev.map((s, idx) => idx === i ? { ...s, price: e.target.value } : s)); setDirty(true) }} />
            </div>
          ))}
        </div>
        <button onClick={() => { setServices(prev => [...prev, { name: '', description: '', price: '' }]); setDirty(true) }}
          style={{ marginTop: '10px', padding: '8px 14px', background: 'none', border: '1.5px dashed #D4CEC5', borderRadius: '6px', fontSize: '13px', color: '#5B6470', cursor: 'pointer', width: '100%' }}>
          + Add item
        </button>
      </div>

      <div style={formCard}>
        <h3 style={{ fontWeight: 600, color: '#1B2430', marginBottom: '16px', fontSize: '15px' }}>Contact information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <EditField label="Phone" value={contact.phone} onChange={v => { setContact(c => ({ ...c, phone: v })); setDirty(true) }} />
          <EditField label="Email" value={contact.email} onChange={v => { setContact(c => ({ ...c, email: v })); setDirty(true) }} />
        </div>
        <EditField label="Address" value={contact.address} onChange={v => { setContact(c => ({ ...c, address: v })); setDirty(true) }} />
        <EditField label="Hours" value={contact.hours} onChange={v => { setContact(c => ({ ...c, hours: v })); setDirty(true) }} multiline />
      </div>
    </div>
  )
}

function MediaTab({ site, setSite }) {
  const limit = UPLOAD_LIMITS[site.plan]
  const [mediaUrls, setMediaUrls] = useState(site.media_urls || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    const remaining = limit - mediaUrls.length
    if (remaining <= 0) return
    setUploading(true)
    try {
      const newUrls = []
      for (const file of files.slice(0, remaining)) {
        const ext = file.name.split('.').pop()
        const path = `${site.slug}/media-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: signData } = await supabase.storage.from('site-assets').createSignedUploadUrl(path)
        await fetch(signData.signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        const publicUrl = supabase.storage.from('site-assets').getPublicUrl(path).data.publicUrl
        newUrls.push({ url: publicUrl, type: file.type.startsWith('video') ? 'video' : 'image' })
      }
      const merged = [...mediaUrls, ...newUrls]
      setMediaUrls(merged)
      await supabase.from('sites').update({ media_urls: merged }).eq('slug', site.slug)
      setSite(prev => ({ ...prev, media_urls: merged }))
    } finally {
      setUploading(false)
    }
  }

  async function removeMedia(i) {
    const updated = mediaUrls.filter((_, idx) => idx !== i)
    setMediaUrls(updated)
    await supabase.from('sites').update({ media_urls: updated }).eq('slug', site.slug)
    setSite(prev => ({ ...prev, media_urls: updated }))
  }

  if (site.plan === 'starter') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: '#1B2430', marginBottom: '8px' }}>Photos & videos are a Pro feature</h3>
        <p style={{ color: '#5B6470', marginBottom: '24px' }}>Upgrade to Pro to add a gallery, hero photo, and up to 10 uploads.</p>
        <a href="#upgrade" style={{ padding: '12px 24px', background: '#C24A36', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}>Upgrade to Pro</a>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader
        title={`Media (${mediaUrls.length} / ${limit})`}
        subtitle="Photos and videos appear in your gallery and hero section."
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ height: '6px', flex: 1, background: '#E8E2D8', borderRadius: '3px', marginRight: '16px' }}>
          <div style={{ height: '100%', width: `${(mediaUrls.length / limit) * 100}%`, background: mediaUrls.length >= limit ? '#C24A36' : '#7C9070', borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: '13px', color: mediaUrls.length >= limit ? '#C24A36' : '#5B6470', whiteSpace: 'nowrap' }}>
          {limit - mediaUrls.length} remaining
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {mediaUrls.map((m, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#EDE7D8' }}>
            {m.type === 'video' ? (
              <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <button
              onClick={() => removeMedia(i)}
              style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(27,36,48,0.75)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
          </div>
        ))}

        {mediaUrls.length < limit && (
          <label style={{ aspectRatio: '1', border: '2px dashed #D4CEC5', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px', background: uploading ? '#F2EDE3' : 'transparent' }}>
            <input type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
            <span style={{ fontSize: '24px', color: '#D4CEC5' }}>{uploading ? '…' : '+'}</span>
            <span style={{ fontSize: '11px', color: '#8A9099' }}>{uploading ? 'Uploading' : 'Add'}</span>
          </label>
        )}
      </div>
    </div>
  )
}

function SocialTab({ site, setSite }) {
  const { dirty, setDirty, saving, savedAt, save } = useSiteField(site, setSite)
  const [links, setLinks] = useState(
    SOCIAL_PLATFORMS.reduce((acc, p) => {
      const existing = site.social_links?.[p.key]
      acc[p.key] = { checked: !!existing, url: existing || '' }
      return acc
    }, {})
  )

  function handleSave() {
    const socialLinks = {}
    for (const p of SOCIAL_PLATFORMS) {
      if (links[p.key]?.checked && links[p.key]?.url?.trim()) {
        socialLinks[p.key] = links[p.key].url.trim()
      }
    }
    save({ social_links: socialLinks })
  }

  return (
    <div>
      <SectionHeader title="Social links" subtitle="Only platforms with a URL filled in appear on your site." />
      <SaveBar dirty={dirty} saving={saving} savedAt={savedAt} onSave={handleSave} />
      <div style={formCard}>
        {SOCIAL_PLATFORMS.map(p => {
          const entry = links[p.key]
          const hasSaved = !!site.social_links?.[p.key]
          return (
            <div key={p.key} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={entry?.checked || false}
                  onChange={() => {
                    setLinks(prev => ({ ...prev, [p.key]: { ...prev[p.key], checked: !prev[p.key]?.checked } }))
                    setDirty(true)
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#1B2430' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1B2430' }}>{p.label}</span>
                {hasSaved && <span style={{ fontSize: '11px', color: '#7C9070', marginLeft: 'auto' }}>✓ Active</span>}
              </label>
              {entry?.checked && (
                <input
                  style={{ ...inputStyle, marginLeft: '26px', width: 'calc(100% - 26px)' }}
                  value={entry.url || ''}
                  onChange={e => {
                    setLinks(prev => ({ ...prev, [p.key]: { ...prev[p.key], url: e.target.value } }))
                    setDirty(true)
                  }}
                  placeholder="https://..."
                  type="url"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PaymentsTab({ site }) {
  return (
    <div>
      <SectionHeader title="Payments" subtitle="Accept money from your customers — in person or remotely." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, borderLeft: '4px solid #1B2430' }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: 600, color: '#1B2430', marginBottom: '6px' }}>In person</h3>
          <p style={{ fontSize: '13px', color: '#5B6470', lineHeight: 1.55, marginBottom: '14px' }}>Tap-to-pay on your phone using Stripe Terminal. Customer taps their card, Apple Pay, or Google Pay — no card reader needed.</p>
          <a href="https://stripe.com/terminal" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: '#635BFF', fontWeight: 500 }}>Open Stripe Terminal →</a>
        </div>
        <div style={{ ...cardStyle, borderLeft: '4px solid #7C9070' }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '17px', fontWeight: 600, color: '#1B2430', marginBottom: '6px' }}>Remote</h3>
          <p style={{ fontSize: '13px', color: '#5B6470', lineHeight: 1.55, marginBottom: '14px' }}>Generate a payment link and text or email it to your customer. They pay online in seconds.</p>
          <button
            onClick={() => window.open(`https://dashboard.stripe.com/payment-links`, '_blank')}
            style={{ fontSize: '13px', color: '#7C9070', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Create a payment link →
          </button>
        </div>
      </div>
      {site.stripe_connect_account_id ? (
        <div style={{ background: '#F0F5EE', border: '1px solid #7C9070', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1B2430' }}>Stripe account connected</div>
            <div style={{ fontSize: '13px', color: '#5B6470' }}>Payments from customers go directly to your account.</div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#FFF8F0', border: '1px solid #E8D8C8', borderRadius: '8px', padding: '16px 20px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1B2430', marginBottom: '6px' }}>No Stripe account connected</div>
          <p style={{ fontSize: '13px', color: '#5B6470', marginBottom: '12px' }}>You need to connect a Stripe account to accept payments.</p>
          <button
            onClick={async () => {
              const res = await fetch('/api/stripe-connect-onboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId: site.customer_id }) })
              const { url } = await res.json()
              window.location.href = url
            }}
            style={{ padding: '9px 18px', background: '#635BFF', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Connect with Stripe
          </button>
        </div>
      )}
    </div>
  )
}

function TestimonialsTab({ site, setSite }) {
  const { dirty, setDirty, saving, savedAt, save } = useSiteField(site, setSite)
  const [testimonials, setTestimonials] = useState(site.testimonials || [])

  function add() {
    setTestimonials(prev => [...prev, { name: '', role: '', quote: '' }])
    setDirty(true)
  }

  function update(i, field, val) {
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t))
    setDirty(true)
  }

  function remove(i) {
    setTestimonials(prev => prev.filter((_, idx) => idx !== i))
    setDirty(true)
  }

  return (
    <div>
      <SectionHeader title="Testimonials" subtitle="Customer quotes shown on your Testimonials page and featured on your home page." />
      <SaveBar dirty={dirty} saving={saving} savedAt={savedAt} onSave={() => save({ testimonials })} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{ ...formCard, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#8A9099', fontWeight: 600 }}>TESTIMONIAL {i + 1}</span>
              <button onClick={() => remove(i)} style={{ fontSize: '12px', color: '#C24A36', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: '8px' }}
              value={t.quote} onChange={e => update(i, 'quote', e.target.value)} placeholder="What your customer said…" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input style={inputStyle} value={t.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Customer name" />
              <input style={inputStyle} value={t.role} onChange={e => update(i, 'role', e.target.value)} placeholder="Role or location (optional)" />
            </div>
          </div>
        ))}
        <button onClick={add} style={{ padding: '10px', background: 'none', border: '1.5px dashed #D4CEC5', borderRadius: '6px', fontSize: '13px', color: '#5B6470', cursor: 'pointer' }}>+ Add testimonial</button>
      </div>
    </div>
  )
}

function AccountTab({ site }) {
  return (
    <div>
      <SectionHeader title="Account" subtitle="Your subscription and billing details." />
      <div style={formCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E8E2D8', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1B2430', textTransform: 'capitalize' }}>{site.plan} plan</div>
            <div style={{ fontSize: '13px', color: '#8A9099' }}>
              {site.plan === 'starter' ? '$29' : site.plan === 'pro' ? '$59' : '$99'}/month
            </div>
          </div>
          <a href="/api/billing-portal" style={{ padding: '8px 16px', background: '#FAF6EE', border: '1px solid #D4CEC5', borderRadius: '5px', fontSize: '13px', color: '#1B2430', fontWeight: 500 }}>
            Manage billing
          </a>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#8A9099', marginBottom: '4px' }}>Want more features or uploads?</div>
          <a href="/upgrade" style={{ fontSize: '14px', color: '#C24A36', fontWeight: 500 }}>Upgrade your plan →</a>
        </div>
      </div>
      <div style={{ ...formCard, marginTop: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#C24A36', marginBottom: '8px' }}>Cancel subscription</div>
        <p style={{ fontSize: '13px', color: '#5B6470', lineHeight: 1.55, marginBottom: '12px' }}>
          Cancelling will take your site offline at the end of the billing period. Your data is preserved for 30 days.
        </p>
        <a href="/api/cancel" style={{ fontSize: '13px', color: '#C24A36', border: '1px solid #C24A36', padding: '7px 14px', borderRadius: '5px', display: 'inline-block' }}>Cancel subscription</a>
      </div>
    </div>
  )
}

// Utility components
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#1B2430', marginBottom: '4px' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '14px', color: '#5B6470' }}>{subtitle}</p>}
    </div>
  )
}

function EditField({ label, value, onChange, hint, multiline = false }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} />
      )}
      {hint && <p style={{ fontSize: '12px', color: '#8A9099', marginTop: '4px' }}>{hint}</p>}
    </div>
  )
}

function StatLabel({ children }) {
  return <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A9099', marginBottom: '4px' }}>{children}</div>
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6EE' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #E8E2D8', borderTopColor: '#1B2430', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function HexLogo({ size = 28, color = '#1B2430' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke={color} strokeWidth="1.8" fill="none" />
      <polygon points="16,10 20,16 16,22 12,16" fill={color} />
    </svg>
  )
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

const cardStyle = { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px', padding: '20px' }
const formCard = { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px', padding: '24px' }
const inputStyle = { padding: '9px 13px', border: '1.5px solid #D4CEC5', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff', width: '100%', color: '#1B2430' }
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1B2430', marginBottom: '5px' }
