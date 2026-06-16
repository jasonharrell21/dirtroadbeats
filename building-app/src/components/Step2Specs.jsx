const BATH_OPTIONS = [
  { value: 1,   label: '1' },
  { value: 1.5, label: '1.5' },
  { value: 2,   label: '2' },
  { value: 2.5, label: '2.5' },
  { value: 3,   label: '3' },
  { value: 3.5, label: '3.5' },
  { value: 4,   label: '4' },
  { value: 5,   label: '5+' },
];

const GARAGE_OPTIONS = [
  { value: 'none',     label: 'None' },
  { value: '1car',     label: '1-Car' },
  { value: '2car',     label: '2-Car' },
  { value: '3car',     label: '3-Car' },
  { value: 'detached', label: 'Detached 2-Car' },
];

const PORCH_OPTIONS = [
  { value: 'none',  label: 'None' },
  { value: 'front', label: 'Front Porch' },
  { value: 'back',  label: 'Back Porch/Deck' },
  { value: 'both',  label: 'Front & Back' },
  { value: 'wrap',  label: 'Wrap-Around' },
];

const isLiving = (type) => type === 'custom_home' || type === 'barndominium';

export default function Step2Specs({ config, onChange }) {
  const specs = config.specs;
  const living = isLiving(config.buildingType);

  function set(key, value) {
    onChange({ ...config, specs: { ...specs, [key]: value } });
  }

  return (
    <div className="step-content">
      <h2 className="step-title">Building Specifications</h2>
      <p className="step-sub">Enter the size and layout details for your structure.</p>

      <div className="spec-grid">
        <div className="spec-card full-width">
          <label className="spec-label">Total Square Footage</label>
          <div className="sqft-row">
            <input
              type="range"
              min="400" max="8000" step="100"
              value={specs.squareFootage}
              onChange={(e) => set('squareFootage', parseInt(e.target.value))}
              className="sqft-slider"
            />
            <div className="sqft-input-wrap">
              <input
                type="number"
                min="400" max="8000" step="100"
                value={specs.squareFootage}
                onChange={(e) => set('squareFootage', Math.min(8000, Math.max(400, parseInt(e.target.value) || 400)))}
                className="sqft-input"
              />
              <span className="sqft-unit">sq ft</span>
            </div>
          </div>
          <div className="sqft-presets">
            {[800, 1200, 1500, 2000, 2500, 3000, 4000, 5000].map((v) => (
              <button key={v} className={`preset-btn ${specs.squareFootage === v ? 'active' : ''}`}
                onClick={() => set('squareFootage', v)}>
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="spec-card">
          <label className="spec-label">Stories</label>
          <div className="toggle-row">
            {[1, 2].map((n) => (
              <button key={n} className={`toggle-btn ${specs.stories === n ? 'active' : ''}`}
                onClick={() => set('stories', n)}>
                {n === 1 ? 'Single Story' : '2-Story'}
              </button>
            ))}
          </div>
        </div>

        {living && (
          <div className="spec-card">
            <label className="spec-label">Bedrooms</label>
            <div className="counter-row">
              <button className="counter-btn" onClick={() => set('bedrooms', Math.max(0, specs.bedrooms - 1))}>−</button>
              <span className="counter-val">{specs.bedrooms}</span>
              <button className="counter-btn" onClick={() => set('bedrooms', Math.min(8, specs.bedrooms + 1))}>+</button>
            </div>
          </div>
        )}

        {living && (
          <div className="spec-card">
            <label className="spec-label">Bathrooms</label>
            <div className="chip-row">
              {BATH_OPTIONS.map((o) => (
                <button key={o.value} className={`chip ${specs.bathrooms === o.value ? 'active' : ''}`}
                  onClick={() => set('bathrooms', o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="spec-card">
          <label className="spec-label">Garage</label>
          <div className="chip-row">
            {GARAGE_OPTIONS.map((o) => (
              <button key={o.value} className={`chip ${specs.garageType === o.value ? 'active' : ''}`}
                onClick={() => set('garageType', o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="spec-card">
          <label className="spec-label">Porch / Deck</label>
          <div className="chip-row">
            {PORCH_OPTIONS.map((o) => (
              <button key={o.value} className={`chip ${specs.porchType === o.value ? 'active' : ''}`}
                onClick={() => set('porchType', o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {!living && (
          <div className="spec-card">
            <label className="spec-label">Roll-Up / Overhead Doors</label>
            <div className="counter-row">
              <button className="counter-btn" onClick={() => set('rollUpDoors', Math.max(0, (specs.rollUpDoors || 1) - 1))}>−</button>
              <span className="counter-val">{specs.rollUpDoors || 1}</span>
              <button className="counter-btn" onClick={() => set('rollUpDoors', Math.min(8, (specs.rollUpDoors || 1) + 1))}>+</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
