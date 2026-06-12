import { useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';

const CHART_HEIGHT = 256;

function formatTooltipValue(value, label) {
  if (value === null || value === undefined) {
    return ['No activity', label];
  }

  return [`${Math.round(Number(value))}%`, label];
}

export function ScoreChart({
  data = [],
  dataKey = 'score',
  emptyTitle = 'No trend data yet',
  valueLabel = 'Score',
}) {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const node = chartRef.current;

    if (!node) {
      return undefined;
    }

    function syncWidth() {
      setChartWidth(Math.max(0, Math.floor(node.clientWidth)));
    }

    syncWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(syncWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  if (data.length === 0) {
    return (
      <EmptyState
        className="min-h-64 border border-dashed border-border bg-surface-elevated/60"
        description="Charts will populate when tracked activity is available."
        framed={false}
        icon={BarChart3}
        title={emptyTitle}
      />
    );
  }

  return (
    <div className="h-64 min-w-0 w-full">
      <div className="h-full min-w-0 w-full" ref={chartRef}>
        {chartWidth > 0 ? (
          <AreaChart
            data={data}
            height={CHART_HEIGHT}
            margin={{ bottom: 8, left: 2, right: 16, top: 18 }}
            width={chartWidth}
          >
            <defs>
              <linearGradient id="scoreChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.26} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 6" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              ticks={[0, 25, 50, 75, 100]}
              width={36}
            />
            <ReferenceLine
              ifOverflow="extendDomain"
              label={{
                fill: 'var(--color-text-muted)',
                fontSize: 11,
                fontWeight: 700,
                position: 'right',
                value: 'target',
              }}
              stroke="var(--color-text-muted)"
              strokeDasharray="3 5"
              y={70}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                color: 'var(--color-text)',
              }}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
              formatter={(value) => formatTooltipValue(value, valueLabel)}
            />
            <Area
              activeDot={{ fill: 'var(--color-accent)', r: 5, stroke: 'var(--color-surface)', strokeWidth: 2 }}
              connectNulls={false}
              dataKey={dataKey}
              dot={{ fill: 'var(--color-accent)', r: 2, stroke: 'var(--color-surface)', strokeWidth: 1 }}
              fill="url(#scoreChartFill)"
              stroke="var(--color-accent)"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        ) : null}
      </div>
    </div>
  );
}
