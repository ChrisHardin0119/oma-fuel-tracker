'use client';

import { AirlineCode, Flight } from '@/lib/types';
import { AIRLINE_INFO, TARGET_AIRLINES } from '@/lib/utils';

interface AirlineFilterProps {
  activeFilters: AirlineCode[];
  onToggle: (airline: AirlineCode) => void;
}

export default function AirlineFilter({ activeFilters, onToggle }: AirlineFilterProps) {
  return (
    <div className="flex gap-2 px-4 mt-2 max-w-lg mx-auto overflow-x-auto">
      {TARGET_AIRLINES.map((code) => {
        const info = AIRLINE_INFO[code];
        const isActive = activeFilters.includes(code);
        return (
          <button
            key={code}
            onClick={() => onToggle(code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'text-white shadow-sm'
                : 'bg-white text-gray-400 border-gray-200 opacity-60'
            }`}
            style={isActive ? { backgroundColor: info.color, borderColor: info.color } : {}}
          >
            <span>{info.emoji}</span>
            <span>{info.name}</span>
          </button>
        );
      })}
    </div>
  );
}
