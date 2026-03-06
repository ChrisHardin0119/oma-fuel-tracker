import { FlightAwareFlight, Flight } from './types';
import { getAirlineCode, AIRLINE_INFO } from './utils';

const BASE_URL = 'https://aeroapi.flightaware.com/aeroapi';
const AIRPORT = 'KOMA';

export async function fetchFlights(apiKey: string): Promise<{ arrivals: Flight[]; departures: Flight[] }> {
  const baseUrl = `${BASE_URL}/airports/${AIRPORT}/flights`;

  // We need to hit THREE endpoints to get the full picture:
  // 1. /flights — recently arrived/departed flights (past ~12 hours)
  // 2. /flights/scheduled_arrivals — upcoming & en-route arrivals
  // 3. /flights/scheduled_departures — upcoming & scheduled departures
  // The regular /flights endpoint alone MISSES en-route and upcoming flights!

  const endpoints = [
    baseUrl,
    `${baseUrl}/scheduled_arrivals`,
    `${baseUrl}/scheduled_departures`,
  ];

  let allRawFlights: FlightAwareFlight[] = [];

  for (const endpoint of endpoints) {
    let cursor: string | undefined = undefined;
    let pageCount = 0;
    const maxPages = 3; // Safety limit per endpoint

    while (pageCount < maxPages) {
      const requestUrl: string = cursor ? `${endpoint}?cursor=${cursor}` : endpoint;
      const response = await fetch(requestUrl, {
        headers: {
          'x-apikey': apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`FlightAware API error for ${endpoint}: ${response.status} ${errorText}`);
        break; // Skip this endpoint but continue with others
      }

      const data = await response.json();

      // Collect flights from whichever arrays exist in the response
      if (data.arrivals) allRawFlights = allRawFlights.concat(data.arrivals);
      if (data.departures) allRawFlights = allRawFlights.concat(data.departures);
      if (data.scheduled_arrivals) allRawFlights = allRawFlights.concat(data.scheduled_arrivals);
      if (data.scheduled_departures) allRawFlights = allRawFlights.concat(data.scheduled_departures);

      // Check for next page
      cursor = data.links?.next ? extractCursor(data.links.next) : undefined;
      pageCount++;
      if (!cursor) break;
    }
  }

  // De-duplicate by fa_flight_id (same flight may appear in both arrays)
  const seen = new Set<string>();
  const uniqueFlights: FlightAwareFlight[] = [];
  for (const f of allRawFlights) {
    if (!seen.has(f.fa_flight_id)) {
      seen.add(f.fa_flight_id);
      uniqueFlights.push(f);
    }
  }

  // Categorize by ACTUAL origin/destination — not the API's arrays
  // If destination is KOMA → arrival at OMA
  // If origin is KOMA → departure from OMA
  const rawArrivals: FlightAwareFlight[] = [];
  const rawDepartures: FlightAwareFlight[] = [];

  for (const f of uniqueFlights) {
    const destCode = f.destination?.code || f.destination?.code_icao || '';
    const originCode = f.origin?.code || f.origin?.code_icao || '';

    if (destCode === AIRPORT || destCode === 'OMA') {
      rawArrivals.push(f);
    }
    if (originCode === AIRPORT || originCode === 'OMA') {
      rawDepartures.push(f);
    }
  }

  // Build a map of tail number → departure info from OMA
  // So we can show turnaround time on arrival cards
  const tailToDeparture: Record<string, { departureTime: string; flightNumber: string; destination: string }> = {};
  for (const f of rawDepartures) {
    const tail = f.registration;
    if (!tail) continue;
    const depTime = f.scheduled_out || f.estimated_out || f.actual_out || '';
    if (!depTime) continue;

    // If we already have a departure for this tail, keep the earliest future one
    if (tailToDeparture[tail]) {
      const existing = new Date(tailToDeparture[tail].departureTime).getTime();
      const current = new Date(depTime).getTime();
      if (current < existing) {
        tailToDeparture[tail] = {
          departureTime: depTime,
          flightNumber: f.ident_iata || f.ident || '',
          destination: f.destination?.code_iata || f.destination?.code || '',
        };
      }
    } else {
      tailToDeparture[tail] = {
        departureTime: depTime,
        flightNumber: f.ident_iata || f.ident || '',
        destination: f.destination?.code_iata || f.destination?.code || '',
      };
    }
  }

  // Filter and transform arrivals, attaching OMA departure info by tail number
  const arrivals = rawArrivals
    .map(f => transformFlight(f, 'arrival', tailToDeparture))
    .filter((f): f is Flight => f !== null)
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  // Filter and transform departures (flights leaving OMA)
  const departures = rawDepartures
    .map(f => transformFlight(f, 'departure', tailToDeparture))
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

function transformFlight(
  raw: FlightAwareFlight,
  type: 'arrival' | 'departure',
  tailToDeparture: Record<string, { departureTime: string; flightNumber: string; destination: string }>
): Flight | null {
  // Determine airline — check ident_iata first (catches Mesa YV flights)
  const identToCheck = raw.ident_iata || raw.ident || '';
  const airlineCode = getAirlineCode(raw.operator_iata, raw.operator, identToCheck);
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
  let departureFlightNumber: string | null = null;
  let departureDestination: string | null = null;

  if (type === 'arrival') {
    scheduledTime = raw.scheduled_in || raw.scheduled_on || '';
    estimatedTime = raw.estimated_in || raw.estimated_on || scheduledTime;
    actualTime = raw.actual_in || raw.actual_on || null;
    gate = raw.gate_destination || '';
    terminal = raw.terminal_destination || '';

    // Look up the OMA departure for this tail number
    const tail = raw.registration;
    if (tail && tailToDeparture[tail]) {
      departureTime = tailToDeparture[tail].departureTime;
      departureFlightNumber = tailToDeparture[tail].flightNumber;
      departureDestination = tailToDeparture[tail].destination;
    }
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
    departureFlightNumber,
    departureDestination,
    status: raw.status || 'Unknown',
    type,
    progress: raw.progress_percent,
  };
}
