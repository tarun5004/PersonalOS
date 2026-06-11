import { CalendarCheck, RefreshCcwDot } from 'lucide-react';
import { EventCard } from './EventCard.jsx';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarSummaryCard() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => (
          <div key={day}>
            <p className="m-0 text-[11px] font-bold text-muted">{day}</p>
            <span
              className={
                index === 4
                  ? 'mx-auto mt-2 grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-text'
                  : 'mx-auto mt-2 grid size-8 place-items-center rounded-full bg-surface-muted text-xs font-bold text-body'
              }
            >
              {14 + index}
            </span>
          </div>
        ))}
      </div>
      <div className="grid gap-3">
        <EventCard icon={CalendarCheck} label="Plan" meta="09:00-09:30" title="Daily planning" />
        <EventCard icon={RefreshCcwDot} label="Habit" meta="18:00-18:15" title="Habit check-in" />
      </div>
    </div>
  );
}
