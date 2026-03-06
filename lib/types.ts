// FlightAware AeroAPI v4 response types

export interface FlightAwareResponse {
  arrivals: FlightAwareFlight[];
  departures: FlightAwareFlight[];
  links: {
    next?: string;
  } | null;
  num_pages: number;
}

export interface FlightAwareFlight {
  ident: string; // Flight number like "WN1234"
  ident_iata: string | null;
  ident_icao: string | null;
  fa_flight_id: string;
  operator: string | null; // ICAO airline code
  operator_iata: string | null; // IATA airline code
  flight_number: string | null;
  registration: string | null; // Tail number like "N8675309"
  atc_ident: string | null;
  inbound_fa_flight_id: string | null;
  codeshares: string[];
  codeshares_iata: string[];
  blocked: boolean;
  diverted: boolean;
  cancelled: boolean;
  position_only: boolean;
  origin: AirportInfo | null;
  destination: AirportInfo | null;
  departure_delay: number | null;
  arrival_delay: number | null;
  filed_ete: number | null;
  progress_percent: number | null;
  status: string;
  aircraft_type: string | null;
  route_distance: number | null;
  filed_airspeed: number | null;
  filed_altitude: number | null;
  scheduled_out: string | null;
  estimated_out: string | null;
  actual_out: string | null;
  scheduled_off: string | null;
  estimated_off: string | null;
  actual_off: string | null;
  scheduled_on: string | null;
  estimated_on: string | null;
  actual_on: string | null;
  scheduled_in: string | null;
  estimated_in: string | null;
  actual_in: string | null;
  gate_origin: string | null;
  gate_destination: string | null;
  terminal_origin: string | null;
  terminal_destination: string | null;
  type: string;
}

export interface AirportInfo {
  code: string | null;
  code_iata: string | null;
  code_icao: string | null;
  code_lid: string | null;
  timezone: string | null;
  name: string | null;
  city: string | null;
  airport_info_url: string | null;
}

// Our simplified flight type for the UI
export interface Flight {
  id: string;
  flightNumber: string;
  tailNumber: string;
  airline: AirlineCode;
  airlineName: string;
  aircraftType: string;
  gate: string;
  terminal: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  scheduledTime: string; // ISO string
  estimatedTime: string; // ISO string
  actualTime: string | null; // ISO string
  departureTime: string | null; // ISO string - when this plane departs OMA
  departureFlightNumber: string | null; // outbound flight number from OMA
  departureDestination: string | null; // where the outbound flight goes
  status: string;
  type: 'arrival' | 'departure';
  progress: number | null;
}

export type AirlineCode = 'WN' | 'G4' | 'AS' | 'FX';

export interface FlightsData {
  arrivals: Flight[];
  departures: Flight[];
  lastUpdated: string;
  error?: string;
}
