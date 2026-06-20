import React from 'react';

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
  dashed?: boolean;
}

interface ChartLegendProps {
  items: LegendItem[];
  ariaLabel: string;
}

export default function ChartLegend({ items, ariaLabel }: ChartLegendProps) {
  return (
    <ul 
      className="flex flex-wrap items-center gap-4 text-xs font-manrope"
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item, idx) => (
        <li 
          key={idx}
          className="flex items-center gap-2 text-[#3a302a]/80 font-medium"
        >
          {/* Diagnostic Visual Swatch */}
          <span 
            className={`w-3 h-3 rounded-full shrink-0 ${
              item.dashed ? 'border-2 border-dashed' : ''
            }`}
            style={{ 
              backgroundColor: item.dashed ? 'transparent' : item.color,
              borderColor: item.color
            }}
            aria-hidden="true"
          />
          <span>
            {item.label}
            {item.value && <span className="font-mono ml-1 font-semibold text-[#8c3c3c]">({item.value})</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
