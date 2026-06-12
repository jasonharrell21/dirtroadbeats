import { useState, useRef, useEffect } from "react";
import AdminApp from "./dirtroad-admin";

// ── Fonts via Google Fonts injected once ──────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0a07;
      --surface: #1c1410;
      --surface2: #261d15;
      --gold: #d4854a;
      --gold2: #edb87a;
      --cream: #f5ede0;
      --muted: #b09880;
      --accent: #d4784a;
      --danger: #e05c5c;
      --radius: 12px;
    }

    body { background: var(--bg); color: var(--cream); font-family: 'DM Sans', sans-serif; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

    /* no-select on audio player */
    .no-dl { user-select: none; -webkit-user-select: none; }

    /* animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: .6; }
      100% { transform: scale(1.7); opacity: 0;  }
    }
    @keyframes wave {
      0%, 100% { transform: scaleY(1); }
      50%       { transform: scaleY(2.2); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Mobile responsive ── */
    @media (max-width: 768px) {
      /* Nav */
      .nav-links { display: none !important; }
      .nav-order-btn { display: flex !important; }

      /* Hero */
      .hero-btns { flex-direction: column !important; align-items: center !important; }

      /* 3-col grids → 1 col */
      .grid-3 { grid-template-columns: 1fr !important; }

      /* 2-col grids → 1 col */
      .grid-2 { grid-template-columns: 1fr !important; }

      /* Order form 2-col rows → 1 col */
      .form-row-2 { grid-template-columns: 1fr !important; }

      /* Pricing cards → 1 col, no scale */
      .pricing-card-featured { transform: none !important; }

      /* Testimonials → 1 col */
      .grid-testimonials { grid-template-columns: 1fr !important; }

      /* Section padding */
      .section-pad { padding: 48px 16px !important; }

      /* Card padding */
      .card-pad { padding: 20px 16px !important; }

      /* Progress steps */
      .progress-steps { flex-wrap: wrap !important; gap: 8px !important; }

      /* Order confirmation summary */
      .confirm-summary { padding: 16px !important; }

      /* Reduce hero padding */
      .hero-section { padding: 40px 16px !important; min-height: 90vh !important; }

      /* Footer links */
      .footer-links { gap: 12px !important; }

      /* Sample player tabs */
      .sample-tabs { flex-wrap: wrap !important; }
    }

    @media (max-width: 480px) {
      .grid-3 { grid-template-columns: 1fr !important; }
      .grid-2 { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ── Shared styles object ──────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", overflowX: "hidden", paddingTop: 72 },

  // HERO
  hero: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 24px",
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, #3a1a08 0%, var(--bg) 70%)",
    overflow: "hidden",
  },
  heroBadge: {
    display: "inline-block",
    background: "linear-gradient(90deg, var(--gold), var(--gold2), var(--gold))",
    backgroundSize: "200% auto",
    animation: "shimmer 3s linear infinite",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'DM Sans'",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(42px, 7vw, 86px)",
    fontWeight: 900,
    lineHeight: 1.05,
    color: "#fff",
    marginBottom: 20,
    animation: "fadeUp .9s ease both",
  },
  heroSub: {
    fontSize: 18,
    color: "rgba(245,237,224,.85)",
    maxWidth: 520,
    lineHeight: 1.7,
    marginBottom: 40,
    animation: "fadeUp .9s .15s ease both",
  },

  // SECTIONS
  section: { padding: "80px 24px", maxWidth: 960, margin: "0 auto" },
  sectionTitle: {
    fontFamily: "Georgia, 'Playfair Display', serif",
    fontSize: "clamp(28px, 4vw, 46px)",
    fontWeight: 700,
    marginBottom: 12,
    color: "#d4854a",
  },
  sectionSub: { color: "#e0cdb8", fontSize: 16, marginBottom: 48, lineHeight: 1.6 },

  // CARDS
  card: {
    background: "#231810",
    border: "1px solid rgba(212,133,74,.25)",
    borderRadius: 16,
    padding: "32px",
    marginBottom: 24,
  },

  // FORM
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 },
  input: {
    width: "100%", background: "var(--surface2)", border: "1px solid rgba(201,168,76,.2)",
    borderRadius: 8, padding: "12px 16px", color: "var(--cream)", fontSize: 15, outline: "none",
    transition: "border-color .2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  textarea: {
    width: "100%", background: "var(--surface2)", border: "1px solid rgba(201,168,76,.2)",
    borderRadius: 8, padding: "14px 16px", color: "var(--cream)", fontSize: 15, outline: "none",
    resize: "vertical", minHeight: 100, fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: "100%", background: "var(--surface2)", border: "1px solid rgba(201,168,76,.2)",
    borderRadius: 8, padding: "12px 16px", color: "var(--cream)", fontSize: 15, outline: "none",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", appearance: "none",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  fieldGroup: { marginBottom: 22 },

  // BUTTONS
  btnGold: {
    background: "linear-gradient(135deg, var(--gold), var(--gold2))",
    border: "none", borderRadius: 50, padding: "15px 38px",
    color: "#1a1200", fontWeight: 700, fontSize: 15, cursor: "pointer",
    letterSpacing: .5, transition: "transform .15s, box-shadow .15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnOutline: {
    background: "transparent",
    border: "1px solid var(--gold)", borderRadius: 50, padding: "14px 36px",
    color: "var(--gold)", fontWeight: 500, fontSize: 15, cursor: "pointer",
    letterSpacing: .5, transition: "all .15s", fontFamily: "'DM Sans', sans-serif",
  },

  // DIVIDER
  divider: { border: "none", borderTop: "1px solid rgba(201,168,76,.12)", margin: "60px 0" },

  // FOOTER
  footer: {
    textAlign: "center", padding: "40px 24px",
    borderTop: "1px solid rgba(201,168,76,.1)",
    color: "#d4c4b0", fontSize: 13,
  },
};

// ── Tier data ─────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "sample",
    name: "Free Sample",
    price: 0,
    desc: "Hear your song before you commit — no credit card needed",
    features: ["Submit your song details", "We create your full custom song", "You receive a 30-second protected preview", "Love it? Buy the full WAV for $179.99", "Delivered within 48 hours"],
    color: "#4caf7d",
    isSample: true,
  },
  {
    id: "one",
    name: "One Version",
    price: 179.99,
    desc: "One fully custom song, delivered in WAV",
    features: ["1 custom song", "Your story, your sound", "WAV file delivery", "Artist style matching", "Unlimited song detail input"],
    color: "var(--gold)",
  },
  {
    id: "two",
    name: "Two Versions",
    price: 199.99,
    desc: "Two takes on your song — pick your favorite",
    features: ["2 custom versions of your song", "Compare & choose your favorite", "WAV file delivery (both)", "Artist style matching", "Unlimited song detail input"],
    color: "#e0855a",
    featured: true,
  },
];

