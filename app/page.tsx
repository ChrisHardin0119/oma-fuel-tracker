'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlightsData, AirlineCode } from '@/lib/types';
import { TARGET_AIRLINES } from '@/lib/utils';
import Header from '@/components/Header';
import TabToggle from '@/components/TabToggle';
import AirlineFilter from '@/components/AirlineFilter';
import FlightList from '@/components/FlightList';

const REFRESH_INTERVAL = 60 * 1000; // 1 minute

export default function Home() {
  const [data, setData] = useState<FlightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures'>('arrivals');
  const [activeFilters, setActiveFilters] = useState<AirlineCode[]>([...TARGET_AIRLINES]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flights');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: FlightsData = await response.json();
      setData(result);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleFilter = (airline: AirlineCode) => {
    setActiveFilters(prev => {
      if (prev.includes(airline)) {
        // Don't allow deselecting all
        if (prev.length === 1) return prev;
        return prev.filter(a => a !== airline);
      }
      return [...prev, airline];
    });
  };

  const flights = activeTab === 'arrivals' ? data?.arrivals || [] : data?.departures || [];

  return (
    <main className="flex flex-col min-h-screen max-w-lg mx-auto">
      <Header
        lastUpdated={data?.lastUpdated || ''}
        onRefresh={fetchData}
        isLoading={isLoading}
      />

      <TabToggle
        activeTab={activeTab}
        onTabChange={setActiveTab}
        arrivalCount={data?.arrivals?.filter(f => activeFilters.includes(f.airline)).length || 0}
        departureCount={data?.departures?.filter(f => activeFilters.includes(f.airline)).length || 0}
      />

      <AirlineFilter
        activeFilters={activeFilters}
        onToggle={toggleFilter}
      />

      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
          {error}
        </div>
      )}

      <div className="mt-3 flex-1">
        <FlightList
          flights={flights}
          activeFilters={activeFilters}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
