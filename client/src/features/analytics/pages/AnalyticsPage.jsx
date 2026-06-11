import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';

export default function AnalyticsPage() {
  return (
    <PlaceholderPage
      eyebrow="Analytics"
      sections={[
        { kicker: 'Tasks', title: 'Completion Rate' },
        { kicker: 'Habits', title: 'Consistency' },
        { kicker: 'Weekly', title: 'Productivity Score' },
      ]}
      summary="A clear weekly view of task completion, habit consistency, and productivity trends."
      title="Analytics"
    />
  );
}

