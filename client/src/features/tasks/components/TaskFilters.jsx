import { Columns3, List, Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input.jsx';
import { TASK_FILTERS, TASK_VIEW_MODES } from '../taskConstants.js';
import { mergeClassNames } from '../../../lib/classNames.js';

const viewOptions = [
  { icon: List, label: 'List', value: TASK_VIEW_MODES.LIST },
  { icon: Columns3, label: 'Board', value: TASK_VIEW_MODES.BOARD },
];

export function TaskFilters({
  activeStatus,
  onSearchChange,
  onStatusChange,
  onViewModeChange,
  search,
  viewMode,
}) {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(220px,320px)] xl:items-center">
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

      <div className="inline-flex w-fit rounded-card border border-border bg-surface-elevated p-1">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = viewMode === option.value;

          return (
            <button
              aria-pressed={isActive}
              className={mergeClassNames(
                'inline-flex min-h-9 items-center gap-2 rounded-card px-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-surface text-body shadow-card'
                  : 'text-muted hover:bg-surface hover:text-body',
              )}
              key={option.value}
              onClick={() => onViewModeChange(option.value)}
              type="button"
            >
              <Icon aria-hidden="true" size={16} />
              {option.label}
            </button>
          );
        })}
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
