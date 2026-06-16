import { ROOF_TYPES, ROOF_COLORS, SIDING, SIDING_COLORS, WINDOWS, DOORS } from '../data/materials.js';

function ColorSwatch({ colors, selected, onSelect }) {
  return (
    <div className="swatch-row">
      {colors.map((c) => (
        <button
          key={c.id}
          className={`swatch ${selected === c.label ? 'active' : ''}`}
          style={{ background: c.hex }}
          title={c.label}
          onClick={() => onSelect(c.label)}
        >
          {selected === c.label && <span className="swatch-check">✓</span>}
        </button>
      ))}
      <div className="swatch-label-current">
        {colors.find(c => c.label === selected)?.label || colors[0]?.label}
      </div>
    </div>
  );
}

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
          {data.cost !== undefined && <div className="option-cost">+${data.cost}/{costLabel}</div>}
          {data.unitCost !== undefined && <div className="option-cost">${data.unitCost.toLocaleString()}/unit</div>}
        </button>
      ))}
    </div>
  );
}

export default function Step4Exterior({ config, onChange }) {
  const e = config.exterior;
  function set(key, val) {
    onChange({ ...config, exterior: { ...e, [key]: val } });
  }

  return (
    <div className="step-content">
      <h2 className="step-title">Exterior Finishes</h2>
      <p className="step-sub">Choose your roof, siding, windows, and doors.</p>

      <div className="section-block">
        <h3 className="section-heading">Roof Type</h3>
        <OptionGrid options={ROOF_TYPES} selected={e.roofType} onSelect={(v) => set('roofType', v)} />
        <h4 className="subsection-heading">Roof Color</h4>
        <ColorSwatch colors={ROOF_COLORS} selected={e.roofColor} onSelect={(v) => set('roofColor', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Siding / Wall Cladding</h3>
        <OptionGrid options={SIDING} selected={e.siding} onSelect={(v) => set('siding', v)} />
        <h4 className="subsection-heading">Siding Color</h4>
        <ColorSwatch colors={SIDING_COLORS} selected={e.sidingColor} onSelect={(v) => set('sidingColor', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Windows</h3>
        <OptionGrid options={WINDOWS} selected={e.windows} onSelect={(v) => set('windows', v)} costLabel="unit" />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Entry Doors</h3>
        <OptionGrid options={DOORS} selected={e.doors} onSelect={(v) => set('doors', v)} costLabel="unit" />
        <div className="counter-inline">
          <label className="spec-label" style={{ margin: 0 }}>Number of Entry Doors</label>
          <div className="counter-row">
            <button className="counter-btn" onClick={() => set('doorCount', Math.max(1, (e.doorCount || 2) - 1))}>−</button>
            <span className="counter-val">{e.doorCount || 2}</span>
            <button className="counter-btn" onClick={() => set('doorCount', Math.min(6, (e.doorCount || 2) + 1))}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
