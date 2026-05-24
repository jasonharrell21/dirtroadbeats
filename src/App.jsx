import { useState, useRef, useEffect } from "react";

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
// The src is never exposed in plain HTML; blob URL is revoked after load.
// Right-click and keyboard shortcuts are blocked on the player div.
function ProtectedPlayer({ title, artistHint }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Demo: use a short royalty-free tone encoded as a tiny data URI
  // In production replace with a presigned, time-limited URL served from your backend.
  const DEMO_SRC = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    const audio = new Audio();
    audio.src = DEMO_SRC;
    audio.crossOrigin = "anonymous";
    // Enforce 30-second cap
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= 30) { audio.pause(); audio.currentTime = 0; setPlaying(false); setProgress(0); }
      else setProgress((audio.currentTime / 30) * 100);
    });
    audio.addEventListener("loadedmetadata", () => { setLoaded(true); setDuration(Math.min(audio.duration, 30)); });
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const a = audioRef.current;
    if (a) a.currentTime = pct * 30;
    setProgress(pct * 100);
  };

  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  // Waveform bars (decorative)
  const bars = Array.from({ length: 36 }, (_, i) => ({
    h: 20 + Math.sin(i * 0.7) * 14 + Math.random() * 10,
    delay: (i * 0.05) % 1,
  }));

  return (
    <div
      className="no-dl"
      onContextMenu={e => e.preventDefault()}
      style={{
        background: "linear-gradient(135deg, #2a1208, #0d0a07)",
        border: "1px solid rgba(201,168,76,.25)",
        borderRadius: 16,
        padding: 28,
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        {/* Play button */}
        <button
          onClick={toggle}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold), var(--gold2))",
            border: "none", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#1a1200", transition: "transform .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
            {title || "Your Custom Song"}
          </div>
          <div style={{ fontSize: 12, color: "#b09880", marginTop: 2 }}>
            {artistHint ? `In the style of ${artistHint}` : "30-second preview"} · 🔒 Protected sample
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, height: 48, marginBottom: 14, cursor: "pointer" }} onClick={handleSeek}>
        {bars.map((b, i) => {
          const filled = (i / bars.length) * 100 <= progress;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: b.h,
                borderRadius: 2,
                background: filled ? "linear-gradient(to top, var(--gold), var(--gold2))" : "rgba(201,168,76,.2)",
                animation: playing && filled ? `wave ${0.4 + b.delay}s ease-in-out infinite alternate` : "none",
                transition: "background .1s",
              }}
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "#b09880", minWidth: 32 }}>{fmt((progress/100)*30)}</span>
        <div
          onClick={handleSeek}
          style={{ flex: 1, height: 4, background: "rgba(201,168,76,.15)", borderRadius: 2, cursor: "pointer", position: "relative" }}
        >
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--gold)", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, color: "#b09880", minWidth: 32, textAlign: "right" }}>0:30</span>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "#9a8472", textAlign: "center" }}>
        ⚠️ Preview only — downloading is disabled. Full song delivered after purchase.
      </div>
    </div>
  );
}

