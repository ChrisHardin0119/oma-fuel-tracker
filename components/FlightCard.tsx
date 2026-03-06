'use client';

import { Flight } from '@/lib/types';
import { AIRLINE_INFO, formatTime, getStatusColor } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const airline = AIRLINE_INFO[flight.airline];
  const bestTime = flight.actualTime || flight.estimatedTime || flight.scheduledTime;
  const isDelayed = flight.estimatedTime && flight.scheduledTime &&
    new Date(flight.estimatedTime).getTime() > new Date(flight.scheduledTime).getTime() + 5 * 60 * 1000;

  return (
    <div
      className={`rounded-xl border-l-4 bg-white shadow-sm p-4 ${airline.borderColor}`}
      style={{ borderLeftColor: airline.color }}
    >
      {/* Top row: Flight number, airline badge, tail number */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{flight.flightNumber}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: airline.color }}
          >
            {airline.name}
          </span>
        </div>
        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          {flight.tailNumber}
        </span>
      </div>

      {/* Middle row: Gate, time, origin/destination */}
      <div className="flex items-center justify-between text-sm mb-1.5">
        <div className="flex items-center gap-1.5">
          {flight.gate ? (
            <span className="font-semibold text-gray-800">
              Gate {flight.gate}
            </span>
          ) : flight.airline === 'FX' ? (
            <span className="font-semibold text-gray-800">Cargo</span>
          ) : (
            <span className="text-gray-400">No gate</span>
          )}
          <span className="text-gray-300">•</span>
          <span className={`font-semibold ${isDelayed ? 'text-red-600' : 'text-gray-800'}`}>
            {flight.type === 'arrival' ? 'Arrives' : 'Departs'} {formatTime(bestTime)}
          </span>
        </div>
      </div>

      {/* Bottom row: From/To, aircraft, status */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span>
            {flight.type === 'arrival' ? 'From' : 'To'}:{' '}
            <span className="font-medium text-gray-700">
              {flight.type === 'arrival' ? flight.origin : flight.destination}
            </span>
          </span>
          <span className="text-gray-300">•</span>
          <span>{flight.aircraftType}</span>
        </div>
        <span className={`font-medium ${getStatusColor(flight.status)}`}>
          {flight.status}
        </span>
      </div>

      {/* Scheduled vs estimated if delayed */}
      {isDelayed && (
        <div className="mt-1.5 text-xs text-red-500">
          Scheduled: {formatTime(flight.scheduledTime)} → Est: {formatTime(flight.estimatedTime)}
        </div>
      )}

      {/* Departure time for arrivals (turnaround info) */}
      {flight.type === 'arrival' && flight.departureTime && (
        <div className="mt-1.5 text-xs text-gray-400">
          Departs: {formatTime(flight.departureTime)}
        </div>
      )}

      {/* Progress bar for en-route flights */}
      {flight.progress !== null && flight.progress > 0 && flight.progress < 100 && (
        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${flight.progress}%`, backgroundColor: airline.color }}
          />
        </div>
      )}
    </div>
  );
}
