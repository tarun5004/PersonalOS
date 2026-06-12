import { LogOut, Moon, Sun, UserCircle2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { AvatarDisplay } from '../../../components/shared/AvatarDisplay.jsx';
import { AvatarPicker } from '../../../components/shared/AvatarPicker.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { useAuth } from '../../auth/useAuth.js';
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
  const { logout, updateAvatarId, user } = useAuth();
  const { setTheme, theme } = useTheme();

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
          <div className="flex items-center gap-4 rounded-card border border-border bg-surface-elevated p-4">
            <AvatarDisplay avatarId={user?.avatarId} label={`${user?.name || 'Personal OS user'} avatar`} size="lg" />
            <div className="min-w-0">
              <p className="m-0 truncate text-base font-bold text-body">{user?.name || 'Personal OS user'}</p>
              <p className="mt-1 truncate text-sm text-muted">{user?.email || 'Signed in user'}</p>
            </div>
          </div>
          <div className="mt-4 rounded-card border border-border bg-surface p-4">
            <AvatarPicker
              label="Profile avatar"
              onChange={updateAvatarId}
              value={user?.avatarId}
            />
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
