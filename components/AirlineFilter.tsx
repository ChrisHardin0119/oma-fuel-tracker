'use client';

import { AirlineCode } from '@/lib/types';
import { AIRLINE_INFO, TARGET_AIRLINES, ThemeColors } from '@/lib/utils';

interface AirlineFilterProps {
  activeFilters: AirlineCode[];
  onToggle: (airline: AirlineCode) => void;
  themeColors: ThemeColors;
}

export default function AirlineFilter({ activeFilters, onToggle, themeColors }: AirlineFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 mt-2 w-full">
      {TARGET_AIRLINES.map((code) => {
        const info = AIRLINE_INFO[code];
        const isActive = activeFilters.includes(code);
        return (
          <button
            key={code}
            onClick={() => onToggle(code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border"
            style={isActive
              ? { backgroundColor: info.color, borderColor: info.color, color: '#ffffff' }
              : { backgroundColor: themeColors.filterInactiveBg, borderColor: themeColors.filterInactiveBorder, color: themeColors.filterInactiveText, opacity: 0.6 }
            }
          >
            <span>{info.emoji}</span>
            <span>{info.name}</span>
          </button>
        );
      })}
    </div>
  );
}