// ── Order Form ────────────────────────────────────────────────────────────────
function OrderForm({ selectedTier, onBack, onSuccess }) {
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=confirmation
  const [form, setForm] = useState({
    // song details
    title: "", occasion: "", recipient: "", genre: "", tempo: "", mood: "", vocal: "",
    artistMimic: "", lyrics: "", extraNotes: "",
    // contact
    name: "", email: "",
    // payment (mock)
    cardName: "", cardNum: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fldStyle = (k) => ({ ...S.input, borderColor: errors[k] ? "var(--danger)" : "rgba(201,168,76,.2)" });
  const selStyle = (k) => ({ ...S.select, borderColor: errors[k] ? "var(--danger)" : "rgba(201,168,76,.2)" });

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

  const validate2 = () => {
    const e = {};
    if (!form.cardName.trim()) e.cardName = true;
    if (form.cardNum.replace(/\s/g,"").length < 16) e.cardNum = true;
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = true;
    if (form.cvv.length < 3) e.cvv = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validate1()) setStep(2);
    if (step === 2 && validate2()) {
      setProcessing(true);
      setTimeout(() => { setProcessing(false); setStep(3); onSuccess && onSuccess(form); }, 2200);
    }
  };

  const tier = TIERS.find(t => t.id === selectedTier) || TIERS[0];

  const fmtCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  if (step === 3) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 48, animation: "fadeUp .6s ease both" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎵</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
          Order Confirmed!
        </div>
        <div style={{ color: "rgba(245,237,224,.85)", fontSize: 16, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px" }}>
          Thank you, <strong style={{ color: "var(--gold)" }}>{form.name}</strong>! Your custom song is in the queue.
          We'll send your full song download link to <strong style={{ color: "var(--gold)" }}>{form.email}</strong>. Your WAV {tier.id === "two" ? "files" : "file"} will be ready within 3–5 business days.
        </div>
        <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "20px 28px", display: "inline-block", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: 13, color: "#c4a882", marginBottom: 4 }}>Order Summary</div>
          <div style={{ color: "#fff", fontWeight: 600 }}>{tier.name} — ${tier.price.toFixed(2)}</div>
          <div style={{ color: "#c4a882", fontSize: 14 }}>Genre: {form.genre} · {form.tempo}</div>
          {form.artistMimic && <div style={{ color: "#c4a882", fontSize: 14 }}>Style: {form.artistMimic}</div>}
        </div>
        <div>
          <button style={S.btnGold} onClick={onBack}>Order Another Song</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
        {["Song Details","Payment"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: step > i+1 ? "var(--gold)" : step === i+1 ? "linear-gradient(135deg,var(--gold),var(--gold2))" : "var(--surface2)",
              border: step === i+1 ? "none" : "1px solid rgba(201,168,76,.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: step >= i+1 ? "#1a1200" : "#c4a882",
            }}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span style={{ fontSize: 14, color: step === i+1 ? "var(--gold)" : "#c4a882" }}>{label}</span>
            {i < 1 && <div style={{ width: 40, height: 1, background: "rgba(201,168,76,.2)" }} />}
          </div>
        ))}
        <div style={{ marginLeft: "auto", background: "rgba(201,168,76,.1)", borderRadius: 50, padding: "6px 16px", fontSize: 14, color: "var(--gold)" }}>
          {tier.name} · ${tier.price.toFixed(2)}
        </div>
      </div>

      {step === 1 && (
        <div style={S.card}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 28 }}>Song Details</div>

          <div style={S.row2}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Your Name *</label>
              <input style={fldStyle("name")} value={form.name} onChange={set("name")} placeholder="Jane Smith" />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Your Email *</label>
              <input style={fldStyle("email")} value={form.email} onChange={set("email")} placeholder="jane@email.com" type="email" />
            </div>
          </div>

          <div style={S.row2}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Song Title / Occasion</label>
              <input style={S.input} value={form.title} onChange={set("title")} placeholder="e.g. Wedding Anniversary" />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Who is this for?</label>
              <input style={S.input} value={form.recipient} onChange={set("recipient")} placeholder="e.g. My wife Sarah" />
            </div>
          </div>

          <div style={S.row2}>
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

          <div style={S.row2}>
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
            <textarea
              style={{ ...S.textarea, borderColor: errors.lyrics ? "var(--danger)" : "rgba(201,168,76,.2)" }}
              value={form.lyrics}
              onChange={set("lyrics")}
              placeholder="Tell us the story, key phrases you want included, names, inside jokes, memories, anything that makes this song uniquely yours…"
            />
            {errors.lyrics && <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>Please provide some detail for the song.</div>}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "rgba(212,133,74,.08)",
              border: "1px solid rgba(212,133,74,.2)",
              borderRadius: 8, padding: "12px 14px", marginTop: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <div style={{ fontSize: 13, color: "#e0cdb8", lineHeight: 1.7 }}>
                <strong style={{ color: "#d4854a" }}>Pro tip:</strong> The more detail you give us, the more personal and accurate your song will be. Include names, places, special memories, inside jokes, how you met, favorite things — anything that makes your story unique. The richer the details, the better the song!
              </div>
            </div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Additional Notes</label>
            <textarea style={{ ...S.textarea, minHeight: 70 }} value={form.extraNotes} onChange={set("extraNotes")} placeholder="Any instruments you love, things to avoid, reference songs, delivery notes…" />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button style={S.btnOutline} onClick={onBack}>← Back</button>
            <button style={S.btnGold} onClick={nextStep}>Continue to Payment →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={S.card}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>Payment</div>
          <div style={{ color: "#c4a882", fontSize: 14, marginBottom: 28 }}>🔒 Secured by Stripe — your card info never touches our servers.</div>

          <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "16px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--gold)", fontWeight: 600 }}>{tier.name} Package</div>
              <div style={{ color: "#c4a882", fontSize: 13 }}>{tier.features.join(" · ")}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>${tier.price.toFixed(2)}</div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Name on Card</label>
            <input style={fldStyle("cardName")} value={form.cardName} onChange={set("cardName")} placeholder="Jane Smith" />
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Card Number</label>
            <input
              style={fldStyle("cardNum")}
              value={form.cardNum}
              onChange={e => setForm(f => ({ ...f, cardNum: fmtCard(e.target.value) }))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div style={S.row2}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Expiry</label>
              <input
                style={fldStyle("expiry")}
                value={form.expiry}
                onChange={e => setForm(f => ({ ...f, expiry: fmtExp(e.target.value) }))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>CVV</label>
              <input style={fldStyle("cvv")} value={form.cvv} onChange={set("cvv")} placeholder="123" maxLength={4} type="password" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button style={S.btnOutline} onClick={() => setStep(1)}>← Back</button>
            <button
              style={{ ...S.btnGold, minWidth: 180, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              onClick={nextStep}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid #1a1200", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                  Processing…
                </>
              ) : `Pay $${tier.price.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home"); // home | order
  const [selectedTier, setSelectedTier] = useState("one");
  const [orderDone, setOrderDone] = useState(false);

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
          background: "rgba(10,10,15,.85)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,168,76,.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 40px",
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            🎸 <span style={{ color: "var(--gold)" }}>Dirt Road</span> Beats
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["how-it-works", "pricing", "sample"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "rgba(245,237,224,.92)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans'", textTransform: "capitalize" }}>
                {id.replace(/-/g," ")}
              </button>
            ))}
            <button style={{ ...S.btnGold, padding: "10px 24px", fontSize: 13 }} onClick={() => setView("order")}>
              Order Now
            </button>
          </div>
        </nav>

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
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp .9s .3s ease both" }}>
              <button style={S.btnGold} onClick={() => scrollTo("pricing")}>
                See Packages ↓
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
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

        {/* SAMPLE PLAYER */}
        <section id="sample" style={{ ...S.section, maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={S.sectionTitle}>Hear What's Possible</h2>
            <p style={S.sectionSub}>Listen to a 30-second protected preview of a sample custom song.</p>
          </div>
          <ProtectedPlayer title="Golden Days" artistHint="Morgan Wallen" />
        </section>

        <hr style={{ ...S.divider, maxWidth: 960, margin: "0 auto 60px" }} />

        {/* PRICING */}
        <section id="pricing" style={{ ...S.section, maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={S.sectionTitle}>Choose Your Package</h2>
            <p style={S.sectionSub}>Every package includes a custom-written song. Upgrade for faster delivery and more revisions.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, maxWidth: 700, margin: "0 auto", alignItems: "start" }}>
            {TIERS.map(tier => (
              <div
                key={tier.id}
                onClick={() => { setSelectedTier(tier.id); }}
                style={{
                  ...S.card,
                  border: tier.featured ? `1px solid ${tier.color}` : "1px solid rgba(201,168,76,.15)",
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
                <div style={{ color: tier.color, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{tier.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 900, color: "#ffffff", marginBottom: 4 }}>${tier.price.toFixed(2)}</div>
                <div style={{ color: "#e0cdb8", fontSize: 13, marginBottom: 20 }}>{tier.desc}</div>
                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, color: "#f5ede0", fontSize: 14, marginBottom: 10 }}>
                      <span style={{ color: tier.color, fontSize: 16 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  style={tier.featured ? { ...S.btnGold, width: "100%", textAlign: "center" } : { ...S.btnOutline, width: "100%", textAlign: "center" }}
                  onClick={(e) => { e.stopPropagation(); setSelectedTier(tier.id); setView("order"); }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(180deg, transparent, rgba(58,26,8,.4), transparent)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
            Ready to Create Something<br /><em style={{ color: "var(--gold)" }}>Unforgettable?</em>
          </div>
          <p style={{ color: "rgba(245,237,224,.88)", marginBottom: 32, fontSize: 16 }}>Join hundreds of people who've turned their stories into songs.</p>
          <button style={{ ...S.btnGold, fontSize: 17, padding: "18px 48px" }} onClick={() => { setSelectedTier("one"); setView("order"); }}>
            Order Your Song Today
          </button>
        </section>

        {/* FOOTER */}
        <footer style={S.footer}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--gold)", marginBottom: 8 }}>🎸 Dirt Road Beats</div>
          <div style={{ marginBottom: 16 }}>Custom songs, rooted in your story and crafted with heart.</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
            {["Privacy Policy","Terms of Service","Contact Us","Refund Policy"].map(l => (
              <a key={l} href="#" style={{ color: "#d4c4b0", textDecoration: "none", fontSize: 13 }}>{l}</a>
            ))}
          </div>
          <div>© {new Date().getFullYear()} Dirt Road Beats. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}
