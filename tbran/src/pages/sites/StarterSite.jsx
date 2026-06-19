// Starter tier: single-scroll page — hero, services, contact + footer attribution

const SOCIAL_ICONS = {
  facebook: 'f',
  instagram: '◈',
  x: '𝕏',
  google: 'G',
  tiktok: '♪',
  youtube: '▶',
}

export default function StarterSite({ site }) {
  const {
    business_name, tagline, logo_url, services = [],
    contact_phone, contact_email, contact_address, contact_hours,
    social_links = {},
  } = site

  const activeSocials = Object.entries(social_links).filter(([, url]) => url)

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const s = siteStyles()

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1B2430' }}>
      {/* Nav */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo}>
            {logo_url
              ? <img src={logo_url} alt={business_name} style={{ height: '36px', objectFit: 'contain' }} />
              : <span style={s.logoText}>{business_name}</span>
            }
          </div>
          <div style={s.navLinks}>
            <button style={s.navBtn} onClick={() => scrollTo('services')}>Services</button>
            <button style={s.navBtn} onClick={() => scrollTo('contact')}>Contact</button>
            <button style={s.navCta} onClick={() => scrollTo('contact')}>Get in touch</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          {logo_url && <img src={logo_url} alt={business_name} style={{ height: '64px', objectFit: 'contain', marginBottom: '20px' }} />}
          <h1 style={s.h1}>{business_name}</h1>
          {tagline && <p style={s.tagline}>{tagline}</p>}
          <button style={s.heroCta} onClick={() => scrollTo('contact')}>Get in touch →</button>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section id="services" style={s.section}>
          <div style={s.sectionInner}>
            <h2 style={s.sectionH2}>What we offer</h2>
            <div style={s.grid}>
              {services.map((svc, i) => (
                <div key={i} style={s.serviceCard}>
                  <h3 style={s.serviceTitle}>{svc.name}</h3>
                  {svc.description && <p style={s.serviceDesc}>{svc.description}</p>}
                  {svc.price && <div style={s.servicePrice}>{svc.price}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" style={{ ...s.section, background: '#1B2430' }}>
        <div style={s.sectionInner}>
          <h2 style={{ ...s.sectionH2, color: '#FAF6EE' }}>Get in touch</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            <div>
              {contact_phone && <ContactLine icon="📞" text={contact_phone} light />}
              {contact_email && <ContactLine icon="✉" text={contact_email} light />}
              {contact_address && <ContactLine icon="📍" text={contact_address} light />}
              {contact_hours && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7C9070', marginBottom: '6px' }}>Hours</div>
                  <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#C8D4C0', whiteSpace: 'pre-wrap', margin: 0 }}>{contact_hours}</pre>
                </div>
              )}
            </div>
            <ContactForm toEmail={contact_email} businessName={business_name} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          {activeSocials.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {activeSocials.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ width: '32px', height: '32px', background: '#EDE7D8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#5B6470', textDecoration: 'none' }}>
                  {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                </a>
              ))}
            </div>
          )}
          <p style={{ fontSize: '13px', color: '#8A9099' }}>© {new Date().getFullYear()} {business_name}</p>
          <a href="https://tbran.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '11px', color: '#C4BDB4', marginTop: '8px', display: 'block' }}>
            Site built with Tbran Technologies
          </a>
        </div>
      </footer>
    </div>
  )
}

function ContactLine({ icon, text, light }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ fontSize: '14px', color: light ? '#C8D4C0' : '#5B6470' }}>{text}</span>
    </div>
  )
}

function ContactForm({ toEmail, businessName }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!form.email.trim()) e.email = true
    if (!form.message.trim()) e.message = true
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, toEmail, businessName }),
      })
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div style={{ background: 'rgba(124,144,112,0.15)', border: '1px solid #7C9070', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#C8D4C0' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Message sent!</div>
        <div style={{ fontSize: '13px' }}>We'll be in touch soon.</div>
      </div>
    )
  }

  const inputS = {
    padding: '10px 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '6px', fontSize: '14px', color: '#FAF6EE', outline: 'none', width: '100%',
  }
  const errColor = '#C24A36'

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input style={{ ...inputS, borderColor: errors.name ? errColor : undefined }} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <input style={{ ...inputS, borderColor: errors.email ? errColor : undefined }} placeholder="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      <textarea style={{ ...inputS, minHeight: '100px', resize: 'vertical', borderColor: errors.message ? errColor : undefined }} placeholder="Your message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
      <button type="submit" disabled={sending}
        style={{ padding: '11px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: sending ? 0.7 : 1 }}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

import { useState } from 'react'

function siteStyles() {
  return {
    nav: { background: '#FAF6EE', borderBottom: '1px solid #E8E2D8', position: 'sticky', top: 0, zIndex: 50 },
    navInner: { maxWidth: '1000px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { display: 'flex', alignItems: 'center' },
    logoText: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '18px', color: '#1B2430' },
    navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
    navBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#5B6470', fontFamily: "'Inter', sans-serif" },
    navCta: { padding: '8px 16px', background: '#1B2430', color: '#FAF6EE', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    hero: { background: '#FAF6EE', padding: '80px 24px', textAlign: 'center' },
    heroInner: { maxWidth: '640px', margin: '0 auto' },
    h1: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#1B2430', marginBottom: '12px', lineHeight: 1.1 },
    tagline: { fontSize: 'clamp(16px, 2vw, 19px)', color: '#5B6470', lineHeight: 1.6, marginBottom: '32px' },
    heroCta: { padding: '13px 32px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    section: { padding: '72px 24px' },
    sectionInner: { maxWidth: '1000px', margin: '0 auto' },
    sectionH2: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: '#1B2430', marginBottom: '40px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
    serviceCard: { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px', padding: '22px' },
    serviceTitle: { fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 600, color: '#1B2430', marginBottom: '8px' },
    serviceDesc: { fontSize: '14px', color: '#5B6470', lineHeight: 1.55, marginBottom: '10px' },
    servicePrice: { fontSize: '14px', fontWeight: 600, color: '#C24A36' },
    footer: { padding: '36px 24px', borderTop: '1px solid #E8E2D8' },
    footerInner: { maxWidth: '1000px', margin: '0 auto' },
  }
}
