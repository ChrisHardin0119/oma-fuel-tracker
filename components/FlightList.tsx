'use client';

import { Flight, AirlineCode } from '@/lib/types';
import FlightCard from './FlightCard';

interface FlightListProps {
  flights: Flight[];
  activeFilters: AirlineCode[];
  isLoading: boolean;
}

export default function FlightList({ flights, activeFilters, isLoading }: FlightListProps) {
  const filtered = flights.filter(f => activeFilters.includes(f.airline));

  if (isLoading && flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="w-8 h-8 animate-spin mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-sm">Loading flights...</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-4xl mb-3">✈️</p>
        <p className="text-sm font-medium">No flights to show</p>
        <p className="text-xs mt-1">Check your airline filters or try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 pb-6 max-w-lg mx-auto">
      {filtered.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
