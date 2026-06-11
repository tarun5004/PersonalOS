import { useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';

const CHART_HEIGHT = 256;

export function ScoreChart({ data = [], emptyTitle = 'No trend data yet' }) {
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
        className="min-h-64 border border-dashed border-border bg-surface-muted/60"
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
            margin={{ bottom: 0, left: -18, right: 8, top: 8 }}
            width={chartWidth}
          >
            <defs>
              <linearGradient id="scoreChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.26} />
                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 6" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.8rem',
                color: 'var(--color-text-primary)',
              }}
            />
            <Area
              dataKey="score"
              fill="url(#scoreChartFill)"
              stroke="var(--color-primary)"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        ) : null}
      </div>
    </div>
  );
}
