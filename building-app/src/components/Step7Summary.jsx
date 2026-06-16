import { useState } from 'react';
import { calculateEstimate, generateBOM } from '../utils/calculator.js';
import BlueprintSVG from './BlueprintSVG.jsx';
import { BASE_COSTS } from '../data/materials.js';

const fmt = (n) => '$' + Math.round(n).toLocaleString();

const CATEGORIES = ['Structure', 'Foundation', 'Framing', 'Insulation', 'Roofing', 'Exterior', 'Windows & Doors', 'Garage', 'Porch/Deck', 'Interior', 'Kitchen/Bath', 'Plumbing', 'Mechanical', 'Electrical', 'Features', 'Contingency'];

const CATEGORY_COLORS = {
  'Structure':     '#4a9eff',
  'Foundation':    '#ff9f4a',
  'Framing':       '#4affb0',
  'Insulation':    '#b04aff',
  'Roofing':       '#ff4a9f',
  'Exterior':      '#ffdd4a',
  'Windows & Doors':'#4affff',
  'Garage':        '#ff7a4a',
  'Porch/Deck':    '#8aff4a',
  'Interior':      '#4a7aff',
  'Kitchen/Bath':  '#ff4a4a',
  'Plumbing':      '#4ab0ff',
  'Mechanical':    '#ffa04a',
  'Electrical':    '#ffff4a',
  'Features':      '#c04aff',
  'Contingency':   '#888',
};

