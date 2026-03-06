'use client';

import { ThemeColors } from '@/lib/utils';

interface TabToggleProps {
  activeTab: 'arrivals' | 'departures';
  onTabChange: (tab: 'arrivals' | 'departures') => void;
  arrivalCount: number;
  departureCount: number;
  hideArrived: boolean;
  onToggleHideArrived: () => void;
  themeColors: ThemeColors;
}

export default function TabToggle({
  activeTab, onTabChange, arrivalCount, departureCount,
  hideArrived, onToggleHideArrived, themeColors,
}: TabToggleProps) {
  return (
    <div className="px-4 mt-3 w-full">
      <div className="flex rounded-lg p-1" style={{ backgroundColor: themeColors.tabBg }}>
        <button
          onClick={() => onTabChange('arrivals')}
          className="flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeTab === 'arrivals' ? themeColors.tabActive : 'transparent',
            color: activeTab === 'arrivals' ? themeColors.tabActiveText : themeColors.tabText,
            boxShadow: activeTab === 'arrivals' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          ARRIVALS
          <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: activeTab === 'arrivals' ? themeColors.badgeBg : themeColors.cardBorder,
              color: activeTab === 'arrivals' ? themeColors.badgeText : themeColors.tabText,
            }}
          >{arrivalCount}</span>
        </button>
        <button
          onClick={() => onTabChange('departures')}
          className="flex-1 py-2.5 px-3 rounded-md text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeTab === 'departures' ? themeColors.tabActive : 'transparent',
            color: activeTab === 'departures' ? themeColors.tabActiveText : themeColors.tabText,
            boxShadow: activeTab === 'departures' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          DEPARTURES
          <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs"
            style={{
              backgroundColor: activeTab === 'departures' ? themeColors.badgeBg : themeColors.cardBorder,
              color: activeTab === 'departures' ? themeColors.badgeText : themeColors.tabText,
            }}
          >{departureCount}</span>
        </button>
      </div>

      {/* Hide arrived toggle */}
      <button onClick={onToggleHideArrived} className="mt-2 flex items-center gap-2 text-xs w-full justify-end px-1" style={{ color: themeColors.cardSubtext }}>
        <span className="w-4 h-4 rounded border flex items-center justify-center text-[10px]"
          style={{
            borderColor: hideArrived ? themeColors.accent : themeColors.cardBorder,
            backgroundColor: hideArrived ? themeColors.accent : 'transparent',
            color: hideArrived ? '#fff' : 'transparent',
          }}
        >✓</span>
        Hide arrived flights
      </button>
    </div>
  );
}
