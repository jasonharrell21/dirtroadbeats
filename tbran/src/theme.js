export const T = {
  // Color tokens
  cream: '#FAF6EE',
  ink: '#1B2430',
  clay: '#C24A36',
  sage: '#7C9070',
  slate: '#5B6470',
  muted: '#8A9099',

  // Typography
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Courier New', monospace",

  // Spacing scale
  sp1: '4px',
  sp2: '8px',
  sp3: '12px',
  sp4: '16px',
  sp5: '20px',
  sp6: '24px',
  sp8: '32px',
  sp10: '40px',
  sp12: '48px',
  sp16: '64px',
  sp20: '80px',
  sp24: '96px',

  // Shadows
  shadowSm: '0 1px 3px rgba(27,36,48,0.08)',
  shadowMd: '0 4px 16px rgba(27,36,48,0.10)',
  shadowLg: '0 8px 32px rgba(27,36,48,0.12)',

  // Border radius
  radius: '6px',
  radiusMd: '10px',
  radiusLg: '16px',

  // Common styles
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: '10px',
    padding: '24px',
  },
}

// Tbran logo mark as inline SVG string (hexagon + diamond)
export const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="16,2 28,9 28,23 16,30 4,23 4,9"
      stroke="#1B2430"
      strokeWidth="1.8"
      fill="none"
    />
    <polygon
      points="16,10 20,16 16,22 12,16"
      fill="#1B2430"
    />
  </svg>
)

export const LogoMarkClay = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="16,2 28,9 28,23 16,30 4,23 4,9"
      stroke="#C24A36"
      strokeWidth="1.8"
      fill="none"
    />
    <polygon
      points="16,10 20,16 16,22 12,16"
      fill="#C24A36"
    />
  </svg>
)
