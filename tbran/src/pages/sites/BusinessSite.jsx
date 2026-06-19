// Business tier: 6 pages — Home, About, Services, Gallery, Testimonials, Contact + Payments
import { useState } from 'react'

const SOCIAL_ICONS = {
  facebook: 'f', instagram: '◈', x: '𝕏', google: 'G', tiktok: '♪', youtube: '▶',
}

const PAGES = ['Home', 'About', 'Services', 'Gallery', 'Testimonials', 'Contact & Pay']

export default function BusinessSite({ site }) {
  const [page, setPage] = useState('Home')

  const {
    business_name, tagline, logo_url, about_text,
    services = [], media_urls = [],
    testimonials = [],
    contact_phone, contact_email, contact_address, contact_hours,
    social_links = {},
    stripe_connect_account_id,
  } = site

  const activeSocials = Object.entries(social_links).filter(([, url]) => url)
  const heroMedia = media_urls[0]
  const stripMedia = media_urls.slice(1, 5)
  const featuredQuote = testimonials[0]

  const s = siteStyles()

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1B2430' }}>
      {/* Nav */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <div style={{ cursor: 'pointer' }} onClick={() => setPage('Home')}>
            {logo_url
              ? <img src={logo_url} alt={business_name} style={{ height: '34px', objectFit: 'contain' }} />
              : <span style={s.logoText}>{business_name}</span>
            }
          </div>
          <nav style={s.navLinks}>
            {PAGES.map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ ...s.navBtn, fontWeight: page === p ? 600 : 400, color: page === p ? '#1B2430' : '#5B6470', borderBottom: page === p ? '2px solid #C24A36' : '2px solid transparent' }}>
                {p}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Home */}
      {page === 'Home' && (
        <div>
          {/* Hero */}
          <section style={{ position: 'relative', minHeight: '520px', background: '#1B2430', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {heroMedia && (
              heroMedia.type === 'video'
                ? <video src={heroMedia.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                : <img src={heroMedia.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            )}
            <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px', zIndex: 1 }}>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#FAF6EE', marginBottom: '14px', lineHeight: 1.1 }}>
                {business_name}
              </h1>
              {tagline && <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#C8D4C0', maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.6 }}>{tagline}</p>}
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setPage('Contact & Pay')}
                  style={{ padding: '13px 28px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                  Get in touch →
                </button>
                <button onClick={() => setPage('Services')}
                  style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.1)', color: '#FAF6EE', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '6px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                  View services
                </button>
              </div>
            </div>
          </section>

          {/* Media strip */}
          {stripMedia.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stripMedia.length}, 1fr)`, gap: '4px' }}>
              {stripMedia.map((m, i) => (
                <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#EDE7D8' }}>
                  {m.type === 'video'
                    ? <video src={m.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                </div>
              ))}
            </div>
          )}

          {/* Services preview */}
          {services.length > 0 && (
            <section style={s.section}>
              <div style={s.inner}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
                  <h2 style={s.h2}>What we offer</h2>
                  <button onClick={() => setPage('Services')} style={s.linkBtn}>See all →</button>
                </div>
                <div style={s.grid3}>
                  {services.slice(0, 3).map((svc, i) => (
                    <div key={i} style={s.card}>
                      <h3 style={s.cardTitle}>{svc.name}</h3>
                      {svc.description && <p style={s.cardBody}>{svc.description}</p>}
                      {svc.price && <div style={s.price}>{svc.price}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured testimonial */}
          {featuredQuote && (
            <section style={{ background: '#1B2430', padding: '64px 24px' }}>
              <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', color: '#C24A36', fontFamily: "'Fraunces', serif", lineHeight: 1, marginBottom: '16px' }}>"</div>
                <blockquote style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic', color: '#FAF6EE', lineHeight: 1.6, marginBottom: '24px' }}>
                  {featuredQuote.quote}
                </blockquote>
                <div style={{ fontSize: '14px', color: '#7C9070', fontWeight: 600 }}>{featuredQuote.name}</div>
                {featuredQuote.role && <div style={{ fontSize: '13px', color: '#5B6470', marginTop: '2px' }}>{featuredQuote.role}</div>}
                <button onClick={() => setPage('Testimonials')} style={{ marginTop: '20px', fontSize: '13px', color: '#C8D4C0', background: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '7px 14px', borderRadius: '5px', cursor: 'pointer' }}>
                  Read more reviews →
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {page === 'About' && (
        <section style={s.section}>
          <div style={{ ...s.inner, maxWidth: '680px' }}>
            <h1 style={{ ...s.pageTitle, marginBottom: '24px' }}>About us</h1>
            {about_text
              ? <p style={{ fontSize: '17px', color: '#1B2430', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{about_text}</p>
              : <p style={{ color: '#8A9099' }}>No about text added yet.</p>
            }
          </div>
        </section>
      )}

      {page === 'Services' && (
        <section style={s.section}>
          <div style={s.inner}>
            <h1 style={{ ...s.pageTitle, marginBottom: '36px' }}>Services</h1>
            <div style={s.grid3}>
              {services.map((svc, i) => (
                <div key={i} style={{ ...s.card, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={s.cardTitle}>{svc.name}</h3>
                  {svc.description && <p style={{ ...s.cardBody, flex: 1 }}>{svc.description}</p>}
                  {svc.price && <div style={s.price}>{svc.price}</div>}
                  <button
                    onClick={() => setPage('Contact & Pay')}
                    style={{ marginTop: '14px', padding: '9px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Get in touch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page === 'Gallery' && (
        <section style={s.section}>
          <div style={s.inner}>
            <h1 style={{ ...s.pageTitle, marginBottom: '32px' }}>Gallery</h1>
            {media_urls.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {media_urls.map((m, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#EDE7D8' }}>
                    {m.type === 'video'
                      ? <video src={m.url} muted playsInline controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#8A9099' }}>No photos uploaded yet.</p>
            )}
          </div>
        </section>
      )}

      {page === 'Testimonials' && (
        <section style={s.section}>
          <div style={s.inner}>
            <h1 style={{ ...s.pageTitle, marginBottom: '40px' }}>What customers say</h1>
            {testimonials.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {testimonials.map((t, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '24px', color: '#C24A36', fontFamily: "'Fraunces', serif", marginBottom: '12px' }}>"</div>
                    <p style={{ fontSize: '15px', color: '#1B2430', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '16px' }}>{t.quote}</p>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B2430' }}>{t.name}</div>
                    {t.role && <div style={{ fontSize: '12px', color: '#8A9099' }}>{t.role}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#8A9099' }}>No testimonials yet.</p>
            )}
          </div>
        </section>
      )}

      {page === 'Contact & Pay' && (
        <div>
          <section style={{ background: '#1B2430', padding: '72px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h1 style={{ ...s.pageTitle, color: '#FAF6EE', marginBottom: '40px' }}>Get in touch</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
                <div>
                  {contact_phone && <ContactLine icon="📞" text={contact_phone} />}
                  {contact_email && <ContactLine icon="✉" text={contact_email} />}
                  {contact_address && <ContactLine icon="📍" text={contact_address} />}
                  {contact_hours && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7C9070', marginBottom: '6px' }}>Hours</div>
                      <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#C8D4C0', whiteSpace: 'pre-wrap', margin: 0 }}>{contact_hours}</pre>
                    </div>
                  )}
                </div>
                <ContactForm toEmail={contact_email} businessName={business_name} />
              </div>
            </div>
          </section>

          {/* Payment panel */}
          <section style={{ padding: '64px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ ...s.h2, marginBottom: '8px' }}>Get paid</h2>
              <p style={{ fontSize: '15px', color: '#5B6470', marginBottom: '36px' }}>Pay by credit card, Apple Pay, or Google Pay — in person or remotely.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <PaymentCard
                  icon="📱"
                  title="In person (Tap to Pay)"
                  body="Present your phone to the customer. They tap their card, Apple Pay, or Google Pay — no card reader needed."
                  action={stripe_connect_account_id ? "Ready to use — open the Stripe app on your phone" : "Stripe account not connected yet"}
                  disabled={!stripe_connect_account_id}
                />
                <PaymentCard
                  icon="🔗"
                  title="Remote (Payment Link)"
                  body="Send a payment link by text or email. Customer pays online in seconds."
                  action="Create a payment link"
                  onClick={() => window.open('https://dashboard.stripe.com/payment-links', '_blank')}
                  disabled={!stripe_connect_account_id}
                />
              </div>
              {!stripe_connect_account_id && (
                <div style={{ marginTop: '20px', padding: '14px 18px', background: '#FFF8F0', border: '1px solid #E8D8C8', borderRadius: '8px', fontSize: '13px', color: '#8A6A50' }}>
                  Payment collection requires a connected Stripe account. Log in to your dashboard to set it up.
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.inner}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '13px', color: '#8A9099' }}>© {new Date().getFullYear()} {business_name}</p>
            {activeSocials.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', color: '#8A9099', marginBottom: '6px' }}>Find us online</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeSocials.map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      style={{ width: '30px', height: '30px', background: '#EDE7D8', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#5B6470', textDecoration: 'none' }}>
                      {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <a href="https://tbran.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '11px', color: '#C4BDB4' }}>
              Site built with Tbran Technologies
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PaymentCard({ icon, title, body, action, onClick, disabled }) {
  return (
    <div style={{ border: `1.5px solid ${disabled ? '#E8E2D8' : '#1B2430'}`, borderRadius: '12px', padding: '24px', background: disabled ? '#F6F4F0' : '#fff' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 600, color: '#1B2430', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#5B6470', lineHeight: 1.6, marginBottom: '16px' }}>{body}</p>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{ padding: '9px 18px', background: disabled ? '#D4CEC5' : '#1B2430', color: disabled ? '#8A9099' : '#FAF6EE', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 600, cursor: disabled ? 'default' : 'pointer' }}
      >
        {action}
      </button>
    </div>
  )
}

function ContactLine({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ fontSize: '14px', color: '#C8D4C0' }}>{text}</span>
    </div>
  )
}

function ContactForm({ toEmail, businessName }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
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

  if (sent) return (
    <div style={{ background: 'rgba(124,144,112,0.15)', border: '1px solid #7C9070', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#C8D4C0' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
      <div style={{ fontWeight: 600 }}>Message sent!</div>
    </div>
  )

  const inp = { padding: '10px 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: '6px', fontSize: '14px', color: '#FAF6EE', outline: 'none', width: '100%' }
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input style={inp} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      <textarea style={{ ...inp, minHeight: '100px', resize: 'vertical' }} placeholder="Your message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
      <button type="submit" disabled={sending}
        style={{ padding: '11px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

function siteStyles() {
  return {
    nav: { background: '#FAF6EE', borderBottom: '1px solid #E8E2D8', position: 'sticky', top: 0, zIndex: 50 },
    navInner: { maxWidth: '1040px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logoText: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '18px', color: '#1B2430' },
    navLinks: { display: 'flex', gap: '2px' },
    navBtn: { padding: '6px 10px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' },
    section: { padding: '72px 24px' },
    inner: { maxWidth: '1040px', margin: '0 auto' },
    h2: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1B2430' },
    pageTitle: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#1B2430' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
    card: { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px', padding: '22px' },
    cardTitle: { fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 600, color: '#1B2430', marginBottom: '8px' },
    cardBody: { fontSize: '14px', color: '#5B6470', lineHeight: 1.55, marginBottom: '10px' },
    price: { fontSize: '14px', fontWeight: 600, color: '#C24A36' },
    linkBtn: { fontSize: '14px', color: '#C24A36', background: 'none', border: 'none', cursor: 'pointer' },
    footer: { padding: '32px 24px', borderTop: '1px solid #E8E2D8' },
  }
}
