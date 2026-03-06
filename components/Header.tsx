'use client';

import { formatLastUpdated } from '@/lib/utils';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Header({ lastUpdated, onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-wide">OMA FUEL TRACKER</h1>
          <p className="text-xs text-gray-400">
            {lastUpdated ? `Updated ${formatLastUpdated(lastUpdated)}` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
          aria-label="Refresh flights"
        >
          <svg
            className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
