'use client';

/**
 * Map Renderer
 *
 * A pragmatic map canvas for social studies / geography teaching. Not a real
 * GIS engine — it's an SVG canvas with a small library of hand-drawn region
 * outlines (world, continents, major countries) and pins / labeled areas
 * placed in a normalized [0, 100] coordinate system.
 *
 * For specific detailed maps (e.g. "a map showing the Silk Road"), the tutor
 * should prefer show_image with a Wikimedia URL. This renderer is for quick
 * schematic maps — "Athens vs Sparta", "the Mississippi river", "the Fertile
 * Crescent" — where the pin locations matter more than cartographic accuracy.
 */

import React from 'react';

export interface MapPin {
  x: number; // 0–100 (left → right)
  y: number; // 0–100 (top → bottom)
  label: string;
  color?: string;
}

export interface MapRegion {
  /** SVG path data in the 0–100 coordinate system, or a list of polygon points "x,y x,y x,y". */
  points?: string;
  path?: string;
  label?: string;
  color?: string; // Fill color (will be rendered at low opacity).
}

export interface MapRendererProps {
  title?: string;
  /** Preset background region. If provided, a hand-drawn outline is shown. */
  background?:
    | 'blank'
    | 'world'
    | 'north-america'
    | 'south-america'
    | 'europe'
    | 'asia'
    | 'africa'
    | 'australia'
    | 'usa'
    | 'india'
    | 'china'
    | 'middle-east'
    | 'mediterranean';
  pins?: MapPin[];
  regions?: MapRegion[];
  /** Optional caption under the map. */
  caption?: string;
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

/**
 * Transform normalized (0–100) coords to SVG pixel coords.
 * Slight inset so pins near the edge aren't clipped.
 */
function normToSvg(x: number, y: number): [number, number] {
  const inset = 10;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

/**
 * Hand-drawn region outlines. These are deliberately simple — their purpose
 * is to give the student a recognizable "this is Europe" / "this is the
 * Mediterranean" backdrop, not to be surveyor-accurate. Paths are in the
 * raw SVG coordinate system (0–600 x, 0–400 y).
 */
const BACKGROUND_PATHS: Record<string, string> = {
  // Very schematic world: North America, South America, Europe, Africa, Asia, Australia blobs.
  world:
    'M 60,110 Q 110,80 170,100 T 240,150 Q 230,200 180,220 T 110,210 Q 70,190 60,150 Z ' +
    'M 180,230 Q 210,250 220,300 T 200,360 Q 170,370 160,340 T 170,280 Z ' +
    'M 280,100 Q 320,85 360,110 Q 380,140 360,170 Q 320,180 290,160 Z ' +
    'M 290,180 Q 330,200 340,250 T 310,330 Q 280,340 270,300 T 280,220 Z ' +
    'M 380,100 Q 470,80 540,110 Q 570,150 540,200 Q 470,220 400,200 Q 380,160 380,100 Z ' +
    'M 490,250 Q 520,245 540,265 T 535,290 Q 510,295 495,280 Z',
  'north-america':
    'M 100,80 Q 200,60 320,90 Q 410,100 470,150 Q 500,210 460,270 Q 410,320 340,340 Q 250,360 190,320 Q 130,280 100,220 Q 80,150 100,80 Z',
  'south-america':
    'M 240,60 Q 330,50 400,100 Q 430,180 400,260 Q 340,340 280,360 Q 220,330 210,260 Q 200,160 240,60 Z',
  europe:
    'M 120,80 Q 220,60 320,90 Q 380,110 460,110 Q 500,150 470,200 Q 400,240 340,250 Q 240,270 160,240 Q 90,210 100,150 Q 90,110 120,80 Z',
  asia:
    'M 80,100 Q 200,70 360,90 Q 480,110 540,160 Q 560,220 510,270 Q 420,310 330,310 Q 230,320 140,280 Q 60,240 60,180 Q 50,130 80,100 Z',
  africa:
    'M 160,70 Q 280,60 380,100 Q 410,170 380,250 Q 340,330 280,360 Q 220,370 180,320 Q 140,260 140,180 Q 140,110 160,70 Z',
  australia:
    'M 120,140 Q 240,120 380,140 Q 470,170 480,230 Q 440,290 350,300 Q 230,310 140,280 Q 80,240 90,190 Q 100,150 120,140 Z',
  usa:
    'M 80,120 Q 180,100 300,110 Q 420,110 520,130 Q 540,200 510,260 Q 430,290 330,290 Q 210,290 130,260 Q 70,220 80,170 Q 70,140 80,120 Z',
  india:
    'M 220,80 Q 310,70 380,100 Q 410,150 400,220 Q 360,310 310,350 Q 260,330 240,260 Q 220,180 220,80 Z',
  china:
    'M 120,100 Q 240,80 380,100 Q 480,120 520,160 Q 530,220 470,260 Q 380,290 270,290 Q 170,280 110,250 Q 70,200 100,150 Q 110,120 120,100 Z',
  'middle-east':
    'M 120,100 Q 220,80 340,100 Q 440,120 480,170 Q 490,240 430,290 Q 330,320 240,310 Q 170,290 130,250 Q 90,200 110,150 Q 110,120 120,100 Z',
  mediterranean:
    'M 60,140 Q 160,110 260,130 Q 380,120 500,140 Q 540,170 520,200 Q 400,230 280,220 Q 170,220 90,200 Q 50,180 60,140 Z',
};

export default function MapRenderer({
  title,
  background = 'blank',
  pins = [],
  regions = [],
  caption,
}: MapRendererProps) {
  const bgPath = BACKGROUND_PATHS[background];

  return (
    <div className="map-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#eff6ff" rx={4} />

        {/* Background region outline */}
        {bgPath && (
          <path
            d={bgPath}
            fill="#cbd5e1"
            fillOpacity={0.5}
            stroke="#64748b"
            strokeWidth={1.5}
          />
        )}

        {/* Regions: labeled highlighted areas */}
        {regions.map((region, i) => {
          const color = region.color || '#fbbf24';
          if (region.path) {
            return (
              <g key={`region-${i}`}>
                <path
                  d={region.path}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={1.5}
                />
              </g>
            );
          }
          if (region.points) {
            // Convert normalized "x,y x,y" list to SVG coords
            const svgPts = region.points
              .trim()
              .split(/\s+/)
              .map((pt) => {
                const [nx, ny] = pt.split(',').map(Number);
                const [sx, sy] = normToSvg(nx, ny);
                return `${sx},${sy}`;
              })
              .join(' ');
            return (
              <g key={`region-${i}`}>
                <polygon
                  points={svgPts}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={1.5}
                />
                {region.label && (() => {
                  // Centroid for label
                  const coords = region.points!.trim().split(/\s+/).map((pt) => pt.split(',').map(Number));
                  const cx = coords.reduce((s, [x]) => s + x, 0) / coords.length;
                  const cy = coords.reduce((s, [, y]) => s + y, 0) / coords.length;
                  const [lx, ly] = normToSvg(cx, cy);
                  return (
                    <text x={lx} y={ly} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1f2937">
                      {region.label}
                    </text>
                  );
                })()}
              </g>
            );
          }
          return null;
        })}

        {/* Pins */}
        {pins.map((pin, i) => {
          const [px, py] = normToSvg(pin.x, pin.y);
          const color = pin.color || '#dc2626';
          return (
            <g key={`pin-${i}`}>
              {/* Pin shape: circle with small triangle tail */}
              <circle cx={px} cy={py} r={6} fill={color} stroke="#fff" strokeWidth={2} />
              <text
                x={px + 10}
                y={py + 4}
                fontSize={12}
                fontWeight={600}
                fill="#1f2937"
              >
                {pin.label}
              </text>
            </g>
          );
        })}
      </svg>

      {caption && (
        <div className="text-center text-xs text-gray-500 mt-1 italic">
          {caption}
        </div>
      )}
    </div>
  );
}
