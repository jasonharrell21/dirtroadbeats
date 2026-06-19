import { useState, useEffect } from 'react'

const TIERS = [
  {
    name: 'Starter',
    price: 29,
    tagline: 'Your business online in minutes.',
    features: [
      'Single-scroll page with hero, services & contact',
      'Logo upload',
      'Contact form included',
      'Custom subdomain (yourbiz.tbran.com)',
      '"Built with Tbran" attribution footer',
    ],
    cta: 'Get started',
    priceId: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
    accent: '#7C9070',
  },
  {
    name: 'Pro',
    price: 59,
    tagline: 'Five pages. Real presence.',
    features: [
      'Everything in Starter',
      'Up to 5 pages with navigation',
      'Hero cover photo or video',
      'Gallery page + 4-item media strip',
      'About your business story block',
      'Social links (Facebook, Instagram, Google & more)',
      'Up to 10 photo/video uploads',
    ],
    cta: 'Go Pro',
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    accent: '#C24A36',
    highlight: true,
  },
  {
    name: 'Business',
    price: 99,
    tagline: 'Get paid. Build trust.',
    features: [
      'Everything in Pro',
      'Testimonials page + featured quote',
      'In-person tap-to-pay (Stripe Terminal)',
      'Remote payment links via text or email',
      'Up to 25 photo/video uploads',
      'Your own Stripe payments account',
    ],
    cta: 'Go Business',
    priceId: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID,
    accent: '#1B2430',
  },
]

const EXAMPLE_SITES = [
  { slug: 'tomsboats', name: "Tom's Boats", category: 'Marine Dealer', tier: 'Pro' },
  { slug: 'sunsetlawn', name: 'Sunset Lawn Care', category: 'Landscaping', tier: 'Starter' },
  { slug: 'velvetcutsalon', name: 'Velvet Cut Salon', category: 'Hair & Beauty', tier: 'Business' },
]

const NAV_LINKS = ['How it works', 'Pricing', 'Examples']

