import { Award, Flame, Play, Sparkles, Zap } from 'lucide-react';
import { AnimatedNumber } from '../../../components/shared/AnimatedNumber.jsx';
import { AvatarDisplay } from '../../../components/shared/AvatarDisplay.jsx';
import { MotionCard } from '../../../components/shared/MotionCard.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { mergeClassNames } from '../../../lib/classNames.js';
import {
  calculateFocusScore,
  calculateTodayXp,
  getAchievements,
  getLevelProgress,
} from '../../gamification/gamificationUtils.js';
import { getFirstName } from '../dashboardUtils.js';

export function DashboardHero({
  dailyFocusCount,
  focusSettings,
  onStartFocus,
  pomodoroStatus,
  summary,
  tasks,
  habits,
  user,
}) {
  const todayXp = calculateTodayXp({ dailyFocusCount, summary });
  const level = getLevelProgress((user?.xp || 0) + todayXp);
  const focusScore = calculateFocusScore({
    dailyFocusCount,
    productivityScore: summary?.productivityScore,
  });
  const achievements = getAchievements({ dailyFocusCount, summary, tasks, habits });
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
  const isFocusActive = pomodoroStatus && pomodoroStatus !== 'idle';

  return (
    <section className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-floating">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_60%_30%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--accent)_12%,transparent),transparent)] xl:block" />
      <div className="relative grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <div
                aria-hidden="true"
                className="grid size-24 place-items-center rounded-full p-1"
                style={{
                  background: `conic-gradient(var(--accent) ${level.progress}%, var(--bg-surface-3) 0)`,
                }}
              >
                <AvatarDisplay
                  avatarId={user?.avatarId}
                  avatarUrl={user?.avatarUrl}
                  className="size-[5.25rem] rounded-full"
                  label={`${user?.name || 'Personal OS user'} avatar`}
                  size="lg"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-accent shadow-card">
                Lv {level.level}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Personal command center
              </p>
              <h1 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-black leading-none text-body">
                Hi, {getFirstName(user?.name)}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Your OS is tracking today&apos;s pressure: streaks, tasks, focus sessions, and unlock progress.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <HeroMetric icon={Zap} label="XP today" value={todayXp} prefix="+" detail={`${level.remainingXp} XP to next level`} />
            <HeroMetric icon={Flame} label="Current streak" value={summary?.currentStreak || 0} suffix="d" detail="Identity momentum" />
            <HeroMetric icon={Sparkles} label="Focus score" value={focusScore} detail={`${dailyFocusCount} focus blocks`} />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-card border border-border bg-surface-elevated p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
                  {isFocusActive ? 'Continue focus session' : 'Next deep work block'}
                </p>
                <p className="mt-2 text-2xl font-black text-body">
                  {isFocusActive ? 'Timer is active' : `${focusSettings?.focusDuration || 25} min`}
                </p>
              </div>
              <Button onClick={onStartFocus} size="sm">
                <Play aria-hidden="true" size={15} />
                {isFocusActive ? 'Open' : 'Start'}
              </Button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.max(8, level.progress)}%` }}
              />
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">Achievements</p>
              <span className="text-xs font-bold text-accent">{unlockedCount}/{achievements.length}</span>
            </div>
            <div className="mt-3 grid gap-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div
                  className={mergeClassNames(
                    'flex items-center gap-2 rounded-card border px-3 py-2 text-xs font-bold',
                    achievement.unlocked
                      ? 'border-accent bg-accent-soft text-accent-strong'
                      : 'border-border bg-surface-elevated text-muted',
                  )}
                  key={achievement.id}
                >
                  <Award aria-hidden="true" size={14} />
                  {achievement.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ detail, icon: Icon, label, prefix = '', suffix = '', value }) {
  return (
    <MotionCard className="bg-surface-elevated p-4" transition="fast">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted">
        <Icon aria-hidden="true" size={15} />
        {label}
      </div>
      <p className="mt-3 text-2xl font-black text-body">
        <AnimatedNumber end={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs font-semibold text-muted">{detail}</p>
    </MotionCard>
  );
}
