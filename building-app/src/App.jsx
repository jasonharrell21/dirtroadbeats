import { useState } from 'react';
import Step1BuildingType from './components/Step1BuildingType.jsx';
import Step2Specs from './components/Step2Specs.jsx';
import Step3Structure from './components/Step3Structure.jsx';
import Step4Exterior from './components/Step4Exterior.jsx';
import Step5Interior from './components/Step5Interior.jsx';
import Step6Features from './components/Step6Features.jsx';
import Step7Summary from './components/Step7Summary.jsx';
import './App.css';

const STEPS = [
  { label: 'Type',      short: '1' },
  { label: 'Specs',     short: '2' },
  { label: 'Structure', short: '3' },
  { label: 'Exterior',  short: '4' },
  { label: 'Interior',  short: '5' },
  { label: 'Features',  short: '6' },
  { label: 'Summary',   short: '7' },
];

const DEFAULT_CONFIG = {
  buildingType: 'barndominium',
  specs: {
    squareFootage: 2000,
    stories: 1,
    bedrooms: 3,
    bathrooms: 2,
    garageType: '2car',
    porchType: 'front',
    rollUpDoors: 1,
  },
  structure: {
    foundation: 'slab',
    framing:    'steel',
    insulation: 'spray_foam',
    roofPitch:  '4:12',
  },
  exterior: {
    roofType:   'metal_standing_seam',
    roofColor:  'Charcoal',
    siding:     'metal_panel',
    sidingColor:'White',
    windows:    'double_pane',
    doors:      'steel',
    doorCount:  2,
  },
  interior: {
    flooring:    'luxury_vinyl',
    wallFinish:  'shiplap',
    countertops: 'granite',
    cabinets:    'semi_custom',
    fixtures:    'mid_grade',
  },
  features: {
    hvac:         'mini_split',
    electrical:   'standard',
    plumbing:     'standard',
    fireplace:    'none',
    solar:        false,
    generator:    false,
    tanklessWater:false,
  },
};

export default function App() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const canNext = () => {
    if (step === 0) return !!config.buildingType;
    return true;
  };

  const stepComponents = [
    <Step1BuildingType config={config} onChange={setConfig} />,
    <Step2Specs        config={config} onChange={setConfig} />,
    <Step3Structure    config={config} onChange={setConfig} />,
    <Step4Exterior     config={config} onChange={setConfig} />,
    <Step5Interior     config={config} onChange={setConfig} />,
    <Step6Features     config={config} onChange={setConfig} />,
    <Step7Summary      config={config} />,
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="14" width="28" height="16" stroke="#4a9eff" strokeWidth="2" fill="none"/>
              <polyline points="2,14 16,3 30,14" stroke="#4a9eff" strokeWidth="2" fill="none"/>
              <rect x="12" y="20" width="8" height="10" stroke="#4a9eff" strokeWidth="1.5"/>
              <line x1="8" y1="14" x2="8" y2="30" stroke="#4a9eff" strokeWidth="1" strokeDasharray="2 2"/>
              <line x1="24" y1="14" x2="24" y2="30" stroke="#4a9eff" strokeWidth="1" strokeDasharray="2 2"/>
            </svg>
            <div>
              <div className="logo-title">BuildRight</div>
              <div className="logo-sub">Blueprint Generator</div>
            </div>
          </div>
          <div className="header-right">
            {step === STEPS.length - 1 && (
              <button className="header-reset" onClick={() => { setStep(0); setConfig(DEFAULT_CONFIG); }}>
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <button
            key={i}
            className={`step-bubble ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
          >
            <span className="bubble">{i < step ? '✓' : s.short}</span>
            <span className="step-lbl">{s.label}</span>
          </button>
        ))}
        <div className="step-progress" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
      </div>

      <main className="main-content">
        <div className="step-panel">
          {stepComponents[step]}
        </div>
      </main>

      <div className="nav-bar">
        <button
          className="nav-btn secondary"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          ← Back
        </button>
        <div className="nav-center">
          Step {step + 1} of {STEPS.length}
        </div>
        {step < STEPS.length - 1 ? (
          <button
            className="nav-btn primary"
            onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
            disabled={!canNext()}
          >
            Next →
          </button>
        ) : (
          <button className="nav-btn print" onClick={() => window.print()}>
            Print / Save PDF
          </button>
        )}
      </div>
    </div>
  );
}
