import { AirlineCode, ThemeName, NotifSchedule } from './types';

// Airline IATA codes we care about (added Mesa YV)
export const TARGET_AIRLINES: AirlineCode[] = ['WN', 'G4', 'AS', 'YV', 'FX'];

// Airline display info
export const AIRLINE_INFO: Record<AirlineCode, { name: string; color: string; bgColor: string; borderColor: string; emoji: string }> = {
  WN: { name: 'Southwest', color: '#FF6600', bgColor: 'bg-orange-50', borderColor: 'border-orange-400', emoji: '🟠' },
  G4: { name: 'Allegiant', color: '#6B7280', bgColor: 'bg-gray-50', borderColor: 'border-gray-400', emoji: '🟤' },
  AS: { name: 'Alaska', color: '#0033A0', bgColor: 'bg-blue-50', borderColor: 'border-blue-400', emoji: '🔵' },
  YV: { name: 'Mesa', color: '#D97706', bgColor: 'bg-amber-50', borderColor: 'border-amber-400', emoji: '🟡' },
  FX: { name: 'FedEx', color: '#4D148C', bgColor: 'bg-purple-50', borderColor: 'border-purple-400', emoji: '🟣' },
};

// Map ICAO operator codes to our IATA codes
export const ICAO_TO_IATA: Record<string, AirlineCode> = {
  SWA: 'WN', // Southwest
  AAY: 'G4', // Allegiant
  ASA: 'AS', // Alaska
  ASH: 'YV', // Mesa Airlines
  FDX: 'FX', // FedEx
};

// ---- Theme system ----
export interface ThemeColors {
  name: string;
  headerBg: string;
  headerText: string;
  bodyBg: string;
  cardBg: string;
  cardText: string;
  cardSubtext: string;
  cardBorder: string;
  tabBg: string;
  tabActive: string;
  tabActiveText: string;
  tabText: string;
  badgeBg: string;
  badgeText: string;
  filterInactiveBg: string;
  filterInactiveText: string;
  filterInactiveBorder: string;
  accent: string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  light: {
    name: 'Light',
    headerBg: '#111827',
    headerText: '#ffffff',
    bodyBg: '#f9fafb',
    cardBg: '#ffffff',
    cardText: '#111827',
    cardSubtext: '#6b7280',
    cardBorder: '#f3f4f6',
    tabBg: '#f3f4f6',
    tabActive: '#ffffff',
    tabActiveText: '#111827',
    tabText: '#6b7280',
    badgeBg: '#111827',
    badgeText: '#ffffff',
    filterInactiveBg: '#ffffff',
    filterInactiveText: '#9ca3af',
    filterInactiveBorder: '#e5e7eb',
    accent: '#3b82f6',
  },
  dark: {
    name: 'Dark',
    headerBg: '#0f0f0f',
    headerText: '#ffffff',
    bodyBg: '#1a1a1a',
    cardBg: '#262626',
    cardText: '#f3f4f6',
    cardSubtext: '#9ca3af',
    cardBorder: '#374151',
    tabBg: '#262626',
    tabActive: '#374151',
    tabActiveText: '#f3f4f6',
    tabText: '#9ca3af',
    badgeBg: '#e5e7eb',
    badgeText: '#111827',
    filterInactiveBg: '#262626',
    filterInactiveText: '#6b7280',
    filterInactiveBorder: '#374151',
    accent: '#3b82f6',
  },
  darkBlue: {
    name: 'Dark Blue',
    headerBg: '#0c1929',
    headerText: '#ffffff',
    bodyBg: '#0f2340',
    cardBg: '#162d50',
    cardText: '#e0ecff',
    cardSubtext: '#8badd4',
    cardBorder: '#1e3a5f',
    tabBg: '#162d50',
    tabActive: '#1e3a5f',
    tabActiveText: '#e0ecff',
    tabText: '#6b8db5',
    badgeBg: '#60a5fa',
    badgeText: '#0c1929',
    filterInactiveBg: '#162d50',
    filterInactiveText: '#6b8db5',
    filterInactiveBorder: '#1e3a5f',
    accent: '#60a5fa',
  },
  darkPurple: {
    name: 'Dark Purple',
    headerBg: '#1a0a2e',
    headerText: '#ffffff',
    bodyBg: '#221338',
    cardBg: '#2d1b4e',
    cardText: '#e8d5ff',
    cardSubtext: '#a78bca',
    cardBorder: '#3d2566',
    tabBg: '#2d1b4e',
    tabActive: '#3d2566',
    tabActiveText: '#e8d5ff',
    tabText: '#8b6cad',
    badgeBg: '#a78bfa',
    badgeText: '#1a0a2e',
    filterInactiveBg: '#2d1b4e',
    filterInactiveText: '#8b6cad',
    filterInactiveBorder: '#3d2566',
    accent: '#a78bfa',
  },
};

