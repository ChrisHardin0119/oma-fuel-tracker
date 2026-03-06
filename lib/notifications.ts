import { Flight } from './types';
import { AIRLINE_INFO, formatTime } from './utils';

// Status keywords that trigger notifications
const LANDING_STATUSES = ['landed', 'taxiing', 'arrived'];

// Check if a status indicates the plane just landed/is taxiing
function isLandingStatus(status: string): boolean {
  const lower = status.toLowerCase();
  return LANDING_STATUSES.some(s => lower.includes(s));
}

// Register the service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return null;
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission === 'denied') {
    return false;
  }
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Get current notification permission state
export function getNotificationPermission(): string {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Send a notification via the service worker (works in background)
async function sendNotification(title: string, body: string, tag: string) {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker?.controller) {
    // Fallback to regular Notification API if no service worker
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        tag,
        icon: '/icon-192.png',
      });
    }
    return;
  }

  // Send to service worker so it works in background
  navigator.serviceWorker.controller.postMessage({
    type: 'SHOW_NOTIFICATION',
    title,
    body,
    tag,
  });
}

// Compare old and new flight data to detect status changes worth notifying about
export function checkForStatusChanges(
  oldFlights: Flight[],
  newFlights: Flight[],
) {
  if (!oldFlights.length || !newFlights.length) return;
  if (Notification.permission !== 'granted') return;

  // Build a map of old flight statuses by ID
  const oldStatusMap = new Map<string, string>();
  for (const f of oldFlights) {
    oldStatusMap.set(f.id, f.status.toLowerCase());
  }

  // Check each new flight for status changes
  for (const flight of newFlights) {
    const oldStatus = oldStatusMap.get(flight.id);
    if (!oldStatus) continue; // New flight we haven't seen before

    const newStatus = flight.status.toLowerCase();

    // Skip if status hasn't changed
    if (oldStatus === newStatus) continue;

    // Check if the new status is a landing/taxiing/arrived status
    // and the old status was NOT (to avoid re-notifying)
    const wasLanding = isLandingStatus(oldStatus);
    const nowLanding = isLandingStatus(newStatus);

    if (nowLanding && !wasLanding) {
      // This flight just landed or started taxiing!
      const airline = AIRLINE_INFO[flight.airline];
      const bestTime = flight.actualTime || flight.estimatedTime || flight.scheduledTime;
      const gate = flight.gate ? `Gate ${flight.gate}` : 'No gate assigned';

      let statusLabel = 'Arrived';
      if (newStatus.includes('taxiing')) statusLabel = 'Taxiing to gate';
      else if (newStatus.includes('landed')) statusLabel = 'Landed';

      const title = `✈️ ${flight.flightNumber} ${statusLabel}`;
      const body = `${airline.name} from ${flight.origin} • ${gate} • ${formatTime(bestTime)}`;

      sendNotification(title, body, `flight-${flight.id}`);
    }
  }
}
