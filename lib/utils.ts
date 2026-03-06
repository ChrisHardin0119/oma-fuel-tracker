import { AirlineCode } from './types';

// Airline IATA codes we care about
export const TARGET_AIRLINES: AirlineCode[] = ['WN', 'G4', 'AS', 'FX'];

// Airline display info
export const AIRLINE_INFO: Record<AirlineCode, { name: string; color: string; bgColor: string; borderColor: string; emoji: string }> = {
  WN: { name: 'Southwest', color: '#FF6600', bgColor: 'bg-orange-50', borderColor: 'border-orange-400', emoji: '🟠' },
  G4: { name: 'Allegiant', color: '#6B7280', bgColor: 'bg-gray-50', borderColor: 'border-gray-400', emoji: '🟤' },
  AS: { name: 'Alaska', color: '#0033A0', bgColor: 'bg-blue-50', borderColor: 'border-blue-400', emoji: '🔵' },
  FX: { name: 'FedEx', color: '#4D148C', bgColor: 'bg-purple-50', borderColor: 'border-purple-400', emoji: '🟣' },
};

// Map ICAO operator codes to our IATA codes
export const ICAO_TO_IATA: Record<string, AirlineCode> = {
  SWA: 'WN', // Southwest
  AAY: 'G4', // Allegiant
  ASA: 'AS', // Alaska
  FDX: 'FX', // FedEx
};

// Format a time string for display (e.g., "3:15p")
export function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'p' : 'a';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes}${ampm}`;
}

// Format a full time with date context
export function formatFullTime(isoString: string | null): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Get the best available time (actual > estimated > scheduled)
export function getBestTime(actual: string | null, estimated: string | null, scheduled: string | null): string {
  return actual || estimated || scheduled || '';
}

// Get status color
export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('landed') || s.includes('arrived')) return 'text-green-600';
  if (s.includes('en route') || s.includes('airborne')) return 'text-blue-600';
  if (s.includes('delayed')) return 'text-red-600';
  if (s.includes('cancelled')) return 'text-red-700';
  if (s.includes('scheduled')) return 'text-gray-600';
  if (s.includes('taxiing')) return 'text-yellow-600';
  return 'text-gray-600';
}

// Format "last updated" time
export function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// Determine the airline code from FlightAware data
export function getAirlineCode(operatorIata: string | null, operator: string | null, ident: string): AirlineCode | null {
  // Try IATA operator code first
  if (operatorIata && TARGET_AIRLINES.includes(operatorIata as AirlineCode)) {
    return operatorIata as AirlineCode;
  }
  // Try ICAO operator code
  if (operator && ICAO_TO_IATA[operator]) {
    return ICAO_TO_IATA[operator];
  }
  // Try to extract from flight ident (e.g., "SWA1234" or "WN1234")
  for (const [icao, iata] of Object.entries(ICAO_TO_IATA)) {
    if (ident.startsWith(icao)) return iata;
  }
  for (const code of TARGET_AIRLINES) {
    if (ident.startsWith(code)) return code;
  }
  return null;
}
