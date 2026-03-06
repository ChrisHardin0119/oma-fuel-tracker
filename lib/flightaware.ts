import { FlightAwareFlight, Flight } from './types';
import { getAirlineCode, AIRLINE_INFO } from './utils';

const BASE_URL = 'https://aeroapi.flightaware.com/aeroapi';
const AIRPORT = 'KOMA';

export async function fetchFlights(apiKey: string): Promise<{ arrivals: Flight[]; departures: Flight[] }> {
  const url = `${BASE_URL}/airports/${AIRPORT}/flights`;

  // Fetch all pages
  let allArrivals: FlightAwareFlight[] = [];
  let allDepartures: FlightAwareFlight[] = [];
  let cursor: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 5; // Safety limit

  while (pageCount < maxPages) {
    const fetchUrl: string = cursor ? `${url}?cursor=${cursor}` : url;
    const response = await fetch(fetchUrl, {
      headers: {
        'x-apikey': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FlightAware API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.arrivals) allArrivals = allArrivals.concat(data.arrivals);
    if (data.departures) allDepartures = allDepartures.concat(data.departures);

    // Check for next page
    cursor = data.links?.next ? extractCursor(data.links.next) : undefined;
    pageCount++;
    if (!cursor) break;
  }

  // Filter and transform arrivals
  const arrivals = allArrivals
    .map(f => transformFlight(f, 'arrival'))
    .filter((f): f is Flight => f !== null)
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  // Filter and transform departures
  const departures = allDepartures
    .map(f => transformFlight(f, 'departure'))
    .filter((f): f is Flight => f !== null)
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  return { arrivals, departures };
}

function extractCursor(nextUrl: string): string | undefined {
  try {
    const url = new URL(nextUrl, 'https://aeroapi.flightaware.com');
    return url.searchParams.get('cursor') || undefined;
  } catch {
    return undefined;
  }
}

function transformFlight(raw: FlightAwareFlight, type: 'arrival' | 'departure'): Flight | null {
  // Determine airline
  const airlineCode = getAirlineCode(raw.operator_iata, raw.operator, raw.ident);
  if (!airlineCode) return null; // Not one of our airlines

  const airline = AIRLINE_INFO[airlineCode];

  // Get the display flight number - prefer IATA ident
  const flightNumber = raw.ident_iata || raw.ident || 'Unknown';

  // Get times based on arrival or departure
  let scheduledTime: string;
  let estimatedTime: string;
  let actualTime: string | null;
  let gate: string;
  let terminal: string;
  let departureTime: string | null = null;

  if (type === 'arrival') {
    scheduledTime = raw.scheduled_in || raw.scheduled_on || '';
    estimatedTime = raw.estimated_in || raw.estimated_on || scheduledTime;
    actualTime = raw.actual_in || raw.actual_on || null;
    gate = raw.gate_destination || '';
    terminal = raw.terminal_destination || '';
    // For arrivals, also show when it departs (turnaround info)
    departureTime = raw.scheduled_out ? raw.scheduled_out : null;
  } else {
    scheduledTime = raw.scheduled_out || raw.scheduled_off || '';
    estimatedTime = raw.estimated_out || raw.estimated_off || scheduledTime;
    actualTime = raw.actual_out || raw.actual_off || null;
    gate = raw.gate_origin || '';
    terminal = raw.terminal_origin || '';
  }

  return {
    id: raw.fa_flight_id,
    flightNumber,
    tailNumber: raw.registration || 'N/A',
    airline: airlineCode,
    airlineName: airline.name,
    aircraftType: raw.aircraft_type || 'Unknown',
    gate,
    terminal,
    origin: raw.origin?.code_iata || raw.origin?.code || '',
    originCity: raw.origin?.city || '',
    destination: raw.destination?.code_iata || raw.destination?.code || '',
    destinationCity: raw.destination?.city || '',
    scheduledTime,
    estimatedTime,
    actualTime,
    departureTime,
    status: raw.status || 'Unknown',
    type,
    progress: raw.progress_percent,
  };
}
