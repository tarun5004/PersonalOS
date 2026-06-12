import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { SCORE_TARGET, buildChartDays } from '../analyticsUtils.js';

const CHART_HEIGHT = 280;

function useMeasuredWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    function syncWidth() {
      setWidth(Math.max(0, Math.floor(node.clientWidth)));
    }

    syncWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(syncWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

function ChartFrame({ children, emptyTitle, hasData }) {
  const { ref, width } = useMeasuredWidth();

  if (!hasData) {
    return (
      <EmptyState
        className="min-h-72 border border-dashed border-border bg-surface-elevated/70"
        description="This chart will populate from tracked tasks and habits."
        framed={false}
        title={emptyTitle}
      />
    );
  }

  return (
    <div className="h-72 min-w-0 w-full" ref={ref}>
      {width > 0 ? children(width) : null}
    </div>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;
  const score = data.productivityScore === null ? 'No score' : `Score: ${data.productivityScore}`;

  return (
    <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-card">
      <p className="m-0 text-sm font-semibold text-body">
        {data.weekday}, {data.label}
      </p>
      <p className="m-0 mt-1 text-sm text-muted">
        {score} · Tasks: {data.taskCompleted} done · Habits: {Math.round(data.habitCompletionRate)}%
      </p>
    </div>
  );
}

function TaskTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-card">
      <p className="m-0 text-sm font-semibold text-body">
        {data.weekday}, {data.label}
      </p>
      <p className="m-0 mt-1 text-sm text-muted">
        {data.taskCompleted} of {data.taskTotal} tasks completed
      </p>
    </div>
  );
}

function HabitTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-card">
      <p className="m-0 text-sm font-semibold text-body">
        {data.weekday}, {data.label}
      </p>
      <p className="m-0 mt-1 text-sm text-muted">
        {data.habitCompleted} of {data.habitTotal} habits · {Math.round(data.habitCompletionRate)}%
      </p>
    </div>
  );
}

function CompletionBar({ fill, height, value, width, x, y }) {
  const hasValue = value > 0;
  const renderedHeight = hasValue ? height : 6;
  const renderedY = hasValue ? y : y - 6;

  return (
    <rect
      fill={hasValue ? fill : 'transparent'}
      height={renderedHeight}
      rx={6}
      stroke={hasValue ? fill : 'var(--bg-surface-3)'}
      strokeWidth={hasValue ? 0 : 1.5}
      width={width}
      x={x}
      y={renderedY}
    />
  );
}

export function ScoreTrendChart({ days }) {
  const data = buildChartDays(days);
  const hasData = data.some((day) => day.productivityScore !== null);

  return (
    <ChartFrame emptyTitle="No score trend yet" hasData={hasData}>
      {(width) => (
        <LineChart data={data} height={CHART_HEIGHT} margin={{ bottom: 0, left: 0, right: 8, top: 10 }} width={width}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
          <XAxis axisLine={false} dataKey="weekday" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} />
          <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine
            ifOverflow="extendDomain"
            label={{ fill: 'var(--text-tertiary)', position: 'right', value: 'target' }}
            stroke="var(--text-tertiary)"
            strokeDasharray="5 5"
            y={SCORE_TARGET}
          />
          <Line
            connectNulls={false}
            dataKey="productivityScore"
            dot={{ fill: 'var(--accent)', r: 4, stroke: 'var(--bg-surface)', strokeWidth: 2 }}
            stroke="var(--accent)"
            strokeWidth={2.5}
            type="monotone"
          />
        </LineChart>
      )}
    </ChartFrame>
  );
}

export function TaskCompletionBars({ days }) {
  const data = buildChartDays(days);
  const hasData = data.some((day) => day.taskTotal > 0);

  return (
    <ChartFrame emptyTitle="No task trend yet" hasData={hasData}>
      {(width) => (
        <BarChart data={data} height={CHART_HEIGHT} margin={{ bottom: 0, left: 0, right: 8, top: 10 }} width={width}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
          <XAxis axisLine={false} dataKey="weekday" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} width={36} />
          <Tooltip content={<TaskTooltip />} />
          <Bar
            dataKey="taskCompleted"
            fill="var(--accent)"
            maxBarSize={36}
            shape={(props) => <CompletionBar {...props} fill="var(--accent)" />}
          />
        </BarChart>
      )}
    </ChartFrame>
  );
}

export function HabitConsistencyBars({ days }) {
  const data = buildChartDays(days);
  const hasData = data.some((day) => day.habitTotal > 0);

  return (
    <ChartFrame emptyTitle="No habit trend yet" hasData={hasData}>
      {(width) => (
        <BarChart data={data} height={CHART_HEIGHT} margin={{ bottom: 0, left: 0, right: 8, top: 10 }} width={width}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
          <XAxis axisLine={false} dataKey="weekday" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} />
          <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickLine={false} width={36} />
          <Tooltip content={<HabitTooltip />} />
          <Bar
            dataKey="habitCompletionRate"
            fill="var(--habit-done)"
            maxBarSize={36}
            shape={(props) => <CompletionBar {...props} fill="var(--habit-done)" />}
          />
        </BarChart>
      )}
    </ChartFrame>
  );
}
