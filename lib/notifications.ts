import { Flight } from './types';
import { AIRLINE_INFO, formatTime, isWithinSchedule, loadNotifSchedule } from './utils';

const LANDING_STATUSES = ['landed', 'taxiing', 'arrived'];

function isLandingStatus(status: string): boolean {
  const lower = status.toLowerCase();
  return LANDING_STATUSES.some(s => lower.includes(s));
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('/sw.js');
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): string {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

async function sendNotification(title: string, body: string, tag: string) {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker?.controller) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, tag, icon: '/icon-192.png' });
    }
    return;
  }
  navigator.serviceWorker.controller.postMessage({ type: 'SHOW_NOTIFICATION', title, body, tag });
}

// Compare old and new flight data — respects notification schedule
export function checkForStatusChanges(oldFlights: Flight[], newFlights: Flight[]) {
  if (!oldFlights.length || !newFlights.length) return;
  if (typeof window === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  // Check if current time is within the user's notification schedule
  const schedule = loadNotifSchedule();
  if (!isWithinSchedule(schedule)) return;

  const oldStatusMap = new Map<string, string>();
  for (const f of oldFlights) { oldStatusMap.set(f.id, f.status.toLowerCase()); }

  for (const flight of newFlights) {
    const oldStatus = oldStatusMap.get(flight.id);
    if (!oldStatus) continue;
    const newStatus = flight.status.toLowerCase();
    if (oldStatus === newStatus) continue;

    const wasLanding = isLandingStatus(oldStatus);
    const nowLanding = isLandingStatus(newStatus);

    if (nowLanding && !wasLanding) {
      const airline = AIRLINE_INFO[flight.airline];
      const bestTime = flight.actualTime || flight.estimatedTime || flight.scheduledTime;
      const gate = flight.gate ? `Gate ${flight.gate}` : 'No gate assigned';
      let statusLabel = 'Arrived';
      if (newStatus.includes('taxiing')) statusLabel = 'Taxiing to gate';
      else if (newStatus.includes('landed')) statusLabel = 'Landed';

      sendNotification(
        `✈️ ${flight.flightNumber} ${statusLabel}`,
        `${airline.name} from ${flight.origin} • ${gate} • ${formatTime(bestTime)}`,
        `flight-${flight.id}`
      );
    }
  }
}
