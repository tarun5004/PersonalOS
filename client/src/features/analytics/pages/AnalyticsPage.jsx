import { Activity, BarChart3, CheckCircle2, RefreshCcwDot } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { ScoreChart } from '../../../components/shared/ScoreChart.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';

export default function AnalyticsPage() {
  return (
    <section className="grid gap-5">
      <div>
        <Badge>Analytics</Badge>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-body">
          Weekly productivity trends
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          A focused analytics view for task completion, habit consistency, and weekly score trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard helper="No completed task data yet" icon={CheckCircle2} label="Task completion" value="--" />
        <StatCard helper="No check-ins yet" icon={RefreshCcwDot} label="Habit consistency" tone="success" value="--" />
        <StatCard helper="Score needs activity" icon={Activity} label="Productivity score" tone="warning" value="--" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardCard title="Score trend">
          <ScoreChart />
        </DashboardCard>

        <DashboardCard title="Recent activity">
          <EmptyState
            className="min-h-64 border-dashed bg-surface-muted/70 shadow-none"
            description="Task completions and habit check-ins will appear here as activity is tracked."
            icon={BarChart3}
            title="No activity recorded"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardCard title="Tasks completed per day">
          <ScoreChart emptyTitle="No task trend yet" />
        </DashboardCard>
        <DashboardCard title="Habit check-ins per day">
          <ScoreChart emptyTitle="No habit trend yet" />
        </DashboardCard>
      </div>
    </section>
  );
}
