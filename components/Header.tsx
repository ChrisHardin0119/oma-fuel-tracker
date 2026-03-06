'use client';

import { formatLastUpdated, ThemeColors } from '@/lib/utils';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
  notifPermission: string;
  onEnableNotifications: () => void;
  onOpenSettings: () => void;
  themeColors: ThemeColors;
}

export default function Header({
  lastUpdated, onRefresh, isLoading, notifPermission,
  onEnableNotifications, onOpenSettings, themeColors,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 shadow-lg px-4 py-3" style={{ backgroundColor: themeColors.headerBg, color: themeColors.headerText }}>
      <div className="flex items-center justify-between w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-wide truncate">OMA FUEL TRACKER</h1>
          <p className="text-xs opacity-60">
            {lastUpdated ? `Updated ${formatLastUpdated(lastUpdated)}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Settings gear */}
          <button onClick={onOpenSettings} className="p-2 rounded-full transition-colors hover:bg-white/10" aria-label="Settings" title="Settings">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Notification bell */}
          {notifPermission !== 'unsupported' && (
            <button
              onClick={onEnableNotifications}
              className={`p-2 rounded-full transition-colors hover:bg-white/10 ${notifPermission === 'default' ? 'animate-pulse' : ''}`}
              style={{ color: notifPermission === 'granted' ? '#4ade80' : notifPermission === 'denied' ? '#f87171' : '#facc15' }}
              aria-label={notifPermission === 'granted' ? 'Notifications enabled' : 'Enable notifications'}
              title={notifPermission === 'granted' ? 'Notifications ON' : notifPermission === 'denied' ? 'Notifications blocked' : 'Tap to enable landing alerts'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          )}

          {/* Refresh button */}
          <button onClick={onRefresh} disabled={isLoading} className="p-2 rounded-full transition-colors hover:bg-white/10 disabled:opacity-50" aria-label="Refresh flights">
            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
