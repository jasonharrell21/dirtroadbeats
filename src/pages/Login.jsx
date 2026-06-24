import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    nav("/dashboard");
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 16,
    color: "#111827",
    background: "#fff",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
            Trak<span style={{ color: "#f97316" }}>XP</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Sign in to your account</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#991b1b" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#fdba74" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading && <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#6b7280" }}>
          Don&rsquo;t have an account?{" "}
          <Link to="/signup" style={{ color: "#f97316", fontWeight: 500, textDecoration: "none" }}>Start free trial</Link>
        </div>
      </div>
    </div>
  );
}
