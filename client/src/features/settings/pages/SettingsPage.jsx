import { useRef, useState } from 'react';
import {
  Award,
  Camera,
  Flame,
  Gauge,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  UserCircle2,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { AvatarDisplay } from '../../../components/shared/AvatarDisplay.jsx';
import { AvatarPicker } from '../../../components/shared/AvatarPicker.jsx';
import { AnimatedNumber } from '../../../components/shared/AnimatedNumber.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { useDashboardSummary } from '../../dashboard/useDashboardSummary.js';
import {
  calculateTodayXp,
  getAchievements,
  getLevelProgress,
} from '../../gamification/gamificationUtils.js';
import { HABIT_LIST_LIMIT } from '../../habits/habitConstants.js';
import { useHabits } from '../../habits/useHabits.js';
import { useAuth } from '../../auth/useAuth.js';
import { usePomodoro } from '../../pomodoro/usePomodoro.js';
import { PomodoroSettings } from '../../pomodoro/components/PomodoroSettings.jsx';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';
import { useTheme } from '../../theme/useTheme.js';
import { mergeClassNames } from '../../../lib/classNames.js';

const themeCards = [
  {
    value: 'light',
    title: 'Light',
    description: 'Neutral canvas with clear cards and a restrained teal accent.',
    icon: Sun,
  },
  {
    value: 'dark',
    title: 'Dark',
    description: 'Deep canvas with calm contrast for evening planning.',
    icon: Moon,
  },
];

export default function SettingsPage() {
  const { logout, updateAvatarId, uploadAvatar, user } = useAuth();
  const { setTheme, theme } = useTheme();
  const { dailyCount } = usePomodoro();
  const summaryQuery = useDashboardSummary();
  const habitsQuery = useHabits({ limit: HABIT_LIST_LIMIT, offset: 0 });
  const fileInputRef = useRef(null);
  const [uploadState, setUploadState] = useState({ status: 'idle', message: '' });
  const summary = summaryQuery.data;
  const habits = habitsQuery.data?.habits || [];
  const todayXp = calculateTodayXp({ dailyFocusCount: dailyCount, summary });
  const level = getLevelProgress((user?.xp || 0) + todayXp);
  const achievements = getAchievements({ dailyFocusCount: dailyCount, habits, summary });
  const unlockedAchievementCount = achievements.filter((achievement) => achievement.unlocked).length;
  const habitTotal = summary?.habits?.total || 0;
  const habitCompleted = summary?.habits?.completedToday || 0;
  const todayCompletion = habitTotal === 0 ? 0 : Math.round((habitCompleted / habitTotal) * 100);

  async function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadState({ status: 'error', message: 'Choose a PNG, JPG, or WebP image.' });
      return;
    }

    setUploadState({ status: 'loading', message: 'Uploading avatar...' });

    try {
      const dataUrl = await readFileAsDataUrl(file);
      await uploadAvatar(dataUrl);
      setUploadState({ status: 'success', message: 'Avatar uploaded and optimized with Cloudinary.' });
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error.message || 'Could not upload avatar.',
      });
    } finally {
      event.target.value = '';
    }
  }

  return (
    <section className="grid gap-5">
      <div>
        <Badge>Settings</Badge>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-body">
          Theme and preferences
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Tune the workspace appearance and review your signed-in profile context.
        </p>
      </div>

      <PomodoroSettings />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Appearance" action={<ThemeToggle compact />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {themeCards.map((themeCard) => (
              <button
                className={mergeClassNames(
                  'rounded-card border bg-surface p-5 text-left transition hover:border-accent focus-visible:outline-none focus-visible:shadow-focus',
                  theme === themeCard.value
                    ? 'border-accent bg-accent-soft shadow-card'
                    : 'border-border',
                )}
                key={themeCard.value}
                onClick={() => setTheme(themeCard.value)}
                type="button"
              >
                <span className="grid size-11 place-items-center rounded-card bg-accent-soft text-accent-strong">
                  <themeCard.icon aria-hidden="true" size={19} />
                </span>
                <span className="mt-4 block text-lg font-bold text-body">{themeCard.title}</span>
                <span className="mt-2 block text-sm leading-6 text-muted">{themeCard.description}</span>
              </button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Profile">
          <div className="rounded-card border border-border bg-surface-elevated p-4">
            <div className="flex items-center gap-4">
              <div
                className="relative grid size-24 shrink-0 place-items-center rounded-full p-1"
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
                <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full border border-border bg-surface px-2 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-accent shadow-card">
                  Lv {level.level}
                </span>
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-base font-bold text-body">{user?.name || 'Personal OS user'}</p>
                <p className="mt-1 truncate text-sm text-muted">{user?.email || 'Signed in user'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={todayCompletion === 100 && habitTotal > 0 ? 'success' : 'muted'}>
                    {habitCompleted}/{habitTotal} habits today
                  </Badge>
                  <Badge variant={dailyCount > 0 ? 'success' : 'muted'}>{dailyCount} focus sessions</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ProfileMetric
                icon={Sparkles}
                label="XP today"
                prefix="+"
                value={todayXp}
              />
              <ProfileMetric
                icon={Award}
                label="Achievements"
                suffix={`/${achievements.length}`}
                value={unlockedAchievementCount}
              />
              <ProfileMetric
                icon={Flame}
                label="Current streak"
                suffix="d"
                value={summary?.currentStreak || 0}
              />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.max(4, level.progress)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-muted">
              <span>{level.remainingXp} XP to next level</span>
              <span className="inline-flex items-center gap-1 text-accent">
                <Gauge aria-hidden="true" size={14} />
                {todayCompletion}% habit signal
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            <AvatarPicker
              label="Profile avatar"
              onChange={updateAvatarId}
              value={user?.avatarId}
            />
            <div className="mt-4 rounded-card border border-border bg-surface-elevated p-3">
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleAvatarFileChange}
                ref={fileInputRef}
                type="file"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-body">Custom Cloudinary avatar</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Uploads are delivered with optimized Cloudinary URLs when server env is configured.
                  </p>
                </div>
                <Button
                  disabled={uploadState.status === 'loading'}
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="secondary"
                >
                  <Camera aria-hidden="true" size={15} />
                  {uploadState.status === 'loading' ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              {uploadState.message ? (
                <p
                  className={mergeClassNames(
                    'mt-3 text-xs font-semibold',
                    uploadState.status === 'error' && 'text-danger',
                    uploadState.status === 'success' && 'text-success',
                    uploadState.status === 'loading' && 'text-muted',
                  )}
                >
                  {uploadState.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <UserCircle2 className="mt-0.5 text-accent-strong" aria-hidden="true" size={20} />
              <p className="m-0 text-sm leading-6 text-muted">
                Profile details are shown for account context. Appearance controls are available for this workspace.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Account">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="m-0 max-w-2xl text-sm leading-6 text-muted">
            Sign out of this browser when you finish planning or reviewing your workspace.
          </p>
          <Button onClick={logout} variant="dark">
            <LogOut aria-hidden="true" size={17} />
            Log out
          </Button>
        </div>
      </DashboardCard>
    </section>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(new Error('Could not read avatar file.')));
    reader.readAsDataURL(file);
  });
}

function ProfileMetric({ icon: Icon, label, prefix = '', suffix = '', value }) {
  return (
    <div className="rounded-card border border-border bg-surface px-3 py-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
        <Icon aria-hidden="true" size={14} />
        {label}
      </div>
      <p className="mt-2 text-xl font-black text-body">
        <AnimatedNumber end={value} prefix={prefix} suffix={suffix} />
      </p>
    </div>
  );
}
