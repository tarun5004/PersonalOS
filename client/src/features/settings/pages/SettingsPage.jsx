import { LogOut, Moon, Sun, UserCircle2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { DashboardCard } from '../../../components/shared/DashboardCard.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';
import { useTheme } from '../../theme/useTheme.js';
import { mergeClassNames } from '../../../lib/classNames.js';

const themeCards = [
  {
    value: 'light',
    title: 'Light',
    description: 'Bright canvas with soft cards and purple accents.',
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
  const { logout, user } = useAuth();
  const { setTheme, theme } = useTheme();
  const initials = user?.name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OS';

  return (
    <section className="grid gap-5">
      <div>
        <Badge>Settings</Badge>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3.15rem)] font-extrabold leading-tight text-body">
          Theme and preferences
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Tune the workspace appearance and review your signed-in profile context.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Appearance" action={<ThemeToggle compact />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {themeCards.map((themeCard) => (
              <button
                className={mergeClassNames(
                  'rounded-ui border bg-surface p-5 text-left transition hover:border-focus focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus/25',
                  theme === themeCard.value
                    ? 'border-primary shadow-card'
                    : 'border-border',
                )}
                key={themeCard.value}
                onClick={() => setTheme(themeCard.value)}
                type="button"
              >
                <span className="grid size-11 place-items-center rounded-ui bg-primary-soft text-primary-strong">
                  <themeCard.icon aria-hidden="true" size={19} />
                </span>
                <span className="mt-4 block text-lg font-extrabold text-body">{themeCard.title}</span>
                <span className="mt-2 block text-sm leading-6 text-muted">{themeCard.description}</span>
              </button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Profile">
          <div className="flex items-center gap-4 rounded-ui border border-border bg-surface-muted p-4">
            <div className="grid size-14 place-items-center rounded-ui bg-gradient-to-r from-primary to-focus text-lg font-extrabold text-primary-text">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="m-0 truncate text-base font-extrabold text-body">{user?.name || 'Personal OS user'}</p>
              <p className="mt-1 truncate text-sm text-muted">{user?.email || 'Signed in user'}</p>
            </div>
          </div>
          <div className="mt-4 rounded-ui border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <UserCircle2 className="mt-0.5 text-primary-strong" aria-hidden="true" size={20} />
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
