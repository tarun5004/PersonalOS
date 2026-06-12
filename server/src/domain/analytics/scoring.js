export function roundPercentage(value) {
  return Number(value.toFixed(2));
}

export function calculateCompletionRate(completed, total) {
  if (total === 0) {
    return 0;
  }

  return roundPercentage((completed / total) * 100);
}

export function calculateProductivityScore({
  taskCompletionRate,
  taskTotal,
  habitCompletionRate,
  habitTotal,
}) {
  const hasTasks = taskTotal > 0;
  const hasHabits = habitTotal > 0;

  if (!hasTasks && !hasHabits) {
    return null;
  }

  if (hasTasks && !hasHabits) {
    return taskCompletionRate;
  }

  if (!hasTasks && hasHabits) {
    return habitCompletionRate;
  }

  return roundPercentage(taskCompletionRate * 0.5 + habitCompletionRate * 0.5);
}