const GENRES = ["Pop","Country","R&B / Soul","Hip-Hop","Rock","Folk / Acoustic","Jazz","Classical","EDM / Electronic","Gospel","Blues","Latin","Reggae","Metal","Indie / Alternative","Other"];
const TEMPOS = ["Slow & Soulful (60–75 BPM)","Medium Ballad (76–95 BPM)","Mid-Tempo (96–115 BPM)","Upbeat (116–135 BPM)","Fast & Energetic (136+ BPM)"];
const MOODS  = ["Romantic","Celebratory","Nostalgic","Uplifting","Melancholic","Humorous","Solemn / Tribute","Epic / Anthemic","Playful","Peaceful"];
const VOCALS = ["Male lead","Female lead","Duet (M+F)","Group / Choir","Instrumental only"];

// ── Protected Audio Player ────────────────────────────────────────────────────
function ProtectedPlayer({ src, title, genre, playing, onPlay, duration, progress, onSeek }) {
  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  const bars = Array.from({ length: 36 }, (_, i) => ({
    h: 20 + Math.sin(i * 0.7) * 14 + Math.sin(i * 1.3) * 6,
    delay: (i * 0.05) % 1,
  }));

  return (
    <div
      className="no-dl"
      onContextMenu={e => e.preventDefault()}
      style={{
        background: "linear-gradient(135deg, #2a1208, #0d0a07)",
        border: `1px solid ${playing ? "rgba(212,133,74,.5)" : "rgba(212,133,74,.2)"}`,
        borderRadius: 14, padding: "20px 24px", userSelect: "none",
        transition: "border-color .2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <button
          onClick={onPlay}
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: playing ? "linear-gradient(135deg, #d4854a, #edb87a)" : "rgba(212,133,74,.15)",
            border: playing ? "none" : "1px solid rgba(212,133,74,.4)",
            cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: playing ? "#1a0d05" : "#d4854a",
            transition: "all .2s",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#b09880" }}>
            {genre} · 🔒 Protected — download disabled
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, height: 40, marginBottom: 10, cursor: "pointer" }} onClick={onSeek}>
        {bars.map((b, i) => {
          const filled = (i / bars.length) * 100 <= progress;
          return (
            <div key={i} style={{
              flex: 1, height: b.h, borderRadius: 2,
              background: filled ? "linear-gradient(to top, #d4854a, #edb87a)" : "rgba(212,133,74,.15)",
              animation: playing && filled ? `wave ${0.4 + b.delay}s ease-in-out infinite alternate` : "none",
              transition: "background .1s",
            }} />
          );
        })}
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, color: "#b09880", minWidth: 32 }}>{fmt((progress/100) * duration)}</span>
        <div onClick={onSeek} style={{ flex: 1, height: 3, background: "rgba(212,133,74,.15)", borderRadius: 2, cursor: "pointer" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#d4854a", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 11, color: "#b09880", minWidth: 32, textAlign: "right" }}>{fmt(duration)}</span>
      </div>
    </div>
  );
}

// ── Multi-Song Sample Section ─────────────────────────────────────────────────
const SUPABASE_PUBLIC_URL = "https://fonqowbipddufdrekwab.supabase.co";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