export default function Step7Summary({ config }) {
  const [activeTab, setActiveTab] = useState('blueprint');
  const [expandedCat, setExpandedCat] = useState(null);

  const estimate = calculateEstimate(config);
  const bom = generateBOM(config);
  const buildingLabel = BASE_COSTS[config.buildingType]?.label || 'Building';

  const grouped = {};
  for (const item of estimate.lineItems) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const catTotals = Object.entries(grouped).map(([cat, items]) => ({
    cat,
    total: items.reduce((s, i) => s + i.total, 0),
  })).sort((a, b) => b.total - a.total);
  const maxTotal = catTotals[0]?.total || 1;

  const bomGrouped = {};
  for (const item of bom) {
    if (!bomGrouped[item.category]) bomGrouped[item.category] = [];
    bomGrouped[item.category].push(item);
  }

  return (
    <div className="step-content summary">
      <div className="cost-banner">
        <div className="cost-banner-label">Estimated Total Cost</div>
        <div className="cost-banner-range">
          <span className="cost-low">{fmt(estimate.grandTotalLow)}</span>
          <span className="cost-sep">–</span>
          <span className="cost-high">{fmt(estimate.grandTotalHigh)}</span>
        </div>
        <div className="cost-banner-sub">
          {buildingLabel} · {config.specs.squareFootage.toLocaleString()} sq ft · ~{fmt(estimate.costPerSqft)}/sqft
        </div>
        <div className="cost-banner-note">
          Estimates reflect national averages (2024–2025). Actual costs vary by region, contractor, and market conditions.
        </div>
      </div>

      <div className="tab-bar">
        {[
          { id: 'blueprint', label: 'Blueprint' },
          { id: 'estimate',  label: 'Cost Estimate' },
          { id: 'bom',       label: 'Bill of Materials' },
          { id: 'summary',   label: 'Spec Summary' },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'blueprint' && (
        <div className="tab-panel">
          <div className="blueprint-header">
            <h3 className="section-heading" style={{ margin: 0 }}>Floor Plan</h3>
            <button className="print-btn" onClick={() => window.print()}>Print / Export PDF</button>
          </div>
          <div className="blueprint-wrap">
            <BlueprintSVG config={config} />
          </div>
          <div className="blueprint-notes">
            <p>This is a schematic layout generated from your specs. Room sizes are proportional estimates. Work with a licensed architect or engineer for construction-ready drawings.</p>
          </div>
          {parseInt(config.specs.stories) === 2 && (
            <div className="blueprint-note-badge">
              2-Story selected — second floor plan typically mirrors or reduces first floor footprint. Staircase added automatically by your designer.
            </div>
          )}
        </div>
      )}

      {activeTab === 'estimate' && (
        <div className="tab-panel">
          <div className="chart-section">
            <h3 className="section-heading">Cost Breakdown by Category</h3>
            <div className="bar-chart">
              {catTotals.map(({ cat, total }) => (
                <div key={cat} className="bar-row">
                  <div className="bar-label">{cat}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(total / maxTotal) * 100}%`,
                        background: CATEGORY_COLORS[cat] || '#4a9eff',
                      }}
                    />
                  </div>
                  <div className="bar-value">{fmt(total)}</div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="section-heading" style={{ marginTop: '2rem' }}>Detailed Line Items</h3>
          {CATEGORIES.filter(cat => grouped[cat]).map((cat) => (
            <div key={cat} className="estimate-category">
              <button
                className="cat-header"
                onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              >
                <span className="cat-dot" style={{ background: CATEGORY_COLORS[cat] || '#4a9eff' }} />
                <span className="cat-name">{cat}</span>
                <span className="cat-total">{fmt(grouped[cat].reduce((s, i) => s + i.total, 0))}</span>
                <span className="cat-arrow">{expandedCat === cat ? '▲' : '▼'}</span>
              </button>
              {expandedCat === cat && (
                <table className="line-item-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Unit Cost</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[cat].map((item, i) => (
                      <tr key={i}>
                        <td>{item.item}</td>
                        <td>{typeof item.qty === 'number' ? item.qty.toLocaleString() : item.qty}</td>
                        <td>{item.unit}</td>
                        <td>{fmt(item.unitCost)}</td>
                        <td>{fmt(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}

          <div className="estimate-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{fmt(estimate.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Contingency (10%)</span>
              <span>{fmt(estimate.contingency)}</span>
            </div>
            <div className="total-row grand">
              <span>Grand Total (Mid)</span>
              <span>{fmt(estimate.grandTotal)}</span>
            </div>
            <div className="total-row range">
              <span>Estimated Range</span>
              <span>{fmt(estimate.grandTotalLow)} – {fmt(estimate.grandTotalHigh)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bom' && (
        <div className="tab-panel">
          <div className="bom-header">
            <h3 className="section-heading" style={{ margin: 0 }}>Bill of Materials</h3>
            <button className="print-btn" onClick={() => window.print()}>Print / Export PDF</button>
          </div>
          <p className="section-note" style={{ marginBottom: '1rem' }}>
            Quantities are estimates based on industry-standard take-off methods. Verify with a licensed contractor or estimator before ordering.
          </p>
          {Object.keys(bomGrouped).map((cat) => (
            <div key={cat} className="bom-section">
              <h4 className="bom-cat-heading">
                <span className="cat-dot" style={{ background: CATEGORY_COLORS[cat] || '#4a9eff' }} />
                {cat}
              </h4>
              <table className="bom-table">
                <thead>
                  <tr>
                    <th>Material / Component</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {bomGrouped[cat].map((item, i) => (
                    <tr key={i}>
                      <td>{item.material}</td>
                      <td>{typeof item.qty === 'number' ? item.qty.toLocaleString() : item.qty}</td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="tab-panel">
          <h3 className="section-heading">Project Specification Summary</h3>
          <div className="spec-summary-grid">
            <SpecBlock title="Building Type" value={BASE_COSTS[config.buildingType]?.label} />
            <SpecBlock title="Square Footage" value={`${config.specs.squareFootage.toLocaleString()} sq ft`} />
            <SpecBlock title="Stories" value={config.specs.stories} />
            {(config.buildingType === 'custom_home' || config.buildingType === 'barndominium') && (
              <>
                <SpecBlock title="Bedrooms" value={config.specs.bedrooms} />
                <SpecBlock title="Bathrooms" value={config.specs.bathrooms} />
              </>
            )}
            <SpecBlock title="Garage" value={config.specs.garageType} />
            <SpecBlock title="Porch" value={config.specs.porchType} />
            <SpecBlock title="Foundation" value={config.structure.foundation} />
            <SpecBlock title="Framing" value={config.structure.framing} />
            <SpecBlock title="Insulation" value={config.structure.insulation} />
            <SpecBlock title="Roof Pitch" value={config.structure.roofPitch} />
            <SpecBlock title="Roof Type" value={config.exterior.roofType} />
            <SpecBlock title="Roof Color" value={config.exterior.roofColor} />
            <SpecBlock title="Siding" value={config.exterior.siding} />
            <SpecBlock title="Siding Color" value={config.exterior.sidingColor} />
            <SpecBlock title="Windows" value={config.exterior.windows} />
            <SpecBlock title="Entry Doors" value={`${config.exterior.doorCount || 2}x ${config.exterior.doors}`} />
            <SpecBlock title="Flooring" value={config.interior.flooring} />
            <SpecBlock title="Wall Finish" value={config.interior.wallFinish} />
            {(config.buildingType === 'custom_home' || config.buildingType === 'barndominium') && (
              <>
                <SpecBlock title="Countertops" value={config.interior.countertops} />
                <SpecBlock title="Cabinets" value={config.interior.cabinets} />
                <SpecBlock title="Fixtures" value={config.interior.fixtures} />
              </>
            )}
            <SpecBlock title="HVAC" value={config.features.hvac} />
            <SpecBlock title="Electrical" value={config.features.electrical} />
            <SpecBlock title="Plumbing" value={config.features.plumbing} />
            <SpecBlock title="Fireplace" value={config.features.fireplace || 'none'} />
            <SpecBlock title="Solar" value={config.features.solar ? 'Yes (5kW)' : 'No'} />
            <SpecBlock title="Generator" value={config.features.generator ? 'Yes (20kW)' : 'No'} />
          </div>
        </div>
      )}
    </div>
  );
}

function SpecBlock({ title, value }) {
  const display = String(value || '—').replace(/_/g, ' ');
  return (
    <div className="spec-block">
      <div className="spec-block-label">{title}</div>
      <div className="spec-block-value">{display}</div>
    </div>
  );
}
