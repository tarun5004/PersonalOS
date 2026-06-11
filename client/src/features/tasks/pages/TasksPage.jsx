import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../../components/ui/ErrorState.jsx';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { getTaskErrorMessage } from '../taskApi.js';
import { TASK_LIST_LIMIT } from '../taskConstants.js';
import { TaskFilters } from '../components/TaskFilters.jsx';
import { TaskForm } from '../components/TaskForm.jsx';
import { TaskList } from '../components/TaskList.jsx';
import { useTaskMutations, useTasks } from '../useTasks.js';

function getVisibleTasks(tasks, { search, status }) {
  const normalizedSearch = search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesStatus = status === 'All' || task.status === status;
    const matchesSearch =
      !normalizedSearch ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      (task.description || '').toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
}

export default function TasksPage() {
  const [offset, setOffset] = useState(0);
  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formError, setFormError] = useState('');
  const [pageMessage, setPageMessage] = useState('');
  const [pageError, setPageError] = useState('');
  const tasksQuery = useTasks({ limit: TASK_LIST_LIMIT, offset });
  const taskMutations = useTaskMutations();

  const tasks = tasksQuery.data?.tasks || [];
  const pagination = tasksQuery.data?.pagination || {
    limit: TASK_LIST_LIMIT,
    offset,
    total: 0,
  };
  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, { search, status: activeStatus }),
    [activeStatus, search, tasks],
  );
  const isMutating = Object.values(taskMutations).some((mutation) => mutation.isPending);
  const isCreateOpen = modalMode === 'create';
  const isEditOpen = modalMode === 'edit';
  const hasNextPage = pagination.offset + pagination.limit < pagination.total;
  const hasPreviousPage = pagination.offset > 0;

  function openCreateTask() {
    setSelectedTask(null);
    setFormError('');
    setModalMode('create');
  }

  function openEditTask(task) {
    setSelectedTask(task);
    setFormError('');
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setSelectedTask(null);
    setFormError('');
  }

  function handleCreateTask(values) {
    setFormError('');
    setPageError('');
    taskMutations.createTask.mutate(values, {
      onError: (error) => setFormError(getTaskErrorMessage(error)),
      onSuccess: () => {
        closeModal();
        setPageMessage('Task created successfully');
      },
    });
  }

  function handleUpdateTask(values) {
    if (!selectedTask) {
      return;
    }

    setFormError('');
    setPageError('');
    taskMutations.updateTask.mutate(
      { taskId: selectedTask._id, values },
      {
        onError: (error) => setFormError(getTaskErrorMessage(error)),
        onSuccess: () => {
          closeModal();
          setPageMessage('Task updated successfully');
        },
      },
    );
  }

  function handleCompleteTask(task) {
    setPageError('');
    taskMutations.completeTask.mutate(task._id, {
      onError: (error) => setPageError(getTaskErrorMessage(error)),
      onSuccess: () => setPageMessage('Task completed successfully'),
    });
  }

  function handleDeleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setPageError('');
    taskMutations.deleteTask.mutate(task._id, {
      onError: (error) => setPageError(getTaskErrorMessage(error)),
      onSuccess: () => setPageMessage('Task deleted successfully'),
    });
  }

  function handleStatusChange(nextStatus) {
    setActiveStatus(nextStatus);
  }

  function handleNextPage() {
    setOffset((currentOffset) => currentOffset + TASK_LIST_LIMIT);
  }

  function handlePreviousPage() {
    setOffset((currentOffset) => Math.max(0, currentOffset - TASK_LIST_LIMIT));
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <Badge>Tasks</Badge>
          <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-tight text-body">
            Personal task list
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A quiet task board with clear status lanes, priority, due dates, and progress.
          </p>
        </div>
        <Button onClick={openCreateTask}>
          <Plus aria-hidden="true" size={18} />
          Add task
        </Button>
      </div>

      {pageMessage ? (
        <Alert variant="success">
          {pageMessage}
        </Alert>
      ) : null}
      {pageError ? <Alert variant="error">{pageError}</Alert> : null}

      <DashboardCard className="p-4">
        <TaskFilters
          activeStatus={activeStatus}
          onSearchChange={setSearch}
          onStatusChange={handleStatusChange}
          search={search}
        />
      </DashboardCard>

      {tasksQuery.isLoading ? (
        <LoadingState label="Loading tasks..." />
      ) : tasksQuery.isError ? (
        <ErrorState
          message={getTaskErrorMessage(tasksQuery.error)}
          onRetry={tasksQuery.refetch}
          title="Could not load tasks"
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          action={<Button onClick={openCreateTask}>Create first task</Button>}
          className="min-h-80 border-dashed bg-surface-muted/65 shadow-none"
          description="Create your first task to begin turning plans into visible next actions."
          title="Create your first task"
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          className="min-h-72 border-dashed bg-surface-muted/65 shadow-none"
          description="Adjust the filter or search term to find tasks in this page."
          title="No matching tasks"
        />
      ) : (
        <TaskList
          activeStatus={activeStatus}
          isMutating={isMutating}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={openEditTask}
          tasks={visibleTasks}
        />
      )}

      <DashboardCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm font-semibold text-muted">
            Showing {tasks.length} of {pagination.total} tasks
            {tasksQuery.isFetching && !tasksQuery.isLoading ? ' - Syncing...' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button disabled={!hasPreviousPage || tasksQuery.isFetching} onClick={handlePreviousPage} variant="secondary">
              Previous
            </Button>
            <Button disabled={!hasNextPage || tasksQuery.isFetching} onClick={handleNextPage} variant="secondary">
              Next
            </Button>
          </div>
        </div>
      </DashboardCard>

      <Modal isOpen={isCreateOpen} onClose={closeModal} title="Create task">
        <TaskForm
          isSubmitting={taskMutations.createTask.isPending}
          onCancel={closeModal}
          onSubmit={handleCreateTask}
          serverError={formError}
        />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeModal} title="Edit task">
        <TaskForm
          initialTask={selectedTask}
          isSubmitting={taskMutations.updateTask.isPending}
          onCancel={closeModal}
          onSubmit={handleUpdateTask}
          serverError={formError}
        />
      </Modal>
    </section>
  );
}
