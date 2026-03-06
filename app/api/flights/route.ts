import { NextResponse } from 'next/server';
import { fetchFlights } from '@/lib/flightaware';
import { FlightsData } from '@/lib/types';

// In-memory cache
let cachedData: FlightsData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  const apiKey = process.env.FLIGHTAWARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { arrivals: [], departures: [], lastUpdated: new Date().toISOString(), error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { arrivals, departures } = await fetchFlights(apiKey);

    const data: FlightsData = {
      arrivals,
      departures,
      lastUpdated: new Date().toISOString(),
    };

    // Update cache
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error('FlightAware API error:', error);

    // Return stale cache if available
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        error: 'Using cached data - API temporarily unavailable',
      });
    }

    return NextResponse.json(
      {
        arrivals: [],
        departures: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Failed to fetch flights',
      },
      { status: 500 }
    );
  }
}
