import { HVAC, ELECTRICAL, PLUMBING } from '../data/materials.js';

function OptionGrid({ options, selected, onSelect }) {
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
            <div className="option-cost">
              {data.cost === 0 ? 'Not included' : `+$${data.cost}/sqft`}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <button
      className={`toggle-feature ${checked ? 'active' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <div className="toggle-feature-text">
        <span className="toggle-feature-label">{label}</span>
        {sub && <span className="toggle-feature-sub">{sub}</span>}
      </div>
      <div className={`toggle-switch ${checked ? 'on' : ''}`}>
        <div className="toggle-knob" />
      </div>
    </button>
  );
}

export default function Step6Features({ config, onChange }) {
  const f = config.features;
  const living = config.buildingType === 'custom_home' || config.buildingType === 'barndominium';

  function set(key, val) {
    onChange({ ...config, features: { ...f, [key]: val } });
  }

  return (
    <div className="step-content">
      <h2 className="step-title">Mechanical & Features</h2>
      <p className="step-sub">Configure HVAC, electrical, plumbing, and special add-ons.</p>

      <div className="section-block">
        <h3 className="section-heading">HVAC System</h3>
        <OptionGrid options={HVAC} selected={f.hvac} onSelect={(v) => set('hvac', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Electrical Service</h3>
        <OptionGrid options={ELECTRICAL} selected={f.electrical} onSelect={(v) => set('electrical', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Plumbing Rough-In</h3>
        <OptionGrid options={PLUMBING} selected={f.plumbing} onSelect={(v) => set('plumbing', v)} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Add-On Features</h3>
        <div className="toggle-list">
          {living && (
            <div className="fireplace-select">
              <label className="spec-label">Fireplace</label>
              <div className="chip-row">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'gas',  label: 'Gas Fireplace (+$4,500)' },
                  { value: 'wood', label: 'Wood-Burning (+$3,500)' },
                ].map((o) => (
                  <button
                    key={o.value}
                    className={`chip ${f.fireplace === o.value ? 'active' : ''}`}
                    onClick={() => set('fireplace', o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Toggle
            label="Solar Panel System (5kW)"
            sub="+$18,000 — grid-tied, net metering ready"
            checked={f.solar}
            onChange={(v) => set('solar', v)}
          />
          <Toggle
            label="Whole-Home Generator (20kW)"
            sub="+$8,000 — automatic standby, propane/NG"
            checked={f.generator}
            onChange={(v) => set('generator', v)}
          />
          {living && (
            <Toggle
              label="Tankless Water Heater"
              sub="+$1,800 — on-demand hot water"
              checked={f.tanklessWater}
              onChange={(v) => set('tanklessWater', v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
