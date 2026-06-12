import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input.jsx';
import { TASK_FILTERS } from '../taskConstants.js';
import { mergeClassNames } from '../../../lib/classNames.js';

export function TaskFilters({ activeStatus, onSearchChange, onStatusChange, search }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] lg:items-center">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {TASK_FILTERS.map((filter) => (
          <button
            className={mergeClassNames(
              'min-h-10 rounded-card border px-4 text-sm font-semibold transition',
              activeStatus === filter
                ? 'border-accent bg-accent text-accent-text shadow-card'
                : 'border-border bg-surface text-muted hover:border-accent hover:bg-accent-soft hover:text-body',
            )}
            key={filter}
            onClick={() => onStatusChange(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          size={17}
        />
        <Input
          aria-label="Search tasks"
          inputClassName="pl-10"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
          value={search}
        />
      </div>
    </div>
  );
}
