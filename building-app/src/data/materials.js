// Base cost per square foot by building type (labor + materials)
export const BASE_COSTS = {
  metal_building:  { min: 28,  max: 55,  label: 'Metal Building / Shop' },
  barndominium:    { min: 95,  max: 175, label: 'Barndominium' },
  custom_home:     { min: 150, max: 300, label: 'Custom Home' },
  garage:          { min: 20,  max: 40,  label: 'Garage / Shop' },
};

export const FOUNDATION = {
  slab:      { cost: 8,  label: 'Concrete Slab' },
  crawl:     { cost: 12, label: 'Crawl Space' },
  basement:  { cost: 30, label: 'Full Basement' },
  pier:      { cost: 6,  label: 'Pier & Beam' },
};

export const FRAMING = {
  wood:  { cost: 12, label: 'Wood Frame' },
  steel: { cost: 18, label: 'Steel Frame' },
  icf:   { cost: 22, label: 'ICF (Insulated Concrete Forms)' },
};

export const INSULATION = {
  fiberglass_batt: { cost: 1.50, label: 'Fiberglass Batt' },
  blown_in:        { cost: 2.20, label: 'Blown-In Cellulose' },
  rigid_board:     { cost: 3.00, label: 'Rigid Foam Board' },
  spray_foam:      { cost: 4.50, label: 'Closed-Cell Spray Foam' },
};

export const ROOF_TYPES = {
  metal_standing_seam: { cost: 8.5,  label: 'Standing Seam Metal' },
  metal_ribbed:        { cost: 4.5,  label: 'Ribbed Metal Panel' },
  architectural_shingle:{ cost: 3.5, label: 'Architectural Shingles' },
  flat_tpo:            { cost: 5.0,  label: 'Flat / TPO Membrane' },
};

export const ROOF_COLORS = [
  { id: 'galvalume',    label: 'Galvalume',       hex: '#b0b8c1' },
  { id: 'charcoal',     label: 'Charcoal',        hex: '#4a4a4a' },
  { id: 'barn_red',     label: 'Barn Red',         hex: '#8b2020' },
  { id: 'forest_green', label: 'Forest Green',     hex: '#2d5a27' },
  { id: 'sandstone',    label: 'Sandstone',        hex: '#c8a96a' },
  { id: 'white',        label: 'White',            hex: '#f0f0f0' },
  { id: 'slate_blue',   label: 'Slate Blue',       hex: '#5a7a9a' },
  { id: 'bronze',       label: 'Bronze',           hex: '#7a5a3a' },
];

export const SIDING = {
  metal_panel:   { cost: 4.5,  label: 'Metal Panel' },
  hardie_plank:  { cost: 6.5,  label: 'HardiePlank Fiber Cement' },
  vinyl:         { cost: 3.5,  label: 'Vinyl Siding' },
  brick:         { cost: 14,   label: 'Brick Veneer' },
  stone:         { cost: 18,   label: 'Stone Veneer' },
  wood:          { cost: 9,    label: 'Cedar / Wood Siding' },
};

export const SIDING_COLORS = [
  { id: 'white',          label: 'White',         hex: '#f5f5f0' },
  { id: 'light_gray',     label: 'Light Gray',    hex: '#c8c8c8' },
  { id: 'charcoal',       label: 'Charcoal',      hex: '#3a3a3a' },
  { id: 'navy',           label: 'Navy Blue',     hex: '#1e3a5f' },
  { id: 'tan',            label: 'Tan/Beige',     hex: '#c8a96a' },
  { id: 'barn_red',       label: 'Barn Red',      hex: '#8b2020' },
  { id: 'forest_green',   label: 'Forest Green',  hex: '#2d5a27' },
  { id: 'clay',           label: 'Clay',          hex: '#b5855a' },
];

export const WINDOWS = {
  standard_vinyl:  { unitCost: 350,  label: 'Standard Vinyl Double-Hung' },
  double_pane:     { unitCost: 550,  label: 'Double-Pane Low-E' },
  casement:        { unitCost: 650,  label: 'Casement / Awning' },
  impact:          { unitCost: 950,  label: 'Impact-Resistant' },
  custom_aluminum: { unitCost: 1200, label: 'Custom Aluminum' },
};

export const DOORS = {
  steel:      { unitCost: 800,  label: 'Steel Entry Door' },
  fiberglass: { unitCost: 1200, label: 'Fiberglass Entry Door' },
  wood:       { unitCost: 2000, label: 'Solid Wood Entry Door' },
  roll_up:    { unitCost: 1800, label: 'Commercial Roll-Up Door' },
};

export const FLOORING = {
  concrete_polished: { cost: 4,  label: 'Polished Concrete' },
  luxury_vinyl:      { cost: 5,  label: 'Luxury Vinyl Plank (LVP)' },
  tile:              { cost: 8,  label: 'Ceramic / Porcelain Tile' },
  hardwood:          { cost: 12, label: 'Hardwood' },
  carpet:            { cost: 4,  label: 'Carpet' },
  engineered_wood:   { cost: 9,  label: 'Engineered Hardwood' },
};

