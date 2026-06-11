import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';

export default function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Dashboard"
      sections={[
        { kicker: 'Today', title: "Today's Tasks" },
        { kicker: 'Today', title: "Today's Habits" },
        { kicker: 'Weekly', title: 'Productivity Overview' },
      ]}
      summary="A focused workspace for daily planning, habit consistency, and weekly progress."
      title="Good to see you."
    />
  );
}

