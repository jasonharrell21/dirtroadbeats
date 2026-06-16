import {
  BASE_COSTS, FOUNDATION, FRAMING, INSULATION,
  ROOF_TYPES, ROOF_PITCH, SIDING,
  WINDOWS, DOORS, FLOORING, WALL_FINISH,
  COUNTERTOPS, CABINETS, FIXTURES,
  HVAC, ELECTRICAL, PLUMBING, ADDONS, PORCH, GARAGE,
  estimateWindowCount, estimateCounterLF, estimateCabinetLF, estimatePorchSqft,
} from '../data/materials.js';

export function calculateEstimate(config) {
  const { specs, structure, exterior, interior, features } = config;
  const sqft = specs.squareFootage;
  const baths = parseFloat(specs.bathrooms);
  const beds = parseInt(specs.bedrooms, 10);

  const lineItems = [];

  const base = BASE_COSTS[config.buildingType];
  const baseMid = (base.min + base.max) / 2;
  const baseTotal = sqft * baseMid;
  lineItems.push({ category: 'Structure', item: `${base.label} Shell (${sqft.toLocaleString()} sqft)`, qty: sqft, unit: 'sqft', unitCost: baseMid, total: baseTotal });

  const foundData = FOUNDATION[structure.foundation];
  const foundTotal = sqft * foundData.cost;
  lineItems.push({ category: 'Foundation', item: foundData.label, qty: sqft, unit: 'sqft', unitCost: foundData.cost, total: foundTotal });

  const framingData = FRAMING[structure.framing];
  const framingTotal = sqft * framingData.cost;
  lineItems.push({ category: 'Framing', item: framingData.label, qty: sqft, unit: 'sqft', unitCost: framingData.cost, total: framingTotal });

  const insulData = INSULATION[structure.insulation];
  const insulArea = Math.round(sqft * 1.8);
  const insulTotal = insulArea * insulData.cost;
  lineItems.push({ category: 'Insulation', item: insulData.label, qty: insulArea, unit: 'sqft', unitCost: insulData.cost, total: insulTotal });

  const pitchData = ROOF_PITCH[structure.roofPitch];
  const roofData = ROOF_TYPES[exterior.roofType];
  const roofArea = Math.round(sqft * pitchData.multiplier);
  const roofTotal = roofArea * roofData.cost;
  lineItems.push({ category: 'Roofing', item: `${roofData.label} — ${exterior.roofColor || 'Galvalume'} (${structure.roofPitch} pitch)`, qty: roofArea, unit: 'sqft', unitCost: roofData.cost, total: roofTotal });

  const sidingData = SIDING[exterior.siding];
  const wallArea = Math.round(sqft * 1.3);
  const sidingTotal = wallArea * sidingData.cost;
  lineItems.push({ category: 'Exterior', item: `${sidingData.label} — ${exterior.sidingColor || 'White'}`, qty: wallArea, unit: 'sqft', unitCost: sidingData.cost, total: sidingTotal });

  const winData = WINDOWS[exterior.windows];
  const winCount = estimateWindowCount(beds, sqft);
  const winTotal = winCount * winData.unitCost;
  lineItems.push({ category: 'Windows', item: winData.label, qty: winCount, unit: 'ea', unitCost: winData.unitCost, total: winTotal });

  const doorData = DOORS[exterior.doors];
  const doorCount = exterior.doorCount || 2;
  const doorTotal = doorCount * doorData.unitCost;
  lineItems.push({ category: 'Doors', item: `${doorData.label} (${doorCount})`, qty: doorCount, unit: 'ea', unitCost: doorData.unitCost, total: doorTotal });

  const garageData = GARAGE[specs.garageType];
  if (garageData.cost > 0) {
    lineItems.push({ category: 'Garage', item: garageData.label, qty: 1, unit: 'ea', unitCost: garageData.cost, total: garageData.cost });
  }

  const porchData = PORCH[specs.porchType];
  if (porchData.cost > 0) {
    const porchSqft = Math.round(estimatePorchSqft(sqft, specs.porchType));
    const porchTotal = porchSqft * porchData.cost;
    lineItems.push({ category: 'Porch/Deck', item: porchData.label, qty: porchSqft, unit: 'sqft', unitCost: porchData.cost, total: porchTotal });
  }

  const floorData = FLOORING[interior.flooring];
  const floorTotal = sqft * floorData.cost;
  lineItems.push({ category: 'Interior', item: `Flooring: ${floorData.label}`, qty: sqft, unit: 'sqft', unitCost: floorData.cost, total: floorTotal });

  const wallFinishData = WALL_FINISH[interior.wallFinish];
  const intWallArea = Math.round(sqft * 1.2);
  const wallFinishTotal = intWallArea * wallFinishData.cost;
  lineItems.push({ category: 'Interior', item: `Wall Finish: ${wallFinishData.label}`, qty: intWallArea, unit: 'sqft', unitCost: wallFinishData.cost, total: wallFinishTotal });

  const ctData = COUNTERTOPS[interior.countertops];
  const ctLF = estimateCounterLF(sqft);
  const ctTotal = ctLF * ctData.cost;
  lineItems.push({ category: 'Kitchen/Bath', item: `Countertops: ${ctData.label}`, qty: ctLF, unit: 'LF', unitCost: ctData.cost, total: ctTotal });

  const cabData = CABINETS[interior.cabinets];
  const cabLF = estimateCabinetLF(sqft);
  const cabTotal = cabLF * cabData.cost;
  lineItems.push({ category: 'Kitchen/Bath', item: `Cabinets: ${cabData.label}`, qty: Math.round(cabLF), unit: 'LF', unitCost: cabData.cost, total: cabTotal });

  const fixData = FIXTURES[interior.fixtures];
  const fullBaths = Math.floor(baths);
  const halfBaths = baths % 1 > 0 ? 1 : 0;
  const fixTotal = fullBaths * fixData.cost + halfBaths * (fixData.cost * 0.5);
  lineItems.push({ category: 'Plumbing', item: `Fixtures: ${fixData.label} (${fullBaths} full${halfBaths ? ' + 1 half' : ''} bath${fullBaths !== 1 ? 's' : ''})`, qty: baths, unit: 'baths', unitCost: fixData.cost, total: fixTotal });

  const hvacData = HVAC[features.hvac];
  if (hvacData.cost > 0) {
    const hvacTotal = sqft * hvacData.cost;
    lineItems.push({ category: 'Mechanical', item: `HVAC: ${hvacData.label}`, qty: sqft, unit: 'sqft', unitCost: hvacData.cost, total: hvacTotal });
  }

  const elecData = ELECTRICAL[features.electrical];
  const elecTotal = sqft * elecData.cost;
  lineItems.push({ category: 'Electrical', item: elecData.label, qty: sqft, unit: 'sqft', unitCost: elecData.cost, total: elecTotal });

  const plumbData = PLUMBING[features.plumbing];
  const plumbTotal = sqft * plumbData.cost;
  lineItems.push({ category: 'Plumbing', item: `Rough-In: ${plumbData.label}`, qty: sqft, unit: 'sqft', unitCost: plumbData.cost, total: plumbTotal });

  if (features.fireplace && features.fireplace !== 'none') {
    const key = features.fireplace === 'gas' ? 'fireplace_gas' : 'fireplace_wood';
    const addonData = ADDONS[key];
    lineItems.push({ category: 'Features', item: addonData.label, qty: 1, unit: 'ea', unitCost: addonData.cost, total: addonData.cost });
  }
  if (features.solar) {
    lineItems.push({ category: 'Features', item: ADDONS.solar_5kw.label, qty: 1, unit: 'ea', unitCost: ADDONS.solar_5kw.cost, total: ADDONS.solar_5kw.cost });
  }
  if (features.generator) {
    lineItems.push({ category: 'Features', item: ADDONS.generator.label, qty: 1, unit: 'ea', unitCost: ADDONS.generator.cost, total: ADDONS.generator.cost });
  }
  if (features.tanklessWater) {
    lineItems.push({ category: 'Plumbing', item: ADDONS.tankless_water.label, qty: 1, unit: 'ea', unitCost: ADDONS.tankless_water.cost, total: ADDONS.tankless_water.cost });
  }

  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const contingency = subtotal * 0.10;
  lineItems.push({ category: 'Contingency', item: 'Contingency / Allowance (10%)', qty: 1, unit: 'ea', unitCost: contingency, total: contingency });

  const grandTotal = subtotal + contingency;

  return {
    lineItems,
    subtotal,
    contingency,
    grandTotal,
    grandTotalLow: Math.round(grandTotal * 0.85),
    grandTotalHigh: Math.round(grandTotal * 1.15),
    costPerSqft: Math.round(grandTotal / sqft),
  };
}

