import { Bell, FastForward, TimerReset } from 'lucide-react';
import { Checkbox } from '../../../components/ui/Checkbox.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { POMODORO_OPTIONS } from '../../../utils/constants.js';
import { usePomodoro } from '../usePomodoro.js';

function renderMinuteOptions(values) {
  return values.map((value) => (
    <option key={value} value={value}>
      {value} min
    </option>
  ));
}

/** Renders persisted Pomodoro configuration controls for the Settings page. */
export function PomodoroSettings() {
  const { settings, updateSettings } = usePomodoro();

  return (
    <DashboardCard title="Focus timer">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Focus duration"
            onChange={(event) => updateSettings({ focusDuration: Number(event.target.value) })}
            value={settings.focusDuration}
          >
            {renderMinuteOptions(POMODORO_OPTIONS.focusDuration)}
          </Select>
          <Select
            label="Short break"
            onChange={(event) => updateSettings({ shortBreak: Number(event.target.value) })}
            value={settings.shortBreak}
          >
            {renderMinuteOptions(POMODORO_OPTIONS.shortBreak)}
          </Select>
          <Select
            label="Long break"
            onChange={(event) => updateSettings({ longBreak: Number(event.target.value) })}
            value={settings.longBreak}
          >
            {renderMinuteOptions(POMODORO_OPTIONS.longBreak)}
          </Select>
          <Select
            label="Long break after"
            onChange={(event) => updateSettings({ longBreakAfter: Number(event.target.value) })}
            value={settings.longBreakAfter}
          >
            {POMODORO_OPTIONS.longBreakAfter.map((value) => (
              <option key={value} value={value}>
                {value} sessions
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <Checkbox
            checked={settings.autoStartBreak}
            description="Move into break mode when a focus session ends."
            label="Auto-start breaks"
            onChange={(event) => updateSettings({ autoStartBreak: event.target.checked })}
          />
          <Checkbox
            checked={settings.autoStartFocus}
            description="Start the next focus block after a break."
            label="Auto-start next focus"
            onChange={(event) => updateSettings({ autoStartFocus: event.target.checked })}
          />
          <Checkbox
            checked={settings.soundOnComplete}
            description="Play a short tone when a session completes."
            label="Sound notifications"
            onChange={(event) => updateSettings({ soundOnComplete: event.target.checked })}
          />
        </div>

        <div className="grid gap-3 rounded-card border border-border bg-surface-elevated p-4 text-sm text-muted md:grid-cols-3">
          <span className="inline-flex items-center gap-2">
            <TimerReset aria-hidden="true" size={16} />
            Protect one block.
          </span>
          <span className="inline-flex items-center gap-2">
            <FastForward aria-hidden="true" size={16} />
            Breaks stay intentional.
          </span>
          <span className="inline-flex items-center gap-2">
            <Bell aria-hidden="true" size={16} />
            Completion is visible.
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
