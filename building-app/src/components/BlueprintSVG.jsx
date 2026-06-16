import { useMemo } from 'react';
import { FOUNDATION, INSULATION, ROOF_PITCH, ROOF_TYPES, SIDING, WINDOWS, FLOORING, WALL_FINISH, COUNTERTOPS, CABINETS, HVAC } from '../data/materials.js';

export default function BlueprintSVG({ config, printMode = false }) {
  const { specs, exterior } = config;
  const beds = parseInt(specs.bedrooms, 10) || 0;
  const baths = parseFloat(specs.bathrooms) || 1;
  const sqft = specs.squareFootage || 1500;
  const hasGarage = specs.garageType && specs.garageType !== 'none';
  const hasPorch = specs.porchType && specs.porchType !== 'none';
  const stories = parseInt(specs.stories, 10) || 1;

  const plan = useMemo(() => buildFloorPlan({ beds, baths, sqft, hasGarage, hasPorch, specs }), [beds, baths, sqft, hasGarage, hasPorch, specs]);

  const bg = printMode ? '#fff' : '#0d1b2a';
  const stroke = printMode ? '#1a3a6e' : '#4a9eff';
  const labelFill = printMode ? '#1a3a6e' : '#7bc4ff';
  const roomFill = printMode ? 'rgba(30,70,140,0.08)' : 'rgba(74,158,255,0.07)';
  const dimFill = printMode ? '#999' : '#456';
  const gridStroke = printMode ? 'rgba(30,70,140,0.12)' : 'rgba(74,158,255,0.08)';

  return (
    <svg
      viewBox={`0 0 ${plan.width} ${plan.height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxHeight: printMode ? 'none' : '520px', background: bg, borderRadius: printMode ? 0 : 8 }}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d={`M 20 0 L 0 0 0 20`} fill="none" stroke={gridStroke} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={plan.width} height={plan.height} fill={bg} />
      <rect width={plan.width} height={plan.height} fill="url(#grid)" />

      <text x={plan.width / 2} y="28" textAnchor="middle" fontSize="11" fill={labelFill} fontFamily="monospace" fontWeight="bold" letterSpacing="2">
        FLOOR PLAN — LEVEL 1
      </text>
      <text x={plan.width / 2} y="42" textAnchor="middle" fontSize="9" fill={dimFill} fontFamily="monospace">
        {sqft.toLocaleString()} sq ft  ·  {beds} bed / {baths} bath  ·  {config.buildingType?.replace(/_/g, ' ').toUpperCase()}
      </text>
      <line x1="20" y1="50" x2={plan.width - 20} y2="50" stroke={stroke} strokeWidth="0.5" strokeDasharray="4 3" />

      {plan.rooms.map((room, i) => (
        <g key={i}>
          <rect
            x={room.x} y={room.y} width={room.w} height={room.h}
            fill={roomFill} stroke={stroke}
            strokeWidth={room.isExterior ? 2 : 1}
            rx="1"
          />
          <text
            x={room.x + room.w / 2}
            y={room.y + room.h / 2 - (room.dims ? 6 : 0)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={room.w < 60 || room.h < 45 ? 7 : 9}
            fill={labelFill} fontFamily="monospace" fontWeight="bold"
          >
            {room.label}
          </text>
          {room.dims && (
            <text
              x={room.x + room.w / 2}
              y={room.y + room.h / 2 + 8}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7" fill={dimFill} fontFamily="monospace"
            >
              {room.dims}
            </text>
          )}
          {room.door && (
            <path
              d={`M ${room.door.x} ${room.door.y} a 14 14 0 0 1 ${room.door.dx} ${room.door.dy}`}
              fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="2 1"
            />
          )}
        </g>
      ))}

      {plan.dims.map((d, i) => (
        <g key={i}>
          <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={dimFill} strokeWidth="0.8" />
          <text x={d.tx} y={d.ty} textAnchor="middle" fontSize="8" fill={dimFill} fontFamily="monospace">{d.label}</text>
        </g>
      ))}

      <g transform={`translate(${plan.width - 30}, ${plan.height - 30})`}>
        <circle cx="0" cy="0" r="12" fill="none" stroke={stroke} strokeWidth="0.8" />
        <polygon points="0,-10 -4,2 0,0 4,2" fill={stroke} />
        <text x="0" y="-13" textAnchor="middle" fontSize="8" fill={labelFill} fontFamily="monospace" fontWeight="bold">N</text>
      </g>

      <g transform={`translate(20, ${plan.height - 18})`}>
        <line x1="0" y1="0" x2="60" y2="0" stroke={dimFill} strokeWidth="1" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={dimFill} strokeWidth="1" />
        <line x1="30" y1="-4" x2="30" y2="4" stroke={dimFill} strokeWidth="1" />
        <line x1="60" y1="-4" x2="60" y2="4" stroke={dimFill} strokeWidth="1" />
        <text x="0" y="-7" fontSize="6" fill={dimFill} fontFamily="monospace">0</text>
        <text x="25" y="-7" fontSize="6" fill={dimFill} fontFamily="monospace">10'</text>
        <text x="54" y="-7" fontSize="6" fill={dimFill} fontFamily="monospace">20'</text>
      </g>

      <text x="20" y={plan.height - 6} fontSize="6" fill={dimFill} fontFamily="monospace">
        Scale: 1" = 10'  |  Not for construction
      </text>
    </svg>
  );
}

function buildFloorPlan({ beds, baths, sqft, hasGarage, hasPorch, specs }) {
  const aspect = beds <= 2 ? 1.4 : beds <= 4 ? 1.6 : 1.8;
  const footprintWidth = Math.round(Math.sqrt(sqft * aspect));
  const footprintDepth = Math.round(sqft / footprintWidth);

  const MARGIN = 60;
  const SCALE = Math.min(3.0, Math.max(1.2, 500 / Math.max(footprintWidth, footprintDepth)));
  const pxW = Math.round(footprintWidth * SCALE);
  const pxD = Math.round(footprintDepth * SCALE);

  const garageW = hasGarage ? (specs.garageType === '3car' ? 240 : specs.garageType === '1car' ? 120 : 180) : 0;
  const garageH = hasGarage ? 120 : 0;
  const porchH = hasPorch ? 50 : 0;

  const svgW = pxW + MARGIN * 2 + (hasGarage && specs.garageType === 'detached' ? 0 : Math.round(garageW * SCALE / footprintWidth * pxW * 0.5));
  const svgH = pxD + MARGIN * 2 + porchH + (hasGarage && specs.garageType !== 'detached' ? garageH : 0);

  const startX = MARGIN;
  const startY = MARGIN + 10 + porchH;

  const rooms = [];

  rooms.push({ x: startX, y: startY, w: pxW, h: pxD, label: '', isExterior: true });

  if (hasPorch) {
    const pw = specs.porchType === 'wrap' ? pxW : Math.round(pxW * 0.55);
    const px = startX + (pxW - pw) / 2;
    rooms.push({ x: px, y: startY - porchH, w: pw, h: porchH - 2, label: 'PORCH', isExterior: false });
  }

  if (hasGarage && specs.garageType !== 'detached') {
    const gw = Math.round(garageW * SCALE / 10);
    const gh = Math.round(garageH * SCALE / 10) + 20;
    rooms.push({ x: startX + pxW, y: startY, w: gw, h: gh, label: 'GARAGE', dims: specs.garageType === '1car' ? '12x20' : specs.garageType === '3car' ? '32x24' : '22x24', isExterior: true });
  }

  const layout = generateRoomLayout(beds, baths, sqft, pxW, pxD, startX, startY);
  rooms.push(...layout);

  const dims = [
    {
      x1: startX, y1: startY - 20,
      x2: startX + pxW, y2: startY - 20,
      tx: startX + pxW / 2, ty: startY - 26,
      label: `${footprintWidth}'`,
    },
    {
      x1: startX - 20, y1: startY,
      x2: startX - 20, y2: startY + pxD,
      tx: startX - 34, ty: startY + pxD / 2,
      label: `${footprintDepth}'`,
    },
  ];

  return { rooms, dims, width: svgW, height: svgH + 30 };
}

