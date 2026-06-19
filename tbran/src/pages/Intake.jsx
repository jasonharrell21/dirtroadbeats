import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase.js'

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: 'f' },
  { key: 'instagram', label: 'Instagram', icon: '⌂' },
  { key: 'x', label: 'X (Twitter)', icon: 'x' },
  { key: 'google', label: 'Google Business', icon: 'G' },
  { key: 'tiktok', label: 'TikTok', icon: '♪' },
  { key: 'youtube', label: 'YouTube', icon: '▶' },
]

const BUSINESS_CATEGORIES = [
  'Auto & Vehicles', 'Beauty & Personal Care', 'Construction & Contractors',
  'Food & Restaurant', 'Health & Wellness', 'Home Services', 'Landscaping',
  'Legal & Professional', 'Marine & Boats', 'Pet Services', 'Photography',
  'Real Estate', 'Retail & Shop', 'Sports & Recreation', 'Other',
]

// Slugify a string
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 32)
}

// Tier limits
const UPLOAD_LIMITS = { starter: 0, pro: 10, business: 25 }

export default function Intake() {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('session_id')

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [errors, setErrors] = useState({})

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugStatus, setSlugStatus] = useState('idle') // idle | checking | available | taken
  const [category, setCategory] = useState('')
  const [tagline, setTagline] = useState('')
  const [about, setAbout] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaPreviews, setMediaPreviews] = useState([])
  const [services, setServices] = useState([{ name: '', description: '', price: '' }])
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [contactHours, setContactHours] = useState('')
  const [socials, setSocials] = useState({}) // { facebook: { checked: bool, url: '' }, ... }
  const [stripeConnectDone, setStripeConnectDone] = useState(false)

  const slugCheckTimer = useRef(null)

  // Load customer from session on mount
  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/intake-session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.customer) setCustomer(data.customer)
      })
      .catch(() => {})
  }, [sessionId])

  const tier = customer?.plan || 'starter'
  const uploadLimit = UPLOAD_LIMITS[tier]
  const canUploadPhotos = tier === 'pro' || tier === 'business'
  const hasSocialLinks = tier === 'pro' || tier === 'business'
  const hasAbout = tier === 'pro' || tier === 'business'
  const hasPayments = tier === 'business'

  // Total steps: starter=4, pro=6, business=7
  const totalSteps = tier === 'business' ? 7 : tier === 'pro' ? 6 : 4

  // Slug auto-suggest from business name
  useEffect(() => {
    const suggested = toSlug(businessName)
    setSlug(suggested)
  }, [businessName])

  // Debounced slug availability check
  useEffect(() => {
    if (!slug) { setSlugStatus('idle'); return }
    setSlugStatus('checking')
    clearTimeout(slugCheckTimer.current)
    slugCheckTimer.current = setTimeout(async () => {
      const { data } = await supabase.from('sites').select('slug').eq('slug', slug).maybeSingle()
      setSlugStatus(data ? 'taken' : 'available')
    }, 500)
    return () => clearTimeout(slugCheckTimer.current)
  }, [slug])

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function handleMediaChange(e) {
    const files = Array.from(e.target.files)
    const remaining = uploadLimit - mediaFiles.length
    const toAdd = files.slice(0, remaining)
    setMediaFiles(prev => [...prev, ...toAdd])
    setMediaPreviews(prev => [...prev, ...toAdd.map(f => ({ url: URL.createObjectURL(f), type: f.type.startsWith('video') ? 'video' : 'image', name: f.name }))])
  }

  function removeMedia(i) {
    setMediaFiles(prev => prev.filter((_, idx) => idx !== i))
    setMediaPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  function addService() {
    setServices(prev => [...prev, { name: '', description: '', price: '' }])
  }

  function updateService(i, field, val) {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  function removeService(i) {
    if (services.length === 1) return
    setServices(prev => prev.filter((_, idx) => idx !== i))
  }

  function toggleSocial(key) {
    setSocials(prev => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], checked: !prev[key].checked }
        : { checked: true, url: '' }
    }))
  }

  function updateSocialUrl(key, url) {
    setSocials(prev => ({ ...prev, [key]: { ...prev[key], url } }))
  }

  function validate() {
    const e = {}
    if (step === 1) {
      if (!businessName.trim()) e.businessName = true
      if (!slug) e.slug = true
      if (slugStatus === 'taken') e.slugTaken = true
      if (!category) e.category = true
      if (!tagline.trim()) e.tagline = true
    }
    if (step === 2) {
      // services: at least one with a name
      if (!services.some(s => s.name.trim())) e.services = true
    }
    if (step === 3) {
      if (!contactPhone.trim() && !contactEmail.trim()) e.contact = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function nextStep() {
    if (!validate()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prevStep() {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadFile(file, bucket, path) {
    const { data: signData, error: signErr } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path)
    if (signErr) throw signErr

    const res = await fetch(signData.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (!res.ok) throw new Error('Upload failed')
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      const customerId = customer?.id || crypto.randomUUID()

      // Upload logo
      let logoUrl = null
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        logoUrl = await uploadFile(logoFile, 'site-assets', `${slug}/logo-${Date.now()}.${ext}`)
      }

      // Upload media files
      const mediaUrls = []
      for (let i = 0; i < mediaFiles.length; i++) {
        const f = mediaFiles[i]
        const ext = f.name.split('.').pop()
        const url = await uploadFile(f, 'site-assets', `${slug}/media-${i}-${Date.now()}.${ext}`)
        mediaUrls.push({ url, type: f.type.startsWith('video') ? 'video' : 'image' })
      }

      // Build social links — only platforms with a URL
      const socialLinks = {}
      for (const p of SOCIAL_PLATFORMS) {
        const entry = socials[p.key]
        if (entry?.checked && entry?.url?.trim()) {
          socialLinks[p.key] = entry.url.trim()
        }
      }

      const siteData = {
        customer_id: customerId,
        slug,
        business_name: businessName,
        business_category: category,
        tagline,
        about_text: about,
        logo_url: logoUrl,
        media_urls: mediaUrls,
        services: services.filter(s => s.name.trim()),
        contact_phone: contactPhone,
        contact_email: contactEmail,
        contact_address: contactAddress,
        contact_hours: contactHours,
        social_links: socialLinks,
        plan: tier,
        is_live: true,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('sites').upsert(siteData, { onConflict: 'slug' })
      if (error) throw error

      setDone(true)
    } catch (err) {
      alert('Something went wrong: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return <SuccessScreen slug={slug} tier={tier} />
  }

  const s = styles()

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <HexLogo size={24} />
            <span style={s.logoText}>Tbran Technologies</span>
          </div>
          <h1 style={s.h1}>Set up your website</h1>
          <p style={s.sub}>
            {tier === 'starter' && 'Starter plan · Single-scroll page'}
            {tier === 'pro' && 'Pro plan · Up to 5 pages'}
            {tier === 'business' && 'Business plan · Full site with payments'}
          </p>
          {/* Progress bar */}
          <div style={s.progressBar}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ ...s.progressDot, background: i < step ? '#C24A36' : i === step - 1 ? '#C24A36' : '#E8E2D8' }} />
            ))}
          </div>
          <div style={s.stepLabel}>Step {step} of {totalSteps}</div>
        </div>

        {/* Step 1: Business identity */}
        {step === 1 && (
          <StepCard title="Your business" subtitle="Basic info that goes on every page.">
            <Field label="Business name *" error={errors.businessName && 'Required'}>
              <input
                style={{ ...s.input, borderColor: errors.businessName ? '#C24A36' : undefined }}
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Tom's Boats"
              />
            </Field>

            <Field label="Subdomain *" error={errors.slugTaken ? 'This subdomain is taken — try another.' : errors.slug ? 'Required' : null}
              hint={<span>Your site will be live at <code style={s.code}>{slug || 'yourbiz'}.tbran.com</code></span>}>
              <div style={s.slugRow}>
                <input
                  style={{ ...s.input, ...s.slugInput, borderColor: errors.slugTaken || errors.slug ? '#C24A36' : slugStatus === 'available' ? '#7C9070' : undefined }}
                  value={slug}
                  onChange={e => setSlug(toSlug(e.target.value))}
                  placeholder="tomsboats"
                />
                <div style={s.slugBadge(slugStatus)}>
                  {slugStatus === 'checking' && '…'}
                  {slugStatus === 'available' && '✓ Available'}
                  {slugStatus === 'taken' && '✗ Taken'}
                </div>
              </div>
            </Field>

            <Field label="Business category *" error={errors.category && 'Required'}>
              <select
                style={{ ...s.input, borderColor: errors.category ? '#C24A36' : undefined }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Select a category…</option>
                {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Tagline *" error={errors.tagline && 'Required'} hint="One line that captures what makes you great.">
              <input
                style={{ ...s.input, borderColor: errors.tagline ? '#C24A36' : undefined }}
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Custom boats built for life on the water."
                maxLength={100}
              />
            </Field>

            <Field label="Logo (optional)" hint="PNG or SVG recommended. Shows in your site header.">
              <LogoUpload preview={logoPreview} onChange={handleLogoChange} s={s} />
            </Field>

            <StepNav onNext={nextStep} showBack={false} />
          </StepCard>
        )}

        {/* Step 2: Services / Products */}
        {step === 2 && (
          <StepCard title="Services & products" subtitle="What do you offer? Add as many as you like.">
            {errors.services && <ErrorBanner message="Add at least one service or product name." />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map((svc, i) => (
                <div key={i} style={s.serviceCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#5B6470' }}>Item {i + 1}</span>
                    {services.length > 1 && (
                      <button onClick={() => removeService(i)} style={s.removeBtn}>Remove</button>
                    )}
                  </div>
                  <Field label="Name *">
                    <input style={s.input} value={svc.name} onChange={e => updateService(i, 'name', e.target.value)} placeholder="Boat repair" />
                  </Field>
                  <Field label="Description">
                    <textarea style={{ ...s.input, minHeight: '72px', resize: 'vertical' }} value={svc.description} onChange={e => updateService(i, 'description', e.target.value)} placeholder="Hull repairs, engine service, and seasonal maintenance." />
                  </Field>
                  <Field label="Price (optional)">
                    <input style={{ ...s.input, maxWidth: '180px' }} value={svc.price} onChange={e => updateService(i, 'price', e.target.value)} placeholder="$150 / hr" />
                  </Field>
                </div>
              ))}
            </div>
            <button onClick={addService} style={s.addBtn}>+ Add another item</button>
            <StepNav onNext={nextStep} onBack={prevStep} />
          </StepCard>
        )}

        {/* Step 3: Contact info */}
        {step === 3 && (
          <StepCard title="Contact info" subtitle="How customers can reach you.">
            {errors.contact && <ErrorBanner message="Please provide at least a phone number or email address." />}
            <Field label="Phone number">
              <input style={s.input} value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="(555) 867-5309" type="tel" />
            </Field>
            <Field label="Email address">
              <input style={s.input} value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="tom@tomsboats.com" type="email" />
            </Field>
            <Field label="Address" hint="Leave blank if you don't serve from a fixed location.">
              <input style={s.input} value={contactAddress} onChange={e => setContactAddress(e.target.value)} placeholder="123 Harbor Rd, Lake City, TX 75001" />
            </Field>
            <Field label="Hours of operation">
              <textarea
                style={{ ...s.input, minHeight: '72px', resize: 'vertical' }}
                value={contactHours}
                onChange={e => setContactHours(e.target.value)}
                placeholder={"Mon–Fri: 8am–5pm\nSat: 9am–2pm\nSun: Closed"}
              />
            </Field>
            <StepNav onNext={nextStep} onBack={prevStep} />
          </StepCard>
        )}

        {/* Step 4: Photos/media (Pro + Business only) */}
        {step === 4 && canUploadPhotos && (
          <StepCard title="Photos & videos" subtitle={`Upload up to ${uploadLimit} photos or videos. These appear in your gallery and hero section.`}>
            <MediaUploader
              files={mediaPreviews}
              onAdd={handleMediaChange}
              onRemove={removeMedia}
              limit={uploadLimit}
              s={s}
            />
            <StepNav onNext={nextStep} onBack={prevStep} nextLabel="Next" />
          </StepCard>
        )}

        {/* Step 4 (Starter) / 5 (Pro/Business): About + Social */}
        {((step === 4 && !canUploadPhotos) || (step === 5 && canUploadPhotos)) && (
          <StepCard
            title={hasAbout ? 'Your story & social links' : 'Review & launch'}
            subtitle={hasAbout ? 'Tell visitors what makes your business special.' : 'Everything looks good — review and go live.'}
          >
            {hasAbout && (
              <Field label="About your business" hint="A few sentences about who you are, how long you've been in business, and what sets you apart.">
                <textarea
                  style={{ ...s.input, minHeight: '120px', resize: 'vertical' }}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Tom's Boats has been serving the Lake City area since 1987. We specialize in custom aluminum fishing boats and honest service…"
                />
              </Field>
            )}

            {hasSocialLinks && (
              <Field label="Social links" hint="Check a platform and paste in your profile URL. Only filled-in links appear on your site.">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SOCIAL_PLATFORMS.map(p => {
                    const entry = socials[p.key] || { checked: false, url: '' }
                    return (
                      <div key={p.key}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={entry.checked || false}
                            onChange={() => toggleSocial(p.key)}
                            style={{ width: '16px', height: '16px', accentColor: '#1B2430' }}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1B2430' }}>{p.label}</span>
                        </label>
                        {entry.checked && (
                          <input
                            style={{ ...s.input, marginTop: '6px', marginLeft: '26px', width: 'calc(100% - 26px)' }}
                            value={entry.url || ''}
                            onChange={e => updateSocialUrl(p.key, e.target.value)}
                            placeholder={`https://facebook.com/yourpage`}
                            type="url"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </Field>
            )}

            {!canUploadPhotos && <ReviewSummary slug={slug} businessName={businessName} tagline={tagline} category={category} services={services} />}
            <StepNav onNext={nextStep} onBack={prevStep} />
          </StepCard>
        )}

        {/* Step 6 (Pro) or 6 (Business) — Review */}
        {step === 6 && canUploadPhotos && !hasPayments && (
          <StepCard title="Review & launch" subtitle="Everything looks good? Hit publish and your site goes live instantly.">
            <ReviewSummary slug={slug} businessName={businessName} tagline={tagline} category={category} services={services} />
            <StepNav onNext={handleSubmit} onBack={prevStep} nextLabel={saving ? 'Launching…' : 'Launch my site'} nextStyle={{ background: '#C24A36' }} disabled={saving} />
          </StepCard>
        )}

        {/* Business-only: Stripe Connect step */}
        {step === 6 && hasPayments && (
          <StepCard title="Set up payments" subtitle="To accept payments from your customers, connect your Stripe account. This takes about 3 minutes.">
            <StripeConnectOnboarding
              customerId={customer?.id}
              done={stripeConnectDone}
              onDone={() => setStripeConnectDone(true)}
              s={s}
            />
            <StepNav
              onNext={nextStep}
              onBack={prevStep}
              nextLabel="Continue to review"
              disabled={!stripeConnectDone}
            />
          </StepCard>
        )}

        {/* Business: Final review */}
        {step === 7 && hasPayments && (
          <StepCard title="Review & launch" subtitle="Everything looks good? Hit publish and your site goes live instantly.">
            <ReviewSummary slug={slug} businessName={businessName} tagline={tagline} category={category} services={services} />
            <StepNav onNext={handleSubmit} onBack={prevStep} nextLabel={saving ? 'Launching…' : 'Launch my site'} nextStyle={{ background: '#C24A36' }} disabled={saving} />
          </StepCard>
        )}
      </div>
    </div>
  )
}

// Sub-components

function StepCard({ title, subtitle, children }) {
  const s = styles()
  return (
    <div style={s.card}>
      <h2 style={s.cardTitle}>{title}</h2>
      {subtitle && <p style={s.cardSub}>{subtitle}</p>}
      <div style={s.fields}>{children}</div>
    </div>
  )
}

function Field({ label, hint, error, children }) {
  const s = styles()
  return (
    <div style={s.field}>
      {label && <label style={s.label}>{label}</label>}
      {children}
      {hint && !error && <p style={s.hint}>{hint}</p>}
      {error && <p style={s.error}>{error}</p>}
    </div>
  )
}

function StepNav({ onNext, onBack, showBack = true, nextLabel = 'Continue', nextStyle = {}, disabled = false }) {
  const s = styles()
  return (
    <div style={s.stepNav}>
      {showBack && onBack && (
        <button onClick={onBack} style={s.backBtn}>← Back</button>
      )}
      <button onClick={onNext} style={{ ...s.nextBtn, ...nextStyle, opacity: disabled ? 0.6 : 1 }} disabled={disabled}>
        {nextLabel} {!nextLabel.includes('…') && nextLabel !== 'Launch my site' && '→'}
      </button>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div style={{ background: '#FDF0EE', border: '1px solid #C24A36', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', color: '#C24A36', marginBottom: '16px' }}>
      {message}
    </div>
  )
}

function LogoUpload({ preview, onChange, s }) {
  return (
    <label style={{ display: 'block', cursor: 'pointer' }}>
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onChange} />
      <div style={{
        border: '2px dashed #D4CEC5', borderRadius: '8px', padding: '24px',
        textAlign: 'center', transition: 'border-color 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      }}>
        {preview ? (
          <img src={preview} alt="Logo preview" style={{ maxHeight: '60px', maxWidth: '200px', objectFit: 'contain' }} />
        ) : (
          <>
            <div style={{ fontSize: '28px', color: '#D4CEC5' }}>⬆</div>
            <div style={{ fontSize: '14px', color: '#8A9099' }}>Click to upload logo</div>
            <div style={{ fontSize: '12px', color: '#C4BDB4' }}>PNG, SVG, JPG</div>
          </>
        )}
        {preview && <span style={{ fontSize: '12px', color: '#7C9070' }}>✓ Logo uploaded — click to change</span>}
      </div>
    </label>
  )
}

function MediaUploader({ files, onAdd, onRemove, limit, s }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1B2430' }}>Photos & videos</span>
        <span style={{ fontSize: '13px', color: files.length >= limit ? '#C24A36' : '#8A9099' }}>
          {files.length} / {limit} used
        </span>
      </div>

      {/* Thumbnails */}
      {files.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          {files.map((f, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', background: '#EDE7D8' }}>
              {f.type === 'video' ? (
                <video src={f.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={f.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <button
                onClick={() => onRemove(i)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(27,36,48,0.7)', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {files.length < limit && (
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <input type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={onAdd} />
          <div style={{ border: '2px dashed #D4CEC5', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#D4CEC5', marginBottom: '6px' }}>⬆</div>
            <div style={{ fontSize: '14px', color: '#8A9099' }}>Click to add photos or videos</div>
            <div style={{ fontSize: '12px', color: '#C4BDB4', marginTop: '4px' }}>{limit - files.length} remaining</div>
          </div>
        </label>
      )}
    </div>
  )
}

function ReviewSummary({ slug, businessName, tagline, category, services }) {
  const items = [
    { label: 'Site URL', value: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{slug}.tbran.com</code> },
    { label: 'Business name', value: businessName },
    { label: 'Tagline', value: tagline },
    { label: 'Category', value: category },
    { label: 'Services', value: `${services.filter(s => s.name.trim()).length} item${services.filter(s => s.name.trim()).length !== 1 ? 's' : ''}` },
  ]
  return (
    <div style={{ border: '1px solid #E8E2D8', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', gap: '16px', padding: '12px 16px', borderBottom: i < items.length - 1 ? '1px solid #E8E2D8' : 'none', background: i % 2 === 0 ? '#FAF6EE' : '#fff' }}>
          <span style={{ fontSize: '13px', color: '#8A9099', minWidth: '110px' }}>{item.label}</span>
          <span style={{ fontSize: '13px', color: '#1B2430', fontWeight: 500 }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function StripeConnectOnboarding({ customerId, done, onDone, s }) {
  const [loading, setLoading] = useState(false)

  async function startOnboarding() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe-connect-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch {
      alert('Failed to start onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: '#F0F5EE', border: '1px solid #7C9070', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
        <div style={{ fontWeight: 600, color: '#1B2430' }}>Stripe account connected</div>
        <div style={{ fontSize: '14px', color: '#5B6470', marginTop: '4px' }}>You're ready to accept payments from customers.</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: '#FFF8F0', border: '1px solid #E8D8C8', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ fontWeight: 600, color: '#1B2430', marginBottom: '8px' }}>Why do I need a Stripe account?</h4>
        <p style={{ fontSize: '14px', color: '#5B6470', lineHeight: 1.6 }}>
          Your Business plan lets customers pay you directly — in person via tap-to-pay, or remotely via a payment link.
          We use Stripe to securely route those payments straight to your bank account. Setup takes about 3 minutes.
        </p>
      </div>
      <button
        onClick={startOnboarding}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', background: '#635BFF', color: '#fff',
          border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600,
          cursor: 'pointer', opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Loading…' : 'Connect with Stripe →'}
      </button>
      <p style={{ fontSize: '12px', color: '#8A9099', marginTop: '10px', textAlign: 'center' }}>
        You'll be redirected to Stripe and then back here automatically.
      </p>
    </div>
  )
}

function SuccessScreen({ slug, tier }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 700, color: '#1B2430', marginBottom: '12px' }}>
          Your site is live!
        </h1>
        <p style={{ fontSize: '16px', color: '#5B6470', lineHeight: 1.65, marginBottom: '28px' }}>
          Head to{' '}
          <a
            href={`https://${slug}.tbran.com`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#C24A36', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
          >
            {slug}.tbran.com
          </a>{' '}
          to see it. Come back to your dashboard any time to make edits.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`https://${slug}.tbran.com`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '12px 24px', background: '#C24A36', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: 600 }}
          >
            View my site
          </a>
          <a
            href="/dashboard"
            style={{ padding: '12px 24px', background: '#fff', color: '#1B2430', border: '1.5px solid #D4CEC5', borderRadius: '6px', fontSize: '15px', fontWeight: 600 }}
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

function HexLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="#1B2430" strokeWidth="1.8" fill="none" />
      <polygon points="16,10 20,16 16,22 12,16" fill="#1B2430" />
    </svg>
  )
}

// Style factory (called once per render — avoids inline object churn for repeated elements)
function styles() {
  return {
    page: { minHeight: '100vh', background: '#FAF6EE', padding: '32px 24px 80px' },
    container: { maxWidth: '580px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '36px' },
    logoRow: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '20px' },
    logoText: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '16px', color: '#1B2430' },
    h1: { fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: 700, color: '#1B2430', marginBottom: '6px' },
    sub: { fontSize: '14px', color: '#8A9099', marginBottom: '20px' },
    progressBar: { display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '6px' },
    progressDot: { width: '8px', height: '8px', borderRadius: '50%', transition: 'background 0.3s' },
    stepLabel: { fontSize: '12px', color: '#8A9099' },
    card: { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '12px', padding: '32px 28px' },
    cardTitle: { fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#1B2430', marginBottom: '6px' },
    cardSub: { fontSize: '14px', color: '#5B6470', marginBottom: '28px', lineHeight: 1.5 },
    fields: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 600, color: '#1B2430' },
    hint: { fontSize: '12px', color: '#8A9099' },
    error: { fontSize: '12px', color: '#C24A36' },
    input: {
      padding: '10px 14px', border: '1.5px solid #D4CEC5', borderRadius: '6px',
      fontSize: '15px', outline: 'none', background: '#fff', width: '100%',
      color: '#1B2430', transition: 'border-color 0.2s',
    },
    slugRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    slugInput: { fontFamily: "'JetBrains Mono', monospace" },
    slugBadge: (status) => ({
      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
      color: status === 'available' ? '#7C9070' : status === 'taken' ? '#C24A36' : '#8A9099',
    }),
    code: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', background: '#F2EDE3', padding: '1px 5px', borderRadius: '3px' },
    serviceCard: { background: '#FAF6EE', border: '1px solid #E8E2D8', borderRadius: '8px', padding: '16px' },
    addBtn: { marginTop: '4px', padding: '8px 16px', background: 'transparent', border: '1.5px dashed #D4CEC5', borderRadius: '6px', fontSize: '14px', color: '#5B6470', cursor: 'pointer', width: '100%' },
    removeBtn: { fontSize: '12px', color: '#C24A36', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
    stepNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E8E2D8' },
    backBtn: { fontSize: '14px', color: '#8A9099', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' },
    nextBtn: { padding: '11px 28px', background: '#1B2430', color: '#FAF6EE', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
  }
}
