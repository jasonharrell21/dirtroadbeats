const TYPES = [
  {
    id: 'metal_building',
    label: 'Metal Building',
    sub: 'Pole barn, shop, or agricultural steel building',
    icon: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="30" width="70" height="25" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="5,30 40,8 75,30" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="30" y="38" width="20" height="17" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="5" y1="30" x2="75" y2="30" stroke="currentColor" strokeWidth="1"/>
        <line x1="15" y1="30" x2="15" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
        <line x1="65" y1="30" x2="65" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: 'barndominium',
    label: 'Barndominium',
    sub: 'Living quarters inside a metal structure',
    icon: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="28" width="70" height="27" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="5,28 40,6 75,28" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="8" y="36" width="22" height="19" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="50" y="36" width="22" height="19" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="33" y="40" width="14" height="15" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="12" y="39" width="7" height="7" stroke="currentColor" strokeWidth="1"/>
        <rect x="61" y="39" width="7" height="7" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: 'custom_home',
    label: 'Custom Home',
    sub: 'Traditional wood-frame or ICF construction',
    icon: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="30" width="64" height="26" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="8,30 40,8 72,30" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="32" y="40" width="16" height="16" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="12" y="34" width="10" height="10" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="58" y="34" width="10" height="10" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="37" y1="40" x2="37" y2="56" stroke="currentColor" strokeWidth="1"/>
        <rect x="20" y="30" width="6" height="3" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2"/>
        <rect x="54" y="30" width="6" height="3" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 'garage',
    label: 'Garage / Shop',
    sub: 'Standalone garage, workshop, or storage building',
    icon: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="22" width="70" height="35" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="5,22 40,8 75,22" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="10" y="30" width="60" height="27" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1"/>
        <line x1="10" y1="48" x2="70" y2="48" stroke="currentColor" strokeWidth="1"/>
        <line x1="40" y1="30" x2="40" y2="57" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function Step1BuildingType({ config, onChange }) {
  return (
    <div className="step-content">
      <h2 className="step-title">What are you building?</h2>
      <p className="step-sub">Select the type of structure to get accurate estimates and plans.</p>
      <div className="type-grid">
        {TYPES.map((t) => (
          <button
            key={t.id}
            className={`type-card ${config.buildingType === t.id ? 'selected' : ''}`}
            onClick={() => onChange({ ...config, buildingType: t.id })}
          >
            <div className="type-icon">{t.icon}</div>
            <div className="type-label">{t.label}</div>
            <div className="type-sub">{t.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
