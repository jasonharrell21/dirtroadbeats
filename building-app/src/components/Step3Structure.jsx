import { FOUNDATION, FRAMING, INSULATION, ROOF_PITCH } from '../data/materials.js';

function OptionGrid({ options, selected, onSelect, costLabel = 'sqft' }) {
  return (
    <div className="option-grid">
      {Object.entries(options).map(([id, data]) => (
        <button
          key={id}
          className={`option-card ${selected === id ? 'selected' : ''}`}
          onClick={() => onSelect(id)}
        >
          <div className="option-label">{data.label}</div>
          {data.cost !== undefined && (
            <div className="option-cost">+${data.cost.toFixed(2)}/{costLabel}</div>
          )}
          {data.multiplier !== undefined && (
            <div className="option-cost">{Math.round((data.multiplier - 1) * 100)}% more roof area</div>
          )}
        </button>
      ))}
    </div>
  );
}

export default function Step3Structure({ config, onChange }) {
  const s = config.structure;
  function set(key, val) {
    onChange({ ...config, structure: { ...s, [key]: val } });
  }

  const isMetalShell = config.buildingType === 'metal_building' || config.buildingType === 'garage';

  return (
    <div className="step-content">
      <h2 className="step-title">Structural Systems</h2>
      <p className="step-sub">Choose the foundation, framing, insulation, and roof pitch.</p>

      <div className="section-block">
        <h3 className="section-heading">Foundation Type</h3>
        <OptionGrid options={FOUNDATION} selected={s.foundation} onSelect={(v) => set('foundation', v)} />
      </div>

      {!isMetalShell && (
        <div className="section-block">
          <h3 className="section-heading">Wall Framing</h3>
          <OptionGrid options={FRAMING} selected={s.framing} onSelect={(v) => set('framing', v)} />
        </div>
      )}

      <div className="section-block">
        <h3 className="section-heading">Insulation</h3>
        <OptionGrid options={INSULATION} selected={s.insulation} onSelect={(v) => set('insulation', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Roof Pitch</h3>
        <OptionGrid options={ROOF_PITCH} selected={s.roofPitch} onSelect={(v) => set('roofPitch', v)} costLabel="area" />
        <div className="pitch-visual">
          {Object.entries(ROOF_PITCH).map(([id, d]) => {
            const [r] = id.split(':').map(Number);
            return (
              <button
                key={id}
                className={`pitch-btn ${s.roofPitch === id ? 'active' : ''}`}
                onClick={() => set('roofPitch', id)}
                title={d.label}
              >
                <svg viewBox="0 0 40 30" width="48" height="36">
                  <polyline
                    points={`2,28 20,${28 - r * 3.5} 38,28`}
                    stroke="currentColor" strokeWidth="2" fill="none"
                  />
                  <line x1="2" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span>{id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
