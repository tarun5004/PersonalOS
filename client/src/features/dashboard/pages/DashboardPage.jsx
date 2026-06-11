import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { CalendarSummaryCard } from '../../../components/shared/CalendarSummaryCard.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { NotificationCard } from '../../../components/shared/NotificationCard.jsx';
import { StatCard } from '../../../components/shared/StatCard.jsx';
import { TaskCard } from '../../../components/shared/TaskCard.jsx';
import { useAuth } from '../../auth/useAuth.js';

const featureCards = [
  {
    title: 'Stay organized',
    detail: 'Tasks, habits, and daily priorities stay in one calm workspace.',
  },
  {
    title: 'Track consistency',
    detail: 'Habit check-ins and weekly signals keep progress visible.',
  },
  {
    title: 'Review momentum',
    detail: 'Weekly analytics summarize what is moving and what needs care.',
  },
];

const tasks = [
  {
    title: 'Plan today',
    due: 'Morning focus',
    progress: 90,
    tag: 'Plan',
  },
  {
    title: 'Review habits',
    due: 'Daily check-in',
    progress: 55,
    tag: 'Habit',
  },
  {
    title: 'Close the loop',
    due: 'Evening review',
    progress: 30,
    tag: 'Review',
  },
];

function getFirstName(name) {
  return name?.split(' ')[0] || 'there';
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,1.28fr)_150px_150px] xl:grid-cols-[minmax(320px,1.45fr)_160px_160px_160px_160px]">
        <div>
          <Badge>Dashboard</Badge>
          <h1 className="mt-4 max-w-xl text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.09] tracking-normal text-body">
            Hi, {getFirstName(user?.name)}! What are your plans for today?
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted">
            A focused workspace for daily planning, habit consistency, and weekly progress.
          </p>
        </div>

        <DashboardCard className="grid min-h-36 place-items-center border-dashed bg-primary-soft/35 xl:min-h-40">
          <Button aria-label="Add quick item" className="size-10 rounded-ui p-0">
            +
          </Button>
        </DashboardCard>

        {featureCards.map((card) => (
          <DashboardCard className="min-h-36 xl:min-h-40" key={card.title}>
            <div className="mb-4 grid size-11 place-items-center rounded-ui bg-primary-soft text-lg font-extrabold text-primary-strong">
              {card.title.charAt(0)}
            </div>
            <h2 className="text-sm font-extrabold text-body">{card.title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted">{card.detail}</p>
          </DashboardCard>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1.05fr]">
        <DashboardCard
          action={<button className="text-xs font-bold text-muted" type="button">Clear</button>}
          className="bg-[linear-gradient(180deg,var(--theme-surface),var(--theme-primary-soft))]"
          title="Notifications"
        >
          <div className="grid gap-3">
            <NotificationCard
              badge="Today"
              detail="Landing design review and daily planning stay visible here."
              title="Upcoming focus block"
            />
            <NotificationCard
              badge="Note"
              detail="Keep decisions close to the work they support."
              title="Message | Product design"
            />
          </div>
        </DashboardCard>

        <DashboardCard
          action={<button className="text-xs font-bold text-muted" type="button">Edit</button>}
          title="Assignments"
        >
          <div className="rounded-ui bg-surface-muted p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-primary-strong">Motion design</p>
                <h3 className="mt-2 text-base font-extrabold text-body">
                  Shape the next dashboard slice
                </h3>
              </div>
              <Badge variant="danger">High</Badge>
            </div>
            <Button className="mt-5 w-full" variant="secondary">
              Add next item
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard title="This week">
          <CalendarSummaryCard />
        </DashboardCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.56fr_1.1fr]">
        <DashboardCard title="Today tasks">
          <div className="grid gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.title} {...task} />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="grid content-between bg-gradient-to-b from-primary to-focus text-primary-text">
          <div>
            <p className="text-sm font-bold text-primary-text/75">Focus rhythm</p>
            <h2 className="mt-3 text-2xl font-extrabold">Keep the streak warm.</h2>
            <p className="mt-3 text-sm leading-6 text-primary-text/80">
              Small daily check-ins make the system useful before the week gets noisy.
            </p>
          </div>
          <Button className="mt-6" variant="dark">
            Review today
          </Button>
        </DashboardCard>

        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard helper="Habit check-ins done" label="Data research" tone="success" value="90%" />
            <StatCard helper="Tasks completed today" label="UX/UI design" tone="warning" value="65%" />
          </div>
          <DashboardCard
            action={<button className="text-xs font-bold text-muted" type="button">Edit</button>}
            title="Weekly review"
          >
            <p className="text-sm leading-6 text-muted">
              A compact place for current focus, personal notes, and the weekly review prompt.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="sm" variant="secondary">
                Open notes
              </Button>
              <Button size="sm">Plan next</Button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </section>
  );
}
