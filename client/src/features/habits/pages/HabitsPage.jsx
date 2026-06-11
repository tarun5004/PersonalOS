import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';

export default function HabitsPage() {
  return (
    <PlaceholderPage
      eyebrow="Habits"
      sections={[
        { kicker: 'Daily', title: 'Check-In' },
        { kicker: 'Monthly', title: 'Habit Grid' },
        { kicker: 'Progress', title: 'Streaks' },
      ]}
      summary="A monthly view for simple daily check-ins, streaks, and consistency signals."
      title="Habits"
    />
  );
}

