import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';

export default function TasksPage() {
  return (
    <PlaceholderPage
      eyebrow="Tasks"
      sections={[
        { kicker: 'Status', title: 'Todo' },
        { kicker: 'Status', title: 'In Progress' },
        { kicker: 'Status', title: 'Completed' },
      ]}
      summary="A dedicated place for personal work, priorities, due dates, and completion status."
      title="Tasks"
    />
  );
}

