'use client';

import { formatLastUpdated } from '@/lib/utils';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
  notifPermission: string;
  onEnableNotifications: () => void;
}

export default function Header({ lastUpdated, onRefresh, isLoading, notifPermission, onEnableNotifications }: HeaderProps) {
  return (
    <header className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <h1 className="text-xl font-bold tracking-wide">OMA FUEL TRACKER</h1>
          <p className="text-xs text-gray-400">
            {lastUpdated ? `Updated ${formatLastUpdated(lastUpdated)}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {/* Notification bell */}
          {notifPermission !== 'unsupported' && (
            <button
              onClick={onEnableNotifications}
              className={`p-2 rounded-full transition-colors ${
                notifPermission === 'granted'
                  ? 'text-green-400 hover:bg-gray-700'
                  : notifPermission === 'denied'
                  ? 'text-red-400 hover:bg-gray-700'
                  : 'text-yellow-400 hover:bg-gray-700 animate-pulse'
              }`}
              aria-label={
                notifPermission === 'granted'
                  ? 'Notifications enabled'
                  : 'Enable notifications'
              }
              title={
                notifPermission === 'granted'
                  ? 'Notifications ON'
                  : notifPermission === 'denied'
                  ? 'Notifications blocked'
                  : 'Tap to enable landing alerts'
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          )}

          {/* Refresh button */}
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
      </div>
    </header>
  );
}
