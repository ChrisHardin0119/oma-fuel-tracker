'use client';

import { Flight } from '@/lib/types';
import { AIRLINE_INFO, formatTime, getStatusColor, ThemeColors } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  themeColors: ThemeColors;
}

export default function FlightCard({ flight, themeColors }: FlightCardProps) {
  const airline = AIRLINE_INFO[flight.airline];
  const bestTime = flight.actualTime || flight.estimatedTime || flight.scheduledTime;
  const isDelayed = flight.estimatedTime && flight.scheduledTime &&
    new Date(flight.estimatedTime).getTime() > new Date(flight.scheduledTime).getTime() + 5 * 60 * 1000;

  return (
    <div className="rounded-xl border-l-4 shadow-sm p-4" style={{ backgroundColor: themeColors.cardBg, borderLeftColor: airline.color }}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg font-bold truncate" style={{ color: themeColors.cardText }}>{flight.flightNumber}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: airline.color }}>
            {airline.name}
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 ml-2"
          style={{ color: themeColors.cardSubtext, backgroundColor: themeColors.tabBg }}>
          {flight.tailNumber}
        </span>
      </div>

      {/* Gate + time */}
      <div className="flex items-center gap-1.5 text-sm mb-1.5">
        {flight.gate ? (
          <span className="font-semibold" style={{ color: themeColors.cardText }}>Gate {flight.gate}</span>
        ) : flight.airline === 'FX' ? (
          <span className="font-semibold" style={{ color: themeColors.cardText }}>Cargo</span>
        ) : (
          <span style={{ color: themeColors.cardSubtext }}>No gate</span>
        )}
        <span style={{ color: themeColors.cardBorder }}>·</span>
        <span className={`font-semibold ${isDelayed ? 'text-red-500' : ''}`} style={isDelayed ? {} : { color: themeColors.cardText }}>
          {flight.type === 'arrival' ? 'Arrives' : 'Departs'} {formatTime(bestTime)}
        </span>
      </div>

      {/* From/To, aircraft, status */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5" style={{ color: themeColors.cardSubtext }}>
          <span>
            {flight.type === 'arrival' ? 'From' : 'To'}:{' '}
            <span className="font-medium" style={{ color: themeColors.cardText }}>
              {flight.type === 'arrival' ? flight.origin : flight.destination}
            </span>
          </span>
          <span style={{ color: themeColors.cardBorder }}>·</span>
          <span>{flight.aircraftType}</span>
        </div>
        <span className={`font-medium ${getStatusColor(flight.status)}`}>{flight.status}</span>
      </div>

      {isDelayed && (
        <div className="mt-1.5 text-xs text-red-500">
          Scheduled: {formatTime(flight.scheduledTime)} → Est: {formatTime(flight.estimatedTime)}
        </div>
      )}

      {flight.type === 'arrival' && flight.departureTime && (
        <div className="mt-2 pt-2 text-xs" style={{ borderTopColor: themeColors.cardBorder, borderTopWidth: '1px' }}>
          <span style={{ color: themeColors.cardSubtext }}>Leaves OMA: </span>
          <span className="font-semibold" style={{ color: themeColors.cardText }}>{formatTime(flight.departureTime)}</span>
          {flight.departureFlightNumber && <span style={{ color: themeColors.cardSubtext }}> as {flight.departureFlightNumber}</span>}
          {flight.departureDestination && <span style={{ color: themeColors.cardSubtext }}> → {flight.departureDestination}</span>}
        </div>
      )}

      {flight.progress !== null && flight.progress > 0 && flight.progress < 100 && (
        <div className="mt-2 w-full rounded-full h-1.5" style={{ backgroundColor: themeColors.tabBg }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${flight.progress}%`, backgroundColor: airline.color }} />
        </div>
      )}
    </div>
  );
}
