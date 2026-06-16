import { FLOORING, WALL_FINISH, COUNTERTOPS, CABINETS, FIXTURES } from '../data/materials.js';

const FLOOR_SWATCHES = {
  concrete_polished: '#a0a0a0',
  luxury_vinyl:      '#c8a870',
  tile:              '#d0c8b8',
  hardwood:          '#8B5E3C',
  carpet:            '#b09070',
  engineered_wood:   '#a0703a',
};

const WALL_SWATCHES = {
  drywall:      '#f0ece4',
  shiplap:      '#ddd5c8',
  metal_panel:  '#9ab0c0',
  plank:        '#b89060',
};

function OptionGrid({ options, selected, onSelect, swatches, costLabel = 'sqft' }) {
  return (
    <div className="option-grid">
      {Object.entries(options).map(([id, data]) => (
        <button
          key={id}
          className={`option-card ${selected === id ? 'selected' : ''}`}
          onClick={() => onSelect(id)}
        >
          {swatches?.[id] && (
            <div className="option-swatch" style={{ background: swatches[id] }} />
          )}
          <div className="option-label">{data.label}</div>
          {data.cost !== undefined && <div className="option-cost">+${data.cost}/{costLabel}</div>}
          {data.unitCost !== undefined && <div className="option-cost">${data.unitCost.toLocaleString()}/set</div>}
        </button>
      ))}
    </div>
  );
}

const isLiving = (type) => type === 'custom_home' || type === 'barndominium';

export default function Step5Interior({ config, onChange }) {
  const i = config.interior;
  const living = isLiving(config.buildingType);

  function set(key, val) {
    onChange({ ...config, interior: { ...i, [key]: val } });
  }

  return (
    <div className="step-content">
      <h2 className="step-title">Interior Finishes</h2>
      <p className="step-sub">Select flooring, walls, cabinets, countertops, and fixtures.</p>

      <div className="section-block">
        <h3 className="section-heading">Flooring</h3>
        <OptionGrid options={FLOORING} selected={i.flooring} onSelect={(v) => set('flooring', v)} swatches={FLOOR_SWATCHES} />
      </div>

      <div className="section-block">
        <h3 className="section-heading">Interior Wall Finish</h3>
        <OptionGrid options={WALL_FINISH} selected={i.wallFinish} onSelect={(v) => set('wallFinish', v)} swatches={WALL_SWATCHES} />
      </div>

      {living && (
        <>
          <div className="section-block">
            <h3 className="section-heading">Countertops</h3>
            <OptionGrid options={COUNTERTOPS} selected={i.countertops} onSelect={(v) => set('countertops', v)} costLabel="LF" />
          </div>

          <div className="section-block">
            <h3 className="section-heading">Cabinets</h3>
            <OptionGrid options={CABINETS} selected={i.cabinets} onSelect={(v) => set('cabinets', v)} costLabel="LF" />
          </div>

          <div className="section-block">
            <h3 className="section-heading">Plumbing Fixtures</h3>
            <p className="section-note">Per bathroom — toilet, vanity, tub/shower, faucets, accessories</p>
            <OptionGrid options={FIXTURES} selected={i.fixtures} onSelect={(v) => set('fixtures', v)} costLabel="bath" />
          </div>
        </>
      )}
    </div>
  );
}
