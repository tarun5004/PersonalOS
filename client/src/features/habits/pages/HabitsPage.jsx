import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, RefreshCcwDot } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { getHabitErrorMessage } from '../habitApi.js';
import { HABIT_LIST_LIMIT } from '../habitConstants.js';
import {
  getCurrentUtcMonthKey,
  getMonthLabel,
  shiftUtcMonth,
} from '../habitFormUtils.js';
import { HabitCard } from '../components/HabitCard.jsx';
import { HabitForm } from '../components/HabitForm.jsx';
import { HabitGrid } from '../components/HabitGrid.jsx';
import { useHabitMutations, useHabits } from '../useHabits.js';

function getHabitSummary(habits) {
  const completedToday = habits.filter((habit) => habit.todayCompleted).length;
  const bestStreak = habits.reduce(
    (best, habit) => Math.max(best, habit.longestStreak || 0),
    0,
  );
  const averageCompletion =
    habits.length === 0
      ? 0
      : Math.round(
          habits.reduce((total, habit) => total + (habit.completionPercentage || 0), 0) /
            habits.length,
        );

  return {
    completedToday,
    bestStreak,
    averageCompletion,
  };
}

export default function HabitsPage() {
  const [monthKey, setMonthKey] = useState(() => getCurrentUtcMonthKey());
  const [offset, setOffset] = useState(0);
  const [modalMode, setModalMode] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [formError, setFormError] = useState('');
  const [pageMessage, setPageMessage] = useState('');
  const [pageError, setPageError] = useState('');
  const habitsQuery = useHabits({
    limit: HABIT_LIST_LIMIT,
    month: monthKey,
    offset,
  });
  const habitMutations = useHabitMutations();

  const habits = habitsQuery.data?.habits || [];
  const month = habitsQuery.data?.month || {
    key: monthKey,
    totalDays: 31,
  };
  const pagination = habitsQuery.data?.pagination || {
    limit: HABIT_LIST_LIMIT,
    offset,
    total: 0,
  };
  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const isMutating = Object.values(habitMutations).some((mutation) => mutation.isPending);
  const isCreateOpen = modalMode === 'create';
  const isEditOpen = modalMode === 'edit';
  const hasNextPage = pagination.offset + pagination.limit < pagination.total;
  const hasPreviousPage = pagination.offset > 0;

  function openCreateHabit() {
    setSelectedHabit(null);
    setFormError('');
    setModalMode('create');
  }

  function openEditHabit(habit) {
    setSelectedHabit(habit);
    setFormError('');
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setSelectedHabit(null);
    setFormError('');
  }

  function handleCreateHabit(values) {
    setFormError('');
    setPageError('');
    habitMutations.createHabit.mutate(values, {
      onError: (error) => setFormError(getHabitErrorMessage(error)),
      onSuccess: () => {
        closeModal();
        setPageMessage('Habit created successfully');
      },
    });
  }

  function handleUpdateHabit(values) {
    if (!selectedHabit) {
      return;
    }

    setFormError('');
    setPageError('');
    habitMutations.updateHabit.mutate(
      { habitId: selectedHabit._id, values },
      {
        onError: (error) => setFormError(getHabitErrorMessage(error)),
        onSuccess: () => {
          closeModal();
          setPageMessage('Habit updated successfully');
        },
      },
    );
  }

  function handleCheckInHabit(habit) {
    setPageError('');
    habitMutations.checkInHabit.mutate(habit._id, {
      onError: (error) => setPageError(getHabitErrorMessage(error)),
      onSuccess: () => setPageMessage('Habit checked in for today'),
    });
  }

  function handleDeleteHabit(habit) {
    if (!window.confirm(`Delete "${habit.name}" and its check-ins?`)) {
      return;
    }

    setPageError('');
    habitMutations.deleteHabit.mutate(habit._id, {
      onError: (error) => setPageError(getHabitErrorMessage(error)),
      onSuccess: () => setPageMessage('Habit deleted successfully'),
    });
  }

  function handlePreviousMonth() {
    setMonthKey((currentMonth) => shiftUtcMonth(currentMonth, -1));
    setOffset(0);
  }

  function handleNextMonth() {
    setMonthKey((currentMonth) => shiftUtcMonth(currentMonth, 1));
    setOffset(0);
  }

  function handleNextPage() {
    setOffset((currentOffset) => currentOffset + HABIT_LIST_LIMIT);
  }

  function handlePreviousPage() {
    setOffset((currentOffset) => Math.max(0, currentOffset - HABIT_LIST_LIMIT));
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <Badge>Habits</Badge>
          <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
            Monthly tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Build daily rhythm with UTC check-ins, visible streaks, and a monthly grid.
          </p>
        </div>
        <Button onClick={openCreateHabit}>
          <Plus aria-hidden="true" size={18} />
          Add habit
        </Button>
      </div>

      {pageMessage ? <Alert variant="success">{pageMessage}</Alert> : null}
      {pageError ? <Alert variant="error">{pageError}</Alert> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          helper="On this loaded page"
          icon={RefreshCcwDot}
          label="Checked in today"
          tone="success"
          value={`${summary.completedToday}/${habits.length}`}
        />
        <StatCard
          helper="Longest habit run"
          icon={RefreshCcwDot}
          label="Best streak"
          tone="info"
          value={`${summary.bestStreak}d`}
        />
        <StatCard
          helper="Selected UTC month"
          icon={RefreshCcwDot}
          label="Average completion"
          tone="primary"
          value={`${summary.averageCompletion}%`}
        />
      </div>

      <DashboardCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Previous month"
              disabled={habitsQuery.isFetching}
              onClick={handlePreviousMonth}
              size="icon"
              variant="secondary"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </Button>
            <div className="min-h-10 rounded-ui border border-border bg-surface px-4 py-2 text-sm font-bold text-body">
              {getMonthLabel(month.key)}
            </div>
            <Button
              aria-label="Next month"
              disabled={habitsQuery.isFetching}
              onClick={handleNextMonth}
              size="icon"
              variant="secondary"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </Button>
          </div>
          <Badge variant="muted">
            {habitsQuery.isFetching && !habitsQuery.isLoading ? 'Syncing' : 'UTC month'}
          </Badge>
        </div>
      </DashboardCard>

      {habitsQuery.isLoading ? (
        <LoadingState label="Loading habits..." />
      ) : habitsQuery.isError ? (
        <ErrorState
          message={getHabitErrorMessage(habitsQuery.error)}
          onRetry={habitsQuery.refetch}
          title="Could not load habits"
        />
      ) : habits.length === 0 ? (
        <EmptyState
          action={<Button onClick={openCreateHabit}>Create first habit</Button>}
          className="min-h-80 border-dashed bg-surface-muted/65 shadow-none"
          description="Add the first routine you want to make visible in your monthly tracker."
          title="Create your first habit"
        />
      ) : (
        <>
          <div className="grid gap-3 xl:grid-cols-2">
            {habits.map((habit) => (
              <HabitCard
                habit={habit}
                isMutating={isMutating}
                key={habit._id}
                onCheckInHabit={handleCheckInHabit}
                onDeleteHabit={handleDeleteHabit}
                onEditHabit={openEditHabit}
              />
            ))}
          </div>

          <HabitGrid habits={habits} month={month} />
        </>
      )}

      <DashboardCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm font-semibold text-muted">
            Showing {habits.length} of {pagination.total} habits
            {habitsQuery.isFetching && !habitsQuery.isLoading ? ' - Syncing...' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              disabled={!hasPreviousPage || habitsQuery.isFetching}
              onClick={handlePreviousPage}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={!hasNextPage || habitsQuery.isFetching}
              onClick={handleNextPage}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      </DashboardCard>

      <Modal isOpen={isCreateOpen} onClose={closeModal} title="Create habit">
        <HabitForm
          isSubmitting={habitMutations.createHabit.isPending}
          onCancel={closeModal}
          onSubmit={handleCreateHabit}
          serverError={formError}
        />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeModal} title="Edit habit">
        <HabitForm
          initialHabit={selectedHabit}
          isSubmitting={habitMutations.updateHabit.isPending}
          onCancel={closeModal}
          onSubmit={handleUpdateHabit}
          serverError={formError}
        />
      </Modal>
    </section>
  );
}