// ---- Notification schedule defaults ----
export const DEFAULT_NOTIF_SCHEDULE: NotifSchedule = {
  enabled: true,
  days: [false, true, true, true, true, true, false], // Mon-Fri
  startHour: 5,
  startMinute: 0,
  endHour: 23,
  endMinute: 0,
  repeat: true,
};

// ---- API call schedule defaults (controls when the app polls FlightAware) ----
// Default: Tue, Fri, Sat from 2pm-10pm CST to save on API costs
export const DEFAULT_API_SCHEDULE: NotifSchedule = {
  enabled: true,
  days: [false, false, true, false, false, true, true], // Tue, Fri, Sat
  startHour: 14, // 2pm
  startMinute: 0,
  endHour: 22, // 10pm
  endMinute: 0,
  repeat: true,
};

// Manual override — lets user force-start or force-stop API calls
// 'auto' = follow schedule, 'on' = force on, 'off' = force off
export type ApiOverride = 'auto' | 'on' | 'off';

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Check if current time is within notification schedule
export function isWithinSchedule(schedule: NotifSchedule): boolean {
  if (!schedule.enabled) return false;
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
  if (!schedule.days[dayOfWeek]) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = schedule.startHour * 60 + schedule.startMinute;
  const endMinutes = schedule.endHour * 60 + schedule.endMinute;

  // Handle overnight shifts (e.g., 10pm - 6am)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// ---- localStorage helpers ----
export function loadTheme(): ThemeName {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('oma-theme') as ThemeName) || 'dark';
}

export function saveTheme(theme: ThemeName) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oma-theme', theme);
}

export function loadNotifSchedule(): NotifSchedule {
  if (typeof window === 'undefined') return DEFAULT_NOTIF_SCHEDULE;
  try {
    const saved = localStorage.getItem('oma-notif-schedule');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_NOTIF_SCHEDULE;
}

export function saveNotifSchedule(schedule: NotifSchedule) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oma-notif-schedule', JSON.stringify(schedule));
}

export function loadHideArrived(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('oma-hide-arrived') === 'true';
}

export function saveHideArrived(hide: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oma-hide-arrived', hide ? 'true' : 'false');
}

export function loadApiSchedule(): NotifSchedule {
  if (typeof window === 'undefined') return DEFAULT_API_SCHEDULE;
  try {
    const saved = localStorage.getItem('oma-api-schedule');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_API_SCHEDULE;
}

export function saveApiSchedule(schedule: NotifSchedule) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oma-api-schedule', JSON.stringify(schedule));
}

export function loadApiOverride(): ApiOverride {
  if (typeof window === 'undefined') return 'auto';
  return (localStorage.getItem('oma-api-override') as ApiOverride) || 'auto';
}

export function saveApiOverride(override: ApiOverride) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('oma-api-override', override);
}

// Check if API calls should be active based on schedule + override
export function shouldFetchApi(schedule: NotifSchedule, override: ApiOverride): boolean {
  if (override === 'on') return true;
  if (override === 'off') return false;
  return isWithinSchedule(schedule);
}

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

// Get the best available time
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

// Check if a flight has "arrived" status (for hide-arrived filter)
export function isFlightArrived(status: string): boolean {
  const s = status.toLowerCase();
  return s.includes('arrived') || s.includes('gate arrival') || s.includes('baggage');
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
  // IMPORTANT: Check the flight ident FIRST to catch Mesa (YV) flights
  // that may have operator_iata set to Alaska (AS) due to codeshare
  for (const code of TARGET_AIRLINES) {
    if (ident.startsWith(code)) return code;
  }
  // Check ICAO ident prefix (e.g., ASH4038 for Mesa)
  for (const [icao, iata] of Object.entries(ICAO_TO_IATA)) {
    if (ident.startsWith(icao)) return iata;
  }
  // Then try IATA operator code
  if (operatorIata && TARGET_AIRLINES.includes(operatorIata as AirlineCode)) {
    return operatorIata as AirlineCode;
  }
  // Try ICAO operator code
  if (operator && ICAO_TO_IATA[operator]) {
    return ICAO_TO_IATA[operator];
  }
  return null;
}