export default function Marketing() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  function startCheckout(priceId) {
    // Redirect to Stripe Checkout; on success redirect to /intake?session_id={CHECKOUT_SESSION_ID}
    window.location.href = `/api/stripe-checkout?priceId=${priceId}`
  }

  const s = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(250,246,238,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #E8E2D8' : 'none',
      transition: 'all 0.3s ease',
    },
    navInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logoArea: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoText: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '17px', color: '#1B2430' },
    navLinks: { display: 'flex', gap: '32px', alignItems: 'center' },
    navLink: { fontSize: '14px', fontWeight: 500, color: '#5B6470', cursor: 'pointer', background: 'none', border: 'none' },
    navCta: { padding: '8px 18px', background: '#1B2430', color: '#FAF6EE', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none' },
    hero: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center' },
    heroEyebrow: { display: 'inline-block', padding: '4px 14px', background: '#EDE7D8', borderRadius: '100px', fontSize: '12px', fontWeight: 600, color: '#5B6470', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '28px' },
    heroH1: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 700, color: '#1B2430', lineHeight: 1.1, maxWidth: '820px', marginBottom: '20px' },
    heroAccent: { color: '#C24A36', fontStyle: 'italic' },
    heroSub: { fontSize: 'clamp(16px, 2vw, 19px)', color: '#5B6470', maxWidth: '560px', lineHeight: 1.65, marginBottom: '44px' },
    heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' },
    btnPrimary: { padding: '14px 32px', background: '#C24A36', color: '#fff', borderRadius: '6px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer' },
    btnSecondary: { padding: '14px 32px', background: 'transparent', color: '#1B2430', borderRadius: '6px', fontSize: '16px', fontWeight: 600, border: '2px solid #D4CEC5', cursor: 'pointer' },
    mockupRow: { display: 'flex', gap: '16px', marginTop: '72px', overflow: 'hidden', maxWidth: '960px', width: '100%', justifyContent: 'center' },
    mockupCard: { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '10px', overflow: 'hidden', flex: '0 0 260px', boxShadow: '0 8px 32px rgba(27,36,48,0.10)' },
    mockupBar: { height: '28px', background: '#F2EDE3', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px' },
    mockupDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#D4CEC5' },
    mockupUrl: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#8A9099', marginLeft: '8px' },
    mockupBody: { padding: '16px' },
    section: { maxWidth: '1100px', margin: '0 auto', padding: '96px 24px' },
    sectionTag: { fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7C9070', marginBottom: '12px' },
    sectionH2: { fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#1B2430', marginBottom: '16px' },
    sectionSub: { fontSize: '17px', color: '#5B6470', lineHeight: 1.6, maxWidth: '520px' },
  }

  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logoArea} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <HexLogo size={28} />
            <span style={s.logoText}>Tbran Technologies</span>
          </div>
          <div style={{ ...s.navLinks, display: window.innerWidth < 640 ? 'none' : 'flex' }}>
            {NAV_LINKS.map(l => (
              <button key={l} style={s.navLink} onClick={() => scrollTo(l.toLowerCase().replace(' ', '-'))}>
                {l}
              </button>
            ))}
            <button style={s.navCta} onClick={() => scrollTo('pricing')}>Get started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <span style={s.heroEyebrow}>Website builder for local businesses</span>
        <h1 style={s.heroH1}>
          Your business deserves a{' '}
          <span style={s.heroAccent}>real website.</span>
        </h1>
        <p style={s.heroSub}>
          Fill out one form. Your site goes live on your own subdomain — no code, no designer, no waiting.
          Edit anytime. From $29/month.
        </p>
        <div style={s.heroBtns}>
          <button style={s.btnPrimary} onClick={() => scrollTo('pricing')}>See plans & pricing</button>
          <button style={s.btnSecondary} onClick={() => scrollTo('examples')}>View example sites</button>
        </div>

        {/* Browser mockup row */}
        <div style={s.mockupRow}>
          {EXAMPLE_SITES.map((site, i) => (
            <div key={site.slug} style={{ ...s.mockupCard, transform: i === 1 ? 'translateY(-12px)' : 'none', opacity: i === 0 || i === 2 ? 0.85 : 1 }}>
              <div style={s.mockupBar}>
                <div style={s.mockupDot} />
                <div style={s.mockupDot} />
                <div style={s.mockupDot} />
                <span style={s.mockupUrl}>{site.slug}.tbran.com</span>
              </div>
              <div style={s.mockupBody}>
                <div style={{ height: '80px', background: i === 1 ? '#1B2430' : '#EDE7D8', borderRadius: '6px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: i === 1 ? '#FAF6EE' : '#1B2430', fontSize: '13px' }}>{site.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#8A9099', marginBottom: '6px' }}>{site.category}</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['Services', 'Contact', ...(i > 0 ? ['Gallery'] : [])].map(p => (
                    <span key={p} style={{ fontSize: '10px', padding: '2px 7px', background: '#F2EDE3', borderRadius: '4px', color: '#5B6470' }}>{p}</span>
                  ))}
                </div>
                <div style={{ marginTop: '10px', height: '6px', background: '#F2EDE3', borderRadius: '3px' }} />
                <div style={{ marginTop: '6px', height: '6px', background: '#F2EDE3', borderRadius: '3px', width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ background: '#fff', borderTop: '1px solid #E8E2D8', borderBottom: '1px solid #E8E2D8' }}>
        <div style={s.section}>
          <p style={s.sectionTag}>How it works</p>
          <h2 style={s.sectionH2}>Three steps. That's it.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginTop: '48px' }}>
            {[
              { n: '01', title: 'Pick your plan', body: 'Choose Starter, Pro, or Business. Pay monthly — cancel any time. No setup fees, no contracts.' },
              { n: '02', title: 'Fill out one form', body: 'Tell us your business name, services, contact info, and upload your photos. Takes about 5 minutes.' },
              { n: '03', title: 'Your site goes live', body: 'Your site is published instantly at yourbiz.tbran.com. Edit anything at any time from your dashboard.' },
            ].map(step => (
              <div key={step.n} style={{ padding: '32px 28px', border: '1px solid #E8E2D8', borderRadius: '12px', background: '#FAF6EE' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#C24A36', fontWeight: 600, marginBottom: '16px' }}>{step.n}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#1B2430', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '15px', color: '#5B6470', lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={s.section}>
        <p style={s.sectionTag}>Pricing</p>
        <h2 style={s.sectionH2}>Simple, honest pricing.</h2>
        <p style={{ ...s.sectionSub, marginBottom: '56px' }}>One monthly price. No hidden fees. Upgrade or downgrade any time.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{
              background: tier.highlight ? '#1B2430' : '#fff',
              border: tier.highlight ? 'none' : '1px solid #E8E2D8',
              borderRadius: '14px',
              padding: '32px 28px',
              position: 'relative',
              boxShadow: tier.highlight ? '0 16px 48px rgba(27,36,48,0.18)' : 'none',
            }}>
              {tier.highlight && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#C24A36', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Most popular
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <HexLogo size={22} color={tier.highlight ? '#FAF6EE' : tier.accent} />
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 600, color: tier.highlight ? '#FAF6EE' : '#1B2430' }}>{tier.name}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '44px', fontWeight: 700, color: tier.highlight ? '#FAF6EE' : '#1B2430' }}>${tier.price}</span>
                <span style={{ fontSize: '15px', color: tier.highlight ? '#8A9099' : '#8A9099' }}>/mo</span>
              </div>
              <p style={{ fontSize: '14px', color: tier.highlight ? '#8A9099' : '#5B6470', marginBottom: '28px' }}>{tier.tagline}</p>
              <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: tier.highlight ? '#C8D4C0' : '#5B6470' }}>
                    <span style={{ color: tier.highlight ? '#7C9070' : '#7C9070', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startCheckout(tier.priceId)}
                style={{
                  width: '100%', padding: '13px',
                  background: tier.highlight ? '#C24A36' : '#1B2430',
                  color: '#FAF6EE', border: 'none', borderRadius: '6px',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Example sites */}
      <section id="examples" style={{ background: '#fff', borderTop: '1px solid #E8E2D8', borderBottom: '1px solid #E8E2D8' }}>
        <div style={s.section}>
          <p style={s.sectionTag}>Examples</p>
          <h2 style={s.sectionH2}>See what's possible.</h2>
          <p style={{ ...s.sectionSub, marginBottom: '48px' }}>Real template designs for real business types. Your site looks like this — on your own subdomain — in minutes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { name: "Tom's Boats", category: 'Marine Dealer', slug: 'tomsboats', tier: 'Pro', pages: ['Home', 'About', 'Boats', 'Gallery', 'Contact'] },
              { name: 'Velvet Cut Salon', category: 'Hair Salon', slug: 'velvetcutsalon', tier: 'Business', pages: ['Home', 'Services', 'Gallery', 'Testimonials', 'Book & Pay'] },
              { name: 'Sunrise HVAC', category: 'HVAC Services', slug: 'sunrisehvac', tier: 'Starter', pages: ['Services', 'Contact'] },
            ].map(site => (
              <div key={site.slug} style={{ border: '1px solid #E8E2D8', borderRadius: '12px', overflow: 'hidden', background: '#FAF6EE' }}>
                <div style={{ background: '#EDE7D8', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '18px', color: '#1B2430' }}>{site.name}</div>
                    <div style={{ fontSize: '12px', color: '#8A9099', marginTop: '4px' }}>{site.category}</div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#1B2430', color: '#FAF6EE', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.06em' }}>{site.tier}</div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8A9099', marginBottom: '10px' }}>{site.slug}.tbran.com</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {site.pages.map(p => (
                      <span key={p} style={{ fontSize: '11px', padding: '3px 8px', background: '#fff', border: '1px solid #E8E2D8', borderRadius: '4px', color: '#5B6470' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#1B2430', marginBottom: '16px' }}>
            Ready to go live?
          </h2>
          <p style={{ fontSize: '17px', color: '#5B6470', lineHeight: 1.6, marginBottom: '36px' }}>
            Pick a plan and have your site up in under 10 minutes. No tech skills needed.
          </p>
          <button
            onClick={() => scrollTo('pricing')}
            style={{ padding: '16px 40px', background: '#C24A36', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '17px', fontWeight: 600, cursor: 'pointer' }}
          >
            Get started from $29/mo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E2D8', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HexLogo size={22} />
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '15px', color: '#1B2430' }}>Tbran Technologies</span>
          </div>
          <p style={{ fontSize: '13px', color: '#8A9099' }}>© {new Date().getFullYear()} Tbran Technologies. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: '13px', color: '#8A9099' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
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
