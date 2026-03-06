'use client';

interface TabToggleProps {
  activeTab: 'arrivals' | 'departures';
  onTabChange: (tab: 'arrivals' | 'departures') => void;
  arrivalCount: number;
  departureCount: number;
}

export default function TabToggle({ activeTab, onTabChange, arrivalCount, departureCount }: TabToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mx-4 mt-3 max-w-lg self-center w-full">
      <button
        onClick={() => onTabChange('arrivals')}
        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
          activeTab === 'arrivals'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        ARRIVALS
        <span className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs ${
          activeTab === 'arrivals' ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {arrivalCount}
        </span>
      </button>
      <button
        onClick={() => onTabChange('departures')}
        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
          activeTab === 'departures'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        DEPARTURES
        <span className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs ${
          activeTab === 'departures' ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {departureCount}
        </span>
      </button>
    </div>
  );
}
