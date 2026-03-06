'use client';

import { ThemeName, NotifSchedule } from '@/lib/types';
import { DAY_LABELS, ThemeColors, ApiOverride } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeName;
  onThemeChange: (t: ThemeName) => void;
  notifSchedule: NotifSchedule;
  onNotifScheduleChange: (s: NotifSchedule) => void;
  apiSchedule: NotifSchedule;
  onApiScheduleChange: (s: NotifSchedule) => void;
  apiOverride: ApiOverride;
  onApiOverrideChange: (o: ApiOverride) => void;
  isApiActive: boolean;
  themeColors: ThemeColors;
}

const THEME_OPTIONS: { key: ThemeName; label: string; preview: string }[] = [
  { key: 'light', label: 'Light', preview: '#f9fafb' },
  { key: 'dark', label: 'Dark', preview: '#1a1a1a' },
  { key: 'darkBlue', label: 'Dark Blue', preview: '#0f2340' },
  { key: 'darkPurple', label: 'Dark Purple', preview: '#221338' },
];

function ScheduleEditor({
  schedule, onChange, themeColors, label,
}: { schedule: NotifSchedule; onChange: (s: NotifSchedule) => void; themeColors: ThemeColors; label: string }) {
  const update = (partial: Partial<NotifSchedule>) => onChange({ ...schedule, ...partial });
  const toggleDay = (i: number) => {
    const newDays = [...schedule.days];
    newDays[i] = !newDays[i];
    update({ days: newDays });
  };
  const formatHour = (h: number, m: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div>
      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm">{label} active</span>
        <button onClick={() => update({ enabled: !schedule.enabled })} className="relative w-11 h-6 rounded-full transition-colors"
          style={{ backgroundColor: schedule.enabled ? themeColors.accent : themeColors.cardBorder }}>
          <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            style={{ transform: schedule.enabled ? 'translateX(20px)' : 'translateX(0)' }} />
        </button>
      </div>
      {schedule.enabled && (
        <>
          {/* Days */}
          <div className="mb-3">
            <span className="text-xs font-medium block mb-1.5" style={{ color: themeColors.cardSubtext }}>Active Days</span>
            <div className="flex gap-1">
              {DAY_LABELS.map((lbl, i) => (
                <button key={lbl} onClick={() => toggleDay(i)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: schedule.days[i] ? themeColors.accent : themeColors.tabBg,
                    color: schedule.days[i] ? '#fff' : themeColors.tabText,
                  }}>{lbl}</button>
              ))}
            </div>
          </div>
          {/* Time range */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1" style={{ color: themeColors.cardSubtext }}>Start</label>
              <input type="time"
                value={`${schedule.startHour.toString().padStart(2, '0')}:${schedule.startMinute.toString().padStart(2, '0')}`}
                onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); update({ startHour: h, startMinute: m }); }}
                className="w-full px-3 py-2 rounded-lg text-sm border-0"
                style={{ backgroundColor: themeColors.tabBg, color: themeColors.cardText }} />
            </div>
            <span className="pt-5" style={{ color: themeColors.cardSubtext }}>to</span>
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1" style={{ color: themeColors.cardSubtext }}>End</label>
              <input type="time"
                value={`${schedule.endHour.toString().padStart(2, '0')}:${schedule.endMinute.toString().padStart(2, '0')}`}
                onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); update({ endHour: h, endMinute: m }); }}
                className="w-full px-3 py-2 rounded-lg text-sm border-0"
                style={{ backgroundColor: themeColors.tabBg, color: themeColors.cardText }} />
            </div>
          </div>
          <p className="text-xs" style={{ color: themeColors.cardSubtext }}>
            {formatHour(schedule.startHour, schedule.startMinute)} – {formatHour(schedule.endHour, schedule.endMinute)} on{' '}
            {schedule.days.map((on, i) => on ? DAY_LABELS[i] : null).filter(Boolean).join(', ') || 'no days'}
          </p>
        </>
      )}
    </div>
  );
}

export default function SettingsModal({
  isOpen, onClose, theme, onThemeChange,
  notifSchedule, onNotifScheduleChange,
  apiSchedule, onApiScheduleChange,
  apiOverride, onApiOverrideChange,
  isApiActive, themeColors,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 pb-8 shadow-2xl"
        style={{ backgroundColor: themeColors.cardBg, color: themeColors.cardText }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:opacity-70" style={{ color: themeColors.cardSubtext }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ---- THEME ---- */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: themeColors.cardSubtext }}>Theme</h3>
          <div className="grid grid-cols-4 gap-2">
            {THEME_OPTIONS.map((t) => (
              <button key={t.key} onClick={() => onThemeChange(t.key)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${theme === t.key ? 'scale-105' : 'opacity-70'}`}
                style={theme === t.key ? { borderColor: themeColors.accent } : { borderColor: 'transparent' }}>
                <div className="w-10 h-10 rounded-lg border border-white/20 shadow-inner" style={{ backgroundColor: t.preview }} />
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- API SCHEDULE (cost control) ---- */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-1 uppercase tracking-wide" style={{ color: themeColors.cardSubtext }}>
            Flight Data Schedule
          </h3>
          <p className="text-xs mb-3" style={{ color: themeColors.cardSubtext }}>
            Controls when the app fetches live data (costs ~$0.02/call).{' '}
            <span style={{ color: isApiActive ? '#4ade80' : '#f87171' }}>
              {isApiActive ? '● Live' : '○ Paused'}
            </span>
          </p>

          {/* Manual override */}
          <div className="flex gap-1.5 mb-4">
            {(['auto', 'on', 'off'] as ApiOverride[]).map((o) => (
              <button key={o} onClick={() => onApiOverrideChange(o)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: apiOverride === o ? themeColors.accent : themeColors.tabBg,
                  color: apiOverride === o ? '#fff' : themeColors.tabText,
                }}>
                {o === 'auto' ? '⏰ Auto' : o === 'on' ? '▶ Force On' : '⏸ Force Off'}
              </button>
            ))}
          </div>

          {apiOverride === 'auto' && (
            <ScheduleEditor schedule={apiSchedule} onChange={onApiScheduleChange} themeColors={themeColors} label="Auto-fetch" />
          )}
          {apiOverride === 'on' && (
            <p className="text-xs" style={{ color: '#facc15' }}>
              Fetching every 60s regardless of schedule. Remember to turn off when done!
            </p>
          )}
          {apiOverride === 'off' && (
            <p className="text-xs" style={{ color: themeColors.cardSubtext }}>
              Flight data paused. No API calls being made.
            </p>
          )}
        </div>

        {/* ---- NOTIFICATION SCHEDULE ---- */}
        <div>
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: themeColors.cardSubtext }}>
            Notification Schedule
          </h3>
          <ScheduleEditor schedule={notifSchedule} onChange={onNotifScheduleChange} themeColors={themeColors} label="Notifications" />
        </div>
      </div>
    </div>
  );
}
