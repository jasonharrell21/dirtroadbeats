import { useState, useEffect } from 'react'
import Marketing from './pages/Marketing.jsx'
import Intake from './pages/Intake.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CustomerSite from './pages/CustomerSite.jsx'
import { supabase } from './supabase.js'

// Detect if we're on a customer subdomain (e.g. tomsboats.tbran.com)
function getSubdomain() {
  const host = window.location.hostname
  // Localhost dev: ?slug=tomsboats query param for testing
  if (host === 'localhost' || host === '127.0.0.1') {
    const params = new URLSearchParams(window.location.search)
    return params.get('slug') || null
  }
  const parts = host.split('.')
  // tbran.com → ['tbran','com'] length 2, no subdomain
  // www.tbran.com → ['www','tbran','com'] treat www as no subdomain
  // tomsboats.tbran.com → ['tomsboats','tbran','com'] length 3+
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0]
  }
  return null
}

export default function App() {
  const slug = getSubdomain()
  const path = window.location.pathname

  // Customer-facing site on subdomain
  if (slug) {
    return <CustomerSite slug={slug} />
  }

  // Main domain routing
  if (path.startsWith('/intake')) {
    return <Intake />
  }

  if (path.startsWith('/dashboard')) {
    return <AuthGate><Dashboard /></AuthGate>
  }

  return <Marketing />
}

// Wrap dashboard in auth check
function AuthGate({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAF6EE' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E8E2D8', borderTopColor: '#1B2430', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return children
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  const s = {
    page: { minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    card: { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '12px', padding: '48px 40px', maxWidth: '400px', width: '100%', textAlign: 'center' },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '32px' },
    h1: { fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: 600, color: '#1B2430', marginBottom: '8px' },
    sub: { color: '#5B6470', fontSize: '15px', marginBottom: '32px' },
    label: { display: 'block', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#1B2430', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1.5px solid #D4CEC5', borderRadius: '6px', fontSize: '15px', outline: 'none', background: '#fff' },
    btn: { width: '100%', padding: '12px', background: '#1B2430', color: '#FAF6EE', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, marginTop: '16px', cursor: 'pointer' },
    error: { color: '#C24A36', fontSize: '13px', marginTop: '8px' },
  }

  if (sent) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉️</div>
          <h1 style={s.h1}>Check your email</h1>
          <p style={s.sub}>We sent a magic link to <strong>{email}</strong>. Click it to sign in to your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <HexLogo size={28} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '18px', color: '#1B2430' }}>Tbran Technologies</span>
        </div>
        <h1 style={s.h1}>Sign in to your dashboard</h1>
        <p style={s.sub}>We'll email you a magic link — no password needed.</p>
        <form onSubmit={handleLogin}>
          <label style={s.label}>Email address</label>
          <input
            style={s.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
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
