import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';

export function ScoreChart({ data = [], emptyTitle = 'No trend data yet' }) {
  if (data.length === 0) {
    return (
      <EmptyState
        className="min-h-64 border-dashed bg-surface-muted/60 shadow-none"
        description="Charts will populate when tracked activity is available."
        icon={BarChart3}
        title={emptyTitle}
      />
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ bottom: 0, left: -18, right: 8, top: 8 }}>
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
              borderRadius: '1rem',
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
      </ResponsiveContainer>
    </div>
  );
}