function generateRoomLayout(beds, baths, sqft, pxW, pxD, startX, startY) {
  const rooms = [];
  const pad = 1;

  const livingRatio = 0.30;
  const kitchenRatio = 0.15;
  const diningRatio = 0.10;

  const leftColW = Math.round(pxW * 0.55);
  const rightColW = pxW - leftColW - pad;

  const livingH = Math.round(pxD * (livingRatio + diningRatio));
  const kitchenH = Math.round(pxD * (kitchenRatio + 0.05));
  const laundryH = Math.round(pxD * 0.10);
  const leftRemainder = pxD - livingH - kitchenH - laundryH - pad * 2;

  rooms.push({
    x: startX + pad, y: startY + pad,
    w: leftColW - pad, h: livingH,
    label: 'LIVING ROOM',
    dims: `${Math.round(leftColW / 3.0 * 1.0)}'x${Math.round(livingH / 3.0 * 1.0)}'`,
    isExterior: false,
  });

  rooms.push({
    x: startX + pad, y: startY + pad + livingH,
    w: leftColW - pad, h: kitchenH,
    label: 'KITCHEN', dims: '',
    isExterior: false,
  });

  const utilW = Math.round(leftColW * 0.45);
  rooms.push({
    x: startX + pad, y: startY + pad + livingH + kitchenH,
    w: utilW, h: laundryH,
    label: 'LAUNDRY', isExterior: false,
  });

  rooms.push({
    x: startX + pad + utilW, y: startY + pad + livingH + kitchenH,
    w: leftColW - pad - utilW, h: laundryH,
    label: 'DINING', isExterior: false,
  });

  if (leftRemainder > 25) {
    rooms.push({
      x: startX + pad, y: startY + pad + livingH + kitchenH + laundryH,
      w: leftColW - pad, h: leftRemainder,
      label: beds > 3 ? 'OFFICE' : 'FLEX', isExterior: false,
    });
  }

  const rightX = startX + leftColW + pad;
  const totalBaths = Math.ceil(parseFloat(baths));
  const roomCount = beds + totalBaths;
  const roomH = Math.floor(pxD / roomCount);

  let y = startY + pad;
  for (let i = 0; i < beds; i++) {
    const isMain = i === 0;
    const h = isMain ? Math.round(roomH * 1.3) : roomH;
    rooms.push({
      x: rightX, y,
      w: rightColW, h: Math.min(h, pxD - (y - startY) - pad),
      label: isMain ? 'PRIMARY BED' : `BED ${i + 1}`,
      dims: isMain ? `${Math.round(rightColW / 3)}'x${Math.round(h / 3)}'` : '',
      isExterior: false,
      door: { x: rightX + 14, y: y + (isMain ? h : roomH), dx: -14, dy: -14 },
    });
    y += Math.min(h, pxD - (y - startY) - pad) + pad;
  }

  const bathH = Math.max(30, Math.floor((startY + pxD - y - pad) / totalBaths));
  for (let i = 0; i < totalBaths; i++) {
    const remaining = startY + pxD - y - pad;
    const h = i === totalBaths - 1 ? remaining : bathH;
    if (h > 10) {
      rooms.push({
        x: rightX, y,
        w: rightColW, h,
        label: i === 0 ? 'MASTER BATH' : `BATH ${i + 1}`,
        isExterior: false,
      });
      y += h + pad;
    }
  }

  return rooms;
}