export function generateBOM(config) {
  const { specs, structure, exterior, interior, features } = config;
  const sqft = specs.squareFootage;
  const baths = parseFloat(specs.bathrooms);
  const beds = parseInt(specs.bedrooms, 10);

  const items = [];

  if (config.buildingType === 'metal_building' || config.buildingType === 'barndominium' || structure.framing === 'steel') {
    const steelTons = Math.round((sqft * 3.5) / 2000 * 10) / 10;
    items.push({ category: 'Structure', material: 'Structural Steel (columns, beams, purlins)', qty: steelTons, unit: 'tons' });
    const steelPanels = Math.round(sqft * 1.05 / 25);
    items.push({ category: 'Structure', material: 'Metal Roof/Wall Panels (26ga)', qty: steelPanels, unit: 'panels' });
  }
  if (structure.framing === 'wood') {
    const lumber2x6 = Math.round(sqft * 1.1);
    const lumber2x4 = Math.round(sqft * 0.8);
    const lvl = Math.round(sqft / 100 * 2);
    items.push({ category: 'Framing', material: '2x6 Framing Lumber (walls)', qty: lumber2x6, unit: 'LF' });
    items.push({ category: 'Framing', material: '2x4 Interior Stud Walls', qty: lumber2x4, unit: 'LF' });
    items.push({ category: 'Framing', material: 'LVL Beams / Headers', qty: lvl, unit: 'ea' });
    const osb = Math.round(sqft * 2 / 32);
    items.push({ category: 'Sheathing', material: 'OSB Wall Sheathing (7/16")', qty: osb, unit: 'sheets' });
  }

  const concCY = Math.round(sqft * 0.012 * (structure.foundation === 'basement' ? 3 : 1) * 10) / 10;
  items.push({ category: 'Foundation', material: `Concrete (${FOUNDATION[structure.foundation].label})`, qty: concCY, unit: 'cubic yards' });
  const rebar = Math.round(sqft * 0.85);
  items.push({ category: 'Foundation', material: 'Rebar (#4, 12" OC)', qty: rebar, unit: 'LF' });

  const pitchMult = ROOF_PITCH[structure.roofPitch].multiplier;
  const roofArea = Math.round(sqft * pitchMult);
  const roofSquares = Math.round(roofArea / 100);
  items.push({ category: 'Roofing', material: `${ROOF_TYPES[exterior.roofType].label} Roofing`, qty: roofSquares, unit: 'squares (100 sqft)' });
  const ridgeCap = Math.round(Math.sqrt(sqft) * 1.1);
  items.push({ category: 'Roofing', material: 'Ridge Cap / Trim', qty: ridgeCap, unit: 'LF' });
  const eaveTrim = Math.round(Math.sqrt(sqft) * 4);
  items.push({ category: 'Roofing', material: 'Eave & Rake Trim', qty: eaveTrim, unit: 'LF' });
  if (exterior.roofType !== 'metal_standing_seam' && exterior.roofType !== 'metal_ribbed') {
    const deckingSheets = Math.round(roofArea / 32);
    items.push({ category: 'Roofing', material: 'Roof Decking (5/8" OSB)', qty: deckingSheets, unit: 'sheets' });
    items.push({ category: 'Roofing', material: 'Underlayment (30# felt)', qty: roofSquares, unit: 'squares' });
  }

  const insulArea = Math.round(sqft * 1.8);
  if (structure.insulation === 'fiberglass_batt') {
    const rolls = Math.round(insulArea / 40);
    items.push({ category: 'Insulation', material: 'R-38 Fiberglass Batt (ceiling)', qty: rolls, unit: 'rolls' });
    const wallRolls = Math.round(sqft * 0.6 / 40);
    items.push({ category: 'Insulation', material: 'R-21 Fiberglass Batt (walls)', qty: wallRolls, unit: 'rolls' });
  } else {
    items.push({ category: 'Insulation', material: `${INSULATION[structure.insulation].label} (walls + ceiling)`, qty: insulArea, unit: 'sqft' });
  }

  const wallArea = Math.round(sqft * 1.3);
  const sidingArea = Math.round(wallArea * 1.1);
  items.push({ category: 'Exterior', material: `${SIDING[exterior.siding].label}`, qty: sidingArea, unit: 'sqft' });

  const winCount = estimateWindowCount(beds, sqft);
  items.push({ category: 'Windows & Doors', material: `${WINDOWS[exterior.windows].label}`, qty: winCount, unit: 'windows' });
  const doorCount = exterior.doorCount || 2;
  items.push({ category: 'Windows & Doors', material: `${DOORS[exterior.doors].label}`, qty: doorCount, unit: 'doors' });

  const floorWithWaste = Math.round(sqft * 1.1);
  items.push({ category: 'Flooring', material: `${FLOORING[interior.flooring].label}`, qty: floorWithWaste, unit: 'sqft (+10% waste)' });

  const drywallSheets = Math.round((sqft * 1.2 + sqft * 0.5) / 32);
  if (interior.wallFinish === 'drywall') {
    items.push({ category: 'Interior', material: 'Drywall (1/2")', qty: drywallSheets, unit: 'sheets' });
    items.push({ category: 'Interior', material: 'Joint Compound / Tape / Texture', qty: Math.round(drywallSheets / 5), unit: 'buckets' });
  } else {
    const wallLF = Math.round(sqft * 1.2);
    items.push({ category: 'Interior', material: WALL_FINISH[interior.wallFinish].label, qty: wallLF, unit: 'sqft' });
  }
  const paint = Math.round(sqft * 1.2 / 350);
  items.push({ category: 'Interior', material: 'Interior Paint (2 coats)', qty: paint, unit: 'gallons' });

  const ctLF = estimateCounterLF(sqft);
  items.push({ category: 'Kitchen/Bath', material: `${COUNTERTOPS[interior.countertops].label} Countertops`, qty: ctLF, unit: 'LF' });
  const cabLF = Math.round(estimateCabinetLF(sqft));
  items.push({ category: 'Kitchen/Bath', material: `${CABINETS[interior.cabinets].label}`, qty: cabLF, unit: 'LF' });
  const fullBaths = Math.floor(baths);
  const halfBaths = baths % 1 > 0 ? 1 : 0;
  if (fullBaths > 0) items.push({ category: 'Plumbing', material: 'Full Bath Fixture Set (toilet, vanity, tub/shower)', qty: fullBaths, unit: 'sets' });
  if (halfBaths > 0) items.push({ category: 'Plumbing', material: 'Half Bath Fixture Set (toilet, vanity)', qty: halfBaths, unit: 'sets' });
  items.push({ category: 'Plumbing', material: 'PEX Supply Lines', qty: Math.round(sqft * 0.8), unit: 'LF' });
  items.push({ category: 'Plumbing', material: 'ABS/PVC Drain Lines', qty: Math.round(sqft * 0.5), unit: 'LF' });

  const circuits = Math.round(sqft / 80) + beds + fullBaths;
  items.push({ category: 'Electrical', material: 'Electrical Panel (breakers)', qty: Math.max(20, circuits), unit: 'circuits' });
  items.push({ category: 'Electrical', material: '12/2 Romex Wire', qty: Math.round(sqft * 3), unit: 'LF' });
  items.push({ category: 'Electrical', material: 'Outlets / Switches', qty: Math.round(sqft / 40), unit: 'ea' });
  items.push({ category: 'Electrical', material: 'Lighting Fixtures', qty: Math.round(sqft / 80 + beds + 2), unit: 'ea' });

  if (features.hvac !== 'none') {
    const tons = Math.ceil(sqft / 600);
    items.push({ category: 'HVAC', material: `${HVAC[features.hvac].label} Unit`, qty: features.hvac === 'mini_split' ? Math.ceil(sqft / 1000) : 1, unit: features.hvac === 'mini_split' ? 'zones' : `${tons}-ton unit` });
    if (features.hvac === 'central') {
      items.push({ category: 'HVAC', material: 'Sheet Metal Ductwork', qty: Math.round(sqft * 0.6), unit: 'LF' });
    }
  }

  if (features.fireplace && features.fireplace !== 'none') {
    items.push({ category: 'Features', material: `${features.fireplace === 'gas' ? 'Gas' : 'Wood-Burning'} Fireplace`, qty: 1, unit: 'ea' });
  }
  if (features.solar) {
    items.push({ category: 'Features', material: 'Solar Panels (5kW system)', qty: 14, unit: 'panels (400W)' });
    items.push({ category: 'Features', material: 'Solar Inverter', qty: 1, unit: 'ea' });
  }
  if (features.generator) {
    items.push({ category: 'Features', material: 'Standby Generator (20kW)', qty: 1, unit: 'ea' });
    items.push({ category: 'Features', material: 'Transfer Switch (200A)', qty: 1, unit: 'ea' });
  }

  return items;
}
