'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FlightsData, Flight, AirlineCode, ThemeName, NotifSchedule } from '@/lib/types';
import {
  TARGET_AIRLINES, THEMES, ApiOverride,
  loadTheme, saveTheme,
  loadNotifSchedule, saveNotifSchedule,
  loadHideArrived, saveHideArrived,
  loadApiSchedule, saveApiSchedule,
  loadApiOverride, saveApiOverride,
  shouldFetchApi,
} from '@/lib/utils';
import {
  registerServiceWorker, requestNotificationPermission,
  getNotificationPermission, checkForStatusChanges,
} from '@/lib/notifications';
import Header from '@/components/Header';
import TabToggle from '@/components/TabToggle';
import AirlineFilter from '@/components/AirlineFilter';
import FlightList from '@/components/FlightList';
import SettingsModal from '@/components/SettingsModal';

const REFRESH_INTERVAL = 60 * 1000;

export default function Home() {
  const [data, setData] = useState<FlightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures'>('arrivals');
  const [activeFilters, setActiveFilters] = useState<AirlineCode[]>([...TARGET_AIRLINES]);
  const [error, setError] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [notifSchedule, setNotifSchedule] = useState<NotifSchedule>({
    enabled: true, days: [false, true, true, true, true, true, false],
    startHour: 5, startMinute: 0, endHour: 23, endMinute: 0, repeat: true,
  });
  const [apiSchedule, setApiSchedule] = useState<NotifSchedule>({
    enabled: true, days: [false, false, true, false, false, true, true],
    startHour: 14, startMinute: 0, endHour: 22, endMinute: 0, repeat: true,
  });
  const [apiOverride, setApiOverride] = useState<ApiOverride>('auto');
  const [isApiActive, setIsApiActive] = useState(false);
  const [hideArrived, setHideArrived] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const previousFlightsRef = useRef<Flight[]>([]);

  const themeColors = THEMES[theme];

  // Load persisted settings on mount
  useEffect(() => {
    setTheme(loadTheme());
    setNotifSchedule(loadNotifSchedule());
    setApiSchedule(loadApiSchedule());
    setApiOverride(loadApiOverride());
    setHideArrived(loadHideArrived());
    registerServiceWorker();
    setNotifPermission(getNotificationPermission());
  }, []);

  const handleThemeChange = (t: ThemeName) => { setTheme(t); saveTheme(t); };
  const handleNotifScheduleChange = (s: NotifSchedule) => { setNotifSchedule(s); saveNotifSchedule(s); };
  const handleApiScheduleChange = (s: NotifSchedule) => { setApiSchedule(s); saveApiSchedule(s); };
  const handleApiOverrideChange = (o: ApiOverride) => { setApiOverride(o); saveApiOverride(o); };
  const handleToggleHideArrived = () => {
    setHideArrived(prev => { saveHideArrived(!prev); return !prev; });
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flights');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: FlightsData = await response.json();
      if (previousFlightsRef.current.length > 0 && result.arrivals) {
        checkForStatusChanges(previousFlightsRef.current, result.arrivals);
      }
      if (result.arrivals) previousFlightsRef.current = [...result.arrivals];
      setData(result);
      setError(result.error || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh — only fetches when schedule/override allows
  useEffect(() => {
    // Always do initial fetch
    fetchData();

    const interval = setInterval(() => {
      const active = shouldFetchApi(apiSchedule, apiOverride);
      setIsApiActive(active);
      if (active) {
        fetchData();
      }
    }, REFRESH_INTERVAL);

    // Also update the active indicator immediately
    setIsApiActive(shouldFetchApi(apiSchedule, apiOverride));

    return () => clearInterval(interval);
  }, [fetchData, apiSchedule, apiOverride]);

  // Manual refresh always works
  const handleManualRefresh = () => {
    fetchData();
  };

  const toggleFilter = (airline: AirlineCode) => {
    setActiveFilters(prev => {
      if (prev.includes(airline)) {
        if (prev.length === 1) return prev;
        return prev.filter(a => a !== airline);
      }
      return [...prev, airline];
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
  };

  const flights = activeTab === 'arrivals' ? data?.arrivals || [] : data?.departures || [];
  const arrivalCount = data?.arrivals?.filter(f => activeFilters.includes(f.airline)).length || 0;
  const departureCount = data?.departures?.filter(f => activeFilters.includes(f.airline)).length || 0;

  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: themeColors.bodyBg }}>
      <Header
        lastUpdated={data?.lastUpdated || ''}
        onRefresh={handleManualRefresh}
        isLoading={isLoading}
        notifPermission={notifPermission}
        onEnableNotifications={handleEnableNotifications}
        onOpenSettings={() => setSettingsOpen(true)}
        themeColors={themeColors}
      />

      {/* Auto-refresh paused banner */}
      {!isApiActive && (
        <div className="mx-4 mt-2 px-3 py-2 rounded-lg text-xs text-center"
          style={{ backgroundColor: themeColors.tabBg, color: themeColors.cardSubtext }}>
          ⏸ Auto-refresh paused (outside schedule) · Tap refresh to fetch manually
        </div>
      )}

      <TabToggle
        activeTab={activeTab}
        onTabChange={setActiveTab}
        arrivalCount={arrivalCount}
        departureCount={departureCount}
        hideArrived={hideArrived}
        onToggleHideArrived={handleToggleHideArrived}
        themeColors={themeColors}
      />
      <AirlineFilter activeFilters={activeFilters} onToggle={toggleFilter} themeColors={themeColors} />
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-xs">{error}</div>
      )}
      <div className="mt-3 flex-1">
        <FlightList flights={flights} activeFilters={activeFilters} isLoading={isLoading} hideArrived={hideArrived} themeColors={themeColors} />
      </div>
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        notifSchedule={notifSchedule}
        onNotifScheduleChange={handleNotifScheduleChange}
        apiSchedule={apiSchedule}
        onApiScheduleChange={handleApiScheduleChange}
        apiOverride={apiOverride}
        onApiOverrideChange={handleApiOverrideChange}
        isApiActive={isApiActive}
        themeColors={themeColors}
      />
    </main>
  );
}