export const WALL_FINISH = {
  drywall:      { cost: 2.5, label: 'Drywall & Paint' },
  shiplap:      { cost: 5.5, label: 'Shiplap / Board & Batten' },
  metal_panel:  { cost: 4.0, label: 'Metal Wall Panel (interior)' },
  plank:        { cost: 6.0, label: 'Wood Plank / Wainscoting' },
};

export const COUNTERTOPS = {
  laminate:      { cost: 30,  label: 'Laminate (Formica)' },
  butcher_block: { cost: 55,  label: 'Butcher Block' },
  granite:       { cost: 80,  label: 'Granite' },
  quartz:        { cost: 90,  label: 'Quartz (Engineered)' },
  concrete:      { cost: 100, label: 'Poured Concrete' },
  marble:        { cost: 130, label: 'Marble' },
};

export const CABINETS = {
  stock:        { cost: 120, label: 'Stock / RTA Cabinets' },
  semi_custom:  { cost: 250, label: 'Semi-Custom Cabinets' },
  custom:       { cost: 500, label: 'Custom Built Cabinets' },
};

export const FIXTURES = {
  standard: { cost: 2500,  label: 'Standard (Builder Grade)' },
  mid_grade: { cost: 5000, label: 'Mid-Grade' },
  luxury:    { cost: 10000, label: 'Luxury / Designer' },
};

export const HVAC = {
  none:      { cost: 0,  label: 'None / Shell Only' },
  mini_split:{ cost: 5,  label: 'Mini-Split (Ductless)' },
  central:   { cost: 8,  label: 'Central Ducted HVAC' },
  geothermal:{ cost: 15, label: 'Geothermal Heat Pump' },
};

export const ELECTRICAL = {
  standard:  { cost: 4,  label: 'Standard (100/200A Panel)' },
  upgraded:  { cost: 7,  label: 'Upgraded (400A + Smart Home)' },
  commercial:{ cost: 10, label: 'Commercial Grade' },
};

export const PLUMBING = {
  standard:  { cost: 5, label: 'Standard' },
  upgraded:  { cost: 9, label: 'Upgraded (PEX / Manifold)' },
};

export const ADDONS = {
  fireplace_gas:  { cost: 4500,  label: 'Gas Fireplace (insert + surround)' },
  fireplace_wood: { cost: 3500,  label: 'Wood-Burning Fireplace & Chimney' },
  solar_5kw:      { cost: 18000, label: 'Solar System (5kW)' },
  generator:      { cost: 8000,  label: 'Whole-Home Generator (20kW)' },
  tankless_water: { cost: 1800,  label: 'Tankless Water Heater' },
  spray_kitchen:  { cost: 500,   label: 'Kitchen Sprayer Upgrade' },
};

export const PORCH = {
  none:     { cost: 0,  label: 'None' },
  front:    { cost: 18, label: 'Front Porch' },
  back:     { cost: 18, label: 'Back Porch/Deck' },
  wrap:     { cost: 22, label: 'Wrap-Around Porch' },
  both:     { cost: 20, label: 'Front & Back Porch' },
};

export const GARAGE = {
  none:      { cost: 0,     label: 'No Garage' },
  '1car':    { cost: 12000, label: '1-Car Garage (12x20)' },
  '2car':    { cost: 22000, label: '2-Car Garage (22x24)' },
  '3car':    { cost: 32000, label: '3-Car Garage (32x24)' },
  detached:  { cost: 28000, label: 'Detached 2-Car Garage' },
};

export const ROOF_PITCH = {
  '2:12':  { multiplier: 1.03, label: '2:12 (Low Pitch)' },
  '4:12':  { multiplier: 1.06, label: '4:12 (Standard)' },
  '6:12':  { multiplier: 1.12, label: '6:12 (Moderate)' },
  '8:12':  { multiplier: 1.20, label: '8:12 (Steep)' },
  '12:12': { multiplier: 1.42, label: '12:12 (Cathedral)' },
};

export const estimateWindowCount = (bedrooms, squareFootage) => {
  const base = 4;
  const perBed = 2;
  const perSqft = Math.floor(squareFootage / 500);
  return base + bedrooms * perBed + perSqft;
};

export const estimateCounterLF = (squareFootage) => {
  if (squareFootage < 1000) return 12;
  if (squareFootage < 2000) return 18;
  if (squareFootage < 3000) return 24;
  return 30;
};

export const estimateCabinetLF = (squareFootage) => estimateCounterLF(squareFootage) * 1.5;

export const estimatePorchSqft = (mainSqft, porchType) => {
  if (porchType === 'none') return 0;
  if (porchType === 'front') return Math.max(160, mainSqft * 0.08);
  if (porchType === 'back')  return Math.max(200, mainSqft * 0.10);
  if (porchType === 'both')  return Math.max(360, mainSqft * 0.18);
  if (porchType === 'wrap')  return Math.max(400, mainSqft * 0.22);
  return 0;
};