function SampleSection() {
  const [songs, setSongs] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Load sample songs from Supabase
  useEffect(() => {
    fetch(`${SUPABASE_PUBLIC_URL}/rest/v1/samples?order=created_at.desc`, {
      headers: { "apikey": SUPABASE_ANON, "Authorization": `Bearer ${SUPABASE_ANON}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setSongs(data);
        else {
          // Fallback to hardcoded song if no samples in DB yet
          setSongs([{ title: "Spring Bayou", genre: "Country", url: `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/Songs/Spring%20Bayou-2.wav` }]);
        }
      })
      .catch(() => {
        setSongs([{ title: "Spring Bayou", genre: "Country", url: `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/Songs/Spring%20Bayou-2.wav` }]);
      });
  }, []);

  // Set up audio when song changes
  useEffect(() => {
    if (!songs.length) return;
    const audio = audioRef.current || new Audio();
    audio.pause();
    audio.src = songs[currentIdx]?.url || "";
    audio.crossOrigin = "anonymous";
    audio.addEventListener("timeupdate", () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    });
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    audioRef.current = audio;
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [currentIdx, songs]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * a.duration;
    setProgress(pct * 100);
  };

  const switchSong = (idx) => {
    if (audioRef.current) { audioRef.current.pause(); }
    setCurrentIdx(idx);
  };

  if (!songs.length) return null;

  return (
    <section id="sample" style={{ ...S.section, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={S.sectionTitle}>Hear What's Possible</h2>
        <p style={S.sectionSub}>Real custom songs made right here at Dirt Road Beats. Hit play and hear for yourself.</p>
      </div>

      {/* Song tabs */}
      {songs.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {songs.map((s, i) => (
            <button
              key={i}
              onClick={() => switchSong(i)}
              style={{
                background: currentIdx === i ? "linear-gradient(135deg, #d4854a, #edb87a)" : "rgba(212,133,74,.1)",
                border: currentIdx === i ? "none" : "1px solid rgba(212,133,74,.25)",
                borderRadius: 50, padding: "8px 20px",
                color: currentIdx === i ? "#1a0d05" : "#d4854a",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all .2s",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      <ProtectedPlayer
        src={songs[currentIdx]?.url}
        title={songs[currentIdx]?.title}
        genre={songs[currentIdx]?.genre}
        playing={playing}
        onPlay={togglePlay}
        duration={duration}
        progress={progress}
        onSeek={handleSeek}
      />
    </section>
  );
}

// ── Order Form ────────────────────────────────────────────────────────────────
function OrderForm({ selectedTier, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", occasion: "", recipient: "", genre: "", tempo: "", mood: "", vocal: "",
    artistMimic: "", lyrics: "", extraNotes: "", name: "", email: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const fldStyle = (k) => ({ ...S.input, borderColor: errors[k] ? "var(--danger)" : "rgba(201,168,76,.2)" });
  const selStyle = (k) => ({ ...S.select, borderColor: errors[k] ? "var(--danger)" : "rgba(201,168,76,.2)" });
  const tier = TIERS.find(t => t.id === selectedTier) || TIERS[0];

  const validate1 = () => {
    const e = {};
    if (!form.genre) e.genre = true;
    if (!form.tempo) e.tempo = true;
    if (!form.mood)  e.mood  = true;
    if (!form.vocal) e.vocal = true;
    if (!form.lyrics.trim()) e.lyrics = true;
    if (!form.name.trim())  e.name  = true;
    if (!form.email.trim()) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const PAYMENT_LINKS = {
    one: "https://buy.stripe.com/00weV7f755pg2YygiegMw00",
    two: "https://buy.stripe.com/9B600d3oncRI56Gc1YgMw01",
  };

  const SUPABASE_URL = "https://fonqowbipddufdrekwab.supabase.co";
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const handleCheckout = async () => {
    if (!validate1()) return;
    setProcessing(true); setError("");

    const orderId = "DRB-" + Date.now().toString(36).toUpperCase().slice(-6);

    // Save order to Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          order_id: orderId,
          name: form.name,
          email: form.email,
          tier: selectedTier,
          tier_name: tier.name,
          price: tier.price,
          genre: form.genre,
          tempo: form.tempo,
          mood: form.mood,
          vocal: form.vocal,
          artist_mimic: form.artistMimic || null,
          title: form.title || null,
          recipient: form.recipient || null,
          lyrics: form.lyrics,
          extra_notes: form.extraNotes || null,
          status: selectedTier === "sample" ? "sample_requested" : "pending_payment",
        }),
      });
    } catch (err) {
      console.error("Save error:", err);
    }

    // Free sample — show confirmation, no payment
    if (selectedTier === "sample") {
      setProcessing(false);
      setStep(3);
      onSuccess && onSuccess({ name: form.name, tier: selectedTier, orderId });
      return;
    }

    // Paid — redirect to Stripe
    const base = PAYMENT_LINKS[selectedTier];
    const params = new URLSearchParams({ prefilled_email: form.email });
    window.location.href = `${base}?${params.toString()}`;
  };

  if (step === 3) {
    const isSample = selectedTier === "sample";
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 48, animation: "fadeUp .6s ease both" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{isSample ? "🎵" : "🎸"}</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: isSample ? "#4caf7d" : "#d4854a", marginBottom: 12 }}>
          {isSample ? "Sample Request Received!" : "Order Confirmed!"}
        </div>
        <div style={{ color: "rgba(245,237,224,.85)", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
          {isSample ? (
            <>Thank you, <strong style={{ color: "#4caf7d" }}>there</strong>! We've received your song details and will create your 30-second sample within <strong style={{ color: "#6fcf97" }}>48 hours</strong>. We'll email it to <strong style={{ color: "#6fcf97" }}>{form.email}</strong> — if you love it, you can purchase the full song right from the email!</>
          ) : (
            <>Thank you! Your custom song is in the queue. We'll send your WAV {selectedTier === "two" ? "files" : "file"} to your email within 3–5 business days.</>
          )}
        </div>
        {isSample && (
          <div style={{ background: "rgba(76,175,109,.08)", border: "1px solid rgba(76,175,109,.2)", borderRadius: 12, padding: "20px 24px", maxWidth: 440, margin: "0 auto 28px", textAlign: "left" }}>
            <div style={{ color: "#4caf7d", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What happens next</div>
            {[
              ["🎵", "We create your full custom song"],
              ["✂️", "We cut a 30-second preview just for you"],
              ["📧", "You get a protected sample link by email within 48 hours"],
              ["🎸", "Love it? Click 'Buy Full Song' in the email"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <span style={{ color: "#e0cdb8", fontSize: 14, lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "20px 28px", display: "inline-block", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Summary</div>
          <div style={{ color: "#fff", fontWeight: 600 }}>{tier.name} {isSample ? "— Free" : `— $${tier.price.toFixed(2)}`}</div>
          <div style={{ color: "#c4a882", fontSize: 14 }}>{isSample ? "30-second preview · 48 hour delivery" : "WAV file delivery · 3–5 business days"}</div>
        </div>
        <div><button style={S.btnGold} onClick={onBack}>Back to Home</button></div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1a1200" }}>1</div>
          <span style={{ fontSize: 14, color: "var(--gold)" }}>Song Details</span>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(201,168,76,.1)", borderRadius: 50, padding: "6px 16px", fontSize: 14, color: "var(--gold)" }}>
          {tier.name} · ${tier.price.toFixed(2)}
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", marginBottom: 28 }}>Song Details</div>

        <div className="form-row-2" style={S.row2}>
          <div style={S.fieldGroup}><label style={S.label}>Your Name *</label><input style={fldStyle("name")} value={form.name} onChange={set("name")} placeholder="Jane Smith" /></div>
          <div style={S.fieldGroup}><label style={S.label}>Your Email *</label><input style={fldStyle("email")} value={form.email} onChange={set("email")} placeholder="jane@email.com" type="email" /></div>
        </div>

        <div className="form-row-2" style={S.row2}>
          <div style={S.fieldGroup}><label style={S.label}>Song Title / Occasion</label><input style={S.input} value={form.title} onChange={set("title")} placeholder="e.g. Wedding Anniversary" /></div>
          <div style={S.fieldGroup}><label style={S.label}>Who is this for?</label><input style={S.input} value={form.recipient} onChange={set("recipient")} placeholder="e.g. My wife Sarah" /></div>
        </div>

        <div className="form-row-2" style={S.row2}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Genre *</label>
            <select style={selStyle("genre")} value={form.genre} onChange={set("genre")}>
              <option value="">Select genre…</option>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Tempo *</label>
            <select style={selStyle("tempo")} value={form.tempo} onChange={set("tempo")}>
              <option value="">Select tempo…</option>
              {TEMPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row-2" style={S.row2}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Mood / Vibe *</label>
            <select style={selStyle("mood")} value={form.mood} onChange={set("mood")}>
              <option value="">Select mood…</option>
              {MOODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Vocal Style *</label>
            <select style={selStyle("vocal")} value={form.vocal} onChange={set("vocal")}>
              <option value="">Select vocals…</option>
              {VOCALS.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={S.fieldGroup}>
          <label style={S.label}>Artist to Mimic / Sound-Alike</label>
          <input style={S.input} value={form.artistMimic} onChange={set("artistMimic")} placeholder="e.g. Taylor Swift, Morgan Wallen, Bruno Mars…" />
        </div>

        <div style={S.fieldGroup}>
          <label style={S.label}>Song Details & Lyrics Direction *</label>
          <textarea style={{ ...S.textarea, borderColor: errors.lyrics ? "var(--danger)" : "rgba(201,168,76,.2)" }} value={form.lyrics} onChange={set("lyrics")} placeholder="Tell us the story, key phrases, names, inside jokes, memories…" />
          {errors.lyrics && <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>Please provide some detail for the song.</div>}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(212,133,74,.08)", border: "1px solid rgba(212,133,74,.2)", borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 13, color: "#e0cdb8", lineHeight: 1.7 }}>
              <strong style={{ color: "#d4854a" }}>Pro tip:</strong> The more detail you give us, the more personal and accurate your song will be. Include names, places, special memories, inside jokes, how you met, favorite things — anything that makes your story unique!
            </div>
          </div>
        </div>

        <div style={S.fieldGroup}>
          <label style={S.label}>Additional Notes</label>
          <textarea style={{ ...S.textarea, minHeight: 70 }} value={form.extraNotes} onChange={set("extraNotes")} placeholder="Any instruments you love, things to avoid, reference songs…" />
        </div>

        {error && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 16, background: "rgba(224,92,92,.1)", padding: "12px 16px", borderRadius: 8 }}>⚠️ {error}</div>}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 12 }}>
          <button style={S.btnOutline} onClick={onBack}>← Back</button>
          <button style={{ ...S.btnGold, display: "flex", alignItems: "center", gap: 10, opacity: processing ? .7 : 1 }} onClick={handleCheckout} disabled={processing}>
            {processing
              ? <><div style={{ width: 16, height: 16, border: "2px solid #1a1200", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />{ selectedTier === "sample" ? "Submitting…" : "Redirecting…"}</>
              : selectedTier === "sample" ? "Submit Sample Request — Free" : `Continue to Payment — $${tier.price.toFixed(2)}`}
          </button>
        </div>
        <div style={{ marginTop: 14, textAlign: "center", color: "#b09880", fontSize: 12 }}>
          🔒 Secured by Stripe — you'll be redirected to complete payment safely
        </div>
      </div>
    </div>
  );
}

// ── Protected Sample Player Page ─────────────────────────────────────────────
function PlayerPage() {
  const params = new URLSearchParams(window.location.search);
  const fileUrl = params.get("file");
  const songTitle = params.get("title") || "Your Custom Song";
  const genre = params.get("genre") || "Custom Country";
  const ONE_URL = "https://buy.stripe.com/00weV7f755pg2YygiegMw00";
  const TWO_URL = "https://buy.stripe.com/9B600d3oncRI56Gc1YgMw01";
  const email = params.get("email") || "";
  const emailParam = email ? `?prefilled_email=${encodeURIComponent(email)}` : "";
  const MAX = 30;

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [ended, setEnded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(fileUrl);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= MAX) {
        audio.pause(); audio.currentTime = MAX;
        setCurrentTime(MAX); setPlaying(false); setEnded(true);
      } else { setCurrentTime(audio.currentTime); }
    });
    audio.addEventListener("ended", () => { setPlaying(false); setEnded(true); });
    return () => { audio.pause(); };
  }, [fileUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || ended) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  const progress = Math.min((currentTime / MAX) * 100, 100);
  const fmt = (s) => "0:" + String(Math.floor(Math.min(s, MAX))).padStart(2, "0");

  if (!fileUrl) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0a07", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "#e05c5c", fontSize: 16, textAlign: "center" }}>Invalid sample link. Please check your email for the correct link.</div>
      </div>
    );
  }

  return (
    <>
      <FontLink />
      <div style={{ minHeight: "100vh", background: "#0d0a07", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#1c1410", border: "1px solid rgba(212,133,74,.2)", borderRadius: 20, padding: "40px 32px", maxWidth: 440, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#d4854a", marginBottom: 4 }}>Dirt Road Beats</div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(245,237,224,.35)", marginBottom: 32 }}>Your Custom Song Sample</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#f5ede0", marginBottom: 6 }}>{songTitle}</div>
          <div style={{ fontSize: 13, color: "#7a6050", marginBottom: 28 }}>{genre} · 30-Second Preview</div>
          <div style={{ background: "#261d15", borderRadius: 16, padding: 24, marginBottom: 24, border: "1px solid rgba(212,133,74,.15)" }}>
            <button onClick={togglePlay} disabled={ended}
              style={{ width: 64, height: 64, borderRadius: "50%", background: ended ? "rgba(212,133,74,.2)" : "linear-gradient(135deg,#d4854a,#edb87a)", border: "none", fontSize: 22, cursor: ended ? "default" : "pointer", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", color: ended ? "#5a4030" : "#1a0d05", opacity: ended ? 0.5 : 1 }}>
              {playing ? "⏸" : "▶"}
            </button>
            <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 4, height: 6, marginBottom: 10, overflow: "hidden" }}>
              <div style={{ width: progress + "%", height: "100%", background: "linear-gradient(90deg,#d4854a,#edb87a)", borderRadius: 4, transition: "width .3s linear" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7a6050" }}>
              <span>{fmt(currentTime)}</span><span>0:30</span>
            </div>
            <div style={{ fontSize: 11, color: "#5a4030", marginTop: 10 }}>Protected preview — stops at 30 seconds</div>
          </div>
          {ended && (
            <div style={{ background: "rgba(212,133,74,.08)", border: "1px solid rgba(212,133,74,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#d4854a" }}>
              Preview ended — ready to hear the full thing?
            </div>
          )}
          <p style={{ color: "#e0cdb8", fontSize: 15, marginBottom: 6 }}>Love what you hear?</p>
          <p style={{ color: "#7a6050", fontSize: 12, marginBottom: 16 }}>Choose your version below.</p>
          <a href={ONE_URL + emailParam}
            style={{ display: "block", background: "linear-gradient(135deg,#d4854a,#edb87a)", color: "#1a0d05", textDecoration: "none", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 50, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
            🎸 One Version — $179.99
          </a>
          <a href={TWO_URL + emailParam}
            style={{ display: "block", background: "linear-gradient(135deg,#c9a84c,#f0d080)", color: "#1a1200", textDecoration: "none", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 50, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
            🎶 Two Versions — $199.99
          </a>
          <p style={{ color: "#3a2a1a", fontSize: 11, marginBottom: 16 }}>Two Versions = two unique takes. Pick your favorite or keep both.</p>
          <p style={{ color: "#5a4030", fontSize: 13 }}>Questions? Reply to your sample email.</p>
          <div style={{ marginTop: 28, fontSize: 11, color: "#2a1a0a" }}>2025 Dirt Road Beats</div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [view, setView] = useState("home"); // home | order
  const [selectedTier, setSelectedTier] = useState("one");
  const [orderDone, setOrderDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState(null);

  // Route to admin if URL path is /admin
  if (window.location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  // Route to protected sample player
  if (window.location.pathname.startsWith("/player")) {
    return <PlayerPage />;
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (view === "order") {
    return (
      <>
        <FontLink />
        <div style={S.page}>
          <div style={{ background: "var(--surface)", borderBottom: "1px solid rgba(201,168,76,.12)", padding: "18px 32px", display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => { setView("home"); setOrderDone(false); }} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 22 }}>🎸</button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff" }}>Dirt Road Beats</span>
          </div>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
            <OrderForm
              selectedTier={selectedTier}
              onBack={() => { setView("home"); setOrderDone(false); }}
              onSuccess={() => setOrderDone(true)}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div style={S.page}>

        {/* NAV */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(13,10,7,.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212,133,74,.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            🎸 <span style={{ color: "var(--gold)" }}>Dirt Road</span> Beats
          </div>
          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: "flex", gap: 32 }}>
            {["how-it-works", "pricing", "sample"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "rgba(245,237,224,.92)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans'", textTransform: "capitalize" }}>
                {id.replace(/-/g," ")}
              </button>
            ))}
            <button style={{ ...S.btnGold, padding: "10px 24px", fontSize: 13 }} onClick={() => setView("order")}>
              Order Now
            </button>
          </div>
          {/* Mobile hamburger */}
          <div style={{ display: "none" }} className="nav-order-btn">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "1px solid rgba(212,133,74,.3)", borderRadius: 8, padding: "8px 12px", color: "var(--gold)", cursor: "pointer", fontSize: 18 }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{
            position: "fixed", top: 56, left: 0, right: 0, zIndex: 99,
            background: "rgba(13,10,7,.98)", borderBottom: "1px solid rgba(212,133,74,.15)",
            padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12,
          }}>
            {["how-it-works", "pricing", "sample"].map(id => (
              <button key={id} onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "#f5ede0", cursor: "pointer", fontSize: 16, fontFamily: "'DM Sans'", textAlign: "left", padding: "8px 0", textTransform: "capitalize", borderBottom: "1px solid rgba(212,133,74,.1)" }}>
                {id.replace(/-/g," ")}
              </button>
            ))}
            <button style={{ ...S.btnGold, width: "100%", textAlign: "center", padding: "14px" }}
              onClick={() => { setView("order"); setMobileMenuOpen(false); }}>
              Order Now
            </button>
          </div>
        )}

        {/* HERO */}
        <section style={S.hero}>
          {/* Background grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: .04,
            backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={S.heroBadge}>Custom Songs · Handcrafted · Rooted in Story</div>
            <h1 style={S.heroTitle}>
              Songs That Tell<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Your</em> Story
            </h1>
            <p style={S.heroSub}>
              Give us the details — the moment, the memory, the person.
              We'll write, produce, and deliver a fully custom song straight from the heart.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp .9s .3s ease both" }}>
              <button style={S.btnGold} onClick={() => scrollTo("pricing")}>
                See Packages ↓
              </button>
              <button style={{ ...S.btnOutline, borderColor: "#4caf7d", color: "#4caf7d" }} onClick={() => { setSelectedTier("sample"); setView("order"); }}>
                🎵 Try a Free Sample
              </button>
              <button style={S.btnOutline} onClick={() => scrollTo("sample")}>
                Hear a Sample
              </button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ ...S.section, maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={S.sectionTitle}>How It Works</h2>
            <p style={S.sectionSub}>Three simple steps to a song you'll treasure for life.</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "📝", n: "01", title: "Tell Us Your Story", body: "Fill out our detailed song brief — genre, tempo, mood, the people involved, and the moments that matter most." },
              { icon: "🎵", n: "02", title: "We Craft Your Song", body: "Our team combines professional songwriting with cutting-edge AI to produce a custom track built entirely around your story." },
              { icon: "📥", n: "03", title: "Download & Enjoy", body: "You'll receive a private download link via email. Your song. Your memory. Yours to keep forever." },
            ].map(({ icon, n, title, body }) => (
              <div key={n} style={{ ...S.card, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <div style={{ color: "var(--gold2)", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>{n}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#ffffff", marginBottom: 10, fontWeight: 700 }}>{title}</div>
                <div style={{ color: "#e0cdb8", fontSize: 14, lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ ...S.divider, maxWidth: 960, margin: "0 auto 60px" }} />

        {/* SAMPLE PLAYERS */}
        <SampleSection />

        <hr style={{ ...S.divider, maxWidth: 960, margin: "0 auto 60px" }} />

        {/* TESTIMONIALS */}
        <section style={{ ...S.section, maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={S.sectionTitle}>What People Are Saying</h2>
            <p style={S.sectionSub}>Real stories from real customers who turned their moments into music.</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                quote: "I ordered the Two Versions package for my parents' 40th anniversary. My mom cried the second it started playing. Worth every single penny.",
                name: "Kayla M.",
                location: "Baton Rouge, LA",
                stars: 5,
                song: "40 Years of You",
              },
              {
                quote: "I used this for my proposal and she said yes before the song even finished. The detail they put into the lyrics was unreal — they included our dog's name and everything.",
                name: "Travis B.",
                location: "Nashville, TN",
                stars: 5,
                song: "The Night I Asked Forever",
              },
              {
                quote: "Got this as a birthday gift for my best friend. She literally couldn't believe someone made a song just for her. Dirt Road Beats absolutely delivered.",
                name: "Amber J.",
                location: "Houston, TX",
                stars: 5,
                song: "Girl, It's Your Day",
              },
            ].map(({ quote, name, location, stars, song }) => (
              <div key={name} style={{ ...S.card, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} style={{ color: "#d4854a", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <div style={{ color: "#f0e0cc", fontSize: 15, lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>
                  "{quote}"
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{name}</div>
                  <div style={{ color: "#b09880", fontSize: 12, marginTop: 2 }}>{location}</div>
                  <div style={{ color: "#d4854a", fontSize: 12, marginTop: 4 }}>🎵 "{song}"</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ ...S.divider, maxWidth: 960, margin: "0 auto 60px" }} />

        {/* PRICING */}
        <section id="pricing" style={{ ...S.section, maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={S.sectionTitle}>Choose Your Package</h2>
            <p style={S.sectionSub}>Every package includes a custom-written song. Upgrade for faster delivery and more revisions.</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
            {TIERS.map(tier => (
              <div
                key={tier.id}
                onClick={() => { setSelectedTier(tier.id); }}
                style={{
                  ...S.card,
                  border: tier.featured ? `1px solid ${tier.color}` : tier.isSample ? "1px solid rgba(76,175,109,.3)" : "1px solid rgba(201,168,76,.15)",
                  position: "relative",
                  cursor: "pointer",
                  transform: tier.featured ? "scale(1.03)" : "none",
                  transition: "transform .2s, border-color .2s",
                }}
              >
                {tier.featured && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--gold), var(--gold2))",
                    color: "#1a1200", fontSize: 11, fontWeight: 700, letterSpacing: 2,
                    padding: "4px 16px", borderRadius: 50, whiteSpace: "nowrap",
                  }}>
                    MOST POPULAR
                  </div>
                )}
                {tier.isSample && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #4caf7d, #6fcf97)",
                    color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 2,
                    padding: "4px 16px", borderRadius: 50, whiteSpace: "nowrap",
                  }}>
                    TRY BEFORE YOU BUY
                  </div>
                )}
                <div style={{ color: tier.color, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{tier.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 900, color: "#ffffff", marginBottom: 4 }}>
                  {tier.isSample ? "FREE" : `$${tier.price.toFixed(2)}`}
                </div>
                <div style={{ color: "#e0cdb8", fontSize: 13, marginBottom: 20 }}>{tier.desc}</div>
                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "#f5ede0", fontSize: 14, marginBottom: 10, textAlign: "left" }}>
                      <span style={{ color: tier.color, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  style={tier.isSample ? { ...S.btnOutline, width: "100%", textAlign: "center", borderColor: "#4caf7d", color: "#4caf7d" } : tier.featured ? { ...S.btnGold, width: "100%", textAlign: "center" } : { ...S.btnOutline, width: "100%", textAlign: "center" }}
                  onClick={(e) => { e.stopPropagation(); setSelectedTier(tier.id); setView("order"); }}
                >
                  {tier.isSample ? "Request Free Sample" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(180deg, transparent, rgba(58,26,8,.4), transparent)" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 5vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
            Ready to Create Something{" "}
            <em style={{ color: "var(--gold)" }}>Unforgettable?</em>
          </div>
          <p style={{ color: "rgba(245,237,224,.88)", marginBottom: 32, fontSize: 16 }}>Join hundreds of people who've turned their stories into songs.</p>
          <button style={{ ...S.btnGold, fontSize: 17, padding: "18px 48px" }} onClick={() => { setSelectedTier("one"); setView("order"); }}>
            Order Your Song Today
          </button>
        </section>

        {/* FOOTER */}
        <footer style={S.footer}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "var(--gold)", marginBottom: 8 }}>🎸 Dirt Road Beats</div>
          <div style={{ marginBottom: 16 }}>Custom songs, rooted in your story and crafted with heart.</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", id: "privacy" },
              { label: "Terms of Service", id: "terms" },
              { label: "Contact Us", id: "contact" },
              { label: "Refund Policy", id: "refund" },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => setPolicyModal(id)}
                style={{ background: "none", border: "none", color: "#d4c4b0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                {label}
              </button>
            ))}
          </div>
          <div>© {new Date().getFullYear()} Dirt Road Beats. All rights reserved.</div>
        </footer>

        {policyModal && <PolicyModal id={policyModal} onClose={() => setPolicyModal(null)} />}

      </div>
    </>
  );
}

// ── Policy Modal ──────────────────────────────────────────────────────────────
const TODAY = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const POLICIES = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      { heading: true, text: `Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` },
      { heading: false, text: "At Dirt Road Beats, we take your privacy seriously. This policy explains how we collect, use, and protect your information." },
      { heading: true, text: "INFORMATION WE COLLECT" },
      { heading: false, text: "When you place an order, we collect your name, email address, and the song details you provide. Payment information is processed securely by Stripe — we never store your credit card details on our servers." },
      { heading: true, text: "HOW WE USE YOUR INFORMATION" },
      { heading: false, text: "We use your information solely to fulfill your order and deliver your finished WAV file. We do not sell, rent, or share your personal information with third parties." },
      { heading: true, text: "DATA SECURITY" },
      { heading: false, text: "Your information is transmitted using industry-standard SSL encryption. Payment processing is handled by Stripe, which is PCI-compliant." },
      { heading: true, text: "YOUR RIGHTS" },
      { heading: false, text: "You may request that we delete your personal information at any time by emailing dirtroadbeat@gmail.com. We will respond within 30 days." },
    ]
  },
  terms: {
    title: "Terms of Service",
    sections: [
      { heading: true, text: `Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` },
      { heading: true, text: "SERVICES" },
      { heading: false, text: "Dirt Road Beats creates custom, original songs based on the information you provide, delivered as a WAV audio file." },
      { heading: true, text: "YOUR ORDER" },
      { heading: false, text: "You are responsible for providing accurate and complete information in your song brief. The quality of your song depends on the detail you provide." },
      { heading: true, text: "INTELLECTUAL PROPERTY" },
      { heading: false, text: "Upon delivery and full payment, you receive a personal, non-commercial license to use your custom song. You may share it privately and play it at personal events. You may not sell or distribute it commercially without written permission." },
      { heading: true, text: "DELIVERY" },
      { heading: false, text: "Songs are typically delivered within 3–5 business days. Delivery times are estimates and may vary." },
      { heading: true, text: "GOVERNING LAW" },
      { heading: false, text: "These terms are governed by the laws of the State of Louisiana." },
    ]
  },
  contact: {
    title: "Contact Us",
    sections: [
      { heading: false, text: "We'd love to hear from you!" },
      { heading: true, text: "EMAIL" },
      { heading: false, text: "dirtroadbeat@gmail.com" },
      { heading: false, text: "We typically respond within 24 hours, Monday through Friday." },
      { heading: true, text: "QUESTIONS ABOUT YOUR ORDER" },
      { heading: false, text: "If you have questions about an existing order, please include your order ID in your email so we can look it up quickly." },
      { heading: true, text: "SONG REVISIONS" },
      { heading: false, text: "If you'd like a revision on your delivered song, just reply to your delivery email with your feedback and we'll take care of you." },
      { heading: true, text: "GENERAL INQUIRIES" },
      { heading: false, text: "For anything else — questions about our process, custom requests, or anything else — don't hesitate to reach out. We personally read every email. 🎸" },
    ]
  },
  refund: {
    title: "Refund Policy",
    sections: [
      { heading: true, text: `Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` },
      { heading: false, text: "We want you to be completely happy with your custom song. Here's how our refund policy works." },
      { heading: true, text: "BEFORE DELIVERY" },
      { heading: false, text: "If you need to cancel before your song has been delivered, contact us as soon as possible. If production has not yet begun, we will issue a full refund. If production is already underway, we may issue a partial refund at our discretion." },
      { heading: true, text: "AFTER DELIVERY" },
      { heading: false, text: "Due to the custom nature of our songs, we generally do not offer refunds after delivery. Each song is created specifically for you and cannot be resold." },
      { heading: true, text: "EXCEPTIONS" },
      { heading: false, text: "If your song contains a significant error — wrong name, wrong genre, or a clear deviation from your brief — we will make it right. Contact us within 7 days of delivery and we will revise or refund at our discretion." },
      { heading: true, text: "HOW TO REQUEST A REFUND" },
      { heading: false, text: "Email us at dirtroadbeat@gmail.com with your order ID and a description of the issue. We respond within 24–48 hours." },
    ]
  },
};

function PolicyModal({ id, onClose }) {
  const policy = POLICIES[id];
  if (!policy) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1c1410", border: "1px solid rgba(212,133,74,.25)",
        borderRadius: 16, width: "100%", maxWidth: 600,
        maxHeight: "88vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid rgba(212,133,74,.12)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#d4854a" }}>{policy.title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#b09880", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "20px 28px", overflowY: "auto", flex: 1 }}>
          {policy.sections.map((s, i) => (
            <div key={i} style={{
              color: s.heading ? "#d4854a" : "#e0cdb8",
              fontSize: s.heading ? 11 : 14,
              fontWeight: s.heading ? 700 : 400,
              letterSpacing: s.heading ? 1.5 : 0,
              textTransform: s.heading ? "uppercase" : "none",
              lineHeight: 1.8,
              marginBottom: s.heading ? 6 : 14,
              marginTop: s.heading && i > 0 ? 10 : 0,
            }}>
              {s.text}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 28px", borderTop: "1px solid rgba(212,133,74,.12)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "linear-gradient(135deg, #d4854a, #edb87a)", border: "none", borderRadius: 50, padding: "11px 28px", color: "#1a0d05", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
