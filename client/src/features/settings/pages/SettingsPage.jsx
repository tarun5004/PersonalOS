import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';
import { ThemeToggle } from '../../theme/ThemeToggle.jsx';

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Settings"
      sections={[
        { kicker: 'Theme', title: 'Light' },
        { kicker: 'Theme', title: 'Dark' },
      ]}
      summary="A focused settings area for theme selection and basic authenticated user context."
      title="Settings"
    >
      <ThemeToggle />
    </PlaceholderPage>
  );
}
